'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ReportsPage() {
  const [spend, setSpend] = useState<any>(null);
  const [bids, setBids] = useState<any>(null);
  const [ai, setAi] = useState<any>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    (async () => {
      const { count: spendCount } = await supabase.from('spend_transactions').select('*', { count: 'exact', head: true });
      const { count: bidCount } = await supabase.from('bid_sessions').select('*', { count: 'exact', head: true });
      const { data: aiData } = await supabase.from('ai_run_usage').select('input_tokens, output_tokens, estimated_cost');
      const aiTotals = (aiData || []).reduce((acc, r) => ({ input: acc.input + Number(r.input_tokens||0), output: acc.output + Number(r.output_tokens||0), cost: acc.cost + Number(r.estimated_cost||0) }), { input: 0, output: 0, cost: 0 });
      setSpend({ count: spendCount || 0 });
      setBids({ count: bidCount || 0 });
      setAi(aiTotals);
    })();
  }, [supabase]);

  return (
    <div className="space-y-6">
      <div><p className="text-sm font-medium text-blue-700">Analytics</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Platform reports</h1><p className="mt-2 text-sm text-gray-600">Live aggregates across core tables.</p></div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Spend transactions</p><p className="mt-2 text-2xl font-semibold">{spend ? spend.count : '…'}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Bid sessions</p><p className="mt-2 text-2xl font-semibold">{bids ? bids.count : '…'}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">AI usage (tokens)</p><p className="mt-2 text-2xl font-semibold">{ai ? `${ai.input.toLocaleString()} in / ${ai.output.toLocaleString()} out` : '…'}</p><p className="text-xs text-gray-500">Estimated cost: {ai ? `$${ai.cost.toFixed(2)}` : '…'}</p></div>
      </div>
    </div>
  );
}
