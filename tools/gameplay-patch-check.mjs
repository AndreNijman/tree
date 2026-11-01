// Disposable gameplay reproductions; --baseline retains the pre-fix failures.
import { mkdirSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { setupAudit, check, assertNoBrowserErrors, finish } from './audit2/lib.mjs';

const http = process.argv.includes('--http'), root = process.cwd();
let server, url;
if (http) {
  server = createServer(async (req,res) => {
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
  url = 'http://127.0.0.1:' + server.address().port + '/';
}
try {
const { browser,page,results } = await setupAudit(url);
const baseline = process.argv.includes('--baseline');
if (http) {
  const assets = [];
  for (const name of ['entities','player','crafting','main']) {
    const src = await page.locator('script[src^="js/' + name + '.js?"]').getAttribute('src');
    const version = new URL(src,url).searchParams.get('v');
    const response = await page.request.get(new URL(src,url).href);
    assets.push({ name,src,version,status:response.status(),exact:!!version && await response.text() === await readFile(path.join(root,'js',name + '.js'),'utf8') });
  }
  check(results,'HTTP loads exact current gameplay modules with the refreshed cache tags',assets.every(s => s.status === 200 && s.exact),assets);
}
await page.evaluate(() => {
  game.paused = true; AudioSys.enabled = false;
  const w = game.world, tx = Math.floor(w.spawnX / TILE), gy = w.surfaceY[tx];
  window.__gpOrigin = { tx,gy };
  window.__gpScene = function(id = I.PLATFORM) {
    closePanel(); game.panelOpen = false; game.mapOpen = false; game.event = null;
    game.entities = []; game.bossBars = []; game.projectiles.list = []; game.pickups = []; game.fx = []; game.fxTexts = [];
    game.weather.active = false; game.spawnT = 999; game.townArrivalT = game.housingT = 999;
    for (let x = tx - 20; x <= tx + 20; x++) for (let y = gy - 12; y <= gy; y++) {
      w.set(x,y,y === gy ? T.STONE : T.AIR); w.setWall(x,y,WALL.NONE);
    }
    const p = game.player; p.x = tx * TILE + 8; p.y = gy * TILE - p.h / 2 - 0.01;
    p.vx = p.vy = 0; p.onGround = true; p.dying = false; p.hp = p.maxHp = 1000; p.invuln = 999;
    p.mineCd = p.attackCd = 0; p.kite = null; p.smartMine = false; p.inventory.slots.fill(null); p.inventory.selected = 0;
    p.inventory.slots[0] = { id,count:20 }; game.cam.x = p.x; game.cam.y = p.y - 80;
    for (const k of Object.keys(KEY)) delete KEY[k]; for (const k of Object.keys(KEY_JUST)) delete KEY_JUST[k];
    MOUSE.down = MOUSE.right = MOUSE.rightJust = false; MOUSE.wheel = 0;
    w.nearbyStations = w.findStations(p.x,p.y);
    __gpAim(tx + 3,gy - 2); return p;
  };
  window.__gpAim = function(x,y) {
    MOUSE.wx = x * TILE + 8; MOUSE.wy = y * TILE + 8; MOUSE.tpx = x; MOUSE.tpy = y;
    MOUSE.x = MOUSE.wx - game.cam.x + canvas.width / 2; MOUSE.y = MOUSE.wy - game.cam.y + canvas.height / 2;
    return { x:MOUSE.x,y:MOUSE.y };
  };
});

const golems = await page.evaluate(() => {
  const enemies = [], bosses = [];
  for (const type of [E.ICEGOLEM,E.GRANITEGOLEM,E.MARBLEGOLEM]) for (const side of [-1,1]) {
    const p = __gpScene(); const e = spawnEntity(game,type,p.x - side * 100,p.y); e.onGround = true; e.attackCd = 0;
    e.y = __gpOrigin.gy * TILE - e.h / 2 - 0.01; p.y = e.y;
    const x = e.x, y = e.y; enemyStep(e,game); const shot = game.projectiles.list[0];
    enemies.push({ type,side,shots:game.projectiles.list.length,x:e.x,y:e.y,vx:e.vx,attackCd:e.attackCd,shot,correct:game.projectiles.list.length === 1 && shot.type === P.MAGICBOLT && shot.dmg === 30 &&
      shot.x === x && shot.y === y - 10 && Math.abs(shot.vx - side * 3.5) < 1e-7 && Math.abs(shot.vy) < 1e-7 && e.dir === side &&
      Math.abs(e.x - x - side * e.speed * 0.1) < 1e-7 && Math.abs(e.attackCd - 2.4) < 1e-7 && !Number.isNaN(e.attackTimer) && !('summonTimer' in e) });
  }
  for (const phase of [false,true]) {
    const p = __gpScene(); const e = spawnGolem(game); e.x = p.x + 150; e.y = p.y - 100; e.phase2 = phase; e.attackTimer = 0; e.summonTimer = 999;
    bossStep(e,game); const shots = game.projectiles.list;
    bosses.push({ phase,correct:shots.length === (phase ? 6 : 3) && shots.every(s => s.type === P.LASER && s.dmg === (phase ? 36 : 28)) &&
      e.attackTimer === (phase ? 1 : 1.8) && Number.isFinite(e.x) && Number.isFinite(e.y) });
  }
  const boundaries = [];
  for (const dx of [399.99,400]) for (const dy of [199.99,200]) {
    const p = __gpScene(); const e = spawnEntity(game,E.ICEGOLEM,p.x - dx,p.y - dy); e.attackCd = 0;
    enemyStep(e,game); boundaries.push({ dx,dy,correct:game.projectiles.list.length === (dx < 400 && dy < 200 ? 1 : 0) });
  }
  return { enemies,bosses,boundaries };
});
check(results,'Ice/Granite/Marble Golems use enemy walking and frost-bolt AI, not boss-only state',golems.enemies.length === 6 && golems.enemies.every(s => s.correct),golems.enemies);
check(results,'Temple Golem retains its three/six-laser boss phases',golems.bosses.every(s => s.correct),golems.bosses);
check(results,'Enemy golems retain strict 400px horizontal/200px vertical firing boundaries',golems.boundaries.every(s => s.correct),golems.boundaries);
const sustained = await page.evaluate(() => {
  const rows = [];
  for (const type of [E.ICEGOLEM,E.GRANITEGOLEM,E.MARBLEGOLEM]) {
    const p = __gpScene(), e = spawnEntity(game,type,p.x + 120,p.y); e.y = __gpOrigin.gy * TILE - e.h / 2 - 0.01;
    for (let i = 0; i < 330; i++) enemyStep(e,game);
    rows.push({ type,shots:game.projectiles.list.length,correct:game.projectiles.list.length === 3 && !('attackTimer' in e) && !('summonTimer' in e) &&
      Number.isFinite(e.x) && Number.isFinite(e.y) && Number.isFinite(e.attackCd) && game.entities.length === 1 && !e.dead });
  }
  return rows;
});
check(results,'All three ordinary golems keep firing over 330 real AI ticks without boss state or summons',sustained.every(s => s.correct),sustained);

const placement = await page.evaluate(() => {
  const rows = [], { tx,gy } = __gpOrigin;
  for (const dx of [3,12]) for (const occupied of [false,true]) {
    const p = __gpScene(); __gpAim(tx + dx,gy - 2); if (occupied) game.world.set(tx + dx,gy - 2,T.STONE);
    const before = p.inventory.countOf(I.PLATFORM); p.tryPlace(game,I.PLATFORM);
    rows.push({ dx,occupied,spent:before - p.inventory.countOf(I.PLATFORM),correct:before - p.inventory.countOf(I.PLATFORM) === (dx === 3 ? 1 : 0) });
  }
  const p = __gpScene(); p.mineCd = 0.5; p.tryPlace(game,I.PLATFORM);
  const cooldown = p.inventory.countOf(I.PLATFORM) === 20;
  __gpScene(); __gpAim(tx,gy - 2); game.player.tryPlace(game,I.PLATFORM);
  const overlap = game.player.inventory.countOf(I.PLATFORM) === 20;
  __gpScene(); game.player.tryPlace(game,I.PLATFORM); game.player.tryPlace(game,I.PLATFORM);
  const once = game.player.inventory.countOf(I.PLATFORM) === 19;
  return { rows,cooldown,overlap,once };
});
check(results,'Block placement and adjacent fallback both reject unreachable targets',placement.rows.every(s => s.correct),placement.rows);
check(results,'Placement obeys cooldown and never fills the player body or double-spends a tick',placement.cooldown && placement.overlap && placement.once,placement);
const rules = await page.evaluate(() => {
  const { tx,gy } = __gpOrigin, ranges = [], support = [];
  for (const wall of [false,true]) for (const dx of [wall ? 6 : 5,wall ? 7 : 6]) {
    const id = wall ? I.WOODWALL : I.PLATFORM, p = __gpScene(id); p.y = (gy - 2) * TILE + 8; __gpAim(tx + dx,gy - 2);
    if (wall) p.tryPlaceWall(game,id); else p.tryPlace(game,id);
    ranges.push({ wall,dx,correct:p.inventory.countOf(id) === (dx === (wall ? 6 : 5) ? 19 : 20) });
  }
  for (const tile of [T.TOMBSTONE,T.SUNFLOWER,T.ETERNIASTAND]) for (const grounded of [false,true]) {
    const id = Object.keys(ITEMS).find(id => ITEMS[id].tile === tile), p = __gpScene(id);
    if (grounded) game.world.set(tx + 3,gy - 1,T.STONE);
    p.tryPlace(game,id); support.push({ tile,grounded,correct:p.inventory.countOf(id) === (grounded ? 19 : 20) });
  }
  const pylonId = Object.keys(ITEMS).find(id => ITEMS[id].type === 'pylon'), p = __gpScene(pylonId), biome = game.world.biomeAt;
  let pylon;
  try { game.world.biomeAt = () => BIOME.UNDERWORLD; p.tryPlace(game,pylonId); pylon = p.inventory.countOf(pylonId) === 20; }
  finally { game.world.biomeAt = biome; }
  __gpScene(); game.world.set(tx + 3,gy - 2,T.STONE);
  const hash = a => { let h = 2166136261; for (let i = 0; i < a.length; i++) h = Math.imul(h ^ a[i],16777619); return h >>> 0; };
  const state = () => JSON.stringify([[game.world.tiles,game.world.walls,game.world.hp].map(hash),game.player.inventory.slots,game.player.mineCd,game.pickups,game.projectiles.list]);
  const before = state(), target = game.player.placementTarget(game,I.PLATFORM); updateCrosshair();
  const readonly = before === state(); game.player.tryPlace(game,I.PLATFORM);
  const sameCell = target && !target.reason && game.world.get(target.x,target.y) === T.PLATFORM;
  return { ranges,support,pylon,readonly,sameCell };
});
check(results,'Exact five/six-tile placement limits, ground support and Underworld pylon restrictions remain enforced',rules.ranges.every(s => s.correct) && rules.support.every(s => s.correct) && rules.pylon,rules);
check(results,'Preview validation is read-only and predicts the actual adjacent placement cell',rules.readonly && rules.sameCell,rules);

const inputs = [];
for (const id of ['PLATFORM','WOODWALL']) for (const button of ['left','right']) for (let repeat = 0; repeat < 2; repeat++) {
  const point = await page.evaluate(id => { __gpScene(I[id]); return __gpAim(__gpOrigin.tx + 3,__gpOrigin.gy - 2); },id);
  await page.mouse.move(point.x,point.y); await page.mouse.down({ button });
  await page.evaluate(() => step(1 / 60)); await page.mouse.up({ button });
  inputs.push(await page.evaluate(({ id,button,repeat }) => ({ id,button,repeat,count:game.player.inventory.countOf(I[id]),
    correct:game.player.inventory.countOf(I[id]) === 19 && (id === 'WOODWALL' ? game.world.wall(__gpOrigin.tx + 3,__gpOrigin.gy - 2) === WALL.WOOD : game.world.get(__gpOrigin.tx + 3,__gpOrigin.gy - 2) === T.PLATFORM) }),{ id,button,repeat }));
}
check(results,'Physical left and right mouse inputs both place blocks and walls (two reproductions each)',inputs.every(s => s.correct),inputs);
const interaction = await page.evaluate(() => {
  const p = __gpScene(); const { tx,gy } = __gpOrigin;
  game.world.set(tx + 3,gy - 2,T.CHEST); game.world.chests.push({ x:tx + 3,y:gy - 2,inv:new Array(20).fill(null) });
  MOUSE.right = MOUSE.rightJust = true; game.paused = false; step(1 / 60); game.paused = true; MOUSE.right = false;
  const chest = game.panelOpen && game.chestOpen && p.inventory.countOf(I.PLATFORM) === 20;
  closePanel(); __gpScene(I.COPPERPICK); game.world.set(tx + 3,gy - 2,T.STONE);
  const hp = game.world.hp[game.world.idx(tx + 3,gy - 2)]; MOUSE.right = MOUSE.rightJust = true; step(1 / 60); MOUSE.right = false;
  const noMine = hp === game.world.hp[game.world.idx(tx + 3,gy - 2)];
  __gpScene(); game.panelOpen = true; MOUSE.right = MOUSE.rightJust = true; step(1 / 60); MOUSE.right = false;
  const panel = game.player.inventory.countOf(I.PLATFORM) === 20;
  return { chest,noMine,panel };
});
check(results,'Right-click still prioritizes chests, respects panels and does not use mining tools',Object.values(interaction).every(Boolean),interaction);
const safety = await page.evaluate(() => {
  const { tx,gy } = __gpOrigin, chestRows = [];
  function tick() { game.paused = false; step(1 / 60); game.paused = true; MOUSE.down = MOUSE.right = false; }
  for (const locked of [false,true]) {
    const p = __gpScene(); game.world.chests = game.world.chests.filter(c => c.x !== tx + 3 || c.y !== gy - 2);
    game.world.set(tx + 3,gy - 2,T.SHADOWCHEST); game.world.chests.push({ x:tx + 3,y:gy - 2,inv:[],locked,key:I.SHADOWKEY });
    MOUSE.right = MOUSE.rightJust = true; tick();
    chestRows.push({ locked,correct:p.inventory.countOf(I.PLATFORM) === 20 && (locked ? !game.chestOpen : game.chestOpen) });
  }
  let p = __gpScene(); const guide = spawnEntity(game,E.GUIDE,p.x + 48,p.y); __gpAim(Math.floor(guide.x / TILE),Math.floor(guide.y / TILE));
  MOUSE.right = MOUSE.rightJust = true; tick(); const npc = game.panelOpen && game.panelTab === 'guide' && p.inventory.countOf(I.PLATFORM) === 20;
  p = __gpScene(); p.dying = true; p.respawnT = 999; MOUSE.right = MOUSE.rightJust = true; tick(); const dead = p.inventory.countOf(I.PLATFORM) === 20;
  p = __gpScene(); MOUSE.down = MOUSE.right = MOUSE.rightJust = true; tick(); const both = p.inventory.countOf(I.PLATFORM) === 19;
  return { chestRows,npc,dead,both };
});
check(results,'Locked chests and NPCs consume interactions; dead players and simultaneous buttons cannot place extra blocks',safety.chestRows.every(s => s.correct) && safety.npc && safety.dead && safety.both,safety);

const hints = await page.evaluate(() => {
  const { tx,gy } = __gpOrigin, out = [];
  for (const id of [I.PLATFORM,I.WOODWALL]) {
    __gpScene(id); updateCrosshair(); const near = el.tilehint.textContent;
    __gpAim(tx + 12,gy - 2); updateCrosshair(); const far = el.tilehint.textContent;
    out.push({ id,near,far,correct:near.includes(ITEMS[id].name) && /Too far/i.test(far) });
  }
  __gpScene(I.COPPERSHORT); game.world.set(tx + 3,gy - 2,T.STONE); updateCrosshair();
  const pick = el.tilehint.textContent;
  game.world.set(tx + 3,gy - 2,T.TREETRUNK); updateCrosshair(); const axe = el.tilehint.textContent;
  __gpScene(); game.player.inventory.slots[1] = { id:I.COPPERAXE,count:1 }; renderGuide();
  return { out,pick,axe,toolHint:/pickaxe/i.test(pick) && /axe/i.test(axe),guide:!/Axe \(right-click\)/i.test(document.getElementById('guide-content').textContent) };
});
check(results,'Placement previews use selected item definitions for block/wall names and reach',hints.out.every(s => s.correct),hints.out);
check(results,'Non-tool terrain hints explain Pickaxe/Axe selection and Guide advice uses the real control',hints.toolHint && hints.guide,hints);

const crafts = await page.evaluate(() => {
  const out = [];
  for (const panel of ['craft-list','inv-craft-list']) for (const special of ['workbench','furnace','anvil']) {
    const p = __gpScene(); const { tx,gy } = __gpOrigin;
    p.inventory.slots.fill(null); const r = RECIPES.find(r => r.special === special);
    for (const [id,count] of r.mat) p.inventory.add(id,count);
    if (special === 'anvil') game.world.set(tx - 3,gy - 2,T.WORKBENCH);
    game.world.nearbyStations = game.world.findStations(p.x,p.y);
    renderCrafting(); const index = RECIPES.indexOf(r); document.querySelector('#' + panel + ' [data-idx="' + index + '"]').click();
    const message = document.getElementById('message').textContent;
    out.push({ panel,special,message,correct:message.includes(r.name) && !message.startsWith('Crafted Wood') && !message.startsWith('Crafted Stone') });
  }
  const p = __gpScene(); p.inventory.slots.fill(null); p.inventory.add(I.WOOD,10);
  const { tx,gy } = __gpOrigin; for (let x = tx - 1; x <= tx + 1; x++) for (let y = gy - 3; y <= gy; y++) game.world.set(x,y,T.STONE);
  const r = RECIPES.find(r => r.special === 'workbench'), before = p.inventory.countOf(I.WOOD), success = craftRecipe(game,r);
  return { out,rollback:!success && p.inventory.countOf(I.WOOD) === before,message:document.getElementById('message').textContent };
});
check(results,'Both crafting panels report the actual Workbench/Furnace/Anvil, not placeholder materials',crafts.out.every(s => s.correct),crafts.out);
check(results,'A blocked station craft refunds materials and explains why no station was placed',crafts.rollback && /room|space/i.test(crafts.message),crafts);
mkdirSync('test-results/gameplay-patch',{ recursive:true });
await page.screenshot({ path:'test-results/gameplay-patch/' + (baseline ? 'baseline' : http ? 'http-after' : 'after') + '.png' });
await assertNoBrowserErrors(results);
await finish(results,browser,baseline ? 'gameplay-patch-baseline' : http ? 'gameplay-patch-http' : 'gameplay-patch',{ golems,sustained,placement,rules,inputs,interaction,safety,hints,crafts });
} finally { if (server) await new Promise(resolve => server.close(resolve)); }
