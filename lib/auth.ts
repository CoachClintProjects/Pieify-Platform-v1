import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Canonical server client for RSC
export function getSupabaseServerClient(): any {
  cookies();
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
  ) as any;
}

// Backward-compatible alias used by legacy pages
export const getServiceClient = getSupabaseServerClient;

export async function getCurrentUser(): Promise<any | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

export async function getRoleContext(userId?: string): Promise<{ role: string | null; account_id: string | null }> {
  const supabase = getSupabaseServerClient();
  if (!userId) {
    const user = await getCurrentUser();
    userId = user?.id;
  }
  if (!userId) return { role: null, account_id: null };
  const { data } = await supabase.from('user_profiles').select('role, account_id').eq('id', userId).single();
  return { role: data?.role || null, account_id: data?.account_id || null };
}

export async function isSuperuser(userId?: string): Promise<boolean> {
  const ctx = await getRoleContext(userId);
  return ctx.role === 'superuser';
}

export async function isPlatformAdmin(userId?: string): Promise<boolean> {
  const ctx = await getRoleContext(userId);
  return ctx.role === 'admin' || ctx.role === 'superuser';
}

export async function requireRole(requiredRole: 'superuser' | 'admin' | 'user') {
  const supabase = getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== requiredRole) throw new Error('Forbidden');
  return user;
}
