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
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/features" className="text-on-surface-variant hover:text-on-surface transition-colors">Features</Link>
            <Link href="/platform" className="text-secondary border-b-2 border-secondary pb-1">Platform</Link>
            <Link href="/pricing" className="text-on-surface-variant hover:text-on-surface transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-on-surface-variant hover:text-on-surface text-sm font-semibold transition-colors">Dashboard</Link>
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
              Technical Platform
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Developer Overview</h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Understand the underpinnings of our 9-stage deterministic analysis pipeline and API integrations.
          </p>
        </div>

        <div className="space-y-16">
          
          {/* Section 1: Architecture Overview */}
          <div className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-on-surface">1. Architecture Overview</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              VentureLens splits processing into two distinct isolation zones: a **Deterministic Rule Engine** that performs logical consistency calculations and database validation checks, and an **AI Verification layer** that checks claims against external search results.
            </p>
            <div className="bg-surface rounded-xl p-6 border border-outline-variant/20 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
              <div className="flex-1 p-4 bg-white rounded-lg border border-outline-variant/30 text-xs space-y-2">
                <span className="font-mono text-[9px] font-bold text-secondary uppercase block">Input</span>
                <span className="font-bold text-on-surface">Startup Heuristics</span>
                <p className="text-[10px] text-on-surface-variant leading-normal">ICP, pricing strategy, competitors, TAM indicators</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant rotate-90 md:rotate-0 text-xl">arrow_forward</span>
              <div className="flex-1 p-4 bg-white rounded-lg border border-outline-variant/30 text-xs space-y-2">
                <span className="font-mono text-[9px] font-bold text-secondary uppercase block">Validation Zone</span>
                <span className="font-bold text-on-surface">Rule Engine (16 checks)</span>
                <p className="text-[10px] text-on-surface-variant leading-normal">Logic checks run completely independent of AI layers</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant rotate-90 md:rotate-0 text-xl">arrow_forward</span>
              <div className="flex-1 p-4 bg-white rounded-lg border border-outline-variant/30 text-xs space-y-2">
                <span className="font-mono text-[9px] font-bold text-secondary uppercase block">Verification</span>
                <span className="font-bold text-on-surface">AI Review & Search</span>
                <p className="text-[10px] text-on-surface-variant leading-normal">Cross-reference rules against external sources</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant rotate-90 md:rotate-0 text-xl">arrow_forward</span>
              <div className="flex-1 p-4 bg-white rounded-lg border border-outline-variant/30 text-xs space-y-2">
                <span className="font-mono text-[9px] font-bold text-secondary uppercase block">Result</span>
                <span className="font-bold text-on-surface">Unified Report</span>
                <p className="text-[10px] text-on-surface-variant leading-normal">SWOT, agreement indices, and mitigation plans</p>
              </div>
            </div>
          </div>

          {/* Section 2: API Reference */}
          <div className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-on-surface">2. REST API Reference</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Integrate VentureLens directly into directories, investor screening portals, or validation workflows. Generate your access tokens in settings.
            </p>
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase text-on-surface-variant tracking-wider block">Trigger Project Analysis</span>
              <div className="bg-surface-container rounded-lg p-4 font-mono text-[10px] text-on-surface-variant border border-outline-variant/30 overflow-x-auto">
                curl -X POST https://api.venturelens.ai/v1/projects \<br />
                &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_TOKEN" \<br />
                &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                &nbsp;&nbsp;-d '&#123; "name": "StealthCorp", "description": "SaaS for project management" &#125;'
              </div>
              <span className="text-xs font-bold uppercase text-on-surface-variant tracking-wider block mt-4">Fetch Latest Report Data</span>
              <div className="bg-surface-container rounded-lg p-4 font-mono text-[10px] text-on-surface-variant border border-outline-variant/30 overflow-x-auto">
                curl https://api.venturelens.ai/v1/reports/latest \<br />
                &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_TOKEN"
              </div>
            </div>
          </div>

          {/* Section 3: Integrations */}
          <div className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-on-surface">3. Integrations Roadmap</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              We connect to modern dev tools and compliance engines to enrich reports.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: "Supabase", desc: "User Authentication & RLS DB", icon: "database" },
                { name: "Stripe", desc: "Payments & Pricing Tiers", icon: "credit_card" },
                { name: "NVIDIA NIM", desc: "LLM Inference Acceleration", icon: "memory" },
                { name: "Tavily Search", desc: "Real-time Competitor Search", icon: "search" },
                { name: "Google Gemini", desc: "Strategy Formulation Models", icon: "auto_awesome" }
              ].map((int) => (
                <div key={int.name} className="p-4 bg-surface rounded-lg text-center border border-outline-variant/20">
                  <span className="material-symbols-outlined text-secondary text-2xl mb-2 block">{int.icon}</span>
                  <span className="font-bold text-xs text-on-surface block">{int.name}</span>
                  <span className="text-[10px] text-on-surface-variant leading-normal mt-1 block">{int.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Security & Compliance */}
          <div className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-on-surface">4. Security & Compliance</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              We apply enterprise security standards globally to keep your IP protected.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-on-surface-variant">
              <div className="p-4 bg-surface rounded-lg">
                <span className="font-bold text-on-surface block mb-1">Encrypted Pipelines</span>
                <p className="leading-relaxed">All connections use TLS 1.3 encryption. Internal files are encrypted at rest with AES-256 blocks.</p>
              </div>
              <div className="p-4 bg-surface rounded-lg">
                <span className="font-bold text-on-surface block mb-1">RLS Policy Framework</span>
                <p className="leading-relaxed">Using Supabase Row Level Security, project rows are isolated in the database to prevent cross-tenant leaks.</p>
              </div>
              <div className="p-4 bg-surface rounded-lg">
                <span className="font-bold text-on-surface block mb-1">GDPR & CCPA Ready</span>
                <p className="leading-relaxed">Easily exercise your right to clear or delete workspace project configurations directly in the settings tab.</p>
              </div>
            </div>
          </div>

          {/* Section 5: Self-Hosting */}
          <div className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-on-surface">5. Enterprise Self-Hosting</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              For venture accelerators and large corporations, VentureLens provides Docker image distributions that run on AWS ECS or local networks. Keep your evaluation logic 100% in-house. Contact our team to request license parameters.
            </p>
            <div className="flex justify-start">
              <Link
                href="/contact"
                className="bg-primary text-on-primary px-6 py-2.5 rounded-lg text-xs font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm inline-block"
              >
                Inquire About Self-Hosting
              </Link>
            </div>
          </div>

        </div>
      </main>

      <footer className="bg-surface border-t border-outline-variant/30 py-8 text-center text-xs text-on-surface-variant">
        <p>© 2026 VentureLens AI. All rights reserved. <Link href="/" className="underline hover:text-secondary ml-2">Home</Link></p>
      </footer>
    </div>
  );
}
