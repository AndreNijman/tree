// Audit 2 — world systems: meteorite drop + mining gate, sky islands,
// natural chest loot, static-water observation, and acorn planting promise.
import { setupAudit, check, note, assertNoBrowserErrors, finish } from './lib.mjs';

const { browser, page, results } = await setupAudit();

// ---------- Meteorite ----------
const meteor = await page.evaluate(() => {
  var w = game.world;
  var beforeCraters = w.meteorCraters.length;
  w.spawnMeteor();
  var count = 0;
  for (var i = 0; i < w.tiles.length; i++) if (w.tiles[i] === T.METEORITE) count++;
  var first = null;
  outer:
  for (var x = 0; x < w.W; x++) for (var y = 0; y < w.hellY; y++) {
    if (w.get(x, y) === T.METEORITE) { first = { x: x, y: y }; break outer; }
  }
  // copper pick should be far below the 55 hardness requirement for meteorite
  var copper = ITEMS[I.COPPERPICK], gold = ITEMS[I.GOLDPICK];
  return { cratersAdded: w.meteorCraters.length - beforeCraters, tiles: count, first: first,
    copperPower: copper && copper.power, goldPower: gold && gold.power,
    tileHardness: TILE_HARD ? TILE_HARD[T.METEORITE] : null };
});
check(results, 'Meteorite crater spawns with METEORITE tiles', meteor.tiles > 0 && meteor.cratersAdded === 1, meteor);
check(results, 'Meteorite hardness gates at gold-tier pick', meteor.copperPower < meteor.tileHardness[0] && meteor.goldPower >= meteor.tileHardness[0], { required: meteor.tileHardness });
check(results, 'Copper pick cannot mine meteorite, gold can', meteor.copperPower < 55 && meteor.goldPower >= 55, meteor);

// ---------- Sky islands ----------
const islands = await page.evaluate(() => {
  var w = game.world;
  var list = (w.skyIslands || []).map(function(rad) { return { x: rad.x, y: rad.y, w: rad.w }; });
  // island chest not guaranteed: search for any chest above the rock layer
  var islandChests = 0, emptyChests = 0;
  w.chests.forEach(function(c) {
    var ry = w.rockY && w.rockY[c.x] !== undefined ? w.rockY[c.x] : w.H;
    if (c.y < ry) {
      islandChests++;
      if (!c.inv || !c.inv.length) emptyChests++;
    }
  });
  return { count: list.length, sample: list.slice(0, 3), islandChests: islandChests, emptyChests: emptyChests };
});
check(results, 'World generates sky islands', islands.count >= 3, islands);
note(results, 'Island-count detail: ' + JSON.stringify(islands.sample) + '; islandChests=' + islands.islandChests + ' emptyChests=' + islands.emptyChests);

// ---------- Natural chest loot ----------
const chest = await page.evaluate(() => {
  var w = game.world;
  // find any natural chest with items
  var found = null;
  w.chests.forEach(function(c) { if (!found && c.inv && c.inv.length) found = { x: c.x, y: c.y, items: c.inv.length, first: c.inv[0] }; });
  var empty = 0;
  w.chests.forEach(function(c) { if (!c.inv || !c.inv.length) empty++; });
  return { hasLoot: !!found, sample: found, total: w.chests.length, empty: empty };
});
check(results, 'Natural chests contain loot', chest.hasLoot, chest);

// ---------- Water physics (static or simulated?) ----------
const water = await page.evaluate(() => {
  var w = game.world;
  // spot a flat surface hole, put 3 water tiles over AIR and wait
  var tx = Math.floor(w.spawnX / TILE) + 50, gy = w.surfaceY[tx];
  var snap = [];
  for (var dx = -2; dx <= 2; dx++) {
    var i = w.idx(tx + dx, gy - 1);
    snap.push({ i: i, t: w.tiles[i], hp: w.hp[i] });
    if (dx >= 0 && dx < 3) w.tiles[i] = T.WATER;
  }
  var r = window.__FW(900, false);
  var changed = 0;
  for (var dx2 = 0; dx2 < 3; dx2++) {
    var i2 = w.idx(tx + dx2, gy - 1);
    if (w.tiles[i2] !== T.WATER) changed++;
  }
  // also observed: does a WATER tile above air stay put (no gravity settle)?
  snap.forEach(function(s) { w.tiles[s.i] = s.t; w.hp[s.i] = s.hp; });
  return { changed: changed, finite: r.finite };
});
check(results, 'WebSim step stays clean with floating water', water.finite, water);
note(results, 'Water tiles left unchanged after 900 sim-frames: flowing movement produced ' + water.changed + ' changes (0 = static water, no liquid physics)');

// ---------- Acorn planting (item promises to grow a tree) ----------
const acorn = await page.evaluate(() => {
  var p = game.player, w = game.world;
  var def = ITEMS[I.ACORN];
  __mod(I.ACORN, 1);
  var tx = Math.floor(p.x / 16), gy = w.surfaceY[tx];
  var before = 0;
  for (var x = tx - 4; x <= tx + 4; x++) for (var y = gy - 10; y <= gy; y++) {
    var t0 = w.get(x, y);
    if (t0 === T.TREETRUNK || !!FELL_LEAVES[t0]) before++;
  }
  var idx = p.inventory.slots.findIndex(function(s) { return s && s.id === I.ACORN; });
  var selected = false, consumed = false;
  if (idx >= 0) {
    p.inventory.selected = idx;
    selected = true;
    var gx = Math.floor(p.x / 16), gy2 = w.surfaceY[gx];
    MOUSE.wx = gx * 16 + 8; MOUSE.wy = (gy2 - 1) * 16 + 8;
    MOUSE.down = true;
    for (var f = 0; f < 120; f++) step(1 / 60);
    MOUSE.down = false;
    consumed = window.__inv(I.ACORN) === 0;
  }
  var after = 0;
  for (var x2 = gx - 5; x2 <= gx + 5; x2++) for (var y2 = gy2 - 12; y2 <= gy2; y2++) {
    var t = w.get(x2, y2);
    if (t === T.TREETRUNK || !!FELL_LEAVES[t]) after++;
  }
  return { consumed: consumed, desc: def ? def.desc : null, saplingAt: after, trunkLeavesBefore: before, trunkLeavesAfter: after, selected: selected };
});
check(results, 'Acorn item exists with growth promise', acorn.desc && acorn.desc.toLowerCase().indexOf('tree') >= 0, acorn.desc);
note(results, 'Acorn planting attempt: selected=' + acorn.selected + ' consumed=' + acorn.consumed + ' treeTilesBefore=' + acorn.trunkLeavesBefore + ' treeTilesAfter=' + acorn.trunkLeavesAfter + '; a tree/sapling appeared = ' + (acorn.trunkLeavesAfter > acorn.trunkLeavesBefore));

await assertNoBrowserErrors(results);
await finish(results, browser, 'world');
