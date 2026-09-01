// ---------- Old One's Army ----------

T.ETERNIASTAND = 72;
TILE_HARD[T.ETERNIASTAND] = [0, 30];

I.ETERNIACRYSTALSTAND = 'eterniacrystalstand';
I.ETERNIACRYSTAL = 'eterniacrystal';
I.ETHERIANMANA = 'etherianmana';
I.DEFENDERMEDAL = 'defendermedal';
I.BALLISTAROD = 'ballistarod';
I.FLAMEBURSTROD = 'flameburstrod';
I.EXPLOSIVETRAPROD = 'explosivetraprod';
I.LIGHTNINGAURAROD = 'lightningaurarod';
I.SQUIREHELM = 'squirehelm';
I.SQUIRECHEST = 'squirechest';
I.SQUIRELEGS = 'squirelegs';
I.BRANDOFINFERNO = 'brandofinferno';
I.SLEEPOCTOPOD = 'sleepyoctopod';
I.BETSYSWRATH = 'betsyswrath';
I.AERIALBANE = 'aerialbane';
I.APPRENTICESCARF = 'apprenticescarf';
I.SQUIRESHIELD = 'squireshield';
I.PHANTOMPHOENIX = 'phantomphoenix';
I.TOMEOFINFINITEWISDOM = 'tomeofinfinitewisdom';
I.FLYINGDRAGON = 'flyingdragon';
I.SKYDRAGONFURY = 'skydragonfury';

defItem(I.ETERNIACRYSTALSTAND, { name:'Eternia Crystal Stand', type:'block', tile:T.ETERNIASTAND, color:'#68758a', icon:'block', maxStack:99, desc:'Place on a flat arena, then right-click with an Eternia Crystal.' });
defItem(I.ETERNIACRYSTAL, { name:'Eternia Crystal', type:'material', color:'#a8e8ff', icon:'💎', maxStack:99, desc:'Activates a valid Eternia Crystal Stand.' });
defItem(I.ETHERIANMANA, { name:'Etherian Mana', type:'material', color:'#78d8ff', icon:'✦', maxStack:999, desc:'Temporary energy used by sentries during the Old One\'s Army.' });
defItem(I.DEFENDERMEDAL, { name:'Defender Medal', type:'material', color:'#e8c858', icon:'🏅', maxStack:999, desc:'Currency awarded for defending the Eternia Crystal.' });
defItem(I.BALLISTAROD, { name:'Ballista Rod', type:'sentrystaff', sentry:'ballista', etherianCost:10, dmg:45, color:'#c89a5a', icon:'🏹', maxStack:1, desc:'Places a long-range Ballista for 10 Etherian Mana.' });
defItem(I.FLAMEBURSTROD, { name:'Flameburst Rod', type:'sentrystaff', sentry:'flameburst', etherianCost:10, dmg:32, color:'#ff7040', icon:'🔥', maxStack:1, desc:'Places a rapid Flameburst tower for 10 Etherian Mana.' });
defItem(I.EXPLOSIVETRAPROD, { name:'Explosive Trap Rod', type:'sentrystaff', sentry:'explosivetrap', etherianCost:10, dmg:55, color:'#e8b040', icon:'💥', maxStack:1, desc:'Places an explosive floor trap for 10 Etherian Mana.' });
defItem(I.LIGHTNINGAURAROD, { name:'Lightning Aura Rod', type:'sentrystaff', sentry:'lightningaura', etherianCost:10, dmg:18, color:'#a8e8ff', icon:'⚡', maxStack:1, desc:'Places a damaging lightning aura for 10 Etherian Mana.' });
defItem(I.SQUIREHELM, { name:'Squire Great Helm', type:'armor', slot:'head', def:8, color:'#a0a8b4', icon:'🪖', maxStack:1, desc:'Defense +8. Old One\'s Army armor.' });
defItem(I.SQUIRECHEST, { name:'Squire Plating', type:'armor', slot:'chest', def:12, color:'#87909d', icon:'🥋', maxStack:1, desc:'Defense +12. Old One\'s Army armor.' });
defItem(I.SQUIRELEGS, { name:'Squire Greaves', type:'armor', slot:'legs', def:9, color:'#77808d', icon:'👖', maxStack:1, desc:'Defense +9. Old One\'s Army armor.' });
defItem(I.BRANDOFINFERNO, { name:'Brand of the Inferno', type:'melee', dmg:52, speed:0.24, kb:6, range:3.2, color:'#ff8040', icon:'⚔️', maxStack:1, desc:'A blazing blade carried by the Ogre.' });
defItem(I.SLEEPOCTOPOD, { name:'Sleepy Octopod', type:'melee', dmg:70, speed:0.32, kb:8, range:3.5, color:'#9a6b58', icon:'🐙', maxStack:1, desc:'The Ogre\'s crushing flail.' });
defItem(I.BETSYSWRATH, { name:'Betsy\'s Wrath', type:'magic', dmg:78, speed:0.18, kb:5, mana:12, proj:P.FIREBALL, projCount:3, auto:true, range:999, color:'#ff5040', icon:'🔥', maxStack:1, desc:'Unleashes Betsy\'s draconic fury.' });
defItem(I.AERIALBANE, { name:'Aerial Bane', type:'ranged', dmg:72, speed:0.2, kb:5, ammo:I.ARROW, proj:P.FIREBALL, spread:3, auto:true, range:999, color:'#ffb050', icon:'🏹', maxStack:1, desc:'A bow forged to hunt flying enemies.' });
defItem(I.APPRENTICESCARF, { name:'Apprentice\'s Scarf', type:'accessory', minion:1, summonDmgMul:1.06, color:'#7b55a0', icon:'🧣', maxStack:1, desc:'A Dark Mage accessory. +1 minion and +6% summon damage.' });
defItem(I.SQUIRESHIELD, { name:'Squire\'s Shield', type:'accessory', minion:1, def:5, color:'#9aa3b0', icon:'🛡️', maxStack:1, desc:'A Dark Mage accessory. +1 minion and +5 defense.' });
defItem(I.PHANTOMPHOENIX, { name:'Phantom Phoenix', type:'ranged', dmg:66, speed:0.18, kb:5, ammo:I.ARROW, proj:P.FIREBALL, spread:2, auto:true, range:999, color:'#ff8a40', icon:'🏹', maxStack:1, desc:'An Ogre bow that fires burning phoenix arrows.' });
defItem(I.TOMEOFINFINITEWISDOM, { name:'Tome of Infinite Wisdom', type:'magic', dmg:68, speed:0.16, kb:4, mana:10, proj:P.CRESCENT, projCount:3, auto:true, range:999, color:'#c880ff', icon:'📖', maxStack:1, desc:'An ancient spellbook guarded by the Ogre.' });
defItem(I.FLYINGDRAGON, { name:'Flying Dragon', type:'melee', dmg:92, speed:0.18, kb:7, range:3.8, color:'#ff6848', icon:'⚔️', maxStack:1, desc:'A dragon-forged blade dropped by Betsy.' });
defItem(I.SKYDRAGONFURY, { name:'Sky Dragon\'s Fury', type:'magic', dmg:84, speed:0.2, kb:6, mana:12, proj:P.LASER, projCount:4, auto:true, range:999, color:'#ffb850', icon:'⚡', maxStack:1, desc:'Unleashes the fury of Betsy\'s storm.' });

TILE_DROP[T.ETERNIASTAND] = I.ETERNIACRYSTALSTAND;
TILE_COLORS[T.ETERNIASTAND] = ['#68758a', '#3f4858'];
MINIMAP_COLORS[T.ETERNIASTAND] = '#7d8da0';

E.ETHERIANGOBLIN = 216;
E.ETHERIANGOBLINBOMBER = 217;
E.ETHERIANJAVELIN = 218;
E.KOBOLD = 219;
E.KOBOLDGLIDER = 220;
E.WITHERBEAST = 221;
E.DRAKIN = 222;
E.ETHERIANWYVERN = 223;
E.OLDONESSKELETON = 266;
E.ETHERIANLIGHTNINGBUG = 267;

ENT_DEF[E.ETHERIANGOBLIN] = { w:20, h:30, hp:170, dmg:46, def:20, color:'#6f8d48', speed:2.0, name:'Etherian Goblin', exp:5 };
ENT_DEF[E.ETHERIANGOBLINBOMBER] = { w:20, h:28, hp:200, dmg:55, def:26, color:'#947044', speed:2.5, name:'Etherian Goblin Bomber', exp:6 };
ENT_DEF[E.ETHERIANJAVELIN] = { w:20, h:32, hp:300, dmg:60, def:28, color:'#788e55', speed:1.7, name:'Etherian Javelin Thrower', exp:7, shoot:true };
ENT_DEF[E.KOBOLD] = { w:22, h:24, hp:260, dmg:60, def:26, color:'#9b6043', speed:4.2, name:'Kobold', exp:11 };
ENT_DEF[E.KOBOLDGLIDER] = { w:26, h:22, hp:170, dmg:50, def:16, color:'#a87952', speed:3.8, fly:true, name:'Kobold Glider', exp:12 };
ENT_DEF[E.WITHERBEAST] = { w:32, h:34, hp:500, dmg:50, def:30, color:'#64547b', speed:1.4, name:'Wither Beast', exp:16, shoot:true };
ENT_DEF[E.DRAKIN] = { w:28, h:34, hp:900, dmg:60, def:30, color:'#9b493d', speed:2.0, name:'Drakin', exp:20, shoot:true };
ENT_DEF[E.ETHERIANWYVERN] = { w:38, h:24, hp:600, dmg:100, def:30, color:'#b24e43', speed:4.4, fly:true, name:'Etherian Wyvern', exp:24 };
ENT_DEF[E.OLDONESSKELETON] = { w:20, h:32, hp:170, dmg:44, def:16, color:'#d6ccd0', speed:2.1, name:'Old One\'s Skeleton', exp:7 };
ENT_DEF[E.ETHERIANLIGHTNINGBUG] = { w:28, h:22, hp:500, dmg:80, def:36, color:'#9ce8ff', speed:3.8, fly:true, name:'Etherian Lightning Bug', exp:22, shoot:true };

var OOA_ARENA_HALF = 30;
var OOA_PORTAL_OFFSET = 27;

var OOA_TIERS = {
  1: {
    crystalHp:1200, medals:5, boss:'darkmage',
    waves:[
      { count:6, pool:[E.ETHERIANGOBLIN] },
      { count:8, pool:[E.ETHERIANGOBLIN,E.ETHERIANJAVELIN,E.OLDONESSKELETON] },
      { count:10, pool:[E.ETHERIANGOBLIN,E.ETHERIANGOBLINBOMBER,E.OLDONESSKELETON] },
      { count:12, pool:[E.ETHERIANGOBLIN,E.ETHERIANJAVELIN,E.ETHERIANGOBLINBOMBER,E.OLDONESSKELETON] },
      { count:8, pool:[E.ETHERIANGOBLIN,E.ETHERIANJAVELIN,E.OLDONESSKELETON], boss:'darkmage' }
    ]
  },
  2: {
    crystalHp:2600, medals:15, boss:'ogre',
    waves:[
      { count:8, pool:[E.ETHERIANGOBLIN,E.KOBOLD] },
      { count:10, pool:[E.KOBOLD,E.ETHERIANJAVELIN] },
      { count:12, pool:[E.KOBOLD,E.KOBOLDGLIDER,E.WITHERBEAST] },
      { count:14, pool:[E.ETHERIANGOBLINBOMBER,E.KOBOLD,E.WITHERBEAST] },
      { count:16, pool:[E.KOBOLDGLIDER,E.WITHERBEAST,E.ETHERIANJAVELIN] },
      { count:10, pool:[E.KOBOLD,E.WITHERBEAST], boss:'ogre' }
    ]
  },
  3: {
    crystalHp:5200, medals:30, boss:'betsy',
    waves:[
      { count:10, pool:[E.KOBOLD,E.DRAKIN] },
      { count:12, pool:[E.KOBOLDGLIDER,E.DRAKIN] },
      { count:14, pool:[E.WITHERBEAST,E.DRAKIN,E.ETHERIANWYVERN] },
      { count:16, pool:[E.KOBOLD,E.DRAKIN,E.ETHERIANWYVERN] },
      { count:18, pool:[E.WITHERBEAST,E.KOBOLDGLIDER,E.ETHERIANWYVERN,E.ETHERIANLIGHTNINGBUG] },
      { count:20, pool:[E.DRAKIN,E.ETHERIANWYVERN,E.KOBOLD,E.ETHERIANLIGHTNINGBUG] },
      { count:12, pool:[E.DRAKIN,E.ETHERIANWYVERN,E.ETHERIANLIGHTNINGBUG], boss:'betsy' }
    ]
  }
};

function oldOnesArmyTier(g) {
  if (g.bossesDefeated.golem) return 3;
  if (g.bossesDefeated.twins || g.bossesDefeated.destroyer || g.bossesDefeated.skelprime) return 2;
  return 1;
}

function oldOnesArmyUnlocked(g) {
  return !!(g.bossesDefeated.eaterofworlds || g.bossesDefeated.brainofcthulhu);
}

function validateEterniaArena(g, tx, ty) {
  var w = g.world;
  if (tx - OOA_ARENA_HALF < 1 || tx + OOA_ARENA_HALF >= w.W - 1 || ty < 5 || ty + 1 >= w.H) {
    return { ok:false, message:'The arena needs more open space.' };
  }
  for (var x = tx - OOA_ARENA_HALF; x <= tx + OOA_ARENA_HALF; x++) {
    if (!w.isSolid(x, ty + 1) && !w.isPlatform(x, ty + 1)) {
      return { ok:false, message:'The stand needs a flat floor extending 30 tiles in both directions.' };
    }
    for (var y = ty; y >= ty - 3; y--) {
      if (x === tx && y === ty) continue;
      var t = w.get(x, y);
      if (w.isSolidTile(t) || t === T.WATER || t === T.LAVA || t === T.HONEY || t === T.SHIMMER) {
        return { ok:false, message:'Clear four tiles of space above the entire arena.' };
      }
    }
  }
  return { ok:true };
}

function tryActivateEterniaStand() {
  var tx = MOUSE.tpx, ty = MOUSE.tpy;
  if (!game.world.inBounds(tx, ty) || game.world.get(tx, ty) !== T.ETERNIASTAND) return false;
  if (dist(game.player.x, game.player.y, tx * TILE + 8, ty * TILE + 8) > 72) {
    game.message('Too far away.');
    return true;
  }
  if (!oldOnesArmyUnlocked(game)) {
    game.message('Defeat this world\'s evil boss before challenging the Old One\'s Army.');
    return true;
  }
  if (game.event || game.anyBossAlive()) {
    game.message('Another threat is already active!');
    return true;
  }
  if (game.player.inventory.countOf(I.ETERNIACRYSTAL) < 1) {
    game.message('An Eternia Crystal is required.');
    return true;
  }
  var valid = validateEterniaArena(game, tx, ty);
  if (!valid.ok) {
    game.message(valid.message);
    return true;
  }
  game.player.inventory.consume(I.ETERNIACRYSTAL, 1);
  startOldOnesArmy(tx, ty);
  return true;
}

function startOldOnesArmy(tx, ty) {
  var tier = oldOnesArmyTier(game);
  var data = OOA_TIERS[tier];
  game.event = {
    type:'oldonesarmy', mode:'objective', tier:tier, wave:0, state:'countdown', waitT:2,
    standX:tx, standY:ty, crystalX:tx * TILE + 8, crystalY:ty * TILE - 8,
    crystalHp:data.crystalHp, crystalMaxHp:data.crystalHp,
    leftPortalX:(tx - OOA_PORTAL_OFFSET) * TILE + 8,
    rightPortalX:(tx + OOA_PORTAL_OFFSET) * TILE + 8,
    portalY:ty * TILE - 8, pending:0, spawnT:0, spawnSide:-1,
    etherianMana:0, bossSpawned:false, bossKilled:false
  };
  game.message('The Old One\'s Army is approaching! Defend the Eternia Crystal!');
  AudioSys.play('roar');
  game.flash();
}

function oldOnesArmyAliveCount() {
  var n = 0;
  for (var i = 0; i < game.entities.length; i++) {
    if (!game.entities[i].dead && game.entities[i].ooaEnemy) n++;
  }
  return n;
}

function beginOldOnesArmyWave(ev) {
  var wave = OOA_TIERS[ev.tier].waves[ev.wave];
  ev.pending = wave.count;
  ev.spawnT = 0;
  ev.spawnSide = -1;
  ev.bossSpawned = !wave.boss;
  ev.bossKilled = !wave.boss;
  ev.state = 'spawning';
  game.message('Old One\'s Army wave ' + (ev.wave + 1) + '!');
}

function updateOldOnesArmy(dt) {
  var ev = game.event;
  if (!ev || ev.type !== 'oldonesarmy') return;
  if (game.world.get(ev.standX, ev.standY) !== T.ETERNIASTAND) {
    finishOldOnesArmy(false, 'The Eternia Crystal Stand was lost!');
    return;
  }
  if (ev.state === 'countdown') {
    ev.waitT -= dt;
    if (ev.waitT <= 0) beginOldOnesArmyWave(ev);
    return;
  }
  var wave = OOA_TIERS[ev.tier].waves[ev.wave];
  if (ev.state === 'spawning') {
    ev.spawnT -= dt;
    if (ev.pending > 0 && ev.spawnT <= 0 && oldOnesArmyAliveCount() < 12) {
      var type = wave.pool[Math.floor(Math.random() * wave.pool.length)];
      spawnEtherianEnemy(type, ev.spawnSide);
      ev.spawnSide *= -1;
      ev.pending--;
      ev.spawnT = Math.max(0.2, 0.48 - ev.tier * 0.06);
    }
    if (ev.pending <= 0 && !ev.bossSpawned) {
      ev.bossSpawned = true;
      spawnOldOnesArmyBoss(wave.boss, ev.spawnSide);
    }
    if (ev.pending <= 0 && ev.bossSpawned) ev.state = 'fighting';
    return;
  }
  if (ev.state === 'fighting' && oldOnesArmyAliveCount() === 0) {
    if (ev.wave >= OOA_TIERS[ev.tier].waves.length - 1) {
      finishOldOnesArmy(true, 'The Old One\'s Army has been defeated!');
    } else {
      ev.wave++;
      ev.state = 'countdown';
      ev.waitT = 1.5;
    }
  }
}

function spawnEtherianEnemy(type, side) {
  var ev = game.event;
  var def = ENT_DEF[type];
  var x = side < 0 ? ev.leftPortalX : ev.rightPortalX;
  var y = ev.portalY - (def.fly ? 70 : 0);
  var e = spawnEntity(game, type, x, y);
  e.eventEnemy = true;
  e.ooaEnemy = true;
  e.ooaSide = side;
  e.ooaTier = ev.tier;
  var mul = 1 + (ev.tier - 1) * 0.35;
  e.hp = Math.round(e.hp * mul);
  e.maxHp = e.hp;
  e.dmg = Math.round(e.dmg * (1 + (ev.tier - 1) * 0.2));
  return e;
}

function damageEterniaCrystal(amount) {
  var ev = game.event;
  if (!ev || ev.type !== 'oldonesarmy') return;
  var dmg = Math.max(1, Math.round(amount));
  ev.crystalHp = Math.max(0, ev.crystalHp - dmg);
  game.spawnFloatingText(ev.crystalX, ev.crystalY - 28, '-' + dmg, '#ff7070');
  if (ev.crystalHp <= 0) finishOldOnesArmy(false, 'The Eternia Crystal has been destroyed!');
}

function oldOnesArmyEnemyStep(e, g) {
  var ev = g.event;
  if (!ev || ev.type !== 'oldonesarmy') { e.dead = true; return; }
  e.attackCd = (e.attackCd || 0) - 1 / 60;
  e.dir = ev.crystalX >= e.x ? 1 : -1;
  if (e.fly) {
    var dx = ev.crystalX - e.x, dy = ev.crystalY - e.y;
    var d = Math.sqrt(dx * dx + dy * dy) || 1;
    e.x += dx / d * e.speed;
    e.y += dy / d * e.speed;
  } else {
    e.vx = e.dir * e.speed;
    if (e.onGround && Math.random() < 0.01) e.vy = -6;
    physicsStep(e, g);
  }
  if ((e.type === E.ETHERIANJAVELIN || e.type === E.WITHERBEAST || e.type === E.DRAKIN || e.type === E.ETHERIANLIGHTNINGBUG) &&
      e.attackCd <= 0 && dist(e.x, e.y, g.player.x, g.player.y) < 400) {
    e.attackCd = e.type === E.DRAKIN ? 1.2 : (e.type === E.ETHERIANLIGHTNINGBUG ? 1.0 : 2.0);
    var ang = Math.atan2(g.player.y - e.y, g.player.x - e.x);
    var projectile = e.type === E.DRAKIN ? P.FIREBALL : (e.type === E.ETHERIANLIGHTNINGBUG ? P.LASER : P.ARROW);
    g.projectiles.add({ x:e.x, y:e.y - 10, vx:Math.cos(ang) * 5, vy:Math.sin(ang) * 5, dmg:Math.round(e.dmg * 0.55), type:projectile, owner:'enemy', life:4, dead:false, ooaProjectile:true });
  }
  if (Math.abs(e.x - ev.crystalX) < 28 && Math.abs(e.y - ev.crystalY) < 55 && e.attackCd <= 0) {
    e.attackCd = 0.8;
    damageEterniaCrystal(e.type === E.ETHERIANGOBLINBOMBER || e.type === E.KOBOLD ? e.dmg * 1.5 : e.dmg * 0.45);
    if (e.type === E.ETHERIANGOBLINBOMBER || e.type === E.KOBOLD) {
      g.fx.push({ type:'boom', x:e.x, y:e.y, t:0.3, max:0.3, seed:Math.random() * 100 });
      e.dead = true;
    }
  }
  if (dist(e.x, e.y, g.player.x, g.player.y) < (e.w + g.player.w) / 2) g.damagePlayer(e.dmg, e, e.x < g.player.x ? 5 : -5);
}

function oldOnesArmyEnemyKilled(e) {
  if (!game.event || game.event.type !== 'oldonesarmy' || !e.ooaEnemy || e.ooaBoss) return;
  var mana = 1 + Math.floor(Math.random() * (game.event.tier + 1));
  game.event.etherianMana += mana;
  game.spawnFloatingText(e.x, e.y - 20, '+' + mana + ' Etherian Mana', '#78d8ff');
}

function oldOnesArmySentryTarget(s, range) {
  var best = null, bd = range * range;
  for (var i = 0; i < game.entities.length; i++) {
    var e = game.entities[i];
    if (e.dead || !e.ooaEnemy) continue;
    var d = dist2(s.x, s.y, e.x, e.y);
    if (d < bd) { bd = d; best = e; }
  }
  return best;
}

function spawnOldOnesSentry(def, x, y) {
  var s = {
    type:-6, sentry:def.sentry, ooaSentry:true, x:x, y:y, w:26, h:28,
    vx:0, vy:0, hp:9999, maxHp:9999, dmg:0, def:99, dead:false, age:0,
    attackCd:0, attackDmg:Math.round(def.dmg * game.player.inventory.damageMultiplier('summon')),
    color:def.color, name:def.name
  };
  game.entities.push(s);
  return s;
}

function oldOnesArmySentryStep(s, g) {
  if (!g.event || g.event.type !== 'oldonesarmy') { s.dead = true; return; }
  s.age += 1 / 60;
  s.attackCd -= 1 / 60;
  var range = s.sentry === 'ballista' ? 520 : (s.sentry === 'flameburst' ? 340 : 90);
  var target = oldOnesArmySentryTarget(s, range);
  if (!target || s.attackCd > 0) return;
  if (s.sentry === 'ballista' || s.sentry === 'flameburst') {
    s.attackCd = s.sentry === 'ballista' ? 1.1 : 0.55;
    var ang = Math.atan2(target.y - s.y, target.x - s.x);
    g.projectiles.add({ x:s.x, y:s.y - 12, vx:Math.cos(ang) * (s.sentry === 'ballista' ? 8 : 6), vy:Math.sin(ang) * (s.sentry === 'ballista' ? 8 : 6), dmg:s.attackDmg, type:s.sentry === 'ballista' ? P.ARROW : P.FIREBALL, owner:'player', life:4, dead:false, eventOnly:'oldonesarmy' });
    AudioSys.play('shoot');
  } else if (s.sentry === 'explosivetrap') {
    s.attackCd = 1.5;
    for (var i = 0; i < g.entities.length; i++) {
      var e = g.entities[i];
      if (!e.dead && e.ooaEnemy && dist(s.x, s.y, e.x, e.y) < 100) {
        if (e.boss) g.hitBoss(e, s.attackDmg, 0, 0);
        else hitEntity(e, s.attackDmg, 0, -2, g);
      }
    }
    g.fx.push({ type:'boom', x:s.x, y:s.y, t:0.35, max:0.35, seed:Math.random() * 100 });
  } else {
    s.attackCd = 0.3;
    for (var j = 0; j < g.entities.length; j++) {
      var a = g.entities[j];
      if (!a.dead && a.ooaEnemy && dist(s.x, s.y, a.x, a.y) < 105) {
        if (a.boss) g.hitBoss(a, s.attackDmg, 0, 0);
        else hitEntity(a, s.attackDmg, 0, 0, g);
      }
    }
  }
}

Player.prototype.trySentry = function(g, def) {
  if (this.attackCd > 0) return;
  if (!g.event || g.event.type !== 'oldonesarmy') { g.message('Etherian sentries only function during the Old One\'s Army.'); return; }
  if (g.event.etherianMana < def.etherianCost) { g.message('Not enough Etherian Mana!'); return; }
  var tx = Math.floor(MOUSE.wx / TILE), ty = Math.floor(MOUSE.wy / TILE);
  if (tx < g.event.standX - OOA_ARENA_HALF || tx > g.event.standX + OOA_ARENA_HALF || !g.world.inBounds(tx, ty)) {
    g.message('Place the sentry inside the Eternia arena.'); return;
  }
  if (g.world.get(tx, ty) !== T.AIR || (!g.world.isSolid(tx, ty + 1) && !g.world.isPlatform(tx, ty + 1))) {
    g.message('Sentries need clear, supported ground.'); return;
  }
  var count = 0;
  for (var i = 0; i < g.entities.length; i++) if (!g.entities[i].dead && g.entities[i].ooaSentry) count++;
  if (count >= 12) { g.message('The arena cannot support more sentries.'); return; }
  g.event.etherianMana -= def.etherianCost;
  this.attackCd = 0.4;
  spawnOldOnesSentry(def, tx * TILE + 8, ty * TILE + 8);
  AudioSys.play('place');
};

function spawnOldOnesArmyBoss(id, side) {
  var ev = game.event;
  var x = side < 0 ? ev.leftPortalX : ev.rightPortalX;
  var defs = {
    darkmage:{ name:'Dark Mage', w:42, h:48, hp:800, dmg:40, def:18, color:'#704590', barColor:'#bd70e8' },
    ogre:{ name:'Ogre', w:70, h:72, hp:15000, dmg:68, def:20, color:'#776044', barColor:'#c89858' },
    betsy:{ name:'Betsy', w:92, h:58, hp:42000, dmg:82, def:28, color:'#a93c32', barColor:'#ff6048' }
  };
  var d = defs[id];
  var e = makeBoss(game, { boss:id, name:d.name, w:d.w, h:d.h, hp:d.hp, dmg:d.dmg, def:d.def, color:d.color, barColor:d.barColor, x:x, y:ev.portalY - (id === 'ogre' ? 100 : 180) });
  e.ooaEnemy = true;
  e.ooaBoss = true;
  e.eventEnemy = true;
  e.ooaSide = side;
  return e;
}

function oldOnesArmyBossStep(e, g) {
  var ev = g.event;
  if (!ev || ev.type !== 'oldonesarmy') { e.dead = true; return; }
  e.attackTimer -= 1 / 60;
  e.dir = ev.crystalX >= e.x ? 1 : -1;
  if (e.boss === 'ogre') {
    e.vx = lerp(e.vx, e.dir * 1.4, 0.05);
    if (e.onGround && Math.random() < 0.008) e.vy = -8;
    physicsStep(e, g, { gravity:0.85 });
    if (e.attackTimer <= 0) {
      e.attackTimer = 1.5;
      var oa = Math.atan2(g.player.y - e.y, g.player.x - e.x);
      g.projectiles.add({ x:e.x, y:e.y - 20, vx:Math.cos(oa) * 5, vy:Math.sin(oa) * 5, dmg:42, type:P.SPIT, owner:'enemy', life:4, dead:false, ooaProjectile:true });
    }
  } else {
    var tx = e.boss === 'betsy' ? ev.crystalX + Math.sin(e.age * 1.2) * 220 : ev.crystalX + e.ooaSide * 150;
    var ty = ev.crystalY - (e.boss === 'betsy' ? 170 : 100);
    var dx = tx - e.x, dy = ty - e.y, dd = Math.sqrt(dx * dx + dy * dy) || 1;
    var speed = e.boss === 'betsy' ? 4.0 : 2.5;
    e.x += dx / dd * speed; e.y += dy / dd * speed;
    if (e.attackTimer <= 0) {
      e.attackTimer = e.boss === 'betsy' ? 0.8 : 1.5;
      var n = e.boss === 'betsy' ? 5 : 3;
      var ba = Math.atan2(g.player.y - e.y, g.player.x - e.x);
      for (var i = 0; i < n; i++) {
        var spread = (i - (n - 1) / 2) * 0.16;
        g.projectiles.add({ x:e.x, y:e.y, vx:Math.cos(ba + spread) * 5.5, vy:Math.sin(ba + spread) * 5.5, dmg:e.boss === 'betsy' ? 48 : 32, type:e.boss === 'betsy' ? P.FIREBALL : P.MAGICBOLT, owner:'enemy', life:4, dead:false, ooaProjectile:true });
      }
      if (e.boss === 'darkmage' && Math.random() < 0.35) spawnEtherianEnemy(Math.random() < 0.5 ? E.ETHERIANGOBLIN : E.OLDONESSKELETON, e.ooaSide);
    }
  }
  e.objectiveCd = (e.objectiveCd || 0) - 1 / 60;
  if (Math.abs(e.x - ev.crystalX) < 100 && e.objectiveCd <= 0) {
    e.objectiveCd = e.boss === 'betsy' ? 1.2 : 1.8;
    damageEterniaCrystal(e.dmg * 0.55);
  }
  if (dist(e.x, e.y, g.player.x, g.player.y) < (e.w + g.player.w) / 2) g.damagePlayer(e.dmg, e, e.x < g.player.x ? 8 : -8);
}

function oldOnesArmyBossKilled(e, g) {
  if (g.event && g.event.type === 'oldonesarmy') g.event.bossKilled = true;
  var rewards = {
    darkmage:[I.APPRENTICESCARF,I.SQUIRESHIELD],
    ogre:[I.BRANDOFINFERNO,I.SLEEPOCTOPOD,I.PHANTOMPHOENIX,I.TOMEOFINFINITEWISDOM],
    betsy:[I.BETSYSWRATH,I.AERIALBANE,I.FLYINGDRAGON,I.SKYDRAGONFURY]
  };
  var pool = rewards[e.boss] || rewards.darkmage;
  var reward = pool[Math.floor(Math.random() * pool.length)];
  g.addPickup(e.x, e.y, reward, 1);
  g.message(e.name + ' has been defeated!');
}

function finishOldOnesArmy(success, message) {
  var ev = game.event;
  if (!ev || ev.type !== 'oldonesarmy') return;
  var tier = ev.tier;
  for (var i = 0; i < game.entities.length; i++) {
    if (game.entities[i].ooaEnemy || game.entities[i].ooaSentry) game.entities[i].dead = true;
  }
  for (var p = 0; p < game.projectiles.list.length; p++) {
    if (game.projectiles.list[p].eventOnly === 'oldonesarmy' || game.projectiles.list[p].ooaProjectile) game.projectiles.list[p].dead = true;
  }
  game.event = null;
  if (success) {
    var key = 'tier' + tier;
    game.ooaWins[key] = (game.ooaWins[key] || 0) + 1;
    var count = OOA_TIERS[tier].medals;
    var added = game.player.inventory.add(I.DEFENDERMEDAL, count);
    if (added < count) game.addPickup(game.player.x, game.player.y - 20, I.DEFENDERMEDAL, count - added);
    Achievements.unlock(tier === 1 ? 'darkmage' : (tier === 2 ? 'ogre' : 'betsy'), game);
    Achievements.unlock('oldonesarmy', game);
    if (!game.lanternNight.celebrated['event:oldonesarmy']) {
      game.lanternNight.celebrated['event:oldonesarmy'] = true;
      game.lanternNight.pending = true;
    }
  }
  if (message) game.message(message);
  AudioSys.play(success ? 'bossDeath' : 'hurt');
}

var TAVERNKEEP_SHOP = [
  { item:I.ETERNIACRYSTALSTAND, currency:I.GOLD, cost:5, tier:1 },
  { item:I.ETERNIACRYSTAL, currency:I.GOLD, cost:1, tier:1 },
  { item:I.BALLISTAROD, currency:I.DEFENDERMEDAL, cost:5, tier:1 },
  { item:I.FLAMEBURSTROD, currency:I.DEFENDERMEDAL, cost:5, tier:1 },
  { item:I.EXPLOSIVETRAPROD, currency:I.DEFENDERMEDAL, cost:5, tier:1 },
  { item:I.LIGHTNINGAURAROD, currency:I.DEFENDERMEDAL, cost:5, tier:1 },
  { item:I.SQUIREHELM, currency:I.DEFENDERMEDAL, cost:10, tier:2 },
  { item:I.SQUIRECHEST, currency:I.DEFENDERMEDAL, cost:15, tier:2 },
  { item:I.SQUIRELEGS, currency:I.DEFENDERMEDAL, cost:10, tier:2 }
];

function tryOpenTavernkeep() {
  for (var i = 0; i < game.entities.length; i++) {
    var e = game.entities[i];
    if (e.dead || e.type !== E.TAVERNKEEP) continue;
    if (dist(game.player.x, game.player.y, e.x, e.y) < 90 && dist(MOUSE.wx, MOUSE.wy, e.x, e.y) < 48) {
      game.tavernkeepOpen = true;
      openPanel();
      switchPanel('tavernkeep');
      renderTavernkeepShop();
      return true;
    }
  }
  return false;
}

function renderTavernkeepShop() {
  var root = document.getElementById('panel-tavernkeep');
  if (!root) return;
  if (!oldOnesArmyUnlocked(game)) {
    root.innerHTML = '<h3>Tavernkeep</h3><div class="ddesc">Defeat the Eater of Worlds or Brain of Cthulhu. Then I will trust you with the Eternia Crystal.</div>';
    return;
  }
  var tier = oldOnesArmyTier(game);
  var medals = game.player.inventory.countOf(I.DEFENDERMEDAL);
  var html = '<h3>Tavernkeep - Defender Tier ' + tier + '</h3><div class="ddesc">Defender Medals: ' + medals + '</div>';
  if (!game.tavernGiftClaimed) html += '<button class="tavern-buy" data-tavern-gift="1">Claim Defender Kit</button>';
  html += '<div class="tavern-shop">';
  for (var i = 0; i < TAVERNKEEP_SHOP.length; i++) {
    var row = TAVERNKEEP_SHOP[i];
    var unlocked = row.tier <= tier && (row.tier === 1 || game.ooaWins['tier' + (row.tier - 1)] > 0);
    var it = ITEMS[row.item], cur = ITEMS[row.currency];
    html += '<div class="tavern-item' + (unlocked ? '' : ' locked') + '"><div class="picon">' + itemIconHTML(it) + '</div>' +
      '<div class="shop-info"><div class="shop-name">' + it.name + '</div><div class="shop-cost">' + (unlocked ? row.cost + ' ' + cur.name : 'Locked: clear Defender Tier ' + (row.tier - 1)) + '</div></div>' +
      (unlocked ? '<button class="tavern-buy" data-tavern-item="' + i + '">Buy</button>' : '') + '</div>';
  }
  root.innerHTML = html + '</div>';
}

function buyTavernkeepItem(index) {
  var row = TAVERNKEEP_SHOP[index];
  if (!row || !oldOnesArmyUnlocked(game)) return;
  var tier = oldOnesArmyTier(game);
  if (row.tier > tier || (row.tier > 1 && !game.ooaWins['tier' + (row.tier - 1)])) return;
  var inv = game.player.inventory;
  if (inv.countOf(row.currency) < row.cost) { game.message('Not enough ' + ITEMS[row.currency].name + '.'); return; }
  if (inv.add(row.item, 1) < 1) { game.message('Your inventory is full.'); return; }
  inv.consume(row.currency, row.cost);
  AudioSys.play('pickup');
  renderTavernkeepShop();
}

function claimTavernkeepGift() {
  if (game.tavernGiftClaimed || !oldOnesArmyUnlocked(game)) return;
  var empty = 0;
  for (var i = 0; i < game.player.inventory.slots.length; i++) if (!game.player.inventory.slots[i]) empty++;
  if (empty < 3) { game.message('Make room for three Defender Kit items.'); return; }
  game.player.inventory.add(I.ETERNIACRYSTALSTAND, 1);
  game.player.inventory.add(I.ETERNIACRYSTAL, 5);
  game.player.inventory.add(I.BALLISTAROD, 1);
  game.tavernGiftClaimed = true;
  game.message('Defender Kit received. Build a flat arena around the Stand.');
  AudioSys.play('pickup');
  renderTavernkeepShop();
}

function drawOldOnesArmyWorld(g, ctx, cam, W, H) {
  var ev = g.event;
  if (!ev || ev.type !== 'oldonesarmy') return;
  var cx = ev.crystalX - cam.x + W / 2, cy = ev.crystalY - cam.y + H / 2;
  var pulse = 1 + Math.sin(Time.seconds * 6) * 0.12;
  ctx.fillStyle = 'rgba(120,220,255,0.22)';
  ctx.beginPath(); ctx.arc(cx, cy, 20 * pulse, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#a8e8ff';
  ctx.beginPath(); ctx.moveTo(cx, cy - 17); ctx.lineTo(cx + 11, cy); ctx.lineTo(cx, cy + 17); ctx.lineTo(cx - 11, cy); ctx.closePath(); ctx.fill();
  var portals = [ev.leftPortalX, ev.rightPortalX];
  for (var i = 0; i < 2; i++) {
    var px = portals[i] - cam.x + W / 2, py = ev.portalY - cam.y + H / 2;
    ctx.strokeStyle = '#aa60e8'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.ellipse(px, py - 20, 16, 30, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(150,70,220,0.2)'; ctx.fill();
  }
}

function drawOldOnesArmyEnemy(ctx, e, cam, W, H) {
  var x = e.x - cam.x + W / 2, y = e.y - cam.y + H / 2;
  if (e.type === E.ETHERIANLIGHTNINGBUG) {
    ctx.fillStyle = 'rgba(156,232,255,0.24)';
    ctx.beginPath(); ctx.arc(x, y, e.w / 2 + 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = e.color;
    ctx.beginPath(); ctx.ellipse(x, y, e.w / 2, e.h / 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff8a0'; ctx.beginPath(); ctx.arc(x + 5, y - 2, 4, 0, Math.PI * 2); ctx.fill();
  } else if (e.type === E.KOBOLDGLIDER || e.type === E.ETHERIANWYVERN) {
    ctx.fillStyle = e.color;
    ctx.beginPath(); ctx.ellipse(x, y, e.w / 2, e.h / 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e8b878';
    ctx.beginPath(); ctx.moveTo(x - 5, y); ctx.lineTo(x - 24, y - 13); ctx.lineTo(x - 18, y + 8); ctx.fill();
  } else {
    drawHumanoid(ctx, x, y, e.color, e.type === E.WITHERBEAST || e.type === E.DRAKIN, e.dir || 1, e.type === E.OLDONESSKELETON);
  }
}

function drawOldOnesArmySentry(ctx, s, cam, W, H) {
  var x = s.x - cam.x + W / 2, y = s.y - cam.y + H / 2;
  if (s.sentry === 'lightningaura') {
    ctx.fillStyle = 'rgba(120,220,255,0.13)';
    ctx.beginPath(); ctx.arc(x, y, 90 + Math.sin(Time.seconds * 7) * 5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#66503a'; ctx.fillRect(x - 10, y, 20, 8);
  ctx.fillStyle = s.color; ctx.fillRect(x - 6, y - 18, 12, 20);
  if (s.sentry === 'ballista') {
    ctx.strokeStyle = '#e0b878'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x - 14, y - 14); ctx.lineTo(x + 14, y - 14); ctx.moveTo(x, y - 23); ctx.lineTo(x, y - 6); ctx.stroke();
  } else if (s.sentry === 'explosivetrap') {
    ctx.fillStyle = '#e8b040'; ctx.fillRect(x - 14, y - 4, 28, 5);
  }
}

function drawOldOnesArmyBoss(g, ctx, e, cam, W, H) {
  var x = e.x - cam.x + W / 2, y = e.y - cam.y + H / 2;
  if (e.boss === 'darkmage') {
    ctx.fillStyle = '#47285f';
    ctx.beginPath(); ctx.moveTo(x - 18, y + 22); ctx.lineTo(x + 18, y + 22); ctx.lineTo(x + 10, y - 18); ctx.lineTo(x - 10, y - 18); ctx.fill();
    ctx.fillStyle = '#b8ff70'; ctx.beginPath(); ctx.arc(x, y - 20, 7, 0, Math.PI * 2); ctx.fill();
  } else if (e.boss === 'ogre') {
    ctx.fillStyle = '#776044'; ctx.fillRect(x - 30, y - 35, 60, 70);
    ctx.fillStyle = '#d8b878'; ctx.beginPath(); ctx.arc(x, y - 38, 22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#111'; ctx.fillRect(x - 11, y - 42, 7, 5); ctx.fillRect(x + 5, y - 42, 7, 5);
  } else {
    ctx.fillStyle = '#a93c32'; ctx.beginPath(); ctx.ellipse(x, y, 42, 25, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - 20, y); ctx.lineTo(x - 65, y - 30); ctx.lineTo(x - 50, y + 18); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x + 20, y); ctx.lineTo(x + 65, y - 30); ctx.lineTo(x + 50, y + 18); ctx.fill();
    ctx.fillStyle = '#ffd050'; ctx.beginPath(); ctx.arc(x + 30, y - 8, 5, 0, Math.PI * 2); ctx.fill();
  }
}
