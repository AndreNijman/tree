// Corruption/Crimson artwork, real attacks and renderer isolation.
import { mkdirSync, writeFileSync } from 'node:fs';
import { setupAudit, check, assertNoBrowserErrors, finish } from './audit2/lib.mjs';

const { browser, page, results } = await setupAudit();
const kinds = ['eaterofsouls','corruptor','crimera','ichorsticker'];
const dir = 'test-results/graphics/evil';
mkdirSync(dir,{ recursive:true });
await page.evaluate(kinds => {
  game.paused = true; game.weather.active = false; game.event = null;
  const w = game.world, tx = Math.floor(w.spawnX / TILE), gy = w.surfaceY[tx];
  for (let x = tx - 43; x <= tx + 43; x++) {
    w.surfaceY[x] = gy;
    for (let y = Math.max(1,gy - 50); y < gy; y++) { w.set(x,y,T.AIR); w.setWall(x,y,WALL.NONE); }
  }
  const fraction = (tx * TILE + 8) / (w.W * TILE), band = w.jungleLeft ? fraction : 1 - fraction, originalBands = w._bands || [];
  window.__evilTypes = Object.fromEntries(kinds.map((k,i) => [k,[E.EATEROFSOULS,E.CORRUPTOR,E.CRIMERA,E.ICHORSTICKER][i]]));
  window.__evilOrigin = { tx,gy,x:tx * TILE + 8,y:gy * TILE - 90 };
  window.__evilScene = function(crimson,hardmode) {
    game.entities = []; game.bossBars = []; game.projectiles.list = []; game.fx = []; game.fxTexts = []; game.pickups = [];
    game.event = null; game.flashT = game.shakeT = 0; game.hardmode = !!hardmode;
    // Only this disposable review world receives a display-biome override.
    w._bands = [[band - 44 / w.W,band + 44 / w.W,crimson ? BIOME.CRIMSON : BIOME.CORRUPT]].concat(originalBands);
    for (let x = tx - 43; x <= tx + 43; x++) w.set(x,gy,crimson ? T.CRIMGRASS : T.CORRUPTGRASS);
    const p = game.player; p.x = __evilOrigin.x - 120; p.y = gy * TILE - p.h / 2 - 0.01;
    p.vx = p.vy = 0; p.onGround = true; p.invuln = 999; p.hp = p.maxHp = 100; p.dying = false; p.respawnT = 0;
    game.cam.x = __evilOrigin.x; game.cam.y = p.y - 90; game.timeOfDay = 0.5;
    document.getElementById('screenflash').style.display = 'none'; document.getElementById('deathscreen').classList.add('hidden');
    document.getElementById('message').style.display = 'none'; document.getElementById('interact').style.display = 'none';
  };
  window.__evilEnemy = function(kind) {
    const e = spawnEntity(game,__evilTypes[kind],__evilOrigin.x,__evilOrigin.y);
    if (kind === 'ichorsticker') { e.y = gy * TILE - e.h / 2 - 0.01; e.onGround = true; }
    return e;
  };
  window.__evilState = function() {
    function hash(a) { let h = 2166136261; for (let i = 0; i < a.length; i++) h = Math.imul(h ^ a[i],16777619); return h >>> 0; }
    return JSON.stringify({ player:game.player,entities:game.entities,projectiles:game.projectiles.list,progress:game.bossesDefeated,
      event:game.event,hardmode:game.hardmode,eventCompletions:game.eventCompletions,fx:game.fx,texts:game.fxTexts,pickups:game.pickups,
      flash:game.flashT,tiles:hash(w.tiles),walls:hash(w.walls),hp:hash(w.hp),surface:hash(w.surfaceY),bands:w._bands });
  };
  window.__evilRender = function(e) {
    const before = __evilState(), hook = CombatArt.drawEnemy; let calls = 0;
    CombatArt.drawEnemy = (...args) => { if (args[2] === e) calls++; return hook(...args); };
    game.cam.x = e.x; game.cam.y = e.y - 50;
    try { for (let f = 0; f < 4; f++) renderGame(game,ctx2d); } finally { CombatArt.drawEnemy = hook; }
    return { calls,unchanged:before === __evilState() };
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
  const activity = ['corruptor','ichorsticker'].map(kind => { const a = bytes(kind,1,false,false), b = bytes(kind,1,true,false); return { kind,distinct:a.some((v,i) => v !== b[i]) }; });
  return { total,inked,crisp,margins,masks,animated,silhouettes:silhouettes.size,stable,activity };
},kinds);
check(results,'All 64 Corruption/Crimson source variants are nonempty, binary-alpha and unclipped',sources.total === 64 && sources.inked === 64 && sources.crisp && sources.margins,sources);
check(results,'Four evil-biome creatures have distinct silhouettes rather than palette swaps',sources.silhouettes === 4);
check(results,'Every creature visibly animates and hit flashes preserve its exact alpha',sources.masks && sources.animated.every(s => s.frames >= 2),sources.animated);
check(results,'Corruptor and Ichor Sticker have distinct read-only firing/cooldown details',sources.activity.every(s => s.distinct),sources.activity);
check(results,'Evil-biome artwork regenerates deterministically after shared-cache eviction',sources.stable);

const ai = await page.evaluate(kinds => {
  const flying = [], corruptors = [], stickers = [], walls = [], contacts = [], kills = [];
  function simulate(e,roll) { const random = Math.random; try { Math.random = () => roll ?? 0.5; enemyStep(e,game); } finally { Math.random = random; } }
  for (const kind of ['eaterofsouls','crimera']) for (const hardmode of [false,true]) for (const side of [-1,1]) {
    __evilScene(kind === 'crimera',hardmode); const e = __evilEnemy(kind), x = e.x, y = e.y, bob = e.bob, d = ENT_DEF[e.type];
    game.player.x = e.x + side * 200; game.player.y = e.y; simulate(e);
    flying.push({ kind,hardmode,side,...__evilRender(e),motion:Math.abs(e.x - x - side * e.speed) < 0.000001 && Math.abs(e.y - y - Math.sin(bob + 0.06) * 0.8) < 0.000001,
      body:e.w === d.w && e.h === d.h && !e.segments && !e.arms,shots:game.projectiles.list.length });
  }
  for (const side of [-1,1]) for (const distance of [240,299,301,303]) for (const roll of [0,0.5,0.999]) {
    __evilScene(false,true); const e = __evilEnemy('corruptor'); game.player.x = e.x + side * distance; game.player.y = e.y;
    simulate(e,roll); const shots = game.projectiles.list.slice();
    const angle = Math.atan2(game.player.y - e.y,game.player.x - e.x) + (roll - 0.5) * 0.5;
    const shouldFire = dist(e.x,e.y,game.player.x,game.player.y) < 300, rendered = __evilRender(e), count = shots.length;
    const correct = shots.every(p => p.type === P.CURSEDFLAME && p.dmg === 20 && p.owner === 'enemy' && p.life === 4 && p.bounces === 2 &&
      p.x === e.x && p.y === e.y && Math.abs(p.vx - Math.cos(angle) * 3.5) < 0.000001 && Math.abs(p.vy - Math.sin(angle) * 3.5) < 0.000001);
    if (shouldFire) simulate(e,roll);
    corruptors.push({ side,distance,roll,...rendered,shouldFire,shots:count,correct,noExtra:game.projectiles.list.length === count,
      cooldown:shouldFire ? Math.abs(e.attackCd - (2.2 - 1 / 60)) < 0.000001 : e.attackCd < 0 });
  }
  for (const side of [-1,1]) for (const distance of [180,359,360,361]) for (const vertical of [0,159,160,161]) {
    __evilScene(true,true); const e = __evilEnemy('ichorsticker'), x = e.x, y = e.y;
    game.player.x = e.x + side * distance; game.player.y = e.y - vertical;
    simulate(e); const shots = game.projectiles.list.slice(), angle = Math.atan2(game.player.y - y,game.player.x - x);
    const shouldFire = distance < 360 && vertical < 160, rendered = __evilRender(e), count = shots.length;
    const correct = shots.every(p => p.type === P.STINGER && p.dmg === 26 && p.owner === 'enemy' && p.life === 3 && p.color === '#d0d050' &&
      p.x === x && p.y === y - 6 && Math.abs(p.vx - Math.cos(angle) * 4) < 0.000001 && Math.abs(p.vy - Math.sin(angle) * 4) < 0.000001);
    const movement = e.dir === side && Math.abs(e.vx - side * e.speed * 0.1) < 0.000001 && Math.abs(e.x - x - e.vx) < 0.000001;
    if (shouldFire) simulate(e);
    stickers.push({ side,distance,vertical,...rendered,shouldFire,shots:count,correct,movement,noExtra:game.projectiles.list.length === count,
      cooldown:shouldFire ? Math.abs(e.attackCd - (2 - 1 / 60)) < 0.000001 : e.attackCd < 0,body:e.w === 20 && e.h === 24 && !e.fly });
  }
  for (const kind of kinds) {
    __evilScene(kind === 'crimera' || kind === 'ichorsticker',true);
    const e = __evilEnemy(kind), w = game.world, wx = __evilOrigin.tx + 2, wy = Math.floor(e.y / TILE), original = [];
    for (let y = wy - 1; y <= wy + 1; y++) { original.push([y,w.get(wx,y)]); w.set(wx,y,T.STONE); }
    e.x = wx * TILE - e.w / 2 - 0.05; e.attackCd = 10; game.player.x = e.x + 180; game.player.y = e.y;
    simulate(e); walls.push({ kind,blocked:e.vx === 0 && e.x + e.w / 2 <= wx * TILE,...__evilRender(e) });
    original.forEach(([y,t]) => w.set(wx,y,t));
  }
  for (const kind of kinds) {
    __evilScene(kind === 'crimera' || kind === 'ichorsticker',true); let e = __evilEnemy(kind); e.attackCd = 10;
    game.player.x = e.x + 3; game.player.y = e.y; game.player.hp = game.player.maxHp = 500; game.player.invuln = 0;
    const hp = game.player.hp; simulate(e);
    contacts.push({ kind,damaged:game.player.hp < hp,invuln:game.player.invuln > 0,...__evilRender(e) });
    for (const hardmode of [false,true]) {
      __evilScene(kind === 'crimera' || kind === 'ichorsticker',hardmode); e = __evilEnemy(kind); hitEntity(e,1,0,0,game);
      const flash = e.flash > 0, flashed = __evilRender(e), random = Math.random;
      try { Math.random = () => 0; hitEntity(e,e.hp + e.def + 20,0,0,game); } finally { Math.random = random; }
      const drops = game.pickups.map(p => p.item), before = __evilState(); renderGame(game,ctx2d);
      const c = document.createElement('canvas'); c.width = c.height = 160; drawEnemy(c.getContext('2d'),e,{ x:e.x,y:e.y },160,160);
      const hidden = !c.getContext('2d').getImageData(0,0,160,160).data.some((v,i) => i % 4 === 3 && v);
      kills.push({ kind,hardmode,flash,flashed,dead:e.dead,hidden,drops,unchanged:before === __evilState() });
    }
  }
  return { flying,corruptors,stickers,walls,contacts,kills };
},kinds);
for (const kind of ['eaterofsouls','crimera']) check(results,`${kind}: real left/right flight, bobbing and single body remain unchanged before/after Hardmode`,ai.flying.filter(s => s.kind === kind).every(s => s.calls === 4 && s.unchanged && s.motion && s.body && s.shots === 0),ai.flying.filter(s => s.kind === kind));
check(results,'Corruptor retains its post-movement 300-pixel range, real aim jitter, two bounces and 20-damage cursed flames',ai.corruptors.every(s => s.calls === 4 && s.unchanged && s.shots === (s.shouldFire ? 1 : 0) && s.correct && s.cooldown && s.noExtra),ai.corruptors);
check(results,'Ichor Sticker retains walking, 360/160 targeting limits, shot origin, 26-damage stingers and cooldown',ai.stickers.every(s => s.calls === 4 && s.unchanged && s.shots === (s.shouldFire ? 1 : 0) && s.correct && s.movement && s.cooldown && s.noExtra && s.body),ai.stickers);
check(results,'All four creatures retain solid-terrain collision and do not gain ghost movement',ai.walls.every(s => s.blocked && s.calls === 4 && s.unchanged),ai.walls);
check(results,'All four real contact attacks damage the player; rendering preserves damage and invulnerability',ai.contacts.every(s => s.damaged && s.invuln && s.calls === 4 && s.unchanged),ai.contacts);
check(results,'Real hit flashes and dead bodies preserve seeded pre-Hardmode/Hardmode drop branches',ai.kills.every(s => {
  const expected = s.kind === 'crimera' ? ['crimtane'] : s.kind === 'ichorsticker' ? ['soulnight','ichor'] : [s.hardmode ? 'soulnight' : 'glowstone'];
  return s.flash && s.flashed.calls === 4 && s.flashed.unchanged && s.dead && s.hidden && s.unchanged && expected.every(id => s.drops.includes(id));
}),ai.kills);

const presentation = await page.evaluate(kinds => {
  __evilScene(false,true); const c = document.createElement('canvas'); c.width = c.height = 320; const ctx = c.getContext('2d');
  const facing = [], activity = [];
  for (const kind of kinds) {
    const e = __evilEnemy(kind);
    function pixels() { ctx.clearRect(0,0,320,320); CombatArt.drawEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320); return ctx.getImageData(0,0,320,320).data; }
    e.dir = 1; e.vx = 2; game.player.x = e.x + 200; const right = pixels();
    e.dir = -1; e.vx = -2; game.player.x = e.x - 200; const left = pixels(); let mirror = true, distinct = false;
    for (let y = 0; y < 320; y++) for (let x = 0; x < 320; x++) for (let ch = 0; ch < 4; ch++) {
      const i = (y * 320 + x) * 4 + ch, r = (y * 320 + 319 - x) * 4 + ch;
      if (left[i] !== right[r]) mirror = false; if (left[i] !== right[i]) distinct = true;
    }
    facing.push({ kind,mirror:mirror && distinct });
    e.dir = kind === 'eaterofsouls' || kind === 'crimera' ? -1 : 1;
    e.vx = kind === 'corruptor' || kind === 'ichorsticker' ? -2 : 2;
    game.player.x = kind === 'ichorsticker' ? e.x - 200 : e.x + 200;
    const active = kind === 'corruptor' || kind === 'ichorsticker'; e.attackCd = active ? (kind === 'corruptor' ? 2.2 : 2) : 0;
    const drawn = pixels(), expected = document.createElement('canvas'); expected.width = expected.height = 320;
    expected.getContext('2d').drawImage(CombatArt.enemySprite(kind,Math.floor(Time.seconds * 10) % 4,active,false),112,112);
    const bytes = expected.getContext('2d').getImageData(0,0,320,320).data;
    activity.push({ kind,exact:drawn.every((v,i) => v === bytes[i]) });
  }
  ctx.translate(4,6); ctx.scale(0.7,0.8); ctx.globalAlpha = 0.6; ctx.fillStyle = '#123456'; ctx.strokeStyle = '#654321'; ctx.font = '17px serif'; ctx.textAlign = 'right'; ctx.imageSmoothingEnabled = true;
  function state() { const m = ctx.getTransform(); return JSON.stringify([m.a,m.b,m.c,m.d,m.e,m.f,ctx.globalAlpha,ctx.fillStyle,ctx.strokeStyle,ctx.lineWidth,ctx.font,ctx.textAlign,ctx.imageSmoothingEnabled,ctx.globalCompositeOperation]); }
  const before = state(), gameplay = __evilState();
  game.entities.forEach(e => CombatArt.drawEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320));
  const restored = before === state(), unchanged = gameplay === __evilState();
  const fallback = [E.DEVOURER,E.CLINGER,E.FLOATYGROSS,-999].every(type => !CombatArt.drawEnemy(ctx,game,{ type },{ x:0,y:0 },320,320));
  return { facing,activity,restored,unchanged,fallback };
},kinds);
check(results,'All four silhouettes mirror exactly without writing enemy facing',presentation.facing.every(s => s.mirror),presentation.facing);
check(results,'Flyers follow velocity, Corruptor follows its target and Ichor Sticker keeps AI dir despite contrary velocity',presentation.activity.every(s => s.exact),presentation.activity);
check(results,'Evil-biome drawings restore context state, preserve gameplay and retain unconverted fallbacks',presentation.restored && presentation.unchanged && presentation.fallback);

const sheet = await page.evaluate(kinds => {
  const c = document.createElement('canvas'); c.width = 1152; c.height = 760; const ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0,0,c.width,c.height); ctx.fillStyle = '#ecd49e'; ctx.font = '20px monospace'; ctx.fillText('TREE / hooked maws, cursed throat, crimson fans and amber siphon',20,30);
  kinds.forEach((kind,i) => [false,true].forEach((active,row) => {
    const x = i * 288, y = 50 + row * 350;
    ctx.drawImage(CombatArt.enemySprite(kind,row ? 3 : 1,active,false),x,y,288,288);
    ctx.fillStyle = '#d9d5c4'; ctx.font = '15px monospace'; ctx.fillText(kind,x + 12,y + 306);
    ctx.fillStyle = '#9cabc6'; ctx.fillText(active && (kind === 'corruptor' || kind === 'ichorsticker') ? 'firing cooldown' : row ? 'alternate wing frame' : 'normal',x + 12,y + 328);
  }));
  return c.toDataURL('image/png');
},kinds);
writeFileSync(dir + '/evil-artwork.png',Buffer.from(sheet.split(',')[1],'base64'));
for (const crimson of [false,true]) for (const active of [false,true]) {
  await page.evaluate(({ crimson,active }) => {
    __evilScene(crimson,true); const o = __evilOrigin, p = game.player; p.x = o.x; p.y = o.gy * TILE - p.h / 2 - 0.01;
    const roster = crimson ? ['crimera','ichorsticker'] : ['eaterofsouls','corruptor'];
    roster.forEach((kind,i) => {
      const e = __evilEnemy(kind); e.x = o.x + (i ? 190 : -190);
      e.y = kind === 'ichorsticker' ? o.gy * TILE - e.h / 2 - 0.01 : o.gy * TILE - (i ? 100 : 135);
      if (i) e.attackCd = active ? 0 : 1;
      const random = Math.random; try { Math.random = () => 0.5; enemyStep(e,game); } finally { Math.random = random; }
    });
    game.cam.x = o.x; game.cam.y = p.y - 100;
    for (let tick = 0; tick < 10; tick++) updateProjectiles(); p.invuln = 0;
    updateHud(); updateCrosshair(); window.__evilHook = CombatArt.drawEnemy; CombatArt.drawEnemy = () => false; render();
  },{ crimson,active });
  const name = (crimson ? 'crimson' : 'corruption') + (active ? '-attack' : '-normal');
  await page.screenshot({ path:dir + `/${name}-before.png` });
  await page.evaluate(() => { CombatArt.drawEnemy = __evilHook; delete window.__evilHook; render(); });
  await page.screenshot({ path:dir + `/${name}-after.png` });
}
writeFileSync(dir + '/index.html',`<!doctype html><meta charset="utf-8"><title>Corruption and Crimson artwork</title>
<style>body{background:#202534;color:#dedbc9;font:16px monospace;max-width:1280px;margin:24px auto;padding:0 16px}img{width:100%;image-rendering:pixelated}.row{display:flex;gap:16px}figure{margin:8px 0;flex:1}a{color:#ecd49e}</style>
<h1>Corruption and Crimson creatures</h1><p>Original pixel artwork. Same bodies, AI, attacks and drops.</p><img src="evil-artwork.png" alt="Eater of Souls, Corruptor, Crimera and Ichor Sticker, normal and active artwork">
${['corruption-normal','corruption-attack','crimson-normal','crimson-attack'].map(state => `<h2>${state}</h2><p>Real spawns/AI and ten projectile ticks. Leveled biome band, readiness and positions are isolated review fixtures.</p><div class="row"><figure><img src="${state}-before.png" alt="Legacy ${state} enemies"><figcaption>Before — only the general-enemy hook disabled</figcaption></figure><figure><img src="${state}-after.png" alt="Pixel-art ${state} enemies"><figcaption>After — same combat state</figcaption></figure></div>`).join('')}
<p><a href="../hallow/index.html">Hallow gallery</a> · <a href="../jungle/index.html">Jungle gallery</a> · <a href="../player/index.html">Player controls/animations</a></p>`);
await assertNoBrowserErrors(results);
await finish(results,browser,'evil-graphics',{ sources,ai,presentation });
