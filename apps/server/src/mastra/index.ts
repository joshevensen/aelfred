/**
 * Mastra instance and DO Inference model tier exports for the Aelfred server.
 * @context  Entry point expected by `mastra dev` / `mastra build`. Wires Postgres
 *           storage (via @mastra/pg) and the DO Inference Engine as an OpenAI-compatible
 *           provider with three named model tiers sourced from env vars.
 * @gotchas  DO Inference Engine has no first-party Mastra adapter; @ai-sdk/openai with
 *           baseURL override is the documented approach for OpenAI-compatible endpoints.
 * @dependencies @mastra/core, @mastra/pg (PostgresStore), @ai-sdk/openai (createOpenAI)
 */
import { Mastra } from "@mastra/core";
import { PostgresStore } from "@mastra/pg";
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModelV3 } from "@ai-sdk/provider";

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

const pgStore = new PostgresStore({
  id: "aelfred-pg",
  connectionString: requireEnv("DATABASE_URL"),
});

const doInference = createOpenAI({
  baseURL: requireEnv("DO_INFERENCE_BASE_URL"),
  apiKey: requireEnv("DO_INFERENCE_API_KEY"),
});

// Model tiers — wire into agents as needed
export const smallModel: LanguageModelV3 = doInference(
  requireEnv("DO_MODEL_SMALL"),
);
export const midModel: LanguageModelV3 = doInference(
  requireEnv("DO_MODEL_MID"),
);
export const frontierModel: LanguageModelV3 = doInference(
  requireEnv("DO_MODEL_FRONTIER"),
);

export const mastra = new Mastra({
  storage: pgStore,
});
