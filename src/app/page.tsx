"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

export default function LandingPage() {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success("Message sent to Datha Sai Swaroop!", {
          description: "Thank you for reaching out. We will get back to you shortly.",
        });
        setFormData({ name: "", email: "", message: "" });
        setContactModalOpen(false);
      } else {
        toast.error("Failed to send message. Please email dathasaiswaroopgudimella@gmail.com directly.");
      }
    } catch {
      toast.error("Network error. Please email dathasaiswaroopgudimella@gmail.com directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="flex justify-between items-center px-6 lg:px-12 h-20 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-3">
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
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link href="/platform" className="hover:text-blue-600 transition-colors">
              Platform
            </Link>
            <Link href="/features" className="hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="hover:text-blue-600 transition-colors">
              Pricing
            </Link>
            <Link href="/about" className="hover:text-blue-600 transition-colors">
              About Founder
            </Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setContactModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <span className="material-symbols-outlined text-base">mail</span>
              Contact Founder
            </button>
            <Link
              href="/wizard"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-sm active:scale-95"
            >
              Launch Diligence
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-28 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-[#f8fafc]">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-blue-800 font-bold uppercase tracking-wider">
                Venture Intelligence Startup Platform
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 max-w-5xl mx-auto tracking-tight leading-[1.1] mb-8">
              Institutional Due Diligence for <span className="text-blue-600">Serious Startups</span> & Investors.
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
              Move beyond generic chatbot guesses. VentureLens stress-tests your venture thesis with transparent mathematical scoring equations, 16 deterministic venture capital logic rules, and 5-pillar adversarial cross-verification in under 20 seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                href="/wizard"
                className="w-full sm:w-auto bg-blue-600 text-white px-9 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-3"
              >
                <span>Launch Free Diligence</span>
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </Link>
              <button
                onClick={() => setContactModalOpen(true)}
                className="w-full sm:w-auto bg-white border border-slate-300 text-slate-800 px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-blue-600 text-xl">person</span>
                <span>Connect with Founder</span>
              </button>
            </div>

            {/* Key Platform Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <span className="text-2xl font-extrabold text-blue-600 block">16 Rules</span>
                <span className="text-xs text-slate-600 font-medium">Deterministic VC Logic Gates</span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <span className="text-2xl font-extrabold text-blue-600 block">8 Dimensions</span>
                <span className="text-xs text-slate-600 font-medium">Weighted Evidence Scoring Math</span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <span className="text-2xl font-extrabold text-blue-600 block">5 Pillars</span>
                <span className="text-xs text-slate-600 font-medium">Independent AI Cross-Check</span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <span className="text-2xl font-extrabold text-emerald-600 block">14 Days</span>
                <span className="text-xs text-slate-600 font-medium">Concrete Validation Experiment</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3-Layer Venture Intelligence Pipeline Section */}
        <section className="py-24 bg-white border-y border-slate-200">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">
                Engineered Diligence Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                How VentureLens Evaluates Startups
              </h2>
              <p className="text-slate-600 text-base mt-4 leading-relaxed">
                We combine deterministic mathematical validation with deep artificial intelligence to challenge assumptions, eliminate founder blind spots, and produce institutional-grade intelligence.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="p-8 bg-[#f8fafc] rounded-2xl border border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-bold text-lg mb-6">
                    01
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    Multi-Format Ingestion & Fact Extraction
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    Upload your pitch deck in PDF, PowerPoint (.pptx), or Word (.docx) format or complete our structured 13-question questionnaire. The platform extracts your ideal customer profile, problem urgency, pricing model, and competitive advantages without label noise.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 text-xs font-semibold text-blue-600 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>Instant Pitch Deck Parsing</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-8 bg-blue-600 text-white rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/20 text-white rounded-xl flex items-center justify-center font-bold text-lg mb-6">
                    02
                  </div>
                  <h3 className="text-xl font-bold mb-3">
                    Deterministic VC Rules & Scoring Equation
                  </h3>
                  <p className="text-sm text-blue-100 leading-relaxed mb-6">
                    Your venture is processed through 16 deterministic venture capital heuristic rules and scored via a transparent 8-dimension weighted formula: Problem (20%), Customer (15%), Market (15%), Business Model (15%), Competition (10%), Team Fit (10%), Traction (10%), and Risk (5%).
                  </p>
                </div>
                <div className="pt-4 border-t border-blue-400/50 text-xs font-semibold text-white flex items-center gap-1.5 relative z-10">
                  <span className="material-symbols-outlined text-base">verified</span>
                  <span>100% Transparent Mathematical Formula</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-8 bg-[#f8fafc] rounded-2xl border border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold text-lg mb-6">
                    03
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    Adversarial AI Cross-Check & Strategic Roadmap
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    An independent AI reasoning model conducts adversarial stress-testing, generating a 5-pillar agreement breakdown, verified claim integrity ratio, 3-phase technical MVP scope, high-converting copy drafts, and a definitive CONTINUE, PIVOT, or STOP decision verdict.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">assessment</span>
                  <span>Institutional Diligence Report</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Powerful Features Grid */}
        <section className="py-24 bg-[#f8fafc]">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">
                Enterprise Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Built for High-Stakes Venture Decisions
              </h2>
              <p className="text-slate-600 text-base mt-4 leading-relaxed">
                Everything founders, venture studios, angel investors, and accelerators need to evaluate startup viability with complete confidence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-2xl">functions</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Transparent Scoring Equation
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Every score is calculated mathematically by multiplying raw scores by evidence confidence across 8 key dimensions. No hidden magic numbers.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-2xl">balance</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  5-Pillar Dimension Cross-Check
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Independent assessment scores Problem, Customer, Market, Business Model, and Execution Fit separately so you see exactly where risks lie.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-2xl">fact_check</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Claim Verification & Integrity
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Distinguishes verifiable market evidence from unverified founder assertions and measures formal Explanation Integrity.
                </p>
              </div>

              {/* Card 4 */}
              <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-2xl">science</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  14-Day Validation Experiments
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Generates an actionable, cost-effective validation experiment with specific milestone gates before you spend capital building.
                </p>
              </div>

              {/* Card 5 */}
              <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-2xl">menu_book</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  VC Framework Knowledge Base
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Matches your startup to battle-tested frameworks from Y Combinator, Sequoia Capital, and Reforge specific to your domain.
                </p>
              </div>

              {/* Card 6 */}
              <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-2xl">description</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Multi-Format Pitch Deck Ingestion
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Upload PDF, PowerPoint (.pptx), or Word (.docx) pitch decks directly. The multi-layer parser extracts text instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Founder & Leadership Section */}
        <section id="founder" className="py-24 bg-white border-t border-slate-200">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-4xl sm:text-5xl font-black shadow-lg shrink-0 border-2 border-white/20">
                  DS
                </div>

                <div className="space-y-4 text-center md:text-left flex-1">
                  <div>
                    <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-400/30 mb-2">
                      Startup Leadership
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                      Datha Sai Swaroop
                    </h2>
                    <p className="text-base font-semibold text-blue-400 mt-1">
                      Founder · IIT BHU
                    </p>
                  </div>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                    Building VentureLens to eliminate guesswork in early-stage startup validation. Leveraging engineering rigor from IIT BHU and cutting-edge artificial intelligence, VentureLens delivers institutional-grade due diligence, deterministic scoring equations, and actionable validation roadmaps for founders and investors worldwide.
                  </p>

                  {/* Founder Direct Contact Buttons */}
                  <div className="pt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <a
                      href="https://www.linkedin.com/in/datha-sai-swaroop-gudimella-ab4184371"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                    >
                      <span className="material-symbols-outlined text-base">link</span>
                      <span>LinkedIn Profile</span>
                    </a>

                    <a
                      href="mailto:dathasaiswaroopgudimella@gmail.com"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">mail</span>
                      <span>dathasaiswaroopgudimella@gmail.com</span>
                    </a>

                    <a
                      href="tel:+919121146369"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">call</span>
                      <span>+91 9121146369</span>
                    </a>

                    <button
                      onClick={() => setContactModalOpen(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                    >
                      <span className="material-symbols-outlined text-base">chat</span>
                      <span>Send Direct Message</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final Call to Action */}
        <section className="py-24 bg-blue-600 text-white text-center">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6">
              Ready to Stress-Test Your Startup Idea?
            </h2>
            <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
              Run your pitch deck or idea through our institutional venture intelligence engine. Completely free to start with comprehensive reports generated in under 20 seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/wizard"
                className="w-full sm:w-auto bg-white text-blue-600 px-9 py-4 rounded-xl text-base font-bold hover:bg-blue-50 transition-all shadow-lg active:scale-95"
              >
                Start Free Venture Diligence
              </Link>
              <button
                onClick={() => setContactModalOpen(true)}
                className="w-full sm:w-auto bg-blue-700 text-white border border-blue-400/40 px-8 py-4 rounded-xl text-base font-bold hover:bg-blue-800 transition-all"
              >
                Contact Founder Directly
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-800">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                VL
              </div>
              <span className="font-extrabold text-lg text-white">VentureLens AI</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Institutional decision intelligence and evidence-grounded startup evaluation platform. Founded by Datha Sai Swaroop (IIT BHU).
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p>Email: <a href="mailto:dathasaiswaroopgudimella@gmail.com" className="text-blue-400 hover:underline">dathasaiswaroopgudimella@gmail.com</a></p>
              <p>Phone: <a href="tel:+919121146369" className="text-blue-400 hover:underline">+91 9121146369</a></p>
              <p>LinkedIn: <a href="https://www.linkedin.com/in/datha-sai-swaroop-gudimella-ab4184371" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Datha Sai Swaroop</a></p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Product</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/platform" className="hover:text-white transition-colors">Platform</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/templates" className="hover:text-white transition-colors">Templates</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Company</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link href="/about" className="hover:text-white transition-colors">About Founder</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><button onClick={() => toast.info("Research papers coming soon.")} className="hover:text-white transition-colors text-left">Methodology</button></li>
              <li><button onClick={() => toast.info("Accelerator partnerships coming soon.")} className="hover:text-white transition-colors text-left">Partnerships</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Legal</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><a href="https://github.com/dathasaiswaroopgudimella-png/Venturelens" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub Repository</a></li>
              <li><button onClick={() => toast.info("Enterprise SLA available on request.")} className="hover:text-white transition-colors text-left">Enterprise SLA</button></li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© 2026 VentureLens AI. Founded by Datha Sai Swaroop (IIT BHU). All rights reserved.</p>
          <p className="font-medium">Enterprise Venture Intelligence</p>
        </div>
      </footer>

      {/* Interactive Contact Founder Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 relative">
            <button
              onClick={() => setContactModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  DS
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Connect with Founder</h3>
                  <p className="text-xs text-blue-600 font-semibold">Datha Sai Swaroop · IIT BHU</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Send a direct inquiry regarding partnership, pilot deployment, accelerator integration, or investment.
              </p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Your Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Message / Inquiry
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details about your startup, partnership proposal, or question..."
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-600 resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? "Sending Message..." : "Send Message to Datha Sai Swaroop"}
                </button>

                <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                  <span>Direct: +91 9121146369</span>
                  <a
                    href="https://www.linkedin.com/in/datha-sai-swaroop-gudimella-ab4184371"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    View LinkedIn Profile ↗
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
