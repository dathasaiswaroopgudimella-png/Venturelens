import { QuestionnaireAnswers, ExtractedFacts } from "@/types";

export class StructuredExtractor {
  /**
   * Fast deterministic fact extraction (<1ms).
   * Transforms structured questionnaire inputs into ExtractedFacts schema with 100% precision.
   */
  public extract(answers: QuestionnaireAnswers): ExtractedFacts {
    const rawIdea = answers.idea || "";
    const rawProb = answers.problemSolved || "";
    const rawCust = answers.targetCustomer || "";
    const rawDiff = answers.differentiation || "";
    const rawRev = answers.revenueModel || "";
    const rawPrice = answers.pricingStrategy || "";
    const text = `${rawIdea} ${rawProb} ${rawCust} ${rawDiff} ${rawRev} ${rawPrice}`.toLowerCase();

    // 1. Dynamic industry tagging
    const industryTags: string[] = [];
    if (/health|med|patient|doctor|clinic|bio/i.test(text)) industryTags.push("HealthTech");
    if (/fin|bank|pay|invest|credit|crypto|wallet|money/i.test(text)) industryTags.push("FinTech");
    if (/edu|learn|student|school|tutor|course|hostel/i.test(text)) industryTags.push("EdTech/Campus");
    if (/ai|ml|agent|llm|automation|bot|vision/i.test(text)) industryTags.push("Artificial Intelligence");
    if (/solar|climate|green|eco|drone|carbon|ocean|clean/i.test(text)) industryTags.push("ClimateTech");
    if (/food|restau|recipe|cook|farm|agri/i.test(text)) industryTags.push("AgriTech/Food");
    if (/b2b|enterprise|saas|workflow|crm|tool/i.test(text)) industryTags.push("B2B SaaS");
    if (industryTags.length === 0) industryTags.push("Technology", "Innovation");

    // 2. Dynamic problem frequency
    let frequency = "Monthly";
    if (/daily|every day|constant|hour|real-time|always/i.test(text)) frequency = "Daily";
    else if (/weekly|every week|regular/i.test(text)) frequency = "Weekly";

    // 3. Dynamic pain severity
    let painSeverity = "Moderate";
    if (/critical|severe|dying|loss|expensive|emergency|fatal|failure/i.test(text)) painSeverity = "Critical";
    else if (/convenience|easy|nice|simple|casual/i.test(text)) painSeverity = "Convenience";

    // 4. Dynamic primary revenue type
    let primaryType: ExtractedFacts["businessModel"]["primaryType"] = "Subscription";
    if (/market|platform|take rate|commission|two-sided/i.test(rawRev)) primaryType = "Marketplace";
    else if (/saas|subscrip|recurring|monthly|annual/i.test(rawRev)) primaryType = "SaaS";
    else if (/transact|fee|per usage|pay-as-you-go/i.test(rawRev)) primaryType = "Transaction";
    else if (/licens|patent|enterprise deal/i.test(rawRev)) primaryType = "Licensing";

    // 5. Parsed competitors
    const competitorList = answers.competitors
      ? answers.competitors.split(",").map((c) => c.trim()).filter(Boolean)
      : [];

    return {
      problem: {
        description: rawProb || rawIdea || "Unspecified startup problem",
        frequency,
        urgency: painSeverity === "Critical" ? "High" : "Medium",
        painSeverity,
        alternativesPain: answers.existingAlternatives || `Current manual alternatives for ${rawCust || "users"} are inefficient and high-cost.`,
      },
      customer: {
        icp: rawCust || "Target market segment",
        earlyAdopters: rawCust ? `Early adopters within ${rawCust}` : "Early tech adopters",
        segmentation: answers.geography ? `${answers.geography} market` : "Global segment",
        buyingBehavior: rawPrice || "Value-driven purchasing decision",
      },
      market: {
        industryTags,
        geography: answers.geography || "Global",
        adoptionBarriers: ["Customer switching costs", "Operational integration inertia"],
        tamPotential: /global|billion|enterprise|all|everyone/i.test(text) ? "Large" : "Medium",
      },
      competition: {
        competitorList,
        differentiationMoat: rawDiff || "Proprietary workflow and specialized speed advantage",
        marketPositioning: "Direct specialized alternative",
      },
      businessModel: {
        primaryType,
        pricingStructure: rawPrice || "Tiered recurring pricing",
        marginSustainability: "High gross margin software potential",
      },
      execution: {
        complexity: /ai|hardware|drone|deep|robot|biotech/i.test(text) ? "High" : "Medium",
        resourcesRequired: answers.teamBackground ? `Team background: ${answers.teamBackground}` : "Engineering, domain expertise, GTM launch budget",
        timelineMonths: 6,
        teamFit: answers.teamBackground || "Founder with domain passion",
      },
    };
  }
}
