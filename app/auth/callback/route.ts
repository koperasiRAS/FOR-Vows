import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ── Guest order claim ──────────────────────────────────────────────────────────
// After a new user registers via OAuth (Google), any orders they created as a
// guest (stored in localStorage) are linked to their new user_id so they
// appear in their dashboard without needing to re-enter the order code.
async function claimGuestOrders(userId: string, orderCodes: string[]) {
  if (!orderCodes.length) return;

  const supabase = await createClient();

  // Only claim orders that are still unlinked (user_id is null)
  // This prevents overwriting if a guest registers → logs out → logs back in
  const { data: unlinkedOrders } = await supabase
    .from('orders')
    .select('id, order_code')
    .in('order_code', orderCodes)
    .is('user_id', null);

  if (!unlinkedOrders?.length) return;

  const updates = unlinkedOrders.map((order) =>
    supabase.from('orders').update({ user_id: userId }).eq('id', order.id)
  );

  await Promise.all(updates);
  console.log(
    `[FORVows Auth] Claimed ${unlinkedOrders.length} guest orders for user ${userId}:`,
    unlinkedOrders.map((o) => o.order_code)
  );
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();

    // Get user state before exchange to detect NEW registration
    const { data: beforeUser } = await supabase.auth.getUser();

    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth Callback Error:', error.message);
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=auth_failed`
      );
    }

    const newUser = authData.user;

    // ── Guest order claim ──────────────────────────────────────────────────
    // Only claim if a NEW user was just created (not an existing user re-logging in)
    if (newUser && !beforeUser?.user) {
      // Order codes were stored in localStorage by the order page and passed
      // via the `orders` query param in the OAuth redirectTo URL.
      // We read them from the request URL (they were appended by the client).
      const orderCodesParam = requestUrl.searchParams.get('orders');
      if (orderCodesParam) {
        try {
          const orderCodes = JSON.parse(decodeURIComponent(orderCodesParam)) as string[];
          await claimGuestOrders(newUser.id, orderCodes);
        } catch {
          // Silently ignore malformed order codes
        }
      }
    }

    return NextResponse.redirect(`${requestUrl.origin}${next}`);
  }

  return NextResponse.redirect(`${requestUrl.origin}/auth/login`);
}
