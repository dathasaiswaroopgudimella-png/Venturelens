import { NextResponse } from "next/server";
import { AIProvider } from "@/lib/engines/ai-provider";
import { QuestionnaireAnswers } from "@/types";

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();

    if (!transcript || transcript.trim().length < 5) {
      return NextResponse.json({ error: "Transcript is empty or too short." }, { status: 400 });
    }

    console.log(`[API/FormatVoice] Formatting transcript (${transcript.length} chars)...`);

    const aiProvider = new AIProvider();
    const systemPrompt = `You are a Startup Advisor & Pitch Structuring AI.
The user spoke their startup idea via voice input. The raw transcript may contain filler words ("um", "uh", "like"), repetitions, or fragmented sentences.
Your task is to:
1. Clean up and format the transcript into a polished 2-3 sentence startup vision statement ("formattedPitch").
2. Extract all startup heuristic parameters into a JSON object matching this schema:
{
  "formattedPitch": "Polished, cohesive 2-3 sentence startup pitch",
  "targetCustomer": "Identified customer segment",
  "problemSolved": "Core problem statement",
  "existingAlternatives": "Workarounds mentioned or implied",
  "geography": "Target launch region",
  "revenueModel": "SaaS | Subscription | Marketplace | Transaction | Licensing | Other",
  "pricingStrategy": "Pricing approach",
  "competitors": "Competitors mentioned",
  "differentiation": "Unique edge or moat",
  "currentValidation": "Validation/traction metrics if spoken",
  "teamBackground": "Team background if spoken",
  "distributionChannel": "GTM distribution channel",
  "tamEstimate": "Market size estimate"
}

Output ONLY valid JSON without markdown wrappers.`;

    const userPrompt = `Spoken Voice Transcript:\n"${transcript}"`;

    const responseText = await aiProvider.generateCompletion(systemPrompt, userPrompt, true);
    const cleaned = responseText.replace(/```json/i, "").replace(/```/g, "").trim();
    const parsedData = JSON.parse(cleaned);

    return NextResponse.json({
      success: true,
      formattedPitch: parsedData.formattedPitch || transcript,
      answers: parsedData,
    });
  } catch (error: any) {
    console.error("[API/FormatVoice] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to format voice input." },
      { status: 500 }
    );
  }
}
