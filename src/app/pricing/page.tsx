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
          <Link href="/" className="font-headline-md text-xl font-bold tracking-tight text-on-surface">
            VentureLens AI
          </Link>
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

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-accent/10 border border-emerald-accent/20 rounded-full mb-6">
            <span className="font-mono text-xs text-emerald-accent font-semibold uppercase tracking-wider">
              Fair & Transparent Pricing
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Flexible Plans for Every Stage</h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Free during our beta program. Build, test, and validate ideas without friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Plan 1: Beta Free */}
          <div className="bg-white p-8 rounded-xl border-2 border-secondary shadow-sm relative flex flex-col justify-between">
            <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-secondary text-white font-mono text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              Active Tier
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-on-surface mb-2">Beta Free</h2>
              <p className="text-xs text-on-surface-variant mb-6">Ideal for pre-seed founders and builders.</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold font-mono text-on-surface">$0</span>
                <span className="text-xs text-on-surface-variant">/ forever</span>
              </div>
              <ul className="space-y-4 text-xs text-on-surface-variant font-medium mb-8">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                  <span>9-stage deterministic pipeline</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                  <span>10-dimension venture scoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                  <span>AI cross-verification review</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                  <span>Interactive SWOT & GTM matrices</span>
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
          <div className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-between opacity-80">
            <div>
              <h2 className="text-2xl font-extrabold text-on-surface mb-2">Pro Partner</h2>
              <p className="text-xs text-on-surface-variant mb-6">Designed for serial founders & incubators.</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold font-mono text-on-surface">$49</span>
                <span className="text-xs text-on-surface-variant">/ month</span>
              </div>
              <ul className="space-y-4 text-xs text-on-surface-variant font-medium mb-8">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-base">pending</span>
                  <span>Private dashboard persistence</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-base">pending</span>
                  <span>Custom domain sharing options</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-base">pending</span>
                  <span>Detailed competitor mapping visualizer</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-base">pending</span>
                  <span>Export to clean investor PDF decks</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleComingSoon("Pro Partner")}
              className="w-full py-3.5 border border-outline-variant text-on-surface hover:bg-surface-container-low rounded-lg text-sm font-bold transition-colors active:scale-98"
            >
              Join Pro Waitlist
            </button>
          </div>

          {/* Plan 3: Enterprise */}
          <div className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-between opacity-80">
            <div>
              <h2 className="text-2xl font-extrabold text-on-surface mb-2">Enterprise</h2>
              <p className="text-xs text-on-surface-variant mb-6">For venture funds & accelerator cohorts.</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold font-mono text-on-surface">Custom</span>
              </div>
              <ul className="space-y-4 text-xs text-on-surface-variant font-medium mb-8">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-base">pending</span>
                  <span>Direct API endpoints access</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-base">pending</span>
                  <span>White-label reporting dashboards</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-base">pending</span>
                  <span>Team collaboration & workspace management</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-base">pending</span>
                  <span>Custom fine-tuned strategic weights</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleComingSoon("Enterprise")}
              className="w-full py-3.5 border border-outline-variant text-on-surface hover:bg-surface-container-low rounded-lg text-sm font-bold transition-colors active:scale-98"
            >
              Contact Enterprise
            </button>
          </div>
        </div>
      </main>

      {/* FAQ Section */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-extrabold text-center tracking-tight text-on-surface mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "What's included in the deterministic engine?",
              a: "The deterministic rule engine applies 16 logic checks across problem clarity, market sizing, competitive density, pricing consistency, GTM feasibility, team credibility, and moat defensibility. It generates a weighted 0-100 score without relying on language model hallucinations.",
            },
            {
              q: "How is this different from ChatGPT or other AI tools?",
              a: "ChatGPT generates plausible-sounding text but cannot apply structured rules, verify internal consistency, or cross-reference your claims against real market data. VentureLens uses a deterministic scoring layer first, then uses AI only as a secondary cross-verification engine — not the primary source of truth.",
            },
            {
              q: "Can I export reports as PDF?",
              a: "PDF export is on the Pro plan roadmap. During beta, you can use your browser's print-to-PDF function to save any report page.",
            },
            {
              q: "Do you store my startup ideas?",
              a: "All startup submissions are encrypted at rest and in transit. Your ideas are never shared with third parties, sold to investors, or used to train AI models without explicit consent. Enterprise users can enable full self-hosting.",
            },
            {
              q: "Can I cancel my subscription anytime?",
              a: "Yes. Pro and Enterprise plans are month-to-month with no lock-in. Cancel from your billing settings at any time and your access continues through the end of the paid period.",
            },
          ].map((item, i) => (
            <details
              key={i}
              className="group bg-white border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm"
            >
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-semibold text-sm text-on-surface list-none hover:bg-surface-container-low transition-colors">
                <span>{item.q}</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform text-lg">
                  expand_more
                </span>
              </summary>
              <div className="px-6 pb-5 text-xs text-on-surface-variant leading-relaxed border-t border-outline-variant/20 pt-4">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary/5 border-y border-primary/10 py-16 text-center px-6">
        <h2 className="text-2xl font-extrabold tracking-tight text-on-surface mb-3">
          Still unsure? Try a free analysis.
        </h2>
        <p className="text-on-surface-variant text-sm mb-8 max-w-md mx-auto">
          No credit card required. Run your startup through the full deterministic pipeline right now.
        </p>
        <Link
          href="/wizard"
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 shadow-md"
        >
          <span className="material-symbols-outlined text-lg">rocket_launch</span>
          <span>Start Free Analysis</span>
        </Link>
      </section>

      <footer className="bg-surface border-t border-outline-variant/30 py-8 text-center text-xs text-on-surface-variant">
        <p>© 2026 VentureLens AI. All rights reserved. <Link href="/" className="underline hover:text-secondary ml-2">Home</Link></p>
      </footer>
    </div>
  );
}
