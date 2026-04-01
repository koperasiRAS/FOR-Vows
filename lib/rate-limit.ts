/**
 * Simple in-memory rate limiter for Vercel serverless functions.
 *
 * NOTE: In-memory stores do NOT persist across Vercel cold-starts or multiple
 * serverless instances. For production with strict rate limiting, upgrade to
 * Upstash Redis. See: https://vercel.com/integrations/upstash
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Module-level store — reset on every serverless instance cold-start.
// Do NOT rely on this for critical security enforcement.
const store = new Map<string, RateLimitEntry>();

/**
 * Check and increment rate limit for a given IP.
 *
 * @param ip     - The client IP address (from x-forwarded-for or request.ip)
 * @param maxRequests - Maximum requests allowed per window (default: 5)
 * @param windowMs    - Window size in milliseconds (default: 10 minutes)
 * @returns true if request is allowed, false if rate limited
 */
export function checkRateLimit(
  ip: string,
  maxRequests = 5,
  windowMs = 10 * 60 * 1000
): boolean {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

/**
 * Get the number of remaining requests for an IP in the current window.
 */
export function getRateLimitRemaining(ip: string): number {
  const entry = store.get(ip);
  if (!entry || Date.now() > entry.resetAt) return 5;
  return Math.max(0, 5 - entry.count);
}
