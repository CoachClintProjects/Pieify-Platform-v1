import Link from "next/link";

const modules = [
  ["Overview", "/app"],
  ["Tenders", "/app/tenders"],
  ["Inventory", "/app/inventory"],
  ["Suppliers", "/app/suppliers"],
  ["Customers", "/app/customers"],
  ["Quotes", "/app/quotes"],
  ["Contracts", "/app/contracts"],
  ["Reports", "/app/reports"],
];

const adminModules = [
  ["Tenants", "/app/admin/tenants"],
  ["Users", "/app/admin/users"],
  ["Subscriptions", "/app/admin/subscriptions"],
  ["AI runs", "/app/admin/ai-runs"],
  ["Token usage", "/app/admin/token-usage"],
  ["Cost ledger", "/app/admin/cost-ledger"],
  ["Audit", "/app/admin/audit"],
  ["Security", "/app/admin/security"],
];

export function Sidebar({ role }: { role?: string | null }) {
  const isPlatform = role === "superuser" || role === "platform_admin" || role === "platform_superuser";
  return <aside style={{ width: 220, background: "#102a43", color: "white", padding: 14, display: "grid", gap: 6 }}>
    <nav style={{ display: "grid", gap: 4 }}>
      {modules.map(([label, href]) => <Link key={href} href={href} style={{ padding: "10px 12px", borderRadius: 8, color: "#d9e2ec" }}>{label}</Link>)}
    </nav>
    {isPlatform && <>
      <div style={{ height: 1, background: "#243b53", margin: "8px 0" }} />
      <div style={{ fontSize: 12, color: "#8aa0b8", padding: "6px 12px" }}>Platform</div>
      <nav style={{ display: "grid", gap: 4 }}>
        {adminModules.map(([label, href]) => <Link key={href} href={href} style={{ padding: "10px 12px", borderRadius: 8, color: "#f6ad55" }}>{label}</Link>)}
      </nav>
    </>}
  </aside>;
}
