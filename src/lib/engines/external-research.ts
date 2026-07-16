import { ExtractedFacts, QuestionnaireAnswers } from "@/types";

export interface ResearchResult {
  competitorsFound: string[];
  evidenceText: string;
  urls: string[];
}

export class ExternalResearch {
  async performResearch(
    facts: ExtractedFacts,
    answers: QuestionnaireAnswers
  ): Promise<ResearchResult> {
    const apiKey = process.env.TAVILY_API_KEY;

    if (!apiKey) {
      console.warn("[ExternalResearch] Tavily API key is missing. Skipping external search.");
      return { competitorsFound: [], evidenceText: "Tavily search skipped due to missing API key.", urls: [] };
    }

    // Build search queries: e.g. "competitors in B2B SaaS clinic scheduling USA"
    const query = `competitors for ${facts.businessModel.primaryType} startup in ${facts.market.industryTags.join(" and ")} targeting ${facts.customer.icp} in ${facts.market.geography}`;

    try {
      console.log(`[ExternalResearch] Querying Tavily with: "${query}"`);
      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: apiKey,
          query: query,
          search_depth: "basic",
          max_results: 5,
        }),
      });

      if (!response.ok) {
        throw new Error(`Tavily API responded with status ${response.status}`);
      }

      const data = await response.json();
      const results = data.results || [];
      const urls: string[] = [];
      const competitorsFound: string[] = [];
      let evidenceText = "";

      results.forEach((res: any) => {
        urls.push(res.url);
        evidenceText += `Source: ${res.title} (${res.url})\nSnippet: ${res.content}\n\n`;

        // Extract potential competitor names from title/content using simple regex or keywords
        // For simplicity, we can do some simple word extractions, or we can use the LLM later
        // Let's extract some capitalized words or titles as candidates
        const matches = res.title.split("|")[0].split("-")[0].trim();
        if (matches && matches.length < 30 && !matches.toLowerCase().includes("competitor") && !matches.toLowerCase().includes("startup")) {
          competitorsFound.push(matches);
        }
      });

      // Filter and clean competitors
      const cleanCompetitors = Array.from(new Set(competitorsFound)).filter((c) => c.length > 2);

      console.log(`[ExternalResearch] Tavily search completed. Found ${cleanCompetitors.length} competitor candidates.`);
      return {
        competitorsFound: cleanCompetitors,
        evidenceText: evidenceText || "No search results returned.",
        urls: urls,
      };
    } catch (error) {
      console.error("[ExternalResearch] Failed to fetch search results:", error);
      return {
        competitorsFound: [],
        evidenceText: "Failed to load external search results due to network error.",
        urls: [],
      };
    }
  }
}
