import { chromium } from 'playwright';
const URL = 'file:///' + process.cwd().replace(/\\/g, '/') + '/index.html';
const browser = await chromium.launch({ args: ['--no-sandbox', '--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('pageerror', e => console.log('PAGEERR', e.message));
await page.goto(URL, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => typeof buildGame === 'function');
await page.evaluate(() => { buildGame('ui3', 'corrupt'); document.getElementById('mainmenu').style.display = 'none'; });
await page.waitForTimeout(300);
await page.keyboard.press('e');
await page.waitForTimeout(300);
const state = await page.evaluate(() => {
  const r = (id) => { const e = document.getElementById(id); if (!e) return null; const b = e.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) }; };
  return {
    main: r('inv-main'), equip: r('inv-equip'), craft: r('inv-craft'),
    flexDir: getComputedStyle(document.getElementById('panel-inventory')).flexDirection,
    equipKids: document.getElementById('inv-equip').children.length,
    craftRows: document.getElementById('inv-craft-list').children.length,
    hudZ: getComputedStyle(document.getElementById('hud')).zIndex,
    panelZ: getComputedStyle(document.getElementById('panel')).zIndex,
    lifeY: r('lifemana'),
  };
});
console.log(JSON.stringify(state, null, 1));
await browser.close();
