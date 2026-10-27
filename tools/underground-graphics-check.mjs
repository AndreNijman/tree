// Underground combat artwork and real AI/drop behavior in a disposable room.
import { mkdirSync, writeFileSync } from 'node:fs';
import { setupAudit, check, assertNoBrowserErrors, finish } from './audit2/lib.mjs';

const { browser, page, results } = await setupAudit();
const kinds = ['skeletonarcher','armoredbones','undeadminer','giantbat'];
const dir = 'test-results/graphics/underground';
mkdirSync(dir,{ recursive:true });
await page.evaluate(kinds => {
  game.paused = true; game.weather.active = false; game.event = null;
  const w = game.world, tx = Math.floor(w.spawnX / TILE), gy = Math.min(w.H - 100,w.surfaceY[tx] + 64);
  // A real-depth underground room with ordinary torches, not fullbright/worldgen edits.
  for (let x = tx - 43; x <= tx + 43; x++) {
    for (let y = gy - 35; y < gy; y++) { w.set(x,y,T.AIR); w.setWall(x,y,WALL.CAVE); }
    w.set(x,gy,T.STONE);
    if ((x - tx) % 6 === 0) w.set(x,gy - 6,T.TORCH);
  }
  window.__underTypes = Object.fromEntries(kinds.map((k,i) => [k,[E.SKELETONARCHER,E.ARMOREDBONES,E.UNDEADMINER,E.GIANTBAT][i]]));
  window.__underOrigin = { tx,gy,x:tx * TILE + 8 };
  window.__underScene = function(hardmode = true) {
    game.entities = []; game.bossBars = []; game.projectiles.list = []; game.fx = []; game.fxTexts = []; game.pickups = [];
    game.event = null; game.flashT = game.shakeT = 0; game.hardmode = hardmode;
    const p = game.player; p.x = __underOrigin.x - 120; p.y = gy * TILE - p.h / 2 - 0.01;
    p.vx = p.vy = 0; p.onGround = true; p.invuln = 999; p.hp = p.maxHp = 100; p.dying = false; p.respawnT = 0;
    game.cam.x = __underOrigin.x; game.cam.y = p.y - 90; game.timeOfDay = 0.5;
    document.getElementById('screenflash').style.display = 'none'; document.getElementById('deathscreen').classList.add('hidden');
    document.getElementById('message').style.display = 'none'; document.getElementById('interact').style.display = 'none';
  };
  window.__underEnemy = function(kind) {
    const type = __underTypes[kind], e = spawnEntity(game,type,__underOrigin.x,gy * TILE - (kind === 'giantbat' ? 100 : ENT_DEF[type].h / 2 + 0.01));
    e.onGround = kind !== 'giantbat'; return e;
  };
  window.__underState = function() {
    function hash(a) { let h = 2166136261; for (let i = 0; i < a.length; i++) h = Math.imul(h ^ a[i],16777619); return h >>> 0; }
    return JSON.stringify({ player:game.player,entities:game.entities,projectiles:game.projectiles.list,progress:game.bossesDefeated,
      event:game.event,hardmode:game.hardmode,eventCompletions:game.eventCompletions,fx:game.fx,texts:game.fxTexts,pickups:game.pickups,
      flash:game.flashT,tiles:hash(w.tiles),walls:hash(w.walls),hp:hash(w.hp),surface:hash(w.surfaceY) });
  };
  window.__underRender = function(e) {
    const before = __underState(), hook = CombatArt.drawEnemy; let calls = 0;
    CombatArt.drawEnemy = (...args) => { if (args[2] === e) calls++; return hook(...args); };
    game.cam.x = e.x; game.cam.y = e.y - 50;
    try { for (let f = 0; f < 4; f++) renderGame(game,ctx2d); } finally { CombatArt.drawEnemy = hook; }
    return { calls,unchanged:before === __underState() };
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
  const bat = bytes('giantbat',0,false,false);
  const batDistinct = ['junglebat','icebat'].every(kind => {
    const other = bytes(kind,0,false,false); return bat.some((v,i) => i % 4 === 3 && v !== other[i]);
  });
  const original = kinds.map(k => Array.from(bytes(k,0,false,false)));
  for (const boss of ['kingslime','eyeofcthulhu','brainofcthulhu','queenbee','skeletron','wallofflesh','retinazer','spazmatism','destroyer','skelprime','queenslime','plantera','golem','duke','empress','moonlord','cultist']) {
    for (const phase of [false,true]) for (let f = 0; f < 4; f++) for (const flash of [false,true]) CombatArt.bossSprite(boss,phase,f,flash);
  }
  const stable = kinds.every((k,i) => bytes(k,0,false,false).every((v,n) => v === original[i][n]));
  const activity = ['skeletonarcher','armoredbones','undeadminer'].map(kind => { const a = bytes(kind,1,false,false), b = bytes(kind,1,true,false); return { kind,distinct:a.some((v,i) => v !== b[i]) }; });
  return { total,inked,crisp,margins,masks,animated,silhouettes:silhouettes.size,batDistinct,stable,activity };
},kinds);
check(results,'All 64 underground source variants are nonempty, binary-alpha and unclipped',sources.total === 64 && sources.inked === 64 && sources.crisp && sources.margins,sources);
check(results,'All four silhouettes differ; Giant Bat is not a recolored Jungle/Ice Bat',sources.silhouettes === 4 && sources.batDistinct);
check(results,'Underground limbs/wings visibly animate and hit flashes preserve exact alpha',sources.masks && sources.animated.every(s => s.frames >= 2),sources.animated);
check(results,'Archer recoil and real Bones/Miner jumps have distinct activity artwork',sources.activity.every(s => s.distinct),sources.activity);
check(results,'Underground artwork regenerates deterministically after shared-cache eviction',sources.stable);

const ai = await page.evaluate(kinds => {
  const flying = [], walkers = [], archers = [], walls = [], contacts = [], kills = [], spirits = [];
  function simulate(e,roll = 0.5) { const random = Math.random; try { Math.random = () => roll; enemyStep(e,game); } finally { Math.random = random; } }
  const body = e => e.w === ENT_DEF[e.type].w && e.h === ENT_DEF[e.type].h && !e.segments && !e.arms;
  for (const hardmode of [false,true]) for (const side of [-1,1]) {
    __underScene(hardmode); const e = __underEnemy('giantbat'), x = e.x, y = e.y, bob = e.bob;
    game.player.x = e.x + side * 200; game.player.y = e.y; simulate(e);
    flying.push({ hardmode,side,...__underRender(e),motion:Math.abs(e.x - x - side * e.speed) < 0.000001 && Math.abs(e.y - y - Math.sin(bob + 0.06) * 0.8) < 0.000001,body:body(e),shots:game.projectiles.list.length });
  }
  for (const kind of ['armoredbones','undeadminer']) for (const side of [-1,1]) for (const distance of [40,64,80]) for (const roll of [0,0.5]) {
    __underScene(); const e = __underEnemy(kind), x = e.x, y = e.y;
    game.player.x = e.x + side * distance; game.player.y = e.y; simulate(e,roll);
    const jumping = distance < 4 * TILE && roll < 0.02;
    walkers.push({ kind,side,distance,roll,...__underRender(e),movement:e.dir === side && Math.abs(e.vx - side * e.speed * 0.1) < 0.000001 && Math.abs(e.x - x - e.vx) < 0.000001,
      jump:jumping ? !e.onGround && Math.abs(e.vy - (-7 + GRAVITY)) < 0.000001 && e.y < y : e.onGround && e.vy === 0 && e.y === y,body:body(e),shots:game.projectiles.list.length });
  }
  for (const side of [-1,1]) for (const distance of [200,419,420,421]) for (const vertical of [0,159,160,161]) {
    __underScene(); const e = __underEnemy('skeletonarcher'), x = e.x, y = e.y;
    game.player.x = e.x + side * distance; game.player.y = e.y - vertical;
    simulate(e); const shots = game.projectiles.list.slice(), angle = Math.atan2(game.player.y - y,game.player.x - x);
    const shouldFire = distance < 420 && vertical < 160, rendered = __underRender(e), count = shots.length;
    const correct = shots.every(p => p.type === P.ARROW && p.dmg === 22 && p.owner === 'enemy' && p.life === 3 && p.gravity === 0.15 &&
      p.x === x && p.y === y - 8 && Math.abs(p.vx - Math.cos(angle) * 6) < 0.000001 && Math.abs(p.vy - Math.sin(angle) * 6) < 0.000001);
    const movement = e.dir === side && Math.abs(e.vx - side * e.speed * 0.1) < 0.000001 && Math.abs(e.x - x - e.vx) < 0.000001;
    if (shouldFire) simulate(e);
    archers.push({ side,distance,vertical,...rendered,shouldFire,shots:count,correct,movement,noExtra:game.projectiles.list.length === count,
      cooldown:shouldFire ? Math.abs(e.attackCd - (2.2 - 1 / 60)) < 0.000001 : e.attackCd < 0,body:body(e) });
  }
  for (const kind of kinds) for (const side of [-1,1]) {
    __underScene(); const e = __underEnemy(kind), w = game.world, wx = __underOrigin.tx + side * 2, wy = Math.floor(e.y / TILE), original = [];
    for (let y = wy - 1; y <= wy + 1; y++) { original.push([y,w.get(wx,y)]); w.set(wx,y,T.STONE); }
    e.x = side > 0 ? wx * TILE - e.w / 2 - 0.05 : (wx + 1) * TILE + e.w / 2 + 0.05;
    e.attackCd = 10; game.player.x = e.x + side * 180; game.player.y = e.y; simulate(e);
    walls.push({ kind,side,blocked:e.vx === 0 && (side > 0 ? e.x + e.w / 2 <= wx * TILE : e.x - e.w / 2 >= (wx + 1) * TILE),...__underRender(e) });
    original.forEach(([y,t]) => w.set(wx,y,t));
  }
  for (const kind of kinds) {
    __underScene(); let e = __underEnemy(kind); e.attackCd = 10;
    game.player.x = e.x + 3; game.player.y = e.y; game.player.hp = game.player.maxHp = 500; game.player.invuln = 0;
    const hp = game.player.hp; simulate(e);
    contacts.push({ kind,damaged:game.player.hp < hp,invuln:game.player.invuln > 0,cooldown:e.dmgCd === 0.8,...__underRender(e) });
    for (const hardmode of [false,true]) for (const roll of [0,0.1,0.9]) {
      __underScene(hardmode); e = __underEnemy(kind); hitEntity(e,1,0,0,game);
      const flash = e.flash > 0, flashed = __underRender(e), random = Math.random;
      try { Math.random = () => roll; hitEntity(e,e.hp + e.def + 20,0,0,game); } finally { Math.random = random; }
      const drops = Object.fromEntries(game.pickups.map(p => [p.item,p.count])), before = __underState(); renderGame(game,ctx2d);
      const c = document.createElement('canvas'); c.width = c.height = 160; drawEnemy(c.getContext('2d'),e,{ x:e.x,y:e.y },160,160);
      const hidden = !c.getContext('2d').getImageData(0,0,160,160).data.some((v,i) => i % 4 === 3 && v);
      const rare = kind !== 'undeadminer' || (B83_ENEMY_DROPS['Undead Miner'] || []).every(d => (drops[d.id] || 0) === (roll < d.rate ? 1 : 0));
      kills.push({ kind,hardmode,roll,flash,flashed,dead:e.dead,hidden,drops,rare,unchanged:before === __underState() });
    }
  }
  const previous = game.bossesDefeated.plantera;
  try {
    for (const plantera of [false,true]) for (const roll of [0,0.9]) {
      __underScene(); game.bossesDefeated.plantera = plantera; const e = __underEnemy('armoredbones'), random = Math.random;
      try { Math.random = () => roll; hitEntity(e,e.hp + e.def + 20,0,0,game); } finally { Math.random = random; }
      const adds = game.entities.filter(a => a.type === E.DUNGEONSPIRIT), before = __underState(); renderGame(game,ctx2d);
      spirits.push({ plantera,roll,count:adds.length,origin:adds.every(a => a.x === e.x && a.y === e.y - 8),dead:e.dead,unchanged:before === __underState() });
    }
  } finally { if (previous === undefined) delete game.bossesDefeated.plantera; else game.bossesDefeated.plantera = previous; }
  return { flying,walkers,archers,walls,contacts,kills,spirits };
},kinds);
check(results,'Giant Bat retains real bidirectional flight/bobbing and single body before/after Hardmode',ai.flying.every(s => s.calls === 4 && s.unchanged && s.motion && s.body && s.shots === 0),ai.flying);
for (const kind of ['armoredbones','undeadminer']) check(results,`${kind}: real walking and probabilistic four-tile jump remain unchanged without gaining attacks`,ai.walkers.filter(s => s.kind === kind).every(s => s.calls === 4 && s.unchanged && s.movement && s.jump && s.body && s.shots === 0),ai.walkers.filter(s => s.kind === kind));
check(results,'Skeleton Archer retains exact 420/160 limits, pre-movement shot origin, 22-damage arrows and 2.2 cooldown',ai.archers.every(s => s.calls === 4 && s.unchanged && s.shots === (s.shouldFire ? 1 : 0) && s.correct && s.movement && s.cooldown && s.noExtra && s.body),ai.archers);
check(results,'All four underground creatures retain left/right solid-wall collision',ai.walls.every(s => s.blocked && s.calls === 4 && s.unchanged),ai.walls);
check(results,'All four contact attacks preserve real damage, invulnerability and contact cooldown',ai.contacts.every(s => s.damaged && s.invuln && s.cooldown && s.calls === 4 && s.unchanged),ai.contacts);
check(results,'Real flashes, hidden kills, iron/bone/feather/gun-part branches and Miner rare tables remain intact',ai.kills.every(s => {
  const d = s.drops;
  const base = s.kind === 'skeletonarcher' ? d.iron === 1 && (d.bone || 0) === (s.roll < 0.5 ? 1 : 0) && (d.illegalgunparts || 0) === (s.roll < 0.08 ? 1 : 0) :
    s.kind === 'armoredbones' ? d.iron === 2 && d.bone === 1 : s.kind === 'undeadminer' ? d.iron === 2 : (d.feather || 0) === (s.roll < 0.5 ? 1 : 0);
  return base && s.rare && s.flash && s.flashed.calls === 4 && s.flashed.unchanged && s.dead && s.hidden && s.unchanged;
}),ai.kills);
check(results,'Armored Bones preserves real post-Plantera Dungeon Spirit/no-spirit death branches and spawn origin',ai.spirits.every(s => s.dead && s.origin && s.unchanged && s.count === (s.plantera && s.roll < 0.33 ? 1 : 0)),ai.spirits);

const presentation = await page.evaluate(kinds => {
  __underScene(); const c = document.createElement('canvas'); c.width = c.height = 320; const ctx = c.getContext('2d');
  const facing = [], activity = [];
  for (const kind of kinds) {
    const e = __underEnemy(kind), flyer = kind === 'giantbat';
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
      e.dir = 1; e.vx = flyer ? 2 : -2; e.onGround = !active; e.vy = active ? -6 : 0; e.attackCd = active ? 2.2 : 1;
      const drawn = pixels(), expected = document.createElement('canvas'); expected.width = expected.height = 320;
      expected.getContext('2d').drawImage(CombatArt.enemySprite(kind,Math.floor(Time.seconds * 10) % 4,active && !flyer,false),112,112);
      const bytes = expected.getContext('2d').getImageData(0,0,320,320).data;
      activity.push({ kind,active,exact:drawn.every((v,i) => v === bytes[i]) });
    }
  }
  ctx.translate(4,6); ctx.scale(0.7,0.8); ctx.globalAlpha = 0.6; ctx.fillStyle = '#123456'; ctx.strokeStyle = '#654321'; ctx.font = '17px serif'; ctx.textAlign = 'right'; ctx.imageSmoothingEnabled = true;
  function state() { const m = ctx.getTransform(); return JSON.stringify([m.a,m.b,m.c,m.d,m.e,m.f,ctx.globalAlpha,ctx.fillStyle,ctx.strokeStyle,ctx.lineWidth,ctx.font,ctx.textAlign,ctx.imageSmoothingEnabled,ctx.globalCompositeOperation]); }
  const before = state(), gameplay = __underState();
  game.entities.forEach(e => CombatArt.drawEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320));
  const restored = before === state(), unchanged = gameplay === __underState();
  // Angry Bones now has dungeon-batch artwork; the remaining cave/dungeon forms stay legacy.
  const fallback = [E.CAVEBAT,E.GIANTCURSEDSKULL,E.UNDEADVIKING,E.DUNGEONSPIRIT,-999].every(type => !CombatArt.drawEnemy(ctx,game,{ type },{ x:0,y:0 },320,320));
  const protectedCases = [{ boss:'future' },{ minion:'bat' },{ ooaEnemy:true },{ ooaSentry:true }].every(flags => !CombatArt.drawEnemy(ctx,game,Object.assign({ type:E.GIANTBAT },flags),{ x:0,y:0 },320,320));
  return { facing,activity,restored,unchanged,fallback,protectedCases };
},kinds);
check(results,'Giant Bat follows velocity; all three walkers keep AI dir despite contrary movement/player location',presentation.facing.every(s => s.mirror),presentation.facing);
check(results,'Archer recoil follows real cooldown; Bones/Miner activity follows actual upward jump motion',presentation.activity.every(s => s.exact),presentation.activity);
check(results,'Underground drawings restore context state and preserve gameplay',presentation.restored && presentation.unchanged);
check(results,'Unsupported cave/dungeon enemies, bosses, summons and Etherian flags retain legacy renderers',presentation.fallback && presentation.protectedCases);

const sheet = await page.evaluate(kinds => {
  const c = document.createElement('canvas'); c.width = 1152; c.height = 760; const ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0,0,c.width,c.height); ctx.fillStyle = '#ecd49e'; ctx.font = '20px monospace'; ctx.fillText('TREE / bone bowman, riveted plate, lamp helmet and scalloped wings',20,30);
  kinds.forEach((kind,i) => [false,true].forEach((active,row) => {
    const x = i * 288, y = 50 + row * 350;
    ctx.drawImage(CombatArt.enemySprite(kind,row ? 3 : 1,active,false),x,y,288,288);
    ctx.fillStyle = '#d9d5c4'; ctx.font = '15px monospace'; ctx.fillText(kind,x + 12,y + 306);
    ctx.fillStyle = '#9cabc6'; ctx.fillText(!active ? 'normal' : kind === 'skeletonarcher' ? 'shot cooldown / recoil' : kind === 'giantbat' ? 'alternate flap' : 'real jump',x + 12,y + 328);
  }));
  return c.toDataURL('image/png');
},kinds);
writeFileSync(dir + '/underground-artwork.png',Buffer.from(sheet.split(',')[1],'base64'));
for (const active of [false,true]) {
  await page.evaluate(({ kinds,active }) => {
    __underScene(); const o = __underOrigin, p = game.player; p.x = o.x; p.y = o.gy * TILE - p.h / 2 - 0.01;
    kinds.forEach((kind,i) => {
      const e = __underEnemy(kind); e.x = o.x + [-250,-100,145,265][i];
      if (kind === 'skeletonarcher') e.attackCd = active ? 0 : 1;
      const px = p.x, random = Math.random;
      try {
        const jump = active && (kind === 'armoredbones' || kind === 'undeadminer');
        if (jump) p.x = e.x + (i === 1 ? 45 : -45);
        Math.random = () => jump ? 0 : 0.5; enemyStep(e,game);
        if (jump) for (let tick = 0; tick < 4; tick++) enemyStep(e,game);
      } finally { p.x = px; Math.random = random; }
    });
    game.cam.x = o.x; game.cam.y = p.y - 100;
    for (let tick = 0; tick < 10; tick++) updateProjectiles(); p.invuln = 0;
    updateHud(); updateCrosshair(); window.__underHook = CombatArt.drawEnemy; CombatArt.drawEnemy = () => false; render();
  },{ kinds,active });
  const name = active ? 'active' : 'normal';
  await page.screenshot({ path:dir + `/${name}-before.png` });
  await page.evaluate(() => { CombatArt.drawEnemy = __underHook; delete window.__underHook; render(); });
  await page.screenshot({ path:dir + `/${name}-after.png` });
}
writeFileSync(dir + '/index.html',`<!doctype html><meta charset="utf-8"><title>Underground enemy artwork</title>
<style>body{background:#202534;color:#dedbc9;font:16px monospace;max-width:1280px;margin:24px auto;padding:0 16px}img{width:100%;image-rendering:pixelated}.row{display:flex;gap:16px}figure{margin:8px 0;flex:1}a{color:#ecd49e}</style>
<h1>Underground enemy artwork</h1><p>Original pixel art; unchanged AI, bodies, attacks and drops.</p><img src="underground-artwork.png" alt="Skeleton Archer, Armored Bones, Undead Miner and Giant Bat artwork">
${['normal','active'].map(state => `<h2>${state}</h2><p>Combined roster in a real-depth torch-lit review room. Real AI and ten projectile ticks; room, torches, positions, readiness, jump RNG and brief target positions are disposable fixtures, not world-generation changes.</p><div class="row"><figure><img src="${state}-before.png" alt="Legacy ${state} underground enemies"><figcaption>Before — only the general-enemy hook disabled</figcaption></figure><figure><img src="${state}-after.png" alt="Pixel-art ${state} underground enemies"><figcaption>After — same combat state</figcaption></figure></div>`).join('')}
<p><a href="../mummies/index.html">Mummy gallery</a> · <a href="../snow/index.html">Snow gallery</a> · <a href="../player/index.html">Player controls</a></p>`);
await assertNoBrowserErrors(results);
await finish(results,browser,'underground-graphics',{ sources,ai,presentation });
