import { ExtractedFacts, QuestionnaireAnswers } from "@/types";

export interface ResearchResult {
  competitorsFound: string[];
  evidenceText: string;
  urls: string[];
}

// Generic article/marketing terms that should never be treated as competitor names
const EXCLUDE_WORDS = new Set([
  "top", "best", "free", "why", "how", "what", "the", "and", "for",
  "with", "from", "new", "all", "your", "this", "that", "list", "guide",
  "review", "platform", "software", "tool", "tools", "app", "apps",
  "startup", "startups", "company", "companies", "solution", "solutions",
  "market", "industry", "technology", "technologies", "service", "services",
  "product", "products", "alternative", "alternatives", "comparison",
  "techcrunch", "forbes", "inc", "entrepreneur", "medium", "substack",
  "business", "news", "analysis", "report", "ranking", "ranked",
]);

/**
 * Extracts plausible company/product names from a result title.
 * Strategy: pick Title Case tokens that are short proper nouns and not generic terms.
 */
function extractCompetitorNames(title: string): string[] {
  // Strip content after |, :, — to get the core title
  const corePart = title.split(/[|:\u2014]/)[0].trim();

  // Match Title Case words or known brand patterns (camelCase, all caps short names)
  const tokens = corePart.match(/[A-Z][a-zA-Z0-9]{2,19}(\s[A-Z][a-zA-Z0-9]{1,19})?/g) || [];

  return tokens.filter((token) => {
    const lower = token.toLowerCase().replace(/\s/g, "");
    // Exclude generic words
    for (const word of token.toLowerCase().split(" ")) {
      if (EXCLUDE_WORDS.has(word)) return false;
    }
    // Must be 3-40 chars and not a pure number
    if (token.length < 3 || token.length > 40) return false;
    if (/^\d+$/.test(token)) return false;
    return true;
  });
}

export class ExternalResearch {
  async performResearch(
    facts: ExtractedFacts,
    answers: QuestionnaireAnswers
  ): Promise<ResearchResult> {
    const apiKey = process.env.TAVILY_API_KEY;

    if (!apiKey) {
      console.warn("[ExternalResearch] Tavily API key is missing. Skipping external search.");
      // Fall back to user-provided competitor list from the questionnaire
      const fallbackCompetitors = answers.competitors
        ? answers.competitors.split(",").map(c => c.trim()).filter(Boolean)
        : [];
      return {
        competitorsFound: fallbackCompetitors,
        evidenceText: `Tavily search skipped. User-provided competitors: ${fallbackCompetitors.join(", ") || "none listed"}.`,
        urls: [],
      };
    }

    // Focused query: primary type + industry + ICP + geography
    const query = `top competitors for ${facts.businessModel.primaryType} startup in ${facts.market.industryTags.join(" ")} targeting ${facts.customer.icp} in ${facts.market.geography}`;

    try {
      console.log(`[ExternalResearch] Querying Tavily with: "${query}"`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: apiKey,
          query,
          search_depth: "basic",
          max_results: 5,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Tavily API responded with status ${response.status}`);
      }

      const data = await response.json();
      const results: any[] = data.results || [];
      const urls: string[] = [];
      const rawCompetitors: string[] = [];
      let evidenceText = "";

      results.forEach((res: any) => {
        if (res.url) urls.push(res.url);
        if (res.title && res.content) {
          evidenceText += `Source: ${res.title} (${res.url})\nSnippet: ${String(res.content).slice(0, 400)}\n\n`;
        }
        // Extract proper-noun competitor names from the result title
        const names = extractCompetitorNames(String(res.title || ""));
        rawCompetitors.push(...names);
      });

      // Deduplicate, prioritise longer/more specific names, cap at 8
      const seen = new Set<string>();
      const cleanCompetitors: string[] = [];
      for (const name of rawCompetitors) {
        const key = name.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          cleanCompetitors.push(name);
          if (cleanCompetitors.length >= 8) break;
        }
      }

      // If Tavily returned nothing usable, fall back to user-provided list
      if (cleanCompetitors.length === 0 && answers.competitors) {
        const userList = answers.competitors.split(",").map(c => c.trim()).filter(Boolean);
        cleanCompetitors.push(...userList);
      }

      console.log(`[ExternalResearch] Tavily search completed. Found ${cleanCompetitors.length} competitor candidates.`);
      return {
        competitorsFound: cleanCompetitors,
        evidenceText: evidenceText || "No search results returned.",
        urls,
      };
    } catch (error: any) {
      const isTimeout = error?.name === "AbortError";
      console.error(`[ExternalResearch] ${isTimeout ? "Tavily search timed out" : "Failed to fetch search results"}:`, error);
      // Graceful degradation: return user-supplied competitors
      const fallbackCompetitors = answers.competitors
        ? answers.competitors.split(",").map(c => c.trim()).filter(Boolean)
        : [];
      return {
        competitorsFound: fallbackCompetitors,
        evidenceText: isTimeout
          ? "External search timed out. Using questionnaire-supplied competitor data."
          : "Failed to load external search results. Using questionnaire-supplied competitor data.",
        urls: [],
      };
    }
  }
}

