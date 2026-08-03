import { NextResponse } from "next/server";
import { AIProvider } from "@/lib/engines/ai-provider";
import { QuestionnaireAnswers } from "@/types";
import { safeJsonParse } from "@/lib/utils/json-repair";

export async function POST(req: Request) {
  try {
    const { transcript, audioBase64, mimeType } = await req.json();

    let textToProcess = transcript || "";

    // If base64 audio was recorded directly via MediaRecorder
    if (audioBase64 && !textToProcess) {
      const geminiKey = process.env.GEMINI_API_KEY;
      if (geminiKey && !geminiKey.startsWith("AQ.")) {
        try {
          const { GoogleGenerativeAI } = require("@google/generative-ai");
          const genAI = new GoogleGenerativeAI(geminiKey);
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

          const audioPart = {
            inlineData: {
              data: audioBase64,
              mimeType: mimeType || "audio/webm",
            },
          };

          const prompt = "Transcribe this audio recording of a startup pitch exactly in plain text.";
          const result = await model.generateContent([prompt, audioPart]);
          textToProcess = result.response.text();
        } catch (e) {
          console.warn("[API/FormatVoice] Gemini audio transcription fallback error:", e);
        }
      }
    }

    if (!textToProcess || textToProcess.trim().length < 3) {
      return NextResponse.json(
        { error: "No clear speech detected. Please speak clearly into your microphone and try again." },
        { status: 400 }
      );
    }

    console.log(`[API/FormatVoice] Processing transcript (${textToProcess.length} chars)...`);

    const aiProvider = new AIProvider();
    const systemPrompt = `You are an Elite Venture Capital Advisor and Pitch Structuring AI.
The founder spoke their startup idea via voice input. The raw transcript may contain filler words ("um", "uh", "like"), repetitions, or speech artifacts.
Your job is to:
1. Clean up and format the transcript into a crisp 2-3 sentence startup vision statement ("formattedPitch").
2. Extract all startup heuristic parameters into a JSON object matching this schema:
{
  "formattedPitch": "Polished, highly professional 2-3 sentence startup pitch",
  "targetCustomer": "Identified target customer segment (ICP)",
  "problemSolved": "Specific core problem statement",
  "existingAlternatives": "Current workarounds or competitor alternatives",
  "geography": "Target launch region",
  "revenueModel": "SaaS | Subscription | Marketplace | Transaction | Licensing | Other",
  "pricingStrategy": "Extracted pricing approach",
  "competitors": "Comma-separated list of competitors mentioned or implicit",
  "differentiation": "Defensible moat or unique technological advantage",
  "currentValidation": "Validation/traction metrics if spoken",
  "teamBackground": "Founder background or domain expertise if spoken",
  "distributionChannel": "Go-to-market distribution channel",
  "tamEstimate": "Market size estimate"
}

Output ONLY valid JSON without markdown wrappers.`;

    const userPrompt = `Spoken Voice Transcript:\n"${textToProcess}"`;

    const responseText = await aiProvider.generateCompletion(systemPrompt, userPrompt, true);
    const parsedData = safeJsonParse<any>(responseText, {
      formattedPitch: textToProcess,
      targetCustomer: "Spoken Target Segment",
      problemSolved: textToProcess,
    });

    return NextResponse.json({
      success: true,
      rawTranscript: textToProcess,
      formattedPitch: parsedData.formattedPitch || textToProcess,
      answers: parsedData,
    });
  } catch (error: any) {
    console.error("[API/FormatVoice] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to format voice pitch input." },
      { status: 500 }
    );
  }
}
