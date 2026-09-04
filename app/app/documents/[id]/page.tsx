import { getServiceClient } from '../../../lib/auth';
import { notFound } from 'next/navigation';
import { formatDate } from '../../../lib/admin-data';

type Row = Record<string, any>;

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getServiceClient();
  const { data: doc } = await db.from('documents').select('*').eq('id', id).single();
  if (!doc) notFound();
  const d: Row = doc;
  return <div className="space-y-8"><div><p className="text-sm font-medium text-blue-700">Documents</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">{d.filename}</h1></div><section className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Status</p><p className="mt-2 text-xl font-semibold">{d.status}</p><p className="text-sm text-gray-500 mt-4">Type</p><p className="text-lg">{d.document_type}</p><p className="text-sm text-gray-500 mt-4">Size</p><p className="text-lg">{Number(d.file_size).toLocaleString()} bytes</p><p className="text-sm text-gray-500 mt-4">Created</p><p className="text-lg">{formatDate(d.created_at)}</p></section></div>;
}
