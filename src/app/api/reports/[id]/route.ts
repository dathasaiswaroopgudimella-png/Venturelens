import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Intercept demo/latest requests to return the static pre-computed demo report
    if (id === "healthsync-ai" || id === "demo-healthsync-001") {
      const { DEMO_REPORT } = await import("@/lib/demo-report");
      return NextResponse.json(DEMO_REPORT);
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Fetch report by ID
    const { data: report, error } = await supabase
      .from("reports")
      .select(`
        *,
        projects (
          id,
          name,
          description,
          created_at,
          user_id
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("[API/Reports] Supabase query failed:", error);
      return NextResponse.json({ error: "Report not found or database table is missing." }, { status: 404 });
    }

    // Load matching questionnaire answers
    const { data: questionnaire } = await supabase
      .from("questionnaires")
      .select("answers")
      .eq("project_id", report.project_id)
      .single();

    // Map database entity back to UnifiedVentureReport
    const unifiedReport = {
      id: report.id,
      projectId: report.project_id,
      answers: questionnaire?.answers || {},
      facts: report.scores?.facts || {}, // Check if stored
      ruleOutcomes: report.scores?.ruleOutcomes || [],
      scores: report.scores,
      evidence: report.evidence,
      consistency: report.consistency,
      recommendations: report.recommendations,
      aiAnalysis: report.ai_analysis,
      crossVerification: report.agreement,
      createdAt: report.created_at,
    };

    return NextResponse.json(unifiedReport);
  } catch (error: any) {
    console.error("[API/Reports] Failed to fetch report:", error);
    return NextResponse.json({ error: "Internal Server Error loading report." }, { status: 500 });
  }
}
