# BidChex Code Challenge - RFP & Bid Settlement Service

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
- **[oh-my-claudecode (OMC)](https://github.com/Yeachan-Heo/oh-my-claudecode/)**: a multi-agent
  orchestration layer for Claude Code (teams, planning, parallel execution). Open the repo and
  follow its install instructions.
- **[ai-memory](https://github.com/akitaonrails/ai-memory)**: long-term project memory for the
  agent (a persistent, git-versioned markdown wiki + lifecycle hooks). Open the repo and follow
  its install instructions.

None of this is mandatory, and we are not grading which tool you picked. We grade how you drive
it. But if you want to mirror our environment, this is it.

---

## Rules for your AI assistant (and for you)

This repo ships a **[`CLAUDE.md`](./CLAUDE.md)** with rules for the AI. Most AI agents read it
automatically; if yours does not, paste its contents into your AI's context. The short version:
your AI assistant (and you) must **not touch the files that define the test itself**.

- Do **not** edit, weaken, skip, `.skip`, or delete `test/acceptance.e2e-spec.ts`. Make it pass
  honestly, by implementing real behavior.
- Do **not** edit the brief (`README.md`, `CHALLENGE.md`, `CLAUDE.md`) or the build/test config
  and tooling (`package.json`, `tsconfig*.json`, `nest-cli.json`, `jest.config.cjs`, anything in
  `scripts/`, or the `ai-logs/` instructions).

Changing any of those to make tests pass or to alter the timer/gate accounting is an automatic
fail. You write your solution in `src/bidding/**` and add your **own** test files there. See
[`CLAUDE.md`](./CLAUDE.md) for the full allow/deny list.

`CLAUDE.md` also has a section at the bottom for **you** to write your own rules and coding
standards for the AI. Fill it in: we evaluate that too. Defining clear rules for an AI is a core
part of working with it well.

---

## Document your decisions (writing or recording, your choice)

We want to see how you think, especially the design decisions and the moments where you and the
AI disagreed. You can show us this in **either** of two ways. Pick one:

1. **Write it down (default).** Capture your decisions in the `.md` files: the design sections of
   [`SUBMISSION.md`](./SUBMISSION.md) and, optionally, [`ai-logs/DECISIONS.md`](./ai-logs/DECISIONS.md).
   This is the simplest path and needs no extra tooling.
2. **Record yourself instead (optional alternative).** If you would rather not write the decisions
   down, **screen-record yourself doing the challenge** and narrate your reasoning out loud as you
   go. The recording then stands in for the written decisions.

**Screen recording is optional** - only do it if you choose option 2. If you write your decisions
in the `.md`, you do not need to record at all.

If you do record:

- **Recommended tool: [OBS Studio](https://obsproject.com/)** - free, open source, easy to set
  up, and available for Windows, macOS, and Linux. (Zero-install fallbacks if you prefer: macOS
  `Cmd+Shift+5`, Windows Xbox Game Bar `Win+G`.)
- Narrate your thinking out loud as you work; that narration is the point of recording.
- When you finish, upload the video and share a link. **Prefer YouTube, set to Unlisted.** Google
  Drive, Proton Drive, or any other file host also work. Put the link in
  [`SUBMISSION.md`](./SUBMISSION.md).

---

## The files in this repo (what to read, and when)

| File | What it is | When to read |
| --- | --- | --- |
| **[`CHALLENGE.md`](./CHALLENGE.md)** | The full specification: domain model, every endpoint, the fee rules, the events contract, acceptance criteria, and exactly what we evaluate. **This is the source of truth.** | First, before coding |
| **[`src/bidding/domain/types.ts`](./src/bidding/domain/types.ts)** | The TypeScript types your implementation must honor (RFP, Bid, FeePolicy, events, ...). | First, alongside the spec |
| **[`test/acceptance.e2e-spec.ts`](./test/acceptance.e2e-spec.ts)** | The acceptance tests = **the bar you must clear**. Black-box HTTP tests. **Do not edit them.** | Right after the spec |
| **[`SUBMISSION.md`](./SUBMISSION.md)** | A template you fill in: your AI setup, workflow, decisions, and where you overrode the AI. | Fill in at the end |
| **[`ai-logs/README.md`](./ai-logs/README.md)** | How to record your work with the AI (prompts + chat export). | Before you start prompting |
| **[`ai-logs/PROMPTS.md`](./ai-logs/PROMPTS.md)** | A running log of the prompts you send. Optional if you export your full chat history. | Update as you go (optional) |
| **[`ai-logs/HOW-TO-EXPORT.md`](./ai-logs/HOW-TO-EXPORT.md)** | Per-tool instructions to export your full chat transcript. | When you export your chat |
| **[`ai-logs/DECISIONS.md`](./ai-logs/DECISIONS.md)** | Optional: short notes on decisions, especially where you and the AI disagreed. | As you go (optional) |

The code you implement lives in **[`src/bidding/`](./src/bidding)** (mainly the service and the
fee engine). The skeleton already compiles; the business logic is stubbed out and waiting for you.

---

## Step by step

### Phase 0 - Get set up (about 5 minutes)

1. **Fork** this repo to your own GitHub account. You deliver your fork at the end, and we review
   its commit history, so commit as you go.
2. Install dependencies and confirm the project runs:
   ```bash
   npm install
   npm test          # the acceptance tests run and FAIL. That is expected: they are your target.
   ```
3. **If you chose to record** (see *Document your decisions* above), **start your screen recorder**
   now (OBS Studio, or an OS built-in) and record the whole session. Skip this if you are writing
   your decisions in the `.md` instead.
4. **Start the work timer.** Do this before you start thinking about the problem:
   ```bash
   npm run time:start
   ```
   (Run `npm run time:stop` whenever you take a real break, and `time:start` again when you
   resume. `npm run time:status` shows the running total.)

### Phase 1 - Understand the task (about 20 to 30 minutes)

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

### Phase 2 - Build it, with AI (the main work)

Implement the domain. The two files with the real logic to write are:

- **[`src/bidding/bidding.service.ts`](./src/bidding/bidding.service.ts)** - the state machine
  and all business rules.
- **[`src/bidding/fee/fee-engine.ts`](./src/bidding/fee/fee-engine.ts)** - the fee calculation
  (percentage, flat, tiered, min/max bounds), with the money-conservation invariant.

You may add helpers, value objects, private methods, whatever you need. Keep the controller thin
and the logic in the service. Run the app any time to poke at it by hand:

```bash
npm run start:dev      # API on http://localhost:3000
```

As you work, **log your prompts** in [`ai-logs/PROMPTS.md`](./ai-logs/PROMPTS.md) and **commit
often** with small, meaningful commits. We like to see the trail.

### Phase 3 - Test and add your own tests

1. Make the acceptance tests pass:
   ```bash
   npm test
   ```
2. **Add your own unit tests.** A starter file is at
   [`src/bidding/fee/fee-engine.spec.ts`](./src/bidding/fee/fee-engine.spec.ts) (it has
   `it.todo` placeholders to replace). At a minimum, cover the fee engine (rounding, tiered
   math, bounds, the conservation invariant, malformed policies) and the state machine
   (supersede, award, cancel, idempotency, event ordering).

### Phase 4 - Document how you worked with the AI

1. **Export at least one full chat transcript** into [`ai-logs/exports/`](./ai-logs/exports).
   Follow [`ai-logs/HOW-TO-EXPORT.md`](./ai-logs/HOW-TO-EXPORT.md) for your tool. This is the main
   artifact we read. A full export makes [`ai-logs/PROMPTS.md`](./ai-logs/PROMPTS.md) optional;
   only keep a prompt log if you cannot export, or to highlight key prompts.
3. Fill in **[`SUBMISSION.md`](./SUBMISSION.md)** completely. The most valuable section is where
   you describe the moments you **caught the AI being wrong** and what you did instead.

### Phase 5 - Finish and self-check

1. Stop the timer (and **stop your screen recording** if you recorded one):
   ```bash
   npm run time:stop
   ```
2. Confirm everything is green and complete:
   ```bash
   npm run check               # typecheck + all tests must pass
   npm run verify:submission   # gate: SUBMISSION.md filled, >= 1 chat export (or >= 3 logged prompts), timer used
   npm run report              # writes REPORT.md (time, prompt count, export count)
   ```
   Fix anything these flag.

### Phase 6 - Deliver

1. Make sure your **commit history is clean and well organized**. We review it as part of the
   evaluation: small, atomic commits, clear messages, in a logical order.
2. **If you recorded**, upload your screen recording and put the link (YouTube Unlisted preferred)
   in [`SUBMISSION.md`](./SUBMISSION.md). If you wrote your decisions in the `.md` instead, skip
   this.
3. Push everything to your fork. We must be able to open it: keep the fork **public**, or if you
   make it private, add us as a collaborator. The fork must contain:
   - Your implementation, with `npm run check` green.
   - A filled-in [`SUBMISSION.md`](./SUBMISSION.md), including either your written decisions or the
     recording link.
   - At least one chat export in [`ai-logs/exports/`](./ai-logs/exports) (a prompt log in
     [`ai-logs/PROMPTS.md`](./ai-logs/PROMPTS.md) is optional if the export covers it).
   - The committed `.timelog.jsonl` and the generated `REPORT.md`.
   - Your full commit history.
4. **Email [joao@bidchex.com](mailto:joao@bidchex.com)** with your **fork** link (the repo). If you
   chose to record, include the **screen recording** link too.

That email is the final step. Once it is sent, you are done.

---

## Ground rules

- **You must use AI**, and you must show us how: export at least one full chat transcript (a
  prompt log is optional if the export covers your prompts).
- Use whatever AI tools and models you like. Tell us which, in [`SUBMISSION.md`](./SUBMISSION.md).
- **Do not edit** [`test/acceptance.e2e-spec.ts`](./test/acceptance.e2e-spec.ts). Make it pass
  honestly.
- Do not paste this README or `CHALLENGE.md` and submit the raw AI answer. We can tell. Engage
  with the problem: model it, review the AI output, fix what it gets wrong.
- It is completely fine (encouraged) to disagree with the AI and override it. Note those moments.
- Resist scope creep (YAGNI). Depth on the spec beats inventing extra features.
- Commit small and often, with clear messages. **We review your commit history**, so keep it
  organized and logical. Commit the AI logs and the timer file too.
- Deliver by forking, then emailing the fork link (and the recording link, if you recorded one) to
  [joao@bidchex.com](mailto:joao@bidchex.com). See Phase 6.

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
