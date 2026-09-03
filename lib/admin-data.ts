import { getServiceClient } from './auth';

export async function getAdminMetrics() {
  const supabase = getServiceClient();
  const [
    accounts,
    profiles,
    subscriptions,
    aiRuns,
    usage,
    ledger,
    audits,
    security,
  ] = await Promise.all([
    supabase.from('accounts').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }),
    supabase.from('ai_runs').select('*', { count: 'exact', head: true }),
    supabase.from('ai_run_usage').select('input_tokens, output_tokens, total_cost'),
    supabase.from('platform_cost_ledger').select('amount'),
    supabase.from('audit_events').select('*', { count: 'exact', head: true }),
    supabase.from('license_integrity_events').select('*', { count: 'exact', head: true }),
  ]);

  const tokenTotals = (usage.data || []).reduce(
    (total, row) => total + Number(row.input_tokens || 0) + Number(row.output_tokens || 0),
    0,
  );
  const aiCost = (usage.data || []).reduce(
    (total, row) => total + Number(row.total_cost || 0),
    0,
  );
  const ledgerCost = (ledger.data || []).reduce(
    (total, row) => total + Number(row.amount || 0),
    0,
  );

  return {
    accountCount: accounts.count || 0,
    profileCount: profiles.count || 0,
    subscriptionCount: subscriptions.count || 0,
    aiRunCount: aiRuns.count || 0,
    tokenTotals,
    aiCost,
    ledgerCost,
    auditCount: audits.count || 0,
    securityCount: security.count || 0,
  };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatDate(value: string | null | undefined) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}
