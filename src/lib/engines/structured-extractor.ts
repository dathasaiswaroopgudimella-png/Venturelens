import { AIProvider } from "./ai-provider";
import { QuestionnaireAnswers, ExtractedFacts } from "@/types";

export class StructuredExtractor {
  private aiProvider: AIProvider;

  constructor(aiProvider: AIProvider) {
    this.aiProvider = aiProvider;
  }

  async extract(answers: QuestionnaireAnswers): Promise<ExtractedFacts> {
    const systemPrompt = `You are the Structured Information Extraction engine for VentureLens AI.
Your job is to analyze the startup's details and output a structured JSON object containing verified facts.
Do not calculate scores, make recommendations, or include narrative summaries outside the requested JSON.
Output ONLY a valid JSON object matching the following structure:

{
  "problem": {
    "description": "Short summary of the problem solved",
    "frequency": "Daily" | "Weekly" | "Monthly" | "Rarely",
    "urgency": "High" | "Medium" | "Low",
    "painSeverity": "Critical" | "Moderate" | "Convenience",
    "alternativesPain": "Detailed summary of how painful or expensive existing workarounds are"
  },
  "customer": {
    "icp": "Ideal Customer Profile",
    "earlyAdopters": "Who the early adopters are",
    "segmentation": "Market segmentation details",
    "buyingBehavior": "Description of buying behavior or decision making"
  },
  "market": {
    "industryTags": ["tag1", "tag2", ...],
    "geography": "Target geographic markets",
    "adoptionBarriers": ["barrier1", "barrier2", ...],
    "tamPotential": "Small" | "Medium" | "Large" | "Massive"
  },
  "competition": {
    "competitorList": ["competitor1", "competitor2", ...],
    "differentiationMoat": "Summary of differentiation or defensibility",
    "marketPositioning": "How the startup positions itself vs alternatives"
  },
  "businessModel": {
    "primaryType": "SaaS" | "Marketplace" | "Subscription" | "Transaction" | "Licensing" | "Other",
    "pricingStructure": "Pricing structure details (e.g. $50/mo, 10% take rate, etc.)",
    "marginSustainability": "Summary of cost structure or margin potential"
  },
  "execution": {
    "complexity": "High" | "Medium" | "Low",
    "resourcesRequired": "Hardware, software, operations, capital required",
    "timelineMonths": 12,
    "teamFit": "Description of founder-market fit or experience"
  }
}
`;

    const userPrompt = `Here are the questionnaire answers provided by the founder:
- Startup Idea: ${answers.idea}
- Target Customer: ${answers.targetCustomer}
- Problem Solved: ${answers.problemSolved}
- Existing Alternatives: ${answers.existingAlternatives}
- Revenue Model: ${answers.revenueModel}
- Pricing Strategy: ${answers.pricingStrategy}
- Competitors: ${answers.competitors}
- Differentiation: ${answers.differentiation}
- Business Stage: ${answers.businessStage}
- Geography: ${answers.geography}
- Current Validation: ${answers.currentValidation}
- Team: ${answers.teamBackground}
- Distribution: ${answers.distributionChannel}
${answers.tamEstimate ? `- TAM Estimate: ${answers.tamEstimate}` : ""}
`;

    try {
      const responseText = await this.aiProvider.generateCompletion(
        systemPrompt,
        userPrompt,
        true
      );
      // Clean up the text if it contains markdown formatting blocks
      const cleaned = responseText.replace(/```json/i, "").replace(/```/g, "").trim();
      return JSON.parse(cleaned) as ExtractedFacts;
    } catch (error) {
      console.error("[StructuredExtractor] Failed to extract facts, using fallback parser:", error);
      // Provide a clean default fallback structured object if the AI parsing completely fails
      return {
        problem: {
          description: answers.problemSolved || answers.idea || "Unspecified startup problem",
          frequency: "Monthly",
          urgency: "Medium",
          painSeverity: "Moderate",
          alternativesPain: answers.existingAlternatives || "Alternative workarounds not validated",
        },
        customer: {
          icp: answers.targetCustomer || "General market",
          earlyAdopters: "Early tech enthusiasts",
          segmentation: "General market",
          buyingBehavior: "Self-serve transactional buying",
        },
        market: {
          industryTags: ["Tech", "General"],
          geography: answers.geography || "Global",
          adoptionBarriers: ["High switching costs"],
          tamPotential: "Medium",
        },
        competition: {
          competitorList: answers.competitors ? answers.competitors.split(",").map(c => c.trim()) : [],
          differentiationMoat: answers.differentiation || "First-mover advantage",
          marketPositioning: "Direct replacement",
        },
        businessModel: {
          primaryType: (answers.revenueModel as any) || "Subscription",
          pricingStructure: answers.pricingStrategy || "Unspecified",
          marginSustainability: "Standard software margins",
        },
        execution: {
          complexity: "Medium",
          resourcesRequired: "Software developers, hosting, GTM budget",
          timelineMonths: 12,
          teamFit: answers.teamBackground || "Undisclosed team background",
        },
      };
    }
  }
}
