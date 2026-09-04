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

const clientNav = [
  ['Home', '/app'], ['Tenders', '/app/tenders'], ['Requirements', '/app/tenders'],
  ['Questions', '/app/tenders'], ['Inventory', '/app/inventory'], ['Companies', '/app/customers'],
  ['Suppliers', '/app/suppliers'], ['Quotes', '/app/quotes'], ['Documents', '/app/documents'], ['Reports', '/app/reports'],
];

const platformNav = [
  { group: 'Home', items: [['Platform Home', '/app/superuser']] },
  { group: 'Customers', items: [['Organizations', '/app/superuser/organizations'], ['Users', '/app/superuser/users'], ['Subscriptions & seats', '/app/superuser/subscriptions'], ['Demo requests', '/app/superuser/demo-requests'], ['Support', '/app/superuser/tickets']] },
  { group: 'Procurement', items: [['Tenders', '/app/superuser/tenders'], ['Requirements', '/app/superuser/requirements'], ['Inventory', '/app/superuser/inventory'], ['Catalogs', '/app/superuser/catalogs'], ['OEMs & dealers', '/app/superuser/relationships']] },
  { group: 'Intelligence', items: [['Extraction', '/app/superuser/extraction'], ['Matching', '/app/superuser/matching'], ['Scoring', '/app/superuser/scoring'], ['Questions', '/app/superuser/questions'], ['AI runs', '/app/superuser/ai']] },
  { group: 'Operations', items: [['Automations', '/app/superuser/automations'], ['Workflows & jobs', '/app/superuser/workflows'], ['Integrations', '/app/superuser/integrations'], ['Data quality', '/app/superuser/data-quality']] },
  { group: 'Finance', items: [['Revenue', '/app/superuser/revenue'], ['Usage & tokens', '/app/superuser/usage'], ['AI costs', '/app/superuser/costs']] },
  { group: 'Platform', items: [['System health', '/app/superuser/health'], ['Deployments', '/app/superuser/deployments'], ['Security', '/app/superuser/security'], ['Audit log', '/app/superuser/audit'], ['Settings', '/app/superuser/settings']] },
];

function Icon({ name }: { name: 'plus'|'grid'|'help'|'settings'|'bell'|'spark'|'search' }) {
  const paths: Record<string, React.ReactNode> = {
    plus: <><path d="M12 5v14M5 12h14"/></>,
    grid: <><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></>,
    help: <><circle cx="12" cy="12" r="8.5"/><path d="M9.8 9.2a2.5 2.5 0 1 1 4.1 1.9c-1.1.9-1.9 1.3-1.9 2.9"/><path d="M12 17h.01"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.5 1.5-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V20h-2.1v-.4a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.5-1.5.1-.1A1.7 1.7 0 0 0 9 15a1.7 1.7 0 0 0-1.5-1H7.1v-2.1h.4a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.5-1.5.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V6h2.1v.4a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.5 1.5-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.4V14h-.4a1.7 1.7 0 0 0-1.5 1Z"/></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    spark: <><path d="m12 3 1.4 5.6L19 10l-5.6 1.4L12 17l-1.4-5.6L5 10l5.6-1.4L12 3Z"/><path d="m19 16 .6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6L19 16Z"/></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getAuthenticatedServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/signin');
  const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single();
  const isSuperuser = profile?.role === 'superuser';
  const nav = isSuperuser ? platformNav.flatMap(section => section.items.map(item => [...item, section.group])) : clientNav.map(item => [...item, 'Workspace']);

  return (
    <div className="hs-app">
      <style>{`
        .hs-app{min-height:100vh;background:#f5f8fb;color:#243746;font-family:Arial,Helvetica,sans-serif;display:flex}
        .hs-side{position:fixed;inset:0 auto 0 0;width:224px;background:#1f2933;color:#c8d2dc;display:flex;flex-direction:column;z-index:20}
        .hs-brand{height:58px;padding:0 20px;display:flex;align-items:center;border-bottom:1px solid #34414d;font-weight:800;font-size:22px;color:#fff;letter-spacing:-1px}.hs-brand span{color:#38b6b6}
        .hs-context{padding:12px 14px;border-bottom:1px solid #34414d}.hs-context-kicker{text-transform:uppercase;letter-spacing:.9px;font-size:9px;color:#8fa0ae}.hs-context-name{margin-top:4px;font-size:13px;color:#fff;font-weight:700}
        .hs-nav{padding:10px 9px;overflow:auto}.hs-nav-label{text-transform:uppercase;font-size:9px;letter-spacing:1px;color:#82909d;padding:10px 10px 6px}.hs-link{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:4px;color:#cbd5df;font-size:12px;margin:1px 0}.hs-link:hover,.hs-link.active{background:#334452;color:#fff}.hs-dot{width:6px;height:6px;border-radius:50%;background:#6e8293;flex:none}
        .hs-bottom{margin-top:auto;padding:12px 14px;border-top:1px solid #34414d;font-size:11px}.hs-bottom-email{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#aebbc6}.hs-bottom a{display:block;color:#c7d2db;padding-top:7px}
        .hs-main{margin-left:224px;width:calc(100% - 224px);min-width:0}.hs-top{height:58px;background:#202a33;color:#dce5eb;border-bottom:1px solid #111a21;display:flex;align-items:center;padding:0 18px;gap:14px;position:sticky;top:0;z-index:10}.hs-search{height:34px;display:flex;align-items:center;flex:1;max-width:650px;background:#303c46;border:1px solid #475661;border-radius:4px;padding:0 12px;color:#aebbc5;font-size:12px}.hs-search svg{width:16px;height:16px;flex:none}.hs-top-spacer{flex:1}.hs-top-actions{display:flex;align-items:center;gap:6px;font-size:11px;color:#b7c3cc}.hs-icon-btn{width:34px;height:34px;border:0;background:transparent;color:#cbd5dd;border-radius:4px;display:grid;place-items:center;cursor:pointer}.hs-icon-btn:hover{background:#303c46;color:#fff}.hs-icon-btn svg{width:18px;height:18px}.hs-upgrade{height:30px;border:1px solid #687681;background:#2b3740;color:#fff;border-radius:4px;padding:0 11px;font-size:11px;font-weight:700}.hs-avatar{width:30px;height:30px;border-radius:50%;background:#0b63ce;color:#fff;display:grid;place-items:center;font-weight:700;margin-left:5px}.hs-account{display:flex;align-items:center;gap:7px;color:#e7edf1;white-space:nowrap;font-size:11px;margin-left:2px}.hs-account-name{max-width:145px;overflow:hidden;text-overflow:ellipsis}.hs-account-chevron{font-size:10px;color:#91a0ab}
        .hs-content{padding:24px 30px 50px;max-width:1600px}.hs-breadcrumb{font-size:11px;color:#718191;margin-bottom:7px}.hs-page-title{font-size:25px;line-height:1.2;color:#1f3345;margin:0;font-weight:700}.hs-page-sub{font-size:13px;color:#718191;margin:7px 0 22px}.hs-toolbar{display:flex;align-items:center;gap:9px;margin-bottom:14px}.hs-btn{background:#fff;border:1px solid #cbd6df;border-radius:4px;padding:8px 12px;font-size:12px;color:#334a5d}.hs-btn-primary{background:#0b63ce;color:#fff;border-color:#0b63ce;font-weight:700}.hs-grow{flex:1}
        @media(max-width:900px){.hs-side{width:68px}.hs-brand{padding:0 14px}.hs-context,.hs-nav-label,.hs-link span,.hs-bottom,.hs-platform,.hs-account-name,.hs-upgrade{display:none}.hs-link{justify-content:center}.hs-main{margin-left:68px;width:calc(100% - 68px)}.hs-top{padding:0 12px}.hs-content{padding:20px}}
      `}</style>
      <aside className="hs-side">
        <Link href="/app" className="hs-brand"><span>PIE</span>ify</Link>
        <div className="hs-context"><div className="hs-context-kicker">{isSuperuser ? 'Owner / Operator' : 'Workspace'}</div><div className="hs-context-name">{isSuperuser ? 'Platform Control Plane' : 'Procurement'}</div></div>
        <nav className="hs-nav">
          {isSuperuser ? platformNav.map(section => <div key={section.group}><div className="hs-nav-label">{section.group}</div>{section.items.map(([label, href]) => <Link key={label} href={href} className="hs-link"><i className="hs-dot"/><span>{label}</span></Link>)}</div>) : <><div className="hs-nav-label">Workspace</div>{nav.map(([label, href]) => <Link key={label} href={href} className="hs-link"><i className="hs-dot"/><span>{label}</span></Link>)}</>}
        </nav>
        <div className="hs-bottom"><div className="hs-bottom-email">{user.email}</div><Link href="/auth/signout">Sign out</Link></div>
      </aside>
      <div className="hs-main">
        <header className="hs-top">
          <div className="hs-top-spacer" />
          <div className="hs-search"><Icon name="search"/><span>&nbsp;&nbsp;Search {isSuperuser ? 'organizations, tenders, users, agents, runs, tickets, events' : 'PIEify'}</span></div>
          <div className="hs-top-spacer" />
          <div className="hs-top-actions">
            <button className="hs-upgrade">{isSuperuser ? 'Platform' : 'Upgrade'}</button>
            <button className="hs-icon-btn" aria-label="Create"><Icon name="plus"/></button>
            <button className="hs-icon-btn" aria-label="Apps"><Icon name="grid"/></button>
            <button className="hs-icon-btn" aria-label="Help"><Icon name="help"/></button>
            <button className="hs-icon-btn" aria-label="Settings"><Icon name="settings"/></button>
            <button className="hs-icon-btn" aria-label="Notifications"><Icon name="bell"/></button>
            <button className="hs-icon-btn" aria-label="Assistant"><Icon name="spark"/></button>
            <div className="hs-account"><div className="hs-avatar">{(user.email ?? 'U').slice(0,1).toUpperCase()}</div><span className="hs-account-name">{user.email}</span><span className="hs-account-chevron">▾</span></div>
          </div>
        </header>
        <main className="hs-content">{children}</main>
      </div>
    </div>
  );
}
