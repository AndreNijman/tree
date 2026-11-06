// Resumable Terraria wiki notes fetcher for the item-parity study.
// Route: https://r.jina.ai/<wiki URL> (wiki.gg currently resets direct TLS from this network).
// Rate limited, checkpoints into wiki-notes/manifest.json; safe to re-run / resume later.
// Research only; no production edits, no managed campaigns.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const dir = 'test-results/terraria-item-parity-20261102';
const pagesDir = path.join(dir, 'wiki-notes', 'pages');
mkdirSync(pagesDir, { recursive: true });
const manifestPath = path.join(dir, 'wiki-notes', 'manifest.json');
let manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : { started: new Date().toISOString(), items: [] };
const byName = new Map(manifest.items.map(it => [it.display, it]));

// Queue: matched combat/tool items (identity + stats), special-review set shares most names, terraria-only weapons/fishers, and unmatched verifications.
const wanted = new Map(); // display -> reason
function want(display, reason) {
  if (!display || wanted.has(display)) return;
  wanted.set(display, reason);
}
{
  const matched = JSON.parse(readFileSync(path.join(dir, 'matched.json'), 'utf8'));
  for (const row of matched.rows) want(row.terrariaName, 'matched:' + row.name);
  const terrariaOnly = JSON.parse(readFileSync(path.join(dir, 'terraria-only.json'), 'utf8'));
  for (const cat of ['melee', 'ranged', 'summon', 'fishingrod']) for (const rec of terrariaOnly[cat] || []) want(rec.name, 'terraria-only-' + cat);
  const unmatched = JSON.parse(readFileSync(path.join(dir, 'unmatched-tree.json'), 'utf8'));
  for (const u of unmatched) want(u.name, 'tree-unmatched:' + u.type);
}

const wikiUrl = display => 'https://terraria.wiki.gg/wiki/' + encodeURIComponent(display.replace(/ /g, '_'));
const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');

const sleep = ms => new Promise(r => setTimeout(r, ms));
let consecutiveFailures = 0;
const MAX_CONSECUTIVE_FAIL = 8;
const GAP_MS = Number(process.env.WIKI_GAP_MS || 2600);
const PARALLEL = Number(process.env.WIKI_PARALLEL || 1);
const RETRY_PAUSE_MS = Number(process.env.WIKI_RETRY_PAUSE_MS || 40000);
const RETRIES_PER_PAGE = Number(process.env.WIKI_RETRIES || 5);
let done = 0, failed = 0, skipped = 0, retried = 0;
const list = [...wanted.keys()];

function queueStats() { return { pending: list.filter(d => !(byName.get(d)?.status === 'done')).length }; }

function classify(res, text) {
  if (res.status === 429 || res.status >= 500) return 'rate'; // transient: pause and retry same page
  if (res.status !== 200) return 'hard-' + res.status;
  if (/<title>Just a moment\.\.\.<\/title>|Checking your browser/i.test(text.slice(0, 2000))) return 'challenge';
  return 'ok';
}

// One attempt; returns 'ok' | 'rate' | 'challenge' | 'hard-<code>'.
async function attempt(display, entry) {
  entry.url = wikiUrl(display);
  const res = await fetch('https://r.jina.ai/' + entry.url, { headers: { 'user-agent': 'tree-research/1.0 (item parity study)' } });
  const text = res.status === 200 ? await res.text() : '';
  const kind = classify(res, text);
  if (kind === 'ok') {
    const file = path.join(pagesDir, norm(display) + '.md');
    writeFileSync(file, text);
    entry.status = 'done'; entry.bytes = text.length; entry.fetched = new Date().toISOString();
    delete entry.lastError;
    consecutiveFailures = 0; done++;
    manifest.updated = new Date().toISOString(); writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
  } else {
    entry.status = kind.startsWith('hard-') ? kind : kind === 'rate' ? 'http-' + res.status : kind;
    entry.lastError = kind === 'rate' ? 'reader proxy ' + res.status : kind === 'challenge' ? 'challenge page' : 'status ' + res.status;
  }
  return kind;
}

async function fetchOne(display) {
  const file = path.join(pagesDir, norm(display) + '.md');
  let entry = byName.get(display);
  if (!entry) { entry = { display, file: path.relative(dir, file), attempts: 0 }; byName.set(display, entry); manifest.items.push(entry); }
  if (entry.status === 'done' && existsSync(file)) { skipped++; return; }
  entry.attempts++;
  // Pause-and-retry on transient rate limits before giving up on this page.
  for (let i = 0; i <= RETRIES_PER_PAGE; i++) {
    let kind;
    try { kind = await attempt(display, entry); }
    catch (err) {
      entry.status = 'error';
      entry.lastError = String(err && err.cause && err.cause.code || err.message || err).slice(0, 120);
      kind = 'rate'; // network resets are usually transient too
    }
    if (kind === 'ok') return;
    if (kind !== 'rate' && kind !== 'challenge') break; // permanent: no retry
    retried++;
    await sleep(RETRY_PAUSE_MS + Math.random() * 5000);
  }
  consecutiveFailures++; failed++;
}

async function worker(queue) {
  for (;;) {
    const display = queue.shift();
    if (!display) return;
    if (consecutiveFailures >= MAX_CONSECUTIVE_FAIL) return;
    await fetchOne(display);
    await sleep(GAP_MS + Math.random() * 400);
  }
}

const queue = list.filter(d => byName.get(d)?.status !== 'done');
console.log('wiki fetcher: ' + queue.length + ' pages to fetch (' + (list.length - queue.length) + ' already done), gap ' + GAP_MS + 'ms x' + PARALLEL + ' workers');
const started = Date.now();
await Promise.all(Array.from({ length: PARALLEL }, () => worker(queue)));
manifest.updated = new Date().toISOString();
manifest.finished = new Date().toISOString();
writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
console.log('wiki fetcher done: fetched ' + done + ', skipped ' + skipped + ', failed ' + failed + ', retries ' + retried + ' in ' + Math.round((Date.now() - started) / 1000) + 's; consecutive failures at end: ' + consecutiveFailures + '; remaining: ' + queueStats().pending);
if (consecutiveFailures >= MAX_CONSECUTIVE_FAIL) console.log('STOPPED EARLY on repeated proxy failures — resume later by re-running this script.');
process.exitCode = 0;
