import { ExtractedFacts, ConsistencyReport, QuestionnaireAnswers } from "@/types";

export class ConsistencyEngine {
  evaluate(facts: ExtractedFacts, answers: QuestionnaireAnswers): ConsistencyReport {
    const claimsNoCompetitors = /none|no competitor/i.test(answers.competitors) || answers.competitors.trim().length === 0;
    const contradictions = [];

    if (claimsNoCompetitors && facts.competition.competitorList.length > 0) {
      contradictions.push({
        id: "CON_01",
        severity: "Critical" as const,
        claim: "Venture claims zero direct competitors.",
        evidence: `Extracted competitors: ${facts.competition.competitorList.join(", ")}`,
        explanation: "Claiming no competitors while incumbents exist indicates a research gap.",
      });
    }

    return {
      contradictions,
      status: contradictions.length > 0 ? "FLAGGED" : "CONSISTENT",
    };
  }
}
