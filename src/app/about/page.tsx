import Link from "next/link";

export default function AboutPage() {
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
            <Link href="/pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
            <Link href="/about" className="text-blue-600 border-b-2 border-blue-600 pb-1">About Founder</Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 text-sm font-semibold transition-colors">Dashboard</Link>
            <Link href="/wizard" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-sm">
              Launch Diligence
            </Link>
          </div>
        </div>
      </header>

      <main className="py-16">
        {/* Mission Section */}
        <section className="max-w-4xl mx-auto px-6 lg:px-8 text-center mb-20">
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest rounded-full border border-blue-200 mb-6">
            Our Mission & Vision
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Replacing Subjective Guesswork with <span className="text-blue-600">Venture Intelligence</span>.
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed max-w-3xl mx-auto font-normal">
            Early-stage venture validation is frequently clouded by cognitive bias, vanity metrics, and generic AI hallucinations. VentureLens was founded to provide institutional-grade due diligence, deterministic heuristic rules, and transparent mathematical scoring for every founder and venture investor.
          </p>
        </section>

        {/* Founder Profile Spotlight */}
        <section className="max-w-5xl mx-auto px-6 lg:px-8 mb-20">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="w-32 h-32 rounded-2xl bg-blue-600 text-white text-5xl font-black flex items-center justify-center shadow-lg shrink-0">
                DS
              </div>

              <div className="space-y-4 text-center md:text-left flex-1">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">
                    Founder Profile
                  </span>
                  <h2 className="text-3xl font-extrabold text-slate-900">
                    Datha Sai Swaroop
                  </h2>
                  <p className="text-base font-semibold text-slate-700 mt-1">
                    Founder · IIT BHU
                  </p>
                </div>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                  Datha Sai Swaroop leads VentureLens with an engineering foundation from IIT BHU. Passionate about startup ecosystems, decision systems, and algorithmic evaluation, Datha designed VentureLens to bridge the gap between simple chat prompts and institutional VC diligence engines.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-500 block uppercase text-[10px]">Email</span>
                    <a href="mailto:dathasaiswaroopgudimella@gmail.com" className="text-blue-600 font-semibold truncate block mt-0.5 hover:underline">
                      dathasaiswaroopgudimella@gmail.com
                    </a>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-500 block uppercase text-[10px]">Phone</span>
                    <a href="tel:+919121146369" className="text-blue-600 font-semibold block mt-0.5 hover:underline">
                      +91 9121146369
                    </a>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-500 block uppercase text-[10px]">LinkedIn</span>
                    <a href="https://www.linkedin.com/in/datha-sai-swaroop-gudimella-ab4184371" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold block mt-0.5 hover:underline truncate">
                      Datha Sai Swaroop ↗
                    </a>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href="https://www.linkedin.com/in/datha-sai-swaroop-gudimella-ab4184371"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                  >
                    <span>Connect on LinkedIn</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
                  >
                    <span>Send Message</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why VentureLens Section */}
        <section className="max-w-4xl mx-auto px-6 lg:px-8 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Why We Built VentureLens</h2>
            <p className="text-slate-600 text-sm mt-2">The philosophy behind our decision intelligence platform.</p>
          </div>

          <div className="space-y-6 text-slate-700 text-base leading-relaxed">
            <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 text-lg mb-2">1. Eliminating Confirmation Bias</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Founders naturally fall in love with their solutions rather than the problem. VentureLens forces adversarial thesis testing, looking at market sizing, willingness-to-pay friction, and incumbent moats before valuable engineering cycles are expended.
              </p>
            </div>

            <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 text-lg mb-2">2. Transparent Mathematical Scoring</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Generic LLMs produce arbitrary scores. VentureLens calculates weighted equation components across 8 venture pillars, multiplying raw scores by evidence confidence to reflect commercial reality.
              </p>
            </div>

            <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 text-lg mb-2">3. Actionable 14-Day Validation Roadmaps</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Instead of leaving you with high-level advice, VentureLens gives you a prioritized technical MVP roadmap and a targeted 14-day experiment to test willingness-to-pay with real economic buyers.
              </p>
            </div>
          </div>
        </section>
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
