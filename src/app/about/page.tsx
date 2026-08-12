import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-surface min-h-screen text-on-surface font-sans selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Navigation Header */}
      <header className="docked full-width top-0 sticky z-50 glass-header border-b border-outline-variant/30 shadow-sm">
        <div className="flex justify-between items-center px-8 h-16 w-full max-w-[1440px] mx-auto">
          <Link href="/" className="font-headline-md text-xl font-bold tracking-tight text-on-surface">
            VentureLens AI
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/features" className="text-on-surface-variant hover:text-on-surface transition-colors">Features</Link>
            <Link href="/pricing" className="text-on-surface-variant hover:text-on-surface transition-colors">Pricing</Link>
            <Link href="/about" className="text-secondary border-b-2 border-secondary pb-1">About</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-on-surface-variant hover:text-on-surface text-sm font-semibold transition-colors">Dashboard</Link>
            <Link href="/wizard" className="bg-primary text-on-primary px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all active:scale-95 shadow-sm">
              Try Free
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero / Mission */}
        <section className="max-w-4xl mx-auto px-8 py-20 text-center">
          <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-mono font-bold uppercase tracking-widest rounded-full mb-6">
            Our Mission
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-on-surface mb-6 leading-tight">
            Replacing guesswork with<br className="hidden md:block" /> deterministic decision intelligence.
          </h1>
          <p className="text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Too many founders waste years building the wrong thing because startup evaluation tools rely on vibes, hype, or expensive advisors. VentureLens applies structured rules, real market data, and cross-verified AI to give every founder access to the same rigorous analysis top-tier VCs apply internally.
          </p>
        </section>

        {/* Story Section */}
        <section className="bg-surface-container-low/60 border-y border-outline-variant/20 py-20">
          <div className="max-w-3xl mx-auto px-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface mb-8">Why We Built This</h2>
            <div className="space-y-5 text-sm text-on-surface-variant leading-relaxed">
              <p>
                After watching dozens of talented engineers spend 18 months building products that solved problems nobody had, we asked a simple question: why is startup validation still done through gut feeling and expensive consultants when we have structured knowledge graphs, deterministic rule engines, and AI reasoning chains?
              </p>
              <p>
                The answer was that nobody had built the integration layer. Market research tools existed. AI chatbots existed. But nothing connected structured fact extraction, 16-point logic validation, live competitor research, and AI cross-verification into a single coherent pipeline — one that could produce a trustworthy, reproducible signal in under 30 seconds.
              </p>
              <p>
                VentureLens is that pipeline. It doesn't replace founder intuition — it stress-tests it. Every claim you make about your market, your pricing, your competitive moat, and your go-to-market strategy gets run through the same deterministic checks we would apply if we were the due diligence team. The result is a report you can stand behind, not just a ChatGPT paragraph you copied into a pitch deck.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="max-w-5xl mx-auto px-8 py-20">
          <h2 className="text-2xl font-extrabold tracking-tight text-on-surface mb-12">Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              {
                initials: "DG",
                name: "Datha Saiswaroop",
                role: "Founder & Lead Engineer",
                bio: "Building decision intelligence pipelines for early-stage founders. Full-stack, AI systems, and product strategy.",
                links: {
                  github: "https://github.com/dathasaiswaroopgudimella-png",
                  linkedin: "#",
                },
              },
            ].map((member) => (
              <div key={member.name} className="bg-white p-6 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col gap-4">
                <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center font-extrabold text-secondary text-xl">
                  {member.initials}
                </div>
                <div>
                  <h3 className="font-bold text-on-surface text-base">{member.name}</h3>
                  <p className="text-xs text-secondary font-semibold mt-0.5">{member.role}</p>
                  <p className="text-xs text-on-surface-variant mt-3 leading-relaxed">{member.bio}</p>
                </div>
                <div className="flex gap-3 pt-2 border-t border-outline-variant/20">
                  <a href={member.links.github} target="_blank" rel="noopener noreferrer" className="text-xs text-on-surface-variant hover:text-secondary font-semibold transition-colors">
                    GitHub ↗
                  </a>
                  <a href={member.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-on-surface-variant hover:text-secondary font-semibold transition-colors">
                    LinkedIn ↗
                  </a>
                </div>
              </div>
            ))}

            {/* Open role card */}
            <div className="bg-surface-container-low/50 p-6 rounded-xl border border-dashed border-outline-variant/40 flex flex-col gap-4 items-start justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-widest">Open Role</span>
                <h3 className="font-bold text-on-surface text-base mt-1">Head of Growth</h3>
                <p className="text-xs text-on-surface-variant mt-3 leading-relaxed">
                  Experience in founder communities, product-led acquisition, and content strategy for technical B2B SaaS.
                </p>
              </div>
              <Link href="/contact" className="text-xs text-secondary hover:underline font-bold">
                Apply via Contact →
              </Link>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-surface-container-low/60 border-y border-outline-variant/20 py-20">
          <div className="max-w-5xl mx-auto px-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface mb-12 text-center">What We Stand For</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "rule",
                  title: "Determinism First",
                  desc: "We believe that startup evaluation should produce the same result given the same inputs — not different answers depending on which LLM you're running. Rules before vibes.",
                },
                {
                  icon: "visibility",
                  title: "Full Transparency",
                  desc: "Every score is traceable. We show you which rule fired, why a flag was raised, and where your claims contradict the evidence. No black boxes.",
                },
                {
                  icon: "handshake",
                  title: "Founder-First Design",
                  desc: "We optimize for the founder trying to learn, not the investor trying to judge. Our reports are advisory, not gatekeeping. We want you to succeed.",
                },
              ].map((v) => (
                <div key={v.title} className="bg-white p-6 rounded-xl border border-outline-variant/30 shadow-sm">
                  <span className="material-symbols-outlined text-secondary text-2xl mb-4 block">{v.icon}</span>
                  <h3 className="font-bold text-on-surface text-base mb-2">{v.title}</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="max-w-2xl mx-auto px-8 py-20 text-center">
          <h2 className="text-xl font-extrabold text-on-surface mb-3">Want to reach out?</h2>
          <p className="text-on-surface-variant text-sm mb-6">
            For partnerships, enterprise access, or general questions, we're reachable at{" "}
            <a href="mailto:hello@venturelens.ai" className="text-secondary font-semibold hover:underline">
              hello@venturelens.ai
            </a>
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-base">mail</span>
            <span>Open Contact Form</span>
          </Link>
        </section>
      </main>

      <footer className="bg-surface border-t border-outline-variant/30 py-8 text-center text-xs text-on-surface-variant">
        <p>© 2026 VentureLens AI. All rights reserved. <Link href="/" className="underline hover:text-secondary ml-2">Home</Link></p>
      </footer>
    </div>
  );
}
