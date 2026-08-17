import { ExtractedFacts, RuleOutcome, VentureScores, Recommendation, QuestionnaireAnswers } from "@/types";
import { isNonCommercialSubmission, formatBuyerPersona, formatGeography } from "@/lib/utils/clean-inputs";

export class RecommendationEngine {
  generate(
    facts: ExtractedFacts,
    ruleOutcomes: RuleOutcome[],
    scores: VentureScores,
    answers?: QuestionnaireAnswers
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];
    let recIdCounter = 1;

    const shortIcp = formatBuyerPersona(facts.customer.icp);
    const tag0 = facts.market.industryTags[0] || "Industry";
    const geo = formatGeography(facts.market.geography);
    const comps = facts.competition.competitorList.slice(0, 3).join(", ") || "incumbent solutions";
    const isHardwareOrDeepTech = facts.market.industryTags.some((t) =>
      /infrastructure|deeptech|cleantech|energy|hardware|cooling/i.test(t)
    );

    const addRec = (
      priority: "Critical" | "High" | "Medium" | "Low",
      title: string,
      description: string,
      timeframe: string
    ) => {
      recommendations.push({
        id: `REC_${String(recIdCounter++).padStart(2, "0")}`,
        priority,
        title,
        description,
        timeframe,
      });
    };

    // 0. Non-Commercial / Nonsense Thesis Branch — use actual isNonCommercial check
    const nonCommercial = answers
      ? isNonCommercialSubmission(answers.idea, answers)
      : scores.overallScore < 20;

    if (nonCommercial || scores.overallScore < 20) {
      addRec(
        "Critical",
        "Formulate an Addressable Problem Statement",
        "Define an acute operational or consumer problem where legacy methods cause measurable financial, time, or operational loss.",
        "Immediate Action"
      );
      addRec(
        "Critical",
        "Identify a Specific Target Buyer Persona",
        "Pinpoint the exact economic decision-maker (job title, industry, budget authority) who actively pays to solve this friction.",
        "Next 14 Days"
      );
      addRec(
        "High",
        "Define Monetization & Unit Economics Model",
        "Determine viable pricing (annual SaaS, usage fee, licensing) where customer Lifetime Value (LTV) comfortably exceeds Acquisition Cost (CAC).",
        "Next 30 Days"
      );
      return recommendations;
    }

    // 1. Critical priorities based on rule failures
    const failures = ruleOutcomes.filter((r) => r.status === "FAIL");
    failures.forEach((f) => {
      if (f.id === "RULE_02_TINY_TAM") {
        addRec(
          "Critical",
          `Expand Addressable Beachhead in ${tag0}`,
          `Broaden target deployment parameters beyond the initial cohort to include enterprise accounts across ${geo} to unlock venture scale.`,
          "Immediate Action"
        );
      } else if (f.id === "RULE_03_CROWDED_WEAK_MOAT") {
        addRec(
          "Critical",
          `Establish Quantitative Defensibility vs ${comps}`,
          `Formulate defensible proprietary data moats, retrofit compatibility, or patented efficiency speedups to prevent margin erosion against ${comps}.`,
          "Immediate Action"
        );
      } else if (f.id === "RULE_08_NO_VALIDATION") {
        addRec(
          "Critical",
          `Secure 3 Paid Pilot Letters of Intent with ${shortIcp}`,
          `Run structured problem discovery meetings with 15 verified ${shortIcp} decision makers to validate willingness-to-pay and baseline payback periods.`,
          "Immediate Action"
        );
      } else if (f.id === "RULE_06_COMPLEXITY_RESOURCES") {
        addRec(
          "Critical",
          `Onboard Domain Specialist Advisors for ${tag0}`,
          `Due to engineering and operational complexity, recruit seasoned technical veterans with direct ${tag0} deployment experience.`,
          "Immediate Action"
        );
      } else if (f.id === "RULE_10_NO_PROBLEM") {
        addRec(
          "Critical",
          "Conduct 15 Problem Discovery Interviews",
          `Interview 15 prospective ${shortIcp} to quantify their unprompted pain points and current manual workarounds.`,
          "Immediate Action"
        );
      } else if (f.id === "RULE_11_NO_CUSTOMER") {
        addRec(
          "Critical",
          "Narrow ICP to a Concrete Beachhead Segment",
          `Define a narrow, high-urgency buyer persona in ${tag0} rather than targeting a broad, undifferentiated market.`,
          "Immediate Action"
        );
      }
    });

    // 2. High priorities based on rule warnings or medium scores (< 60)
    const warnings = ruleOutcomes.filter((r) => r.status === "WARNING");
    warnings.forEach((w) => {
      if (w.id === "RULE_01_PRICE_ICP_MISMATCH") {
        addRec(
          "High",
          `Align Contract Value with Enterprise Procurement for ${shortIcp}`,
          `Structure pricing into tiered annual contracts or performance-linked savings to match the institutional purchasing cycles of ${shortIcp}.`,
          "Next 30 Days"
        );
      } else if (w.id === "RULE_04_MARKETPLACE_SUPPLY") {
        addRec(
          "High",
          "Formulate Supply-Side Liquidity & Acquisition Engine",
          "Design programmatic supply incentives to secure critical infrastructure or vendor capacity prior to scaling buyer acquisition.",
          "Next 30 Days"
        );
      } else if (w.id === "RULE_05_SAAS_ONE_TIME") {
        addRec(
          "High",
          "Transition to Recurring Software / Service Contracts",
          "Shift one-time transactional engagements into recurring annual service contracts or usage subscriptions to maximize Lifetime Value (LTV).",
          "Next 30 Days"
        );
      } else if (w.id === "RULE_12_ENTERPRISE_SALES_GAP") {
        addRec(
          "High",
          `Build Account-Based Outbound Pipeline for ${shortIcp}`,
          `Design a structured enterprise sales motion detailing pilot milestone criteria, security governance, and executive sign-off steps for ${shortIcp}.`,
          "Next 30 Days"
        );
      }
    });

    // 3. Score-based recommendations
    if (
      scores.competition.score < 65 &&
      !recommendations.some((r) => r.title.includes("Defensibility") || r.title.includes("Benchmark"))
    ) {
      addRec(
        "High",
        `Conduct Competitive Benchmark Audit vs ${comps}`,
        `Perform quantitative feature and total-cost-of-ownership (TCO) benchmarks against ${comps} to demonstrate clear economic ROI.`,
        "Next 30 Days"
      );
    }

    if (
      scores.risk.score < 65 &&
      !recommendations.some((r) => r.title.includes("Compliance") || r.title.includes("Regulatory"))
    ) {
      addRec(
        "Medium",
        `Execute Regulatory & Facility Compliance Review in ${geo}`,
        `Verify health, environmental, data security, and operational safety certifications required for commercial deployment in ${geo}.`,
        "Next 90 Days"
      );
    }

    if (
      scores.scalability.score < 70 &&
      !recommendations.some((r) => r.title.includes("Deployment") || r.title.includes("Onboarding"))
    ) {
      if (isHardwareOrDeepTech) {
        addRec(
          "Medium",
          `Standardize Pilot Deployment & Retrofit SLA Framework`,
          `Create standardized installation checklists, performance telemetry, and SLA guarantees to reduce facility onboarding time.`,
          "Next 90 Days"
        );
      } else {
        addRec(
          "Medium",
          `Streamline Customer Onboarding & Pilot Activation for ${shortIcp}`,
          `Deploy automated trial setup workflows, interactive configuration guides, and onboarding playbooks to minimize sales cycle friction.`,
          "Next 90 Days"
        );
      }
    }

    // 4. Low priority fallback items
    if (recommendations.length < 3) {
      addRec(
        "Low",
        `Recruit Strategic Advisory Board Members in ${tag0}`,
        `Onboard 1–2 seasoned industry executives to advise on enterprise partnership introductions and buyer credibility with ${shortIcp}.`,
        "Ongoing"
      );
    }

    return recommendations;
  }
}
