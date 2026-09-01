import { chromium } from 'playwright';
const URL = 'file:///' + process.cwd().replace(/\\/g, '/') + '/index.html';
const browser = await chromium.launch({ args: ['--no-sandbox', '--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('pageerror', e => console.log('PAGEERR', e.message));
await page.goto(URL, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => typeof buildGame === 'function');
await page.evaluate(() => { buildGame('mapv3', 'corrupt'); document.getElementById('mainmenu').style.display = 'none'; });
await page.waitForTimeout(300);
// zoom out first for a better view
await page.keyboard.press('m');
await page.waitForTimeout(200);
await page.evaluate(() => { game.mapZoom = 0.5; });
await page.waitForTimeout(300);
await page.screenshot({ path: '/tmp/opencode/map-v3.png' });
// close and verify HUD comes back
await page.keyboard.press('m');
await page.waitForTimeout(200);
const hudVis = await page.evaluate(() => document.getElementById('hud').style.opacity);
console.log('hud opacity after close:', hudVis);
await browser.close();
