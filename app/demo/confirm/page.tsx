import Link from "next/link";

export default function DemoConfirmPage() {
  return <main className="container" style={{ padding: "80px 0", maxWidth: 620 }}><Link href="/">\u2190 Pieify home</Link><div className="card" style={{ marginTop: 24 }}><p className="muted">REQUEST RECEIVED</p><h1>Thanks \u2014 your demo is on the way</h1><p className="muted">We\'ve received your request and will email you a link to your demo workspace shortly.</p><div style={{ marginTop: 24, display: "grid", gap: 12 }}><Link className="button button-primary" href="/app">Open the product</Link><Link className="button button-secondary" href="/">Back to home</Link></div></div></main>;
}
