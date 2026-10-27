// Visual evidence and renderer-only regressions in a disposable browser world.
// The browser profile is isolated; existing user worlds are never touched.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { setupAudit, check, note, assertNoBrowserErrors, finish } from './audit2/lib.mjs';

const baseline = process.argv.includes('--baseline');
const dir = 'test-results/graphics/' + (baseline ? 'before' : 'after');
mkdirSync(dir, { recursive: true });
const { browser, page, results } = await setupAudit();
await page.evaluate(() => {
  game.paused = true;
  game.timeOfDay = 0.5;
  game.weather.active = false;
  game.fxTexts = [];
  game.cam.x = game.player.x;
  game.cam.y = game.player.y - 60;
  game.player.invuln = 0;
  document.getElementById('message').style.display = 'none';
  document.getElementById('interact').style.display = 'none';
  updateHud();
  render();
});
await page.screenshot({ path: dir + '/forest.png' });
check(results, 'Game renders at noon', await page.evaluate(() => !!SPRITES && game.started));
if (!baseline) {
  const art = await page.evaluate(() => {
    function bytes(c) { return c.getContext('2d').getImageData(0, 0, c.width, c.height).data; }
    function same(a, b) { return a.length === b.length && a.every(function(v, i) { return v === b[i]; }); }
    var tile = makeTileSprite(T.DIRT, mulberry32(431));
    var other = makeTileSprite(T.DIRT, mulberry32(431));
    var fake = { W: 3, H: 3, tiles: new Uint16Array(9).fill(T.DIRT) };
    var source = SPRITES[T.DIRT][0];
    var connected = PixelArt.connected(T.DIRT, 0, 15, source);
    var exposed = PixelArt.connected(T.DIRT, 0, 0, source);
    var prop = SPRITES[T.CHEST][0];
    var alpha = bytes(prop).filter(function(_, i) { return i % 4 === 3; });
    var soilAlpha = bytes(connected).filter(function(_, i) { return i % 4 === 3; });
    var trunk = { W: 9, H: 12, tiles: new Uint16Array(108) };
    for (var y = 4; y <= 10; y++) trunk.tiles[y * 9 + 4] = T.TREETRUNK;
    for (var dy = -2; dy <= 1; dy++) {
      var halfWidth = dy === -2 || dy === 1 ? 1 : 2;
      for (var dx = -halfWidth; dx <= halfWidth; dx++) {
        var idx = (4 + dy) * 9 + 4 + dx;
        if (trunk.tiles[idx] === 0) trunk.tiles[idx] = T.LEAVES;
      }
    }
    var crowns = PixelArt.treeCrowns(trunk, 0, 8, 0, 11);
    trunk.tiles[3 * 9 + 2] = T.AIR;
    var mined = PixelArt.treeCrowns(trunk, 0, 8, 0, 11);
    trunk.tiles[3 * 9 + 2] = T.LEAVES;
    trunk.tiles[2 * 9 + 4] = T.AIR;
    var minedTip = PixelArt.treeCrowns(trunk, 0, 8, 0, 11).crowns.length;
    var pine = { W:11, H:20, tiles:new Uint16Array(220), surfaceY:new Uint16Array(11).fill(17) };
    pine.tiles[17 * 11 + 5] = T.SNOW;
    for (var row = 0; row < 12; row++) {
      var half = Math.min(3, Math.floor(row / 2));
      for (var dx = -half; dx <= half; dx++) pine.tiles[(5 + row) * 11 + 5 + dx] =
        dx === 0 && (row % 2 === 1 || row === 11) ? T.TREETRUNK : T.LEAVES;
    }
    var fullPine = PixelArt.treeCrowns(pine, 0, 10, 0, 19).crowns.filter(function(t) { return t.kind === 'pine'; }).length;
    pine.tiles[12 * 11 + 2] = T.AIR;
    var cutPine = PixelArt.treeCrowns(pine, 0, 10, 0, 19).crowns.filter(function(t) { return t.kind === 'pine'; }).length;
    var iconCount = 0;
    for (var id in ITEMS) { PixelArt.item(ITEMS[id]); iconCount++; }
    var hexActor = document.createElement('canvas'), rgbActor = document.createElement('canvas');
    hexActor.width = rgbActor.width = 64; hexActor.height = rgbActor.height = 64;
    PixelArt.drawActor(hexActor.getContext('2d'), 32, 32, 1, '#5078aa', '#a0b0c0', '#606870', true, 0, 0);
    PixelArt.drawActor(rgbActor.getContext('2d'), 32, 32, 1, 'rgb(80,120,170)', 'rgb(160,176,192)', 'rgb(96,104,112)', true, 0, 0);
    var dayCrown = PixelArt.crown(T.LEAVES, 0), nightCrown = PixelArt.tint(dayCrown, 0.32);
    var dayPixels = bytes(dayCrown), nightPixels = bytes(nightCrown);
    var tintAlphaSame = dayPixels.every(function(v, i) { return i % 4 !== 3 || v === nightPixels[i]; });
    var scenery = document.createElement('canvas'); scenery.width = 320; scenery.height = 240;
    var sceneryCtx = scenery.getContext('2d'), biomePasses = 0;
    Object.keys(BIOME).forEach(function(b) {
      [false, true].forEach(function(night) {
        PixelArt.drawLandscape(sceneryCtx, BIOME[b], night, { x:400, y:200 }, 320, 240, 190);
        PixelArt.drawCavern(sceneryCtx, BIOME[b], { x:400, y:200 }, 320, 240);
        biomePasses++;
      });
    });
    return {
      deterministic: same(bytes(tile), bytes(other)), interiorUnchanged: same(bytes(source), bytes(connected)),
      edgeDifferent: !same(bytes(connected), bytes(exposed)), maskCenter: PixelArt.maskAt(fake, 1, 1, T.DIRT),
      maskCorner: PixelArt.maskAt(fake, 0, 0, T.DIRT), propTransparent: alpha.some(function(a) { return a === 0; }),
      soilOpaque: soilAlpha.every(function(a) { return a === 255; }),
      crownFound: crowns.crowns.length, minedCrown: mined.crowns.length, iconCount: iconCount,
      iconsExpected: Object.keys(ITEMS).length, rgbArmor: same(bytes(hexActor), bytes(rgbActor)),
      tintAlphaSame: tintAlphaSame, nightDifferent: !same(dayPixels, nightPixels),
      fullPine:fullPine, cutPine:cutPine, minedTip:minedTip,
      biomePasses:biomePasses, expectedBiomePasses:Object.keys(BIOME).length * 2
    };
  });
  check(results, 'Pixel terrain variants are deterministic', art.deterministic);
  check(results, 'Joined terrain has no grid bevel; exposed edges are outlined', art.interiorUnchanged && art.edgeDifferent);
  check(results, 'Autotiling joins neighbors and respects world boundaries', art.maskCenter === 15 && art.maskCorner === 6, art);
  check(results, 'Solid terrain remains opaque; furniture backgrounds are transparent', art.soilOpaque && art.propTransparent);
  check(results, 'Tree crowns derive from live leaves and disappear when mined', art.crownFound === 1 && art.minedCrown === 0);
  check(results, 'Mining a canopy tip also invalidates the larger crown sprite', art.minedTip === 0);
  check(results, 'Snowy pine sprites require an intact live tree footprint', art.fullPine === 1 && art.cutPine === 0);
  check(results, 'Every catalog item produces a pixel icon', art.iconCount === art.iconsExpected, { icons: art.iconCount });
  check(results, 'RGB dye/equipment colors shade identically to hex colors', art.rgbArmor);
  check(results, 'Night tint preserves the complete crown silhouette', art.tintAlphaSame && art.nightDifferent);
  check(results, 'Every biome landscape/cavern palette renders at day and night',
    art.biomePasses === art.expectedBiomePasses, { combinations:art.biomePasses });

  const rendering = await page.evaluate(() => {
    function hash(a) { var h = 2166136261; for (var i = 0; i < a.length; i++) h = Math.imul(h ^ a[i], 16777619); return h >>> 0; }
    function state() {
      return JSON.stringify({ tiles: hash(game.world.tiles), walls: hash(game.world.walls), hp: hash(game.world.hp),
        inv: game.player.inventory, x: game.player.x, y: game.player.y, health: game.player.hp,
        entities: game.entities.map(function(e) { return [e.type, e.x, e.y, e.hp, e.dead]; }),
        pickups: game.pickups, progress: game.bossesDefeated, time: game.timeOfDay });
    }
    render(); // warm all visible caches
    var before = state(), start = performance.now();
    for (var i = 0; i < 30; i++) renderGame(game, ctx2d);
    var elapsed = performance.now() - start;
    return { unchanged: before === state(), msPerFrame: Math.round(elapsed / 30 * 100) / 100 };
  });
  check(results, 'Rendering does not mutate terrain, equipment, entities or progression', rendering.unchanged);
  note(results, 'Warm 1280×720 renderer: ' + rendering.msPerFrame + ' ms/frame (headless; not a gameplay FPS measurement).');

  await page.evaluate(() => {
    window.__graphicsEntities = game.entities.slice();
    var types = [E.MERCHANT, E.NURSE, E.WIZARD, E.SLIME, E.ZOMBIE, E.SKELETON, E.DEMONEYE, E.CAVEBAT];
    types.forEach(function(t, i) {
      var x = game.player.x + (i - 3) * 68;
      var surface = game.world.surfaceY[Math.floor(x / TILE)] * TILE;
      var e = spawnEntity(game, t, x, surface - (i > 5 ? 80 + (i - 6) * 50 : 16));
      e.dir = i % 2 ? -1 : 1;
    });
    render();
  });
  await page.screenshot({ path: dir + '/characters.png' });
  await page.evaluate(() => { game.entities = window.__graphicsEntities; delete window.__graphicsEntities; });

  for (const [name, time] of [['dusk', 0.74], ['night', 0.01]]) {
    await page.evaluate(t => { game.timeOfDay = t; updateHud(); render(); }, time);
    await page.screenshot({ path: dir + '/' + name + '.png' });
  }
  for (const [name, biome] of [['snow', 9], ['jungle', 6], ['desert', 10], ['corruption', 2], ['crimson', 12], ['ocean', 7]]) {
    const found = await page.evaluate(b => {
      var w = game.world;
      for (var x = 50; x < w.W - 50; x += 4) {
        var px = x * TILE + 8, py = w.surfaceY[x] * TILE - 16;
        if (w.biomeAt(px, py) !== b) continue;
        game.player.x = game.cam.x = px; game.player.y = py; game.cam.y = py - 60;
        game.timeOfDay = 0.5; updateHud(); render(); return true;
      }
      return false;
    }, biome);
    if (found) await page.screenshot({ path: dir + '/' + name + '.png' });
    else note(results, name + ' is not present on this seed/evil selection; skipped its in-world screenshot (palette coverage is tested separately).');
  }
  const cave = await page.evaluate(() => {
    var w = game.world, sx = Math.floor(w.spawnX / TILE);
    for (var y = w.surfaceY[sx] + 45; y < w.H - 80; y++) for (var x = sx - 80; x < sx + 80; x++) {
      var open = true;
      for (var dy = -2; dy <= 2 && open; dy++) for (var dx = -3; dx <= 3; dx++) {
        if (w.get(x + dx, y + dy) !== T.AIR) { open = false; break; }
      }
      if (!open) continue;
      game.player.x = game.cam.x = x * TILE + 8; game.player.y = game.cam.y = y * TILE;
      game.player.inventory.slots[49] = { id: I.TORCH, count: 1 }; game.player.inventory.selected = 49;
      w.set(x - 3, y + 1, T.TORCH); w.set(x + 3, y + 1, T.TORCH);
      updateHud(); render(); return true;
    }
    return false;
  });
  check(results, 'Torch-lit underground scene renders', cave);
  if (cave) await page.screenshot({ path: dir + '/cavern.png' });
  await page.evaluate(() => {
    var w = game.world, sx = Math.floor(w.spawnX / TILE) - 12, sy = w.surfaceY[sx] - 8;
    // A deliberately constructed lighting/furniture test fixture, not a worldgen edit.
    for (var y = 0; y <= 8; y++) for (var x = 0; x <= 24; x++) {
      w.set(sx + x, sy + y, y === 0 || y === 8 || x === 0 || x === 24 ? T.WOOD : T.AIR);
      w.setWall(sx + x, sy + y, WALL.WOOD);
    }
    var props = [T.WORKBENCH, T.FURNACE, T.ANVIL, T.CHEST, T.TABLE, T.CHAIR, T.SHADOWCHEST];
    props.forEach(function(t, i) { w.set(sx + 3 + i * 3, sy + 7, t); });
    [3, 12, 21].forEach(function(x) { w.set(sx + x, sy + 2, T.TORCH); });
    game.player.x = game.cam.x = (sx + 12) * TILE;
    game.player.y = (sy + 6) * TILE; game.cam.y = (sy + 3) * TILE;
    game.timeOfDay = 0.74; game.player.inventory.selected = 0;
    updateHud(); render();
  });
  await page.screenshot({ path: dir + '/shelter.png' });
  const shelterLight = await page.evaluate(() => {
    var w = game.world, sx = Math.floor(w.spawnX / TILE) - 12, sy = w.surfaceY[sx] - 8;
    var x0 = Math.max(0, Math.floor((game.cam.x - canvas.width / 2) / TILE) - LIGHT_PAD);
    var x1 = Math.min(w.W - 1, Math.ceil((game.cam.x + canvas.width / 2) / TILE) + LIGHT_PAD);
    var y0 = Math.max(0, Math.floor((game.cam.y - canvas.height / 2) / TILE) - LIGHT_PAD);
    var total = 0;
    for (var x = 1; x < 24; x++) total += game.lightBuf[(sy + 7 - y0) * (x1 - x0 + 1) + sx + x - x0];
    return Math.round(total / 23 * 100) / 100;
  });
  check(results, 'Three torches keep a small shelter readable at floor level', shelterLight > 0.18, { averageLight:shelterLight });

  const sheet = await page.evaluate(() => {
    var c = document.createElement('canvas'); c.width = 960; c.height = 800;
    var ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#202534'; ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#ecdab2'; ctx.font = '16px monospace'; ctx.fillText('TREE / original pixel artwork', 24, 28);
    var types = [T.GRASS, T.DIRT, T.STONE, T.SAND, T.SNOW, T.ICE, T.EBONSTONE, T.CRIMSTONE, T.PEARLSTONE, T.COPPER, T.GOLD, T.CHLOROPHYTE];
    types.forEach(function(t, i) {
      var x = 24 + i % 12 * 76;
      ctx.drawImage(PixelArt.connected(t, 0, 0, SPRITES[t][0]), x, 48, 64, 64);
    });
    var props = [T.CHEST, T.SHADOWCHEST, T.WORKBENCH, T.FURNACE, T.ANVIL, T.CHAIR, T.TABLE, T.TORCH];
    props.forEach(function(t, i) { ctx.drawImage(SPRITES[t][0], 24 + i * 76, 136, 64, 64); });
    ctx.save(); ctx.translate(30, 290); ctx.scale(3, 3);
    for (var i = 0; i < 9; i++) PixelArt.drawActor(ctx, i * 31, 0, i % 2 ? -1 : 1,
      i < 6 ? '#578e9c' : '#a6b6c8', '#9fadc2', '#586480', i >= 6, i, i % 6);
    ctx.restore();
    var ids = [I.COPPERSWORD, I.COPPERPICK, I.COPPERAXE, I.ZENITH, I.CELL_PHONE, I.HERMES_BOOTS, I.LASTPRISM, I.TORCH].filter(function(id) { return ITEMS[id]; });
    ids.forEach(function(id, i) { ctx.drawImage(PixelArt.item(ITEMS[id]), 24 + i * 86, 354, 80, 80); });
    ctx.save(); ctx.translate(38, 520); ctx.scale(2, 2);
    [E.MERCHANT, E.NURSE, E.WIZARD, E.DEMOLITIONIST, E.GOBLINTINKERER].forEach(function(t, i) {
      PixelArt.drawTownActor(ctx, { type: t, dir: 1, vx: 0 }, i * 34, 0, '#a58b68');
    });
    ['eye', 'bat', 'skeleton'].forEach(function(kind, i) {
      PixelArt.drawCreature(ctx, kind, 190 + i * 48, 0, i === 1 ? '#8c739a' : '#d9cfc5', 1, 1);
    });
    PixelArt.slime(ctx, 330, 0, 24, 18, '#568cb6');
    ctx.restore();
    var biomes = [BIOME.FOREST, BIOME.SNOW, BIOME.JUNGLE, BIOME.DESERT, BIOME.HALLOW, BIOME.CORRUPT];
    biomes.forEach(function(b, i) {
      ctx.save(); ctx.translate(i % 3 * 320, 600 + Math.floor(i / 3) * 96);
      ctx.beginPath(); ctx.rect(0, 0, 320, 84); ctx.clip();
      ctx.fillStyle = '#86aebf'; ctx.fillRect(0, 0, 320, 84);
      ctx.scale(0.4, 0.4);
      PixelArt.drawLandscape(ctx, b, false, { x: 400, y: 100 }, 800, 210, 140);
      ctx.restore();
    });
    return c.toDataURL('image/png');
  });
  writeFileSync(dir + '/artwork.png', Buffer.from(sheet.split(',')[1], 'base64'));
  await page.evaluate(() => { game.paused = false; openPanel(); game.paused = true; switchPanel('inventory'); renderPanel('inventory'); });
  await page.screenshot({ path: dir + '/inventory.png' });
  check(results, 'Station recipes show station artwork, not placeholder material icons',
    await page.locator('.craft-row .item-icon').first().getAttribute('alt') === 'Workbench');
  check(results, 'Mana stars have their own visible HUD row', await page.locator('.star').first().evaluate(e => e.getBoundingClientRect().height === 20));
  await page.evaluate(() => closePanel());
  await page.setViewportSize({ width: 1365, height: 768 });
  // Playwright may acknowledge the viewport before the browser dispatches its
  // resize event. Wait for the real game's listener, rather than calling it
  // manually or accidentally checking the previous frame's canvas dimensions.
  await page.waitForFunction(() => canvas.width === 1365 && canvas.height === 768);
  await page.evaluate(() => { game.cam.x += 0.375; game.cam.y += 0.625; render(); });
  const resized = await page.evaluate(() => ({ width:canvas.width, height:canvas.height,
    finite:Number.isFinite(game.cam.x) && Number.isFinite(game.cam.y) }));
  check(results, 'Renderer handles resizing and fractional camera positions', resized.width === 1365 && resized.height === 768 && resized.finite, resized);
  await page.screenshot({ path: dir + '/resized.png' });
  const shots = ['forest', 'characters', 'dusk', 'night', 'snow', 'jungle', 'desert', 'corruption', 'crimson', 'ocean', 'cavern', 'shelter', 'inventory', 'artwork', 'resized'];
  const cards = (existsSync('test-results/graphics/before/forest.png') ? [{ title:'Before — original forest', src:'../before/forest.png' }] : [])
    .concat(shots.filter(name => existsSync(dir + '/' + name + '.png')).map(name => ({ title:name, src:name + '.png' })));
  const combatLink = existsSync('test-results/graphics/combat/index.html') ? '<p><a href="../combat/index.html">Bosses, weapons and combat effects →</a></p>' : '';
  writeFileSync(dir + '/index.html', `<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Tree — pixel-art graphics review</title>
<style>
body{margin:24px;background:#151d2d;color:#e8e7d9;font:15px/1.6 system-ui,sans-serif}
h1{color:#f1d488}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,560px),1fr));gap:20px}
figure{margin:0;border:1px solid #536b94;background:#202e49}img{display:block;width:100%;height:auto;image-rendering:pixelated}
figcaption{padding:8px 12px;text-transform:capitalize}a{color:inherit}
</style><h1>Tree / original pixel-art pass</h1><p>Seed 7357 · disposable test world · click any image for native resolution.</p>${combatLink}
<main>${cards.map(c => `<figure><a href="${c.src}"><img src="${c.src}" alt="${c.title}" loading="lazy"></a><figcaption>${c.title}</figcaption></figure>`).join('\n')}</main></html>`);
}
await assertNoBrowserErrors(results);
await finish(results, browser, baseline ? 'graphics-before' : 'graphics');
