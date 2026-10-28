// ---------- Rendering ----------

// Pre-rendered tile sprites: SPRITES[tile][variant] = canvas
var SPRITES = null;
var TILE_VARIANTS = 4;

function hash2(x, y) { var n = x * 374761393 + y * 668265263; n = (n ^ (n >> 13)) * 1274126177; return ((n ^ (n >> 16)) >>> 0); }

function buildSprites() {
  SPRITES = {};
  var types = Object.keys(TILE_COLORS);
  for (var i = 0; i < types.length; i++) {
    var t = parseInt(types[i], 10);
    var arr = [];
    for (var v = 0; v < TILE_VARIANTS; v++) {
      arr.push(makeTileSprite(t, mulberry32(hash2(t * 97 + v * 13, v * 31 + t))));
    }
    SPRITES[t] = arr;
  }
}

var TILE_COLORS = {};
TILE_COLORS[T.DIRT] = ['#8a6642', '#7d5c3a'];
TILE_COLORS[T.GRASS] = ['#5cbf4d', '#4daf3d'];
TILE_COLORS[T.HALLOWGRASS] = ['#c8a8f0', '#b894e6'];
TILE_COLORS[T.CORRUPTGRASS] = ['#7a5a8c', '#6a4a7c'];
TILE_COLORS[T.STONE] = ['#7a7f8c', '#6b7080'];
TILE_COLORS[T.PEARLSTONE] = ['#d8c8f0', '#c8b8e6'];
TILE_COLORS[T.EBONSTONE] = ['#6d5a8c', '#5d4a7c'];
TILE_COLORS[T.COBALT] = ['#2a5fd0', '#1f4bb0'];
TILE_COLORS[T.MYTHRIL] = ['#2fbf8f', '#25a87a'];
TILE_COLORS[T.ADAMANTITE] = ['#c43d3d', '#a83232'];
TILE_COLORS[T.IRON] = ['#d0b090', '#bd9d7c'];
TILE_COLORS[T.SAND] = ['#e8d191', '#d8c281'];
TILE_COLORS[T.GLOWSTONE] = ['#8fd8ff', '#7ac8f0'];
TILE_COLORS[T.WOOD] = ['#9a6b3f', '#8a5c34'];
TILE_COLORS[T.TREETRUNK] = ['#9a6b3f', '#8a5c34'];
TILE_COLORS[T.LEAVES] = ['#3f9a4d', '#358a42'];
TILE_COLORS[T.LEAVES_CORRUPT] = ['#7a4fbf', '#5f3a99'];
TILE_COLORS[T.LEAVES_CRIMSON] = ['#c84a4a', '#a03030'];
TILE_COLORS[T.LEAVES_HALLOW] = ['#e8a0d8', '#c87ec0'];
TILE_COLORS[T.LEAVES_JUNGLE] = ['#2f7a3c', '#26632f'];
TILE_COLORS[T.COBWEB] = ['#e8e8e8', '#d0d0d0'];
TILE_COLORS[T.JUNGLEGRASS] = ['#4db85c', '#3d9a4a'];
TILE_COLORS[T.MUD] = ['#6a4a2d', '#5a3d24'];
TILE_COLORS[T.CHLOROPHYTE] = ['#3dff8a', '#35d877'];
TILE_COLORS[T.TITANIUM] = ['#d0d8e8', '#b8c0d4'];
TILE_COLORS[T.ORICHALCUM] = ['#c85c8a', '#ad4a76'];
TILE_COLORS[T.TEMPLEBRICK] = ['#c8a86a', '#b08f4d'];
TILE_COLORS[T.WATER] = ['rgba(40,80,180,0.6)', 'rgba(30,60,150,0.6)'];
TILE_COLORS[T.SNOW] = ['#e8f0f8', '#d0dce8'];
TILE_COLORS[T.ICE] = ['#b8dff2', '#9fc8e0'];
TILE_COLORS[T.MUSHROOM] = ['#7a5cff', '#6a4fe8'];
TILE_COLORS[T.PALLADIUM] = ['#ff9ab0', '#e87a95'];
TILE_COLORS[T.GLASS] = ['#c8e8f0', '#b0d4e0'];
TILE_COLORS[T.SPOOKYWOOD] = ['#4a4a5a', '#3a3a4a'];
TILE_COLORS[T.HONEY] = ['#e8a83d', '#d08f2f'];
TILE_COLORS[T.CHEST] = ['#9a6b3f', '#8a5c34'];
TILE_COLORS[T.CHAIR] = ['#8a5c34', '#7a4f2b'];
TILE_COLORS[T.TABLE] = ['#9a6b3f', '#8a5c34'];
TILE_COLORS[T.CRIMGRASS] = ['#b04040', '#9a3333'];
TILE_COLORS[T.CRIMSTONE] = ['#8a4a4a', '#7a3d3d'];
TILE_COLORS[T.CRIMTANE] = ['#c04048', '#a8323a'];
TILE_COLORS[T.ASH] = ['#5a5348', '#4a443a'];
TILE_COLORS[T.HELLSTONE] = ['#e84828', '#c83a1f'];
TILE_COLORS[T.HELLBRICK] = ['#7a3a2a', '#6a3325'];
TILE_COLORS[T.CLOUD] = ['#e8f0f8', '#d0dce8'];
TILE_COLORS[T.GRANITE] = ['#8a8a9a', '#7a7a8a'];
TILE_COLORS[T.MARBLE] = ['#e8e8f0', '#d0d0dc'];
TILE_COLORS[T.OBSIDIAN] = ['#3a2a3a', '#2d1f2d'];
TILE_COLORS[T.LAVA] = ['rgba(240,90,30,0.7)', 'rgba(220,70,20,0.7)'];
TILE_COLORS[T.SHIMMER] = ['rgba(130,215,255,0.55)', 'rgba(100,195,240,0.55)'];
TILE_COLORS[T.COPPER] = ['#e0834d', '#c86e3a'];
TILE_COLORS[T.SILVER] = ['#cfd6e0', '#b8c0cc'];
TILE_COLORS[T.GOLD] = ['#ffd75e', '#e8bd4a'];
TILE_COLORS[T.DEMONITE] = ['#5a4d9a', '#4a3d85'];
TILE_COLORS[T.DUNGEONBRICK] = ['#6a7ab0', '#5a6a9a'];
TILE_COLORS[T.DUNGEONDOOR] = ['#4a5a8a', '#3a4a76'];
TILE_COLORS[T.TIN] = ['#c8b090', '#b09a78'];
TILE_COLORS[T.LEAD] = ['#8a8a96', '#7a7a85'];
TILE_COLORS[T.TUNGSTEN] = ['#a0a8c0', '#8a92ad'];
TILE_COLORS[T.PLATINUM] = ['#d8f0ff', '#c0d8f0'];
TILE_COLORS[T.METEORITE] = ['#8a4a3a', '#763c2e'];
TILE_COLORS[T.SANDSTONE] = ['#c8a868', '#b09050'];
TILE_COLORS[T.PLATFORM] = ['#9a6b3f', '#7a4f2b'];
TILE_COLORS[T.WORKBENCH] = ['#9a6b3f', '#7a4f2b'];
TILE_COLORS[T.FURNACE] = ['#77727a', '#56515a'];
TILE_COLORS[T.ANVIL] = ['#59616d', '#3f4650'];
TILE_COLORS[T.TORCH] = ['#f8ae48', '#a87a4b'];
TILE_COLORS[T.PLANTERABULB] = ['#ff5c8a', '#8ad850'];
TILE_COLORS[T.HELLFORGE] = ['#8a4030', '#542820'];
TILE_COLORS[T.SHADOWCHEST] = ['#4a365f', '#291d38'];
TILE_COLORS[T.SHADOWORB] = ['#8f70d8', '#38284f'];
TILE_COLORS[T.CRIMSONHEART] = ['#e84858', '#6f202c'];
TILE_COLORS[T.LARVA] = ['#ffd75e', '#8a5a20'];
TILE_COLORS[T.HIVE] = ['#d99a32', '#8a5a20'];
TILE_COLORS[T.ALTAR] = ['#5a4d7a', '#3a2f52'];
TILE_COLORS[T.HEARTCRYSTAL] = ['#ff5c8a', '#c02050'];
TILE_COLORS[T.PYLON] = ['#6fd3ff', '#3f9ad0'];
TILE_COLORS[T.PARTYCENTER] = ['#ff70b8', '#6bc8ff'];
TILE_COLORS[T.TOMBSTONE] = ['#777780', '#42424a'];
TILE_COLORS[T.SUNFLOWER] = ['#ffe050', '#6a9a38'];

TILE_COLORS[T.BED] = ['#c04050', '#8a3040'];
TILE_COLORS[T.PIGGYBANK] = ['#f0a0c0', '#c07890'];
TILE_COLORS[T.DOOR] = ['#9a6b3f', '#7a5030'];
TILE_COLORS[T.CLAY] = ['#b06a4a', '#8a4a28'];
TILE_COLORS[T.GRAYBRICK] = ['#8a8a92', '#6a6a72'];
TILE_COLORS[T.REDBRICK] = ['#b0503a', '#8a3828'];
TILE_COLORS[T.SPIKE] = ['#9a9aa4', '#6a6a74'];
TILE_COLORS[T.BOTTLE] = ['#a8d8f0', '#78a8c8'];
TILE_COLORS[T.CLAYPOT] = ['#b06a3a', '#8a4a28'];
TILE_COLORS[T.SIGN] = ['#9a6b3f', '#7a5030'];
TILE_COLORS[T.BOOK] = ['#c84a6a', '#8a2a4a'];
TILE_COLORS[T.CHAIN] = ['#b0b0b8', '#808088'];

var EMISSIVE_ORE_GLOW = {};
EMISSIVE_ORE_GLOW[T.DEMONITE] = { r:30, strength:0.58, color:[112,76,220] };
EMISSIVE_ORE_GLOW[T.CRIMTANE] = { r:30, strength:0.58, color:[220,62,78] };
EMISSIVE_ORE_GLOW[T.METEORITE] = { r:28, strength:0.52, color:[224,112,70] };
EMISSIVE_ORE_GLOW[T.HELLSTONE] = { r:36, strength:0.68, color:[255,92,38] };
EMISSIVE_ORE_GLOW[T.CHLOROPHYTE] = { r:32, strength:0.62, color:[58,230,105] };


function makeTileSprite(t, rng) {
  var pixelSprite = PixelArt.tile(t, rng);
  if (pixelSprite) return pixelSprite;
  var c = document.createElement('canvas');
  c.width = TILE; c.height = TILE;
  var ctx = c.getContext('2d');
  var cols = TILE_COLORS[t];
  if (!cols) return c;
  var base = cols[0], dark = cols[1] || shade(base, -20);
  var lighter = shade(base, 22);
  var darkest = shade(base, -35);

  // -- base fill with per-pixel noise --
  var imgData = ctx.createImageData(TILE, TILE);
  var d = imgData.data;
  var baseRGB = hexToRgb(base);
  var darkRGB = hexToRgb(dark);
  for (var py = 0; py < TILE; py++) {
    for (var px = 0; px < TILE; px++) {
      var o = (py * TILE + px) * 4;
      var noise = rng();
      var r, g, b;
      if (noise < 0.15) { r = darkRGB[0]; g = darkRGB[1]; b = darkRGB[2]; }
      else if (noise > 0.85) { r = Math.min(255, baseRGB[0] + 20); g = Math.min(255, baseRGB[1] + 20); b = Math.min(255, baseRGB[2] + 20); }
      else { r = baseRGB[0]; g = baseRGB[1]; b = baseRGB[2]; }
      d[o] = r; d[o + 1] = g; d[o + 2] = b; d[o + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // -- edge shading (lighter top, darker bottom/right) --
  ctx.fillStyle = 'rgba(255,255,255,0.14)';
  ctx.fillRect(0, 0, TILE, 2);
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(0, TILE - 2, TILE, 2);
  ctx.fillRect(TILE - 2, 0, 2, TILE);

  // -- material-specific details --
  var ln = '';
  for (var tk in T) { if (T[tk] === t) { ln = tk; break; } }

  if (ln === 'GRASS' || ln === 'HALLOWGRASS' || ln === 'CORRUPTGRASS' || ln === 'CRIMGRASS' || ln === 'JUNGLEGRASS') {
    // grass blades on top
    ctx.fillStyle = shade(base, 30);
    for (var gb = 0; gb < 5; gb++) {
      var gx = Math.floor(rng() * TILE);
      var gh = 2 + Math.floor(rng() * 3);
      ctx.fillRect(gx, 0, 1, gh);
    }
    // dirt showing through at bottom
    ctx.fillStyle = '#7d5c3a';
    ctx.fillRect(0, TILE - 4, TILE, 4);
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(0, TILE - 4, TILE, 1);
  }
  else if (ln === 'STONE' || ln === 'EBONSTONE' || ln === 'PEARLSTONE' || ln === 'CRIMSTONE' || ln === 'GRANITE' || ln === 'MARBLE') {
    // cracks
    ctx.strokeStyle = darkest;
    ctx.lineWidth = 1;
    for (var cr = 0; cr < 2; cr++) {
      var cx = 2 + Math.floor(rng() * (TILE - 4));
      var cy2 = 2 + Math.floor(rng() * (TILE - 4));
      ctx.beginPath();
      ctx.moveTo(cx, cy2);
      ctx.lineTo(cx + 3 + rng() * 3, cy2 + 2 + rng() * 3);
      ctx.stroke();
    }
    // small pits
    ctx.fillStyle = darkest;
    for (var pt = 0; pt < 3; pt++) {
      ctx.fillRect(Math.floor(rng() * (TILE - 2)), Math.floor(rng() * (TILE - 2)), 2, 1);
    }
  }
  else if (ln === 'DIRT' || ln === 'MUD') {
    // organic clumps
    ctx.fillStyle = dark;
    for (var cl = 0; cl < 4; cl++) {
      ctx.fillRect(Math.floor(rng() * (TILE - 3)), Math.floor(rng() * (TILE - 3)), 3, 2);
    }
    ctx.fillStyle = lighter;
    for (var cl2 = 0; cl2 < 2; cl2++) {
      ctx.fillRect(Math.floor(rng() * (TILE - 2)), Math.floor(rng() * (TILE - 2)), 2, 1);
    }
  }
  else if (ln === 'WOOD' || ln === 'TREETRUNK' || ln === 'SPOOKYWOOD') {
    // wood grain
    ctx.strokeStyle = dark;
    ctx.lineWidth = 1;
    for (var li = 2; li < TILE; li += 4) {
      ctx.beginPath();
      ctx.moveTo(0, li);
      ctx.bezierCurveTo(TILE / 3, li + 1, TILE * 2 / 3, li - 1, TILE, li + 1);
      ctx.stroke();
    }
    // bark edges
    ctx.fillStyle = darkest;
    ctx.fillRect(0, 0, 1, TILE);
    ctx.fillRect(TILE - 1, 0, 1, TILE);
  }
  else if (ln === 'SAND') {
    // sand grains
    ctx.fillStyle = darkest;
    for (var sg = 0; sg < 6; sg++) {
      ctx.fillRect(Math.floor(rng() * TILE), Math.floor(rng() * TILE), 1, 1);
    }
    ctx.fillStyle = lighter;
    for (var sg2 = 0; sg2 < 3; sg2++) {
      ctx.fillRect(Math.floor(rng() * TILE), Math.floor(rng() * TILE), 1, 1);
    }
  }
  else if (ln === 'SNOW' || ln === 'ICE') {
    // crystalline sparkles
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    for (var sp = 0; sp < 4; sp++) {
      var sx = Math.floor(rng() * (TILE - 2)), sy = Math.floor(rng() * (TILE - 2));
      ctx.fillRect(sx, sy, 1, 1);
      ctx.fillRect(sx - 1, sy + 1, 1, 1);
      ctx.fillRect(sx + 1, sy + 1, 1, 1);
    }
  }
  else if (ln === 'COPPER' || ln === 'SILVER' || ln === 'GOLD' || ln === 'DEMONITE' || ln === 'CRIMTANE' ||
           ln === 'TIN' || ln === 'LEAD' || ln === 'TUNGSTEN' || ln === 'PLATINUM' || ln === 'METEORITE') {
    // ore nuggets embedded in stone
    ctx.fillStyle = '#6b7080'; // stone background
    ctx.fillRect(0, 0, TILE, TILE);
    // ore chunks
    ctx.fillStyle = base;
    for (var og = 0; og < 4; og++) {
      var ox = 1 + Math.floor(rng() * (TILE - 5));
      var oy = 1 + Math.floor(rng() * (TILE - 5));
      var ow = 2 + Math.floor(rng() * 3);
      ctx.fillRect(ox, oy, ow, ow);
      ctx.fillStyle = lighter;
      ctx.fillRect(ox, oy, ow, 1);
      ctx.fillStyle = base;
    }
    // stone texture on top
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    for (var st2 = 0; st2 < 4; st2++) {
      ctx.fillRect(Math.floor(rng() * TILE), Math.floor(rng() * TILE), 2, 1);
    }
  }
  else if (ln === 'HELLSTONE') {
    // fiery veins
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, TILE, TILE);
    ctx.strokeStyle = '#ffcc00';
    ctx.lineWidth = 1;
    for (var fv = 0; fv < 3; fv++) {
      ctx.beginPath();
      var fx = rng() * TILE, fy = rng() * TILE;
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx + (rng() - 0.5) * 8, fy + (rng() - 0.5) * 8);
      ctx.stroke();
    }
    ctx.fillStyle = '#ff6600';
    for (var fp = 0; fp < 3; fp++) {
      ctx.fillRect(Math.floor(rng() * (TILE - 2)), Math.floor(rng() * (TILE - 2)), 2, 2);
    }
  }
  else if (ln === 'COBALT' || ln === 'MYTHRIL' || ln === 'ADAMANTITE' || ln === 'CHLOROPHYTE' ||
           ln === 'TITANIUM' || ln === 'ORICHALCUM' || ln === 'PALLADIUM') {
    // hardmode ore: crystal formations in stone
    ctx.fillStyle = '#5a5a64';
    ctx.fillRect(0, 0, TILE, TILE);
    // crystal clusters
    for (var cr2 = 0; cr2 < 3; cr2++) {
      var cx3 = 2 + Math.floor(rng() * (TILE - 6));
      var cy3 = 2 + Math.floor(rng() * (TILE - 6));
      ctx.fillStyle = base;
      ctx.beginPath();
      ctx.moveTo(cx3 + 2, cy3);
      ctx.lineTo(cx3 + 4, cy3 + 3);
      ctx.lineTo(cx3 + 2, cy3 + 6);
      ctx.lineTo(cx3, cy3 + 3);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = lighter;
      ctx.fillRect(cx3 + 1, cy3 + 1, 1, 2);
    }
  }
  else if (ln === 'LEAVES') {
    // leaf clusters
    for (var lf = 0; lf < 5; lf++) {
      var lx = Math.floor(rng() * (TILE - 4));
      var ly = Math.floor(rng() * (TILE - 4));
      ctx.fillStyle = rng() < 0.5 ? shade(base, 15) : shade(base, -15);
      ctx.beginPath();
      ctx.arc(lx + 2, ly + 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  else if (ln === 'COBWEB') {
    // web pattern
    ctx.clearRect(0, 0, TILE, TILE);
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 0.5;
    for (var wa = 0; wa < 6; wa++) {
      var angle = (wa / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(8, 8);
      ctx.lineTo(8 + Math.cos(angle) * 10, 8 + Math.sin(angle) * 10);
      ctx.stroke();
    }
    for (var wr = 2; wr <= 6; wr += 2) {
      ctx.beginPath();
      ctx.arc(8, 8, wr, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  else if (ln === 'CLOUD') {
    // fluffy clouds
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, TILE, TILE);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    for (var cf = 0; cf < 3; cf++) {
      ctx.beginPath();
      ctx.arc(rng() * TILE, rng() * TILE, 3 + rng() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  else if (ln === 'GLASS') {
    // transparent with highlight
    ctx.clearRect(0, 0, TILE, TILE);
    ctx.fillStyle = 'rgba(200,232,240,0.3)';
    ctx.fillRect(0, 0, TILE, TILE);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, TILE - 1, TILE - 1);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(2, 2, 4, 1);
    ctx.fillRect(2, 2, 1, 4);
  }
  else if (ln === 'TEMPLEBRICK' || ln === 'DUNGEONBRICK' || ln === 'HELLBRICK') {
    // brick pattern
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, TILE, TILE);
    ctx.strokeStyle = darkest;
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, TILE / 2 - 1, TILE / 2 - 1);
    ctx.strokeRect(TILE / 2 + 0.5, 0.5, TILE / 2 - 1, TILE / 2 - 1);
    ctx.strokeRect(0.5, TILE / 2 + 0.5, TILE - 1, TILE / 2 - 1);
  }

  return c;
}


function shade(hex, amt) {
  var r = hexToRgb(hex);
  r[0] = clamp(r[0] + amt, 0, 255);
  r[1] = clamp(r[1] + amt, 0, 255);
  r[2] = clamp(r[2] + amt, 0, 255);
  return 'rgb(' + r[0] + ',' + r[1] + ',' + r[2] + ')';
}

function mixColor(baseHex, tintHex, amt) {
  var a = hexToRgb(baseHex), b = hexToRgb(tintHex);
  var r = Math.round(a[0] + (b[0] - a[0]) * amt);
  var g = Math.round(a[1] + (b[1] - a[1]) * amt);
  var bl = Math.round(a[2] + (b[2] - a[2]) * amt);
  return 'rgb(' + r + ',' + g + ',' + bl + ')';
}

// ---------- Main render ----------
function renderGame(game, ctx) {
  if (!SPRITES) buildSprites();
  ctx.imageSmoothingEnabled = false;
  var cam = game.cam;
  var W = canvas.width, H = canvas.height;

  // screen shake: offset a local camera copy so every layer shakes together
  if (game.shakeT > 0 && game.shakeMag > 0) {
    var shDecay = Math.max(0, Math.min(1, game.shakeT / 0.35));
    cam = {
      x: cam.x + (Math.random() - 0.5) * 2 * game.shakeMag * shDecay,
      y: cam.y + (Math.random() - 0.5) * 2 * game.shakeMag * shDecay
    };
  }

  // determine surface horizon
  var cxTile = clamp(Math.floor(cam.x / TILE), 0, game.world.W - 1);
  var horizon = game.world.surfaceY[cxTile] * TILE;

  // --- sky / underground background ---
  drawBackground(game, ctx, cam, W, H, horizon);

  // --- walls & tiles ---
  var x0 = Math.max(0, Math.floor((cam.x - W / 2) / TILE));
  var x1 = Math.min(game.world.W - 1, Math.ceil((cam.x + W / 2) / TILE));
  var y0 = Math.max(0, Math.floor((cam.y - H / 2) / TILE));
  var y1 = Math.min(game.world.H - 1, Math.ceil((cam.y + H / 2) / TILE));

  var tileCtx = ctx;
  var world = game.world;

  // draw walls + tiles (optimized: direct array access, occlusion culling)
  var tilesArr = world.tiles;
  var wallsArr = world.walls;
  var surfaceArr = world.surfaceY;
  var wW = world.W, wH = world.H;
  var tileCtx2 = tileCtx;
  var treeArt = PixelArt.treeCrowns(world, x0, x1, y0, y1);
  var foliageLight = PixelArt.foliageLight(game);
  for (var ty2 = y0; ty2 <= y1; ty2++) {
    var rowBase = ty2 * wW;
    var screenY = Math.floor(ty2 * TILE - cam.y + H / 2);
    if (screenY < -TILE || screenY > H) continue;
    var surfY2 = surfaceArr[ty2] !== undefined ? surfaceArr[Math.floor(cam.x / TILE)] : 0;
    for (var tx2 = x0; tx2 <= x1; tx2++) {
      var ii2 = rowBase + tx2;
      var t2 = tilesArr[ii2];
      var wl2 = wallsArr[ii2];
      var px2 = Math.floor(tx2 * TILE - cam.x + W / 2);
      if (px2 < -TILE || px2 > W) continue;
      // wall behind air tiles
      if (t2 === 0 && wl2 !== 0 && (ty2 >= (surfaceArr[tx2] || 0) || wl2 === 3)) {
        PixelArt.wall(tileCtx2, wl2, px2, screenY, tx2, ty2);
        continue;
      }
      if (t2 === 0) continue;
      if (treeArt.covered.has(ii2)) continue;
      // NOTE: no occlusion culling here — tiles are not fully opaque (leaves have
      // transparent pixels, variants differ), so culling "surrounded" tiles showed
      // the dark background through tree canopies and solid underground.
      if (t2 === 17) {
        // torch
        tileCtx2.drawImage(SPRITES[T.TORCH][0], px2, screenY);
        tileCtx2.fillStyle = '#fff0b5';
        tileCtx2.fillRect(px2 + 8, screenY + 3 + Math.floor(Time.seconds * 8 + tx2) % 2, 1, 3);
        continue;
      }
      var arr2 = SPRITES[t2];
      if (!arr2) continue;
      var variant2 = hash2(tx2, ty2) % TILE_VARIANTS;
      var tileMask = PixelArt.maskAt(world, tx2, ty2, t2);
      var tileArt = PixelArt.connected(t2, variant2, tileMask, arr2[variant2]);
      if ((PixelArt.isLeaf(t2) || t2 === T.TREETRUNK) && ty2 <= surfaceArr[tx2]) tileArt = PixelArt.tint(tileArt, foliageLight);
      tileCtx2.drawImage(tileArt, px2, screenY);
      PixelArt.groundDetails(tileCtx2, world, tx2, ty2, t2, px2, screenY);
      // mining crack overlay: show damage on actively mined tiles
      if (game.minedTiles) {
        var mkey = tx2 + ',' + ty2;
        if (game.minedTiles[mkey]) {
          var mhp = world.hp[ii2];
          var maxhp = (TILE_HARD[t2] || [0, 40])[1];
          if (maxhp > 0 && mhp < maxhp) {
            var dmgPct = 1 - (mhp / maxhp);
            var numCracks = Math.ceil(dmgPct * 4);
            tileCtx2.strokeStyle = 'rgba(0,0,0,' + (0.3 + dmgPct * 0.4) + ')';
            tileCtx2.lineWidth = 1;
            var seed2 = hash2(tx2 * 7, ty2 * 13);
            for (var ci = 0; ci < numCracks; ci++) {
              var cx2 = (seed2 % 12) + 2; seed2 = (seed2 * 1103515245 + 12345) & 0x7fffffff;
              var cy2 = (seed2 % 12) + 2; seed2 = (seed2 * 1103515245 + 12345) & 0x7fffffff;
              var cl2 = 2 + (seed2 % 4); seed2 = (seed2 * 1103515245 + 12345) & 0x7fffffff;
              var ca2 = (seed2 % 3) - 1; seed2 = (seed2 * 1103515245 + 12345) & 0x7fffffff;
              tileCtx2.beginPath();
              tileCtx2.moveTo(px2 + cx2, screenY + cy2);
              tileCtx2.lineTo(px2 + cx2 + cl2, screenY + cy2 + ca2);
              tileCtx2.stroke();
            }
          }
        }
      }
      // liquid surface
      if ((t2 === 29 || t2 === 50 || t2 === 51 || t2 === 36) && tilesArr[ii2 - wW] !== t2) {
        var wave = Math.sin(Time.seconds * 2.4 + tx2 * 0.85) * 1.3;
        if (t2 === 29) {
          tileCtx2.fillStyle = 'rgba(150,200,255,0.35)';
          tileCtx2.fillRect(px2, Math.floor(screenY + 2 + wave), TILE, 1);
        } else if (t2 === 50) {
          tileCtx2.fillStyle = 'rgba(255,210,90,0.45)';
          tileCtx2.fillRect(px2, Math.floor(screenY + 2 + wave), TILE, 2);
        }
      }
    }
  }

  for (var treeIdx = 0; treeIdx < treeArt.crowns.length; treeIdx++) {
    var tree = treeArt.crowns[treeIdx];
    var treeSprite = tree.kind === 'pine' ? PixelArt.pine(tree.height, tree.variant) : PixelArt.crown(tree.tile, tree.variant);
    tileCtx.drawImage(PixelArt.tint(treeSprite, foliageLight),
      Math.floor(tree.x * TILE + 8 - cam.x + W / 2) - (tree.kind === 'pine' ? 64 : 56),
      Math.floor(tree.y * TILE - cam.y + H / 2) - (tree.kind === 'pine' ? 0 : 64));
  }

  // heart crystals
  for (var h = 0; h < world.heartCrystals.length; h++) {
    var hc = world.heartCrystals[h];
    var hpx = hc.x - cam.x + W / 2;
    var hpy = hc.y - cam.y + H / 2;
    if (hpx < -40 || hpy < -40 || hpx > W + 40 || hpy > H + 40) continue;
    drawHeartCrystal(tileCtx, hpx, hpy, Time.seconds);
  }

  // heart crystals
  for (var h = 0; h < world.heartCrystals.length; h++) {
    var hc = world.heartCrystals[h];
    var hpx = hc.x - cam.x + W / 2;
    var hpy = hc.y - cam.y + H / 2;
    if (hpx < -40 || hpy < -40 || hpx > W + 40 || hpy > H + 40) continue;
    drawHeartCrystal(tileCtx, hpx, hpy, Time.seconds);
  }

  if (game.event && game.event.type === 'oldonesarmy') drawOldOnesArmyWorld(game, tileCtx, cam, W, H);

  // --- entities ---
  for (var i = 0; i < game.entities.length; i++) {
    var e = game.entities[i];
    if (e.dead) continue;
    if (e.boss) drawBoss(game, tileCtx, e, cam, W, H);
    else drawEnemy(tileCtx, e, cam, W, H);
  }

  // placement preview ghost tile
  if (game.player && game.player.inventory) {
    var heldItem = game.player.inventory.selectedItem();
    if (heldItem && heldItem.tile !== undefined && !game.panelOpen) {
      var gtx = MOUSE.tpx, gty = MOUSE.tpy;
      var gpx = Math.floor(gtx * TILE - cam.x + W / 2);
      var gpy = Math.floor(gty * TILE - cam.y + H / 2);
      if (gpx > -TILE && gpx < W + TILE && gpy > -TILE && gpy < H + TILE) {
        var gRange = (heldItem.type === 'wall') ? 6 : 5;
        var gDist = dist(game.player.x, game.player.y, gtx * TILE + 8, gty * TILE + 8);
        var gCur = game.world.get(gtx, gty);
        var gCanPlace = gDist < gRange * TILE && !game.world.overlapsPlayer(gtx, gty, game.player);
        if (heldItem.type === 'block' || heldItem.type === 'pylon') gCanPlace = gCanPlace && gCur === T.AIR;
        if (heldItem.type === 'wall') gCanPlace = gCanPlace && game.world.wall(gtx, gty) === WALL.NONE;
        tileCtx.globalAlpha = 0.4;
        tileCtx.fillStyle = gCanPlace ? 'rgba(100,255,100,0.3)' : 'rgba(255,60,60,0.3)';
        tileCtx.fillRect(gpx, gpy, TILE, TILE);
        if (gCanPlace && SPRITES[heldItem.tile]) {
          tileCtx.globalAlpha = 0.35;
          tileCtx.drawImage(SPRITES[heldItem.tile][0], gpx, gpy);
        }
        tileCtx.globalAlpha = 1;
      }
    }
  }

  // Smart-mining preview uses the exact same read-only selector as the action.
  if (game.player.smartMine && !game.panelOpen && !game.player.dying) {
    var mineStack = game.player.inventory.selectedItem();
    var mineTool = mineStack && ITEMS[mineStack.id];
    if (mineTool && mineTool.type === 'tool') {
      var mineTarget = game.player.miningTarget(game, mineTool);
      if (mineTarget) {
        var mpx = Math.round(mineTarget.x * TILE - cam.x + W / 2), mpy = Math.round(mineTarget.y * TILE - cam.y + H / 2);
        tileCtx.save(); tileCtx.fillStyle = 'rgba(255,211,103,0.18)'; tileCtx.fillRect(mpx,mpy,TILE,TILE);
        tileCtx.strokeStyle = '#f9d579'; tileCtx.lineWidth = 2; tileCtx.strokeRect(mpx + 1,mpy + 1,TILE - 2,TILE - 2); tileCtx.restore();
      }
    }
  }

  // golf balls
  if (game.golf && game.golf.active) drawGolf(game, tileCtx, cam, W, H);

  // pickups
  for (var p = 0; p < game.pickups.length; p++) {
    var pk = game.pickups[p];
    var pkx = pk.x - cam.x + W / 2;
    var pky = pk.y - cam.y + H / 2 + Math.sin(Time.seconds * 3 + pk.seed) * 3;
    if (pkx < -20 || pky < -20 || pkx > W + 20 || pky > H + 20) continue;
    var it = ITEMS[pk.item];
    tileCtx.save();
    tileCtx.translate(pkx, pky);
    tileCtx.scale(1.1, 1.1);
    drawItemIcon(tileCtx, it, 0, 0);
    tileCtx.restore();
  }

  // players
  if (typeof Net !== 'undefined' && Net.isOnline()) {
    for (var remoteId in Net.remotePlayers) {
      var remotePlayer = Net.remotePlayers[remoteId];
      if (!remotePlayer.dying) drawPlayer(tileCtx, game, remotePlayer);
    }
  }
  if (!game.player.dying) drawPlayer(tileCtx, game, game.player);

  // projectiles
  for (var pr = 0; pr < game.projectiles.list.length; pr++) {
    drawProjectile(tileCtx, game.projectiles.list[pr], cam, W, H);
  }

  // fx
  drawFX(tileCtx, game, cam, W, H);

  // floating texts
  for (var ft = 0; ft < game.fxTexts.length; ft++) {
    var f = game.fxTexts[ft];
    var fx = f.x - cam.x + W / 2;
    var fy = f.y - cam.y + H / 2 - f.t * 30;
    tileCtx.font = 'bold 12px sans-serif';
    tileCtx.textAlign = 'center';
    tileCtx.fillStyle = f.color || '#ffe14d';
    tileCtx.strokeStyle = 'rgba(0,0,0,0.8)';
    tileCtx.lineWidth = 3;
    tileCtx.strokeText(f.text, fx, fy);
    tileCtx.fillText(f.text, fx, fy);
  }

  drawWeather(game, tileCtx, W, H);
  drawGraveyardMist(game, tileCtx, W, H);

  // lighting
  drawLighting(game, tileCtx, cam, W, H);
}

function drawGolf(game, ctx, cam, W, H) {
  var balls = game.golf.balls;
  for (var i = 0; i < balls.length; i++) {
    var b = balls[i];
    var px = b.x - cam.x + W / 2;
    var py = b.y - cam.y + H / 2 + Math.sin(Time.seconds * 2 + b.seed) * 1.5;
    if (px < -20 || py < -20 || px > W + 20 || py > H + 20) continue;
    ctx.fillStyle = '#f2f2f2';
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#c8c8c8';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#c8c8c8';
    ctx.beginPath();
    ctx.arc(px - 2, py - 2, 2, 0, Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px + 2, py + 1, 2, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.arc(px, py, 10 + 3 * Math.sin(Time.seconds * 4 + b.seed), 0, Math.PI * 2);
    ctx.stroke();
  }
}

// ---------- Background ----------
// blend two '#rrggbb' colors; amt=0 -> a, amt=1 -> b
function hexBlend(a, b, amt) {
  var ca = hexToRgb(a), cb = hexToRgb(b);
  var r = Math.round(ca[0] + (cb[0] - ca[0]) * amt);
  var g = Math.round(ca[1] + (cb[1] - ca[1]) * amt);
  var bl = Math.round(ca[2] + (cb[2] - ca[2]) * amt);
  return 'rgb(' + r + ',' + g + ',' + bl + ')';
}

// twilight window: 1.0 right at the transition edges (t=0.25 / 0.75), fading out over ~0.05
function twilightAmt(t) {
  var dawn = 1 - Math.min(1, Math.abs(t - 0.25) / 0.05);
  var dusk = 1 - Math.min(1, Math.abs(t - 0.75) / 0.05);
  return Math.max(dawn, dusk);
}




function drawBackground(game, ctx, cam, W, H, horizon) {
  var p = game.player;
  var currentBiome = game.world.biomeAt(p.x, p.y);
  var t = game.timeOfDay; // 0..1, 0=midnight 0.5=noon
  var night = t < 0.25 || t > 0.75;
  var twi = twilightAmt(t);

  var horizonScreen = horizon - cam.y + H / 2;
  var surfaceX0 = Math.max(0, Math.floor((cam.x - W / 2) / TILE) - 1);
  var surfaceX1 = Math.min(game.world.W - 1, Math.ceil((cam.x + W / 2) / TILE) + 1);
  var maxSurfaceScreen = -Infinity;
  for (var surfaceX = surfaceX0; surfaceX <= surfaceX1; surfaceX++) {
    maxSurfaceScreen = Math.max(maxSurfaceScreen, game.world.surfaceY[surfaceX] * TILE - cam.y + H / 2);
  }
  var skyVisible = maxSurfaceScreen > 0;

  if (skyVisible) {
    // surface sky (biome-tinted)
    var biome = currentBiome;
    var skyTop = night ? '#101a36' : '#568bb8', skyBot = night ? '#283752' : '#d7e6d6';
    if (biome === BIOME.CORRUPT || biome === BIOME.CRIMSON) {
      skyTop = night ? '#140a1e' : '#5a8a7a'; skyBot = night ? '#1e1230' : '#a8c4a8';
    } else if (biome === BIOME.HALLOW) {
      skyTop = night ? '#14103a' : '#7ac0ff'; skyBot = night ? '#1c1448' : '#e8c0ff';
    } else if (biome === BIOME.SNOW) {
      skyTop = night ? '#0c1030' : '#8ab8e8'; skyBot = night ? '#141c3c' : '#dceef8';
    } else if (biome === BIOME.JUNGLE) {
      skyTop = night ? '#0c1418' : '#6fb8a0'; skyBot = night ? '#121c24' : '#b8e0cc';
    }
    if (game.weather && game.weather.active) {
      skyTop = night ? '#101726' : '#657584';
      skyBot = night ? '#1b2635' : '#a9b5bc';
    }
    if (game.event && game.event.type === 'bloodmoon') {
      skyTop = '#21050c';
      skyBot = '#641725';
    }
    if (game.world.graveyardStrengthAt(p.x, p.y) >= 5 && !(game.event && game.event.type === 'bloodmoon')) {
      skyTop = night ? '#12131a' : '#59606a';
      skyBot = night ? '#252632' : '#9a9da3';
    }
    // smooth dawn/dusk: blend toward ember tones near the day/night transitions
    if (twi > 0 && !(game.event && game.event.type === 'bloodmoon')) {
      skyTop = hexBlend(skyTop, '#2a1e46', twi * 0.7);
      skyBot = hexBlend(skyBot, '#ff9a50', twi * 0.75);
    }
    var skyEnd = clamp(Math.max(horizonScreen, maxSurfaceScreen), 1, H);
    var g = ctx.createLinearGradient(0, 0, 0, skyEnd);
    g.addColorStop(0, skyTop);
    g.addColorStop(1, skyBot);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    drawSunMoon(ctx, W, horizonScreen, t, night);
    drawClouds(game, ctx, W, H, cam, horizonScreen);
    drawStars(ctx, W, horizonScreen, night, cam);
    drawStarfall(game, ctx, W, Math.max(0, horizonScreen));
    drawCelebrations(game, ctx, W, Math.max(0, horizonScreen));

    PixelArt.drawLandscape(ctx, biome, night, cam, W, H, horizonScreen);

    // Follow the actual surface profile so valleys retain sky instead of a flat underground band.
    var undergroundTop = clamp(horizonScreen, 0, H - 1);
    var ug = ctx.createLinearGradient(0, undergroundTop, 0, H);
    ug.addColorStop(0, '#4a3a2a');
    ug.addColorStop(1, '#1c1611');
    ctx.fillStyle = ug;
    for (surfaceX = surfaceX0; surfaceX <= surfaceX1; surfaceX++) {
      var surfaceScreenX = Math.floor(surfaceX * TILE - cam.x + W / 2);
      var localHorizon = Math.floor(game.world.surfaceY[surfaceX] * TILE - cam.y + H / 2);
      var fillTop = Math.max(0, localHorizon);
      if (fillTop < H) ctx.fillRect(surfaceScreenX, fillTop, TILE + 1, H - fillTop);
    }
  } else {
    // fully underground
    var g2 = ctx.createLinearGradient(0, 0, 0, H);
    g2.addColorStop(0, currentBiome === BIOME.UNDERWORLD ? '#38140f' : '#1c1815');
    g2.addColorStop(1, currentBiome === BIOME.UNDERWORLD ? '#120706' : '#0e0c0a');
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, W, H);
    // deep glow tint
    ctx.fillStyle = currentBiome === BIOME.UNDERWORLD ? 'rgba(255,80,20,0.08)' : 'rgba(120,60,255,0.03)';
    ctx.fillRect(0, 0, W, H);
    PixelArt.drawCavern(ctx, currentBiome, cam, W, H);
  }

  // out-of-world void at map edges
  var edge = (cam.x - W / 2) < 0;
  if (edge) {
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, Math.max(0, -cam.x + W / 2), H);
  }
  edge = (cam.x + W / 2) > game.world.W * TILE;
  if (edge) {
    ctx.fillRect(cam.x + W / 2 - game.world.W * TILE, 0, W, H);
  }
}

function drawCelebrations(game, ctx, W, horizonY) {
  if (game.party && game.party.active) {
    var partyColors = ['#ff5c8a','#6bc8ff','#ffe14d','#6bff8a','#c86bff'];
    for (var i = 0; i < 22; i++) {
      var ps = hash2(i + 421, i * 31 + 7);
      var px = (ps % 1000) / 1000 * W;
      var py = horizonY - ((Time.seconds * (9 + i % 5) + ((ps >>> 8) % 500)) % Math.max(80, horizonY + 40));
      ctx.fillStyle = partyColors[i % partyColors.length];
      ctx.beginPath(); ctx.ellipse(px, py, 4, 5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px, py + 5); ctx.lineTo(px + Math.sin(Time.seconds + i) * 3, py + 15); ctx.stroke();
    }
  }
  if (game.lanternNight && game.lanternNight.active) {
    for (var j = 0; j < 34; j++) {
      var ls = hash2(j + 701, j * 17 + 11);
      var lx = (ls % 1000) / 1000 * W;
      var ly = horizonY - ((Time.seconds * (13 + j % 4) + ((ls >>> 9) % 700)) % Math.max(100, horizonY + 70));
      var glow = 0.65 + Math.sin(Time.seconds * 3 + j) * 0.2;
      ctx.fillStyle = 'rgba(255,176,72,' + (glow * 0.25) + ')';
      ctx.beginPath(); ctx.arc(lx, ly, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,205,105,' + glow + ')'; ctx.fillRect(lx - 3, ly - 4, 6, 8);
      ctx.fillStyle = '#fff0b0'; ctx.fillRect(lx - 1, ly - 2, 2, 3);
    }
  }
}

function drawStarfall(game, ctx, W, horizonY) {
  if (!game.starfall || !game.starfall.active || horizonY <= 0) return;
  ctx.save();
  for (var i = 0; i < 14; i++) {
    var seed = hash2(i + 911, i * 29 + 13);
    var cycle = (Time.seconds * (90 + i * 3) + seed % 900) % (W + horizonY + 260);
    var x = W + 100 - cycle;
    var y = -80 + cycle * 0.38 + ((seed >>> 9) % 120);
    if (x < -80 || y > horizonY) continue;
    ctx.strokeStyle = 'rgba(255,238,170,' + (0.35 + (i % 3) * 0.15) + ')';
    ctx.lineWidth = i % 4 === 0 ? 2 : 1;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 28, y - 11); ctx.stroke();
  }
  ctx.restore();
}

function drawSunMoon(ctx, W, horizonY, t, night) {
  var posX, cy;
  if (night) {
    var nt = t < 0.5 ? t + 1 : t;
    var prog = (nt - 0.75) / 0.5;
    posX = W * (0.15 + 0.7 * prog);
    cy = horizonY - 60 - Math.max(100, horizonY * 0.65) * Math.sin(prog * Math.PI);
    if (posX < -60 || posX > W + 60) return;
    // cool silver halo
    var halo = ctx.createRadialGradient(posX, cy, 10, posX, cy, 70);
    halo.addColorStop(0, 'rgba(210,225,255,0.35)');
    halo.addColorStop(1, 'rgba(210,225,255,0)');
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(posX, cy, 70, 0, Math.PI * 2); ctx.fill();
    PixelArt.celestial(ctx, posX, cy, true);
  } else {
    var prog2 = (t - 0.25) / 0.5;
    posX = W * (0.15 + 0.7 * prog2);
    cy = horizonY - 60 - Math.max(110, horizonY * 0.65) * Math.sin(prog2 * Math.PI);
    if (posX < -60 || posX > W + 60) return;
    // warm halo; redder near the horizon (sunrise/sunset)
    var low = Math.max(0, Math.min(1, 1 - Math.sin(prog2 * Math.PI)));
    var glow = ctx.createRadialGradient(posX, cy, 12, posX, cy, 90 + low * 30);
    glow.addColorStop(0, 'rgba(255,' + Math.floor(215 - low * 90) + ',' + Math.floor(94 - low * 60) + ',0.4)');
    glow.addColorStop(1, 'rgba(255,180,80,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(posX, cy, 90 + low * 30, 0, Math.PI * 2); ctx.fill();
    PixelArt.celestial(ctx, posX, cy, false);
  }
}

function drawStars(ctx, W, horizonY, night, cam) {
  if (!night) return;
  for (var i = 0; i < 110; i++) {
    var sx = (hash2(i, 3) % 1000) / 1000 * W;
    var sy = (hash2(i, 9) % 1000) / 1000 * (horizonY * 0.8);
    // slow parallax drift so the sky feels alive when moving
    sx = ((sx - cam.x * 0.02) % W + W) % W;
    var tw = 0.5 + 0.5 * Math.sin(Time.seconds * (1.4 + (i % 5) * 0.5) + i * 2.39996);
    var big = i % 17 === 0;
    if (big && tw > 0.82) {
      // four-point sparkle on the brightest stars
      ctx.strokeStyle = 'rgba(230,240,255,' + ((tw - 0.82) * 4) + ')';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sx - 4, sy); ctx.lineTo(sx + 4, sy);
      ctx.moveTo(sx, sy - 4); ctx.lineTo(sx, sy + 4);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,255,255,' + (0.35 + tw * 0.45) + ')';
    ctx.fillRect(sx, sy, big ? 2 : 2, big ? 2 : 1);
  }
}

function drawClouds(game, ctx, W, H, cam, horizonY) {
  for (var i = 0; i < Math.min(8, game.clouds.length); i++) {
    var c = game.clouds[i];
    var drift = game.weather ? game.weather.windSpeed * Time.seconds * 0.45 : 0;
    var x = c.x - cam.x * c.parallax + W / 2 + drift;
    x = ((x + 160) % (W + 320) + W + 320) % (W + 320) - 160;
    // Cloud heights are sky-relative, not world-space (the old transform put
    // almost every cloud above the viewport at a normal surface camera).
    var y = 24 + c.y * 1.1 + (horizonY - H * 0.65) * 0.08;
    if (y > horizonY - 10) continue;
    var night = game.timeOfDay < 0.25 || game.timeOfDay > 0.75;
    var cloudArt = PixelArt.cloud(i % 4, night);
    var cloudScale = c.w > 48 ? 2 : 1;
    ctx.drawImage(cloudArt, Math.floor(x - cloudArt.width * cloudScale / 2), Math.floor(y - 17 * cloudScale), cloudArt.width * cloudScale, cloudArt.height * cloudScale);
  }
}

function drawWeather(game, ctx, W, H) {
  var kind = weatherKindAt(game, game.player.x, game.player.y);
  var windy = isWindyDayAt(game, game.player.x, game.player.y);
  if (windy) {
    var leafWind = game.weather.windSpeed < 0 ? -1 : 1;
    var leafSpeed = 180 + Math.abs(game.weather.windSpeed) * 5;
    ctx.save();
    for (var li = 0; li < 34; li++) {
      var leafSeed = hash2(li + 311, li * 19 + 5);
      var lx = ((leafSeed % 1000) / 1000 * (W + 160) + Time.seconds * leafWind * leafSpeed) % (W + 160) - 80;
      if (lx < -80) lx += W + 160;
      var ly = (((leafSeed >>> 9) % 1000) / 1000 * H + Math.sin(Time.seconds * 3 + li) * 18) % H;
      ctx.save(); ctx.translate(lx, ly); ctx.rotate(Time.seconds * leafWind * 8 + li);
      ctx.fillStyle = li % 3 === 0 ? 'rgba(210,170,70,0.7)' : 'rgba(90,160,70,0.7)';
      ctx.fillRect(-4, -1.5, 8, 3); ctx.restore();
    }
    ctx.restore();
  }
  if (!kind) return;
  var intensity = game.weather.intensity || 0;
  var wind = game.weather.wind || 1;
  var count = Math.floor(45 + intensity * 55);
  ctx.save();
  for (var i = 0; i < count; i++) {
    var seed = hash2(i + 77, i * 13 + 9);
    var speed = kind === 'rain' ? 520 : (kind === 'blizzard' ? 150 : 230);
    var x = ((seed % 1000) / 1000 * (W + 180) + Time.seconds * wind * speed * 0.35) % (W + 180) - 90;
    if (x < -90) x += W + 180;
    var y = (((seed >>> 10) % 1000) / 1000 * (H + 100) + Time.seconds * speed) % (H + 100) - 50;
    if (kind === 'rain') {
      ctx.strokeStyle = 'rgba(170,210,240,' + (0.25 + intensity * 0.45) + ')';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + wind * 8, y + 20); ctx.stroke();
    } else if (kind === 'blizzard') {
      ctx.fillStyle = 'rgba(240,250,255,' + (0.35 + intensity * 0.5) + ')';
      ctx.beginPath(); ctx.arc(x, y, 1.5 + (seed % 3), 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.strokeStyle = 'rgba(226,194,120,' + (0.22 + intensity * 0.42) + ')';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + wind * 24, y + 4); ctx.stroke();
    }
  }
  ctx.restore();
}

function drawGraveyardMist(game, ctx, W, H) {
  var strength = game.world.graveyardStrengthAt(game.player.x, game.player.y);
  if (strength < 5) return;
  var intensity = clamp((Math.min(9, strength) - 4) / 5, 0, 1);
  ctx.save();
  ctx.fillStyle = 'rgba(115,120,132,' + (0.08 + intensity * 0.12) + ')';
  ctx.fillRect(0, 0, W, H);
  for (var i = 0; i < 24; i++) {
    var seed = hash2(i + 1201, i * 23 + 3);
    var x = ((seed % 1000) / 1000 * (W + 180) + Time.seconds * (8 + i % 4)) % (W + 180) - 90;
    var y = H * (0.58 + ((seed >>> 10) % 350) / 1000);
    ctx.fillStyle = 'rgba(210,215,225,' + (0.025 + intensity * 0.045) + ')';
    ctx.beginPath(); ctx.ellipse(x, y, 45 + seed % 45, 9 + seed % 9, 0, 0, Math.PI * 2); ctx.fill();
  }
  for (var w = 0; w < 8; w++) {
    var wx = (hash2(w + 1301, 7) % W + Math.sin(Time.seconds * 0.8 + w) * 30 + W) % W;
    var wy = (hash2(w + 1301, 11) % Math.max(80, H - 80)) + Math.sin(Time.seconds * 1.4 + w) * 15;
    ctx.fillStyle = 'rgba(220,225,240,' + (0.08 + intensity * 0.14) + ')';
    ctx.beginPath(); ctx.arc(wx, wy, 2 + w % 3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

// ---------- Lighting ----------
// Terraria-style per-tile light propagation:
// 1. Seed light sources: sky-exposed air (daylight), torches, lava, emissive ores, player aura.
// 2. Propagate tile-to-tile with 4-directional sweeps — light decays slowly through
//    open tiles and fast through solid blocks, so caves go pitch black.
// 3. Build a 1px-per-tile lightmap and stretch it over the screen with smoothing,
//    black alpha = 1 - light (Terraria "Color" mode rendering).
var LIGHT_AIR_DECAY = 0.075;   // ~13 tiles of torch reach through open space
var LIGHT_WALL_DECAY = 0.08;   // a lit shelter should remain readable to its floor
var LIGHT_SOLID_DECAY = 0.36;  // solid rock chokes light in ~2-3 tiles (Terraria surface fade)
var LIGHT_LIQUID_DECAY = 0.14; // water dims light
var LIGHT_PAD = 16;            // tiles of margin around the viewport

function drawLighting(game, ctx, cam, W, H) {
  var world = game.world;
  var x0 = Math.max(0, Math.floor((cam.x - W / 2) / TILE) - LIGHT_PAD);
  var x1 = Math.min(world.W - 1, Math.ceil((cam.x + W / 2) / TILE) + LIGHT_PAD);
  var y0 = Math.max(0, Math.floor((cam.y - H / 2) / TILE) - LIGHT_PAD);
  var y1 = Math.min(world.H - 1, Math.ceil((cam.y + H / 2) / TILE) + LIGHT_PAD);
  var tw = x1 - x0 + 1, th = y1 - y0 + 1;
  var n = tw * th;

  // NaN hardening: a non-finite camera poisons the light window and would
  // crash on createImageData(NaN, NaN). Bail out this frame instead.
  if (!isFinite(n) || tw <= 0 || th <= 0 || n <= 0) {
    if (!drawLighting._warnedOnNaN) {
      drawLighting._warnedOnNaN = true;
      console.warn('drawLighting skipped: non-finite camera window');
    }
    return;
  }

  if (!game.lightBuf || game.lightBuf.length !== n) {
    game.lightBuf = new Float32Array(n);
    game.lightDecay = new Float32Array(n);
    game.lightMapCanvas = document.createElement('canvas');
    game.lightMapImg = null;
  }
  if (!game.lightMapCanvas || game.lightMapCanvas.width !== tw || game.lightMapCanvas.height !== th) {
    game.lightMapCanvas = document.createElement('canvas');
    game.lightMapCanvas.width = tw; game.lightMapCanvas.height = th;
    game.lightMapImg = null;
  }
  var lmc = game.lightMapCanvas.getContext('2d');
  if (!game.lightMapImg || game.lightMapImg.width !== tw || game.lightMapImg.height !== th) {
    game.lightMapImg = lmc.createImageData(tw, th);
  }
  var light = game.lightBuf, decay = game.lightDecay;
  var tiles = world.tiles, walls = world.walls, wW = world.W;
  var surfaceArr = world.surfaceY;

  // --- sky brightness by time of day ---
  var t = game.timeOfDay; // 0=midnight, 0.5=noon
  var dayX = Math.abs(t - 0.5) * 2; // 0 noon .. 1 midnight
  var day = Math.min(1, Math.max(0, (0.62 - dayX) / 0.24));
  var sky = 0.12 + 0.88 * day;      // moonlight keeps the surface faintly visible
  if (game.weather && game.weather.active) sky *= 1 - 0.3 * game.weather.intensity;
  var bloodMoon = game.event && game.event.type === 'bloodmoon';
  if (bloodMoon) sky = Math.max(sky, 0.22);

  // --- decay map ---
  for (var ty = 0; ty < th; ty++) {
    var wy = y0 + ty;
    for (var tx = 0; tx < tw; tx++) {
      var wx = x0 + tx;
      var i = ty * tw + tx;
      var tl = tiles[wy * wW + wx];
      if (world.isSolidTile(tl)) {
        decay[i] = LIGHT_SOLID_DECAY;
        light[i] = 0;
      } else {
        decay[i] = LIGHT_AIR_DECAY;
        if (walls[wy * wW + wx] !== 0) decay[i] = LIGHT_WALL_DECAY;
        if (tl === T.WATER || tl === T.HONEY || tl === T.SHIMMER) decay[i] = LIGHT_LIQUID_DECAY;
        light[i] = 0;
      }
    }
  }

  // --- sunlight: every tile above the first solid tile from the sky is day-lit
  // (open shafts and overhangs stay lit; sealed caves stay dark) ---
  for (var sx2 = 0; sx2 < tw; sx2++) {
    var colX = x0 + sx2;
    var skyTop = world.skyTopAt(colX);
    if (skyTop < y0) continue; // column is entirely below the sky-open zone
    var yyEnd = Math.min(y1, skyTop);
    for (var yy = y0; yy <= yyEnd; yy++) {
      var ii = (yy - y0) * tw + sx2;
      light[ii] = Math.max(light[ii], sky);
    }
  }

  // --- torches, lava, emissive ores ---
  for (var sy = y0; sy <= y1; sy++) {
    var rowBase = sy * wW;
    for (var sx = x0; sx <= x1; sx++) {
      var tl3 = tiles[rowBase + sx];
      var li = (sy - y0) * tw + (sx - x0);
      if (tl3 === T.TORCH) light[li] = 1;
      else if (tl3 === T.LAVA) light[li] = Math.max(light[li], 0.75);
      else {
        var og2 = EMISSIVE_ORE_GLOW[tl3];
        if (og2) light[li] = Math.max(light[li], og2.strength);
      }
    }
  }
  // dynamic world lights (placed torches register here too)
  var wl = world.lights;
  for (var li2 = 0; li2 < wl.length; li2++) {
    var lgt = wl[li2];
    var ltx = Math.floor(lgt.x / TILE) - x0, lty = Math.floor(lgt.y / TILE) - y0;
    if (ltx < 0 || lty < 0 || ltx >= tw || lty >= th) continue;
    light[lty * tw + ltx] = Math.max(light[lty * tw + ltx], 1);
  }
  // player light: only when holding a light source (torch, glowstick, etc.)
  var heldItem2 = game.player.inventory.selectedItem();
  var heldDef2 = heldItem2 ? ITEMS[heldItem2.id] : null;
  var heldLight = heldDef2 && (heldDef2.tile === T.TORCH || heldDef2.tile === T.GLOWSTONE || heldDef2.lightRadius);
  var ptx = Math.floor(game.player.x / TILE) - x0, pty = Math.floor(game.player.y / TILE) - y0;
  if (ptx >= 0 && pty >= 0 && ptx < tw && pty < th) {
    var playerLight = heldLight ? 0.85 : 0;
    light[pty * tw + ptx] = Math.max(light[pty * tw + ptx], playerLight);
  }

  // --- propagation: 2 iterations of 4 directional sweeps ---
  for (var iter = 0; iter < 2; iter++) {
    // left -> right
    for (var py = 0; py < th; py++) {
      var row = py * tw;
      for (var px = 1; px < tw; px++) {
        var v = light[row + px - 1] - decay[row + px];
        if (v > light[row + px]) light[row + px] = v;
      }
    }
    // right -> left
    for (py = 0; py < th; py++) {
      row = py * tw;
      for (px = tw - 2; px >= 0; px--) {
        v = light[row + px + 1] - decay[row + px];
        if (v > light[row + px]) light[row + px] = v;
      }
    }
    // top -> bottom
    for (px = 0; px < tw; px++) {
      for (py = 1; py < th; py++) {
        v = light[(py - 1) * tw + px] - decay[py * tw + px];
        if (v > light[py * tw + px]) light[py * tw + px] = v;
      }
    }
    // bottom -> top
    for (px = 0; px < tw; px++) {
      for (py = th - 2; py >= 0; py--) {
        v = light[(py + 1) * tw + px] - decay[py * tw + px];
        if (v > light[py * tw + px]) light[py * tw + px] = v;
      }
    }
  }

  // --- build 1px-per-tile lightmap ---
  var img = game.lightMapImg, data = img.data;
  for (ty = 0; ty < th; ty++) {
    for (tx = 0; tx < tw; tx++) {
      var mi = (ty * tw + tx) * 4;
      var lv = light[ty * tw + tx];
      if (lv < 0) lv = 0; else if (lv > 1) lv = 1;
      lv = Math.pow(lv, 0.8); // lift lit midtones without revealing unlit caves
      var a = (1 - lv) * 255;
      // only exempt open sky tiles that are above the surface (no wall, no solid, above terrain)
      var wy = y0 + ty, wx2 = x0 + tx;
      if (wy < world.W && walls[wy * wW + wx2] === 0 && !world.isSolidTile(tiles[wy * wW + wx2])) {
        var tlA = tiles[wy * wW + wx2];
        var surfY = world.surfaceY ? world.surfaceY[wx2] : 0;
        // Above-ground foliage is ambient-tinted as a complete silhouette.
        // Tile-shaped darkness here would stamp black rectangles into crowns
        // that extend beyond the original, smaller leaf-tile footprint.
        if ((tlA === 0 || tlA === T.TORCH || tlA === T.PLATFORM || tlA === T.TREETRUNK || PixelArt.isLeaf(tlA)) && wy <= surfY) a = 0;
      }
      data[mi] = 0;
      data[mi + 1] = 0;
      data[mi + 2] = 4;
      data[mi + 3] = a;
    }
  }
  lmc.putImageData(img, 0, 0);

  // --- stretch the lightmap over the screen (smooth interpolation, like Terraria Color mode) ---
  var destX = Math.floor(x0 * TILE - cam.x + W / 2);
  var destY = Math.floor(y0 * TILE - cam.y + H / 2);
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(game.lightMapCanvas, destX, destY, tw * TILE, th * TILE);
  ctx.restore();

  // re-scan visible ores for halos (screen coords); dedupe via a coarse grid so
  // dense hellstone fields don't create hundreds of overlapping gradients
  var haloGrid = {};
  var haloCount = 0;
  for (var hy = Math.max(0, y0); hy <= y1; hy++) {
    for (var hx = Math.max(0, x0); hx <= x1; hx++) {
      var ogDef = EMISSIVE_ORE_GLOW[tiles[hy * wW + hx]];
      if (!ogDef) continue;
      var hxp = hx * TILE + 8 - cam.x + W / 2;
      var hyp = hy * TILE + 8 - cam.y + H / 2;
      if (hxp < -ogDef.r || hxp > W + ogDef.r || hyp < -ogDef.r || hyp > H + ogDef.r) continue;
      var gx = (hxp / 64) | 0, gy = (hyp / 64) | 0;
      var dup = false;
      for (var oy2 = -1; oy2 <= 1 && !dup; oy2++) {
        for (var ox2 = -1; ox2 <= 1 && !dup; ox2++) {
          var bucket = haloGrid[(gx + ox2) + ',' + (gy + oy2)];
          if (!bucket) continue;
          for (var hi2 = 0; hi2 < bucket.length; hi2++) {
            var ddx = hxp - bucket[hi2].x, ddy = hyp - bucket[hi2].y;
            if (ddx * ddx + ddy * ddy < ogDef.r * ogDef.r * 0.64) { dup = true; break; }
          }
        }
      }
      if (dup || haloCount >= 90) continue;
      var key = gx + ',' + gy;
      (haloGrid[key] = haloGrid[key] || []).push({ x: hxp, y: hyp, def: ogDef });
      haloCount++;
    }
  }
  for (var gk in haloGrid) {
    var bucket2 = haloGrid[gk];
    for (hi2 = 0; hi2 < bucket2.length; hi2++) {
      var hg = bucket2[hi2], hc = hg.def.color, hr = hg.def.r;
      var halo = ctx.createRadialGradient(hg.x, hg.y, 0, hg.x, hg.y, hr);
      halo.addColorStop(0, 'rgba(' + hc[0] + ',' + hc[1] + ',' + hc[2] + ',0.24)');
      halo.addColorStop(1, 'rgba(' + hc[0] + ',' + hc[1] + ',' + hc[2] + ',0)');
      ctx.fillStyle = halo;
      ctx.fillRect(hg.x - hr, hg.y - hr, hr * 2, hr * 2);
    }
  }

  // warm torch and lava glow halos (sparse scan — only visible tiles)
  var torchHaloR = 52, lavaHaloR = 44;
  var torchHaloCount = 0;
  for (var sy2 = Math.max(0, y0); sy2 <= y1 && torchHaloCount < 50; sy2++) {
    for (var sx2 = Math.max(0, x0); sx2 <= x1 && torchHaloCount < 50; sx2++) {
      var tl4 = tiles[sy2 * wW + sx2];
      if (tl4 === T.TORCH) {
        var txp = sx2 * TILE + 8 - cam.x + W / 2;
        var typ = sy2 * TILE + 8 - cam.y + H / 2;
        if (txp < -torchHaloR || txp > W + torchHaloR || typ < -torchHaloR || typ > H + torchHaloR) continue;
        var thG = ctx.createRadialGradient(txp, typ, 0, txp, typ, torchHaloR);
        thG.addColorStop(0, 'rgba(255,190,90,0.12)');
        thG.addColorStop(0.5, 'rgba(255,160,60,0.06)');
        thG.addColorStop(1, 'rgba(255,140,40,0)');
        ctx.fillStyle = thG;
        ctx.fillRect(txp - torchHaloR, typ - torchHaloR, torchHaloR * 2, torchHaloR * 2);
        torchHaloCount++;
      } else if (tl4 === T.LAVA) {
        var lxp = sx2 * TILE + 8 - cam.x + W / 2;
        var lyp = sy2 * TILE + 8 - cam.y + H / 2;
        if (lxp < -lavaHaloR || lxp > W + lavaHaloR || lyp < -lavaHaloR || lyp > H + lavaHaloR) continue;
        var lvG = ctx.createRadialGradient(lxp, lyp, 0, lxp, lyp, lavaHaloR);
        lvG.addColorStop(0, 'rgba(255,100,30,0.10)');
        lvG.addColorStop(1, 'rgba(255,60,10,0)');
        ctx.fillStyle = lvG;
        ctx.fillRect(lxp - lavaHaloR, lyp - lavaHaloR, lavaHaloR * 2, lavaHaloR * 2);
        torchHaloCount++;
      }
    }
  }

  // held torch glow around the player
  if (heldLight) {
    var phx = game.player.x - cam.x + W / 2;
    var phy = game.player.y - cam.y + H / 2;
    var phR = 72;
    var phG = ctx.createRadialGradient(phx, phy, 0, phx, phy, phR);
    phG.addColorStop(0, 'rgba(255,200,100,0.15)');
    phG.addColorStop(0.6, 'rgba(255,170,70,0.06)');
    phG.addColorStop(1, 'rgba(255,140,40,0)');
    ctx.fillStyle = phG;
    ctx.fillRect(phx - phR, phy - phR, phR * 2, phR * 2);
  }
}

// ---------- Heart crystal ----------
function drawHeartCrystal(ctx, x, y, t) {
  var pulse = 1 + Math.sin(t * 2) * 0.08;
  ctx.save();
  ctx.translate(x, y + 6);
  ctx.scale(pulse, pulse);
  ctx.fillStyle = '#ff5c8a';
  ctx.beginPath();
  ctx.moveTo(0, 5);
  ctx.quadraticCurveTo(-9, -4, 0, -8);
  ctx.quadraticCurveTo(9, -4, 0, 5);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.beginPath();
  ctx.arc(-2, -3, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ---------- Entities drawing ----------
function drawEnemy(ctx, e, cam, W, H) {
  // Cull segmented artwork per live part, not by the offscreen head alone.
  if (CombatArt.drawSegmentedEnemy(ctx, game, e, cam, W, H)) return;
  var x = e.x - cam.x + W / 2;
  var y = e.y - cam.y + H / 2;
  var margin = e.ooaSentry && e.sentry === 'lightningaura' ? 104 : 80;
  if (x < -margin || y < -margin || x > W + margin || y > H + margin) return;
  if (e.ghost) ctx.globalAlpha = 0.6;

  if (e.ooaSentry) {
    drawOldOnesArmySentry(ctx, e, cam, W, H);
    if (e.ghost) ctx.globalAlpha = 1;
    return;
  }
  if (e.ooaEnemy) {
    drawOldOnesArmyEnemy(ctx, e, cam, W, H);
    if (e.ghost) ctx.globalAlpha = 1;
    return;
  }

  if (e.minion) {
    var mcol = e.flash > 0 ? '#fff' : e.color;
    if (e.minion === 'dragon') {
      for (var si = e.segments.length - 1; si >= 0; si--) {
        var sg = e.segments[si];
        var sx = sg.x - cam.x + W / 2, sy = sg.y - cam.y + H / 2;
        ctx.fillStyle = mcol;
        ctx.beginPath();
        ctx.ellipse(sx, sy, 10, 7, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = mcol;
      ctx.beginPath();
      ctx.ellipse(x, y, 14, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x - 5, y - 2, 3, 0, Math.PI * 2);
      ctx.arc(x + 5, y - 2, 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.beginPath();
      ctx.arc(x, y, e.w / 2 + 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = mcol;
      ctx.beginPath();
      ctx.arc(x, y, e.w / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#111';
      ctx.beginPath();
      ctx.arc(x - 3, y - 2, 2, 0, Math.PI * 2);
      ctx.arc(x + 3, y - 2, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    return;
  }

  if (CombatArt.drawEnemy(ctx, game, e, cam, W, H)) {
    if (e.ghost) ctx.globalAlpha = 1;
    return;
  }

  var white = e.flash > 0;
  var col = white ? '#ffffff' : e.color;

  switch (e.type) {
    case E.SLIME: case E.PINKSLIME: case E.HOPPINJACK:
      drawSlime(ctx, x, y, e.w, e.h, col, e.type);
      break;
    case E.ZOMBIE: case E.HARDZOMBIE:
      drawHumanoid(ctx, x, y, col, e.type === E.HARDZOMBIE, e.dir, false, '#92a578');
      break;
    case E.DUNGEONGUARDIAN:
      // Solid skull silhouette despite its wall-passing movement.
      ctx.globalAlpha = 1;
      ctx.fillStyle = white ? '#fff' : '#d0c8b8';
      ctx.beginPath();
      ctx.ellipse(x, y - 5, e.w / 2, e.h / 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(x - 13, y + 10, 26, 13);
      ctx.fillStyle = '#321c24';
      ctx.beginPath();
      ctx.ellipse(x - 8, y - 7, 6, 7, 0, 0, Math.PI * 2);
      ctx.ellipse(x + 8, y - 7, 6, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ff3030';
      ctx.fillRect(x - 10, y - 8, 4, 4);
      ctx.fillRect(x + 6, y - 8, 4, 4);
      ctx.fillStyle = '#321c24';
      ctx.fillRect(x - 2, y + 2, 4, 5);
      for (var tooth = -9; tooth <= 9; tooth += 6) ctx.fillRect(x + tooth, y + 15, 2, 8);
      break;
    case E.WRATH:
      ctx.fillStyle = col;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.arc(x, y, e.w / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = '#1a1a2a';
      ctx.beginPath();
      ctx.arc(x - 4, y - 3, 3, 0, Math.PI * 2);
      ctx.arc(x + 4, y - 3, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      break;
    case E.GHOST:
      ctx.globalAlpha = 0.55;
      drawHumanoid(ctx, x, y, col, false, e.dir, true);
      ctx.fillStyle = '#20202a';
      ctx.beginPath(); ctx.arc(x - 3, y - 5, 2, 0, Math.PI * 2); ctx.arc(x + 3, y - 5, 2, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
      break;
    case E.EATEROFSOULS:
      drawFlyingWinged(ctx, x, y, e.w, col, '#4a3d6a');
      break;
    case E.CORRUPTOR:
      drawCorruptor(ctx, x, y, e.w, col);
      break;
    case E.DEVOURER:
      drawFlyingWinged(ctx, x, y, e.w, col, '#4a365f');
      break;
    case E.PIXIE:
      drawPixie(ctx, x, y, Time.seconds, col);
      break;
    case E.UNICORN:
      drawUnicorn(ctx, x, y, e.dir, col, e.state);
      break;
    case E.CHAOSELEMENTAL:
      drawChaos(ctx, x, y, col);
      break;
    case E.GASTROPOD:
      drawGastropod(ctx, x, y, e.w, col);
      break;
    case E.GUIDE:
      drawGuide(ctx, x, y, e.dir);
      break;
    case E.WYVERN:
      drawWyvern(ctx, e, cam, W, H, Time.seconds);
      break;
    case E.JUNGLEBAT:
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(x, y, e.w / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#5a3d1a';
      ctx.beginPath();
      ctx.arc(x - 4, y - 2, 2, 0, Math.PI * 2);
      ctx.arc(x + 4, y - 2, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(x - e.w / 2, y - 4);
      ctx.lineTo(x - e.w / 2 - 6, y + 4);
      ctx.lineTo(x - e.w / 2 + 2, y);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + e.w / 2, y - 4);
      ctx.lineTo(x + e.w / 2 + 6, y + 4);
      ctx.lineTo(x + e.w / 2 - 2, y);
      ctx.fill();
      break;
    case E.JUNGLESLIME:
      drawSlime(ctx, x, y, e.w, e.h, col, e.type);
      break;
    case E.HORNET:
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(x, y, e.w / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffd54d';
      ctx.beginPath();
      ctx.arc(x, y, e.w / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = col;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(e.dir || 0);
      ctx.beginPath();
      ctx.moveTo(0, -e.w / 2 - 4);
      ctx.lineTo(-3, -e.w / 2 + 2);
      ctx.lineTo(3, -e.w / 2 + 2);
      ctx.fill();
      ctx.restore();
      break;
    case E.LIHZARD:
      drawHumanoid(ctx, x, y, col, true, e.dir, true);
      break;
    case E.FLYINGSNAKE:
      drawWyvern(ctx, e, cam, W, H, Time.seconds);
      break;
    case E.FRANKENSTEIN:
      drawHumanoid(ctx, x, y, col, true, e.dir, false);
      break;
    case E.REAPER:
      ctx.fillStyle = col;
      ctx.fillRect(x - e.w / 2, y - e.h / 2, e.w, e.h);
      ctx.fillStyle = '#1a1a2a';
      ctx.beginPath();
      ctx.arc(x - 5, y - 4, 3, 0, Math.PI * 2);
      ctx.arc(x + 5, y - 4, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    case E.VAMPIRE:
      drawHumanoid(ctx, x, y, col, true, e.dir, false);
      ctx.fillStyle = '#8a0a0a';
      ctx.fillRect(x - 2, y - e.h / 2 + 4, 4, 6);
      break;
    case E.CORITE:
      ctx.fillStyle = col;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Time.seconds * 3);
      ctx.fillRect(-e.w / 2, -3, e.w, 6);
      ctx.fillRect(-3, -e.h / 2, 6, e.h);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = '#ffe9a8';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    case E.LUNARFLAME:
      ctx.fillStyle = col;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(x, y, e.w / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y, e.w / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = e.ghost ? 0.6 : 1;
      break;
    case E.MUMMY: case E.LIGHTMUMMY: case E.DARKMUMMY: case E.BLOODMUMMY:
      drawHumanoid(ctx, x, y, col, true, e.dir, false);
      break;
    case E.SKELETONARCHER: case E.ARMOREDBONES: case E.UNDEADMINER:
      drawHumanoid(ctx, x, y, col, true, e.dir, false);
      break;
    case E.GIANTBAT: case E.ICEBAT:
      drawFlyingWinged(ctx, x, y, e.w, col, '#3a3a4a');
      break;
    case E.TOXICSLUDGE:
      drawSlime(ctx, x, y, e.w, e.h, col, e.type);
      break;
    case E.PIGRON:
      drawFlyingWinged(ctx, x, y, e.w, col, '#e08aa0');
      ctx.fillStyle = '#8a4a5a';
      ctx.beginPath();
      ctx.ellipse(x + e.w / 4, y, 3, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case E.ICEGOLEM:
      drawHumanoid(ctx, x, y, col, false, e.dir, false);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - 8, y - 24, 16, 6);
      break;
    case E.ICETORTOISE: case E.GIANTTORTOSE:
      drawTortoise(ctx, x, y, e.w, e.h, col);
      break;
    case E.HOPLITE: case E.ICYMERMAN: case E.GIANTSHELLY: case E.SANDPOACHER:
    case E.SANDSHARK: case E.CRYSTALTHRESHER: case E.ANOMURAFUNGUS: case E.SKELMERCHANT:
    case E.ROCKGOLEM: case E.POSSESSEDARMOR: case E.GHOUL: case E.DREAMERGHOUL: case E.LAMIA:
    case E.FUNGIBULB: case E.GIANTFUNGI: case E.SPORESKELETON: case E.CORRUPTBUNNY:
    case E.CORRUPTPENGUIN: case E.RUNEWIZARD: case E.TORTUREDSOUL:
      drawHumanoid(ctx, x, y, col, false, e.dir, false);
      break;
    case E.COCHINEALBEETLE: case E.CYANBEETLE: case E.LACBEETLE:
      drawGroundCritter(ctx, x, y, e, col);
      break;
    case E.SNOWFLINX:
      drawHumanoid(ctx, x, y, col, false, e.dir, false);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y - e.h / 2 + 2, 7, 0, Math.PI * 2);
      ctx.fill();
      break;
    case E.ANGLERFISH:
      drawFish(ctx, x, y, e.w, col, '#8a5a3a');
      break;
    case E.ARAPAIMA:
      drawFish(ctx, x, y, e.w, col, '#a04a2a');
      break;
    case E.FLOATYGROSS: case E.ILLUBAT: case E.BLOODFEEDER: case E.MUSHILADYBUG:
    case E.SPOREBAT: case E.ENCHANTEDSWORDNPC: case E.TORTUREDSOUL:
      drawFlyingWinged(ctx, x, y, e.w, col, '#ffffff88');
      break;
    case E.WANDERINGEYENPC:
      drawCrimera(ctx, x, y, e.w, col);
      break;
    case E.DESERTSPIRIT:
      ctx.globalAlpha = 0.75;
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(x, y, e.w / 2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.fillRect(x - 5, y - 3, 3, 3);
      ctx.fillRect(x + 2, y - 3, 3, 3);
      ctx.globalAlpha = 1;
      break;
    case E.DERPLING:
      drawFlyingWinged(ctx, x, y, e.w, col, '#8a7ac0');
      ctx.fillStyle = '#c04040';
      ctx.beginPath();
      ctx.ellipse(x - e.w / 4, y + e.h / 4, 3, 5, 0.3, 0, Math.PI * 2);
      ctx.fill();
      break;
    case E.MOSSHORNET: case E.ALIENHORNET:
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(x, y, e.w / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffd54d';
      ctx.beginPath();
      ctx.arc(x, y, e.w / 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    case E.CRIMSONAXE:
      ctx.fillStyle = col;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Time.seconds * 4 + e.bob);
      ctx.fillRect(-e.w / 2, -3, e.w, 6);
      ctx.beginPath();
      ctx.moveTo(e.w / 2, -4);
      ctx.lineTo(e.w / 2 + 8, 0);
      ctx.lineTo(e.w / 2, 4);
      ctx.fill();
      ctx.restore();
      break;
    case E.ICHORSTICKER:
      drawFlyingWinged(ctx, x, y, e.w, col, '#9a9a3a');
      break;
    case E.CLINGER:
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(x, y, e.w / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#6a2020';
      ctx.beginPath();
      ctx.arc(x, y - e.h / 2, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ff6b6b';
      ctx.beginPath();
      ctx.arc(x - 3, y - 1, 2, 0, Math.PI * 2);
      ctx.arc(x + 3, y - 1, 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case E.CURSEDHAMMER:
      ctx.fillStyle = col;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Time.seconds * 3);
      ctx.fillRect(-e.w / 2, -4, e.w, 8);
      ctx.fillRect(-e.w / 2, -4, 6, 16);
      ctx.restore();
      break;
    case E.MIMIC: case E.HALLOWEDMIMIC: case E.CORRUPTMIMIC: case E.CRIMSONMIMIC:
      drawMimic(ctx, x, y, e.w, e.h, col, e.awake);
      break;
    case E.PRESENTMIMIC:
      drawMimic(ctx, x, y, e.w, e.h, '#d83f4f', e.awake);
      ctx.fillStyle = '#ffd75e';
      ctx.fillRect(x - 3, y - e.h / 2, 6, e.h);
      ctx.fillRect(x - e.w / 2, y - 3, e.w, 6);
      break;
    case E.WOLF:
      drawWolf(ctx, x, y, e.w, e.h, col, e.dir);
      break;
    case E.VORTEXIAN:
      drawHumanoid(ctx, x, y, col, true, e.dir, false);
      break;
    case E.NEBULAFLOATER:
      ctx.fillStyle = col;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(x, y, e.w / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x - 3, y - 2, 2, 0, Math.PI * 2);
      ctx.arc(x + 3, y - 2, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      break;
    case E.STARDJUSTCELL:
      ctx.fillStyle = col;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(x, y, e.w / 2 + 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(x, y, e.w / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x - 3, y - 2, 2.5, 0, Math.PI * 2);
      ctx.arc(x + 3, y - 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    case E.PUMPKINSCARECROW: case E.FROSTZOMBIE:
      drawHumanoid(ctx, x, y, col, true, e.dir, false);
      break;
    case E.SPLINTERLING: case E.GINGERBREAD:
      drawSlime(ctx, x, y, e.w, e.h, col, e.type);
      break;
    case E.MARTIANPROBE:
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.ellipse(x, y, e.w / 2, e.h / 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#d8fff0';
      ctx.fillRect(x - 5, y - 3, 10, 4);
      break;
    case E.MARTIANGRUNT: case E.RAYGUNNER: case E.MARTIANOFFICER: case E.MARTIANENGINEER: case E.GIGAZAPPER:
      drawHumanoid(ctx, x, y, col, true, e.dir, false);
      break;
    case E.MERCHANT: case E.NURSE: case E.WIZARD: case E.STEAMPUNKER:
    case E.CYBORG: case E.TRUFFLE: case E.PIRATE: case E.WITCHDOCTOR:
    case E.DEMOLITIONIST: case E.DYETRADER: case E.ANGLER: case E.ZOOLOGIST:
    case E.DRYAD: case E.PAINTER: case E.GOLFER: case E.ARMSDEALER:
    case E.TAVERNKEEP: case E.STYLIST: case E.GOBLINTINKERER: case E.CLOTHIER:
    case E.MECHANIC: case E.TAXCOLLECTOR: case E.PARTYGIRL: case E.SANTA:
    case E.PRINCESS:
      PixelArt.drawTownActor(ctx, e, x, y, col);
      if (game.party && game.party.active && e.type !== E.TAXCOLLECTOR && e.type !== E.ZOOLOGIST) {
        ctx.fillStyle = e.type === E.PARTYGIRL ? '#ff70b8' : '#6bc8ff';
        ctx.beginPath(); ctx.moveTo(x - 6, y - e.h / 2 + 1); ctx.lineTo(x, y - e.h / 2 - 10); ctx.lineTo(x + 6, y - e.h / 2 + 1); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#ffe14d'; ctx.fillRect(x - 6, y - e.h / 2, 12, 2);
      }
      if (e.rescue) {
        ctx.strokeStyle = '#d8c08a'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x - 9, y - 5); ctx.lineTo(x + 9, y + 5); ctx.moveTo(x + 9, y - 5); ctx.lineTo(x - 9, y + 5); ctx.stroke();
        ctx.fillStyle = '#fff0b8'; ctx.font = 'bold 9px monospace'; ctx.textAlign = 'center'; ctx.fillText('HELP', x, y - e.h / 2 - 5);
      }
      break;
    case E.HARPY:
      drawHarpy(ctx, x, y, e.w, col);
      break;
    case E.LAVASLIME:
      drawSlime(ctx, x, y, e.w, e.h, col, e.type);
      ctx.fillStyle = 'rgba(255,220,120,0.7)';
      ctx.beginPath();
      ctx.arc(x, y - 2, 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    case E.HELLBAT: case E.LAVABAT:
      drawHellbat(ctx, x, y, e.w, col);
      break;
    case E.DEMON:
      drawHumanoid(ctx, x, y, col, true, e.dir, false);
      drawHellbat(ctx, x, y - 6, e.w + 10, '#7a4a3d');
      break;
    case E.VOODOODEMON:
      drawHumanoid(ctx, x, y, col, true, e.dir, false);
      drawHellbat(ctx, x, y - 6, e.w + 10, '#5a3030');
      ctx.fillStyle = '#c8b090';
      ctx.fillRect(x - 3, y + 10, 6, 9);
      ctx.fillStyle = '#d04040';
      ctx.fillRect(x - 1, y + 12, 2, 3);
      break;
    case E.FIREIMP:
      drawHumanoid(ctx, x, y, col, true, e.dir, false);
      break;
    case E.BONESERPENT:
      drawWyvern(ctx, e, cam, W, H, Time.seconds);
      break;
    case E.GIANTWORM: case E.DIGGER: case E.TOMBCRAWLER: case E.WORLDFEEDER:
      drawWorm(ctx, e, cam, W, H, col);
      break;
    case E.SANDSLIME: case E.CRIMSLIME: case E.SLIMELING:
    case E.PURPLESLIME: case E.YELLOWSLIME: case E.REDSLIME: case E.BLACKSLIME:
      drawSlime(ctx, x, y, e.w, e.h, col, e.type);
      break;
    case E.NYMPH:
      drawHumanoid(ctx, x, y, col, false, e.dir, false);
      break;
    case E.MOTH:
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.ellipse(x, y, e.w / 2, e.h / 2.6, 0, 0, Math.PI * 2);
      ctx.fill();
      drawFlyingWinged(ctx, x, y, e.w, col, shade(col, 20));
      ctx.fillStyle = '#111';
      ctx.beginPath();
      ctx.arc(x - 4, y - 2, 2, 0, Math.PI * 2);
      ctx.arc(x + 4, y - 2, 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case E.CORRUPTSLIME:
      drawSlime(ctx, x, y, e.w, e.h, col, e.type);
      break;
    case E.SPIKEDJUNGLESLIME: case E.SPIKEDICESLIME:
      drawSpikedSlime(ctx, x, y, e.w, e.h, col);
      break;
    case E.UMBRELLASLIME:
      drawSlime(ctx, x, y + 5, e.w, e.h - 5, col, e.type);
      drawUmbrella(ctx, x, y - 13, e.w + 10, white ? '#fff' : '#4779ad');
      break;
    case E.SPOREZOMBIE:
      drawHumanoid(ctx, x, y, col, false, e.dir, false);
      // glowing spore cap
      ctx.fillStyle = 'rgba(180,240,120,' + (0.5 + 0.2 * Math.sin(Time.seconds * 3 + e.x)) + ')';
      ctx.beginPath();
      ctx.arc(x, y - 18, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#d8f0a0';
      ctx.fillRect(x - 2, y - 20, 1, 1);
      ctx.fillRect(x + 3, y - 17, 1, 1);
      break;
    case E.ICEELEMENTAL:
      // floating crystalline shard cluster
      ctx.fillStyle = col;
      ctx.save();
      ctx.translate(x, y + Math.sin(Time.seconds * 2 + e.x) * 2);
      ctx.beginPath();
      ctx.moveTo(0, -16); ctx.lineTo(7, -4); ctx.lineTo(4, 12); ctx.lineTo(-4, 12); ctx.lineTo(-7, -4);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = white ? '#fff' : '#d8f4ff';
      ctx.beginPath();
      ctx.moveTo(0, -10); ctx.lineTo(3, -2); ctx.lineTo(0, 6); ctx.lineTo(-3, -2);
      ctx.closePath(); ctx.fill();
      // orbiting shards
      for (var ie = 0; ie < 3; ie++) {
        var ia = Time.seconds * 2.2 + ie * 2.094;
        ctx.fillStyle = white ? '#fff' : '#c8ecff';
        ctx.fillRect(Math.cos(ia) * 13 - 2, Math.sin(ia) * 9 - 2, 4, 4);
      }
      ctx.restore();
      break;
    case E.SQUID:
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.ellipse(x, y - 4, e.w / 2, e.h / 2.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = white ? '#fff' : '#e898ac';
      ctx.beginPath();
      ctx.ellipse(x, y - 7, e.w / 3, e.h / 4, 0, 0, Math.PI * 2);
      ctx.fill();
      // tentacles
      ctx.strokeStyle = col;
      ctx.lineWidth = 2;
      for (var tq = 0; tq < 4; tq++) {
        var tox = -6 + tq * 4;
        ctx.beginPath();
        ctx.moveTo(x + tox, y + 4);
        ctx.quadraticCurveTo(x + tox + Math.sin(Time.seconds * 5 + tq) * 3, y + 11, x + tox + Math.sin(Time.seconds * 5 + tq * 1.7) * 4, y + 15);
        ctx.stroke();
      }
      ctx.fillStyle = '#111';
      ctx.fillRect(x - 4, y - 8, 2, 2);
      ctx.fillRect(x + 2, y - 8, 2, 2);
      break;
    case E.DUNESPLICER:
      drawWorm(ctx, e, cam, W, H, col);
      break;
    case E.ANTLIONSWARMER:
      drawFlyingWinged(ctx, x, y, e.w, col, '#ead09a');
      break;
    case E.BUNNY: case E.SQUIRREL: case E.FROG: case E.TURTLE: case E.PENGUIN:
      drawGroundCritter(ctx, x, y, e, col);
      break;
    case E.BIRD:
      drawBirdCritter(ctx, x, y, e, col);
      break;
    case E.GOLDFISH:
      drawFish(ctx, x, y, e.w, col, '#f6c45d');
      break;
    case E.FUNGOFISH: case E.BLOODJELLY: case E.CORRUPTGOLDFISH:
      drawFish(ctx, x, y, e.w, col, col);
      break;
    case E.CRIMERA:
      drawCrimera(ctx, x, y, e.w, col);
      break;
    case E.FACEMONSTER:
      drawHumanoid(ctx, x, y, col, true, e.dir, false);
      break;
    case E.HERPLING:
      drawSlime(ctx, x, y, e.w, e.h, col, e.type);
      break;
    case E.BLOODCRAWLER: case E.BLACKRECLUSE:
      drawSpider(ctx, x, y, e.w, e.h, col, e.dir);
      break;
    case E.GRANITEGOLEM: case E.MARBLEGOLEM:
      drawHumanoid(ctx, x, y, col, true, e.dir, false);
      break;
    case E.DEMONEYE:
      PixelArt.drawCreature(ctx, 'eye', x, y, col, e.dir, Math.floor(Time.seconds * 8) % 3);
      break;
    case E.CAVEBAT:
      PixelArt.drawCreature(ctx, 'bat', x, y, col, e.dir, Math.floor(Time.seconds * 12) % 3);
      break;
    case E.GOBLIN:
      drawHumanoid(ctx, x, y, col, false, e.dir, false);
      break;
    case E.CORRUPTCRIMSONFLYER:
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.ellipse(x, y, e.w / 2, e.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x - e.w / 2, y);
      ctx.lineTo(x - e.w, y - e.h / 3);
      ctx.lineTo(x - e.w / 2, y + e.h / 3);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + e.w / 2, y);
      ctx.lineTo(x + e.w, y - e.h / 3);
      ctx.lineTo(x + e.w / 2, y + e.h / 3);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#111';
      ctx.beginPath();
      ctx.arc(x - 3, y - 2, 2, 0, Math.PI * 2);
      ctx.arc(x + 3, y - 2, 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case E.CURSEDSKULL:
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(x, y - 2, e.w / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(x - e.w / 4, y, e.w / 2, e.h / 3);
      ctx.fillStyle = '#3a3a5a';
      ctx.beginPath();
      ctx.arc(x - 4, y - 4, 3, 0, Math.PI * 2);
      ctx.arc(x + 4, y - 4, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffd75e';
      ctx.beginPath();
      ctx.arc(x - 4, y - 4, 1.5, 0, Math.PI * 2);
      ctx.arc(x + 4, y - 4, 1.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    case E.ANGRYBONES:
      drawHumanoid(ctx, x, y, col, false, e.dir, false);
      break;
    case E.DARKCASTER:
      drawHumanoid(ctx, x, y, col, true, e.dir, false);
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(x - e.w / 2, y - e.h / 2, e.w, 3);
      break;
    case E.DUNGEONSLIME:
      drawSlime(ctx, x, y, e.w, e.h, col, e.type);
      break;
    case E.ICESLIME:
      drawSlime(ctx, x, y, e.w, e.h, col, e.type);
      break;
    case E.ANTLION: case E.ANTLIONCHARGER:
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.ellipse(x, y, e.w / 2, e.h / 2.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = shade(col, -22);
      ctx.beginPath();
      ctx.arc(x - e.w / 2, y - 2, e.w / 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x - e.w / 2, y - e.h / 2);
      ctx.lineTo(x - e.w / 2 - 6, y - e.h);
      ctx.lineTo(x - e.w / 2 + 3, y - e.h / 2);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x - e.w / 2, y - e.h / 2);
      ctx.lineTo(x - e.w / 2 - 4, y - e.h + 4);
      ctx.lineTo(x - e.w / 2 + 4, y - e.h / 2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#111';
      ctx.beginPath();
      ctx.arc(x - e.w / 2 + 1, y - 3, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = shade(col, -30);
      ctx.lineWidth = 2;
      for (var li = 0; li < 3; li++) {
        ctx.beginPath();
        ctx.moveTo(x + e.w / 4, y + 2 + li);
        ctx.lineTo(x + e.w / 2 + 2, y - 3 + li * 3);
        ctx.stroke();
      }
      break;
    case E.DUNGEONSCORPION:
      drawSpider(ctx, x, y, e.w, e.h, col, e.dir);
      break;
    case E.GOBLINSCOUT: case E.GOBLINPEON: case E.GOBLINTHIEF: case E.GOBLINARCHER: case E.GOBLINWARRIOR: case E.GOBLINSORCERER:
      drawHumanoid(ctx, x, y, col, e.type === E.GOBLINWARRIOR, e.dir || 1, false);
      break;
    case E.GOBLINWARLOCK:
      drawHumanoid(ctx, x, y, '#4a3560', false, e.dir || 1, false);
      ctx.fillStyle = 'rgba(200,92,255,0.25)';
      ctx.beginPath();
      ctx.arc(x, y - 4, e.w / 2 + 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    case E.GOBLINSUMMONER:
      drawHumanoid(ctx, x, y, '#563568', false, e.dir || 1, true);
      ctx.strokeStyle = '#c85cff';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x, y - 5, e.w / 2 + 5 + Math.sin(Time.seconds * 5) * 2, 0, Math.PI * 2); ctx.stroke();
      break;
    case E.PIRATEDECKHAND: case E.PIRATECORSAIR:
      drawHumanoid(ctx, x, y, col, e.type === E.PIRATECORSAIR, e.dir || 1, false);
      break;
    case E.PIRATECAPTAIN:
      drawHumanoid(ctx, x, y, col, true, e.dir || 1, false);
      ctx.fillStyle = '#1a2028';
      ctx.fillRect(x - e.w / 2, y - e.h / 2 - 4, e.w, 5);
      break;
    case E.PIRATESHARK:
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.ellipse(x, y, e.w / 2, e.h / 2.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = shade(col, -24);
      ctx.beginPath();
      ctx.moveTo(x - e.w / 2, y - e.h / 2);
      ctx.lineTo(x - e.w / 2 + 6, y - e.h / 2 - 8);
      ctx.lineTo(x - e.w / 2 + 4, y - e.h / 2 + 2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x - 2, y - 2, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#111';
      ctx.beginPath();
      ctx.arc(x - 1, y - 2, 1.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    case E.SWAMPTHING:
      drawHumanoid(ctx, x, y, col, true, e.dir || 1, false);
      break;
    case E.WEREWOLF:
      drawHumanoid(ctx, x, y, col, true, e.dir || 1, false);
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x - 4, y - 6, 2, 0, Math.PI * 2);
      ctx.arc(x + 4, y - 6, 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case E.EYEBALL:
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.ellipse(x, y, e.w / 2, e.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x - 4, y - 2, 5, 0, Math.PI * 2);
      ctx.arc(x + 4, y - 2, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#8a1a1a';
      ctx.beginPath();
      ctx.arc(x - 4, y - 2, 2.5, 0, Math.PI * 2);
      ctx.arc(x + 4, y - 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    case E.CREATUREFROMDEEP:
      drawHumanoid(ctx, x, y, '#397878', true, e.dir || 1, false);
      ctx.fillStyle = '#b8ffff';
      ctx.fillRect(x - 6, y - 9, 3, 3);
      ctx.fillRect(x + 3, y - 9, 3, 3);
      break;
    case E.FRITZ: case E.POSSESSED: case E.BUTCHER: case E.DRMANFLY:
    case E.NAILHEAD: case E.PSYCHO:
      drawHumanoid(ctx, x, y, col, e.type === E.BUTCHER || e.type === E.NAILHEAD, e.dir || 1, false);
      if (e.type === E.NAILHEAD) {
        ctx.fillStyle = '#d8d8d8';
        for (var ni = -1; ni <= 1; ni++) ctx.fillRect(x + ni * 6, y - 18, 2, 7);
      }
      break;
    case E.DEADLYSPHERE:
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Time.seconds * 4);
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(0, 0, e.w / 2 - 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffd0d0';
      ctx.lineWidth = 3;
      for (var ds = 0; ds < 6; ds++) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(15, 0); ctx.stroke();
      }
      ctx.restore();
      break;
    case E.BABYMOTHRON:
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.ellipse(x, y, e.w / 2, e.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#c8b8e8';
      ctx.beginPath();
      ctx.ellipse(x - 10, y, 8, 5, -0.4, 0, Math.PI * 2);
      ctx.ellipse(x + 10, y, 8, 5, 0.4, 0, Math.PI * 2);
      ctx.fill();
      break;
    case E.FLYINGDUTCHMAN:
      ctx.fillStyle = col;
      ctx.fillRect(x - e.w / 2, y - 5, e.w, 22);
      ctx.fillStyle = '#d8c8a0';
      ctx.fillRect(x - 3, y - e.h / 2, 6, e.h / 2);
      ctx.beginPath();
      ctx.moveTo(x + 2, y - e.h / 2);
      ctx.lineTo(x + 34, y - 10);
      ctx.lineTo(x + 2, y - 10);
      ctx.fill();
      break;
    case E.BLOODZOMBIE:
      drawHumanoid(ctx, x, y, col, false, e.dir || 1, false);
      ctx.fillStyle = '#ff6670';
      ctx.fillRect(x - 5, y - 11, 3, 3);
      ctx.fillRect(x + 2, y - 11, 3, 3);
      break;
    case E.BRIDE: case E.GROOM:
      drawHumanoid(ctx, x, y, col, false, e.dir || 1, false);
      ctx.fillStyle = e.type === E.BRIDE ? '#f8f0f0' : '#181820';
      ctx.fillRect(x - 9, y + 3, 18, 12);
      break;
    case E.CLOWN:
      drawHumanoid(ctx, x, y, col, false, e.dir || 1, false);
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y - 10, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#e83040'; ctx.beginPath(); ctx.arc(x + (e.dir || 1) * 4, y - 9, 3, 0, Math.PI * 2); ctx.fill();
      break;
    case E.DRIPPLER:
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(x, y, e.w / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffd8d8';
      ctx.beginPath();
      ctx.arc(x, y - 2, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#6a1020';
      ctx.beginPath();
      ctx.arc(x, y - 2, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    case E.WANDERINGEYEFISH:
      drawFish(ctx, x, y, e.w, col, '#7a2030');
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(x + (e.dir || 1) * 5, y - 2, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#a01020';
      ctx.beginPath(); ctx.arc(x + (e.dir || 1) * 6, y - 2, 2.5, 0, Math.PI * 2); ctx.fill();
      break;
    case E.ZOMBIEMERMAN:
      drawHumanoid(ctx, x, y, col, true, e.dir || 1, false);
      ctx.fillStyle = '#3a6a70';
      ctx.beginPath();
      ctx.moveTo(x - 9, y + 10); ctx.lineTo(x, y + 20); ctx.lineTo(x + 9, y + 10); ctx.fill();
      break;
    case E.DREADNAUTILUS:
      ctx.fillStyle = 'rgba(255,40,70,0.22)';
      ctx.beginPath(); ctx.arc(x, y, e.w / 2 + 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(x, y, e.w / 2, 0.3, Math.PI * 2 - 0.3);
      ctx.lineTo(x + e.w / 2 + 10, y); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#f08090';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(x - 3, y, e.w / 3, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(x + 10, y - 3, 4, 0, Math.PI * 2); ctx.fill();
      break;
    case E.BLOODEEL:
      drawWyvern(ctx, e, cam, W, H, Time.seconds);
      break;
    case E.HEMOGOBLINSHARK:
      drawFish(ctx, x, y, e.w, col, '#501424');
      ctx.fillStyle = '#f0d8d8';
      for (var ht = -1; ht <= 1; ht++) ctx.fillRect(x + (e.dir || 1) * 13, y + ht * 5, 5, 2);
      break;
    case E.CRAWLTIPEDE:
      drawWyvern(ctx, e, cam, W, H, Time.seconds);
      break;
    case E.ALIENQUEEN:
      ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y, e.w / 2, e.h / 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#72f0d0';
      ctx.beginPath(); ctx.moveTo(x - 8, y); ctx.lineTo(x - 30, y - 18); ctx.lineTo(x - 22, y + 12); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x + 8, y); ctx.lineTo(x + 30, y - 18); ctx.lineTo(x + 22, y + 12); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x + 9, y - 5, 5, 0, Math.PI * 2); ctx.fill();
      break;
    case E.EVOLUTIONBEAST:
      drawHumanoid(ctx, x, y, col, true, e.dir || 1, false);
      ctx.strokeStyle = '#e080ff'; ctx.lineWidth = 3;
      for (var eb = -1; eb <= 1; eb++) { ctx.beginPath(); ctx.moveTo(x + eb * 7, y - 14); ctx.lineTo(x + eb * 11, y - 28); ctx.stroke(); }
      break;
    case E.FLOWINVADER:
      ctx.fillStyle = 'rgba(112,143,232,0.25)'; ctx.beginPath(); ctx.arc(x, y, e.w / 2 + 9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = col; ctx.beginPath();
      for (var fs = 0; fs < 10; fs++) { var fa = fs * Math.PI / 5 - Math.PI / 2; var fr = fs % 2 ? 9 : 18; if (!fs) ctx.moveTo(x + Math.cos(fa) * fr, y + Math.sin(fa) * fr); else ctx.lineTo(x + Math.cos(fa) * fr, y + Math.sin(fa) * fr); }
      ctx.closePath(); ctx.fill();
      break;
    case E.SNOWMANGANGSTA: case E.MISTERSTABBY: case E.SNOWBALLA:
    case E.PIRATECROSSBOWER: case E.PIRATEDEADEYE: case E.MARTIANWALKER:
    case E.HELLHOUND: case E.HEADLESSHORSEMAN:
    case E.ZOMBIEELF: case E.ELFARCHER: case E.KRAMPUS: case E.NUTCRACKER: case E.YETI:
    case E.SELENIAN: case E.STORMDIVER: case E.PREDICTOR:
      drawHumanoid(ctx, x, y, col, e.type === E.MARTIANWALKER || e.type === E.KRAMPUS || e.type === E.HEADLESSHORSEMAN, e.dir || 1, false);
      break;
    case E.PARROT: case E.MARTIANDRONE: case E.ELFCOPTER: case E.STARGAZER: case E.FLOCKO:
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.ellipse(x, y, e.w / 2, e.h / 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = shade(col, 22);
      ctx.beginPath(); ctx.moveTo(x - 5, y); ctx.lineTo(x - 22, y - 10); ctx.lineTo(x - 16, y + 9); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x + 5, y); ctx.lineTo(x + 22, y - 10); ctx.lineTo(x + 16, y + 9); ctx.fill();
      break;
    case E.TESLATURRET:
      ctx.fillStyle = '#536370'; ctx.fillRect(x - 11, y - 12, 22, 26);
      ctx.fillStyle = '#80e8ff';
      ctx.beginPath(); ctx.arc(x, y - 15, 7 + Math.sin(Time.seconds * 7), 0, Math.PI * 2); ctx.fill();
      break;
    case E.BRAINSCRAMBLER:
      ctx.fillStyle = 'rgba(200,120,232,0.25)'; ctx.beginPath(); ctx.arc(x, y, e.w / 2 + 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y, e.w / 2, e.h / 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#e8d8ff'; ctx.beginPath(); ctx.arc(x + 6, y - 2, 4, 0, Math.PI * 2); ctx.fill();
      break;
    case E.SCUTLIXGUNNER:
      ctx.fillStyle = '#3c756d'; ctx.beginPath(); ctx.ellipse(x, y + 7, e.w / 2, 13, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#68c8bc'; ctx.fillRect(x - 14, y - 4, 28, 8);
      drawHumanoid(ctx, x, y - 11, '#5aa89a', true, e.dir || 1, false);
      break;
    case E.POLTERGEIST: case E.SANDELEMENTAL:
      drawHumanoid(ctx, x, y, col, false, e.dir || 1, true);
      break;
    case E.FLYINGFISH:
      drawFish(ctx, x, y, e.w, col, '#3f7290');
      break;
    case E.ANGRYNIMBUS:
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(x - 10, y, 10, 0, Math.PI * 2); ctx.arc(x, y - 5, 13, 0, Math.PI * 2); ctx.arc(x + 12, y, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffdc58'; ctx.fillRect(x - 2, y + 7, 4, 12);
      break;
    case E.ANGRYTUMBLER:
      ctx.save(); ctx.translate(x, y); ctx.rotate(Time.seconds * 4 + e.seed);
      ctx.fillStyle = col; ctx.fillRect(-12, -12, 24, 24);
      ctx.fillStyle = '#8a6a35'; ctx.fillRect(-3, -12, 6, 24); ctx.restore();
      break;
    case E.ANGRYDANDELION:
      var lean = game.weather && game.weather.windSpeed < 0 ? -5 : 5;
      ctx.strokeStyle = white ? '#fff' : '#69a846'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x, y + 14); ctx.quadraticCurveTo(x + lean, y, x + lean, y - 10); ctx.stroke();
      ctx.fillStyle = col;
      for (var dl = 0; dl < 10; dl++) {
        var da = Math.PI * 2 * dl / 10;
        ctx.beginPath(); ctx.arc(x + lean + Math.cos(da) * 8, y - 10 + Math.sin(da) * 8, 3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = '#8a7130'; ctx.beginPath(); ctx.arc(x + lean, y - 10, 4, 0, Math.PI * 2); ctx.fill();
      break;
    case E.WINDYBALLOON:
      drawSlime(ctx, x, y, e.w, e.h, col, E.SLIME);
      if (!e.balloonPopped) {
        ctx.strokeStyle = '#d8d8d8'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, y - 8); ctx.lineTo(x, y - 38); ctx.stroke();
        var balloonColors = ['#ef5555','#5b91ef','#f0d54f','#7acb68'];
        ctx.fillStyle = balloonColors[Math.floor(e.seed) % balloonColors.length];
        ctx.beginPath(); ctx.ellipse(x, y - 48, 10, 13, 0, 0, Math.PI * 2); ctx.fill();
      }
      break;
    case E.LADYBUG:
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(Time.seconds * 8 + e.seed) * 0.3);
      ctx.fillStyle = e.gold ? '#ffd75e' : col; ctx.beginPath(); ctx.ellipse(0, 0, 6, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#222'; ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(0, 4); ctx.stroke();
      ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(-2, -1, 1, 0, Math.PI * 2); ctx.arc(3, 1, 1, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      break;
    case E.PALADIN:
      drawHumanoid(ctx, x, y, col, true, e.dir || 1, false);
      ctx.strokeStyle = '#fff0a0';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x - (e.dir || 1) * 10, y, 8, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case E.TACTICALSKELETON: case E.SKELETONSNIPER: case E.SKELETONCOMMANDO:
      drawHumanoid(ctx, x, y, col, true, e.dir || 1, false);
      ctx.fillStyle = e.type === E.SKELETONCOMMANDO ? '#6a7a3d' : '#343a40';
      ctx.fillRect(x + (e.dir || 1) * 3, y - 8, (e.dir || 1) * (e.type === E.SKELETONSNIPER ? 17 : 12), 3);
      break;
    case E.RAGGEDCASTER: case E.NECROMANCER: case E.DIABOLIST:
      drawHumanoid(ctx, x, y, col, false, e.dir || 1, false);
      ctx.fillStyle = e.type === E.DIABOLIST ? 'rgba(255,80,40,0.28)' : 'rgba(170,100,255,0.25)';
      ctx.beginPath();
      ctx.arc(x, y - 5, e.w / 2 + 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    case E.BONELEE:
      drawHumanoid(ctx, x, y, col, false, e.dir || 1, false);
      ctx.fillStyle = '#d8d0c0';
      ctx.fillRect(x - 6, y - e.h / 2 + 7, 12, 2);
      break;
    case E.GIANTCURSEDSKULL:
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(x, y - 2, e.w / 2 - 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(x - 9, y + 5, 18, 10);
      ctx.fillStyle = '#ff6060';
      ctx.beginPath();
      ctx.arc(x - 7, y - 5, 4, 0, Math.PI * 2);
      ctx.arc(x + 7, y - 5, 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    case E.DUNGEONSPIRIT:
      ctx.fillStyle = 'rgba(107,200,255,0.65)';
      ctx.beginPath();
      ctx.arc(x, y - 4, 9, 0, Math.PI * 2);
      ctx.moveTo(x - 9, y);
      ctx.lineTo(x - 5, y + 13);
      ctx.lineTo(x, y + 8);
      ctx.lineTo(x + 5, y + 13);
      ctx.lineTo(x + 9, y);
      ctx.fill();
      break;
    case E.CULTISTDEVOTEE: case E.CULTISTARCHER:
      drawHumanoid(ctx, x, y, col, false, e.dir || 1, false);
      ctx.fillStyle = '#1c2548';
      ctx.beginPath();
      ctx.moveTo(x - 9, y - 8);
      ctx.lineTo(x, y - 19);
      ctx.lineTo(x + 9, y - 8);
      ctx.fill();
      break;
    case E.MOTHRON:
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.ellipse(x, y, e.w / 2, e.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x - 4, y - 2, 2, 0, Math.PI * 2);
      ctx.arc(x + 4, y - 2, 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case E.LUNARPILLAR:
      ctx.fillStyle = col;
      ctx.fillRect(x - e.w / 2, y - e.h / 2, e.w, e.h);
      break;
    case E.SKELETON: case E.UNDEADVIKING: case E.WALLWARRIOR:
      PixelArt.drawCreature(ctx, 'skeleton', x, y, col, e.dir, Math.floor(Time.seconds * 8) % 3);
      break;
    case E.PINKY: case E.MOTHERSLIME: case E.BLUESLIME:
      drawSlime(ctx, x, y, e.w, e.h, col, e.type);
      break;
    case E.MEDUSA:
      drawHumanoid(ctx, x, y, col, false, e.dir, false);
      ctx.fillStyle = '#3ad04a';
      for (var s = 0; s < 6; s++) {
        var a2 = e.seed + s * 1.05 + Time.seconds * 2;
        ctx.beginPath();
        ctx.arc(x + Math.cos(a2) * 9, y - e.h / 2 + Math.sin(a2) * 5, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    case E.SPIKEBALL:
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(x, y, e.w / 2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#5a5a66';
      for (var spk = 0; spk < 8; spk++) {
        var a3 = spk * Math.PI / 4 + e.bob;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a3) * (e.w / 2 - 2), y + Math.sin(a3) * (e.w / 2 - 2));
        ctx.lineTo(x + Math.cos(a3) * (e.w / 2 + 5), y + Math.sin(a3) * (e.w / 2 + 5));
        ctx.lineTo(x + Math.cos(a3 + 0.2) * (e.w / 2 - 2), y + Math.sin(a3 + 0.2) * (e.w / 2 - 2));
        ctx.fill();
      }
      break;
    case E.GRANITEELEMENTAL:
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(x, y - e.h / 2);
      ctx.lineTo(x + e.w / 2, y);
      ctx.lineTo(x, y + e.h / 2);
      ctx.lineTo(x - e.w / 2, y);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
      break;
    case E.ANGRYTRAPPER:
      ctx.fillStyle = shade(col, -25);
      ctx.fillRect(x - 3, y, 6, e.h / 2);
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(x, y - 4, e.w / 2 + 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.fillRect(x + e.dir * 3 - 5, y - 7, 4, 4);
      ctx.fillRect(x + e.dir * 3 + 1, y - 7, 4, 4);
      ctx.fillStyle = '#cc3333';
      ctx.fillRect(x - e.w / 2 - 2, y - 4, e.w + 4, 3);
      break;
    case E.MANEATER:
      ctx.fillStyle = col;
      ctx.fillRect(x - 3, y, 6, e.h / 2);
      ctx.beginPath(); ctx.arc(x, y, e.w / 2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + e.dir * 4 - 5, y - 3, 4, 4);
      ctx.fillRect(x + e.dir * 4 + 1, y - 3, 4, 4);
      ctx.fillStyle = '#cc3333';
      ctx.fillRect(x - e.w / 2, y + 4, e.w, 3);
      break;
    case E.SNATCHER:
      ctx.fillStyle = shade(col, -25);
      ctx.fillRect(x - 2, y + 2, 4, e.h / 2);
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(x, y - 2, e.w / 2 + 2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#7ac84a';
      ctx.beginPath(); ctx.arc(x - e.dir * 6, y - 6, 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + e.dir * 3 - 5, y - 5, 4, 4);
      ctx.fillRect(x + e.dir * 3 + 1, y - 5, 4, 4);
      ctx.fillStyle = '#cc3333';
      ctx.fillRect(x - e.w / 2 - 2, y - 2, e.w + 4, 3);
      break;
    case E.VULTURE:
      drawFlyingWinged(ctx, x, y, e.w, col, '#d8c8a8');
      ctx.fillStyle = '#e05a4a';
      ctx.beginPath(); ctx.arc(x + e.dir * 8, y - 3, 2.5, 0, Math.PI * 2); ctx.fill();
      break;
    case E.METEORHEAD:
      ctx.fillStyle = '#ff8a3d';
      ctx.beginPath(); ctx.arc(x, y, e.w / 2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(x, y, e.w / 2 - 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffe14d';
      ctx.fillRect(x - 2, y - 5, 2, 3);
      ctx.fillRect(x + 2, y - 5, 2, 3);
      break;
    case E.REDDEVIL:
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.ellipse(x, y, e.w / 2, e.h / 2 - 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x - 7, y - e.h / 2 + 8); ctx.lineTo(x - 3, y - e.h / 2 - 5); ctx.lineTo(x + 1, y - e.h / 2 + 5); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x + 7, y - e.h / 2 + 8); ctx.lineTo(x + 3, y - e.h / 2 - 5); ctx.lineTo(x - 1, y - e.h / 2 + 5); ctx.fill();
      var devilFlap = Math.sin(Time.seconds * 8 + e.x * 0.1) * 5;
      ctx.beginPath(); ctx.moveTo(x - e.w / 2, y - 2); ctx.lineTo(x - e.w / 2 - 12, y + devilFlap); ctx.lineTo(x - e.w / 2 + 3, y + 6); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x + e.w / 2, y - 2); ctx.lineTo(x + e.w / 2 + 12, y + devilFlap); ctx.lineTo(x + e.w / 2 - 3, y + 6); ctx.fill();
      ctx.fillStyle = '#ffe14d';
      ctx.fillRect(x - 6, y - 5, 4, 3);
      ctx.fillRect(x + 2, y - 5, 4, 3);
      break;
    case E.SHARK:
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.ellipse(x, y, e.w / 2, e.h / 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x + e.dir * 6, y - 5); ctx.lineTo(x + e.dir * 10, y - 14); ctx.lineTo(x + e.dir * 1, y - 7); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x - e.dir * (e.w / 2 - 2), y); ctx.lineTo(x - e.dir * (e.w / 2 + 11), y - 6); ctx.lineTo(x - e.dir * (e.w / 2 + 9), y + 6); ctx.fill();
      ctx.fillStyle = '#e8f4ff';
      ctx.fillRect(x - e.w / 2 + 2, y + 2, e.w - 4, 3);
      ctx.fillStyle = '#171719';
      ctx.beginPath(); ctx.arc(x + e.dir * 10, y - 3, 1.5, 0, Math.PI * 2); ctx.fill();
      break;
    case E.ORCA:
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.ellipse(x, y, e.w / 2, e.h / 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x + e.dir * 4, y - 7); ctx.lineTo(x + e.dir * 9, y - 18); ctx.lineTo(x + e.dir * 14, y - 7); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x - e.dir * (e.w / 2 - 2), y); ctx.lineTo(x - e.dir * (e.w / 2 + 13), y - 7); ctx.lineTo(x - e.dir * (e.w / 2 + 11), y + 7); ctx.fill();
      ctx.fillStyle = '#f0f4f8';
      ctx.beginPath(); ctx.ellipse(x + e.dir * 6, y + 2, 7, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(x - e.w / 2 + 2, y + 4, e.w - 6, 3);
      ctx.beginPath(); ctx.ellipse(x + e.dir * 9, y - 3, 3, 1.5, 0, 0, Math.PI * 2); ctx.fill();
      break;
    case E.BASILISK:
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.ellipse(x, y, e.w / 2, e.h / 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#7a6a3a';
      ctx.fillRect(x - e.w / 2 - 6, y - 2, 8, 6);
      ctx.fillStyle = '#111111';
      ctx.beginPath(); ctx.arc(x + e.dir * 6, y - 2, 2, 0, Math.PI * 2); ctx.fill();
      break;
    case E.PINKJELLYFISH: case E.BLUEJELLYFISH: case E.GREENJELLYFISH:
      ctx.fillStyle = col;
      ctx.globalAlpha = 0.75;
      ctx.beginPath();
      ctx.arc(x, y, e.w / 2, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = col;
      ctx.lineWidth = 2;
      for (var jt = 0; jt < 4; jt++) {
        var jx = -e.w / 2 + 6 + jt * 7;
        ctx.beginPath();
        ctx.moveTo(x + jx, y + 3);
        ctx.quadraticCurveTo(x + jx + Math.sin(Time.seconds * 5 + jt) * 2, y + e.h / 2, x + jx + Math.sin(Time.seconds * 6 + jt * 2) * 3, y + e.h / 2 + 6);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(x - 4, y - 2, 2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + 4, y - 2, 2, 0, Math.PI * 2); ctx.fill();
      break;
    case E.CRAWDAD: case E.CRAB: case E.WALLCREEPER:
      drawCrawdad(ctx, x, y, e.w, col);
      break;
    case E.SEASNAIL:
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.ellipse(x, y + 3, e.w / 2.4, e.h / 3, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = white ? '#fff' : '#c8a050';
      ctx.beginPath(); ctx.arc(x + 3, y - 2, e.w / 2.6, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = col;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x + 3, y - 2, e.w / 2.6 - 1, 0, Math.PI * 1.6); ctx.stroke();
      break;
    case E.PIRANHA:
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.ellipse(x, y, e.w / 2, e.h / 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = white ? '#fff' : '#e06848';
      ctx.beginPath(); ctx.moveTo(x + e.w / 2, y); ctx.lineTo(x + e.w / 2 + 6, y - 4); ctx.lineTo(x + e.w / 2 + 6, y + 4); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#111';
      ctx.fillRect(x - 3, y - 3, 2, 2);
      ctx.fillStyle = white ? '#fff' : '#e8e8e8';
      ctx.fillRect(x - 5, y + 3, 7, 2);
      break;
    case E.SALAMANDER:
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.ellipse(x, y, e.w / 2, e.h / 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x - e.w / 2, y); ctx.lineTo(x - e.w / 2 - 9, y - 4); ctx.lineTo(x - e.w / 2 - 5, y + 4); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#111';
      ctx.fillRect(x + e.dir * 7, y - 3, 2, 2);
      break;
    case E.JUNGLECREEPER:
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.ellipse(x, y, e.w / 2, e.h / 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2f6a2f';
      ctx.fillRect(x - e.w / 2 - 4, y - 2, e.w + 8, 5);
      ctx.fillStyle = '#111111';
      ctx.beginPath(); ctx.arc(x + e.dir * 5, y - 3, 2, 0, Math.PI * 2); ctx.fill();
      for (var lc = 0; lc < 4; lc++) {
        ctx.strokeStyle = '#2f6a2f';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - e.w / 2 + 4 + lc * 6, y + 3);
        ctx.lineTo(x - e.w / 2 + 2 + lc * 6, y + 8);
        ctx.stroke();
      }
      break;
    case E.DRBONES:
      drawHumanoid(ctx, x, y, '#e0d8d0', false, e.dir || 1, false);
      ctx.fillStyle = '#222222';
      ctx.fillRect(x - 4, y - 7, 3, 3);
      ctx.fillRect(x + 1, y - 7, 3, 3);
      ctx.fillStyle = '#b8b8b8';
      ctx.fillRect(x - e.w / 2 - 8, y - 10, 10, 4);
      break;
  }
  if (e.ghost) ctx.globalAlpha = 1;

  // hp bar for tanky normal enemies
  if (e.maxHp > 150 && e.hp < e.maxHp && e.type !== E.GUIDE) {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(x - e.w / 2, y - e.h / 2 - 8, e.w, 4);
    ctx.fillStyle = '#ff5c5c';
    ctx.fillRect(x - e.w / 2, y - e.h / 2 - 8, e.w * (e.hp / e.maxHp), 4);
  }
}

function drawSlime(ctx, x, y, w, h, col, type) {
  PixelArt.slime(ctx, x, y, w, h, col);
}

function drawSpikedSlime(ctx, x, y, w, h, col) {
  drawSlime(ctx, x, y, w, h, col, E.SLIME);
  ctx.fillStyle = shade(col, -28);
  for (var i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.moveTo(x + i * w / 4 - 3, y - h + 3);
    ctx.lineTo(x + i * w / 4, y - h - 6 - Math.abs(i) * 2);
    ctx.lineTo(x + i * w / 4 + 3, y - h + 3);
    ctx.fill();
  }
}

function drawUmbrella(ctx, x, y, w, col) {
  ctx.strokeStyle = '#8a6b4a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + 22);
  ctx.quadraticCurveTo(x, y + 27, x + 5, y + 25);
  ctx.stroke();
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y);
  ctx.quadraticCurveTo(x, y - 18, x + w / 2, y);
  ctx.quadraticCurveTo(x + w / 3, y - 4, x + w / 6, y);
  ctx.quadraticCurveTo(x, y - 4, x - w / 6, y);
  ctx.quadraticCurveTo(x - w / 3, y - 4, x - w / 2, y);
  ctx.fill();
}

function drawGroundCritter(ctx, x, y, e, col) {
  var dir = e.dir || 1;
  ctx.fillStyle = col;
  if (e.type === E.FROG) {
    ctx.beginPath(); ctx.ellipse(x, y, 7, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(x - 9, y + 2, 5, 2); ctx.fillRect(x + 4, y + 2, 5, 2);
  } else if (e.type === E.PENGUIN) {
    ctx.beginPath(); ctx.ellipse(x, y, 6, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f0f4f8';
    ctx.beginPath(); ctx.ellipse(x, y + 1, 4, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(x + dir * 3, y - 8, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e8b84a';
    ctx.fillRect(x + dir * 5, y - 9, 4, 1.5);
    ctx.fillRect(x - 2, y + 7, 4, 2);
  } else if (e.type === E.TURTLE) {
    ctx.beginPath(); ctx.ellipse(x, y, 10, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = shade(col, -25); ctx.beginPath(); ctx.ellipse(x, y - 1, 7, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x + dir * 10, y, 3, 0, Math.PI * 2); ctx.fill();
  } else {
    ctx.beginPath(); ctx.ellipse(x, y, 7, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + dir * 5, y - 6, 4, 0, Math.PI * 2); ctx.fill();
    if (e.type === E.BUNNY) {
      ctx.fillRect(x + dir * 2, y - 15, 3, 8); ctx.fillRect(x + dir * 6, y - 15, 3, 8);
    } else {
      ctx.beginPath(); ctx.arc(x - dir * 8, y - 4, 5, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.fillStyle = '#171719';
  ctx.beginPath(); ctx.arc(x + dir * 6, y - 7, 1.2, 0, Math.PI * 2); ctx.fill();
}

function drawBirdCritter(ctx, x, y, e, col) {
  var flap = Math.sin(Time.seconds * 12 + e.seed) * 5;
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.ellipse(x, y, 6, 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - 2, y); ctx.lineTo(x - 10, y + flap); ctx.lineTo(x + 1, y + 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x + 2, y); ctx.lineTo(x + 10, y + flap); ctx.lineTo(x - 1, y + 2); ctx.fill();
  ctx.fillStyle = '#e8b548'; ctx.beginPath(); ctx.moveTo(x + 6, y); ctx.lineTo(x + 10, y + 2); ctx.lineTo(x + 6, y + 3); ctx.fill();
}

function drawHumanoid(ctx, x, y, col, armored, dir, ghost, skin) {
  PixelArt.drawActor(ctx, x, y, dir, col, armored ? '#9da5b1' : col,
    shade(col, -20), armored, 3, Math.floor(Time.seconds * 7) % 6,
    ghost ? '#bacad0' : skin || '#e4ad80');
}

function drawCrawdad(ctx, x, y, w, col) {
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.ellipse(x, y, w / 2, w / 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#b8875a';
  ctx.fillRect(x - w / 2 - 7, y - 3, 6, 4);
  ctx.fillRect(x + w / 2 + 1, y - 3, 6, 4);
  ctx.fillStyle = '#111111';
  ctx.beginPath(); ctx.arc(x - 3, y - 1, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 3, y - 1, 2, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#b8875a';
  ctx.lineWidth = 2;
  for (var ll = 0; ll < 4; ll++) {
    ctx.beginPath();
    ctx.moveTo(x - w / 2 + 4 + ll * 5, y + 3);
    ctx.lineTo(x - w / 2 + 2 + ll * 5, y + 8);
    ctx.stroke();
  }
}

function drawFlyingWinged(ctx, x, y, w, col, wingCol) {
  ctx.fillStyle = wingCol;
  var flap = Math.sin(Time.seconds * 10 + x) * 4;
  ctx.beginPath();
  ctx.moveTo(x - w / 3, y);
  ctx.lineTo(x - w / 2, y - 8 + flap);
  ctx.lineTo(x - w / 6, y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + w / 3, y);
  ctx.lineTo(x + w / 2, y - 8 + flap);
  ctx.lineTo(x + w / 6, y);
  ctx.fill();
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.ellipse(x, y, w / 3.2, w / 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x - 2, y - 1, 2.5, 0, Math.PI * 2);
  ctx.arc(x + 4, y - 1, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f00';
  ctx.beginPath();
  ctx.arc(x + 5, y - 1, 1.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawCorruptor(ctx, x, y, w, col) {
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.ellipse(x, y, w / 2, w / 3.4, 0, 0, Math.PI * 2);
  ctx.fill();
  // mouth
  ctx.fillStyle = '#d8c8e6';
  ctx.beginPath();
  ctx.arc(x + w / 3.5, y, 4, -Math.PI / 2, Math.PI / 2);
  ctx.fill();
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(x + w / 3.5, y, 2.4, 0, Math.PI * 2);
  ctx.fill();
  // tail spikes
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y);
  ctx.lineTo(x - w / 2 - 6, y - 4);
  ctx.lineTo(x - w / 2 - 6, y + 4);
  ctx.fill();
}

function drawPixie(ctx, x, y, t, col) {
  ctx.save();
  ctx.translate(x, y + Math.sin(t * 5 + x) * 3);
  ctx.fillStyle = 'rgba(255,255,200,0.4)';
  ctx.beginPath();
  ctx.arc(x, y, 12 + Math.sin(t * 8) * 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x - 1.5, y - 1.5, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawUnicorn(ctx, x, y, dir, col, state) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(dir, 1);
  // body
  ctx.fillStyle = col;
  ctx.fillRect(-14, -12, 26, 12);
  // legs
  ctx.fillStyle = col;
  ctx.fillRect(-11, 0, 4, 10);
  ctx.fillRect(-4, 0, 4, 10);
  ctx.fillRect(6, 0, 4, 10);
  ctx.fillRect(13, 0, 4, 10);
  // head
  ctx.fillRect(12, -22, 12, 12);
  // horn
  ctx.fillStyle = '#ffe14d';
  ctx.beginPath();
  ctx.moveTo(20, -22);
  ctx.lineTo(24, -34);
  ctx.lineTo(25, -22);
  ctx.fill();
  // eye
  ctx.fillStyle = '#111';
  ctx.fillRect(20, -16, 3, 3);
  // tail
  ctx.strokeStyle = col;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-14, -8);
  ctx.quadraticCurveTo(-22, -6, -20, 2);
  ctx.stroke();
  ctx.restore();
}

function drawChaos(ctx, x, y, col) {
  ctx.save();
  var spin = Time.seconds * 3;
  ctx.translate(x, y);
  ctx.fillStyle = col;
  for (var i = 0; i < 3; i++) {
    ctx.rotate(spin + i * Math.PI * 2 / 3);
    ctx.fillRect(-2, -12, 4, 24);
  }
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.restore();
}

function drawGastropod(ctx, x, y, w, col) {
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.ellipse(x, y, w / 2, w / 3, 0, 0, Math.PI * 2);
  ctx.fill();
  // shell spiral
  ctx.strokeStyle = '#8a6a4a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x - 4, y, w / 3.4, 0, Math.PI * 1.4);
  ctx.stroke();
  // eyes
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x + w / 4, y - 5, 3, 0, Math.PI * 2);
  ctx.arc(x + w / 4, y + 5, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawGuide(ctx, x, y, dir) {
  PixelArt.drawActor(ctx, x, y, dir, '#947c5b', '#e4ad80', '#62684b', false, 2, 0);
}

function drawTortoise(ctx, x, y, w, h, col) {
  ctx.fillStyle = '#4a6a3a';
  ctx.beginPath();
  ctx.ellipse(x, y, 3, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#3a4a2a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - w / 3, y);
  ctx.lineTo(x + w / 3, y);
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x - 4, y - 4, 2, 0, Math.PI * 2);
  ctx.arc(x + 4, y - 4, 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawFish(ctx, x, y, w, col, finCol) {
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.ellipse(x, y, w / 2, w / 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = finCol;
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y);
  ctx.lineTo(x - w / 2 - 6, y - 5);
  ctx.lineTo(x - w / 2 - 6, y + 5);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - w / 6, y);
  ctx.lineTo(x - w / 6 - 4, y - 8);
  ctx.lineTo(x + w / 6, y);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x + w / 4, y - 2, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawMimic(ctx, x, y, w, h, col, awake) {
  ctx.fillStyle = col;
  ctx.fillRect(x - w / 2, y - h / 2, w, h * 0.8);
  ctx.fillRect(x - w / 2, y - h / 2 + h * 0.65, w, 4);
  ctx.fillStyle = '#5a3d1a';
  ctx.fillRect(x - w / 4, y - h / 2 - 2, w / 2, 4);
  ctx.fillStyle = '#c8a020';
  ctx.beginPath();
  ctx.arc(x - w / 4, y - h / 2 + 2, 2, 0, Math.PI * 2);
  ctx.arc(x + w / 4, y - h / 2 + 2, 2, 0, Math.PI * 2);
  ctx.fill();
  if (awake) {
    ctx.fillStyle = '#ff5c5c';
    ctx.beginPath();
    ctx.moveTo(x - w / 3, y - h / 4);
    ctx.lineTo(x, y + h / 3);
    ctx.lineTo(x + w / 3, y - h / 4);
    ctx.fill();
  }
}

function drawWolf(ctx, x, y, w, h, col, dir) {
  var step = Math.sin(Time.seconds * 8) * 3;
  ctx.fillStyle = col;
  ctx.fillRect(x - 6 + step, y - 2, 5, 8);
  ctx.fillRect(x + 1 - step, y - 2, 5, 8);
  ctx.beginPath();
  ctx.ellipse(x, y - 4, w / 2.4, h / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x - 3, y - 6, 2, 0, Math.PI * 2);
  ctx.arc(x + 3, y - 6, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(x + dir * (w / 2), y - 4);
  ctx.lineTo(x + dir * (w / 2 + 6), y - 1);
  ctx.lineTo(x + dir * (w / 2), y + 2);
  ctx.fill();
}

function drawWyvern(ctx, e, cam, W, H, t) {
  var col = e.flash > 0 ? '#fff' : '#ffd0a0';
  if (e.segments) {
    for (var i = e.segments.length - 1; i >= 0; i--) {
      var s = e.segments[i];
      if (s.dead) continue;
      var sx = s.x - cam.x + W / 2, sy = s.y - cam.y + H / 2;
      if (sx < -60 || sy < -60 || sx > W + 60 || sy > H + 60) continue;
      ctx.fillStyle = s.flash > 0 ? '#fff' : col;
      ctx.beginPath();
      ctx.ellipse(sx, sy, 14, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#c87a4a';
      ctx.fillRect(sx - 4, sy - 5, 8, 3);
    }
  }
  var x = e.x - cam.x + W / 2, y = e.y - cam.y + H / 2;
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.ellipse(x, y, 17, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x - 6, y - 3, 3, 0, Math.PI * 2);
  ctx.arc(x + 5, y - 3, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(x - 5, y - 3, 1.5, 0, Math.PI * 2);
  ctx.arc(x + 6, y - 3, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#8a5c34';
  ctx.beginPath();
  ctx.moveTo(x + 12, y - 4);
  ctx.lineTo(x + 22, y);
  ctx.lineTo(x + 12, y + 4);
  ctx.fill();
}

function drawWorm(ctx, e, cam, W, H, col) {
  if (e.segments) {
    for (var i = e.segments.length - 1; i >= 0; i--) {
      var s = e.segments[i];
      if (s.dead) continue;
      var sx = s.x - cam.x + W / 2, sy = s.y - cam.y + H / 2;
      if (sx < -60 || sy < -60 || sx > W + 60 || sy > H + 60) continue;
      ctx.fillStyle = s.flash > 0 ? '#fff' : col;
      ctx.beginPath();
      ctx.ellipse(sx, sy, 13, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = shade(col, -24);
      ctx.fillRect(sx - 3, sy - 6, 6, 2);
    }
  }
  var x = e.x - cam.x + W / 2, y = e.y - cam.y + H / 2;
  ctx.fillStyle = e.flash > 0 ? '#fff' : col;
  ctx.beginPath();
  ctx.ellipse(x, y, 16, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(x - 4, y - 3, 2.5, 0, Math.PI * 2);
  ctx.arc(x + 4, y - 3, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = shade(col, -30);
  ctx.beginPath();
  ctx.moveTo(x - 10, y - 3);
  ctx.lineTo(x - 10, y + 4);
  ctx.lineTo(x - 16, y + 1);
  ctx.lineTo(x - 12, y - 2);
  ctx.closePath();
  ctx.fill();
}

function drawHarpy(ctx, x, y, w, col) {
  drawFlyingWinged(ctx, x, y, w, col, '#d8d0c0');
  ctx.fillStyle = col;
  ctx.fillRect(x - w / 2, y - 2, w, 10);
  ctx.fillStyle = '#b8b0a0';
  ctx.fillRect(x - w / 2, y - 2, w, 2);
}

function drawHellbat(ctx, x, y, w, col) {
  var flap = Math.sin(Time.seconds * 14 + x) * 5;
  ctx.fillStyle = '#3a2a2a';
  ctx.beginPath();
  ctx.moveTo(x - 3, y);
  ctx.lineTo(x - w / 2 - 4, y - 6 + flap);
  ctx.lineTo(x - w / 2 + 2, y - 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 3, y);
  ctx.lineTo(x + w / 2 + 4, y - 6 + flap);
  ctx.lineTo(x + w / 2 - 2, y - 2);
  ctx.fill();
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.arc(x, y, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x - 3, y - 1, 2, 0, Math.PI * 2);
  ctx.arc(x + 3, y - 1, 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawCrimera(ctx, x, y, w, col) {
  ctx.fillStyle = col;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.ellipse(x, y, w / 2, w / 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x - w / 5, y - 2, 3, 0, Math.PI * 2);
  ctx.arc(x + w / 5, y - 2, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#8a0a0a';
  ctx.beginPath();
  ctx.arc(x - w / 5, y - 2, 1.5, 0, Math.PI * 2);
  ctx.arc(x + w / 5, y - 2, 1.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawSpider(ctx, x, y, w, h, col, dir) {
  var leg = Math.sin(Time.seconds * 8) * 2;
  ctx.strokeStyle = col;
  ctx.lineWidth = 2;
  for (var i = 0; i < 3; i++) {
    var lx = x - w / 4 + i * (w / 4);
    ctx.beginPath();
    ctx.moveTo(lx, y - h / 6);
    ctx.lineTo(lx - 6, y + h / 2 - leg);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(lx, y - h / 6);
    ctx.lineTo(lx + 6, y + h / 2 + leg);
    ctx.stroke();
  }
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x - 4, y - 2, 2.5, 0, Math.PI * 2);
  ctx.arc(x + 4, y - 2, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(x - 4, y - 2, 1.2, 0, Math.PI * 2);
  ctx.arc(x + 4, y - 2, 1.2, 0, Math.PI * 2);
  ctx.fill();
}

// ---------- Boss drawing ----------
function drawHardmodeBoss(ctx, e, x, y, player) {
  var white = e.flash > 0, pulse = Math.sin(Time.seconds * 4);
  ctx.save(); ctx.translate(x, y); ctx.scale(e.w / 100, e.h / 100);
  function oval(cx, cy, rx, ry, color) {
    ctx.fillStyle = white ? '#fff' : color;
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
  }
  function polygon(points, color) {
    ctx.fillStyle = white ? '#fff' : color; ctx.beginPath();
    ctx.moveTo(points[0], points[1]);
    for (var p = 2; p < points.length; p += 2) ctx.lineTo(points[p], points[p + 1]);
    ctx.closePath(); ctx.fill();
  }
  function block(bx, by, bw, bh, color) {
    ctx.fillStyle = white ? '#fff' : color; ctx.fillRect(bx, by, bw, bh);
  }
  function eye(ex, ey, size, color) {
    oval(ex, ey, size, size * 0.7, '#e9faff');
    oval(ex, ey, size * 0.55, size * 0.65, color);
    oval(ex, ey, size * 0.2, size * 0.5, '#182536');
  }
  var i, side, angle;
  if (e.boss === 'queenslime') {
    if (e.phase2) {
      for (side = -1; side <= 1; side += 2) {
        polygon([side * 18,-5,side * 58,-44 + pulse * 6,side * 50,-8,side * 38,13], '#f5dbff');
        for (i = 0; i < 4; i++) polygon([side * 22,0,side * (56 - i * 5),-34 + i * 10,side * (42 - i * 4),10], '#bfa1e9');
      }
    }
    oval(0,12,46,37,'#bd62c3'); oval(-3,6,40,30,'#ec9bdc');
    oval(-15,-4,17,11,'#f9c7f0'); oval(0,34,32,8,'#9355b1');
    polygon([-18,-21,-21,-40,-9,-31,0,-49,10,-31,22,-40,18,-21], '#e6b858');
    block(-19,-25,38,6,'#ffdf7c');
    polygon([0,-44,6,-35,0,-28,-6,-35], '#8addf3');
    oval(-13,5,4,7,'#56346b'); oval(13,5,4,7,'#56346b');
    oval(-14,3,1.5,2,'#fff'); oval(12,3,1.5,2,'#fff');
  } else if (e.boss === 'plantera') {
    for (i = 0; i < 7; i++) {
      angle = i * Math.PI * 2 / 7 + Time.seconds * 0.15;
      ctx.save(); ctx.rotate(angle);
      polygon([-8,22,-17,48 + pulse * 2,0,39,12,49,8,20], '#478e55');
      oval(0,-25,16,e.phase2 ? 15 : 23,i % 2 ? '#cb528d' : '#e975ac'); ctx.restore();
    }
    oval(0,0,25,25,e.phase2 ? '#752344' : '#bf477d');
    oval(0,4,e.phase2 ? 23 : 15,e.phase2 ? 21 : 13,'#261c35');
    for (i = -2; i <= 2; i++) {
      var toothX = i * 8;
      polygon([toothX - 3,-12,toothX + 3,-12,toothX,0], '#ffeab8');
      polygon([toothX - 3,18,toothX + 3,18,toothX,8], '#ffeab8');
    }
    if (e.phase2) for (i = 0; i < 4; i++) {
      angle = i * Math.PI / 2 + Time.seconds * 0.8;
      ctx.save(); ctx.rotate(angle); block(-2,28,4,17,'#79b958'); oval(0,47,5,5,'#e58abc'); ctx.restore();
    }
  } else if (e.boss === 'golem') {
    block(-34,30,25,17,'#9e6731'); block(9,30,25,17,'#9e6731');
    block(-30,-8,60,42,'#a97137'); block(-26,-5,52,34,'#d4a557');
    block(-19,1,38,4,'#eaca7b'); block(-19,15,38,4,'#ab713b');
    polygon([0,-5,11,9,0,22,-11,9], e.phase2 ? '#ff833c' : '#78965d');
    for (side = -1; side <= 1; side += 2) {
      var handY = 8 + Math.sin(Time.seconds * 3 + side) * 6;
      block(side < 0 ? -40 : 29,0,11,9,'#87572c');
      block(side < 0 ? -49 : 34,handY,15,21,'#d4a557');
      block(side < 0 ? -47 : 36,handY + 4,11,3,'#efc875');
    }
    var headY = e.phase2 ? -40 + pulse * 3 : -25;
    block(-23,headY - 13,46,29,'#bc8440'); block(-19,headY - 17,38,9,'#e2b866');
    block(-26,headY - 8,6,17,'#865b30'); block(20,headY - 8,6,17,'#865b30');
    block(-16,headY - 3,11,6,'#ffb84d'); block(5,headY - 3,11,6,'#ffb84d');
    block(-12,headY + 9,24,3,'#644323');
  } else if (e.boss === 'duke') {
    ctx.scale(player.x < e.x ? -1 : 1, 1);
    polygon([-24,0,-49,-28,-42,0,-49,26], '#326d89');
    polygon([-17,-16,-7,-46,9,-19,27,-33,22,-10], '#5db7ac');
    polygon([-17,14,-8,40,10,23,20,34,22,10], '#468697');
    oval(0,0,34,28,e.phase2 ? '#368b94' : '#68bcb9');
    oval(6,13,25,13,'#aacbbb'); oval(28,4,18,17,'#a3c9b6');
    oval(37,0,2,4,'#396571'); oval(29,0,2,4,'#396571');
    polygon([12,13,17,37,21,13], '#fff0c8'); polygon([29,14,34,33,36,12], '#fff0c8');
    eye(12,-10,6,e.phase2 ? '#ed7241' : '#e4cf67');
    for (i = 0; i < 3; i++) block(-14 + i * 7,-6,2,14,'#42828a');
  } else if (e.boss === 'empress') {
    var colors = ['#f8c967','#ee93cc','#bc8de8','#83c9eb'];
    for (side = -1; side <= 1; side += 2) {
      for (i = 0; i < 4; i++) {
        polygon([side * 5,-8,side * (53 - i * 6),-44 + i * 4 + pulse * 3,side * (40 - i * 6),10,side * 9,20], colors[i]);
        polygon([side * 7,10,side * (44 - i * 5),26,side * (33 - i * 5),49,side * 5,29], colors[3 - i]);
      }
    }
    oval(0,-15,12,20,'#dc81b8'); oval(0,-23,7,9,'#fff3cd');
    polygon([-8,-34,-12,-46,-3,-40,0,-51,4,-40,12,-46,8,-33], '#ffdf76');
    polygon([-7,-10,7,-10,14,30,0,47,-14,30], '#f1cb71');
    polygon([-4,0,4,0,7,28,0,39,-7,28], e.phase2 ? '#fff' : '#fcebb5');
    block(-18,-3,12,4,'#ffebbc'); block(6,-3,12,4,'#ffebbc');
    block(21,-28,2,50,'#f5df85'); polygon([22,-38,27,-27,22,-19,17,-27], '#c5edff');
    block(-4,-24,2,2,'#664459'); block(2,-24,2,2,'#664459');
  } else if (e.boss === 'moonlord') {
    oval(0,17,25,31,'#426c68'); oval(0,9,22,20,'#7ca79b');
    for (side = -1; side <= 1; side += 2) {
      polygon([side * 19,-1,side * 36,9,side * 40,-3,side * 31,19,side * 20,17], '#82afa2');
      oval(side * 41,-5,9,14,'#8ab4a5');
      for (i = 0; i < 4; i++) block(side * 41 - 8 + i * 4,-28 + Math.abs(i - 1) * 2,3,15,'#94bcaa');
      eye(side * 41,-7,6,'#80e4d5');
      for (i = 0; i < 4; i++) {
        ctx.strokeStyle = '#bad1b2'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(side * 3,9 + i * 6); ctx.lineTo(side * 19,5 + i * 6); ctx.stroke();
      }
    }
    oval(0,-27,16,19,'#91b7a4'); block(-15,-33,30,3,'#bdd6b4');
    eye(0,-36,7,'#64dfcf'); eye(-8,-23,4,'#6cd6cb'); eye(8,-23,4,'#6cd6cb');
    for (i = -2; i <= 2; i++) {
      ctx.strokeStyle = i % 2 ? '#719c88' : '#a4c8ad'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(i * 5,-16); ctx.quadraticCurveTo(i * 7 + pulse * 2,0,i * 4,8 - Math.abs(i) * 3); ctx.stroke();
    }
    oval(0,28,10,13,'#26494c'); oval(0,28,e.phase2 ? 7 : 4,9,e.phase2 ? '#99ffef' : '#65b4a4');
    if (e.phase2) oval(0,26,3,5,'#fff');
  }
  ctx.restore();
}

function drawBoss(game, ctx, e, cam, W, H) {
  if (e.armType) return;
  if (CombatArt.drawBoss(ctx, game, e, cam, W, H)) return;
  if (e.ooaBoss) {
    drawOldOnesArmyBoss(game, ctx, e, cam, W, H);
    return;
  }
  var x = e.x - cam.x + W / 2;
  var y = e.y - cam.y + H / 2;
  var white = e.flash > 0;

  if (e.boss === 'queenslime' || e.boss === 'plantera' || e.boss === 'golem' || e.boss === 'duke' || e.boss === 'empress' || e.boss === 'moonlord') {
    drawHardmodeBoss(ctx, e, x, y, game.player);
    return;
  }

  if (e.boss === 'twins') {
    var iris = white ? '#fff' : (e.phase2 ? '#ff2020' : (e.sub === 'retinazer' ? '#ff3d4d' : '#3dff9d'));
    // glow
    ctx.fillStyle = 'rgba(255,60,60,0.15)';
    ctx.beginPath();
    ctx.arc(x, y, e.w / 2 + 8 + Math.sin(Time.seconds * 6) * 2, 0, Math.PI * 2);
    ctx.fill();
    // body
    ctx.fillStyle = white ? '#fff' : '#c23d3d';
    ctx.beginPath();
    ctx.ellipse(x, y, e.w / 2, e.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    // pupil track player
    var ang = Math.atan2(game.player.y - e.y, game.player.x - e.x);
    var px = Math.cos(ang) * 6, py = Math.sin(ang) * 6;
    ctx.fillStyle = iris;
    ctx.beginPath();
    ctx.arc(x + px, y + py, e.w / 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(x + px, y + py, e.w / 9, 0, Math.PI * 2);
    ctx.fill();
    // teeth in phase2
    if (e.phase2) {
      ctx.fillStyle = '#fff';
      for (var i = 0; i < 6; i++) {
        var tx = x - e.w / 2 + 6 + i * 7;
        ctx.fillRect(tx, y + e.h / 2 - 3, 4, 4);
      }
    }
    return;
  }

  if (e.boss === 'destroyer') {
    // body segments
    for (var i = 0; i < e.segments.length; i++) {
      var s = e.segments[i];
      if (s.dead) continue;
      var sx = s.x - cam.x + W / 2, sy = s.y - cam.y + H / 2;
      if (sx < -80 || sy < -80 || sx > W + 80 || sy > H + 80) continue;
      ctx.fillStyle = s.flash > 0 ? '#fff' : (i % 2 === 0 ? '#8a8f9a' : '#7a7f8a');
      ctx.beginPath();
      ctx.ellipse(sx, sy, s.w / 2, s.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(sx - s.w / 2, sy + 4, s.w, 4);
    }
    // head
    ctx.fillStyle = white ? '#fff' : '#aab0bd';
    ctx.beginPath();
    ctx.ellipse(x, y, e.w / 2, e.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ff4d4d';
    ctx.beginPath();
    ctx.arc(x + 10, y, 6, -Math.PI / 2, Math.PI / 2);
    ctx.fill();
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(x + 10, y, 3, 0, Math.PI * 2);
    ctx.fill();
    // teeth
    ctx.fillStyle = '#fff';
    for (var j = 0; j < 4; j++) {
      ctx.fillRect(x - e.w / 2 + 4 + j * 9, y + e.h / 2 - 4, 4, 5);
    }
    // probes
    for (var p = 0; p < e.probes.length; p++) {
      var pr = e.probes[p];
      var qx = pr.x - cam.x + W / 2, qy = pr.y - cam.y + H / 2;
      ctx.fillStyle = pr.flash > 0 ? '#fff' : pr.color;
      ctx.beginPath();
      ctx.arc(qx, qy, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(qx + 3, qy - 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    return;
  }

  if (e.boss === 'skelprime') {
    var armsDead = e.armCount <= 0;
    // arms
    for (var a = 0; a < e.arms.length; a++) {
      var arm = e.arms[a];
      if (arm.dead) continue;
      var ax = arm.x - cam.x + W / 2, ay = arm.y - cam.y + H / 2;
      ctx.strokeStyle = '#9aa0b0';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(ax, ay);
      ctx.stroke();
      var acol = arm.flash > 0 ? '#fff' : arm.color;
      ctx.fillStyle = acol;
      if (arm.armType === 'saw') {
        ctx.save();
        ctx.translate(ax, ay);
        ctx.rotate(Time.seconds * 8);
        for (var r = 0; r < 4; r++) {
          ctx.rotate(Math.PI / 2);
          ctx.fillRect(-3, -12, 6, 24);
        }
        ctx.restore();
      } else if (arm.armType === 'laser') {
        ctx.beginPath();
        ctx.arc(ax, ay, 10, 0, Math.PI * 2);
        ctx.fill();
      } else if (arm.armType === 'cannon') {
        ctx.fillRect(ax - 8, ay - 10, 16, 20);
        ctx.fillRect(ax + 4, ay - 12, 10, 8);
      } else {
        ctx.beginPath();
        ctx.moveTo(ax - 8, ay - 6);
        ctx.lineTo(ax + 8, ay);
        ctx.lineTo(ax - 8, ay + 6);
        ctx.fill();
      }
    }
    // head skull
    ctx.fillStyle = white ? '#fff' : (armsDead ? '#d0d8e0' : '#9aa0b0');
    ctx.beginPath();
    ctx.arc(x, y, e.w / 2.1, 0, Math.PI * 2);
    ctx.fill();
    // jaw
    ctx.fillStyle = white ? '#fff' : '#8a90a0';
    ctx.beginPath();
    ctx.ellipse(x, y + 14, e.w / 3, e.h / 6, 0, 0, Math.PI * 2);
    ctx.fill();
    // eyes
    ctx.fillStyle = armsDead ? '#ff2020' : '#ff4d4d';
    ctx.beginPath();
    ctx.arc(x - 10, y - 4, 6 + Math.sin(Time.seconds * 5) * 1, 0, Math.PI * 2);
    ctx.arc(x + 10, y - 4, 6 + Math.sin(Time.seconds * 5 + 1) * 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x - 10, y - 4, 3, 0, Math.PI * 2);
    ctx.arc(x + 10, y - 4, 3, 0, Math.PI * 2);
    ctx.fill();
    // teeth
    ctx.fillStyle = '#fff';
    for (var t3 = 0; t3 < 5; t3++) {
      ctx.fillRect(x - e.w / 2 + 5 + t3 * 9, y + 9, 4, 6);
    }
    return;
  }

  if (e.boss === 'queenslime') {
    var qcol = white ? '#fff' : (e.phase2 ? '#e04d8a' : '#ff8fd0');
    ctx.fillStyle = 'rgba(255,143,208,0.2)';
    ctx.beginPath();
    ctx.arc(x, y, e.w / 2 + 6 + Math.sin(Time.seconds * 4) * 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = qcol;
    ctx.beginPath();
    ctx.ellipse(x, y, e.w / 2, e.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(x, y + e.h / 4, e.w / 2.4, e.h / 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3a1a4a';
    ctx.beginPath();
    ctx.arc(x - e.w / 5, y - 4, 5, 0, Math.PI * 2);
    ctx.arc(x + e.w / 5, y - 4, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x - e.w / 5, y - 4, 2, 0, Math.PI * 2);
    ctx.arc(x + e.w / 5, y - 4, 2, 0, Math.PI * 2);
    ctx.fill();
    if (e.phase2) {
      ctx.fillStyle = '#ff4d9d';
      ctx.beginPath();
      ctx.arc(x, y, e.w / 3, 0, Math.PI * 2);
      ctx.fill();
    }
    return;
  }

  if (e.boss === 'plantera') {
    ctx.fillStyle = white ? '#fff' : '#4db85c';
    ctx.beginPath();
    ctx.arc(x, y, e.w / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2d7a3a';
    for (var pl = 0; pl < 8; pl++) {
      var pa = pl / 8 * Math.PI * 2 + Math.sin(Time.seconds * 2) * 0.3;
      ctx.fillRect(x + Math.cos(pa) * e.w / 2 - 3, y + Math.sin(pa) * e.w / 2 - 3, 6, 6);
    }
    ctx.fillStyle = white ? '#fff' : (e.phase2 ? '#ff4d8a' : '#ff8a4d');
    ctx.beginPath();
    ctx.arc(x, y, e.w / 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3a1a1a';
    ctx.beginPath();
    ctx.arc(x - 8, y - 5, 3, 0, Math.PI * 2);
    ctx.arc(x + 8, y - 5, 3, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  if (e.boss === 'golem') {
    ctx.fillStyle = white ? '#fff' : '#c8b090';
    ctx.beginPath();
    ctx.ellipse(x, y, e.w / 2, e.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = white ? '#fff' : (e.phase2 ? '#ffb84d' : '#8a7a5c');
    ctx.beginPath();
    ctx.arc(x, y, e.w / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3a1a1a';
    ctx.beginPath();
    ctx.arc(x - 7, y - 6, 4, 0, Math.PI * 2);
    ctx.arc(x + 7, y - 6, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x - 7, y - 6, 1.5, 0, Math.PI * 2);
    ctx.arc(x + 7, y - 6, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#5a4a30';
    ctx.fillRect(x - 12, y + e.h / 2 - 6, 24, 4);
    return;
  }

  if (e.boss === 'duke') {
    ctx.fillStyle = white ? '#fff' : '#2d8ab5';
    ctx.beginPath();
    ctx.ellipse(x, y, e.w / 2, e.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#b5e8ff';
    ctx.beginPath();
    ctx.ellipse(x, y - 2, e.w / 3, e.h / 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3a1a1a';
    ctx.beginPath();
    ctx.arc(x - e.w / 5, y - 4, 3, 0, Math.PI * 2);
    ctx.arc(x + e.w / 5, y - 4, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1a4a6a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y + 10);
    ctx.lineTo(x - 14, y + e.h / 2 + 4);
    ctx.moveTo(x, y + 10);
    ctx.lineTo(x + 14, y + e.h / 2 + 4);
    ctx.stroke();
    if (e.phase2) {
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(x - e.w / 2, y + e.h / 2 - 4, e.w, 4);
    }
    return;
  }

  if (e.boss === 'empress') {
    ctx.fillStyle = 'rgba(255,225,150,0.25)';
    ctx.beginPath();
    ctx.arc(x, y, e.w / 2 + 12 + Math.sin(Time.seconds * 5) * 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = white ? '#fff' : '#ffe9a8';
    ctx.beginPath();
    ctx.arc(x, y, e.w / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = white ? '#fff' : '#e8c06a';
    ctx.fillRect(x - 3, y - e.h / 2 - 6, 6, 10);
    ctx.fillStyle = '#3a1a1a';
    ctx.beginPath();
    ctx.arc(x - 7, y - 4, 3, 0, Math.PI * 2);
    ctx.arc(x + 7, y - 4, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x - 7, y - 4, 1.5, 0, Math.PI * 2);
    ctx.arc(x + 7, y - 4, 1.5, 0, Math.PI * 2);
    ctx.fill();
    if (e.phase2) {
      ctx.strokeStyle = '#ff4d8a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, e.w / 2 + 4, 0, Math.PI * 2);
      ctx.stroke();
    }
    return;
  }

  if (e.boss === 'cultist') {
    ctx.fillStyle = white ? '#fff' : '#6a4a9a';
    ctx.beginPath();
    ctx.ellipse(x, y, e.w / 2, e.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = white ? '#fff' : '#d0c8e8';
    ctx.beginPath();
    ctx.arc(x, y - e.h / 2 + 8, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3a1a1a';
    ctx.beginPath();
    ctx.arc(x - 4, y - e.h / 2 + 7, 2, 0, Math.PI * 2);
    ctx.arc(x + 4, y - e.h / 2 + 7, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ff8a4d';
    ctx.fillRect(x - 2, y, 4, e.h / 2);
    ctx.fillStyle = '#8a6a4a';
    ctx.fillRect(x - 10, y + e.h / 4, 20, 4);
    return;
  }

  if (e.boss === 'moonlord') {
    ctx.fillStyle = 'rgba(120,140,220,0.2)';
    ctx.beginPath();
    ctx.arc(x, y, e.w / 2 + 14 + Math.sin(Time.seconds * 2.5) * 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = white ? '#fff' : '#6a7ab0';
    ctx.beginPath();
    ctx.arc(x, y, e.w / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = white ? '#fff' : (e.phase2 ? '#ff2020' : '#c85cff');
    ctx.beginPath();
    ctx.arc(x, y, e.w / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(x, y, e.w / 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x - e.w / 5, y - e.w / 5, 6, 0, Math.PI * 2);
    ctx.arc(x + e.w / 5, y - e.w / 5, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(x - e.w / 5, y - e.w / 5, 3, 0, Math.PI * 2);
    ctx.arc(x + e.w / 5, y - e.w / 5, 3, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  if (e.boss === 'mourningwood' || e.boss === 'everscream') {
    var mwFlash = white ? '#fff' : (e.boss === 'everscream' ? '#7a9aff' : '#7a3d1f');
    // trunk
    ctx.fillStyle = mwFlash;
    ctx.fillRect(x - e.w / 2, y - e.h / 2, e.w, e.h * 0.7);
    // crown of leaves
    ctx.fillStyle = white ? '#fff' : (e.boss === 'everscream' ? '#d8e8ff' : '#3d7a2a');
    ctx.beginPath();
    ctx.arc(x, y - e.h * 0.3, e.w * 0.62, 0, Math.PI * 2);
    ctx.fill();
    // carved face
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(x - 12, y - e.h * 0.32, 3.5, 0, Math.PI * 2);
    ctx.arc(x + 12, y - e.h * 0.32, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x - 12, y - e.h * 0.32, 24, 2);
    // glowing eyes
    ctx.fillStyle = e.phase2 ? '#ff8a3d' : '#ffe14d';
    ctx.beginPath();
    ctx.arc(x - 12, y - e.h * 0.32, 1.8, 0, Math.PI * 2);
    ctx.arc(x + 12, y - e.h * 0.32, 1.8, 0, Math.PI * 2);
    ctx.fill();
    // branches
    ctx.strokeStyle = mwFlash;
    ctx.lineWidth = 4;
    for (var b = 0; b < 3; b++) {
      var ba = -2.6 + b * 1.3 + Math.sin(Time.seconds * 3 + b) * 0.2;
      ctx.beginPath();
      ctx.moveTo(x, y - e.h * 0.3);
      ctx.lineTo(x + Math.cos(ba) * e.w * 0.6, y - e.h * 0.3 + Math.sin(ba) * e.h * 0.5);
      ctx.stroke();
    }
    return;
  }

  if (e.boss === 'pumpking') {
    // cape
    ctx.fillStyle = white ? '#fff' : '#5a2a3a';
    ctx.beginPath();
    ctx.moveTo(x, y - e.h / 2);
    ctx.quadraticCurveTo(x + e.w * 0.8, y - e.h * 0.1, x, y + e.h / 2);
    ctx.fill();
    // head
    ctx.fillStyle = white ? '#fff' : (e.phase2 ? '#ffb84d' : '#ff9a3d');
    ctx.beginPath();
    ctx.arc(x, y, e.h * 0.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#6a2a0a';
    ctx.beginPath();
    ctx.arc(x - 12, y - 4, 3.5, 0, Math.PI * 2);
    ctx.arc(x + 12, y - 4, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - 14, y + 8);
    ctx.lineTo(x + 14, y + 8);
    ctx.lineTo(x, y + 22);
    ctx.closePath();
    ctx.fill();
    // stem
    ctx.fillStyle = '#3d7a2a';
    ctx.fillRect(x - 3, y - e.h * 0.42 - 8, 6, 10);
    return;
  }

  if (e.boss === 'santank') {
    ctx.fillStyle = white ? '#fff' : '#d84d2d';
    ctx.fillRect(x - e.w / 2, y - e.h / 2, e.w, e.h * 0.6);
    ctx.fillStyle = '#a8b0b8';
    ctx.fillRect(x - e.w / 2 + 4, y - e.h * 0.2, e.w - 8, e.h * 0.55);
    // tracks
    ctx.fillStyle = '#333';
    ctx.fillRect(x - e.w / 2 - 4, y + e.h * 0.2, e.w + 8, 10);
    for (var tk = 0; tk < 5; tk++) {
      ctx.fillRect(x - e.w / 2 + tk * (e.w / 4), y - e.h * 0.1, 3, e.h * 0.3);
    }
    // turret
    ctx.fillStyle = '#7a7f8a';
    ctx.fillRect(x + e.w * 0.1, y - e.h * 0.5, e.w * 0.45, 12);
    // christmas tree
    ctx.fillStyle = '#2f8f3f';
    ctx.beginPath();
    ctx.moveTo(x - e.w / 2 + 8, y - e.h * 0.4);
    ctx.lineTo(x - e.w / 2 + 16, y - e.h * 0.7);
    ctx.lineTo(x - e.w / 2 + 24, y - e.h * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ff4d4d';
    ctx.beginPath();
    ctx.arc(x - e.w / 2 + 16, y - e.h * 0.55, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffe14d';
    ctx.beginPath();
    ctx.arc(x - e.w / 2 + 12, y - e.h * 0.48, 1.8, 0, Math.PI * 2);
    ctx.arc(x - e.w / 2 + 20, y - e.h * 0.48, 1.8, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  if (e.boss === 'icequeen') {
    // crown
    ctx.fillStyle = white ? '#fff' : '#9ad0f0';
    ctx.beginPath();
    ctx.moveTo(x - 16, y - e.h / 2);
    ctx.lineTo(x - 16, y - e.h / 2 - 12);
    ctx.lineTo(x - 6, y - e.h / 2 - 5);
    ctx.lineTo(x, y - e.h / 2 - 14);
    ctx.lineTo(x + 6, y - e.h / 2 - 5);
    ctx.lineTo(x + 16, y - e.h / 2 - 12);
    ctx.lineTo(x + 16, y - e.h / 2);
    ctx.closePath();
    ctx.fill();
    // face
    ctx.fillStyle = white ? '#fff' : (e.phase2 ? '#c8e8ff' : '#a0c8e8');
    ctx.beginPath();
    ctx.arc(x, y, e.h * 0.36, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x - 8, y - 2, 3, 0, Math.PI * 2);
    ctx.arc(x + 8, y - 2, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2a4a6a';
    ctx.beginPath();
    ctx.arc(x - 8, y - 2, 1.5, 0, Math.PI * 2);
    ctx.arc(x + 8, y - 2, 1.5, 0, Math.PI * 2);
    ctx.fill();
    // icicles
    ctx.fillStyle = '#e8f8ff';
    for (var ic = 0; ic < 5; ic++) {
      ctx.beginPath();
      ctx.moveTo(x - 20 + ic * 10, y + 12);
      ctx.lineTo(x - 16 + ic * 10, y + 26 + Math.sin(ic) * 4);
      ctx.lineTo(x - 12 + ic * 10, y + 12);
      ctx.closePath();
      ctx.fill();
    }
    return;
  }

  if (e.boss === 'deerclops') {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(e.dir || 1, 1);
    ctx.fillStyle = 'rgba(120,210,255,' + (e.phase2 ? '0.22' : '0.10') + ')';
    ctx.beginPath(); ctx.arc(0, 0, e.w / 2 + 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = white ? '#fff' : '#574236';
    ctx.fillRect(-24, -18, 48, 54);
    ctx.fillStyle = white ? '#fff' : '#6a5140';
    ctx.beginPath(); ctx.arc(0, -25, 27, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#202028';
    ctx.fillRect(-21, 28, 14, 28);
    ctx.fillRect(7, 28, 14, 28);
    ctx.strokeStyle = white ? '#fff' : '#d8c8a0';
    ctx.lineWidth = 4;
    for (var da = -1; da <= 1; da += 2) {
      ctx.beginPath();
      ctx.moveTo(da * 12, -44);
      ctx.lineTo(da * 22, -61);
      ctx.lineTo(da * 34, -69);
      ctx.moveTo(da * 22, -60);
      ctx.lineTo(da * 15, -72);
      ctx.stroke();
    }
    ctx.fillStyle = e.phase2 ? '#ff4058' : '#9ee8ff';
    ctx.beginPath(); ctx.arc(0, -27, 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath(); ctx.arc(2, -27, 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    return;
  }

  if (e.boss === 'kingslime') {
    var kx = x, ky = y + e.h * 0.15;
    ctx.fillStyle = white ? '#fff' : e.color;
    ctx.beginPath();
    ctx.moveTo(kx - e.w / 2, ky);
    ctx.quadraticCurveTo(kx - e.w / 2, ky - e.h / 2, kx, ky - e.h / 2);
    ctx.quadraticCurveTo(kx + e.w / 2, ky - e.h / 2, kx + e.w / 2, ky);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(kx - e.w / 4, ky - e.h / 3, 5, 0, Math.PI * 2);
    ctx.arc(kx + e.w / 4, ky - e.h / 3, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(kx - e.w / 4, ky - e.h / 3, 2, 0, Math.PI * 2);
    ctx.arc(kx + e.w / 4, ky - e.h / 3, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(kx, ky + e.h / 5, 3, 0, Math.PI * 2);
    ctx.arc(kx + e.w / 5, ky + e.h / 5, 3, 0, Math.PI * 2);
    ctx.fill();
    if (e.phase2) {
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.beginPath();
      ctx.arc(x, y, e.w / 2 + 6, 0, Math.PI * 2);
      ctx.stroke();
    }
    return;
  }

  if (e.boss === 'eyeofcthulhu') {
    ctx.fillStyle = 'rgba(255,60,60,0.2)';
    ctx.beginPath();
    ctx.arc(x, y, e.w / 2 + 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = white ? '#fff' : '#c23d3d';
    ctx.beginPath();
    ctx.ellipse(x, y, e.w / 2, e.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    var eyeAng = Math.atan2(game.player.y - e.y, game.player.x - e.x);
    var ex = Math.cos(eyeAng) * 6, ey = Math.sin(eyeAng) * 6;
    ctx.fillStyle = e.phase2 ? '#ff3d3d' : '#ffd0a0';
    ctx.beginPath();
    ctx.arc(x + ex, y + ey, e.w / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(x + ex, y + ey, e.w / 8, 0, Math.PI * 2);
    ctx.fill();
    // jagged mouth
    ctx.fillStyle = white ? '#fff' : '#7a2a2a';
    for (var mi = 0; mi < 6; mi++) {
      ctx.fillRect(x - e.w / 2 + 4 + mi * 7, y + e.h / 2 - 5, 5, 5);
    }
    return;
  }

  if (e.boss === 'eaterofworlds') {
    // body segments
    for (var i2 = 0; i2 < e.segments.length; i2++) {
      var s2 = e.segments[i2];
      if (s2.dead) continue;
      var sx2 = s2.x - cam.x + W / 2, sy2 = s2.y - cam.y + H / 2;
      if (sx2 < -80 || sy2 < -80 || sx2 > W + 80 || sy2 > H + 80) continue;
      ctx.fillStyle = s2.flash > 0 ? '#fff' : (i2 % 2 === 0 ? '#6a5c8a' : '#5a4c7a');
      ctx.beginPath();
      ctx.ellipse(sx2, sy2, s2.w / 2, s2.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // head
    ctx.fillStyle = white ? '#fff' : '#7a6c9a';
    ctx.beginPath();
    ctx.ellipse(x, y, e.w / 2, e.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ff4d4d';
    ctx.beginPath();
    ctx.arc(x + 10, y, 6, -Math.PI / 2, Math.PI / 2);
    ctx.fill();
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(x + 10, y, 3, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  if (e.boss === 'brainofcthulhu') {
    ctx.fillStyle = 'rgba(220,80,80,0.2)';
    ctx.beginPath();
    ctx.arc(x, y, e.w / 2 + 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = white ? '#fff' : '#c04848';
    ctx.beginPath();
    ctx.ellipse(x, y, e.w / 2, e.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    // brain folds
    ctx.strokeStyle = white ? '#fff' : '#8a2a2a';
    ctx.lineWidth = 2;
    for (var fi = 0; fi < 4; fi++) {
      var fy = y - e.h / 4 + fi * 6;
      ctx.beginPath();
      ctx.arc(x + (fi % 2 ? 4 : -4), fy, 8, 0, Math.PI);
      ctx.stroke();
    }
    ctx.fillStyle = '#e06868';
    ctx.beginPath();
    ctx.arc(x - 5, y - 4, 3, 0, Math.PI * 2);
    ctx.arc(x + 5, y - 4, 3, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  if (e.boss === 'queenbee') {
    // wings
    var flap = Math.sin(Time.seconds * 30) * 4;
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.ellipse(x - 14, y - 4 + flap, 9, 5, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 14, y - 4 + flap, 9, 5, 0.4, 0, Math.PI * 2);
    ctx.fill();
    // body
    ctx.fillStyle = white ? '#fff' : '#e8b83d';
    ctx.beginPath();
    ctx.ellipse(x, y, e.w / 2, e.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    // stripes
    ctx.fillStyle = white ? '#fff' : '#8a6a1f';
    ctx.fillRect(x - 8, y - e.h / 2, 5, e.h);
    ctx.fillRect(x + 3, y - e.h / 2, 5, e.h);
    // stinger
    ctx.fillStyle = white ? '#fff' : '#4a3a1f';
    ctx.beginPath();
    ctx.moveTo(x, y + e.h / 2);
    ctx.lineTo(x - 4, y + e.h / 2 + 10);
    ctx.lineTo(x + 4, y + e.h / 2 + 10);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(x - 5, y - 4, 3, 0, Math.PI * 2);
    ctx.arc(x + 5, y - 4, 3, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  if (e.boss === 'skeletron') {
    // hands
    for (var hi = 0; hi < e.arms.length; hi++) {
      var h = e.arms[hi];
      if (h.dead) continue;
      var hx = h.x - cam.x + W / 2, hy = h.y - cam.y + H / 2;
      ctx.fillStyle = h.flash > 0 ? '#fff' : '#d8c8a8';
      ctx.beginPath();
      ctx.arc(hx, hy, h.w / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#a89070';
      ctx.fillRect(hx - 2, hy, 4, 4);
      for (var f = 0; f < 3; f++) {
        ctx.fillRect(hx - 6 + f * 5, hy + h.w / 2 - 3, 3, 5);
      }
    }
    // head with jaw
    ctx.fillStyle = white ? '#fff' : '#d8c8a8';
    ctx.beginPath();
    ctx.arc(x, y - 4, e.w / 2, 0, Math.PI * 2);
    ctx.fill();
    // eyes
    ctx.fillStyle = '#ff3d3d';
    ctx.beginPath();
    ctx.arc(x - 8, y - 8, 4, 0, Math.PI * 2);
    ctx.arc(x + 8, y - 8, 4, 0, Math.PI * 2);
    ctx.fill();
    // jaw
    ctx.fillStyle = white ? '#fff' : '#b8a888';
    ctx.fillRect(x - e.w / 2 + 4, y + 4, e.w - 8, 10);
    ctx.fillStyle = '#fff';
    for (var ti = 0; ti < 5; ti++) {
      ctx.fillRect(x - e.w / 2 + 7 + ti * 8, y + 6, 4, 6);
    }
    return;
  }

  if (e.boss === 'wallofflesh') {
    // flesh wall
    ctx.fillStyle = white ? '#fff' : '#c04848';
    ctx.fillRect(x - e.w / 2, y - e.h / 2, e.w, e.h);
    // mouths
    ctx.fillStyle = '#8a2a2a';
    ctx.beginPath();
    ctx.arc(x - 20, y, 10, 0, Math.PI * 2);
    ctx.arc(x + 15, y - 6, 8, 0, Math.PI * 2);
    ctx.arc(x + 5, y + 14, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ff6a6a';
    ctx.beginPath();
    ctx.arc(x - 20, y, 4, 0, Math.PI * 2);
    ctx.arc(x + 15, y - 6, 3, 0, Math.PI * 2);
    ctx.arc(x + 5, y + 14, 3, 0, Math.PI * 2);
    ctx.fill();
    // eyes
    ctx.fillStyle = '#ffd0a0';
    ctx.beginPath();
    ctx.arc(x - 30, y - 10, 5, 0, Math.PI * 2);
    ctx.arc(x + 28, y - 12, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(x - 30, y - 10, 2.5, 0, Math.PI * 2);
    ctx.arc(x + 28, y - 12, 2.5, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  if (e.boss === 'martiansaucer') {
    // plasma glow
    ctx.fillStyle = 'rgba(90,220,255,0.2)';
    ctx.beginPath();
    ctx.arc(x, y, e.w / 2 + 10, 0, Math.PI * 2);
    ctx.fill();
    // hull
    ctx.fillStyle = white ? '#fff' : '#7a8f9a';
    ctx.beginPath();
    ctx.ellipse(x, y - 6, e.w / 2, e.h * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();
    // dome
    ctx.fillStyle = white ? '#fff' : '#a8d8f0';
    ctx.beginPath();
    ctx.arc(x, y - 14, e.w * 0.2, 0, Math.PI * 2);
    ctx.fill();
    // bottom beam
    ctx.fillStyle = e.phase2 ? 'rgba(120,255,120,0.5)' : 'rgba(140,220,255,0.45)';
    ctx.beginPath();
    ctx.moveTo(x - e.w * 0.18, y);
    ctx.lineTo(x + e.w * 0.18, y);
    ctx.lineTo(x, y + e.h * 0.45);
    ctx.closePath();
    ctx.fill();
    // lights
    ctx.fillStyle = e.phase2 ? '#ff4d4d' : '#8aff4d';
    for (var lg = 0; lg < 4; lg++) {
      ctx.beginPath();
      ctx.arc(x - e.w / 2 + 8 + lg * (e.w / 4), y - 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    return;
  }

  if (e.boss === 'lunar') {
    // shield orb
    if (!e.shieldDown) {
      ctx.fillStyle = 'rgba(' + (white ? '255,255,255' : e.color) + ',0.25)';
      ctx.beginPath();
      ctx.arc(x, y, e.w / 2 + 26 + Math.sin(Time.seconds * 3) * 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = white ? '#fff' : e.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, e.w / 2 + 26 + Math.sin(Time.seconds * 3) * 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 1;
    }
    // pillar body
    ctx.fillStyle = white ? '#fff' : '#2a2a35';
    ctx.beginPath();
    ctx.moveTo(x - e.w / 2, y + e.h / 2);
    ctx.lineTo(x - e.w / 2 + 10, y - e.h / 2);
    ctx.lineTo(x + e.w / 2 - 10, y - e.h / 2);
    ctx.lineTo(x + e.w / 2, y + e.h / 2);
    ctx.closePath();
    ctx.fill();
    // pillar accents (theme-colored runes)
    ctx.fillStyle = white ? '#fff' : e.color;
    for (var pr = 0; pr < 4; pr++) {
      ctx.globalAlpha = 0.5 + Math.sin(Time.seconds * 4 + pr) * 0.3;
      ctx.fillRect(x - e.w / 2 + 6, y - e.h / 2 + 10 + pr * (e.h - 40) / 3, e.w - 12, 6);
    }
    ctx.globalAlpha = 1;
    // crown
    ctx.fillStyle = white ? '#fff' : e.color;
    ctx.beginPath();
    ctx.arc(x, y - e.h / 2, 8, Math.PI, Math.PI * 2);
    ctx.fill();
    // shield pct text when shielded
    if (!e.shieldDown && e.shieldMax > 0) {
      ctx.fillStyle = '#fff';
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Shield ' + Math.max(0, Math.round(e.shieldHp / e.shieldMax * 100)) + '%', x, y + e.h / 2 + 16);
    }
    return;
  }

  if (e.boss === 'flyingdutchman') {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(e.dir || 1, 1);
    ctx.fillStyle = white ? '#fff' : '#6a432d';
    ctx.beginPath();
    ctx.moveTo(-52, 2);
    ctx.lineTo(48, 2);
    ctx.lineTo(34, 24);
    ctx.lineTo(-36, 24);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = white ? '#fff' : '#3a291f';
    ctx.fillRect(-42, 8, 82, 7);
    ctx.fillStyle = '#202830';
    for (var dc = -1; dc <= 1; dc++) {
      ctx.beginPath();
      ctx.arc(dc * 27, 10, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = white ? '#fff' : '#d8c89a';
    ctx.fillRect(-3, -38, 6, 42);
    ctx.beginPath();
    ctx.moveTo(2, -36);
    ctx.lineTo(42, -8);
    ctx.lineTo(2, -8);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(120,255,190,0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 8, 58, 32, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  if (e.boss === 'mothron') {
    // wing flap
    var flap = Math.sin(Time.seconds * 20) * 0.8;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(e.dir || 1, 1);
    ctx.fillStyle = white ? '#fff' : '#9a8ab8';
    // wings
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-30, -28 * flap, -46, -6);
    ctx.quadraticCurveTo(-30, 6, 0, 8);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-26, 28 * flap, -40, 10);
    ctx.quadraticCurveTo(-24, 2, 0, -2);
    ctx.closePath();
    ctx.fill();
    // body
    ctx.fillStyle = white ? '#fff' : '#6a5a8a';
    ctx.beginPath();
    ctx.ellipse(0, 0, 12, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    // head
    ctx.fillStyle = white ? '#fff' : '#4a3a6a';
    ctx.beginPath();
    ctx.arc(10, -4, 6, 0, Math.PI * 2);
    ctx.fill();
    // eye
    ctx.fillStyle = e.phase2 ? '#ff4d4d' : '#ffd84d';
    ctx.beginPath();
    ctx.arc(13, -5, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  if (e.boss === 'goblinwarlock') {
    // robe
    ctx.fillStyle = white ? '#fff' : '#4a3560';
    ctx.beginPath();
    ctx.moveTo(x - 12, y - 14);
    ctx.lineTo(x + 12, y - 14);
    ctx.lineTo(x + 16, y + 22);
    ctx.lineTo(x - 16, y + 22);
    ctx.closePath();
    ctx.fill();
    // head
    ctx.fillStyle = white ? '#fff' : '#8a9a5a';
    ctx.beginPath();
    ctx.arc(x, y - 20, 9, 0, Math.PI * 2);
    ctx.fill();
    // hat
    ctx.fillStyle = white ? '#fff' : '#2a2040';
    ctx.beginPath();
    ctx.moveTo(x - 12, y - 22);
    ctx.lineTo(x + 12, y - 22);
    ctx.lineTo(x + 4, y - 40);
    ctx.lineTo(x - 6, y - 38);
    ctx.closePath();
    ctx.fill();
    // eyes
    ctx.fillStyle = e.phase2 ? '#ff4d4d' : '#ffd84d';
    ctx.beginPath();
    ctx.arc(x - 4, y - 20, 2, 0, Math.PI * 2);
    ctx.arc(x + 4, y - 20, 2, 0, Math.PI * 2);
    ctx.fill();
    // magic aura
    ctx.fillStyle = 'rgba(200,92,255,0.25)';
    ctx.beginPath();
    ctx.arc(x, y, e.w / 2 + 8 + Math.sin(Time.seconds * 5) * 3, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  if (e.boss === 'piratecaptain') {
    // coat
    ctx.fillStyle = white ? '#fff' : '#2a3a4d';
    ctx.beginPath();
    ctx.moveTo(x - 14, y - 16);
    ctx.lineTo(x + 14, y - 16);
    ctx.lineTo(x + 18, y + 24);
    ctx.lineTo(x - 18, y + 24);
    ctx.closePath();
    ctx.fill();
    // hat
    ctx.fillStyle = white ? '#fff' : '#1a2028';
    ctx.beginPath();
    ctx.moveTo(x - 20, y - 22);
    ctx.lineTo(x + 20, y - 22);
    ctx.lineTo(x + 18, y - 30);
    ctx.lineTo(x - 18, y - 30);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(x - 4, y - 38, 8, 10);
    // head
    ctx.fillStyle = white ? '#fff' : '#d8a878';
    ctx.beginPath();
    ctx.arc(x, y - 16, 8, 0, Math.PI * 2);
    ctx.fill();
    // beard
    ctx.fillStyle = white ? '#fff' : '#5a4a3a';
    ctx.beginPath();
    ctx.moveTo(x - 6, y - 14);
    ctx.lineTo(x + 6, y - 14);
    ctx.lineTo(x + 8, y - 2);
    ctx.lineTo(x - 8, y - 2);
    ctx.closePath();
    ctx.fill();
    // eye patch
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(x + 3, y - 17, 2.5, 0, Math.PI * 2);
    ctx.fill();
    // cannonball aura
    ctx.fillStyle = 'rgba(255,184,77,0.25)';
    ctx.beginPath();
    ctx.arc(x, y, e.w / 2 + 6 + Math.sin(Time.seconds * 4) * 3, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
}

// ---------- Player drawing ----------
function drawPlayer(ctx, game, p) {
  p = p || game.player;
  var cam = game.cam;
  var x = p.x - cam.x + canvas.width / 2;
  var y = p.y - cam.y + canvas.height / 2;

  if (p.invuln > 0 && Math.floor(Time.seconds * 12) % 2 === 0) ctx.globalAlpha = 0.4;
  ctx.save();
  ctx.translate(x, y);

  var moving = Math.abs(p.vx) > 0.5 && p.onGround;

  // dye tint on armor
  var dyeTint = null;
  if (p.inventory.dyes && p.inventory.dyes[0]) {
    var dyeDef = ITEMS[p.inventory.dyes[0]];
    if (dyeDef && dyeDef.color) dyeTint = dyeDef.color;
  }
  if (p.inventory.dyes && p.inventory.dyes[1] && !dyeTint) {
    var dyeDef2 = ITEMS[p.inventory.dyes[1]];
    if (dyeDef2 && dyeDef2.color) dyeTint = dyeDef2.color;
  }
  if (p.inventory.dyes && p.inventory.dyes[2] && !dyeTint) {
    var dyeDef3 = ITEMS[p.inventory.dyes[2]];
    if (dyeDef3 && dyeDef3.color) dyeTint = dyeDef3.color;
  }

  // Actual equipped wing accessories only; extra jumps alone do not create wings.
  PixelArt.drawWings(ctx, p);

  // mount behind the player
  if (p.mounted && p.mountDef) {
    var mountCol = p.mountDef.color || '#fff';
    var gallop = moving ? Math.sin(Time.seconds * 14) * 3 : 0;
    ctx.fillStyle = shade(mountCol, -25);
    ctx.fillRect(-8, -4 + gallop * 0.3, 8, 12);
    ctx.fillRect(0, -4 - gallop * 0.3, 8, 12);
    ctx.fillStyle = mountCol;
    ctx.beginPath();
    ctx.ellipse(0, -6 + gallop * 0.2, 16, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    // head
    ctx.fillStyle = mountCol;
    ctx.beginPath();
    ctx.arc(-16, -10, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#222';
    ctx.fillRect(-19, -11, 3, 2);
    ctx.fillRect(-13, -11, 3, 2);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(-22, -10, 5, 1);
    ctx.fillRect(-22, -6, 5, 1);
    ctx.fillRect(-22, -2, 5, 1);
  }

  var bodyDef = ITEMS[p.inventory.armor.chest], headDef = ITEMS[p.inventory.armor.head], legDef = ITEMS[p.inventory.armor.legs];
  var bodyCol = bodyDef ? bodyDef.color : '#578e9c';
  var headCol = headDef ? headDef.color : '#e4ad80';
  var legCol = legDef ? legDef.color : '#586480';
  if (dyeTint) {
    bodyCol = mixColor(bodyCol, dyeTint, 0.6);
    headCol = mixColor(headCol, dyeTint, 0.5);
    legCol = mixColor(legCol, dyeTint, 0.6);
  }

  // soft ground shadow
  if (p.onGround) {
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.beginPath();
    ctx.ellipse(0, 15, 9, 2.6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  var animation = PixelArt.playerAnimation(p, Time.seconds);
  // Fit the adventurer to the 22x32 collision body, keeping boots at its feet.
  ctx.save(); ctx.translate(0, 3); ctx.scale(0.8, 0.8);
  PixelArt.drawActor(ctx, 0, 0, p.dir, bodyCol, headCol, legCol, !!headDef, p.hair || 0, animation.frame, null, animation.pose, animation.action);
  ctx.restore();
  var toolStack = p.inventory.selectedItem();
  var tool = toolStack && ITEMS[toolStack.id];
  if (p.toolAnimT > 0 && tool && tool.type === 'tool') {
    ctx.save(); ctx.translate(p.dir * 5, -5); ctx.scale(p.dir, 1);
    ctx.rotate(-1 + (1 - p.toolAnimT / 0.18) * 1.8);
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#493b38'; ctx.fillRect(-1, -17, 3, 22);
    ctx.fillStyle = '#b99a66'; ctx.fillRect(0, -16, 1, 20);
    ctx.fillStyle = tool.color || '#b7c4c8'; ctx.fillRect(-7, -18, 14, 4);
    ctx.fillStyle = '#e5d9b7'; ctx.fillRect(-6, -18, 10, 1);
    ctx.restore();
  }
  ctx.restore(); // player-local transform
  ctx.globalAlpha = 1;

  if (p.netName) {
    ctx.font = '11px monospace'; ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(8,11,9,0.75)'; ctx.fillRect(x - 42, y - 48, 84, 16);
    ctx.fillStyle = '#edf0df'; ctx.fillText(p.netName, x, y - 36);
  }

  // grappling hook line
  if (p.hook) {
    var hx = p.hook.tx * TILE + 8 - cam.x + canvas.width / 2;
    var hy = p.hook.ty * TILE + 8 - cam.y + canvas.height / 2;
    ctx.strokeStyle = 'rgba(220,220,220,0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y - 10);
    ctx.lineTo(hx, hy);
    ctx.stroke();
    ctx.fillStyle = '#c0c0c0';
    ctx.beginPath();
    ctx.arc(hx, hy, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // fishing bobber
  if (p.fishing) {
    var bx = p.fishing.bobX - cam.x + canvas.width / 2;
    var by = p.fishing.bobY - cam.y + canvas.height / 2;
    var bobberWob = Math.sin(Time.seconds * 4) * 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y - 14);
    ctx.lineTo(bx, by - 4);
    ctx.stroke();
    ctx.fillStyle = p.fishBite ? '#ff4d4d' : '#ff4d4d';
    ctx.beginPath();
    ctx.arc(bx, by + bobberWob, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(bx + 1, by + bobberWob - 1, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  if (p.kite) {
    var kx = p.kite.x - cam.x + canvas.width / 2;
    var ky = p.kite.y - cam.y + canvas.height / 2;
    ctx.strokeStyle = 'rgba(230,230,230,0.8)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x, y - 8); ctx.quadraticCurveTo((x + kx) / 2, (y + ky) / 2 + 18, kx, ky); ctx.stroke();
    ctx.save(); ctx.translate(kx, ky); ctx.rotate(Math.sin(p.kite.t * 5) * 0.15);
    ctx.fillStyle = p.kite.def.kiteColor || p.kite.def.color;
    ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(10, 0); ctx.lineTo(0, 12); ctx.lineTo(-10, 0); ctx.closePath(); ctx.fill();
    if (p.kite.def.kiteAccent) { ctx.fillStyle = p.kite.def.kiteAccent; ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(10, 0); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill(); }
    ctx.strokeStyle = p.kite.def.kiteAccent || '#fff'; ctx.beginPath(); ctx.moveTo(0, 12); ctx.lineTo(5, 20); ctx.lineTo(-3, 28); ctx.stroke(); ctx.restore();
  }

  // pets
  for (var petIdx = 0; petIdx < p.pets.length; petIdx++) {
    var pet = p.pets[petIdx];
    var petDef = pet.def;
    var psx = pet.x - cam.x + canvas.width / 2;
    var psy = pet.y - cam.y + canvas.height / 2;
    ctx.fillStyle = petDef.color || '#c8a878';
    ctx.beginPath();
    ctx.arc(psx, psy, 5 + Math.sin(pet.t * 6) * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(psx - 2, psy - 1.5, 1.2, 0, Math.PI * 2);
    ctx.arc(psx + 2, psy - 1.5, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
  for (var lpIdx = 0; lpIdx < p.lightPets.length; lpIdx++) {
    var lp = p.lightPets[lpIdx];
    var lpd = lp.def;
    var lsx = lp.x - cam.x + canvas.width / 2;
    var lsy = lp.y - cam.y + canvas.height / 2;
    ctx.fillStyle = 'rgba(255,255,200,0.25)';
    ctx.beginPath();
    ctx.arc(lsx, lsy, 14 + Math.sin(Time.seconds * 3) * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = lpd.color || '#6bc8ff';
    ctx.beginPath();
    ctx.arc(lsx, lsy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(lsx, lsy, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // weapon swing
  if (p.swingT > 0 && !CombatArt.drawSwing(ctx, p, x, y)) {
    var item = p.inventory.selectedItem();
    var itemDef = item && ITEMS[item.id] ? ITEMS[item.id] : null;
    var dmg = itemDef ? itemDef.dmg : 10;
    var reach = itemDef && itemDef.range ? itemDef.range * TILE + 8 : 30;
    var prog = 1 - p.swingT / Math.max(0.12, 0.3);
    var isThrust = itemDef && (itemDef.shortSword || itemDef.meleeMode === 'thrust');
    ctx.save();
    ctx.translate(x, y - 6);
    var bladeColor = itemDef && itemDef.color ? itemDef.color : '#e0e0e0';
    if (isThrust) {
      // vanilla shortsword: straight stab extending forward along the aim
      var ext = reach * (0.45 + 0.55 * Math.sin(Math.min(1, prog * 1.6) * Math.PI * 0.5));
      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(Math.cos(p.swingAng) * 6, Math.sin(p.swingAng) * 6);
      ctx.lineTo(Math.cos(p.swingAng) * ext, Math.sin(p.swingAng) * ext);
      ctx.stroke();
      ctx.strokeStyle = bladeColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(Math.cos(p.swingAng) * 6, Math.sin(p.swingAng) * 6);
      ctx.lineTo(Math.cos(p.swingAng) * ext, Math.sin(p.swingAng) * ext);
      ctx.stroke();
      ctx.fillStyle = dmg > 40 ? '#ffe14d' : (dmg > 25 ? '#9ad0ff' : '#d0d0d0');
      ctx.beginPath();
      ctx.arc(Math.cos(p.swingAng) * ext, Math.sin(p.swingAng) * ext, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
    var a0 = p.swingAng - 1.2 + prog * 2.4;
    // motion trail arc behind the blade
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, reach * 0.8, p.swingAng - 1.2, a0, false);
    ctx.stroke();
    ctx.strokeStyle = bladeColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a0) * reach, Math.sin(a0) * reach);
    ctx.stroke();
    // bright edge highlight on the leading half of the blade
    ctx.strokeStyle = 'rgba(255,255,255,0.75)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a0) * reach * 0.45, Math.sin(a0) * reach * 0.45);
    ctx.lineTo(Math.cos(a0) * reach, Math.sin(a0) * reach);
    ctx.stroke();
    ctx.fillStyle = dmg > 40 ? '#ffe14d' : (dmg > 25 ? '#9ad0ff' : '#d0d0d0');
    ctx.beginPath();
    ctx.arc(Math.cos(a0) * reach, Math.sin(a0) * reach, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    }
  }
}

// ---------- Projectiles ----------
function drawProjectile(ctx, p, cam, W, H) {
  var x = p.x - cam.x + W / 2;
  var y = p.y - cam.y + H / 2;
  if (x < -30 || y < -30 || x > W + 30 || y > H + 30) return;
  if (p.deployMode === 'cloud') {
    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = p.color || '#697891';
    for (var cc = -2; cc <= 2; cc++) {
      ctx.beginPath(); ctx.arc(x + cc * 8, y + Math.abs(cc) * 2, 11, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    return;
  }
  if (p.deployMode === 'wall') {
    ctx.save();
    var rainbows = ['#ff5c5c','#ff9a3d','#ffe14d','#5cff8a','#5cc8ff','#c85cff'];
    for (var wf = -p.zoneHeight / 2; wf <= p.zoneHeight / 2; wf += 12) {
      var wallCol = p.trailWall ? rainbows[Math.abs(Math.floor(wf / 12)) % rainbows.length] : (Math.floor(wf / 12 + Time.frame) % 2 ? '#65d85c' : '#b8ff68');
      ctx.fillStyle = wallCol;
      ctx.beginPath(); ctx.arc(x + Math.sin(Time.seconds * 9 + wf + (p.trailWall ? x * 0.01 : 0)) * 4, y + wf, 8, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    return;
  }
  if (p.piranha) {
    ctx.save();
    ctx.fillStyle = p.color || '#ff7a55';
    ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(x - 2, y - 2, 1.6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#c83820';
    ctx.fillRect(x - 6, y - 1, 6, 2);
    ctx.restore();
    return;
  }
  if (p.channelBeam && p.beamEndX !== undefined) {
    var bx = p.beamEndX - cam.x + W / 2, by = p.beamEndY - cam.y + H / 2;
    var beamColors = p.beamStyle === 'blood' ? ['#701c30','#b83050','#e05868','#ff9aaa'] : ['#ff5c5c','#ffe14d','#5cff8a','#5cc8ff','#c85cff'];
    ctx.save();
    for (var bc = 0; bc < beamColors.length; bc++) {
      ctx.strokeStyle = beamColors[(bc + Math.floor(Time.seconds * 12)) % beamColors.length];
      ctx.lineWidth = p.beamStyle === 'blood' ? 3 : 2;
      ctx.beginPath();
      ctx.moveTo(x, y + (bc - (beamColors.length - 1) / 2) * 1.5);
      ctx.lineTo(bx, by + (bc - (beamColors.length - 1) / 2) * 1.5);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(bx, by); ctx.stroke();
    ctx.restore();
  }
  if (p.tether && p.sourcePlayer) {
    ctx.save();
    ctx.strokeStyle = p.color || '#a8a8b0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p.sourcePlayer.x - cam.x + W / 2, p.sourcePlayer.y - 8 - cam.y + H / 2);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.restore();
  }
  var ang = Math.atan2(p.vy, p.vx);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang);
  if (CombatArt.drawProjectile(ctx, p)) { ctx.restore(); return; }
  switch (p.type) {
    case P.ARROW:
      ctx.fillStyle = p.color || '#d8b28a';
      ctx.fillRect(-8, -1, 8, 2);
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(0, -3); ctx.lineTo(0, 3); ctx.lineTo(5, 0);
      ctx.fill();
      break;
    case P.LASER:
      ctx.fillStyle = p.owner === 'player' ? '#ff4d6d' : '#ff8a3d';
      ctx.fillRect(-12, -1.5, 12, 3);
      ctx.fillStyle = '#fff';
      ctx.fillRect(-12, -0.7, 8, 1.4);
      break;
    case P.DEATHLASER:
      ctx.fillStyle = '#ff304d';
      ctx.fillRect(-18, -3, 20, 6);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-16, -1, 16, 2);
      break;
    case P.MAGICBOLT:
      if (p.deployMode === 'sphere') {
        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = p.color || '#6b8aff';
        ctx.beginPath(); ctx.arc(0, 0, 12 + Math.sin(Time.seconds * 8) * 2, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      ctx.fillStyle = p.color || '#6be8ff';
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(0, 0, 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case P.CURSEDFLAME:
      ctx.fillStyle = p.color || '#7a3df0';
      ctx.beginPath();
      ctx.arc(0, 0, 4 + Math.sin(Time.seconds * 20) * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.color ? '#fff0e8' : '#3dff9d';
      ctx.beginPath();
      ctx.arc(0, 0, 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case P.ROCKET:
      if (p.mineArmed) {
        ctx.fillStyle = '#4a4a42';
        ctx.fillRect(-7, -3, 14, 6);
        ctx.fillStyle = Math.floor(Time.seconds * 8) % 2 ? '#ff4d4d' : '#782828';
        ctx.fillRect(-2, -5, 4, 3);
        break;
      }
      ctx.fillStyle = '#c8ccd4';
      ctx.fillRect(-6, -2, 8, 4);
      ctx.fillStyle = '#ff4d4d';
      ctx.fillRect(2, -2, 3, 4);
      ctx.fillStyle = 'rgba(255,200,100,0.6)';
      ctx.beginPath();
      ctx.arc(-10, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    case P.GUNBULLET:
      ctx.fillStyle = p.color || '#ffd54d';
      ctx.fillRect(-6, -1.5, 7, 3);
      ctx.fillStyle = '#fff';
      ctx.fillRect(-4, -0.7, 4, 1.4);
      break;
    case P.SPORE:
      ctx.fillStyle = 'rgba(77,255,140,0.7)';
      ctx.beginPath();
      ctx.arc(0, 0, 5 + Math.sin(Time.seconds * 15) * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e8ffe8';
      ctx.beginPath();
      ctx.arc(0, 0, 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case P.CRESCENT:
      ctx.fillStyle = '#c85cff';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#3a1a4a';
      ctx.beginPath();
      ctx.arc(-2, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    case P.RAZOR:
      if (p.controlled) {
        ctx.fillStyle = p.color || '#c8ccd4';
        ctx.beginPath();
        ctx.moveTo(9, 0);
        ctx.lineTo(-5, -3);
        ctx.lineTo(-8, 0);
        ctx.lineTo(-5, 3);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#704838';
        ctx.fillRect(-11, -1.5, 5, 3);
        break;
      }
      ctx.fillStyle = p.color || '#3dffd5';
      ctx.save();
      ctx.rotate(Time.seconds * 10);
      ctx.fillRect(-6, -2, 12, 4);
      ctx.restore();
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      break;
    case P.RAINBOW:
      ctx.fillStyle = '#ff5c8a';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffe14d';
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#3dffd5';
      ctx.beginPath();
      ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    case P.PRISM:
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillRect(-14, -2, 14, 4);
      ctx.fillStyle = '#fff';
      ctx.fillRect(-14, -0.8, 10, 1.6);
      break;
    case P.FIREBALL:
      ctx.fillStyle = '#ff8a3d';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffd54d';
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    case P.STAR:
      ctx.strokeStyle = p.fallenStar ? 'rgba(255,232,120,0.75)' : 'rgba(200,190,255,0.65)';
      ctx.lineWidth = p.fallenStar ? 4 : 2;
      ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(-4, 0); ctx.stroke();
      ctx.fillStyle = p.color || '#ffe88a';
      ctx.beginPath();
      for (var st = 0; st < 10; st++) {
        var sr = st % 2 ? 3 : (p.fallenStar ? 8 : 5);
        var sa = -Math.PI / 2 + st * Math.PI / 5;
        if (st === 0) ctx.moveTo(Math.cos(sa) * sr, Math.sin(sa) * sr);
        else ctx.lineTo(Math.cos(sa) * sr, Math.sin(sa) * sr);
      }
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 2, 0, Math.PI * 2); ctx.fill();
      break;
    case P.STINGER:
      ctx.fillStyle = p.color || '#8a6a3d';
      ctx.fillRect(p.spear ? -24 : -7, -1.5, p.spear ? 28 : 9, 3);
      ctx.fillStyle = '#5a4a2a';
      ctx.fillRect(p.spear ? -24 : -7, 0, p.spear ? 8 : 4, 2);
      break;
    case P.PHANTOMBOLT:
      ctx.fillStyle = p.color || '#7a5cff';
      ctx.beginPath();
      ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#c8b8ff';
      ctx.beginPath();
      ctx.arc(0, 0, 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case P.DANDELIONSEED:
      ctx.fillStyle = '#f4f0d0'; ctx.beginPath(); ctx.arc(0, 0, 2, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#d8d0a0'; ctx.beginPath(); ctx.moveTo(-5, -3); ctx.lineTo(0, 0); ctx.stroke();
      break;
    case P.PAPERPLANE:
      ctx.fillStyle = p.color || '#f4f0e8';
      ctx.beginPath(); ctx.moveTo(-9, -4); ctx.lineTo(10, 0); ctx.lineTo(-7, 5); ctx.lineTo(-2, 0); ctx.closePath(); ctx.fill();
      break;
    case P.BLAZE:
      ctx.fillStyle = '#ffe14d';
      ctx.beginPath();
      ctx.arc(0, 0, 5 + Math.sin(Time.seconds * 18) * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(0, 0, 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case P.CORITEBOLT:
      ctx.fillStyle = '#ff8a3d';
      ctx.fillRect(-8, -1.5, 8, 3);
      ctx.fillStyle = '#ffe14d';
      ctx.fillRect(-6, -0.7, 5, 1.4);
      break;
    case P.DART:
      ctx.fillStyle = p.color || '#d8b28a';
      ctx.fillRect(-7, -1.5, 9, 3);
      ctx.fillStyle = '#8a5c34';
      ctx.fillRect(2, -1.5, 3, 3);
      break;
    case P.FROSTBOLT:
      ctx.fillStyle = '#9ad8ff';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillRect(-10, -1, 6, 2);
      break;
    case P.PLASMA:
      ctx.fillStyle = '#3dff9d';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e8fff2';
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    case P.KOBOMB:
      ctx.fillStyle = '#d85050';
      ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffe14d';
      ctx.fillRect(-3, -3, 6, 6);
      break;
    case P.PUMPKINBLADE:
      ctx.fillStyle = '#ff8a3d';
      ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffd060';
      ctx.fillRect(-1.5, -7, 3, 14);
      break;
    case P.WAVERSWORD:
      ctx.fillStyle = '#3dff9d';
      ctx.fillRect(-2, -8, 4, 16);
      ctx.fillStyle = '#e8fff2';
      ctx.fillRect(-0.8, -8, 1.6, 16);
      break;
    case P.WATERSTREAM:
      ctx.fillStyle = '#4dc8ff';
      ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#bfeaff';
      ctx.beginPath(); ctx.arc(0, 0, 2.5, 0, Math.PI * 2); ctx.fill();
      break;
    case P.THORN:
      ctx.fillStyle = '#8f70d8';
      ctx.fillRect(-2, -9, 4, 18);
      ctx.fillStyle = '#c8a8ff';
      ctx.fillRect(-1, -9, 2, 18);
      break;
    case P.BAT:
      ctx.fillStyle = '#5a2a1a';
      ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ff8a3d';
      ctx.beginPath(); ctx.arc(-3, 0, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(3, 0, 3, 0, Math.PI * 2); ctx.fill();
      break;
    case P.ELECTRO:
      ctx.strokeStyle = '#70d8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-6, -4); ctx.lineTo(2, 0); ctx.lineTo(-2, 3); ctx.lineTo(6, -2);
      ctx.stroke();
      break;
    case P.WATERBOLT:
      ctx.fillStyle = '#4d8ad0';
      ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#9dc8ff';
      ctx.beginPath(); ctx.arc(-1.5, -1.5, 2.5, 0, Math.PI * 2); ctx.fill();
      break;
    case P.DEMONSCYTHE:
      ctx.rotate(p.age ? (p.age * 14) % (Math.PI * 2) : 0);
      ctx.fillStyle = '#a040c8';
      ctx.beginPath();
      ctx.arc(0, 0, 8, Math.PI * 0.25, Math.PI * 1.4);
      ctx.arc(0, 0, 3, Math.PI * 1.4, Math.PI * 0.25, true);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#d888ff';
      ctx.beginPath(); ctx.arc(0, 0, 2.5, 0, Math.PI * 2); ctx.fill();
      break;
    case P.CANDY:
      ctx.strokeStyle = '#ff6a8a';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-7, -4); ctx.lineTo(7, 4); ctx.stroke();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(-7, -5.2); ctx.lineTo(7, 2.8); ctx.stroke();
      break;
  }
  ctx.restore();
}

// ---------- FX ----------
function drawFX(ctx, game, cam, W, H) {
  for (var i = 0; i < game.fx.length; i++) {
    var f = game.fx[i];
    var x = f.x - cam.x + W / 2;
    var y = f.y - cam.y + H / 2;
    var life = f.t / f.max;
    if (CombatArt.drawFX(ctx, f, x, y, life)) continue;
    switch (f.type) {
      case 'break':
        ctx.globalAlpha = life;
        ctx.fillStyle = f.color;
        for (var p = 0; p < 6; p++) {
          var ox = (hash2(f.seed + p, 0) % 20 - 10) * life;
          var oy = (hash2(f.seed + p, 1) % 20 - 10) * life - (1 - life) * 10;
          ctx.fillRect(x + ox, y + oy, 3, 3);
        }
        break;
      case 'spark':
        ctx.globalAlpha = life;
        ctx.strokeStyle = f.color || '#ffd890';
        ctx.lineWidth = 1.5;
        for (var sp = 0; sp < 4; sp++) {
          var sang = hash2(f.seed + sp * 7, 3) % 628 / 100;
          var slen = 3 + (1 - life) * 7;
          var scx = Math.cos(sang), scy = Math.sin(sang);
          var sdx = scx * (3 + (1 - life) * 9);
          var sdy = scy * (3 + (1 - life) * 9);
          ctx.beginPath();
          ctx.moveTo(x + sdx, y + sdy);
          ctx.lineTo(x + sdx + scx * slen, y + sdy + scy * slen);
          ctx.stroke();
        }
        break;
      case 'slash':
        ctx.globalAlpha = life;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 'cast':
        ctx.globalAlpha = life;
        ctx.strokeStyle = '#6be8ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 10 + (1 - life) * 12, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 'heart':
        ctx.globalAlpha = life;
        ctx.fillStyle = '#ff5c8a';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x - 6, y - 8, x, y - 12);
        ctx.quadraticCurveTo(x + 6, y - 8, x, y);
        ctx.fill();
        break;
      case 'heal':
        ctx.globalAlpha = life;
        ctx.fillStyle = '#6bff8a';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('+', x, y);
        break;
      case 'teleport':
        ctx.globalAlpha = life;
        ctx.strokeStyle = '#e0d8ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 20 * (1 - life) + 4, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 'whip':
        ctx.globalAlpha = life;
        ctx.strokeStyle = '#ffe9a8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(f.tx, f.ty);
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(f.tx, f.ty, 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'boom':
        ctx.globalAlpha = life;
        ctx.fillStyle = '#ff9a3d';
        ctx.beginPath();
        ctx.arc(x, y, 22 * (1 - life) + 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(x, y, 12 * (1 - life) + 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'confetti':
        ctx.globalAlpha = life;
        ctx.fillStyle = f.color;
        ctx.save(); ctx.translate(x, y); ctx.rotate((1 - life) * 12 + f.seed); ctx.fillRect(-3, -1, 6, 2); ctx.restore();
        break;
      case 'releaseLantern':
        ctx.globalAlpha = Math.min(1, life * 4);
        ctx.fillStyle = 'rgba(255,184,72,0.25)';
        ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = f.color || '#ffc868'; ctx.fillRect(x - 5, y - 7, 10, 13);
        ctx.fillStyle = '#fff0b0'; ctx.fillRect(x - 2, y - 3, 4, 5);
        ctx.strokeStyle = '#8a5a30'; ctx.strokeRect(x - 5, y - 7, 10, 13);
        break;
      case 'shimmer':
        ctx.globalAlpha = life;
        ctx.strokeStyle = f.color || '#82d7ff';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x, y, 8 + (1 - life) * 22, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = '#d8b8ff';
        ctx.beginPath(); ctx.arc(x, y, 3 + (1 - life) * 14, 0, Math.PI * 2); ctx.stroke();
        break;
    }
    ctx.globalAlpha = 1;
  }
}

// ---------- Item icon ----------
function drawItemIcon(ctx, it, x, y) {
  if (!it) return;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(PixelArt.item(it), Math.round(x) - 10, Math.round(y) - 10);
  ctx.restore();
}

function drawLegacyItemIcon(ctx, it, x, y) {
  if (!it) return;
  ctx.save();
  var col = it.color || '#aab8cc';
  var name = (it.name || '').toLowerCase();
  if (it.id === I.LASTPRISM) {
    var prismColors = ['#ff7196','#ffd76b','#83eda3','#72c9ff','#b092ef'];
    for (var pc = 0; pc < 5; pc++) {
      ctx.fillStyle = prismColors[pc];
      ctx.beginPath(); ctx.moveTo(x, y - 8); ctx.lineTo(x - 7 + pc * 3, y + 5); ctx.lineTo(x - 4 + pc * 3, y + 5); ctx.fill();
    }
    ctx.fillStyle = '#fff'; ctx.fillRect(x - 1, y - 5, 1, 5);
  } else if (it.type === 'tool') {
    ctx.fillStyle = '#88643e'; ctx.fillRect(x - 1, y - 3, 2, 12);
    ctx.fillStyle = col;
    if (/drill|chainsaw/.test(name)) {
      ctx.fillRect(x - 4, y - 2, 7, 6);
      ctx.beginPath(); ctx.moveTo(x - 2,y - 3); ctx.lineTo(x + 6,y - 3); ctx.lineTo(x + 3,y - 9); ctx.fill();
    } else if (it.hammer) {
      ctx.fillRect(x - 6, y - 6, 12, 5); ctx.fillStyle = '#fff8'; ctx.fillRect(x - 5, y - 6, 10, 1);
    } else if (it.axe !== undefined) {
      ctx.beginPath(); ctx.moveTo(x - 2,y - 7); ctx.lineTo(x + 6,y - 5); ctx.lineTo(x + 5,y + 1); ctx.lineTo(x - 2,y - 2); ctx.fill();
    } else {
      ctx.beginPath(); ctx.moveTo(x - 8,y - 1); ctx.lineTo(x - 3,y - 6); ctx.lineTo(x + 4,y - 6); ctx.lineTo(x + 8,y - 1); ctx.lineTo(x + 1,y - 3); ctx.lineTo(x - 3,y - 3); ctx.fill();
    }
  } else if (it.type === 'summonstaff' || it.type === 'sentry') {
    ctx.fillStyle = '#89674a'; ctx.fillRect(x - 1, y - 4, 2, 13);
    ctx.strokeStyle = col; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y - 4, 5, 0, Math.PI * 1.7); ctx.stroke();
    ctx.fillStyle = col; ctx.fillRect(x - 2, y - 6, 4, 4);
    ctx.fillStyle = '#fff'; ctx.fillRect(x - 1, y - 6, 1, 2);
  } else if (it.type === 'whip' || it.meleeMode === 'flail' || it.meleeMode === 'yoyo') {
    ctx.strokeStyle = col; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x - 5,y + 6); ctx.bezierCurveTo(x + 8,y + 6,x - 8,y - 6,x + 5,y - 5); ctx.stroke();
    ctx.fillStyle = '#86603c'; ctx.fillRect(x - 7,y + 2,3,7);
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x + 5,y - 5,it.type === 'whip' ? 2 : 4,0,Math.PI * 2); ctx.fill();
  } else if (it.type === 'ammo') {
    ctx.fillStyle = '#886940'; ctx.fillRect(x - 1,y - 3,2,11);
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x,y - 8); ctx.lineTo(x - 3,y - 2); ctx.lineTo(x + 3,y - 2); ctx.fill();
    ctx.fillRect(x - 3,y + 5,6,2);
  } else if (it.icon === 'block' || it.icon === 'bar' || it.type === 'block' || it.type === 'bar') {
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(x - 6, y - 6, 12, 12);
    ctx.fillStyle = it.color || '#888';
    ctx.fillRect(x - 5, y - 5, 10, 10);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(x - 5, y - 5, 10, 3);
  } else if (it.icon === 'W' || it.type === 'melee' || it.type === 'pickaxe' || it.type === 'axe' || it.type === 'hammer') {
    // sword/tool: handle + blade
    var col = it.color || '#c0c0c0';
    ctx.fillStyle = '#8b6b3f';
    ctx.fillRect(x - 1, y + 2, 2, 6);
    ctx.fillStyle = col;
    ctx.fillRect(x - 2, y - 4, 4, 7);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillRect(x - 1, y - 4, 1, 5);
    ctx.fillStyle = '#6b4b2f';
    ctx.fillRect(x - 3, y + 1, 6, 2);
  } else if (it.type === 'ranged' && !/bow|repeater/.test(name)) {
    ctx.fillStyle = '#6b5038'; ctx.fillRect(x - 6,y + 1,4,6);
    ctx.fillStyle = col; ctx.fillRect(x - 8,y - 4,14,6); ctx.fillRect(x + 5,y - 3,4,3);
    ctx.fillStyle = '#e5f4ff'; ctx.fillRect(x - 5,y - 4,9,1);
    if (/shark/.test(name)) {
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x - 3,y - 4); ctx.lineTo(x,y - 8); ctx.lineTo(x + 3,y - 4); ctx.fill();
      ctx.fillStyle = '#1a2431'; ctx.fillRect(x + 3,y - 2,1,1);
    }
  } else if (it.icon === 'R' || it.type === 'ranged') {
    // bow: curved shape
    var col2 = it.color || '#c0c0c0';
    ctx.strokeStyle = col2;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 6, -0.8, 0.8);
    ctx.stroke();
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 5, y - 5);
    ctx.lineTo(x + 5, y + 5);
    ctx.stroke();
  } else if (it.icon === 'M' || it.type === 'magic') {
    // magic: star/wand tip
    var col3 = it.color || '#80c0ff';
    ctx.fillStyle = '#6b4b2f';
    ctx.fillRect(x - 1, y + 1, 2, 6);
    ctx.fillStyle = col3;
    var pts = 5;
    ctx.beginPath();
    for (var mi = 0; mi < pts * 2; mi++) {
      var ang = (mi / (pts * 2)) * Math.PI * 2 - Math.PI / 2;
      var rad = mi % 2 === 0 ? 5 : 2.5;
      var mx2 = x + Math.cos(ang) * rad;
      var my2 = y - 3 + Math.sin(ang) * rad;
      if (mi === 0) ctx.moveTo(mx2, my2); else ctx.lineTo(mx2, my2);
    }
    ctx.closePath();
    ctx.fill();
  } else if (it.icon === 'S' || it.type === 'summon') {
    // staff
    ctx.fillStyle = '#8b6b3f';
    ctx.fillRect(x - 1, y, 2, 7);
    ctx.fillStyle = it.color || '#ffcc44';
    ctx.beginPath();
    ctx.arc(x, y - 2, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.arc(x - 1, y - 3, 1.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (it.type === 'armor' && it.slot === 'head') {
    ctx.fillStyle = col; ctx.fillRect(x - 5,y - 5,10,8); ctx.fillRect(x - 6,y - 2,2,7); ctx.fillRect(x + 4,y - 2,2,7);
    ctx.fillStyle = '#202638'; ctx.fillRect(x - 3,y,6,3);
    ctx.fillStyle = '#edf8ff'; ctx.fillRect(x - 4,y - 5,8,1);
  } else if (it.type === 'armor' && it.slot === 'legs') {
    ctx.fillStyle = col; ctx.fillRect(x - 5,y - 5,10,4); ctx.fillRect(x - 5,y - 1,4,7); ctx.fillRect(x + 1,y - 1,4,7);
    ctx.fillStyle = '#566278'; ctx.fillRect(x - 6,y + 5,5,2); ctx.fillRect(x + 1,y + 5,5,2);
  } else if (it.icon === 'A' || it.type === 'armor') {
    // chestplate shape
    var col4 = it.color || '#888';
    ctx.fillStyle = col4;
    ctx.fillRect(x - 4, y - 4, 8, 9);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(x - 4, y - 4, 8, 3);
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(x - 4, y + 2, 8, 3);
    ctx.fillStyle = shade2(col4, -30);
    ctx.fillRect(x - 5, y - 3, 2, 5);
    ctx.fillRect(x + 3, y - 3, 2, 5);
  } else if (it.icon === 'V' || it.type === 'vanity') {
    // vanity: hat shape
    ctx.fillStyle = it.color || '#cc44aa';
    ctx.fillRect(x - 5, y - 2, 10, 3);
    ctx.fillRect(x - 3, y - 6, 6, 5);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(x - 3, y - 6, 6, 2);
  } else if (it.icon === '🧪' || it.type === 'consumable' || it.type === 'potion') {
    // potion bottle
    var col5 = it.color || '#ff4444';
    ctx.fillStyle = col5;
    ctx.fillRect(x - 2, y - 4, 4, 2);
    ctx.fillRect(x - 3, y - 2, 6, 6);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillRect(x - 2, y - 2, 2, 4);
    ctx.fillStyle = '#bbb';
    ctx.fillRect(x - 2, y - 5, 4, 2);
  } else if (it.icon === '🎣' || it.type === 'fishingrod') {
    // fishing rod
    ctx.strokeStyle = it.color || '#b5824f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 3, y + 6);
    ctx.lineTo(x + 3, y - 5);
    ctx.stroke();
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 3, y - 5);
    ctx.lineTo(x + 5, y + 3);
    ctx.stroke();
  } else if (it.icon === '🪝' || it.type === 'hook') {
    // grappling hook
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, 4, Math.PI, 0);
    ctx.lineTo(x + 4, y + 4);
    ctx.stroke();
  } else if (it.type === 'accessory' && /wing/.test(name)) {
    for (var side = -1; side <= 1; side += 2) {
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.moveTo(x,y + 4); ctx.lineTo(x + side * 8,y - 7); ctx.lineTo(x + side * 7,y + 2); ctx.lineTo(x + side * 3,y + 7); ctx.fill();
      ctx.strokeStyle = '#e5f4ff'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x + side * 2,y + 4); ctx.lineTo(x + side * 6,y - 3); ctx.stroke();
    }
  } else if (it.type === 'accessory') {
    // accessory: shield/circle shape
    ctx.fillStyle = it.color || '#44aaff';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.arc(x - 1, y - 1, 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.moveTo(x,y - 7); ctx.lineTo(x + 6,y - 2); ctx.lineTo(x + 4,y + 6); ctx.lineTo(x - 4,y + 6); ctx.lineTo(x - 6,y - 2); ctx.fill();
    ctx.fillStyle = '#ffffff60'; ctx.beginPath(); ctx.moveTo(x,y - 7); ctx.lineTo(x,y + 2); ctx.lineTo(x - 6,y - 2); ctx.fill();
  }
  ctx.restore();
}

function shade2(hex, amt) {
  var r = hexToRgb(hex);
  r[0] = clamp(r[0] + amt, 0, 255);
  r[1] = clamp(r[1] + amt, 0, 255);
  r[2] = clamp(r[2] + amt, 0, 255);
  return 'rgb(' + r[0] + ',' + r[1] + ',' + r[2] + ')';
}

// ---------- Minimap ----------
// ---------- Minimap & Full Map ----------
// Simple, reliable: render tile colors to ImageData, putImageData, draw markers.


// (MINIMAP_COLORS entries are defined below the function — hoisted by assignment order)

function drawMinimap(game, ctx) {
  var world = game.world;
  var mw = 200, mh = 120; // minimap size in tiles
  var px = Math.floor(game.player.x / TILE);
  var py = Math.floor(game.player.y / TILE);
  var x0 = px - mw / 2, y0 = py - mh / 2;
  // NaN hardening: skip the frame's blit if the player position is corrupt
  // (all tiles would read out of bounds anyway)
  if (!isFinite(px) || !isFinite(py)) return;

  if (!drawMinimap._canvas) {
    drawMinimap._canvas = document.createElement('canvas');
    drawMinimap._canvas.width = mw;
    drawMinimap._canvas.height = mh;
  }
  var mc = drawMinimap._canvas;
  var mctx = mc.getContext('2d');
  var img = mctx.createImageData(mw, mh);
  var d = img.data;

  for (var y = 0; y < mh; y++) {
    for (var x = 0; x < mw; x++) {
      var tx = x0 + x, ty = y0 + y;
      var o = (y * mw + x) * 4;
      if (tx < 0 || tx >= world.W || ty < 0 || ty >= world.H) {
        d[o] = 10; d[o+1] = 10; d[o+2] = 16; d[o+3] = 255; continue;
      }
      var t = world.tiles[ty * world.W + tx];
      var col = MINIMAP_COLORS[t];
      if (col) {
        var rgb = hexToRgb(col);
        d[o] = rgb[0]; d[o+1] = rgb[1]; d[o+2] = rgb[2]; d[o+3] = 255;
      } else if (t === 0) {
        var wl = world.walls[ty * world.W + tx];
        if (wl === 1) { d[o] = 40; d[o+1] = 32; d[o+2] = 24; }
        else if (wl === 2) { d[o] = 58; d[o+1] = 61; d[o+2] = 69; }
        else if (wl !== 0) { d[o] = 32; d[o+1] = 32; d[o+2] = 40; }
        else { d[o] = 12; d[o+1] = 12; d[o+2] = 18; }
        d[o+3] = 255;
      } else {
        d[o] = 136; d[o+1] = 136; d[o+2] = 136; d[o+3] = 255;
      }
    }
  }
  mctx.putImageData(img, 0, 0);

  // draw to screen
  var dw = 210, dh = 126;
  var sx = canvas.width - dw - 8;
  ctx.save();
  ctx.globalAlpha = 0.88;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(mc, sx, 8, dw, dh);
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.strokeRect(sx, 8, dw, dh);
  // player arrow
  var ppx = sx + (px - x0) * 2;
  var ppy = 8 + (py - y0) * 2;
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(ppx, ppy - 4); ctx.lineTo(ppx - 3, ppy + 3); ctx.lineTo(ppx + 3, ppy + 3);
  ctx.closePath(); ctx.fill();
}

function drawFullMap(game, ctx) {
  var world = game.world;
  var W = canvas.width, H = canvas.height;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#0a0a12';
  ctx.fillRect(0, 0, W, H);

  var p = game.player;
  if (game.mapPanX === null) { game.mapPanX = p.x / TILE; game.mapPanY = p.y / TILE; }
  var scale = game.mapZoom || 2;
  var ts = TILE * scale;
  var startTx = Math.floor(game.mapPanX - W / (2 * ts));
  var startTy = Math.floor(game.mapPanY - H / (2 * ts));
  var cols = Math.ceil(W / ts) + 1;
  var rows = Math.ceil(H / ts) + 1;

  // render map tiles to ImageData (fast batch)
  var imgW = Math.min(cols, Math.ceil(W / ts));
  var imgH = Math.min(rows, Math.ceil(H / ts));
  // NaN hardening: a corrupt pan/zoom must not reach createImageData
  if (!isFinite(imgW) || !isFinite(imgH) || imgW <= 0 || imgH <= 0 ||
      !isFinite(game.mapPanX) || !isFinite(game.mapPanY)) {
    ctx.restore();
    return;
  }
  var key = imgW + '_' + imgH;
  if (!drawFullMap._img || drawFullMap._key !== key) {
    drawFullMap._img = ctx.createImageData(imgW, imgH);
    drawFullMap._key = key;
  }
  var d = drawFullMap._img.data;

  for (var y = 0; y < imgH; y++) {
    var ty = startTy + y;
    for (var x = 0; x < imgW; x++) {
      var tx = startTx + x;
      var o = (y * imgW + x) * 4;
      if (tx < 0 || tx >= world.W || ty < 0 || ty >= world.H) {
        d[o] = 10; d[o+1] = 10; d[o+2] = 16; d[o+3] = 255; continue;
      }
      var t = world.tiles[ty * world.W + tx];
      var col = MINIMAP_COLORS[t];
      if (col) {
        var rgb = hexToRgb(col);
        d[o] = rgb[0]; d[o+1] = rgb[1]; d[o+2] = rgb[2]; d[o+3] = 255;
      } else if (t === 0) {
        var wl = world.walls[ty * world.W + tx];
        if (wl === 1) { d[o] = 40; d[o+1] = 32; d[o+2] = 24; }
        else if (wl === 2) { d[o] = 58; d[o+1] = 61; d[o+2] = 69; }
        else if (wl !== 0) { d[o] = 32; d[o+1] = 32; d[o+2] = 40; }
        else { d[o] = 12; d[o+1] = 12; d[o+2] = 18; }
        d[o+3] = 255;
      } else {
        d[o] = 136; d[o+1] = 136; d[o+2] = 136; d[o+3] = 255;
      }
    }
  }

  // draw to a temp canvas then blit (putImageData ignores transforms)
  if (!drawFullMap._tempC) drawFullMap._tempC = document.createElement('canvas');
  var tc = drawFullMap._tempC;
  if (tc.width !== imgW || tc.height !== imgH) { tc.width = imgW; tc.height = imgH; }
  var tctx = tc.getContext('2d');
  tctx.putImageData(drawFullMap._img, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tc, 0, 0, imgW, imgH, 0, 0, imgW * ts, imgH * ts);
  ctx.imageSmoothingEnabled = true;

  // markers
  function toScreen(wx, wy) {
    return [(wx / TILE - startTx) * ts, (wy / TILE - startTy) * ts];
  }
  var sp = toScreen(game.world.spawnX, game.world.spawnY);
  ctx.fillStyle = '#ffe14d';
  ctx.fillRect(sp[0] - 4, sp[1] - 4, 8, 8);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.strokeRect(sp[0] - 4, sp[1] - 4, 8, 8);
  for (var i = 0; i < game.entities.length; i++) {
    var e = game.entities[i];
    if (e.dead || e.dmg > 0 || e.boss) continue;
    if (e.type >= 92 && e.type <= 116) {
      var s = toScreen(e.x, e.y);
      ctx.fillStyle = e.type === 14 ? '#8ad8ff' : '#7dff8a';
      ctx.beginPath(); ctx.arc(s[0], s[1], 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '10px monospace';
      ctx.fillText(ENT_DEF[e.type] ? ENT_DEF[e.type].name : '', s[0] + 6, s[1] + 3);
    }
  }
  var pp = toScreen(p.x, p.y);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(pp[0], pp[1], 7, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(pp[0], pp[1], 3, 0, Math.PI * 2); ctx.fill();
  ctx.lineWidth = 1;
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = '12px monospace';
  var hoverTx = Math.floor(startTx + MOUSE.x / ts);
  var hoverTy = Math.floor(startTy + MOUSE.y / ts);
  var ht = world.get(hoverTx, hoverTy);
  var htName = 'air';
  for (var tk in T) { if (T[tk] === ht) { htName = tk.charAt(0) + tk.slice(1).toLowerCase(); break; } }
  ctx.fillText('World Map  ' + Math.round(hoverTx) + ', ' + Math.round(hoverTy) + '  ' + htName + '   scroll = zoom, drag = pan, M = close', 10, H - 10);
  ctx.restore();
}

var MINIMAP_COLORS = {};
MINIMAP_COLORS[T.DIRT] = '#6b4c2e'; MINIMAP_COLORS[T.GRASS] = '#4fae40';
MINIMAP_COLORS[T.HALLOWGRASS] = '#b28ae6'; MINIMAP_COLORS[T.CORRUPTGRASS] = '#5a4a6c';
MINIMAP_COLORS[T.STONE] = '#4a4e58'; MINIMAP_COLORS[T.PEARLSTONE] = '#a89ac4';
MINIMAP_COLORS[T.EBONSTONE] = '#4c3f63'; MINIMAP_COLORS[T.COBALT] = '#1f3f8f';
MINIMAP_COLORS[T.MYTHRIL] = '#1f8f66'; MINIMAP_COLORS[T.ADAMANTITE] = '#8f2a2a';
MINIMAP_COLORS[T.IRON] = '#9a7c5c'; MINIMAP_COLORS[T.SAND] = '#c8b878';
MINIMAP_COLORS[T.WOOD] = '#6b4c2e'; MINIMAP_COLORS[T.TREETRUNK] = '#6b4c2e'; MINIMAP_COLORS[T.LEAVES] = '#2f7a3c'; MINIMAP_COLORS[T.LEAVES_CORRUPT] = '#6b3f9e'; MINIMAP_COLORS[T.LEAVES_CRIMSON] = '#a83a3a'; MINIMAP_COLORS[T.LEAVES_HALLOW] = '#d8a0d0'; MINIMAP_COLORS[T.LEAVES_JUNGLE] = '#1f5a2c';
MINIMAP_COLORS[T.GLOWSTONE] = '#5cc0ff'; MINIMAP_COLORS[T.COBWEB] = '#c0c0c0';
MINIMAP_COLORS[T.JUNGLEGRASS] = '#3f9d4a'; MINIMAP_COLORS[T.MUD] = '#5a4432';
MINIMAP_COLORS[T.CHLOROPHYTE] = '#3de06b'; MINIMAP_COLORS[T.TITANIUM] = '#9a9ab0';
MINIMAP_COLORS[T.ORICHALCUM] = '#d06b3d'; MINIMAP_COLORS[T.TEMPLEBRICK] = '#b8783c';
MINIMAP_COLORS[T.PLANTERABULB] = '#ff5c8a'; MINIMAP_COLORS[T.WATER] = '#2f6bd0';
MINIMAP_COLORS[T.SNOW] = '#e8f0f8'; MINIMAP_COLORS[T.ICE] = '#a8d8f0';
MINIMAP_COLORS[T.MUSHROOM] = '#7a5cff'; MINIMAP_COLORS[T.PALLADIUM] = '#ff9ab0';
MINIMAP_COLORS[T.GLASS] = '#b8dce8'; MINIMAP_COLORS[T.SPOOKYWOOD] = '#4a4a5a';
MINIMAP_COLORS[T.HONEY] = '#e8a83d'; MINIMAP_COLORS[T.CHEST] = '#9a6b3f';
MINIMAP_COLORS[T.CHAIR] = '#8a5c34'; MINIMAP_COLORS[T.TABLE] = '#9a6b3f';
MINIMAP_COLORS[T.CRIMGRASS] = '#b04040'; MINIMAP_COLORS[T.CRIMSTONE] = '#7a3d3d';
MINIMAP_COLORS[T.CRIMTANE] = '#c04048'; MINIMAP_COLORS[T.ASH] = '#4a443a';
MINIMAP_COLORS[T.HELLSTONE] = '#e84828'; MINIMAP_COLORS[T.HELLBRICK] = '#6a3325';
MINIMAP_COLORS[T.CLOUD] = '#e8f0f8'; MINIMAP_COLORS[T.GRANITE] = '#6a6a7a';
MINIMAP_COLORS[T.MARBLE] = '#d0d0dc'; MINIMAP_COLORS[T.OBSIDIAN] = '#2d1f2d';
MINIMAP_COLORS[T.LAVA] = '#e85828'; MINIMAP_COLORS[T.SHIMMER] = '#82d7ff';
MINIMAP_COLORS[T.COPPER] = '#e0834d'; MINIMAP_COLORS[T.SILVER] = '#cfd6e0';
MINIMAP_COLORS[T.GOLD] = '#ffd75e'; MINIMAP_COLORS[T.DEMONITE] = '#5a4d9a';
MINIMAP_COLORS[T.DUNGEONBRICK] = '#5a6a9a'; MINIMAP_COLORS[T.DUNGEONDOOR] = '#3a4a76';
MINIMAP_COLORS[T.TIN] = '#b09a78'; MINIMAP_COLORS[T.LEAD] = '#6a6a76';
MINIMAP_COLORS[T.TUNGSTEN] = '#8a92ad'; MINIMAP_COLORS[T.PLATINUM] = '#c0d8f0';
MINIMAP_COLORS[T.METEORITE] = '#763c2e'; MINIMAP_COLORS[T.SANDSTONE] = '#b09050';
MINIMAP_COLORS[T.PLATFORM] = '#9a6b3f'; MINIMAP_COLORS[T.WORKBENCH] = '#9a6b3f';
MINIMAP_COLORS[T.FURNACE] = '#77727a'; MINIMAP_COLORS[T.ANVIL] = '#59616d';
MINIMAP_COLORS[T.HELLFORGE] = '#8a4030'; MINIMAP_COLORS[T.SHADOWCHEST] = '#4a365f';
MINIMAP_COLORS[T.SHADOWORB] = '#b090ff'; MINIMAP_COLORS[T.CRIMSONHEART] = '#ff4058';
MINIMAP_COLORS[T.LARVA] = '#ffd75e'; MINIMAP_COLORS[T.HIVE] = '#c88a28';
MINIMAP_COLORS[T.ALTAR] = '#a890ff';
MINIMAP_COLORS[T.HEARTCRYSTAL] = '#ff5c8a';
MINIMAP_COLORS[T.PYLON] = '#6fd3ff';
MINIMAP_COLORS[T.PARTYCENTER] = '#ff70b8';
MINIMAP_COLORS[T.TOMBSTONE] = '#888892';
MINIMAP_COLORS[T.SUNFLOWER] = '#ffe050';
TILE_COLORS[T.FURN_ANVIL] = ['#9a6b3f', '#9a6b3f'];
MINIMAP_COLORS[T.FURN_ANVIL] = '#9a6b3f';
TILE_COLORS[T.FURN_BATHTUB] = ['#9a6b3f', '#9a6b3f'];
MINIMAP_COLORS[T.FURN_BATHTUB] = '#9a6b3f';
TILE_COLORS[T.FURN_BED] = ['#9a6b3f', '#9a6b3f'];
MINIMAP_COLORS[T.FURN_BED] = '#9a6b3f';
TILE_COLORS[T.FURN_BENCH] = ['#9a6b3f', '#9a6b3f'];
MINIMAP_COLORS[T.FURN_BENCH] = '#9a6b3f';
TILE_COLORS[T.FURN_BOOKCASE] = ['#9a6b3f', '#9a6b3f'];
MINIMAP_COLORS[T.FURN_BOOKCASE] = '#9a6b3f';
TILE_COLORS[T.FURN_CANDELABRA] = ['#9a6b3f', '#9a6b3f'];
MINIMAP_COLORS[T.FURN_CANDELABRA] = '#9a6b3f';
TILE_COLORS[T.FURN_CANDLE] = ['#9a6b3f', '#9a6b3f'];
MINIMAP_COLORS[T.FURN_CANDLE] = '#9a6b3f';
TILE_COLORS[T.FURN_CHAIR] = ['#9a6b3f', '#9a6b3f'];
MINIMAP_COLORS[T.FURN_CHAIR] = '#9a6b3f';
TILE_COLORS[T.FURN_CHANDELIER] = ['#9a6b3f', '#9a6b3f'];
MINIMAP_COLORS[T.FURN_CHANDELIER] = '#9a6b3f';
TILE_COLORS[T.FURN_CHEST] = ['#9a6b3f', '#9a6b3f'];
MINIMAP_COLORS[T.FURN_CHEST] = '#9a6b3f';
TILE_COLORS[T.FURN_CLOCK] = ['#9a6b3f', '#9a6b3f'];
MINIMAP_COLORS[T.FURN_CLOCK] = '#9a6b3f';
TILE_COLORS[T.FURN_DOOR] = ['#9a6b3f', '#9a6b3f'];
MINIMAP_COLORS[T.FURN_DOOR] = '#9a6b3f';
TILE_COLORS[T.FURN_DRESSER] = ['#9a6b3f', '#9a6b3f'];
MINIMAP_COLORS[T.FURN_DRESSER] = '#9a6b3f';
TILE_COLORS[T.FURN_FURNACE] = ['#9a6b3f', '#9a6b3f'];
MINIMAP_COLORS[T.FURN_FURNACE] = '#9a6b3f';
TILE_COLORS[T.FURN_LAMP] = ['#9a6b3f', '#9a6b3f'];
MINIMAP_COLORS[T.FURN_LAMP] = '#9a6b3f';
TILE_COLORS[T.FURN_LANTERN] = ['#9a6b3f', '#9a6b3f'];
MINIMAP_COLORS[T.FURN_LANTERN] = '#9a6b3f';
TILE_COLORS[T.FURN_PIANO] = ['#9a6b3f', '#9a6b3f'];
MINIMAP_COLORS[T.FURN_PIANO] = '#9a6b3f';
TILE_COLORS[T.FURN_PLATFORM] = ['#9a6b3f', '#9a6b3f'];
MINIMAP_COLORS[T.FURN_PLATFORM] = '#9a6b3f';
TILE_COLORS[T.FURN_SINK] = ['#9a6b3f', '#9a6b3f'];
MINIMAP_COLORS[T.FURN_SINK] = '#9a6b3f';
TILE_COLORS[T.FURN_SOFA] = ['#9a6b3f', '#9a6b3f'];
MINIMAP_COLORS[T.FURN_SOFA] = '#9a6b3f';
TILE_COLORS[T.FURN_TABLE] = ['#9a6b3f', '#9a6b3f'];
MINIMAP_COLORS[T.FURN_TABLE] = '#9a6b3f';
TILE_COLORS[T.FURN_TOILET] = ['#9a6b3f', '#9a6b3f'];
MINIMAP_COLORS[T.FURN_TOILET] = '#9a6b3f';
TILE_COLORS[T.FURN_TORCH] = ['#9a6b3f', '#9a6b3f'];
MINIMAP_COLORS[T.FURN_TORCH] = '#9a6b3f';
TILE_COLORS[T.FURN_SHELF] = ['#9a6b3f', '#9a6b3f'];
MINIMAP_COLORS[T.FURN_SHELF] = '#9a6b3f';








MINIMAP_COLORS[T.BED] = '#c04050';
MINIMAP_COLORS[T.PIGGYBANK] = '#f0a0c0';
MINIMAP_COLORS[T.DOOR] = '#9a6b3f';
MINIMAP_COLORS[T.CLAY] = '#b06a3a';
MINIMAP_COLORS[T.GRAYBRICK] = '#8a8a92';
MINIMAP_COLORS[T.REDBRICK] = '#b0503a';
MINIMAP_COLORS[T.BOTTLE] = '#a8d8f0';
MINIMAP_COLORS[T.CLAYPOT] = '#b06a3a';
MINIMAP_COLORS[T.SIGN] = '#9a6b3f';
MINIMAP_COLORS[T.BOOK] = '#c84a6a';
MINIMAP_COLORS[T.CHAIN] = '#b0b0b8';

function buildMinimap(game) {
  var w = 170;
  var h = Math.round(w * game.world.H / game.world.W);
  // NaN hardening: bail if world dimensions are somehow non-finite
  if (!isFinite(w) || !isFinite(h) || h <= 0) return;
  var c = document.createElement('canvas');
  c.width = w; c.height = h;
  var ctx = c.getContext('2d');
  var world = game.world;
  var img = ctx.createImageData(w, h);
  var data = img.data;
  var scaleX = world.W / w;
  var scaleY = world.H / h;
  for (var yy = 0; yy < h; yy++) {
    for (var xx = 0; xx < w; xx++) {
      var tx = Math.floor(xx * scaleX);
      var ty = Math.floor(yy * scaleY);
      var t = world.get(tx, ty);
      var col;
      if (t === T.AIR) {
        var wl = world.wall(tx, ty);
        if (wl === WALL.NONE) col = [12, 12, 18];
        else if (wl === WALL.DIRT) col = [40, 32, 24];
        else col = [32, 32, 38];
      } else {
        var base = MINIMAP_COLORS[t] || '#fff';
        col = hexToRgb(base);
      }
      var o = (yy * w + xx) * 4;
      data[o] = col[0]; data[o + 1] = col[1]; data[o + 2] = col[2]; data[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  game.minimap = c;
  game.world.dirty = false;
}

var Time = { seconds: 0, frame: 0 };
