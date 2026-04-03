import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";

// ── Rate limiting: 5 orders per IP per 10 minutes ────────────────────────────
const ORDER_RATE_LIMIT = 5;
const ORDER_RATE_WINDOW = 10 * 60 * 1000;

function generateOrderCode(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const uuidFragment = randomUUID().replace(/-/g, "").slice(0, 4).toUpperCase();
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  return `FORV-${yyyy}${mm}${dd}-${uuidFragment}-${rand}`;
}

// ── Zod schemas per category ──────────────────────────────────────────────────

const BaseSchema = z.object({
  serviceCategory: z.enum(["undangan", "foto", "content", "souvenir"]),
  packageName: z.string().min(1).max(100).trim(),
  phone: z
    .string()
    .min(8, "Nomor WhatsApp minimal 8 digit")
    .max(20)
    .regex(/^[+\d\s\-()]+$/, "Format nomor WhatsApp tidak valid")
    .trim(),
  notes: z.string().max(3000).trim().optional(),
});

const UndanganSchema = BaseSchema.extend({
  serviceCategory: z.literal("undangan"),
  groomName: z.string().min(1, "Nama pengantin pria wajib diisi").max(100).trim(),
  brideName: z.string().min(1, "Nama pengantin wanita wajib diisi").max(100).trim(),
  akadDate: z.string().min(1, "Tanggal akad wajib diisi"),
  receptionDate: z.string().optional(),
  akadLocation: z.string().min(1, "Lokasi akad wajib diisi").max(300).trim(),
  receptionLocation: z.string().max(300).trim().optional(),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  templateSlug: z.string().optional(),
  templateName: z.string().optional(),
});

const FotoSchema = BaseSchema.extend({
  serviceCategory: z.literal("foto"),
  coupleName: z.string().min(1, "Nama pasangan wajib diisi").max(100).trim(),
  weddingDate: z.string().min(1, "Tanggal pernikahan wajib diisi"),
  venue: z.string().min(1, "Lokasi venue wajib diisi").max(300).trim(),
  estimasiTamu: z.string().optional(),
});

const ContentSchema = BaseSchema.extend({
  serviceCategory: z.literal("content"),
  coupleName: z.string().min(1, "Nama pasangan wajib diisi").max(100).trim(),
  eventType: z.string().min(1, "Jenis event wajib dipilih").max(100).trim(),
  eventDate: z.string().min(1, "Tanggal event wajib diisi"),
  eventLocation: z.string().min(1, "Lokasi event wajib diisi").max(300).trim(),
  igUsername: z.string().max(100).trim().optional(),
});

const SouvenirSchema = BaseSchema.extend({
  serviceCategory: z.literal("souvenir"),
  ordererName: z.string().min(1, "Nama pemesan wajib diisi").max(100).trim(),
  productId: z.string().min(1, "Produk wajib dipilih"),
  quantity: z.coerce.number().min(1, "Jumlah minimal 1").max(100000),
  souvenirName: z.string().min(1, "Nama yang dicetak wajib diisi").max(200).trim(),
  weddingDate: z.string().min(1, "Tanggal pernikahan wajib diisi"),
  themeColor: z.string().max(200).trim().optional(),
});

const OrderCreateSchema = z.discriminatedUnion("serviceCategory", [
  UndanganSchema,
  FotoSchema,
  ContentSchema,
  SouvenirSchema,
]);

// ── POST handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // ── Rate limiting ──────────────────────────────────────────────────────
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";
    if (!checkRateLimit(ip, ORDER_RATE_LIMIT, ORDER_RATE_WINDOW)) {
      return NextResponse.json(
        { success: false, error: "Terlalu banyak percobaan. Coba lagi dalam 10 menit." },
        { status: 429 }
      );
    }

    // ── Parse & validate body ──────────────────────────────────────────────
    const body = await request.json();
    const parsed = OrderCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Data tidak valid", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const orderCode = generateOrderCode();

    // ── Get authenticated user (optional — guest checkout works) ──────────
    let userId: string | null = null;
    try {
      const { createClient: createServerClient } = await import("@/lib/supabase/server");
      const userSupabase = await createServerClient();
      const {
        data: { user },
      } = await userSupabase.auth.getUser();
      userId = user?.id ?? null;
    } catch {
      // Not authenticated — guest checkout
    }

    // ── Build category-specific rows ──────────────────────────────────────
    let groomName: string | null = null;
    let brideName: string | null = null;
    let weddingDate: string | null = null;
    let venue: string | null = null;
    let templateSlug: string | null = null;
    let templateName: string | null = null;
    let customerEmail: string | null = null;
    let akadTime: string | null = null;
    let receptionTime: string | null = null;
    const serviceDetails: Record<string, unknown> = {};

    switch (data.serviceCategory) {
      case "undangan": {
        groomName = data.groomName;
        brideName = data.brideName;
        weddingDate = data.akadDate;
        akadTime = data.akadDate;
        receptionTime = data.receptionDate ?? null;
        venue = data.akadLocation;
        templateSlug = data.templateSlug ?? null;
        templateName = data.templateName ?? null;
        customerEmail = data.email || null;
        serviceDetails.akad_location = data.akadLocation;
        serviceDetails.reception_location = data.receptionLocation ?? "";
        serviceDetails.reception_date = data.receptionDate ?? "";
        break;
      }
      case "foto": {
        groomName = data.coupleName;
        brideName = data.coupleName;
        weddingDate = data.weddingDate;
        venue = data.venue;
        serviceDetails.couple_name = data.coupleName;
        serviceDetails.estimasi_tamu = data.estimasiTamu ?? "";
        break;
      }
      case "content": {
        groomName = data.coupleName;
        brideName = data.coupleName;
        weddingDate = data.eventDate;
        venue = data.eventLocation;
        serviceDetails.couple_name = data.coupleName;
        serviceDetails.event_type = data.eventType;
        serviceDetails.event_date = data.eventDate;
        serviceDetails.event_location = data.eventLocation;
        serviceDetails.ig_username = data.igUsername ?? "";
        break;
      }
      case "souvenir": {
        groomName = data.ordererName;
        brideName = data.ordererName;
        weddingDate = data.weddingDate;
        serviceDetails.orderer_name = data.ordererName;
        serviceDetails.product_id = data.productId;
        serviceDetails.quantity = data.quantity;
        serviceDetails.souvenir_name = data.souvenirName;
        serviceDetails.theme_color = data.themeColor ?? "";
        break;
      }
    }

    const supabase = await createServiceClient();

    // ── Insert order into Supabase ─────────────────────────────────────────
    const { data: order, error: dbError } = await supabase
      .from("orders")
      .insert({
        order_code:       orderCode,
        service_category: data.serviceCategory,
        service_details:  serviceDetails,
        template_slug:    templateSlug,
        template_name:    templateName,
        package_name:     data.packageName,
        groom_name:       groomName ?? "—",
        bride_name:       brideName ?? "—",
        customer_email:   customerEmail,
        phone:            data.phone,
        wedding_date:     weddingDate,
        venue:            venue,
        notes:            data.notes ?? null,
        status:           "pending_payment",
        akad_time:        akadTime,
        reception_time:   receptionTime,
        user_id:          userId,
      })
      .select("id, order_code")
      .single();

    if (dbError || !order) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { success: false, error: "Gagal menyimpan pesanan. Silakan coba lagi." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success:   true,
      orderCode: order.order_code,
      orderId:   order.id,
    });
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
