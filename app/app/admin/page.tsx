import Link from 'next/link';
import { formatCurrency, formatNumber, getAdminMetrics } from '../../../lib/admin-data';

const destinations = [
  ['Tenants', '/app/admin/tenants', 'Accounts and tenant status'],
  ['Users', '/app/admin/users', 'Profiles, memberships, and roles'],
  ['Subscriptions', '/app/admin/subscriptions', 'Plan and subscription records'],
  ['AI runs', '/app/admin/ai-runs', 'Execution telemetry and model activity'],
  ['Token usage', '/app/admin/token-usage', 'Input and output token consumption'],
  ['Cost ledger', '/app/admin/cost-ledger', 'Platform operating costs'],
  ['Audit events', '/app/admin/audit', 'Immutable activity history'],
  ['Security', '/app/admin/security', 'License and integrity events'],
];

export default async function AdminPage() {
  const metrics = await getAdminMetrics();
  const cards = [
    ['Tenants', formatNumber(metrics.accountCount), '/app/admin/tenants'],
    ['Users', formatNumber(metrics.profileCount), '/app/admin/users'],
    ['Subscriptions', formatNumber(metrics.subscriptionCount), '/app/admin/subscriptions'],
    ['AI runs', formatNumber(metrics.aiRunCount), '/app/admin/ai-runs'],
    ['Tokens recorded', formatNumber(metrics.tokenTotals), '/app/admin/token-usage'],
    ['AI usage cost', formatCurrency(metrics.aiCost), '/app/admin/token-usage'],
    ['Ledger cost', formatCurrency(metrics.ledgerCost), '/app/admin/cost-ledger'],
    ['Security events', formatNumber(metrics.securityCount), '/app/admin/security'],
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-blue-700">Platform control plane</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">Platform administration</h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-600">Live operational data from the Pieify platform database. Counts and cost totals are calculated at request time.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, href]) => (
          <Link key={label} href={href} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
          </Link>
        ))}
      </section>

      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-900">Operational datasets</h2>
          <p className="mt-1 text-sm text-gray-500">{formatNumber(metrics.auditCount)} audit events currently recorded.</p>
        </div>
        <div className="grid divide-y divide-gray-100 md:grid-cols-2 md:divide-x md:divide-y-0">
          {destinations.map(([title, href, description]) => (
            <Link key={href} href={href} className="p-5 transition hover:bg-gray-50">
              <p className="font-medium text-gray-900">{title}</p>
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
