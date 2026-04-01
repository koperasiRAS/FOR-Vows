import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";
import { submitInquiry } from "@/app/actions/submitInquiry";
import type { ContactFormData } from "@/types";

// ── Rate limiting: 3 submissions per IP per hour ────────────────────────────
const CONTACT_RATE_LIMIT = 3;
const CONTACT_RATE_WINDOW = 60 * 60 * 1000;

// ── Zod schema ───────────────────────────────────────────────────────────────
const ContactSchema = z.object({
  fullName: z.string().min(1, "Nama wajib diisi").max(200).trim(),
  partnerName: z.string().max(200).trim().optional(),
  email: z.string().email("Format email tidak valid").trim(),
  phone: z.string().max(20).trim().optional(),
  weddingDate: z.string().trim().optional(),
  serviceType: z.string().trim().optional(),
  packageName: z.string().trim().optional(),
  templateName: z.string().trim().optional(),
  message: z.string().min(1, "Pesan wajib diisi").max(5000).trim(),
});

export async function POST(req: Request) {
  // ── Rate limiting ──────────────────────────────────────────────────────────
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  if (!checkRateLimit(ip, CONTACT_RATE_LIMIT, CONTACT_RATE_WINDOW)) {
    return NextResponse.json(
      { success: false, error: "Terlalu banyak percobaan. Coba lagi dalam 1 jam." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = ContactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Data tidak valid", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const result = await submitInquiry(parsed.data as ContactFormData);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
