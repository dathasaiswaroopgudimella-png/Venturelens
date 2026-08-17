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
        toast.success("Message sent successfully!", {
          description: "Thank you for reaching out. We will get back to you shortly.",
        });
        setFormData({ name: "", email: "", message: "" });
        setContactModalOpen(false);
      } else {
        toast.error("Failed to send message. Please email directly.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface min-h-screen text-on-surface font-sans selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Top Navigation Bar */}
      <header className="docked full-width top-0 sticky z-50 glass-header border-b border-outline-variant/30 shadow-sm">
        <div className="flex justify-between items-center px-8 h-16 w-full max-w-[1440px] mx-auto">
          <Link href="/" className="font-headline-md text-xl font-bold tracking-tight text-on-surface flex items-center gap-2">
            <span>VentureLens</span>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-secondary/10 text-secondary border border-secondary/20">
              Venture Intelligence
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link className="text-on-surface-variant hover:text-on-surface transition-colors" href="/platform">
              Platform
            </Link>
            <Link className="text-on-surface-variant hover:text-on-surface transition-colors" href="/features">
              Features
            </Link>
            <Link className="text-on-surface-variant hover:text-on-surface transition-colors" href="/pricing">
              Pricing
            </Link>
            <Link className="text-on-surface-variant hover:text-on-surface transition-colors" href="/templates">
              Templates
            </Link>
            <Link className="text-on-surface-variant hover:text-on-surface transition-colors" href="/about">
              About
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setContactModalOpen(true)}
              className="text-on-surface-variant hover:text-on-surface text-sm font-semibold transition-colors"
            >
              Contact
            </button>
            <Link href="/dashboard" className="text-secondary hover:opacity-80 transition-opacity text-sm font-semibold">
              Dashboard
            </Link>
            <Link
              href="/wizard"
              className="bg-primary text-on-primary px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all active:scale-95 shadow-sm"
            >
              Start Free Diligence
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden bg-surface">
          <div className="relative z-10 max-w-[1440px] mx-auto px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-accent/10 border border-emerald-accent/20 rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-accent animate-pulse"></span>
              <span className="text-xs text-emerald-accent font-semibold tracking-wide">
                Venture Intelligence Platform
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 max-w-5xl mx-auto tracking-tight leading-tight">
              Institutional Due Diligence for <span className="text-secondary">Serious Startups</span>.
            </h1>

            <p className="text-lg md:text-xl text-on-surface-variant max-w-3xl mx-auto mb-10 font-normal leading-relaxed">
              Move beyond generic chatbot guesses. VentureLens stress-tests your venture thesis with transparent mathematical scoring equations, 16 deterministic venture capital rules, and 5-pillar adversarial cross-verification in under 20 seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/wizard"
                className="bg-primary text-on-primary px-8 py-4 rounded-lg text-lg font-bold hover:opacity-90 transition-all macro-shadow active:scale-95 flex items-center gap-2"
              >
                <span>Launch Free Analysis</span>
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </Link>
              <button
                onClick={() => {
                  const el = document.getElementById("methodology-engine");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-white border border-outline-variant/50 text-primary px-8 py-4 rounded-lg text-lg font-bold hover:bg-surface-container-low transition-all"
              >
                Learn How It Works
              </button>
            </div>

            {/* Architecture Metrics Row */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
              <div className="p-5 bg-white rounded-xl border border-outline-variant/30 micro-shadow">
                <div className="text-3xl font-extrabold text-secondary mb-2">16</div>
                <div className="text-sm font-bold text-on-surface mb-0.5">Logic Rules</div>
                <div className="text-xs text-on-surface-variant leading-snug">Deterministic VC validation gates</div>
              </div>
              <div className="p-5 bg-white rounded-xl border border-outline-variant/30 micro-shadow">
                <div className="text-3xl font-extrabold text-emerald-accent mb-2">8</div>
                <div className="text-sm font-bold text-on-surface mb-0.5">Scoring Dimensions</div>
                <div className="text-xs text-on-surface-variant leading-snug">Evidence-grounded math, not guesses</div>
              </div>
              <div className="p-5 bg-white rounded-xl border border-outline-variant/30 micro-shadow">
                <div className="text-3xl font-extrabold text-secondary mb-2">5</div>
                <div className="text-sm font-bold text-on-surface mb-0.5">AI Pillars</div>
                <div className="text-xs text-on-surface-variant leading-snug">Independent adversarial cross-check</div>
              </div>
              <div className="p-5 bg-white rounded-xl border border-outline-variant/30 micro-shadow">
                <div className="text-3xl font-extrabold text-emerald-accent mb-2">14</div>
                <div className="text-sm font-bold text-on-surface mb-0.5">Day Roadmap</div>
                <div className="text-xs text-on-surface-variant leading-snug">Concrete validation experiments</div>
              </div>
            </div>
          </div>
        </section>

        {/* The 3-Stage Deterministic Engine */}
        <section id="methodology-engine" className="py-24 bg-white border-y border-outline-variant/20">
          <div className="max-w-[1440px] mx-auto px-8">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <span className="font-mono text-xs text-secondary uppercase tracking-[0.2em] mb-2 block font-semibold">
                Diligence Architecture
              </span>
              <h2 className="text-3xl font-bold mb-4 tracking-tight">The 3-Layer Validation Pipeline</h2>
              <p className="text-on-surface-variant">
                VentureLens combines deterministic logic validation with deep artificial intelligence to challenge assumptions and eliminate founder blind spots.
              </p>
            </div>

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 py-12">
              {/* Stage 1 */}
              <div className="w-full md:w-1/3 group cursor-default">
                <div className="p-8 bg-surface rounded-xl border border-outline-variant/30 micro-shadow group-hover:macro-shadow transition-all duration-300 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-6">
                      <span className="material-symbols-outlined text-secondary text-2xl">description</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">1. Pitch Deck & Fact Extraction</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                      Upload your deck in PDF, PowerPoint (.pptx), or Word (.docx) format or enter structured inputs. The engine parses ideal customer profile, problem urgency, pricing model, and competitive advantages.
                    </p>
                  </div>
                  <div className="font-mono text-xs text-secondary font-semibold flex items-center gap-2 pt-4 border-t border-outline-variant/20">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    MULTI-FORMAT INGESTION
                  </div>
                </div>
              </div>

              {/* Arrow 1 */}
              <div className="hidden md:block flex-1 h-px bg-outline-variant/40 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant/40 animate-pulse">chevron_right</span>
                </div>
              </div>

              {/* Stage 2 */}
              <div className="w-full md:w-1/3 z-10">
                <div className="p-8 bg-primary text-white rounded-xl border border-outline-variant/10 macro-shadow scale-105">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-accent/20 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-emerald-accent text-xl">analytics</span>
                      </div>
                      <span className="text-lg font-bold">2. Scoring Equation</span>
                    </div>
                    <span className="font-mono text-xs text-emerald-accent bg-emerald-accent/10 px-2 py-1 rounded">
                      DETERMINISTIC
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                    Evaluates 16 VC logic checks and computes weighted scoring across 8 dimensions: Problem, Customer, Market, Business Model, Moat, Team Fit, Traction, and Risk.
                  </p>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span>PROBLEM URGENCY</span>
                        <span className="text-emerald-accent">91%</span>
                      </div>
                      <div className="confidence-track">
                        <div className="bg-emerald-accent h-full w-[91%]"></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span>EVIDENCE CONFIDENCE</span>
                        <span className="text-secondary">74%</span>
                      </div>
                      <div className="confidence-track">
                        <div className="bg-secondary h-full w-[74%]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow 2 */}
              <div className="hidden md:block flex-1 h-px bg-outline-variant/40 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant/40 animate-pulse">chevron_right</span>
                </div>
              </div>

              {/* Stage 3 */}
              <div className="w-full md:w-1/3 group cursor-default">
                <div className="p-8 bg-surface rounded-xl border border-outline-variant/30 micro-shadow group-hover:macro-shadow transition-all duration-300 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 bg-emerald-accent/10 rounded-lg flex items-center justify-center mb-6">
                      <span className="material-symbols-outlined text-emerald-accent text-2xl">verified</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">3. AI Cross-Verification</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                      An independent AI partner challenges claims across 5 pillars, calculates Explanation Integrity, builds a 3-phase technical MVP scope, and gives a CONTINUE, PIVOT, or STOP decision.
                    </p>
                  </div>
                  <div className="font-mono text-xs text-emerald-accent font-semibold flex items-center gap-1.5 pt-4 border-t border-outline-variant/20">
                    <span className="material-symbols-outlined text-sm">assignment_turned_in</span>
                    100% AUDIT-READY REPORT
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section className="py-24 bg-surface">
          <div className="max-w-[1440px] mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Feature 1 */}
              <div className="md:col-span-8 bg-white p-12 rounded-2xl border border-outline-variant/30 micro-shadow relative overflow-hidden">
                <div className="max-w-xl relative z-10">
                  <span className="font-mono text-xs text-secondary uppercase tracking-[0.2em] mb-4 block font-semibold">
                    Core Capability
                  </span>
                  <h3 className="text-3xl font-bold mb-6">Evidence-Grounded Mathematical Scoring</h3>
                  <p className="text-on-surface-variant mb-8 leading-relaxed">
                    VentureLens does not generate arbitrary numbers. We calculate your venture score through a transparent mathematical formula multiplying raw dimension ratings by verified evidence confidence.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant/20 flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-accent text-lg">check</span>
                      <span className="text-xs font-semibold">8 Weighted Dimensions</span>
                    </div>
                    <div className="bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant/20 flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-accent text-lg">check</span>
                      <span className="text-xs font-semibold">Evidence Confidence Matrix</span>
                    </div>
                    <div className="bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant/20 flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-accent text-lg">check</span>
                      <span className="text-xs font-semibold">Zero Magic Numbers</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="md:col-span-4 bg-primary text-on-primary p-12 rounded-2xl macro-shadow relative overflow-hidden">
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-8">
                    <span className="material-symbols-outlined text-white text-2xl">gavel</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">16 Deterministic VC Logic Rules</h3>
                  <p className="text-sm text-slate-300 mb-8 leading-relaxed">
                    Heuristic rule checks test consistency between your pricing, target customer, distribution, and market sizing before writing a single line of code.
                  </p>
                  <ul className="space-y-3 font-mono text-xs">
                    <li className="flex gap-2.5 text-slate-300">
                      <span className="text-emerald-accent">[01]</span> Price & Customer Alignment
                    </li>
                    <li className="flex gap-2.5 text-slate-300">
                      <span className="text-emerald-accent">[02]</span> Revenue & Sales Cycle Fit
                    </li>
                    <li className="flex gap-2.5 text-slate-300">
                      <span className="text-emerald-accent">[03]</span> Moat Defensibility Validation
                    </li>
                  </ul>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="md:col-span-4 bg-white p-10 rounded-2xl border border-outline-variant/30 micro-shadow hover:border-emerald-accent/50 transition-colors">
                <div className="w-12 h-12 bg-emerald-accent/10 rounded-lg flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-emerald-accent text-2xl">science</span>
                </div>
                <h3 className="text-xl font-bold mb-3">14-Day Validation Experiments</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Get a concrete, low-cost experiment to test buyer willingness-to-pay and customer acquisition thresholds before expending capital.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="md:col-span-8 bg-white p-10 rounded-2xl border border-outline-variant/30 micro-shadow hover:border-secondary/50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-secondary text-2xl">rate_review</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">5-Pillar Adversarial AI Cross-Check</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    An independent AI reasoning model challenges your business claims across Problem reality, Customer accessibility, Market sizing, Business model margins, and Execution feasibility.
                  </p>
                </div>
                <div className="mt-6 border-t border-outline-variant/20 pt-4 flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant font-medium">Strategic Review Engine: OpenRouter AI</span>
                  <span className="text-emerald-accent font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-accent"></span>
                    Active & Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dedicated Founder & Leadership Section */}
        <section id="founder" className="py-24 bg-white border-t border-outline-variant/20">
          <div className="max-w-[1440px] mx-auto px-8">
            <div className="max-w-4xl mx-auto bg-primary text-white rounded-2xl p-8 md:p-14 macro-shadow relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-xl bg-secondary text-white text-4xl md:text-5xl font-black flex items-center justify-center shadow-lg shrink-0 border border-white/20">
                  DS
                </div>

                <div className="space-y-4 text-center md:text-left flex-1">
                  <div>
                    <span className="inline-block px-3 py-1 bg-white/10 text-secondary-container text-xs font-mono font-bold uppercase tracking-wider rounded mb-2">
                      Founder Spotlight
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                      Datha Sai Swaroop
                    </h2>
                    <p className="text-sm font-semibold text-emerald-accent mt-0.5">
                      Founder · IIT BHU
                    </p>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed font-normal">
                    Building VentureLens to eliminate cognitive bias and subjective guesswork in early-stage venture validation. Combining engineering rigor from IIT BHU with transparent mathematical scoring equations and multi-stage artificial intelligence, VentureLens gives founders and investors institutional-grade due diligence in seconds.
                  </p>

                  {/* Founder Direct Reach-Out Buttons */}
                  <div className="pt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <a
                      href="https://www.linkedin.com/in/datha-sai-swaroop-gudimella-ab4184371"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary hover:opacity-90 text-white text-xs font-bold rounded-lg transition-all shadow-sm"
                    >
                      <span className="material-symbols-outlined text-base">link</span>
                      <span>LinkedIn Profile</span>
                    </a>

                    <a
                      href="mailto:dathasaiswaroopgudimella@gmail.com"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg border border-white/20 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">mail</span>
                      <span>dathasaiswaroopgudimella@gmail.com</span>
                    </a>

                    <a
                      href="tel:+919121146369"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg border border-white/20 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">call</span>
                      <span>+91 9121146369</span>
                    </a>

                    <button
                      onClick={() => setContactModalOpen(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-accent text-on-primary text-xs font-bold rounded-lg transition-all hover:opacity-90 shadow-sm"
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

        {/* Free Beta CTA Section */}
        <section className="py-24 bg-surface">
          <div className="max-w-[1440px] mx-auto px-8">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-accent/10 border border-emerald-accent/20 rounded-full mb-8">
                <span className="w-2 h-2 rounded-full bg-emerald-accent animate-pulse"></span>
                <span className="font-mono text-xs text-emerald-accent font-semibold uppercase tracking-wider">
                  Free During Beta
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
                Free, Unlimited Access During Launch
              </h2>
              <p className="text-on-surface-variant text-lg mb-10 leading-relaxed">
                VentureLens is completely free during our launch phase. Run unlimited venture due diligence analyses, multi-format deck extractions, and scoring equations at no cost.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/wizard"
                  className="bg-primary text-on-primary px-10 py-4 rounded-xl text-base font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm inline-flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">rocket_launch</span>
                  <span>Start Your Free Analysis</span>
                </Link>
                <button
                  onClick={() => setContactModalOpen(true)}
                  className="bg-white border border-outline-variant text-on-surface px-8 py-4 rounded-xl text-base font-bold hover:bg-surface-container-low transition-colors"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="py-24 bg-primary text-on-primary">
          <div className="max-w-[1440px] mx-auto px-8 text-center relative overflow-hidden">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight">
              Ready to Stress-Test Your Startup Idea?
            </h2>
            <p className="text-base md:text-lg mb-12 max-w-2xl mx-auto opacity-80 leading-relaxed font-normal">
              Run your pitch deck or startup thesis through our deterministic validation engine in under 20 seconds.
            </p>
            <Link
              href="/wizard"
              className="bg-emerald-accent text-on-primary px-10 py-5 rounded-xl text-lg font-bold hover:scale-105 transition-transform macro-shadow inline-block active:scale-95"
            >
              Start Free Venture Diligence
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-outline-variant/30 py-16">
        <div className="max-w-[1440px] mx-auto px-8 grid grid-cols-1 md:grid-cols-6 gap-10">
          <div className="md:col-span-2 space-y-4">
            <div className="text-xl font-bold text-on-surface">VentureLens</div>
            <p className="text-on-surface-variant text-xs max-w-xs leading-relaxed">
              Institutional decision intelligence and evidence-grounded venture evaluation platform.
            </p>
            <p className="text-xs text-on-surface-variant">
              Founder: Datha Sai Swaroop (IIT BHU)
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface mb-4">Product</h4>
            <ul className="space-y-2 text-xs font-medium text-on-surface-variant">
              <li><Link href="/features" className="hover:text-secondary transition-colors">Features</Link></li>
              <li><Link href="/platform" className="hover:text-secondary transition-colors">Platform</Link></li>
              <li><Link href="/pricing" className="hover:text-secondary transition-colors">Pricing</Link></li>
              <li><Link href="/templates" className="hover:text-secondary transition-colors">Templates</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface mb-4">Company</h4>
            <ul className="space-y-2 text-xs font-medium text-on-surface-variant">
              <li><Link href="/about" className="hover:text-secondary transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-secondary transition-colors">Contact</Link></li>
              <li><button onClick={() => toast.info("Methodology papers coming soon")} className="hover:text-secondary transition-colors text-left">Methodology</button></li>
              <li><button onClick={() => toast.info("Accelerator partnerships coming soon")} className="hover:text-secondary transition-colors text-left">Partnerships</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface mb-4">Legal</h4>
            <ul className="space-y-2 text-xs font-medium text-on-surface-variant">
              <li><Link href="/privacy" className="hover:text-secondary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-secondary transition-colors">Terms of Service</Link></li>
              <li><a href="https://github.com/dathasaiswaroopgudimella-png/Venturelens" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">GitHub</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface mb-4">Connect</h4>
            <ul className="space-y-2 text-xs font-medium text-on-surface-variant">
              <li><a href="https://www.linkedin.com/in/datha-sai-swaroop-gudimella-ab4184371" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">LinkedIn</a></li>
              <li><a href="mailto:dathasaiswaroopgudimella@gmail.com" className="hover:text-secondary transition-colors">Email</a></li>
              <li><a href="tel:+919121146369" className="hover:text-secondary transition-colors">+91 9121146369</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto px-8 mt-12 pt-8 border-t border-outline-variant/10 flex justify-between items-center text-xs text-on-surface-variant">
          <p>© 2026 VentureLens AI. All rights reserved.</p>
        </div>
      </footer>

      {/* Interactive Contact Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-outline-variant/30 shadow-2xl p-6 sm:p-8 relative">
            <button
              onClick={() => setContactModalOpen(false)}
              className="absolute top-5 right-5 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center font-bold">
                  VL
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface">Get in Touch</h3>
                  <p className="text-xs text-on-surface-variant">Direct Inquiry & Support</p>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Send a message regarding partnerships, pilot deployment, or venture intelligence evaluation.
              </p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Full Name"
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/50 text-sm focus:outline-none focus:border-primary bg-surface/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/50 text-sm focus:outline-none focus:border-primary bg-surface/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                  Message / Inquiry
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details about your venture or inquiry..."
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/50 text-sm focus:outline-none focus:border-primary bg-surface/50 resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:opacity-90 text-on-primary font-bold py-3 rounded-xl text-sm transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>

                <div className="flex items-center justify-between text-xs text-on-surface-variant px-1">
                  <span>Direct: +91 9121146369</span>
                  <a
                    href="https://www.linkedin.com/in/datha-sai-swaroop-gudimella-ab4184371"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary font-semibold hover:underline"
                  >
                    LinkedIn Profile ↗
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
