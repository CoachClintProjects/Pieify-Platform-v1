import { getServiceClient } from '../../../lib/auth';

export default async function ERPImportPage() {
  const supabase = getServiceClient();
  const { data: imports } = await supabase.from('erp_import_staging').select('id, source, raw_json, status, created_at').order('created_at', { ascending: false }).limit(20);

  return (
    <div className="space-y-8">
      <div><p className="text-sm font-medium text-blue-700">ERP</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">CSV/JSON import</h1><p className="mt-2 text-sm text-gray-600">Import ERP data (suppliers, items, POs) as CSV or JSON. This is the bridge to NetSuite/SAP.</p></div>
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <form
          action={async (fd) => {
            'use server';
            const supabase = getServiceClient();
            const { data: { user } } = await supabase.auth.getUser();
            const source = fd.get('source') as string;
            const raw = fd.get('raw_json') as string;
            try {
              const parsed = JSON.parse(raw);
              await supabase.from('erp_import_staging').insert({ account_id: user?.id, source, raw_json: parsed });
            } catch {
              // ignore parse errors for now
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">Source</label>
            <input name="source" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" placeholder="e.g. netsuite_suppliers" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">JSON payload</label>
            <textarea name="raw_json" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" rows={6} placeholder='{"supplier":"Example","items":[]}' required />
          </div>
          <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white">Import</button>
        </form>
      </section>
      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Recent imports</h2></div>
        <div className="overflow-x-auto"><table className="min-w-full text-sm"><thead><tr class="text-left text-gray-600"><th class="px-5 py-3">Source</th><th class="px-5 py-3">Status</th><th class="px-5 py-3">Created</th></tr></thead><tbody>{imports?.map(i=>(<tr key={i.id} class="border-t"><td class="px-5 py-3">{i.source}</td><td class="px-5 py-3">{i.status}</td><td class="px-5 py-3">{new Date(i.created_at).toLocaleString()}</td></tr>))}</tbody></table></div>
      </section>
    </div>
  );
}
