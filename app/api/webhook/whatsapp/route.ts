import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';

const WHATSAPP_RATE_LIMIT = 20;
const WHATSAPP_RATE_WINDOW = 60 * 1000; // 1 minute

// ── Zod schema ───────────────────────────────────────────────────────────────
const WebhookPayloadSchema = z.object({
  type: z.enum(['INSERT', 'UPDATE', 'DELETE']),
  table: z.string(),
  record: z.object({
    order_code: z.string().optional(),
    groom_name: z.string().optional(),
    bride_name: z.string().optional(),
    package_name: z.string().optional(),
    final_total: z.number().optional(),
    phone: z.string().optional(),
  }),
  schema: z.string(),
});

export async function POST(req: Request) {
  // ── Rate limiting (by Supabase webhook source IP) ──────────────────────────
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  if (!checkRateLimit(ip, WHATSAPP_RATE_LIMIT, WHATSAPP_RATE_WINDOW)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const rawPayload = await req.json();
    const parsed = WebhookPayloadSchema.safeParse(rawPayload);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
    }

    const payload = parsed.data;

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
