import { getServiceClient } from '../../../lib/auth';
import { notFound } from 'next/navigation';
import { formatDate } from '../../../lib/admin-data';

type Row = Record<string, any>;

export default async function InventoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getServiceClient();
  const { data: item } = await db.from('products').select('*').eq('id', id).single();
  if (!item) notFound();
  const p: Row = item;
  return <div className="space-y-8"><div><p className="text-sm font-medium text-blue-700">Inventory</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">{p.name}</h1></div><section className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Status</p><p className="mt-2 text-xl font-semibold">{p.status}</p><p className="text-sm text-gray-500 mt-4">Year</p><p className="text-lg">{p.year}</p></section></div>;
}
