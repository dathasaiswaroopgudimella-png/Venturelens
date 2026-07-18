import Link from "next/link";

export const dynamic = "force-static";

export default function AboutPage() {
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

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-accent/10 border border-emerald-accent/20 rounded-full mb-6">
            <span className="font-mono text-xs text-emerald-accent font-semibold uppercase tracking-wider">
              Venture Intelligence Platform
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Our Mission</h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            We are replacing speculative advisor chats and unstructured LLM guessing with deterministic logic, rules validation, and objective evidence frameworks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-on-surface-variant leading-relaxed text-sm">
          <div className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-on-surface">Algorithmic Audits</h2>
            <p>
              Traditional startup support relies heavily on subjective feedback. VentureLens AI connects raw questionnaires to a 9-stage analysis engine, calculating structural alignment, customer positioning, and risk indices deterministically.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-on-surface">Independent AI Verification</h2>
            <p>
              By decoupling deterministic scoring from AI review layers, we achieve high-fidelity validation. Our engine checks founder hypotheses against live search records via Tavily and challenges core assumptions without compromising scoring logic.
            </p>
          </div>
        </div>

        <div className="mt-16 bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm text-center">
          <h2 className="text-2xl font-bold mb-4">Want to validate your startup?</h2>
          <p className="text-on-surface-variant text-sm mb-6 max-w-xl mx-auto">
            Run your idea through the co-pilot in under 30 seconds. No credit card, no registration, fully open during beta.
          </p>
          <Link
            href="/wizard"
            className="bg-primary text-on-primary px-8 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
          >
            Launch Diligence Wizard
          </Link>
        </div>
      </main>

      <footer className="bg-surface border-t border-outline-variant/30 py-8 text-center text-xs text-on-surface-variant">
        <p>© 2026 VentureLens AI. All rights reserved. <Link href="/" className="underline hover:text-secondary ml-2">Home</Link></p>
      </footer>
    </div>
  );
}
