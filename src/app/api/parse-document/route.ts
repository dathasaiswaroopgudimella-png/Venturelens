import { NextResponse } from "next/server";
import { AIProvider } from "@/lib/engines/ai-provider";
import { QuestionnaireAnswers } from "@/types";
import { safeJsonParse } from "@/lib/utils/json-repair";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

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

async function extractPptxText(buffer: Buffer): Promise<string> {
  try {
    const JSZip = require("jszip");
    const zip = await JSZip.loadAsync(buffer);
    const slideFiles = Object.keys(zip.files)
      .filter((name) => /^ppt\/slides\/slide\d+\.xml$/i.test(name))
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)![0], 10);
        const numB = parseInt(b.match(/\d+/)![0], 10);
        return numA - numB;
      });

    let fullPptText = "";
    for (const file of slideFiles) {
      const slideXml = await zip.files[file].async("text");
      const matches = slideXml.match(/<a:t[^>]*>([\s\S]*?)<\/a:t>/g) || [];
      const slideText = matches
        .map((m: string) => m.replace(/<[^>]+>/g, "").trim())
        .filter(Boolean)
        .join(" ");

      if (slideText) {
        const slideNum = file.match(/\d+/)![0];
        fullPptText += `\n[Slide ${slideNum}]: ${slideText}\n`;
      }
    }
    return fullPptText.trim();
  } catch (err) {
    console.warn("[ParseDocument] PPTX extraction error:", err);
    return "";
  }
}

async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const pdfLib = require("pdf-parse");
    if (typeof pdfLib === "function") {
      const data = await pdfLib(buffer);
      if (data?.text && data.text.trim().length > 10) {
        return data.text.trim();
      }
    } else if (pdfLib?.PDFParse) {
      const parser = new pdfLib.PDFParse({ data: buffer });
      const result = await parser.getText();
      try { await parser.destroy(); } catch (e) {}
      if (typeof result === "string" && result.trim().length > 10) {
        return result.trim();
      }
      if (result?.text && typeof result.text === "string" && result.text.trim().length > 10) {
        return result.text.trim();
      }
    }
  } catch (e) {
    console.warn("[ParseDocument] pdf-parse error:", e);
  }

  // Fallback text extraction from raw PDF byte streams
  try {
    const raw = buffer.toString("utf-8");
    const textMatches = raw.match(/\(([^()]+)\)\s*Tj/g) || raw.match(/\[([^\[\]]+)\]\s*TJ/g);
    if (textMatches && textMatches.length > 5) {
      return textMatches
        .map((m) => m.replace(/[\(\)\[\]]|Tj|TJ/g, "").trim())
        .filter(Boolean)
        .join(" ");
    }
  } catch (e) {}

  return "";
}

async function extractDocxText(buffer: Buffer): Promise<string> {
  try {
    const mammoth = require("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    if (result.value && result.value.trim().length > 10) {
      return result.value.trim();
    }
  } catch (e) {
    console.warn("[ParseDocument] mammoth error:", e);
  }
  return "";
}

function getSmartDocumentSample(fullText: string): string {
  const cleaned = fullText
    .replace(/(strictly confidential|all rights reserved|page \d+ of \d+|\d+\s*\|\s*page)/gi, "")
    .replace(/[\r\n]{3,}/g, "\n\n")
    .trim();

  if (cleaned.length <= 12000) return cleaned;

  const beginning = cleaned.slice(0, 6000);
  const midPoint = Math.floor(cleaned.length / 2);
  const middle = cleaned.slice(midPoint - 2000, midPoint + 2000);
  const end = cleaned.slice(-2500);

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

      if (fileName.endsWith(".pptx") || fileName.endsWith(".ppt")) {
        documentText = await extractPptxText(buffer);
        if (!documentText) {
          documentText = buffer.toString("utf-8").replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ");
        }
      } else if (fileName.endsWith(".pdf")) {
        documentText = await extractPdfText(buffer);
      } else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
        documentText = await extractDocxText(buffer);
      } else {
        documentText = buffer.toString("utf-8");
      }
    } else {
      const body = await req.json();
      documentText = body.text || "";
    }

    if (!documentText || documentText.trim().length < 15) {
      return NextResponse.json(
        { error: "Could not extract readable text from the uploaded document. Please upload a standard PDF, PPTX, or DOCX file." },
        { status: 400 }
      );
    }

    const sampledText = getSmartDocumentSample(documentText);
    console.log(`[API/ParseDocument] Extracted ${documentText.length} characters. Processing with OpenRouter...`);

    const aiProvider = new AIProvider();
    const systemPrompt = `You are a Principal Venture Capital Diligence Analyst specializing in pitch deck evaluation.
Read the provided pitch deck text thoroughly and extract exact, accurate, startup-specific business parameters.
DO NOT use placeholder or generic statements — extract ONLY facts, metrics, and details found in the deck.

Output ONLY a JSON object matching this schema:
{
  "idea": "Comprehensive 2-3 sentence overview of what the startup does, who it is for, and the core value proposition.",
  "targetCustomer": "Specific Ideal Customer Profile (ICP) and buyer persona.",
  "problemSolved": "The acute problem, inefficiency, or pain point described.",
  "existingAlternatives": "Current legacy methods, competitors, or manual workarounds being replaced.",
  "geography": "Target launch market / geographic focus.",
  "revenueModel": "SaaS" | "Subscription" | "Marketplace" | "Transaction" | "Licensing" | "Other",
  "pricingStrategy": "Extracted pricing model, tiers, take rates, or contract values.",
  "competitors": "Comma-separated list of competitor companies mentioned or implied in the sector.",
  "differentiation": "Defensible moat, proprietary tech, speed advantage, or network effect.",
  "currentValidation": "Traction, revenue/ARR, pilots, LOIs, waitlist size, or prototype milestone.",
  "teamBackground": "Founding team background, past experience, domain credentials.",
  "distributionChannel": "GTM distribution channels and acquisition strategy.",
  "tamEstimate": "Total addressable market (TAM/SAM) sizing estimate."
}`;

    const userPrompt = `PITCH DECK CONTENT:\n${sampledText}`;

    const responseText = await aiProvider.generateCompletion(systemPrompt, userPrompt, true);
    const rawParsed = safeJsonParse<any>(responseText, {});

    const answers: Partial<QuestionnaireAnswers> = {
      idea: rawParsed.idea || documentText.slice(0, 400),
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

    console.log("[API/ParseDocument] Pitch deck parsed successfully with OpenRouter AI.");
    return NextResponse.json({
      success: true,
      extractedWords: documentText.split(/\s+/).length,
      answers,
      rawText: documentText.slice(0, 1500),
    });
  } catch (error: any) {
    console.error("[API/ParseDocument] Document parsing failed:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to parse pitch deck." },
      { status: 500 }
    );
  }
}
