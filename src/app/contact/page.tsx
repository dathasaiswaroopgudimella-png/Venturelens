"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.warning("Incomplete form", {
        description: "Please fill out all fields before submitting.",
        duration: 3000,
      });
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        toast.success("Message sent successfully!", {
          description: `Thank you for reaching out to Datha Sai Swaroop. We will get back to you at ${email} within 24 hours.`,
          duration: 5000,
        });
        setName("");
        setEmail("");
        setMessage("");
      } else {
        toast.error("Submission failed", {
          description: "Please email dathasaiswaroopgudimella@gmail.com directly.",
          duration: 4000,
        });
      }
    } catch {
      toast.error("Network error", {
        description: "Could not reach server. Please email dathasaiswaroopgudimella@gmail.com directly.",
        duration: 3000,
      });
    } finally {
      setSending(false);
    }
  };

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
            <Link href="/about" className="hover:text-blue-600 transition-colors">About Founder</Link>
            <Link href="/contact" className="text-blue-600 border-b-2 border-blue-600 pb-1">Contact</Link>
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

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Contact Leadership & Founder
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Have questions about enterprise due diligence, accelerator partnerships, or investor integrations? Connect directly with the founder.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Founder Contact Information Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
                  DS
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Datha Sai Swaroop</h3>
                  <p className="text-sm font-semibold text-blue-400">Founder · IIT BHU</p>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed font-normal">
                Always eager to connect with early-stage founders, angel networks, university incubators, and VC partners building the future of venture intelligence.
              </p>

              <div className="space-y-4 pt-4 border-t border-slate-700 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-blue-400">
                    <span className="material-symbols-outlined text-lg">mail</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Email</span>
                    <a href="mailto:dathasaiswaroopgudimella@gmail.com" className="text-white hover:text-blue-300 font-semibold transition-colors">
                      dathasaiswaroopgudimella@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-blue-400">
                    <span className="material-symbols-outlined text-lg">call</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Direct Phone / WhatsApp</span>
                    <a href="tel:+919121146369" className="text-white hover:text-blue-300 font-semibold transition-colors">
                      +91 9121146369
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-blue-400">
                    <span className="material-symbols-outlined text-lg">link</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">LinkedIn</span>
                    <a
                      href="https://www.linkedin.com/in/datha-sai-swaroop-gudimella-ab4184371"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-semibold transition-colors truncate block"
                    >
                      Datha Sai Swaroop Profile ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-[11px] text-slate-400 leading-normal">
              Based in India · Open to global enterprise diligence pilots and accelerator integrations.
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Send Direct Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Henderson"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  Message / Inquiry Details
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your venture, fund requirements, or collaboration idea..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 bg-slate-50/50 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {sending ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <span>Send Message to Datha Sai Swaroop</span>
                    <span className="material-symbols-outlined text-base">send</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
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
