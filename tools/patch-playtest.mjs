import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

// Focused, deterministic regressions for the progression patch. These are
// mechanism tests: synthetic trees, scripted damage and old-save fixtures.
const browser = await chromium.launch({ headless:true });
const results = [], errors = [];
function check(label, ok, detail) {
  results.push({ label, ok:!!ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${label}${detail ? ' ' + JSON.stringify(detail) : ''}`);
}
try {
  const page = await browser.newPage();
  // No concurrent animation steps while fixtures and save data are inspected.
  await page.addInitScript(() => { window.requestAnimationFrame = () => 0; });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(pathToFileURL(path.resolve('index.html')).href);
  await page.evaluate(() => { buildGame(7357, 'corrupt'); AudioSys.enabled = false; });

  const trees = await page.evaluate(() => {
    const w = game.world, p = game.player, x = 1000, ground = 100;
    const leaves = t => !!FELL_LEAVES[t];
    function clear() {
      for (let xx = x - 14; xx <= x + 16; xx++) for (let yy = ground - 35; yy <= ground + 4; yy++) {
        w.set(xx, yy, yy >= ground ? T.DIRT : T.AIR);
      }
    }
    function tree(cx, tile = T.TREETRUNK) {
      for (let yy = ground - 1; yy >= ground - 8; yy--) w.set(cx, yy, tile);
      for (let yy = ground - 10; yy <= ground - 7; yy++) for (let dx = -2; dx <= 2; dx++) {
        if (w.get(cx + dx, yy) === T.AIR) w.set(cx + dx, yy, T.LEAVES);
      }
    }
    clear(); tree(x);
    w.set(x - 1, ground - 3, T.TREETRUNK);
    w.set(x + 1, ground - 1, T.WOOD);
    const beforeWood = p.inventory.countOf(I.WOOD);
    p.x = x * TILE - 24; p.y = (ground - 1) * TILE;
    p.inventory.selected = p.inventory.slots.findIndex(s => s && s.id === I.COPPERAXE);
    MOUSE.wx = x * TILE + 8; MOUSE.wy = (ground - 1) * TILE + 8;
    for (let f = 0; f < 120 && w.get(x, ground - 1) !== T.AIR; f++) {
      p.mineCd = 0; p.tryMine(game, ITEMS[I.COPPERAXE], p.inventory.selectedItem());
    }
    let remaining = 0;
    for (let xx = x - 3; xx <= x + 3; xx++) for (let yy = ground - 12; yy < ground; yy++) {
      const t = w.get(xx, yy);
      if (t === T.TREETRUNK || leaves(t)) remaining++;
    }
    const isolated = { remaining, wood:p.inventory.countOf(I.WOOD) - beforeWood,
      builtWood:w.get(x + 1, ground - 1) === T.WOOD };
    // The small placed wood block is NOT a living trunk and must not retain leaves.
    clear(); tree(x);
    w.breakTile(x, ground - 4);
    const mid = w.get(x, ground - 3) === T.TREETRUNK && w.get(x, ground - 2) === T.TREETRUNK && w.get(x, ground - 8) === T.AIR;
    // Pathological two-column spacing: snapshot EVERY B crown tile, including
    // shared leaves. Felling A may retain shared leaves but must not remove B.
    clear(); tree(x); tree(x + 2);
    const neighbor = [];
    for (let xx = x; xx <= x + 4; xx++) for (let yy = ground - 12; yy < ground; yy++) {
      if (leaves(w.get(xx, yy)) || (xx === x + 2 && w.get(xx, yy) === T.TREETRUNK)) neighbor.push({ x:xx, y:yy, t:w.get(xx, yy) });
    }
    w.breakTile(x, ground - 1);
    const neighbourIntact = neighbor.every(t => w.get(t.x, t.y) === t.t);
    clear(); tree(x); tree(x + 4, T.WOOD);
    const living = [];
    for (let xx = x + 2; xx <= x + 6; xx++) for (let yy = ground - 12; yy < ground; yy++) {
      if (leaves(w.get(xx, yy)) || w.get(xx, yy) === T.WOOD) living.push({ x:xx, y:yy, t:w.get(xx, yy) });
    }
    w.breakTile(x, ground - 1);
    const livingIntact = living.every(t => w.get(t.x, t.y) === t.t);
    // Overflow wood remains recoverable as pickups.
    clear(); tree(x);
    p.inventory.slots = Array.from({ length:p.inventory.slots.length }, () => ({ id:I.STONE, count:ITEMS[I.STONE].maxStack }));
    const beforePickups = game.pickups.filter(pk => pk.item === I.WOOD).reduce((n, pk) => n + pk.count, 0);
    w.breakTile(x, ground - 1);
    const overflow = game.pickups.filter(pk => pk.item === I.WOOD).reduce((n, pk) => n + pk.count, 0) - beforePickups;
    return { isolated, mid, neighbourIntact, livingIntact, overflow };
  });
  check('Axe mining clears isolated tree/canopy', trees.isolated.remaining === 0, trees.isolated);
  check('Tree wood paid exactly once (8 trunk + 1 nub)', trees.isolated.wood === 9);
  check('Player-built wood survives', trees.isolated.builtWood);
  check('Mid-chop preserves stump', trees.mid);
  check('Adjacent tree retains every trunk/shared crown tile', trees.neighbourIntact);
  check('Living wood and its canopy survive', trees.livingIntact);
  check('Full inventory spills cascade wood', trees.overflow === 7, { overflow:trees.overflow });

  const guardianDraw = await page.evaluate(() => {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const ctx = c.getContext('2d'), e = makeEntity(E.DUNGEONGUARDIAN, 0, 0);
    drawEnemy(ctx, e, { x:0, y:0 }, 128, 128);
    const pixels = ctx.getImageData(45, 35, 38, 54).data;
    let painted = 0;
    for (let i = 3; i < pixels.length; i += 4) if (pixels[i]) painted++;
    return painted;
  });
  check('Dungeon Guardian has a visible skull render', guardianDraw > 500, { pixels:guardianDraw });

  const render = await page.evaluate(() => {
    const ctx = canvas.getContext('2d');
    game.player.x = NaN; game.player.y = Infinity; game.player.vx = NaN; game.player.vy = Infinity;
    game.cam.x = NaN; game.cam.y = NaN;
    updateCamera(1 / 60);
    const recovered = [game.player.x, game.player.y, game.player.vx, game.player.vy, game.cam.x, game.cam.y].every(Number.isFinite);
    drawLighting(game, ctx, { x:NaN, y:NaN }, canvas.width, canvas.height);
    game.player.x = NaN;
    drawMinimap(game, ctx);
    game.mapPanX = NaN; game.mapPanY = Infinity;
    drawFullMap(game, ctx);
    game.player.x = game.world.spawnX;
    return recovered;
  });
  check('NaN player/camera recovers including velocity; rendering guards do not throw', render);

  const repair = await page.evaluate(async () => {
    activeWorldId = 'patch-regression'; activeWorldName = 'Patch regression';
    // A real old-world fixture: remove hellstone from the Underworld, retaining
    // all other saved tiles, then mark it PATCH 2.
    const w = game.world;
    let freshHellstone = 0;
    for (let i = w.hellY * w.W; i < w.tiles.length; i++) {
      if (w.tiles[i] === T.HELLSTONE) { freshHellstone++; w.tiles[i] = T.ASH; }
    }
    w.postGenHp();
    const old = saveSnapshot(); old.patch = 2;
    await putWorldRecord({ id:activeWorldId, name:activeWorldName, createdAt:1, updatedAt:1, data:old });
    const original = unpackTiles(old.tiles, w.W * w.H);
    const a = original.slice(), b = original.slice();
    const added = migrateHellstoneVeins(old, a, w);
    migrateHellstoneVeins(old, b, w);
    let deterministic = true, onlyAsh = true;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) deterministic = false;
      if (a[i] !== original[i] && !(original[i] === T.ASH && a[i] === T.HELLSTONE)) onlyAsh = false;
    }
    applySaveData(old);
    let hpOk = true, hellstone = 0;
    for (let i = 0; i < game.world.tiles.length; i++) if (game.world.tiles[i] === T.HELLSTONE) {
      hellstone++;
      if (!game.world.hp[i]) hpOk = false;
    }
    let backup;
    for (let attempt = 0; attempt < 50 && !backup; attempt++) {
      backup = await getWorldRecord(activeWorldId + '-savebackup-hellstone');
      if (!backup) await new Promise(resolve => setTimeout(resolve, 50));
    }
    const saved = await saveGame(false);
    const rec = await getWorldRecord(activeWorldId);
    const repairedTiles = game.world.tiles.slice();
    applySaveData(rec.data);
    const idempotent = repairedTiles.every((t, i) => t === game.world.tiles[i]);
    return { freshHellstone, added, hellstone, hpOk, deterministic, onlyAsh, saved, patch:rec.data.patch,
      backup:!!backup && backup.data.patch === 2 && backup.data.tiles === old.tiles && !!backup.deletedAt,
      idempotent };
  });
  check('Fresh generation contains Underworld hellstone', repair.freshHellstone > 0, repair);
  check('Old-world repair is deterministic and changes only Ash', repair.added > 0 && repair.deterministic && repair.onlyAsh);
  check('Loaded repair gives hellstone mining HP', repair.hellstone > 0 && repair.hpOk);
  check('Hidden backup preserves exact pre-repair tile data', repair.backup);
  check('PATCH marker persists and reload is tile-idempotent', repair.saved && repair.patch === 3 && repair.idempotent);
  check('No uncaught browser errors', errors.length === 0, errors);
} catch (error) {
  check('Harness completed', false, error.stack);
} finally {
  await browser.close();
  mkdirSync('test-results', { recursive:true });
  writeFileSync('test-results/patch-playtest.json', JSON.stringify({ seed:7357, results, errors }, null, 2));
}
console.log(`${results.filter(r => r.ok).length}/${results.length} PASS`);
if (results.some(r => !r.ok)) process.exitCode = 1;
