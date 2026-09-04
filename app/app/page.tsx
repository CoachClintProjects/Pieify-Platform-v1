import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/auth';

type Tender = { id: string; name: string | null; issuer: string | null; status: string | null; submission_deadline: string | null };

export default async function AppHomePage() {
  const supabase = getSupabaseServerClient();
  const [accounts, tendersCount, inventory, documents, recent] = await Promise.all([
    supabase.from('accounts').select('id', { count: 'exact', head: true }),
    supabase.from('bid_sessions').select('id', { count: 'exact', head: true }),
    supabase.from('inventory_items').select('id', { count: 'exact', head: true }),
    supabase.from('documents').select('id', { count: 'exact', head: true }),
    supabase.from('bid_sessions').select('id,name,issuer,status,submission_deadline').order('updated_at', { ascending: false }).limit(6),
  ]);
  const cards = [['Tenders', tendersCount.count], ['Inventory', inventory.count], ['Companies', accounts.count], ['Documents', documents.count]] as const;
  const rows = (recent.data ?? []) as Tender[];

  return <>
    <div className="hs-breadcrumb">WORKSPACE / HOME</div>
    <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:20,marginBottom:22}}>
      <div><h1 className="hs-page-title">Home</h1><p className="hs-page-sub">Your procurement workspace at a glance.</p></div>
      <Link href="/app/tenders/new" className="hs-btn hs-btn-primary">+ Create tender</Link>
    </div>

    <section style={{background:'#fff',border:'1px solid #dce4ea',borderRadius:5,padding:'16px 18px',marginBottom:18}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}><strong style={{fontSize:14,color:'#243746'}}>Procurement workspace</strong><span style={{fontSize:11,color:'#557083',background:'#edf8f8',padding:'5px 8px',borderRadius:12}}>LIVE DATA</span></div>
      <p style={{fontSize:12,color:'#6d7e8c',margin:'7px 0 0'}}>Counts and records below come directly from the connected production database. Nothing is synthesized for this view.</p>
    </section>

    <div style={{display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:12,marginBottom:18}}>
      {cards.map(([label,value]) => <Link href={label==='Tenders'?'/app/tenders':label==='Inventory'?'/app/inventory':'#'} key={label} style={{background:'#fff',border:'1px solid #dce4ea',borderRadius:5,padding:'17px 18px'}}><div style={{fontSize:11,color:'#718191',marginBottom:9}}>{label}</div><div style={{fontSize:27,fontWeight:700,color:'#1f3345'}}>{value ?? '—'}</div></Link>)}
    </div>

    <div style={{display:'grid',gridTemplateColumns:'minmax(0,2fr) minmax(280px,1fr)',gap:18}}>
      <section style={{background:'#fff',border:'1px solid #dce4ea',borderRadius:5,overflow:'hidden'}}>
        <div style={{padding:'17px 18px',borderBottom:'1px solid #e4e9ed',display:'flex',justifyContent:'space-between',alignItems:'center'}}><div><h2 style={{fontSize:15,margin:0,color:'#243746'}}>Recent tenders</h2><p style={{fontSize:11,color:'#718191',margin:'5px 0 0'}}>Latest bid sessions in the live workspace.</p></div><Link href="/app/tenders" style={{fontSize:12,color:'#0b63ce',fontWeight:700}}>View all</Link></div>
        <div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}><thead><tr>{['Tender','Issuer','Status','Submission'].map(h=><th key={h} style={{textAlign:'left',padding:'10px 14px',background:'#f7f9fb',color:'#647685',fontWeight:700,borderBottom:'1px solid #e4e9ed'}}>{h}</th>)}</tr></thead><tbody>{rows.map(r=><tr key={r.id}><td style={{padding:'13px 14px',borderBottom:'1px solid #edf0f3'}}><Link href={`/app/tenders/${r.id}`} style={{color:'#0b63ce',fontWeight:700}}>{r.name ?? 'Unnamed tender'}</Link></td><td style={{padding:'13px 14px',borderBottom:'1px solid #edf0f3'}}>{r.issuer ?? '—'}</td><td style={{padding:'13px 14px',borderBottom:'1px solid #edf0f3'}}>{r.status ?? 'Unknown'}</td><td style={{padding:'13px 14px',borderBottom:'1px solid #edf0f3'}}>{r.submission_deadline ? new Date(r.submission_deadline).toLocaleDateString() : '—'}</td></tr>)}{rows.length===0&&<tr><td colSpan={4} style={{padding:24,color:'#718191',textAlign:'center'}}>No tender records in production.</td></tr>}</tbody></table></div>
      </section>
      <aside style={{background:'#fff',border:'1px solid #dce4ea',borderRadius:5,overflow:'hidden'}}>
        <div style={{padding:'17px 18px',borderBottom:'1px solid #e4e9ed'}}><h2 style={{fontSize:15,margin:0,color:'#243746'}}>Get started</h2></div>
        {[['Review tenders','Open the tender index and work from saved views.','/app/tenders'],['Review inventory','See the connected inventory records.','/app/inventory'],['Create a tender','Start a new procurement record.','/app/tenders/new']].map(([title,body,href])=><Link key={title} href={href} style={{display:'block',padding:'15px 18px',borderBottom:'1px solid #edf0f3'}}><strong style={{display:'block',fontSize:12,color:'#243746'}}>{title}</strong><span style={{display:'block',fontSize:11,color:'#718191',marginTop:5,lineHeight:1.5}}>{body}</span></Link>)}
      </aside>
    </div>
  </>;
}
