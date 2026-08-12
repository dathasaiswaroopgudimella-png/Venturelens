import { ExtractedFacts, RuleOutcome, QuestionnaireAnswers } from "@/types";

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

    // 1. Enterprise Pricing for Consumer Users Mismatch
    const isB2C = /consumer|b2c|everyone|individual|student|hostel/i.test(answers.targetCustomer);
    const isEnterprisePricing = /enterprise|high ticket|thousands|\$?([5-9]\d\d|\d{4,})\b/i.test(answers.pricingStrategy);

    if (isB2C && isEnterprisePricing) {
      addRule("RULE_01_PRICE_ICP_MISMATCH", "B2C High Ticket Pricing Risk", "WARNING", "Targeting consumers with high enterprise pricing creates an adoption barrier.", -15);
    } else {
      addRule("RULE_01_PRICE_ICP_MISMATCH", "B2C High Ticket Pricing Risk", "PASS", "Pricing model aligns with target customer profile.", 0);
    }

    // 2. Tiny TAM Limitation
    const isTinyTAM = facts.market.tamPotential === "Small" || /small|niche|under \$10m/i.test(answers.tamEstimate || "");
    if (isTinyTAM) {
      addRule("RULE_02_TINY_TAM", "Market Scale Limitation", "FAIL", "TAM is too small to support venture-scale growth.", -20);
    } else {
      addRule("RULE_02_TINY_TAM", "Market Scale Limitation", "PASS", "Addressable market scale appears sufficient.", 0);
    }

    // 3. Crowded Market with Weak Moat
    const compCount = facts.competition.competitorList.length;
    const hasWeakMoat = /first mover|none|don't have|speed/i.test(facts.competition.differentiationMoat);
    if (compCount >= 5 && hasWeakMoat) {
      addRule("RULE_03_CROWDED_WEAK_MOAT", "Crowded Market Defensibility", "FAIL", "Crowded competitor landscape paired with weak defensibility moat.", -15);
    } else {
      addRule("RULE_03_CROWDED_WEAK_MOAT", "Crowded Market Defensibility", "PASS", "Defensibility moat vector appears adequate.", 0);
    }

    // 4. Marketplace Supply Strategy
    const isMarketplace = facts.businessModel.primaryType === "Marketplace";
    const lacksSupplyStrategy = !/supply|vendor|seller|merchant|exclusive/i.test(answers.distributionChannel + answers.differentiation);
    if (isMarketplace && lacksSupplyStrategy) {
      addRule("RULE_04_MARKETPLACE_SUPPLY", "Marketplace Supply Acquisition", "WARNING", "Marketplace model lacks clear supply-side acquisition strategy.", -15);
    } else {
      addRule("RULE_04_MARKETPLACE_SUPPLY", "Marketplace Supply Acquisition", "PASS", "Marketplace distribution logic appears balanced.", 0);
    }

    // 5. SaaS One-Time Pricing Contradiction
    const isSaaS = facts.businessModel.primaryType === "SaaS" || facts.businessModel.primaryType === "Subscription";
    const isOneTime = /one time|lifetime|flat fee/i.test(answers.pricingStrategy);
    if (isSaaS && isOneTime) {
      addRule("RULE_05_SAAS_ONE_TIME", "SaaS Lifetime Pricing Contradiction", "WARNING", "Recurring SaaS model paired with one-time flat fee pricing limits LTV.", -15);
    } else {
      addRule("RULE_05_SAAS_ONE_TIME", "SaaS Lifetime Pricing Contradiction", "PASS", "Monetization model aligns with recurring customer value.", 0);
    }

    // 6. Technical Complexity vs Credentials
    const isHighComplexity = facts.execution.complexity === "High";
    const lacksTechTeam = !/engineer|developer|cto|technical|phd|cs|computer/i.test(answers.teamBackground);
    if (isHighComplexity && lacksTechTeam) {
      addRule("RULE_06_COMPLEXITY_RESOURCES", "High Technical Execution Risk", "FAIL", "High technical complexity without founder technical credentials.", -15);
    } else {
      addRule("RULE_06_COMPLEXITY_RESOURCES", "High Technical Execution Risk", "PASS", "Team credentials match execution requirements.", 0);
    }

    return outcomes;
  }
}
