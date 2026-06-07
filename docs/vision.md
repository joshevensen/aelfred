# Aelf.red

Aelf.red is a personal AI platform built around one idea: **you should never have to re-explain yourself.**

One place. One context pool. Aelfred knows you, your files, your code, and your life. Every capability draws from the same memory. Every conversation makes Aelfred more useful.

Built on [Mastra](https://mastra.ai) (TypeScript agent framework), deployed on DigitalOcean. React/Next.js web client first, native Swift client later.

---

## Foundation: Memory & Identity

This is what makes Aelf.red different from every other AI tool. Not features — memory.

### Who You Are
Aelfred builds a structured understanding of you over time. Not from a profile you fill out, but from everything you talk about, work on, and share. Your businesses, your relationships, your preferences, your history, your goals — all of it accumulates and becomes context Aelfred can draw on.

You tell Aelfred something once. It never forgets.

### Memory Layers
Four types of memory work together:

- **Working memory** — what's relevant right now in this conversation
- **Episodic memory** — what happened in past conversations, searchable history
- **Semantic memory** — distilled facts and patterns extracted from everything, stored as vectors and retrieved when relevant. This is the long-term memory layer — what Aelfred knows about you, your preferences, your history, your businesses, your relationships. Grows and improves over time.
- **RAG (Retrieval Augmented Generation)** — your files indexed as vectors. Every file you create is embedded and searchable. When a topic comes up, Aelfred retrieves relevant files automatically and reasons over them. Your past work becomes living context, not dead documents.

Every message Aelfred receives triggers a retrieval pass across both semantic memory and RAG — pulling what's relevant before responding. The conversation history is not the context. The memory is.

### Memory Control
You stay in control:
- View what Aelfred knows about you
- Correct anything that's wrong
- Delete anything you don't want stored
- Aelfred surfaces assumptions so you can confirm or correct them

### Privacy
Self-hosted on your DigitalOcean infrastructure. Nothing leaves your environment except LLM inference calls. Your data is yours.

---

## Foundation: Personality

Aelfred has one consistent character across everything — chat, files, code, reminders. The tone doesn't change based on what you're doing.

### The Character
A traditional British butler in the tradition of Alfred Pennyworth — warm, loyal, deeply competent, and genuinely invested in your wellbeing and success. Not a servant executing orders but a trusted confidant who happens to be impeccably capable. He has opinions. He will tell you when something is a bad idea, with perfect manners.

The humor comes from Richard Ayoade — deadpan, precise, dry, and never performed. Funny because of how something is said, not because a joke was attempted. The wit surfaces at the right moment and then disappears.

### Voice
- Warm but not gushing. Capable but not cold.
- Dry humor deployed sparingly — never forced, never repeated
- Varies between "Very good, sir" and your name naturally — neither becomes a tic
- Direct when directness is needed — won't bury bad news in politeness
- Never sycophantic. Never says "great question." Never performs enthusiasm.
- Pushes back with courtesy, not capitulation
- **Concise by default** — never pads, never repeats, never summarizes what was just said. Expands only when the task genuinely requires it (a dev plan, a detailed file, a research summary)
- **Honest about uncertainty** — never bluffs to fill a gap. If uncertain, searches for the answer. If search doesn't resolve it, says so plainly. "I don't know, sir" is a complete and acceptable answer.

### Identity
- Name: Aelfred (Old English — the name carries the character)
- Written form: Aelf.red
- Icon: Monocle
- Never breaks character to explain it's an AI
- Never apologizes excessively — acknowledges mistakes and moves on
- References memory naturally, the way a person would

---

## Capabilities

### 1. Companion
*Infinite chat with someone who actually knows you*

The core of Aelf.red. An ongoing conversation with no beginning and no end. No session limits, no context windows you have to manage, no re-explaining who you are every time you open the app.

- Infinite persistent chat — one continuous conversation across all time
- Memory retrieval on every message — pulls what's relevant to the current topic automatically
- Knows your businesses, your relationships, your history, your preferences
- Gets more useful the more you use it — memory compounds over time
- No switching tools, no copying context — everything is already here

### 2. Files
*A file system for your ideas, plans, and documents*

Files that belong to Aelf.red, not to individual chats. Create them, edit them collaboratively with Aelfred, find them when you need them. Small edits don't require rewriting the whole thing.

- Files persist across all conversations — not tied to a single chat
- Collaborative editing — tell Aelfred what to change, it changes exactly that
- Finder-style file explorer — browse all your files, search, open, edit
- Aelfred can reference any file in conversation when relevant
- Files are indexed and searchable — Aelfred knows what's in them
- Formats: MD (documents, notes, plans), JSON (structured data), CSV (tabular data)
- Files created and managed by Aelfred — you direct, it executes

### 3. Dev Tool
*Spec to PR without switching tools*

Write a spec in plain language. Aelfred writes a plan. If confidence is below a threshold you review the plan before it executes. An ephemeral server builds and tests. You review the PR. All within Aelf.red, with full context of who you are and what you're building.

- Write a spec in chat — plain language, no special format
- Aelfred produces an execution plan
- Low confidence triggers a review step before execution — you approve or adjust
- Ephemeral DigitalOcean Droplet spins up, executes the plan, runs tests
- Droplet destroyed when done — no idle cost
- PR created in GitHub, reviewed in chat
- Works across all your GitHub repos
- Aelfred knows your codebases, your patterns, your preferences from memory
- Grows over time — learns how you like things built

### 4. Assistant
*Reminders that actually work for an ADHD mind*

Not a task manager. Not a list you ignore. A proactive system that comes to you, keeps coming, and doesn't stop until something is done.

- Capture tasks and reminders conversationally — "remind me to call John tomorrow at 3"
- Persistent nudging — keeps reminding at intervals until you confirm done
- Intelligent timing — reminds you when you're likely to act, not just at the time you set
- Context chaining — "after my 3pm call, remind me to..."
- Snooze or dismiss in chat — "done" or "remind me in 2 hours"
- Push notifications — Aelfred comes to you
- No list to look at — Aelfred tracks it and surfaces it when needed
- Built on Mastra persistent workflows — survives server restarts

### 5. Code Library
*Reusable code, propagated across all your repos automatically*

A personal library of reusable code artifacts — components, skills, rules, prompt templates — stored in a public GitHub repository with full version control. Aelfred manages updates across all consuming repos, resolves conflicts automatically, and only surfaces the ones that need your attention.

**The problem it solves:**
Keeping shared code in sync across multiple repos is tedious. Updating an npm package or git submodule means leaving your current repo, updating the source, merging it in, then pulling it back. Too much overhead for a solo developer with many repos.

**How it works:**
- All library items live in a dedicated public GitHub repo (`joshevensen/aelfred-library`)
- Organized by type: `/components`, `/skills`, `/rules`, `/prompts`
- Git tags and versioning per item — full history, diffing, rollback
- Aelfred knows which repos consume which items via the projects table

**Update propagation:**
- "Push the latest Button component to all my repos" — one instruction
- Aelfred creates branches in each consuming repo, applies the update
- Resolves conflicts automatically using context from memory and codebase knowledge
- Runs tests on each repo
- Merges cleanly passing repos automatically
- Surfaces only repos that fail tests or exceed confidence threshold for your review
- All PR activity visible inside Aelf.red — no switching between repos

**Library items (v1):**
- **Components** — reusable UI components
- **Skills** — reusable agent/AI capabilities
- **Rules** — coding standards, linting rules, conventions
- **Prompts** — reusable prompt templates

**Storage:** Public GitHub repo — version controlled, browsable by others, no extra infrastructure needed. Git is the source of truth, not Spaces.

---

### 6. Get to Know Me
*Aelfred learns who you are — and keeps that knowledge current*

Memory accumulates naturally over time but Get to Know Me jumpstarts it. A structured conversation where Aelfred asks thoughtful questions, listens, and builds a rich understanding of who you are from day one. Not a form — a real conversation.

**Onboarding interview:**
- First time you use Aelf.red, Aelfred conducts an interview
- Asks about your life, work, businesses, relationships, goals, preferences, how you think
- You answer naturally — no forms, no fields to fill out
- Aelfred extracts what it learns and writes it into semantic memory
- 15-20 minutes of conversation seeds months of useful context

**Proactive check-in:**
- Aelfred periodically resurfaces things it thinks it knows and asks if they're still true
- "Last time we talked you were working on X — is that still the case?"
- Triggered automatically every ~30 days for major life context
- Faster cadence for things that change more often like active projects
- Keeps memory accurate rather than stale over time

**Manual check-in:**
- You can trigger a check-in anytime — "let's do a check-in" or `@checkin`
- Useful when something significant has changed in your life
- Or when you just want to give Aelfred new information deliberately
- Aelfred asks follow-up questions, not just a passive data dump

Both write to the same semantic memory layer. The interview jumpstarts it, check-ins keep it accurate.

---



One page. Dark mode only. Chat is the interface.

### Layout
- Chat history fills the page, scrolls vertically
- Chat input fixed at the bottom — always accessible
- File explorer opens as a side panel on desktop (50/50 split), full screen modal on mobile
- Max chat width 600px centered on desktop when no panel is open
- All modals full screen on mobile

### Chat Input
Three rows:
- **Input** — markdown-enabled text area, max 15 lines visible, scrolls beyond
- **Controls** — left: settings icon, file explorer icon — right: paperclip (attachments), submit button
- **Attachments** — single line, horizontal scroll, tag per file with × to remove, only visible when attachments exist

Below the chat input, outside the window, small and muted:
- Left: running cost — today / month (e.g. `$4.34 / $19.37`)
- Right: "Aelf.red isn't perfect and may make mistakes"

### Chat History
- Initial load: last 2-3 days of messages
- Infinite scroll upward loads more in chunks
- Hard cutoff at 73 days — raw messages deleted, memories and files never deleted
- Thinking state: submit disabled, thinking message appears in chat
- Error state: input disabled, chat border turns red, notification explains the error

### File Explorer
- Browse files like Mac Finder
- Search, sort, filter
- Visual mode by default — rendered MD, formatted CSV table, pretty JSON
- Edit mode — toggle to code view, visually obvious when active
- Metadata expandable at bottom of each file — created, modified, size
- No delete in UI — ask Aelfred to delete

### Voice
Deferred. Not needed for v1 — chat covers 99% of use cases. Will revisit when Swift client is built.

### Notifications
Deferred. Will revisit when PWA or Swift client is built.

---

## Design Principles

- **Memory is the product** — the longer you use it, the more valuable it gets
- **One context pool** — every capability draws from the same memory, nothing is siloed
- **Conversation first** — everything happens in chat, no dashboards to navigate
- **Proactive, not passive** — Aelfred comes to you, you don't check in on it
- **AI where necessary, not by default** — use code and algorithms when AI adds no value
- **Concise by default** — output tokens cost more than input tokens; never pad, never repeat, expand only when the task requires it
- **Honest over confident** — search before guessing, admit when unknown rather than hallucinate
- **Transparent by default** — cost always visible, no surprises
- **You own the data** — self-hosted, nothing stored by third parties

---

## Technical Stack

| Layer | Choice |
|---|---|
| Agent framework | Mastra (TypeScript) |
| Web client | React/Next.js + Assistant UI |
| Native client | Swift / SwiftUI (future) |
| Hosting | DigitalOcean Droplet ($12/month to start) |
| Ephemeral compute | DigitalOcean Droplets (Dev Tool builds) |
| LLM routing | DigitalOcean Inference Engine |
| Database | Postgres on DO Volume |
| Vectors | pgvector |
| File storage | DigitalOcean Spaces |
| Auth | Hono JWT — httpOnly cookie |
| Voice | Mastra Voice (future) |
| Browser automation | Mastra Browser / Stagehand (future) |
| Serverless | DigitalOcean Functions (webhooks, background jobs) |

---

## Cost & Optimization

### Infrastructure
| Item | Monthly |
|---|---|
| DO Droplet | ~$12 |
| DO Volume (50GB) | ~$5 |
| DO Spaces (250GB) | ~$5 |
| Domain/SSL | ~$1 |
| **Total fixed** | **~$23** |

### LLM Inference
Target: $10-25/month with good optimization.

Model routing by task type — cheap models for simple tasks, frontier only when reasoning quality matters. DO Inference Router enforces routing policy automatically.

| Task | Model Tier |
|---|---|
| Simple chat, reminders, task capture | Small |
| File editing, plan writing | Mid-tier |
| Complex reasoning, dev planning, sensitive conversations | Frontier |

### Optimization Rules
- Use algorithms not LLMs wherever possible — scheduling logic, command parsing, file operations
- Retrieve only relevant memory chunks per message, not everything
- Summarize long history before including in context
- Cache frequent lookups — profile, active context
- No LLM call for no-LLM commands

### Cost Tracking
One record per LLM call in the `costs` table. Aggregated into today / month totals displayed in the UI.

---

## Inspiration

Tools worth studying before building:

**Vellum** — closest thing to Aelf.red. Open source, persistent memory, proactive reach-outs, multi-channel. Study the memory architecture.

**alfred_** (get-alfred.ai) — overlaps with Assistant capability. Good reference for proactive scheduling UX.

**OpenClaw / Moltbot** — self-hostable agent with plugin ecosystem. Worth studying plugin architecture.

**What doesn't exist yet** — a self-hosted personal AI where memory is the core product and every capability draws from the same context pool. That's the gap Aelf.red fills.
