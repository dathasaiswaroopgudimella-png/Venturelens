"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-surface min-h-screen text-on-surface font-sans selection:bg-secondary-container selection:text-on-secondary-container">
      {/* TopNavBar */}
      <header className="docked full-width top-0 sticky z-50 glass-header border-b border-outline-variant/30 shadow-sm">
        <div className="flex justify-between items-center px-8 h-16 w-full max-w-[1440px] mx-auto">
          <div className="font-headline-md text-xl font-bold tracking-tight text-on-surface">
            VentureLens AI
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a className="text-secondary border-b-2 border-secondary pb-1 transition-all duration-200" href="#">
              Platform
            </a>
            <a className="text-on-surface-variant hover:text-on-surface hover:opacity-80 transition-all duration-200" href="#">
              Solutions
            </a>
            <a className="text-on-surface-variant hover:text-on-surface hover:opacity-80 transition-all duration-200" href="#">
              Resources
            </a>
            <a className="text-on-surface-variant hover:text-on-surface hover:opacity-80 transition-all duration-200" href="#">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-primary hover:opacity-80 transition-opacity text-sm font-semibold">
              Dashboard
            </Link>
            <Link
              href="/wizard"
              className="bg-primary text-on-primary px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all active:scale-95 shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden bg-surface">
          <div className="relative z-10 max-w-[1440px] mx-auto px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-accent/10 border border-emerald-accent/20 rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-accent animate-pulse"></span>
              <span className="font-mono text-xs text-emerald-accent font-semibold uppercase tracking-wider">
                Decision Intelligence 1.0
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 max-w-4xl mx-auto tracking-tight leading-tight">
              From Startup Idea to <span className="text-secondary">Investment-Ready</span> Decisions.
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
              The first Startup Decision Intelligence Platform. Move beyond chatbot guesses to deterministic, data-backed analysis for your next venture.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/wizard"
                className="bg-primary text-on-primary px-8 py-4 rounded-lg text-lg font-bold hover:opacity-90 transition-all macro-shadow active:scale-95"
              >
                Start Free Analysis
              </Link>
              <button
                onClick={() => {
                  window.location.href = "#deterministic-engine";
                }}
                className="bg-white border border-outline-variant/50 text-primary px-8 py-4 rounded-lg text-lg font-bold hover:bg-surface-container-low transition-all"
              >
                Learn How It Works
              </button>
            </div>

            {/* Trusted By logos placeholder */}
            <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500 max-w-4xl mx-auto">
              <div className="flex justify-center items-center h-12">
                <span className="font-sans text-xl font-bold italic tracking-tighter">VENTURE_CAP</span>
              </div>
              <div className="flex justify-center items-center h-12">
                <span className="font-sans text-xl font-bold tracking-tighter">ALPHA_HUB</span>
              </div>
              <div className="flex justify-center items-center h-12">
                <span className="font-sans text-xl font-bold italic tracking-tighter">SEED_STRAT</span>
              </div>
              <div className="flex justify-center items-center h-12">
                <span className="font-sans text-xl font-bold tracking-tighter">FOUNDER_LAB</span>
              </div>
            </div>
          </div>
        </section>

        {/* The Deterministic Engine Illustration */}
        <section id="deterministic-engine" className="py-24 bg-white border-y border-outline-variant/20">
          <div className="max-w-[1440px] mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 tracking-tight">The Deterministic Engine</h2>
              <p className="text-on-surface-variant max-w-xl mx-auto">
                VentureLens does not guess. It executes a rigorous validation pipeline through specialized algorithmic engines.
              </p>
            </div>
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 py-12">
              {/* Stage 1 */}
              <div className="w-full md:w-1/4 group cursor-default">
                <div className="p-8 bg-surface rounded-xl border border-outline-variant/30 micro-shadow group-hover:macro-shadow transition-all duration-300">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-secondary text-2xl">lightbulb</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Startup Idea</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Input your thesis, market assumptions, and target pricing details.
                  </p>
                  <div className="mt-6 font-mono text-xs text-secondary font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    RAW INPUT COLLECTED
                  </div>
                </div>
              </div>

              {/* Arrow 1 */}
              <div className="hidden md:block flex-1 h-px bg-outline-variant/40 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant/40 animate-pulse">chevron_right</span>
                </div>
              </div>

              {/* Stage 2 */}
              <div className="w-full md:w-1/3 z-10">
                <div className="p-8 bg-primary text-white rounded-xl border border-outline-variant/10 macro-shadow scale-105">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-accent/20 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-emerald-accent text-xl">analytics</span>
                      </div>
                      <span className="text-lg font-bold">Validation Pipeline</span>
                    </div>
                    <span className="font-mono text-xs text-emerald-accent bg-emerald-accent/10 px-2 py-1 rounded">
                      PROCESSING...
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between font-mono text-xs mb-1">
                        <span>MARKET DEPTH</span>
                        <span className="text-emerald-accent">92%</span>
                      </div>
                      <div className="confidence-track">
                        <div className="bg-emerald-accent h-full w-[92%]"></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between font-mono text-xs mb-1">
                        <span>GTM FEASIBILITY</span>
                        <span className="text-secondary">74%</span>
                      </div>
                      <div className="confidence-track">
                        <div className="bg-secondary h-full w-[74%]"></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between font-mono text-xs mb-1">
                        <span>RISK COEFFICIENT</span>
                        <span className="text-on-surface-variant">LOW</span>
                      </div>
                      <div className="confidence-track">
                        <div className="bg-emerald-accent/30 h-full w-[20%]"></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex gap-2 overflow-hidden">
                    <span className="font-mono text-[10px] bg-white/10 px-2 py-1 rounded border border-white/20 whitespace-nowrap">
                      TAM_SAM_SOM.v2
                    </span>
                    <span className="font-mono text-[10px] bg-white/10 px-2 py-1 rounded border border-white/20 whitespace-nowrap">
                      COMPETITOR_MAP
                    </span>
                  </div>
                </div>
              </div>

              {/* Arrow 2 */}
              <div className="hidden md:block flex-1 h-px bg-outline-variant/40 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant/40 animate-pulse">chevron_right</span>
                </div>
              </div>

              {/* Stage 3 */}
              <div className="w-full md:w-1/4 group cursor-default">
                <div className="p-8 bg-surface rounded-xl border border-outline-variant/30 micro-shadow group-hover:macro-shadow transition-all duration-300">
                  <div className="w-12 h-12 bg-emerald-accent/10 rounded-lg flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-emerald-accent text-2xl">assignment_turned_in</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Final Report</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Unbiased, audit-ready startup rating and SWOT, GTM, and MVP roadmaps.
                  </p>
                  <div className="mt-6 font-mono text-xs text-emerald-accent font-semibold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    100% EXPLAINABLE DECISIONS
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section className="py-24 bg-surface">
          <div className="max-w-[1440px] mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Feature 1 */}
              <div className="md:col-span-8 bg-white p-12 rounded-2xl border border-outline-variant/30 micro-shadow relative overflow-hidden">
                <div className="max-w-md relative z-10">
                  <span className="font-mono text-xs text-secondary uppercase tracking-[0.2em] mb-4 block font-semibold">
                    Core Capability
                  </span>
                  <h3 className="text-3xl font-bold mb-6">Structured Fact Extraction</h3>
                  <p className="text-on-surface-variant mb-8 leading-relaxed">
                    VentureLens automatically extracts target customer personas, core problems, and competitive factors to formulate a clean Venture Knowledge Graph.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant/20 flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-accent text-lg">check</span>
                      <span className="font-mono text-xs">Knowledge Graph Builder</span>
                    </div>
                    <div className="bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant/20 flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-accent text-lg">check</span>
                      <span className="font-mono text-xs">Entity Mappings</span>
                    </div>
                    <div className="bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant/20 flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-accent text-lg">check</span>
                      <span className="font-mono text-xs">Conflict Detection</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="md:col-span-4 bg-primary text-on-primary p-12 rounded-2xl macro-shadow relative overflow-hidden">
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-8">
                    <span className="material-symbols-outlined text-white text-2xl">gavel</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Deterministic Rule Engine</h3>
                  <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
                    Execute custom startup logic rules. Avoid business model conflicts and market size roadblocks before writing code.
                  </p>
                  <ul className="space-y-4 font-mono text-xs">
                    <li className="flex gap-3 opacity-80">
                      <span className="text-emerald-accent">[01]</span> PRICE-ICP MATRICES
                    </li>
                    <li className="flex gap-3 opacity-80">
                      <span className="text-emerald-accent">[02]</span> REVENUE-PRICING CONSISTENCY
                    </li>
                    <li className="flex gap-3 opacity-80">
                      <span className="text-emerald-accent">[03]</span> COMPETITIVE MOAT VALIDATION
                    </li>
                  </ul>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="md:col-span-4 bg-white p-10 rounded-2xl border border-outline-variant/30 micro-shadow hover:border-emerald-accent/50 transition-colors">
                <div className="w-12 h-12 bg-emerald-accent/10 rounded-lg flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-emerald-accent text-2xl">verified_user</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Consistency Validation</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Our consistency engine flags contradictions between your assumptions and third-party competitor directories automatically.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="md:col-span-8 bg-white p-10 rounded-2xl border border-outline-variant/30 micro-shadow hover:border-emerald-accent/50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-secondary text-2xl">rate_review</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">AI Strategic Cross-Verification</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    After deterministic engines execute, an independent LLM strategic review challenges your model and calculates an Agreement index against the core score.
                  </p>
                </div>
                <div className="mt-6 border-t border-outline-variant/20 pt-4 flex justify-between items-center font-mono text-xs">
                  <span className="text-on-surface-variant">Review Engine: NVIDIA NIM</span>
                  <span className="text-emerald-accent font-semibold">Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="py-24 bg-white">
          <div className="max-w-[1440px] mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 tracking-tight">Scale Your Analysis</h2>
              <p className="text-on-surface-variant max-w-xl mx-auto">
                From individual founders testing their next thesis to global venture funds auditing portfolios.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Starter */}
              <div className="p-10 rounded-2xl border border-outline-variant/30 bg-surface flex flex-col">
                <h3 className="text-xl font-bold mb-2">Founder</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold">$0</span>
                  <span className="text-on-surface-variant text-sm font-medium">/per analysis</span>
                </div>
                <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
                  Perfect for testing your first concept.
                </p>
                <ul className="space-y-4 mb-10 flex-1 text-sm text-on-surface-variant">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-accent text-lg">check_circle</span>
                    Single Thesis Validation
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-accent text-lg">check_circle</span>
                    Basic Competitor Mappings
                  </li>
                  <li className="flex items-center gap-3 opacity-40">
                    <span className="material-symbols-outlined text-lg">cancel</span>
                    Custom Rule Customizations
                  </li>
                </ul>
                <Link
                  href="/wizard"
                  className="w-full py-4 border border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-on-primary transition-all text-center"
                >
                  Start Free
                </Link>
              </div>

              {/* Pro */}
              <div className="p-10 rounded-2xl border-2 border-secondary bg-white macro-shadow relative flex flex-col transform md:-translate-y-4">
                <div className="absolute top-0 right-10 -translate-y-1/2 bg-secondary text-on-secondary px-4 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-semibold">
                  Most Popular
                </div>
                <h3 className="text-xl font-bold mb-2 text-secondary">Venture Partner</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold">$499</span>
                  <span className="text-on-surface-variant text-sm font-medium">/month</span>
                </div>
                <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
                  For serious founders and angel investors.
                </p>
                <ul className="space-y-4 mb-10 flex-1 text-sm text-on-surface-variant">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-accent text-lg">check_circle</span>
                    Unlimited Thesis Validations
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-accent text-lg">check_circle</span>
                    Proprietary Market Intelligence
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-accent text-lg">check_circle</span>
                    Investment Grade PDF Exports
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-accent text-lg">check_circle</span>
                    Priority Validation Pipeline
                  </li>
                </ul>
                <Link
                  href="/wizard"
                  className="w-full py-4 bg-secondary text-on-secondary font-bold rounded-lg hover:opacity-90 transition-all text-center"
                >
                  Get Pro Access
                </Link>
              </div>

              {/* Enterprise */}
              <div className="p-10 rounded-2xl border border-outline-variant/30 bg-surface flex flex-col">
                <h3 className="text-xl font-bold mb-2">Institution</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold">Custom</span>
                </div>
                <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
                  For VC firms and corporate innovation boards.
                </p>
                <ul className="space-y-4 mb-10 flex-1 text-sm text-on-surface-variant">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-accent text-lg">check_circle</span>
                    Custom Rule Heuristics
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-accent text-lg">check_circle</span>
                    API & CRM Integrations
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-accent text-lg">check_circle</span>
                    White-label Reports
                  </li>
                </ul>
                <button className="w-full py-4 border border-outline-variant text-on-surface font-bold rounded-lg hover:bg-surface-container-high transition-all">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary text-on-primary">
          <div className="max-w-[1440px] mx-auto px-8 text-center relative overflow-hidden">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight">
              Ready to Validate Your Next Big Thing?
            </h2>
            <p className="text-base md:text-lg mb-12 max-w-2xl mx-auto opacity-80 leading-relaxed font-normal">
              Stop guessing. Start calculating. Join 2,000+ founders using deterministic analysis to secure their next round.
            </p>
            <Link
              href="/wizard"
              className="bg-emerald-accent text-on-primary px-10 py-5 rounded-xl text-lg font-bold hover:scale-105 transition-transform macro-shadow inline-block active:scale-95"
            >
              Start Your Free Analysis Now
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-outline-variant/30 shadow-none">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 py-12 w-full max-w-[1440px] mx-auto">
          <div className="flex flex-col items-center md:items-start gap-4 mb-8 md:mb-0">
            <div className="text-lg font-bold text-on-surface">VentureLens AI</div>
            <p className="text-on-surface-variant text-xs max-w-xs text-center md:text-left leading-relaxed">
              The intelligence layer for the startup ecosystem. High-fidelity analysis for critical decisions.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8 md:mb-0 text-xs text-on-surface-variant font-medium">
            <a className="hover:text-secondary transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-secondary transition-colors" href="#">Terms of Service</a>
            <a className="hover:text-secondary transition-colors" href="#">Security</a>
            <a className="hover:text-secondary transition-colors" href="#">Contact</a>
          </div>
          <div className="text-on-surface-variant text-xs font-semibold">
            © 2026 VentureLens AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
