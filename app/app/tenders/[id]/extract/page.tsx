import { getServiceClient } from '../../../../lib/auth';
import { notFound } from 'next/navigation';
import { runExtractionAgent } from '../../../../lib/ai_agents';

type ParseItem = { id: string; artifact_type?: string; title?: string; extracted_value?: unknown; confidence?: number; status?: string };
type ParseSection = { id: string; title?: string; section_type?: string; page_start?: number; page_end?: number; confidence?: number };
type ParseConflict = { id: string; conflict_type?: string; description?: string; status?: string };
type ParseGap = { id: string; gap_type?: string; title?: string; description?: string; impact?: string; status?: string };
type ExtractionResult = { sections: Omit<ParseSection, 'id'>[]; candidates: Omit<ParseItem, 'id'>[]; conflicts: Omit<ParseConflict, 'id'>[]; gaps: Omit<ParseGap, 'id'>[]; run: { time_saved_minutes: number; errors_prevented: number; pricing_advantage_usd: number | string } };

export default async function ExtractionReviewPage({ params }: { params: { id: string } }) {
  const supabase = getServiceClient();
  const { data: bid } = await supabase.from('bid_sessions').select('*, verticals(name)').eq('id', params.id).single();
  if (!bid) notFound();
  let { data: sections } = await supabase.from('tender_parse_sections').select('id, title, section_type, page_start, page_end, confidence').eq('bid_session_id', params.id).order('page_start');
  let { data: candidates } = await supabase.from('tender_parse_candidates').select('id, artifact_type, title, extracted_value, confidence, status').eq('bid_session_id', params.id);
  let { data: conflicts } = await supabase.from('tender_parse_conflicts').select('id, conflict_type, description, status').eq('bid_session_id', params.id);
  let { data: gaps } = await supabase.from('tender_parse_gaps').select('id, gap_type, title, description, impact, status').eq('bid_session_id', params.id);
  let valueSignals = { timeSaved: 0, errorsPrevented: 0, pricingAdvantage: 0 };
  if (!sections?.length) {
    const { data: docs } = await supabase.from('tender_documents').select('documents(id)').eq('bid_session_id', params.id);
    const docIds = (docs || []).map((d: { documents: { id: string } | { id: string }[] | null }) => {
      const document = Array.isArray(d.documents) ? d.documents[0] : d.documents;
      return document?.id;
    }).filter((id: string | undefined): id is string => Boolean(id));
    if (docIds.length) {
      const result = await runExtractionAgent(params.id, docIds) as ExtractionResult;
      sections = result.sections.map((s: Omit<ParseSection, 'id'>, i: number) => ({ ...s, id: `sim-${i}` }));
      candidates = result.candidates.map((c: Omit<ParseItem, 'id'>, i: number) => ({ ...c, id: `sim-${i}` }));
      conflicts = result.conflicts.map((c: Omit<ParseConflict, 'id'>, i: number) => ({ ...c, id: `sim-${i}` }));
      gaps = result.gaps.map((g: Omit<ParseGap, 'id'>, i: number) => ({ ...g, id: `sim-${i}` }));
      valueSignals = { timeSaved: result.run.time_saved_minutes, errorsPrevented: result.run.errors_prevented, pricingAdvantage: Number(result.run.pricing_advantage_usd) };
    }
  }
  return (
    <div className="space-y-8">
      <div><p className="text-sm font-medium text-blue-700">Bid workspace</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Extraction review — {bid.name}</h1><p className="mt-2 text-sm text-gray-600">AI‑extracted structure with value signals: time saved, errors prevented, pricing advantage.</p></div>
      {valueSignals.timeSaved > 0 && (<section className="grid gap-4 sm:grid-cols-3"><div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Time saved</p><p className="mt-2 text-2xl font-semibold">{valueSignals.timeSaved} min</p></div><div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Errors prevented</p><p className="mt-2 text-2xl font-semibold">{valueSignals.errorsPrevented}</p></div><div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Pricing advantage</p><p className="mt-2 text-2xl font-semibold">${valueSignals.pricingAdvantage.toLocaleString()}</p></div></section>)}
      <section className="rounded-lg border border-blue-200 bg-blue-50"><div className="border-b border-blue-200 px-5 py-4"><h2 className="font-semibold text-blue-900">Actions</h2></div><div className="p-5 text-sm"><form action={`/app/tenders/${params.id}/extract/run`} method="post"><button type="submit" className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white">Run extraction</button></form><p className="mt-2 text-gray-600 text-xs">Re‑run extraction to refresh sections, candidates, conflicts, and gaps.</p></div></section>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white"><div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Sections</h2></div><div className="p-5 text-sm">{sections?.length ? sections.map((s: ParseSection) => <div key={s.id} className="py-1"><span className="font-medium">{s.title}</span> — {s.section_type || '—'} (p.{s.page_start}–{s.page_end}) <span className={s.confidence && s.confidence>0.8?'text-green-600':'text-amber-600'}>confidence {Math.round((s.confidence||0)*100)}%</span></div>) : <p className="text-gray-500">No sections extracted yet.</p>}</div></div>
        <div className="rounded-lg border border-gray-200 bg-white"><div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Candidates</h2></div><div className="p-5 text-sm">{candidates?.length ? (candidates as ParseItem[]).map((c: ParseItem) => <div key={c.id} className="py-1"><span className="font-medium">{c.artifact_type}</span> — {c.title} <span className="text-gray-400">confidence {Math.round((c.confidence||0)*100)}%</span> <span className={c.status==='accepted'?'text-green-600':c.status==='rejected'?'text-red-600':'text-gray-600'}>{c.status}</span></div>) : <p className="text-gray-500">No candidates.</p>}</div></div>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white"><div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Conflicts</h2></div><div className="p-5 text-sm">{conflicts?.length ? (conflicts as ParseConflict[]).map((c: ParseConflict) => <div key={c.id} className="py-1"><span className="font-medium">{c.conflict_type}</span> — {c.description} <span className={c.status==='resolved'?'text-green-600':'text-amber-600'}>{c.status}</span></div>) : <p className="text-gray-500">No conflicts detected.</p>}</div></div>
        <div className="rounded-lg border border-gray-200 bg-white"><div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Gaps</h2></div><div className="p-5 text-sm">{gaps?.length ? (gaps as ParseGap[]).map((g: ParseGap) => <div key={g.id} className="py-1"><span className="font-medium">{g.gap_type}</span> — {g.title} <span className="text-gray-400">impact: {g.impact}</span> <span className={g.status==='resolved'?'text-green-600':'text-amber-600'}>{g.status}</span></div>) : <p className="text-gray-500">No gaps detected.</p>}</div></div>
      </section>
    </div>
  );
}
