import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
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

  // 3 — Attempt Supabase auth — use a response-aware client so cookies get set
  const response = new NextResponse();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.headers
            .get("cookie")
            ?.split(";")
            .map((c) => {
              const [name, ...rest] = c.trim().split("=");
              return { name: name.trim(), value: rest.join("=").trim() };
            }) ?? [];
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set({ name, value, ...options });
          });
        },
      },
    }
  );

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (authError || !authData.user) {
    recordFailedAttempt(ip);

    let message = "Email atau password salah.";
    if (
      authError?.message.includes("rate_limit") ||
      authError?.message.includes("Too many requests")
    ) {
      message = "Terlalu banyak percobaan. Coba lagi beberapa menit.";
    }

    return NextResponse.json({ success: false, error: message }, { status: 401 });
  }

  // 4 — Verify this user is in admin_users table (using service role to bypass RLS)
  const serviceSupabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return []; },
        setAll() {},
      },
    }
  );

  const user = authData.user;

  // Fast path: lookup by user_id
  const { data: adminByUid } = await serviceSupabase
    .from("admin_users")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  let isAdmin = !!adminByUid;

  if (!isAdmin) {
    // Fallback: lookup by email, then backfill user_id
    const { data: adminByEmail } = await serviceSupabase
      .from("admin_users")
      .select("id")
      .eq("email", user.email ?? "")
      .maybeSingle();

    if (adminByEmail) {
      isAdmin = true;
      // Backfill user_id for faster future lookups
      await serviceSupabase
        .from("admin_users")
        .update({ user_id: user.id })
        .eq("email", user.email ?? "");
    }
  }

  if (!isAdmin) {
    // Authenticated via Supabase but NOT an admin — sign them out and reject
    await supabase.auth.signOut();
    recordFailedAttempt(ip);
    return NextResponse.json(
      { success: false, error: "Akun ini tidak memiliki hak akses admin." },
      { status: 403 }
    );
  }

  // 5 — Success — clear attempt record, return with Set-Cookie headers
  clearAttempts(ip);

  const successResponse = NextResponse.json({ success: true });
  // Copy auth cookies from our tracking response to the success response
  response.cookies.getAll().forEach(({ name, value, ...options }) => {
    successResponse.cookies.set({ name, value, ...options });
  });

  return successResponse;
}
