import { getServiceClient } from '../../../../lib/auth';
import { formatDate } from '../../../../lib/admin-data';

export default async function TenantsPage() {
  const supabase = getServiceClient();
  const { data: accounts, error } = await supabase
    .from('accounts')
    .select('id, name, slug, status, created_at, updated_at')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-700">Platform directory</p>
        <h1 className="mt-1 text-3xl font-semibold text-gray-900">Tenants</h1>
        <p className="mt-2 text-sm text-gray-600">Live records from <code>accounts</code>.</p>
      </div>
      {error ? <p className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load tenants: {error.message}</p> : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-5 py-3">Tenant</th><th className="px-5 py-3">Slug</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Created</th><th className="px-5 py-3">Updated</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {(accounts || []).map((account) => <tr key={account.id}><td className="px-5 py-4 font-medium text-gray-900">{account.name}<p className="mt-1 font-mono text-xs text-gray-400">{account.id}</p></td><td className="px-5 py-4 text-gray-600">{account.slug || '—'}</td><td className="px-5 py-4 text-gray-600">{account.status || '—'}</td><td className="px-5 py-4 text-gray-600">{formatDate(account.created_at)}</td><td className="px-5 py-4 text-gray-600">{formatDate(account.updated_at)}</td></tr>)}
              {!accounts?.length && <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-500">No tenant records available.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
