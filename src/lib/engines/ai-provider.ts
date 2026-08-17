import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Fast, stable free model pool on OpenRouter
const OPENROUTER_FAST_MODELS = [
  "meta-llama/llama-3.2-3b-instruct:free",
  "google/gemma-2-9b-it:free",
  "qwen/qwen-2.5-7b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
  "microsoft/phi-3-mini-128k-instruct:free",
  "nvidia/nemotron-nano-9b-v2:free",
];

export class AIProvider {
  private openrouterKey: string | null = null;
  private nvidiaKey: string | null = null;
  private geminiKey: string | null = null;
  private openai: OpenAI | null = null;
  private gemini: GoogleGenerativeAI | null = null;

  constructor() {
    this.openrouterKey =
      process.env.OPENROUTER_API_KEY ||
      (process.env.OPENAI_API_KEY?.startsWith("sk-or-v1-") ? process.env.OPENAI_API_KEY : null);

    this.nvidiaKey = process.env.NVIDIA_API_KEY || null;
    this.geminiKey = process.env.GEMINI_API_KEY || null;

    if (this.nvidiaKey) {
      this.openai = new OpenAI({
        baseURL: "https://integrate.api.nvidia.com/v1",
        apiKey: this.nvidiaKey,
      });
    }

    if (this.geminiKey && !this.geminiKey.startsWith("AQ.")) {
      try {
        this.gemini = new GoogleGenerativeAI(this.geminiKey);
      } catch (err) {
        console.warn("[AIProvider] Invalid Gemini API Key format");
      }
    }
  }

  /**
   * Generates a text or structured JSON completion with multi-tier fast fallback.
   * Priority: Google Gemini Flash (~1.5s) -> OpenRouter Fast Pool (5s threshold per model) -> NVIDIA NIM.
   * Never throws uncaught network crashes.
   */
  async generateCompletion(
    systemPrompt: string,
    userPrompt: string,
    jsonMode = false
  ): Promise<string> {
    // 1. Tier 1: Google Gemini Flash (Fastest, ~1.2s - 2.5s)
    if (this.gemini) {
      const geminiModels = ["gemini-1.5-flash", "gemini-2.0-flash-lite"];
      for (const modelName of geminiModels) {
        try {
          console.log(`[AIProvider] Attempting Google Gemini (${modelName})...`);
          const model = this.gemini.getGenerativeModel({
            model: modelName,
            generationConfig: jsonMode
              ? { responseMimeType: "application/json", maxOutputTokens: 1600, temperature: 0.25 }
              : { maxOutputTokens: 1600, temperature: 0.25 },
          });

          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Gemini timeout (>7s)")), 7000)
          );

          const result = await Promise.race([
            model.generateContent(`${systemPrompt}\n\nUser Input:\n${userPrompt}`),
            timeoutPromise,
          ]);

          const text = result.response.text();
          if (text && text.trim().length > 15) {
            console.log(`[AIProvider] Google Gemini (${modelName}) ✓`);
            return text;
          }
        } catch (err: any) {
          console.warn(`[AIProvider] Gemini (${modelName}) skipped: ${err?.message || err}`);
        }
      }
    }

    // 2. Tier 2: OpenRouter Sequential Fast Pool with 6s Timeout Per Model
    if (this.openrouterKey) {
      for (const model of OPENROUTER_FAST_MODELS) {
        try {
          console.log(`[AIProvider] Attempting OpenRouter (${model})...`);
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 6000); // 6s per-model threshold

          const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.openrouterKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://venturelens-two.vercel.app",
              "X-Title": "VentureLens AI",
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
              ],
              response_format: jsonMode ? { type: "json_object" } : undefined,
              temperature: 0.25,
              max_tokens: 1600,
            }),
            signal: controller.signal,
          });
          clearTimeout(timeout);

          if (res.status === 429 || res.status === 503) {
            console.warn(`[AIProvider] OpenRouter (${model}) rate-limited (${res.status}), trying next model...`);
            continue;
          }

          if (res.ok) {
            const data = await res.json();
            const text = data.choices?.[0]?.message?.content || "";
            if (text && text.trim().length > 15) {
              console.log(`[AIProvider] OpenRouter (${model}) ✓`);
              return text;
            }
          }
        } catch (err: any) {
          console.warn(`[AIProvider] OpenRouter (${model}) skipped: ${err?.name === "AbortError" ? "timeout >6s" : err?.message}`);
        }
      }
    }

    // 3. Tier 3: NVIDIA NIM Fallback
    if (this.openai) {
      try {
        console.log("[AIProvider] Attempting NVIDIA NIM...");
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("NVIDIA NIM timeout (>6s)")), 6000)
        );

        const apiCall = this.openai.chat.completions.create({
          model: "nvidia/llama-3.1-nemotron-70b-instruct",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: jsonMode ? { type: "json_object" } : undefined,
          temperature: 0.25,
          max_tokens: 1600,
        });

        const response = await Promise.race([apiCall, timeoutPromise]);
        const text = response.choices[0]?.message?.content || "";
        if (text && text.trim().length > 15) {
          console.log("[AIProvider] NVIDIA NIM ✓");
          return text;
        }
      } catch (err: any) {
        console.warn(`[AIProvider] NVIDIA NIM skipped: ${err?.message || err}`);
      }
    }

    throw new Error("All AI providers exhausted. Activating dynamic domain-tailored synthesis.");
  }
}
