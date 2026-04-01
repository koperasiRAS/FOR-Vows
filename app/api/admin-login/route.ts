import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  checkLoginAttempts,
  recordFailedAttempt,
  clearAttempts,
} from "@/lib/admin-auth-limiter";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  // 1 — Check brute-force lockout
  const check = checkLoginAttempts(ip);
  if (!check.allowed) {
    return NextResponse.json(
      { success: false, error: check.message },
      { status: 429 }
    );
  }

  // 2 — Parse & validate body
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Permintaan tidak valid." },
      { status: 400 }
    );
  }

  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: "Email dan password wajib diisi." },
      { status: 400 }
    );
  }

  // 3 — Attempt Supabase auth
  const supabase = await createClient();
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (authError) {
    // Record failed attempt
    recordFailedAttempt(ip);

    let message = "Email atau password salah.";
    if (
      authError.message.includes("rate_limit") ||
      authError.message.includes("Too many requests")
    ) {
      message = "Terlalu banyak percobaan. Coba lagi beberapa menit.";
    }

    return NextResponse.json({ success: false, error: message }, { status: 401 });
  }

  // 4 — Success — clear attempt record
  clearAttempts(ip);

  return NextResponse.json({ success: true });
}
