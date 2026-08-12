import { ExtractedFacts, EvidenceData, QuestionnaireAnswers } from "@/types";

export class EvidenceEngine {
  evaluate(facts: ExtractedFacts, answers: QuestionnaireAnswers): Record<string, EvidenceData> {
    return {
      problem: {
        supporting: [answers.problemSolved ? "User problem thesis provided." : ""].filter(Boolean),
        missing: [answers.problemSolved.length < 30 ? "Direct quantification of workaround costs is missing." : ""].filter(Boolean),
      },
      customer: {
        supporting: [answers.targetCustomer ? `Target buyer outlined: ${answers.targetCustomer}` : ""].filter(Boolean),
        missing: [answers.currentValidation.toLowerCase().includes("none") ? "Primary customer interview datasets are missing." : ""].filter(Boolean),
      },
      market: {
        supporting: [answers.geography ? `Target region: ${answers.geography}` : ""].filter(Boolean),
        missing: ["Detailed bottom-up TAM/SAM/SOM calculation missing."],
      },
    };
  }
}
