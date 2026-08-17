import {
  ExtractedFacts,
  RuleOutcome,
  VentureScores,
  QuestionnaireAnswers,
  DecisionExperiment,
} from "@/types";

export class DecisionEngine {
  evaluate(
    facts: ExtractedFacts,
    ruleOutcomes: RuleOutcome[],
    scores: VentureScores,
    answers: QuestionnaireAnswers
  ): DecisionExperiment {
    const overall = scores.overallScore;
    const fails = ruleOutcomes.filter((r) => r.status === "FAIL");
    const warnings = ruleOutcomes.filter((r) => r.status === "WARNING");
    const icp = facts.customer.icp || answers.targetCustomer || "target buyers";
    const tag0 = facts.market.industryTags[0] || "target sector";
    const geo = facts.market.geography || answers.geography || "target geography";
    const revModel = facts.businessModel.primaryType || answers.revenueModel || "SaaS";

    let verdict: "CONTINUE" | "PIVOT" | "STOP" = "CONTINUE";
    let strategicReasoning = "";
    let primaryRiskFactor = "";
    let recommendedExperiment = "";
    const validationMilestones: string[] = [];

    // 1. Determine Verdict & Strategic Reasoning
    if (fails.length >= 2 || overall < 45) {
      verdict = "STOP";
      primaryRiskFactor = fails[0]?.message || "Fundamental market size or defensibility mismatch.";
      strategicReasoning = `The venture faces critical evaluation hurdles (Overall Score: ${overall}/100). Primary bottleneck identified: ${primaryRiskFactor}. Continuing current trajectory risks significant cash and effort burn without clear venture-scale return.`;
      recommendedExperiment = `Halt full development. Conduct 15 structured problem-discovery interviews with ${icp} in ${geo} to identify whether a higher-severity willingness-to-pay pain point exists in ${tag0}.`;
      validationMilestones.push(
        `Execute 15 non-pitch customer interviews with ${icp}`,
        "Document unprompted manual workarounds and exact budget allocation",
        "Re-evaluate core problem-solution fit before allocating further resources"
      );
    } else if (fails.length === 1 || warnings.length >= 2 || overall < 70) {
      verdict = "PIVOT";
      primaryRiskFactor = fails[0]?.message || warnings[0]?.message || "Unvalidated customer retention or business model mismatch.";
      strategicReasoning = `The problem thesis demonstrates initial validation (Overall Score: ${overall}/100), but friction exists (${primaryRiskFactor}). A tactical pivot in pricing structure, target ICP segment, or distribution velocity is recommended to unlock repeat adoption.`;

      if (answers.revenueModel.toLowerCase().includes("one time") || warnings.some((w) => w.id === "RULE_05_SAAS_ONE_TIME")) {
        recommendedExperiment = `Pivot monetization from one-time payment to recurring ${revModel} subscription tiers and validate willingness-to-pay with 10 prospective ${icp} accounts.`;
      } else if (warnings.some((w) => w.id === "RULE_01_PRICE_ICP_MISMATCH")) {
        recommendedExperiment = `Pivot target ICP from price-sensitive consumer segments to commercial/enterprise department heads in ${tag0} with existing allocated budgets.`;
      } else {
        recommendedExperiment = `Run a 14-day Concierge pilot with 10 manual ${icp} users in ${geo} to measure 30-day retention cohorts and willingness-to-pay before building self-serve automation.`;
      }

      validationMilestones.push(
        `Secure 5 pilot commitments from ${icp} with advance deposit or signed LOI`,
        "Measure 30-day repeat usage and cohort retention rate (>60% target benchmark)",
        "Refine unit economics CAC payback period to <12 months"
      );
    } else {
      verdict = "CONTINUE";
      primaryRiskFactor = "Go-to-Market customer acquisition velocity and competitor feature parity.";
      strategicReasoning = `Strong venture foundation with high alignment across VC evaluation criteria (Overall Score: ${overall}/100). Customer pain severity, pricing model, and market demand are validated. Focus should now be on accelerating beachhead distribution in ${geo}.`;
      recommendedExperiment = `Launch a direct outbound pilot campaign targeting 50 qualified ${icp} decision-makers in ${geo} to convert 5 paid pilot accounts within 30 days.`;
      validationMilestones.push(
        `Convert 5 paying pilot accounts at target ${revModel} pricing`,
        "Establish scalable customer acquisition loop and measure CAC efficiency",
        "Build proprietary data moat and specialized workflow lock-in"
      );
    }

    return {
      verdict,
      strategicReasoning,
      primaryRiskFactor,
      recommendedExperiment,
      validationMilestones,
    };
  }
}
