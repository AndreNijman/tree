// Verification probe for audit fixes B2, B5, B7:
// - B5: armor set bonuses (defense table + Meteor Space-Gun rule)
// - B7: natural obsidian where worldgen lava touches water
// - B2a: acorn planting grows a tree on grass
// - B2b: dig under water drains it (fall + diagonal slide), water+lava -> obsidian
import { setupAudit, check, note, assertNoBrowserErrors, finish } from './lib.mjs';

const { browser, page, results } = await setupAudit();

// ---------- B7: worldgen obsidian ----------
const b7 = await page.evaluate(() => {
  var obs = 0;
  var t = game.world.tiles;
  for (var i = 0; i < t.length; i++) if (t[i] === T.OBSIDIAN) obs++;
  return { obs: obs };
});
check(results, 'B7: worldgen formed obsidian at lava/water boundaries', b7.obs > 0, b7);
note(results, 'Worldgen obsidian tiles: ' + b7.obs);

// ---------- B5: armor set bonuses ----------
const b5 = await page.evaluate(() => {
  var p = game.player, inv = p.inventory, out = {};
  inv.armor = { head: I.COPPERHELM, chest: I.COPPERCHEST, legs: I.COPPERLEGS };
  out.copperPieces = ITEMS[I.COPPERHELM].def + ITEMS[I.COPPERCHEST].def + ITEMS[I.COPPERLEGS].def;
  out.copperBonus = inv.armorSetBonus();
  out.copperDef = inv.defense();

  inv.armor = { head: I.COBALTHELM, chest: I.COBALTCHEST, legs: I.COBALTLEGS };
  var cobaltPieces = ITEMS[I.COBALTHELM].def + ITEMS[I.COBALTCHEST].def + ITEMS[I.COBALTLEGS].def;
  out.cobaltPieces = cobaltPieces;
  out.cobaltBonus = inv.armorSetBonus();
  out.cobaltDef = inv.defense();

  // Meteor set: Space Gun costs no mana
  inv.armor = { head: I.METEORHELM, chest: I.METEORCHEST, legs: I.METEORLEGS };
  out.meteorActive = inv.setBonusActive('METEOR');
  p.hp = 1000; p.maxHp = 1000; p.mana = p.maxMana = 100; p.attackCd = 0; p.swingT = 0; p.manaRegenT = 999;
  inv.slots[0] = { id: I.SPACEGUN, count: 1 };
  inv.selected = 0;
  MOUSE.wx = p.x; MOUSE.wy = p.y - 1;
  var m0 = p.mana;
  p.tryMagic(game, ITEMS[I.SPACEGUN], I.SPACEGUN, inv.slots[0]);
  out.meteorFreeShot = p.mana === m0;

  // same gun in the copper set still costs mana
  inv.armor = { head: I.COPPERHELM, chest: I.COPPERCHEST, legs: I.COPPERLEGS };
  p.attackCd = 0; p.swingT = 0;
  var m1 = p.mana;
  p.tryMagic(game, ITEMS[I.SPACEGUN], I.SPACEGUN, inv.slots[0]);
  out.copperShotCost = m1 - p.mana;

  inv.armor = { head: null, chest: null, legs: null };
  inv.slots[0] = null;
  out.meteorDef = ITEMS[I.METEORHELM].def + ITEMS[I.METEORCHEST].def + ITEMS[I.METEORLEGS].def;
  return out;
});
check(results, 'B5: copper set grants +2 defense on top of the 3 pieces',
  b5.copperBonus === 2 && b5.copperDef === b5.copperPieces + 2, b5);
check(results, 'B5: cobalt set grants +3 defense on top of the 3 pieces',
  b5.cobaltBonus === 3 && b5.cobaltDef === b5.cobaltPieces + 3, b5);
check(results, 'B5: Meteor set is detected as active', b5.meteorActive === true, b5);
check(results, 'B5: Meteor set makes Space Gun cost no mana', b5.meteorFreeShot === true, b5);
check(results, 'B5: Space Gun still costs mana without the Meteor set', b5.copperShotCost > 0, b5);
note(results, 'Copper: pieces ' + b5.copperPieces + ' +2 -> ' + b5.copperDef + ' | Cobalt: pieces ' +
  b5.cobaltPieces + ' +3 -> ' + b5.cobaltDef + ' | copper-set Space Gun cost: ' + b5.copperShotCost);

// ---------- B2a: acorn planting ----------
const b2a = await page.evaluate(() => {
  __clearHostiles();
  var w = game.world, p = game.player;
  // A normal acorn tree can be 16 tiles tall, planted one tile above the
  // ground, with a rare crown four tiles above its top: scan all 21 tiles.
  var treeRoom = 21, tx = -1, gy = -1;
  for (var dx = 40; dx < 220; dx++) {
    var c = Math.floor(w.spawnX / TILE) + dx;
    var sy = w.surfaceY[c];
    if (w.get(c, sy) !== T.GRASS) continue;
    var ok = true;
    for (var yy = sy - treeRoom; yy < sy && ok; yy++) {
      for (var xx = c - 2; xx <= c + 2; xx++) if (w.get(xx, yy) !== T.AIR) { ok = false; break; }
    }
    if (ok) { tx = c; gy = sy; break; }
  }
  if (tx < 0) return { found: false };
  window.__resetPlayer();
  p.x = tx * TILE + 8; p.y = gy * TILE - 24; p.vx = 0; p.vy = 0;
  p.attackCd = 0; p.swingT = 0; p.useT = 0;
  __mod(I.ACORN, 3);
  if (!__selectItem(I.ACORN)) return { found: true, selected: false };
  MOUSE.wx = tx * TILE + 8; MOUSE.wy = (gy - 1) * TILE + 8;
  var before = __inv(I.ACORN);
  MOUSE.down = true;
  __FW(3);
  MOUSE.down = false;
  __FW(10);
  var after = __inv(I.ACORN);
  var trunk = 0, leaves = 0;
  for (var y2 = gy - treeRoom; y2 < gy; y2++) {
    if (w.get(tx, y2) === T.TREETRUNK) trunk++;
    for (var x2 = tx - 2; x2 <= tx + 2; x2++) {
      var lt = w.get(x2, y2);
      if (lt === T.LEAVES || lt === T.LEAVES_CORRUPT || lt === T.LEAVES_CRIMSON ||
          lt === T.LEAVES_HALLOW || lt === T.LEAVES_JUNGLE) leaves++;
    }
  }
  return { found: true, before: before, after: after, trunk: trunk, leaves: leaves };
});
check(results, 'B2a: acorn planting consumed the acorn and grew a tree',
  b2a.found && b2a.before === b2a.after + 1 && b2a.trunk >= 4 && b2a.leaves >= 4, b2a);
note(results, 'Planting: acorn ' + b2a.before + ' -> ' + b2a.after + ', trunk tiles ' + b2a.trunk + ', leaves ' + b2a.leaves);

// ---------- B2b: water physics ----------
const b2b = await page.evaluate(() => {
  __clearHostiles();
  var w = game.world, p = game.player;
  // Floating lab platform (sky, away from terrain): stone shelf, pond on top.
  var x0 = 240, x1 = 259, xm = (x0 + x1) >> 1, py = 20;
  // containing bowl under the hole so the drained water has a finite landing spot
  for (var x = x0 - 1; x <= x1 + 1; x++) { w.set(x, py, T.STONE); w.hp[w.idx(x, py)] = 9999; }
  // rim lips so the only sink is the hole (otherwise overflow drains off the edge)
  w.set(x0 - 1, py - 1, T.STONE); w.set(x1 + 1, py - 1, T.STONE);
  // containing tank under the hole: floor + side walls, so drained water stays put
  for (var f = xm - 2; f <= xm + 2; f++) { w.set(f, py + 40, T.STONE); w.hp[w.idx(f, py + 40)] = 9999; }
  for (var t2 = py + 35; t2 <= py + 39; t2++) { w.set(xm - 3, t2, T.STONE); w.set(xm + 3, t2, T.STONE); }
  for (var g = 0; g < 20; g++) { w.set(x0 + g, py - 1, T.WATER); }
  var pondWater = 0;
  for (var k = x0; k <= x1; k++) if (w.get(k, py - 1) === T.WATER) pondWater++;
  w.breakTile(xm, py); // punch a hole in the shelf; liquid wakes via breakTile
  for (var steps = 0; steps < 900; steps++) step(1 / 60);
  var leftInPond = 0;
  for (var k2 = x0; k2 <= x1; k2++) if (w.get(k2, py - 1) === T.WATER) leftInPond++;
  var caught = 0;
  for (var y2 = py; y2 <= py + 39; y2++)
    for (var tx2 = xm - 2; tx2 <= xm + 2; tx2++)
      if (w.get(tx2, y2) === T.WATER) caught++;
  var leaked = 0;
  for (var k3 = x0 - 3; k3 <= x1 + 3; k3++) if (w.get(k3, py - 1) === T.WATER) leaked++;
  for (var y3 = py + 40; y3 < py + 60; y3++)
    for (var k4 = xm - 3; k4 <= xm + 3; k4++) if (w.get(k4, y3) === T.WATER) leaked++;

  // second lab: water dropped onto lava forms obsidian
  var lx = 280, py2 = 20;
  w.set(lx, py2 + 3, T.STONE); // floor keeps the lava pool in place
  w.set(lx, py2 + 2, T.LAVA);
  w.set(lx, py2, T.WATER);
  w.set(lx, py2 + 1, T.STONE); // lid under the water
  w.breakTile(lx, py2 + 1);    // remove lid -> water falls into the lava below
  for (var s2 = 0; s2 < 120; s2++) step(1 / 60);
  var lavaCell = w.get(lx, py2 + 2);
  return { pondWater: pondWater, leftInPond: leftInPond, caught: caught, leaked: leaked, lavaCell: lavaCell };
});
check(results, 'B2b: pond fully drains when you dig under it', b2b.leftInPond === 0, b2b);
check(results, 'B2b: drained water is conserved in the landing column',
  b2b.caught === b2b.pondWater && b2b.leaked === 0, b2b);
check(results, 'B2b: water falling onto live lava hardens it into obsidian', b2b.lavaCell === 49, b2b); // 49 = T.OBSIDIAN (page-only constant)
note(results, 'Drain: pond ' + b2b.pondWater + ' -> left ' + b2b.leftInPond + ', caught ' + b2b.caught +
  ', leaked ' + b2b.leaked + ' | lava cell became: ' + b2b.lavaCell);

await assertNoBrowserErrors(results);
await finish(results, browser, 'b2b5check');
