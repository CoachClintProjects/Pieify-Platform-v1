import { getServiceClient } from '../../../../lib/auth';
import { notFound } from 'next/navigation';

export default async function DecisionPage({ params }: { params: { id: string } }) {
  const supabase = getServiceClient();
  const { data: bid } = await supabase.from('bid_sessions').select('*, verticals(name)').eq('id', params.id).single();
  if (!bid) notFound();

  const { data: decisions } = await supabase.from('procurement_decisions').select('id, decision, rationale, score, decided_at').eq('bid_session_id', params.id).order('decided_at', { ascending: false });

  return (
    <div className="space-y-8">
      <div><p className="text-sm font-medium text-blue-700">Bid workspace</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Decision & audit — {bid.name}</h1><p className="mt-2 text-sm text-gray-600">Record BID / BID WITH QUESTIONS / PASS decision with full audit trail.</p></div>
      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Decisions</h2></div>
        <div className="p-5 text-sm">
          {decisions?.length ? decisions.map(d => (
            <div key={d.id} class="mb-4 border-b last:border-0 pb-4">
              <p class="font-medium text-gray-900">Decision: <span class={d.decision==='pursue'?'text-green-600':d.decision==='pass'?'text-red-600':'text-amber-600'}>{d.decision}</span></p>
              {d.rationale && <p class="text-gray-700">{d.rationale}</p>}
              {d.score && <p class="text-gray-600">Score: {d.score}</p>}
              <p class="text-gray-400 text-xs">{new Date(d.decided_at).toLocaleString()}</p>
            </div>
          )) : <p class="text-gray-500">No decisions recorded yet.</p>}
        </div>
      </section>
    </div>
  );
}
