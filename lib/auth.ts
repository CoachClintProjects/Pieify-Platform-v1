import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { Database } from './db-types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export function getServerClient() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('sb-access-token')?.value;
  const refreshToken = cookieStore.get('sb-refresh-token')?.value;

  const client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  if (accessToken) {
    client.setSession({ access_token: accessToken, refresh_token: refreshToken || '' });
  }

  return client;
}

export function getServiceClient() {
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export interface SessionUser {
  id: string;
  email: string | null;
  raw_app_meta: Record<string, unknown> | null;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const client = getServerClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    raw_app_meta: user.raw_app_meta,
  };
}

export interface RoleContext {
  userId: string;
  email: string | null;
  role: 'superuser' | 'platform_admin' | 'account_admin' | 'client_admin' | 'client_user' | 'viewer';
  accountId: string | null;
  accountName: string | null;
}

export async function getRoleContext(): Promise<RoleContext | null> {
  const user = await getSessionUser();
  if (!user) return null;

  const service = getServiceClient();
  const { data: membership, error: membershipError } = await service
    .from('memberships')
    .select(`
      id,
      account_id,
      role_id,
      accounts!inner(id, name),
      roles!inner(id, name)
    `)
    .eq('user_id', user.id)
    .limit(1)
    .single();

  if (membershipError || !membership) {
    return {
      userId: user.id,
      email: user.email,
      role: 'viewer',
      accountId: null,
      accountName: null,
    };
  }

  const roleName = (membership.roles as { name: string }).name as RoleContext['role'];
  const accountId = (membership.account_id as string) || null;
  const accountName = ((membership.accounts as { name: string } | null)?.name) || null;

  return {
    userId: user.id,
    email: user.email,
    role: roleName,
    accountId,
    accountName,
  };
}

export function isSuperuser(role: RoleContext['role']) {
  return role === 'superuser';
}

export function isPlatformAdmin(role: RoleContext['role']) {
  return role === 'platform_admin';
}

export function isAccountAdmin(role: RoleContext['role']) {
  return role === 'account_admin';
}

export function isClientAdmin(role: RoleContext['role']) {
  return role === 'client_admin' || role === 'account_admin';
}

export function isClientUser(role: RoleContext['role']) {
  return role === 'client_user';
}
