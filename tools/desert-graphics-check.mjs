// Desert artwork and real AI/loot checks, using only disposable fixtures.
import { mkdirSync, writeFileSync } from 'node:fs';
import { setupAudit, check, assertNoBrowserErrors, finish } from './audit2/lib.mjs';

const { browser, page, results } = await setupAudit();
const kinds = ['antlion','antlioncharger','antlionswarmer','vulture'];
const dir = 'test-results/graphics/desert';
mkdirSync(dir,{ recursive:true });
await page.evaluate(kinds => {
  game.paused = true; game.weather.active = false; game.event = null;
  const w = game.world, tx = Math.floor(w.spawnX / TILE), gy = w.surfaceY[tx];
  for (let x = tx - 43; x <= tx + 43; x++) {
    w.surfaceY[x] = gy;
    for (let y = Math.max(1,gy - 50); y < gy; y++) { w.set(x,y,T.AIR); w.setWall(x,y,WALL.NONE); }
    w.set(x,gy,T.SANDSTONE);
  }
  // Leveled display biome only; generation/spawning rules are not changed.
  const fraction = (tx * TILE + 8) / (w.W * TILE), band = w.jungleLeft ? fraction : 1 - fraction;
  w._bands = [[band - 44 / w.W,band + 44 / w.W,BIOME.DESERT]].concat(w._bands || []);
  window.__desertTypes = Object.fromEntries(kinds.map((k,i) => [k,[E.ANTLION,E.ANTLIONCHARGER,E.ANTLIONSWARMER,E.VULTURE][i]]));
  window.__desertOrigin = { tx,gy,x:tx * TILE + 8,y:gy * TILE - 100 };
  window.__desertScene = function(hardmode = true) {
    game.entities = []; game.bossBars = []; game.projectiles.list = []; game.fx = []; game.fxTexts = []; game.pickups = [];
    game.event = null; game.flashT = game.shakeT = 0; game.hardmode = hardmode;
    const p = game.player; p.x = __desertOrigin.x - 120; p.y = gy * TILE - p.h / 2 - 0.01;
    p.vx = p.vy = 0; p.onGround = true; p.invuln = 999; p.hp = p.maxHp = 100; p.dying = false; p.respawnT = 0;
    game.cam.x = __desertOrigin.x; game.cam.y = p.y - 90; game.timeOfDay = 0.5;
    document.getElementById('screenflash').style.display = 'none'; document.getElementById('deathscreen').classList.add('hidden');
    document.getElementById('message').style.display = 'none'; document.getElementById('interact').style.display = 'none';
  };
  window.__desertEnemy = function(kind) {
    const e = spawnEntity(game,__desertTypes[kind],__desertOrigin.x,__desertOrigin.y);
    if (kind === 'antlion' || kind === 'antlioncharger') { e.y = gy * TILE - e.h / 2 - 0.01; e.onGround = true; }
    return e;
  };
  window.__desertState = function() {
    function hash(a) { let h = 2166136261; for (let i = 0; i < a.length; i++) h = Math.imul(h ^ a[i],16777619); return h >>> 0; }
    return JSON.stringify({ player:game.player,entities:game.entities,projectiles:game.projectiles.list,progress:game.bossesDefeated,
      event:game.event,hardmode:game.hardmode,eventCompletions:game.eventCompletions,fx:game.fx,texts:game.fxTexts,pickups:game.pickups,
      flash:game.flashT,tiles:hash(w.tiles),walls:hash(w.walls),hp:hash(w.hp),surface:hash(w.surfaceY),bands:w._bands });
  };
  window.__desertRender = function(e) {
    const before = __desertState(), hook = CombatArt.drawEnemy; let calls = 0;
    CombatArt.drawEnemy = (...args) => { if (args[2] === e) calls++; return hook(...args); };
    game.cam.x = e.x; game.cam.y = e.y - 50;
    try { for (let f = 0; f < 4; f++) renderGame(game,ctx2d); } finally { CombatArt.drawEnemy = hook; }
    return { calls,unchanged:before === __desertState() };
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
  const activity = ['antlion','antlioncharger'].map(kind => { const a = bytes(kind,1,false,false), b = bytes(kind,1,true,false); return { kind,distinct:a.some((v,i) => v !== b[i]) }; });
  return { total,inked,crisp,margins,masks,animated,silhouettes:silhouettes.size,stable,activity };
},kinds);
check(results,'All 64 desert source variants are nonempty, binary-alpha and unclipped',sources.total === 64 && sources.inked === 64 && sources.crisp && sources.margins,sources);
check(results,'Antlion, Charger, Swarmer and Vulture have four distinct silhouettes, not palette swaps',sources.silhouettes === 4);
check(results,'All desert creatures visibly animate and hit flashes preserve exact alpha',sources.masks && sources.animated.every(s => s.frames >= 2),sources.animated);
check(results,'Antlion jump and lowered running Charger have distinct activity artwork',sources.activity.every(s => s.distinct),sources.activity);
check(results,'Desert artwork regenerates deterministically after shared-cache eviction',sources.stable);

const ai = await page.evaluate(kinds => {
  const flying = [], walkers = [], charges = [], walls = [], contacts = [], kills = [];
  function simulate(e,roll = 0.5) { const random = Math.random; try { Math.random = () => roll; enemyStep(e,game); } finally { Math.random = random; } }
  const body = e => e.w === ENT_DEF[e.type].w && e.h === ENT_DEF[e.type].h && !e.segments && !e.arms;
  for (const kind of ['antlionswarmer','vulture']) for (const hardmode of [false,true]) for (const side of [-1,1]) {
    __desertScene(hardmode); const e = __desertEnemy(kind), x = e.x, y = e.y, bob = e.bob;
    game.player.x = e.x + side * 200; game.player.y = e.y; simulate(e);
    flying.push({ kind,hardmode,side,...__desertRender(e),motion:Math.abs(e.x - x - side * e.speed) < 0.000001 && Math.abs(e.y - y - Math.sin(bob + 0.06) * 0.8) < 0.000001,body:body(e),shots:game.projectiles.list.length });
  }
  for (const side of [-1,1]) for (const distance of [40,64,80]) for (const roll of [0,0.5]) {
    __desertScene(); const e = __desertEnemy('antlion'), x = e.x, y = e.y;
    game.player.x = e.x + side * distance; game.player.y = e.y; simulate(e,roll);
    const jumping = distance < 4 * TILE && roll < 0.02;
    walkers.push({ side,distance,roll,...__desertRender(e),movement:e.dir === side && Math.abs(e.vx - side * e.speed * 0.1) < 0.000001 && Math.abs(e.x - x - e.vx) < 0.000001,
      jump:jumping ? !e.onGround && Math.abs(e.vy - (-7 + GRAVITY)) < 0.000001 && e.y < y : e.onGround && e.vy === 0 && e.y === y,body:body(e),shots:game.projectiles.list.length });
  }
  for (const side of [-1,1]) for (const distance of [120,900]) {
    __desertScene(); const e = __desertEnemy('antlioncharger'), x = e.x;
    game.player.x = e.x + side * distance; game.player.y = e.y; e.timer = 1;
    simulate(e); const waiting = e.vx === 0 && e.x === x && Math.abs(e.timer - (1 - 2 / 60)) < 0.000001;
    e.timer = 0; simulate(e); const started = e.timer === 1.4 && e.dir === side && e.vx === side * e.speed && Math.abs(e.x - x - side * e.speed) < 0.000001;
    const startState = __desertRender(e); game.player.x = e.x - side * 200;
    let locked = true, countdown = true;
    // enemyStep and the Charger branch both decrement this shared timer.
    // Preserve the actual 42-tick cycle rather than silently fixing gameplay.
    for (let tick = 0; tick < 10; tick++) {
      const previous = e.x, timer = e.timer; simulate(e);
      locked = locked && e.dir === side && e.vx === side * e.speed && Math.abs(e.x - previous - side * e.speed) < 0.000001;
      countdown = countdown && Math.abs(e.timer - (timer - 2 / 60)) < 0.000001;
    }
    const running = __desertRender(e); let ticks = 10;
    while (e.dir === side && ticks < 90) { simulate(e); ticks++; }
    charges.push({ side,distance,waiting,started,locked,countdown,ticks,retargeted:e.dir === -side && e.vx === -side * e.speed && e.timer === 1.4,
      startState,running,later:__desertRender(e),body:body(e),shots:game.projectiles.list.length });
  }
  for (const kind of kinds) for (const side of [-1,1]) {
    __desertScene(); const e = __desertEnemy(kind), w = game.world, wx = __desertOrigin.tx + side * 2, wy = Math.floor(e.y / TILE), original = [];
    for (let y = wy - 1; y <= wy + 1; y++) { original.push([y,w.get(wx,y)]); w.set(wx,y,T.SANDSTONE); }
    e.x = side > 0 ? wx * TILE - e.w / 2 - 0.05 : (wx + 1) * TILE + e.w / 2 + 0.05;
    if (kind === 'antlioncharger') { e.timer = 1; e.dir = side; e.vx = side * e.speed; }
    game.player.x = e.x + side * 180; game.player.y = e.y; simulate(e);
    const blocked = e.vx === 0 && (side > 0 ? e.x + e.w / 2 <= wx * TILE : e.x - e.w / 2 >= (wx + 1) * TILE), rendered = __desertRender(e);
    let waits = true, resumes = true;
    if (kind === 'antlioncharger') { const x = e.x; simulate(e); waits = e.vx === 0 && e.x === x && e.timer > 0; }
    original.forEach(([y,t]) => w.set(wx,y,t));
    if (kind === 'antlioncharger') { e.timer = 1 / 120; const x = e.x; simulate(e); resumes = e.vx === side * e.speed && Math.abs(e.x - x - side * e.speed) < 0.000001; }
    walls.push({ kind,side,blocked,waits,resumes,...rendered });
  }
  for (const kind of kinds) {
    __desertScene(); let e = __desertEnemy(kind); e.timer = 10;
    game.player.x = e.x + 3; game.player.y = e.y; game.player.hp = game.player.maxHp = 500; game.player.invuln = 0;
    const hp = game.player.hp; simulate(e);
    contacts.push({ kind,damaged:game.player.hp < hp,invuln:game.player.invuln > 0,...__desertRender(e) });
    for (const hardmode of [false,true]) for (const roll of [0.05,0.2,0.5,0.9]) {
      __desertScene(hardmode); e = __desertEnemy(kind); hitEntity(e,1,0,0,game);
      const flash = e.flash > 0, flashed = __desertRender(e), random = Math.random;
      try { Math.random = () => roll; hitEntity(e,e.hp + e.def + 20,0,0,game); } finally { Math.random = random; }
      const drops = Object.fromEntries(game.pickups.map(p => [p.item,p.count])), before = __desertState(); renderGame(game,ctx2d);
      const c = document.createElement('canvas'); c.width = c.height = 160; drawEnemy(c.getContext('2d'),e,{ x:e.x,y:e.y },160,160);
      const hidden = !c.getContext('2d').getImageData(0,0,160,160).data.some((v,i) => i % 4 === 3 && v);
      kills.push({ kind,hardmode,roll,flash,flashed,dead:e.dead,hidden,drops,unchanged:before === __desertState() });
    }
  }
  return { flying,walkers,charges,walls,contacts,kills };
},kinds);
for (const kind of ['antlionswarmer','vulture']) check(results,`${kind}: real left/right flight, bobbing and single body survive before/after Hardmode`,ai.flying.filter(s => s.kind === kind).every(s => s.calls === 4 && s.unchanged && s.motion && s.body && s.shots === 0),ai.flying.filter(s => s.kind === kind));
check(results,'Antlion keeps real walking, probabilistic four-tile jump and no sand-spitting attack',ai.walkers.every(s => s.calls === 4 && s.unchanged && s.movement && s.jump && s.body && s.shots === 0),ai.walkers);
check(results,'Charger keeps full-speed run, locked dir, 1.4 timer reset and existing double-decrement/42-tick retarget cycle',ai.charges.every(s => s.waiting && s.started && s.locked && s.countdown && s.retargeted && s.ticks === 42 && s.body && s.shots === 0 && [s.startState,s.running,s.later].every(r => r.calls === 4 && r.unchanged)),ai.charges);
check(results,'All desert creatures collide left/right; blocked Charger waits for its real timer before resuming',ai.walls.every(s => s.blocked && s.waits && s.resumes && s.calls === 4 && s.unchanged),ai.walls);
check(results,'All four contact attacks retain real damage and invulnerability independently of drawing',ai.contacts.every(s => s.damaged && s.invuln && s.calls === 4 && s.unchanged),ai.contacts);
check(results,'Real flashes, hidden kills and all four seeded amber/sandstone/sand/empty drop branches stay intact',ai.kills.every(s => {
  const materials = Object.fromEntries(Object.entries(s.drops).filter(([id]) => !['coin','silvercoin','goldcoin','platinumcoin'].includes(id)));
  const expected = s.kind === 'antlion' || s.kind === 'antlioncharger' ? (s.roll < 0.1 ? { amber:1 } : s.roll < 0.4 ? { sandstone:1 } : s.roll < 0.55 ? { sand:2 } : {}) : {};
  return s.flash && s.flashed.calls === 4 && s.flashed.unchanged && s.dead && s.hidden && s.unchanged && JSON.stringify(materials) === JSON.stringify(expected);
}),ai.kills);

const presentation = await page.evaluate(kinds => {
  __desertScene(); const c = document.createElement('canvas'); c.width = c.height = 320; const ctx = c.getContext('2d');
  const facing = [], activity = [];
  for (const kind of kinds) {
    const e = __desertEnemy(kind), flyer = kind === 'antlionswarmer' || kind === 'vulture';
    function pixels() { ctx.clearRect(0,0,320,320); CombatArt.drawEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320); return ctx.getImageData(0,0,320,320).data; }
    e.dir = flyer ? -1 : 1; e.vx = flyer ? 2 : -2; game.player.x = e.x - 200;
    const right = pixels(); e.dir = -e.dir; e.vx = -e.vx; game.player.x = e.x + 200;
    const left = pixels(); let mirror = true, distinct = false;
    for (let y = 0; y < 320; y++) for (let x = 0; x < 320; x++) for (let ch = 0; ch < 4; ch++) {
      const i = (y * 320 + x) * 4 + ch, r = (y * 320 + 319 - x) * 4 + ch;
      if (left[i] !== right[r]) mirror = false; if (left[i] !== right[i]) distinct = true;
    }
    facing.push({ kind,mirror:mirror && distinct });
    for (const active of [false,true]) {
      e.dir = 1; e.vx = flyer ? 2 : kind === 'antlioncharger' && active ? -e.speed : 0;
      e.timer = 1.4; e.onGround = !active; e.vy = active ? -6 : 0;
      const running = kind === 'antlioncharger' && active, actualActive = !flyer && active;
      const frame = Math.floor(Time.seconds * (running ? 14 : 10)) % 4;
      const drawn = pixels(), expected = document.createElement('canvas'); expected.width = expected.height = 320;
      expected.getContext('2d').drawImage(CombatArt.enemySprite(kind,frame,actualActive,false),112,112);
      const bytes = expected.getContext('2d').getImageData(0,0,320,320).data;
      activity.push({ kind,active,exact:drawn.every((v,i) => v === bytes[i]) });
    }
  }
  ctx.translate(4,6); ctx.scale(0.7,0.8); ctx.globalAlpha = 0.6; ctx.fillStyle = '#123456'; ctx.strokeStyle = '#654321'; ctx.font = '17px serif'; ctx.textAlign = 'right'; ctx.imageSmoothingEnabled = true;
  function state() { const m = ctx.getTransform(); return JSON.stringify([m.a,m.b,m.c,m.d,m.e,m.f,ctx.globalAlpha,ctx.fillStyle,ctx.strokeStyle,ctx.lineWidth,ctx.font,ctx.textAlign,ctx.imageSmoothingEnabled,ctx.globalCompositeOperation]); }
  const before = state(), gameplay = __desertState();
  game.entities.forEach(e => CombatArt.drawEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320));
  const restored = before === state(), unchanged = gameplay === __desertState();
  // Mummy now has dedicated art; retain the other unsupported desert forms.
  const fallback = [E.DESERTSPIRIT,E.SANDPOACHER,E.DUNESPLICER,E.SANDSHARK,-999].every(type => !CombatArt.drawEnemy(ctx,game,{ type },{ x:0,y:0 },320,320));
  const protectedCases = [{ boss:'future' },{ minion:'insect' },{ ooaEnemy:true },{ ooaSentry:true }].every(flags => !CombatArt.drawEnemy(ctx,game,Object.assign({ type:E.ANTLION },flags),{ x:0,y:0 },320,320));
  return { facing,activity,restored,unchanged,fallback,protectedCases };
},kinds);
check(results,'Flyers face velocity; Antlion/Charger follow AI dir even against velocity/player location',presentation.facing.every(s => s.mirror),presentation.facing);
check(results,'Jump/run art matches existing motion; positive Charger timer alone never implies running',presentation.activity.every(s => s.exact),presentation.activity);
check(results,'Desert drawings restore context state and preserve gameplay',presentation.restored && presentation.unchanged);
check(results,'Unconverted desert creatures, bosses, summons and Etherian flags retain legacy renderers',presentation.fallback && presentation.protectedCases);

const sheet = await page.evaluate(kinds => {
  const c = document.createElement('canvas'); c.width = 1152; c.height = 760; const ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0,0,c.width,c.height); ctx.fillStyle = '#ecd49e'; ctx.font = '20px monospace'; ctx.fillText('TREE / hooked jaws, plated runner, veined wings and feathered vulture',20,30);
  kinds.forEach((kind,i) => [false,true].forEach((active,row) => {
    const x = i * 288, y = 50 + row * 350;
    ctx.drawImage(CombatArt.enemySprite(kind,row ? 3 : 1,active,false),x,y,288,288);
    ctx.fillStyle = '#d9d5c4'; ctx.font = '15px monospace'; ctx.fillText(kind,x + 12,y + 306);
    ctx.fillStyle = '#9cabc6'; ctx.fillText(!active ? 'normal' : { antlion:'real jump',antlioncharger:'running / lowered head',antlionswarmer:'alternate flap',vulture:'alternate flap' }[kind],x + 12,y + 328);
  }));
  return c.toDataURL('image/png');
},kinds);
writeFileSync(dir + '/desert-artwork.png',Buffer.from(sheet.split(',')[1],'base64'));
for (const active of [false,true]) {
  await page.evaluate(({ kinds,active }) => {
    __desertScene(); const o = __desertOrigin, p = game.player; p.x = o.x; p.y = o.gy * TILE - p.h / 2 - 0.01;
    kinds.forEach((kind,i) => {
      const e = __desertEnemy(kind); e.x = o.x + [-45,210,-230,245][i];
      if (kind === 'antlionswarmer' || kind === 'vulture') e.y = o.gy * TILE - (kind === 'vulture' ? 150 : 110);
      if (kind === 'antlioncharger') e.timer = active ? 0 : 1;
      const random = Math.random; try {
        Math.random = () => kind === 'antlion' && active ? 0 : 0.5;
        enemyStep(e,game);
        if (kind === 'antlion' && active) for (let tick = 0; tick < 4; tick++) enemyStep(e,game);
      } finally { Math.random = random; }
    });
    game.cam.x = o.x; game.cam.y = p.y - 100;
    for (let tick = 0; tick < 10; tick++) updateProjectiles(); p.invuln = 0;
    updateHud(); updateCrosshair(); window.__desertHook = CombatArt.drawEnemy; CombatArt.drawEnemy = () => false; render();
  },{ kinds,active });
  const name = active ? 'active' : 'normal';
  await page.screenshot({ path:dir + `/${name}-before.png` });
  await page.evaluate(() => { CombatArt.drawEnemy = __desertHook; delete window.__desertHook; render(); });
  await page.screenshot({ path:dir + `/${name}-after.png` });
}
writeFileSync(dir + '/index.html',`<!doctype html><meta charset="utf-8"><title>Desert enemy artwork</title>
<style>body{background:#202534;color:#dedbc9;font:16px monospace;max-width:1280px;margin:24px auto;padding:0 16px}img{width:100%;image-rendering:pixelated}.row{display:flex;gap:16px}figure{margin:8px 0;flex:1}a{color:#ecd49e}</style>
<h1>Desert enemy artwork</h1><p>Original pixel art; unchanged AI, bodies, attacks and drops.</p><img src="desert-artwork.png" alt="Antlion, Antlion Charger, Antlion Swarmer and Vulture artwork">
${['normal','active'].map(state => `<h2>${state}</h2><p>Real spawns/AI and ten projectile ticks. Desert display band, sandstone floor, readiness, jump RNG and positions are disposable fixtures.</p><div class="row"><figure><img src="${state}-before.png" alt="Legacy ${state} desert enemies"><figcaption>Before — only the general-enemy hook disabled</figcaption></figure><figure><img src="${state}-after.png" alt="Pixel-art ${state} desert enemies"><figcaption>After — same combat state</figcaption></figure></div>`).join('')}
<p><a href="../snow/index.html">Snow gallery</a> · <a href="../evil/index.html">Corruption/Crimson gallery</a> · <a href="../player/index.html">Player controls</a></p>`);
await assertNoBrowserErrors(results);
await finish(results,browser,'desert-graphics',{ sources,ai,presentation });
