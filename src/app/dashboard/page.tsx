"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useVentureStore } from "@/stores/ventureStore";

export default function DashboardPage() {
  const router = useRouter();
  const { projects, fetchProjects } = useVentureStore();
  const [loading, setLoading] = useState(true);

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

  // Standard high-fidelity mock projects to show if user has no saved projects
  const defaultProjects = [
    {
      id: "mock-1",
      name: "Luminary Robotics",
      description: "Autonomous warehousing robotic solutions.",
      stage: "Series A",
      score: "88.4%",
      status: "analyzed",
      time: "2 hours ago",
    },
    {
      id: "mock-2",
      name: "Verdant Systems",
      description: "Regenerative soil intelligence platform.",
      stage: "Seed",
      score: "CALC...",
      status: "syncing",
      time: "Syncing now",
    },
  ];

  // If there are real database projects, map them
  const displayedProjects = projects.length > 0 
    ? projects.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description || "No description provided.",
        stage: "Idea Stage",
        score: p.reports?.[0] ? `${p.reports[0].overall_score}%` : "CALC...",
        status: p.reports?.[0] ? "analyzed" : "syncing",
        time: new Date(p.created_at).toLocaleDateString(),
      }))
    : defaultProjects;

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
                Venture Co-pilot
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
            <a
              className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-colors text-sm"
              href="#"
            >
              <span className="material-symbols-outlined text-lg">analytics</span>
              <span>Reports</span>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-colors text-sm"
              href="#"
            >
              <span className="material-symbols-outlined text-lg">dashboard_customize</span>
              <span>Templates</span>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-colors text-sm"
              href="#"
            >
              <span className="material-symbols-outlined text-lg">settings</span>
              <span>Settings</span>
            </a>
          </nav>
        </div>
        <div className="border-t border-outline-variant/20 pt-4 space-y-1">
          <a
            className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-colors text-sm"
            href="#"
          >
            <span className="material-symbols-outlined text-lg">help</span>
            <span>Support</span>
          </a>
          <div className="flex items-center gap-3 px-3 py-4 mt-2">
            <div className="w-8 h-8 rounded-full border border-outline-variant/50 bg-secondary-container flex items-center justify-center font-bold text-secondary text-xs">
              MC
            </div>
            <div>
              <p className="font-semibold text-xs text-on-surface">Marcus Chen</p>
              <p className="text-[10px] text-on-surface-variant">Premium Partner</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 min-w-0 max-w-[1440px] mx-auto overflow-y-auto">
        {/* Header */}
        <header className="glass-header sticky top-0 z-40 px-8 h-20 flex items-center justify-between border-b border-outline-variant/30">
          <h2 className="text-2xl font-bold text-on-surface tracking-tight">Welcome back, Marcus.</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-full border border-outline-variant/30">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="font-mono text-xs text-on-surface-variant font-semibold">
                System Optimal
              </span>
            </div>
            <button className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </button>
            <div className="w-10 h-10 rounded-full border border-outline-variant/50 overflow-hidden flex items-center justify-center font-bold text-secondary bg-secondary-container">
              MC
            </div>
          </div>
        </header>

        <div className="p-8 space-y-10">
          {/* Global Metrics Section */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-xl micro-shadow border border-outline-variant/30 flex flex-col justify-between">
              <div>
                <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-1">
                  Portfolio Sentiment
                </p>
                <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">
                  Average Venture Score (72)
                </h3>
              </div>
              <div className="mt-4">
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-[72%]"></div>
                </div>
                <div className="flex justify-between mt-2 font-mono text-xs text-on-surface-variant">
                  <span>0</span>
                  <span className="text-secondary font-bold">72% Strong Confidence</span>
                  <span>100</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl micro-shadow border border-outline-variant/30 flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">description</span>
              <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">
                Total Reports
              </p>
              <h3 className="text-3xl font-bold text-on-surface leading-tight mt-1">
                ({projects.length > 0 ? projects.length : 12})
              </h3>
            </div>
            <div className="bg-primary text-white p-6 rounded-xl shadow-lg flex flex-col justify-between">
              <p className="font-mono text-xs text-outline-variant/60 uppercase tracking-widest">
                Quick Actions
              </p>
              <div className="space-y-3 mt-4">
                <Link
                  href="/wizard"
                  className="flex items-center justify-between w-full p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/10 group text-sm font-semibold"
                >
                  <span>New Analysis</span>
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
                <button className="flex items-center justify-between w-full p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/10 group text-sm font-semibold">
                  <span>Upload Data</span>
                  <span className="material-symbols-outlined text-lg">upload</span>
                </button>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Projects Grid */}
            <section className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-bold tracking-tight text-on-surface">Recent Projects</h4>
                <button className="font-mono text-xs text-secondary font-bold hover:underline">
                  View All Projects
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayedProjects.map((p) => (
                  <div
                    key={p.id}
                    className="group bg-white p-6 rounded-xl micro-shadow border border-outline-variant/30 hover:border-secondary/40 transition-all cursor-pointer"
                    onClick={() => {
                      if (p.id !== "mock-1" && p.id !== "mock-2") {
                        router.push(`/report/${p.id}`);
                      } else {
                        // For mockup, redirect to generic latest report
                        window.location.href = "/report/latest";
                      }
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-secondary-container rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-secondary">
                          {p.name.toLowerCase().includes("robo") ? "smart_toy" : "eco"}
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
                        <span className="font-mono text-sm text-on-surface font-bold mt-0.5">
                          {p.score}
                        </span>
                      </div>
                      {p.status === "syncing" ? (
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
                          <span className="font-mono text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
                            Syncing
                          </span>
                        </div>
                      ) : (
                        <div className="flex -space-x-2">
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                            JD
                          </div>
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-[10px] font-bold">
                            AI
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Live Activity / Consistency Checks */}
            <section className="space-y-6">
              <h4 className="text-xl font-bold tracking-tight text-on-surface">Consistency Checks</h4>
              <div className="bg-white rounded-xl micro-shadow border border-outline-variant/30 overflow-hidden">
                <div className="p-4 border-b border-outline-variant/20 bg-surface-container-low/50 flex justify-between items-center">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Live Activity
                  </span>
                  <span className="font-mono text-xs text-secondary font-semibold">Real-time</span>
                </div>
                <div className="divide-y divide-outline-variant/20">
                  <div className="p-4 hover:bg-surface-container-low/30 transition-colors cursor-pointer group">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-emerald-500 text-lg">verified</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold group-hover:text-secondary transition-colors">
                          Financial Validation Passed
                        </p>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          Luminary Robotics Q3 data matches bank ledger.
                        </p>
                        <div className="flex items-center gap-2 mt-2 font-mono text-[9px]">
                          <span className="px-1.5 py-0.5 bg-surface-container rounded border border-outline-variant/20">
                            SEC-FILING-8K
                          </span>
                          <span className="text-on-surface-variant">14m ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-surface-container-low/30 transition-colors cursor-pointer group">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-amber-500 text-lg">warning</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold group-hover:text-secondary transition-colors">
                          Discrepancy Detected
                        </p>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          Cap table mismatch found in Project: SkyLink.
                        </p>
                        <div className="flex items-center gap-2 mt-2 font-mono text-[9px]">
                          <span className="px-1.5 py-0.5 bg-surface-container rounded border border-outline-variant/20">
                            CARTA-API
                          </span>
                          <span className="text-on-surface-variant">1h ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-surface-container-low/30 transition-colors cursor-pointer group">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-blue-500 text-lg">info</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold group-hover:text-secondary transition-colors">
                          Analysis Completed
                        </p>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          Tech diligence report generated for BioPulse.
                        </p>
                        <div className="flex items-center gap-2 mt-2 font-mono text-[9px]">
                          <span className="px-1.5 py-0.5 bg-surface-container rounded border border-outline-variant/20">
                            GEN-REPORT-04
                          </span>
                          <span className="text-on-surface-variant">3h ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="w-full py-3 bg-surface hover:bg-surface-container-low transition-colors font-mono text-xs font-bold text-on-surface-variant border-t border-outline-variant/20 uppercase tracking-wider">
                  See All Activity
                </button>
              </div>
            </section>
          </div>

          {/* Footer */}
          <footer className="pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center text-xs text-on-surface-variant gap-4">
            <p>© 2026 VentureLens AI. All rights reserved.</p>
            <div className="flex gap-6 font-semibold">
              <a className="hover:text-secondary transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-secondary transition-colors" href="#">Terms of Service</a>
              <a className="hover:text-secondary transition-colors" href="#">Security</a>
              <a className="hover:text-secondary transition-colors" href="#">Contact</a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
