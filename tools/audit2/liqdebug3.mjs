// One-off: 300-frame drain with rim lips, dump full end state.
import { setupAudit, note } from './lib.mjs';

const { browser, page, results } = await setupAudit();

const info = await page.evaluate(() => {
  var w = game.world, p = game.player;
  __clearHostiles();
  var x0 = 240, x1 = 259, xm = (x0 + x1) >> 1, py = 20;
  for (var x = x0 - 1; x <= x1 + 1; x++) { w.set(x, py, T.STONE); w.hp[w.idx(x, py)] = 9999; }
  w.set(x0 - 1, py - 1, T.STONE); w.set(x1 + 1, py - 1, T.STONE);
  for (var f = xm - 2; f <= xm + 2; f++) { w.set(f, py + 40, T.STONE); w.hp[w.idx(f, py + 40)] = 9999; }
  for (var g = 0; g < 20; g++) w.set(x0 + g, py - 1, T.WATER);
  w.breakTile(xm, py);
  for (var s = 0; s < 300; s++) step(1 / 60);
  var rowdump = function(y) {
    var r = '';
    for (var x = 235; x <= 265; x++) { var t = w.get(x, y); r += t === T.WATER ? 'w' : t === T.AIR ? '.' : 'S'; }
    return r;
  };
  var colwater = 0;
  for (var y = py; y <= py + 79; y++) if (w.get(xm, y) === T.WATER) colwater++;
  var q = [];
  if (w.liquidQueue) w.liquidQueue.forEach(function(i) {
    var x = i % w.W, y = Math.floor(i / w.W);
    if (y < py + 90) q.push(x + ',' + y + '=' + w.tiles[i]);
  });
  return {
    row19: rowdump(py - 1), row20: rowdump(py), row59: rowdump(py + 39), row60: rowdump(py + 40),
    colwater: colwater, queueNear: q
  };
});
note(results, JSON.stringify(info));
await browser.close();
console.log(JSON.stringify(info, null, 1));
