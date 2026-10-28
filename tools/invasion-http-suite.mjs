import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { installInvasionFixture, runInvasionScenarios, runMoonDawnProbe } from './invasion-art-fixture.mjs';
import { runMartianDeploymentProbe } from './martian-deployment-probe.mjs';
import { installPresentMimicFixture, runPresentMimicScenarios, runPresentMimicProbe } from './present-mimic-fixture.mjs';
import { runEclipseEventProbe } from './eclipse-event-probe.mjs';

export async function runInvasionHttpSmoke(config) {
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
  await (config.mimic ? installPresentMimicFixture : installInvasionFixture)(page,config);
  const checks = await (config.mimic ? runPresentMimicScenarios : runInvasionScenarios)(page);
  const mimicProbe = config.mimic ? await runPresentMimicProbe(page) : null;
  const dawn = config.night ? await runMoonDawnProbe(page) : null;
  const eclipse = config.eclipse ? await runEclipseEventProbe(page) : null;
  const deployment = config.deploys ? await runMartianDeploymentProbe(page) : null;
  const network = await page.evaluate(() => __piSpecs.map(spec => {
    __piScene(); const e = __piEnemy(spec); e.dir = -1; e.vx = 2; e.attackCd = spec.cooldown || 999;
    if (spec.mimic) { e.awake = true; e.charge = { x:e.x + 200,y:e.y,t:0.5 }; }
    const packet = JSON.parse(JSON.stringify(Net.entityState(e))), moved = { ...packet,x:packet.x + 20,y:packet.y + 10 };
    const originalTimeline = Net.timelines.frame; delete Net.timelines.frame;
    try {
      game.entities = []; Net.applyEntities([packet],1000); Net.applyEntities([moved],1100);
      Net.timelines.frame = { renderTime:() => 1050 }; Net.placeEntities(2000);
      const remote = game.entities[0]; game.player.x = remote.x + 200;
      const before = __piState(), samples = JSON.stringify(remote.netTrack.samples);
      const c = document.createElement('canvas'); c.width = c.height = 320;
      drawEnemy(c.getContext('2d'),remote,{ x:remote.x,y:remote.y },320,320);
      const pixels = c.getContext('2d').getImageData(0,0,320,320).data;
      return { kind:spec.kind,readonly:before === __piState() && samples === JSON.stringify(remote.netTrack.samples),
        interpolated:remote.x === packet.x + 10 && remote.y === packet.y + 5,
        single:!remote.segments && !remote.arms && !!remote.ghost === !!packet.ghost && remote.w === packet.w && remote.h === packet.h,
        state:remote.dir === -1 && remote.vx === 2 && remote.attackCd === packet.attackCd && remote.bob === packet.bob &&
          (!spec.mimic || remote.awake === true && !('charge' in packet) && !remote.charge),
        visible:pixels.some((v,i) => i % 4 === 3 && v),ghostAlpha:!remote.ghost || pixels.some((v,i) => i % 4 === 3 && v === 153) && pixels.every((v,i) => i % 4 !== 3 || v === 0 || v === 153) };
    } finally { if (originalTimeline) Net.timelines.frame = originalTimeline; else delete Net.timelines.frame; }
  }));
  const ok = !errors.length && boot.liquid && boot.finite && boot.art && loaded.length === 4 && loaded.every(r => r.status === 200) &&
    loaded.some(r => r.url === '/' + artworkURL) && loaded.some(r => r.url === '/' + rendererURL) &&
    checks.length === (config.scenarioStates || ['normal','jumping','fired']).length * 4 && checks.every(s => s.readonly && s.calls === config.specs.length && s.shots === (s.pose === 'fired' ? config.specs.filter(q => q.shoot).length : 0) && s.cooldowns && s.event && s.bodies && s.movement && s.noLoot && s.noChildren) &&
    network.every(s => s.readonly && s.interpolated && s.single && s.state && s.visible && s.ghostAlpha) &&
    (!mimicProbe || Object.values(mimicProbe).every(rows => rows.length > 0 && rows.every(s => s.correct && (s.calls === undefined || s.calls === 2 && s.readonly && s.rng === 0)))) &&
    (!dawn || dawn.length === config.specs.length * 6 && dawn.every(s => s.live.calls === 2 && s.live.readonly && s.live.rng === 0 && s.held && s.waiting && s.finished && s.readonly)) &&
    (!eclipse || eclipse.gates.length === 32 && eclipse.gates.every(s => s.correct && s.readonly) && eclipse.daylight.length === config.specs.length * 8 &&
      eclipse.daylight.every(s => s.correct && s.readonly && s.live.calls === 2 && s.live.readonly && s.live.rng === 0)) &&
    (!deployment || deployment.rows.length === 36 && deployment.rows.every(s => s.readyReadonly && s.drawn.calls === 2 && s.drawn.readonly && s.drawn.rng === 0 && s.count && s.cooldown && s.placement && s.noShots && s.noLoot) &&
      Object.values(deployment.completion).every(Boolean) && deployment.miniboss.readonly && deployment.miniboss.correct);
  const result = { ok,loaded,boot,checks,network,deployment,dawn,eclipse,mimicProbe,errors };
  await mkdir('test-results/audit2',{ recursive:true }); await writeFile('test-results/audit2/' + config.name + '-http-smoke.json',JSON.stringify(result,null,2));
  console.log(JSON.stringify(result)); if (!ok) process.exitCode = 1;
} finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); }
}
