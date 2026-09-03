import { getServiceClient } from '../../../../lib/auth';
import { notFound } from 'next/navigation';

export default async function ExtractionReviewPage({ params }: { params: { id: string } }) {
  const supabase = getServiceClient();
  const { data: bid } = await supabase.from('bid_sessions').select('*, verticals(name)').eq('id', params.id).single();
  if (!bid) notFound();

  const { data: sections } = await supabase.from('tender_parse_sections').select('id, title, section_type, page_start, page_end, confidence').eq('bid_session_id', params.id).order('page_start');
  const { data: candidates } = await supabase.from('tender_parse_candidates').select('id, artifact_type, title, extracted_value, confidence, status').eq('bid_session_id', params.id);
  const { data: conflicts } = await supabase.from('tender_parse_conflicts').select('id, conflict_type, description, status').eq('bid_session_id', params.id);
  const { data: gaps } = await supabase.from('tender_parse_gaps').select('id, gap_type, title, description, impact, status').eq('bid_session_id', params.id);

  return (
    <div className="space-y-8">
      <div><p className="text-sm font-medium text-blue-700">Bid workspace</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Extraction review — {bid.name}</h1><p className="mt-2 text-sm text-gray-600">AI‑extracted structure, candidates, conflicts, and gaps. Human review ensures authoritative evaluation.</p></div>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white"><div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Sections</h2></div><div className="p-5 text-sm">{sections?.length ? sections.map(s => <div key={s.id} className="py-1"><span className="font-medium">{s.title}</span> — {s.section_type || '—'} (p.{s.page_start}–{s.page_end}) <span className={s.confidence && s.confidence>0.8?'text-green-600':'text-amber-600'}>confidence {Math.round((s.confidence||0)*100)}%</span></div>) : <p class="text-gray-500">No sections extracted yet.</p>}</div></div>
        <div className="rounded-lg border border-gray-200 bg-white"><div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Candidates</h2></div><div className="p-5 text-sm">{candidates?.length ? candidates.map(c => <div key={c.id} className="py-1"><span class="font-medium">{c.artifact_type}</span> — {c.title} <span class="text-gray-400">confidence {Math.round((c.confidence||0)*100)}%</span> <span class={c.status==='accepted'?'text-green-600':c.status==='rejected'?'text-red-600':'text-gray-600'}>{c.status}</span></div>) : <p class="text-gray-500">No candidates.</p>}</div></div>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white"><div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Conflicts</h2></div><div className="p-5 text-sm">{conflicts?.length ? conflicts.map(c => <div key={c.id} className="py-1"><span class="font-medium">{c.conflict_type}</span> — {c.description} <span class={c.status==='resolved'?'text-green-600':'text-amber-600'}>{c.status}</span></div>) : <p class="text-gray-500">No conflicts detected.</p>}</div></div>
        <div className="rounded-lg border border-gray-200 bg-white"><div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Gaps</h2></div><div className="p-5 text-sm">{gaps?.length ? gaps.map(g => <div key={g.id} className="py-1"><span class="font-medium">{g.gap_type}</span> — {g.title} <span class="text-gray-400">impact: {g.impact}</span> <span class={g.status==='resolved'?'text-green-600':'text-amber-600'}>{g.status}</span></div>) : <p class="text-gray-500">No gaps detected.</p>}</div></div>
      </section>
    </div>
  );
}
