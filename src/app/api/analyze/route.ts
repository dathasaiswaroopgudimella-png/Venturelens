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
import { AIExplainer } from "@/lib/engines/ai-explainer";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { QuestionnaireAnswers, UnifiedVentureReport } from "@/types";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const answers: QuestionnaireAnswers = await req.json();

    if (!answers || !answers.idea) {
      return NextResponse.json(
        { error: "Startup idea and questionnaire answers are required." },
        { status: 400 }
      );
    }

    console.log("[API/Analyze] Starting VentureLens Decision Pipeline...");

    // 1. Initialize AI Provider
    const aiProvider = new AIProvider();

    // 2. Structured Extraction Engine
    const extractor = new StructuredExtractor(aiProvider);
    const facts = await extractor.extract(answers);

    // 3. Knowledge Graph Builder
    const graphBuilder = new KnowledgeGraphBuilder();
    const graph = graphBuilder.build(facts);

    // 4. External Research Layer (Tavily)
    const research = new ExternalResearch();
    const researchResult = await research.performResearch(facts, answers);

    // 5. Deterministic Rule Engine
    const ruleEngine = new RuleEngine();
    const ruleOutcomes = ruleEngine.evaluate(facts, answers);

    // 6. Heuristic Scoring Engine
    const scoringEngine = new ScoringEngine();
    const scores = scoringEngine.calculate(facts, ruleOutcomes, answers);

    // 7. Evidence Engine
    const evidenceEngine = new EvidenceEngine();
    const evidence = evidenceEngine.evaluate(
      facts,
      answers,
      researchResult.competitorsFound.length
    );

    // 8. Consistency Engine
    const consistencyEngine = new ConsistencyEngine();
    const consistency = consistencyEngine.evaluate(
      facts,
      answers,
      researchResult.competitorsFound
    );

    // 9. Recommendation Engine
    const recommendationEngine = new RecommendationEngine();
    const recommendations = recommendationEngine.generate(facts, ruleOutcomes, scores);

    // 10. AI Strategic Analysis & Explanations (NIM / Gemini)
    const explainer = new AIExplainer(aiProvider);
    const aiAnalysis = await explainer.generateAnalysis(
      facts,
      ruleOutcomes,
      scores,
      answers,
      researchResult.evidenceText
    );

    // 11. AI Cross-Verification Layer (NIM / Gemini)
    const crossVerification = await explainer.crossVerify(
      facts,
      ruleOutcomes,
      scores,
      answers,
      researchResult.evidenceText
    );

    // Compile the final Unified Venture Intelligence Report
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
      createdAt: new Date().toISOString(),
    };

    // 12. Persist to Supabase if authenticated
    try {
      const cookieStore = await cookies();
      const supabase = createClient(cookieStore);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Create project first
        const { data: project, error: pError } = await supabase
          .from("projects")
          .insert({
            user_id: user.id,
            name: answers.idea.substring(0, 30) + "...",
            description: answers.idea,
            status: "analyzed",
          })
          .select()
          .single();

        if (pError) throw pError;

        if (project) {
          report.projectId = project.id;

          // Save questionnaire
          const { error: qError } = await supabase.from("questionnaires").insert({
            project_id: project.id,
            answers: answers,
          });
          if (qError) throw qError;

          // Save report
          const { data: savedReport, error: rError } = await supabase
            .from("reports")
            .insert({
              project_id: project.id,
              overall_score: scores.overallScore,
              scores: scores,
              evidence: evidence,
              consistency: consistency,
              recommendations: recommendations,
              ai_analysis: aiAnalysis,
              agreement: crossVerification,
            })
            .select()
            .single();

          if (rError) throw rError;
          if (savedReport) {
            report.id = savedReport.id;
          }
        }
      }
    } catch (dbError) {
      console.warn("[API/Analyze] Database persistence skipped or failed:", dbError);
    }

    console.log("[API/Analyze] VentureLens Pipeline execution completed successfully.");
    return NextResponse.json(report, {
      headers: {
        // Prevent response from being cached — each analysis is unique
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    console.error("[API/Analyze] Pipeline Execution Failure:", error);
    return NextResponse.json(
      { error: "Analysis pipeline failed. Please try again." },
      { status: 500 }
    );
  }
}
