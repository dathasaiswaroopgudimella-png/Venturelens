import { NextResponse } from "next/server";
import { AIProvider } from "@/lib/engines/ai-provider";
import { QuestionnaireAnswers } from "@/types";

export async function POST(req: Request) {
  try {
    let documentText = "";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
      }

      const fileName = file.name.toLowerCase();
      const buffer = Buffer.from(await file.arrayBuffer());

      if (fileName.endsWith(".pdf")) {
        try {
          // Dynamic import of pdf-parse
          const pdfParse = require("pdf-parse");
          const parsedPdf = await pdfParse(buffer);
          documentText = parsedPdf.text || "";
        } catch (e) {
          // Fallback to UTF-8 string decoding
          documentText = buffer.toString("utf-8");
        }
      } else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
        try {
          const mammoth = require("mammoth");
          const result = await mammoth.extractRawText({ buffer });
          documentText = result.value || "";
        } catch (e) {
          documentText = buffer.toString("utf-8");
        }
      } else {
        documentText = buffer.toString("utf-8");
      }
    } else {
      const body = await req.json();
      documentText = body.text || "";
    }

    if (!documentText || documentText.trim().length < 10) {
      return NextResponse.json(
        { error: "Could not extract readable text from the uploaded document." },
        { status: 400 }
      );
    }

    console.log(`[API/ParseDocument] Processing document (${documentText.length} characters)...`);

    const aiProvider = new AIProvider();
    const systemPrompt = `You are a Senior Venture Capital Analyst and Pitch Deck Parser.
Your job is to read the provided pitch deck / document text and extract structured startup parameters into a JSON object matching this schema:
{
  "idea": "A comprehensive 2-3 sentence overview of the startup concept, product, and core value proposition",
  "targetCustomer": "Detailed Target Customer Profile (ICP)",
  "problemSolved": "Specific core problem solved by the venture",
  "existingAlternatives": "Current workarounds or competitor alternatives",
  "geography": "Target market launch geography (e.g., North America, Global, India, NYC)",
  "revenueModel": "SaaS | Subscription | Marketplace | Transaction | Licensing | Other",
  "pricingStrategy": "Extracted pricing structure or strategy",
  "competitors": "Comma-separated list of top competitors mentioned or implicit",
  "differentiation": "Defensible moat, technical advantage, or unique edge",
  "currentValidation": "Traction, revenue, LOIs, pilot metrics, or prototype status",
  "teamBackground": "Founder credentials, domain expertise, or team background",
  "distributionChannel": "Go-to-market and customer acquisition channel",
  "tamEstimate": "Total addressable market size estimate"
}

Output ONLY valid JSON. If a field is not explicitly mentioned in the text, infer a reasonable answer based on the context of the venture. Do not leave fields empty.`;

    const userPrompt = `Document Content:\n${documentText.slice(0, 15000)}`;

    const responseText = await aiProvider.generateCompletion(systemPrompt, userPrompt, true);
    const cleaned = responseText.replace(/```json/i, "").replace(/```/g, "").trim();
    const parsedAnswers: Partial<QuestionnaireAnswers> = JSON.parse(cleaned);

    console.log("[API/ParseDocument] Document parsing completed successfully.");
    return NextResponse.json({
      success: true,
      extractedWords: documentText.split(/\s+/).length,
      answers: parsedAnswers,
      rawText: documentText.slice(0, 2000),
    });
  } catch (error: any) {
    console.error("[API/ParseDocument] Parsing error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to parse document with AI." },
      { status: 500 }
    );
  }
}
