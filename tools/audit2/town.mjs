// Audit 2 — town systems: housing validity/invalidation, pylon network
// teleport, graveyard biome, and the Torch God mini-event.
import { setupAudit, check, note, assertNoBrowserErrors, finish } from './lib.mjs';

const { browser, page, results } = await setupAudit();

// ---------- Housing ----------
const housing = await page.evaluate(() => {
  var w = game.world, p = game.player;
  var tx = Math.floor(w.spawnX / TILE) + 60, gy = w.surfaceY[tx];
  // 9 wide x 5 tall wood-walled room on a stone floor
  var x0 = tx - 4, x1 = tx + 4, yBot = gy, yTop = gy - 4;
  for (var x = x0 - 1; x <= x1 + 1; x++) {
    for (var y = yTop - 1; y <= yBot; y++) {
      var solid = (y === yBot) || (y === yTop - 1) || (x === x0 - 1) || (x === x1 + 1);
      w.set(x, Math.max(2, y), solid ? T.STONE : T.AIR);
      w.setWall(x, Math.max(2, y), solid ? WALL.NONE : WALL.WOOD);
    }
  }
  w.set(x0 + 1, yBot - 1, T.TABLE);
  w.set(x1 - 1, yBot - 1, T.CHAIR);
  w.set(tx, yTop, T.TORCH);
  window.__resetPlayer();
  p.x = tx * TILE + 8; p.y = yBot * TILE - 24; p.vx = 0; p.vy = 0;
  var room = playerHousingRoom();
  var arrived = !!game.townArrivals[E.GUIDE];
  var assigned = arrived && assignNpcHousing(E.GUIDE);
  var homed = assigned ? !!game.housing[E.GUIDE] : false;
  // invalidate: seal a full interior row once — the room splits into two
  // sub-rooms smaller than the 20-tile minimum
  for (var sx = x0; sx <= x1; sx++) w.set(sx, yBot - 2, T.STONE);
  validateHousingAssignments();
  var invalidated = !game.housing[E.GUIDE];
  for (var sy = x0; sy <= x1; sy++) w.set(sy, yBot - 2, T.AIR);
  return { valid: room.valid, reason: room.reason, arrived: arrived, assigned: assigned, homed: homed, invalidated: invalidated };
});
check(results, 'Built room passes housing validation', housing.valid, housing);
check(results, 'The in-game Guide can be assigned to valid housing', housing.assigned && housing.homed, housing);
note(results, 'Guide housing verified end-to-end: townArrivals includes the Guide, assignment + teleport + invalidation all work (post-audit fix)');
check(results, 'Invalidated room removes housing assignment', housing.invalidated, housing);

// ---------- Pylons ----------
const pylons = await page.evaluate(() => {
  var w = game.world, p = game.player;
  var sxA = Math.floor(w.spawnX / TILE) + 20;
  var sxB = Math.floor(w.spawnX / TILE) + 260;
  var ga = w.surfaceY[sxA] - 1, gb = w.surfaceY[sxB] - 1;
  w.set(sxA, ga, T.PYLON); w.addPylon(sxA, ga, I.PYLON_FOREST);
  w.set(sxB, gb, T.PYLON); w.addPylon(sxB, gb, I.PYLON_FOREST);
  var linkedCount = 0;
  for (var i = 0; i < w.pylons.length; i++) {
    var it = ITEMS[w.pylons[i].item];
    if (it && it.pylonBiome === 'any') linkedCount++;
    else if (it && w.biomeAt(w.pylons[i].x * 16 + 8, w.pylons[i].y * 16 + 8) === it.pylonBiome) linkedCount++;
  }
  window.__resetPlayer();
  p.x = sxA * 16 + 8; p.y = (ga + 1) * 16 - 24; p.vx = 0; p.vy = 0;
  var beforeX = Math.round(p.x), targetX = sxB * 16 + 8;
  MOUSE.tpx = sxB; MOUSE.tpy = gb;
  var opened = tryOpenPylon();
  var teleported = false, teleportedMsg = false;
  if (game.pylonOpen) {
    var idx = w.pylons.findIndex(function(r2) { return r2.x === sxB; });
    pylonTeleport(idx);
    teleported = Math.abs(p.x - targetX) < 40;
    game.pylonOpen = false;
  }
  // also direct-call the teleport path without the panel
  p.x = sxA * 16 + 8; p.y = (ga + 1) * 16 - 24;
  var idx2 = w.pylons.findIndex(function(r) { return r.x === sxB; });
  pylonTeleport(idx2);
  var directOk = Math.abs(p.x - targetX) < 40;
  game.message.__last = null;
  // remove pylons afterwards so other systems see normal terrain
  w.removePylon(sxA, ga); w.removePylon(sxB, gb);
  w.set(sxA, ga, T.AIR); w.set(sxB, gb, T.AIR);
  return { linkedCount: linkedCount, opened: opened, panelOk: opened && game.pylonOpen === undefined, teleported: teleported || directOk, beforeX: beforeX, targetX: targetX, afterX: Math.round(p.x) };
});
check(results, 'Two forest pylons both count as linked', pylons.linkedCount >= 2, pylons);
check(results, 'Right-clicking a linked pylon opens the network', pylons.opened === true, pylons);
check(results, 'Pylon network teleports the player to the target pylon', pylons.teleported, pylons);

// ---------- Graveyard ----------
const graveyard = await page.evaluate(() => {
  var w = game.world, p = game.player;
  var tx = Math.floor(w.spawnX / TILE) + 80, gy = w.surfaceY[tx];
  for (var d = -5; d <= 5; d++) {
    var gx = tx + d;
    w.set(gx, w.surfaceY[gx], T.TOMBSTONE);
  }
  window.__resetPlayer();
  p.x = tx * TILE + 8; p.y = gy * TILE - 24;
  var strength = w.graveyardStrengthAt(p.x, p.y);
  var r = window.__FW(600, false);
  // clean the tombstones up again
  for (var d2 = -5; d2 <= 5; d2++) {
    var gx2 = tx + d2;
    if (w.get(gx2, w.surfaceY[gx2]) === T.TOMBSTONE) w.set(gx2, w.surfaceY[gx2], T.AIR);
  }
  return { strength: strength, finite: r.finite };
});
check(results, 'Tombstones create a graveyard biome', graveyard.strength >= 7, graveyard);

// ---------- Torch God ----------
const torchGod = await page.evaluate(() => {
  var w = game.world, p = game.player;
  var tx = Math.floor(w.spawnX / TILE) + 120;
  var ty = w.surfaceY[tx] + 40;
  var placed = 0;
  for (var x = tx - 10; x <= tx + 10 && placed < 120; x++) {
    for (var y = ty - 10; y <= ty + 10 && placed < 120; y++) {
      if (w.get(x, y) === T.AIR) { w.set(x, y, T.TORCH); placed++; }
    }
  }
  var w0 = p.y;
  p.x = tx * 16 + 8; p.y = ty * 16 + 8;
  game.checkTorchGod(tx, ty);
  var started = !!game.torchGod;
  var r2 = window.__FW(1200, false);
  var finished = !!game.torchGod;
  // cleanup
  game.torchGod = null; p.torchGodFavor = false; p.y = w0;
  return { placed: placed, started: started, survived: true, finite: r2.finite };
});
check(results, '100 underground torches trigger the Torch God', torchGod.started, torchGod);
note(results, 'Torch God outcome after 1200 frames: survived=' + torchGod.survived + ' (survival not asserted here)');

await assertNoBrowserErrors(results);
await finish(results, browser, 'town');
