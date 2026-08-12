import { NextResponse } from "next/server";
import { AIProvider } from "@/lib/engines/ai-provider";
import { QuestionnaireAnswers } from "@/types";
import { safeJsonParse } from "@/lib/utils/json-repair";

/**
 * Normalizes extracted revenue model string to valid questionnaire enum values.
 */
function normalizeRevenueModel(rawModel?: string): QuestionnaireAnswers["revenueModel"] {
  if (!rawModel) return "SaaS";
  const lower = rawModel.toLowerCase();
  if (lower.includes("marketplace") || lower.includes("platform") || lower.includes("take rate") || lower.includes("commission")) {
    return "Marketplace";
  }
  if (lower.includes("transaction") || lower.includes("fee") || lower.includes("pay-as-you-go") || lower.includes("usage")) {
    return "Transaction";
  }
  if (lower.includes("licens") || lower.includes("patent") || lower.includes("ip ")) {
    return "Licensing";
  }
  if (lower.includes("subscription") || lower.includes("recurring") || lower.includes("sub ")) {
    return "Subscription";
  }
  if (lower.includes("saas") || lower.includes("software")) {
    return "SaaS";
  }
  return "Other";
}

/**
 * Smart document text sampler that combines the beginning (executive summary/problem/solution),
 * middle (product/business model/traction), and end (team/TAM) while stripping layout noise.
 */
function getSmartDocumentSample(fullText: string): string {
  // Strip common PDF/DOCX header noise and page numbers
  const cleaned = fullText
    .replace(/(strictly confidential|all rights reserved|page \d+ of \d+|\d+\s*\|\s*page)/gi, "")
    .replace(/[\r\n]{3,}/g, "\n\n")
    .trim();

  if (cleaned.length <= 8000) return cleaned;

  // Sample beginning (5000 chars), middle (2000 chars), and end (1500 chars)
  const beginning = cleaned.slice(0, 5000);
  const midPoint = Math.floor(cleaned.length / 2);
  const middle = cleaned.slice(midPoint - 1000, midPoint + 1000);
  const end = cleaned.slice(-1500);

  return `${beginning}\n\n--- [MIDDLE SECTION SAMPLE] ---\n${middle}\n\n--- [FINAL SECTION SAMPLE] ---\n${end}`;
}

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
          const pdfParse = require("pdf-parse");
          const parsedPdf = await pdfParse(buffer);
          documentText = parsedPdf.text || "";
        } catch (e) {
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

    const sampledText = getSmartDocumentSample(documentText);
    console.log(`[API/ParseDocument] Smart-sampling document (${sampledText.length} chars from ${documentText.length} total)...`);

    const aiProvider = new AIProvider();
    const systemPrompt = `You are an Expert Venture Capital Partner and Pitch Deck Parsing Intelligence.
Your objective is to read the provided startup pitch deck text and extract 100% accurate, highly specific business parameters into a JSON object.

CRITICAL INSTRUCTIONS FOR EXTRACTION ACCURACY:
1. "idea": High-level 2-3 sentence overview of the product, value proposition, and core concept. Must be specific to this startup.
2. "targetCustomer": Who specifically buys or uses this (Ideal Customer Profile / ICP).
3. "problemSolved": The exact friction point, pain, or inefficiency being solved.
4. "existingAlternatives": Current legacy software, manual workarounds, or competitor alternatives used today.
5. "geography": Target launch region (e.g. North America, Global, US & Europe, India, SEA).
6. "revenueModel": MUST be one of: "SaaS" | "Subscription" | "Marketplace" | "Transaction" | "Licensing" | "Other".
7. "pricingStrategy": Extracted pricing structure (e.g. $49/mo per seat, 5% take rate, tiered enterprise).
8. "competitors": Comma-separated list of competitor names only (e.g. "Stripe, Adyen, Checkout.com").
9. "differentiation": Unique moat, technical advantage, network effect, or speed edge.
10. "currentValidation": Metrics, ARR/MRR, pilots, waitlist count, revenue, or prototype progress.
11. "teamBackground": Founder experience, previous exits, domain expertise, or technical credentials.
12. "distributionChannel": Go-to-market strategy (e.g. Outbound B2B, Content/SEO, Product-Led Growth).
13. "tamEstimate": Addressable market size estimate (e.g. "$12B Global Market").

Output ONLY a valid JSON object matching the requested keys (no extra narrative text or markdown wrappers).`;

    const userPrompt = `Startup Pitch Deck Document:\n${sampledText}`;

    const responseText = await aiProvider.generateCompletion(systemPrompt, userPrompt, true);
    const rawParsed = safeJsonParse<any>(responseText, {});

    // Clean and normalize answers
    const answers: Partial<QuestionnaireAnswers> = {
      idea: rawParsed.idea || documentText.slice(0, 300),
      targetCustomer: rawParsed.targetCustomer || "Target market segment",
      problemSolved: rawParsed.problemSolved || "Market friction point",
      existingAlternatives: rawParsed.existingAlternatives || "Legacy manual processes",
      geography: rawParsed.geography || "Global",
      revenueModel: normalizeRevenueModel(rawParsed.revenueModel),
      pricingStrategy: rawParsed.pricingStrategy || "Tiered pricing",
      competitors: rawParsed.competitors || "",
      differentiation: rawParsed.differentiation || "Specialized workflow advantage",
      currentValidation: rawParsed.currentValidation || "Concept stage",
      teamBackground: rawParsed.teamBackground || "Domain expert team",
      distributionChannel: rawParsed.distributionChannel || "Direct digital acquisition",
      tamEstimate: rawParsed.tamEstimate || "Large TAM",
    };

    console.log("[API/ParseDocument] Document parsed and normalized successfully.");
    return NextResponse.json({
      success: true,
      extractedWords: documentText.split(/\s+/).length,
      answers,
      rawText: documentText.slice(0, 1500),
    });
  } catch (error: any) {
    console.error("[API/ParseDocument] Parsing error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to parse document with AI." },
      { status: 500 }
    );
  }
}
