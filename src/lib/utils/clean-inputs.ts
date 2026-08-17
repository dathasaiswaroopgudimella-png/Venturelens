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

  // Clean conversational prefixes: "my idea is to", "is to", etc.
  const coreIdea = text
    .replace(/^(my\s*idea\s*is\s*to\s*|is\s*to\s*|we\s*want\s*to\s*|i\s*want\s*to\s*|to\s*)/i, "")
    .trim();

  // Combine ONLY user-entered text (exclude default dropdowns like revenueModel = "SaaS")
  const userEnteredFields = [
    coreIdea,
    answers?.problemSolved,
    answers?.targetCustomer,
    answers?.pricingStrategy,
    answers?.differentiation,
    answers?.teamBackground,
    answers?.currentValidation,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  // 1. Explicit personal activities, jokes, or non-commercial phrases
  const personalActivityPattern =
    /\b(sleep|sleeping|say hello|say hi|doing nothing|watch movie|watching tv|eating food|eat food|play game|playing games|joke|haha|fun only|just for fun|hello world|wake up|chilling|hangout|greetings)\b/i;

  if (personalActivityPattern.test(coreIdea)) {
    // Only permit if there is deep, verified commercial text (e.g. clinical sleep apnea medical device)
    const hasDetailedCommercialProblem =
      (answers?.problemSolved?.length || 0) > 40 &&
      /\b(patient|clinical|hospital|apnea|diagnostic|cost|inefficiency|enterprise|software)\b/i.test(
        answers?.problemSolved || ""
      );
    const hasVerifiedTraction =
      /\b(paying|\$\d+|₹\d+|arr|mrr|active contracts|pilot site)\b/i.test(
        answers?.currentValidation || ""
      );

    if (!hasDetailedCommercialProblem && !hasVerifiedTraction) {
      return true;
    }
  }

  // 2. Extremely short text with no business keywords
  if (coreIdea.length < 35) {
    const hasBusinessKeyword =
      /\b(ai|saas|app|platform|tool|service|product|system|software|b2b|b2c|workflow|analytics|data|api|cloud|health|fintech|infra|marketplace|developer|sales|energy|cooling|hardware|deeptech|logistics|edtech|biotech|medical|automation|compliance|security)\b/i.test(
        userEnteredFields
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
  if (/^(target customers?|target users?|customers?|users?|anyone|everyone|people|all)$/i.test(cleaned.trim())) {
    return "prospective enterprise buyers";
  }
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

  // Check for explicit "Startup Name: XYZ"
  const nameMatch = ideaText.match(/startup\s*name\s*:\s*([a-zA-Z0-9\s_-]+?)(?:\n|one-line|pitch|problem|\.|\,|$)/i);
  if (nameMatch && nameMatch[1]?.trim()) {
    return nameMatch[1].trim();
  }

  // Strip leading conversational phrases: "is to", "my idea is to", "we are building"
  const cleaned = cleanFieldText(ideaText)
    .replace(/^(my\s*idea\s*is\s*to\s*|is\s*to\s*|we\s*are\s*building\s*|we\s*build\s*|i\s*want\s*to\s*|to\s*)/i, "")
    .trim();

  if (!cleaned) return "Venture";

  const firstWords = cleaned.split(/\s+/).slice(0, 3).join(" ");
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
