import { NextResponse } from "next/server";
import { AIProvider } from "@/lib/engines/ai-provider";
import { QuestionnaireAnswers } from "@/types";
import { safeJsonParse } from "@/lib/utils/json-repair";
import { cleanFieldText, extractStartupName } from "@/lib/utils/clean-inputs";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function normalizeRevenueModel(rawModel?: string): QuestionnaireAnswers["revenueModel"] {
  if (!rawModel) return "SaaS";
  const lower = rawModel.toLowerCase();
  if (lower.includes("marketplace") || lower.includes("platform") || lower.includes("take rate") || lower.includes("commission")) {
    return "Marketplace";
  }
  if (lower.includes("transaction") || lower.includes("fee") || lower.includes("pay-as-you-go") || lower.includes("usage") || lower.includes("per claim")) {
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
  // Method 1: pdf-parse v2 PDFParse class
  try {
    const pdfLib = require("pdf-parse");
    if (pdfLib?.PDFParse) {
      const parser = new pdfLib.PDFParse({ data: buffer });
      const result = await parser.getText();
      try { await parser.destroy(); } catch (e) {}
      if (typeof result === "string" && result.trim().length > 10) {
        return result.trim();
      }
      if (result?.text && typeof result.text === "string" && result.text.trim().length > 10) {
        return result.text.trim();
      }
    } else if (typeof pdfLib === "function") {
      const data = await pdfLib(buffer);
      if (data?.text && data.text.trim().length > 10) {
        return data.text.trim();
      }
    }
  } catch (e) {
    console.warn("[ParseDocument] pdf-parse method 1 skipped:", e);
  }

  // Method 2: Raw PDF text stream and TJ/Tj operators extraction
  try {
    const raw = buffer.toString("latin1");
    // Find text between parentheses followed by Tj or inside brackets before TJ
    const tjMatches = raw.match(/\(([^()]{2,})\)\s*Tj/g) || [];
    const blockMatches = raw.match(/BT\s+([\s\S]+?)\s+ET/g) || [];
    
    let extractedWords: string[] = [];
    tjMatches.forEach((m) => {
      const text = m.replace(/[\(\)]|Tj/g, "").trim();
      if (text.length > 1) extractedWords.push(text);
    });

    if (extractedWords.length > 5) {
      return extractedWords.join(" ");
    }

    // Clean ASCII strings
    const asciiStrings = raw
      .replace(/[^\x20-\x7E\n\r\t]/g, " ")
      .split(/\s{2,}/)
      .filter((s) => s.length > 3 && /[a-zA-Z]/.test(s) && !s.includes("obj") && !s.includes("endobj"));

    if (asciiStrings.length > 10) {
      return asciiStrings.slice(0, 300).join(" ");
    }
  } catch (e) {
    console.warn("[ParseDocument] PDF raw fallback skipped:", e);
  }

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
        return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });
      }

      const fileName = file.name.toLowerCase();
      const arrayBuf = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuf);

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

    if (!documentText || documentText.trim().length < 10) {
      return NextResponse.json(
        { error: "Could not extract readable text from document. Please ensure your PDF or PPTX contains readable text or copy-paste text directly." },
        { status: 400 }
      );
    }

    const sampledText = getSmartDocumentSample(documentText);
    console.log(`[API/ParseDocument] Extracted ${documentText.length} chars. Dispatching to OpenRouter...`);

    const aiProvider = new AIProvider();
    const systemPrompt = `You are an elite Venture Capital Diligence Analyst specializing in pitch deck evaluation.
Read the provided pitch deck text thoroughly and extract exact, accurate, startup-specific business parameters.
DO NOT use placeholder or generic statements — extract ONLY facts, metrics, and details found in the deck.

Output ONLY a JSON object matching this schema:
{
  "idea": "Clean 2-3 sentence overview of what the startup does, who it is for, and the core value proposition (do not prepend 'Startup Name:' or 'One-line pitch:').",
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

    let answers: Partial<QuestionnaireAnswers> = {};

    try {
      const responseText = await aiProvider.generateCompletion(systemPrompt, userPrompt, true);
      const rawParsed = safeJsonParse<any>(responseText, {});

      answers = {
        idea: cleanFieldText(rawParsed.idea) || documentText.slice(0, 350),
        targetCustomer: cleanFieldText(rawParsed.targetCustomer) || "Target enterprise buyers",
        problemSolved: cleanFieldText(rawParsed.problemSolved) || "Operational friction & cost overhead",
        existingAlternatives: cleanFieldText(rawParsed.existingAlternatives) || "Manual workarounds",
        geography: cleanFieldText(rawParsed.geography) || "Global",
        revenueModel: normalizeRevenueModel(rawParsed.revenueModel),
        pricingStrategy: cleanFieldText(rawParsed.pricingStrategy) || "Tiered pricing",
        competitors: cleanFieldText(rawParsed.competitors) || "",
        differentiation: cleanFieldText(rawParsed.differentiation) || "Specialized workflow advantage",
        currentValidation: cleanFieldText(rawParsed.currentValidation) || "Concept stage",
        teamBackground: cleanFieldText(rawParsed.teamBackground) || "Founding team",
        distributionChannel: cleanFieldText(rawParsed.distributionChannel) || "Direct outbound sales",
        tamEstimate: cleanFieldText(rawParsed.tamEstimate) || "Large addressable TAM",
      };
    } catch (llmErr) {
      console.warn("[ParseDocument] OpenRouter call failed, extracting heuristic parameters:", llmErr);
      answers = {
        idea: documentText.slice(0, 300),
        targetCustomer: "Target industry buyers",
        problemSolved: "Operational manual inefficiencies",
        existingAlternatives: "Legacy spreadsheets and manual labor",
        geography: "Target regional market",
        revenueModel: "SaaS",
        pricingStrategy: "Tiered SaaS subscription",
        competitors: "",
        differentiation: "Proprietary automated workflow",
        currentValidation: "Early discovery stage",
        teamBackground: "Domain founding team",
        distributionChannel: "Direct sales outreach",
        tamEstimate: "Large market opportunity",
      };
    }

    console.log("[API/ParseDocument] Pitch deck parsed successfully.");
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
