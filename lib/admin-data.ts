import { getSupabaseServerClient } from './auth';

type Row = Record<string, any>;

export type AdminMetrics = {
  accountCount: number;
  profileCount: number;
  subscriptionCount: number;
  aiRunCount: number;
  tokenTotals: { input: number; output: number };
  aiCost: number;
  ledgerCost: number;
  securityCount: number;
  auditCount: number;
  aiRuns: Row[];
  costLedger: Row[];
};

async function countRows(db: any, table: string): Promise<number> {
  const { count } = await db.from(table).select('*', { count: 'exact', head: true });
  return count || 0;
}

export async function getAdminMetrics(): Promise<AdminMetrics> {
  const db = getSupabaseServerClient();
  const [{ data: aiRuns }, { data: costLedger }] = await Promise.all([
    db.from('ai_runs').select('*'),
    db.from('platform_cost_ledger').select('*'),
  ]);
  const runs: Row[] = aiRuns || [];
  const ledger: Row[] = costLedger || [];
  const [accountCount, profileCount, subscriptionCount, aiRunCount, securityCount, auditCount] = await Promise.all([
    countRows(db, 'accounts'), countRows(db, 'user_profiles'), countRows(db, 'subscriptions'), countRows(db, 'ai_runs'), countRows(db, 'security_events'), countRows(db, 'audit_log'),
  ]);
  return {
    accountCount, profileCount, subscriptionCount, aiRunCount, securityCount, auditCount,
    tokenTotals: { input: runs.reduce((sum: number, row: Row) => sum + Number(row.input_tokens || 0), 0), output: runs.reduce((sum: number, row: Row) => sum + Number(row.output_tokens || 0), 0) },
    aiCost: runs.reduce((sum: number, row: Row) => sum + Number(row.total_cost ?? row.cost_usd ?? 0), 0),
    ledgerCost: ledger.reduce((sum: number, row: Row) => sum + Number(row.amount ?? row.cost_usd ?? 0), 0),
    aiRuns: runs, costLedger: ledger,
  };
}

export function formatCurrency(value: number | null | undefined, currency = 'USD') { return value == null ? '—' : new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value); }
export function formatDate(value: string | null | undefined) { return value ? new Date(value).toLocaleString() : '—'; }
export function formatNumber(value: number | null | undefined) { return value == null ? '—' : new Intl.NumberFormat('en-US').format(value); }
