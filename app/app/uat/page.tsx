import { getServiceClient } from '../../lib/auth';
import Link from 'next/link';

type UatCase = { id: string; title?: string; tender_name?: string | null; threshold_time_saved_minutes?: number; threshold_errors_prevented?: number; threshold_margin_uplift_pct?: number; status?: string };
type Bid = { id: string; name?: string; issuer?: string; status?: string };
export default async function UATPage() {
  const supabase = getServiceClient();
  const { data: cases } = await supabase.from('uat_test_cases').select('id, title, description, tender_name, expected_time_saved_minutes, expected_errors_prevented, expected_margin_uplift_pct, threshold_time_saved_minutes, threshold_errors_prevented, threshold_margin_uplift_pct, status, executed_at, result_summary').order('created_at');
  const { data: bids } = await supabase.from('bid_sessions').select('id, name, issuer, status').order('created_at', { ascending: false }).limit(10);
  const testCases = (cases || []) as UatCase[];
  const recentBids = (bids || []) as Bid[];
  return (
    <div className="space-y-8">
      <div><p className="text-sm font-medium text-blue-700">UAT</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">User acceptance testing</h1><p className="mt-2 text-sm text-gray-600">Execute test cases against real tenders and record results against thresholds.</p></div>
      <section className="rounded-lg border border-gray-200 bg-white"><div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Test cases</h2></div><div className="overflow-x-auto"><table className="min-w-full text-sm"><thead><tr className="text-left text-gray-600"><th className="px-5 py-3">Title</th><th className="px-5 py-3">Tender</th><th className="px-5 py-3">Thresholds (time/errors/margin)</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Actions</th></tr></thead><tbody>{testCases.map((c: UatCase) => <tr key={c.id} className="border-t"><td className="px-5 py-3">{c.title}</td><td className="px-5 py-3">{c.tender_name || '—'}</td><td className="px-5 py-3">{c.threshold_time_saved_minutes} min / {c.threshold_errors_prevented} / {c.threshold_margin_uplift_pct}%</td><td className="px-5 py-3">{c.status}</td><td className="px-5 py-3">{c.status === 'open' && <form action={`/app/uat/${c.id}/start`} method="post"><button type="submit" className="text-blue-600 underline">Start</button></form>}{c.status === 'in_progress' && <Link href={`/app/uat/${c.id}/complete`} className="text-green-600 underline">Complete</Link>}</td></tr>)}</tbody></table></div></section>
      <section className="rounded-lg border border-gray-200 bg-white"><div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Recent tenders</h2></div><div className="p-5 text-sm">{recentBids.length ? recentBids.map((b: Bid) => <div key={b.id} className="py-1"><Link className="text-blue-600 underline" href={`/app/tenders/${b.id}`}>{b.name}</Link> — {b.issuer} <span className="text-gray-400">({b.status})</span></div>) : <p className="text-gray-500">No tenders yet.</p>}</div></section>
    </div>
  );
}
