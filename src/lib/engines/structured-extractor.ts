import { AIProvider } from "./ai-provider";
import { QuestionnaireAnswers, ExtractedFacts } from "@/types";
import { safeJsonParse } from "@/lib/utils/json-repair";

export class StructuredExtractor {
  private aiProvider: AIProvider;

  constructor(aiProvider: AIProvider) {
    this.aiProvider = aiProvider;
  }

  private getFallbackFacts(answers: QuestionnaireAnswers): ExtractedFacts {
    const rawIdea = answers.idea || "";
    const rawProb = answers.problemSolved || "";
    const rawCust = answers.targetCustomer || "";
    const rawDiff = answers.differentiation || "";
    const rawRev = answers.revenueModel || "";
    const rawPrice = answers.pricingStrategy || "";
    const text = `${rawIdea} ${rawProb} ${rawCust} ${rawDiff} ${rawRev} ${rawPrice}`.toLowerCase();

    const industryTags: string[] = [];
    if (/health|med|patient|doctor|clinic|bio/i.test(text)) industryTags.push("HealthTech");
    if (/fin|bank|pay|invest|credit|crypto|wallet|money/i.test(text)) industryTags.push("FinTech");
    if (/edu|learn|student|school|tutor|course|hostel/i.test(text)) industryTags.push("EdTech/Campus");
    if (/ai|ml|agent|llm|automation|bot|vision/i.test(text)) industryTags.push("Artificial Intelligence");
    if (/solar|climate|green|eco|drone|carbon|clean/i.test(text)) industryTags.push("ClimateTech");
    if (/b2b|enterprise|saas|workflow|crm|tool/i.test(text)) industryTags.push("B2B SaaS");
    if (industryTags.length === 0) industryTags.push("Technology", "Innovation");

    let frequency = "Monthly";
    if (/daily|every day|constant|hour|real-time|always/i.test(text)) frequency = "Daily";
    else if (/weekly|every week|regular/i.test(text)) frequency = "Weekly";

    let painSeverity = "Moderate";
    if (/critical|severe|dying|loss|expensive|emergency|fatal|failure/i.test(text)) painSeverity = "Critical";
    else if (/convenience|easy|nice|simple|casual/i.test(text)) painSeverity = "Convenience";

    let primaryType: ExtractedFacts["businessModel"]["primaryType"] = "Subscription";
    if (/market|platform|take rate|commission|two-sided/i.test(rawRev)) primaryType = "Marketplace";
    else if (/saas|subscrip|recurring|monthly|annual/i.test(rawRev)) primaryType = "SaaS";
    else if (/transact|fee|per usage|pay-as-you-go/i.test(rawRev)) primaryType = "Transaction";
    else if (/licens|patent|enterprise deal/i.test(rawRev)) primaryType = "Licensing";

    const competitorList = answers.competitors
      ? answers.competitors.split(",").map(c => c.trim()).filter(Boolean)
      : [];

    return {
      problem: {
        description: rawProb || rawIdea || "Unspecified startup problem",
        frequency,
        urgency: painSeverity === "Critical" ? "High" : "Medium",
        painSeverity,
        alternativesPain: answers.existingAlternatives || `Current manual alternatives for ${rawCust || 'users'} are inefficient.`,
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
        marginSustainability: "High gross margin potential",
      },
      execution: {
        complexity: /ai|hardware|drone|deep|robot|biotech/i.test(text) ? "High" : "Medium",
        resourcesRequired: answers.teamBackground ? `Team background: ${answers.teamBackground}` : "Engineering, domain expertise, GTM budget",
        timelineMonths: 6,
        teamFit: answers.teamBackground || "Founder with domain passion",
      },
    };
  }

  async extract(answers: QuestionnaireAnswers): Promise<ExtractedFacts> {
    const systemPrompt = `You are the Structured Information Extraction engine for VentureLens AI.
Analyze the startup details and output a structured JSON object containing verified facts.
Output ONLY a valid JSON object matching the requested schema.`;

    const userPrompt = `Startup Questionnaire:
- Idea: ${answers.idea}
- Customer: ${answers.targetCustomer}
- Problem: ${answers.problemSolved}
- Revenue Model: ${answers.revenueModel}
- Competitors: ${answers.competitors}
- Geography: ${answers.geography}`;

    try {
      const responseText = await this.aiProvider.generateCompletion(systemPrompt, userPrompt, true);
      const parsed = safeJsonParse<any>(responseText, null);
      if (parsed && typeof parsed === "object" && parsed.problem) {
        return parsed as ExtractedFacts;
      }
      return this.getFallbackFacts(answers);
    } catch (error) {
      console.error("[StructuredExtractor] Fallback parser used:", error);
      return this.getFallbackFacts(answers);
    }
  }
}
