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
          description: `Thank you for reaching out. We will get back to you at ${email} within 24 hours.`,
          duration: 5000,
        });
        setName("");
        setEmail("");
        setMessage("");
      } else {
        toast.error("Submission failed", {
          description: "Please try again or email directly.",
          duration: 4000,
        });
      }
    } catch {
      toast.error("Network error", {
        description: "Could not reach server. Please try again.",
        duration: 3000,
      });
    } finally {
      setSending(false);
    }
  };

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
            <Link href="/about" className="text-on-surface-variant hover:text-on-surface transition-colors">About</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-secondary hover:opacity-80 transition-opacity text-sm font-semibold">Dashboard</Link>
            <Link
              href="/wizard"
              className="bg-primary text-on-primary px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all active:scale-95 shadow-sm"
            >
              Start Free Diligence
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs text-secondary uppercase tracking-[0.2em] mb-2 block font-semibold">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-4">
            Contact & Support
          </h1>
          <p className="text-on-surface-variant text-base leading-relaxed">
            Have questions about enterprise due diligence, accelerator integrations, or platform features? Send us a message.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Card */}
          <div className="lg:col-span-5 bg-primary text-white rounded-2xl p-8 macro-shadow flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Direct Inquiries</h3>
                <p className="text-xs text-slate-300 mt-1">Founder · Datha Sai Swaroop (IIT BHU)</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-outline-variant/20 text-xs">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary text-lg">mail</span>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Email</span>
                    <a href="mailto:dathasaiswaroopgudimella@gmail.com" className="text-white hover:text-secondary font-semibold transition-colors">
                      dathasaiswaroopgudimella@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary text-lg">call</span>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Direct Phone</span>
                    <a href="tel:+919121146369" className="text-white hover:text-secondary font-semibold transition-colors">
                      +91 9121146369
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary text-lg">link</span>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">LinkedIn</span>
                    <a
                      href="https://www.linkedin.com/in/datha-sai-swaroop-gudimella-ab4184371"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:underline font-semibold transition-colors truncate block"
                    >
                      Datha Sai Swaroop Profile ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-[11px] text-slate-300 leading-normal">
              Based in India · Open to global enterprise diligence pilots and accelerator integrations.
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-8 border border-outline-variant/30 micro-shadow">
            <h2 className="text-2xl font-bold text-on-surface mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant/50 text-sm focus:outline-none focus:border-primary bg-surface/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@company.com"
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant/50 text-sm focus:outline-none focus:border-primary bg-surface/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
                  Message Details
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your venture, fund requirements, or question..."
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant/50 text-sm focus:outline-none focus:border-primary bg-surface/50 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-primary hover:opacity-90 text-on-primary font-bold py-3.5 rounded-lg text-sm transition-all shadow-sm active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {sending ? <span>Sending...</span> : <span>Send Message</span>}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-outline-variant/30 py-8 text-center text-xs text-on-surface-variant mt-16">
        <p>© 2026 VentureLens AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
