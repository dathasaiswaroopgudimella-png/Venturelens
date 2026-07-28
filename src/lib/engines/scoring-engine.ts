import { ExtractedFacts, RuleOutcome, VentureScores, DimensionScore, QuestionnaireAnswers } from "@/types";

export class ScoringEngine {
  calculate(
    facts: ExtractedFacts,
    ruleOutcomes: RuleOutcome[],
    answers: QuestionnaireAnswers
  ): VentureScores {
    const icp = facts.customer.icp || answers.targetCustomer || "target users";
    const probDesc = facts.problem.description || answers.problemSolved || "identified problem";
    const tag0 = facts.market.industryTags[0] || "Target Market";
    const comps = facts.competition.competitorList.join(", ") || answers.competitors || "existing alternatives";

    const getRuleStatus = (id: string) => {
      const rule = ruleOutcomes.find((r) => r.id === id);
      return rule ? rule.status : "PASS";
    };

    const getRuleEffect = (id: string) => {
      const rule = ruleOutcomes.find((r) => r.id === id);
      return rule && rule.status !== "PASS" ? rule.impactScoreEffect : 0;
    };

    // Quality modifier based on answer completeness
    const answerDetailLen = (answers.idea + answers.problemSolved + answers.targetCustomer + answers.differentiation).length;
    const completenessBonus = answerDetailLen > 300 ? 5 : answerDetailLen > 150 ? 0 : -10;

    // Validation modifier
    const valText = (answers.currentValidation || "").toLowerCase();
    let validationBonus = -5;
    if (/loi|letter|paying|revenue|pilot|active user|pre-order|customer interview/i.test(valText)) {
      validationBonus = 12;
    } else if (/prototype|mvp|demo|built/i.test(valText)) {
      validationBonus = 5;
    }

    // 1. Problem Score
    let problemScore = 55 + completenessBonus;
    if (facts.problem.frequency === "Daily") problemScore += 15;
    else if (facts.problem.frequency === "Weekly") problemScore += 8;
    else if (facts.problem.frequency === "Monthly") problemScore += 2;
    else if (facts.problem.frequency === "Rarely") problemScore -= 15;

    if (facts.problem.urgency === "High") problemScore += 12;
    else if (facts.problem.urgency === "Medium") problemScore += 4;
    else if (facts.problem.urgency === "Low") problemScore -= 10;

    if (facts.problem.painSeverity === "Critical") problemScore += 15;
    else if (facts.problem.painSeverity === "Moderate") problemScore += 5;
    else if (facts.problem.painSeverity === "Convenience") problemScore -= 15;

    problemScore += getRuleEffect("RULE_07_LOW_PAIN");
    problemScore = Math.max(15, Math.min(98, problemScore));

    const problem: DimensionScore = {
      score: Math.round(problemScore),
      confidence: answers.problemSolved.length > 40 ? "High" : "Medium",
      evidenceLevel: Math.min(10, Math.max(2, Math.round(answers.problemSolved.length / 20))),
      keyIssues:
        getRuleStatus("RULE_07_LOW_PAIN") !== "PASS"
          ? [`Problem severity for ${icp} is classified as convenience-level or low frequency.`]
          : answers.problemSolved.length < 30
          ? ["Problem description lacks detailed impact metrics."]
          : [],
      suggestions: [
        `Conduct 15 deep-dive interviews specifically with ${icp} to quantify financial/time loss caused by "${probDesc.substring(0, 40)}...".`,
        `Benchmark urgency against current manual workarounds in the ${tag0} sector.`,
      ],
    };

    // 2. Customer Score
    let customerScore = 50 + completenessBonus + validationBonus;
    if (facts.customer.icp.length > 30) customerScore += 15;
    if (facts.customer.earlyAdopters.length > 20) customerScore += 10;

    customerScore += getRuleEffect("RULE_01_PRICE_ICP_MISMATCH");
    customerScore += getRuleEffect("RULE_15_ICP_DIST_MISMATCH");
    customerScore = Math.max(15, Math.min(98, customerScore));

    const customer: DimensionScore = {
      score: Math.round(customerScore),
      confidence: facts.customer.icp.length > 30 ? "High" : "Medium",
      evidenceLevel: Math.min(10, Math.max(2, Math.round(answers.targetCustomer.length / 15))),
      keyIssues: [
        ...(getRuleStatus("RULE_01_PRICE_ICP_MISMATCH") !== "PASS"
          ? [`High enterprise pricing model paired with B2C/individual customer profile (${icp}).`]
          : []),
        ...(getRuleStatus("RULE_15_ICP_DIST_MISMATCH") !== "PASS"
          ? [`Selected distribution channel (${answers.distributionChannel || 'unspecified'}) does not align with ${icp}.`]
          : []),
      ],
      suggestions: [
        `Narrow down ${icp} into 2-3 specific high-intent sub-buyer personas.`,
        `Validate willingness-to-pay thresholds directly with early adopters in ${facts.market.geography || 'target market'}.`,
      ],
    };

    // 3. Market Score
    let marketScore = 50 + completenessBonus;
    if (facts.market.tamPotential === "Massive") marketScore += 30;
    else if (facts.market.tamPotential === "Large") marketScore += 18;
    else if (facts.market.tamPotential === "Medium") marketScore += 8;
    else if (facts.market.tamPotential === "Small") marketScore -= 25;

    marketScore += getRuleEffect("RULE_02_TINY_TAM");
    marketScore += getRuleEffect("RULE_09_GEOGRAPHY_GAP");
    marketScore = Math.max(15, Math.min(98, marketScore));

    const market: DimensionScore = {
      score: Math.round(marketScore),
      confidence: facts.market.geography.length > 5 ? "High" : "Medium",
      evidenceLevel: Math.min(10, Math.max(3, Math.round((answers.geography?.length || 10) / 5))),
      keyIssues: [
        ...(getRuleStatus("RULE_02_TINY_TAM") !== "PASS" ? [`TAM for ${tag0} in ${facts.market.geography} is overly restricted.`] : []),
        ...(getRuleStatus("RULE_09_GEOGRAPHY_GAP") !== "PASS" ? [`Launch strategy targets vague global geography without a beachhead region.`] : []),
      ],
      suggestions: [
        `Perform a bottom-up TAM calculation for ${tag0} rather than relying on top-down industry reports.`,
        `Establish a focused launch beachhead in ${facts.market.geography || 'a single region'} before expanding globally.`,
      ],
    };

    // 4. Competition Score
    let competitionScore = 60 + completenessBonus;
    const compCount = facts.competition.competitorList.length;
    if (compCount === 0) {
      competitionScore -= 20; // Red flag for claiming zero competitors
    } else if (compCount > 5) {
      competitionScore -= 15; // Crowded market penalty
    } else {
      competitionScore += 15; // Healthy competitor validation
    }

    if (facts.competition.differentiationMoat.length > 40) competitionScore += 10;

    competitionScore += getRuleEffect("RULE_03_CROWDED_WEAK_MOAT");
    competitionScore = Math.max(15, Math.min(98, competitionScore));

    const competition: DimensionScore = {
      score: Math.round(competitionScore),
      confidence: compCount > 0 ? "High" : "Medium",
      evidenceLevel: Math.min(10, Math.max(2, Math.round(answers.competitors.length / 10))),
      keyIssues: [
        ...(compCount === 0 ? ["Claiming zero competitors indicates incomplete market research."] : []),
        ...(getRuleStatus("RULE_03_CROWDED_WEAK_MOAT") !== "PASS"
          ? [`High competitor density (${comps}) combined with weak defensibility moat.`]
          : []),
      ],
      suggestions: [
        `Map out direct and indirect feature comparisons against ${comps || 'existing alternatives'}.`,
        `Develop proprietary data loops or technical barriers to defend margins against incumbents.`,
      ],
    };

    // 5. Business Model Score
    let modelScore = 55 + validationBonus;
    if (facts.businessModel.primaryType === "SaaS") modelScore += 20;
    else if (facts.businessModel.primaryType === "Subscription") modelScore += 18;
    else if (facts.businessModel.primaryType === "Marketplace") modelScore += 10;
    else if (facts.businessModel.primaryType === "Transaction") modelScore += 8;

    modelScore += getRuleEffect("RULE_04_MARKETPLACE_SUPPLY");
    modelScore += getRuleEffect("RULE_05_SAAS_ONE_TIME");
    modelScore += getRuleEffect("RULE_11_TRANSACTION_LOW_FREQ");
    modelScore = Math.max(15, Math.min(98, modelScore));

    const businessModel: DimensionScore = {
      score: Math.round(modelScore),
      confidence: "High",
      evidenceLevel: Math.min(10, Math.max(3, Math.round(answers.revenueModel.length / 8))),
      keyIssues: [
        ...(getRuleStatus("RULE_04_MARKETPLACE_SUPPLY") !== "PASS"
          ? ["Marketplace model lacks clear supply-side acquisition strategy."]
          : []),
        ...(getRuleStatus("RULE_05_SAAS_ONE_TIME") !== "PASS"
          ? ["Recurring SaaS model paired with one-time payment structure limits LTV."]
          : []),
        ...(getRuleStatus("RULE_11_TRANSACTION_LOW_FREQ") !== "PASS"
          ? ["Transactional monetization model paired with low customer purchase frequency."]
          : []),
      ],
      suggestions: [
        `Structure recurring pricing tiers (${answers.pricingStrategy || 'pricing model'}) to maximize LTV:CAC ratio.`,
        `Define clear customer retention loops for ${icp}.`,
      ],
    };

    // 6. Execution Score
    let executionScore = 50 + validationBonus;
    const teamLen = (answers.teamBackground || "").length;
    if (teamLen > 40) executionScore += 20;
    else if (teamLen > 15) executionScore += 10;
    else executionScore -= 10;

    executionScore += getRuleEffect("RULE_06_COMPLEXITY_RESOURCES");
    executionScore += getRuleEffect("RULE_16_STAGE_VALIDATION_GAP");
    executionScore = Math.max(15, Math.min(98, executionScore));

    const execution: DimensionScore = {
      score: Math.round(executionScore),
      confidence: teamLen > 25 ? "High" : "Medium",
      evidenceLevel: Math.min(10, Math.max(2, Math.round(teamLen / 10))),
      keyIssues: [
        ...(getRuleStatus("RULE_06_COMPLEXITY_RESOURCES") !== "PASS"
          ? [`High technical complexity (${facts.execution.complexity}) paired with resource/team gap.`]
          : []),
        ...(getRuleStatus("RULE_16_STAGE_VALIDATION_GAP") !== "PASS"
          ? [`Claimed business stage (${answers.businessStage}) exceeds current customer validation level.`]
          : []),
      ],
      suggestions: [
        `Recruit key technical or domain advisors to strengthen execution credibility in ${tag0}.`,
        `Define 30-60-90 day milestone roadmaps before pursuing aggressive GTM expansion.`,
      ],
    };

    // 7. Risk Score
    let riskScore = 65;
    if (facts.execution.complexity === "High") riskScore -= 15;
    else if (facts.execution.complexity === "Medium") riskScore -= 5;
    riskScore += getRuleEffect("RULE_13_REGULATORY_RISK");
    riskScore = Math.max(15, Math.min(98, riskScore));

    const risk: DimensionScore = {
      score: Math.round(riskScore),
      confidence: "Medium",
      evidenceLevel: 6,
      keyIssues:
        getRuleStatus("RULE_13_REGULATORY_RISK") !== "PASS"
          ? [`Unaddressed regulatory or compliance hurdles in ${facts.market.geography}.`]
          : [],
      suggestions: [
        `Conduct a regulatory compliance audit for ${tag0} solutions operating in ${facts.market.geography}.`,
        `Implement data security and privacy protocols early in product development.`,
      ],
    };

    // 8. Differentiation Score
    let diffScore = 45 + completenessBonus;
    const diffLen = (answers.differentiation || "").length;
    if (diffLen > 50) diffScore += 25;
    else if (diffLen > 20) diffScore += 12;

    diffScore += getRuleEffect("RULE_14_WEAK_MOAT");
    diffScore = Math.max(15, Math.min(98, diffScore));

    const differentiation: DimensionScore = {
      score: Math.round(diffScore),
      confidence: diffLen > 20 ? "High" : "Medium",
      evidenceLevel: Math.min(10, Math.max(2, Math.round(diffLen / 10))),
      keyIssues:
        getRuleStatus("RULE_14_WEAK_MOAT") !== "PASS"
          ? [`Differentiation moat relies on easily replicable features vs ${comps}.`]
          : [],
      suggestions: [
        `Articulate a defensible moat (e.g. proprietary dataset, network effects, or workflow lock-in).`,
        `Run competitive feature matrix tests directly with ${icp}.`,
      ],
    };

    // 9. Scalability Score
    let scaleScore = 50 + completenessBonus;
    if (facts.businessModel.primaryType === "SaaS" || facts.businessModel.primaryType === "Subscription") {
      scaleScore += 20;
    }
    if (facts.market.tamPotential === "Massive" || facts.market.tamPotential === "Large") {
      scaleScore += 15;
    } else if (facts.market.tamPotential === "Small") {
      scaleScore -= 25;
    }

    scaleScore += getRuleEffect("RULE_10_SWITCHING_COST_MISMATCH");
    scaleScore = Math.max(15, Math.min(98, scaleScore));

    const scalability: DimensionScore = {
      score: Math.round(scaleScore),
      confidence: "High",
      evidenceLevel: 7,
      keyIssues:
        getRuleStatus("RULE_10_SWITCHING_COST_MISMATCH") !== "PASS"
          ? [`High onboarding friction hinders self-serve customer acquisition for ${icp}.`]
          : [],
      suggestions: [
        `Optimize onboarding workflow to allow self-serve trial access for ${icp}.`,
        `Build automated distribution loops to scale acquisition without proportional headcount growth.`,
      ],
    };

    // 10. Investor Readiness Score
    const rawMean = (problemScore + customerScore + marketScore + competitionScore + modelScore + executionScore + riskScore + diffScore + scaleScore) / 9;
    const failCount = ruleOutcomes.filter((r) => r.status === "FAIL").length;
    const warnCount = ruleOutcomes.filter((r) => r.status === "WARNING").length;
    let readyScore = rawMean - (failCount * 8) - (warnCount * 3);
    readyScore = Math.max(15, Math.min(98, readyScore));

    const failRules = ruleOutcomes.filter((r) => r.status === "FAIL");
    const investorReadiness: DimensionScore = {
      score: Math.round(readyScore),
      confidence: "High",
      evidenceLevel: Math.round(Math.min(10, Math.max(3, validationBonus > 0 ? 8 : 4))),
      keyIssues: failRules.map((r) => `${r.name}: ${r.message}`),
      suggestions: [
        `Resolve critical rule warnings before pitching to seed investors.`,
        `Formalize customer validation metrics (${answers.currentValidation || 'interviews/LOIs'}) to strengthen valuation narrative.`,
      ],
    };

    // Calculate Overall Venture Score
    const overallScore = Math.round(
      problemScore * 0.16 +
      customerScore * 0.16 +
      marketScore * 0.16 +
      competitionScore * 0.12 +
      modelScore * 0.12 +
      executionScore * 0.10 +
      diffScore * 0.10 +
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
      overallScore: Math.max(15, Math.min(98, overallScore)),
    };
  }
}
