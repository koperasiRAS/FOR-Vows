import { NextRequest, NextResponse } from "next/server";
import Midtrans from "midtrans-client";

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY ?? "";
const CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, customerName, customerEmail, customerPhone, amount, items } = body;

    if (!bookingId || !customerName || !amount) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Use Sandbox if not in production
    const isProduction = process.env.NODE_ENV === "production";
    const apiBaseUrl = isProduction
      ? "https://api.midtrans.com"
      : "https://api.sandbox.midtrans.com";

    const midtrans = new Midtrans.CoreApi({
      serverKey: SERVER_KEY,
      clientKey: CLIENT_KEY,
      apiBaseUrl,
    });

    const orderId = bookingId;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
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
      item_details: items?.map((item: { name: string; price: number; quantity: number }) => ({
        id: item.name.split(/\s+/).join("-").toLowerCase(),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })) ?? [],
    };

    const transaction = await midtrans.charge(parameter);

    // For Snap, we need to get the snap token
    // If token is returned directly, use it. Otherwise get from redirect_url
    const snapToken = (transaction as Record<string, unknown>).token as string | undefined;
    const redirectUrl = (transaction as Record<string, unknown>).redirect_url as string | undefined;

    return NextResponse.json({
      success: true,
      token: snapToken,
      redirectUrl,
      orderId,
    });
  } catch (error) {
    console.error("Midtrans error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create payment" },
      { status: 500 }
    );
  }
}
