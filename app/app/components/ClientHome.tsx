import Link from 'next/link';

type Row = Record<string, any>;

const fmtDate = (v: any) => v ? new Date(String(v)).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}) : '—';
const status = (v: any) => String(v || 'Unknown');

export default async function ClientHome({ db }: { db: any }) {
  const [tendersQ, questionsQ, inventoryQ, docsQ, recentQ, questionRowsQ] = await Promise.all([
    db.from('bid_sessions').select('id',{count:'exact',head:true}),
    db.from('clarification_questions').select('id',{count:'exact',head:true}),
    db.from('inventory_items').select('id',{count:'exact',head:true}),
    db.from('documents').select('id',{count:'exact',head:true}),
    db.from('bid_sessions').select('id,name,issuer,status,submission_deadline,updated_at').order('updated_at',{ascending:false}).limit(6),
    db.from('clarification_questions').select('*').order('created_at',{ascending:false}).limit(8),
  ]);
  const tenders = tendersQ.count ?? 0;
  const questions = questionsQ.count ?? 0;
  const inventory = inventoryQ.count ?? 0;
  const documents = docsQ.count ?? 0;
  const rows: Row[] = recentQ.data || [];
  const qRows: Row[] = questionRowsQ.data || [];
  const openQuestions = qRows.filter(q => !['answered','closed','resolved'].includes(String(q.status||'').toLowerCase()));
  const upcoming = rows.filter(r => r.submission_deadline && new Date(r.submission_deadline).getTime() >= Date.now()).slice(0,5);

  return <div className="pie-home">
    <div className="hs-breadcrumb">HOME</div>
    <header className="pie-home-head">
      <div><h1 className="hs-page-title">Good afternoon.</h1><p className="hs-page-sub">Here is your procurement day at a glance.</p></div>
      <div className="pie-home-date">{new Date().toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'})}</div>
    </header>

    <section className="pie-home-grid pie-home-grid-top">
      <HomeCard title="Your work" action="View all" href="/app/tenders">
        <div className="pie-digest-row"><div><b>{tenders}</b><span>tenders in workspace</span></div><Link href="/app/tenders">Open tenders</Link></div>
        <div className="pie-digest-row"><div><b>{openQuestions.length}</b><span>questions awaiting an answer</span></div><Link href="/app/tenders">Review questions</Link></div>
        <div className="pie-digest-row"><div><b>{upcoming.length}</b><span>tenders with upcoming deadlines</span></div><Link href="/app/tenders">Review deadlines</Link></div>
      </HomeCard>
      <HomeCard title="Tasks & follow-up" action="Open questions" href="/app/tenders">
        {openQuestions.slice(0,4).map((q,i)=><Link className="pie-task" href="/app/tenders" key={q.id||i}><span className="pie-check"/><span><b>{q.question || q.text || q.title || 'Clarification question'}</b><small>{status(q.status)} · {fmtDate(q.created_at)}</small></span></Link>)}
        {!openQuestions.length && <Empty text="No unanswered clarification questions in production."/>}
      </HomeCard>
      <HomeCard title="Upcoming deadlines" action="Tenders" href="/app/tenders">
        {upcoming.map((r,i)=><Link className="pie-deadline" href={`/app/tenders/${r.id}`} key={r.id||i}><span><b>{r.name || 'Unnamed tender'}</b><small>{r.issuer || 'Issuer not supplied'}</small></span><strong>{fmtDate(r.submission_deadline)}</strong></Link>)}
        {!upcoming.length && <Empty text="No upcoming tender deadlines are recorded."/>}
      </HomeCard>
    </section>

    <section className="pie-section-head"><div><h2>Your day at a glance</h2><p>Live records from the PIEify workspace.</p></div></section>
    <section className="pie-home-grid pie-home-grid-main">
      <HomeCard title="Recent activity" action="Tenders" href="/app/tenders">
        {rows.slice(0,5).map((r,i)=><Link className="pie-activity" href={`/app/tenders/${r.id}`} key={r.id||i}><span className="pie-avatar">{String(r.name||'T').slice(0,1).toUpperCase()}</span><span><b>{r.name || 'Unnamed tender'}</b><small>{r.issuer || 'Issuer not supplied'} · {status(r.status)} · updated {fmtDate(r.updated_at)}</small></span></Link>)}
        {!rows.length && <Empty text="No tender activity recorded in production."/>}
      </HomeCard>
      <HomeCard title="Workspace" action="Inventory" href="/app/inventory">
        <Metric label="Tenders" value={tenders}/><Metric label="Open questions" value={questions}/><Metric label="Inventory units" value={inventory}/><Metric label="Documents" value={documents}/>
      </HomeCard>
    </section>

    <section className="pie-section-head"><div><h2>Continue working</h2><p>Jump directly into the procurement objects you use every day.</p></div></section>
    <div className="pie-object-links">
      <ObjectLink title="Tenders" body="Review bid sessions, deadlines and status." href="/app/tenders"/>
      <ObjectLink title="Requirements" body="Review extracted requirements and gaps." href="/app/tenders"/>
      <ObjectLink title="Inventory" body="Review apparatus and inventory records." href="/app/inventory"/>
      <ObjectLink title="Documents" body="Review source documents and addenda." href="/app/documents"/>
    </div>
    <style>{`.pie-home{max-width:1500px}.pie-home-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:24px}.pie-home-date{font-size:12px;color:#718191}.pie-home-grid{display:grid;gap:16px}.pie-home-grid-top{grid-template-columns:repeat(3,minmax(0,1fr))}.pie-home-grid-main{grid-template-columns:minmax(0,2fr) minmax(300px,1fr)}.pie-section-head{display:flex;align-items:flex-end;justify-content:space-between;margin:28px 0 12px}.pie-section-head h2{font-size:17px;margin:0;color:#243746}.pie-section-head p{font-size:11px;color:#718191;margin:4px 0 0}.pie-card{background:#fff;border:1px solid #d7e0e7;border-radius:5px;overflow:hidden}.pie-card-head{display:flex;justify-content:space-between;align-items:center;padding:15px 17px;border-bottom:1px solid #e5eaee}.pie-card-head h3{font-size:14px;margin:0;color:#243746}.pie-card-head a{font-size:11px;color:#0b63ce;font-weight:700}.pie-card-body{padding:0}.pie-digest-row{display:flex;justify-content:space-between;gap:10px;padding:14px 17px;border-bottom:1px solid #edf0f3}.pie-digest-row:last-child{border-bottom:0}.pie-digest-row b{display:block;font-size:22px;color:#1f3345}.pie-digest-row span{display:block;font-size:11px;color:#718191;margin-top:2px}.pie-digest-row a{font-size:11px;color:#0b63ce;align-self:center}.pie-task,.pie-deadline,.pie-activity{display:flex;align-items:center;gap:10px;padding:12px 17px;border-bottom:1px solid #edf0f3;text-decoration:none;color:#243746}.pie-task:last-child,.pie-deadline:last-child,.pie-activity:last-child{border-bottom:0}.pie-task b,.pie-deadline b,.pie-activity b{display:block;font-size:12px;font-weight:600}.pie-task small,.pie-deadline small,.pie-activity small{display:block;font-size:10px;color:#718191;margin-top:3px}.pie-check{width:15px;height:15px;border:1px solid #9eacb7;border-radius:3px;flex:none}.pie-deadline{justify-content:space-between}.pie-deadline strong{font-size:11px;color:#334a5d;white-space:nowrap}.pie-avatar{width:28px;height:28px;border-radius:50%;background:#e9f1f8;color:#0b63ce;display:grid;place-items:center;font-size:11px;font-weight:700;flex:none}.pie-activity:hover,.pie-task:hover,.pie-deadline:hover{background:#f7fafc}.pie-metric{display:flex;justify-content:space-between;padding:14px 17px;border-bottom:1px solid #edf0f3;font-size:12px}.pie-metric:last-child{border-bottom:0}.pie-metric strong{font-size:18px}.pie-empty{padding:24px 17px;color:#718191;font-size:11px}.pie-object-links{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.pie-object{display:block;background:#fff;border:1px solid #d7e0e7;border-radius:5px;padding:16px 17px;text-decoration:none}.pie-object:hover{border-color:#9fb9cf}.pie-object b{font-size:13px;color:#243746}.pie-object span{display:block;font-size:11px;color:#718191;margin-top:5px;line-height:1.5}@media(max-width:1050px){.pie-home-grid-top,.pie-object-links{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:700px){.pie-home-grid-top,.pie-home-grid-main,.pie-object-links{grid-template-columns:1fr}.pie-home-head{display:block}.pie-home-date{margin-top:8px}}`}</style>
  </div>;
}

function HomeCard({title,action,href,children}:{title:string;action:string;href:string;children:React.ReactNode}){return <section className="pie-card"><div className="pie-card-head"><h3>{title}</h3><Link href={href}>{action}</Link></div><div className="pie-card-body">{children}</div></section>}
function Metric({label,value}:{label:string;value:number}){return <div className="pie-metric"><span>{label}</span><strong>{value.toLocaleString()}</strong></div>}
function Empty({text}:{text:string}){return <div className="pie-empty">{text}</div>}
function ObjectLink({title,body,href}:{title:string;body:string;href:string}){return <Link className="pie-object" href={href}><b>{title}</b><span>{body}</span></Link>}
