import fs from "fs";
import path from "path";
import { VENTURE_BENCHMARK_DATASET } from "../src/lib/engines/evaluation-dataset.ts";

const outputDir = path.join(process.cwd(), "dataset");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, "venturelens_fine_tuning_dataset.jsonl");

const formattedRows = VENTURE_BENCHMARK_DATASET.map((item) => {
  const instruction = "You are VentureLens AI, an expert Venture Capital Decision Intelligence model. Analyze the startup idea, evidence metrics, and market conditions. Output dimensional scores, major risks, strategic verdict (CONTINUE/PIVOT/STOP), strategic reasoning, and a concrete next experiment.";
  
  const input = `Startup Concept: ${item.startupIdea}
Industry Sector: ${item.industry}
Evidence Collected:
- Customer Interviews: ${item.evidenceData.interviewsCount}
- Survey Responses: ${item.evidenceData.surveyResponsesCount}
- Pilot Paying Customers: ${item.evidenceData.payingCustomersCount}
- 30-Day Repeat Users: ${item.evidenceData.repeatUsersCount}`;

  const output = JSON.stringify({
    scores: {
      demandScore: item.scores.demand,
      retentionScore: item.scores.retention,
      marketScore: item.scores.market,
      competitionScore: item.scores.competition,
    },
    decision: item.decision,
    reasoning: item.reasoning,
    recommendedExperiment: item.recommendedExperiment,
    sixMonthOutcome: item.sixMonthOutcome || "Pending validation milestone",
  }, null, 2);

  return JSON.stringify({ instruction, input, output });
});

fs.writeFileSync(outputPath, formattedRows.join("\n"), "utf-8");
console.log(`[Dataset Exporter] Successfully exported ${formattedRows.length} fine-tuning examples to: ${outputPath}`);
