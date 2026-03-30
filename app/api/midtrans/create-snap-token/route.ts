import { NextRequest, NextResponse } from "next/server";
import Midtrans from "midtrans-client";
import { createServiceClient } from "@/lib/supabase/server";

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY ?? "";
const CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, customerName, customerEmail, customerPhone, items } = body;

    if (!bookingId || !customerName) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // [SECURITY] Recalculate amount server-side from DB — do not trust client-supplied amount
    const supabase = await createServiceClient();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("final_total, total_price, items")
      .eq("order_code", bookingId)
      .single();

    if (orderError || !order) {
      console.error("[FORVows SnapToken] Order not found:", bookingId);
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    // Use final_total (with discount) if available, fall back to total_price
    const amount = order.final_total ?? order.total_price;
    if (!amount) {
      console.error("[FORVows SnapToken] No amount found for order:", bookingId);
      return NextResponse.json({ success: false, error: "Invalid order amount" }, { status: 400 });
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
