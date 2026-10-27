// Original pixel artwork. Presentation only: no world, inventory or physics writes.
// Small, cached canvases keep all source pixels crisp at native tile resolution.
var PixelArt = (function() {
  var terrain = {}, grass = {}, leaves = {}, ores = {}, tileCache = {};
  var actorCache = new Map(), sceneryCache = {}, crownCache = {}, cloudCache = {};
  var wallPalettes = {}, itemCache = {};
  var tintCache = new WeakMap();
  var creatureCache = new Map();
  var OUTLINE = '#242332';

  function surface(w, h) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    c.getContext('2d').imageSmoothingEnabled = false;
    return c;
  }
  function rect(ctx, color, x, y, w, h) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }
  function colors(base) {
    // Equipment dye blending and legacy shade() return rgb(), while item
    // definitions use hex. Normalize both before deriving the sprite ramp.
    var match = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(base);
    var rgb = match ? [Number(match[1]), Number(match[2]), Number(match[3])] : hexToRgb(base);
    return [-42, -20, 0, 19, 39].map(function(delta) {
      return '#' + rgb.map(function(v) { return clamp(v + delta, 0, 255).toString(16).padStart(2, '0'); }).join('');
    });
  }
  function add(keys, palette, kind) {
    keys.split(' ').forEach(function(k) { terrain[T[k]] = { palette: palette, kind: kind }; });
  }
  add('DIRT GRASS HALLOWGRASS CORRUPTGRASS CRIMGRASS JUNGLEGRASS',
    ['#4e302c', '#704632', '#8e5e3e', '#ab7950', '#c19361'], 'soil');
  add('MUD', ['#302e29', '#454130', '#61563a', '#7a6a46', '#8b7e54'], 'soil');
  add('STONE', ['#363847', '#4b4e5d', '#626779', '#777f91', '#929aab'], 'rock');
  add('GRANITE', colors('#51556f'), 'rock');
  add('MARBLE', colors('#c2c7cc'), 'rock');
  add('EBONSTONE', colors('#655077'), 'rock');
  add('CRIMSTONE', colors('#85484f'), 'rock');
  add('PEARLSTONE', colors('#b9a6d0'), 'rock');
  add('OBSIDIAN', colors('#40354f'), 'rock');
  add('ASH', colors('#69616b'), 'soil');
  add('CLAY', colors('#b06d55'), 'soil');
  add('SAND', ['#9d784d', '#b79660', '#d2b579', '#e6cd91', '#f6e5ae'], 'sand');
  add('SANDSTONE', colors('#b89564'), 'rock');
  add('SNOW', ['#7e9cbd', '#a5c3d9', '#cde3ed', '#e6f3f6', '#fafff3'], 'snow');
  add('ICE', ['#527b9f', '#6f9fc0', '#99c9dd', '#bce6ed', '#e3fcf4'], 'ice');
  add('WOOD', colors('#a47c4f'), 'wood');
  add('SPOOKYWOOD', colors('#615369'), 'wood');
  add('GRAYBRICK', colors('#7c8090'), 'brick');
  add('REDBRICK', colors('#a45e51'), 'brick');
  add('DUNGEONBRICK', colors('#6b779b'), 'brick');
  add('HELLBRICK', colors('#884a40'), 'brick');
  add('TEMPLEBRICK', colors('#ac8a51'), 'brick');
  grass[T.GRASS] = ['#28523b', '#3f7b3b', '#66a745', '#9ac957'];
  grass[T.JUNGLEGRASS] = ['#1c4437', '#27683b', '#439c44', '#80bc4a'];
  grass[T.CORRUPTGRASS] = ['#392b56', '#5b3f75', '#8a62a1', '#b391c6'];
  grass[T.CRIMGRASS] = ['#512b3c', '#863a4c', '#bb5965', '#e78487'];
  grass[T.HALLOWGRASS] = ['#65507e', '#9174aa', '#be9ad2', '#ebc3ec'];
  leaves[T.LEAVES] = ['#213d32', '#315b37', '#447c3c', '#67a044', '#9cbd56'];
  leaves[T.LEAVES_JUNGLE] = ['#143b33', '#205b3b', '#34843f', '#57a342', '#8ec74e'];
  leaves[T.LEAVES_CORRUPT] = colors('#76518d');
  leaves[T.LEAVES_CRIMSON] = colors('#b35762');
  leaves[T.LEAVES_HALLOW] = colors('#d59fc5');
  'COPPER TIN IRON LEAD SILVER TUNGSTEN GOLD PLATINUM DEMONITE CRIMTANE METEORITE COBALT PALLADIUM MYTHRIL ORICHALCUM ADAMANTITE TITANIUM CHLOROPHYTE HELLSTONE GLOWSTONE'.split(' ').forEach(function(k) { ores[T[k]] = true; });

  // Seamless interiors: relief belongs on exposed edges, not on every grid cell.
  function tile(t, rng) {
    var def = terrain[t], leaf = leaves[t], ore = ores[t];
    var liquid = t === T.WATER || t === T.LAVA || t === T.HONEY || t === T.SHIMMER;
    var trunk = t === T.TREETRUNK;
    if (!def && !leaf && !ore && !liquid && !trunk) return prop(t);
    var c = surface(TILE, TILE), ctx = c.getContext('2d');
    if (liquid) {
      var lc = t === T.WATER ? '#3c78a9' : t === T.LAVA ? '#e15d32' : t === T.HONEY ? '#c38b30' : '#a484d3';
      ctx.globalAlpha = t === T.WATER || t === T.SHIMMER ? 0.72 : 0.92;
      rect(ctx, lc, 0, 0, TILE, TILE);
      for (var l = 0; l < 3; l++) rect(ctx, shade(lc, 17), rng() * 11, rng() * 15, 3 + rng() * 3, 1);
      return c;
    }
    var pal = leaf || (ore ? terrain[T.STONE].palette : trunk ? colors('#92683e') : def.palette);
    rect(ctx, pal[2], 0, 0, TILE, TILE);
    var kind = leaf ? 'leaf' : trunk ? 'trunk' : ore ? 'ore' : def.kind;
    var count = kind === 'rock' || kind === 'ore' ? 6 : kind === 'leaf' ? 15 : 8;
    for (var i = 0; i < count; i++) {
      var x = Math.floor(rng() * 16), y = Math.floor(rng() * 16);
      var w = 2 + Math.floor(rng() * 5), h = 1 + Math.floor(rng() * 3);
      var pi = rng() < 0.65 ? 1 : 3;
      rect(ctx, pal[pi], x, y, w, h);
      if (kind === 'soil' || kind === 'rock') rect(ctx, pal[pi === 1 ? 0 : 2], x + 1, y + h, Math.max(1, w - 2), 1);
      if (kind === 'leaf') rect(ctx, pal[Math.min(4, pi + 1)], x, y, 2, 1);
    }
    if (kind === 'rock') {
      // Short stepped fissures, not anti-aliased diagonal strokes.
      var ry = 4 + Math.floor(rng() * 7), rx = Math.floor(rng() * 6);
      rect(ctx, pal[1], rx, ry, 5, 1);
      rect(ctx, pal[1], rx + 4, ry + 1, 4, 1);
    } else if (kind === 'wood' || kind === 'trunk') {
      for (var b = 1; b < 16; b += 4) {
        var offset = Math.floor(rng() * 5);
        rect(ctx, pal[1], b, offset, 1, 12);
        rect(ctx, pal[3], b + 1, offset, 1, 9);
      }
      rect(ctx, pal[0], 7, 5, 3, 4); rect(ctx, pal[2], 8, 6, 1, 2);
    } else if (kind === 'brick') {
      for (var by = 0; by < 16; by += 8) {
        rect(ctx, pal[0], 0, by + 7, 16, 1);
        rect(ctx, pal[3], 0, by, 16, 1);
        rect(ctx, pal[1], by === 0 ? 5 : 12, by, 1, 7);
      }
    } else if (kind === 'ice') {
      for (var ic = 0; ic < 3; ic++) rect(ctx, pal[3], 2 + ic * 4, ic * 4, 1, 5);
    } else if (kind === 'ore') {
      var oc = colors(TILE_COLORS[t][0]);
      for (var o = 0; o < 4; o++) {
        var ox = Math.floor(rng() * 11), oy = Math.floor(rng() * 11);
        rect(ctx, oc[0], ox, oy + 1, 5, 4);
        rect(ctx, oc[2], ox + 1, oy, 4, 4);
        rect(ctx, oc[4], ox + 1, oy, 2, 1);
        rect(ctx, oc[3], ox + 1, oy + 1, 1, 2);
      }
    }
    return c;
  }

  // Furniture has actual silhouettes with transparent backgrounds.
  function prop(t) {
    var c = surface(16, 16), ctx = c.getContext('2d'), p = colors('#a47a4a');
    var chest = t === T.CHEST || t === T.SHADOWCHEST || t === T.FURN_CHEST;
    if (t === T.SHADOWCHEST) p = colors('#71568c');
    if (chest) {
      rect(ctx, OUTLINE, 1, 4, 14, 12); rect(ctx, p[1], 2, 5, 12, 10);
      rect(ctx, p[3], 2, 5, 12, 4); rect(ctx, p[0], 2, 9, 12, 2);
      rect(ctx, '#c99c4d', 3, 5, 1, 10); rect(ctx, '#c99c4d', 12, 5, 1, 10);
      rect(ctx, '#f0d581', 7, 8, 3, 4); rect(ctx, '#735235', 8, 9, 1, 2);
    } else if (t === T.PLATFORM || t === T.FURN_PLATFORM || t === T.WORKBENCH || t === T.TABLE || t === T.FURN_TABLE) {
      var py = t === T.PLATFORM || t === T.FURN_PLATFORM ? 0 : 5;
      rect(ctx, p[0], 0, py, 16, 5); rect(ctx, p[3], 0, py, 16, 1);
      rect(ctx, p[2], 1, py + 1, 14, 2);
      rect(ctx, p[0], 2, py + 4, 3, 11 - py); rect(ctx, p[0], 11, py + 4, 3, 11 - py);
      rect(ctx, p[2], 3, py + 4, 1, 10 - py); rect(ctx, p[2], 12, py + 4, 1, 10 - py);
    } else if (t === T.CHAIR || t === T.FURN_CHAIR) {
      rect(ctx, p[0], 3, 1, 3, 15); rect(ctx, p[3], 4, 2, 1, 8);
      rect(ctx, p[0], 3, 10, 10, 3); rect(ctx, p[3], 6, 10, 7, 1);
      rect(ctx, p[0], 10, 12, 3, 4);
    } else if (t === T.FURNACE || t === T.HELLFORGE || t === T.FURN_FURNACE) {
      rect(ctx, '#333342', 2, 2, 12, 14); rect(ctx, '#737382', 3, 3, 10, 12);
      rect(ctx, '#96959d', 4, 2, 8, 2); rect(ctx, '#454351', 0, 14, 16, 2);
      rect(ctx, '#2d2632', 5, 8, 7, 6); rect(ctx, '#b64932', 6, 10, 5, 3);
      rect(ctx, '#ed9c46', 7, 9, 3, 3); rect(ctx, '#ffe8a0', 8, 10, 1, 2);
      rect(ctx, '#9d9c9d', 3, 6, 9, 1);
    } else if (t === T.ANVIL || t === T.FURN_ANVIL) {
      rect(ctx, OUTLINE, 0, 5, 15, 4); rect(ctx, '#9aa5b2', 1, 4, 14, 2);
      rect(ctx, '#5d687c', 4, 7, 8, 3); rect(ctx, '#3e4558', 7, 9, 4, 4);
      rect(ctx, '#7c8797', 4, 13, 10, 2); rect(ctx, OUTLINE, 3, 15, 12, 1);
    } else if (t === T.TORCH || t === T.FURN_TORCH) {
      rect(ctx, '#46342e', 7, 7, 3, 9); rect(ctx, '#a87a4b', 8, 7, 1, 8);
      rect(ctx, '#bf5836', 6, 3, 5, 6); rect(ctx, '#f8ae48', 7, 2, 3, 6);
      rect(ctx, '#ffe5a0', 8, 4, 1, 3);
    } else return null;
    return c;
  }

  function isTerrain(t) { return !!terrain[t] || !!ores[t]; }
  function isLeaf(t) { return !!leaves[t]; }
  function foliageLight(game) {
    var dayX = Math.abs(game.timeOfDay - 0.5) * 2;
    var day = Math.min(1, Math.max(0, (0.62 - dayX) / 0.24));
    var light = 0.32 + 0.68 * day;
    if (game.weather && game.weather.active) light *= 1 - game.weather.intensity * 0.22;
    return light;
  }
  function tint(source, brightness) {
    var level = Math.round(brightness * 8);
    if (level >= 8) return source;
    var variants = tintCache.get(source);
    if (!variants) { variants = {}; tintCache.set(source, variants); }
    if (variants[level]) return variants[level];
    var c = surface(source.width, source.height), ctx = c.getContext('2d');
    ctx.drawImage(source, 0, 0);
    ctx.globalCompositeOperation = 'source-atop';
    rect(ctx, 'rgba(14,22,42,' + (1 - level / 8) + ')', 0, 0, c.width, c.height);
    ctx.globalCompositeOperation = 'source-over';
    variants[level] = c;
    return c;
  }
  // 1 = north, 2 = east, 4 = south, 8 = west. Full tiles join regardless of
  // material so ore seams do not turn into grids; leaves/trunks join their kind.
  function maskAt(world, tx, ty, t) {
    var a = world.tiles, w = world.W, i = ty * w + tx;
    var leaf = !!leaves[t], trunk = t === T.TREETRUNK;
    function joins(n) { return leaf ? !!leaves[n] || n === T.TREETRUNK : trunk ? n === T.TREETRUNK : isTerrain(n); }
    var mask = (ty > 0 && joins(a[i - w]) ? 1 : 0) |
      (tx + 1 < w && joins(a[i + 1]) ? 2 : 0) |
      (ty + 1 < world.H && joins(a[i + w]) ? 4 : 0) |
      (tx > 0 && joins(a[i - 1]) ? 8 : 0);
    // Pine trunks alternate with foliage tiles. Preserve leaves behind the
    // narrowed bark instead of punching rectangular holes through the canopy.
    var backing = trunk ? (tx > 0 && leaves[a[i - 1]] ? a[i - 1] : tx + 1 < w && leaves[a[i + 1]] ? a[i + 1] : 0) : 0;
    return mask | (backing << 8);
  }

  function connected(t, variant, mask, source) {
    if (!isTerrain(t) && !leaves[t] && t !== T.TREETRUNK) return source;
    var key = t + ':' + variant + ':' + mask;
    if (tileCache[key]) return tileCache[key];
    var c = surface(16, 16), ctx = c.getContext('2d');
    ctx.drawImage(source, 0, 0);
    var leaf = leaves[t], gp = grass[t], def = terrain[t];
    var pal = leaf || (def ? def.palette : terrain[T.STONE].palette);
    if (t === T.TREETRUNK) {
      // Thin shafts, attached branch nubs and flared roots, all neighbor-aware.
      ctx.clearRect(0, 0, 16, 16);
      var backing = mask >>> 8;
      if (backing && SPRITES[backing]) ctx.drawImage(SPRITES[backing][variant], 0, 0);
      ctx.drawImage(source, 4, 0, 8, 16, 4, 0, 8, 16);
      rect(ctx, '#4d382e', 4, 0, 1, 16); rect(ctx, '#c09358', 5, 0, 1, 16);
      rect(ctx, '#5e412e', 11, 0, 1, 16);
      if (mask & 8) { rect(ctx, '#61432e', 0, 7, 5, 5); rect(ctx, '#af8046', 0, 7, 5, 2); }
      if (mask & 2) { rect(ctx, '#61432e', 12, 7, 4, 5); rect(ctx, '#af8046', 12, 7, 4, 2); }
      if (!(mask & 1) && !(mask & 4)) { rect(ctx, '#6e4c32', 1, 9, 14, 6); rect(ctx, '#b2884d', 2, 8, 11, 2); }
    } else {
      if (!(mask & 1)) { rect(ctx, pal[0], 0, 0, 16, 2); rect(ctx, pal[3], 1, 2, 14, 1); }
      if (!(mask & 2)) rect(ctx, pal[0], 15, 1, 1, 15);
      if (!(mask & 4)) { rect(ctx, pal[0], 0, 14, 16, 2); rect(ctx, pal[1], 1, 13, 14, 1); }
      if (!(mask & 8)) { rect(ctx, pal[0], 0, 1, 1, 15); rect(ctx, pal[3], 1, 3, 1, 10); }
      if (leaf) {
        // Scallop exposed canopy corners, never cut holes in interior leaves.
        if (!(mask & 1) && !(mask & 8)) { ctx.clearRect(0, 0, 4, 2); ctx.clearRect(0, 2, 2, 2); }
        if (!(mask & 1) && !(mask & 2)) { ctx.clearRect(12, 0, 4, 2); ctx.clearRect(14, 2, 2, 2); }
        if (!(mask & 4) && !(mask & 8)) ctx.clearRect(0, 13, 3, 3);
        if (!(mask & 4) && !(mask & 2)) ctx.clearRect(13, 13, 3, 3);
      }
      if (gp) {
        if (!(mask & 1)) {
          rect(ctx, gp[0], 0, 0, 16, 6); rect(ctx, gp[2], 0, 1, 16, 3); rect(ctx, gp[3], 1, 1, 14, 1);
          for (var g = 0; g < 5; g++) rect(ctx, gp[g % 2 + 1], g * 3, 4, 2, 2 + (variant + g) % 3);
        }
        if (!(mask & 8)) { rect(ctx, gp[0], 0, 2, 3, 14); rect(ctx, gp[2], 0, 2, 1, 12); }
        if (!(mask & 2)) { rect(ctx, gp[0], 13, 2, 3, 14); rect(ctx, gp[1], 15, 3, 1, 12); }
      }
    }
    tileCache[key] = c;
    return c;
  }

  function groundDetails(ctx, world, tx, ty, t, x, y) {
    if (leaves[t] && world.surfaceY && world.get(tx, world.surfaceY[tx]) === T.SNOW && world.get(tx, ty - 1) === T.AIR) {
      rect(ctx, '#b6d1df', x + 1, y + 1, 14, 3);
      rect(ctx, '#e6f2ef', x + 2, y, 12, 2);
    }
    var gp = grass[t];
    if (!gp || world.get(tx, ty - 1) !== T.AIR) return;
    var seed = hash2(tx, ty), sway = Math.round(Math.sin(Time.seconds * 2 + tx * 0.4));
    for (var n = 0; n < 3; n++) {
      var gx = x + 2 + ((seed >>> (n * 5)) % 12);
      var h = 3 + ((seed >>> (n * 3)) % 5);
      rect(ctx, gp[1], gx, y - h, 1, h);
      rect(ctx, gp[2], gx + sway, y - h, 1, 3);
      rect(ctx, gp[3], gx + sway, y - h, 1, 1);
    }
    // Sparse flowers and pebbles, deterministic and purely decorative.
    if (seed % 11 === 0) {
      var fc = ['#e8bd6b', '#db8faf', '#d6e7a4'][seed % 3];
      rect(ctx, gp[1], x + 9, y - 7, 1, 7);
      rect(ctx, fc, x + 7, y - 8, 5, 2); rect(ctx, fc, x + 8, y - 9, 3, 4);
      rect(ctx, '#fff0ba', x + 9, y - 8, 1, 1);
    }
  }

  function wall(ctx, type, x, y, tx, ty) {
    var p = wallPalettes[type];
    if (!p) p = wallPalettes[type] = colors(type === WALL.WOOD ? '#644a36' : type === WALL.DUNGEON ? '#39415b' : type === WALL.DIRT ? '#514039' : '#3f414f');
    rect(ctx, p[2], x, y, 16, 16);
    if (type === WALL.WOOD) {
      rect(ctx, p[0], x + 7, y, 1, 16); rect(ctx, p[3], x + 8, y, 1, 16);
      rect(ctx, p[1], x + 2 + hash2(tx, ty) % 4, y + 4, 1, 8);
      if (ty % 3 === 0) rect(ctx, p[0], x, y + 15, 16, 1);
    } else {
      rect(ctx, p[1], x, y + 15, 16, 1);
      rect(ctx, p[1], x + (ty % 2 ? 4 : 12), y, 1, 15);
      rect(ctx, p[3], x + 2, y + 2 + hash2(tx, ty) % 8, 4, 1);
    }
  }

  // Entire crowns are drawn as one sprite; leaf tiles remain the source of truth
  // for mining/felling. Detection is repeated from live tiles, never save state.
  function treeCrowns(world, x0, x1, y0, y1) {
    var covered = new Set(), crowns = [];
    for (var y = Math.max(1, y0 - 6); y <= Math.min(world.H - 3, y1 + 4); y++) {
      for (var x = Math.max(2, x0 - 4); x <= Math.min(world.W - 3, x1 + 4); x++) {
        var i = y * world.W + x, a = world.tiles;
        if (a[i] !== T.TREETRUNK || !leaves[a[i - world.W]] || a[i + world.W] !== T.TREETRUNK || a[i + 2 * world.W] !== T.TREETRUNK) continue;
        var leaf = a[i - world.W];
        // Check every leaf in either generated broadleaf footprint, including
        // the top and low fringe. A mined tip must not regrow visually.
        var patterns = [
          [[-2, 1], [-1, 2], [0, 2], [1, 1]],
          [[-4, 0], [-3, 1], [-2, 1], [-1, 2], [0, 2]]
        ];
        var footprint = null;
        for (var pattern = 0; pattern < patterns.length && !footprint; pattern++) {
          var candidate = [], full = true;
          for (var r = 0; r < patterns[pattern].length; r++) {
            var dy = patterns[pattern][r][0], halfWidth = patterns[pattern][r][1];
            for (var dx = -halfWidth; dx <= halfWidth; dx++) {
              var fi = (y + dy) * world.W + x + dx;
              var expected = dx === 0 && dy >= 0 ? T.TREETRUNK : leaf;
              if (y + dy < 0 || a[fi] !== expected) full = false;
              if (expected === leaf) candidate.push(fi);
            }
          }
          if (full) footprint = candidate;
        }
        if (!footprint) continue;
        crowns.push({ x: x, y: y, tile: leaf, variant: hash2(x, y) % 4 });
        footprint.forEach(function(i) { covered.add(i); });
      }
    }
    // Boreal pines use an alternating trunk/leaf spine, unlike broadleaf trees.
    // Validate their complete original footprint before replacing the tile art.
    if (world.surfaceY) for (x = Math.max(4, x0 - 4); x <= Math.min(world.W - 5, x1 + 4); x++) {
      var baseY = world.surfaceY[x] - 1;
      if (baseY < y0 || baseY - 18 > y1 || world.tiles[(baseY + 1) * world.W + x] !== T.SNOW || world.tiles[baseY * world.W + x] !== T.TREETRUNK) continue;
      var topY = baseY;
      while (topY > 0 && (world.tiles[(topY - 1) * world.W + x] === T.TREETRUNK || world.tiles[(topY - 1) * world.W + x] === T.LEAVES)) topY--;
      var height = baseY - topY + 1;
      if (height < 9 || height > 16) continue;
      var intact = true, indices = [];
      for (var row = 0; row < height; row++) {
        var half = Math.min(3, Math.floor(row / 2));
        for (var dx = -half; dx <= half; dx++) {
          var index = (topY + row) * world.W + x + dx;
          var expected = dx === 0 && (row % 2 === 1 || row === height - 1) ? T.TREETRUNK : T.LEAVES;
          if (world.tiles[index] !== expected) intact = false;
          indices.push(index);
        }
      }
      if (!intact) continue;
      indices.forEach(function(i) { covered.add(i); });
      crowns.push({ kind:'pine', x:x, y:topY, height:height, variant:hash2(x, topY) % 4 });
    }
    return { covered: covered, crowns: crowns };
  }

  function pine(height, variant) {
    var key = 'pine:' + height + ':' + variant;
    if (crownCache[key]) return crownCache[key];
    var h = height * TILE, c = surface(128, h + 8), ctx = c.getContext('2d');
    var p = ['#243e3d', '#31564d', '#467365', '#67917b', '#93b5a0'];
    var rng = mulberry32(hash2(height + 927, variant));
    rect(ctx, '#443b34', 59, 12, 10, h - 12); rect(ctx, '#947a55', 62, 12, 5, h - 12);
    rect(ctx, '#c6ac77', 62, 14, 1, h - 14);
    var tiers = 5, step = (h - 50) / tiers;
    for (var tier = 0; tier < tiers; tier++) {
      var top = 4 + tier * step, depth = 40 + tier * 5;
      var radius = 9 + tier * 10;
      for (var row = 0; row < depth; row += 2) {
        var span = Math.floor((2 + radius * row / depth) / 2) * 2;
        var serration = Math.floor(row / 6) % 2 * 2;
        rect(ctx, p[0], 64 - span - serration, top + row, (span + serration) * 2, 2);
        if (span > 3) {
          rect(ctx, p[1], 65 - span, top + row, span * 2 - 2, 2);
          rect(ctx, p[2], 65 - span, top + row, span - 1, 2);
        }
        if (row > 3 && row < depth * 0.7) {
          // Snow follows the sloping branch shoulders in broken pixel clusters.
          rect(ctx, '#92b2b9', 65 - span, top + row, 3 + tier, 2);
          if (row % 6 !== 0) rect(ctx, '#d7e6e1', 65 - span, top + row, 2 + tier, 2);
        }
      }
      for (var n = 0; n < 14 + tier * 3; n++) {
        var py = Math.floor(top + depth * (0.45 + rng() * 0.5));
        var spread = Math.floor(radius * (py - top) / depth * 0.75);
        var px = 64 + Math.floor((rng() - 0.5) * spread * 2);
        rect(ctx, p[2 + n % 2], px, py, 3 + n % 4, 1);
      }
    }
    crownCache[key] = c;
    return c;
  }

  function crown(t, variant) {
    var key = t + ':' + variant;
    if (crownCache[key]) return crownCache[key];
    var c = surface(112, 88), ctx = c.getContext('2d'), p = leaves[t];
    var rng = mulberry32(hash2(t + 431, variant + 71));
    // Overlapping, stair-stepped leaf masses give a loose oak silhouette.
    var blobs = [[35, 36, 27, 24], [68, 30, 26, 27], [53, 19, 24, 17], [19, 48, 16, 18], [87, 48, 18, 18], [54, 51, 40, 24]];
    for (var b = 0; b < blobs.length; b++) {
      var blob = blobs[b], cx = blob[0], cy = blob[1], rx = blob[2], ry = blob[3];
      for (var row = -ry; row <= ry; row += 2) {
        var span = Math.floor(Math.sqrt(Math.max(0, 1 - row * row / (ry * ry))) * rx / 2) * 2;
        rect(ctx, p[0], cx - span, cy + row, span * 2, 2);
        if (span > 4) rect(ctx, p[b < 3 ? 2 : 1], cx - span + 2, cy + row, span * 2 - 4, 2);
      }
    }
    // source-atop keeps all leaf clusters within the silhouette.
    ctx.globalCompositeOperation = 'source-atop';
    for (var n = 0; n < 280; n++) {
      var lx = Math.floor(rng() * 110 / 2) * 2, ly = Math.floor(rng() * 76 / 2) * 2;
      var lit = ly < 35 && rng() > 0.3;
      rect(ctx, p[lit ? 3 : 2], lx, ly, 4 + Math.floor(rng() * 3) * 2, 2);
      rect(ctx, p[lit ? 4 : 1], lx, ly + 2, 2 + Math.floor(rng() * 3) * 2, 2);
    }
    ctx.globalCompositeOperation = 'source-over';
    crownCache[key] = c;
    return c;
  }

  // A compact original, side-facing adventurer. Frames and equipment palettes
  // are cached; facing is a mirror, not a second set of generated canvases.
  function actor(body, head, legs, helmet, hair, frame, skin, pose, action) {
    skin = skin || '#e4ad80';
    pose = pose || 'walk';
    var key = [body, head, legs, helmet, hair, frame, skin, pose, action || ''].join(':');
    if (actorCache.has(key)) return actorCache.get(key);
    var c = surface(28, 46), ctx = c.getContext('2d');
    ctx.translate(14, 27);
    var bp = colors(body), lp = colors(legs), hp = colors(head), sp = colors(skin);
    var stride = [0, 2, 3, 0, -2, -3][frame % 6], bob = frame === 2 || frame === 5 ? -1 : 0;
    if (pose === 'idle') { stride = 0; bob = frame === 2 ? -1 : 0; }
    if (pose === 'run') stride = [0, 3, 4, 0, -3, -4][frame % 6];
    if (pose === 'rise') { stride = -2; bob = 0; }
    if (pose === 'fall') { stride = 2; bob = 0; }
    if (pose === 'land') { stride = 1; bob = 2; }
    var tuck = pose === 'rise' ? 4 : pose === 'fall' ? 1 : pose === 'land' ? 2 : 0;
    // Rear boot and trouser leg.
    ctx.save(); ctx.translate(0, -tuck);
    rect(ctx, OUTLINE, -5 - stride, 3, 6, 13);
    rect(ctx, lp[1], -4 - stride, 4, 4, 9);
    rect(ctx, '#493b38', -5 - stride, 13, 7, 3);
    rect(ctx, '#827060', -4 - stride, 13, 5, 1);
    // Front leg, knee highlight and boot toe.
    rect(ctx, OUTLINE, stride - 1, 3, 6, 14);
    rect(ctx, lp[2], stride, 4, 4, 10); rect(ctx, lp[3], stride, 5, 1, 6);
    rect(ctx, '#493b38', stride - 1, 14, 8, 3); rect(ctx, '#9b8163', stride, 14, 6, 1);
    ctx.restore();
    ctx.translate(0, bob);
    // Back arm, torso silhouette, collar, belt and shoulder highlight.
    rect(ctx, OUTLINE, -8, -11 - stride, 5, 14);
    rect(ctx, bp[1], -7, -10 - stride, 3, 8);
    rect(ctx, sp[1], -7, -2 - stride, 3, 4);
    rect(ctx, OUTLINE, -6, -12, 12, 18);
    rect(ctx, bp[1], -5, -11, 10, 15);
    rect(ctx, bp[2], -4, -11, 8, 12); rect(ctx, bp[3], -4, -10, 2, 9);
    rect(ctx, sp[1], -1, -12, 5, 2);
    rect(ctx, '#57402f', -5, 2, 10, 3); rect(ctx, '#d8b268', 1, 2, 3, 2);
    // Head profile, ear, nose and the bright two-pixel iris.
    rect(ctx, OUTLINE, -5, -23, 11, 11); rect(ctx, OUTLINE, -6, -21, 13, 7);
    rect(ctx, sp[1], -4, -22, 9, 9); rect(ctx, sp[2], -2, -21, 8, 7);
    rect(ctx, sp[3], 1, -20, 4, 2); rect(ctx, sp[2], 6, -18, 2, 3);
    rect(ctx, '#fcf5e2', 3, -20, 3, 3); rect(ctx, '#364451', 5, -20, 1, 3);
    if (pose === 'idle' && frame === 3) { rect(ctx, sp[2], 3, -20, 3, 3); rect(ctx, sp[0], 3, -19, 3, 1); }
    rect(ctx, sp[0], 3, -14, 3, 1); rect(ctx, sp[1], -3, -17, 2, 3);
    if (helmet) {
      rect(ctx, hp[0], -6, -25, 12, 7); rect(ctx, hp[2], -5, -24, 10, 5);
      rect(ctx, hp[4], -4, -24, 8, 1); rect(ctx, hp[1], -6, -20, 3, 7);
      rect(ctx, hp[3], 1, -21, 7, 2); rect(ctx, OUTLINE, 2, -19, 5, 1);
    } else {
      var hc = ['#68432f', '#514031', '#9f713b', '#45333b', '#8d4b3e', '#c29a58', '#353b4a', '#654248', '#9b8372'][hair % 9];
      rect(ctx, shade(hc, -24), -6, -24, 11, 6); rect(ctx, hc, -5, -25, 10, 5);
      rect(ctx, shade(hc, 24), -4, -25, 7, 1);
      rect(ctx, hc, -6, -20, 3, 6); rect(ctx, hc, -3, -21, 3, 3);
      if (hair % 3 === 1) rect(ctx, hc, -7, -21, 2, 11);
      if (hair % 3 === 2) rect(ctx, hc, -3, -27, 4, 3);
    }
    // Front arm swings opposite the feet, lifts in air and reaches while using tools/weapons.
    ctx.save();
    if (action) ctx.translate(3, -3);
    else if (pose === 'rise' || pose === 'fall') ctx.translate(1, -3);
    rect(ctx, OUTLINE, 2, -10 + stride, 6, 13);
    rect(ctx, bp[2], 3, -9 + stride, 4, 7); rect(ctx, bp[3], 3, -9 + stride, 3, 2);
    rect(ctx, sp[1], 3, -2 + stride, 4, 4); rect(ctx, sp[3], 4, -2 + stride, 2, 2);
    ctx.restore();
    // Bound cache growth for servers with many dyed player palettes.
    if (actorCache.size >= 256) actorCache.delete(actorCache.keys().next().value);
    actorCache.set(key, c);
    return c;
  }
  function drawActor(ctx, x, y, dir, body, head, legs, helmet, hair, frame, skin, pose, action) {
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.translate(Math.floor(x), Math.floor(y)); ctx.scale(dir < 0 ? -1 : 1, 1);
    ctx.drawImage(actor(body, head, legs, helmet, hair, frame, skin, pose, action), -14, -27);
    ctx.restore();
  }

  function playerAnimation(p, seconds) {
    var speed = Math.abs(p.vx || 0), pose, frame;
    if (!p.onGround) { pose = p.vy < -0.5 ? 'rise' : 'fall'; frame = 0; }
    else if (p.landAnimT > 0) { pose = 'land'; frame = 0; }
    else if (speed > 0.5 && !p.mounted) {
      pose = speed > 3.5 ? 'run' : 'walk';
      frame = Math.floor(p.netId ? seconds * speed * 3 : (p.walkPhase || 0)) % 6;
    } else {
      pose = 'idle';
      // Slow breathing, with one brief blink instead of a permanently frozen pose.
      var idle = seconds % 4;
      frame = idle > 3.8 ? 3 : idle > 1.2 && idle < 2.6 ? 2 : 0;
    }
    return { pose:pose, frame:frame, action:p.swingT > 0 ? 'attack' : p.toolAnimT > 0 ? 'mine' : '' };
  }

  function drawWings(ctx, p) {
    var wing = null, ids = p.inventory.accessories || [];
    for (var i = 0; i < ids.length; i++) {
      var def = ITEMS[ids[i]];
      if (def && def.type === 'accessory' && /wings/i.test(def.name)) { wing = def; break; }
    }
    if (!wing) return false;
    var frame = p.onGround ? 0 : 1 + Math.floor(Time.seconds * 10) % 4;
    var key = 'wings:' + wing.id + ':' + wing.name + ':' + frame, c = actorCache.get(key);
    if (!c) {
      c = surface(48, 40); var art = c.getContext('2d'); art.translate(24, 20);
      var pal = colors(wing.color || '#bfcddd'), width = [5,13,19,15,9][frame];
      var butterfly = /butterfly|mothron/i.test(wing.name);
      for (var side = -1; side <= 1; side += 2) {
        for (var row = -16; row <= 10; row++) {
          var lobe = butterfly && row > -2 ? Math.sqrt(Math.max(0,1 - Math.pow((row - 3) / 8,2))) * 0.7 : Math.sqrt(Math.max(0,1 - Math.pow((row + 7) / 11,2)));
          var span = Math.round(width * lobe);
          if (span < 1) continue;
          var x = side < 0 ? -span - 2 : 2;
          rect(art,OUTLINE,x,row,span,1);
          if (span > 2) rect(art,pal[row < -7 ? 3 : 2],x + 1,row,span - 2,1);
          if (span > 6 && row % 5 === 0) rect(art,pal[1],side < 0 ? x + 3 : x + span - 5,row,2,2);
        }
        if (butterfly && width > 8) {
          rect(art,pal[0],side * (width - 5) - 2,-10,4,5);
          rect(art,'#eee2b9',side * (width - 5) - 1,-9,2,2);
        }
      }
      if (actorCache.size >= 256) actorCache.delete(actorCache.keys().next().value);
      actorCache.set(key,c);
    }
    ctx.save(); ctx.imageSmoothingEnabled = false; ctx.scale(p.dir < 0 ? -1 : 1,1);
    ctx.drawImage(c,-27,-26); ctx.restore();
    return true;
  }

  function slime(ctx, x, y, w, h, col) {
    var p = colors(col), bounce = Math.round(Math.sin(Time.seconds * 5 + x * 0.01) * 1.5);
    var width = Math.round(w / 2), height = Math.max(8, Math.round(h - bounce));
    x = Math.floor(x); y = Math.floor(y + h / 2);
    for (var sy = 0; sy < height; sy++) {
      var span = Math.floor(Math.sqrt(Math.max(0, 1 - Math.pow((sy - height + 2) / height, 2))) * width);
      rect(ctx, p[0], x - span, y - height + sy, span * 2, 1);
      if (span > 2) rect(ctx, sy < height * 0.55 ? p[2] : p[1], x - span + 1, y - height + sy, span * 2 - 2, 1);
    }
    rect(ctx, p[3], x - width + 5, y - height + 5, 5, 2);
    rect(ctx, p[4], x - width + 6, y - height + 5, 2, 1);
    rect(ctx, '#d2e9dc', x - 5, y - 8, 3, 4); rect(ctx, '#d2e9dc', x + 3, y - 8, 3, 4);
    rect(ctx, OUTLINE, x - 3, y - 7, 1, 3); rect(ctx, OUTLINE, x + 5, y - 7, 1, 3);
    rect(ctx, p[0], x - width + 2, y - 1, width * 2 - 4, 1);
  }

  function drawTownActor(ctx, e, x, y, col) {
    var skin = e.type === E.GOBLINTINKERER ? '#92a578' : e.type === E.TRUFFLE ? '#83a9c6' : e.type === E.CYBORG ? '#a6adb9' : '#e4ad80';
    var frame = Math.abs(e.vx || 0) > 0.3 ? Math.floor(Time.seconds * 10) % 6 : 0;
    drawActor(ctx, x, y, e.dir, col, skin, shade(col, -22), false, e.type % 9, frame, skin);
    ctx.save(); ctx.translate(Math.floor(x), Math.floor(y));
    if (e.type === E.NURSE) {
      rect(ctx, OUTLINE, -7, -27, 14, 6); rect(ctx, '#f2edde', -6, -26, 12, 4);
      rect(ctx, '#b95868', -1, -26, 2, 4); rect(ctx, '#b95868', -2, -25, 4, 2);
    } else if (e.type === E.WIZARD) {
      for (var row = 0; row < 13; row++) {
        var half = 1 + Math.floor(row * 0.4);
        rect(ctx, '#473b69', -half, -36 + row, half * 2, 1);
        rect(ctx, '#7f6a9e', -half + 1, -36 + row, Math.max(1, half), 1);
      }
      rect(ctx, '#b2a084', -7, -24, 14, 2); rect(ctx, '#dcc489', 0, -31, 2, 2);
    } else if (e.type === E.MERCHANT || e.type === E.ARMSDEALER || e.type === E.CLOTHIER) {
      rect(ctx, '#3e3434', -6, -29, 12, 7); rect(ctx, '#997b51', -5, -28, 10, 5);
      rect(ctx, '#5a4837', -9, -23, 18, 2); rect(ctx, '#d6b77c', -8, -23, 16, 1);
    } else if (e.type === E.DEMOLITIONIST || e.type === E.MECHANIC) {
      rect(ctx, '#75512e', -7, -26, 14, 5); rect(ctx, '#d2a34a', -6, -27, 12, 5);
      rect(ctx, '#f6d580', -4, -27, 7, 2); rect(ctx, '#8c673b', -8, -22, 16, 2);
    }
    ctx.restore();
  }

  function drawCreature(ctx, kind, x, y, col, dir, frame) {
    var key = [kind, col, frame].join(':');
    var c = creatureCache.get(key);
    if (!c) {
      c = surface(48, 48);
      var art = c.getContext('2d'), p = colors(col);
      art.translate(24, 24);
      if (kind === 'eye') {
        for (var row = -8; row <= 8; row++) {
          var half = Math.floor(Math.sqrt(Math.max(0, 1 - row * row / 64)) * 11);
          rect(art, p[0], -half, row, half * 2, 1);
          if (half > 1) rect(art, row > 3 ? p[1] : p[3], -half + 1, row, half * 2 - 2, 1);
        }
        // Trailing nerve strands and veins break up the otherwise round body.
        rect(art, '#9b4b60', -16, -3 + frame, 7, 2);
        rect(art, '#c77c82', -19, -4 + frame, 4, 1);
        rect(art, '#9b4b60', -14, 3 - frame, 5, 1);
        rect(art, '#bd6574', -7, -5, 4, 1); rect(art, '#bd6574', -5, -4, 2, 2);
        rect(art, '#b14955', 1, -5, 7, 10); rect(art, '#e77c68', 2, -4, 5, 8);
        rect(art, '#272737', 4, -3, 4, 6); rect(art, '#fff1d7', 4, -3, 2, 2);
      } else if (kind === 'bat') {
        for (var side = -1; side <= 1; side += 2) {
          for (var feather = 0; feather < 6; feather++) {
            var wx = side < 0 ? -6 - feather * 2 : 4 + feather * 2;
            var wy = -3 - Math.floor(feather * (frame === 1 ? -0.3 : 0.7));
            rect(art, OUTLINE, wx, wy, 3, 6 - feather % 2);
            rect(art, p[2], wx, wy + 1, 2, 3);
            rect(art, p[3], wx, wy + 1, 1, 1);
          }
        }
        rect(art, OUTLINE, -5, -6, 10, 13); rect(art, p[2], -4, -5, 8, 11);
        rect(art, p[1], -4, 1, 8, 5); rect(art, OUTLINE, -5, -10, 3, 5);
        rect(art, OUTLINE, 2, -10, 3, 5); rect(art, p[3], -4, -9, 1, 4);
        rect(art, p[3], 3, -9, 1, 4); rect(art, '#e5b887', -3, -3, 2, 2);
        rect(art, '#e5b887', 2, -3, 2, 2); rect(art, '#f0e5cc', -2, 2, 1, 2);
        rect(art, '#f0e5cc', 2, 2, 1, 2);
      } else {
        var stride = frame === 1 ? 2 : frame === 2 ? -2 : 0;
        rect(art, OUTLINE, -6, -22, 12, 12); rect(art, p[2], -5, -21, 10, 10);
        rect(art, p[4], -4, -21, 7, 2); rect(art, OUTLINE, -4, -18, 3, 3);
        rect(art, OUTLINE, 2, -18, 3, 3); rect(art, OUTLINE, 0, -15, 1, 2);
        rect(art, p[1], -3, -12, 7, 2); rect(art, OUTLINE, -1, -12, 1, 2);
        rect(art, OUTLINE, 2, -12, 1, 2);
        rect(art, p[1], -1, -10, 3, 16);
        for (var rib = 0; rib < 3; rib++) {
          rect(art, p[0], -5, -8 + rib * 4, 11, 3);
          rect(art, p[3], -5, -8 + rib * 4, 10, 1);
        }
        rect(art, p[1], -7, -7 + stride, 2, 12); rect(art, p[3], 6, -6 - stride, 2, 12);
        rect(art, p[2], -5 - stride, 5, 2, 10); rect(art, p[3], 3 + stride, 5, 2, 10);
        rect(art, p[1], -5 - stride, 15, 5, 2); rect(art, p[2], 3 + stride, 15, 5, 2);
      }
      if (creatureCache.size >= 128) creatureCache.delete(creatureCache.keys().next().value);
      creatureCache.set(key, c);
    }
    ctx.save(); ctx.imageSmoothingEnabled = false;
    ctx.translate(Math.floor(x), Math.floor(y)); ctx.scale(dir < 0 ? -1 : 1, 1);
    ctx.drawImage(c, -24, -24); ctx.restore();
  }

  function landscapePalette(biome, night) {
    if (night) return ['#252b4b', '#202c44', '#192b39'];
    if (biome === BIOME.SNOW) return ['#9cb8ca', '#7e9faf', '#5e8194'];
    if (biome === BIOME.DESERT || biome === BIOME.OCEAN) return ['#c6ab8b', '#ac947b', '#7e8c78'];
    if (biome === BIOME.CORRUPT) return ['#9b91af', '#7b7294', '#534c73'];
    if (biome === BIOME.CRIMSON) return ['#b0959c', '#92727f', '#6b4e61'];
    if (biome === BIOME.HALLOW) return ['#b3a7cf', '#9696b7', '#738fa5'];
    if (biome === BIOME.JUNGLE) return ['#8cb6aa', '#63958b', '#3e7467'];
    return ['#98b5bd', '#739c9e', '#4f8278'];
  }

  function landscape(biome, layer, night) {
    var key = biome + ':' + layer + ':' + night;
    if (sceneryCache[key]) return sceneryCache[key];
    var c = surface(640, 240), ctx = c.getContext('2d');
    var p = landscapePalette(biome, night), col = p[layer];
    var desert = biome === BIOME.DESERT || biome === BIOME.OCEAN;
    var snow = biome === BIOME.SNOW;
    var heights = [];
    for (var x = 0; x < 640; x++) {
      // Integer periods guarantee a seamless wrap at x=640.
      var u = x / 640 * Math.PI * 2;
      var peak = 34 * Math.sin(u * 3 + layer * 2) + 19 * Math.sin(u * 7 + 0.8) + 8 * Math.sin(u * 13);
      var y = layer === 0 ? 95 + peak : (layer === 1 ? 158 : 135) + peak * 0.35;
      if (desert) y = Math.round(y / 12) * 12;
      y = Math.round(y); heights[x] = y;
      rect(ctx, col, x, y, 1, 240 - y);
      if (layer === 0 && snow) rect(ctx, night ? '#63758c' : '#dce8e4', x, y, 1, 6 + Math.max(0, Math.sin(u * 17)) * 8);
      if (layer === 0 && !desert && Math.cos(u * 3 + layer * 2) > 0.65) {
        rect(ctx, night ? '#2b314f' : '#a8c0c3', x, y + 8, 1, 16 + Math.sin(u * 7) * 9);
      }
    }
    if (layer > 0) {
      var rng = mulberry32(hash2(biome + 530, layer + 18));
      for (var ti = 0; ti < 48; ti++) {
        var tx = Math.floor(ti * 640 / 48), base = heights[tx] + 4;
        var height = 12 + Math.floor(rng() * (layer === 1 ? 25 : 39));
        rect(ctx, col, tx - 1, base - height, 3, height);
        if (desert) {
          if (ti % 4 === 0) { rect(ctx, col, tx - 4, base - height + 4, 3, 10); rect(ctx, col, tx - 3, base - height + 12, 8, 3); }
        } else if (snow || biome === BIOME.CORRUPT) {
          for (var sy = 0; sy < height - 3; sy++) {
            var half = Math.floor(sy * 0.25) + (Math.floor(sy / 5) % 2);
            rect(ctx, col, tx - half, base - height + sy, half * 2 + 1, 1);
          }
        } else {
          var radius = 6 + Math.floor(rng() * 7);
          for (sy = -radius; sy <= radius; sy++) {
            half = Math.floor(Math.sqrt(Math.max(0, radius * radius - sy * sy)));
            rect(ctx, col, tx - half, base - height + sy, half * 2 + 1, 1);
          }
        }
      }
    }
    sceneryCache[key] = c;
    return c;
  }
  function drawLandscape(ctx, biome, night, cam, W, H, horizon) {
    ctx.save(); ctx.imageSmoothingEnabled = false;
    for (var l = 0; l < 3; l++) {
      var c = landscape(biome, l, night), scale = 2, width = c.width * scale;
      var off = Math.floor(cam.x * [0.08, 0.16, 0.27][l]);
      var start = -((off % width + width) % width);
      var top = Math.floor(horizon - (l === 0 ? 330 : l === 1 ? 290 : 250));
      for (var sx = start; sx < W; sx += width) ctx.drawImage(c, sx, top, width, c.height * scale);
      rect(ctx, landscapePalette(biome, night)[l], 0, Math.max(0, top + c.height * scale), W, Math.max(0, H - top - c.height * scale));
    }
    ctx.restore();
  }

  function cloud(variant, night) {
    var key = variant + ':' + night;
    if (cloudCache[key]) return cloudCache[key];
    var c = surface(100, 34), ctx = c.getContext('2d');
    var p = night ? ['#485272', '#636f8e', '#8992ac'] : ['#bbcfd6', '#dde8e4', '#fff8e4'];
    var bumps = [[18, 22, 16, 7], [38, 16, 20, 12], [57, 13, 15, 12], [76, 21, 20, 9]];
    for (var b = 0; b < bumps.length; b++) {
      var v = bumps[b], cy = v[1] + (variant % 3) * (b % 2);
      for (var y = -v[3]; y <= v[3]; y++) {
        var half = Math.floor(Math.sqrt(Math.max(0, 1 - y * y / (v[3] * v[3]))) * v[2]);
        rect(ctx, p[y > 2 ? 0 : 1], v[0] - half, cy + y, half * 2, 1);
        if (y < -3) rect(ctx, p[2], v[0] - half + 1, cy + y, Math.max(0, half * 2 - 2), 1);
      }
    }
    cloudCache[key] = c;
    return c;
  }

  function celestial(ctx, x, y, moon) {
    var radius = moon ? 15 : 18;
    x = Math.round(x); y = Math.round(y);
    for (var row = -radius; row <= radius; row++) {
      var half = Math.floor(Math.sqrt(radius * radius - row * row));
      rect(ctx, moon ? '#c5d8e2' : '#e8aa55', x - half - 1, y + row, half * 2 + 2, 1);
      if (half > 1) rect(ctx, moon ? '#f0e9ce' : '#ffe4a0', x - half, y + row, half * 2, 1);
    }
    if (moon) {
      rect(ctx, '#bac8cb', x - 8, y - 6, 5, 4); rect(ctx, '#d4d9ca', x + 3, y + 4, 6, 3);
      rect(ctx, '#bac8cb', x - 4, y + 9, 3, 2);
    } else {
      rect(ctx, '#fff4cf', x - 8, y - 9, 10, 3); rect(ctx, '#fff4cf', x - 11, y - 6, 4, 4);
    }
  }

  function drawCavern(ctx, biome, cam, W, H) {
    var hot = biome === BIOME.UNDERWORLD;
    var cold = biome === BIOME.UNDERSNOW || biome === BIOME.SNOW;
    var mushroom = biome === BIOME.MUSHROOM;
    var base = hot ? '#28151d' : cold ? '#1d2b3a' : mushroom ? '#1c203b' : '#23212b';
    var front = hot ? '#371e25' : cold ? '#28384b' : '#2b2832';
    for (var layer = 0; layer < 2; layer++) {
      var spacing = layer ? 94 : 150, parallax = layer ? 0.14 : 0.07;
      var offset = Math.floor(cam.x * parallax);
      var start = Math.floor(offset / spacing) - 1;
      for (var i = start; i * spacing - offset < W + spacing; i++) {
        var seed = hash2(i + layer * 133, 931);
        var x = i * spacing - offset, width = 12 + seed % 25;
        var length = 50 + (seed >>> 7) % Math.max(60, Math.floor(H * 0.45));
        var fromTop = seed % 3 !== 0;
        var anchor = fromTop ? -((cam.y * parallax) % 80) : H + 60 - ((cam.y * parallax) % 80);
        for (var row = 0; row < length; row += 4) {
          var half = Math.round(width * (1 - row / length));
          var sy = fromTop ? anchor + row : anchor - row;
          rect(ctx, layer ? front : base, x - half, sy, half * 2 + 2, 4);
          if (half > 5) rect(ctx, base, x - half + 2, sy, 2, 4);
        }
      }
    }
  }

  function item(it) {
    if (itemCache[it.id]) return itemCache[it.id];
    var c = surface(20, 20), ctx = c.getContext('2d');
    var name = (it.name || '').toLowerCase(), p = colors(it.color || '#aab8cc');
    var placed = it.tile !== undefined ? prop(it.tile) : null;
    if (placed) {
      ctx.drawImage(placed, 2, 2);
      itemCache[it.id] = c;
      return c;
    }
    if (it.type === 'bar' || it.icon === 'bar') {
      rect(ctx, OUTLINE, 6, 5, 9, 3); rect(ctx, OUTLINE, 4, 8, 13, 3);
      rect(ctx, OUTLINE, 2, 11, 16, 5); rect(ctx, p[3], 7, 6, 7, 2);
      rect(ctx, p[4], 7, 6, 7, 1); rect(ctx, p[2], 5, 8, 11, 3);
      rect(ctx, p[1], 3, 11, 14, 4); rect(ctx, p[3], 3, 11, 14, 1);
      rect(ctx, p[2], 4, 12, 1, 2);
    } else if (it.type === 'accessory' && /boot|shoe|wader|skate/.test(name)) {
      rect(ctx, OUTLINE, 4, 2, 9, 13); rect(ctx, OUTLINE, 5, 12, 12, 5);
      rect(ctx, p[2], 5, 3, 7, 10); rect(ctx, p[3], 5, 3, 6, 2);
      rect(ctx, p[1], 6, 12, 10, 4); rect(ctx, '#c6b88d', 5, 16, 12, 2);
      rect(ctx, '#e6dfb6', 6, 16, 10, 1); rect(ctx, p[4], 6, 6, 2, 5);
      rect(ctx, '#a38d56', 9, 7, 3, 2);
    } else if (it.type === 'accessory' && /phone|gps|pda|meter|radar|analyzer/.test(name)) {
      rect(ctx, OUTLINE, 5, 1, 10, 18); rect(ctx, '#7d8496', 6, 2, 8, 16);
      rect(ctx, '#b0b8bb', 6, 2, 7, 2); rect(ctx, '#233d48', 7, 5, 6, 8);
      rect(ctx, '#8bc6b1', 8, 6, 4, 2); rect(ctx, '#538f86', 8, 9, 3, 1);
      rect(ctx, '#dbbf78', 9, 15, 2, 2); rect(ctx, OUTLINE, 11, 0, 2, 2);
    } else if (it.type === 'accessory' && /mirror/.test(name)) {
      rect(ctx, OUTLINE, 6, 2, 8, 12); rect(ctx, OUTLINE, 4, 4, 12, 8);
      rect(ctx, '#bfa567', 6, 3, 8, 10); rect(ctx, '#bfa567', 5, 5, 10, 6);
      rect(ctx, '#6da4cb', 7, 4, 6, 8); rect(ctx, '#c2e4ed', 7, 4, 3, 4);
      rect(ctx, '#f1e4b2', 7, 4, 2, 2); rect(ctx, '#8c744b', 9, 13, 3, 5);
    } else if (it.type === 'accessory' && /shield|charm|skull/.test(name)) {
      rect(ctx, OUTLINE, 3, 3, 14, 10); rect(ctx, OUTLINE, 5, 12, 10, 3);
      rect(ctx, OUTLINE, 7, 15, 6, 2); rect(ctx, OUTLINE, 9, 17, 2, 1);
      rect(ctx, p[2], 4, 4, 12, 8); rect(ctx, p[1], 6, 12, 8, 2);
      rect(ctx, p[3], 5, 4, 2, 7); rect(ctx, p[3], 6, 4, 9, 1);
      rect(ctx, '#d9c891', 9, 6, 2, 9); rect(ctx, '#d9c891', 6, 8, 8, 2);
    } else if (it.type === 'accessory' && /wing/.test(name)) {
      for (var side = -1; side <= 1; side += 2) for (var feather = 0; feather < 5; feather++) {
        var fx = 9 + side * (feather + 2), fy = 13 - feather * 2;
        rect(ctx, p[0], fx, fy - 4, 3, 8);
        rect(ctx, p[2], fx, fy - 4, 2, 6); rect(ctx, p[4], fx, fy - 4, 1, 3);
      }
    } else paintItem(ctx, it, p, name);
    itemCache[it.id] = c;
    return c;
  }

  function paintItem(ctx, it, p, name) {
    var pattern = null;
    if (it.type === 'melee' && !it.meleeMode && !/spear|boomerang|flail|yoyo/.test(name)) {
      pattern = [
        '.............oo.', '............ohbo', '...........ohbdo', '..........ohbdo.',
        '.........ohbdo..', '........ohbdo...', '.......ohbdo....', '..oo..ohbdo.....',
        '..ogooohdo......', '...ogggdo.......', '....oggo........', '...otoggo.......',
        '..oto.oggo......', '.oto...oo.......', '.oo.............', '................'
      ];
    } else if (it.type === 'tool' && !/drill|chainsaw/.test(name)) {
      pattern = it.axe !== undefined ? [
        '.......oo.......', '......obbo......', '....oobbhoo.....', '....obbhbbdo....',
        '....obbhbbddo...', '.....otobdddo...', '.....otooooo....', '.....oto........',
        '....oto.........', '....oto.........', '...oto..........', '...oto..........',
        '..oto...........', '..oto...........', '..oo............', '................'
      ] : it.hammer ? [
        '....oooooooo....', '...ohhhhhbbbo...', '...obbbbbbddo...', '....oootoooo....',
        '......oto.......', '......oto.......', '.....oto........', '.....oto........',
        '....oto.........', '....oto.........', '...oto..........', '...oto..........',
        '..oto...........', '..oto...........', '..oo............', '................'
      ] : [
        '....ooooooo.....', '...ohhhbbbbo....', '..ohbbddddbbo...', '.obdoootoodbbo..',
        '.oo...oto..obbo.', '.....oto....obo.', '.....oto.....oo.', '....oto.........',
        '....oto.........', '...oto..........', '...oto..........', '..oto...........',
        '..oto...........', '.oto............', '.oo.............', '................'
      ];
    }
    if (pattern) {
      var map = { o: OUTLINE, h: p[4], b: p[2], d: p[1], t: '#a78052', g: '#d2ac5b' };
      for (var y = 0; y < pattern.length; y++) for (var x = 0; x < pattern[y].length; x++) {
        var color = map[pattern[y][x]];
        if (color) rect(ctx, color, x + 2, y + 2, 1, 1);
      }
    } else {
      // Preserve the unique legacy silhouettes, but rasterize once at native
      // icon resolution, not under the UI's fractional transform on every draw.
      ctx.save(); ctx.translate(10, 10); drawLegacyItemIcon(ctx, it, 0, 0); ctx.restore();
      var img = ctx.getImageData(0, 0, 20, 20);
      for (var i = 3; i < img.data.length; i += 4) img.data[i] = img.data[i] >= 128 ? 255 : 0;
      ctx.putImageData(img, 0, 0);
    }
  }

  return { tile: tile, connected: connected, maskAt: maskAt, groundDetails: groundDetails,
    wall: wall, treeCrowns: treeCrowns, crown: crown, pine: pine, drawActor: drawActor, playerAnimation: playerAnimation, drawWings: drawWings, drawTownActor: drawTownActor, slime: slime, drawCreature: drawCreature,
    drawLandscape: drawLandscape, cloud: cloud, celestial: celestial, drawCavern: drawCavern, item: item,
    isLeaf: isLeaf, foliageLight: foliageLight, tint: tint };
})();
