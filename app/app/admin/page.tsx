import { supabase } from "@/lib/supabase";

export default async function AdminPage() {
  const names = ["accounts", "profiles", "subscriptions", "ai_runs", "platform_cost_ledger", "audit_events", "license_integrity_events"] as const;
  const metrics = await Promise.all(names.map(async (table) => { if (!supabase) return [table, null] as const; const { count } = await supabase.from(table).select("id", { count: "exact", head: true }); return [table, count] as const; }));
  return <><p className="muted">PLATFORM CONTROL</p><h1>Superuser control plane</h1><p className="muted">Platform health, usage, cost, subscriptions, audit, and security signals.</p><div className="grid grid-4" style={{ marginTop: 16 }}>{metrics.map(([label, value]) => <div className="card" key={label}><p className="muted">{label.replaceAll("_", " ")}</p><div style={{ fontSize: 28, fontWeight: 800 }}>{value ?? "—"}</div><p className="muted">Rows visible to this role</p></div>)}</div><section className="card" style={{ marginTop: 16 }}><h2>Safety boundary</h2><p className="muted">This surface requires a platform role enforced server-side. Client roles must never receive cross-tenant records, pricing internals, token usage, or security events.</p></section></>;
}
