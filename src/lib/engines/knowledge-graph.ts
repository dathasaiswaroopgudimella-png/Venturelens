import { ExtractedFacts, VentureKnowledgeGraph } from "@/types";

export class KnowledgeGraphBuilder {
  build(facts: ExtractedFacts): VentureKnowledgeGraph {
    return {
      nodes: [
        { id: "node_customer", type: "Customer", label: "Target Customer ICP", properties: { icp: facts.customer.icp } },
        { id: "node_problem", type: "Problem", label: "Market Problem", properties: { description: facts.problem.description } },
        { id: "node_solution", type: "Solution", label: "Value Proposition", properties: { moat: facts.competition.differentiationMoat } },
        { id: "node_revenue", type: "RevenueModel", label: "Monetization Model", properties: { type: facts.businessModel.primaryType } },
        { id: "node_market", type: "Market", label: "Target Market", properties: { geography: facts.market.geography } },
      ],
      edges: [
        { id: "e1", source: "node_customer", target: "node_problem", label: "EXPERIENCES" },
        { id: "e2", source: "node_solution", target: "node_problem", label: "SOLVES" },
        { id: "e3", source: "node_customer", target: "node_revenue", label: "MONETIZED_BY" },
        { id: "e4", source: "node_solution", target: "node_market", label: "POSITIONED_IN" },
      ],
    };
  }
}
