#!/usr/bin/env node
// Generates REPORT.md: total tracked time, git activity span, prompt count, and
// exported-chat count. Gives the reviewer a precise, at-a-glance picture of how
// the challenge was done. Run: node scripts/ai-report.mjs

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function fmt(ms) {
  const totalMin = Math.round(ms / 60000);
  return `${Math.floor(totalMin / 60)}h ${totalMin % 60}m`;
}

function trackedTime() {
  const log = join(ROOT, '.timelog.jsonl');
  if (!existsSync(log)) return { totalMs: 0, sessions: 0, hasOpen: false };
  const events = readFileSync(log, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => JSON.parse(l));
  let totalMs = 0;
  let sessions = 0;
  let open = null;
  for (const e of events) {
    if (e.event === 'start') open = e.at;
    else if (e.event === 'stop' && open) {
      totalMs += new Date(e.at).getTime() - new Date(open).getTime();
      sessions += 1;
      open = null;
    }
  }
  return { totalMs, sessions, hasOpen: Boolean(open) };
}

function gitSpan() {
  const run = (cmd) =>
    execSync(cmd, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
  try {
    const first = run('git log --reverse --format=%cI').split('\n')[0]?.trim();
    const last = run('git log -1 --format=%cI').trim();
    const count = Number(run('git rev-list --count HEAD').trim());
    if (!first || !last) return null;
    const spanMs = new Date(last).getTime() - new Date(first).getTime();
    return { first, last, count, spanMs };
  } catch {
    return null; // not a git repo yet, or no commits
  }
}

function countPrompts() {
  const f = join(ROOT, 'ai-logs', 'PROMPTS.md');
  if (!existsSync(f)) return 0;
  // Count "## " headers that are not the template placeholder.
  return readFileSync(f, 'utf8')
    .split('\n')
    .filter((l) => /^##\s+/.test(l) && !/\bTEMPLATE\b/i.test(l)).length;
}

function countExports() {
  const dir = join(ROOT, 'ai-logs', 'exports');
  if (!existsSync(dir)) return 0;
  return readdirSync(dir).filter((f) => !f.startsWith('.') && f !== 'README.md').length;
}

const t = trackedTime();
const g = gitSpan();
const prompts = countPrompts();
const exportsN = countExports();

const lines = [];
lines.push('# Challenge Report');
lines.push('');
lines.push(`_Generated ${new Date().toISOString()}_`);
lines.push('');
lines.push('## Time');
lines.push(`- Tracked working time: **${fmt(t.totalMs)}** across ${t.sessions} session(s)${t.hasOpen ? ' (a timer is still running, run `npm run time:stop`)' : ''}.`);
if (g) {
  lines.push(`- First commit: ${g.first}`);
  lines.push(`- Last commit: ${g.last}`);
  lines.push(`- Commits: ${g.count}, wall-clock span first→last: ${fmt(g.spanMs)}.`);
  if (t.totalMs > 0 && g.spanMs > 0) {
    const ratio = (t.totalMs / g.spanMs) * 100;
    lines.push(`- Tracked time is ${ratio.toFixed(0)}% of the commit span (sanity check; large gaps are normal for breaks).`);
  }
} else {
  lines.push('- No git history found (initialize git and commit as you work for a richer report).');
}
lines.push('');
lines.push('## AI usage');
lines.push(`- Logged prompts in ai-logs/PROMPTS.md: **${prompts}**`);
lines.push(`- Exported chat files in ai-logs/exports/: **${exportsN}**`);
lines.push('');
lines.push('> This report is informational. The reviewer reads SUBMISSION.md, the code, the tests, and the AI logs together.');
lines.push('');

const out = lines.join('\n');
writeFileSync(join(ROOT, 'REPORT.md'), out, 'utf8');
console.log(out);
console.log('\n✅ Wrote REPORT.md');
