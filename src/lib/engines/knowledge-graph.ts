import { ExtractedFacts, VentureKnowledgeGraph } from "@/types";

export class KnowledgeGraphBuilder {
  build(facts: ExtractedFacts): VentureKnowledgeGraph {
    const nodes = [
      {
        id: "node_customer",
        type: "Customer" as const,
        label: "Target Customer Profile",
        properties: {
          icp: facts.customer.icp,
          earlyAdopters: facts.customer.earlyAdopters,
          segmentation: facts.customer.segmentation,
          buyingBehavior: facts.customer.buyingBehavior,
        },
      },
      {
        id: "node_problem",
        type: "Problem" as const,
        label: "Market Problem",
        properties: {
          description: facts.problem.description,
          frequency: facts.problem.frequency,
          urgency: facts.problem.urgency,
          painSeverity: facts.problem.painSeverity,
          alternativesPain: facts.problem.alternativesPain,
        },
      },
      {
        id: "node_solution",
        type: "Solution" as const,
        label: "Value Proposition",
        properties: {
          moat: facts.competition.differentiationMoat,
          positioning: facts.competition.marketPositioning,
          competitorsCount: facts.competition.competitorList.length,
        },
      },
      {
        id: "node_revenue",
        type: "RevenueModel" as const,
        label: "Revenue Model",
        properties: {
          type: facts.businessModel.primaryType,
          pricingStructure: facts.businessModel.pricingStructure,
          marginSustainability: facts.businessModel.marginSustainability,
        },
      },
      {
        id: "node_market",
        type: "Market" as const,
        label: "Target Market",
        properties: {
          industryTags: facts.market.industryTags,
          geography: facts.market.geography,
          tamPotential: facts.market.tamPotential,
        },
      },
    ];

    const edges = [
      {
        id: "edge_customer_has_problem",
        source: "node_customer",
        target: "node_problem",
        label: "EXPERIENCES",
      },
      {
        id: "edge_solution_solves_problem",
        source: "node_solution",
        target: "node_problem",
        label: "SOLVES",
      },
      {
        id: "edge_customer_pays_revenue",
        source: "node_customer",
        target: "node_revenue",
        label: "MONETIZED_BY",
      },
      {
        id: "edge_solution_enters_market",
        source: "node_solution",
        target: "node_market",
        label: "POSITIONED_IN",
      },
      {
        id: "edge_revenue_validates_market",
        source: "node_revenue",
        target: "node_market",
        label: "CAPTURES_TAM",
      },
    ];

    return { nodes, edges };
  }
}
