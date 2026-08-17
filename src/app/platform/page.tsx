import Link from "next/link";

export const dynamic = "force-static";

export default function PlatformPage() {
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
            <Link href="/platform" className="text-secondary border-b-2 border-secondary pb-1">Platform</Link>
            <Link href="/features" className="text-on-surface-variant hover:text-on-surface transition-colors">Features</Link>
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

      <main className="max-w-5xl mx-auto px-8 py-16">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-accent/10 border border-emerald-accent/20 rounded-full mb-6">
            <span className="font-mono text-xs text-emerald-accent font-semibold uppercase tracking-wider">
              Platform Architecture
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Enterprise Diligence Platform</h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Understand the underpinnings of our deterministic analysis pipeline, scoring equations, and high-performance inference engine.
          </p>
        </div>

        <div className="space-y-12">
          
          {/* Section 1: Dual-Zone Architecture */}
          <div className="bg-white p-8 rounded-xl border border-outline-variant/30 micro-shadow space-y-6">
            <h2 className="text-2xl font-bold text-on-surface">1. Dual-Zone Evaluation Architecture</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              VentureLens divides analysis into two independent isolation zones: a deterministic mathematical engine that computes logic rule consistency and weighted scoring equations, and an independent adversarial artificial intelligence model that challenges assumptions against empirical market realities.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center text-xs">
              <div className="p-4 bg-surface rounded-lg border border-outline-variant/30 space-y-1">
                <span className="font-bold text-secondary block uppercase text-[10px]">Zone 1: Ingestion</span>
                <p className="font-bold text-on-surface">PDF / PPTX / Forms</p>
                <p className="text-[11px] text-on-surface-variant">Multi-layer text extraction</p>
              </div>
              <div className="p-4 bg-surface rounded-lg border border-outline-variant/30 space-y-1">
                <span className="font-bold text-secondary block uppercase text-[10px]">Zone 2: Deterministic</span>
                <p className="font-bold text-on-surface">16 VC Logic Gates</p>
                <p className="text-[11px] text-on-surface-variant">Heuristic rule validation</p>
              </div>
              <div className="p-4 bg-surface rounded-lg border border-outline-variant/30 space-y-1">
                <span className="font-bold text-secondary block uppercase text-[10px]">Zone 3: Equations</span>
                <p className="font-bold text-on-surface">Evidence Weighting</p>
                <p className="text-[11px] text-on-surface-variant">Raw × Confidence math</p>
              </div>
              <div className="p-4 bg-secondary-container rounded-lg border border-secondary/20 space-y-1">
                <span className="font-bold text-secondary block uppercase text-[10px]">Zone 4: Adversarial</span>
                <p className="font-bold text-on-secondary-container">5-Pillar AI Audit</p>
                <p className="text-[11px] text-on-secondary-container">Final VC verdict & MVP</p>
              </div>
            </div>
          </div>

          {/* Section 2: Security & Privacy */}
          <div className="bg-white p-8 rounded-xl border border-outline-variant/30 micro-shadow space-y-6">
            <h2 className="text-2xl font-bold text-on-surface">2. Security & Data Privacy</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Founder pitch decks and proprietary startup concepts are protected with enterprise encryption standards. No uploaded deck data is used to train public foundational models.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-on-surface-variant">
              <div className="p-4 bg-surface rounded-lg border border-outline-variant/20">
                <span className="font-bold text-on-surface block mb-1">TLS 1.3 & AES-256</span>
                <p className="leading-relaxed">All network payloads are encrypted in transit and at rest with military-grade standards.</p>
              </div>
              <div className="p-4 bg-surface rounded-lg border border-outline-variant/20">
                <span className="font-bold text-on-surface block mb-1">Zero Model Training</span>
                <p className="leading-relaxed">Your intellectual property, patents, and business ideas are never retained for model fine-tuning.</p>
              </div>
              <div className="p-4 bg-surface rounded-lg border border-outline-variant/20">
                <span className="font-bold text-on-surface block mb-1">Tenant Isolation</span>
                <p className="leading-relaxed">Strict row-level security ensures your reports are only accessible to authorized sessions.</p>
              </div>
            </div>
          </div>

          {/* Section 3: Enterprise Deployment */}
          <div className="bg-white p-8 rounded-xl border border-outline-variant/30 micro-shadow space-y-6">
            <h2 className="text-2xl font-bold text-on-surface">3. Accelerator & Institutional Deployment</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              For university incubators, venture capital funds, and angel syndicates screening hundreds of startup applications monthly, VentureLens offers custom cohort evaluation pipelines and automated scoring dashboards.
            </p>
            <div className="flex justify-start">
              <Link
                href="/contact"
                className="bg-primary text-on-primary px-6 py-2.5 rounded-lg text-xs font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm inline-block"
              >
                Inquire About Enterprise Deployments
              </Link>
            </div>
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
