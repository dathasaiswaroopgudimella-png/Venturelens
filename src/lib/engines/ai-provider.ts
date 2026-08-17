const LIVE_OPENROUTER_MODELS = [
  "google/gemma-4-26b-a4b-it:free",
  "openrouter/free",
  "nvidia/nemotron-3.5-lightning:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "openai/gpt-oss-20b:free",
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
   * Cycles through active verified free OpenRouter models until completion succeeds.
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

    for (const model of LIVE_OPENROUTER_MODELS) {
      try {
        console.log(`[AIProvider] Calling active OpenRouter model: ${model}...`);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 18000); // 18s per model

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
            temperature: 0.2,
            max_tokens: 2500,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (res.status === 429 || res.status === 503) {
          console.warn(`[AIProvider] OpenRouter model ${model} busy (${res.status}), trying next...`);
          continue;
        }

        if (res.ok) {
          const data = await res.json();
          let text = data.choices?.[0]?.message?.content || "";
          if (text && text.trim().length > 20) {
            // Clean markdown codeblocks if present
            text = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
            console.log(`[AIProvider] ✓ Real AI intelligence generation succeeded using OpenRouter (${model}) [${text.length} chars]`);
            return text;
          }
        } else {
          const errText = await res.text().catch(() => "");
          console.warn(`[AIProvider] OpenRouter ${model} error (${res.status}):`, errText.slice(0, 150));
        }
      } catch (err: any) {
        console.warn(`[AIProvider] OpenRouter ${model} call failed:`, err?.message || err);
      }
    }

    throw new Error("All active OpenRouter models failed to respond.");
  }
}
