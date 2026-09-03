import { getServiceClient } from '../../../../lib/auth';
import { notFound } from 'next/navigation';
import { runClarificationDraftAgent } from '../../../../lib/ai_agents';

export default async function ClarificationsPage({ params }: { params: { id: string } }) {
  const supabase = getServiceClient();
  const { data: bid } = await supabase.from('bid_sessions').select('*, verticals(name)').eq('id', params.id).single();
  if (!bid) notFound();

  let { data: questions } = await supabase.from('clarification_questions').select('id, question, status, answer, approved_at, answered_at, accepted_at').eq('bid_session_id', params.id).order('created_at', { ascending: false });
  let { data: gaps } = await supabase.from('tender_evaluation_gaps').select('id, gap_type, title, description, severity').eq('bid_session_id', params.id);
  let valueSignals = { timeSaved: 0, errorsPrevented: 0, pricingAdvantage: 0 };

  if (!questions?.length) {
    const result = await runClarificationDraftAgent(params.id);
    questions = result.questions.map((q,i) => ({ ...q, id: `sim-${i}` }));
    valueSignals = { timeSaved: result.run.time_saved_minutes, errorsPrevented: result.run.errors_prevented, pricingAdvantage: Number(result.run.pricing_advantage_usd) };
  }

  return (
    <div className="space-y-8">
      <div><p className="text-sm font-medium text-blue-700">Bid workspace</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Clarifications — {bid.name}</h1><p className="mt-2 text-sm text-gray-600">AI‑drafted clarification questions with value signals.</p></div>
      {valueSignals.timeSaved > 0 && (
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Time saved</p><p className="mt-2 text-2xl font-semibold">{valueSignals.timeSaved} min</p></div>
          <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Errors prevented</p><p className="mt-2 text-2xl font-semibold">{valueSignals.errorsPrevented}</p></div>
          <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Pricing advantage</p><p className="mt-2 text-2xl font-semibold">${valueSignals.pricingAdvantage.toLocaleString()}</p></div>
        </section>
      )}
      <section className="rounded-lg border border-blue-200 bg-blue-50">
        <div className="border-b border-blue-200 px-5 py-4"><h2 className="font-semibold text-blue-900">Actions</h2></div>
        <div className="p-5 text-sm">
          <form action={`/app/tenders/${params.id}/clarifications/run`} method="post"><button type="submit" className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white">Run clarifications</button></form>
          <p class="mt-2 text-gray-600 text-xs">Re‑run clarification draft to refresh questions.</p>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white"><div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Questions</h2></div><div className="p-5 text-sm">{questions?.length ? questions.map(q => <div key={q.id} class="py-1"><span class="font-medium">{q.question}</span> — Status: <span class={q.status==='answered'?'text-green-600':q.status==='draft'?'text-gray-600':'text-amber-600'}>{q.status}</span></div>) : <p class="text-gray-500">No questions yet.</p>}</div></div>
        <div className="rounded-lg border border-gray-200 bg-white"><div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Evaluation gaps</h2></div><div className="p-5 text-sm">{gaps?.length ? gaps.map(g => <div key={g.id} class="py-1"><span class="font-medium">{g.gap_type}</span> — {g.title} <span class="text-gray-400">{g.description}</span> <span class={g.severity==='critical'?'text-red-600':g.severity==='warning'?'text-amber-600':'text-gray-600'}>{g.severity}</span></div>) : <p class="text-gray-500">No gaps.</p>}</div></div>
      </section>
    </div>
  );
}
