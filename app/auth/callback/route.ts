import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Successful exchange, redirect to the desired URL
      return NextResponse.redirect(`${requestUrl.origin}${next}`);
    } else {
      console.error('Auth Callback Error:', error.message);
      // Redirect to login with error
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=auth_failed`);
    }
  }

  // No code found, redirect back to home or login
  return NextResponse.redirect(`${requestUrl.origin}/auth/login`);
}
