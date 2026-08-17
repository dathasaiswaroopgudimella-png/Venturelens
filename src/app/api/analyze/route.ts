import { NextResponse } from "next/server";
import { AIProvider } from "@/lib/engines/ai-provider";
import { StructuredExtractor } from "@/lib/engines/structured-extractor";
import { KnowledgeGraphBuilder } from "@/lib/engines/knowledge-graph";
import { ExternalResearch } from "@/lib/engines/external-research";
import { RuleEngine } from "@/lib/engines/rule-engine";
import { ScoringEngine } from "@/lib/engines/scoring-engine";
import { EvidenceEngine } from "@/lib/engines/evidence-engine";
import { ConsistencyEngine } from "@/lib/engines/consistency-engine";
import { RecommendationEngine } from "@/lib/engines/recommendation-engine";
import { KnowledgeRetriever } from "@/lib/engines/knowledge-retriever";
import { DecisionEngine } from "@/lib/engines/decision-engine";
import { AIExplainer } from "@/lib/engines/ai-explainer";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { QuestionnaireAnswers, UnifiedVentureReport } from "@/types";
import { nanoid } from "nanoid";

// In-memory sliding-window rate limiting map
const ipCache = new Map<string, number[]>();
const LIMIT_WINDOW = 60000;
const MAX_REQUESTS = 15;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipCache.get(ip) || [];
  const activeTimestamps = timestamps.filter((t) => now - t < LIMIT_WINDOW);
  if (activeTimestamps.length >= MAX_REQUESTS) {
    return true;
  }
  activeTimestamps.push(now);
  ipCache.set(ip, activeTimestamps);
  return false;
}

export async function POST(req: Request) {
  const startTime = Date.now();
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    if (checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many analysis requests. Please wait a moment." },
        { status: 429 }
      );
    }

    const answers: QuestionnaireAnswers = await req.json();

    if (!answers || !answers.idea) {
      return NextResponse.json(
        { error: "Startup idea and questionnaire answers are required." },
        { status: 400 }
      );
    }

    console.log("[API/Analyze] Launching High-Speed VentureLens 2.0 Pipeline...");

    // 1. Initialize Engines
    const aiProvider = new AIProvider();
    const extractor = new StructuredExtractor(aiProvider);
    const research = new ExternalResearch();
    const retriever = new KnowledgeRetriever();

    // 2. PARALLEL PHASE 1: Run Fact Extraction, Market Research, and RAG Retrieval Concurrently
    const [facts, researchResult, retrievedKnowledge] = await Promise.all([
      extractor.extract(answers),
      research.performResearch(answers),
      Promise.resolve(retriever.retrieve(answers)),
    ]);

    // 3. Fast Synchronous Deterministic Engines (<15ms)
    const graphBuilder = new KnowledgeGraphBuilder();
    const graph = graphBuilder.build(facts);

    const ruleEngine = new RuleEngine();
    const ruleOutcomes = ruleEngine.evaluate(facts, answers);

    const scoringEngine = new ScoringEngine();
    const scores = scoringEngine.calculate(facts, ruleOutcomes, answers);

    const evidenceEngine = new EvidenceEngine();
    const evidence = evidenceEngine.evaluate(facts, answers);

    const consistencyEngine = new ConsistencyEngine();
    const consistency = consistencyEngine.evaluate(facts, answers);

    const recommendationEngine = new RecommendationEngine();
    const recommendations = recommendationEngine.generate(facts, ruleOutcomes, scores);

    const decisionEngine = new DecisionEngine();
    const decisionExperiment = decisionEngine.evaluate(facts, ruleOutcomes, scores, answers);

    // 4. PARALLEL PHASE 2: Single-Pass Combined AI Strategic Synthesis & Cross-Verification
    const explainer = new AIExplainer(aiProvider);
    const { aiAnalysis, crossVerification } = await explainer.generateCombinedReport(
      facts,
      ruleOutcomes,
      scores,
      answers,
      researchResult.evidenceText,
      retrievedKnowledge
    );

    // Compile Final Unified Report
    const guestProjectId = `guest_${nanoid(10)}`;
    const report: UnifiedVentureReport = {
      projectId: guestProjectId,
      answers,
      facts,
      graph,
      ruleOutcomes,
      scores,
      evidence,
      consistency,
      recommendations,
      aiAnalysis,
      crossVerification,
      retrievedKnowledge,
      decisionExperiment,
      createdAt: new Date().toISOString(),
    };

    // 5. Asynchronous Non-Blocking Database Persistence (Never Delays User Response)
    (async () => {
      try {
        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data: project } = await supabase
            .from("projects")
            .insert({
              user_id: user.id,
              name: answers.idea.substring(0, 30) + "...",
              description: answers.idea,
              status: "analyzed",
            })
            .select()
            .single();

          if (project) {
            report.projectId = project.id;
            await supabase.from("questionnaires").insert({
              project_id: project.id,
              answers,
            });

            const { data: savedReport } = await supabase
              .from("reports")
              .insert({
                project_id: project.id,
                overall_score: scores.overallScore,
                scores,
                evidence,
                consistency,
                recommendations,
                ai_analysis: aiAnalysis,
                agreement: crossVerification,
              })
              .select()
              .single();

            if (savedReport) {
              report.id = savedReport.id;
            }
          }
        }
      } catch (dbError) {
        // Non-blocking background error log
      }
    })();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[API/Analyze] Pipeline completed in ${duration}s.`);
    return NextResponse.json(report, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error: any) {
    console.error("[API/Analyze] Execution Failure:", error);
    return NextResponse.json(
      { error: "Analysis pipeline failed. Please try again." },
      { status: 500 }
    );
  }
}
