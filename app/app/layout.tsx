import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import HeaderActions from './components/HeaderActions';

export const dynamic = 'force-dynamic';
type NavRow = { nav_group: string; label: string; href: string; icon?: string | null; sort_order: number };

async function getAuthenticatedServerClient() {
  const cookieStore = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } });
}

function groupNavigation(rows: NavRow[]) { return rows.reduce<Record<string, NavRow[]>>((groups, row) => { (groups[row.nav_group] ||= []).push(row); return groups; }, {}); }

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getAuthenticatedServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/signin');
  const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single();
  const role = profile?.role ?? 'user';
  const isSuperuser = role === 'superuser';
  const audience = isSuperuser ? 'superuser' : role === 'client_admin' ? 'client_admin' : 'user';
  const { data: navigation, error: navigationError } = await supabase.from('app_navigation').select('nav_group,label,href,icon,sort_order').eq('audience', audience).eq('enabled', true).order('sort_order', { ascending: true });
  const navGroups = groupNavigation((navigation ?? []) as NavRow[]);

  return <div className="hs-app">
    <style>{`.hs-app{min-height:100vh;background:#f5f8fb;color:#243746;font-family:Arial,Helvetica,sans-serif;display:flex}.hs-side{position:fixed;inset:0 auto 0 0;width:224px;background:#1f2933;color:#c8d2dc;display:flex;flex-direction:column;z-index:20}.hs-brand{height:58px;padding:0 20px;display:flex;align-items:center;border-bottom:1px solid #34414d;font-weight:800;font-size:22px;color:#fff;letter-spacing:-1px}.hs-brand span{color:#38b6b6}.hs-context{padding:12px 14px;border-bottom:1px solid #34414d}.hs-context-kicker{text-transform:uppercase;letter-spacing:.9px;font-size:9px;color:#8fa0ae}.hs-context-name{margin-top:4px;font-size:13px;color:#fff;font-weight:700}.hs-nav{padding:10px 9px;overflow:auto}.hs-nav-label{text-transform:uppercase;font-size:9px;letter-spacing:1px;color:#82909d;padding:10px 10px 6px}.hs-link{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:4px;color:#cbd5df;font-size:12px;margin:1px 0;text-decoration:none}.hs-link:hover,.hs-link.active{background:#334452;color:#fff}.hs-dot{width:6px;height:6px;border-radius:50%;background:#6e8293;flex:none}.hs-bottom{margin-top:auto;padding:12px 14px;border-top:1px solid #34414d;font-size:11px}.hs-bottom-email{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#aebbc6}.hs-bottom a{display:block;color:#c7d2db;padding-top:7px}.hs-main{margin-left:224px;width:calc(100% - 224px);min-width:0}.hs-top{height:58px;background:#202a33;color:#dce5eb;border-bottom:1px solid #111a21;display:flex;align-items:center;padding:0 18px;gap:14px;position:sticky;top:0;z-index:10}.hs-search{height:34px;display:flex;align-items:center;flex:1;max-width:650px;background:#303c46;border:1px solid #475661;border-radius:4px;padding:0 12px;color:#aebbc5;font-size:12px}.hs-search svg{width:16px;height:16px;flex:none}.hs-top-spacer{flex:1}.hs-top-actions{display:flex;align-items:center;gap:6px;font-size:11px;color:#b7c3cc}.hs-icon-btn{width:34px;height:34px;border:0;background:transparent;color:#cbd5dd;border-radius:4px;display:grid;place-items:center;cursor:pointer;text-decoration:none}.hs-icon-btn:hover{background:#303c46;color:#fff}.hs-icon-btn svg{width:18px;height:18px}.hs-upgrade{height:30px;border:1px solid #687681;background:#2b3740;color:#fff;border-radius:4px;padding:0 11px;font-size:11px;font-weight:700}.hs-avatar{width:30px;height:30px;border-radius:50%;background:#0b63ce;color:#fff;display:grid;place-items:center;font-weight:700;margin-left:5px}.hs-account{display:flex;align-items:center;gap:7px;color:#e7edf1;white-space:nowrap;font-size:11px;margin-left:2px}.hs-account-button{background:transparent;border:0;cursor:pointer}.hs-account-name{max-width:145px;overflow:hidden;text-overflow:ellipsis}.hs-account-chevron{font-size:10px;color:#91a0ab}.hs-role-menu-wrap{position:relative}.hs-role-menu{position:absolute;right:0;top:42px;width:220px;background:#fff;border:1px solid #ccd6df;border-radius:6px;box-shadow:0 12px 30px rgba(20,40,60,.2);padding:7px;z-index:50;color:#263746}.hs-role-menu a{display:block;padding:9px 10px;border-radius:4px;color:#263746;text-decoration:none;font-size:12px}.hs-role-menu a:hover{background:#edf4fa}.hs-role-menu-title{padding:7px 10px 8px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.7px;color:#718191}.hs-role-divider{height:1px;background:#e4e9ee;margin:5px 0}.hs-content{padding:24px 30px 50px;max-width:1600px}.hs-breadcrumb{font-size:11px;color:#718191;margin-bottom:7px}.hs-page-title{font-size:25px;line-height:1.2;color:#1f3345;margin:0;font-weight:700}.hs-page-sub{font-size:13px;color:#718191;margin:7px 0 22px}.hs-toolbar{display:flex;align-items:center;gap:9px;margin-bottom:14px}.hs-btn{background:#fff;border:1px solid #cbd6df;border-radius:4px;padding:8px 12px;font-size:12px;color:#334a5d}.hs-grow{flex:1}@media(max-width:900px){.hs-side{width:68px}.hs-brand{padding:0 14px}.hs-context,.hs-nav-label,.hs-link span,.hs-bottom,.hs-upgrade,.hs-account-name{display:none}.hs-link{justify-content:center}.hs-main{margin-left:68px;width:calc(100% - 68px)}.hs-top{padding:0 12px}.hs-content{padding:20px}}`}</style>
    <aside className="hs-side">
      <Link href={isSuperuser ? '/app/superuser' : '/app'} className="hs-brand"><span>PIE</span>ify</Link>
      <div className="hs-context"><div className="hs-context-kicker">{isSuperuser ? 'Owner / Operator' : role === 'client_admin' ? 'Client Admin' : 'Workspace'}</div><div className="hs-context-name">{isSuperuser ? 'Platform Control Plane' : 'Procurement'}</div></div>
      <nav className="hs-nav">
        {navigationError ? <div className="hs-nav-label">Navigation unavailable</div> : Object.entries(navGroups).map(([group, items]) => <div key={group}><div className="hs-nav-label">{group}</div>{items.map(item => <Link key={`${item.label}-${item.href}`} href={item.href} className="hs-link"><i className="hs-dot"/><span>{item.label}</span></Link>)}</div>)}
        {!navigationError && !navigation?.length && <div className="hs-nav-label">No navigation configured</div>}
      </nav>
      <div className="hs-bottom"><div className="hs-bottom-email">{user.email}</div><Link href="/auth/signout">Sign out</Link></div>
    </aside>
    <div className="hs-main"><header className="hs-top"><div className="hs-top-spacer"/><div className="hs-search"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/></svg><span>&nbsp;&nbsp;Search {isSuperuser ? 'organizations, tenders, users, agents, runs, tickets, events' : 'PIEify'}</span></div><div className="hs-top-spacer"/><HeaderActions email={user.email ?? 'User'} isSuperuser={isSuperuser}/></header><main className="hs-content">{children}</main></div>
  </div>;
}
