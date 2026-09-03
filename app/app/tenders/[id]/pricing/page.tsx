import { getServiceClient } from '../../../../lib/auth';
import { notFound } from 'next/navigation';

export default async function PricingPage({ params }: { params: { id: string } }) {
  const supabase = getServiceClient();
  const { data: bid } = await supabase.from('bid_sessions').select('*, verticals(name)').eq('id', params.id).single();
  if (!bid) notFound();

  const { data: quotes } = await supabase.from('quotes').select('id, quote_number, status, total, currency, valid_until, created_at').eq('bid_session_id', params.id).order('created_at', { ascending: false });
  const { data: costItems } = await supabase.from('cost_items').select('id, category, description, quantity, unit_cost, currency').eq('bid_session_id', params.id);

  return (
    <div className="space-y-8">
      <div><p className="text-sm font-medium text-blue-700">Bid workspace</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Pricing & offer — {bid.name}</h1><p className="mt-2 text-sm text-gray-600">Build cost model, apply margin/discounts, generate offer artifact.</p></div>
      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Quotes</h2></div>
        <div className="p-5 text-sm">
          {quotes?.length ? quotes.map(q => (
            <div key={q.id} class="py-1"><a class="text-blue-600 underline" href={`/app/quotes/${q.id}`}>{q.quote_number}</a> — {q.status} — {q.currency} {Number(q.total).toLocaleString()} {q.valid_until && <span class="text-gray-400">(valid until {new Date(q.valid_until).toLocaleDateString()})</span></div>
          )) : <p class="text-gray-500">No quotes yet.</p>}
        </div>
      </section>
      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Cost items</h2></div>
        <div className="p-5 text-sm">
          {costItems?.length ? costItems.map(c => <div key={c.id} class="py-1"><span class="font-medium">{c.category}</span> — {c.description} — {c.quantity} × {c.currency} {Number(c.unit_cost).toLocaleString()}</div>) : <p class="text-gray-500">No cost items.</p>}
        </div>
      </section>
    </div>
  );
}
