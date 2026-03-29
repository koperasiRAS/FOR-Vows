import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPartnerById, PARTNER_COOKIE } from "@/lib/partners";

/**
 * Extract the leftmost label from a Host value as the subdomain candidate.
 *
 * Local dev: "frameofrangga.localhost:3000"  → "frameofrangga"
 * Vercel:     "frameofrangga.forvows.com"    → "frameofrangga"
 * Production: "forvows.com"                   → null
 */
function extractSubdomain(host: string): string | null {
  const hostWithoutPort = host.split(":")[0];
  const parts = hostWithoutPort.split(".");

  // Need at least 3 parts (subdomain.domain.tld); "www" is not a partner
  if (parts.length < 3 || parts[0] === "www") return null;

  return parts[0];
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const host = request.headers.get("host") ?? "";
  const response = NextResponse.next();

  // 1. Detect partner from subdomain
  const subdomain = extractSubdomain(host);
  const partnerFromSubdomain = subdomain ? getPartnerById(subdomain) : null;

  // 2. Detect partner from query params (?partner= or ?ref=)
  const partnerParam =
    searchParams.get("partner") ?? searchParams.get("ref") ?? null;
  const partnerFromParam = partnerParam ? getPartnerById(partnerParam) : null;

  // Subdomain takes priority over query param
  const resolvedPartner = partnerFromSubdomain ?? partnerFromParam;

  if (!resolvedPartner) return response;

  // 3. Set response header (available to server components on initial request)
  response.headers.set("x-partner-id", resolvedPartner.id);

  // 4. Set HttpOnly cookie (survives client-side navigation)
  const cookieValue = JSON.stringify({
    id: resolvedPartner.id,
    displayName: resolvedPartner.displayName,
    referralCode: resolvedPartner.referralCode,
  });

  // Vercel Edge always operates over TLS; secure:true is always correct here.
  // Omitting httpOnly so client-side use-partner.ts can read it via document.cookie.
  // The cookie only contains non-sensitive partner metadata (id, displayName, referralCode).
  response.cookies.set(PARTNER_COOKIE, cookieValue, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  // 5. Rewrite URL to remove ?partner=/?ref= from visible address bar
  // (only when partner came from query param — subdomain is already clean)
  if (partnerFromParam && !partnerFromSubdomain) {
    const rewriteUrl = new URL(pathname, request.url);
    rewriteUrl.searchParams.delete("partner");
    rewriteUrl.searchParams.delete("ref");
    return NextResponse.rewrite(rewriteUrl);
  }

  return response;
}

export const proxyConfig = {
  /**
   * Run on all routes except:
   * - _next/static  (static assets — no partner context needed)
   * - _next/image   (image optimisation)
   * - favicon.ico   (browser default)
   * - api/         (webhook signatures must not be modified)
   */
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
