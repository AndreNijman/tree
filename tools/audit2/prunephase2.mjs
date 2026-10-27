// Phase-2 catalog pruner — REPORT mode (default) / EXECUTE mode (--execute).
// Targets the remaining unreachable rare/named classes (melee, armor, tools,
// accessories, magic, summon staves, vanity, consumables, hooks, dyes, ammo,
// pets, ranged, fishing rods) flagged by reach.mjs after the Phase-1 prune.
// Report mode lists every candidate per type with its name and, where obvious,
// a family grouping (vanilla ladder names, variant stacks, placeholder stubs)
// so a reviewer can decide wire-vs-cut per class. Execute mode cuts only the
// types enabled in CUT_ENABLED with the same cross-reference gates as
// prunephase1.mjs.
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const EXECUTE = process.argv.includes('--execute');
// Bootstrap: read lib-machinery shared with prunephase1 (token literal parse +
// statement scan + gates). Trim to the executed types only.
const reach = JSON.parse(readFileSync('test-results/audit2/reach.json', 'utf8'));
const unreachable = new Set(reach.data.unreachableIds);
const src = readFileSync('js/items.js', 'utf8');

// ---------- token literal ----------
const lines = src.split(/\r?\n/);
const litStart = lines.findIndex((l) => /^\s*var I = \{\s*$/.test(l));
let litEnd = -1;
for (let i = litStart + 1; i < lines.length; i++) if (/^\};\s*(\/\/.*)?$/.test(lines[i])) { litEnd = i; break; }
const tokenMap = new Map();
for (let i = litStart + 1; i < litEnd; i++) {
  if (!lines[i].trim() || /^\s*\/\//.test(lines[i])) continue;
  const m = /^\s*([A-Z0-9_]+)\s*:\s*['"]([^'\\]*)['"]\s*,?\s*(?:\/\/.*)?$/.exec(lines[i]);
  if (m) tokenMap.set(m[1], m[2]);
}

// ---------- def statements ----------
function balancedEnd(s, openIdx) {
  let depth = 0, inStr = null;
  for (let i = openIdx; i < s.length; i++) {
    const c = s[i];
    if (inStr) {
      if (c === '\\') { i++; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '\'' || c === '"') inStr = c;
    else if (c === '(') depth++;
    else if (c === ')') { depth--; if (depth === 0) return i; }
  }
  return -1;
}
const stmts = [];
let pos = 0;
for (;;) {
  const at = src.indexOf('defItem(', pos);
  if (at < 0) break;
  const close = balancedEnd(src, at + 8 - 1);
  if (close < 0) break;
  let end = close + 1;
  const tail = src.slice(end, end + 3);
  if (/^;[\r\n]/.test(tail)) end += 2; else if (/^;/.test(tail)) end += 1;
  if (/^[\r\n]/.test(src.slice(end, end + 1))) end += (src[end] === '\r' && src[end + 1] === '\n') ? 2 : 1;
  const head = src.slice(at, Math.min(at + 140, close));
  const tokM = /^defItem\(I\.([A-Z0-9_]+)\s*,/.exec(head);
  stmts.push({ at, end, token: tokM ? tokM[1] : null, text: src.slice(at, end) });
  pos = end;
}

// ---------- classify remaining unreachable ----------
const rows = [];
for (const st of stmts) {
  if (!st.token) continue;
  const id = tokenMap.get(st.token);
  if (!id || !unreachable.has(id)) continue;
  const nameM = /name:\s*'([^']*)'/.exec(st.text);
  const typeM = /type:\s*'([a-z]+)'/.exec(st.text);
  rows.push({ id: id, token: st.token, name: nameM ? nameM[1] : st.token, type: typeM ? typeM[1] : '?', at: st.at, end: st.end, text: st.text });
}
const byType = {};
for (const r of rows) (byType[r.type] = byType[r.type] || []).push(r);
const order = ['melee', 'armor', 'tool', 'accessory', 'magic', 'summonstaff', 'vanity', 'consumable', 'hook', 'dye', 'ammo', 'pet', 'ranged', 'fishingrod', 'material', 'block', 'wall', '?'];
console.log('remaining unreachable: ' + rows.length);
for (const t of order) {
  if (!byType[t]) continue;
  const list = byType[t];
  console.log('\n== ' + t.toUpperCase() + ' (' + list.length + ') ==');
  const names = list.map(function (r) { return r.name; });
  // show up to 40 names, compressed via family prefixes
  const shown = names.slice(0, 40);
  console.log(shown.join(' · ') + (names.length > 40 ? '  …' : ''));
}
writeFileSync(path.join('test-results', 'audit2', 'phase2review.json'), JSON.stringify({ generatedAt: new Date().toISOString(), remainingUnreachable: rows.length, byType: Object.fromEntries(Object.entries(byType).map(([k, v]) => [k, v.map((r) => ({ id: r.id, name: r.name }))])) }, null, 2));
console.log('\nfull review list → test-results/audit2/phase2review.json');

if (!EXECUTE) {
  console.log('\n(report mode — rerun with --execute after the wire/cut decision per class)');
} else {
  // executes later once classes are decided; same splice + gates as phase 1
  throw new Error('execute mode not wired yet in this pass');
}
