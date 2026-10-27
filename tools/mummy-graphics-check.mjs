// Wrapped desert creatures: original art and real AI/loot isolation checks.
import { mkdirSync, writeFileSync } from 'node:fs';
import { setupAudit, check, assertNoBrowserErrors, finish } from './audit2/lib.mjs';

const { browser, page, results } = await setupAudit();
const kinds = ['mummy','lightmummy','darkmummy','bloodmummy'];
const dir = 'test-results/graphics/mummies';
mkdirSync(dir,{ recursive:true });
await page.evaluate(kinds => {
  game.paused = true; game.weather.active = false; game.event = null;
  const w = game.world, tx = Math.floor(w.spawnX / TILE), gy = w.surfaceY[tx];
  for (let x = tx - 43; x <= tx + 43; x++) {
    w.surfaceY[x] = gy;
    for (let y = Math.max(1,gy - 50); y < gy; y++) { w.set(x,y,T.AIR); w.setWall(x,y,WALL.NONE); }
    w.set(x,gy,T.SANDSTONE);
  }
  // Combined review roster on a disposable floor; not natural spawn conditions.
  const fraction = (tx * TILE + 8) / (w.W * TILE), band = w.jungleLeft ? fraction : 1 - fraction;
  w._bands = [[band - 44 / w.W,band + 44 / w.W,BIOME.DESERT]].concat(w._bands || []);
  window.__mummyTypes = Object.fromEntries(kinds.map((k,i) => [k,[E.MUMMY,E.LIGHTMUMMY,E.DARKMUMMY,E.BLOODMUMMY][i]]));
  window.__mummyOrigin = { tx,gy,x:tx * TILE + 8 };
  window.__mummyScene = function(hardmode = true) {
    game.entities = []; game.bossBars = []; game.projectiles.list = []; game.fx = []; game.fxTexts = []; game.pickups = [];
    game.event = null; game.flashT = game.shakeT = 0; game.hardmode = hardmode;
    const p = game.player; p.x = __mummyOrigin.x - 120; p.y = gy * TILE - p.h / 2 - 0.01;
    p.vx = p.vy = 0; p.onGround = true; p.invuln = 999; p.hp = p.maxHp = 100; p.dying = false; p.respawnT = 0;
    game.cam.x = __mummyOrigin.x; game.cam.y = p.y - 90; game.timeOfDay = 0.5;
    document.getElementById('screenflash').style.display = 'none'; document.getElementById('deathscreen').classList.add('hidden');
    document.getElementById('message').style.display = 'none'; document.getElementById('interact').style.display = 'none';
  };
  window.__mummyEnemy = function(kind) {
    const type = __mummyTypes[kind], e = spawnEntity(game,type,__mummyOrigin.x,gy * TILE - ENT_DEF[type].h / 2 - 0.01);
    e.onGround = true; return e;
  };
  window.__mummyState = function() {
    function hash(a) { let h = 2166136261; for (let i = 0; i < a.length; i++) h = Math.imul(h ^ a[i],16777619); return h >>> 0; }
    return JSON.stringify({ player:game.player,entities:game.entities,projectiles:game.projectiles.list,progress:game.bossesDefeated,
      event:game.event,hardmode:game.hardmode,eventCompletions:game.eventCompletions,fx:game.fx,texts:game.fxTexts,pickups:game.pickups,
      flash:game.flashT,tiles:hash(w.tiles),walls:hash(w.walls),hp:hash(w.hp),surface:hash(w.surfaceY),bands:w._bands });
  };
  window.__mummyRender = function(e) {
    const before = __mummyState(), hook = CombatArt.drawEnemy; let calls = 0;
    CombatArt.drawEnemy = (...args) => { if (args[2] === e) calls++; return hook(...args); };
    game.cam.x = e.x; game.cam.y = e.y - 50;
    try { for (let f = 0; f < 4; f++) renderGame(game,ctx2d); } finally { CombatArt.drawEnemy = hook; }
    return { calls,unchanged:before === __mummyState() };
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
  const activity = kinds.map(kind => { const a = bytes(kind,1,false,false), b = bytes(kind,1,true,false); return { kind,distinct:a.some((v,i) => v !== b[i]) }; });
  return { total,inked,crisp,margins,masks,animated,silhouettes:silhouettes.size,stable,activity };
},kinds);
check(results,'All 64 mummy source variants are nonempty, binary-alpha and unclipped',sources.total === 64 && sources.inked === 64 && sources.crisp && sources.margins,sources);
check(results,'All four wrapped creatures have different alpha silhouettes, not just recolored cloth',sources.silhouettes === 4);
check(results,'Wrapped limbs and loose strips visibly animate; flashes preserve exact alpha',sources.masks && sources.animated.every(s => s.frames >= 2),sources.animated);
check(results,'All four have distinct raised-arm/tucked-foot art for their existing jump',sources.activity.every(s => s.distinct),sources.activity);
check(results,'Mummy artwork regenerates deterministically after shared-cache eviction',sources.stable);

const ai = await page.evaluate(kinds => {
  const walkers = [], walls = [], contacts = [], kills = [];
  function simulate(e,roll = 0.5) { const random = Math.random; try { Math.random = () => roll; enemyStep(e,game); } finally { Math.random = random; } }
  const body = e => e.w === 22 && e.h === 34 && !e.fly && !e.ghost && !e.segments && !e.arms;
  for (const kind of kinds) for (const hardmode of [false,true]) for (const side of [-1,1]) for (const distance of [40,64,80]) for (const roll of [0,0.5]) {
    __mummyScene(hardmode); const e = __mummyEnemy(kind), x = e.x, y = e.y, timer = e.timer;
    game.player.x = e.x + side * distance; game.player.y = e.y; simulate(e,roll);
    const jumping = distance < 4 * TILE && roll < 0.02;
    walkers.push({ kind,hardmode,side,distance,roll,...__mummyRender(e),movement:e.dir === side && Math.abs(e.vx - side * e.speed * 0.1) < 0.000001 && Math.abs(e.x - x - e.vx) < 0.000001,
      jump:jumping ? !e.onGround && Math.abs(e.vy - (-7 + GRAVITY)) < 0.000001 && e.y < y : e.onGround && e.vy === 0 && e.y === y,
      timer:Math.abs(e.timer - (timer - 1 / 60)) < 0.000001,body:body(e),stats:e.hp === e.maxHp && e.dmg === Math.round(ENT_DEF[e.type].dmg * diffScale().dmg) && e.def === ENT_DEF[e.type].def,
      shots:game.projectiles.list.length });
  }
  for (const kind of kinds) for (const side of [-1,1]) {
    __mummyScene(); const e = __mummyEnemy(kind), w = game.world, wx = __mummyOrigin.tx + side * 2, wy = Math.floor(e.y / TILE), original = [];
    for (let y = wy - 1; y <= wy + 1; y++) { original.push([y,w.get(wx,y)]); w.set(wx,y,T.SANDSTONE); }
    e.x = side > 0 ? wx * TILE - e.w / 2 - 0.05 : (wx + 1) * TILE + e.w / 2 + 0.05;
    game.player.x = e.x + side * 180; game.player.y = e.y; simulate(e);
    const blocked = e.vx === 0 && (side > 0 ? e.x + e.w / 2 <= wx * TILE : e.x - e.w / 2 >= (wx + 1) * TILE), rendered = __mummyRender(e);
    original.forEach(([y,t]) => w.set(wx,y,t));
    const x = e.x; simulate(e);
    walls.push({ kind,side,blocked,resumes:Math.abs(e.x - x - side * e.speed * 0.1) < 0.000001,...rendered });
  }
  for (const kind of kinds) {
    __mummyScene(); let e = __mummyEnemy(kind);
    game.player.x = e.x + 3; game.player.y = e.y; game.player.hp = game.player.maxHp = 500; game.player.invuln = 0;
    const hp = game.player.hp; simulate(e);
    contacts.push({ kind,damaged:game.player.hp < hp,invuln:game.player.invuln > 0,cooldown:e.dmgCd === 0.8,...__mummyRender(e) });
    for (const hardmode of [false,true]) for (const roll of [0,0.9]) {
      __mummyScene(hardmode); e = __mummyEnemy(kind); hitEntity(e,1,0,0,game);
      const flash = e.flash > 0, flashed = __mummyRender(e), random = Math.random;
      try { Math.random = () => roll; hitEntity(e,e.hp + e.def + 20,0,0,game); } finally { Math.random = random; }
      const drops = Object.fromEntries(game.pickups.map(p => [p.item,p.count])), before = __mummyState(); renderGame(game,ctx2d);
      const c = document.createElement('canvas'); c.width = c.height = 160; drawEnemy(c.getContext('2d'),e,{ x:e.x,y:e.y },160,160);
      const hidden = !c.getContext('2d').getImageData(0,0,160,160).data.some((v,i) => i % 4 === 3 && v);
      kills.push({ kind,hardmode,roll,flash,flashed,dead:e.dead,hidden,drops,unchanged:before === __mummyState() });
    }
  }
  return { walkers,walls,contacts,kills };
},kinds);
for (const kind of kinds) check(results,`${kind}: real walking, four-tile jump/no-jump boundary, stats and timers survive before/after Hardmode`,ai.walkers.filter(s => s.kind === kind).every(s => s.calls === 4 && s.unchanged && s.movement && s.jump && s.timer && s.body && s.stats && s.shots === 0),ai.walkers.filter(s => s.kind === kind));
check(results,'All four mummies retain left/right wall collision and real acceleration after the wall is removed',ai.walls.every(s => s.blocked && s.resumes && s.calls === 4 && s.unchanged),ai.walls);
check(results,'All real contact attacks preserve player damage, invulnerability and original contact cooldown',ai.contacts.every(s => s.damaged && s.invuln && s.cooldown && s.calls === 4 && s.unchanged),ai.contacts);
check(results,'Real hit flashes, hidden dead bodies and exact sand/light/night soul drops survive before/after Hardmode',ai.kills.every(s => {
  const materials = Object.fromEntries(Object.entries(s.drops).filter(([id]) => !['coin','silvercoin','goldcoin','platinumcoin'].includes(id)));
  const expected = s.kind === 'mummy' ? { sand:2 } : s.kind === 'lightmummy' ? { soullight:1 } : { soulnight:1 };
  return s.flash && s.flashed.calls === 4 && s.flashed.unchanged && s.dead && s.hidden && s.unchanged && JSON.stringify(materials) === JSON.stringify(expected);
}),ai.kills);

const presentation = await page.evaluate(kinds => {
  __mummyScene(); const c = document.createElement('canvas'); c.width = c.height = 320; const ctx = c.getContext('2d');
  const facing = [], activity = [];
  for (const kind of kinds) {
    const e = __mummyEnemy(kind);
    function pixels() { ctx.clearRect(0,0,320,320); CombatArt.drawEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320); return ctx.getImageData(0,0,320,320).data; }
    e.dir = 1; e.vx = -2; game.player.x = e.x - 200;
    const right = pixels(); e.dir = -1; e.vx = 2; game.player.x = e.x + 200;
    const left = pixels(); let mirror = true, distinct = false;
    for (let y = 0; y < 320; y++) for (let x = 0; x < 320; x++) for (let ch = 0; ch < 4; ch++) {
      const i = (y * 320 + x) * 4 + ch, r = (y * 320 + 319 - x) * 4 + ch;
      if (left[i] !== right[r]) mirror = false; if (left[i] !== right[i]) distinct = true;
    }
    facing.push({ kind,mirror:mirror && distinct });
    for (const pose of ['grounded','rising','falling','grounded-negative-vy']) {
      e.dir = 1; e.vx = -2; e.onGround = pose === 'grounded' || pose === 'grounded-negative-vy'; e.vy = pose === 'falling' ? 4 : -6;
      const drawn = pixels(), expected = document.createElement('canvas'); expected.width = expected.height = 320;
      expected.getContext('2d').drawImage(CombatArt.enemySprite(kind,Math.floor(Time.seconds * 10) % 4,pose === 'rising',false),112,112);
      const bytes = expected.getContext('2d').getImageData(0,0,320,320).data;
      activity.push({ kind,pose,exact:drawn.every((v,i) => v === bytes[i]) });
    }
  }
  ctx.translate(4,6); ctx.scale(0.7,0.8); ctx.globalAlpha = 0.6; ctx.fillStyle = '#123456'; ctx.strokeStyle = '#654321'; ctx.font = '17px serif'; ctx.textAlign = 'right'; ctx.imageSmoothingEnabled = true;
  function state() { const m = ctx.getTransform(); return JSON.stringify([m.a,m.b,m.c,m.d,m.e,m.f,ctx.globalAlpha,ctx.fillStyle,ctx.strokeStyle,ctx.lineWidth,ctx.font,ctx.textAlign,ctx.imageSmoothingEnabled,ctx.globalCompositeOperation]); }
  const before = state(), gameplay = __mummyState();
  game.entities.forEach(e => CombatArt.drawEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320));
  const restored = before === state(), unchanged = gameplay === __mummyState();
  const fallback = [E.DESERTSPIRIT,E.GHOUL,E.LAMIA,E.SANDSHARK,-999].every(type => !CombatArt.drawEnemy(ctx,game,{ type },{ x:0,y:0 },320,320));
  const protectedCases = [{ boss:'future' },{ minion:'mummy' },{ ooaEnemy:true },{ ooaSentry:true }].every(flags => !CombatArt.drawEnemy(ctx,game,Object.assign({ type:E.MUMMY },flags),{ x:0,y:0 },320,320));
  return { facing,activity,restored,unchanged,fallback,protectedCases };
},kinds);
check(results,'All four mummies follow AI dir despite contrary velocity/player location, with exact mirrored silhouettes',presentation.facing.every(s => s.mirror),presentation.facing);
check(results,'Raised arms and tucked feet follow actual rising motion only, not falling or a grounded negative vy',presentation.activity.every(s => s.exact),presentation.activity);
check(results,'Mummy drawings restore context state and preserve gameplay',presentation.restored && presentation.unchanged);
check(results,'Unsupported desert enemies, bosses, summons and Etherian flags retain legacy renderers',presentation.fallback && presentation.protectedCases);

const sheet = await page.evaluate(kinds => {
  const c = document.createElement('canvas'); c.width = 1152; c.height = 760; const ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0,0,c.width,c.height); ctx.fillStyle = '#ecd49e'; ctx.font = '20px monospace'; ctx.fillText('TREE / frayed windings, sun collar, torn hood and crimson cocoon',20,30);
  kinds.forEach((kind,i) => [false,true].forEach((active,row) => {
    const x = i * 288, y = 50 + row * 350;
    ctx.drawImage(CombatArt.enemySprite(kind,row ? 3 : 1,active,false),x,y,288,288);
    ctx.fillStyle = '#d9d5c4'; ctx.font = '15px monospace'; ctx.fillText(kind,x + 12,y + 306);
    ctx.fillStyle = '#9cabc6'; ctx.fillText(active ? 'real jump / tucked feet' : 'normal wrapped walk',x + 12,y + 328);
  }));
  return c.toDataURL('image/png');
},kinds);
writeFileSync(dir + '/mummy-artwork.png',Buffer.from(sheet.split(',')[1],'base64'));
for (const active of [false,true]) {
  await page.evaluate(({ kinds,active }) => {
    __mummyScene(); const o = __mummyOrigin, p = game.player; p.x = o.x; p.y = o.gy * TILE - p.h / 2 - 0.01;
    kinds.forEach((kind,i) => {
      const e = __mummyEnemy(kind); e.x = o.x + [-260,-110,110,260][i];
      // Each actor gets a nearby temporary target for its real jump; restore immediately.
      const px = p.x, random = Math.random;
      try {
        if (active) p.x = e.x + (i < 2 ? 45 : -45);
        Math.random = () => active ? 0 : 0.5;
        enemyStep(e,game);
        if (active) for (let tick = 0; tick < 4; tick++) enemyStep(e,game);
      } finally { p.x = px; Math.random = random; }
    });
    game.cam.x = o.x; game.cam.y = p.y - 100;
    for (let tick = 0; tick < 10; tick++) updateProjectiles(); p.invuln = 0;
    updateHud(); updateCrosshair(); window.__mummyHook = CombatArt.drawEnemy; CombatArt.drawEnemy = () => false; render();
  },{ kinds,active });
  const name = active ? 'jump' : 'normal';
  await page.screenshot({ path:dir + `/${name}-before.png` });
  await page.evaluate(() => { CombatArt.drawEnemy = __mummyHook; delete window.__mummyHook; render(); });
  await page.screenshot({ path:dir + `/${name}-after.png` });
}
writeFileSync(dir + '/index.html',`<!doctype html><meta charset="utf-8"><title>Mummy artwork</title>
<style>body{background:#202534;color:#dedbc9;font:16px monospace;max-width:1280px;margin:24px auto;padding:0 16px}img{width:100%;image-rendering:pixelated}.row{display:flex;gap:16px}figure{margin:8px 0;flex:1}a{color:#ecd49e}</style>
<h1>Four wrapped desert creatures</h1><p>Original pixel art; unchanged AI, bodies, attacks and drops.</p><img src="mummy-artwork.png" alt="Mummy, Light Mummy, Dark Mummy and Blood Mummy artwork">
${['normal','jump'].map(state => `<h2>${state}</h2><p>Combined review roster, not natural spawn conditions. Real spawns/AI on a leveled sandstone floor; display biome, positions, jump RNG and brief nearby target positions are disposable fixtures.</p><div class="row"><figure><img src="${state}-before.png" alt="Legacy ${state} mummy enemies"><figcaption>Before — only the general-enemy hook disabled</figcaption></figure><figure><img src="${state}-after.png" alt="Pixel-art ${state} mummy enemies"><figcaption>After — same combat state</figcaption></figure></div>`).join('')}
<p><a href="../desert/index.html">Desert gallery</a> · <a href="../evil/index.html">Corruption/Crimson gallery</a> · <a href="../player/index.html">Player controls</a></p>`);
await assertNoBrowserErrors(results);
await finish(results,browser,'mummy-graphics',{ sources,ai,presentation });
