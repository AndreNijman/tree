// One-off: inspect the frozen liquid state — queue contents + sink probe.
import { setupAudit, note } from './lib.mjs';

const { browser, page, results } = await setupAudit();

const info = await page.evaluate(() => {
  var w = game.world, p = game.player;
  __clearHostiles();
  var x0 = 240, x1 = 259, xm = (x0 + x1) >> 1, py = 20;
  for (var x = x0 - 1; x <= x1 + 1; x++) { w.set(x, py, T.STONE); w.hp[w.idx(x, py)] = 9999; }
  for (var f = xm - 2; f <= xm + 2; f++) { w.set(f, py + 40, T.STONE); w.hp[w.idx(f, py + 40)] = 9999; }
  for (var g = 0; g < 20; g++) w.set(x0 + g, py - 1, T.WATER);
  w.breakTile(xm, py);
  for (var s = 0; s < 300; s++) step(1 / 60);

  var out = { hasSink: typeof w.liqSinkAhead === 'function' };
  var q = [];
  if (w.liquidQueue) w.liquidQueue.forEach(function(i) {
    var x = i % w.W, y = Math.floor(i / w.W);
    q.push(x + ',' + y + '=' + w.tiles[i]);
  });
  out.queue = q;
  // probe the sinks the frozen pond edge should see
  var probes = {};
  for (var d = -1; d <= 1; d += 2) {
    var path = [];
    for (var k = 1; k <= 6; k++) {
      var cx = xm - 3 + (d === -1 ? 0 : 0), yy = py - 1;
      var px = 247 + d * k; // left edge water tile is at x=247, right at 251
      if (px < 0 || px >= w.W) { path.push('oob'); continue; }
      path.push(w.get(px, yy) + '/' + w.get(px, yy + 1));
    }
    probes['d' + d] = path;
  }
  out.leftEdgeSink = w.liqSinkAhead ? w.liqSinkAhead(247, py - 1, 1) : null;
  out.leftEdgeSinkLeft = w.liqSinkAhead ? w.liqSinkAhead(247, py - 1, -1) : null;
  out.rightEdgeSink = w.liqSinkAhead ? w.liqSinkAhead(251, py - 1, -1) : null;
  out.probes = probes;
  out.pondRow = (function() { var r = ''; for (var x = 244; x <= 255; x++) { var t = w.get(x, py - 1); r += t === T.WATER ? 'w' : t === T.AIR ? '.' : '#'; } return r; })();
  return out;
});
note(results, JSON.stringify(info));

await browser.close();
console.log(JSON.stringify(info));
