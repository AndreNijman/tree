import { chromium } from 'playwright';
const URL = 'file:///' + process.cwd().replace(/\\/g, '/') + '/index.html';
const browser = await chromium.launch({ args: ['--no-sandbox', '--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('pageerror', e => console.log('PAGEERR', e.message));
await page.goto(URL, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => typeof buildGame === 'function');
const out = await page.evaluate(() => {
  buildGame('perf-v8', 'corrupt');
  var t = {};
  var N = 300;
  var t0 = performance.now();
  for (var i = 0; i < N; i++) { step(1/60); render(); }
  t.total = Math.round((performance.now() - t0) / N * 100) / 10;
  t0 = performance.now();
  for (var i2 = 0; i2 < N; i2++) step(1/60);
  t.step = Math.round((performance.now() - t0) / N * 100) / 10;
  t.render = Math.round((t.total - t.step) * 10) / 10;
  t.fps = Math.round(1000 / t.total);
  return t;
});
console.log(JSON.stringify(out));
await browser.close();
