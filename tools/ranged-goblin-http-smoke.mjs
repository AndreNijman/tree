import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { installRangedGoblinFixture, runRangedGoblinHttpScenarios } from './ranged-goblin-fixture.mjs';

const root = process.cwd(), html = await readFile(path.join(root,'index.html'),'utf8');
const artworkURL = html.match(/src="(js\/combatart\.js\?v=[^"]+)"/)[1];
const rendererURL = html.match(/src="(js\/render\.js\?v=[^"]+)"/)[1];
const server = createServer(async (req,res) => {
  const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file = path.resolve(root,'.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  try {
    const body = await readFile(file);
    res.setHeader('Content-Type',({ '.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png' })[path.extname(file)] || 'application/octet-stream');
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
let browser;
try {
  browser = await chromium.launch(); const page = await browser.newPage({ viewport:{ width:1280,height:720 } });
  const errors = [], loaded = [];
  page.on('pageerror',e => errors.push(e.message));
  page.on('response',r => { if (/\/(combatart|pixelart|render|world)\.js/.test(r.url())) loaded.push({ url:new URL(r.url()).pathname + new URL(r.url()).search,status:r.status() }); });
  await page.goto('http://127.0.0.1:' + server.address().port + '/', { waitUntil:'load' });
  await page.evaluate(() => { const original = buildGame; buildGame = (_,evil,difficulty) => { buildGame = original; return original(7357,evil,difficulty); }; });
  await page.click('#btn-new'); await page.click('#btn-create');
  await page.waitForFunction(() => game && game.started && game.player);
  await page.waitForFunction(() => NetInterp && NetInterp.Track);
  const boot = await page.evaluate(() => {
    AudioSys.enabled = false; game.player.invuln = 999999;
    for (let tick = 0; tick < 120; tick++) step(1 / 60);
    game.paused = true;
    return { liquid:typeof game.world.liqTick === 'function',finite:Number.isFinite(game.player.x) && Number.isFinite(game.player.y),art:typeof CombatArt.drawEnemy === 'function' };
  });
  await installRangedGoblinFixture(page);
  const checks = await runRangedGoblinHttpScenarios(page);
  const network = await page.evaluate(() => __rgSpecs.map(spec => {
    __rgScene(); const e = __rgEnemy(spec); e.dir = -1; e.vx = 2; e.attackCd = spec.cooldown;
    const packet = JSON.parse(JSON.stringify(Net.entityState(e))), moved = { ...packet,x:packet.x + 20,y:packet.y + 10 };
    const originalTimeline = Net.timelines.frame; delete Net.timelines.frame;
    try {
      game.entities = []; Net.applyEntities([packet],1000); Net.applyEntities([moved],1100);
      Net.timelines.frame = { renderTime:() => 1050 }; Net.placeEntities(2000);
      const remote = game.entities[0]; game.player.x = remote.x + 200;
      const before = __rgState(), samples = JSON.stringify(remote.netTrack.samples);
      const c = document.createElement('canvas'); c.width = c.height = 320;
      drawEnemy(c.getContext('2d'),remote,{ x:remote.x,y:remote.y },320,320);
      const pixels = c.getContext('2d').getImageData(0,0,320,320).data;
      return { kind:spec.kind,readonly:before === __rgState() && samples === JSON.stringify(remote.netTrack.samples),
        interpolated:remote.x === packet.x + 10 && remote.y === packet.y + 5,
        single:!remote.segments && !remote.arms && !!remote.ghost === !!ENT_DEF[spec.type].ghost && remote.w === packet.w && remote.h === packet.h,
        cooldown:remote.attackCd === packet.attackCd,visible:pixels.some((v,i) => i % 4 === 3 && v),
        ghostAlpha:!remote.ghost || pixels.some((v,i) => i % 4 === 3 && v > 0 && v < 255) };
    } finally { if (originalTimeline) Net.timelines.frame = originalTimeline; else delete Net.timelines.frame; }
  }));
  const ok = !errors.length && boot.liquid && boot.finite && boot.art && loaded.length === 4 && loaded.every(r => r.status === 200) &&
    loaded.some(r => r.url === '/' + artworkURL) && loaded.some(r => r.url === '/' + rendererURL) &&
    checks.every(s => s.readonly && s.calls === 3 && s.shots === (s.shooting ? 3 : 0) && s.cooldowns && s.event && s.bodies && s.noLoot && s.noSummons) &&
    network.every(s => s.readonly && s.interpolated && s.single && s.cooldown && s.visible && s.ghostAlpha);
  const result = { ok,loaded,boot,checks,network,errors };
  await mkdir('test-results/audit2',{ recursive:true }); await writeFile('test-results/audit2/ranged-goblin-http-smoke.json',JSON.stringify(result,null,2));
  console.log(JSON.stringify(result)); if (!ok) process.exitCode = 1;
} finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); }
