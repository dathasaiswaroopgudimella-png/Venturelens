import Link from "next/link";

export const dynamic = "force-static";

export default function FeaturesPage() {
  return (
    <div className="bg-surface min-h-screen text-on-surface font-sans selection:bg-secondary-container selection:text-on-secondary-container">
      {/* TopNavBar */}
      <header className="docked full-width top-0 sticky z-50 glass-header border-b border-outline-variant/30 shadow-sm">
        <div className="flex justify-between items-center px-8 h-16 w-full max-w-[1440px] mx-auto">
          <Link href="/" className="font-headline-md text-xl font-bold tracking-tight text-on-surface flex items-center gap-2">
            <span>VentureLens</span>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-secondary/10 text-secondary border border-secondary/20">
              Venture Intelligence
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/platform" className="text-on-surface-variant hover:text-on-surface transition-colors">Platform</Link>
            <Link href="/features" className="text-secondary border-b-2 border-secondary pb-1">Features</Link>
            <Link href="/pricing" className="text-on-surface-variant hover:text-on-surface transition-colors">Pricing</Link>
            <Link href="/templates" className="text-on-surface-variant hover:text-on-surface transition-colors">Templates</Link>
            <Link href="/about" className="text-on-surface-variant hover:text-on-surface transition-colors">About</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-secondary hover:opacity-80 transition-opacity text-sm font-semibold">Dashboard</Link>
            <Link
              href="/wizard"
              className="bg-primary text-on-primary px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all active:scale-95 shadow-sm"
            >
              Start Free Diligence
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-16">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-accent/10 border border-emerald-accent/20 rounded-full mb-6">
            <span className="font-mono text-xs text-emerald-accent font-semibold uppercase tracking-wider">
              Institutional Capabilities
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Core Diligence Architecture</h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            VentureLens replaces subjective vibes with rigorous mathematical validation, deterministic venture rules, and multi-pillar adversarial AI cross-verification.
          </p>
        </div>

        {/* Feature Deep-Dives */}
        <div className="space-y-24">
          
          {/* Feature 1: Deterministic Rule Engine */}
          <section className="flex flex-col lg:flex-row items-center gap-12 bg-white p-8 md:p-12 rounded-2xl border border-outline-variant/30 micro-shadow">
            <div className="flex-1 space-y-6">
              <span className="text-xs font-mono font-bold text-secondary uppercase tracking-widest block">01 / Heuristic Logic Gates</span>
              <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">16 Deterministic VC Logic Rules</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Before generating narrative analysis, our engine evaluates your venture against 16 structural logic gates. It automatically tests whether pricing matches enterprise sales cycles, whether geography-specific adoption barriers exist, and whether target market sizing aligns with unit economics.
              </p>
              <div className="p-4 bg-surface rounded-xl border border-outline-variant/30 text-xs text-on-surface-variant space-y-2">
                <div className="flex items-center gap-2 font-bold text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-sm">verified</span>
                  <span>Automated Consistency Verification</span>
                </div>
                <p className="leading-relaxed">
                  Identifies structural mismatches such as selling self-serve micro-subscriptions into long-cycle hospital chains or enterprise procurement boards.
                </p>
              </div>
            </div>
            <div className="flex-1 w-full max-w-md space-y-3">
              <div className="p-4 bg-emerald-accent/10 border border-emerald-accent/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-accent text-lg">check_circle</span>
                  <span className="text-xs font-bold text-on-surface">Customer Urgency & Pain Gate</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-accent uppercase bg-emerald-accent/20 px-2 py-0.5 rounded">Passed</span>
              </div>
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-amber-500 text-lg">warning</span>
                  <span className="text-xs font-bold text-on-surface">Sales Cycle vs Pricing Model Gate</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-600 uppercase bg-amber-500/20 px-2 py-0.5 rounded">Warning</span>
              </div>
              <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary text-lg">fact_check</span>
                  <span className="text-xs font-bold text-on-surface">Competitive Moat Defensibility</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-secondary uppercase bg-secondary/20 px-2 py-0.5 rounded">Verified</span>
              </div>
            </div>
          </section>

          {/* Feature 2: Evidence-Grounded Scoring */}
          <section className="flex flex-col lg:flex-row-reverse items-center gap-12 bg-white p-8 md:p-12 rounded-2xl border border-outline-variant/30 micro-shadow">
            <div className="flex-1 space-y-6">
              <span className="text-xs font-mono font-bold text-secondary uppercase tracking-widest block">02 / Mathematical Transparency</span>
              <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">Evidence-Grounded Scoring Equation</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                No black-box guesses. VentureLens calculates your venture readiness through a transparent formula across 8 core dimensions: Problem (20%), Customer (15%), Market (15%), Business Model (15%), Competition (10%), Team Domain Fit (10%), Traction (10%), and Risk (5%).
              </p>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Each dimension multiplies your raw score by empirical evidence confidence, ensuring unverified claims do not inflate evaluation metrics.
              </p>
            </div>
            <div className="flex-1 w-full max-w-md bg-primary text-white rounded-xl p-6 macro-shadow space-y-4">
              <span className="font-mono text-xs text-secondary-container uppercase tracking-wider block font-bold">Transparent Formula Matrix</span>
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-300">Problem Severity (20%)</span>
                  <span className="font-bold text-emerald-accent">85 / 100</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-300">Target Customer ICP (15%)</span>
                  <span className="font-bold text-emerald-accent">80 / 100</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-300">Business Model Margin (15%)</span>
                  <span className="font-bold text-secondary">75 / 100</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-300">Team-Domain Fit (10%)</span>
                  <span className="font-bold text-amber-400">60 / 100</span>
                </div>
                <div className="flex justify-between pt-1 font-bold text-sm">
                  <span className="text-white">Adjusted Venture Score</span>
                  <span className="text-emerald-accent">74.2 / 100</span>
                </div>
              </div>
            </div>
          </section>

          {/* Feature 3: 5-Pillar Cross-Check */}
          <section className="flex flex-col lg:flex-row items-center gap-12 bg-white p-8 md:p-12 rounded-2xl border border-outline-variant/30 micro-shadow">
            <div className="flex-1 space-y-6">
              <span className="text-xs font-mono font-bold text-secondary uppercase tracking-widest block">03 / Adversarial Diligence</span>
              <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">5-Pillar AI Cross-Verification</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Instead of giving you a single agreement percentage, VentureLens independently evaluates founder claims against market reality across 5 pillars: Problem reality, Customer accessibility, Market headroom, Business model unit economics, and Execution feasibility.
              </p>
            </div>
            <div className="flex-1 w-full max-w-md grid grid-cols-2 gap-3 text-center">
              <div className="p-4 bg-surface rounded-xl border border-outline-variant/30">
                <span className="text-[10px] uppercase font-mono font-bold text-on-surface-variant block mb-1">Problem Reality</span>
                <span className="text-2xl font-extrabold text-emerald-accent">91%</span>
              </div>
              <div className="p-4 bg-surface rounded-xl border border-outline-variant/30">
                <span className="text-[10px] uppercase font-mono font-bold text-on-surface-variant block mb-1">Customer Access</span>
                <span className="text-2xl font-extrabold text-emerald-accent">83%</span>
              </div>
              <div className="p-4 bg-surface rounded-xl border border-outline-variant/30">
                <span className="text-[10px] uppercase font-mono font-bold text-on-surface-variant block mb-1">Market TAM</span>
                <span className="text-2xl font-extrabold text-secondary">61%</span>
              </div>
              <div className="p-4 bg-surface rounded-xl border border-outline-variant/30">
                <span className="text-[10px] uppercase font-mono font-bold text-on-surface-variant block mb-1">Business Model</span>
                <span className="text-2xl font-extrabold text-amber-500">58%</span>
              </div>
              <div className="col-span-2 p-4 bg-surface rounded-xl border border-outline-variant/30">
                <span className="text-[10px] uppercase font-mono font-bold text-on-surface-variant block mb-1">Execution Feasibility</span>
                <span className="text-2xl font-extrabold text-red-500">44%</span>
              </div>
            </div>
          </section>
        </div>

        {/* Call to Action */}
        <div className="mt-24 p-12 bg-primary text-on-primary rounded-2xl text-center macro-shadow space-y-6">
          <h2 className="text-3xl font-bold">Start Your Venture Evaluation</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto font-normal">
            Upload your pitch deck or answer our structured questionnaire to receive your complete due diligence report in seconds.
          </p>
          <div className="pt-2">
            <Link
              href="/wizard"
              className="inline-block bg-emerald-accent text-on-primary font-bold px-8 py-3.5 rounded-lg text-sm hover:scale-105 transition-transform macro-shadow active:scale-95"
            >
              Launch Free Diligence Now
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-outline-variant/30 py-8 text-center text-xs text-on-surface-variant mt-24">
        <p>© 2026 VentureLens AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
