import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient as createSupabaseClient, createServiceClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";

// ── Rate limiting: 10 cart checkouts per IP per 10 minutes ───────────────────
const CART_RATE_LIMIT = 10;
const CART_RATE_WINDOW = 10 * 60 * 1000;

// ── Zod schemas ───────────────────────────────────────────────────────────────
const CartOrderSchema = z.object({
  orderCode: z.string().min(1).max(50).trim(),
  groomName: z.string().min(1).max(100).trim().optional(),
  brideName: z.string().min(1).max(100).trim().optional(),
  name: z.string().min(1).max(100).trim().optional(),
  template: z.string().max(100).trim().optional(),
  package: z.string().max(50).trim().optional(),
  phone: z
    .string()
    .min(8, "Nomor WhatsApp minimal 8 digit")
    .max(20)
    .regex(/^[+\d\s\-()]+$/, "Format nomor tidak valid")
    .trim(),
  notes: z.string().max(2000).trim().optional(),
  items: z.array(z.unknown()).optional(),
  totalPrice: z.number().min(0).optional(),
  referralCode: z.string().max(50).trim().optional(),
  weddingDate: z.string().max(30).trim().optional(),
});

const OrderStatusSchema = z.object({
  id: z.string().uuid("Invalid order ID"),
  status: z.enum(["pending", "paid", "processing", "completed", "cancelled"]),
});

// ── Auth guard: requires a valid Supabase session cookie ─────────────────────
async function requireAdminSession(request: NextRequest) {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
  return user;
}

// ── POST (public-facing — cart/OrderModal inserts new orders) ────────────────
// No auth required here; inserts go through service role via RLS.
export async function POST(request: NextRequest) {
  // ── Rate limiting ─────────────────────────────────────────────────────────
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  if (!checkRateLimit(ip, CART_RATE_LIMIT, CART_RATE_WINDOW)) {
    return NextResponse.json(
      { success: false, error: "Terlalu banyak percobaan. Coba lagi dalam 10 menit." },
      { status: 429 }
    );
  }

  let authUserId: string | null = null;
  try {
    const authCheck = await createSupabaseClient();
    const { data: { user } } = await authCheck.auth.getUser();
    authUserId = user?.id ?? null;
  } catch {
    // Not authenticated — guest cart checkout
  }

  try {
    const body = await request.json();
    const parsed = CartOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Data tidak valid", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const {
      orderCode,
      groomName,
      brideName,
      name,
      template,
      package: pkg,
      phone,
      notes,
      items,
      totalPrice,
      referralCode,
      weddingDate,
    } = parsed.data;

    // Accept either groomName+brideName (OrderModal) or name (cart flow)
    const effectiveGroomName = groomName ?? name ?? null;
    const effectiveBrideName = brideName ?? name ?? null;

    if (!effectiveGroomName && !effectiveBrideName) {
      return NextResponse.json(
        { success: false, error: "Nama pengantin wajib diisi." },
        { status: 400 }
      );
    }

    // ── Server-side discount recalculation ───────────────────────────────────
    // Never trust the client's discountAmount — recalculate from referral code.
    let serverDiscountAmount: number | null = null;
    let serverDiscountNote: string | null = null;

    if (referralCode) {
      const { calculateDiscount, validateReferralCode, formatDiscount } = await import("@/lib/referrals");
      const validation = validateReferralCode(referralCode);
      if (validation.valid && validation.referral) {
        const total = totalPrice ?? 0;
        const discountResult = calculateDiscount(total, referralCode);
        if (discountResult) {
          serverDiscountAmount = discountResult.amount;
          serverDiscountNote = `${validation.code} — ${formatDiscount(validation.referral, "id")}`;
        }
      }
    }

    // Use server-calculated values, not client-supplied ones
    const finalDiscountAmount = serverDiscountAmount ?? 0;
    const finalDiscountNote = serverDiscountNote;
    const finalOrderTotal = (totalPrice ?? 0) - finalDiscountAmount;

    const supabase = await createServiceClient();

    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_code: orderCode,
        groom_name: effectiveGroomName ?? "—",
        bride_name: effectiveBrideName ?? "—",
        template: template ?? null,
        package_name: pkg ?? null,
        phone: phone,
        notes: notes ?? null,
        status: "pending",
        created_at: new Date().toISOString(),
        // Cart-style fields — always use server-calculated discount
        items: items ?? null,
        total_price: totalPrice ?? null,
        discount_amount: finalDiscountAmount > 0 ? finalDiscountAmount : null,
        discount_note: finalDiscountNote,
        final_total: finalOrderTotal,
        referral_code: referralCode ?? null,
        wedding_date: weddingDate ?? null,
        user_id: authUserId,
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

    return NextResponse.json({ success: true, order: data });
  } catch (err) {
    console.error("Order API error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ── GET: list all orders (guest/user/admin) ───────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const orderCode = request.nextUrl.searchParams.get("orderCode");
    const supabase = await createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (orderCode) {
      // Single order lookup (used by order-success page)
      const serviceClient = await createServiceClient();
      const { data, error } = await serviceClient
        .from("orders")
        .select("*")
        .eq("order_code", orderCode)
        .single();

      if (error || !data) {
        return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
      }

      // [SECURITY] Phase 3: Ownership validation
      // If the order belongs to a user, the current session user MUST match it.
      if (data.user_id && data.user_id !== user?.id) {
        console.warn(`[FORVows Sec] Unauthorized GET: order ${orderCode} restricted to ${data.user_id}, but user is ${user?.id}`);
        return NextResponse.json({ success: false, error: "Forbidden: Not your order" }, { status: 403 });
      }

      return NextResponse.json({ success: true, order: data });
    }

    // List all orders (requires admin session)
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
    }

    return NextResponse.json({ success: true, orders: data ?? [] });
  } catch (err) {
    console.error("Order fetch error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// ── PATCH: update order status (admin only) ──────────────────────────────────
export async function PATCH(request: NextRequest) {
  const authUser = await requireAdminSession(request);
  if (authUser instanceof NextResponse) return authUser;

  try {
    const body = await request.json();
    const parsed = OrderStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Data tidak valid", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { id, status } = parsed.data;

    // [SECURITY] Admin cannot manually set 'paid' — only Midtrans webhook can confirm payment
    if (status === "paid") {
      return NextResponse.json(
        { success: false, error: "Cannot manually set paid status. Only Midtrans payment confirmation can do this." },
        { status: 403 }
      );
    }

    const supabase = await createServiceClient();

    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to update order" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, order: data });
  } catch (err) {
    console.error("Order update error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
