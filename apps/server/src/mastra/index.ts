/**
 * Mastra instance and DO Inference model tier exports for the Aelfred server.
 * @context  Entry point expected by `mastra dev` / `mastra build`. Wires Postgres
 *           storage (via @mastra/pg) and the DO Inference Engine as an OpenAI-compatible
 *           provider with three named model tiers sourced from env vars.
 * @gotchas  Model constants are instantiated at module-load time — missing DO_MODEL_*
 *           env vars produce broken instances that fail silently at inference, not startup.
 *           DO Inference Engine has no first-party Mastra adapter; @ai-sdk/openai with
 *           baseURL override is the documented approach for OpenAI-compatible endpoints.
 * @dependencies @mastra/core, @mastra/pg (PostgresStore), @ai-sdk/openai (createOpenAI)
 */
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
