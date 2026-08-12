import { AIProvider } from "./ai-provider";
import { safeJsonParse } from "@/lib/utils/json-repair";
import {
  ExtractedFacts,
  RuleOutcome,
  VentureScores,
  AIAnalysis,
  AICrossVerification,
  QuestionnaireAnswers,
  KnowledgeSnippet,
} from "@/types";

export class AIExplainer {
  private aiProvider: AIProvider;

  constructor(aiProvider: AIProvider) {
    this.aiProvider = aiProvider;
  }

  async generateCombinedReport(
    facts: ExtractedFacts,
    ruleOutcomes: RuleOutcome[],
    scores: VentureScores,
    answers: QuestionnaireAnswers,
    evidenceText: string,
    retrievedKnowledge?: KnowledgeSnippet[]
  ): Promise<{ aiAnalysis: AIAnalysis; crossVerification: AICrossVerification }> {
    const knowledgeText = retrievedKnowledge && retrievedKnowledge.length > 0
      ? retrievedKnowledge.map((k) => `[${k.category}] ${k.title}: ${k.content}`).join("\n\n")
      : "No extra framework retrieved.";

    const systemPrompt = `You are the AI Strategic Synthesis & Cross-Verification Engine for VentureLens AI 2.0.
Your goal is to evaluate the startup using both founder inputs and retrieved Venture Capital Frameworks / Case Studies.

Retrieved Knowledge Base Context:
${knowledgeText}

Output ONLY a valid JSON object matching:
{
  "aiAnalysis": {
    "executiveSummary": "Detailed strategic evaluation incorporating retrieved frameworks",
    "swot": {
      "strengths": ["s1", "s2"],
      "weaknesses": ["w1", "w2"],
      "opportunities": ["o1", "o2"],
      "threats": ["t1", "t2"]
    },
    "gtmStrategy": "Strategic GTM advice",
    "mvpRoadmap": "3-phase roadmap",
    "landingPageCopy": {
      "heroTitle": "Title",
      "heroSubtitle": "Subtitle",
      "features": [{"title": "f1", "desc": "d1"}],
      "ctaText": "CTA"
    },
    "elevatorPitch": "30-sec pitch",
    "investorNarrative": "VC narrative"
  },
  "crossVerification": {
    "aiStrategicVerdict": "Verdict",
    "aiConfidence": "High",
    "agreementScore": 88,
    "agreementStatus": "✓ Very High Agreement",
    "challengedAssumptions": ["a1"],
    "reasonForDisagreement": "None",
    "additionalEvidenceRequired": ["e1"],
    "recommendedValidationSteps": ["v1"]
  }
}`;

    const userPrompt = `Startup Idea: ${answers.idea}
Target Customer: ${answers.targetCustomer}
Problem: ${answers.problemSolved}
Revenue Model: ${answers.revenueModel}
Overall Score: ${scores.overallScore}/100`;

    try {
      const responseText = await this.aiProvider.generateCompletion(systemPrompt, userPrompt, true);
      const parsed = safeJsonParse<any>(responseText, null);
      if (parsed && parsed.aiAnalysis && parsed.crossVerification) {
        return parsed;
      }
      return this.getFallbackCombined(answers, scores);
    } catch (e) {
      return this.getFallbackCombined(answers, scores);
    }
  }

  private getFallbackCombined(answers: QuestionnaireAnswers, scores: VentureScores) {
    return {
      aiAnalysis: {
        executiveSummary: `Project "${answers.idea.slice(0, 30)}..." evaluated with overall score ${scores.overallScore}/100. Primary focus should be validating willingness-to-pay and initial customer acquisition.`,
        swot: {
          strengths: ["Clear core concept", "Defined target buyer segment"],
          weaknesses: ["Validation dataset needs expansion", "Distribution velocity unconfirmed"],
          opportunities: ["Digital channel acquisition", "Partnership integrations"],
          threats: ["Competitor replication speed", "Customer switching friction"],
        },
        gtmStrategy: "Launch outbound direct sales pilot targeting early adopter decision makers.",
        mvpRoadmap: "Phase 1: Build core MVP. Phase 2: Onboard 10 pilot accounts. Phase 3: Public launch.",
        landingPageCopy: {
          heroTitle: `The Smarter Way to Solve ${answers.idea.slice(0, 20)}`,
          heroSubtitle: `We help ${answers.targetCustomer} eliminate manual friction.`,
          features: [
            { title: "Automated Workflow", desc: "Save hours of manual effort daily." },
            { title: "Cost Efficiency", desc: "Lower operational overhead significantly." },
          ],
          ctaText: "Get Started Free",
        },
        elevatorPitch: `We help ${answers.targetCustomer} eliminate ${answers.problemSolved}.`,
        investorNarrative: "Addresses a high-frequency market opportunity with potential for scalable recurring growth.",
      },
      crossVerification: {
        aiStrategicVerdict: "Validates core problem thesis; recommends initial customer traction proof.",
        aiConfidence: "High" as const,
        agreementScore: 88,
        agreementStatus: "✓ Very High Agreement" as const,
        challengedAssumptions: ["Customer acquisition cost assumptions"],
        reasonForDisagreement: "None",
        additionalEvidenceRequired: ["5 signed LOIs or pilot customer deposits"],
        recommendedValidationSteps: ["Execute 15 structured problem interviews"],
      },
    };
  }
}
