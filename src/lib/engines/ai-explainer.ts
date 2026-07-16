import { AIProvider } from "./ai-provider";
import {
  ExtractedFacts,
  RuleOutcome,
  VentureScores,
  AIAnalysis,
  AICrossVerification,
  QuestionnaireAnswers
} from "@/types";

export class AIExplainer {
  private aiProvider: AIProvider;

  constructor(aiProvider: AIProvider) {
    this.aiProvider = aiProvider;
  }

  async generateAnalysis(
    facts: ExtractedFacts,
    ruleOutcomes: RuleOutcome[],
    scores: VentureScores,
    answers: QuestionnaireAnswers,
    searchEvidenceText: string
  ): Promise<AIAnalysis> {
    const systemPrompt = `You are a Senior Venture Capital Investment Analyst.
Your task is to write the AI Strategic Analysis section for a startup report.
The report contains deterministic scores and rule flags that you must explain and expand upon.
You must NOT modify or contradict the calculated scores:
Overall Venture Score: ${scores.overallScore}/100
Problem Score: ${scores.problem.score}/100
Market Score: ${scores.market.score}/100
Competition Score: ${scores.competition.score}/100
Business Model Score: ${scores.businessModel.score}/100

Output a single valid JSON object with the following fields (do not output any other text or markdown wrappers):
{
  "executiveSummary": "A concise, professional 3-sentence summary of the venture opportunity and key bottlenecks.",
  "swot": {
    "strengths": ["strength1", "strength2", ...],
    "weaknesses": ["weakness1", "weakness2", ...],
    "opportunities": ["opportunity1", "opportunity2", ...],
    "threats": ["threat1", "threat2", ...]
  },
  "gtmStrategy": "A detailed multi-sentence Go-To-Market distribution plan targeting the beachhead customer.",
  "mvpRoadmap": "A 3-phase technical MVP scope detailing core milestones (Phase 1: Build, Phase 2: Validate, Phase 3: Launch).",
  "landingPageCopy": {
    "heroTitle": "Vibrant, benefit-driven H1 headline",
    "heroSubtitle": "Engaging sub-headline detailing target benefit and mechanism",
    "features": [
      { "title": "Feature 1", "desc": "benefit-focused description" },
      { "title": "Feature 2", "desc": "benefit-focused description" },
      { "title": "Feature 3", "desc": "benefit-focused description" }
    ],
    "ctaText": "Primary call-to-action button text"
  },
  "elevatorPitch": "A short, high-impact 30-second elevator pitch.",
  "investorNarrative": "A compelling storytelling pitch paragraph designed to raise capital from early-stage investors."
}
`;

    const userPrompt = `Here is the data generated from the deterministic engines:
Questionnaire answers: ${JSON.stringify(answers)}
Extracted Facts: ${JSON.stringify(facts)}
Rule Outcomes: ${JSON.stringify(ruleOutcomes)}
External Research findings: ${searchEvidenceText}
`;

    try {
      const responseText = await this.aiProvider.generateCompletion(
        systemPrompt,
        userPrompt,
        true
      );
      const cleaned = responseText.replace(/```json/i, "").replace(/```/g, "").trim();
      return JSON.parse(cleaned) as AIAnalysis;
    } catch (error) {
      console.error("[AIExplainer] Failed to generate AI analysis, using fallback:", error);
      return {
        executiveSummary: `Project targets the ${facts.market.industryTags.join("/")} sector. While the value proposition is defined, key bottlenecks include high competitor density and initial validation barriers.`,
        swot: {
          strengths: ["Clear primary value proposition", "Targeted customer profile"],
          weaknesses: ["Unconfirmed customer willingness to pay", "Friction in distribution channel"],
          opportunities: ["Expansion to digital channels", "Strategic partner integrations"],
          threats: ["Crowded competitor landscape", "Regulatory or compliance hurdles"],
        },
        gtmStrategy: `Launch a direct outbound sales pilot targeting 15 key users in the primary market. Focus on low-friction trials to build social proof.`,
        mvpRoadmap: `Phase 1 (Month 1-3): Build core landing page and manual backend (No-Code MVP). Phase 2 (Month 4-6): Roll out initial functional database loops. Phase 3 (Month 7-9): Public launch.`,
        landingPageCopy: {
          heroTitle: `Streamline your ${facts.market.industryTags[0] || "operations"} today`,
          heroSubtitle: `We help ${facts.customer.icp} solve ${facts.problem.description} using custom software tools.`,
          features: [
            { title: "Saves Time", desc: "Automate manual tasks and speed up output." },
            { title: "Reduces Costs", desc: "Lower operational overhead by up to 30%." },
            { title: "Custom Integration", desc: "Hooks directly into your existing software tools." },
          ],
          ctaText: "Start Free Analysis",
        },
        elevatorPitch: `We are building a solution for ${facts.customer.icp} who experience ${facts.problem.description}. Our product makes it 10x faster and cheaper than existing alternatives.`,
        investorNarrative: `Project represents a high-margin business model addressing a painful problem for a growing customer base. By executing on the beachfront distribution channel, we are positioned to capture market share.`,
      };
    }
  }

  async crossVerify(
    facts: ExtractedFacts,
    ruleOutcomes: RuleOutcome[],
    scores: VentureScores,
    answers: QuestionnaireAnswers,
    searchEvidenceText: string
  ): Promise<AICrossVerification> {
    const systemPrompt = `You are an Independent Venture Analyst reviewing a startup proposal.
You have been given a deterministic report with an "Official VentureLens Score" of ${scores.overallScore}/100.
Your job is to challenge assumptions, identify blind spots, and write a strategic review.
You must NOT modify the deterministic score.
First, determine your independent rating of this startup idea (0-100).
Compare your independent rating with the Official VentureLens Score to generate the agreement details.
Output ONLY a valid JSON object matching the following structure:

{
  "aiIndependentRating": 78,
  "aiStrategicVerdict": "Your independent, analytical strategic review of the startup's potential. Highlight hidden risks, competitive positioning, and team feasibility.",
  "aiConfidence": "High" | "Medium" | "Low",
  "challengedAssumptions": ["List any deterministic assumptions or founder claims you want to challenge (e.g. B2C user pricing, GTM viral loops)"],
  "reasonForDisagreement": "If you disagree with the deterministic score by more than 10 points, explain why. Otherwise, state 'N/A'.",
  "additionalEvidenceRequired": ["What evidence should the founder provide next (e.g. signed LOIs, user surveys)"],
  "recommendedValidationSteps": ["Step 1: ...", "Step 2: ..."]
}
`;

    const userPrompt = `Here is the data generated from the deterministic engines:
Official VentureLens Score: ${scores.overallScore}
Questionnaire answers: ${JSON.stringify(answers)}
Extracted Facts: ${JSON.stringify(facts)}
Rule Outcomes: ${JSON.stringify(ruleOutcomes)}
External Research findings: ${searchEvidenceText}
`;

    try {
      const responseText = await this.aiProvider.generateCompletion(
        systemPrompt,
        userPrompt,
        true
      );
      const cleaned = responseText.replace(/```json/i, "").replace(/```/g, "").trim();
      const rawResult = JSON.parse(cleaned);

      const aiIndependentRating = Number(rawResult.aiIndependentRating) || scores.overallScore;

      // Agreement calculations
      const agreementScore = Math.max(0, Math.min(100, 100 - Math.abs(aiIndependentRating - scores.overallScore)));

      let agreementStatus: AICrossVerification["agreementStatus"] = "✓ Very High Agreement";
      if (agreementScore < 50) {
        agreementStatus = "⚠ Significant Disagreement";
      } else if (agreementScore < 75) {
        agreementStatus = "⚠ Moderate Disagreement";
      } else if (agreementScore < 90) {
        agreementStatus = "✓ High Agreement";
      }

      return {
        aiStrategicVerdict: rawResult.aiStrategicVerdict,
        aiConfidence: rawResult.aiConfidence,
        agreementScore,
        agreementStatus,
        challengedAssumptions: rawResult.challengedAssumptions,
        reasonForDisagreement: rawResult.reasonForDisagreement,
        additionalEvidenceRequired: rawResult.additionalEvidenceRequired,
        recommendedValidationSteps: rawResult.recommendedValidationSteps,
      };
    } catch (error) {
      console.error("[AIExplainer] Failed to generate cross-verification, using fallback:", error);
      return {
        aiStrategicVerdict: "The startup displays a strong core thesis, but execution risks remain around the customer acquisition strategy and the defensibility of the product moat.",
        aiConfidence: "Medium",
        agreementScore: 90,
        agreementStatus: "✓ High Agreement",
        challengedAssumptions: ["Underestimated competitor acquisition rates", "Assumed low user churn"],
        reasonForDisagreement: "N/A",
        additionalEvidenceRequired: ["15 customer validation surveys", "Bottom-up TAM calculations"],
        recommendedValidationSteps: [
          "Validate pricing thresholds through landing page tests.",
          "Perform a comprehensive competitor SWOT analysis.",
        ],
      };
    }
  }
}
