/**
 * ESLint configuration for the Mastra server workspace.
 * @context   Server-local scripts run in Node while Mastra build output is generated under `.mastra`.
 * @gotchas   `.mastra` must be globally ignored; object-level ignores do not reliably exclude generated files after builds.
 * @dependencies @repo/eslint-config/base, eslint/config
 */
import { globalIgnores } from "eslint/config";
import { config } from "@repo/eslint-config/base";

/** @type {import("eslint").Linter.Config[]} */
export default [
  globalIgnores([".mastra/**"]),
  ...config,
  {
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
  },
];
