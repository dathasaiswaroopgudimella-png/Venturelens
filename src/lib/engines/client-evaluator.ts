import {
  QuestionnaireAnswers,
  UnifiedVentureReport,
} from "@/types";
import { StructuredExtractor } from "./structured-extractor";
import { KnowledgeGraphBuilder } from "./knowledge-graph";
import { ExternalResearch } from "./external-research";
import { RuleEngine } from "./rule-engine";
import { ScoringEngine } from "./scoring-engine";
import { EvidenceEngine } from "./evidence-engine";
import { ConsistencyEngine } from "./consistency-engine";
import { RecommendationEngine } from "./recommendation-engine";
import { KnowledgeRetriever } from "./knowledge-retriever";
import { DecisionEngine } from "./decision-engine";
import { AIExplainer } from "./ai-explainer";
import { nanoid } from "nanoid";

export function generateClientVentureReport(answers: QuestionnaireAnswers): UnifiedVentureReport {
  const extractor = new StructuredExtractor();
  const facts = extractor.extract(answers);

  const retriever = new KnowledgeRetriever();
  const retrievedKnowledge = retriever.retrieve(answers, facts);

  const research = new ExternalResearch();
  const researchResult = {
    competitorsFound: answers.competitors
      ? answers.competitors.split(",").map((c) => c.trim()).filter(Boolean)
      : [`${facts.market.industryTags[0]} Incumbents`, "Legacy Manual Spreadsheets"],
    evidenceText: `Market research conducted for ${facts.market.industryTags[0]} targeting ${facts.customer.icp}.`,
    urls: [],
  };

  const graphBuilder = new KnowledgeGraphBuilder();
  const graph = graphBuilder.build(facts);

  const ruleEngine = new RuleEngine();
  const ruleOutcomes = ruleEngine.evaluate(facts, answers);

  const scoringEngine = new ScoringEngine();
  const { scores, equation } = scoringEngine.calculate(facts, ruleOutcomes, answers);

  const evidenceEngine = new EvidenceEngine();
  const evidence = evidenceEngine.evaluate(facts, answers);

  const consistencyEngine = new ConsistencyEngine();
  const consistency = consistencyEngine.evaluate(facts, answers);

  const recommendationEngine = new RecommendationEngine();
  const recommendations = recommendationEngine.generate(facts, ruleOutcomes, scores, answers);

  const decisionEngine = new DecisionEngine();
  const decisionExperiment = decisionEngine.evaluate(facts, ruleOutcomes, scores, answers);

  const explainer = new AIExplainer(null as any);
  const { aiAnalysis, crossVerification } = explainer.getFallbackCombined(
    facts,
    answers,
    scores,
    equation
  );

  const guestProjectId = `guest_${nanoid(10)}`;

  return {
    projectId: guestProjectId,
    answers,
    facts,
    graph,
    ruleOutcomes,
    scores,
    scoringEquation: equation,
    evidence,
    consistency,
    recommendations,
    aiAnalysis,
    crossVerification,
    retrievedKnowledge,
    decisionExperiment,
    createdAt: new Date().toISOString(),
  };
}
