"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useVentureStore } from "@/stores/ventureStore";
import { toast } from "sonner";

export default function WizardPage() {
  const router = useRouter();
  const { answers, updateAnswer, setAnswers, startAnalysis } = useVentureStore();
  const [step, setStep] = useState(1); // 1: Idea, 2: Details, 3: Review, 4: Analyzing
  const [loadingStage, setLoadingStage] = useState(0);
  const [awaitingServer, setAwaitingServer] = useState(false);
  const [loadingText, setLoadingText] = useState("Initializing Decision Pipeline...");
  const analysisTriggered = useRef(false);

  // Idea extraction signals — generic, idea-content-aware
  const ideaWords = answers.idea.trim() ? answers.idea.trim().split(/\s+/).length : 0;
  const firstWords = answers.idea.trim().split(/\s+/).slice(0, 4).join(" ");

  const extractedProblem =
    ideaWords > 5
      ? `Core problem detected in: "${firstWords}..."`
      : "Start typing your idea to extract the problem statement...";

  const extractedCustomer =
    answers.targetCustomer.trim().length > 3
      ? `Target audience: ${answers.targetCustomer.slice(0, 60)}${answers.targetCustomer.length > 60 ? "..." : ""}`
      : ideaWords > 15
      ? "Customer segment being parsed from idea description..."
      : "Waiting for target customer details...";

  const extractedClarity =
    ideaWords > 25 ? 88
    : ideaWords > 15 ? 68
    : ideaWords > 5 ? 42
    : 18;

  // Loading animation stages — defined outside effect to avoid stale closure
  const pipelineStages = [
    "Structured Fact Extraction Engine running...",
    "Venture Knowledge Graph Builder mapping entities...",
    "Deterministic Rule Engine evaluating 16 logic checks...",
    "Heuristic Scoring Engine computing 10 dimensions...",
    "Evidence Engine compiling supporting references...",
    "Consistency Engine verifying claims vs external benchmarks...",
    "External Research Layer running Tavily search...",
    "AI Explanation Layer drafting SWOT and GTM roadmap...",
    "AI Strategic Review executing cross-verification...",
    "Assembling Unified Venture Intelligence Report...",
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 4) {
      if (loadingStage < pipelineStages.length) {
        timer = setTimeout(() => {
          setLoadingText(pipelineStages[loadingStage]);
          setLoadingStage((prev) => prev + 1);
        }, 1200);
      } else if (!analysisTriggered.current) {
        // All animation stages complete — trigger actual API call
        analysisTriggered.current = true;
        setAwaitingServer(true);
        setLoadingText("Awaiting server response — this may take up to 20 seconds...");

        const triggerAnalysis = async () => {
          try {
            console.log("[Wizard] Triggering VentureLens AI analysis...");
            const report = await startAnalysis(answers);
            localStorage.setItem("latest_venturelens_report", JSON.stringify(report));
            router.push(`/report/latest`);
          } catch (err: any) {
            console.error("Analysis failed:", err);
            toast.error("Analysis failed", {
              description: err?.message || "Please check your API keys and try again.",
              duration: 6000,
            });
            setStep(3);
            setLoadingStage(0);
            setAwaitingServer(false);
            analysisTriggered.current = false;
          }
        };
        triggerAnalysis();
      }
    }
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, loadingStage]);

  const handleNextStep = () => {
    if (step === 1) {
      if (!answers.idea.trim()) {
        toast.warning("Idea required", {
          description: "Please describe your startup idea before continuing.",
          duration: 3000,
        });
        return;
      }
      if (!answers.problemSolved) updateAnswer("problemSolved", answers.idea);
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleBackStep = () => {
    if (step > 1 && step < 4) {
      setStep(step - 1);
    }
  };

  return (
    <div className="flex h-screen w-full bg-surface text-on-surface font-sans overflow-hidden">
      {/* SideNavBar */}
      <aside className="hidden md:flex flex-col h-full p-4 border-r border-outline-variant/20 bg-surface w-72 shrink-0 justify-between">
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
          <button
            onClick={() => {
              setAnswers({
                idea: "",
                targetCustomer: "",
                problemSolved: "",
                existingAlternatives: "",
                geography: "",
                revenueModel: "SaaS",
                businessStage: "Idea",
                competitors: "",
                differentiation: "",
                currentValidation: "",
                teamBackground: "",
                pricingStrategy: "",
                distributionChannel: "",
              });
              setStep(1);
            }}
            className="mb-6 w-full py-3 px-4 bg-primary text-on-primary rounded-lg font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform text-sm shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span>New Analysis</span>
          </button>
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-2.5 text-on-surface-variant hover:bg-surface-container-high transition-colors text-sm rounded-lg"
            >
              <span className="material-symbols-outlined text-lg">folder_open</span>
              <span>Projects</span>
            </Link>
            <a
              className="flex items-center gap-3 px-4 py-2.5 text-on-surface-variant hover:bg-surface-container-high transition-colors text-sm rounded-lg"
              href="#"
            >
              <span className="material-symbols-outlined text-lg">analytics</span>
              <span>Reports</span>
            </a>
            <a
              className="flex items-center gap-3 px-4 py-2.5 text-on-surface-variant hover:bg-surface-container-high transition-colors text-sm rounded-lg"
              href="#"
            >
              <span className="material-symbols-outlined text-lg">dashboard_customize</span>
              <span>Templates</span>
            </a>
            <a
              className="flex items-center gap-3 px-4 py-2.5 text-on-surface-variant hover:bg-surface-container-high transition-colors text-sm rounded-lg"
              href="#"
            >
              <span className="material-symbols-outlined text-lg">settings</span>
              <span>Settings</span>
            </a>
          </nav>
        </div>
        <div className="pt-4 border-t border-outline-variant/10 space-y-1">
          <a
            className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-on-surface text-xs font-semibold"
            href="#"
          >
            <span className="material-symbols-outlined text-base">help</span>
            <span>Support</span>
          </a>
          <div className="flex items-center gap-3 px-4 py-4 mt-2">
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
      <main className="flex-1 flex flex-col min-w-0 bg-surface-container-low overflow-hidden">
        {/* Progress Stepper */}
        <header className="h-16 glass-panel border-b border-outline-variant/30 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-8 h-full">
            <div className={`flex items-center gap-2 h-full px-2 border-b-2 transition-all ${step === 1 ? "border-secondary text-secondary font-bold" : "border-transparent text-on-surface-variant/50"}`}>
              <span className="font-mono text-xs bg-secondary-container text-on-secondary-container w-6 h-6 rounded-full flex items-center justify-center">
                1
              </span>
              <span className="text-sm">Idea</span>
            </div>
            <div className={`flex items-center gap-2 h-full px-2 border-b-2 transition-all ${step === 2 ? "border-secondary text-secondary font-bold" : "border-transparent text-on-surface-variant/50"}`}>
              <span className="font-mono text-xs border border-outline-variant w-6 h-6 rounded-full flex items-center justify-center">
                2
              </span>
              <span className="text-sm">Business Details</span>
            </div>
            <div className={`flex items-center gap-2 h-full px-2 border-b-2 transition-all ${step === 3 ? "border-secondary text-secondary font-bold" : "border-transparent text-on-surface-variant/50"}`}>
              <span className="font-mono text-xs border border-outline-variant w-6 h-6 rounded-full flex items-center justify-center">
                3
              </span>
              <span className="text-sm">Review</span>
            </div>
            <div className={`flex items-center gap-2 h-full px-2 border-b-2 transition-all ${step === 4 ? "border-secondary text-secondary font-bold" : "border-transparent text-on-surface-variant/50"}`}>
              <span className="font-mono text-xs border border-outline-variant w-6 h-6 rounded-full flex items-center justify-center">
                4
              </span>
              <span className="text-sm">Analysis</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {step > 1 && step < 4 && (
              <button
                onClick={handleBackStep}
                className="px-4 py-2 text-on-surface-variant hover:text-on-surface transition-colors font-semibold text-sm border border-outline-variant/30 rounded-lg bg-white"
              >
                Back
              </button>
            )}
            {step < 4 && (
              <button
                onClick={handleNextStep}
                className="bg-primary text-on-primary px-6 py-2 rounded-lg font-semibold shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2 text-sm"
              >
                <span>{step === 3 ? "Analyze Startup" : "Next Step"}</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Workspace based on Step */}
        <div className="flex-1 flex overflow-hidden p-8 gap-8">
          {/* STEP 1: Idea Input Screen */}
          {step === 1 && (
            <div className="flex-1 flex flex-col md:flex-row gap-8 w-full max-w-7xl mx-auto overflow-y-auto pr-2">
              <div className="flex-1 flex flex-col gap-6 max-w-4xl">
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
                    Extract Your Vision
                  </h2>
                  <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
                    Describe your startup idea in plain language. Mention your product, target customer, geography, pricing model, and competitive edge. Our extraction engines will parse out the entities for validation.
                  </p>
                </div>
                <div className="flex-1 min-h-[300px] bg-white rounded-xl border border-outline-variant/30 shadow-sm flex flex-col focus-within:ring-2 ring-secondary/15 transition-all">
                  <div className="p-4 border-b border-outline-variant/20 flex items-center justify-between">
                    <div className="flex gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-400"></span>
                      <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                      <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-on-surface-variant">
                      IDEA_EXTRACTION_V1.0
                    </span>
                  </div>
                  <textarea
                    value={answers.idea}
                    onChange={(e) => updateAnswer("idea", e.target.value)}
                    className="flex-1 p-6 text-base text-on-surface bg-transparent resize-none border-none outline-none focus:ring-0 placeholder:text-on-surface-variant/40"
                    placeholder="Example: I am building a decentralized marketplace for surplus farm produce that connects small-scale organic farmers directly with local restaurants in metropolitan areas. Our goal is to reduce food waste and lower supply chain costs by 30% through predictive demand AI..."
                  />
                  <div className="p-4 bg-surface-container-low/50 flex justify-between items-center rounded-b-xl border-t border-outline-variant/10">
                    <div className="flex gap-4">
                      <button className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1 text-xs font-semibold">
                        <span className="material-symbols-outlined text-sm">attachment</span>
                        <span>Upload Deck</span>
                      </button>
                      <button className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1 text-xs font-semibold">
                        <span className="material-symbols-outlined text-sm">mic</span>
                        <span>Voice Note</span>
                      </button>
                    </div>
                    <span className="font-mono text-xs text-on-surface-variant">
                      {ideaWords} words
                    </span>
                  </div>
                </div>
              </div>

              {/* Side helper panel */}
              <aside className="w-full md:w-96 flex flex-col gap-6 shrink-0">
                <div className="bg-white border border-outline-variant/30 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-lg">auto_awesome</span>
                      AI Idea Helper
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                        Listening
                      </span>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {/* Problem */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                        <span>Core Problem</span>
                        <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${ideaWords > 5 ? "bg-secondary/10 text-secondary" : "bg-outline-variant/30 text-on-surface-variant/40"}`}>
                          {ideaWords > 5 ? "DETECTED" : "PENDING"}
                        </span>
                      </div>
                      <div className={`p-3 rounded-lg border text-xs leading-relaxed transition-all ${ideaWords > 5 ? "bg-white border-solid border-outline-variant text-on-surface" : "bg-surface border-dashed border-outline-variant/50 text-on-surface-variant/50"}`}>
                        {extractedProblem}
                      </div>
                    </div>
                    {/* Customer */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                        <span>Customer Segment</span>
                        <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${ideaWords > 15 ? "bg-emerald-500/10 text-emerald-500" : "bg-outline-variant/30 text-on-surface-variant/40"}`}>
                          {ideaWords > 15 ? "DETECTED" : "PENDING"}
                        </span>
                      </div>
                      <div className={`p-3 rounded-lg border text-xs leading-relaxed transition-all ${ideaWords > 15 ? "bg-white border-solid border-outline-variant text-on-surface" : "bg-surface border-dashed border-outline-variant/50 text-on-surface-variant/50"}`}>
                        {extractedCustomer}
                      </div>
                    </div>
                    {/* Industry */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">
                        Industry Verticals Mapped
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-0.5 bg-secondary-container text-secondary text-xs rounded font-mono font-semibold">
                          AgriTech
                        </span>
                        <span className="px-2 py-0.5 bg-secondary-container text-secondary text-xs rounded font-mono font-semibold">
                          Supply Chain
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Extraction Clarity */}
                  <div className="mt-8 pt-6 border-t border-outline-variant/30">
                    <div className="flex justify-between items-end mb-2 text-xs">
                      <span className="font-bold uppercase text-on-surface-variant">Extraction Clarity</span>
                      <span className="font-mono text-secondary font-semibold">{extractedClarity}%</span>
                    </div>
                    <div className="confidence-track">
                      <div
                        className="bg-secondary h-full transition-all duration-500"
                        style={{ width: `${extractedClarity}%` }}
                      ></div>
                    </div>
                    <p className="mt-3 text-[11px] text-on-surface-variant leading-relaxed">
                      Tip: Mentioning specific <span className="underline decoration-secondary/30 text-on-surface font-semibold">quantifiable metrics</span> increases analysis precision.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* STEP 2: Business Details Form */}
          {step === 2 && (
            <div className="flex-1 w-full max-w-5xl mx-auto overflow-y-auto pr-2 pb-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-on-surface">Start-up Heuristics Questionnaire</h2>
                <p className="text-sm text-on-surface-variant mt-1">
                  Provide detailed metrics to validate pricing, competitive positioning, and market moats.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Q1 */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Target Customer Profile (ICP)
                  </label>
                  <input
                    type="text"
                    value={answers.targetCustomer}
                    onChange={(e) => updateAnswer("targetCustomer", e.target.value)}
                    className="w-full p-3 bg-white border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-secondary/10 outline-none"
                    placeholder="e.g. Small-scale organic farmers & independent metropolitan restaurants"
                  />
                </div>
                {/* Q2 */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Core Problem Solved
                  </label>
                  <input
                    type="text"
                    value={answers.problemSolved}
                    onChange={(e) => updateAnswer("problemSolved", e.target.value)}
                    className="w-full p-3 bg-white border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-secondary/10 outline-none"
                    placeholder="e.g. High supply chain markup fees and produce spoilage in transit"
                  />
                </div>
                {/* Q3 */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Existing Workarounds / Alternatives
                  </label>
                  <input
                    type="text"
                    value={answers.existingAlternatives}
                    onChange={(e) => updateAnswer("existingAlternatives", e.target.value)}
                    className="w-full p-3 bg-white border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-secondary/10 outline-none"
                    placeholder="e.g. Traditional commercial wholesale distributors, manual spreadsheets"
                  />
                </div>
                {/* Q4 */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Target Market & Launch Geography
                  </label>
                  <input
                    type="text"
                    value={answers.geography}
                    onChange={(e) => updateAnswer("geography", e.target.value)}
                    className="w-full p-3 bg-white border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-secondary/10 outline-none"
                    placeholder="e.g. United States, Northeast Metro areas"
                  />
                </div>
                {/* Q5 */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Revenue Model
                  </label>
                  <select
                    value={answers.revenueModel}
                    onChange={(e) => updateAnswer("revenueModel", e.target.value)}
                    className="w-full p-3 bg-white border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-secondary/10 outline-none"
                  >
                    <option value="SaaS">SaaS (Software as a Service)</option>
                    <option value="Subscription">Recurring Subscription</option>
                    <option value="Marketplace">Marketplace (Commission / Take rate)</option>
                    <option value="Transaction">Transactional (One-time fee)</option>
                    <option value="Licensing">B2B IP Licensing</option>
                    <option value="Other">Other / Direct Sales</option>
                  </select>
                </div>
                {/* Q6 */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Pricing Strategy
                  </label>
                  <input
                    type="text"
                    value={answers.pricingStrategy}
                    onChange={(e) => updateAnswer("pricingStrategy", e.target.value)}
                    className="w-full p-3 bg-white border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-secondary/10 outline-none"
                    placeholder="e.g. 10% transactional commission fee per trade route"
                  />
                </div>
                {/* Q7 */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Main Competitors
                  </label>
                  <input
                    type="text"
                    value={answers.competitors}
                    onChange={(e) => updateAnswer("competitors", e.target.value)}
                    className="w-full p-3 bg-white border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-secondary/10 outline-none"
                    placeholder="e.g. GrubMarket, ProducePay, local wholesalers"
                  />
                </div>
                {/* Q8 */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Differentiation & Defensive Moat
                  </label>
                  <input
                    type="text"
                    value={answers.differentiation}
                    onChange={(e) => updateAnswer("differentiation", e.target.value)}
                    className="w-full p-3 bg-white border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-secondary/10 outline-none"
                    placeholder="e.g. Predictive demand AI matching tool preventing agricultural supply lag"
                  />
                </div>
                {/* Q9 */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Current Validation / Traction Metrics
                  </label>
                  <input
                    type="text"
                    value={answers.currentValidation}
                    onChange={(e) => updateAnswer("currentValidation", e.target.value)}
                    className="w-full p-3 bg-white border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-secondary/10 outline-none"
                    placeholder="e.g. 15 letters of intent signed with local restaurants; 4 pilot farms onboarded"
                  />
                </div>
                {/* Q10 */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Team Background & Expertise
                  </label>
                  <input
                    type="text"
                    value={answers.teamBackground}
                    onChange={(e) => updateAnswer("teamBackground", e.target.value)}
                    className="w-full p-3 bg-white border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-secondary/10 outline-none"
                    placeholder="e.g. CEO ran a local logistics group for 4 years; CTO holds MS in Supply Chain AI"
                  />
                </div>
                {/* Q11 */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Go-To-Market & Distribution Channel
                  </label>
                  <input
                    type="text"
                    value={answers.distributionChannel}
                    onChange={(e) => updateAnswer("distributionChannel", e.target.value)}
                    className="w-full p-3 bg-white border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-secondary/10 outline-none"
                    placeholder="e.g. Outbound sales targeting regional restaurants; digital farmer cooperatives partnerships"
                  />
                </div>
                {/* Q12 */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    TAM Estimate / Market Size
                  </label>
                  <input
                    type="text"
                    value={answers.tamEstimate}
                    onChange={(e) => updateAnswer("tamEstimate", e.target.value)}
                    className="w-full p-3 bg-white border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-secondary/10 outline-none"
                    placeholder="e.g. $14B US produce supply sector"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Review Stage */}
          {step === 3 && (
            <div className="flex-1 w-full max-w-4xl mx-auto overflow-y-auto pr-2 pb-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-on-surface">Confirm Venture Specifications</h2>
                <p className="text-sm text-on-surface-variant mt-1">
                  Ensure all parameters are accurate. This represents the source dataset analyzed by the rule engines.
                </p>
              </div>
              <div className="bg-white border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 bg-surface-container-low border-b border-outline-variant/20 flex justify-between items-center">
                  <span className="font-bold text-xs uppercase text-on-surface-variant">Venture Schema Data</span>
                  <span className="font-mono text-[10px] text-emerald-600 bg-emerald-500/5 px-2 py-0.5 rounded font-semibold border border-emerald-500/10">
                    STATUS: AUDIT_READY
                  </span>
                </div>
                <div className="p-6 divide-y divide-outline-variant/20 space-y-4">
                  {Object.entries(answers).map(([key, value]) => {
                    if (!value) return null;
                    // Format key label
                    const label = key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase());
                    return (
                      <div key={key} className="pt-4 first:pt-0 flex flex-col md:flex-row md:items-start gap-4">
                        <span className="font-semibold text-xs text-on-surface-variant uppercase md:w-64 shrink-0 pt-0.5">
                          {label}
                        </span>
                        <p className="text-sm text-on-surface font-normal leading-relaxed">{value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Analyzing Loading Screen */}
          {step === 4 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xl mx-auto">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-outline-variant/30"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-secondary animate-spin"></div>
              </div>
              <h3 className="text-xl font-bold mb-2">VentureLens Decision Pipeline Running</h3>
              <p className="text-on-surface-variant text-sm font-mono leading-relaxed h-12">
                {loadingText}
              </p>
              <div className="w-full bg-outline-variant/30 h-1.5 rounded-full overflow-hidden mt-6">
                <div
                  className="bg-secondary h-full transition-all duration-300"
                  style={{ width: `${(loadingStage / pipelineStages.length) * 100}%` }}
                ></div>
              </div>
              <span className="font-mono text-xs text-on-surface-variant mt-2">
                {Math.round((loadingStage / pipelineStages.length) * 100)}% Complete
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
