// Parse fetched wiki pages into structured per-item notes (research only).
// Consumes wiki-notes/manifest.json + pages/*.md produced by tools/fetch-item-wiki-notes.mjs.
// Output: wiki-notes/infobox.json (+ verification of tools/canonical/items-db.json values).
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const dir = 'test-results/terraria-item-parity-20261102';
const notesDir = path.join(dir, 'wiki-notes');
const manifest = JSON.parse(readFileSync(path.join(notesDir, 'manifest.json'), 'utf8'));
const db = JSON.parse(readFileSync('tools/canonical/items-db.json', 'utf8'));
const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const dbByName = Object.create(null);
for (const [n, recs] of Object.entries(db)) for (const r of Array.isArray(recs) ? recs : [recs]) (dbByName[norm(n)] ||= []).push(r);
const dbByInternal = Object.create(null);
for (const [n, recs] of Object.entries(db)) for (const r of Array.isArray(recs) ? recs : [recs]) if (r.internalName) dbByInternal[norm(r.internalName)] ||= r;

const rows = [];
for (const entry of manifest.items) {
  if (entry.status !== 'done') { rows.push({ display: entry.display, status: entry.status }); continue; }
  const file = path.join(dir, entry.file);
  let md;
  try { md = readFileSync(file, 'utf8'); } catch { rows.push({ display: entry.display, status: 'missing-page' }); continue; }
  const head = md.slice(0, 20000);
  const grab = re => { const m = head.match(re); return m ? m[1] : null; };
  const grabAll = re => [...head.matchAll(re)].map(m => m[1]);
  // Combined pages (Nail Gun+Nail? Ballista tiers, weapon+ammo) carry several infoboxes;
  // collect ALL numeric rows and verify against any of them.
  const damage = grab(/\|\s*Damage\s*\|\s*([0-9][0-9,]*)/);
  const damageRows = grabAll(/\|\s*Damage\s*\|\s*([0-9][0-9,]*)/g).map(Number);
  const useTime = grab(/\|\s*Use time\s*\|\s*([0-9][0-9,]*)/);
  const useTimeSub = grab(/\|\s*Use time\s*\|\s*([^\n]*sub-[^|]*)/);
  const useTimeRows = grabAll(/\|\s*Use time\s*\|\s*([0-9][0-9,]*)/g).map(Number);
  const knockback = grab(/\|\s*Knockback\s*\|\s*([0-9.]+)/);
  const crit = grab(/Critical chance[^|]*\|[^|]*?(\d+)/) || grab(/\|\s*Critical chance\s*\|\s*(\d+)/);
  const critRows = grabAll(/Critical chance[^|]*\|[^|]*?(\d+)/g).map(Number);
  const autoswing = /autoswing/i.test(head) || /Autoswing/.test(head);
  const demos = [...new Set([...md.matchAll(/terraria\.wiki\.gg\/images\/[^)\s]*demo[^)\s]*\.gif/gi)].map(m => m[0]))];
  const images = [...new Set([...md.matchAll(/terraria\.wiki\.gg\/images\/[^)\s]*?\.(?:gif|png|jpg)/gi)].map(m => m[0]))];
  // First description sentence: first line that isn't an image/heading/table marker.
  let blurb = null;
  for (const line of md.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('!') || t.startsWith('|') || t.startsWith('#') || t.startsWith('[') || /^Title:|^URL Source:|^Markdown Content:/.test(t)) continue;
    if (/^(Terraria |For other|Not to be)/i.test(t)) continue;
    if (t.length > 30) { blurb = t.replace(/\[\]/g, '').slice(0, 400); break; }
  }
  const dbMatch = dbByInternal[norm(entry.display)] || (dbByName[norm(entry.display)] || [])[0];
  const verify = {};
  if (dbMatch) {
    const num = s => s == null ? null : Number(String(s).replace(/,/g, ''));
    // Wiki infobox "Critical chance" is the TOTAL shown in game (base 4 + item bonus);
    // Module:Iteminfo `crit` stores only the item's bonus. Compare totals.
    if (damageRows.length) verify.damage = { wikiRows: damageRows, db: dbMatch.damage, match: damageRows.includes(dbMatch.damage) };
    if (useTimeRows.length) verify.useTime = { wikiRows: useTimeRows, db: dbMatch.useTime ?? dbMatch.useAnimation, match: useTimeRows.includes(dbMatch.useTime ?? dbMatch.useAnimation) };
    if (knockback != null) verify.knockBack = { wiki: num(knockback), db: dbMatch.knockBack, match: num(knockback) === dbMatch.knockBack };
    if (critRows.length) verify.crit = { wikiRows: critRows, dbTotal: (dbMatch.crit ?? 0) + 4, match: critRows.includes((dbMatch.crit ?? 0) + 4) };
    const pageSha = createHash('sha256').update(md).digest('hex').slice(0, 16);
    rows.push({ display: entry.display, url: entry.url, status: 'done', parse: { damage, useTime, useTimeSub, knockback, crit, autoswing }, demos, imageCount: images.length, blurb, dbVerify: verify, pageSha });
  } else {
    rows.push({ display: entry.display, url: entry.url, status: 'done', parse: { damage, useTime, useTimeSub, knockback, crit, autoswing }, demos, imageCount: images.length, blurb, dbVerify: { dbRecord: 'NOT-IN-MASTER-DB' } });
  }
}
const parsedRows = rows.filter(r => r.status === 'done');
const withDb = parsedRows.filter(r => r.dbVerify && !r.dbVerify.dbRecord);
const mismatches = { damage: 0, useTime: 0, knockBack: 0, crit: 0 };
const mismatchExamples = [];
for (const r of withDb) for (const [k, v] of Object.entries(r.dbVerify)) {
  if (k !== 'dbRecord' && v && v.match === false) { mismatches[k]++; if (mismatchExamples.length < 40) mismatchExamples.push({ item: r.display, field: k, wiki: v.wiki ?? v.wikiRows, db: v.db ?? v.dbTotal }); }
}
writeFileSync(path.join(notesDir, 'infobox.json'), JSON.stringify({ parsed: rows.length, dbVerifications: withDb.length, mismatches, mismatchExamples, rows }, null, 1));
console.log('infobox parse: ' + parsedRows.length + ' pages, db verifications ' + withDb.length + ', mismatches ' + JSON.stringify(mismatches));
console.log('pages without master-db record: ' + rows.filter(r => r.dbVerify && r.dbVerify.dbRecord === 'NOT-IN-MASTER-DB').map(r => r.display).join(', ') || '(none)');
