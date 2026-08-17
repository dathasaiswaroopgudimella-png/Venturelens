import {
  ExtractedFacts,
  RuleOutcome,
  VentureScores,
  QuestionnaireAnswers,
  DecisionExperiment,
} from "@/types";
import { isNonCommercialSubmission, formatBuyerPersona, formatGeography } from "@/lib/utils/clean-inputs";

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
    const isNonCommercial = isNonCommercialSubmission(answers.idea, answers);

    const buyerTitle = formatBuyerPersona(facts.customer.icp || answers.targetCustomer);
    const geo = formatGeography(facts.market.geography || answers.geography);
    const tag0 = facts.market.industryTags[0] || "target vertical";
    const revModel = facts.businessModel.primaryType || answers.revenueModel || "Subscription";

    let verdict: "CONTINUE" | "PIVOT" | "STOP" = "CONTINUE";
    let strategicReasoning = "";
    let primaryRiskFactor = "";
    let recommendedExperiment = "";
    const validationMilestones: string[] = [];

    // 1. NON-COMMERCIAL / NONSENSE THESIS
    if (isNonCommercial || overall < 25) {
      verdict = "STOP";
      primaryRiskFactor = "Non-commercial thesis: No solvable business problem, addressable customer, or monetization model defined.";
      strategicReasoning = `The submission does not describe a viable commercial enterprise (Overall Score: ${overall}/100). It describes an activity or informal statement rather than an addressable venture opportunity. Minimum venture eligibility criteria are not met.`;
      recommendedExperiment = `Formulate a concrete venture thesis centered around an acute, costly operational or consumer problem with verifiable willingness-to-pay.`;
      validationMilestones.push(
        "Identify 10 prospective buyers experiencing an acute, costly daily or weekly operational problem",
        "Document existing legacy workarounds and quantify the financial or time cost incurred",
        "Formulate a commercial product thesis with clear unit economics and re-submit for diligence"
      );
    }
    // 2. CRITICAL STRUCTURAL BOTTLENECK / RE-EVALUATE
    else if (overall < 50 || fails.length >= 2) {
      verdict = "STOP";
      primaryRiskFactor = fails[0]?.message || "Fundamental market size, defensibility, or unit economics mismatch.";
      strategicReasoning = `The venture faces critical structural hurdles (Overall Score: ${overall}/100). Primary bottleneck identified: ${primaryRiskFactor}. Committing capital or full-time engineering before resolving these fundamental issues risks rapid cash burn without clear venture-scale return.`;
      recommendedExperiment = `Halt full development. Conduct 15 structured problem-discovery interviews with ${buyerTitle} in ${geo} to identify whether a higher-severity willingness-to-pay pain point exists in ${tag0}.`;
      validationMilestones.push(
        `Execute 15 non-pitch discovery interviews with verified ${buyerTitle}`,
        "Document unprompted manual workarounds and exact budget authority",
        "Re-evaluate core problem-solution fit before allocating further resources"
      );
    }
    // 3. PIVOT / WILLINGNESS-TO-PAY VALIDATION
    else if (overall < 75 || fails.length === 1 || warnings.length >= 2) {
      verdict = "PIVOT";
      primaryRiskFactor = fails[0]?.message || warnings[0]?.message || "Unverified commercial willingness-to-pay or unit economics mismatch.";
      strategicReasoning = `The problem thesis demonstrates initial validation (Overall Score: ${overall}/100), but friction exists (${primaryRiskFactor}). A tactical pivot in pricing structure, target ICP segment, or distribution velocity is recommended to unlock repeat adoption.`;

      if (answers.revenueModel?.toLowerCase().includes("one time") || warnings.some((w) => w.id === "RULE_05_SAAS_ONE_TIME")) {
        recommendedExperiment = `Pivot monetization from one-time payment to recurring ${revModel} subscription tiers and validate pricing acceptance with 10 prospective ${buyerTitle}.`;
      } else if (warnings.some((w) => w.id === "RULE_01_PRICE_ICP_MISMATCH")) {
        recommendedExperiment = `Pivot target customer segment from price-sensitive consumer users to commercial department heads in ${tag0} with allocated software/operational budgets.`;
      } else {
        recommendedExperiment = `Run a 14-day Concierge pilot with 5–10 prospective ${buyerTitle} in ${geo} to measure repeat usage cohorts and willingness-to-pay before building self-serve automation.`;
      }

      validationMilestones.push(
        `Secure 3–5 pilot commitments from ${buyerTitle} with advance deposit or signed LOI`,
        "Measure 30-day repeat usage and cohort retention rate (>60% benchmark)",
        "Refine unit economics CAC payback period to <12 months"
      );
    }
    // 4. HIGH CONVICTION / SCALE
    else {
      verdict = "CONTINUE";
      primaryRiskFactor = "Go-to-Market customer acquisition velocity and competitive scaling speed.";
      strategicReasoning = `Exceptional venture foundation with high alignment across institutional VC evaluation criteria (Overall Score: ${overall}/100). Customer pain severity, pricing model, and market demand are validated. Focus should now be on accelerating beachhead distribution in ${geo}.`;
      recommendedExperiment = `Launch a direct outbound pilot campaign targeting 50 qualified ${buyerTitle} decision-makers in ${geo} to convert 5 paid pilot accounts within 30 days.`;
      validationMilestones.push(
        `Convert 5 paying pilot accounts at target ${revModel} contract values`,
        "Establish scalable customer acquisition loops and measure CAC efficiency",
        "Build proprietary data moats and specialized workflow integrations"
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
