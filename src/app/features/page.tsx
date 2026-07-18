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
              Core Capabilities
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Rigorous Product Mechanics</h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Every analysis runs through a multi-stage validation engine designed to reveal blind spots and enforce logic check validation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-2xl">rule</span>
            </div>
            <h3 className="text-xl font-bold">1. Deterministic Rule Verification</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              We process inputs through 16 strict logic check rules. These evaluate contradictions between target customer ICPs, pricing levels, TAM assertions, and competitor positions before any scoring happens.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-2xl">analytics</span>
            </div>
            <h3 className="text-xl font-bold">2. 10-Dimension Venture Scoring</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              VentureLens computes individual indices (out of 100) across 10 critical dimensions: Problem, Customer ICP, Market Size, Competitor Moat, Model Sustainability, Execution, Scalability, and more.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-2xl">search</span>
            </div>
            <h3 className="text-xl font-bold">3. Live Competitor Extraction</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              We query Tavily index databases in real-time. The system searches for active market competitors matching your segment and checks if your claimed differentiators align with the actual competitive landscape.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-2xl">verified_user</span>
            </div>
            <h3 className="text-xl font-bold">4. AI Co-Verification & Review</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Independent AI models perform a cross-verification review. This layer computes an agreement score, challenges optimistic assumptions, and generates a structured critique highlighting GTM bottlenecks.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
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
