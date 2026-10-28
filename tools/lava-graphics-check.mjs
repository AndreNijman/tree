// Presentation-only lava-creature artwork; real AI and loot in a disposable room.
import { mkdirSync, writeFileSync } from 'node:fs';
import { setupAudit, check, assertNoBrowserErrors, finish } from './audit2/lib.mjs';

const { browser, page, results } = await setupAudit();
const kinds = ['lavaslime','lavabat','reddevil'];
const dir = 'test-results/graphics/lava';
mkdirSync(dir,{ recursive:true });
await page.evaluate(kinds => {
  game.paused = true; game.weather.active = false; game.event = null;
  const w = game.world, tx = Math.floor(w.spawnX / TILE), gy = Math.min(w.H - 10,w.hellY + 12);
  for (let x = tx - 43; x <= tx + 43; x++) {
    for (let y = gy - 35; y < gy; y++) { w.set(x,y,T.AIR); w.setWall(x,y,WALL.CAVE); }
    w.set(x,gy,T.ASH); if ((x - tx) % 6 === 0) w.set(x,gy - 4,T.TORCH);
  }
  window.__lavaTypes = Object.fromEntries(kinds.map((k,i) => [k,[E.LAVASLIME,E.LAVABAT,E.REDDEVIL][i]]));
  window.__lavaOrigin = { tx,gy,x:tx * TILE + 8 };
  window.__lavaScene = function(hardmode = true) {
    game.entities = []; game.bossBars = []; game.projectiles.list = []; game.fx = []; game.fxTexts = []; game.pickups = [];
    game.event = null; game.flashT = game.shakeT = 0; game.hardmode = hardmode;
    const p = game.player; p.x = __lavaOrigin.x - 120; p.y = gy * TILE - p.h / 2 - 0.01;
    p.vx = p.vy = 0; p.onGround = true; p.invuln = 999; p.hp = p.maxHp = 100; p.dying = false; p.respawnT = 0;
    game.cam.x = __lavaOrigin.x; game.cam.y = p.y - 90; game.timeOfDay = 0.5;
    document.getElementById('screenflash').style.display = 'none'; document.getElementById('deathscreen').classList.add('hidden');
    document.getElementById('message').style.display = 'none'; document.getElementById('interact').style.display = 'none';
  };
  window.__lavaEnemy = function(kind) {
    const type = __lavaTypes[kind], e = spawnEntity(game,type,__lavaOrigin.x,gy * TILE - (kind === 'lavaslime' ? ENT_DEF[type].h / 2 + 0.01 : 110));
    e.onGround = kind === 'lavaslime'; return e;
  };
  window.__lavaTerrain = function() {
    function hash(a) { let h = 2166136261; for (let i = 0; i < a.length; i++) h = Math.imul(h ^ a[i],16777619); return h >>> 0; }
    return [w.tiles,w.walls,w.hp,w.surfaceY].map(hash);
  };
  window.__lavaState = function() {
    return JSON.stringify({ player:game.player,entities:game.entities,projectiles:game.projectiles.list,bars:game.bossBars,progress:game.bossesDefeated,
      event:game.event,hardmode:game.hardmode,eventCompletions:game.eventCompletions,fx:game.fx,texts:game.fxTexts,pickups:game.pickups,
      flash:game.flashT,terrain:__lavaTerrain() });
  };
  window.__lavaRender = function(e) {
    const before = __lavaState(), hook = CombatArt.drawEnemy; let calls = 0;
    CombatArt.drawEnemy = (...args) => { if (args[2] === e) calls++; return hook(...args); };
    game.cam.x = e.x; game.cam.y = e.y - 50;
    try { for (let f = 0; f < 4; f++) renderGame(game,ctx2d); } finally { CombatArt.drawEnemy = hook; }
    return { calls,unchanged:before === __lavaState() };
  };
  window.__lavaStep = function(e,roll = 0.5) { const random = Math.random; try { Math.random = () => roll; enemyStep(e,game); } finally { Math.random = random; } };
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
  const comparisons = [['lavabat','hellbat'],['lavabat','icebat'],['reddevil','demon'],['lavaslime','dungeonslime']];
  const distinct = comparisons.every(([a,b]) => { const left = bytes(a,0,false,false), right = bytes(b,0,false,false); return left.some((v,i) => i % 4 === 3 && v !== right[i]); });
  const original = kinds.map(k => Array.from(bytes(k,0,false,false)));
  for (const boss of ['kingslime','eyeofcthulhu','brainofcthulhu','queenbee','skeletron','wallofflesh','retinazer','spazmatism','destroyer','skelprime','queenslime','plantera','golem','duke','empress','moonlord','cultist']) {
    for (const phase of [false,true]) for (let f = 0; f < 4; f++) for (const flash of [false,true]) CombatArt.bossSprite(boss,phase,f,flash);
  }
  return { total,inked,crisp,margins,masks,animated,silhouettes:silhouettes.size,distinct,
    stable:kinds.every((k,i) => bytes(k,0,false,false).every((v,n) => v === original[i][n])) };
},kinds);
check(results,'All 48 lava source variants are nonempty, binary-alpha and unclipped',sources.total === 48 && sources.inked === 48 && sources.crisp && sources.margins,sources);
check(results,'Three silhouettes are distinct from each other and earlier related creatures',sources.silhouettes === 3 && sources.distinct);
check(results,'Lava creatures animate and flashes preserve exact alpha',sources.masks && sources.animated.every(s => s.frames >= 2),sources.animated);
check(results,'Lava artwork regenerates deterministically after shared-cache eviction',sources.stable);

const ai = await page.evaluate(kinds => {
  const flyers = [], hops = [], timers = [], walls = [], contacts = [], kills = [];
  const near = (a,b) => Math.abs(a - b) < 0.000001;
  const body = e => e.w === ENT_DEF[e.type].w && e.h === ENT_DEF[e.type].h && !e.segments && !e.arms && !e.ghost;
  for (const kind of ['lavabat','reddevil']) for (const hardmode of [false,true]) for (const side of [-1,1]) for (const vertical of [0,-80,80]) {
    __lavaScene(hardmode); const e = __lavaEnemy(kind), x = e.x, y = e.y, bob = e.bob;
    game.player.x = e.x + side * 200; game.player.y = e.y + vertical;
    const d = Math.hypot(side * 200,vertical); __lavaStep(e);
    flyers.push({ kind,hardmode,side,vertical,...__lavaRender(e),body:body(e),
      movement:near(e.x - x,side * 200 / d * e.speed) && near(e.y - y,vertical / d * e.speed + Math.sin(bob + 0.06) * 0.8),
      noShots:game.projectiles.list.length === 0 });
  }
  for (const side of [-1,1]) for (const roll of [0,0.5,0.999]) {
    __lavaScene(); const e = __lavaEnemy('lavaslime'), x = e.x, y = e.y; e.timer = 0;
    game.player.x = e.x + side * 200; __lavaStep(e,roll);
    hops.push({ side,roll,...__lavaRender(e),body:body(e),dir:e.dir === side,
      hop:near(e.vy,-(8 + roll * 3) + GRAVITY) && near(e.vx,side * e.speed * (2 + roll)) && near(e.timer,1 + roll * 0.8) && !e.onGround && e.y < y && near(e.x - x,e.vx),
      noShots:game.projectiles.list.length === 0 });
  }
  for (const side of [-1,1]) for (const timer of [1,0.025,0.04]) {
    __lavaScene(); const e = __lavaEnemy('lavaslime'); e.timer = timer; game.player.x = e.x + side * 200;
    __lavaStep(e); const jumping = timer <= 2 / 60;
    timers.push({ side,timer,...__lavaRender(e),correct:jumping ? !e.onGround && near(e.timer,1.4) : e.onGround && near(e.timer,timer - 2 / 60) && near(e.vx,side * e.speed * 0.35) });
  }
  for (const kind of kinds) for (const side of [-1,1]) {
    __lavaScene(); const e = __lavaEnemy(kind), w = game.world, wx = __lavaOrigin.tx + side * 2, wy = Math.floor(e.y / TILE), original = [];
    for (let y = wy - 1; y <= wy + 1; y++) { original.push([y,w.get(wx,y)]); w.set(wx,y,T.HELLBRICK); }
    e.x = side > 0 ? wx * TILE - e.w / 2 - 0.05 : (wx + 1) * TILE + e.w / 2 + 0.05;
    e.timer = 10; game.player.x = e.x + side * 180; game.player.y = e.y; __lavaStep(e);
    walls.push({ kind,side,blocked:e.vx === 0 && (side > 0 ? e.x + e.w / 2 <= wx * TILE : e.x - e.w / 2 >= (wx + 1) * TILE),...__lavaRender(e) });
    original.forEach(([y,t]) => w.set(wx,y,t));
  }
  for (const kind of kinds) {
    __lavaScene(); let e = __lavaEnemy(kind); e.timer = 10;
    game.player.x = e.x + 3; game.player.y = e.y; game.player.hp = game.player.maxHp = 500; game.player.invuln = 0;
    const hp = game.player.hp; __lavaStep(e);
    contacts.push({ kind,damaged:game.player.hp < hp,invuln:game.player.invuln > 0,cooldown:e.dmgCd === 0.8,...__lavaRender(e) });
    for (const hardmode of [false,true]) for (const roll of [0.01,0.299,0.3,0.349,0.35,0.9]) {
      __lavaScene(hardmode); e = __lavaEnemy(kind); const terrain = JSON.stringify(__lavaTerrain());
      hitEntity(e,1,0,0,game); const flash = e.flash > 0, flashed = __lavaRender(e), random = Math.random;
      try { Math.random = () => roll; hitEntity(e,e.hp + e.def + 20,0,0,game); } finally { Math.random = random; }
      const materials = game.pickups.reduce((d,p) => { if (!['coin','silvercoin','goldcoin','platinumcoin'].includes(p.item) && p.count > 0) d[p.item] = (d[p.item] || 0) + p.count; return d; },{});
      const expected = kind === 'lavaslime' ? (roll < 0.3 ? { [I.HELLSTONE]:1 } : { [I.OBSIDIAN]:1 }) : kind === 'lavabat' && roll < 0.35 ? { [I.HELLSTONE]:1 } : {};
      const before = __lavaState(); renderGame(game,ctx2d);
      const c = document.createElement('canvas'); c.width = c.height = 160; drawEnemy(c.getContext('2d'),e,{ x:e.x,y:e.y },160,160);
      kills.push({ kind,hardmode,roll,materials,expected,base:JSON.stringify(materials) === JSON.stringify(expected),flash,flashed,dead:e.dead,
        hidden:!c.getContext('2d').getImageData(0,0,160,160).data.some((v,i) => i % 4 === 3 && v),unchanged:before === __lavaState(),
        noLava:terrain === JSON.stringify(__lavaTerrain()),noChildren:game.entities.length === 1,noShots:game.projectiles.list.length === 0 });
    }
  }
  return { flyers,hops,timers,walls,contacts,kills };
},kinds);
for (const kind of ['lavabat','reddevil']) check(results,`${kind}: real bidirectional/vertical colliding flight and bobbing, no invented attacks`,ai.flyers.filter(s => s.kind === kind).every(s => s.calls === 4 && s.unchanged && s.body && s.movement && s.noShots),ai.flyers.filter(s => s.kind === kind));
check(results,'Lava Slime preserves randomized real hop velocity, height and reset timer',ai.hops.every(s => s.calls === 4 && s.unchanged && s.body && s.dir && s.hop && s.noShots),ai.hops);
check(results,'Lava Slime preserves double-decrement timing and grounded drift',ai.timers.every(s => s.correct && s.calls === 4 && s.unchanged),ai.timers);
check(results,'All three lava creatures preserve left/right terrain collision',ai.walls.every(s => s.blocked && s.calls === 4 && s.unchanged),ai.walls);
check(results,'Real contact damage, invulnerability and cooldown remain intact',ai.contacts.every(s => s.damaged && s.invuln && s.cooldown && s.calls === 4 && s.unchanged),ai.contacts);
check(results,'Real seeded hits/kills preserve material branches, no new rare drops, children, shots or lava',ai.kills.every(s => s.base && s.flash && s.flashed.calls === 4 && s.flashed.unchanged && s.dead && s.hidden && s.unchanged && s.noLava && s.noChildren && s.noShots),ai.kills);

const presentation = await page.evaluate(kinds => {
  __lavaScene(); const c = document.createElement('canvas'); c.width = c.height = 320; const ctx = c.getContext('2d');
  const facing = [], poses = [];
  for (const kind of kinds) {
    const e = __lavaEnemy(kind), slime = kind === 'lavaslime';
    function pixels() { ctx.clearRect(0,0,320,320); CombatArt.drawEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320); return ctx.getImageData(0,0,320,320).data; }
    e.dir = slime ? 1 : -1; e.vx = slime ? -2 : 2; game.player.x = e.x - 200;
    const right = pixels(); e.dir = -e.dir; e.vx = -e.vx; game.player.x = e.x + 200;
    const left = pixels(); let mirror = true, distinct = false;
    for (let y = 0; y < 320; y++) for (let x = 0; x < 320; x++) for (let ch = 0; ch < 4; ch++) {
      const i = (y * 320 + x) * 4 + ch, r = (y * 320 + 319 - x) * 4 + ch;
      if (left[i] !== right[r]) mirror = false; if (left[i] !== right[i]) distinct = true;
    }
    facing.push({ kind,mirror:mirror && distinct });
    for (const [onGround,vy] of [[true,0],[false,-4],[false,3],[false,-1]]) {
      e.dir = slime ? 1 : -1; e.vx = slime ? -2 : 2; e.onGround = onGround; e.vy = vy; e.attackCd = 999;
      const drawn = pixels(), expected = document.createElement('canvas'); expected.width = expected.height = 320;
      expected.getContext('2d').drawImage(CombatArt.enemySprite(kind,Math.floor(Time.seconds * 10) % 4,slime && !onGround && vy < -1,false),112,112);
      const bytes = expected.getContext('2d').getImageData(0,0,320,320).data;
      poses.push({ kind,onGround,vy,exact:drawn.every((v,i) => v === bytes[i]) });
    }
  }
  ctx.translate(4,6); ctx.scale(0.7,0.8); ctx.globalAlpha = 0.6; ctx.fillStyle = '#123456'; ctx.strokeStyle = '#654321'; ctx.font = '17px serif'; ctx.textAlign = 'right'; ctx.imageSmoothingEnabled = true;
  function state() { const m = ctx.getTransform(); return JSON.stringify([m.a,m.b,m.c,m.d,m.e,m.f,ctx.globalAlpha,ctx.fillStyle,ctx.strokeStyle,ctx.lineWidth,ctx.font,ctx.textAlign,ctx.imageSmoothingEnabled,ctx.globalCompositeOperation]); }
  const before = state(), gameplay = __lavaState(); game.entities.forEach(e => CombatArt.drawEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320));
  const restored = before === state(), unchanged = gameplay === __lavaState();
  const fallback = [E.BONESERPENT,E.PIGRON,E.ICEGOLEM,-999].every(type => !CombatArt.drawEnemy(ctx,game,{ type },{ x:0,y:0 },320,320));
  const protectedCases = [{ boss:'future' },{ minion:'imp' },{ ooaEnemy:true },{ ooaSentry:true }].every(flags => !CombatArt.drawEnemy(ctx,game,Object.assign({ type:E.REDDEVIL },flags),{ x:0,y:0 },320,320));
  return { facing,poses,restored,unchanged,fallback,protectedCases };
},kinds);
check(results,'Flyers follow actual velocity; Lava Slime retains AI-owned direction',presentation.facing.every(s => s.mirror),presentation.facing);
check(results,'Only upward-moving Lava Slime uses hop pose; cooldowns invent no flyer attacks',presentation.poses.every(s => s.exact),presentation.poses);
check(results,'Lava artwork restores context and never mutates gameplay',presentation.restored && presentation.unchanged);
check(results,'Segmented/unconverted/deferred enemies and protected branches retain fallbacks',presentation.fallback && presentation.protectedCases);

const sheet = await page.evaluate(kinds => {
  const c = document.createElement('canvas'); c.width = 864; c.height = 760; const ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0,0,c.width,c.height); ctx.fillStyle = '#ecd49e'; ctx.font = '18px monospace'; ctx.fillText('TREE / basalt gel, flame-tip wings and scarlet hooked flyer',20,30);
  kinds.forEach((kind,i) => [false,true].forEach((active,row) => {
    const x = i * 288, y = 50 + row * 350;
    ctx.drawImage(CombatArt.enemySprite(kind,row ? 3 : 1,active && kind === 'lavaslime',false),x,y,288,288);
    ctx.fillStyle = '#d9d5c4'; ctx.font = '15px monospace'; ctx.fillText(kind,x + 12,y + 306);
    ctx.fillStyle = '#9cabc6'; ctx.fillText(!active ? 'normal' : kind === 'lavaslime' ? 'real upward hop' : 'alternate flap',x + 12,y + 328);
  })); return c.toDataURL('image/png');
},kinds);
writeFileSync(dir + '/lava-artwork.png',Buffer.from(sheet.split(',')[1],'base64'));
for (const active of [false,true]) {
  await page.evaluate(({ kinds,active }) => {
    __lavaScene(); const o = __lavaOrigin, p = game.player; p.x = o.x; p.y = o.gy * TILE - p.h / 2 - 0.01;
    kinds.forEach((kind,i) => {
      const e = __lavaEnemy(kind); e.x = o.x + [-230,-80,220][i]; if (kind !== 'lavaslime') e.y -= i === 2 ? 40 : 0;
      e.timer = active ? 0 : 1; __lavaStep(e);
      if (active) for (let f = 0; f < 5; f++) __lavaStep(e);
    });
    game.cam.x = o.x; game.cam.y = p.y - 100; p.invuln = 0;
    updateHud(); updateCrosshair(); window.__lavaHook = CombatArt.drawEnemy; CombatArt.drawEnemy = () => false; render();
  },{ kinds,active });
  const name = active ? 'active' : 'normal'; await page.screenshot({ path:dir + `/${name}-before.png` });
  await page.evaluate(() => { CombatArt.drawEnemy = __lavaHook; delete window.__lavaHook; render(); });
  await page.screenshot({ path:dir + `/${name}-after.png` });
}
writeFileSync(dir + '/index.html',`<!doctype html><meta charset="utf-8"><title>Lava creature artwork</title>
<style>body{background:#202534;color:#dedbc9;font:16px monospace;max-width:1280px;margin:24px auto;padding:0 16px}img{width:100%;image-rendering:pixelated}.row{display:flex;gap:16px}figure{margin:8px 0;flex:1}a{color:#ecd49e}</style>
<h1>Lava creature artwork</h1><p>Original pixel art; unchanged AI, bodies, attacks and drops. No new lava, tridents or ranged attacks.</p><img src="lava-artwork.png" alt="Lava Slime, Lava Bat and Red Devil artwork">
${['normal','active'].map(state => `<h2>${state}</h2><p>Real spawns and ${state === 'active' ? 'six' : 'one'} AI ticks at real Underworld depth. Dry ash-floor room, torches, positions, readiness, controlled RNG and nonlethal test HP are disposable fixtures.</p><div class="row"><figure><img src="${state}-before.png" alt="Legacy ${state} lava creatures"><figcaption>Before — only the general-enemy hook disabled</figcaption></figure><figure><img src="${state}-after.png" alt="Pixel-art ${state} lava creatures"><figcaption>After — same combat state</figcaption></figure></div>`).join('')}
<p><a href="../underworld/index.html">Underworld gallery</a> · <a href="../player/index.html">Player controls</a></p>`);
await assertNoBrowserErrors(results);
await finish(results,browser,'lava-graphics',{ sources,ai,presentation });
