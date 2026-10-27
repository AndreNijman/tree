// One-off diagnostic: frame-by-frame trace of the liquid queue in the sky lab.
import { setupAudit, note } from './lib.mjs';

const { browser, page, results } = await setupAudit();

const trace = await page.evaluate(() => {
  var w = game.world, p = game.player;
  __clearHostiles();
  var x0 = 240, x1 = 259, xm = (x0 + x1) >> 1, py = 20;
  for (var x = x0 - 1; x <= x1 + 1; x++) { w.set(x, py, T.STONE); w.hp[w.idx(x, py)] = 9999; }
  for (var f = xm - 2; f <= xm + 2; f++) { w.set(f, py + 40, T.STONE); w.hp[w.idx(f, py + 40)] = 9999; }
  for (var g = 0; g < 20; g++) w.set(x0 + g, py - 1, T.WATER);
  w.breakTile(xm, py);
  var log = [];
  var samp = function() {
    var cells = [];
    for (var yy = py - 3; yy <= py + 4; yy++) {
      var row = '';
      for (var xx = xm - 4; xx <= xm + 4; xx++) {
        var t = w.get(xx, yy);
        row += t === T.WATER ? 'w' : (t === T.AIR ? '.' : '#');
      }
      cells.push(row);
    }
    log.push({ q: w.liquidQueue ? w.liquidQueue.size : 0, cells: cells });
  };
  samp();
  for (var s = 0; s < 20; s++) { step(1 / 60); samp(); }
  return { log: log, w: w.W, h: w.H };
});

for (var i = 0; i < trace.log.length; i++) {
  note(results, 'frame ' + i + ' queue=' + trace.log[i].q + ' | ' + trace.log[i].cells.join(' / '));
}

await browser.close();
console.log('done, frames: ' + trace.log.length + ', world ' + trace.w + 'x' + trace.h);
