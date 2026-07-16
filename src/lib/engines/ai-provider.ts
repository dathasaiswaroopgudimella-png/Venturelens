import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export class AIProvider {
  private openai: OpenAI | null = null;
  private gemini: GoogleGenerativeAI | null = null;

  constructor() {
    const nvidiaKey = process.env.NVIDIA_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (nvidiaKey) {
      this.openai = new OpenAI({
        baseURL: "https://integrate.api.nvidia.com/v1",
        apiKey: nvidiaKey,
      });
    }

    if (geminiKey) {
      // Initialize Google Generative AI
      this.gemini = new GoogleGenerativeAI(geminiKey);
    }
  }

  /**
   * Generates a text or structured JSON completion from NVIDIA NIM (primary) or Gemini (fallback).
   */
  async generateCompletion(
    systemPrompt: string,
    userPrompt: string,
    jsonMode = false
  ): Promise<string> {
    // 1. Try NVIDIA NIM (Primary)
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
        if (text) {
          console.log("[AIProvider] NVIDIA NIM completion successful.");
          return text;
        }
      } catch (err: any) {
        console.warn(
          `[AIProvider] NVIDIA NIM failed: ${err?.message || err}. Falling back to Gemini...`
        );
      }
    }

    // 2. Try Gemini (Fallback)
    if (this.gemini) {
      try {
        console.log("[AIProvider] Attempting completion with Google Gemini...");
        const model = this.gemini.getGenerativeModel({
          model: "gemini-2.5-flash",
          generationConfig: jsonMode
            ? { responseMimeType: "application/json" }
            : undefined,
        });

        const result = await model.generateContent(`${systemPrompt}\n\nUser Input:\n${userPrompt}`);
        const text = result.response.text();
        if (text) {
          console.log("[AIProvider] Google Gemini completion successful.");
          return text;
        }
      } catch (err: any) {
        console.error(
          `[AIProvider] Gemini fallback failed: ${err?.message || err}`
        );
        throw new Error("Both NVIDIA NIM and Gemini API calls failed.");
      }
    }

    throw new Error(
      "No AI provider available. Check your NVIDIA_API_KEY and GEMINI_API_KEY environment variables."
    );
  }
}
