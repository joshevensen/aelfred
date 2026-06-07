# Aelf.red — Technical Summary

---

## Repository Structure

Monorepo using Turborepo — shared context, unified tooling, single place to work.

```
aelfred/
├── apps/
│   ├── server/               # Mastra agent server — the core of Aelf.red
│   │   └── src/mastra/
│   │       ├── agents/       # Aelfred orchestrator agent
│   │       ├── tools/        # Mastra tools (GitHub, web search, file ops etc.)
│   │       ├── workflows/    # Mastra workflows (reminders, check-ins, dev builds)
│   │       └── index.ts
│   └── web/                  # Next.js + Assistant UI — React web client
├── packages/
│   └── types/                # Shared TypeScript types between server and web
└── tooling/
    ├── tsconfig/
    └── eslint/
```

Tools, workflows, and agents live inside the Mastra server where Mastra expects them. The only shared package is types — both apps need to agree on data shapes.

---

## Technical Stack

| Layer                | Choice                                                                               |
| -------------------- | ------------------------------------------------------------------------------------ |
| Agent framework      | Mastra (TypeScript)                                                                  |
| Web client           | React/Next.js + Assistant UI                                                         |
| Native client        | Swift / SwiftUI (future — iPhone, iPad, Mac, Apple Watch)                            |
| Hosting              | DigitalOcean Droplet ($12/month, upgrade to $24 if needed)                           |
| Ephemeral compute    | DigitalOcean Droplets (Dev Tool builds)                                              |
| File storage         | DigitalOcean Spaces (S3-compatible object storage)                                   |
| Database             | Postgres on DO Volume (persistent block storage, survives Droplet rebuilds)          |
| Vectors              | pgvector on same Postgres instance                                                   |
| LLM routing          | DigitalOcean Inference Engine (multi-model, policy-driven)                           |
| Auth                 | Hono JWT middleware — username/password, httpOnly cookie, email-based password reset |
| Serverless functions | DigitalOcean Functions (webhooks, background jobs — not RAG)                         |
| Voice                | Deferred                                                                             |
| Browser automation   | Mastra Browser / Stagehand (future)                                                  |

---

## Database Schema

All tables live in the same Postgres instance on the DO Volume. Mastra manages its own tables automatically on first run — never modify them manually.

---

### Mastra Tables

_Auto-created and managed by Mastra on first run. Never modify manually. All prefixed with `mastra_`._

**mastra_messages** — every conversation message
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| thread_id | uuid FK → mastra_threads.id | |
| resourceId | uuid | nullable |
| content | text | JSON (MastraMessageContentV2) |
| role | text | `user` or `assistant` |
| createdAt | timestamp | used for ordering |

**mastra_threads** — conversation sessions
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| resourceId | text | owner identifier |
| title | text | auto-generated from first message |
| metadata | text | stringified JSON |
| createdAt | timestamp | |
| updatedAt | timestamp | used for ordering |

**mastra_resources** — persistent user/entity data (working memory)
| Column | Type | Notes |
|---|---|---|
| id | text PK | resourceId used in agent calls |
| workingMemory | text | nullable — markdown, persists across threads |
| metadata | jsonb | nullable |
| createdAt | timestamp | |
| updatedAt | timestamp | |

**mastra_workflow_snapshot** — suspend/resume state for Mastra workflows
| Column | Type | Notes |
|---|---|---|
| workflow_name | text | |
| run_id | uuid | |
| snapshot | text | serialized JSON workflow state |
| createdAt | timestamp | |
| updatedAt | timestamp | |

**mastra_evals** — evaluation scores
| Column | Type | Notes |
|---|---|---|
| input | text | |
| output | text | |
| result | jsonb | score and details |
| agent_name | text | |
| metric_name | text | |
| instructions | text | |
| global_run_id | uuid | |
| run_id | uuid | |
| created_at | timestamp | |

**mastra_scorers** — eval scorer records
| Column | Type | Notes |
|---|---|---|
| requestContext | jsonb | nullable |

**mastra_traces** — observability spans
| Column | Type | Notes |
|---|---|---|
| id | text PK | |
| parentSpanId | text | nullable |
| name | text | hierarchical operation name |

_Semantic recall vector embeddings stored by Mastra using pgvector via `PgVector` — exact table name confirmed at build time._

_Auto-created indexes: `mastra_threads_resourceid_createdat_idx`, `mastra_messages_thread_id_createdat_idx`, `mastra_traces_name_starttime_idx`, `mastra_evals_agent_name_created_at_idx`_

---

### Aelf.red Tables

_Custom tables owned by Aelf.red. Build each table when its feature is built — not before._

#### Enums

```sql
CREATE TYPE task_status AS ENUM ('pending', 'done', 'cancelled');
CREATE TYPE reminder_status AS ENUM ('active', 'snoozed', 'done');
CREATE TYPE idea_status AS ENUM ('open', 'explored', 'dropped');
CREATE TYPE file_format AS ENUM ('md', 'csv', 'json');
CREATE TYPE contact_relationship AS ENUM ('family', 'friend', 'colleague', 'vendor', 'acquaintance');
```

---

**users** — authentication only
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| username | text | unique |
| password_hash | text | bcrypt |
| email | text | for password reset |
| created_at | timestamp | |
| updated_at | timestamp | |

**profile** — who you are, one-to-one with users. Source of truth for identity context injected into every conversation.
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → users.id | unique |
| name | text | |
| timezone | text | e.g. `America/Chicago` |
| preferences | jsonb | communication style, tone, etc. |
| notes | text | nullable — anything else Aelfred should know |
| last_checkin_at | timestamp | nullable — when Get to Know Me last ran |
| created_at | timestamp | |
| updated_at | timestamp | |

**password_reset_tokens** — email-based password reset
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → users.id | |
| token_hash | text | |
| expires_at | timestamp | |
| used | boolean | default false |
| created_at | timestamp | |

**costs** — LLM usage tracking, one record per LLM call
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| capability | text | `companion`, `files`, `dev`, `assistant`, `checkin` |
| model | text | model used |
| input_tokens | integer | |
| output_tokens | integer | |
| cost_usd | numeric(10,6) | |
| created_at | timestamp | used to aggregate day/month totals |

_Index: `costs_created_at_idx` (created_at) — powers day/month aggregation queries_

**files** — metadata for all files stored in Spaces
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| name | text | display name |
| spaces_key | text | full path in DO Spaces bucket |
| format | file_format | `md`, `csv`, `json` |
| embedding | vector | pgvector — for RAG retrieval |
| created_at | timestamp | |
| updated_at | timestamp | |

_Index: `files_name_idx` (name) — used when browsing file explorer_

**tasks** — Assistant capability
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| content | text | |
| status | task_status | |
| due_at | timestamp | nullable |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | nullable — soft delete |

_Index: `tasks_status_due_at_idx` (status, due_at)_

**reminders** — Assistant capability, managed by Mastra workflows
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| content | text | |
| remind_at | timestamp | next fire time |
| interval_minutes | integer | nullable — repeat interval |
| status | reminder_status | |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | nullable — soft delete |

_Index: `reminders_status_remind_at_idx` (status, remind_at) — polled constantly by reminder workflows_

**ideas** — captured via conversation or @idea command
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| content | text | |
| status | idea_status | |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | nullable — soft delete |

_Index: `ideas_status_idx` (status)_

**projects** — known to Aelfred, gives Dev Tool a place to associate context with GitHub repos
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| name | text | |
| github_repo | text | nullable — `owner/repo` format |
| description | text | nullable |
| status | text | `active`, `dormant`, `abandoned` — text not enum, may grow |
| notes | text | nullable |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | nullable — soft delete |

_Business context (role, type, revenue, strategy) lives in semantic memory via Get to Know Me and ongoing conversation — not in a table._

_Index: `projects_status_idx` (status)_

**contacts** — people Aelfred knows about
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| name | text | |
| email | text | nullable |
| phone | text | nullable |
| birthday | date | nullable |
| relationship | contact_relationship | |
| notes | text | nullable |
| embedding | vector | pgvector — rich context from conversations |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | nullable — soft delete |

_Indexes: `contacts_name_idx` (name), `contacts_relationship_idx` (relationship)_

---

## Authentication

JWT-based auth built directly in the Mastra server using Hono's JWT middleware.

**Flow:** Login with username + password → bcrypt comparison against `users.password_hash` → JWT issued and stored as an `httpOnly`, `secure`, `sameSite=strict` cookie → cookie sent automatically on every request → Hono middleware validates JWT on protected routes.

**Why cookie over localStorage:** httpOnly cookies are inaccessible to JavaScript, protecting against XSS attacks. CSRF risk mitigated by `sameSite=strict`.

**Token details:** Short-lived JWT (24 hours), password reset via email link with a hashed token stored in `password_reset_tokens` with short expiry.

---

## Spaces File Structure

One bucket, files organized by a simple flat path:

```
{username}/
├── files/        # all user files (MD, CSV, JSON)
└── dev/          # Dev Tool artifacts — specs, plans, build logs
```

Full file path: `{username}/files/{filename}`

The `files` table in Postgres holds metadata and embeddings. Spaces holds the actual file content. RAG queries hit pgvector, retrieve relevant files, reference back to Spaces for full content when needed.

---

## LLM Model Routing

DO Inference Router enforces routing policy automatically. Configured once, applied to every call. Configurable in Aelf.red settings without changing code.

| Task                                                          | Model Tier | Reason                          |
| ------------------------------------------------------------- | ---------- | ------------------------------- |
| Reminder scheduling, task parsing, idea capture               | Small      | Rule-based, no reasoning needed |
| File editing, search, general chat                            | Mid-tier   | Capable enough, cost effective  |
| Dev Tool planning, complex reasoning, sensitive conversations | Frontier   | Quality matters most here       |
