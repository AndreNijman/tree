// One-off diagnostic: does a fishing catch actually add to inventory?
import { setupAudit, check, note, assertNoBrowserErrors, finish } from './lib.mjs';

const { browser, page, results } = await setupAudit();

const out = await page.evaluate(() => {
  var p = game.player, w = game.world;
  var identity = game.player === game.player;
  // dig a pool away from spawn and fill it with water, position the player beside it
  var tx = Math.floor(w.spawnX / TILE) + 110, gy = w.surfaceY[tx];
  for (var x = tx - 3; x <= tx + 3; x++) {
    for (var y = gy - 3; y <= gy; y++) {
      w.set(x, Math.max(2, y), y === gy ? T.SAND : (y >= gy - 2 ? T.WATER : T.AIR));
      w.hp[w.idx(x, Math.max(2, y))] = y === gy ? 40 : 0;
    }
  }
  __mod(I.FISHINGROD_WOODEN, 1);
  __mod(I.WORM, 30);
  var rodIdx = p.inventory.slots.findIndex(function(s) { return s && s.id === I.FISHINGROD_WOODEN; });
  p.inventory.selected = rodIdx;
  window.__resetPlayer();
  p.x = tx * 16 - 40; p.y = gy * 16 - 24; p.vx = 0; p.vy = 0;
  p.invuln = 999999;
  var total = function() {
    var n = 0, s = p.inventory.slots, fish = {};
    for (var i = 0; i < s.length; i++) {
      if (s[i]) { n += s[i].count; fish[s[i].id] = (fish[s[i].id] || 0) + s[i].count; }
    }
    return { total: n, fish: fish };
  };
  var before = total();
  var msgs = [];
  var origMsg = game.message;
  game.message = function(t) { msgs.push(String(t)); return origMsg.apply(this, arguments); };
  var detail = [];
  for (var round = 0; round < 4; round++) {
    // cast directly — aim at the pool like a real click
    MOUSE.wx = tx * 16; MOUSE.wy = gy * 16 - 8;
    p.attackCd = 0;
    var item = p.inventory.slots[rodIdx];
    p.tryFish(game, ITEMS[I.FISHINGROD_WOODEN], I.FISHINGROD_WOODEN, item);
    detail.push({ round: round, castOk: !!p.fishing, bait: p.inventory.countOf ? p.inventory.countOf(I.WORM) : 'n/a', playerSame: game.player === p });
    if (!p.fishing) continue;
    p.fishBite = true;           // force the bite
    var t0 = total();
    p.attackCd = 0;
    p.tryFish(game, ITEMS[I.FISHINGROD_WOODEN], I.FISHINGROD_WOODEN, item); // reel
    detail.push({ round: round, after: total().total, delta: total().total - t0.total });
  }
  game.message = origMsg;
  return { before: before, after: total(), msgs: msgs.slice(0, 12), detail: detail, slotsLen: p.inventory.slots.length };
});

// informational diagnostic: inventory total stays flat because bait (worms) is
// consumed per cast while catches add items — measure per-item deltas instead
var gainedItems = {};
for (var gid in out.after.fish) if (out.after.fish[gid] > (out.before.fish[gid] || 0)) gainedItems[gid] = out.after.fish[gid] - (out.before.fish[gid] || 0);
check(results, 'Fishing: catches added distinct fish items to inventory', Object.keys(gainedItems).length > 0, { gainedItems: gainedItems });
console.log(JSON.stringify(out, null, 1));
await assertNoBrowserErrors(results);
await finish(results, browser, 'fishtest');
