"use client";

import Link from "next/link";
import { toast } from "sonner";

export default function PricingPage() {
  const handleComingSoon = (plan: string) => {
    toast.info(`${plan} Plan — Coming Soon`, {
      description: "During our launch phase, full institutional venture diligence is 100% free.",
      duration: 4000,
    });
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="flex justify-between items-center px-6 lg:px-12 h-20 max-w-[1440px] mx-auto">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md">
              VL
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                VentureLens
              </span>
              <span className="text-[10px] block font-semibold text-blue-600 tracking-wider uppercase">
                Venture Intelligence
              </span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link href="/platform" className="hover:text-blue-600 transition-colors">Platform</Link>
            <Link href="/features" className="hover:text-blue-600 transition-colors">Features</Link>
            <Link href="/pricing" className="text-blue-600 border-b-2 border-blue-600 pb-1">Pricing</Link>
            <Link href="/about" className="hover:text-blue-600 transition-colors">About Founder</Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 text-sm font-semibold transition-colors">Dashboard</Link>
            <Link
              href="/wizard"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-sm"
            >
              Launch Diligence
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest rounded-full border border-blue-200 mb-6">
            Transparent Access Tiers
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-slate-900">Simple, Transparent Pricing</h1>
          <p className="text-lg text-slate-600 leading-relaxed font-normal">
            Free during our launch phase. Run unlimited venture due diligence analyses, pitch deck evaluations, and scoring equations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Plan 1: Founder Free */}
          <div className="bg-white p-8 rounded-3xl border-2 border-blue-600 shadow-lg relative flex flex-col justify-between">
            <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
              Active Tier
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Founder Diligence</h2>
              <p className="text-xs text-slate-500 mb-6">Complete access for early-stage founders & builders.</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-extrabold text-slate-900">$0</span>
                <span className="text-xs text-slate-500">/ forever free</span>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-600 font-medium mb-8">
                <li className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-blue-600 text-base">check_circle</span>
                  <span>16 Deterministic VC Logic Rules</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-blue-600 text-base">check_circle</span>
                  <span>8-Dimension Evidence-Grounded Scoring Math</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-blue-600 text-base">check_circle</span>
                  <span>5-Pillar AI Cross-Verification Breakdown</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-blue-600 text-base">check_circle</span>
                  <span>Multi-Layer Pitch Deck Parser (PDF, PPTX, DOCX)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-blue-600 text-base">check_circle</span>
                  <span>14-Day Validation Experiment & Roadmap</span>
                </li>
              </ul>
            </div>
            <Link
              href="/wizard"
              className="w-full py-3.5 bg-blue-600 text-white rounded-xl text-sm font-bold text-center block hover:bg-blue-700 transition-all shadow-md active:scale-95"
            >
              Start Free Diligence
            </Link>
          </div>

          {/* Plan 2: Accelerator / Fund */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Accelerator Pro</h2>
              <p className="text-xs text-slate-500 mb-6">Designed for angel syndicates & startup incubators.</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-extrabold text-slate-900">$99</span>
                <span className="text-xs text-slate-500">/ month (Coming Soon)</span>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-600 font-medium mb-8">
                <li className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-slate-400 text-base">schedule</span>
                  <span>Batch Cohort Diligence Ingestion</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-slate-400 text-base">schedule</span>
                  <span>Comparative Deal Flow Ranking Matrix</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-slate-400 text-base">schedule</span>
                  <span>Custom LP Investment Memo Export</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-slate-400 text-base">schedule</span>
                  <span>Priority Diligence Processing</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleComingSoon("Accelerator Pro")}
              className="w-full py-3.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold text-center block hover:bg-slate-200 transition-colors"
            >
              Join Pro Waitlist
            </button>
          </div>

          {/* Plan 3: Enterprise VC */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Enterprise VC</h2>
              <p className="text-xs text-slate-500 mb-6">For institutional seed funds & corporate venture units.</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-extrabold text-slate-900">Custom</span>
                <span className="text-xs text-slate-500">/ dedicated deployment</span>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-600 font-medium mb-8">
                <li className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                  <span>Custom Deterministic Heuristic Gates</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                  <span>Private In-House Model Fine-Tuning</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                  <span>Dedicated SLA & Founder Consultation</span>
                </li>
              </ul>
            </div>
            <Link
              href="/contact"
              className="w-full py-3.5 bg-slate-900 text-white rounded-xl text-sm font-bold text-center block hover:bg-slate-800 transition-colors"
            >
              Contact Founder
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs text-center mt-24">
        <div className="max-w-[1440px] mx-auto px-6 space-y-2">
          <p>© 2026 VentureLens AI. Founded by Datha Sai Swaroop (IIT BHU). All rights reserved.</p>
          <p className="text-slate-500">Contact: dathasaiswaroopgudimella@gmail.com · +91 9121146369</p>
        </div>
      </footer>
    </div>
  );
}
