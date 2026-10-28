import { mkdirSync, writeFileSync } from 'node:fs';
import { setupAudit, check, assertNoBrowserErrors, finish } from './audit2/lib.mjs';
import { installRangedGoblinFixture, runRangedGoblinHttpScenarios } from './ranged-goblin-fixture.mjs';

const { browser,page,results } = await setupAudit();
await installRangedGoblinFixture(page);
const dir = 'test-results/graphics/ranged-goblin'; mkdirSync(dir,{ recursive:true });
const stable = s => s.calls === 2 && s.readonly && s.rng === 0;
const sources = await page.evaluate(() => {
  const bytes = (k,f,a,flash) => CombatArt.enemySprite(k,f,a,flash).getContext('2d').getImageData(0,0,96,96).data;
  let total = 0, inked = 0, crisp = true, margins = true, masks = true;
  const animated = [], silhouettes = new Set();
  for (const { kind } of __rgSpecs) {
    const frames = new Set();
    for (const active of [false,true]) for (let f = 0; f < 4; f++) {
      const a = bytes(kind,f,active,false), b = bytes(kind,f,active,true); let ink = false;
      for (let y = 0; y < 96; y++) for (let x = 0; x < 96; x++) {
        const i = (y * 96 + x) * 4, alpha = a[i + 3];
        if (alpha) { ink = true; if (x < 2 || y < 2 || x >= 94 || y >= 94) margins = false; }
        if ((alpha !== 0 && alpha !== 255) || (b[i + 3] !== 0 && b[i + 3] !== 255)) crisp = false;
        if (alpha !== b[i + 3] || (alpha && (b[i] !== 255 || b[i + 1] !== 245 || b[i + 2] !== 220))) masks = false;
      }
      total += 2; if (ink) inked += 2; frames.add(Array.from(a).join(','));
    }
    animated.push({ kind,frames:frames.size }); silhouettes.add(Array.from(bytes(kind,0,false,false)).filter((v,i) => i % 4 === 3).join(','));
  }
  const original = __rgSpecs.map(s => Array.from(bytes(s.kind,0,false,false)));
  for (const boss of ['kingslime','eyeofcthulhu','brainofcthulhu','queenbee','skeletron','wallofflesh','retinazer','spazmatism','destroyer','skelprime','queenslime','plantera','golem','duke','empress','moonlord','cultist']) {
    for (const phase of [false,true]) for (let f = 0; f < 4; f++) for (const flash of [false,true]) CombatArt.bossSprite(boss,phase,f,flash);
  }
  return { total,inked,crisp,margins,masks,animated,silhouettes:silhouettes.size,
    stable:__rgSpecs.every((s,i) => bytes(s.kind,0,false,false).every((v,n) => v === original[i][n])) };
});
check(results,'All 48 ranged-goblin variants have crisp unclipped pixels',sources.total === 48 && sources.inked === 48 && sources.crisp && sources.margins,sources);
check(results,'Three equipment silhouettes are distinct and animate',sources.silhouettes === 3 && sources.animated.every(s => s.frames >= 2));
check(results,'Flash alpha and colors stay exact after bounded-cache regeneration',sources.masks && sources.stable);

const ai = await page.evaluate(() => {
  const shots = [], cooldowns = [], walking = [], ghosts = [], jumps = [], walls = [], contacts = [], kills = [], targeting = [];
  const near = (a,b) => Math.abs(a - b) < 1e-7;
  for (const spec of __rgSpecs) {
    // Distances straddle the post-movement boundary, not the initial position.
    for (const side of [-1,1]) for (const delta of [-1,0,1]) for (const roll of [0,0.5,0.999]) {
      __rgScene(); const e = __rgEnemy(spec), move = e.ghost ? e.speed : e.speed * 0.1;
      game.player.x = e.x + side * (spec.range + move + delta); game.player.y = e.y; e.attackCd = 0.001;
      __rgStep(e,roll); const list = game.projectiles.list, shot = list[0], expected = delta < 0;
      const angle = Math.atan2(game.player.y - (spec.kind === 'goblinsorcerer' ? 8 : 0) - e.y,game.player.x - e.x) + (spec.kind === 'goblinarcher' ? (roll - 0.5) * 0.4 : 0);
      shots.push({ kind:spec.kind,side,delta,roll,...__rgRender(e),correct:list.length === (expected ? 1 : 0) && (!expected ||
        near(shot.x,e.x) && near(shot.y,e.y - spec.offset) && near(shot.vx,Math.cos(angle) * spec.speed) && near(shot.vy,Math.sin(angle) * spec.speed) &&
        shot.dmg === (spec.kind === 'goblinarcher' ? 18 : Math.round(spec.damage * diffScale().dmg)) && shot.type === spec.projectile &&
        shot.owner === 'enemy' && shot.life === spec.life && !shot.dead && shot.color === spec.color && near(e.attackCd,spec.cooldown)),
        single:game.entities.length === 1 && !e.segments && !e.arms && e.w === ENT_DEF[e.type].w && e.h === ENT_DEF[e.type].h });
    }
    for (const initial of [undefined,0,-0.001,0.001,0.5]) {
      __rgScene(); const e = __rgEnemy(spec); game.player.x = e.x + 200; game.player.y = e.y;
      if (initial !== undefined) e.attackCd = initial; __rgStep(e);
      const fires = spec.kind === 'goblinarcher' ? !initial || initial < 1 / 60 : initial !== undefined && initial !== 0 && initial < 1 / 60;
      const waiting = (spec.kind === 'goblinsorcerer' ? 0.5 * spec.cooldown : spec.kind === 'goblinsummoner' ? 1.5 : 0) - 1 / 60;
      cooldowns.push({ kind:spec.kind,initial,...__rgRender(e),correct:game.projectiles.list.length === (fires ? 1 : 0) &&
        near(e.attackCd,fires ? spec.cooldown : (initial || (waiting + 1 / 60)) - 1 / 60) });
    }
    for (const wet of [false,true]) for (const side of [-1,1]) {
      __rgScene(wet); const e = __rgEnemy(spec), x = e.x, y = e.y; e.attackCd = 999;
      game.player.x = x + side * 200; game.player.y = y;
      __rgStep(e);
      (e.ghost ? ghosts : walking).push({ kind:spec.kind,wet,side,...__rgRender(e),correct:near(e.x - x,side * e.speed * (e.ghost ? 1 : 0.1)) && near(e.y,y) &&
        (e.ghost ? e.ghost && e.fly : e.dir === side && e.onGround && e.vy === 0),noShots:game.projectiles.list.length === 0 });
    }
    if (!ENT_DEF[spec.type].ghost) {
      for (const distance of [40,64,80]) for (const roll of [0,0.02,0.5]) {
        __rgScene(); const e = __rgEnemy(spec), y = e.y; e.attackCd = 999;
        game.player.x = e.x + distance; game.player.y = e.y; __rgStep(e,roll);
        const jump = distance < 4 * TILE && roll < 0.02;
        jumps.push({ kind:spec.kind,distance,roll,...__rgRender(e),correct:jump ? !e.onGround && near(e.vy,-7 + GRAVITY) && e.y < y : e.onGround && e.vy === 0 && e.y === y });
      }
    }
    for (const side of [-1,1]) {
      __rgScene(); const e = __rgEnemy(spec), w = game.world, wx = __rgOrigin.tx + side * 3, old = [];
      for (let y = __rgOrigin.gy - 10; y < __rgOrigin.gy; y++) { old.push([y,w.get(wx,y)]); w.set(wx,y,T.STONE); }
      e.x = side > 0 ? wx * TILE - e.w / 2 - 0.05 : (wx + 1) * TILE + e.w / 2 + 0.05;
      e.vx = side * e.speed; e.attackCd = 999; game.player.x = e.x + side * 200; game.player.y = e.y;
      const x = e.x, terrain = JSON.stringify(__rgTerrain()); __rgStep(e);
      walls.push({ kind:spec.kind,side,...__rgRender(e),correct:e.ghost ? near(e.x,x + side * e.speed) : e.vx === 0 && (side > 0 ? e.x + e.w / 2 <= wx * TILE : e.x - e.w / 2 >= (wx + 1) * TILE),terrain:terrain === JSON.stringify(__rgTerrain()) });
      old.forEach(([y,t]) => w.set(wx,y,t));
    }
    __rgScene(); const contact = __rgEnemy(spec); contact.attackCd = 999; game.player.x = contact.x + 3; game.player.y = contact.y; game.player.invuln = 0;
    __rgStep(contact);
    contacts.push({ kind:spec.kind,...__rgRender(contact),correct:contact.ghost ? game.player.hp === 1000 && contact.dmgCd === 0 : game.player.hp < 1000 && game.player.invuln > 0 && contact.dmgCd === 0.8 });
    for (const hardmode of [false,true]) for (const roll of [0.001,0.1,0.34,0.5,0.649,0.65,0.67,0.9]) {
      __rgScene(false,hardmode); const e = __rgEnemy(spec); hitEntity(e,1,0,0,game); const flash = e.flash > 0, flashed = __rgRender(e);
      const random = Math.random; try { Math.random = () => roll; hitEntity(e,e.hp + e.def + 100,0,0,game); } finally { Math.random = random; }
      const expected = {};
      if (spec.kind === 'goblinsummoner') { expected[[I.SHADOWFLAMEBOW,I.SHADOWFLAMEKNIFE,I.SHADOWFLAMEHEXDOLL][Math.floor(roll * 3)]] = 1; expected[I.HEALINGPOTION] = 1; }
      else if (roll < 0.65) expected[I.GEL] = 1;
      for (const drop of B83_ENEMY_DROPS[e.name] || []) if (roll < drop.rate) expected[drop.id] = (expected[drop.id] || 0) + 1;
      const actual = game.pickups.reduce((d,p) => { if (!['coin','silvercoin','goldcoin','platinumcoin'].includes(p.item) && p.count > 0) d[p.item] = (d[p.item] || 0) + p.count; return d; },{});
      const before = __rgState(), hidden = !__rgPixels(e).some((v,i) => i % 4 === 3 && v); renderGame(game,ctx2d);
      kills.push({ kind:spec.kind,hardmode,roll,flash,flashed,dead:e.dead,hidden,readonly:before === __rgState(),single:game.entities.length === 1,
        correct:JSON.stringify(actual) === JSON.stringify(expected),actual,expected });
    }
    // Only host status and disposable remote candidates are fixtures: real targeting stays installed.
    const isHost = Net.isHost, remote = Net.remotePlayers;
    try {
      Net.isHost = () => true;
      for (const dying of [false,true]) {
        __rgScene(); const e = __rgEnemy(spec); e.attackCd = 0.001; e.dir = -1; e.vx = 2;
        game.player.x = e.x - 300; game.player.y = e.y;
        Net.remotePlayers = { fixture:{ x:e.x + 150,y:e.y,w:20,h:40,dying } };
        __rgStep(e); const shot = game.projectiles.list[0], usesRemote = !dying && spec.kind !== 'goblinarcher';
        const target = usesRemote ? Net.remotePlayers.fixture : game.player;
        const angle = Math.atan2(target.y - (spec.kind === 'goblinsorcerer' ? 8 : 0) - e.y,target.x - e.x);
        const actual = __rgPixels(e), expected = document.createElement('canvas'); expected.width = expected.height = 320;
        const c = expected.getContext('2d'); c.translate(160,160); if (target.x < e.x) c.scale(-1,1);
        c.drawImage(CombatArt.enemySprite(spec.kind,Math.floor(Time.seconds * 10) % 4,true,false),-48,-48);
        const bytes = c.getImageData(0,0,320,320).data;
        targeting.push({ kind:spec.kind,dying,...__rgRender(e),correct:!!shot && near(shot.vx,Math.cos(angle) * spec.speed) && near(shot.vy,Math.sin(angle) * spec.speed),
          facing:actual.every((v,i) => v === bytes[i]) });
      }
    } finally { Net.isHost = isHost; Net.remotePlayers = remote; }
  }
  return { shots,cooldowns,walking,ghosts,jumps,walls,contacts,kills,targeting };
});
for (const kind of ['goblinarcher','goblinsorcerer','goblinsummoner']) check(results,kind + ': real range, spread, projectile origin, damage and cooldown',ai.shots.filter(s => s.kind === kind).every(s => s.correct && s.single && stable(s)),ai.shots.filter(s => s.kind === kind && !s.correct));
check(results,'Zero/undefined and signed readiness preserve existing cooldown defaults',ai.cooldowns.every(s => s.correct && stable(s)),ai.cooldowns.filter(s => !s.correct));
check(results,'Ground shooters retain dry/wet walking and AI direction',ai.walking.every(s => s.correct && s.noShots && stable(s)));
check(results,'Summoner retains direct ghost pursuit, wet or dry, with no summons',ai.ghosts.every(s => s.correct && s.noShots && stable(s)));
check(results,'Ground shooters retain strict four-tile/2% jumps',ai.jumps.every(s => s.correct && stable(s)));
check(results,'Walkers collide and Summoner ignores walls without terrain edits',ai.walls.every(s => s.correct && s.terrain && stable(s)));
check(results,'Original contact damage and ghost contact exclusion remain intact',ai.contacts.every(s => s.correct && stable(s)),ai.contacts);
check(results,'Real kills retain Gel and all three Shadowflame reward branches',ai.kills.every(s => s.correct && s.flash && stable(s.flashed) && s.dead && s.hidden && s.readonly && s.single),ai.kills.filter(s => !s.correct || !stable(s.flashed)));
check(results,'Artwork faces actual local/remote firing target, excluding dying remotes',ai.targeting.every(s => s.correct && s.facing && stable(s)),ai.targeting);

const projectiles = await page.evaluate(() => {
  const rows = [], difficulty = game.difficulty;
  try {
    for (const level of ['normal','expert','master']) for (const spec of __rgSpecs) for (const wall of [false,true]) {
      __rgScene(); game.difficulty = level;
      const e = __rgEnemy(spec); e.attackCd = 0.001;
      game.player.x = e.x + 120; game.player.y = e.y; game.player.invuln = 0;
      __rgStep(e); const shot = game.projectiles.list[0], damage = shot.dmg, old = [];
      if (wall) {
        const wx = Math.floor((e.x + 50) / TILE);
        for (let y = __rgOrigin.gy - 10; y < __rgOrigin.gy; y++) { old.push([wx,y,game.world.get(wx,y)]); game.world.set(wx,y,T.STONE); }
      }
      const hp = game.player.hp, terrain = JSON.stringify(__rgTerrain()), drawn = __rgRender(e);
      for (let tick = 0; tick < 80 && !shot.dead; tick++) updateProjectiles();
      const before = __rgState(); renderGame(game,ctx2d);
      rows.push({ kind:spec.kind,level,wall,drawn,readonly:before === __rgState(),terrain:terrain === JSON.stringify(__rgTerrain()),
        damage:damage === (spec.kind === 'goblinarcher' ? 18 : spec.damage * DIFFICULTY[level].dmg),
        collision:shot.dead && (wall ? game.player.hp === hp : game.player.hp < hp && game.player.invuln > 0),
        noRewards:game.pickups.length === 0 && game.entities.length === 1 });
      old.forEach(([x,y,t]) => game.world.set(x,y,t));
    }
  } finally { game.difficulty = difficulty; }
  return rows;
});
check(results,'Real fired projectiles retain player/wall collision and existing difficulty scaling',projectiles.every(s => stable(s.drawn) && s.readonly && s.terrain && s.damage && s.collision && s.noRewards),projectiles);

const presentation = await page.evaluate(() => {
  const poses = [], c = document.createElement('canvas'); c.width = c.height = 320; const ctx = c.getContext('2d');
  __rgScene();
  for (const spec of __rgSpecs) {
    const e = __rgEnemy(spec); game.player.x = e.x + 200;
    for (const cd of [undefined,0,0.5,spec.cooldown - 0.18,spec.cooldown - 0.17,spec.cooldown,spec.cooldown + 0.01,999]) {
      e.attackCd = cd; const active = cd > spec.cooldown - 0.18 && cd <= spec.cooldown;
      const actual = __rgPixels(e); ctx.clearRect(0,0,320,320);
      ctx.drawImage(CombatArt.enemySprite(spec.kind,Math.floor(Time.seconds * 10) % 4,active,false),112,112);
      const expected = ctx.getImageData(0,0,320,320).data;
      poses.push({ kind:spec.kind,cd,active,exact:actual.every((v,i) => v === expected[i]) });
    }
  }
  ctx.translate(4,6); ctx.scale(0.7,0.8); ctx.globalAlpha = 0.6; ctx.fillStyle = '#123456'; ctx.strokeStyle = '#654321'; ctx.font = '17px serif'; ctx.textAlign = 'right'; ctx.imageSmoothingEnabled = true;
  function state() { const m = ctx.getTransform(); return JSON.stringify([m.a,m.b,m.c,m.d,m.e,m.f,ctx.globalAlpha,ctx.fillStyle,ctx.strokeStyle,ctx.lineWidth,ctx.font,ctx.textAlign,ctx.imageSmoothingEnabled,ctx.globalCompositeOperation]); }
  const before = state(), gameplay = __rgState(), random = Math.random; let rng = 0;
  try { Math.random = () => { rng++; return 0.5; }; game.entities.forEach(e => CombatArt.drawEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320)); } finally { Math.random = random; }
  return { poses,restored:before === state(),readonly:gameplay === __rgState(),rng,
    fallback:[E.GOBLINWARLOCK,E.ICEGOLEM,E.PIRATECAPTAIN,E.PIRATESHARK,-999].every(type => !CombatArt.drawEnemy(ctx,game,{ type },{ x:0,y:0 },320,320)),
    protectedCases:[{ boss:'goblinwarlock' },{ minion:'spider' },{ ooaEnemy:true },{ ooaSentry:true }].every(flags => !CombatArt.drawEnemy(ctx,game,Object.assign({ type:E.GOBLINSUMMONER },flags),{ x:0,y:0 },320,320)) };
});
check(results,'Release poses use only bounded post-shot cooldown, not arbitrary readiness',presentation.poses.every(s => s.exact),presentation.poses);
check(results,'Drawing restores context, consumes no RNG and changes no gameplay',presentation.restored && presentation.readonly && presentation.rng === 0);
check(results,'Ordinary Warlock, deferred enemies, boss and Etherian hooks keep fallbacks',presentation.fallback && presentation.protectedCases);

const events = await page.evaluate(() => {
  const rows = [];
  for (const spec of __rgSpecs) {
    __rgScene(); delete game.eventCompletions.goblinarmy; game.lanternNight.pending = false;
    const def = EVENT_WAVES.goblinarmy;
    game.hardmode = false; const pre = eventTrashPool(def); game.hardmode = true; const post = eventTrashPool(def);
    game.startEvent('goblinarmy'); startWave(game.event); const wave = game.event.wave === 1 && game.event.pending === 8;
    spawnEventEnemy(spec.type); const e = game.entities[game.entities.length - 1]; e.x = __rgOrigin.x; e.y = game.player.y - 50; e.attackCd = 0.001;
    game.player.x = e.x + 200; game.player.y = e.y; __rgStep(e);
    game.event.wave = def.sizes.length; game.event.pending = 0; const live = __rgRender(e), flag = e.eventEnemy && eventAliveCount() === 1;
    hitEntity(e,e.hp + e.def + 100,0,0,game); const before = __rgState(); renderGame(game,ctx2d);
    const waiting = before === __rgState() && game.event !== null && !game.eventCompletions.goblinarmy;
    updateEvents(1 / 60); const after = __rgState(); renderGame(game,ctx2d);
    rows.push({ kind:spec.kind,wave,flag,live,waiting,readonly:after === __rgState(),finished:game.event === null && game.eventCompletions.goblinarmy && game.lanternNight.pending,
      pool:pre.includes(E.GOBLINARCHER) && pre.includes(E.GOBLINSORCERER) && !pre.includes(E.GOBLINSUMMONER) && post.includes(E.GOBLINSUMMONER) && !post.includes(E.GOBLINWARLOCK) });
  }
  return rows;
});
check(results,'Natural invasion pools, last-kill completion and Lantern Night stay simulation-owned',events.every(s => s.wave && s.flag && stable(s.live) && s.waiting && s.readonly && s.finished && s.pool),events);
const scenarios = await runRangedGoblinHttpScenarios(page);
check(results,'Eight wet/dry and left/right ready/fired invasion scenarios remain read-only',scenarios.every(s => s.calls === 3 && s.readonly && s.shots === (s.shooting ? 3 : 0) && s.cooldowns && s.event && s.bodies && s.noLoot && s.noSummons),scenarios);

const sheet = await page.evaluate(() => {
  const c = document.createElement('canvas'); c.width = 960; c.height = 760; const ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0,0,c.width,c.height); ctx.fillStyle = '#ecd49e'; ctx.font = '18px monospace'; ctx.fillText('TREE / Goblin Archer, Sorcerer and Summoner',20,30);
  __rgSpecs.forEach((spec,i) => [false,true].forEach((active,row) => {
    const x = i * 320 + 16, y = 50 + row * 350; ctx.drawImage(CombatArt.enemySprite(spec.kind,row ? 3 : 1,active,false),x,y,288,288);
    ctx.fillStyle = '#d9d5c4'; ctx.font = '15px monospace'; ctx.fillText(spec.kind,x,y + 306);
    ctx.fillStyle = '#9cabc6'; ctx.fillText(active ? 'post-shot release' : 'normal',x,y + 328);
  })); return c.toDataURL('image/png');
});
writeFileSync(dir + '/ranged-goblin-artwork.png',Buffer.from(sheet.split(',')[1],'base64'));
for (const shooting of [false,true]) {
  await page.evaluate(shooting => {
    __rgScene(); const o = __rgOrigin, p = game.player;
    __rgSpecs.forEach((spec,i) => {
      const e = __rgEnemy(spec); e.x += [-240,0,240][i]; e.attackCd = shooting ? 0.001 : 0.5;
      p.x = e.x + (i % 2 ? -1 : 1) * 200; p.y = e.y; __rgStep(e);
    });
    p.x = o.x - 100; p.y = o.gy * TILE - p.h / 2 - 0.01; game.cam.x = o.x; game.cam.y = p.y - 100;
    updateHud(); updateCrosshair(); window.__rgHook = CombatArt.drawEnemy; CombatArt.drawEnemy = () => false; render();
  },shooting);
  const state = shooting ? 'fired' : 'normal'; await page.screenshot({ path:dir + `/${state}-before.png` });
  await page.evaluate(() => { CombatArt.drawEnemy = __rgHook; delete window.__rgHook; render(); });
  await page.screenshot({ path:dir + `/${state}-after.png` });
}
writeFileSync(dir + '/index.html',`<!doctype html><meta charset="utf-8"><title>Ranged goblin artwork</title>
<style>body{background:#202534;color:#dedbc9;font:16px monospace;max-width:1280px;margin:24px auto;padding:0 16px}img{width:100%;image-rendering:pixelated}.row{display:flex;gap:16px}figure{margin:8px 0;flex:1}a{color:#ecd49e}</style>
<h1>Goblin Archer, Sorcerer and Summoner</h1><p>Original pixel artwork; actual arrows, magic bolts and ghost pursuit remain unchanged. No summons were added.</p><img src="ranged-goblin-artwork.png" alt="Three original ranged goblin source sprites">
${['normal','fired'].map(state => `<h2>${state}</h2><p>One real AI tick with ${state === 'fired' ? 'explicit firing readiness' : 'a waiting cooldown'}. Room, placement, temporary targets and HP are disposable fixtures. Fired projectiles are real simulation records.</p><div class="row"><figure><img src="${state}-before.png" alt="Legacy ${state} goblins"><figcaption>Before — only general-enemy artwork disabled</figcaption></figure><figure><img src="${state}-after.png" alt="New ${state} goblins"><figcaption>After — same combat state</figcaption></figure></div>`).join('')}
<p><a href="../goblin/index.html">Melee goblin gallery</a></p>`);
await assertNoBrowserErrors(results);
await finish(results,browser,'ranged-goblin-graphics',{ sources,ai,projectiles,presentation,events,scenarios });
