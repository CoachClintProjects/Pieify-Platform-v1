import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/auth';

type Tender = { id:string; name:string|null; issuer:string|null; status:string|null; scoring_status:string|null; submission_deadline:string|null };

export default async function TendersPage() {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('bid_sessions').select('id,name,status,scoring_status,submission_deadline,issuer').order('updated_at',{ascending:false}).limit(100);
  const rows = (data ?? []) as Tender[];
  return <>
    <div className="hs-breadcrumb">CRM / PROCUREMENT / TENDERS</div>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',gap:18,marginBottom:18}}><div><h1 className="hs-page-title">Tenders</h1><p className="hs-page-sub">Manage tender records, deadlines, requirements, matching and bid decisions.</p></div><Link href="/app/tenders/new" className="hs-btn hs-btn-primary">+ Create tender</Link></div>
    <div style={{display:'flex',alignItems:'center',gap:0,borderBottom:'1px solid #cfd9e1',marginBottom:14}}>{['All tenders','Active','Needs attention','My tenders'].map((v,i)=><div key={v} style={{padding:'11px 16px',fontSize:12,fontWeight:i===0?700:500,color:i===0?'#0b63ce':'#566979',borderBottom:i===0?'2px solid #0b63ce':'2px solid transparent'}}>{v}</div>)}</div>
    <div className="hs-toolbar"><input aria-label="Search tenders" placeholder="Search tenders" style={{width:260,border:'1px solid #cbd6df',borderRadius:4,padding:'8px 11px',fontSize:12}}/><button className="hs-btn">Filter</button><button className="hs-btn">Add filter</button><button className="hs-btn">Sort</button><button className="hs-btn">Columns</button><span className="hs-grow"/><span style={{fontSize:11,color:'#718191'}}>{rows.length} records</span></div>
    <section style={{background:'#fff',border:'1px solid #d8e1e8',borderRadius:5,overflow:'hidden'}}>
      <div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}><thead><tr>{['Tender','Issuer','Status','Scoring','Submission deadline',''].map(h=><th key={h} style={{textAlign:'left',padding:'11px 13px',background:'#f6f8fa',borderBottom:'1px solid #d8e1e8',color:'#607383',fontWeight:700,whiteSpace:'nowrap'}}>{h}</th>)}</tr></thead><tbody>{rows.map(r=><tr key={r.id} style={{borderBottom:'1px solid #edf0f3'}}><td style={{padding:'13px'}}><Link href={`/app/tenders/${r.id}`} style={{color:'#0b63ce',fontWeight:700}}>{r.name ?? 'Unnamed tender'}</Link></td><td style={{padding:'13px'}}>{r.issuer ?? '—'}</td><td style={{padding:'13px'}}><span style={{background:'#eef6f8',color:'#356675',borderRadius:12,padding:'4px 8px',fontSize:10}}>{r.status ?? 'Unknown'}</span></td><td style={{padding:'13px'}}>{r.scoring_status ?? 'Unknown'}</td><td style={{padding:'13px'}}>{r.submission_deadline ? new Date(r.submission_deadline).toLocaleDateString() : '—'}</td><td style={{padding:'13px',textAlign:'right'}}>•••</td></tr>)}{rows.length===0&&<tr><td colSpan={6} style={{padding:30,textAlign:'center',color:'#718191'}}>No tender records in production.</td></tr>}</tbody></table></div>
    </section>
  </>;
}
