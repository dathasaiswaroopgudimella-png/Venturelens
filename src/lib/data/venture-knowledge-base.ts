import { KnowledgeSnippet } from "@/types";

export const VENTURE_KNOWLEDGE_BASE: KnowledgeSnippet[] = [
  {
    id: "KB_VC_01",
    category: "VC_Framework",
    title: "Y Combinator Hair-on-Fire Problem Framework",
    content: "YC evaluates whether a startup addresses a 'hair-on-fire' problem. A hair-on-fire problem is one where customers are actively seeking immediate solutions, willing to use buggy early software, and possess unprompted budget allocated to solve it. If the problem is merely 'nice-to-have' (convenience level), customer acquisition cost (CAC) scales exponentially while retention remains low.",
    tags: ["YC", "Problem Severity", "Hair-on-fire", "Urgency", "Customer Pain"],
  },
  {
    id: "KB_VC_02",
    category: "VC_Framework",
    title: "Sequoia Capital Business Plan & Moat Framework",
    content: "Sequoia evaluates early-stage ventures across 4 core axes: (1) Clear target customer ICP, (2) Hair-on-fire problem statement, (3) Unfair defensible moat (network effects, proprietary datasets, technical complexity, or high switching costs), and (4) Scalable unit economics (LTV:CAC > 3:1). Startups relying purely on 'first-mover advantage' without technical barriers face severe margin degradation when incumbents replicate features.",
    tags: ["Sequoia", "Moat", "Unit Economics", "Defensibility", "Switching Costs"],
  },
  {
    id: "KB_VC_03",
    category: "GTM_Strategy",
    title: "Reforge Channel-Model Fit & Distribution Loops",
    content: "Startups fail not because of product flaws, but due to lack of Channel-Model Fit. High-friction enterprise sales ($10k+ ACV) require direct outbound sales reps, security reviews, and pilot approvals. B2C or low-ARPU SaaS ($10-$50/mo) must rely on viral loops, self-serve PLG (Product-Led Growth), or automated SEO. Attempting enterprise sales motions for low-ticket consumer products results in guaranteed cash burn.",
    tags: ["Reforge", "GTM", "Distribution", "Channel-Model Fit", "PLG", "Sales Motion"],
  },
  {
    id: "KB_VC_04",
    category: "Market_Sizing",
    title: "Bottom-Up TAM / SAM / SOM Calculation Methodology",
    content: "Top-down market sizing ('The global laundry industry is $50B, we just need 1%') is rejected by top VC partners. Bottom-up TAM requires calculating: TAM = Total Target Buying Units x Average Annual Revenue Per Unit (ARPU). SOM (Serviceable Obtainable Market) must be calculated based on realistic 24-month channel capacity, sales team velocity, and geographic beachhead constraints.",
    tags: ["TAM", "SAM", "SOM", "Bottom-Up", "Market Sizing", "Financial Modeling"],
  },
  {
    id: "KB_CASE_01",
    category: "Startup_Case_Study",
    title: "Case Study: Campus AI Hostel Laundry Service (Failed Retention)",
    content: "A campus startup launched an AI-scheduled hostel laundry delivery service for IIT students. Initial survey traction was high (31 surveys, 5 interviews, 8 pilot users). However, 30-day repeat usage dropped to 3/10 because students reverted to manual washing when pricing was charged per-load. PIVOT LESSON: Transitioned to prepaid weekly/monthly subscription bundles ($15/mo) with guaranteed 12-hour turnaround, increasing 60-day retention to 78%.",
    tags: ["IIT", "Hostel", "Laundry", "Retention", "Subscription Pivot", "Campus Startup"],
  },
  {
    id: "KB_CASE_02",
    category: "Startup_Case_Study",
    title: "Case Study: Hyperlocal B2B Delivery Logistics (Unit Economics Collapse)",
    content: "A hyperlocal delivery platform targeted small merchants with pay-per-delivery pricing. While demand grew 40% MoM, gross margin per delivery was -$1.20 due to rider downtime and order variance. PIVOT LESSON: Shifted from operating fleet logistics to licensing white-label dispatch SaaS software to existing local courier companies at $199/mo per hub, scaling gross margin to 88%.",
    tags: ["Logistics", "Unit Economics", "Gross Margin", "SaaS Pivot", "B2B"],
  },
  {
    id: "KB_ICE_01",
    category: "IIT_ECell_Resource",
    title: "IIT E-Cell Early Stage Validation & Beachhead Playbook",
    content: "Early-stage student & founder ventures must follow the 3-Step Campus Validation protocol before building full software: (1) Run 15 structured problem interviews without pitching the solution, (2) Execute a manual Concierge/Wizard-of-Oz pilot with 10 paying customers to verify willingness-to-pay, (3) Secure 3 signed Letters of Intent (LOIs) or advance deposits before engineering scaling features.",
    tags: ["IIT E-Cell", "Validation", "Concierge Pilot", "LOI", "Founder Playbook"],
  },
  {
    id: "KB_FAIL_01",
    category: "Fail_Pattern",
    title: "CB Insights Top Startup Post-Mortem: No Market Need (42%)",
    content: "The #1 reason startups fail (42% of post-mortems) is building products that address fake or low-severity problems. Founders mistake customer polite interest in interviews ('That sounds cool') for actual purchasing intent. Unless customers complain unprompted about existing workarounds or commit financial deposits, demand is unverified.",
    tags: ["CB Insights", "Startup Failure", "No Market Need", "Demand Validation"],
  },
  {
    id: "KB_VC_05",
    category: "VC_Framework",
    title: "NFX Marketplace Network Effects & Supply-Side Locking",
    content: "In two-sided marketplaces, the supply side is almost always the constrained side. Successful marketplaces (e.g. Airbnb, Uber, DoorDash) focus 80% of early GTM efforts on acquiring and locking in high-quality supply through exclusive tools, guaranteed minimum earnings, or free management software before driving demand.",
    tags: ["NFX", "Marketplace", "Network Effects", "Supply Side", "Platform"],
  },
  {
    id: "KB_VC_06",
    category: "VC_Framework",
    title: "SaaS Rule of 40 & LTV:CAC Ratio Benchmarks",
    content: "Venture-backed SaaS startups are evaluated on the Rule of 40: (Year-over-Year Revenue Growth Rate %) + (EBITDA Margin %) must equal or exceed 40%. Additionally, Customer Lifetime Value (LTV) to Customer Acquisition Cost (CAC) ratio must be > 3.0x, with CAC Payback Period under 12 months for SMB SaaS and under 18 months for Enterprise SaaS.",
    tags: ["SaaS", "Rule of 40", "LTV:CAC", "CAC Payback", "Financial Benchmarks"],
  },
];
