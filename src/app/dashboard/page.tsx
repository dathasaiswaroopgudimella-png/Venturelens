"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useVentureStore } from "@/stores/ventureStore";
import { DEMO_REPORT } from "@/lib/demo-report";
import { toast } from "sonner";

export default function DashboardPage() {
  const router = useRouter();
  const { projects, fetchProjects, loadReport } = useVentureStore();
  const [loading, setLoading] = useState(true);
  const [activityExpanded, setActivityExpanded] = useState(false);
  const [projectsRef, setProjectsRef] = useState<HTMLElement | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        await fetchProjects();
      } catch (err) {
        console.error("Failed to load projects", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // One fully pre-loaded demo project — HealthSync AI with a real 84/100 score
  const demoProject = {
    id: "demo-healthsync-001",
    name: "HealthSync AI",
    description: "AI-powered real-time patient engagement and remote monitoring platform for independent physician groups managing chronic disease patients.",
    stage: "Validation",
    score: "84/100",
    status: "analyzed",
    time: "July 10, 2026",
    icon: "monitor_heart",
    scoreColor: "text-emerald-600",
    scoreBg: "bg-emerald-500/10",
  };

  // Map real database projects if they exist
  const dbProjects = projects.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description || "No description provided.",
    stage: "Idea Stage",
    score: p.reports?.[0] ? `${p.reports[0].overall_score}/100` : "Analyzing...",
    status: p.reports?.[0] ? "analyzed" : "pending",
    time: new Date(p.created_at).toLocaleDateString(),
    icon: "lightbulb",
    scoreColor: "text-secondary",
    scoreBg: "bg-secondary/10",
  }));

  // Always show the demo project first, then real ones
  const displayedProjects = [demoProject, ...dbProjects];

  // KPI calculations
  const totalAnalyses = projects.length + 1;
  const reportsGenerated = projects.filter((p) => p.reports?.[0]).length + 1;
  const totalScoreProjects = projects.filter((p) => p.reports?.[0]?.overall_score);
  const avgScore = totalScoreProjects.length > 0
    ? Math.round((84 + totalScoreProjects.reduce((sum, p) => sum + p.reports[0].overall_score, 0)) / (totalScoreProjects.length + 1))
    : 84;
  
  const thisMonthCount = projects.filter((p) => {
    const createdDate = new Date(p.created_at);
    const now = new Date();
    return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
  }).length + 1;

  const handleProjectClick = (projectId: string) => {
    if (projectId === "demo-healthsync-001") {
      // Load the pre-built demo report into state and save to localStorage
      loadReport(DEMO_REPORT);
      localStorage.setItem("latest_venturelens_report", JSON.stringify(DEMO_REPORT));
      router.push("/report/latest");
    } else {
      router.push(`/report/${projectId}`);
    }
  };

  const handleComingSoon = (feature: string) => {
    toast.info(`${feature} is coming soon`, {
      description: "This feature is on our Q3 2026 roadmap.",
      duration: 3000,
    });
  };

  return (
    <div className="flex min-h-screen text-on-surface font-sans bg-surface overflow-x-hidden w-full">
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex flex-col h-screen w-72 bg-surface border-r border-outline-variant/20 sticky top-0 z-50 p-4 shrink-0 justify-between">
        <div>
          <div className="flex items-center gap-3 px-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg">lens</span>
            </div>
            <div>
              <h1 className="font-bold text-base text-on-surface leading-none">VentureLens AI</h1>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mt-1">
                Decision Intelligence
              </p>
            </div>
          </div>
          <Link
            href="/wizard"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-primary text-on-primary rounded-lg font-semibold transition-all duration-200 hover:opacity-90 active:scale-95 mb-8 shadow-sm text-sm"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span>New Analysis</span>
          </Link>
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 bg-secondary-container text-on-secondary-container font-semibold rounded-lg transition-transform active:scale-95 text-sm"
            >
              <span className="material-symbols-outlined text-lg">folder_open</span>
              <span>Projects</span>
            </Link>
            <button
              onClick={() => {
                const el = document.getElementById("projects-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-colors text-sm"
            >
              <span className="material-symbols-outlined text-lg">analytics</span>
              <span>Reports</span>
            </button>
            <button
              onClick={() => handleComingSoon("Templates")}
              className="w-full flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-colors text-sm"
            >
              <span className="material-symbols-outlined text-lg">dashboard_customize</span>
              <span>Templates</span>
            </button>
            <button
              onClick={() => handleComingSoon("Settings")}
              className="w-full flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-colors text-sm"
            >
              <span className="material-symbols-outlined text-lg">settings</span>
              <span>Settings</span>
            </button>
          </nav>
        </div>
        <div className="border-t border-outline-variant/20 pt-4 space-y-1">
          <button
            onClick={() => handleComingSoon("Support")}
            className="w-full flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-colors text-sm"
          >
            <span className="material-symbols-outlined text-lg">help</span>
            <span>Support</span>
          </button>
          <div className="flex items-center gap-3 px-3 py-4 mt-2">
            <div className="w-8 h-8 rounded-full border border-outline-variant/50 bg-secondary-container flex items-center justify-center font-bold text-secondary text-xs">
              VL
            </div>
            <div>
              <p className="font-semibold text-xs text-on-surface">VentureLens Demo</p>
              <p className="text-[10px] text-on-surface-variant">Beta Access</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 min-w-0 max-w-[1440px] mx-auto overflow-y-auto">
        {/* Header */}
        <header className="glass-header sticky top-0 z-40 px-6 md:px-8 h-20 flex items-center justify-between border-b border-outline-variant/30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="block md:hidden text-on-surface-variant hover:text-on-surface p-1 rounded-md transition-colors"
              aria-label="Open navigation menu"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
            <h2 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">Venture Portfolio</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-full border border-outline-variant/30">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="font-mono text-xs text-on-surface-variant font-semibold">
                System Online
              </span>
            </div>
            <button
              aria-label="Notifications"
              onClick={() => handleComingSoon("Notifications")}
              className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
            </button>
            <div className="w-10 h-10 rounded-full border border-outline-variant/50 overflow-hidden flex items-center justify-center font-bold text-secondary bg-secondary-container">
              VL
            </div>
          </div>
        </header>

        <div className="p-8 space-y-10">
          {/* KPI Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Total Analyses */}
            <div className="bg-white p-6 rounded-xl micro-shadow border border-outline-variant/30 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider font-bold">Total Analyses</span>
                <span className="material-symbols-outlined text-secondary text-xl">description</span>
              </div>
              <div>
                <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">{totalAnalyses}</h3>
                <p className="text-[11px] text-on-surface-variant mt-1">Completed & draft startup ideas</p>
              </div>
            </div>

            {/* Card 2: Average Score */}
            <div className="bg-white p-6 rounded-xl micro-shadow border border-outline-variant/30 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider font-bold">Average Score</span>
                <span className="material-symbols-outlined text-emerald-500 text-xl">star</span>
              </div>
              <div>
                <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">{avgScore}/100</h3>
                <p className="text-[11px] text-on-surface-variant mt-1">Weighted validation strength</p>
              </div>
            </div>

            {/* Card 3: Reports Generated */}
            <div className="bg-white p-6 rounded-xl micro-shadow border border-outline-variant/30 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider font-bold">Reports Built</span>
                <span className="material-symbols-outlined text-blue-500 text-xl">assignment_turned_in</span>
              </div>
              <div>
                <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">{reportsGenerated}</h3>
                <p className="text-[11px] text-on-surface-variant mt-1">Deep strategic evaluations</p>
              </div>
            </div>

            {/* Card 4: This Month */}
            <div className="bg-white p-6 rounded-xl micro-shadow border border-outline-variant/30 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-on-surface-variant uppercase tracking-wider font-bold">This Month</span>
                <span className="material-symbols-outlined text-amber-500 text-xl">calendar_today</span>
              </div>
              <div>
                <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">{thisMonthCount}</h3>
                <p className="text-[11px] text-on-surface-variant mt-1">Quota usage this cycle</p>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Projects Grid */}
            <section id="projects-section" className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-bold tracking-tight text-on-surface">
                  {loading ? "Loading Projects..." : "Recent Analyses"}
                </h4>
                <button
                  onClick={() => {
                    const el = document.getElementById("projects-section");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="font-mono text-xs text-secondary font-bold hover:underline"
                >
                  All {displayedProjects.length} Project{displayedProjects.length !== 1 ? "s" : ""}
                </button>
              </div>

              {loading ? (
                /* Skeleton loading state */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-outline-variant/30 animate-pulse">
                      <div className="w-12 h-12 bg-surface-container rounded-lg mb-4" />
                      <div className="h-4 bg-surface-container rounded w-3/4 mb-2" />
                      <div className="h-3 bg-surface-container rounded w-full mb-1" />
                      <div className="h-3 bg-surface-container rounded w-2/3" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayedProjects.map((p) => (
                    <div
                      key={p.id}
                      className="group bg-white p-6 rounded-xl micro-shadow border border-outline-variant/30 hover:border-secondary/40 transition-all cursor-pointer hover:shadow-md"
                      onClick={() => handleProjectClick(p.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && handleProjectClick(p.id)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-12 h-12 ${p.scoreBg || "bg-secondary-container"} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <span className="material-symbols-outlined text-secondary">
                            {(p as any).icon || "lightbulb"}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 font-mono text-xs rounded border border-emerald-500/15">
                          {p.stage}
                        </span>
                      </div>
                      <h5 className="text-lg font-bold mb-1 text-on-surface group-hover:text-secondary transition-colors">
                        {p.name}
                      </h5>
                      <p className="text-on-surface-variant text-sm mb-6 line-clamp-2">
                        {p.description}
                      </p>
                      <div className="flex items-center justify-between border-t border-outline-variant/20 pt-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-[10px] text-on-surface-variant uppercase">
                            Venture Score
                          </span>
                          <span className={`font-mono text-sm font-bold mt-0.5 ${(p as any).scoreColor || "text-on-surface"}`}>
                            {p.score}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {p.status === "pending" ? (
                            <>
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
                              <span className="font-mono text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Analyzing</span>
                            </>
                          ) : (
                            <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-600 font-semibold">
                              <span className="material-symbols-outlined text-sm">verified</span>
                              Analyzed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Live Activity / Consistency Checks */}
            <section className="space-y-6">
              <h4 className="text-xl font-bold tracking-tight text-on-surface">Pipeline Activity</h4>
              <div className="bg-white rounded-xl micro-shadow border border-outline-variant/30 overflow-hidden">
                <div className="p-4 border-b border-outline-variant/20 bg-surface-container-low/50 flex justify-between items-center">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Latest Events
                  </span>
                  <span className="font-mono text-xs text-secondary font-semibold">Live</span>
                </div>
                <div className="divide-y divide-outline-variant/20">
                  <div className="p-4 hover:bg-surface-container-low/30 transition-colors">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-emerald-500 text-lg">verified</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">Analysis Complete</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          HealthSync AI scored 84/100 — Strong Investment Signal.
                        </p>
                        <div className="flex items-center gap-2 mt-2 font-mono text-[9px]">
                          <span className="px-1.5 py-0.5 bg-surface-container rounded border border-outline-variant/20">
                            RULE-ENGINE-16
                          </span>
                          <span className="text-on-surface-variant">July 10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-surface-container-low/30 transition-colors">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-amber-500 text-lg">warning</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">Consistency Flag Detected</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          HealthSync: EHR setup timeline claim vs. certification reality.
                        </p>
                        <div className="flex items-center gap-2 mt-2 font-mono text-[9px]">
                          <span className="px-1.5 py-0.5 bg-surface-container rounded border border-outline-variant/20">
                            CON-HEALTH-01
                          </span>
                          <span className="text-on-surface-variant">July 10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-surface-container-low/30 transition-colors">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-blue-500 text-lg">info</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">AI Cross-Verification</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          Agreement Score: 92% — Very High Agreement with deterministic score.
                        </p>
                        <div className="flex items-center gap-2 mt-2 font-mono text-[9px]">
                          <span className="px-1.5 py-0.5 bg-surface-container rounded border border-outline-variant/20">
                            NVIDIA-NIM
                          </span>
                          <span className="text-on-surface-variant">July 10</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {activityExpanded && (
                    <div className="p-4 hover:bg-surface-container-low/30 transition-colors">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-emerald-500 text-lg">description</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold">Tavily Research Complete</p>
                          <p className="text-xs text-on-surface-variant mt-0.5">
                            4 competitor candidates identified: Livongo, Omada Health, Twilio Health, Epic MyChart.
                          </p>
                          <div className="flex items-center gap-2 mt-2 font-mono text-[9px]">
                            <span className="px-1.5 py-0.5 bg-surface-container rounded border border-outline-variant/20">
                              TAVILY-SEARCH
                            </span>
                            <span className="text-on-surface-variant">July 10</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setActivityExpanded((v) => !v)}
                  className="w-full py-3 bg-surface hover:bg-surface-container-low transition-colors font-mono text-xs font-bold text-on-surface-variant border-t border-outline-variant/20 uppercase tracking-wider"
                >
                  {activityExpanded ? "Show Less" : "See All Activity"}
                </button>
              </div>

              {/* Demo hint card */}
              <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-xl mt-0.5">lightbulb</span>
                  <div>
                    <p className="text-sm font-bold text-secondary mb-1">Try the Demo Report</p>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Click on <strong>HealthSync AI</strong> above to see a fully computed 9-stage venture intelligence report with SWOT, GTM, MVP roadmap, and AI cross-verification.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Quick Action Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <Link
              href="/analyze"
              className="bg-white p-6 rounded-xl border border-outline-variant/30 hover:border-secondary/40 transition-all micro-shadow hover:shadow-md flex flex-col justify-between group"
            >
              <div>
                <span className="material-symbols-outlined text-secondary text-2xl mb-3 block">rocket_launch</span>
                <h4 className="text-sm font-bold text-on-surface mb-1 group-hover:text-secondary transition-colors">
                  New Venture Analysis
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Start a new 9-stage deterministic validation pipeline for your startup.
                </p>
              </div>
              <span className="text-[10px] font-bold text-secondary mt-4 flex items-center gap-1">
                <span>Start Wizard</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </span>
            </Link>

            <Link
              href="/templates"
              className="bg-white p-6 rounded-xl border border-outline-variant/30 hover:border-secondary/40 transition-all micro-shadow hover:shadow-md flex flex-col justify-between group"
            >
              <div>
                <span className="material-symbols-outlined text-secondary text-2xl mb-3 block">dashboard_customize</span>
                <h4 className="text-sm font-bold text-on-surface mb-1 group-hover:text-secondary transition-colors">
                  Startup Blueprints
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Pre-fill your parameters using 6 pre-built industry sector templates.
                </p>
              </div>
              <span className="text-[10px] font-bold text-secondary mt-4 flex items-center gap-1">
                <span>Browse Templates</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </span>
            </Link>

            <Link
              href="/settings"
              className="bg-white p-6 rounded-xl border border-outline-variant/30 hover:border-secondary/40 transition-all micro-shadow hover:shadow-md flex flex-col justify-between group"
            >
              <div>
                <span className="material-symbols-outlined text-secondary text-2xl mb-3 block">manage_accounts</span>
                <h4 className="text-sm font-bold text-on-surface mb-1 group-hover:text-secondary transition-colors">
                  API Credentials & Team
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Generate tokens for REST endpoints and configure workspaces.
                </p>
              </div>
              <span className="text-[10px] font-bold text-secondary mt-4 flex items-center gap-1">
                <span>Configure Settings</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </span>
            </Link>
          </section>

          {/* Footer */}
          <footer className="pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center text-xs text-on-surface-variant gap-4">
            <p>© 2026 VentureLens AI. All rights reserved. Beta Version.</p>
            <div className="flex gap-6 font-semibold">
              <Link href="/privacy" className="hover:text-secondary transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-secondary transition-colors">Terms of Service</Link>
              <Link href="/about" className="hover:text-secondary transition-colors">About</Link>
              <Link href="/contact" className="hover:text-secondary transition-colors">Contact</Link>
            </div>
          </footer>
        </div>
      </main>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative w-72 h-full bg-surface border-r border-outline-variant/20 p-4 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between px-2 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-lg">lens</span>
                  </div>
                  <h1 className="font-bold text-base text-on-surface">VentureLens AI</h1>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-on-surface-variant hover:text-on-surface p-1 rounded-md">
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>
              <nav className="space-y-1">
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 bg-secondary-container text-on-secondary-container font-semibold rounded-lg text-sm">
                  <span className="material-symbols-outlined text-lg">folder_open</span>
                  <span>Projects</span>
                </Link>
                <Link href="/wizard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-colors text-sm">
                  <span className="material-symbols-outlined text-lg">add</span>
                  <span>New Analysis</span>
                </Link>
                <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-colors text-sm">
                  <span className="material-symbols-outlined text-lg">payments</span>
                  <span>Pricing</span>
                </Link>
              </nav>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
