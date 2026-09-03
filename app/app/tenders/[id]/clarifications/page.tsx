import { getServiceClient } from '../../../../lib/auth';
import { notFound } from 'next/navigation';

export default async function ClarificationsPage({ params }: { params: { id: string } }) {
  const supabase = getServiceClient();
  const { data: bid } = await supabase.from('bid_sessions').select('*, verticals(name)').eq('id', params.id).single();
  if (!bid) notFound();

  const { data: questions } = await supabase.from('clarification_questions').select('id, question, status, answer, approved_at, answered_at, accepted_at').eq('bid_session_id', params.id).order('created_at', { ascending: false });
  const { data: gaps } = await supabase.from('tender_evaluation_gaps').select('id, gap_type, title, description, severity').eq('bid_session_id', params.id);

  return (
    <div className="space-y-8">
      <div><p className="text-sm font-medium text-blue-700">Bid workspace</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Clarifications — {bid.name}</h1><p className="mt-2 text-sm text-gray-600">Generate, approve, send, and track clarification questions tied to evaluation gaps.</p></div>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white"><div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Questions</h2></div><div className="p-5 text-sm">{questions?.length ? questions.map(q => <div key={q.id} class="py-1"><span class="font-medium">{q.question}</span> — Status: <span class={q.status==='answered'?'text-green-600':q.status==='draft'?'text-gray-600':'text-amber-600'}>{q.status}</span></div>) : <p class="text-gray-500">No questions yet.</p>}</div></div>
        <div className="rounded-lg border border-gray-200 bg-white"><div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Evaluation gaps</h2></div><div className="p-5 text-sm">{gaps?.length ? gaps.map(g => <div key={g.id} class="py-1"><span class="font-medium">{g.gap_type}</span> — {g.title} <span class="text-gray-400">{g.description}</span> <span class={g.severity==='critical'?'text-red-600':g.severity==='warning'?'text-amber-600':'text-gray-600'}>{g.severity}</span></div>) : <p class="text-gray-500">No gaps.</p>}</div></div>
      </section>
    </div>
  );
}
