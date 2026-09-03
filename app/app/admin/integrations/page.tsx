'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function IntegrationsPage() {
  const [systems, setSystems] = useState<any[]>([]);
  const [eventsIn, setEventsIn] = useState<any[]>([]);
  const [eventsOut, setEventsOut] = useState<any[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.from('external_systems').select('id, name, system_type, base_url, is_active, updated_at').order('created_at', { ascending: false });
      const { data: ein } = await supabase.from('integration_events_in').select('id, event_type, entity_type, processed, error, created_at').order('created_at', { ascending: false }).limit(25);
      const { data: eout } = await supabase.from('integration_events_out').select('id, event_type, status, system_id, created_at').order('created_at', { ascending: false }).limit(25);
      if (s) setSystems(s);
      if (ein) setEventsIn(ein);
      if (eout) setEventsOut(eout);
    })();
  }, [supabase]);

  return (
    <div className="space-y-8">
      <div><p className="text-sm font-medium text-blue-700">Platform administration</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Integrations</h1><p className="mt-2 text-sm text-gray-600">Configure external systems and monitor integration health.</p></div>
      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">External systems</h2></div>
        <div className="p-5">
          {systems.length ? (
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-5 py-3">System</th><th className="px-5 py-3">Type</th><th className="px-5 py-3">Base URL</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Updated</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {systems.map(sys => <tr key={sys.id}><td className="px-5 py-4 font-medium">{sys.name}</td><td className="px-5 py-4 text-gray-600">{sys.system_type}</td><td className="px-5 py-4 text-gray-600">{sys.base_url || '—'}</td><td className="px-5 py-4 text-gray-600">{sys.is_active ? 'Active' : 'Inactive'}</td><td className="px-5 py-4 text-gray-600">{new Date(sys.updated_at).toLocaleString()}</td></tr>)}
              </tbody>
            </table>
          ) : <p className="text-sm text-gray-500">No external systems configured yet.</p>}
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Inbound events</h2></div>
          <div className="p-5 text-sm">
            {eventsIn.length ? eventsIn.map(e => <div key={e.id} className="py-1"><span className="font-medium">{e.event_type}</span> {e.entity_type && <span>→ {e.entity_type}</span>} — {e.processed ? 'Processed' : 'Pending'} {e.error && <span className="text-red-600">({e.error})</span>} <span className="text-gray-400">{new Date(e.created_at).toLocaleString()}</span></div>) : <p className="text-gray-500">No inbound events.</p>}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Outbound events</h2></div>
          <div className="p-5 text-sm">
            {eventsOut.length ? eventsOut.map(e => <div key={e.id} className="py-1"><span className="font-medium">{e.event_type}</span> → system {e.system_id} — <span className={e.status==='sent'?'text-green-600':e.status==='failed'?'text-red-600':'text-gray-600'}>{e.status}</span> <span className="text-gray-400">{new Date(e.created_at).toLocaleString()}</span></div>) : <p className="text-gray-500">No outbound events.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
