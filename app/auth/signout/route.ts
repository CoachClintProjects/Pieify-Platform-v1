import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/auth/signin', request.url));
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: cookies => cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options)) } }
  );
  await supabase.auth.signOut();
  return response;
}
