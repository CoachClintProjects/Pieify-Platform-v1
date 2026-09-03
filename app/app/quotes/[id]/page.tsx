import { getServiceClient } from '../../../../lib/auth';
import { notFound } from 'next/navigation';

export default async function QuoteDetailPage({ params }: { params: { id: string } }) {
  const supabase = getServiceClient();
  const { data: quote } = await supabase.from('quotes').select('*, customers(name), bid_sessions(name)').eq('id', params.id).single();
  if (!quote) notFound();

  const { data: lines } = await supabase.from('quote_lines').select('id, description, quantity, unit_price, discount_rate, tax_rate, line_total').eq('quote_id', params.id);

  return (
    <div className="space-y-8">
      <div><p className="text-sm font-medium text-blue-700">Pricing</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Quote {quote.quote_number}</h1><p className="mt-2 text-sm text-gray-600">Live quote detail from <code>quotes</code> and <code>quote_lines</code>.</p></div>
      <section className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Customer</p><p className="mt-2 text-xl font-semibold">{(quote.customers as any)?.name || '—'}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Bid</p><p className="mt-2 text-xl font-semibold">{(quote.bid_sessions as any)?.name || '—'}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Status</p><p className="mt-2 text-xl font-semibold">{quote.status}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Total</p><p className="mt-2 text-xl font-semibold">{quote.currency} {Number(quote.total).toLocaleString()}</p></div>
      </section>
      <section className="rounded-lg border border-gray-200 bg-white"><div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Line items</h2></div><div className="p-5 text-sm text-gray-600">{lines?.length ? lines.map(l => <div key={l.id} className="py-1"><span className="font-medium">{l.description}</span> — {l.quantity} × {l.currency} {Number(l.unit_price).toLocaleString()} {l.discount_rate ? `(-${l.discount_rate}%)` : ''} {l.tax_rate ? `(+${l.tax_rate}%)` : ''} = <span className="font-medium">{l.currency} {Number(l.line_total).toLocaleString()}</span></div>) : <p>No line items.</p>}</div></section>
    </div>
  );
}
