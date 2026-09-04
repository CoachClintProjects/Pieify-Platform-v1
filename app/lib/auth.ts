import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export function getServiceClient() {
  const cookieStore = cookies();
  const cookie = cookieStore.get('supabase-auth-token');
  const token = cookie?.value ? JSON.parse(cookie.value) : null;

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: token?.access_token ? { Authorization: `Bearer ${token.access_token}` } : {},
      },
    }
  );
}

export async function requireRole(requiredRole: 'superuser' | 'admin' | 'user') {
  const supabase = getServiceClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== requiredRole) throw new Error('Forbidden');
  return user;
}
