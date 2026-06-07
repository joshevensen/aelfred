# Aelfred

> A self-hosted personal AI that knows you — and never makes you re-explain yourself.

Aelfred is a personal AI platform built around one idea: your AI should have context, not just memory. One context pool. Every capability — chat, files, reminders, code — draws from the same accumulated understanding of who you are. Every conversation makes it more useful.

Built on [Mastra](https://mastra.ai) (TypeScript agent framework). React/Next.js web client. Deployed on DigitalOcean. Dark mode only.

---

## Why Aelfred

Most AI tools are stateless. You open a new chat and you are a stranger again. You re-explain your project, your preferences, your context. Every time.

Aelfred does not work that way. It builds a structured understanding of you over time — your businesses, your relationships, your preferences, your history, your goals — and draws on all of it, automatically, on every message. The longer you use it, the more useful it gets.

It is self-hosted on your own infrastructure. Nothing leaves your environment except LLM inference calls. Your data is yours.

---

## Capabilities

**Companion** — Persistent chat with no session limits. Memory retrieval on every message. Aelfred pulls what is relevant to the current topic automatically, without you asking.

**Files** — A file system for your ideas, plans, and documents. Files persist across all conversations. Collaborative editing — tell Aelfred what to change, it changes exactly that. Markdown, JSON, CSV. Full-text and semantic search.

**Assistant** — Reminders that actually work. Conversational capture, persistent nudging, intelligent timing. Built on Mastra persistent workflows — survives server restarts.

**Dev Tool** — Write a spec in plain language. Aelfred produces an execution plan. An ephemeral DigitalOcean Droplet builds, tests, and opens a PR. You review in chat. The Droplet is destroyed when done.

**Code Library** — A personal library of reusable components, skills, rules, and prompt templates synced across all your repos from a single GitHub repository.

---

## Character

Aelfred has a consistent character across everything — chat, files, code, reminders. The tone does not change based on what you are doing.

A traditional British butler in the tradition of Alfred Pennyworth — warm, loyal, deeply competent, and genuinely invested in your wellbeing and success. Not a servant executing orders but a trusted confidant who happens to be impeccably capable. The humor is deadpan, precise, and never performed. Concise by default. Honest about uncertainty. Never sycophantic.

---

## Tech Stack

| Layer             | Choice                                                         |
| ----------------- | -------------------------------------------------------------- |
| Agent framework   | [Mastra](https://mastra.ai) (TypeScript)                       |
| Web client        | React / Next.js + [Assistant UI](https://www.assistant-ui.com) |
| Hosting           | DigitalOcean Droplet                                           |
| Ephemeral compute | DigitalOcean Droplets (Dev Tool builds)                        |
| LLM routing       | DigitalOcean Inference Engine                                  |
| Database          | Postgres on DO Volume                                          |
| Vectors           | pgvector                                                       |
| File storage      | DigitalOcean Spaces                                            |
| Auth              | Hono JWT — httpOnly cookie                                     |

---

## Self-Hosting

> **Status: early development.** Self-hosting documentation and deployment scripts are not yet written. The architecture is defined and actively being built.

Aelfred is designed to run on a single DigitalOcean Droplet (~$12/month). The full stack — API, web client, Postgres, pgvector — runs on one machine to start. Infrastructure cost is approximately $23/month fixed, plus LLM inference (~$10–25/month with sensible routing).

Deployment documentation will be added as the project matures. Follow the repo or watch for the first tagged release.

---

## Project Status

This is a personal project built for daily use. It is open source because the ideas are worth sharing and others might find them useful or want to build something similar for themselves.

There is no hosted version. There is no roadmap driven by user requests. Aelfred is built to scratch a specific itch — a self-hosted personal AI where memory is the core product — and shared in the hope that the architecture or approach is useful to others.

See [CHANGELOG.md](./CHANGELOG.md) for what has changed.

---

## Contributing

Aelfred is a personal project maintained on personal time. It is not a supported open source project — there is no SLA on issues or PRs, and feature requests that do not align with personal use cases are unlikely to land.

That said, bug fixes, self-hosting improvements, and documentation contributions are genuinely useful. See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

---

## License

Apache License 2.0 — see [LICENSE](./LICENSE).
