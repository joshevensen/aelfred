import { Mastra } from "@mastra/core";
import { PostgresStore } from "@mastra/pg";
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModelV3 } from "@ai-sdk/provider";

const pgStore = new PostgresStore({
  id: "aelfred-pg",
  connectionString: process.env["DATABASE_URL"]!,
});

const doInference = createOpenAI({
  baseURL: process.env["DO_INFERENCE_BASE_URL"]!,
  apiKey: process.env["DO_INFERENCE_API_KEY"]!,
});

// Model tiers — wire into agents as needed
export const smallModel: LanguageModelV3 = doInference(
  process.env["DO_MODEL_SMALL"]!,
);
export const midModel: LanguageModelV3 = doInference(
  process.env["DO_MODEL_MID"]!,
);
export const frontierModel: LanguageModelV3 = doInference(
  process.env["DO_MODEL_FRONTIER"]!,
);

export const mastra = new Mastra({
  storage: pgStore,
});
