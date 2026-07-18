import Link from "next/link";

export const dynamic = "force-static";

export default function TermsPage() {
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
        <h1 className="text-3xl md:text-5xl font-extrabold mb-8 tracking-tight">Terms of Service</h1>
        <p className="text-on-surface-variant text-sm mb-8 font-mono">Last Updated: July 18, 2026</p>

        <div className="space-y-8 text-on-surface-variant leading-relaxed text-sm">
          <section className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-on-surface">1. Acceptance of Terms</h2>
            <p>
              By accessing and using VentureLens AI ("Service"), you agree to be bound by these Terms of Service. If you do not agree to all terms, you may not access or use the Service.
            </p>
          </section>

          <section className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-on-surface">2. Description of Service</h2>
            <p>
              VentureLens AI provides venture assessment, deterministic rules validation, and AI cross-verification modeling. All scores and suggestions are generated for decision-support purposes only and do not constitute formal legal, financial, or professional investment advice.
            </p>
          </section>

          <section className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-on-surface">3. Intellectual Property Rights</h2>
            <p>
              You retain all intellectual property rights to your startup descriptions, ideas, and validation answers. VentureLens AI does not claim ownership of any content submitted by you.
            </p>
          </section>

          <section className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-on-surface">4. Disclaimer of Warranties</h2>
            <p>
              The Service is provided "as is" and "as available". We do not guarantee that the analysis outputs will predict actual market success, investor interest, or regulatory outcomes. Users are solely responsible for executing their own real-world customer and technical verification steps.
            </p>
          </section>
        </div>
      </main>

      <footer className="bg-surface border-t border-outline-variant/30 py-8 text-center text-xs text-on-surface-variant">
        <p>© 2026 VentureLens AI. All rights reserved. <Link href="/" className="underline hover:text-secondary ml-2">Home</Link></p>
      </footer>
    </div>
  );
}
