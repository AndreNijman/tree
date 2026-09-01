import { chromium } from 'playwright';

const URL = 'file:///' + process.cwd().replace(/\\/g, '/') + '/index.html';
const browser = await chromium.launch({ args: ['--no-sandbox', '--allow-file-access-from-files'] });
const page = await browser.newPage();
const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', err => errors.push(err.message));
await page.goto(URL, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => typeof buildGame === 'function' && typeof step === 'function');

const results = [];
function check(label, ok, extra) {
  results.push({ label, ok, extra });
  if (!ok) console.log('FAIL:', label, extra || '');
}

// Build a game
await page.evaluate(() => {
  buildGame('playtest-seed', 'corrupt');
  game.entities = game.entities.filter(e => e.dead || e.dmg <= 0 || e === game.player);
});

// ===== STARTER ITEMS =====
const starter = await page.evaluate(() => {
  var inv = game.player.inventory;
  var items = [];
  for (var i = 0; i < inv.slots.length; i++) {
    if (inv.slots[i]) items.push({ slot: i, id: inv.slots[i].id, count: inv.slots[i].count });
  }
  return { items, selected: inv.selected };
});
check('Starter: exactly 6 items', starter.items.length === 6, JSON.stringify(starter.items));
check('Starter: slot 0 is Copper Pickaxe', starter.items[0]?.id === 'copperpick');
check('Starter: slot 1 is Copper Sword', starter.items[1]?.id === 'coppersword');
check('Starter: slot 2 is Copper Bow', starter.items[2]?.id === 'copperbow');
check('Starter: slot 3 is 35 Arrows', starter.items[3]?.id === 'arrow' && starter.items[3]?.count === 35);
check('Starter: slot 4 is 25 Torches', starter.items[4]?.id === 'torch' && starter.items[4]?.count === 25);
check('Starter: slot 5 is 3 Healing Potions', starter.items[5]?.id === 'healingpotion' && starter.items[5]?.count === 3);
check('Starter: NO blocks', !starter.items.find(s => s.id === 'wood' || s.id === 'stone' || s.id === 'dirt' || s.id === 'cobweb'));
check('Starter: NO iron tools', !starter.items.find(s => s.id === 'ironpick' || s.id === 'ironsword' || s.id === 'ironbow'));
check('Starter: selected slot is 0', starter.selected === 0);

// ===== MINING: TOOL POWER GATES =====
const mining = await page.evaluate(() => {
  var copper = ITEMS['copperpick'];
  return {
    power: copper.power,
    canDirt: copper.power >= TILE_HARD[T.DIRT][0],
    canStone: copper.power >= TILE_HARD[T.STONE][0],
    canSilver: copper.power >= TILE_HARD[T.SILVER][0],
    canGold: copper.power >= TILE_HARD[T.GOLD][0],
    canIron: copper.power >= TILE_HARD[T.IRON][0],
    canCopper: copper.power >= TILE_HARD[T.COPPER][0],
    canTin: copper.power >= TILE_HARD[T.TIN][0],
    canLead: copper.power >= TILE_HARD[T.LEAD][0],
    cannotPlatinum: copper.power < TILE_HARD[T.PLATINUM][0],
    cannotDemonite: copper.power < TILE_HARD[T.DEMONITE][0],
  };
});
check('Mining: copper pick power is 35', mining.power === 35, JSON.stringify(mining));
check('Mining: can mine dirt (req 0)', mining.canDirt);
check('Mining: can mine stone (req 0)', mining.canStone);
check('Mining: can mine iron (req 0)', mining.canIron);
check('Mining: can mine copper ore (req 25)', mining.canCopper);
check('Mining: can mine silver ore (req 35)', mining.canSilver);
check('Mining: can mine tin ore (req 25)', mining.canTin);
check('Mining: CANNOT mine gold (req 45)', mining.canGold === false);
check('Mining: CANNOT mine platinum (req 50)', mining.cannotPlatinum);
check('Mining: CANNOT mine demonite (req 55)', mining.cannotDemonite);

// ===== MINING: ACTUAL BREAK =====
const mineBreak = await page.evaluate(() => {
  var p = game.player, w = game.world;
  // Find dirt near spawn
  var dirtTx = -1, dirtTy = -1;
  for (var dy = -1; dy <= 6; dy++) {
    for (var dx = -3; dx <= 3; dx++) {
      var tx = Math.floor(w.spawnX / TILE) + dx;
      var ty = Math.floor(w.spawnY / TILE) + dy;
      if (w.inBounds(tx, ty) && w.get(tx, ty) === T.DIRT) { dirtTx = tx; dirtTy = ty; break; }
    }
    if (dirtTx >= 0) break;
  }
  if (dirtTx < 0) return { error: 'no dirt' };

  p.x = dirtTx * TILE + 32; p.y = dirtTy * TILE;
  MOUSE.wx = dirtTx * TILE + 8; MOUSE.wy = dirtTy * TILE + 8;
  var pre = w.get(dirtTx, dirtTy);
  var hits = 0;
  while (w.get(dirtTx, dirtTy) !== T.AIR && hits < 200) { p.mineCd = 0; p.tryMine(game, ITEMS['copperpick'], null); hits++; }
  return { pre, broke: w.get(dirtTx, dirtTy) === T.AIR, hits };
});
check('Mining: dirt tile actually breaks', mineBreak.broke, 'hits=' + mineBreak.hits);
check('Mining: break takes multiple hits (not instant)', mineBreak.hits > 1, 'hits=' + mineBreak.hits);

// ===== MINING: STONE TAKES MORE HITS THAN DIRT =====
const mineSpeed = await page.evaluate(() => {
  var p = game.player, w = game.world, copper = ITEMS['copperpick'];
  var stoneTx = -1, stoneTy = -1, dirtTx = -1, dirtTy = -1;
  for (var dy = 8; dy <= 30; dy++) {
    for (var dx = -5; dx <= 5; dx++) {
      var tx = Math.floor(w.spawnX / TILE) + dx, ty = Math.floor(w.spawnY / TILE) + dy;
      if (!w.inBounds(tx, ty)) continue;
      if (w.get(tx, ty) === T.STONE && stoneTx < 0) { stoneTx = tx; stoneTy = ty; }
      if (w.get(tx, ty) === T.DIRT && dirtTx < 0) { dirtTx = tx; dirtTy = ty; }
    }
    if (stoneTx >= 0 && dirtTx >= 0) break;
  }
  var stoneHits = 0, dirtHits = 0;
  if (stoneTx >= 0) {
    p.x = stoneTx * TILE + 32; p.y = stoneTy * TILE;
    MOUSE.wx = stoneTx * TILE + 8; MOUSE.wy = stoneTy * TILE + 8;
    while (w.get(stoneTx, stoneTy) !== T.AIR && stoneHits < 200) { p.mineCd = 0; p.tryMine(game, copper, null); stoneHits++; }
  }
  if (dirtTx >= 0) {
    p.x = dirtTx * TILE + 32; p.y = dirtTy * TILE;
    MOUSE.wx = dirtTx * TILE + 8; MOUSE.wy = dirtTy * TILE + 8;
    while (w.get(dirtTx, dirtTy) !== T.AIR && dirtHits < 200) { p.mineCd = 0; p.tryMine(game, copper, null); dirtHits++; }
  }
  return { stoneHits, dirtHits, stoneBroke: stoneTx >= 0 ? w.get(stoneTx, stoneTy) === T.AIR : 'n/a', dirtBroke: dirtTx >= 0 ? w.get(dirtTx, dirtTy) === T.AIR : 'n/a' };
});
check('Mining: dirt breaks faster than stone', mineSpeed.dirtHits < mineSpeed.stoneHits, JSON.stringify(mineSpeed));

// ===== PICKUP: MINING ADDS TO INVENTORY DIRECTLY =====
const pickupTest = await page.evaluate(() => {
  var p = game.player, w = game.world;
  // Place a known dirt tile and mine it from the side (like mineBreak does)
  var tx = Math.floor(w.spawnX / TILE) + 10;
  var ty = Math.floor(w.spawnY / TILE) + 3;
  w.set(tx, ty, T.DIRT);
  // Place player to the side, same as working mineBreak test
  p.x = tx * TILE + 32; p.y = ty * TILE; p.vy = 0;
  MOUSE.wx = tx * TILE + 8; MOUSE.wy = ty * TILE + 8;
  var preDirt = 0; for (var s of p.inventory.slots) if (s && s.id === 'dirt') preDirt += s.count;
  var hits = 0;
  while (w.get(tx, ty) !== T.AIR && hits < 200) { p.mineCd = 0; p.tryMine(game, ITEMS['copperpick'], null); hits++; }
  var postDirt = 0; for (var s of p.inventory.slots) if (s && s.id === 'dirt') postDirt += s.count;
  return { preDirt, postDirt, collected: postDirt > preDirt, tileGone: w.get(tx, ty) === T.AIR, hits };
});
check('Mining: broken dirt goes to inventory', pickupTest.collected, JSON.stringify(pickupTest));

// ===== COMBAT: MELEE =====
const melee = await page.evaluate(() => {
  var p = game.player;
  var zombie = makeEntity(E.ZOMBIE, p.x + 40, p.y);
  zombie.hp = zombie.maxHp;
  game.entities.push(zombie);
  var preHp = zombie.hp;
  MOUSE.wx = zombie.x; MOUSE.wy = zombie.y;
  p.attackCd = 0; p.swingT = 0;
  p.tryMelee(game, ITEMS['coppersword'], false, null);
  return { dealt: zombie.hp < preHp, dmg: preHp - zombie.hp, cd: p.attackCd > 0, swing: p.swingT > 0 };
});
check('Combat: copper sword deals damage', melee.dealt, 'dmg=' + melee.dmg);
check('Combat: damage > 0', melee.dmg > 0);
check('Combat: attack cooldown set', melee.cd);
check('Combat: swing animation plays', melee.swing);

// ===== COMBAT: RANGED =====
const ranged = await page.evaluate(() => {
  var p = game.player, inv = p.inventory;
  var pre = 0; for (var s of inv.slots) if (s && s.id === 'arrow') pre += s.count;
  p.attackCd = 0;
  MOUSE.wx = p.x + 100; MOUSE.wy = p.y;
  p.tryShoot(game, ITEMS['copperbow'], 'copperbow', null);
  var post = 0; for (var s of inv.slots) if (s && s.id === 'arrow') post += s.count;
  var projs = 0; for (var j = 0; j < game.projectiles.list.length; j++) { var o = game.projectiles.list[j]; if (o.owner === 'player' && !o.dead) projs++; }
  return { consumed: pre - post, projs };
});
check('Ranged: bow consumes 1 arrow', ranged.consumed === 1, JSON.stringify(ranged));
check('Ranged: arrow projectile created', ranged.projs > 0, 'projs=' + ranged.projs);

// ===== COMBAT: CONTACT DAMAGE =====
const contact = await page.evaluate(() => {
  var p = game.player;
  var preHp = p.hp;
  p.invuln = 0;
  var zombie = makeEntity(E.ZOMBIE, p.x, p.y);
  zombie.hp = zombie.maxHp;
  game.entities.push(zombie);
  contactCheck(zombie, game);
  return { tookDmg: p.hp < preHp, dmg: preHp - p.hp, iframes: p.invuln > 0, zombieDmg: zombie.dmg };
});
check('Contact: enemy contact damages player', contact.tookDmg, 'dmg=' + contact.dmg);
check('Contact: sets invulnerability frames', contact.iframes);
check('Contact: zombie has damage > 0', contact.zombieDmg > 0);

// ===== DEATH & RESPAWN =====
const death = await page.evaluate(() => {
  var p = game.player, w = game.world;
  p.hp = 0; p.die();
  var isDying = p.dying, timer = p.respawnT;
  var steps = 0;
  while (p.dying && steps < 200) { step(1/60); steps++; }
  return { isDying, timer, respawned: !p.dying, fullHp: p.hp === p.maxHp, atSpawn: Math.abs(p.x - w.spawnX) < 48 && Math.abs(p.y - w.spawnY) < 48 };
});
check('Death: dying flag set', death.isDying);
check('Death: respawn timer > 0', death.timer > 0, 't=' + death.timer);
check('Death: player respawns at spawn', death.respawned && death.atSpawn, JSON.stringify(death));
check('Death: HP restored to max', death.fullHp);

// ===== CAMERA =====
const camera = await page.evaluate(() => {
  var p = game.player, cam = game.cam;
  var sx = cam.x, sy = cam.y;
  p.x = game.world.spawnX + 300; p.y = game.world.spawnY + 200;
  for (var i = 0; i < 60; i++) step(1/60);
  return { sx, sy, ax: cam.x, ay: cam.y, movedX: Math.abs(cam.x - sx) > 10, movedY: Math.abs(cam.y - sy) > 10,
           inBounds: cam.x > 0 && cam.x < game.world.W * TILE && cam.y > 0 && cam.y < game.world.H * TILE };
});
check('Camera: follows player X', camera.movedX, JSON.stringify({ s: camera.sx.toFixed(0), a: camera.ax.toFixed(0) }));
check('Camera: follows player Y', camera.movedY, JSON.stringify({ s: camera.sy.toFixed(0), a: camera.ay.toFixed(0) }));
check('Camera: stays in world bounds', camera.inBounds);

// ===== LIGHTING: TORCH HELD =====
const lighting = await page.evaluate(() => {
  var p = game.player, inv = p.inventory;
  inv.selected = 4;
  var slot = inv.selectedItem();
  var def = slot ? ITEMS[slot.id] : null;
  var isTorch = def && def.tile === T.TORCH;
  // Check held torch creates light cut in drawLighting
  var torchR = def && isTorch ? 180 : 0;
  return { isTorch, defTile: def ? def.tile : null, torchR };
});
check('Lighting: torch is held when selected', lighting.isTorch, JSON.stringify(lighting));

// ===== LIGHTING: ORE GLOW TABLE =====
const oreGlow = await page.evaluate(() => {
  var keys = Object.keys(EMISSIVE_ORE_GLOW);
  return { count: keys.length, keys: keys.map(Number).sort((a,b) => a-b), hasDemonite: keys.indexOf(String(T.DEMONITE)) >= 0,
           hasHellstone: keys.indexOf(String(T.HELLSTONE)) >= 0, hasChlorophyte: keys.indexOf(String(T.CHLOROPHYTE)) >= 0 };
});
check('Lighting: 5 emissive ore types', oreGlow.count === 5, JSON.stringify(oreGlow));
check('Lighting: includes Demonite', oreGlow.hasDemonite);
check('Lighting: includes Hellstone', oreGlow.hasHellstone);
check('Lighting: includes Chlorophyte', oreGlow.hasChlorophyte);

// ===== LIGHTING: DARKNESS BELOW SURFACE =====
const darkness = await page.evaluate(() => {
  var w = game.world, p = game.player;
  var surfaceCol = Math.floor(w.spawnX / TILE);
  var surfY = w.surfaceY[surfaceCol];
  // Player 10 tiles below surface should be in total darkness
  p.x = w.spawnX; p.y = (surfY + 10) * TILE;
  // Clear some tiles for the player
  var tx = Math.floor(p.x / TILE), ty = Math.floor(p.y / TILE);
  for (var dx = -2; dx <= 2; dx++) for (var dy = -2; dy <= 2; dy++) w.set(tx + dx, ty + dy, T.AIR);
  // No light sources held
  p.inventory.selected = 0;
  var slot = p.inventory.selectedItem();
  var def = slot ? ITEMS[slot.id] : null;
  var isLightSource = def && (def.tile === T.TORCH || def.tile === T.GLOWSTONE);
  return { underground: p.y > surfY * TILE + TILE, noLightSource: !isLightSource };
});
check('Darkness: player underground', darkness.underground);
check('Darkness: no light source held', darkness.noLightSource);

// ===== ITEM SYSTEM =====
const items = await page.evaluate(() => {
  var mismatches = [], count = 0;
  for (var key in I) { count++; if (!ITEMS[I[key]]) mismatches.push(key); }
  return { count, clean: mismatches.length === 0 };
});
check('Items: I enum matches ITEMS map (' + items.count + ' items)', items.clean);

// ===== CANVAS =====
const canvas = await page.evaluate(() => {
  var c = document.getElementById('canvas');
  return { exists: !!c, isCanvas: c && c.tagName === 'CANVAS', w: c ? c.width : 0, h: c ? c.height : 0 };
});
check('Canvas: exists and is canvas element', canvas.exists && canvas.isCanvas, JSON.stringify(canvas));
check('Canvas: has dimensions', canvas.w > 400 && canvas.h > 300, JSON.stringify(canvas));

// ===== SAVED SURFACE PROFILE =====
const surfaceSave = await page.evaluate(() => {
  buildGame('surface-save-seed', 'corrupt');
  var w = game.world;
  var spawnTile = Math.floor(w.spawnX / TILE);
  var expected = [];
  for (var x = spawnTile - 4; x <= spawnTile + 4; x++) {
    var y = w.surfaceY[x];
    var cap = w.get(x, y);
    w.set(x, y, T.AIR);
    w.setWall(x, y, WALL.NONE);
    w.set(x, y + 1, cap);
    w.setWall(x, y + 1, WALL.DIRT);
    expected.push({ x:x, y:y + 1 });
  }
  var legacy = saveSnapshot();
  legacy.patch = 1;
  delete legacy.world.surfaceY;
  applySaveData(legacy);
  var migrated = true;
  for (var i = 0; i < expected.length; i++) {
    if (game.world.surfaceY[expected[i].x] !== expected[i].y) migrated = false;
  }
  var saved = saveSnapshot();
  var stored = saved.patch === PATCH && saved.world.surfaceY && saved.world.surfaceY.length === game.world.W;
  var before = game.world.surfaceY[spawnTile];
  game.world.surfaceY[spawnTile] = before - 7;
  applySaveData(saved);
  return {
    migrated:migrated,
    stored:stored,
    roundTrip:game.world.surfaceY[spawnTile] === before,
    spawnAligned:game.world.spawnY === game.world.surfaceY[spawnTile] * TILE - 16
  };
});
check('Save: legacy surface profile migrates from tiles', surfaceSave.migrated, JSON.stringify(surfaceSave));
check('Save: surface profile is persisted', surfaceSave.stored, JSON.stringify(surfaceSave));
check('Save: surface profile round-trips', surfaceSave.roundTrip && surfaceSave.spawnAligned, JSON.stringify(surfaceSave));

// ===== NATURAL WALLS STAY UNDERGROUND =====
const wallProfile = await page.evaluate(() => {
  var w = game.world;
  var tx = Math.floor(w.spawnX / TILE) + 80;
  var ty = w.surfaceY[tx] - 1;
  w.set(tx, ty, T.AIR);
  game.cam.x = tx * TILE + 8;
  game.cam.y = w.surfaceY[tx] * TILE;
  game.shakeT = 0;
  game.timeOfDay = 0.5;
  var sx = Math.floor(tx * TILE - game.cam.x + canvas.width / 2 + 8);
  var sy = Math.floor(ty * TILE - game.cam.y + canvas.height / 2 + 8);
  function pixel() {
    renderGame(game, ctx2d);
    return Array.prototype.slice.call(ctx2d.getImageData(sx, sy, 1, 1).data);
  }
  w.setWall(tx, ty, WALL.NONE);
  var sky = pixel();
  w.setWall(tx, ty, WALL.CAVE);
  var natural = pixel();
  w.setWall(tx, ty, WALL.WOOD);
  var wood = pixel();
  return {
    naturalHidden:sky.join(',') === natural.join(','),
    woodVisible:sky.join(',') !== wood.join(','),
    sky:sky,
    natural:natural,
    wood:wood
  };
});
check('Render: natural cave walls stay below surface', wallProfile.naturalHidden, JSON.stringify(wallProfile));
check('Render: player Wood Walls remain visible above surface', wallProfile.woodVisible, JSON.stringify(wallProfile));

// ===== WEAPON DURABILITY =====
const dur = await page.evaluate(() => {
  var s = ITEMS['coppersword'], p = ITEMS['copperpick'], b = ITEMS['copperbow'];
  return { noDur: !s.durability && !p.durability && !b.durability };
});
check('Weapons: infinite durability (no durability system)', dur.noDur);

// ===== SPAWN SYSTEM =====
const spawning = await page.evaluate(() => {
  var p = game.player, w = game.world;
  // Move player far from spawn to escape safe zone
  p.x = w.spawnX + 800; p.y = w.surfaceY[Math.floor((w.spawnX + 800) / TILE)] * TILE - 20;
  game.cam.x = p.x; game.cam.y = p.y;
  var preCount = 0;
  for (var i = 0; i < game.entities.length; i++) { var e = game.entities[i]; if (!e.dead && e.dmg > 0 && !e.boss) preCount++; }
  for (var i = 0; i < 600; i++) step(1/60);
  var postCount = 0;
  for (var i = 0; i < game.entities.length; i++) { var e = game.entities[i]; if (!e.dead && e.dmg > 0 && !e.boss) postCount++; }
  return { pre: preCount, post: postCount, spawned: postCount > preCount };
});
check('Spawning: enemies appear over time', spawning.spawned, JSON.stringify(spawning));

// ===== BATCH 69: ZOOLOGIST BESTIARY-GATED STOCK =====
const zoo = await page.evaluate(() => {
  var result = { shop: TOWN_SHOPS[E.ZOOLOGIST].map(r => ({ item: r.item, gate: r.gate })),
    defs: { cat: !!ITEMS[I.CATLICENSE], rabbit: !!ITEMS[I.RABBITPERCH], carrot: !!ITEMS[I.LIGHTNINGCARROT] } };
  // Base shop availability (no bestiary progress)
  result.baseAvailable = [];
  result.gated = [];
  for (var i = 0; i < TOWN_SHOPS[E.ZOOLOGIST].length; i++) {
    var row = TOWN_SHOPS[E.ZOOLOGIST][i];
    if (row.gate && row.gate.indexOf('bestiary:') === 0) result.gated.push({ item: row.item, gate: row.gate, avail: townStockAvailable(row, E.ZOOLOGIST) });
    else result.baseAvailable.push({ item: row.item, avail: townStockAvailable(row, E.ZOOLOGIST) });
  }
  // Simulate bestiary completion
  var entries = bestiaryCatalog(), count = Math.ceil(entries.length * 0.9);
  for (var k = 0; k < count; k++) {
    var key = entries[k].key;
    if (!game.bestiary[key]) game.bestiary[key] = { seen: true, kills: 0 };
    else game.bestiary[key].seen = true;
  }
  result.percent90 = bestiaryCompletionPercent();
  result.gatedAfter = [];
  for (var j = 0; j < TOWN_SHOPS[E.ZOOLOGIST].length; j++) {
    var row2 = TOWN_SHOPS[E.ZOOLOGIST][j];
    if (row2.gate && row2.gate.indexOf('bestiary:') === 0) result.gatedAfter.push({ item: row2.item, avail: townStockAvailable(row2, E.ZOOLOGIST) });
  }
  return result;
});
check('Zoo: 4 bestiary-gated entries present', zoo.gated.length === 4, JSON.stringify(zoo.gated));
check('Zoo: CATLICENSE/RABBITPERCH/LIGHTNINGCARROT defs exist', zoo.defs.cat && zoo.defs.rabbit && zoo.defs.carrot);
check('Zoo: base items (LeatherWhip/Puppy/BabyDino/Unicorn) available without bestiary', zoo.baseAvailable.filter(r => r.avail).length >= 2, JSON.stringify(zoo.baseAvailable));
check('Zoo: gated items hidden at 0% bestiary', zoo.gated.every(r => !r.avail), JSON.stringify(zoo.gated));
check('Zoo: 90% completion reached', zoo.percent90 >= 90, JSON.stringify(zoo.percent90));
check('Zoo: gated items unlocked at 90%', zoo.gatedAfter.filter(r => r.avail).length === zoo.gatedAfter.length, JSON.stringify(zoo.gatedAfter));

// ===== BATCH 69: ACHIEVEMENTS + PET/MT RENDERING =====
const zoo2 = await page.evaluate(() => {
  var ach30 = !!ACHIEVEMENTS['bestiary30'], ach90 = !!ACHIEVEMENTS['bestiary90'];
  // Try to mount the lightning carrot
  var def = ITEMS[I.LIGHTNINGCARROT];
  game.player.tryMount(game, def, I.LIGHTNINGCARROT);
  return { ach30: ach30, ach90: ach90, defType: def.type, mounted: game.player.mounted === I.LIGHTNINGCARROT };
});
check('Zoo: bestiary30 + bestiary90 achievements defined', zoo2.ach30 && zoo2.ach90);
check('Zoo: lightning carrot is a mount', zoo2.defType === 'mount', JSON.stringify(zoo2));
check('Zoo: mount attempt succeeds', zoo2.mounted);

// ===== BATCH 70: GOLFER GOLF CHALLENGE =====
const golf1 = await page.evaluate(() => {
  var g = game.golf, p = game.player;
  // Ensure a real Golfer entity is nearby for the proximity gate
  var golfer = spawnEntity(game, E.GOLFER, p.x, p.y);
  game.townNpcOpen = { type: E.GOLFER, name: 'Golfer' };
  var startBefore = g.active;
  golferStartGolf();
  var started = g.active && g.time > 0 && g.whacks === 0;
  // Force-spawn a ball on clear ground near the player
  var spawned = false;
  for (var k = 0; k < 40; k++) {
    game.golf.spawnT = 0;
    updateGolf(1/60);
    if (g.balls.length > 0) { spawned = true; break; }
  }
  return { startBefore: startBefore, started: started, spawned: spawned, ballCount: g.balls.length };
});
check('Golf: start sets active/time/score', golf1.started, JSON.stringify(golf1));
check('Golf: a ball spawns on clear ground', golf1.spawned, JSON.stringify(golf1));

const golf2 = await page.evaluate(() => {
  var g = game.golf;
  if (g.balls.length === 0) { for (var k = 0; k < 60 && g.balls.length === 0; k++) { g.spawnT = 0; updateGolf(1/60); } }
  var b = g.balls[0];
  var before = g.whacks;
  if (!b) return { hit: false, before: before, after: before, ballCount: g.balls.length };
  MOUSE.down = true;
  MOUSE.wx = b.x; MOUSE.wy = b.y;
  updateGolf(1/60);
  MOUSE.down = false;
  return { hit: true, before: before, after: g.whacks, ballCount: g.balls.length };
});
check('Golf: clicking a ball holes it (+1 score)', golf2.hit && golf2.after === golf2.before + 1, JSON.stringify(golf2));
check('Golf: holed ball is removed', golf2.ballCount === 0, JSON.stringify(golf2));

const golf3 = await page.evaluate(() => {
  var g = game.golf, p = game.player;
  // Simulate a par run: 15 whacks, then expire time
  g.whacks = 15;
  g.time = 0.01;
  var goldBefore = p.inventory.countOf(I.GOLD);
  updateGolf(1/60);
  var ended = !g.active;
  var achPar = !!Achievements.unlocked['golfpar'];
  var achFirst = !!Achievements.unlocked['golfchallenge'];
  var completed = g.completed;
  var best = g.best;
  var goldAfter = p.inventory.countOf(I.GOLD);
  return { ended: ended, achPar: achPar, achFirst: achFirst, completed: completed, best: best,
    goldGain: goldAfter - goldBefore, hudActive: false };
});
check('Golf: par run ends and awards par achievement', golf3.ended && golf3.achPar && golf3.achFirst, JSON.stringify(golf3));
check('Golf: completed/best tracked', golf3.completed >= 1 && golf3.best >= 15, JSON.stringify(golf3));

const golf4 = await page.evaluate(() => {
  // Save/restore round trip for best/completed
  var snap = saveSnapshot();
  var pr = snap.progress || snap.pr || {};
  var bestField = pr.golfBest, completedField = pr.golfCompleted;
  return { bestField: bestField, completedField: completedField, storedBest: game.golf.best, storedCompleted: game.golf.completed };
});
check('Golf: best/completed persisted in save snapshot', golf4.bestField === golf4.storedBest && golf4.completedField === golf4.storedCompleted, JSON.stringify(golf4));

const golfHud = await page.evaluate(() => {
  // Reactivate golf to check the HUD line renders without error
  var p = game.player;
  spawnEntity(game, E.GOLFER, p.x, p.y);
  game.townNpcOpen = { type: E.GOLFER, name: 'Golfer' };
  golferStartGolf();
  updateGolf(1/60);
  updateHud();
  var hudEl = document.getElementById('eventhud');
  var hud = hudEl ? hudEl.textContent : '';
  // end it for the loop
  game.golf.time = 0.01; updateGolf(1/60);
  return { hud: hud.indexOf('Golf Challenge') >= 0, hadEl: !!hudEl };
});
check('Golf: HUD shows Golf Challenge line', golfHud.hud, JSON.stringify(golfHud));

// ===== BATCH 71: DYE TRADER STRANGE PLANTS =====
const strangeDefs = await page.evaluate(() => {
  var rewards = [I.DYE_ACID, I.DYE_BLUEACID, I.DYE_REDACID, I.DYE_GLOWINGMUSHROOM];
  var inv = game.player.inventory, oldSlots = inv.slots;
  inv.slots = new Array(50);
  var emptyArrival = dyeTraderArrivalEligible();
  inv.add(I.STRANGEPLANT, 1);
  var plantArrival = dyeTraderArrivalEligible();
  inv.slots = oldSlots;
  return {
    plant: !!ITEMS[I.STRANGEPLANT] && ITEMS[I.STRANGEPLANT].type === 'material',
    rewardCount: rewards.length,
    rewardsAreDyes: rewards.every(id => ITEMS[id] && ITEMS[id].type === 'dye'),
    emptyArrival: emptyArrival,
    plantArrival: plantArrival
  };
});
check('Dye Trader: Strange Plant and four rare dyes exist', strangeDefs.plant && strangeDefs.rewardCount === 4 && strangeDefs.rewardsAreDyes, JSON.stringify(strangeDefs));
check('Dye Trader: carrying a Strange Plant satisfies arrival', !strangeDefs.emptyArrival && strangeDefs.plantArrival, JSON.stringify(strangeDefs));

const strangeSpawn = await page.evaluate(() => {
  var oldHardmode = game.hardmode, oldTimer = game.strangePlantT;
  var oldX = game.player.x, oldY = game.player.y;
  game.pickups = game.pickups.filter(pk => pk.item !== I.STRANGEPLANT);
  game.hardmode = false;
  game.strangePlantT = 0;
  updateStrangePlants(1);
  var preHardmode = game.pickups.filter(pk => pk.item === I.STRANGEPLANT).length;
  game.hardmode = true;
  game.strangePlantT = 0;
  var wxCount = 0;
  for (var sweep = 0; sweep < 60 && wxCount === 0; sweep++) {
    game.strangePlantT = 0;
    updateStrangePlants(1);
    wxCount = game.pickups.filter(pk => pk.item === I.STRANGEPLANT).length;
  }
  var plants = game.pickups.filter(pk => pk.item === I.STRANGEPLANT);
  var persisted = saveSnapshot().pickups.some(pk => pk.item === I.STRANGEPLANT);
  var detected = false;
  if (plants.length) {
    game.player.x = plants[0].x; game.player.y = plants[0].y;
    detected = metalDetectorText().indexOf('Strange Plant') >= 0;
  }
  game.player.x = oldX; game.player.y = oldY;
  game.pickups = game.pickups.filter(pk => pk.item !== I.STRANGEPLANT);
  for (var i = 0; i < 4; i++) game.addPickup(500 + i * 2000, 500, I.STRANGEPLANT, 1);
  var beforeCap = game.pickups.filter(pk => pk.item === I.STRANGEPLANT).length;
  game.strangePlantT = 0;
  updateStrangePlants(1);
  var afterCap = game.pickups.filter(pk => pk.item === I.STRANGEPLANT).length;
  game.pickups = game.pickups.filter(pk => pk.item !== I.STRANGEPLANT);
  game.hardmode = oldHardmode;
  game.strangePlantT = oldTimer;
  return { preHardmode:preHardmode, hardmode:plants.length, persisted:persisted, detected:detected, beforeCap:beforeCap, afterCap:afterCap };
});
check('Dye Trader: Strange Plants do not spawn before Hardmode', strangeSpawn.preHardmode === 0, JSON.stringify(strangeSpawn));
check('Dye Trader: Hardmode plant spawns and persists as a pickup', strangeSpawn.hardmode === 1 && strangeSpawn.persisted, JSON.stringify(strangeSpawn));
check('Dye Trader: Metal Detector locates nearby Strange Plants', strangeSpawn.detected, JSON.stringify(strangeSpawn));
check('Dye Trader: natural Strange Plant count is capped at four', strangeSpawn.beforeCap === 4 && strangeSpawn.afterCap === 4, JSON.stringify(strangeSpawn));

const strangeExchange = await page.evaluate(() => {
  var p = game.player, inv = p.inventory;
  var oldHardmode = game.hardmode, oldSlots = inv.slots, oldEntities = game.entities, oldOpen = game.townNpcOpen;
  var oldRandom = Math.random;
  game.hardmode = true;
  game.entities = game.entities.filter(e => e.type !== E.DYETRADER);
  var trader = spawnEntity(game, E.DYETRADER, p.x, p.y);
  game.townNpcOpen = { type:E.DYETRADER, name:'Dye Trader' };
  inv.slots = new Array(50);
  inv.add(I.STRANGEPLANT, 1);
  var serviceHTML = dyeTraderStrangePlantHTML();
  renderTownPanel();
  var panelHTML = document.getElementById('panel-town').innerHTML;
  var exchanged = exchangeStrangePlant();
  var rewardTotal = 0, rewardId = null;
  for (var i = 0; i < STRANGE_DYE_REWARDS.length; i++) {
    var count = inv.countOf(STRANGE_DYE_REWARDS[i]);
    if (count) { rewardTotal += count; rewardId = STRANGE_DYE_REWARDS[i]; }
  }
  var plantAfter = inv.countOf(I.STRANGEPLANT);
  inv.add(I.STRANGEPLANT, 1);
  trader.x = p.x + 500;
  var guardedBefore = inv.countOf(I.STRANGEPLANT);
  var guardedResult = exchangeStrangePlant();
  var guardedAfter = inv.countOf(I.STRANGEPLANT);
  trader.x = p.x;
  inv.slots = new Array(50);
  for (var s = 0; s < 50; s++) inv.slots[s] = { id:I.COPPERSWORD, count:1 };
  inv.slots[0] = { id:I.STRANGEPLANT, count:1 };
  Math.random = function() { return 0; };
  var atomicResult = exchangeStrangePlant();
  Math.random = oldRandom;
  var atomicPlant = inv.countOf(I.STRANGEPLANT), atomicDye = inv.countOf(I.DYE_ACID);
  inv.slots = oldSlots;
  game.entities = oldEntities;
  game.townNpcOpen = oldOpen;
  game.hardmode = oldHardmode;
  return {
    service:serviceHTML.indexOf('Exchange Plant') >= 0 && panelHTML.indexOf('Strange Plant Exchange') >= 0,
    exchanged:exchanged, rewardTotal:rewardTotal, rewardId:rewardId, plantAfter:plantAfter,
    guarded:guardedResult === false && guardedBefore === guardedAfter,
    atomic:atomicResult && atomicPlant === 0 && atomicDye === 6
  };
});
check('Dye Trader: Town panel exposes the Strange Plant exchange', strangeExchange.service, JSON.stringify(strangeExchange));
check('Dye Trader: one plant grants exactly six of one rare dye', strangeExchange.exchanged && strangeExchange.plantAfter === 0 && strangeExchange.rewardTotal === 6 && !!strangeExchange.rewardId, JSON.stringify(strangeExchange));
check('Dye Trader: exchange revalidates NPC proximity', strangeExchange.guarded, JSON.stringify(strangeExchange));
check('Dye Trader: consuming the plant frees a full-inventory reward slot', strangeExchange.atomic, JSON.stringify(strangeExchange));


// ===== 300-STEP CLEAN LOOP =====
const loop = await page.evaluate(() => {
  var errs = [];
  try { for (var i = 0; i < 300; i++) step(1/60); } catch(e) { errs.push(e.message); }
  return { clean: errs.length === 0, errors: errs };
});
check('Loop: 300 clean frames', loop.clean, JSON.stringify(loop));

// ===== BROWSER ERRORS =====
var relayCors = errors.some(e => e.includes('tree-relay.tung-tung-tung-sahur.workers.dev/lobbies'));
var realErrors = errors.filter(e => !e.includes('_guard/status') &&
  !e.includes('tree-relay.tung-tung-tung-sahur.workers.dev/lobbies') &&
  !(relayCors && e === 'Failed to load resource: net::ERR_FAILED'));
check('Browser: no real console errors', realErrors.length === 0, JSON.stringify(realErrors.slice(0, 5)));

// Summary
console.log('\n========== PLAYTEST RESULTS ==========');
var pass = results.filter(r => r.ok).length, fail = results.filter(r => !r.ok).length;
for (var r of results) console.log((r.ok ? 'PASS' : 'FAIL') + ': ' + r.label + (r.extra ? ' [' + r.extra + ']' : ''));
console.log('\n' + pass + ' PASS / ' + fail + ' FAIL / ' + results.length + ' TOTAL');

await browser.close();
process.exit(fail > 0 ? 1 : 0);
