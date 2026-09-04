import { getAdminMetrics } from '../../../lib/admin-data';
import { formatCurrency, formatDate } from '../../../lib/admin-data';

type Row = Record<string, any>;

export default async function CostLedgerPage() {
  const m = await getAdminMetrics();
  const rows: Row[] = m.costLedger || [];
  const total = rows.reduce((sum: number, row: Row) => sum + Number(row.amount ?? row.cost_usd ?? 0), 0);
  return <div className="space-y-8"><div><p className="text-sm font-medium text-blue-700">Admin</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Cost ledger</h1></div><section className="rounded-lg border border-gray-200 bg-white"><div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Ledger</h2></div><div className="overflow-x-auto"><table className="min-w-full text-sm"><thead><tr className="text-left text-gray-600"><th className="px-5 py-3">ID</th><th className="px-5 py-3">Type</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">AI run</th><th className="px-5 py-3">Created</th></tr></thead><tbody>{rows.map((r: Row) => <tr key={r.id} className="border-t"><td className="px-5 py-3">{r.id}</td><td className="px-5 py-3">{r.type}</td><td className="px-5 py-3">{formatCurrency(r.amount || r.cost_usd)}</td><td className="px-5 py-3">{r.ai_run_id || '—'}</td><td className="px-5 py-3">{formatDate(r.created_at)}</td></tr>)}</tbody></table></div></section><section className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Total</p><p className="mt-2 text-2xl font-semibold">{formatCurrency(total)}</p></section></div>;
}
