// Local-HTTP boot, update-loop and segmented renderer check. Never deploys.
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

export async function runSegmentedHttpSmoke({ name,roster }) {
const root = process.cwd();
const html = await readFile(path.join(root,'index.html'),'utf8');
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
    return { liquid:typeof game.world.liqTick === 'function',finite:Number.isFinite(game.player.x) && Number.isFinite(game.player.y),art:typeof CombatArt.drawSegmentedEnemy === 'function' };
  });
  const checks = await page.evaluate(roster => {
    const w = game.world, tx = Math.floor(w.spawnX / TILE), gy = Math.min(w.H - 10,w.hellY + 12), x = tx * TILE + 8;
    for (let xx = tx - 40; xx <= tx + 40; xx++) {
      for (let y = gy - 35; y < gy; y++) { w.set(xx,y,T.AIR); w.setWall(xx,y,WALL.CAVE); }
      w.set(xx,gy,T.ASH); if ((xx - tx) % 6 === 0) w.set(xx,gy - 4,T.TORCH);
    }
    function hash(a) { let h = 2166136261; for (let i = 0; i < a.length; i++) h = Math.imul(h ^ a[i],16777619); return h >>> 0; }
    const cases = [], types = roster.map(s => E[s.type]);
    for (const turning of [false,true]) for (const side of [-1,1]) {
      game.entities = []; game.bossBars = []; game.projectiles.list = []; game.fx = []; game.fxTexts = []; game.pickups = [];
      game.player.invuln = 99999;
      const enemies = types.map((type,i) => {
        const e = spawnEntity(game,type,x + (types.length === 4 ? [-280,-90,110,300] : [-260,0,260])[i] * side,gy * TILE - 160 - (i % 2 ? 60 : 0));
        initSegments(e,game,roster[i].count,e.color);
        game.player.x = e.x + side * 150; game.player.y = e.y - 30;
        for (let tick = 0; tick < (turning ? 32 : 1); tick++) {
          if (turning && tick === 18) { game.player.x = e.x - side * 60; game.player.y = e.y + 100; }
          enemyStep(e,game);
        }
        return e;
      });
      game.player.x = x; game.player.y = gy * TILE - game.player.h / 2 - 0.01;
      game.cam.x = x; game.cam.y = game.player.y - 100;
      const snapshot = () => JSON.stringify({ player:game.player,entities:game.entities,projectiles:game.projectiles.list,fx:game.fx,texts:game.fxTexts,pickups:game.pickups,
        bars:game.bossBars,progress:game.bossesDefeated,hardmode:game.hardmode,event:game.event,terrain:[hash(w.tiles),hash(w.walls),hash(w.hp)] });
      const before = snapshot(), hook = CombatArt.drawSegmentedEnemy; let calls = 0;
      CombatArt.drawSegmentedEnemy = (...args) => { if (enemies.includes(args[2])) calls++; return hook(...args); };
      try { render(); } finally { CombatArt.drawSegmentedEnemy = hook; }
      cases.push({ turning,side,readonly:before === snapshot(),calls,noShots:game.projectiles.list.length === 0,noLoot:game.pickups.length === 0,
        counts:enemies.map(e => e.segments.length),dimensions:enemies.every(e => e.w === ENT_DEF[e.type].w && e.h === ENT_DEF[e.type].h && e.segments.every(s => s.w === e.w * 0.8 && s.h === e.h * 0.8)) });
    }
    return cases;
  },roster);
  const network = await page.evaluate(roster => roster.map(spec => {
    game.entities = [];
    const e = spawnEntity(game,E[spec.type],game.player.x,game.player.y - 80); initSegments(e,game,spec.count,e.color);
    e.segments[1].dead = true;
    const packet = JSON.parse(JSON.stringify(Net.entityState(e))), moved = JSON.parse(JSON.stringify(packet));
    moved.x += 20; moved.y += 10; moved.segments.forEach(s => { s.x += 20; s.y += 10; });
    const originalTimeline = Net.timelines.frame; delete Net.timelines.frame;
    try {
      game.entities = []; Net.applyEntities([packet],1000); Net.applyEntities([moved],1100);
      Net.timelines.frame = { renderTime:() => 1050 }; Net.placeEntities(2000);
      const remote = game.entities[0], before = JSON.stringify(remote), samples = JSON.stringify(remote.netTrack.samples);
      const c = document.createElement('canvas'); c.width = c.height = 320;
      const drawn = CombatArt.drawSegmentedEnemy(c.getContext('2d'),game,remote,{ x:remote.x,y:remote.y },320,320);
      return { kind:spec.kind,drawn,readonly:before === JSON.stringify(remote) && samples === JSON.stringify(remote.netTrack.samples),
        interpolated:remote.x === packet.x + 10 && remote.y === packet.y + 5 && remote.segments.every((s,i) => s.x === packet.segments[i].x + 10 && s.y === packet.segments[i].y + 5),
        topology:remote.segments.length === spec.count && remote.segments[1].dead && !remote.segments[0].dead,
        noIndex:remote.segments.every(s => s.segmentIndex === undefined) };
    } finally { if (originalTimeline) Net.timelines.frame = originalTimeline; else delete Net.timelines.frame; }
  }),roster);
  const ok = !errors.length && boot.liquid && boot.finite && boot.art && loaded.length === 4 && loaded.every(r => r.status === 200) &&
    loaded.some(r => r.url === '/' + artworkURL) && loaded.some(r => r.url === '/' + rendererURL) &&
    checks.every(s => s.readonly && s.calls === roster.length && s.noShots && s.noLoot && s.dimensions && s.counts.join(',') === roster.map(s => s.count).join(',')) &&
    network.every(s => s.drawn && s.readonly && s.interpolated && s.topology && s.noIndex);
  const result = { ok,loaded,boot,checks,network,errors };
  await mkdir('test-results/audit2',{ recursive:true }); await writeFile('test-results/audit2/' + name + '-http-smoke.json',JSON.stringify(result,null,2));
  console.log(JSON.stringify(result)); if (!ok) process.exitCode = 1;
} finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); }
}
