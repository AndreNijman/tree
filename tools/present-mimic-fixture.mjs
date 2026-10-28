import { installInvasionFixture } from './invasion-art-fixture.mjs';

export async function installPresentMimicFixture(page,config) {
  await installInvasionFixture(page,config);
  await page.evaluate(() => {
    window.__pmPose = function(pose,side = 1,wet = false) {
      __piScene(wet); game.startEvent('frostmoon'); startWave(game.event);
      const e = __piEnemy(__piSpecs[0]); e.eventEnemy = true; e.dir = side;
      e.awake = pose !== 'sleeping'; e.attackCd = pose === 'charging' ? 0 : 0.5;
      game.player.x = e.x + side * 200; game.player.y = e.y;
      __piStep(e);
      game.cam.x = e.x; game.cam.y = e.y - 100;
      return e;
    };
  });
}

export async function runPresentMimicScenarios(page) {
  return page.evaluate(() => {
    const rows = [];
    for (const wet of [false,true]) for (const pose of __piConfig.scenarioStates) for (const side of [-1,1]) {
      const e = __pmPose(pose,side,wet), before = __piState(), hook = CombatArt.drawEnemy; let calls = 0;
      CombatArt.drawEnemy = (...args) => { if (args[2] === e) calls++; return hook(...args); };
      try { renderGame(game,ctx2d); } finally { CombatArt.drawEnemy = hook; }
      const drawn = { calls,readonly:before === __piState() };
      rows.push({ wet,pose,side,...drawn,shots:game.projectiles.list.length,cooldowns:pose === 'sleeping' ? e.attackCd === 0.5 :
        Math.abs(e.attackCd - (pose === 'charging' ? 2.4 : 0.5 - 1 / 60)) < 1e-7,
        event:game.event.type === 'frostmoon' && game.event.wave === 1 && game.event.pending === EVENT_WAVES.frostmoon.sizes[0] && e.eventEnemy && eventAliveCount() === 1,
        bodies:e.w === ENT_DEF[e.type].w && e.h === ENT_DEF[e.type].h && !e.segments && !e.arms && !e.ghost,
        movement:!!e.awake === (pose !== 'sleeping') && (pose === 'charging' ? !!e.charge && Math.abs(e.charge.t - 59 / 60) < 1e-7 : !e.charge) && e.onGround && e.vy === 0,
        noLoot:game.pickups.length === 0,noChildren:game.entities.length === 1 });
    }
    return rows;
  });
}

export async function runPresentMimicProbe(page) {
  return page.evaluate(() => {
    const wake = [], readiness = [], locked = [], physics = [], contacts = [], loot = [], targeting = [], events = [];
    const near = (a,b) => Math.abs(a - b) < 1e-7;
    for (const side of [-1,1]) for (const distance of [139.999,140,140.001]) for (const vertical of [false,true]) {
      __piScene(); const e = __piEnemy(__piSpecs[0]); e.attackCd = 0.5;
      game.player.x = e.x + (vertical ? 0 : side * distance); game.player.y = e.y + (vertical ? side * distance : 0);
      const x = e.x; __piStep(e);
      wake.push({ side,distance,vertical,...__piRender(e),correct:!!e.awake === (distance < 140) && e.x === x && !e.charge &&
        near(e.attackCd,distance < 140 ? 0.5 - 1 / 60 : 0.5) && game.projectiles.list.length === 0 });
    }
    for (const side of [-1,1]) for (const initial of [undefined,0,-0.001,0.001,1 / 60,1 / 60 + 0.001,0.5]) {
      __piScene(); const e = __piEnemy(__piSpecs[0]); e.awake = true; e.shootCd = 0;
      if (initial !== undefined) e.attackCd = initial;
      const x = e.x, y = e.y; game.player.x = x + side * 200; game.player.y = y; __piStep(e);
      const fires = initial === undefined || initial <= 1 / 60;
      readiness.push({ side,initial,...__piRender(e),correct:near(e.x,x + (fires ? side * 9 : 0)) && e.y === y && e.vx === 0 && e.vy === 0 && e.onGround &&
        near(e.attackCd,fires ? 2.4 : initial - 1 / 60) && (fires ? e.charge.x === x + side * 200 && e.charge.y === y && near(e.charge.t,59 / 60) : !e.charge) &&
        e.shootCd === 0 && game.projectiles.list.length === 0 });
    }
    for (const side of [-1,1]) {
      __piScene(); const e = __piEnemy(__piSpecs[0]); e.awake = true; e.attackCd = 0;
      game.player.x = e.x + side * 200; game.player.y = e.y; __piStep(e);
      const charge = { ...e.charge }, x = e.x;
      game.player.x = e.x - side * 300; __piStep(e);
      const holds = e.charge.x === charge.x && e.charge.y === charge.y && near(e.charge.t,charge.t - 1 / 60) && near(e.x,x + side * 9);
      e.charge.t = 1 / 60; const last = e.x; __piStep(e); const expires = !e.charge && near(e.x,last + side * 9);
      const stopped = e.x; __piStep(e);
      locked.push({ side,...__piRender(e),correct:holds && expires && e.x === stopped && game.projectiles.list.length === 0 });
    }
    for (const awake of [false,true]) for (const airborne of [false,true]) {
      __piScene(); const e = __piEnemy(__piSpecs[0]); e.awake = awake; e.attackCd = 0.5; e.vx = 2;
      if (airborne) { e.y -= 40; e.onGround = false; }
      const x = e.x, y = e.y; game.player.x = x + 300; game.player.y = y; __piStep(e);
      physics.push({ awake,airborne,...__piRender(e),correct:near(e.x,x + (awake ? 2 : 0)) && near(e.y,y + (airborne ? GRAVITY : 0)) &&
        near(e.vy,airborne ? GRAVITY : 0) && e.onGround === !airborne && !e.charge });
    }
    for (const side of [-1,1]) {
      __piScene(); const e = __piEnemy(__piSpecs[0]), w = game.world, wx = __piOrigin.tx + side * 3, old = [];
      for (let y = __piOrigin.gy - 10; y < __piOrigin.gy; y++) { old.push([y,w.get(wx,y)]); w.set(wx,y,T.STONE); }
      e.x = side > 0 ? wx * TILE - e.w / 2 - 0.05 : (wx + 1) * TILE + e.w / 2 + 0.05;
      e.awake = true; e.attackCd = 999; e.vx = side * 4; game.player.x = e.x + side * 200; game.player.y = e.y;
      const before = JSON.stringify(__piTerrain()); __piStep(e);
      const solid = e.vx === 0;
      // mimicStep directly offsets x before ordinary physics. Preserve that order,
      // rather than inventing a swept collision repair for a graphics pass.
      const x = e.x; e.attackCd = 0; game.player.x = x + side * 200; game.player.y = e.y; __piStep(e);
      physics.push({ side,...__piRender(e),correct:solid && near(e.x,x + side * 9) && before === JSON.stringify(__piTerrain()) });
      old.forEach(([y,t]) => w.set(wx,y,t));
    }
    for (const difficulty of ['normal','expert','master']) {
      const old = game.difficulty; game.difficulty = difficulty;
      try {
        __piScene(); const e = __piEnemy(__piSpecs[0]); e.awake = true; e.attackCd = 999; game.player.x = e.x + 3; game.player.y = e.y; game.player.invuln = 0;
        __piStep(e); const hp = game.player.hp; __piStep(e);
        contacts.push({ difficulty,...__piRender(e),correct:hp < 1000 && game.player.hp === hp && game.player.invuln > 0 && near(e.dmgCd,0.8 - 1 / 60) && e.dmg === Math.round(ENT_DEF[e.type].dmg * DIFFICULTY[difficulty].dmg) });
      } finally { game.difficulty = old; }
    }
    for (const hardmode of [false,true]) for (const roll of [0,0.5,0.999]) {
      __piScene(false,hardmode); const e = __piEnemy(__piSpecs[0]), random = Math.random;
      hitEntity(e,1,0,0,game); const flash = e.flash > 0, drawn = __piRender(e);
      try { Math.random = () => roll; hitEntity(e,e.hp + e.def + 100,0,0,game); } finally { Math.random = random; }
      const expected = { [I.ECTOPLASM]:2 }, add = (id,n) => { expected[id] = (expected[id] || 0) + n; };
      for (const c of copperToCoins(ENEMY_COIN_VALUES[e.name.toLowerCase()] || 0)) add(c.id,c.count);
      for (const d of B83_ENEMY_DROPS[e.name] || []) if (roll < d.rate) add(d.id,1);
      const actual = game.pickups.reduce((out,p) => { if (p.count > 0) out[p.item] = (out[p.item] || 0) + p.count; return out; },{});
      const before = __piState(); renderGame(game,ctx2d);
      loot.push({ hardmode,roll,...drawn,correct:flash && e.dead && !__piPixels(e).some((v,i) => i % 4 === 3 && v) && before === __piState() && game.entities.length === 1 &&
        Object.keys(actual).length === Object.keys(expected).length && Object.entries(expected).every(([id,n]) => actual[id] === n),actual,expected });
    }
    const host = Net.isHost, remote = Net.remotePlayers;
    try {
      Net.isHost = () => true;
      for (const dying of [false,true]) {
        __piScene(); const e = __piEnemy(__piSpecs[0]); game.player.x = e.x - 300; game.player.y = e.y;
        Net.remotePlayers = { fixture:{ x:e.x + 100,y:e.y,w:20,h:40,dying } }; const x = e.x; __piStep(e);
        targeting.push({ dying,...__piRender(e),correct:dying ? !e.awake && e.x === x && !e.charge : e.awake && near(e.x,x + 9) && e.charge.x === x + 100 });
      }
    } finally { Net.isHost = host; Net.remotePlayers = remote; }
    __piScene(); delete game.eventCompletions.frostmoon; game.lanternNight.pending = false; game.startEvent('frostmoon'); startWave(game.event);
    spawnEventEnemy(E.PRESENTMIMIC); const e = game.entities[0]; e.x = __piOrigin.x; e.y = game.player.y - 40;
    game.event.wave = EVENT_WAVES.frostmoon.sizes.length; game.event.pending = game.event.minisPending = 0;
    const live = __piRender(e), holds = eventAliveCount() === 1 && e.eventEnemy;
    hitEntity(e,e.hp + e.def + 100,0,0,game); const before = __piState(); renderGame(game,ctx2d);
    const waiting = before === __piState() && game.event !== null && !game.eventCompletions.frostmoon;
    updateEvents(1 / 60);
    events.push({ ...live,correct:holds && waiting && game.event === null && game.eventCompletions.frostmoon && !game.lanternNight.pending });
    __piScene(); game.startEvent('frostmoon'); game.event.wave = EVENT_WAVES.frostmoon.sizes.length - 1; startWave(game.event);
    for (const name of ['everscream','santank','icequeen']) {
      const before = __piState(); renderGame(game,ctx2d); const readonly = before === __piState(), pending = game.event.pending;
      game.event.t = 0; updateEvents(1 / 60);
      events.push({ correct:readonly && game.event.pending === pending - 1 && game.entities.some(e => e.boss === name && e.eventEnemy) });
    }
    return { wake,readiness,locked,physics,contacts,loot,targeting,events };
  });
}
