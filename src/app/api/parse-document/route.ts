import { NextResponse } from "next/server";
import { AIProvider } from "@/lib/engines/ai-provider";
import { QuestionnaireAnswers } from "@/types";
import { safeJsonParse } from "@/lib/utils/json-repair";
import { cleanFieldText } from "@/lib/utils/clean-inputs";

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
function extractHeuristicParameters(rawText: string): Partial<QuestionnaireAnswers> {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  const fullLower = rawText.toLowerCase();

  // 1. Idea & Startup Name
  const firstMeaningfulLines = lines.slice(0, 6).filter((l) => !l.toLowerCase().includes("slide") && l.length > 12);
  const idea = firstMeaningfulLines.length > 0
    ? firstMeaningfulLines.slice(0, 3).join(". ").replace(/\.\./g, ".")
    : rawText.slice(0, 300);

  // 2. Problem
  const probMatch = rawText.match(/(?:problem|pain point|inefficiency|challenge|market need|friction)[\s:]+([^\n.]{20,}(?:[\n.][^\n.]+)?)/i);
  const probLine = lines.find((l) => /costly|expensive|slow|manual|broken|failure|inefficient|wasted/i.test(l) && l.length > 20);
  const problemSolved = probMatch?.[1]?.trim() || probLine || "Operational inefficiencies and high manual overhead in existing workflows.";

  // 3. Target Customer / ICP
  const custMatch = rawText.match(/(?:target customer|target audience|target market|ideal customer|icp|for:|who it is for)[\s:]+([^\n.]{15,}(?:[\n.][^\n.]+)?)/i);
  const custLine = lines.find((l) => /enterprise|buyers|operators|teams|companies|managers|directors|hospitals|consumers|founders/i.test(l) && l.length > 15);
  const targetCustomer = custMatch?.[1]?.trim() || custLine || "Enterprise and mid-market operational decision-makers.";

  // 4. Competitors & Alternatives
  const compMatch = rawText.match(/(?:competitors|competition|existing alternatives|vs\.?|alternative)[\s:]+([^\n.]{10,})/i);
  const competitors = compMatch?.[1]?.trim() || "";
  const existingAlternatives = competitors
    ? `Legacy manual workarounds and incumbent solutions including ${competitors}`
    : "Manual spreadsheets, fragmented point solutions, and high-cost legacy consultants.";

  // 5. Revenue Model & Pricing
  let revenueModel: QuestionnaireAnswers["revenueModel"] = "SaaS";
  if (/marketplace|take\s*rate/i.test(fullLower)) revenueModel = "Marketplace";
  else if (/\btransaction|per\s*claim|per\s*usage\b/i.test(fullLower)) revenueModel = "Transaction";
  else if (/subscription/i.test(fullLower)) revenueModel = "Subscription";
  else if (/licens|enterprise\s*deal|contract\s*value/i.test(fullLower)) revenueModel = "Licensing";
  else if (/hardware|retrofit|capex|equipment/i.test(fullLower)) revenueModel = "Other";

  const priceMatch = rawText.match(/(?:\$|usd|eur|pricing|per\s*month|per\s*year|\/mo|\/yr|tier|subscription)[\s:]*([^\n.]{5,})/i);
  const pricingStrategy = priceMatch?.[0]?.trim() || (revenueModel === "SaaS" ? "Tiered enterprise annual subscriptions with volume pricing." : "Usage-based transaction fees with tiered enterprise contracts.");

  // 6. Differentiation / Moat
  const diffMatch = rawText.match(/(?:differentiation|competitive advantage|moat|why us|unique value|proprietary|innovation)[\s:]+([^\n.]{20,}(?:[\n.][^\n.]+)?)/i);
  const differentiation = diffMatch?.[1]?.trim() || "Proprietary architecture and deep workflow integration delivering measurable efficiency advantages.";

  // 7. Traction & Validation
  const tracMatch = rawText.match(/(?:traction|validation|revenue|arr|mrr|pilots|contracts|waitlist|loi|milestones)[\s:]+([^\n.]{10,}(?:[\n.][^\n.]+)?)/i);
  const numLine = lines.find((l) => /\$\d+|arr|mrr|pilot|paying\s*customer|loi|letter of intent/i.test(l));
  const currentValidation = tracMatch?.[1]?.trim() || numLine || "Active working prototype undergoing validation with early design partners.";

  // 8. Team Background
  const teamMatch = rawText.match(/(?:team|founders|founder|ceo|cto|leadership|background)[\s:]+([^\n.]{15,}(?:[\n.][^\n.]+)?)/i);
  const teamBackground = teamMatch?.[1]?.trim() || "Domain experienced founding team with deep engineering and industry background.";

  // 9. Geography & TAM
  const geography = /\bindia\b/i.test(fullLower) ? "India"
    : /\b(us|usa|united states|north america)\b/i.test(fullLower) ? "North America"
    : /\beurope\b/i.test(fullLower) ? "Europe"
    : /\bglobal\b/i.test(fullLower) ? "Global"
    : "Global";

  const tamMatch = rawText.match(/(?:tam|sam|market size|billion|million|\$\d+\s*(?:b|m|billion|million))[\s:]*([^\n.]{5,})/i);
  const tamEstimate = tamMatch?.[0]?.trim() || "Multi-billion dollar expanding addressable market.";

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

// ─── Safe Uint8Array from Node Buffer ─────────────────────────────────────────
// CRITICAL: Buffer.from(arrayBuf) creates a Buffer whose .buffer may be a larger
// shared ArrayBuffer. Using `new Uint8Array(buf)` (without offset/length) safely
// copies only the relevant bytes, preventing pdf-parse from reading garbage data.
function toUint8Array(buf: Buffer): Uint8Array {
  const arr = new Uint8Array(buf.length);
  for (let i = 0; i < buf.length; i++) arr[i] = buf[i];
  return arr;
}

// ─── PDF Text Extraction (5-Layer Fallback) ────────────────────────────────────
async function extractPdfText(buffer: Buffer): Promise<string> {
  // Layer 1: pdf-parse v2 PDFParse class — MUST call load() then getText()
  try {
    const pdfLib = require("pdf-parse");
    if (pdfLib?.PDFParse) {
      const uint8 = toUint8Array(buffer); // safe copy, no shared ArrayBuffer issues
      const parser = new pdfLib.PDFParse({ data: uint8 });
      await parser.load(); // REQUIRED in v2 before getText()
      const result = await parser.getText();
      try { await parser.destroy(); } catch (_) {}

      const text = result?.text ?? (typeof result === "string" ? result : "");
      if (text.trim().length > 10) {
        console.log(`[ParseDocument] PDF Layer 1 success: ${text.length} chars`);
        return text.trim();
      }
      // Also try pages array
      if (Array.isArray(result?.pages)) {
        const pageText = result.pages.map((p: any) => p.text || "").join("\n\n");
        if (pageText.trim().length > 10) {
          console.log(`[ParseDocument] PDF Layer 1 pages: ${pageText.length} chars`);
          return pageText.trim();
        }
      }
    }
  } catch (e) {
    console.warn("[ParseDocument] PDF Layer 1 failed:", (e as Error).message);
  }

  // Layer 2: Try pdf-parse as a plain function (older API compat)
  try {
    const pdfLib = require("pdf-parse");
    // Some bundled versions expose it differently
    const candidates = [pdfLib.parse, pdfLib.default, pdfLib];
    for (const fn of candidates) {
      if (typeof fn === "function") {
        const data = await fn(buffer);
        if (data?.text?.trim().length > 10) {
          console.log(`[ParseDocument] PDF Layer 2 function: ${data.text.length} chars`);
          return data.text.trim();
        }
      }
    }
  } catch (e) {
    console.warn("[ParseDocument] PDF Layer 2 failed:", (e as Error).message);
  }

  // Layer 3: Extract raw PDF text operators (Tj / TJ / ')
  try {
    const raw = buffer.toString("latin1");
    const chunks: string[] = [];

    // Match both Tj and TJ (array) operators
    const tjRegex = /\(([^()\\]{1,300}(?:\\.[^()\\]{0,300})*)\)\s*(?:Tj|'|")/g;
    let m: RegExpExecArray | null;
    while ((m = tjRegex.exec(raw)) !== null) {
      const txt = m[1]
        .replace(/\\n/g, " ").replace(/\\r/g, " ").replace(/\\t/g, " ")
        .replace(/\\\(/g, "(").replace(/\\\)/g, ")").replace(/\\\\/g, "\\")
        .trim();
      if (txt.length > 1 && /[a-zA-Z0-9]/.test(txt)) chunks.push(txt);
    }

    // Also match TJ array format: [(text) num (text)]TJ
    const tjArrayRegex = /\[([^\]]+)\]\s*TJ/g;
    while ((m = tjArrayRegex.exec(raw)) !== null) {
      const inner = m[1];
      const strParts = inner.match(/\(([^()\\]*(?:\\.[^()\\]*)*)\)/g) || [];
      for (const part of strParts) {
        const txt = part.slice(1, -1).replace(/\\./g, " ").trim();
        if (txt.length > 1 && /[a-zA-Z0-9]/.test(txt)) chunks.push(txt);
      }
    }

    if (chunks.length > 5) {
      const result = chunks.join(" ");
      console.log(`[ParseDocument] PDF Layer 3 TJ operators: ${result.length} chars, ${chunks.length} chunks`);
      return result;
    }
  } catch (e) {
    console.warn("[ParseDocument] PDF Layer 3 failed:", (e as Error).message);
  }

  // Layer 4: Extract readable ASCII words (aggressive)
  try {
    const raw = buffer.toString("latin1");
    const PDF_KEYWORDS = new Set(["obj", "endobj", "stream", "endstream", "xref", "startxref", "trailer", "pdf", "page", "pages", "font", "width", "height", "type", "null", "true", "false", "ref"]);
    const words = raw
      .replace(/[^\x20-\x7E\n\r\t]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && /[a-zA-Z]{3,}/.test(w) && !PDF_KEYWORDS.has(w.toLowerCase()) && !/^\d+$/.test(w));

    if (words.length > 15) {
      const result = words.join(" ");
      console.log(`[ParseDocument] PDF Layer 4 ASCII: ${result.length} chars, ${words.length} words`);
      return result;
    }
  } catch (e) {
    console.warn("[ParseDocument] PDF Layer 4 failed:", (e as Error).message);
  }

  // Layer 5: UTF-16 / wide-char text extraction (some PDFs store text as UTF-16BE)
  try {
    const raw = buffer.toString("binary");
    const utf16Words: string[] = [];
    for (let i = 0; i < raw.length - 1; i += 2) {
      const high = raw.charCodeAt(i);
      const low = raw.charCodeAt(i + 1);
      const code = (high << 8) | low;
      if (code >= 0x0020 && code <= 0x007E) {
        utf16Words.push(String.fromCharCode(code));
      } else {
        utf16Words.push(" ");
      }
    }
    const text = utf16Words.join("").replace(/\s+/g, " ").trim();
    const meaningful = text.split(/\s+/).filter((w) => w.length > 3 && /[a-zA-Z]{3,}/.test(w));
    if (meaningful.length > 10) {
      const result = meaningful.join(" ");
      console.log(`[ParseDocument] PDF Layer 5 UTF-16: ${result.length} chars`);
      return result;
    }
  } catch (e) {
    console.warn("[ParseDocument] PDF Layer 5 failed:", (e as Error).message);
  }

  return "";
}

// ─── PPTX Text Extraction ─────────────────────────────────────────────────────
async function extractPptxText(buffer: Buffer): Promise<string> {
  // Method 1: JSZip XML slide extraction
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
      // Extract all <a:t> text nodes
      const matches = xml.match(/<a:t[^>]*>([^<]*)<\/a:t>/g) || [];
      const slideText = matches
        .map((m: string) => m.replace(/<[^>]+>/g, "").trim())
        .filter((t: string) => t.length > 0)
        .join(" ");
      if (slideText) {
        const num = (file.match(/\d+/) || ["?"])[0];
        fullText += `[Slide ${num}]: ${slideText}\n`;
      }
    }

    if (fullText.trim().length > 10) {
      console.log(`[ParseDocument] PPTX extracted ${fullText.length} chars from ${slideFiles.length} slides`);
      return fullText.trim();
    }
  } catch (e) {
    console.warn("[ParseDocument] PPTX JSZip failed:", (e as Error).message);
  }

  // Method 2: Raw ASCII fallback for .ppt binary format
  try {
    const raw = buffer.toString("latin1");
    const words = raw
      .replace(/[^\x20-\x7E\n\r\t]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && /[a-zA-Z]{3,}/.test(w));
    if (words.length > 15) {
      return words.join(" ");
    }
  } catch (e) {
    console.warn("[ParseDocument] PPTX ASCII fallback failed:", (e as Error).message);
  }

  return "";
}

// ─── DOCX Text Extraction ─────────────────────────────────────────────────────
async function extractDocxText(buffer: Buffer): Promise<string> {
  // Method 1: mammoth
  try {
    const mammoth = require("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    if (result?.value?.trim().length > 10) {
      console.log(`[ParseDocument] DOCX mammoth: ${result.value.length} chars`);
      return result.value.trim();
    }
  } catch (e) {
    console.warn("[ParseDocument] DOCX mammoth failed:", (e as Error).message);
  }

  // Method 2: JSZip XML
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
        console.log(`[ParseDocument] DOCX JSZip XML: ${text.length} chars`);
        return text;
      }
    }
  } catch (e) {
    console.warn("[ParseDocument] DOCX JSZip failed:", (e as Error).message);
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
        return NextResponse.json({ error: "No file was uploaded. Please select a PDF, PPTX, DOCX, or text file." }, { status: 400 });
      }

      fileName = file.name.toLowerCase();
      const arrayBuf = await file.arrayBuffer();
      // Buffer.from() on an ArrayBuffer safely copies bytes into a new Buffer
      const buffer = Buffer.from(new Uint8Array(arrayBuf));

      console.log(`[ParseDocument] Processing "${file.name}" (${buffer.length} bytes)`);

      if (fileName.endsWith(".pptx") || fileName.endsWith(".ppt")) {
        documentText = await extractPptxText(buffer);
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
        // Unknown format — try UTF-8 then latin1
        documentText = buffer.toString("utf-8").replace(/\uFFFD/g, " ").trim();
        if (documentText.length < 20) {
          documentText = buffer.toString("latin1").replace(/[^\x20-\x7E\n\r\t]/g, " ").trim();
        }
      }

      // If any extraction returned something but it's very short, still try ASCII
      if (!documentText || documentText.trim().length < 20) {
        const ascii = buffer.toString("latin1")
          .replace(/[^\x20-\x7E\n\r\t]/g, " ")
          .split(/\s+/)
          .filter((w) => w.length > 3 && /[a-zA-Z]{3,}/.test(w))
          .join(" ");
        if (ascii.length > documentText.length) documentText = ascii;
      }

    } else {
      const body = await req.json().catch(() => ({}));
      documentText = body.text || "";
      fileName = body.fileName || "pasted-text.txt";
    }

    if (!documentText || documentText.trim().length < 15) {
      return NextResponse.json(
        {
          error: `Could not extract readable text from "${fileName || "your document"}". ` +
            `This may be a scanned image PDF (no text layer) or a password-protected file. ` +
            `Please paste your startup idea text directly into the form instead.`,
        },
        { status: 400 }
      );
    }

    const wordCount = documentText.split(/\s+/).filter(Boolean).length;
    console.log(`[ParseDocument] Extracted ${wordCount} words from "${fileName}". Parsing business parameters...`);

    // Step 1: Pre-compute robust deterministic heuristic extraction (always succeeds)
    const heuristicFallback = extractHeuristicParameters(documentText);

    // Step 2: Attempt AI refinement via OpenRouter (optional enhancement, never blocks)
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
      const isRefusal = /sorry|i cannot|i am unable|as an ai|i'm unable|cannot extract/i.test(responseText.slice(0, 120));

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
          console.log("[ParseDocument] ✓ AI extraction merged with heuristics.");
        }
      } else {
        console.warn("[ParseDocument] AI returned refusal, using deterministic extraction.");
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
