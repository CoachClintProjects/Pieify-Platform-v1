import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getAuthenticatedServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } },
  );
}

const nav = [
  ['Home', '/app'],
  ['Tenders', '/app/tenders'],
  ['Requirements', '/app/tenders'],
  ['Questions', '/app/tenders'],
  ['Inventory', '/app/inventory'],
  ['Companies', '/app/customers'],
  ['Suppliers', '/app/suppliers'],
  ['Quotes', '/app/quotes'],
  ['Documents', '/app/documents'],
  ['Reports', '/app/reports'],
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getAuthenticatedServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/signin');
  const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single();
  const isSuperuser = profile?.role === 'superuser';

  return (
    <div className="hs-app">
      <style>{`
        .hs-app{min-height:100vh;background:#f5f8fb;color:#243746;font-family:Arial,Helvetica,sans-serif;display:flex}
        .hs-side{position:fixed;inset:0 auto 0 0;width:224px;background:#1f2933;color:#c8d2dc;display:flex;flex-direction:column;z-index:20}
        .hs-brand{height:64px;padding:0 22px;display:flex;align-items:center;border-bottom:1px solid #34414d;font-weight:800;font-size:23px;color:#fff;letter-spacing:-1px}.hs-brand span{color:#4db6c6}
        .hs-workspace{padding:14px 14px 10px;font-size:12px;color:#e7edf2;border-bottom:1px solid #34414d}.hs-workspace strong{display:block;font-size:13px;color:#fff;margin-top:4px}
        .hs-nav{padding:14px 10px;overflow:auto}.hs-nav-label{text-transform:uppercase;font-size:10px;letter-spacing:1px;color:#82909d;padding:10px 10px 7px}.hs-link{display:flex;align-items:center;gap:10px;padding:9px 11px;border-radius:4px;color:#cbd5df;font-size:13px;margin:2px 0}.hs-link:hover,.hs-link.active{background:#334452;color:#fff}.hs-dot{width:7px;height:7px;border-radius:50%;background:#6e8293;flex:none}.hs-link.active .hs-dot{background:#4db6c6}.hs-bottom{margin-top:auto;padding:12px 14px;border-top:1px solid #34414d;font-size:11px}.hs-bottom a{display:block;color:#b9c6d1;padding:7px 0}
        .hs-main{margin-left:224px;width:calc(100% - 224px);min-width:0}.hs-top{height:64px;background:#fff;border-bottom:1px solid #dce4ea;display:flex;align-items:center;padding:0 24px;gap:20px;position:sticky;top:0;z-index:10}.hs-search{flex:1;max-width:520px;background:#f4f7f9;border:1px solid #d7e0e7;border-radius:4px;padding:9px 13px;color:#738392;font-size:13px}.hs-top-actions{margin-left:auto;display:flex;align-items:center;gap:16px;font-size:12px;color:#637383}.hs-avatar{width:30px;height:30px;border-radius:50%;background:#0b63ce;color:#fff;display:grid;place-items:center;font-weight:700}
        .hs-content{padding:26px 30px 50px;max-width:1500px}.hs-breadcrumb{font-size:11px;color:#718191;margin-bottom:7px}.hs-page-title{font-size:25px;line-height:1.2;color:#1f3345;margin:0;font-weight:700}.hs-page-sub{font-size:13px;color:#718191;margin:7px 0 22px}.hs-toolbar{display:flex;align-items:center;gap:9px;margin-bottom:14px}.hs-btn{background:#fff;border:1px solid #cbd6df;border-radius:4px;padding:8px 12px;font-size:12px;color:#334a5d}.hs-btn-primary{background:#0b63ce;color:#fff;border-color:#0b63ce;font-weight:700}.hs-btn:hover{border-color:#0b63ce}.hs-grow{flex:1}
        @media(max-width:900px){.hs-side{width:68px}.hs-brand{padding:0 14px}.hs-brand-text,.hs-workspace,.hs-nav-label,.hs-link span,.hs-bottom{display:none}.hs-link{justify-content:center}.hs-main{margin-left:68px;width:calc(100% - 68px)}.hs-content{padding:20px}.hs-top{padding:0 15px}}
      `}</style>
      <aside className="hs-side">
        <Link href="/app" className="hs-brand"><span>PIE</span>ify</Link>
        <div className="hs-workspace">WORKSPACE<strong>Procurement</strong></div>
        <nav className="hs-nav">
          <div className="hs-nav-label">Workspace</div>
          {nav.map(([label, href]) => <Link key={label} href={href} className="hs-link"><i className="hs-dot"/><span>{label}</span></Link>)}
          {isSuperuser && <><div className="hs-nav-label">Platform</div><Link href="/app/superuser/health" className="hs-link"><i className="hs-dot"/><span>Superuser</span></Link></>}
        </nav>
        <div className="hs-bottom"><div>{user.email}</div><Link href="/auth/signout">Sign out</Link></div>
      </aside>
      <div className="hs-main">
        <header className="hs-top"><div className="hs-search">⌕ &nbsp; Search PIEify</div><div className="hs-top-actions"><span>Help</span><span>Settings</span><div className="hs-avatar">{(user.email ?? 'U').slice(0,1).toUpperCase()}</div></div></header>
        <main className="hs-content">{children}</main>
      </div>
    </div>
  );
}
