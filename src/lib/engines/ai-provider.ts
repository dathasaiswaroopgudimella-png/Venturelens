import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Top ultra-fast low-latency models for concurrent racing
const RACING_MODELS = [
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
   * Generates a text completion using concurrent multi-model racing (Promise.any).
   * Fires Gemini and top OpenRouter models simultaneously. First working response (<3s) wins immediately.
   * Total latency hard-capped at 5.0 seconds.
   */
  async generateCompletion(
    systemPrompt: string,
    userPrompt: string,
    jsonMode = false
  ): Promise<string> {
    const candidates: Promise<string>[] = [];
    const abortControllers: AbortController[] = [];

    // 1. Candidate: Google Gemini Flash (if configured)
    if (this.gemini) {
      candidates.push(
        (async () => {
          const model = this.gemini!.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: jsonMode
              ? { responseMimeType: "application/json", maxOutputTokens: 950, temperature: 0.2 }
              : { maxOutputTokens: 950, temperature: 0.2 },
          });

          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Gemini timeout (>4.5s)")), 4500)
          );

          const result = await Promise.race([
            model.generateContent(`${systemPrompt}\n\nUser Input:\n${userPrompt}`),
            timeoutPromise,
          ]);

          const text = result.response.text();
          if (text && text.trim().length > 10) {
            console.log("[AIProvider] Gemini Flash race winner ✓");
            return text;
          }
          throw new Error("Gemini returned empty response");
        })()
      );
    }

    // 2. Candidates: OpenRouter Parallel Model Racing
    if (this.openrouterKey) {
      for (const model of RACING_MODELS) {
        const controller = new AbortController();
        abortControllers.push(controller);

        candidates.push(
          (async () => {
            const timeout = setTimeout(() => controller.abort(), 4500); // 4.5s hard timeout per candidate
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
                  temperature: 0.2,
                  max_tokens: 950,
                }),
                signal: controller.signal,
              });
              clearTimeout(timeout);

              if (res.ok) {
                const data = await res.json();
                const text = data.choices?.[0]?.message?.content || "";
                if (text && text.trim().length > 10) {
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

    // 3. Candidate: NVIDIA NIM (if configured)
    if (this.openai) {
      candidates.push(
        (async () => {
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("NVIDIA NIM timeout (>4.5s)")), 4500)
          );

          const apiCall = this.openai!.chat.completions.create({
            model: "nvidia/llama-3.1-nemotron-70b-instruct",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            response_format: jsonMode ? { type: "json_object" } : undefined,
            temperature: 0.2,
            max_tokens: 950,
          });

          const response = await Promise.race([apiCall, timeoutPromise]);
          const text = response.choices[0]?.message?.content || "";
          if (text && text.trim().length > 10) {
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
      // Return the FIRST fast response that succeeds across all concurrent candidates
      const winner = await Promise.any(candidates);
      // Abort other candidates
      abortControllers.forEach((c) => {
        try { c.abort(); } catch (e) {}
      });
      return winner;
    } catch (aggregateError) {
      abortControllers.forEach((c) => {
        try { c.abort(); } catch (e) {}
      });
      throw new Error("All AI race candidates failed or timed out. Falling back to deterministic synthesis.");
    }
  }
}
