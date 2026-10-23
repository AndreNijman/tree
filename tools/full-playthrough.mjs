// Accelerated progression integration test, NOT an unassisted playthrough.
// Grants materials/HP, teleports and injects boss damage; verifies bookkeeping.
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';

const DIR = path.join(process.cwd(), 'test-results');
try { mkdirSync(DIR, { recursive: true }); } catch {}
const ART = path.join(DIR, 'full-playthrough');
try { mkdirSync(ART, { recursive: true }); } catch {}

const issues = [];   // { severity, stage, text, count }
const notes = [];
const errCounts = new Map();
const startedAt = new Date().toISOString();
const startedTime = Date.now();
const seed = Number(process.env.SEED || 7357);
let stage = 'boot';

function issue(sev, text) {
  const key = sev + '|' + stage + '|' + text;
  const prev = errCounts.get(key);
  if (prev) { prev.count++; return; }
  const rec = { severity: sev, stage, text, count: 1 };
  errCounts.set(key, rec);
  issues.push(rec);
  console.log(`[${sev}] (${stage}) ${text}`);
}
function note(text) { notes.push(text); console.log(`[note] (${stage}) ${text}`); }

const browser = await chromium.launch({ args: ['--no-sandbox', '--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on('pageerror', e => {
  errors.push('PAGE: ' + e.message + ' | ' + String(e.stack || '').replace(/\s+/g, ' ').slice(0, 300));
  issue('error', 'Page error: ' + e.message + ' @ ' + String(e.stack || '').split(/\n\s*/).slice(1, 2).join(' ').trim());
});
page.on('console', msg => {
  if (msg.type() === 'error' && !msg.text().includes('_guard/')) {
    errors.push('CONSOLE: ' + msg.text());
    issue('error', 'Console error: ' + msg.text());
  }
});

try {
await page.goto('file:///' + process.cwd().replace(/\\/g, '/') + '/index.html');
await page.waitForTimeout(800);
// Keep the menu creation flow, but override only its first build's seed.
await page.evaluate(seed => {
  var original = buildGame;
  buildGame = function(_, evil, difficulty) {
    buildGame = original;
    return original(seed, evil, difficulty);
  };
}, seed);

// ============ WORLD CREATION VIA REAL UI ============
stage = 'menu';
try {
  await page.waitForSelector('#btn-new', { state: 'visible', timeout: 5000 });
  await page.click('#btn-new');
  await page.waitForSelector('#world-create:not(.hidden)', { timeout: 3000 });
  await page.fill('#world-name', 'Full Run');
  await page.locator('#btn-create').click();
  await page.waitForFunction(() => game && game.started && game.player);
  await page.waitForFunction(() => !document.getElementById('loading').classList.contains('overlay-visible'), { timeout: 30000 });
} catch (e) { throw new Error('Could not create a world via the UI: ' + e.message); }

await page.evaluate(() => { AudioSys.enabled = false; });

// helpers injected once
await page.evaluate(() => {
  window.__FW = function(n, sample) {
    var finite = true, who = '';
    for (var i = 0; i < n; i++) {
      step(1 / 60);
      if (sample && i % 60 === 0) {
        for (var k = 0; k < game.entities.length; k++) {
          var e = game.entities[k];
          if (!e) continue;
          var bad = !Number.isFinite(e.x) || !Number.isFinite(e.y) ||
            (e.hp !== undefined && !Number.isFinite(e.hp) && typeof e.hp === 'number');
          if (bad) { finite = false; who += ' [type=' + e.type + ' boss=' + (e.boss || '-') + ' name=' + (e.name || '-') + ' x=' + e.x + ' hp=' + e.hp + ']'; }
        }
        if (!Number.isFinite(game.player.x) || !Number.isFinite(game.player.y)) { finite = false; who += ' [PLAYER]'; }
        if (!Number.isFinite(game.cam.x) || !Number.isFinite(game.cam.y)) { finite = false; who += ' [CAM]'; }
      }
    }
    return { finite, who };
  };
  window.__inv = function(id) {
    var n = 0, s = game.player.inventory.slots;
    for (var i = 0; i < s.length; i++) if (s[i] && s[i].id === id) n += s[i].count;
    return n;
  };
  window.__mod = function(id, count) { return game.player.inventory.addStack({ id: id, count: count }); };
  window.__clearMobs = function() {
    game.entities = game.entities.filter(function(e) { return e === game.player || e.friendly || e.dead; });
  };
  window.__resetPlayer = function() {
    var p = game.player;
    p.hp = p.maxHp = 1000; p.dead = p.dying = false; p.respawnT = 0; p.invuln = 999999;
    p.vx = 0; p.vy = 0;
    document.getElementById('deathscreen').classList.add('hidden');
  };
  window.__collectPickups = function() {
    var n = 0;
    game.pickups.slice().forEach(function(pk) {
      if (!ITEMS[pk.item]) { n++; return; } // count invalid as misses
      game.player.x = pk.x; game.player.y = pk.y - 4;
      for (var f = 0; f < 40; f++) step(1 / 60);
    });
    return n;
  };
  window.__dropsValid = function() {
    var bad = [];
    game.pickups.forEach(function(pk) { if (pk.item && !ITEMS[pk.item]) bad.push(pk.item); });
    return { ok: bad.length === 0, bad: bad };
  };
  window.__craftByName = function(name) {
    var r = RECIPES.find(function(x) { return x.name === name; });
    if (!r) return 'no-recipe';
    return craftRecipe(game, r) ? 'crafted' : 'blocked';
  };
});

async function finiteFramesCheck(n, label) {
  const r = await page.evaluate((n) => window.__FW(n, true), n);
  if (!r.finite) issue('critical', label + ': non-finite state during simulation:' + r.who);
  return r;
}
async function checkDrops(label) {
  const d = await page.evaluate(() => window.__dropsValid());
  if (!d.ok) issue('error', label + ': invalid pickups spawned (unknown item ids): ' + d.bad.join(','));
}
function collectInvalid(label) {
  return page.evaluate(() => window.__collectPickups()).then(n => {
    if (n > 0) issue('error', label + ': ' + n + ' invalid/unknown item drops skipped');
  });
}

async function killBoss(bossKey, maxFrames, hitAfter) {
  const r = await page.evaluate((key) => {
    var boss = game.entities.filter(e => e.boss === key && !e.dead && !e.armType);
    if (!boss.length) return { found: false };
    return { found: true, hp: boss[0].hp, name: boss[0].name };
  }, bossKey);
  if (!r.found) return r;
  // real sim frames with invulnerable player, auto-attack at the boss
  for (let i = 0; i < maxFrames; i += 120) {
    await page.evaluate((key) => {
      var p = game.player; p.invuln = 999999;
      var bosses = game.entities.filter(e => e.boss === key && !e.dead && !e.armType);
      if (bosses.length) { MOUSE.wx = bosses[0].x; MOUSE.wy = bosses[0].y; MOUSE.down = true; }
      window.__FW(120, true);
      MOUSE.down = false;
    }, bossKey);
  }
  await page.evaluate((dmg) => {
    var bosses = game.entities.filter(e => e.boss && !e.dead && !e.armType);
    bosses.forEach(e => game.hitBoss(e, e.maxHp * dmg, e.x, e.y));
    updateBossBars();
  }, hitAfter);
  await page.evaluate(() => window.__FW(90, true));
  return r;
}

async function bossBarsCleared(label) {
  const bars = await page.evaluate(() => game.bossBars.filter(b => b.boss && !b.boss.dead).length);
  if (bars > 0) issue('error', label + ': ' + bars + ' boss bar(s) still active after defeat');
}
async function defeated(key) {
  return page.evaluate((key) => !!game.bossesDefeated[key], key);
}
const snap = (name) => page.screenshot({ path: path.join(ART, name + '.png') });

// ============ STAGE 1: SPAWN & FIRST MINUTES ============
stage = '1-spawn';
{
  const info = await page.evaluate(() => {
    var p = game.player, w = game.world;
    return { x: p.x, y: p.y, hp: p.hp, maxHp: p.maxHp, spawnX: w.spawnX, spawnY: w.spawnY,
      ground: p.onGround, inv: p.inventory.slots.filter(s => s).map(s => s.id + 'x' + s.count),
      W: w.W, H: w.H, seedOk: typeof w.evil === 'string' };
  });
  if (Math.abs(info.x - info.spawnX) > 50 || Math.abs(info.y - info.spawnY) > 50) issue('error', 'Player does not spawn at world spawn point');
  if (info.hp !== 100 || info.maxHp !== 100) issue('error', 'New player HP is not 100/100');
  if (!info.seedOk) issue('error', 'World evil biome not initialized');

  // chop a real tree (TREETRUNK tiles)
  const treeT = await page.evaluate(() => {
    var w = game.world, s = { tx: -1, ty: -1 };
    var tx0 = Math.floor(game.player.x / 16), ty0 = Math.floor(game.player.y / 16);
    for (var dy = -20; dy < 8; dy++) for (var dx = -50; dx < 50; dx++) {
      if (dx === 0 && dy >= -1 && dy <= 1) continue;
      var t = w.get(tx0 + dx, ty0 + dy);
      if (t === T.TREETRUNK) { s.tx = tx0 + dx; s.ty = ty0 + dy; break; }
    }
    return s.tx >= 0 ? s : null;
  });
  if (treeT) {
    const pre = await page.evaluate(() => window.__inv('wood'));
    await page.evaluate((t) => {
      var p = game.player;
      p.x = t.tx * 16 - 30; p.y = (t.ty) * 16 - 8;
      var axe = p.inventory.slots.findIndex(s => s && ITEMS[s.id] && ITEMS[s.id].axe !== undefined);
      if (axe >= 0) p.inventory.selected = axe;
    }, treeT);
    for (let i = 0; i < 10; i++) {
      await page.evaluate((t) => { MOUSE.wx = t.tx * 16 + 8; MOUSE.wy = t.ty * 16 + 8; MOUSE.down = true; window.__FW(60, false); }, treeT);
    }
    await page.evaluate(() => { MOUSE.down = false; });
    const post = await page.evaluate(() => window.__inv('wood'));
    if (post === pre) issue('error', 'Chopping a TREETRUNK with the starting axe yields no wood (player adjacent at 30px, 600 frames of mining)');
    else note('tree chopped: wood +' + (post - pre));
  } else issue('error', 'No TREETRUNK found near spawn');
  await collectInvalid('spawn');
}

// ============ STAGE 2: CRAFTING REAL PATH ============
stage = '2-crafting';
{
  const res = await page.evaluate(() => {
    var out = {};
    // chop wood directly for real crafting
    var r = {};
    [['Workbench', 'workbench'], ['Torch x4', 'torch'], ['Wooden Sword', 'woodsword'], ['Wooden Chair', 'chair']].forEach(function(p) {
      out[p[0]] = window.__craftByName(p[0]);
    });
    return out;
  });
  note('starter crafting availability: ' + JSON.stringify(res));

  // Special station recipes place directly beside the player (no item stack).
  const placed = await page.evaluate(() => {
    window.__mod('wood', 50);
    var r = window.__craftByName('Workbench');
    game.world.nearbyStations = game.world.findStations(game.player.x, game.player.y);
    return { craft:r, placedOk:game.world.nearbyStations.indexOf(T.WORKBENCH) >= 0 };
  });
  note('grant wood -> Workbench: ' + JSON.stringify(placed));
  if (placed.craft === 'blocked') issue('error', 'Workbench uncraftable even with 50 wood in inventory');
  if (placed.craft === 'crafted' && !placed.placedOk) issue('error', 'Workbench crafted but cannot be placed on flat ground');
  if (placed.placedOk) {
    const torch = await page.evaluate(() => window.__craftByName('Torch x4'));
    if (torch !== 'crafted') issue('error', 'Torch x4 uncraftable with wood');
  }
  await collectInvalid('crafting');
}

// ============ STAGE 3: ORE TIER (grant ore, craft bars & gear at stations) ============
stage = '3-oretier';
{
  const res = await page.evaluate(() => {
    var out = {};
    out.anvil = window.__craftByName('Anvil');  // without iron bars → expect blocked
    window.__mod(I.IRONBAR, 20);
    out.anvilWithBars = window.__craftByName('Anvil');
    game.world.nearbyStations = game.world.findStations(game.player.x, game.player.y);
    out.coppersword = window.__craftByName('Copper Sword');
    window.__mod(I.COPPERBAR, 20);
    out.coppersword2 = window.__craftByName('Copper Sword');
    // smelting at furnace if one exists in world near spawn? grant bars instead confirmed.
    return out;
  });
  note('ore-tier crafting: ' + JSON.stringify(res));
  if (res.anvilWithBars !== 'crafted') issue('error', 'Anvil uncraftable with iron bars at a workbench');
  if (res.coppersword === 'crafted') issue('error', 'Copper Sword crafted with NO copper bars granted (recipe not consuming materials properly)');
  if (res.coppersword2 === 'blocked') issue('error', 'Copper Sword uncraftable with 20 copper bars near anvil');
  await collectInvalid('oretier');
}

// ============ STAGE 4: NIGHT ENAMIES & CONTACT ============
stage = '4-night';
{
  await page.evaluate(() => { game.timeOfDay = 0.95; window.__clearMobs(); window.__resetPlayer(); });
  const r = await page.evaluate(() => {
    var pre = game.entities.filter(e => !e.friendly && !e.dead && e.dmg > 0).length;
    window.__FW(600, false);
    var post = game.entities.filter(e => !e.friendly && !e.dead && e.dmg > 0).length;
    return { pre, post };
  });
  if (r.post === 0) issue('error', 'No hostile enemies spawn during a full night window');
  else note('night hostiles: ' + r.post);

  const contact = await page.evaluate(() => {
    var p = game.player, w = game.world;
    window.__clearMobs();
    window.__resetPlayer(); // never compare damage across an earlier death/respawn
    // A temporary flat arena isolates contact damage from cliffs and holes.
    var tx = Math.floor(w.spawnX / TILE) + 30, gy = w.surfaceY[tx], saved = [];
    for (var x = tx - 5; x <= tx + 8; x++) for (var y = gy - 6; y <= gy; y++) {
      var i = w.idx(x, y);
      saved.push({ i:i, t:w.tiles[i], hp:w.hp[i] });
      w.tiles[i] = y === gy ? T.STONE : T.AIR;
      w.hp[i] = y === gy ? 60 : 0;
    }
    try {
      p.x = tx * TILE + 8; p.y = gy * TILE - p.h / 2;
      p.vx = p.vy = 0; p.invuln = 0;
      var z = spawnEntity(game, E.ZOMBIE, p.x + 40, gy * TILE - ENT_DEF[E.ZOMBIE].h / 2);
      if (!z) return { spawned: false };
      var preHp = p.hp;
      window.__FW(300, false);
      return { spawned: true, preHp, postHp: p.hp, hurt: p.hp < preHp, zAlive: !z.dead, zDist: Math.round(Math.max(Math.abs(z.x - p.x), Math.abs(z.y - p.y))) };
    } finally {
      saved.forEach(s => { w.tiles[s.i] = s.t; w.hp[s.i] = s.hp; });
      w.dirty = true;
    }
  });
  if (!contact.spawned) issue('error', 'Could not spawn a zombie for contact test');
  else if (!contact.hurt) issue('error', 'Zombie contact in flat arena dealt no damage: ' + JSON.stringify(contact));
  else note('zombie contact: hurt=' + contact.hurt + ' finalDist=' + contact.zDist);
  await page.evaluate(() => { window.__clearMobs(); window.__resetPlayer(); });
  await collectInvalid('night');
}

// ============ STAGE 5: EYE OF CTHULHU ============
stage = '5-eye';
{
  await page.evaluate(() => { window.__resetPlayer(); window.__clearMobs(); game.timeOfDay = 0.95;
    var r = RECIPES.find(x => x.name === 'Suspicious Looking Eye'); if (r) window.__mod(I.LENS, 20); });
  const eyeRecipe = await page.evaluate(() => window.__craftByName('Suspicious Looking Eye'));
  note('Suspicious Looking Eye craft: ' + eyeRecipe);
  await page.evaluate(() => game.spawnBoss('eyeofcthulhu'));
  const fight = await killBoss('eyeofcthulhu', 240, 5);
  if (!fight.found) issue('critical', 'Eye of Cthulhu did not spawn via spawnBoss');
  if (!await defeated('eyeofcthulhu')) issue('critical', 'Eye of Cthulhu defeat not recorded');
  await collectInvalid('eye'); await checkDrops('eye'); await bossBarsCleared('eye');
  await finiteFramesCheck(120, 'eye aftermath');
}

// ============ STAGE 6: EVIL BOSS ============
stage = '6-eow';
{
  const evilKey = await page.evaluate(() => game.world.evil === 'crimson' ? 'brainofcthulhu' : 'eaterofworlds');
  await page.evaluate(() => { window.__resetPlayer(); window.__clearMobs(); });
  await page.evaluate((k) => game.spawnBoss(k), evilKey);
  await killBoss(evilKey, 300, 5);
  const def = await page.evaluate((k) => !!game.bossesDefeated[k], evilKey);
  if (!def) issue('critical', evilKey + ' defeat not recorded');
  const hard = await page.evaluate(() => game.hardmode);
  if (hard) issue('critical', 'Evil boss defeat enabled Hardmode (must require WoF)');
  await collectInvalid('eow');
}

// ============ STAGE 7: SKELETRON + DUNGEON RULES ============
stage = '7-skeletron';
{
  const pre = await page.evaluate(() => {
    var w = game.world;
    return { open: w.dungeonOpen, entrance: !!w.dungeonEntrance, rect: !!w.dungeonRect, doors: (w.dungeonDoors || []).length };
  });
  note('dungeon state pre-kill: ' + JSON.stringify(pre));
  if (pre.doors === 0) issue('error', 'Dungeon has no gate doors registered');
  if (pre.open) issue('critical', 'Dungeon open before Skeletron defeated');

  // Verify spawn, chase, live despawn, lethal contact, and reward-free death.
  const guardian = await page.evaluate(() => {
    var w = game.world;
    if (!w.dungeonRect || w.dungeonOpen) return { skipped: true };
    var r = w.dungeonRect;
    window.__resetPlayer();
    window.__clearMobs();
    game.player.x = Math.floor((r.x0 + r.x1) / 2) * TILE;
    game.player.y = Math.floor((r.y0 + r.y1) / 2) * TILE;
    updateDungeonGuardian();
    var found = game.entities.find(e => !e.dead && e.type === E.DUNGEONGUARDIAN);
    var hits;
    if (found) {
      var beforeDist = dist(found.x, found.y, game.player.x, game.player.y);
      for (var f = 0; f < 30; f++) enemyStep(found, game);
      hits = { chased: dist(found.x, found.y, game.player.x, game.player.y) < beforeDist };
      game.player.x = w.spawnX; game.player.y = w.spawnY;
      updateDungeonGuardian();
      hits.despawned = !game.entities.some(e => !e.dead && e.type === E.DUNGEONGUARDIAN);
      game.player.x = Math.floor((r.x0 + r.x1) / 2) * TILE;
      game.player.y = Math.floor((r.y0 + r.y1) / 2) * TILE;
      updateDungeonGuardian();
      found = game.entities.find(e => !e.dead && e.type === E.DUNGEONGUARDIAN);
      found.x = game.player.x; found.y = game.player.y; found.dmgCd = 0;
      game.player.invuln = 0;
      enemyStep(found, game);
      hits.lethalContact = game.player.dying;
      game.respawn();
      var killsBefore = game.kills, pickupsBefore = game.pickups.length;
      var bestiaryBefore = JSON.stringify(game.bestiary);
      hitEntity(found, 999999, 0, 0, game);
      hits.died = found.dead;
      hits.killsAfter = game.kills - killsBefore;
      hits.rewards = game.pickups.length !== pickupsBefore || JSON.stringify(game.bestiary) !== bestiaryBefore;
    }
    window.__resetPlayer();
    window.__clearMobs();
    return { skipped: false, found: !!found, ...(hits || {}) };
  });
  if (guardian.skipped) note('dungeon guardian probe skipped (no rect)');
  else if (!guardian.found) issue('critical', 'Entering the pre-kill Dungeon did not summon a Dungeon Guardian');
  else if (!guardian.chased || !guardian.lethalContact) issue('error', 'Dungeon Guardian chase/contact failed: ' + JSON.stringify(guardian));
  else if (guardian.killsAfter !== 0 || guardian.rewards) issue('error', 'Dungeon Guardian granted kill/bestiary/loot rewards');
  else if (!guardian.despawned) issue('error', 'Dungeon Guardian did not despawn when the player left the Dungeon');
  else note('dungeon guardian: spawned, chased, lethal contact, live despawn, reward-free scripted death');

  await page.evaluate(() => { window.__resetPlayer(); window.__clearMobs(); });
  await page.evaluate(() => game.spawnBoss('skeletron'));
  await killBoss('skeletron', 300, 5);
  if (!await defeated('skeletron')) issue('critical', 'Skeletron defeat not recorded');
  const postOpen = await page.evaluate(() => game.world.dungeonOpen);
  if (!postOpen) issue('critical', 'Skeletron defeated but dungeon remained closed');
  await collectInvalid('skeletron');
}

// ============ STAGE 8: QUEEN BEE / KING SLIME / DEERCLOPS ============
stage = '8-miscbosses';
for (const id of ['queenbee', 'kingslime', 'deerclops']) {
  await page.evaluate(() => { window.__resetPlayer(); window.__clearMobs(); });
  await page.evaluate((i) => game.spawnBoss(i), id);
  const f = await killBoss(id, 240, 5);
  if (!f.found) issue('critical', id + ' did not spawn via spawnBoss');
  if (!await defeated(id)) issue('critical', id + ' defeat not recorded');
  await collectInvalid(id);
}
await finiteFramesCheck(180, 'misc aftermath');

// ============ STAGE 9: HELL AND WALL OF FLESH ============
stage = '9-wof';
{
  const hell = await page.evaluate(() => {
    var w = game.world, got = { ash: 0, hellstone: 0, lava: 0 };
    for (var x = 0; x < w.W; x += 9) for (var y = w.H - 60; y < w.H; y += 3) {
      var t = w.get(x, y);
      if (t === T.ASH) got.ash++;
      else if (t === T.HELLSTONE) got.hellstone++;
      else if (t === T.LAVA) got.lava++;
    }
    return got;
  });
  note('underworld tile sanity: ' + JSON.stringify(hell));
  if (hell.hellstone === 0) issue('critical', 'No Hellstone exists anywhere in the Underworld scan');
  if (hell.lava === 0) issue('error', 'No lava in the Underworld');

  await page.evaluate(() => { var w = game.world;
    game.player.x = w.W / 2 * 16; game.player.y = (w.H - 45) * 16; window.__resetPlayer(); window.__clearMobs(); });
  await page.evaluate(() => game.spawnBoss('wallofflesh'));
  const f = await killBoss('wallofflesh', 400, 5);
  if (!f.found) issue('critical', 'Wall of Flesh did not spawn via spawnBoss');
  await page.evaluate(() => window.__FW(300, true));
  const skipped = await collectInvalid('wof');
  const post = await page.evaluate(() => ({
    hardmode: !!game.hardmode, pwnDrop: game.pickups.some(p => p.item === I.PWHAMMER) || game.player.inventory.countOf(I.PWHAMMER) > 0
  }));
  if (!post.hardmode) issue('critical', 'WoF defeated but Hardmode did not enable');
  if (!post.pwnDrop) issue('error', 'WoF defeated but Pwnhammer neither in drops nor inventory');
  await finiteFramesCheck(240, 'wof aftermath');
}

// ============ STAGE 10: HARDMODE TRANSITION ============
stage = '10-hardmode-transition';
{
  const alt = await page.evaluate(() => {
    var w = game.world, found = { cobalt: 0, mythril: 0, adamantite: 0, palladium: 0, orichalcum: 0, titanium: 0, chlorophyte: 0 };
    for (var x = 0; x < w.W; x += 3) for (var y = 0; y < w.H; y += 3) {
      var t = w.get(x, y);
      if (t === T.COBALT) found.cobalt++;
      else if (t === T.MYTHRIL) found.mythril++;
      else if (t === T.ADAMANTITE) found.adamantite++;
      else if (t === T.PALLADIUM) found.palladium++;
      else if (t === T.ORICHALCUM) found.orichalcum++;
      else if (t === T.TITANIUM) found.titanium++;
      else if (t === T.CHLOROPHYTE) found.chlorophyte++;
    }
    return found;
  });
  issueIfZero('Cobalt', alt.cobalt);
  issueIfZero('Mythril', alt.mythril);
  issueIfZero('Adamantite', alt.adamantite);
  issueIfZero('Palladium', alt.palladium);
  issueIfZero('Orichalcum', alt.orichalcum);
  issueIfZero('Titanium', alt.titanium);
  issueIfZero('Chlorophyte', alt.chlorophyte);
  note('hardmode ore counts: ' + JSON.stringify(alt));
  function issueIfZero(name, n) { if (n === 0) issue('critical', 'No ' + name + ' ore generated after WoF defeat'); }

  const spread = await page.evaluate(() => ({ frontier: (game.world.spreadFrontier || []).length, halPos: !!game.world.dungeonRect }));
  if (spread.frontier === 0) issue('error', 'Hardmode biome spread frontier empty after WoF');
  // altar smashing
  const altar = await page.evaluate(() => {
    var w = game.world;
    if (!w.altars || !w.altars.length) return { n: 0 };
    var a = w.altars[0];
    var before = game.altarsSmashed;
    w.breakTile(a.x, a.y);
    game.onSpecialTileBroken(a.t || T.ALTAR, a.x, a.y);
    return { n: w.altars.length, deltaSmashed: game.altarsSmashed - before };
  });
  note('scripted altar-break hook: ' + JSON.stringify(altar));
  if (altar.deltaSmashed !== 1) issue('error', 'Altar-break hook did not increment the smash counter');
  await finiteFramesCheck(240, 'hardmode transition');
}

// ============ STAGE 11: MECH BOSSES ============
stage = '11-mechs';
for (const id of ['twins', 'destroyer', 'skeletronprime']) {
  await page.evaluate(() => { window.__resetPlayer(); window.__clearMobs(); });
  await page.evaluate((i) => game.spawnBoss(i), id);
  // Skeletron Prime's entity key and bossesDefeated key are 'skelprime';
  // 'skeletronprime' is only the spawnBoss id. killBoss must scan by the
  // entity key or the fight silently reports "did not spawn".
  const key = id === 'skeletronprime' ? 'skelprime' : id;
  const f = await killBoss(key, 400, 5);
  if (!f.found) issue('critical', id + ' did not spawn via spawnBoss');
  if (!await defeated(key)) issue('critical', id + ' defeat not recorded');
  await collectInvalid(id);
  await finiteFramesCheck(120, id + ' aftermath');
}
  if (!await page.evaluate(() => !!game.mechDone)) issue('critical', 'Defeating all three mechs does not set mechDone');

// ============ STAGE 12: PLANTERA (registered bulb proximity) ============
stage = '12-plantera';
{
  const bulb = await page.evaluate(() => {
    var w = game.world;
    var list = w.planteraBulbs || [];
    var verified = 0, misses = 0, first = null;
    list.slice(0, 10).forEach(b => {
      // bulb registry stores PIXEL coords; convert to tile coords
      var tx = Math.floor(b.x / TILE), ty = Math.floor(b.y / TILE);
      if (w.get(tx, ty) === T.PLANTERABULB) { verified++; if (!first) first = { tx, ty }; }
      else misses++;
    });
    return { count: list.length, verified, misses, first };
  });
  if (bulb.count === 0) issue('error', 'No Plantera bulbs registered or generated in hardmode world');
  else if (bulb.verified === 0) issue('error', 'Registered bulb positions do not contain bulb tiles: ' + JSON.stringify(bulb));
  else note('bulbs verified: ' + bulb.verified + '/' + bulb.count);

  await page.evaluate(b => {
    if (!b) return;
    game.player.x = b.tx * TILE - 25; game.player.y = b.ty * TILE;
    window.__resetPlayer();
    window.__FW(60, false);
    if (game.world.get(b.tx, b.ty) !== T.AIR) throw new Error('Approached bulb was not cleared');
  }, bulb.first);
  const spawned = await page.evaluate(() => game.entities.filter(e => e.boss === 'plantera' && !e.dead).length);
  if (spawned === 0) issue('critical', 'Approaching a registered Plantera bulb does not spawn Plantera');
  const f = await killBoss('plantera', 400, 5);
  if (!await defeated('plantera')) issue('critical', 'Plantera defeat not recorded');
  await collectInvalid('plantera');
}

// ============ STAGE 13: GOLEM ============
stage = '13-golem';
{
  await page.evaluate(() => { window.__resetPlayer(); window.__clearMobs(); });
  await page.evaluate(() => game.spawnBoss('golem'));
  await killBoss('golem', 400, 5);
  const def = await page.evaluate(() => ({ golem: !!game.bossesDefeated.golem, ready: !!game.cultistRitualReady }));
  if (!def.golem) issue('critical', 'Golem defeat not recorded');
  if (!def.ready) issue('error', 'Golem defeat does not make Cultist ritual ready');
  await collectInvalid('golem');
}

// ============ STAGE 14: FISHING ============
stage = '14-fishing';
{
  const fish = await page.evaluate(() => {
    var w = game.world, water = 0;
    for (var y = 0; y < w.hellY; y++) {
      if (w.get(2, y) === T.WATER) water++;
      if (w.get(w.W - 3, y) === T.WATER) water++;
    }
    var rodRecipe = RECIPES.filter(r => { var it = ITEMS[r.result]; return it && /fishing|fishingpole|fishingrod/i.test(it.id + '|' + r.name); }).length;
    return { waterTilesAtEdges: water, rodRecipes: rodRecipe, W: w.W, H: w.H };
  });
  if (fish.waterTilesAtEdges < 5) issue('error', 'No water at world edges — ocean biome missing? counts: ' + JSON.stringify(fish));
  if (fish.rodRecipes === 0) issue('error', 'No fishing rod recipes');
  await finiteFramesCheck(180, 'fishing idle');
}

// ============ STAGE 15: CULTIST -> PILLARS ============
stage = '15-cultist';
{
  await page.evaluate(() => { window.__resetPlayer(); window.__clearMobs(); });
  await page.evaluate(() => game.spawnBoss('cultist'));
  await killBoss('cultist', 400, 5);
  const pillars = await page.evaluate(() => ({
    cult: !!game.bossesDefeated.cultist,
    list: (game.lunarPillars || []).filter(e => !e.dead).length
  }));
  if (!pillars.cult) issue('critical', 'Cultist defeat not recorded');
  if (pillars.list !== 4) issue('critical', 'Cultist defeat did not create 4 lunar pillars (got ' + pillars.list + ')');

  const pillarHit = await page.evaluate(() => {
    var pillars = (game.lunarPillars || []).filter(e => !e.dead);
    if (!pillars.length) return { skip: true };
    var p = pillars[0]; p.shieldHp = 0; p.shieldDown = true;
    var before = p.hp;
    projHitEnemy({ x: p.x, y: p.y, type: P.BULLET, dmg: 500, owner: 'player', dead: false });
    return { damaged: p.hp < before };
  });
  if (!pillarHit.skip && !pillarHit.damaged) issue('error', 'Exposed lunar pillar cannot be damaged by projectiles');

  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => {
      var pillars = (game.lunarPillars || []).filter(e => !e.dead);
      if (!pillars.length) return;
      var p = pillars[0]; p.shieldHp = 0; p.shieldDown = true;
      for (var k = 0; k < 60; k++) game.onEnemyKilled({ type: p.pillarEnemies[0], x: p.x, y: p.y });
      game.hitBoss(p, p.maxHp * 5, p.x, p.y);
      updateBossBars();
    });
    await page.evaluate(() => window.__FW(120, true));
  }
  const dest = await page.evaluate(() => game.pillarsDestroyed);
  if (dest < 4) issue('critical', 'Lunar pillars cannot all be destroyed (only ' + dest + '/4)');
  await collectInvalid('pillars');
}

// ============ STAGE 16: MOON LORD & VICTORY ============
stage = '16-moonlord';
{
  await page.evaluate(() => { window.__resetPlayer(); window.__clearMobs(); });
  await page.evaluate(() => game.spawnBoss('moonlord'));
  const ml = await page.evaluate(() => game.entities.filter(e => e.boss === 'moonlord' && !e.dead).length);
  if (ml === 0) issue('critical', 'Moon Lord did not spawn after pillars destroyed');
  await killBoss('moonlord', 600, 5);
  await page.evaluate(() => window.__FW(300, true));
  const end = await page.evaluate(() => ({
    victory: !!game.victory,
    ml: !!game.bossesDefeated.moonlord,
    lastPrism: game.pickups.some(p => p.item === I.LASTPRISM) || game.player.inventory.slots.some(s => s && s.id === 'lastprism')
  }));
  if (!end.victory) issue('critical', 'Defeating Moon Lord does not trigger victory');
  if (!end.ml) issue('error', 'Moon Lord defeat not recorded');
  if (!end.lastPrism) issue('error', 'Moon Lord dropped no Last Prism');
  await collectInvalid('moonlord');
  await snap('s16-victory');
  await bossBarsCleared('moonlord');
}

// ============ STAGE 17: FINAL AUDIT ============
stage = '17-finish';
{
  const final = await page.evaluate(() => ({
    ach: Object.keys(Achievements.unlocked || {}).length,
    bosses: Object.keys(game.bossesDefeated || {}).filter(k => game.bossesDefeated[k]).length,
    maxHp: game.player.maxHp,
    hardmode: !!game.hardmode
  }));
  if (final.ach === 0) issue('error', 'No achievements unlocked during the entire playthrough');
  note('final: achievements=' + final.ach + ' bossesDefeated=' + final.bosses + ' maxHp=' + final.maxHp);

  const perf = await page.evaluate(() => {
    var t0 = performance.now();
    for (var i = 0; i < 600; i++) step(1 / 60);
    return (performance.now() - t0) / 600;
  });
  if (perf > 16.6) issue('error', 'Sim too slow for 60 FPS: ' + perf.toFixed(2) + ' ms/frame');
  else note('performance: ' + perf.toFixed(2) + ' ms/frame');

  // save/load roundtrip via real autosave & fresh session load
  const before = await page.evaluate(async () => {
    // Silent saves may return an older in-flight save; drain it first, then
    // explicitly save the current state and check the persisted record.
    if (saveInFlight) await saveInFlight;
    var saved = await saveGame(false);
    var rec = await getWorldRecord(activeWorldId);
    return { id:activeWorldId, hardmode:!!game.hardmode, bosses:JSON.stringify(game.bossesDefeated), mech:!!game.mechDone, victory:!!game.victory,
      saved:saved, persisted:rec && JSON.stringify(rec.data.progress.bossesDefeated) === JSON.stringify(game.bossesDefeated) };
  });
  if (!before.saved || !before.persisted) issue('error', 'Final save failed or persisted stale progress: ' + JSON.stringify(before));
  // reload and resume through the real menu: after a reload the menu is up
  // and `game` is null, so the world must be loaded via the world list
  await page.reload();
  await page.waitForTimeout(800);
  await page.waitForSelector('#btn-new', { state: 'visible', timeout: 30000 });
  await page.waitForSelector('.world-open', { timeout: 15000 });
  await page.locator('[data-world-id="' + before.id + '"] .world-open').click();
  await page.waitForFunction(() => window.game && game.started && game.player, { timeout: 60000 });
  const after = await page.evaluate(() => ({
    hardmode: !!game.hardmode, bosses: JSON.stringify(game.bossesDefeated), mech: !!game.mechDone, victory: !!game.victory
  }));
  if (after.bosses !== before.bosses || after.mech !== before.mech || after.victory !== before.victory) {
    issue('critical', 'Save/load roundtrip diverges:\nbefore=' + JSON.stringify(before) + '\nafter=' + JSON.stringify(after));
  } else note('save/load roundtrip (real menu resume) preserved all progress');

  // old-world hellstone repair idempotence: the resumed save has patch >= 3,
  // so the one-time migration must not run again on the reloaded world
  const patchInfo = await page.evaluate(() => {
    var got = { hellstone: 0, ash: 0 };
    for (var x = 0; x < game.world.W; x += 7) for (var y = Math.max(game.world.hellY, game.world.H - 190); y < game.world.H; y += 3) {
      if (game.world.get(x, y) === T.HELLSTONE) got.hellstone++;
      else if (game.world.get(x, y) === T.ASH) got.ash++;
    }
    return got;
  });
  note('post-reload underworld: ' + JSON.stringify(patchInfo));
}

await snap('s17-final');
} catch (e) {
  issue('harness-error', e.stack || e.message);
  process.exitCode = 1;
} finally {
writeFileSync(path.join(DIR, 'full-playthrough-issues.json'), JSON.stringify({
  startedAt, seed, finishedAt: new Date().toISOString(),
  durationMs: Date.now() - startedTime,
  methodology: {
    accelerateNote: 'Boss encounters are accelerated: killBoss spots the boss, then injects scripted damage (N x maxHp via game.hitBoss). Spawn correctness, defeat bookkeeping, drops and rewards are real; the fights themselves are not natural pacing.',
    bossEncountersAccelerated: true,
    nightEnemyWindow: 'stage 4 fast-forwards 600 frames of forced step() calls (10 sim-seconds)',
  },
  issues, notes, errors,
}, null, 2));
console.log('\n==== FULL PLAYTHROUGH RESULTS ====');
issues.forEach(i => console.log(` [${i.severity}] (${i.stage}) ${i.text}${i.count > 1 ? ' x' + i.count : ''}`));
if (!issues.length) console.log('No issues in tested coverage.');
else process.exitCode = 1;
await browser.close();
}
