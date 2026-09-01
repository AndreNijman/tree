// ---------- Bosses: The Twins, The Destroyer, Skeletron Prime ----------

function makeBoss(game, def) {
  var dm = diffScale();
  var e = {
    type: -1, boss: def.boss, sub: def.sub || null,
    x: def.x, y: def.y, w: def.w, h: def.h,
    vx: 0, vy: 0, kbVx: 0, kbVy: 0,
    hp: Math.round(def.hp * dm.hp), maxHp: Math.round(def.hp * dm.hp), dmg: Math.round(def.dmg * dm.dmg), def: def.def || 0, defV: def.def || 0,
    fly: true, onGround: false, flash: 0, dead: false, age: 0,
    dir: 1, timer: 0, phase2: false, color: def.color, name: def.name,
    orbitAng: Math.random() * 6.28, targetX: def.x, targetY: def.y,
    segments: [], probes: [], arms: [], attackTimer: 0, charge: 0
  };
  game.entities.push(e);
  game.bossBars.push({ id: e, name: def.name, hp: e.hp, maxHp: e.maxHp, color: def.barColor || '#ff4d4d' });
  return e;
}

function bossStep(e, game) {
  e.age += 1 / 60;
  e.flash = Math.max(0, e.flash - 1 / 60);
  if (e.hp <= e.maxHp * 0.4 && !e.phase2) e.phase2 = true;
  if (e.ooaBoss) {
    oldOnesArmyBossStep(e, game);
    return;
  }
  if (e.boss === 'twins') twinsStep(e, game);
  else if (e.boss === 'destroyer') destroyerStep(e, game);
  else if (e.boss === 'skelprime') skelStep(e, game);
  else if (e.boss === 'kingslime') kingSlimeStep(e, game);
  else if (e.boss === 'eyeofcthulhu') eyeStep(e, game);
  else if (e.boss === 'eaterofworlds') eaterWorldsStep(e, game);
  else if (e.boss === 'brainofcthulhu') brainStep(e, game);
  else if (e.boss === 'queenbee') queenBeeStep(e, game);
  else if (e.boss === 'skeletron') skeletronStep(e, game);
  else if (e.boss === 'wallofflesh') wallOfFleshStep(e, game);
  else if (e.boss === 'queenslime') queenSlimeStep(e, game);
  else if (e.boss === 'plantera') planteraStep(e, game);
  else if (e.boss === 'golem') golemStep(e, game);
  else if (e.boss === 'duke') dukeStep(e, game);
  else if (e.boss === 'empress') empressStep(e, game);
  else if (e.boss === 'cultist') cultistStep(e, game);
  else if (e.boss === 'moonlord') moonLordStep(e, game);
  else if (e.boss === 'lunar') lunarPillarStep(e, game);
  else if (e.boss === 'mourningwood') mourningWoodStep(e, game);
  else if (e.boss === 'pumpking') pumpkingStep(e, game);
  else if (e.boss === 'everscream') mourningWoodStep(e, game);
  else if (e.boss === 'santank') santankStep(e, game);
  else if (e.boss === 'icequeen') iceQueenStep(e, game);
  else if (e.boss === 'martiansaucer') martianSaucerStep(e, game);
  else if (e.boss === 'goblinwarlock') goblinWarlockStep(e, game);
  else if (e.boss === 'piratecaptain') pirateCaptainStep(e, game);
  else if (e.boss === 'flyingdutchman') flyingDutchmanStep(e, game);
  else if (e.boss === 'mothron') mothronStep(e, game);
  else if (e.boss === 'deerclops') deerclopsStep(e, game);
}

// Keep boss near player
function bossLeash(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  if (dist(e.x, e.y, p.x, p.y) > 1100) {
    e.x = p.x + (Math.random() * 400 - 200);
    e.y = p.y - 200;
  }
}

function aimProj(game, sx, sy, tx, ty, speed, type, dmg, spread) {
  var ang = Math.atan2(ty - sy, tx - sx) + (spread || 0);
  game.projectiles.add({
    x: sx, y: sy, vx: Math.cos(ang) * speed, vy: Math.sin(ang) * speed,
    dmg: dmg, type: type, owner: 'enemy', life: 6, dead: false
  });
}

// ---------------- The Twins ----------------
function spawnTwins(game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  AudioSys.play('roar');
  var r = makeBoss(game, { boss:'twins', sub:'retinazer', name:'Retinazer', w:46, h:46, hp:8500, dmg:50, def:8, color:'#ff3d4d', barColor:'#ff4d4d', x:p.x + 420, y:p.y - 180 });
  var s = makeBoss(game, { boss:'twins', sub:'spazmatism', name:'Spazmatism', w:46, h:46, hp:8500, dmg:60, def:8, color:'#3dff9d', barColor:'#3dff9d', x:p.x - 420, y:p.y - 180 });
  r.sibling = s; s.sibling = r;
  return [r, s];
}

function twinsStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  bossLeash(e, game);
  var isRet = e.sub === 'retinazer';
  var speed = (e.phase2 ? 7.5 : 5.5);
  var wantDist = isRet ? 220 : 130;

  // orbit angle drifts toward player position
  var dx = p.x - e.x, dy = p.y - e.y;
  var ang = Math.atan2(dy, dx);
  e.orbitAng = lerp(e.orbitAng, ang, 0.02);
  var tx = p.x + Math.cos(e.orbitAng + Math.PI * 0.25) * wantDist;
  var ty = p.y + Math.sin(e.orbitAng + Math.PI * 0.25) * wantDist - 30;
  // phase2 dash
  e.attackTimer -= 1 / 60;
  if (e.phase2 && e.attackTimer <= -4) {
    e.charge = 0.7;
    e.attackTimer = 1.0;
  }
  if (e.charge > 0) {
    e.charge -= 1 / 60;
    e.x += Math.cos(ang) * 16;
    e.y += Math.sin(ang) * 16;
  } else {
    var mdx = tx - e.x, mdy = ty - e.y;
    var d = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
    e.vx = (mdx / d) * speed; e.vy = (mdy / d) * speed;
    e.x += e.vx; e.y += e.vy;
  }

  // attacks
  e.attackTimer -= 1 / 60;
  if (e.attackTimer <= 0) {
    if (isRet) {
      // laser burst of 3
      for (var i = -1; i <= 1; i++) {
        aimProj(game, e.x, e.y, p.x, p.y, 7, P.LASER, e.phase2 ? 30 : 22, i * 0.12);
      }
      AudioSys.play('laser');
      e.attackTimer = e.phase2 ? 1.2 : 2.2;
    } else {
      // cursed flame spray
      for (var j = -1; j <= 1; j++) {
        aimProj(game, e.x, e.y, p.x, p.y, 5.5, P.CURSEDFLAME, e.phase2 ? 34 : 26, j * 0.22);
      }
      AudioSys.play('spawn');
      e.attackTimer = e.phase2 ? 1.6 : 2.6;
    }
  }

  // contact
  if (dist(e.x, e.y, p.x, p.y) < (e.w + p.w) / 2 - 2) {
    game.damagePlayer(e.dmg, e, p.x < e.x ? 6 : -6);
  }
}

// ---------------- The Destroyer ----------------
function spawnDestroyer(game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  AudioSys.play('roar');
  var segCount = 62, segHp = 500, headHp = 49000;
  var e = makeBoss(game, { boss:'destroyer', name:'The Destroyer', w:52, h:36, hp:headHp + segCount * segHp, maxHp:headHp + segCount * segHp, dmg:70, def:0, color:'#8a8f9a', barColor:'#9ad0ff', x:p.x + 600, y:p.y - 220 });
  e.headHp = headHp; e.segHp = segHp; e.segCount = segCount;
  e.wave = 0;
  e.segments = [];
  var x = e.x, y = e.y;
  for (var i = 0; i < segCount; i++) {
    e.segments.push({ x: x - 13 * (i + 1), y: y, w: 40, h: 28, hp: segHp, dead: false, idx: i });
  }
  return e;
}

function destroyerStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  bossLeash(e, game);
  e.wave += 0.02;
  var dir = p.x > e.x ? 1 : -1;
  e.vx = dir * 4.6;
  e.vy = Math.sin(e.wave * 3) * 4;
  e.x += e.vx; e.y += e.vy;

  // segments follow
  var prevX = e.x, prevY = e.y;
  for (var i = 0; i < e.segments.length; i++) {
    var s = e.segments[i];
    if (s.dead) continue;
    var dx2 = s.x - prevX, dy2 = s.y - prevY;
    var d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2) || 1;
    var sp = 13;
    s.x = prevX + (dx2 / d2) * sp;
    s.y = prevY + (dy2 / d2) * sp;
    prevX = s.x; prevY = s.y;
  }

  // spawn probes
  e.attackTimer -= 1 / 60;
  if (e.attackTimer <= 0) {
    e.attackTimer = 4.5;
    for (var i2 = 0; i2 < 3; i2++) {
      var probe = {
        type: -2, boss: 'probe', w: 22, h: 22, x: e.x + (Math.random() * 100 - 50), y: e.y - 40,
        vx: 0, vy: 0, hp: 200, maxHp: 200, dmg: 50, def: 20, dead: false, flash: 0,
        timer: 1.0 + Math.random(), color: '#ff6d6d', name: 'Probe'
      };
      e.probes.push(probe);
    }
    AudioSys.play('spawn');
  }

  // probes update
  for (var pi = e.probes.length - 1; pi >= 0; pi--) {
    var pr = e.probes[pi];
    if (pr.dead) { e.probes.splice(pi, 1); continue; }
    pr.timer -= 1 / 60;
    var ddx = p.x - pr.x, ddy = p.y - pr.y;
    var dd = Math.sqrt(ddx * ddx + ddy * ddy) || 1;
    pr.x += (ddx / dd) * 3.2 + Math.sin(pr.timer * 5) * 0.8;
    pr.y += (ddy / dd) * 3.2;
    if (pr.timer <= 0) {
      pr.timer = 1.4;
      aimProj(game, pr.x, pr.y, p.x, p.y, 6, P.LASER, 20);
      AudioSys.play('laser');
    }
    if (Math.abs(pr.x - p.x) < 24 && Math.abs(pr.y - p.y) < 24) game.damagePlayer(28, pr, pr.x < p.x ? 5 : -5);
  }

  // contact
  if (Math.abs(e.x - p.x) < (e.w + p.w) / 2 && Math.abs(e.y - p.y) < (e.h + p.h) / 2) {
    game.damagePlayer(e.dmg, e, dir * 8);
  }
  for (var si = 0; si < e.segments.length; si++) {
    var s2 = e.segments[si];
    if (s2.dead) continue;
    if (Math.abs(s2.x - p.x) < (s2.w + p.w) / 2 && Math.abs(s2.y - p.y) < (s2.h + p.h) / 2) {
      game.damagePlayer(45, e, 6);
    }
  }
}

// ---------------- Skeletron Prime ----------------
function spawnSkeleton(game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  AudioSys.play('roar');
  var head = makeBoss(game, { boss:'skelprime', name:'Skeletron Prime', w:56, h:56, hp:28000, dmg:47, def:24, color:'#cfd6e0', barColor:'#8a9abf', x:p.x + 200, y:p.y - 260 });
  head.armCount = 4;
  var armDefs = ['laser', 'cannon', 'saw', 'vice'];
  var armColors = { laser:'#ff4d6d', cannon:'#4d9aff', saw:'#d0d0d0', vice:'#9ad0ff' };
  for (var i = 0; i < 4; i++) {
    var t = armDefs[i];
    var arm = {
      type: -3, boss: 'skelprime', armType: t, parent: head,
      x: head.x, y: head.y, w: 22, h: 22, vx: 0, vy: 0,
      hp: 9000, maxHp: 9000, dmg: t === 'saw' ? 67 : 55, def: 30,
      dead: false, flash: 0, timer: 0, ang: (i / 4) * Math.PI * 2 + 0.5,
      color: armColors[t], name: t
    };
    head.arms.push(arm);
    game.entities.push(arm);
  }
  return head;
}

function skelStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  bossLeash(e, game);
  e.wave = (e.wave || 0) + 0.03;
  // head hover: keep ~140px above player, drift left/right
  var tx = p.x + Math.sin(e.wave * 1.5) * 90;
  var ty = p.y - 150 + Math.sin(e.wave * 2) * 30;
  var armsDead = e.armCount <= 0;
  var hspeed = armsDead ? 7 : 4;
  var mdx = tx - e.x, mdy = ty - e.y;
  var d = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
  e.x += (mdx / d) * hspeed;
  e.y += (mdy / d) * hspeed;
  if (armsDead) {
    e.defV = 0;
    e.spin = (e.spin || 0) + 0.25;
  } else {
    e.spin = (e.spin || 0) + 0.08;
  }

  // head contact
  if (Math.abs(e.x - p.x) < (e.w + p.w) / 2 && Math.abs(e.y - p.y) < (e.h + p.h) / 2) {
    game.damagePlayer(armsDead ? 80 : 55, e, p.x < e.x ? 8 : -8);
  }

  // arms
  for (var i = e.arms.length - 1; i >= 0; i--) {
    var arm = e.arms[i];
    if (arm.dead) continue;
    arm.timer -= 1 / 60;
    var rad = 66;
    arm.ang += 0.03;
    var ax = e.x + Math.cos(arm.ang) * rad;
    var ay = e.y + Math.sin(arm.ang) * rad;
    arm.x = lerp(arm.x, ax, 0.15);
    arm.y = lerp(arm.y, ay, 0.15);
    arm.sawDir = arm.armType === 'saw' ? 0.12 : 0;

    switch (arm.armType) {
      case 'laser':
        if (arm.timer <= 0) {
          arm.timer = 1.6;
          aimProj(game, arm.x, arm.y, p.x, p.y, 7, P.LASER, 24);
          AudioSys.play('laser');
        }
        break;
      case 'cannon':
        if (arm.timer <= 0) {
          arm.timer = 2.4;
          aimProj(game, arm.x, arm.y, p.x, p.y, 4.5, P.ROCKET, 26);
          AudioSys.play('shoot');
        }
        break;
      case 'saw':
        if (arm.timer <= 0) {
          arm.timer = 2.0;
          arm.dash = { x: p.x, y: p.y, t: 0.8 };
        }
        if (arm.dash) {
          arm.dash.t -= 1 / 60;
          var ddx = arm.dash.x - arm.x, ddy = arm.dash.y - arm.y;
          var dd = Math.sqrt(ddx * ddx + ddy * ddy) || 1;
          arm.x += (ddx / dd) * 10;
          arm.y += (ddy / dd) * 10;
          if (arm.dash.t <= 0) arm.dash = null;
        }
        break;
      case 'vice':
        if (arm.timer <= 0) {
          arm.timer = 3.0;
          arm.dash = { x: p.x, y: p.y, t: 1.1 };
        }
        if (arm.dash) {
          arm.dash.t -= 1 / 60;
          var ddx2 = arm.dash.x - arm.x, ddy2 = arm.dash.y - arm.y;
          var dd2 = Math.sqrt(ddx2 * ddx2 + ddy2 * ddy2) || 1;
          arm.x += (ddx2 / dd2) * 6.5;
          arm.y += (ddy2 / dd2) * 6.5;
          if (arm.dash.t <= 0) arm.dash = null;
        }
        break;
    }
    // arm contact
    if (Math.abs(arm.x - p.x) < (arm.w + p.w) / 2 && Math.abs(arm.y - p.y) < (arm.h + p.h) / 2) {
      game.damagePlayer(arm.dmg, arm, arm.x < p.x ? 7 : -7);
    }
  }
}

// ---------------- Queen Slime ----------------
function spawnQueenSlime(game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  AudioSys.play('roar');
  return makeBoss(game, { boss:'queenslime', name:'Queen Slime', w:72, h:52, hp:18000, dmg:60, def:26, color:'#ff8fd0', barColor:'#ff8fd0', x:p.x + 300, y:p.y - 160 });
}

function queenSlimeStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  bossLeash(e, game);
  // big bounces
  e.timer -= 1 / 60;
  e.vx = lerp(e.vx, (p.x > e.x ? 1 : -1) * 1.5, 0.02);
  if (e.onGround && e.timer <= 0) {
    e.vy = -(10 + Math.random() * 4);
    e.vx = (p.x > e.x ? 1 : -1) * (3 + Math.random() * 3);
    e.timer = 1.2;
  }
  physicsStep(e, game, { gravity: 0.9 });

  // spawn slime minions
  e.attackTimer -= 1 / 60;
  if (e.attackTimer <= 0 && !e.phase2) {
    e.attackTimer = 3.5;
    for (var i = 0; i < 2; i++) {
      spawnEntity(game, E.JUNGLESLIME, e.x + (Math.random() * 80 - 40), e.y);
    }
    AudioSys.play('spawn');
  }
  if (e.phase2) {
    e.attackTimer -= 1 / 60;
    if (e.attackTimer <= -2) {
      e.attackTimer = 1.4;
      for (var j = 0; j < 8; j++) {
        var ang = j / 8 * Math.PI * 2;
        game.projectiles.add({
          x: e.x, y: e.y, vx: Math.cos(ang) * 4.5, vy: Math.sin(ang) * 4.5,
          dmg: 26, type: P.MAGICBOLT, owner: 'enemy', life: 3, dead: false
        });
      }
      AudioSys.play('laser');
    }
  }
  // contact
  if (dist(e.x, e.y, p.x, p.y) < (e.w + p.w) / 2 - 2) {
    game.damagePlayer(e.dmg, e, p.x < e.x ? 7 : -7);
  }
}

// ---------------- Plantera ----------------
function spawnPlantera(game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  AudioSys.play('roar');
  return makeBoss(game, { boss:'plantera', name:'Plantera', w:78, h:78, hp:30000, dmg:50, def:36, color:'#6bff8a', barColor:'#6bff8a', x:p.x, y:p.y - 60 });
}

function planteraStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  bossLeash(e, game);
  var speed = e.phase2 ? 4.5 : 2.6;
  // approach slowly in phase 1, hunt in phase 2
  var dx = p.x - e.x, dy = p.y - e.y;
  var d = Math.sqrt(dx * dx + dy * dy) || 1;
  if (e.phase2 || d > 200) {
    e.x += (dx / d) * speed;
    e.y += (dy / d) * speed;
  } else {
    e.x += (dx / d) * speed * 0.5;
    e.y += (dy / d) * speed * 0.5;
  }

  e.attackTimer -= 1 / 60;
  if (e.attackTimer <= 0) {
    e.attackTimer = e.phase2 ? 1.1 : 2.0;
    // spore ring
    var n = e.phase2 ? 10 : 5;
    for (var i = 0; i < n; i++) {
      var ang = (i / n) * Math.PI * 2 + Math.random() * 0.5;
      var sp = 3 + Math.random() * 2.5;
      game.projectiles.add({
        x: e.x, y: e.y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
        dmg: e.phase2 ? 34 : 26, type: P.SPORE, owner: 'enemy', life: 4, dead: false
      });
    }
    AudioSys.play('magic');
  }
  // thorns when close
  if (d < 120 && Math.random() < 0.02) {
    for (var j = -1; j <= 1; j++) {
      var ta = Math.atan2(p.y - e.y, p.x - e.x) + j * 0.3;
      game.projectiles.add({
        x: e.x + Math.cos(ta) * 30, y: e.y + Math.sin(ta) * 30,
        vx: Math.cos(ta) * 6, vy: Math.sin(ta) * 6,
        dmg: 28, type: P.STINGER, owner: 'enemy', life: 1.5, dead: false
      });
    }
  }
  // contact
  if (dist(e.x, e.y, p.x, p.y) < (e.w + p.w) / 2 - 2) {
    game.damagePlayer(e.dmg, e, p.x < e.x ? 8 : -8);
  }
}

// ---------------- Golem ----------------
function spawnGolem(game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  AudioSys.play('roar');
  return makeBoss(game, { boss:'golem', name:'Golem', w:70, h:70, hp:25000, dmg:64, def:20, color:'#c8b090', barColor:'#ffb84d', x:p.x, y:p.y - 120 });
}

function golemStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  bossLeash(e, game);
  // hover and strafe
  e.wave = (e.wave || 0) + 0.03;
  var tx = p.x + Math.sin(e.wave) * 130;
  var ty = p.y - 130 + Math.sin(e.wave * 1.7) * 40;
  var mdx = tx - e.x, mdy = ty - e.y;
  var d = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
  var speed = e.phase2 ? 5 : 3.2;
  e.x += (mdx / d) * speed;
  e.y += (mdy / d) * speed;

  e.attackTimer -= 1 / 60;
  if (e.attackTimer <= 0) {
    e.attackTimer = e.phase2 ? 1.0 : 1.8;
    // laser barrage + heat rays
    var n = e.phase2 ? 6 : 3;
    for (var i = 0; i < n; i++) {
      var ang = Math.atan2(p.y - e.y, p.x - e.x) + (i - (n - 1) / 2) * 0.16;
      game.projectiles.add({
        x: e.x, y: e.y, vx: Math.cos(ang) * 7.5, vy: Math.sin(ang) * 7.5,
        dmg: e.phase2 ? 36 : 28, type: P.LASER, owner: 'enemy', life: 3, dead: false
      });
    }
    AudioSys.play('laser');
  }
  // summon lihzahrd adds in phase 1
  if (!e.phase2 && e.attackTimer <= -2) {
    e.attackTimer = 6;
    for (var j = 0; j < 2; j++) spawnEntity(game, E.LIHZARD, e.x + (Math.random() * 100 - 50), e.y + 40);
    AudioSys.play('spawn');
  }
  // contact
  if (dist(e.x, e.y, p.x, p.y) < (e.w + p.w) / 2 - 2) {
    game.damagePlayer(e.dmg, e, p.x < e.x ? 9 : -9);
  }
}

// ---------------- Duke Fishron ----------------
function spawnDuke(game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  AudioSys.play('roar');
  return makeBoss(game, { boss:'duke', name:'Duke Fishron', w:64, h:46, hp:60000, dmg:100, def:50, color:'#5ac8ff', barColor:'#5ac8ff', x:p.x + 400, y:p.y - 180 });
}

function dukeStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  bossLeash(e, game);
  e.wave = (e.wave || 0) + 0.08;
  var speed = e.phase2 ? 13 : 8.5;
  e.attackTimer -= 1 / 60;
  if (e.attackTimer <= 0) {
    e.attackTimer = 1.6;
    e.charge = { x: p.x, y: p.y, t: 1.1 };
    AudioSys.play('spawn');
  }
  if (e.charge) {
    e.charge.t -= 1 / 60;
    var dx = e.charge.x - e.x, dy = e.charge.y - e.y;
    var d = Math.sqrt(dx * dx + dy * dy) || 1;
    e.x += (dx / d) * speed;
    e.y += (dy / d) * speed + Math.sin(e.wave * 2) * 2;
    if (e.charge.t <= 0) e.charge = null;
  } else {
    var dx2 = p.x - e.x, dy2 = p.y - e.y;
    var d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2) || 1;
    e.x += (dx2 / d2) * speed * 0.4;
    e.y += (dy2 / d2) * speed * 0.4;
  }
  // bubble + cthulhunado barrage
  if (e.attackTimer <= -0.8) {
    e.attackTimer = e.phase2 ? 0.7 : 1.2;
    var n = e.phase2 ? 6 : 3;
    for (var i = 0; i < n; i++) {
      var ang = Math.atan2(p.y - e.y, p.x - e.x) + (i - (n - 1) / 2) * 0.25;
      game.projectiles.add({
        x: e.x, y: e.y, vx: Math.cos(ang) * 5, vy: Math.sin(ang) * 5,
        dmg: 30, type: P.MAGICBOLT, owner: 'enemy', life: 4, dead: false
      });
    }
    AudioSys.play('magic');
  }
  // contact
  if (dist(e.x, e.y, p.x, p.y) < (e.w + p.w) / 2 - 2) {
    game.damagePlayer(e.dmg, e, p.x < e.x ? 10 : -10);
  }
}

// ---------------- Empress of Light ----------------
function spawnEmpress(game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  AudioSys.play('roar');
  return makeBoss(game, { boss:'empress', name:'Empress of Light', w:56, h:56, hp:70000, dmg:80, def:50, color:'#ffe9a8', barColor:'#ffe14d', x:p.x, y:p.y - 200 });
}

function empressStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  bossLeash(e, game);
  e.wave = (e.wave || 0) + 0.05;
  var speed = e.phase2 ? 9 : 6;
  var tx = p.x + Math.sin(e.wave * 1.4) * 100;
  var ty = p.y - 140 + Math.cos(e.wave * 2.1) * 60;
  var mdx = tx - e.x, mdy = ty - e.y;
  var d = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
  e.x += (mdx / d) * speed;
  e.y += (mdy / d) * speed;

  e.attackTimer -= 1 / 60;
  if (e.attackTimer <= 0) {
    e.attackTimer = e.phase2 ? 0.9 : 1.4;
    // radiant fan of blades
    var n = e.phase2 ? 12 : 6;
    for (var i = 0; i < n; i++) {
      var ang = Math.atan2(p.y - e.y, p.x - e.x) + (i - (n - 1) / 2) * 0.12;
      game.projectiles.add({
        x: e.x, y: e.y, vx: Math.cos(ang) * 6, vy: Math.sin(ang) * 6,
        dmg: e.phase2 ? 38 : 30, type: P.BLAZE, owner: 'enemy', life: 3.5, dead: false
      });
    }
    AudioSys.play('magic');
  }
  if (dist(e.x, e.y, p.x, p.y) < (e.w + p.w) / 2 - 2) {
    game.damagePlayer(e.dmg, e, p.x < e.x ? 8 : -8);
  }
}

// ---------------- Lunatic Cultist ----------------
function spawnCultist(game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  AudioSys.play('roar');
  return makeBoss(game, { boss:'cultist', name:'Lunatic Cultist', w:40, h:64, hp:32000, dmg:50, def:42, color:'#e0d8ff', barColor:'#c85cff', x:p.x + 200, y:p.y - 160 });
}

function cultistStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  bossLeash(e, game);
  e.attackTimer -= 1 / 60;
  // teleport around the player
  if (e.attackTimer <= 0) {
    e.attackTimer = 2.4;
    var ang = Math.random() * 6.28;
    var nx = p.x + Math.cos(ang) * (120 + Math.random() * 100);
    var ny = p.y + Math.sin(ang) * 80 - 100;
    game.fx.push({ type: 'teleport', x: e.x, y: e.y, t: 0.3, max: 0.3 });
    e.x = nx; e.y = ny;
    game.fx.push({ type: 'teleport', x: e.x, y: e.y, t: 0.3, max: 0.3 });
    AudioSys.play('magic');
  }
  // phantasm bolts
  if (e.attackTimer <= 1.4) {
    e.attackTimer = e.phase2 ? 0.8 : 1.4;
    var n = e.phase2 ? 8 : 4;
    for (var i = 0; i < n; i++) {
      var ta = Math.atan2(p.y - e.y, p.x - e.x) + (i - (n - 1) / 2) * 0.2;
      game.projectiles.add({
        x: e.x, y: e.y, vx: Math.cos(ta) * 5.5, vy: Math.sin(ta) * 5.5,
        dmg: 32, type: P.PHANTOMBOLT, owner: 'enemy', life: 3, dead: false
      });
    }
    AudioSys.play('spawn');
  }
  if (dist(e.x, e.y, p.x, p.y) < (e.w + p.w) / 2 - 2) {
    game.damagePlayer(e.dmg, e, p.x < e.x ? 7 : -7);
  }
}

// ---------------- Moon Lord ----------------
function spawnMoonLord(game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  AudioSys.play('roar');
  return makeBoss(game, { boss:'moonlord', name:'Moon Lord', w:120, h:120, hp:145000, dmg:50, def:50, color:'#8a9ad0', barColor:'#c85cff', x:p.x, y:p.y - 260 });
}

function moonLordStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  bossLeash(e, game);
  e.wave = (e.wave || 0) + 0.02;
  var speed = e.phase2 ? 3.5 : 2.4;
  var tx = p.x + Math.sin(e.wave * 1.2) * 120;
  var ty = p.y - 180 + Math.sin(e.wave * 1.8) * 40;
  var mdx = tx - e.x, mdy = ty - e.y;
  var d = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
  e.x += (mdx / d) * speed;
  e.y += (mdy / d) * speed;

  e.attackTimer -= 1 / 60;
  if (e.attackTimer <= 0) {
    e.attackTimer = e.phase2 ? 0.8 : 1.5;
    if (!e.phase2) {
      // eye death laser
      var la = Math.atan2(p.y - e.y, p.x - e.x);
      game.projectiles.add({
        x: e.x, y: e.y, vx: Math.cos(la) * 9, vy: Math.sin(la) * 9,
        dmg: 55, type: P.DEATHLASER, owner: 'enemy', life: 3.5, dead: false
      });
      // phantasmal spheres
      for (var i = -2; i <= 2; i++) {
        var sa = la + i * 0.2;
        game.projectiles.add({
          x: e.x, y: e.y, vx: Math.cos(sa) * 5, vy: Math.sin(sa) * 5,
          dmg: 35, type: P.PHANTOMBOLT, owner: 'enemy', life: 3, dead: false
        });
      }
      AudioSys.play('laser');
    } else {
      // core death ray: converging beam wall
      var n = 9;
      for (var j = 0; j < n; j++) {
        var ba = Math.atan2(p.y - e.y, p.x - e.x) + (j - (n - 1) / 2) * 0.1;
        game.projectiles.add({
          x: e.x, y: e.y, vx: Math.cos(ba) * 8, vy: Math.sin(ba) * 8,
          dmg: 45, type: P.DEATHLASER, owner: 'enemy', life: 2.5, dead: false
        });
      }
      AudioSys.play('roar');
    }
  }
  if (dist(e.x, e.y, p.x, p.y) < (e.w + p.w) / 2 - 2) {
    game.damagePlayer(e.dmg, e, p.x < e.x ? 10 : -10);
  }
}

// ---------------- Lunar Pillars ----------------
function spawnLunarPillar(game, type) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  var w = game.world;
  var themes = {
    solar: { name:'Solar Pillar', hp:20000, dmg:0, color:'#ff8a3d', barColor:'#ff8a3d', frag:I.FRAG_SOLAR, enemies:[E.CORITE,E.SELENIAN,E.CRAWLTIPEDE] },
    vortex: { name:'Vortex Pillar', hp:20000, dmg:0, color:'#3dff9d', barColor:'#3dff9d', frag:I.FRAG_VORTEX, enemies:[E.VORTEXIAN,E.STORMDIVER,E.ALIENQUEEN,E.ALIENHORNET] },
    nebula: { name:'Nebula Pillar', hp:20000, dmg:0, color:'#c85cff', barColor:'#c85cff', frag:I.FRAG_NEBULA, enemies:[E.NEBULAFLOATER,E.PREDICTOR,E.EVOLUTIONBEAST] },
    stardust: { name:'Stardust Pillar', hp:20000, dmg:0, color:'#6bc8ff', barColor:'#6bc8ff', frag:I.FRAG_STARDUST, enemies:[E.STARDJUSTCELL,E.STARGAZER,E.FLOWINVADER] }
  };
  var th = themes[type] || themes.solar;
  AudioSys.play('roar');
  var e = makeBoss(game, { boss:'lunar', sub:type, name:th.name, w:56, h:160, hp:th.hp, dmg:th.dmg, def:20, color:th.color, barColor:th.barColor, x:p.x, y:p.y });
  e.shieldHp = 15000; e.shieldMax = 15000; e.shieldDown = false;
  e.pillarType = type; e.pillarFrag = th.frag; e.pillarEnemies = th.enemies; e.pillarEnemy = th.enemies[0];
  e.spawnT = 0; e.shootT = 0;
  if (!game.lunarPillars) game.lunarPillars = [];
  game.lunarPillars.push(e);
  game.message('The ' + th.name + ' has awoken!');
  return e;
}

function lunarPillarStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  // hover in place with a slow bob
  e.bob = (e.bob || 0) + 0.03;
  e.anchorY = (e.anchorY === undefined) ? e.y : e.anchorY;
  e.x = lerp(e.x, p.x, 0.001);
  e.y = e.anchorY + Math.sin(e.bob) * 10;

  if (!e.shieldDown) {
    // spawn themed guardians while the shield holds
    e.spawnT -= 1 / 60;
    if (e.spawnT <= 0) {
      e.spawnT = 2.6;
      var nearCount = 0;
      for (var i = 0; i < game.entities.length; i++) {
        var q = game.entities[i];
        if (!q.dead && q.dmg > 0 && e.pillarEnemies.indexOf(q.type) >= 0 && dist(q.x, q.y, e.x, e.y) < 6 * TILE) nearCount++;
      }
      if (nearCount < 4) {
        var ang = Math.random() * 6.28;
        var ex = clamp(e.x + Math.cos(ang) * (90 + Math.random() * 80), 32, game.world.W * TILE - 32);
        var ey = clamp(e.y + Math.sin(ang) * 60 - 40 + Math.random() * 80, 16, game.world.H * TILE - 16);
        var guardType = e.pillarEnemies[Math.floor(Math.random() * e.pillarEnemies.length)];
        var guard = spawnEntity(game, guardType, ex, ey);
        if (guardType === E.CRAWLTIPEDE) initSegments(guard, game, 8, '#d85b2f');
        guard.eventEnemy = true;
      }
    }
    return;
  }

  // shield down: the pillar itself attacks
  e.shootT -= 1 / 60;
  if (e.shootT <= 0) {
    e.shootT = 1.6;
    var ptype = P.CORITEBOLT;
    if (e.pillarType === 'solar') ptype = P.CURSEDFLAME;
    else if (e.pillarType === 'vortex') ptype = P.LASER;
    else if (e.pillarType === 'nebula') ptype = P.PHANTOMBOLT;
    else ptype = P.MAGICBOLT;
    var n = 3;
    var base = Math.atan2(p.y - e.y, p.x - e.x);
    for (var j = 0; j < n; j++) {
      var a = base + (j - (n - 1) / 2) * 0.25;
      game.projectiles.add({
        x: e.x, y: e.y, vx: Math.cos(a) * 7, vy: Math.sin(a) * 7,
        dmg: 40, type: ptype, owner: 'enemy', life: 3.5, dead: false,
        color: e.color
      });
    }
    AudioSys.play('magic');
  }
  if (dist(e.x, e.y, p.x, p.y) < (e.w + p.w) / 2 - 4) {
    game.damagePlayer(e.dmg, e, p.x < e.x ? 8 : -8);
  }
}

// ---------- Event bosses (Pumpkin/Frost Moon + Martian Madness) ----------
function eventBossSpray(e, game, type, dmg, n, spread) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  var ang = Math.atan2(p.y - e.y, p.x - e.x);
  for (var i = 0; i < n; i++) {
    var a = ang + (i - (n - 1) / 2) * (spread || 0.18);
    game.projectiles.add({
      x: e.x, y: e.y, vx: Math.cos(a) * 7, vy: Math.sin(a) * 7,
      dmg: dmg, type: type, owner: 'enemy', life: 3.5, dead: false
    });
  }
  AudioSys.play('magic');
}

function spawnMourningWood(game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  AudioSys.play('roar');
  return makeBoss(game, { boss:'mourningwood', name:'Mourning Wood', w:56, h:56, hp:14000, dmg:120, def:34, color:'#7a4d3d', barColor:'#ff9a3d', x:p.x + 300, y:p.y - 160 });
}

function mourningWoodStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  bossLeash(e, game);
  e.wave = (e.wave || 0) + 0.05;
  var speed = e.phase2 ? 5 : 3.4;
  var tx = p.x + Math.sin(e.wave * 1.3) * 80;
  var ty = p.y - 120 + Math.cos(e.wave * 2) * 40;
  var mdx = tx - e.x, mdy = ty - e.y;
  var d = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
  e.x += (mdx / d) * speed;
  e.y += (mdy / d) * speed;
  e.attackTimer -= 1 / 60;
  if (e.attackTimer <= 0) {
    e.attackTimer = e.phase2 ? 0.9 : 1.6;
    eventBossSpray(e, game, P.CURSEDFLAME, e.phase2 ? 38 : 30, e.phase2 ? 7 : 4, 0.2);
  }
  if (dist(e.x, e.y, p.x, p.y) < (e.w + p.w) / 2 - 2) {
    game.damagePlayer(e.dmg, e, p.x < e.x ? 8 : -8);
  }
}

function spawnPumpking(game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  AudioSys.play('roar');
  return makeBoss(game, { boss:'pumpking', name:'Pumpking', w:60, h:60, hp:26000, dmg:50, def:40, color:'#ff8a3d', barColor:'#ff8a3d', x:p.x, y:p.y - 220 });
}

function pumpkingStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  bossLeash(e, game);
  e.wave = (e.wave || 0) + 0.06;
  var speed = e.phase2 ? 6 : 4.5;
  var tx = p.x + Math.sin(e.wave * 1.1) * 120;
  var ty = p.y - 170 + Math.cos(e.wave * 1.7) * 50;
  var mdx = tx - e.x, mdy = ty - e.y;
  var d = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
  e.x += (mdx / d) * speed;
  e.y += (mdy / d) * speed;
  e.attackTimer -= 1 / 60;
  if (e.attackTimer <= 0) {
    e.attackTimer = e.phase2 ? 0.8 : 1.2;
    eventBossSpray(e, game, P.FIREBALL, e.phase2 ? 44 : 34, e.phase2 ? 10 : 6, 0.15);
    if (e.phase2) eventBossSpray(e, game, P.PHANTOMBOLT, 26, 4, 0.4);
  }
  if (dist(e.x, e.y, p.x, p.y) < (e.w + p.w) / 2 - 2) {
    game.damagePlayer(e.dmg, e, p.x < e.x ? 10 : -10);
  }
}

function spawnEverscream(game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  AudioSys.play('roar');
  return makeBoss(game, { boss:'everscream', name:'Everscream', w:56, h:56, hp:13000, dmg:110, def:38, color:'#8ac84a', barColor:'#8ac84a', x:p.x + 300, y:p.y - 160 });
}

function spawnSantank(game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  AudioSys.play('roar');
  return makeBoss(game, { boss:'santank', name:'Santa-NK1', w:52, h:56, hp:18000, dmg:120, def:56, color:'#d04040', barColor:'#d04040', x:p.x + 260, y:p.y - 140 });
}

function santankStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  bossLeash(e, game);
  e.wave = (e.wave || 0) + 0.05;
  var speed = e.phase2 ? 5.4 : 3.6;
  var tx = p.x + Math.sin(e.wave * 1.4) * 90;
  var ty = p.y - 130 + Math.cos(e.wave * 2.2) * 40;
  var mdx = tx - e.x, mdy = ty - e.y;
  var d = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
  e.x += (mdx / d) * speed;
  e.y += (mdy / d) * speed;
  e.attackTimer -= 1 / 60;
  if (e.attackTimer <= 0) {
    e.attackTimer = e.phase2 ? 0.7 : 1.4;
    eventBossSpray(e, game, P.ROCKET, e.phase2 ? 40 : 30, e.phase2 ? 6 : 3, 0.25);
  }
  if (dist(e.x, e.y, p.x, p.y) < (e.w + p.w) / 2 - 2) {
    game.damagePlayer(e.dmg, e, p.x < e.x ? 9 : -9);
  }
}

function spawnIceQueen(game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  AudioSys.play('roar');
  return makeBoss(game, { boss:'icequeen', name:'Ice Queen', w:58, h:58, hp:34000, dmg:120, def:38, color:'#a8d8f0', barColor:'#a8d8f0', x:p.x, y:p.y - 220 });
}

function iceQueenStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  bossLeash(e, game);
  e.wave = (e.wave || 0) + 0.06;
  var speed = e.phase2 ? 7 : 5;
  var tx = p.x + Math.sin(e.wave * 1.2) * 130;
  var ty = p.y - 180 + Math.cos(e.wave * 1.8) * 60;
  var mdx = tx - e.x, mdy = ty - e.y;
  var d = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
  e.x += (mdx / d) * speed;
  e.y += (mdy / d) * speed;
  e.attackTimer -= 1 / 60;
  if (e.attackTimer <= 0) {
    e.attackTimer = e.phase2 ? 0.8 : 1.1;
    eventBossSpray(e, game, P.FROSTBOLT, e.phase2 ? 42 : 32, e.phase2 ? 9 : 5, 0.16);
    if (e.phase2) eventBossSpray(e, game, P.DART, 30, 4, 0.3);
  }
  if (dist(e.x, e.y, p.x, p.y) < (e.w + p.w) / 2 - 2) {
    game.damagePlayer(e.dmg, e, p.x < e.x ? 10 : -10);
  }
}

function spawnMartianSaucer(game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  AudioSys.play('roar');
  return makeBoss(game, { boss:'martiansaucer', name:'Martian Saucer', w:80, h:48, hp:40000, dmg:70, def:26, color:'#3dff9d', barColor:'#3dff9d', x:p.x, y:p.y - 260 });
}

function martianSaucerStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  bossLeash(e, game);
  e.wave = (e.wave || 0) + 0.04;
  var speed = e.phase2 ? 4.5 : 2.8;
  var tx = p.x + Math.sin(e.wave * 0.9) * 150;
  var ty = p.y - 220 + Math.cos(e.wave * 1.5) * 40;
  var mdx = tx - e.x, mdy = ty - e.y;
  var d = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
  e.x += (mdx / d) * speed;
  e.y += (mdy / d) * speed;
  e.attackTimer -= 1 / 60;
  if (e.attackTimer <= 0) {
    e.attackTimer = e.phase2 ? 0.9 : 1.6;
    eventBossSpray(e, game, P.PLASMA, e.phase2 ? 42 : 34, e.phase2 ? 6 : 4, 0.2);
    if (e.phase2) eventBossSpray(e, game, P.LASER, 30, 6, 0.12);
  }
  if (dist(e.x, e.y, p.x, p.y) < (e.w + p.w) / 2 - 2) {
    game.damagePlayer(e.dmg, e, p.x < e.x ? 8 : -8);
  }
}

// Goblin Warlock - Goblin Army mini-boss. Cursed bolt caster, summons goblins.
function spawnGoblinWarlock(game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  AudioSys.play('roar');
  return makeBoss(game, { boss:'goblinwarlock', name:'Goblin Warlock', w:36, h:48, hp:6500, dmg:40, def:14, color:'#7a4d3d', barColor:'#c85cff', x:p.x + 220, y:p.y - 200 });
}

function goblinWarlockStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  bossLeash(e, game);
  e.wave = (e.wave || 0) + 0.05;
  var tx = p.x + Math.sin(e.wave * 1.4) * 100;
  var ty = p.y - 130 + Math.cos(e.wave * 2) * 40;
  var mdx = tx - e.x, mdy = ty - e.y;
  var d = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
  e.x += (mdx / d) * 3.4;
  e.y += (mdy / d) * 3.4;
  e.attackTimer -= 1 / 60;
  if (e.attackTimer <= 0) {
    e.attackTimer = e.phase2 ? 1.2 : 2.0;
    var ang = Math.atan2(p.y - e.y, p.x - e.x);
    for (var i = 0; i < (e.phase2 ? 4 : 2); i++) {
      game.projectiles.add({
        x: e.x, y: e.y, vx: Math.cos(ang + (i - (e.phase2 ? 3 : 1) / 2) * 0.18) * 6.5,
        vy: Math.sin(ang + (i - (e.phase2 ? 3 : 1) / 2) * 0.18) * 6.5,
        dmg: e.phase2 ? 34 : 26, type: P.MAGICBOLT, owner: 'enemy', life: 3, dead: false,
        color: '#c85cff'
      });
    }
    AudioSys.play('magic');
  }
  if (e.phase2 && Math.random() < 0.01) {
    var g = spawnEntity(game, E.GOBLINTHIEF, e.x + (Math.random() * 80 - 40), e.y + 30);
    g.eventEnemy = true;
  }
  if (dist(e.x, e.y, p.x, p.y) < (e.w + p.w) / 2 - 2) {
    game.damagePlayer(e.dmg, e, p.x < e.x ? 8 : -8);
  }
}

// Pirate Captain - Pirate Invasion mini-boss. Fireball cannon + flying deckhands.
function spawnPirateCaptain(game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  AudioSys.play('roar');
  return makeBoss(game, { boss:'piratecaptain', name:'Pirate Captain', w:44, h:52, hp:8500, dmg:46, def:16, color:'#3d4d5c', barColor:'#ffb84d', x:p.x + 240, y:p.y - 220 });
}

function pirateCaptainStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  bossLeash(e, game);
  e.wave = (e.wave || 0) + 0.06;
  var tx = p.x + Math.sin(e.wave * 1.2) * 120;
  var ty = p.y - 140 + Math.cos(e.wave * 1.8) * 50;
  var mdx = tx - e.x, mdy = ty - e.y;
  var d = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
  e.x += (mdx / d) * 3.8;
  e.y += (mdy / d) * 3.8;
  e.attackTimer -= 1 / 60;
  if (e.attackTimer <= 0) {
    e.attackTimer = e.phase2 ? 1.1 : 1.8;
    var ang = Math.atan2(p.y - e.y, p.x - e.x);
    for (var i = 0; i < (e.phase2 ? 3 : 1); i++) {
      game.projectiles.add({
        x: e.x, y: e.y, vx: Math.cos(ang + (i - 1) * 0.22) * 7,
        vy: Math.sin(ang + (i - 1) * 0.22) * 7,
        dmg: e.phase2 ? 40 : 30, type: P.FIREBALL, owner: 'enemy', life: 3, dead: false,
        color: '#ffb84d'
      });
    }
    AudioSys.play('magic');
  }
  if (e.phase2 && Math.random() < 0.008) {
    var ps = spawnEntity(game, E.PARROT, e.x + (Math.random() * 80 - 40), e.y + 20);
    ps.eventEnemy = true;
  }
  if (dist(e.x, e.y, p.x, p.y) < (e.w + p.w) / 2 - 2) {
    game.damagePlayer(e.dmg, e, p.x < e.x ? 8 : -8);
  }
}

// Flying Dutchman - final Pirate Invasion ship. Bombards the player and deploys pirates.
function spawnFlyingDutchman(game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  AudioSys.play('roar');
  return makeBoss(game, { boss:'flyingdutchman', name:'Flying Dutchman', w:104, h:58, hp:18000, dmg:62, def:24, color:'#6a4a32', barColor:'#d8b878', x:p.x + 320, y:p.y - 260 });
}

function flyingDutchmanStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  bossLeash(e, game);
  e.wave = (e.wave || 0) + 0.025;
  var tx = p.x + Math.sin(e.wave) * 240;
  var ty = p.y - 230 + Math.cos(e.wave * 1.7) * 45;
  var dx = tx - e.x, dy = ty - e.y;
  var d = Math.sqrt(dx * dx + dy * dy) || 1;
  e.x += dx / d * (e.phase2 ? 3.2 : 2.3);
  e.y += dy / d * (e.phase2 ? 3.2 : 2.3);
  e.dir = p.x >= e.x ? 1 : -1;
  e.attackTimer -= 1 / 60;
  if (e.attackTimer <= 0) {
    e.attackTimer = e.phase2 ? 0.8 : 1.35;
    var ang = Math.atan2(p.y - e.y, p.x - e.x);
    for (var i = -1; i <= 1; i++) {
      game.projectiles.add({
        x:e.x + i * 28, y:e.y + 14, vx:Math.cos(ang + i * 0.16) * 5.2,
        vy:Math.sin(ang + i * 0.16) * 5.2, dmg:e.phase2 ? 44 : 34,
        type:P.FIREBALL, owner:'enemy', life:4, dead:false
      });
    }
    AudioSys.play('magic');
  }
  e.summonTimer = (e.summonTimer || 2.5) - 1 / 60;
  if (e.summonTimer <= 0) {
    e.summonTimer = e.phase2 ? 3.5 : 5.5;
    var type = Math.random() < 0.5 ? E.PIRATECORSAIR : E.PIRATESHARK;
    var pirate = spawnEntity(game, type, e.x + (Math.random() * 80 - 40), e.y + 24);
    pirate.eventEnemy = true;
  }
  if (dist(e.x, e.y, p.x, p.y) < 54) game.damagePlayer(e.dmg, e, p.x < e.x ? 10 : -10);
}

// Mothron - Solar Eclipse mini-boss. Dives at the player, spawns babies in phase 2.
function spawnMothron(game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  AudioSys.play('roar');
  return makeBoss(game, { boss:'mothron', name:'Mothron', w:40, h:26, hp:6000, dmg:80, def:30, color:'#8a8ab8', barColor:'#c8a8ff', x:p.x + 260, y:p.y - 200 });
}

function mothronStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  bossLeash(e, game);
  e.attackTimer -= 1 / 60;
  e.dir = p.x >= e.x ? 1 : -1;
  if (e.attackTimer <= 0) {
    e.attackTimer = e.phase2 ? 1.0 : 1.8;
    // swoop toward the player
    var ang = Math.atan2(p.y - e.y, p.x - e.x);
    e.vx = Math.cos(ang) * (e.phase2 ? 8 : 6);
    e.vy = Math.sin(ang) * (e.phase2 ? 8 : 6);
    AudioSys.play('spawn');
  }
  e.x += e.vx; e.y += e.vy;
  e.vx *= 0.97; e.vy *= 0.97;
  if (e.phase2 && Math.random() < 0.006) {
    var baby = spawnEntity(game, E.BABYMOTHRON, e.x + (Math.random() * 40 - 20), e.y + 20);
    baby.eventEnemy = true;
  }
  if (dist(e.x, e.y, p.x, p.y) < (e.w + p.w) / 2 - 2) {
    game.damagePlayer(e.dmg, e, p.x < e.x ? 8 : -8);
  }
}

// Deerclops - an early Snow boss with ice spikes, falling debris, and shadow hands.
function spawnDeerclops(game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  AudioSys.play('roar');
  return makeBoss(game, { boss:'deerclops', name:'Deerclops', w:70, h:78, hp:7000, dmg:20, def:10, color:'#5a4638', barColor:'#9ed8f0', x:p.x + 260, y:p.y - 180 });
}

function deerclopsStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  bossLeash(e, game);
  e.dir = p.x >= e.x ? 1 : -1;
  e.vx = lerp(e.vx, e.dir * (e.phase2 ? 2.5 : 1.8), 0.05);
  e.timer -= 1 / 60;
  if (e.onGround && e.timer <= 0) {
    e.vy = e.phase2 ? -9 : -7;
    e.timer = e.phase2 ? 1.4 : 2.0;
  }
  physicsStep(e, game, { gravity:0.85 });

  e.attackTimer -= 1 / 60;
  if (e.attackTimer <= 0) {
    e.attackTimer = e.phase2 ? 1.15 : 1.75;
    e.attackIndex = ((e.attackIndex || 0) + 1) % 3;
    if (e.attackIndex === 0) {
      for (var i = -2; i <= 2; i++) aimProj(game, e.x, e.y + 22, p.x, p.y, 5.2, P.FROSTBOLT, e.phase2 ? 36 : 28, i * 0.14);
    } else if (e.attackIndex === 1) {
      for (var j = -2; j <= 2; j++) {
        game.projectiles.add({ x:p.x + j * 44, y:p.y - 210 - Math.abs(j) * 12, vx:j * 0.25, vy:5.2, dmg:e.phase2 ? 38 : 30, type:P.FROSTBOLT, owner:'enemy', life:4, dead:false });
      }
    } else {
      for (var k = -1; k <= 1; k += 2) {
        aimProj(game, p.x + k * 220, p.y - 30, p.x, p.y - 10, 5.8, P.PHANTOMBOLT, e.phase2 ? 40 : 32, 0);
      }
    }
    AudioSys.play('magic');
  }
  if (dist(e.x, e.y, p.x, p.y) < (e.w + p.w) / 2 - 4) game.damagePlayer(e.dmg, e, p.x < e.x ? 8 : -8);
}

// ---------- Pre-hardmode bosses ----------

// King Slime - hops around, spawns slimes, phase 2 teleport
function spawnKingSlime(game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  AudioSys.play('roar');
  return makeBoss(game, { boss:'kingslime', name:'King Slime', w:52, h:40, hp:2000, dmg:40, def:10, color:'#5cbf6c', barColor:'#3dbf6c', x:p.x + 200, y:p.y - 240 });
}

function kingSlimeStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  bossLeash(e, game);
  var speed = e.phase2 ? 5.0 : 3.5;
  e.timer -= 1 / 60;
  if (e.phase2 && e.timer <= -6) {
    // teleport hop
    e.x = p.x + (Math.random() * 500 - 250);
    e.y = p.y - 260;
    e.timer = 3;
    AudioSys.play('spawn');
  }
  var mdx = p.x - e.x, mdy = p.y - e.y;
  var d = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
  if (Math.random() < 0.02) {
    e.vy = -speed * 0.9;
    e.vx = (mdx / d) * speed * 0.6;
  }
  e.x += e.vx || 0; e.y += e.vy || 0;
  if (e.vy > 0 && (e.y > p.y || e.onGround)) { e.vx = 0; e.vy = 0; e.onGround = true; }
  if (!e.onGround) e.vy += 0.3;
  // spawn slimes periodically
  if (Math.random() < 0.008) {
    spawnEntity(game, E.SLIME, e.x + (Math.random() * 40 - 20), e.y + 10);
  }
  if (dist(e.x, e.y, p.x, p.y) < (e.w + p.w) / 2 - 2) {
    game.damagePlayer(e.dmg, e, p.x < e.x ? 7 : -7);
  }
}

// Eye of Cthulhu - fly toward player, phase 2 dash, charge at distance
function spawnEyeOfCthulhu(game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  AudioSys.play('roar');
  return makeBoss(game, { boss:'eyeofcthulhu', name:'Eye of Cthulhu', w:40, h:40, hp:2800, dmg:15, def:12, color:'#c04040', barColor:'#d04040', x:p.x + 350, y:p.y - 200 });
}

function eyeStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  bossLeash(e, game);
  var speed = e.phase2 ? 5.5 : 4.0;
  var ang = Math.atan2(p.y - e.y, p.x - e.x);
  e.attackTimer -= 1 / 60;
  if (e.phase2 && e.attackTimer <= -3.5) {
    e.charge = 1.2;
    e.attackTimer = 1.0;
    e.chargeAng = ang;
  }
  if (e.charge > 0) {
    e.charge -= 1 / 60;
    e.x += Math.cos(e.chargeAng) * 13;
    e.y += Math.sin(e.chargeAng) * 13;
  } else {
    var tx = p.x + Math.cos(ang) * 140;
    var ty = p.y + Math.sin(ang) * 140 - 60;
    var mdx = tx - e.x, mdy = ty - e.y;
    var d = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
    e.x += (mdx / d) * speed;
    e.y += (mdy / d) * speed;
  }
  // spawn servants of cthulhu occasionally
  if (Math.random() < 0.004) {
    spawnEntity(game, E.SLIME, e.x + (Math.random() * 30 - 15), e.y + 10);
  }
  if (dist(e.x, e.y, p.x, p.y) < (e.w + p.w) / 2 - 2) {
    game.damagePlayer(e.dmg, e, p.x < e.x ? 6 : -6);
  }
}

// Eater of Worlds - segmented worm like Destroyer but weaker
function spawnEaterOfWorlds(game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  AudioSys.play('roar');
  var segCount = 20, segHp = 150, headHp = 1500;
  var e = makeBoss(game, { boss:'eaterofworlds', name:'Eater of Worlds', w:30, h:24, hp:headHp + segCount * segHp, maxHp:headHp + segCount * segHp, dmg:22, def:2, color:'#5a4d7a', barColor:'#7a5c9a', x:p.x + 300, y:p.y - 220 });
  e.headHp = headHp; e.segHp = segHp; e.segCount = segCount;
  e.wave = 0;
  e.segments = [];
  var x = e.x, y = e.y;
  for (var i = 0; i < segCount; i++) {
    e.segments.push({ x: x - 13 * (i + 1), y: y, w: e.w * 0.8, h: e.h * 0.8, hp: segHp, dead: false, idx: i, color: '#4a3d6a' });
  }
  return e;
}

function eaterWorldsStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  bossLeash(e, game);
  var speed = e.phase2 ? 5.5 : 4.2;
  var ang = Math.atan2(p.y - e.y, p.x - e.x);
  // wavy approach
  var perp = Math.sin(e.age * 6) * 1.4;
  var tx = p.x + Math.cos(perp) * 60;
  var ty = p.y + Math.sin(perp) * 60 - 80;
  var mdx = tx - e.x, mdy = ty - e.y;
  var d = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
  e.vx = (mdx / d) * speed; e.vy = (mdy / d) * speed;
  e.x += e.vx; e.y += e.vy;
  var headAng = Math.atan2(e.vy, e.vx);
  e.segAng = headAng;
  moveSegments(e, game);
  if (dist(e.x, e.y, p.x, p.y) < (e.w + p.w) / 2 - 2) {
    game.damagePlayer(e.dmg, e, p.x < e.x ? 6 : -6);
  }
}

function moveSegments(e, game) {
  var px = e.x, py = e.y;
  var segGap = 16;
  for (var i = 0; i < e.segments.length; i++) {
    var s = e.segments[i];
    if (s.dead) continue;
    var dx = px - s.x, dy = py - s.y;
    var d = Math.sqrt(dx * dx + dy * dy) || 1;
    if (d > segGap) {
      s.x += (dx / d) * (d - segGap);
      s.y += (dy / d) * (d - segGap);
    }
    s.x += (Math.random() - 0.5) * 1.2;
    s.y += (Math.random() - 0.5) * 1.2;
    px = s.x; py = s.y;
  }
}

// Brain of Cthulhu - bounces, phase 2 spawns creepers
function spawnBrainOfCthulhu(game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  AudioSys.play('roar');
  return makeBoss(game, { boss:'brainofcthulhu', name:'Brain of Cthulhu', w:44, h:44, hp:1250, dmg:30, def:14, color:'#c04848', barColor:'#e04848', x:p.x + 250, y:p.y - 240 });
}

function brainStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  bossLeash(e, game);
  var speed = e.phase2 ? 5.0 : 3.6;
  e.wave = (e.wave || 0) + 0.05;
  var tx = p.x + Math.sin(e.wave * 1.3) * 160;
  var ty = p.y - 180 + Math.cos(e.wave * 1.1) * 60;
  var mdx = tx - e.x, mdy = ty - e.y;
  var d = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
  e.x += (mdx / d) * speed;
  e.y += (mdy / d) * speed;
  if (!e.phase2 && e.hp <= e.maxHp * 0.5) e.phase2 = true;
  if (dist(e.x, e.y, p.x, p.y) < (e.w + p.w) / 2 - 2) {
    game.damagePlayer(e.dmg, e, p.x < e.x ? 6 : -6);
  }
}

// Queen Bee - flies, shoots stingers and bees
function spawnQueenBee(game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  AudioSys.play('roar');
  return makeBoss(game, { boss:'queenbee', name:'Queen Bee', w:46, h:42, hp:3400, dmg:30, def:8, color:'#ffd75e', barColor:'#ffc040', x:p.x + 280, y:p.y - 220 });
}

function queenBeeStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  bossLeash(e, game);
  var speed = e.phase2 ? 5.5 : 4.2;
  e.wave = (e.wave || 0) + 0.06;
  var tx = p.x + Math.sin(e.wave * 1.2) * 170;
  var ty = p.y - 200 + Math.cos(e.wave * 1.4) * 50;
  var mdx = tx - e.x, mdy = ty - e.y;
  var d = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
  e.x += (mdx / d) * speed;
  e.y += (mdy / d) * speed;
  e.attackTimer -= 1 / 60;
  if (e.attackTimer <= 0) {
    e.attackTimer = e.phase2 ? 1.4 : 2.0;
    aimProj(game, e.x, e.y, p.x, p.y, 6, P.STINGER, e.phase2 ? 22 : 16, 0.06);
    if (e.phase2 && Math.random() < 0.5) aimProj(game, e.x, e.y, p.x, p.y, 5, P.STINGER, 16, 0.15);
  }
  if (dist(e.x, e.y, p.x, p.y) < (e.w + p.w) / 2 - 2) {
    game.damagePlayer(e.dmg, e, p.x < e.x ? 6 : -6);
  }
}

// Skeletron - spooky hands, dashes at player
function spawnSkeletron(game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  AudioSys.play('roar');
  var e = makeBoss(game, { boss:'skeletron', name:'Skeletron', w:46, h:54, hp:4400, dmg:32, def:10, color:'#d8c8a8', barColor:'#c8b090', x:p.x + 260, y:p.y - 220 });
  e.armCount = 2;
  var handL = { boss:'skeletron', armType:'hand', parent:e, x:e.x - 60, y:e.y + 40, w:26, h:26, hp:600, maxHp:600, dmg:20, def:14, flash:0, dead:false, side:'left' };
  var handR = { boss:'skeletron', armType:'hand', parent:e, x:e.x + 60, y:e.y + 40, w:26, h:26, hp:600, maxHp:600, dmg:20, def:14, flash:0, dead:false, side:'right' };
  e.arms = [handL, handR];
  game.entities.push(handL);
  game.entities.push(handR);
  return e;
}

function skeletronStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  bossLeash(e, game);
  var speed = e.phase2 ? 5.0 : 3.8;
  var ang = Math.atan2(p.y - e.y, p.x - e.x);
  e.attackTimer -= 1 / 60;
  if (e.attackTimer <= -4) {
    e.charge = 1.0;
    e.attackTimer = 1.2;
    e.chargeAng = ang;
  }
  if (e.charge > 0) {
    e.charge -= 1 / 60;
    e.x += Math.cos(e.chargeAng) * 12;
    e.y += Math.sin(e.chargeAng) * 12;
  } else {
    var tx = p.x + Math.cos(ang) * 160;
    var ty = p.y + Math.sin(ang) * 160 - 90;
    var mdx = tx - e.x, mdy = ty - e.y;
    var d = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
    e.x += (mdx / d) * speed;
    e.y += (mdy / d) * speed;
  }
  // hands chase player
  for (var i = 0; i < e.arms.length; i++) {
    var h = e.arms[i];
    if (h.dead) continue;
    var handAng = Math.atan2(p.y - h.y, p.x - h.x);
    var hx = e.x + Math.cos(handAng) * 55;
    var hy = e.y + Math.sin(handAng) * 55;
    var hmdx = hx - h.x, hmdy = hy - h.y;
    var hd = Math.sqrt(hmdx * hmdx + hmdy * hmdy) || 1;
    h.x += (hmdx / hd) * (e.phase2 ? 6 : 4.5);
    h.y += (hmdy / hd) * (e.phase2 ? 6 : 4.5);
    if (dist(h.x, h.y, p.x, p.y) < (h.w + p.w) / 2 - 2) {
      game.damagePlayer(e.dmg * 0.8, e, p.x < h.x ? 6 : -6);
    }
  }
  if (dist(e.x, e.y, p.x, p.y) < (e.w + p.w) / 2 - 2) {
    game.damagePlayer(e.dmg, e, p.x < e.x ? 6 : -6);
  }
}

// Wall of Flesh - huge wall that chases, fires lasers, spawns hungries
function spawnWallOfFlesh(game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  AudioSys.play('roar');
  var e = makeBoss(game, { boss:'wallofflesh', name:'Wall of Flesh', w:120, h:90, hp:8000, dmg:30, def:12, color:'#c04848', barColor:'#e04848', x:p.x - 700, y:p.y - 40 });
  e.moveDir = 1;
  e.hungries = [];
  return e;
}

function wallOfFleshStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  bossLeash(e, game);
  // wall always moves right toward the player
  e.x += e.moveDir * (e.phase2 ? 1.6 : 1.1);
  e.y = lerp(e.y, p.y - 40, 0.01);
  e.attackTimer -= 1 / 60;
  if (e.attackTimer <= 0) {
    e.attackTimer = e.phase2 ? 1.0 : 1.6;
    aimProj(game, e.x + 40, e.y - 20, p.x, p.y, 7, P.LASER, e.phase2 ? 36 : 26, 0);
    aimProj(game, e.x + 40, e.y + 20, p.x, p.y, 7, P.LASER, e.phase2 ? 36 : 26, 0);
    AudioSys.play('laser');
  }
  if (dist(e.x, e.y, p.x, p.y) < (e.w + p.w) / 2 - 4) {
    game.damagePlayer(e.dmg, e, 8);
  }
}

// ---------- Boss damage entry point ----------
function bossHit(e, dmg, kbx, kby, game) {
  if (e.dead) return;
  if (e.boss === 'lunar') {
    // Pillars are invulnerable until their shield is broken by kills.
    if (e.shieldHp > 0) return;
    var pReduced = Math.max(1, Math.round(dmg - Math.max(0, e.defV - (e.statusDefensePenalty || 0)) * 0.5));
    e.hp -= pReduced;
    e.flash = 0.08;
    e.kbVx = (e.kbVx || 0) + kbx;
    e.kbVy = (e.kbVy || 0) + kby;
    AudioSys.play('hit');
    if (e.hp <= 0) killBoss(e, game);
    return;
  }
  if (e.boss === 'destroyer' || e.boss === 'eaterofworlds') {
    // entity e is head; segments handled separately via segmentHit
    var reduced = Math.max(1, Math.round(dmg - Math.max(0, e.defV - (e.statusDefensePenalty || 0)) * 0.5));
    e.headHp -= reduced;
    e.hp = e.headHp + remainingSegHp(e);
    e.flash = 0.08;
    e.kbVx = (e.kbVx || 0) + kbx;
    e.kbVy = (e.kbVy || 0) + kby;
    if (e.headHp <= 0) killBoss(e, game);
    else AudioSys.play('hit');
    return;
  }
  var defNow = (e.boss === 'skelprime' && e.armCount <= 0) ? 0 : Math.max(0, (e.defV || e.def || 0) - (e.statusDefensePenalty || 0));
  var reduced2 = Math.max(1, Math.round(dmg - defNow * 0.5));
  e.hp -= reduced2;
  e.flash = 0.08;
  e.kbVx = (e.kbVx || 0) + kbx;
  e.kbVy = (e.kbVy || 0) + kby;
  AudioSys.play('hit');
  if (e.hp <= 0) killBoss(e, game);
}

function segmentHit(e, s, dmg, game) {
  if (s.dead || e.dead) return;
  if (typeof Net !== 'undefined' && Net.claimHit(e, dmg, true)) { s.flash = 0.08; return; }
  var reduced = Math.max(1, Math.round(dmg - Math.max(0, e.defV - (e.statusDefensePenalty || 0)) * 0.5));
  s.hp -= reduced;
  s.flash = 0.08;
  if (s.hp <= 0) {
    s.dead = true;
    e.hp = e.headHp + remainingSegHp(e);
  }
}

function remainingSegHp(e) {
  var total = 0;
  for (var i = 0; i < e.segments.length; i++) if (!e.segments[i].dead) total += e.segments[i].hp;
  return total;
}

function armHit(e, arm, dmg, game) {
  if (arm.dead) return;
  var reduced = Math.max(1, Math.round(dmg - arm.def * 0.5));
  arm.hp -= reduced;
  arm.flash = 0.08;
  AudioSys.play('hit');
  if (arm.hp <= 0) {
    arm.dead = true;
    e.armCount--;
    if (e.boss === 'skelprime') game.message('Skeletron Prime has lost a limb!');
    else if (e.boss === 'skeletron') game.message('Skeletron has lost a hand!');
  }
}

function killBoss(e, game) {
  if (e.dead) return;
  e.dead = true;
  AudioSys.play('bossDeath');
  if (typeof recordBestiary === 'function') recordBestiary(game, e, true);
  if (e.ooaBoss) {
    oldOnesArmyBossKilled(e, game);
    return;
  }
  if (e.boss === 'twins' && e.sibling && !e.sibling.dead) {
    game.message(e.name + ' has been destroyed! Its twin still lives.');
    return;
  }
  game.message('You have defeated ' + e.name + '!');
  if (game.shake) game.shake(7, 0.5);
  var drops = [];
  if (e.boss === 'twins') {
    drops.push({ id: I.HALLOWEDBAR, count: 12 + Math.floor(Math.random() * 8) });
    drops.push({ id: I.SOUL_SIGHT, count: 8 + Math.floor(Math.random() * 6) });
    drops.push({ id: I.HEALINGPOTION, count: 2 });
  } else if (e.boss === 'deerclops') {
    var deerLoot = [I.LUCYTHEAXE, I.PEWMATICHORN, I.WEATHERPAIN];
    drops.push({ id:deerLoot[Math.floor(Math.random() * deerLoot.length)], count:1 });
    drops.push({ id:I.EYEBONE, count:Math.random() < 0.35 ? 1 : 0 });
    drops.push({ id:I.FLINXFUR, count:3 + Math.floor(Math.random() * 3) });
    drops.push({ id:I.HEALINGPOTION, count:3 });
  } else if (e.boss === 'kingslime') {
    drops.push({ id: I.GEL, count: 40 + Math.floor(Math.random() * 30) });
    drops.push({ id: I.GOLDCOIN, count: 8 + Math.floor(Math.random() * 6) });
    drops.push({ id: I.HEALINGPOTION, count: 1 });
  } else if (e.boss === 'eyeofcthulhu') {
    drops.push({ id: game.world.evil === 'crimson' ? I.CRIMTANE : I.DEMONITE, count: 30 + Math.floor(Math.random() * 20) });
    drops.push({ id: I.LENS, count: 3 });
    drops.push({ id: I.HEALINGPOTION, count: 2 });
  } else if (e.boss === 'eaterofworlds') {
    drops.push({ id: I.DEMONITE, count: 40 + Math.floor(Math.random() * 30) });
    drops.push({ id: I.SHADOWSCALE, count: 25 + Math.floor(Math.random() * 15) });
    drops.push({ id: I.BABYEATER, count: Math.random() < 0.2 ? 1 : 0 });
    drops.push({ id: I.GLOWSTONE, count: 15 + Math.floor(Math.random() * 10) });
    drops.push({ id: I.HEALINGPOTION, count: 3 });
  } else if (e.boss === 'brainofcthulhu') {
    drops.push({ id: I.CRIMTANE, count: 30 + Math.floor(Math.random() * 20) });
    drops.push({ id: I.TISSUESAMPLE, count: 25 + Math.floor(Math.random() * 15) });
    drops.push({ id: I.GLOWSTONE, count: 10 + Math.floor(Math.random() * 8) });
    drops.push({ id: I.HEALINGPOTION, count: 2 });
  } else if (e.boss === 'queenbee') {
    drops.push({ id: I.BEEGUN, count: 1 });
    drops.push({ id: I.HONEY, count: 20 + Math.floor(Math.random() * 15) });
    drops.push({ id: I.GLOWSTONE, count: 8 + Math.floor(Math.random() * 5) });
    drops.push({ id: I.HEALINGPOTION, count: 2 });
  } else if (e.boss === 'skeletron') {
    drops.push({ id: I.GOLDBAR, count: 10 + Math.floor(Math.random() * 6) });
    drops.push({ id: I.BONE, count: 20 + Math.floor(Math.random() * 15) });
    drops.push({ id: I.HEALINGPOTION, count: 3 });
  } else if (e.boss === 'wallofflesh') {
    drops.push({ id: I.PWHAMMER, count: 1 });
    var wallWeapons = [I.CLOCKWORKAR, I.FIRECRACKER];
    var wallEmblems = [I.WARRIOREMBLEM, I.MAGICEMBLEM, I.RANGEREMBLEM, I.SUMMONEREMBLEM];
    drops.push({ id:wallWeapons[Math.floor(Math.random() * wallWeapons.length)], count:1 });
    drops.push({ id:wallEmblems[Math.floor(Math.random() * wallEmblems.length)], count:1 });
    drops.push({ id: I.HEALINGPOTION, count: 3 });
  } else if (e.boss === 'destroyer') {
    drops.push({ id: I.HALLOWEDBAR, count: 18 + Math.floor(Math.random() * 10) });
    drops.push({ id: I.SOUL_MIGHT, count: 8 + Math.floor(Math.random() * 6) });
    drops.push({ id: I.HEALINGPOTION, count: 3 });
  } else if (e.boss === 'skelprime') {
    drops.push({ id: I.HALLOWEDBAR, count: 14 + Math.floor(Math.random() * 8) });
    drops.push({ id: I.SOUL_FRIGHT, count: 8 + Math.floor(Math.random() * 6) });
    drops.push({ id: I.HEALINGPOTION, count: 3 });
  } else if (e.boss === 'queenslime') {
    drops.push({ id: I.BLADESTAFF, count: 1 });
    drops.push({ id: I.SOUL_LIGHT, count: 8 + Math.floor(Math.random() * 6) });
    drops.push({ id: I.HEALINGPOTION, count: 2 });
  } else if (e.boss === 'plantera') {
    drops.push({ id: I.CHLOROPHYTEBAR, count: 14 + Math.floor(Math.random() * 8) });
    drops.push({ id: I.SEEDLER, count: 1 });
    drops.push({ id: I.GRENADELAUNCHER, count: 1 });
    drops.push({ id: I.PYGMYSTAFF, count: 1 });
    drops.push({ id: I.HEALINGPOTION, count: 3 });
  } else if (e.boss === 'golem') {
    drops.push({ id: I.PICKSHAW, count: 1 });
    var golemLoot = [I.HEATRAY, I.POSSESSEDHATCHET, I.STAFFOFEARTH, I.SUNSTONE];
    drops.push({ id:golemLoot[Math.floor(Math.random() * golemLoot.length)], count:1 });
    drops.push({ id: I.TEMPLEBRICK, count: 20 });
    drops.push({ id: I.HEALINGPOTION, count: 3 });
  } else if (e.boss === 'duke') {
    var dukeLoot = [I.RAZORBLADETYPHOON, I.TEMPESTSTAFF, I.FLAIRON, I.TSUNAMI, I.BUBBLEGUN];
    var dukeMobility = [I.FISHRONWINGS, I.SHRIMPYTRUFFLE];
    drops.push({ id:dukeLoot[Math.floor(Math.random() * dukeLoot.length)], count:1 });
    drops.push({ id:dukeMobility[Math.floor(Math.random() * dukeMobility.length)], count:1 });
    drops.push({ id: I.SOUL_LIGHT, count: 4 });
    drops.push({ id: I.HEALINGPOTION, count: 2 });
  } else if (e.boss === 'empress') {
    drops.push({ id: I.KALEIDOSCOPE, count: 1 });
    drops.push({ id: I.TERRAPRISMA, count: 1 });
    drops.push({ id: I.SOUL_LIGHT, count: 5 });
    drops.push({ id: I.HEALINGPOTION, count: 2 });
  } else if (e.boss === 'cultist') {
    drops.push({ id: I.FRAG_SOLAR, count: 5 });
    drops.push({ id: I.FRAG_NEBULA, count: 5 });
    drops.push({ id: I.FRAG_VORTEX, count: 5 });
    drops.push({ id: I.FRAG_STARDUST, count: 5 });
  } else if (e.boss === 'lunar') {
    var frags = { solar:I.FRAG_SOLAR, vortex:I.FRAG_VORTEX, nebula:I.FRAG_NEBULA, stardust:I.FRAG_STARDUST };
    drops.push({ id: frags[e.sub] || I.FRAG_SOLAR, count: 20 + Math.floor(Math.random() * 15) });
    drops.push({ id: I.HEALINGPOTION, count: 3 });
  } else if (e.boss === 'moonlord') {
    drops.push({ id: I.LASTPRISM, count: 1 });
    drops.push({ id: I.LUNARFLARE, count: 1 });
    drops.push({ id: I.STARDUSTDRAGONSTAFF, count: 1 });
    drops.push({ id: I.TERRARIAN, count: 1 });
    drops.push({ id: I.CELEBRATION, count: 1 });
    drops.push({ id: I.LUMINITE, count: 30 + Math.floor(Math.random() * 15) });
    drops.push({ id: I.FRAG_STARDUST, count: 10 });
  } else if (e.boss === 'mourningwood') {
    var mourningLoot = [I.NECROMANTICSCROLL, I.SPOOKYHOOK, I.BROOM];
    drops.push({ id:mourningLoot[Math.floor(Math.random() * mourningLoot.length)], count:1 });
    drops.push({ id: I.SPOOKYWOOD, count: 20 + Math.floor(Math.random() * 20) });
    drops.push({ id: I.ECTOPLASM, count: 10 + Math.floor(Math.random() * 10) });
    drops.push({ id: I.HEALINGPOTION, count: 2 });
  } else if (e.boss === 'pumpking') {
    var pumpkingLoot = [I.THEHORSEMANSBLADE, I.RAVENSTAFF, I.DARKHARVEST];
    drops.push({ id:pumpkingLoot[Math.floor(Math.random() * pumpkingLoot.length)], count:1 });
    drops.push({ id: I.ECTOPLASM, count: 20 + Math.floor(Math.random() * 15) });
    drops.push({ id: I.HEALINGPOTION, count: 3 });
  } else if (e.boss === 'everscream') {
    var everscreamLoot = [I.RAZORPINE, I.CHRISTMASHOOK];
    drops.push({ id:everscreamLoot[Math.floor(Math.random() * everscreamLoot.length)], count:1 });
    drops.push({ id: I.ECTOPLASM, count: 8 + Math.floor(Math.random() * 8) });
    drops.push({ id: I.HEALINGPOTION, count: 2 });
  } else if (e.boss === 'santank') {
    var santaLoot = [I.CHAINGUN, I.ELFMELTER];
    drops.push({ id:santaLoot[Math.floor(Math.random() * santaLoot.length)], count:1 });
    drops.push({ id: I.ROCKET4, count: 10 + Math.floor(Math.random() * 10) });
    drops.push({ id: I.HEALINGPOTION, count: 2 });
  } else if (e.boss === 'icequeen') {
    var iceLoot = [I.SNOWMANCANNON, I.NORTHPOLE, I.BLIZZARDSTAFF, I.REINDEERMOUNT];
    drops.push({ id:iceLoot[Math.floor(Math.random() * iceLoot.length)], count:1 });
    drops.push({ id: I.HEALINGPOTION, count: 3 });
  } else if (e.boss === 'martiansaucer') {
    var martianLoot = [I.INFLUXWAVER, I.XENOPOPPER, I.LASERMACHINEGUN, I.XENOSTAFF, I.UFOMOUNT, I.ELECTROSPHERELAUNCHER];
    drops.push({ id:martianLoot[Math.floor(Math.random() * martianLoot.length)], count:1 });
    drops.push({ id: I.HEALINGPOTION, count: 3 });
  } else if (e.boss === 'mothron') {
    drops.push({ id: I.BROKENHEROSWORD, count: 2 });
    var mothronLoot = [I.MOTHRONWINGS, I.THEEYEOFOCTHULU];
    drops.push({ id:mothronLoot[Math.floor(Math.random() * mothronLoot.length)], count:1 });
    drops.push({ id: I.ECTOPLASM, count: 5 });
    drops.push({ id: I.HEALINGPOTION, count: 2 });
  } else if (e.boss === 'goblinwarlock') {
    var shadowLoot = [I.SHADOWFLAMEBOW, I.SHADOWFLAMEKNIFE, I.SHADOWFLAMEHEXDOLL];
    drops.push({ id: shadowLoot[Math.floor(Math.random() * shadowLoot.length)], count: 1 });
    drops.push({ id: I.TATTEREDCLOTH, count: 4 + Math.floor(Math.random() * 3) });
    drops.push({ id: I.HEALINGPOTION, count: 2 });
  } else if (e.boss === 'piratecaptain') {
    drops.push({ id: Math.random() < 0.5 ? I.CUTLASS : I.GOLDRING, count: 1 });
    drops.push({ id: I.PIRATEMAP, count: 1 });
    drops.push({ id: I.GOLDCOIN, count: 5 + Math.floor(Math.random() * 5) });
    drops.push({ id: I.HEALINGPOTION, count: 2 });
  } else if (e.boss === 'flyingdutchman') {
    var pirateLoot = [I.PIRATESTAFF, I.LUCKYCOIN, I.DISCOUNTCARD, I.GOLDRING, I.COINGUN];
    drops.push({ id: pirateLoot[Math.floor(Math.random() * pirateLoot.length)], count: 1 });
    drops.push({ id: I.CUTLASS, count: 1 });
    drops.push({ id: I.GOLDCOIN, count: 15 + Math.floor(Math.random() * 10) });
    drops.push({ id: I.HEALINGPOTION, count: 3 });
  }
  // mark boss defeated
  game.bossesDefeated[e.boss] = true;
  var dm = diffScale();
  if (dm.bag) {
    var bagDrops = drops.concat([{ id: I.GOLDCOIN, count: 5 + Math.floor(Math.random() * 5) }]);
    game.pickups.push({ nid: typeof Net !== 'undefined' ? ++Net.seq : 0, item: I.BOSSBAG, count: 1, x: e.x, y: e.y, seed: Math.random() * 100, t: 0, bagBoss: e.boss, bagDrops: bagDrops });
  } else {
    for (var i = 0; i < drops.length; i++) {
      var d = drops[i];
      if (d && d.count > 0) {
        if (dm.coin !== 1 && COIN_VALUES[d.id]) d.count = Math.max(1, Math.round(d.count * dm.coin));
        game.addPickup(e.x + (Math.random() * 60 - 30), e.y + (Math.random() * 40 - 20), d.id, d.count);
      }
    }
  }
  if (game.onBossDefeated) game.onBossDefeated(e.boss);
  game.checkBossCompletion();
}
