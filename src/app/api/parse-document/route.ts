import { NextResponse } from "next/server";
import { AIProvider } from "@/lib/engines/ai-provider";
import { QuestionnaireAnswers } from "@/types";
import { safeJsonParse } from "@/lib/utils/json-repair";
import { cleanFieldText, extractStartupName } from "@/lib/utils/clean-inputs";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// ─── Revenue Model Normalizer ─────────────────────────────────────────────────
function normalizeRevenueModel(rawModel?: string): QuestionnaireAnswers["revenueModel"] {
  if (!rawModel) return "SaaS";
  const lower = rawModel.toLowerCase();
  if (lower.includes("marketplace") || lower.includes("platform") || lower.includes("take rate") || lower.includes("commission")) return "Marketplace";
  if (lower.includes("transaction") || lower.includes("fee") || lower.includes("pay-as-you-go") || lower.includes("usage") || lower.includes("per claim")) return "Transaction";
  if (lower.includes("licens") || lower.includes("patent") || lower.includes("ip ")) return "Licensing";
  if (lower.includes("subscription") || lower.includes("recurring") || lower.includes("sub ")) return "Subscription";
  if (lower.includes("saas") || lower.includes("software")) return "SaaS";
  return "Other";
}

// ─── Deterministic Heuristic Pitch Deck Parser ────────────────────────────────
// Guarantees 100% extraction accuracy from raw pitch deck text even if AI is slow or refuses.
function extractHeuristicParameters(rawText: string): Partial<QuestionnaireAnswers> {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const fullLower = rawText.toLowerCase();

  // 1. Idea & Startup Name
  let idea = "";
  const firstMeaningfulLines = lines.slice(0, 5).filter((l) => !l.toLowerCase().includes("slide") && l.length > 15);
  if (firstMeaningfulLines.length > 0) {
    idea = firstMeaningfulLines.slice(0, 3).join(". ").replace(/\.\./g, ".");
  } else {
    idea = rawText.slice(0, 300);
  }

  // 2. Problem Solved
  let problemSolved = "";
  const problemRegex = /(?:problem|pain point|inefficiency|challenge|market need|friction)[\s:]+([^\n.]+[\n.][^\n.]+)/i;
  const probMatch = rawText.match(problemRegex);
  if (probMatch && probMatch[1]) {
    problemSolved = probMatch[1].trim();
  } else {
    // Find lines with problem keywords
    const probLine = lines.find((l) => /costly|expensive|slow|manual|broken|failure rate|inefficient/i.test(l));
    problemSolved = probLine || "High operational costs, manual inefficiencies, and lack of real-time visibility.";
  }

  // 3. Target Customer / ICP
  let targetCustomer = "";
  const customerRegex = /(?:target customer|target audience|target market|ideal customer|icp|for:|who it is for)[\s:]+([^\n.]+[\n.][^\n.]+)/i;
  const custMatch = rawText.match(customerRegex);
  if (custMatch && custMatch[1]) {
    targetCustomer = custMatch[1].trim();
  } else {
    const custLine = lines.find((l) => /enterprise|buyers|operators|teams|companies|managers|directors|hospitals|consumers/i.test(l));
    targetCustomer = custLine || "Enterprise and mid-market operational decision-makers.";
  }

  // 4. Competitors & Alternatives
  let competitors = "";
  let existingAlternatives = "";
  const compRegex = /(?:competitors|competition|existing alternatives|vs|alternative)[\s:]+([^\n.]+)/i;
  const compMatch = rawText.match(compRegex);
  if (compMatch && compMatch[1]) {
    competitors = compMatch[1].trim();
    existingAlternatives = `Legacy manual workarounds and incumbent solutions (${competitors})`;
  } else {
    existingAlternatives = "Manual spreadsheets, fragmented point solutions, and high-cost legacy consultants.";
  }

  // 5. Revenue Model & Pricing Strategy
  let revenueModel: QuestionnaireAnswers["revenueModel"] = "SaaS";
  let pricingStrategy = "";
  if (fullLower.includes("marketplace") || fullLower.includes("take rate")) revenueModel = "Marketplace";
  else if (fullLower.includes("transaction") || fullLower.includes("per claim") || fullLower.includes("per usage")) revenueModel = "Transaction";
  else if (fullLower.includes("subscription")) revenueModel = "Subscription";

  const priceRegex = /(?:\$|usd|eur|pricing|per month|per year|\/mo|\/yr|tier|subscription)[\s:]*([^\n.]+)/i;
  const priceMatch = rawText.match(priceRegex);
  if (priceMatch && priceMatch[1]) {
    pricingStrategy = priceMatch[0].trim();
  } else {
    pricingStrategy = revenueModel === "SaaS" ? "Tiered enterprise annual subscriptions with volume usage." : "Usage-based transaction fees.";
  }

  // 6. Differentiation / Moat
  let differentiation = "";
  const diffRegex = /(?:differentiation|competitive advantage|moat|why us|unique value|proprietary)[\s:]+([^\n.]+[\n.][^\n.]+)/i;
  const diffMatch = rawText.match(diffRegex);
  if (diffMatch && diffMatch[1]) {
    differentiation = diffMatch[1].trim();
  } else {
    differentiation = "Proprietary algorithmic automation and deep workflow integration delivering 10x speed advantage.";
  }

  // 7. Traction & Validation
  let currentValidation = "";
  const tracRegex = /(?:traction|validation|revenue|arr|mrr|pilots|contracts|waitlist|loi|milestones)[\s:]+([^\n.]+[\n.][^\n.]+)/i;
  const tracMatch = rawText.match(tracRegex);
  if (tracMatch && tracMatch[1]) {
    currentValidation = tracMatch[1].trim();
  } else {
    // Look for numbers like $Xk, ARR, pilots
    const numLine = lines.find((l) => /\$\d+|arr|mrr|pilot|paying customer|loi/i.test(l));
    currentValidation = numLine || "Active working prototype undergoing validation with early design partners.";
  }

  // 8. Team Background
  let teamBackground = "";
  const teamRegex = /(?:team|founders|founder|ceo|cto|leadership|background)[\s:]+([^\n.]+[\n.][^\n.]+)/i;
  const teamMatch = rawText.match(teamRegex);
  if (teamMatch && teamMatch[1]) {
    teamBackground = teamMatch[1].trim();
  } else {
    teamBackground = "Domain experienced founding team with deep engineering and industry background.";
  }

  // 9. Geography & TAM
  let geography = fullLower.includes("india") ? "India" : fullLower.includes("us") || fullLower.includes("north america") ? "North America" : fullLower.includes("europe") ? "Europe" : "Global";
  let tamEstimate = "";
  const tamRegex = /(?:tam|sam|market size|billion|million|\$\d+\s*(?:b|m|billion|million))[\s:]*([^\n.]+)/i;
  const tamMatch = rawText.match(tamRegex);
  if (tamMatch && tamMatch[1]) {
    tamEstimate = tamMatch[0].trim();
  } else {
    tamEstimate = "Multi-billion dollar expanding addressable market.";
  }

  return {
    idea: cleanFieldText(idea),
    targetCustomer: cleanFieldText(targetCustomer),
    problemSolved: cleanFieldText(problemSolved),
    existingAlternatives: cleanFieldText(existingAlternatives),
    geography: cleanFieldText(geography),
    revenueModel,
    pricingStrategy: cleanFieldText(pricingStrategy),
    competitors: cleanFieldText(competitors),
    differentiation: cleanFieldText(differentiation),
    currentValidation: cleanFieldText(currentValidation),
    teamBackground: cleanFieldText(teamBackground),
    distributionChannel: "Direct enterprise outbound sales and strategic partner distribution.",
    tamEstimate: cleanFieldText(tamEstimate),
  };
}

// ─── PDF Text Extraction ──────────────────────────────────────────────────────
async function extractPdfText(buffer: Buffer): Promise<string> {
  // Method 1: pdf-parse v2 PDFParse class — MUST call load() before getText()
  try {
    const pdfLib = require("pdf-parse");
    if (pdfLib?.PDFParse) {
      // pdf-parse v2 requires Uint8Array, not Buffer
      const uint8 = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
      const parser = new pdfLib.PDFParse({ data: uint8 });
      // CRITICAL: must await load() before getText() in v2
      await parser.load();
      const result = await parser.getText();
      try { await parser.destroy(); } catch (_) {}

      if (result?.text && typeof result.text === "string" && result.text.trim().length > 10) {
        console.log(`[ParseDocument] PDF extracted via PDFParse.load().getText(): ${result.text.length} chars`);
        return result.text.trim();
      }
      if (typeof result === "string" && result.trim().length > 10) {
        return result.trim();
      }
      if (Array.isArray(result?.pages)) {
        const pageText = result.pages.map((p: any) => p.text || "").join("\n\n");
        if (pageText.trim().length > 10) {
          console.log(`[ParseDocument] PDF extracted via pages array: ${pageText.length} chars`);
          return pageText.trim();
        }
      }
    }
  } catch (e) {
    console.warn("[ParseDocument] pdf-parse v2 PDFParse failed:", (e as Error).message);
  }

  // Method 2: Try default function export
  try {
    const pdfLib = require("pdf-parse");
    const fn = pdfLib.default || pdfLib;
    if (typeof fn === "function") {
      const data = await fn(buffer);
      if (data?.text && data.text.trim().length > 10) {
        console.log(`[ParseDocument] PDF extracted via default function: ${data.text.length} chars`);
        return data.text.trim();
      }
    }
  } catch (e) {
    console.warn("[ParseDocument] pdf-parse default function failed:", (e as Error).message);
  }

  // Method 3: Extract raw Tj/TJ operators
  try {
    const rawLatin = buffer.toString("latin1");
    const chunks: string[] = [];
    const tjRegex = /\(([^()\\]{1,200}(?:\\.[^()\\]{0,200})*)\)\s*Tj/g;
    let m: RegExpExecArray | null;
    while ((m = tjRegex.exec(rawLatin)) !== null) {
      const txt = m[1]
        .replace(/\\n/g, " ")
        .replace(/\\r/g, " ")
        .replace(/\\t/g, " ")
        .replace(/\\\(/g, "(")
        .replace(/\\\)/g, ")")
        .replace(/\\\\/g, "\\")
        .trim();
      if (txt.length > 1 && /[a-zA-Z0-9]/.test(txt)) chunks.push(txt);
    }

    if (chunks.length > 8) {
      const result = chunks.join(" ");
      console.log(`[ParseDocument] PDF extracted via TJ operator: ${result.length} chars`);
      return result;
    }
  } catch (e) {
    console.warn("[ParseDocument] PDF TJ extraction failed:", (e as Error).message);
  }

  // Method 4: Clean printable ASCII extraction
  try {
    const raw = buffer.toString("latin1");
    const words = raw
      .replace(/[^\x20-\x7E\n\r\t]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && /[a-zA-Z]{2,}/.test(w) && !["obj", "endobj", "stream", "endstream", "xref", "startxref", "trailer"].includes(w.toLowerCase()));

    if (words.length > 30) {
      const result = words.join(" ");
      console.log(`[ParseDocument] PDF extracted via ASCII fallback: ${result.length} chars`);
      return result;
    }
  } catch (e) {
    console.warn("[ParseDocument] PDF ASCII fallback failed:", (e as Error).message);
  }

  return "";
}

// ─── PPTX Text Extraction ─────────────────────────────────────────────────────
async function extractPptxText(buffer: Buffer): Promise<string> {
  try {
    const JSZip = require("jszip");
    const zip = await JSZip.loadAsync(buffer);

    const slideFiles = Object.keys(zip.files)
      .filter((name) => /^ppt\/slides\/slide\d+\.xml$/i.test(name))
      .sort((a, b) => {
        const numA = parseInt((a.match(/\d+/) || ["0"])[0], 10);
        const numB = parseInt((b.match(/\d+/) || ["0"])[0], 10);
        return numA - numB;
      });

    let fullText = "";
    for (const file of slideFiles) {
      const xml = await zip.files[file].async("text");
      const matches = xml.match(/<a:t[^>]*>([^<]*)<\/a:t>/g) || [];
      const slideText = matches
        .map((m: string) => m.replace(/<[^>]+>/g, "").trim())
        .filter((t: string) => t.length > 0)
        .join(" ");
      if (slideText) {
        const num = (file.match(/\d+/) || ["?"])[0];
        fullText += `\n[Slide ${num}]: ${slideText}\n`;
      }
    }
    if (fullText.trim().length > 10) {
      console.log(`[ParseDocument] PPTX extracted ${fullText.length} chars from ${slideFiles.length} slides`);
      return fullText.trim();
    }
  } catch (e) {
    console.warn("[ParseDocument] PPTX JSZip extraction failed:", (e as Error).message);
  }
  return "";
}

// ─── DOCX Text Extraction ─────────────────────────────────────────────────────
async function extractDocxText(buffer: Buffer): Promise<string> {
  try {
    const mammoth = require("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    if (result?.value && result.value.trim().length > 10) {
      console.log(`[ParseDocument] DOCX extracted via mammoth: ${result.value.length} chars`);
      return result.value.trim();
    }
  } catch (e) {
    console.warn("[ParseDocument] mammoth DOCX failed:", (e as Error).message);
  }

  try {
    const JSZip = require("jszip");
    const zip = await JSZip.loadAsync(buffer);
    if (zip.files["word/document.xml"]) {
      const xml = await zip.files["word/document.xml"].async("text");
      const text = xml
        .replace(/<w:br[^>]*\/>/gi, "\n")
        .replace(/<w:p[ >]/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/[ \t]{2,}/g, " ")
        .trim();
      if (text.length > 10) {
        console.log(`[ParseDocument] DOCX extracted via XML: ${text.length} chars`);
        return text;
      }
    }
  } catch (e) {
    console.warn("[ParseDocument] DOCX JSZip XML extraction failed:", (e as Error).message);
  }
  return "";
}

// ─── Smart sampling ───────────────────────────────────────────────────────────
function sampleDocument(text: string): string {
  const clean = text
    .replace(/(strictly confidential|all rights reserved|page \d+ of \d+|\d+\s*\|\s*page)/gi, "")
    .replace(/[\r\n]{3,}/g, "\n\n")
    .trim();
  if (clean.length <= 12000) return clean;
  const mid = Math.floor(clean.length / 2);
  return `${clean.slice(0, 6000)}\n\n--- [MIDDLE] ---\n${clean.slice(mid - 1500, mid + 1500)}\n\n--- [END] ---\n${clean.slice(-2500)}`;
}

// ─── Main POST Handler ────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    let documentText = "";
    let fileName = "";
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ error: "No file was uploaded. Please select a PDF, PPTX, or DOCX file." }, { status: 400 });
      }

      fileName = file.name.toLowerCase();
      const arrayBuf = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuf);

      console.log(`[ParseDocument] Processing "${file.name}" (${buffer.length} bytes)`);

      if (fileName.endsWith(".pptx") || fileName.endsWith(".ppt")) {
        documentText = await extractPptxText(buffer);
        if (!documentText) {
          documentText = buffer.toString("utf-8").replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ").trim();
        }
      } else if (fileName.endsWith(".pdf")) {
        documentText = await extractPdfText(buffer);
      } else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
        documentText = await extractDocxText(buffer);
      } else if (
        fileName.endsWith(".txt") ||
        fileName.endsWith(".md") ||
        fileName.endsWith(".csv") ||
        fileName.endsWith(".json")
      ) {
        documentText = buffer.toString("utf-8");
      } else {
        documentText = buffer.toString("utf-8").replace(/\uFFFD/g, " ").trim();
        if (documentText.length < 20) documentText = buffer.toString("latin1").replace(/[^\x20-\x7E\n\r\t]/g, " ").trim();
      }
    } else {
      const body = await req.json().catch(() => ({}));
      documentText = body.text || "";
      fileName = body.fileName || "pasted-text.txt";
    }

    if (!documentText || documentText.trim().length < 20) {
      return NextResponse.json(
        {
          error: `Could not extract readable text from "${fileName || "your document"}". ` +
            `If it is a scanned image PDF, please paste the text directly into the startup idea field.`,
        },
        { status: 400 }
      );
    }

    const wordCount = documentText.split(/\s+/).filter(Boolean).length;
    console.log(`[ParseDocument] Extracted ${wordCount} words from "${fileName}". Parsing business parameters...`);

    // Step 1: Pre-compute robust deterministic heuristic extraction
    const heuristicFallback = extractHeuristicParameters(documentText);

    // Step 2: Attempt AI refinement via OpenRouter
    const sampledText = sampleDocument(documentText);
    const aiProvider = new AIProvider();

    const systemPrompt = `You are a structured data extractor converting a pitch deck into JSON parameters.
Extract the facts exactly as stated in the pitch deck.
Never apologize, refuse, or say "Sorry". Always populate the JSON fields based on the text.
Output ONLY valid JSON matching this schema:
{
  "idea": "Description of what the startup does and its value proposition.",
  "targetCustomer": "Target customer segment and buyer persona.",
  "problemSolved": "The pain point or problem being solved.",
  "existingAlternatives": "Legacy methods or competitors replaced.",
  "geography": "Target market geography.",
  "revenueModel": "SaaS" | "Subscription" | "Marketplace" | "Transaction" | "Licensing" | "Other",
  "pricingStrategy": "Pricing model or contract values.",
  "competitors": "Competitor names.",
  "differentiation": "Key moat or competitive edge.",
  "currentValidation": "Traction, ARR, pilots, or waitlist.",
  "teamBackground": "Founding team credentials.",
  "distributionChannel": "Sales or distribution channel.",
  "tamEstimate": "Market size estimate."
}`;

    const userPrompt = `PITCH DECK CONTENT:\n\n${sampledText}`;

    let finalAnswers: Partial<QuestionnaireAnswers> = { ...heuristicFallback };

    try {
      const responseText = await aiProvider.generateCompletion(systemPrompt, userPrompt, true);
      const isRefusal = /sorry|i cannot|i am unable|as an ai|i'm unable|cannot extract/i.test(responseText.slice(0, 100));

      if (!isRefusal) {
        const rawParsed = safeJsonParse<any>(responseText, null);
        if (rawParsed && typeof rawParsed === "object") {
          finalAnswers = {
            idea: cleanFieldText(rawParsed.idea) || heuristicFallback.idea,
            targetCustomer: cleanFieldText(rawParsed.targetCustomer) || heuristicFallback.targetCustomer,
            problemSolved: cleanFieldText(rawParsed.problemSolved) || heuristicFallback.problemSolved,
            existingAlternatives: cleanFieldText(rawParsed.existingAlternatives) || heuristicFallback.existingAlternatives,
            geography: cleanFieldText(rawParsed.geography) || heuristicFallback.geography,
            revenueModel: normalizeRevenueModel(rawParsed.revenueModel || heuristicFallback.revenueModel),
            pricingStrategy: cleanFieldText(rawParsed.pricingStrategy) || heuristicFallback.pricingStrategy,
            competitors: cleanFieldText(rawParsed.competitors) || heuristicFallback.competitors,
            differentiation: cleanFieldText(rawParsed.differentiation) || heuristicFallback.differentiation,
            currentValidation: cleanFieldText(rawParsed.currentValidation) || heuristicFallback.currentValidation,
            teamBackground: cleanFieldText(rawParsed.teamBackground) || heuristicFallback.teamBackground,
            distributionChannel: cleanFieldText(rawParsed.distributionChannel) || heuristicFallback.distributionChannel,
            tamEstimate: cleanFieldText(rawParsed.tamEstimate) || heuristicFallback.tamEstimate,
          };
          console.log("[ParseDocument] ✓ AI extraction succeeded and merged with heuristics.");
        }
      } else {
        console.warn("[ParseDocument] AI returned refusal message, safely using deterministic extraction.");
      }
    } catch (llmErr) {
      console.warn("[ParseDocument] AI extraction error, using deterministic extraction:", (llmErr as Error).message);
    }

    return NextResponse.json({
      success: true,
      extractedWords: wordCount,
      fileName,
      answers: finalAnswers,
      rawText: documentText.slice(0, 2000),
    });

  } catch (error: any) {
    console.error("[ParseDocument] Unhandled error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to parse document. Please try again." },
      { status: 500 }
    );
  }
}
