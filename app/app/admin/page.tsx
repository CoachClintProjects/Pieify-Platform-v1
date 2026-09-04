import Link from 'next/link';
import { getAdminMetrics, formatCurrency, formatDate } from '../../../lib/admin-data';

export const dynamic = 'force-dynamic';

type Row = Record<string, any>;

export default async function AdminPage() {
  const m = await getAdminMetrics();
  const db = (await import('../../../lib/auth')).getSupabaseServerClient();
  const [demoQ, ticketQ, userQ, subQ, tenderQ] = await Promise.all([
    db.from('demo_requests').select('id,first_name,last_name,company,email,status,created_at').order('created_at',{ascending:false}).limit(5),
    db.from('support_tickets').select('id,subject,status,priority,requester_name,created_at').not('status','in',['closed','resolved']).order('created_at',{ascending:false}).limit(5),
    db.from('user_profiles').select('id,email,role,created_at').order('created_at',{ascending:false}).limit(5),
    db.from('subscriptions').select('*').order('created_at',{ascending:false}).limit(5),
    db.from('bid_sessions').select('id,name,issuer,status,submission_deadline,updated_at').order('updated_at',{ascending:false}).limit(5),
  ]);
  const demos: Row[] = demoQ.data || [];
  const tickets: Row[] = ticketQ.data || [];
  const users: Row[] = userQ.data || [];
  const subs: Row[] = subQ.data || [];
  const tenders: Row[] = tenderQ.data || [];
  return <div className="admin-home">
    <div className="hs-breadcrumb">ADMIN / HOME</div>
    <header className="admin-head"><div><h1 className="hs-page-title">Good afternoon.</h1><p className="hs-page-sub">Your organization at a glance. Manage people, subscription, access and procurement activity.</p></div><div className="admin-date">{new Date().toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'})}</div></header>
    <section className="admin-grid admin-grid-top">
      <Card title="People & access" action="Manage users" href="/app/admin/users"><Metric label="Profiles" value={m.profileCount}/><Metric label="Accounts" value={m.accountCount}/><Metric label="Subscriptions" value={m.subscriptionCount}/></Card>
      <Card title="Usage" action="View usage" href="/app/admin/usage"><Metric label="AI runs" value={m.aiRunCount}/><Metric label="Input tokens" value={m.tokenTotals.input}/><Metric label="Output tokens" value={m.tokenTotals.output}/></Card>
      <Card title="Attention" action="Support" href="/app/admin/support"><Metric label="Security events" value={m.securityCount}/><Metric label="Audit events" value={m.auditCount}/><Metric label="Open tickets" value={tickets.length}/></Card>
    </section>
    <section className="admin-section"><div><h2>Today at a glance</h2><p>Account activity and items that may need action.</p></div></section>
    <section className="admin-grid admin-grid-main">
      <Card title="Procurement activity" action="Open tenders" href="/app/tenders"><div className="admin-list">{tenders.map((r,i)=><Link href={`/app/tenders/${r.id}`} className="admin-row" key={r.id||i}><span><b>{r.name||'Unnamed tender'}</b><small>{r.issuer||'Issuer not supplied'} · {r.status||'Unknown'}</small></span><strong>{r.submission_deadline?new Date(r.submission_deadline).toLocaleDateString():'—'}</strong></Link>)}{!tenders.length&&<Empty text="No tender activity recorded in production."/>}</div></Card>
      <Card title="Support" action="View queue" href="/app/admin/support"><div className="admin-list">{tickets.map((t,i)=><div className="admin-row" key={t.id||i}><span><b>{t.subject||'Untitled ticket'}</b><small>{t.requester_name||'Requester not supplied'} · {t.status||'Unknown'}</small></span><strong>{t.priority||'—'}</strong></div>)}{!tickets.length&&<Empty text="No open support tickets."/>}</div></Card>
    </section>
    <section className="admin-grid admin-grid-main">
      <Card title="Recent people" action="Manage users" href="/app/admin/users"><div className="admin-list">{users.map((u,i)=><div className="admin-row" key={u.id||i}><span><b>{u.email||'User'}</b><small>{u.role||'Role not supplied'} · {formatDate(u.created_at)}</small></span></div>)}{!users.length&&<Empty text="No user profiles in production."/>}</div></Card>
      <Card title="Subscription" action="View subscriptions" href="/app/admin/subscriptions"><div className="admin-list">{subs.map((s,i)=><div className="admin-row" key={s.id||i}><span><b>{s.plan||s.product||s.name||'Subscription'}</b><small>{s.status||'Status not supplied'}</small></span><strong>{formatCurrency(Number(s.amount||s.monthly_amount||0))}</strong></div>)}{!subs.length&&<Empty text="No subscription records in production."/>}</div></Card>
    </section>
    <section className="admin-section"><div><h2>Recent AI activity</h2><p>Actual recorded runs and platform cost. No synthetic usage.</p></div></section>
    <section className="admin-ai"><div className="admin-ai-head"><span>Run</span><span>Status</span><span>Started</span><span>Cost</span></div>{m.aiRuns.slice(0,8).map((r:Row,i)=><div className="admin-ai-row" key={r.id||i}><b>{r.run_type||r.name||'AI run'}</b><span>{r.status||'Unknown'}</span><span>{formatDate(r.started_at||r.created_at)}</span><span>{formatCurrency(Number(r.total_cost??r.cost_usd??0))}</span></div>)}{!m.aiRuns.length&&<Empty text="No AI runs recorded in production."/>}</section>
    <style>{`.admin-home{max-width:1500px}.admin-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:24px}.admin-date{font-size:12px;color:#718191}.admin-grid{display:grid;gap:16px}.admin-grid-top{grid-template-columns:repeat(3,minmax(0,1fr))}.admin-grid-main{grid-template-columns:repeat(2,minmax(0,1fr));margin-top:16px}.admin-card{background:#fff;border:1px solid #d7e0e7;border-radius:5px;overflow:hidden}.admin-card-head{display:flex;justify-content:space-between;align-items:center;padding:15px 17px;border-bottom:1px solid #e5eaee}.admin-card-head h3{font-size:14px;margin:0;color:#243746}.admin-card-head a{font-size:11px;color:#0b63ce;font-weight:700}.admin-metric{display:flex;justify-content:space-between;align-items:center;padding:13px 17px;border-bottom:1px solid #edf0f3}.admin-metric:last-child{border-bottom:0}.admin-metric span{font-size:11px;color:#718191}.admin-metric strong{font-size:19px;color:#243746}.admin-section{display:flex;align-items:flex-end;margin:28px 0 12px}.admin-section h2{font-size:17px;margin:0;color:#243746}.admin-section p{font-size:11px;color:#718191;margin:4px 0 0}.admin-list{padding:0}.admin-row{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:12px 17px;border-bottom:1px solid #edf0f3;text-decoration:none;color:#243746}.admin-row:last-child{border-bottom:0}.admin-row b{display:block;font-size:12px;font-weight:600}.admin-row small{display:block;font-size:10px;color:#718191;margin-top:3px}.admin-row strong{font-size:11px;white-space:nowrap}.admin-ai{background:#fff;border:1px solid #d7e0e7;border-radius:5px;overflow:hidden}.admin-ai-head,.admin-ai-row{display:grid;grid-template-columns:2fr 1fr 1.4fr 1fr;gap:12px;padding:11px 17px;font-size:11px;border-bottom:1px solid #edf0f3}.admin-ai-head{background:#f7f9fb;color:#647685;font-weight:700}.admin-ai-row:last-child{border-bottom:0}.admin-ai-row span{color:#647685}.admin-empty{padding:24px 17px;font-size:11px;color:#718191}@media(max-width:900px){.admin-grid-top,.admin-grid-main{grid-template-columns:1fr}.admin-head{display:block}.admin-date{margin-top:8px}}`}</style>
  </div>;
}
function Card({title,action,href,children}:{title:string;action:string;href:string;children:React.ReactNode}){return <section className="admin-card"><div className="admin-card-head"><h3>{title}</h3><Link href={href}>{action}</Link></div>{children}</section>}
function Metric({label,value}:{label:string;value:number}){return <div className="admin-metric"><span>{label}</span><strong>{Number(value||0).toLocaleString()}</strong></div>}
function Empty({text}:{text:string}){return <div className="admin-empty">{text}</div>}
