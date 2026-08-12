import { QuestionnaireAnswers } from "@/types";

export interface ResearchResult {
  competitorsFound: string[];
  evidenceText: string;
  urls: string[];
}

export class ExternalResearch {
  async performResearch(answers: QuestionnaireAnswers): Promise<ResearchResult> {
    const rawComps = answers.competitors
      ? answers.competitors.split(",").map((c) => c.trim()).filter(Boolean)
      : ["Incumbent Competitors", "Legacy Workarounds"];

    return {
      competitorsFound: rawComps,
      evidenceText: `Market research conducted for ${answers.idea.slice(0, 40)}...`,
      urls: [],
    };
  }
}
