// Audit 2 — real combat + gear: honest King Slime and Eye of Cthulhu fights
// with real weapons (no scripted killBoss damage), minion summon/cap,
// armor/accessory defense, mount, and buffs.
import { setupAudit, check, note, assertNoBrowserErrors, finish } from './lib.mjs';

const { browser, page, results } = await setupAudit();

// Build the arena once: flat stone ground near spawn.
await page.evaluate(() => {
  var w = game.world;
  var tx = Math.floor(w.spawnX / TILE) + 40;
  var gy = w.surfaceY[tx];
  game.__arenaX = tx; game.__arenaY = gy;
  for (var x = tx - 30; x <= tx + 30; x++) {
    for (var y = gy - 12; y <= gy; y++) {
      w.set(Math.max(1, x), Math.max(2, y), y === gy ? T.STONE : T.AIR);
    }
  }
  window.__clearHostiles();
  window.__FW(30, false);
});

// ---------- Sanity: melee vs a plain slime (validate the swing path) ----------
const meleeSanity = await page.evaluate(() => {
  var p = game.player, w = game.world;
  var tx = game.__arenaX, gy = game.__arenaY;
  window.__clearHostiles();
  __mod(I.COPPERSWORD, 1);
  var swordIdx = p.inventory.slots.findIndex(function(s) { return s && s.id === I.COPPERSWORD; });
  p.inventory.selected = swordIdx;
  var slime = spawnEntity(game, E.SLIME, p.x + 30, p.y - 4);
  var hp0 = slime.hp;
  var samples = [];
  for (var f = 0; f < 240; f++) {
    MOUSE.wx = slime.x; MOUSE.wy = slime.y;
    MOUSE.down = true;
    step(1 / 60);
    MOUSE.down = false;
    if (f % 60 === 0) samples.push({ f: f, hp: slime.hp, dist: Math.round(Math.abs(slime.x - p.x)), dir: p.dir, swing: p.swingT > 0 });
  }
  window.__clearHostiles();
  return { hp0: hp0, hpEnd: slime.hp, dealt: hp0 - slime.hp, samples: samples };
});
check(results, 'Sanity: copper sword damages a plain slime', meleeSanity.dealt > 0, meleeSanity);

// ---------- Honest King Slime fight ----------
const ks = await page.evaluate(() => {
  var w = game.world, p = game.player;
  var tx = game.__arenaX, gy = game.__arenaY;
  window.__resetPlayer();
  p.invuln = 0;
  p.x = tx * 16 + 8; p.y = (gy - 1) * 16 - 12; p.vx = 0; p.vy = 0;
  __mod(I.COPPERSWORD, 1);
  var swordIdx = p.inventory.slots.findIndex(function(s) { return s && s.id === I.COPPERSWORD; });
  if (swordIdx < 0) return { fatal: 'no coppersword' };
  p.inventory.selected = swordIdx;
  game.spawnBoss('kingslime');
  var boss = null, hpStart = 0, swings = 0, dealt = 0, taken = 0, hpLast = 0;
  var frames = 0;
  var trace = [];
  for (var f = 0; f < 60000; f++) {
    frames = f;
    var live = game.entities.filter(function(e) { return !e.dead && e.boss === 'kingslime'; });
    if (live.length) {
      boss = live[0];
      if (hpStart === 0) hpStart = boss.hp;
      if (hpLast && hpLast > boss.hp) dealt += hpLast - boss.hp;
      hpLast = boss.hp;
      MOUSE.wx = boss.x; MOUSE.wy = boss.y;
      // chase assist: park next to the boss once a sim-second (no scripted damage —
      // a stand-in for a real player running after a boss that hops over rough ground)
      if (f % 60 === 0) {
        var cdist = Math.sqrt((boss.x - p.x) * (boss.x - p.x) + (boss.y - p.y) * (boss.y - p.y));
        if (cdist > 110) { p.x = boss.x - 40; p.y = boss.y - 4; p.vx = 0; p.vy = 0; }
      }
      // copper sword is NOT auto: a fresh press is needed each swing attempt
      MOUSE.down = true; swings++;
      step(1 / 60);
      MOUSE.down = false;
      if (f % 300 === 0) trace.push({ f: f, hp: boss.hp, dist: Math.round(Math.sqrt((boss.x - p.x) * (boss.x - p.x) + (boss.y - p.y) * (boss.y - p.y))), dir: p.dir, swing: p.swingT > 0, dying: !!p.dying });
    } else if (hpStart > 0) { break; }
    else { step(1 / 60); }
    // keep the player alive: refill HP once per sim-second
    if (f % 60 === 59) {
      if (p.hp < p.maxHp) taken += p.maxHp - p.hp; // health really lost to something
      p.hp = p.maxHp;
      if (p.dying) { p.hp = p.maxHp; p.dying = false; p.respawnT = 0; p.invuln = 60; }
    }
  }
  MOUSE.down = false;
  var invHas = function(id) {
    var n = 0, s = p.inventory.slots;
    for (var q = 0; q < s.length; q++) if (s[q] && s[q].id === id) n += s[q].count;
    return n;
  };
  var defeated = !game.entities.some(function(e) { return !e.dead && e.boss === 'kingslime'; });
  var bossDefeatedFlag = !!game.bossesDefeated.kingslime;
  var gel = window.__pick(I.GEL) + invHas(I.GEL);
  var coins = window.__pick(I.GOLDCOIN) + window.__pick(I.SILVERCOIN) + invHas(I.GOLDCOIN) + invHas(I.SILVERCOIN);
  return { defeated: defeated, hpStart: hpStart, dealt: dealt, taken: taken, frames: frames, swings: swings, flag: bossDefeatedFlag, gel: gel, coins: coins, trace: trace.slice(0, 14) };
});
check(results, 'King Slime defeated with real copper sword (no scripted damage)', ks.defeated, ks);
check(results, 'King Slime AI dealt real damage to the player', ks.taken > 0, ks);
check(results, 'King Slime drops Gel and coins', ks.gel > 0 && ks.coins > 0, ks);
note(results, `King Slime fight: frames=${ks.frames}, damageDealt=${ks.dealt}, damageTaken=${ks.taken}, hpStart=${ks.hpStart}`);

// ---------- Honest Eye of Cthulhu fight (night, homing Bee Gun) ----------
const eoc = await page.evaluate(() => {
  var w = game.world, p = game.player;
  var tx = game.__arenaX, gy = game.__arenaY;
  // clear the loot-filled inventory from the King Slime run + grab all pickups
  for (var ci = 0; ci < p.inventory.slots.length; ci++) p.inventory.slots[ci] = null;
  game.pickups.length = 0;
  game.timeOfDay = 0.95; // night
  window.__resetPlayer();
  p.invuln = 0;
  p.x = tx * 16 + 8; p.y = (gy - 1) * 16 - 12; p.vx = 0; p.vy = 0;
  p.maxMana = 200; p.mana = 200;
  __mod(I.BEEGUN, 1);
  var bg = p.inventory.slots.findIndex(function(s) { return s && s.id === I.BEEGUN; });
  if (bg < 0) return { fatal: 'no beegun' };
  p.inventory.selected = bg;
  game.timeOfDay = 0.95;
  game.spawnBoss('eyeofcthulhu');
  var boss = null, hpStart = 0, dealt = 0, taken = 0, hpLast = 0, frames = 0;
  var fired = 0;
  for (var f = 0; f < 60000; f++) {
    frames = f;
    var live = game.entities.filter(function(e) { return !e.dead && e.boss === 'eyeofcthulhu' && !e.armType; });
    if (!live.length && hpStart > 0) break;
    if (live.length) {
      boss = live[0];
      if (hpStart === 0) hpStart = boss.hp;
      if (hpLast && hpLast > boss.hp) dealt += hpLast - boss.hp;
      hpLast = boss.hp;
      MOUSE.wx = boss.x; MOUSE.wy = boss.y;
      MOUSE.down = true; fired++;
    }
    step(1 / 60);
    if (f % 60 === 0) {
      if (p.hp < p.maxHp) taken += p.maxHp - p.hp;
      p.hp = p.maxHp; p.mana = 200;
      if (Math.abs(p.x - tx * 16 - 8) > 600) { p.x = tx * 16 + 8; p.y = (gy - 2) * 16; p.vx = 0; p.vy = 0; }
      if (p.dying) { p.hp = p.maxHp; p.dying = false; p.respawnT = 0; p.invuln = 60; p.x = tx * 16 + 8; p.y = (gy - 2) * 16; }
      MOUSE.down = false; // small gaps between spray windows
      if (f % 120 === 0) game.timeOfDay = 0.95; // keep night locked
    }
  }
  MOUSE.down = false;
  var stillAlive = game.entities.some(function(e) { return !e.dead && e.boss === 'eyeofcthulhu' && !e.armType; });
  var invHas2 = function(id) {
    var n = 0, s = p.inventory.slots;
    for (var q = 0; q < s.length; q++) if (s[q] && s[q].id === id) n += s[q].count;
    return n;
  };
  var beat = !stillAlive;
  var lens = window.__pick(I.LENS) + invHas2(I.LENS);
  var defeated = beat;
  if (!defeated) { // mercy: finish the data point but keep the record honest
    return { defeated: false, hpStart: hpStart, dealt: dealt, taken: taken, frames: frames, fired: fired, lens: lens };
  }
  return { defeated: true, hpStart: hpStart, dealt: dealt, taken: taken, frames: frames, fired: fired, lens: lens };
});
check(results, 'Eye of Cthulhu defeated with real Bee Gun attacks (no scripted damage)', eoc.defeated, eoc);
check(results, 'Eye of Cthulhu AI dealt real damage to the player', eoc.taken > 0, eoc);
if (eoc.defeated) check(results, 'Eye of Cthulhu grants Lens loot', eoc.lens > 0, eoc);
note(results, `Eye fight: frames=${eoc.frames}, damageDealt=${eoc.dealt}, damageTaken=${eoc.taken}, hpStart=${eoc.hpStart}, attackFrames=${eoc.fired}`);

// ---------- Minion summon + cap ----------
const minions = await page.evaluate(() => {
  var p = game.player, w = game.world;
  var tx = game.__arenaX, gy = game.__arenaY;
  for (var ci = 0; ci < p.inventory.slots.length; ci++) p.inventory.slots[ci] = null;
  game.pickups.length = 0;
  window.__resetPlayer();
  window.__clearHostiles();
  var added = __mod(I.FLINXSTAFF, 1);
  var staffIdx = p.inventory.slots.findIndex(function(s) { return s && s.id === I.FLINXSTAFF; });
  if (staffIdx < 0) {
    // diagnostic: dump the inventory so we can see what addStack actually did
    var dump = p.inventory.slots.filter(Boolean).map(function(s) { return s.id; });
    return { fatal: 'no flinx staff', added: added, ids: dump, want: I.FLINXSTAFF };
  }
  p.inventory.selected = staffIdx;
  var counts = [];
  for (var s = 0; s < 5; s++) {
    MOUSE.wx = p.x + 40; MOUSE.wy = p.y; MOUSE.down = true;
    for (var f = 0; f < 30; f++) step(1 / 60);
    MOUSE.down = false;
    var n = 0;
    for (var i = 0; i < game.entities.length; i++) {
      var e = game.entities[i];
      if (!e.dead && e.minion) n++;
    }
    counts.push(n);
  }
  return { counts: counts, cap: MINION_CAP };
});
if (minions.fatal) {
  check(results, 'Flinx Staff can be granted, selected, and used', false, minions);
  note(results, 'FLINXSTAFF grant diagnostic: added=' + minions.added + ' want=' + minions.want + ' inv=' + JSON.stringify(minions.ids));
} else {
  check(results, 'Minion cap enforced at 3 (5 summons requested)', JSON.stringify(minions.counts) === '[1,2,3,3,3]', minions);
  note(results, 'Minion counts: ' + JSON.stringify(minions.counts) + ' MINION_CAP=' + minions.cap);
}

// ---------- Armor / accessory defense ----------
const defense = await page.evaluate(() => {
  var inv = game.player.inventory;
  for (var ci = 0; ci < inv.slots.length; ci++) inv.slots[ci] = null;
  inv.armor.head = null; inv.armor.chest = null; inv.armor.legs = null;
  inv.accessories = [null, null, null, null, null, null];
  game.pickups.length = 0;
  var base = game.player.defense();
  // give one accessory so accEffects actually has content too
  inv.accessories[0] = I.SPECTREBOOTS;
  __mod(I.COPPERHELM, 1); __mod(I.COPPERCHEST, 1); __mod(I.COPPERLEGS, 1);
  __mod(I.COBALTHELM, 1); __mod(I.COBALTCHEST, 1); __mod(I.COBALTLEGS, 1);
  var copperSum = ITEMS[I.COPPERHELM].def + ITEMS[I.COPPERCHEST].def + ITEMS[I.COPPERLEGS].def;
  inv.armor.head = I.COPPERHELM; inv.armor.chest = I.COPPERCHEST; inv.armor.legs = I.COPPERLEGS;
  var copperDef = game.player.defense();
  var cobaltSum = ITEMS[I.COBALTHELM].def + ITEMS[I.COBALTCHEST].def + ITEMS[I.COBALTLEGS].def;
  inv.armor.head = I.COBALTHELM; inv.armor.chest = I.COBALTCHEST; inv.armor.legs = I.COBALTLEGS;
  var cobaltDef = game.player.defense();
  var accDef = ITEMS[I.SPECTREBOOTS].def || 0;
  var eff = inv.accEffects();
  return { base: base, copperSum: copperSum, copperDef: copperDef, cobaltSum: cobaltSum, cobaltDef: cobaltDef, accDef: accDef, runSpeed: eff.runSpeed };
});
check(results, 'Armor pieces add their defense value', defense.cobaltDef - defense.base === defense.cobaltSum + 3, defense);
check(results, 'Copper set bonus: full 3-piece set adds +2 beyond the piece sum',
  defense.copperDef - defense.base === defense.copperSum + 2, defense);
note(results, 'Armor set bonuses now implemented: defense() includes the set bonus (copper +2, cobalt +3); Meteor set makes Space Gun cost no mana');

// ---------- Buff (potion) ----------
const buff = await page.evaluate(() => {
  var p = game.player;
  p.attackCd = 0; p.swingT = 0;   // leftover attackCd from the summon blocks the drink
  __mod(I.SWIFTNESSPOTION, 1);
  var beforeRun = p.inventory.accEffects().runSpeed;
  var idx = p.inventory.slots.findIndex(function(s) { return s && s.id === I.SWIFTNESSPOTION; });
  var used = false;
  if (idx >= 0) {
    p.inventory.selected = idx;
    MOUSE.wx = p.x + 20; MOUSE.wy = p.y; MOUSE.down = true;
    step(1 / 60);
    MOUSE.down = false;
    used = !!p.buffs[I.SWIFTNESSPOTION];
  }
  return { used: used, t: p.buffs[I.SWIFTNESSPOTION] || 0 };
});
check(results, 'Consumable potion applies a timed buff', buff.used, buff);

await assertNoBrowserErrors(results);
await finish(results, browser, 'fight');
