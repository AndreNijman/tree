// ---------- World ----------
function World(width, height, seed, difficulty) {
  this.W = width;
  this.H = height;
  this.seed = seed;
  this.difficulty = difficulty || 'normal';
  this.rng = mulberry32(seed);
  this.tiles = new Uint8Array(width * height);
  this.walls = new Uint8Array(width * height);
  this.hp = new Uint16Array(width * height);
  this.spawnX = 0;
  this.spawnY = 0;
  this.surfaceY = new Uint16Array(width);
  this.lights = []; // {x,y,r}
  this.guidePos = null;
  this.heartCrystals = []; // {x,y}
  this.chests = [];
  this.nearbyStations = []; // updated each frame
  this.templeRect = null; // {x0,y0,x1,y1} Lihzahrd temple
  this.planteraBulbs = []; // {x,y}
  this.mushroomAt = null; // Uint8Array over columns (mushroom patches)
  this.spilledChestItems = null; // set when a chest breaks; contents spill as pickups
  this.hellY = Math.max(60, height - 200); // vanilla: Underworld detection is the bottom 200 tiles
  this.spiderCols = null; // Uint8Array over columns (spider caves)
  this.graniteCols = null; // Uint8Array over columns (granite caves)
  this.marbleCols = null; // Uint8Array over columns (marble caves)
  this.aetherPos = null; // {x,y} tile of the shimmer pool
  this.skyIslands = []; // {x,y,w} floating islands
  this.evil = 'corrupt'; // 'corrupt' | 'crimson' — world's evil biome (set in generate)
  this.hardmode = false;
  this.evilChasms = []; // {x,y,depth}
  this.evilObjects = []; // {x,y,tile}
  this.altars = []; // {x,y} Demon/Crimson Altars
  this.altarsSmashed = []; // {x,y} world tiles that already delivered their ore bonus
  this.beeHives = []; // {x,y,w,h}
  this.larvae = []; // {x,y}
  this.dungeonRect = null; // {x0,y0,x1,y1} the Dungeon
  this.dungeonEntrance = null; // pixel position for the post-Golem Cultist ritual
  this.dungeonOpen = false; // true after Skeletron is defeated
  this.dungeonDoors = []; // {x,y} gate tiles that open after Skeletron
  this.underDesertCols = null; // Uint8Array over columns (underground desert)
  this.underSnowCols = null; // Uint8Array over columns (underground snow)
  this.underDesertStart = new Uint16Array(width); // tile row where deep sand begins
  this.meteorCraters = []; // {x,y,r} meteor craters
  this.underworldHouses = []; // {x,y,w,h} furnished Hellbrick houses
  this.rockY = new Uint16Array(width); // dirt/rock boundary per column
  this.underSnowMinX = new Int16Array(height); // ice trapezoid edges per row
  this.underSnowMaxX = new Int16Array(height);
  this.spreadFrontier = []; // tile indexes of evil/Hallow stone that can spread (hardmode)
  this.pylons = []; // {x,y,item} town pylon nodes
  this.spilledPylonItem = null; // set when a pylon breaks; its item is recovered
}

// Hardmode biome spread tuning (game-seconds between spread events, max tiles converted per event)
var SPREAD_INTERVAL = 1.5;
var SPREAD_TICK_MAX = 4;

World.prototype.idx = function(x, y) { return y * this.W + x; };
World.prototype.inBounds = function(x, y) { return x >= 0 && x < this.W && y >= 0 && y < this.H; };

World.prototype.get = function(x, y) {
  if (!this.inBounds(x, y)) return -1;
  return this.tiles[this.idx(x, y)];
};

World.prototype.set = function(x, y, t) {
  if (!this.inBounds(x, y)) return;
  this.tiles[this.idx(x, y)] = t;
  if (t !== T.AIR) {
    var hard = TILE_HARD[t];
    this.hp[this.idx(x, y)] = hard ? hard[1] : 40;
  } else {
    this.hp[this.idx(x, y)] = 0;
  }
  if (t === T.TORCH) this.rebuildLights();
  this._skyDirty = true; // first-solid-from-sky cache needs a refresh
};

// First solid tile from the top of the world per column — sunlight reaches
// every tile above it (open shafts/wells stay lit, like Terraria).
World.prototype.skyTopAt = function(x) {
  if (!this._skyTop || this._skyTop.length !== this.W || this._skyDirty) {
    this._skyTop = new Array(this.W);
    this._skyDirty = false;
  }
  if (this._skyTop[x] === undefined) {
    var st = this.H - 1;
    for (var y = 0; y < this.H; y++) {
      if (this.isSolidTile(this.tiles[this.idx(x, y)])) { st = y; break; }
    }
    this._skyTop[x] = st;
  }
  return this._skyTop[x];
};

World.prototype.wall = function(x, y) {
  if (!this.inBounds(x, y)) return 0;
  return this.walls[this.idx(x, y)];
};

World.prototype.setWall = function(x, y, wall) {
  if (!this.inBounds(x, y)) return false;
  this.walls[this.idx(x, y)] = wall;
  this.dirty = true;
  return true;
};

World.prototype.isSolidTile = function(t) {
  if (t === T.AIR || t === T.PLATFORM || t === T.TORCH || t === T.COBWEB || t === T.WATER || t === T.LAVA || t === T.SHIMMER ||
      t === T.TREETRUNK || t === T.LEAVES || t === T.LEAVES_CORRUPT || t === T.LEAVES_CRIMSON || t === T.LEAVES_HALLOW || t === T.LEAVES_JUNGLE ||
      t === T.SHADOWORB || t === T.CRIMSONHEART || t === T.LARVA || t === T.TOMBSTONE || t === T.SUNFLOWER) return false;
  if (t === T.ALTAR) return true;
  return t >= 0;
};

World.prototype.isWaterAt = function(px, py) {
  var tx = Math.floor(px / TILE), ty = Math.floor(py / TILE);
  return this.get(tx, ty) === T.WATER;
};

World.prototype.isLavaAt = function(px, py) {
  var tx = Math.floor(px / TILE), ty = Math.floor(py / TILE);
  return this.get(tx, ty) === T.LAVA;
};

World.prototype.isShimmerAt = function(px, py) {
  var tx = Math.floor(px / TILE), ty = Math.floor(py / TILE);
  return this.get(tx, ty) === T.SHIMMER;
};

World.prototype.liquidAt = function(px, py) {
  var t = this.getTileAtPix(px, py);
  if (t === T.WATER) return 'water';
  if (t === T.LAVA) return 'lava';
  if (t === T.SHIMMER) return 'shimmer';
  return null;
};

World.prototype.isSolid = function(x, y) {
  if (x < 0 || x >= this.W) return true;
  if (y >= this.H) return true;
  if (y < 0) return false;
  return this.isSolidTile(this.tiles[this.idx(x, y)]);
};

World.prototype.isPlatform = function(x, y) {
  if (!this.inBounds(x, y)) return false;
  return this.tiles[this.idx(x, y)] === T.PLATFORM;
};

// Pixel-level queries
World.prototype.solidAt = function(px, py) { return this.isSolid(Math.floor(px / TILE), Math.floor(py / TILE)); };
World.prototype.platformAt = function(px, py) { return this.isPlatform(Math.floor(px / TILE), Math.floor(py / TILE)); };

World.prototype.getTileAtPix = function(px, py) { return this.get(Math.floor(px / TILE), Math.floor(py / TILE)); };

// Damage a tile; returns true if it broke (and item dropped)
World.prototype.damageTile = function(x, y, power, speed) {
  if (!this.inBounds(x, y)) return false;
  var t = this.tiles[this.idx(x, y)];
  if (t === T.AIR || t === T.WATER) return false;
  var hard = TILE_HARD[t] || [0, 40];
  if (power < hard[0]) return false;
  var dmg = speed || 1;
  this.hp[this.idx(x, y)] -= dmg;
  if (this.hp[this.idx(x, y)] <= 0) {
    this.breakTile(x, y);
    return true;
  }
  return false;
};

World.prototype.breakTile = function(x, y) {
  var t = this.tiles[this.idx(x, y)];
  if (t === T.AIR) return null;
  this.tiles[this.idx(x, y)] = T.AIR;
  if (typeof terrainCache !== 'undefined') terrainCache.dirty = true;
  this.hp[this.idx(x, y)] = 0;
  if (t === T.TORCH) this.rebuildLights();
  if (t === T.CHEST || t === T.SHADOWCHEST) {
    var c = this.removeChest(x, y);
    if (c) this.spilledChestItems = c.inv;
  }
  if (t === T.PYLON) {
    var pr = this.removePylon(x, y);
    if (pr) this.spilledPylonItem = pr.item;
  }
  return TILE_DROP[t] || null;
};

// Chest storage helpers
World.prototype.chestAt = function(x, y) {
  var tile = this.get(x, y);
  if (tile !== T.CHEST && tile !== T.SHADOWCHEST) return null;
  for (var i = 0; i < this.chests.length; i++) {
    if (this.chests[i].x === x && this.chests[i].y === y) return this.chests[i];
  }
  var c = tile === T.SHADOWCHEST ? { x:x, y:y, inv:[], kind:'shadow', locked:true, key:I.SHADOWKEY } : { x:x, y:y, inv:[] };
  this.chests.push(c);
  return c;
};

World.prototype.removeChest = function(x, y) {
  for (var i = 0; i < this.chests.length; i++) {
    if (this.chests[i].x === x && this.chests[i].y === y) {
      var c = this.chests[i];
      this.chests.splice(i, 1);
      return c;
    }
  }
  return null;
};

// Town pylon storage helpers
World.prototype.pylonAt = function(x, y) {
  for (var i = 0; i < this.pylons.length; i++) {
    if (this.pylons[i].x === x && this.pylons[i].y === y) return this.pylons[i];
  }
  return null;
};

World.prototype.addPylon = function(x, y, item) {
  var existing = this.pylonAt(x, y);
  if (existing) { existing.item = item; return existing; }
  var rec = { x: x, y: y, item: item };
  this.pylons.push(rec);
  return rec;
};

World.prototype.removePylon = function(x, y) {
  for (var i = 0; i < this.pylons.length; i++) {
    if (this.pylons[i].x === x && this.pylons[i].y === y) {
      return this.pylons.splice(i, 1)[0];
    }
  }
  return null;
};

World.prototype.rebuildLights = function() {
  this.lights.length = 0;
  for (var y = 0; y < this.H; y++) {
    for (var x = 0; x < this.W; x++) {
      var t = this.tiles[this.idx(x, y)];
      if (t === T.TORCH) this.lights.push({ x:x * TILE + 8, y:y * TILE + 8, r:5 });
      else if (t === T.GLOWSTONE) this.lights.push({ x:x * TILE + 8, y:y * TILE + 8, r:3.2 });
    }
  }
};

// Check if a placed block would overlap an entity (player)
World.prototype.overlapsPlayer = function(x, y, ent) {
  var px0 = x * TILE, py0 = y * TILE;
  return (px0 + TILE > ent.x - ent.w / 2 && px0 < ent.x + ent.w / 2 && py0 + TILE > ent.y - ent.h && py0 < ent.y);
};

World.prototype.findSafeSpawn = function(width, height) {
  var originX = clamp(Math.floor(this.spawnX / TILE), 2, this.W - 3);
  var halfW = width / 2;
  for (var radius = 0; radius <= 96; radius++) {
    var candidates = radius ? [originX - radius, originX + radius] : [originX];
    for (var c = 0; c < candidates.length; c++) {
      var tx = candidates[c];
      if (tx < 2 || tx >= this.W - 2) continue;
      var px = tx * TILE + 8;
      var left = Math.floor((px - halfW) / TILE);
      var right = Math.floor((px + halfW - 0.01) / TILE);
      for (var ground = 3; ground < this.H - 1; ground++) {
        var supported = true;
        for (var sx = left; sx <= right; sx++) {
          if (!this.isSolid(sx, ground) && !this.isPlatform(sx, ground)) { supported = false; break; }
        }
        if (!supported) continue;
        var py = ground * TILE - height / 2 - 0.01;
        var top = Math.floor((py - height / 2) / TILE);
        var bottom = Math.floor((py + height / 2 - 0.01) / TILE);
        var clear = true;
        for (var x = left; x <= right && clear; x++) {
          for (var y = top; y <= bottom; y++) {
            if (this.get(x, y) !== T.AIR) { clear = false; break; }
          }
        }
        if (clear) return { x:px, y:py };
      }
    }
  }
  return { x:this.spawnX, y:this.spawnY };
};

// Nearby crafting stations relative to pixel pos
World.prototype.findStations = function(px, py) {
  var res = [];
  var cx = Math.floor(px / TILE), cy = Math.floor(py / TILE);
  for (var dx = -3; dx <= 3; dx++) {
    for (var dy = -3; dy <= 3; dy++) {
      var t = this.get(cx + dx, cy + dy);
      if (t === T.WORKBENCH || t === T.FURNACE || t === T.ANVIL || t === T.HELLFORGE) res.push(t);
    }
  }
  return res;
};

World.prototype.graveyardStrengthAt = function(px, py) {
  var tx = clamp(Math.floor(px / TILE), 0, this.W - 1);
  var ty = clamp(Math.floor(py / TILE), 0, this.H - 1);
  var cache = this.graveyardCache;
  if (cache && cache.x === tx && cache.y === ty) return cache.strength;
  var graves = 0, flowers = 0;
  var x0 = Math.max(0, tx - 85), x1 = Math.min(this.W - 1, tx + 85);
  var y0 = Math.max(0, ty - 62), y1 = Math.min(this.H - 1, ty + 62);
  for (var y = y0; y <= y1; y++) {
    for (var x = x0; x <= x1; x++) {
      var tile = this.tiles[this.idx(x, y)];
      if (tile === T.TOMBSTONE) graves++;
      else if (tile === T.SUNFLOWER) flowers++;
    }
  }
  var strength = Math.max(0, graves - flowers);
  this.graveyardCache = { x:tx, y:ty, strength:strength };
  return strength;
};

World.prototype.isUnderground = function(px, py) {
  return py > this.surfaceY[clamp(Math.floor(px / TILE), 0, this.W - 1)] * TILE + TILE * 12;
};

// Biome at a pixel position (surface + underground + mini-biome aware)
World.prototype.biomeAt = function(px, py) {
  var tx = Math.floor(px / TILE), ty = Math.floor(py / TILE);
  if (tx < 0 || tx >= this.W) return BIOME.OCEAN;
  var surf = this.surfaceY[tx];
  if (this.templeRect && tx >= this.templeRect.x0 && tx <= this.templeRect.x1 &&
      ty >= this.templeRect.y0 && ty <= this.templeRect.y1) return BIOME.TEMPLE;
  if (this.dungeonRect && tx >= this.dungeonRect.x0 - 2 && tx <= this.dungeonRect.x1 + 2 &&
      ty >= this.dungeonRect.y0 && ty <= this.dungeonRect.y1) {
    // vanilla counts dungeon bricks nearby — avoids marking the whole bounding box
    var dBricks = 0;
    for (var dbx = Math.max(0, tx - 4); dbx <= Math.min(this.W - 1, tx + 4) && dBricks < 3; dbx++) {
      for (var dby = Math.max(0, ty - 4); dby <= Math.min(this.H - 1, ty + 4); dby++) {
        if (this.tiles[this.idx(dbx, dby)] === T.DUNGEONBRICK) { dBricks++; if (dBricks >= 3) break; }
      }
    }
    if (dBricks >= 3) return BIOME.DUNGEON;
  }
  if (this.aetherPos && ty >= this.aetherPos.y - 2 && ty <= this.aetherPos.y + 10 &&
      Math.abs(tx - this.aetherPos.x) <= 4) return BIOME.AETHER;
  if (ty >= this.hellY) return BIOME.UNDERWORLD;
  if (this.mushroomAt && this.mushroomAt[tx] === 1) return BIOME.MUSHROOM;
  if (ty > surf + 12) {
    if (this.underDesertCols && this.underDesertCols[tx] === 1) return BIOME.UNDERDESERT;
    if (this.underSnowCols && this.underSnowCols[tx] === 1) return BIOME.UNDERSNOW;
    if (this.spiderCols && this.spiderCols[tx] === 1) return BIOME.SPIDER;
    if (this.graniteCols && this.graniteCols[tx] === 1) return BIOME.GRANITE;
    if (this.marbleCols && this.marbleCols[tx] === 1) return BIOME.MARBLE;
  }
  // hardmode spread: corrupted/hallowed stone deep underground overrides the surface band
  if (ty > surf + 8) {
    var bxx0 = tx - 2 < 0 ? 0 : tx - 2, bxx1 = tx + 2 >= this.W ? this.W - 1 : tx + 2;
    var byy0 = ty - 2 < 0 ? 0 : ty - 2, byy1 = ty + 2 >= this.H ? this.H - 1 : ty + 2;
    for (var bxx = bxx0; bxx <= bxx1; bxx++) {
      for (var byy = byy0; byy <= byy1; byy++) {
        var bt2 = this.tiles[this.idx(bxx, byy)];
        if (bt2 === T.EBONSTONE) return BIOME.CORRUPT;
        if (bt2 === T.CRIMSTONE) return BIOME.CRIMSON;
        if (bt2 === T.PEARLSTONE) return BIOME.HALLOW;
      }
    }
  }
  if (py < surf * TILE - 28 * TILE) return BIOME.SKY;
  var f = px / (this.W * TILE);
  if (this._bands) {
    var fm = this.jungleLeft ? f : 1 - f;
    for (var bi = 0; bi < this._bands.length; bi++) {
      var bd = this._bands[bi];
      if (fm >= bd[0] && fm < bd[1]) return bd[2] === BIOME.DUNGEON ? BIOME.FOREST : bd[2];
    }
    return BIOME.FOREST;
  }
  // legacy band layout for worlds generated before the vanilla layout
  if (f < 0.09 || f > 0.94) return BIOME.OCEAN;
  if (f < 0.30) return this.evil === 'crimson' ? BIOME.CRIMSON : BIOME.CORRUPT;
  if (f < 0.40) return BIOME.FOREST;
  if (f < 0.50) return BIOME.SNOW;
  if (f < 0.56) return BIOME.DESERT;
  if (f < 0.72) return BIOME.FOREST;
  if (f < 0.78) return this.hardmode ? BIOME.HALLOW : BIOME.FOREST;
  if (f < 0.88) return BIOME.JUNGLE;
  return this.evil === 'crimson' ? BIOME.CRIMSON : BIOME.CORRUPT;
};

// ---------- Generation ----------
World.prototype.generate = function(hardmode, evil) {
  var W = this.W, H = this.H, rng = this.rng;
  var self = this;
  this.hardmode = !!hardmode;
  this.evil = evil === 'crimson' ? 'crimson' : (evil === 'corrupt' ? 'corrupt' : (rng() < 0.5 ? 'corrupt' : 'crimson'));
  var isCrimson = this.evil === 'crimson';
  var n1 = makeNoise1D(rng, 256);
  var n2 = makeNoise1D(rng, 256);
  var nCave = makeNoise2D(rng, 128, 128);

  // ---- Terrain: faithful port of vanilla TerrainPass ----
  // Surface wanders with feature segments (Plateau/Hill/Dale/Mountain/Valley),
  // rock line drifts below it, dirt above rock line / stone below (FillColumn).
  var Hf = H;
  var beachFrac = 0.08; // ocean exists within ~338 tiles of each edge
  this.beachL = Math.floor(W * beachFrac);
  this.beachR = W - Math.floor(W * beachFrac);
  var surface = Hf * 0.3 * ((rng() * 20 + 90) * 0.005); // Next(90,110)*0.005
  var rock = (surface + Hf * 0.2) * (0.9 + rng() * 0.2);
  var featLen = 0;
  var feature = 0; // 0 Plateau 1 Hill 2 Dale 3 Mountain 4 Valley
  var maxSurf = 0, maxRock = 0, minSurf = surface;
  var surfClampLo = Hf * 0.17, surfClampHi = Hf * 0.26;
  var beachClampHi = Hf * 0.23;
  for (x = 0; x < W; x++) {
    if (featLen <= 0) {
      feature = Math.floor(rng() * 5);
      featLen = 5 + Math.floor(rng() * 35);
      if (feature === 0) featLen *= Math.floor(5 + rng() * 30 * 0.2);
    }
    featLen--;
    if (x > W * 0.45 && x < W * 0.55 && (feature === 3 || feature === 4)) feature = Math.floor(rng() * 3);
    if (x > W * 0.48 && x < W * 0.52) feature = 0;
    // GenerateWorldSurfaceOffset
    var off = 0;
    if (feature === 0) { while (rng() * 7 < 1) off += Math.floor(rng() * 3) - 1; }
    else if (feature === 1) { while (rng() * 4 < 1) off--; while (rng() * 10 < 1) off++; }
    else if (feature === 2) { while (rng() * 4 < 1) off++; while (rng() * 10 < 1) off--; }
    else if (feature === 3) { while (rng() * 2 < 1) off--; while (rng() * 6 < 1) off++; }
    else { while (rng() * 2 < 1) off++; while (rng() * 5 < 1) off--; }
    surface += off;
    var onBeach = x < this.beachL || x > this.beachR;
    if (onBeach) surface = Math.max(Hf * 0.17, Math.min(beachClampHi, surface));
    else if (surface < surfClampLo) { surface = surfClampLo; featLen = 0; }
    else if (surface > surfClampHi) { surface = surfClampHi; featLen = 0; }
    if (rng() * 3 < 1) rock += Math.floor(rng() * 5) - 2;
    if (rock < surface + Hf * 0.06) rock++;
    if (rock > surface + Hf * 0.35) rock--;
    if (surface > maxSurf) maxSurf = surface;
    if (surface < minSurf) minSurf = surface;
    if (rock > maxRock) maxRock = rock;
    this.surfaceY[x] = Math.floor(surface);
    this.rockY[x] = Math.floor(rock);
  }
  // worldSurface (0 feet) = max surface + 25; rockLayer rounded up to multiple of 6
  this.worldSurfaceAvg = Math.floor(maxSurf + 25);
  var rl = maxRock;
  var num8 = Math.floor((rl - this.worldSurfaceAvg) / 6) * 6;
  this.rockLayer = this.worldSurfaceAvg + num8;
  this.waterLine = Math.floor((this.rockLayer + H) / 2) + Math.floor(rng() * 120) - 100;
  this.lavaLine = this.waterLine + 50 + Math.floor(rng() * 30);

  // Biome layout (vanilla rule: Snow+Dungeon on one side, Jungle+Desert on the
  // other, evil biome near the center on the snow/dungeon side, oceans at both ends)
  this.jungleLeft = rng() < 0.5;
  var EVILB = isCrimson ? BIOME.CRIMSON : BIOME.CORRUPT;
  this._bands = [
    [0.000, 0.080, BIOME.OCEAN],
    [0.080, 0.165, BIOME.DESERT],
    [0.165, 0.375, BIOME.JUNGLE],
    [0.375, 0.545, BIOME.FOREST],
    [0.545, 0.600, EVILB],
    [0.600, 0.695, BIOME.FOREST],
    [0.695, 0.815, BIOME.SNOW],
    [0.815, 0.895, BIOME.DUNGEON],
    [0.895, 0.920, BIOME.FOREST],
    [0.920, 1.001, BIOME.OCEAN],
  ];

  // Biome assignment by x (mirrored depending on which side the jungle rolled).
  // Uses the same pixel-center fraction as biomeAt so gen and runtime agree exactly.
  var self2 = this;
  function biomeAtX(x) {
    var f = (x * TILE + 8) / (W * TILE);
    if (!self2.jungleLeft) f = 1 - f;
    for (var bi = 0; bi < self2._bands.length; bi++) {
      if (f >= self2._bands[bi][0] && f < self2._bands[bi][1]) return self2._bands[bi][2];
    }
    return BIOME.FOREST;
  }

  // Scatter mushroom patches through the forest
  this.mushroomAt = new Uint8Array(W);
  for (var mx = Math.floor(W * 0.30); mx < Math.floor(W * 0.72); mx++) {
    if (rng() < 0.018) {
      var patch = 6 + Math.floor(rng() * 8);
      for (var p = 0; p < patch; p++) {
        if (mx + p < W) this.mushroomAt[mx + p] = 1;
      }
      mx += patch;
    }
  }

  // FillColumn: air above the surface line, dirt to the rock line, stone below
  var hellY = this.hellY;
  for (x = 0; x < W; x++) {
    var surf = this.surfaceY[x];
    var rock2 = this.rockY[x];
    for (var y = 0; y < H; y++) {
      var idx = this.idx(x, y);
      if (y >= hellY) { this.tiles[idx] = T.ASH; this.walls[idx] = WALL.STONE; continue; }
      if (y < surf) { this.tiles[idx] = T.AIR; this.walls[idx] = WALL.NONE; continue; }
      if (y < rock2) { this.tiles[idx] = T.DIRT; this.walls[idx] = WALL.DIRT; }
      else { this.tiles[idx] = T.STONE; this.walls[idx] = WALL.STONE; }
    }
  }

  // Biome surface conversion: grass/sand on the surface tile per band
  for (x = 0; x < W; x++) {
    var surfB = biomeAtX(x);
    var top = this.idx(x, this.surfaceY[x]);
    if (surfB === BIOME.CORRUPT) this.tiles[top] = T.CORRUPTGRASS;
    else if (surfB === BIOME.CRIMSON) this.tiles[top] = T.CRIMGRASS;
    else if (surfB === BIOME.JUNGLE) this.tiles[top] = T.JUNGLEGRASS;
    else if (surfB === BIOME.MUSHROOM) this.tiles[top] = T.MUSHROOM;
    else if (surfB === BIOME.SNOW) this.tiles[top] = T.SNOW;
    else if (surfB === BIOME.DESERT) this.tiles[top] = T.SAND;
    else if (surfB === BIOME.HALLOW) this.tiles[top] = T.HALLOWGRASS;
    else if (surfB !== BIOME.OCEAN) this.tiles[top] = T.GRASS;
    // dirt walls extend a little past the surface; stone wall deeper
    var wy = this.surfaceY[x] + 6;
    while (wy < this.rockY[x] + 8 && wy < H) { this.walls[this.idx(x, wy)] = WALL.DIRT; wy++; }
  }
  // Oceans: water over a sandy floor, sloping down at the map edges
  for (x = 0; x < W; x++) {
    if (biomeAtX(x) !== BIOME.OCEAN) continue;
    var distIn = x < this.beachL ? (this.beachL - x) : (x - this.beachR);
    var slope = Math.floor(distIn / 6);
    var oceanSurf = this.surfaceY[x] + 4 + slope;
    for (var oy2 = this.surfaceY[x]; oy2 < H; oy2++) {
      var oidx = this.idx(x, oy2);
      if (oy2 < oceanSurf) { this.tiles[oidx] = T.WATER; this.walls[oidx] = WALL.NONE; }
      else if (oy2 < oceanSurf + 12) { this.tiles[oidx] = T.SAND; this.walls[oidx] = WALL.DIRT; }
      else { this.tiles[oidx] = T.STONE; this.walls[oidx] = WALL.STONE; }
    }
  }

  // Convert deep stone in corrupt/hallow/crimson biomes
  for (x = 0; x < W; x++) {
    var b2 = biomeAtX(x);
    if (b2 === BIOME.CORRUPT || b2 === BIOME.HALLOW || b2 === BIOME.CRIMSON) {
      var s = this.surfaceY[x];
      var swap = b2 === BIOME.CORRUPT ? T.EBONSTONE : (b2 === BIOME.HALLOW ? T.PEARLSTONE : T.CRIMSTONE);
      for (var y = s; y < Math.min(H, hellY - 30); y++) {
        var i2 = this.idx(x, y);
        if (this.tiles[i2] === T.STONE) {
          this.tiles[i2] = swap;
        }
      }
    }
  }

  // Jungle: turn stone into mud in the upper caverns so chlorophyte has soil
  for (x = 0; x < W; x++) {
    if (biomeAtX(x) !== BIOME.JUNGLE) continue;
    var sj = this.surfaceY[x];
    for (var y = sj + 14; y < Math.min(H, hellY - 120); y++) {
      var i3 = this.idx(x, y);
      if (this.tiles[i3] === T.STONE) this.tiles[i3] = T.MUD;
    }
  }

  // Underground desert: deep sand below the desert surface
  this.underDesertCols = new Uint8Array(W);
  for (x = 0; x < W; x++) {
    if (biomeAtX(x) !== BIOME.DESERT) continue;
    if (this.mushroomAt[x] === 1) continue;
    var sd = this.surfaceY[x];
    var start = sd + 60 + Math.floor(rng() * 20);
    this.underDesertStart[x] = start;
    this.underDesertCols[x] = 1;
    var depth = 110 + Math.floor(rng() * 50);
    for (var y = start; y < Math.min(H - 1, start + depth); y++) {
      var iud = this.idx(x, y);
      if (this.tiles[iud] === T.STONE || this.tiles[iud] === T.DIRT || this.tiles[iud] === T.SAND) {
        this.tiles[iud] = T.SAND;
      }
    }
  }

  // Ice biome (vanilla trapezoid): dirt→snow, stone→ice within wandering edges,
  // from the world surface down past the cavern into a ragged bottom fringe
  var snowBand0 = null, snowBand1 = null;
  for (var sb = 0; sb < this._bands.length; sb++) {
    if (this._bands[sb][2] === BIOME.SNOW) { snowBand0 = this._bands[sb][0]; snowBand1 = this._bands[sb][1]; break; }
  }
  this.underSnowCols = new Uint8Array(W);
  if (snowBand0 !== null) {
    var snL0 = Math.floor(W * snowBand0), snR0 = Math.floor(W * snowBand1);
    if (!this.jungleLeft) { snL0 = W - snR0; snR0 = W - Math.floor(W * snowBand0); }
    var snL = snL0, snR = snR0, fringe = 20;
    var snBottom = this.lavaLine - 140;
    for (var sny = this.worldSurfaceAvg; sny < snBottom; sny++) {
      snL += rnd(9) - 4;
      snR += rnd(8) - 3;
      if (sny > this.worldSurfaceAvg) {
        snL = Math.floor((snL + this.underSnowMinX[sny - 1]) / 2);
        snR = Math.floor((snR + this.underSnowMaxX[sny - 1]) / 2);
      }
      if (this.jungleLeft) { if (Math.floor(rng() * 4) === 0) { snL++; snR++; } }
      else if (Math.floor(rng() * 4) === 0) { snL--; snR--; }
      this.underSnowMinX[sny] = snL; this.underSnowMaxX[sny] = snR;
      var toIce = sny >= this.worldSurfaceAvg + 40; // snow near the top, ice below
      for (var snx = Math.max(1, snL); snx < Math.min(W - 1, snR); snx++) {
        var snt = self.tiles[self.idx(snx, sny)];
        if (toIce) {
          if (snt === T.STONE) self.tiles[self.idx(snx, sny)] = T.ICE;
          else if (snt === T.DIRT || snt === T.GRASS) self.tiles[self.idx(snx, sny)] = T.SNOW;
        } else if (snt === T.DIRT || snt === T.STONE || snt === T.GRASS) {
          self.tiles[self.idx(snx, sny)] = T.SNOW;
        }
        if (sny >= this.surfaceY[snx]) this.underSnowCols[snx] = 1;
      }
    }
    // ragged ice fringe below the main trapezoid
    for (sny = snBottom; sny < this.lavaLine - 20 && sny < H - 2; sny++) {
      fringe += rnd(7) - 3;
      if (fringe < 0) fringe = rnd(3);
      else if (fringe > 50) fringe = 50 - rnd(3);
      for (snx = Math.max(1, snL); snx < Math.min(W - 1, snR); snx++) {
        for (var fy2 = sny; fy2 < Math.min(H - 1, sny + fringe); fy2++) {
          var fnt = self.tiles[self.idx(snx, fy2)];
          if (fnt === T.STONE) self.tiles[self.idx(snx, fy2)] = T.ICE;
          else if (fnt === T.DIRT) self.tiles[self.idx(snx, fy2)] = T.SNOW;
        }
        if (sny >= this.surfaceY[snx]) this.underSnowCols[snx] = 1;
      }
    }
  }

  // ================================================================
  // Vanilla generation passes — faithful ports of decompiled
  // Terraria 1.4.0.5 WorldGen.cs / TerrainPass.cs (exact counts/sizes)
  // ================================================================

  // TileRunner: diamond carve (Manhattan < strength*0.5*jitter), radius
  // shrinks linearly from `strength` to 0 over `steps`, velocity-wandered.
  // type: 'air' (clear, sand immune) | 'liquid' (clear + water/lava by line)
  //     | 'ash' (place ash over anything) | tile id (replace dirt/stone/clay)
  function tileRunnerV(tx0, ty0, strength, steps, type, opts) {
    opts = opts || {};
    var px = tx0, py = ty0;
    var vx = opts.speedX !== undefined ? opts.speedX : (rng() * 21 - 10) * 0.1;
    var vy = opts.speedY !== undefined ? opts.speedY : (rng() * 21 - 10) * 0.1;
    var step = steps;
    while (strength > 0 && step > 0) {
      var rad = strength * (step / steps);
      step--;
      var half = strength * 0.5 * (1 + (rng() * 21 - 10) * 0.015);
      var bx0 = Math.max(1, Math.floor(px - rad * 0.5));
      var bx1 = Math.min(W - 1, Math.ceil(px + rad * 0.5));
      var by0 = Math.max(1, Math.floor(py - rad * 0.5));
      var by1 = Math.min(H - 1, Math.ceil(py + rad * 0.5));
      for (var by = by0; by < by1; by++) {
        for (var bx = bx0; bx < bx1; bx++) {
          var mdx = bx - px, mdy = by - py;
          if (mdx + mdy < 0) { mdx = -mdx; mdy = -mdy; }
          if (mdx + mdy >= half) continue;
          var ii = self.idx(bx, by);
          var t = self.tiles[ii];
          if (type === 'air') {
            if (t === T.AIR || t === T.SAND || t === T.ASH) continue;
            self.tiles[ii] = T.AIR;
            continue;
          }
          if (type === 'liquid') {
            if (t === T.AIR) continue;
            if (by < self.waterLine) self.tiles[ii] = T.WATER;
            else if (by > self.lavaLine) self.tiles[ii] = T.LAVA;
            else self.tiles[ii] = T.AIR;
            continue;
          }
          if (type === 'ash') { self.tiles[ii] = T.ASH; continue; }
          if (opts.onlyAir) { if (t === T.AIR) self.tiles[ii] = type; continue; }
          if (t === T.DIRT || t === T.STONE || t === T.CLAY) self.tiles[ii] = type;
        }
      }
      px += vx; py += vy;
      vx = Math.max(-1, Math.min(1, vx + (rng() * 21 - 10) * 0.05));
      if (!opts.noYChange) vy = Math.max(-1, Math.min(1, vy + (rng() * 21 - 10) * 0.05));
    }
  }

  // digTunnel: diamond carve radius `size` wandering ±1.5 (clamped 0.6..2x),
  // movement (dir + wander)*0.6 per step. Returns the end position.
  function digTunnel(tx0, ty0, xDir, yDir, stepsN, size, wet) {
    var px = tx0, py = ty0;
    var wx = 0, wy = 0;
    var num4 = size;
    px = Math.max(size + 1, Math.min(W - size - 1, px));
    py = Math.max(size + 1, Math.min(H - size - 1, py));
    for (var s = 0; s < stepsN; s++) {
      var half = num4 * (1 + (rng() * 21 - 10) * 0.005);
      for (var by = Math.floor(py - num4); by <= py + num4; by++) {
        for (var bx = Math.floor(px - num4); bx <= px + num4; bx++) {
          if (bx < 1 || bx >= W - 1 || by < 1 || by >= H - 1) continue;
          var mdx = bx - px, mdy = by - py;
          if (mdx + mdy < 0) { mdx = -mdx; mdy = -mdy; }
          if (mdx + mdy >= half) continue;
          var ii = self.idx(bx, by);
          self.tiles[ii] = T.AIR;
          if (wet) self.tiles[ii] = T.WATER;
        }
      }
      num4 += (rng() * 101 - 50) * 0.03;
      if (num4 < size * 0.6) num4 = size * 0.6;
      if (num4 > size * 2) num4 = size * 2;
      wx = Math.max(-1, Math.min(1, wx + (rng() * 41 - 20) * 0.01));
      wy = Math.max(-1, Math.min(1, wy + (rng() * 41 - 20) * 0.01));
      px += (xDir + wx) * 0.6;
      py += (yDir + wy) * 0.6;
    }
    return [px, py];
  }

  // Caverer: vanilla big-cave systems in the cavern layer
  function caverer(cx, cy) {
    if (Math.floor(rng() * 2) === 0) {
      var segs = 7 + Math.floor(rng() * 3);
      var xDir = rng(), yDir = 1 - xDir;
      if (Math.floor(rng() * 2) === 0) xDir = -xDir;
      if (Math.floor(rng() * 2) === 0) yDir = -yDir;
      var pos = [cx, cy];
      for (var i = 0; i < segs; i++) {
        pos = digTunnel(pos[0], pos[1], xDir, yDir, 6 + Math.floor(rng() * 14), 4 + Math.floor(rng() * 6));
        xDir = Math.max(-1.5, Math.min(1.5, xDir + (rng() * 41 - 20) * 0.1));
        yDir = Math.max(-1.5, Math.min(1.5, yDir + (rng() * 41 - 20) * 0.1));
        var xDir2 = rng(), yDir2 = 1 - xDir2;
        if (Math.floor(rng() * 2) === 0) xDir2 = -xDir2;
        if (Math.floor(rng() * 2) === 0) yDir2 = -yDir2;
        var pos2 = digTunnel(pos[0], pos[1], xDir2, yDir2, 30 + Math.floor(rng() * 20), 3 + Math.floor(rng() * 4));
        tileRunnerV(Math.floor(pos2[0]), Math.floor(pos2[1]), 10 + rng() * 10, 5 + Math.floor(rng() * 6), 'air');
      }
    } else {
      var segs2 = 15 + Math.floor(rng() * 15);
      var xd = rng(), yd = 1 - xd;
      if (Math.floor(rng() * 2) === 0) xd = -xd;
      if (Math.floor(rng() * 2) === 0) yd = -yd;
      var pos3 = [cx, cy];
      for (var j = 0; j < segs2; j++) {
        pos3 = digTunnel(pos3[0], pos3[1], xd, yd, 5 + Math.floor(rng() * 10), 2 + Math.floor(rng() * 4), true);
        xd = Math.max(-1.5, Math.min(1.5, xd + (rng() * 41 - 20) * 0.1));
        yd = Math.max(-1.5, Math.min(1.5, yd + (rng() * 41 - 20) * 0.1));
      }
    }
  }
  function rnd(n) { return Math.floor(rng() * n); }

  var area = W * H;
  var surfLow = Math.max(1, minSurf - 1), surfHigh = Math.min(H - 2, maxSurf + 1);
  var rockLow = Math.min(H - 2, minSurf + Math.floor(H * 0.06) + 2), rockHigh = Math.min(H - 2, maxRock + 1);

  // --- Rocks In Dirt (3 sub-passes, exact vanilla counts) ---
  for (var rd = 0; rd < area * 1.5e-04; rd++) tileRunnerV(rnd(W), rnd(surfLow + 1), 4 + rnd(11), 5 + rnd(35), T.STONE);
  for (rd = 0; rd < area * 2e-04; rd++) tileRunnerV(rnd(W), surfLow + rnd(surfHigh - surfLow + 1), 4 + rnd(6), 5 + rnd(25), T.STONE);
  for (rd = 0; rd < area * 4.5e-03; rd++) tileRunnerV(rnd(W), surfHigh + rnd(rockHigh - surfHigh + 1), 2 + rnd(5), 2 + rnd(21), T.STONE);
  // --- Dirt In Rocks ---
  for (var dr = 0; dr < area * 5e-03; dr++) tileRunnerV(rnd(W), rockLow + rnd(H - rockLow), 2 + rnd(4), 2 + rnd(38), T.DIRT);
  // --- Clay (3 sub-passes) ---
  for (var cl = 0; cl < area * 2e-05; cl++) tileRunnerV(rnd(W), rnd(surfLow), 4 + rnd(10), 10 + rnd(40), T.CLAY);
  for (cl = 0; cl < area * 5e-05; cl++) tileRunnerV(rnd(W), surfLow + rnd(surfHigh - surfLow + 1), 8 + rnd(6), 15 + rnd(30), T.CLAY);
  for (cl = 0; cl < area * 2e-05; cl++) tileRunnerV(rnd(W), surfHigh + rnd(rockHigh - surfHigh + 1), 8 + rnd(7), 5 + rnd(45), T.CLAY);
  // clay never sits exposed as the surface tile
  for (var cx9 = 5; cx9 < W - 5; cx9++) {
    var cy9 = 1;
    while (cy9 < this.worldSurfaceAvg - 1 && self.tiles[self.idx(cx9, cy9)] === T.AIR) cy9++;
    for (var cz = cy9; cz < cy9 + 5; cz++) if (self.tiles[self.idx(cx9, cz)] === T.CLAY) self.tiles[self.idx(cx9, cz)] = T.DIRT;
  }

  // --- Small Holes: 0.0015 x area iterations, two runners each ---
  for (var sh = 0; sh < area * 0.0015; sh++) {
    var type2 = (Math.floor(rng() * 5) === 0) ? 'liquid' : 'air';
    var sx3 = rnd(W);
    var sy3 = surfHigh + rnd(Math.max(2, H - surfHigh));
    if (sx3 > this.beachL && sx3 < this.beachR || sy3 >= surfHigh) {
      tileRunnerV(sx3, sy3, 2 + rnd(3), 2 + rnd(18), type2);
      tileRunnerV(rnd(W), surfHigh + rnd(Math.max(2, H - surfHigh)), 8 + rnd(7), 7 + rnd(23), type2);
    }
  }
  // --- Dirt Layer Caves: long winding tunnels through the dirt ---
  for (var dc = 0; dc < area * 3e-05; dc++) {
    tileRunnerV(rnd(W), surfLow + rnd(Math.max(2, rockHigh - surfLow)), 5 + rnd(10), 30 + rnd(170), (Math.floor(rng() * 6) === 0) ? 'liquid' : 'air');
  }
  // --- Rock Layer Caves: the big cavern-layer systems ---
  for (var rc = 0; rc < area * 1.3e-04; rc++) {
    tileRunnerV(rnd(W), rockHigh + rnd(Math.max(2, H - rockHigh)), 6 + rnd(14), 50 + rnd(250), (Math.floor(rng() * 10) === 0) ? 'liquid' : 'air');
  }
  // --- Surface Caves: entrances winding down from the surface ---
  for (var sc2 = 0; sc2 < W * 0.002; sc2++) {
    var scx = rnd(W);
    while ((scx > W * 0.45 && scx < W * 0.55) || scx < this.beachL + 20 || scx > this.beachR - 20) scx = rnd(W);
    for (var scy = 1; scy < surfHigh; scy++) {
      if (self.tiles[self.idx(scx, scy)] !== T.AIR) {
        tileRunnerV(scx, scy, 3 + rnd(3), 5 + rnd(45), 'air', { speedX: (rng() * 21 - 10) * 0.1, speedY: 1 });
        break;
      }
    }
  }
  for (sc2 = 0; sc2 < W * 0.0007; sc2++) {
    scx = rnd(W);
    while ((scx > W * 0.43 && scx < W * 0.57) || scx < this.beachL + 20 || scx > this.beachR - 20) scx = rnd(W);
    for (scy = 1; scy < surfHigh; scy++) {
      if (self.tiles[self.idx(scx, scy)] !== T.AIR) {
        tileRunnerV(scx, scy, 10 + rnd(5), 50 + rnd(80), 'air', { speedX: (rng() * 21 - 10) * 0.1, speedY: 2 });
        break;
      }
    }
  }
  for (sc2 = 0; sc2 < Math.max(1, Math.floor(W * 0.0003)); sc2++) {
    scx = rnd(W);
    while ((scx > W * 0.4 && scx < W * 0.6) || scx < this.beachL + 20 || scx > this.beachR - 20) scx = rnd(W);
    for (scy = 1; scy < surfHigh; scy++) {
      if (self.tiles[self.idx(scx, scy)] !== T.AIR) {
        tileRunnerV(scx, scy, 12 + rnd(13), 150 + rnd(350), 'air', { speedX: (rng() * 21 - 10) * 0.1, speedY: 4 });
        tileRunnerV(scx, scy, 8 + rnd(9), 60 + rnd(140), 'air', { speedX: (rng() * 21 - 10) * 0.1, speedY: 2 });
        tileRunnerV(scx, scy, 5 + rnd(8), 40 + rnd(130), 'air', { speedX: (rng() * 21 - 10) * 0.1, speedY: 2 });
        break;
      }
    }
  }
  for (sc2 = 0; sc2 < W * 0.0004; sc2++) {
    scx = rnd(W);
    while ((scx > W * 0.4 && scx < W * 0.6) || scx < this.beachL + 20 || scx > this.beachR - 20) scx = rnd(W);
    for (scy = 1; scy < surfHigh; scy++) {
      if (self.tiles[self.idx(scx, scy)] !== T.AIR) {
        tileRunnerV(scx, scy, 7 + rnd(5), 150 + rnd(100), 'air', { speedY: 1, noYChange: true });
        break;
      }
    }
  }
  // 5 large cavern systems (Caverer)
  for (var cv2 = 0; cv2 < 5; cv2++) {
    caverer(this.beachL + rnd(Math.max(2, this.beachR - this.beachL)), this.rockLayer + rnd(Math.max(2, H - 400 - this.rockLayer)));
  }

  // --- Shinies: exact vanilla ore vein counts/bands/sizes ---
  function shinyBand(tile, count, y0, y1, str0, strN, stp0, stpN) {
    for (var i = 0; i < count; i++) tileRunnerV(rnd(W), y0 + rnd(Math.max(2, y1 - y0)), str0 + rnd(strN), stp0 + rnd(stpN), tile);
  }
  shinyBand(T.COPPER, Math.floor(area * 6e-05), surfLow, surfHigh, 3, 3, 2, 4);
  shinyBand(T.COPPER, Math.floor(area * 8e-05), surfHigh, rockHigh, 3, 4, 3, 4);
  shinyBand(T.COPPER, Math.floor(area * 2e-04), rockLow, H, 4, 5, 4, 4);
  shinyBand(T.IRON, Math.floor(area * 3e-05), surfLow, surfHigh, 3, 4, 2, 3);
  shinyBand(T.IRON, Math.floor(area * 8e-05), surfHigh, rockHigh, 3, 3, 3, 3);
  shinyBand(T.IRON, Math.floor(area * 2e-04), rockLow, H, 4, 5, 4, 4);
  shinyBand(T.SILVER, Math.floor(area * 2.6e-05), surfHigh, rockHigh, 3, 3, 3, 3);
  shinyBand(T.SILVER, Math.floor(area * 1.5e-04), rockLow, H, 4, 5, 4, 4);
  shinyBand(T.SILVER, Math.floor(area * 1.7e-04), 1, surfLow, 4, 5, 4, 4);
  shinyBand(T.GOLD, Math.floor(area * 1.2e-04), rockLow, H, 4, 4, 4, 4);
  shinyBand(T.GOLD, Math.floor(area * 1.2e-04), 1, surfLow - 20, 4, 4, 4, 4);
  shinyBand(T.TIN, Math.floor(area * 1.2e-05), surfLow, surfHigh, 3, 3, 2, 4);
  shinyBand(T.TIN, Math.floor(area * 1.6e-05), surfHigh, rockHigh, 3, 4, 3, 4);
  shinyBand(T.TIN, Math.floor(area * 4e-05), rockLow, H, 4, 5, 4, 4);
  shinyBand(T.TUNGSTEN, Math.floor(area * 1e-05), surfHigh, rockHigh, 3, 3, 3, 3);
  shinyBand(T.TUNGSTEN, Math.floor(area * 6e-05), rockLow, H, 4, 5, 4, 4);
  shinyBand(T.LEAD, Math.floor(area * 8e-06), surfLow, surfHigh, 3, 3, 2, 3);
  shinyBand(T.LEAD, Math.floor(area * 2e-05), rockLow, H, 4, 5, 4, 4);
  shinyBand(T.PLATINUM, Math.floor(area * 4e-06), surfHigh, rockHigh, 3, 3, 3, 3);
  shinyBand(T.PLATINUM, Math.floor(area * 2e-05), rockLow, H, 4, 5, 4, 4);
  // Demonite/Crimtane: scattered through the cavern layer (vanilla Shinies)
  var eTile = isCrimson ? T.CRIMTANE : T.DEMONITE;
  shinyBand(eTile, Math.floor(area * 2.25e-05), this.rockLayer, H, 3, 3, 4, 4);

  // --- Webs: clusters anchored to cave walls ---
  for (var wb = 0; wb < area * 6e-04; wb++) {
    var wbx = 20 + rnd(W - 40);
    var wby = surfHigh + rnd(Math.max(2, H - 20 - surfHigh));
    if (self.tiles[self.idx(wbx, wby)] !== T.AIR) continue;
    while (self.tiles[self.idx(wbx, wby)] === T.AIR && wby > surfLow) wby++;
    wby++;
    var wdir = Math.floor(rng() * 2) === 0 ? 1 : -1;
    while (self.tiles[self.idx(wbx, wby)] === T.AIR && wbx > 10 && wbx < W - 10) wbx += wdir;
    var wxx = wbx - wdir;
    if (wby > this.worldSurfaceAvg || self.walls[self.idx(wxx, wby)] > 0) {
      tileRunnerV(wxx, wby, 4 + rng() * 7, 2 + rnd(2), T.COBWEB, { speedX: wdir, speedY: -1, onlyAir: true });
    }
  }

  // --- Underworld (vanilla): wandering ash ceiling, open cavern, lava sea,
  // ash pillars; keep our ruined houses/shadow chests after this block ---
  var ashTop = H - (150 + rnd(40));
  for (x = 0; x < W; x++) {
    ashTop += rnd(7) - 3;
    if (ashTop < H - 190) ashTop = H - 190;
    if (ashTop > H - 160) ashTop = H - 160;
    for (var uy = Math.max(1, ashTop - 20 - rnd(3)); uy < H; uy++) {
      var ui = self.idx(x, uy);
      if (uy >= ashTop) { self.tiles[ui] = T.AIR; self.walls[ui] = WALL.NONE; }
      else { self.tiles[ui] = T.ASH; self.walls[ui] = WALL.STONE; }
    }
  }
  var lavaTop = H - (40 + rnd(30));
  for (x = 10; x < W - 10; x++) {
    lavaTop += rnd(21) - 10;
    if (lavaTop > H - 60) lavaTop = H - 60;
    if (lavaTop < H - 100) lavaTop = H - 120;
    for (uy = lavaTop; uy < H - 10; uy++) {
      if (self.tiles[self.idx(x, uy)] === T.AIR) self.tiles[self.idx(x, uy)] = T.LAVA;
    }
  }
  // Ash towers + side veins + lava pockets (vanilla per-column pass, 1/13)
  for (x = 0; x < W; x++) {
    if (Math.floor(rng() * 13) !== 0) continue;
    // find the lava/air surface above the lava sea
    var tvx = H - 65;
    while (tvx > H - 140 && (self.tiles[self.idx(x, tvx)] !== T.AIR)) tvx--;
    var towerTop = tvx - 2 - rnd(3);
    // central vertical tower of ash
    tileRunnerV(x, towerTop, 5 + rnd(25), 1000, 'ash', { speedY: 1 + rnd(2), noYChange: true });
    // horizontal ash veins off the tower
    var scale2 = 1 + rnd(2);
    if (Math.floor(rng() * 3) === 0) scale2 *= 0.5;
    if (Math.floor(rng() * 2) === 0) {
      tileRunnerV(x, towerTop, (5 + rnd(10)) * scale2, Math.floor((10 + rnd(5)) * scale2), 'ash', { speedX: 1, speedY: 0.3 });
    }
    if (Math.floor(rng() * 2) === 0) {
      var scale3 = 1 + rnd(2);
      tileRunnerV(x, towerTop, (5 + rnd(10)) * scale3, Math.floor((10 + rnd(5)) * scale3), 'ash', { speedX: -1, speedY: 0.3 });
    }
    // lava pockets hidden inside the ash
    tileRunnerV(x + rnd(21) - 10, tvx + rnd(21) - 10, 5 + rnd(10), 5 + rnd(5), 'liquid', { speedX: rnd(4) - 1, speedY: rnd(4) - 1 });
    if (Math.floor(rng() * 3) === 0) tileRunnerV(x + rnd(21) - 10, tvx + rnd(21) - 10, 10 + rnd(20), 10 + rnd(10), 'liquid', { speedX: rnd(4) - 1, speedY: rnd(4) - 1 });
    if (Math.floor(rng() * 5) === 0) tileRunnerV(x + rnd(31) - 15, tvx + rnd(26) - 15, 15 + rnd(15), 5 + rnd(15), 'liquid', { speedX: rnd(4) - 1, speedY: rnd(4) - 1 });
  }
  // scattered lava pockets through the bottom region (every column, vanilla)
  for (x = 0; x < W; x++) {
    tileRunnerV(20 + rnd(W - 40), H - 180 + rnd(170), 2 + rnd(5), 2 + rnd(5), 'liquid');
  }
  // flat lava level rows (vanilla enforces two rows at H-145/H-144)
  for (x = 0; x < W; x++) {
    for (var lr2 = H - 145; lr2 <= H - 144; lr2++) {
      if (self.tiles[self.idx(x, lr2)] === T.AIR) self.tiles[self.idx(x, lr2)] = T.LAVA;
    }
  }
  // hellstone veins threading the ash and lower stone
  for (var hs = 0; hs < area * 2e-05; hs++) {
    var hsx = rnd(W), hsy = H - 190 + rnd(160);
    tileRunnerV(hsx, hsy, 3 + rnd(4), 3 + rnd(4), T.HELLSTONE);
  }
  // furnished Underworld houses with Hellforges and locked Shadow Chests
  var hellY2 = self.hellY;
    // heart crystals: ~30 per world on cave floors (vanilla Life Crystal generation)
  var hcSpots = [];
  for (var hcx = 20; hcx < self.W - 20; hcx += 3) {
    var hcTop = self.surfaceY[hcx] + 10;
    for (var hcy = hcTop; hcy < self.hellY - 5 && hcy < self.H - 3; hcy++) {
      if (self.get(hcx, hcy) === T.AIR && self.get(hcx, hcy - 1) === T.AIR && self.isSolid(hcx, hcy + 1)) hcSpots.push([hcx, hcy]);
    }
  }
  for (var hcp = hcSpots.length - 1; hcp > 0; hcp--) {
    var hs = Math.floor(rng() * (hcp + 1));
    var hs2 = hcSpots[hcp]; hcSpots[hcp] = hcSpots[hs]; hcSpots[hs] = hs2;
  }
  for (var hc2 = 0; hc2 < Math.min(30, hcSpots.length); hc2++) {
    self.set(hcSpots[hc2][0], hcSpots[hc2][1], T.HEARTCRYSTAL);
  }
self.underworldHouses = [];
  var shadowLoot = [I.SUNFURY, I.FLAMELASH, I.HELLWINGBOW, I.DARKLANCE];
  // --- HellFort (vanilla): terraced hellbrick towers straddling the lava
  // surface — 5 x-bands x 10 y-segments grid, ruined cells skipped ---
  function hellFort(fx, fy) {
    var minW = 8, maxW = 20;
    var xL = [0, 0, 0, 0, 0], xR = [0, 0, 0, 0, 0];
    xL[2] = fx - (Math.floor(minW / 2) + rnd(Math.max(1, maxW / 2 - minW / 2)));
    xR[2] = fx + (Math.floor(minW / 2) + rnd(Math.max(1, maxW / 2 - minW / 2)));
    xL[3] = xR[2]; xR[3] = xL[3] + minW + rnd(maxW - minW);
    xL[4] = xR[3]; xR[4] = xL[4] + minW + rnd(maxW - minW);
    xR[1] = xL[2]; xL[1] = xR[1] - minW - rnd(maxW - minW);
    xR[0] = xL[1]; xL[0] = xR[0] - minW - rnd(maxW - minW);
    var yT = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], yB = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    yT[3] = fy - (6 + rnd(6)); yB[3] = fy;
    for (var ys = 4; ys < 10; ys++) { yT[ys] = yB[ys - 1]; yB[ys] = yT[ys] + 6 + rnd(6); }
    for (ys = 2; ys >= 0; ys--) { yB[ys] = yT[ys + 1]; yT[ys] = yB[ys] - 6 - rnd(6); }
    // which grid cells get built (ruined: random runs skipped)
    var build = [];
    for (var b2 = 0; b2 < 5; b2++) { build.push([false, false, false, false, false, false, false, false, false, false]); }
    var lo = 3, hi = 3;
    for (var at2 = 0; at2 < 2; at2++) {
      if (Math.floor(rng() * 3) !== 0) continue;
      var col = rng() < 0.5 ? 0 : 1;
      if (col === 0) { lo = Math.min(lo, 0); } else { hi = Math.max(hi, 4); }
      var row = rnd(10);
      lo = Math.min(lo, row); hi = Math.max(hi, row);
      var side = col; // 0/1 above-left run, 3/4 below-right run
      var step2 = rng() < 0.5 ? -1 : 1;
      for (var r2 = rnd(10); r2 >= 0 && r2 < 10; r2 += step2) build[col === 0 ? (step2 < 0 ? 0 : 1) : (step2 < 0 ? 3 : 4)][r2] = true;
      if (rng() < 0.5) build[col === 0 ? 1 : 3][row] = true;
    }
    var crow = rnd(10); lo = Math.min(lo, crow); hi = Math.max(hi, crow);
    while (hi - lo < 5) {
      crow = rnd(10); lo = Math.min(lo, crow); hi = Math.max(hi, crow);
    }
    for (var r3 = lo; r3 <= hi; r3++) build[2][r3] = true;
    // never build outside the underworld or overlapping existing structures
    for (b2 = 0; b2 < 5; b2++) {
      var bad = xL[b2] < 10 || xR[b2] > W - 10;
      for (var yy3 = Math.max(0, hellY2); yy3 < H && !bad; yy3++) {
        if (self.walls[self.idx(xL[b2], yy3)] > 0 && self.tiles[self.idx(xL[b2], yy3)] !== T.AIR) bad = false; // walls alone ok
      }
      for (r3 = 0; r3 < 10; r3++) {
        if (build[b2][r3] && (yT[r3] < hellY2 || yB[r3] > H - 20)) build[b2][r3] = false;
      }
      if (bad) for (r3 = 0; r3 < 10; r3++) build[b2][r3] = false;
    }
    if (lo > hi) return;
    // build flagged cells: hellbrick shell + hollow interior with hell walls
    var roomsBuilt = [];
    for (b2 = 0; b2 < 5; b2++) {
      for (r3 = 0; r3 < 10; r3++) {
        if (!build[b2][r3]) continue;
        for (var yy4 = yT[r3]; yy4 <= yB[r3]; yy4++) {
          for (var xx4 = xL[b2]; xx4 <= xR[b2]; xx4++) {
            if (xx4 < 10 || xx4 > W - 10 || yy4 < 1 || yy4 >= H - 1) continue;
            var ii3 = self.idx(xx4, yy4);
            self.tiles[ii3] = T.LAVA; // clear liquid first
            if (xx4 === xL[b2] || xx4 === xR[b2] || yy4 === yT[r3] || yy4 === yB[r3]) {
              self.tiles[ii3] = T.HELLBRICK;
              self.walls[ii3] = WALL.STONE;
            } else {
              self.tiles[ii3] = T.AIR;
              self.walls[ii3] = WALL.CAVE;
            }
          }
        }
        roomsBuilt.push({ x0: xL[b2], x1: xR[b2], y0: yT[r3], y1: yB[r3] });
      }
    }
    // doors between adjacent bands + platforms + furnishings
    for (b2 = 0; b2 < 4; b2++) {
      for (r3 = 0; r3 < 10; r3++) {
        if (build[b2][r3] && build[b2 + 1][r3]) {
          var dx2 = xR[b2];
          for (var dy4 = yB[r3] - 1; dy4 >= yB[r3] - 3; dy4--) {
            if (self.inBounds(dx2, dy4)) self.tiles[self.idx(dx2, dy4)] = T.AIR;
          }
          if (self.inBounds(dx2, yB[r3] - 1)) self.tiles[self.idx(dx2, yB[r3] - 1)] = T.DOOR;
        }
      }
    }
    for (var rr = 0; rr < roomsBuilt.length; rr++) {
      var rm = roomsBuilt[rr];
      if (rm.x1 - rm.x0 < 4) continue;
      // torch
      self.tiles[self.idx(rm.x0 + 2, rm.y1 - 1)] = T.AIR;
      if (self.get(rm.x0 + 2, rm.y1 - 2) === T.AIR && self.tiles[self.idx(rm.x0 + 2, rm.y1)] === T.HELLBRICK) {
        self.set(rm.x0 + 2, rm.y1 - 2, T.TORCH);
      }
      // platform ledges
      if (rng() < 0.5 && rm.x1 - rm.x0 > 6) {
        var plx = rm.x0 + 2 + rnd(Math.max(1, rm.x1 - rm.x0 - 4));
        var plw = 2 + rnd(3);
        for (var p2 = plx; p2 <= Math.min(rm.x1 - 1, plx + plw); p2++) {
          self.tiles[self.idx(p2, rm.y0 + 2)] = T.PLATFORM;
          self.walls[self.idx(p2, rm.y0 + 2)] = WALL.CAVE;
        }
      }
      // shadow chest on a floor
      if (rng() < 0.3) {
        var scx2 = rm.x0 + 2 + rnd(Math.max(1, rm.x1 - rm.x0 - 3));
        var scy2 = rm.y1 - 1;
        if (self.get(scx2, scy2) === T.AIR) {
          self.set(scx2, scy2, T.SHADOWCHEST);
          self.chests.push({
            x: scx2, y: scy2, kind: 'shadow', locked: true, key: I.SHADOWKEY,
            inv: [
              { id: shadowLoot[rnd(shadowLoot.length)], count: 1 },
              { id: I.HELLSTONEBAR, count: 2 + rnd(4) },
              { id: I.OBSIDIANSKINPOTION, count: 1 }
            ]
          });
        }
      }
      // hellforge in one room
      if (rng() < 0.2) {
        var hfx = rm.x0 + 2 + rnd(Math.max(1, rm.x1 - rm.x0 - 3));
        if (self.get(hfx, rm.y1 - 1) === T.AIR) self.set(hfx, rm.y1 - 1, T.HELLFORGE);
      }
    }
    self.underworldHouses.push({ x: xL[0], y: yT[lo], w: xR[4] - xL[0], h: yB[hi] - yT[lo] });
  }
  // AddHellHouses: forts along the lava surface, middle half of the world
  var fi = Math.floor(W * 0.25);
  while (fi < W * 0.75) {
    var fj = H - 40;
    while (fj > hellY2 && (self.tiles[self.idx(fi, fj)] !== T.AIR || self.tiles[self.idx(fi, fj)] === T.LAVA)) fj--;
    if (self.tiles[self.idx(fi, fj + 1)] !== T.AIR && self.tiles[self.idx(fi, fj + 1)] !== T.LAVA) {
      hellFort(fi, fj);
      fi += 30 + rnd(100);
      if (Math.floor(rng() * 10) === 0) fi += rnd(200);
    } else {
      fi += 10;
    }
  }
  // shadow chests embedded around the underworld (vanilla AddHellHouses sweep)
  for (var sct = 0; sct < 400; sct++) {
    var scx3 = Math.floor(W * 0.25) + rnd(Math.floor(W * 0.5));
    var scy3 = H - 250 + rnd(230);
    if (!self.inBounds(scx3, scy3)) continue;
    if (self.get(scx3, scy3) === T.AIR && self.isSolid(scx3, scy3 + 1) && self.get(scx3, scy3 - 1) === T.AIR) {
      var nearBrick = false;
      for (var nb = -3; nb <= 3 && !nearBrick; nb++) {
        for (var nb2 = -3; nb2 <= 3; nb2++) {
          if (self.get(scx3 + nb, scy3 + nb2) === T.HELLBRICK) { nearBrick = true; break; }
        }
      }
      if (nearBrick) {
        self.set(scx3, scy3, T.SHADOWCHEST);
        self.chests.push({
          x: scx3, y: scy3, kind: 'shadow', locked: true, key: I.SHADOWKEY,
          inv: [
            { id: shadowLoot[rnd(shadowLoot.length)], count: 1 },
            { id: I.HELLSTONEBAR, count: 2 + rnd(4) }
          ]
        });
      }
    }
  }

  // --- Floating Islands (vanilla CloudIsland/IslandHouse geometry):
  // 100-140 tile cloud discs with dirt tops, ponds, brick house, sky chest,
  // and small sky-blobs floating above; ~W*0.0008 islands per world ---
  self.skyIslands = [];
  var islandCount = Math.max(3, Math.round(W * 0.0008));
  var islandHouseX = [];
  function skyEll(cx2, cy2, rx, ry2, tile, onlyBelow) {
    for (var ey = Math.max(0, Math.floor(cy2 - ry2)); ey <= Math.min(H - 1, Math.ceil(cy2 + ry2)); ey++) {
      for (var ex = Math.max(0, Math.floor(cx2 - rx)); ex <= Math.min(W - 1, Math.ceil(cx2 + rx)); ex++) {
        var ddx = ex - cx2, ddy = (ey - cy2) * 3;
        if (onlyBelow !== undefined && ey < onlyBelow) continue;
        if (Math.sqrt(ddx * ddx + ddy * ddy) < rx * (0.8 + rng() * 0.4)) self.tiles[self.idx(ex, ey)] = tile;
      }
    }
  }
  function skyWaterStayPut(x2, y2) {
    var below = self.tiles[self.idx(x2, y2 + 1)];
    var left = self.tiles[self.idx(x2 - 1, y2)];
    var right = self.tiles[self.idx(x2 + 1, y2)];
    return (below !== T.AIR && below !== T.WATER) && (left !== T.AIR && left !== T.WATER) && (right !== T.AIR && right !== T.WATER);
  }
  for (var is2 = 0; is2 < islandCount; is2++) {
    var ix0 = 0, tries2 = 0;
    while (tries2++ < 40) {
      ix0 = Math.floor(W * (0.1 + rng() * 0.8));
      if (Math.abs(ix0 - W / 2) < 150) continue;
      var clash = false;
      for (var ih = 0; ih < islandHouseX.length; ih++) {
        if (Math.abs(ix0 - islandHouseX[ih]) < 180) { clash = true; break; }
      }
      if (!clash) break;
    }
    islandHouseX.push(ix0);
    // vanilla: island top = min(rand(90, firstSolid-100), worldSurfaceLow-50)
    // — keeps islands high in the sky, never touching terrain
    var colSurf = 0;
    for (var cs2 = 200; cs2 < this.worldSurfaceAvg; cs2++) {
      if (self.tiles[self.idx(ix0, cs2)] !== T.AIR) { colSurf = cs2; break; }
    }
    if (colSurf < 200) continue;
    var iy0 = 90 + rnd(Math.max(2, colSurf - 190));
    var cap = minSurf - 50;
    if (iy0 > cap) iy0 = cap;
    if (iy0 < 20) iy0 = 20;
    var iLeft = ix0, iRight = ix0, iTop = iy0, iBot = iy0;
    // phase 1: wandering flattened cloud discs forming the island base
    var baseR = 100 + rng() * 50;
    var steps2 = 20 + Math.floor(rng() * 10);
    var px2 = ix0, py2 = iy0;
    var vx2 = (rnd(41) - 20) * 0.2;
    while (vx2 > -2 && vx2 < 2) vx2 = (rnd(41) - 20) * 0.2;
    var vy2 = (rnd(11) - 20) * 0.02;
    var sLeft = px2, sRight = px2;
    for (var st = 0; st < steps2 && baseR > 0; st++) {
      baseR -= rnd(4);
      var rad = baseR * (0.8 + rng() * 0.4) * 0.4;
      var topLine = py2 + 1;
      for (var ey2 = Math.floor(py2); ey2 <= Math.ceil(py2 + rad / 3) + 2; ey2++) {
        var wob = topLine;
        for (var ex2 = Math.floor(px2 - rad); ex2 <= Math.ceil(px2 + rad); ex2++) {
          if (rng() * 2 < 1) wob += rnd(3) - 1;
          if (wob < py2) wob = Math.floor(py2);
          if (wob > py2 + 2) wob = Math.floor(py2) + 2;
          var ddx = ex2 - px2, ddy = (ey2 - py2) * 3;
          if (ey2 <= wob) continue;
          if (Math.sqrt(ddx * ddx + ddy * ddy) < rad && self.inBounds(ex2, ey2)) {
            self.tiles[self.idx(ex2, ey2)] = T.CLOUD;
            if (ex2 < iLeft) iLeft = ex2;
            if (ex2 > iRight) iRight = ex2;
            if (ey2 < iTop) iTop = ey2;
            if (ey2 > iBot) iBot = ey2;
          }
        }
      }
      if (px2 - rad < sLeft) sLeft = px2 - rad;
      if (px2 + rad > sRight) sRight = px2 + rad;
      px2 += vx2; py2 += vy2;
      vx2 = Math.max(-1, Math.min(1, vx2 + (rnd(41) - 20) * 0.05));
      if (vy2 > 0.2) vy2 = -0.2;
      if (vy2 < -0.2) vy2 = -0.2;
    }
    // phase 2: dirt cap along the top surface (grass spreads to it later)
    for (var dc2 = iLeft + rnd(5); dc2 < iRight; dc2 += 3 + rnd(4)) {
      var dcy = iBot;
      while (dcy > iTop && self.tiles[self.idx(dc2, dcy)] === T.AIR) dcy--;
      if (self.tiles[self.idx(dc2, dcy)] !== T.CLOUD) continue;
      var drx = 2 + rnd(4);
      for (var ddy2 = 0; ddy2 <= drx; ddy2++) {
        for (var ddx2 = -drx; ddx2 <= drx; ddx2++) {
          var dtx = dc2 + ddx2, dty = dcy + ddy2 - 2;
          if (!self.inBounds(dtx, dty)) continue;
          if (Math.abs(ddx2) + Math.abs(ddy2 * 2) < drx && self.tiles[self.idx(dtx, dty)] === T.CLOUD) {
            self.tiles[self.idx(dtx, dty)] = T.DIRT;
          }
        }
      }
    }
    // grass on the dirt cap
    for (var gx2 = iLeft; gx2 <= iRight; gx2++) {
      for (var gy2 = iTop; gy2 <= iBot; gy2++) {
        if (self.tiles[self.idx(gx2, gy2)] === T.DIRT && self.tiles[self.idx(gx2, gy2 - 1)] === T.AIR) {
          self.tiles[self.idx(gx2, gy2)] = T.GRASS;
        }
      }
    }
    // phase 3: water ponds settled into surface dips
    for (var wx3 = iLeft; wx3 <= iRight; wx3++) {
      if (rng() * 10 < 1) {
        var wyy = iTop;
        while (wyy < iBot && self.tiles[self.idx(wx3, wyy)] === T.AIR) wyy++;
        if (wyy > iTop && self.tiles[self.idx(wx3, wyy)] === T.CLOUD && skyWaterStayPut(wx3, wyy - 1)) {
          self.tiles[self.idx(wx3, wyy - 1)] = T.WATER;
        }
      }
    }
    // phase 4: 0-3 small sky-blobs floating above, some with water
    var blobCount = rnd(4);
    for (var bl = 0; bl < blobCount; bl++) {
      var bx3 = iLeft - 5 + rnd(iRight - iLeft + 10);
      var by3 = iTop - 20 - rnd(20);
      var br = 4 + rnd(4);
      var btile = (rng() * 2 < 1) ? T.CLOUD : T.CLOUD;
      skyEll(bx3, by3, br, Math.floor(br / 3), btile);
      for (var bwx = bx3 - br + 2; bwx <= bx3 + br - 2; bwx++) {
        var bwy = by3 - br;
        while (bwy < by3 + br && self.tiles[self.idx(bwx, bwy)] === T.AIR) bwy++;
        if (self.tiles[self.idx(bwx, bwy)] !== T.AIR && skyWaterStayPut(bwx, bwy - 1)) {
          self.tiles[self.idx(bwx, bwy - 1)] = T.WATER;
        }
      }
    }
    // phase 5: brick house sitting on the island (vanilla IslandHouse geometry)
    var hw = 7 + rnd(5);                    // half-width
    var hh2 = 5 + rnd(2);                   // height
    var hdir = rng() < 0.5 ? -1 : 1;
    var hx0 = ix0 + (hw + 2) * hdir;
    var hy0 = iy0;
    while (hy0 < iBot && self.tiles[self.idx(hx0, hy0)] === T.AIR) hy0++;
    hy0 -= hh2 + 1;
    for (var hyy2 = hy0 - 1; hyy2 <= hy0 + hh2 + 1; hyy2++) {
      for (var hxx2 = hx0 - hw - 1; hxx2 <= hx0 + hw + 1; hxx2++) {
        if (!self.inBounds(hxx2, hyy2)) continue;
        if (hyy2 === hy0 - 1 && (hxx2 === hx0 - hw - 1 || hxx2 === hx0 + hw + 1)) continue;
        self.tiles[self.idx(hxx2, hyy2)] = T.GRAYBRICK;
        self.walls[self.idx(hxx2, hyy2)] = WALL.NONE;
      }
    }
    for (var hy3 = hy0; hy3 < hy0 + hh2; hy3++) {
      for (var hx3 = hx0 - hw; hx3 <= hx0 + hw; hx3++) {
        if (hy3 > hy0 && hy3 < hy0 + hh2 && hx3 > hx0 - hw && hx3 < hx0 + hw) {
          self.tiles[self.idx(hx3, hy3)] = T.AIR;
          self.walls[self.idx(hx3, hy3)] = WALL.NONE;
        }
      }
    }
    // door gap on the outer side
    var doorX2 = hx0 + (hw + 1) * hdir;
    for (var dy3 = hy0 + hh2 - 3; dy3 <= hy0 + hh2 - 1; dy3++) {
      if (self.inBounds(doorX2, dy3)) self.tiles[self.idx(doorX2, dy3)] = T.AIR;
    }
    // furniture: table, chair, torch, sky chest
    self.tiles[self.idx(hx0 - 2, hy0 + hh2 - 1)] = T.TABLE;
    self.tiles[self.idx(hx0 + 2, hy0 + hh2 - 1)] = T.CHAIR;
    self.tiles[self.idx(hx0, hy0 + 1)] = T.TORCH;
    var chestX2 = hx0 - 1, chestY2 = hy0 + hh2 - 1;
    if (self.get(chestX2, chestY2) === T.AIR) {
      self.set(chestX2, chestY2, T.CHEST);
      var skyLoot = [{ id: I.FLYING_CARPET, count: 1 }];
      if (rng() < 0.7) skyLoot.push({ id: I.GOLDENHORSESHOE, count: 1 });
      if (rng() < 0.6) skyLoot.push({ id: I.STARFURY, count: 1 });
      if (rng() < 0.5) skyLoot.push({ id: I.GEM_DIAMOND, count: 1 });
      self.chests.push({ x: chestX2, y: chestY2, inv: skyLoot });
    }
    self.skyIslands.push({ x: ix0, y: iy0, w: Math.floor((iRight - iLeft) / 2) });
  }

  // --- Underground mini-biomes: spider / granite / marble ---
  self.spiderCols = new Uint8Array(W);
  self.graniteCols = new Uint8Array(W);
  self.marbleCols = new Uint8Array(W);
  function carvePocket(cx, cy, cr, fillTile, web) {
    var inner = Math.max(2, cr - 2);
    for (var pdy = -cr; pdy <= cr; pdy++) {
      for (var pdx = -cr; pdx <= cr; pdx++) {
        if (!self.inBounds(cx + pdx, cy + pdy)) continue;
        var pd2 = pdx * pdx + pdy * pdy;
        if (pd2 > cr * cr) continue;
        var pii = self.idx(cx + pdx, cy + pdy);
        if (pd2 <= inner * inner) {
          self.tiles[pii] = (web && rng() < 0.82) ? T.COBWEB : T.AIR;
          self.walls[pii] = WALL.CAVE;
        } else {
          self.tiles[pii] = fillTile;
          self.walls[pii] = WALL.NONE;
        }
      }
    }
  }
  var pocketBiomes = [BIOME.SPIDER, BIOME.GRANITE, BIOME.MARBLE];
  for (var pbi = 0; pbi < 3; pbi++) {
    var pocketCount = 4 + Math.floor(rng() * 3);
    for (var pp = 0; pp < pocketCount; pp++) {
      var pcx = Math.floor(W * (0.05 + rng() * 0.72));
      if (pcx > W * 0.74 && pcx < W * 0.9) pcx = Math.floor(W * 0.05 + rng() * 0.5);
      var pcy = self.surfaceY[pcx] + 24 + Math.floor(rng() * (self.hellY - self.surfaceY[pcx] - 40));
      var pr = 5 + Math.floor(rng() * 4);
      // keep mini-biomes distinct: no column overlap with an existing pocket
      var pocketOverlap = false;
      for (var mk = Math.max(0, pcx - pr - 2); mk <= Math.min(W - 1, pcx + pr + 2) && !pocketOverlap; mk++) {
        if (self.spiderCols[mk] || self.graniteCols[mk] || self.marbleCols[mk]) pocketOverlap = true;
      }
      if (pocketOverlap) continue;
      carvePocket(pcx, pcy, pr, pbi === 1 ? T.GRANITE : (pbi === 2 ? T.MARBLE : T.STONE), pbi === 0);
      var colsArr = pbi === 0 ? self.spiderCols : (pbi === 1 ? self.graniteCols : self.marbleCols);
      for (var mcx = pcx - pr; mcx <= pcx + pr; mcx++) {
        if (mcx >= 0 && mcx < W) colsArr[mcx] = 1;
      }
    }
  }

  // --- Aether (shimmer) pool: outer fifth on the jungle side, in the cavern layer ---
  {
    var axx2 = this.jungleLeft ? Math.floor(W * (0.02 + rng() * 0.09)) : Math.floor(W * (0.89 + rng() * 0.09));
    var ayy2 = Math.floor(H * (0.40 + rng() * 0.12));
    var arr = 5 + Math.floor(rng() * 3);
    carvePocket(axx2, ayy2, arr + 2, T.STONE, false);
    for (var asy = ayy2; asy <= ayy2 + arr + 1; asy++) {
      for (var asx = axx2 - arr; asx <= axx2 + arr; asx++) {
        if (!self.inBounds(asx, asy)) continue;
        if ((asx - axx2) * (asx - axx2) + (asy - ayy2) * (asy - ayy2) <= arr * arr) {
          self.tiles[self.idx(asx, asy)] = T.SHIMMER;
          self.walls[self.idx(asx, asy)] = WALL.NONE;
        }
      }
    }
    self.aetherPos = { x: axx2, y: ayy2 };
  }

  // --- Dungeon: faithful port of vanilla MakeDungeon / DungeonRoom /
  // DungeonHalls / DungeonStairs / DungeonEnt (decompiled 1.4.0.5) ---
  {
    var brick = T.DUNGEONBRICK;
    var dWall = WALL.DUNGEON;
    // vanilla: dungeon sits between the beach and 20% of the world on its side
    var beachL2 = this.beachL, beachR2 = this.beachR;
    var dgx = this.jungleLeft
      ? Math.floor(beachR2 - 50 - rng() * Math.max(40, beachR2 - 50 - W * 0.2))
      : Math.floor(beachL2 + 50 + rng() * Math.max(40, W * 0.2 - (beachL2 + 50)));
    var dgY = Math.floor((this.worldSurfaceAvg + this.rockLayer) / 2) + rnd(400) - 200;
    dgY = Math.max(4, Math.min(H - 120, dgY));
    var dgOK = false;
    for (var dg2 = 0; dg2 < 10; dg2++) {
      if (self.isSolid(dgx, dgY + dg2)) { dgOK = true; break; }
    }
    while (!dgOK && dgY < this.rockLayer + 200) {
      dgY++;
      for (dg2 = 0; dg2 < 10; dg2++) if (self.isSolid(dgx, dgY + dg2)) { dgOK = true; break; }
    }
    // vanilla strengths
    var dxS1 = 25 + rnd(6), dyS1 = 20 + rnd(6), dxS2 = 35 + rnd(16), dyS2 = 10 + rnd(6);
    var dMinX = dgx, dMaxX = dgx, dMaxY = dgY, dMinY = dgY;
    var dRooms = [];
    var clampI = function (v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); };

    // tile-frame helpers (vanilla shell / wall-ring / hollow rects)
    function dShell(px, py, rad) {
      var x0 = clampI(Math.floor(px - rad * 0.8 - 5 - rnd(6)), 0, W);
      var x1 = clampI(Math.floor(px + rad * 0.8 + 5 + rnd(6)), 0, W);
      var y0 = clampI(Math.floor(py - rad * 0.8 - 5 - rnd(6)), 0, H);
      var y1 = clampI(Math.floor(py + rad * 0.8 + 5 + rnd(6)), 0, H);
      for (var yy = y0; yy < y1; yy++) {
        for (var xx = x0; xx < x1; xx++) {
          var ii = self.idx(xx, yy);
          if (xx < dMinX) dMinX = xx;
          if (xx > dMaxX) dMaxX = xx;
          if (yy > dMaxY) dMaxY = yy;
          self.tiles[ii] = self.walls[ii] === dWall ? self.tiles[ii] : brick;
        }
      }
      for (yy = y0 + 1; yy < y1 - 1; yy++)
        for (xx = x0 + 1; xx < x1 - 1; xx++)
          self.walls[self.idx(xx, yy)] = dWall;
    }
    function dHollow(px, py, rad, widen) {
      var x0 = clampI(Math.floor(px - rad * 0.5 - widen), 0, W);
      var x1 = clampI(Math.floor(px + rad * 0.5 + widen), 0, W);
      var y0 = clampI(Math.floor(py - rad * 0.5 - widen), 0, H);
      var y1 = clampI(Math.floor(py + rad * 0.5 + widen), 0, H);
      for (var yy = y0; yy < y1; yy++)
        for (var xx = x0; xx < x1; xx++) {
          self.tiles[self.idx(xx, yy)] = T.AIR;
          self.walls[self.idx(xx, yy)] = dWall;
        }
    }

    // DungeonRoom: wandering blob rooms (radius 15-30, 10-20 steps)
    function dungeonRoom(i2, j2) {
      var size = 15 + rnd(15);
      var vx = (rnd(21) - 10) * 0.1, vy = (rnd(21) - 10) * 0.1;
      var px = i2, py = j2 - size / 2;
      var steps2 = 10 + rnd(10);
      while (steps2 > 0) {
        steps2--;
        dShell(px, py, size * 0.8);
        dHollow(px, py, size, 0);
        px += vx; py += vy;
        vx = clamp(vx + (rnd(21) - 10) * 0.05, -1, 1);
        vy = clamp(vy + (rnd(21) - 10) * 0.05, -1, 1);
      }
      dRooms.push({ x: Math.floor(px), y: Math.floor(py), size: Math.floor(size), treasure: false });
      return [Math.floor(px), Math.floor(py)];
    }

    if (!self.__segLog) self.__segLog = [];
    function dungeonHalls(i2, j2, forceX) {
      var num1 = 4 + rnd(2);
      var num2 = num1;
      var num3 = 35 + rnd(45);
      var x = i2, y = j2;
      var lastL = false, lastR = false;
      // vanilla: probe 4 rays for existing dungeon wall — prefer fresh terrain
      function probeDir(dx, dy) {
        var seen = false;
        for (var s4 = 0; s4 < num3; s4++) {
          var px4 = Math.floor(x + dx * s4), py4 = Math.floor(y + dy * s4);
          if (px4 < 1 || px4 >= W - 1 || py4 < 1 || py4 >= H - 1) return false;
          var wl4 = self.walls[self.idx(px4, py4)];
          if (wl4 === dWall) { if (seen) return false; seen = true; }
          else seen = true;
        }
        return true;
      }
      var up = probeDir(0, -1), down = probeDir(0, 1);
      var left = probeDir(-1, 0), right = probeDir(1, 0);
      var horizontal, dir;
      if (!up && !down && !left && !right) {
        dir = rnd(2) === 0 ? 1 : -1;
        horizontal = rnd(2) === 0;
      } else {
        var opts = [];
        if (up) opts.push(0);
        if (down) opts.push(1);
        if (left) opts.push(2);
        if (right) opts.push(3);
        var pick = opts[rnd(opts.length)];
        if (pick === 0) { dir = -1; horizontal = false; }
        else if (pick === 1) { dir = 1; horizontal = false; }
        else { horizontal = true; dir = (pick === 2) ? -1 : 1; }
      }
      if (forceX) horizontal = true;
      var zero1X = 0, zero1Y = 0, zero2Y = 0;
      if (horizontal) {
        zero1X = dir; zero1Y = 0; zero2Y = 0;
        if (rnd(3) === 0) zero1Y = rng() < 0.5 ? 0.2 : -0.2;
      } else {
        num1++; // halls widen as they descend (vanilla ++num1)
        zero1Y = dir; zero1X = 0; zero2Y = dir;
        if (rnd(3) !== 0) {
          var d5 = 1 + rnd(2);
          zero1X = (rng() < 0.5 ? -1 : 1) * d5;
        } else if (rnd(2) === 0) {
          zero1X = (rng() < 0.5 ? -1 : 1) * (0.2 + rnd(2) * 0.1);
        } else {
          num3 = Math.floor(num3 / 2);
        }
      }
      var num7 = 0;
      for (var s5 = 0; s5 < num3; s5++) {
        num7++;
        // segment cut-off at world edges (vanilla)
        if (zero1X > 0 && x > W - 100) num3 = 0;
        else if (zero1X < 0 && x < 100) num3 = 0;
        else if (zero2Y > 0 && y > H - 100) num3 = 0;
        else if (zero2Y < 0 && y < self.rockLayer + 50) num3 = 0;
        num3--;
        // shell: brick unless already dungeon wall
        var x0 = clampI(Math.floor(x - num1 - 4 - rnd(6)), 0, W);
        var x1 = clampI(Math.floor(x + num1 + 4 + rnd(6)), 0, W);
        var y0 = clampI(Math.floor(y - num1 - 4 - rnd(6)), 0, H);
        var y1 = clampI(Math.floor(y + num1 + 4 + rnd(6)), 0, H);
        for (var yy5 = y0; yy5 < y1; yy5++) {
          for (var xx5 = x0; xx5 < x1; xx5++) {
            if (xx5 < dMinX) dMinX = xx5;
            if (xx5 > dMaxX) dMaxX = xx5;
            if (yy5 > dMaxY) dMaxY = yy5;
            var ii4 = self.idx(xx5, yy5);
            if (self.walls[ii4] !== dWall) self.tiles[ii4] = brick;
          }
        }
        for (yy5 = y0 + 1; yy5 < y1 - 1; yy5++)
          for (xx5 = x0 + 1; xx5 < x1 - 1; xx5++)
            self.walls[self.idx(xx5, yy5)] = dWall;
        // widening num18 (vanilla probabilities)
        var num18 = 0;
        if (zero1Y === 0 && Math.floor(rng() * (num1 + 1)) === 0) num18 = 1 + rnd(2);
        else if (zero1X === 0 && Math.floor(rng() * Math.max(1, num1 - 1)) === 0) num18 = 1 + rnd(2);
        else if (Math.floor(rng() * (num1 * 3)) === 0) num18 = 1 + rnd(2);
        // hollow: air + dungeon wall
        var hx0 = clampI(Math.floor(x - num1 * 0.5 - num18), 0, W);
        var hx1 = clampI(Math.floor(x + num1 * 0.5 + num18), 0, W);
        var hy0 = clampI(Math.floor(y - num1 * 0.5 - num18), 0, H);
        var hy1 = clampI(Math.floor(y + num1 * 0.5 + num18), 0, H);
        for (yy5 = hy0; yy5 < hy1; yy5++)
          for (xx5 = hx0; xx5 < hx1; xx5++) {
            self.tiles[self.idx(xx5, yy5)] = T.AIR;
            self.walls[self.idx(xx5, yy5)] = dWall;
          }
        x += zero1X; y += zero1Y;
        // vertical bounce every 10-20 steps (vanilla flag3)
        if (zero1X !== 0 && num7 > 10 + rnd(10)) { num7 = 0; zero1X *= -1; }
      }
      // width reset after horizontal runs (vanilla)
      if (Math.abs(zero1X) > Math.abs(zero1Y) && rnd(3) !== 0) num1 = Math.floor(num2 * (1.1 + rnd(4) * 0.1));
      // torches
      for (var t3 = 0; t3 < 2; t3++) {
        var txx2 = clampI(x - 3 + rnd(6), 2, W - 3);
        var tyy2 = clampI(y - 2 + rnd(4), 2, H - 3);
        if (self.get(txx2, tyy2) === T.AIR) self.set(txx2, tyy2, T.TORCH);
      }
      return [Math.floor(x), Math.floor(y)];
    }
    // MakeDungeon main loop: room, then 70-93 hall segments (rooms every 5,
    // 1/3 chance of side halls), per vanilla
    dungeonRoom(dgx, dgY);
    var cur = [dgx, dgY];
    var halls = Math.floor(W / 60) + rnd(Math.floor(W / 180) + 1);
    var untilRoom = 5;
    for (var h2 = 0; h2 < halls; h2++) {
      if (untilRoom > 0) untilRoom--;
      if (untilRoom === 0 && rnd(3) === 0) {
        untilRoom = 5;
        var saveX = cur[0], saveY = cur[1];
        cur = dungeonHalls(cur[0], cur[1]);
        if (rnd(2) === 0) cur = dungeonHalls(cur[0], cur[1]);
        cur = dungeonRoom(cur[0], cur[1]);
        cur = [saveX, saveY];
      } else {
        cur = dungeonHalls(cur[0], cur[1]);
      }
    }
    dungeonRoom(cur[0], cur[1]);
    // find the topmost room and climb stairs to the surface (vanilla DungeonStairs)
    var topRoom = dRooms[0];
    for (var tr2 = 0; tr2 < dRooms.length; tr2++) {
      if (dRooms[tr2].y < topRoom.y) topRoom = dRooms[tr2];
    }
    var dEnteranceX = topRoom.x;
    var dSurface = false;
    var cur2 = [topRoom.x, topRoom.y];
    var guard = 0;
    var stairDir = dEnteranceX <= W / 2 ? 1 : -1;
    if (dEnteranceX > W - 400) stairDir = -1;
    else if (dEnteranceX < 400) stairDir = 1;
    while (!dSurface && guard++ < 30) {
      // DungeonStairs: one call = 10-30 diagonal steps climbing up
      var num1s = 5 + rnd(4);
      var stepsS = 10 + rnd(20);
      var sx3 = cur2[0], sy3 = cur2[1];
      var xDir = stairDir * (1 + rng() * 2);
      for (var ss = 0; ss < stepsS; ss++) {
        dShell(sx3, sy3, num1s);
        var widen3 = (Math.floor(rng() * num1s) === 0) ? 1 + rnd(2) : 0;
        dHollow(sx3, sy3, num1s, widen3);
        sx3 += xDir;
        sy3 -= 1;
        // vanilla dSurface check: above the surface line AND sky above -> blast open
        if (sy3 < this.worldSurfaceAvg - 5) {
          var chkX = clampI(Math.floor(sx3 + dxS1 * 0.6 * stairDir), 1, W - 2);
          if (self.walls[self.idx(chkX, Math.max(1, sy3 - num1s - 6))] === 0 &&
              self.walls[self.idx(chkX, Math.max(1, sy3 - num1s - 7))] === 0 &&
              self.walls[self.idx(chkX, Math.max(1, sy3 - num1s - 8))] === 0) {
            dSurface = true;
            tileRunnerV(Math.floor(sx3), Math.max(2, Math.floor(sy3 - num1s - 6)), 25 + rnd(10), 10 + rnd(10), 'air', { speedY: -1 });
            break;
          }
        }
        if (sy3 < 10) { dSurface = true; break; }
      }
      cur2 = [sx3, sy3];
    }
    // DungeonEnt: the big brick entrance tower at the top point (clamped to the local surface)
    var entX = Math.floor(cur2[0]);
    var entY = Math.max(60, Math.min(cur2[1], this.surfaceY[clampI(entX, 0, W - 1)] + 20));
    var eX0 = clampI(Math.floor(entX - dxS1 * 0.6 - rnd(2, 5)), 1, W - 2);
    var eX1 = clampI(Math.floor(entX + dxS1 * 0.6 + rnd(2, 5)), 1, W - 2);
    var eY0 = clampI(Math.floor(entY - dyS1 * 0.6 - rnd(2, 5)), 1, H - 2);
    var eY1 = clampI(Math.floor(entY + dyS1 * 0.6 + rnd(8, 16)), 1, H - 2);
    for (var ey2 = eY0; ey2 < eY1; ey2++) {
      for (var ex2 = eX0; ex2 < eX1; ex2++) {
        var eii = self.idx(ex2, ey2);
        if (self.walls[eii] !== dWall) self.tiles[eii] = brick;
        self.walls[eii] = dWall;
      }
    }
    // hollow the entrance chamber (vanilla interior)
    for (ey2 = eY0 + 1; ey2 < eY1 - 1; ey2++) {
      for (ex2 = eX0 + 1; ex2 < eX1 - 1; ex2++) {
        self.tiles[self.idx(ex2, ey2)] = T.AIR;
        self.walls[self.idx(ex2, ey2)] = dWall;
      }
    }
    // crenellated top (vanilla gaps pattern)
    var gap = 2 + rnd(4), cnt = 0;
    for (ex2 = eX0; ex2 < eX1; ex2++) {
      for (ey2 = eY0 - 2; ey2 < eY0; ey2++) {
        self.tiles[self.idx(ex2, ey2)] = brick;
        self.walls[self.idx(ex2, ey2)] = dWall;
      }
      cnt++;
      if (cnt >= gap) { ex2 += gap; cnt = 0; }
    }
    // brick tower from the entrance box up to the surface (vanilla full column)
    for (ex2 = eX0; ex2 < eX1; ex2++) {
      for (ey2 = eY1; ey2 < this.worldSurfaceAvg; ey2++) {
        var tii = self.idx(ex2, ey2);
        if (self.walls[tii] !== dWall) self.tiles[tii] = brick;
        if (ex2 > eX0 && ex2 < eX1 - 1) self.walls[tii] = dWall;
      }
    }
    // hollow the tower interior so it can be walked up
    for (ey2 = eY1; ey2 < this.worldSurfaceAvg - 2; ey2++) {
      for (ex2 = eX0 + 1; ex2 < eX1 - 1; ex2++) {
        self.tiles[self.idx(ex2, ey2)] = T.AIR;
        self.walls[self.idx(ex2, ey2)] = dWall;
      }
    }
    // platforms up the tower every ~6 tiles
    for (ey2 = eY1 - 8; ey2 > this.worldSurfaceAvg + 10; ey2 -= 6) {
      for (ex2 = eX0 + 1; ex2 < eX1 - 1; ex2++) {
        self.tiles[self.idx(ex2, ey2)] = T.PLATFORM;
        self.walls[self.idx(ex2, ey2)] = dWall;
      }
    }
    // door gate at the top of the entrance box + open shaft to the surface
    var gateX = Math.floor((eX0 + eX1) / 2);
    this.tiles[this.idx(gateX, eY0 + 1)] = T.DUNGEONDOOR;
    this.tiles[this.idx(gateX, eY0 + 2)] = T.DUNGEONDOOR;
    this.dungeonDoors = [{ x: gateX, y: eY0 + 1 }, { x: gateX, y: eY0 + 2 }];
    this.dungeonEntrance = { x: gateX * TILE + 8, y: eY0 * TILE };
    for (var osx = gateX - 2; osx <= gateX + 2; osx++) {
      for (var osy = eY0; osy >= Math.min(eY0, this.surfaceY[clampI(osx, 0, W - 1)]) - 1; osy--) {
        if (!self.inBounds(osx, osy)) break;
        self.tiles[self.idx(osx, osy)] = T.AIR;
        self.walls[self.idx(osx, osy)] = WALL.NONE;
      }
    }
    this.dungeonRect = { x0: dMinX - 4, y0: Math.min(dMinY, eY0) - 4, x1: dMaxX + 4, y1: dMaxY + 4 };
    this.dungeonBrickCheck = true;
    // furnish rooms: torches, spikes, chests with dungeon loot
    for (var rr4 = 0; rr4 < dRooms.length; rr4++) {
      var rm = dRooms[rr4];
      var rw2 = Math.floor(rm.size * 0.5);
      var tx4 = clampI(rm.x - rw2 + 2 + rnd(Math.max(1, rw2 * 2 - 3)), 2, W - 3);
      var ty4 = clampI(rm.y + rw2 - 1, 2, H - 3);
      if (self.get(tx4, ty4) === T.AIR) self.set(tx4, ty4, T.TORCH);
      if (rng() < 0.4) {
        for (var sp2 = 0; sp2 < 3 + rnd(4); sp2++) {
          var spx = clampI(rm.x - rw2 + 2 + rnd(Math.max(1, rw2 * 2 - 3)), 2, W - 3);
          if (self.get(spx, rm.y + rw2 - 1) === T.AIR && self.isSolid(spx, rm.y + rw2)) {
            self.set(spx, rm.y + rw2 - 1, T.SPIKE);
          }
        }
      }
      if (!rm.treasure && rng() < 0.6) {
        rm.treasure = true;
        var cx6 = clampI(rm.x - 2 + rnd(5), 2, W - 3);
        var cy6 = clampI(rm.y + rw2 - 1, 2, H - 3);
        if (self.get(cx6, cy6) === T.AIR) {
          self.set(cx6, cy6, T.CHEST);
          var dinv = [{ id: I.GOLDENKEY, count: 1 }];
          if (rng() < 0.4) dinv.push({ id: I.MURAMASA, count: 1 });
          if (rng() < 0.4) dinv.push({ id: I.COBALTSHIELD, count: 1 });
          if (rng() < 0.4) dinv.push({ id: I.AQUASCEPTER, count: 1 });
          if (rng() < 0.4) dinv.push({ id: I.WATERBOLT, count: 1 });
          if (rng() < 0.4) dinv.push({ id: I.GEM_RUBY, count: 1 });
          self.chests.push({ x: cx6, y: cy6, inv: dinv });
        }
      }
    }
  }

  // --- Desert pyramids: 1-2 sandstone pyramids in the desert ---
  var pyCount = 1 + Math.floor(rng() * 2);
  for (var py = 0; py < pyCount; py++) {
    var px0 = Math.floor(W * (0.51 + rng() * 0.03));
    var ps = this.surfaceY[px0];
    var pw = 16 + Math.floor(rng() * 8);
    var ph = 8 + Math.floor(rng() * 4);
    // pyramid body above surface
    for (var ply = 0; ply < ph; ply++) {
      var half = Math.max(1, Math.floor((ph - ply) / ph * (pw / 2)));
      for (var plx = -half; plx <= half; plx++) {
        var pxx = px0 + plx;
        var pyy = ps - ply;
        if (!self.inBounds(pxx, pyy)) continue;
        self.tiles[self.idx(pxx, pyy)] = T.SANDSTONE;
        self.walls[self.idx(pxx, pyy)] = WALL.NONE;
      }
    }
    // treasure chamber below
    var tcx = px0 + Math.floor((rng() - 0.5) * 2);
    for (var cdly = ps + 1; cdly <= ps + 5; cdly++) {
      for (var cdlx = tcx - 3; cdlx <= tcx + 3; cdlx++) {
        if (!self.inBounds(cdlx, cdly)) continue;
        self.tiles[self.idx(cdlx, cdly)] = T.SANDSTONE;
        self.walls[self.idx(cdlx, cdly)] = WALL.CAVE;
      }
    }
    // carve the chamber
    for (var cdly2 = ps + 2; cdly2 <= ps + 4; cdly2++) {
      for (var cdlx2 = tcx - 2; cdlx2 <= tcx + 2; cdlx2++) {
        if (!self.inBounds(cdlx2, cdly2)) continue;
        self.tiles[self.idx(cdlx2, cdly2)] = T.AIR;
      }
    }
    var pchestX = tcx, pchestY = ps + 3;
    if (self.inBounds(pchestX, pchestY)) {
      self.set(pchestX, pchestY, T.CHEST);
      var pinv = [];
      if (rng() < 0.5) pinv.push({ id: I.GOLDBAR, count: 2 + Math.floor(rng() * 3) });
      if (rng() < 0.5) pinv.push({ id: I.PLATINUMBAR, count: 1 + Math.floor(rng() * 2) });
      if (rng() < 0.5) pinv.push({ id: I.GEM_TOPAZ, count: 1 });
      if (rng() < 0.4) pinv.push({ id: I.GEM_EMERALD, count: 1 });
      if (rng() < 0.4) pinv.push({ id: I.PHAROAHMASK, count: 1 });
      self.chests.push({ x: pchestX, y: pchestY, inv: pinv });
    }
    // sand fills the chamber opening naturally
    if (self.inBounds(tcx, ps + 1)) {
      self.tiles[self.idx(tcx, ps + 1)] = T.SAND;
    }
  }

  // --- Living trees: giant hollow trees in the forest ---
  var ltCount = 3 + Math.floor(rng() * 2);
  for (var lt = 0; lt < ltCount; lt++) {
    var ltx = Math.floor(W * (0.32 + rng() * 0.36));
    if (this.mushroomAt[ltx] === 1) continue;
    var lty = this.surfaceY[ltx];
    if (this.get(ltx, lty) !== T.GRASS) continue;
    var ltH = 26 + Math.floor(rng() * 14);
    // vanilla living-tree trunk: 5-7 wide, 2-tile wood shell, hollow core
    var half = 1 + Math.floor(rng() * 2); // interior half-width: 1-2
    for (var tyyy = lty; tyyy > lty - ltH; tyyy--) {
      for (var txx2 = ltx - half - 2; txx2 <= ltx + half + 2; txx2++) {
        if (!self.inBounds(txx2, tyyy)) continue;
        var dist = Math.abs(txx2 - ltx);
        var edge = dist > half || tyyy === lty - ltH + 1 || tyyy === lty;
        self.tiles[self.idx(txx2, tyyy)] = edge ? T.WOOD : T.AIR;
        self.walls[self.idx(txx2, tyyy)] = edge ? WALL.WOOD : WALL.CAVE;
      }
    }
    // vanilla crown: big rounded leaf mass (up to ~29 wide, 10 tall)
    var crown = lty - ltH + 1;
    var crx = 10 + Math.floor(rng() * 5), cry = 5 + Math.floor(rng() * 3);
    for (var ldy = crown - cry; ldy <= crown + 2; ldy++) {
      for (var ldx = ltx - crx; ldx <= ltx + crx; ldx++) {
        if (!self.inBounds(ldx, ldy)) continue;
        var ndx = (ldx - ltx) / crx, ndy = (ldy - crown) / cry;
        var nell = ndx * ndx + ndy * ndy;
        if (nell <= 1 && (nell < 0.55 || rng() < 0.7) && self.tiles[self.idx(ldx, ldy)] === T.AIR) {
          self.tiles[self.idx(ldx, ldy)] = T.LEAVES;
          self.walls[self.idx(ldx, ldy)] = WALL.NONE;
        }
      }
    }
    // chest at the base (inside the trunk)
    if (self.inBounds(ltx, lty - 1)) {
      self.set(ltx, lty - 1, T.CHEST);
      var linv = [{ id: I.WOOD, count: 10 + Math.floor(rng() * 20) }];
      if (rng() < 0.5) linv.push({ id: I.WOODSWORD, count: 1 });
      if (rng() < 0.4) linv.push({ id: I.HEALINGPOTION, count: 2 });
      if (rng() < 0.3) linv.push({ id: I.GEM_EMERALD, count: 1 });
      if (rng() < 0.3) linv.push({ id: I.TINBAR, count: 3 });
      self.chests.push({ x: ltx, y: lty - 1, inv: linv });
    }
  }

  // --- Underground cabins: small wood rooms with chests ---
  var cabinCount = 6 + Math.floor(rng() * 4);
  for (var cb = 0; cb < cabinCount; cb++) {
    var cbx = Math.floor(W * (0.08 + rng() * 0.84));
    var cby = this.surfaceY[cbx] + 30 + Math.floor(rng() * (self.hellY - this.surfaceY[cbx] - 60));
    if (cby < this.surfaceY[cbx] + 24 || cby > self.hellY - 4) continue;
    var cw = 8 + Math.floor(rng() * 4), chh = 5 + Math.floor(rng() * 2);
    // carve out + wood walls
    for (var wdy = cby - 2; wdy <= cby + chh; wdy++) {
      for (var wdx = cbx - 2; wdx <= cbx + cw; wdx++) {
        if (!self.inBounds(wdx, wdy)) continue;
        var edge = wdy === cby - 2 || wdy === cby + chh || wdx === cbx - 2 || wdx === cbx + cw;
        self.tiles[self.idx(wdx, wdy)] = edge ? T.WOOD : T.AIR;
        self.walls[self.idx(wdx, wdy)] = edge ? WALL.DIRT : WALL.CAVE;
      }
    }
    // doorway
    if (self.inBounds(cbx + 1, cby + chh)) self.tiles[self.idx(cbx + 1, cby + chh)] = T.AIR;
    // chest
    var ccx = cbx + 2 + Math.floor(rng() * (cw - 4));
    if (self.inBounds(ccx, cby + chh - 1)) {
      self.set(ccx, cby + chh - 1, T.CHEST);
      var cinv = [];
      if (rng() < 0.5) cinv.push({ id: I.IRONBAR, count: 2 + Math.floor(rng() * 3) });
      if (rng() < 0.4) cinv.push({ id: I.SILVERBAR, count: 1 + Math.floor(rng() * 2) });
      if (rng() < 0.4) cinv.push({ id: I.HEALINGPOTION, count: 1 });
      if (rng() < 0.3) cinv.push({ id: I.GEM_AMETHYST, count: 1 });
      if (rng() < 0.3) cinv.push({ id: I.GEM_SAPPHIRE, count: 1 });
      self.chests.push({ x: ccx, y: cby + chh - 1, inv: cinv });
    }
    // torch
    if (self.inBounds(cbx + 1, cby + chh - 1) && self.get(cbx + 1, cby + chh - 1) === T.AIR) {
      self.set(cbx + 1, cby + chh - 1, T.TORCH);
    }
  }

  // Plantera bulbs: 6 deep in jungle mud
  for (var pb = 0; pb < 6; pb++) {
    var pbx = Math.floor(W * (0.79 + rng() * 0.08));
    var pby = this.surfaceY[pbx] + 60 + Math.floor(rng() * 140);
    if (pby > H - 30) pby = H - 30;
    // dig a small pocket
    for (var py2 = pby - 2; py2 <= pby + 1; py2++) {
      for (var px2 = pbx - 2; px2 <= pbx + 2; px2++) {
        var pi2 = this.idx(px2, py2);
        if (Math.abs(px2 - pbx) + Math.abs(py2 - pby) <= 3 && this.tiles[pi2] !== T.AIR) {
          this.tiles[pi2] = T.AIR; this.walls[pi2] = WALL.CAVE;
        }
      }
    }
    this.set(pbx, pby, T.PLANTERABULB);
    this.planteraBulbs.push({ x: pbx * TILE + 8, y: pby * TILE + 8 });
  }

  // Lihzahrd temple: buried in the deep jungle, above the Underworld
  {
    var tlx = this.jungleLeft ? Math.floor(W * (0.20 + rng() * 0.12)) : Math.floor(W * (0.68 + rng() * 0.12));
    var tly = this.hellY - 170 - Math.floor(rng() * 60);
    var tw = 16 + Math.floor(rng() * 6);
    var th2 = 12 + Math.floor(rng() * 4);
    this.templeRect = { x0: tlx, y0: tly, x1: tlx + tw, y1: tly + th2 };
    for (var txx = tlx - 1; txx <= tlx + tw + 1; txx++) {
      for (var tyy = tly - 1; tyy <= tly + th2 + 1; tyy++) {
        if (!this.inBounds(txx, tyy)) continue;
        var edge = txx === tlx - 1 || txx === tlx + tw + 1 || tyy === tly - 1 || tyy === tly + th2 + 1;
        this.tiles[this.idx(txx, tyy)] = edge ? T.TEMPLEBRICK : T.AIR;
        this.walls[this.idx(txx, tyy)] = WALL.STONE;
      }
    }
    // entrance tunnel up from the roof
    var ex = tlx + Math.floor(tw / 2);
    for (var ey = tly - 2; ey >= tly - 8; ey--) {
      this.tiles[this.idx(ex, ey)] = T.AIR;
      this.walls[this.idx(ex, ey)] = WALL.CAVE;
    }
    this.templeCenter = { x: (tlx + tw / 2) * TILE, y: (tly + th2 / 2) * TILE };
    var templeChestX = tlx + 2, templeChestY = tly + 2;
    this.tiles[this.idx(templeChestX, templeChestY)] = T.CHEST;
    this.chests.push({
      x: templeChestX, y: templeChestY,
      inv: [{ id:I.LIHZAHARDPOWERCELL, count:3 }, { id:I.HEALINGPOTION, count:2 }]
    });
  }

  // Natural evil chasms with two Orb/Heart chambers each, spread across the
  // evil biome band (mirrored to its actual side of the world).
  this.evilChasms = [];
  this.evilObjects = [];
  var evilStone = isCrimson ? T.CRIMSTONE : T.EBONSTONE;
  var evilObject = isCrimson ? T.CRIMSONHEART : T.SHADOWORB;
  var eF0 = 0.545, eF1 = 0.600;
  var chasmFs = [0.15, 0.42, 0.68, 0.9].map(function (t) { return eF0 + t * (eF1 - eF0); });
  if (!this.jungleLeft) chasmFs = chasmFs.map(function (f) { return 1 - f; });
  for (var ec = 0; ec < chasmFs.length; ec++) {
    var ecx = Math.floor(W * chasmFs[ec] + (rng() - 0.5) * 18);
    var ecy = this.surfaceY[ecx] - 2;
    var ecDepth = 62 + Math.floor(rng() * 24);
    var walkX = ecx;
    this.evilChasms.push({ x:ecx, y:ecy, depth:ecDepth });
    for (var es = 0; es < ecDepth; es++) {
      walkX += (rng() - 0.5) * 1.1;
      var shaftX = Math.floor(walkX), shaftY = ecy + es;
      var shaftR = 2 + (es % 19 === 0 ? 1 : 0);
      for (var sdy = -shaftR; sdy <= shaftR; sdy++) {
        for (var sdx = -shaftR; sdx <= shaftR; sdx++) {
          var stx = shaftX + sdx, sty = shaftY + sdy;
          if (!this.inBounds(stx, sty) || sdx * sdx + sdy * sdy > shaftR * shaftR) continue;
          if (sty < this.surfaceY[stx] - 1) continue; // never carve/wall above the local surface
          var oldShaft = this.get(stx, sty);
          if (oldShaft === T.DUNGEONBRICK || oldShaft === T.DUNGEONDOOR || oldShaft === T.TEMPLEBRICK || oldShaft === T.CHEST || oldShaft === T.SHADOWCHEST) continue;
          this.tiles[this.idx(stx, sty)] = T.AIR;
          this.walls[this.idx(stx, sty)] = WALL.CAVE;
        }
      }
      if (es === Math.floor(ecDepth * 0.55) || es === ecDepth - 8) {
        var side = ((ec + es) % 2 === 0) ? -1 : 1;
        var branchLen = 7 + Math.floor(rng() * 6);
        var chamberX = shaftX + side * branchLen, chamberY = shaftY;
        for (var bl = 0; bl <= branchLen; bl++) {
          var btx = shaftX + side * bl;
          for (var bdy = -1; bdy <= 1; bdy++) {
            if (this.inBounds(btx, chamberY + bdy)) {
              this.tiles[this.idx(btx, chamberY + bdy)] = T.AIR;
              this.walls[this.idx(btx, chamberY + bdy)] = WALL.CAVE;
            }
          }
        }
        for (var cdy = -4; cdy <= 4; cdy++) {
          for (var cdx = -4; cdx <= 4; cdx++) {
            var ctx = chamberX + cdx, cty = chamberY + cdy;
            if (!this.inBounds(ctx, cty)) continue;
            var cd2 = cdx * cdx + cdy * cdy;
            if (cd2 <= 9) {
              this.tiles[this.idx(ctx, cty)] = T.AIR;
              this.walls[this.idx(ctx, cty)] = WALL.CAVE;
            } else if (cd2 <= 16) {
              this.tiles[this.idx(ctx, cty)] = evilStone;
              this.walls[this.idx(ctx, cty)] = WALL.STONE;
            }
          }
        }
        this.set(chamberX, chamberY, evilObject);
        this.evilObjects.push({ x:chamberX, y:chamberY, tile:evilObject });
      }
    }
  }

  // Demon/Crimson Altars - one per chasm, set on the chamber floor.
  this.altars = [];
  this.altarsSmashed = [];
  for (var at = 0; at < this.evilObjects.length; at += 2) {
    var ob = this.evilObjects[at];
    var ax = ob.x, ay = ob.y + 2;
    if (!this.inBounds(ax, ay)) continue;
    this.tiles[this.idx(ax, ay)] = T.ALTAR;
    this.altars.push({ x: ax, y: ay });
  }

  // Jungle Bee Hives with one breakable Larva each.
  this.beeHives = [];
  this.larvae = [];
  for (var bh = 0; bh < 8; bh++) {
    var madeHive = false;
    for (var attempt = 0; attempt < 24 && !madeHive; attempt++) {
      var hw = 14 + Math.floor(rng() * 5), hhive = 10 + Math.floor(rng() * 4);
      var hcx = Math.floor(W * (0.79 + rng() * 0.08));
      var hcy = this.surfaceY[hcx] + 42 + Math.floor(rng() * 105);
      var hx0 = hcx - Math.floor(hw / 2), hy0 = hcy - Math.floor(hhive / 2);
      if (hy0 + hhive >= this.hellY - 8) continue;
      var tr = this.templeRect;
      if (tr && hx0 <= tr.x1 + 4 && hx0 + hw >= tr.x0 - 4 && hy0 <= tr.y1 + 4 && hy0 + hhive >= tr.y0 - 4) continue;
      var overlaps = false;
      for (var oldHive = 0; oldHive < this.beeHives.length; oldHive++) {
        var oh = this.beeHives[oldHive];
        if (hx0 <= oh.x + oh.w + 5 && hx0 + hw + 5 >= oh.x && hy0 <= oh.y + oh.h + 5 && hy0 + hhive + 5 >= oh.y) overlaps = true;
      }
      for (var bp = 0; bp < this.planteraBulbs.length && !overlaps; bp++) {
        var bpx = Math.floor(this.planteraBulbs[bp].x / TILE), bpy = Math.floor(this.planteraBulbs[bp].y / TILE);
        if (bpx >= hx0 - 5 && bpx <= hx0 + hw + 5 && bpy >= hy0 - 5 && bpy <= hy0 + hhive + 5) overlaps = true;
      }
      if (overlaps) continue;
      for (var hdy = 0; hdy <= hhive; hdy++) {
        for (var hdx = 0; hdx <= hw; hdx++) {
          var nx = (hdx - hw / 2) / (hw / 2), ny = (hdy - hhive / 2) / (hhive / 2);
          var ellipse = nx * nx + ny * ny;
          if (ellipse > 1) continue;
          var htx = hx0 + hdx, hty = hy0 + hdy;
          if (!this.inBounds(htx, hty)) continue;
          this.tiles[this.idx(htx, hty)] = ellipse > 0.58 ? T.HIVE : T.AIR;
          this.walls[this.idx(htx, hty)] = ellipse > 0.58 ? WALL.STONE : WALL.CAVE;
        }
      }
      var larvaX = hcx, larvaY = hcy + 2;
      this.set(larvaX, larvaY, T.LARVA);
      for (var honeyX = hcx - 2; honeyX <= hcx + 2; honeyX++) {
        if (this.get(honeyX, hcy + 4) === T.AIR) this.set(honeyX, hcy + 4, T.HONEY);
      }
      this.beeHives.push({ x:hx0, y:hy0, w:hw, h:hhive });
      this.larvae.push({ x:larvaX, y:larvaY });
      madeHive = true;
    }
  }

  // (heart crystals: 30 per world generated by the cave-floor Life Crystal pass)

  // Find spawn point: vanilla spawns at the exact world center (in the forest)
  var sp = Math.floor(W * 0.5);
  var sy2 = this.surfaceY[sp];
  // flatten a clearing
  for (var cx3 = sp - 25; cx3 <= sp + 25; cx3++) {
    if (cx3 < 0 || cx3 >= W) continue;
    var target = this.surfaceY[cx3];
    var edgeBlend = clamp((25 - Math.abs(cx3 - sp)) / 15, 0, 1);
    var clearingY = Math.round(lerp(target, sy2, edgeBlend));
    if (clearingY > target) {
      for (var cutY = target; cutY < clearingY; cutY++) {
        var fi = this.idx(cx3, cutY);
        this.tiles[fi] = T.AIR; this.walls[fi] = WALL.NONE; this.hp[fi] = 0;
      }
    } else if (clearingY < target) {
      for (var fillY = clearingY; fillY <= target; fillY++) {
        var fi2 = this.idx(cx3, fillY);
        this.tiles[fi2] = T.DIRT; this.walls[fi2] = WALL.DIRT; this.hp[fi2] = 20;
      }
    }
    var topI = this.idx(cx3, clearingY);
    this.tiles[topI] = T.GRASS; this.walls[topI] = WALL.DIRT; this.hp[topI] = 20;
    for (var foundationY = clearingY + 1; foundationY <= Math.min(H - 1, clearingY + 12); foundationY++) {
      var foundationI = this.idx(cx3, foundationY);
      if (this.tiles[foundationI] === T.AIR || this.tiles[foundationI] === T.WATER) {
        this.tiles[foundationI] = T.DIRT; this.walls[foundationI] = WALL.DIRT; this.hp[foundationI] = 20;
      }
    }
    this.surfaceY[cx3] = clearingY;
  }
  // --- Trees: faithful port of vanilla GrowTree/GrowPalmTree geometry ---
  // trunk height Next(5,17) (+5 jungle), 20% left / 20% right branch nubs per
  // trunk tile (never same side twice running), base roots per ground, clearance
  // EmptyTileCheck(i-2, i+2), leaf blob only at the top, 1/13 tall-top variant.
  function growTree(tx3, ty3, jungle) {
    var height = 5 + rnd(12) + (jungle ? 5 : 0);
    // EmptyTileCheck(i-2, i+2, ty-height-4, ty-1)
    for (var cy3 = ty3 - height - 4; cy3 < ty3; cy3++) {
      for (var cx3 = tx3 - 2; cx3 <= tx3 + 2; cx3++) {
        if (!self.inBounds(cx3, cy3) || self.tiles[self.idx(cx3, cy3)] !== T.AIR) return false;
      }
    }
    var topY = ty3 - height;
    var lastL = false, lastR = false;
    for (var ty4 = ty3 - 1; ty4 >= topY; ty4--) {
      self.tiles[self.idx(tx3, ty4)] = T.TREETRUNK;
      if (ty4 !== ty3 - 1 && ty4 !== topY) {
        var roll = rnd(10);
        if (roll === 5 || roll === 7) {
          if (!lastL) self.tiles[self.idx(tx3 - 1, ty4)] = T.TREETRUNK;
          lastL = true;
        } else lastL = false;
        if (roll === 6 || roll === 7) {
          if (!lastR) self.tiles[self.idx(tx3 + 1, ty4)] = T.TREETRUNK;
          lastR = true;
        } else lastR = false;
      }
    }
    // base roots, per ground neighbors (vanilla num8 logic)
    var groundL = self.inBounds(tx3 - 1, ty3) && self.tiles[self.idx(tx3 - 1, ty3)] !== T.AIR;
    var groundR = self.inBounds(tx3 + 1, ty3) && self.tiles[self.idx(tx3 + 1, ty3)] !== T.AIR;
    var roots = rnd(3); // 0 both, 1 right, 2 left
    if (!groundL) roots = groundR ? 1 : 3;
    else if (!groundR) roots = 2;
    if (roots === 0 || roots === 1) self.tiles[self.idx(tx3 + 1, ty3 - 1)] = T.TREETRUNK;
    if (roots === 0 || roots === 2) self.tiles[self.idx(tx3 - 1, ty3 - 1)] = T.TREETRUNK;
    // leaf blob at the top (12/13 standard, 1/13 tall), colored by biome
    var leafTile = T.LEAVES;
    var gt = self.tiles[self.idx(tx3, ty3)];
    if (gt === T.CORRUPTGRASS) leafTile = T.LEAVES_CORRUPT;
    else if (gt === T.CRIMGRASS) leafTile = T.LEAVES_CRIMSON;
    else if (gt === T.HALLOWGRASS) leafTile = T.LEAVES_HALLOW;
    else if (gt === T.JUNGLEGRASS) leafTile = T.LEAVES_JUNGLE;
    var rows = [[-1, 1, topY - 2], [-2, 2, topY - 1], [-2, 2, topY], [-1, 1, topY + 1]];
    if (Math.floor(rng() * 13) === 0) rows = [[0, 0, topY - 4], [-1, 1, topY - 3], [-1, 1, topY - 2], [-2, 2, topY - 1], [-2, 2, topY]];
    for (var rr2 = 0; rr2 < rows.length; rr2++) {
      for (var lx2 = rows[rr2][0]; lx2 <= rows[rr2][1]; lx2++) {
        var lx3 = tx3 + lx2, ly3 = rows[rr2][2];
        if (self.inBounds(lx3, ly3) && self.tiles[self.idx(lx3, ly3)] === T.AIR) self.tiles[self.idx(lx3, ly3)] = leafTile;
      }
    }
    return true;
  }
  // Boreal pine (snow biome): layered triangular silhouette
  function growPine(tx3, ty3) {
    var height = 9 + rnd(8);
    for (var cy4 = ty3 - height - 3; cy4 < ty3; cy4++) {
      for (var cx4 = tx3 - 4; cx4 <= tx3 + 4; cx4++) {
        if (!self.inBounds(cx4, cy4) || self.tiles[self.idx(cx4, cy4)] !== T.AIR) return false;
      }
    }
    var topY = ty3 - height;
    var widths = [1, 1, 3, 3, 5, 5, 7, 7];
    var ri3 = 0;
    for (var py3 = topY; py3 < ty3; py3++) {
      var w4 = widths[Math.min(widths.length - 1, ri3)];
      for (var px3 = tx3 - Math.floor(w4 / 2); px3 <= tx3 + Math.floor(w4 / 2); px3++) {
        if (self.tiles[self.idx(px3, py3)] === T.AIR) self.tiles[self.idx(px3, py3)] = T.LEAVES;
      }
      if (ri3 % 2 === 1) self.tiles[self.idx(tx3, py3)] = T.TREETRUNK; // wood shows between layers
      ri3++;
    }
    self.tiles[self.idx(tx3, ty3 - 1)] = T.TREETRUNK;
    return true;
  }
  // Palm (ocean beaches): tall bare trunk, frond fan, drooping tips
  function growPalm(tx3, ty3) {
    var height = 7 + rnd(7);
    for (var cy5 = ty3 - height - 3; cy5 < ty3; cy5++) {
      for (var cx5 = tx3 - 3; cx5 <= tx3 + 3; cx5++) {
        if (!self.inBounds(cx5, cy5) || self.tiles[self.idx(cx5, cy5)] !== T.AIR) return false;
      }
    }
    var topY = ty3 - height;
    for (var py4 = topY; py4 < ty3; py4++) self.tiles[self.idx(tx3, py4)] = T.TREETRUNK;
    var fronds = [[-2, 2, topY - 1], [-1, 1, topY - 2], [-2, -2, topY], [2, 2, topY]];
    for (var fr = 0; fr < fronds.length; fr++) {
      for (var fx2 = fronds[fr][0]; fx2 <= fronds[fr][1]; fx2++) {
        var fx3 = tx3 + fx2, fy3 = fronds[fr][2];
        if (self.inBounds(fx3, fy3) && self.tiles[self.idx(fx3, fy3)] === T.AIR) self.tiles[self.idx(fx3, fy3)] = T.LEAVES;
      }
    }
    return true;
  }
  // Placement pass: forest/jungle trees, snow pines, beach palms
  // (late grass pass first — vanilla regrows surface grass after caves)
  for (var gx3 = 4; gx3 < W - 4; gx3++) {
    var gb = biomeAtX(gx3);
    var gi2 = this.idx(gx3, this.surfaceY[gx3]);
    if (this.tiles[gi2] !== T.DIRT) continue;
    if (gb === BIOME.FOREST) this.tiles[gi2] = T.GRASS;
    else if (gb === BIOME.JUNGLE || gb === BIOME.MUSHROOM) this.tiles[gi2] = gb === BIOME.JUNGLE ? T.JUNGLEGRASS : T.GRASS;
    else if (gb === BIOME.SNOW) this.tiles[gi2] = T.SNOW;
    else if (gb === BIOME.CORRUPT) this.tiles[gi2] = T.CORRUPTGRASS;
    else if (gb === BIOME.CRIMSON) this.tiles[gi2] = T.CRIMGRASS;
    else if (gb === BIOME.HALLOW) this.tiles[gi2] = T.HALLOWGRASS;
  }
  for (var tx2 = 4; tx2 < W - 4; tx2++) {
    var b3 = biomeAtX(tx2);
    var sy = this.surfaceY[tx2];
    var ground = this.tiles[this.idx(tx2, sy)];
    if (b3 === BIOME.OCEAN) {
      if (ground === T.SAND && rng() < 0.25) { if (growPalm(tx2, sy)) tx2 += 2; }
      continue;
    }
    if (b3 === BIOME.SNOW) {
      if (ground === T.SNOW && rng() < 0.3) { if (growPine(tx2, sy)) tx2 += 2; }
      continue;
    }
    if (b3 !== BIOME.FOREST && b3 !== BIOME.JUNGLE && b3 !== BIOME.CORRUPT && b3 !== BIOME.CRIMSON && b3 !== BIOME.HALLOW) continue;
    var jungle2 = b3 === BIOME.JUNGLE;
    if (ground !== T.GRASS && ground !== T.JUNGLEGRASS && ground !== T.CORRUPTGRASS && ground !== T.CRIMGRASS && ground !== T.HALLOWGRASS) continue;
    if (rng() < (jungle2 ? 0.45 : 0.35)) {
      if (growTree(tx2, sy, jungle2)) tx2 += 2;
    }
  }
  // clear trees near spawn
  for (var cx4 = sp - 30; cx4 <= sp + 30; cx4++) {
    if (cx4 < 0 || cx4 >= W) continue;
    for (var cy4 = Math.max(1, this.surfaceY[cx4] - 48); cy4 < this.surfaceY[cx4]; cy4++) {
      var si = this.idx(cx4, cy4);
      if (this.tiles[si] === T.WOOD || this.tiles[si] === T.TREETRUNK || this.tiles[si] === T.LEAVES) { this.tiles[si] = T.AIR; this.hp[si] = 0; }
    }
  }

  this.spawnX = sp * TILE + 8;
  this.spawnY = this.surfaceY[sp] * TILE - 16;
  var guideTile = clamp(sp + 2, 0, W - 1);
  this.guidePos = { x:guideTile * TILE + 8, y:this.surfaceY[guideTile] * TILE - 16 };
  // keep spawn in plain forest (no mushroom patches)
  for (var sc = sp - 40; sc <= sp + 40; sc++) {
    if (sc >= 0 && sc < W) this.mushroomAt[sc] = 0;
  }
  for (var sg = sp - 20; sg <= sp + 20; sg++) {
    if (sg < 0 || sg >= W) continue;
    var gi = this.idx(sg, this.surfaceY[sg]);
    if (this.tiles[gi] === T.MUSHROOM) { this.tiles[gi] = T.GRASS; this.hp[gi] = 20; }
  }
  this.rebuildLights();

  // Set full HP for all solid tiles
  for (var i = 0; i < this.tiles.length; i++) {
    var tt = this.tiles[i];
    if (tt !== T.AIR) {
      var hh = TILE_HARD[tt];
      this.hp[i] = hh ? hh[1] : 40;
    }
  }
};

// Fill tile HP for freshly generated content
World.prototype.postGenHp = function() {
  for (var i = 0; i < this.tiles.length; i++) {
    var tt = this.tiles[i];
    if (tt !== T.AIR) {
      var hh = TILE_HARD[tt];
      this.hp[i] = hh ? hh[1] : 40;
    }
  }
};

// Inject hardmode ores into the existing world (called when Wall of Flesh dies)
World.prototype.startHardmode = function() {
  var W = this.W, H = this.H;
  var rng = this.rng;
  this.hardmode = true;
  // Activate the surface Hallow band only after the Wall of Flesh.
  for (var hx = Math.floor(W * 0.72); hx < Math.floor(W * 0.78); hx++) {
    var hsurf = this.surfaceY[hx];
    var hi = this.idx(hx, hsurf);
    if (this.tiles[hi] === T.GRASS || this.tiles[hi] === T.DIRT) this.tiles[hi] = T.HALLOWGRASS;
    for (var hy = hsurf + 1; hy < Math.min(this.hellY, hsurf + 55); hy++) {
      var hdi = this.idx(hx, hy);
      if (this.tiles[hdi] === T.STONE) this.tiles[hdi] = T.PEARLSTONE;
    }
  }
  // Convert shallow demonite/titanium-adjacent stone into hardmode ores,
  // and spread cobalt/mythril/adamantite deeper down.
  var count = 0;
  for (var oy = 0; oy < H; oy++) {
    for (var ox = 0; ox < W; ox++) {
      var st = this.surfaceY[ox];
      var i4 = this.idx(ox, oy);
      var t4 = this.tiles[i4];
      if (t4 !== T.STONE && t4 !== T.EBONSTONE && t4 !== T.PEARLSTONE && t4 !== T.CRIMSTONE) continue;
      var depth = oy - st;
      if (depth < 60) continue;
      var r = rng();
      if (depth > 235) {
        if (r < 0.05) this.tiles[i4] = T.ADAMANTITE;
        else if (r < 0.09) this.tiles[i4] = T.TITANIUM;
        else if (r < 0.16) this.tiles[i4] = T.PALLADIUM;
        else if (r < 0.24) this.tiles[i4] = T.GLOWSTONE;
        else if (r < 0.30) this.tiles[i4] = T.COBALT;
      } else if (depth > 170) {
        if (r < 0.10) this.tiles[i4] = T.MYTHRIL;
        else if (r < 0.18) this.tiles[i4] = T.ORICHALCUM;
        else if (r < 0.26) this.tiles[i4] = T.COBALT;
        else if (r < 0.34) this.tiles[i4] = T.PALLADIUM;
      } else if (depth > 110) {
        if (r < 0.12) this.tiles[i4] = T.COBALT;
        else if (r < 0.21) this.tiles[i4] = T.ORICHALCUM;
      }
      if (this.tiles[i4] !== t4) count++;
    }
  }
  // Chlorophyte: grows in deep jungle mud
  for (var coy = 0; coy < H; coy++) {
    for (var cox = 0; cox < W; cox++) {
      var i5 = this.idx(cox, coy);
      if (this.tiles[i5] !== T.MUD) continue;
      var cdepth = coy - this.surfaceY[cox];
      if (cdepth > 90 && rng() < 0.025) this.tiles[i5] = T.CHLOROPHYTE;
    }
  }
  // Hardmode biome spread: carve the evil/Hallow V and seed the spread frontier
  this.carveVSpread();
  this.seedSpreadFrontier();
  this.postGenHp();
  this.dirty = true;
  return count;
};

// Open the Dungeon gate (called when Skeletron is defeated)
World.prototype.openDungeon = function() {
  if (this.dungeonOpen) return;
  this.dungeonOpen = true;
  for (var i = 0; i < this.dungeonDoors.length; i++) {
    var d = this.dungeonDoors[i];
    var di = this.idx(d.x, d.y);
    this.tiles[di] = T.AIR; this.hp[di] = 0;
  }
  this.dirty = true;
};

// Drop a meteor crater onto the surface (called when an evil boss is defeated)
World.prototype.spawnMeteor = function() {
  var W = this.W, H = this.H, rng = this.rng;
  var mx0 = Math.floor(W * (0.20 + rng() * 0.6));
  if (mx0 < W * 0.30 || mx0 > W * 0.72) mx0 = Math.floor(W * 0.5 + rng() * 0.1);
  var ms = this.surfaceY[mx0];
  var mr = 4 + Math.floor(rng() * 3);
  for (var cdy = ms - mr; cdy <= ms + mr + 3; cdy++) {
    for (var cdx = mx0 - mr - 2; cdx <= mx0 + mr + 2; cdx++) {
      if (!this.inBounds(cdx, cdy)) continue;
      var cdd = (cdx - mx0) * (cdx - mx0) + (cdy - ms) * (cdy - ms);
      if (cdd > (mr + 2) * (mr + 2)) continue;
      var ci = this.idx(cdx, cdy);
      this.tiles[ci] = T.AIR; this.walls[ci] = WALL.CAVE; this.hp[ci] = 0;
    }
  }
  for (var mdy = ms - mr + 1; mdy <= ms + 1; mdy++) {
    for (var mdx = mx0 - mr + 1; mdx <= mx0 + mr - 1; mdx++) {
      if (!this.inBounds(mdx, mdy)) continue;
      if (Math.abs(mdx - mx0) + Math.abs(mdy - ms) <= mr - 1 && this.tiles[this.idx(mdx, mdy)] === T.AIR) {
        if (rng() < 0.75) {
          var mi = this.idx(mdx, mdy);
          this.tiles[mi] = T.METEORITE; this.walls[mi] = WALL.NONE;
          var hh = TILE_HARD[T.METEORITE];
          this.hp[mi] = hh ? hh[1] : 90;
        }
      }
    }
  }
  this.meteorCraters.push({ x: mx0, y: ms, r: mr });
  this.dirty = true;
  return { x: mx0 * TILE, y: ms * TILE };
};

// Spawn a small vein of a hardmode ore around a world tile (used when an Altar is smashed).
// Alternates between the matching ore tiers. Returns the tile count placed.
World.prototype.spawnOreVein = function(tx, ty, ore) {
  var W = this.W, H = this.H, rng = this.rng;
  var placed = 0;
  var tries = 46;
  for (var i = 0; i < tries; i++) {
    var ox = tx + Math.floor((rng() - 0.5) * 22);
    var oy = ty + Math.floor((rng() - 0.5) * 22);
    if (!this.inBounds(ox, oy)) continue;
    var oi = this.idx(ox, oy);
    var ot = this.tiles[oi];
    if (ot !== T.STONE && ot !== T.EBONSTONE && ot !== T.PEARLSTONE && ot !== T.CRIMSTONE && ot !== T.MUD) continue;
    this.tiles[oi] = ore;
    var hh2 = TILE_HARD[ore];
    this.hp[oi] = hh2 ? hh2[1] : 70;
    placed++;
  }
  this.dirty = true;
  return placed;
};

// ---------- Hardmode biome spread ----------
World.prototype.isSpreading = function(t) {
  return t === T.EBONSTONE || t === T.CRIMSTONE || t === T.PEARLSTONE;
};

World.prototype.isSpreadConvertible = function(t) {
  return t === T.STONE || t === T.DIRT || t === T.EBONSTONE || t === T.CRIMSTONE || t === T.PEARLSTONE;
};

World.prototype.hasConvertibleNeighbor = function(idx) {
  var tx = idx % this.W, ty = (idx / this.W) | 0;
  var self = this;
  function ck(nx, ny) {
    if (nx < 0 || nx >= self.W || ny < 0 || ny >= self.H) return false;
    if (ny >= self.hellY) return false; // never spreads into the Underworld
    return self.isSpreadConvertible(self.tiles[self.idx(nx, ny)]);
  }
  return ck(tx + 1, ty) || ck(tx - 1, ty) || ck(tx, ty + 1) || ck(tx, ty - 1);
};

// Convert a single stone/dirt tile to a spreading tile (V-carve helper).
World.prototype.vConvert = function(x, y, target) {
  if (!this.inBounds(x, y)) return;
  var i = this.idx(x, y);
  var t = this.tiles[i];
  if (t === T.STONE || t === T.DIRT) {
    this.tiles[i] = target;
    this.hp[i] = (TILE_HARD[target] || [0, 60])[1];
  }
};

// Carve the classic hardmode "V": one diagonal arm of the world's evil, the other of Hallow,
// running from the lower caverns down to the Underworld ceiling.
World.prototype.carveVSpread = function() {
  var W = this.W;
  var cx = Math.floor(W / 2);
  var topY = this.surfaceY[cx] + 55;
  if (topY > this.hellY - 60) topY = Math.max(this.surfaceY[cx] + 20, this.hellY - 60);
  var botY = this.hellY - 4;
  if (botY <= topY) return;
  var hallow = T.PEARLSTONE;
  var evil = this.evil === 'crimson' ? T.CRIMSTONE : T.EBONSTONE;
  var evilLeft = this.rng() < 0.5;
  var half = 6;
  for (var y = topY; y < botY; y++) {
    var t = (y - topY) / (botY - topY);
    var off = Math.round(t * (W * 0.28));
    var lx = cx - off, rx = cx + off;
    for (var dx = -half; dx <= half; dx++) {
      this.vConvert(lx + dx, y, evilLeft ? evil : hallow);
      this.vConvert(rx + dx, y, evilLeft ? hallow : evil);
    }
  }
  this.dirty = true;
};

// Build the spread frontier from every existing evil/Hallow tile with a convertible neighbor.
World.prototype.seedSpreadFrontier = function() {
  this.spreadFrontier = [];
  for (var i = 0; i < this.tiles.length; i++) {
    if (!this.isSpreading(this.tiles[i])) continue;
    if (this.hasConvertibleNeighbor(i)) this.spreadFrontier.push(i);
  }
};

// Convert a few frontier tiles into neighboring stone/dirt (evil or Hallow, whichever owns the tile).
World.prototype.spreadTick = function() {
  if (!this.spreadFrontier || this.spreadFrontier.length === 0) return 0;
  var converted = 0;
  var tries = 0;
  var maxTries = Math.min(this.spreadFrontier.length, 60);
  var dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
  while (converted < SPREAD_TICK_MAX && tries < maxTries) {
    tries++;
    var ri = (Math.random() * this.spreadFrontier.length) | 0;
    var idx = this.spreadFrontier[ri];
    this.spreadFrontier[ri] = this.spreadFrontier[this.spreadFrontier.length - 1];
    this.spreadFrontier.pop();
    var t = this.tiles[idx];
    if (!this.isSpreading(t)) continue;
    var tx = idx % this.W, ty = (idx / this.W) | 0;
    if (ty >= this.hellY) continue;
    for (var s = dirs.length - 1; s > 0; s--) {
      var sw = Math.floor(Math.random() * (s + 1));
      var tmp = dirs[s]; dirs[s] = dirs[sw]; dirs[sw] = tmp;
    }
    var madeOne = false;
    for (var d2 = 0; d2 < 4 && !madeOne; d2++) {
      var nx = tx + dirs[d2][0], ny = ty + dirs[d2][1];
      if (nx < 0 || nx >= this.W || ny < 0 || ny >= this.H) continue;
      if (ny >= this.hellY) continue;
      var ni = this.idx(nx, ny);
      if (!this.isSpreadConvertible(this.tiles[ni])) continue;
      if (this.tiles[ni] === t) continue; // no-op churn on already-spread neighbors
      this.tiles[ni] = t;
      var hh = TILE_HARD[t];
      this.hp[ni] = hh ? hh[1] : 60;
      this.spreadFrontier.push(ni);
      madeOne = true;
      converted++;
    }
    if (madeOne && this.hasConvertibleNeighbor(idx)) this.spreadFrontier.push(idx);
  }
  if (converted > 0) this.dirty = true;
  return converted;
};
