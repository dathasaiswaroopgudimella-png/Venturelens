import Link from "next/link";

export default function AboutPage() {
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
            <Link href="/platform" className="text-on-surface-variant hover:text-on-surface transition-colors">Platform</Link>
            <Link href="/features" className="text-on-surface-variant hover:text-on-surface transition-colors">Features</Link>
            <Link href="/pricing" className="text-on-surface-variant hover:text-on-surface transition-colors">Pricing</Link>
            <Link href="/templates" className="text-on-surface-variant hover:text-on-surface transition-colors">Templates</Link>
            <Link href="/about" className="text-secondary border-b-2 border-secondary pb-1">About</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-secondary hover:opacity-80 transition-opacity text-sm font-semibold">Dashboard</Link>
            <Link href="/wizard" className="bg-primary text-on-primary px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all active:scale-95 shadow-sm">
              Start Free Diligence
            </Link>
          </div>
        </div>
      </header>

      <main className="py-20 max-w-5xl mx-auto px-8">
        {/* Mission Section */}
        <section className="text-center mb-20 max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-mono font-bold uppercase tracking-widest rounded-full mb-6">
            Our Mission
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-on-surface mb-6 leading-tight">
            Replacing Subjective Guesswork with <span className="text-secondary">Venture Intelligence</span>.
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed font-normal">
            Early-stage startup evaluation is frequently clouded by hype and generic AI advice. VentureLens applies structured rules, real market data, and cross-verified AI to give founders access to the same rigorous analysis top-tier VCs apply internally.
          </p>
        </section>

        {/* Founder Spotlight */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl border border-outline-variant/30 p-8 md:p-12 micro-shadow">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-xl bg-secondary text-white text-4xl md:text-5xl font-black flex items-center justify-center shadow-lg shrink-0 border border-white/20">
                DS
              </div>

              <div className="space-y-4 text-center md:text-left flex-1">
                <div>
                  <span className="font-mono text-xs text-secondary uppercase tracking-widest block mb-1 font-semibold">
                    Founder
                  </span>
                  <h2 className="text-3xl font-extrabold text-on-surface">
                    Datha Sai Swaroop
                  </h2>
                  <p className="text-sm font-semibold text-emerald-accent mt-0.5">
                    Founder · IIT BHU
                  </p>
                </div>

                <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed font-normal">
                  Datha Sai Swaroop leads VentureLens with an engineering foundation from IIT BHU. Passionate about startup ecosystems, decision systems, and algorithmic evaluation, Datha designed VentureLens to bridge the gap between simple chat prompts and institutional VC diligence engines.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-outline-variant/20 text-xs">
                  <div className="p-3 bg-surface rounded-lg border border-outline-variant/30">
                    <span className="font-bold text-on-surface-variant block uppercase text-[10px]">Email</span>
                    <a href="mailto:dathasaiswaroopgudimella@gmail.com" className="text-secondary font-semibold truncate block mt-0.5 hover:underline">
                      dathasaiswaroopgudimella@gmail.com
                    </a>
                  </div>
                  <div className="p-3 bg-surface rounded-lg border border-outline-variant/30">
                    <span className="font-bold text-on-surface-variant block uppercase text-[10px]">Phone</span>
                    <a href="tel:+919121146369" className="text-secondary font-semibold block mt-0.5 hover:underline">
                      +91 9121146369
                    </a>
                  </div>
                  <div className="p-3 bg-surface rounded-lg border border-outline-variant/30">
                    <span className="font-bold text-on-surface-variant block uppercase text-[10px]">LinkedIn</span>
                    <a href="https://www.linkedin.com/in/datha-sai-swaroop-gudimella-ab4184371" target="_blank" rel="noopener noreferrer" className="text-secondary font-semibold block mt-0.5 hover:underline truncate">
                      LinkedIn Profile ↗
                    </a>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href="https://www.linkedin.com/in/datha-sai-swaroop-gudimella-ab4184371"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-secondary hover:opacity-90 text-white text-xs font-bold rounded-lg transition-all shadow-sm"
                  >
                    <span>Connect on LinkedIn</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold rounded-lg transition-colors border border-outline-variant/40"
                  >
                    <span>Contact Us</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why We Built VentureLens */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-on-surface mb-6">Why We Built VentureLens</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-xl border border-outline-variant/30 micro-shadow">
              <h3 className="font-bold text-base mb-2">1. Eliminating Bias</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Founders often fall in love with solutions. VentureLens forces adversarial thesis testing against market reality.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-outline-variant/30 micro-shadow">
              <h3 className="font-bold text-base mb-2">2. Transparent Math</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Scores are calculated via transparent mathematical equations across 8 dimensions multiplied by evidence confidence.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-outline-variant/30 micro-shadow">
              <h3 className="font-bold text-base mb-2">3. Actionable Roadmaps</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Provides a concrete 14-day validation experiment to test willingness-to-pay before spending engineering capital.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-outline-variant/30 py-8 text-center text-xs text-on-surface-variant">
        <p>© 2026 VentureLens AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
