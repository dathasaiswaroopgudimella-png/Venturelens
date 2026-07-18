import Link from "next/link";

export const dynamic = "force-static";

export default function PlatformPage() {
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

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-accent/10 border border-emerald-accent/20 rounded-full mb-6">
            <span className="font-mono text-xs text-emerald-accent font-semibold uppercase tracking-wider">
              Architecture & Mechanics
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">The 9-Stage Validation Pipeline</h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            A pipeline combining deterministic algorithmic engines with LLM co-verification checks.
          </p>
        </div>

        <div className="space-y-12">
          {/* Section: How it works */}
          <div className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-on-surface">Algorithmic Stage Sequence</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-on-surface-variant">
              <div className="p-4 bg-surface rounded-lg space-y-2">
                <span className="font-mono text-xs text-secondary font-bold">STAGES 1 - 3</span>
                <h4 className="font-bold text-on-surface">Extraction & Graphing</h4>
                <p>Structured fact extraction maps questionnaire data into a Venture Knowledge Graph containing custom entity relationships.</p>
              </div>
              <div className="p-4 bg-surface rounded-lg space-y-2">
                <span className="font-mono text-xs text-secondary font-bold">STAGES 4 - 6</span>
                <h4 className="font-bold text-on-surface">Rules & Scoring</h4>
                <p>A rule engine runs logic checks (switching costs, ICP alignment) which directly adjust values inside the heuristic scoring engine.</p>
              </div>
              <div className="p-4 bg-surface rounded-lg space-y-2">
                <span className="font-mono text-xs text-secondary font-bold">STAGES 7 - 9</span>
                <h4 className="font-bold text-on-surface">Evidence & AI Audit</h4>
                <p>Real-time internet search validates competitor claims. AI explainer maps SWOT paths while an independent AI auditor challenges metrics.</p>
              </div>
            </div>
          </div>

          {/* Section: Explainability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-on-surface-variant">
            <div className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-on-surface">Explainable Rules</h3>
              <p>
                Every rule failure or warning explains exactly why the thesis failed structural logic checks. You receive actionable steps to resolve gaps.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-on-surface">Decoupled Architecture</h3>
              <p>
                By keeping scoring logic 100% deterministic, we prevent AI hallucinations from inflating venture health scores. AI only functions as an auditor and explainer.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/wizard"
            className="bg-primary text-on-primary px-10 py-4 rounded-xl text-base font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm inline-block"
          >
            Launch Wizard
          </Link>
        </div>
      </main>

      <footer className="bg-surface border-t border-outline-variant/30 py-8 text-center text-xs text-on-surface-variant">
        <p>© 2026 VentureLens AI. All rights reserved. <Link href="/" className="underline hover:text-secondary ml-2">Home</Link></p>
      </footer>
    </div>
  );
}
