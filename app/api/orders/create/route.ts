import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createServiceClient, createClient as createServerClient } from "@/lib/supabase/server";
import { PACKAGES, getPackage } from "@/lib/packages";
import { calculateDiscount } from "@/lib/referrals";

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      templateSlug,
      packageKey,
      groomName,
      brideName,
      eventDate,
      phone,
      story,
      referralCode,
    } = body;

    // Validate required fields
    if (!groomName?.trim() || !brideName?.trim() || !phone?.trim() || !packageKey) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate package
    const pkg = getPackage(packageKey);
    if (!PACKAGES.find((p) => p.key === packageKey)) {
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
    const normalizedCode = referralCode?.trim();

    if (normalizedCode) {
      const discountResult = calculateDiscount(totalPrice, normalizedCode);
      if (discountResult) {
        discountAmount = discountResult.amount;
        discountNote = `${normalizedCode} — Diskon ${discountResult.referral.discountValue}%`;
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
        groom_name: groomName.trim(),
        bride_name: brideName.trim(),
        template: templateSlug ?? null,
        package_name: pkg.label,
        phone: phone.trim(),
        notes: story?.trim() ?? null,
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
        referral_code: normalizedCode ?? null,
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
