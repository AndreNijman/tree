// Hallow enemy artwork and real AI/loot regression checks in a disposable world.
import { mkdirSync, writeFileSync } from 'node:fs';
import { setupAudit, check, assertNoBrowserErrors, finish } from './audit2/lib.mjs';

const { browser, page, results } = await setupAudit();
const kinds = ['pixie','unicorn','gastropod','chaoselemental'];
const dir = 'test-results/graphics/hallow';
mkdirSync(dir,{ recursive:true });
await page.evaluate(kinds => {
  game.paused = true; game.weather.active = false; game.event = null;
  const w = game.world, tx = Math.floor(w.spawnX / TILE), gy = w.surfaceY[tx];
  for (let x = tx - 43; x <= tx + 43; x++) {
    w.surfaceY[x] = gy;
    for (let y = Math.max(1,gy - 50); y <= gy; y++) { w.set(x,y,y === gy ? T.HALLOWGRASS : T.AIR); w.setWall(x,y,WALL.NONE); }
  }
  // Explicit display-biome fixture; no world-generation or spread code changes.
  const fraction = (tx * TILE + 8) / (w.W * TILE), band = w.jungleLeft ? fraction : 1 - fraction;
  w._bands = [[band - 44 / w.W,band + 44 / w.W,BIOME.HALLOW]].concat(w._bands || []);
  game.hardmode = true;
  window.__hallowTypes = Object.fromEntries(kinds.map((k,i) => [k,[E.PIXIE,E.UNICORN,E.GASTROPOD,E.CHAOSELEMENTAL][i]]));
  window.__hallowOrigin = { tx,gy,x:tx * TILE + 8,y:gy * TILE - 90 };
  window.__hallowScene = function() {
    game.entities = []; game.bossBars = []; game.projectiles.list = []; game.fx = []; game.fxTexts = []; game.pickups = [];
    game.event = null; game.flashT = game.shakeT = 0;
    const p = game.player; p.x = __hallowOrigin.x - 120; p.y = gy * TILE - p.h / 2 - 0.01;
    p.vx = p.vy = 0; p.onGround = true; p.invuln = 999; p.hp = p.maxHp = 100; p.dying = false; p.respawnT = 0;
    game.cam.x = __hallowOrigin.x; game.cam.y = p.y - 90; game.timeOfDay = 0.5;
    document.getElementById('screenflash').style.display = 'none'; document.getElementById('deathscreen').classList.add('hidden');
    document.getElementById('message').style.display = 'none'; document.getElementById('interact').style.display = 'none';
  };
  window.__hallowEnemy = function(kind) {
    const e = spawnEntity(game,__hallowTypes[kind],__hallowOrigin.x,__hallowOrigin.y);
    if (kind === 'unicorn') { e.y = gy * TILE - e.h / 2 - 0.01; e.onGround = true; }
    return e;
  };
  window.__hallowState = function() {
    function hash(a) { let h = 2166136261; for (let i = 0; i < a.length; i++) h = Math.imul(h ^ a[i],16777619); return h >>> 0; }
    return JSON.stringify({ player:game.player,entities:game.entities,projectiles:game.projectiles.list,progress:game.bossesDefeated,
      event:game.event,hardmode:game.hardmode,eventCompletions:game.eventCompletions,fx:game.fx,texts:game.fxTexts,pickups:game.pickups,
      flash:game.flashT,tiles:hash(w.tiles),walls:hash(w.walls),hp:hash(w.hp),surface:hash(w.surfaceY),bands:w._bands });
  };
  window.__hallowRender = function(e) {
    const before = __hallowState(), hook = CombatArt.drawEnemy; let calls = 0;
    CombatArt.drawEnemy = (...args) => { if (args[2] === e) calls++; return hook(...args); };
    game.cam.x = e.x; game.cam.y = e.y - 50;
    try { for (let f = 0; f < 4; f++) renderGame(game,ctx2d); } finally { CombatArt.drawEnemy = hook; }
    return { calls,unchanged:before === __hallowState() };
  };
},kinds);

const sources = await page.evaluate(kinds => {
  const bytes = (kind,f,active,flash) => CombatArt.enemySprite(kind,f,active,flash).getContext('2d').getImageData(0,0,96,96).data;
  let total = 0, inked = 0, crisp = true, margins = true, masks = true;
  const animated = [], silhouettes = new Set();
  for (const kind of kinds) {
    const frames = new Set();
    for (const active of [false,true]) for (let f = 0; f < 4; f++) {
      const a = bytes(kind,f,active,false), b = bytes(kind,f,active,true); let ink = false;
      for (let y = 0; y < 96; y++) for (let x = 0; x < 96; x++) {
        const i = (y * 96 + x) * 4, alpha = a[i + 3];
        if (alpha) { ink = true; if (x < 2 || y < 2 || x >= 94 || y >= 94) margins = false; }
        if ((alpha !== 0 && alpha !== 255) || (b[i + 3] !== 0 && b[i + 3] !== 255)) crisp = false;
        if (alpha !== b[i + 3] || (alpha && (b[i] !== 255 || b[i + 1] !== 245 || b[i + 2] !== 220))) masks = false;
      }
      total += 2; if (ink) inked += 2; if (!active) frames.add(Array.from(a).join(','));
    }
    animated.push({ kind,frames:frames.size });
    silhouettes.add(Array.from(bytes(kind,0,false,false)).filter((v,i) => i % 4 === 3).join(','));
  }
  const original = kinds.map(k => Array.from(bytes(k,0,false,false)));
  for (const boss of ['kingslime','eyeofcthulhu','brainofcthulhu','queenbee','skeletron','wallofflesh','retinazer','spazmatism','destroyer','skelprime','queenslime','plantera','golem','duke','empress','moonlord','cultist']) {
    for (const phase of [false,true]) for (let f = 0; f < 4; f++) for (const flash of [false,true]) CombatArt.bossSprite(boss,phase,f,flash);
  }
  const stable = kinds.every((k,i) => bytes(k,0,false,false).every((v,n) => v === original[i][n]));
  const active = ['unicorn','gastropod','chaoselemental'].map(kind => { const a = bytes(kind,1,false,false), b = bytes(kind,1,true,false); return { kind,distinct:a.some((v,i) => v !== b[i]) }; });
  return { total,inked,crisp,margins,masks,animated,silhouettes:silhouettes.size,stable,active };
},kinds);
check(results,'All 64 Hallow frame/activity/flash sources are nonempty, binary-alpha and unclipped',sources.total === 64 && sources.inked === 64 && sources.crisp && sources.margins,sources);
check(results,'Four Hallow creatures have distinct silhouettes, not palette swaps',sources.silhouettes === 4);
check(results,'Every Hallow creature animates and hit flashes preserve exact alpha',sources.masks && sources.animated.every(s => s.frames >= 2),sources.animated);
check(results,'Running Unicorn, firing Gastropod and emerging Chaos Elemental have distinct activity art',sources.active.every(s => s.distinct),sources.active);
check(results,'Hallow sprite regeneration is deterministic after shared-cache eviction',sources.stable);

const ai = await page.evaluate(kinds => {
  const flying = [], lasers = [], runs = [], teleports = [], walls = [], contacts = [], kills = [];
  function simulate(e) { const random = Math.random; try { Math.random = () => 0.5; enemyStep(e,game); } finally { Math.random = random; } }
  for (const side of [-1,1]) {
    __hallowScene(); const e = __hallowEnemy('pixie'), x = e.x, y = e.y, bob = e.bob;
    game.player.x = e.x + side * 200; game.player.y = e.y; simulate(e);
    flying.push({ side,...__hallowRender(e),motion:Math.abs(e.x - x - side * e.speed) < 0.000001 && Math.abs(e.y - y - Math.sin(bob + 0.06) * 0.8) < 0.000001,
      body:e.w === 20 && e.h === 20 && !e.segments,shots:game.projectiles.list.length });
    for (const distance of [160,339,343]) {
      __hallowScene(); const g = __hallowEnemy('gastropod'); game.player.x = g.x + side * distance; game.player.y = g.y;
      simulate(g); const shots = game.projectiles.list.slice(), angle = Math.atan2(game.player.y - g.y,game.player.x - g.x);
      const shouldFire = dist(g.x,g.y,game.player.x,game.player.y) < 340;
      const rendered = __hallowRender(g), count = shots.length; if (shouldFire) simulate(g);
      lasers.push({ side,distance,...rendered,shouldFire,shots:count,noExtra:game.projectiles.list.length === count,
        correct:shots.every(p => p.owner === 'enemy' && p.type === P.LASER && p.dmg === 25 && p.life === 5 && Math.abs(p.vx - Math.cos(angle) * 2.5) < 0.000001 && Math.abs(p.vy - Math.sin(angle) * 2.5) < 0.000001),
        cooldown:shouldFire ? Math.abs(g.attackCd - (2.6 - 1 / 60)) < 0.000001 : g.attackCd < 0 });
    }
    __hallowScene(); const u = __hallowEnemy('unicorn'); game.player.x = u.x + side * 200; game.player.y = u.y;
    simulate(u); const prepared = u.state === 1 && u.dir === side && u.timer === 1.2;
    const windup = __hallowRender(u); game.player.x = u.x - side * 200; let wait = 0;
    while (u.state === 1 && wait++ < 80) simulate(u);
    const state2 = u.state === 2; const runX = u.x; simulate(u);
    const locked = u.dir === side && u.vx === side * u.speed && Math.abs(u.x - runX - side * u.speed) < 0.000001;
    const running = __hallowRender(u);
    for (let tick = 0; tick < 90; tick++) simulate(u);
    runs.push({ side,prepared,state2,wait,locked,continues:u.state === 2 && u.dir === side && u.vx === side * u.speed,
      windup,running,later:__hallowRender(u),body:u.w === 36 && u.h === 30,shots:game.projectiles.list.length });
  }
  for (const angleRoll of [0,0.5]) for (const distanceRoll of [0,0.999]) {
    __hallowScene(); const e = __hallowEnemy('chaoselemental'); game.player.x = __hallowOrigin.x; game.player.y = __hallowOrigin.y;
    const ang = angleRoll * 6.28, d = 120 + distanceRoll * 80;
    const tx = game.player.x + Math.cos(ang) * d, ty = game.player.y + Math.sin(ang) * d - 40;
    const dx = game.player.x - tx, dy = game.player.y - ty, length = Math.hypot(dx,dy), bob = e.bob;
    const random = Math.random, rolls = [angleRoll,distanceRoll,0.25];
    try { Math.random = () => rolls.shift() ?? 0.5; enemyStep(e,game); } finally { Math.random = random; }
    const fx = game.fx.filter(f => f.type === 'teleport');
    const destination = Math.abs(e.x - (tx + dx / length * e.speed)) < 0.000001 && Math.abs(e.y - (ty + dy / length * e.speed + Math.sin(bob + 0.06) * 0.5)) < 0.000001;
    const effect = fx.length === 1 && fx[0].x === tx && fx[0].y === ty && fx[0].t === 0.3;
    const timer = Math.abs(e.timer - 1.9) < 0.000001, rendered = __hallowRender(e);
    simulate(e); const noRepeat = game.fx.filter(f => f.type === 'teleport').length === 1;
    teleports.push({ angleRoll,distanceRoll,destination,effect,timer,noRepeat,...rendered,body:e.w === 22 && e.h === 26 && !e.segments,shots:game.projectiles.list.length });
  }
  for (const kind of ['pixie','gastropod','chaoselemental']) {
    __hallowScene(); const e = __hallowEnemy(kind), w = game.world, wx = __hallowOrigin.tx + 2, wy = Math.floor(e.y / TILE);
    for (let y = wy - 1; y <= wy + 1; y++) w.set(wx,y,T.PEARLSTONE);
    e.x = wx * TILE - e.w / 2 - 1; e.timer = 10; e.attackCd = 10; game.player.x = wx * TILE + 100; game.player.y = e.y;
    if (kind === 'chaoselemental') { for (let tick = 0; tick < 15; tick++) simulate(e); }
    else simulate(e);
    walls.push({ kind,correct:kind === 'chaoselemental' ? e.x > wx * TILE + 10 : e.vx === 0 && e.x + e.w / 2 <= wx * TILE,...__hallowRender(e) });
    for (let y = wy - 1; y <= wy + 1; y++) w.set(wx,y,T.AIR);
  }
  for (const kind of kinds) {
    __hallowScene(); let e = __hallowEnemy(kind); e.timer = 10;
    game.player.x = e.x + 3; game.player.y = e.y; game.player.hp = game.player.maxHp = 500; game.player.invuln = 0;
    const hp = game.player.hp; simulate(e);
    contacts.push({ kind,damaged:game.player.hp < hp,invuln:game.player.invuln > 0,...__hallowRender(e) });
    __hallowScene(); e = __hallowEnemy(kind); hitEntity(e,1,0,0,game);
    const flashed = __hallowRender(e), flash = e.flash > 0, random = Math.random;
    try { Math.random = () => 0; hitEntity(e,e.hp + e.def + 20,0,0,game); } finally { Math.random = random; }
    const drops = game.pickups.map(p => p.item), state = __hallowState(); renderGame(game,ctx2d);
    const c = document.createElement('canvas'); c.width = c.height = 160; drawEnemy(c.getContext('2d'),e,{ x:e.x,y:e.y },160,160);
    const hidden = !c.getContext('2d').getImageData(0,0,160,160).data.some((v,i) => i % 4 === 3 && v);
    kills.push({ kind,flash,flashed,dead:e.dead,hidden,drops,unchanged:state === __hallowState() });
  }
  return { flying,lasers,runs,teleports,walls,contacts,kills };
},kinds);
check(results,'Pixie keeps real bidirectional flight, bobbing and a single body without gaining attacks',ai.flying.every(s => s.calls === 4 && s.unchanged && s.motion && s.body && s.shots === 0),ai.flying);
check(results,'Gastropod keeps its post-movement 340-pixel range, 25-damage lasers and 2.6-second cooldown',ai.lasers.every(s => s.calls === 4 && s.unchanged && s.shots === (s.shouldFire ? 1 : 0) && s.correct && s.cooldown && s.noExtra),ai.lasers);
check(results,'Unicorn retains real preparation and running states, facing lock and five-pixel movement',ai.runs.every(s => s.prepared && s.state2 && s.locked && s.continues && s.body && s.shots === 0 && [s.windup,s.running,s.later].every(r => r.calls === 4 && r.unchanged)),ai.runs);
check(results,'Chaos Elemental retains real teleport destinations, effect, cooldown and no-repeat interval',ai.teleports.every(s => s.calls === 4 && s.unchanged && s.destination && s.effect && s.timer && s.noRepeat && s.body && s.shots === 0),ai.teleports);
check(results,'Pixie/Gastropod collide with terrain while Chaos Elemental retains its real wall-passing movement',ai.walls.every(s => s.correct && s.calls === 4 && s.unchanged),ai.walls);
check(results,'All four real contact attacks still damage the player without rendering changing invulnerability',ai.contacts.every(s => s.damaged && s.invuln && s.calls === 4 && s.unchanged),ai.contacts);
const expectedDrops = { pixie:['soullight','crystalshard','gememerald'],unicorn:['soullight','crystalshard'],gastropod:['soullight','glowstone'],chaoselemental:['soullight'] };
check(results,'Real hits flash; real kills stay hidden and keep original seeded drop branches',ai.kills.every(s => s.flash && s.flashed.calls === 4 && s.flashed.unchanged && s.dead && s.hidden && s.unchanged && expectedDrops[s.kind].every(id => s.drops.includes(id))),ai.kills);

const presentation = await page.evaluate(kinds => {
  __hallowScene(); const c = document.createElement('canvas'); c.width = c.height = 320; const ctx = c.getContext('2d');
  const facing = [], activity = [];
  for (const kind of kinds) {
    const e = __hallowEnemy(kind); e.vx = 2; e.dir = 1; game.player.x = e.x + 200;
    function pixels() { ctx.clearRect(0,0,320,320); CombatArt.drawEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320); return ctx.getImageData(0,0,320,320).data; }
    const right = pixels(); e.dir = -1; e.vx = -2; game.player.x = e.x - 200;
    const left = pixels(); let mirror = true, distinct = false;
    for (let y = 0; y < 320; y++) for (let x = 0; x < 320; x++) for (let ch = 0; ch < 4; ch++) {
      const i = (y * 320 + x) * 4 + ch, r = (y * 320 + 319 - x) * 4 + ch;
      if (left[i] !== right[r]) mirror = false; if (left[i] !== right[i]) distinct = true;
    }
    facing.push({ kind,mirror:mirror && distinct });
    e.dir = 1; e.vx = kind === 'pixie' ? 2 : -2; game.player.x = e.x + 200;
    if (kind === 'unicorn') { e.state = 2; game.player.x = e.x - 200; }
    if (kind === 'gastropod') e.attackCd = 2.6;
    if (kind === 'chaoselemental') game.fx = [{ type:'teleport',x:e.x,y:e.y,t:0.3,max:0.3 }];
    const drawn = pixels(), expected = document.createElement('canvas'); expected.width = expected.height = 320;
    expected.getContext('2d').drawImage(CombatArt.enemySprite(kind,Math.floor(Time.seconds * 10) % 4,kind !== 'pixie',false),112,112);
    const bytes = expected.getContext('2d').getImageData(0,0,320,320).data;
    activity.push({ kind,exact:drawn.every((v,i) => v === bytes[i]) });
  }
  ctx.translate(4,6); ctx.scale(0.7,0.8); ctx.globalAlpha = 0.6; ctx.fillStyle = '#123456'; ctx.strokeStyle = '#654321'; ctx.font = '17px serif'; ctx.textAlign = 'right'; ctx.imageSmoothingEnabled = true;
  function state() { const m = ctx.getTransform(); return JSON.stringify([m.a,m.b,m.c,m.d,m.e,m.f,ctx.globalAlpha,ctx.fillStyle,ctx.strokeStyle,ctx.lineWidth,ctx.font,ctx.textAlign,ctx.imageSmoothingEnabled,ctx.globalCompositeOperation]); }
  const before = state(), gameplay = __hallowState();
  game.entities.forEach(e => CombatArt.drawEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320));
  const restored = before === state(), unchanged = gameplay === __hallowState();
  const fallback = [E.PIGRON,E.WYVERN,E.GASTROPOD + 10000].every(type => !CombatArt.drawEnemy(ctx,game,{ type },{ x:0,y:0 },320,320));
  return { facing,activity,restored,unchanged,fallback };
},kinds);
check(results,'All Hallow silhouettes mirror exactly using their presentation-facing rule',presentation.facing.every(s => s.mirror),presentation.facing);
check(results,'Activity art follows real run/cooldown/nearby-teleport state without retargeting Unicorn',presentation.activity.every(s => s.exact),presentation.activity);
check(results,'Hallow drawing restores context state, preserves gameplay and retains unconverted fallbacks',presentation.restored && presentation.unchanged && presentation.fallback);

const sheet = await page.evaluate(kinds => {
  const c = document.createElement('canvas'); c.width = 1152; c.height = 760; const ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0,0,c.width,c.height); ctx.fillStyle = '#ecd49e'; ctx.font = '20px monospace'; ctx.fillText('TREE / golden wings, ivory gallop, coral shell and crystal seams',20,30);
  kinds.forEach((kind,i) => [false,true].forEach((active,row) => {
    const x = i * 288, y = 50 + row * 350;
    ctx.drawImage(CombatArt.enemySprite(kind,row ? 3 : 1,active,false),x,y,288,288);
    ctx.fillStyle = '#d9d5c4'; ctx.font = '15px monospace'; ctx.fillText(kind,x + 12,y + 306);
    ctx.fillStyle = '#9cabc6'; ctx.fillText(active ? ['alternate flap','running','firing cooldown','near teleport effect'][i] : 'normal',x + 12,y + 328);
  }));
  return c.toDataURL('image/png');
},kinds);
writeFileSync(dir + '/hallow-artwork.png',Buffer.from(sheet.split(',')[1],'base64'));
for (const active of [false,true]) {
  await page.evaluate(({ kinds,active }) => {
    __hallowScene(); const o = __hallowOrigin, p = game.player; p.x = o.x; p.y = o.gy * TILE - p.h / 2 - 0.01;
    kinds.forEach((kind,i) => {
      const e = __hallowEnemy(kind); e.x = o.x + [-220,220,140,-110][i];
      e.y = kind === 'unicorn' ? o.gy * TILE - e.h / 2 - 0.01 : o.gy * TILE - [110,0,90,155][i];
      if (kind === 'unicorn') { e.dir = -1; e.state = active ? 2 : 1; e.timer = 1; }
      if (kind === 'gastropod') e.attackCd = active ? 0 : 1;
      if (kind === 'chaoselemental') e.timer = active ? 0 : 1;
      const random = Math.random; try { Math.random = () => kind === 'chaoselemental' ? 0.75 : 0.25; enemyStep(e,game); } finally { Math.random = random; }
    });
    game.cam.x = o.x; game.cam.y = p.y - 100;
    for (let tick = 0; tick < 10; tick++) updateProjectiles(); p.invuln = 0;
    updateHud(); updateCrosshair(); window.__hallowHook = CombatArt.drawEnemy; CombatArt.drawEnemy = () => false; render();
  },{ kinds,active });
  const name = active ? 'active' : 'normal';
  await page.screenshot({ path:dir + `/${name}-before.png` });
  await page.evaluate(() => { CombatArt.drawEnemy = __hallowHook; delete window.__hallowHook; render(); });
  await page.screenshot({ path:dir + `/${name}-after.png` });
}
writeFileSync(dir + '/index.html',`<!doctype html><meta charset="utf-8"><title>Hallow enemy artwork</title>
<style>body{background:#202534;color:#dedbc9;font:16px monospace;max-width:1280px;margin:24px auto;padding:0 16px}img{width:100%;image-rendering:pixelated}.row{display:flex;gap:16px}figure{margin:8px 0;flex:1}a{color:#ecd49e}</style>
<h1>Hallow enemy artwork</h1><p>Original cached pixel art. Same simulation bodies, AI, attacks and drops.</p><img src="hallow-artwork.png" alt="Pixie, Unicorn, Gastropod and Chaos Elemental, normal and active artwork">
${['normal','active'].map(state => `<h2>${state} fixture</h2><p>Real spawns/AI in an isolated Hallow display fixture, then ten projectile ticks. Position/readiness and the Hallow biome band are explicit review setup, not world-generation changes.</p><div class="row"><figure><img src="${state}-before.png" alt="Legacy ${state} Hallow enemies"><figcaption>Before — only the new general-enemy hook disabled</figcaption></figure><figure><img src="${state}-after.png" alt="Pixel-art ${state} Hallow enemies"><figcaption>After — same combat state</figcaption></figure></div>`).join('')}
<p><a href="../jungle/index.html">Jungle gallery</a> · <a href="../etherian/index.html">Etherian gallery</a> · <a href="../player/index.html">Player controls/animation</a></p>`);
await assertNoBrowserErrors(results);
await finish(results,browser,'hallow-graphics',{ sources,ai,presentation });
