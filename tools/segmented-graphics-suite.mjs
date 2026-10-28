// Original segmented enemy art, authoritative topology/AI and read-only rendering.
import { mkdirSync, writeFileSync } from 'node:fs';
import { setupAudit, check, assertNoBrowserErrors, finish } from './audit2/lib.mjs';

export async function runSegmentedGraphicsCheck({ name, title, roster }) {
const { browser, page, results } = await setupAudit();
const kinds = roster.map(s => s.kind), counts = roster.map(s => s.count).join('/');
const dir = 'test-results/graphics/' + name;
mkdirSync(dir,{ recursive:true });
await page.evaluate(roster => {
  game.paused = true; game.weather.active = false; game.event = null;
  const w = game.world, tx = Math.floor(w.spawnX / TILE), gy = Math.min(w.H - 10,w.hellY + 12);
  for (let x = tx - 43; x <= tx + 43; x++) {
    for (let y = gy - 35; y < gy; y++) { w.set(x,y,T.AIR); w.setWall(x,y,WALL.CAVE); }
    w.set(x,gy,T.ASH); if ((x - tx) % 6 === 0) { w.set(x,gy - 4,T.TORCH); w.set(x,gy - 14,T.TORCH); }
  }
  window.__segTypes = Object.fromEntries(roster.map(s => [s.kind,E[s.type]]));
  window.__segCounts = Object.fromEntries(roster.map(s => [s.kind,s.count]));
  window.__segOrigin = { tx,gy,x:tx * TILE + 8,y:gy * TILE - 160 };
  window.__segScene = function(hardmode = true) {
    game.entities = []; game.bossBars = []; game.projectiles.list = []; game.fx = []; game.fxTexts = []; game.pickups = [];
    game.event = null; game.flashT = game.shakeT = 0; game.hardmode = hardmode;
    const p = game.player; p.x = __segOrigin.x - 120; p.y = gy * TILE - p.h / 2 - 0.01;
    p.vx = p.vy = 0; p.onGround = true; p.invuln = 999; p.hp = p.maxHp = 100; p.dying = false; p.respawnT = 0;
    game.cam.x = __segOrigin.x; game.cam.y = p.y - 90; game.timeOfDay = 0.5;
    document.getElementById('screenflash').style.display = 'none'; document.getElementById('deathscreen').classList.add('hidden');
    document.getElementById('message').style.display = 'none'; document.getElementById('interact').style.display = 'none';
  };
  window.__segEnemy = function(kind) {
    const e = spawnEntity(game,__segTypes[kind],__segOrigin.x,__segOrigin.y);
    initSegments(e,game,__segCounts[kind],e.color); return e;
  };
  window.__segTerrain = function() {
    function hash(a) { let h = 2166136261; for (let i = 0; i < a.length; i++) h = Math.imul(h ^ a[i],16777619); return h >>> 0; }
    return [w.tiles,w.walls,w.hp,w.surfaceY].map(hash);
  };
  window.__segState = function() {
    return JSON.stringify({ player:game.player,entities:game.entities,projectiles:game.projectiles.list,bars:game.bossBars,progress:game.bossesDefeated,
      event:game.event,hardmode:game.hardmode,eventCompletions:game.eventCompletions,fx:game.fx,texts:game.fxTexts,pickups:game.pickups,
      flash:game.flashT,terrain:__segTerrain() });
  };
  window.__segRender = function(e) {
    const before = __segState(), hook = CombatArt.drawSegmentedEnemy; let calls = 0;
    CombatArt.drawSegmentedEnemy = (...args) => { if (args[2] === e) calls++; return hook(...args); };
    game.cam.x = e.x; game.cam.y = e.y - 50;
    try { for (let f = 0; f < 4; f++) renderGame(game,ctx2d); } finally { CombatArt.drawSegmentedEnemy = hook; }
    return { calls,unchanged:before === __segState() };
  };
},roster);

const sources = await page.evaluate(kinds => {
  const bytes = (k,p,f,flash,h) => CombatArt.segmentedSprite(k,p,f,flash,h).getContext('2d').getImageData(0,0,64,64).data;
  let total = 0, inked = 0, crisp = true, margins = true, masks = true;
  const animated = [], heads = new Set(), bodies = new Set(), tails = new Set();
  for (const kind of kinds) for (const part of ['head','body','tail']) {
    const frames = new Set();
    for (let heading = 0; heading < 16; heading++) for (let f = 0; f < 4; f++) {
      const a = bytes(kind,part,f,false,heading), b = bytes(kind,part,f,true,heading); let ink = false;
      for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) {
        const i = (y * 64 + x) * 4, alpha = a[i + 3];
        if (alpha) { ink = true; if (x < 2 || y < 2 || x >= 62 || y >= 62) margins = false; }
        if ((alpha !== 0 && alpha !== 255) || (b[i + 3] !== 0 && b[i + 3] !== 255)) crisp = false;
        if (alpha !== b[i + 3] || (alpha && (b[i] !== 255 || b[i + 1] !== 245 || b[i + 2] !== 220))) masks = false;
      }
      total += 2; if (ink) inked += 2; if (!heading) frames.add(Array.from(a).join(','));
    }
    animated.push({ kind,part,frames:frames.size });
    const mask = Array.from(bytes(kind,part,0,false,0)).filter((v,i) => i % 4 === 3).join(',');
    (part === 'head' ? heads : part === 'body' ? bodies : tails).add(mask);
  }
  const saved = kinds.map(k => Array.from(bytes(k,'head',0,false,3)));
  for (const kind of ['kingslime','eyeofcthulhu','brainofcthulhu','queenbee','skeletron','wallofflesh','retinazer','spazmatism','destroyer','skelprime','queenslime','plantera','golem','duke','empress','moonlord','cultist']) {
    for (const phase of [false,true]) for (let f = 0; f < 4; f++) for (const flash of [false,true]) CombatArt.bossSprite(kind,phase,f,flash);
  }
  return { total,inked,crisp,margins,masks,animated,heads:heads.size,bodies:bodies.size,tails:tails.size,
    stable:kinds.every((k,i) => bytes(k,'head',0,false,3).every((v,n) => v === saved[i][n])) };
},kinds);
const variants = kinds.length * 384;
check(results,`All ${variants} part/frame/flash/heading variants are nonempty and unclipped`,sources.total === variants && sources.inked === variants && sources.margins,sources);
check(results,'All sixteen headings retain binary alpha and exact flash masks',sources.crisp && sources.masks);
check(results,'Every head, body and tail animates and has species-distinct silhouettes',sources.animated.every(s => s.frames >= 2) && sources.heads === kinds.length && sources.bodies === kinds.length && sources.tails === kinds.length,sources.animated);
check(results,'Segmented sprites regenerate deterministically after bounded shared-cache eviction',sources.stable);

const spawns = await page.evaluate(kinds => {
  const rows = [];
  for (const kind of kinds) {
    __segScene(); const pick = pickEnemy, random = Math.random;
    try { pickEnemy = () => __segTypes[kind]; Math.random = () => 0.5; initialSpawns(); } finally { pickEnemy = pick; Math.random = random; }
    const count = __segCounts[kind];
    rows.push({ kind,spawned:game.entities.length,correct:game.entities.every(e => e.type === __segTypes[kind] && e.segments.length === count &&
      e.segments.every((s,i) => s.x === e.x - 14 * (i + 1) && s.y === e.y && s.hp === e.maxHp / 3 && s.w === e.w * 0.8 && s.h === e.h * 0.8 && s.segmentIndex === i && !s.dead)) });
  }
  return rows;
},kinds);
check(results,`Real initial spawns retain ${counts} original segment records, HP and dimensions`,spawns.every(s => s.spawned === 3 && s.correct),spawns);

const ai = await page.evaluate(kinds => {
  const movement = [], walls = [], contacts = [], targets = [], kills = [];
  const near = (a,b) => Math.abs(a - b) < 0.000001;
  for (const kind of kinds) for (const hardmode of [false,true]) for (const side of [-1,1]) for (const vertical of [-90,0,90]) {
    __segScene(hardmode); const e = __segEnemy(kind), x = e.x, y = e.y;
    game.player.x = e.x + side * 200; game.player.y = e.y + vertical;
    const angle = Math.atan2(vertical,side * 200) + Math.sin(0.05) * 0.35;
    enemyStep(e,game);
    let prev = e;
    const spacing = e.segments.every(s => { const correct = near(Math.hypot(s.x - prev.x,s.y - prev.y),14); prev = s; return correct; });
    movement.push({ kind,hardmode,side,vertical,...__segRender(e),spacing,
      correct:near(e.wave,0.05) && near(e.x - x,Math.cos(angle) * e.speed) && near(e.y - y,Math.sin(angle) * e.speed),
      body:e.w === ENT_DEF[e.type].w && e.h === ENT_DEF[e.type].h && e.segments.length === __segCounts[kind],noShots:game.projectiles.list.length === 0 });
  }
  for (const kind of kinds) for (const side of [-1,1]) {
    __segScene(); const e = __segEnemy(kind), w = game.world, tx = Math.floor(e.x / TILE), ty = Math.floor(e.y / TILE), original = [];
    for (let x = tx - 4; x <= tx + 4; x++) for (let y = ty - 3; y <= ty + 3; y++) { original.push([x,y,w.get(x,y)]); w.set(x,y,T.HELLBRICK); }
    const terrain = JSON.stringify(__segTerrain()), x = e.x; game.player.x = e.x + side * 200; game.player.y = e.y;
    for (let t = 0; t < 12; t++) enemyStep(e,game);
    walls.push({ kind,side,...__segRender(e),passes:(e.x - x) * side > e.speed * 8,unchangedTerrain:terrain === JSON.stringify(__segTerrain()) });
    original.forEach(([x,y,t]) => w.set(x,y,t));
  }
  for (const kind of kinds) {
    for (const where of ['head','body','deadbody']) {
      __segScene(); const e = __segEnemy(kind), p = game.player; p.hp = p.maxHp = 500; p.invuln = 0;
      if (where === 'head') {
        p.x = e.x + 3; p.y = e.y;
        if (kind === 'wyvern') e.segments.forEach(s => { s.dead = true; });
      }
      else {
        // Isolate the fourth contact record: dead neighbors still follow, as in AI.
        e.segments.forEach(s => { s.dead = true; });
        const s = e.segments[3]; s.dead = where === 'deadbody'; p.x = s.x; p.y = s.y;
      }
      enemyStep(e,game);
      const harmless = where === 'deadbody' || kind === 'wyvern' && where === 'head';
      contacts.push({ kind,where,...__segRender(e),correct:harmless ? p.hp === 500 : p.hp < 500 && p.invuln > 0 });
    }
    for (const where of ['head','body']) {
      __segScene(); const e = __segEnemy(kind);
      // These ordinary bodies deal contact damage but are not separate attack targets.
      e.segments.forEach((s,i) => { s.x = e.x - 80 - i * 40; s.y = e.y; });
      const target = where === 'head' ? e : e.segments[2], hp = e.hp, bodyHp = e.segments.map(s => s.hp);
      const p = { x:target.x,y:target.y,vx:0,vy:0,dmg:2,owner:'player',type:P.ARROW,life:1,pierce:1,dead:false };
      const hit = projHitEnemy(p,p.x - 3,p.y);
      targets.push({ kind,where,...__segRender(e),correct:where === 'head' ? hit && e.hp < hp : !hit && e.hp === hp,
        bodyHp:e.segments.every((s,i) => s.hp === bodyHp[i]) });
    }
    for (const hardmode of [false,true]) for (const roll of [0.001,0.1,0.15,0.4,0.499,0.5,0.9]) {
      __segScene(hardmode); const e = __segEnemy(kind), terrain = JSON.stringify(__segTerrain()), random = Math.random;
      hitEntity(e,1,0,0,game); const flash = e.flash > 0, flashed = __segRender(e);
      try { Math.random = () => roll; hitEntity(e,e.hp + e.def + 20,0,0,game); } finally { Math.random = random; }
      const material = game.pickups.reduce((d,p) => { if (!['coin','silvercoin','goldcoin','platinumcoin'].includes(p.item) && p.count > 0) d[p.item] = (d[p.item] || 0) + p.count; return d; },{});
      let expected = kind === 'boneserpent' ? { [I.HELLSTONE]:2,[I.OBSIDIAN]:1 } : kind === 'giantworm' && roll < 0.15 ? { [I.HEALINGPOTION]:1 } : {};
      if (kind === 'wyvern') expected = { [I.SOUL_FLIGHT]:2,[I.SOUL_LIGHT]:1,[I.SOUL_NIGHT]:1,[I.FEATHER]:2 };
      if (kind === 'worldfeeder') { if (roll < 0.5) expected[I.VINE] = 1; if (roll < 0.4) expected[I.JUNGLE_SPORES] = 1; }
      // Giant Worm's existing extended rare table remains part of the real kill.
      for (const drop of B83_ENEMY_DROPS[e.name] || []) if (roll < drop.rate) expected[drop.id] = (expected[drop.id] || 0) + 1;
      const before = __segState(), c = document.createElement('canvas'); c.width = c.height = 320;
      drawEnemy(c.getContext('2d'),e,{ x:e.x,y:e.y },320,320); renderGame(game,ctx2d);
      kills.push({ kind,hardmode,roll,material,expected,correct:JSON.stringify(material) === JSON.stringify(expected),flash,flashed,dead:e.dead,
        hidden:!c.getContext('2d').getImageData(0,0,320,320).data.some((v,i) => i % 4 === 3 && v),unchanged:before === __segState(),
        terrain:terrain === JSON.stringify(__segTerrain()),noChildren:game.entities.length === 1 });
    }
  }
  return { movement,walls,contacts,targets,kills };
},kinds);
for (const kind of kinds) check(results,`${kind}: real sinusoidal pursuit, original speed/topology, 14px spacing and read-only hook`,ai.movement.filter(s => s.kind === kind).every(s => s.correct && s.spacing && s.body && s.calls === 4 && s.unchanged && s.noShots),ai.movement.filter(s => s.kind === kind));
check(results,'All roster creatures still pass through solid terrain without mining it',ai.walls.every(s => s.passes && s.unchangedTerrain && s.calls === 4 && s.unchanged),ai.walls);
check(results,'Real head/body contact rules (including Wyvern head exclusion) and dead-body exclusion remain intact',ai.contacts.every(s => s.correct && s.calls === 4 && s.unchanged),ai.contacts);
check(results,'Ordinary projectile attacks keep their existing root-only target model',ai.targets.every(s => s.correct && s.bodyHp && s.calls === 4 && s.unchanged),ai.targets);
check(results,'Real hits/kills preserve exact seeded material tables and hidden whole corpses',ai.kills.every(s => s.correct && s.flash && s.flashed.calls === 4 && s.flashed.unchanged && s.dead && s.hidden && s.unchanged && s.terrain && s.noChildren),ai.kills.filter(s => !s.correct));

const presentation = await page.evaluate(kinds => {
  __segScene(); const c = document.createElement('canvas'); c.width = c.height = 320; const ctx = c.getContext('2d');
  const anchors = [], dead = [], offscreen = [], specials = [], packets = [];
  function capture(e,cam = { x:e.x,y:e.y }) {
    ctx.clearRect(0,0,320,320); const original = ctx.drawImage, calls = [];
    ctx.drawImage = function(sprite,x,y) { calls.push({ sprite,x,y }); return original.call(ctx,sprite,x,y); };
    try { drawEnemy(ctx,e,cam,320,320); } finally { ctx.drawImage = original; }
    return calls;
  }
  for (const kind of kinds) {
    __segScene(); const e = __segEnemy(kind); game.player.x = e.x + 200; game.player.y = e.y - 60;
    for (let tick = 0; tick < 15; tick++) enemyStep(e,game);
    const calls = capture(e), frame = Math.floor(Time.seconds * 8) % 4;
    const expected = e.segments.map((s,i) => {
      const prev = i ? e.segments[i - 1] : e, h = (Math.round(Math.atan2(prev.y - s.y,prev.x - s.x) * 8 / Math.PI) + 16) % 16;
      return { sprite:CombatArt.segmentedSprite(kind,i === e.segments.length - 1 ? 'tail' : 'body',frame,false,h),x:Math.round(s.x - e.x + 160) - 32,y:Math.round(s.y - e.y + 160) - 32 };
    }).reverse();
    const headH = (Math.round(Math.atan2(e.vy,e.vx) * 8 / Math.PI) + 16) % 16;
    expected.push({ sprite:CombatArt.segmentedSprite(kind,'head',frame,false,headH),x:128,y:128 });
    anchors.push({ kind,exact:calls.length === expected.length && calls.every((s,i) => s.sprite === expected[i].sprite && s.x === expected[i].x && s.y === expected[i].y) });
    e.segments[1].dead = true; e.segments[e.segments.length - 1].dead = true;
    const aliveCalls = capture(e);
    dead.push({ kind,count:aliveCalls.length === e.segments.length - 1,noTail:!aliveCalls.some(s => s.sprite === expected[0].sprite),
      noBridge:aliveCalls.length === e.segments.filter(s => !s.dead).length + 1 });
    e.segments.forEach(s => { s.dead = false; }); e.flash = 0.1;
    function white(sprite) {
      const pixels = sprite.getContext('2d').getImageData(0,0,64,64).data;
      return pixels.every((v,i) => !pixels[i - i % 4 + 3] || v === [255,245,220,255][i % 4]);
    }
    const rootFlash = capture(e).every(s => white(s.sprite));
    e.flash = 0; e.segments[2].flash = 0.08;
    const localCalls = capture(e), segmentFlash = localCalls.every((s,i) => white(s.sprite) === (i === e.segments.length - 1 - 2));
    e.segments[2].flash = 0; e.vx = e.vy = 0;
    const originalSegments = e.segments; delete e.segments; e.dir = -1;
    const single = capture(e), headOnly = single.length === 1 && single[0].sprite === CombatArt.segmentedSprite(kind,'head',frame,false,8);
    e.segments = originalSegments; e.segments[0].x = e.x + 14; e.segments[0].y = e.y;
    const stationaryCalls = capture(e), stationary = stationaryCalls[stationaryCalls.length - 1].sprite === CombatArt.segmentedSprite(kind,'head',frame,false,8);
    specials.push({ kind,rootFlash,segmentFlash,headOnly,stationary });
    e.segments[1].dead = true;
    const packet = JSON.parse(JSON.stringify(Net.entityState(e))); game.entities = [];
    Net.applyEntities([packet]); const remote = game.entities[0], beforePacket = __segState(), remoteCalls = capture(remote);
    packets.push({ kind,readonly:beforePacket === __segState(),count:remoteCalls.length === remote.segments.filter(s => !s.dead).length + 1,
      noIndex:remote.segments.every(s => s.segmentIndex === undefined),same:remote.x === packet.x && remote.y === packet.y && remote.segments.every((s,i) => s.x === packet.segments[i].x && s.y === packet.segments[i].y) });
    game.entities = [e];
    // Explicit viewport fixture: head outside the old 80px cull; tail still visible.
    e.x = 0; e.y = 0; e.vx = 3; e.vy = 0;
    e.segments.forEach((s,i) => { s.x = -32 * (i + 1); s.y = 0; s.dead = false; });
    const cam = { x:-245,y:0 }, visibleCalls = capture(e,cam);
    const ink = ctx.getImageData(0,0,320,320).data.some((v,i) => i % 4 === 3 && v);
    let renderCalls = 0, hook = CombatArt.drawSegmentedEnemy;
    CombatArt.drawSegmentedEnemy = (...args) => { renderCalls++; return hook(...args); };
    game.cam.x = cam.x; game.cam.y = cam.y;
    try { renderGame(game,ctx2d); } finally { CombatArt.drawSegmentedEnemy = hook; }
    offscreen.push({ kind,visible:ink && visibleCalls.length > 0 && visibleCalls.some(s => s.x < 320),integrated:renderCalls > 0 });
  }
  ctx.translate(4,6); ctx.scale(0.7,0.8); ctx.globalAlpha = 0.6; ctx.fillStyle = '#123456'; ctx.strokeStyle = '#654321'; ctx.font = '17px serif'; ctx.textAlign = 'right'; ctx.imageSmoothingEnabled = true;
  function state() { const m = ctx.getTransform(); return JSON.stringify([m.a,m.b,m.c,m.d,m.e,m.f,ctx.globalAlpha,ctx.fillStyle,ctx.strokeStyle,ctx.lineWidth,ctx.font,ctx.textAlign,ctx.imageSmoothingEnabled,ctx.globalCompositeOperation]); }
  const before = state(), gameplay = __segState(), random = Math.random; let rng = 0;
  try { Math.random = () => { rng++; return 0.5; }; game.entities.forEach(e => CombatArt.drawSegmentedEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320)); } finally { Math.random = random; }
  const restored = before === state(), unchanged = gameplay === __segState();
  const fallback = [E.DEVOURER,E.CRAWLTIPEDE,E.ICEGOLEM,-999].every(type => !CombatArt.drawSegmentedEnemy(ctx,game,{ type },{ x:0,y:0 },320,320));
  const protectedCases = [{ boss:'destroyer' },{ minion:'dragon' },{ ooaEnemy:true },{ ooaSentry:true }].every(flags => !CombatArt.drawSegmentedEnemy(ctx,game,Object.assign({ type:E.BONESERPENT },flags),{ x:0,y:0 },320,320));
  return { anchors,dead,specials,packets,offscreen,restored,unchanged,rng,fallback,protectedCases };
},kinds);
check(results,'Every live part uses exact simulation coordinates, link heading and tail identity',presentation.anchors.every(s => s.exact),presentation.anchors);
check(results,'Dead middle/tail records stay hidden with no replacement or bridge parts',presentation.dead.every(s => s.count && s.noTail && s.noBridge),presentation.dead);
check(results,'Root/local flashes, head-only records and stationary facing preserve existing state',presentation.specials.every(s => s.rootFlash && s.segmentFlash && s.headOnly && s.stationary),presentation.specials);
check(results,'Real serialized network segments render without adding indices or changing received coordinates',presentation.packets.every(s => s.readonly && s.count && s.noIndex && s.same),presentation.packets);
check(results,'Visible bodies survive offscreen-head culling through the real renderer',presentation.offscreen.every(s => s.visible && s.integrated),presentation.offscreen);
check(results,'Segmented artwork restores context, consumes no RNG and preserves gameplay',presentation.restored && presentation.unchanged && presentation.rng === 0);
check(results,'Unconverted worms, deferred Ice Golem, bosses and summons retain legacy branches',presentation.fallback && presentation.protectedCases);

const sheet = await page.evaluate(({ kinds,title }) => {
  const c = document.createElement('canvas'); c.width = kinds.length * 288; c.height = 740; const ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0,0,c.width,c.height); ctx.fillStyle = '#ecd49e'; ctx.font = '19px monospace'; ctx.fillText('TREE / ' + title,20,30);
  kinds.forEach((kind,i) => {
    const x = i * 288;
    ctx.fillStyle = '#ddd5c1'; ctx.font = '17px monospace'; ctx.fillText(kind,x + 15,65);
    ['head','body','tail'].forEach((part,row) => {
      ctx.drawImage(CombatArt.segmentedSprite(kind,part,row,false,0),x + 48,80 + row * 150,192,192);
      ctx.fillStyle = '#a7b3c9'; ctx.font = '14px monospace'; ctx.fillText(part,x + 15,140 + row * 150);
    });
    for (let h = 0; h < 4; h++) ctx.drawImage(CombatArt.segmentedSprite(kind,'head',0,false,h * 4),x + h * 64 + 16,620);
    ctx.fillStyle = '#a7b3c9'; ctx.fillText('16 cached pixel headings',x + 15,715);
  }); return c.toDataURL('image/png');
},{ kinds,title });
writeFileSync(dir + '/segmented-artwork.png',Buffer.from(sheet.split(',')[1],'base64'));
for (const turning of [false,true]) {
  await page.evaluate(({ kinds,turning }) => {
    __segScene(); const o = __segOrigin, p = game.player;
    kinds.forEach((kind,i) => {
      const e = __segEnemy(kind), dx = (kinds.length === 4 ? [-280,-90,110,300] : [-260,0,260])[i], dy = i % 2 ? -60 : 40;
      e.x += dx; e.y += dy; e.segments.forEach(s => { s.x += dx; s.y += dy; });
      p.x = e.x + 150; p.y = e.y - 30;
      for (let f = 0; f < (turning ? 32 : 1); f++) { if (turning && f === 18) { p.x = e.x - 60; p.y = e.y + 100; } enemyStep(e,game); }
    });
    p.x = o.x; p.y = o.gy * TILE - p.h / 2 - 0.01; game.cam.x = o.x; game.cam.y = p.y - 100; p.invuln = 0;
    updateHud(); updateCrosshair(); window.__segHook = CombatArt.drawSegmentedEnemy; CombatArt.drawSegmentedEnemy = () => false; render();
  },{ kinds,turning });
  const name = turning ? 'turning' : 'normal'; await page.screenshot({ path:dir + `/${name}-before.png` });
  await page.evaluate(() => { CombatArt.drawSegmentedEnemy = __segHook; delete window.__segHook; render(); });
  await page.screenshot({ path:dir + `/${name}-after.png` });
}
writeFileSync(dir + '/index.html',`<!doctype html><meta charset="utf-8"><title>${title} artwork</title>
<style>body{background:#202534;color:#dedbc9;font:16px monospace;max-width:1280px;margin:24px auto;padding:0 16px}img{width:100%;image-rendering:pixelated}.row{display:flex;gap:16px}figure{margin:8px 0;flex:1}a{color:#ecd49e}</style>
<h1>${title} artwork</h1><p>Original head/body/tail pixel art. Live positions, counts, dimensions, contact rules, root-only attack targeting and drops are unchanged.</p><img src="segmented-artwork.png" alt="${kinds.join(', ')} parts">
${['normal','turning'].map(state => `<h2>${state}</h2><p>Real AI in a dry Underworld review room: ${state === 'normal' ? 'one' : '32'} ticks. Biome-independent positions, temporary player targets, room/torches, fixed readiness and nonlethal HP are disposable fixtures. Initializer creates the existing ${counts} body records.</p><div class="row"><figure><img src="${state}-before.png" alt="Legacy ${state} worms"><figcaption>Before — only the segmented artwork hook disabled</figcaption></figure><figure><img src="${state}-after.png" alt="Pixel-art ${state} worms"><figcaption>After — same combat state</figcaption></figure></div>`).join('')}
<p><a href="../lava/index.html">Lava gallery</a> · <a href="../underworld/index.html">Underworld gallery</a></p>`);
await assertNoBrowserErrors(results);
await finish(results,browser,name + '-graphics',{ sources,spawns,ai,presentation });
}
