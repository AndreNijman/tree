// Single-body flyer artwork: retain each creature's actual flight/contact/drop rules.
import { mkdirSync, writeFileSync } from 'node:fs';
import { setupAudit, check, assertNoBrowserErrors, finish } from './audit2/lib.mjs';

const { browser, page, results } = await setupAudit();
const kinds = ['harpy','wraith','meteorhead','devourer'];
const dir = 'test-results/graphics/flyers';
mkdirSync(dir,{ recursive:true });
await page.evaluate(kinds => {
  game.paused = true; game.weather.active = false; game.event = null;
  const w = game.world, tx = Math.floor(w.spawnX / TILE), gy = Math.min(w.H - 10,w.hellY + 12);
  for (let x = tx - 43; x <= tx + 43; x++) {
    for (let y = gy - 35; y < gy; y++) { w.set(x,y,T.AIR); w.setWall(x,y,WALL.CAVE); }
    w.set(x,gy,T.ASH); if ((x - tx) % 6 === 0) { w.set(x,gy - 4,T.TORCH); w.set(x,gy - 14,T.TORCH); }
  }
  window.__flyTypes = Object.fromEntries(kinds.map((k,i) => [k,[E.HARPY,E.WRATH,E.METEORHEAD,E.DEVOURER][i]]));
  window.__flyOrigin = { tx,gy,x:tx * TILE + 8,y:gy * TILE - 150 };
  window.__flyScene = function(hardmode = true) {
    game.entities = []; game.bossBars = []; game.projectiles.list = []; game.fx = []; game.fxTexts = []; game.pickups = [];
    game.event = null; game.flashT = game.shakeT = 0; game.hardmode = hardmode;
    const p = game.player; p.x = __flyOrigin.x - 120; p.y = gy * TILE - p.h / 2 - 0.01;
    p.vx = p.vy = 0; p.onGround = true; p.invuln = 999; p.hp = p.maxHp = 100; p.dying = false; p.respawnT = 0;
    game.cam.x = __flyOrigin.x; game.cam.y = p.y - 90; game.timeOfDay = 0.5;
    document.getElementById('screenflash').style.display = 'none'; document.getElementById('deathscreen').classList.add('hidden');
    document.getElementById('message').style.display = 'none'; document.getElementById('interact').style.display = 'none';
  };
  window.__flyEnemy = function(kind) { return spawnEntity(game,__flyTypes[kind],__flyOrigin.x,__flyOrigin.y); };
  window.__flyTerrain = function() {
    function hash(a) { let h = 2166136261; for (let i = 0; i < a.length; i++) h = Math.imul(h ^ a[i],16777619); return h >>> 0; }
    return [w.tiles,w.walls,w.hp,w.surfaceY].map(hash);
  };
  window.__flyState = function() {
    return JSON.stringify({ player:game.player,entities:game.entities,projectiles:game.projectiles.list,bars:game.bossBars,progress:game.bossesDefeated,
      event:game.event,hardmode:game.hardmode,eventCompletions:game.eventCompletions,fx:game.fx,texts:game.fxTexts,pickups:game.pickups,
      flash:game.flashT,terrain:__flyTerrain() });
  };
  window.__flyRender = function(e) {
    const before = __flyState(), hook = CombatArt.drawEnemy; let calls = 0;
    CombatArt.drawEnemy = (...args) => { if (args[2] === e) calls++; return hook(...args); };
    game.cam.x = e.x; game.cam.y = e.y - 50;
    try { for (let f = 0; f < 4; f++) renderGame(game,ctx2d); } finally { CombatArt.drawEnemy = hook; }
    return { calls,unchanged:before === __flyState() };
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
  const devourer = bytes('devourer',0,false,false), eater = bytes('eaterofsouls',0,false,false);
  const distinct = devourer.some((v,i) => i % 4 === 3 && v !== eater[i]);
  const original = kinds.map(k => Array.from(bytes(k,0,false,false)));
  for (const boss of ['kingslime','eyeofcthulhu','brainofcthulhu','queenbee','skeletron','wallofflesh','retinazer','spazmatism','destroyer','skelprime','queenslime','plantera','golem','duke','empress','moonlord','cultist']) {
    for (const phase of [false,true]) for (let f = 0; f < 4; f++) for (const flash of [false,true]) CombatArt.bossSprite(boss,phase,f,flash);
  }
  return { total,inked,crisp,margins,masks,animated,silhouettes:silhouettes.size,distinct,
    stable:kinds.every((k,i) => bytes(k,0,false,false).every((v,n) => v === original[i][n])) };
},kinds);
check(results,'All 64 flyer source variants are nonempty, binary-alpha and unclipped',sources.total === 64 && sources.inked === 64 && sources.crisp && sources.margins,sources);
check(results,'Four silhouettes are distinct; Devourer is not a recolored Eater of Souls',sources.silhouettes === 4 && sources.distinct);
check(results,'Every flyer animates and flash masks preserve exact alpha',sources.masks && sources.animated.every(s => s.frames >= 2),sources.animated);
check(results,'Flyer sprites regenerate deterministically after shared-cache eviction',sources.stable);

const ai = await page.evaluate(kinds => {
  const flights = [], walls = [], contacts = [], kills = [], targets = [];
  const near = (a,b) => Math.abs(a - b) < 0.000001;
  for (const kind of kinds) for (const hardmode of [false,true]) for (const side of [-1,1]) for (const vertical of [-80,0,80]) {
    __flyScene(hardmode); const e = __flyEnemy(kind), x = e.x, y = e.y, bob = e.bob;
    game.player.x = e.x + side * 200; game.player.y = e.y + vertical;
    const d = Math.hypot(side * 200,vertical); e.attackCd = 0; enemyStep(e,game);
    flights.push({ kind,hardmode,side,vertical,...__flyRender(e),
      body:e.w === ENT_DEF[e.type].w && e.h === ENT_DEF[e.type].h && !e.segments && !e.arms && !!e.ghost === (kind === 'wraith'),
      movement:near(e.x - x,side * 200 / d * e.speed) && near(e.y - y,vertical / d * e.speed + (kind === 'wraith' ? 0 : Math.sin(bob + 0.06) * 0.8)),
      bob:near(e.bob,bob + (kind === 'wraith' ? 0 : 0.06)),noShots:game.projectiles.list.length === 0 });
  }
  for (const kind of kinds) for (const side of [-1,1]) {
    __flyScene(); const e = __flyEnemy(kind), w = game.world, wx = __flyOrigin.tx + side * 2, wy = Math.floor(e.y / TILE), original = [];
    for (let y = wy - 1; y <= wy + 1; y++) { original.push([y,w.get(wx,y)]); w.set(wx,y,T.HELLBRICK); }
    e.x = side > 0 ? wx * TILE - e.w / 2 - 0.05 : (wx + 1) * TILE + e.w / 2 + 0.05;
    const x = e.x, terrain = JSON.stringify(__flyTerrain()); game.player.x = e.x + side * 180; game.player.y = e.y;
    enemyStep(e,game);
    const collision = kind === 'wraith' ? near((e.x - x) * side,e.speed) && e.vx !== 0 : e.vx === 0 && (side > 0 ? e.x + e.w / 2 <= wx * TILE : e.x - e.w / 2 >= (wx + 1) * TILE);
    walls.push({ kind,side,collision,terrain:terrain === JSON.stringify(__flyTerrain()),...__flyRender(e) });
    original.forEach(([y,t]) => w.set(wx,y,t));
    __flyScene(); const remoteEnemy = __flyEnemy(kind), start = remoteEnemy.x, target = multiplayerTarget;
    game.player.x = remoteEnemy.x - side * 200;
    try { multiplayerTarget = () => ({ x:start + side * 200,y:remoteEnemy.y }); enemyStep(remoteEnemy,game); }
    finally { multiplayerTarget = target; }
    targets.push({ kind,side,correct:(remoteEnemy.x - start) * side > 0,...__flyRender(remoteEnemy) });
  }
  for (const kind of kinds) {
    __flyScene(); let e = __flyEnemy(kind); game.player.x = e.x + 3; game.player.y = e.y;
    game.player.hp = game.player.maxHp = 500; game.player.invuln = 0; enemyStep(e,game);
    contacts.push({ kind,correct:kind === 'wraith' ? game.player.hp === 500 && game.player.invuln === 0 && e.dmgCd === 0 : game.player.hp < 500 && game.player.invuln > 0 && e.dmgCd === 0.8,...__flyRender(e) });
    for (const hardmode of [false,true]) for (const roll of [0.001,0.1,0.15,0.499,0.5,0.9]) {
      __flyScene(hardmode); e = __flyEnemy(kind); const terrain = JSON.stringify(__flyTerrain());
      hitEntity(e,1,0,0,game); const flash = e.flash > 0, flashed = __flyRender(e), random = Math.random;
      try { Math.random = () => roll; hitEntity(e,e.hp + e.def + 20,0,0,game); } finally { Math.random = random; }
      const materials = game.pickups.reduce((d,p) => { if (!['coin','silvercoin','goldcoin','platinumcoin'].includes(p.item) && p.count > 0) d[p.item] = (d[p.item] || 0) + p.count; return d; },{});
      let expected = {};
      if (kind === 'harpy') { expected[I.FEATHER] = roll < 0.5 ? 1 : 2; if (roll < 0.15) expected[I.GEM_SAPPHIRE] = 1; }
      if (kind === 'wraith') expected[I.SOUL_NIGHT] = 1;
      if (kind === 'devourer') { if (roll < 0.5) expected[I.GLOWSTONE] = 1; expected[I.EBONSTONE] = 1; }
      for (const drop of B83_ENEMY_DROPS[e.name] || []) if (roll < drop.rate) expected[drop.id] = (expected[drop.id] || 0) + 1;
      const before = __flyState(); renderGame(game,ctx2d);
      const c = document.createElement('canvas'); c.width = c.height = 160; drawEnemy(c.getContext('2d'),e,{ x:e.x,y:e.y },160,160);
      kills.push({ kind,hardmode,roll,materials,expected,correct:JSON.stringify(materials) === JSON.stringify(expected),flash,flashed,dead:e.dead,
        hidden:!c.getContext('2d').getImageData(0,0,160,160).data.some((v,i) => i % 4 === 3 && v),unchanged:before === __flyState(),
        terrain:terrain === JSON.stringify(__flyTerrain()),noChildren:game.entities.length === 1,noShots:game.projectiles.list.length === 0 });
    }
  }
  return { flights,walls,contacts,kills,targets };
},kinds);
for (const kind of kinds) check(results,`${kind}: real horizontal/vertical flight, body and bob rules, no invented shots`,ai.flights.filter(s => s.kind === kind).every(s => s.calls === 4 && s.unchanged && s.body && s.movement && s.bob && s.noShots),ai.flights.filter(s => s.kind === kind));
check(results,'Wraith passes through walls; the three colliding flyers stay blocked without mining',ai.walls.every(s => s.collision && s.terrain && s.calls === 4 && s.unchanged),ai.walls);
check(results,'Existing contact rules remain intact, including Wraith ghost contact exclusion',ai.contacts.every(s => s.correct && s.calls === 4 && s.unchanged),ai.contacts);
check(results,'Real seeded kills preserve exact material/rare tables, no children/shots and hidden corpses',ai.kills.every(s => s.correct && s.flash && s.flashed.calls === 4 && s.flashed.unchanged && s.dead && s.hidden && s.unchanged && s.terrain && s.noChildren && s.noShots),ai.kills.filter(s => !s.correct));
check(results,'Actual AI follows its multiplayer-aware target while artwork remains read-only',ai.targets.every(s => s.correct && s.calls === 4 && s.unchanged),ai.targets);

const presentation = await page.evaluate(kinds => {
  __flyScene(); const c = document.createElement('canvas'); c.width = c.height = 320; const ctx = c.getContext('2d');
  const facing = [], frames = [];
  for (const kind of kinds) {
    const e = __flyEnemy(kind);
    function pixels() { ctx.clearRect(0,0,320,320); CombatArt.drawEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320); return ctx.getImageData(0,0,320,320).data; }
    e.dir = -1; e.vx = 2; game.player.x = e.x - 200;
    const right = pixels(); e.dir = 1; e.vx = -2; game.player.x = e.x + 200;
    const left = pixels(); let mirror = true, distinct = false;
    for (let y = 0; y < 320; y++) for (let x = 0; x < 320; x++) for (let ch = 0; ch < 4; ch++) {
      const i = (y * 320 + x) * 4 + ch, r = (y * 320 + 319 - x) * 4 + ch;
      if (left[i] !== right[r]) mirror = false; if (left[i] !== right[i]) distinct = true;
    }
    facing.push({ kind,mirror:mirror && distinct });
    for (const cd of [0,999]) for (const flash of [false,true]) {
      e.vx = 2; e.attackCd = cd; e.flash = flash ? 0.1 : 0;
      const drawn = pixels(), expected = document.createElement('canvas'); expected.width = expected.height = 320;
      expected.getContext('2d').drawImage(CombatArt.enemySprite(kind,Math.floor(Time.seconds * 10) % 4,false,flash),112,112);
      const bytes = expected.getContext('2d').getImageData(0,0,320,320).data;
      frames.push({ kind,cd,flash,exact:drawn.every((v,i) => v === bytes[i]) });
    }
  }
  const ghost = game.entities.find(e => e.type === E.WRATH); ghost.flash = 0; ghost.vx = 2;
  ctx.clearRect(0,0,320,320); drawEnemy(ctx,ghost,{ x:ghost.x,y:ghost.y },320,320);
  const drawnGhost = ctx.getImageData(0,0,320,320).data, expected = document.createElement('canvas'); expected.width = expected.height = 320;
  const ex = expected.getContext('2d'); ex.globalAlpha = 0.6; ex.drawImage(CombatArt.enemySprite('wraith',Math.floor(Time.seconds * 10) % 4,false,false),112,112);
  const expectedGhost = ex.getImageData(0,0,320,320).data, opacity = drawnGhost.every((v,i) => v === expectedGhost[i]) && ctx.globalAlpha === 1;
  ctx.translate(4,6); ctx.scale(0.7,0.8); ctx.globalAlpha = 0.6; ctx.fillStyle = '#123456'; ctx.strokeStyle = '#654321'; ctx.font = '17px serif'; ctx.textAlign = 'right'; ctx.imageSmoothingEnabled = true;
  function state() { const m = ctx.getTransform(); return JSON.stringify([m.a,m.b,m.c,m.d,m.e,m.f,ctx.globalAlpha,ctx.fillStyle,ctx.strokeStyle,ctx.lineWidth,ctx.font,ctx.textAlign,ctx.imageSmoothingEnabled,ctx.globalCompositeOperation]); }
  const before = state(), gameplay = __flyState(), random = Math.random; let rng = 0;
  try { Math.random = () => { rng++; return 0.5; }; game.entities.forEach(e => CombatArt.drawEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320)); } finally { Math.random = random; }
  const restored = before === state(), unchanged = gameplay === __flyState();
  const fallback = [E.GHOST,E.FLOATYGROSS,E.ICEGOLEM,E.PIGRON,-999].every(type => !CombatArt.drawEnemy(ctx,game,{ type },{ x:0,y:0 },320,320));
  const protectedCases = [{ boss:'future' },{ minion:'harpy' },{ ooaEnemy:true },{ ooaSentry:true }].every(flags => !CombatArt.drawEnemy(ctx,game,Object.assign({ type:E.HARPY },flags),{ x:0,y:0 },320,320));
  return { facing,frames,opacity,restored,unchanged,rng,fallback,protectedCases };
},kinds);
check(results,'All four flyers face velocity despite contrary player/dir values',presentation.facing.every(s => s.mirror),presentation.facing);
check(results,'Exact frame/flash artwork ignores invented firing cooldowns',presentation.frames.every(s => s.exact),presentation.frames);
check(results,'Integrated Wraith draws once at retained 0.6 ghost opacity and restores alpha',presentation.opacity);
check(results,'Flyer drawings restore context, consume no RNG and preserve gameplay',presentation.restored && presentation.unchanged && presentation.rng === 0);
check(results,'Unconverted, deferred, boss, summon and Etherian cases retain fallbacks',presentation.fallback && presentation.protectedCases);

const sheet = await page.evaluate(kinds => {
  const c = document.createElement('canvas'); c.width = 1152; c.height = 760; const ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0,0,c.width,c.height); ctx.fillStyle = '#ecd49e'; ctx.font = '18px monospace'; ctx.fillText('TREE / feather fans, tattered shroud, molten rock and split-maw flyer',20,30);
  kinds.forEach((kind,i) => [1,3].forEach((frame,row) => {
    const x = i * 288, y = 50 + row * 350;
    ctx.drawImage(CombatArt.enemySprite(kind,frame,false,false),x,y,288,288);
    ctx.fillStyle = '#d9d5c4'; ctx.font = '15px monospace'; ctx.fillText(kind,x + 12,y + 306);
    ctx.fillStyle = '#9cabc6'; ctx.fillText('frame ' + frame + (kind === 'wraith' ? ' / opaque source' : ''),x + 12,y + 328);
  })); return c.toDataURL('image/png');
},kinds);
writeFileSync(dir + '/flyer-artwork.png',Buffer.from(sheet.split(',')[1],'base64'));
for (const active of [false,true]) {
  await page.evaluate(({ kinds,active }) => {
    __flyScene(); const o = __flyOrigin, p = game.player;
    kinds.forEach((kind,i) => {
      const e = __flyEnemy(kind); e.x += [-280,-90,110,300][i]; e.y += i % 2 ? -50 : 30;
      p.x = e.x + (i % 2 ? -150 : 150); p.y = e.y - 50;
      for (let tick = 0; tick < (active ? 20 : 1); tick++) enemyStep(e,game);
    });
    p.x = o.x; p.y = o.gy * TILE - p.h / 2 - 0.01; game.cam.x = o.x; game.cam.y = p.y - 100; p.invuln = 0;
    updateHud(); updateCrosshair(); window.__flyHook = CombatArt.drawEnemy; CombatArt.drawEnemy = () => false; render();
  },{ kinds,active });
  const name = active ? 'flight' : 'normal'; await page.screenshot({ path:dir + `/${name}-before.png` });
  await page.evaluate(() => { CombatArt.drawEnemy = __flyHook; delete window.__flyHook; render(); });
  await page.screenshot({ path:dir + `/${name}-after.png` });
}
writeFileSync(dir + '/index.html',`<!doctype html><meta charset="utf-8"><title>Single-body flyer artwork</title>
<style>body{background:#202534;color:#dedbc9;font:16px monospace;max-width:1280px;margin:24px auto;padding:0 16px}img{width:100%;image-rendering:pixelated}.row{display:flex;gap:16px}figure{margin:8px 0;flex:1}a{color:#ecd49e}</style>
<h1>Harpy, Wraith, Meteor Head and Devourer</h1><p>Original pixel art; real single-body AI, collision, contact rules and loot remain unchanged. No feather shots, new Wraith contact attacks or fabricated Devourer body records.</p><img src="flyer-artwork.png" alt="Four single-body flyer source sprites">
${['normal','flight'].map(state => `<h2>${state}</h2><p>Real spawns and ${state === 'flight' ? '20' : 'one'} AI ticks in a dry torch-lit review room. Non-native biome placement, temporary targets, room/torches and nonlethal HP are disposable fixtures. Wraith's 0.6 ghost opacity is applied by the normal renderer.</p><div class="row"><figure><img src="${state}-before.png" alt="Legacy ${state} flyers"><figcaption>Before — only the general-enemy hook disabled</figcaption></figure><figure><img src="${state}-after.png" alt="Pixel-art ${state} flyers"><figcaption>After — same combat state</figcaption></figure></div>`).join('')}
<p><a href="../sky-sand/index.html">Sky/sand gallery</a> · <a href="../segmented/index.html">Segmented gallery</a></p>`);
await assertNoBrowserErrors(results);
await finish(results,browser,'flyer-graphics',{ sources,ai,presentation });
