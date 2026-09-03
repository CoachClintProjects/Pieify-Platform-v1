import { getServiceClient } from '../../../../lib/auth';
import { notFound } from 'next/navigation';
import { runExtractionAgent } from '../../../../lib/ai_agents';

export default async function ExtractionReviewPage({ params }: { params: { id: string } }) {
  const supabase = getServiceClient();
  const { data: bid } = await supabase.from('bid_sessions').select('*, verticals(name)').eq('id', params.id).single();
  if (!bid) notFound();

  // Run extraction agent if no sections yet
  let { data: sections } = await supabase.from('tender_parse_sections').select('id, title, section_type, page_start, page_end, confidence').eq('bid_session_id', params.id).order('page_start');
  let { data: candidates } = await supabase.from('tender_parse_candidates').select('id, artifact_type, title, extracted_value, confidence, status').eq('bid_session_id', params.id);
  let { data: conflicts } = await supabase.from('tender_parse_conflicts').select('id, conflict_type, description, status').eq('bid_session_id', params.id);
  let { data: gaps } = await supabase.from('tender_parse_gaps').select('id, gap_type, title, description, impact, status').eq('bid_session_id', params.id);

  let valueSignals = { timeSaved: 0, errorsPrevented: 0, pricingAdvantage: 0 };
  if (!sections?.length) {
    const { data: docs } = await supabase.from('tender_documents').select('documents(id)').eq('bid_session_id', params.id);
    const docIds = (docs || []).map(d => (d.documents as any).id);
    if (docIds.length) {
      const result = await runExtractionAgent(params.id, docIds);
      sections = result.sections.map((s,i) => ({ ...s, id: `sim-${i}` }));
      candidates = result.candidates.map((c,i) => ({ ...c, id: `sim-${i}` }));
      conflicts = result.conflicts.map((c,i) => ({ ...c, id: `sim-${i}` }));
      gaps = result.gaps.map((g,i) => ({ ...g, id: `sim-${i}` }));
      valueSignals = { timeSaved: result.run.time_saved_minutes, errorsPrevented: result.run.errors_prevented, pricingAdvantage: Number(result.run.pricing_advantage_usd) };
    }
  }

  return (
    <div className="space-y-8">
      <div><p className="text-sm font-medium text-blue-700">Bid workspace</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Extraction review — {bid.name}</h1><p className="mt-2 text-sm text-gray-600">AI‑extracted structure with value signals: time saved, errors prevented, pricing advantage.</p></div>
      {valueSignals.timeSaved > 0 && (
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Time saved</p><p className="mt-2 text-2xl font-semibold">{valueSignals.timeSaved} min</p></div>
          <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Errors prevented</p><p className="mt-2 text-2xl font-semibold">{valueSignals.errorsPrevented}</p></div>
          <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Pricing advantage</p><p className="mt-2 text-2xl font-semibold">${valueSignals.pricingAdvantage.toLocaleString()}</p></div>
        </section>
      )}
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
