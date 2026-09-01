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
  this.hellY = Math.floor(height * 0.82); // tile row where the Underworld begins
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
      t === T.TREETRUNK || t === T.LEAVES ||
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
      ty >= this.dungeonRect.y0 && ty <= this.dungeonRect.y1) return BIOME.DUNGEON;
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

  var baseY = Math.floor(H * 0.42);

  // Surface height
  for (var x = 0; x < W; x++) {
    var h = baseY
      + n1(x * 0.012) * 9
      + n2(x * 0.025) * 3
      + Math.sin(x * 0.035) * 2;
    this.surfaceY[x] = Math.floor(h);
  }

  // Biome assignment by x
  function biomeAtX(x) {
    var f = x / W;
    if (f < 0.09) return BIOME.OCEAN;
    if (f < 0.30) return isCrimson ? BIOME.CRIMSON : BIOME.CORRUPT;
    if (f < 0.40) return BIOME.FOREST;
    if (f < 0.50) return BIOME.SNOW;
    if (f < 0.56) return BIOME.DESERT;
    if (f < 0.72) return BIOME.FOREST;
    if (f < 0.78) return hardmode ? BIOME.HALLOW : BIOME.FOREST;
    if (f < 0.88) return BIOME.JUNGLE;
    if (f < 0.94) return isCrimson ? BIOME.CRIMSON : BIOME.CORRUPT;
    return BIOME.OCEAN;
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

  // Fill terrain
  var hellY = this.hellY;
  for (x = 0; x < W; x++) {
    var surf = this.surfaceY[x];
    var b = this.mushroomAt[x] === 1 ? BIOME.MUSHROOM : biomeAtX(x);
    var dirtDepth = 10 + Math.floor(rng() * 12);
    for (var y = 0; y < H; y++) {
      var idx = this.idx(x, y);
      if (y >= hellY) { this.tiles[idx] = T.ASH; this.walls[idx] = WALL.STONE; continue; }
      if (y < surf) { this.tiles[idx] = T.AIR; this.walls[idx] = WALL.NONE; continue; }
      if (b === BIOME.OCEAN) {
        if (y < surf + 10) { this.tiles[idx] = T.WATER; this.walls[idx] = WALL.NONE; }
        else if (y < surf + 14) { this.tiles[idx] = T.SAND; this.walls[idx] = WALL.DIRT; }
        else { this.tiles[idx] = T.STONE; this.walls[idx] = WALL.STONE; }
        continue;
      }
      if (y === surf) {
        if (b === BIOME.CORRUPT) this.tiles[idx] = T.CORRUPTGRASS;
        else if (b === BIOME.HALLOW) this.tiles[idx] = T.HALLOWGRASS;
        else if (b === BIOME.JUNGLE) this.tiles[idx] = T.JUNGLEGRASS;
        else if (b === BIOME.MUSHROOM) this.tiles[idx] = T.MUSHROOM;
        else if (b === BIOME.SNOW) this.tiles[idx] = T.SNOW;
        else if (b === BIOME.DESERT) this.tiles[idx] = T.SAND;
        else if (b === BIOME.CRIMSON) this.tiles[idx] = T.CRIMGRASS;
        else this.tiles[idx] = T.GRASS;
      } else if (b === BIOME.SNOW && y < surf + 5) {
        this.tiles[idx] = T.ICE;
      } else if (b === BIOME.DESERT && y < surf + dirtDepth) {
        this.tiles[idx] = T.SAND;
      } else if (y < surf + dirtDepth) {
        this.tiles[idx] = (b === BIOME.JUNGLE || b === BIOME.MUSHROOM) ? T.MUD : T.DIRT;
      } else {
        this.tiles[idx] = T.STONE;
      }
      // background walls
      if (y < surf + dirtDepth + 6) this.walls[idx] = WALL.DIRT;
      else this.walls[idx] = WALL.STONE;
    }
  }

  // Convert deep stone in corrupt/hallow/crimson biomes
  for (x = 0; x < W; x++) {
    var b2 = biomeAtX(x);
    if (b2 === BIOME.CORRUPT || b2 === BIOME.HALLOW || b2 === BIOME.CRIMSON) {
      var s = this.surfaceY[x];
      var swap = b2 === BIOME.CORRUPT ? T.EBONSTONE : (b2 === BIOME.HALLOW ? T.PEARLSTONE : T.CRIMSTONE);
      for (var y = s; y < Math.min(H, s + 220); y++) {
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
    for (var y = sj + 14; y < Math.min(H, sj + 200); y++) {
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
    var start = sd + 8 + Math.floor(rng() * 4);
    this.underDesertStart[x] = start;
    this.underDesertCols[x] = 1;
    var depth = 34 + Math.floor(rng() * 26);
    for (var y = start; y < Math.min(H - 1, start + depth); y++) {
      var iud = this.idx(x, y);
      if (this.tiles[iud] === T.STONE || this.tiles[iud] === T.DIRT || this.tiles[iud] === T.SAND) {
        this.tiles[iud] = T.SAND;
      }
    }
  }

  // Underground snow: deep ice below the snow surface
  this.underSnowCols = new Uint8Array(W);
  for (x = 0; x < W; x++) {
    if (biomeAtX(x) !== BIOME.SNOW) continue;
    if (this.mushroomAt[x] === 1) continue;
    var ss = this.surfaceY[x];
    this.underSnowCols[x] = 1;
    var sDepth = 30 + Math.floor(rng() * 20);
    for (var y = ss + 8; y < Math.min(H - 1, ss + sDepth); y++) {
      var ius = this.idx(x, y);
      if (ius >= 0 && ius < this.tiles.length) {
        var cur = this.tiles[ius];
        if (cur === T.STONE || cur === T.DIRT || cur === T.ICE || cur === T.SNOW) {
          this.tiles[ius] = (rng() < 0.7) ? T.ICE : T.SNOW;
        }
      }
    }
  }

  // Random-walk caves
  var tunnels = 90;
  for (var t = 0; t < tunnels; t++) {
    var cx = Math.floor(rng() * W);
    var cy = this.surfaceY[cx] + 8 + Math.floor(rng() * (H - this.surfaceY[cx] - 20));
    var dir = rng() * Math.PI * 2;
    var len = 35 + Math.floor(rng() * 105);
    for (var s = 0; s < len; s++) {
      dir += (rng() - 0.5) * 1.1;
      cx += Math.cos(dir) * 1.5;
      cy += Math.sin(dir) * 1.2 + 0.06;
      var rw = 2 + Math.floor(rng() * 2.5);
      for (var dx = -rw; dx <= rw; dx++) {
        for (var dy = -rw; dy <= rw; dy++) {
          var tx = Math.floor(cx) + dx, ty = Math.floor(cy) + dy;
          if (tx < 1 || tx >= W - 1 || ty < 1 || ty >= H - 1) continue;
          if (dx * dx + dy * dy > rw * rw) continue;
          if (ty < this.surfaceY[tx] + 14) continue;
          var ii = this.idx(tx, ty);
          if (this.tiles[ii] !== T.AIR && this.tiles[ii] !== T.WATER && this.tiles[ii] !== T.LAVA && this.tiles[ii] !== T.SHIMMER) {
            this.tiles[ii] = T.AIR;
            this.walls[ii] = (rng() < 0.4) ? WALL.CAVE : 0;
          }
        }
      }
    }
  }

  // Cave noise (organic pockets) deeper down
  for (var cy2 = 0; cy2 < H; cy2++) {
    for (var cx2 = 0; cx2 < W; cx2++) {
      var surfY = this.surfaceY[cx2];
      if (cy2 < surfY + 18) continue;
      var nv = nCave(cx2 * 0.025, cy2 * 0.03);
      var threshold = 0.42 + (cy2 / H) * 0.30;
      if (nv > threshold && cy2 > surfY + 12) {
        var i3 = this.idx(cx2, cy2);
        if (this.tiles[i3] !== T.AIR) { this.tiles[i3] = T.AIR; this.walls[i3] = 0; }
      }
    }
  }

  // Ores (pre-hardmode: copper/iron/silver/gold/demonite; hardmode: cobalt+)
  for (var oy = 0; oy < H; oy++) {
    for (var ox = 0; ox < W; ox++) {
      var st = this.surfaceY[ox];
      var i4 = this.idx(ox, oy);
      var t4 = this.tiles[i4];
      if (t4 !== T.STONE && t4 !== T.EBONSTONE && t4 !== T.PEARLSTONE && t4 !== T.CRIMSTONE) continue;
      var depth = oy - st;
      var r = rng();
      if (hardmode) {
        if (depth > 235) {
          if (r < 0.05) this.tiles[i4] = T.ADAMANTITE;
          else if (r < 0.09) this.tiles[i4] = T.TITANIUM;
          else if (r < 0.16) this.tiles[i4] = T.PALLADIUM;
          else if (r < 0.24) this.tiles[i4] = T.GLOWSTONE;
          else if (r < 0.30) this.tiles[i4] = T.PLATINUM;
          else if (r < 0.36) this.tiles[i4] = T.GOLD;
          else if (r < 0.44) this.tiles[i4] = T.IRON;
        } else if (depth > 170) {
          if (r < 0.09) this.tiles[i4] = T.MYTHRIL;
          else if (r < 0.16) this.tiles[i4] = T.ORICHALCUM;
          else if (r < 0.22) this.tiles[i4] = T.PALLADIUM;
          else if (r < 0.27) this.tiles[i4] = T.SILVER;
          else if (r < 0.32) this.tiles[i4] = T.TUNGSTEN;
          else if (r < 0.40) this.tiles[i4] = T.IRON;
        } else if (depth > 110) {
          if (r < 0.11) this.tiles[i4] = T.COBALT;
          else if (r < 0.19) this.tiles[i4] = T.ORICHALCUM;
          else if (r < 0.24) this.tiles[i4] = T.SILVER;
          else if (r < 0.28) this.tiles[i4] = T.TUNGSTEN;
          else if (r < 0.34) this.tiles[i4] = T.IRON;
        } else if (depth > 50) {
          if (r < 0.06) this.tiles[i4] = T.SILVER;
          else if (r < 0.09) this.tiles[i4] = T.TUNGSTEN;
          else if (r < 0.15) this.tiles[i4] = T.LEAD;
          else if (r < 0.24) this.tiles[i4] = T.COPPER;
          else if (r < 0.28) this.tiles[i4] = T.TIN;
          else if (r < 0.36) this.tiles[i4] = T.IRON;
        } else {
          if (r < 0.08) this.tiles[i4] = T.COPPER;
          else if (r < 0.12) this.tiles[i4] = T.TIN;
          else if (r < 0.19) this.tiles[i4] = T.IRON;
          else if (r < 0.24) this.tiles[i4] = T.LEAD;
        }
      } else {
        // Pre-hardmode ores
        if (isCrimson && t4 === T.CRIMSTONE && depth > 40) {
          if (r < 0.06) this.tiles[i4] = T.CRIMTANE;
          else if (r < 0.10) this.tiles[i4] = T.IRON;
        } else if (!isCrimson && t4 === T.EBONSTONE && depth > 40) {
          if (r < 0.06) this.tiles[i4] = T.DEMONITE;
          else if (r < 0.10) this.tiles[i4] = T.IRON;
        } else if (depth > 160) {
          if (r < 0.05) this.tiles[i4] = T.GOLD;
          else if (r < 0.07) this.tiles[i4] = T.PLATINUM;
          else if (r < 0.14) this.tiles[i4] = T.SILVER;
          else if (r < 0.18) this.tiles[i4] = T.TUNGSTEN;
          else if (r < 0.26) this.tiles[i4] = T.IRON;
        } else if (depth > 70) {
          if (r < 0.06) this.tiles[i4] = T.SILVER;
          else if (r < 0.09) this.tiles[i4] = T.TUNGSTEN;
          else if (r < 0.15) this.tiles[i4] = T.LEAD;
          else if (r < 0.24) this.tiles[i4] = T.COPPER;
          else if (r < 0.28) this.tiles[i4] = T.TIN;
          else if (r < 0.36) this.tiles[i4] = T.IRON;
        } else {
          if (r < 0.08) this.tiles[i4] = T.COPPER;
          else if (r < 0.12) this.tiles[i4] = T.TIN;
          else if (r < 0.19) this.tiles[i4] = T.IRON;
          else if (r < 0.24) this.tiles[i4] = T.LEAD;
        }
      }
    }
  }

  // Chlorophyte: grows in deep jungle mud (hardmode only)
  if (hardmode) {
    for (var coy = 0; coy < H; coy++) {
      for (var cox = 0; cox < W; cox++) {
        var i5 = this.idx(cox, coy);
        if (this.tiles[i5] !== T.MUD) continue;
        var cdepth = coy - this.surfaceY[cox];
        if (cdepth > 90 && rng() < 0.025) this.tiles[i5] = T.CHLOROPHYTE;
      }
    }
  }

  // Cobwebs in caves
  for (var wx = 0; wx < W; wx++) {
    for (var wy = 0; wy < H; wy++) {
      var i5 = this.idx(wx, wy);
      if (this.tiles[i5] === T.AIR && this.walls[i5] === WALL.CAVE && rng() < 0.06) {
        this.tiles[i5] = T.COBWEB;
      }
    }
  }

  // --- Underworld: lava, obsidian, hellbrick ruins, hellstone ---
  var hellY2 = self.hellY;
  var lavaPools = 16;
  for (var lp = 0; lp < lavaPools; lp++) {
    var lpx = 1 + Math.floor(rng() * (W - 2));
    var lpy = hellY2 + 2 + Math.floor(rng() * (H - hellY2 - 4));
    var lr = 2 + Math.floor(rng() * 3);
    for (var dly = -lr - 1; dly <= lr + 1; dly++) {
      for (var dlx = -lr - 1; dlx <= lr + 1; dlx++) {
        var lxx = lpx + dlx, lyy = lpy + dly;
        if (!self.inBounds(lxx, lyy)) continue;
        var dd = dlx * dlx + dly * dly;
        if (dd > (lr + 1) * (lr + 1)) continue;
        var li = self.idx(lxx, lyy);
        if (dd <= (lr - 1) * (lr - 1)) { self.tiles[li] = T.LAVA; }
        else if (dd <= (lr + 1) * (lr + 1)) { self.tiles[li] = T.OBSIDIAN; }
        self.walls[li] = WALL.NONE;
      }
    }
  }
  // bottom lava sea
  for (var bxs = 1; bxs < W - 1; bxs++) {
    for (var bys = H - 4; bys < H - 1; bys++) {
      var bbi = self.idx(bxs, bys);
      self.tiles[bbi] = T.LAVA;
      self.walls[bbi] = WALL.NONE;
    }
  }
  // hellstone + obsidian veins in ash
  for (var hxx = 1; hxx < W - 1; hxx++) {
    for (var hyy = hellY2 + 1; hyy < H - 5; hyy++) {
      var hii = self.idx(hxx, hyy);
      if (self.tiles[hii] !== T.ASH) continue;
      var hr = rng();
      if (hr < 0.012) self.tiles[hii] = T.HELLSTONE;
      else if (hr < 0.02) self.tiles[hii] = T.OBSIDIAN;
    }
  }
  // furnished Underworld houses with Hellforges and locked Shadow Chests
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
  for (var ru = 0; ru < 8; ru++) {
    var rw = 11 + Math.floor(rng() * 6);
    var rh = 7 + Math.floor(rng() * 4);
    var rxx = Math.floor(W * ((ru + 0.35 + rng() * 0.3) / 8));
    rxx = clamp(rxx, 3, W - rw - 3);
    var ryy = hellY2 + 6 + Math.floor(rng() * Math.max(1, H - hellY2 - rh - 15));
    self.underworldHouses.push({ x:rxx, y:ryy, w:rw, h:rh });
    for (var riy = ryy; riy <= ryy + rh; riy++) {
      for (var rix = rxx; rix <= rxx + rw; rix++) {
        var edge = riy === ryy || riy === ryy + rh || rix === rxx || rix === rxx + rw;
        var ri = self.idx(rix, riy);
        self.tiles[ri] = edge ? T.HELLBRICK : T.AIR;
        self.walls[ri] = edge ? WALL.STONE : WALL.CAVE;
      }
    }
    // Open doorway and furnish the carved interior.
    self.tiles[self.idx(rxx, ryy + rh - 1)] = T.AIR;
    self.tiles[self.idx(rxx, ryy + rh - 2)] = T.AIR;
    var floorY = ryy + rh - 1;
    self.tiles[self.idx(rxx + 2, floorY)] = T.TABLE;
    self.tiles[self.idx(rxx + 4, floorY)] = T.CHAIR;
    self.tiles[self.idx(rxx + rw - 2, ryy + 2)] = T.TORCH;
    if (ru % 2 === 0) self.tiles[self.idx(rxx + 6, floorY)] = T.HELLFORGE;
    if (ru % 2 === 1) {
      var scx = rxx + rw - 3, scy = floorY;
      self.tiles[self.idx(scx, scy)] = T.SHADOWCHEST;
      self.chests.push({
        x:scx, y:scy, kind:'shadow', locked:true, key:I.SHADOWKEY,
        inv:[
          { id:shadowLoot[(ru - 1) / 2], count:1 },
          { id:I.HELLSTONEBAR, count:2 + Math.floor(rng() * 4) },
          { id:I.OBSIDIANSKINPOTION, count:1 }
        ]
      });
    }
  }

  // --- Sky islands ---
  self.skyIslands = [];
  var islandCount = 8;
  for (var is = 0; is < islandCount; is++) {
    var ix0 = Math.floor(W * ((is + 0.5 + (rng() - 0.5) * 0.5) / islandCount));
    if (ix0 < 4 || ix0 > W - 4) ix0 = Math.floor(W * 0.5);
    var iy0 = self.surfaceY[ix0] - (34 + Math.floor(rng() * 30));
    if (iy0 < 10) iy0 = 10;
    var ir = 5 + Math.floor(rng() * 4);
    for (var idy = -ir; idy <= ir; idy++) {
      for (var idx2 = -ir; idx2 <= ir; idx2++) {
        var axx = ix0 + idx2, ayy = iy0 + idy;
        if (!self.inBounds(axx, ayy)) continue;
        var idd = idx2 * idx2 + idy * idy;
        if (idd > ir * ir) continue;
        var aii = self.idx(axx, ayy);
        if (idd >= (ir - 2) * (ir - 2)) { self.tiles[aii] = T.CLOUD; }
        else { self.tiles[aii] = T.AIR; }
        self.walls[aii] = WALL.NONE;
      }
    }
    self.skyIslands.push({ x: ix0, y: iy0, w: ir });
    if (rng() < 0.5) {
      var icx = ix0 + Math.floor((rng() - 0.5) * (ir - 1));
      var icy = iy0 - ir - 1;
      if (self.inBounds(icx, icy) && self.get(icx, icy) === T.AIR) {
        self.set(icx, icy, T.CHEST);
        var cInv = [{ id: I.CLOUD, count: 4 + Math.floor(rng() * 4) }];
        if (rng() < 0.7) cInv.push({ id: I.GOLDENHORSESHOE, count: 1 });
        if (rng() < 0.6) cInv.push({ id: I.STARFURY, count: 1 });
        if (rng() < 0.5) cInv.push({ id: I.GEM_DIAMOND, count: 1 });
        self.chests.push({ x: icx, y: icy, inv: cInv });
      }
    }
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
          self.tiles[pii] = (web && rng() < 0.18) ? T.COBWEB : T.AIR;
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
      carvePocket(pcx, pcy, pr, pbi === 1 ? T.GRANITE : (pbi === 2 ? T.MARBLE : T.STONE), pbi === 0);
      var colsArr = pbi === 0 ? self.spiderCols : (pbi === 1 ? self.graniteCols : self.marbleCols);
      for (var mcx = pcx - pr; mcx <= pcx + pr; mcx++) {
        if (mcx >= 0 && mcx < W) colsArr[mcx] = 1;
      }
    }
  }

  // --- Aether (shimmer) pool ---
  {
    var axx2 = Math.floor(W * (0.9 + rng() * 0.04));
    var ayy2 = Math.floor(H * (0.52 + rng() * 0.1));
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

  // --- Dungeon: tall brick tower on the far west edge ---
  {
    var dgx = Math.floor(W * (0.06 + rng() * 0.05));
    var dgw = 20 + Math.floor(rng() * 6);
    var dgTop = Math.max(4, this.surfaceY[dgx] - (3 + Math.floor(rng() * 4)));
    var dgH = 100 + Math.floor(rng() * 40);
    var dgY0 = dgTop;
    this.dungeonRect = { x0: dgx, y0: dgY0, x1: dgx + dgw, y1: Math.min(H - 2, dgY0 + dgH) };
    var doorX = dgx + Math.floor(dgw / 2);
    var ritualX = clamp(dgx + dgw + 3, 2, W - 3);
    this.dungeonEntrance = { x: ritualX * TILE + 8, y: this.surfaceY[ritualX] * TILE - 16 };
    // outer walls + hollow interior
    for (var dyy = dgY0; dyy <= Math.min(H - 2, dgY0 + dgH); dyy++) {
      for (var dxx = dgx; dxx <= dgx + dgw; dxx++) {
        if (!self.inBounds(dxx, dyy)) continue;
        var isWall = dxx <= dgx + 1 || dxx >= dgx + dgw - 1 || dyy <= dgY0 + 1 || dyy >= Math.min(H - 2, dgY0 + dgH);
        var di = self.idx(dxx, dyy);
        // carve a vertical entrance shaft at the top
        var inShaft = dxx >= doorX - 1 && dxx <= doorX + 1 && dyy >= dgY0 && dyy <= dgY0 + 3;
        if (inShaft) {
          self.tiles[di] = T.AIR;
          self.walls[di] = WALL.CAVE;
          continue;
        }
        self.tiles[di] = isWall ? T.DUNGEONBRICK : T.AIR;
        self.walls[di] = isWall ? WALL.STONE : WALL.CAVE;
      }
    }
    // blocked gate in the shaft (opens after Skeletron)
    self.tiles[self.idx(doorX, dgY0)] = T.DUNGEONDOOR;
    self.tiles[self.idx(doorX + 1, dgY0)] = T.DUNGEONDOOR;
    self.tiles[self.idx(doorX, dgY0 + 1)] = T.DUNGEONDOOR;
    self.tiles[self.idx(doorX + 1, dgY0 + 1)] = T.DUNGEONDOOR;
    self.dungeonDoors = [
      { x: doorX, y: dgY0 }, { x: doorX + 1, y: dgY0 },
      { x: doorX, y: dgY0 + 1 }, { x: doorX + 1, y: dgY0 + 1 }
    ];
    // a couple of interior floors (platforms)
    for (var fl = 0; fl < 4; fl++) {
      var fy = dgY0 + 16 + fl * 20;
      if (fy >= dgY0 + dgH - 6) break;
      for (var fxx = dgx + 2; fxx <= dgx + dgw - 2; fxx++) {
        self.tiles[self.idx(fxx, fy)] = T.PLATFORM;
        self.walls[self.idx(fxx, fy)] = WALL.CAVE;
      }
    }
    // interior chests with dungeon loot
    var chestYs = [dgY0 + 10, dgY0 + 28, dgY0 + 46];
    for (var ci = 0; ci < chestYs.length; ci++) {
      var cxx = dgx + 2 + Math.floor(rng() * (dgw - 4));
      var cyy = chestYs[ci];
      if (!self.inBounds(cxx, cyy)) continue;
      if (self.get(cxx, cyy) === T.AIR) {
        self.set(cxx, cyy, T.CHEST);
        var inv = [{ id: I.GOLDENKEY, count: 1 }];
        if (ci === 0) inv.push({ id: I.SHADOWKEY, count: 1 });
        if (rng() < 0.5) inv.push({ id: I.MURAMASA, count: 1 });
        if (rng() < 0.5) inv.push({ id: I.COBALTSHIELD, count: 1 });
        if (rng() < 0.5) inv.push({ id: I.AQUASCEPTER, count: 1 });
        if (rng() < 0.4) inv.push({ id: I.WATERBOLT, count: 1 });
        if (rng() < 0.4) inv.push({ id: I.GEM_DIAMOND, count: 1 });
        if (rng() < 0.4) inv.push({ id: I.GEM_RUBY, count: 1 });
        self.chests.push({ x: cxx, y: cyy, inv: inv });
      }
    }
    // torches along the walls
    for (var dtx = 0; dtx < 6; dtx++) {
      var txx = dgx + 3 + dtx * 3;
      var tyy = dgY0 + 12 + dtx * 10;
      if (tyy >= dgY0 + dgH - 4) break;
      if (self.get(txx, tyy) === T.AIR) self.set(txx, tyy, T.TORCH);
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
    // hollow trunk (3 wide)
    for (var tyyy = lty; tyyy > lty - ltH; tyyy--) {
      for (var txx2 = ltx - 1; txx2 <= ltx + 1; txx2++) {
        if (!self.inBounds(txx2, tyyy)) continue;
        var edge = txx2 === ltx - 1 || txx2 === ltx + 1 || tyyy === lty - ltH + 1;
        self.tiles[self.idx(txx2, tyyy)] = edge ? T.WOOD : T.AIR;
        self.walls[self.idx(txx2, tyyy)] = edge ? WALL.STONE : WALL.CAVE;
      }
    }
    // leaves at the crown
    var crown = lty - ltH + 1;
    for (var ldy = crown - 4; ldy <= crown + 2; ldy++) {
      for (var ldx = ltx - 5; ldx <= ltx + 5; ldx++) {
        if (!self.inBounds(ldx, ldy)) continue;
        var ldist = Math.abs(ldx - ltx) + Math.abs(ldy - crown);
        if (ldist <= 7 && self.tiles[self.idx(ldx, ldy)] === T.AIR) {
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

  // Trees on forest/jungle grass
  for (var tx2 = 4; tx2 < W - 4; tx2++) {
    var b3 = biomeAtX(tx2);
    if (b3 !== BIOME.FOREST && b3 !== BIOME.JUNGLE) continue;
    var sy = this.surfaceY[tx2];
    if (b3 === BIOME.FOREST && this.get(tx2, sy) !== T.GRASS) continue;
    if (b3 === BIOME.JUNGLE && this.get(tx2, sy) !== T.JUNGLEGRASS) continue;
    if (rng() < (b3 === BIOME.JUNGLE ? 0.45 : 0.35)) {
      var th = 5 + Math.floor(rng() * (b3 === BIOME.JUNGLE ? 8 : 4));
      for (var j = 1; j <= th; j++) this.set(tx2, sy - j, T.TREETRUNK);
      var topY = sy - th - 1;
      for (var lx = -2; lx <= 2; lx++) {
        for (var ly = -2; ly <= 1; ly++) {
          var lxx = tx2 + lx, lyy = topY + ly;
          if (this.get(lxx, lyy) === T.AIR && Math.abs(lx) + Math.abs(ly) <= 3) {
            this.set(lxx, lyy, T.LEAVES);
          }
        }
      }
      tx2 += 1;
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

  // Lihzahrd temple: buried in the deep jungle
  {
    var tlx = Math.floor(W * (0.79 + rng() * 0.07));
    var tly = Math.floor(H * 0.78);
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

  // Natural evil chasms with two Orb/Heart chambers each.
  this.evilChasms = [];
  this.evilObjects = [];
  var evilStone = isCrimson ? T.CRIMSTONE : T.EBONSTONE;
  var evilObject = isCrimson ? T.CRIMSONHEART : T.SHADOWORB;
  var chasmFractions = [0.17, 0.245, 0.91];
  for (var ec = 0; ec < chasmFractions.length; ec++) {
    var ecx = Math.floor(W * chasmFractions[ec] + (rng() - 0.5) * 18);
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
  for (var bh = 0; bh < 3; bh++) {
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

  // Heart crystals: 3 in underground
  for (var hc = 0; hc < 3; hc++) {
    var hx = Math.floor(W * (0.25 + rng() * 0.5));
    var hy = this.surfaceY[hx] + 40 + Math.floor(rng() * 60);
    // dig a small pocket
    for (var py = hy - 3; py <= hy + 1; py++) {
      for (var px = hx - 2; px <= hx + 2; px++) {
        var pi = this.idx(px, py);
        if (Math.abs(px - hx) + Math.abs(py - hy) <= 4 && this.tiles[pi] !== T.AIR) {
          this.tiles[pi] = T.AIR; this.walls[pi] = WALL.CAVE;
        }
      }
    }
    this.heartCrystals.push({ x:hx * TILE + 8, y:hy * TILE + 8 });
  }

  // Find spawn point: flat clearing in forest (center forest band)
  var sp = Math.floor(W * 0.60);
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
