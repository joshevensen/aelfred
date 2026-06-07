# Aelf.red — Build Plan

Everything runs locally until Phase 4. Deploy early, use Aelfred in production from Phase 4 onwards. After Phase 5, use the Dev Tool to build the rest.

Each phase delivers something working. Don't move to the next phase until the current one is verified.

---

## Phase 1 — Project Setup

Get the monorepo scaffolded, Mastra and Next.js running locally, Postgres ready, and DO Inference configured. Nothing intelligent happens yet — this phase is infrastructure and tooling only.

### Server Tasks

**Monorepo**

- [ ] Initialize Turborepo monorepo (`npx create-turbo@latest`)
- [ ] Create `apps/server` for Mastra
- [ ] Create `apps/web` for Next.js
- [ ] Create `packages/types` with shared TypeScript types placeholder
- [ ] Configure root `turbo.json` with dev and build pipelines
- [ ] Configure root `tsconfig.json` and `eslint` in `tooling/`
- [ ] Add `.env.example` with all required environment variable keys
- [ ] Add `.gitignore` — exclude `.env`, `node_modules`, build artifacts

**Mastra Server**

- [ ] Initialize Mastra in `apps/server` (`npx mastra@latest init`)
- [ ] Configure Mastra with Postgres storage adapter (`@mastra/pg`)
- [ ] Confirm Mastra dev server starts locally (`mastra dev`)
- [ ] Confirm Mastra playground accessible at `localhost:4111`

**Local Postgres + pgvector**

- [ ] Install Postgres locally (Homebrew or Docker)
- [ ] Install pgvector extension (`CREATE EXTENSION vector`)
- [ ] Create `aelfred` database
- [ ] Confirm Mastra connects and auto-creates its tables

**DO Inference Engine**

- [ ] Create DigitalOcean account (if not already)
- [ ] Enable Inference Engine in DO console
- [ ] Select models for each tier — small, mid, frontier
- [ ] Generate Inference Engine API key
- [ ] Configure DO Inference as LLM provider in Mastra
- [ ] Add API key and model names to `.env`
- [ ] Test a basic completion call returns a response

### Web Tasks

- [ ] Initialize Next.js in `apps/web` (`npx create-next-app@latest`)
- [ ] Install Assistant UI (`@assistant-ui/react`)
- [ ] Configure dark mode only (Tailwind)
- [ ] Confirm Next.js dev server starts at `localhost:3000`
- [ ] Confirm `turbo dev` starts both apps together

### Verification

- [ ] `turbo dev` starts both server and web client
- [ ] Mastra playground loads at `localhost:4111`
- [ ] Next.js loads at `localhost:3000`
- [ ] Test LLM call returns a response via DO Inference

---

## Phase 2 — Auth

Single-user auth. Simple, secure, done once.

### Server Tasks

**Database**

- [ ] Create `users` table migration
- [ ] Create `profile` table migration (includes `last_checkin_at`)
- [ ] Create `password_reset_tokens` table migration

**Auth Routes (Hono)**

- [ ] `POST /auth/login` — validate credentials, issue JWT, set httpOnly cookie
- [ ] `POST /auth/logout` — clear cookie
- [ ] `POST /auth/reset-request` — generate reset token, send email
- [ ] `POST /auth/reset-confirm` — validate token, update password hash
- [ ] JWT middleware — protect all non-auth routes
- [ ] Cookie configured as `httpOnly`, `secure`, `sameSite=strict`

**Email**

- [ ] Choose transactional email provider (Resend recommended)
- [ ] Configure email credentials in `.env`
- [ ] Password reset email template

**Profile API**

- [ ] `GET /profile` — return current user's profile
- [ ] `PUT /profile` — update profile fields
- [ ] Seed initial profile row on first login

### Web Tasks

- [ ] Login page — username + password, dark mode
- [ ] Auth state management — store session, redirect on login/logout
- [ ] Password reset flow — request and confirm pages
- [ ] Protected route wrapper — redirect to login if no session
- [ ] Settings panel (modal on mobile, side panel on desktop) — edit profile fields

### Verification

- [ ] Login issues JWT cookie
- [ ] Protected routes reject unauthenticated requests
- [ ] Password reset works end to end
- [ ] Profile read and update works
- [ ] Login UI works, settings panel opens and saves

---

## Phase 3 — Core Aelfred + Cost Tracking

The first real Aelfred. Personality, memory, and cost tracking all wired in from the first LLM call.

### Server Tasks

**Orchestrator Agent**

- [ ] Create orchestrator agent in `apps/server/src/mastra/agents/`
- [ ] Write full system prompt — personality, character, voice, behavioral rules
- [ ] Configure working memory — profile context injected on each conversation
- [ ] Configure episodic memory — message history in Postgres
- [ ] Configure semantic memory — pgvector embeddings, retrieved on each message
- [ ] Load profile and inject into working memory on each conversation start
- [ ] Test: conversation confirms Aelfred responds in character
- [ ] Test: new session recalls previous conversation context

**Cost Tracking**

- [ ] Create `costs` table migration with `costs_created_at_idx` index
- [ ] After every LLM call, extract token counts from DO Inference response
- [ ] Calculate `cost_usd` from token counts and model pricing
- [ ] Insert row into `costs` table with capability label
- [ ] `DEV_MODE` console logging for development visibility

**Chat & Cost API**

- [ ] `POST /chat` — receive message, pass to orchestrator, stream response
- [ ] `GET /costs/today` — sum for current day in user's timezone
- [ ] `GET /costs/month` — sum for current calendar month

### Web Tasks

- [ ] Chat UI wired to `/chat` using Assistant UI
- [ ] Streaming responses render correctly
- [ ] Chat history loads on open (last 2-3 days)
- [ ] Infinite scroll upward loads older messages in chunks
- [ ] 73 day hard cutoff on scroll
- [ ] Thinking state — submit disabled, thinking message in chat
- [ ] Error state — input disabled, border turns red, notification shown
- [ ] Cost display below chat input — today / month (e.g. `$4.34 / $19.37`)
- [ ] Chat max width 600px centered on desktop
- [ ] "Aelf.red isn't perfect and may make mistakes" below chat input

### Verification

- [ ] Full conversation with Aelfred — personality correct, memory working
- [ ] New session picks up context from previous session
- [ ] Every LLM call records a cost row
- [ ] Today and month cost totals display correctly
- [ ] Streaming works, thinking and error states work

---

## Phase 4 — Production Deploy

Ship it. Start using Aelfred for real. All future phases deploy to production when complete.

### Infrastructure

- [ ] Create DO Droplet ($12/month, 2GB RAM, Ubuntu 24)
- [ ] SSH key configured
- [ ] Create DO Volume (50GB)
- [ ] Attach Volume to Droplet
- [ ] Mount Volume at `/mnt/data`
- [ ] Install Node.js LTS
- [ ] Install Postgres, point data directory to Volume (`/mnt/data/postgresql`)
- [ ] Install pgvector on production Postgres
- [ ] Install Nginx
- [ ] Install PM2

### Database

- [ ] Create `aelfred` database on production Postgres
- [ ] Run all migrations
- [ ] Confirm all tables, enums, and indexes exist

### Application Deploy

- [ ] Clone repo to Droplet
- [ ] Create production `.env` with all environment variables
- [ ] Add DO Inference API key
- [ ] Add Spaces credentials
- [ ] Add email provider credentials
- [ ] Add JWT secret (generate strong random secret)
- [ ] `turbo build` confirms both apps build without errors
- [ ] PM2 starts Mastra server and Next.js
- [ ] PM2 save + startup — both survive Droplet reboot

### Nginx & Domain

- [ ] Point domain DNS to Droplet IP
- [ ] Configure Nginx — `aelf.red` → Next.js, `api.aelf.red` → Mastra server
- [ ] Install Certbot, generate SSL certificates
- [ ] Confirm HTTPS on both domains
- [ ] Confirm HTTP redirects to HTTPS

### Verification

- [ ] Login works on production domain
- [ ] Chat works end to end in production
- [ ] Cost row recorded in production DB
- [ ] Both apps survive a Droplet reboot
- [ ] DO Volume contains Postgres data (not Droplet disk)

---

## Phase 5 — Dev Tool

Spec to PR without leaving Aelf.red. Build this next — then use it to build everything that follows.

### Server Tasks

**GitHub Integration**

- [ ] Configure GitHub API credentials in `.env`
- [ ] `GET /github/repos` — list all repos via GitHub API
- [ ] `GET /github/repos/:repo/prs` — list open PRs
- [ ] `POST /github/repos/:repo/pr` — create PR

**Projects**

- [ ] Create `projects` table migration with `projects_status_idx`
- [ ] `GET /projects` — list projects
- [ ] `POST /projects` — create project, optionally link to GitHub repo
- [ ] `PUT /projects/:id` — update project

**Dev Tool Workflows**

- [ ] Spec intake — Aelfred receives spec in chat, confirms understanding
- [ ] Plan generation — Aelfred writes execution plan, calculates confidence score
- [ ] Plan review — if below confidence threshold, surface plan for approval before executing
- [ ] Ephemeral Droplet provisioning — spin up DO Droplet via DO API
- [ ] Plan execution — clone repo, execute plan, run tests
- [ ] Results reporting — stream build output to chat
- [ ] Droplet teardown — destroy after execution regardless of outcome
- [ ] PR creation — push branch, create PR, surface in chat for review

**Cost Tracking**

- [ ] Dev Tool LLM calls tagged with `dev` capability in costs table

### Web Tasks

- [ ] Projects list accessible from settings
- [ ] Dev Tool output streams into chat in real time
- [ ] PR review surfaces in chat — diff summary, Aelfred commentary
- [ ] Approve/request changes from chat

### Verification

- [ ] Write a spec in chat, Aelfred produces a plan
- [ ] Low confidence plan pauses for review before executing
- [ ] Ephemeral Droplet spins up, executes, tears down
- [ ] PR created in GitHub, visible and reviewable in chat
- [ ] Deploy to production

---

## Phase 6 — Get to Know Me

Jumpstart Aelfred's memory. Run this early — the richer the memory, the better everything else works.

### Server Tasks

- [ ] Design onboarding interview question set — life, work, relationships, preferences, goals
- [ ] `POST /checkin/start` — begin interview or check-in session
- [ ] `POST /checkin/respond` — process answer, extract facts, write to semantic memory
- [ ] `POST /checkin/complete` — finalize, update `profile.last_checkin_at`
- [ ] Proactive check-in workflow — fires every 30 days if `last_checkin_at` is stale
- [ ] `POST /checkin/manual` — trigger manual check-in

### Web Tasks

- [ ] First-run detection — if no `last_checkin_at`, prompt onboarding on first login
- [ ] Interview renders in chat — feels like a conversation not a form
- [ ] `@checkin` command triggers manual check-in
- [ ] Proactive check-in surfaces naturally in chat when triggered

### Verification

- [ ] Onboarding interview runs on first login
- [ ] Facts extracted and retrievable in subsequent conversations
- [ ] Proactive check-in triggers after 30 days
- [ ] Manual check-in works
- [ ] Deploy to production

---

## Phase 7 — Files

Persistent files across all conversations. Collaborative editing. RAG over everything you've written.

### Server Tasks

**DO Spaces**

- [ ] Create DO Spaces bucket (`{username}` as root)
- [ ] Create `files/` and `dev/` folders
- [ ] Configure Spaces credentials in `.env`

**Database**

- [ ] Create `file_format` enum
- [ ] Create `files` table migration with embedding column and `files_name_idx`

**File API**

- [ ] `POST /files` — create file, upload to Spaces, generate embedding, insert metadata
- [ ] `GET /files` — list all files
- [ ] `GET /files/:id` — retrieve file content from Spaces
- [ ] `PUT /files/:id` — targeted edit — update content, regenerate embedding
- [ ] `DELETE /files/:id` — remove from Spaces and DB

**RAG Integration**

- [ ] On each chat message, retrieve semantically relevant files via pgvector
- [ ] Inject retrieved file context into orchestrator before responding

### Web Tasks

- [ ] File explorer — side panel on desktop, full screen modal on mobile
- [ ] Browse, search, and filter files
- [ ] Visual mode by default — rendered MD, formatted CSV, pretty JSON
- [ ] Edit mode toggle — code view, visually obvious when active
- [ ] Metadata expandable at bottom of each file
- [ ] No delete in UI — ask Aelfred to delete
- [ ] File explorer icon in chat controls
- [ ] Paperclip attachment — attach files to a message

### Verification

- [ ] Create a file via chat, appears in explorer
- [ ] Targeted edit changes only what was asked
- [ ] RAG retrieval — Aelfred references file content in conversation
- [ ] File explorer loads, searches, and opens files correctly
- [ ] Deploy to production

---

## Phase 8 — Assistant

ADHD-aware reminders and tasks. Proactive, persistent, no list to look at.

### Server Tasks

**Database**

- [ ] Create `task_status`, `reminder_status`, `idea_status` enums
- [ ] Create `tasks` table migration with `tasks_status_due_at_idx`
- [ ] Create `reminders` table migration with `reminders_status_remind_at_idx`
- [ ] Create `ideas` table migration with `ideas_status_idx`

**Task & Reminder API**

- [ ] `POST /tasks` — create task
- [ ] `PUT /tasks/:id` — update status
- [ ] `GET /tasks` — list by status
- [ ] `POST /reminders` — create reminder with interval
- [ ] `PUT /reminders/:id` — snooze, done, update
- [ ] `GET /reminders` — list active reminders
- [ ] `POST /ideas` — capture idea
- [ ] `PUT /ideas/:id` — update status
- [ ] `GET /ideas` — list by status

**Reminder Workflows**

- [ ] Mastra persistent workflow polls `reminders` on schedule
- [ ] Fires when `remind_at` reached and status is `active`
- [ ] Re-schedules based on `interval_minutes` until `done`
- [ ] Surfaces reminder as a message in chat

**Conversational Capture**

- [ ] Orchestrator recognizes task/reminder intent from natural language
- [ ] "Remind me to call John tomorrow at 3" → creates reminder without a command
- [ ] Context chaining — "after my 3pm call, remind me to..." works correctly

### Web Tasks

- [ ] Reminders surface as messages in chat from Aelfred
- [ ] "Done" and "remind me in 2 hours" resolve naturally in chat
- [ ] Tasks and ideas viewable in file explorer as rows

### Verification

- [ ] Reminder fires at the right time
- [ ] Persistent nudging re-fires until marked done
- [ ] Snooze and done work
- [ ] Conversational capture works without explicit commands
- [ ] Deploy to production

---

## Phase 9 — Code Library

Reusable code in a public GitHub repo, propagated across all your projects automatically.

### Server Tasks

**Library Repo**

- [ ] Create `joshevensen/aelfred-library` public GitHub repo
- [ ] Define folder structure: `/components`, `/skills`, `/rules`, `/prompts`
- [ ] Define versioning convention — git tags per item

**Library API & Workflows**

- [ ] `GET /library` — list all library items via GitHub API
- [ ] `GET /library/:item` — retrieve item content
- [ ] `POST /library/:item` — add or update item in library repo
- [ ] Propagation workflow — find all consuming repos via projects table
- [ ] Create branch in each consuming repo, apply update
- [ ] Resolve conflicts automatically where confidence is high
- [ ] Run tests on each repo
- [ ] Merge clean passing repos automatically
- [ ] Surface failing or low-confidence repos in chat for review

### Web Tasks

- [ ] Library browsable from file explorer
- [ ] Propagation results stream into chat — which repos merged, which need attention
- [ ] Review and approve flagged repos from chat

### Verification

- [ ] Add a component to the library via chat
- [ ] "Push latest Button to all my repos" creates branches across projects
- [ ] Clean repos merge automatically
- [ ] Conflicts surface in chat for review
- [ ] Deploy to production
