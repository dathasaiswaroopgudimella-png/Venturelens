import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Fast free model pool — rotates on 429/rate-limit or >12s latency
const OPENROUTER_MODELS_FAST = [
  "nvidia/nemotron-nano-9b-v2:free",
  "google/gemma-4-26b-a4b-it:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "microsoft/phi-3-mini-128k-instruct:free",
  "openai/gpt-oss-20b:free",
  "qwen/qwen3-8b:free",
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
   * Generates a text or structured JSON completion.
   * Multi-provider with smart fast model rotation — 12s per-model threshold.
   * No blocking retries: first working fast model wins.
   */
  async generateCompletion(
    systemPrompt: string,
    userPrompt: string,
    jsonMode = false
  ): Promise<string> {
    // 1. OpenRouter — try each free model; skip on 429, error, or >12s delay
    if (this.openrouterKey) {
      for (const model of OPENROUTER_MODELS_FAST) {
        try {
          console.log(`[AIProvider] Attempting OpenRouter (${model})...`);
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 12_000); // 12s aggressive threshold for high speed

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
              max_tokens: 1800,
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
            if (text && text.trim().length > 10) {
              console.log(`[AIProvider] OpenRouter (${model}) ✓`);
              return text;
            }
            console.warn(`[AIProvider] OpenRouter (${model}) returned empty response, trying next...`);
          } else {
            const errData = await res.json().catch(() => ({}));
            console.warn(
              `[AIProvider] OpenRouter (${model}) error ${res.status}: ${errData?.error?.message || res.statusText}`
            );
          }
        } catch (err: any) {
          if (err?.name === "AbortError") {
            console.warn(`[AIProvider] OpenRouter (${model}) timed out (>12s), switching to next model...`);
          } else {
            console.warn(`[AIProvider] OpenRouter (${model}) failed: ${err?.message || err}`);
          }
        }
      }
    }

    // 2. NVIDIA NIM (Fallback)
    if (this.openai) {
      try {
        console.log("[AIProvider] Attempting NVIDIA NIM...");
        const response = await this.openai.chat.completions.create({
          model: "nvidia/llama-3.1-nemotron-70b-instruct",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: jsonMode ? { type: "json_object" } : undefined,
          temperature: 0.25,
          max_tokens: 1800,
        });

        const text = response.choices[0]?.message?.content || "";
        if (text && text.trim().length > 10) {
          console.log("[AIProvider] NVIDIA NIM ✓");
          return text;
        }
      } catch (err: any) {
        console.warn(`[AIProvider] NVIDIA NIM failed: ${err?.message || err}`);
      }
    }

    // 3. Google Gemini (Final Fallback)
    if (this.gemini) {
      const geminiModels = ["gemini-1.5-flash", "gemini-2.0-flash-lite", "gemini-1.5-pro"];
      for (const modelName of geminiModels) {
        try {
          console.log(`[AIProvider] Attempting Google Gemini (${modelName})...`);
          const model = this.gemini.getGenerativeModel({
            model: modelName,
            generationConfig: jsonMode ? { responseMimeType: "application/json" } : undefined,
          });

          const result = await model.generateContent(`${systemPrompt}\n\nUser Input:\n${userPrompt}`);
          const text = result.response.text();
          if (text && text.trim().length > 10) {
            console.log(`[AIProvider] Google Gemini (${modelName}) ✓`);
            return text;
          }
        } catch (err: any) {
          console.warn(`[AIProvider] Gemini (${modelName}) failed: ${err?.message || err}`);
        }
      }
    }

    throw new Error(
      "All AI providers exhausted. Check OPENROUTER_API_KEY, NVIDIA_API_KEY, or GEMINI_API_KEY."
    );
  }
}
