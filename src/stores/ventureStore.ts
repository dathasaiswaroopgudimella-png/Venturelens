import { create } from "zustand";
import { QuestionnaireAnswers, UnifiedVentureReport } from "@/types";

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

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to execute venture analysis.");
      }

      const report: UnifiedVentureReport = await response.json();
      set({ currentReport: report, isAnalyzing: false });

      // Save report and project to localStorage so guest users can re-open their projects
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("latest_venturelens_report", JSON.stringify(report));
          localStorage.setItem(`venturelens_report_${report.projectId}`, JSON.stringify(report));

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
    } catch (error) {
      set({ isAnalyzing: false });
      throw error;
    }
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
    // Check localStorage first
    if (typeof window !== "undefined") {
      try {
        if (id === "latest") {
          const rawLatest = localStorage.getItem("latest_venturelens_report");
          if (rawLatest) {
            const report: UnifiedVentureReport = JSON.parse(rawLatest);
            set({ currentReport: report });
            return report;
          }
        }
        const rawLocal = localStorage.getItem(`venturelens_report_${id}`);
        if (rawLocal) {
          const report: UnifiedVentureReport = JSON.parse(rawLocal);
          set({ currentReport: report });
          return report;
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
