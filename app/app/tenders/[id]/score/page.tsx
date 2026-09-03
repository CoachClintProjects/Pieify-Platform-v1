import { getServiceClient } from '../../../../lib/auth';
import { notFound } from 'next/navigation';

export default async function ScoringPage({ params }: { params: { id: string } }) {
  const supabase = getServiceClient();
  const { data: bid } = await supabase.from('bid_sessions').select('*, verticals(name)').eq('id', params.id).single();
  if (!bid) notFound();

  const { data: runs } = await supabase.from('score_runs').select('id, run_number, engine_version, percentage, final_score, recommendation, critical_fail, created_at').eq('bid_session_id', params.id).order('created_at', { ascending: false });
  const { data: exceptions } = await supabase.from('scoring_exceptions').select('id, exception_type, severity, message, status').eq('bid_session_id', params.id);

  return (
    <div className="space-y-8">
      <div><p className="text-sm font-medium text-blue-700">Bid workspace</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Scoring — {bid.name}</h1><p className="mt-2 text-sm text-gray-600">Deterministic scoring against rule sets with human override and audit.</p></div>
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
