import { ExtractedFacts, ConsistencyReport, ConsistencyContradiction, QuestionnaireAnswers } from "@/types";

export class ConsistencyEngine {
  evaluate(
    facts: ExtractedFacts,
    answers: QuestionnaireAnswers,
    tavilyCompetitorsFound: string[] = []
  ): ConsistencyReport {
    const contradictions: ConsistencyContradiction[] = [];

    // 1. Claim: "No competitors" vs Competitor list/Tavily findings
    const claimsNoCompetitors =
      answers.competitors.toLowerCase().includes("none") ||
      answers.competitors.toLowerCase().includes("no competitors") ||
      answers.competitors.trim().length === 0;

    if (claimsNoCompetitors && (facts.competition.competitorList.length > 0 || tavilyCompetitorsFound.length > 0)) {
      const detected = [...facts.competition.competitorList, ...tavilyCompetitorsFound];
      const uniqueDetected = Array.from(new Set(detected)).slice(0, 5);

      contradictions.push({
        id: "CON_01_COMPETITOR_DISCREPANCY",
        severity: "Critical",
        claim: "Venture claims zero direct competitors.",
        evidence: `Search and parsing algorithms detected competitors: ${uniqueDetected.join(", ")}.`,
        explanation: "Stating there is no competition while active alternatives exist in database repositories indicates a research gap.",
      });
    }

    // 2. Claim: High Switching Costs vs Targeting First-time/Low-intent buyers
    const hasSwitchingCosts = facts.market.adoptionBarriers.some((b) =>
      b.toLowerCase().includes("switching cost") || b.toLowerCase().includes("migration")
    );
    const targetsFirstTime =
      answers.targetCustomer.toLowerCase().includes("first-time") ||
      answers.targetCustomer.toLowerCase().includes("individual consumer") ||
      answers.targetCustomer.toLowerCase().includes("casual");

    if (hasSwitchingCosts && targetsFirstTime) {
      contradictions.push({
        id: "CON_02_ADOPTION_CONTRADICTION",
        severity: "Medium",
        claim: "Targets high-velocity, casual or first-time buyers.",
        evidence: "Declared market barrier specifies high data switching or migration costs.",
        explanation: "Individual or casual users rarely tolerate high setup or migration friction.",
      });
    }

    // 3. Claim: Subscription/SaaS model vs One-time payment
    const isSaaSOrSub =
      facts.businessModel.primaryType === "SaaS" ||
      facts.businessModel.primaryType === "Subscription" ||
      answers.revenueModel.toLowerCase().includes("saas") ||
      answers.revenueModel.toLowerCase().includes("subscription");

    const hasOneTimePricing =
      answers.pricingStrategy.toLowerCase().includes("one time") ||
      answers.pricingStrategy.toLowerCase().includes("lifetime") ||
      answers.pricingStrategy.toLowerCase().includes("flat fee") ||
      answers.pricingStrategy.toLowerCase().includes("single charge");

    if (isSaaSOrSub && hasOneTimePricing) {
      contradictions.push({
        id: "CON_03_PRICING_MODEL_CONTRADICTION",
        severity: "High",
        claim: "Operates a recurring software subscription model.",
        evidence: "Monetization strategy specifies a one-time flat fee / lifetime access pricing model.",
        explanation: "A subscription software model relies on recurring revenue to offset ongoing maintenance costs. Lifetime pricing represents an business model mismatch.",
      });
    }

    // 4. Claim: Enterprise ICP vs Viral B2C Channels
    const isEnterprise =
      answers.targetCustomer.toLowerCase().includes("enterprise") ||
      answers.targetCustomer.toLowerCase().includes("fortune 500") ||
      answers.targetCustomer.toLowerCase().includes("hospital") ||
      answers.targetCustomer.toLowerCase().includes("government");

    const isViralDist =
      answers.distributionChannel.toLowerCase().includes("tiktok") ||
      answers.distributionChannel.toLowerCase().includes("viral") ||
      answers.distributionChannel.toLowerCase().includes("social media") ||
      answers.distributionChannel.toLowerCase().includes("influencer");

    if (isEnterprise && isViralDist && !answers.distributionChannel.toLowerCase().includes("direct")) {
      contradictions.push({
        id: "CON_04_GTM_MISMATCH",
        severity: "High",
        claim: "Targets B2B Enterprise, Corporates, or Institutional buyers.",
        evidence: "Acquisition channels rely on consumer social media and viral media loops.",
        explanation: "Enterprise procurement departments require high-touch sales, contract reviews, and security evaluations. Viral channels will fail to reach these decision makers.",
      });
    }

    // Determine status
    let status: "CONSISTENT" | "FLAGGED" | "CRITICAL_DISCREPANCY" = "CONSISTENT";
    if (contradictions.some((c) => c.severity === "Critical")) {
      status = "CRITICAL_DISCREPANCY";
    } else if (contradictions.length > 0) {
      status = "FLAGGED";
    }

    return {
      contradictions,
      status,
    };
  }
}
