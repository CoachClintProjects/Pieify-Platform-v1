'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function IdentityPage() {
  const [sso, setSso] = useState<any[]>([]);
  const [scim, setScim] = useState<any[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.from('sso_providers').select('id, name, provider_type, issuer, is_active, updated_at').order('created_at', { ascending: false });
      const { data: c } = await supabase.from('scim_configs').select('id, base_url, is_active, updated_at').order('created_at', { ascending: false });
      if (s) setSso(s);
      if (c) setScim(c);
    })();
  }, [supabase]);

  return (
    <div className="space-y-8">
      <div><p className="text-sm font-medium text-blue-700">Platform administration</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Identity</h1><p className="mt-2 text-sm text-gray-600">SSO and SCIM configuration for enterprise deployment.</p></div>
      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">SSO providers</h2></div>
        <div className="p-5">
          {sso.length ? (
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-5 py-3">Provider</th><th className="px-5 py-3">Type</th><th className="px-5 py-3">Issuer</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Updated</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {sso.map(p => <tr key={p.id}><td className="px-5 py-4 font-medium">{p.name}</td><td className="px-5 py-4 text-gray-600">{p.provider_type}</td><td className="px-5 py-4 text-gray-600">{p.issuer || '—'}</td><td className="px-5 py-4 text-gray-600">{p.is_active ? 'Active' : 'Inactive'}</td><td className="px-5 py-4 text-gray-600">{new Date(p.updated_at).toLocaleString()}</td></tr>)}
              </tbody>
            </table>
          ) : <p className="text-sm text-gray-500">No SSO providers configured yet.</p>}
        </div>
      </section>
      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">SCIM configs</h2></div>
        <div className="p-5">
          {scim.length ? (
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-5 py-3">Base URL</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Updated</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {scim.map(c => <tr key={c.id}><td className="px-5 py-4 font-medium">{c.base_url}</td><td className="px-5 py-4 text-gray-600">{c.is_active ? 'Active' : 'Inactive'}</td><td className="px-5 py-4 text-gray-600">{new Date(c.updated_at).toLocaleString()}</td></tr>)}
              </tbody>
            </table>
          ) : <p className="text-sm text-gray-500">No SCIM configs configured yet.</p>}
        </div>
      </section>
    </div>
  );
}
