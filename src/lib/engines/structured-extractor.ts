import { QuestionnaireAnswers, ExtractedFacts } from "@/types";
import { cleanStartupAnswers } from "@/lib/utils/clean-inputs";

export class StructuredExtractor {
  /**
   * Fast deterministic fact extraction (<1ms).
   * Transforms structured questionnaire inputs into clean ExtractedFacts schema with zero prefix leakage.
   */
  public extract(answers: QuestionnaireAnswers): ExtractedFacts {
    const profile = cleanStartupAnswers(answers);
    const text = `${profile.startupName} ${profile.oneLiner} ${profile.problem} ${profile.icp} ${profile.moat} ${profile.revenueModel} ${profile.pricing}`.toLowerCase();

    // 1. Precise industry tagging (checking specific domains with exact context)
    const industryTags: string[] = [];
    
    // Data Center, Infrastructure, Cooling, Hardware, Industrial
    if (/\b(data\s*center|datacenter|cooling|liquid\s*cooling|thermal|server|hpc|megawatt|\b30\s*mw\b|facility|facilities|compute|subsea|drone|robotics|hardware|semiconductor|iot|industrial|sensor|telecom)\b/i.test(text)) {
      industryTags.push("Infrastructure & DeepTech");
    }
    
    // ClimateTech, Energy, Water, CleanTech
    if (/\b(freshwater|water|clean\s*water|carbon|energy|solar|grid|battery|emission|green|climate|sustainable|cleantech|effluent)\b/i.test(text)) {
      industryTags.push("CleanTech & Energy");
    }

    // HealthTech, Biotech, Medical
    if (/\b(health|healthcare|medical|patient|clinic|doctor|hospital|biotech|pharma|clinical|diagnosis|therapy|drug)\b/i.test(text)) {
      industryTags.push("HealthTech & Bio");
    }

    // FinTech, InsurTech, Payments (using strict word boundaries to avoid false positives)
    if (/\b(fintech|finance|banking|payments|payment|crypto|defi|wallet|underwriting|insurance|insurtech|wealthtech|lending|credit\s*card)\b/i.test(text)) {
      industryTags.push("FinTech & Financial Services");
    }

    // EdTech
    if (/\b(edtech|education|student|students|school|university|tutor|course|learning|curriculum)\b/i.test(text)) {
      industryTags.push("EdTech");
    }

    // Artificial Intelligence & Machine Learning
    if (/\b(ai|artificial\s*intelligence|machine\s*learning|llm|computer\s*vision|autonomous|neural|agentic)\b/i.test(text)) {
      industryTags.push("Artificial Intelligence");
    }

    // B2B SaaS & Enterprise Workflow
    if (/\b(saas|workflow|crm|erp|b2b|enterprise\s*software|collaboration|devops|api\s*platform)\b/i.test(text)) {
      industryTags.push("Enterprise B2B Software");
    }

    if (industryTags.length === 0) {
      industryTags.push("Enterprise Technology", "B2B Innovation");
    }

    // 2. Dynamic problem frequency
    let frequency = "Monthly";
    if (/\b(daily|every\s*day|continuous|real-time|24\/7|constant|hourly|always)\b/i.test(text)) frequency = "Daily";
    else if (/\b(weekly|regular|sprint|cycle)\b/i.test(text)) frequency = "Weekly";

    // 3. Dynamic pain severity
    let painSeverity = "Moderate";
    if (/\b(critical|severe|catastrophic|loss|expensive|downtime|outage|failure|fatal|penalty|compliance|exhaustion)\b/i.test(text)) {
      painSeverity = "Critical";
    } else if (/\b(convenience|nice-to-have|optional|casual)\b/i.test(text)) {
      painSeverity = "Convenience";
    }

    // 4. Dynamic primary revenue type
    let primaryType: ExtractedFacts["businessModel"]["primaryType"] = "Subscription";
    if (/market|platform|take rate|commission|two-sided/i.test(profile.revenueModel)) primaryType = "Marketplace";
    else if (/saas|subscrip|recurring|monthly|annual/i.test(profile.revenueModel)) primaryType = "SaaS";
    else if (/transact|fee|per usage|pay-as-you-go|per volume|per metric/i.test(profile.revenueModel)) primaryType = "Transaction";
    else if (/licens|patent|enterprise deal|contract/i.test(profile.revenueModel)) primaryType = "Licensing";
    else if (/hardware|retrofit|capex|equipment/i.test(text)) primaryType = "Other";

    return {
      problem: {
        description: profile.problem,
        frequency,
        urgency: painSeverity === "Critical" ? "High" : "Medium",
        painSeverity,
        alternativesPain: profile.alternatives,
      },
      customer: {
        icp: profile.icp,
        earlyAdopters: `Forward-thinking operational leaders within ${profile.icp}`,
        segmentation: profile.geography ? `${profile.geography} target segment` : "Target segment",
        buyingBehavior: profile.pricing,
      },
      market: {
        industryTags,
        geography: profile.geography,
        adoptionBarriers: ["Customer switching costs", "Workflow integration & legacy infrastructure inertia"],
        tamPotential: /global|billion|\$|enterprise|facility|cluster/i.test(text) ? "Large" : "Medium",
      },
      competition: {
        competitorList: profile.competitors,
        differentiationMoat: profile.moat,
        marketPositioning: "Specialized direct alternative",
      },
      businessModel: {
        primaryType,
        pricingStructure: profile.pricing,
        marginSustainability: primaryType === "SaaS" ? "High gross margin software potential" : "High-value enterprise contract economics",
      },
      execution: {
        complexity: /hardware|cooling|deeptech|drone|subsea|biotech|datacenter|thermal/i.test(text) ? "High" : "Medium",
        resourcesRequired: profile.team ? `Team domain expertise: ${profile.team}` : "Engineering, pilot site access, GTM sales cycles",
        timelineMonths: /hardware|infrastructure|cooling/i.test(text) ? 9 : 6,
        teamFit: profile.team,
      },
    };
  }
}
