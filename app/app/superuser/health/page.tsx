import { getServiceClient } from '../../../lib/auth';

export default async function SuperuserHealthPage() {
  const supabase = getServiceClient();
  const { data: health } = await supabase.from('superuser_business_health').select().single();
  const { data: kpis } = await supabase.from('superuser_kpis').select().single();
  const { data: subs } = await supabase.from('subscriptions').select('plan, monthly_value, status').eq('status', 'active');
  const { data: progress } = await supabase.from('prototype_progress').select('milestone, target_date, actual_date, status, notes').order('created_at');

  const mrr = Number(health?.total_mrr || 0);
  const arr = Number(health?.total_arr || 0);
  const aiCost30 = Number(health?.ai_cost_last_30d || 0);
  const infraCost30 = Number(health?.infra_cost_last_30d || 0);
  const directCosts30 = aiCost30 + infraCost30;
  const grossProfit30 = mrr - directCosts30;
  const marginPct = mrr > 0 ? (grossProfit30 / mrr) * 100 : 0;

  const planCounts: Record<string,number> = {};
  (subs||[]).forEach(s => { planCounts[s.plan] = (planCounts[s.plan]||0)+1; });

  const conversionRate = (kpis?.active_subscriptions || 0) / Math.max(1, (kpis?.active_accounts || 1));
  const avgMarginUplift = (kpis?.pricing_advantage_last_30d || 0) / Math.max(1, (kpis?.bids_last_30d || 1));

  return (
    <div className="space-y-8">
      <div><p className="text-sm font-medium text-blue-700">Superuser</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Business health & real‑time KPIs</h1><p className="mt-2 text-sm text-gray-600">All revenue vs all direct costs, plus adoption, value, and prototype progress.</p></div>
      <section className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">MRR</p><p className="mt-2 text-2xl font-semibold">${mrr.toLocaleString()}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">ARR</p><p className="mt-2 text-2xl font-semibold">${arr.toLocaleString()}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Direct costs (30d)</p><p className="mt-2 text-2xl font-semibold">${directCosts30.toLocaleString()}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Gross margin (30d)</p><p className="mt-2 text-2xl font-semibold">${grossProfit30.toLocaleString()} <span class="text-sm text-gray-500">({marginPct.toFixed(1)}%)</span></p></div>
      </section>
      <section className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Active accounts</p><p className="mt-2 text-2xl font-semibold">{kpis?.active_accounts || 0}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Bids (30d)</p><p className="mt-2 text-2xl font-semibold">{kpis?.bids_last_30d || 0}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Time saved (30d)</p><p className="mt-2 text-2xl font-semibold">{kpis?.time_saved_minutes_last_30d || 0} min</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Errors prevented (30d)</p><p className="mt-2 text-2xl font-semibold">{kpis?.errors_prevented_last_30d || 0}</p></div>
      </section>
      <section className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">AI cost (30d)</p><p className="mt-2 text-xl font-semibold">${aiCost30.toLocaleString()}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Infra cost (30d)</p><p className="mt-2 text-xl font-semibold">${infraCost30.toLocaleString()}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Pricing advantage (30d)</p><p className="mt-2 text-xl font-semibold">${kpis?.pricing_advantage_last_30d?.toLocaleString() || '0'}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Conversion rate</p><p className="mt-2 text-xl font-semibold">{(conversionRate*100).toFixed(1)}%</p></div>
      </section>
      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Avg margin uplift per bid</h2></div>
        <div className="p-5 text-sm">
          <p class="text-2xl font-semibold">${Math.round(avgMarginUplift).toLocaleString()}</p>
          <p class="text-gray-500 text-xs mt-1">Pricing advantage / bids (30d)</p>
        </div>
      </section>
      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Plan mix</h2></div>
        <div className="p-5 text-sm">
          {Object.entries(planCounts).map(([plan,count]) => <div key={plan} class="py-1"><span class="font-medium">{plan}</span>: {count}</div>)}
        </div>
      </section>
      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Prototype progress</h2></div>
        <div className="p-5 text-sm">
          {progress?.map(p => (
            <div key={p.milestone} class="py-1"><span class={p.status==='completed'?'text-green-600':p.status==='in_progress'?'text-amber-600':'text-gray-600'}>{p.status}</span> — {p.milestone} {p.target_date && <span class="text-gray-400">(target: {new Date(p.target_date).toLocaleDateString()})</span>} {p.notes && <span class="text-gray-500">— {p.notes}</span>}</div>
          ))}
        </div>
      </section>
    </div>
  );
}
