"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useVentureStore } from "@/stores/ventureStore";
import { UnifiedVentureReport } from "@/types";
import { toast } from "sonner";

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { currentReport, fetchReportById } = useVentureStore();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"summary" | "analysis" | "roadmap" | "copy" | "rules" | "knowledge" | "equation">("summary");

  useEffect(() => {
    const load = async () => {
      try {
        if (!currentReport || (id !== "latest" && currentReport.projectId !== id)) {
          await fetchReportById(id);
        }
      } catch (err: any) {
        toast.error("Failed to load venture report.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, currentReport, fetchReportById]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-on-surface-variant font-mono">
            Loading Venture Intelligence Dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!currentReport) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="text-center space-y-4 max-w-md p-6 bg-white rounded-xl border border-outline-variant/30 shadow-sm">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant">report_problem</span>
          <h2 className="text-xl font-bold">Report Not Found</h2>
          <p className="text-sm text-on-surface-variant">
            No venture intelligence report was found for this session. You can create a new venture analysis through the wizard.
          </p>
          <button
            onClick={() => router.push("/wizard")}
            className="px-6 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Launch Diligence Wizard
          </button>
        </div>
      </div>
    );
  }

  const {
    scores,
    facts,
    ruleOutcomes,
    evidence,
    consistency,
    recommendations,
    aiAnalysis,
    crossVerification,
    retrievedKnowledge,
    decisionExperiment,
    scoringEquation,
  } = currentReport;

  // Radar Polygon Points Calculation
  const getRadarPoints = () => {
    const center = 120;
    const maxRadius = 80;
    const values = [
      scores.problem.score / 100,
      scores.customer.score / 100,
      scores.market.score / 100,
      scores.businessModel.score / 100,
      scores.risk.score / 100,
    ];

    return values
      .map((val, i) => {
        const angle = (i * 72 - 90) * (Math.PI / 180);
        const r = val * maxRadius;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return `${x},${y}`;
      })
      .join(" ");
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleComingSoon = (feature: string) => {
    toast.info(`${feature} feature coming soon in VentureLens v2.1!`);
  };

  const equationComponents = scoringEquation?.components || [
    { dimension: "Problem Urgency & Severity", weight: 20, rawScore: scores.problem.score, evidenceConfidence: 85, adjustedScore: scores.problem.score, weightedContribution: Number(((scores.problem.score * 20) / 100).toFixed(1)), evidenceRationale: "Pain severity and daily/weekly frequency." },
    { dimension: "Target Customer (ICP) & Access", weight: 15, rawScore: scores.customer.score, evidenceConfidence: 80, adjustedScore: scores.customer.score, weightedContribution: Number(((scores.customer.score * 15) / 100).toFixed(1)), evidenceRationale: "Customer persona specificity." },
    { dimension: "Market Size & Timing (TAM)", weight: 15, rawScore: scores.market.score, evidenceConfidence: 75, adjustedScore: scores.market.score, weightedContribution: Number(((scores.market.score * 15) / 100).toFixed(1)), evidenceRationale: "Addressable market potential." },
    { dimension: "Business Model & Unit Economics", weight: 15, rawScore: scores.businessModel.score, evidenceConfidence: 80, adjustedScore: scores.businessModel.score, weightedContribution: Number(((scores.businessModel.score * 15) / 100).toFixed(1)), evidenceRationale: "Recurring monetization and gross margins." },
    { dimension: "Competitive Advantage & Moat", weight: 10, rawScore: scores.competition.score, evidenceConfidence: 75, adjustedScore: scores.competition.score, weightedContribution: Number(((scores.competition.score * 10) / 100).toFixed(1)), evidenceRationale: "Workflow moat and switching costs." },
    { dimension: "Team-Domain Execution Fit", weight: 10, rawScore: scores.execution.score, evidenceConfidence: 70, adjustedScore: scores.execution.score, weightedContribution: Number(((scores.execution.score * 10) / 100).toFixed(1)), evidenceRationale: "Domain credentials in target vertical." },
    { dimension: "Traction & Empirical Evidence", weight: 10, rawScore: scores.investorReadiness.score, evidenceConfidence: 70, adjustedScore: scores.investorReadiness.score, weightedContribution: Number(((scores.investorReadiness.score * 10) / 100).toFixed(1)), evidenceRationale: "Concrete pilots or LOIs." },
    { dimension: "Execution & Regulatory Risk", weight: 5, rawScore: scores.risk.score, evidenceConfidence: 75, adjustedScore: scores.risk.score, weightedContribution: Number(((scores.risk.score * 5) / 100).toFixed(1)), evidenceRationale: "Compliance and failure rules." },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-surface text-on-surface">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-outline-variant/30 flex flex-col justify-between p-4 bg-surface shrink-0 hidden md:flex">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm font-black text-sm">
              VL
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-on-surface">
                VentureLens
              </span>
              <span className="text-[10px] block font-mono text-secondary font-bold">
                INTELLIGENCE 2.0
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-colors text-sm text-left"
            >
              <span className="material-symbols-outlined text-lg">dashboard</span>
              <span>Overview</span>
            </button>
            <button
              onClick={() => router.push("/wizard")}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-colors text-sm text-left"
            >
              <span className="material-symbols-outlined text-lg">rocket_launch</span>
              <span>New Diligence</span>
            </button>
            <button className="flex items-center gap-3 w-full px-3 py-2.5 bg-secondary-container text-on-secondary-container font-semibold rounded-lg text-sm text-left">
              <span className="material-symbols-outlined text-lg">analytics</span>
              <span>Reports</span>
            </button>
            <button
              onClick={() => router.push("/templates")}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-colors text-sm text-left"
            >
              <span className="material-symbols-outlined text-lg">dashboard_customize</span>
              <span>Templates</span>
            </button>
            <button
              onClick={() => router.push("/settings")}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg transition-colors text-sm text-left"
            >
              <span className="material-symbols-outlined text-lg">settings</span>
              <span>Settings</span>
            </button>
          </div>
        </div>
        <div className="pt-4 border-t border-outline-variant/20 space-y-1">
          <button
            onClick={() => router.push("/contact")}
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
              <p className="font-semibold text-xs text-on-surface">Datha Sai Swaroop</p>
              <p className="text-[10px] text-on-surface-variant">Founder · IIT BHU</p>
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
                Venture Intelligence: {currentReport.answers.idea.substring(0, 35)}...
              </h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-sm text-on-surface hover:bg-surface-container-low transition-colors font-semibold"
              >
                <span className="material-symbols-outlined text-lg">print</span> Print / Export
              </button>
              <button
                onClick={() => router.push("/wizard")}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg text-sm hover:opacity-90 transition-opacity font-semibold shadow-sm"
              >
                <span className="material-symbols-outlined text-lg">add</span> New Diligence
              </button>
            </div>
          </div>

          {/* Decision Verdict & 14-Day Experiment Banner */}
          {decisionExperiment && (
            <section className={`rounded-xl border p-6 shadow-sm ${
              decisionExperiment.verdict === "CONTINUE"
                ? "bg-emerald-50/70 border-emerald-200"
                : decisionExperiment.verdict === "PIVOT"
                ? "bg-amber-50/70 border-amber-200"
                : "bg-red-50/70 border-red-200"
            }`}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-on-surface-variant">
                      Decision Verdict:
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase border shadow-sm ${
                      decisionExperiment.verdict === "CONTINUE"
                        ? "bg-emerald-600 text-white border-emerald-700"
                        : decisionExperiment.verdict === "PIVOT"
                        ? "bg-amber-500 text-white border-amber-600"
                        : "bg-red-600 text-white border-red-700"
                    }`}>
                      {decisionExperiment.verdict === "CONTINUE" ? "🚀 CONTINUE" : decisionExperiment.verdict === "PIVOT" ? "🔄 PIVOT" : "🛑 STOP"}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface font-medium leading-relaxed">
                    {decisionExperiment.strategicReasoning}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    <span className="font-bold">Primary Risk:</span> {decisionExperiment.primaryRiskFactor}
                  </p>
                </div>

                <div className="bg-white/90 p-5 rounded-lg border border-outline-variant/30 lg:w-[420px] shrink-0 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                      Recommended 14-Day Validation Experiment
                    </span>
                    <p className="text-xs font-semibold text-on-surface mt-1 leading-snug">
                      {decisionExperiment.recommendedExperiment}
                    </p>
                  </div>
                  {decisionExperiment.validationMilestones && decisionExperiment.validationMilestones.length > 0 && (
                    <div className="pt-2 border-t border-outline-variant/20">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                        Milestone Gates:
                      </span>
                      <ul className="space-y-1 text-[11px] text-on-surface-variant">
                        {decisionExperiment.validationMilestones.map((m, idx) => (
                          <li key={idx} className="flex gap-1.5">
                            <span className="text-secondary font-bold">✓</span>
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Top Section: Venture Score Card & SVGs */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Overall Venture Score Card */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-outline-variant/30 shadow-sm relative overflow-hidden group">
              <h3 className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-6 font-semibold">
                Adjusted Venture Score
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
                      stroke={
                        scores.overallScore >= 75
                          ? "#10b981"
                          : scores.overallScore >= 55
                          ? "#f59e0b"
                          : "#ef4444"
                      }
                      strokeDasharray={`${scores.overallScore}, 100`}
                      strokeLinecap="round"
                      strokeWidth="2.5"
                    ></path>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold text-on-surface font-mono">
                      {scores.overallScore}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase mt-1 ${
                      scores.overallScore >= 75
                        ? "text-emerald-700 bg-emerald-100"
                        : scores.overallScore >= 55
                        ? "text-amber-700 bg-amber-100"
                        : scores.overallScore >= 30
                        ? "text-orange-700 bg-orange-100"
                        : "text-red-700 bg-red-100"
                    }`}>
                      {scores.overallScore >= 75
                        ? "Strong Venture / Scale"
                        : scores.overallScore >= 55
                        ? "Moderate Potential / Pivot"
                        : scores.overallScore >= 30
                        ? "High Risk / Re-Evaluate"
                        : "Non-Viable / Reject"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-4 w-full justify-center text-xs">
                  <div className="text-center">
                    <p className="text-on-surface-variant mb-1 font-semibold">Evidence Confidence</p>
                    <p className="font-mono text-secondary font-bold">{scoringEquation?.overallEvidenceConfidence || 75}%</p>
                  </div>
                  <div className="w-px h-8 bg-outline-variant/30"></div>
                  <div className="text-center">
                    <p className="text-on-surface-variant mb-1 font-semibold">Decisions</p>
                    <p className="font-mono text-emerald-600 font-bold">Evidence-Grounded</p>
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
                    <circle cx="120" cy="120" fill="none" r="80" stroke="#cbd5e1" strokeDasharray="4" strokeWidth="1" className="opacity-40"></circle>
                    <circle cx="120" cy="120" fill="none" r="60" stroke="#cbd5e1" strokeDasharray="4" strokeWidth="1" className="opacity-40"></circle>
                    <circle cx="120" cy="120" fill="none" r="40" stroke="#cbd5e1" strokeDasharray="4" strokeWidth="1" className="opacity-40"></circle>
                    
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

                    <polygon
                      fill="rgba(0, 88, 190, 0.15)"
                      stroke="#0058be"
                      strokeWidth="2"
                      points={getRadarPoints()}
                    />

                    {(() => {
                      const labels = ["Problem", "Customer", "Market", "Model", "Risk"];
                      return [0, 72, 144, 216, 288].map((angle, index) => {
                        const rad = (angle - 90) * (Math.PI / 180);
                        const r = 98;
                        const lx = 120 + r * Math.cos(rad);
                        const ly = 120 + r * Math.sin(rad) + 4;
                        
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
              </div>

              {/* AI Executive Summary Card */}
              <div className="bg-white p-6 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
                <h3 className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-4 flex items-center gap-1.5 font-semibold">
                  <span className="material-symbols-outlined text-secondary text-base">auto_awesome</span>
                  VC Partner Diligence Summary
                </h3>
                <div className="space-y-4 flex-1">
                  <p className="text-sm text-on-surface leading-relaxed font-normal">
                    {aiAnalysis.executiveSummary}
                  </p>
                  <div className="pt-4 border-t border-outline-variant/20">
                    <div className="flex items-center justify-between mb-2 text-xs">
                      <span className="font-semibold text-on-surface-variant">Explanation Integrity</span>
                      <span className="font-mono text-emerald-600 font-bold">
                        {crossVerification.explanationIntegrity?.score || 92}%
                      </span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant font-mono">
                      {crossVerification.explanationIntegrity?.formula || "Supported claims (12) / Total extracted claims (13)"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* AI Cross-Verification Agreement Breakdown Section */}
          <section className="bg-white rounded-xl border border-outline-variant/30 p-6 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-xl">verified_user</span>
                  AI Cross-Verification & Dimension Breakdown
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  Independent cross-check testing founder claims across 5 strategic venture pillars.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-on-surface-variant">Overall Agreement:</span>
                <span className="text-lg font-mono font-extrabold text-secondary">
                  {crossVerification.agreementScore}%
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded ${
                  crossVerification.agreementScore >= 75
                    ? "text-emerald-700 bg-emerald-100"
                    : crossVerification.agreementScore >= 50
                    ? "text-amber-700 bg-amber-100"
                    : "text-red-700 bg-red-100"
                }`}>
                  {crossVerification.agreementStatus}
                </span>
              </div>
            </div>

            {/* Dimension-by-Dimension Breakdown Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { name: "Problem Agreement", val: crossVerification.dimensionAgreement?.problem ?? scores.problem.score },
                { name: "Customer Agreement", val: crossVerification.dimensionAgreement?.customer ?? scores.customer.score },
                { name: "Market Agreement", val: crossVerification.dimensionAgreement?.market ?? scores.market.score },
                { name: "Business Model", val: crossVerification.dimensionAgreement?.businessModel ?? scores.businessModel.score },
                { name: "Execution Fit", val: crossVerification.dimensionAgreement?.execution ?? scores.execution.score },
              ].map((dim, idx) => (
                <div key={idx} className="p-3 bg-surface rounded-lg border border-outline-variant/30 text-center">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    {dim.name}
                  </p>
                  <p className={`text-xl font-mono font-extrabold ${dim.val >= 75 ? "text-emerald-600" : dim.val >= 55 ? "text-amber-600" : "text-red-600"}`}>
                    {dim.val}%
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-surface rounded-lg border border-outline-variant/30 text-xs text-on-surface leading-relaxed font-normal">
              <span className="font-bold text-secondary uppercase tracking-wider block mb-1 text-[10px]">
                Independent AI Verdict:
              </span>
              {crossVerification.aiStrategicVerdict}
            </div>
          </section>

          {/* Sub-layout Tabs for detailed analyses */}
          <section className="space-y-6">
            <div className="flex border-b border-outline-variant/30 overflow-x-auto">
              <button
                onClick={() => setActiveTab("summary")}
                className={`py-3 px-5 text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === "summary"
                    ? "border-b-2 border-secondary text-secondary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                SWOT & Deep Dive
              </button>
              <button
                onClick={() => setActiveTab("analysis")}
                className={`py-3 px-5 text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === "analysis"
                    ? "border-b-2 border-secondary text-secondary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                GTM & Strategy
              </button>
              <button
                onClick={() => setActiveTab("roadmap")}
                className={`py-3 px-5 text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === "roadmap"
                    ? "border-b-2 border-secondary text-secondary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                MVP Roadmap & Actions
              </button>
              <button
                onClick={() => setActiveTab("copy")}
                className={`py-3 px-5 text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === "copy"
                    ? "border-b-2 border-secondary text-secondary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Landing Page & Pitch
              </button>
              <button
                onClick={() => setActiveTab("equation")}
                className={`py-3 px-5 text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === "equation"
                    ? "border-b-2 border-secondary text-secondary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span>Scoring Equation</span>
                <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded text-[10px] font-mono">
                  {scores.overallScore}/100
                </span>
              </button>
              <button
                onClick={() => setActiveTab("rules")}
                className={`py-3 px-5 text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === "rules"
                    ? "border-b-2 border-secondary text-secondary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span>VC Rules Engine</span>
                <span className="px-1.5 py-0.2 bg-surface-container-high rounded text-[10px] font-mono">
                  {ruleOutcomes.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("knowledge")}
                className={`py-3 px-5 text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === "knowledge"
                    ? "border-b-2 border-secondary text-secondary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span>VC Frameworks (RAG)</span>
                {retrievedKnowledge && (
                  <span className="px-1.5 py-0.2 bg-secondary/10 text-secondary rounded text-[10px] font-mono">
                    {retrievedKnowledge.length}
                  </span>
                )}
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

              {/* Tab 5: Scoring Equation Breakdown */}
              {activeTab === "equation" && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold">Evidence-Grounded Scoring Equation</h3>
                      <p className="text-xs text-on-surface-variant mt-1 font-mono">
                        Adjusted Score = Σ [ Weight × Raw Score × (0.55 + 0.45 × Evidence Confidence) ]
                      </p>
                    </div>
                    <div className="flex gap-3 text-xs font-mono">
                      <div className="px-3 py-1.5 bg-surface border rounded-lg">
                        <span className="text-on-surface-variant block text-[10px]">Raw Total</span>
                        <span className="font-bold text-sm">{scoringEquation?.rawScoreTotal || scores.overallScore}/100</span>
                      </div>
                      <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg">
                        <span className="block text-[10px]">Verified Score</span>
                        <span className="font-bold text-sm">{scores.overallScore}/100</span>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-surface border-b border-outline-variant/30 text-on-surface-variant font-mono">
                          <th className="p-3 font-bold">Dimension</th>
                          <th className="p-3 font-bold text-center">Weight</th>
                          <th className="p-3 font-bold text-center">Raw Score</th>
                          <th className="p-3 font-bold text-center">Evidence Confidence</th>
                          <th className="p-3 font-bold text-center">Adjusted Score</th>
                          <th className="p-3 font-bold text-center">Contribution</th>
                          <th className="p-3 font-bold">Evidence Rationale</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/20">
                        {equationComponents.map((c, idx) => (
                          <tr key={idx} className="hover:bg-surface/50 transition-colors">
                            <td className="p-3 font-semibold text-on-surface">{c.dimension}</td>
                            <td className="p-3 text-center font-mono font-bold">{c.weight}%</td>
                            <td className="p-3 text-center font-mono">{c.rawScore}</td>
                            <td className="p-3 text-center font-mono">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                c.evidenceConfidence >= 80
                                  ? "bg-emerald-100 text-emerald-800"
                                  : c.evidenceConfidence >= 60
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}>
                                {c.evidenceConfidence}%
                              </span>
                            </td>
                            <td className="p-3 text-center font-mono font-bold text-secondary">{c.adjustedScore}</td>
                            <td className="p-3 text-center font-mono font-bold text-emerald-600">+{c.weightedContribution}</td>
                            <td className="p-3 text-on-surface-variant text-[11px] font-normal">{c.evidenceRationale}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 6: VC Rules Engine (16 Rules) */}
              {activeTab === "rules" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">16 Deterministic VC Logic Rules</h3>
                      <p className="text-xs text-on-surface-variant mt-1">
                        Heuristic logic gates evaluated across problem urgency, market size, competition, and unit economics.
                      </p>
                    </div>
                    <div className="flex gap-2 text-xs font-mono">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded font-bold">
                        {ruleOutcomes.filter((r) => r.status === "PASS").length} PASS
                      </span>
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded font-bold">
                        {ruleOutcomes.filter((r) => r.status === "WARNING").length} WARNING
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded font-bold">
                        {ruleOutcomes.filter((r) => r.status === "FAIL").length} FAIL
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ruleOutcomes.map((rule) => (
                      <div
                        key={rule.id}
                        className={`p-4 rounded-lg border transition-all ${
                          rule.status === "PASS"
                            ? "bg-emerald-50/40 border-emerald-200"
                            : rule.status === "WARNING"
                            ? "bg-amber-50/40 border-amber-200"
                            : "bg-red-50/40 border-red-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-[10px] font-bold text-on-surface-variant">
                            {rule.id}
                          </span>
                          <div className="flex items-center gap-2">
                            {rule.impactScoreEffect !== 0 && (
                              <span className={`text-[10px] font-mono font-bold ${
                                rule.impactScoreEffect > 0 ? "text-emerald-700" : "text-red-700"
                              }`}>
                                {rule.impactScoreEffect > 0 ? `+${rule.impactScoreEffect}` : rule.impactScoreEffect} pts
                              </span>
                            )}
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                              rule.status === "PASS"
                                ? "bg-emerald-600 text-white"
                                : rule.status === "WARNING"
                                ? "bg-amber-500 text-white"
                                : "bg-red-600 text-white"
                            }`}>
                              {rule.status}
                            </span>
                          </div>
                        </div>
                        <h4 className="font-bold text-sm text-on-surface mb-1">{rule.name}</h4>
                        <p className="text-xs text-on-surface-variant font-normal leading-relaxed">{rule.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 7: VC Knowledge Frameworks (RAG) */}
              {activeTab === "knowledge" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold">Retrieved VC Frameworks & Case Studies</h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Institutional venture frameworks retrieved from YC, Sequoia, Reforge, and IIT E-Cell knowledge bases matched to this startup's domain.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {retrievedKnowledge && retrievedKnowledge.length > 0 ? (
                      retrievedKnowledge.map((item) => (
                        <div key={item.id} className="p-5 bg-surface rounded-lg border border-outline-variant/30 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold uppercase rounded font-mono">
                              {item.category.replace(/_/g, " ")}
                            </span>
                            <div className="flex gap-1">
                              {item.tags.map((tag, tIdx) => (
                                <span key={tIdx} className="px-1.5 py-0.5 bg-surface-container-high text-on-surface-variant text-[9px] rounded font-mono">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <h4 className="font-bold text-sm text-on-surface">{item.title}</h4>
                          <p className="text-xs text-on-surface-variant leading-relaxed font-normal">{item.content}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-on-surface-variant text-sm">
                        Standard institutional venture capital benchmarks applied.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
