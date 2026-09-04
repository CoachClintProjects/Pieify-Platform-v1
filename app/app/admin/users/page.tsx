import { getServiceClient } from '../../../lib/auth';
import { formatDate } from '../../../lib/admin-data';

type Row = Record<string, any>;

export default async function UsersPage() {
  const db = getServiceClient();
  const { data } = await db.from('user_profiles').select('*').order('created_at', { ascending: false }).limit(200);
  const rows: Row[] = data || [];
  return <div className="space-y-8"><div><p className="text-sm font-medium text-blue-700">Admin</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Users</h1></div><section className="rounded-lg border border-gray-200 bg-white"><div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Profiles</h2></div><div className="overflow-x-auto"><table className="min-w-full text-sm"><thead><tr className="text-left text-gray-600"><th className="px-5 py-3">ID</th><th className="px-5 py-3">Full name</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Created</th></tr></thead><tbody>{rows.map((r: Row) => <tr key={r.id} className="border-t"><td className="px-5 py-3">{r.id}</td><td className="px-5 py-3">{r.full_name}</td><td className="px-5 py-3">{r.email}</td><td className="px-5 py-3">{r.role}</td><td className="px-5 py-3">{formatDate(r.created_at)}</td></tr>)}</tbody></table></div></section></div>;
}
