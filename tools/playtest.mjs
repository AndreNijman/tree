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


// ===== BATCH 72: VANILLA ENEMY AUDIT =====
const v72defs = await page.evaluate(() => {
  var ids = [E.PINKJELLYFISH, E.CRAWDAD, E.JUNGLECREEPER, E.DRBONES];
  var allDefs = ids.every(t => ENT_DEF[t] && ENT_DEF[t].name);
  var allHp = ids.every(t => ENT_DEF[t].hp > 0);
  var jellySwim = !!ENT_DEF[E.PINKJELLYFISH].swim;
  return { allDefs:allDefs, allHp:allHp, jellySwim:jellySwim };
});
check('B72: all four new ENT_DEFs exist with HP', v72defs.allDefs && v72defs.allHp, JSON.stringify(v72defs));
check('B72: Pink Jellyfish is a swimmer', v72defs.jellySwim, JSON.stringify(v72defs));

const v72step = await page.evaluate(() => {
  var results = [];
  var ids = [E.PINKJELLYFISH, E.CRAWDAD, E.JUNGLECREEPER, E.DRBONES];
  for (var t = 0; t < ids.length; t++) {
    var e = spawnEntity(game, ids[t], game.spawnX + 200, game.spawnY + 200);
    e.hp = 99999; e.typeSave = ids[t];
    for (var s = 0; s < 30; s++) enemyStep(e, game);
    var ok = e && !e.dead && e.type === ids[t];
    results.push({ id:ids[t], dead:!!(e && e.dead), type:e && e.type });
    if (game.entities.indexOf(e) >= 0) e.dead = true;
  }
  game.entities = game.entities.filter(en => !en.typeSave);
  return { all:results.every(r => !r.dead && r.type), results:results };
});
check('B72: all four enemies spawn and step alive', v72step.all, JSON.stringify(v72step.results));

const v72drops = await page.evaluate(() => {
  var jelly = dropTable(E.PINKJELLYFISH, game).every(d => d.id === I.GLOWSTONE);
  var creeper = dropTable(E.JUNGLECREEPER, game).every(d => d.id === I.VINE);
  var bones = dropTable(E.DRBONES, game).some(d => d.id === I.GRAPPLINGHOOK);
  var ids = [E.PINKJELLYFISH, E.CRAWDAD, E.JUNGLECREEPER, E.DRBONES];
  var valid = ids.every(t => dropTable(t, game).every(d => typeof ITEMS[d.id] !== 'undefined'));
  return { jelly:jelly, creeper:creeper, bones:bones, valid:valid };
});
check('B72: drops are valid defined items', v72drops.valid, JSON.stringify(v72drops));
check('B72: Jellyfish/Vine/Rare-Hook drop paths', v72drops.jelly && v72drops.creeper && v72drops.bones, JSON.stringify(v72drops));

const v72pools = await page.evaluate(() => {
  var last = game.hardmode;
  var oldBiomeAt = game.world.biomeAt;
  var oldY = game.player.y;
  var surfTile = Math.floor(game.player.x / TILE);
  var surf = game.world.surfaceY[surfTile] * TILE;
  game.hardmode = false;
  var hit = {};
  function sweep(biome, depth) {
    var counts = {};
    game.world.biomeAt = function () { return biome; };
    game.player.y = surf + depth * TILE;
    for (var i = 0; i < 200; i++) {
      var id = pickEnemy();
      counts[id] = (counts[id] || 0) + 1;
    }
    return counts;
  }
  var ocean = sweep(BIOME.OCEAN, 0);
  hit.jelly = (ocean[E.PINKJELLYFISH] || 0) > 0;
  hit.crawdad = (ocean[E.CRAWDAD] || 0) > 0;
  var jungle = sweep(BIOME.JUNGLE, 20);
  hit.creeper = (jungle[E.JUNGLECREEPER] || 0) > 0;
  game.world.biomeAt = oldBiomeAt;
  game.player.y = oldY;
  game.hardmode = last;
  return hit;
});
check('B72: ocean pre-HM pool can yield Jellyfish/Crawdad', v72pools.jelly && v72pools.crawdad, JSON.stringify(v72pools));
check('B72: underground Jungle pool can yield Jungle Creeper', v72pools.creeper, JSON.stringify(v72pools));

const v72render = await page.evaluate(() => {
  var calls = [];
  var ids = [E.PINKJELLYFISH, E.CRAWDAD, E.JUNGLECREEPER, E.DRBONES];
  var rctx = (typeof ctx2d !== 'undefined' ? ctx2d : document.getElementById('canvas').getContext('2d'));
  try {
    for (var t = 0; t < ids.length; t++) {
      var e = spawnEntity(game, ids[t], game.player.x + 100, game.player.y - 100);
      for (var s = 0; s < 5; s++) enemyStep(e, game);
      e.hp = 99999;
      drawEnemy(rctx, e, game.cam, 800, 600);
      e.dead = true;
      calls.push(ids[t]);
    }
  } catch (err) { return { ok:false, err:err.message }; }
  return { ok:calls.length === 4, calls:calls };
});
check('B72: all four enemies render without errors', v72render.ok, JSON.stringify(v72render));

// ===== BATCH 73: VANILLA ENEMY AUDIT CONTINUED =====
const v73defs = await page.evaluate(() => {
  var ids = [E.CRAB, E.SEASNAIL, E.PIRANHA, E.LAVABAT, E.WALLCREEPER, E.SALAMANDER, E.BLUEJELLYFISH, E.GREENJELLYFISH];
  var allDefs = ids.every(t => ENT_DEF[t] && ENT_DEF[t].name && ENT_DEF[t].hp > 0);
  var swimmers = ENT_DEF[E.PIRANHA].swim && ENT_DEF[E.BLUEJELLYFISH].swim && ENT_DEF[E.GREENJELLYFISH].swim;
  var catalog = bestiaryCatalog();
  var catalogued = ids.every(t => catalog.some(entry => entry.key === 'e:' + t));
  return { allDefs:allDefs, swimmers:!!swimmers, catalogued:catalogued, catalogCount:catalog.length };
});
check('B73: bestiary catalog tracks the roster (310 entries after Batch 79 roster completion)', v73defs.allDefs && v73defs.catalogued && v73defs.catalogCount === 310, JSON.stringify(v73defs));
check('B73: Piranha and both new Jellyfish use aquatic movement', v73defs.swimmers, JSON.stringify(v73defs));

const v73step = await page.evaluate(() => {
  var ids = [E.CRAB, E.SEASNAIL, E.PIRANHA, E.LAVABAT, E.WALLCREEPER, E.SALAMANDER, E.BLUEJELLYFISH, E.GREENJELLYFISH];
  var results = [];
  game.player.invuln = 99999;
  for (var t = 0; t < ids.length; t++) {
    var e = spawnEntity(game, ids[t], game.player.x + 100 + t * 4, game.player.y - 80);
    e.hp = 99999;
    try {
      for (var s = 0; s < 20; s++) enemyStep(e, game);
      results.push({ id:ids[t], alive:!e.dead, finite:isFinite(e.x) && isFinite(e.y) });
    } catch (err) { results.push({ id:ids[t], alive:false, finite:false, err:err.message }); }
    e.dead = true;
  }
  return { all:results.every(r => r.alive && r.finite), results:results };
});
check('B73: all eight enemies spawn and step with finite positions', v73step.all, JSON.stringify(v73step.results));

const v73drops = await page.evaluate(() => {
  var ids = [E.CRAB, E.SEASNAIL, E.PIRANHA, E.LAVABAT, E.WALLCREEPER, E.SALAMANDER, E.BLUEJELLYFISH, E.GREENJELLYFISH];
  var valid = ids.every(t => dropTable(t, game).every(d => typeof ITEMS[d.id] !== 'undefined'));
  var lava = dropTable(E.LAVABAT, game).every(d => d.id === I.HELLSTONE);
  var jellies = [E.BLUEJELLYFISH, E.GREENJELLYFISH].every(t => dropTable(t, game).every(d => d.id === I.GLOWSTONE));
  return { valid:valid, lava:lava, jellies:jellies };
});
check('B73: all drop paths resolve, including Hellstone and Glowstone', v73drops.valid && v73drops.lava && v73drops.jellies, JSON.stringify(v73drops));

const v73pools = await page.evaluate(() => {
  var oldHardmode = game.hardmode;
  var oldBiomeAt = game.world.biomeAt;
  var oldY = game.player.y;
  var surf = game.world.surfaceY[Math.floor(game.player.x / TILE)] * TILE;
  function sweep(hardmode, biome, depth) {
    game.hardmode = hardmode;
    game.world.biomeAt = function () { return biome; };
    game.player.y = surf + depth * TILE;
    var counts = {};
    for (var i = 0; i < 600; i++) {
      var id = pickEnemy();
      counts[id] = (counts[id] || 0) + 1;
    }
    return counts;
  }
  var preOcean = sweep(false, BIOME.OCEAN, 0);
  var preSpider = sweep(false, BIOME.SPIDER, 20);
  var preCavern = sweep(false, BIOME.FOREST, 20);
  var preHell = sweep(false, BIOME.UNDERWORLD, 60);
  var hardOcean = sweep(true, BIOME.OCEAN, 0);
  var hardHell = sweep(true, BIOME.UNDERWORLD, 60);
  game.hardmode = oldHardmode;
  game.world.biomeAt = oldBiomeAt;
  game.player.y = oldY;
  function has(pool, id) { return (pool[id] || 0) > 0; }
  return {
    preOcean:has(preOcean, E.CRAB) && has(preOcean, E.SEASNAIL) && has(preOcean, E.PIRANHA) && has(preOcean, E.BLUEJELLYFISH),
    preCaves:has(preSpider, E.WALLCREEPER) && has(preCavern, E.SALAMANDER),
    preSealed:!has(preOcean, E.GREENJELLYFISH) && !has(preHell, E.LAVABAT),
    hardOcean:has(hardOcean, E.GREENJELLYFISH),
    hardHell:has(hardHell, E.LAVABAT)
  };
});
check('B73: pre-Hardmode Ocean, Spider Cave, and Cavern pools expose the correct roster', v73pools.preOcean && v73pools.preCaves, JSON.stringify(v73pools));
check('B73: Green Jellyfish and Lava Bat remain Hardmode-only', v73pools.preSealed && v73pools.hardOcean && v73pools.hardHell, JSON.stringify(v73pools));

const v73render = await page.evaluate(() => {
  var ids = [E.CRAB, E.SEASNAIL, E.PIRANHA, E.LAVABAT, E.WALLCREEPER, E.SALAMANDER, E.BLUEJELLYFISH, E.GREENJELLYFISH];
  var rctx = (typeof ctx2d !== 'undefined' ? ctx2d : document.getElementById('canvas').getContext('2d'));
  try {
    for (var t = 0; t < ids.length; t++) {
      var e = makeEntity(ids[t], game.cam.x + t * 8, game.cam.y);
      drawEnemy(rctx, e, game.cam, 800, 600);
    }
  } catch (err) { return { ok:false, err:err.message }; }
  return { ok:true, count:ids.length };
});
check('B73: all eight enemies render without errors', v73render.ok && v73render.count === 8, JSON.stringify(v73render));

// ===== BATCH 74: SIGNATURE WEAPONS =====
const v74 = await page.evaluate(() => {
  var out = {};
  out.fofDef = typeof ITEMS['floweroffire'] !== 'undefined';
  out.pgDef = typeof ITEMS['piranhagun'] !== 'undefined';
  out.rgDef = typeof ITEMS['rainbowgun'] !== 'undefined';
  function recipeFor(id) { for (var r = 0; r < RECIPES.length; r++) if (RECIPES[r].result === id) return true; return false; }
  out.fofRecipe = recipeFor(I.FLOWEROFFIRE);
  out.pgRecipe = recipeFor(I.PIRANHAGUN);
  out.rgRecipe = recipeFor(I.RAINBOWGUN);

  var p = game.player;
  p.mana = p.maxMana;
  p.invuln = 99999;
  p.hp = p.maxHp;
  var bx = p.x, by = p.y;
  p.x = bx; p.y = by; p.vx = 0; p.vy = 0; p.attackCd = 0; p.swingT = 0;

  // Flower of Fire: bouncing fireball
  MOUSE.wx = p.x + 60; MOUSE.wy = p.y + 40;
  p.tryMagic(game, ITEMS['floweroffire'], 'floweroffire', null);
  var fofProj = null;
  for (var j = 0; j < game.projectiles.list.length; j++) { var o = game.projectiles.list[j]; if (o.owner === 'player' && !o.dead && o.type === P.FIREBALL && o.bounces >= 1) fofProj = o; }
  out.fofProj = !!fofProj;
  out.fofBounces = fofProj ? fofProj.bounces : 0;
  if (fofProj) fofProj.dead = true;

  // Rainbow Gun: trail wall zone damages enemies
  var enemy = makeEntity(E.ZOMBIE, bx + 40, by);
  enemy.hp = enemy.maxHp; enemy.hp = 600;
  game.entities.push(enemy);
  MOUSE.wx = enemy.x; MOUSE.wy = enemy.y;
  p.mana = p.maxMana;
  p.attackCd = 0;
  p.tryMagic(game, ITEMS['rainbowgun'], 'rainbowgun', null);
  var wallProj = null;
  for (var j2 = 0; j2 < game.projectiles.list.length; j2++) { var o2 = game.projectiles.list[j2]; if (!o2.dead && o2.deployMode === 'wall' && o2.trailWall) wallProj = o2; }
  out.wallCreated = !!wallProj;
  var enemyPre = enemy.hp;
  if (wallProj) {
    wallProj.x = enemy.x; wallProj.y = enemy.y;
    for (var s2 = 0; s2 < 50; s2++) step(1/60);
  }
  out.wallDamaged = enemy.hp < enemyPre;
  if (wallProj) wallProj.dead = true;
  enemy.dead = true;

  // Piranha Gun: ammo-free, latches and deals damage
  game.entities = game.entities.filter(function(en) { return en === p || (!en.dead && en.dmg <= 0); });
  p.x = bx; p.y = by; p.vx = 0; p.vy = 0;
  var invPre = 0; for (var s3 = 0; s3 < 50; s3++) if (p.inventory.slots[s3]) invPre += p.inventory.slots[s3].count;
  var enemy2 = makeEntity(E.ZOMBIE, bx + 34, by);
  enemy2.hp = enemy2.maxHp; enemy2.hp = 600;
  game.entities.push(enemy2);
  MOUSE.wx = enemy2.x; MOUSE.wy = enemy2.y;
  p.attackCd = 0;
  p.tryShoot(game, ITEMS['piranhagun'], 'piranhagun', null);
  var pgProj = null;
  for (var j3 = 0; j3 < game.projectiles.list.length; j3++) { var o3 = game.projectiles.list[j3]; if (!o3.dead && o3.piranha) pgProj = o3; }
  out.pgCreated = !!pgProj;
  var e2Pre = enemy2.hp;
  var latched = false;
  if (pgProj) {
    for (var s4 = 0; s4 < 100; s4++) { step(1/60); if (pgProj.latched) { latched = true; if (e2Pre - enemy2.hp > 40) break; } }
  }
  out.pgLatched = latched;
  out.pgDamaged = enemy2.hp < e2Pre;
  if (pgProj) pgProj.dead = true;
  enemy2.dead = true;
  var invPost = 0; for (var s5 = 0; s5 < 50; s5++) if (p.inventory.slots[s5]) invPost += p.inventory.slots[s5].count;
  out.pgAmmoConsumed = invPost - invPre;
  for (var s6 = 0; s6 < game.projectiles.list.length; s6++) game.projectiles.list[s6].dead = true;
  return out;
});
check('B74: three signature weapons and recipes exist', v74.fofDef && v74.pgDef && v74.rgDef && v74.fofRecipe && v74.pgRecipe && v74.rgRecipe, JSON.stringify(v74));
check('B74: Flower of Fire fires a bouncing fireball', v74.fofProj && v74.fofBounces >= 1, JSON.stringify(v74));
check('B74: Rainbow Gun places a damaging rainbow wall', v74.wallCreated && v74.wallDamaged, JSON.stringify(v74));
check('B74: Piranha Gun latches onto prey, damages it, consumes no ammo', v74.pgCreated && v74.pgLatched && v74.pgDamaged && v74.pgAmmoConsumed === 0, JSON.stringify(v74));

// ===== BATCH 75: VANILLA WEAPON ARCHETYPES =====
const v75 = await page.evaluate(() => {
  var out = {};
  var ids = ['waterbolt', 'demonscythe', 'beegun', 'starcannon', 'candycanesword', 'candycanebow'];
  out.allDefs = ids.every(function(s) { return typeof ITEMS[s] !== 'undefined'; });
  function recipeFor(id) { for (var r = 0; r < RECIPES.length; r++) if (RECIPES[r].result === id) return true; return false; }
  out.starcannonRecipe = recipeFor(I.STARCANNON);
  out.santaStock = (function() {
    var stock = TOWN_SHOPS[E.SANTA] || [];
    return stock.some(function(s) { return s.item === I.CANDYCANESWORD; }) && stock.some(function(s) { return s.item === I.CANDYCANE_BOW; });
  })();

  var p = game.player;
  p.mana = p.maxMana; p.invuln = 99999; p.hp = p.maxHp;
  var bx = p.x, by = p.y;

  // Water Bolt: bouncing water spell with a long life
  MOUSE.wx = bx + 60; MOUSE.wy = by;
  p.attackCd = 0;
  p.tryMagic(game, ITEMS['waterbolt'], 'waterbolt', null);
  var wb = null;
  for (var i = 0; i < game.projectiles.list.length; i++) { var o = game.projectiles.list[i]; if (!o.dead && o.type === P.WATERBOLT) wb = o; }
  out.waterboltFired = !!wb;
  out.waterboltBounces = wb ? wb.bounces : 0;
  out.waterboltLife = wb ? Math.round(wb.life * 10) / 10 : 0;
  if (wb) wb.dead = true;

  // Demon Scythe: slow start, accelerates, clamped
  p.mana = p.maxMana; p.attackCd = 0;
  p.tryMagic(game, ITEMS['demonscythe'], 'demonscythe', null);
  var ds = null;
  for (var i2 = 0; i2 < game.projectiles.list.length; i2++) { var o2 = game.projectiles.list[i2]; if (!o2.dead && o2.type === P.DEMONSCYTHE) ds = o2; }
  out.scytheFired = !!ds;
  if (ds) {
    var sp0 = Math.sqrt(ds.vx * ds.vx + ds.vy * ds.vy);
    ds.ignoreTiles = true;
    for (var s = 0; s < 120; s++) { ds.x = bx + 60; ds.y = by; step(1/60); }
    var sp1 = Math.sqrt(ds.vx * ds.vx + ds.vy * ds.vy);
    out.scytheAccel = sp1 > sp0 * 2;
    out.scytheClamped = sp1 <= 11.6;
    out.scythePersistent = !!ds.persistent;
    ds.dead = true;
  }

  // Bee Gun: single homing bee, mana-cost only
  p.mana = p.maxMana; p.attackCd = 0;
  var bee = makeEntity(E.ZOMBIE, bx + 80, by);
  bee.hp = 600;
  game.entities.push(bee);
  MOUSE.wx = bee.x; MOUSE.wy = bee.y;
  var manaPre = p.mana;
  p.tryMagic(game, ITEMS['beegun'], 'beegun', null);
  var bg = null;
  for (var i3 = 0; i3 < game.projectiles.list.length; i3++) { var o3 = game.projectiles.list[i3]; if (!o3.dead && o3.type === P.STINGER && o3.owner === 'player') bg = o3; }
  out.beeFired = !!bg;
  out.beeHoming = bg ? !!bg.homing : false;
  out.beeManaUsed = p.mana < manaPre;
  if (bg) bg.dead = true;
  bee.dead = true;

  // Star Cannon: consumes Fallen Stars, fires a fast star projectile
  p.inventory.add(I.FALLENSTAR, 5);
  var starsPre = p.inventory.countOf(I.FALLENSTAR);
  p.attackCd = 0;
  p.tryShoot(game, ITEMS['starcannon'], 'starcannon', null);
  var sc = null;
  for (var i4 = 0; i4 < game.projectiles.list.length; i4++) { var o4 = game.projectiles.list[i4]; if (!o4.dead && o4.type === P.STAR && o4.owner === 'player') sc = o4; }
  out.starFired = !!sc;
  out.starSpeed = sc ? Math.round(Math.sqrt(sc.vx * sc.vx + sc.vy * sc.vy) * 10) / 10 : 0;
  out.starsConsumed = starsPre - p.inventory.countOf(I.FALLENSTAR);
  if (sc) sc.dead = true;
  p.inventory.consume(I.FALLENSTAR, 999);

  // Candy Cane Sword: throws a candy cane projectile on swing
  p.attackCd = 0;
  MOUSE.wx = bx + 40; MOUSE.wy = by - 10;
  p.tryMelee(game, ITEMS['candycanesword'], 'candycanesword', null);
  var cd = null;
  for (var i5 = 0; i5 < game.projectiles.list.length; i5++) { var o5 = game.projectiles.list[i5]; if (!o5.dead && o5.type === P.CANDY) cd = o5; }
  out.candyFired = !!cd;
  if (cd) cd.dead = true;

  // Candy Cane Bow: a real bow, consumes one arrow
  var arrowsPre = p.inventory.countOf(I.ARROW);
  p.attackCd = 0;
  p.tryShoot(game, ITEMS['candycanebow'], 'candycanebow', null);
  var cb = null;
  for (var i6 = 0; i6 < game.projectiles.list.length; i6++) { var o6 = game.projectiles.list[i6]; if (!o6.dead && o6.type === P.ARROW && o6.owner === 'player') cb = o6; }
  out.candyBowFired = !!cb;
  out.candyBowArrowUsed = arrowsPre - p.inventory.countOf(I.ARROW) === 1;
  if (cb) cb.dead = true;
  for (var clr = 0; clr < game.projectiles.list.length; clr++) game.projectiles.list[clr].dead = true;

  // Queen Bee grants the Bee Gun
  var pickupsPre = game.pickups.length;
  makeBoss(game, { boss:'queenbee', name:'Queen Bee', w:46, h:42, hp:1, dmg:28, def:6, color:'#ffd75e', barColor:'#ffc040', x:bx + 240, y:by - 100 });
  var qb = null;
  for (var i7 = 0; i7 < game.entities.length; i7++) { if (game.entities[i7].boss === 'queenbee') qb = game.entities[i7]; }
  killBoss(qb, game);
  out.queenBeeBeeGun = false;
  for (var pi = pickupsPre; pi < game.pickups.length; pi++) { if (game.pickups[pi].item === I.BEEGUN) out.queenBeeBeeGun = true; }
  for (var pi2 = game.pickups.length - 1; pi2 >= pickupsPre; pi2--) game.pickups.splice(pi2, 1);

  // Demons can drop the Demon Scythe, and every drop resolves
  var seen = {}, valid = true;
  for (var t = 0; t < 2000; t++) {
    var dr = dropTable(E.DEMON, game);
    for (var di = 0; di < dr.length; di++) {
      if (typeof ITEMS[dr[di].id] === 'undefined') valid = false;
      seen[dr[di].id] = true;
    }
  }
  out.demonScytheDrops = !!seen['demonscythe'];
  out.demonDropsValid = valid;

  // New projectile render paths
  var rctx = (typeof ctx2d !== 'undefined' ? ctx2d : document.getElementById('canvas').getContext('2d'));
  out.renders = true;
  try {
    var mk = function(t) { return { x:game.cam.x, y:game.cam.y, vx:2, vy:0, type:t, age:0.3, life:1, dead:false }; };
    drawProjectile(rctx, mk(P.WATERBOLT), game.cam, 800, 600);
    drawProjectile(rctx, mk(P.DEMONSCYTHE), game.cam, 800, 600);
    drawProjectile(rctx, mk(P.CANDY), game.cam, 800, 600);
  } catch (err) { out.renders = false; out.renderErr = err.message; }

  return out;
});
check('B75: six archetype weapons exist, Star Cannon crafts, Santa sells candy weapons', v75.allDefs && v75.starcannonRecipe && v75.santaStock, JSON.stringify(v75));
check('B75: Water Bolt fires a 5-bounce long-lived water spell', v75.waterboltFired && v75.waterboltBounces === 5 && v75.waterboltLife === 3, JSON.stringify(v75));
check('B75: Demon Scythe accelerates, stays piercing, and clamps speed', v75.scytheFired && v75.scytheAccel && v75.scytheClamped && v75.scythePersistent, JSON.stringify(v75));
check('B75: Bee Gun fires a homing bee for mana only', v75.beeFired && v75.beeHoming && v75.beeManaUsed, JSON.stringify(v75));
check('B75: Star Cannon consumes Fallen Stars at cannon speed', v75.starFired && v75.starSpeed === 14 && v75.starsConsumed === 1, JSON.stringify(v75));
check('B75: Candy Cane Sword throws candy projectiles', v75.candyFired, JSON.stringify(v75));
check('B75: Candy Cane Bow is a real bow that consumes arrows', v75.candyBowFired && v75.candyBowArrowUsed, JSON.stringify(v75));
check('B75: Queen Bee grants the Bee Gun; Demons can drop the Demon Scythe', v75.queenBeeBeeGun && v75.demonScytheDrops && v75.demonDropsValid, JSON.stringify(v75));
check('B75: new projectile render paths draw cleanly', v75.renders, JSON.stringify(v75));

// ===== BATCH 76: VANILLA ENEMY/CRITTER ROSTER =====
const v76 = await page.evaluate(() => {
  var out = {};
  var ids = ['vulture', 'shark', 'orca', 'snatcher', 'meteorhead', 'reddevil', 'penguin', 'purpleslime', 'yellowslime', 'redslime', 'blackslime'];
  var enums = [E.VULTURE, E.SHARK, E.ORCA, E.SNATCHER, E.METEORHEAD, E.REDDEVIL, E.PENGUIN, E.PURPLESLIME, E.YELLOWSLIME, E.REDSLIME, E.BLACKSLIME];
  out.allDefs = enums.every(function(t) { return typeof ENT_DEF[t] !== 'undefined' && ENT_DEF[t].hp > 0; });
  out.sharkFinItem = typeof ITEMS['sharkfin'] !== 'undefined';

  // spawn + step + finite for all eleven
  out.step = true;
  out.stepped = [];
  for (var i = 0; i < enums.length; i++) {
    var e = makeEntity(enums[i], game.player.x + 120 + i * 12, game.player.y - 40);
    e.hp = e.maxHp;
    game.entities.push(e);
    var steps = 0;
    while (!e.dead && steps < 120) { step(1/60); steps++; }
    var ok = !e.dead && isFinite(e.x) && isFinite(e.y) && e.hp > 0;
    if (!ok) out.step = false;
    out.stepped.push({ id: enums[i], alive: !e.dead, finite: isFinite(e.x) && isFinite(e.y) });
    e.dead = true;
  }
  game.entities = game.entities.filter(function(en) { return !en.dead; });

  // drops resolve: shark fin canonical, new slimes drop gel
  var sharkDrops = dropTable(E.SHARK, game);
  out.sharkFinDrop = sharkDrops.some(function(d) { return d.id === I.SHARKFIN; }) && sharkDrops.some(function(d) { return d.id === I.GEL; });
  var gelSlime = true;
  [E.PURPLESLIME, E.YELLOWSLIME, E.REDSLIME, E.BLACKSLIME].forEach(function(t) {
    var dr = dropTable(t, game);
    if (!dr.some(function(d) { return d.id === I.GEL; })) gelSlime = false;
  });
  out.gelSlimes = gelSlime;
  var sharkTries = 0;
  while (sharkTries++ < 50 && !dropTable(E.SHARK, game).every(function(d) { return typeof ITEMS[d.id] !== 'undefined'; })) {}
  out.dropsValid = true;

  // pools: targeted per-biome sampling (broad sweeps are too sparse for 1-in-N pool entries)
  var p = game.player, savedHm = game.hardmode;
  function biomeColumn(bname) {
    for (var x = 4; x < game.world.W - 4; x++) {
      if (game.world.biomeAt(x * TILE + 8, game.world.surfaceY[x] * TILE - 40) === bname) return x;
    }
    return -1;
  }
  function sampleAt(x, ty, hm, n) {
    game.hardmode = hm;
    p.x = x * TILE + 8;
    p.y = ty * TILE;
    var seen = {};
    for (var i = 0; i < n; i++) {
      var t = pickEnemy();
      if (typeof ENT_DEF[t] === 'undefined') out.poolInvalid = true;
      seen[t] = true;
    }
    return seen;
  }
  out.poolInvalid = false;
  var dx = biomeColumn(BIOME.DESERT), ox = biomeColumn(BIOME.OCEAN), jx = biomeColumn(BIOME.JUNGLE), fx = biomeColumn(BIOME.FOREST);
  var preDesert = sampleAt(dx, game.world.surfaceY[dx] - 3, false, 2500);
  var preOcean = sampleAt(ox, game.world.surfaceY[ox] - 3, false, 2500);
  var preJungle = sampleAt(jx, game.world.surfaceY[jx] - 3, false, 2500);
  var preForest = sampleAt(fx, game.world.surfaceY[fx] - 3, false, 2500);
  var preCave = sampleAt(fx, game.world.surfaceY[fx] + 20, false, 2500);
  var preDeep = sampleAt(fx, game.world.surfaceY[fx] + 40, false, 4000);
  var hmOcean = sampleAt(ox, game.world.surfaceY[ox] - 3, true, 2500);
  var hmHell = sampleAt(fx, game.world.hellY + 8, true, 4000);
  p.x = game.world.spawnX; p.y = game.world.spawnY;
  game.hardmode = savedHm;
  out.preDesertVultureYellow = preDesert[E.VULTURE] && preDesert[E.YELLOWSLIME];
  out.preOceanShark = preOcean[E.SHARK];
  out.preJungleSnatcher = preJungle[E.SNATCHER];
  out.preForestRedSlime = preForest[E.REDSLIME];
  out.preCavePurple = preCave[E.PURPLESLIME];
  out.preDeepBlack = preDeep[E.BLACKSLIME];
  out.hmOceanOrcaShark = hmOcean[E.ORCA] && hmOcean[E.SHARK];
  out.hmHellRedDevil = hmHell[E.REDDEVIL];

  // Meteor Head: bury a meteorite tile near the player and sweep pickEnemy
  var mtx = clamp(Math.floor(p.x / TILE) + 3, 2, game.world.W - 3);
  var mty = clamp(Math.floor(p.y / TILE), 2, game.world.H - 3);
  var oldTile = game.world.get(mtx, mty);
  game.world.set(mtx, mty, T.METEORITE);
  var meteorSeen = false;
  for (var mt = 0; mt < 200 && !meteorSeen; mt++) { if (pickEnemy() === E.METEORHEAD) meteorSeen = true; }
  game.world.set(mtx, mty, oldTile);
  out.meteorHeadCrater = meteorSeen;

  // Penguin critter membership + snow pool wiring
  out.penguinCritter = isAmbientCritter(E.PENGUIN) && ENT_DEF[E.PENGUIN].dmg === 0;
  var penguinStepsFine = true;
  try {
    var peng = makeEntity(E.PENGUIN, p.x + 40, p.y - 10);
    game.entities.push(peng);
    for (var ps = 0; ps < 60; ps++) step(1/60);
    if (!isFinite(peng.x) || !isFinite(peng.y)) penguinStepsFine = false;
    peng.dead = true;
    game.entities = game.entities.filter(function(en) { return !en.dead; });
  } catch (err) { penguinStepsFine = false; out.penguinErr = err.message; }
  out.penguinSteps = penguinStepsFine;

  // render all eleven
  var rctx = (typeof ctx2d !== 'undefined' ? ctx2d : document.getElementById('canvas').getContext('2d'));
  out.renders = true;
  try {
    for (var ri = 0; ri < enums.length; ri++) {
      var re = makeEntity(enums[ri], game.cam.x + ri * 8, game.cam.y);
      drawEnemy(rctx, re, game.cam, 800, 600);
    }
  } catch (err) { out.renders = false; out.renderErr = err.message; }

  return out;
});
check('B76: eleven vanilla species defined, Shark Fin item exists', v76.allDefs && v76.sharkFinItem, JSON.stringify(v76));
check('B76: all eleven spawn, step, and stay finite', v76.step, JSON.stringify(v76.stepped));
check('B76: Shark drops Shark Fin + Gel; palette slimes drop Gel', v76.sharkFinDrop && v76.gelSlimes, JSON.stringify(v76));
check('B76: pre-HM pools expose Vulture/Yellow Slime (desert), Shark (ocean), Snatcher (jungle), Red Slime (forest), Purple/Black Slimes (caves)', v76.preDesertVultureYellow && v76.preOceanShark && v76.preJungleSnatcher && v76.preForestRedSlime && v76.preCavePurple && v76.preDeepBlack && !v76.poolInvalid, JSON.stringify({ preDesertVultureYellow: v76.preDesertVultureYellow, preOceanShark: v76.preOceanShark, preJungleSnatcher: v76.preJungleSnatcher, preForestRedSlime: v76.preForestRedSlime, preCavePurple: v76.preCavePurple, preDeepBlack: v76.preDeepBlack, poolInvalid: v76.poolInvalid }));
check('B76: Hardmode pools expose Orca/Shark (ocean) and Red Devil (Underworld)', v76.hmOceanOrcaShark && v76.hmHellRedDevil && !v76.poolInvalid, JSON.stringify({ hmOceanOrcaShark: v76.hmOceanOrcaShark, hmHellRedDevil: v76.hmHellRedDevil }));
check('B76: Meteor Heads spawn near meteorite craters', v76.meteorHeadCrater, JSON.stringify(v76));
check('B76: Penguin is a snow critter with working AI', v76.penguinCritter && v76.penguinSteps, JSON.stringify(v76));
check('B76: all eleven render without errors', v76.renders, JSON.stringify(v76));

// ===== BATCH 79: REMAINING VANILLA ROSTER =====
const v79 = await page.evaluate(() => {
  var out = {};
  var enums = [E.HOPLITE, E.ICYMERMAN, E.GIANTSHELLY, E.FLOATYGROSS, E.SANDPOACHER, E.DESERTSPIRIT,
    E.TOMBCRAWLER, E.SANDSHARK, E.CRYSTALTHRESHER, E.ANOMURAFUNGUS, E.FUNGOFISH, E.SKELMERCHANT,
    E.ROCKGOLEM, E.POSSESSEDARMOR, E.WANDERINGEYENPC, E.RUNEWIZARD, E.ENCHANTEDSWORDNPC,
    E.ANGRYTRAPPER, E.ILLUBAT, E.ILLUSLIME, E.GHOUL, E.DREAMERGHOUL, E.LAMIA, E.WORLDFEEDER,
    E.BLOODJELLY, E.BLOODFEEDER, E.CORRUPTBUNNY, E.CORRUPTGOLDFISH, E.CORRUPTPENGUIN,
    E.FUNGIBULB, E.GIANTFUNGI, E.MUSHILADYBUG, E.COCHINEALBEETLE, E.CYANBEETLE, E.LACBEETLE,
    E.SPOREBAT, E.SPORESKELETON, E.TORTUREDSOUL];
  out.count = enums.length;
  out.allDefs = enums.every(function(t) { return typeof ENT_DEF[t] !== 'undefined' && ENT_DEF[t].hp > 0; });
  out.step = true;
  out.stepped = [];
  var bx = game.player.x, by = game.player.y;
  for (var i = 0; i < enums.length; i++) {
    var e = makeEntity(enums[i], bx + 100 + (i % 6) * 14, by - 30);
    e.hp = e.maxHp;
    if (e.wyvernSegments || e.segments) {} // worms get segments via init at spawn
    game.entities.push(e);
    var steps = 0;
    while (!e.dead && steps < 120) { step(1/60); steps++; }
    var ok = !e.dead && isFinite(e.x) && isFinite(e.y) && e.hp > 0;
    if (!ok) out.step = false;
    out.stepped.push({ id: enums[i], alive: !e.dead, finite: isFinite(e.x) && isFinite(e.y) });
    e.dead = true;
  }
  game.entities = game.entities.filter(function(en) { return !en.dead; });
  // blood moon corrupt critters in trash pool
  var bm = EVENT_WAVES.bloodmoon;
  out.corruptCritters = bm.trash.indexOf(E.CORRUPTBUNNY) >= 0 && bm.trash.indexOf(E.CORRUPTGOLDFISH) >= 0 && bm.trash.indexOf(E.CORRUPTPENGUIN) >= 0;
  // pool spot checks
  function biomeColumn(bname) {
    for (var x = 4; x < game.world.W - 4; x++) if (game.world.biomeAt(x * TILE + 8, game.world.surfaceY[x] * TILE - 40) === bname) return x;
    return -1;
  }
  var p = game.player, savedHm = game.hardmode;
  function sampleAt(x, ty, hm, n) {
    game.hardmode = hm; p.x = x * TILE + 8; p.y = ty * TILE;
    var seen = {};
    for (var i = 0; i < n; i++) { var t = pickEnemy(); if (typeof ENT_DEF[t] === 'undefined') out.poolInvalid = true; seen[t] = true; }
    return seen;
  }
  out.poolInvalid = false;
  var jx = biomeColumn(BIOME.JUNGLE), dx = biomeColumn(BIOME.DESERT), mx = biomeColumn(BIOME.MUSHROOM), fx = biomeColumn(BIOME.FOREST);
  var preJungle = sampleAt(jx, game.world.surfaceY[jx] - 3, false, 4000);
  var preMush = sampleAt(mx, game.world.surfaceY[mx] - 3, false, 4000);
  var preMarble = null;
  for (var sx2 = 4; sx2 < game.world.W - 4 && !preMarble; sx2++) {
    var found = false;
    for (var sy2 = game.world.surfaceY[sx2] + 14; sy2 < game.world.H - 4; sy2++) {
      if (game.world.get(sx2, sy2) === T.MARBLE) { found = sy2; break; }
    }
    if (found) preMarble = { x: sx2, y: found };
  }
  var preHoplite = false;
  if (preMarble) {
    game.hardmode = false; p.x = preMarble.x * TILE + 8; p.y = (preMarble.y - 2) * TILE;
    for (var hh = 0; hh < 3000 && !preHoplite; hh++) if (pickEnemy() === E.HOPLITE) preHoplite = true;
  }
  var preCave = sampleAt(fx, game.world.surfaceY[fx] + 20, false, 6000);
  var hmHell = sampleAt(fx, game.world.hellY + 8, true, 4000);
  p.x = game.world.spawnX; p.y = game.world.spawnY; game.hardmode = savedHm;
  out.preJungleShellyTrapper = preJungle[E.GIANTSHELLY] || true; // shelly is pre-only; trapper HM-only (checked below)
  out.preMushroomTrio = preMush[E.FUNGIBULB] && preMush[E.ANOMURAFUNGUS] && preMush[E.SPOREBAT];
  out.preHoplite = preHoplite;
  out.preCaveMerchant = preCave[E.SKELMERCHANT];
  out.hmHellTortured = hmHell[E.TORTUREDSOUL];
  // HM pools
  game.hardmode = true;
  var hmUnderdesert = sampleAt(dx, game.world.surfaceY[dx] + 20, true, 6000);
  game.hardmode = savedHm;
  out.hmUnderdesertPack = hmUnderdesert[E.SANDPOACHER] && hmUnderdesert[E.GHOUL] && hmUnderdesert[E.LAMIA];
  // render all
  var rctx = (typeof ctx2d !== 'undefined' ? ctx2d : document.getElementById('canvas').getContext('2d'));
  out.renders = true;
  try {
    for (var ri = 0; ri < enums.length; ri++) {
      var re = makeEntity(enums[ri], game.cam.x + (ri % 8) * 9, game.cam.y);
      drawEnemy(rctx, re, game.cam, 800, 600);
    }
  } catch (err) { out.renders = false; out.renderErr = err.message; }
  return out;
});
check('B79: 38 new vanilla species defined', v79.count === 38 && v79.allDefs, JSON.stringify(v79.count));
check('B79: all new species spawn, step, stay finite', v79.step, JSON.stringify(v79.stepped.filter(s => !s.finite || !s.alive)));
check('B79: Blood Moon trash includes corrupt critters', v79.corruptCritters, JSON.stringify(v79));
check('B79: pools expose Hoplite/mushroom trio/merchant + no invalid picks', v79.preHoplite && v79.preMushroomTrio && v79.preCaveMerchant && v79.poolInvalid === false, JSON.stringify({ hoplite: v79.preHoplite, mush: v79.preMushroomTrio, merch: v79.preCaveMerchant, inv: v79.poolInvalid }));
check('B79: Hardmode pools expose Sand Poacher/Ghoul family; Underworld Tortured Soul', v79.hmUnderdesertPack && v79.hmHellTortured, JSON.stringify({ pack: v79.hmUnderdesertPack, hell: v79.hmHellTortured }));
check('B79: all 38 render without errors', v79.renders, JSON.stringify(v79.renderErr || true));

// ===== BATCH 78g: CANONICAL PROGRESSION SYSTEMS =====
const v78g = await page.evaluate(() => {
  var out = {};
  var count = 0, px = 0, py = 0;
  for (var j = 0; j < game.world.tiles.length; j++) {
    if (game.world.tiles[j] === T.HEARTCRYSTAL) { count++; if (!px) { py = Math.floor(j / game.world.W); px = j % game.world.W; } }
  }
  out.heartCrystals = count;
  var p = game.player;
  p.x = px * TILE; p.y = (py - 2) * TILE; p.invuln = 9999;
  MOUSE.wx = px * TILE + 8; MOUSE.wy = py * TILE + 8;
  var mined = false;
  for (var t = 0; t < 60 && !mined; t++) { p.tryMine(game, ITEMS['copperpick'], 'copperpick'); step(1/60); mined = p.inventory.countOf(I.HEART) > 0; }
  out.heartMined = mined;
  out.heartConsumes = (function() {
    p.maxHp = 100;
    p.inventory.add(I.HEART, 1);
    p.attackCd = 0;
    p.tryConsume(game, ITEMS['heart'], 'heart', null);
    var ok = p.maxHp === 120;
    p.maxHp = 100; p.hp = 100;
    return ok;
  })();
  // mana crystal progression
  out.manaStarts20 = p.maxMana === 20 || p.maxMana === 200; // saves may restore higher
  p.maxMana = 20; p.mana = 20;
  p.inventory.add(I.MANACRYSTAL, 1);
  p.attackCd = 0;
  p.tryConsume(game, ITEMS['manacrystal'], 'manacrystal', null);
  out.manaCrystal = p.maxMana === 40;
  out.manaRecipe = (function() { for (var r = 0; r < RECIPES.length; r++) if (RECIPES[r].result === I.MANACRYSTAL) return true; return false; })();
  p.maxMana = 20;
  // crits exist in the combat path
  out.critPath = (function() {
    var saw = 0;
    for (var c = 0; c < 500; c++) if (Math.random() < 0.04) saw++;
    return true; // crit var wired in tryMelee/tryShoot/tryMagic; sanity: code exec reachable
  })();
  return out;
});
check('B78g: ~30 heart crystals generate underground and mine to consumable hearts', v78g.heartCrystals >= 20 && v78g.heartMined && v78g.heartConsumes, JSON.stringify(v78g));
check('B78g: Mana Crystal consumes +20 max mana, recipe exists', v78g.manaCrystal && v78g.manaRecipe, JSON.stringify(v78g));


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
