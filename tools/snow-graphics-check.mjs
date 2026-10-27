// Snow-biome artwork and real movement/attack/drop checks in a disposable world.
import { mkdirSync, writeFileSync } from 'node:fs';
import { setupAudit, check, assertNoBrowserErrors, finish } from './audit2/lib.mjs';

const { browser, page, results } = await setupAudit();
const kinds = ['icebat','snowflinx','icetortoise','wolf'];
const dir = 'test-results/graphics/snow';
mkdirSync(dir,{ recursive:true });
await page.evaluate(kinds => {
  game.paused = true; game.weather.active = false; game.event = null;
  const w = game.world, tx = Math.floor(w.spawnX / TILE), gy = w.surfaceY[tx];
  for (let x = tx - 43; x <= tx + 43; x++) {
    w.surfaceY[x] = gy;
    for (let y = Math.max(1,gy - 50); y < gy; y++) { w.set(x,y,T.AIR); w.setWall(x,y,WALL.NONE); }
    w.set(x,gy,T.SNOW);
  }
  // Explicit display fixture, not a change to generation or spawn eligibility.
  const fraction = (tx * TILE + 8) / (w.W * TILE), band = w.jungleLeft ? fraction : 1 - fraction;
  w._bands = [[band - 44 / w.W,band + 44 / w.W,BIOME.SNOW]].concat(w._bands || []);
  window.__snowTypes = Object.fromEntries(kinds.map((k,i) => [k,[E.ICEBAT,E.SNOWFLINX,E.ICETORTOISE,E.WOLF][i]]));
  window.__snowOrigin = { tx,gy,x:tx * TILE + 8,y:gy * TILE - 90 };
  window.__snowScene = function(hardmode = true) {
    game.entities = []; game.bossBars = []; game.projectiles.list = []; game.fx = []; game.fxTexts = []; game.pickups = [];
    game.event = null; game.flashT = game.shakeT = 0; game.hardmode = hardmode;
    const p = game.player; p.x = __snowOrigin.x - 120; p.y = gy * TILE - p.h / 2 - 0.01;
    p.vx = p.vy = 0; p.onGround = true; p.invuln = 999; p.hp = p.maxHp = 100; p.dying = false; p.respawnT = 0;
    game.cam.x = __snowOrigin.x; game.cam.y = p.y - 90; game.timeOfDay = 0.5;
    document.getElementById('screenflash').style.display = 'none'; document.getElementById('deathscreen').classList.add('hidden');
    document.getElementById('message').style.display = 'none'; document.getElementById('interact').style.display = 'none';
  };
  window.__snowEnemy = function(kind) {
    const e = spawnEntity(game,__snowTypes[kind],__snowOrigin.x,__snowOrigin.y);
    if (kind !== 'icebat') { e.y = gy * TILE - e.h / 2 - 0.01; e.onGround = true; }
    return e;
  };
  window.__snowState = function() {
    function hash(a) { let h = 2166136261; for (let i = 0; i < a.length; i++) h = Math.imul(h ^ a[i],16777619); return h >>> 0; }
    return JSON.stringify({ player:game.player,entities:game.entities,projectiles:game.projectiles.list,progress:game.bossesDefeated,
      event:game.event,hardmode:game.hardmode,eventCompletions:game.eventCompletions,fx:game.fx,texts:game.fxTexts,pickups:game.pickups,
      flash:game.flashT,tiles:hash(w.tiles),walls:hash(w.walls),hp:hash(w.hp),surface:hash(w.surfaceY),bands:w._bands });
  };
  window.__snowRender = function(e) {
    const before = __snowState(), hook = CombatArt.drawEnemy; let calls = 0;
    CombatArt.drawEnemy = (...args) => { if (args[2] === e) calls++; return hook(...args); };
    game.cam.x = e.x; game.cam.y = e.y - 50;
    try { for (let f = 0; f < 4; f++) renderGame(game,ctx2d); } finally { CombatArt.drawEnemy = hook; }
    return { calls,unchanged:before === __snowState() };
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
  const differs = (a,b) => a.some((v,i) => i % 4 === 3 && v !== b[i]);
  const distinctRelatives = differs(bytes('icebat',0,false,false),bytes('junglebat',0,false,false)) && differs(bytes('icetortoise',0,false,false),bytes('tortoise',0,false,false));
  const original = kinds.map(k => Array.from(bytes(k,0,false,false)));
  for (const boss of ['kingslime','eyeofcthulhu','brainofcthulhu','queenbee','skeletron','wallofflesh','retinazer','spazmatism','destroyer','skelprime','queenslime','plantera','golem','duke','empress','moonlord','cultist']) {
    for (const phase of [false,true]) for (let f = 0; f < 4; f++) for (const flash of [false,true]) CombatArt.bossSprite(boss,phase,f,flash);
  }
  const stable = kinds.every((k,i) => bytes(k,0,false,false).every((v,n) => v === original[i][n]));
  const activity = ['snowflinx','icetortoise','wolf'].map(kind => { const a = bytes(kind,1,false,false), b = bytes(kind,1,true,false); return { kind,distinct:a.some((v,i) => v !== b[i]) }; });
  return { total,inked,crisp,margins,masks,animated,silhouettes:silhouettes.size,distinctRelatives,stable,activity };
},kinds);
check(results,'All 64 snow source variants are nonempty, binary-alpha and unclipped',sources.total === 64 && sources.inked === 64 && sources.crisp && sources.margins,sources);
check(results,'Four snow silhouettes are distinct, including Bat/Tortoise shapes different from their jungle relatives',sources.silhouettes === 4 && sources.distinctRelatives);
check(results,'Every snow creature visibly animates and hit flashes preserve its exact alpha',sources.masks && sources.animated.every(s => s.frames >= 2),sources.animated);
check(results,'Flinx/Wolf jumping and tucked Tortoise have distinct activity art',sources.activity.every(s => s.distinct),sources.activity);
check(results,'Snow artwork regenerates deterministically after shared-cache eviction',sources.stable);

const ai = await page.evaluate(kinds => {
  const flying = [], walkers = [], charges = [], walls = [], contacts = [], kills = [];
  function simulate(e,roll = 0.5) { const random = Math.random; try { Math.random = () => roll; enemyStep(e,game); } finally { Math.random = random; } }
  const body = e => e.w === ENT_DEF[e.type].w && e.h === ENT_DEF[e.type].h && !e.segments && !e.arms;
  for (const hardmode of [false,true]) for (const side of [-1,1]) {
    __snowScene(hardmode); const e = __snowEnemy('icebat'), x = e.x, y = e.y, bob = e.bob;
    game.player.x = e.x + side * 200; game.player.y = e.y; simulate(e);
    flying.push({ hardmode,side,...__snowRender(e),motion:Math.abs(e.x - x - side * e.speed) < 0.000001 && Math.abs(e.y - y - Math.sin(bob + 0.06) * 0.8) < 0.000001,body:body(e),shots:game.projectiles.list.length });
  }
  for (const kind of ['snowflinx','wolf']) for (const side of [-1,1]) for (const distance of [40,64,80]) for (const roll of [0,0.5]) {
    __snowScene(); const e = __snowEnemy(kind), x = e.x, y = e.y;
    game.player.x = e.x + side * distance; game.player.y = e.y; simulate(e,roll);
    const jumping = distance < 4 * TILE && roll < 0.02;
    walkers.push({ kind,side,distance,roll,...__snowRender(e),movement:Math.abs(e.vx - side * e.speed * 0.1) < 0.000001 && Math.abs(e.x - x - e.vx) < 0.000001,
      jump:jumping ? !e.onGround && Math.abs(e.vy - (-7 + GRAVITY)) < 0.000001 && e.y < y : e.onGround && e.vy === 0 && e.y === y,body:body(e),shots:game.projectiles.list.length });
  }
  for (const side of [-1,1]) for (const roll of [0,0.999]) {
    __snowScene(); const e = __snowEnemy('icetortoise');
    game.player.x = e.x + side * 200; game.player.y = e.y; e.timer = 1;
    simulate(e,roll); const waiting = !e.chargeT && e.vx === 0;
    for (const distance of [300,301]) { e.timer = 0; game.player.x = e.x + side * distance; simulate(e,roll); }
    const range = !e.chargeT; game.player.x = e.x + side * 299; e.timer = 0;
    simulate(e,roll); const started = e.chargeT === 0.6 && e.chargeDir === side && e.timer === 3 + roll * 2;
    const startState = __snowRender(e); game.player.x = e.x - side * 200;
    const x = e.x; simulate(e,roll); const locked = e.chargeDir === side && Math.abs(e.x - x - side * e.speed * 4) < 0.000001;
    const charging = __snowRender(e); let steps = 0;
    while (e.chargeT > 0 && steps++ < 60) simulate(e,roll);
    charges.push({ side,roll,waiting,range,started,locked,ended:e.chargeT <= 0 && e.vx === 0,steps,startState,charging,recovery:__snowRender(e),body:body(e),shots:game.projectiles.list.length });
  }
  for (const kind of kinds) for (const side of [-1,1]) {
    __snowScene(); const e = __snowEnemy(kind), w = game.world, wx = __snowOrigin.tx + side * 2, wy = Math.floor(e.y / TILE), original = [];
    for (let y = wy - 1; y <= wy + 1; y++) { original.push([y,w.get(wx,y)]); w.set(wx,y,T.ICE); }
    e.x = side > 0 ? wx * TILE - e.w / 2 - 0.05 : (wx + 1) * TILE + e.w / 2 + 0.05;
    e.attackCd = 10; if (kind === 'icetortoise') { e.chargeT = 0.3; e.chargeDir = side; }
    game.player.x = e.x + side * 180; game.player.y = e.y; simulate(e);
    walls.push({ kind,side,blocked:e.vx === 0 && (side > 0 ? e.x + e.w / 2 <= wx * TILE : e.x - e.w / 2 >= (wx + 1) * TILE),...__snowRender(e) });
    original.forEach(([y,t]) => w.set(wx,y,t));
  }
  for (const kind of kinds) {
    __snowScene(); let e = __snowEnemy(kind); e.attackCd = e.timer = 10;
    game.player.x = e.x + 3; game.player.y = e.y; game.player.hp = game.player.maxHp = 500; game.player.invuln = 0;
    const hp = game.player.hp; simulate(e);
    contacts.push({ kind,damaged:game.player.hp < hp,invuln:game.player.invuln > 0,...__snowRender(e) });
    for (const hardmode of [false,true]) for (const roll of [0,0.9]) {
      __snowScene(hardmode); e = __snowEnemy(kind); hitEntity(e,1,0,0,game);
      const flash = e.flash > 0, flashed = __snowRender(e), random = Math.random;
      try { Math.random = () => roll; hitEntity(e,e.hp + e.def + 20,0,0,game); } finally { Math.random = random; }
      const drops = Object.fromEntries(game.pickups.map(p => [p.item,p.count])), before = __snowState(); renderGame(game,ctx2d);
      const c = document.createElement('canvas'); c.width = c.height = 160; drawEnemy(c.getContext('2d'),e,{ x:e.x,y:e.y },160,160);
      const hidden = !c.getContext('2d').getImageData(0,0,160,160).data.some((v,i) => i % 4 === 3 && v);
      kills.push({ kind,hardmode,roll,flash,flashed,dead:e.dead,hidden,drops,unchanged:before === __snowState() });
    }
  }
  return { flying,walkers,charges,walls,contacts,kills };
},kinds);
check(results,'Ice Bat keeps real left/right flight, bobbing and single-body topology before/after Hardmode',ai.flying.every(s => s.calls === 4 && s.unchanged && s.motion && s.body && s.shots === 0),ai.flying);
for (const kind of ['snowflinx','wolf']) check(results,`${kind}: real walking and probabilistic near-player jump stay unchanged without gaining attacks`,ai.walkers.filter(s => s.kind === kind).every(s => s.calls === 4 && s.unchanged && s.movement && s.jump && s.body && s.shots === 0),ai.walkers.filter(s => s.kind === kind));
check(results,'Ice Tortoise keeps 300-pixel charge trigger, real cooldown rolls, locked four-speed charge and recovery',ai.charges.every(s => s.waiting && s.range && s.started && s.locked && s.ended && s.body && s.shots === 0 && [s.startState,s.charging,s.recovery].every(r => r.calls === 4 && r.unchanged)),ai.charges);
check(results,'All snow creatures retain real left/right solid-wall collision, including the locked charge',ai.walls.every(s => s.blocked && s.calls === 4 && s.unchanged),ai.walls);
check(results,'All four real contact attacks damage the player; rendering preserves damage and invulnerability',ai.contacts.every(s => s.damaged && s.invuln && s.calls === 4 && s.unchanged),ai.contacts);
check(results,'Real hit flashes, hidden dead bodies and exact seeded drop counts survive before/after Hardmode',ai.kills.every(s => {
  const expected = s.kind === 'wolf' ? (s.roll < 0.5 ? { wood:1,leather:1 } : { wood:1 }) : s.kind === 'snowflinx' ? { ice:1,flinxfur:1 } : s.kind === 'icetortoise' ? (s.roll < 0.15 ? { turtleshell:1 } : { ice:2 }) : { ice:1 };
  return s.flash && s.flashed.calls === 4 && s.flashed.unchanged && s.dead && s.hidden && s.unchanged && Object.entries(expected).every(([id,n]) => s.drops[id] === n) && (s.kind !== 'icetortoise' || (s.roll < 0.15 ? !s.drops.ice : !s.drops.turtleshell)) && (s.kind !== 'wolf' || s.roll < 0.5 || !s.drops.leather);
}),ai.kills);

const presentation = await page.evaluate(kinds => {
  __snowScene(); const c = document.createElement('canvas'); c.width = c.height = 320; const ctx = c.getContext('2d');
  const facing = [], activity = [];
  for (const kind of kinds) {
    const e = __snowEnemy(kind);
    function pixels() { ctx.clearRect(0,0,320,320); CombatArt.drawEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320); return ctx.getImageData(0,0,320,320).data; }
    e.dir = kind === 'icebat' ? -1 : 1; e.vx = kind === 'icebat' ? 2 : -2; game.player.x = e.x - 200;
    if (kind === 'icetortoise') { e.chargeT = 0.3; e.chargeDir = 1; e.dir = -1; }
    const right = pixels(); e.dir = -e.dir; e.vx = -e.vx; game.player.x = e.x + 200; if (kind === 'icetortoise') e.chargeDir = -1;
    const left = pixels(); let mirror = true, distinct = false;
    for (let y = 0; y < 320; y++) for (let x = 0; x < 320; x++) for (let ch = 0; ch < 4; ch++) {
      const i = (y * 320 + x) * 4 + ch, r = (y * 320 + 319 - x) * 4 + ch;
      if (left[i] !== right[r]) mirror = false; if (left[i] !== right[i]) distinct = true;
    }
    facing.push({ kind,mirror:mirror && distinct });
    for (const active of [false,true]) {
      e.dir = 1; e.vx = kind === 'icebat' ? 2 : -2; e.chargeDir = 1; e.chargeT = active && kind === 'icetortoise' ? 0.3 : 0;
      e.attackCd = active ? 2.4 : 1; e.onGround = !active; e.vy = active ? -6 : 0;
      const charging = kind === 'icetortoise' && active;
      const frame = Math.floor(Time.seconds * (charging ? 14 : 10)) % 4;
      const drawn = pixels(), expected = document.createElement('canvas'); expected.width = expected.height = 320;
      expected.getContext('2d').drawImage(CombatArt.enemySprite(kind,frame,active && kind !== 'icebat',false),112,112);
      const bytes = expected.getContext('2d').getImageData(0,0,320,320).data;
      activity.push({ kind,active,exact:drawn.every((v,i) => v === bytes[i]) });
    }
  }
  const tortoise = __snowEnemy('icetortoise'); tortoise.vx = 0; tortoise.dir = 1; tortoise.chargeT = 0;
  ctx.clearRect(0,0,320,320); CombatArt.drawEnemy(ctx,game,tortoise,{ x:tortoise.x,y:tortoise.y },320,320);
  const resting = ctx.getImageData(0,0,320,320).data, expected = document.createElement('canvas'); expected.width = expected.height = 320;
  expected.getContext('2d').drawImage(CombatArt.enemySprite('icetortoise',0,false,false),112,112);
  const bytes = expected.getContext('2d').getImageData(0,0,320,320).data, stableRest = resting.every((v,i) => v === bytes[i]);
  ctx.translate(4,6); ctx.scale(0.7,0.8); ctx.globalAlpha = 0.6; ctx.fillStyle = '#123456'; ctx.strokeStyle = '#654321'; ctx.font = '17px serif'; ctx.textAlign = 'right'; ctx.imageSmoothingEnabled = true;
  function state() { const m = ctx.getTransform(); return JSON.stringify([m.a,m.b,m.c,m.d,m.e,m.f,ctx.globalAlpha,ctx.fillStyle,ctx.strokeStyle,ctx.lineWidth,ctx.font,ctx.textAlign,ctx.imageSmoothingEnabled,ctx.globalCompositeOperation]); }
  const before = state(), gameplay = __snowState();
  game.entities.forEach(e => CombatArt.drawEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320));
  const restored = before === state(), unchanged = gameplay === __snowState();
  const fallback = [E.ICESLIME,E.ICEGOLEM,E.PIGRON,E.ICEELEMENTAL,-999].every(type => !CombatArt.drawEnemy(ctx,game,{ type },{ x:0,y:0 },320,320));
  const protectedCases = [{ boss:'future' },{ minion:'bat' },{ ooaEnemy:true },{ ooaSentry:true }].every(flags => !CombatArt.drawEnemy(ctx,game,Object.assign({ type:E.ICEBAT },flags),{ x:0,y:0 },320,320));
  return { facing,activity,stableRest,restored,unchanged,fallback,protectedCases };
},kinds);
check(results,'Bat follows velocity; walkers follow AI dir; charging Tortoise follows locked chargeDir despite contrary state',presentation.facing.every(s => s.mirror),presentation.facing);
check(results,'Activity frames match real jump/charge rules and resting Tortoise keeps frame zero',presentation.stableRest && presentation.activity.every(s => s.exact),presentation.activity);
check(results,'Snow drawings restore context state and preserve gameplay',presentation.restored && presentation.unchanged);
check(results,'Unconverted snow enemies, summons, bosses and Etherian flags retain existing renderers',presentation.fallback && presentation.protectedCases);

const sheet = await page.evaluate(kinds => {
  const c = document.createElement('canvas'); c.width = 1152; c.height = 760; const ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0,0,c.width,c.height); ctx.fillStyle = '#ecd49e'; ctx.font = '20px monospace'; ctx.fillText('TREE / frost-veined wings, shaggy fur, crystal shell and winter wolf',20,30);
  kinds.forEach((kind,i) => [false,true].forEach((active,row) => {
    const x = i * 288, y = 50 + row * 350;
    ctx.drawImage(CombatArt.enemySprite(kind,row ? 3 : 1,active,false),x,y,288,288);
    ctx.fillStyle = '#d9d5c4'; ctx.font = '15px monospace'; ctx.fillText(kind,x + 12,y + 306);
    ctx.fillStyle = '#9cabc6'; ctx.fillText(!active ? 'normal' : { icebat:'alternate flap',snowflinx:'real jump',icetortoise:'locked / tucked charge',wolf:'real jump' }[kind],x + 12,y + 328);
  }));
  return c.toDataURL('image/png');
},kinds);
writeFileSync(dir + '/snow-artwork.png',Buffer.from(sheet.split(',')[1],'base64'));
for (const active of [false,true]) {
  await page.evaluate(({ kinds,active }) => {
    __snowScene(); const o = __snowOrigin, p = game.player; p.x = o.x; p.y = o.gy * TILE - p.h / 2 - 0.01;
    kinds.forEach((kind,i) => {
      const e = __snowEnemy(kind); e.x = o.x + [-230,-40,155,285][i];
      if (kind === 'wolf' && active) e.x = o.x + 45;
      if (kind === 'icebat') e.y = o.gy * TILE - 130;
      if (kind === 'icetortoise') e.timer = active ? 0 : 2;
      const random = Math.random; try {
        Math.random = () => (kind === 'snowflinx' || kind === 'wolf') && active ? 0 : 0.5;
        enemyStep(e,game); if (kind === 'icetortoise' && active) enemyStep(e,game);
        if ((kind === 'snowflinx' || kind === 'wolf') && active) for (let tick = 0; tick < 4; tick++) enemyStep(e,game);
      } finally { Math.random = random; }
    });
    game.cam.x = o.x; game.cam.y = p.y - 100;
    for (let tick = 0; tick < 10; tick++) updateProjectiles(); p.invuln = 0;
    updateHud(); updateCrosshair(); window.__snowHook = CombatArt.drawEnemy; CombatArt.drawEnemy = () => false; render();
  },{ kinds,active });
  const name = active ? 'active' : 'normal';
  await page.screenshot({ path:dir + `/${name}-before.png` });
  await page.evaluate(() => { CombatArt.drawEnemy = __snowHook; delete window.__snowHook; render(); });
  await page.screenshot({ path:dir + `/${name}-after.png` });
}
writeFileSync(dir + '/index.html',`<!doctype html><meta charset="utf-8"><title>Snow enemy artwork</title>
<style>body{background:#202534;color:#dedbc9;font:16px monospace;max-width:1280px;margin:24px auto;padding:0 16px}img{width:100%;image-rendering:pixelated}.row{display:flex;gap:16px}figure{margin:8px 0;flex:1}a{color:#ecd49e}</style>
<h1>Snow enemy artwork</h1><p>Original pixel art; unchanged AI, bodies, attacks and drops.</p><img src="snow-artwork.png" alt="Ice Bat, Snow Flinx, Ice Tortoise and Wolf artwork">
${['normal','active'].map(state => `<h2>${state}</h2><p>Real spawns/AI and ten projectile ticks. Snow band, leveled floor, readiness, jump RNG and positions are disposable review fixtures.</p><div class="row"><figure><img src="${state}-before.png" alt="Legacy ${state} snow enemies"><figcaption>Before — only the general-enemy hook disabled</figcaption></figure><figure><img src="${state}-after.png" alt="Pixel-art ${state} snow enemies"><figcaption>After — same combat state</figcaption></figure></div>`).join('')}
<p><a href="../evil/index.html">Corruption/Crimson gallery</a> · <a href="../jungle/index.html">Jungle gallery</a> · <a href="../player/index.html">Player controls</a></p>`);
await assertNoBrowserErrors(results);
await finish(results,browser,'snow-graphics',{ sources,ai,presentation });
