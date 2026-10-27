// Combat artwork and read-only rendering checks in a disposable browser world.
// "Before" captures deliberately disable only the new draw hooks, revealing
// the retained legacy renderer with exactly the same boss/weapon state.
import { mkdirSync, writeFileSync } from 'node:fs';
import { setupAudit, check, assertNoBrowserErrors, finish } from './audit2/lib.mjs';

const dir = 'test-results/graphics/combat';
mkdirSync(dir, { recursive: true });
const { browser, page, results } = await setupAudit();
const names = ['kingslime', 'eyeofcthulhu', 'eaterofworlds', 'brainofcthulhu', 'queenbee', 'skeletron', 'wallofflesh',
  'retinazer', 'spazmatism', 'destroyer', 'skelprime', 'queenslime', 'plantera', 'golem', 'duke', 'empress', 'moonlord',
  'cultist', 'pillar_solar', 'pillar_vortex', 'pillar_nebula', 'pillar_stardust', 'deerclops', 'mourningwood', 'pumpking',
  'everscream', 'santank', 'icequeen', 'martiansaucer', 'goblinwarlock', 'piratecaptain', 'flyingdutchman',
  'mothron', 'darkmage', 'ogre', 'betsy'];
await page.evaluate(() => {
  game.paused = true;
  game.player.invuln = 0;
  game.weather.active = false;
  game.fx = []; game.fxTexts = []; game.pickups = [];
  document.getElementById('message').style.display = 'none';
  document.getElementById('interact').style.display = 'none';
  var w = game.world, cx = Math.floor(w.spawnX / TILE), gy = w.surfaceY[cx];
  for (var x = cx - 50; x <= cx + 50; x++) {
    for (var y = gy - 24; y <= gy; y++) {
      w.set(x, y, y === gy ? T.STONE : T.AIR); w.setWall(x, y, WALL.NONE);
    }
    w.surfaceY[x] = gy;
  }
  game.player.x = cx * TILE; game.player.y = gy * TILE - 16;
  game.cam.x = game.player.x + 90; game.cam.y = game.player.y - 70;
  window.__combatOrigin = { x:game.player.x, y:game.player.y };
  window.__ooaCombat = function(name, side) {
    var tx = cx + 10, ty = gy - 1, progress = game.bossesDefeated;
    w.set(tx,ty,T.ETERNIASTAND);
    // Start the real event at a valid stand, temporarily selecting the tier.
    // Restore progression immediately; skipping to the final wave is a pose
    // fixture, not a shortcut or progression change in the game itself.
    game.bossesDefeated = Object.assign({},progress,{ golem:name === 'betsy', twins:name === 'ogre', destroyer:false, skelprime:false });
    try { startOldOnesArmy(tx,ty); } finally { game.bossesDefeated = progress; }
    var ev = game.event;
    ev.wave = OOA_TIERS[ev.tier].waves.length - 1; ev.state = 'fighting';
    ev.bossSpawned = true; ev.pending = 0; ev.etherianMana = 27;
    game.flashT = 0; document.getElementById('screenflash').style.opacity = 0;
    return spawnOldOnesArmyBoss(name,side === -1 ? -1 : 1);
  };
  window.__spawnCombatBoss = function(name, side) {
    game.entities = []; game.bossBars = []; game.projectiles.list = []; game.fx = []; game.fxTexts = []; game.lunarPillars = [];
    if (game.event && game.event.type === 'oldonesarmy') game.event = null;
    var spawns = { kingslime:spawnKingSlime, eyeofcthulhu:spawnEyeOfCthulhu, eaterofworlds:spawnEaterOfWorlds,
      brainofcthulhu:spawnBrainOfCthulhu, queenbee:spawnQueenBee, skeletron:spawnSkeletron, wallofflesh:spawnWallOfFlesh,
      destroyer:spawnDestroyer, skelprime:spawnSkeleton,
      queenslime:spawnQueenSlime, plantera:spawnPlantera, golem:spawnGolem, duke:spawnDuke,
      empress:spawnEmpress, moonlord:spawnMoonLord, cultist:spawnCultist,
      deerclops:spawnDeerclops, mourningwood:spawnMourningWood, pumpking:spawnPumpking,
      everscream:spawnEverscream, santank:spawnSantank, icequeen:spawnIceQueen,
      martiansaucer:spawnMartianSaucer, goblinwarlock:spawnGoblinWarlock,
      piratecaptain:spawnPirateCaptain, flyingdutchman:spawnFlyingDutchman, mothron:spawnMothron };
    var pair = name === 'retinazer' || name === 'spazmatism' ? spawnTwins(game) : null;
    var ooa = ['darkmage','ogre','betsy'].indexOf(name) >= 0;
    var e = pair ? pair[name === 'retinazer' ? 0 : 1] :
      ooa ? __ooaCombat(name,side) : name.indexOf('pillar_') === 0 ? spawnLunarPillar(game, name.slice(7)) : spawns[name](game);
    // Exercise real mechanical AI to unfold arms and create the Destroyer's
    // probes before freezing the pose. Rendering itself must not advance them.
    if (name === 'destroyer') destroyerStep(e, game);
    if (name === 'skelprime') {
      var invuln = game.player.invuln; game.player.invuln = 999;
      for (var tick = 0; tick < 30; tick++) skelStep(e, game);
      game.player.invuln = invuln;
    }
    var dx = ooa ? 0 : __combatOrigin.x + 200 - e.x, dy = ooa ? 0 : __combatOrigin.y - 100 - e.y;
    (pair || [e]).forEach(function(b) {
      b.x += dx; b.y += dy;
      (b.arms || []).concat(b.segments || [], b.probes || []).forEach(function(s) { s.x += dx; s.y += dy; });
    });
    game.projectiles.list.forEach(function(p) { p.x += dx; p.y += dy; });
    e.phase2 = false; e.flash = 0;
    game.timeOfDay = name === 'kingslime' || name === 'queenbee' || name === 'mothron' ? 0.5 : 0.01;
    window.__combatBoss = e;
    updateHud();
    return e;
  };
  window.__legacyCombat = function(enabled) {
    var keys = ['drawBoss','drawProjectile','drawSwing','drawFX','drawOOAWorld','drawOOASentry','drawOOAEnemy','drawEnemy'];
    if (enabled) {
      window.__combatHooks = {};
      keys.forEach(function(k) { __combatHooks[k] = CombatArt[k]; CombatArt[k] = function() { return false; }; });
    } else {
      keys.forEach(function(k) { CombatArt[k] = __combatHooks[k]; });
      delete window.__combatHooks;
    }
  };
  window.__combatState = function() {
    function hash(a) { var h = 2166136261; for (var i = 0; i < a.length; i++) h = Math.imul(h ^ a[i], 16777619); return h >>> 0; }
    function data(e) {
      var o = {};
      Object.keys(e).sort().forEach(function(k) {
        var v = e[k];
        if (v === null || ['number','string','boolean'].indexOf(typeof v) >= 0) o[k] = v;
      });
      if (e.arms) o.arms = e.arms.map(data);
      if (e.segments) o.segments = e.segments.map(data);
      if (e.probes) o.probes = e.probes.map(data);
      if (e.dash) o.dash = data(e.dash);
      if (e.charge && typeof e.charge === 'object') o.charge = data(e.charge);
      if (e.pillarEnemies) o.pillarEnemies = e.pillarEnemies.slice();
      return o;
    }
    return JSON.stringify({ entities:game.entities.map(data), projectiles:game.projectiles.list.map(data),
      player:data(game.player), inventory:game.player.inventory, fx:game.fx, texts:game.fxTexts, flashT:game.flashT,
      tiles:hash(w.tiles), walls:hash(w.walls), hp:hash(w.hp), progress:game.bossesDefeated,
      hardmode:game.hardmode, time:game.timeOfDay, pillars:(game.lunarPillars || []).map(data),
      event:game.event, eventCompletions:game.eventCompletions, pickups:game.pickups });
  };
});

const sprites = await page.evaluate(names => {
  var nonempty = 0, binary = true, flashes = true, phaseDistinct = 0, animationDistinct = 0, total = 0;
  function bytes(c) { return c.getContext('2d').getImageData(0, 0, c.width, c.height).data; }
  function equal(a, b) { return a.every(function(v, i) { return v === b[i]; }); }
  names.forEach(function(name) {
    if (!equal(bytes(CombatArt.bossSprite(name, false, 0, false)), bytes(CombatArt.bossSprite(name, true, 0, false)))) phaseDistinct++;
    if (!equal(bytes(CombatArt.bossSprite(name, false, 0, false)), bytes(CombatArt.bossSprite(name, false, 1, false)))) animationDistinct++;
    [false, true].forEach(function(phase) {
      for (var f = 0; f < 4; f++) {
        var normal = bytes(CombatArt.bossSprite(name, phase, f, false));
        var flash = bytes(CombatArt.bossSprite(name, phase, f, true));
        var ink = false;
        for (var i = 3; i < normal.length; i += 4) {
          if (normal[i] !== 0 && normal[i] !== 255) binary = false;
          if (normal[i]) ink = true;
          if (normal[i] !== flash[i]) flashes = false;
          if (flash[i] && (flash[i - 3] !== 255 || flash[i - 2] !== 245 || flash[i - 1] !== 220)) flashes = false;
        }
        if (ink) nonempty++;
        total++;
      }
    });
  });
  return { total, nonempty, binary, flashes, phaseDistinct, animationDistinct };
}, names);
check(results, 'All ' + names.length + ' boss forms have nonempty, crisp four-frame art in both visual states',
  sprites.total === names.length * 8 && sprites.nonempty === names.length * 8 && sprites.binary, sprites);
check(results, 'Every boss has a distinct phase-two or exposed-shield appearance', sprites.phaseDistinct === names.length);
check(results, 'Every boss family has visible animation frames', sprites.animationDistinct === names.length);
check(results, 'Hit flashes preserve the exact sprite alpha mask', sprites.flashes);

for (const name of names) {
  const d = await page.evaluate(name => {
    var e = __spawnCombatBoss(name), before = __combatState();
    for (var i = 0; i < 8; i++) renderGame(game, ctx2d);
    return { spawned:e.boss === name || (e.boss === 'twins' && e.sub === name) ||
      (e.boss === 'lunar' && 'pillar_' + e.pillarType === name), unchanged:before === __combatState(), w:e.w, h:e.h };
  }, name);
  check(results, name + ': real spawned boss renders without changing combat/world state', d.spawned && d.unchanged, d);
  await page.evaluate(() => { __legacyCombat(true); render(); });
  await page.screenshot({ path: dir + '/' + name + '-before.png' });
  await page.evaluate(() => { __legacyCombat(false); render(); });
  await page.screenshot({ path: dir + '/' + name + '-after.png' });
  const phase = await page.evaluate(() => {
    __combatBoss.phase2 = true;
    if (__combatBoss.boss === 'lunar') { __combatBoss.shieldDown = true; __combatBoss.shieldHp = 0; }
    var before = __combatState(); render();
    return before === __combatState();
  });
  check(results, name + (name.indexOf('pillar_') === 0 ? ': exposed render is read-only' : ': phase-two render is read-only'), phase);
  await page.screenshot({ path: dir + '/' + name + '-phase2.png' });
}

const limbs = await page.evaluate(() => {
  function image(e) {
    var c = document.createElement('canvas'); c.width = 240; c.height = 220;
    CombatArt.drawBoss(c.getContext('2d'), game, e, { x:e.x, y:e.y }, 240, 220);
    return c.getContext('2d').getImageData(0, 0, 240, 220).data;
  }
  var e = __spawnCombatBoss('skeletron'); e.arms[0].dead = true;
  var actual = image(e), expected = image(Object.assign({}, e, { arms:e.arms.filter(function(a) { return !a.dead; }) }));
  var handHidden = actual.every(function(v, i) { return v === expected[i]; });
  var worm = __spawnCombatBoss('eaterofworlds');
  worm.segments.forEach(function(s) { s.dead = true; });
  var segment = worm.segments[5]; segment.x = worm.x + 300; segment.y = worm.y;
  function segmentPixels(dead) {
    segment.dead = dead;
    var c = document.createElement('canvas'); c.width = c.height = 128;
    CombatArt.drawBoss(c.getContext('2d'), game, worm, { x:segment.x, y:segment.y }, 128, 128);
    return c.getContext('2d').getImageData(0, 0, 128, 128).data.some(function(v, i) { return i % 4 === 3 && v > 0; });
  }
  return { handHidden, liveSegment:segmentPixels(false), deadSegment:segmentPixels(true) };
});
check(results, 'Destroyed Skeletron hands and Eater segments stay hidden', limbs.handHidden && limbs.liveSegment && !limbs.deadSegment, limbs);

const mechanical = await page.evaluate(() => {
  function pixels(kind, phase, frame, flash) {
    var c = CombatArt.bossSprite(kind, phase, frame, flash);
    return c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
  }
  var parts = ['destroyerbody','destroyertail','probe','prime_laser','prime_cannon','prime_saw','prime_vice'];
  var crisp = true, masks = true, inked = 0;
  parts.forEach(function(kind) {
    var normal = pixels(kind, false, 1, false), flash = pixels(kind, false, 1, true);
    if (normal.some(function(v, i) { return i % 4 === 3 && v > 0; })) inked++;
    for (var i = 3; i < normal.length; i += 4) {
      if (normal[i] !== 0 && normal[i] !== 255) crisp = false;
      if (normal[i] !== flash[i]) masks = false;
    }
  });
  var tools = ['prime_laser','prime_cannon','prime_saw','prime_vice'].map(function(kind) {
    // Compare only alpha: a different paint color is not a new silhouette.
    return Array.from(pixels(kind, false, 1, false)).filter(function(_, i) { return i % 4 === 3; }).join(',');
  });
  var toolKinds = new Set(tools).size;
  var d = __spawnCombatBoss('destroyer'), before = __combatState();
  for (var frame = 0; frame < 8; frame++) renderGame(game, ctx2d);
  var destroyerReadOnly = before === __combatState(), segmentCount = d.segments.length, probeCount = d.probes.length;
  function visible(e, part, dead) {
    part.dead = dead;
    var c = document.createElement('canvas'); c.width = c.height = 128;
    CombatArt.drawBoss(c.getContext('2d'), game, e, { x:part.x, y:part.y }, 128, 128);
    return c.getContext('2d').getImageData(0, 0, 128, 128).data.some(function(v, i) { return i % 4 === 3 && v > 0; });
  }
  d.segments.concat(d.probes).forEach(function(p) { p.dead = true; });
  var segment = d.segments[5]; segment.x = d.x + 600; segment.y = d.y;
  var segmentVisible = visible(d, segment, false), segmentHidden = !visible(d, segment, true);
  var pr = d.probes[0]; pr.x = d.x + 600; pr.y = d.y;
  var probeVisible = visible(d, pr, false), probeHidden = !visible(d, pr, true);
  var prime = __spawnCombatBoss('skelprime'), armHidden = true;
  prime.arms.forEach(function(a) { a.dead = true; });
  prime.arms.forEach(function(a) {
    a.x = prime.x + 600; a.y = prime.y;
    if (!visible(prime, a, false) || visible(prime, a, true)) armHidden = false;
  });
  prime.armCount = 0;
  var spinBefore = prime.spin, primeBefore = __combatState();
  renderGame(game, ctx2d);
  var spinReadOnly = prime.spin === spinBefore && primeBefore === __combatState();
  var twin = __spawnCombatBoss('retinazer'), other = twin.sibling;
  twin.x = __combatOrigin.x + 160; twin.y = __combatOrigin.y - 130;
  other.x = __combatOrigin.x - 150; other.y = __combatOrigin.y - 160; other.phase2 = true;
  var twinsBefore = __combatState(); renderGame(game, ctx2d);
  var twinsReadOnly = twinsBefore === __combatState() && !twin.phase2 && other.phase2;
  var called = [], hook = CombatArt.drawBoss; twin.dead = true;
  CombatArt.drawBoss = function(ctx, g, e, cam, w, h) { called.push(e.sub || e.boss); return hook(ctx, g, e, cam, w, h); };
  try { renderGame(game, ctx2d); } finally { CombatArt.drawBoss = hook; }
  var survivor = called.indexOf('spazmatism') >= 0 && called.indexOf('retinazer') < 0;
  return { crisp, masks, inked, toolKinds, segmentCount, probeCount, destroyerReadOnly,
    segmentVisible, segmentHidden, probeVisible, probeHidden, armHidden, spinReadOnly, twinsReadOnly, survivor };
});
check(results, 'Mechanical segments, probes and all four arm tools have crisp alpha-preserving artwork', mechanical.crisp && mechanical.masks && mechanical.inked === 7, mechanical);
check(results, 'Prime laser/cannon/saw/vice tools have four distinct silhouettes', mechanical.toolKinds === 4);
check(results, 'Real Destroyer AI produces 62 segments and live probes without rendering advancing them',
  mechanical.segmentCount === 62 && mechanical.probeCount === 3 && mechanical.destroyerReadOnly);
check(results, 'Destroyed mechanical segments, probes and individual Prime arms stay hidden',
  mechanical.segmentVisible && mechanical.segmentHidden && mechanical.probeVisible && mechanical.probeHidden && mechanical.armHidden);
check(results, 'Prime all-arms-destroyed spin renders without advancing its simulation', mechanical.spinReadOnly);
check(results, 'Twin phases remain independent and the survivor still renders after its sibling dies', mechanical.twinsReadOnly && mechanical.survivor);
await page.evaluate(() => {
  var e = __spawnCombatBoss('retinazer');
  e.x = __combatOrigin.x + 160; e.y = __combatOrigin.y - 130;
  e.sibling.x = __combatOrigin.x - 150; e.sibling.y = __combatOrigin.y - 160;
  e.sibling.phase2 = true; render();
});
await page.screenshot({ path: dir + '/twins-mixed-phases.png' });
await page.evaluate(() => {
  var e = __spawnCombatBoss('skelprime'); e.arms.forEach(function(a) { a.dead = true; });
  e.armCount = 0; render();
});
await page.screenshot({ path: dir + '/prime-disarmed.png' });

const hardmode = await page.evaluate(() => {
  function source(name, phase, frame) {
    return CombatArt.bossSprite(name, phase, frame, false).getContext('2d').getImageData(0, 0, 96, 96).data;
  }
  function count(bytes, test) {
    var n = 0;
    for (var y = 0; y < 96; y++) for (var x = 0; x < 96; x++) {
      var i = (y * 96 + x) * 4;
      if (bytes[i + 3] && test(x - 48, y - 48, bytes[i], bytes[i + 1], bytes[i + 2])) n++;
    }
    return n;
  }
  var q1 = source('queenslime', false, 0), q2 = source('queenslime', true, 0);
  var wing = function(x) { return Math.abs(x) > 22; };
  var wings = count(q1, wing) === 0 && count(q2, wing) > 100;
  var mouth = function(x, y, r, g, b) { return r === 48 && g === 43 && b === 60; };
  var p1 = source('plantera', false, 0), p2 = source('plantera', true, 0);
  var tendril = function(x, y) { return Math.abs(x) > 22 && Math.abs(y) > 18; };
  var bloom = count(p2, mouth) > count(p1, mouth) * 2 && count(p2, tendril) > count(p1, tendril);
  var crown = function(x, y) { return Math.abs(x) < 11 && y < -27; };
  var raised = count(source('golem', false, 0), crown) === 0 && count(source('golem', true, 0), crown) > 50;
  var margins = true;
  ['queenslime','plantera','golem','duke','empress','moonlord','cultist','pillar_solar','pillar_vortex','pillar_nebula','pillar_stardust','deerclops','mourningwood','pumpking','everscream','santank','icequeen','martiansaucer','goblinwarlock','piratecaptain','flyingdutchman','mothron','darkmage','ogre','betsy'].forEach(function(name) {
    [false,true].forEach(function(phase) {
      for (var frame = 0; frame < 4; frame++) {
        if (count(source(name, phase, frame), function(x, y) { return x <= -47 || x >= 46 || y <= -47 || y >= 46; })) margins = false;
      }
    });
  });
  function image(e) {
    var c = document.createElement('canvas'); c.width = c.height = 256;
    var drawn = CombatArt.drawBoss(c.getContext('2d'), game, e, { x:e.x, y:e.y }, 256, 256);
    return { drawn, bytes:c.getContext('2d').getImageData(0, 0, 256, 256).data };
  }
  var duke = __spawnCombatBoss('duke'), px = game.player.x;
  game.player.x = duke.x + 100; var right = image(duke);
  game.player.x = duke.x - 100; var left = image(duke); game.player.x = px;
  var facing = right.drawn && left.drawn, asymmetric = false;
  for (var y = 0; y < 256; y++) for (var x = 0; x < 256; x++) for (var ch = 0; ch < 4; ch++) {
    var i = (y * 256 + x) * 4 + ch, reflected = (y * 256 + 255 - x) * 4 + ch;
    if (left.bytes[i] !== right.bytes[reflected]) facing = false;
    if (left.bytes[i] !== right.bytes[i]) asymmetric = true;
  }
  var steps = { queenslime:queenSlimeStep, plantera:planteraStep, golem:golemStep, duke:dukeStep }, states = [];
  Object.keys(steps).forEach(function(name) {
    [false,true].forEach(function(phase) {
      var e = __spawnCombatBoss(name); e.phase2 = phase; e.attackTimer = -3;
      if (name === 'duke') e.bubbleTimer = 0;
      var invuln = game.player.invuln; game.player.invuln = 999;
      steps[name](e, game); game.player.invuln = invuln;
      var before = __combatState(), charge = name !== 'duke' || (e.charge && e.charge.t > 0);
      var drawn = image(e).drawn;
      for (var f = 0; f < 8; f++) renderGame(game, ctx2d);
      states.push({ name, phase, drawn, charge:!!charge, unchanged:before === __combatState(),
        shots:game.projectiles.list.length, arms:e.arms.length, segments:e.segments.length });
    });
  });
  return { wings, bloom, raised, margins, facing:facing && asymmetric, states };
});
check(results, 'Queen Slime gains crystal wings only in phase two', hardmode.wings);
check(results, 'Plantera opens a larger toothed mouth and unfurls phase-two tendrils', hardmode.bloom);
check(results, 'Golem raises its carved head in phase two', hardmode.raised);
check(results, 'Duke Fishron mirrors its asymmetric snout/tail to face the player', hardmode.facing);
check(results, 'All new boss frames retain transparent source margins without clipping wings, fins or tendrils', hardmode.margins);
check(results, 'Real AI attack/charge states render read-only in both phases without inventing damageable parts',
  hardmode.states.every(s => s.drawn && s.charge && s.unchanged && s.arms === 0 && s.segments === 0 &&
    (s.name === 'queenslime' && !s.phase ? s.shots === 0 : s.shots > 0)), hardmode.states);

const lunar = await page.evaluate(names => {
  function pixels(name, phase, frame) {
    return CombatArt.bossSprite(name, phase, frame, false).getContext('2d').getImageData(0, 0, 96, 96).data;
  }
  function region(bytes, test) {
    var count = 0;
    for (var y = 0; y < 96; y++) for (var x = 0; x < 96; x++) {
      var i = (y * 96 + x) * 4;
      if (bytes[i + 3] && test(x - 48, y - 48, bytes[i], bytes[i + 1], bytes[i + 2])) count++;
    }
    return count;
  }
  var e0 = pixels('empress', false, 0), e1 = pixels('empress', false, 1), e2 = pixels('empress', true, 0);
  var wingPixels = region(e0, function(x) { return Math.abs(x) > 20; });
  var membrane = wingPixels > 150, flap = false, bandColors = new Set();
  for (var y = 0; y < 96; y++) for (var x = 0; x < 96; x++) {
    var i = (y * 96 + x) * 4;
    if (Math.abs(x - 48) > 20) {
      if (e0[i + 3] !== e1[i + 3]) flap = true;
      if (e0[i + 3]) bandColors.add([e0[i],e0[i + 1],e0[i + 2]].join(','));
    }
  }
  var bright = function(x, y, r, g, b) { return r > 220 && g > 190 && b > 150; };
  var radiant = region(e2, bright) > region(e0, bright) * 2;
  var core = function(x, y, r, g, b) { return Math.abs(x) < 10 && y > 16 && g > 170 && b > 150; };
  var exposed = region(pixels('moonlord', true, 0), core) > region(pixels('moonlord', false, 0), core) * 3;
  var eyes = [[0,-28],[-7,-20],[7,-20],[-31,-5],[31,-5]].every(function(pos) {
    return region(pixels('moonlord', false, 0), function(x,y,r,g,b) {
      return Math.abs(x - pos[0]) < 4 && Math.abs(y - pos[1]) < 3 && g > 150 && b > 140;
    }) > 5;
  });
  // More than 256 real phase/frame/flash keys force the bounded cache to evict
  // these initial entries. Regenerated art must still be byte-for-byte stable.
  var originals = ['empress','moonlord'].map(function(name) { return Array.from(pixels(name, false, 0)); });
  names.forEach(function(name) {
    [false,true].forEach(function(phase) {
      for (var frame = 0; frame < 4; frame++) [false,true].forEach(function(flash) { CombatArt.bossSprite(name, phase, frame, flash); });
    });
  });
  var stable = ['empress','moonlord'].every(function(name, i) {
    var regenerated = pixels(name, false, 0);
    return originals[i].every(function(v, n) { return v === regenerated[n]; });
  });
  var states = [];
  ['empress','moonlord'].forEach(function(name) {
    [false,true].forEach(function(phase) {
      var e = __spawnCombatBoss(name); e.phase2 = phase; e.attackTimer = 0;
      var invuln = game.player.invuln; game.player.invuln = 999;
      (name === 'empress' ? empressStep : moonLordStep)(e, game); game.player.invuln = invuln;
      var before = __combatState(), c = document.createElement('canvas'); c.width = c.height = 256;
      var drawn = CombatArt.drawBoss(c.getContext('2d'), game, e, { x:e.x,y:e.y }, 256, 256);
      for (var f = 0; f < 8; f++) renderGame(game, ctx2d);
      var shots = game.projectiles.list;
      states.push({ name, phase, drawn, unchanged:before === __combatState(), singleBody:game.entities.length === 1 &&
        !e.arms.length && !e.segments.length && !e.probes.length, shots:shots.length,
        blades:shots.filter(function(p) { return p.type === P.BLAZE; }).length,
        lasers:shots.filter(function(p) { return p.type === P.DEATHLASER; }).length,
        spheres:shots.filter(function(p) { return p.type === P.PHANTOMBOLT; }).length });
    });
  });
  return { membrane, wingPixels, flap, bands:bandColors.size, radiant, exposed, eyes, stable, states };
}, names);
check(results, 'Empress has filled multi-band wing membranes with visible silhouette flaps', lunar.membrane && lunar.flap && lunar.bands >= 5, lunar);
check(results, 'Empress phase two brightens the wing bands and ivory gown', lunar.radiant);
check(results, 'Moon Lord retains five visible eyes and exposes a larger luminous phase-two core', lunar.eyes && lunar.exposed);
check(results, 'Lunar artwork regenerates deterministically after bounded-cache eviction', lunar.stable);
check(results, 'Real Empress blade fans and Moon Lord eye/core barrages render read-only as single bodies',
  lunar.states.every(s => s.drawn && s.unchanged && s.singleBody &&
    (s.name === 'empress' ? s.blades === (s.phase ? 12 : 6) :
      s.lasers === (s.phase ? 9 : 1) && s.spheres === (s.phase ? 0 : 5))), lunar.states);

const progressionArt = await page.evaluate(() => {
  function image(e) {
    var c = document.createElement('canvas'); c.width = c.height = 320;
    var ctx = c.getContext('2d'), labels = [];
    // Isolate sprite comparisons from changing label glyphs, while verifying
    // exactly what the real draw hook sends to the browser's text renderer.
    ctx.fillText = function(text) { labels.push(text); };
    var drawn = CombatArt.drawBoss(ctx, game, e, { x:e.x,y:e.y }, 320, 320);
    return { drawn, labels, bytes:ctx.getImageData(0, 0, 320, 320).data };
  }
  function equal(a, b) { return a.every(function(v, i) { return v === b[i]; }); }
  var themes = ['solar','vortex','nebula','stardust'], silhouettes = [], fields = [], ai = [];
  var types = { solar:P.CURSEDFLAME, vortex:P.LASER, nebula:P.PHANTOMBOLT, stardust:P.MAGICBOLT };
  themes.forEach(function(theme) {
    var e = __spawnCombatBoss('pillar_' + theme), before = __combatState(), shielded = image(e);
    e.phase2 = true; var lowHealthPhase = image(e);
    var phaseIndependent = equal(shielded.bytes, lowHealthPhase.bytes);
    e.shieldHp = e.shieldMax * 0.75; var partial = image(e);
    e.shieldHp = 0; var zero = image(e);
    e.shieldDown = true; var exposed = image(e);
    var data = CombatArt.bossSprite('pillar_' + theme, true, 1, false).getContext('2d').getImageData(0, 0, 96, 96).data;
    silhouettes.push(Array.from(data).filter(function(_, i) { return i % 4 === 3; }).join(','));
    e.phase2 = false; e.shieldDown = false; e.shieldHp = e.shieldMax;
    fields.push({ theme, drawn:shielded.drawn && exposed.drawn, phaseIndependent,
      distinct:!equal(shielded.bytes, exposed.bytes), flagsPreserved:before === __combatState(),
      label100:shielded.labels.join() === 'Shield 100%', label75:partial.labels.join() === 'Shield 75%',
      label0:zero.labels.join() === 'Shield 0%', hidden:exposed.labels.length === 0,
      zeroStillShielded:equal(zero.bytes, shielded.bytes) });
    [false,true].forEach(function(down) {
      var pillar = __spawnCombatBoss('pillar_' + theme);
      pillar.shieldDown = down; pillar.shieldHp = down ? 0 : pillar.shieldMax;
      var invuln = game.player.invuln; game.player.invuln = 999;
      lunarPillarStep(pillar, game); game.player.invuln = invuln;
      var before = __combatState(), drawn = image(pillar).drawn;
      for (var frame = 0; frame < 8; frame++) renderGame(game, ctx2d);
      var guards = game.entities.filter(function(g) { return g !== pillar; });
      ai.push({ theme, down, drawn, unchanged:before === __combatState(),
        guardian:guards.length === 1 && pillar.pillarEnemies.indexOf(guards[0].type) >= 0 && guards[0].eventEnemy,
        noGuards:guards.length === 0, shots:game.projectiles.list.length,
        themedShots:game.projectiles.list.every(function(p) { return p.type === types[theme]; }) });
    });
  });
  var teleports = [];
  [false,true].forEach(function(phase) {
    var e = __spawnCombatBoss('cultist'); e.phase2 = phase;
    var x = e.x, y = e.y, invuln = game.player.invuln; game.player.invuln = 999;
    cultistStep(e, game); game.player.invuln = invuln;
    var before = __combatState(), drawn = image(e).drawn;
    for (var frame = 0; frame < 8; frame++) renderGame(game, ctx2d);
    teleports.push({ phase, drawn, moved:e.x !== x || e.y !== y, unchanged:before === __combatState(),
      effects:game.fx.filter(function(f) { return f.type === 'teleport'; }).length,
      timer:e.teleportTimer, shots:game.projectiles.list.length,
      phantom:game.projectiles.list.every(function(p) { return p.type === P.PHANTOMBOLT; }) });
  });
  return { silhouettes:new Set(silhouettes).size, fields, ai, teleports };
});
check(results, 'Four pillar themes have different alpha silhouettes, not merely different palettes', progressionArt.silhouettes === 4);
check(results, 'Pillar shield artwork follows shieldDown independently of phase2 and never changes shield flags',
  progressionArt.fields.every(p => p.drawn && p.phaseIndependent && p.distinct && p.flagsPreserved && p.zeroStillShielded), progressionArt.fields);
check(results, 'Pillars retain live 100%/75%/0% shield labels and hide the label only when exposed',
  progressionArt.fields.every(p => p.label100 && p.label75 && p.label0 && p.hidden));
check(results, 'Real shielded pillar AI spawns the right guardian without rendering advancing spawns or shields',
  progressionArt.ai.filter(s => !s.down).every(s => s.drawn && s.unchanged && s.guardian && s.shots === 0), progressionArt.ai);
check(results, 'Real exposed pillar AI emits three themed shots without rendering advancing its timers',
  progressionArt.ai.filter(s => s.down).every(s => s.drawn && s.unchanged && s.noGuards && s.shots === 3 && s.themedShots));
check(results, 'Real Cultist teleports, paired effects and four/eight phantom bolts remain rendering-independent',
  progressionArt.teleports.every(s => s.drawn && s.moved && s.unchanged && s.effects === 2 && s.timer > 2 && s.phantom && s.shots === (s.phase ? 8 : 4)), progressionArt.teleports);
await page.evaluate(() => render());
await page.screenshot({ path: dir + '/cultist-teleport.png' });
await page.evaluate(() => {
  var solar = __spawnCombatBoss('pillar_solar');
  var pillars = [solar, spawnLunarPillar(game, 'vortex'), spawnLunarPillar(game, 'nebula'), spawnLunarPillar(game, 'stardust')];
  pillars.forEach(function(e, i) {
    e.x = __combatOrigin.x - 240 + i * 160; e.y = __combatOrigin.y - 110;
    e.phase2 = i % 2 === 0; e.shieldDown = i === 3;
    e.shieldHp = e.shieldMax * [1,0.75,0,0][i];
  });
  document.getElementById('message').style.display = 'none'; render();
});
await page.screenshot({ path: dir + '/pillar-shield-states.png' });

const autumn = await page.evaluate(() => {
  function image(e) {
    var c = document.createElement('canvas'); c.width = c.height = 256;
    var drawn = CombatArt.drawBoss(c.getContext('2d'), game, e, { x:e.x,y:e.y }, 256, 256);
    return { drawn, bytes:c.getContext('2d').getImageData(0, 0, 256, 256).data };
  }
  var deer = __spawnCombatBoss('deerclops'), px = game.player.x;
  // Facing is simulation-owned. Deliberately put the player on the opposite
  // side to catch a renderer that silently recomputes Deerclops' direction.
  deer.dir = 1; game.player.x = deer.x - 100; var right = image(deer);
  deer.dir = -1; game.player.x = deer.x + 100; var left = image(deer); game.player.x = px;
  var facing = right.drawn && left.drawn, asymmetric = false;
  for (var y = 0; y < 256; y++) for (var x = 0; x < 256; x++) for (var ch = 0; ch < 4; ch++) {
    var i = (y * 256 + x) * 4 + ch, reflected = (y * 256 + 255 - x) * 4 + ch;
    if (left.bytes[i] !== right.bytes[reflected]) facing = false;
    if (left.bytes[i] !== right.bytes[i]) asymmetric = true;
  }
  var event = game.event, deerStates = [], woodStates = [], pumpkinStates = [];
  function renderState(e) {
    var before = __combatState(), drawn = image(e).drawn;
    for (var frame = 0; frame < 8; frame++) renderGame(game, ctx2d);
    return { phase:e.phase2, drawn, unchanged:before === __combatState(), singleBody:game.entities.length === 1 &&
      !e.arms.length && !e.segments.length && !e.probes.length, shots:game.projectiles.list.length };
  }
  [false,true].forEach(function(phase) {
    for (var mode = 0; mode < 3; mode++) {
      var e = __spawnCombatBoss('deerclops'); e.phase2 = phase;
      e.onGround = true; e.timer = 0; e.attackTimer = 0; e.attackIndex = (mode + 2) % 3;
      var invuln = game.player.invuln; game.player.invuln = 999;
      deerclopsStep(e, game); game.player.invuln = invuln;
      var state = renderState(e), shots = game.projectiles.list;
      state.mode = e.attackIndex; state.jumped = e.vy < 0 && e.timer > 1;
      state.pattern = shots.every(function(p) { return p.type === (mode === 2 ? P.PHANTOMBOLT : P.FROSTBOLT); }) &&
        (mode !== 1 || shots.every(function(p) { return p.vy > 0 && p.y <= game.player.y - 210; })) &&
        (mode !== 2 || shots.every(function(p) { return (game.player.x - p.x) * p.vx > 0; }));
      deerStates.push(state);
    }
    game.event = { type:'pumpkinmoon', wave:4, t:23, state:'wave', msg:true };
    var wood = __spawnCombatBoss('mourningwood'); wood.phase2 = phase; wood.attackTimer = 0;
    mourningWoodStep(wood, game);
    var w = renderState(wood);
    w.flames = game.projectiles.list.filter(function(p) { return p.type === P.CURSEDFLAME; }).length;
    woodStates.push(w);
    var pumpkin = __spawnCombatBoss('pumpking'); pumpkin.phase2 = phase; pumpkin.attackTimer = 0;
    pumpkingStep(pumpkin, game);
    var p = renderState(pumpkin);
    p.fireballs = game.projectiles.list.filter(function(p) { return p.type === P.FIREBALL; }).length;
    p.phantoms = game.projectiles.list.filter(function(p) { return p.type === P.PHANTOMBOLT; }).length;
    pumpkinStates.push(p);
  });
  game.event = event;
  return { facing:facing && asymmetric, deerStates, woodStates, pumpkinStates };
});
check(results, 'Deerclops mirrors its single eye and hooves using simulation dir, not the player position', autumn.facing);
check(results, 'Both phases of all three real Deerclops attack patterns and jumps remain rendering-independent',
  autumn.deerStates.every(s => s.drawn && s.unchanged && s.jumped && s.pattern && s.shots === (s.mode === 2 ? 2 : 5)), autumn.deerStates);
check(results, 'Mourning Wood retains four/seven cursed-flame fans without rendering advancing event state',
  autumn.woodStates.every(s => s.drawn && s.unchanged && s.shots === (s.phase ? 7 : 4) && s.flames === s.shots), autumn.woodStates);
check(results, 'Pumpking retains six/ten fireballs and its four extra phase-two phantom bolts',
  autumn.pumpkinStates.every(s => s.drawn && s.unchanged && s.fireballs === (s.phase ? 10 : 6) && s.phantoms === (s.phase ? 4 : 0) && s.shots === s.fireballs + s.phantoms), autumn.pumpkinStates);
check(results, 'Antlers, branches, roots and tattered capes never create extra combat bodies or targets',
  autumn.deerStates.concat(autumn.woodStates, autumn.pumpkinStates).every(s => s.singleBody));
await page.evaluate(() => {
  // Let the real projectile updater separate the fan for the preview only;
  // the read-only assertions above were taken before advancing these shots.
  var invuln = game.player.invuln; game.player.invuln = 999;
  for (var tick = 0; tick < 12; tick++) updateProjectiles();
  game.player.invuln = invuln; updateHud(); render();
});
await page.screenshot({ path: dir + '/pumpking-barrage.png' });
await page.evaluate(() => {
  var e = __spawnCombatBoss('deerclops'); e.phase2 = true; e.onGround = true;
  e.attackIndex = 0; e.attackTimer = 0; e.timer = 0;
  var invuln = game.player.invuln; game.player.invuln = 999;
  deerclopsStep(e, game); game.player.invuln = invuln; render();
});
await page.screenshot({ path: dir + '/deerclops-frost-rain.png' });

const frost = await page.evaluate(() => {
  function pixels(kind, phase, frame) {
    return CombatArt.bossSprite(kind, phase, frame, false).getContext('2d').getImageData(0, 0, 96, 96).data;
  }
  function region(bytes, test) {
    var count = 0;
    for (var y = 0; y < 96; y++) for (var x = 0; x < 96; x++) {
      var i = (y * 96 + x) * 4;
      if (bytes[i + 3] && test(x - 48,y - 48,bytes[i],bytes[i + 1],bytes[i + 2])) count++;
    }
    return count;
  }
  var pine = pixels('everscream', false, 0), oak = pixels('mourningwood', false, 0);
  var evergreen = pine.some(function(v,i) { return i % 4 === 3 && v !== oak[i]; }) &&
    region(pine, function(x,y,r,g,b) { return y < 12 && g > r + 8 && g > b - 20; }) > 150;
  var snowy = function(x,y,r,g,b) { return r > 210 && g > 210 && b > 190; };
  var frostier = region(pixels('everscream',true,0),snowy) > region(pine,snowy) * 2;
  var t0 = pixels('santank',false,0), t1 = pixels('santank',false,1), tracks = false, hullStable = true;
  for (var y = 0; y < 96; y++) for (var x = 0; x < 96; x++) for (var ch = 0; ch < 4; ch++) {
    var i = (y * 96 + x) * 4 + ch;
    if (t0[i] !== t1[i]) { if (y - 48 >= 10) tracks = true; else hullStable = false; }
  }
  var ice = pixels('icequeen',false,0);
  var crystalTips = [[0,-34],[-7,-29],[7,-29],[-10,25],[-5,28],[0,31],[5,28],[10,25]].every(function(pos) {
    return region(ice,function(x,y) { return Math.abs(x - pos[0]) <= 1 && Math.abs(y - pos[1]) <= 1; }) > 0;
  });
  var tank = __spawnCombatBoss('santank'), px = game.player.x;
  function tankPixels(playerX) {
    game.player.x = playerX;
    var c = document.createElement('canvas'); c.width = c.height = 256;
    CombatArt.drawBoss(c.getContext('2d'),game,tank,{ x:tank.x,y:tank.y },256,256);
    return c.getContext('2d').getImageData(0,0,256,256).data;
  }
  var right = tankPixels(tank.x + 100), left = tankPixels(tank.x - 100); game.player.x = px;
  var facing = true, asymmetric = false;
  for (var y = 0; y < 256; y++) for (var x = 0; x < 256; x++) for (var ch = 0; ch < 4; ch++) {
    var i = (y * 256 + x) * 4 + ch, reflected = (y * 256 + 255 - x) * 4 + ch;
    if (left[i] !== right[reflected]) facing = false;
    if (left[i] !== right[i]) asymmetric = true;
  }
  var event = game.event, states = [];
  ['everscream','santank','icequeen'].forEach(function(name) {
    [false,true].forEach(function(phase) {
      var e = __spawnCombatBoss(name), x = e.x, y = e.y;
      game.event = { type:'frostmoon', wave:3, t:17, state:'wave', msg:true };
      e.hp = phase ? Math.floor(e.maxHp * 0.35) : e.maxHp;
      var invuln = game.player.invuln; game.player.invuln = 999;
      // Use the real dispatcher, including Everscream's existing shared AI and
      // the real health-triggered phase transition, rather than a mock step.
      bossStep(e,game); game.player.invuln = invuln;
      var before = __combatState(), c = document.createElement('canvas'); c.width = c.height = 256;
      var drawn = CombatArt.drawBoss(c.getContext('2d'),game,e,{ x:e.x,y:e.y },256,256);
      for (var f = 0; f < 8; f++) renderGame(game,ctx2d);
      var shots = game.projectiles.list, primary = name === 'everscream' ? P.CURSEDFLAME : name === 'santank' ? P.ROCKET : P.FROSTBOLT;
      var damage = name === 'everscream' ? (phase ? 38 : 30) : name === 'santank' ? (phase ? 40 : 30) : (phase ? 42 : 32);
      states.push({ name, phase, transitioned:e.phase2 === phase, moved:e.x !== x || e.y !== y, drawn,
        unchanged:before === __combatState(), singleBody:game.entities.length === 1 && !e.arms.length && !e.probes.length && !e.segments.length,
        shots:shots.length, primary:shots.filter(function(p) { return p.type === primary; }).length,
        darts:shots.filter(function(p) { return p.type === P.DART; }).length,
        damageCorrect:shots.every(function(p) { return p.dmg === (p.type === P.DART ? 30 : damage) && p.owner === 'enemy' && p.life > 0 && Number.isFinite(p.vx) && Number.isFinite(p.vy); }) });
    });
  });
  game.event = event;
  return { evergreen, frostier, tracks:tracks && hullStable, facing:facing && asymmetric, crystalTips, states };
});
check(results, 'Everscream has an evergreen silhouette distinct from Mourning Wood and brighter phase-two snow', frost.evergreen && frost.frostier);
check(results, 'Santa-NK1 animates its treads and wheels without jittering its armored hull', frost.tracks);
check(results, 'Santa-NK1 mirrors its asymmetric turret and Santa face toward the player', frost.facing);
check(results, 'Ice Queen retains its tall crown and five separate icicle skirt tips', frost.crystalTips);
function frostState(s) { return s.drawn && s.transitioned && s.moved && s.unchanged && s.singleBody && s.damageCorrect; }
check(results, 'Real Everscream dispatcher preserves four/seven cursed flames and health-triggered phases without event writes',
  frost.states.filter(s => s.name === 'everscream').every(s => frostState(s) && s.primary === (s.phase ? 7 : 4) && s.shots === s.primary), frost.states.filter(s => s.name === 'everscream'));
check(results, 'Real Santa-NK1 phases preserve three/six rockets, damage and event state during rendering',
  frost.states.filter(s => s.name === 'santank').every(s => frostState(s) && s.primary === (s.phase ? 6 : 3) && s.shots === s.primary), frost.states.filter(s => s.name === 'santank'));
check(results, 'Real Ice Queen phases preserve five/nine frost bolts and four extra phase-two darts',
  frost.states.filter(s => s.name === 'icequeen').every(s => frostState(s) && s.primary === (s.phase ? 9 : 5) && s.darts === (s.phase ? 4 : 0) && s.shots === s.primary + s.darts), frost.states.filter(s => s.name === 'icequeen'));
for (const name of ['everscream','santank','icequeen']) {
  await page.evaluate(name => {
    var e = __spawnCombatBoss(name), event = game.event, invuln = game.player.invuln;
    game.event = { type:'frostmoon', wave:3, t:17, state:'wave', msg:true };
    game.player.invuln = 999; e.hp = Math.floor(e.maxHp * 0.35); bossStep(e,game);
    for (var tick = 0; tick < 10; tick++) updateProjectiles();
    game.player.invuln = invuln; updateHud(); render(); game.event = event;
  },name);
  await page.screenshot({ path:dir + '/' + name + '-barrage.png' });
}

const invasion = await page.evaluate(() => {
  function pixels(kind, phase) {
    return CombatArt.bossSprite(kind,phase,1,false).getContext('2d').getImageData(0,0,96,96).data;
  }
  function region(bytes,test) {
    var n = 0;
    for (var y = 0; y < 96; y++) for (var x = 0; x < 96; x++) {
      var i = (y * 96 + x) * 4;
      if (bytes[i + 3] && test(x - 48,y - 48,bytes[i],bytes[i + 1],bytes[i + 2])) n++;
    }
    return n;
  }
  var goblin = pixels('goblinwarlock',false), cultist = pixels('cultist',false), captain = pixels('piratecaptain',false);
  var costumes = goblin.some(function(v,i) { return i % 4 === 3 && v !== cultist[i]; }) &&
    region(goblin,function(x,y,r,g,b) { return y < -5 && g > r && g > b + 5; }) > 20 &&
    region(captain,function(x,y) { return y < -23; }) > 60 &&
    region(captain,function(x,y,r,g,b) { return x >= 2 && x <= 5 && y >= -18 && y <= -15 && r === 40 && g === 49 && b === 60; }) >= 8;
  var ports = [false,true].every(function(phase) {
    var ship = pixels('flyingdutchman',phase);
    return [-16,0,16].every(function(port) {
      return region(ship,function(x,y,r,g,b) { return Math.abs(x - port) <= 4 && y >= 4 && y <= 13 && r === 38 && g === 60 && b === 69; }) > 10;
    });
  });
  function image(e) {
    var c = document.createElement('canvas'); c.width = c.height = 320;
    var drawn = CombatArt.drawBoss(c.getContext('2d'),game,e,{ x:e.x,y:e.y },320,320);
    return { drawn, bytes:c.getContext('2d').getImageData(0,0,320,320).data };
  }
  var facing = ['goblinwarlock','piratecaptain','flyingdutchman'].map(function(name) {
    var e = __spawnCombatBoss(name), px = game.player.x, dir = e.dir, before = __combatState();
    game.player.x = e.x + (name === 'flyingdutchman' ? -100 : 100); e.dir = 1; var right = image(e);
    game.player.x = e.x + (name === 'flyingdutchman' ? 100 : -100); e.dir = -1; var left = image(e);
    game.player.x = px; e.dir = dir;
    var mirror = right.drawn && left.drawn, asymmetric = false;
    for (var y = 0; y < 320; y++) for (var x = 0; x < 320; x++) for (var ch = 0; ch < 4; ch++) {
      var i = (y * 320 + x) * 4 + ch, reflected = (y * 320 + 319 - x) * 4 + ch;
      if (left.bytes[i] !== right.bytes[reflected]) mirror = false;
      if (left.bytes[i] !== right.bytes[i]) asymmetric = true;
    }
    return { name, mirror:mirror && asymmetric, unchanged:before === __combatState() };
  });
  var event = game.event, states = [];
  ['martiansaucer','goblinwarlock','piratecaptain','flyingdutchman'].forEach(function(name) {
    [false,true].forEach(function(phase) {
      [0,0.999].forEach(function(roll) {
        var e = __spawnCombatBoss(name), x = e.x, y = e.y;
        game.event = { type:name === 'martiansaucer' ? 'martianmadness' : name === 'goblinwarlock' ? 'goblinarmy' : 'pirateinvasion', wave:2, t:19, state:'wave', msg:true };
        e.hp = phase ? Math.floor(e.maxHp * 0.35) : e.maxHp;
        if (name === 'flyingdutchman') e.summonTimer = 0.001;
        var random = Math.random, invuln = game.player.invuln; game.player.invuln = 999;
        // Deterministic fixture rolls exercise both summon/no-summon branches
        // and both Dutchman pirate types. The real AI and renderer are intact.
        try { Math.random = function() { return roll; }; bossStep(e,game); }
        finally { Math.random = random; game.player.invuln = invuln; }
        var before = __combatState(), drawn = image(e).drawn;
        for (var frame = 0; frame < 8; frame++) renderGame(game,ctx2d);
        var shots = game.projectiles.list, minions = game.entities.filter(function(q) { return q !== e; });
        var primary = name === 'martiansaucer' ? P.PLASMA : name === 'goblinwarlock' ? P.MAGICBOLT : P.FIREBALL;
        var damage = name === 'martiansaucer' ? (phase ? 42 : 34) : name === 'goblinwarlock' ? (phase ? 34 : 26) : name === 'piratecaptain' ? (phase ? 40 : 30) : (phase ? 44 : 34);
        states.push({ name, phase, roll:roll === 0 ? 'low' : 'high', drawn, transitioned:e.phase2 === phase,
          moved:e.x !== x || e.y !== y, unchanged:before === __combatState(), shots:shots.length,
          primary:shots.filter(function(p) { return p.type === primary; }).length,
          lasers:shots.filter(function(p) { return p.type === P.LASER; }).length,
          damageCorrect:shots.every(function(p) { return p.dmg === (p.type === P.LASER ? 30 : damage) && p.owner === 'enemy' && p.life > 0; }),
          origins:name !== 'flyingdutchman' || shots.every(function(p,i) { return Math.abs(p.x - e.x - (i - 1) * 28) < 0.000001 && Math.abs(p.y - e.y - 14) < 0.000001; }),
          summons:minions.length,
          summonType:minions.every(function(q) { return q.eventEnemy && q.type === (name === 'goblinwarlock' ? E.GOBLINTHIEF : name === 'piratecaptain' ? E.PARROT : roll === 0 ? E.PIRATECORSAIR : E.PIRATESHARK); }),
          rootOnly:game.entities.filter(function(q) { return q.boss; }).length === 1 && !e.arms.length && !e.segments.length && !e.probes.length });
      });
    });
  });
  game.event = event;
  return { costumes, ports, facing, states,
    plasmaFallback:!CombatArt.drawProjectile(document.createElement('canvas').getContext('2d'),{ type:P.PLASMA,owner:'enemy' }) };
});
check(results, 'Warlock ears/robes and Captain bicorne/eyepatch are distinct from the Cultist costume', invasion.costumes);
check(results, 'Flying Dutchman keeps three visible decorative cannon ports in both phases', invasion.ports);
check(results, 'Casters face the player while Dutchman follows simulation dir; mirrored drawing is read-only',
  invasion.facing.every(s => s.mirror && s.unchanged), invasion.facing);
function invasionState(s) { return s.drawn && s.transitioned && s.moved && s.unchanged && s.damageCorrect && s.rootOnly; }
check(results, 'Real Saucer phases preserve four/six plasma bolts and six extra lasers without inventing damageable pods',
  invasion.plasmaFallback && invasion.states.filter(s => s.name === 'martiansaucer').every(s => invasionState(s) && s.primary === (s.phase ? 6 : 4) && s.lasers === (s.phase ? 6 : 0) && s.shots === s.primary + s.lasers), invasion.states.filter(s => s.name === 'martiansaucer'));
check(results, 'Real Goblin Warlock phases preserve two/four magic bolts, damage and event state',
  invasion.states.filter(s => s.name === 'goblinwarlock').every(s => invasionState(s) && s.primary === (s.phase ? 4 : 2) && s.shots === s.primary), invasion.states.filter(s => s.name === 'goblinwarlock'));
check(results, 'Real Pirate Captain phases preserve one/three cannon fireballs and damage',
  invasion.states.filter(s => s.name === 'piratecaptain').every(s => invasionState(s) && s.primary === (s.phase ? 3 : 1) && s.shots === s.primary), invasion.states.filter(s => s.name === 'piratecaptain'));
check(results, 'Real Dutchman retains three broadside fireballs at its actual -28/0/+28 spawn origins',
  invasion.states.filter(s => s.name === 'flyingdutchman').every(s => invasionState(s) && s.primary === 3 && s.shots === 3 && s.origins), invasion.states.filter(s => s.name === 'flyingdutchman'));
check(results, 'Low/high AI rolls cover summoned thieves/parrots, no-summon branches and both Dutchman pirate types without render spawns',
  invasion.states.every(s => s.unchanged && s.rootOnly && s.summonType && s.summons ===
    (s.name === 'flyingdutchman' ? 1 : s.name === 'martiansaucer' ? 0 : s.phase && s.roll === 'low' ? 1 : 0)));
for (const name of ['martiansaucer','goblinwarlock','piratecaptain','flyingdutchman']) {
  await page.evaluate(name => {
    var e = __spawnCombatBoss(name), event = game.event, invuln = game.player.invuln, random = Math.random;
    game.event = { type:name === 'martiansaucer' ? 'martianmadness' : name === 'goblinwarlock' ? 'goblinarmy' : 'pirateinvasion', wave:2, t:19, state:'wave', msg:true };
    game.player.invuln = 999; e.hp = Math.floor(e.maxHp * 0.35);
    if (name === 'flyingdutchman') e.summonTimer = 0.001;
    try { Math.random = function() { return 0; }; bossStep(e,game); }
    finally { Math.random = random; }
    for (var tick = 0; tick < 10; tick++) updateProjectiles();
    game.player.invuln = invuln; updateHud(); render(); game.event = event;
  },name);
  await page.screenshot({ path:dir + '/' + name + '-barrage.png' });
}

const etherian = await page.evaluate(() => {
  function pixels(kind,frame) {
    return CombatArt.bossSprite(kind,false,frame,false).getContext('2d').getImageData(0,0,96,96).data;
  }
  var moth0 = pixels('mothron',0), moth1 = pixels('mothron',1);
  var flap = moth0.some(function(v,i) { return i % 4 === 3 && v !== moth1[i]; });
  var silhouettes = new Set(['darkmage','ogre','betsy'].map(function(name) {
    return Array.from(pixels(name,0)).filter(function(_,i) { return i % 4 === 3; }).join(',');
  })).size;
  function image(e) {
    var c = document.createElement('canvas'); c.width = c.height = 320;
    var drawn = CombatArt.drawBoss(c.getContext('2d'),game,e,{ x:e.x,y:e.y },320,320);
    return { drawn,bytes:c.getContext('2d').getImageData(0,0,320,320).data };
  }
  function rendered(e) {
    var before = __combatState(), drawn = image(e).drawn, hook = CombatArt.drawBoss, calls = 0;
    CombatArt.drawBoss = function(ctx,g,b,cam,w,h) { if (b === e) calls++; return hook(ctx,g,b,cam,w,h); };
    try { for (var f = 0; f < 8; f++) renderGame(game,ctx2d); }
    finally { CombatArt.drawBoss = hook; }
    return { drawn,hookCalls:calls,unchanged:before === __combatState() };
  }
  var facing = ['mothron','darkmage','ogre','betsy'].map(function(name) {
    var e = __spawnCombatBoss(name), px = game.player.x, dir = e.dir, before = __combatState();
    e.dir = 1; game.player.x = e.x - 100; var right = image(e);
    e.dir = -1; game.player.x = e.x + 100; var left = image(e);
    e.dir = dir; game.player.x = px;
    var mirrored = right.drawn && left.drawn, asymmetric = false;
    for (var y = 0; y < 320; y++) for (var x = 0; x < 320; x++) for (var ch = 0; ch < 4; ch++) {
      var i = (y * 320 + x) * 4 + ch, reflected = (y * 320 + 319 - x) * 4 + ch;
      if (left.bytes[i] !== right.bytes[reflected]) mirrored = false;
      if (left.bytes[i] !== right.bytes[i]) asymmetric = true;
    }
    return { name,mirrored:mirrored && asymmetric,unchanged:before === __combatState() };
  });
  var event = game.event, mothStates = [], armyStates = [], objectives = [], stopped = [];
  [false,true].forEach(function(phase) {
    [0,0.999].forEach(function(roll) {
      var e = __spawnCombatBoss('mothron'), x = e.x, y = e.y;
      game.event = { type:'solareclipse',wave:2,t:13,state:'wave',msg:true };
      e.hp = phase ? Math.floor(e.maxHp * 0.35) : e.maxHp;
      var random = Math.random, invuln = game.player.invuln; game.player.invuln = 999;
      try { Math.random = function() { return roll; }; bossStep(e,game); }
      finally { Math.random = random; game.player.invuln = invuln; }
      var state = rendered(e), minions = game.entities.filter(function(q) { return q !== e; });
      state.phase = phase; state.roll = roll === 0 ? 'low' : 'high'; state.transitioned = e.phase2 === phase;
      state.dive = Math.abs(Math.hypot(e.x - x,e.y - y) - (phase ? 8 : 6)) < 0.000001 &&
        Math.abs(Math.hypot(e.vx,e.vy) - (phase ? 8 : 6) * 0.97) < 0.000001;
      state.babies = minions.length; state.babyTypes = minions.every(function(q) { return q.type === E.BABYMOTHRON && q.eventEnemy; });
      state.shots = game.projectiles.list.length; state.rootOnly = !e.arms.length && !e.segments.length && !e.probes.length;
      mothStates.push(state);
    });
  });
  ['darkmage','ogre','betsy'].forEach(function(name) {
    [false,true].forEach(function(phase) {
      [-1,1].forEach(function(side) {
        var variants = name === 'darkmage' ? ['goblin','skeleton','none'] : name === 'ogre' ? ['low','high'] : ['none'];
        variants.forEach(function(variant) {
          var e = __spawnCombatBoss(name,side), ev = game.event, hp = ev.crystalHp;
          e.hp = phase ? Math.floor(e.maxHp * 0.35) : e.maxHp;
          if (name === 'ogre') e.onGround = true;
          var random = Math.random, invuln = game.player.invuln, rolls = 0; game.player.invuln = 999;
          try {
            Math.random = function() { rolls++; return variant === 'goblin' || variant === 'low' ? 0 : variant === 'skeleton' ? (rolls === 1 ? 0.1 : 0.75) : 0.999; };
            bossStep(e,game);
          } finally { Math.random = random; game.player.invuln = invuln; }
          var state = rendered(e), shots = game.projectiles.list, minions = game.entities.filter(function(q) { return q !== e; });
          state.name = name; state.phase = phase; state.side = side; state.variant = variant;
          state.transitioned = e.phase2 === phase; state.tier = ev.tier; state.shots = shots.length;
          state.projectiles = shots.every(function(p) { return p.ooaProjectile && p.owner === 'enemy' && p.life === 4 &&
            p.type === (name === 'darkmage' ? P.MAGICBOLT : name === 'ogre' ? P.SPIT : P.FIREBALL) && p.dmg === (name === 'darkmage' ? 32 : name === 'ogre' ? 42 : 48); });
          state.summons = minions.length; state.summonTypes = minions.every(function(q) { return q.ooaEnemy && q.eventEnemy && q.ooaSide === side &&
            q.type === (variant === 'skeleton' ? E.OLDONESSKELETON : E.ETHERIANGOBLIN); });
          state.jump = name !== 'ogre' || (variant === 'low' ? e.vy < 0 : e.vy >= 0);
          state.farCrystalStable = hp === ev.crystalHp;
          state.flags = e.ooaBoss && e.ooaEnemy && e.eventEnemy && e.ooaSide === side && !e.dead && !e.arms.length && !e.segments.length && !e.probes.length;
          armyStates.push(state);
        });
      });
      var e = __spawnCombatBoss(name), ev = game.event;
      e.hp = phase ? Math.floor(e.maxHp * 0.35) : e.maxHp;
      e.x = ev.crystalX + 20; e.objectiveCd = 0; e.attackTimer = 1;
      var hp = ev.crystalHp, invuln = game.player.invuln; game.player.invuln = 999;
      bossStep(e,game); game.player.invuln = invuln;
      var sentry = spawnOldOnesSentry(ITEMS[I.BALLISTAROD],ev.crystalX - 80,ev.crystalY);
      oldOnesArmySentryStep(sentry,game);
      var state = rendered(e);
      state.name = name; state.phase = phase; state.damage = hp - ev.crystalHp;
      state.expected = Math.max(1,Math.round(e.dmg * 0.55)); state.cooldown = e.objectiveCd > 0;
      state.mana = ev.etherianMana; state.bossKilled = ev.bossKilled;
      state.validStand = validateEterniaArena(game,ev.standX,ev.standY).ok && game.world.get(ev.standX,ev.standY) === T.ETERNIASTAND;
      state.sentry = sentry.attackCd > 0 && game.projectiles.list.some(function(p) { return p.eventOnly === 'oldonesarmy' && p.owner === 'player'; });
      objectives.push(state);
    });
    var e = __spawnCombatBoss(name); game.event = null; bossStep(e,game);
    var before = __combatState(), hook = CombatArt.drawBoss, calls = 0;
    CombatArt.drawBoss = function(ctx,g,b,cam,w,h) { if (b === e) calls++; return hook(ctx,g,b,cam,w,h); };
    try { renderGame(game,ctx2d); } finally { CombatArt.drawBoss = hook; }
    stopped.push({ name,dead:e.dead,calls,unchanged:before === __combatState() });
  });
  game.event = event;
  return { flap,silhouettes,facing,mothStates,armyStates,objectives,stopped,
    spitFallback:!CombatArt.drawProjectile(document.createElement('canvas').getContext('2d'),{ type:P.SPIT,owner:'enemy' }) };
});
check(results, 'Mothron has alpha-visible wing flaps and all three Etherian bosses have distinct silhouettes', etherian.flap && etherian.silhouettes === 3);
check(results, 'Mothron and Etherian bosses mirror using simulation dir rather than recomputing facing', etherian.facing.every(s => s.mirrored && s.unchanged), etherian.facing);
check(results, 'Real Mothron dives retain six/eight speed, damping and active/suppressed baby summons in both phases',
  etherian.mothStates.every(s => s.drawn && s.hookCalls === 8 && s.unchanged && s.transitioned && s.dive && s.babyTypes && s.rootOnly && s.shots === 0 && s.babies === (s.phase && s.roll === 'low' ? 1 : 0)), etherian.mothStates);
function armyState(s) { return s.drawn && s.hookCalls === 8 && s.unchanged && s.transitioned && s.flags && s.projectiles && s.farCrystalStable; }
check(results, 'Dark Mage keeps three tagged bolts and goblin/skeleton/no-summon branches on both portals and phases',
  etherian.armyStates.filter(s => s.name === 'darkmage').every(s => armyState(s) && s.tier === 1 && s.shots === 3 && s.summonTypes && s.summons === (s.variant === 'none' ? 0 : 1)), etherian.armyStates.filter(s => s.name === 'darkmage'));
check(results, 'Ogre keeps one tagged spit shot and real grounded jump/no-jump branches in both phases',
  etherian.spitFallback && etherian.armyStates.filter(s => s.name === 'ogre').every(s => armyState(s) && s.tier === 2 && s.shots === 1 && s.summons === 0 && s.jump), etherian.armyStates.filter(s => s.name === 'ogre'));
check(results, 'Betsy keeps five tagged fireballs and tier-three event flags on both portals and phases',
  etherian.armyStates.filter(s => s.name === 'betsy').every(s => armyState(s) && s.tier === 3 && s.shots === 5 && s.summons === 0), etherian.armyStates.filter(s => s.name === 'betsy'));
check(results, 'Real objective damage happens once in AI; rendering preserves crystal HP, cooldowns, mana, stand and live sentry state',
  etherian.objectives.every(s => s.drawn && s.hookCalls === 8 && s.unchanged && s.damage === s.expected && s.cooldown && s.mana === 27 && !s.bossKilled && s.validStand && s.sentry), etherian.objectives);
check(results, 'Etherian bosses still despawn when the event ends and rendering never revives or draws them',
  etherian.stopped.every(s => s.dead && s.calls === 0 && s.unchanged), etherian.stopped);
for (const name of ['mothron','darkmage','ogre','betsy']) {
  await page.evaluate(name => {
    var e = __spawnCombatBoss(name), invuln = game.player.invuln, random = Math.random;
    if (name === 'mothron') game.event = { type:'solareclipse',wave:2,t:13,state:'wave',msg:true };
    game.player.invuln = 999;
    try {
      if (name === 'ogre') {
        // Let real physics settle the Ogre onto the floor before showing its
        // jump, instead of setting onGround on a newly spawned airborne boss.
        e.attackTimer = 2; Math.random = function() { return 0.999; };
        for (var warm = 0; warm < 24; warm++) bossStep(e,game);
        e.attackTimer = 0;
      }
      e.hp = Math.floor(e.maxHp * 0.35);
      Math.random = function() { return 0; }; bossStep(e,game);
    }
    finally { Math.random = random; }
    for (var tick = 0; tick < 10; tick++) updateProjectiles();
    game.player.invuln = invuln; updateHud(); render();
  },name);
  await page.screenshot({ path:dir + '/' + name + '-encounter.png' });
}
await page.evaluate(() => { game.event = null; updateHud(); });

const arenaKinds = ['crystal','portal','ballista','flameburst','explosivetrap','lightningaura','lightningfield'];
const arenaSources = await page.evaluate(({ kinds,bosses }) => {
  function bytes(kind,frame,active) {
    var c = CombatArt.arenaSprite(kind,frame,active);
    return c.getContext('2d').getImageData(0,0,c.width,c.height).data;
  }
  var total = 0, nonempty = 0, binary = true, margins = true;
  kinds.forEach(function(kind) {
    [false,true].forEach(function(active) {
      for (var frame = 0; frame < 4; frame++) {
        var c = CombatArt.arenaSprite(kind,frame,active), data = bytes(kind,frame,active), ink = false;
        for (var y = 0; y < c.height; y++) for (var x = 0; x < c.width; x++) {
          var a = data[(y * c.width + x) * 4 + 3];
          if (a !== 0 && a !== 255) binary = false;
          if (a) { ink = true; if (x < 2 || y < 2 || x >= c.width - 2 || y >= c.height - 2) margins = false; }
        }
        if (ink) nonempty++; total++;
      }
    });
  });
  var silhouettes = new Set(['ballista','flameburst','explosivetrap','lightningaura'].map(function(kind) {
    return Array.from(bytes(kind,0,false)).filter(function(_,i) { return i % 4 === 3; }).join(',');
  })).size;
  var normal = bytes('crystal',0,false), critical = bytes('crystal',0,true);
  var criticalDistinct = normal.some(function(v,i) { return v !== critical[i]; });
  var crystalMask = normal.every(function(v,i) { return i % 4 !== 3 || v === critical[i]; });
  var animated = ['crystal','portal','lightningfield'].every(function(kind) {
    var a = bytes(kind,0,false), b = bytes(kind,1,false); return a.some(function(v,i) { return v !== b[i]; });
  });
  var originals = ['crystal','portal','lightningfield'].map(function(kind) { return Array.from(bytes(kind,0,false)); });
  bosses.forEach(function(kind) { [false,true].forEach(function(phase) {
    for (var frame = 0; frame < 4; frame++) [false,true].forEach(function(flash) { CombatArt.bossSprite(kind,phase,frame,flash); });
  }); });
  var stable = ['crystal','portal','lightningfield'].every(function(kind,i) {
    var regenerated = bytes(kind,0,false); return originals[i].every(function(v,n) { return v === regenerated[n]; });
  });
  var portal = bytes('portal',0,false), filled = 0, cells = 0;
  for (var y = 24; y < 72; y++) for (var x = 36; x < 60; x++) { cells++; if (portal[(y * 96 + x) * 4 + 3]) filled++; }
  return { total,nonempty,binary,margins,silhouettes,criticalDistinct,crystalMask,animated,stable,transparentPortal:filled < cells / 3 };
},{ kinds:arenaKinds,bosses:names });
check(results,'All 56 arena device/frame/state sprites are nonempty, binary-alpha and unclipped',arenaSources.total === 56 && arenaSources.nonempty === 56 && arenaSources.binary && arenaSources.margins,arenaSources);
check(results,'Four sentry types have four different alpha silhouettes',arenaSources.silhouettes === 4);
check(results,'Critical crystal art is visibly different but preserves its exact alpha silhouette',arenaSources.criticalDistinct && arenaSources.crystalMask);
check(results,'Arena animation regenerates deterministically after cache eviction and portals remain mostly transparent',arenaSources.animated && arenaSources.stable && arenaSources.transparentPortal);

const arena = await page.evaluate(() => {
  var defs = { ballista:I.BALLISTAROD,flameburst:I.FLAMEBURSTROD,explosivetrap:I.EXPLOSIVETRAPROD,lightningaura:I.LIGHTNINGAURAROD };
  window.__arenaScene = function() {
    __spawnCombatBoss('darkmage');
    game.entities = []; game.bossBars = []; game.projectiles.list = []; game.fx = []; game.fxTexts = [];
    game.event.etherianMana = 100;
    return game.event;
  };
  function sentry(kind) {
    var ev = game.event;
    return spawnOldOnesSentry(ITEMS[defs[kind]],ev.crystalX,ev.standY * TILE + 8);
  }
  function enemy(s,offset,ooa,dead) {
    var q = spawnEtherianEnemy(E.ETHERIANGOBLIN,1);
    q.x = s.x + offset; q.y = s.y; q.hp = q.maxHp = 10000;
    q.ooaEnemy = ooa !== false; q.dead = !!dead;
    return q;
  }
  function drawState(s) {
    var before = __combatState(), hook = CombatArt.drawOOASentry, calls = 0;
    CombatArt.drawOOASentry = function(ctx,g,e,cam,w,h) { if (e === s) calls++; return hook(ctx,g,e,cam,w,h); };
    try { for (var f = 0; f < 4; f++) renderGame(game,ctx2d); }
    finally { CombatArt.drawOOASentry = hook; }
    return { unchanged:before === __combatState(),calls };
  }
  var worlds = [];
  ['darkmage','ogre','betsy'].forEach(function(name) {
    [1,0.2,0].forEach(function(ratio) {
      __spawnCombatBoss(name); var ev = game.event; ev.crystalHp = Math.round(ev.crystalMaxHp * ratio);
      var before = __combatState(), hook = CombatArt.drawOOAWorld, calls = 0;
      CombatArt.drawOOAWorld = function(ctx,g,cam,w,h) { calls++; return hook(ctx,g,cam,w,h); };
      try { for (var f = 0; f < 4; f++) renderGame(game,ctx2d); }
      finally { CombatArt.drawOOAWorld = hook; }
      var c = document.createElement('canvas'); c.width = 1200; c.height = 320;
      var drawn = CombatArt.drawOOAWorld(c.getContext('2d'),game,{ x:ev.crystalX,y:ev.portalY },1200,320);
      var pixels = c.getContext('2d').getImageData(0,0,1200,320).data;
      function ink(x,y) { return pixels[(y * 1200 + x) * 4 + 3] > 0; }
      worlds.push({ name,ratio,drawn,calls,unchanged:before === __combatState(),
        anchors:ink(600,160) && ink(600 - OOA_PORTAL_OFFSET * TILE + 17,140) && ink(600 + OOA_PORTAL_OFFSET * TILE + 17,140),
        hp:ev.crystalHp,expected:Math.round(ev.crystalMaxHp * ratio),active:game.event === ev && !__combatBoss.dead });
    });
  });
  var ev = __arenaScene(), p = game.player, deployment = [], mouse = [MOUSE.wx,MOUSE.wy];
  Object.keys(defs).forEach(function(kind,i) {
    var tx = ev.standX + [-6,-2,2,6][i], mana = ev.etherianMana, count = game.entities.length;
    MOUSE.wx = tx * TILE + 8; MOUSE.wy = ev.standY * TILE + 8; p.attackCd = 0;
    p.trySentry(game,ITEMS[defs[kind]]);
    var s = game.entities[game.entities.length - 1], state = drawState(s);
    deployment.push({ kind,placed:game.entities.length === count + 1 && s.ooaSentry && s.sentry === kind,
      spent:mana - ev.etherianMana,cost:ITEMS[defs[kind]].etherianCost,unchanged:state.unchanged,calls:state.calls });
  });
  while (game.entities.length < 12) sentry('ballista');
  var cappedMana = ev.etherianMana; p.attackCd = 0; p.trySentry(game,ITEMS[I.BALLISTAROD]);
  var cap = game.entities.length === 12 && ev.etherianMana === cappedMana;
  MOUSE.wx = mouse[0]; MOUSE.wy = mouse[1];
  var guns = [], aiming = [];
  ['ballista','flameburst'].forEach(function(kind) {
    var range = kind === 'ballista' ? 520 : 340;
    [-1,1].forEach(function(side) {
      [range - 1,range + 1].forEach(function(distance) {
        __arenaScene(); var s = sentry(kind);
        enemy(s,-side * 5,false,false); enemy(s,-side * 10,true,true);
        enemy(s,side * distance,true,false); oldOnesArmySentryStep(s,game);
        var state = drawState(s), shots = game.projectiles.list;
        guns.push({ kind,side,distance,inside:distance < range,shots:shots.length,
          correct:shots.every(function(q) { return q.eventOnly === 'oldonesarmy' && q.owner === 'player' && q.type === (kind === 'ballista' ? P.ARROW : P.FIREBALL) && q.vx * side > 0 && Math.abs(q.x - s.x) < 0.000001 && Math.abs(q.y - s.y + 12) < 0.000001; }),
          cooldown:distance < range ? s.attackCd === (kind === 'ballista' ? 1.1 : 0.55) : s.attackCd < 0,
          unchanged:state.unchanged,calls:state.calls });
      });
    });
    __arenaScene(); var s = sentry(kind);
    enemy(s,-5,false,false); enemy(s,-10,true,true); var q = enemy(s,60,true,false);
    function image() {
      var c = document.createElement('canvas'); c.width = c.height = 320;
      var drawn = CombatArt.drawOOASentry(c.getContext('2d'),game,s,{ x:s.x,y:s.y },320,320);
      return { drawn,data:c.getContext('2d').getImageData(0,0,320,320).data };
    }
    var before = __combatState(), right = image(); q.x = s.x - 60; var left = image(); q.x = s.x + 60;
    var canonical = document.createElement('canvas'); canonical.width = canonical.height = 320;
    canonical.getContext('2d').drawImage(CombatArt.arenaSprite(kind,Math.floor(Time.seconds * 8) % 4,false),112,112);
    var expected = canonical.getContext('2d').getImageData(0,0,320,320).data;
    var mirror = right.drawn && left.drawn, asymmetric = false;
    for (var y = 0; y < 320; y++) for (var x = 0; x < 320; x++) for (var ch = 0; ch < 4; ch++) {
      var i = (y * 320 + x) * 4 + ch, reflected = (y * 320 + 319 - x) * 4 + ch;
      if (right.data[i] !== expected[i] || left.data[i] !== right.data[reflected]) mirror = false;
      if (left.data[i] !== right.data[i]) asymmetric = true;
    }
    aiming.push({ kind,mirror:mirror && asymmetric,unchanged:before === __combatState() });
  });
  var areas = [];
  ['explosivetrap','lightningaura'].forEach(function(kind) {
    [false,true].forEach(function(hasInner) {
      __arenaScene(); var s = sentry(kind), splash = kind === 'explosivetrap' ? 99 : 104;
      var inner = hasInner ? enemy(s,80,true,false) : null;
      var outer = enemy(s,splash,true,false), outside = enemy(s,splash + 2,true,false);
      oldOnesArmySentryStep(s,game);
      var state = drawState(s);
      areas.push({ kind,hasInner,innerHit:!inner || inner.hp < 10000,outerHit:outer.hp < 10000,outsideSafe:outside.hp === 10000,
        cooldown:hasInner ? s.attackCd === (kind === 'explosivetrap' ? 1.5 : 0.3) : s.attackCd < 0,
        shots:game.projectiles.list.length,mana:game.event.etherianMana,unchanged:state.unchanged,calls:state.calls });
    });
  });
  __arenaScene(); var c = document.createElement('canvas'); c.width = 1200; c.height = 320;
  var ctx = c.getContext('2d'); ctx.translate(3,7); ctx.scale(0.8,0.9); ctx.globalAlpha = 0.65;
  ctx.fillStyle = '#123456'; ctx.strokeStyle = '#654321'; ctx.lineWidth = 3; ctx.font = '17px serif'; ctx.textAlign = 'right'; ctx.imageSmoothingEnabled = true;
  function context() { var m = ctx.getTransform(); return JSON.stringify([m.a,m.b,m.c,m.d,m.e,m.f,ctx.globalAlpha,ctx.fillStyle,ctx.strokeStyle,ctx.lineWidth,ctx.font,ctx.textAlign,ctx.imageSmoothingEnabled,ctx.globalCompositeOperation]); }
  var before = context(); CombatArt.drawOOAWorld(ctx,game,{ x:game.event.crystalX,y:game.event.portalY },1200,320);
  Object.keys(defs).forEach(function(kind) { var s = sentry(kind); CombatArt.drawOOASentry(ctx,game,s,{ x:s.x,y:s.y },1200,320); });
  var fallback = !CombatArt.drawOOAWorld(ctx,{ event:null },{ x:0,y:0 },1200,320) &&
    !CombatArt.drawOOASentry(ctx,game,{ ooaSentry:true,sentry:'future' },{ x:0,y:0 },1200,320) && CombatArt.arenaSprite('future',0,false) === null;
  var restored = before === context();
  __arenaScene(); var aura = sentry('lightningaura'), edge = document.createElement('canvas'); edge.width = 320; edge.height = 200;
  var edgeBefore = __combatState(); drawEnemy(edge.getContext('2d'),aura,{ x:aura.x + 160 + 85,y:aura.y },320,200);
  var edgeVisible = edge.getContext('2d').getImageData(0,0,320,200).data.some(function(v,i) { return i % 4 === 3 && v > 0; }) && edgeBefore === __combatState();
  var stopped = [];
  Object.keys(defs).forEach(function(kind) {
    __arenaScene(); var s = sentry(kind); game.event = null; oldOnesArmySentryStep(s,game);
    var before = __combatState(), hook = CombatArt.drawOOASentry, calls = 0;
    CombatArt.drawOOASentry = function(ctx,g,e,cam,w,h) { calls++; return hook(ctx,g,e,cam,w,h); };
    try { renderGame(game,ctx2d); } finally { CombatArt.drawOOASentry = hook; }
    stopped.push({ kind,dead:s.dead,calls,unchanged:before === __combatState() });
  });
  return { worlds,deployment,cap,guns,aiming,areas,restored,fallback,edgeVisible,stopped };
});
check(results,'Arena renders once per frame with correctly anchored portals/crystal and read-only health states across all tiers',arena.worlds.every(s => s.drawn && s.calls === 4 && s.unchanged && s.anchors && s.hp === s.expected && s.active),arena.worlds);
check(results,'Real sentry placement consumes exactly one mana cost; rendering preserves it and the twelve-sentry cap',arena.cap && arena.deployment.every(s => s.placed && s.spent === s.cost && s.unchanged && s.calls === 4),arena.deployment);
check(results,'Ballista/Flameburst keep 520/340 acquisition ranges, shot origins, cooldowns and event-only projectiles',arena.guns.every(s => s.shots === (s.inside ? 1 : 0) && s.correct && s.cooldown && s.unchanged && s.calls === 4),arena.guns);
check(results,'Explosive Trap keeps 90-pixel acquisition and its wider sub-100 damage loop without render damage',arena.areas.filter(s => s.kind === 'explosivetrap').every(s => s.innerHit && s.outerHit === s.hasInner && s.outsideSafe && s.cooldown && s.shots === 0 && s.mana === 100 && s.unchanged && s.calls === 4),arena.areas.filter(s => s.kind === 'explosivetrap'));
check(results,'Lightning Aura keeps 90-pixel acquisition and its wider sub-105 damage loop without render damage',arena.areas.filter(s => s.kind === 'lightningaura').every(s => s.innerHit && s.outerHit === s.hasInner && s.outsideSafe && s.cooldown && s.shots === 0 && s.mana === 100 && s.unchanged && s.calls === 4),arena.areas.filter(s => s.kind === 'lightningaura'));
check(results,'Device facing follows the nearest live Etherian target and ignores dead/non-Etherian decoys',arena.aiming.every(s => s.mirror && s.unchanged),arena.aiming);
check(results,'Arena hooks restore context state and unknown/inactive cases retain fallbacks',arena.restored && arena.fallback);
check(results,'Offscreen aura edges stay visible and event-ended sentries remain dead and undrawn',arena.edgeVisible && arena.stopped.every(s => s.dead && s.calls === 0 && s.unchanged),arena.stopped);
await page.evaluate(() => {
  window.__arenaReview = function(critical) {
    var ev = __arenaScene(), p = game.player, mouse = [MOUSE.wx,MOUSE.wy];
    var ids = [I.BALLISTAROD,I.FLAMEBURSTROD,I.EXPLOSIVETRAPROD,I.LIGHTNINGAURAROD];
    var devices = [];
    ids.forEach(function(id,i) {
      MOUSE.wx = (ev.standX + [-12,-6,6,12][i]) * TILE + 8;
      MOUSE.wy = ev.standY * TILE + 8; p.attackCd = 0;
      p.trySentry(game,ITEMS[id]); devices.push(game.entities[game.entities.length - 1]);
    });
    MOUSE.wx = mouse[0]; MOUSE.wy = mouse[1];
    var target = spawnEtherianEnemy(E.ETHERIANGOBLIN,1);
    target.x = ev.crystalX + 110; target.y = devices[0].y - 7; target.hp = target.maxHp = 10000;
    devices.forEach(function(s) { oldOnesArmySentryStep(s,game); });
    for (var tick = 0; tick < 10; tick++) updateProjectiles();
    ev.crystalHp = critical ? Math.round(ev.crystalMaxHp * 0.2) : ev.crystalMaxHp;
    document.getElementById('message').style.display = 'none'; updateHud();
  };
  __arenaReview(false); __legacyCombat(true); render();
});
await page.screenshot({ path:dir + '/arena-before.png' });
await page.evaluate(() => { __legacyCombat(false); render(); });
await page.screenshot({ path:dir + '/arena-after.png' });
await page.evaluate(() => { game.event.crystalHp = Math.round(game.event.crystalMaxHp * 0.2); updateHud(); render(); });
await page.screenshot({ path:dir + '/arena-critical.png' });

const projectiles = await page.evaluate(() => {
  var types = ['ARROW','DART','GUNBULLET','LASER','DEATHLASER','ROCKET','STINGER','STAR','MAGICBOLT','PHANTOMBOLT','FIREBALL','CURSEDFLAME','FROSTBOLT','WATERBOLT','WATERSTREAM'];
  var seen = 0, readonly = true, fallback = true;
  types.forEach(function(type) {
    var p = { type:P[type], x:40, y:40, vx:4, vy:-1, owner:'player', age:0.2, dmg:17, life:2 };
    var before = JSON.stringify(p), c = document.createElement('canvas'); c.width = c.height = 128;
    var ctx = c.getContext('2d'); ctx.translate(64, 64);
    if (CombatArt.drawProjectile(ctx, p)) seen++;
    if (before !== JSON.stringify(p)) readonly = false;
  });
  ['deployMode','channelBeam','tether','controlled','spear','mineArmed','piranha'].forEach(function(key) {
    var p = { type:P.MAGICBOLT }; p[key] = key === 'deployMode' ? 'sphere' : true;
    if (CombatArt.drawProjectile(document.createElement('canvas').getContext('2d'), p)) fallback = false;
  });
  function pixels(type, owner) {
    var c = CombatArt.projectileSprite({ type, owner:owner || 'player' }, 1);
    return c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
  }
  function differs(a, b) { return a.some(function(v, i) { return v !== b[i]; }); }
  var distinct = differs(pixels(P.MAGICBOLT), pixels(P.PHANTOMBOLT)) &&
    differs(pixels(P.FIREBALL), pixels(P.CURSEDFLAME)) &&
    differs(pixels(P.LASER, 'player'), pixels(P.LASER, 'enemy')) &&
    differs(pixels(P.ARROW), pixels(P.DART));
  return { seen, expected:types.length, readonly, fallback, distinct };
});
check(results, 'Fifteen common projectile types use read-only pixel artwork', projectiles.seen === projectiles.expected && projectiles.readonly, projectiles);
check(results, 'Special beams, spheres, tethers, spears and armed mines keep their existing renderers', projectiles.fallback);
check(results, 'Magic/phantom bolts, fire/cursed flames, laser owners and darts remain visually distinct', projectiles.distinct);

const swings = await page.evaluate(() => {
  game.entities = []; game.bossBars = []; game.projectiles.list = []; game.fx = [];
  var p = game.player, outcomes = [];
  [I.COPPERSWORD, I.COPPERSHORT].forEach(function(id) {
    p.inventory.slots[10] = { id:id, count:1 }; p.inventory.selected = 10;
    p.attackCd = 0; p.swingT = 0; MOUSE.wx = p.x + 100; MOUSE.wy = p.y;
    p.tryMelee(game, ITEMS[id], false, p.inventory.slots[10]);
    var triggered = p.swingT > 0;
    p.swingT *= 0.5;
    var before = __combatState();
    var c = document.createElement('canvas'); c.width = c.height = 256;
    var drawn = CombatArt.drawSwing(c.getContext('2d'), p, 128, 128);
    outcomes.push({ id, triggered, drawn, readonly:before === __combatState() });
  });
  p.inventory.slots[10] = { id:I.TERRARIAN, count:1 };
  var skipped = !CombatArt.drawSwing(document.createElement('canvas').getContext('2d'), p, 100, 100);
  return { outcomes, skipped };
});
check(results, 'Real broadsword and shortsword attacks draw pixel blades without altering their timing/damage state',
  swings.outcomes.every(s => s.triggered && s.drawn && s.readonly), swings.outcomes);
check(results, 'Projectile-only/yoyo weapons retain their specialized presentation', swings.skipped);

const context = await page.evaluate(() => {
  var c = document.createElement('canvas'); c.width = c.height = 256;
  var ctx = c.getContext('2d');
  ctx.translate(3, 7); ctx.scale(0.8, 0.9); ctx.globalAlpha = 0.65;
  ctx.fillStyle = '#123456'; ctx.strokeStyle = '#654321'; ctx.lineWidth = 3; ctx.imageSmoothingEnabled = true;
  ctx.font = '17px serif'; ctx.textAlign = 'right';
  function state() { var m = ctx.getTransform(); return JSON.stringify([m.a,m.b,m.c,m.d,m.e,m.f,ctx.globalAlpha,ctx.fillStyle,ctx.strokeStyle,ctx.lineWidth,ctx.imageSmoothingEnabled,ctx.font,ctx.textAlign]); }
  var e = __spawnCombatBoss('skeletron'), before = state();
  CombatArt.drawBoss(ctx, game, e, { x:e.x, y:e.y }, 256, 256);
  ['queenslime','plantera','golem','duke','empress','moonlord','cultist','pillar_solar','pillar_vortex','pillar_nebula','pillar_stardust','deerclops','mourningwood','pumpking','everscream','santank','icequeen','martiansaucer','goblinwarlock','piratecaptain','flyingdutchman','mothron','darkmage','ogre','betsy'].forEach(function(name) {
    var boss = __spawnCombatBoss(name); boss.phase2 = true;
    CombatArt.drawBoss(ctx, game, boss, { x:boss.x,y:boss.y }, 256, 256);
  });
  CombatArt.drawProjectile(ctx, { type:P.ROCKET, age:0.3 });
  var effects = 0;
  ['spark','slash','cast','boom','heal'].forEach(function(type) {
    [1, 0.5, 0.05].forEach(function(life) {
      var f = { type, x:0, y:0, t:life, max:1, seed:13 }, original = JSON.stringify(f);
      if (CombatArt.drawFX(ctx, f, 100, 100, life) && original === JSON.stringify(f)) effects++;
    });
  });
  return { effects, preserved:state() === before, fallback:['futureboss','unknown_event_boss'].every(function(boss) {
    return !CombatArt.drawBoss(ctx, game, { boss }, { x:0,y:0 }, 256, 256);
  }) && !CombatArt.drawBoss(ctx, game, { boss:'lunar',pillarType:'unknown' }, { x:0,y:0 }, 256, 256) &&
    !CombatArt.drawBoss(ctx, game, { boss:'kingslime',ooaBoss:true }, { x:0,y:0 },256,256) &&
    !CombatArt.drawBoss(ctx, game, { boss:'skelprime',armType:'laser' }, { x:0,y:0 },256,256) };
});
check(results, 'Pixel impact, casting, explosion and healing effects are read-only', context.effects === 15, context);
check(results, 'Combat drawing restores transforms, alpha, styles, fonts, alignment and smoothing', context.preserved);
check(results, 'Unknown bosses/pillars, unsupported Etherian flags and child arms retain renderer fallbacks', context.fallback);

// Actual in-game swing before/after evidence.
await page.evaluate(() => {
  game.entities = []; game.bossBars = []; game.projectiles.list = []; game.fx = [];
  if (game.event && game.event.type === 'oldonesarmy') game.event = null;
  var p = game.player; p.inventory.slots[10] = { id:I.COPPERSWORD, count:1 }; p.inventory.selected = 10;
  p.attackCd = 0; p.swingT = 0; MOUSE.wx = p.x + 100; MOUSE.wy = p.y;
  p.tryMelee(game, ITEMS[I.COPPERSWORD], false, p.inventory.slots[10]); p.swingT *= 0.6;
  game.timeOfDay = 0.5; updateHud(); __legacyCombat(true); render();
});
await page.screenshot({ path: dir + '/swing-before.png' });
await page.evaluate(() => { __legacyCombat(false); render(); });
await page.screenshot({ path: dir + '/swing-after.png' });

const sheet = await page.evaluate(names => {
  var c = document.createElement('canvas'); c.width = 1568; c.height = 52 + Math.ceil(names.length / 7) * 508;
  var ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#ecd49e'; ctx.font = '20px monospace'; ctx.fillText('TREE / original boss pixel artwork — normal and phase two', 24, 30);
  names.forEach(function(name, i) {
    [false, true].forEach(function(phase, row) {
      var x = i % 7 * 224, y = 52 + (Math.floor(i / 7) * 2 + row) * 254;
      var full = name.indexOf('pillar_') === 0 || ['queenslime','plantera','golem','duke','empress','moonlord','cultist','deerclops','mourningwood','pumpking','everscream','santank','icequeen','martiansaucer','goblinwarlock','piratecaptain','flyingdutchman','mothron','darkmage','ogre','betsy'].indexOf(name) >= 0;
      ctx.drawImage(CombatArt.bossSprite(name, phase, 1, false), full ? 0 : 16, full ? 0 : 16,
        full ? 96 : 64, full ? 96 : 64, x + 16, y, 192, 192);
      ctx.fillStyle = '#d9d5c4'; ctx.font = '13px monospace'; ctx.fillText(name, x + 12, y + 218);
      ctx.fillStyle = '#9cabc6'; ctx.fillText(name.indexOf('pillar_') === 0 ? (phase ? 'exposed' : 'shielded') : (phase ? 'phase two' : 'normal'), x + 12, y + 238);
    });
  });
  return c.toDataURL('image/png');
}, names);
writeFileSync(dir + '/boss-artwork.png', Buffer.from(sheet.split(',')[1], 'base64'));
const components = await page.evaluate(() => {
  var parts = ['destroyerbody','destroyertail','probe','prime_laser','prime_cannon','prime_saw','prime_vice'];
  var c = document.createElement('canvas'); c.width = 1568; c.height = 570;
  var ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#ecd49e'; ctx.font = '20px monospace'; ctx.fillText('TREE / mechanical armor, probes and Prime tools', 24, 30);
  parts.forEach(function(name, i) {
    [false, true].forEach(function(phase, row) {
      var x = i * 224, y = 52 + row * 254;
      ctx.drawImage(CombatArt.bossSprite(name, phase, 1, false), 16, 16, 64, 64, x + 16, y, 192, 192);
      ctx.fillStyle = '#d9d5c4'; ctx.font = '13px monospace'; ctx.fillText(name, x + 12, y + 218);
      ctx.fillStyle = '#9cabc6'; ctx.fillText(phase ? 'phase two' : 'normal', x + 12, y + 238);
    });
  });
  return c.toDataURL('image/png');
});
writeFileSync(dir + '/mechanical-components.png', Buffer.from(components.split(',')[1], 'base64'));
const hardmodeSheet = await page.evaluate(() => {
  var c = document.createElement('canvas'); c.width = 1152; c.height = 712;
  var ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#ecd49e'; ctx.font = '20px monospace'; ctx.fillText('TREE / crystal monarch, jungle bloom, temple idol, ocean boar', 20, 30);
  ['queenslime','plantera','golem','duke'].forEach(function(name, i) {
    [false,true].forEach(function(phase, row) {
      var x = i * 288, y = 42 + row * 330;
      ctx.drawImage(CombatArt.bossSprite(name, phase, 1, false), x, y, 288, 288);
      ctx.fillStyle = '#d9d5c4'; ctx.font = '16px monospace'; ctx.fillText(name + (phase ? ' / phase two' : ' / normal'), x + 12, y + 310);
    });
  });
  return c.toDataURL('image/png');
});
writeFileSync(dir + '/hardmode-artwork.png', Buffer.from(hardmodeSheet.split(',')[1], 'base64'));
const lunarSheet = await page.evaluate(() => {
  var c = document.createElement('canvas'); c.width = 1152; c.height = 1372;
  var ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#ecd49e'; ctx.font = '20px monospace'; ctx.fillText('TREE / radiant monarch and lunar elder — four frames per phase', 20, 30);
  ['empress','moonlord'].forEach(function(name, boss) {
    [false,true].forEach(function(phase, row) {
      for (var frame = 0; frame < 4; frame++) {
        var x = frame * 288, y = 42 + (boss * 2 + row) * 330;
        ctx.drawImage(CombatArt.bossSprite(name, phase, frame, false), x, y, 288, 288);
        ctx.fillStyle = '#d9d5c4'; ctx.font = '14px monospace';
        ctx.fillText(name + (phase ? ' / phase two' : ' / normal') + ' / ' + (frame + 1), x + 8, y + 310);
      }
    });
  });
  return c.toDataURL('image/png');
});
writeFileSync(dir + '/lunar-artwork.png', Buffer.from(lunarSheet.split(',')[1], 'base64'));
const progressionSheet = await page.evaluate(() => {
  var c = document.createElement('canvas'); c.width = 1440; c.height = 712;
  var ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#ecd49e'; ctx.font = '20px monospace'; ctx.fillText('TREE / ritual robes and four lunar monoliths', 20, 30);
  ['cultist','pillar_solar','pillar_vortex','pillar_nebula','pillar_stardust'].forEach(function(name, col) {
    [false,true].forEach(function(state, row) {
      var x = col * 288, y = 42 + row * 330;
      ctx.drawImage(CombatArt.bossSprite(name, state, 1, false), x, y, 288, 288);
      ctx.fillStyle = '#d9d5c4'; ctx.font = '15px monospace'; ctx.fillText(name, x + 12, y + 306);
      ctx.fillStyle = '#9cabc6'; ctx.fillText(name === 'cultist' ? (state ? 'phase two' : 'normal') : (state ? 'exposed' : 'shielded'), x + 12, y + 326);
    });
  });
  return c.toDataURL('image/png');
});
writeFileSync(dir + '/progression-artwork.png', Buffer.from(progressionSheet.split(',')[1], 'base64'));
const autumnSheet = await page.evaluate(() => {
  var c = document.createElement('canvas'); c.width = 864; c.height = 712;
  var ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#ecd49e'; ctx.font = '20px monospace'; ctx.fillText('TREE / antlers, haunted bark and pumpkin royalty', 20, 30);
  ['deerclops','mourningwood','pumpking'].forEach(function(name, col) {
    [false,true].forEach(function(phase, row) {
      var x = col * 288, y = 42 + row * 330;
      ctx.drawImage(CombatArt.bossSprite(name, phase, 1, false), x, y, 288, 288);
      ctx.fillStyle = '#d9d5c4'; ctx.font = '15px monospace'; ctx.fillText(name, x + 12, y + 306);
      ctx.fillStyle = '#9cabc6'; ctx.fillText(phase ? 'phase two' : 'normal', x + 12, y + 326);
    });
  });
  return c.toDataURL('image/png');
});
writeFileSync(dir + '/autumn-artwork.png', Buffer.from(autumnSheet.split(',')[1], 'base64'));
const frostSheet = await page.evaluate(() => {
  var c = document.createElement('canvas'); c.width = 864; c.height = 712;
  var ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#ecd49e'; ctx.font = '20px monospace'; ctx.fillText('TREE / snow-laden needles, armored Santa and crystal royalty', 20, 30);
  ['everscream','santank','icequeen'].forEach(function(name, col) {
    [false,true].forEach(function(phase, row) {
      var x = col * 288, y = 42 + row * 330;
      ctx.drawImage(CombatArt.bossSprite(name, phase, 1, false), x, y, 288, 288);
      ctx.fillStyle = '#d9d5c4'; ctx.font = '15px monospace'; ctx.fillText(name === 'santank' ? 'Santa-NK1' : name, x + 12, y + 306);
      ctx.fillStyle = '#9cabc6'; ctx.fillText(phase ? 'phase two' : 'normal', x + 12, y + 326);
    });
  });
  return c.toDataURL('image/png');
});
writeFileSync(dir + '/frostmoon-artwork.png', Buffer.from(frostSheet.split(',')[1], 'base64'));
const invasionSheet = await page.evaluate(() => {
  var c = document.createElement('canvas'); c.width = 1152; c.height = 712;
  var ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0,0,c.width,c.height);
  ctx.fillStyle = '#ecd49e'; ctx.font = '20px monospace'; ctx.fillText('TREE / plasma steel, goblin ritual, pirate captain and ghost ship',20,30);
  ['martiansaucer','goblinwarlock','piratecaptain','flyingdutchman'].forEach(function(name,col) {
    [false,true].forEach(function(phase,row) {
      var x = col * 288, y = 42 + row * 330;
      ctx.drawImage(CombatArt.bossSprite(name,phase,1,false),x,y,288,288);
      ctx.fillStyle = '#d9d5c4'; ctx.font = '15px monospace'; ctx.fillText(name,x + 12,y + 306);
      ctx.fillStyle = '#9cabc6'; ctx.fillText(phase ? 'phase two' : 'normal',x + 12,y + 326);
    });
  });
  return c.toDataURL('image/png');
});
writeFileSync(dir + '/invasion-artwork.png',Buffer.from(invasionSheet.split(',')[1],'base64'));
const etherianSheet = await page.evaluate(() => {
  var c = document.createElement('canvas'); c.width = 1152; c.height = 712;
  var ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0,0,c.width,c.height);
  ctx.fillStyle = '#ecd49e'; ctx.font = '20px monospace'; ctx.fillText('TREE / eclipse wings, levitating mage, armored ogre and dragon',20,30);
  ['mothron','darkmage','ogre','betsy'].forEach(function(name,col) {
    [false,true].forEach(function(phase,row) {
      var x = col * 288, y = 42 + row * 330;
      ctx.drawImage(CombatArt.bossSprite(name,phase,1,false),x,y,288,288);
      ctx.fillStyle = '#d9d5c4'; ctx.font = '15px monospace'; ctx.fillText(name,x + 12,y + 306);
      ctx.fillStyle = '#9cabc6'; ctx.fillText(phase ? 'phase two' : 'normal',x + 12,y + 326);
    });
  });
  return c.toDataURL('image/png');
});
writeFileSync(dir + '/etherian-artwork.png',Buffer.from(etherianSheet.split(',')[1],'base64'));
const arenaSheet = await page.evaluate(kinds => {
  var c = document.createElement('canvas'); c.width = 1568; c.height = 570;
  var ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0,0,c.width,c.height);
  ctx.fillStyle = '#ecd49e'; ctx.font = '20px monospace'; ctx.fillText('TREE / Eternia crystal, portal and four sentry mechanisms',20,30);
  kinds.forEach(function(kind,col) {
    [false,true].forEach(function(active,row) {
      var x = col * 224, y = 52 + row * 254, sprite = CombatArt.arenaSprite(kind,row ? 3 : 1,active);
      ctx.drawImage(sprite,0,0,sprite.width,sprite.height,x + 16,y,192,192);
      ctx.fillStyle = '#d9d5c4'; ctx.font = '13px monospace'; ctx.fillText(kind,x + 12,y + 218);
      ctx.fillStyle = '#9cabc6'; ctx.fillText(kind === 'crystal' ? (active ? 'critical health' : 'healthy') :
        kind === 'portal' || kind === 'lightningfield' ? (active ? 'animation frame 4' : 'animation frame 2') : (active ? 'cooldown/recoil' : 'ready'),x + 12,y + 238);
    });
  });
  return c.toDataURL('image/png');
},arenaKinds);
writeFileSync(dir + '/arena-artwork.png',Buffer.from(arenaSheet.split(',')[1],'base64'));
const projectileSheet = await page.evaluate(() => {
  var types = ['ARROW','DART','GUNBULLET','LASER','DEATHLASER','ROCKET','STINGER','STAR','MAGICBOLT','PHANTOMBOLT','FIREBALL','CURSEDFLAME','FROSTBOLT','WATERBOLT','WATERSTREAM'];
  var c = document.createElement('canvas'); c.width = 1024; c.height = 480;
  var ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0, 0, c.width, c.height);
  types.forEach(function(type, i) {
    var x = i % 4 * 256, y = Math.floor(i / 4) * 120;
    ctx.fillStyle = '#ecd49e'; ctx.font = '13px monospace'; ctx.fillText(type, x + 12, y + 20);
    var sprite = CombatArt.projectileSprite({ type:P[type], owner:'player' }, 1);
    ctx.drawImage(sprite, x + 40, y + 24, 144, 96);
  });
  return c.toDataURL('image/png');
});
writeFileSync(dir + '/projectile-artwork.png', Buffer.from(projectileSheet.split(',')[1], 'base64'));
const effectsSheet = await page.evaluate(() => {
  var c = document.createElement('canvas'); c.width = 1000; c.height = 400;
  var ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#ecd49e'; ctx.font = '18px monospace'; ctx.fillText('TREE / combat effects — start, middle, fade', 20, 28);
  ['spark','slash','cast','boom','heal'].forEach(function(type, col) {
    [1, 0.65, 0.25].forEach(function(life, row) {
      var x = col * 200, y = 42 + row * 118;
      ctx.fillStyle = '#d9d5c4'; ctx.font = '13px monospace'; ctx.fillText(type, x + 14, y + 16);
      ctx.save(); ctx.translate(x + 100, y + 70); ctx.scale(3, 3);
      CombatArt.drawFX(ctx, { type, seed:37 }, 0, 0, life); ctx.restore();
    });
  });
  return c.toDataURL('image/png');
});
writeFileSync(dir + '/effects-artwork.png', Buffer.from(effectsSheet.split(',')[1], 'base64'));
writeFileSync(dir + '/index.html', `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Tree — combat pixel-art review</title><style>
body{margin:24px;background:#151d2d;color:#e8e7d9;font:15px/1.6 system-ui,sans-serif}h1,h2{color:#eed398}
.row{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));gap:12px}figure{margin:0 0 20px;background:#202e49;border:1px solid #536b94}
img{display:block;width:100%;height:auto;image-rendering:pixelated}figcaption{padding:6px 12px}a{color:inherit}</style>
<h1>Tree / combat artwork</h1><p>Original pixel sprites. Bosses use their real spawned state and existing hitboxes. Left: retained legacy art; middle: new art; right: phase two (or exposed shield for pillars).</p>
<figure><a href="boss-artwork.png"><img src="boss-artwork.png" alt="Original boss sprite contact sheet"></a></figure>
${names.map(name => `<h2>${name}</h2><div class="row">${['before','after','phase2'].map(state => `<figure><a href="${name}-${state}.png"><img loading="lazy" src="${name}-${state}.png" alt="${name} ${state}"></a><figcaption>${state === 'phase2' && name.startsWith('pillar_') ? 'exposed' : state}</figcaption></figure>`).join('')}</div>`).join('\n')}
<h2>Mechanical components</h2><figure><a href="mechanical-components.png"><img src="mechanical-components.png" alt="Pixel armor segments, probes and four distinct Prime tools"></a></figure>
<div class="row"><figure><img src="twins-mixed-phases.png" alt="Twins with independent phases"><figcaption>Independent Twin phases (display fixture)</figcaption></figure>
<figure><img src="prime-disarmed.png" alt="Prime spinning with all four arms destroyed"><figcaption>Prime: all four arms destroyed</figcaption></figure></div>
<h2>Hardmode transformations</h2><figure><a href="hardmode-artwork.png"><img src="hardmode-artwork.png" alt="Queen Slime, Plantera, Golem and Duke Fishron, normal and phase two"></a></figure>
<h2>Radiant and lunar animation frames</h2><figure><a href="lunar-artwork.png"><img src="lunar-artwork.png" alt="Four animation frames for Empress of Light and Moon Lord in both phases"></a></figure>
<h2>Cultist and lunar pillars</h2><figure><a href="progression-artwork.png"><img src="progression-artwork.png" alt="Cultist robes and four distinct shielded/exposed pillar themes"></a></figure>
<div class="row"><figure><img src="cultist-teleport.png" alt="Cultist immediately after its real teleport and attack"><figcaption>Real Cultist teleport and phantom fan</figcaption></figure>
<figure><img src="pillar-shield-states.png" alt="Pillars showing 100%, 75%, 0% shield labels and exposed state"><figcaption>Shield label display fixture: 100%, 75%, 0%, exposed</figcaption></figure></div>
<h2>Antlers and Pumpkin Moon</h2><figure><a href="autumn-artwork.png"><img src="autumn-artwork.png" alt="Deerclops, Mourning Wood and Pumpking in both phases"></a></figure>
<div class="row"><figure><img src="deerclops-frost-rain.png" alt="Deerclops jumping during a real falling-frost attack"><figcaption>Real Deerclops jump and frost rain</figcaption></figure>
<figure><img src="pumpking-barrage.png" alt="Pumpking emitting ten fireballs and four phantom bolts"><figcaption>Real phase-two Pumpking barrage</figcaption></figure></div>
<h2>Frost Moon</h2><figure><a href="frostmoon-artwork.png"><img src="frostmoon-artwork.png" alt="Everscream, Santa-NK1 and Ice Queen in both phases"></a></figure>
<div class="row">${['everscream','santank','icequeen'].map(name => `<figure><img src="${name}-barrage.png" alt="${name} after a real phase-two attack"><figcaption>${name}: real attack, 10 projectile ticks</figcaption></figure>`).join('')}</div>
<h2>Invasion encounters</h2><figure><a href="invasion-artwork.png"><img src="invasion-artwork.png" alt="Martian Saucer, Goblin Warlock, Pirate Captain and Flying Dutchman in both phases"></a></figure>
<div class="row">${['martiansaucer','goblinwarlock','piratecaptain','flyingdutchman'].map(name => `<figure><img src="${name}-barrage.png" alt="${name} after a real phase-two attack and summon step"><figcaption>${name}: real attack/summon state, 10 projectile ticks</figcaption></figure>`).join('')}</div>
<h2>Eclipse and Eternia defense</h2><figure><a href="etherian-artwork.png"><img src="etherian-artwork.png" alt="Mothron, Dark Mage, Ogre and Betsy in both visual phases"></a></figure>
<div class="row">${['mothron','darkmage','ogre','betsy'].map(name => `<figure><img src="${name}-encounter.png" alt="${name} after a real low-health AI step"><figcaption>${name}: real attack/summon state; Old One's Army uses a final-wave review fixture</figcaption></figure>`).join('')}</div>
<h2>Eternia arena and sentries</h2><figure><a href="arena-artwork.png"><img src="arena-artwork.png" alt="Faceted Eternia crystal, animated portal, four distinct sentries and decorative lightning field"></a></figure>
<div class="row">${['before','after','critical'].map(state => `<figure><img src="arena-${state}.png" alt="Eternia arena ${state}"><figcaption>${state}: four real deployments and attack steps; mana/health are display fixtures</figcaption></figure>`).join('')}</div>
<h2>Weapon swing</h2><div class="row">${['before','after'].map(state => `<figure><img src="swing-${state}.png" alt="Weapon swing ${state}"><figcaption>${state}</figcaption></figure>`).join('')}</div>
<h2>Common projectiles</h2><figure><img src="projectile-artwork.png" alt="Pixel projectile contact sheet"></figure>
<h2>Combat effects</h2><figure><img src="effects-artwork.png" alt="Pixel impact, cast, explosion and heal effects"></figure></html>`);
await assertNoBrowserErrors(results);
await finish(results, browser, 'combat-graphics', { bosses:names, spriteChecks:sprites, projectileChecks:projectiles, lunarChecks:lunar, progressionChecks:progressionArt, autumnChecks:autumn, frostChecks:frost, invasionChecks:invasion, etherianChecks:etherian, arenaSources,arenaChecks:arena });
