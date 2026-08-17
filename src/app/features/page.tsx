import Link from "next/link";

export const dynamic = "force-static";

export default function FeaturesPage() {
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
            <Link href="/platform" className="hover:text-blue-600 transition-colors">Platform</Link>
            <Link href="/features" className="text-blue-600 border-b-2 border-blue-600 pb-1">Features</Link>
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

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest rounded-full border border-blue-200 mb-6">
            Institutional Capabilities
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-slate-900">
            Core Diligence Architecture
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed font-normal">
            VentureLens replaces subjective vibes with rigorous mathematical validation, deterministic venture rules, and multi-pillar adversarial AI cross-verification.
          </p>
        </div>

        {/* Feature Deep-Dives */}
        <div className="space-y-24">
          
          {/* Feature 1: Deterministic Rule Engine */}
          <section className="flex flex-col lg:flex-row items-center gap-12 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex-1 space-y-5">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block">01 / Heuristic Logic Gates</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">16 Deterministic Venture Capital Rules</h2>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Before generating narrative analysis, our engine evaluates your venture against 16 structural logic gates. It automatically tests whether pricing matches enterprise sales cycles, whether geography-specific adoption barriers exist, and whether target market sizing aligns with unit economics.
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <span className="material-symbols-outlined text-blue-600 text-sm">verified</span>
                  <span>Automated Consistency Verification</span>
                </div>
                <p className="text-slate-600 leading-relaxed font-normal">
                  Identifies structural mismatches such as selling self-serve micro-subscriptions into long-cycle hospital chains or enterprise procurement boards.
                </p>
              </div>
            </div>
            <div className="flex-1 w-full max-w-md space-y-3">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
                  <span className="text-xs font-bold text-emerald-900">Customer Urgency & Pain Gate</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded">Passed</span>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-amber-600 text-lg">warning</span>
                  <span className="text-xs font-bold text-amber-900">Sales Cycle vs Pricing Model Gate</span>
                </div>
                <span className="text-[10px] font-bold text-amber-700 uppercase bg-amber-100 px-2 py-0.5 rounded">Warning</span>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-blue-600 text-lg">fact_check</span>
                  <span className="text-xs font-bold text-blue-900">Competitive Moat Defensibility</span>
                </div>
                <span className="text-[10px] font-bold text-blue-700 uppercase bg-blue-100 px-2 py-0.5 rounded">Verified</span>
              </div>
            </div>
          </section>

          {/* Feature 2: Evidence-Grounded Scoring */}
          <section className="flex flex-col lg:flex-row-reverse items-center gap-12 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex-1 space-y-5">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block">02 / Mathematical Transparency</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Evidence-Grounded Scoring Equation</h2>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                No black-box guesses. VentureLens calculates your venture readiness through a transparent formula across 8 core dimensions: Problem (20%), Customer (15%), Market (15%), Business Model (15%), Competition (10%), Team Domain Fit (10%), Traction (10%), and Risk (5%).
              </p>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Each dimension multiplies your raw score by empirical evidence confidence, ensuring unverified claims do not inflate evaluation metrics.
              </p>
            </div>
            <div className="flex-1 w-full max-w-md bg-slate-900 text-white rounded-2xl p-6 shadow-lg space-y-4">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">Transparent Formula Matrix</span>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-300">Problem Severity (20%)</span>
                  <span className="font-bold text-emerald-400">85 / 100</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-300">Target Customer ICP (15%)</span>
                  <span className="font-bold text-emerald-400">80 / 100</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-300">Business Model & Margin (15%)</span>
                  <span className="font-bold text-blue-400">75 / 100</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-300">Team-Domain Fit (10%)</span>
                  <span className="font-bold text-amber-400">60 / 100</span>
                </div>
                <div className="flex justify-between pt-1 font-bold text-sm">
                  <span className="text-white">Adjusted Venture Score</span>
                  <span className="text-blue-400">74.2 / 100</span>
                </div>
              </div>
            </div>
          </section>

          {/* Feature 3: 5-Pillar Cross-Check */}
          <section className="flex flex-col lg:flex-row items-center gap-12 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex-1 space-y-5">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block">03 / Adversarial Diligence</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">5-Pillar AI Cross-Verification Breakdown</h2>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Instead of giving you a single agreement percentage, VentureLens independently evaluates founder claims against market reality across 5 pillars: Problem reality, Customer accessibility, Market headroom, Business model unit economics, and Execution feasibility.
              </p>
            </div>
            <div className="flex-1 w-full max-w-md grid grid-cols-2 gap-3 text-center">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Problem Reality</span>
                <span className="text-2xl font-black text-emerald-600">91%</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Customer Access</span>
                <span className="text-2xl font-black text-emerald-600">83%</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Market TAM</span>
                <span className="text-2xl font-black text-blue-600">61%</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Business Model</span>
                <span className="text-2xl font-black text-amber-600">58%</span>
              </div>
              <div className="col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Execution Feasibility</span>
                <span className="text-2xl font-black text-rose-600">44%</span>
              </div>
            </div>
          </section>
        </div>

        {/* Call to Action */}
        <div className="mt-24 p-12 bg-blue-600 text-white rounded-3xl text-center shadow-xl space-y-6">
          <h2 className="text-3xl font-bold">Start Your Venture Evaluation</h2>
          <p className="text-blue-100 text-sm max-w-xl mx-auto font-normal">
            Upload your pitch deck or answer our structured questionnaire to receive your complete due diligence report in seconds.
          </p>
          <div className="pt-2">
            <Link
              href="/wizard"
              className="inline-block bg-white text-blue-600 font-bold px-8 py-3.5 rounded-xl text-sm hover:bg-blue-50 transition-all shadow-md active:scale-95"
            >
              Launch Free Diligence Now
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs text-center mt-24">
        <div className="max-w-[1440px] mx-auto px-6 space-y-2">
          <p>© 2026 VentureLens AI. Founded by Datha Sai Swaroop (IIT BHU). All rights reserved.</p>
          <p className="text-slate-500">Contact: dathasaiswaroopgudimella@gmail.com · +91 9121146369</p>
        </div>
      </footer>
    </div>
  );
}
