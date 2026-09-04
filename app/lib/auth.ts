import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function getServiceClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {}
        },
      },
    }
  );
}

export async function requireRole(requiredRole: 'superuser' | 'admin' | 'user') {
  const supabase = await getServiceClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== requiredRole) throw new Error('Forbidden');
  return user;
}
