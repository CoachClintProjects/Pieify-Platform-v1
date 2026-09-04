import Link from 'next/link';
import { getServiceClient } from '../../lib/auth';

export const dynamic = 'force-dynamic';
const n = (v: unknown) => Number(v || 0).toLocaleString();
const dt = (v: unknown) => v ? new Date(String(v)).toLocaleString() : '—';
const money = (v: unknown) => `$${Number(v || 0).toFixed(2)}`;

async function count(db: any, table: string, filter?: (q: any) => any) {
  let q = db.from(table).select('*', { count: 'exact', head: true });
  if (filter) q = filter(q);
  const { count, error } = await q;
  return error ? null : count ?? 0;
}

export default async function SuperuserHome() {
  const db = await getServiceClient();
  const [organizations, users, tenders, inventory, demos, aiRuns, toolCalls, workflows, syncRuns, audit, usage, cost, exceptions, tickets] = await Promise.all([
    count(db,'accounts'), count(db,'profiles'), count(db,'bid_sessions'), count(db,'inventory_items'), count(db,'demo_requests'), count(db,'ai_runs'), count(db,'ai_tool_calls'), count(db,'document_workflows'), count(db,'integration_sync_runs'), count(db,'audit_events'), count(db,'ai_run_usage'), count(db,'platform_cost_ledger'), count(db,'exception_queue_items'), count(db,'support_tickets', q => q.not('status','in',['closed','resolved']))
  ]);
  const [usageRows, runs, tools, demoRows, workflowRows, syncRows, auditRows, ticketRows] = await Promise.all([
    db.from('ai_run_usage').select('provider,model,input_tokens,output_tokens,cached_input_tokens,actual_cost,estimated_cost,created_at').order('created_at',{ascending:false}).limit(20),
    db.from('ai_runs').select('id,run_type,model,status,started_at,completed_at').order('started_at',{ascending:false}).limit(12),
    db.from('ai_tool_calls').select('id,ai_run_id,tool_name,status,latency_ms,created_at').order('created_at',{ascending:false}).limit(12),
    db.from('demo_requests').select('id,first_name,last_name,company,email,status,created_at').order('created_at',{ascending:false}).limit(8),
    db.from('document_workflows').select('id,name,status,current_step,updated_at').order('updated_at',{ascending:false}).limit(8),
    db.from('integration_sync_runs').select('id,direction,entity_type,status,records_read,records_written,records_failed,started_at').order('started_at',{ascending:false}).limit(8),
    db.from('audit_events').select('id,event_type,entity_type,action,occurred_at').order('occurred_at',{ascending:false}).limit(10),
    db.from('support_tickets').select('id,subject,status,priority,requester_name,requester_email,created_at').not('status','in',['closed','resolved']).order('created_at',{ascending:false}).limit(8)
  ]);
  const u=usageRows.data||[], r=runs.data||[], t=tools.data||[];
  const input=u.reduce((a:any,x:any)=>a+Number(x.input_tokens||0),0), output=u.reduce((a:any,x:any)=>a+Number(x.output_tokens||0),0), cached=u.reduce((a:any,x:any)=>a+Number(x.cached_input_tokens||0),0), aiCost=u.reduce((a:any,x:any)=>a+Number(x.actual_cost||x.estimated_cost||0),0);
  const failedRuns=r.filter((x:any)=>['failed','error'].includes(String(x.status||'').toLowerCase())).length;
  const failedTools=t.filter((x:any)=>['failed','error'].includes(String(x.status||'').toLowerCase())).length;
  const openDemos=(demoRows.data||[]).filter((x:any)=>!['closed','completed','converted'].includes(String(x.status||'').toLowerCase())).length;
  return <div className="space-y-7">
    <header className="flex items-end justify-between gap-5"><div><p className="text-xs font-semibold uppercase tracking-wider text-blue-700">PIEify Platform Control Plane</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">Good afternoon. Here is what is happening.</h1><p className="mt-2 text-sm text-gray-600">Everything below is sourced from production records. No demo telemetry. No invented numbers.</p></div><div className="text-right text-xs text-gray-500">Friday, September 4, 2026<br/><b className="text-gray-700">Live production</b></div></header>
    <section className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-7">{[['Organizations',organizations],['Users',users],['Tenders',tenders],['Inventory',inventory],['Demo requests',demos],['AI runs',aiRuns],['Open tickets',tickets]].map(([label,value])=><div key={String(label)} className="rounded-lg border border-gray-200 bg-white p-4"><div className="text-xs text-gray-500">{label}</div><div className="mt-1 text-2xl font-semibold">{value===null?'—':n(value)}</div></div>)}</section>
    <section className="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
      <Panel title="AI agents — what are they doing?" subtitle="Run status, models, token consumption and tool execution."><div className="grid grid-cols-4 border-b border-gray-200"><Stat label="Input tokens" value={n(input)}/><Stat label="Output tokens" value={n(output)}/><Stat label="Cached input" value={n(cached)}/><Stat label="Observed AI cost" value={money(aiCost)}/></div><div className="divide-y divide-gray-100">{r.slice(0,7).map((x:any)=><div key={x.id} className="flex items-center justify-between px-5 py-3 text-sm"><div><b>{x.run_type||'AI run'}</b><span className="ml-2 text-xs text-gray-500">{x.model||'model unknown'}</span></div><div className="flex gap-4 text-xs text-gray-500"><span>{dt(x.started_at)}</span><span className="rounded-full bg-gray-100 px-2 py-1">{x.status||'unknown'}</span></div></div>)}{!r.length&&<Empty text="No AI runs recorded."/>}</div></Panel>
      <Panel title="Attention required" subtitle="Failures and work that actually need intervention."><Row label="Failed AI runs" value={failedRuns} danger/><Row label="Failed AI tool calls" value={failedTools} danger/><Row label="Open exceptions" value={exceptions===null?'—':exceptions}/><Row label="Outstanding demo requests" value={openDemos}/><Row label="Open support tickets" value={tickets===null?'—':tickets}/></Panel>
    </section>
    <section className="grid gap-5 lg:grid-cols-2">
      <Panel title="Demo requests" subtitle="Inbound demand from the PIEify site."><div className="divide-y divide-gray-100">{(demoRows.data||[]).map((x:any)=><div key={x.id} className="flex justify-between px-5 py-3"><div><b className="text-sm">{[x.first_name,x.last_name].filter(Boolean).join(' ')||'Unnamed'}</b><div className="text-xs text-gray-500">{x.company||'Company not supplied'} · {x.email||'Email not supplied'}</div></div><span className="text-xs">{x.status||'unknown'}</span></div>)}{!(demoRows.data||[]).length&&<Empty text="No demo requests recorded."/>}</div></Panel>
      <Panel title="Support queue" subtitle="Customer issues that are still open."><div className="divide-y divide-gray-100">{(ticketRows.data||[]).map((x:any)=><div key={x.id} className="flex justify-between px-5 py-3"><div><b className="text-sm">{x.subject}</b><div className="text-xs text-gray-500">{x.requester_name||x.requester_email||'Requester not supplied'}</div></div><div className="text-right text-xs"><b>{x.priority}</b><div className="text-gray-500">{x.status}</div></div></div>)}{!(ticketRows.data||[]).length&&<Empty text="No open support tickets."/>}</div></Panel>
    </section>
    <section className="grid gap-5 lg:grid-cols-2">
      <Panel title="Automations & integrations" subtitle="Document workflows and external synchronization runs."><div className="divide-y divide-gray-100">{(workflowRows.data||[]).map((x:any)=><div key={x.id} className="flex justify-between px-5 py-3 text-sm"><div><b>{x.name||'Unnamed workflow'}</b><div className="text-xs text-gray-500">Step {x.current_step??'—'} · {dt(x.updated_at)}</div></div><span className="text-xs">{x.status||'unknown'}</span></div>)}{!(workflowRows.data||[]).length&&<Empty text="No document workflows recorded."/>}</div><div className="border-t border-gray-200 px-5 py-3 text-xs font-semibold text-gray-600">Integration runs: {syncRuns===null?'—':n(syncRuns)}</div></Panel>
      <Panel title="Platform economics" subtitle="AI usage and platform cost ledger."><div className="grid grid-cols-2"><Stat label="AI usage rows" value={usage===null?'—':n(usage)}/><Stat label="Cost ledger rows" value={cost===null?'—':n(cost)}/></div><div className="border-t border-gray-200 px-5 py-4 text-sm"><div className="flex justify-between"><span>Recent AI cost</span><b>{money(aiCost)}</b></div><div className="mt-2 flex justify-between"><span>Token records shown</span><b>{n(u.length)}</b></div></div></Panel>
    </section>
    <Panel title="Platform activity" subtitle="Audit events: the record of what changed on the platform."><div className="divide-y divide-gray-100">{(auditRows.data||[]).slice(0,8).map((x:any)=><div key={x.id} className="grid grid-cols-[150px_1fr_auto] gap-4 px-5 py-3 text-sm"><span className="text-xs text-gray-500">{dt(x.occurred_at)}</span><span><b>{x.action||x.event_type||'Event'}</b>{x.entity_type?` · ${x.entity_type}`:''}</span><span className="text-xs text-gray-500">{x.event_type||'—'}</span></div>)}{!(auditRows.data||[]).length&&<Empty text="No audit events recorded."/>}</div></Panel>
    <Panel title="AI tool activity" subtitle="The tools agents are invoking and whether those calls succeed."><div className="grid gap-2 md:grid-cols-2">{t.slice(0,8).map((x:any)=><div key={x.id} className="rounded border border-gray-200 px-4 py-3 text-sm flex justify-between"><span><b>{x.tool_name||'Unknown tool'}</b><span className="ml-2 text-xs text-gray-500">{x.latency_ms??'—'} ms</span></span><span className="text-xs">{x.status||'unknown'}</span></div>)}{!t.length&&<Empty text="No AI tool calls recorded."/>}</div></Panel>
  </div>;
}
function Panel({title,subtitle,children}:{title:string;subtitle:string;children:React.ReactNode}){return <section className="rounded-lg border border-gray-200 bg-white"><div className="border-b border-gray-200 px-5 py-4"><h2 className="font-semibold text-gray-900">{title}</h2><p className="mt-1 text-xs text-gray-500">{subtitle}</p></div>{children}</section>}
function Stat({label,value}:{label:string;value:string}){return <div className="p-5"><div className="text-xs text-gray-500">{label}</div><div className="mt-1 text-xl font-semibold">{value}</div></div>}
function Row({label,value,danger=false}:{label:string;value:any;danger?:boolean}){return <div className="flex justify-between border-b border-gray-100 px-5 py-4 text-sm"><span>{label}</span><b className={danger?'text-red-700':''}>{typeof value==='number'?n(value):value}</b></div>}
function Empty({text}:{text:string}){return <div className="px-5 py-6 text-sm text-gray-500">{text}</div>}
