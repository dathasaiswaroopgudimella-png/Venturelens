import {
  ExtractedFacts,
  RuleOutcome,
  VentureScores,
  DimensionScore,
  QuestionnaireAnswers,
  ScoringEquation,
  ScoringEquationComponent,
} from "@/types";
import { isNonCommercialSubmission } from "@/lib/utils/clean-inputs";

function makeDimScore(
  score: number,
  weight: number,
  confidence: number,
  keyIssues: string[],
  suggestions: string[],
  reasoning: string
): DimensionScore {
  return {
    score,
    rawScore: score,
    evidenceConfidence: confidence,
    weight: weight / 100,
    contribution: Number(((score * weight) / 100).toFixed(1)),
    confidence: confidence >= 75 ? "High" : confidence >= 50 ? "Medium" : "Low",
    evidenceLevel: Math.round(confidence / 10),
    keyIssues,
    suggestions,
    reasoning,
  };
}

export class ScoringEngine {
  calculate(
    facts: ExtractedFacts,
    ruleOutcomes: RuleOutcome[],
    answers: QuestionnaireAnswers
  ): { scores: VentureScores; equation: ScoringEquation } {
    const isNonCommercial = isNonCommercialSubmission(answers.idea, answers);

    const getRuleEffect = (id: string) => {
      const rule = ruleOutcomes.find((r) => r.id === id);
      return rule && rule.status !== "PASS" ? rule.impactScoreEffect : 0;
    };

    const valText = (answers.currentValidation || "").toLowerCase();
    const teamText = (answers.teamBackground || "").toLowerCase();
    const tamText = (answers.tamEstimate || "").toLowerCase();
    const probText = (answers.problemSolved || "").toLowerCase();
    const custText = (answers.targetCustomer || "").toLowerCase();
    const priceText = (answers.pricingStrategy || "").toLowerCase();
    const moatText = (answers.differentiation || "").toLowerCase();

    // ─── NON-COMMERCIAL / NONSENSE THESIS BRANCH ──────────────────────────────
    if (isNonCommercial) {
      const ncComponents: ScoringEquationComponent[] = [
        {
          dimension: "Problem Urgency & Severity",
          weight: 20,
          rawScore: 8,
          evidenceConfidence: 10,
          adjustedScore: 6,
          weightedContribution: 1.2,
          evidenceRationale: "No identifiable commercial problem or operational friction defined.",
        },
        {
          dimension: "Target Customer (ICP) & Access",
          weight: 15,
          rawScore: 6,
          evidenceConfidence: 10,
          adjustedScore: 5,
          weightedContribution: 0.8,
          evidenceRationale: "No addressable commercial customer segment with willingness-to-pay.",
        },
        {
          dimension: "Market Size & Timing (TAM)",
          weight: 15,
          rawScore: 5,
          evidenceConfidence: 5,
          adjustedScore: 4,
          weightedContribution: 0.6,
          evidenceRationale: "Zero addressable commercial market size identified.",
        },
        {
          dimension: "Business Model & Unit Economics",
          weight: 15,
          rawScore: 6,
          evidenceConfidence: 10,
          adjustedScore: 5,
          weightedContribution: 0.8,
          evidenceRationale: "No revenue mechanism, unit economics, or pricing model.",
        },
        {
          dimension: "Competitive Advantage & Moat",
          weight: 10,
          rawScore: 8,
          evidenceConfidence: 10,
          adjustedScore: 6,
          weightedContribution: 0.6,
          evidenceRationale: "No defensible intellectual property, data moat, or workflow lock-in.",
        },
        {
          dimension: "Team-Domain Execution Fit",
          weight: 10,
          rawScore: 15,
          evidenceConfidence: 15,
          adjustedScore: 10,
          weightedContribution: 1.0,
          evidenceRationale: "Founding credentials not applicable to commercial venture thesis.",
        },
        {
          dimension: "Traction & Empirical Evidence",
          weight: 10,
          rawScore: 5,
          evidenceConfidence: 5,
          adjustedScore: 4,
          weightedContribution: 0.4,
          evidenceRationale: "Zero commercial traction, pilots, or customer validation.",
        },
        {
          dimension: "Structural & Regulatory Risk",
          weight: 5,
          rawScore: 10,
          evidenceConfidence: 10,
          adjustedScore: 8,
          weightedContribution: 0.4,
          evidenceRationale: "Severe viability risk: Non-commercial submission.",
        },
      ];

      const ncOverall = 6;
      const ncScores: VentureScores = {
        problem: makeDimScore(6, 20, 10, ["No commercial problem defined"], ["Define an acute customer pain point"], "No solvable commercial problem identified."),
        customer: makeDimScore(5, 15, 10, ["No paying customer segment"], ["Identify target economic buyers"], "No paying target customer segment."),
        market: makeDimScore(4, 15, 5, ["Zero addressable market"], ["Research industry market sizing"], "Zero addressable commercial market."),
        businessModel: makeDimScore(5, 15, 10, ["No revenue model"], ["Define SaaS or transaction pricing"], "No monetization model or pricing logic."),
        competition: makeDimScore(6, 10, 10, ["No differentiation"], ["Build defensible moat"], "No defensible competitive advantage."),
        execution: makeDimScore(10, 10, 15, ["Execution undefined"], ["Assemble relevant team"], "Non-commercial execution scope."),
        differentiation: makeDimScore(6, 10, 10, ["No defensibility"], ["Formulate IP/data moat"], "No proprietary differentiation."),
        scalability: makeDimScore(4, 10, 5, ["Non-scalable"], ["Re-evaluate venture model"], "Zero venture scalability potential."),
        investorReadiness: makeDimScore(5, 10, 5, ["Ineligible for investment"], ["Formulate validated business thesis"], "Submission does not meet venture criteria."),
        risk: makeDimScore(8, 5, 10, ["Extreme feasibility risk"], ["Halt and discover real customer problem"], "Extreme viability risk: Non-business submission."),
        overallScore: ncOverall,
      };

      const ncEquation: ScoringEquation = {
        rawScoreTotal: 63,
        overallEvidenceConfidence: 10,
        finalAdjustedScore: ncOverall,
        formulaDescription: "Adjusted Score = Σ [ Raw Score × (0.55 + 0.45 × (Confidence / 100)) × Weight% ]",
        components: ncComponents,
      };

      return { scores: ncScores, equation: ncEquation };
    }

    // ─── COMMERCIAL VENTURE EVALUATION ────────────────────────────────────────

    // 1. Traction & Empirical Evidence
    let tractionConfidence = 25;
    let tractionRaw = 28;
    let tractionEvidenceRationale = "Early conceptual stage with unverified customer demand.";

    if (/paying|\$\d+|₹\d+|arr|mrr|revenue|active contracts/i.test(valText)) {
      tractionConfidence = 95;
      tractionRaw = 92;
      tractionEvidenceRationale = "Verified paying customers or recurring ARR milestones documented.";
    } else if (/loi|signed letter|pilot agreement|contract|partnership/i.test(valText)) {
      tractionConfidence = 82;
      tractionRaw = 78;
      tractionEvidenceRationale = "Signed Letters of Intent (LOIs) or commercial pilot agreements referenced.";
    } else if (/waitlist|\d+\s*(users|signups|beta|downloads)/i.test(valText)) {
      tractionConfidence = 62;
      tractionRaw = 58;
      tractionEvidenceRationale = "Top-of-funnel waitlist or beta user signups without paid validation.";
    } else if (/interview|\d+\s*conversations|survey/i.test(valText)) {
      tractionConfidence = 50;
      tractionRaw = 48;
      tractionEvidenceRationale = "Qualitative discovery interviews completed; pending commercial pilots.";
    } else if (valText.length > 25 && !/none|not yet|idea stage/i.test(valText)) {
      tractionConfidence = 40;
      tractionRaw = 38;
      tractionEvidenceRationale = "Initial working prototype or validation efforts described.";
    }

    // 2. Team & Domain Execution Fit
    let teamConfidence = 40;
    let teamRaw = 45;
    let teamEvidenceRationale = "Founding credentials lack specific industry track record in target vertical.";

    if (
      /founder|exited|scaled|vp|director|principal|\d+\+?\s*years/i.test(teamText) &&
      /(lead|engineer|health|finance|ai|thermal|infrastructure|cooling|security|data)/i.test(teamText)
    ) {
      teamConfidence = 92;
      teamRaw = 90;
      teamEvidenceRationale = "Proven domain leadership, technical depth, and industry track record.";
    } else if (/engineer|developer|product manager|consultant|architect|scientist/i.test(teamText)) {
      teamConfidence = 72;
      teamRaw = 70;
      teamEvidenceRationale = "Technical execution capability present; vertical industry advisors recommended.";
    } else if (/student|junior|beginner/i.test(teamText) || teamText.length < 20) {
      teamConfidence = 30;
      teamRaw = 35;
      teamEvidenceRationale = "Early-stage team with execution risk in complex competitive environments.";
    }

    // 3. Market Size & Timing (TAM)
    let marketConfidence = 45;
    let marketRaw = 50;
    let marketEvidenceRationale = "Top-down market sizing estimate without bottom-up unit breakdown.";

    if (/\$?\d+b|\$?\d+m|₹\d+\s*(crore|cr)/i.test(tamText) && (answers.geography?.length || 0) > 3) {
      marketConfidence = 80;
      marketRaw = facts.market.tamPotential === "Large" ? 88 : 75;
      marketEvidenceRationale = "Quantified TAM sizing with defined geographic boundaries.";
    } else if (tamText.length > 10) {
      marketConfidence = 55;
      marketRaw = 60;
      marketEvidenceRationale = "Estimated addressable market requires bottom-up unit-economics verification.";
    }

    // 4. Problem Urgency & Severity
    let problemConfidence = probText.length > 60 ? 88 : probText.length > 25 ? 68 : 38;
    let problemRaw = 55;
    if (facts.problem.frequency === "Daily") problemRaw += 18;
    else if (facts.problem.frequency === "Weekly") problemRaw += 8;
    else if (facts.problem.frequency === "Rarely") problemRaw -= 20;

    if (facts.problem.painSeverity === "Critical") problemRaw += 18;
    else if (facts.problem.painSeverity === "Convenience") problemRaw -= 22;

    problemRaw += getRuleEffect("RULE_07_LOW_PAIN");
    problemRaw += getRuleEffect("RULE_10_NO_PROBLEM");
    problemRaw = Math.max(15, Math.min(98, problemRaw));

    // 5. Customer (ICP) & Access
    let customerConfidence = custText.length > 45 ? 85 : custText.length > 20 ? 65 : 35;
    let customerRaw = 55;
    if (facts.customer.icp.length > 25 && !/everyone|anyone/i.test(custText)) customerRaw += 18;
    customerRaw += getRuleEffect("RULE_01_PRICE_ICP_MISMATCH");
    customerRaw += getRuleEffect("RULE_11_NO_CUSTOMER");
    customerRaw += getRuleEffect("RULE_15_ICP_DIST_MISMATCH");
    customerRaw = Math.max(15, Math.min(98, customerRaw));

    // 6. Business Model & Unit Economics
    let modelConfidence = priceText.length > 20 ? 82 : priceText.length > 10 ? 60 : 35;
    let modelRaw = 55;
    if (facts.businessModel.primaryType === "SaaS" || facts.businessModel.primaryType === "Subscription" || facts.businessModel.primaryType === "Licensing") {
      modelRaw += 18;
    }
    modelRaw += getRuleEffect("RULE_05_SAAS_ONE_TIME");
    modelRaw += getRuleEffect("RULE_04_MARKETPLACE_SUPPLY");
    modelRaw = Math.max(15, Math.min(98, modelRaw));

    // 7. Competitive Advantage & Moat
    let compConfidence = (answers.competitors?.length || 0) > 10 && moatText.length > 30 ? 82 : moatText.length > 15 ? 55 : 30;
    let compRaw = 50;
    if (moatText.length > 45 && !/none|first mover|dont have/i.test(moatText)) compRaw += 22;
    compRaw += getRuleEffect("RULE_03_CROWDED_WEAK_MOAT");
    compRaw += getRuleEffect("RULE_14_WEAK_MOAT");
    compRaw = Math.max(15, Math.min(98, compRaw));

    // 8. Execution & Scalability Risk
    const failRules = ruleOutcomes.filter((r) => r.status === "FAIL");
    const warnRules = ruleOutcomes.filter((r) => r.status === "WARNING");
    let riskRaw = 85 - failRules.length * 18 - warnRules.length * 6;
    riskRaw = Math.max(15, Math.min(95, riskRaw));
    let riskConfidence = 75;

    // Adjusted Equation: Score = Raw Score * (0.55 + 0.45 * (Confidence / 100))
    const calcAdjusted = (raw: number, conf: number) =>
      Math.max(8, Math.min(98, Math.round(raw * (0.55 + 0.45 * (conf / 100)))));

    const problemAdjusted = calcAdjusted(problemRaw, problemConfidence);
    const customerAdjusted = calcAdjusted(customerRaw, customerConfidence);
    const marketAdjusted = calcAdjusted(marketRaw, marketConfidence);
    const modelAdjusted = calcAdjusted(modelRaw, modelConfidence);
    const compAdjusted = calcAdjusted(compRaw, compConfidence);
    const teamAdjusted = calcAdjusted(teamRaw, teamConfidence);
    const tractionAdjusted = calcAdjusted(tractionRaw, tractionConfidence);
    const riskAdjusted = calcAdjusted(riskRaw, riskConfidence);

    const components: ScoringEquationComponent[] = [
      {
        dimension: "Problem Urgency & Severity",
        weight: 20,
        rawScore: problemRaw,
        evidenceConfidence: problemConfidence,
        adjustedScore: problemAdjusted,
        weightedContribution: Number(((problemAdjusted * 20) / 100).toFixed(1)),
        evidenceRationale: "Evaluates pain severity, operational friction, and frequency.",
      },
      {
        dimension: "Target Customer (ICP) & Access",
        weight: 15,
        rawScore: customerRaw,
        evidenceConfidence: customerConfidence,
        adjustedScore: customerAdjusted,
        weightedContribution: Number(((customerAdjusted * 15) / 100).toFixed(1)),
        evidenceRationale: "Measures customer persona specificity and alignment with acquisition channels.",
      },
      {
        dimension: "Market Size & Timing (TAM)",
        weight: 15,
        rawScore: marketRaw,
        evidenceConfidence: marketConfidence,
        adjustedScore: marketAdjusted,
        weightedContribution: Number(((marketAdjusted * 15) / 100).toFixed(1)),
        evidenceRationale: marketEvidenceRationale,
      },
      {
        dimension: "Business Model & Unit Economics",
        weight: 15,
        rawScore: modelRaw,
        evidenceConfidence: modelConfidence,
        adjustedScore: modelAdjusted,
        weightedContribution: Number(((modelAdjusted * 15) / 100).toFixed(1)),
        evidenceRationale: "Assesses recurring revenue quality, pricing logic, and gross margins.",
      },
      {
        dimension: "Competitive Advantage & Moat",
        weight: 10,
        rawScore: compRaw,
        evidenceConfidence: compConfidence,
        adjustedScore: compAdjusted,
        weightedContribution: Number(((compAdjusted * 10) / 100).toFixed(1)),
        evidenceRationale: "Evaluates defensibility against incumbents and replication speed.",
      },
      {
        dimension: "Team-Domain Execution Fit",
        weight: 10,
        rawScore: teamRaw,
        evidenceConfidence: teamConfidence,
        adjustedScore: teamAdjusted,
        weightedContribution: Number(((teamAdjusted * 10) / 100).toFixed(1)),
        evidenceRationale: teamEvidenceRationale,
      },
      {
        dimension: "Traction & Empirical Evidence",
        weight: 10,
        rawScore: tractionRaw,
        evidenceConfidence: tractionConfidence,
        adjustedScore: tractionAdjusted,
        weightedContribution: Number(((tractionAdjusted * 10) / 100).toFixed(1)),
        evidenceRationale: tractionEvidenceRationale,
      },
      {
        dimension: "Structural & Regulatory Risk",
        weight: 5,
        rawScore: riskRaw,
        evidenceConfidence: riskConfidence,
        adjustedScore: riskAdjusted,
        weightedContribution: Number(((riskAdjusted * 5) / 100).toFixed(1)),
        evidenceRationale: "Consolidates deterministic rule flags and structural adoption barriers.",
      },
    ];

    const overallScore = Math.max(
      8,
      Math.min(
        98,
        Math.round(components.reduce((sum, c) => sum + c.weightedContribution, 0))
      )
    );

    const scores: VentureScores = {
      problem: makeDimScore(problemAdjusted, 20, problemConfidence, [facts.problem.frequency], ["Prioritize high-severity pain point"], `Problem severity (${facts.problem.painSeverity}) with ${facts.problem.frequency.toLowerCase()} frequency.`),
      customer: makeDimScore(customerAdjusted, 15, customerConfidence, [facts.customer.icp], ["Narrow target beachhead"], `Target ICP (${facts.customer.icp}) evaluated for accessibility and willingness-to-pay.`),
      market: makeDimScore(marketAdjusted, 15, marketConfidence, [facts.market.tamPotential], ["Quantify bottom-up TAM"], marketEvidenceRationale),
      businessModel: makeDimScore(modelAdjusted, 15, modelConfidence, [facts.businessModel.primaryType], ["Optimize gross margins and LTV"], `Monetization model (${facts.businessModel.primaryType}) and pricing structure.`),
      competition: makeDimScore(compAdjusted, 10, compConfidence, facts.competition.competitorList, ["Build proprietary workflow moat"], "Defensibility moat and competitive barrier profile."),
      execution: makeDimScore(teamAdjusted, 10, teamConfidence, [facts.execution.complexity], ["Recruit domain veterans"], teamEvidenceRationale),
      differentiation: makeDimScore(compAdjusted, 10, compConfidence, [], ["Strengthen IP/data moat"], "Defensibility moat and competitive barrier profile."),
      scalability: makeDimScore(Math.round((marketAdjusted + modelAdjusted) / 2), 10, Math.round((marketConfidence + modelConfidence) / 2), [], ["Accelerate distribution loop"], "Market scalability and margin leverage profile."),
      investorReadiness: makeDimScore(overallScore, 10, Math.round((problemConfidence + tractionConfidence) / 2), [], ["Prepare institutional data room"], `Overall venture readiness score of ${overallScore}/100.`),
      risk: makeDimScore(riskAdjusted, 5, riskConfidence, failRules.map((f) => f.name), ["Mitigate identified failure gates"], `Consolidated rule risk: ${failRules.length} critical fails, ${warnRules.length} warnings.`),
      overallScore,
    };

    const overallEvidenceConfidence = Math.round(
      components.reduce((sum, c) => sum + c.evidenceConfidence * (c.weight / 100), 0)
    );

    const equation: ScoringEquation = {
      rawScoreTotal: components.reduce((sum, c) => sum + c.rawScore, 0),
      overallEvidenceConfidence,
      finalAdjustedScore: overallScore,
      formulaDescription: "Adjusted Score = Σ [ Raw Score × (0.55 + 0.45 × (Confidence / 100)) × Weight% ]",
      components,
    };

    return { scores, equation };
  }
}
