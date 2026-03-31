import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getPartnerById, PARTNER_COOKIE } from "@/lib/partners";

// Next.js App Router middleware — protects /admin/* routes via Supabase SSR auth

// ── Partner Proxy ────────────────────────────────────────────────────────────

function extractSubdomain(host: string): string | null {
  const hostWithoutPort = host.split(":")[0];
  const parts = hostWithoutPort.split(".");
  if (parts.length < 3 || parts[0] === "www") return null;
  return parts[0];
}

// ── Shared Supabase Auth Helper ───────────────────────────────────────────────

function createSupabaseServerClient(request: NextRequest, response: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set({ name, value, ...options });
          });
        },
      },
    }
  );
}

// ── Admin Auth Guard ──────────────────────────────────────────────────────────

async function handleAdminAuth(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  const response = NextResponse.next({ request });
  const supabase = createSupabaseServerClient(request, response);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isLoginPage) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && isLoginPage) {
    return NextResponse.redirect(new URL("/admin/orders", request.url));
  }

  // Check admin role — users must have "admin" in app_metadata.roles
  const roles: string[] = user?.app_metadata?.roles as string[] ?? [];
  const isAdmin = roles.includes("admin");

  if (!isAdmin) {
    // Authenticated but not admin — redirect to customer dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

// ── Customer Auth Guard ───────────────────────────────────────────────────────

async function handleCustomerAuth(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/auth/login";
  const isRegisterPage = pathname === "/auth/register";

  const response = NextResponse.next({ request });
  const supabase = createSupabaseServerClient(request, response);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isLoginPage && !isRegisterPage) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && (isLoginPage || isRegisterPage)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

// ── Main Middleware ────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const host = request.headers.get("host") ?? "";

  // ── 1. /login → /auth/login (customer) ────────────────────────────────────
  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // ── 2. Admin auth guard ──────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    return handleAdminAuth(request);
  }

  // ── 3. Customer auth guard ────────────────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    return handleCustomerAuth(request);
  }

  // ── 3. Partner proxy ─────────────────────────────────────────────────────
  const response = NextResponse.next({ request });

  const subdomain = extractSubdomain(host);
  const partnerFromSubdomain = subdomain ? getPartnerById(subdomain) : null;

  const partnerParam =
    searchParams.get("partner") ?? searchParams.get("ref") ?? null;
  const partnerFromParam = partnerParam ? getPartnerById(partnerParam) : null;

  const resolvedPartner = partnerFromSubdomain ?? partnerFromParam;
  if (!resolvedPartner) return response;

  response.headers.set("x-partner-id", resolvedPartner.id);

  const cookieValue = JSON.stringify({
    id: resolvedPartner.id,
    displayName: resolvedPartner.displayName,
    referralCode: resolvedPartner.referralCode,
  });

  response.cookies.set(PARTNER_COOKIE, cookieValue, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  if (partnerFromParam && !partnerFromSubdomain) {
    const rewriteUrl = new URL(pathname, request.url);
    rewriteUrl.searchParams.delete("partner");
    rewriteUrl.searchParams.delete("ref");
    return NextResponse.rewrite(rewriteUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
