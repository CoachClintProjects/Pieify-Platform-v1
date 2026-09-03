import { getServiceClient } from '../../../lib/auth';

export default async function SuperuserHealthPage() {
  const supabase = getServiceClient();
  const { data: health } = await supabase.from('superuser_business_health').select().single();
  const { data: subs } = await supabase.from('subscriptions').select('plan, monthly_value, status').eq('status', 'active');
  const { data: aiCost } = await supabase.from('ai_run_usage').select('cost_usd, created_at').gt('created_at', new Date(Date.now()-30*24*60*60*1000).toISOString());
  const { data: accounts } = await supabase.from('accounts').select('id, status, name');

  const mrr = Number(health?.total_mrr || 0);
  const arr = Number(health?.total_arr || 0);
  const aiCost30 = Number(health?.ai_cost_last_30d || 0);
  const infraCost30 = Number(health?.infra_cost_last_30d || 0);
  const directCosts30 = aiCost30 + infraCost30;
  const grossProfit30 = mrr - directCosts30;
  const marginPct = mrr > 0 ? (grossProfit30 / mrr) * 100 : 0;

  const planCounts: Record<string,number> = {};
  (subs||[]).forEach(s => { planCounts[s.plan] = (planCounts[s.plan]||0)+1; });

  return (
    <div className="space-y-8">
      <div><p className="text-sm font-medium text-blue-700">Superuser</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Business health</h1><p className="mt-2 text-sm text-gray-600">All revenue vs all direct costs. Are we making money?</p></div>
      <section className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">MRR</p><p className="mt-2 text-2xl font-semibold">${mrr.toLocaleString()}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">ARR</p><p className="mt-2 text-2xl font-semibold">${arr.toLocaleString()}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Direct costs (30d)</p><p className="mt-2 text-2xl font-semibold">${directCosts30.toLocaleString()}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Gross margin (30d)</p><p className="mt-2 text-2xl font-semibold">${grossProfit30.toLocaleString()} <span class="text-sm text-gray-500">({marginPct.toFixed(1)}%)</span></p></div>
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">AI cost (30d)</p><p className="mt-2 text-xl font-semibold">${aiCost30.toLocaleString()}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Infra cost (30d)</p><p className="mt-2 text-xl font-semibold">${infraCost30.toLocaleString()}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Active accounts</p><p className="mt-2 text-xl font-semibold">{health?.active_accounts || 0} / {health?.total_accounts || 0}</p></div>
      </section>
      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Plan mix</h2></div>
        <div className="p-5 text-sm">
          {Object.entries(planCounts).map(([plan,count]) => <div key={plan} class="py-1"><span class="font-medium">{plan}</span>: {count}</div>)}
        </div>
      </section>
      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Activity (30d)</h2></div>
        <div className="p-5 text-sm">
          <p>Bids: {health?.bids_last_30d || 0}</p>
          <p>AI runs: {health?.ai_runs_last_30d || 0}</p>
        </div>
      </section>
    </div>
  );
}
