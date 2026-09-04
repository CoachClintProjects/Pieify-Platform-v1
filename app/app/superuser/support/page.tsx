import { getServiceClient } from '../../../lib/auth';
import { formatDate } from '../../../lib/admin-data';

type Row = Record<string, any>;

export default async function SuperuserSupportPage() {
  const db = getServiceClient();
  const { data } = await db.from('support_tickets').select('*, accounts(name)').order('created_at', { ascending: false });
  const rows: Row[] = data || [];
  const open = rows.filter((t: Row) => t.status !== 'resolved').length;
  const resolved = rows.filter((t: Row) => t.status === 'resolved').length;
  const breaches = rows.filter((t: Row) => t.sla_breach).length;
  const totalMinutes = rows.reduce((sum: number, t: Row) => sum + (t.time_spent_minutes || 0), 0);
  return <div className="space-y-8"><div><p className="text-sm font-medium text-blue-700">Superuser</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Support tickets</h1><p className="mt-2 text-sm text-gray-600">Issues, SLA, time spent, resolution rate.</p></div><section className="grid gap-4 sm:grid-cols-4"><div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Open</p><p className="mt-2 text-2xl font-semibold">{open}</p></div><div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Resolved</p><p className="mt-2 text-2xl font-semibold">{resolved}</p></div><div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">SLA breaches</p><p className="mt-2 text-2xl font-semibold text-red-600">{breaches}</p></div><div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Time spent (min)</p><p className="mt-2 text-2xl font-semibold">{totalMinutes}</p></div></section><section className="rounded-lg border border-gray-200 bg-white"><div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Tickets</h2></div><div className="overflow-x-auto"><table className="min-w-full text-sm"><thead><tr className="text-left text-gray-600"><th className="px-5 py-3">Account</th><th className="px-5 py-3">Subject</th><th className="px-5 py-3">Severity</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Time (min)</th></tr></thead><tbody>{rows.map((t: Row) => <tr key={t.id} className="border-t"><td className="px-5 py-3">{(t.accounts as any)?.name || '—'}</td><td className="px-5 py-3">{t.subject}</td><td className="px-5 py-3">{t.severity}</td><td className="px-5 py-3">{t.status}</td><td className="px-5 py-3">{t.time_spent_minutes}</td></tr>)}</tbody></table></div></section></div>;
}
