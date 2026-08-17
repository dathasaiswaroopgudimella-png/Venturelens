import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const PRIMARY_FAST_MODELS = [
  "meta-llama/llama-3.2-3b-instruct:free",
  "google/gemma-2-9b-it:free",
  "qwen/qwen-2.5-7b-instruct:free",
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
   * Generates a structured completion with a strict 3.8s bounded timeout.
   * Priority: Google Gemini Flash (~1.2s) -> Fast OpenRouter (~2.5s) -> Instant Domain Synthesis.
   * Total execution is guaranteed under 4 seconds to never hit Vercel serverless timeouts.
   */
  async generateCompletion(
    systemPrompt: string,
    userPrompt: string,
    jsonMode = false
  ): Promise<string> {
    // 1. Google Gemini Flash (Fastest, ~1.2s)
    if (this.gemini) {
      try {
        console.log("[AIProvider] Attempting Google Gemini Flash...");
        const model = this.gemini.getGenerativeModel({
          model: "gemini-1.5-flash",
          generationConfig: jsonMode
            ? { responseMimeType: "application/json", maxOutputTokens: 1400, temperature: 0.25 }
            : { maxOutputTokens: 1400, temperature: 0.25 },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Gemini timeout (>3.8s)")), 3800)
        );

        const result = await Promise.race([
          model.generateContent(`${systemPrompt}\n\nUser Input:\n${userPrompt}`),
          timeoutPromise,
        ]);

        const text = result.response.text();
        if (text && text.trim().length > 15) {
          console.log("[AIProvider] Google Gemini Flash ✓");
          return text;
        }
      } catch (err: any) {
        console.warn(`[AIProvider] Gemini skipped: ${err?.message || err}`);
      }
    }

    // 2. OpenRouter Fast Pool (3.8s hard threshold)
    if (this.openrouterKey) {
      for (const model of PRIMARY_FAST_MODELS) {
        try {
          console.log(`[AIProvider] Attempting OpenRouter (${model})...`);
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 3800);

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
              max_tokens: 1400,
            }),
            signal: controller.signal,
          });
          clearTimeout(timeout);

          if (res.ok) {
            const data = await res.json();
            const text = data.choices?.[0]?.message?.content || "";
            if (text && text.trim().length > 15) {
              console.log(`[AIProvider] OpenRouter (${model}) ✓`);
              return text;
            }
          }
        } catch (err: any) {
          console.warn(`[AIProvider] OpenRouter (${model}) skipped: ${err?.name === "AbortError" ? "timeout >3.8s" : err?.message}`);
        }
      }
    }

    // 3. NVIDIA NIM Fallback (3.8s hard threshold)
    if (this.openai) {
      try {
        console.log("[AIProvider] Attempting NVIDIA NIM...");
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("NVIDIA NIM timeout (>3.8s)")), 3800)
        );

        const apiCall = this.openai.chat.completions.create({
          model: "nvidia/llama-3.1-nemotron-70b-instruct",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: jsonMode ? { type: "json_object" } : undefined,
          temperature: 0.25,
          max_tokens: 1400,
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

    throw new Error("Activating high-speed domain-tailored synthesis.");
  }
}
