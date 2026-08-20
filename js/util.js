// ---------- Utility functions ----------

// Seeded RNG (mulberry32)
function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Simple value noise 1D (integer octave smoothing)
function makeNoise1D(rng, w) {
  var vals = [];
  for (var i = 0; i < w; i++) vals.push(rng() * 2 - 1);
  return function(x) {
    var i = Math.floor(x), f = x - i;
    var a = vals[(i % w + w) % w], b = vals[((i + 1) % w + w) % w];
    f = f * f * (3 - 2 * f);
    return a + (b - a) * f;
  };
}

function makeNoise2D(rng, w, h) {
  var vals = [];
  for (var i = 0; i < w * h; i++) vals.push(rng() * 2 - 1);
  return function(x, y) {
    var ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
    fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
    var x0 = ((ix % w) + w) % w, x1 = ((ix + 1) % w + w) % w;
    var y0 = ((iy % h) + h) % h, y1 = ((iy + 1) % h + h) % h;
    var v00 = vals[y0 * w + x0], v10 = vals[y0 * w + x1];
    var v01 = vals[y1 * w + x0], v11 = vals[y1 * w + x1];
    var a = v00 + (v10 - v00) * fx;
    var b = v01 + (v11 - v01) * fx;
    return a + (b - a) * fy;
  };
}

function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }
function lerp(a, b, t) { return a + (b - a) * t; }
function dist(x1, y1, x2, y2) { var dx = x2 - x1, dy = y2 - y1; return Math.sqrt(dx * dx + dy * dy); }
function dist2(x1, y1, x2, y2) { var dx = x2 - x1, dy = y2 - y1; return dx * dx + dy * dy; }
function distPointSeg(px, py, x1, y1, x2, y2) {
  var dx = x2 - x1, dy = y2 - y1;
  var len2 = dx * dx + dy * dy;
  var t = len2 > 0 ? clamp(((px - x1) * dx + (py - y1) * dy) / len2, 0, 1) : 0;
  var cx = x1 + t * dx, cy = y1 + t * dy;
  return dist(px, py, cx, cy);
}

// Hex colors -> [r,g,b]
function hexToRgb(h) {
  h = h.replace('#', '');
  if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  var n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// ---- Cross-frame helpers ----
var util = {
  lastTime: 0,
  delta: function() {
    var now = Date.now();
    var d = (now - util.lastTime) / 1000;
    util.lastTime = now;
    return Math.min(d, 0.05);
  }
};

// Simple object pool for projectiles
function makePool(max) {
  return {
    list: [],
    max: max || 400,
    add: function(o) { if (this.list.length < this.max) this.list.push(o); },
    clear: function() { this.list.length = 0; },
    update: function(fn) {
      for (var i = this.list.length - 1; i >= 0; i--) {
        var o = this.list[i];
        if (o.dead) { this.list.splice(i, 1); continue; }
        fn(o, i);
      }
    }
  };
}
