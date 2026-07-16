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
        const errData = await response.json();
        throw new Error(errData.error || "Failed to execute venture analysis.");
      }

      const report: UnifiedVentureReport = await response.json();
      set({ currentReport: report, isAnalyzing: false });
      return report;
    } catch (error) {
      set({ isAnalyzing: false });
      throw error;
    }
  },

  fetchProjects: async () => {
    try {
      // We will make a call to list user projects
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        set({ projects: data.projects || [] });
      }
    } catch (error) {
      console.error("[VentureStore] Failed to fetch projects:", error);
    }
  },

  fetchReportById: async (id) => {
    const response = await fetch(`/api/reports/${id}`);
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to fetch report.");
    }
    const report: UnifiedVentureReport = await response.json();
    set({ currentReport: report });
    return report;
  },
}));
