import { getServiceClient } from '../../../../lib/auth';
import { notFound } from 'next/navigation';

export default async function TenderDetailPage({ params }: { params: { id: string } }) {
  const supabase = getServiceClient();
  const { data: bid } = await supabase.from('bid_sessions').select('*, opportunities(title), verticals(name)').eq('id', params.id).single();
  if (!bid) notFound();

  const { data: docs } = await supabase.from('tender_documents').select('documents(filename, storage_path)').eq('bid_session_id', params.id);
  const { data: lines } = await supabase.from('tender_lines').select('id, line_number, description, quantity, unit_of_measure').eq('bid_session_id', params.id);
  const { data: reqs } = await supabase.from('requirements').select('id, requirement_type, name, description, weight').eq('bid_session_id', params.id);

  return (
    <div className="space-y-8">
      <div><p className="text-sm font-medium text-blue-700">Bid workspace</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">{bid.name}</h1><p className="mt-2 text-sm text-gray-600">Live tender detail from <code>bid_sessions</code>, <code>tender_documents</code>, <code>tender_lines</code>, <code>requirements</code>.</p></div>
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Status</p><p className="mt-2 text-xl font-semibold">{bid.status}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Vertical</p><p className="mt-2 text-xl font-semibold">{(bid.verticals as any)?.name || '—'}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Opportunity</p><p className="mt-2 text-xl font-semibold">{(bid.opportunities as any)?.title || '—'}</p></div>
      </section>
      <section className="rounded-lg border border-gray-200 bg-white"><div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Documents</h2></div><div className="p-5 text-sm text-gray-600">{(docs || []).length ? (docs as any[]).map(d => <div key={d.documents.filename} className="py-1">{d.documents.filename}</div>) : <p>No documents attached.</p>}</div></section>
      <section className="rounded-lg border border-gray-200 bg-white"><div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Lines</h2></div><div className="p-5 text-sm text-gray-600">{lines?.length ? lines.map(l => <div key={l.id} className="py-1"><span className="font-medium">{l.line_number}</span> — {l.description} ({l.quantity} {l.unit_of_measure})</div>) : <p>No lines defined.</p>}</div></section>
      <section className="rounded-lg border border-gray-200 bg-white"><div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Requirements</h2></div><div className="p-5 text-sm text-gray-600">{reqs?.length ? reqs.map(r => <div key={r.id} className="py-1"><span className="font-medium">{r.requirement_type}</span> — {r.name} (weight {r.weight})</div>) : <p>No requirements extracted.</p>}</div></section>
    </div>
  );
}
