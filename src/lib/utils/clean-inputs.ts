import { QuestionnaireAnswers } from "@/types";

export interface CleanedStartupProfile {
  startupName: string;
  oneLiner: string;
  problem: string;
  icp: string;
  alternatives: string;
  geography: string;
  revenueModel: string;
  pricing: string;
  competitors: string[];
  moat: string;
  validation: string;
  team: string;
  distribution: string;
  tam: string;
  isNonCommercial: boolean;
}

/**
 * Checks whether the submission represents an informal/nonsense/personal activity
 * rather than a legitimate commercial venture thesis.
 */
export function isNonCommercialSubmission(
  ideaText?: string,
  answers?: Partial<QuestionnaireAnswers>
): boolean {
  const text = (ideaText || "").toLowerCase().trim();
  if (!text) return true;

  const allText = [
    ideaText,
    answers?.problemSolved,
    answers?.targetCustomer,
    answers?.pricingStrategy,
    answers?.differentiation,
    answers?.revenueModel,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  // Personal activities, jokes, gibberish
  if (
    /\b(sleep|sleeping|say hello|say hi|doing nothing|watch movie|watching tv|eating food|eat food|play game|playing games|joke|haha|fun only|just for fun|hello world|wake up)\b/i.test(
      text
    )
  ) {
    const hasCommercialContext =
      /\b(hardware|patient|hospital|clinical|diagnostic|saas|software|platform|b2b|enterprise|monetiz|revenue|\$\d+|₹\d+|arr|mrr|pilot|contract|infrastructure|cooling|thermal|fintech|biotech|analytics)\b/i.test(
        allText
      );
    if (!hasCommercialContext) return true;
  }

  // Pure single-phrase or random string without business keywords
  if (text.length < 35) {
    const hasBusinessKeyword =
      /\b(ai|saas|app|platform|tool|service|product|system|software|b2b|b2c|workflow|analytics|data|api|cloud|health|fintech|infra|marketplace|developer|sales|energy|cooling|hardware|deeptech|logistics|edtech)\b/i.test(
        text
      );
    if (!hasBusinessKeyword) return true;
  }

  return false;
}

/**
 * Strips raw form/document prefix labels like "STARTUP NAME:", "PROBLEM SOLVED:", etc.
 */
export function cleanFieldText(text?: string): string {
  if (!text) return "";
  return text
    .replace(/^(startup\s*name\s*:\s*|name\s*:\s*)/i, "")
    .replace(/^(one-?line\s*pitch\s*:\s*|one-?liner\s*:\s*|pitch\s*:\s*)/i, "")
    .replace(/^(problem\s*solved\s*:\s*|problem\s*:\s*|pain\s*point\s*:\s*)/i, "")
    .replace(/^(target\s*customer\s*:\s*|customer\s*:\s*|icp\s*:\s*)/i, "")
    .replace(/^(existing\s*alternatives\s*:\s*|alternatives\s*:\s*|workarounds\s*:\s*)/i, "")
    .replace(/^(geography\s*:\s*|target\s*market\s*:\s*|location\s*:\s*)/i, "")
    .replace(/^(pricing\s*strategy\s*:\s*|pricing\s*:\s*|price\s*:\s*)/i, "")
    .replace(/^(competitors\s*:\s*|competition\s*:\s*)/i, "")
    .replace(/^(differentiation\s*:\s*|moat\s*:\s*|defensive\s*moat\s*:\s*)/i, "")
    .replace(/^(current\s*validation\s*:\s*|validation\s*:\s*|traction\s*:\s*)/i, "")
    .replace(/^(team\s*background\s*:\s*|team\s*:\s*|founders\s*:\s*)/i, "")
    .replace(/^(distribution\s*channel\s*:\s*|distribution\s*:\s*|gtm\s*:\s*)/i, "")
    .replace(/^(tam\s*estimate\s*:\s*|tam\s*:\s*|market\s*size\s*:\s*)/i, "")
    .replace(/STARTUP\s*NAME\s*:\s*([^\n]+)/gi, "$1")
    .replace(/ONE-?LINE\s*PITCH\s*:\s*([^\n]+)/gi, "$1")
    .replace(/PROBLEM\s*:\s*([^\n]+)/gi, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Formats a clean, natural buyer persona title avoiding "Target Customers users"
 */
export function formatBuyerPersona(rawIcp?: string): string {
  if (!rawIcp) return "prospective enterprise buyers";
  const cleaned = cleanFieldText(rawIcp);
  if (/^(target customers?|target users?|customers?|users?|anyone|everyone|people)$/i.test(cleaned)) {
    return "prospective enterprise buyers";
  }
  // Trim long clauses
  const shortIcp = cleaned.split(/,|;|\(|\bwho\b|\bthat\b|\bspecifically\b/i)[0].trim();
  return shortIcp.length > 3 ? shortIcp : "target decision-makers";
}

/**
 * Formats a natural geography string avoiding "users in Global"
 */
export function formatGeography(rawGeo?: string): string {
  if (!rawGeo) return "initial target launch markets";
  const cleaned = cleanFieldText(rawGeo);
  if (/^(global|worldwide|everywhere|unspecified)$/i.test(cleaned)) {
    return "initial regional beachhead markets";
  }
  return cleaned;
}

/**
 * Extracts a crisp, clean startup name from answers.idea
 */
export function extractStartupName(ideaText: string): string {
  if (!ideaText) return "Venture";
  const nameMatch = ideaText.match(/startup\s*name\s*:\s*([a-zA-Z0-9\s_-]+?)(?:\n|one-line|pitch|problem|\.|\,|$)/i);
  if (nameMatch && nameMatch[1]?.trim()) {
    return nameMatch[1].trim();
  }
  const firstWords = cleanFieldText(ideaText).split(/\s+/).slice(0, 3).join(" ");
  return firstWords.length > 25 ? firstWords.slice(0, 25) + "..." : firstWords || "Venture";
}

export function cleanStartupAnswers(answers: QuestionnaireAnswers): CleanedStartupProfile {
  const rawIdea = answers.idea || "";
  const name = extractStartupName(rawIdea);
  const oneLiner = cleanFieldText(rawIdea);
  const problem = cleanFieldText(answers.problemSolved) || "operational inefficiency";
  const icp = formatBuyerPersona(answers.targetCustomer);
  const alternatives = cleanFieldText(answers.existingAlternatives) || "manual legacy alternatives and spreadsheets";
  const geography = formatGeography(answers.geography);
  const revenueModel = answers.revenueModel || "Subscription";
  const pricing = cleanFieldText(answers.pricingStrategy) || "Tiered pricing";
  const competitors = answers.competitors
    ? answers.competitors.split(",").map((c) => cleanFieldText(c)).filter(Boolean)
    : [];
  const moat = cleanFieldText(answers.differentiation) || "proprietary speed & workflow edge";
  const validation = cleanFieldText(answers.currentValidation) || "Early concept";
  const team = cleanFieldText(answers.teamBackground) || "Founding team";
  const distribution = cleanFieldText(answers.distributionChannel) || "Direct outbound sales";
  const tam = cleanFieldText(answers.tamEstimate) || "Addressable market";
  const isNonCommercial = isNonCommercialSubmission(rawIdea, answers);

  return {
    startupName: name,
    oneLiner,
    problem,
    icp,
    alternatives,
    geography,
    revenueModel,
    pricing,
    competitors,
    moat,
    validation,
    team,
    distribution,
    tam,
    isNonCommercial,
  };
}
