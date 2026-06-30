# Submission

Fill in every section. Replace each `<!-- FILL ME -->` with your real answer. Be concrete and
honest. This is read alongside your code and your AI logs.

## 0. Screen recording link (optional)

<!-- FILL ME --> (paste a recording link, or write "N/A - decisions documented in writing")

Recording is **optional**. You only need this if you chose to record yourself instead of writing
your decisions down (see *Document your decisions* in the README). If you recorded, paste the link
to your full screen recording here (YouTube Unlisted preferred, or Google Drive / Proton Drive /
any file host; make sure the link is viewable). If you documented your decisions in writing
instead, write "N/A" and make sure sections 2-5 below are thorough.

## 1. Your AI setup

<!-- FILL ME -->
- Which AI tool(s) did you use? (Cursor, Claude Code, Copilot, Windsurf, ChatGPT, ...)
- Which model(s)?
- Any special config: custom rules files, MCP servers, agents, context settings, snippets?
- How did you feed the codebase/spec to the AI (whole repo, files, paste)?

## 2. Your workflow

<!-- FILL ME -->
How did you actually work with the AI step by step? For example: did you have it plan first,
generate per-file, test-drive, review diffs, etc.? What was the loop?

## 3. Key design decisions

<!-- FILL ME -->
Walk us through the important decisions: how you modeled state, how you handled money and
rounding, how you enforced the conservation invariant, how you structured the fee engine,
where you put validation. Why those choices?

## 4. Where you overrode or corrected the AI

<!-- FILL ME -->
The most interesting part. Where did the AI get it wrong, over-engineer, write a silent
fallback, miss an edge case, or produce something you rejected? What did you do instead?
Point to specific prompts in ai-logs/PROMPTS.md or moments in your chat export.

## 5. Trade-offs and what you would do next

<!-- FILL ME -->
What did you deliberately not do (and why)? What would you improve with more time? Any known
weaknesses in your solution?

## 6. How to run it

<!-- FILL ME (or confirm the defaults below are accurate) -->
```bash
npm install
npm run check     # typecheck + tests, should be green
npm run start:dev # API on http://localhost:3000
```

## 7. Time spent

<!-- FILL ME --> (the timer recorded the precise number in REPORT.md; add any context here,
e.g. "1h was setup", "I got stuck on the tiered rounding for ~40m").
