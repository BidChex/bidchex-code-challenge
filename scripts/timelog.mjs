#!/usr/bin/env node
// Simple, tamper-evident-ish work timer. Append-only log of start/stop events.
// Usage: node scripts/timelog.mjs <start|stop|status>
// Cross-platform (Node only). The log lives at .timelog.jsonl and is committed.

import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LOG = join(ROOT, '.timelog.jsonl');

function readEvents() {
  if (!existsSync(LOG)) return [];
  return readFileSync(LOG, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => JSON.parse(l));
}

function append(event) {
  appendFileSync(LOG, JSON.stringify(event) + '\n', 'utf8');
}

function fmt(ms) {
  const totalMin = Math.round(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${m}m`;
}

/** Returns { totalMs, openStart } summing completed start/stop pairs. */
function summarize(events) {
  let totalMs = 0;
  let openStart = null;
  for (const e of events) {
    if (e.event === 'start') {
      openStart = e.at;
    } else if (e.event === 'stop' && openStart) {
      totalMs += new Date(e.at).getTime() - new Date(openStart).getTime();
      openStart = null;
    }
  }
  return { totalMs, openStart };
}

const cmd = process.argv[2];
const now = new Date().toISOString();
const events = readEvents();
const { totalMs, openStart } = summarize(events);

if (cmd === 'start') {
  if (openStart) {
    console.log(`⚠️  A session is already running (started ${openStart}). Run "stop" first.`);
    process.exit(0);
  }
  append({ event: 'start', at: now });
  console.log(`▶️  Timer started at ${now}. Cumulative so far: ${fmt(totalMs)}.`);
} else if (cmd === 'stop') {
  if (!openStart) {
    console.log('⚠️  No running session. Run "start" first.');
    process.exit(0);
  }
  append({ event: 'stop', at: now });
  const sessionMs = new Date(now).getTime() - new Date(openStart).getTime();
  console.log(`⏹️  Session: ${fmt(sessionMs)}. Total: ${fmt(totalMs + sessionMs)}.`);
} else if (cmd === 'status') {
  const running = openStart ? new Date(now).getTime() - new Date(openStart).getTime() : 0;
  console.log(`Total tracked: ${fmt(totalMs + running)}${openStart ? ' (timer running)' : ''}.`);
} else {
  console.log('Usage: node scripts/timelog.mjs <start|stop|status>');
  process.exit(1);
}
