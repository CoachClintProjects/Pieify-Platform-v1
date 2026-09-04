import { getServiceClient } from '../../../lib/auth';
import { notFound } from 'next/navigation';
import { formatCurrency } from '../../../lib/admin-data';

type Row = Record<string, any>;

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getServiceClient();
  const { data: quote } = await db.from('quotes').select('*').eq('id', id).single();
  if (!quote) notFound();
  const q: Row = quote;
  return <div className="space-y-8"><div><p className="text-sm font-medium text-blue-700">Quotes</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">{q.quote_number}</h1></div><section className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Status</p><p className="mt-2 text-xl font-semibold">{q.status}</p><p className="text-sm text-gray-500 mt-4">Total</p><p className="text-lg">{formatCurrency(Number(q.total))} {q.currency}</p></section></div>;
}
