import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createServiceClient } from "@/lib/supabase/server";

// Midtrans payment notification handler
// Verifies SHA512 signature, validates amount, then updates Supabase orders table
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signatureKey = request.headers.get("x-notification-signature-key");
    const serverKey = process.env.MIDTRANS_SERVER_KEY ?? "";

    // [SECURITY] Signature is mandatory — reject if missing
    if (!signatureKey) {
      console.warn("[FORVows Payment] Missing signature — rejecting webhook");
      return NextResponse.json({ success: false, error: "Missing signature" }, { status: 403 });
    }

    const hash = crypto
      .createHash("sha512")
      .update(body + serverKey)
      .digest("hex");

    if (hash !== signatureKey) {
      console.warn("[FORVows Payment] Invalid signature — rejecting webhook");
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 403 });
    }

    const notification = JSON.parse(body);
    const {
      order_id,
      transaction_id,
      transaction_status,
      payment_type,
      gross_amount,
      fraud_status,
    } = notification;

    console.log("[FORVows Payment Webhook]", {
      order_id,
      transaction_status,
      payment_type,
      gross_amount,
      fraud_status,
      receivedAt: new Date().toISOString(),
    });

    if (!order_id) {
      return NextResponse.json({ success: false, error: "Missing order_id" }, { status: 400 });
    }

    const supabase = await createServiceClient();

    // Fetch the current order to validate amount and check idempotency
    const { data: existingOrder, error: fetchError } = await supabase
      .from("orders")
      .select("status, final_total, total_price, payment_status")
      .eq("order_code", order_id)
      .single();

    if (fetchError || !existingOrder) {
      console.warn(`[FORVows Payment] Order ${order_id} not found`);
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    // [SECURITY] Validate gross_amount matches the order total
    // Use final_total (with discount) if available, fall back to total_price
    const expectedAmount = existingOrder.final_total ?? existingOrder.total_price;
    if (expectedAmount && Number(gross_amount) !== Number(expectedAmount)) {
      console.error(
        `[FORVows Payment] Amount mismatch for ${order_id}: ` +
        `expected ${expectedAmount}, got ${gross_amount}`
      );
      return NextResponse.json(
        { success: false, error: "Amount mismatch" },
        { status: 400 }
      );
    }

    // [IDEMPOTENCY] Task 4: Explicit early return if already settled, completed, or explicitly cancelled
    if (
      existingOrder.status === "paid" ||
      existingOrder.status === "completed" ||
      existingOrder.status === "cancelled"
    ) {
      console.log(`[FORVows Sec] Order ${order_id} already in terminal state (${existingOrder.status}) — explicit early return`);
      return NextResponse.json({ success: true, message: "Already processed" });
    }

    // Map Midtrans transaction_status to our payment_status
    // https://docs.midtrans.com/after-payment/http-notification
    let paymentStatus: string;
    let settled = false;

    if (transaction_status === "capture" || transaction_status === "settlement") {
      paymentStatus = "paid";
      settled = true;
    } else if (transaction_status === "expire") {
      // Payment window closed without payment
      paymentStatus = "expired";
    } else if (transaction_status === "deny") {
      // Card issuer or provider rejected the payment
      paymentStatus = "failed";
    } else if (transaction_status === "pending") {
      paymentStatus = "pending";
    } else if (transaction_status === "challenge") {
      // 3DS/Secure Card — bank is still verifying asynchronously
      // Do NOT mark cancelled; keep as pending until bank resolves
      paymentStatus = "pending";
    } else {
      // Unknown status — log and default to pending (safer than cancelling)
      console.warn(`[FORVows Payment] Unknown transaction_status "${transaction_status}" for order ${order_id}`);
      paymentStatus = "pending";
    }

    // Build update payload — only set order status to "paid" when money is confirmed
    const updatePayload: Record<string, unknown> = { payment_status: paymentStatus };
    if (settled) {
      updatePayload.status = "paid";
      updatePayload.payment_method = "midtrans";
      updatePayload.paid_at = new Date().toISOString();
    } else if (transaction_status === "expire" || transaction_status === "deny") {
      // Terminal failure — move to cancelled
      updatePayload.status = "cancelled";
    }
    // Store Midtrans transaction_id for reconciliation
    if (transaction_id) {
      updatePayload.midtrans_order_id = transaction_id;
    }

    // [ATOMIC IDEMPOTENCY] Only update if still in a transitional state.
    // If status is already "paid" (double-fire race), the conditional update updates 0 rows.
    const { error: updateError, count } = await supabase
      .from("orders")
      .update(updatePayload)
      .eq("order_code", order_id)
      .neq("payment_status", "paid"); // skip if already settled

    if (updateError) {
      console.error("[FORVows Payment] DB update failed:", updateError);
      return NextResponse.json({ success: false, error: "DB update failed" }, { status: 500 });
    }

    if (count === 0) {
      // No rows updated — already settled or concurrent race
      console.log(`[FORVows Payment] Order ${order_id} no rows updated (already settled)`);
    } else {
      console.log(
        `[FORVows Payment] Order ${order_id} updated: ` +
        `payment_status=${paymentStatus}${settled ? ", status=paid" : ""}`
      );
    }
    return NextResponse.json({ success: true, message: "Notification processed" });

  } catch (error) {
    console.error("[FORVows Payment Error]", error);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}
