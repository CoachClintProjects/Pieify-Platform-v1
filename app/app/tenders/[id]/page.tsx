import { getServiceClient } from '../../../../lib/auth';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function TenderDetailPage({ params }: { params: { id: string } }) {
  const supabase = getServiceClient();
  const { data: bid } = await supabase.from('bid_sessions').select('*, opportunities(title), verticals(name)').eq('id', params.id).single();
  if (!bid) notFound();

  const { data: docs } = await supabase.from('tender_documents').select('documents(filename, storage_path)').eq('bid_session_id', params.id);
  const { data: lines } = await supabase.from('tender_lines').select('id, line_number, description, quantity, unit_of_measure').eq('bid_session_id', params.id);
  const { data: reqs } = await supabase.from('requirements').select('id, requirement_type, name, description, weight, is_mandatory').eq('bid_session_id', params.id);

  const workflowSteps = [
    { label: 'Extraction review', href: `/app/tenders/${params.id}/extract` },
    { label: 'Scoring', href: `/app/tenders/${params.id}/score` },
    { label: 'Clarifications', href: `/app/tenders/${params.id}/clarifications` },
    { label: 'Pricing & offer', href: `/app/tenders/${params.id}/pricing` },
    { label: 'Decision & audit', href: `/app/tenders/${params.id}/decision` },
  ];

  return (
    <div className="space-y-8">
      <div><p className="text-sm font-medium text-blue-700">Bid workspace</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">{bid.name}</h1><p className="mt-2 text-sm text-gray-600">End‑to‑end complex tender workflow (fire apparatus, heavy equipment, infrastructure).</p></div>
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Status</p><p className="mt-2 text-xl font-semibold">{bid.status}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Vertical</p><p className="mt-2 text-xl font-semibold">{(bid.verticals as any)?.name || '—'}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Opportunity</p><p className="mt-2 text-xl font-semibold">{(bid.opportunities as any)?.title || '—'}</p></div>
      </section>
      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Workflow</h2></div>
        <div className="p-5">
          <ol className="space-y-2 text-sm">
            {workflowSteps.map((s,i) => <li key={s.href} class="flex items-center gap-2"><span class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">{i+1}</span><Link class="text-blue-600 underline" href={s.href}>{s.label}</Link></li>)}
          </ol>
        </div>
      </section>
      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Documents</h2></div>
        <div className="p-5 text-sm text-gray-600">{(docs || []).length ? (docs as any[]).map(d => <div key={d.documents.filename} class="py-1">{d.documents.filename}</div>) : <p>No documents attached.</p>}</div>
      </section>
      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Lines</h2></div>
        <div className="p-5 text-sm text-gray-600">{lines?.length ? lines.map(l => <div key={l.id} class="py-1"><span class="font-medium">{l.line_number}</span> — {l.description} ({l.quantity} {l.unit_of_measure})</div>) : <p>No lines defined.</p>}</div>
      </section>
      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Requirements</h2></div>
        <div className="p-5 text-sm text-gray-600">{reqs?.length ? reqs.map(r => <div key={r.id} class="py-1"><span class="font-medium">{r.requirement_type}</span> — {r.name} (weight {r.weight}) {r.is_mandatory && <span class="text-red-600">(mandatory)</span>}</div>) : <p>No requirements extracted.</p>}</div>
      </section>
    </div>
  );
}
