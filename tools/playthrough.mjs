import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';

const DIR = path.join(process.cwd(), 'tools', 'playthrough-screenshots');
try { mkdirSync(DIR, { recursive: true }); } catch {}
const snap = (page, name) => page.screenshot({ path: path.join(DIR, `${name}.png`) });
const runFrames = async (page, n = 1) => { for (let i = 0; i < n; i++) await page.evaluate(() => step(1/60)); };

const browser = await chromium.launch({ args: ['--no-sandbox', '--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

const errors = [];
page.on('pageerror', e => { errors.push('PAGE: ' + e.message); console.log('PAGE ERROR:', e.message); });
page.on('console', msg => {
  if (msg.type() === 'error' && !msg.text().includes('_guard/')) {
    errors.push('CONSOLE: ' + msg.text());
    console.log('CONSOLE ERROR:', msg.text());
  }
});

await page.goto('file:///' + process.cwd().replace(/\\/g, '/') + '/index.html');
await page.waitForTimeout(1000);
await snap(page, '01-menu');

// Start new game — click New World, fill name, click Create
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
    px: Math.round(p.x), py: Math.round(p.y),
    hp: p.hp, maxHp: p.maxHp,
    onGround: p.onGround,
    inventory: p.inventory.slots.filter(s => s).map(s => s.id + 'x' + s.count),
    biome: document.getElementById('biome')?.textContent || '',
    depth: document.getElementById('depth')?.textContent || '',
  };
});
console.log('Player:', JSON.stringify(spawnInfo));
await runFrames(page, 30);
await snap(page, '03-settled');

// ---- STAGE 2: Surface movement ----
console.log('\n=== STAGE 2: Surface movement ===');
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

// ---- STAGE 3: Jump ----
console.log('\n=== STAGE 3: Jump ===');
await page.keyboard.press('Space');
await runFrames(page, 20);
await snap(page, '05-jump');

// ---- STAGE 4: Mining ----
console.log('\n=== STAGE 4: Mining ===');
await page.keyboard.press('1'); // select pickaxe
await runFrames(page, 5);

// Find a breakable tile and mine it
const mineResult = await page.evaluate(() => {
  var p = game.player, w = game.world;
  var tx = Math.floor(p.x / 16), ty = Math.floor(p.y / 16);
  for (var dy = 2; dy < 15; dy++) {
    for (var dx = -2; dx <= 2; dx++) {
      var t = w.get(tx + dx, ty + dy);
      if (t > 0) return { tx: tx + dx, ty: ty + dy, tile: t };
    }
  }
  return null;
});
console.log('Found tile:', JSON.stringify(mineResult));

if (mineResult) {
  // Mine it by clicking at it
  await page.evaluate((m) => {
    window.MOUSE.wx = m.tx * 16 + 8;
    window.MOUSE.wy = m.ty * 16 + 8;
  }, mineResult);
  // Mine for many frames
  for (let i = 0; i < 60; i++) {
    await page.evaluate((m) => {
      window.MOUSE.down = true;
      window.MOUSE.wx = m.tx * 16 + 8;
      window.MOUSE.wy = m.ty * 16 + 8;
      step(1/60);
    }, mineResult);
  }
  await page.evaluate(() => { window.MOUSE.down = false; });
  await runFrames(page, 5);
  await snap(page, '06-mining');

  const postMine = await page.evaluate((m) => ({
    tileGone: game.world.get(m.tx, m.ty) === 0,
    inv: game.player.inventory.slots.filter(s => s).map(s => s.id + 'x' + s.count).join(', ')
  }), mineResult);
  console.log('Post-mine:', JSON.stringify(postMine));
}

// ---- STAGE 5: Combat ----
console.log('\n=== STAGE 5: Combat ===');
await page.keyboard.press('2'); // select sword

// Wait for enemies to spawn (they need time)
await runFrames(page, 120);
const enemies = await page.evaluate(() => {
  var p = game.player;
  return game.entities
    .filter(e => e !== p && e.hp > 0 && !e.friendly && e.dmg > 0 && Math.abs(e.x - p.x) < 300 && Math.abs(e.y - p.y) < 300)
    .map(e => ({ type: e.type, x: Math.round(e.x), y: Math.round(e.y), hp: e.hp, dist: Math.round(Math.abs(e.x - p.x) + Math.abs(e.y - p.y)) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 5);
});
console.log('Nearby enemies:', JSON.stringify(enemies));

if (enemies.length > 0) {
  // Move toward and attack
  const target = enemies[0];
  await page.evaluate((t) => {
    game.player.x = t.x - 40;
    game.player.y = t.y;
    window.MOUSE.wx = t.x;
    window.MOUSE.wy = t.y;
  }, target);
  await runFrames(page, 5);

  for (let i = 0; i < 30; i++) {
    await page.evaluate((t) => {
      window.MOUSE.wx = t.x;
      window.MOUSE.wy = t.y;
      window.MOUSE.down = true;
      step(1/60);
    }, target);
  }
  await page.evaluate(() => { window.MOUSE.down = false; });
  await runFrames(page, 10);
  await snap(page, '07-combat');
  console.log('Combat HP:', await page.evaluate(() => game.player.hp));
} else {
  console.log('No enemies nearby, waiting more...');
  await runFrames(page, 120);
  await snap(page, '07-combat-wait');
}

// ---- STAGE 6: Underground with torch ----
console.log('\n=== STAGE 6: Underground ===');
await page.keyboard.press('5'); // select torch

// Find surface below and dig down
const digInfo = await page.evaluate(() => {
  var p = game.player, w = game.world;
  var tx = Math.floor(p.x / 16), ty = Math.floor(p.y / 16);
  // Find the first solid tile below
  for (var dy = 1; dy < 20; dy++) {
    if (w.get(tx, ty + dy) > 0) {
      return { tx: tx, ty: ty + dy, tile: w.get(tx, ty + dy) };
    }
  }
  return null;
});
console.log('Dig target:', JSON.stringify(digInfo));

if (digInfo) {
  // Switch to pickaxe, dig a shaft
  await page.keyboard.press('1');
  await runFrames(page, 5);

  for (let i = 0; i < 60; i++) {
    await page.evaluate((d) => {
      window.MOUSE.down = true;
      window.MOUSE.wx = d.tx * 16 + 8;
      window.MOUSE.wy = d.ty * 16 + 8;
      game.player.x = d.tx * 16;
      game.player.y = (d.ty - 3) * 16;
      step(1/60);
    }, digInfo);
  }
  await page.evaluate(() => { window.MOUSE.down = false; });
  await runFrames(page, 5);

  // Drop into the hole
  for (let i = 0; i < 30; i++) await page.evaluate(() => step(1/60));

  // Now place torch
  await page.keyboard.press('5');
  await runFrames(page, 5);

  await page.evaluate(() => {
    var p = game.player, w = game.world;
    var tx = Math.floor(p.x / 16) + 2;
    var ty = Math.floor(p.y / 16) - 1;
    window.MOUSE.wx = tx * 16 + 8;
    window.MOUSE.wy = ty * 16 + 8;
    window.MOUSE.rightJust = true;
    window.MOUSE.right = true;
    step(1/60);
    window.MOUSE.right = false;
    window.MOUSE.rightJust = false;
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
}

// ---- STAGE 7: Panels ----
console.log('\n=== STAGE 7: Panels ===');
// Inventory
await page.keyboard.press('e');
await runFrames(page, 10);
await snap(page, '09-inventory');
await page.keyboard.press('e');

// ---- STAGE 8: Day/Night ----
console.log('\n=== STAGE 8: Day/Night ===');
await page.evaluate(() => { game.timeOfDay = 0.9; }); // night
await runFrames(page, 60);
await snap(page, '10-night');

await page.evaluate(() => { game.timeOfDay = 0.5; }); // noon
await runFrames(page, 30);
await snap(page, '11-noon');

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

// ---- STAGE 10: Escape/pause ----
console.log('\n=== STAGE 10: Pause ===');
await page.keyboard.press('Escape');
await runFrames(page, 10);
await snap(page, '13-escape');
await page.keyboard.press('Escape');
await runFrames(page, 5);

// ---- SUMMARY ----
console.log('\n=== ERRORS CAPTURED ===');
if (errors.length === 0) {
  console.log('No errors!');
} else {
  errors.forEach(e => console.log(' -', e));
}

await browser.close();
console.log('\nPlaythrough complete. Screenshots:', DIR);
