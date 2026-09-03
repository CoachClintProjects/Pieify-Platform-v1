import { supabase } from "@/lib/supabase";

export default async function AppHomePage() {
  const [accounts, tenders, inventory, documents] = await Promise.all(["accounts", "bid_sessions", "inventory_items", "documents"].map(async (table) => {
    if (!supabase) return { count: null };
    const { count } = await supabase.from(table).select("id", { count: "exact", head: true });
    return { count };
  }));
  const cards = [["Accounts", accounts.count], ["Active tenders", tenders.count], ["Inventory records", inventory.count], ["Documents", documents.count]];
  return <><div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 22 }}><div><p className="muted">WORKSPACE OVERVIEW</p><h1 style={{ margin: 0 }}>Good morning, operator.</h1></div><span className="badge">Database connected</span></div><div className="grid grid-4">{cards.map(([label, value]) => <div className="card" key={label}><p className="muted">{label}</p><div style={{ fontSize: 34, fontWeight: 800 }}>{value ?? "—"}</div></div>)}</div><div className="grid grid-3" style={{ marginTop: 18 }}><section className="card" style={{ gridColumn: "span 2" }}><p className="muted">NEXT ACTIONS</p><h2>Move a tender forward</h2><p className="muted">Open a bid session, review extracted evidence, resolve gaps, run deterministic scoring, and build an explainable offer.</p><div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><a className="button button-primary" href="/app/tenders">Open tenders</a><a className="button button-secondary" href="/app/inventory">Review inventory</a></div></section><section className="card"><p className="muted">CONTROL PLANE</p><h2>Roles first</h2><p className="muted">The UI follows the existing role and membership model. Authorization remains enforced by Supabase RLS.</p></section></div></>;
}
