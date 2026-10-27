// Dungeon artwork and real attacks/hops/loot, in an isolated torch-lit room.
import { mkdirSync, writeFileSync } from 'node:fs';
import { setupAudit, check, assertNoBrowserErrors, finish } from './audit2/lib.mjs';

const { browser, page, results } = await setupAudit();
const kinds = ['cursedskull','darkcaster','angrybones','dungeonslime'];
const dir = 'test-results/graphics/dungeon';
mkdirSync(dir,{ recursive:true });
await page.evaluate(kinds => {
  game.paused = true; game.weather.active = false; game.event = null;
  const w = game.world, tx = Math.floor(w.spawnX / TILE), gy = Math.min(w.H - 100,w.surfaceY[tx] + 64);
  // Disposable room, ordinary lights: not a worldgen edit or a fullbright mode.
  for (let x = tx - 43; x <= tx + 43; x++) {
    for (let y = gy - 35; y < gy; y++) { w.set(x,y,T.AIR); w.setWall(x,y,WALL.DUNGEON); }
    w.set(x,gy,T.DUNGEONBRICK); if ((x - tx) % 6 === 0) w.set(x,gy - 4,T.TORCH);
  }
  window.__dungeonTypes = Object.fromEntries(kinds.map((k,i) => [k,[E.CURSEDSKULL,E.DARKCASTER,E.ANGRYBONES,E.DUNGEONSLIME][i]]));
  window.__dungeonOrigin = { tx,gy,x:tx * TILE + 8 };
  window.__dungeonScene = function(hardmode = true) {
    game.entities = []; game.bossBars = []; game.projectiles.list = []; game.fx = []; game.fxTexts = []; game.pickups = [];
    game.event = null; game.flashT = game.shakeT = 0; game.hardmode = hardmode;
    const p = game.player; p.x = __dungeonOrigin.x - 120; p.y = gy * TILE - p.h / 2 - 0.01;
    p.vx = p.vy = 0; p.onGround = true; p.invuln = 999; p.hp = p.maxHp = 100; p.dying = false; p.respawnT = 0;
    game.cam.x = __dungeonOrigin.x; game.cam.y = p.y - 90; game.timeOfDay = 0.5;
    document.getElementById('screenflash').style.display = 'none'; document.getElementById('deathscreen').classList.add('hidden');
    document.getElementById('message').style.display = 'none'; document.getElementById('interact').style.display = 'none';
  };
  window.__dungeonEnemy = function(kind) {
    const type = __dungeonTypes[kind], e = spawnEntity(game,type,__dungeonOrigin.x,gy * TILE - (kind === 'cursedskull' ? 110 : ENT_DEF[type].h / 2 + 0.01));
    e.onGround = kind !== 'cursedskull'; return e;
  };
  window.__dungeonState = function() {
    function hash(a) { let h = 2166136261; for (let i = 0; i < a.length; i++) h = Math.imul(h ^ a[i],16777619); return h >>> 0; }
    return JSON.stringify({ player:game.player,entities:game.entities,projectiles:game.projectiles.list,progress:game.bossesDefeated,
      event:game.event,hardmode:game.hardmode,eventCompletions:game.eventCompletions,fx:game.fx,texts:game.fxTexts,pickups:game.pickups,
      flash:game.flashT,tiles:hash(w.tiles),walls:hash(w.walls),hp:hash(w.hp),surface:hash(w.surfaceY) });
  };
  window.__dungeonRender = function(e) {
    const before = __dungeonState(), hook = CombatArt.drawEnemy; let calls = 0;
    CombatArt.drawEnemy = (...args) => { if (args[2] === e) calls++; return hook(...args); };
    game.cam.x = e.x; game.cam.y = e.y - 50;
    try { for (let f = 0; f < 4; f++) renderGame(game,ctx2d); } finally { CombatArt.drawEnemy = hook; }
    return { calls,unchanged:before === __dungeonState() };
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
check(results,'All 64 dungeon source variants are nonempty, binary-alpha and unclipped',sources.total === 64 && sources.inked === 64 && sources.crisp && sources.margins,sources);
check(results,'Skull, Caster, Bones and Slime have four distinct silhouettes',sources.silhouettes === 4);
check(results,'All four animate while hit flashes preserve exact source alpha',sources.masks && sources.animated.every(s => s.frames >= 2),sources.animated);
check(results,'Skull/Caster firing and Bones/Slime upward motion have distinct activity artwork',sources.activity.every(s => s.distinct),sources.activity);
check(results,'Dungeon artwork regenerates deterministically after shared-cache eviction',sources.stable);

const ai = await page.evaluate(kinds => {
  const skulls = [], casters = [], bones = [], slimes = [], walls = [], contacts = [], kills = [];
  function simulate(e,roll = 0.5) { const random = Math.random; try { Math.random = () => roll; enemyStep(e,game); } finally { Math.random = random; } }
  const body = e => e.w === ENT_DEF[e.type].w && e.h === ENT_DEF[e.type].h && !e.segments && !e.arms && !e.ghost;
  for (const side of [-1,1]) for (const distance of [160,399,401,403]) {
    __dungeonScene(); const e = __dungeonEnemy('cursedskull'), x = e.x, y = e.y, bob = e.bob;
    game.player.x = e.x + side * distance; game.player.y = e.y; simulate(e);
    const shots = game.projectiles.list.slice(), angle = Math.atan2(game.player.y - e.y,game.player.x - e.x), count = shots.length;
    const shouldFire = dist(e.x,e.y,game.player.x,game.player.y) < 400, rendered = __dungeonRender(e);
    const correct = shots.every(p => p.type === P.MAGICBOLT && p.dmg === 24 && p.owner === 'enemy' && p.life === 5 && p.color === '#b8a0ff' &&
      p.x === e.x && p.y === e.y && Math.abs(p.vx - Math.cos(angle) * 3.2) < 0.000001 && Math.abs(p.vy - Math.sin(angle) * 3.2) < 0.000001);
    const movement = Math.abs(e.x - x - side * e.speed) < 0.000001 && Math.abs(e.y - y - Math.sin(bob + 0.06) * 0.8) < 0.000001;
    if (shouldFire) simulate(e);
    skulls.push({ side,distance,...rendered,shouldFire,shots:count,correct,movement,noExtra:game.projectiles.list.length === count,
      cooldown:shouldFire ? Math.abs(e.attackCd - (2.4 - 1 / 60)) < 0.000001 : e.attackCd < 0,body:body(e) });
  }
  for (const side of [-1,1]) for (const distance of [160,459,460,461]) for (const vertical of [0,120]) {
    __dungeonScene(); const e = __dungeonEnemy('darkcaster'), x = e.x;
    game.player.x = e.x + side * distance; game.player.y = e.y - vertical; simulate(e);
    const shots = game.projectiles.list.slice(), angle = Math.atan2(game.player.y - e.y,game.player.x - e.x), count = shots.length;
    const shouldFire = dist(e.x,e.y,game.player.x,game.player.y) < 460, rendered = __dungeonRender(e);
    const correct = shots.every(p => p.type === P.MAGICBOLT && p.dmg === 28 && p.owner === 'enemy' && p.life === 5 && p.color === '#a878ff' &&
      p.x === e.x && p.y === e.y - 12 && Math.abs(p.vx - Math.cos(angle) * 4) < 0.000001 && Math.abs(p.vy - Math.sin(angle) * 4) < 0.000001);
    const movement = e.dir === side && Math.abs(e.vx - side * e.speed * 0.1) < 0.000001 && Math.abs(e.x - x - e.vx) < 0.000001;
    if (shouldFire) simulate(e);
    casters.push({ side,distance,vertical,...rendered,shouldFire,shots:count,correct,movement,noExtra:game.projectiles.list.length === count,
      cooldown:shouldFire ? Math.abs(e.attackCd - (2.8 - 1 / 60)) < 0.000001 : e.attackCd < 0,body:body(e) });
  }
  for (const side of [-1,1]) for (const distance of [40,64,80]) for (const roll of [0,0.5]) {
    __dungeonScene(); const e = __dungeonEnemy('angrybones'), x = e.x, y = e.y;
    game.player.x = e.x + side * distance; game.player.y = e.y; simulate(e,roll);
    const jumping = distance < 4 * TILE && roll < 0.02;
    bones.push({ side,distance,roll,...__dungeonRender(e),movement:e.dir === side && Math.abs(e.vx - side * e.speed * 0.1) < 0.000001 && Math.abs(e.x - x - e.vx) < 0.000001,
      jump:jumping ? !e.onGround && Math.abs(e.vy - (-7 + GRAVITY)) < 0.000001 && e.y < y : e.onGround && e.vy === 0 && e.y === y,body:body(e),shots:game.projectiles.list.length });
  }
  for (const hardmode of [false,true]) for (const side of [-1,1]) for (const roll of [0,0.5,0.999]) {
    __dungeonScene(hardmode); const e = __dungeonEnemy('dungeonslime'); e.timer = 1;
    game.player.x = e.x + side * 200; game.player.y = e.y; simulate(e,roll);
    const waiting = e.onGround && e.vy === 0 && Math.abs(e.timer - (1 - 2 / 60)) < 0.000001 && e.vx === side * e.speed * 0.35;
    e.timer = 0; const x = e.x, y = e.y; simulate(e,roll);
    const launched = !e.onGround && Math.abs(e.vy - (-(8 + roll * 3) + GRAVITY)) < 0.000001 && e.y < y &&
      Math.abs(e.x - x - side * e.speed * (2 + roll)) < 0.000001 && e.timer === 1 + roll * 0.8;
    const launch = __dungeonRender(e), vy = e.vy, timer = e.timer; game.player.x = e.x - side * 200; simulate(e,roll);
    const airborne = e.dir === -side && e.vx === -side * e.speed * 0.35 && Math.abs(e.vy - (vy + GRAVITY)) < 0.000001 && Math.abs(e.timer - (timer - 2 / 60)) < 0.000001;
    slimes.push({ hardmode,side,roll,waiting,launched,airborne,launch,later:__dungeonRender(e),body:body(e),shots:game.projectiles.list.length });
  }
  for (const kind of kinds) for (const side of [-1,1]) {
    __dungeonScene(); const e = __dungeonEnemy(kind), w = game.world, wx = __dungeonOrigin.tx + side * 2, wy = Math.floor(e.y / TILE), original = [];
    for (let y = wy - 1; y <= wy + 1; y++) { original.push([y,w.get(wx,y)]); w.set(wx,y,T.DUNGEONBRICK); }
    e.x = side > 0 ? wx * TILE - e.w / 2 - 0.05 : (wx + 1) * TILE + e.w / 2 + 0.05;
    e.attackCd = e.timer = 10; game.player.x = e.x + side * 180; game.player.y = e.y; simulate(e);
    walls.push({ kind,side,blocked:e.vx === 0 && (side > 0 ? e.x + e.w / 2 <= wx * TILE : e.x - e.w / 2 >= (wx + 1) * TILE),...__dungeonRender(e) });
    original.forEach(([y,t]) => w.set(wx,y,t));
  }
  for (const kind of kinds) {
    __dungeonScene(); let e = __dungeonEnemy(kind); e.attackCd = e.timer = 10;
    game.player.x = e.x + 3; game.player.y = e.y; game.player.hp = game.player.maxHp = 500; game.player.invuln = 0;
    const hp = game.player.hp; simulate(e);
    contacts.push({ kind,damaged:game.player.hp < hp,invuln:game.player.invuln > 0,cooldown:e.dmgCd === 0.8,...__dungeonRender(e) });
    for (const hardmode of [false,true]) for (const roll of [0,0.25,0.35,0.9]) {
      __dungeonScene(hardmode); e = __dungeonEnemy(kind); hitEntity(e,1,0,0,game);
      const flash = e.flash > 0, flashed = __dungeonRender(e), random = Math.random;
      try { Math.random = () => roll; hitEntity(e,e.hp + e.def + 20,0,0,game); } finally { Math.random = random; }
      // Sum repeated material records: Cursed Skull can drop two separate Bone stacks.
      const drops = game.pickups.reduce((d,p) => { d[p.item] = (d[p.item] || 0) + p.count; return d; },{});
      const expected = kind === 'cursedskull' ? { [I.BONE]:1 + (roll < 0.3 ? 1 : 0) } : kind === 'angrybones' ? { [I.BONE]:1 } :
        kind === 'darkcaster' ? { [I.BONE]:roll < 0.35 ? 2 : 1,[I.GEM_AMETHYST]:roll < 0.2 ? 1 : 0 } : { [I.GEL]:1,[I.DUNGEONBRICK]:roll < 0.3 ? 1 : 0 };
      const base = Object.entries(expected).every(([id,n]) => (drops[id] || 0) === n);
      const rare = (B83_ENEMY_DROPS[e.name] || []).every(d => (drops[d.id] || 0) === (roll < d.rate ? 1 : 0));
      const before = __dungeonState(); renderGame(game,ctx2d);
      const c = document.createElement('canvas'); c.width = c.height = 160; drawEnemy(c.getContext('2d'),e,{ x:e.x,y:e.y },160,160);
      const hidden = !c.getContext('2d').getImageData(0,0,160,160).data.some((v,i) => i % 4 === 3 && v);
      kills.push({ kind,hardmode,roll,flash,flashed,dead:e.dead,hidden,drops,base,rare,unchanged:before === __dungeonState() });
    }
  }
  return { skulls,casters,bones,slimes,walls,contacts,kills };
},kinds);
check(results,'Cursed Skull retains colliding flight/bobbing, post-movement 400 range and original 24-damage magic shots',ai.skulls.every(s => s.calls === 4 && s.unchanged && s.movement && s.body && s.correct && s.shots === (s.shouldFire ? 1 : 0) && s.noExtra && s.cooldown),ai.skulls);
check(results,'Dark Caster remains a walker with post-movement 460 range, original shot origin/damage and 2.8 cooldown',ai.casters.every(s => s.calls === 4 && s.unchanged && s.movement && s.body && s.correct && s.shots === (s.shouldFire ? 1 : 0) && s.noExtra && s.cooldown),ai.casters);
check(results,'Angry Bones keeps real walking and probabilistic four-tile jump without gaining attacks',ai.bones.every(s => s.calls === 4 && s.unchanged && s.movement && s.jump && s.body && s.shots === 0),ai.bones);
check(results,'Dungeon Slime preserves randomized real hops, double timer decrement and existing airborne retarget/slowdown',ai.slimes.every(s => s.waiting && s.launched && s.airborne && s.body && s.shots === 0 && [s.launch,s.later].every(r => r.calls === 4 && r.unchanged)),ai.slimes);
check(results,'All four retain left/right solid-wall collision; Skull does not acquire ghost movement',ai.walls.every(s => s.blocked && s.calls === 4 && s.unchanged),ai.walls);
check(results,'All four real contact attacks preserve damage, invulnerability and contact cooldown',ai.contacts.every(s => s.damaged && s.invuln && s.cooldown && s.calls === 4 && s.unchanged),ai.contacts);
check(results,'Real flashes/kills preserve repeated Bone stacks, gem/brick branches and all existing rare tables',ai.kills.every(s => s.base && s.rare && s.flash && s.flashed.calls === 4 && s.flashed.unchanged && s.dead && s.hidden && s.unchanged),ai.kills);

const presentation = await page.evaluate(kinds => {
  __dungeonScene(); const c = document.createElement('canvas'); c.width = c.height = 320; const ctx = c.getContext('2d');
  const facing = [], activity = [];
  for (const kind of kinds) {
    const e = __dungeonEnemy(kind), shooter = kind === 'cursedskull' || kind === 'darkcaster';
    function pixels() { ctx.clearRect(0,0,320,320); CombatArt.drawEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320); return ctx.getImageData(0,0,320,320).data; }
    e.dir = shooter ? -1 : 1; e.vx = -2; game.player.x = e.x + (shooter ? 200 : -200);
    const right = pixels(); e.dir = -e.dir; e.vx = 2; game.player.x = e.x + (shooter ? -200 : 200);
    const left = pixels(); let mirror = true, distinct = false;
    for (let y = 0; y < 320; y++) for (let x = 0; x < 320; x++) for (let ch = 0; ch < 4; ch++) {
      const i = (y * 320 + x) * 4 + ch, r = (y * 320 + 319 - x) * 4 + ch;
      if (left[i] !== right[r]) mirror = false; if (left[i] !== right[i]) distinct = true;
    }
    facing.push({ kind,mirror:mirror && distinct });
    for (const active of [false,true]) {
      e.dir = 1; e.vx = -2; e.onGround = !active; e.vy = active ? -6 : 0;
      e.attackCd = active ? (kind === 'cursedskull' ? 2.4 : 2.8) : 1; game.player.x = e.x + 200;
      const drawn = pixels(), expected = document.createElement('canvas'); expected.width = expected.height = 320;
      expected.getContext('2d').drawImage(CombatArt.enemySprite(kind,Math.floor(Time.seconds * 10) % 4,active,false),112,112);
      const bytes = expected.getContext('2d').getImageData(0,0,320,320).data;
      activity.push({ kind,active,exact:drawn.every((v,i) => v === bytes[i]) });
    }
  }
  ctx.translate(4,6); ctx.scale(0.7,0.8); ctx.globalAlpha = 0.6; ctx.fillStyle = '#123456'; ctx.strokeStyle = '#654321'; ctx.font = '17px serif'; ctx.textAlign = 'right'; ctx.imageSmoothingEnabled = true;
  function state() { const m = ctx.getTransform(); return JSON.stringify([m.a,m.b,m.c,m.d,m.e,m.f,ctx.globalAlpha,ctx.fillStyle,ctx.strokeStyle,ctx.lineWidth,ctx.font,ctx.textAlign,ctx.imageSmoothingEnabled,ctx.globalCompositeOperation]); }
  const before = state(), gameplay = __dungeonState();
  game.entities.forEach(e => CombatArt.drawEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320));
  const restored = before === state(), unchanged = gameplay === __dungeonState();
  const fallback = [E.GIANTCURSEDSKULL,E.NECROMANCER,E.RAGGEDCASTER,E.DIABOLIST,-999].every(type => !CombatArt.drawEnemy(ctx,game,{ type },{ x:0,y:0 },320,320));
  const protectedCases = [{ boss:'future' },{ minion:'skull' },{ ooaEnemy:true },{ ooaSentry:true }].every(flags => !CombatArt.drawEnemy(ctx,game,Object.assign({ type:E.CURSEDSKULL },flags),{ x:0,y:0 },320,320));
  return { facing,activity,restored,unchanged,fallback,protectedCases };
},kinds);
check(results,'Skull/Caster face their actual player shooting target; Bones/Slime retain AI dir despite contrary movement',presentation.facing.every(s => s.mirror),presentation.facing);
check(results,'Dungeon activity artwork follows existing cooldown/upward motion without creating attacks',presentation.activity.every(s => s.exact),presentation.activity);
check(results,'Dungeon drawings restore context state and preserve gameplay',presentation.restored && presentation.unchanged);
check(results,'Unconverted dungeon creatures, bosses, summons and Etherian flags retain legacy renderers',presentation.fallback && presentation.protectedCases);

const sheet = await page.evaluate(kinds => {
  const c = document.createElement('canvas'); c.width = 1152; c.height = 760; const ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0,0,c.width,c.height); ctx.fillStyle = '#ecd49e'; ctx.font = '20px monospace'; ctx.fillText('TREE / cracked ivory, folded hood, bare ribs and brick-filled gel',20,30);
  kinds.forEach((kind,i) => [false,true].forEach((active,row) => {
    const x = i * 288, y = 50 + row * 350;
    ctx.drawImage(CombatArt.enemySprite(kind,row ? 3 : 1,active,false),x,y,288,288);
    ctx.fillStyle = '#d9d5c4'; ctx.font = '15px monospace'; ctx.fillText(kind,x + 12,y + 306);
    ctx.fillStyle = '#9cabc6'; ctx.fillText(!active ? 'normal' : kind === 'cursedskull' || kind === 'darkcaster' ? 'real firing cooldown' : 'real jump / hop',x + 12,y + 328);
  }));
  return c.toDataURL('image/png');
},kinds);
writeFileSync(dir + '/dungeon-artwork.png',Buffer.from(sheet.split(',')[1],'base64'));
for (const active of [false,true]) {
  await page.evaluate(({ kinds,active }) => {
    __dungeonScene(); const o = __dungeonOrigin, p = game.player; p.x = o.x; p.y = o.gy * TILE - p.h / 2 - 0.01;
    kinds.forEach((kind,i) => {
      const e = __dungeonEnemy(kind); e.x = o.x + [-260,-130,130,265][i];
      e.attackCd = active ? 0 : 1; e.timer = active ? 0 : 1;
      const px = p.x, random = Math.random;
      try {
        if (kind === 'angrybones' && active) p.x = e.x - 45;
        Math.random = () => active ? 0 : 0.5; enemyStep(e,game);
        if (active && (kind === 'angrybones' || kind === 'dungeonslime')) for (let tick = 0; tick < 4; tick++) enemyStep(e,game);
      } finally { p.x = px; Math.random = random; }
    });
    game.cam.x = o.x; game.cam.y = p.y - 100;
    for (let tick = 0; tick < 10; tick++) updateProjectiles(); p.invuln = 0;
    updateHud(); updateCrosshair(); window.__dungeonHook = CombatArt.drawEnemy; CombatArt.drawEnemy = () => false; render();
  },{ kinds,active });
  const name = active ? 'active' : 'normal';
  await page.screenshot({ path:dir + `/${name}-before.png` });
  await page.evaluate(() => { CombatArt.drawEnemy = __dungeonHook; delete window.__dungeonHook; render(); });
  await page.screenshot({ path:dir + `/${name}-after.png` });
}
writeFileSync(dir + '/index.html',`<!doctype html><meta charset="utf-8"><title>Dungeon enemy artwork</title>
<style>body{background:#202534;color:#dedbc9;font:16px monospace;max-width:1280px;margin:24px auto;padding:0 16px}img{width:100%;image-rendering:pixelated}.row{display:flex;gap:16px}figure{margin:8px 0;flex:1}a{color:#ecd49e}</style>
<h1>Dungeon enemy artwork</h1><p>Original pixel art; unchanged AI, bodies, attacks and drops.</p><img src="dungeon-artwork.png" alt="Cursed Skull, Dark Caster, Angry Bones and Dungeon Slime artwork">
${['normal','active'].map(state => `<h2>${state}</h2><p>Real spawns/AI and ten projectile ticks in a torch-lit dungeon-wall review room. Room, torches, positions, readiness, controlled RNG and a brief nearby jump target are disposable fixtures.</p><div class="row"><figure><img src="${state}-before.png" alt="Legacy ${state} dungeon enemies"><figcaption>Before — only the general-enemy hook disabled</figcaption></figure><figure><img src="${state}-after.png" alt="Pixel-art ${state} dungeon enemies"><figcaption>After — same combat state</figcaption></figure></div>`).join('')}
<p><a href="../underground/index.html">Underground gallery</a> · <a href="../mummies/index.html">Mummy gallery</a> · <a href="../player/index.html">Player controls</a></p>`);
await assertNoBrowserErrors(results);
await finish(results,browser,'dungeon-graphics',{ sources,ai,presentation });
