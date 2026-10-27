// One-off verification for the Phase-1 prune's save sanitizer: a snapshot
// holding now-undefined item ids (pruned defs) must load without crashing and
// get scrubbed by applySaveData → sanitizeSavedItemIds across slots, armor,
// accessories, dyes, ammo and pickups, while valid stacks survive untouched.
import { setupAudit, check, assertNoBrowserErrors, finish } from './lib.mjs';

const { browser, page, results } = await setupAudit();

const d = await page.evaluate(() => {
  var bad = null, badTok = null, prunedCount = 0;
  for (var k in I) {
    var v = I[k];
    if (typeof v === 'string' && !ITEMS[v]) {
      prunedCount++;
      if (!bad) { bad = v; badTok = k; }
    }
  }
  if (!bad) return { err: 'no pruned ids found' };
  __mod(I.TORCH, 5); // a known-valid obtainable stack for the survive-check
  var inv = game.player.inventory;
  var validIdx = -1;
  for (var i = 0; i < inv.slots.length; i++) if (inv.slots[i] && inv.slots[i].id === 'torch') { validIdx = i; break; }
  var snap = saveSnapshot();
  inv.slots[10] = { id: bad, count: 3 };
  if (inv.armor) inv.armor.head = { id: bad, count: 1 };
  inv.accessories[1] = bad;
  inv.dyes[2] = bad;
  inv.ammo = bad;
  game.pickups.push({ item: bad, x: 10, y: 10, count: 9, t: 1 });
  snap.player.inventory = JSON.parse(JSON.stringify(inv));
  snap.pickups = JSON.parse(JSON.stringify(game.pickups));
  applySaveData(snap); // the real host-load path; net clients route through the same code
  var p2 = game.player.inventory;
  return {
    prunedCount: prunedCount, bad: bad, badTok: badTok, validIdx: validIdx,
    slotScrubbed: p2.slots[10] === null,
    validKept: !!(p2.slots[validIdx] && p2.slots[validIdx].id === 'torch' && p2.slots[validIdx].count === 5),
    armorScrubbed: !p2.armor.head,
    accScrubbed: p2.accessories[1] === null,
    dyeScrubbed: p2.dyes[2] === null,
    ammoScrubbed: p2.ammo === null,
    pickupScrubbed: p2.slots[10] === null && !game.pickups.some(function (pk) { return pk.item === bad; }),
    gameRestored: !!game.started
  };
});
if (d.err) {
  check(results, 'Pruned ids discoverable in-page', false, d);
} else {
  check(results, 'Pruned ids discoverable in-page (tokens intact, defs gone)', d.prunedCount > 0, { sample: d.bad + ' (I.' + d.badTok + ')', found: d.prunedCount });
  check(results, 'Bogus inventory stack scrubbed on save-load', d.slotScrubbed, { slot10: d.slotScrubbed ? 'null' : 'kept' });
  check(results, 'Valid stack survives the sanitizer untouched', d.validKept, { validIdx: d.validIdx });
  check(results, 'Bogus armor / accessory / dye / ammo scrubbed on save-load', d.armorScrubbed && d.accScrubbed && d.dyeScrubbed && d.ammoScrubbed,
    { armor: d.armorScrubbed, acc: d.accScrubbed, dye: d.dyeScrubbed, ammo: d.ammoScrubbed });
  check(results, 'Bogus pickup scrubbed on save-load', d.pickupScrubbed, null);
  check(results, 'applySaveData restored the game without crashing', d.gameRestored, null);
}
await assertNoBrowserErrors(results);
await finish(results, browser, 'sanitizesave', { sample: d.bad || null, prunedFound: d.prunedCount || 0 });
