# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `docker-compose.yml`: single-command local development environment (`docker compose up`) running Postgres+pgvector, the Mastra server, and the Next.js web app with hot reload and isolated `node_modules` volumes
- `README.md`: Local Development section with setup steps, TablePlus connection parameters, and DO Inference credential requirements
- `apps/server` workspace: Mastra AI server with `@mastra/pg` Postgres storage and DO Inference Engine as an OpenAI-compatible LLM provider with three model tiers (small, mid, frontier)
- `packages/types` workspace (`@repo/types`): shared TypeScript types placeholder (`ApiResponse<T>`) wired into both `apps/server` and `apps/web`
- `@assistant-ui/react` installed in `apps/web`
- Tailwind CSS v4 in `apps/web` with forced dark mode (`@custom-variant dark` + `<html class="dark">`)
- `.env.example` at repo root documenting all required env vars (`DATABASE_URL`, `DO_INFERENCE_*`, `DO_MODEL_*`)
- Turbo `env` arrays for all server env vars in `build` and `dev` tasks

### Fixed

- Broken `@repo/ui` dependency removed from `apps/web` — `pnpm install` and `turbo dev` now succeed
- Vision, technical summary, and build plan documentation
- Open source infrastructure: LICENSE, CHANGELOG, CONTRIBUTING, SECURITY, issue templates
