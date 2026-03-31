import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient, createServiceClient } from "@/lib/supabase/server";

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
      // discountAmount, discountNote, finalTotal — ignored; always recalculated server-side
      referralCode,
      weddingDate,
    } = body;

    // Accept either groomName+brideName (OrderModal) or name (cart flow)
    const effectiveGroomName = groomName?.trim() ?? name?.trim() ?? null;
    const effectiveBrideName = brideName?.trim() ?? name?.trim() ?? null;

    if (!orderCode || !phone?.trim() || (!effectiveGroomName && !effectiveBrideName)) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ── Server-side discount recalculation ───────────────────────────────────
    // Never trust the client's discountAmount — recalculate from referral code.
    // This prevents a malicious client from inflating the discount to $0.
    const effectiveReferralCode = referralCode?.trim() ?? null;
    let serverDiscountAmount: number | null = null;
    let serverDiscountNote: string | null = null;

    if (effectiveReferralCode) {
      // Import referral logic dynamically to avoid circular issues
      const { calculateDiscount, validateReferralCode, formatDiscount } = await import("@/lib/referrals");
      const validation = validateReferralCode(effectiveReferralCode);
      if (validation.valid && validation.referral) {
        const total = totalPrice ?? 0;
        const discountResult = calculateDiscount(total, effectiveReferralCode);
        if (discountResult) {
          serverDiscountAmount = discountResult.amount;
          // Store note with discount detail for admin reference
          serverDiscountNote = `${validation.code} — ${formatDiscount(validation.referral, "id")}`;
        }
      }
      // If code is invalid, silently ignore it (no discount applied) rather than
      // rejecting the order — the client will have shown an error already.
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
        phone: phone.trim(),
        notes: notes?.trim() ?? null,
        status: "pending",
        created_at: new Date().toISOString(),
        // Cart-style fields — always use server-calculated discount
        items: items ?? null,
        total_price: totalPrice ?? null,
        discount_amount: finalDiscountAmount > 0 ? finalDiscountAmount : null,
        discount_note: finalDiscountNote,
        final_total: finalOrderTotal,
        referral_code: effectiveReferralCode,
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

// ── GET: list all orders (admin only) ───────────────────────────────────────
export async function GET(request: NextRequest) {
  const authUser = await requireAdminSession(request);
  if (authUser instanceof NextResponse) return authUser;

  try {
    const orderCode = request.nextUrl.searchParams.get("orderCode");
    const supabase = await createSupabaseClient();

    if (orderCode) {
      // Single order lookup
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("order_code", orderCode)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { success: false, error: "Order not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, order: data });
    }

    // Return all orders for admin dashboard
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch orders" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, orders: data ?? [] });
  } catch (err) {
    console.error("Order fetch error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ── PATCH: update order status (admin only) ──────────────────────────────────
export async function PATCH(request: NextRequest) {
  const authUser = await requireAdminSession(request);
  if (authUser instanceof NextResponse) return authUser;

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Missing id or status" },
        { status: 400 }
      );
    }

    const validStatuses = [
      "pending",
      "paid",
      "processing",
      "completed",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value" },
        { status: 400 }
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
