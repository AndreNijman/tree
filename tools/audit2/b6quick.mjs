// B6 quick-wins verification: the four unambiguous acquisition wires:
//   1. Bee Wax drops from Queen Bee (un-sticks 3 Bee armor recipes)
//   2. Jungle Spores drop from jungle plant enemies (un-sticks 3 Jungle armor recipes + Jungle Juice)
//   3. Sturdy Fossil drops from desert undead (un-sticks 3 Fossil armor recipes)
//   4. Shadow Key is sold by the Merchant after Skeletron (opens all shadow chests)
// Each wire is exercised through the real spawn/kill/chest-open code paths.
import { setupAudit, check, note, assertNoBrowserErrors, finish } from './lib.mjs';

const { browser, page, results } = await setupAudit();

const data = await page.evaluate(() => {
  const out = { errors: [] };
  const sumPickup = (id) => {
    var n = 0;
    (game.pickups || []).forEach(function(p) { if (p.item === id) n += (p.count || 1); });
    var inv = game.player.inventory.slots || [];
    for (var i = 0; i < inv.length; i++) if (inv[i] && inv[i].id === id) n += inv[i].count;
    return n;
  };
  const clearLoot = (id) => {
    game.pickups = (game.pickups || []).filter(function(p) { return p.item !== id; });
    var inv = game.player.inventory.slots || [];
    for (var i = 0; i < inv.length; i++) if (inv[i] && inv[i].id === id) { inv[i] = null; }
  };

  // ---- 1. Bee Wax from Queen Bee (real killBoss path) ----
  try {
    clearLoot(I.BEE_WAX);
    if (typeof spawnQueenBee === 'function') spawnQueenBee(game);
    var bee = (game.entities || []).find(function(e) { return e && !e.dead && e.boss === 'queenbee'; });
    if (bee) {
      killBoss(bee, game);
    }
    out.beeWax = sumPickup(I.BEE_WAX);
    out.beeKilled = !!bee;
  } catch (err) { out.errors.push('beewax: ' + err.message); }

  // ---- 2/3. Jungle Spores + Sturdy Fossil via 40 real enemy kills each ----
  try {
    clearLoot(I.JUNGLE_SPORES); clearLoot(I.STURDY_FOSSIL);
    var bx = game.world.W * TILE / 2, by = 100;
    for (var i = 0; i < 40; i++) {
      var me = spawnEntity(game, E.MANEATER, bx + (i % 8) * 24, by + Math.floor(i / 8) * 24);
      killEntity(me, game);
    }
    out.jungleKills = 40; out.jungleSpores = sumPickup(I.JUNGLE_SPORES);
    for (var j = 0; j < 40; j++) {
      var gh = spawnEntity(game, E.GHOUL, bx + 400 + (j % 8) * 24, by + Math.floor(j / 8) * 24);
      killEntity(gh, game);
    }
    out.ghoulKills = 40; out.fossils = sumPickup(I.STURDY_FOSSIL);
  } catch (err) { out.errors.push('mobs: ' + err.message); }

  // ---- 4. Shadow Key shop row + real chest unlock ----
  try {
    var rows = (TOWN_SHOPS[E.MERCHANT] || []).filter(function(r) { return r.item === I.SHADOWKEY; });
    out.shadowKeyShop = rows.length ? { cost: rows[0].cost, gate: rows[0].gate } : null;
    var chest = (game.world.chests || []).find(function(c) { return c.locked && c.kind === 'shadow'; });
    out.chestFound = !!chest;
    if (chest) {
      out.sealedLoot = (chest.inv || []).map(function(s) { return s.id; });
      // diagnostic: list stacks whose def is gone (post-prune unknown ids)
      out.badStacks = (game.player.inventory.slots || []).map(function(s, idx) {
        return s && !ITEMS[s.id] ? idx + ':' + s.id : null;
      }).filter(Boolean);
      var arm2 = game.player.inventory.armor || {};
      ['head', 'chest', 'legs'].forEach(function(k) { if (arm2[k] && !ITEMS[arm2[k].id]) out.badStacks.push('armor.' + k + ':' + arm2[k].id); });
      (game.player.inventory.accessories || []).forEach(function(a, i2) { if (a && !ITEMS[a]) out.badStacks.push('acc' + i2 + ':' + a); });
      (game.player.inventory.dyes || []).forEach(function(d2, i3) { if (d2 && !ITEMS[d2]) out.badStacks.push('dye' + i3 + ':' + d2); });
      if (game.player.inventory.ammo && !ITEMS[game.player.inventory.ammo]) out.badStacks.push('ammo:' + game.player.inventory.ammo);
      // move player next to the chest (tryOpenChest requires <72px)
      var p = game.player;
      var ox = p.x, oy = p.y;
      p.x = chest.x * TILE + 8 - 40; p.y = chest.y * TILE + 8;
      p.inventory.add(I.SHADOWKEY, 1);
      MOUSE.tpx = chest.x; MOUSE.tpy = chest.y;
      tryOpenChest();
      out.unlocked = !!(game.chest && !game.chest.locked);
      // loot it for real
      if (out.unlocked) { lootAllChest(); out.lootedIds = (p.inventory.slots || []).filter(Boolean).map(function(s) { return s.id; }).filter(function(id) { return out.sealedLoot.indexOf(id) >= 0; }); }
      p.x = ox; p.y = oy;
      game.chest = null; game.chestOpen = false;
    }
  } catch (err) { out.errors.push('shadow: ' + err.message + ' @ ' + String(err.stack || '').split('\n').slice(0, 5).join(' | ')); }
  return out;
});

check(results, 'Queen Bee kill drops Bee Wax through the real boss path',
  data.beeKilled && data.beeWax >= 16, { beeKilled: data.beeKilled, beeWax: data.beeWax });
check(results, 'Jungle Spores drop from Man Eater (40 kills, p=0.4 each)',
  data.jungleSpores >= 1, { spores: data.jungleSpores });
check(results, 'Sturdy Fossil drops from Ghoul (40 kills, p=0.3 each)',
  data.fossils >= 1, { fossils: data.fossils });
check(results, 'Merchant now sells a Shadow Key (gate: Skeletron)',
  data.shadowKeyShop && data.shadowKeyShop.gate === 'skeletron', data.shadowKeyShop);
check(results, 'A generated shadow chest fully unlocks and loots with the key',
  data.chestFound && data.unlocked && data.lootedIds && data.lootedIds.length > 0,
  { unlocked: String(data.unlocked), looted: (data.lootedIds || []).length, had: (data.sealedLoot || []).length,
    errors: data.errors });

note(results, 'Sealed-chest end-to-end: player bought-nothing path — key granted, chest opened & looted: ' +
  (data.lootedIds || []).join(', '));

await assertNoBrowserErrors(results);
await finish(results, browser, 'b6quick');
