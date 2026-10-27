// Phase-1 catalog pruner: removes ITEMS definitions for ids proven unreachable
// by reach.mjs in the padding classes (block / wall / material). The I token
// map stays intact — only defItem statements are cut — so every I.<TOKEN>
// reference in game code keeps resolving. Safety gates:
//   1. a def is only cut when its id is in reach.json data.unreachableIds AND
//      its declared type is block/wall/material;
//   2. before cutting, the token (I.<TOK>) and the exact id string ('<id>')
//      must not appear anywhere in items.js outside the cut statements, nor in
//      any other js file;
//   3. the result must survive node --check.
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const reach = JSON.parse(readFileSync('test-results/audit2/reach.json', 'utf8'));
const unreachable = new Set(reach.data.unreachableIds);
const src = readFileSync('js/items.js', 'utf8');

// ---------- 1. static parse of the I literal (token -> id value) ----------
const lines = src.split(/\r?\n/);
const litStart = lines.findIndex((l) => /^\s*var I = \{\s*$/.test(l));
if (litStart < 0) throw new Error('I literal start not found');
let litEnd = -1;
for (let i = litStart + 1; i < lines.length; i++) {
  if (/^\};\s*(\/\/.*)?$/.test(lines[i])) { litEnd = i; break; }
}
if (litEnd < 0) throw new Error('I literal end not found');
const tokenMap = new Map();
const unparsed = [];
for (let i = litStart + 1; i < litEnd; i++) {
  const line = lines[i];
  if (!line.trim() || /^\s*\/\//.test(line)) continue;
  const m = /^\s*([A-Z0-9_]+)\s*:\s*['"]([^'\\]*)['"]\s*,?\s*(?:\/\/.*)?$/.exec(line);
  if (m) tokenMap.set(m[1], m[2]);
  else unparsed.push(i + 1);
}
console.log('I literal: lines ' + (litStart + 1) + '-' + (litEnd + 1) + ', parsed tokens=' + tokenMap.size + ', unparsed lines=' + unparsed.length + (unparsed.length ? ' at ' + unparsed.slice(0, 12).join(',') : ''));

// ---------- 2. scan defItem statements (balanced parens, multiline-safe) ----------
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
  const open = at + 'defItem'.length;
  const close = balancedEnd(src, open);
  if (close < 0) throw new Error('unbalanced defItem at index ' + at);
  let end = close + 1;
  const tail = src.slice(end, end + 3);
  if (/^[;][\r\n]/.test(tail)) end += 2; else if (/^;/.test(tail)) end += 1;
  if (/^[\r\n]/.test(src.slice(end, end + 1))) end += (src[end] === '\r' && src[end + 1] === '\n') ? 2 : 1;
  const head = src.slice(at, Math.min(at + 140, close));
  const tokM = /^defItem\(I\.([A-Z0-9_]+)\s*,/.exec(head);
  stmts.push({ at, end, token: tokM ? tokM[1] : null, text: src.slice(at, end) });
  pos = end;
}
console.log('defItem statements scanned: ' + stmts.length);

// ---------- 3. classify candidates ----------
const CUT_TYPES = new Set(['block', 'wall', 'material']);
const cutSet = new Map(); // token -> stmt
const typeCounts = {};
for (const st of stmts) {
  if (!st.token) continue;
  const id = tokenMap.get(st.token);
  const typeM = /type:\s*'([a-z]+)'/.exec(st.text);
  const type = typeM ? typeM[1] : null;
  if (id && unreachable.has(id) && type && CUT_TYPES.has(type)) {
    st.id = id; st.type = type;
    cutSet.set(st.token, st);
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  }
}
console.log('cut candidates: ' + cutSet.size + ' -> ' + JSON.stringify(typeCounts));

// ---------- 4. cross-reference safety gate (token + literal id elsewhere) ----------
const keepSrc = () => {
  const cuts = Array.from(cutSet.values()).sort((a, b) => b.at - a.at);
  let s = src;
  for (const st of cuts) s = s.slice(0, st.at) + s.slice(st.end);
  return s;
};
const otherFiles = [];
for (const f of ['const', 'util', 'audio', 'values', 'world', 'crafting', 'entities', 'bosses', 'player', 'render', 'oldonesarmy', 'achievements', 'net', 'main']) {
  otherFiles.push(readFileSync(path.join('js', f + '.js'), 'utf8'));
}
// defs region = everything from the first defItem statement on; the I literal
// (kept intact) necessarily contains every id as a string, so value checks
// must not look there.
const defsStart = Math.min.apply(null, stmts.filter((st) => st.token).map((st) => st.at));
let pass = 0, stable = false;
while (!stable) {
  stable = true;
  const keep = keepSrc();
  const keepDefs = keep.slice(defsStart); // prefix < defsStart has no cuts, stays aligned
  let changed = 0;
  for (const [tok, st] of cutSet) {
    const tokRef = new RegExp('I\\.' + tok + '\\b|I\\[[\'"]' + tok + '[\'"]\\]');
    const valRef = new RegExp("['\"][^'\"]*" + st.id + "[^'\"]*['\"]");
    // Any game-code I.<TOK> reference can be a definition deref (e.g. a stuck
    // recipe's mat fed to matsHTML → ITEMS[id].name), so a token referenced in
    // ANY file is a keeper. Value-string literals likewise.
    if (tokRef.test(keep) || otherFiles.some((f) => tokRef.test(f)) || valRef.test(keepDefs) || otherFiles.some((f) => valRef.test(f))) {
      cutSet.delete(tok);
      changed++; stable = false;
    }
  }
  pass++;
  if (changed) console.log('pass ' + pass + ': skipped ' + changed + ' candidates (cross-referenced)');
  if (pass > 10) throw new Error('cross-ref gate did not stabilize');
}
console.log('final cut set: ' + cutSet.size);

// ---------- 5. splice & verify ----------
if (cutSet.size === 0) throw new Error('nothing to cut');
const cuts = Array.from(cutSet.values()).sort((a, b) => b.at - a.at);
let out = src;
for (const st of cuts) out = out.slice(0, st.at) + out.slice(st.end);
const remainingStmts = out.split(/defItem\(/).length - 1;
console.log('remaining defItem occurrences: ' + remainingStmts + ' (was ' + (src.split(/defItem\(/).length - 1) + ')');
writeFileSync('js/items.js', out);
const verify = spawnSync('node', ['--check', 'js/items.js']);
if (verify.status !== 0) {
  console.error('node --check FAILED on pruned items.js — restoring');
  writeFileSync('js/items.js', src);
  throw new Error('post-prune syntax check failed');
}
console.log('node --check OK; wrote js/items.js (' + cutSet.size + ' definitions removed)');
console.log('cut breakdown: ' + JSON.stringify(typeCounts));
