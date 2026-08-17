import { safeJsonParse } from "@/lib/utils/json-repair";

const OPENROUTER_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "google/gemma-2-9b-it:free",
  "qwen/qwen-2.5-7b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
  "microsoft/phi-3-mini-128k-instruct:free",
];

export class AIProvider {
  private openrouterKey: string | null = null;

  constructor() {
    this.openrouterKey =
      process.env.OPENROUTER_API_KEY ||
      (process.env.OPENAI_API_KEY?.startsWith("sk-or-v1-") ? process.env.OPENAI_API_KEY : null) ||
      process.env.OPENAI_API_KEY ||
      null;
  }

  /**
   * Generates a deep AI completion using OpenRouter API key exclusively.
   * Cycles through top high-power free OpenRouter models until completion succeeds.
   */
  async generateCompletion(
    systemPrompt: string,
    userPrompt: string,
    jsonMode = false
  ): Promise<string> {
    if (!this.openrouterKey) {
      console.warn("[AIProvider] OPENROUTER_API_KEY not found in environment.");
      throw new Error("OPENROUTER_API_KEY is required.");
    }

    console.log("[AIProvider] Executing AI generation exclusively via OpenRouter API...");

    for (const model of OPENROUTER_MODELS) {
      try {
        console.log(`[AIProvider] Calling OpenRouter model: ${model}...`);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12000); // 12s per model

        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.openrouterKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://venturelens.app",
            "X-Title": "VentureLens Intelligence",
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            response_format: jsonMode ? { type: "json_object" } : undefined,
            temperature: 0.2,
            max_tokens: 2000,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (res.status === 429 || res.status === 503) {
          console.warn(`[AIProvider] OpenRouter model ${model} busy/rate-limited (${res.status}), trying next...`);
          continue;
        }

        if (res.ok) {
          const data = await res.json();
          const text = data.choices?.[0]?.message?.content || "";
          if (text && text.trim().length > 20) {
            console.log(`[AIProvider] ✓ Real AI generation succeeded using OpenRouter (${model}) [${text.length} chars]`);
            return text;
          }
        } else {
          const errText = await res.text().catch(() => "");
          console.warn(`[AIProvider] OpenRouter ${model} error (${res.status}):`, errText);
        }
      } catch (err: any) {
        console.warn(`[AIProvider] OpenRouter ${model} call failed:`, err?.message || err);
      }
    }

    throw new Error("All OpenRouter models failed to respond.");
  }
}
