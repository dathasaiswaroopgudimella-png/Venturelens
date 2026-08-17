"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useVentureStore } from "@/stores/ventureStore";
import { toast } from "sonner";
import { QuestionnaireAnswers } from "@/types";

export default function WizardPage() {
  const router = useRouter();
  const { answers, updateAnswer, setAnswers, startAnalysis } = useVentureStore();
  const [step, setStep] = useState(1); // 1: Idea, 2: Details, 3: Review, 4: Analyzing
  const [loadingStage, setLoadingStage] = useState(0);
  const [awaitingServer, setAwaitingServer] = useState(false);
  const [loadingText, setLoadingText] = useState("Initializing Decision Pipeline...");
  const analysisTriggered = useRef(false);

  // File Upload state
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isParsingDoc, setIsParsingDoc] = useState(false);

  // Voice Recording state
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [isFormattingVoice, setIsFormattingVoice] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Idea extraction signals
  const ideaWords = answers.idea.trim() ? answers.idea.trim().split(/\s+/).length : 0;
  const firstWords = answers.idea.trim().split(/\s+/).slice(0, 4).join(" ");

  const extractedProblem =
    ideaWords > 5
      ? `Core problem detected in: "${firstWords}..."`
      : "Start typing your idea or upload a pitch deck to parse the problem statement...";

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

  // Pipeline loading animation stages
  const pipelineStages = [
    "Structured Fact Extraction Engine running...",
    "Venture Knowledge Graph Builder mapping entities...",
    "Deterministic Rule Engine evaluating 16 logic checks...",
    "Heuristic Scoring Engine computing 10 dimensions...",
    "Evidence Engine compiling supporting references...",
    "Consistency Engine verifying claims vs external benchmarks...",
    "OpenRouter Market Research Intelligence running...",
    "AI Explanation Layer drafting SWOT and GTM roadmap...",
    "AI Strategic Review executing cross-verification...",
    "Assembling Unified Venture Intelligence Report...",
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 4 && !analysisTriggered.current) {
      analysisTriggered.current = true;
      setLoadingStage(0);
      setLoadingText(pipelineStages[0]);

      // Smooth fast progress animation while server is processing
      interval = setInterval(() => {
        setLoadingStage((prev) => {
          const next = prev + 1;
          if (next < pipelineStages.length) {
            setLoadingText(pipelineStages[next]);
            return next;
          }
          return prev;
        });
      }, 400);

      const triggerAnalysis = async () => {
        try {
          console.log("[Wizard] Triggering fast VentureLens AI analysis...");
          const report = await startAnalysis(answers);
          clearInterval(interval);
          setLoadingStage(pipelineStages.length);
          setLoadingText("Report Complete! Generating intelligence dashboard...");

          if (typeof window !== "undefined") {
            localStorage.setItem("latest_venturelens_report", JSON.stringify(report));
            localStorage.setItem(`venturelens_report_${report.projectId}`, JSON.stringify(report));
          }
          router.push(`/report/${report.projectId}`);
        } catch (err: any) {
          clearInterval(interval);
          console.error("Analysis failed:", err);
          toast.error("Analysis failed", {
            description: err?.message || "Please check your API configuration and try again.",
            duration: 6000,
          });
          setStep(3);
          setLoadingStage(0);
          analysisTriggered.current = false;
        }
      };

      triggerAnalysis();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // AI Document Upload & Parse Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingDoc(true);
    const toastId = toast.loading(`Parsing "${file.name}" with AI...`, {
      description: "Extracting pitch deck heuristics and business model details.",
    });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/parse-document", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to parse document");
      }

      const data = await res.json();
      const extracted: Partial<QuestionnaireAnswers> = data.answers || {};

      // Populate all extracted fields into store in a single atomic update
      setAnswers({
        ...answers,
        ...extracted,
      });

      toast.success("Pitch Deck Parsed with AI!", {
        id: toastId,
        description: `Extracted ${data.extractedWords} words & populated business parameters.`,
        duration: 5000,
      });
    } catch (err: any) {
      console.error("Document parsing error:", err);
      toast.error("Document upload failed", {
        id: toastId,
        description: err?.message || "Could not extract readable text from file.",
      });
    } finally {
      setIsParsingDoc(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Voice Input Speech & Audio MediaRecorder Handlers
  const startVoiceRecording = async () => {
    setVoiceModalOpen(true);
    setIsVoiceRecording(true);

    // 1. Try HTML5 MediaRecorder for audio recording
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        audioChunksRef.current = [];

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        mediaRecorder.start(250);
        mediaRecorderRef.current = mediaRecorder;
      }
    } catch (err: any) {
      console.warn("MediaRecorder mic access warning:", err);
    }

    // 2. Try Web Speech API for real-time live preview text
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let text = "";
          for (let i = 0; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
          }
          if (text.trim()) {
            setVoiceTranscript(text);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn("SpeechRecognition init warning:", err);
      }
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.requestData();
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsVoiceRecording(false);
  };

  const handleFormatVoiceWithAI = async () => {
    stopVoiceRecording();
    setIsFormattingVoice(true);
    const toastId = toast.loading("Structuring Voice Pitch with AI...", {
      description: "Removing filler words and extracting business heuristics.",
    });

    try {
      let audioBase64 = "";
      if (audioChunksRef.current.length > 0) {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        audioBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            resolve(result ? result.split(",")[1] : "");
          };
          reader.readAsDataURL(audioBlob);
        });
      }

      const res = await fetch("/api/format-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: voiceTranscript,
          audioBase64,
          mimeType: "audio/webm",
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to format voice input");
      }

      const data = await res.json();
      if (data.formattedPitch) {
        updateAnswer("idea", data.formattedPitch);
      }

      if (data.answers) {
        Object.entries(data.answers).forEach(([key, val]) => {
          if (key !== "formattedPitch" && val && typeof val === "string") {
            updateAnswer(key as keyof QuestionnaireAnswers, val as string);
          }
        });
      }

      toast.success("Voice Pitch Structured!", {
        id: toastId,
        description: "Formatted speech and updated wizard parameters.",
        duration: 4000,
      });

      setVoiceModalOpen(false);
      setVoiceTranscript("");
    } catch (err: any) {
      console.error("Format voice error:", err);
      if (voiceTranscript.trim()) {
        updateAnswer("idea", voiceTranscript);
        toast.info("Voice transcript added to idea box", { id: toastId });
      } else {
        toast.error("Voice input error", {
          id: toastId,
          description: err?.message || "Please speak clearly or type your idea.",
        });
      }
      setVoiceModalOpen(false);
    } finally {
      setIsFormattingVoice(false);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!answers.idea.trim()) {
        toast.warning("Idea required", {
          description: "Please describe your startup idea or upload a pitch deck before continuing.",
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
      {/* Hidden File Input for Deck / Document Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.pptx,.ppt,.docx,.doc,.txt,.md,.json,.csv"
        className="hidden"
      />

      {/* Voice Recording Modal */}
      {voiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-outline-variant/30 max-w-lg w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isVoiceRecording ? "bg-red-500 animate-ping" : "bg-yellow-500"}`}></div>
                <h3 className="font-bold text-base text-on-surface">Voice Pitch Detector</h3>
              </div>
              <button
                onClick={() => {
                  stopVoiceRecording();
                  setVoiceModalOpen(false);
                }}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Visualizer Orb */}
            <div className="flex flex-col items-center justify-center py-6 bg-surface-container-low/60 rounded-xl border border-outline-variant/20 relative overflow-hidden">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                isVoiceRecording ? "bg-red-500/15 border-2 border-red-500 text-red-600 scale-110 shadow-lg shadow-red-500/20" : "bg-secondary/10 border-2 border-secondary text-secondary"
              }`}>
                <span className="material-symbols-outlined text-4xl">
                  {isVoiceRecording ? "mic" : "mic_off"}
                </span>
              </div>
              <p className="text-xs font-semibold mt-4 text-on-surface">
                {isVoiceRecording ? "Listening... Speak your startup vision clearly" : "Recording Paused"}
              </p>
              {isVoiceRecording && (
                <div className="flex gap-1.5 mt-3">
                  <span className="w-1.5 h-6 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-8 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-10 bg-red-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-8 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-6 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                </div>
              )}
            </div>

            {/* Live Transcript Box */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Live Speech Transcript
              </label>
              <textarea
                value={voiceTranscript}
                onChange={(e) => setVoiceTranscript(e.target.value)}
                placeholder="Spoken words will appear here in real time..."
                className="w-full h-32 p-3 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm text-on-surface outline-none resize-none focus:ring-1 focus:ring-secondary/30"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-2">
                {isVoiceRecording ? (
                  <button
                    onClick={stopVoiceRecording}
                    className="px-3 py-1.5 bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20 text-xs font-semibold rounded-lg border border-yellow-500/20 flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">pause</span>
                    <span>Pause</span>
                  </button>
                ) : (
                  <button
                    onClick={startVoiceRecording}
                    className="px-3 py-1.5 bg-secondary-container text-secondary hover:bg-secondary-container/80 text-xs font-semibold rounded-lg flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">play_arrow</span>
                    <span>Resume</span>
                  </button>
                )}
                <button
                  onClick={() => setVoiceTranscript("")}
                  className="px-3 py-1.5 text-on-surface-variant hover:text-on-surface text-xs font-semibold"
                >
                  Clear
                </button>
              </div>

              <button
                onClick={handleFormatVoiceWithAI}
                disabled={isFormattingVoice || !voiceTranscript.trim()}
                className="px-5 py-2 bg-primary text-on-primary font-semibold text-xs rounded-lg shadow-sm hover:opacity-90 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {isFormattingVoice ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Structuring AI Pitch...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    <span>Format & Inject with AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
                tamEstimate: "",
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
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-2.5 text-on-surface-variant hover:bg-surface-container-high transition-colors text-sm rounded-lg"
            >
              <span className="material-symbols-outlined text-lg">analytics</span>
              <span>Reports</span>
            </Link>
            <Link
              href="/templates"
              className="flex items-center gap-3 px-4 py-2.5 text-on-surface-variant hover:bg-surface-container-high transition-colors text-sm rounded-lg"
            >
              <span className="material-symbols-outlined text-lg">dashboard_customize</span>
              <span>Templates</span>
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-2.5 text-on-surface-variant hover:bg-surface-container-high transition-colors text-sm rounded-lg"
            >
              <span className="material-symbols-outlined text-lg">settings</span>
              <span>Settings</span>
            </Link>
          </nav>
        </div>
        <div className="pt-4 border-t border-outline-variant/10 space-y-1">
          <Link
            className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-on-surface text-xs font-semibold"
            href="/contact"
          >
            <span className="material-symbols-outlined text-base">help</span>
            <span>Support</span>
          </Link>
          <div className="flex items-center gap-3 px-4 py-4 mt-2">
            <div className="w-8 h-8 rounded-full border border-outline-variant/50 bg-secondary-container flex items-center justify-center font-bold text-secondary text-xs">
              VL
            </div>
            <div>
              <p className="font-semibold text-xs text-on-surface">VentureLens User</p>
              <p className="text-[10px] text-on-surface-variant">Beta Access</p>
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
              <span className="text-sm">Idea & Deck</span>
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
          {/* STEP 1: Idea Input & Deck Upload Screen */}
          {step === 1 && (
            <div className="flex-1 flex flex-col md:flex-row gap-8 w-full max-w-7xl mx-auto overflow-y-auto pr-2">
              <div className="flex-1 flex flex-col gap-6 max-w-4xl">
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
                    Extract Your Vision
                  </h2>
                  <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
                    Describe your startup idea in plain language, record a voice pitch, or upload your pitch deck (PDF, Word, TXT). Our AI extraction engine will automatically parse out all venture parameters.
                  </p>
                </div>
                <div className="flex-1 min-h-[320px] bg-white rounded-xl border border-outline-variant/30 shadow-sm flex flex-col focus-within:ring-2 ring-secondary/15 transition-all">
                  <div className="p-4 border-b border-outline-variant/20 flex items-center justify-between">
                    <div className="flex gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-400"></span>
                      <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                      <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-on-surface-variant">
                      AI_EXTRACTION_ENGINE_V2.0
                    </span>
                  </div>
                  <textarea
                    value={answers.idea}
                    onChange={(e) => updateAnswer("idea", e.target.value)}
                    className="flex-1 p-6 text-base text-on-surface bg-transparent resize-none border-none outline-none focus:ring-0 placeholder:text-on-surface-variant/40"
                    placeholder="Describe your startup concept here, or click 'Upload Pitch Deck' / 'Voice Note' below to auto-populate all business heuristics..."
                  />
                  <div className="p-4 bg-surface-container-low/50 flex justify-between items-center rounded-b-xl border-t border-outline-variant/10">
                    <div className="flex gap-4 items-center">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isParsingDoc}
                        className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-outline-variant/30 shadow-sm hover:border-secondary/50"
                      >
                        {isParsingDoc ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin"></span>
                            <span>Parsing Deck...</span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-sm text-secondary">upload_file</span>
                            <span>Upload Pitch Deck (PDF/DOCX/TXT)</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={startVoiceRecording}
                        className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-outline-variant/30 shadow-sm hover:border-secondary/50"
                      >
                        <span className="material-symbols-outlined text-sm text-red-500">mic</span>
                        <span>Voice Pitch Note</span>
                      </button>
                    </div>
                    <span className="font-mono text-xs text-on-surface-variant font-medium">
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
                      AI Extraction Signals
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                        Active
                      </span>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {/* Problem */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                        <span>Core Problem</span>
                        <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${ideaWords > 5 ? "bg-secondary/10 text-secondary" : "bg-outline-variant/30 text-on-surface-variant/40"}`}>
                          {ideaWords > 5 ? "PARSED" : "PENDING"}
                        </span>
                      </div>
                      <div className={`p-3 rounded-lg border text-xs leading-relaxed transition-all ${ideaWords > 5 ? "bg-white border-solid border-outline-variant text-on-surface" : "bg-surface border-dashed border-outline-variant/50 text-on-surface-variant/50"}`}>
                        {extractedProblem}
                      </div>
                    </div>
                    {/* Customer */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                        <span>Target Customer (ICP)</span>
                        <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${answers.targetCustomer.length > 2 ? "bg-emerald-500/10 text-emerald-500" : "bg-outline-variant/30 text-on-surface-variant/40"}`}>
                          {answers.targetCustomer.length > 2 ? "PARSED" : "PENDING"}
                        </span>
                      </div>
                      <div className={`p-3 rounded-lg border text-xs leading-relaxed transition-all ${answers.targetCustomer.length > 2 ? "bg-white border-solid border-outline-variant text-on-surface" : "bg-surface border-dashed border-outline-variant/50 text-on-surface-variant/50"}`}>
                        {extractedCustomer}
                      </div>
                    </div>
                  </div>
                  {/* Extraction Clarity */}
                  <div className="mt-8 pt-6 border-t border-outline-variant/30">
                    <div className="flex justify-between items-end mb-2 text-xs">
                      <span className="font-bold uppercase text-on-surface-variant">Extraction Score</span>
                      <span className="font-mono text-secondary font-semibold">{extractedClarity}%</span>
                    </div>
                    <div className="confidence-track">
                      <div
                        className="bg-secondary h-full transition-all duration-500"
                        style={{ width: `${extractedClarity}%` }}
                      ></div>
                    </div>
                    <p className="mt-3 text-[11px] text-on-surface-variant leading-relaxed">
                      Tip: Uploading a full pitch deck populates <span className="underline decoration-secondary/30 text-on-surface font-semibold">all 12 business parameters</span> automatically.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* STEP 2: Business Details Form */}
          {step === 2 && (
            <div className="flex-1 w-full max-w-5xl mx-auto overflow-y-auto pr-2 pb-8">
              <div className="mb-8 flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-on-surface">Start-up Heuristics Questionnaire</h2>
                  <p className="text-sm text-on-surface-variant mt-1">
                    Review and refine extracted parameters before executing rule validation.
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white border border-outline-variant/30 rounded-lg text-xs font-semibold text-on-surface-variant hover:text-on-surface flex items-center gap-1 shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm text-secondary">upload_file</span>
                  <span>Upload Pitch Deck to Auto-Fill</span>
                </button>
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
                    className="w-full p-3 bg-white border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-secondary/10 outline-none font-medium"
                    placeholder="e.g. Mid-market engineering teams, B2B procurement managers, or specialized consumers"
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
                    className="w-full p-3 bg-white border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-secondary/10 outline-none font-medium"
                    placeholder="e.g. 40+ hours lost per month on manual reconciliation and fragmented tool switching"
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
                    className="w-full p-3 bg-white border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-secondary/10 outline-none font-medium"
                    placeholder="e.g. Legacy ERP software, manual spreadsheets, hiring outsourced contractors"
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
                    className="w-full p-3 bg-white border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-secondary/10 outline-none font-medium"
                    placeholder="e.g. North America, Europe, India, or Global"
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
                    className="w-full p-3 bg-white border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-secondary/10 outline-none font-medium"
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
                    className="w-full p-3 bg-white border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-secondary/10 outline-none font-medium"
                    placeholder="e.g. $49/mo per seat, tiered monthly subscriptions, or 5% transaction take rate"
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
                    className="w-full p-3 bg-white border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-secondary/10 outline-none font-medium"
                    placeholder="e.g. Salesforce, HubSpot, or legacy manual alternatives"
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
                    className="w-full p-3 bg-white border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-secondary/10 outline-none font-medium"
                    placeholder="e.g. Proprietary automated workflow engine delivering 10x faster completion"
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
                    className="w-full p-3 bg-white border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-secondary/10 outline-none font-medium"
                    placeholder="e.g. 5 signed letters of intent, 20 active beta pilot users, or $2k MRR"
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
                    className="w-full p-3 bg-white border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-secondary/10 outline-none font-medium"
                    placeholder="e.g. 5+ years domain expertise in industry, former engineering lead at scale"
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
                    className="w-full p-3 bg-white border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-secondary/10 outline-none font-medium"
                    placeholder="e.g. Direct outbound sales, product-led inbound virality, or strategic B2B partnerships"
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
                    className="w-full p-3 bg-white border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-secondary/10 outline-none font-medium"
                    placeholder="e.g. $8B global addressable software market"
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
                  Ensure all parameters are accurate before launching decision pipeline.
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
