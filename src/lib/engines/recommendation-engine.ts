import { ExtractedFacts, RuleOutcome, VentureScores, Recommendation } from "@/types";

export class RecommendationEngine {
  generate(facts: ExtractedFacts, ruleOutcomes: RuleOutcome[], scores: VentureScores): Recommendation[] {
    const recs: Recommendation[] = [];
    let counter = 1;

    const fails = ruleOutcomes.filter((r) => r.status === "FAIL");
    fails.forEach((f) => {
      recs.push({
        id: `REC_${counter++}`,
        priority: "Critical",
        title: `Resolve ${f.name}`,
        description: f.message,
        timeframe: "Immediate Action",
      });
    });

    if (recs.length === 0) {
      recs.push({
        id: `REC_${counter++}`,
        priority: "High",
        title: "Execute Initial Customer Pilot",
        description: "Secure 5 signed LOIs or pilot customer commitments.",
        timeframe: "Next 30 Days",
      });
    }

    return recs;
  }
}
