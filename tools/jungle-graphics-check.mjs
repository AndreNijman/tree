// Jungle/temple artwork: source pixels, real movement/attack states and isolation.
import { mkdirSync, writeFileSync } from 'node:fs';
import { setupAudit, check, assertNoBrowserErrors, finish } from './audit2/lib.mjs';

const { browser, page, results } = await setupAudit();
const kinds = ['junglebat','hornet','mosshornet','tortoise','flyingsnake'];
const dir = 'test-results/graphics/jungle';
mkdirSync(dir,{ recursive:true });
await page.evaluate(kinds => {
  game.paused = true; game.weather.active = false; game.event = null;
  const w = game.world, columns = [];
  for (let x = 45; x < w.W - 45; x++) if (w.biomeAt(x * TILE + 8,w.surfaceY[x] * TILE - 20) === BIOME.JUNGLE) columns.push(x);
  if (!columns.length) throw new Error('No natural jungle surface available for the review fixture');
  const tx = columns[Math.floor(columns.length / 2)], gy = w.surfaceY[tx];
  for (let x = tx - 43; x <= tx + 43; x++) {
    // Match the disposable leveled arena's surface metadata, and clear high
    // crowns too so cut-off tree remnants cannot float above the review scene.
    w.surfaceY[x] = gy;
    for (let y = Math.max(1,gy - 50); y <= gy; y++) {
      w.set(x,y,y === gy ? T.JUNGLEGRASS : T.AIR); w.setWall(x,y,WALL.NONE);
    }
  }
  window.__jungleTypes = Object.fromEntries(kinds.map((kind,i) => [kind,[E.JUNGLEBAT,E.HORNET,E.MOSSHORNET,E.GIANTTORTOSE,E.FLYINGSNAKE][i]]));
  window.__jungleOrigin = { tx,gy,x:tx * TILE + 8,y:gy * TILE - 80 };
  window.__jungleScene = function() {
    game.entities = []; game.bossBars = []; game.projectiles.list = []; game.fx = []; game.fxTexts = []; game.pickups = [];
    game.event = null; game.flashT = game.shakeT = 0;
    const p = game.player;
    p.x = __jungleOrigin.x - 120; p.y = gy * TILE - p.h / 2 - 0.01;
    p.vx = p.vy = 0; p.onGround = true; p.invuln = 999; p.hp = p.maxHp = 100; p.dying = false; p.respawnT = 0;
    game.cam.x = __jungleOrigin.x; game.cam.y = p.y - 80; game.timeOfDay = 0.5;
    document.getElementById('screenflash').style.display = 'none'; document.getElementById('deathscreen').classList.add('hidden');
    document.getElementById('message').style.display = 'none'; document.getElementById('interact').style.display = 'none';
  };
  window.__jungleEnemy = function(kind) {
    const e = spawnEntity(game,__jungleTypes[kind],__jungleOrigin.x,__jungleOrigin.y);
    if (kind === 'tortoise') { e.y = gy * TILE - e.h / 2 - 0.01; e.onGround = true; }
    return e;
  };
  window.__jungleState = function() {
    function hash(a) { let h = 2166136261; for (let i = 0; i < a.length; i++) h = Math.imul(h ^ a[i],16777619); return h >>> 0; }
    return JSON.stringify({ player:game.player,entities:game.entities,projectiles:game.projectiles.list,progress:game.bossesDefeated,
      event:game.event,hardmode:game.hardmode,eventCompletions:game.eventCompletions,fx:game.fx,texts:game.fxTexts,pickups:game.pickups,
      flash:game.flashT,tiles:hash(w.tiles),walls:hash(w.walls),hp:hash(w.hp) });
  };
  window.__jungleRender = function(e) {
    const before = __jungleState(), hook = CombatArt.drawEnemy; let calls = 0;
    CombatArt.drawEnemy = (...args) => { if (args[2] === e) calls++; return hook(...args); };
    game.cam.x = e.x; game.cam.y = e.y - 50;
    try { for (let f = 0; f < 4; f++) renderGame(game,ctx2d); } finally { CombatArt.drawEnemy = hook; }
    return { calls,unchanged:before === __jungleState() };
  };
},kinds);

const source = await page.evaluate(kinds => {
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
  const a = bytes('tortoise',0,false,false), b = bytes('tortoise',0,true,false);
  return { total,inked,crisp,margins,masks,animated,silhouettes:silhouettes.size,stable,tucked:a.some((v,i) => v !== b[i]) };
},kinds);
check(results,'All 80 jungle frame/activity/flash sources are nonempty, binary-alpha and unclipped',source.total === 80 && source.inked === 80 && source.crisp && source.margins,source);
check(results,'Five jungle enemies have five distinct silhouettes, including distinct Hornet/Moss Hornet shapes',source.silhouettes === 5);
check(results,'All jungle creatures have visible animation and alpha-preserving hit flashes',source.masks && source.animated.every(s => s.frames >= 2),source.animated);
check(results,'Tortoise has a distinct tucked charge pose without inventing new combat bodies',source.tucked);
check(results,'Jungle art regenerates deterministically after the shared cache evicts it',source.stable);

const ai = await page.evaluate(kinds => {
  const flying = [], hornets = [], charges = [], walls = [], contacts = [], kills = [];
  function stepEnemy(e) { const random = Math.random; try { Math.random = () => 0.5; enemyStep(e,game); } finally { Math.random = random; } }
  for (const kind of ['junglebat','flyingsnake']) for (const side of [-1,1]) {
    __jungleScene(); const e = __jungleEnemy(kind), x = e.x, y = e.y, bob = e.bob;
    game.player.x = e.x + side * 200; game.player.y = e.y;
    stepEnemy(e); const d = ENT_DEF[e.type];
    flying.push({ kind,side,...__jungleRender(e),motion:Math.abs(e.x - x - side * e.speed) < 0.000001 && Math.abs(e.y - y - Math.sin(bob + 0.06) * 0.8) < 0.000001,
      body:e.w === d.w && e.h === d.h && !e.segments && !e.arms,shots:game.projectiles.list.length });
  }
  for (const kind of ['hornet','mosshornet']) for (const side of [-1,1]) for (const distance of [120,200,319,321]) {
    __jungleScene(); const e = __jungleEnemy(kind), x = e.x;
    game.player.x = e.x + side * distance; game.player.y = e.y;
    stepEnemy(e); const shots = game.projectiles.list, shotAngle = Math.atan2(game.player.y - e.y,game.player.x - e.x);
    hornets.push({ kind,side,distance,...__jungleRender(e),shots:shots.length,
      correct:shots.every(p => p.type === P.STINGER && p.dmg === 22 && p.life === 3 && p.owner === 'enemy' && Math.abs(p.vx - Math.cos(shotAngle) * 3.2) < 0.000001 && Math.abs(p.vy - Math.sin(shotAngle) * 3.2) < 0.000001),
      movement:distance > 160 ? Math.abs(e.x - x - side * e.speed) < 0.000001 : Math.abs(e.vx + side * e.speed * 0.6 * 0.05) < 0.000001,
      cooldown:distance < 320 ? e.attackCd === 2.4 : e.attackCd < 0 });
    if (distance === 200) { const count = shots.length; stepEnemy(e); hornets[hornets.length - 1].noExtra = shots.length === count; }
  }
  for (const side of [-1,1]) {
    __jungleScene(); const e = __jungleEnemy('tortoise');
    game.player.x = e.x + side * 200; game.player.y = e.y; e.timer = 1;
    stepEnemy(e); const waiting = !e.chargeT && e.vx === 0;
    e.timer = 0; stepEnemy(e); const started = e.chargeT === 0.6 && e.chargeDir === side;
    const startState = __jungleRender(e); game.player.x = e.x - side * 200;
    const x = e.x; stepEnemy(e); const locked = e.chargeDir === side && Math.abs(e.x - x - side * e.speed * 4) < 0.000001;
    const charging = __jungleRender(e); let steps = 0;
    while (e.chargeT > 0 && steps++ < 60) stepEnemy(e);
    const ended = e.chargeT <= 0 && e.vx === 0;
    charges.push({ side,waiting,started,locked,ended,steps,startState,charging,recovery:__jungleRender(e),body:e.w === 32 && e.h === 20,shots:game.projectiles.list.length });
  }
  for (const kind of ['junglebat','flyingsnake']) {
    __jungleScene(); const e = __jungleEnemy(kind), w = game.world, wx = __jungleOrigin.tx + 2, wy = Math.floor(e.y / TILE);
    for (let y = wy - 1; y <= wy + 1; y++) w.set(wx,y,T.STONE);
    e.x = wx * TILE - e.w / 2 - 1; game.player.x = e.x + 200; game.player.y = e.y;
    stepEnemy(e); walls.push({ kind,blocked:e.vx === 0 && e.x + e.w / 2 <= wx * TILE,...__jungleRender(e) });
    for (let y = wy - 1; y <= wy + 1; y++) w.set(wx,y,T.AIR);
  }
  for (const kind of kinds) {
    __jungleScene(); let e = __jungleEnemy(kind);
    game.player.x = e.x + 3; game.player.y = e.y; game.player.hp = game.player.maxHp = 500; game.player.invuln = 0;
    if (kind === 'tortoise') e.timer = 10;
    const hp = game.player.hp; stepEnemy(e);
    contacts.push({ kind,damaged:game.player.hp < hp,invuln:game.player.invuln > 0,...__jungleRender(e) });
    __jungleScene(); e = __jungleEnemy(kind); hitEntity(e,1,0,0,game);
    const flash = e.flash > 0, flashed = __jungleRender(e), random = Math.random;
    try { Math.random = () => 0; hitEntity(e,e.hp + e.def + 20,0,0,game); } finally { Math.random = random; }
    const drops = game.pickups.map(p => p.item), state = __jungleState(); renderGame(game,ctx2d);
    const c = document.createElement('canvas'); c.width = c.height = 160; drawEnemy(c.getContext('2d'),e,{ x:e.x,y:e.y },160,160);
    const hidden = !c.getContext('2d').getImageData(0,0,160,160).data.some((v,i) => i % 4 === 3 && v);
    kills.push({ kind,flash,flashed,dead:e.dead,hidden,drops,unchanged:state === __jungleState() });
  }
  return { flying,hornets,charges,walls,contacts,kills };
},kinds);
for (const kind of ['junglebat','flyingsnake']) check(results,`${kind}: real bidirectional flight and single-body topology remain rendering-independent`,ai.flying.filter(s => s.kind === kind).every(s => s.calls === 4 && s.unchanged && s.motion && s.body && s.shots === 0),ai.flying.filter(s => s.kind === kind));
for (const kind of ['hornet','mosshornet']) check(results,`${kind}: real approach/retreat, 320-pixel firing limit and 22-damage stingers stay unchanged`,ai.hornets.filter(s => s.kind === kind).every(s => s.calls === 4 && s.unchanged && s.movement && s.correct && s.cooldown && s.shots === (s.distance < 320 ? 1 : 0) && (s.distance !== 200 || s.noExtra)),ai.hornets.filter(s => s.kind === kind));
check(results,'Tortoise waits, starts its real charge, locks direction and recovers normally on both sides',ai.charges.every(s => s.waiting && s.started && s.locked && s.ended && s.body && s.shots === 0 && [s.startState,s.charging,s.recovery].every(r => r.calls === 4 && r.unchanged)),ai.charges);
check(results,'Jungle Bat/Flying Snake still collide with solid terrain instead of becoming visual-only ghosts',ai.walls.every(s => s.blocked && s.calls === 4 && s.unchanged),ai.walls);
check(results,'All five real contact attacks still damage the player without drawing adding more damage',ai.contacts.every(s => s.damaged && s.invuln && s.calls === 4 && s.unchanged),ai.contacts);
const expectedDrops = { junglebat:['glowstone'],hornet:['vine'],mosshornet:['glowstone','silk'],tortoise:['turtleshell'],flyingsnake:['templebrick','glowstone','lihzahardpowercell','solartabletfragment'] };
check(results,'Real hits flash; real kills hide bodies and preserve original seeded drop branches',ai.kills.every(s => s.flash && s.flashed.calls === 4 && s.flashed.unchanged && s.dead && s.hidden && s.unchanged && expectedDrops[s.kind].every(id => s.drops.includes(id))),ai.kills);

const presentation = await page.evaluate(kinds => {
  __jungleScene(); const c = document.createElement('canvas'); c.width = c.height = 320; const ctx = c.getContext('2d');
  const facing = [];
  for (const kind of kinds) {
    const e = __jungleEnemy(kind);
    function pixels() { ctx.clearRect(0,0,320,320); CombatArt.drawEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320); return ctx.getImageData(0,0,320,320).data; }
    e.dir = -1; e.vx = 2; game.player.x = e.x + 200;
    if (kind === 'tortoise') { e.chargeT = 0.3; e.chargeDir = 1; game.player.x = e.x - 200; }
    const right = pixels(); e.dir = 1; e.vx = -2; game.player.x = e.x - 200;
    if (kind === 'tortoise') { e.chargeDir = -1; game.player.x = e.x + 200; }
    const left = pixels(); let mirror = true, distinct = false;
    for (let y = 0; y < 320; y++) for (let x = 0; x < 320; x++) for (let ch = 0; ch < 4; ch++) {
      const i = (y * 320 + x) * 4 + ch, r = (y * 320 + 319 - x) * 4 + ch;
      if (left[i] !== right[r]) mirror = false; if (left[i] !== right[i]) distinct = true;
    }
    facing.push({ kind,mirror:mirror && distinct });
  }
  ctx.translate(4,6); ctx.scale(0.7,0.8); ctx.globalAlpha = 0.6; ctx.fillStyle = '#123456'; ctx.strokeStyle = '#654321'; ctx.font = '17px serif'; ctx.textAlign = 'right'; ctx.imageSmoothingEnabled = true;
  function state() { const m = ctx.getTransform(); return JSON.stringify([m.a,m.b,m.c,m.d,m.e,m.f,ctx.globalAlpha,ctx.fillStyle,ctx.strokeStyle,ctx.lineWidth,ctx.font,ctx.textAlign,ctx.imageSmoothingEnabled,ctx.globalCompositeOperation]); }
  const before = state(), gameplay = __jungleState();
  game.entities.forEach(e => CombatArt.drawEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320));
  const restored = before === state(), unchanged = gameplay === __jungleState();
  // Ice Tortoise now has dedicated snow-batch art; other unconverted forms stay legacy.
  const fallback = [E.CAVEBAT,E.ALIENHORNET,E.WYVERN,-999].every(type => !CombatArt.drawEnemy(ctx,game,{ type },{ x:0,y:0 },320,320));
  const protectedCases = [{ boss:'future' },{ minion:'hornet' },{ ooaEnemy:true },{ ooaSentry:true }].every(flags => !CombatArt.drawEnemy(ctx,game,Object.assign({ type:E.HORNET },flags),{ x:0,y:0 },320,320));
  return { facing,restored,unchanged,fallback,protectedCases,unknown:CombatArt.enemySprite('future',0,false,false) === null };
},kinds);
check(results,'Flyers face velocity, hornets face their target and Tortoise faces locked charge direction without AI writes',presentation.facing.every(s => s.mirror),presentation.facing);
check(results,'New enemy artwork restores all context state and leaves gameplay unchanged',presentation.restored && presentation.unchanged);
check(results,'Unconverted creatures, summons, Etherian flags and unknown forms keep their existing renderers',presentation.fallback && presentation.protectedCases && presentation.unknown);

const sheet = await page.evaluate(kinds => {
  const c = document.createElement('canvas'); c.width = 1440; c.height = 760; const ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0,0,c.width,c.height); ctx.fillStyle = '#ecd49e'; ctx.font = '20px monospace'; ctx.fillText('TREE / jungle leather wings, moss armor, scutes and feathered serpent',20,30);
  kinds.forEach((kind,i) => {
    [false,true].forEach((active,row) => {
      const x = i * 288, y = 50 + row * 350;
      ctx.drawImage(CombatArt.enemySprite(kind,row ? 3 : 1,active,false),x,y,288,288);
      ctx.fillStyle = '#d9d5c4'; ctx.font = '15px monospace'; ctx.fillText(kind,x + 12,y + 306);
      ctx.fillStyle = '#9cabc6'; ctx.fillText(active ? (kind === 'tortoise' ? 'charging / tucked' : 'active / alternate flap') : 'normal',x + 12,y + 328);
    });
  });
  return c.toDataURL('image/png');
},kinds);
writeFileSync(dir + '/jungle-artwork.png',Buffer.from(sheet.split(',')[1],'base64'));
for (const active of [false,true]) {
  await page.evaluate(({ kinds,active }) => {
    __jungleScene(); const o = __jungleOrigin, p = game.player;
    p.x = o.x; p.y = o.gy * TILE - p.h / 2 - 0.01;
    kinds.forEach((kind,i) => {
      const e = __jungleEnemy(kind); e.x = o.x + [-290,-170,170,285,-65][i];
      e.y = kind === 'tortoise' ? o.gy * TILE - e.h / 2 - 0.01 : o.gy * TILE - [95,125,90,0,160][i];
      if (kind === 'tortoise') e.timer = active ? 0 : 2;
      const random = Math.random; try { Math.random = () => 0.5; enemyStep(e,game); if (kind === 'tortoise' && active) enemyStep(e,game); } finally { Math.random = random; }
    });
    game.cam.x = o.x; game.cam.y = p.y - 100;
    for (let tick = 0; tick < 10; tick++) updateProjectiles();
    p.invuln = 0; // Stable visible player pose after simulation checks/ticks.
    updateHud(); updateCrosshair(); window.__jungleHook = CombatArt.drawEnemy; CombatArt.drawEnemy = () => false; render();
  },{ kinds,active });
  const name = active ? 'charge' : 'normal';
  await page.screenshot({ path:dir + `/${name}-before.png` });
  await page.evaluate(() => { CombatArt.drawEnemy = __jungleHook; delete window.__jungleHook; render(); });
  await page.screenshot({ path:dir + `/${name}-after.png` });
}
writeFileSync(dir + '/index.html',`<!doctype html><meta charset="utf-8"><title>Jungle enemy artwork</title>
<style>body{background:#202534;color:#dedbc9;font:16px monospace;max-width:1440px;margin:24px auto;padding:0 16px}img{width:100%;image-rendering:pixelated}.row{display:flex;gap:16px}figure{margin:8px 0;flex:1}a{color:#ecd49e}</style>
<h1>Jungle enemy artwork</h1><p>Original pixel artwork; unchanged AI, simulation bodies, projectile rules and drops.</p><img src="jungle-artwork.png" alt="Jungle Bat, Hornet, Moss Hornet, Giant Tortoise and Flying Snake source artwork">
${['normal','charge'].map(state => `<h2>${state} fixture</h2><p>Real spawns/AI in a cleared natural jungle, followed by ten projectile ticks; positions and readiness are display fixtures.</p><div class="row"><figure><img src="${state}-before.png" alt="Legacy ${state} jungle enemies"><figcaption>Before — only the new enemy hook disabled</figcaption></figure><figure><img src="${state}-after.png" alt="Pixel-art ${state} jungle enemies"><figcaption>After — same combat state</figcaption></figure></div>`).join('')}
<p><a href="../etherian/index.html">Etherian gallery</a> · <a href="../player/index.html">Player controls/animations</a></p>`);
await assertNoBrowserErrors(results);
await finish(results,browser,'jungle-graphics',{ source,ai,presentation });
