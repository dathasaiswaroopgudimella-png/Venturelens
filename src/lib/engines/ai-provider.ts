import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const HIGH_POWER_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "google/gemma-2-9b-it:free",
  "qwen/qwen-2.5-7b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
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
   * Generates a high-power venture intelligence completion.
   * Priority: Google Gemini Flash/Pro -> OpenRouter 70B/Instruct -> NVIDIA NIM 70B.
   */
  async generateCompletion(
    systemPrompt: string,
    userPrompt: string,
    jsonMode = false
  ): Promise<string> {
    // 1. Google Gemini (Fastest & high intelligence)
    if (this.gemini) {
      const models = ["gemini-1.5-flash", "gemini-2.0-flash-lite", "gemini-1.5-pro"];
      for (const modelName of models) {
        try {
          console.log(`[AIProvider] Attempting Google Gemini (${modelName})...`);
          const model = this.gemini.getGenerativeModel({
            model: modelName,
            generationConfig: jsonMode
              ? { responseMimeType: "application/json", maxOutputTokens: 2048, temperature: 0.2 }
              : { maxOutputTokens: 2048, temperature: 0.2 },
          });

          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(`Gemini ${modelName} timeout`)), 9000)
          );

          const result = await Promise.race([
            model.generateContent(`${systemPrompt}\n\nUser Input:\n${userPrompt}`),
            timeoutPromise,
          ]);

          const text = result.response.text();
          if (text && text.trim().length > 20) {
            console.log(`[AIProvider] Google Gemini (${modelName}) ✓`);
            return text;
          }
        } catch (err: any) {
          console.warn(`[AIProvider] Gemini (${modelName}) skipped: ${err?.message || err}`);
        }
      }
    }

    // 2. OpenRouter High-Power Models (70B & Instruct)
    if (this.openrouterKey) {
      for (const model of HIGH_POWER_MODELS) {
        try {
          console.log(`[AIProvider] Attempting OpenRouter (${model})...`);
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 7500);

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
              max_tokens: 2048,
            }),
            signal: controller.signal,
          });
          clearTimeout(timeout);

          if (res.ok) {
            const data = await res.json();
            const text = data.choices?.[0]?.message?.content || "";
            if (text && text.trim().length > 20) {
              console.log(`[AIProvider] OpenRouter (${model}) ✓`);
              return text;
            }
          }
        } catch (err: any) {
          console.warn(`[AIProvider] OpenRouter (${model}) skipped: ${err?.name === "AbortError" ? "timeout" : err?.message}`);
        }
      }
    }

    // 3. NVIDIA NIM 70B Nemotron Fallback
    if (this.openai) {
      try {
        console.log("[AIProvider] Attempting NVIDIA NIM 70B Nemotron...");
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("NVIDIA NIM timeout")), 8000)
        );

        const apiCall = this.openai.chat.completions.create({
          model: "nvidia/llama-3.1-nemotron-70b-instruct",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: jsonMode ? { type: "json_object" } : undefined,
          temperature: 0.2,
          max_tokens: 2048,
        });

        const response = await Promise.race([apiCall, timeoutPromise]);
        const text = response.choices[0]?.message?.content || "";
        if (text && text.trim().length > 20) {
          console.log("[AIProvider] NVIDIA NIM 70B ✓");
          return text;
        }
      } catch (err: any) {
        console.warn(`[AIProvider] NVIDIA NIM skipped: ${err?.message || err}`);
      }
    }

    throw new Error("Activating high-fidelity dynamic domain-tailored synthesis.");
  }
}
