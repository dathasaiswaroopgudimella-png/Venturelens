import Link from "next/link";

export const dynamic = "force-static";

export default function FeaturesPage() {
  return (
    <div className="bg-surface min-h-screen text-on-surface font-sans selection:bg-secondary-container selection:text-on-secondary-container">
      {/* TopNavBar */}
      <header className="docked full-width top-0 sticky z-50 glass-header border-b border-outline-variant/30 shadow-sm">
        <div className="flex justify-between items-center px-8 h-16 w-full max-w-[1440px] mx-auto">
          <Link href="/" className="font-headline-md text-xl font-bold tracking-tight text-on-surface">
            VentureLens AI
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/features" className="text-secondary border-b-2 border-secondary pb-1">Features</Link>
            <Link href="/platform" className="text-on-surface-variant hover:text-on-surface transition-colors">Platform</Link>
            <Link href="/pricing" className="text-on-surface-variant hover:text-on-surface transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-on-surface-variant hover:text-on-surface text-sm font-semibold transition-colors">Dashboard</Link>
            <Link
              href="/wizard"
              className="bg-primary text-on-primary px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all active:scale-95 shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-accent/10 border border-emerald-accent/20 rounded-full mb-6">
            <span className="font-mono text-xs text-emerald-accent font-semibold uppercase tracking-wider">
              Platform Features
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Core Product Capabilities</h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Every analysis runs through a multi-stage validation engine designed to reveal blind spots and enforce logic check validation.
          </p>
        </div>

        {/* Feature Deep-Dives - Alternating Layout */}
        <div className="space-y-32">
          
          {/* Feature 1: Deterministic Rule Engine */}
          <section className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <span className="text-xs font-mono font-bold text-secondary uppercase tracking-widest block">01 / Logic Checks</span>
              <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">Deterministic Rule Engine</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Before generating prose, we apply 16 logic checks to test compatibility across product assertions. For example, the engine flags if a startup targets Enterprise customers but lists a low transactional self-serve pricing strategy, mapping typical GTM failures programmatically.
              </p>
              <div className="bg-surface-container rounded-lg p-4 font-mono text-[10px] text-on-surface-variant border border-outline-variant/30">
                <span className="text-emerald-600 font-bold">// Rule Check: ICP vs Price Consistency</span><br />
                <span className="text-blue-600">if</span> (project.pricingModel === <span className="text-orange-600">"Self-Serve"</span> && project.targetCustomer.includes(<span className="text-orange-600">"Enterprise"</span>)) &#123;<br />
                &nbsp;&nbsp;flags.add(<span className="text-red-500">"PRICING_ICP_MISMATCH"</span>, <span className="text-on-surface">"Low ticket size mismatches enterprise cycles."</span>);<br />
                &#125;
              </div>
            </div>
            <div className="flex-1 w-full max-w-md bg-white rounded-2xl border border-outline-variant/30 p-8 shadow-sm flex flex-col justify-center">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                  <span className="material-symbols-outlined text-red-500 text-lg">error</span>
                  <span className="text-xs font-semibold text-red-700">Flag: PRICING_ICP_MISMATCH (Rule 8)</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                  <span className="material-symbols-outlined text-emerald-500 text-lg">check_circle</span>
                  <span className="text-xs font-semibold text-emerald-700">Passed: GEOGRAPHY_COMPATIBILITY (Rule 3)</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                  <span className="material-symbols-outlined text-emerald-500 text-lg">check_circle</span>
                  <span className="text-xs font-semibold text-emerald-700">Passed: STAGE_TAM_RELATIONSHIP (Rule 12)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Feature 2: Knowledge Graph */}
          <section className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className="flex-1 space-y-6">
              <span className="text-xs font-mono font-bold text-secondary uppercase tracking-widest block">02 / Relational Mapping</span>
              <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">Venture Knowledge Graph</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Our database maps assertions into a structured entity relationship graph. Nodes represent competitors, pricing strategies, target ICP descriptions, and geographical jurisdictions. This lets our system evaluate relational conflicts that typical chatbots miss.
              </p>
            </div>
            <div className="flex-1 w-full max-w-md bg-white rounded-2xl border border-outline-variant/30 p-8 shadow-sm flex items-center justify-center">
              <svg viewBox="0 0 200 120" className="w-full h-auto text-on-surface">
                <circle cx="100" cy="20" r="12" className="fill-secondary/15 stroke-secondary stroke-2" />
                <text x="100" y="23" textAnchor="middle" fontSize="6" fontWeight="bold">Product</text>

                <circle cx="40" cy="70" r="12" className="fill-primary/10 stroke-primary stroke-2" />
                <text x="40" y="73" textAnchor="middle" fontSize="6" fontWeight="bold">Customer</text>

                <circle cx="160" cy="70" r="12" className="fill-primary/10 stroke-primary stroke-2" />
                <text x="160" y="73" textAnchor="middle" fontSize="6" fontWeight="bold">Competitors</text>

                <circle cx="100" cy="100" r="12" className="fill-amber-500/10 stroke-amber-500 stroke-2" />
                <text x="100" y="103" textAnchor="middle" fontSize="6" fontWeight="bold">Pricing</text>

                <path d="M 100 32 L 40 58 M 100 32 L 160 58 M 40 82 L 100 88 M 160 82 L 100 88" className="stroke-outline-variant stroke-2" strokeDasharray="3,3" />
              </svg>
            </div>
          </section>

          {/* Feature 3: AI Cross-Verification */}
          <section className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <span className="text-xs font-mono font-bold text-secondary uppercase tracking-widest block">03 / Dual Engines</span>
              <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">AI Cross-Verification</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Rather than using AI to write predictions blindly, we execute two distinct LLM review instances (trained differently) to challenge our deterministic score. If there is a score gap, the Agreement Index drops, prompting humans to look for validation loopholes.
              </p>
            </div>
            <div className="flex-1 w-full max-w-md bg-white rounded-2xl border border-outline-variant/30 p-8 shadow-sm space-y-4">
              <div className="flex justify-between items-center text-xs border-b border-outline-variant/20 pb-2">
                <span className="font-bold">Model A (Rule Score)</span>
                <span className="font-mono font-semibold text-secondary">82/100</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-outline-variant/20 pb-2">
                <span className="font-bold">Model B (AI Reviewer)</span>
                <span className="font-mono font-semibold text-primary">85/100</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2">
                <span className="font-bold">Agreement Index</span>
                <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 font-mono font-bold rounded">96% - Very High</span>
              </div>
            </div>
          </section>

          {/* Feature 4: Consistency Validation */}
          <section className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className="flex-1 space-y-6">
              <span className="text-xs font-mono font-bold text-secondary uppercase tracking-widest block">04 / Consistency Checks</span>
              <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">Consistency Validation</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                The engine matches claimed resources against operational plans. If your questionnaire states you are doing hardware integration in Phase 1, but your team background has zero hardware/logistics expertise, our validation flags will highlight the bottleneck.
              </p>
            </div>
            <div className="flex-1 w-full max-w-md bg-white rounded-2xl border border-outline-variant/30 p-6 shadow-sm">
              <div className="border-l-4 border-amber-500 bg-amber-50/50 p-4 rounded-r-lg space-y-2">
                <h4 className="font-bold text-xs text-amber-800 uppercase tracking-wide">Consistency Warning</h4>
                <p className="text-xs text-on-surface leading-relaxed">
                  "Phase 1 roadmap claims quick custom hardware deployment, but team background contains only SaaS marketing expertise. Execution bottleneck flagged."
                </p>
              </div>
            </div>
          </section>

          {/* Feature 5: Report Export */}
          <section className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <span className="text-xs font-mono font-bold text-secondary uppercase tracking-widest block">05 / Reporting</span>
              <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">Report Export</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Every completed evaluation outputs a high-fidelity dashboard that you can copy, link, or export as a printable report page. Share deterministic scores directly with investors or co-founders.
              </p>
            </div>
            <div className="flex-1 w-full max-w-md bg-white rounded-2xl border border-outline-variant/30 p-8 shadow-sm">
              <div className="border border-outline-variant/20 rounded-xl p-4 space-y-4">
                <div className="flex justify-between items-center text-xs border-b border-outline-variant/10 pb-2">
                  <span className="font-bold text-on-surface">VentureLens Report PDF</span>
                  <span className="material-symbols-outlined text-secondary text-base">download</span>
                </div>
                <div className="h-4 w-3/4 bg-surface-container rounded" />
                <div className="h-4 w-1/2 bg-surface-container rounded" />
                <div className="h-10 bg-secondary/15 rounded flex items-center justify-center text-xs font-bold text-secondary">
                  PDF Generated Successfully
                </div>
              </div>
            </div>
          </section>

          {/* Feature 6: Security & Privacy */}
          <section className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className="flex-1 space-y-6">
              <span className="text-xs font-mono font-bold text-secondary uppercase tracking-widest block">06 / Governance</span>
              <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">Security & Privacy</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                We take confidentiality seriously. Data is protected with SSL/TLS encryption in transit and AES-256 encryption at rest. We follow a strict GDPR compliance framework, ensuring your IP belongs strictly to you.
              </p>
            </div>
            <div className="flex-1 w-full max-w-md bg-white rounded-2xl border border-outline-variant/30 p-8 shadow-sm flex flex-col justify-center gap-3">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-xl">lock</span>
                <span className="text-xs font-bold">AES-256 Storage Encryption</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-emerald-500 text-xl">shield</span>
                <span className="text-xs font-bold">SOC 2 Alignment Principles</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-blue-500 text-xl">verified_user</span>
                <span className="text-xs font-bold">GDPR Compliance Standard</span>
              </div>
            </div>
          </section>

        </div>

        <div className="mt-24 text-center">
          <Link
            href="/wizard"
            className="bg-primary text-on-primary px-10 py-4 rounded-xl text-base font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm inline-block"
          >
            Start Your Free Analysis Now
          </Link>
        </div>
      </main>

      <footer className="bg-surface border-t border-outline-variant/30 py-8 text-center text-xs text-on-surface-variant">
        <p>© 2026 VentureLens AI. All rights reserved. <Link href="/" className="underline hover:text-secondary ml-2">Home</Link></p>
      </footer>
    </div>
  );
}
