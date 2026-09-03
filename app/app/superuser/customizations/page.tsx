import { getServiceClient } from '../../../lib/auth';

export default async function SuperuserCustomizationsPage() {
  const supabase = getServiceClient();
  const { data: custs } = await supabase.from('customizations').select('*, accounts(name)');

  return (
    <div className="space-y-8">
      <div><p className="text-sm font-medium text-blue-700">Superuser</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Customizations</h1><p className="mt-2 text-sm text-gray-600">Per‑account verticals, feature flags, branding, pricing rules.</p></div>
      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Accounts</h2></div>
        <div className="overflow-x-auto"><table className="min-w-full text-sm"><thead><tr class="text-left text-gray-600"><th class="px-5 py-3">Account</th><th class="px-5 py-3">Verticals</th><th class="px-5 py-3">Feature flags</th><th class="px-5 py-3">Pricing rules</th></tr></thead><tbody>{custs?.map(c=>(<tr key={c.id} class="border-t"><td class="px-5 py-3">{(c.accounts as any)?.name || '—'}</td><td class="px-5 py-3">{(c.verticals_enabled||[]).join(', ') || '—'}</td><td class="px-5 py-3">{Object.keys(c.feature_flags||{}).join(', ') || '—'}</td><td class="px-5 py-3">{Object.keys(c.pricing_rules||{}).join(', ') || '—'}</td></tr>))}</tbody></table></div>
      </section>
    </div>
  );
}
