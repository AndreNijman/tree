import { mkdirSync, writeFileSync } from 'node:fs';
import { setupAudit, check, assertNoBrowserErrors, finish } from './audit2/lib.mjs';
import { installInvasionFixture, runInvasionScenarios, runMoonDawnProbe } from './invasion-art-fixture.mjs';
import { runMartianDeploymentProbe } from './martian-deployment-probe.mjs';
import { runEclipseEventProbe } from './eclipse-event-probe.mjs';

export async function runInvasionGraphicsCheck(config) {
const { browser,page,results } = await setupAudit();
await installInvasionFixture(page,config);
const dir = 'test-results/graphics/' + config.gallery; mkdirSync(dir,{ recursive:true });
const stable = s => s.calls === 2 && s.readonly && s.rng === 0;
const sources = await page.evaluate(() => {
  const bytes = (k,f,a,flash) => CombatArt.enemySprite(k,f,a,flash).getContext('2d').getImageData(0,0,96,96).data;
  let total = 0, inked = 0, crisp = true, margins = true, masks = true;
  const animated = [], silhouettes = new Set();
  for (const { kind } of __piSpecs) {
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
    animated.push({ kind,frames:frames.size }); silhouettes.add(Array.from(bytes(kind,0,false,false)).filter((v,i) => i % 4 === 3).join(','));
  }
  const original = __piSpecs.map(s => Array.from(bytes(s.kind,0,false,false)));
  for (const boss of ['kingslime','eyeofcthulhu','brainofcthulhu','queenbee','skeletron','wallofflesh','retinazer','spazmatism','destroyer','skelprime','queenslime','plantera','golem','duke','empress','moonlord','cultist']) {
    for (const phase of [false,true]) for (let f = 0; f < 4; f++) for (const flash of [false,true]) CombatArt.bossSprite(boss,phase,f,flash);
  }
  return { total,inked,crisp,margins,masks,animated,silhouettes:silhouettes.size,
    stable:__piSpecs.every((s,i) => bytes(s.kind,0,false,false).every((v,n) => v === original[i][n])) };
});
check(results,'All invasion source variants are nonempty, crisp and unclipped',sources.total === config.specs.length * 16 && sources.inked === sources.total && sources.crisp && sources.margins,sources);
check(results,'Distinct roster silhouettes animate without palette-only substitutions',sources.silhouettes === config.specs.length && sources.animated.every(s => s.frames >= 2),sources.animated);
check(results,'Exact flash masks and deterministic bounded-cache regeneration remain intact',sources.masks && sources.stable);

const ai = await page.evaluate(() => {
  const movement = [], jumps = [], hops = [], walls = [], contacts = [], shots = [], readiness = [], projectiles = [], loot = [];
  const near = (a,b) => Math.abs(a - b) < 1e-7;
  for (const spec of __piSpecs) {
    for (const wet of [false,true]) for (const side of [-1,1]) for (const initial of [0,-4]) {
      __piScene(wet); const e = __piEnemy(spec), x = e.x, y = e.y, bob = e.bob; e.vx = side * initial; e.attackCd = 999;
      game.player.x = x + side * 200; game.player.y = y;
      const vx = spec.fly ? side * e.speed : spec.hop ? side * e.speed * 0.35 : e.vx + (side * e.speed - e.vx) * 0.1; __piStep(e);
      movement.push({ kind:spec.kind,wet,side,initial,...__piRender(e),correct:near(e.x - x,vx) && near(e.vx,vx) &&
        (spec.ghost && !spec.bobFlight ? e.bob === bob && e.vy === 0 && e.y === y : spec.fly ? near(e.bob,bob + 0.06) && near(e.vy,Math.sin(e.bob) * 0.8) && near(e.y - y,e.vy) : e.dir === side && e.onGround && e.vy === 0 && e.y === y),
        body:e.w === ENT_DEF[e.type].w && e.h === ENT_DEF[e.type].h && !e.segments && !e.arms && !!e.ghost === !!ENT_DEF[e.type].ghost,noShots:game.projectiles.list.length === 0 });
    }
    if (!spec.fly && !spec.hop) for (const side of [-1,1]) for (const distance of [40,64,80]) for (const roll of [0,0.02,0.5]) {
      __piScene(); const e = __piEnemy(spec), y = e.y; e.attackCd = 999;
      game.player.x = e.x + side * distance; game.player.y = e.y; __piStep(e,roll);
      const jump = distance < 4 * TILE && roll < 0.02;
      jumps.push({ kind:spec.kind,side,distance,roll,...__piRender(e),correct:jump ? !e.onGround && near(e.vy,-7 + GRAVITY) && e.y < y : e.onGround && e.vy === 0 && e.y === y });
    }
    if (spec.hop) for (const side of [-1,1]) for (const distance of [40,200]) for (const grounded of [false,true]) for (const timer of [0,2 / 60,2 / 60 + 0.001]) for (const roll of [0,0.999]) {
      __piScene(); const e = __piEnemy(spec); e.timer = timer; e.onGround = grounded; if (!grounded) e.y -= 24;
      game.player.x = e.x + side * distance; game.player.y = e.y;
      const x = e.x, y = e.y, jump = grounded && timer <= 2 / 60; __piStep(e,roll);
      const vx = side * e.speed * (jump ? 2 + roll : 0.35), vy = jump ? -(8 + roll * 3) + GRAVITY : grounded ? 0 : GRAVITY;
      hops.push({ kind:spec.kind,side,distance,grounded,timer,roll,...__piRender(e),correct:e.dir === side && near(e.x - x,vx) && near(e.vx,vx) && near(e.y - y,vy) && near(e.vy,vy) &&
        near(e.timer,jump ? 1 + roll * 0.8 : timer - 2 / 60) && e.onGround === (grounded && !jump) });
    }
    for (const side of [-1,1]) {
      __piScene(); const e = __piEnemy(spec), w = game.world, wx = __piOrigin.tx + side * 3, old = [];
      for (let y = __piOrigin.gy - 10; y < __piOrigin.gy; y++) { old.push([y,w.get(wx,y)]); w.set(wx,y,T.STONE); }
      e.x = side > 0 ? wx * TILE - e.w / 2 - 0.05 : (wx + 1) * TILE + e.w / 2 + 0.05;
      e.vx = side * e.speed; e.attackCd = 999; game.player.x = e.x + side * 200; game.player.y = e.y;
      const terrain = JSON.stringify(__piTerrain()), x = e.x; __piStep(e);
      walls.push({ kind:spec.kind,side,...__piRender(e),correct:spec.ghost && !spec.bobFlight ? near(e.x,x + side * e.speed) && near(e.vx,side * e.speed) : e.vx === 0 && (side > 0 ? e.x + e.w / 2 <= wx * TILE : e.x - e.w / 2 >= (wx + 1) * TILE),terrain:terrain === JSON.stringify(__piTerrain()) });
      old.forEach(([y,t]) => w.set(wx,y,t));
    }
    __piScene(); const e = __piEnemy(spec); e.attackCd = 999; game.player.x = e.x + 3; game.player.y = e.y; game.player.invuln = 0;
    __piStep(e); const hp = game.player.hp, cd = e.dmgCd; __piStep(e);
    contacts.push({ kind:spec.kind,...__piRender(e),correct:spec.ghost ? hp === 1000 && game.player.hp === hp && cd === 0 && e.dmgCd === 0 : hp < 1000 && game.player.hp === hp && game.player.invuln > 0 && cd === 0.8 && near(e.dmgCd,0.8 - 1 / 60) });

    if (spec.shoot) {
      for (const side of [-1,1]) for (const delta of [-1,0,1]) {
        __piScene(); const e = __piEnemy(spec); e.attackCd = 0.001;
        // Zero this disposable bob phase to isolate exact radial boundaries.
        if (spec.fly && !spec.ghost) e.bob = -0.06;
        game.player.x = e.x + side * (spec.range + e.speed * (spec.fly ? 1 : 0.1) + delta); game.player.y = e.y; __piStep(e);
        const shot = game.projectiles.list[0], expected = delta < 0, angle = Math.atan2(game.player.y - spec.aimOffset - e.y,game.player.x - e.x);
        shots.push({ kind:spec.kind,side,delta,...__piRender(e),correct:game.projectiles.list.length === (expected ? 1 : 0) && (!expected ||
          near(shot.x,e.x) && near(shot.y,e.y - spec.originOffset) && near(shot.vx,Math.cos(angle) * spec.shotSpeed) && near(shot.vy,Math.sin(angle) * spec.shotSpeed) &&
          shot.dmg === Math.round(spec.damage * (spec.fixedDamage ? 1 : diffScale().dmg)) && shot.type === spec.projectile && shot.color === spec.color && shot.owner === 'enemy' && shot.life === spec.life && !shot.dead && near(e.attackCd,spec.cooldown)) });
      }
      for (const initial of [undefined,0,-0.001,0.001,0.5]) {
        __piScene(); const e = __piEnemy(spec); game.player.x = e.x + 200; game.player.y = e.y;
        if (initial !== undefined) e.attackCd = initial; __piStep(e);
        const fires = spec.local ? !initial || initial < 1 / 60 : initial !== undefined && initial !== 0 && initial < 1 / 60;
        readiness.push({ kind:spec.kind,initial,...__piRender(e),correct:game.projectiles.list.length === (fires ? 1 : 0) && near(e.attackCd,fires ? spec.cooldown : (initial || spec.initialCooldown || spec.cooldown * 0.5) - 1 / 60) });
      }
      const difficulty = game.difficulty;
      try {
        for (const level of ['normal','expert','master']) for (const wall of [false,true]) {
          __piScene(); game.difficulty = level; const e = __piEnemy(spec); e.attackCd = 0.001;
          game.player.x = e.x + 120; game.player.y = e.y; game.player.invuln = 0; __piStep(e);
          const shot = game.projectiles.list[0], damage = shot.dmg, old = [];
          if (wall) {
            const wx = Math.floor((e.x + 50) / TILE);
            for (let y = __piOrigin.gy - 10; y < __piOrigin.gy; y++) { old.push([wx,y,game.world.get(wx,y)]); game.world.set(wx,y,T.STONE); }
          }
          const hp = game.player.hp, terrain = JSON.stringify(__piTerrain()), drawn = __piRender(e);
          for (let tick = 0; tick < 80 && !shot.dead; tick++) updateProjectiles();
          const before = __piState(); renderGame(game,ctx2d);
          projectiles.push({ kind:spec.kind,level,wall,drawn,readonly:before === __piState(),terrain:terrain === JSON.stringify(__piTerrain()),damage:damage === spec.damage * (spec.fixedDamage ? 1 : DIFFICULTY[level].dmg),
            collision:shot.dead && (wall ? game.player.hp === hp : game.player.hp < hp && game.player.invuln > 0),noRewards:game.pickups.length === 0 && game.entities.length === 1 });
          old.forEach(([x,y,t]) => game.world.set(x,y,t));
        }
      } finally { game.difficulty = difficulty; }
    }
    // Control independent base/nested rolls only while the real drop table runs.
    // Other kill RNG stays fixed, so rare extended entries have a separate roll.
    for (const hardmode of [false,true]) for (const [base,nested,rare] of (__piConfig.lootRolls || [[0.499,0,0.5],[0.5,0.0299,0.5],[0.5,0.03,0.5],[0.699,0,0.5],[0.7,0.0099,0.5],[0.7,0.01,0.5],[0.99,0.99,0.001]])) {
      __piScene(false,hardmode); const e = __piEnemy(spec), random = Math.random, table = dropTable;
      hitEntity(e,1,0,0,game); const flash = e.flash > 0, flashed = __piRender(e);
      let tableCalls = 0;
      try {
        Math.random = () => rare;
        dropTable = (...args) => {
          tableCalls++; let calls = 0; Math.random = () => calls++ === 0 ? base : nested;
          try { return table(...args); } finally { Math.random = () => rare; }
        };
        hitEntity(e,e.hp + e.def + 100,0,0,game);
      } finally { dropTable = table; Math.random = random; }
      const expected = {}, fixedCoins = spec.type === E.PIRATECROSSBOWER || spec.type === E.PARROT;
      function add(id,n) { if (n > 0) expected[id] = (expected[id] || 0) + n; }
      for (const c of copperToCoins(ENEMY_COIN_VALUES[e.name.toLowerCase()] || 0)) add(c.id,c.count);
      if (__piConfig.loot === 'snow') { add(I.SNOW,2); add(I.ICE,1); }
      else if (__piConfig.loot === 'martian') {
        if (spec.type === E.MARTIANENGINEER) { if (base < 0.18) add([I.LASERDRILL,I.ANTIGRAVITYHOOK][Math.floor(nested * 2)],1); add(I.ILLEGALGUNPARTS,1); }
        else { add(I.COIN,spec.type === E.MARTIANOFFICER ? 3 : 2); if (nested < (spec.type === E.MARTIANOFFICER ? 0.3 : 0.2)) add(I.ILLEGALGUNPARTS,1); }
      }
      else if (__piConfig.loot === 'martian-heavy') {
        if (spec.type === E.GIGAZAPPER) { if (base < 0.18) add(I.CHARGEDBLASTER,1); add(I.COIN,5); }
        else { add(I.COIN,3); if (nested < 0.25) add(I.ILLEGALGUNPARTS,1); }
      }
      else if (__piConfig.loot === 'martian-special') {
        if (spec.type === E.SCUTLIXGUNNER) { if (base < 0.2) add(I.BRAINSCRAMBLERMOUNT,1); add(I.COIN,5); }
        else { add(I.COIN,3); if (nested < (spec.type === E.BRAINSCRAMBLER ? 0.3 : 0.25)) add(I.ILLEGALGUNPARTS,1); }
      }
      else if (__piConfig.loot === 'pumpkin') {
        if (spec.type === E.PUMPKINSCARECROW || spec.type === E.SPLINTERLING) add(I.PUMPKIN,nested < 0.5 ? 1 : 2);
        else { add(I.PUMPKIN,2); if (nested < 0.35) add(I.ECTOPLASM,1); }
      }
      else if (__piConfig.loot === 'frost-moon') {
        if (spec.type === E.GINGERBREAD) { add(I.SNOW,2); add(I.ICE,1); }
        else if ([E.NUTCRACKER,E.FLOCKO,E.YETI].includes(spec.type)) { add(I.SNOW,2 + Math.floor(nested * 3)); if (nested < 0.4) add(I.ECTOPLASM,1); }
        else { add(I.SNOW,2); if (nested < 0.3) add(I.ECTOPLASM,1); }
      }
      else if (__piConfig.loot === 'eclipse-base') {
        if (spec.type === E.FRANKENSTEIN) add(I.IRON,2);
        if (spec.type === E.CREATUREFROMDEEP && nested < 0.08) add(I.NEPTUNESSHELL,1);
        add(I.SOUL_NIGHT,1);
      }
      else if (fixedCoins) { add(I.COIN,2); if (nested < 0.01) add(I.COINGUN,1); }
      else if (base >= 0.5 && base < 0.7) { if (nested < 0.03) add(I.PIRATEMAP,1); }
      else if (base >= 0.7) { add(I.COIN,2 + Math.floor(nested * 4)); if (nested < 0.01) add(I.COINGUN,1); }
      for (const d of B83_ENEMY_DROPS[e.name] || []) if (rare < d.rate) add(d.id,1);
      const actual = game.pickups.reduce((d,p) => { if (p.count > 0) d[p.item] = (d[p.item] || 0) + p.count; return d; },{});
      const same = Object.keys(actual).length === Object.keys(expected).length && Object.entries(expected).every(([id,n]) => actual[id] === n);
      const before = __piState(), hidden = !__piPixels(e).some((v,i) => i % 4 === 3 && v); renderGame(game,ctx2d);
      loot.push({ kind:spec.kind,hardmode,base,nested,rare,tableCalls,flash,flashed,dead:e.dead,hidden,readonly:before === __piState(),single:game.entities.length === 1,correct:same,actual,expected });
    }
  }
  return { movement,jumps,hops,walls,contacts,shots,readiness,projectiles,loot };
});
for (const { kind } of config.specs) check(results,kind + ': real dry/wet movement and original single body',ai.movement.filter(s => s.kind === kind).every(s => s.correct && s.body && s.noShots && stable(s)),ai.movement.filter(s => s.kind === kind && !s.correct));
check(results,'All walkers retain strict four-tile and 2% jumping boundaries',ai.jumps.every(s => s.correct && stable(s)));
if (config.specs.some(s => s.hop)) check(results,'Real slime hops retain double timer ticks, grounded readiness, velocities and reset bounds',ai.hops.length > 0 && ai.hops.every(s => s.correct && stable(s)),ai.hops.filter(s => !s.correct));
check(results,'Original solid collision and ghost wall-pass rules remain intact',ai.walls.every(s => s.correct && s.terrain && stable(s)),ai.walls);
check(results,'Contact damage, invulnerability and damage cooldown stay unchanged',ai.contacts.every(s => s.correct && stable(s)),ai.contacts);
if (config.specs.some(s => s.shoot)) {
  check(results,'Real projectiles retain exact range, aim, origins, speeds and cooldowns',ai.shots.length > 0 && ai.shots.every(s => s.correct && stable(s)),ai.shots);
  check(results,'Original immediate/randomized cooldown defaults and signed readiness remain unchanged',ai.readiness.length > 0 && ai.readiness.every(s => s.correct && stable(s)),ai.readiness);
  check(results,'Actual projectiles retain difficulty scaling and player/wall collision',ai.projectiles.length > 0 && ai.projectiles.every(s => stable(s.drawn) && s.readonly && s.terrain && s.damage && s.collision && s.noRewards),ai.projectiles);
}
check(results,'Real kills retain exact base loot, coins and extended rare entries',ai.loot.every(s => s.correct && s.tableCalls === 1 && s.flash && stable(s.flashed) && s.dead && s.hidden && s.readonly && s.single),ai.loot.filter(s => !s.correct || !stable(s.flashed)));

const presentation = await page.evaluate(() => {
  const facing = [], poses = [], c = document.createElement('canvas'); c.width = c.height = 320; const ctx = c.getContext('2d');
  __piScene(); const host = Net.isHost, remote = Net.remotePlayers;
  try {
    for (const spec of __piSpecs) {
      const e = __piEnemy(spec); e.attackCd = 0.5;
      for (const side of [-1,1]) {
        e.dir = side; e.vx = -side * 2; game.player.x = e.x - side * 300; game.player.y = e.y;
        Net.isHost = () => true; Net.remotePlayers = { fixture:{ x:e.x + side * 150,y:e.y,w:20,h:40,dying:false } };
        const target = spec.local ? -side : spec.shoot ? side : spec.fly ? -side : side;
        const actual = __piPixels(e); ctx.clearRect(0,0,320,320); ctx.save(); ctx.translate(160,160); if (target < 0) ctx.scale(-1,1);
        ctx.drawImage(CombatArt.enemySprite(spec.kind,Math.floor(Time.seconds * 10) % 4,false,false),-48,-48); ctx.restore();
        const bytes = ctx.getImageData(0,0,320,320).data;
        facing.push({ kind:spec.kind,side,exact:actual.every((v,i) => v === bytes[i]) });
      }
      Net.isHost = host; Net.remotePlayers = remote; e.dir = 1; e.vx = 2; game.player.x = e.x + 200;
      const cases = spec.shoot ? [undefined,0,0.5,spec.cooldown - 0.18,spec.cooldown - 0.17,spec.cooldown,spec.cooldown + 0.01,999].map(cd => ({ cd,onGround:true,vy:0,active:cd > spec.cooldown - 0.18 && cd <= spec.cooldown })) :
        [[true,0],[false,-4],[false,-1],[false,3]].map(([onGround,vy]) => ({ cd:999,onGround,vy,active:!spec.fly && !onGround && vy < -1 }));
      for (const state of cases) {
        e.attackCd = state.cd; e.onGround = state.onGround; e.vy = state.vy;
        const actual = __piPixels(e); ctx.clearRect(0,0,320,320); ctx.drawImage(CombatArt.enemySprite(spec.kind,Math.floor(Time.seconds * 10) % 4,state.active,false),112,112);
        const bytes = ctx.getImageData(0,0,320,320).data;
        poses.push({ kind:spec.kind,...state,exact:actual.every((v,i) => v === bytes[i]) });
      }
    }
  } finally { Net.isHost = host; Net.remotePlayers = remote; }
  ctx.translate(4,6); ctx.scale(0.7,0.8); ctx.globalAlpha = 0.6; ctx.fillStyle = '#123456'; ctx.strokeStyle = '#654321'; ctx.font = '17px serif'; ctx.textAlign = 'right'; ctx.imageSmoothingEnabled = true;
  function state() { const m = ctx.getTransform(); return JSON.stringify([m.a,m.b,m.c,m.d,m.e,m.f,ctx.globalAlpha,ctx.fillStyle,ctx.strokeStyle,ctx.lineWidth,ctx.font,ctx.textAlign,ctx.imageSmoothingEnabled,ctx.globalCompositeOperation]); }
  const before = state(), gameplay = __piState(), random = Math.random; let rng = 0;
  try { Math.random = () => { rng++; return 0.5; }; game.entities.forEach(e => CombatArt.drawEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320)); } finally { Math.random = random; }
  const fallbackCases = [E.GOBLINWARLOCK,E.ICEGOLEM,E.PIRATECAPTAIN,E.PIRATESHARK,E.MIMIC,E.MARTIANPROBE,E.STARGAZER,-999].map(type =>
    ({ type,legacy:!CombatArt.drawEnemy(ctx,game,{ type },{ x:0,y:0 },320,320) }));
  return { facing,poses,restored:before === state(),readonly:gameplay === __piState(),rng,
    fallback:fallbackCases.every(s => s.legacy),fallbackCases,
    protectedCases:[{ boss:'piratecaptain' },{ minion:'pirate' },{ ooaEnemy:true },{ ooaSentry:true }].every(flags => !CombatArt.drawEnemy(ctx,game,Object.assign({ type:__piSpecs[0].type },flags),{ x:0,y:0 },320,320)) };
});
check(results,'Melee follows AI dir, flyers follow velocity and shooters follow their firing target',presentation.facing.every(s => s.exact),presentation.facing);
check(results,'Jump and bounded cooldown poses never introduce attacks or flight states',presentation.poses.every(s => s.exact));
check(results,'Artwork restores context, consumes no RNG and changes no world/gameplay state',presentation.restored && presentation.readonly && presentation.rng === 0);
check(results,'Unconverted ordinary Captain/Shark, deferred enemies and protected hooks keep fallbacks',presentation.fallback && presentation.protectedCases,presentation.fallbackCases);
let ghostPresentation = null;
if (config.exactGhost) {
  ghostPresentation = await page.evaluate(() => __piSpecs.filter(s => s.ghost).map(spec => {
    __piScene(); const e = __piEnemy(spec); e.vx = 2; e.flash = 0;
    const c = document.createElement('canvas'), expected = document.createElement('canvas'); c.width = c.height = expected.width = expected.height = 320;
    const a = c.getContext('2d'), b = expected.getContext('2d'), before = __piState();
    drawEnemy(a,e,{ x:e.x,y:e.y },320,320);
    b.globalAlpha = 0.6; CombatArt.drawEnemy(b,game,e,{ x:e.x,y:e.y },320,320);
    const pixels = a.getImageData(0,0,320,320).data, bytes = b.getImageData(0,0,320,320).data;
    return { kind:spec.kind,readonly:before === __piState(),restored:a.globalAlpha === 1,
      exact:pixels.every((v,i) => v === bytes[i]),visible:pixels.some((v,i) => i % 4 === 3 && v === 153) };
  }));
  check(results,'Ghost presentation applies caller-owned 0.6 alpha exactly once and restores it',ghostPresentation.length > 0 && ghostPresentation.every(s => s.readonly && s.restored && s.exact && s.visible),ghostPresentation);
}

const events = await page.evaluate(() => {
  const completions = [], minis = [], reinforcements = [], targeting = [];
  const event = __piConfig.event, frost = event === 'frostlegion';
  for (const spec of __piSpecs) {
    __piScene(); delete game.eventCompletions[event]; game.lanternNight.pending = false;
    if (frost) { game.frostLegionDefeated = false; delete game.townArrivals[E.SANTA]; }
    game.startEvent(event); startWave(game.event);
    const wave = game.event.wave === 1 && game.event.pending === EVENT_WAVES[event].sizes[0] && game.event.minisPending === 0 && EVENT_WAVES[event].trash.includes(spec.type);
    spawnEventEnemy(spec.type); const e = game.entities[game.entities.length - 1]; e.x = __piOrigin.x; e.y = game.player.y - 40;
    e.attackCd = spec.shoot ? 0.001 : 999; game.player.x = e.x + 200; game.player.y = e.y; __piStep(e);
    game.event.wave = EVENT_WAVES[event].sizes.length; game.event.pending = game.event.minisPending = 0;
    const live = __piRender(e), flag = e.eventEnemy && eventAliveCount() === 1;
    hitEntity(e,e.hp + e.def + 100,0,0,game); const before = __piState(); renderGame(game,ctx2d);
    const waiting = before === __piState() && game.event !== null && !game.eventCompletions[event] && (!frost || !game.frostLegionDefeated && !game.townArrivals[E.SANTA]);
    updateEvents(1 / 60); const after = __piState(); renderGame(game,ctx2d);
    const readonly = after === __piState(); let progression = true;
    if (frost) {
      progression = game.frostLegionDefeated && !game.townArrivals[E.SANTA] && !game.entities.some(e => e.type === E.SANTA);
      updateTownArrivals();
      progression = progression && game.townArrivals[E.SANTA] && game.entities.filter(e => e.type === E.SANTA && !e.dead).length === 1;
      const town = __piState(); for (let i = 0; i < 3; i++) renderGame(game,ctx2d);
      progression = progression && town === __piState();
    }
    completions.push({ kind:spec.kind,wave,flag,live,waiting,readonly,progression,finished:game.event === null && game.eventCompletions[event] && game.lanternNight.pending === !__piConfig.noLantern });
  }
  if (__piConfig.bosses || __piConfig.minis) {
  const names = __piConfig.minis || ['piratecaptain','flyingdutchman'];
  __piScene(); game.startEvent(event); game.event.wave = EVENT_WAVES[event].sizes.length - 1; startWave(game.event);
  for (let i = 0; i < names.length; i++) {
    const pending = game.event.pending, mini = game.event.minisPending, before = __piState(); renderGame(game,ctx2d);
    const readonly = before === __piState(); game.event.t = 0; updateEvents(1 / 60);
    const bosses = game.entities.filter(e => e.boss), expected = names[i];
    const after = __piState(); renderGame(game,ctx2d);
    minis.push({ readonly:readonly && after === __piState(),correct:mini === names.length - i && game.event.minisPending === mini - 1 && game.event.pending === pending - 1 && bosses[i].boss === expected && bosses[i].eventEnemy });
  }
  }
  if (__piConfig.bosses) {
  for (const bossName of ['piratecaptain','flyingdutchman']) {
    __piScene(); game.spawnBoss(bossName); const boss = game.entities.find(e => e.boss === bossName); boss.hp = boss.maxHp * 0.4; boss.attackTimer = 999; boss.summonTimer = 0.001;
    const random = Math.random; try { Math.random = () => 0; bossStep(boss,game); } finally { Math.random = random; }
    const child = game.entities.find(e => !e.boss), expected = bossName === 'piratecaptain' ? E.PARROT : E.PIRATECORSAIR;
    reinforcements.push({ bossName,...__piRender(child),correct:!!child && child.type === expected && child.eventEnemy && !child.minion && game.entities.length === 2 && game.bossBars.length === 1 });
  }
  }
  const host = Net.isHost, remote = Net.remotePlayers;
  try {
    Net.isHost = () => true;
    for (const spec of __piSpecs) for (const dying of [false,true]) {
      __piScene(); const e = __piEnemy(spec); e.attackCd = spec.shoot ? 0.001 : 999; e.timer = 999; const x = e.x;
      game.player.x = e.x - 300; game.player.y = e.y; Net.remotePlayers = { fixture:{ x:e.x + 150,y:e.y,w:20,h:40,dying } };
      __piStep(e); const target = spec.local || dying ? game.player : Net.remotePlayers.fixture, shot = game.projectiles.list[0], angle = Math.atan2(target.y - spec.aimOffset - e.y,target.x - e.x);
      const side = target.x < x ? -1 : 1, move = side * e.speed * (spec.fly ? 1 : spec.hop ? 0.35 : 0.1);
      targeting.push({ kind:spec.kind,dying,...__piRender(e),correct:spec.shoot ? !!shot && Math.abs(shot.vx - Math.cos(angle) * spec.shotSpeed) < 1e-7 && Math.abs(shot.vy - Math.sin(angle) * spec.shotSpeed) < 1e-7 :
        Math.abs(e.x - x - move) < 1e-7 && (spec.fly || e.dir === side) && game.projectiles.list.length === 0 });
    }
  } finally { Net.isHost = host; Net.remotePlayers = remote; }
  return { completions,minis,reinforcements,targeting };
});
check(results,'Invasion flags, first wave, last kill and Lantern Night stay simulation-owned',events.completions.every(s => s.wave && s.flag && stable(s.live) && s.waiting && s.readonly && s.finished),events.completions);
if (config.bosses || config.minis) check(results,'Final-wave miniboss spawning remains owned by updateEvents',events.minis.length > 0 && events.minis.every(s => s.readonly && s.correct),events.minis);
if (config.bosses) {
check(results,'Real boss-spawned Parrots and Corsairs keep event flags and single records',events.reinforcements.every(s => s.correct && stable(s)),events.reinforcements);
} else if (config.event === 'frostlegion') {
  check(results,'Frost Legion defeat and Santa arrival require real event/town updates',events.completions.every(s => s.progression),events.completions);
}
check(results,'Real AI retains its local firing target or nearest-living multiplayer pursuit',events.targeting.length === config.specs.length * 2 && events.targeting.every(s => s.correct && stable(s)),events.targeting);
const dawn = config.night ? await runMoonDawnProbe(page) : null;
if (dawn) check(results,'Dawn holds living moon enemies without spawning and only updates end the event without Lantern Night',dawn.length === config.specs.length * 6 && dawn.every(s => stable(s.live) && s.held && s.waiting && s.finished && s.readonly),dawn);
const eclipse = config.eclipse ? await runEclipseEventProbe(page) : null;
if (eclipse) {
  check(results,'Exact any-mech, mechDone, Plantera trash pools and Mothron gates remain simulation-owned',eclipse.gates.length === 32 && eclipse.gates.every(s => s.correct && s.readonly),eclipse.gates);
  check(results,'Day boundaries retain living Eclipse enemies and only night updates end the event without Lantern Night',eclipse.daylight.length === config.specs.length * 8 && eclipse.daylight.every(s => stable(s.live) && s.correct && s.readonly),eclipse.daylight);
}
let deployment = null;
if (config.deploys) {
  deployment = await runMartianDeploymentProbe(page);
  check(results,'Engineer deployment readiness, live-turret cap, offsets and flags remain simulation-owned',deployment.rows.length === 36 && deployment.rows.every(s => s.readyReadonly && stable(s.drawn) && s.count && s.cooldown && s.placement && s.noShots && s.noLoot),deployment.rows);
  check(results,'Deployed event turrets hold invasion completion until the real last kill',Object.values(deployment.completion).every(Boolean),deployment.completion);
  check(results,'Final Martian Saucer spawning remains owned by updateEvents',deployment.miniboss.readonly && deployment.miniboss.correct,deployment.miniboss);
}
const scenarios = await runInvasionScenarios(page);
check(results,'Wet/dry, motion/attack and left/right event render scenarios are read-only',scenarios.length === (config.scenarioStates || ['normal','jumping','fired']).length * 4 && scenarios.every(s => s.calls === config.specs.length && s.readonly && s.shots === (s.pose === 'fired' ? config.specs.filter(q => q.shoot).length : 0) && s.cooldowns && s.event && s.bodies && s.movement && s.noLoot && s.noChildren),scenarios);
let roster = null;
if (config.frostMoonCoverage) {
  roster = await page.evaluate(() => {
    __piScene(); const before = __piState(), c = document.createElement('canvas'); c.width = c.height = 320;
    const cases = EVENT_WAVES.frostmoon.trash.map(type => {
      const e = makeEntity(type,0,0), state = JSON.stringify(e), ctx = c.getContext('2d'); ctx.clearRect(0,0,320,320);
      const supported = CombatArt.drawEnemy(ctx,game,e,{ x:0,y:0 },320,320);
      return { type,supported,expected:true,readonly:state === JSON.stringify(e),single:!e.segments && !e.arms,
        visible:ctx.getImageData(0,0,320,320).data.some((v,i) => i % 4 === 3 && v) };
    });
    return { cases,readonly:before === __piState(),unique:new Set(EVENT_WAVES.frostmoon.trash).size };
  });
  check(results,'All nine real Frost Moon trash types now have original single-body artwork',roster.unique === 9 && roster.cases.length === 9 && roster.readonly && roster.cases.every(s => s.supported && s.readonly && s.single && s.visible),roster);
}
if (config.completeMartianRoster) {
  roster = await page.evaluate(() => {
    __piScene(); const pool = EVENT_WAVES.martianmadness.trash, before = __piState();
    const c = document.createElement('canvas'); c.width = c.height = 320;
    const cases = pool.map(type => {
      const e = makeEntity(type,0,0), state = JSON.stringify(e); c.getContext('2d').clearRect(0,0,320,320);
      const supported = CombatArt.drawEnemy(c.getContext('2d'),game,e,{ x:0,y:0 },320,320);
      return { type,supported,readonly:state === JSON.stringify(e),single:!e.segments && !e.arms,
        visible:c.getContext('2d').getImageData(0,0,320,320).data.some((v,i) => i % 4 === 3 && v) };
    });
    return { cases,readonly:before === __piState(),unique:new Set(pool).size };
  });
  check(results,'All ten real Martian trash types now draw as original single-body artwork',roster.unique === 10 && roster.cases.length === 10 && roster.readonly && roster.cases.every(s => s.supported && s.readonly && s.single && s.visible),roster);
}

const sheet = await page.evaluate(() => {
  const c = document.createElement('canvas'); c.width = Math.max(960,__piSpecs.length * 288); c.height = 760; const ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0,0,c.width,c.height); ctx.fillStyle = '#ecd49e'; ctx.font = '18px monospace'; ctx.fillText('TREE / ' + __piConfig.title,20,30);
  __piSpecs.forEach((spec,i) => [false,true].forEach((active,row) => {
    const x = i * 288, y = 50 + row * 350; ctx.drawImage(CombatArt.enemySprite(spec.kind,row ? 3 : 1,active,false),x,y,288,288);
    ctx.fillStyle = '#d9d5c4'; ctx.font = '15px monospace'; ctx.fillText(spec.kind,x + 12,y + 306);
    ctx.fillStyle = '#9cabc6'; ctx.fillText(!row ? 'normal' : spec.shoot ? 'cooldown release' : spec.fly ? 'flight cycle' : 'upward jump',x + 12,y + 328);
  })); return c.toDataURL('image/png');
});
writeFileSync(dir + '/' + config.name + '-artwork.png',Buffer.from(sheet.split(',')[1],'base64'));
const captureStates = (config.captureStates || ['normal','jumping','fired']).concat(config.deploys ? ['deployed'] : []);
for (const pose of captureStates) {
  await page.evaluate(pose => {
    __piScene(); const o = __piOrigin, p = game.player;
    __piSpecs.forEach((spec,i) => {
      const e = __piEnemy(spec); e.x += __piX(i); if (spec.fly) e.y -= 60;
      e.attackCd = pose === 'fired' ? 0.001 : 0.5;
      if (spec.hop) e.timer = pose === 'jumping' ? 0 : 0.5;
      if (pose === 'deployed' && spec.type === E.MARTIANENGINEER) e.deployCd = 0;
      p.x = e.x + (i % 2 ? -1 : 1) * (pose === 'jumping' ? 40 : 200); p.y = e.y;
      __piStep(e,pose === 'jumping' ? 0 : 0.5); if (pose === 'jumping') for (let tick = 1; tick < 6; tick++) __piStep(e);
    });
    if (pose === 'deployed' && !__piSpecs.some(s => s.type === E.MARTIANENGINEER)) {
      // A real existing Engineer deploys alongside the explicit heavy roster.
      const e = __piEnemy({ type:E.MARTIANENGINEER }); e.x += 360; e.eventEnemy = true; e.attackCd = 999; e.deployCd = 0;
      p.x = e.x - 200; p.y = e.y; __piStep(e);
    }
    p.x = o.x - 90; p.y = o.gy * TILE - p.h / 2 - 0.01; game.cam.x = o.x; game.cam.y = p.y - 100;
    updateHud(); updateCrosshair(); window.__piHook = CombatArt.drawEnemy; CombatArt.drawEnemy = () => false; render();
  },pose);
  await page.screenshot({ path:dir + `/${pose}-before.png` });
  await page.evaluate(() => { CombatArt.drawEnemy = __piHook; delete window.__piHook; render(); });
  await page.screenshot({ path:dir + `/${pose}-after.png` });
}
writeFileSync(dir + '/index.html',`<!doctype html><meta charset="utf-8"><title>${config.title} artwork</title>
<style>body{background:#202534;color:#dedbc9;font:16px monospace;max-width:1440px;margin:24px auto;padding:0 16px}img{width:100%;image-rendering:pixelated}.row{display:flex;gap:16px}figure{margin:8px 0;flex:1}a{color:#ecd49e}</style>
<h1>${config.title}</h1><p>Original pixel artwork; movement, attacks, collision and rewards remain unchanged.</p><img src="${config.name}-artwork.png" alt="Original invasion source sprites">
${captureStates.map(state => `<h2>${state}</h2><p>${state === 'jumping' ? 'Six real AI ticks with controlled jump RNG' : 'One real AI tick with ' + (state === 'fired' ? 'explicit shot readiness' : state === 'deployed' ? 'explicit deployment readiness' : 'waiting cooldowns')}. Room, placement, temporary targets and HP are disposable fixtures. Fired projectiles and deployed turrets are real simulation records.</p><div class="row"><figure><img src="${state}-before.png" alt="Legacy ${state} creatures"><figcaption>Before — only general-enemy artwork disabled</figcaption></figure><figure><img src="${state}-after.png" alt="New ${state} creatures"><figcaption>After — same combat state</figcaption></figure></div>`).join('')}
<p><a href="../ranged-goblin/index.html">Ranged goblin gallery</a> · <a href="../pirates/index.html">Pirate gallery</a></p>`);
await assertNoBrowserErrors(results);
await finish(results,browser,config.name + '-graphics',{ sources,ai,presentation,ghostPresentation,events,scenarios,deployment,roster,dawn,eclipse });
}
