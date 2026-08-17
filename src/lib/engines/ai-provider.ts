import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Fast free model pool for concurrent racing
const RACING_MODELS = [
  "meta-llama/llama-3.2-3b-instruct:free",
  "google/gemma-2-9b-it:free",
  "qwen/qwen-2.5-7b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
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
   * Generates a rich, deep structured completion using concurrent racing (Promise.any).
   * Runs Gemini Flash and top OpenRouter models in parallel with a 10s timeout.
   * The first successful full response wins immediately.
   */
  async generateCompletion(
    systemPrompt: string,
    userPrompt: string,
    jsonMode = false
  ): Promise<string> {
    const candidates: Promise<string>[] = [];
    const abortControllers: AbortController[] = [];

    // 1. Candidate: Google Gemini Flash (ultra-fast: 1.2s - 2.5s)
    if (this.gemini) {
      candidates.push(
        (async () => {
          const model = this.gemini!.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: jsonMode
              ? { responseMimeType: "application/json", maxOutputTokens: 1600, temperature: 0.3 }
              : { maxOutputTokens: 1600, temperature: 0.3 },
          });

          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Gemini timeout (>10s)")), 10000)
          );

          const result = await Promise.race([
            model.generateContent(`${systemPrompt}\n\nUser Input:\n${userPrompt}`),
            timeoutPromise,
          ]);

          const text = result.response.text();
          if (text && text.trim().length > 20) {
            console.log("[AIProvider] Google Gemini Flash race winner ✓");
            return text;
          }
          throw new Error("Gemini returned empty response");
        })()
      );
    }

    // 2. Candidates: OpenRouter Fast Model Racing
    if (this.openrouterKey) {
      for (const model of RACING_MODELS) {
        const controller = new AbortController();
        abortControllers.push(controller);

        candidates.push(
          (async () => {
            const timeout = setTimeout(() => controller.abort(), 10000); // 10s per-candidate timeout
            try {
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
                  temperature: 0.3,
                  max_tokens: 1600,
                }),
                signal: controller.signal,
              });
              clearTimeout(timeout);

              if (res.ok) {
                const data = await res.json();
                const text = data.choices?.[0]?.message?.content || "";
                if (text && text.trim().length > 20) {
                  console.log(`[AIProvider] OpenRouter (${model}) race winner ✓`);
                  return text;
                }
              }
              throw new Error(`OpenRouter (${model}) returned status ${res.status}`);
            } catch (err: any) {
              clearTimeout(timeout);
              throw err;
            }
          })()
        );
      }
    }

    // 3. Candidate: NVIDIA NIM
    if (this.openai) {
      candidates.push(
        (async () => {
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("NVIDIA NIM timeout (>10s)")), 10000)
          );

          const apiCall = this.openai!.chat.completions.create({
            model: "nvidia/llama-3.1-nemotron-70b-instruct",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            response_format: jsonMode ? { type: "json_object" } : undefined,
            temperature: 0.3,
            max_tokens: 1600,
          });

          const response = await Promise.race([apiCall, timeoutPromise]);
          const text = response.choices[0]?.message?.content || "";
          if (text && text.trim().length > 20) {
            console.log("[AIProvider] NVIDIA NIM race winner ✓");
            return text;
          }
          throw new Error("NVIDIA NIM returned empty response");
        })()
      );
    }

    if (candidates.length === 0) {
      throw new Error("No AI API keys configured (OPENROUTER_API_KEY, GEMINI_API_KEY, NVIDIA_API_KEY)");
    }

    try {
      const winner = await Promise.any(candidates);
      abortControllers.forEach((c) => {
        try { c.abort(); } catch (e) {}
      });
      return winner;
    } catch (aggregateError) {
      abortControllers.forEach((c) => {
        try { c.abort(); } catch (e) {}
      });
      throw new Error("All AI candidates failed or timed out.");
    }
  }
}
