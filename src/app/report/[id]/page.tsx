"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useVentureStore } from "@/stores/ventureStore";
import { UnifiedVentureReport } from "@/types";
import { toast } from "sonner";

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { currentReport, loadReport, fetchReportById } = useVentureStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"summary" | "analysis" | "roadmap" | "copy">("summary");

  const handleComingSoon = (feature: string) => {
    toast.info(`${feature} is coming soon`, {
      description: "This feature is on our Q3 2026 roadmap.",
      duration: 3000,
    });
  };

  useEffect(() => {
    const getReport = async () => {
      try {
        if (id === "latest" || id === "healthsync-ai" || id === "demo-healthsync-001") {
          if (id === "latest") {
            const localStr = localStorage.getItem("latest_venturelens_report");
            if (localStr) {
              const report = JSON.parse(localStr);
              loadReport(report);
            } else {
              const { DEMO_REPORT } = await import("@/lib/demo-report");
              loadReport(DEMO_REPORT);
            }
          } else {
            const { DEMO_REPORT } = await import("@/lib/demo-report");
            loadReport(DEMO_REPORT);
          }
        } else {
          // Fetch from database
          await fetchReportById(id);
        }
      } catch (err: any) {
        console.error("Failed to load report", err);
        setError(err.message || "Failed to load report.");
      } finally {
        setLoading(false);
      }
    };
    getReport();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-secondary border-outline-variant/30 mb-4"></div>
        <p className="text-sm font-mono text-on-surface-variant">Loading Venture Intelligence...</p>
      </div>
    );
  }

  if (error || !currentReport) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-surface p-6 text-center max-w-md mx-auto">
        <span className="material-symbols-outlined text-4xl text-error mb-4">warning</span>
        <h2 className="text-xl font-bold mb-2">Failed to Load Report</h2>
        <p className="text-sm text-on-surface-variant mb-6">{error || "Report not found."}</p>
        <Link
          href="/wizard"
          className="bg-primary text-on-primary px-6 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-all"
        >
          Start New Analysis
        </Link>
      </div>
    );
  }

  const { scores, facts, ruleOutcomes, consistency, recommendations, aiAnalysis, crossVerification } = currentReport;

  // Radar chart calculations: Map 5 dimensions to SVG points
  // Dimensions: Problem (0 deg), Customer (72 deg), Market (144 deg), Business Model (216 deg), Risk (288 deg)
  const getRadarPoints = () => {
    const center = 120;
    const rScale = 0.8; // Scale max radius (80px)
    const angles = [0, 72, 144, 216, 288];
    const values = [
      scores.problem.score,
      scores.customer.score,
      scores.market.score,
      scores.businessModel.score,
      100 - scores.risk.score, // Invert Risk so high score is "better"
    ];

    const points = angles.map((angle, i) => {
      const rad = (angle - 90) * (Math.PI / 180);
      const r = values[i] * rScale;
      const x = center + r * Math.cos(rad);
      const y = center + r * Math.sin(rad);
      return `${x},${y}`;
    });

    return points.join(" ");
  };

  // Download PDF simulation or JSON dump
  const handleExportPDF = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentReport, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `VentureLens_Report_${currentReport.projectId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex h-screen bg-surface text-on-surface selection:bg-secondary-container selection:text-on-secondary-container overflow-hidden">
      {/* SideNavBar */}
      <aside className="hidden md:flex flex-col h-full w-72 bg-surface border-r border-outline-variant/20 p-4 shrink-0 justify-between">
        <div>
          <div className="mb-8 px-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-2xl font-bold">lens</span>
            <div>
              <h1 className="font-bold text-lg text-on-surface">VentureLens AI</h1>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold">
                Venture Co-pilot
              </p>
            </div>
          </div>
          <div className="space-y-1 mb-auto">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 w-full px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-colors text-sm"
            >
              <span className="material-symbols-outlined text-lg">folder_open</span>
              <span>Projects</span>
            </Link>
            <button className="flex items-center gap-3 w-full px-3 py-2.5 bg-secondary-container text-on-secondary-container font-semibold rounded-lg text-sm text-left">
              <span className="material-symbols-outlined text-lg">analytics</span>
              <span>Reports</span>
            </button>
            <button
              onClick={() => handleComingSoon("Templates")}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-colors text-sm text-left"
            >
              <span className="material-symbols-outlined text-lg">dashboard_customize</span>
              <span>Templates</span>
            </button>
            <button
              onClick={() => handleComingSoon("Settings")}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-colors text-sm text-left"
            >
              <span className="material-symbols-outlined text-lg">settings</span>
              <span>Settings</span>
            </button>
          </div>
        </div>
        <div className="pt-4 border-t border-outline-variant/20 space-y-1">
          <button
            onClick={() => handleComingSoon("Support")}
            className="flex items-center gap-3 w-full px-3 py-2 text-on-surface-variant hover:text-on-surface text-xs font-semibold text-left"
          >
            <span className="material-symbols-outlined text-base">help</span>
            <span>Support</span>
          </button>
          <div className="flex items-center gap-3 px-3 py-4 mt-2">
            <div className="w-8 h-8 rounded-full border border-outline-variant/50 bg-secondary-container flex items-center justify-center font-bold text-secondary text-xs">
              VL
            </div>
            <div>
              <p className="font-semibold text-xs text-on-surface">VentureLens Guest</p>
              <p className="text-[10px] text-on-surface-variant">Beta Access</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 overflow-y-auto bg-surface">
        <div className="max-w-[1440px] mx-auto p-8 space-y-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-widest rounded border border-secondary/15">
                  Project ID: VL-{currentReport.projectId.substring(0, 6).toUpperCase()}
                </span>
                <span className="text-on-surface-variant text-xs">• Created on {new Date(currentReport.createdAt).toLocaleDateString()}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Venture Intelligence: {currentReport.answers.idea.substring(0, 32)}...
              </h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-sm text-on-surface hover:bg-surface-container-low transition-colors font-semibold"
              >
                <span className="material-symbols-outlined text-lg">share</span> Export Dataset
              </button>
              <button
                onClick={() => router.push("/wizard")}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg text-sm hover:opacity-90 transition-opacity font-semibold shadow-sm"
              >
                <span className="material-symbols-outlined text-lg">add</span> New Diligence
              </button>
            </div>
          </div>

          {/* Top Section: Venture Score Card & SVGs */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Overall Venture Score Card */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-outline-variant/30 shadow-sm relative overflow-hidden group">
              <h3 className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-6 font-semibold">
                Overall Venture Score
              </h3>
              <div className="flex flex-col items-center">
                <div className="relative w-44 h-44 mb-6">
                  {/* SVG Donut Chart */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="2.5"
                    ></path>
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#10b981"
                      strokeDasharray={`${scores.overallScore}, 100`}
                      strokeLinecap="round"
                      strokeWidth="2.5"
                    ></path>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold text-on-surface font-mono">
                      {scores.overallScore}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/5 px-2 py-0.5 rounded uppercase mt-1">
                      {scores.overallScore >= 80
                        ? "Strong Potential"
                        : scores.overallScore >= 60
                        ? "Moderate Potential"
                        : "High Risk"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-4 w-full justify-center text-xs">
                  <div className="text-center">
                    <p className="text-on-surface-variant mb-1 font-semibold">Confidence</p>
                    <p className="font-mono text-secondary font-bold">High</p>
                  </div>
                  <div className="w-px h-8 bg-outline-variant/30"></div>
                  <div className="text-center">
                    <p className="text-on-surface-variant mb-1 font-semibold">Decisions</p>
                    <p className="font-mono text-emerald-600 font-bold">Deterministic</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Radar Chart & Summary */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Radar Chart Card */}
              <div className="bg-white p-6 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
                <h3 className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-4 font-semibold">
                  Venture Health Radar
                </h3>
                <div className="w-full max-w-[200px] mx-auto aspect-square flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 240 240">
                    {/* Background Grids */}
                    <circle cx="120" cy="120" fill="none" r="80" stroke="#cbd5e1" strokeDasharray="4" strokeWidth="1" className="opacity-40"></circle>
                    <circle cx="120" cy="120" fill="none" r="60" stroke="#cbd5e1" strokeDasharray="4" strokeWidth="1" className="opacity-40"></circle>
                    <circle cx="120" cy="120" fill="none" r="40" stroke="#cbd5e1" strokeDasharray="4" strokeWidth="1" className="opacity-40"></circle>
                    
                    {/* Axis Lines */}
                    {[0, 72, 144, 216, 288].map((angle) => {
                      const rad = (angle - 90) * (Math.PI / 180);
                      return (
                        <line
                          key={angle}
                          stroke="#cbd5e1"
                          strokeWidth="1"
                          className="opacity-40"
                          x1="120"
                          y1="120"
                          x2={120 + 80 * Math.cos(rad)}
                          y2={120 + 80 * Math.sin(rad)}
                        />
                      );
                    })}

                    {/* Dynamic Radar Polygon */}
                    <polygon
                      fill="rgba(0, 88, 190, 0.15)"
                      stroke="#0058be"
                      strokeWidth="2"
                      points={getRadarPoints()}
                    />

                    {/* SVG Labels: problem (angle 0), customer (72), market (144), model (216), team risk (288) */}
                    {(() => {
                      const labels = ["Problem", "Customer", "Market", "Model", "Team Risk"];
                      return [0, 72, 144, 216, 288].map((angle, index) => {
                        const rad = (angle - 90) * (Math.PI / 180);
                        const r = 98; // radius for placing labels outside grid
                        const lx = 120 + r * Math.cos(rad);
                        const ly = 120 + r * Math.sin(rad) + 4; // +4 for visual center adjustment
                        
                        let anchor: "middle" | "start" | "end" = "middle";
                        if (index === 1 || index === 2) anchor = "start";
                        if (index === 3 || index === 4) anchor = "end";

                        return (
                          <text
                            key={angle}
                            x={lx}
                            y={ly}
                            textAnchor={anchor}
                            className="fill-on-surface-variant text-[10px] font-mono font-bold uppercase tracking-wider"
                          >
                            {labels[index]}
                          </text>
                        );
                      });
                    })()}
                  </svg>
                </div>
              </div>              {/* AI Executive Summary Card */}
              <div className="bg-white p-6 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
                <h3 className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-4 flex items-center gap-1.5 font-semibold">
                  <span className="material-symbols-outlined text-secondary text-base">auto_awesome</span>
                  AI Executive Summary
                </h3>
                <div className="space-y-4 flex-1">
                  <p className="text-sm text-on-surface leading-relaxed font-normal">
                    {aiAnalysis.executiveSummary}
                  </p>
                  <div className="pt-4 border-t border-outline-variant/20">
                    <div className="flex items-center justify-between mb-2 text-xs">
                      <span className="font-semibold text-on-surface-variant">AI Explanation Integrity</span>
                      <span className="font-mono text-emerald-600 font-bold">98.4%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[98.4%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* AI Cross-Verification Agreement Report Section */}
          <section className="bg-white rounded-xl border border-outline-variant/30 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-xl">verified_user</span>
              AI Cross-Verification Audit
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-surface p-4 rounded-lg text-center flex flex-col justify-center">
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                  Agreement Score
                </p>
                <div className="text-3xl font-extrabold font-mono text-secondary">
                  {crossVerification.agreementScore}%
                </div>
              </div>
              <div className="bg-surface p-4 rounded-lg text-center flex flex-col justify-center">
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                  Agreement Status
                </p>
                <span className="text-xs font-bold text-emerald-600 uppercase">
                  {crossVerification.agreementStatus}
                </span>
              </div>
              <div className="md:col-span-2 bg-surface p-4 rounded-lg">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                  Independent AI Strategic Verdict
                </p>
                <p className="text-xs text-on-surface leading-relaxed font-normal">
                  {crossVerification.aiStrategicVerdict}
                </p>
              </div>
            </div>
          </section>

          {/* Consistency Warning Card */}
          {consistency.status !== "CONSISTENT" && consistency.contradictions.length > 0 && (
            <section className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-6 shadow-sm">
              <div className="flex gap-4">
                <div className="bg-amber-100 text-amber-600 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl font-bold">warning</span>
                </div>
                <div className="space-y-4 flex-1">
                  <div>
                    <h3 className="text-amber-800 font-bold text-base">
                      Consistency Engine Flagged {consistency.contradictions.length} Claim Discrepancies
                    </h3>
                    <p className="text-amber-700 text-sm leading-relaxed mt-1">
                      User questionnaire statements contradict external research evidence gathered by Tavily.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {consistency.contradictions.map((c) => (
                      <div key={c.id} className="bg-white/60 p-4 rounded-lg border border-amber-200/50 space-y-2 text-xs">
                        <p className="font-bold text-amber-800 uppercase tracking-widest text-[9px]">
                          Contradiction: {c.claim}
                        </p>
                        <p className="text-on-surface font-semibold italic">"{c.claim}"</p>
                        <p className="text-error font-semibold">{c.evidence}</p>
                        <p className="text-on-surface-variant leading-relaxed mt-1 font-normal">
                          {c.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Sub-layout Tabs for detailed analyses */}
          <section className="space-y-6">
            <div className="flex border-b border-outline-variant/30">
              <button
                onClick={() => setActiveTab("summary")}
                className={`py-3 px-6 text-sm font-semibold transition-all ${
                  activeTab === "summary"
                    ? "border-b-2 border-secondary text-secondary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                SWOT & Deep Dive
              </button>
              <button
                onClick={() => setActiveTab("analysis")}
                className={`py-3 px-6 text-sm font-semibold transition-all ${
                  activeTab === "analysis"
                    ? "border-b-2 border-secondary text-secondary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                GTM & Strategy
              </button>
              <button
                onClick={() => setActiveTab("roadmap")}
                className={`py-3 px-6 text-sm font-semibold transition-all ${
                  activeTab === "roadmap"
                    ? "border-b-2 border-secondary text-secondary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                MVP Roadmap & Actions
              </button>
              <button
                onClick={() => setActiveTab("copy")}
                className={`py-3 px-6 text-sm font-semibold transition-all ${
                  activeTab === "copy"
                    ? "border-b-2 border-secondary text-secondary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Landing Page & Pitch
              </button>
            </div>

            <div className="bg-white border border-outline-variant/30 rounded-xl p-8 shadow-sm min-h-[300px]">
              {/* Tab 1: SWOT */}
              {activeTab === "summary" && (
                <div className="space-y-8">
                  <h3 className="text-xl font-bold">Venture SWOT Matrix</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-lg">
                      <h4 className="font-bold text-emerald-800 text-sm mb-3 uppercase tracking-wider">Strengths</h4>
                      <ul className="space-y-2 text-sm text-emerald-900 leading-relaxed font-normal">
                        {aiAnalysis.swot.strengths.map((s, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span>•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-50/50 border border-red-100 p-6 rounded-lg">
                      <h4 className="font-bold text-red-800 text-sm mb-3 uppercase tracking-wider">Weaknesses</h4>
                      <ul className="space-y-2 text-sm text-red-900 leading-relaxed font-normal">
                        {aiAnalysis.swot.weaknesses.map((w, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span>•</span>
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-lg">
                      <h4 className="font-bold text-blue-800 text-sm mb-3 uppercase tracking-wider">Opportunities</h4>
                      <ul className="space-y-2 text-sm text-blue-900 leading-relaxed font-normal">
                        {aiAnalysis.swot.opportunities.map((o, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span>•</span>
                            <span>{o}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-amber-50/50 border border-amber-100 p-6 rounded-lg">
                      <h4 className="font-bold text-amber-800 text-sm mb-3 uppercase tracking-wider">Threats</h4>
                      <ul className="space-y-2 text-sm text-amber-900 leading-relaxed font-normal">
                        {aiAnalysis.swot.threats.map((t, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span>•</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: GTM */}
              {activeTab === "analysis" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Go-To-Market Strategy</h3>
                  <div className="p-6 bg-surface rounded-lg border border-outline-variant/30 text-sm leading-relaxed font-normal whitespace-pre-wrap">
                    {aiAnalysis.gtmStrategy}
                  </div>
                  <h4 className="text-sm font-bold uppercase text-on-surface-variant mt-6">Target Beachhead Geography</h4>
                  <p className="text-sm font-semibold">{facts.market.geography}</p>
                </div>
              )}

              {/* Tab 3: MVP & Actions */}
              {activeTab === "roadmap" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-7 space-y-6">
                    <h3 className="text-xl font-bold">Technical MVP Scope</h3>
                    <div className="p-6 bg-surface rounded-lg border border-outline-variant/30 text-sm leading-relaxed font-normal whitespace-pre-wrap">
                      {aiAnalysis.mvpRoadmap}
                    </div>
                  </div>
                  <div className="lg:col-span-5 space-y-6">
                    <h3 className="text-xl font-bold">Recommendation Roadmap</h3>
                    <div className="space-y-6 overflow-y-auto max-h-[350px] pr-2">
                      {recommendations.map((rec) => (
                        <div key={rec.id} className="relative pl-8 pb-6 border-l-2 border-outline-variant last:pb-0 last:border-l-0">
                          <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm ${
                            rec.priority === "Critical" ? "bg-red-500" : rec.priority === "High" ? "bg-secondary" : "bg-amber-400"
                          }`}></div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded ${
                              rec.priority === "Critical" ? "bg-red-100 text-red-700" : rec.priority === "High" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                            }`}>
                              {rec.priority}
                            </span>
                            <span className="text-[10px] text-on-surface-variant font-semibold">{rec.timeframe}</span>
                          </div>
                          <h4 className="font-bold text-sm text-on-surface mb-1">{rec.title}</h4>
                          <p className="text-xs text-on-surface-variant leading-relaxed font-normal">{rec.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Copy */}
              {activeTab === "copy" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold">Elevator Pitch</h3>
                    <div className="p-6 bg-surface rounded-lg border border-outline-variant/30 text-sm leading-relaxed font-normal">
                      {aiAnalysis.elevatorPitch}
                    </div>
                    <h3 className="text-xl font-bold">Investor Pitch Narrative</h3>
                    <div className="p-6 bg-surface rounded-lg border border-outline-variant/30 text-sm leading-relaxed font-normal">
                      {aiAnalysis.investorNarrative}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold">Landing Page H1 / Copy Draft</h3>
                    <div className="p-6 bg-surface rounded-lg border border-outline-variant/30 space-y-4">
                      <div>
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">H1 Headline</span>
                        <p className="text-lg font-bold text-secondary">"{aiAnalysis.landingPageCopy.heroTitle}"</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Sub-headline</span>
                        <p className="text-sm font-normal text-on-surface leading-relaxed">"{aiAnalysis.landingPageCopy.heroSubtitle}"</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-2">Key Features</span>
                        <div className="space-y-2">
                          {aiAnalysis.landingPageCopy.features.map((f, idx) => (
                            <div key={idx} className="text-xs">
                              <span className="font-bold block text-on-surface">{f.title}</span>
                              <span className="text-on-surface-variant font-normal">{f.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">CTA Text</span>
                        <p className="text-xs font-semibold">{aiAnalysis.landingPageCopy.ctaText}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Footer Component */}
          <footer className="pt-12 pb-6">
            <div className="border-t border-outline-variant/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-base font-bold">VentureLens AI</span>
                <p className="text-xs text-on-surface-variant">© 2026 VentureLens AI. All rights reserved.</p>
              </div>
              <div className="flex gap-8 text-xs text-on-surface-variant font-semibold">
                <a className="hover:text-secondary transition-colors" href="#">Privacy Policy</a>
                <a className="hover:text-secondary transition-colors" href="#">Terms of Service</a>
                <a className="hover:text-secondary transition-colors" href="#">Security</a>
                <a className="hover:text-secondary transition-colors" href="#">Contact</a>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
