// Disposable browser storage and stubbed remote requests; no production writes.
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd(), dir = path.join(root,'test-results','home-menu');
await mkdir(dir,{ recursive:true });
const server = createServer(async (req,res) => {
  const name = new URL(req.url,'http://localhost').pathname;
  const file = path.resolve(root,'.' + (name === '/' ? '/index.html' : name));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  try { const body = await readFile(file); res.setHeader('Content-Type',({ '.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml' })[path.extname(file)] || 'application/octet-stream'); res.end(body); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
const browser = await chromium.launch(), errors = [], checks = [];
const check = (label,ok,detail) => { checks.push({ label,ok:!!ok,detail }); console.log((ok ? 'PASS ' : 'FAIL ') + label + (detail ? ' ' + JSON.stringify(detail) : '')); };
let lobbies = [];
try {
  const context = await browser.newContext({ viewport:{ width:1440,height:900 } });
  const page = await context.newPage(); page.on('pageerror',e => errors.push(e.message));
  await page.route('**/*',route => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1' && !url.pathname.startsWith('/_guard/')) return route.continue();
    return route.fulfill({ status:200,contentType:'application/json',headers:{ 'Access-Control-Allow-Origin':'*' },body:JSON.stringify(url.pathname.endsWith('/lobbies') ? { lobbies } : {}) });
  });
  await page.goto('http://127.0.0.1:' + server.address().port + '/');
  await page.waitForFunction(() => typeof renderWorldList === 'function' && document.querySelector('#world-list .world-empty'));
  await page.evaluate(() => { AudioSys.enabled = false; Net.labelLobbies = () => {}; });
  await page.screenshot({ path:path.join(dir,'desktop-empty.png'),fullPage:true });
  check('Opening menu loads original scenery and named controls',await page.evaluate(() => {
    const image = document.querySelector('.menu-wordmark img');
    return image.complete && image.naturalWidth > 0 && getComputedStyle(document.querySelector('.menu-landscape')).backgroundImage.includes('menu-landscape.svg') &&
      !game && document.querySelectorAll('#btn-new').length === 1 && document.querySelector('#mp-name').labels.length === 1;
  }));
  await page.click('#btn-new');
  check('New World opens the existing form and focuses its name field',await page.locator('#world-create').isVisible() && await page.locator('#world-name').evaluate(e => e === document.activeElement));
  await page.fill('#world-name','Fernlight');
  await page.check('input[name="evil"][value="crimson"]'); await page.check('input[name="difficulty"][value="expert"]');
  await page.screenshot({ path:path.join(dir,'desktop-create.png'),fullPage:true });
  await page.click('#btn-cancel-create');
  check('Cancel restores New World without generating a game',await page.locator('#btn-new').isVisible() && await page.evaluate(() => !game));
  await page.click('#btn-howto');
  check('Field guide still opens with expanded state',await page.locator('#howto').isVisible() && await page.locator('#btn-howto').getAttribute('aria-expanded') === 'true');
  await page.screenshot({ path:path.join(dir,'field-guide.png') });
  await page.click('#howto-close');
  check('Field guide closes normally',!(await page.locator('#howto').isVisible()));
  await page.locator('#btn-new').focus(); await page.keyboard.press('Enter');
  check('Keyboard activation opens creation with a visible focus indicator',await page.locator('#world-create').isVisible() &&
    await page.locator('#world-name').evaluate(e => e === document.activeElement && getComputedStyle(e).outlineStyle !== 'none'));
  await page.click('#btn-cancel-create');

  lobbies = [{ code:'FERNS',world:'The Mossy Hollow',name:'Rowan',players:2,max:8,locked:false },{ code:'GROVE',world:'Moonlit Grove',name:'Sage',players:1,max:8,locked:true }];
  await page.click('#mp-refresh'); await page.waitForSelector('.lobby-row');
  await page.fill('#mp-name','Explorer'); await page.fill('#mp-password','fixture-password'); await page.fill('#mp-code','abcde');
  await page.evaluate(() => { window.__menuConnect = Net.connect; Net.connect = options => { window.__menuJoin = options; }; });
  await page.click('#mp-join');
  check('Join code retains uppercasing, player name and private password',await page.evaluate(() => __menuJoin.code === 'ABCDE' && __menuJoin.name === 'Explorer' && __menuJoin.password === 'fixture-password' && !__menuJoin.create));
  await page.click('.lobby-row[data-code="GROVE"] .lobby-join');
  check('Hosted world Join keeps the selected room code',await page.evaluate(() => __menuJoin.code === 'GROVE'));
  await page.evaluate(() => { Net.connect = __menuConnect; delete window.__menuConnect; delete window.__menuJoin; });
  await page.fill('#mp-password','');

  const layout = [];
  for (const [width,height] of [[1440,900],[1280,720],[768,1024],[390,844],[320,640],[844,390]]) {
    await page.setViewportSize({ width,height });
    await page.locator('#mainmenu').evaluate(e => e.scrollTop = 0);
    const metrics = await page.evaluate(() => {
      const menu = document.querySelector('#mainmenu'), cards = [...document.querySelectorAll('.menu-card')];
      return { overflow:menu.scrollWidth > menu.clientWidth + 1,cards:cards.every(e => e.getBoundingClientRect().left >= 0 && e.getBoundingClientRect().right <= innerWidth),
        controls:[...document.querySelectorAll('#title-actions input:not([type="radio"]),#mp-join,#btn-new')].filter(e => e.getClientRects().length).every(e => e.getBoundingClientRect().width >= 40) };
    });
    layout.push({ width,height,...metrics });
    await page.screenshot({ path:path.join(dir,`menu-${width}x${height}.png`) });
  }
  check('Desktop, tablet, mobile and short landscape layouts have no horizontal clipping',layout.every(s => !s.overflow && s.cards && s.controls),layout);
  await page.setViewportSize({ width:390,height:844 }); await page.click('#btn-new');
  await page.screenshot({ path:path.join(dir,'mobile-create.png') }); await page.click('#btn-cancel-create');
  await page.locator('#multiplayer').scrollIntoViewIfNeeded();
  await page.screenshot({ path:path.join(dir,'mobile-multiplayer.png') });
  await page.setViewportSize({ width:1280,height:800 });
  await page.evaluate(() => { const original = buildGame; buildGame = (_,evil,difficulty) => { buildGame = original; return original(7357,evil,difficulty); }; });
  await page.click('#btn-new'); await page.fill('#world-name','Fernlight'); await page.click('#btn-create');
  await page.waitForFunction(() => game && game.started && document.querySelector('#mainmenu').classList.contains('hidden'),null,{ timeout:90000 });
  check('Real world creation preserves selected evil and difficulty',await page.evaluate(() => game.difficulty === 'expert' && game.world.evil === 'crimson' && activeWorldName === 'Fernlight'));
  await page.evaluate(() => { game.player.invuln = 99999; for (let i = 0; i < 120; i++) step(1 / 60); pauseGame(); });
  check('Pause stays compact with existing resume/save controls',await page.locator('#btn-continue').isVisible() && await page.locator('#btn-save').isVisible() &&
    await page.evaluate(() => document.querySelector('#mainmenu h1').textContent === 'Paused' && getComputedStyle(document.querySelector('.menu-landscape')).display === 'none'));
  await page.screenshot({ path:path.join(dir,'pause.png') });
  await page.click('#btn-settings'); check('Pause Settings still opens',await page.locator('#settings').isVisible()); await page.click('#settings-close');
  await page.click('#btn-continue'); check('Resume hides the menu and unpauses the world',await page.evaluate(() => !game.paused && document.querySelector('#mainmenu').classList.contains('hidden')));
  await page.evaluate(() => pauseGame()); await page.click('#btn-save');
  await page.waitForSelector('.world-row');
  check('Save & Quit returns to the redesigned menu with the real saved world',await page.evaluate(() => !game && document.querySelector('#mainmenu h1').textContent === 'tree' && document.querySelector('.world-title').textContent === 'Fernlight'));
  await page.screenshot({ path:path.join(dir,'desktop-saved.png') });
  await page.evaluate(async () => {
    const record = (await getWorldRecords()).find(r => !r.deletedAt && r.data);
    for (let i = 0; i < 4; i++) await putWorldRecord({ ...record,id:'menu-layout-fixture-' + i,name:'A very long world name in the woods',updatedAt:record.updatedAt + i + 1 });
    await renderWorldList(); setSaveMode('Syncing explorer-with-a-long-name...');
  });
  await page.setViewportSize({ width:320,height:640 }); await page.locator('#world-list').scrollIntoViewIfNeeded();
  const crowded = await page.evaluate(() => {
    const menu = document.querySelector('#mainmenu'), list = document.querySelector('#world-list');
    return { menu:menu.scrollWidth <= menu.clientWidth + 1,list:list.scrollWidth <= list.clientWidth + 1,
      rows:document.querySelectorAll('.world-row').length === 5,scrollable:list.scrollHeight > list.clientHeight,
      actions:[...list.querySelectorAll('.world-host,.world-delete')].every(e => e.getBoundingClientRect().right <= innerWidth) };
  });
  check('Long world/account names and multiple saves fit narrow screens with usable actions',Object.values(crowded).every(Boolean),crowded);
  await page.screenshot({ path:path.join(dir,'mobile-saves.png') });
  await page.evaluate(async () => {
    for (const record of await getWorldRecords()) if (record.id.startsWith('menu-layout-fixture-')) await putWorldRecord({ ...record,deletedAt:Date.now(),data:null });
    await renderWorldList(); setSaveMode('Local saves');
  });
  await page.setViewportSize({ width:1280,height:800 });
  await page.evaluate(() => { window.__menuHost = Net.hostWorld; Net.hostWorld = id => { window.__menuHostId = id; }; });
  await page.click('.world-host');
  check('Saved-world Host still receives the correct persistent ID',await page.evaluate(() => __menuHostId === document.querySelector('.world-row').dataset.worldId));
  await page.evaluate(() => { Net.hostWorld = __menuHost; delete window.__menuHost; });
  await page.reload(); await page.waitForSelector('.world-row');
  check('Saved worlds survive reload and render in the new card',await page.locator('.world-title').first().textContent() === 'Fernlight');
  await page.click('.world-open');
  await page.waitForFunction(() => game && game.started && document.querySelector('#mainmenu').classList.contains('hidden'),null,{ timeout:90000 });
  check('Saved-world Play still loads the persistent world',await page.evaluate(() => activeWorldName === 'Fernlight' && game.difficulty === 'expert' && game.world.evil === 'crimson'));
  await page.evaluate(() => { AudioSys.enabled = false; pauseGame(); }); await page.click('#btn-save'); await page.waitForSelector('.world-row');
  page.once('dialog',dialog => dialog.accept()); await page.click('.world-delete');
  await page.waitForSelector('#world-list .world-empty');
  check('Delete keeps the existing confirmation and removes only the selected saved world',await page.locator('.world-row').count() === 0);
  check('No uncaught browser errors',errors.length === 0,errors);
} catch (error) { check('Browser test completes',false,error.stack); }
finally {
  await browser.close(); await new Promise(resolve => server.close(resolve));
  const result = { ok:checks.length > 0 && checks.every(s => s.ok),checks,errors };
  await writeFile(path.join(dir,'summary.json'),JSON.stringify(result,null,2));
  await writeFile(path.join(dir,'index.html'),`<!doctype html><meta charset="utf-8"><title>Tree opening menu review</title><style>body{background:#102629;color:#e5eadb;max-width:1280px;margin:32px auto;padding:0 20px;font:16px system-ui}img{max-width:100%;border:1px solid #496053;margin:12px 0 32px}a{color:#d3bf86}</style><h1>Tree / opening menu</h1><p>Original pixel scenery and responsive menu panels. Browser test: ${checks.filter(s => s.ok).length}/${checks.length} passed. Test saves and hosted worlds are disposable fixtures.</p>${['desktop-empty','desktop-saved','desktop-create','menu-390x844','mobile-multiplayer','mobile-saves','pause','field-guide'].map(name => `<h2>${name.replace(/-/g,' ')}</h2><img src="${name}.png" alt="${name.replace(/-/g,' ')}">`).join('')}`);
  console.log(`${checks.filter(s => s.ok).length}/${checks.length} passed`); if (!result.ok) process.exitCode = 1;
}
