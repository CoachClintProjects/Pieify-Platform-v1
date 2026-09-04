import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function getServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name) {
          const cookieStore = cookies();
          return cookieStore.get(name)?.value;
        },
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
