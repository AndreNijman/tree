// Original combat pixel artwork. This module only reads combat state: hitboxes,
// health, phases, segment/hand positions, timing and damage remain simulation-owned.
var CombatArt = (function() {
  var cache = new Map();
  var INK = '#282333';
  var metrics = {
    kingslime:[32,24], eyeofcthulhu:[32,32], eaterofworlds:[30,24],
    wormbody:[24,18], wormtail:[24,18], brainofcthulhu:[32,32],
    queenbee:[32,28], skeletron:[32,36], hand:[20,20], wallofflesh:[64,48],
    twins:[32,32], retinazer:[32,32], spazmatism:[32,32],
    destroyer:[36,24], destroyerbody:[28,18], destroyertail:[28,18], probe:[16,16],
    skelprime:[36,36], prime_laser:[20,20], prime_cannon:[20,20], prime_saw:[20,20], prime_vice:[20,20],
    queenslime:[36,26], plantera:[36,36], golem:[36,36], duke:[36,26],
    empress:[48,48], moonlord:[68,64], cultist:[24,40], lunar:[30,76],
    pillar_solar:[30,76], pillar_vortex:[30,76], pillar_nebula:[30,76], pillar_stardust:[30,76],
    deerclops:[40,52], mourningwood:[48,48], pumpking:[48,48],
    everscream:[48,48], santank:[44,44], icequeen:[44,52],
    martiansaucer:[48,28], goblinwarlock:[28,40], piratecaptain:[30,44], flyingdutchman:[72,44],
    mothron:[36,26], darkmage:[32,40], ogre:[44,48], betsy:[64,40]
  };
  function surface(w, h) {
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    c.getContext('2d').imageSmoothingEnabled = false;
    return c;
  }
  function rect(ctx, color, x, y, w, h) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
  }
  function oval(ctx, x, y, rx, ry, color) {
    for (var row = -Math.ceil(ry); row <= ry; row++) {
      var span = Math.floor(Math.sqrt(Math.max(0, 1 - row * row / (ry * ry))) * rx);
      if (span > 0) rect(ctx, typeof color === 'function' ? color(row) : color, x - span, y + row, span * 2, 1);
    }
  }
  function line(ctx, color, x0, y0, x1, y1, width) {
    var length = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    if (!Number.isFinite(length) || length > 2048) return;
    var count = Math.max(1, Math.ceil(length / 2));
    for (var i = 0; i <= count; i++) rect(ctx, color,
      x0 + (x1 - x0) * i / count - width / 2,
      y0 + (y1 - y0) * i / count - width / 2, width, width);
  }
  function polygon(ctx, color, points) {
    // Scanline-filled integer pixels keep even diagonal wing membranes crisp.
    var minY = Math.min.apply(null, points.map(function(p) { return p[1]; }));
    var maxY = Math.max.apply(null, points.map(function(p) { return p[1]; }));
    for (var y = Math.ceil(minY); y < maxY; y++) {
      var cuts = [];
      for (var i = 0, j = points.length - 1; i < points.length; j = i++) {
        var a = points[j], b = points[i], scan = y + 0.5;
        if ((a[1] <= scan && b[1] > scan) || (b[1] <= scan && a[1] > scan)) {
          cuts.push(a[0] + (scan - a[1]) * (b[0] - a[0]) / (b[1] - a[1]));
        }
      }
      cuts.sort(function(a, b) { return a - b; });
      for (var k = 0; k + 1 < cuts.length; k += 2) {
        var x = Math.ceil(cuts[k]), end = Math.ceil(cuts[k + 1]);
        if (end > x) rect(ctx, color, x, y, end - x, 1);
      }
    }
  }
  function remember(key, make) {
    if (cache.has(key)) return cache.get(key);
    var value = make();
    if (cache.size >= 256) cache.delete(cache.keys().next().value);
    cache.set(key, value);
    return value;
  }
  function bossSprite(kind, phase, frame, flash) {
    return remember('boss:' + [kind, phase, frame, flash].join(':'), function() {
      var c = surface(96, 96), ctx = c.getContext('2d'); ctx.translate(48, 48);
      if (kind === 'kingslime') king(ctx, phase, frame);
      else if (kind === 'eyeofcthulhu') eye(ctx, phase, frame);
      else if (kind === 'brainofcthulhu') brain(ctx, phase, frame);
      else if (kind === 'queenbee') bee(ctx, phase, frame);
      else if (kind === 'skeletron') skull(ctx, phase, frame);
      else if (kind === 'hand') hand(ctx, frame);
      else if (kind === 'wallofflesh') flesh(ctx, phase, frame);
      else if (kind === 'twins' || kind === 'retinazer' || kind === 'spazmatism') mechanicalEye(ctx, kind === 'twins' ? 'retinazer' : kind, phase, frame);
      else if (kind === 'skelprime') primeSkull(ctx, phase, frame);
      else if (kind.indexOf('prime_') === 0) primeTool(ctx, kind, phase, frame);
      else if (kind === 'probe') probe(ctx, phase, frame);
      else if (kind.indexOf('destroyer') === 0) metalWorm(ctx, kind, phase, frame);
      else if (kind === 'queenslime') queenSlime(ctx, phase, frame);
      else if (kind === 'plantera') plantera(ctx, phase, frame);
      else if (kind === 'golem') golem(ctx, phase, frame);
      else if (kind === 'duke') duke(ctx, phase, frame);
      else if (kind === 'empress') empress(ctx, phase, frame);
      else if (kind === 'moonlord') moonLord(ctx, phase, frame);
      else if (kind === 'cultist') cultist(ctx, phase, frame);
      else if (kind.indexOf('pillar_') === 0) pillar(ctx, kind.slice(7), phase, frame);
      else if (kind === 'deerclops') deerclops(ctx, phase, frame);
      else if (kind === 'mourningwood') mourningWood(ctx, phase, frame);
      else if (kind === 'pumpking') pumpking(ctx, phase, frame);
      else if (kind === 'everscream') everscream(ctx, phase, frame);
      else if (kind === 'santank') santank(ctx, phase, frame);
      else if (kind === 'icequeen') iceQueen(ctx, phase, frame);
      else if (kind === 'martiansaucer') martianSaucer(ctx, phase, frame);
      else if (kind === 'goblinwarlock') goblinWarlock(ctx, phase, frame);
      else if (kind === 'piratecaptain') pirateCaptain(ctx, phase, frame);
      else if (kind === 'flyingdutchman') flyingDutchman(ctx, phase, frame);
      else if (kind === 'mothron') mothron(ctx, phase, frame);
      else if (kind === 'darkmage') darkMage(ctx, phase, frame);
      else if (kind === 'ogre') ogre(ctx, phase, frame);
      else if (kind === 'betsy') betsy(ctx, phase, frame);
      else worm(ctx, kind, phase, frame);
      if (flash) {
        ctx.globalCompositeOperation = 'source-atop';
        rect(ctx, '#fff5dc', -48, -48, 96, 96);
      }
      return c;
    });
  }

  function king(ctx, phase, frame) {
    var p = phase ? ['#25355b','#365c8d','#4a85b3','#7bb5ce','#bee6df'] : ['#273d58','#366d94','#509cba','#87cad6','#d0ece2'];
    var squash = frame % 2;
    for (var y = -12 + squash; y <= 11; y++) {
      var half = Math.floor(Math.sqrt(Math.max(0, 1 - Math.pow((y - 9) / 23, 2))) * 16);
      if (!half) continue;
      rect(ctx, p[0], -half, y, half * 2, 1);
      if (half > 2) rect(ctx, y > 6 ? p[1] : p[2], -half + 1, y, half * 2 - 2, 1);
    }
    rect(ctx, p[3], -9, -7 + squash, 9, 2); rect(ctx, p[4], -8, -7 + squash, 3, 1);
    rect(ctx, p[3], -12, -3, 3, 5); rect(ctx, p[1], -9, 10, 6, 2);
    rect(ctx, p[1], 5, 10, 6, 2);
    // A small traveler suspended inside the gel, separate from the crown.
    rect(ctx, '#35536c', 3, -3, 4, 4); rect(ctx, '#29435e', 2, 1, 6, 6);
    rect(ctx, '#426b86', 3, 2, 2, 3); rect(ctx, '#29435e', 1, 5, 2, 4);
    rect(ctx, '#29435e', 7, 5, 2, 4); rect(ctx, p[3], 4, -2, 2, 1);
    rect(ctx, '#264257', -7, 3, 2, 3); rect(ctx, '#d3e8d7', -7, 3, 1, 1);
    rect(ctx, '#819fbe', -2, 7, 2, 1);
    // Stepped gold crown and a ruby inset; no copied sprite assets.
    rect(ctx, '#655044', -8, -15 + squash, 16, 5);
    rect(ctx, '#d2a15b', -7, -16 + squash, 14, 5);
    for (var prong = -1; prong <= 1; prong++) {
      rect(ctx, '#705448', prong * 6 - 2, -20 + Math.abs(prong) + squash, 4, 6);
      rect(ctx, '#efd18a', prong * 6 - 1, -20 + Math.abs(prong) + squash, 2, 5);
    }
    rect(ctx, '#fff0b4', -6, -15 + squash, 12, 1);
    rect(ctx, '#923e56', -2, -14 + squash, 4, 3); rect(ctx, '#ed8792', -1, -14 + squash, 2, 1);
  }

  function eye(ctx, phase, frame) {
    oval(ctx, 0, 0, 16, 16, INK);
    oval(ctx, 0, -1, 15, 14, function(y) { return y > 5 ? '#9da4af' : y > -7 ? '#d6d5cb' : '#f1e8d6'; });
    for (var n = 0; n < 4; n++) {
      var ny = -10 + n * 6;
      line(ctx, '#914a60', -18, ny, -11, ny + 3, 2);
      line(ctx, '#c67680', -23 - (n + frame) % 3, ny - 2, -17, ny, 1);
      line(ctx, '#b55f72', -11, ny + 3, -6, ny + 2, 1);
    }
    if (!phase) {
      oval(ctx, 6, 0, 8, 10, '#78556d'); oval(ctx, 7, -1, 6, 8, '#bd6373');
      oval(ctx, 9, 0, 4, 6, '#282938'); rect(ctx, '#faf0d9', 8, -4, 2, 3);
      rect(ctx, '#df8f87', 3, -7, 2, 3);
    } else {
      oval(ctx, 7, 1, 9, 12, '#813950'); oval(ctx, 9, 1, 7, 9, '#302431');
      for (var tooth = 0; tooth < 5; tooth++) {
        var ty = -8 + tooth * 4;
        rect(ctx, '#f1dfb7', 7 + tooth % 2 * 2, ty, 6 - tooth % 2, 2);
        rect(ctx, '#b5a898', 7 + tooth % 2 * 2, ty + 2, 3, 1);
      }
      rect(ctx, '#c26771', 2, 7, 3, 4); rect(ctx, '#e6a99b', 3, 8, 1, 2);
    }
  }

  function brain(ctx, phase, frame) {
    var lobes = [[-8,-5,8,10], [6,-5,9,11], [-9,5,7,8], [7,5,8,8], [-1,-10,7,6]];
    lobes.forEach(function(l, i) {
      var x = l[0] + (phase ? (l[0] < 0 ? -1 : 1) : 0);
      oval(ctx, x, l[1], l[2], l[3], '#633649');
      oval(ctx, x, l[1] - 1, l[2] - 1, l[3] - 2, i % 2 ? '#c47b85' : '#d89392');
      line(ctx, '#9b586e', x - 4, l[1] - 3, x + 3, l[1] - 1, 2);
      line(ctx, '#f0b4a5', x - 3, l[1] - 5, x + 2, l[1] - 4, 1);
      line(ctx, '#a65e72', x - 2, l[1] + 1, x + 3, l[1] + 4, 1);
    });
    line(ctx, '#793a51', 0, -13, -1, 11, 2);
    for (var nerve = -1; nerve <= 1; nerve++) {
      line(ctx, '#84465d', nerve * 6, 11, nerve * 9 + frame % 2, 18, 2);
      rect(ctx, '#c78586', nerve * 9 + frame % 2, 17, 2, 2);
    }
    if (phase) {
      oval(ctx, 0, 2, 6, 9, '#703049'); oval(ctx, 0, 1, 4, 7, '#e49683');
      rect(ctx, '#f7cd9d', -2, -2, 4, 5); rect(ctx, '#963f58', 0, -1, 2, 4);
      rect(ctx, '#f5d8af', -1, -2, 1, 2);
    }
  }

  function bee(ctx, phase, frame) {
    var wingY = frame % 2 ? -9 : -15;
    oval(ctx, -7, wingY, 10, frame % 2 ? 5 : 8, '#6f8296');
    oval(ctx, -7, wingY - 1, 9, frame % 2 ? 3 : 6, '#b7d0d0');
    oval(ctx, 3, wingY - 1, 8, frame % 2 ? 4 : 9, '#d6e1d8');
    line(ctx, '#91b2bf', -11, wingY - 3, 0, -3, 1);
    line(ctx, '#f1ebd4', 2, wingY - 5, 4, -4, 1);
    oval(ctx, -3, 2, 13, 10, '#453842');
    oval(ctx, -3, 1, 12, 9, function(row) { return row < -3 ? '#e6c27b' : '#bd8c4e'; });
    for (var stripe = -1; stripe <= 1; stripe++) {
      var sx = -4 + stripe * 6;
      rect(ctx, '#54464a', sx, -6 + Math.abs(stripe), 3, 15 - Math.abs(stripe) * 2);
      rect(ctx, '#73604f', sx, -5 + Math.abs(stripe), 1, 7);
    }
    for (var leg = -1; leg <= 1; leg++) {
      line(ctx, '#514047', -5 + leg * 6, 9, -7 + leg * 6, 14, 2);
      rect(ctx, '#ceaa6e', -8 + leg * 6, 13, 3, 1);
    }
    line(ctx, '#463641', -15, 4, -20, 8, 2);
    oval(ctx, 11, -1, 6, 8, '#58434a'); oval(ctx, 11, -2, 5, 6, '#d2a863');
    rect(ctx, phase ? '#e58b7d' : '#afc5a4', 12, -5, 3, 5);
    rect(ctx, '#30303d', 14, -4, 1, 4); rect(ctx, '#f4e4b3', 12, -5, 1, 1);
    line(ctx, '#4a3745', 9, -8, 7, -13, 2); rect(ctx, '#e4bd77', 5, -14, 3, 2);
    rect(ctx, '#3b303a', 15, 3, 4, 2);
  }

  function skull(ctx, phase, frame) {
    oval(ctx, 0, -4, 16, 15, '#514250');
    oval(ctx, -1, -5, 14, 13, function(y) { return y < -6 ? '#eee0bc' : y > 4 ? '#ab9f96' : '#d2c9ae'; });
    rect(ctx, '#746273', -14, 1, 4, 9); rect(ctx, '#b6ad9b', -13, 1, 3, 7);
    rect(ctx, '#746273', 10, 1, 4, 9); rect(ctx, '#e4d6b5', 10, 1, 2, 6);
    oval(ctx, -7, -4, 5, 6, '#4c3a48'); oval(ctx, 7, -4, 5, 6, '#4c3a48');
    rect(ctx, phase ? '#f39b79' : '#bd6d70', -8, -4, 3, 3);
    rect(ctx, phase ? '#f39b79' : '#bd6d70', 5, -4, 3, 3);
    rect(ctx, '#372f3d', -1, 1, 3, 4); rect(ctx, '#73616b', -2, 3, 1, 2);
    line(ctx, '#968780', -4, -17, -2, -12, 1); line(ctx, '#968780', -2, -12, -5, -8, 1);
    var jawY = frame % 2 ? 11 : 10;
    rect(ctx, '#534451', -10, jawY - 3, 20, 8); rect(ctx, '#bfb49e', -9, jawY, 18, 4);
    for (var tooth = -3; tooth <= 3; tooth++) {
      rect(ctx, '#f0e3c2', tooth * 2 - 1, 7, 2, 3);
      rect(ctx, '#e2d3af', tooth * 2 - 1, jawY, 2, 2);
      rect(ctx, '#796776', tooth * 2, jawY + 2, 1, 1);
    }
  }

  function hand(ctx, frame) {
    rect(ctx, '#655361', -6, -6, 12, 13); rect(ctx, '#c5bca5', -5, -5, 10, 11);
    rect(ctx, '#f0dfba', -4, -5, 8, 2); rect(ctx, '#948487', -1, -2, 2, 7);
    for (var finger = -2; finger <= 1; finger++) {
      var y = 5 + (finger + frame) % 2;
      rect(ctx, '#5b4b59', finger * 3, y, 3, 7);
      rect(ctx, '#d2c7ac', finger * 3, y, 2, 5);
    }
    line(ctx, '#63525e', 5, -1, 10, 4, 3); line(ctx, '#d1c4a5', 5, -1, 9, 3, 2);
    rect(ctx, '#9a898a', -3, -10, 6, 4); rect(ctx, '#e3d7b8', -2, -10, 4, 3);
  }

  function worm(ctx, kind, phase, frame) {
    var head = kind === 'eaterofworlds';
    var rx = head ? 15 : 12, ry = head ? 12 : 9;
    oval(ctx, 0, 0, rx, ry, '#302b43');
    oval(ctx, -1, -1, rx - 1, ry - 1, '#685775');
    oval(ctx, -2, -2, rx - 3, ry - 3, '#897b8e');
    for (var band = -1; band <= 1; band++) {
      line(ctx, '#4c405f', band * 6 - 3, -ry + 3, band * 6 - 1, ry - 2, 2);
      line(ctx, '#a7959c', band * 6 - 2, -ry + 3, band * 6, -1, 1);
      rect(ctx, '#a7a58b', band * 7 - 2, -ry - 3 + frame % 2, 2, 5);
    }
    if (head) {
      oval(ctx, 9, 0, 5, 7, '#342d43'); rect(ctx, '#ddaa82', 9, -5, 3, 3);
      rect(ctx, '#ddaa82', 9, 3, 3, 3); rect(ctx, '#c99b94', 10, -1, 4, 2);
      rect(ctx, phase ? '#f3bb8e' : '#c4bf8d', 3, -6, 3, 3); rect(ctx, '#392e40', 5, -6, 1, 2);
    } else if (kind === 'wormtail') {
      line(ctx, '#5b4b69', -10, 0, -18, -2, 4); line(ctx, '#a89698', -11, -1, -17, -3, 1);
    }
  }

  function flesh(ctx, phase, frame) {
    for (var y = -24; y < 24; y++) {
      var edge = Math.abs(y) % 7 < 3 ? 1 : 0;
      rect(ctx, '#603a4d', -32 + edge, y, 64 - edge * 2, 1);
      rect(ctx, '#a45d6c', -30 + edge, y, 60 - edge * 2, 1);
    }
    for (var n = 0; n < 54; n++) {
      var seed = hash2(n + 311, 79), x = seed % 58 - 29, y = (seed >>> 9) % 43 - 21;
      rect(ctx, n % 3 ? '#bd7880' : '#81495e', x, y, 2 + seed % 4, 3 + (seed >>> 5) % 5);
      if (n % 4 === 0) rect(ctx, '#dda096', x, y, 1, 4);
    }
    oval(ctx, 1, 2, 18, frame % 2 ? 11 : 10, '#7a3c52'); oval(ctx, 2, 2, 15, 8, '#352633');
    for (var tooth = -3; tooth <= 3; tooth++) {
      var tx = tooth * 4;
      rect(ctx, '#e7cba9', tx, -6 + Math.abs(tooth), 3, 4);
      rect(ctx, '#d4af96', tx + 1, 7 - Math.abs(tooth), 3, 3);
      rect(ctx, '#f8e6bf', tx, -6 + Math.abs(tooth), 2, 1);
    }
    [-1, 1].forEach(function(side) {
      oval(ctx, 22, side * 15, 8, 6, '#794356'); oval(ctx, 22, side * 15, 6, 4, '#ddc29c');
      rect(ctx, phase ? '#e58775' : '#a17e76', 23, side * 15 - 3, 3, 6);
      rect(ctx, '#322837', 25, side * 15 - 2, 2, 4); rect(ctx, '#ffebc4', 24, side * 15 - 2, 1, 1);
    });
  }

  function mechanicalEye(ctx, kind, phase, frame) {
    var red = kind === 'retinazer';
    var glow = red ? ['#8b455c','#d57886','#f4b99f'] : ['#4f765b','#8cbf84','#d8e7a5'];
    oval(ctx, 0, 0, 16, 16, '#303342');
    oval(ctx, -1, -1, 14, 14, phase ? '#7c8998' : '#cbc9bc');
    oval(ctx, -3, -3, 11, 11, phase ? '#aab7bf' : '#e5dcc8');
    // Rear mechanical harness, paired rivets, and bundled trailing wires.
    rect(ctx, '#465366', -16, -8, 6, 16); rect(ctx, '#8699a8', -15, -7, 3, 14);
    for (var wire = -1; wire <= 1; wire++) {
      line(ctx, '#765267', -15, wire * 6, -22, wire * 7 + (frame % 2), 2);
      rect(ctx, '#b59093', -24, wire * 7 + frame % 2, 3, 1);
      rect(ctx, '#dae1d4', -12, wire * 7, 2, 2);
    }
    if (!phase) {
      oval(ctx, 6, 0, 8, 10, '#4d4859'); oval(ctx, 7, -1, 6, 8, glow[1]);
      oval(ctx, 9, 0, 3, 6, '#283140'); rect(ctx, '#f8ecd1', 8, -4, 2, 3);
      line(ctx, '#9c7b83', -7, -10, -3, -6, 1);
    } else if (red) {
      // Retinazer opens a long, ringed laser barrel.
      rect(ctx, '#3b4356', 1, -9, 16, 18); rect(ctx, '#6c7b8d', 3, -8, 13, 16);
      rect(ctx, '#abb9c2', 3, -8, 12, 2); rect(ctx, '#303748', 14, -7, 5, 14);
      rect(ctx, '#b3c2c7', 15, -6, 2, 12); rect(ctx, glow[0], 17, -5, 3, 10);
      rect(ctx, glow[1], 18, -3, 2, 6); rect(ctx, glow[2], 18, -1, 2, 2);
      for (var vent = 0; vent < 3; vent++) rect(ctx, '#394657', -7 + vent * 4, 7, 2, 4);
    } else {
      // Spazmatism exposes a toothed flame chamber rather than a laser lens.
      oval(ctx, 7, 1, 10, 12, '#334b48'); oval(ctx, 8, 1, 8, 9, '#26323e');
      for (var tooth = 0; tooth < 5; tooth++) {
        var y = -8 + tooth * 4;
        rect(ctx, '#c4cbb5', 7 + tooth % 2 * 2, y, 7 - tooth % 2 * 2, 2);
        rect(ctx, '#798c83', 8 + tooth % 2 * 2, y + 2, 3, 1);
      }
      rect(ctx, glow[0], 4, -3, 4, 8); rect(ctx, glow[1], 5, -2 + frame % 2, 2, 5);
    }
    rect(ctx, glow[frame % 2 ? 2 : 1], -6, -11, 2, 2);
  }

  function metalWorm(ctx, kind, phase, frame) {
    var head = kind === 'destroyer', rx = head ? 18 : 14, ry = head ? 12 : 9;
    oval(ctx, 0, 0, rx, ry, '#303849');
    oval(ctx, -1, -1, rx - 1, ry - 1, '#758394');
    oval(ctx, -2, -3, rx - 3, ry - 4, '#acb8bd');
    // Alternating steel bands stay clear even when live segments overlap.
    for (var rib = -1; rib <= 1; rib++) {
      var x = rib * 8;
      line(ctx, '#3d485c', x - 2, -ry + 2, x, ry - 2, 3);
      line(ctx, '#d4d9ce', x - 3, -ry + 2, x - 2, -1, 1);
      rect(ctx, '#c3cbbf', x - 2, -ry - 3, 3, 5);
    }
    var red = phase ? '#f2b598' : frame % 2 ? '#df8a83' : '#b46271';
    if (head) {
      rect(ctx, '#3e4354', 7, -7, 10, 14); rect(ctx, '#aeb6b5', 8, -8, 9, 3);
      rect(ctx, '#aeb6b5', 8, 5, 9, 3); rect(ctx, '#d7d5bb', 12, -4, 3, 3);
      rect(ctx, '#d7d5bb', 12, 2, 3, 3); rect(ctx, red, 3, -7, 4, 4);
      rect(ctx, '#f7dbb3', 4, -7, 1, 1);
    } else {
      oval(ctx, 3, 0, 4, 4, '#3a3b4e'); rect(ctx, red, 1, -2, 4, 4);
      rect(ctx, '#f4d2a9', 2, -2, 1, 1);
      if (kind === 'destroyertail') {
        line(ctx, '#455368', -12, 0, -20, -2, 5);
        line(ctx, '#a0b0b8', -12, -1, -20, -3, 2);
      }
    }
  }

  function probe(ctx, phase, frame) {
    oval(ctx, 0, 0, 8, 8, '#354052'); oval(ctx, -1, -1, 6, 6, '#92a2af');
    rect(ctx, '#c7d3d0', -4, -5, 6, 2); rect(ctx, '#465568', -9, -2, 3, 4);
    oval(ctx, 2, 1, 4, 5, '#694859'); oval(ctx, 3, 1, 3, 4, phase ? '#df8d80' : '#bb6d7b');
    rect(ctx, '#f6d4a9', 3, -1 + frame % 2, 1, 3);
    rect(ctx, '#637b8d', -3, 7, 3, 3);
  }

  function primeSkull(ctx, phase, frame) {
    oval(ctx, 0, -3, 18, 16, '#303949');
    oval(ctx, -1, -4, 16, 14, '#7c8b9c'); oval(ctx, -3, -6, 13, 11, '#b1bdc4');
    // Spiked crown, bolted cheek plates and a hinged metal jaw.
    for (var spike = -1; spike <= 1; spike++) {
      line(ctx, '#465469', spike * 11, -15, spike * 14, -22 + Math.abs(spike) * 3, 4);
      line(ctx, '#c5cfcc', spike * 11, -15, spike * 14, -21 + Math.abs(spike) * 3, 2);
    }
    [-1,1].forEach(function(side) {
      rect(ctx, '#4a596c', side < 0 ? -18 : 13, -2, 5, 12);
      rect(ctx, '#b3bfc2', side < 0 ? -17 : 13, -1, 3, 8);
      rect(ctx, '#e1e1cf', side < 0 ? -16 : 13, 1, 2, 2);
      oval(ctx, side * 8, -4, 6, 6, '#3a3e51');
      rect(ctx, phase ? '#f0a184' : '#c87883', side * 8 - 2, -5, 4, 3);
      rect(ctx, '#fae0b1', side * 8 - 1, -5, 1, 1);
    });
    rect(ctx, '#475267', -2, 0, 4, 6);
    var jaw = 10 + frame % 2;
    rect(ctx, '#354157', -11, jaw - 3, 22, 9); rect(ctx, '#899ca9', -10, jaw + 1, 20, 4);
    for (var tooth = -3; tooth <= 3; tooth++) {
      rect(ctx, '#d6dac7', tooth * 3 - 1, 7, 2, 3);
      rect(ctx, '#d6dac7', tooth * 3 - 1, jaw, 2, 2);
    }
    rect(ctx, '#53697c', -3, -15, 6, 3); rect(ctx, '#d0d9d0', -2, -15, 4, 1);
  }

  function primeTool(ctx, kind, phase, frame) {
    rect(ctx, '#384558', -10, -3, 6, 6); rect(ctx, '#a6b6bf', -9, -2, 5, 3);
    if (kind === 'prime_saw') {
      for (var i = 0; i < 8; i++) {
        var a = i * Math.PI / 4 + frame * Math.PI / 8;
        line(ctx, '#53667b', Math.cos(a) * 6, Math.sin(a) * 6, Math.cos(a) * 11, Math.sin(a) * 11, 3);
      }
      oval(ctx, 0, 0, 8, 8, '#d0d6ce'); oval(ctx, 0, 0, 5, 5, '#8294a3');
      rect(ctx, '#37485e', -2, -2, 4, 4); rect(ctx, '#d7ddca', -1, -2, 2, 2);
    } else if (kind === 'prime_vice') {
      rect(ctx, '#495b70', -5, -7, 10, 14); rect(ctx, '#95aab5', -4, -6, 7, 12);
      var gap = 4 + frame % 2;
      [-1,1].forEach(function(side) {
        line(ctx, '#405268', 1, side * 5, 9, side * gap, 4);
        line(ctx, '#b7c9c8', 1, side * 5 - 1, 9, side * gap - 1, 2);
        rect(ctx, '#dce0cb', 7, side < 0 ? -gap : gap - 2, 3, 3);
      });
    } else if (kind === 'prime_laser') {
      // Slim emitter, long barrel, and a visible lower grip.
      rect(ctx, '#37465d', -6, -5, 13, 10); rect(ctx, '#8895aa', -5, -4, 11, 8);
      rect(ctx, '#b9c9ca', -4, -4, 9, 2); rect(ctx, '#42566f', 4, -3, 10, 6);
      rect(ctx, '#a4b8c2', 5, -3, 8, 1); rect(ctx, '#28394e', 11, -2, 3, 4);
      rect(ctx, '#d28b99', 12, -1, 2, 2); rect(ctx, '#43566c', -4, 4, 5, 4);
      rect(ctx, phase || frame % 2 ? '#f2c1a1' : '#bc7b88', -2, -1, 2, 2);
    } else {
      // Cannon has a bulky round breech and a wide, dark muzzle ring.
      oval(ctx, -1, 0, 9, 9, '#35475c'); oval(ctx, -2, -1, 7, 7, '#7f97ab');
      rect(ctx, '#b8c9cd', -5, -7, 9, 2); rect(ctx, '#465b72', 3, -7, 9, 14);
      oval(ctx, 10, 0, 4, 7, '#a4bac4'); oval(ctx, 11, 0, 2, 5, '#29394e');
      rect(ctx, '#7593a6', -4, 7, 7, 4); rect(ctx, '#c1ceca', -3, 7, 5, 1);
      rect(ctx, '#b7d3d2', 11, -2, 1, 3);
    }
  }

  function queenSlime(ctx, phase, frame) {
    var bob = frame % 2;
    if (phase) [-1,1].forEach(function(side) {
      // Layered crystal feathers, stepped rather than antialiased polygons.
      for (var feather = 0; feather < 5; feather++) {
        var tipX = side * (37 - feather * 4), tipY = -23 + feather * 6 + bob * 4;
        line(ctx, '#665b92', side * 12, 0, tipX, tipY, 5);
        line(ctx, '#b7a6d5', side * 13, -1, tipX, tipY - 1, 3);
        line(ctx, '#eee0ec', side * 14, -2, tipX, tipY - 2, 1);
      }
    });
    for (var y = -12 + bob; y <= 12; y++) {
      var half = Math.floor(Math.sqrt(Math.max(0, 1 - Math.pow((y - 9) / 22, 2))) * 18);
      if (half < 1) continue;
      rect(ctx, '#5b3d76', -half, y, half * 2, 1);
      if (half > 2) rect(ctx, y > 8 ? '#9c5eac' : y > 2 ? '#cb81bf' : '#e5a4d2', -half + 1, y, half * 2 - 2, 1);
    }
    rect(ctx, '#f6d3e5', -10, -7 + bob, 10, 2); rect(ctx, '#fbe4ea', -9, -7 + bob, 4, 1);
    rect(ctx, '#edb9dc', -14, -2, 3, 5); rect(ctx, '#e5a4d2', 8, 5, 5, 2);
    // Suspended faceted heart crystal, separate from the face and crown.
    oval(ctx, 0, 5, 4, 5, '#966caf'); line(ctx, '#c4d2ed', 0, 1, -2, 5, 2);
    line(ctx, '#a7b6df', -2, 5, 0, 9, 2); line(ctx, '#dfe2ee', 0, 1, 2, 5, 1);
    [-1,1].forEach(function(side) {
      rect(ctx, '#523b6b', side * 7 - 1, 0, 2, 4); rect(ctx, '#fff0e3', side * 7 - 1, 0, 1, 1);
      rect(ctx, '#e3a0c7', side * 10 - 1, 5, 3, 1);
      rect(ctx, '#755d68', side < 0 ? -11 : 6, -19 + bob, 5, 7);
      rect(ctx, '#e8bf79', side < 0 ? -10 : 7, -18 + bob, 3, 6);
    });
    rect(ctx, '#77566c', -2, -23 + bob, 4, 10); rect(ctx, '#f4d49b', -1, -22 + bob, 2, 9);
    rect(ctx, '#826478', -11, -15 + bob, 22, 5); rect(ctx, '#dfad69', -10, -14 + bob, 20, 3);
    rect(ctx, '#fbe3a5', -9, -14 + bob, 18, 1); rect(ctx, '#567d9e', -2, -15 + bob, 4, 5);
    rect(ctx, '#a9e2e8', -1, -14 + bob, 2, 3); rect(ctx, '#edf6e9', -1, -14 + bob, 1, 1);
  }

  function plantera(ctx, phase, frame) {
    // Leaves and tendrils belong to this body's art, not damageable child AI.
    for (var leaf = 0; leaf < 8; leaf++) {
      var a = leaf * Math.PI / 4, lx = Math.round(Math.cos(a) * 21), ly = Math.round(Math.sin(a) * 21);
      line(ctx, '#2d4c49', lx * 0.6, ly * 0.6, lx * 1.35, ly * 1.35, 7);
      line(ctx, '#53865b', lx * 0.6, ly * 0.6, lx * 1.35, ly * 1.35, 4);
      line(ctx, '#92ae70', lx * 0.7, ly * 0.7, lx * 1.3, ly * 1.3, 1);
    }
    if (phase) for (var vine = 0; vine < 4; vine++) {
      var va = vine * Math.PI / 2 + Math.PI / 4;
      var vx = Math.round(Math.cos(va) * 34), vy = Math.round(Math.sin(va) * 34);
      var bend = (frame % 2 ? 3 : -3) * (vine % 2 ? -1 : 1);
      line(ctx, '#304f46', vx * 0.4, vy * 0.4, vx * 0.8 + bend, vy * 0.6, 4);
      line(ctx, '#6e9c64', vx * 0.8 + bend, vy * 0.6, vx, vy, 3);
      oval(ctx, vx, vy, 4, 4, '#633e60'); oval(ctx, vx, vy - 1, 3, 2, '#d38aa5');
      rect(ctx, '#efd2b5', vx - 1, vy, 2, 2);
    }
    for (var petal = 0; petal < 8; petal++) {
      var pa = petal * Math.PI / 4, radius = (phase ? 16 : 18) + (petal % 2 ? frame % 2 * 2 : 0);
      var px = Math.round(Math.cos(pa) * radius), py = Math.round(Math.sin(pa) * radius);
      oval(ctx, px, py, phase ? 7 : 9, phase ? 7 : 10, '#633c5b');
      oval(ctx, px - 1, py - 1, phase ? 5 : 7, phase ? 5 : 8, petal % 2 ? '#b65b86' : '#cf799c');
      line(ctx, '#e9a5b6', px - 3, py - 5, px + 1, py - 2, 2);
    }
    oval(ctx, 0, 0, 17, 17, '#58394f'); oval(ctx, -1, -1, 15, 15, phase ? '#99656f' : '#bf7192');
    oval(ctx, 0, 2, phase ? 14 : 9, phase ? 13 : 8, '#302b3c');
    oval(ctx, 1, 7, phase ? 9 : 5, 4, '#79475c');
    for (var tooth = -2; tooth <= 2; tooth++) {
      var tx = tooth * (phase ? 5 : 3), rim = Math.abs(tooth);
      rect(ctx, '#f0d7ad', tx - 1, (phase ? -9 : -4) + rim, 2, 4 - rim);
      rect(ctx, '#bca68e', tx - 1, (phase ? 10 : 7) - rim, 2, 3);
      rect(ctx, '#f0d7ad', tx - 1, (phase ? 10 : 7) - rim, 2, 1);
    }
    rect(ctx, '#f3b3c1', -9, -11, 4, 2); rect(ctx, '#8b496c', 9, -7, 3, 3);
  }

  function golem(ctx, phase, frame) {
    // The raised phase-two head is still part of the same combat body.
    var headY = phase ? -24 - frame % 2 : -14;
    [-1,1].forEach(function(side) {
      var footX = side < 0 ? -15 : 5, fistX = side < 0 ? -26 : 18;
      rect(ctx, '#514332', footX, 12, 10, 7); rect(ctx, '#aa7945', footX + 1, 12, 8, 5);
      rect(ctx, '#dbb56b', footX + 1, 12, 8, 1); rect(ctx, '#735735', footX + 2, 16, 2, 2);
      var fistY = 2 + (side < 0 ? frame % 2 * 2 : (frame + 1) % 2 * 2);
      line(ctx, '#554634', side * 13, 1, side * 21, fistY + 3, 5);
      rect(ctx, '#604b35', fistX, fistY, 9, 12); rect(ctx, '#b78b4e', fistX + 1, fistY + 1, 7, 10);
      rect(ctx, '#e5bf76', fistX + 1, fistY + 1, 6, 2);
      for (var knuckle = 0; knuckle < 3; knuckle++) rect(ctx, '#87623c', fistX + 2 + knuckle * 2, fistY + 6, 1, 4);
    });
    rect(ctx, '#534535', -15, -5, 30, 20); rect(ctx, '#a67943', -14, -4, 28, 18);
    rect(ctx, '#c79e58', -12, -3, 24, 14); rect(ctx, '#e4c67d', -11, -3, 22, 2);
    rect(ctx, '#8b673e', -12, 8, 24, 2); rect(ctx, '#755739', -14, 13, 28, 2);
    // Carved chest bands and glowing inset, never a new collision target.
    [-1,1].forEach(function(side) {
      rect(ctx, '#826540', side < 0 ? -11 : 6, 1, 5, 2);
      rect(ctx, '#edcc80', side < 0 ? -11 : 6, 3, 5, 1);
    });
    oval(ctx, 0, 5, 5, 6, '#6b593d'); oval(ctx, 0, 5, 3, 4, phase ? '#dc8149' : '#83946b');
    rect(ctx, phase ? '#ffe0a0' : '#b6c28a', -1, 2, 2, 3);
    rect(ctx, '#514532', -12, headY - 8, 24, 16); rect(ctx, '#b88b4c', -11, headY - 7, 22, 14);
    rect(ctx, '#dfb96d', -10, headY - 10, 20, 5); rect(ctx, '#f0d592', -9, headY - 10, 18, 1);
    rect(ctx, '#88653a', -14, headY - 4, 4, 10); rect(ctx, '#88653a', 10, headY - 4, 4, 10);
    rect(ctx, '#d5b06a', -13, headY - 3, 2, 6); rect(ctx, '#d5b06a', 11, headY - 3, 2, 6);
    [-1,1].forEach(function(side) {
      var ex = side < 0 ? -8 : 3;
      rect(ctx, '#684e35', ex, headY - 2, 6, 5); rect(ctx, '#de934d', ex + 1, headY - 1, 4, 3);
      rect(ctx, phase ? '#fff1ba' : '#f7cd7e', ex + 1, headY - 1, 3, 1);
    });
    rect(ctx, '#715337', -2, headY, 4, 5); rect(ctx, '#dcaf63', -1, headY, 2, 3);
    rect(ctx, '#644d36', -7, headY + 5, 14, 2); rect(ctx, '#d4af69', -6, headY + 7, 12, 1);
    rect(ctx, '#947440', -5, headY - 8, 2, 3); rect(ctx, '#947440', 3, headY - 8, 2, 3);
  }

  function duke(ctx, phase, frame) {
    var fin = frame % 2 * 2, dark = phase ? '#34566c' : '#355769';
    var mid = phase ? '#4b8794' : '#649e9e', light = phase ? '#80b8b1' : '#9fc7b4';
    // Forked tail and ribbed dorsal/ventral fins establish the fish silhouette.
    line(ctx, dark, -13, 0, -30, -12 - fin, 7); line(ctx, dark, -13, 0, -30, 12 + fin, 7);
    line(ctx, '#62918e', -16, 0, -29, -11 - fin, 3); line(ctx, '#83b5a7', -16, 1, -29, 11 + fin, 2);
    for (var rib = 0; rib < 4; rib++) {
      var rx = -12 + rib * 6;
      line(ctx, dark, rx, -7, rx + 3, -21 + rib * 2 + fin, 5);
      line(ctx, '#78ada0', rx, -7, rx + 3, -20 + rib * 2 + fin, 2);
      line(ctx, dark, rx, 9, rx + 3, 18 - rib, 4);
      line(ctx, '#609193', rx, 9, rx + 3, 17 - rib, 1);
    }
    oval(ctx, -1, 0, 18, 13, '#2f4557'); oval(ctx, -2, -1, 16, 11, mid);
    oval(ctx, -4, -5, 12, 6, phase ? '#67a0a4' : '#87bbb0'); oval(ctx, 3, 7, 12, 5, light);
    for (var gill = 0; gill < 3; gill++) line(ctx, dark, -10 + gill * 4, -3, -9 + gill * 4, 5, 1);
    // Heavy boar snout, nostrils and paired curved ivory tusks.
    oval(ctx, 15, 2, 10, 9, '#364f5d'); oval(ctx, 15, 1, 9, 7, light);
    oval(ctx, 21, 1, 4, 6, '#74a89f'); rect(ctx, dark, 19, -1, 1, 3); rect(ctx, dark, 23, -1, 1, 3);
    line(ctx, '#4a6467', 10, 6, 22, 6, 1);
    [9,18].forEach(function(tx) {
      line(ctx, '#827f78', tx, 7, tx + 1, 17, 3); line(ctx, '#e7d8b3', tx, 7, tx + 1, 16, 2);
      line(ctx, '#fff0cd', tx + 1, 16, tx + 3, 11, 1);
    });
    oval(ctx, 9, -7, 5, 5, '#304857'); oval(ctx, 10, -7, 3, 3, phase ? '#e69b72' : '#dfcd87');
    rect(ctx, '#354453', 10, -8, 1, 3); rect(ctx, '#fff0cc', 9, -9, 1, 1);
    line(ctx, dark, 4, -11, 12, -11 + (phase ? 2 : 0), 2);
    rect(ctx, '#b0d3bf', -8, -7, 3, 1); rect(ctx, '#a8c8b4', -3, -9, 3, 1);
  }

  function empress(ctx, phase, frame) {
    var flap = [0,2,0,-2][frame % 4];
    var colors = phase ? ['#f4d994','#ecc0b1','#c6acd7','#a9d7d7'] : ['#d7af6d','#cd80a8','#9879b3','#78b3bf'];
    [-1,1].forEach(function(side) {
      function wing(points, color) {
        polygon(ctx, color, points.map(function(p) { return [p[0] * side, p[1]]; }));
      }
      var tip = 34 + flap;
      wing([[3,-7],[tip,-30 + flap],[31,-9],[23,5],[8,10]], '#4c405f');
      wing([[6,-7],[tip - 2,-27 + flap],[28,-9],[21,3],[9,7]], colors[0]);
      wing([[7,-5],[tip - 5,-23 + flap],[26,-8],[20,2],[10,5]], colors[1]);
      wing([[8,-3],[27 + flap,-17],[23,-5],[18,2],[10,5]], colors[2]);
      wing([[8,1],[22 + flap,-8],[18,2],[11,6]], colors[3]);
      wing([[6,7],[28 + flap,5],[26,21],[16,30],[9,19]], '#4c405f');
      wing([[8,8],[26 + flap,7],[23,20],[16,27],[11,18]], colors[2]);
      wing([[9,9],[24 + flap,9],[21,19],[16,23],[12,17]], colors[3]);
      wing([[10,10],[20,11],[17,20],[13,16]], colors[1]);
      line(ctx, '#f2d8b2', side * 9, 3, side * (tip - 5), -22 + flap, 1);
      line(ctx, '#d8c6d0', side * 10, 11, side * 20, 21, 1);
      rect(ctx, '#f7e4bc', side * (tip - 5), -22 + flap, 2, 2);
      rect(ctx, '#e8e7d4', side * 22, 11, 2, 2);
    });
    // Hair, a small crowned face and layered gold/ivory dress.
    oval(ctx, 0, -14, 7, 11, '#694a71'); oval(ctx, -1, -15, 6, 10, '#ba7698');
    rect(ctx, '#e5a8ba', -4, -22, 7, 7); rect(ctx, '#f7d8b8', -3, -20, 6, 7);
    rect(ctx, '#fff0d2', -2, -20, 4, 1); rect(ctx, '#65465d', -2, -17, 1, 1); rect(ctx, '#65465d', 1, -17, 1, 1);
    rect(ctx, '#b77c85', -1, -14, 2, 1);
    polygon(ctx, '#624858', [[-5,-12],[5,-12],[7,8],[12,22],[0,31],[-12,22],[-7,8]]);
    polygon(ctx, '#c59a5e', [[-4,-11],[4,-11],[5,8],[10,21],[0,28],[-10,21],[-5,8]]);
    polygon(ctx, phase ? '#fff0ce' : '#edcb8e', [[-2,-10],[2,-10],[3,9],[6,21],[0,26],[-6,21],[-3,9]]);
    line(ctx, '#fce1a6', -4, -10, 0, -5, 1); line(ctx, '#fce1a6', 4, -10, 0, -5, 1);
    rect(ctx, '#785576', -5, -1, 10, 3); rect(ctx, '#f0cd8c', -5, -1, 10, 1);
    rect(ctx, phase ? '#eff9e7' : '#9dcccf', -1, -1, 2, 3);
    line(ctx, '#a97b71', -4, -8, -12, -3, 3); line(ctx, '#f2cda9', -4, -8, -12, -4, 1);
    line(ctx, '#a97b71', 4, -8, 14, -6 + frame % 2, 3);
    line(ctx, '#f2cda9', 4, -8, 14, -7 + frame % 2, 1);
    line(ctx, '#7e606b', 15, -21, 15, 14, 3); line(ctx, '#e7c77f', 15, -21, 15, 14, 1);
    polygon(ctx, '#657d9b', [[15,-27],[19,-22],[15,-16],[11,-22]]);
    polygon(ctx, phase ? '#f5fae5' : '#b2dfe1', [[15,-26],[17,-22],[15,-18],[13,-22]]);
    rect(ctx, '#fff1cb', 14, -24, 1, 3);
    rect(ctx, '#76526b', -6, -26, 12, 4); rect(ctx, '#deb979', -5, -25, 10, 2);
    [-1,0,1].forEach(function(prong) {
      var x = prong * 5, y = prong ? -29 : -32;
      rect(ctx, '#8c656e', x - 1, y, 3, 6); rect(ctx, '#f5d696', x, y, 1, 5);
    });
    rect(ctx, '#a3d2d3', -1, -25, 2, 2);
  }

  function lunarEye(ctx, x, y, rx, ry, phase, frame) {
    oval(ctx, x, y, rx, ry, '#2c454b'); oval(ctx, x, y - 1, rx - 1, ry - 1, '#cad5b8');
    oval(ctx, x + frame % 2, y - 1, Math.max(2, rx - 3), ry - 1, phase ? '#b5edcf' : '#73bfb5');
    rect(ctx, '#2e555d', x + frame % 2, y - ry + 1, 1, ry * 2 - 2);
    rect(ctx, '#f0f2d3', x - 1 + frame % 2, y - 2, 1, 1);
  }

  function moonLord(ctx, phase, frame) {
    var bob = frame % 2, skin = '#7b9e92', shade = '#4b746e', edge = '#293f48';
    // Floating torso, exposed ribs and shoulder/forearm silhouettes.
    oval(ctx, 0, 14, 19, 24, edge); oval(ctx, -1, 12, 17, 22, shade);
    oval(ctx, -2, 5, 15, 12, skin);
    [-1,1].forEach(function(side) {
      var hx = side * 31, hy = -4 + bob * (side < 0 ? 1 : -1);
      line(ctx, edge, side * 11, -1, side * 23, 7, 9);
      line(ctx, skin, side * 11, -2, side * 23, 6, 6);
      line(ctx, edge, side * 23, 7, hx, hy + 3, 8);
      line(ctx, '#92b1a0', side * 23, 6, hx, hy + 2, 5);
      oval(ctx, hx, hy, 8, 10, edge); oval(ctx, hx - 1, hy - 1, 6, 8, skin);
      for (var finger = 0; finger < 4; finger++) {
        var fx = hx - 6 + finger * 4, fy = hy - 19 + Math.abs(finger - 1) * 2;
        line(ctx, edge, fx, hy - 4, fx + side, fy, 3);
        line(ctx, '#a2bdab', fx, hy - 5, fx + side, fy, 1);
      }
      lunarEye(ctx, hx, hy - 1, 5, 4, phase, frame);
      for (var rib = 0; rib < 4; rib++) {
        var ry = 3 + rib * 5;
        line(ctx, '#355b5c', side * 2, ry + 2, side * (14 - rib), ry - 2, 3);
        line(ctx, '#b4c8ad', side * 3, ry, side * (14 - rib), ry - 3, 1);
      }
    });
    line(ctx, '#c2cdb0', 0, 1, 0, 16, 2);
    // Broad brow, three eyes and five individually shaded beard tendrils.
    oval(ctx, 0, -22, 13, 16, edge); oval(ctx, -1, -23, 11, 14, '#94b1a0');
    oval(ctx, -3, -28, 8, 7, '#b3c6ac'); rect(ctx, '#526f6b', -12, -29, 24, 3);
    rect(ctx, '#cbd4b8', -10, -30, 20, 1);
    lunarEye(ctx, 0, -28, 6, 5, phase, frame);
    lunarEye(ctx, -7, -20, 4, 3, phase, frame); lunarEye(ctx, 7, -20, 4, 3, phase, frame);
    rect(ctx, '#537773', -2, -20, 4, 7); rect(ctx, '#b0c1a5', -1, -20, 2, 5);
    for (var tentacle = -2; tentacle <= 2; tentacle++) {
      var tx = tentacle * 4, bend = (tentacle % 2 ? -1 : 1) * bob * 2;
      line(ctx, edge, tx, -13, tx + bend, -4, 4);
      line(ctx, tentacle % 2 ? '#6b9288' : '#a1baa4', tx, -14, tx + bend, -4, 2);
      line(ctx, edge, tx + bend, -4, tx - tentacle, 3 - Math.abs(tentacle), 3);
      line(ctx, '#7c9f91', tx + bend, -4, tx - tentacle, 2 - Math.abs(tentacle), 1);
    }
    // Phase two exposes a wider luminous core; it remains this body's art.
    oval(ctx, 0, 25, phase ? 10 : 8, 10, '#293f49');
    oval(ctx, 0, 25, phase ? 8 : 5, 8, phase ? '#75b9ac' : '#456f70');
    oval(ctx, -1, 24, phase ? 5 : 2, 6, phase ? (bob ? '#c8f2d3' : '#a0e3c6') : '#83b8a6');
    if (phase) rect(ctx, '#f3f7da', -2, 21, 2, 5);
    rect(ctx, '#6b9385', -5, 35, 3, 2); rect(ctx, '#6b9385', 2, 35, 3, 2);
  }

  function cultist(ctx, phase, frame) {
    var sway = [0,1,0,-1][frame % 4], trim = phase ? '#d7bb89' : '#ac936e';
    // Pointed hood and folded indigo robes, with a pale beaked ritual mask.
    polygon(ctx, '#27283f', [[0,-24],[-10,-14],[-8,-2],[-6,4],[7,4],[10,-13]]);
    polygon(ctx, '#43527d', [[0,-22],[-8,-13],[-6,-2],[6,-2],[8,-13]]);
    line(ctx, '#6d7ca0', 0, -20, -6, -13, 1);
    oval(ctx, 0, -10, 6, 8, '#292a3e'); oval(ctx, 0, -11, 5, 6, '#c0c4bf');
    rect(ctx, '#eee5ce', -3, -15, 6, 4); rect(ctx, '#4b556c', -4, -11, 3, 3); rect(ctx, '#4b556c', 2, -11, 3, 3);
    rect(ctx, phase ? '#b6d9e1' : '#80a6c0', -3, -11, 1, 1); rect(ctx, phase ? '#b6d9e1' : '#80a6c0', 3, -11, 1, 1);
    polygon(ctx, '#8b9b9e', [[-1,-10],[3,-10],[1,-2],[-1,-5]]);
    line(ctx, '#f1e8cf', 0, -9, 1, -4, 1);
    polygon(ctx, '#282a42', [[-7,-3],[7,-3],[10,12],[12 + sway,22],[3,20],[-2,23],[-13 + sway,21],[-9,9]]);
    polygon(ctx, '#3b4d79', [[-6,-2],[6,-2],[8,12],[10 + sway,20],[2,18],[-2,21],[-11 + sway,19],[-7,9]]);
    polygon(ctx, '#53668e', [[-4,0],[-1,1],[-3,17],[-8 + sway,19],[-5,9]]);
    line(ctx, '#7584a5', -4, 1, -6, 13, 1); line(ctx, '#263650', 4, 2, 6 + sway, 18, 2);
    line(ctx, trim, -5, -2, -2, 17, 1); line(ctx, trim, 5, -2, 2, 17, 1);
    line(ctx, trim, -10 + sway, 19, -2, 21, 1); line(ctx, trim, 2, 18, 9 + sway, 20, 1);
    rect(ctx, '#8a755d', -7, 6, 14, 3); rect(ctx, '#d1b982', -7, 6, 14, 1);
    rect(ctx, '#6c537c', -2, 5, 4, 4); rect(ctx, phase ? '#e6d4b2' : '#bd8eaf', -1, 6, 2, 2);
    [-1,1].forEach(function(side) {
      var handY = (phase ? -7 : -2) + (side < 0 ? sway : -sway);
      line(ctx, '#282b44', side * 6, 0, side * 15, handY, 7);
      line(ctx, '#52638b', side * 6, -1, side * 14, handY - 1, 4);
      rect(ctx, trim, side < 0 ? -16 : 12, handY - 3, 4, 5);
      rect(ctx, '#c6c3b8', side < 0 ? -18 : 16, handY - 2, 3, 3);
      oval(ctx, side * 18, handY - 6, 3 + frame % 2, 3 + frame % 2, '#5e558b');
      oval(ctx, side * 18, handY - 6, 2, 2, phase ? '#cfb6e2' : '#92add2');
      rect(ctx, '#edf0d9', side * 18 - 1, handY - 7, 1, 1);
    });
  }

  function pillar(ctx, theme, exposed, frame) {
    var palettes = {
      solar:['#352d39','#674346','#b3634f','#e5a06a','#f5d097'],
      vortex:['#263d48','#355c63','#538d82','#84c7a0','#c5e7bc'],
      nebula:['#352c49','#60456e','#98668f','#d496b8','#efd0d1'],
      stardust:['#2c3b52','#426184','#688fb1','#9dc6d7','#e1e7bd']
    };
    var p = palettes[theme], pulse = frame % 2;
    if (!exposed) {
      // A pixel-stepped force field; the live shield flag alone controls it.
      oval(ctx, 0, 0, 24, 38, p[1]);
      ctx.save(); ctx.globalCompositeOperation = 'destination-out';
      oval(ctx, 0, 0, 23, 37, '#000'); ctx.restore();
      [-1,1].forEach(function(side) {
        rect(ctx, p[3], side * 23 - 1, -2 + pulse * 3, 2, 4);
        rect(ctx, p[3], side * 12 - 1, side * (32 - pulse), 3, 2);
      });
    }
    polygon(ctx, p[0], [[-9,-28],[9,-28],[12,17],[15,34],[8,39],[-9,39],[-15,34],[-12,17]]);
    polygon(ctx, p[1], [[-8,-27],[7,-27],[10,17],[13,33],[7,37],[-8,37],[-13,33],[-10,17]]);
    polygon(ctx, p[2], [[-7,-24],[-4,-25],[-5,25],[-9,33],[-11,31],[-8,15]]);
    line(ctx, p[2], 6, -23, 9, 29, 2);
    for (var tier = 0; tier < 4; tier++) {
      var y = -22 + tier * 15, w = 8 + Math.floor(tier / 2);
      rect(ctx, p[0], -w - 1, y + 8, w * 2 + 2, 3);
      line(ctx, p[2], -w, y + 8, w, y + 8, 1);
      var lit = (tier + frame) % 4 === 0 ? p[4] : p[3];
      if (theme === 'solar') {
        line(ctx, lit, -3, y, 2, y + 3, 2); line(ctx, lit, 2, y + 3, -1, y + 6, 2);
      } else if (theme === 'vortex') {
        line(ctx, lit, -3, y, 3, y, 1); line(ctx, lit, 3, y, 3, y + 5, 1);
        line(ctx, lit, 3, y + 5, -2, y + 5, 1); rect(ctx, p[4], -2, y + 2, 3, 1);
      } else if (theme === 'nebula') {
        oval(ctx, 0, y + 3, 4, 4, p[0]); oval(ctx, 0, y + 3, 3, 3, lit);
        rect(ctx, p[1], -1, y + 2, 2, 2);
      } else {
        polygon(ctx, lit, [[0,y - 1],[2,y + 2],[5,y + 3],[2,y + 4],[0,y + 7],[-2,y + 4],[-5,y + 3],[-2,y + 2]]);
        rect(ctx, p[4], -1, y + 2, 2, 2);
      }
    }
    // Each crown changes the alpha silhouette, not just the theme palette.
    if (theme === 'solar') {
      polygon(ctx, p[0], [[-9,-25],[-16,-35],[-9,-32],[-10,-42],[-2,-35],[2,-44],[7,-34],[15,-38],[9,-25]]);
      polygon(ctx, p[3], [[-7,-26],[-12,-33],[-6,-31],[-7,-38],[0,-32],[3,-40],[6,-31],[11,-34],[7,-26]]);
      polygon(ctx, p[4], [[-3,-26],[-4,-32],[0,-30],[3,-35],[5,-26]]);
    } else if (theme === 'vortex') {
      [-1,1].forEach(function(side) {
        line(ctx, p[0], side * 5, -27, side * 15, -36, 5);
        line(ctx, p[3], side * 5, -28, side * 14, -36, 2);
        line(ctx, p[0], side * 15, -36, side * 8, -42, 4);
        line(ctx, p[2], side * 14, -36, side * 8, -42, 1);
      });
      oval(ctx, 0, -31, 8, 8, p[0]); oval(ctx, 0, -32, 6, 6, p[2]);
      oval(ctx, 1, -33, 3, 4, p[4]); oval(ctx, 2, -34, 2, 2, p[1]);
    } else if (theme === 'nebula') {
      [-1,0,1].forEach(function(lobe) {
        oval(ctx, lobe * 8, -32 - (lobe ? 0 : 6), 7, 7, p[0]);
        oval(ctx, lobe * 8 - 1, -33 - (lobe ? 0 : 6), 5, 5, p[2]);
        line(ctx, p[3], lobe * 8 - 3, -35 - (lobe ? 0 : 6), lobe * 8, -32 - (lobe ? 0 : 6), 1);
      });
      oval(ctx, 0, -29, 7, 6, p[1]); oval(ctx, 0, -30, 4, 4, p[3]); rect(ctx, p[4], -1, -32, 2, 3);
    } else {
      [-1,0,1].forEach(function(crystal) {
        var cx = crystal * 8, cy = crystal ? -34 : -40;
        polygon(ctx, p[0], [[cx,cy - 4],[cx + 5,cy + 2],[cx + 3,-25],[cx - 4,-25],[cx - 5,cy + 2]]);
        polygon(ctx, p[3], [[cx,cy - 2],[cx + 3,cy + 2],[cx + 2,-26],[cx - 2,-26],[cx - 3,cy + 2]]);
        line(ctx, p[4], cx - 1, cy, cx - 1, -28, 1);
      });
    }
    rect(ctx, p[0], -10, -27, 20, 3); rect(ctx, p[3], -9, -27, 18, 1);
    if (exposed) {
      line(ctx, p[0], 1, -22, -3, -4, 3); line(ctx, p[0], -3, -4, 3, 13, 3);
      line(ctx, p[0], 3, 13, -1, 30, 3);
      line(ctx, p[4], 1, -21, -3, -4, 1); line(ctx, p[3], -3, -4, 3, 13, 1);
      line(ctx, p[4], 3, 13, -1, 29, 1);
      oval(ctx, 0, 2, 4, 6, p[0]); oval(ctx, 0, 2, 2 + pulse, 4, p[3]);
      rect(ctx, p[4], -1, 0, 2, 3);
    }
    polygon(ctx, p[0], [[-12,32],[12,32],[16,38],[7,42],[-8,42],[-16,38]]);
    line(ctx, p[2], -11, 35, 11, 35, 2); line(ctx, p[3], -7, 39, 7, 39, 1);
  }

  function deerclops(ctx, phase, frame) {
    var sway = [0,1,0,-1][frame % 4], fur = phase ? '#787b80' : '#8b8177';
    // Branching bone antlers, heavy shaggy shoulders and cloven dark hooves.
    [-1,1].forEach(function(side) {
      line(ctx, '#4c4547', side * 8, -20, side * 15, -32, 4);
      line(ctx, '#c1bba3', side * 8, -21, side * 15, -33, 2);
      line(ctx, '#4c4547', side * 15, -32, side * 23, -37, 3);
      line(ctx, '#e4d9b7', side * 15, -33, side * 23, -38, 1);
      line(ctx, '#c1bba3', side * 14, -31, side * 11, -39, 2);
      line(ctx, '#e4d9b7', side * 11, -34, side * 11, -40, 1);
      var legX = side < 0 ? -12 : 4, step = side < 0 ? sway : -sway;
      rect(ctx, '#32313b', legX, 14, 9, 13 + step); rect(ctx, '#59524f', legX + 1, 15, 7, 7);
      rect(ctx, '#a69c89', legX + 1, 15, 3, 3); rect(ctx, '#262b36', legX - 1, 25 + step, 11, 4);
      rect(ctx, '#77716a', legX, 25 + step, 9, 1); rect(ctx, '#121e2b', legX + 4, 26 + step, 1, 3);
      line(ctx, '#3e3940', side * 13, -6, side * 22, 12 + step, 10);
      line(ctx, '#6c635d', side * 13, -7, side * 21, 10 + step, 6);
      rect(ctx, '#a29b88', side < 0 ? -25 : 19, 10 + step, 6, 3);
      for (var claw = 0; claw < 3; claw++) rect(ctx, '#c2bba1', (side < 0 ? -24 : 19) + claw * 2, 12 + step, 1, 4);
    });
    oval(ctx, 0, 1, 17, 21, '#39363e'); oval(ctx, -1, 0, 15, 19, '#6a6059');
    oval(ctx, -3, -3, 12, 14, fur); oval(ctx, -4, 5, 8, 9, '#a49b88');
    for (var tuft = 0; tuft < 7; tuft++) {
      var tx = -12 + tuft * 4, ty = 10 + Math.abs(tuft - 3) % 3;
      polygon(ctx, '#6a6059', [[tx,ty],[tx + 4,ty],[tx + 2,ty + 7]]);
      rect(ctx, '#b2aa94', tx + 1, ty, 1, 3);
    }
    oval(ctx, 0, -15, 14, 14, '#413b40'); oval(ctx, -1, -16, 12, 12, fur);
    oval(ctx, 2, -8, 10, 6, '#b5ad98'); rect(ctx, '#4e4a4a', 6, -11, 6, 3);
    rect(ctx, '#2e3039', 0, -5, 10, 2); rect(ctx, '#e2d6b6', 2, -5, 2, 2); rect(ctx, '#e2d6b6', 7, -5, 2, 2);
    oval(ctx, 2, -17, 8, 7, '#3b3c49'); oval(ctx, 2, -18, 6, 5, phase ? '#cf7785' : '#93c3d4');
    oval(ctx, 4, -18, 2, 4, '#283441'); rect(ctx, '#f1ebd5', 1, -21, 2, 2);
    line(ctx, '#b2a88f', -7, -24, 5, -25, 2);
    rect(ctx, phase ? '#a7b9bd' : '#c2b6a0', -10, -13, 2, 4);
  }

  function mourningWood(ctx, phase, frame) {
    var sway = [0,1,0,-1][frame % 4], glow = phase ? '#f0b77f' : '#c69468';
    [-1,1].forEach(function(side) {
      // Three crooked boughs per side, with small broken twig ends.
      line(ctx, '#332e36', side * 7, -7, side * 21, -17 + sway, 7);
      line(ctx, '#725248', side * 7, -8, side * 21, -18 + sway, 4);
      line(ctx, '#aa7960', side * 8, -10, side * 21, -19 + sway, 1);
      line(ctx, '#332e36', side * 21, -17 + sway, side * 29, -30 + sway, 5);
      line(ctx, '#8c6350', side * 21, -18 + sway, side * 29, -31 + sway, 2);
      line(ctx, '#332e36', side * 23, -22 + sway, side * 34, -22 + sway, 3);
      line(ctx, '#a27459', side * 23, -23 + sway, side * 34, -23 + sway, 1);
      line(ctx, '#67493f', side * 15, -12, side * 15, -28 - sway, 4);
      line(ctx, '#ae7c5c', side * 15, -16, side * 17, -30 - sway, 1);
      line(ctx, '#352e33', side * 7, 15, side * 22, 26 - side * sway, 7);
      line(ctx, '#765245', side * 7, 15, side * 22, 25 - side * sway, 4);
      line(ctx, '#ac7b59', side * 8, 15, side * 21, 24 - side * sway, 1);
    });
    polygon(ctx, '#332d35', [[-10,-25],[4,-28],[12,-20],[10,8],[15,24],[4,26],[-9,24],[-14,14],[-11,-5]]);
    polygon(ctx, '#765246', [[-9,-23],[3,-26],[10,-19],[8,8],[12,22],[3,24],[-7,22],[-12,13],[-9,-5]]);
    polygon(ctx, '#a27152', [[-7,-21],[-3,-24],[-4,1],[-7,17],[-10,12],[-7,-3]]);
    for (var groove = 0; groove < 5; groove++) {
      var gx = -7 + groove * 3;
      line(ctx, '#4f3b38', gx, -19 + groove % 2 * 3, gx + sway, 17 - groove % 3, 1);
      rect(ctx, '#b2825c', gx - 1, 11 + groove % 2 * 3, 1, 5);
    }
    // Charred sockets and a jagged furnace mouth carved into live bark.
    polygon(ctx, '#302b33', [[-9,-9],[-1,-6],[-2,-1],[-8,-3]]);
    polygon(ctx, '#302b33', [[1,-6],[9,-10],[8,-3],[2,-1]]);
    line(ctx, glow, -7, -6, -3, -4, 2); line(ctx, glow, 3, -4, 7, -7, 2);
    polygon(ctx, '#302833', [[-7,3],[0,5],[8,2],[7,11],[2,15],[-6,11]]);
    polygon(ctx, phase ? '#c68b5c' : '#8b644e', [[-5,6],[0,7],[6,5],[5,10],[1,12],[-4,10]]);
    rect(ctx, '#c19a70', -4, 4, 2, 3); rect(ctx, '#c19a70', 3, 4, 2, 3);
    oval(ctx, -1, -20, 4, 3, '#3d3036'); oval(ctx, -1, -20, 2, 2, '#91644b');
    if (phase) for (var ember = -1; ember <= 1; ember++) {
      var ex = ember * 5, ey = -27 - (ember + frame + 4) % 3;
      polygon(ctx, '#67484a', [[ex - 3,ey + 5],[ex - 2,ey - 4],[ex,ey - 1],[ex + 2,ey - 7],[ex + 3,ey + 5]]);
      line(ctx, '#edbb7f', ex, ey + 3, ex + 1, ey - 2, 2);
      line(ctx, '#d19263', ex - 1, 15, ex + sway, 21, 1);
    }
  }

  function pumpking(ctx, phase, frame) {
    var sway = [0,2,0,-2][frame % 4];
    // A torn royal mantle, not independent arms or invented weapon targets.
    polygon(ctx, '#342c3d', [[-10,-10],[-25,-5],[-29,17],[-18,14],[-21,28],[-7,22],[0,31],[7,22],[22,27],[18,13],[28 + sway,17],[24,-6],[10,-10]]);
    polygon(ctx, '#623c52', [[-10,-7],[-22,-3],[-25,13],[-15,11],[-17,24],[-6,19],[0,27],[6,19],[18,23],[14,9],[24 + sway,13],[21,-4],[10,-7]]);
    line(ctx, '#956174', -19, 0, -16, 14, 2); line(ctx, '#956174', 18, -1, 16 + sway, 13, 2);
    line(ctx, '#443249', -9, 11, -8 + sway, 22, 3); line(ctx, '#443249', 9, 11, 7 + sway, 22, 3);
    // Ribbed pumpkin lobes build volume beneath the carved face.
    oval(ctx, 0, -3, 19, 17, '#51373b');
    oval(ctx, -8, -3, 9, 14, '#aa634a'); oval(ctx, 8, -3, 9, 14, '#b7734d');
    oval(ctx, -1, -4, 12, 15, phase ? '#e4a76a' : '#d58d58');
    line(ctx, '#edc182', -6, -16, -8, -8, 2); line(ctx, '#f2cb91', -2, -17, -3, -12, 2);
    line(ctx, '#8c5140', 10, -12, 12, 2, 1); line(ctx, '#8c5140', -13, -10, -14, 3, 1);
    var lit = phase ? '#f9d69c' : '#d5aa70';
    polygon(ctx, '#663b38', [[-12,-9],[-3,-6],[-5,0],[-11,-2]]);
    polygon(ctx, '#663b38', [[3,-6],[12,-10],[11,-2],[5,0]]);
    line(ctx, lit, -10, -6, -6, -4, 2); line(ctx, lit, 6, -4, 10, -7, 2);
    polygon(ctx, '#593337', [[-11,3],[-5,5],[0,3],[5,5],[12,2],[9,10],[1,13],[-8,10]]);
    polygon(ctx, phase ? '#edbd7d' : '#bd8656', [[-8,6],[-4,8],[1,6],[5,8],[9,5],[7,9],[1,11],[-6,9]]);
    rect(ctx, '#daac73', -6, 4, 2, 3); rect(ctx, '#daac73', 2, 4, 2, 3); rect(ctx, '#daac73', 6, 9, 2, 2);
    line(ctx, '#3c4745', -2, -18, -4 + frame % 2, -26, 5);
    line(ctx, '#879366', -2, -19, -4 + frame % 2, -25, 3);
    line(ctx, '#bbc08a', -3, -21, -5 + frame % 2, -26, 1);
    polygon(ctx, '#52654e', [[-1,-20],[5,-25],[11,-24],[6,-20]]);
    line(ctx, '#a3ad79', 0, -21, 8, -23, 1);
    polygon(ctx, '#546049', [[-13,11],[-5,14],[0,12],[5,14],[13,10],[9,17],[0,18],[-9,17]]);
    line(ctx, '#ba9e6d', -8, 16, 8, 16, 1); rect(ctx, '#e8c78c', -2, 16, 4, 3);
  }

  function everscream(ctx, phase, frame) {
    var sway = [0,1,0,-1][frame % 4];
    var shade = phase ? '#3c5866' : '#374d4c', pine = phase ? '#638d94' : '#5e826c';
    var snow = phase ? '#dfebe2' : '#c1d2c6';
    [-1,1].forEach(function(side) {
      line(ctx, '#3a353b', side * 6, 14, side * 22, 26 + side * sway, 7);
      line(ctx, '#806752', side * 6, 14, side * 22, 25 + side * sway, 4);
      line(ctx, '#b49a72', side * 8, 16, side * 21, 24 + side * sway, 1);
      line(ctx, '#303b43', side * 9, -2, side * 26, -11 + side * sway, 5);
      line(ctx, pine, side * 9, -3, side * 26, -12 + side * sway, 3);
      polygon(ctx, shade, [[side * 19,-15 + side * sway],[side * 30,-8],[side * 24,-6],[side * 15,-6]]);
      line(ctx, snow, side * 21, -13 + side * sway, side * 27, -9, 1);
    });
    rect(ctx, '#3b333b', -7, 5, 14, 20); rect(ctx, '#82614c', -6, 6, 12, 17);
    line(ctx, '#bd9465', -4, 8, -4, 21, 1); line(ctx, '#503e38', 2, 7, 3, 22, 2);
    // Three jagged evergreen skirts, each with its own snow shelf.
    for (var tier = 2; tier >= 0; tier--) {
      var y = -29 + tier * 13, w = 11 + tier * 5;
      polygon(ctx, '#2d3c44', [[sway,y - 5],[-w,y + 13],[-w + 6,y + 11],[-w + 3,y + 17],[-3,y + 14],[0,y + 18],[5,y + 14],[w - 2,y + 17],[w - 5,y + 11],[w,y + 13]]);
      polygon(ctx, shade, [[sway,y - 3],[-w + 3,y + 12],[-w + 7,y + 10],[-w + 6,y + 14],[-2,y + 12],[0,y + 15],[5,y + 12],[w - 5,y + 14],[w - 7,y + 9],[w - 3,y + 11]]);
      polygon(ctx, pine, [[sway,y - 2],[-w + 6,y + 8],[-3,y + 7],[1,y + 11],[w - 6,y + 8]]);
      polygon(ctx, snow, [[sway,y - 3],[-6 - tier * 2,y + 4],[-2,y + 3],[1,y + 5],[5 + tier * 2,y + 3]]);
      line(ctx, phase ? '#f5f1da' : '#e3e4d0', sway, y - 2, -4 - tier, y + 3, 1);
      for (var needle = -2; needle <= 2; needle++) rect(ctx, '#91ad92', needle * 3, y + 9 + Math.abs(needle) % 2, 1, 2);
    }
    // Staggered ornaments and a crooked star make this unlike the bare oak.
    [[-7,-13],[6,-9],[-12,0],[11,4],[-5,10]].forEach(function(pos, i) {
      var y = pos[1] + (i % 2 ? sway : 0);
      oval(ctx, pos[0], y, 2, 2, '#34414a');
      rect(ctx, i % 2 ? '#c6b47a' : '#b57d81', pos[0] - 1, y - 1, 2, 2);
      rect(ctx, '#eee0b3', pos[0] - 1, y - 1, 1, 1);
    });
    polygon(ctx, '#716e58', [[0,-37],[2,-34],[6,-33],[3,-30],[3,-26],[0,-28],[-4,-26],[-3,-30],[-6,-33],[-2,-34]]);
    line(ctx, '#dfc98d', -3, -32, 3, -31, 2); line(ctx, '#f1e1ad', 0, -35, 0, -29, 1);
    polygon(ctx, '#29353e', [[-9,-6],[-2,-3],[-3,1],[-8,-1]]);
    polygon(ctx, '#29353e', [[2,-3],[9,-7],[8,-1],[3,1]]);
    line(ctx, phase ? '#e5eace' : '#ddbb81', -7, -3, -4, -1, 1);
    line(ctx, phase ? '#e5eace' : '#ddbb81', 4, -1, 7, -4, 1);
    polygon(ctx, '#29343c', [[-6,4],[0,6],[7,3],[5,10],[0,12],[-5,9]]);
    rect(ctx, '#b3c3a6', -4, 5, 2, 2); rect(ctx, '#b3c3a6', 2, 5, 2, 2);
    if (phase) {
      line(ctx, '#a7c9c7', -14, 6, -10, 13 + sway, 1);
      line(ctx, '#a7c9c7', 12, -11, 16, -4 - sway, 1);
    }
  }

  function santank(ctx, phase, frame) {
    // Broad tracked chassis and shaded red armor; no extra damageable tools.
    oval(ctx, 0, 17, 23, 9, '#29323e'); oval(ctx, 0, 17, 21, 7, '#536270');
    for (var wheel = -2; wheel <= 2; wheel++) {
      oval(ctx, wheel * 8, 17, 4, 5, '#293642'); oval(ctx, wheel * 8, 17, 2, 3, '#91a0a4');
      rect(ctx, '#c1c7b5', wheel * 8 - 1, 16 + frame % 2, 2, 1);
    }
    for (var tread = 0; tread < 10; tread++) {
      var tx = -20 + (tread * 4 + frame) % 40;
      rect(ctx, '#a4b2b0', tx, 10, 2, 2); rect(ctx, '#8c9d9f', tx, 22, 2, 2);
    }
    polygon(ctx, '#3c3543', [[-18,-6],[12,-6],[22,2],[19,14],[-21,14],[-23,2]]);
    polygon(ctx, phase ? '#95616a' : '#9e5860', [[-17,-5],[11,-5],[20,3],[17,12],[-19,12],[-21,2]]);
    polygon(ctx, '#cb8581', [[-16,-5],[11,-5],[17,0],[-19,0]]);
    rect(ctx, '#5a5261', -18, 5, 34, 3); rect(ctx, '#c6c8b3', -17, 5, 32, 1);
    [-15,-7,7,15].forEach(function(x) { rect(ctx, '#ead6b2', x, 2, 1, 1); rect(ctx, '#ead6b2', x, 10, 1, 1); });
    rect(ctx, '#364854', -5, 0, 10, 13); rect(ctx, '#91a5aa', -4, 1, 8, 11);
    for (var vent = 0; vent < 3; vent++) rect(ctx, '#354955', -3, 3 + vent * 3, 6, 1);
    // Offset turret, long muzzle and a row of sealed rocket ports.
    rect(ctx, '#354450', -3, -14, 17, 10); rect(ctx, '#798c96', -2, -13, 15, 8);
    rect(ctx, '#b3c1be', -1, -13, 12, 2); rect(ctx, '#354450', 11, -12, 19, 6);
    rect(ctx, '#94a6aa', 12, -11, 16, 3); rect(ctx, '#c9d2c3', 13, -11, 14, 1);
    rect(ctx, '#354450', 27, -13, 4, 8); rect(ctx, '#b2c1bd', 28, -12, 2, 6); rect(ctx, '#263a47', 29, -10, 2, 3);
    for (var port = 0; port < 3; port++) {
      rect(ctx, '#3b3e4c', 9 + port * 4, -3, 3, 4);
      rect(ctx, phase ? '#efb48d' : '#c79488', 10 + port * 4, -2, 1, 2);
    }
    // A mechanical Santa face, segmented beard and a cloth cap.
    oval(ctx, -10, -15, 8, 9, '#36404b'); oval(ctx, -10, -16, 6, 7, phase ? '#99aab0' : '#c2b7a4');
    rect(ctx, '#52616b', -15, -17, 10, 3); rect(ctx, phase ? '#ebad91' : '#e0d9b6', -14, -17, 3, 1);
    rect(ctx, phase ? '#e2928a' : '#927e78', -8, -17, 2, 2);
    rect(ctx, '#d2d7c8', -15, -11, 11, 3);
    for (var beard = -1; beard <= 1; beard++) {
      rect(ctx, phase ? '#8299a3' : '#e5dfc9', -11 + beard * 3, -9, 3, 4 - Math.abs(beard));
      rect(ctx, '#b2c2be', -11 + beard * 3, -9, 1, 2);
    }
    polygon(ctx, '#5d4652', [[-17,-22],[-13,-30],[-5,-28],[-1,-21]]);
    polygon(ctx, '#b5767b', [[-16,-22],[-12,-28],[-6,-26],[-3,-21]]);
    rect(ctx, '#e4decb', -18, -23, 15, 3); oval(ctx, -2, -21, 3, 3, '#d5d9c9');
    rect(ctx, '#f3e7c9', -17, -23, 12, 1);
    if (phase) {
      line(ctx, '#483e4b', -15, 0, -10, 6, 2); line(ctx, '#d3a08b', -14, 0, -10, 5, 1);
      rect(ctx, '#b3d0c7', -2, -10, 2, 2);
    }
  }

  function iceQueen(ctx, phase, frame) {
    var sway = [0,1,0,-1][frame % 4];
    var mid = phase ? '#b6d4d9' : '#7ca8bd', light = phase ? '#edf0d9' : '#c2dcda';
    [-1,1].forEach(function(side) {
      // Stepped crystal shoulder fins and wind-blown icy ribbons.
      polygon(ctx, '#45536f', [[side * 4,-9],[side * 27,-22 + sway],[side * 22,-5],[side * 14,1],[side * 8,11]]);
      polygon(ctx, mid, [[side * 6,-8],[side * 24,-18 + sway],[side * 20,-6],[side * 13,-1],[side * 9,8]]);
      line(ctx, light, side * 9, -5, side * 23, -17 + sway, 1);
      polygon(ctx, '#516c89', [[side * 8,3],[side * 20,10],[side * (24 + sway),25],[side * 17,20],[side * 12,11]]);
      line(ctx, '#a7cbd0', side * 15, 10, side * (22 + sway), 23, 1);
      line(ctx, '#45536b', side * 4, -5, side * 15, -1 + side * sway, 4);
      line(ctx, light, side * 5, -6, side * 15, -2 + side * sway, 2);
      rect(ctx, '#d6e7dd', side < 0 ? -18 : 15, -3 + side * sway, 3, 3);
    });
    oval(ctx, 0, -17, 8, 12, '#41526b'); oval(ctx, -1, -18, 6, 10, '#819db9');
    rect(ctx, '#a7c6cf', -5, -21, 10, 11); rect(ctx, light, -4, -21, 8, 4);
    rect(ctx, '#3b5976', -3, -17, 2, 2); rect(ctx, '#3b5976', 2, -17, 2, 2);
    rect(ctx, '#e3eee0', -3, -17, 1, 1); rect(ctx, '#e3eee0', 2, -17, 1, 1);
    rect(ctx, '#6689a6', -1, -12, 2, 1);
    // Tall ice crown, a faceted bodice and five unequal icicle skirt tips.
    polygon(ctx, '#4b627e', [[-8,-24],[-11,-33],[-4,-29],[0,-37],[4,-29],[11,-33],[8,-24]]);
    polygon(ctx, mid, [[-7,-25],[-8,-30],[-3,-27],[0,-34],[3,-27],[8,-30],[7,-25]]);
    line(ctx, light, -6, -25, 6, -25, 1); line(ctx, light, 0, -33, 0, -26, 1);
    rect(ctx, '#6c91b3', -1, -26, 2, 3); rect(ctx, '#e3efe2', -1, -26, 1, 1);
    polygon(ctx, '#455978', [[-5,-10],[5,-10],[7,7],[15,21],[9,26],[4,22],[0,29],[-4,23],[-10,27],[-15,21],[-7,7]]);
    polygon(ctx, mid, [[-4,-9],[4,-9],[5,7],[12,20],[8,23],[3,19],[0,25],[-4,20],[-9,24],[-12,20],[-5,7]]);
    polygon(ctx, light, [[-1,-8],[2,-8],[2,8],[7,20],[3,18],[0,24],[-3,18],[-6,20],[-2,7]]);
    line(ctx, '#7297b3', -4, 1, 4, 1, 2); rect(ctx, phase ? '#faf2cf' : '#a9cbd5', -1, 0, 2, 3);
    for (var icicle = -2; icicle <= 2; icicle++) {
      var x = icicle * 5, tip = 31 - Math.abs(icicle) * 2 + (icicle % 2 ? sway : 0);
      polygon(ctx, '#526e8e', [[x - 3,17],[x + 3,17],[x,tip + 2]]);
      polygon(ctx, light, [[x - 2,18],[x + 1,18],[x,tip]]);
      line(ctx, '#8eb4c6', x + 1, 19, x, tip - 2, 1);
    }
    [-1,1].forEach(function(side) {
      var x = side * 19, y = -28 + side * sway;
      line(ctx, '#90b3c9', x - 2, y, x + 2, y, 1); line(ctx, '#90b3c9', x, y - 2, x, y + 2, 1);
      rect(ctx, light, x, y, 1 + frame % 2, 1);
    });
  }

  function martianSaucer(ctx, phase, frame) {
    var glow = phase ? '#b1d99d' : '#89c7c0';
    // Layered steel saucer, sealed dome and short plasma exhaust, not a new ray.
    oval(ctx, 0, 6, 14, 8, '#303e50'); oval(ctx, 0, 6, 11, 6, '#4e697a');
    polygon(ctx, '#405a67', [[-7,9],[7,9],[4,17 + frame % 2],[0,20],[-4,17 + frame % 2]]);
    polygon(ctx, glow, [[-4,10],[4,10],[2,16],[0,18],[-2,16]]);
    rect(ctx, '#e4ebcf', -2, 10, 4, 3);
    oval(ctx, 0, 0, 28, 9, '#2b394a'); oval(ctx, -1, -1, 26, 7, '#748e9c');
    oval(ctx, -2, -4, 21, 4, '#a9bdc0'); oval(ctx, 0, 3, 24, 3, '#465c73');
    line(ctx, '#d0d8c9', -18, -6, 17, -6, 1);
    [-1,1].forEach(function(side) {
      rect(ctx, '#334658', side < 0 ? -28 : 21, -3, 7, 10);
      rect(ctx, '#8da5b0', side < 0 ? -27 : 22, -2, 5, 7);
      rect(ctx, glow, side < 0 ? -26 : 23, 3, 3, 2);
      rect(ctx, '#d4ddd0', side < 0 ? -27 : 22, -2, 4, 1);
    });
    oval(ctx, 0, -9, 13, 12, '#344957'); oval(ctx, -1, -10, 11, 10, '#6a9da9');
    oval(ctx, -3, -13, 7, 6, '#a6cbd0'); line(ctx, '#d4e5db', -7, -14, -4, -17, 2);
    // Pilot silhouette stays behind the glass and bolted rim.
    oval(ctx, 2, -9, 5, 5, '#4e777a'); rect(ctx, '#bdd3b5', 0, -10, 5, 2);
    rect(ctx, '#354d59', 1, -10, 1, 2); rect(ctx, '#354d59', 4, -10, 1, 2);
    rect(ctx, '#3b5062', -13, -2, 26, 3); rect(ctx, '#b9c9c8', -11, -2, 22, 1);
    for (var port = 0; port < 7; port++) {
      var x = -18 + port * 6, lit = (port + frame) % 4 === 0;
      rect(ctx, '#293e50', x - 2, 1, 4, 3);
      rect(ctx, phase ? (lit ? '#edb593' : '#b27c83') : (lit ? '#d3e0aa' : '#86b8a5'), x - 1, 1, 2, 2);
    }
    if (phase) {
      line(ctx, '#344c5e', 4, -18, 1, -12, 2); line(ctx, '#d9e5cf', 3, -18, 0, -12, 1);
      line(ctx, '#344c5e', 1, -12, 6, -7, 1); rect(ctx, '#edc49d', -1, 10, 2, 3);
    }
  }

  function goblinWarlock(ctx, phase, frame) {
    var sway = [0,1,0,-1][frame % 4], trim = phase ? '#d4b29f' : '#a68b85';
    // Long olive ears and a hooked nose distinguish the caster from Cultist.
    polygon(ctx, '#353342', [[-6,-16],[-17,-20],[-11,-10],[-5,-9],[6,-9],[12,-12],[15,-20],[5,-16]]);
    polygon(ctx, '#839476', [[-6,-15],[-14,-18],[-10,-12],[-5,-11],[6,-11],[11,-14],[12,-18],[5,-15]]);
    oval(ctx, 0, -13, 8, 9, '#3b4148'); oval(ctx, -1, -14, 6, 7, '#9aa685');
    rect(ctx, '#c2c2a0', -5, -17, 7, 2);
    rect(ctx, '#4e5058', -5, -14, 3, 3); rect(ctx, '#4e5058', 2, -14, 3, 3);
    rect(ctx, phase ? '#e29e96' : '#d5c38c', -4, -14, 2, 1); rect(ctx, phase ? '#e29e96' : '#d5c38c', 3, -14, 1, 1);
    polygon(ctx, '#71816d', [[0,-13],[5,-12],[8,-8],[2,-8]]); line(ctx, '#c1c39a', 2, -11, 6, -9, 1);
    rect(ctx, '#4b4c4d', -3, -6, 7, 1); rect(ctx, '#d2c9aa', 2, -6, 1, 2);
    polygon(ctx, '#302c43', [[-10,-19],[-7,-28],[1,-32],[7,-26],[9,-19]]);
    polygon(ctx, '#615274', [[-8,-20],[-5,-27],[1,-30],[4,-25],[7,-20]]);
    line(ctx, '#947897', -5, -25, 0, -28, 1); rect(ctx, '#ac8b89', -10, -20, 19, 2);
    polygon(ctx, '#302c42', [[-7,-6],[7,-6],[10,10],[12 + sway,23],[2,20],[-4,24],[-12 + sway,21],[-9,8]]);
    polygon(ctx, '#57465f', [[-6,-5],[6,-5],[8,10],[9 + sway,20],[1,17],[-4,21],[-9 + sway,19],[-7,8]]);
    polygon(ctx, '#79617a', [[-5,-4],[-1,-3],[-2,14],[-7,19],[-5,8]]);
    line(ctx, trim, -5, -3, -3, 15, 1); line(ctx, trim, 5, -3, 4, 15, 1);
    rect(ctx, '#473d4e', -8, 5, 16, 3); rect(ctx, '#b6a183', -7, 5, 14, 1);
    rect(ctx, '#7c6489', -2, 4, 4, 5); rect(ctx, phase ? '#e9b5c4' : '#b191bb', -1, 5, 2, 2);
    line(ctx, '#393042', -6, -2, -13, 4 + sway, 6); line(ctx, '#8c7890', -7, -2, -13, 3 + sway, 3);
    rect(ctx, '#a6af8b', -16, 1 + sway, 3, 4);
    line(ctx, '#352f42', 6, -2, 14, -5 - sway, 6); line(ctx, '#8c7890', 7, -3, 14, -6 - sway, 3);
    rect(ctx, '#adb895', 13, -8 - sway, 4, 3);
    oval(ctx, 16, -13 - sway, phase ? 6 : 5, phase ? 6 : 5, '#534064');
    oval(ctx, 16, -14 - sway, phase ? 4 : 3, phase ? 4 : 3, '#ad8ebe');
    rect(ctx, '#edced9', 15, -16 - sway, 2, 3); rect(ctx, '#f1e5d3', 15, -16 - sway, 1, 1);
  }

  function pirateCaptain(ctx, phase, frame) {
    var sway = [0,1,0,-1][frame % 4];
    rect(ctx, '#342f3d', -9, 15, 6, 11); rect(ctx, '#342f3d', 4, 15, 6, 11);
    rect(ctx, '#a79579', -8, 15, 4, 5); rect(ctx, '#a79579', 5, 15, 4, 5);
    rect(ctx, '#252d39', -10, 24, 8, 4); rect(ctx, '#252d39', 4, 24, 9, 4);
    rect(ctx, '#8f8b7b', -9, 24, 6, 1); rect(ctx, '#8f8b7b', 5, 24, 7, 1);
    polygon(ctx, '#2d3446', [[-8,-8],[8,-8],[12,8],[13 + sway,20],[4,18],[0,22],[-5,18],[-13 + sway,21],[-11,7]]);
    polygon(ctx, '#4a6177', [[-7,-7],[7,-7],[9,8],[10 + sway,18],[3,15],[0,19],[-4,15],[-10 + sway,18],[-8,6]]);
    polygon(ctx, '#c6be9e', [[-3,-6],[4,-6],[3,12],[0,16],[-3,11]]);
    line(ctx, '#c3a574', -6, -6, -3, 13, 1); line(ctx, '#c3a574', 6, -6, 4, 13, 1);
    rect(ctx, '#704653', -10, 8, 20, 3); rect(ctx, '#c8ad77', -2, 7, 5, 5); rect(ctx, '#554b4d', -1, 8, 3, 3);
    for (var button = 0; button < 3; button++) rect(ctx, '#dfc68c', -7, -2 + button * 4, 1, 1);
    [-1,1].forEach(function(side) {
      line(ctx, '#2b3444', side * 8, -4, side * 15, 4, 6);
      line(ctx, '#6a7d8c', side * 8, -5, side * 14, 3, 3);
      rect(ctx, '#c9b27d', side < 0 ? -13 : 9, -6, 5, 3);
    });
    oval(ctx, 0, -16, 8, 9, '#51434c'); oval(ctx, -1, -17, 6, 7, '#c6aa88');
    rect(ctx, '#e0c6a0', -4, -21, 7, 3); rect(ctx, '#574b4b', -5, -17, 2, 2);
    line(ctx, '#4c3e43', -5, -20, 5, -15, 1); rect(ctx, '#28313c', 2, -18, 4, 4);
    polygon(ctx, '#5e4b49', [[-6,-14],[6,-14],[7,-6],[2,-2],[-5,-6]]);
    line(ctx, '#a38a6d', -4, -12, -2, -5, 1); line(ctx, '#a38a6d', 3, -12, 2, -6, 1);
    rect(ctx, '#a26767', -7, -23, 14, 3);
    polygon(ctx, '#28313e', [[-16,-25],[-10,-31],[-4,-28],[0,-32],[6,-28],[14,-30],[17,-24],[9,-21],[-9,-21]]);
    line(ctx, '#c6ad7b', -14, -25, -8, -23, 1); line(ctx, '#c6ad7b', -8, -23, 9, -23, 1);
    line(ctx, '#c6ad7b', 9, -23, 14, -26, 1);
    rect(ctx, '#dfd4b7', -2, -28, 4, 3); rect(ctx, '#28313e', -1, -27, 1, 1);
    line(ctx, '#ded0ad', -3, -24, 3, -28, 1);
    // Hand cannon faces the player with the body; firing remains AI-owned.
    rect(ctx, '#354451', 11, -1, 15, 7); rect(ctx, '#8c9da4', 12, 0, 13, 5);
    rect(ctx, '#cad0bc', 13, 0, 11, 1); rect(ctx, '#2b3d49', 23, 0, 3, 5);
    rect(ctx, '#c2ad80', 14, 5, 5, 4);
    rect(ctx, phase ? '#efbd89' : '#b78c77', 20, -3 + frame % 2, 2, 2);
    if (phase) { line(ctx, '#a0abb0', -10, 13, -7, 17, 1); rect(ctx, '#cfae7f', -8, 1, 1, 3); }
  }

  function flyingDutchman(ctx, phase, frame) {
    var sway = [0,1,0,-1][frame % 4], cloth = phase ? '#a5bdb1' : '#c8bda0';
    // Two rigged masts, ragged canvas and a small animated pennant.
    line(ctx, '#3b3b42', -29, 4, -13, -34, 1); line(ctx, '#3b3b42', 29, 2, 9, -39, 1);
    line(ctx, '#66534a', -13, 5, -13, -36, 3); line(ctx, '#b7a078', -13, 3, -13, -35, 1);
    line(ctx, '#66534a', 9, 5, 9, -40, 3); line(ctx, '#b7a078', 9, 3, 9, -39, 1);
    polygon(ctx, '#4c494a', [[-12,-32],[-3,-28],[1 + sway,-10],[-4,-12],[-6,-8],[-12,-9]]);
    polygon(ctx, cloth, [[-11,-30],[-5,-27],[-1 + sway,-12],[-5,-14],[-7,-11],[-11,-11]]);
    polygon(ctx, '#4c494a', [[11,-35],[28 + sway,-16],[25,-12],[28,-8],[20,-10],[17,-6],[11,-8]]);
    polygon(ctx, cloth, [[12,-33],[26 + sway,-16],[22,-13],[25,-10],[19,-12],[17,-9],[12,-10]]);
    line(ctx, '#eee0b9', 12, -31, 12, -12, 1); line(ctx, '#e0d1aa', -10, -28, -10, -14, 1);
    rect(ctx, '#756b61', 16, -21, 7, 1); rect(ctx, '#756b61', 18, -24, 1, 7);
    rect(ctx, '#ece0bd', 18, -21, 2, 1);
    if (phase) {
      ctx.save(); ctx.globalCompositeOperation = 'destination-out';
      polygon(ctx, '#000', [[17,-25],[21,-21],[18,-18],[15,-21]]);
      polygon(ctx, '#000', [[-8,-22],[-5,-20],[-6,-16],[-9,-17]]); ctx.restore();
    }
    polygon(ctx, '#344d50', [[10,-39],[22 + sway,-38],[19,-35],[23 + sway,-32],[10,-33]]);
    line(ctx, '#94b9a1', 11, -38, 19 + sway, -37, 1);
    // Planked hull, raised stern cabin, bow and three decorative cannon ports.
    polygon(ctx, '#302f3b', [[-36,-3],[-22,0],[24,-1],[36,-6],[31,12],[22,19],[-24,18],[-33,9]]);
    polygon(ctx, '#765745', [[-33,-1],[-21,2],[24,1],[33,-3],[28,11],[21,16],[-23,15],[-30,8]]);
    polygon(ctx, '#a67b52', [[-31,1],[-21,4],[23,3],[31,0],[28,5],[-28,6]]);
    for (var plank = 0; plank < 3; plank++) line(ctx, '#4e3e3c', -27 + plank * 2, 7 + plank * 3, 27 - plank * 2, 7 + plank * 3, 1);
    [-20,-4,13,25].forEach(function(x) { rect(ctx, '#c39b68', x, 8, 1, 2); });
    rect(ctx, '#3c3540', -32, -12, 13, 12); rect(ctx, '#8f6b4d', -31, -11, 11, 10);
    rect(ctx, '#b99a6d', -32, -12, 13, 2); rect(ctx, '#37484b', -29, -8, 7, 4);
    rect(ctx, phase ? '#c6e0b5' : '#93b59b', -28, -7, 5, 2); rect(ctx, '#5d6557', -26, -8, 1, 4);
    for (var port = -1; port <= 1; port++) {
      oval(ctx, port * 16, 8, 5, 5, '#3a3b44'); oval(ctx, port * 16, 8, 4, 4, '#8b9691');
      oval(ctx, port * 16 + 1, 9, 3, 3, '#263c45'); rect(ctx, '#c4b996', port * 16 - 2, 5, 3, 1);
    }
    line(ctx, '#c7ae7b', -32, 1, 27, 1, 1);
    // Modest spectral keel lights do not add a collision or damage field.
    for (var wisp = -2; wisp <= 2; wisp++) {
      var x = wisp * 9, y = 18 + (wisp + frame + 4) % 3;
      line(ctx, '#496e69', x - 2, 16, x, y + 5, 3);
      line(ctx, phase ? '#b5d6b4' : '#82ad99', x - 1, 17, x, y + 3, 1);
    }
  }

  function mothron(ctx, phase, frame) {
    var flap = [0,4,0,-4][frame % 4], wing = phase ? '#d4c7a0' : '#b9b7a0';
    polygon(ctx, '#454055', [[2,1],[-7,-13],[-20,-27 + flap],[-34,-23 + flap],[-30,-9],[-16,5]]);
    polygon(ctx, wing, [[0,0],[-9,-12],[-20,-24 + flap],[-31,-21 + flap],[-27,-9],[-14,3]]);
    polygon(ctx, '#868394', [[-6,0],[-15,-9],[-27,-19 + flap],[-22,-9],[-12,2]]);
    line(ctx, '#e5d8b0', -4, -1, -27, -20 + flap, 1);
    line(ctx, '#776c83', -12, -5, -20, -23 + flap, 1);
    oval(ctx, -21, -13 + flap / 2, 6, 5, '#655971'); oval(ctx, -21, -13 + flap / 2, 4, 3, '#d8c79a');
    oval(ctx, -20, -13 + flap / 2, 2, 2, '#53546b'); rect(ctx, '#f2e4b7', -22, -15 + flap / 2, 1, 1);
    polygon(ctx, '#454055', [[2,0],[-13,4],[-27,21 - flap],[-10,22 - flap / 2],[6,9]]);
    polygon(ctx, wing, [[0,2],[-12,7],[-23,19 - flap],[-10,19 - flap / 2],[3,8]]);
    line(ctx, '#7c758d', 0, 6, -21, 18 - flap, 1);
    oval(ctx, -12, 13 - flap / 2, 5, 4, '#7b6c80'); oval(ctx, -12, 13 - flap / 2, 3, 2, '#d7c79f');
    rect(ctx, '#62617a', -12, 12 - flap / 2, 2, 2);
    // Fuzzy segmented body, curled legs and feathered antennae.
    oval(ctx, 1, 2, 13, 8, '#3e3b50'); oval(ctx, 0, 1, 11, 6, '#777587');
    for (var segment = -1; segment <= 1; segment++) {
      line(ctx, '#aca89c', segment * 5, -3, segment * 5 + 1, 5, 2);
      line(ctx, '#49485f', segment * 5 - 2, 1, segment * 5 - 1, 7, 1);
      line(ctx, '#6a687b', segment * 4 + 4, 6, segment * 4 + 1, 11, 1);
    }
    oval(ctx, 12, -1, 7, 7, '#464359'); oval(ctx, 11, -2, 5, 5, '#888294');
    oval(ctx, 15, -3, 3, 4, phase ? '#d58f8b' : '#c9bf8d'); rect(ctx, '#353b51', 16, -4, 1, 3);
    rect(ctx, '#f0e3b9', 14, -5, 1, 1);
    line(ctx, '#b7ad9b', 12, -6, 16, -13, 1); line(ctx, '#b7ad9b', 9, -6, 8, -13, 1);
    line(ctx, '#7e7890', 16, -12, 20, -12, 1); line(ctx, '#7e7890', 8, -12, 5, -13, 1);
    rect(ctx, '#aaa59a', 4, -6, 2, 2); rect(ctx, '#aaa59a', 8, 6, 2, 2);
  }

  function darkMage(ctx, phase, frame) {
    var bob = frame % 2, glow = phase ? '#d9e6b6' : '#a8c894';
    // A levitating carved disk separates this mage from the standing casters.
    oval(ctx, 0, 19, 17, 6, '#393445'); oval(ctx, -1, 18, 15, 4, '#7b7186');
    line(ctx, '#c2b7a9', -11, 16, 10, 16, 1);
    for (var rune = -2; rune <= 2; rune++) rect(ctx, '#b491be', rune * 5, 20 + bob, 2, 2);
    line(ctx, '#81628c', -7, 24, 7, 24, 1); rect(ctx, '#c6a6cf', -2, 25 + bob, 4, 1);
    polygon(ctx, '#302a40', [[-7,-10],[7,-10],[10,8],[12,16],[3,18],[-3,17],[-12,16],[-9,5]]);
    polygon(ctx, '#624266', [[-6,-9],[6,-9],[8,8],[10,14],[2,16],[-3,15],[-10,14],[-7,4]]);
    polygon(ctx, '#966482', [[-4,-8],[0,-8],[-1,14],[-7,13],[-5,2]]);
    line(ctx, '#d0a884', -5, -7, -3, 13, 1); line(ctx, '#b78e7d', 5, -7, 3, 13, 1);
    rect(ctx, '#b39879', -7, 4, 14, 2); rect(ctx, '#534256', -2, 3, 4, 4);
    rect(ctx, '#c5a3c5', -1, 4, 2, 2);
    oval(ctx, 0, -18, 9, 12, '#312d41'); oval(ctx, -1, -19, 7, 10, '#61516f');
    oval(ctx, 1, -18, 5, 7, '#2c3841');
    rect(ctx, glow, -2, -20, 2, 2); rect(ctx, glow, 3, -20, 2, 2);
    rect(ctx, '#829980', 0, -16, 3, 3); rect(ctx, '#cabd9d', 0, -16, 1, 1);
    line(ctx, '#a9998c', -7, -24, -3, -29, 2); line(ctx, '#a9998c', 7, -24, 10, -29, 2);
    polygon(ctx, '#867491', [[-7,-25],[-2,-31],[3,-29],[8,-25],[4,-24],[-3,-24]]);
    rect(ctx, '#dfc49f', -1, -28, 2, 2);
    line(ctx, '#353144', -6, -8, -14, -1, 7); line(ctx, '#8d6986', -6, -9, -14, -2, 4);
    // Open spellbook, with a visible spine and cream page edges.
    polygon(ctx, '#4a3a4c', [[-23,-7],[-16,-5],[-10,-8],[-10,0],[-16,3],[-23,0]]);
    polygon(ctx, '#d3c6a5', [[-22,-6],[-16,-4],[-11,-6],[-11,-1],[-16,1],[-22,-1]]);
    line(ctx, '#957c72', -16, -3, -16, 1, 1); rect(ctx, '#9d8a79', -21, -3, 3, 1);
    line(ctx, '#353144', 6, -8, 15, -6, 6); line(ctx, '#8d6986', 6, -9, 15, -7, 3);
    line(ctx, '#554553', 18, -22, 18, 16, 3); line(ctx, '#b7a27d', 18, -21, 18, 15, 1);
    oval(ctx, 18, -24, 6, 6, '#53445f'); oval(ctx, 18, -25, 4, 4, '#7f9e8e');
    oval(ctx, 18, -25, 2 + bob, 3, glow); rect(ctx, '#f1e5c5', 17, -27, 1, 2);
    rect(ctx, '#c6a27b', 14, -10, 4, 3);
  }

  function ogre(ctx, phase, frame) {
    var sway = [0,1,0,-1][frame % 4], skin = phase ? '#b4a180' : '#a69a7b';
    // Thick legs, belly and asymmetric armored shoulder.
    [-1,1].forEach(function(side) {
      var x = side < 0 ? -15 : 5;
      rect(ctx, '#3c383b', x, 14, 11, 13); rect(ctx, '#877c60', x + 1, 15, 9, 9);
      rect(ctx, '#b7a988', x + 2, 16, 4, 5); rect(ctx, '#5f5147', x - 1, 24 + side * sway, 13, 5);
      for (var toe = 0; toe < 3; toe++) rect(ctx, '#d0bb94', x + 1 + toe * 3, 26 + side * sway, 2, 2);
    });
    oval(ctx, 0, 1, 20, 23, '#3d393c'); oval(ctx, -1, 0, 18, 21, '#7c775d');
    oval(ctx, -3, 2, 14, 17, skin); oval(ctx, -4, 5, 9, 11, '#c2ad85');
    rect(ctx, '#766650', -4, 7, 3, 2);
    polygon(ctx, '#5a4642', [[-18,11],[17,11],[16,20],[7,24],[1,20],[-8,24],[-17,20]]);
    rect(ctx, '#b18d61', -17, 11, 33, 3); rect(ctx, '#d4b57b', -2, 10, 6, 5); rect(ctx, '#76614d', 0, 11, 3, 2);
    line(ctx, '#48413d', -15, -8, -23, 11 + sway, 11); line(ctx, '#a29470', -15, -9, -22, 9 + sway, 7);
    rect(ctx, '#cbb48a', -25, 9 + sway, 7, 4); rect(ctx, '#77664c', -24, 13 + sway, 6, 2);
    line(ctx, '#45403e', 16, -5, 24, 8 - sway, 11); line(ctx, skin, 16, -6, 23, 7 - sway, 7);
    oval(ctx, 2, -18, 14, 13, '#45413e'); oval(ctx, 1, -19, 12, 11, skin);
    polygon(ctx, '#82785d', [[-12,-25],[-6,-31],[4,-33],[13,-25],[8,-26],[1,-29],[-5,-27]]);
    rect(ctx, '#d4bd91', -6, -25, 14, 2);
    rect(ctx, '#5d5a4e', -6, -19, 5, 3); rect(ctx, '#5d5a4e', 5, -20, 5, 3);
    rect(ctx, phase ? '#efd2a1' : '#d4c090', -5, -19, 2, 1); rect(ctx, phase ? '#efd2a1' : '#d4c090', 6, -20, 2, 1);
    oval(ctx, 5, -14, 8, 5, '#b9a27a'); rect(ctx, '#685c4b', 1, -11, 12, 3);
    line(ctx, '#e5d1aa', 2, -10, 0, -15, 2); line(ctx, '#e5d1aa', 10, -10, 12, -16, 2);
    polygon(ctx, '#4c4850', [[-20,-15],[-13,-18],[-8,-14],[-10,-6],[-21,-5],[-25,-9]]);
    polygon(ctx, '#8d9491', [[-20,-14],[-14,-16],[-10,-13],[-12,-8],[-20,-7],[-23,-10]]);
    line(ctx, '#d1c8a5', -20, -13, -14, -14, 1); rect(ctx, '#c5b491', -22, -10, 2, 2);
    // Spiked wooden club is decoration; the real AI still emits its spit shot.
    line(ctx, '#4b3b3c', 23, 12 - sway, 32, -16 - sway, 5);
    line(ctx, '#a07d56', 23, 11 - sway, 32, -16 - sway, 3);
    oval(ctx, 32, -14 - sway, 7, 11, '#4b3b3c'); oval(ctx, 31, -15 - sway, 5, 9, '#8f6b4c');
    line(ctx, '#b79a6c', 29, -21 - sway, 28, -12 - sway, 1);
    [-1,1].forEach(function(side) { line(ctx, '#c1b38d', 32 + side * 4, -17 - sway, 32 + side * 9, -20 - sway, 2); });
    rect(ctx, '#c3aa7e', 21, 5 - sway, 6, 4);
    if (phase) line(ctx, '#55505a', -20, -12, -15, -8, 1);
  }

  function betsy(ctx, phase, frame) {
    var flap = [0,4,0,-4][frame % 4], scales = phase ? '#c57c60' : '#ac6657';
    // Two ribbed, torn wing membranes and a curling tail behind the body.
    polygon(ctx, '#493544', [[-7,2],[-16,-14],[-36,-29 + flap],[-31,-8],[-36,0],[-24,-1],[-20,8]]);
    polygon(ctx, '#a65b55', [[-9,1],[-18,-13],[-33,-25 + flap],[-28,-8],[-31,-3],[-22,-3],[-19,5]]);
    line(ctx, '#d49b78', -10, 0, -31, -24 + flap, 1); line(ctx, '#704451', -18, -9, -25, -3, 1);
    polygon(ctx, '#493544', [[2,0],[5,-16],[18,-33 - flap],[29,-26 - flap],[19,-15],[23,-9],[12,-8],[8,4]]);
    polygon(ctx, phase ? '#c58d70' : '#b37462', [[4,-1],[8,-16],[18,-30 - flap],[25,-25 - flap],[16,-14],[19,-11],[10,-10],[7,1]]);
    line(ctx, '#e3b085', 5, -1, 18, -29 - flap, 1); line(ctx, '#784852', 12, -15, 23, -24 - flap, 1);
    line(ctx, '#473441', -12, 6, -25, 15, 8); line(ctx, scales, -12, 5, -25, 13, 5);
    line(ctx, '#473441', -25, 15, -37, 9 + frame % 2, 5); line(ctx, '#c78b69', -25, 13, -36, 8 + frame % 2, 2);
    polygon(ctx, '#aab08b', [[-35,8],[-40,2],[-40,11],[-36,12]]);
    oval(ctx, 0, 3, 19, 13, '#493744'); oval(ctx, -1, 2, 17, 11, scales);
    oval(ctx, 2, 8, 13, 6, phase ? '#dfb084' : '#bf9a78');
    for (var rib = -2; rib <= 2; rib++) line(ctx, '#8d6257', rib * 4, 7, rib * 4 + 2, 12, 1);
    for (var spike = -2; spike <= 2; spike++) polygon(ctx, '#b6ae84', [[spike * 5 - 2,-7],[spike * 5,-13],[spike * 5 + 2,-7]]);
    [-1,1].forEach(function(side) {
      var x = side < 0 ? -6 : 10;
      line(ctx, '#5a3c46', x, 9, x + 3, 19, 6); line(ctx, '#c17e62', x, 9, x + 3, 17, 3);
      for (var claw = 0; claw < 3; claw++) rect(ctx, '#dac69e', x + claw * 2, 18 + claw % 2, 2, 2);
    });
    line(ctx, '#493744', 13, 1, 20, -10, 13); line(ctx, scales, 13, 0, 20, -10, 9);
    oval(ctx, 23, -10, 10, 9, '#4e3743'); oval(ctx, 22, -11, 8, 7, scales);
    oval(ctx, 29, -7, 9, 5, '#62424a'); oval(ctx, 28, -8, 8, 3, '#c68c6a');
    rect(ctx, '#483b46', 33, -10, 2, 2); line(ctx, '#47313e', 22, -5, 36, -5, 1);
    rect(ctx, '#e0c79b', 27, -5, 2, 2); rect(ctx, '#e0c79b', 32, -5, 2, 2);
    oval(ctx, 25, -14, 4, 4, '#56404b'); oval(ctx, 26, -14, 2, 3, phase ? '#f4c18b' : '#d8bd86');
    rect(ctx, '#3b3542', 26, -15, 1, 3); rect(ctx, '#f1dfb7', 25, -16, 1, 1);
    line(ctx, '#d6bf92', 18, -15, 17, -24, 3); line(ctx, '#f0d5a2', 17, -23, 13, -26, 1);
    line(ctx, '#c6b08a', 29, -16, 31, -21, 2);
  }

  var enemyKinds = ['junglebat','hornet','mosshornet','tortoise','flyingsnake','pixie','unicorn','gastropod','chaoselemental',
    'eaterofsouls','corruptor','crimera','ichorsticker','icebat','snowflinx','icetortoise','wolf',
    'antlion','antlioncharger','antlionswarmer','vulture','mummy','lightmummy','darkmummy','bloodmummy',
    'skeletonarcher','armoredbones','undeadminer','giantbat','cursedskull','darkcaster','angrybones','dungeonslime',
    'hellbat','demon','voodoodemon','fireimp','lavaslime','lavabat','reddevil'];
  function enemyKind(type) {
    return enemyKinds[[E.JUNGLEBAT,E.HORNET,E.MOSSHORNET,E.GIANTTORTOSE,E.FLYINGSNAKE,E.PIXIE,E.UNICORN,E.GASTROPOD,E.CHAOSELEMENTAL,
      E.EATEROFSOULS,E.CORRUPTOR,E.CRIMERA,E.ICHORSTICKER,E.ICEBAT,E.SNOWFLINX,E.ICETORTOISE,E.WOLF,
      E.ANTLION,E.ANTLIONCHARGER,E.ANTLIONSWARMER,E.VULTURE,E.MUMMY,E.LIGHTMUMMY,E.DARKMUMMY,E.BLOODMUMMY,
      E.SKELETONARCHER,E.ARMOREDBONES,E.UNDEADMINER,E.GIANTBAT,E.CURSEDSKULL,E.DARKCASTER,E.ANGRYBONES,E.DUNGEONSLIME,
      E.HELLBAT,E.DEMON,E.VOODOODEMON,E.FIREIMP,E.LAVASLIME,E.LAVABAT,E.REDDEVIL].indexOf(type)] || null;
  }
  function enemySprite(kind,frame,active,flash) {
    if (enemyKinds.indexOf(kind) < 0) return null;
    return remember('enemy:' + [kind,frame,!!active,!!flash].join(':'),function() {
      var c = surface(96,96), ctx = c.getContext('2d'); ctx.translate(48,48);
      var flap = [0,4,0,-4][frame % 4], stride = [0,2,0,-2][frame % 4];
      if (kind === 'junglebat') {
        // Rust fur, ribbed leather membranes and long leaf-shaped ears.
        for (var side = -1; side <= 1; side += 2) {
          polygon(ctx,INK,[[side * 3,-3],[side * 11,-14 - flap],[side * 24,-7 - flap],[side * 18,1],[side * 13,-1],[side * 9,6],[side * 4,4]]);
          polygon(ctx,'#936451',[[side * 4,-3],[side * 11,-11 - flap],[side * 21,-7 - flap],[side * 17,-1],[side * 13,-3],[side * 8,3]]);
          line(ctx,'#c09372',side * 5,-3,side * 11,-11 - flap,1);
          line(ctx,'#614752',side * 10,-8 - flap,side * 13,-2,1);
          line(ctx,'#614752',side * 10,-8 - flap,side * 17,-1,1);
        }
        oval(ctx,0,1,6,8,INK); oval(ctx,0,0,4,6,'#99694f'); oval(ctx,1,2,2,4,'#c29671');
        polygon(ctx,INK,[[-5,-5],[-7,-17],[-2,-12],[0,-6]]);
        polygon(ctx,'#c29671',[[-4,-7],[-5,-14],[-2,-11]]);
        polygon(ctx,INK,[[1,-6],[4,-17],[7,-15],[6,-5]]);
        polygon(ctx,'#b88167',[[3,-7],[5,-14],[5,-7]]);
        oval(ctx,1,-5,6,5,'#77524e'); rect(ctx,'#e5c18b',-3,-7,3,2); rect(ctx,'#e5c18b',3,-7,3,2);
        rect(ctx,'#373746',-2,-7,1,2); rect(ctx,'#373746',4,-7,1,2);
        rect(ctx,'#cf9d7e',0,-3,3,2); rect(ctx,'#ead8b1',-1,0,1,2); rect(ctx,'#ead8b1',3,0,1,2);
        rect(ctx,'#c7aa88',-4,7,2,2); rect(ctx,'#c7aa88',3,7,2,2);
      } else if (kind === 'hornet' || kind === 'mosshornet') {
        var moss = kind === 'mosshornet', shell = moss ? '#829967' : '#bd955a';
        for (var side = -1; side <= 1; side += 2) {
          polygon(ctx,'#536575',[[0,-3],[side * 7,-17 - flap],[side * 15,-13 - flap],[side * 9,-3]]);
          polygon(ctx,moss ? '#b7c6b0' : '#c5d3c6',[[side * 2,-4],[side * 8,-14 - flap],[side * 12,-12 - flap],[side * 8,-5]]);
          line(ctx,'#e0dfc2',side * 5,-7,side * 9,-13 - flap,1);
        }
        for (var leg = -1; leg <= 1; leg++) {
          line(ctx,'#55494a',leg * 5,2,leg * 5 - 3,8 + frame % 2,2);
          line(ctx,'#b5a27a',leg * 5 - 3,8 + frame % 2,leg * 5 + 1,10,1);
        }
        polygon(ctx,INK,[[-11,-1],[-22,4],[-12,6]]);
        polygon(ctx,'#c9ba8b',[[-13,0],[-20,4],[-12,4]]);
        oval(ctx,-5,0,11,8,INK); oval(ctx,-5,-1,9,6,shell);
        for (var band = -12; band <= -1; band += 5) {
          line(ctx,moss ? '#475b50' : '#665148',band,-5,band + 3,4,3);
          rect(ctx,moss ? '#bac391' : '#dfc485',band,-5,2,1);
        }
        oval(ctx,5,-2,7,7,INK); oval(ctx,5,-3,5,5,moss ? '#819d6a' : '#b89765');
        oval(ctx,11,-3,5,5,moss ? '#94ab70' : '#d0ad74');
        oval(ctx,13,-5,3,3,moss ? '#ced8ad' : '#ecd7a0'); rect(ctx,'#414650',14,-6,1,3);
        line(ctx,'#4c4c48',14,-1,18,1,1); line(ctx,'#4c4c48',17,1,18,-1,1);
        line(ctx,'#c0b58d',9,-7,12,-12,1); rect(ctx,'#d6cca3',12,-13,2,2);
        if (moss) {
          // Actual moss tufts change the silhouette, rather than recoloring a hornet.
          polygon(ctx,'#465b4e',[[-14,-4],[-17,-10],[-11,-8],[-8,-12],[-5,-7],[-2,-10],[1,-5]]);
          line(ctx,'#a3b481',-12,-7,-10,-5,2); rect(ctx,'#c5c79a',-6,-8,2,2);
          rect(ctx,'#6d8059',-15,2,3,3);
        }
        if (active) { rect(ctx,moss ? '#d2dda8' : '#f0d29a',-9,-2,3,2); rect(ctx,'#eee0b2',-4,-4,2,1); }
      } else if (kind === 'tortoise') {
        // Charge pose retracts the existing limbs; it never invents spin/jump AI.
        if (!active) {
          line(ctx,'#455147',-8,3,-10 - stride,9,5); line(ctx,'#93a276',-8,3,-10 - stride,8,3);
          line(ctx,'#455147',8,3,10 + stride,9,5); line(ctx,'#b0b78a',8,3,10 + stride,8,3);
          rect(ctx,'#c7c29b',-12 - stride,9,5,2); rect(ctx,'#c7c29b',9 + stride,9,5,2);
          line(ctx,'#687d56',-11,3,-19,5,3);
        }
        oval(ctx,-1,-1,16,11,INK); oval(ctx,-1,-2,14,9,'#647653');
        oval(ctx,-3,-4,10,6,'#91a171');
        polygon(ctx,'#b6b88a',[[-6,-8],[0,-10],[6,-7],[3,-3],[-3,-3]]);
        line(ctx,'#4e624e',-3,-3,-9,2,1); line(ctx,'#4e624e',3,-3,9,2,1);
        line(ctx,'#4e624e',-9,-6,-9,2,1); line(ctx,'#4e624e',8,-5,9,2,1);
        line(ctx,'#455447',-12,3,11,3,2); line(ctx,'#b7b28a',-12,5,10,5,1);
        if (active) {
          rect(ctx,'#b4b38c',11,1,3,3); rect(ctx,'#d3c59b',11,1,1,1);
          line(ctx,'#768967',-23, -4 + frame % 2,-19,-4 + frame % 2,1);
          line(ctx,'#a7af80',-22,3 - frame % 2,-19,3 - frame % 2,1);
        } else {
          oval(ctx,14,2,7,5,INK); oval(ctx,14,1,5,3,'#a0ad7a');
          rect(ctx,'#e0d5a8',16,-1,2,2); rect(ctx,'#404b43',17,-1,1,2);
          rect(ctx,'#687451',18,3,3,1); rect(ctx,'#c1bb8f',11,3,5,1);
        }
      } else if (kind === 'flyingsnake') {
        // A single feathered serpent: decorative bends are not worm segments.
        var bend = [0,2,0,-2][frame % 4];
        line(ctx,INK,-4,2,-16,6 + bend,7); line(ctx,'#63886a',-4,1,-16,5 + bend,4);
        line(ctx,INK,-16,6 + bend,-25,1 + bend,4); line(ctx,'#a4b982',-16,5 + bend,-25,bend,2);
        for (var side = -1; side <= 1; side += 2) {
          polygon(ctx,'#354c52',[[side * 3,-2],[side * 9,-16 - flap],[side * 23,-12 - flap],[side * 18,-5],[side * 14,-7],[side * 11,0]]);
          polygon(ctx,'#739b8a',[[side * 4,-3],[side * 10,-13 - flap],[side * 20,-11 - flap],[side * 17,-7],[side * 13,-9],[side * 10,-2]]);
          line(ctx,'#c0bf8e',side * 5,-4,side * 10,-13 - flap,1);
          line(ctx,'#aec1a4',side * 10,-9,side * 17,-10 - flap,1);
        }
        oval(ctx,0,2,12,6,INK); oval(ctx,0,1,10,4,'#769b70');
        line(ctx,'#d2c79a',-7,4,8,4,2);
        for (var scale = -6; scale <= 5; scale += 4) rect(ctx,'#4e735b',scale,-1,2,2);
        line(ctx,INK,9,0,13,-6,8); line(ctx,'#93b27c',9,-1,13,-7,5);
        oval(ctx,15,-6,7,5,INK); oval(ctx,15,-7,5,3,'#a6bd85');
        rect(ctx,'#b9c998',17,-5,7,3); rect(ctx,'#48634f',21,-5,2,1);
        rect(ctx,'#e6d6a2',16,-9,3,2); rect(ctx,'#35434b',18,-9,1,2);
        line(ctx,'#6f5152',21,-2,25,-1,1);
        polygon(ctx,'#ac9569',[[10,-10],[10,-18],[13,-14],[16,-17],[18,-10]]);
        rect(ctx,'#d7c08e',11,-15,1,4); rect(ctx,'#c8bd8b',15,-13,1,3);
      } else if (kind === 'pixie') {
        // A tiny golden fairy, with four filled wing lobes rather than an orb.
        for (var side = -1; side <= 1; side += 2) {
          polygon(ctx,'#8b7b70',[[side * 2,-3],[side * 9,-13 - flap / 2],[side * 15,-8 - flap / 2],[side * 8,0]]);
          polygon(ctx,'#e0cf9c',[[side * 3,-3],[side * 9,-10 - flap / 2],[side * 12,-8 - flap / 2],[side * 7,-2]]);
          polygon(ctx,'#9e8d7e',[[side * 3,-1],[side * 12,2 + flap / 2],[side * 9,9],[side * 3,4]]);
          polygon(ctx,'#f1dfb0',[[side * 4,0],[side * 10,3 + flap / 2],[side * 8,6],[side * 4,3]]);
          line(ctx,'#f9edcb',side * 4,-4,side * 9,-8 - flap / 2,1);
        }
        oval(ctx,0,-6,4,5,'#70565a'); oval(ctx,0,-7,3,3,'#e6c799');
        rect(ctx,'#e7cf83',-3,-11,6,3); rect(ctx,'#fff0bd',-2,-11,3,1);
        rect(ctx,'#4d4856',1,-8,1,1); rect(ctx,'#c79d79',2,-5,2,1);
        polygon(ctx,'#a78560',[[-2,-3],[2,-3],[4,5],[0,7],[-4,4]]);
        polygon(ctx,'#ead3a0',[[-1,-2],[1,-2],[2,4],[-2,4]]);
        line(ctx,'#f4e3b8',-2,-1,-5,2,1); line(ctx,'#f4e3b8',2,-1,5,0,1);
        rect(ctx,'#d7ba8c',-2,6,1,3); rect(ctx,'#f0d9aa',1,6,1,3);
        var spark = [-1,1,0,1][frame % 4];
        rect(ctx,'#f2e5b2',-14,5 + spark,1,3); rect(ctx,'#f2e5b2',-15,6 + spark,3,1);
        rect(ctx,'#d2bd8e',13,-3 - spark,1,1);
      } else if (kind === 'unicorn') {
        var step = active ? stride * 2 : stride / 2;
        // Four articulated legs, dark hooves and a pastel mane/tail.
        line(ctx,INK,-11,3,-12 - step,13,5); line(ctx,'#b2acb0',-11,3,-12 - step,12,3);
        line(ctx,INK,6,3,8 + step,13,5); line(ctx,'#b2acb0',6,3,8 + step,12,3);
        rect(ctx,'#77727f',-14 - step,13,5,2); rect(ctx,'#77727f',6 + step,13,5,2);
        polygon(ctx,'#65596f',[[-15,-5],[-23,-7 + frame % 2],[-26,1],[-22,7],[-20,1],[-19,-3]]);
        line(ctx,'#b79ab0',-18,-5,-23,2 + frame % 2,3); line(ctx,'#dcc4c6',-19,-5,-22,-1,1);
        oval(ctx,-2,-1,17,10,INK); oval(ctx,-3,-2,15,8,'#d9d1c6');
        oval(ctx,-5,-4,10,5,'#f0e7d0'); line(ctx,'#b4abb1',-13,4,8,5,1);
        line(ctx,INK,-8,4,-7 + step,13,5); line(ctx,'#e8dfcb',-8,4,-7 + step,12,3);
        line(ctx,INK,9,2,12 - step,13,5); line(ctx,'#f0e7d0',9,2,12 - step,12,3);
        rect(ctx,'#766c80',-9 + step,13,5,2); rect(ctx,'#766c80',10 - step,13,5,2);
        polygon(ctx,INK,[[7,-3],[8,-17],[15,-20],[22,-13],[19,-2]]);
        polygon(ctx,'#e9e0cb',[[9,-4],[10,-16],[15,-18],[20,-12],[17,-2]]);
        polygon(ctx,'#9f91ab',[[8,-15],[5,-11],[6,-4],[10,-1],[11,-8],[14,-15]]);
        line(ctx,'#d3b8bd',8,-12,9,-5,2); line(ctx,'#a8b9c0',10,-13,11,-8,1);
        oval(ctx,18,-14,7,5,INK); oval(ctx,18,-15,5,3,'#f1e7cf');
        rect(ctx,'#d5cbbd',19,-12,8,4); rect(ctx,'#a6a2a8',25,-11,1,1);
        rect(ctx,'#4a4557',19,-16,2,2); rect(ctx,'#f9f0d4',19,-16,1,1);
        polygon(ctx,'#b0a4ad',[[12,-18],[11,-25],[16,-20]]);
        polygon(ctx,'#cbb581',[[20,-18],[24,-31],[25,-18]]);
        line(ctx,'#f0d9a0',22,-21,24,-28,1);
        if (active) { line(ctx,'#eee4cf',-27,4,-23,4,1); rect(ctx,'#beaec0',-21,11,2,1); }
      } else if (kind === 'gastropod') {
        // Shaded coral shell, stepped spiral and a mint-colored flying foot.
        oval(ctx,0,6,16,5,INK); oval(ctx,1,5,14,3,'#8ea89e');
        line(ctx,'#c6ccac',-11,4,14,4,1);
        for (var fold = -10; fold <= 10; fold += 5) rect(ctx,'#6d8e88',fold,7 + (frame + fold + 12) % 2,3,1);
        oval(ctx,-4,-2,13,11,INK); oval(ctx,-5,-3,11,9,'#b4868c');
        oval(ctx,-7,-5,7,6,'#d4aaa4');
        var spiral = [[-13,-1],[-12,-7],[-6,-11],[1,-9],[5,-4],[3,2],[-2,5],[-7,2],[-8,-2],[-5,-5],[-2,-4],[-1,-1],[-4,0]];
        for (var n = 1; n < spiral.length; n++) line(ctx,'#776176',spiral[n - 1][0],spiral[n - 1][1],spiral[n][0],spiral[n][1],2);
        line(ctx,'#edcbb2',-10,-7,-6,-9,1); line(ctx,'#dfbda9',0,-7,3,-3,1);
        oval(ctx,10,2,7,5,'#95b4a3'); line(ctx,'#5b7c79',7,0,7,-9,3);
        line(ctx,'#b7c8ad',7,-1,7,-9,1); line(ctx,'#5b7c79',12,0,15,-8,3);
        line(ctx,'#cad6b6',12,-1,15,-8,1);
        oval(ctx,7,-11,3,3,'#566474'); oval(ctx,7,-11,2,2,'#d4dbb9');
        oval(ctx,16,-10,4,4,'#566474'); oval(ctx,16,-10,3,3,active ? '#f5dfc0' : '#d5deb8');
        rect(ctx,active ? '#bd7e96' : '#536371',17,-11,1,3); rect(ctx,'#f4ead0',15,-12,1,1);
        line(ctx,'#698b80',11,4,17,4,1);
        if (active) { rect(ctx,'#efd1b3',19,-10,2,1); rect(ctx,'#cba3b0',17,-15,1,2); }
      } else if (kind === 'chaoselemental') {
        // A faceted humanoid with a broken cape and luminous crystal seams.
        polygon(ctx,'#50445f',[[-7,-7],[-12,-2],[-11,13],[-4,7],[2,11],[7,4],[7,-7]]);
        polygon(ctx,active ? '#b2a1c6' : '#857397',[[-6,-6],[-9,-1],[-9,9],[-4,5],[1,7],[5,3],[5,-5]]);
        line(ctx,'#54485e',-3,4,-5 - stride / 2,12,4); line(ctx,'#b6a6bd',-3,4,-5 - stride / 2,11,2);
        line(ctx,'#54485e',3,4,5 + stride / 2,12,4); line(ctx,'#d2c1ca',3,4,5 + stride / 2,11,2);
        rect(ctx,'#ddd1cb',-7 - stride / 2,12,4,2); rect(ctx,'#ddd1cb',4 + stride / 2,12,4,2);
        polygon(ctx,INK,[[-6,-8],[5,-8],[7,3],[1,7],[-6,3]]);
        polygon(ctx,'#ab95b1',[[-4,-7],[4,-7],[5,2],[0,5],[-4,2]]);
        polygon(ctx,active ? '#e3d8d4' : '#c9b4c5',[[-3,-6],[1,-5],[0,2],[-3,1]]);
        line(ctx,'#eee6d6',0,-5,2,2,1); rect(ctx,'#6b577c',-1,-2,4,2);
        line(ctx,'#685473',-6,-5,-10,2 + frame % 2,4); line(ctx,'#bca6bc',-6,-5,-10,1 + frame % 2,2);
        line(ctx,'#76607f',5,-5,10,-1 - frame % 2,4); line(ctx,'#d5c5cd',5,-5,10,-2 - frame % 2,2);
        polygon(ctx,INK,[[-5,-14],[0,-18],[6,-14],[5,-8],[-3,-7]]);
        polygon(ctx,'#b9a4ba',[[-3,-13],[0,-16],[4,-13],[3,-9],[-2,-9]]);
        rect(ctx,'#54475e',0,-13,4,2); rect(ctx,active ? '#f4ebd5' : '#e1d3bc',2,-13,2,1);
        line(ctx,'#e0d2cb',-1,-15,0,-11,1);
        if (active) { rect(ctx,'#b5a3c4',-13,-5 + frame % 2,2,3); rect(ctx,'#dfd0d0',12,6 - frame % 2,1,3); }
      } else if (kind === 'eaterofsouls') {
        // An airborne chitin maw: hooked fins and an asymmetric toothed head.
        for (var side = -1; side <= 1; side += 2) {
          polygon(ctx,INK,[[-5,side * 2],[-15,side * (12 + flap / 2)],[-24,side * (9 + flap / 2)],[-17,side * 2],[-13,-side * 1]]);
          polygon(ctx,'#776582',[[-6,side * 3],[-15,side * (10 + flap / 2)],[-21,side * (8 + flap / 2)],[-15,side * 3]]);
          line(ctx,'#b09ab1',-7,side * 3,-17,side * (8 + flap / 2),1);
          polygon(ctx,'#97849c',[[2,side * 4],[-2,side * (14 - flap / 2)],[5,side * 8]]);
        }
        oval(ctx,-3,0,11,8,INK); oval(ctx,-4,-1,9,6,'#6e5c7c');
        for (var plate = -2; plate <= 0; plate++) line(ctx,'#a58ba4',plate * 4,-5,plate * 4 + 1,4,1);
        oval(ctx,7,-1,8,7,INK); oval(ctx,7,-2,6,5,'#97809b');
        rect(ctx,'#c6c4a2',7,-5,4,2); rect(ctx,'#3c3d4d',9,-5,1,2);
        polygon(ctx,'#4d3b50',[[10,-1],[18,-2],[17,5],[10,5]]);
        polygon(ctx,'#e1cfb0',[[11,-2],[18,-4],[15,0],[11,1]]);
        polygon(ctx,'#b6a3a5',[[10,5],[17,6],[14,9],[9,6]]);
        rect(ctx,'#dfcfb2',12,4,2,3); rect(ctx,'#dfcfb2',15,3,1,2);
      } else if (kind === 'corruptor') {
        // Broader armored abdomen, swept barbs and a cursed-flame throat sac.
        polygon(ctx,INK,[[-10,0],[-21,-8 - flap],[-18,0],[-24,7 + flap / 2],[-11,5]]);
        polygon(ctx,'#805a78',[[-11,0],[-18,-5 - flap],[-16,1],[-20,5 + flap / 2],[-10,3]]);
        polygon(ctx,INK,[[-3,-4],[-11,-18 - flap / 2],[0,-13],[6,-5]]);
        polygon(ctx,'#9f7896',[[-3,-5],[-8,-14 - flap / 2],[0,-11],[4,-5]]);
        line(ctx,'#c0a3b4',-4,-6,-7,-12 - flap / 2,1);
        polygon(ctx,'#72516c',[[-3,5],[-8,14 + flap / 2],[3,10],[8,4]]);
        oval(ctx,-2,0,14,10,INK); oval(ctx,-3,-1,12,8,'#805672');
        for (var rib = -10; rib <= 0; rib += 5) {
          line(ctx,'#b2889e',rib,-6,rib + 2,5,2);
          polygon(ctx,'#c0aba8',[[rib,-6],[rib - 1,-11],[rib + 3,-7]]);
        }
        oval(ctx,7,3,7,active ? 7 : 5,active ? '#9daa76' : '#9a7a8b');
        oval(ctx,7,-3,9,6,'#5c435d'); oval(ctx,8,-4,7,4,'#ba91a5');
        rect(ctx,'#d2cd9e',9,-6,4,2); rect(ctx,'#454453',11,-6,1,2);
        polygon(ctx,'#44394c',[[10,-1],[20,-2],[18,5],[9,5]]);
        line(ctx,'#dfcab0',12,-2,20,-3,2); line(ctx,'#c4b4a5',10,6,18,6,2);
        rect(ctx,'#e4d0ac',15,-2,2,3); rect(ctx,'#e4d0ac',13,4,2,3);
        if (active) { rect(ctx,'#d9dea4',17,1,2,2); rect(ctx,'#c1cb8e',9,4,3,2); }
      } else if (kind === 'crimera') {
        // Veined fan wings and a curled tail distinguish this crimson flyer.
        for (var side = -1; side <= 1; side += 2) {
          polygon(ctx,INK,[[0,-2],[side * 8,-14 - flap / 2],[side * 22,-10 - flap / 2],[side * 16,-3],[side * 13,-5],[side * 7,4]]);
          polygon(ctx,'#aa6d70',[[side * 2,-3],[side * 8,-11 - flap / 2],[side * 19,-9 - flap / 2],[side * 14,-5],[side * 12,-7],[side * 6,1]]);
          line(ctx,'#d6a08f',side * 3,-3,side * 8,-10 - flap / 2,1);
          line(ctx,'#834d60',side * 8,-8 - flap / 2,side * 14,-5,1);
        }
        line(ctx,INK,-5,3,-16,8 + stride / 2,5); line(ctx,'#bd7b78',-5,2,-16,7 + stride / 2,3);
        line(ctx,'#cba08a',-16,7 + stride / 2,-21,3 + stride / 2,2);
        oval(ctx,-1,1,11,8,INK); oval(ctx,0,0,9,6,'#b16f74');
        for (var fold = -6; fold <= 1; fold += 4) line(ctx,'#d49b8d',fold,-3,fold + 1,5,1);
        oval(ctx,8,-2,7,6,'#70475a'); oval(ctx,9,-3,5,4,'#d3a092');
        rect(ctx,'#ead3ad',9,-5,3,2); rect(ctx,'#6b3e50',11,-5,1,2);
        polygon(ctx,'#764255',[[12,-1],[19,0],[15,5],[10,4]]);
        rect(ctx,'#e7ceb0',12,0,2,3); rect(ctx,'#d0b4a0',14,3,2,2);
        polygon(ctx,'#b47c79',[[4,-6],[3,-13],[8,-7]]);
      } else if (kind === 'ichorsticker') {
        // Walking jointed legs support a swollen amber sac and a siphon snout.
        for (var leg = -1; leg <= 1; leg++) {
          var lx = leg * 6;
          line(ctx,INK,lx,1,lx - 3 + stride / 2,7,3);
          line(ctx,'#9e9a64',lx,1,lx - 3 + stride / 2,6,1);
          line(ctx,'#5b5e48',lx - 3 + stride / 2,7,lx + 1 + stride,11,2);
          rect(ctx,'#cec58d',lx + stride,11,3,1);
        }
        oval(ctx,-3,-3,11,9,INK); oval(ctx,-4,-4,9,7,active ? '#b6a45c' : '#b8b36e');
        oval(ctx,-5,-6,6,4,'#ded0a0');
        line(ctx,'#847c50',-9,-4,-7,1,1); line(ctx,'#847c50',-3,-8,0,1,1);
        rect(ctx,'#ecdda9',-8,-8,3,1); rect(ctx,'#d3bf76',-3,-3,3,3);
        polygon(ctx,'#657451',[[-12,-6],[-15,-12],[-9,-10],[-6,-15],[-2,-10],[2,-12],[5,-5]]);
        line(ctx,'#bbc38c',-8,-10,-6,-7,1); rect(ctx,'#d1c68c',-2,-10,2,2);
        oval(ctx,7,-5,7,6,'#69724f'); oval(ctx,8,-6,5,4,'#b9c17f');
        rect(ctx,'#e9d7a3',8,-8,3,2); rect(ctx,'#48553e',10,-8,1,2);
        line(ctx,'#485342',11,-4,19,-6,3); line(ctx,'#d9cc8c',12,-5,19,-7,1);
        rect(ctx,active ? '#ece09e' : '#9aa465',18,-7,3,3);
        if (active) { rect(ctx,'#cdb86a',11,-2,2,3); rect(ctx,'#ead393',11,1,1,2); }
      } else if (kind === 'icebat') {
        // Frost-veined angular membranes and short ears, not a blue Jungle Bat.
        for (var side = -1; side <= 1; side += 2) {
          polygon(ctx,INK,[[side * 3,-2],[side * 10,-12 - flap],[side * 25,-8 - flap],[side * 20,-1],[side * 16,-3],[side * 12,4],[side * 7,1]]);
          polygon(ctx,'#81a6bd',[[side * 4,-3],[side * 11,-10 - flap],[side * 22,-7 - flap],[side * 18,-3],[side * 15,-5],[side * 11,1],[side * 7,-1]]);
          polygon(ctx,'#bed4dc',[[side * 5,-3],[side * 11,-9 - flap],[side * 17,-7 - flap],[side * 10,-4]]);
          line(ctx,'#e6ebdf',side * 4,-3,side * 11,-9 - flap,1);
          line(ctx,'#577e9b',side * 11,-7 - flap,side * 12,1,1);
          rect(ctx,'#e0e6dd',side * 19,-7 - flap,2,1);
        }
        polygon(ctx,'#6a8097',[[-4,4],[-2,10],[2,6],[5,8],[5,3]]);
        oval(ctx,0,0,6,7,INK); oval(ctx,0,-1,4,5,'#b5cad2');
        line(ctx,'#e0e5dc',-1,-3,-1,3,2);
        polygon(ctx,INK,[[-5,-4],[-7,-12],[-2,-10],[0,-5],[3,-12],[7,-10],[6,-3]]);
        polygon(ctx,'#93b5c7',[[-4,-6],[-5,-10],[-2,-8],[0,-4],[4,-10],[5,-8],[4,-4]]);
        oval(ctx,2,-4,6,4,'#c4d7da');
        rect(ctx,'#6a8097',1,-5,6,2); rect(ctx,'#dfcca2',2,-5,2,1); rect(ctx,'#ede2b8',6,-5,1,1);
        rect(ctx,'#667589',5,-2,4,2); rect(ctx,'#f2ead5',4,0,1,2); rect(ctx,'#f2ead5',7,0,1,2);
      } else if (kind === 'snowflinx') {
        // A low shaggy runner. The raised ruff/tucked feet follow its real jump.
        var lift = active ? 2 : 0, foot = active ? -2 : stride;
        line(ctx,'#687283',-7,5,-9 - foot,10 - lift,4); line(ctx,'#a6b4bf',-7,4,-9 - foot,9 - lift,2);
        line(ctx,'#687283',6,5,8 + foot,10 - lift,4);
        rect(ctx,'#c9d2d1',-12 - foot,10 - lift,6,2); rect(ctx,'#e0e1d7',6 + foot,10 - lift,6,2);
        polygon(ctx,INK,[[-14,-2],[-17,-7 - lift],[-12,-7],[-13,-12],[-7,-10],[-4,-15 - lift],[0,-12],[5,-14],[8,-10],[13,-11],[12,-5],[16,-2],[13,3],[15,7],[9,9],[5,7],[0,10],[-5,8],[-12,9],[-11,4],[-15,4]]);
        polygon(ctx,'#b0bec8',[[-12,-3],[-14,-5 - lift],[-10,-5],[-10,-10],[-6,-8],[-3,-12 - lift],[1,-10],[5,-11],[7,-7],[11,-8],[10,-3],[13,0],[10,3],[12,6],[8,7],[5,5],[0,7],[-5,6],[-10,7],[-9,2],[-12,2]]);
        oval(ctx,-1,-2,10,8,'#d9dedb'); oval(ctx,-3,-4,6,5,'#f0ede0');
        for (var tuft = -8; tuft <= 4; tuft += 4) {
          line(ctx,'#f4f0e2',tuft,-7,tuft - 1,-4,1); line(ctx,'#a1b3c2',tuft,3,tuft - 1,5,1);
        }
        polygon(ctx,'#e8e8dd',[[4,-9],[8,-12 - lift],[9,-6],[13,-4],[12,3],[5,5],[2,0]]);
        rect(ctx,'#8396a6',5,-5,6,2); rect(ctx,'#3f485a',6,-5,2,2); rect(ctx,'#f7e6ba',6,-5,1,1);
        oval(ctx,11,0,5,3,'#c3c3bb'); rect(ctx,'#79636b',13,-2,3,2);
        line(ctx,'#8b8390',9,3,13,3,1); rect(ctx,'#f3eddd',10,3,1,2);
      } else if (kind === 'icetortoise') {
        // Crystal ridges change the shell silhouette; they are never hit targets.
        if (!active) {
          line(ctx,'#4e657e',-8,3,-10 - stride,8,5); line(ctx,'#8eaebc',-8,3,-10 - stride,8,3);
          line(ctx,'#4e657e',7,3,9 + stride,8,5); line(ctx,'#b2c9cd',7,3,9 + stride,8,3);
          rect(ctx,'#e4e3cf',-12 - stride,9,5,1); rect(ctx,'#e4e3cf',8 + stride,9,5,1);
          line(ctx,'#789bad',-11,3,-19,4,3);
        }
        polygon(ctx,INK,[[-17,3],[-16,-4],[-12,-10],[-7,-9],[-5,-15],[0,-11],[5,-15],[8,-9],[13,-7],[16,1],[12,6],[-11,6]]);
        polygon(ctx,'#668aa5',[[-15,2],[-13,-4],[-10,-8],[-5,-7],[-4,-12],[0,-8],[5,-12],[7,-6],[11,-5],[14,0],[10,4],[-10,4]]);
        polygon(ctx,'#b6d3da',[[-11,-4],[-6,-7],[-4,-11],[0,-7],[5,-11],[6,-4],[2,0],[-5,-1]]);
        line(ctx,'#eff1e0',-4,-11,-3,-5,1); line(ctx,'#eff1e0',5,-11,4,-5,1);
        line(ctx,'#4d7595',-5,-1,-10,3,1); line(ctx,'#4d7595',2,0,7,3,1);
        rect(ctx,'#d2e1db',-12,3,23,2); line(ctx,'#7a96ac',-10,5,10,5,1);
        if (active) {
          rect(ctx,'#b4ccd0',11,1,3,2); rect(ctx,'#f1dfb2',12,1,1,1);
          line(ctx,'#93b8cc',-24,-3 + frame % 2,-20,-3 + frame % 2,1);
          line(ctx,'#d2e1dd',-23,4 - frame % 2,-19,4 - frame % 2,1);
        } else {
          oval(ctx,14,2,6,4,INK); oval(ctx,14,1,4,2,'#a9c9cd');
          rect(ctx,'#e4d6ae',15,-1,3,2); rect(ctx,'#425a73',17,-1,1,2);
          rect(ctx,'#708e9d',17,3,3,1);
        }
      } else if (kind === 'wolf') {
        // Long muzzle, pointed ears, four paws and a frost-tipped bushy tail.
        var step = active ? 1 : stride;
        line(ctx,INK,-8,2,-10 - step,10,4); line(ctx,'#747b8a',-8,2,-10 - step,9,2);
        line(ctx,INK,6,2,8 + step,10,4); line(ctx,'#949aa2',6,2,8 + step,9,2);
        rect(ctx,'#bbc1bf',-13 - step,10,5,2); rect(ctx,'#cdd0c7',7 + step,10,5,2);
        polygon(ctx,INK,[[-11,-3],[-18,-2],[-24,4 + stride / 2],[-22,8 + stride / 2],[-15,6],[-9,2]]);
        polygon(ctx,'#818a9a',[[-12,-1],[-18,0],[-22,4 + stride / 2],[-20,6 + stride / 2],[-15,4],[-10,1]]);
        line(ctx,'#d5d9d0',-20,3 + stride / 2,-22,5 + stride / 2,2);
        oval(ctx,-3,-1,13,7,INK); oval(ctx,-3,-2,11,5,'#7d8797');
        polygon(ctx,'#aeb9c2',[[-12,-5],[-8,-7],[-5,-5],[-1,-7],[4,-6],[6,-2],[0,0],[-6,-2]]);
        line(ctx,'#d9ddd5',-10,-5,-6,-5,1); line(ctx,'#697387',-10,2,-4,3,1);
        line(ctx,INK,-8,3,-5 + step,10,4); line(ctx,'#a8b1b8',-8,3,-5 + step,9,2);
        line(ctx,INK,6,1,5 - step,10,4); line(ctx,'#c1c8c7',6,1,5 - step,9,2);
        rect(ctx,'#dce0d6',-7 + step,10,5,2); rect(ctx,'#e7e6da',4 - step,10,5,2);
        polygon(ctx,INK,[[4,-4],[6,-12],[10,-16],[12,-10],[16,-13],[17,-7],[21,-4],[23,0],[18,4],[11,2],[8,5]]);
        polygon(ctx,'#aebbc3',[[6,-4],[8,-11],[10,-13],[11,-7],[15,-10],[15,-5],[20,-3],[21,-1],[17,2],[11,0],[9,3]]);
        polygon(ctx,'#e1e4d9',[[10,-3],[15,-4],[20,-2],[21,0],[16,2],[12,0]]);
        rect(ctx,'#5f687b',11,-7,5,2); rect(ctx,'#dec395',12,-7,2,1);
        rect(ctx,'#414957',20,-2,3,2); line(ctx,'#626677',15,2,20,1,1);
        if (active) { rect(ctx,'#ece2ca',16,2,1,2); rect(ctx,'#c6cfcf',8,-9,2,2); }
      } else if (kind === 'antlion') {
        // A squat sand beetle with a scalloped abdomen and paired hooked jaws.
        var reach = active ? -2 : stride / 2;
        for (var leg = -1; leg <= 1; leg++) {
          line(ctx,INK,leg * 6 - 3,2,leg * 7 - 7 + reach,7,3);
          line(ctx,'#ad9067',leg * 6 - 3,2,leg * 7 - 7 + reach,7,1);
          line(ctx,'#d2b384',leg * 7 - 7 + reach,7,leg * 7 - 3 + reach,10,2);
        }
        oval(ctx,-5,-1,12,8,INK); oval(ctx,-5,-2,10,6,'#af8c58');
        for (var rib = -12; rib <= -1; rib += 4) {
          line(ctx,'#d7b57c',rib,-6,rib + 2,2,2); rect(ctx,'#7d664e',rib + 1,3,3,1);
        }
        oval(ctx,7,-2,8,7,INK); oval(ctx,7,-3,6,5,'#d3ae71');
        polygon(ctx,'#edd19a',[[3,-6],[7,-8],[12,-6],[10,-3],[5,-3]]);
        rect(ctx,'#62533f',9,-4,4,2); rect(ctx,'#f2deb2',10,-4,1,1);
        polygon(ctx,INK,[[12,-3],[19,-6],[23,-4],[18,0],[14,1]]);
        polygon(ctx,'#e7cc98',[[14,-3],[19,-4],[21,-4],[17,-1],[14,0]]);
        polygon(ctx,'#66523f',[[12,2],[21,2],[23,5],[17,7],[13,5]]);
        line(ctx,'#cfb488',14,3,20,4,2);
        line(ctx,'#93764e',6,-7,5,-12,1); line(ctx,'#ceb07a',10,-7,13,-11,1);
      } else if (kind === 'antlioncharger') {
        // A broad plated runner with a lowered armored head, not a palette swap.
        var gait = active ? stride * 2 : stride / 2, lower = active ? 2 : 0;
        for (var leg = -1; leg <= 1; leg++) {
          var lx = leg * 7 - 2;
          line(ctx,INK,lx,2,lx - 3 + gait,7,3); line(ctx,'#a18b66',lx,2,lx - 3 + gait,7,1);
          line(ctx,'#d6bd8c',lx - 3 + gait,7,lx + 1 + gait,10,2);
        }
        polygon(ctx,INK,[[-18,1],[-16,-6],[-10,-10],[-3,-11],[5,-8],[9,-2],[5,6],[-10,6]]);
        polygon(ctx,'#8c734e',[[-16,0],[-14,-5],[-9,-8],[-3,-9],[4,-6],[7,-2],[4,4],[-9,4]]);
        polygon(ctx,'#c4a46d',[[-13,-5],[-9,-8],[-4,-8],[-1,-3],[-5,0],[-11,-1]]);
        polygon(ctx,'#b49360',[[-3,-8],[3,-6],[6,-2],[3,2],[-1,0]]);
        line(ctx,'#e3c58b',-10,-7,-7,-2,1); line(ctx,'#65573e',-3,-6,0,3,1);
        polygon(ctx,INK,[[5,-5 + lower],[13,-7 + lower],[19,-3 + lower],[17,3 + lower],[8,5 + lower],[4,1]]);
        polygon(ctx,'#bfa271',[[7,-4 + lower],[13,-5 + lower],[16,-2 + lower],[15,2 + lower],[9,3 + lower],[6,0]]);
        polygon(ctx,'#ebcf97',[[7,-5 + lower],[10,-11 + lower],[13,-6 + lower],[17,-8 + lower],[17,-3 + lower]]);
        rect(ctx,'#67563e',12,-1 + lower,4,2); rect(ctx,'#efc783',14,-1 + lower,1,1);
        polygon(ctx,'#dec18d',[[15,3 + lower],[23,1 + lower],[21,5 + lower],[17,6 + lower]]);
        line(ctx,'#7c6547',10,-7 + lower,15,-12 + lower,1);
      } else if (kind === 'antlionswarmer') {
        // Four veined insect wings, long antennae and a tapered striped abdomen.
        for (var side = -1; side <= 1; side += 2) {
          polygon(ctx,INK,[[-2,-2],[side * 10,-17 - flap / 2],[side * 23,-13 - flap / 2],[side * 15,-5],[side * 6,1]]);
          polygon(ctx,'#c5c0a4',[[0,-3],[side * 11,-14 - flap / 2],[side * 20,-12 - flap / 2],[side * 13,-6],[side * 5,-1]]);
          line(ctx,'#eee0b6',side * 4,-4,side * 15,-12 - flap / 2,1);
          line(ctx,'#918c77',side * 11,-9 - flap / 2,side * 13,-6,1);
          polygon(ctx,'#7f8072',[[-3,0],[side * 17,2 + flap / 2],[side * 10,7],[side * 2,3]]);
          line(ctx,'#cfcaac',side * 4,1,side * 11,4 + flap / 2,1);
        }
        polygon(ctx,INK,[[-18,1],[-10,-5],[3,-4],[8,1],[0,7],[-11,6]]);
        polygon(ctx,'#b18d55',[[-15,1],[-9,-3],[2,-2],[5,1],[-1,5],[-10,4]]);
        for (var band = -10; band <= -2; band += 4) line(ctx,'#e1bd80',band,-2,band + 2,4,2);
        line(ctx,'#7c654c',-1,4,-4,10 + frame % 2,1); line(ctx,'#a7936f',3,3,7,9 - frame % 2,1);
        oval(ctx,8,-2,6,6,INK); oval(ctx,8,-3,4,4,'#d2b079');
        rect(ctx,'#665840',9,-5,4,3); rect(ctx,'#e9d7a3',10,-5,1,1);
        line(ctx,'#dbc28d',10,0,16,1,2); line(ctx,'#76634b',15,2,17,-1,1);
        line(ctx,'#92794f',7,-7,7,-15,1); line(ctx,'#d5bc85',10,-7,15,-13,1);
      } else if (kind === 'vulture') {
        // Layered pinion fingers, cream neck ruff and a bare hooked-beak head.
        for (var side = -1; side <= 1; side += 2) {
          polygon(ctx,INK,[[side * 2,-1],[side * 8,-12 - flap],[side * 20,-14 - flap],[side * 26,-8 - flap],[side * 22,-7 - flap],[side * 19,-2 - flap / 2],[side * 15,-3],[side * 11,3],[side * 4,4]]);
          polygon(ctx,'#8b7361',[[side * 3,-2],[side * 9,-10 - flap],[side * 19,-11 - flap],[side * 23,-8 - flap],[side * 18,-5],[side * 14,-5],[side * 10,1],[side * 4,2]]);
          for (var feather = 0; feather < 3; feather++) line(ctx,'#c4aa86',side * (9 + feather * 4),-8 - flap,side * (12 + feather * 4),-3 - flap / 2,2);
        }
        polygon(ctx,INK,[[-5,3],[-8,12],[0,9],[5,11],[5,3]]);
        polygon(ctx,'#a48b6e',[[-3,4],[-5,9],[0,7],[3,8],[3,4]]);
        oval(ctx,0,1,7,7,INK); oval(ctx,0,0,5,5,'#ae9273'); line(ctx,'#d1b793',-3,-2,0,3,2);
        oval(ctx,5,-4,7,4,'#d9c9a4'); rect(ctx,'#f1dfb7',1,-6,7,2);
        line(ctx,'#ae7770',8,-5,9,-11,4); oval(ctx,10,-11,5,4,'#c49583');
        rect(ctx,'#7d5f58',10,-12,4,2); rect(ctx,'#f2d6a2',11,-12,1,1);
        polygon(ctx,'#edd1a0',[[13,-10],[20,-9],[19,-5],[16,-7],[13,-7]]);
        rect(ctx,'#b09371',17,-8,2,2); rect(ctx,'#78624e',1,6,1,3); rect(ctx,'#78624e',5,5,1,3);
      } else if (kind === 'mummy' || kind === 'lightmummy' || kind === 'darkmummy' || kind === 'bloodmummy') {
        // Shared winding technique, but distinct hoods, collars, bulk and loose strips.
        // Raised forearms and tucked feet only follow existing upward jump motion.
        var light = kind === 'lightmummy', dark = kind === 'darkmummy', blood = kind === 'bloodmummy';
        var cloth = light ? '#e5d7ac' : dark ? '#8e819b' : blood ? '#b4807d' : '#bdab85';
        var pale = light ? '#fcf0cc' : dark ? '#b9a6b9' : blood ? '#ddb09a' : '#e6d1a5';
        var seam = light ? '#ad9470' : dark ? '#5a536d' : blood ? '#7d515f' : '#89765d';
        var step = active ? 1 : stride, sole = active ? 14 : 17;
        line(ctx,INK,-4,4,-5 - step,sole - 1,5); line(ctx,seam,-4,4,-5 - step,sole - 2,3);
        line(ctx,INK,4,4,5 + step,sole - 1,5); line(ctx,cloth,4,4,5 + step,sole - 2,3);
        rect(ctx,pale,-8 - step,sole - 1,6,2); rect(ctx,pale,3 + step,sole - 1,7,2);
        line(ctx,pale,-5,8,-4 - step,10,1); line(ctx,seam,3,9,6 + step,10,1);
        line(ctx,cloth,-5,12,-6 - step,13,1); line(ctx,pale,4,12,6 + step,13,1);
        if (dark) {
          polygon(ctx,INK,[[-6,-15],[-13,-10],[-11,2],[-16,7 + stride],[-11,8],[-15,13],[-7,9],[-3,2]]);
          polygon(ctx,'#70667e',[[-6,-12],[-10,-8],[-8,2],[-12,6 + stride],[-7,5],[-9,9],[-4,4]]);
        } else if (light) {
          polygon(ctx,INK,[[-8,-8],[-13,-5],[-10,-1],[-8,10],[-3,7],[2,10],[8,7],[9,-8]]);
          polygon(ctx,'#c0aa80',[[-7,-6],[-10,-4],[-7,0],[-6,7],[-2,4],[2,7],[6,5],[7,-6]]);
          line(ctx,'#efdcaa',-4,-3,-3,5,1); line(ctx,'#efdcaa',4,-3,4,5,1);
        } else if (blood) {
          polygon(ctx,INK,[[-8,-7],[-12,-3],[-11,5],[-6,9],[7,7],[11,0],[8,-7]]);
          polygon(ctx,'#8c626b',[[-7,-6],[-10,-2],[-9,4],[-5,7],[6,5],[8,0],[6,-6]]);
          line(ctx,'#bc8e86',-9,0,-6,4,2);
        }
        polygon(ctx,INK,[[-6,-9],[5,-9],[8,-3],[7,6],[-5,7],[-8,2]]);
        polygon(ctx,cloth,[[-5,-8],[4,-8],[6,-3],[5,5],[-4,5],[-6,1]]);
        for (var wrap = -6; wrap <= 3; wrap += 3) {
          line(ctx,seam,-5,wrap,5,wrap + 2,1); line(ctx,pale,-4,wrap,1,wrap + 1,1);
        }
        var armY = active ? -7 : -2, handX = blood ? 16 : 14;
        line(ctx,INK,-6,-6,-9,1 + stride / 2,5); line(ctx,seam,-6,-6,-9,1 + stride / 2,3);
        rect(ctx,pale,-11,1 + stride / 2,4,3);
        line(ctx,INK,5,-6,9,armY,5); line(ctx,cloth,5,-6,9,armY,3);
        line(ctx,INK,9,armY,handX,armY + 1,4); line(ctx,pale,9,armY,handX,armY + 1,2);
        rect(ctx,seam,10,armY - 1,1,3); rect(ctx,seam,13,armY,1,3);
        var headX = light ? 0 : dark ? 1 : blood ? 3 : 2;
        oval(ctx,headX,-12,7,7,INK); oval(ctx,headX,-12,5,5,cloth);
        line(ctx,pale,headX - 4,-15,headX + 3,-14,2); line(ctx,seam,headX - 4,-10,headX + 4,-9,1);
        rect(ctx,seam,headX,-13,6,3); rect(ctx,light ? '#91aa9a' : dark ? '#c6ca9e' : '#efd09a',headX + 2,-13,2,1);
        rect(ctx,pale,headX + 4,-10,3,2); line(ctx,seam,headX + 1,-7,headX + 4,-7,1);
        if (light) {
          polygon(ctx,INK,[[-7,-15],[-11,-20],[-5,-19],[0,-23],[5,-19],[10,-20],[7,-12]]);
          polygon(ctx,'#d5bc87',[[-6,-16],[-8,-18],[-4,-17],[0,-20],[4,-17],[7,-18],[5,-14]]);
          rect(ctx,'#f8e6b7',-3,-18,6,2); rect(ctx,'#849a91',-1,-18,2,2);
          line(ctx,'#d6bf8d',-8,-5,5,-3,2); rect(ctx,'#faf0ce',-1,-5,3,2);
        } else if (dark) {
          polygon(ctx,'#514e67',[[-6,-11],[-8,-18],[-4,-21],[3,-20],[8,-17],[7,-13],[4,-17],[-1,-18],[-4,-14]]);
          line(ctx,'#9b8ca5',-5,-18,-1,-19,1);
          line(ctx,'#8d7a92',-4,-14,-13,-15 + stride / 2,3); line(ctx,'#b3a0ae',-12,-15 + stride / 2,-16,-12 + stride / 2,1);
          rect(ctx,'#6d5c76',-3,-2,4,3);
        } else if (blood) {
          polygon(ctx,'#794c5a',[[0,-18],[6,-20],[10,-16],[9,-11],[7,-15],[2,-15]]);
          line(ctx,'#d4a292',1,-17,7,-17,1); line(ctx,'#9f6d73',-7,-5,4,3,2);
          polygon(ctx,'#ba8684',[[-6,3],[-13,7 + stride / 2],[-12,12],[-9,8],[-3,6]]);
          line(ctx,'#e1b4a0',-10,7 + stride / 2,-10,9,1);
          line(ctx,'#8f5c68',9,armY + 2,12,armY + 6 + stride / 2,2);
        } else {
          line(ctx,'#ad9873',-4,-15,-12,-13 + stride / 2,2);
          line(ctx,'#ddc89c',-11,-13 + stride / 2,-13,-9 + stride / 2,1);
          polygon(ctx,'#d0b98d',[[-5,2],[-11,5],[-13,10 + stride / 2],[-8,8],[-3,5]]);
          line(ctx,seam,-9,6,-10,8,1);
        }
      } else if (kind === 'skeletonarcher') {
        // Exposed ribs, a leather quiver and bent wooden bow; recoil is visual only.
        line(ctx,INK,-4,4,-6 - stride / 2,14,4); line(ctx,'#b9b4a1',-4,4,-6 - stride / 2,13,2);
        line(ctx,INK,3,4,5 + stride / 2,14,4); line(ctx,'#e0d4b9',3,4,5 + stride / 2,13,2);
        rect(ctx,'#d1c6ae',-9 - stride / 2,14,6,2); rect(ctx,'#e7d8b7',3 + stride / 2,14,6,2);
        polygon(ctx,INK,[[-9,-11],[-4,-12],[-4,3],[-10,2]]);
        rect(ctx,'#795e50',-9,-10,4,11); rect(ctx,'#b79a6e',-10,-10,6,2);
        line(ctx,'#b9a57f',-8,-10,-9,-19,1); line(ctx,'#d6c6a4',-6,-10,-5,-18,1);
        rect(ctx,'#d6c4a1',-10,-20,3,3); rect(ctx,'#9bada9',-6,-20,3,3);
        polygon(ctx,INK,[[-5,-8],[4,-8],[7,3],[3,7],[-4,6],[-7,0]]);
        line(ctx,'#d6c7a8',0,-7,0,5,2);
        for (var rib = -6; rib <= 0; rib += 3) {
          line(ctx,'#c3baa5',-5,rib,-2,rib + 2,1); line(ctx,'#e7d7b6',1,rib + 2,5,rib,1);
        }
        line(ctx,'#c7baa0',-4,4,4,4,2); rect(ctx,'#66534c',-5,2,10,2);
        oval(ctx,1,-12,7,6,INK); oval(ctx,1,-13,5,4,'#d8cdb6');
        rect(ctx,'#514b50',1,-14,5,3); rect(ctx,'#c6a174',3,-14,1,1);
        rect(ctx,'#a19586',5,-11,2,2); rect(ctx,'#e6d6b7',0,-9,6,2);
        rect(ctx,'#71695f',2,-9,1,2); rect(ctx,'#71695f',5,-9,1,2);
        line(ctx,INK,4,-6,11,-4,4); line(ctx,'#ded0b0',4,-6,11,-4,2);
        var grip = active ? 5 : 9;
        line(ctx,INK,-4,-5,grip,-2,3); line(ctx,'#bbae97',-4,-5,grip,-2,1);
        line(ctx,'#5c4b42',14,-14,19,-7,3); line(ctx,'#5c4b42',19,-7,20,1,3); line(ctx,'#5c4b42',20,1,15,10,3);
        line(ctx,'#c4a373',14,-14,18,-7,1); line(ctx,'#d7b883',18,-7,19,1,1); line(ctx,'#b89464',19,1,15,10,1);
        line(ctx,'#c9bf9f',14,-13,active ? 13 : 9,-2,1); line(ctx,'#c9bf9f',active ? 13 : 9,-2,15,9,1);
        rect(ctx,'#d7c6a6',11,-5,4,3);
      } else if (kind === 'armoredbones') {
        // Riveted plate over visible bone; pauldrons never become extra targets.
        var step = active ? 1 : stride / 2, foot = active ? 14 : 17;
        line(ctx,INK,-5,4,-6 - step,foot - 1,6); line(ctx,'#7f8998',-5,4,-6 - step,foot - 2,4);
        line(ctx,INK,4,4,5 + step,foot - 1,6); line(ctx,'#a5acb3',4,4,5 + step,foot - 2,4);
        rect(ctx,'#b3b6b6',-10 - step,foot - 1,8,2); rect(ctx,'#d0cbbd',3 + step,foot - 1,8,2);
        line(ctx,'#d3ceba',-7,10,-4,10,1); line(ctx,'#586579',3,10,7,10,1);
        polygon(ctx,INK,[[-9,-8],[-4,-11],[5,-10],[10,-6],[8,5],[3,8],[-7,5]]);
        polygon(ctx,'#7e899c',[[-7,-7],[-3,-9],[4,-8],[8,-5],[6,4],[2,6],[-5,3]]);
        polygon(ctx,'#c1c1b8',[[-5,-7],[-1,-8],[0,-1],[-4,2],[-6,-1]]);
        line(ctx,'#4e5c73',1,-6,4,3,1); line(ctx,'#bfbfaf',-4,4,4,5,2);
        rect(ctx,'#d3bc8c',-6,-6,1,1); rect(ctx,'#d3bc8c',6,-4,1,1);
        var arm = active ? -3 : 1 + stride / 2;
        line(ctx,INK,-8,-5,-12,arm,6); line(ctx,'#777f91',-8,-5,-12,arm,4);
        line(ctx,INK,8,-5,12,arm - 1,6); line(ctx,'#aeb3b7',8,-5,12,arm - 1,4);
        rect(ctx,'#c0baaa',-14,arm,5,4); rect(ctx,'#d8d0b9',10,arm - 1,5,4);
        polygon(ctx,'#566278',[[-14,-7],[-9,-12],[-4,-8],[-7,-4],[-13,-4]]);
        polygon(ctx,'#9da7b0',[[4,-8],[8,-12],[14,-8],[14,-4],[7,-4]]);
        line(ctx,'#c5c6bc',7,-9,11,-7,1);
        oval(ctx,1,-13,6,5,INK); oval(ctx,1,-12,4,3,'#d5ccb5');
        polygon(ctx,'#5b677d',[[-6,-13],[-5,-19],[1,-22],[7,-18],[8,-12],[4,-15],[-2,-15],[-2,-11]]);
        line(ctx,'#b8bdb9',-3,-18,2,-20,2); rect(ctx,'#d1ba8c',5,-17,1,1);
        rect(ctx,'#465267',1,-13,5,2); rect(ctx,'#d2b286',3,-13,1,1); rect(ctx,'#8d8276',3,-9,1,2);
      } else if (kind === 'undeadminer') {
        // A dented lamp helmet, patched overalls and a carried pick, not mining AI.
        var step = active ? 1 : stride / 2, foot = active ? 13 : 16;
        line(ctx,INK,-4,4,-5 - step,foot - 1,5); line(ctx,'#657183',-4,4,-5 - step,foot - 2,3);
        line(ctx,INK,4,4,5 + step,foot - 1,5); line(ctx,'#8b929b',4,4,5 + step,foot - 2,3);
        rect(ctx,'#746458',-8 - step,foot - 1,6,2); rect(ctx,'#a89171',3 + step,foot - 1,7,2);
        polygon(ctx,INK,[[-6,-8],[5,-8],[8,4],[3,7],[-6,5],[-8,-2]]);
        polygon(ctx,'#807467',[[-5,-7],[4,-7],[6,3],[2,5],[-4,3],[-6,-1]]);
        rect(ctx,'#64768a',-4,-5,8,9); rect(ctx,'#9fa9ad',-3,-7,1,5); rect(ctx,'#aeb1a9',3,-7,1,5);
        rect(ctx,'#c4af85',-2,-1,3,3); rect(ctx,'#4d5b70',-3,3,7,2);
        oval(ctx,1,-12,6,5,INK); oval(ctx,1,-12,4,3,'#c6bba3');
        rect(ctx,'#595763',1,-13,5,2); rect(ctx,'#e0c799',3,-13,1,1); rect(ctx,'#d9ccb0',2,-9,4,2);
        polygon(ctx,'#8e7950',[[-7,-14],[-6,-18],[-2,-21],[5,-20],[8,-16],[9,-14]]);
        line(ctx,'#d7bd80',-4,-18,3,-19,2); rect(ctx,'#c6aa6d',-8,-15,18,2);
        oval(ctx,7,-16,4,4,'#5f6064'); oval(ctx,7,-16,2,2,'#e7d39b'); rect(ctx,'#fff0c9',7,-17,1,1);
        var arm = active ? -5 : 0;
        line(ctx,INK,-6,-5,-10,arm + 3,4); line(ctx,'#b5a88f',-6,-5,-10,arm + 3,2);
        line(ctx,INK,5,-5,11,arm,4); line(ctx,'#c9b89b',5,-5,11,arm,2);
        line(ctx,'#504b46',9,arm + 4,14,-16 + arm,3); line(ctx,'#b19062',10,arm + 3,15,-16 + arm,1);
        polygon(ctx,'#647587',[[9,-17 + arm],[16,-19 + arm],[22,-14 + arm],[16,-15 + arm],[12,-14 + arm]]);
        line(ctx,'#c6ccbf',10,-17 + arm,16,-18 + arm,1);
      } else if (kind === 'giantbat') {
        // A broad scalloped mantle, short tail fan and uneven ears distinguish it.
        for (var side = -1; side <= 1; side += 2) {
          polygon(ctx,INK,[[side * 3,-2],[side * 9,-14 - flap],[side * 24,-11 - flap],[side * 29,-3 - flap],[side * 23,-5],[side * 19,3],[side * 15,0],[side * 10,7],[side * 5,3]]);
          polygon(ctx,'#82738f',[[side * 4,-3],[side * 10,-11 - flap],[side * 22,-9 - flap],[side * 25,-5 - flap],[side * 21,-7],[side * 18,0],[side * 14,-3],[side * 9,4],[side * 5,1]]);
          line(ctx,'#c1a6b2',side * 4,-3,side * 10,-11 - flap,1);
          line(ctx,'#a38da5',side * 10,-9 - flap,side * 18,0,1);
          line(ctx,'#5d526f',side * 10,-8 - flap,side * 14,-3,1);
        }
        polygon(ctx,'#62546f',[[-5,4],[-5,11],[0,8],[4,10],[5,3]]);
        oval(ctx,0,0,7,7,INK); oval(ctx,0,0,5,5,'#a093a7'); oval(ctx,1,2,3,3,'#c6b4b4');
        polygon(ctx,INK,[[-5,-3],[-9,-14],[-5,-17],[-1,-6],[4,-15],[8,-12],[6,-2]]);
        polygon(ctx,'#b6a3b0',[[-4,-5],[-7,-13],[-5,-14],[-2,-5],[4,-12],[6,-11],[4,-4]]);
        oval(ctx,2,-4,6,4,'#98889e'); rect(ctx,'#d5c5a4',0,-6,3,2); rect(ctx,'#d5c5a4',5,-5,2,2);
        rect(ctx,'#494153',1,-6,1,2); rect(ctx,'#494153',6,-5,1,2);
        rect(ctx,'#6a5264',4,-2,4,2); rect(ctx,'#ebdcc0',3,0,1,2); rect(ctx,'#ebdcc0',6,0,1,2);
      } else if (kind === 'cursedskull') {
        // Cracked ivory and an articulated jaw; wisps are decoration, not ghost AI.
        rect(ctx,'#7d718f',-17,1 + stride / 2,2,2); rect(ctx,'#a492b2',-15,-6 - frame % 2,2,1);
        polygon(ctx,INK,[[-12,-5],[-8,-11],[-1,-14],[8,-12],[13,-6],[12,2],[7,6],[-4,5],[-11,1]]);
        polygon(ctx,'#aaa0b1',[[-10,-5],[-6,-9],[0,-12],[7,-10],[10,-5],[10,1],[6,4],[-3,3],[-9,0]]);
        polygon(ctx,'#e0d3c0',[[-7,-6],[-3,-10],[3,-10],[7,-8],[7,-4],[3,-1],[-5,0],[-8,-2]]);
        line(ctx,'#faf0d7',-4,-8,2,-10,1); line(ctx,'#7d718b',0,-11,-2,-6,1);
        line(ctx,active ? '#e4d9cc' : '#897c94',-2,-6,1,-3,1);
        oval(ctx,6,-4,5,4,'#494456'); rect(ctx,active ? '#fff0c5' : '#d6c096',7,-5,2,2);
        rect(ctx,'#73677e',-4,-4,3,3); rect(ctx,active ? '#f0d9b0' : '#b6a18a',-3,-3,1,1);
        polygon(ctx,'#61576d',[[8,0],[12,2],[8,4],[5,3]]);
        var jaw = active ? 2 : frame % 2;
        line(ctx,INK,-5,3,-3,8 + jaw,4); line(ctx,'#b4a9b5',-5,3,-3,7 + jaw,2);
        polygon(ctx,INK,[[-3,7 + jaw],[9,6 + jaw],[10,10 + jaw],[2,12 + jaw],[-4,10 + jaw]]);
        polygon(ctx,'#d2c5b8',[[-2,7 + jaw],[7,7 + jaw],[8,9 + jaw],[2,10 + jaw],[-2,9 + jaw]]);
        rect(ctx,'#eee0c4',0,3,2,3); rect(ctx,'#eee0c4',4,3,2,3); rect(ctx,'#eee0c4',8,2,2,3);
        rect(ctx,'#f7e6c8',1,7 + jaw,1,2); rect(ctx,'#f7e6c8',5,6 + jaw,1,2);
      } else if (kind === 'darkcaster') {
        // A round folded hood, torn robes and an open book distinguish the caster.
        polygon(ctx,INK,[[-7,-8],[6,-8],[10,5],[13,15],[7,17],[3,14],[-1,17],[-5,14],[-12,16],[-9,5]]);
        polygon(ctx,'#665679',[[-6,-7],[5,-7],[8,5],[10,13],[6,14],[3,11],[-1,14],[-5,11],[-9,13],[-7,4]]);
        polygon(ctx,'#947e9d',[[-3,-7],[0,-6],[2,10],[-1,13],[-4,9],[-5,0]]);
        line(ctx,'#b59caf',-2,-5,-1,8,1); line(ctx,'#453f5a',4,-3,7,11 + stride / 2,2);
        rect(ctx,'#b9a278',-6,1,13,2); rect(ctx,'#d7bf8c',1,1,2,2);
        oval(ctx,1,-13,8,8,INK); oval(ctx,1,-13,6,6,'#75617f');
        polygon(ctx,'#423d56',[[-3,-16],[2,-18],[6,-15],[7,-10],[1,-7],[-4,-10]]);
        line(ctx,'#a78aa5',-4,-15,-5,-11,1); rect(ctx,'#d7c7b9',2,-13,4,2);
        rect(ctx,active ? '#f5e2bd' : '#b9a5b9',4,-13,1,1); rect(ctx,'#72627d',3,-9,3,1);
        var handY = active ? -9 : -3;
        line(ctx,INK,6,-6,11,handY,5); line(ctx,'#8d7592',6,-6,11,handY,3);
        rect(ctx,'#c2aa83',9,handY,4,2); rect(ctx,'#d3c2ae',12,handY - 2,3,3);
        line(ctx,INK,-6,-5,-10,-1 + stride / 2,4); line(ctx,'#a18b9e',-6,-5,-10,-1 + stride / 2,2);
        polygon(ctx,'#514149',[[-16,-3],[-11,-4],[-6,-2],[-5,5],[-11,3],[-16,4]]);
        polygon(ctx,'#d8c6a2',[[-15,-2],[-11,-3],[-7,-1],[-7,3],[-11,1],[-15,2]]);
        line(ctx,'#897b70',-11,-2,-11,2,1); line(ctx,'#a99c84',-14,0,-12,-1,1);
        if (active) { oval(ctx,15,handY - 4,3,3,'#aa91be'); rect(ctx,'#ede0cf',14,handY - 5,2,2); }
      } else if (kind === 'angrybones') {
        // Unarmored ribs, separated joints and a clenched jaw, not a gray humanoid.
        var step = active ? 1 : stride / 2, foot = active ? 14 : 17;
        line(ctx,INK,-4,4,-6 - step,foot - 1,4); line(ctx,'#b9b0a0',-4,4,-6 - step,foot - 2,2);
        line(ctx,INK,4,4,5 + step,foot - 1,4); line(ctx,'#e6d7b8',4,4,5 + step,foot - 2,2);
        rect(ctx,'#d8cbb0',-9 - step,foot - 1,6,2); rect(ctx,'#f0dfbd',3 + step,foot - 1,7,2);
        rect(ctx,'#7e756e',-6,9,2,2); rect(ctx,'#9d9281',4,9,2,2);
        polygon(ctx,INK,[[-5,-8],[4,-8],[7,-3],[5,3],[-4,4],[-7,-2]]);
        line(ctx,'#d8c9ab',0,-8,0,5,2);
        for (var rib = -6; rib <= 0; rib += 3) {
          line(ctx,'#c6bda9',-5,rib,-2,rib + 2,1); line(ctx,'#edddbd',1,rib + 2,5,rib,1);
        }
        polygon(ctx,'#b9ab94',[[-5,3],[5,3],[4,6],[1,5],[-3,7]]);
        polygon(ctx,'#766255',[[-6,3],[-10,8 + stride / 2],[-5,7],[-3,4]]);
        var handY = active ? -8 : -2;
        line(ctx,INK,-5,-6,-9,handY + 5,4); line(ctx,'#b3a997',-5,-6,-9,handY + 5,2);
        line(ctx,INK,5,-6,10,handY,4); line(ctx,'#e0d0ae',5,-6,10,handY,2);
        rect(ctx,'#d5c5a6',-11,handY + 4,4,3); rect(ctx,'#efddba',10,handY - 1,4,3);
        oval(ctx,2,-13,7,6,INK); oval(ctx,2,-14,5,4,'#dfd2b8');
        line(ctx,'#f3e4c6',0,-17,4,-17,1); line(ctx,'#8d8077',0,-18,-2,-14,1);
        polygon(ctx,'#5b5156',[[3,-14],[8,-13],[7,-10],[3,-11]]);
        line(ctx,'#9b7565',3,-15,8,-14,1); rect(ctx,'#d5a779',6,-13,1,1);
        rect(ctx,'#a39583',7,-10,2,2); rect(ctx,'#d5c4a5',0,-9,8,2);
        for (var tooth = 1; tooth < 7; tooth += 2) rect(ctx,'#75695e',tooth,-9,1,2);
      } else if (kind === 'dungeonslime') {
        // Opaque stepped gel holds old brick fragments; no key/drop is invented.
        var rise = active ? -4 : 0, rx = active ? 11 : 13 + Math.abs(stride) / 2, ry = active ? 11 : 8;
        oval(ctx,0,rise,rx,ry,INK); oval(ctx,0,rise - 1,rx - 2,ry - 2,'#796d9b');
        oval(ctx,-3,rise - 3,rx - 5,ry - 5,'#a293bb');
        polygon(ctx,'#c9bed2',[[-7,rise - 5],[-4,rise - 7],[0,rise - 6],[-2,rise - 4],[-6,rise - 3]]);
        rect(ctx,'#5e5c7a',-8,rise + 1,6,4); rect(ctx,'#9697ad',-7,rise + 1,4,2);
        rect(ctx,'#4a4967',2,rise - 1,7,4); rect(ctx,'#8b8fa4',3,rise - 1,5,2);
        line(ctx,'#6a6888',-5,rise + 1,-4,rise + 4,1); line(ctx,'#b5a8c5',-4,rise + 4,2,rise + 5,1);
        rect(ctx,'#3f3c56',-2,rise - 2,2,3); rect(ctx,'#3f3c56',5,rise - 3,2,3);
        rect(ctx,'#e6d5b2',-2,rise - 2,1,1); rect(ctx,'#e6d5b2',5,rise - 3,1,1);
        line(ctx,'#c4b3cb',-8,6 + rise,7,6 + rise,1);
        rect(ctx,'#9d8eaf',-10 - stride / 2,7 + rise,3,2); rect(ctx,'#b2a3be',7 + stride / 2,7 + rise,3,2);
      } else if (kind === 'hellbat') {
        // Swept ember membranes and a forked tail distinguish the small Hellbat.
        for (var side = -1; side <= 1; side += 2) {
          polygon(ctx,INK,[[side * 3,-2],[side * 10,-16 - flap],[side * 23,-10 - flap],[side * 28,0],[side * 22,-3],[side * 18,4],[side * 12,1],[side * 7,6]]);
          polygon(ctx,'#a76851',[[side * 4,-3],[side * 11,-12 - flap],[side * 21,-9 - flap],[side * 24,-3],[side * 20,-5],[side * 17,1],[side * 12,-2],[side * 7,3]]);
          polygon(ctx,'#d79a6c',[[side * 5,-3],[side * 11,-11 - flap],[side * 17,-8 - flap],[side * 10,-5]]);
          line(ctx,'#edd0a0',side * 5,-4,side * 11,-11 - flap,1);
          line(ctx,'#7f4b49',side * 11,-9 - flap,side * 18,1,1);
        }
        polygon(ctx,'#8a4b4b',[[-3,4],[-7,13],[-1,9],[4,13],[4,4]]);
        oval(ctx,0,0,6,7,INK); oval(ctx,0,0,4,5,'#b57859'); oval(ctx,1,1,2,3,'#dfb181');
        polygon(ctx,INK,[[-5,-4],[-5,-16],[-1,-10],[2,-6],[6,-15],[8,-10],[5,-2]]);
        polygon(ctx,'#d6a374',[[-3,-5],[-3,-12],[0,-7],[3,-5],[6,-11],[6,-7],[4,-3]]);
        oval(ctx,2,-4,5,4,'#be8c65'); rect(ctx,'#6f4f4c',0,-6,7,2);
        rect(ctx,'#efd2a0',1,-6,2,1); rect(ctx,'#efd2a0',6,-6,1,1);
        rect(ctx,'#81514e',4,-2,4,2); rect(ctx,'#f4dfb6',3,0,1,2); rect(ctx,'#f4dfb6',6,0,1,2);
      } else if (kind === 'demon' || kind === 'voodoodemon') {
        // Two horned flyers with different wing cuts; doll and claws are not targets.
        var voodoo = kind === 'voodoodemon', skin = voodoo ? '#916779' : '#ad7568';
        var membrane = voodoo ? '#715565' : '#9c6260', rib = voodoo ? '#bb929c' : '#d5a28c';
        for (var side = -1; side <= 1; side += 2) {
          polygon(ctx,INK,[[side * 5,-6],[side * 13,-24 - flap],[side * (voodoo ? 29 : 34),-17 - flap],[side * 27,-8],[side * 22,-12],[side * (voodoo ? 19 : 20),2],[side * 14,-2],[side * 8,7]]);
          polygon(ctx,membrane,[[side * 6,-7],[side * 14,-20 - flap],[side * (voodoo ? 26 : 30),-16 - flap],[side * 24,-11],[side * 20,-15],[side * 18,-1],[side * 13,-5],[side * 8,3]]);
          line(ctx,rib,side * 6,-7,side * 14,-20 - flap,1);
          line(ctx,rib,side * 14,-18 - flap,side * 18,-1,1);
          if (voodoo) {
            polygon(ctx,INK,[[side * 23,-16 - flap],[side * 24,-12 - flap],[side * 20,-11 - flap]]);
            line(ctx,'#aa7f90',side * 14,1,side * 13,7 + frame % 2,1);
          }
        }
        line(ctx,INK,-4,3,-17,12 + stride / 2,4); line(ctx,skin,-4,3,-17,11 + stride / 2,2);
        polygon(ctx,rib,[[-17,10 + stride / 2],[-24,7 + stride / 2],[-22,14 + stride / 2],[-18,13 + stride / 2]]);
        line(ctx,INK,-4,5,-6 - stride / 2,15,5); line(ctx,skin,-4,5,-6 - stride / 2,14,3);
        line(ctx,INK,4,4,6 + stride / 2,14,5); line(ctx,rib,4,4,6 + stride / 2,13,3);
        rect(ctx,'#d4b79c',-9 - stride / 2,15,5,2); rect(ctx,'#e5c6a4',5 + stride / 2,14,5,2);
        oval(ctx,0,-2,9,10,INK); oval(ctx,0,-3,7,8,skin);
        polygon(ctx,rib,[[-4,-8],[0,-10],[4,-7],[3,-2],[-2,0],[-5,-3]]);
        line(ctx,voodoo ? '#624c61' : '#875851',-3,0,3,2,1); line(ctx,rib,-2,4,3,4,1);
        rect(ctx,voodoo ? '#5e4a5b' : '#745047',-6,5,12,3); rect(ctx,'#bea17c',-1,5,3,2);
        var handY = active ? -8 : -2;
        line(ctx,INK,-7,-6,-12,2 + frame % 2,4); line(ctx,skin,-7,-6,-12,2 + frame % 2,2);
        line(ctx,INK,6,-6,13,handY,4); line(ctx,rib,6,-6,13,handY,2);
        rect(ctx,'#d9b79a',12,handY - 1,5,3); rect(ctx,'#e5c7a4',16,handY - 2,1,2);
        oval(ctx,2,-14,7,6,INK); oval(ctx,2,-14,5,4,skin);
        polygon(ctx,'#d1b49e',[[-3,-17],[-8,voodoo ? -24 : -27],[-3,-23],[0,-18]]);
        polygon(ctx,'#e7c7a6',[[5,-18],[8,voodoo ? -26 : -24],[11,-22],[8,-16]]);
        rect(ctx,'#513e50',2,-16,6,3); rect(ctx,active ? '#f4dcac' : '#cfb69a',4,-16,2,1);
        rect(ctx,'#bc8d83',6,-12,4,2); line(ctx,'#5e424b',3,-9,8,-9,1);
        rect(ctx,'#ead3b0',6,-9,1,2);
        if (active) { rect(ctx,'#c7ae91',15,handY - 4,2,2); rect(ctx,'#ebd2aa',10,-2,2,1); }
        if (voodoo) {
          // Suspended stitched doll is an original decoration, awarded only by kill AI.
          line(ctx,'#b69c80',14,handY + 2,17,12,1);
          oval(ctx,17,12,3,3,'#d3ba91'); rect(ctx,'#63524e',16,11,1,1); rect(ctx,'#63524e',18,11,1,1);
          rect(ctx,'#96745c',14,15,7,6); rect(ctx,'#c0a379',15,15,4,5);
          line(ctx,'#d2b48a',14,16,11,19,1); line(ctx,'#d2b48a',20,16,23,19,1);
          line(ctx,'#ac8e68',16,20,15,24,1); line(ctx,'#c7aa7e',19,20,20,23,1);
          rect(ctx,'#a65c5b',17,16,2,3); rect(ctx,'#efceaa',17,17,1,1);
        }
      } else if (kind === 'fireimp') {
        // Compact horned caster, long ears and a curled tail; it keeps walking AI.
        line(ctx,INK,-5,3,-17,9 + stride / 2,4); line(ctx,'#bb805c',-5,3,-17,8 + stride / 2,2);
        line(ctx,'#d9a676',-17,8 + stride / 2,-20,4,2);
        polygon(ctx,'#e1bd8b',[[-20,5],[-23,1],[-19,0]]);
        line(ctx,INK,-4,3,-5 - stride / 2,11,4); line(ctx,'#a97456',-4,3,-5 - stride / 2,10,2);
        line(ctx,INK,4,3,5 + stride / 2,11,4); line(ctx,'#d9a575',4,3,5 + stride / 2,10,2);
        rect(ctx,'#d9bd91',-8 - stride / 2,11,5,2); rect(ctx,'#efcda0',4 + stride / 2,11,5,2);
        oval(ctx,0,-2,8,8,INK); oval(ctx,0,-3,6,6,'#bd835e'); oval(ctx,1,-2,3,4,'#e3b282');
        line(ctx,'#8e5b4f',-4,1,3,3,1); rect(ctx,'#7d5549',-5,4,10,2);
        var handY = active ? -9 : -3;
        line(ctx,INK,-6,-5,-10,2 + frame % 2,4); line(ctx,'#c8956b',-6,-5,-10,2 + frame % 2,2);
        line(ctx,INK,6,-5,12,handY,4); line(ctx,'#edbc88',6,-5,12,handY,2);
        rect(ctx,'#e5c093',11,handY - 1,4,3);
        polygon(ctx,INK,[[-5,-10],[-12,-14],[-10,-7],[-4,-6],[3,-11],[12,-14],[10,-7],[5,-6]]);
        polygon(ctx,'#c9916e',[[-5,-9],[-10,-12],[-8,-8],[-4,-7],[5,-9],[10,-12],[9,-8],[5,-7]]);
        oval(ctx,1,-11,6,5,INK); oval(ctx,1,-11,4,3,'#d6a67a');
        polygon(ctx,'#e5c39a',[[-4,-13],[-5,-21],[-1,-17],[1,-13],[4,-13],[7,-20],[8,-15],[6,-11]]);
        rect(ctx,'#7b544d',2,-12,5,2); rect(ctx,active ? '#fff0c3' : '#edd3a3',4,-12,2,1);
        rect(ctx,'#bf8769',5,-9,4,2); rect(ctx,'#f4dab0',5,-6,1,2);
        if (active) { oval(ctx,15,handY - 4,3,3,'#d7b582'); rect(ctx,'#f7dfab',14,handY - 5,2,2); }
      } else if (kind === 'lavaslime') {
        // Opaque molten gel under a broken basalt crust; no world-lava effects.
        var top = active ? -13 : -7 + frame % 2, base = 9, wide = active ? 10 : 13;
        polygon(ctx,INK,[[-wide - 1,base],[-wide - 2,0],[-wide + 3,top + 2],[-4,top - 2],[5,top - 1],[wide,top + 5],[wide + 2,3],[wide,base]]);
        polygon(ctx,'#b64d35',[[-wide,base - 1],[-wide,0],[-wide + 4,top + 3],[-3,top],[5,top + 1],[wide - 1,top + 6],[wide,4],[wide - 1,base - 1]]);
        polygon(ctx,'#e38b48',[[-wide + 2,5],[-wide + 3,0],[-4,top + 3],[3,top + 2],[wide - 2,0],[wide - 3,6]]);
        polygon(ctx,'#f4c576',[[-6,top + 4],[-2,top + 2],[2,top + 3],[0,0],[-4,1]]);
        polygon(ctx,'#52434a',[[-wide,3],[-wide + 3,-1],[-5,1],[-3,6],[-7,8],[-wide,7]]);
        polygon(ctx,'#6f4d47',[[2,4],[5,1],[wide - 1,2],[wide,6],[6,8],[3,7]]);
        polygon(ctx,'#73544b',[[-5,top + 1],[-1,top - 1],[4,top],[6,top + 4],[2,top + 5],[-1,top + 3]]);
        line(ctx,'#aa7c5b',-3,top + 1,2,top + 2,1);
        rect(ctx,'#fff0b3',-8,top + 6,2,2); rect(ctx,'#edb46c',-7,top + 8,1,2);
        rect(ctx,INK,1,0,2,2); rect(ctx,INK,6,0,2,2); rect(ctx,'#f8d38b',2,-1,1,1);
        rect(ctx,'#e7a65e',-3 + stride,5,2,1);
      } else if (kind === 'lavabat') {
        // Narrow flame-tip wings, charcoal shell and a short fan tail, not Hellbat.
        for (var side = -1; side <= 1; side += 2) {
          polygon(ctx,INK,[[side * 3,-1],[side * 8,-15 - flap],[side * 17,-20 - flap],[side * 14,-10],[side * 25,-6 - flap],[side * 20,0],[side * 13,6],[side * 8,1],[side * 4,5]]);
          polygon(ctx,'#ae533e',[[side * 4,-2],[side * 9,-13 - flap],[side * 14,-16 - flap],[side * 12,-8],[side * 22,-5 - flap],[side * 18,-1],[side * 13,3],[side * 8,-1]]);
          polygon(ctx,'#e49c57',[[side * 5,-2],[side * 9,-12 - flap],[side * 12,-14 - flap],[side * 10,-6],[side * 17,-5],[side * 10,-2]]);
          line(ctx,'#f1cd83',side * 5,-2,side * 10,-11 - flap,1);
          line(ctx,'#70444a',side * 10,-5,side * 14,2,1);
        }
        polygon(ctx,INK,[[-4,3],[-9,10],[-2,8],[3,11],[5,3]]);
        polygon(ctx,'#c37d50',[[-3,4],[-6,8],[-1,6],[2,8],[3,4]]);
        oval(ctx,0,0,5,6,INK); oval(ctx,0,0,3,4,'#695059'); rect(ctx,'#b77a51',0,-2,2,5);
        polygon(ctx,INK,[[-4,-3],[-7,-12],[-2,-9],[1,-5],[4,-12],[6,-8],[4,-2]]);
        polygon(ctx,'#b17d5b',[[-3,-4],[-5,-9],[-1,-6],[2,-5],[4,-9],[4,-5]]);
        oval(ctx,2,-3,4,3,'#876052'); rect(ctx,'#e9bc72',2,-5,2,1);
        rect(ctx,'#eccb98',4,-1,1,2); rect(ctx,'#c08a5d',5,-3,2,2);
      } else if (kind === 'reddevil') {
        // Heavy scarlet flyer, swept horns and hooked wings. No invented weapon/shot.
        for (var side = -1; side <= 1; side += 2) {
          polygon(ctx,INK,[[side * 6,-6],[side * 16,-23 - flap],[side * 32,-26 - flap],[side * 27,-16],[side * 34,-7],[side * 24,-10],[side * 20,5],[side * 15,0],[side * 8,8]]);
          polygon(ctx,'#833b49',[[side * 7,-6],[side * 17,-20 - flap],[side * 28,-23 - flap],[side * 24,-15],[side * 30,-10],[side * 23,-13],[side * 18,2],[side * 14,-4],[side * 9,4]]);
          polygon(ctx,'#b85b53',[[side * 8,-6],[side * 17,-18 - flap],[side * 25,-21 - flap],[side * 20,-13],[side * 18,-2],[side * 14,-7]]);
          line(ctx,'#d58e6d',side * 8,-7,side * 17,-20 - flap,1);
          line(ctx,'#c77860',side * 17,-18 - flap,side * 18,1,1);
        }
        line(ctx,INK,-6,6,-17,17 + stride / 2,5); line(ctx,'#a64a45',-6,6,-17,16 + stride / 2,3);
        line(ctx,'#cf7359',-17,16 + stride / 2,-25,12,2);
        polygon(ctx,'#e0ae80',[[-25,14],[-30,8],[-23,9]]);
        line(ctx,INK,-4,7,-8 - stride / 2,18,6); line(ctx,'#a65249',-4,7,-8 - stride / 2,17,3);
        line(ctx,INK,5,6,8 + stride / 2,17,6); line(ctx,'#ce7357',5,6,8 + stride / 2,16,3);
        rect(ctx,'#ecd0a4',-11 - stride / 2,18,6,2); rect(ctx,'#eed0a3',6 + stride / 2,17,7,2);
        oval(ctx,0,-2,11,14,INK); oval(ctx,0,-3,9,12,'#b3544d');
        polygon(ctx,'#d67e5f',[[-7,-11],[-2,-12],[1,-7],[5,-12],[8,-8],[5,-3],[1,-4],[-4,-2],[-7,-5]]);
        line(ctx,'#823d44',-1,-3,-1,6,1); line(ctx,'#e29c74',2,1,5,0,1);
        rect(ctx,'#623944',-7,8,14,3); rect(ctx,'#d6b18a',-1,8,3,2);
        line(ctx,INK,-8,-7,-14,5 + frame % 2,5); line(ctx,'#b85b50',-8,-7,-14,4 + frame % 2,3);
        line(ctx,INK,8,-7,16,-1 + stride / 2,5); line(ctx,'#dd8c69',8,-7,16,-2 + stride / 2,3);
        rect(ctx,'#e8c49a',14,-2 + stride / 2,6,3); rect(ctx,'#eed3ae',18,1 + stride / 2,1,2);
        oval(ctx,1,-17,8,7,INK); oval(ctx,2,-17,6,5,'#d17a5d');
        polygon(ctx,INK,[[-5,-19],[-11,-31],[-11,-37],[-6,-31],[-1,-22],[5,-21],[9,-33],[14,-36],[12,-27],[9,-18]]);
        polygon(ctx,'#d8b991',[[-5,-21],[-9,-31],[-7,-29],[-2,-22],[7,-22],[10,-31],[12,-33],[10,-27],[8,-21]]);
        rect(ctx,'#743944',1,-19,8,3); rect(ctx,'#f7dba2',4,-19,3,1);
        polygon(ctx,'#ad514b',[[6,-15],[12,-13],[10,-10],[4,-11]]);
        line(ctx,'#653543',3,-10,9,-10,1); rect(ctx,'#edcf9e',7,-10,1,3);
      }
      if (flash) { ctx.globalCompositeOperation = 'source-atop'; rect(ctx,'#fff5dc',-48,-48,96,96); }
      return c;
    });
  }
  function drawEnemy(ctx,g,e,cam,W,H) {
    if (!e || e.boss || e.minion || e.ooaEnemy || e.ooaSentry) return false;
    var kind = enemyKind(e.type); if (!kind) return false;
    if (e.dead) return true;
    var x = Math.round(e.x - cam.x + W / 2), y = Math.round(e.y - cam.y + H / 2);
    if (x < -48 || y < -48 || x > W + 48 || y > H + 48) return true;
    var tortoise = kind === 'tortoise' || kind === 'icetortoise';
    var charging = tortoise && e.chargeT > 0;
    var rushing = kind === 'antlioncharger' && Math.abs(e.vx || 0) > e.speed * 0.75;
    var mummy = kind === 'mummy' || kind === 'lightmummy' || kind === 'darkmummy' || kind === 'bloodmummy';
    var undergroundWalker = kind === 'skeletonarcher' || kind === 'armoredbones' || kind === 'undeadminer';
    var dungeonWalker = kind === 'angrybones' || kind === 'dungeonslime';
    var lavaSlime = kind === 'lavaslime';
    var active = charging || kind === 'unicorn' && e.state === 2 ||
      (kind === 'hornet' || kind === 'mosshornet') && e.attackCd > 2.1 || kind === 'gastropod' && e.attackCd > 2.3 ||
      kind === 'corruptor' && e.attackCd > 1.9 || kind === 'ichorsticker' && e.attackCd > 1.7 ||
      (kind === 'snowflinx' || kind === 'wolf' || kind === 'antlion' || mummy || kind === 'armoredbones' || kind === 'undeadminer' || dungeonWalker || lavaSlime) && !e.onGround && e.vy < -1 ||
      kind === 'skeletonarcher' && e.attackCd > 1.9 || kind === 'cursedskull' && e.attackCd > 2.1 ||
      (kind === 'darkcaster' || kind === 'demon' || kind === 'voodoodemon') && e.attackCd > 2.5 ||
      kind === 'fireimp' && e.attackCd > 2.7 || rushing;
    if (kind === 'chaoselemental') active = (g.fx || []).some(function(f) {
      return f.type === 'teleport' && f.t > 0 && dist2(f.x,f.y,e.x,e.y) < 24 * 24;
    });
    var frame = tortoise && !charging && Math.abs(e.vx || 0) < 0.2 ? 0 : Math.floor(Time.seconds * (charging || rushing ? 14 : 10)) % 4;
    var facing = charging ? e.chargeDir : e.dir;
    if (kind === 'gastropod' || kind === 'cursedskull' || kind === 'darkcaster' || kind === 'demon' || kind === 'voodoodemon' || kind === 'fireimp') {
      if (g.player && g.player.x !== e.x) facing = g.player.x < e.x ? -1 : 1;
    } else if (kind === 'hornet' || kind === 'mosshornet' || kind === 'chaoselemental' || kind === 'corruptor') {
      var target = typeof multiplayerTarget === 'function' ? multiplayerTarget(g,e) : g.player;
      if (target && target.x !== e.x) facing = target.x < e.x ? -1 : 1;
    } else if (!tortoise && !mummy && !undergroundWalker && !dungeonWalker && !lavaSlime && kind !== 'unicorn' && kind !== 'ichorsticker' && kind !== 'snowflinx' && kind !== 'wolf' &&
      kind !== 'antlion' && kind !== 'antlioncharger' && Math.abs(e.vx || 0) > 0.1) facing = e.vx < 0 ? -1 : 1;
    ctx.save();
    try {
      ctx.imageSmoothingEnabled = false; ctx.translate(x,y); if (facing < 0) ctx.scale(-1,1);
      ctx.drawImage(enemySprite(kind,frame,active,e.flash > 0),-48,-48);
      return true;
    } finally { ctx.restore(); }
  }

  var etherianKinds = ['goblin','bomber','javelin','kobold','glider','witherbeast','drakin','wyvern','skeleton','lightningbug'];
  function etherianKind(type) {
    var types = [E.ETHERIANGOBLIN,E.ETHERIANGOBLINBOMBER,E.ETHERIANJAVELIN,E.KOBOLD,E.KOBOLDGLIDER,
      E.WITHERBEAST,E.DRAKIN,E.ETHERIANWYVERN,E.OLDONESSKELETON,E.ETHERIANLIGHTNINGBUG];
    return etherianKinds[types.indexOf(type)] || null;
  }
  function etherianSprite(kind, frame, flash, active) {
    if (etherianKinds.indexOf(kind) < 0) return null;
    return remember('etherian:' + [kind,frame,!!flash,!!active].join(':'),function() {
      var c = surface(96,96), ctx = c.getContext('2d'); ctx.translate(48,48);
      var stride = [0,2,0,-2][frame % 4], flap = [0,3,0,-3][frame % 4];
      if (kind === 'goblin' || kind === 'bomber' || kind === 'javelin') {
        // Shared olive faces, with distinct costumes, equipment and proportions.
        var skin = kind === 'bomber' ? '#9b9669' : '#8eaa71', tall = kind === 'javelin' ? -2 : 0;
        line(ctx,INK,-4,4,-5 - stride,12,5); line(ctx,'#6b5748',-4,4,-5 - stride,11,3);
        line(ctx,INK,3,4,4 + stride,12,5); line(ctx,'#987757',3,4,4 + stride,11,3);
        rect(ctx,'#4c4042',-8 - stride,12,6,3); rect(ctx,'#594849',2 + stride,12,7,3);
        polygon(ctx,INK,[[-7,-9 + tall],[6,-9 + tall],[9,5],[-8,6]]);
        polygon(ctx,kind === 'javelin' ? '#6a7881' : '#785b4c',[[-6,-8 + tall],[5,-8 + tall],[7,4],[-6,4]]);
        rect(ctx,kind === 'javelin' ? '#a4b0a5' : '#af9168',-5,-7 + tall,3,9);
        rect(ctx,'#443940',-7,2,14,3); rect(ctx,'#c9b37c',0,2,3,2);
        // Long, stepped ears and a hooked nose read at native resolution.
        polygon(ctx,INK,[[-5,-15 + tall],[-15,-18 + tall],[-10,-10 + tall],[-4,-9 + tall]]);
        polygon(ctx,skin,[[-6,-14 + tall],[-12,-16 + tall],[-9,-11 + tall],[-4,-10 + tall]]);
        polygon(ctx,INK,[[4,-15 + tall],[13,-17 + tall],[10,-10 + tall],[3,-9 + tall]]);
        polygon(ctx,skin,[[4,-14 + tall],[10,-15 + tall],[8,-11 + tall],[3,-10 + tall]]);
        oval(ctx,0,-12 + tall,8,7,INK); oval(ctx,0,-12 + tall,6,5,skin);
        rect(ctx,'#c0c196',-3,-15 + tall,5,2); rect(ctx,'#d8d5aa',3,-13 + tall,3,2);
        rect(ctx,'#303b40',5,-13 + tall,1,2); rect(ctx,skin,6,-10 + tall,4,3);
        rect(ctx,'#4b4b40',4,-6 + tall,5,1); rect(ctx,'#e0d1ab',6,-6 + tall,1,2);
        if (kind === 'goblin') {
          rect(ctx,'#4b4546',-6,-19,10,4); rect(ctx,'#a27b51',-5,-19,7,2);
          line(ctx,INK,5,-5,11,2 + stride,5); line(ctx,skin,5,-5,10,1 + stride,3);
          line(ctx,'#c4cfbd',11,0 + stride,14,-7 + stride,2); rect(ctx,'#bea06d',9,1 + stride,5,2);
        } else if (kind === 'bomber') {
          oval(ctx,-9,-1,7,10,INK); oval(ctx,-9,-2,5,8,'#966b4b');
          rect(ctx,'#c4a575',-13,-7,8,2); rect(ctx,'#c4a575',-13,2,8,2);
          line(ctx,'#52484c',-12,-7,-12,2,1); line(ctx,'#52484c',-7,-7,-7,2,1);
          line(ctx,'#d3bd8b',-9,-11,-10,-16,1); rect(ctx,frame % 2 ? '#f1cc8e' : '#d39063',-11,-18,2,2);
          rect(ctx,'#655348',-6,-19,13,4); rect(ctx,'#b8a075',-4,-19,9,1);
          line(ctx,INK,5,-5,11,-1,5); line(ctx,skin,5,-5,10,-1,3);
          oval(ctx,12,1,4,5,'#4a4448'); rect(ctx,'#b9a37a',11,-2,3,2);
        } else {
          polygon(ctx,'#43505f',[[-7,-17],[-4,-23],[5,-22],[9,-17]]);
          rect(ctx,'#a7b2aa',-5,-19,11,2); rect(ctx,'#d7c8a4',-3,-21,5,1);
          polygon(ctx,'#7e514d',[[-3,-22],[-7,-28],[-1,-26],[3,-22]]);
          var jy = active ? -13 : -5;
          line(ctx,INK,5,-6,11,jy + 3,5); line(ctx,skin,5,-6,11,jy + 3,3);
          line(ctx,'#514649',-4,jy,23,jy - 3,3); line(ctx,'#d0b584',-3,jy - 1,22,jy - 4,1);
          polygon(ctx,'#c3d3cd',[[22,jy - 7],[29,jy - 4],[22,jy - 1]]);
          rect(ctx,'#c4a985',9,jy,4,3);
        }
      } else if (kind === 'kobold' || kind === 'glider') {
        var glider = kind === 'glider', baseY = glider ? -4 : -1;
        if (glider) {
          // Stitched canvas, spars and suspension ropes; no invented bomb attack.
          polygon(ctx,INK,[[-28,-12 - flap],[-9,-27],[26,-13 + flap],[2,-10]]);
          polygon(ctx,'#bca47b',[[-25,-13 - flap],[-8,-24],[23,-14 + flap],[2,-12]]);
          polygon(ctx,'#8c715d',[[-7,-23],[-4,-13],[22,-14 + flap]]);
          line(ctx,'#e0c99a',-8,-24,2,-12,1); line(ctx,'#5d514c',-25,-13 - flap,23,-14 + flap,2);
          line(ctx,'#b49a74',-17,-14, -5,-3,1); line(ctx,'#b49a74',14,-14,5,-3,1);
          rect(ctx,'#ddd0a3',-14,-18,2,2); rect(ctx,'#675648',9,-15,2,2);
        }
        line(ctx,INK,-5,3 + baseY,-17,8 + baseY,5); line(ctx,'#a47252',-5,3 + baseY,-17,7 + baseY,3);
        line(ctx,INK,-4,6 + baseY,-8 - stride,12 + baseY,5);
        line(ctx,'#986b50',-4,6 + baseY,-8 - stride,11 + baseY,3);
        line(ctx,INK,4,5 + baseY,6 + stride,12 + baseY,5);
        line(ctx,'#c79564',4,5 + baseY,6 + stride,11 + baseY,3);
        rect(ctx,'#e0c59a',-9 - stride,12 + baseY,5,2); rect(ctx,'#e0c59a',4 + stride,12 + baseY,6,2);
        oval(ctx,0,baseY,9,10,INK); oval(ctx,0,-1 + baseY,7,8,'#ac7854');
        oval(ctx,2,1 + baseY,4,5,'#d3aa77');
        oval(ctx,3,-9 + baseY,8,7,INK); oval(ctx,3,-10 + baseY,6,5,'#c38f61');
        polygon(ctx,'#c4ae83',[[-2,-14 + baseY],[-5,-21 + baseY],[2,-15 + baseY]]);
        oval(ctx,9,-7 + baseY,6,3,'#d5aa78'); rect(ctx,'#493e3f',12,-8 + baseY,1,1);
        rect(ctx,'#ece1b5',6,-12 + baseY,3,2); rect(ctx,'#403e41',8,-12 + baseY,1,2);
        line(ctx,'#4a3c40',6,-4 + baseY,13,-4 + baseY,1);
        if (!glider) {
          oval(ctx,-7,-2,6,8,'#4d3e43'); oval(ctx,-7,-3,4,6,'#9e6c4f');
          rect(ctx,'#c6ac7d',-11,-7,8,2); rect(ctx,'#c6ac7d',-11,1,8,2);
          line(ctx,'#c5ae80',-8,-10,-10,-14,1); rect(ctx,frame % 2 ? '#efd69b' : '#ce8d60',-12,-16,3,2);
          line(ctx,'#73513f',-3,-4,5,3,2);
        }
        line(ctx,INK,6,-2 + baseY,12,2 + baseY,4); line(ctx,'#c59465',6,-2 + baseY,12,2 + baseY,2);
      } else if (kind === 'witherbeast') {
        // A heavy, four-legged crystal-backed beast, not another humanoid.
        for (var leg = -1; leg <= 1; leg += 2) {
          line(ctx,INK,leg * 9,4,leg * 11 + stride,15,7);
          line(ctx,'#766887',leg * 9,4,leg * 11 + stride,14,4);
          rect(ctx,'#b1a2ba',leg * 11 + stride - 2,14,6,2);
        }
        oval(ctx,-2,0,17,12,INK); oval(ctx,-3,-1,15,10,'#756380');
        for (var plate = -2; plate <= 1; plate++) {
          var bx = plate * 6;
          polygon(ctx,'#3e3a51',[[bx - 4,-4],[bx - 2,-17],[bx + 3,-21 - frame % 2],[bx + 5,-5]]);
          polygon(ctx,active ? '#b6a7cd' : '#9483aa',[[bx - 2,-5],[bx,-16],[bx + 2,-18],[bx + 3,-5]]);
          line(ctx,'#d2bfce',bx,-14,bx + 1,-7,1);
        }
        oval(ctx,11,2,9,8,INK); oval(ctx,12,1,7,6,'#8d7c96');
        oval(ctx,16,5,7,4,'#b1a0af'); rect(ctx,active ? '#ead9e3' : '#cbbb9d',14,-1,3,2);
        rect(ctx,'#393847',16,-1,1,2); rect(ctx,'#4f4655',18,4,2,1);
        line(ctx,'#d3c4b4',12,-4,9,-10,2); line(ctx,'#4c4053',10,8,20,8,1);
      } else if (kind === 'drakin') {
        line(ctx,INK,-4,5,-19,11,6); line(ctx,'#9f6557',-4,4,-19,10,3);
        line(ctx,INK,-4,5,-7 - stride,15,6); line(ctx,'#ac6f5b',-4,5,-7 - stride,14,3);
        line(ctx,INK,5,5,7 + stride,15,6); line(ctx,'#c68d69',5,5,7 + stride,14,3);
        rect(ctx,'#d8bd91',-9 - stride,15,6,2); rect(ctx,'#d8bd91',5 + stride,15,7,2);
        oval(ctx,0,-1,11,13,INK); oval(ctx,0,-2,9,11,'#a96657');
        oval(ctx,4,1,5,8,'#d2a17a');
        for (var rib = -5; rib <= 4; rib += 3) line(ctx,'#956653',1,rib,7,rib,1);
        polygon(ctx,'#a9967c',[[-9,-9],[-13,-13],[-12,-4],[-8,-2]]);
        line(ctx,INK,6,-7,12,-3,5); line(ctx,'#c18763',6,-7,12,-3,3);
        oval(ctx,3,-14,9,8,INK); oval(ctx,3,-15,7,6,'#b57660');
        oval(ctx,10,-11,9,4,'#cd9871'); rect(ctx,'#56404a',15,-12,2,1);
        line(ctx,'#e0cba2',-1,-18,-3,-24,2); line(ctx,'#e0cba2',8,-19,10,-23,2);
        rect(ctx,'#e7ca8d',6,-17,4,2); rect(ctx,'#393646',8,-17,1,2);
        line(ctx,'#4e3944',7,-8,17,-8,1);
        if (active) { rect(ctx,'#dc9d72',11,-7,6,2); rect(ctx,'#efd1a0',14,-7,2,1); }
      } else if (kind === 'wyvern') {
        polygon(ctx,INK,[[-6,1],[-16,-8],[-26,-20 + flap],[-28,-8],[-20,-6],[-16,1]]);
        polygon(ctx,'#b87761',[[-7,0],[-16,-10],[-24,-17 + flap],[-25,-10],[-19,-8],[-15,-1]]);
        polygon(ctx,INK,[[0,-1],[7,-22 - flap],[19,-15],[27,-7],[17,-7],[11,1]]);
        polygon(ctx,'#ce9b79',[[2,-2],[8,-19 - flap],[18,-13],[23,-9],[16,-9],[10,-1]]);
        line(ctx,'#e6bd90',2,-1,8,-19 - flap,1); line(ctx,'#85515a',9,-14,18,-12,1);
        line(ctx,INK,-10,2,-26,8,5); line(ctx,'#bd7f60',-10,1,-26,7,3);
        polygon(ctx,'#b8b08c',[[-25,7],[-30,3],[-29,11]]);
        oval(ctx,-1,2,15,7,INK); oval(ctx,0,1,13,5,'#ae695a');
        line(ctx,'#d0a57d',-8,4,9,4,2);
        line(ctx,INK,10,0,15,-6,8); line(ctx,'#c78c69',10,-1,15,-7,5);
        oval(ctx,18,-6,8,6,INK); oval(ctx,18,-7,6,4,'#bc7a61');
        rect(ctx,'#d5a880',20,-5,10,3); rect(ctx,'#4f3b46',26,-5,3,1);
        rect(ctx,'#ecda9c',20,-9,3,2); rect(ctx,'#373643',22,-9,1,2);
        line(ctx,'#ddc498',14,-11,12,-16,2);
        line(ctx,'#8e5e54',-3,5,-1,11,3); line(ctx,'#8e5e54',8,5,10,10,3);
        rect(ctx,'#ddc498',-2,11,5,2); rect(ctx,'#ddc498',9,10,5,2);
      } else if (kind === 'skeleton') {
        line(ctx,INK,-4,1,-6 - stride,13,4); line(ctx,'#c0b4ab',-4,1,-6 - stride,13,2);
        line(ctx,INK,3,1,5 + stride,13,4); line(ctx,'#e0d1b5',3,1,5 + stride,13,2);
        rect(ctx,'#998d91',-8 - stride,13,5,2); rect(ctx,'#ddceb3',4 + stride,13,5,2);
        rect(ctx,'#8d788c',-6,-8,12,11); rect(ctx,'#dccbb6',-1,-10,2,13);
        for (var bone = -7; bone <= -1; bone += 3) {
          line(ctx,'#d4c6b0',-5,bone,-2,bone + 1,1); line(ctx,'#d4c6b0',2,bone + 1,5,bone,1);
        }
        rect(ctx,'#b4a28f',-5,2,10,3); rect(ctx,'#e1cfb0',-3,3,6,2);
        oval(ctx,0,-15,8,8,INK); oval(ctx,0,-16,6,6,'#ddcfb8');
        rect(ctx,'#504452',-4,-18,3,4); rect(ctx,'#504452',2,-18,3,4);
        rect(ctx,'#9a7495',-3,-17,1,1); rect(ctx,'#9a7495',3,-17,1,1);
        rect(ctx,'#67545d',0,-13,2,2); rect(ctx,'#e5d7bb',-3,-10,7,3);
        rect(ctx,'#68515a',-1,-9,1,2); rect(ctx,'#68515a',2,-9,1,2);
        line(ctx,'#c8bba5',-5,-7,-10,-1 - stride,2); line(ctx,'#e0d1b5',5,-7,10,1 + stride,2);
        polygon(ctx,'#715b78',[[-6,-10],[-9,-4],[-8,6],[-4,2],[-5,-5]]);
      } else {
        // Glowing beetle abdomen, shell seam, three pairs of legs and glass wings.
        for (var side = -1; side <= 1; side += 2) {
          polygon(ctx,'#496a7b',[[0,-4],[side * 18,-14 - flap],[side * 22,-9 - flap],[side * 11,0]]);
          polygon(ctx,'#9bbec6',[[side * 2,-4],[side * 18,-12 - flap],[side * 19,-9 - flap],[side * 10,-2]]);
          line(ctx,'#d4e0d1',side * 5,-5,side * 17,-10 - flap,1);
        }
        for (var pair = -1; pair <= 1; pair++) {
          line(ctx,'#405365',pair * 5,-1,pair * 6 - 3,7 + frame % 2,2);
          line(ctx,'#9cbdc3',pair * 6 - 3,7 + frame % 2,pair * 6 + 1,10,1);
        }
        oval(ctx,-4,0,12,8,INK); oval(ctx,-4,-1,10,6,'#779ba7');
        oval(ctx,-8,1,6,4,active ? '#e1e6b2' : '#b1d5c8');
        line(ctx,'#d6e6cf',-14,-1,-7,3,1); line(ctx,'#4d6d81',-3,-6,-1,5,2);
        oval(ctx,7,-2,7,6,'#3d5264'); oval(ctx,7,-3,5,4,'#90b6bc');
        oval(ctx,11,-4,3,3,active ? '#f3e8b8' : '#d8d4a5'); rect(ctx,'#52606a',12,-5,1,2);
        line(ctx,'#aacdd0',8,-6,11,-11,1); line(ctx,'#aacdd0',11,-11,15,-10,1);
        rect(ctx,'#dce6d0',14,-11,2,2);
      }
      if (flash) { ctx.globalCompositeOperation = 'source-atop'; rect(ctx,'#fff5dc',-48,-48,96,96); }
      return c;
    });
  }
  function drawOOAEnemy(ctx,g,e,cam,W,H) {
    if (!e || !e.ooaEnemy || e.ooaBoss) return false;
    var kind = etherianKind(e.type);
    if (!kind) return false;
    if (e.dead) return true;
    var x = Math.round(e.x - cam.x + W / 2), y = Math.round(e.y - cam.y + H / 2);
    if (x < -48 || y < -48 || x > W + 48 || y > H + 48) return true;
    var frame = Math.floor(Time.seconds * (e.fly ? 10 : 8)) % 4;
    var active = e.attackCd > (kind === 'drakin' ? 1.0 : kind === 'lightningbug' ? 0.8 : 1.7);
    ctx.save();
    try {
      ctx.imageSmoothingEnabled = false; ctx.translate(x,y); if (e.dir < 0) ctx.scale(-1,1);
      ctx.drawImage(etherianSprite(kind,frame,e.flash > 0,active),-48,-48);
      return true;
    } finally { ctx.restore(); }
  }

  function arenaSprite(kind, frame, active) {
    if (['crystal','portal','ballista','flameburst','explosivetrap','lightningaura','lightningfield'].indexOf(kind) < 0) return null;
    return remember('arena:' + [kind,frame,!!active].join(':'), function() {
      var size = kind === 'lightningfield' ? 200 : 96;
      var c = surface(size,size), ctx = c.getContext('2d'); ctx.translate(size / 2,size / 2);
      if (kind === 'crystal') {
        // A stone/metal pedestal behind the faceted objective crystal.
        rect(ctx, '#313f53', -12, 15, 24, 9); rect(ctx, '#7b8b99', -11, 16, 22, 6);
        rect(ctx, '#bac7bf', -10, 16, 20, 2); rect(ctx, '#4c6278', -7, 20, 14, 3);
        rect(ctx, '#b0bba7', -8, 22, 16, 1); rect(ctx, '#99b6c6', -2, 19, 4, 3);
        var pal = active ? ['#634b68','#ad7e96','#dfb6bd','#f3dfcd'] : ['#354c6b','#6296b0','#a0ccd4','#d9eade'];
        polygon(ctx, pal[0], [[0,-20],[12,-1],[8,8],[0,17],[-9,7],[-12,-1]]);
        polygon(ctx, pal[1], [[0,-18],[10,-1],[6,7],[0,14],[-7,6],[-10,-1]]);
        polygon(ctx, pal[2], [[0,-17],[1,-2],[-7,5],[-9,-1]]);
        polygon(ctx, pal[3], [[0,-17],[5,-2],[1,-2]]);
        polygon(ctx, pal[2], [[1,-2],[9,-1],[6,6],[0,13]]);
        line(ctx, pal[3], -7, -3, 0, -15, 1); line(ctx, pal[0], -7, 6, 1, -2, 1);
        rect(ctx, '#f5f2d8', -3 + frame % 3, -11, 1, 3);
        if (active) {
          line(ctx, '#73506a', -4, -7, 1, -1, 1); line(ctx, '#73506a', 1, -1, -2, 7, 1);
          line(ctx, '#efd4c4', 2, -1, 5, 3, 1);
        }
      } else if (kind === 'portal') {
        oval(ctx,0,0,20,33,'#393047'); oval(ctx,0,0,18,31,'#72548b'); oval(ctx,0,0,16,29,'#b08aba');
        ctx.save(); ctx.globalCompositeOperation = 'destination-out'; oval(ctx,0,0,14,27,'#000'); ctx.restore();
        for (var rune = 0; rune < 10; rune++) {
          var a = rune * Math.PI / 5, x = Math.round(Math.cos(a) * 17), y = Math.round(Math.sin(a) * 30);
          rect(ctx, (rune + frame) % 4 ? '#8e759f' : '#e4c3d5', x - 1,y - 1,2,3);
        }
        // Sparse energy strands leave most of the portal interior transparent.
        for (var strand = -1; strand <= 1; strand++) for (var row = -22; row <= 22; row += 3) {
          var sx = strand * 5 + Math.round(Math.sin((row + frame * 4) / 9) * 3);
          rect(ctx, (row + frame + strand + 24) % 4 ? '#655078' : '#a68cb6', sx,row,1,2);
        }
      } else if (kind === 'lightningfield') {
        // This is a decorative field, not a targeting or damage calculation.
        oval(ctx,0,0,90,90,'#729ba8');
        ctx.save(); ctx.globalCompositeOperation = 'destination-out'; oval(ctx,0,0,89,89,'#000'); ctx.restore();
        for (var node = 0; node < 12; node++) {
          var na = node * Math.PI / 6, nx = Math.round(Math.cos(na) * 85), ny = Math.round(Math.sin(na) * 85);
          var bright = (node + frame) % 4 === 0;
          line(ctx,bright ? '#c8e0d1' : '#638e9d',nx - 2,ny,nx + 2,ny,1);
          line(ctx,bright ? '#c8e0d1' : '#638e9d',nx,ny - 2,nx,ny + 2,1);
          if (bright) { line(ctx,'#a4cbd0',nx,ny,nx - 4,ny + 7,1); line(ctx,'#a4cbd0',nx - 4,ny + 7,nx + 1,ny + 10,1); }
        }
      } else {
        // Shared carved footing; the four devices have different silhouettes.
        rect(ctx,'#303a4b',-12,1,24,7); rect(ctx,'#76614f',-11,2,22,5);
        rect(ctx,'#b69c72',-10,2,20,1); rect(ctx,'#485668',-7,5,14,2);
        rect(ctx,'#d5c398',-9,4,2,2); rect(ctx,'#d5c398',7,4,2,2);
        if (kind === 'ballista') {
          rect(ctx,'#3d3c48',-5,-12,10,14); rect(ctx,'#947955',-4,-11,8,12);
          rect(ctx,'#c9ae7d',-3,-10,2,10); rect(ctx,'#596b79',-7,-5,14,3);
          var recoil = active ? -1 : 0;
          line(ctx,'#3d3c48',-10 + recoil,-14,17 + recoil,-14,5);
          line(ctx,'#b99a66',-9 + recoil,-15,16 + recoil,-15,2);
          line(ctx,'#4f4b4e',4 + recoil,-24,11 + recoil,-14,3);
          line(ctx,'#4f4b4e',11 + recoil,-14,4 + recoil,-4,3);
          line(ctx,'#dcc48d',4 + recoil,-23,10 + recoil,-14,1);
          line(ctx,'#dcc48d',10 + recoil,-14,4 + recoil,-5,1);
          line(ctx,'#a8b6b2',3 + recoil,-23,0 + recoil,-14,1);
          line(ctx,'#a8b6b2',0 + recoil,-14,3 + recoil,-5,1);
          if (!active) {
            line(ctx,'#d8c39a',0,-16,18,-16,1);
            polygon(ctx,frame % 2 ? '#d9e0cb' : '#becdbf',[[16,-18],[21,-16],[16,-14]]);
          }
        } else if (kind === 'flameburst') {
          rect(ctx,'#4b4049',-6,-7,12,9); rect(ctx,'#a47c55',-5,-6,10,7);
          oval(ctx,0,-14,10,10,'#3e3d4b'); oval(ctx,-1,-15,8,8,'#ab855c');
          oval(ctx,-2,-17,5,4,'#d7b27b'); rect(ctx,'#675249',-7,-13,14,4);
          rect(ctx,'#d8b986',-6,-13,12,1); rect(ctx,'#364654',5,-17,14,7);
          rect(ctx,'#9d9f91',6,-16,11,5); rect(ctx,'#ddd1a9',7,-16,10,1);
          rect(ctx,'#31424e',16,-15,3,3);
          var tip = -26 - frame % 2 * 2;
          polygon(ctx,'#b46e58',[[-5,-20],[-4,tip + 3],[-1,tip + 5],[2,tip],[5,-20]]);
          polygon(ctx,active ? '#f5d39a' : '#dcac76',[[-3,-20],[-2,tip + 5],[1,tip + 4],[3,-20]]);
          rect(ctx,'#f6e4b7',-1,-23,2,3);
        } else if (kind === 'explosivetrap') {
          rect(ctx,'#343f4d',-17,-3,34,6); rect(ctx,'#9c997d',-16,-2,32,3);
          rect(ctx,'#d7c79b',-15,-2,30,1); rect(ctx,'#5d5d56',-13,0,26,2);
          rect(ctx,'#775a4c',-8,-8,16,6); rect(ctx,'#c5a36b',-7,-7,14,4);
          rect(ctx,'#473d43',-5,-6,10,3); rect(ctx,active ? '#8e7767' : '#e1bd7e',-3,-6,6,2);
          [-1,1].forEach(function(side) { rect(ctx,'#c1b38c',side < 0 ? -13 : 10,-5,3,4); rect(ctx,'#5a5150',side < 0 ? -12 : 11,-5,1,3); });
          rect(ctx,active ? '#a18a70' : frame % 2 ? '#e4d4a0' : '#cbb87f',-1,-9,2,2);
        } else {
          rect(ctx,'#394b60',-5,-12,10,14); rect(ctx,'#7799a7',-4,-11,8,12);
          rect(ctx,'#c6dbd2',-2,-9,2,9); rect(ctx,'#45647c',-6,-5,12,3);
          polygon(ctx,'#425d79',[[0,-26],[6,-18],[3,-10],[-3,-10],[-6,-18]]);
          polygon(ctx,active ? '#d9edda' : '#a8d0d2',[[0,-24],[4,-18],[1,-12],[-2,-12],[-4,-18]]);
          line(ctx,'#e8eed4',-1,-21,0,-15,1);
          [-1,1].forEach(function(side) {
            line(ctx,'#42566d',side * 5,-10,side * 10,-20,3);
            line(ctx,'#a6bfc2',side * 5,-11,side * 10,-21,1);
            rect(ctx,'#c8dccf',side * 10 - 1,-23 + frame % 2,2,3);
          });
        }
      }
      return c;
    });
  }

  function drawArenaPart(ctx,kind,x,y,frame,active,mirror) {
    var c = arenaSprite(kind,frame,active);
    ctx.save(); ctx.imageSmoothingEnabled = false;
    ctx.translate(Math.round(x),Math.round(y)); if (mirror) ctx.scale(-1,1);
    ctx.drawImage(c,-c.width / 2,-c.height / 2); ctx.restore();
  }
  function drawOOAWorld(ctx,g,cam,W,H) {
    var ev = g.event;
    if (!ev || ev.type !== 'oldonesarmy') return false;
    ctx.save();
    try {
      ctx.imageSmoothingEnabled = false;
      var frame = Math.floor(Time.seconds * 8) % 4;
      var x = ev.crystalX - cam.x + W / 2, y = ev.crystalY - cam.y + H / 2;
      if (x > -48 && y > -48 && x < W + 48 && y < H + 48) {
        ctx.save(); ctx.globalAlpha *= 0.12;
        oval(ctx,Math.round(x),Math.round(y),22,24,'#91c7cf'); ctx.restore();
        drawArenaPart(ctx,'crystal',x,y,frame,ev.crystalMaxHp > 0 && ev.crystalHp <= ev.crystalMaxHp * 0.25,false);
      }
      [ev.leftPortalX,ev.rightPortalX].forEach(function(px,i) {
        var sx = px - cam.x + W / 2, sy = ev.portalY - cam.y + H / 2 - 20;
        if (sx < -48 || sy < -48 || sx > W + 48 || sy > H + 48) return;
        ctx.save(); ctx.globalAlpha *= 0.09;
        oval(ctx,Math.round(sx),Math.round(sy),25,37,'#a481bd'); ctx.restore();
        drawArenaPart(ctx,'portal',sx,sy,frame,false,i === 0);
      });
      return true;
    } finally { ctx.restore(); }
  }
  function drawOOASentry(ctx,g,s,cam,W,H) {
    if (!s || !s.ooaSentry || ['ballista','flameburst','explosivetrap','lightningaura'].indexOf(s.sentry) < 0) return false;
    if (s.dead) return true;
    ctx.save();
    try {
      var x = s.x - cam.x + W / 2, y = s.y - cam.y + H / 2;
      var frame = Math.floor(Time.seconds * 8) % 4, target = null;
      var range = s.sentry === 'ballista' ? 520 : s.sentry === 'flameburst' ? 340 : 90, nearest = range * range;
      // Read-only counterpart of the simulation's nearest Etherian target rule.
      (g.entities || []).forEach(function(e) {
        if (e.dead || !e.ooaEnemy) return;
        var dx = e.x - s.x, dy = e.y - s.y, d = dx * dx + dy * dy;
        if (d < nearest) { nearest = d; target = e; }
      });
      if (s.sentry === 'lightningaura') {
        ctx.save(); ctx.globalAlpha *= 0.18;
        drawArenaPart(ctx,'lightningfield',x,y,frame,false,false); ctx.restore();
      }
      var active = s.sentry === 'ballista' ? s.attackCd > 0.97 : s.sentry === 'flameburst' ? s.attackCd > 0.43 : s.attackCd > 0;
      drawArenaPart(ctx,s.sentry,x,y,frame,active,
        (s.sentry === 'ballista' || s.sentry === 'flameburst') && target && target.x < s.x);
      return true;
    } finally { ctx.restore(); }
  }

  function drawPart(ctx, kind, x, y, w, h, phase, frame, flash, angle, mirror) {
    var m = metrics[kind];
    ctx.save(); ctx.imageSmoothingEnabled = false;
    ctx.translate(Math.round(x), Math.round(y));
    if (angle) ctx.rotate(Math.round(angle * 24 / (Math.PI * 2)) * Math.PI * 2 / 24);
    ctx.scale(mirror ? -1 : 1, 1);
    var sx = w / m[0], sy = h / m[1];
    ctx.drawImage(bossSprite(kind, phase, frame, flash), -48 * sx, -48 * sy, 96 * sx, 96 * sy);
    ctx.restore();
  }
  function drawBoss(ctx, game, e, cam, W, H) {
    if (!metrics[e.boss] || e.armType) return false;
    if (e.ooaBoss && e.boss !== 'darkmage' && e.boss !== 'ogre' && e.boss !== 'betsy') return false;
    if (e.boss === 'lunar' && !metrics['pillar_' + e.pillarType]) return false;
    ctx.save();
    try { return paintBoss(ctx, game, e, cam, W, H); }
    finally { ctx.restore(); }
  }
  function paintBoss(ctx, game, e, cam, W, H) {
    var x = e.x - cam.x + W / 2, y = e.y - cam.y + H / 2;
    var phase = !!e.phase2, frame = Math.floor(Time.seconds * 8) % 4, flash = e.flash > 0;
    var angle = Math.atan2(game.player.y - e.y, game.player.x - e.x);
    if (e.boss === 'skelprime' && e.armCount <= 0) phase = true;
    if (e.boss === 'lunar') phase = !!e.shieldDown;
    if (e.boss === 'eaterofworlds' || e.boss === 'destroyer') {
      var metal = e.boss === 'destroyer';
      var segments = e.segments || [];
      for (var i = segments.length - 1; i >= 0; i--) {
        var s = segments[i];
        if (s.dead) continue;
        var sx = s.x - cam.x + W / 2, sy = s.y - cam.y + H / 2;
        if (sx < -60 || sy < -60 || sx > W + 60 || sy > H + 60) continue;
        var prev = i === 0 ? e : segments[i - 1];
        var partKind = metal ? (i === segments.length - 1 ? 'destroyertail' : 'destroyerbody') : (i === segments.length - 1 ? 'wormtail' : 'wormbody');
        drawPart(ctx, partKind, sx, sy, s.w, s.h,
          phase, i % 2, s.flash > 0, Math.atan2(prev.y - s.y, prev.x - s.x), false);
      }
      angle = Number.isFinite(e.segAng) ? e.segAng : angle;
      if (metal && (e.vx || e.vy)) angle = Math.atan2(e.vy || 0, e.vx || 0);
      // Ports sit on top of the continuous armor, not underneath the next
      // overlapping segment. This is a cosmetic pass over live segments only.
      if (metal) segments.forEach(function(s, i) {
        if (s.dead) return;
        var sx = s.x - cam.x + W / 2, sy = s.y - cam.y + H / 2;
        if (sx < -60 || sy < -60 || sx > W + 60 || sy > H + 60) return;
        var prev = i === 0 ? e : segments[i - 1];
        var a = Math.atan2(prev.y - s.y, prev.x - s.x);
        ctx.save(); ctx.translate(Math.round(sx), Math.round(sy));
        ctx.rotate(Math.round(a * 24 / (Math.PI * 2)) * Math.PI * 2 / 24);
        ctx.scale(s.w / 28, s.h / 18);
        var flashPort = s.flash > 0;
        rect(ctx, flashPort ? '#fff5dc' : '#3a3b4e', -4, -3, 5, 6);
        rect(ctx, flashPort ? '#fff5dc' : phase ? '#f2b598' : frame % 2 ? '#df8a83' : '#b46271', -3, -2, 3, 4);
        rect(ctx, flashPort ? '#fff5dc' : '#f4d2a9', -3, -2, 1, 1);
        ctx.restore();
      });
      if (metal) (e.probes || []).forEach(function(pr) {
        if (pr.dead) return;
        var px = pr.x - cam.x + W / 2, py = pr.y - cam.y + H / 2;
        if (px < -40 || py < -40 || px > W + 40 || py > H + 40) return;
        drawPart(ctx, 'probe', px, py, pr.w, pr.h, phase, frame, pr.flash > 0,
          Math.atan2(game.player.y - pr.y, game.player.x - pr.x), false);
      });
    }
    if (e.boss === 'skeletron') {
      (e.arms || []).forEach(function(arm) {
        if (arm.dead) return;
        var ax = arm.x - cam.x + W / 2, ay = arm.y - cam.y + H / 2;
        if (ax < -60 || ay < -60 || ax > W + 60 || ay > H + 60) return;
        var elbowX = (x + ax) / 2 + (arm.side === 'left' ? -12 : 12), elbowY = (y + ay) / 2 + 12;
        line(ctx, '#534654', x, y + 6, elbowX, elbowY, 5);
        line(ctx, '#b7b09e', x, y + 6, elbowX, elbowY, 2);
        line(ctx, '#534654', elbowX, elbowY, ax, ay, 4);
        line(ctx, '#d0c6ab', elbowX, elbowY, ax, ay, 2);
        drawPart(ctx, 'hand', ax, ay, arm.w, arm.h, phase, frame, arm.flash > 0, 0, arm.side === 'left');
      });
    }
    if (e.boss === 'skelprime') {
      (e.arms || []).forEach(function(arm) {
        if (arm.dead || !metrics['prime_' + arm.armType]) return;
        var ax = arm.x - cam.x + W / 2, ay = arm.y - cam.y + H / 2;
        if (ax < -60 || ay < -60 || ax > W + 60 || ay > H + 60) return;
        var elbowX = (x + ax) / 2 + (ax < x ? -12 : 12), elbowY = (y + ay) / 2 + 10;
        line(ctx, '#344257', x, y + 5, elbowX, elbowY, 6);
        line(ctx, '#98aebc', x, y + 4, elbowX, elbowY - 1, 2);
        line(ctx, '#344257', elbowX, elbowY, ax, ay, 5);
        line(ctx, '#a9bdc3', elbowX, elbowY - 1, ax, ay - 1, 2);
        rect(ctx, '#4b6176', elbowX - 3, elbowY - 3, 6, 6);
        rect(ctx, '#c0cdcc', elbowX - 1, elbowY - 1, 2, 2);
        drawPart(ctx, 'prime_' + arm.armType, ax, ay, arm.w, arm.h, phase, frame, arm.flash > 0,
          arm.armType === 'saw' ? 0 : Math.atan2(game.player.y - arm.y, game.player.x - arm.x), false);
      });
    }
    if (x < -100 || y < -100 || x > W + 100 || y > H + 100) return true;
    var mirror = e.boss === 'queenbee' || e.boss === 'duke' || e.boss === 'santank' || e.boss === 'piratecaptain' || e.boss === 'goblinwarlock' ? game.player.x < e.x : e.boss === 'wallofflesh' && e.moveDir < 0;
    if (e.boss === 'deerclops' || e.boss === 'flyingdutchman' || e.boss === 'mothron' || e.boss === 'darkmage' || e.boss === 'ogre' || e.boss === 'betsy') mirror = e.dir < 0;
    var rotate = e.boss === 'eyeofcthulhu' || e.boss === 'eaterofworlds' || e.boss === 'destroyer' || e.boss === 'twins' ? angle :
      e.boss === 'skeletron' && e.charge > 0 ? Math.floor(Time.seconds * 10) * Math.PI / 6 : 0;
    if (e.boss === 'skelprime' && e.armCount <= 0) rotate = Number.isFinite(e.spin) ? e.spin : Time.seconds * 4;
    var kind = e.boss === 'twins' ? (e.sub === 'retinazer' ? 'retinazer' : 'spazmatism') : e.boss;
    if (e.boss === 'lunar') kind = 'pillar_' + e.pillarType;
    drawPart(ctx, kind, x, y, e.w, e.h, phase, frame, flash, rotate, mirror);
    if (e.boss === 'lunar' && !e.shieldDown && e.shieldMax > 0) {
      ctx.fillStyle = '#fff5dc'; ctx.font = '11px monospace'; ctx.textAlign = 'center';
      ctx.fillText('Shield ' + Math.max(0, Math.round(e.shieldHp / e.shieldMax * 100)) + '%', Math.round(x), Math.round(y + e.h / 2 + 16));
    }
    return true;
  }

  function ramp(base) {
    var m = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(base);
    var rgb = m ? [Number(m[1]), Number(m[2]), Number(m[3])] : hexToRgb(base);
    return [-48, -18, 24, 65].map(function(delta) {
      return '#' + rgb.map(function(v) { return clamp(v + delta, 0, 255).toString(16).padStart(2, '0'); }).join('');
    });
  }
  function projectileKind(p) {
    if (p.deployMode || p.channelBeam || p.tether || p.controlled || p.spear || p.mineArmed || p.piranha) return null;
    if (p.type === P.ARROW) return 'arrow';
    if (p.type === P.DART) return 'dart';
    if (p.type === P.GUNBULLET) return 'bullet';
    if (p.type === P.LASER || p.type === P.DEATHLASER) return 'laser';
    if (p.type === P.ROCKET) return 'rocket';
    if (p.type === P.STINGER) return 'stinger';
    if (p.type === P.STAR) return 'star';
    if (p.type === P.MAGICBOLT || p.type === P.PHANTOMBOLT) return 'magic';
    if (p.type === P.FIREBALL || p.type === P.CURSEDFLAME) return 'flame';
    if (p.type === P.FROSTBOLT) return 'frost';
    if (p.type === P.WATERBOLT || p.type === P.WATERSTREAM) return 'water';
    return null;
  }
  function projectileColor(p, kind) {
    if (p.type === P.LASER) return p.owner === 'player' ? '#ed7187' : '#edaa70';
    if (p.type === P.DEATHLASER) return '#ef5677';
    if (p.type === P.PHANTOMBOLT) return p.color || '#a386c8';
    if (p.type === P.CURSEDFLAME) return p.color || '#8fbf77';
    return p.color || ({ arrow:'#c4a87d', dart:'#b7c28c', bullet:'#e0ba6f', rocket:'#aeb9c4', stinger:'#a4b968',
      star:'#eed591', magic:'#89bdd8', flame:'#e18b53', frost:'#94cbdc', water:'#689cc5' })[kind];
  }
  function projectileSprite(p, frame) {
    var kind = projectileKind(p);
    if (!kind) return null;
    var color = projectileColor(p, kind);
    return remember('projectile:' + [kind, color, frame, p.type === P.DEATHLASER, !!p.fallenStar].join(':'), function() {
      var c = surface(48, 32), ctx = c.getContext('2d'), pal = ramp(color); ctx.translate(24, 16);
      if (kind === 'arrow') {
        rect(ctx, INK, -12, -2, 17, 4); rect(ctx, pal[1], -11, -1, 12, 2);
        rect(ctx, pal[3], -10, -1, 10, 1);
        rect(ctx, '#bec9c7', 0, -3, 3, 6); rect(ctx, '#e5e5cf', 3, -2, 2, 4); rect(ctx, '#8b9ca4', 5, -1, 2, 2);
        rect(ctx, pal[2], -12, -4, 3, 3); rect(ctx, pal[2], -12, 1, 3, 3);
        rect(ctx, pal[3], -12, -3, 2, 1);
      } else if (kind === 'dart') {
        rect(ctx, INK, -8, -2, 12, 4); rect(ctx, pal[1], -7, -1, 10, 2);
        rect(ctx, '#ede5bf', 2, -1, 4, 1); rect(ctx, pal[3], -6, -1, 6, 1);
        rect(ctx, pal[2], -9, -3, 3, 2); rect(ctx, pal[2], -9, 1, 3, 2);
      } else if (kind === 'bullet' || kind === 'laser') {
        var length = kind === 'bullet' ? 9 : p.type === P.DEATHLASER ? 23 : 15;
        var height = p.type === P.DEATHLASER ? 3 : 2;
        rect(ctx, pal[0], -length, -height, length + 3, height * 2);
        rect(ctx, pal[2], -length + 2, -height + 1, length, Math.max(1, height * 2 - 2));
        rect(ctx, '#fff0ce', -length + 4, -1, length - 4, 1);
        rect(ctx, pal[1], -length - 3, -1, 2, 1);
      } else if (kind === 'rocket') {
        rect(ctx, INK, -8, -4, 15, 8); rect(ctx, '#899aa9', -7, -3, 10, 6);
        rect(ctx, '#d0d9d4', -6, -3, 9, 2); rect(ctx, '#b96570', 3, -3, 3, 6);
        rect(ctx, '#d79a93', 6, -2, 2, 4);
        rect(ctx, '#566979', -8, -6, 3, 3); rect(ctx, '#566979', -8, 3, 3, 3);
        rect(ctx, '#ac614d', -15 - frame, -2, 7 + frame, 4);
        rect(ctx, '#e8b56e', -13 - frame, -1, 5 + frame, 2); rect(ctx, '#fff0b7', -10, -1, 2, 1);
      } else if (kind === 'stinger') {
        rect(ctx, INK, -8, -2, 12, 4); rect(ctx, pal[2], -7, -1, 9, 2);
        rect(ctx, '#ece3ae', -3, -1, 7, 1); rect(ctx, pal[0], -9, 1, 3, 1);
      } else if (kind === 'star') {
        for (var ray = 0; ray < 4; ray++) {
          var ang = ray * Math.PI / 2 + frame * Math.PI / 8;
          line(ctx, pal[0], 0, 0, Math.cos(ang) * 7, Math.sin(ang) * 7, 3);
          line(ctx, pal[2], 0, 0, Math.cos(ang) * 6, Math.sin(ang) * 6, 2);
        }
        rect(ctx, '#f9edbf', -2, -2, 4, 4); rect(ctx, '#fff9e1', -1, -1, 2, 2);
        rect(ctx, pal[1], -16, -1, 5, 1); rect(ctx, pal[2], -9, -1, 3, 2);
      } else {
        var radius = kind === 'flame' ? 6 : 5;
        oval(ctx, 0, 0, radius + 1, radius, pal[0]); oval(ctx, 0, -1, radius, radius - 1, pal[1]);
        oval(ctx, 1, -1, 3, 3, pal[2]); rect(ctx, '#f1efd8', 0, -2, 3, 3);
        for (var tail = 0; tail < 3; tail++) {
          var tx = -8 - tail * 3, ty = (tail + frame) % 3 * 2 - 2;
          rect(ctx, pal[tail === 0 ? 2 : 1], tx, ty, 4 - tail, 2);
        }
        if (kind === 'frost') {
          rect(ctx, '#d6e9e2', -1, -7, 2, 3); rect(ctx, '#d6e9e2', -1, 5, 2, 3);
          rect(ctx, '#b4d8df', 5, -1, 3, 2);
        }
      }
      return c;
    });
  }
  // Called in projectile-local coordinates; the caller owns velocity rotation.
  function drawProjectile(ctx, p) {
    var frame = Math.floor((Number.isFinite(p.age) ? p.age : Time.seconds) * 12) % 4;
    var c = projectileSprite(p, frame);
    if (!c) return false;
    ctx.save(); ctx.imageSmoothingEnabled = false;
    var scale = p.fallenStar ? 1.25 : 1;
    ctx.drawImage(c, -24 * scale, -16 * scale, c.width * scale, c.height * scale);
    ctx.restore();
    return true;
  }

  function weaponSprite(def) {
    return remember('weapon:' + (def.color || '#c5cbd1'), function() {
      var c = surface(32, 32), ctx = c.getContext('2d'), pal = ramp(def.color || '#c5cbd1');
      // Hand anchor (4,27), blade pointing north-east. A real hilt, two-tone
      // edge and guard replace the old single colored line.
      function inside(x, y) {
        var along = (x - y + 23) * Math.SQRT1_2;
        var across = (x + y - 31) * Math.SQRT1_2;
        var half = along > 30 ? (34 - along) * 0.7 : 2.6;
        return along >= 9 && along <= 34 && Math.abs(across) <= half;
      }
      // Rasterize one continuous mask. Stacking outlined diagonal rectangles
      // would paint over preceding highlights and leave an almost black blade.
      for (var y = 0; y < 32; y++) for (var x = 0; x < 32; x++) {
        if (!inside(x, y)) continue;
        var edge = !inside(x - 1, y) || !inside(x + 1, y) || !inside(x, y - 1) || !inside(x, y + 1);
        var across = (x + y - 31) * Math.SQRT1_2;
        rect(ctx, edge ? INK : across < 0 ? pal[3] : across > 0.8 ? pal[1] : pal[2], x, y, 1, 1);
      }
      line(ctx, INK, 3, 27, 10, 20, 5); line(ctx, '#8f684b', 3, 27, 10, 20, 3);
      line(ctx, '#c39861', 3, 26, 9, 20, 1);
      line(ctx, '#584244', 5, 17, 15, 27, 4); line(ctx, '#d1ac6a', 5, 17, 15, 27, 2);
      rect(ctx, '#ead09b', 6, 17, 2, 1);
      return c;
    });
  }
  function drawSwing(ctx, p, x, y) {
    var stack = p.inventory.selectedItem(), def = stack && ITEMS[stack.id];
    if (!def || def.type !== 'melee' || p.swingT <= 0 ||
      (def.meleeMode && def.meleeMode !== 'thrust') || def.projectileOnly) return false;
    var thrust = !!def.shortSword || def.meleeMode === 'thrust';
    var duration = Math.max(0.12, (def.speed || 0.3) * 0.7);
    var progress = clamp(1 - p.swingT / duration, 0, 1);
    var reach = def.range ? def.range * TILE + 10 : 30;
    var angle = thrust ? p.swingAng : p.swingAng + (p.dir < 0 ? -1 : 1) * (-1.2 + progress * 2.4);
    var scale = reach / 34;
    ctx.save(); ctx.imageSmoothingEnabled = false;
    ctx.translate(Math.round(x), Math.round(y - 6));
    if (!thrust) {
      ctx.globalAlpha *= 0.3;
      for (var trail = 0; trail < 12; trail++) {
        var a = angle - (p.dir < 0 ? -1 : 1) * trail * 0.035;
        rect(ctx, trail < 3 ? '#f2e6c8' : def.color || '#c5cbd1', Math.cos(a) * reach * 0.8, Math.sin(a) * reach * 0.8, 2, 2);
      }
      ctx.globalAlpha /= 0.3;
    } else {
      // Extend the blade to its real reach, never beyond it with a second offset.
      scale *= 0.45 + Math.sin(progress * Math.PI) * 0.55;
    }
    ctx.rotate(angle + Math.PI / 4);
    ctx.drawImage(weaponSprite(def), -4 * scale, -27 * scale, 32 * scale, 32 * scale);
    rect(ctx, '#e2af83', -1, -1, 3, 3);
    ctx.restore();
    return true;
  }

  function burst(frame, color) {
    return remember('burst:' + frame + ':' + color, function() {
      var c = surface(56, 56), ctx = c.getContext('2d'); ctx.translate(28, 28);
      var r = 5 + frame * 5;
      for (var i = 0; i < 12; i++) {
        var ang = i * Math.PI / 6;
        line(ctx, '#a65d58', Math.cos(ang) * r * 0.5, Math.sin(ang) * r * 0.5,
          Math.cos(ang) * r, Math.sin(ang) * r, 4);
      }
      oval(ctx, 0, 0, r * 0.75, r * 0.7, color); oval(ctx, -1, -1, r * 0.47, r * 0.43, '#efd197');
      rect(ctx, '#fff3cf', -2, -3, 5, 5);
      return c;
    });
  }
  function drawFX(ctx, f, x, y, life) {
    if (['spark','slash','cast','boom','heal'].indexOf(f.type) < 0) return false;
    life = Number.isFinite(life) ? clamp(life, 0, 1) : 1;
    ctx.save(); ctx.globalAlpha *= life; ctx.imageSmoothingEnabled = false;
    var progress = 1 - life;
    if (f.type === 'boom') {
      var sprite = burst(Math.min(3, Math.floor(progress * 4)), f.color || '#d68d5d');
      ctx.drawImage(sprite, Math.round(x) - 28, Math.round(y) - 28);
    } else if (f.type === 'heal') {
      rect(ctx, '#82bf91', x - 2, y - 13, 4, 13); rect(ctx, '#82bf91', x - 6, y - 9, 12, 4);
      rect(ctx, '#e1ecc5', x - 1, y - 12, 1, 6);
    } else if (f.type === 'cast') {
      var radius = 7 + progress * 15;
      for (var rune = 0; rune < 12; rune++) {
        var a = rune * Math.PI / 6 + progress * 0.5;
        rect(ctx, rune % 3 ? '#8db9ca' : '#e3e2bd', x + Math.cos(a) * radius, y + Math.sin(a) * radius, 2, 2);
      }
    } else {
      for (var ray = 0; ray < 5; ray++) {
        var seed = hash2((f.seed || 0) + ray * 7, 73), angle = seed % 628 / 100;
        var dist = 3 + progress * 12, length = 2 + life * 5;
        line(ctx, f.color || '#e5bd7f', x + Math.cos(angle) * dist, y + Math.sin(angle) * dist,
          x + Math.cos(angle) * (dist + length), y + Math.sin(angle) * (dist + length), 2);
        rect(ctx, '#fff1c8', x + Math.cos(angle) * dist, y + Math.sin(angle) * dist, 1, 1);
      }
    }
    ctx.restore();
    return true;
  }

  return { drawBoss:drawBoss, bossSprite:bossSprite, arenaSprite:arenaSprite,
    enemySprite:enemySprite, drawEnemy:drawEnemy,
    etherianSprite:etherianSprite, drawOOAEnemy:drawOOAEnemy,
    drawOOAWorld:drawOOAWorld, drawOOASentry:drawOOASentry, drawProjectile:drawProjectile,
    projectileSprite:projectileSprite, drawSwing:drawSwing, drawFX:drawFX };
})();
