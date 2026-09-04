import { getServiceClient } from '../../../lib/auth';
import { formatDate } from '../../../lib/admin-data';

type Row = Record<string, any>;

export default async function SubscriptionsPage() {
  const db = getServiceClient();
  const { data } = await db.from('subscriptions').select('*').order('created_at', { ascending: false }).limit(200);
  const rows: Row[] = data || [];
  return <div className="space-y-8"><div><p className="text-sm font-medium text-blue-700">Admin</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Subscriptions</h1></div><section className="rounded-lg border border-gray-200 bg-white"><div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Subscriptions</h2></div><div className="overflow-x-auto"><table className="min-w-full text-sm"><thead><tr className="text-left text-gray-600"><th className="px-5 py-3">ID</th><th className="px-5 py-3">Account</th><th className="px-5 py-3">Plan</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Period</th><th className="px-5 py-3">Created</th></tr></thead><tbody>{rows.map((r: Row) => <tr key={r.id} className="border-t"><td className="px-5 py-3">{r.id}</td><td className="px-5 py-3">{r.account_id}</td><td className="px-5 py-3">{r.plan}</td><td className="px-5 py-3">{r.status}</td><td className="px-5 py-3">{formatDate(r.current_period_start)} → {formatDate(r.current_period_end)}</td><td className="px-5 py-3">{formatDate(r.created_at)}</td></tr>)}</tbody></table></div></section></div>;
}
