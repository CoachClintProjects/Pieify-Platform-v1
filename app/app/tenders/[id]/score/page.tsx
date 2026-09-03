import { getServiceClient } from '../../../../lib/auth';
import { notFound } from 'next/navigation';
import { runScoringAgent } from '../../../../lib/ai_agents';

export default async function ScoringPage({ params }: { params: { id: string } }) {
  const supabase = getServiceClient();
  const { data: bid } = await supabase.from('bid_sessions').select('*, verticals(name)').eq('id', params.id).single();
  if (!bid) notFound();

  let { data: runs } = await supabase.from('score_runs').select('id, run_number, engine_version, percentage, final_score, recommendation, critical_fail, created_at').eq('bid_session_id', params.id).order('created_at', { ascending: false });
  let { data: exceptions } = await supabase.from('scoring_exceptions').select('id, exception_type, severity, message, status').eq('bid_session_id', params.id);
  let { data: reqs } = await supabase.from('requirements').select('id, requirement_type, name, description, weight, is_mandatory').eq('bid_session_id', params.id);
  let valueSignals = { timeSaved: 0, errorsPrevented: 0, pricingAdvantage: 0 };

  if (!runs?.length) {
    const result = await runScoringAgent(params.id);
    runs = [{ id: 'sim-1', run_number: 1, engine_version: 'v1.0', percentage: result.score, final_score: result.score, recommendation: result.recommendation, critical_fail: result.criticalFail, created_at: new Date().toISOString() }];
    exceptions = result.exceptions.map((e,i) => ({ ...e, id: `sim-${i}` }));
    valueSignals = { timeSaved: result.run.time_saved_minutes, errorsPrevented: result.run.errors_prevented, pricingAdvantage: Number(result.run.pricing_advantage_usd) };
  }

  const mandatoryReqs = (reqs||[]).filter(r=>r.is_mandatory);
  const failingMandatory = mandatoryReqs.filter(r=>(r.weight||0)<0.5);

  return (
    <div className="space-y-8">
      <div><p className="text-sm font-medium text-blue-700">Bid workspace</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Scoring — {bid.name}</h1><p className="mt-2 text-sm text-gray-600">Deterministic scoring with value signals and mandatory compliance view.</p></div>
      {valueSignals.timeSaved > 0 && (
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Time saved</p><p className="mt-2 text-2xl font-semibold">{valueSignals.timeSaved} min</p></div>
          <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Errors prevented</p><p className="mt-2 text-2xl font-semibold">{valueSignals.errorsPrevented}</p></div>
          <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Pricing advantage</p><p className="mt-2 text-2xl font-semibold">${valueSignals.pricingAdvantage.toLocaleString()}</p></div>
        </section>
      )}
      {mandatoryReqs.length > 0 && (
        <section className="rounded-lg border border-red-200 bg-red-50">
          <div className="border-b border-red-200 px-5 py-4"><h2 className="font-semibold text-red-900">What will fail (mandatory compliance)</h2></div>
          <div className="p-5 text-sm">
            {failingMandatory.length ? (
              <ul class="list-disc pl-5">
                {failingMandatory.map(r => <li key={r.id} class="text-red-800">{r.name} — weight {r.weight}</li>)}
              </ul>
            ) : <p class="text-green-800">All mandatory requirements currently passing.</p>}
          </div>
        </section>
      )}
      <section className="rounded-lg border border-blue-200 bg-blue-50">
        <div className="border-b border-blue-200 px-5 py-4"><h2 className="font-semibold text-blue-900">Actions</h2></div>
        <div className="p-5 text-sm">
          <form action={`/app/tenders/${params.id}/score/run`} method="post"><button type="submit" className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white">Run scoring</button></form>
          <p class="mt-2 text-gray-600 text-xs">Re‑run scoring to refresh score runs and exceptions.</p>
        </div>
      </section>
      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Score runs</h2></div>
        <div className="p-5 text-sm">
          {runs?.length ? runs.map(r => (
            <div key={r.id} className="mb-4 border-b last:border-0 pb-4">
              <p class="font-medium text-gray-900">Run #{r.run_number} — {new Date(r.created_at).toLocaleString()}</p>
              <p class="text-gray-700">Score: <span class="font-semibold">{r.final_score}</span> ({r.percentage}%) — Recommendation: <span class={r.recommendation==='pursue'?'text-green-600':r.recommendation==='pass'?'text-red-600':'text-amber-600'}>{r.recommendation}</span> {r.critical_fail && <span class="text-red-600">(critical fail)</span>}</p>
              <p class="text-gray-500 text-xs">Engine: {r.engine_version}</p>
            </div>
          )) : <p class="text-gray-500">No score runs yet.</p>}
        </div>
      </section>
      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Exceptions</h2></div>
        <div className="p-5 text-sm">
          {exceptions?.length ? exceptions.map(e => <div key={e.id} class="py-1"><span class="font-medium">{e.exception_type}</span> — {e.message} <span class={e.severity==='critical'?'text-red-600':e.severity==='warning'?'text-amber-600':'text-gray-600'}>{e.severity}</span> — <span class={e.status==='resolved'?'text-green-600':'text-gray-600'}>{e.status}</span></div>) : <p class="text-gray-500">No exceptions.</p>}
        </div>
      </section>
    </div>
  );
}
