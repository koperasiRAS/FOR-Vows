import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { createServiceClient, createClient as createServerClient } from "@/lib/supabase/server";
import { PACKAGES, getPackage } from "@/lib/packages";
import { calculateDiscount } from "@/lib/referrals";
import { checkRateLimit } from "@/lib/rate-limit";

// ── Rate limiting: 5 orders per IP per 10 minutes ───────────────────────────
const ORDER_RATE_LIMIT = 5;
const ORDER_RATE_WINDOW = 10 * 60 * 1000; // 10 minutes

function generateOrderCode(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  // L1: UUID fragment — 4 hex chars = 36^4 ≈ 1.6M combos vs 9K for 4-digit random
  const uuidFragment = randomUUID().replace(/-/g, "").slice(0, 4).toUpperCase();
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  return `FORV-${yyyy}${mm}${dd}-${uuidFragment}-${rand}`;
}

// ── Zod schema ───────────────────────────────────────────────────────────────
const OrderCreateSchema = z.object({
  templateSlug: z.string().optional(),
  packageKey: z.enum(["basic", "premium", "exclusive"]),
  groomName: z.string().min(1, "Nama pengantin pria wajib diisi").max(100).trim(),
  brideName: z.string().min(1, "Nama pengantin wanita wajib diisi").max(100).trim(),
  eventDate: z.string().optional(),
  phone: z
    .string()
    .min(8, "Nomor WhatsApp minimal 8 digit")
    .max(20, "Nomor WhatsApp maksimal 20 karakter")
    .regex(/^[+\d\s\-()]+$/, "Format nomor WhatsApp tidak valid")
    .trim(),
  story: z.string().max(2000, "Catatan maksimal 2000 karakter").trim().optional(),
  referralCode: z.string().max(50).trim().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // ── Rate limiting ────────────────────────────────────────────────────────
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

    const { templateSlug, packageKey, groomName, brideName, eventDate, phone, story, referralCode } =
      parsed.data;

    // Validate package
    const pkg = getPackage(packageKey);
    if (!pkg || !PACKAGES.some((p) => p.key === packageKey)) {
      return NextResponse.json(
        { success: false, error: "Invalid package" },
        { status: 400 }
      );
    }

    const orderCode = generateOrderCode();
    const totalPrice = pkg.priceValue;

    // Calculate referral discount server-side
    let discountAmount = 0;
    let discountNote: string | null = null;

    if (referralCode) {
      const discountResult = calculateDiscount(totalPrice, referralCode);
      if (discountResult) {
        discountAmount = discountResult.amount;
        discountNote = `${referralCode} — Diskon ${discountResult.referral.discountValue}%`;
      }
    }

    const finalTotal = totalPrice - discountAmount;

    // Get authenticated user (if any — guest checkout still works)
    let userId: string | null = null;
    try {
      const userSupabase = await createServerClient();
      const { data: { user } } = await userSupabase.auth.getUser();
      userId = user?.id ?? null;
    } catch {
      // Not authenticated — guest checkout
    }

    const supabase = await createServiceClient();

    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_code: orderCode,
        groom_name: groomName,
        bride_name: brideName,
        template: templateSlug ?? null,
        package_name: pkg.label,
        phone: phone,
        notes: story ?? null,
        status: "pending",
        created_at: new Date().toISOString(),
        items: [
          {
            id: `pkg-${packageKey}`,
            type: "package",
            name: `${pkg.label} Package`,
            price: pkg.priceLabel,
            priceValue: pkg.priceValue,
            quantity: 1,
          },
        ],
        total_price: totalPrice,
        discount_amount: discountAmount > 0 ? discountAmount : null,
        discount_note: discountNote,
        final_total: finalTotal,
        referral_code: referralCode ?? null,
        wedding_date: eventDate ?? null,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to save order" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderCode: data.order_code,
      orderId: data.id,
      finalTotal,
    });
  } catch (err) {
    console.error("Order create error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
