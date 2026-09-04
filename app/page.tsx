import Link from "next/link";
import { getCorporateContent } from "@/lib/site-content";

const defaultPillars = [
  ["READ THE TENDER", "Turn dense procurement documents into structured requirements, deadlines, evidence, conflicts, and the questions that matter."],
  ["PROVE THE FIT", "Match tender requirements against real products and inventory while preserving the evidence behind every result."],
  ["MAKE THE DECISION", "See scoring, gaps, risk, economics, and clarification needs in one auditable bid workspace."]
];

export default async function HomePage() {
  const content = await getCorporateContent();
  const hero = content.find(c => c.key === "hero")?.value as any || {};
  const pillars = (content.find(c => c.key === "pillars")?.value as any[]) ?? defaultPillars;

  return <main className="corporate-site">
    <header className="site-header"><div className="site-container nav-inner">
      <Link href="/" className="wordmark"><span>PIE</span><b>ify</b></Link>
      <nav className="desktop-nav"><Link href="#platform">Platform</Link><Link href="#how-it-works">How it works</Link><Link href="#verticals">Industries</Link><Link href="#pricing">Pricing</Link></nav>
      <div className="nav-actions"><Link href="/demo" className="text-link">Sign in</Link><Link href="/demo" className="nav-cta">See PIEify <span>→</span></Link></div>
    </div></header>

    <section className="hero-section"><div className="hero-grid site-container">
      <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-dot"/> PROCUREMENT INTELLIGENCE ENGINE</div>
        <h1>{hero.title || "Turn the tender into a decision."}</h1>
        <p className="hero-lede">{hero.body || "PIEify turns complex procurement documents, product capability, inventory, scoring, and economics into one evidence-backed bid decision."}</p>
        <div className="hero-actions"><Link href="/demo" className="primary-button">Explore the platform <span>→</span></Link><Link href="#how-it-works" className="secondary-button">See how it works</Link></div>
        <p className="hero-note">Built for teams that cannot afford to guess.</p>
      </div>
      <div className="hero-visual"><div className="visual-glow"/><div className="app-window">
        <div className="window-top"><span>PIEify / Bid workspace</span><b>LIVE</b></div><div className="window-body"><aside className="mini-sidebar"><strong>P</strong><i/><i/><i/><i/><i/></aside><div className="mini-main">
          <small className="mini-breadcrumb">TENDERS / ACTIVE BID</small><div className="mini-title-row"><div><strong>Procurement decision</strong><small>Evidence-backed review</small></div><b className="decision-pill">BID WITH QUESTIONS</b></div>
          <div className="metric-row"><div><small>Requirements</small><strong>38</strong></div><div><small>Matched</small><strong>31</strong></div><div><small>Questions</small><strong>3</strong></div></div>
          <div className="mini-card"><div className="bar-title"><span>Requirement coverage</span><b>82%</b></div><div className="progress"><span/></div><div className="mini-lines"><i/><i/><i/></div></div>
          <div className="mini-bottom"><div className="mini-card small-card"><small>SCORING</small><strong>78 / 100</strong><em>Validated</em></div><div className="mini-card small-card"><small>INVENTORY</small><strong>5 units</strong><em>Evidence linked</em></div></div>
        </div></div></div></div>
    </div></section>

    <section className="trust-strip"><div className="site-container trust-inner"><span>ONE WORKSPACE. FROM TENDER TO OUTCOME.</span><div><b>DOCUMENT</b><i>→</i><b>REQUIREMENTS</b><i>→</i><b>MATCH</b><i>→</i><b>SCORE</b><i>→</i><b>DECIDE</b></div></div></section>

    <section id="platform" className="platform-section"><div className="site-container"><div className="section-intro"><div className="eyebrow">THE PLATFORM</div><h2>Stop hunting through documents.<br/><span>Start managing the decision.</span></h2><p>PIEify gives procurement teams a structured operating system for complex bids — without hiding the evidence underneath a pretty dashboard.</p></div>
      <div className="feature-grid">{pillars.slice(0,3).map(([title,body],i)=><article className="feature-card" key={title}><div className="feature-number">0{i+1}</div><h3>{title}</h3><p>{body}</p><span className="feature-arrow">↗</span></article>)}</div>
    </div></section>

    <section id="how-it-works" className="workflow-section"><div className="site-container workflow-grid"><div><div className="eyebrow light">HOW IT WORKS</div><h2>From tender<br/><strong>to answer.</strong></h2><p>Every step stays connected. Every conclusion can be traced back to evidence.</p></div><div className="workflow-list">
      <div><b>01</b><span>Capture</span><p>Tender documents, addenda, requirements and submission rules.</p></div><div><b>02</b><span>Understand</span><p>Structure requirements and surface gaps, conflicts and questions.</p></div><div><b>03</b><span>Match &amp; score</span><p>Compare against real product and inventory evidence using the tender's rules.</p></div><div><b>04</b><span>Decide</span><p>BID, BID WITH QUESTIONS, custom-build path, or PASS — with the record to support it.</p></div>
    </div></div></section>

    <section id="verticals" className="vertical-section"><div className="site-container vertical-grid"><div><div className="eyebrow">BUILT TO EXPAND</div><h2>One procurement engine.<br/><span>Multiple verticals.</span></h2></div><div className="vertical-copy"><p>PIEify starts where procurement is complex, specifications are unforgiving, and the cost of a bad assumption is high.</p><div className="vertical-tags"><span>FIRE APPARATUS</span><span>EMERGENCY VEHICLES</span><span>PUBLIC SAFETY</span><span>CAPITAL EQUIPMENT</span></div></div></div></section>

    <section id="pricing" className="pricing-section"><div className="site-container pricing-inner"><div className="eyebrow">PRICING</div><h2>Start with the work.<br/><span>Scale when you need to.</span></h2><p>Simple plans for procurement teams.</p><Link href="/demo" className="primary-button">Explore PIEify <span>→</span></Link></div></section>
    <footer className="site-footer"><div className="site-container footer-top"><Link href="/" className="wordmark"><span>PIE</span><b>ify</b></Link><div className="footer-links"><Link href="#platform">Platform</Link><Link href="#how-it-works">How it works</Link><Link href="#verticals">Industries</Link><Link href="#pricing">Pricing</Link><Link href="/demo">Sign in</Link></div></div><div className="site-container footer-bottom"><span>© {new Date().getFullYear()} PIEify. Procurement Intelligence Engine.</span><span>Evidence before assumptions.</span></div></footer>
  </main>;
}
