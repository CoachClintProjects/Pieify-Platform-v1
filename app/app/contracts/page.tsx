'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ContractsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('contracts').select('id, contract_number, title, status, start_date, end_date, value, currency, created_at').order('created_at', { ascending: false });
      if (!error && data) setRows(data);
      setLoading(false);
    })();
  }, [supabase]);

  if (loading) return <p className="text-sm text-gray-500">Loading contracts…</p>;
  if (!rows.length) return <p className="text-sm text-gray-500">No contract records available.</p>;

  return (
    <div className="space-y-6">
      <div><p className="text-sm font-medium text-blue-700">Contract management</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Contracts</h1><p className="mt-2 text-sm text-gray-600">Live records from <code>contracts</code>.</p></div>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-5 py-3">Contract</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Term</th><th className="px-5 py-3">Value</th><th className="px-5 py-3">Created</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map(r => <tr key={r.id}><td className="px-5 py-4"><p className="font-medium text-gray-900">{r.contract_number}</p><p className="text-gray-500">{r.title}</p></td><td className="px-5 py-4 text-gray-600">{r.status}</td><td className="px-5 py-4 text-gray-600">{r.start_date ? new Date(r.start_date).toLocaleDateString() : '—'} → {r.end_date ? new Date(r.end_date).toLocaleDateString() : '—'}</td><td className="px-5 py-4 text-gray-600">{r.value ? `${r.currency} ${Number(r.value).toLocaleString()}` : '—'}</td><td className="px-5 py-4 text-gray-600">{new Date(r.created_at).toLocaleDateString()}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
