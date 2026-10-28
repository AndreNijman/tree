// Aquatic artwork with real wet/shallow/dry AI, collisions, contacts and loot.
import { mkdirSync, writeFileSync } from 'node:fs';
import { setupAudit, check, assertNoBrowserErrors, finish } from './audit2/lib.mjs';

const { browser, page, results } = await setupAudit();
const kinds = ['shark','piranha','bluejellyfish','squid'];
const dir = 'test-results/graphics/aquatic';
mkdirSync(dir,{ recursive:true });
await page.evaluate(kinds => {
  game.paused = true; game.weather.active = false; game.event = null;
  const w = game.world, tx = Math.floor(w.spawnX / TILE), gy = Math.min(w.H - 10,w.hellY + 12);
  window.__aquaTypes = Object.fromEntries(kinds.map((k,i) => [k,[E.SHARK,E.PIRANHA,E.BLUEJELLYFISH,E.SQUID][i]]));
  window.__aquaOrigin = { tx,gy,x:tx * TILE + 8,y:(gy - 10) * TILE + 8 };
  window.__aquaScene = function(wet = true,hardmode = true) {
    for (let x = tx - 43; x <= tx + 43; x++) {
      for (let y = gy - 35; y < gy; y++) { w.set(x,y,wet ? T.WATER : T.AIR); w.setWall(x,y,WALL.CAVE); }
      w.set(x,gy,T.STONE); if ((x - tx) % 6 === 0) { w.set(x,gy - 4,T.TORCH); w.set(x,gy - 14,T.TORCH); }
    }
    game.entities = []; game.bossBars = []; game.projectiles.list = []; game.fx = []; game.fxTexts = []; game.pickups = [];
    game.event = null; game.flashT = game.shakeT = 0; game.hardmode = hardmode;
    const p = game.player; p.x = __aquaOrigin.x - 120; p.y = gy * TILE - p.h / 2 - 0.01;
    p.vx = p.vy = 0; p.onGround = true; p.invuln = 999; p.hp = p.maxHp = 100; p.dying = false; p.respawnT = 0;
    game.cam.x = __aquaOrigin.x; game.cam.y = p.y - 90; game.timeOfDay = 0.5;
    document.getElementById('screenflash').style.display = 'none'; document.getElementById('deathscreen').classList.add('hidden');
    document.getElementById('message').style.display = 'none'; document.getElementById('interact').style.display = 'none';
  };
  window.__aquaEnemy = function(kind) { return spawnEntity(game,__aquaTypes[kind],__aquaOrigin.x,__aquaOrigin.y); };
  window.__aquaTerrain = function() {
    function hash(a) { let h = 2166136261; for (let i = 0; i < a.length; i++) h = Math.imul(h ^ a[i],16777619); return h >>> 0; }
    return [w.tiles,w.walls,w.hp,w.surfaceY].map(hash).concat([Array.from(w.liquidQueue || []).join(',')]);
  };
  window.__aquaState = function() {
    return JSON.stringify({ player:game.player,entities:game.entities,projectiles:game.projectiles.list,bars:game.bossBars,progress:game.bossesDefeated,
      event:game.event,hardmode:game.hardmode,eventCompletions:game.eventCompletions,fx:game.fx,texts:game.fxTexts,pickups:game.pickups,
      flash:game.flashT,terrain:__aquaTerrain() });
  };
  window.__aquaRender = function(e) {
    const before = __aquaState(), hook = CombatArt.drawEnemy; let calls = 0;
    CombatArt.drawEnemy = (...args) => { if (args[2] === e) calls++; return hook(...args); };
    game.cam.x = e.x; game.cam.y = e.y - 50;
    try { for (let f = 0; f < 4; f++) renderGame(game,ctx2d); } finally { CombatArt.drawEnemy = hook; }
    return { calls,unchanged:before === __aquaState() };
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
  return { total,inked,crisp,margins,masks,animated,silhouettes:silhouettes.size,
    stable:kinds.every((k,i) => bytes(k,0,false,false).every((v,n) => v === original[i][n])) };
},kinds);
check(results,'All 64 aquatic source variants are nonempty, binary-alpha and unclipped',sources.total === 64 && sources.inked === 64 && sources.crisp && sources.margins,sources);
check(results,'All four aquatic silhouettes are distinct and animate',sources.silhouettes === 4 && sources.animated.every(s => s.frames >= 2),sources.animated);
check(results,'Aquatic flash variants preserve exact alpha and flash colors',sources.masks);
check(results,'Aquatic sprites regenerate deterministically after shared-cache eviction',sources.stable);

const ai = await page.evaluate(kinds => {
  const movement = [], floors = [], walls = [], contacts = [], kills = [];
  const near = (a,b) => Math.abs(a - b) < 0.000001;
  for (const kind of kinds) for (const mode of ['wet','shallow','dry']) for (const side of [-1,1]) for (const vertical of [-80,0,80]) {
    __aquaScene(mode === 'wet'); const e = __aquaEnemy(kind), x = e.x, y = e.y, bob = e.bob;
    if (mode === 'shallow') game.world.set(__aquaOrigin.tx,Math.floor(e.y / TILE) + 1,T.WATER);
    game.player.x = e.x + side * 200; game.player.y = e.y + vertical;
    const d = Math.hypot(side * 200,vertical), squid = kind === 'squid';
    const vx = squid ? side * 200 / d * e.speed : mode === 'dry' ? 0 : side * 200 / d * e.speed * 0.6 * 0.03;
    const vy = squid ? vertical / d * e.speed + Math.sin(bob + 0.06) * 0.8 : Math.sin(0.06) * e.speed * 0.5 + vertical / d * e.speed * 0.25 + (mode === 'dry' ? GRAVITY : 0);
    e.attackCd = 0; enemyStep(e,game);
    movement.push({ kind,mode,side,vertical,...__aquaRender(e),correct:near(e.x - x,vx) && near(e.y - y,vy) && near(e.vx,vx) && near(e.vy,vy),
      cycle:squid ? near(e.bob,bob + 0.06) : near(e.wave,0.06),
      body:e.w === ENT_DEF[e.type].w && e.h === ENT_DEF[e.type].h && !e.segments && !e.arms && !e.ghost,noShots:game.projectiles.list.length === 0 });
  }
  for (const kind of kinds) {
    __aquaScene(false); const e = __aquaEnemy(kind); e.y = __aquaOrigin.gy * TILE - e.h / 2 - 0.01; e.onGround = true; e.bob = 0;
    game.player.x = e.x + 200; game.player.y = e.y; const y = e.y; enemyStep(e,game);
    floors.push({ kind,...__aquaRender(e),correct:e.onGround && e.vy === 0 && e.y === y });
    for (const side of [-1,1]) {
      __aquaScene(); const e = __aquaEnemy(kind), w = game.world, wx = __aquaOrigin.tx + side * 3, wy = Math.floor(e.y / TILE);
      for (let y = wy - 2; y <= wy + 2; y++) w.set(wx,y,T.STONE);
      e.x = side > 0 ? wx * TILE - e.w / 2 - 0.05 : (wx + 1) * TILE + e.w / 2 + 0.05;
      e.vx = side * 8; const x = e.x, terrain = JSON.stringify(__aquaTerrain()); game.player.x = e.x + side * 200; game.player.y = e.y;
      enemyStep(e,game);
      walls.push({ kind,side,...__aquaRender(e),correct:kind === 'squid' ? e.vx === 0 && (side > 0 ? e.x + e.w / 2 <= wx * TILE : e.x - e.w / 2 >= (wx + 1) * TILE) : (e.x - x) * side > 7,
        terrain:terrain === JSON.stringify(__aquaTerrain()) });
    }
    __aquaScene(); const contact = __aquaEnemy(kind); game.player.x = contact.x + 3; game.player.y = contact.y;
    game.player.hp = game.player.maxHp = 500; game.player.invuln = 0; enemyStep(contact,game);
    contacts.push({ kind,...__aquaRender(contact),correct:game.player.hp < 500 && game.player.invuln > 0 && contact.dmgCd === 0.8 });
    for (const hardmode of [false,true]) for (const roll of [0.001,0.099,0.1,0.399,0.4,0.9]) {
      __aquaScene(true,hardmode); const e = __aquaEnemy(kind), terrain = JSON.stringify(__aquaTerrain());
      hitEntity(e,1,0,0,game); const flash = e.flash > 0, flashed = __aquaRender(e), random = Math.random;
      try { Math.random = () => roll; hitEntity(e,e.hp + e.def + 20,0,0,game); } finally { Math.random = random; }
      const materials = game.pickups.reduce((d,p) => { if (!['coin','silvercoin','goldcoin','platinumcoin'].includes(p.item) && p.count > 0) d[p.item] = (d[p.item] || 0) + p.count; return d; },{});
      const expected = {};
      if (kind === 'shark') { expected[I.SHARKFIN] = 1; expected[I.GEL] = 1; }
      if (kind === 'bluejellyfish' && roll < 0.4) expected[I.GLOWSTONE] = 1;
      if (kind === 'squid') { expected[I.GLOWSTONE] = 1; if (roll < 0.1) expected[I.HEALINGPOTION] = 1; }
      for (const drop of B83_ENEMY_DROPS[e.name] || []) if (roll < drop.rate) expected[drop.id] = (expected[drop.id] || 0) + 1;
      const before = __aquaState(); renderGame(game,ctx2d);
      const c = document.createElement('canvas'); c.width = c.height = 160; drawEnemy(c.getContext('2d'),e,{ x:e.x,y:e.y },160,160);
      kills.push({ kind,hardmode,roll,materials,expected,correct:JSON.stringify(materials) === JSON.stringify(expected),flash,flashed,dead:e.dead,
        hidden:!c.getContext('2d').getImageData(0,0,160,160).data.some((v,i) => i % 4 === 3 && v),unchanged:before === __aquaState(),
        terrain:terrain === JSON.stringify(__aquaTerrain()),noChildren:game.entities.length === 1,noShots:game.projectiles.list.length === 0 });
    }
  }
  return { movement,floors,walls,contacts,kills };
},kinds);
for (const kind of kinds) check(results,`${kind}: real wet/shallow/dry velocity, cycle, body and no new shots`,ai.movement.filter(s => s.kind === kind).every(s => s.correct && s.cycle && s.body && s.noShots && s.calls === 4 && s.unchanged),ai.movement.filter(s => !s.correct));
check(results,'Dry-floor fixtures retain grounded contact and zero vertical speed',ai.floors.every(s => s.correct && s.calls === 4 && s.unchanged),ai.floors);
check(results,'Wet swimmers retain direct movement; Squid retains solid collision without mining',ai.walls.every(s => s.correct && s.terrain && s.calls === 4 && s.unchanged),ai.walls);
check(results,'Real aquatic contact damage, invulnerability and cooldown remain intact',ai.contacts.every(s => s.correct && s.calls === 4 && s.unchanged),ai.contacts);
check(results,'Real seeded aquatic hits/kills preserve material/rare tables and hide corpses',ai.kills.every(s => s.correct && s.flash && s.flashed.calls === 4 && s.flashed.unchanged && s.dead && s.hidden && s.unchanged && s.terrain && s.noChildren && s.noShots),ai.kills.filter(s => !s.correct));

const presentation = await page.evaluate(kinds => {
  __aquaScene(); const c = document.createElement('canvas'); c.width = c.height = 320; const ctx = c.getContext('2d');
  const facing = [], frames = [];
  for (const kind of kinds) {
    const e = __aquaEnemy(kind);
    function pixels() { ctx.clearRect(0,0,320,320); CombatArt.drawEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320); return ctx.getImageData(0,0,320,320).data; }
    for (const speed of [0.05,2]) {
      e.dir = -1; e.vx = speed; game.player.x = e.x - 200; const right = pixels();
      e.dir = 1; e.vx = -speed; game.player.x = e.x + 200; const left = pixels(); let mirror = true, distinct = false;
      for (let y = 0; y < 320; y++) for (let x = 0; x < 320; x++) for (let ch = 0; ch < 4; ch++) {
        const i = (y * 320 + x) * 4 + ch, r = (y * 320 + 319 - x) * 4 + ch;
        if (left[i] !== right[r]) mirror = false; if (left[i] !== right[i]) distinct = true;
      }
      facing.push({ kind,speed,mirror:mirror && distinct });
    }
    for (const cd of [0,999]) for (const flash of [false,true]) {
      e.vx = 2; e.attackCd = cd; e.flash = flash ? 0.1 : 0;
      const drawn = pixels(), expected = document.createElement('canvas'); expected.width = expected.height = 320;
      expected.getContext('2d').drawImage(CombatArt.enemySprite(kind,Math.floor(Time.seconds * 10) % 4,false,flash),112,112);
      const bytes = expected.getContext('2d').getImageData(0,0,320,320).data;
      frames.push({ kind,cd,flash,exact:drawn.every((v,i) => v === bytes[i]) });
    }
  }
  ctx.translate(4,6); ctx.scale(0.7,0.8); ctx.globalAlpha = 0.6; ctx.fillStyle = '#123456'; ctx.strokeStyle = '#654321'; ctx.font = '17px serif'; ctx.textAlign = 'right'; ctx.imageSmoothingEnabled = true;
  function state() { const m = ctx.getTransform(); return JSON.stringify([m.a,m.b,m.c,m.d,m.e,m.f,ctx.globalAlpha,ctx.fillStyle,ctx.strokeStyle,ctx.lineWidth,ctx.font,ctx.textAlign,ctx.imageSmoothingEnabled,ctx.globalCompositeOperation]); }
  const before = state(), gameplay = __aquaState(), random = Math.random; let rng = 0;
  try { Math.random = () => { rng++; return 0.5; }; game.entities.forEach(e => CombatArt.drawEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320)); } finally { Math.random = random; }
  return { facing,frames,restored:before === state(),unchanged:gameplay === __aquaState(),rng,
    fallback:[E.PINKJELLYFISH,E.GREENJELLYFISH,E.ORCA,E.BLOODJELLY,E.ICEGOLEM,-999].every(type => !CombatArt.drawEnemy(ctx,game,{ type },{ x:0,y:0 },320,320)),
    protectedCases:[{ boss:'duke' },{ minion:'shark' },{ ooaEnemy:true },{ ooaSentry:true }].every(flags => !CombatArt.drawEnemy(ctx,game,Object.assign({ type:E.SHARK },flags),{ x:0,y:0 },320,320)) };
},kinds);
check(results,'Aquatic facing follows even damped 0.05px motion, not contrary dir/player values',presentation.facing.every(s => s.mirror),presentation.facing);
check(results,'Exact frame/flash selection creates no invented cooldown poses',presentation.frames.every(s => s.exact),presentation.frames);
check(results,'Aquatic drawings restore context, consume no RNG and never advance water/gameplay',presentation.restored && presentation.unchanged && presentation.rng === 0);
check(results,'Unconverted aquatic creatures, bosses, summons and deferred cases retain fallbacks',presentation.fallback && presentation.protectedCases);

const sheet = await page.evaluate(kinds => {
  const c = document.createElement('canvas'); c.width = 1152; c.height = 760; const ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0,0,c.width,c.height); ctx.fillStyle = '#ecd49e'; ctx.font = '18px monospace'; ctx.fillText('TREE / slate fins, serrated fish, glass-blue bell and curled squid arms',20,30);
  kinds.forEach((kind,i) => [1,3].forEach((frame,row) => {
    const x = i * 288, y = 50 + row * 350;
    ctx.drawImage(CombatArt.enemySprite(kind,frame,false,false),x,y,288,288);
    ctx.fillStyle = '#d9d5c4'; ctx.font = '15px monospace'; ctx.fillText(kind,x + 12,y + 306);
    ctx.fillStyle = '#9cabc6'; ctx.fillText('frame ' + frame,x + 12,y + 328);
  })); return c.toDataURL('image/png');
},kinds);
writeFileSync(dir + '/aquatic-artwork.png',Buffer.from(sheet.split(',')[1],'base64'));
for (const wet of [true,false]) {
  await page.evaluate(({ kinds,wet }) => {
    __aquaScene(wet); const o = __aquaOrigin, p = game.player;
    kinds.forEach((kind,i) => {
      const e = __aquaEnemy(kind); e.x += [-280,-90,110,300][i]; e.y += i % 2 ? -50 : 30;
      p.x = e.x + (i % 2 ? -150 : 150); p.y = e.y - 50;
      for (let tick = 0; tick < 20; tick++) enemyStep(e,game);
    });
    p.x = o.x; p.y = o.gy * TILE - p.h / 2 - 0.01; game.cam.x = o.x; game.cam.y = p.y - 100; p.invuln = 0;
    updateHud(); updateCrosshair(); window.__aquaHook = CombatArt.drawEnemy; CombatArt.drawEnemy = () => false; render();
  },{ kinds,wet });
  const name = wet ? 'wet' : 'dry'; await page.screenshot({ path:dir + `/${name}-before.png` });
  await page.evaluate(() => { CombatArt.drawEnemy = __aquaHook; delete window.__aquaHook; render(); });
  await page.screenshot({ path:dir + `/${name}-after.png` });
}
writeFileSync(dir + '/index.html',`<!doctype html><meta charset="utf-8"><title>Aquatic creature artwork</title>
<style>body{background:#202534;color:#dedbc9;font:16px monospace;max-width:1280px;margin:24px auto;padding:0 16px}img{width:100%;image-rendering:pixelated}.row{display:flex;gap:16px}figure{margin:8px 0;flex:1}a{color:#ecd49e}</style>
<h1>Shark, Piranha, Blue Jellyfish and Squid</h1><p>Original pixel artwork; existing water-dependent swimming, Squid flight, contact rules and loot remain unchanged.</p><img src="aquatic-artwork.png" alt="Four aquatic creature source sprites">
${['wet','dry'].map(state => `<h2>${state}</h2><p>20 real enemy AI steps in an explicit ${state === 'wet' ? 'water-filled' : 'drained'} review room. Room/water/torches, non-native biome placement, temporary targets and nonlethal HP are disposable fixtures. Liquid simulation is paused, not altered.</p><div class="row"><figure><img src="${state}-before.png" alt="Legacy ${state} aquatic creatures"><figcaption>Before — only the general-enemy hook disabled</figcaption></figure><figure><img src="${state}-after.png" alt="Pixel-art ${state} aquatic creatures"><figcaption>After — same combat state</figcaption></figure></div>`).join('')}
<p><a href="../flyers/index.html">Flyer gallery</a> · <a href="../sky-sand/index.html">Sky/sand gallery</a></p>`);
await assertNoBrowserErrors(results);
await finish(results,browser,'aquatic-graphics',{ sources,ai,presentation });
