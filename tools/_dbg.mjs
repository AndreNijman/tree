import { chromium } from 'playwright';
const URL = 'file:///' + process.cwd().replace(/\\/g, '/') + '/index.html';
const browser = await chromium.launch({ args: ['--no-sandbox', '--allow-file-access-from-files'] });
const page = await browser.newPage();
page.on('pageerror', e => console.log('PAGEERR', e.message));
await page.goto(URL, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => typeof buildGame === 'function');
const out = await page.evaluate(() => {
  buildGame('wall-debug', 'corrupt');
  var w = game.world;
  var tx = Math.floor(w.spawnX / TILE) + 80;
  var ty = w.surfaceY[tx] - 1;
  w.set(tx, ty, 0); // AIR
  w.setWall(tx, ty, 3); // WOOD
  // read back
  return {
    tile: w.get(tx, ty),
    wall: w.wall(tx, ty),
    wallDirect: w.walls[w.idx(tx, ty)],
    surfaceY: w.surfaceY[tx],
    ty: ty,
    wallsLen: w.walls.length,
    idx: w.idx(tx, ty),
  };
});
console.log(JSON.stringify(out));
await browser.close();
