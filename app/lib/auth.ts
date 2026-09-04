import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export function getServiceClient(): any {
  const cookieStore = cookies();
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
  ) as any;
}

export async function requireRole(requiredRole: 'superuser' | 'admin' | 'user') {
  const supabase = getServiceClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== requiredRole) throw new Error('Forbidden');
  return user;
}
