// Grounded creature artwork: keep actual walking, probabilistic jumps and rare tables.
import { mkdirSync, writeFileSync } from 'node:fs';
import { setupAudit, check, assertNoBrowserErrors, finish } from './audit2/lib.mjs';

export async function runWalkingGraphicsCheck({ name,title,roster,invasion = false }) {
const { browser, page, results } = await setupAudit();
const kinds = roster.map(s => s.kind);
const dir = 'test-results/graphics/' + name;
const sheetFile = name === 'crawlers' ? 'crawler-artwork.png' : name + '-artwork.png';
mkdirSync(dir,{ recursive:true });
await page.evaluate(roster => {
  game.paused = true; game.weather.active = false; game.event = null;
  const w = game.world, tx = Math.floor(w.spawnX / TILE), gy = Math.min(w.H - 10,w.hellY + 12);
  for (let x = tx - 43; x <= tx + 43; x++) {
    for (let y = gy - 35; y < gy; y++) { w.set(x,y,T.AIR); w.setWall(x,y,WALL.CAVE); }
    w.set(x,gy,T.STONE); if ((x - tx) % 6 === 0) w.set(x,gy - 4,T.TORCH);
  }
  window.__crawlTypes = Object.fromEntries(roster.map(s => [s.kind,E[s.type]]));
  window.__crawlOrigin = { tx,gy,x:tx * TILE + 8 };
  window.__crawlScene = function(wet = false,hardmode = true) {
    for (let x = tx - 40; x <= tx + 40; x++) for (let y = gy - 3; y < gy; y++) w.set(x,y,wet ? T.WATER : T.AIR);
    game.entities = []; game.bossBars = []; game.projectiles.list = []; game.fx = []; game.fxTexts = []; game.pickups = [];
    game.event = null; game.flashT = game.shakeT = 0; game.hardmode = hardmode;
    const p = game.player; p.x = __crawlOrigin.x - 120; p.y = gy * TILE - p.h / 2 - 0.01;
    p.vx = p.vy = 0; p.onGround = true; p.invuln = 999; p.hp = p.maxHp = 100; p.dying = false; p.respawnT = 0;
    game.cam.x = __crawlOrigin.x; game.cam.y = p.y - 90; game.timeOfDay = 0.5;
    document.getElementById('screenflash').style.display = 'none'; document.getElementById('deathscreen').classList.add('hidden');
    document.getElementById('message').style.display = 'none'; document.getElementById('interact').style.display = 'none';
  };
  window.__crawlEnemy = function(kind) {
    const type = __crawlTypes[kind], e = spawnEntity(game,type,__crawlOrigin.x,gy * TILE - ENT_DEF[type].h / 2 - 0.01);
    e.onGround = true; return e;
  };
  window.__crawlTerrain = function() {
    function hash(a) { let h = 2166136261; for (let i = 0; i < a.length; i++) h = Math.imul(h ^ a[i],16777619); return h >>> 0; }
    return [w.tiles,w.walls,w.hp,w.surfaceY].map(hash).concat([Array.from(w.liquidQueue || []).join(',')]);
  };
  window.__crawlState = function() {
    return JSON.stringify({ player:game.player,entities:game.entities,projectiles:game.projectiles.list,bars:game.bossBars,progress:game.bossesDefeated,
      event:game.event,hardmode:game.hardmode,eventCompletions:game.eventCompletions,fx:game.fx,texts:game.fxTexts,pickups:game.pickups,
      flash:game.flashT,kills:game.kills,bestiary:game.bestiary,lantern:game.lanternNight,achievements:game.achievements,terrain:__crawlTerrain() });
  };
  window.__crawlStep = function(e,roll = 0.5) { const random = Math.random; try { Math.random = () => roll; enemyStep(e,game); } finally { Math.random = random; } };
  window.__crawlRender = function(e) {
    const before = __crawlState(), hook = CombatArt.drawEnemy; let calls = 0;
    CombatArt.drawEnemy = (...args) => { if (args[2] === e) calls++; return hook(...args); };
    game.cam.x = e.x; game.cam.y = e.y - 50;
    try { for (let f = 0; f < 2; f++) renderGame(game,ctx2d); } finally { CombatArt.drawEnemy = hook; }
    return { calls,unchanged:before === __crawlState() };
  };
},roster);

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
  return { total,inked,crisp,margins,masks,animated,silhouettes:silhouettes.size,
    stable:kinds.every((k,i) => bytes(k,0,false,false).every((v,n) => v === original[i][n])) };
},kinds);
check(results,'All 64 walking-creature source variants are nonempty, binary-alpha and unclipped',sources.total === 64 && sources.inked === 64 && sources.crisp && sources.margins,sources);
check(results,'Four walking-creature silhouettes are distinct and animate',sources.silhouettes === 4 && sources.animated.every(s => s.frames >= 2),sources.animated);
check(results,'Walking-creature flashes preserve exact alpha and flash colors',sources.masks);
check(results,'Walking-creature artwork regenerates deterministically after shared-cache eviction',sources.stable);

const ai = await page.evaluate(kinds => {
  const walking = [], jumps = [], walls = [], contacts = [], kills = [];
  const near = (a,b) => Math.abs(a - b) < 0.000001;
  for (const kind of kinds) for (const wet of [false,true]) for (const side of [-1,1]) for (const initial of [0,-4]) {
    __crawlScene(wet); const e = __crawlEnemy(kind), x = e.x, y = e.y; e.vx = side * initial;
    game.player.x = e.x + side * 200; game.player.y = e.y;
    const vx = e.vx + (side * e.speed - e.vx) * 0.1; __crawlStep(e);
    walking.push({ kind,wet,side,initial,...__crawlRender(e),correct:e.dir === side && near(e.vx,vx) && near(e.x - x,vx) && e.y === y && e.onGround && e.vy === 0,
      body:e.w === ENT_DEF[e.type].w && e.h === ENT_DEF[e.type].h && !e.segments && !e.arms && !e.ghost,noShots:game.projectiles.list.length === 0 });
  }
  for (const kind of kinds) {
    for (const side of [-1,1]) for (const distance of [40,64,80]) for (const roll of [0,0.02,0.5]) {
      __crawlScene(); const e = __crawlEnemy(kind), x = e.x, y = e.y;
      game.player.x = e.x + side * distance; game.player.y = e.y; __crawlStep(e,roll);
      const jump = distance < 4 * TILE && roll < 0.02;
      jumps.push({ kind,side,distance,roll,...__crawlRender(e),correct:e.dir === side && near(e.x - x,side * e.speed * 0.1) &&
        (jump ? !e.onGround && near(e.vy,-7 + GRAVITY) && e.y < y : e.onGround && e.vy === 0 && e.y === y) });
    }
    for (const side of [-1,1]) {
      __crawlScene(); const e = __crawlEnemy(kind), w = game.world, wx = __crawlOrigin.tx + side * 3, original = [];
      for (let y = __crawlOrigin.gy - 4; y < __crawlOrigin.gy; y++) { original.push([y,w.get(wx,y)]); w.set(wx,y,T.STONE); }
      e.x = side > 0 ? wx * TILE - e.w / 2 - 0.05 : (wx + 1) * TILE + e.w / 2 + 0.05; e.vx = side * e.speed;
      const terrain = JSON.stringify(__crawlTerrain()); game.player.x = e.x + side * 200; game.player.y = e.y; __crawlStep(e);
      walls.push({ kind,side,...__crawlRender(e),correct:e.vx === 0 && (side > 0 ? e.x + e.w / 2 <= wx * TILE : e.x - e.w / 2 >= (wx + 1) * TILE),terrain:terrain === JSON.stringify(__crawlTerrain()) });
      original.forEach(([y,t]) => w.set(wx,y,t));
    }
    __crawlScene(); const e = __crawlEnemy(kind); game.player.x = e.x + 3; game.player.y = e.y;
    game.player.hp = game.player.maxHp = 500; game.player.invuln = 0; __crawlStep(e);
    contacts.push({ kind,...__crawlRender(e),correct:game.player.hp < 500 && game.player.invuln > 0 && e.dmgCd === 0.8 });
    for (const hardmode of [false,true]) for (const roll of [0.001,0.1,0.5,0.649,0.65,0.9]) {
      __crawlScene(false,hardmode); const e = __crawlEnemy(kind), terrain = JSON.stringify(__crawlTerrain());
      hitEntity(e,1,0,0,game); const flash = e.flash > 0, flashed = __crawlRender(e), random = Math.random;
      try { Math.random = () => roll; hitEntity(e,e.hp + e.def + 20,0,0,game); } finally { Math.random = random; }
      const materials = game.pickups.reduce((d,p) => { if (!['coin','silvercoin','goldcoin','platinumcoin'].includes(p.item) && p.count > 0) d[p.item] = (d[p.item] || 0) + p.count; return d; },{});
      const expected = {};
      if (kind === 'goblinscout') expected[I.TATTEREDCLOTH] = 1 + Math.floor(roll * 2);
      else if (kind === 'goblinpeon' || kind === 'goblinthief' || kind === 'goblinwarrior') { if (roll < 0.65) expected[I.GEL] = 1; }
      for (const drop of B83_ENEMY_DROPS[e.name] || []) if (roll < drop.rate) expected[drop.id] = (expected[drop.id] || 0) + 1;
      const before = __crawlState(); renderGame(game,ctx2d);
      const c = document.createElement('canvas'); c.width = c.height = 160; drawEnemy(c.getContext('2d'),e,{ x:e.x,y:e.y },160,160);
      kills.push({ kind,hardmode,roll,correct:JSON.stringify(materials) === JSON.stringify(expected),materials,expected,flash,flashed,dead:e.dead,
        hidden:!c.getContext('2d').getImageData(0,0,160,160).data.some((v,i) => i % 4 === 3 && v),unchanged:before === __crawlState(),terrain:terrain === JSON.stringify(__crawlTerrain()),noChildren:game.entities.length === 1 });
    }
  }
  return { walking,jumps,walls,contacts,kills };
},kinds);
const stable = s => s.calls === 2 && s.unchanged;
for (const kind of kinds) check(results,`${kind}: real dry/wet acceleration, single body and original AI direction`,ai.walking.filter(s => s.kind === kind).every(s => s.correct && s.body && s.noShots && stable(s)),ai.walking.filter(s => !s.correct));
check(results,'Original near-player jumps preserve strict four-tile and 2% boundaries',ai.jumps.every(s => s.correct && stable(s)),ai.jumps.filter(s => !s.correct));
check(results,'All walkers preserve left/right solid-wall collision without mining',ai.walls.every(s => s.correct && s.terrain && stable(s)),ai.walls);
check(results,'Real walking-creature contact damage, invulnerability and cooldown remain intact',ai.contacts.every(s => s.correct && stable(s)),ai.contacts);
check(results,'Real hits/kills retain exact base tables and existing rare entries without new rewards',ai.kills.every(s => s.correct && s.flash && stable(s.flashed) && s.dead && s.hidden && s.unchanged && s.terrain && s.noChildren),ai.kills.filter(s => !s.correct));

let invasionChecks = null;
if (invasion) {
  invasionChecks = await page.evaluate(() => {
    const rows = [];
    for (const type of [E.GOBLINPEON,E.GOBLINTHIEF,E.GOBLINWARRIOR]) {
      __crawlScene(); delete game.eventCompletions.goblinarmy; game.lanternNight.pending = false;
      game.startEvent('goblinarmy'); startWave(game.event);
      const waveOne = game.event.wave === 1 && game.event.pending === 8 && !EVENT_WAVES.goblinarmy.trash.includes(E.GOBLINSCOUT);
      spawnEventEnemy(type); const e = game.entities[game.entities.length - 1];
      e.x = __crawlOrigin.x; e.y = __crawlOrigin.gy * TILE - e.h / 2 - 0.01; e.onGround = true;
      game.player.x = e.x + 200; game.player.y = e.y; __crawlStep(e);
      const live = __crawlRender(e), flag = e.eventEnemy && eventAliveCount() === 1;
      // Last-wave readiness is a display fixture; only real event logic completes it.
      game.event.wave = EVENT_WAVES.goblinarmy.sizes.length; game.event.pending = 0;
      const ready = __crawlRender(e), notCompleted = !game.eventCompletions.goblinarmy && game.event !== null;
      hitEntity(e,e.hp + e.def + 20,0,0,game);
      const before = __crawlState(); renderGame(game,ctx2d);
      const waiting = before === __crawlState() && eventAliveCount() === 0 && game.event !== null && !game.eventCompletions.goblinarmy;
      updateEvents(1 / 60);
      const finished = game.event === null && game.eventCompletions.goblinarmy === true && game.lanternNight.pending;
      const after = __crawlState(); renderGame(game,ctx2d);
      rows.push({ type,waveOne,flag,live,ready,notCompleted,waiting,finished,readonly:after === __crawlState() });
    }
    return rows;
  });
  check(results,'Real Goblin Army flags, first-wave counts and last-kill completion remain simulation-owned',invasionChecks.every(s => s.waveOne && s.flag && stable(s.live) && stable(s.ready) && s.notCompleted && s.waiting && s.finished && s.readonly),invasionChecks);
}

const presentation = await page.evaluate(kinds => {
  __crawlScene(); const c = document.createElement('canvas'); c.width = c.height = 320; const ctx = c.getContext('2d');
  const facing = [], poses = [];
  for (const kind of kinds) {
    const e = __crawlEnemy(kind);
    function pixels() { ctx.clearRect(0,0,320,320); CombatArt.drawEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320); return ctx.getImageData(0,0,320,320).data; }
    e.dir = 1; e.vx = -2; game.player.x = e.x - 200; const right = pixels();
    e.dir = -1; e.vx = 2; game.player.x = e.x + 200; const left = pixels(); let mirror = true, distinct = false;
    for (let y = 0; y < 320; y++) for (let x = 0; x < 320; x++) for (let ch = 0; ch < 4; ch++) {
      const i = (y * 320 + x) * 4 + ch, r = (y * 320 + 319 - x) * 4 + ch;
      if (left[i] !== right[r]) mirror = false; if (left[i] !== right[i]) distinct = true;
    }
    facing.push({ kind,mirror:mirror && distinct });
    for (const [onGround,vy] of [[true,0],[false,-4],[false,-1],[false,3]]) {
      e.dir = 1; e.vx = -2; e.onGround = onGround; e.vy = vy; e.attackCd = 999;
      const drawn = pixels(), expected = document.createElement('canvas'); expected.width = expected.height = 320;
      expected.getContext('2d').drawImage(CombatArt.enemySprite(kind,Math.floor(Time.seconds * 10) % 4,!onGround && vy < -1,false),112,112);
      const bytes = expected.getContext('2d').getImageData(0,0,320,320).data;
      poses.push({ kind,onGround,vy,exact:drawn.every((v,i) => v === bytes[i]) });
    }
  }
  ctx.translate(4,6); ctx.scale(0.7,0.8); ctx.globalAlpha = 0.6; ctx.fillStyle = '#123456'; ctx.strokeStyle = '#654321'; ctx.font = '17px serif'; ctx.textAlign = 'right'; ctx.imageSmoothingEnabled = true;
  function state() { const m = ctx.getTransform(); return JSON.stringify([m.a,m.b,m.c,m.d,m.e,m.f,ctx.globalAlpha,ctx.fillStyle,ctx.strokeStyle,ctx.lineWidth,ctx.font,ctx.textAlign,ctx.imageSmoothingEnabled,ctx.globalCompositeOperation]); }
  const before = state(), gameplay = __crawlState(), random = Math.random; let rng = 0;
  try { Math.random = () => { rng++; return 0.5; }; game.entities.forEach(e => CombatArt.drawEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320)); } finally { Math.random = random; }
  return { facing,poses,restored:before === state(),unchanged:gameplay === __crawlState(),rng,
    fallback:[E.WALLCREEPER,E.JUNGLECREEPER,E.HOPLITE,E.ICEGOLEM,E.GOBLINWARLOCK,-999].every(type => !CombatArt.drawEnemy(ctx,game,{ type },{ x:0,y:0 },320,320)),
    protectedCases:[{ boss:'future' },{ minion:'spider' },{ ooaEnemy:true },{ ooaSentry:true }].every(flags => !CombatArt.drawEnemy(ctx,game,Object.assign({ type:__crawlTypes[kinds[0]] },flags),{ x:0,y:0 },320,320)) };
},kinds);
check(results,'Walking-creature facing follows AI-owned dir despite contrary movement/player position',presentation.facing.every(s => s.mirror),presentation.facing);
check(results,'Only real upward motion enables tucked-leg/retracted-eye poses',presentation.poses.every(s => s.exact),presentation.poses);
check(results,'Walking-creature drawings restore context, consume no RNG and preserve gameplay/world state',presentation.restored && presentation.unchanged && presentation.rng === 0);
check(results,'Unconverted, deferred, boss, summon and Etherian cases retain fallbacks',presentation.fallback && presentation.protectedCases);

const sheet = await page.evaluate(({ kinds,title }) => {
  const c = document.createElement('canvas'); c.width = 1152; c.height = 760; const ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0,0,c.width,c.height); ctx.fillStyle = '#ecd49e'; ctx.font = '18px monospace'; ctx.fillText('TREE / ' + title,20,30);
  kinds.forEach((kind,i) => [false,true].forEach((active,row) => {
    const x = i * 288, y = 50 + row * 350; ctx.drawImage(CombatArt.enemySprite(kind,row ? 3 : 1,active,false),x,y,288,288);
    ctx.fillStyle = '#d9d5c4'; ctx.font = '15px monospace'; ctx.fillText(kind,x + 12,y + 306);
    ctx.fillStyle = '#9cabc6'; ctx.fillText(active ? 'real upward jump' : 'normal',x + 12,y + 328);
  })); return c.toDataURL('image/png');
},{ kinds,title });
writeFileSync(dir + '/' + sheetFile,Buffer.from(sheet.split(',')[1],'base64'));
for (const jumping of [false,true]) {
  await page.evaluate(({ kinds,jumping }) => {
    __crawlScene(); const o = __crawlOrigin, p = game.player;
    kinds.forEach((kind,i) => {
      const e = __crawlEnemy(kind); e.x += [-280,-90,110,300][i]; p.x = e.x + (i % 2 ? -1 : 1) * (jumping ? 40 : 200); p.y = e.y;
      __crawlStep(e,jumping ? 0 : 0.5); if (jumping) for (let tick = 0; tick < 5; tick++) __crawlStep(e);
    });
    p.x = o.x; p.y = o.gy * TILE - p.h / 2 - 0.01; game.cam.x = o.x; game.cam.y = p.y - 100; p.invuln = 0;
    updateHud(); updateCrosshair(); window.__crawlHook = CombatArt.drawEnemy; CombatArt.drawEnemy = () => false; render();
  },{ kinds,jumping });
  const name = jumping ? 'jumping' : 'normal'; await page.screenshot({ path:dir + `/${name}-before.png` });
  await page.evaluate(() => { CombatArt.drawEnemy = __crawlHook; delete window.__crawlHook; render(); });
  await page.screenshot({ path:dir + `/${name}-after.png` });
}
writeFileSync(dir + '/index.html',`<!doctype html><meta charset="utf-8"><title>${title} artwork</title>
<style>body{background:#202534;color:#dedbc9;font:16px monospace;max-width:1280px;margin:24px auto;padding:0 16px}img{width:100%;image-rendering:pixelated}.row{display:flex;gap:16px}figure{margin:8px 0;flex:1}a{color:#ecd49e}</style>
<h1>${title}</h1><p>Original pixel artwork; walking/jumping, AI-owned facing, collisions and loot stay unchanged.</p><img src="${sheetFile}" alt="Four grounded creature source sprites">
${['normal','jumping'].map(state => `<h2>${state}</h2><p>${state === 'normal' ? 'One real AI tick' : 'Six real AI ticks with the existing probabilistic jump'} in a dry torch-lit review room. Room, non-native biome placement, temporary targets, controlled RNG and nonlethal HP are disposable fixtures.</p><div class="row"><figure><img src="${state}-before.png" alt="Legacy ${state} crawlers"><figcaption>Before — only the general-enemy hook disabled</figcaption></figure><figure><img src="${state}-after.png" alt="Pixel-art ${state} crawlers"><figcaption>After — same combat state</figcaption></figure></div>`).join('')}
<p><a href="../aquatic/index.html">Aquatic gallery</a> · <a href="../flyers/index.html">Flyer gallery</a></p>`);
await assertNoBrowserErrors(results);
await finish(results,browser,name === 'crawlers' ? 'crawler-graphics' : name + '-graphics',{ sources,ai,presentation,invasionChecks });
}
