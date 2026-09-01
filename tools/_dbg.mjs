import { chromium } from 'playwright';
const URL = 'file:///' + process.cwd().replace(/\\/g, '/') + '/index.html';
const browser = await chromium.launch({ args: ['--no-sandbox', '--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('pageerror', e => console.log('PAGEERR', e.message));
await page.goto(URL, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => typeof buildGame === 'function');
const out = await page.evaluate(() => {
  var t0 = performance.now();
  buildGame('cave-test', 'corrupt');
  var genMs = Math.round(performance.now() - t0);
  // measure air percentage underground (cave density)
  var w = game.world;
  var total = 0, air = 0;
  for (var y = w.surfaceY[200] + 20; y < w.hellY - 10; y += 3) {
    for (var x = 100; x < w.W - 100; x += 5) {
      total++;
      if (w.get(x, y) === 0) air++;
    }
  }
  var airPct = Math.round(air / total * 100);
  // render 120 frames
  t0 = performance.now();
  for (var i = 0; i < 120; i++) step(1/60);
  var stepMs = Math.round((performance.now() - t0) / 120 * 100) / 10;
  return { genMs, airPct, stepMs };
});
console.log(JSON.stringify(out));
// screenshot map to check cave appearance
await page.evaluate(() => { document.getElementById('mainmenu').style.display = 'none'; });
await page.waitForTimeout(200);
await page.keyboard.press('m');
await page.evaluate(() => { game.mapZoom = 0.5; });
await page.waitForTimeout(300);
await page.screenshot({ path: '/tmp/opencode/caves-new.png' });
await browser.close();
