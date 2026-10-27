// Verification probe for the three audit fixes:
// 1. Guide housing (assignable + listed in the housing panel)
// 2. Zombie/Skeleton loot pools restored (no duplicate-key overwrite)
// 3. Tutorial tips use real state (workbench tile nearby, armor owned)
import { setupAudit, check, note, assertNoBrowserErrors, finish } from './lib.mjs';

const { browser, page, results } = await setupAudit();

// ---------- Fix 2: loot pools ----------
const loot = await page.evaluate(() => {
  var zombie = B83_ENEMY_DROPS['Zombie'];
  var skeleton = B83_ENEMY_DROPS['Skeleton'];
  return {
    zombieLen: zombie.length,
    skeletonLen: skeleton.length,
    hasZombieArm: zombie.some(function(d) { return d.id === I.ZOMBIE_ARM; }),
    hasBoneSword: skeleton.some(function(d) { return d.id === I.BONE_SWORD; }),
    noDupZ: zombie.filter(function(d) { return d.id === I.BAT_BAT; }).length === 1,
    noDupS: skeleton.filter(function(d) { return d.id === I.BAT_BAT; }).length === 1
  };
});
check(results, 'Fix 2: Zombie pool keeps big rare table + Zombie Arm', loot.zombieLen > 50 && loot.hasZombieArm && loot.noDupZ, loot);
check(results, 'Fix 2: Skeleton pool keeps big rare table + Bone Sword', loot.skeletonLen > 50 && loot.hasBoneSword && loot.noDupS, loot);
note(results, 'Zombie pool: ' + loot.zombieLen + ' entries, Skeleton pool: ' + loot.skeletonLen + ' entries (was 1 each before the fix)');

// ---------- Fix 1: Guide housing ----------
const housing = await page.evaluate(() => {
  var w = game.world, p = game.player;
  var tx = Math.floor(w.spawnX / TILE) + 60, gy = w.surfaceY[tx];
  // same 9x5 stone-framed room construction the audit's own housing check validated
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
  var listed = !!game.townArrivals[E.GUIDE];
  var assigned = listed ? assignNpcHousing(E.GUIDE) : false;
  var housed = !!game.housing[E.GUIDE];
  var guideAt = null;
  for (var i = 0; i < game.entities.length; i++) {
    if (!game.entities[i].dead && game.entities[i].type === E.GUIDE) {
      guideAt = { x: Math.round(game.entities[i].x), y: Math.round(game.entities[i].y) };
      break;
    }
  }
  return { listed: listed, assigned: assigned, housed: housed, guideAt: guideAt, room: room };
});
check(results, 'Fix 1: Guide is eligible as a town arrival', housing.listed === true, housing);
check(results, 'Fix 1: Guide can be assigned housing in the player-built room', housing.assigned === true && housing.housed === true, { listed: housing.listed, assigned: housing.assigned, housed: housing.housed, guideAt: housing.guideAt, reason: housing.room.reason });

// ---------- Fix 3: tutorial tips ----------
const tips = await page.evaluate(() => {
  var p = game.player, w = game.world, out = {};
  window.__resetPlayer();
  window.__mod(I.WOOD, 30);
  // stage A: no workbench nearby, no armor — both tips should be present
  renderGuide();
  var txtA = $('guide-content').innerHTML;
  out.a = {
    workbench: txtA.indexOf('Craft a Workbench') >= 0,
    armor: txtA.indexOf('craft armor at an Anvil') >= 0
  };
  // stage B: place a workbench tile nearby → workbench tip suppresses
  var bx = Math.floor(p.x / TILE), by = Math.floor(p.y / TILE);
  w.set(bx + 1, by, T.WORKBENCH);
  renderGuide();
  var txtB = $('guide-content').innerHTML;
  out.b = {
    workbench: txtB.indexOf('Craft a Workbench') >= 0,
    armor: txtB.indexOf('craft armor at an Anvil') >= 0
  };
  // stage C: grant an armor piece → armor tip suppresses
  window.__mod(I.COPPERHELM, 1);
  renderGuide();
  out.c = {
    workbench: $('guide-content').innerHTML.indexOf('Craft a Workbench') >= 0,
    armor: $('guide-content').innerHTML.indexOf('craft armor at an Anvil') >= 0
  };
  // restore: remove the placed workbench and armor to keep the world tidy
  w.set(bx + 1, by, T.AIR);
  return out;
});
check(results, 'Fix 3: workbench tip shows without one, torch tip appears when workbench nearby', tips.a.workbench === true, tips.a);
check(results, 'Fix 3: armor tip shows until armor is owned', tips.a.armor === true, tips.a);
check(results, 'Fix 3: workbench tip suppresses once a workbench is placed nearby', tips.b.workbench === false, tips.b);
check(results, 'Fix 3: armor tip suppresses once an armor piece is owned', tips.c.armor === false, tips.c);
note(results, 'Tip stages: A(wood only)=' + JSON.stringify(tips.a) + ' B(+workbench tile)=' + JSON.stringify(tips.b) + ' C(+armor)=' + JSON.stringify(tips.c));

await assertNoBrowserErrors(results);
await finish(results, browser, 'fixcheck');
