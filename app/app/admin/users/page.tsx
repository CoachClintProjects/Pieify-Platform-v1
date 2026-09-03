import { getServiceClient } from '../../../../lib/auth';
import { formatDate } from '../../../../lib/admin-data';

export default async function UsersPage() {
  const supabase = getServiceClient();
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, avatar_url, created_at, updated_at')
    .order('created_at', { ascending: false });
  const { data: memberships } = await supabase
    .from('memberships')
    .select('user_id, accounts(name), roles(name)');
  const membershipByUser = new Map((memberships || []).map((item) => [item.user_id, item]));

  return (
    <div className="space-y-6">
      <div><p className="text-sm font-medium text-blue-700">Platform directory</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Users</h1><p className="mt-2 text-sm text-gray-600">Live records from <code>profiles</code>, joined to memberships and roles.</p></div>
      {error ? <p className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load users: {error.message}</p> : <div className="overflow-hidden rounded-lg border border-gray-200 bg-white"><table className="min-w-full divide-y divide-gray-200 text-sm"><thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-5 py-3">User</th><th className="px-5 py-3">Tenant</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Created</th></tr></thead><tbody className="divide-y divide-gray-100">{(profiles || []).map((profile) => { const membership = membershipByUser.get(profile.id); const account = membership?.accounts as { name: string } | null; const role = membership?.roles as { name: string } | null; return <tr key={profile.id}><td className="px-5 py-4"><p className="font-medium text-gray-900">{profile.full_name || 'Unnamed user'}</p><p className="text-gray-500">{profile.email || '—'}</p></td><td className="px-5 py-4 text-gray-600">{account?.name || '—'}</td><td className="px-5 py-4 text-gray-600">{role?.name || '—'}</td><td className="px-5 py-4 text-gray-600">{formatDate(profile.created_at)}</td></tr>; })}{!profiles?.length && <tr><td colSpan={4} className="px-5 py-10 text-center text-gray-500">No user records available.</td></tr>}</tbody></table></div>}
    </div>
  );
}
