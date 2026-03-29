import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Midtrans payment notification handler
// Logs payment events for admin review via WhatsApp/console
// In production, replace with Neon DB or Upstash to persist records
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signatureKey = request.headers.get("x/notification-signature-key");
    const serverKey = process.env.MIDTRANS_SERVER_KEY ?? "";

    // Verify signature to ensure request is from Midtrans
    const hash = crypto
      .createHash("sha512")
      .update(body + serverKey)
      .digest("hex");

    if (signatureKey && hash !== signatureKey) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 403 });
    }

    const notification = JSON.parse(body);

    const { order_id, transaction_status, payment_type, gross_amount } = notification;

    // Log for admin review — in MVP stage admin checks console/vercel logs
    // Later: store to Neon DB or Upstash
    console.log("[FORVows Payment]", JSON.stringify({
      bookingId: order_id,
      status: transaction_status,
      paymentType: payment_type,
      grossAmount: gross_amount,
      receivedAt: new Date().toISOString(),
    }));

    return NextResponse.json({ success: true, message: "Notification processed" });
  } catch (error) {
    console.error("[FORVows Payment Error]", error);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}
