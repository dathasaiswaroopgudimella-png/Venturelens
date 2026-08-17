import { QuestionnaireAnswers, ExtractedFacts } from "@/types";
import { cleanFieldText, cleanStartupAnswers } from "@/lib/utils/clean-inputs";

export class StructuredExtractor {
  /**
   * Fast deterministic fact extraction (<1ms).
   * Transforms structured questionnaire inputs into clean ExtractedFacts schema with zero prefix leakage.
   */
  public extract(answers: QuestionnaireAnswers): ExtractedFacts {
    const profile = cleanStartupAnswers(answers);
    const text = `${profile.startupName} ${profile.oneLiner} ${profile.problem} ${profile.icp} ${profile.moat} ${profile.revenueModel} ${profile.pricing}`.toLowerCase();

    // 1. Dynamic industry tagging
    const industryTags: string[] = [];
    if (/health|med|patient|doctor|clinic|bio|claim|hospital|tpa/i.test(text)) industryTags.push("HealthTech");
    if (/fin|bank|pay|invest|credit|crypto|wallet|money|insur/i.test(text)) industryTags.push("FinTech / InsurTech");
    if (/edu|learn|student|school|tutor|course|hostel/i.test(text)) industryTags.push("EdTech");
    if (/ai|ml|agent|llm|automation|bot|vision/i.test(text)) industryTags.push("Artificial Intelligence");
    if (/solar|climate|green|eco|drone|carbon|ocean|clean|underwater|wind/i.test(text)) industryTags.push("ClimateTech / DeepTech");
    if (/food|restau|recipe|cook|farm|agri/i.test(text)) industryTags.push("AgriTech / Food");
    if (/b2b|enterprise|saas|workflow|crm|tool/i.test(text)) industryTags.push("B2B SaaS");
    if (industryTags.length === 0) industryTags.push("Enterprise Technology", "B2B SaaS");

    // 2. Dynamic problem frequency
    let frequency = "Monthly";
    if (/daily|every day|constant|hour|real-time|always|per claim|per patient/i.test(text)) frequency = "Daily";
    else if (/weekly|every week|regular/i.test(text)) frequency = "Weekly";

    // 3. Dynamic pain severity
    let painSeverity = "Moderate";
    if (/critical|severe|dying|loss|expensive|emergency|fatal|failure|rework|denial/i.test(text)) painSeverity = "Critical";
    else if (/convenience|easy|nice|simple|casual/i.test(text)) painSeverity = "Convenience";

    // 4. Dynamic primary revenue type
    let primaryType: ExtractedFacts["businessModel"]["primaryType"] = "Subscription";
    if (/market|platform|take rate|commission|two-sided/i.test(profile.revenueModel)) primaryType = "Marketplace";
    else if (/saas|subscrip|recurring|monthly|annual/i.test(profile.revenueModel)) primaryType = "SaaS";
    else if (/transact|fee|per usage|pay-as-you-go|per claim/i.test(profile.revenueModel)) primaryType = "Transaction";
    else if (/licens|patent|enterprise deal/i.test(profile.revenueModel)) primaryType = "Licensing";

    return {
      problem: {
        description: profile.problem,
        frequency,
        urgency: painSeverity === "Critical" ? "High" : "Medium",
        painSeverity,
        alternativesPain: profile.alternatives,
      },
      customer: {
        icp: profile.icp,
        earlyAdopters: `Early adopters within ${profile.icp}`,
        segmentation: profile.geography ? `${profile.geography} segment` : "Target segment",
        buyingBehavior: profile.pricing,
      },
      market: {
        industryTags,
        geography: profile.geography,
        adoptionBarriers: ["Customer switching costs", "Workflow integration & legacy inertia"],
        tamPotential: /global|billion|enterprise|hospital|all/i.test(text) ? "Large" : "Medium",
      },
      competition: {
        competitorList: profile.competitors,
        differentiationMoat: profile.moat,
        marketPositioning: "Specialized direct alternative",
      },
      businessModel: {
        primaryType,
        pricingStructure: profile.pricing,
        marginSustainability: "High gross margin software potential",
      },
      execution: {
        complexity: /ai|hardware|drone|deep|robot|biotech|health|fintech/i.test(text) ? "High" : "Medium",
        resourcesRequired: profile.team ? `Team background: ${profile.team}` : "Engineering, domain expertise, GTM launch budget",
        timelineMonths: 6,
        teamFit: profile.team,
      },
    };
  }
}
