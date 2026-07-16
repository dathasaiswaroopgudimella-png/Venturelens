import { ExtractedFacts, RuleOutcome, VentureScores, DimensionScore, QuestionnaireAnswers } from "@/types";

export class ScoringEngine {
  calculate(
    facts: ExtractedFacts,
    ruleOutcomes: RuleOutcome[],
    answers: QuestionnaireAnswers
  ): VentureScores {
    // Helper to get rule status
    const getRuleStatus = (id: string) => {
      const rule = ruleOutcomes.find((r) => r.id === id);
      return rule ? rule.status : "PASS";
    };

    const getRuleEffect = (id: string) => {
      const rule = ruleOutcomes.find((r) => r.id === id);
      return rule && rule.status !== "PASS" ? rule.impactScoreEffect : 0;
    };

    // 1. Problem Score
    let problemScore = 70;
    // Frequency
    if (facts.problem.frequency === "Daily") problemScore += 10;
    else if (facts.problem.frequency === "Weekly") problemScore += 5;
    else if (facts.problem.frequency === "Monthly") problemScore += 2;
    else if (facts.problem.frequency === "Rarely") problemScore -= 10;
    // Urgency
    if (facts.problem.urgency === "High") problemScore += 10;
    else if (facts.problem.urgency === "Medium") problemScore += 5;
    else if (facts.problem.urgency === "Low") problemScore -= 5;
    // Pain Severity
    if (facts.problem.painSeverity === "Critical") problemScore += 10;
    else if (facts.problem.painSeverity === "Moderate") problemScore += 5;
    else if (facts.problem.painSeverity === "Convenience") problemScore -= 10;

    problemScore += getRuleEffect("RULE_07_LOW_PAIN");
    problemScore = Math.max(10, Math.min(100, problemScore));

    const problem: DimensionScore = {
      score: Math.round(problemScore),
      confidence: facts.problem.description.length > 50 ? "High" : "Medium",
      evidenceLevel: answers.problemSolved.length > 50 ? 8 : 5,
      keyIssues:
        getRuleStatus("RULE_07_LOW_PAIN") !== "PASS"
          ? ["Problem severity is convenience-level or frequency is low."]
          : [],
      suggestions: [
        "Conduct additional user interviews to validate frequency.",
        "Refine problem definition to focus on the highest-pain user persona.",
      ],
    };

    // 2. Customer Score
    let customerScore = 75;
    if (facts.customer.icp.length > 50) customerScore += 10;
    if (facts.customer.earlyAdopters.length > 30) customerScore += 5;

    customerScore += getRuleEffect("RULE_01_PRICE_ICP_MISMATCH");
    customerScore += getRuleEffect("RULE_15_ICP_DIST_MISMATCH");
    customerScore = Math.max(10, Math.min(100, customerScore));

    const customer: DimensionScore = {
      score: Math.round(customerScore),
      confidence: facts.customer.icp.length > 40 ? "High" : "Medium",
      evidenceLevel: answers.targetCustomer.length > 40 ? 7 : 4,
      keyIssues: [
        ...(getRuleStatus("RULE_01_PRICE_ICP_MISMATCH") !== "PASS"
          ? ["B2C target market combined with high enterprise pricing."]
          : []),
        ...(getRuleStatus("RULE_15_ICP_DIST_MISMATCH") !== "PASS"
          ? ["Target customer profile does not match distribution channels."]
          : []),
      ],
      suggestions: [
        "Narrow down the ICP to a specific high-value sub-segment.",
        "Perform pricing alignment surveys with B2C consumers.",
      ],
    };

    // 3. Market Score
    let marketScore = 70;
    if (facts.market.tamPotential === "Massive") marketScore += 20;
    else if (facts.market.tamPotential === "Large") marketScore += 10;
    else if (facts.market.tamPotential === "Medium") marketScore += 5;
    else if (facts.market.tamPotential === "Small") marketScore -= 20;

    marketScore += getRuleEffect("RULE_02_TINY_TAM");
    marketScore += getRuleEffect("RULE_09_GEOGRAPHY_GAP");
    marketScore = Math.max(10, Math.min(100, marketScore));

    const market: DimensionScore = {
      score: Math.round(marketScore),
      confidence: facts.market.geography.length > 10 ? "High" : "Medium",
      evidenceLevel: answers.geography.length > 10 ? 8 : 5,
      keyIssues: [
        ...(getRuleStatus("RULE_02_TINY_TAM") !== "PASS" ? ["Total addressable market scale is restricted."] : []),
        ...(getRuleStatus("RULE_09_GEOGRAPHY_GAP") !== "PASS" ? ["Launches targeting vague global locations."] : []),
      ],
      suggestions: [
        "Define TAM using bottom-up research rather than top-down estimations.",
        "Create a tight initial geo-focused launch plan (beachhead market).",
      ],
    };

    // 4. Competition Score
    let competitionScore = 80;
    const compCount = facts.competition.competitorList.length;
    if (compCount === 0) {
      competitionScore -= 10; // Red flag if claims no competitors (unrealistic or market doesn't exist)
    } else if (compCount > 5) {
      competitionScore -= 10; // Crowded market penalty
    } else {
      competitionScore += 5; // Healthy competitor benchmark
    }

    competitionScore += getRuleEffect("RULE_03_CROWDED_WEAK_MOAT");
    competitionScore = Math.max(10, Math.min(100, competitionScore));

    const competition: DimensionScore = {
      score: Math.round(competitionScore),
      confidence: compCount > 0 ? "High" : "Medium",
      evidenceLevel: answers.competitors.length > 20 ? 8 : 4,
      keyIssues: [
        ...(compCount === 0 ? ["Unrealistic claim of zero competitors."] : []),
        ...(getRuleStatus("RULE_03_CROWDED_WEAK_MOAT") !== "PASS"
          ? ["Market is highly crowded and defensible moat is currently weak."]
          : []),
      ],
      suggestions: [
        "Perform a thorough competitor mapping including indirect solutions.",
        "Articulate a technical, data, or network-effect moat to defend margins.",
      ],
    };

    // 5. Business Model Score
    let modelScore = 75;
    if (facts.businessModel.primaryType === "SaaS") modelScore += 10;
    else if (facts.businessModel.primaryType === "Subscription") modelScore += 10;
    else if (facts.businessModel.primaryType === "Marketplace") modelScore += 5;

    modelScore += getRuleEffect("RULE_04_MARKETPLACE_SUPPLY");
    modelScore += getRuleEffect("RULE_05_SAAS_ONE_TIME");
    modelScore += getRuleEffect("RULE_11_TRANSACTION_LOW_FREQ");
    modelScore = Math.max(10, Math.min(100, modelScore));

    const businessModel: DimensionScore = {
      score: Math.round(modelScore),
      confidence: "High",
      evidenceLevel: answers.revenueModel.length > 15 ? 9 : 6,
      keyIssues: [
        ...(getRuleStatus("RULE_04_MARKETPLACE_SUPPLY") !== "PASS"
          ? ["Supply-side acquisition gap in marketplace distribution."]
          : []),
        ...(getRuleStatus("RULE_05_SAAS_ONE_TIME") !== "PASS"
          ? ["Recurring SaaS model paired with one-time payment structure."]
          : []),
        ...(getRuleStatus("RULE_11_TRANSACTION_LOW_FREQ") !== "PASS"
          ? ["Transactional model with rare customer frequency."]
          : []),
      ],
      suggestions: [
        "Structure recurring plans to capture compound customer LTV.",
        "Detail the transaction loops or take rates to justify unit economics.",
      ],
    };

    // 6. Execution Score
    let executionScore = 80;
    executionScore += getRuleEffect("RULE_06_COMPLEXITY_RESOURCES");
    executionScore += getRuleEffect("RULE_16_STAGE_VALIDATION_GAP");
    executionScore = Math.max(10, Math.min(100, executionScore));

    const execution: DimensionScore = {
      score: Math.round(executionScore),
      confidence: answers.teamBackground.length > 30 ? "High" : "Medium",
      evidenceLevel: answers.teamBackground.length > 30 ? 8 : 4,
      keyIssues: [
        ...(getRuleStatus("RULE_06_COMPLEXITY_RESOURCES") !== "PASS"
          ? ["High technical complexity coupled with a resource/expertise deficit."]
          : []),
        ...(getRuleStatus("RULE_16_STAGE_VALIDATION_GAP") !== "PASS"
          ? ["Scaling phase claimed prematurely relative to current validation."]
          : []),
      ],
      suggestions: [
        "Add advisors or hire developers with specific domain experience.",
        "Refine timeline and milestone roadmap prior to scaling.",
      ],
    };

    // 7. Risk Score
    let riskScore = 80;
    if (facts.execution.complexity === "High") riskScore -= 5;
    riskScore += getRuleEffect("RULE_13_REGULATORY_RISK");
    riskScore = Math.max(10, Math.min(100, riskScore));

    const risk: DimensionScore = {
      score: Math.round(riskScore),
      confidence: "Medium",
      evidenceLevel: 6,
      keyIssues:
        getRuleStatus("RULE_13_REGULATORY_RISK") !== "PASS"
          ? ["Unaddressed regulatory compliance and legal approval barriers."]
          : [],
      suggestions: [
        "Conduct a regulatory risk assessment matching targeted markets.",
        "Define concrete safety, privacy, and compliance guidelines.",
      ],
    };

    // 8. Differentiation Score
    let diffScore = 75;
    if (facts.competition.differentiationMoat.length > 40) diffScore += 10;
    diffScore += getRuleEffect("RULE_14_WEAK_MOAT");
    diffScore = Math.max(10, Math.min(100, diffScore));

    const differentiation: DimensionScore = {
      score: Math.round(diffScore),
      confidence: "Medium",
      evidenceLevel: answers.differentiation.length > 20 ? 7 : 4,
      keyIssues:
        getRuleStatus("RULE_14_WEAK_MOAT") !== "PASS"
          ? ["Weak differentiation and lack of defensible barriers."]
          : [],
      suggestions: [
        "Clearly define product moats like data loops, proprietary tech, or high switching costs.",
        "Run user surveys comparing product features to competitor features.",
      ],
    };

    // 9. Scalability Score
    let scaleScore = 75;
    if (facts.businessModel.primaryType === "SaaS" || facts.businessModel.primaryType === "Subscription") {
      scaleScore += 10;
    }
    if (facts.market.tamPotential === "Massive" || facts.market.tamPotential === "Large") {
      scaleScore += 5;
    } else if (facts.market.tamPotential === "Small") {
      scaleScore -= 20;
    }

    scaleScore += getRuleEffect("RULE_10_SWITCHING_COST_MISMATCH");
    scaleScore = Math.max(10, Math.min(100, scaleScore));

    const scalability: DimensionScore = {
      score: Math.round(scaleScore),
      confidence: "High",
      evidenceLevel: 7,
      keyIssues:
        getRuleStatus("RULE_10_SWITCHING_COST_MISMATCH") !== "PASS"
          ? ["Contradictory user adoption barriers and customer onboarding strategy."]
          : [],
      suggestions: [
        "Ensure low friction for early user trial periods to drive growth velocity.",
        "Invest in self-serve distribution pipelines.",
      ],
    };

    // 10. Investor Readiness Score
    let readyScore = (problemScore + customerScore + marketScore + competitionScore + modelScore + executionScore + riskScore + diffScore + scaleScore) / 9;
    
    // Deduct for fails
    const failRules = ruleOutcomes.filter((r) => r.status === "FAIL");
    readyScore -= failRules.length * 6;
    readyScore = Math.max(10, Math.min(100, readyScore));

    const investorReadiness: DimensionScore = {
      score: Math.round(readyScore),
      confidence: "Medium",
      evidenceLevel: 8,
      keyIssues: failRules.map((r) => `${r.name}: ${r.message}`),
      suggestions: [
        "Address all Critical and High priority rule failures before presenting to VCs.",
        "Increase customer validation from prototype users to back revenue claims.",
      ],
    };

    // Calculate Overall Venture Score
    const overallScore = Math.round(
      problemScore * 0.15 +
        customerScore * 0.15 +
        marketScore * 0.15 +
        competitionScore * 0.12 +
        modelScore * 0.12 +
        executionScore * 0.1 +
        riskScore * 0.05 +
        diffScore * 0.08 +
        scaleScore * 0.08
    );

    return {
      problem,
      customer,
      market,
      competition,
      businessModel,
      execution,
      risk,
      differentiation,
      scalability,
      investorReadiness,
      overallScore,
    };
  }
}
