'use client';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function NewTenderPage() {
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [verticalId, setVerticalId] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();

  async function createSession() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert('Not signed in');
    const { data, error } = await supabase.from('bid_sessions').insert({ name, issuer, vertical_id: verticalId || null, created_by: user.id, status: 'draft' }).select().single();
    setLoading(false);
    if (!error && data) router.push(`/app/tenders/${data.id}`);
    else alert(error?.message || 'Failed to create bid session');
  }

  return (
    <div className="space-y-6">
      <div><p className="text-sm font-medium text-blue-700">Bid workspace</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">New tender</h1><p className="mt-2 text-sm text-gray-600">Start a new complex bid (fire apparatus, heavy equipment, infrastructure).</p></div>
      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4 max-w-xl">
        <div><label className="block text-sm font-medium text-gray-700">Tender name</label><input className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. City of Example Fire Apparatus 2026" /></div>
        <div><label className="block text-sm font-medium text-gray-700">Issuer</label><input className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" value={issuer} onChange={e=>setIssuer(e.target.value)} placeholder="e.g. City of Example" /></div>
        <div><label className="block text-sm font-medium text-gray-700">Vertical (optional)</label><input className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" value={verticalId} onChange={e=>setVerticalId(e.target.value)} placeholder="vertical UUID or leave blank" /></div>
        <button disabled={loading || !name} onClick={createSession} className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Create bid session</button>
      </div>
    </div>
  );
}
