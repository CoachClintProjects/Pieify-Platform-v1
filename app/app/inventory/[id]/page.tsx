import { getServiceClient } from '../../../../lib/auth';
import { notFound } from 'next/navigation';

export default async function InventoryDetailPage({ params }: { params: { id: string } }) {
  const supabase = getServiceClient();
  const { data: asset } = await supabase.from('inventory_items').select('*, products(name), locations(name), suppliers(name)').eq('id', params.id).single();
  if (!asset) notFound();

  const { data: options } = await supabase.from('asset_options').select('apparatus_options(name, description)').eq('asset_id', params.id);
  const { data: lifecycle } = await supabase.from('asset_lifecycle_records').select('event_type, event_date, condition, cost_amount, currency').eq('inventory_item_id', params.id).order('event_date', { ascending: false });

  return (
    <div className="space-y-8">
      <div><p className="text-sm font-medium text-blue-700">Asset registry</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">{(asset.products as any)?.name || asset.name}</h1><p className="mt-2 text-sm text-gray-600">Live asset detail from <code>inventory_items</code>.</p></div>
      <section className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Status</p><p className="mt-2 text-xl font-semibold">{asset.status}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Location</p><p className="mt-2 text-xl font-semibold">{(asset.locations as any)?.name || '—'}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">OEM</p><p className="mt-2 text-xl font-semibold">{(asset.suppliers as any)?.name || '—'}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Year</p><p className="mt-2 text-xl font-semibold">{asset.year || '—'}</p></div>
      </section>
      <section className="rounded-lg border border-gray-200 bg-white"><div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Options</h2></div><div className="p-5 text-sm text-gray-600">{options?.length ? (options as any[]).map(o => <div key={o.apparatus_options.name} className="py-1"><span className="font-medium">{o.apparatus_options.name}</span> — {o.apparatus_options.description}</div>) : <p>No options recorded.</p>}</div></section>
      <section className="rounded-lg border border-gray-200 bg-white"><div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Lifecycle</h2></div><div className="p-5 text-sm text-gray-600">{lifecycle?.length ? lifecycle.map(e => <div key={e.event_type} className="py-1"><span className="font-medium">{e.event_type}</span> — {e.event_date ? new Date(e.event_date).toLocaleDateString() : '—'} {e.condition ? `(${e.condition})` : ''} {e.cost_amount ? `${e.currency} ${Number(e.cost_amount).toLocaleString()}` : ''}</div>) : <p>No lifecycle events.</p>}</div></section>
    </div>
  );
}
