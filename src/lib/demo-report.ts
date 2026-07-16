import { UnifiedVentureReport } from "@/types";

/**
 * A fully pre-computed demo report for "HealthSync AI" — a real startup idea
 * with a high quality score (84/100) that demonstrates every feature of the
 * VentureLens pipeline. Used as the default showcase on the dashboard.
 */
export const DEMO_REPORT: UnifiedVentureReport = {
  id: "demo-healthsync-001",
  projectId: "demo-healthsync-001",
  createdAt: new Date("2026-07-10T09:00:00Z").toISOString(),
  answers: {
    idea:
      "HealthSync AI is an AI-powered patient engagement and remote monitoring platform that connects chronic disease patients (diabetes, hypertension) with their primary care physicians through real-time health data streams. Patients use a mobile app to log glucose, blood pressure, and medication adherence data; our AI flags anomalies and automatically notifies their care team before a crisis occurs.",
    targetCustomer:
      "B2B: Primary care clinics and independent physician groups (2–20 providers) in the United States, with a secondary channel to self-insured employers offering employee wellness programs.",
    problemSolved:
      "73% of chronic disease patients miss critical health deterioration signals between clinic visits, resulting in preventable ER admissions that cost the US healthcare system $85B annually. Physicians have no visibility into patient health between appointments.",
    existingAlternatives:
      "Epic MyChart (hospital-only, no AI flagging), Livongo (diabetes-specific, expensive), manual patient phone calls by nursing staff (inefficient, unscalable).",
    geography: "United States, Tier 1 and Tier 2 metro markets, Southeast and Southwest regions first.",
    revenueModel: "SaaS",
    businessStage: "Validation",
    competitors: "Livongo, Omada Health, Twilio Health, Epic MyChart, Garmin Health",
    differentiation:
      "Real-time AI anomaly detection with automated physician alerts and a 5-minute EHR integration setup — competitors require 3–6 month IT implementations. Our proprietary deterioration prediction model is trained on 2M+ anonymized patient records.",
    currentValidation:
      "Signed LOIs from 3 independent physician groups covering 8,400 patients. Completed a 90-day pilot with Green Valley Clinic (2,100 patients) — ER admission rates dropped 31%. $180K pre-seed raised from two angel investors.",
    teamBackground:
      "CEO: Former VP of Clinical Operations at Allscripts (9 years); CTO: ex-Apple Health engineering, MS in Biomedical Informatics from Stanford; CMO: Practicing cardiologist, 14 years clinical experience.",
    pricingStrategy:
      "$6 per enrolled patient per month (PEPM), billed annually to the clinic. Enterprise tier at $4 PEPM for groups over 500 patients. Projected ARPU: $3,200/clinic/month.",
    distributionChannel:
      "Direct outbound sales to physician group administrators; referral partnerships with medical billing companies; channel sales through regional health IT resellers.",
    tamEstimate:
      "$28B US remote patient monitoring market (2026, CAGR 18%). SAM: $4.2B for chronic disease management platforms targeting independent physician groups.",
    fundingStage: "Pre-Seed",
  },
  facts: {
    problem: {
      description:
        "Chronic disease patients (diabetes, hypertension) miss critical deterioration signals between clinic visits, causing preventable ER admissions.",
      frequency: "Daily",
      urgency: "High",
      painSeverity: "Critical",
      alternativesPain:
        "Existing alternatives (Epic MyChart, Livongo) are either hospital-only or disease-specific, require 3–6 month IT implementations, and lack real-time AI anomaly detection.",
    },
    customer: {
      icp: "Independent primary care physician groups (2–20 providers) managing 500–5,000 chronic disease patients in the US.",
      earlyAdopters:
        "Progressive independent physician groups already using EHR systems (eClinicalWorks, Athenahealth) that are cost-conscious and care about patient outcomes.",
      segmentation:
        "Primary: B2B physician groups. Secondary: Self-insured employers seeking employee wellness ROI.",
      buyingBehavior:
        "Practice administrator evaluates ROI (cost savings from ER reduction), physician champion validates clinical workflow integration, 30–60 day sales cycle.",
    },
    market: {
      industryTags: ["HealthTech", "Remote Patient Monitoring", "Chronic Disease Management", "AI Healthcare"],
      geography: "United States — Southeast and Southwest metro markets first.",
      adoptionBarriers: [
        "HIPAA compliance requirements",
        "EHR integration complexity",
        "Physician behavior change resistance",
        "Insurance reimbursement uncertainty for RPM codes",
      ],
      tamPotential: "Large",
    },
    competition: {
      competitorList: ["Livongo", "Omada Health", "Twilio Health", "Epic MyChart"],
      differentiationMoat:
        "Proprietary AI deterioration prediction model trained on 2M+ anonymized records; 5-minute EHR setup vs. 3–6 month competitor implementations; PEPM pricing that aligns cost with clinic scale.",
      marketPositioning:
        "The fast-deploying, AI-first RPM solution for independent physician groups priced out of enterprise-only alternatives.",
    },
    businessModel: {
      primaryType: "SaaS",
      pricingStructure: "$6 per enrolled patient per month (PEPM), annual contract.",
      marginSustainability:
        "High SaaS margins (estimated 72% gross margin at scale). Annual contracts reduce churn. PEPM model creates natural expansion revenue as clinics enroll more patients.",
    },
    execution: {
      complexity: "High",
      resourcesRequired:
        "HIPAA-compliant cloud infrastructure (AWS GovCloud), EHR API integrations, mobile app development, clinical validation partnerships, compliance certifications.",
      timelineMonths: 18,
      teamFit:
        "CEO has deep clinical operations experience; CTO has health engineering background; CMO provides clinical validation credibility. Strong domain-market fit across the founding team.",
    },
  },
  graph: {
    nodes: [
      { id: "n1", type: "Customer", label: "Independent Physician Groups", properties: { size: "2–20 providers", location: "US" } },
      { id: "n2", type: "Problem", label: "Missed Deterioration Signals", properties: { frequency: "Daily", severity: "Critical" } },
      { id: "n3", type: "Solution", label: "HealthSync AI Platform", properties: { type: "SaaS", ai: true } },
      { id: "n4", type: "RevenueModel", label: "PEPM SaaS", properties: { price: "$6/patient/month" } },
      { id: "n5", type: "Market", label: "US Remote Patient Monitoring", properties: { tam: "$28B", cagr: "18%" } },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2", label: "experiences" },
      { id: "e2", source: "n3", target: "n2", label: "solves" },
      { id: "e3", source: "n3", target: "n4", label: "monetized_via" },
      { id: "e4", source: "n5", target: "n1", label: "contains" },
    ],
  },
  ruleOutcomes: [
    { id: "RULE_01_PRICE_ICP_MISMATCH", name: "B2C High Ticket Pricing Risk", status: "PASS", message: "Pricing strategy is aligned with B2B physician group buyer profile.", impactScoreEffect: 0 },
    { id: "RULE_02_TINY_TAM", name: "Market Scale Limitation", status: "PASS", message: "The $28B RPM market is well within venture-scale parameters.", impactScoreEffect: 0 },
    { id: "RULE_03_CROWDED_WEAK_MOAT", name: "Crowded Market / Defensibility Deficit", status: "PASS", message: "AI prediction model and 5-min EHR setup provide defensible technical moat.", impactScoreEffect: 0 },
    { id: "RULE_04_MARKETPLACE_SUPPLY", name: "Marketplace Double-Sided Acquisition Gap", status: "PASS", message: "Not a marketplace model — N/A.", impactScoreEffect: 0 },
    { id: "RULE_05_SAAS_ONE_TIME", name: "SaaS One-Time Pricing Inconsistency", status: "PASS", message: "Annual PEPM contract is a recurring SaaS model — consistent.", impactScoreEffect: 0 },
    { id: "RULE_06_COMPLEXITY_RESOURCES", name: "Execution Moat & Resource Deficit", status: "PASS", message: "Founding team has deep clinical, engineering, and medical domain expertise.", impactScoreEffect: 0 },
    { id: "RULE_07_LOW_PAIN", name: "Nice-to-Have Problem Severity", status: "PASS", message: "Preventable ER admissions are a critical, daily-frequency pain point.", impactScoreEffect: 0 },
    { id: "RULE_08_NO_VALIDATION", name: "Missing Market Evidence", status: "PASS", message: "3 signed LOIs, 90-day pilot with 31% ER reduction, $180K raised.", impactScoreEffect: 0 },
    { id: "RULE_09_GEOGRAPHY_GAP", name: "Vague Geographic Targeting", status: "PASS", message: "Targeting specific US metro markets with clear regional prioritization.", impactScoreEffect: 0 },
    { id: "RULE_10_SWITCHING_COST_MISMATCH", name: "Contradictory Customer Adoption Strategy", status: "PASS", message: "B2B buyers tolerate setup friction; no contradiction.", impactScoreEffect: 0 },
    { id: "RULE_11_TRANSACTION_LOW_FREQ", name: "Low Frequency Transactional Risk", status: "PASS", message: "SaaS model, not transactional.", impactScoreEffect: 0 },
    { id: "RULE_12_ENTERPRISE_SALES_GAP", name: "Enterprise GTM Distribution Gap", status: "PASS", message: "Direct outbound sales and reseller partnerships are appropriate B2B channels.", impactScoreEffect: 0 },
    { id: "RULE_13_REGULATORY_RISK", name: "Regulatory Compliance Execution Gap", status: "WARNING", message: "HIPAA compliance and EHR certification requirements are significant but team has domain expertise.", impactScoreEffect: -8 },
    { id: "RULE_14_WEAK_MOAT", name: "Defensibility Deficit", status: "PASS", message: "Proprietary AI model on 2M+ records and fast EHR integration are strong moats.", impactScoreEffect: 0 },
    { id: "RULE_15_ICP_DIST_MISMATCH", name: "ICP-Distribution Channel Mismatch", status: "PASS", message: "Direct outbound sales matches B2B physician group procurement.", impactScoreEffect: 0 },
    { id: "RULE_16_STAGE_VALIDATION_GAP", name: "Premature Scaling Risk", status: "PASS", message: "In Validation stage with LOIs, pilot data, and pre-seed funding.", impactScoreEffect: 0 },
  ],
  scores: {
    problem: { score: 96, confidence: "High", evidenceLevel: 9, keyIssues: [], suggestions: ["Quantify the cost-per-episode of a preventable ER admission to strengthen investor materials."] },
    customer: { score: 91, confidence: "High", evidenceLevel: 9, keyIssues: [], suggestions: ["Document the exact procurement decision-maker title and buying committee at target clinics."] },
    market: { score: 90, confidence: "High", evidenceLevel: 9, keyIssues: [], suggestions: ["Commission a bottom-up SAM analysis segmented by US metro region for pitch deck accuracy."] },
    competition: { score: 85, confidence: "High", evidenceLevel: 8, keyIssues: [], suggestions: ["Publish a competitive matrix comparing setup time, pricing, and AI capabilities vs. Livongo and Omada."] },
    businessModel: { score: 92, confidence: "High", evidenceLevel: 9, keyIssues: [], suggestions: ["Model out net revenue retention (NRR) at 12 months assuming 20% patient enrollment expansion per clinic."] },
    execution: { score: 82, confidence: "High", evidenceLevel: 8, keyIssues: ["HIPAA compliance and EHR certification are execution-intensive milestones."], suggestions: ["Hire a HIPAA compliance officer in the next 90 days.", "Begin SOC 2 Type II audit process immediately."] },
    risk: { score: 72, confidence: "Medium", evidenceLevel: 7, keyIssues: ["HIPAA compliance and EHR certification requirements."], suggestions: ["Formalize your HIPAA compliance program.", "Obtain ONC-certified EHR integration credentials."] },
    differentiation: { score: 93, confidence: "High", evidenceLevel: 9, keyIssues: [], suggestions: ["File a provisional patent on the deterioration prediction algorithm."] },
    scalability: { score: 88, confidence: "High", evidenceLevel: 8, keyIssues: [], suggestions: ["Design multi-tenant architecture to support 500+ clinic deployments without proportional operational cost increase."] },
    investorReadiness: { score: 86, confidence: "High", evidenceLevel: 9, keyIssues: [], suggestions: ["Build a Series A data room with pilot metrics, LOIs, and 12-month revenue projections."] },
    overallScore: 84,
  },
  evidence: {
    problem: { supporting: ["31% ER reduction in 90-day pilot (Green Valley Clinic)", "$85B annual cost of preventable ER admissions (cited source)", "73% of chronic patients miss deterioration signals (cited statistic)"], missing: ["Peer-reviewed publication of pilot data", "Patient NPS score from pilot program"] },
    customer: { supporting: ["3 signed LOIs from physician groups covering 8,400 patients", "Identified procurement stakeholder: practice administrator + physician champion"], missing: ["Formal willingness-to-pay survey across 20+ non-LOI clinics"] },
    market: { supporting: ["$28B TAM with 18% CAGR (cited market research)", "SAM of $4.2B for independent physician groups"], missing: ["Bottom-up TAM calculation with regional breakdown"] },
  },
  consistency: {
    status: "FLAGGED",
    contradictions: [
      {
        id: "CON-HEALTH-01",
        severity: "Medium",
        claim: "5-minute EHR integration setup claimed as a key differentiator.",
        evidence: "EHR API certification for major platforms (eClinicalWorks, Athenahealth) typically requires 3–6 months of approval processes per platform.",
        explanation: "While the patient-facing setup may be fast, the backend EHR API certification timeline must be clearly distinguished in sales materials to avoid misleading clinics.",
      },
    ],
  },
  recommendations: [
    { id: "REC_01", priority: "Critical", title: "Initiate SOC 2 Type II and HIPAA BAA Process", description: "No B2B healthcare sale will close without a signed Business Associate Agreement (BAA) and evidence of SOC 2 Type II compliance. Begin the audit process this quarter.", timeframe: "Immediate Action" },
    { id: "REC_02", priority: "High", title: "Clarify EHR Integration Timeline in Sales Materials", description: "Distinguish between patient app onboarding (5 minutes) and backend EHR API certification (3–6 months per platform) to avoid post-LOI trust breakdown.", timeframe: "Next 30 Days" },
    { id: "REC_03", priority: "High", title: "File Provisional Patent on Deterioration Prediction Algorithm", description: "Your proprietary AI model trained on 2M+ records is your primary defensibility vector. A provisional patent creates IP protection and increases Series A valuation.", timeframe: "Next 30 Days" },
    { id: "REC_04", priority: "Medium", title: "Build a Payer Reimbursement Strategy for RPM Codes", description: "Medicare CPT codes 99453, 99454, and 99457 enable clinics to bill for RPM services. Documenting this revenue opportunity for clinics dramatically accelerates sales cycles.", timeframe: "Next 90 Days" },
    { id: "REC_05", priority: "Medium", title: "Expand Pilot to 2 Additional Physician Groups", description: "Two pilots with measurable ER reduction data creates a statistically meaningful case study portfolio. Target groups in different specialties (cardiology, nephrology).", timeframe: "Next 90 Days" },
    { id: "REC_06", priority: "Low", title: "Recruit a Chief Revenue Officer with Health IT Sales Experience", description: "A CRO with prior enterprise health IT sales experience (Epic, Cerner, Allscripts) brings existing physician group relationships and accelerates the sales cycle.", timeframe: "Ongoing" },
  ],
  aiAnalysis: {
    executiveSummary:
      "HealthSync AI addresses a clinically validated, high-urgency problem in the US chronic disease management market with a differentiated AI-powered remote monitoring platform targeting an underserved segment: independent physician groups. The founding team has exceptional domain-market fit, early validation metrics are compelling (31% ER reduction in pilot), and the PEPM pricing model aligns incentives well. The primary execution risk is the HIPAA compliance and EHR certification timeline, which could delay enterprise sales cycles if not proactively managed.",
    swot: {
      strengths: [
        "Exceptional founding team with clinical operations, health engineering, and physician credentials",
        "Strong pilot data: 31% reduction in preventable ER admissions over 90 days",
        "Proprietary AI model trained on 2M+ anonymized patient records creates a data moat",
        "PEPM pricing creates natural expansion revenue as clinics onboard more patients",
        "3 signed LOIs covering 8,400 patients before product launch demonstrates real demand",
      ],
      weaknesses: [
        "HIPAA compliance and EHR API certification are time-intensive milestones not yet completed",
        "The '5-minute setup' claim for EHR integration overstates backend certification simplicity",
        "Pre-seed funding ($180K) may be insufficient to support compliance, certification, and sales cycles simultaneously",
        "No peer-reviewed publication of pilot outcomes to support clinical credibility claims",
      ],
      opportunities: [
        "Medicare RPM reimbursement codes (CPT 99453–99457) create a payer-funded revenue argument for clinics",
        "18% CAGR in the RPM market reflects strong secular tailwinds from an aging chronic disease population",
        "Self-insured employer channel represents a second distribution vector without clinical regulatory complexity",
        "International expansion to UK (NHS) and Canada (provincial health systems) as a Phase 3 opportunity",
      ],
      threats: [
        "Livongo and Omada Health have significant venture backing and are expanding into independent physician segments",
        "EHR incumbents (Epic, Oracle Health) are building native RPM features that could reduce switching urgency",
        "Regulatory changes to Medicare RPM reimbursement codes could reduce the financial incentive for clinics",
        "Data breach in a HIPAA-regulated environment would be existentially damaging before SOC 2 certification",
      ],
    },
    gtmStrategy:
      "Phase 1 (Months 1–6): Activate the 3 signed LOIs with full platform deployment and white-glove onboarding. Document outcomes rigorously and obtain written case studies from each clinic. Build direct outbound pipeline targeting 50 independent physician groups in Southeast US using the 31% ER reduction data as the primary hook. Phase 2 (Months 7–12): Partner with 3 regional medical billing companies to cross-sell HealthSync AI as a revenue-neutral add-on (RPM billing codes offset subscription cost). Launch a channel sales program with 2 health IT resellers. Phase 3 (Months 13–18): Enter self-insured employer market through 2 broker relationships, targeting employers with 500+ employees and high chronic disease prevalence rates.",
    mvpRoadmap:
      "Phase 1 — Clinical Foundation (Months 1–3): Complete HIPAA BAA templates, launch patient mobile app (iOS/Android) with glucose, blood pressure, and medication logging. Integrate with eClinicalWorks EHR via FHIR API. Deploy AI anomaly detection with physician alert workflows. Phase 2 — Validation Scaling (Months 4–6): Onboard all 3 LOI clinics, build outcome dashboards for clinic administrators, implement billing code reporting for CPT 99453–99457. Initiate SOC 2 Type II audit. Phase 3 — Growth Ready (Months 7–12): Add Athenahealth and Epic integrations. Build self-serve clinic onboarding. Develop employer wellness portal. Achieve SOC 2 Type II certification.",
    landingPageCopy: {
      heroTitle: "Stop Chronic Disease Crises Before They Happen",
      heroSubtitle: "HealthSync AI gives your care team real-time visibility into every enrolled patient's health — so you can intervene before an ER visit, not after.",
      features: [
        { title: "Real-Time AI Health Monitoring", desc: "Our AI flags anomalies in glucose, blood pressure, and medication adherence data the moment they occur — not at the next appointment." },
        { title: "5-Minute EHR Integration", desc: "Deploy HealthSync AI alongside your existing eClinicalWorks or Athenahealth system in minutes, not months." },
        { title: "Measurable Clinical Outcomes", desc: "Pilot clinics report a 31% reduction in preventable ER admissions within 90 days of deployment." },
      ],
      ctaText: "Book a Clinical Demo",
    },
    elevatorPitch:
      "HealthSync AI helps independent physician groups prevent expensive chronic disease crises before they happen. Our AI monitors enrolled patients in real-time and alerts care teams the moment a health deterioration signal appears — we reduced ER admissions by 31% in our first 90-day pilot. We charge $6 per patient per month, paid annually by the clinic, and clinics recover this cost through Medicare RPM billing codes. We have 3 signed LOIs covering 8,400 patients and a team of former Allscripts, Apple Health, and Stanford Biomedical Informatics professionals.",
    investorNarrative:
      "The United States spends $85 billion annually on preventable emergency room admissions from patients with chronic diseases like diabetes and hypertension — conditions that deteriorate silently between clinic visits. HealthSync AI is the first remote patient monitoring platform purpose-built for independent physician groups, the 200,000+ provider practices that are priced out of Livongo's enterprise contracts and underserved by Epic's hospital-only tools. Our AI anomaly detection platform, trained on 2 million anonymized patient records, gives care teams real-time visibility and automated alerts when patient health deteriorates — preventing crises before they occur. Our 90-day pilot at Green Valley Clinic reduced preventable ER admissions by 31%. We are raising a $2M pre-seed round to complete HIPAA certification, expand our three signed LOIs to full deployment, and hire our first two enterprise sales representatives.",
  },
  crossVerification: {
    aiStrategicVerdict:
      "HealthSync AI presents one of the stronger pre-seed healthcare technology opportunities I have reviewed. The combination of a genuinely critical clinical problem, strong founding team credentials, real pilot validation data, and a clear PEPM pricing model that aligns with clinic budgets is compelling. The primary risk factor — regulatory compliance timeline — is manageable given the team's clinical operations background. I rate this slightly below the deterministic score due to the competitive pressure from well-funded RPM incumbents and the underestimated complexity of EHR API certification timelines.",
    aiConfidence: "High",
    agreementScore: 92,
    agreementStatus: "✓ Very High Agreement",
    challengedAssumptions: [
      "The '5-minute EHR setup' claim — backend API certification timelines are typically 3–6 months per EHR platform and should not be conflated with patient app onboarding",
      "The $180K pre-seed may be insufficient to simultaneously fund SOC 2 certification, EHR integrations, and a direct outbound sales team",
    ],
    reasonForDisagreement: "N/A — AI independent rating (82) is within 2 points of deterministic score (84). Minor disagreement reflects competitive risk from Livongo/Omada expansion.",
    additionalEvidenceRequired: [
      "SOC 2 Type II audit initiation documentation or HIPAA BAA template",
      "EHR API certification status for eClinicalWorks and Athenahealth",
      "Patient NPS scores from Green Valley Clinic pilot",
      "12-month financial model showing path to Series A metrics (ARR target, customer count)",
    ],
    recommendedValidationSteps: [
      "Step 1: Initiate SOC 2 Type II audit with Vanta or Drata — this is the #1 sales blocker.",
      "Step 2: File provisional patent application on the AI deterioration prediction model.",
      "Step 3: Convert all 3 LOIs to signed annual contracts before raising next round.",
      "Step 4: Publish a de-identified version of the Green Valley Clinic pilot data as a clinical white paper.",
    ],
  },
};
