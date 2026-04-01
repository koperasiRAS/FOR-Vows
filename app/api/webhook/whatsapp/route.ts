import { NextResponse } from 'next/server';

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: any;
  schema: string;
  old_record: any;
}

export async function POST(req: Request) {
  try {
    const payload: WebhookPayload = await req.json();

    if (payload.table !== 'orders' || payload.type !== 'INSERT') {
      return NextResponse.json({ message: 'Ignored: Not a new order' });
    }

    const order = payload.record;

    // 1. Format WhatsApp Message
    const message = `🚨 *Pesanan Baru Masuk!* 🚨\n\n` +
      `*Kode*: ${order.order_code}\n` +
      `*Klien*: ${order.groom_name} & ${order.bride_name}\n` +
      `*Paket*: ${order.package_name ?? '-'}\n` +
      `*Total*: Rp ${order.final_total ? order.final_total.toLocaleString('id-ID') : '-'}\n` +
      `*No WA Klien*: ${order.phone}\n\n` +
      `Cek detail di dasbor admin.`;

    // 2. Credentials Verification
    const FONNTE_API_TOKEN = process.env.FONNTE_API_TOKEN;
    const ADMIN_PHONE = process.env.ADMIN_WHATSAPP; // e.g. "0812345678"

    if (!FONNTE_API_TOKEN || !ADMIN_PHONE) {
      console.warn("Webhook Triggered: Missing FONNTE_API_TOKEN or ADMIN_WHATSAPP env vars.");
      return NextResponse.json({ message: 'WhatsApp sending skipped (Missing Credentials).' });
    }

    // 3. Send via Fonnte API
    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': FONNTE_API_TOKEN,
      },
      body: new URLSearchParams({
        target: ADMIN_PHONE,
        message: message,
      })
    });

    const result = await response.json();

    if (!response.ok || !result.status) {
      console.error("Fonnte API Error:", result);
      return NextResponse.json({ error: 'Failed to send WhatsApp message via Fonnte.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, detail: 'WhatsApp Sent!' });

  } catch (error: any) {
    console.error("Webhook processing error:", error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
