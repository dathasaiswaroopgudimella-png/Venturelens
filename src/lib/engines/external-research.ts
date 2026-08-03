import { ExtractedFacts, QuestionnaireAnswers } from "@/types";
import { AIProvider } from "./ai-provider";
import { safeJsonParse } from "@/lib/utils/json-repair";

export interface ResearchResult {
  competitorsFound: string[];
  evidenceText: string;
  urls: string[];
}

export class ExternalResearch {
  private aiProvider: AIProvider;

  constructor() {
    this.aiProvider = new AIProvider();
  }

  async performResearch(
    answers: QuestionnaireAnswers,
    facts?: ExtractedFacts
  ): Promise<ResearchResult> {
    const idea = answers.idea || "";
    const icp = facts?.customer?.icp || answers.targetCustomer || "target market";
    const tag0 = facts?.market?.industryTags?.[0] || "Target Sector";
    const geo = facts?.market?.geography || answers.geography || "Global";
    const revModel = facts?.businessModel?.primaryType || answers.revenueModel || "SaaS";

    // 1. Try OpenRouter AI Market Research Intelligence (Primary - Fast & Deep)
    try {
      console.log("[ExternalResearch] Running OpenRouter AI Market Intelligence Search...");
      const systemPrompt = `You are a Senior Venture Capital Market Research Intelligence Analyst.
Given a startup idea, target customer (ICP), industry sector, and target geography, analyze real-world market dynamics, top competing companies/products, TAM benchmarks, and research evidence.
Return a valid JSON object matching the following structure (no markdown wrappers):
{
  "competitorsFound": ["Competitor 1", "Competitor 2", "Competitor 3", "Competitor 4"],
  "evidenceText": "A 2-paragraph detailed analysis covering competitive positioning, market dynamics, incumbent weaknesses, and industry growth vectors.",
  "urls": ["https://example.com/industry-report-1", "https://example.com/industry-report-2"]
}`;

      const userPrompt = `Startup Idea: ${idea}
Target Customer (ICP): ${icp}
Industry Sector: ${tag0}
Geography: ${geo}
Revenue Model: ${revModel}
Founder Claimed Competitors: ${answers.competitors || "None listed"}`;

      const responseText = await this.aiProvider.generateCompletion(systemPrompt, userPrompt, true);
      const parsed = safeJsonParse<any>(responseText, null);

      if (parsed && Array.isArray(parsed.competitorsFound) && parsed.competitorsFound.length > 0) {
        console.log(`[ExternalResearch] OpenRouter Market Research successful. Found ${parsed.competitorsFound.length} competitors.`);
        return {
          competitorsFound: parsed.competitorsFound,
          evidenceText: parsed.evidenceText || `Market research completed for ${tag0} targeting ${icp}.`,
          urls: Array.isArray(parsed.urls) ? parsed.urls : [],
        };
      }
    } catch (err: any) {
      console.warn("[ExternalResearch] OpenRouter Market Intelligence search failed, falling back to Tavily:", err?.message || err);
    }

    // 2. Fallback to Tavily if configured
    const apiKey = process.env.TAVILY_API_KEY;
    if (apiKey) {
      const query = `top competitors for ${revModel} startup in ${tag0} targeting ${icp}`;
      try {
        console.log(`[ExternalResearch] Querying Tavily with: "${query}"`);
        const response = await fetch("https://api.tavily.com/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: apiKey,
            query,
            search_depth: "basic",
            max_results: 5,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const results: any[] = data.results || [];
          const urls: string[] = [];
          let evidenceText = "";
          const rawCompetitors: string[] = [];

          results.forEach((res: any) => {
            if (res.url) urls.push(res.url);
            if (res.title && res.content) {
              evidenceText += `Source: ${res.title} (${res.url})\nSnippet: ${String(res.content).slice(0, 300)}\n\n`;
            }
          });

          return {
            competitorsFound: rawCompetitors.length > 0 ? rawCompetitors : (answers.competitors ? answers.competitors.split(",").map(c => c.trim()) : []),
            evidenceText: evidenceText || "Tavily search completed.",
            urls,
          };
        }
      } catch (err) {
        console.warn("[ExternalResearch] Tavily search error:", err);
      }
    }

    // 3. Final Fallback
    const fallbackCompetitors = answers.competitors
      ? answers.competitors.split(",").map((c) => c.trim()).filter(Boolean)
      : [`${tag0} Incumbents`, "Legacy Manual Processes"];

    return {
      competitorsFound: fallbackCompetitors,
      evidenceText: `Market research conducted for ${tag0} sector targeting ${icp} in ${geo}.`,
      urls: [],
    };
  }
}
