// Original Etherian troop artwork, with real event AI and read-only render checks.
import { mkdirSync, writeFileSync } from 'node:fs';
import { setupAudit, check, assertNoBrowserErrors, finish } from './audit2/lib.mjs';

const { browser, page, results } = await setupAudit();
const kinds = ['goblin','bomber','javelin','kobold','glider','witherbeast','drakin','wyvern','skeleton','lightningbug'];
const dir = 'test-results/graphics/etherian';
mkdirSync(dir,{ recursive:true });
await page.evaluate(kinds => {
  game.paused = true; game.weather.active = false;
  const w = game.world, tx = Math.floor(w.spawnX / TILE), gy = w.surfaceY[tx];
  for (let x = tx - 45; x <= tx + 45; x++) for (let y = gy - 25; y <= gy; y++) { w.set(x,y,y === gy ? T.STONE : T.AIR); w.setWall(x,y,WALL.NONE); }
  w.set(tx,gy - 1,T.ETERNIASTAND);
  const types = [E.ETHERIANGOBLIN,E.ETHERIANGOBLINBOMBER,E.ETHERIANJAVELIN,E.KOBOLD,E.KOBOLDGLIDER,
    E.WITHERBEAST,E.DRAKIN,E.ETHERIANWYVERN,E.OLDONESSKELETON,E.ETHERIANLIGHTNINGBUG];
  window.__troopTypes = Object.fromEntries(kinds.map((kind,i) => [kind,types[i]]));
  window.__troopOrigin = { tx,gy };
  window.__troopScene = function(tier) {
    game.entities = []; game.bossBars = []; game.projectiles.list = []; game.fx = []; game.fxTexts = []; game.pickups = [];
    const progress = game.bossesDefeated;
    game.bossesDefeated = Object.assign({},progress,{ golem:tier === 3,twins:tier === 2,destroyer:false,skelprime:false });
    try { startOldOnesArmy(tx,gy - 1); } finally { game.bossesDefeated = progress; }
    game.flashT = 0; game.shakeT = 0;
    document.getElementById('screenflash').style.display = 'none';
    document.getElementById('deathscreen').classList.add('hidden');
    document.getElementById('message').style.display = 'none'; document.getElementById('interact').style.display = 'none';
    game.event.state = 'fighting'; game.event.pending = 0; game.event.etherianMana = 25;
    game.player.x = game.event.crystalX - 80; game.player.y = gy * TILE - game.player.h / 2 - 0.01;
    game.player.vx = game.player.vy = 0; game.player.onGround = true; game.player.invuln = 999; game.player.dying = false;
    game.player.hp = game.player.maxHp = 100; game.player.respawnT = 0;
    game.cam.x = game.event.crystalX; game.cam.y = game.player.y - 72;
    game.timeOfDay = 0.5;
    return game.event;
  };
  window.__troopState = function() {
    function hash(a) { let h = 2166136261; for (let i = 0; i < a.length; i++) h = Math.imul(h ^ a[i],16777619); return h >>> 0; }
    return JSON.stringify({ player:game.player,entities:game.entities,projectiles:game.projectiles.list,event:game.event,
      progress:game.bossesDefeated,hardmode:game.hardmode,eventCompletions:game.eventCompletions,
      pickups:game.pickups,texts:game.fxTexts,fx:game.fx,flash:game.flashT,tiles:hash(w.tiles),walls:hash(w.walls),hp:hash(w.hp) });
  };
  window.__renderTroopState = function(e) {
    const before = __troopState(), hook = CombatArt.drawOOAEnemy;
    let calls = 0;
    CombatArt.drawOOAEnemy = (...args) => { if (args[2] === e) calls++; return hook(...args); };
    const c = document.createElement('canvas'); c.width = c.height = 160;
    const drawn = CombatArt.drawOOAEnemy(c.getContext('2d'),game,e,{ x:e.x,y:e.y },160,160);
    try { for (let f = 0; f < 4; f++) renderGame(game,ctx2d); }
    finally { CombatArt.drawOOAEnemy = hook; }
    return { drawn,calls,unchanged:before === __troopState() };
  };
},kinds);

const sources = await page.evaluate(kinds => {
  function bytes(kind,frame,flash,active) { const c = CombatArt.etherianSprite(kind,frame,flash,active); return c.getContext('2d').getImageData(0,0,96,96).data; }
  let total = 0, inked = 0, binary = true, margins = true, masks = true;
  const animated = [], silhouettes = new Set();
  for (const kind of kinds) {
    const signatures = new Set();
    for (const active of [false,true]) for (let f = 0; f < 4; f++) {
      const normal = bytes(kind,f,false,active), flash = bytes(kind,f,true,active);
      let ink = false;
      for (let y = 0; y < 96; y++) for (let x = 0; x < 96; x++) {
        const i = (y * 96 + x) * 4, a = normal[i + 3];
        if (a) { ink = true; if (x < 2 || y < 2 || x >= 94 || y >= 94) margins = false; }
        if ((a !== 0 && a !== 255) || (flash[i + 3] !== 0 && flash[i + 3] !== 255)) binary = false;
        if (flash[i + 3] !== a || (a && (flash[i] !== 255 || flash[i + 1] !== 245 || flash[i + 2] !== 220))) masks = false;
      }
      total += 2; if (ink) inked += 2;
      if (!active) signatures.add(Array.from(normal).join(','));
    }
    animated.push({ kind,frames:signatures.size });
    silhouettes.add(Array.from(bytes(kind,0,false,false)).filter((v,i) => i % 4 === 3).join(','));
  }
  const original = kinds.map(kind => Array.from(bytes(kind,0,false,false)));
  for (const boss of ['kingslime','eyeofcthulhu','brainofcthulhu','queenbee','skeletron','wallofflesh','retinazer','spazmatism','destroyer','skelprime','queenslime','plantera','golem','duke','empress','moonlord','cultist']) {
    for (const phase of [false,true]) for (let f = 0; f < 4; f++) for (const flash of [false,true]) CombatArt.bossSprite(boss,phase,f,flash);
  }
  const stable = kinds.every((kind,i) => bytes(kind,0,false,false).every((v,n) => v === original[i][n]));
  const attacks = ['javelin','witherbeast','drakin','lightningbug'].map(kind => {
    const ready = bytes(kind,0,false,false), active = bytes(kind,0,false,true);
    return { kind,distinct:ready.some((v,i) => v !== active[i]) };
  });
  return { total,inked,binary,margins,masks,animated,silhouettes:silhouettes.size,stable,attacks };
},kinds);
check(results,'All 160 Etherian source/frame/flash/activity variants have nonempty, crisp, unclipped artwork',sources.total === 160 && sources.inked === 160 && sources.binary && sources.margins,sources);
check(results,'All ten troops have distinct silhouettes, not merely palette swaps',sources.silhouettes === 10);
check(results,'Every troop has visible animated frames',sources.animated.every(s => s.frames >= 2),sources.animated);
check(results,'Troop hit flashes recolor the exact alpha silhouette without adding hitbox-like glow',sources.masks);
check(results,'All four shooters have distinct cooldown/activity details',sources.attacks.every(s => s.distinct),sources.attacks);
check(results,'Troop sprites regenerate deterministically after shared-cache eviction',sources.stable);

const simulation = await page.evaluate(kinds => {
  const states = [], objectives = [], contacts = [], kills = [], stopped = [];
  const shooter = { javelin:P.ARROW,witherbeast:P.ARROW,drakin:P.FIREBALL,lightningbug:P.LASER };
  const cooldown = { javelin:2,witherbeast:2,drakin:1.2,lightningbug:1 };
  for (const kind of kinds) {
    for (const tier of [1,2,3]) for (const side of [-1,1]) {
      __troopScene(tier); const ev = game.event, e = spawnEtherianEnemy(__troopTypes[kind],side), d = ENT_DEF[e.type];
      const spawnX = side < 0 ? ev.leftPortalX : ev.rightPortalX;
      const anchors = e.x === spawnX && e.y === ev.portalY - (e.fly ? 70 : 0);
      if (!e.fly) { e.y = __troopOrigin.gy * TILE - e.h / 2 - 0.01; e.onGround = true; }
      game.player.x = e.x + side * 80; game.player.y = e.y;
      game.cam.x = e.x; game.cam.y = e.y - 40;
      const x = e.x, y = e.y, hp = ev.crystalHp, random = Math.random;
      try { Math.random = () => 0.999; enemyStep(e,game); } finally { Math.random = random; }
      const rendered = __renderTroopState(e), shots = game.projectiles.list;
      const baseHp = Math.round(Math.round(d.hp * diffScale().hp) * (1 + (tier - 1) * 0.35));
      const baseDmg = Math.round(Math.round(d.dmg * diffScale().dmg) * (1 + (tier - 1) * 0.2));
      states.push({ kind,tier,side,anchors,...rendered,flags:e.ooaEnemy && e.eventEnemy && e.ooaTier === tier && e.ooaSide === side,
        dimensions:e.w === d.w && e.h === d.h,hp:e.hp === baseHp && e.maxHp === baseHp,dmg:e.dmg === baseDmg,
        facing:e.dir === -side,moved:e.x !== x || e.y !== y,
        motion:e.fly ? Math.abs(Math.hypot(e.x - x,e.y - y) - e.speed) < 0.000001 : Math.abs(e.x - x + side * e.speed) < 0.000001,
        shots:shots.length,shotFlags:shots.every(p => p.ooaProjectile && p.owner === 'enemy' && p.life === 4 && p.type === shooter[kind] && p.dmg === Math.round(e.dmg * 0.55)),
        cooldown:shooter[kind] === undefined || e.attackCd === cooldown[kind],crystal:ev.crystalHp === hp });
    }
    for (const tier of [1,2,3]) {
      __troopScene(tier); const ev = game.event, e = spawnEtherianEnemy(__troopTypes[kind],1);
      e.x = ev.crystalX + 20; e.y = ev.crystalY; e.attackCd = 0;
      game.player.x = ev.crystalX + 700; game.player.y = ev.crystalY;
      const hp = ev.crystalHp, mana = ev.etherianMana, random = Math.random;
      try { Math.random = () => 0.999; enemyStep(e,game); } finally { Math.random = random; }
      const suicidal = kind === 'bomber' || kind === 'kobold';
      game.cam.x = ev.crystalX; game.cam.y = ev.crystalY;
      const before = __troopState(); renderGame(game,ctx2d); renderGame(game,ctx2d);
      const c = document.createElement('canvas'); c.width = c.height = 160;
      drawEnemy(c.getContext('2d'),e,{ x:e.x,y:e.y },160,160);
      const ink = c.getContext('2d').getImageData(0,0,160,160).data.some((v,i) => i % 4 === 3 && v);
      objectives.push({ kind,tier,damage:hp - ev.crystalHp,expected:Math.max(1,Math.round(e.dmg * (suicidal ? 1.5 : 0.45))),
        dead:e.dead === suicidal,cooldown:e.attackCd === 0.8,unchanged:before === __troopState(),mana:ev.etherianMana === mana,
        boom:game.fx.filter(f => f.type === 'boom').length === (suicidal ? 1 : 0),deadHidden:!suicidal || !ink });
    }
    __troopScene(1); let e = spawnEtherianEnemy(__troopTypes[kind],1);
    e.x = game.event.crystalX + 150; e.y = game.event.crystalY - 40;
    game.player.x = e.x + 3; game.player.y = e.y;
    // Keep the real contact hit nonlethal so it does not seed tombstones or a
    // death-screen overlay into subsequent display fixtures.
    game.player.hp = game.player.maxHp = 500; game.player.invuln = 0;
    const hp = game.player.hp, random = Math.random;
    try { Math.random = () => 0.999; enemyStep(e,game); } finally { Math.random = random; }
    game.cam.x = e.x; game.cam.y = e.y;
    contacts.push({ kind,damaged:game.player.hp < hp,invuln:game.player.invuln > 0,...__renderTroopState(e) });
    __troopScene(2); e = spawnEtherianEnemy(__troopTypes[kind],1);
    e.x = game.event.crystalX + 100; e.y = game.event.crystalY - 30;
    hitEntity(e,1,0,0,game);
    const flashed = e.flash > 0, flashState = __renderTroopState(e), mana = game.event.etherianMana;
    hitEntity(e,e.hp + e.def + 10,0,0,game);
    const before = __troopState(); renderGame(game,ctx2d);
    kills.push({ kind,flashed,flashState,dead:e.dead,mana:game.event.etherianMana - mana,unchanged:before === __troopState() });
    __troopScene(1); e = spawnEtherianEnemy(__troopTypes[kind],1); game.event = null; enemyStep(e,game);
    const state = __renderTroopState(e);
    stopped.push({ kind,dead:e.dead,unchanged:state.unchanged,calls:state.calls });
  }
  return { states,objectives,contacts,kills,stopped };
},kinds);
for (const kind of kinds) {
  const states = simulation.states.filter(s => s.kind === kind);
  check(results,`${kind}: both portal spawns in all three tiers use read-only artwork after real AI`,states.length === 6 && states.every(s => s.anchors && s.drawn && s.calls === 5 && s.unchanged && s.flags && s.dimensions && s.hp && s.dmg && s.facing && s.moved && s.motion && s.crystal),states);
}
for (const kind of ['javelin','witherbeast','drakin','lightningbug']) {
  const states = simulation.states.filter(s => s.kind === kind);
  check(results,`${kind}: real shooter keeps its original projectile type, damage, tags and cooldown`,states.every(s => s.shots === 1 && s.shotFlags && s.cooldown),states);
}
check(results,'Non-shooters do not gain attacks from decorative bombs, blades, horns or wings',simulation.states.filter(s => !['javelin','witherbeast','drakin','lightningbug'].includes(s.kind)).every(s => s.shots === 0));
check(results,'All troop types retain real crystal damage and objective cooldowns in every tier',simulation.objectives.every(s => s.damage === s.expected && s.cooldown && s.mana && s.unchanged),simulation.objectives);
check(results,'Bomber/Kobold objective suicides still create one explosion and stay dead and undrawn',simulation.objectives.every(s => s.dead && s.boom && s.deadHidden),simulation.objectives.filter(s => s.kind === 'bomber' || s.kind === 'kobold'));
check(results,'All ten real contact attacks damage the player; drawing preserves damage and invulnerability',simulation.contacts.every(s => s.damaged && s.invuln && s.drawn && s.unchanged),simulation.contacts);
check(results,'Real hit flashes, kills and one-to-three Etherian Mana rewards remain render-independent',simulation.kills.every(s => s.flashed && s.flashState.drawn && s.flashState.unchanged && s.dead && s.mana >= 1 && s.mana <= 3 && s.unchanged),simulation.kills);
check(results,'Event-ended troops remain dead and do not reach the normal drawing hook',simulation.stopped.every(s => s.dead && s.unchanged && s.calls === 1),simulation.stopped);

const context = await page.evaluate(kinds => {
  __troopScene(1); const c = document.createElement('canvas'); c.width = c.height = 320; const ctx = c.getContext('2d');
  let mirrored = true, asymmetric = true;
  for (const kind of kinds) {
    const e = spawnEtherianEnemy(__troopTypes[kind],1), dir = e.dir, px = game.player.x;
    function pixels() { ctx.clearRect(0,0,320,320); CombatArt.drawOOAEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320); return ctx.getImageData(0,0,320,320).data; }
    e.dir = 1; game.player.x = e.x - 100; const right = pixels(); e.dir = -1; game.player.x = e.x + 100; const left = pixels();
    let distinct = false;
    for (let y = 0; y < 320; y++) for (let x = 0; x < 320; x++) for (let ch = 0; ch < 4; ch++) {
      const i = (y * 320 + x) * 4 + ch, r = (y * 320 + 319 - x) * 4 + ch;
      if (left[i] !== right[r]) mirrored = false;
      if (left[i] !== right[i]) distinct = true;
    }
    asymmetric = asymmetric && distinct; e.dir = dir; game.player.x = px;
  }
  ctx.translate(5,7); ctx.scale(0.7,0.8); ctx.globalAlpha = 0.6; ctx.fillStyle = '#123456'; ctx.strokeStyle = '#654321'; ctx.font = '17px serif'; ctx.textAlign = 'right'; ctx.imageSmoothingEnabled = true;
  function state() { const m = ctx.getTransform(); return JSON.stringify([m.a,m.b,m.c,m.d,m.e,m.f,ctx.globalAlpha,ctx.fillStyle,ctx.strokeStyle,ctx.lineWidth,ctx.font,ctx.textAlign,ctx.imageSmoothingEnabled,ctx.globalCompositeOperation]); }
  const before = state(), gameplay = __troopState();
  game.entities.forEach(e => CombatArt.drawOOAEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320));
  const restored = before === state(), unchanged = gameplay === __troopState();
  const unknown = !CombatArt.drawOOAEnemy(ctx,game,{ ooaEnemy:true,type:-999 },{ x:0,y:0 },320,320) && CombatArt.etherianSprite('future',0,false,false) === null;
  const foreign = !CombatArt.drawOOAEnemy(ctx,game,{ type:E.ETHERIANGOBLIN },{ x:0,y:0 },320,320) && !CombatArt.drawOOAEnemy(ctx,game,{ ooaEnemy:true,ooaBoss:true,type:E.ETHERIANGOBLIN },{ x:0,y:0 },320,320);
  return { mirrored,asymmetric,restored,unchanged,unknown,foreign };
},kinds);
check(results,'All ten troop silhouettes mirror exactly using simulation dir, not the player location',context.mirrored && context.asymmetric);
check(results,'Troop drawing restores transforms, styles, alpha, text state and smoothing without gameplay writes',context.restored && context.unchanged);
check(results,'Unknown troops, non-Etherian entities and boss flags retain legacy fallbacks',context.unknown && context.foreign);

const sheet = await page.evaluate(kinds => {
  const c = document.createElement('canvas'); c.width = 1440; c.height = 870; const ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0,0,c.width,c.height); ctx.fillStyle = '#ecd49e'; ctx.font = '20px monospace'; ctx.fillText('TREE / ten original Etherian troop silhouettes',20,30);
  kinds.forEach((kind,i) => {
    const col = i % 5, row = Math.floor(i / 5), x = col * 288, y = 52 + row * 405;
    ctx.drawImage(CombatArt.etherianSprite(kind,1,false,false),x,y,288,288);
    ctx.fillStyle = '#d9d5c4'; ctx.font = '16px monospace'; ctx.fillText(kind,x + 14,y + 308);
    ctx.drawImage(CombatArt.etherianSprite(kind,3,false,true),x + 16,y + 314,96,96);
    ctx.drawImage(CombatArt.etherianSprite(kind,3,true,true),x + 144,y + 314,96,96);
  });
  return c.toDataURL('image/png');
},kinds);
writeFileSync(dir + '/troop-artwork.png',Buffer.from(sheet.split(',')[1],'base64'));
for (const tier of [1,2,3]) {
  await page.evaluate(({ kinds,tier }) => {
    const ev = __troopScene(tier), roster = Array.from(new Set(OOA_TIERS[tier].waves.flatMap(w => w.pool)));
    game.player.x = ev.crystalX - 55; game.player.y = __troopOrigin.gy * TILE - game.player.h / 2 - 0.01;
    roster.forEach((type,i) => {
      const side = i % 2 ? 1 : -1, e = spawnEtherianEnemy(type,side);
      e.x = ev.crystalX + (side < 0 ? -330 + Math.floor(i / 2) * 64 : 190 + Math.floor(i / 2) * 64);
      e.y = e.fly ? ev.crystalY - 75 : __troopOrigin.gy * TILE - e.h / 2 - 0.01;
      e.onGround = !e.fly;
      const random = Math.random; try { Math.random = () => 0.999; enemyStep(e,game); } finally { Math.random = random; }
    });
    game.cam.x = ev.crystalX; game.cam.y = ev.crystalY - 68; game.timeOfDay = 0.5;
    for (let tick = 0; tick < 10; tick++) updateProjectiles();
    updateHud(); updateCrosshair();
    window.__troopHook = CombatArt.drawOOAEnemy; CombatArt.drawOOAEnemy = () => false; render();
  },{ kinds,tier });
  await page.screenshot({ path:dir + `/tier-${tier}-before.png` });
  await page.evaluate(() => { CombatArt.drawOOAEnemy = __troopHook; delete window.__troopHook; render(); });
  await page.screenshot({ path:dir + `/tier-${tier}-after.png` });
}
writeFileSync(dir + '/index.html',`<!doctype html><meta charset="utf-8"><title>Etherian troop artwork</title>
<style>body{background:#202534;color:#dedbc9;font:16px monospace;max-width:1440px;margin:24px auto;padding:0 16px}img{width:100%;image-rendering:pixelated}.row{display:flex;gap:16px}figure{margin:8px 0;flex:1}a{color:#ecd49e}</style>
<h1>Etherian troop artwork</h1><p>Original cached pixel artwork. Unchanged simulation bodies, AI, objectives and projectile rules.</p>
<img src="troop-artwork.png" alt="Ten distinct Etherian troops, with animation, active and hit-flash samples">
${[1,2,3].map(tier => `<h2>Tier ${tier} roster</h2><p>Real spawns and one real AI step, followed by ten projectile ticks; enemy positions are explicit review fixtures.</p><div class="row"><figure><img src="tier-${tier}-before.png" alt="Tier ${tier} legacy troop artwork"><figcaption>Before — only the troop artwork hook disabled</figcaption></figure><figure><img src="tier-${tier}-after.png" alt="Tier ${tier} pixel troop artwork"><figcaption>After — identical gameplay state</figcaption></figure></div>`).join('')}
<p><a href="../combat/index.html">Boss/arena gallery</a> · <a href="../player/index.html">Player controls/animation gallery</a></p>`);
await assertNoBrowserErrors(results);
await finish(results,browser,'etherian-graphics',{ sources,simulation,context });
