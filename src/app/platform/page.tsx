import Link from "next/link";

export const dynamic = "force-static";

export default function PlatformPage() {
  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation Bar */}
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
            <Link href="/platform" className="text-blue-600 border-b-2 border-blue-600 pb-1">Platform</Link>
            <Link href="/features" className="hover:text-blue-600 transition-colors">Features</Link>
            <Link href="/pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
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

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest rounded-full border border-blue-200 mb-6">
            Platform Infrastructure
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight text-slate-900">Enterprise Diligence Platform</h1>
          <p className="text-lg text-slate-600 leading-relaxed font-normal">
            Understand how our deterministic pipeline, evidence scoring equations, and high-performance inference engine operate at scale.
          </p>
        </div>

        <div className="space-y-12">
          
          {/* Section 1: Architecture Overview */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">1. Dual-Zone Evaluation Architecture</h2>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              VentureLens divides analysis into two independent isolation zones: a deterministic mathematical engine that computes logic rule consistency and weighted scoring equations, and an independent adversarial artificial intelligence model that challenges assumptions against empirical market realities.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-bold text-blue-600 block uppercase text-[10px]">Zone 1: Ingestion</span>
                <p className="font-bold text-slate-900">PDF / PPTX / Forms</p>
                <p className="text-[11px] text-slate-500 font-normal">Multi-layer text extraction</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-bold text-blue-600 block uppercase text-[10px]">Zone 2: Deterministic</span>
                <p className="font-bold text-slate-900">16 VC Logic Gates</p>
                <p className="text-[11px] text-slate-500 font-normal">Heuristic rule validation</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-bold text-blue-600 block uppercase text-[10px]">Zone 3: Equations</span>
                <p className="font-bold text-slate-900">Evidence Weighting</p>
                <p className="text-[11px] text-slate-500 font-normal">Raw × Confidence math</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-1">
                <span className="font-bold text-blue-700 block uppercase text-[10px]">Zone 4: Adversarial</span>
                <p className="font-bold text-blue-900">5-Pillar AI Audit</p>
                <p className="text-[11px] text-blue-700 font-normal">Final VC verdict & MVP</p>
              </div>
            </div>
          </div>

          {/* Section 2: Security & Data Privacy */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">2. Security, Isolation & IP Protection</h2>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Founder pitch decks and proprietary startup concepts are protected with enterprise encryption standards. No uploaded deck data is used to train public foundational models.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1 text-sm">TLS 1.3 & AES-256</span>
                <p className="leading-relaxed font-normal">All network payloads are encrypted in transit and at rest with military-grade standards.</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1 text-sm">Zero Model Training</span>
                <p className="leading-relaxed font-normal">Your intellectual property, patents, and business ideas are never retained for model fine-tuning.</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1 text-sm">Tenant Isolation</span>
                <p className="leading-relaxed font-normal">Strict row-level security ensures your reports are only accessible to authorized sessions.</p>
              </div>
            </div>
          </div>

          {/* Section 3: Enterprise Deployments */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">3. Accelerator & Institutional Deployment</h2>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              For university incubators, venture capital funds, and angel syndicates screening hundreds of startup applications monthly, VentureLens offers custom cohort evaluation pipelines and automated scoring dashboards.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors shadow-sm"
              >
                <span>Contact Founder for Enterprise Pilots</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs text-center">
        <div className="max-w-[1440px] mx-auto px-6 space-y-2">
          <p>© 2026 VentureLens AI. Founded by Datha Sai Swaroop (IIT BHU). All rights reserved.</p>
          <p className="text-slate-500">Contact: dathasaiswaroopgudimella@gmail.com · +91 9121146369</p>
        </div>
      </footer>
    </div>
  );
}
