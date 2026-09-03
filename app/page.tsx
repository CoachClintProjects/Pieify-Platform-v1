import Link from "next/link";
import { getCorporateContent } from "@/lib/site-content";

const defaultPillars = [
  ["Read the tender", "Turn dense procurement documents into structured requirements, deadlines, evidence, and conflicts."],
  ["Prove the fit", "Match requirements to inventory and preserve the evidence behind every result."],
  ["Know the economics", "Model cost, margin, delivery risk, and the true cost of pursuing the work."]
];

export default async function HomePage() {
  const content = await getCorporateContent();
  const hero = content.find(c => c.key === "hero")?.value as any || {};
  const pricing = content.filter(c => c.section === "pricing").map(c => c.value).filter(Boolean) as any[];
  const pillars = (content.find(c => c.key === "pillars")?.value as any[]) ?? defaultPillars;

  return <main>
    <section className="hero"><div className="container" style={{ padding: "26px 0 96px" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 80 }}><strong style={{ fontSize: 24 }}>PIEFY<span style={{ color: "#f2994a" }}>.</span></strong><div style={{ display: "flex", gap: 18, alignItems: "center" }}><Link href="#how">How it works</Link><Link href="#pricing">Pricing</Link><Link className="button button-secondary" href="/demo">Try the sandbox</Link></div></nav>
      <div style={{ maxWidth: 720 }}><span className="badge">{hero.subtitle || "Procurement intelligence for complex bids"}</span><h1 style={{ fontSize: "clamp(42px, 7vw, 78px)", lineHeight: 1.02, margin: "20px 0" }}>{hero.title || "Bid with evidence.\nDecide with confidence."}</h1><p style={{ fontSize: 20, lineHeight: 1.6, color: "#d9e2ec" }}>{hero.body || "Pieify turns tender documents, product capability, cost, and risk into an explainable path to BID, BID WITH QUESTIONS, or PASS."}</p><div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}><Link className="button button-primary" href="/demo">Enter the sandbox</Link><Link className="button button-secondary" href="#how">See the workflow</Link></div></div>
    </div></section>
    <section id="how" className="container" style={{ padding: "76px 0" }}><p className="muted">FROM DOCUMENT TO DECISION</p><h2 style={{ fontSize: 38, marginTop: 8 }}>A system of record for the bid.</h2><div className="grid grid-3" style={{ marginTop: 28 }}>{pillars.map(([title, body], i) => <article className="card" key={title}><span className="badge">0{i + 1}</span><h3>{title}</h3><p className="muted" style={{ lineHeight: 1.6 }}>{body}</p></article>)}</div></section>
    <section id="pricing" style={{ background: "#eaf2ff", padding: "72px 0" }}><div className="container"><p className="muted">SIMPLE, OPERATIONAL PRICING</p><h2 style={{ fontSize: 38 }}>Start with clarity.</h2><div className="grid grid-3" style={{ marginTop: 28 }}>{pricing.length ? pricing.map((p, i) => <article className="card" key={i}><h3>{p.name}</h3><p className="muted">{p.description}</p><h3>{p.price}</h3></article>) : <><article className="card"><h3>Starter</h3><p className="muted">For a focused bid team.</p><h3>$99<span className="muted">/mo</span></h3></article><article className="card" style={{ border: "2px solid #1677ff" }}><span className="badge">Most useful</span><h3>Pro</h3><p className="muted">For teams running a repeatable pursuit process.</p><h3>$299<span className="muted">/mo</span></h3></article><article className="card"><h3>Team</h3><p className="muted">For multi-user procurement operations.</p><h3>$599<span className="muted">/mo</span></h3></article></>}</div></div></section>
    <footer className="container" style={{ padding: "28px 0", display: "flex", justifyContent: "space-between" }}><span>\u00a9 {new Date().getFullYear()} Pieify</span><span className="muted">Evidence before assumptions.</span></footer>
  </main>;
}
