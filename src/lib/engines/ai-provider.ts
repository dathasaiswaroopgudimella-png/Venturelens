import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
   * Generates a text or structured JSON completion with multi-provider and multi-model fallback.
   */
  async generateCompletion(
    systemPrompt: string,
    userPrompt: string,
    jsonMode = false
  ): Promise<string> {
    // 1. Try OpenRouter (Primary - Ultra-reliable & fast)
    if (this.openrouterKey) {
      const openRouterModels = [
        "google/gemma-4-26b-a4b-it:free",
        "nvidia/nemotron-nano-9b-v2:free",
        "openai/gpt-oss-20b:free",
        "inclusionai/ling-3.0-flash:free",
      ];

      for (const model of openRouterModels) {
        try {
          console.log(`[AIProvider] Attempting completion via OpenRouter (${model})...`);
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
            }),
          });

          if (res.ok) {
            const data = await res.json();
            const text = data.choices?.[0]?.message?.content || "";
            if (text && text.trim().length > 10) {
              console.log(`[AIProvider] OpenRouter (${model}) completion successful.`);
              return text;
            }
          } else {
            const errData = await res.json().catch(() => ({}));
            console.warn(
              `[AIProvider] OpenRouter (${model}) returned status ${res.status}:`,
              errData?.error?.message || res.statusText
            );
          }
        } catch (err: any) {
          console.warn(`[AIProvider] OpenRouter (${model}) request failed:`, err?.message || err);
        }
      }
    }

    // 2. Try NVIDIA NIM (Fallback)
    if (this.openai) {
      try {
        console.log("[AIProvider] Attempting completion with NVIDIA NIM...");
        const response = await this.openai.chat.completions.create({
          model: "nvidia/llama-3.1-nemotron-70b-instruct",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: jsonMode ? { type: "json_object" } : undefined,
          temperature: 0.2,
        });

        const text = response.choices[0]?.message?.content || "";
        if (text && text.trim().length > 10) {
          console.log("[AIProvider] NVIDIA NIM completion successful.");
          return text;
        }
      } catch (err: any) {
        console.warn(
          `[AIProvider] NVIDIA NIM failed: ${err?.message || err}. Falling back to Gemini...`
        );
      }
    }

    // 3. Try Gemini (Fallback)
    if (this.gemini) {
      const geminiModels = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];
      for (const modelName of geminiModels) {
        try {
          console.log(`[AIProvider] Attempting completion with Google Gemini (${modelName})...`);
          const model = this.gemini.getGenerativeModel({
            model: modelName,
            generationConfig: jsonMode ? { responseMimeType: "application/json" } : undefined,
          });

          const result = await model.generateContent(`${systemPrompt}\n\nUser Input:\n${userPrompt}`);
          const text = result.response.text();
          if (text && text.trim().length > 10) {
            console.log(`[AIProvider] Google Gemini (${modelName}) completion successful.`);
            return text;
          }
        } catch (err: any) {
          console.warn(`[AIProvider] Gemini model ${modelName} failed: ${err?.message || err}`);
        }
      }
    }

    throw new Error(
      "No AI provider available or all API calls failed. Please check your OPENROUTER_API_KEY, NVIDIA_API_KEY, or GEMINI_API_KEY."
    );
  }
}

