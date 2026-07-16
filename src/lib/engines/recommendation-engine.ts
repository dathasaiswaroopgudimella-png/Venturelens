import { ExtractedFacts, RuleOutcome, VentureScores, Recommendation } from "@/types";

export class RecommendationEngine {
  generate(
    facts: ExtractedFacts,
    ruleOutcomes: RuleOutcome[],
    scores: VentureScores
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];
    let recIdCounter = 1;

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
          "Pivot or Expand Addressable Market Scope",
          "Identify adjacent customer niches, alternative use-cases, or global expansion plans to expand your Total Addressable Market (TAM) to support venture scale.",
          "Immediate Action"
        );
      } else if (f.id === "RULE_03_CROWDED_WEAK_MOAT") {
        addRec(
          "Critical",
          "Establish and Define a Defensible Moat",
          "Since you are entering a crowded market (4+ competitors), specify a technological advantage, network effect, or data moat that protects your pricing power.",
          "Immediate Action"
        );
      } else if (f.id === "RULE_08_NO_VALIDATION") {
        addRec(
          "Critical",
          "Run Primary Customer Interviews",
          "Acquire initial demand signals by interviewing 15-20 prospective target customers and documenting their exact pain points and willingness to pay.",
          "Immediate Action"
        );
      } else if (f.id === "RULE_06_COMPLEXITY_RESOURCES") {
        addRec(
          "Critical",
          "Recruit Technical/Domain Co-founders",
          "The proposed product has high execution complexity. You need to onboard co-founders or key advisors with specific domain credentials to demonstrate execution capability.",
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
          "Re-align Pricing Strategy with Target ICP",
          "Lower initial price barriers or introduce tiered freemium structures if targeting consumer groups, or pivot to higher value B2B segments.",
          "Next 30 Days"
        );
      } else if (w.id === "RULE_04_MARKETPLACE_SUPPLY") {
        addRec(
          "High",
          "Draft Supply-Side Acquisition Roadmap",
          "Design a direct incentives program or integrations strategy to secure the supply side of your marketplace before launch.",
          "Next 30 Days"
        );
      } else if (w.id === "RULE_05_SAAS_ONE_TIME") {
        addRec(
          "High",
          "Pivot to Recurring SaaS Pricing Options",
          "Shift from lifetime/one-time pricing to recurring monthly/annual subscription plans to improve customer lifetime value (LTV).",
          "Next 30 Days"
        );
      } else if (w.id === "RULE_12_ENTERPRISE_SALES_GAP") {
        addRec(
          "High",
          "Design High-Touch B2B Sales Workflow",
          "Create a high-touch sales pipeline outlining outbound outreach, software trial contracts, and procurement security audits.",
          "Next 30 Days"
        );
      }
    });

    // Score checks - add recommendations if specific dimension is weak
    if (scores.competition.score < 60 && !recommendations.some((r) => r.title.includes("Moat"))) {
      addRec(
        "High",
        "Conduct In-Depth Competitor Audit",
        "Analyze direct and indirect alternatives to map feature overlaps, pricing differentials, and identify product whitespace.",
        "Next 30 Days"
      );
    }

    if (scores.risk.score < 65) {
      addRec(
        "Medium",
        "Perform Compliance & Regulatory Audit",
        "Formulate a privacy and regulatory compliance strategy (e.g. GDPR, HIPAA, SOC2) matching the requirements of your targeted industries.",
        "Next 90 Days"
      );
    }

    if (scores.scalability.score < 70) {
      addRec(
        "Medium",
        "Automate User Onboarding Loops",
        "Introduce self-serve tutorials and automated signup flows to minimize customer onboarding friction and lower operational overhead.",
        "Next 90 Days"
      );
    }

    // 3. Low priority items
    if (recommendations.length < 3) {
      addRec(
        "Low",
        "Expand Industry Advisor Network",
        "Recruit 1-2 seasoned industry veterans to your advisory board to increase institutional trust and accelerate partnership sales.",
        "Ongoing"
      );
    }

    return recommendations;
  }
}
