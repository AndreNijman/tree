// Audit 2 — player fate: death drops (coins/tombstone), respawn, and a real
// fishing catch (rod + bait + pool).
import { setupAudit, check, note, assertNoBrowserErrors, finish } from './lib.mjs';

const { browser, page, results } = await setupAudit();

// ---------- Death: coin loss + tombstone + respawn ----------
const death = await page.evaluate(() => {
  var p = game.player, w = game.world;
  var startCoins = __mod(I.GOLDCOIN, 5) + __mod(I.SILVERCOIN, 50);
  var beforeCoins = __inv(I.GOLDCOIN) + __inv(I.SILVERCOIN);
  var tx = Math.floor(w.spawnX / TILE) + 70, gy = w.surfaceY[tx];
  p.x = tx * 16 + 8; p.y = gy * 16 - 24; p.vx = 0; p.vy = 0;
  p.invuln = 0;
  var hpBefore = p.hp;
  game.damagePlayer(99999, null, 0);
  var dying = p.dying || p.respawnT > 0;
  var tombstoneNear = null;
  for (var f = 0; f < 600 && (p.dying || p.respawnT > 0); f++) step(1 / 60);
  var respawned = !p.dying && p.hp > 0;
  var atSpawn = Math.abs(p.x - w.spawnX) < 400;
  for (var x = tx - 20; x <= tx + 20; x++) {
    for (var y = gy - 6; y <= gy + 6; y++) {
      if (w.get(x, Math.max(2, y)) === T.TOMBSTONE) tombstoneNear = { x: x, y: Math.max(2, y) };
    }
  }
  var afterCoins = __inv(I.GOLDCOIN) + __inv(I.SILVERCOIN);
  var coinPickups = window.__pick(I.GOLDCOIN) + window.__pick(I.SILVERCOIN);
  p.invuln = 999999;
  return { dying: dying, respawned: respawned, atSpawn: atSpawn, tombstoneNear: tombstoneNear, coinsBefore: beforeCoins, coinsAfter: afterCoins, lost: beforeCoins - afterCoins, coinPickups: coinPickups };
});
check(results, 'Player dies and respawns at world spawn', death.dying && death.respawned && death.atSpawn, death);
check(results, 'A tombstone is placed at the death site', !!death.tombstoneNear, death);
check(results, 'Death keeps all coins on Normal (design: coinLoss=0; vanilla softcore drops ~half — flagged as a possible missing addition)', death.lost === 0 && death.coinPickups === 0, death);
note(results, 'Coin loss on death: DIFFICULTY.normal.coinLoss = 0 in js/main.js — Normal keeps all coins; only Expert/Master lose them. Vanilla softcore drops half.');

// ---------- Fishing: real catch ----------
const fishing = await page.evaluate(() => {
  var p = game.player, w = game.world;
  // dig a 6x3 pool a little away from spawn and fill it with water tiles
  var tx = Math.floor(w.spawnX / TILE) + 110, gy = w.surfaceY[tx];
  for (var x = tx - 3; x <= tx + 3; x++) {
    for (var y = gy - 3; y <= gy; y++) {
      w.set(x, Math.max(2, y), y === gy ? T.SAND : (y >= gy - 2 ? T.WATER : T.AIR));
      w.hp[w.idx(x, Math.max(2, y))] = y === gy ? 40 : 0;
    }
  }
  __mod(I.FISHINGROD_WOODEN, 1);
  __mod(I.WORM, 10);
  var rodIdx = p.inventory.slots.findIndex(function(s) { return s && s.id === I.FISHINGROD_WOODEN; });
  if (rodIdx < 0) return { fatal: 'no rod' };
  p.inventory.selected = rodIdx;
  window.__resetPlayer();
  p.x = tx * 16 - 40; p.y = gy * 16 - 24; p.vx = 0; p.vy = 0;
  var beforeMap = {};
  for (var s0 = 0; s0 < p.inventory.slots.length; s0++) {
    var st0 = p.inventory.slots[s0];
    if (st0) beforeMap[st0.id] = (beforeMap[st0.id] || 0) + st0.count;
  }
  var caughtMsgs = [];
  var origMsg = game.message;
  game.message = function(t) { caughtMsgs.push(String(t)); return origMsg.apply(this, arguments); };
  var casts = 0, bites = 0, catches = 0, bobberFrames = 0;
  for (var round = 0; round < 14; round++) {
    // cast toward the pool
    MOUSE.wx = tx * 16 + 8; MOUSE.wy = (gy - 2) * 16; MOUSE.down = true;
    step(1 / 60);
    MOUSE.down = false;
    casts++;
    var f;
    for (f = 0; f < 1500; f++) {
      step(1 / 60);
      if (p.fishing) bobberFrames++;
      if (p.fishing && p.fishBite) {
        bites++;
        // reel in: click again (tryFish reel path grants the catch on fishBite)
        MOUSE.down = true;
        step(1 / 60);
        MOUSE.down = false;
        break;
      } else if (f === 1499 && p.fishing) {
        // reel without bite to recycle the afk cast
        MOUSE.down = true;
        step(1 / 60);
        MOUSE.down = false;
      }
    }
  }
  game.message = origMsg;
  var afterMap = {};
  for (var s1 = 0; s1 < p.inventory.slots.length; s1++) {
    var st1 = p.inventory.slots[s1];
    if (st1) afterMap[st1.id] = (afterMap[st1.id] || 0) + st1.count;
  }
  var gained = 0, gainedIds = {};
  for (var idm in afterMap) {
    var d = afterMap[idm] - (beforeMap[idm] || 0);
    if (d > 0 && idm !== I.WORM) { gained += d; gainedIds[idm] = d; } // worms are consumed as bait, not a gain
  }
  return { casts: casts, bites: bites, bobberFrames: bobberFrames, gained: gained, gainedIds: gainedIds, messages: caughtMsgs.filter(function(m) { return m.indexOf('caught') >= 0 || m.indexOf('hooked') >= 0 || m.indexOf('bait') >= 0 || m.indexOf('water') >= 0 || m.indexOf('Too early') >= 0; }).slice(0, 8) };
});
if (fishing.fatal) {
  check(results, 'Fishing: rod item exists', false, fishing);
} else {
  check(results, 'Fishing: casting creates a bobber', fishing.bobberFrames > 0, { casts: fishing.casts, frames: fishing.bobberFrames });
  check(results, 'Fishing: bite -> reel-in -> caught fish (inventory gains an item, catch message shown)', fishing.gained > 0 || fishing.messages.some(m => m.indexOf('caught') >= 0), fishing);
  check(results, 'Fishing: at least one real bite occurred', fishing.bites > 0, fishing);
}

await assertNoBrowserErrors(results);
await finish(results, browser, 'fate');
