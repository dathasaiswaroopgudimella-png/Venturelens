import { KnowledgeSnippet, QuestionnaireAnswers, ExtractedFacts } from "@/types";
import { VENTURE_KNOWLEDGE_BASE } from "@/lib/data/venture-knowledge-base";

export class KnowledgeRetriever {
  /**
   * Retrieves the top 3 most relevant VC frameworks, case studies, and GTM playbooks
   * from the Venture Knowledge Base based on founder answers and extracted facts.
   */
  retrieve(answers: QuestionnaireAnswers, facts?: ExtractedFacts): KnowledgeSnippet[] {
    const rawText = `${answers.idea} ${answers.problemSolved} ${answers.targetCustomer} ${answers.revenueModel} ${answers.distributionChannel} ${answers.competitors} ${answers.differentiation} ${facts?.market?.industryTags?.join(" ") || ""}`.toLowerCase();

    const scored = VENTURE_KNOWLEDGE_BASE.map((snippet) => {
      let score = 0;

      // 1. Tag keyword matching
      snippet.tags.forEach((tag) => {
        const tagLower = tag.toLowerCase();
        if (rawText.includes(tagLower)) {
          score += 10;
        }
      });

      // 2. Content word overlap matching
      const contentWords = snippet.content.toLowerCase().split(/\W+/).filter((w) => w.length > 3);
      contentWords.forEach((word) => {
        if (rawText.includes(word)) {
          score += 1;
        }
      });

      // 3. Revenue model specific boosts
      const revModel = (answers.revenueModel || "").toLowerCase();
      if (snippet.category === "GTM_Strategy" && (revModel.includes("saas") || revModel.includes("subscrip"))) {
        score += 8;
      }
      if (snippet.tags.some((t) => t.toLowerCase().includes("marketplace")) && (revModel.includes("market") || revModel.includes("platform"))) {
        score += 12;
      }

      // 4. Campus / IIT specific boosts
      if (/iit|hostel|campus|student|university|college/i.test(rawText) && (snippet.category === "IIT_ECell_Resource" || snippet.id === "KB_CASE_01")) {
        score += 20;
      }

      return {
        ...snippet,
        relevanceScore: score,
      };
    });

    // Sort by relevance score descending and return top 3
    const topSnippets = scored
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
      .slice(0, 3);

    console.log(`[KnowledgeRetriever] Retrieved ${topSnippets.length} relevant knowledge frameworks.`);
    return topSnippets;
  }
}
