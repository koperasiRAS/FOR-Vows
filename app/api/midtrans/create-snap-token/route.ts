import { NextRequest, NextResponse } from "next/server";
import Midtrans from "midtrans-client";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY ?? "";
const CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "";

// ── Zod schema ───────────────────────────────────────────────────────────────
const SnapTokenSchema = z.object({
  bookingId: z.string().min(1),
  customerName: z.string().min(1).max(200).trim(),
  customerEmail: z.string().email().trim().optional(),
  customerPhone: z.string().max(20).trim().optional(),
  items: z.array(z.unknown()).optional(),
  userId: z.string().uuid().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = SnapTokenSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Data tidak valid", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { bookingId, customerName, customerEmail, customerPhone, items, userId } = parsed.data;

    // [SECURITY] Recalculate amount server-side from DB — do not trust client-supplied amount
    // Also verify ownership: if order has user_id, it must match the requesting user
    const supabase = await createServiceClient();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("final_total, total_price, items, user_id, status, payment_status, snap_token, payment_token_created_at")
      .eq("order_code", bookingId)
      .single();

    if (orderError || !order) {
      console.error("[FORVows SnapToken] Order not found:", bookingId);
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    // [SECURITY] Ownership check — prevent unauthorized payment initiation
    // Guest orders (user_id = null) can be paid by anyone who has the order code
    if (order.user_id && order.user_id !== userId) {
      console.warn(`[FORVows SnapToken] Unauthorized payment attempt: order ${bookingId}, expected user ${order.user_id}, got ${userId}`);
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    // Use final_total (with discount) if available, fall back to total_price
    const amount = order.final_total ?? order.total_price;
    if (!amount) {
      console.error("[FORVows SnapToken] No amount found for order:", bookingId);
      return NextResponse.json({ success: false, error: "Invalid order amount" }, { status: 400 });
    }

    // [SECURITY] Task 1 & 6: Check if status is valid for payment
    // We reject if it's already paid, processing, or completed.
    if (!["pending", "cancelled", "expired"].includes(order.status) && order.payment_status !== "expired") {
      return NextResponse.json({ success: false, error: "Order is no longer eligible for payment." }, { status: 400 });
    }

    // [SECURITY] Task 1 & 7: Check if we can reuse an existing token
    const now = new Date();
    const tokenAgeMinutes = order.payment_token_created_at
      ? (now.getTime() - new Date(order.payment_token_created_at).getTime()) / 60000
      : Infinity;

    // Do NOT reuse old token if the order was somehow cancelled/expired
    if (order.snap_token && tokenAgeMinutes < 15 && order.status === "pending") {
      console.log(`[FORVows Sec] Reusing Snap token for ${bookingId} (Age: ${Math.round(tokenAgeMinutes)}m)`);
      return NextResponse.json({
        success: true,
        token: order.snap_token,
        orderId: bookingId,
      });
    }

    // Determine item details — prefer server-side items from DB, fall back to client-supplied
    const itemDetails = (order.items?.length ? order.items : items)?.map(
      (item: { name: string; price: number; priceValue?: number; quantity: number }) => ({
        id: item.name.split(/\s+/).join("-").toLowerCase(),
        name: item.name,
        price: item.price ?? item.priceValue,
        quantity: item.quantity,
      })
    ) ?? [];

    // Use Sandbox if not in production
    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const midtrans = new (Midtrans.Snap as any)({
      isProduction,
      serverKey: SERVER_KEY,
      clientKey: CLIENT_KEY,
    });

    const parameter = {
      transaction_details: {
        order_id: bookingId,
        gross_amount: Number(amount),
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: customerName.split(" ")[0] ?? customerName,
        last_name: customerName.split(" ").slice(1).join(" ") || "",
        email: customerEmail || `${bookingId}@forvows.com`,
        phone: customerPhone || "",
      },
      item_details: itemDetails,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const snapToken = await (midtrans as any).createTransactionToken(parameter);

    // [SECURITY] Task 7: Lock the token by saving it and the creation timestamp
    await supabase.from("orders").update({
      snap_token: snapToken,
      payment_token_created_at: now.toISOString(),
    }).eq("order_code", bookingId);

    return NextResponse.json({
      success: true,
      token: snapToken,
      orderId: bookingId,
    });
  } catch (error) {
    console.error("Midtrans error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create payment" },
      { status: 500 }
    );
  }
}
