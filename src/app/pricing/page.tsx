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

      <footer className="bg-surface border-t border-outline-variant/30 py-8 text-center text-xs text-on-surface-variant">
        <p>© 2026 VentureLens AI. All rights reserved. <Link href="/" className="underline hover:text-secondary ml-2">Home</Link></p>
      </footer>
    </div>
  );
}
