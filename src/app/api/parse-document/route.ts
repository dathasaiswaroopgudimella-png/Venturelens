import { NextResponse } from "next/server";
import { AIProvider } from "@/lib/engines/ai-provider";
import { QuestionnaireAnswers } from "@/types";
import { safeJsonParse } from "@/lib/utils/json-repair";
import { cleanFieldText } from "@/lib/utils/clean-inputs";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

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

// ─── PDF Text Extraction ──────────────────────────────────────────────────────
async function extractPdfText(buffer: Buffer): Promise<string> {
  // Method 1: pdf-parse v2 PDFParse class (.getText() returns { pages, text, total })
  try {
    const pdfLib = require("pdf-parse");
    if (pdfLib?.PDFParse) {
      const parser = new pdfLib.PDFParse({ data: buffer });
      const result = await parser.getText();
      try { await parser.destroy(); } catch (_) {}

      // result is { pages: [...], text: string, total: number }
      if (result?.text && typeof result.text === "string" && result.text.trim().length > 10) {
        console.log(`[ParseDocument] PDF extracted via PDFParse class: ${result.text.length} chars`);
        return result.text.trim();
      }
      // Some versions return string directly
      if (typeof result === "string" && result.trim().length > 10) {
        return result.trim();
      }
      // Try pages array
      if (Array.isArray(result?.pages)) {
        const pageText = result.pages.map((p: any) => p.text || "").join("\n\n");
        if (pageText.trim().length > 10) {
          console.log(`[ParseDocument] PDF extracted via pages array: ${pageText.length} chars`);
          return pageText.trim();
        }
      }
    }
  } catch (e) {
    console.warn("[ParseDocument] pdf-parse PDFParse class failed:", (e as Error).message);
  }

  // Method 2: Try calling pdf-parse as a default function (some versions expose it)
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

  // Method 3: Extract raw Tj/TJ text operators from PDF binary stream
  try {
    const rawLatin = buffer.toString("latin1");
    const chunks: string[] = [];

    // Match (text) Tj  — immediate text strings
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

  // Method 4: Clean printable ASCII extraction (broad fallback)
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

    if (slideFiles.length === 0) {
      console.warn("[ParseDocument] PPTX: no slide XML files found in zip");
    }

    let fullText = "";
    for (const file of slideFiles) {
      const xml = await zip.files[file].async("text");
      // Extract all <a:t> text tags
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
  // Method 1: mammoth
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

  // Method 2: DOCX is a ZIP — extract word/document.xml directly
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

// ─── Smart sampling for large documents ─────────────────────────────────────
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
          // Broad plaintext fallback for PPT
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
        // Try UTF-8, fallback to latin1
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
            `If it's a scanned PDF (image-only), try copy-pasting the text directly into the startup idea field instead.`,
        },
        { status: 400 }
      );
    }

    const sampledText = sampleDocument(documentText);
    const wordCount = documentText.split(/\s+/).filter(Boolean).length;
    console.log(`[ParseDocument] Successfully extracted ${wordCount} words from "${fileName}". Sending to OpenRouter AI...`);

    // ─── AI Parameter Extraction ──────────────────────────────────────────────
    const aiProvider = new AIProvider();

    const systemPrompt = `You are an elite Venture Capital Diligence Analyst reading a startup pitch deck.
Extract every specific business parameter from the provided pitch deck text.
STRICT RULES:
- Only use facts from the pitch deck text. Never invent data.
- DO NOT output any field labels like "Startup Name:" or "Problem:" in your values.
- All values must be clean prose with no prefix labels.
- For revenueModel, output exactly one of: SaaS, Subscription, Marketplace, Transaction, Licensing, Other

Output ONLY a valid JSON object:
{
  "idea": "2-3 sentence description of what the startup does, who it serves, and the core value proposition.",
  "targetCustomer": "Specific buyer persona and ICP.",
  "problemSolved": "The acute problem or pain point being solved.",
  "existingAlternatives": "Current manual methods or competitor products being replaced.",
  "geography": "Target launch market or geography.",
  "revenueModel": "SaaS",
  "pricingStrategy": "Pricing model, tiers, or contract values mentioned.",
  "competitors": "Comma-separated list of competitor companies or categories mentioned.",
  "differentiation": "Key moat, proprietary tech, data advantage, or speed edge.",
  "currentValidation": "Traction, ARR, paying customers, pilots, LOIs, or waitlist size.",
  "teamBackground": "Founding team experience, domain credentials, past companies.",
  "distributionChannel": "Sales and marketing strategy or distribution channels.",
  "tamEstimate": "TAM, SAM, or market sizing estimate mentioned."
}`;

    const userPrompt = `PITCH DECK TEXT:\n\n${sampledText}`;

    let answers: Partial<QuestionnaireAnswers> = {};

    try {
      const responseText = await aiProvider.generateCompletion(systemPrompt, userPrompt, true);
      const rawParsed = safeJsonParse<any>(responseText, null);

      if (rawParsed && typeof rawParsed === "object") {
        answers = {
          idea: cleanFieldText(rawParsed.idea) || documentText.slice(0, 300),
          targetCustomer: cleanFieldText(rawParsed.targetCustomer) || "",
          problemSolved: cleanFieldText(rawParsed.problemSolved) || "",
          existingAlternatives: cleanFieldText(rawParsed.existingAlternatives) || "",
          geography: cleanFieldText(rawParsed.geography) || "",
          revenueModel: normalizeRevenueModel(rawParsed.revenueModel),
          pricingStrategy: cleanFieldText(rawParsed.pricingStrategy) || "",
          competitors: cleanFieldText(rawParsed.competitors) || "",
          differentiation: cleanFieldText(rawParsed.differentiation) || "",
          currentValidation: cleanFieldText(rawParsed.currentValidation) || "",
          teamBackground: cleanFieldText(rawParsed.teamBackground) || "",
          distributionChannel: cleanFieldText(rawParsed.distributionChannel) || "",
          tamEstimate: cleanFieldText(rawParsed.tamEstimate) || "",
        };
        console.log("[ParseDocument] ✓ AI successfully extracted all parameters from pitch deck.");
      } else {
        throw new Error("AI returned unparseable response");
      }
    } catch (llmErr) {
      // Heuristic fallback: use the raw extracted text as the startup idea, prompt user to fill details
      console.warn("[ParseDocument] AI extraction failed, using raw text fallback:", (llmErr as Error).message);
      answers = {
        idea: documentText.slice(0, 400),
        targetCustomer: "",
        problemSolved: "",
        existingAlternatives: "",
        geography: "",
        revenueModel: "SaaS",
        pricingStrategy: "",
        competitors: "",
        differentiation: "",
        currentValidation: "",
        teamBackground: "",
        distributionChannel: "",
        tamEstimate: "",
      };
    }

    return NextResponse.json({
      success: true,
      extractedWords: wordCount,
      fileName: fileName,
      answers,
      rawText: documentText.slice(0, 2000),
    });

  } catch (error: any) {
    console.error("[ParseDocument] Unhandled error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to parse the uploaded document. Please try again." },
      { status: 500 }
    );
  }
}
