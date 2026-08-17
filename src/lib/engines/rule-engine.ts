import { ExtractedFacts, RuleOutcome, QuestionnaireAnswers } from "@/types";
import { isNonCommercialSubmission } from "@/lib/utils/clean-inputs";

export class RuleEngine {
  evaluate(facts: ExtractedFacts, answers: QuestionnaireAnswers): RuleOutcome[] {
    const outcomes: RuleOutcome[] = [];

    const addRule = (
      id: string,
      name: string,
      status: "PASS" | "WARNING" | "FAIL",
      message: string,
      effect: number
    ) => {
      outcomes.push({ id, name, status, message, impactScoreEffect: effect });
    };

    const isNonCommercial = isNonCommercialSubmission(answers.idea, answers);

    // 0. Non-Commercial Thesis Gate (Critical Filter)
    if (isNonCommercial) {
      addRule(
        "RULE_00_NON_COMMERCIAL_THESIS",
        "Commercial Venture Validity Gate",
        "FAIL",
        "The submission describes a personal activity or informal statement rather than a viable commercial venture.",
        -40
      );
    } else {
      addRule(
        "RULE_00_NON_COMMERCIAL_THESIS",
        "Commercial Venture Validity Gate",
        "PASS",
        "Submission describes an identifiable commercial business proposition.",
        0
      );
    }

    // 1. Enterprise Pricing for Consumer Users Mismatch
    const isB2C =
      answers.targetCustomer.toLowerCase().includes("consumer") ||
      answers.targetCustomer.toLowerCase().includes("b2c") ||
      answers.targetCustomer.toLowerCase().includes("everyone") ||
      answers.targetCustomer.toLowerCase().includes("individuals");

    const isEnterprisePricing =
      answers.pricingStrategy.toLowerCase().includes("enterprise") ||
      answers.pricingStrategy.toLowerCase().includes("high ticket") ||
      answers.pricingStrategy.toLowerCase().includes("thousands") ||
      /\$?([5-9]\d\d|\d{4,})\b/.test(answers.pricingStrategy);

    if (isB2C && isEnterprisePricing) {
      addRule(
        "RULE_01_PRICE_ICP_MISMATCH",
        "B2C High Ticket Pricing Risk",
        "WARNING",
        "Targeting individual consumers with high enterprise-grade pricing creates a severe adoption barrier.",
        -15
      );
    } else {
      addRule(
        "RULE_01_PRICE_ICP_MISMATCH",
        "B2C High Ticket Pricing Risk",
        "PASS",
        "Pricing strategy appears aligned with target customer demographic.",
        0
      );
    }

    // 2. Tiny TAM Limitation
    const isTinyTAM =
      facts.market.tamPotential === "Small" ||
      answers.tamEstimate?.toLowerCase().includes("small") ||
      answers.tamEstimate?.toLowerCase().includes("niche") ||
      answers.tamEstimate?.toLowerCase().includes("under 10m") ||
      answers.tamEstimate?.toLowerCase().includes("under $10m");

    if (isTinyTAM) {
      addRule(
        "RULE_02_TINY_TAM",
        "Market Scale Limitation",
        "FAIL",
        "The total addressable market (TAM) is too small to support venture scalability or investor interest.",
        -20
      );
    } else {
      addRule(
        "RULE_02_TINY_TAM",
        "Market Scale Limitation",
        "PASS",
        "The addressable market scale appears sufficient for sustainable growth.",
        0
      );
    }

    // 3. Crowded Market with Weak Moat
    const competitorCount = facts.competition.competitorList.length;
    const hasWeakMoat =
      facts.competition.differentiationMoat.toLowerCase().includes("first mover") ||
      facts.competition.differentiationMoat.toLowerCase().includes("none") ||
      facts.competition.differentiationMoat.toLowerCase().includes("don't have") ||
      facts.competition.differentiationMoat.length < 15;

    if (competitorCount >= 4 && hasWeakMoat) {
      addRule(
        "RULE_03_CROWDED_WEAK_MOAT",
        "Crowded Market / Defensibility Deficit",
        "FAIL",
        "Entering a market with 4+ established competitors without a strong defensible moat represents a high risk.",
        -18
      );
    } else {
      addRule(
        "RULE_03_CROWDED_WEAK_MOAT",
        "Crowded Market / Defensibility Deficit",
        "PASS",
        "Defensibility strategy or competitor density is within manageable parameters.",
        0
      );
    }

    // 4. Marketplace Supply Deficit
    const isMarketplace =
      facts.businessModel.primaryType === "Marketplace" ||
      answers.revenueModel.toLowerCase().includes("marketplace") ||
      answers.revenueModel.toLowerCase().includes("platform");

    const mentionsSupplySide =
      answers.distributionChannel.toLowerCase().includes("supply") ||
      answers.distributionChannel.toLowerCase().includes("seller") ||
      answers.distributionChannel.toLowerCase().includes("partner") ||
      answers.distributionChannel.toLowerCase().includes("merchant") ||
      answers.distributionChannel.toLowerCase().includes("acquisition");

    if (isMarketplace && !mentionsSupplySide) {
      addRule(
        "RULE_04_MARKETPLACE_SUPPLY",
        "Marketplace Double-Sided Acquisition Gap",
        "WARNING",
        "A marketplace model requires a clear supply acquisition strategy, which is currently missing from distribution channels.",
        -12
      );
    } else {
      addRule(
        "RULE_04_MARKETPLACE_SUPPLY",
        "Marketplace Double-Sided Acquisition Gap",
        "PASS",
        "Marketplace supply-side considerations are accounted for.",
        0
      );
    }

    // 5. SaaS with One-time Pricing
    const isSaaSOrSub =
      facts.businessModel.primaryType === "SaaS" ||
      facts.businessModel.primaryType === "Subscription" ||
      answers.revenueModel.toLowerCase().includes("saas") ||
      answers.revenueModel.toLowerCase().includes("subscription");

    const isOneTimePricing =
      answers.pricingStrategy.toLowerCase().includes("one time") ||
      answers.pricingStrategy.toLowerCase().includes("lifetime") ||
      answers.pricingStrategy.toLowerCase().includes("flat fee") ||
      answers.pricingStrategy.toLowerCase().includes("single charge");

    if (isSaaSOrSub && isOneTimePricing) {
      addRule(
        "RULE_05_SAAS_ONE_TIME",
        "SaaS One-Time Pricing Inconsistency",
        "WARNING",
        "Configuring a SaaS or subscription service with one-time or lifetime pricing limits LTV and increases cost-of-service risk.",
        -10
      );
    } else {
      addRule(
        "RULE_05_SAAS_ONE_TIME",
        "SaaS One-Time Pricing Inconsistency",
        "PASS",
        "Subscription pricing is structured with recurring monetization models.",
        0
      );
    }

    // 6. High Complexity with Low Resources/Team
    const isHighComplexity = facts.execution.complexity === "High";
    const hasWeakTeam =
      answers.teamBackground.toLowerCase().includes("none") ||
      answers.teamBackground.toLowerCase().includes("student") ||
      answers.teamBackground.toLowerCase().includes("junior") ||
      answers.teamBackground.toLowerCase().includes("just me") ||
      answers.teamBackground.length < 20;

    if (isHighComplexity && hasWeakTeam) {
      addRule(
        "RULE_06_COMPLEXITY_RESOURCES",
        "Execution Moat & Resource Deficit",
        "FAIL",
        "The technology has high complexity, but the team lacks the deep domain/technical backgrounds to execute it.",
        -15
      );
    } else {
      addRule(
        "RULE_06_COMPLEXITY_RESOURCES",
        "Execution Moat & Resource Deficit",
        "PASS",
        "Team expertise matches the technical complexity of the venture.",
        0
      );
    }

    // 7. Low Pain Severity / Frequency
    const isLowPain =
      isNonCommercial ||
      facts.problem.painSeverity === "Convenience" ||
      facts.problem.frequency === "Rarely";

    if (isLowPain) {
      addRule(
        "RULE_07_LOW_PAIN",
        "Nice-to-Have Problem Severity",
        "WARNING",
        "The problem frequency is rare or the severity is convenience-level, making customer acquisition highly difficult.",
        -14
      );
    } else {
      addRule(
        "RULE_07_LOW_PAIN",
        "Nice-to-Have Problem Severity",
        "PASS",
        "The problem frequency and pain severity indicate a high-priority customer need.",
        0
      );
    }

    // 8. Missing Customer Validation
    const hasNoValidation =
      isNonCommercial ||
      answers.currentValidation.toLowerCase().includes("none") ||
      answers.currentValidation.toLowerCase().includes("no validation") ||
      answers.currentValidation.toLowerCase().includes("not yet") ||
      answers.currentValidation.length < 15;

    if (hasNoValidation) {
      addRule(
        "RULE_08_NO_VALIDATION",
        "Missing Market Evidence",
        "FAIL",
        "The project has zero customer validation or market evidence, making all demand statements purely hypothetical.",
        -20
      );
    } else {
      addRule(
        "RULE_08_NO_VALIDATION",
        "Missing Market Evidence",
        "PASS",
        "Founder has provided validation indicators, demonstrating initial market appetite.",
        0
      );
    }

    // 9. Geography Market Gaps
    const hasUnspecifiedGeography =
      answers.geography.toLowerCase().includes("unspecified") ||
      answers.geography.length < 4;

    if (hasUnspecifiedGeography) {
      addRule(
        "RULE_09_GEOGRAPHY_GAP",
        "Vague Geographic Targeting",
        "WARNING",
        "Targeting a vague or purely global market at launch without local focus dilutes marketing ROI.",
        -8
      );
    } else {
      addRule(
        "RULE_09_GEOGRAPHY_GAP",
        "Vague Geographic Targeting",
        "PASS",
        "Defined launch geography supports targeted customer acquisition.",
        0
      );
    }

    // 10. Missing or Vague Problem Statement
    const hasNoProblem =
      isNonCommercial ||
      answers.problemSolved.length < 15 ||
      answers.problemSolved.toLowerCase().includes("none") ||
      answers.problemSolved.toLowerCase().includes("no problem");

    if (hasNoProblem) {
      addRule(
        "RULE_10_NO_PROBLEM",
        "Problem Statement Deficit",
        "FAIL",
        "No clear or acute customer problem is defined, creating severe risk of product-market misalignment.",
        -25
      );
    } else {
      addRule(
        "RULE_10_NO_PROBLEM",
        "Problem Statement Deficit",
        "PASS",
        "Clear operational or consumer problem is articulated.",
        0
      );
    }

    // 11. Missing Target Customer / ICP
    const hasNoCustomer =
      isNonCommercial ||
      answers.targetCustomer.length < 8 ||
      /^(everyone|anyone|all people|nobody|none)$/i.test(answers.targetCustomer.trim());

    if (hasNoCustomer) {
      addRule(
        "RULE_11_NO_CUSTOMER",
        "Target Customer Specificity Gap",
        "FAIL",
        "Target customer segment is overly broad ('everyone') or undefined, preventing effective go-to-market execution.",
        -20
      );
    } else {
      addRule(
        "RULE_11_NO_CUSTOMER",
        "Target Customer Specificity Gap",
        "PASS",
        "Identifiable target buyer segment defined.",
        0
      );
    }

    // 12. Enterprise Sales Gap
    const hasEnterpriseICP =
      answers.targetCustomer.toLowerCase().includes("enterprise") ||
      answers.targetCustomer.toLowerCase().includes("corporate") ||
      answers.targetCustomer.toLowerCase().includes("b2b");
    const hasOutboundSales =
      answers.distributionChannel.toLowerCase().includes("sales") ||
      answers.distributionChannel.toLowerCase().includes("outbound") ||
      answers.distributionChannel.toLowerCase().includes("direct") ||
      answers.distributionChannel.toLowerCase().includes("partner");

    if (hasEnterpriseICP && !hasOutboundSales && !isNonCommercial) {
      addRule(
        "RULE_12_ENTERPRISE_SALES_GAP",
        "Enterprise GTM Misalignment",
        "WARNING",
        "B2B Enterprise buyers require high-touch direct sales motions, which are currently omitted from GTM strategy.",
        -12
      );
    } else {
      addRule(
        "RULE_12_ENTERPRISE_SALES_GAP",
        "Enterprise GTM Misalignment",
        "PASS",
        "Enterprise customer acquisition motion is supported by direct outbound or partnership channels.",
        0
      );
    }

    // 13. Regulatory & Compliance Risk
    const hasRegulatoryBarriers = facts.market.adoptionBarriers.some(
      (b) =>
        b.toLowerCase().includes("compliance") ||
        b.toLowerCase().includes("regulatory") ||
        b.toLowerCase().includes("legal") ||
        b.toLowerCase().includes("fda")
    );
    const mentionsCompliance =
      answers.teamBackground.toLowerCase().includes("compliance") ||
      answers.teamBackground.toLowerCase().includes("legal") ||
      answers.teamBackground.toLowerCase().includes("expert") ||
      answers.currentValidation.toLowerCase().includes("compliant") ||
      answers.currentValidation.toLowerCase().includes("approval");

    if (hasRegulatoryBarriers && !mentionsCompliance) {
      addRule(
        "RULE_13_REGULATORY_RISK",
        "Regulatory Compliance Execution Gap",
        "WARNING",
        "The venture faces regulatory adoption barriers, but has not detailed any compliance expertise or audit history.",
        -10
      );
    } else {
      addRule(
        "RULE_13_REGULATORY_RISK",
        "Regulatory Compliance Execution Gap",
        "PASS",
        "Regulatory barrier concerns have matching founder credentials/milestones.",
        0
      );
    }

    // 14. Defensibility/Moat Deficit
    if (hasWeakMoat && !isNonCommercial) {
      addRule(
        "RULE_14_WEAK_MOAT",
        "Defensibility Deficit",
        "WARNING",
        "Relying strictly on marketing speed or generic software builds without intellectual property or network effects creates an easily copyable business.",
        -12
      );
    } else {
      addRule(
        "RULE_14_WEAK_MOAT",
        "Defensibility Deficit",
        "PASS",
        "A clear defensibility vector (e.g. data moat, IP, high switching costs) is defined.",
        0
      );
    }

    // 15. Inconsistent ICP vs Distribution
    const isEnterpriseBuyer =
      answers.targetCustomer.toLowerCase().includes("enterprise") ||
      answers.targetCustomer.toLowerCase().includes("fortune 500");
    const isViralDistribution =
      answers.distributionChannel.toLowerCase().includes("social") ||
      answers.distributionChannel.toLowerCase().includes("viral") ||
      answers.distributionChannel.toLowerCase().includes("influencer") ||
      answers.distributionChannel.toLowerCase().includes("seo");

    if (isEnterpriseBuyer && isViralDistribution && !hasOutboundSales) {
      addRule(
        "RULE_15_ICP_DIST_MISMATCH",
        "ICP-Distribution Channel Mismatch",
        "WARNING",
        "Attempting to acquire enterprise contracts via consumer-grade viral channels or SEO/social media is highly inefficient.",
        -10
      );
    } else {
      addRule(
        "RULE_15_ICP_DIST_MISMATCH",
        "ICP-Distribution Channel Mismatch",
        "PASS",
        "Distribution channels match target buyer profiles.",
        0
      );
    }

    // 16. Stage vs Capital Expectations
    const isScaling =
      answers.businessStage.toLowerCase().includes("scaling") ||
      answers.businessStage.toLowerCase().includes("growth");
    const isWeakValidation =
      answers.currentValidation.toLowerCase().includes("none") ||
      answers.currentValidation.toLowerCase().includes("idea stage") ||
      answers.currentValidation.length < 25;

    if (isScaling && isWeakValidation) {
      addRule(
        "RULE_16_STAGE_VALIDATION_GAP",
        "Premature Scaling Risk",
        "FAIL",
        "Claiming the business is in the scaling stage without substantial market validation indicators is a high execution risk.",
        -15
      );
    } else {
      addRule(
        "RULE_16_STAGE_VALIDATION_GAP",
        "Premature Scaling Risk",
        "PASS",
        "Maturity stage corresponds appropriately to validation milestones.",
        0
      );
    }

    return outcomes;
  }
}
