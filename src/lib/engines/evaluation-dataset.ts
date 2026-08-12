export interface BenchmarkDatasetItem {
  id: string;
  startupIdea: string;
  industry: string;
  evidenceData: {
    interviewsCount: number;
    surveyResponsesCount: number;
    repeatUsersCount: number;
    payingCustomersCount: number;
  };
  scores: {
    demand: number;
    retention: number;
    market: number;
    competition: number;
  };
  decision: "CONTINUE" | "PIVOT" | "STOP";
  reasoning: string;
  recommendedExperiment: string;
  sixMonthOutcome?: string;
}

export const VENTURE_BENCHMARK_DATASET: BenchmarkDatasetItem[] = [
  {
    id: "BENCH_01",
    startupIdea: "AI-Powered Hostel Laundry Scheduling & Pick-up Service for University Students",
    industry: "Campus Consumer Services",
    evidenceData: {
      interviewsCount: 5,
      surveyResponsesCount: 31,
      repeatUsersCount: 3,
      payingCustomersCount: 8,
    },
    scores: {
      demand: 70,
      retention: 30,
      market: 60,
      competition: 70,
    },
    decision: "PIVOT",
    reasoning: "High initial survey interest (31 responses), but 30-day repeat usage dropped severely (3/10) because students reverted to manual washing when billed per-load.",
    recommendedExperiment: "Test prepaid weekly/monthly subscription bundles ($15/mo) with 20 hostel residents over 14 days to establish 60-day recurring retention.",
    sixMonthOutcome: "Pivoted to prepaid monthly bundles ($15/mo) with 12-hour turnaround guarantee. Retention increased to 78% across 3 hostel blocks.",
  },
  {
    id: "BENCH_02",
    startupIdea: "Automated B2B Contract Compliance Auditor for Healthcare Providers",
    industry: "HealthTech B2B SaaS",
    evidenceData: {
      interviewsCount: 18,
      surveyResponsesCount: 45,
      repeatUsersCount: 12,
      payingCustomersCount: 10,
    },
    scores: {
      demand: 88,
      retention: 92,
      market: 85,
      competition: 65,
    },
    decision: "CONTINUE",
    reasoning: "High pain severity (HIPAA compliance fines), strong willingness-to-pay ($500/mo ACV), and zero churn across 10 hospital pilot accounts.",
    recommendedExperiment: "Expand outbound enterprise sales pipeline targeting mid-market regional hospital compliance officers to close 5 new $6k ACV contracts.",
    sixMonthOutcome: "Scaled to $120k ARR with 14 active healthcare network subscriptions and 98% gross retention.",
  },
  {
    id: "BENCH_03",
    startupIdea: "Social Networking App for Pet Owners to Schedule Local Dog Playdates",
    industry: "Consumer Mobile Social",
    evidenceData: {
      interviewsCount: 8,
      surveyResponsesCount: 120,
      repeatUsersCount: 2,
      payingCustomersCount: 0,
    },
    scores: {
      demand: 40,
      retention: 15,
      market: 35,
      competition: 20,
    },
    decision: "STOP",
    reasoning: "Convenience-level problem with zero monetization willingness. Users organize playdates via WhatsApp/iMessage without needing a dedicated social app.",
    recommendedExperiment: "Halt mobile app development. Conduct 15 problem discovery interviews with premium pet service businesses (groomers, trainers) to test B2B software demand.",
    sixMonthOutcome: "Project shut down. Team pivoted to building vertical CRM software for local pet grooming businesses.",
  },
  {
    id: "BENCH_04",
    startupIdea: "Hyperlocal On-Demand Merchant Delivery Fleet Operating on Pay-Per-Order",
    industry: "Logistics / Delivery",
    evidenceData: {
      interviewsCount: 25,
      surveyResponsesCount: 80,
      repeatUsersCount: 18,
      payingCustomersCount: 30,
    },
    scores: {
      demand: 80,
      retention: 75,
      market: 70,
      competition: 40,
    },
    decision: "PIVOT",
    reasoning: "Demand is high, but negative gross margin per delivery (-$1.20) causes cash drain as order volume grows due to courier downtime.",
    recommendedExperiment: "Pivot from operating fleet logistics to licensing white-label dispatch SaaS software to existing local courier companies at $199/mo per hub.",
    sixMonthOutcome: "Successfully pivoted to dispatch SaaS software, reaching 88% gross margin and 22 active logistics hubs.",
  },
];
