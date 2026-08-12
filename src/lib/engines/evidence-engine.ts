import { ExtractedFacts, EvidenceData, QuestionnaireAnswers } from "@/types";

export class EvidenceEngine {
  evaluate(facts: ExtractedFacts, answers: QuestionnaireAnswers, searchResultsCount = 0): Record<string, EvidenceData> {
    const report: Record<string, EvidenceData> = {};

    // 1. Problem Evidence
    report.problem = {
      supporting: [
        ...(answers.problemSolved.length > 20 ? ["User-defined problem thesis provided."] : []),
        ...(facts.problem.frequency !== "Rarely" ? [`Identified customer pain frequency: ${facts.problem.frequency}.`] : []),
        ...(facts.problem.painSeverity !== "Convenience" ? [`Pain severity categorized as: ${facts.problem.painSeverity}.`] : []),
      ],
      missing: [
        ...(answers.problemSolved.length < 30 ? ["Detailed problem frequency data is missing."] : []),
        ...(facts.problem.alternativesPain.includes("not validated") ? ["Direct quantification of workaround costs is missing."] : []),
      ],
    };

    // 2. Customer Evidence
    report.customer = {
      supporting: [
        ...(answers.targetCustomer.length > 20 ? ["Target buyer persona outlined by founder."] : []),
        ...(facts.customer.earlyAdopters ? [`Early adopter profile identified: ${facts.customer.earlyAdopters}.`] : []),
      ],
      missing: [
        ...(answers.targetCustomer.length < 30 ? ["Granular demographic/firmographic segmentation is missing."] : []),
        ...(answers.currentValidation.toLowerCase().includes("none") ? ["Primary customer interview datasets are missing."] : []),
      ],
    };

    // 3. Market Evidence
    report.market = {
      supporting: [
        ...(answers.geography.length > 3 ? [`Launch geography defined: ${answers.geography}.`] : []),
        ...(facts.market.industryTags.length > 0 ? [`Industry verticals mapped: ${facts.market.industryTags.join(", ")}.`] : []),
        ...(searchResultsCount > 0 ? [`Tavily gathered ${searchResultsCount} competitor articles for validation.`] : []),
      ],
      missing: [
        ...(answers.tamEstimate ? [] : ["Detailed bottom-up TAM/SAM/SOM calculations are missing."]),
        ...(answers.geography.toLowerCase().includes("global") ? ["Venture lacks focus beachhead geography details."] : []),
      ],
    };

    // 4. Competition Evidence
    report.competition = {
      supporting: [
        ...(facts.competition.competitorList.length > 0
          ? [`Founder cited competitors: ${facts.competition.competitorList.join(", ")}.`]
          : []),
        ...(facts.competition.differentiationMoat.length > 20 ? ["Venture defensibility vectors declared."] : []),
      ],
      missing: [
        ...(facts.competition.competitorList.length === 0 ? ["Thorough third-party competitor directory verification is missing."] : []),
        ...(facts.competition.differentiationMoat.toLowerCase().includes("first mover")
          ? ["Moat defensibility relies on speed; technical/IP moats are missing."]
          : []),
      ],
    };

    // 5. Business Model Evidence
    report.businessModel = {
      supporting: [
        ...(answers.revenueModel.length > 5 ? [`Primary monetization: ${answers.revenueModel}.`] : []),
        ...(answers.pricingStrategy.length > 5 ? [`Pricing strategy declared: ${answers.pricingStrategy}.`] : []),
      ],
      missing: [
        ...(answers.pricingStrategy.toLowerCase().includes("tbd") || answers.pricingStrategy.length < 15
          ? ["Pricing unit-economics validation is missing."]
          : []),
      ],
    };

    // 6. Execution Evidence
    report.execution = {
      supporting: [
        ...(answers.teamBackground.length > 20 ? ["Founder background and experience detailed."] : []),
        ...(answers.businessStage.length > 2 ? [`Business lifecycle maturity: ${answers.businessStage}.`] : []),
      ],
      missing: [
        ...(answers.teamBackground.length < 30 ? ["Detailed resumes or technical architecture experience is missing."] : []),
        ...(facts.execution.complexity === "High" && answers.teamBackground.toLowerCase().includes("none")
          ? ["Expertise credentials to match high technical complexity are missing."]
          : []),
      ],
    };

    // 7. Risk Evidence
    report.risk = {
      supporting: [
        ...(facts.market.adoptionBarriers.length > 0
          ? [`Adoption barriers identified: ${facts.market.adoptionBarriers.join(", ")}.`]
          : []),
      ],
      missing: [
        ...(facts.market.adoptionBarriers.some((b) => b.toLowerCase().includes("regulation")) &&
        !answers.teamBackground.toLowerCase().includes("compliance")
          ? ["Regulatory audit procedures and compliance timeline are missing."]
          : []),
      ],
    };

    // 8. Differentiation Evidence
    report.differentiation = {
      supporting: [
        ...(answers.differentiation.length > 15 ? [`Declared differentiators: ${answers.differentiation}.`] : []),
      ],
      missing: [
        ...(answers.differentiation.length < 25 ? ["Granular feature-by-feature competitor differentiation grid is missing."] : []),
      ],
    };

    // 9. Scalability Evidence
    report.scalability = {
      supporting: [
        ...(facts.businessModel.primaryType === "SaaS" ? ["Software model allows zero-marginal cost distribution."] : []),
        ...(facts.businessModel.primaryType === "Subscription" ? ["Subscription model allows compounded growth MRR."] : []),
      ],
      missing: [
        ...(answers.distributionChannel.length < 20 ? ["Scalable digital acquisition loops are missing."] : []),
      ],
    };

    // 10. Investor Readiness Evidence
    report.investorReadiness = {
      supporting: [
        ...(answers.currentValidation.length > 20 ? ["Traction milestones provided by founder."] : []),
      ],
      missing: [
        ...(answers.currentValidation.toLowerCase().includes("none") ? ["Documented letters of intent or pilot metrics are missing."] : []),
      ],
    };

    return report;
  }
}
