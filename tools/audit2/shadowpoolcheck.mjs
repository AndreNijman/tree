// One-off: enumerate shadow-chest loot ids generated post-prune and flag any
// whose ITEMS definition is gone (the inventory.add throw source).
import { setupAudit, check, assertNoBrowserErrors, finish } from './lib.mjs';

const { browser, page, results } = await setupAudit();
const d = await page.evaluate(() => {
  var chests = (game.world.chests || []).filter(function (c) { return c.kind === 'shadow'; });
  var rows = [];
  chests.forEach(function (c) {
    (c.inv || []).forEach(function (s) {
      rows.push({ id: s.id, count: s.count, hasDef: !!ITEMS[s.id] });
    });
  });
  // also probe the two known pool constants for definitional state
  var poolKeys = ['SUNFURY', 'FLAMELASH', 'HELLWINGBOW', 'DARKLANCE', 'HELLSTONEBAR', 'OBSIDIANSKINPOTION'];
  var poolState = {};
  poolKeys.forEach(function (k) {
    var id = I[k];
    poolState[k] = { id: id, hasDef: !!ITEMS[id], type: ITEMS[id] ? ITEMS[id].type : null };
  });
  // and check fixed-recipe sources for the questionable two
  var craftable = RECIPES.filter(function (r) {
    return r.result === I.HELLSTONEBAR || r.result === I.OBSIDIANSKINPOTION;
  }).map(function (r) { return r.result; });
  return { shadowChests: chests.length, lootRows: rows.slice(0, 12), poolState: poolState, craftable: craftable };
});
check(results, 'Shadow pool ids resolved', d.shadowChests > 0, d);
check(results, 'No shadow-chest loot id lacks a definition', (d.lootRows || []).every(function (r) { return r.hasDef; }), d.lootRows);
await assertNoBrowserErrors(results);
await finish(results, browser, 'shadowpoolcheck', d);
