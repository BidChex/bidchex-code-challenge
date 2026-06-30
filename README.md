# BidChex Code Challenge — RFP & Bid Settlement Service

Welcome, and thanks for taking the time. This is a take-home coding challenge. It is
**medium-hard** and is meant to be done **with an AI coding assistant** (Claude Code, Cursor,
GitHub Copilot, Windsurf, ...). Using AI is **required**, not optional.

What we evaluate is **not** "can the AI do it". It is **how you work with the AI and whether you
own the quality of what ships**. The AI writes most of the code; you are responsible for all of
it. We read your submission as if you wrote every line, because by signing off on it, you did.

> **Time budget: roughly 3 to 5 hours.** Going a little over is fine. Quality and clarity beat
> raw speed. We would rather see 70% of the scope done cleanly than 100% done sloppily.

This README walks you through everything, step by step. Read it top to bottom once before you
start. The very last section tells you exactly which commands to run to begin.

---

## What we are evaluating (the three things we look at)

1. **The code.** Does it work, is it correct, is it well designed? Clean domain modeling, money
   that never loses a cent, no silent fallbacks, thin controllers. (See *What we are evaluating*
   in [`CHALLENGE.md`](./CHALLENGE.md) for the exact bar.)
2. **How you used the AI.** We read your prompts and your AI chat history (in
   [`ai-logs/`](./ai-logs)). We want to see your setup, your workflow, and the moments where you
   corrected, rejected, or redirected the AI.
3. **Time.** A lightweight timer records how long you actually worked. Be honest; it is context,
   not a scoreboard.

---

## Before you start (prerequisites)

You need:

- **Node.js 20 or newer** (LTS 20 or 22) and **npm 10+**. Check with `node -v` and `npm -v`.
- **git** (you will commit as you work).
- **An AI coding assistant.** Use whatever you like. See the recommended setup just below.

---

## Recommended AI setup (this is what we use)

You can use any AI tool, but here is the exact stack we run day to day at BidChex. Using it is a
good way to see how you would actually work with us.

- **Agent: [Claude Code](https://www.claude.com/product/claude-code).** Our primary coding
  agent. We strongly recommend it for this challenge.
- **Plan:** we run **Claude Max 20x**. You do **not** need that much for this: a **Max 10x**
  plan is more than enough to finish with headroom to spare. (A regular Pro plan or API credits
  also work; you just have less room.)
- **[oh-my-claudecode (OMC)](https://github.com/Yeachan-Heo/oh-my-claudecode/)** — a multi-agent
  orchestration layer for Claude Code (teams, planning, parallel execution). Install:
  ```bash
  npx oh-my-claude-sisyphus@latest
  ```
  then run `setup omc` (or `/oh-my-claudecode:omc-setup`) inside a Claude Code session.
- **[ai-memory](https://github.com/akitaonrails/ai-memory)** — long-term project memory for the
  agent (a persistent, git-versioned markdown wiki + lifecycle hooks). Quick wire-up for Claude
  Code (see the repo for the full guide):
  ```bash
  ai-memory install-mcp   --client claude-code --apply
  ai-memory install-hooks --agent  claude-code --apply
  ```

None of this is mandatory, and we are not grading which tool you picked. We grade how you drive
it. But if you want to mirror our environment, this is it.

---

## The files in this repo (what to read, and when)

| File | What it is | When to read |
| --- | --- | --- |
| **[`CHALLENGE.md`](./CHALLENGE.md)** | The full specification: domain model, every endpoint, the fee rules, the events contract, acceptance criteria, and exactly what we evaluate. **This is the source of truth.** | First, before coding |
| **[`src/bidding/domain/types.ts`](./src/bidding/domain/types.ts)** | The TypeScript types your implementation must honor (RFP, Bid, FeePolicy, events, ...). | First, alongside the spec |
| **[`test/acceptance.e2e-spec.ts`](./test/acceptance.e2e-spec.ts)** | The acceptance tests = **the bar you must clear**. Black-box HTTP tests. **Do not edit them.** | Right after the spec |
| **[`SUBMISSION.md`](./SUBMISSION.md)** | A template you fill in: your AI setup, workflow, decisions, and where you overrode the AI. | Fill in at the end |
| **[`ai-logs/README.md`](./ai-logs/README.md)** | How to record your work with the AI (prompts + chat export). | Before you start prompting |
| **[`ai-logs/PROMPTS.md`](./ai-logs/PROMPTS.md)** | A running log of the prompts you send. | Update as you go |
| **[`ai-logs/HOW-TO-EXPORT.md`](./ai-logs/HOW-TO-EXPORT.md)** | Per-tool instructions to export your full chat transcript. | When you export your chat |

The code you implement lives in **[`src/bidding/`](./src/bidding)** (mainly the service and the
fee engine). The skeleton already compiles; the business logic is stubbed out and waiting for you.

---

## Step by step

### Phase 0 — Get set up (about 5 minutes)

1. **Fork** this repo (or clone it) to your own **private** GitHub repo.
2. Install dependencies and confirm the project runs:
   ```bash
   npm install
   npm test          # the acceptance tests run and FAIL. That is expected: they are your target.
   ```
3. **Start the work timer.** Do this before you start thinking about the problem:
   ```bash
   npm run time:start
   ```
   (Run `npm run time:stop` whenever you take a real break, and `time:start` again when you
   resume. `npm run time:status` shows the running total.)

### Phase 1 — Understand the task (about 20 to 30 minutes)

1. Read **[`CHALLENGE.md`](./CHALLENGE.md)** fully. It describes the whole flow: create an RFP,
   vendors submit bids, award one bid, optionally cancel, and settle the awarded bid with a
   platform fee. There is a state machine, money math, idempotency, deadlines, an event log, and
   a paginated list endpoint.
2. Skim **[`src/bidding/domain/types.ts`](./src/bidding/domain/types.ts)** to see the exact
   shapes.
3. Open **[`test/acceptance.e2e-spec.ts`](./test/acceptance.e2e-spec.ts)** and read a few tests.
   They show the precise HTTP contract and the edge cases that matter.

This is a great moment to use your AI: have it read the spec and the tests with you, summarize
the rules, and propose a plan. **Review that plan critically before you act on it.**

### Phase 2 — Build it, with AI (the main work)

Implement the domain. The two files with the real logic to write are:

- **[`src/bidding/bidding.service.ts`](./src/bidding/bidding.service.ts)** — the state machine
  and all business rules.
- **[`src/bidding/fee/fee-engine.ts`](./src/bidding/fee/fee-engine.ts)** — the fee calculation
  (percentage, flat, tiered, min/max bounds), with the money-conservation invariant.

You may add helpers, value objects, private methods, whatever you need. Keep the controller thin
and the logic in the service. Run the app any time to poke at it by hand:

```bash
npm run start:dev      # API on http://localhost:3000
```

As you work, **log your prompts** in [`ai-logs/PROMPTS.md`](./ai-logs/PROMPTS.md) and **commit
often** with small, meaningful commits. We like to see the trail.

### Phase 3 — Test and add your own tests

1. Make the acceptance tests pass:
   ```bash
   npm test
   ```
2. **Add your own unit tests.** A starter file is at
   [`src/bidding/fee/fee-engine.spec.ts`](./src/bidding/fee/fee-engine.spec.ts) (it has
   `it.todo` placeholders to replace). At a minimum, cover the fee engine (rounding, tiered
   math, bounds, the conservation invariant, malformed policies) and the state machine
   (supersede, award, cancel, idempotency, event ordering).

### Phase 4 — Document how you worked with the AI

1. Make sure [`ai-logs/PROMPTS.md`](./ai-logs/PROMPTS.md) reflects the prompts you actually sent.
2. **Export at least one full chat transcript** into
   [`ai-logs/exports/`](./ai-logs/exports). Follow
   [`ai-logs/HOW-TO-EXPORT.md`](./ai-logs/HOW-TO-EXPORT.md) for your specific tool.
3. Fill in **[`SUBMISSION.md`](./SUBMISSION.md)** completely. The most valuable section is where
   you describe the moments you **caught the AI being wrong** and what you did instead.

### Phase 5 — Finish and self-check

1. Stop the timer:
   ```bash
   npm run time:stop
   ```
2. Confirm everything is green and complete:
   ```bash
   npm run check               # typecheck + all tests must pass
   npm run verify:submission   # checks SUBMISSION.md, prompts, exports, and timer are all done
   npm run report              # writes REPORT.md (time, prompt count, export count)
   ```
   Fix anything these flag.

### Phase 6 — Hand it back

Push your repo (or send a zip). It must contain:

- Your implementation, with `npm run check` green.
- A filled-in [`SUBMISSION.md`](./SUBMISSION.md).
- [`ai-logs/PROMPTS.md`](./ai-logs/PROMPTS.md) and at least one export in
  [`ai-logs/exports/`](./ai-logs/exports).
- The committed `.timelog.jsonl` and the generated `REPORT.md`.
- Your commit history (small, frequent commits).

---

## Ground rules

- **You must use AI**, and you must show us how (prompts + at least one chat export).
- Use whatever AI tools and models you like. Tell us which, in [`SUBMISSION.md`](./SUBMISSION.md).
- **Do not edit** [`test/acceptance.e2e-spec.ts`](./test/acceptance.e2e-spec.ts). Make it pass
  honestly.
- Do not paste this README or `CHALLENGE.md` and submit the raw AI answer. We can tell. Engage
  with the problem: model it, review the AI output, fix what it gets wrong.
- It is completely fine (encouraged) to disagree with the AI and override it. Note those moments.
- Resist scope creep (YAGNI). Depth on the spec beats inventing extra features.
- Commit small and often. Commit the AI logs and the timer file.

If anything in the spec is genuinely ambiguous, make a reasonable decision, write it down in
`SUBMISSION.md`, and move on. We value good judgment under ambiguity.

---

## You are ready. Start here.

```bash
npm install
npm run time:start
npm test            # watch them fail, then make them pass

# open CHALLENGE.md and src/bidding/domain/types.ts, and begin.
```

Good luck, and have fun with it. We are genuinely looking forward to seeing how you work.
