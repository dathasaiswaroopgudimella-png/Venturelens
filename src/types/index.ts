export interface QuestionnaireAnswers {
  idea: string; // Original idea description
  targetCustomer: string;
  problemSolved: string;
  existingAlternatives: string;
  geography: string;
  revenueModel: string; // SaaS, Marketplace, Subscription, Transaction, Licensing, etc.
  businessStage: string; // Idea, MVP, Validation, Scaling
  competitors: string; // Comma separated or text
  differentiation: string;
  currentValidation: string; // Interviews, letters of intent, pilot users, etc.
  teamBackground: string;
  pricingStrategy: string;
  distributionChannel: string;
  fundingStage?: string;
  tamEstimate?: string;
}

export interface ExtractedFacts {
  problem: {
    description: string;
    frequency: string; // Daily, weekly, monthly, rarely
    urgency: string; // High, medium, low
    painSeverity: string; // Critical, moderate, convenience
    alternativesPain: string; // How painful/costly are current workarounds
  };
  customer: {
    icp: string;
    earlyAdopters: string;
    segmentation: string;
    buyingBehavior: string;
  };
  market: {
    industryTags: string[];
    geography: string;
    adoptionBarriers: string[];
    tamPotential: string; // Small, medium, large, massive
  };
  competition: {
    competitorList: string[];
    differentiationMoat: string;
    marketPositioning: string;
  };
  businessModel: {
    primaryType: string;
    pricingStructure: string;
    marginSustainability: string;
  };
  execution: {
    complexity: string; // High, medium, low
    resourcesRequired: string;
    timelineMonths: number;
    teamFit: string;
  };
}

export interface VentureGraphNode {
  id: string;
  type: "Customer" | "Problem" | "Solution" | "RevenueModel" | "Market";
  label: string;
  properties: Record<string, any>;
}

export interface VentureGraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

export interface VentureKnowledgeGraph {
  nodes: VentureGraphNode[];
  edges: VentureGraphEdge[];
}

export interface RuleOutcome {
  id: string;
  name: string;
  status: "PASS" | "WARNING" | "FAIL";
  message: string;
  impactScoreEffect: number; // Penalty or bonus
}

export interface DimensionScore {
  score: number;
  confidence: "Low" | "Medium" | "High";
  evidenceLevel: number; // 0 to 10 scale
  keyIssues: string[];
  suggestions: string[];
}

export interface VentureScores {
  problem: DimensionScore;
  customer: DimensionScore;
  market: DimensionScore;
  competition: DimensionScore;
  businessModel: DimensionScore;
  execution: DimensionScore;
  risk: DimensionScore;
  differentiation: DimensionScore;
  scalability: DimensionScore;
  investorReadiness: DimensionScore;
  overallScore: number;
}

export interface EvidenceData {
  supporting: string[];
  missing: string[];
}

export interface ConsistencyContradiction {
  id: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  claim: string;
  evidence: string;
  explanation: string;
}

export interface ConsistencyReport {
  contradictions: ConsistencyContradiction[];
  status: "CONSISTENT" | "FLAGGED" | "CRITICAL_DISCREPANCY";
}

export interface Recommendation {
  id: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  title: string;
  description: string;
  timeframe: string; // e.g. "Immediate", "Next 30 days", "Next 90 days"
}

export interface AIAnalysis {
  executiveSummary: string;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  gtmStrategy: string;
  mvpRoadmap: string;
  landingPageCopy: {
    heroTitle: string;
    heroSubtitle: string;
    features: { title: string; desc: string }[];
    ctaText: string;
  };
  elevatorPitch: string;
  investorNarrative: string;
}

export interface AICrossVerification {
  aiStrategicVerdict: string;
  aiConfidence: "Low" | "Medium" | "High";
  agreementScore: number; // 0 - 100%
  agreementStatus: "✓ Very High Agreement" | "✓ High Agreement" | "⚠ Moderate Disagreement" | "⚠ Significant Disagreement";
  challengedAssumptions: string[];
  reasonForDisagreement: string;
  additionalEvidenceRequired: string[];
  recommendedValidationSteps: string[];
}

export interface UnifiedVentureReport {
  id?: string;
  projectId: string;
  answers: QuestionnaireAnswers;
  facts: ExtractedFacts;
  graph: VentureKnowledgeGraph;
  ruleOutcomes: RuleOutcome[];
  scores: VentureScores;
  evidence: Record<string, EvidenceData>;
  consistency: ConsistencyReport;
  recommendations: Recommendation[];
  aiAnalysis: AIAnalysis;
  crossVerification: AICrossVerification;
  createdAt: string;
}
