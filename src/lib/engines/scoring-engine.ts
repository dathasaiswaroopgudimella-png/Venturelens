import {
  ExtractedFacts,
  RuleOutcome,
  VentureScores,
  DimensionScore,
  QuestionnaireAnswers,
  ScoringEquation,
  ScoringEquationComponent,
} from "@/types";

export class ScoringEngine {
  calculate(
    facts: ExtractedFacts,
    ruleOutcomes: RuleOutcome[],
    answers: QuestionnaireAnswers
  ): { scores: VentureScores; equation: ScoringEquation } {
    const icp = facts.customer.icp || answers.targetCustomer || "target buyers";
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

    const valText = (answers.currentValidation || "").toLowerCase();
    const teamText = (answers.teamBackground || "").toLowerCase();
    const tamText = (answers.tamEstimate || "").toLowerCase();

    // 1. Evidence Verification Analyzers
    // Check if traction has real verifiable proof (paying customers, signed LOIs, named pilots)
    let tractionConfidence = 35; // Default unverified claim confidence
    let tractionRaw = 40;
    let tractionEvidenceRationale = "Unverified early concept without concrete pilot data.";

    if (/paying|\$\d+|₹\d+|arr|mrr|revenue|active contracts/i.test(valText)) {
      tractionConfidence = 92;
      tractionRaw = 90;
      tractionEvidenceRationale = "Verified revenue / paying customer metrics provided.";
    } else if (/loi|signed letter|pilot agreement|contract/i.test(valText)) {
      tractionConfidence = 80;
      tractionRaw = 75;
      tractionEvidenceRationale = "Verifiable Letters of Intent (LOIs) or pilot agreements referenced.";
    } else if (/waitlist|\d+\s*(users|signups|beta)/i.test(valText)) {
      tractionConfidence = 60;
      tractionRaw = 58;
      tractionEvidenceRationale = "Top-of-funnel waitlist / beta user interest without revenue validation.";
    } else if (/interview|\d+\s*conversations/i.test(valText)) {
      tractionConfidence = 50;
      tractionRaw = 50;
      tractionEvidenceRationale = "Qualitative discovery interviews completed; pending commercial validation.";
    }

    // Check team domain credibility
    let teamConfidence = 45;
    let teamRaw = 50;
    let teamEvidenceRationale = "Team background lacks specific industry credentials in target sector.";

    if (/founder|exited|scaled|vp|director|\d+\+?\s*years/i.test(teamText) && /(lead|engineer|health|finance|ai|domain)/i.test(teamText)) {
      teamConfidence = 90;
      teamRaw = 88;
      teamEvidenceRationale = "Proven domain leadership and prior track record in target vertical.";
    } else if (/engineer|developer|product manager|consultant/i.test(teamText)) {
      teamConfidence = 70;
      teamRaw = 68;
      teamEvidenceRationale = "Technical capability present; supplementary industry domain advisors recommended.";
    } else if (/student|beginner|early/i.test(teamText) || teamText.length < 25) {
      teamConfidence = 35;
      teamRaw = 42;
      teamEvidenceRationale = "Early-career team with execution risk in complex regulated environments.";
    }

    // Check TAM grounding
    let marketConfidence = 50;
    let marketRaw = 60;
    let marketEvidenceRationale = "Top-down market sizing estimate without bottom-up calculation.";

    if (/\$?\d+b|\$?\d+m|₹\d+\s*(crore|cr)/i.test(tamText) && (answers.geography?.length || 0) > 5) {
      marketConfidence = 75;
      marketRaw = facts.market.tamPotential === "Massive" ? 88 : facts.market.tamPotential === "Large" ? 78 : 65;
      marketEvidenceRationale = "Quantified TAM sizing with defined geographic boundaries.";
    } else if (tamText.length > 5) {
      marketConfidence = 55;
      marketRaw = 60;
      marketEvidenceRationale = "Estimated addressable market requires bottom-up unit-economics verification.";
    }

    // Problem Evidence
    let problemConfidence = answers.problemSolved.length > 50 ? 85 : answers.problemSolved.length > 25 ? 65 : 45;
    let problemRaw = 60;
    if (facts.problem.frequency === "Daily") problemRaw += 18;
    else if (facts.problem.frequency === "Weekly") problemRaw += 8;
    else if (facts.problem.frequency === "Rarely") problemRaw -= 15;

    if (facts.problem.painSeverity === "Critical") problemRaw += 15;
    else if (facts.problem.painSeverity === "Convenience") problemRaw -= 18;
    problemRaw += getRuleEffect("RULE_07_LOW_PAIN");
    problemRaw = Math.max(20, Math.min(98, problemRaw));

    // Customer Evidence
    let customerConfidence = answers.targetCustomer.length > 40 ? 80 : 55;
    let customerRaw = 60;
    if (facts.customer.icp.length > 30) customerRaw += 15;
    customerRaw += getRuleEffect("RULE_01_PRICE_ICP_MISMATCH");
    customerRaw += getRuleEffect("RULE_15_ICP_DIST_MISMATCH");
    customerRaw = Math.max(20, Math.min(98, customerRaw));

    // Business Model Evidence
    let modelConfidence = answers.pricingStrategy.length > 20 ? 80 : 50;
    let modelRaw = 65;
    if (facts.businessModel.primaryType === "SaaS" || facts.businessModel.primaryType === "Subscription") modelRaw += 15;
    modelRaw += getRuleEffect("RULE_05_SAAS_ONE_TIME");
    modelRaw += getRuleEffect("RULE_06_MARGIN_COLLAPSE");
    modelRaw = Math.max(20, Math.min(98, modelRaw));

    // Competition & Moat Evidence
    let compConfidence = (answers.competitors?.length || 0) > 10 && answers.differentiation.length > 30 ? 80 : 50;
    let compRaw = 60;
    if (answers.differentiation.length > 50) compRaw += 18;
    compRaw += getRuleEffect("RULE_03_BLIND_SPOT");
    compRaw += getRuleEffect("RULE_14_WEAK_MOAT");
    compRaw = Math.max(20, Math.min(98, compRaw));

    // Risk Score
    const failRules = ruleOutcomes.filter((r) => r.status === "FAIL");
    const warnRules = ruleOutcomes.filter((r) => r.status === "WARNING");
    let riskRaw = 80 - (failRules.length * 18) - (warnRules.length * 7);
    riskRaw = Math.max(20, Math.min(95, riskRaw));
    let riskConfidence = 75;

    // 2. Build Components with Transparent Adjusted Equation
    // Adjusted Score = Raw Score * (0.55 + 0.45 * (Evidence Confidence / 100))
    const calcAdjusted = (raw: number, conf: number) => Math.round(raw * (0.55 + 0.45 * (conf / 100)));

    const components: ScoringEquationComponent[] = [
      {
        dimension: "Problem Urgency & Severity",
        weight: 20,
        rawScore: problemRaw,
        evidenceConfidence: problemConfidence,
        adjustedScore: calcAdjusted(problemRaw, problemConfidence),
        weightedContribution: Number(((calcAdjusted(problemRaw, problemConfidence) * 20) / 100).toFixed(1)),
        evidenceRationale: "Evaluates pain severity, operational friction, and daily/weekly frequency.",
      },
      {
        dimension: "Target Customer (ICP) & Access",
        weight: 15,
        rawScore: customerRaw,
        evidenceConfidence: customerConfidence,
        adjustedScore: calcAdjusted(customerRaw, customerConfidence),
        weightedContribution: Number(((calcAdjusted(customerRaw, customerConfidence) * 15) / 100).toFixed(1)),
        evidenceRationale: "Measures customer persona specificity and alignment with acquisition channels.",
      },
      {
        dimension: "Market Size & Timing (TAM)",
        weight: 15,
        rawScore: marketRaw,
        evidenceConfidence: marketConfidence,
        adjustedScore: calcAdjusted(marketRaw, marketConfidence),
        weightedContribution: Number(((calcAdjusted(marketRaw, marketConfidence) * 15) / 100).toFixed(1)),
        evidenceRationale: marketEvidenceRationale,
      },
      {
        dimension: "Business Model & Unit Economics",
        weight: 15,
        rawScore: modelRaw,
        evidenceConfidence: modelConfidence,
        adjustedScore: calcAdjusted(modelRaw, modelConfidence),
        weightedContribution: Number(((calcAdjusted(modelRaw, modelConfidence) * 15) / 100).toFixed(1)),
        evidenceRationale: "Assesses recurring revenue quality, pricing logic, and gross margin profile.",
      },
      {
        dimension: "Competitive Advantage & Moat",
        weight: 10,
        rawScore: compRaw,
        evidenceConfidence: compConfidence,
        adjustedScore: calcAdjusted(compRaw, compConfidence),
        weightedContribution: Number(((calcAdjusted(compRaw, compConfidence) * 10) / 100).toFixed(1)),
        evidenceRationale: "Evaluates defensibility against incumbents, switching costs, and replication speed.",
      },
      {
        dimension: "Team-Domain Execution Fit",
        weight: 10,
        rawScore: teamRaw,
        evidenceConfidence: teamConfidence,
        adjustedScore: calcAdjusted(teamRaw, teamConfidence),
        weightedContribution: Number(((calcAdjusted(teamRaw, teamConfidence) * 10) / 100).toFixed(1)),
        evidenceRationale: teamEvidenceRationale,
      },
      {
        dimension: "Traction & Empirical Evidence",
        weight: 10,
        rawScore: tractionRaw,
        evidenceConfidence: tractionConfidence,
        adjustedScore: calcAdjusted(tractionRaw, tractionConfidence),
        weightedContribution: Number(((calcAdjusted(tractionRaw, tractionConfidence) * 10) / 100).toFixed(1)),
        evidenceRationale: tractionEvidenceRationale,
      },
      {
        dimension: "Execution & Regulatory Risk",
        weight: 5,
        rawScore: riskRaw,
        evidenceConfidence: riskConfidence,
        adjustedScore: calcAdjusted(riskRaw, riskConfidence),
        weightedContribution: Number(((calcAdjusted(riskRaw, riskConfidence) * 5) / 100).toFixed(1)),
        evidenceRationale: "Flags critical failure rules, compliance barriers, and liability exposures.",
      },
    ];

    const rawScoreTotal = Math.round(
      components.reduce((sum, c) => sum + (c.rawScore * c.weight) / 100, 0)
    );

    const overallEvidenceConfidence = Math.round(
      components.reduce((sum, c) => sum + (c.evidenceConfidence * c.weight) / 100, 0)
    );

    const finalAdjustedScore = Math.min(
      98,
      Math.max(
        15,
        Math.round(components.reduce((sum, c) => sum + c.weightedContribution, 0))
      )
    );

    const scoringEquation: ScoringEquation = {
      rawScoreTotal,
      overallEvidenceConfidence,
      finalAdjustedScore,
      formulaDescription: "Adjusted Score = Σ [ Dimension Weight × Raw Score × (0.55 + 0.45 × Evidence Confidence) ]",
      components,
    };

    // Construct DimensionScores
    const problem: DimensionScore = {
      score: components[0].adjustedScore,
      rawScore: components[0].rawScore,
      evidenceConfidence: components[0].evidenceConfidence,
      weight: 0.20,
      contribution: components[0].weightedContribution,
      confidence: problemConfidence >= 75 ? "High" : "Medium",
      evidenceLevel: Math.round(problemConfidence / 10),
      keyIssues:
        getRuleStatus("RULE_07_LOW_PAIN") !== "PASS"
          ? [`Problem severity for ${icp} is classified as convenience-level or low frequency.`]
          : [],
      suggestions: [
        `Conduct 15 structured problem discovery interviews with ${icp} to quantify workflow hours lost.`,
        `Benchmark problem urgency against existing manual workarounds in ${tag0}.`,
      ],
    };

    const customer: DimensionScore = {
      score: components[1].adjustedScore,
      rawScore: components[1].rawScore,
      evidenceConfidence: components[1].evidenceConfidence,
      weight: 0.15,
      contribution: components[1].weightedContribution,
      confidence: customerConfidence >= 75 ? "High" : "Medium",
      evidenceLevel: Math.round(customerConfidence / 10),
      keyIssues: [
        ...(getRuleStatus("RULE_01_PRICE_ICP_MISMATCH") !== "PASS"
          ? [`High pricing threshold paired with price-sensitive segment (${icp}).`]
          : []),
        ...(getRuleStatus("RULE_15_ICP_DIST_MISMATCH") !== "PASS"
          ? [`Distribution channel mismatch for reaching ${icp}.`]
          : []),
      ],
      suggestions: [
        `Segment ${icp} into early adopter beachheads with shortest sales cycles.`,
        `Verify economic buyer willingness-to-pay before extensive product development.`,
      ],
    };

    const market: DimensionScore = {
      score: components[2].adjustedScore,
      rawScore: components[2].rawScore,
      evidenceConfidence: components[2].evidenceConfidence,
      weight: 0.15,
      contribution: components[2].weightedContribution,
      confidence: marketConfidence >= 75 ? "High" : "Medium",
      evidenceLevel: Math.round(marketConfidence / 10),
      keyIssues: [
        ...(getRuleStatus("RULE_02_TINY_TAM") !== "PASS" ? [`Restricted TAM for ${tag0} in ${facts.market.geography}.`] : []),
        ...(getRuleStatus("RULE_09_GEOGRAPHY_GAP") !== "PASS" ? [`Vague launch geography without a focused beachhead territory.`] : []),
      ],
      suggestions: [
        `Build a bottom-up TAM sizing model based on target accounts × average contract value.`,
        `Establish early market dominance in a focused regional territory before international expansion.`,
      ],
    };

    const businessModel: DimensionScore = {
      score: components[3].adjustedScore,
      rawScore: components[3].rawScore,
      evidenceConfidence: components[3].evidenceConfidence,
      weight: 0.15,
      contribution: components[3].weightedContribution,
      confidence: modelConfidence >= 75 ? "High" : "Medium",
      evidenceLevel: Math.round(modelConfidence / 10),
      keyIssues: [
        ...(getRuleStatus("RULE_05_SAAS_ONE_TIME") !== "PASS" ? ["One-time transaction model limits customer lifetime value (LTV)."] : []),
        ...(getRuleStatus("RULE_06_MARGIN_COLLAPSE") !== "PASS" ? ["High cost-of-goods-sold (COGS) threatens unit economics scalability."] : []),
      ],
      suggestions: [
        `Structure recurring subscription or usage-based tiers to maximize net revenue retention.`,
        `Model CAC payback period target under 12 months for sustainable payback.`,
      ],
    };

    const competition: DimensionScore = {
      score: components[4].adjustedScore,
      rawScore: components[4].rawScore,
      evidenceConfidence: components[4].evidenceConfidence,
      weight: 0.10,
      contribution: components[4].weightedContribution,
      confidence: compConfidence >= 75 ? "High" : "Medium",
      evidenceLevel: Math.round(compConfidence / 10),
      keyIssues: [
        ...(getRuleStatus("RULE_03_BLIND_SPOT") !== "PASS" ? [`Direct competitor overlap in ${tag0} requires differentiation defense.`] : []),
        ...(getRuleStatus("RULE_14_WEAK_MOAT") !== "PASS" ? [`Moat relies on features easily copied by incumbents (${comps}).`] : []),
      ],
      suggestions: [
        `Build proprietary data network effects or deep workflow integration moats.`,
        `Document competitor feature matrix and position on 10x speed or cost advantage.`,
      ],
    };

    const execution: DimensionScore = {
      score: components[5].adjustedScore,
      rawScore: components[5].rawScore,
      evidenceConfidence: components[5].evidenceConfidence,
      weight: 0.10,
      contribution: components[5].weightedContribution,
      confidence: teamConfidence >= 75 ? "High" : "Medium",
      evidenceLevel: Math.round(teamConfidence / 10),
      keyIssues:
        getRuleStatus("RULE_08_SOLO_FOUNDER") !== "PASS"
          ? ["Solo founder structure carries single-point execution bottlenecks."]
          : teamConfidence < 50
          ? ["Team lacks specialized industry track record in target vertical."]
          : [],
      suggestions: [
        `Recruit domain-expert advisors or technical co-founders with direct industry relationships.`,
        `Define 90-day milestone execution roadmap with clear pilot deliverables.`,
      ],
    };

    const risk: DimensionScore = {
      score: components[7].adjustedScore,
      rawScore: components[7].rawScore,
      evidenceConfidence: components[7].evidenceConfidence,
      weight: 0.05,
      contribution: components[7].weightedContribution,
      confidence: "High",
      evidenceLevel: 8,
      keyIssues: failRules.map((r) => `${r.name}: ${r.message}`),
      suggestions: [
        `Address critical validation failures before committing full-scale development capital.`,
        `Establish formal pilot milestone gates to manage cash burn rate.`,
      ],
    };

    const differentiation: DimensionScore = {
      score: components[4].adjustedScore,
      confidence: compConfidence >= 75 ? "High" : "Medium",
      evidenceLevel: Math.round(compConfidence / 10),
      keyIssues: [],
      suggestions: [`Strengthen proprietary IP, workflow lock-in, and switching barriers against ${comps}.`],
    };

    const scalability: DimensionScore = {
      score: Math.round((market.score + businessModel.score) / 2),
      confidence: "High",
      evidenceLevel: 7,
      keyIssues: [],
      suggestions: [`Automate digital onboarding loops to scale account volume without headcount overhead.`],
    };

    const investorReadiness: DimensionScore = {
      score: finalAdjustedScore,
      confidence: overallEvidenceConfidence >= 75 ? "High" : "Medium",
      evidenceLevel: Math.round(overallEvidenceConfidence / 10),
      keyIssues: failRules.map((r) => r.message),
      suggestions: [
        `Prepare institutional evidence data room with pilot LOIs and cohort retention tracking.`,
        `Execute recommended 14-day validation experiment prior to seed round pitching.`,
      ],
    };

    return {
      scores: {
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
        overallScore: finalAdjustedScore,
      },
      equation: scoringEquation,
    };
  }
}
