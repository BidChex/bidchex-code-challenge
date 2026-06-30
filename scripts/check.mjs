#!/usr/bin/env node
// Pre-submission completeness gate. Verifies the deliverables a reviewer expects
// are present and filled. Does NOT run the tests (use `npm run check` for that).
// Run: npm run verify:submission

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const results = [];
const check = (label, ok, hint = '') => results.push({ label, ok, hint });

function read(p) {
  const f = join(ROOT, p);
  return existsSync(f) ? readFileSync(f, 'utf8') : null;
}

// 1. SUBMISSION.md is filled (template markers removed, has real content).
const submission = read('SUBMISSION.md');
const submissionFilled =
  !!submission &&
  submission.length > 600 &&
  !submission.includes('<!-- FILL ME -->') &&
  !/_replace this entire/i.test(submission);
check('SUBMISSION.md filled out', submissionFilled, 'Remove all <!-- FILL ME --> markers and answer every section.');

// 2. Evidence of how you worked with the AI: a chat export (preferred) OR a prompt log.
//    A full chat export makes ai-logs/PROMPTS.md optional.
const exportsDir = join(ROOT, 'ai-logs', 'exports');
const exportCount = existsSync(exportsDir)
  ? readdirSync(exportsDir).filter((f) => !f.startsWith('.') && f !== 'README.md').length
  : 0;
const prompts = read('ai-logs/PROMPTS.md');
const promptCount = prompts
  ? prompts.split('\n').filter((l) => /^##\s+/.test(l) && !/\bTEMPLATE\b/i.test(l)).length
  : 0;
check(
  'AI work shown: >= 1 chat export (preferred) OR >= 3 logged prompts',
  exportCount >= 1 || promptCount >= 3,
  'Export your AI chat into ai-logs/exports/ (see ai-logs/HOW-TO-EXPORT.md). That alone is enough; otherwise log >= 3 prompts in ai-logs/PROMPTS.md.',
);

// 4. Timer used (at least one completed start/stop pair).
const log = read('.timelog.jsonl');
let pairs = 0;
if (log) {
  let open = false;
  for (const l of log.split('\n').filter(Boolean)) {
    const e = JSON.parse(l);
    if (e.event === 'start') open = true;
    else if (e.event === 'stop' && open) {
      pairs += 1;
      open = false;
    }
  }
}
check('Work timer used (npm run time:start / time:stop)', pairs >= 1, 'Run "npm run time:start" before working and "npm run time:stop" after.');

// Report
let allOk = true;
console.log('\nSubmission completeness:\n');
for (const r of results) {
  console.log(`  ${r.ok ? '✅' : '❌'} ${r.label}`);
  if (!r.ok && r.hint) console.log(`     ↳ ${r.hint}`);
  if (!r.ok) allOk = false;
}
console.log('');
if (allOk) {
  console.log('All completeness checks passed. Now run `npm run check` to confirm typecheck + tests are green, then `npm run report`.');
  process.exit(0);
} else {
  console.log('Some checks failed. Fix the items above before submitting.');
  process.exit(1);
}
