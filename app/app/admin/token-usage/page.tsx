import { getAdminMetrics } from '../../../lib/admin-data';
import { formatCurrency, formatDate, formatNumber } from '../../../lib/admin-data';

type Row = Record<string, any>;

export default async function TokenUsagePage() {
  const m = await getAdminMetrics();
  const rows: Row[] = m.aiRuns || [];
  return <div className="space-y-8"><div><p className="text-sm font-medium text-blue-700">Admin</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Token usage</h1></div><section className="rounded-lg border border-gray-200 bg-white"><div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Runs</h2></div><div className="overflow-x-auto"><table className="min-w-full text-sm"><thead><tr className="text-left text-gray-600"><th className="px-5 py-3">ID</th><th className="px-5 py-3">Model</th><th className="px-5 py-3">Input</th><th className="px-5 py-3">Output</th><th className="px-5 py-3">Cost</th><th className="px-5 py-3">Created</th></tr></thead><tbody>{rows.map((r: Row) => <tr key={r.id} className="border-t"><td className="px-5 py-3">{r.id}</td><td className="px-5 py-3">{r.model}</td><td className="px-5 py-3">{formatNumber(r.input_tokens)}</td><td className="px-5 py-3">{formatNumber(r.output_tokens)}</td><td className="px-5 py-3">{formatCurrency(r.total_cost || r.cost_usd)}</td><td className="px-5 py-3">{formatDate(r.created_at)}</td></tr>)}</tbody></table></div></section></div>;
}
