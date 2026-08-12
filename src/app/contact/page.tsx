"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";

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
        toast.success("Message sent successfully", {
          description: `We'll get back to you at ${email} within 24 hours.`,
          duration: 4000,
        });
        setName("");
        setEmail("");
        setMessage("");
      } else {
        toast.error("Submission failed", {
          description: "Please try again or email hello@venturelens.ai directly.",
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

      <main className="max-w-xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">Contact Us</h1>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Have questions about our engines, API integrations, or enterprise options? Send us a message.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-lg border border-outline-variant/50 focus:outline-none focus:border-primary bg-surface/50 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg border border-outline-variant/50 focus:outline-none focus:border-primary bg-surface/50 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help you?"
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-outline-variant/50 focus:outline-none focus:border-primary bg-surface/50 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full py-3.5 bg-primary text-on-primary rounded-lg text-sm font-bold hover:opacity-90 transition-opacity active:scale-98 shadow-sm flex items-center justify-center gap-2"
          >
            {sending ? "Sending message..." : "Send Message"}
          </button>
        </form>
      </main>

      <footer className="bg-surface border-t border-outline-variant/30 py-8 text-center text-xs text-on-surface-variant">
        <p>© 2026 VentureLens AI. All rights reserved. <Link href="/" className="underline hover:text-secondary ml-2">Home</Link></p>
      </footer>
    </div>
  );
}
