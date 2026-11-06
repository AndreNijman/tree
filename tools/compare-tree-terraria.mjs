// Tree vs Terraria item comparison engine (research, no production edits).
// Sources:
//  - tools/canonical/items-db.json  — complete Terraria item records (display stats incl. 1.4.5-era IDs; origin/share tracked in the parity folder docs)
//  - test-results/terraria-item-parity-20261102/baseline/tree-items.json — Tree's live catalog extracted in-browser
// Outputs (same folder): matched.json, diff-report.json, flags.md, stage-gaps.md
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const dir = 'test-results/terraria-item-parity-20261102';
mkdirSync(dir, { recursive: true });
const db = JSON.parse(readFileSync('tools/canonical/items-db.json', 'utf8'));
const tree = JSON.parse(readFileSync(dir + '/baseline/tree-items.json', 'utf8'));

const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
// Verified Tree renames → Terraria display names (source: tools/canonical keys).
// REVIEW-tagged entries are best-effort mappings that Sol/wiki must double-check.
const ALIAS = {
  explosivebullet: 'explodingbullet',
  cobaltaxe: 'cobaltwaraxe', mythrilaxe: 'mythrilwaraxe', adamantiteaxe: 'adamantitewaraxe',
  palladiumaxe: 'palladiumwaraxe', orichalcumaxe: 'orichalcumwaraxe', titaniumaxe: 'titaniumwaraxe',
  chlorophyteaxe: 'chlorophytegreataxe',
  silverword: 'silverbroadsword', platinumword: 'platinumbroadsword',
  silversword: 'silverbroadsword', goldsword: 'goldbroadsword',
  tinsword: 'tinbroadsword', leadsword: 'leadbroadsword', tungstensword: 'tungstenbroadsword', platinumsword: 'platinumbroadsword',
  thekraken: 'kraken',
  meteoritepickaxe: 'meteorpickaxe', // master DB omission; wiki page exists
  woodenfishingpole: 'woodfishingpole',
  spinewhip: 'snapthorn', // REVIEW: may actually be Spinal Tap
  ironfishingrod: 'reinforcedfishingpole', // REVIEW
  venomdart: 'poisondart', // REVIEW
  puppy: 'dogwhistle',
  babydinosaur: 'ambermosquito',
  babyeater: 'eatersbone', // vanilla pet item name; Tree renamed the pet itself
};
const TERRARIA_ALIAS = {};

// ---- index Terraria records ----
const terraIndex = { byInternal: Object.create(null), byName: Object.create(null) };
for (const [displayName, records] of Object.entries(db)) {
  const list = Array.isArray(records) ? records : [records];
  for (const rec of list) {
    if (!rec || !rec.internalName) continue;
    (terraIndex.byInternal[norm(rec.internalName)] ||= []).push({ rec, display: displayName });
    (terraIndex.byName[norm(displayName)] ||= []).push({ rec, display: displayName });
  }
}

function pickTerrariaMatch(tItem) {
  // Prefer payload where normalized internalName == normalized Tree display.
  const tName = norm(tItem.name);
  const candidates = [];
  const tKey = ALIAS[tName];
  for (const target of tKey ? [tKey, tName] : [tName]) {
    const gens = [];
    let a = terraIndex.byInternal[target]; if (a) gens.push(...a);
    let b = terraIndex.byName[target]; if (b) gens.push(...b.filter(x => !a || a.every(y => y.rec !== x.rec)));
    for (const gen of gens) candidates.push(gen);
  }
  if (candidates.length) {
    const filtered = candidates.filter(c => !/^fake|^new|^placeholder/i.test(c.rec.internalName));
    const pool = filtered.length ? filtered : candidates;
    // Non-Fake / original item: lower internal id generally beats variant duplicates.
    pool.sort((x, y) => (x.rec.id || 0) - (y.rec.id || 0));
    return pool[0];
  }
  return null;
}

const COMBAT_TYPES = ['melee', 'ranged', 'magic', 'summonstaff', 'sentrystaff', 'whip', 'fishingrod', 'hook', 'mount', 'pet', 'lightpet', 'ammo', 'tool'];
const SPECIAL_FIELDS = ['meleeMode', 'meleeProj', 'meleeRainProj', 'proj', 'projSpeed', 'projLife', 'projCount', 'projSpread', 'projHoming', 'projBounces', 'projReturn', 'returnSpeed', 'splitOnHit', 'splitCount', 'splitDamageMul', 'flailDuration', 'spearDuration', 'yoyoDuration', 'controlledSpeed', 'controlledReach', 'controlledDuration', 'channelRange', 'channelManaInterval', 'magicMode', 'terrainMode', 'terrainCount', 'terrainHeight', 'zoneHeight', 'piranha', 'piranhaDmgPerPulse', 'deployProj', 'deployCount', 'deployInterval', 'deployDuration', 'extraProjCount', 'extraProjHoming', 'extraDamageMul', 'extraBounces', 'whipBolt', 'whipBoltDamage', 'tagDamage', 'tagDuration', 'tagExplosive', 'hitCooldown', 'persistentProj', 'projectileOnly', 'lifeSteal', 'explosive', 'spread', 'minion', 'auto'];

const rows = [], unmatched = [], specialReview = [];
for (const t of tree.items) {
  const isCombat = COMBAT_TYPES.includes(t.type);
  if (!isCombat) continue;
  const match = pickTerrariaMatch(t);
  if (!match) { unmatched.push(t); continue; }
  const rec = match.rec, flags = [];
  const add = (field, treeVal, terraVal, units) => flags.push({ field, tree: treeVal, terraria: terraVal, note: units });
  if (t.dmg != null && rec.damage != null && t.dmg !== rec.damage) add('damage', t.dmg, rec.damage, 'flat');
  const treeTicks = t.speed != null ? Math.round(t.speed * 60 * 10) / 10 : null;
  if (treeTicks != null) {
    const animMatch = rec.useAnimation != null && treeTicks === rec.useAnimation;
    const timeMatch = rec.useTime != null && treeTicks === rec.useTime;
    if (!animMatch && !timeMatch) add('speed', treeTicks + ' ticks', (rec.useAnimation != null ? rec.useAnimation : '?') + ' useAnimation / ' + (rec.useTime != null ? rec.useTime : '?') + ' useTime', 'ticks');
    else if (rec.useTime !== rec.useAnimation) flags.push({ field: 'speed-note', tree: treeTicks + ' ticks (matches ' + (animMatch ? 'useAnimation' : 'useTime') + ')', terraria: 'useTime ' + rec.useTime + ' != useAnimation ' + rec.useAnimation, note: 'multi-shot cadence' });
  }
  if (t.kb != null && rec.knockBack != null && t.kb !== rec.knockBack) add('knockback', t.kb, rec.knockBack, 'flat');
  if (t.mana != null && rec.mana != null && t.mana !== rec.mana) add('mana', t.mana, rec.mana, 'flat');
  // Auto-reuse: Tree treats held input as continuous for ordinary weapons; Terraria is per-item.
  const treeAuto = t.auto === undefined ? true : !!t.auto;
  if (rec.autoReuse !== undefined && treeAuto !== rec.autoReuse) add('autoReuse', treeAuto ? 'held repeat' : 'no repeat', rec.autoReuse ? 'autoReuse' : 'manual per use', 'behavior');
  // Ammo compatibility category
  if (t.ammo && rec.useAmmo == null) add('ammo', t.ammo, '(no useAmmo)', 'category');
  if (!t.ammo && t.type === 'ranged' && rec.useAmmo != null) add('ammo', '(none)', rec.useAmmo, 'category');
  // Crit: Tree has no per-item crit field; Terraria shows one above the 4% base.
  if (rec.crit != null && rec.crit > 4) flags.push({ field: 'crit', tree: '(no field; engine base 4%)', terraria: '+' + (rec.crit - 4) + '% over base', note: 'bonus crit' });
  // Tool power: Tree uses one flat `power` number; `hammer:true` marks hammer-class tools.
  if (t.type === 'tool' && t.power != null) {
    if (t.hammer) { if (rec.hammer != null && t.power !== rec.hammer) add('hammer power', t.power, rec.hammer, 'power'); }
    else if (rec.pick != null && t.power !== rec.pick) add('pick power', t.power, rec.pick, 'power');
  }
  // Hook reach/speed, armor defense etc. deferred to notes review; record presence query.
  const review = SPECIAL_FIELDS.filter(f => t[f] !== undefined);
  if (review.length) specialReview.push({ tree: t, match, review });
  rows.push({ treeId: t.id, name: t.name, type: t.type, terrariaId: rec.id, terrariaName: match.display, internalName: rec.internalName, flags, all: { dmg: rec.damage, useTime: rec.useTime, useAnimation: rec.useAnimation, autoReuse: rec.autoReuse, mana: rec.mana, crit: rec.crit, knockBack: rec.knockBack, useAmmo: rec.useAmmo } });
}

// ---- Stage bucket for Terraria-only weapons (name heuristics; refined later per wiki) ----
function stageGuess(name) {
  const s = String(name || '').toLowerCase();
  if (/(zenith|terragrim|lunar|stardust|vortex|nebula|solar|last prism|celestial pillar)/.test(s)) return 'lunar era';
  if (/(plantera|spectre|shroomite|meowmere|star wrath|empress|duke fishron|priestess|mourning| pumpking|frost queen|mothron|butcher|psi)/.test(s)) return 'post-mech/plantera era';
  if (/(cobalt|mythril|palladium|orichalcum|adamantite|titanium|frostbrand|crystal storm|aqua sanction|tier)/.test(s)) return 'early hardmode (mechanical bosses)';
  if (/(demon|crimson|shadow|meteor|molten|hell|night|dungeon|of grass|bee|triangle|posh|deadly realm)/.test(s)) return 'entering late pre-hardmode';
  return 'starter / early pre-hardmode';
}
const terraOnly = { melee: [], ranged: [], magic: [], summon: [], bossSummon: [], fishingrod: [], mount: [] };
const treeNames = new Set(tree.items.map(t => norm(t.name)));
const treeInternal = new Set(tree.items.map(t => norm(t.id)));
for (const [displayName, records] of Object.entries(db)) {
  const list = Array.isArray(records) ? records : [records];
  for (const rec of list) {
    if (!rec || /^fake_|^new|^placeholder/i.test(rec.internalName || '')) continue;
    const cat = rec.melee ? 'melee' : rec.ranged ? 'ranged' : rec.magic ? 'magic' : (rec.summon || rec.sentry || rec.DD2Summon) ? 'summon' : rec.makeNPC ? 'bossSummon' : rec.fishingPole ? 'fishingrod' : rec.mountType ? 'mount' : null;
    if (!cat) continue;
    const key = norm(rec.internalName);
    if (treeNames.has(norm(displayName)) || treeInternal.has(key) || treeInternal.has(norm(displayName))) continue;
    (terraOnly[cat]).push({ name: displayName, id: rec.id, internalName: rec.internalName, stage: stageGuess(displayName), damage: rec.damage, useTime: rec.useTime, useAnimation: rec.useAnimation, autoReuse: rec.autoReuse });
  }
}
for (const list of Object.values(terraOnly)) list.sort((a, b) => (a.id || 0) - (b.id || 0));

// ---- roll-ups ----
const counts = { compared: rows.length, flagged: rows.filter(r => r.flags.length).length, unmatched: unmatched.length, specialReview: specialReview.length, byFlagField: {} };
for (const r of rows) for (const f of r.flags) { const key = f.field.split('-')[0]; counts.byFlagField[key] = (counts.byFlagField[key] || 0) + 1; }
const flagRows = rows.filter(r => r.flags.length);

const report = { generated: new Date().toISOString(), counts, terraOnlyCounts: Object.fromEntries(Object.entries(terraOnly).map(([k, v]) => [k, v.length])) };
writeFileSync(dir + '/diff-report.json', JSON.stringify(report, null, 2));
writeFileSync(dir + '/matched.json', JSON.stringify({ rows: rows.map(r => ({ name: r.name, type: r.type, terrariaName: r.terrariaName, internalName: r.internalName, flags: r.flags, all: r.all })) }, null, 1));
writeFileSync(dir + '/special-review.json', JSON.stringify(specialReview.map(x => ({ name: x.tree.name, type: x.tree.type, review: x.review, def: Object.fromEntries(Object.entries(x.tree).filter(([k]) => SPECIAL_FIELDS.includes(k))) })), null, 1));
writeFileSync(dir + '/terraria-only.json', JSON.stringify(terraOnly, null, 1));
writeFileSync(dir + '/unmatched-tree.json', JSON.stringify(unmatched.map(u => ({ name: u.name, type: u.type })), null, 1));

// flags.md (combat deltas condensed)
let md = '# Tree vs Terraria — flagged stat/behavior deltas\n\nGenerated ' + report.generated + ' from Tree baseline extraction and tools/canonical/items-db.json. Offensive stats from Terraria records; Tree values are the live extraction. Functional/per-item mechanics are collected separately under wiki-notes/.\n\nCompared rows: ' + counts.compared + ' · flagged: ' + counts.flagged + ' · unmatched Tree items: ' + counts.unmatched + ' · items needing mechanics review (special fields): ' + counts.specialReview + '\n\nFlag counts: ' + JSON.stringify(counts.byFlagField) + '\n\nTerraria-only counts: ' + JSON.stringify(report.terraOnlyCounts) + '\n\n## Flagged rows\n';
for (const r of flagRows) {
  md += '\n**' + r.name + '** (' + r.type + ') ↔ Terraria ' + r.terrariaName + ' (' + (r.internalName || '') + ')\n';
  for (const f of r.flags) md += '- ' + f.field + ': Tree ' + (f.tree ?? '(no field)') + ' vs Terraria ' + (f.terraria ?? '(none)') + (f.note ? ' — ' + f.note : '') + '\n';
}
writeFileSync(dir + '/flags.md', md);

// stage-gaps.md
let gaps = '# Terraria items absent from Tree (weapons/tools etc.)\n\nStage labels are name heuristics, to be refined against the wiki before Sol applies anything.\n\n';
for (const [cat, list] of Object.entries(terraOnly)) {
  if (!list.length) continue;
  gaps += '## ' + cat + ' (' + list.length + ')\n';
  let byStage = {};
  for (const rec of list) { (byStage[rec.stage] ||= []).push(rec); }
  for (const [stage, recs] of Object.entries(byStage)) gaps += '\n### ' + stage + ' (' + recs.length + ')\n' + recs.map(r => '- ' + r.name + (r.damage != null ? ' — dmg ' + r.damage + ', use ' + (r.useTime ?? r.useAnimation) + (r.autoReuse ? ', auto' : '') : '')).join('\n') + '\n';
}
writeFileSync(dir + '/stage-gaps.md', gaps);
console.log('compare: %d/%d flagged, %d unmatched, specialReview %d — files in %s', counts.flagged, counts.compared, counts.unmatched, counts.specialReview, dir);
