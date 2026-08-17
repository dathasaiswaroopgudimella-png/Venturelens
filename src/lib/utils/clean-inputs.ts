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
    .trim();
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
  const icp = cleanFieldText(answers.targetCustomer) || "Target Customers";
  const alternatives = cleanFieldText(answers.existingAlternatives) || "manual legacy alternatives";
  const geography = cleanFieldText(answers.geography) || "Global";
  const revenueModel = answers.revenueModel || "Subscription";
  const pricing = cleanFieldText(answers.pricingStrategy) || "Tiered pricing";
  const competitors = answers.competitors
    ? answers.competitors.split(",").map((c) => cleanFieldText(c)).filter(Boolean)
    : [];
  const moat = cleanFieldText(answers.differentiation) || "proprietary speed & workflow edge";
  const validation = cleanFieldText(answers.currentValidation) || "Early concept";
  const team = cleanFieldText(answers.teamBackground) || "Founding team";
  const distribution = cleanFieldText(answers.distributionChannel) || "Direct outbound";
  const tam = cleanFieldText(answers.tamEstimate) || "Addressable market";

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
  };
}
