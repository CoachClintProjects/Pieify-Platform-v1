import { getServiceClient } from '../../../lib/auth';

type Row = Record<string, any>;

export default async function CustomizationsPage() {
  const db = getServiceClient();
  const { data } = await db.from('customizations').select('*, accounts(name)').order('created_at', { ascending: false });
  const rows: Row[] = data || [];
  return <div className="space-y-8"><div><p className="text-sm font-medium text-blue-700">Superuser</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Customizations</h1><p className="mt-2 text-sm text-gray-600">Per‑account verticals, feature flags, pricing rules.</p></div><section className="rounded-lg border border-gray-200 bg-white"><div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Accounts</h2></div><div className="overflow-x-auto"><table className="min-w-full text-sm"><thead><tr className="text-left text-gray-600"><th className="px-5 py-3">Account</th><th className="px-5 py-3">Verticals</th><th className="px-5 py-3">Feature flags</th><th className="px-5 py-3">Pricing rules</th></tr></thead><tbody>{rows.map((c: Row) => <tr key={c.id} className="border-t"><td className="px-5 py-3">{(c.accounts as any)?.name || '—'}</td><td className="px-5 py-3">{(c.verticals_enabled || []).join(', ') || '—'}</td><td className="px-5 py-3">{Object.keys(c.feature_flags || {}).join(', ') || '—'}</td><td className="px-5 py-3">{Object.keys(c.pricing_rules || {}).join(', ') || '—'}</td></tr>)}</tbody></table></div></section></div>;
}
