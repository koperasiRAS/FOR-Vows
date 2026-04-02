import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { getPackage } from "@/lib/packages";
import { calculateDiscount } from "@/lib/referrals";
import { checkRateLimit } from "@/lib/rate-limit";

// ── Rate limiting: 5 orders per IP per 10 minutes ────────────────────────────
const ORDER_RATE_LIMIT = 5;
const ORDER_RATE_WINDOW = 10 * 60 * 1000; // 10 minutes

function generateOrderCode(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const uuidFragment = randomUUID().replace(/-/g, "").slice(0, 4).toUpperCase();
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  return `FORV-${yyyy}${mm}${dd}-${uuidFragment}-${rand}`;
}

// ── Zod schema ───────────────────────────────────────────────────────────────
const OrderCreateSchema = z.object({
  templateSlug:    z.string().optional(),
  templateName:    z.string().optional(),
  packageId:       z.string().optional(), // basic | premium | exclusive (from frontend)
  packageKey:      z.string().optional(), // alias for packageId
  packageName:     z.string().optional(),
  brideName:       z.string().min(1, "Nama pengantin wanita wajib diisi").max(100).trim(),
  groomName:       z.string().min(1, "Nama pengantin pria wajib diisi").max(100).trim(),
  email:           z.string().email("Format email tidak valid").or(z.literal("")),
  phone:           z
    .string()
    .min(8, "Nomor WhatsApp minimal 8 digit")
    .max(20, "Nomor WhatsApp maksimal 20 karakter")
    .regex(/^[+\d\s\-()]+$/, "Format nomor WhatsApp tidak valid")
    .trim(),
  weddingDate:     z.string().optional(),
  akadTime:        z.string().optional(),
  receptionTime:   z.string().optional(),
  venue:           z.string().optional(),
  venueAddress:    z.string().max(500).optional(),
  coupleStory:     z.string().max(2000).optional(),
  referralCode:    z.string().max(50).trim().optional(),
  addOns:          z.array(z.string()).optional().default([]),
  addOnTotal:      z.number().optional(),
});

// ── Midtrans helpers ─────────────────────────────────────────────────────────

const MIDTRANS_BASE_URL =
  process.env.MIDTRANS_IS_PRODUCTION === "true"
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";

async function createMidtransSnapToken(params: {
  orderId: string;
  grossAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  itemName: string;
}): Promise<{ token: string | null; transactionId: string | null; error: string | null }> {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;

  if (!serverKey) {
    return { token: null, transactionId: null, error: "MIDTRANS_SERVER_KEY not set" };
  }

  try {
    const payload = {
      transaction_details: {
        order_id: params.orderId,
        gross_amount: params.grossAmount,
      },
      customer_details: {
        first_name: params.customerName,
        last_name: "",
        email: params.customerEmail || "noemail@forvows.com",
        phone: params.customerPhone,
      },
      item_details: [
        {
          id: params.orderId,
          price: params.grossAmount,
          quantity: 1,
          name: params.itemName,
        },
      ],
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/order-success`,
      },
    };

    const auth = Buffer.from(`${serverKey}:`).toString("base64");
    const res = await fetch(MIDTRANS_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      return { token: null, transactionId: null, error: `Midtrans ${res.status}: ${text}` };
    }

    const json = await res.json();
    return {
      token: json.token ?? null,
      transactionId: json.transaction_id ?? null,
      error: null,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { token: null, transactionId: null, error: msg };
  }
}

// ── Add-on labels ────────────────────────────────────────────────────────────

const ADD_ON_LABELS: Record<string, { name: string; price: number }> = {
  "domain-custom":      { name: "Domain Kustom (.com/.id)", price: 250000 },
  "express-delivery":   { name: "Rush Delivery (48 jam)",    price: 100000 },
  "premium-animation": { name: "Premium Animation",          price: 75000  },
  "extra-gallery":      { name: "Gallery Extra (+20 foto)",   price: 50000  },
  "digital-gift-qr":    { name: "QR Gift Uang Digital",       price: 25000  },
  "custom-guest-link":  { name: "Link Tamu Kustom",          price: 50000  },
};

// ── POST handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // ── Rate limiting ──────────────────────────────────────────────────────
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";
    if (!checkRateLimit(ip, ORDER_RATE_LIMIT, ORDER_RATE_WINDOW)) {
      return NextResponse.json(
        { success: false, error: "Terlalu banyak percobaan. Coba lagi dalam 10 menit." },
        { status: 429 }
      );
    }

    // ── Parse & validate body ──────────────────────────────────────────────
    const body = await request.json();
    const parsed = OrderCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Data tidak valid", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Resolve package: prefer packageId (frontend sends), fallback to packageKey
    const pkgKey = (data.packageId ?? data.packageKey ?? "basic") as "basic" | "premium" | "exclusive";
    const pkg = getPackage(pkgKey);
    const pkgName = data.packageName ?? pkg.label;
    const pkgPrice = pkg.priceValue;
    const addOnTotal = data.addOnTotal ?? 0;
    const addOnList = data.addOns ?? [];

    // Calculate referral discount on package price only
    let discountAmount = 0;
    let discountNote: string | null = null;

    if (data.referralCode) {
      const discountResult = calculateDiscount(pkgPrice, data.referralCode);
      if (discountResult) {
        discountAmount = discountResult.amount;
        discountNote = `${data.referralCode} — Diskon ${discountResult.referral.discountValue}%`;
      }
    }

    // Add-ons
    const addOnItems = addOnList.map((id) => {
      const info = ADD_ON_LABELS[id] ?? { name: id, price: 0 };
      return { id, name: info.name, price: info.price };
    });

    const finalTotal = (pkgPrice - discountAmount) + addOnTotal;
    const orderCode = generateOrderCode();

    // Get authenticated user (optional — guest checkout works)
    let userId: string | null = null;
    try {
      const { createClient: createServerClient } = await import("@/lib/supabase/server");
      const userSupabase = await createServerClient();
      const {
        data: { user },
      } = await userSupabase.auth.getUser();
      userId = user?.id ?? null;
    } catch {
      // Not authenticated — guest checkout
    }

    const supabase = await createServiceClient();

    // ── Insert order into Supabase ─────────────────────────────────────────
    const { data: order, error: dbError } = await supabase
      .from("orders")
      .insert({
        order_id:       orderCode,
        template_slug:  data.templateSlug ?? null,
        template_name:  data.templateName ?? null,
        package_id:     pkgKey,
        package_name:   pkgName,
        bride_name:     data.brideName,
        groom_name:     data.groomName,
        customer_email: data.email || null,
        customer_phone: data.phone,
        wedding_date:   data.weddingDate ?? null,
        venue:          data.venue ?? null,
        venue_address:  data.venueAddress ?? null,
        couple_story:   data.coupleStory ?? null,
        total_amount:   pkgPrice,
        add_ons:        addOnItems,
        status:         "pending_payment",
        payment_method: "pending",
        referral_code:  data.referralCode ?? null,
        discount_amount: discountAmount > 0 ? discountAmount : null,
        discount_note:   discountNote,
        final_total:     finalTotal,
        akad_time:      data.akadTime ?? null,
        reception_time: data.receptionTime ?? null,
        user_id:        userId,
      })
      .select()
      .single();

    if (dbError || !order) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { success: false, error: "Gagal menyimpan pesanan" },
        { status: 500 }
      );
    }

    // ── Attempt to create Midtrans Snap token ──────────────────────────────
    let snapToken: string | null = null;
    let midtransTransactionId: string | null = null;

    const itemName = `FOR Vows - Paket ${pkgName}${data.templateName ? ` (${data.templateName})` : ""}`;
    const grossAmount = finalTotal;

    const snapResult = await createMidtransSnapToken({
      orderId:        orderCode,
      grossAmount,
      customerName:   `${data.brideName} & ${data.groomName}`,
      customerEmail:   data.email || "noemail@forvows.com",
      customerPhone:  data.phone,
      itemName,
    });

    if (snapResult.token) {
      // Midtrans OK — update order with snap token
      snapToken = snapResult.token;
      midtransTransactionId = snapResult.transactionId;

      await supabase
        .from("orders")
        .update({
          snap_token:             snapToken,
          midtrans_order_id:     midtransTransactionId,
          payment_method:         "midtrans",
          updated_at:             new Date().toISOString(),
        })
        .eq("order_id", orderCode);
    } else {
      // Midtrans unavailable (e.g. account not yet approved in sandbox) — non-critical
      console.warn("[Midtrans] Snap token creation failed (non-critical):", snapResult.error);

      // Fall back to manual transfer
      await supabase
        .from("orders")
        .update({
          payment_method: "transfer_manual",
          updated_at:    new Date().toISOString(),
        })
        .eq("order_id", orderCode);
    }

    return NextResponse.json({
      success:    true,
      orderCode,
      orderId:    order.id,
      finalTotal,
      snapToken, // null if Midtrans unavailable → frontend shows manual transfer
      paymentMethod: snapToken ? "midtrans" : "transfer_manual",
    });
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
