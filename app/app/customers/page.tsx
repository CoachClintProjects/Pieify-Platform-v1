'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function CustomersPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('customers').select('id, name, legal_name, customer_number, status, created_at').order('created_at', { ascending: false });
      if (!error && data) setRows(data);
      setLoading(false);
    })();
  }, [supabase]);

  if (loading) return <p className="text-sm text-gray-500">Loading customers…</p>;
  if (!rows.length) return <p className="text-sm text-gray-500">No customer records available.</p>;

  return (
    <div className="space-y-6">
      <div><p className="text-sm font-medium text-blue-700">CRM</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Customers</h1><p className="mt-2 text-sm text-gray-600">Live records from <code>customers</code>.</p></div>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Number</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Added</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map(r => <tr key={r.id}><td className="px-5 py-4"><p className="font-medium text-gray-900">{r.name}</p>{r.legal_name && <p className="text-gray-500">{r.legal_name}</p>}</td><td className="px-5 py-4 text-gray-600">{r.customer_number || '—'}</td><td className="px-5 py-4 text-gray-600">{r.status}</td><td className="px-5 py-4 text-gray-600">{new Date(r.created_at).toLocaleDateString()}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
