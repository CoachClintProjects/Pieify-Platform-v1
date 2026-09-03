import Link from "next/link";

export default function DemoPage() {
  return <main className="container" style={{ padding: "80px 0", maxWidth: 720 }}><Link href="/">\u2190 Pieify home</Link><div className="card" style={{ marginTop: 24 }}><p className="muted">SANDBOX ACCESS</p><h1>Try Pieify with demo data</h1><p className="muted">Explore a fully functional workspace with sample tenders, inventory, and scoring. No real data is changed.</p><div style={{ display: "grid", gap: 14, marginTop: 24 }}><Link className="button button-primary" href="/demo/request">Request a demo workspace</Link><Link className="button button-secondary" href="/app">Open the product</Link></div><div style={{ marginTop: 24 }}><p className="muted">Already have access? <Link href="/app" style={{ color: "#1677ff" }}>Enter the platform</Link>.</p></div></div></main>;
}
