import { create } from "zustand";
import { QuestionnaireAnswers, UnifiedVentureReport } from "@/types";
import { generateClientVentureReport } from "@/lib/engines/client-evaluator";

// Bump this whenever the scoring engine changes to bust stale cached reports.
const CACHE_VERSION = "v3";

interface VentureStore {
  answers: QuestionnaireAnswers;
  isAnalyzing: boolean;
  currentReport: UnifiedVentureReport | null;
  projects: any[];
  activeProjectId: string | null;

  setAnswers: (answers: QuestionnaireAnswers) => void;
  updateAnswer: (key: keyof QuestionnaireAnswers, value: string) => void;
  resetAnswers: () => void;
  startAnalysis: (answers: QuestionnaireAnswers) => Promise<UnifiedVentureReport>;
  loadReport: (report: UnifiedVentureReport) => void;
  fetchProjects: () => Promise<void>;
  fetchReportById: (id: string) => Promise<UnifiedVentureReport>;
}

const initialAnswers: QuestionnaireAnswers = {
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
};

export const useVentureStore = create<VentureStore>((set, get) => ({
  answers: { ...initialAnswers },
  isAnalyzing: false,
  currentReport: null,
  projects: [],
  activeProjectId: null,

  setAnswers: (answers) => set({ answers }),

  updateAnswer: (key, value) =>
    set((state) => ({
      answers: { ...state.answers, [key]: value },
    })),

  resetAnswers: () => set({ answers: { ...initialAnswers }, currentReport: null }),

  loadReport: (currentReport) => set({ currentReport }),

  startAnalysis: async (answers) => {
    set({ isAnalyzing: true });

    let report: UnifiedVentureReport | null = null;

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });

      if (response.ok) {
        report = await response.json();
      }
    } catch (networkErr) {
      console.warn("[VentureStore] Network API call bypassed, activating instant client engine:", networkErr);
    }

    // If server was unreachable, rate-limited, or timed out, generate full report with client engine
    if (!report || !report.scores) {
      report = generateClientVentureReport(answers);
    }

    set({ currentReport: report, isAnalyzing: false });

    // Save report and project to localStorage so guest users can re-open their projects
    if (typeof window !== "undefined") {
      try {
        const stamped = { ...report, engineVersion: CACHE_VERSION };
        localStorage.setItem("latest_venturelens_report", JSON.stringify(stamped));
        localStorage.setItem(`venturelens_report_${report.projectId}`, JSON.stringify(stamped));

        const localProj = {
          id: report.projectId,
          name: answers.idea.substring(0, 35) + (answers.idea.length > 35 ? "..." : ""),
          description: answers.idea,
          status: "analyzed",
          created_at: report.createdAt || new Date().toISOString(),
          reports: [
            {
              id: report.projectId,
              overall_score: report.scores.overallScore,
              created_at: report.createdAt || new Date().toISOString(),
            },
          ],
        };

        const rawList = localStorage.getItem("venturelens_projects_list");
        const existingList = rawList ? JSON.parse(rawList) : [];
        const updatedList = [localProj, ...existingList.filter((p: any) => p.id !== report.projectId)];
        localStorage.setItem("venturelens_projects_list", JSON.stringify(updatedList));

        // Immediately update state
        set((state) => ({
          projects: [localProj, ...state.projects.filter((p) => p.id !== report.projectId)],
        }));
      } catch (e) {
        console.warn("[VentureStore] LocalStorage write error:", e);
      }
    }

    return report;
  },

  fetchProjects: async () => {
    try {
      let dbProjects: any[] = [];
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        dbProjects = data.projects || [];
      }

      // Merge with localStorage projects
      let localProjects: any[] = [];
      if (typeof window !== "undefined") {
        try {
          const rawList = localStorage.getItem("venturelens_projects_list");
          if (rawList) localProjects = JSON.parse(rawList);
        } catch (e) {
          console.warn("[VentureStore] LocalStorage read error:", e);
        }
      }

      // Combine DB and local projects, removing duplicates
      const mergedMap = new Map<string, any>();
      localProjects.forEach((p) => mergedMap.set(p.id, p));
      dbProjects.forEach((p) => mergedMap.set(p.id, p));

      const merged = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      set({ projects: merged });
    } catch (error) {
      console.error("[VentureStore] Failed to fetch projects:", error);
    }
  },

  fetchReportById: async (id) => {
    // Check localStorage first — but only if the report was generated with current engine version
    if (typeof window !== "undefined") {
      try {
        if (id === "latest") {
          const rawLatest = localStorage.getItem("latest_venturelens_report");
          if (rawLatest) {
            const parsed = JSON.parse(rawLatest);
            // Bust stale cached reports from old scoring engine versions
            if (parsed?.engineVersion === CACHE_VERSION) {
              set({ currentReport: parsed });
              return parsed as UnifiedVentureReport;
            } else {
              console.warn("[VentureStore] Stale engine cache detected — discarding old report.");
              localStorage.removeItem("latest_venturelens_report");
            }
          }
        }
        const rawLocal = localStorage.getItem(`venturelens_report_${id}`);
        if (rawLocal) {
          const parsed = JSON.parse(rawLocal);
          if (parsed?.engineVersion === CACHE_VERSION) {
            set({ currentReport: parsed });
            return parsed as UnifiedVentureReport;
          } else {
            console.warn("[VentureStore] Stale engine cache detected — discarding old report.");
            localStorage.removeItem(`venturelens_report_${id}`);
          }
        }
      } catch (e) {
        console.warn("[VentureStore] LocalStorage report load error:", e);
      }
    }

    const response = await fetch(`/api/reports/${id}`);
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to fetch report.");
    }
    const report: UnifiedVentureReport = await response.json();
    set({ currentReport: report });
    return report;
  },
}));
