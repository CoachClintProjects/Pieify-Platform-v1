import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export function getSupabaseServerClient(): any {
  cookies();
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
  ) as any;
}

export async function getCurrentUser(): Promise<any | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}
