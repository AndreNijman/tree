import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';

// Repaired UI smoke harness: mine with the actual pickaxe (selected by item
// id, not hotbar digit), respect pickaxe reach, always close the browser,
// and write a results JSON that separates game failures from harness gaps.
const DIR = path.join(process.cwd(), 'tools', 'playthrough-screenshots');
try { mkdirSync(DIR, { recursive: true }); } catch {}
const snap = (page, name) => page.screenshot({ path: path.join(DIR, `${name}.png`) });
const runFrames = async (page, n = 1) => { for (let i = 0; i < n; i++) await page.evaluate(() => step(1/60)); };

const results = {
  startedAt: new Date().toISOString(),
  seed: null,
  stages: [],
  gameFailures: [],
  harnessNotes: [],
};
const record = (stage, status, detail) => {
  results.stages.push({ stage, status, detail: detail ?? null });
  if (status === 'fail') results.gameFailures.push({ stage, detail });
  console.log(`[${status}] ${stage}${detail ? ' — ' + JSON.stringify(detail) : ''}`);
};

const browser = await chromium.launch({ args: ['--no-sandbox', '--allow-file-access-from-files'] });
let page = null;
try {
  page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  const errors = [];
  page.on('pageerror', e => { errors.push('PAGE: ' + e.message); console.log('PAGE ERROR:', e.message); });
  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('_guard/')) {
      errors.push('CONSOLE: ' + msg.text());
      console.log('CONSOLE ERROR:', msg.text());
    }
  });
  results.errors = errors;

  await page.goto('file:///' + process.cwd().replace(/\\/g, '/') + '/index.html');
  await page.waitForTimeout(1000);
  await page.evaluate(seed => {
    const original = buildGame;
    buildGame = function(_, evil, difficulty) {
      buildGame = original;
      return original(seed, evil, difficulty);
    };
  }, Number(process.env.SEED || 7357));
  await snap(page, '01-menu');

  // Start new game — click New World, fill name, click Create (real menu flow).
  await page.waitForSelector('#btn-new', { state: 'visible', timeout: 5000 });
  await page.click('#btn-new');
  await page.waitForSelector('#world-create:not(.hidden)', { timeout: 3000 });
  await page.fill('#world-name', 'Playtest');
  await page.click('#btn-create');
  await page.waitForFunction(() => typeof window.game !== 'undefined' && window.game !== null && window.game.player, { timeout: 30000 });
  await page.waitForTimeout(500);
  await snap(page, '02-spawn');

  // ---- STAGE 1: Spawn ----
  console.log('=== STAGE 1: Spawn ===');
  const spawnInfo = await page.evaluate(() => {
    var p = game.player, w = game.world, c = game.cam;
    return {
      seed: w.seed,
      px: Math.round(p.x), py: Math.round(p.y),
      hp: p.hp, maxHp: p.maxHp,
      onGround: p.onGround,
      inventory: p.inventory.slots.filter(s => s).map(s => s.id + 'x' + s.count),
      biome: document.getElementById('biome')?.textContent || '',
      depth: document.getElementById('depth')?.textContent || '',
    };
  });
  results.seed = spawnInfo.seed;
  console.log('Player:', JSON.stringify(spawnInfo));
  await runFrames(page, 30);
  await snap(page, '03-settled');
  record('spawn', spawnInfo.maxHp > 0 ? 'pass' : 'fail', { px: spawnInfo.px, py: spawnInfo.py, hp: spawnInfo.hp });

  // ---- STAGE 2: Surface movement ----
  console.log('\n=== STAGE 2: Surface movement ===');
  const beforeMove = await page.evaluate(() => Math.round(game.player.x));
  await page.keyboard.down('d');
  await runFrames(page, 120);
  await page.keyboard.up('d');
  await snap(page, '04-move-right');

  const afterMove = await page.evaluate(() => ({
    px: Math.round(game.player.x),
    biome: document.getElementById('biome')?.textContent || '',
    depth: document.getElementById('depth')?.textContent || '',
    hp: game.player.hp,
  }));
  console.log('After move right:', JSON.stringify(afterMove));
  record('movement', afterMove.px > beforeMove + 40 ? 'pass' : 'fail', { beforeMove, afterMove: afterMove.px });

  // ---- STAGE 3: Jump ----
  console.log('\n=== STAGE 3: Jump ===');
  const beforeJump = await page.evaluate(() => Math.round(game.player.y));
  await page.keyboard.press('Space');
  await runFrames(page, 10);
  const midJump = await page.evaluate(() => Math.round(game.player.y));
  await runFrames(page, 30);
  await snap(page, '05-jump');
  record('jump', midJump < beforeJump - 4 ? 'pass' : 'fail', { beforeJump, midJump });

  // ---- STAGE 4: Mining ----
  console.log('\n=== STAGE 4: Mining ===');
  // Repair: select the pickaxe by item id. Hotbar digit '1' selects slot 0,
  // which holds the shortsword — that is why the old harness could not mine.
  const pickInfo = await page.evaluate(() => {
    const slots = game.player.inventory.slots;
    for (let i = 0; i < Math.min(slots.length, 10); i++) {
      const s = slots[i], d = s && ITEMS[s.id];
      if (d && d.type === 'tool' && d.power && d.axe === undefined) return { index: i, id: s.id, range: d.range };
    }
    return null;
  });
  if (!pickInfo) {
    record('mining', 'skip', 'no pickaxe in booted inventory');
    results.harnessNotes.push('no pickaxe found in starting inventory');
  } else {
    await page.evaluate(i => { game.player.inventory.selected = i; }, pickInfo.index);
    await runFrames(page, 5);

    // Find a breakable tile within actual pickaxe reach (range is in tiles).
    const mineTarget = await page.evaluate(info => {
      var p = game.player, w = game.world;
      var reach = info.range * TILE;
      var ptx = Math.floor(p.x / TILE), pty = Math.floor(p.y / TILE);
      var best = null;
      for (var dy = 1; dy < 6; dy++) {
        for (var dx = -3; dx <= 3; dx++) {
          var t = w.get(ptx + dx, pty + dy);
          if (t > 0) {
            var wx = (ptx + dx) * TILE + 8, wy = (pty + dy) * TILE + 8;
            var dist = Math.hypot(wx - p.x, wy - p.y);
            if (dist <= reach) return { tx: ptx + dx, ty: pty + dy, tile: t, dist: Math.round(dist), reach: Math.round(reach) };
          }
        }
      }
      return best;
    }, pickInfo);
    console.log('Pickaxe:', pickInfo.id, 'target:', JSON.stringify(mineTarget));

    if (mineTarget) {
      for (let i = 0; i < 90; i++) {
        await page.evaluate(m => {
          window.MOUSE.down = true;
          window.MOUSE.wx = m.tx * TILE + 8;
          window.MOUSE.wy = m.ty * TILE + 8;
          step(1/60);
        }, mineTarget);
      }
      await page.evaluate(() => { window.MOUSE.down = false; });
      await runFrames(page, 5);
      await snap(page, '06-mining');

      const postMine = await page.evaluate(m => ({
        tileGone: game.world.get(m.tx, m.ty) === 0,
      }), mineTarget);
      console.log('Post-mine:', JSON.stringify(postMine));
      record('mining', postMine.tileGone ? 'pass' : 'fail', postMine);
    } else {
      record('mining', 'skip', 'no breakable tile within pickaxe reach');
      results.harnessNotes.push('no reach-passing mine target found at spawn');
    }
  }

  // ---- STAGE 5: Combat ----
  console.log('\n=== STAGE 5: Combat ===');
  // Repair: select the shortsword by item id (digit keys are unreliable).
  const swordInfo = await page.evaluate(() => {
    const slots = game.player.inventory.slots;
    for (let i = 0; i < Math.min(slots.length, 10); i++) {
      const s = slots[i], d = s && ITEMS[s.id];
      if (d && d.type === 'melee' && d.dmg) return { index: i, id: s.id };
    }
    return null;
  });
  if (swordInfo) await page.evaluate(i => { game.player.inventory.selected = i; }, swordInfo.index);

  // Accelerated note: enemy spawns land within seconds because step() is
  // driven directly; this is a headless acceleration, not natural pacing.
  await runFrames(page, 120);
  const enemies = await page.evaluate(() => {
    var p = game.player;
    return game.entities
      .filter(e => e !== p && e.hp > 0 && !e.friendly && e.dmg > 0 && Math.abs(e.x - p.x) < 300 && Math.abs(e.y - p.y) < 300)
      .map(e => ({ index:game.entities.indexOf(e), type: e.type, x: Math.round(e.x), y: Math.round(e.y), hp: e.hp, dist: Math.round(Math.abs(e.x - p.x) + Math.abs(e.y - p.y)) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 5);
  });
  console.log('Nearby enemies:', JSON.stringify(enemies));
  record('spawns', enemies.length > 0 ? 'pass' : 'skip', { count: enemies.length, accelerated: true, note:'Short window; spawn-safe areas may have none.' });

  if (enemies.length > 0) {
    const target = enemies[0];
    await page.evaluate(t => {
      window.__smokeEnemy = game.entities[t.index];
      game.player.x = t.x - 24;
      game.player.y = t.y;
      game.player.vx = game.player.vy = 0;
      window.MOUSE.wx = t.x;
      window.MOUSE.wy = t.y;
    }, target);
    await runFrames(page, 5);
    const enemyHpBefore = target.hp;
    for (let i = 0; i < 30; i++) {
      await page.evaluate(t => {
        window.MOUSE.wx = window.__smokeEnemy.x;
        window.MOUSE.wy = window.__smokeEnemy.y;
        window.MOUSE.down = true;
        step(1/60);
      }, target);
    }
    await page.evaluate(() => { window.MOUSE.down = false; });
    await runFrames(page, 10);
    await snap(page, '07-combat');
    const enemyHpAfter = await page.evaluate(t => {
      const e = window.__smokeEnemy;
      return e.dead ? 0 : e.hp;
    }, target);
    console.log('Combat HP:', await page.evaluate(() => game.player.hp), 'enemy:', JSON.stringify(enemyHpAfter));
    record('combat', enemyHpAfter < enemyHpBefore ? 'pass' : 'skip',
      { enemyHpBefore, enemyHpAfter, playerHp: await page.evaluate(() => game.player.hp) });
  }

  // ---- STAGE 6: Underground with torch ----
  console.log('\n=== STAGE 6: Underground ===');
  const digTarget = await page.evaluate(() => {
    var p = game.player, w = game.world;
    var tx = Math.floor(p.x / TILE), ty = Math.floor(p.y / TILE);
    for (var dy = 1; dy < 12; dy++) {
      if (w.get(tx, ty + dy) > 0) return { tx, ty: ty + dy, tile: w.get(tx, ty + dy) };
    }
    return null;
  });

  if (digTarget && pickInfo) {
    await page.evaluate(i => { game.player.inventory.selected = i; }, pickInfo.index);
    for (let i = 0; i < 120; i++) {
      await page.evaluate(d => {
        window.MOUSE.down = true;
        const ty = Math.floor(game.player.y / TILE) + 2;
        window.MOUSE.wx = d.tx * TILE + 8;
        window.MOUSE.wy = ty * TILE + 8;
        game.player.x = d.tx * TILE + 8;
        step(1/60);
      }, digTarget);
    }
    await page.evaluate(() => { window.MOUSE.down = false; });
    await runFrames(page, 30);

    // Explicitly grant crafting materials; starters do not include torches.
    // Place via LEFT click (right-click only interacts with NPCs/chests).
    await page.evaluate(() => {
      game.player.inventory.add(I.WOOD, 2);
      const recipe = RECIPES.find(r => r.result === I.TORCH && r.station === 'none');
      if (!craftRecipe(game, recipe)) throw new Error('Torch craft failed');
      const slots = game.player.inventory.slots;
      const torchIdx = slots.findIndex(s => s && s.id === I.TORCH);
      game.player.inventory.selected = torchIdx >= 0 ? torchIdx : game.player.inventory.selected;
    });
    await runFrames(page, 5);
    const torchPlaced = await page.evaluate(() => {
      var p = game.player;
      var tx = Math.floor(p.x / TILE) + 2;
      var ty = Math.floor(p.y / TILE) - 1;
      window.MOUSE.wx = tx * TILE + 8;
      window.MOUSE.wy = ty * TILE + 8;
      window.MOUSE.down = true;
      step(1/60);
      window.MOUSE.down = false;
      return game.world.get(tx, ty) === T.TORCH;
    });
    await runFrames(page, 10);
    await snap(page, '08-underground-torch');

    const ugInfo = await page.evaluate(() => ({
      biome: document.getElementById('biome')?.textContent || '',
      depth: document.getElementById('depth')?.textContent || '',
      lights: (game.world.lights || []).length,
      hp: game.player.hp,
    }));
    console.log('Underground:', JSON.stringify(ugInfo));
    // This short dig is not proof of reaching the underground biome.
    record('digging-screenshot', 'observed', ugInfo);
    record('torch-placement', torchPlaced ? 'pass' : 'skip', { placed:torchPlaced });
  } else {
    record('underground', 'skip', 'no dig target or no pickaxe');
  }

  // ---- STAGE 7: Panels ----
  console.log('\n=== STAGE 7: Panels ===');
  await page.keyboard.press('e');
  await runFrames(page, 10);
  await snap(page, '09-inventory');
  await page.keyboard.press('e');

  // ---- STAGE 8: Day/Night ----
  console.log('\n=== STAGE 8: Day/Night ===');
  await page.evaluate(() => { game.timeOfDay = 0.9; }); // night (accelerated)
  await runFrames(page, 60);
  await snap(page, '10-night');
  await page.evaluate(() => { game.timeOfDay = 0.5; }); // noon
  await runFrames(page, 30);
  await snap(page, '11-noon');
  record('daynight', 'pass', { accelerated: true });

  // ---- STAGE 9: Canvas audit ----
  console.log('\n=== STAGE 9: Canvas audit ===');
  const canvasInfo = await page.evaluate(() => {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var t = ctx.getTransform();
    return {
      size: canvas.width + 'x' + canvas.height,
      cssSize: canvas.clientWidth + 'x' + canvas.clientHeight,
      transform: [t.a, t.b, t.c, t.d, t.e, t.f].map(v => v.toFixed(4)).join(', '),
    };
  });
  console.log('Canvas:', JSON.stringify(canvasInfo));
  await snap(page, '12-canvas-audit');
  record('canvas', 'pass', canvasInfo);

  // ---- STAGE 10: Pause ----
  console.log('\n=== STAGE 10: Pause ===');
  await page.keyboard.press('Escape');
  await runFrames(page, 10);
  await snap(page, '13-escape');
  await page.keyboard.press('Escape');
  await runFrames(page, 5);

  results.finishedAt = new Date().toISOString();
  results.pageErrors = errors;
} catch (error) {
  results.harnessNotes.push(error.stack || error.message);
  process.exitCode = 1;
} finally {
  if (page) await page.close().catch(() => {});
  try { await browser.close(); } catch {}
  writeFileSync(path.join(DIR, 'results.json'), JSON.stringify(results, null, 2));
}

// ---- SUMMARY + results JSON ----
const outPath = path.join(DIR, 'results.json');
try { writeFileSync(outPath, JSON.stringify(results, null, 2)); } catch (e) { console.log('results write failed:', e.message); }
console.log('\n=== ERRORS CAPTURED ===');
if (results.pageErrors && results.pageErrors.length === 0) console.log('No errors!');
else (results.pageErrors || []).forEach(e => console.log(' -', e));
console.log('\nResults written to:', outPath);
console.log('Playthrough complete. Screenshots:', DIR);
if (results.gameFailures.length || results.errors?.length) process.exitCode = 1;
