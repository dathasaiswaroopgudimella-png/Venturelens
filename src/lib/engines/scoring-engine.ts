import { ExtractedFacts, RuleOutcome, VentureScores, DimensionScore, QuestionnaireAnswers } from "@/types";

export class ScoringEngine {
  calculate(
    facts: ExtractedFacts,
    ruleOutcomes: RuleOutcome[],
    answers: QuestionnaireAnswers
  ): VentureScores {
    const icp = facts.customer.icp || answers.targetCustomer || "target users";
    const probDesc = facts.problem.description || answers.problemSolved || "identified problem";

    const getRuleEffect = (id: string) => {
      const rule = ruleOutcomes.find((r) => r.id === id);
      return rule && rule.status !== "PASS" ? rule.impactScoreEffect : 0;
    };

    const valText = (answers.currentValidation || "").toLowerCase();
    let valBonus = -5;
    if (/loi|letter|paying|revenue|pilot|active user|pre-order|customer interview|survey/i.test(valText)) {
      valBonus = 12;
    } else if (/prototype|mvp|demo|built/i.test(valText)) {
      valBonus = 5;
    }

    // Scores
    const probScore = Math.max(20, Math.min(98, 65 + valBonus + (facts.problem.painSeverity === "Critical" ? 15 : 0)));
    const custScore = Math.max(20, Math.min(98, 60 + valBonus + getRuleEffect("RULE_01_PRICE_ICP_MISMATCH")));
    const mktScore = Math.max(20, Math.min(98, 60 + getRuleEffect("RULE_02_TINY_TAM")));
    const compScore = Math.max(20, Math.min(98, 65 + getRuleEffect("RULE_03_CROWDED_WEAK_MOAT")));
    const modelScore = Math.max(20, Math.min(98, 60 + valBonus + getRuleEffect("RULE_05_SAAS_ONE_TIME")));
    const execScore = Math.max(20, Math.min(98, 55 + valBonus + getRuleEffect("RULE_06_COMPLEXITY_RESOURCES")));
    const riskScore = Math.max(20, Math.min(98, 65));
    const diffScore = Math.max(20, Math.min(98, 60));
    const scaleScore = Math.max(20, Math.min(98, 65));

    const overallScore = Math.round(
      probScore * 0.16 +
      custScore * 0.16 +
      mktScore * 0.16 +
      compScore * 0.12 +
      modelScore * 0.12 +
      execScore * 0.10 +
      diffScore * 0.10 +
      scaleScore * 0.08
    );

    const makeDim = (score: number, issue: string, sug: string): DimensionScore => ({
      score: Math.round(score),
      confidence: "High",
      evidenceLevel: 7,
      keyIssues: issue ? [issue] : [],
      suggestions: [sug],
    });

    return {
      problem: makeDim(probScore, "Problem description requires impact quantification.", `Validate pain severity directly with 15 ${icp}.`),
      customer: makeDim(custScore, "Target buyer persona needs segmentation.", `Define early adopter profile for ${icp}.`),
      market: makeDim(mktScore, "", "Calculate bottom-up SAM/SOM market size."),
      competition: makeDim(compScore, "", "Formulate defensible moat strategy."),
      businessModel: makeDim(modelScore, "", "Refine pricing tiers for recurring retention."),
      execution: makeDim(execScore, "", "Recruit domain technical advisors."),
      risk: makeDim(riskScore, "", "Establish regulatory compliance early."),
      differentiation: makeDim(diffScore, "", "Build proprietary workflow advantage."),
      scalability: makeDim(scaleScore, "", "Automate self-serve distribution loop."),
      investorReadiness: makeDim(overallScore, "", "Resolve rule warnings before pitching seed VCs."),
      overallScore,
    };
  }
}
