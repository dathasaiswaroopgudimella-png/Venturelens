import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Ultra-fast free model pool prioritized by response velocity & low queue latency
const OPENROUTER_MODELS_FAST = [
  "google/gemma-2-9b-it:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "qwen/qwen-2.5-7b-instruct:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "nvidia/nemotron-nano-9b-v2:free",
  "microsoft/phi-3-mini-128k-instruct:free",
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
   * Generates a text or structured JSON completion with ultra-low latency.
   * Priority: Gemini Flash (fastest, ~1s) -> Fast OpenRouter Pool (3.5s timeout) -> NVIDIA NIM.
   */
  async generateCompletion(
    systemPrompt: string,
    userPrompt: string,
    jsonMode = false
  ): Promise<string> {
    // 1. Google Gemini (Fastest Provider: ~800ms - 1.5s)
    if (this.gemini) {
      const geminiModels = ["gemini-1.5-flash", "gemini-2.0-flash-lite", "gemini-1.5-pro"];
      for (const modelName of geminiModels) {
        try {
          console.log(`[AIProvider] Attempting Google Gemini (${modelName})...`);
          const model = this.gemini.getGenerativeModel({
            model: modelName,
            generationConfig: jsonMode
              ? { responseMimeType: "application/json", maxOutputTokens: 1100, temperature: 0.2 }
              : { maxOutputTokens: 1100, temperature: 0.2 },
          });

          // 3.5 second aggressive timeout for lightning speed
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Gemini timeout (>3.5s)")), 3500)
          );

          const result = await Promise.race([
            model.generateContent(`${systemPrompt}\n\nUser Input:\n${userPrompt}`),
            timeoutPromise,
          ]);

          const text = result.response.text();
          if (text && text.trim().length > 10) {
            console.log(`[AIProvider] Google Gemini (${modelName}) ✓`);
            return text;
          }
        } catch (err: any) {
          console.warn(`[AIProvider] Gemini (${modelName}) skipped: ${err?.message || err}`);
        }
      }
    }

    // 2. OpenRouter Fast Model Pool (3.5s timeout per model, skips immediately if rate-limited or queued)
    if (this.openrouterKey) {
      for (const model of OPENROUTER_MODELS_FAST) {
        try {
          console.log(`[AIProvider] Attempting OpenRouter (${model})...`);
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 3500); // 3.5s per-model threshold

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
              temperature: 0.2,
              max_tokens: 1100,
            }),
            signal: controller.signal,
          });
          clearTimeout(timeout);

          if (res.status === 429 || res.status === 503) {
            console.warn(`[AIProvider] OpenRouter (${model}) rate-limited (${res.status}), switching model...`);
            continue;
          }

          if (res.ok) {
            const data = await res.json();
            const text = data.choices?.[0]?.message?.content || "";
            if (text && text.trim().length > 10) {
              console.log(`[AIProvider] OpenRouter (${model}) ✓`);
              return text;
            }
          }
        } catch (err: any) {
          console.warn(`[AIProvider] OpenRouter (${model}) skipped (${err?.name === "AbortError" ? "timeout >3.5s" : err?.message})`);
        }
      }
    }

    // 3. NVIDIA NIM (Fallback with 3.5s timeout)
    if (this.openai) {
      try {
        console.log("[AIProvider] Attempting NVIDIA NIM...");
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("NVIDIA NIM timeout (>3.5s)")), 3500)
        );

        const apiCall = this.openai.chat.completions.create({
          model: "nvidia/llama-3.1-nemotron-70b-instruct",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: jsonMode ? { type: "json_object" } : undefined,
          temperature: 0.2,
          max_tokens: 1100,
        });

        const response = await Promise.race([apiCall, timeoutPromise]);
        const text = response.choices[0]?.message?.content || "";
        if (text && text.trim().length > 10) {
          console.log("[AIProvider] NVIDIA NIM ✓");
          return text;
        }
      } catch (err: any) {
        console.warn(`[AIProvider] NVIDIA NIM skipped: ${err?.message || err}`);
      }
    }

    throw new Error("All AI providers exhausted. Falling back to deterministic engine synthesis.");
  }
}
