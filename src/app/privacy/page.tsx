import Link from "next/link";

export const dynamic = "force-static";

export default function PrivacyPage() {
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
        <h1 className="text-3xl md:text-5xl font-extrabold mb-8 tracking-tight">Privacy Policy</h1>
        <p className="text-on-surface-variant text-sm mb-8 font-mono">Last Updated: July 18, 2026</p>

        <div className="space-y-8 text-on-surface-variant leading-relaxed text-sm">
          <section className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-on-surface">1. Introduction</h2>
            <p>
              VentureLens AI ("we", "our", or "us") provides a deterministic venture co-pilot platform to help founders analyze startup concepts. We respect your privacy and are committed to protecting the information you process or submit through our services.
            </p>
          </section>

          <section className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-on-surface">2. Data We Collect</h2>
            <p>
              <strong>Startup Profiles & Questionnaire Inputs:</strong> When you run a startup validation analysis, we process details including your startup idea, target customers, problem descriptions, competitors, and revenue models.
            </p>
            <p>
              <strong>Analytical Metadata:</strong> We collect anonymous runtime telemetry to optimize processing latency across the 9-stage analysis pipeline and rule engines.
            </p>
          </section>

          <section className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-on-surface">3. Data Sharing & Security</h2>
            <p>
              We process inputs using secure APIs from our AI co-verification partners (e.g., NVIDIA NIM, Google Gemini) and search index APIs (Tavily). We enforce TLS encryption in transit and rest encryption on database persistence layers.
            </p>
            <p>
              Because you own your business ideas, we do not sell or lease your questionnaire inputs or venture scores to any third-party venture capital funds, accelerators, or competitors.
            </p>
          </section>

          <section className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-on-surface">4. Your Rights</h2>
            <p>
              You have the right to request deletion of any saved reports or project history. If you are using our guest mode, you can wipe your reports at any time by clearing your browser's local storage database.
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
