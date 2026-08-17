"use client";

import Link from "next/link";
import { toast } from "sonner";

export default function PricingPage() {
  const handleComingSoon = (plan: string) => {
    toast.info(`${plan} Plan — Coming Soon`, {
      description: "During the Beta phase, all standard analysis tools are 100% free.",
      duration: 4000,
    });
  };

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
            <Link href="/features" className="text-on-surface-variant hover:text-on-surface transition-colors">Features</Link>
            <Link href="/pricing" className="text-secondary border-b-2 border-secondary pb-1">Pricing</Link>
            <Link href="/templates" className="text-on-surface-variant hover:text-on-surface transition-colors">Templates</Link>
            <Link href="/about" className="text-on-surface-variant hover:text-on-surface transition-colors">About</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-secondary hover:opacity-80 transition-opacity text-sm font-semibold">
              Dashboard
            </Link>
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
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-accent/10 border border-emerald-accent/20 rounded-full mb-6">
            <span className="font-mono text-xs text-emerald-accent font-semibold uppercase tracking-wider">
              Transparent Access
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Flexible Plans for Every Stage</h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Free during our launch phase. Run unlimited venture due diligence analyses, pitch deck evaluations, and scoring equations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Plan 1: Beta Free */}
          <div className="bg-white p-8 rounded-xl border-2 border-secondary shadow-sm relative flex flex-col justify-between">
            <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-secondary text-white font-mono text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              Active Tier
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-on-surface mb-2">Founder Free</h2>
              <p className="text-xs text-on-surface-variant mb-6">Ideal for pre-seed founders and early builders.</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold font-mono text-on-surface">$0</span>
                <span className="text-xs text-on-surface-variant">/ forever free</span>
              </div>
              <ul className="space-y-4 text-xs text-on-surface-variant font-medium mb-8">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                  <span>16 Deterministic VC Logic Rules</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                  <span>8-Dimension Evidence-Grounded Scoring Math</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                  <span>5-Pillar AI Cross-Verification Breakdown</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                  <span>Multi-Layer Pitch Deck Parser (PDF, PPTX, DOCX)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                  <span>14-Day Validation Experiment & Roadmap</span>
                </li>
              </ul>
            </div>
            <Link
              href="/wizard"
              className="w-full py-3.5 bg-secondary text-white rounded-lg text-sm font-bold text-center block hover:opacity-90 transition-opacity active:scale-98 shadow-sm"
            >
              Analyze Idea Free
            </Link>
          </div>

          {/* Plan 2: Pro Partner */}
          <div className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-between opacity-90">
            <div>
              <h2 className="text-2xl font-extrabold text-on-surface mb-2">Accelerator Pro</h2>
              <p className="text-xs text-on-surface-variant mb-6">Designed for angel syndicates & startup incubators.</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold font-mono text-on-surface">$99</span>
                <span className="text-xs text-on-surface-variant">/ month (Coming Soon)</span>
              </div>
              <ul className="space-y-4 text-xs text-on-surface-variant font-medium mb-8">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-surface-variant text-base">schedule</span>
                  <span>Batch Cohort Diligence Ingestion</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-surface-variant text-base">schedule</span>
                  <span>Comparative Deal Flow Ranking Matrix</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-surface-variant text-base">schedule</span>
                  <span>Custom LP Investment Memo Export</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-surface-variant text-base">schedule</span>
                  <span>Priority Diligence Processing</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleComingSoon("Accelerator Pro")}
              className="w-full py-3.5 bg-surface-container text-on-surface font-semibold rounded-lg text-sm text-center block hover:bg-surface-container-high transition-colors"
            >
              Join Pro Waitlist
            </button>
          </div>

          {/* Plan 3: Enterprise VC */}
          <div className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-on-surface mb-2">Enterprise VC</h2>
              <p className="text-xs text-on-surface-variant mb-6">For institutional seed funds & corporate venture units.</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-extrabold text-on-surface">Custom</span>
                <span className="text-xs text-on-surface-variant">/ dedicated deployment</span>
              </div>
              <ul className="space-y-4 text-xs text-on-surface-variant font-medium mb-8">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-accent text-base">check_circle</span>
                  <span>Custom Deterministic Heuristic Gates</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-accent text-base">check_circle</span>
                  <span>Private In-House Model Fine-Tuning</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-accent text-base">check_circle</span>
                  <span>Dedicated SLA & Founder Consultation</span>
                </li>
              </ul>
            </div>
            <Link
              href="/contact"
              className="w-full py-3.5 bg-primary text-on-primary rounded-lg text-sm font-bold text-center block hover:opacity-90 transition-opacity active:scale-98 shadow-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-outline-variant/30 py-8 text-center text-xs text-on-surface-variant mt-16">
        <p>© 2026 VentureLens AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
