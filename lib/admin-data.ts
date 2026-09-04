import { getSupabaseServerClient } from './auth';

export async function getAdminMetrics() {
  const supabase = getSupabaseServerClient();
  const { data: aiRuns } = await supabase.from('ai_runs').select('input_tokens, output_tokens, total_cost');
  const { data: costLedger } = await supabase.from('platform_cost_ledger').select('amount');
  return { aiRuns, costLedger };
}

export function formatCurrency(value: number | null | undefined, currency = 'USD') {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
}

export function formatDate(value: string | null | undefined) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

export function formatNumber(value: number | null | undefined) {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-US').format(value);
}
