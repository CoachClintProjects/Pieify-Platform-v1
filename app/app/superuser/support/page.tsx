import { getServiceClient } from '../../../lib/auth';

export default async function SuperuserSupportPage() {
  const supabase = getServiceClient();
  const { data: tickets } = await supabase.from('support_tickets').select('*, accounts(name)').order('created_at', { ascending: false });
  const open = tickets?.filter(t=>t.status!=='resolved').length || 0;
  const resolved = tickets?.filter(t=>t.status==='resolved').length || 0;
  const breaches = tickets?.filter(t=>t.sla_breach).length || 0;
  const totalMinutes = tickets?.reduce((sum,t)=>sum+(t.time_spent_minutes||0),0) || 0;

  return (
    <div className="space-y-8">
      <div><p className="text-sm font-medium text-blue-700">Superuser</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Support tickets</h1><p className="mt-2 text-sm text-gray-600">Issues, SLA, time spent, resolution rate.</p></div>
      <section className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Open</p><p className="mt-2 text-2xl font-semibold">{open}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Resolved</p><p className="mt-2 text-2xl font-semibold">{resolved}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">SLA breaches</p><p className="mt-2 text-2xl font-semibold text-red-600">{breaches}</p></div>
        <div className="rounded-lg border border-gray-200 bg-white p-5"><p className="text-sm text-gray-500">Time spent (min)</p><p className="mt-2 text-2xl font-semibold">{totalMinutes}</p></div>
      </section>
      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">Tickets</h2></div>
        <div className="overflow-x-auto"><table className="min-w-full text-sm"><thead><tr class="text-left text-gray-600"><th class="px-5 py-3">Account</th><th class="px-5 py-3">Subject</th><th class="px-5 py-3">Severity</th><th class="px-5 py-3">Status</th><th class="px-5 py-3">Time (min)</th></tr></thead><tbody>{tickets?.map(t=>(<tr key={t.id} class="border-t"><td class="px-5 py-3">{(t.accounts as any)?.name || '—'}</td><td class="px-5 py-3">{t.subject}</td><td class="px-5 py-3">{t.severity}</td><td class="px-5 py-3">{t.status}</td><td class="px-5 py-3">{t.time_spent_minutes}</td></tr>))}</tbody></table></div>
      </section>
    </div>
  );
}
