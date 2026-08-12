import { ExtractedFacts, RuleOutcome, VentureScores, Recommendation } from "@/types";

export class RecommendationEngine {
  generate(
    facts: ExtractedFacts,
    ruleOutcomes: RuleOutcome[],
    scores: VentureScores
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];
    let recIdCounter = 1;

    const icp = facts.customer.icp || "target customers";
    const tag0 = facts.market.industryTags[0] || "industry";
    const comps = facts.competition.competitorList.join(", ") || "existing alternatives";

    const addRec = (priority: "Critical" | "High" | "Medium" | "Low", title: string, description: string, timeframe: string) => {
      recommendations.push({
        id: `REC_${String(recIdCounter++).padStart(2, "0")}`,
        priority,
        title,
        description,
        timeframe,
      });
    };

    // 1. Critical priorities based on rule failures
    const failures = ruleOutcomes.filter((r) => r.status === "FAIL");
    failures.forEach((f) => {
      if (f.id === "RULE_02_TINY_TAM") {
        addRec(
          "Critical",
          `Pivot or Expand TAM Beyond Current ${tag0} Niche`,
          `Expand customer target definitions beyond current limits to encompass broader segments within ${facts.market.geography || 'global markets'} to support venture-scale growth.`,
          "Immediate Action"
        );
      } else if (f.id === "RULE_03_CROWDED_WEAK_MOAT") {
        addRec(
          "Critical",
          `Build Defensible Moat Against ${comps}`,
          `With established players like ${comps} in the market, formulate a technical advantage, network effect, or data moat to defend profit margins.`,
          "Immediate Action"
        );
      } else if (f.id === "RULE_08_NO_VALIDATION") {
        addRec(
          "Critical",
          `Run 15 Direct Customer Interviews with ${icp}`,
          `Acquire primary demand signals by interviewing target buyers in ${icp} to quantify exact pain severity and price sensitivity.`,
          "Immediate Action"
        );
      } else if (f.id === "RULE_06_COMPLEXITY_RESOURCES") {
        addRec(
          "Critical",
          `Recruit Technical Co-founders for ${tag0} Execution`,
          `The proposed concept involves high execution complexity. Onboard co-founders or key advisors with specific engineering credentials.`,
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
          `Re-align Pricing Model for ${icp}`,
          `Adjust enterprise price points to align with purchasing behavior of ${icp}, or shift positioning to higher-budget B2B decision makers.`,
          "Next 30 Days"
        );
      } else if (w.id === "RULE_04_MARKETPLACE_SUPPLY") {
        addRec(
          "High",
          "Draft Supply-Side Acquisition Incentive Plan",
          "Design a direct incentives program or API integration strategy to secure supply-side inventory before public launch.",
          "Next 30 Days"
        );
      } else if (w.id === "RULE_05_SAAS_ONE_TIME") {
        addRec(
          "High",
          "Transition to Recurring SaaS Subscription Pricing",
          "Shift from lifetime/one-time pricing to recurring monthly or annual subscription plans to maximize customer LTV.",
          "Next 30 Days"
        );
      } else if (w.id === "RULE_12_ENTERPRISE_SALES_GAP") {
        addRec(
          "High",
          `Design B2B Enterprise Sales Motion for ${icp}`,
          `Build a structured outbound sales pipeline detailing security reviews, pilot trial terms, and executive buy-in steps for ${icp}.`,
          "Next 30 Days"
        );
      }
    });

    // Score checks - add recommendations if specific dimension is weak
    if (scores.competition.score < 65 && !recommendations.some((r) => r.title.includes("Moat"))) {
      addRec(
        "High",
        `Conduct Competitive Feature Audit vs ${comps}`,
        `Perform detailed feature and pricing breakdowns comparing your product directly against ${comps} to identify whitespace.`,
        "Next 30 Days"
      );
    }

    if (scores.risk.score < 65) {
      addRec(
        "Medium",
        `Perform Regulatory & Compliance Audit in ${facts.market.geography}`,
        `Establish data privacy, legal approval, and compliance protocols tailored to ${tag0} operations.`,
        "Next 90 Days"
      );
    }

    if (scores.scalability.score < 70) {
      addRec(
        "Medium",
        `Automate Self-Serve Onboarding for ${icp}`,
        `Introduce automated trial signup flows and interactive tutorials to minimize human-assisted onboarding friction.`,
        "Next 90 Days"
      );
    }

    // 3. Low priority fallback items
    if (recommendations.length < 3) {
      addRec(
        "Low",
        `Expand ${tag0} Strategic Advisor Network`,
        `Recruit 1-2 seasoned industry veterans to your advisory board to build trust with ${icp} and open enterprise partnership doors.`,
        "Ongoing"
      );
    }

    return recommendations;
  }
}
