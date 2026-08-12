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
    const valText = (answers.currentValidation || "").toLowerCase();
    const icp = facts.customer.icp || answers.targetCustomer || "target users";
    const tag0 = facts.market.industryTags[0] || "target market";

    let verdict: "CONTINUE" | "PIVOT" | "STOP" = "CONTINUE";
    let strategicReasoning = "";
    let primaryRiskFactor = "";
    let recommendedExperiment = "";
    const validationMilestones: string[] = [];

    // 1. Determine Verdict & Strategic Reasoning
    if (fails.length >= 2 || overall < 45) {
      verdict = "STOP";
      primaryRiskFactor = fails[0]?.message || "Fundamental market size or defensibility mismatch.";
      strategicReasoning = `The venture faces multiple critical evaluation failures (Overall Score: ${overall}/100). Severe risk identified: ${primaryRiskFactor}. Continuing current trajectory risks significant cash and effort burn without venture-scale return.`;
      recommendedExperiment = `Halt software development immediately. Conduct 15 structured problem-discovery interviews with ${icp} to identify if a higher-severity pain point exists in ${tag0}.`;
      validationMilestones.push(
        "Execute 15 non-pitch customer interviews",
        "Document unprompted workarounds used by target buyers",
        "Re-evaluate core thesis before spending engineering resources"
      );
    } else if (fails.length === 1 || warnings.length >= 2 || overall < 70) {
      verdict = "PIVOT";
      primaryRiskFactor = fails[0]?.message || warnings[0]?.message || "Unvalidated customer retention or business model mismatch.";
      strategicReasoning = `The core problem idea has merit (Overall Score: ${overall}/100), but key business model or distribution friction exists (${primaryRiskFactor}). A tactical pivot in pricing structure, target ICP segment, or distribution channel is required to establish repeat traction.`;
      
      // Formulate specific pivot experiment
      if (/laundry|hostel|campus/i.test(answers.idea + answers.problemSolved)) {
        recommendedExperiment = "Test prepaid weekly/monthly laundry subscription bundles ($15/mo) with 20 hostel residents over 14 days to establish 30-day repeat usage.";
      } else if (answers.revenueModel.toLowerCase().includes("one time") || warnings.some((w) => w.id === "RULE_05_SAAS_ONE_TIME")) {
        recommendedExperiment = `Pivot monetization from one-time payment to recurring monthly SaaS tiers ($29/mo) and test conversion with 10 prospective ${icp} buyers.`;
      } else if (warnings.some((w) => w.id === "RULE_01_PRICE_ICP_MISMATCH")) {
        recommendedExperiment = `Pivot target ICP from consumer/individual users to B2B mid-market department heads who possess allocated software budget.`;
      } else {
        recommendedExperiment = `Run a 14-day Concierge pilot with 10 manual users in ${facts.market.geography || 'target market'} to measure 30-day retention and willingness-to-pay before building self-serve software.`;
      }

      validationMilestones.push(
        "Secure 10 pilot commitments with advance deposit or LOI",
        "Measure 30-day repeat usage/retention rate (>60% benchmark)",
        "Refine unit economics CAC payback period to <12 months"
      );
    } else {
      verdict = "CONTINUE";
      primaryRiskFactor = "Go-to-Market execution speed and competitor replication.";
      strategicReasoning = `Strong foundation and high alignment across VC evaluation criteria (Overall Score: ${overall}/100). Customer pain severity and market potential are validated. Focus must now shift to accelerating digital distribution and securing initial paying pilots.`;
      recommendedExperiment = `Launch a direct outbound pilot campaign targeting 50 qualified ${icp} decision makers to convert 5 paid pilot customers within 30 days.`;
      validationMilestones.push(
        "Convert 5 paying pilot customers at target pricing",
        "Validate CAC efficiency via direct outbound or digital channel",
        "Establish proprietary dataset or workflow lock-in moat"
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
