import Link from "next/link";

export function Header({ role }: { role?: string | null }) {
  const isPlatform = role === "superuser" || role === "platform_admin" || role === "platform_superuser";
  return <header style={{ height: 64, background: "white", borderBottom: "1px solid #d9e2ec", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <Link href="/" style={{ fontSize: 20, fontWeight: 900 }}>PIEFY<span style={{ color: "#f2994a" }}>.</span></Link>
      <div style={{ width: 260, position: "relative" }}>
        <input placeholder="Global search" style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #d9e2ec" }} />
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Link href="/app" className="button button-secondary">Workspace</Link>
      {isPlatform && <Link href="/app/admin" className="button button-primary">Platform admin</Link>}
      <button className="button button-secondary">Notifications</button>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#eaf2ff", display: "grid", placeItems: "center", fontWeight: 800 }}>U</div>
    </div>
  </header>;
}
