import { installInvasionFixture } from './invasion-art-fixture.mjs';

export async function installVampireFixture(page,config) {
  await installInvasionFixture(page,config);
  await page.evaluate(() => {
    window.__vaDelta = (e,target,launch = false) => {
      const dx = target.x - e.x, dy = target.y - (launch ? 10 : 0) - e.y, d = Math.hypot(dx,dy) || 1;
      return { x:dx / d * (launch ? 7 : e.speed * 0.4),y:dy / d * (launch ? 7 : e.speed * 0.4) - (launch ? 0 : 1) };
    };
    window.__vaPose = function(pose,side = 1,wet = false) {
      __piScene(wet); game.startEvent('solareclipse'); startWave(game.event);
      const e = __piEnemy(__piSpecs[0]); e.eventEnemy = true; e.dir = side;
      e.attackCd = pose === 'launching' ? 0 : pose === 'recovering' ? 1.5 : 0.5;
      game.player.x = e.x + side * 200; game.player.y = e.y;
      if (pose === 'recovering') e.charge = { x:game.player.x,y:game.player.y - 10,t:1 / 60 };
      __piStep(e); game.cam.x = e.x; game.cam.y = e.y - 80; return e;
    };
  });
}

export async function runVampireScenarios(page) {
  return page.evaluate(() => {
    const rows = [];
    for (const wet of [false,true]) for (const pose of __piConfig.scenarioStates) for (const side of [-1,1]) {
      const e = __vaPose(pose,side,wet), before = __piState(), hook = CombatArt.drawEnemy; let calls = 0;
      CombatArt.drawEnemy = (...args) => { if (args[2] === e) calls++; return hook(...args); };
      try { renderGame(game,ctx2d); } finally { CombatArt.drawEnemy = hook; }
      rows.push({ wet,pose,side,calls,readonly:before === __piState(),shots:game.projectiles.list.length,
        cooldowns:Math.abs(e.attackCd - (pose === 'launching' ? 2.4 : (pose === 'recovering' ? 1.5 : 0.5) - 1 / 60)) < 1e-7,
        event:game.event.type === 'solareclipse' && game.event.wave === 1 && game.event.pending === 6 && game.event.minisPending === 0 && e.eventEnemy && eventAliveCount() === 1,
        bodies:e.w === ENT_DEF[e.type].w && e.h === ENT_DEF[e.type].h && !e.segments && !e.arms && !e.ghost,
        movement:e.fly && !e.onGround && e.vx === 0 && e.vy === 0 && (pose === 'launching' ? !!e.charge && Math.abs(e.charge.t - 59 / 60) < 1e-7 : !e.charge),
        noLoot:game.pickups.length === 0,noChildren:game.entities.length === 1 });
    }
    return rows;
  });
}

export async function runVampireProbe(page) {
  return page.evaluate(() => {
    const flight = [], readiness = [], locked = [], terrain = [], contacts = [], loot = [], targeting = [], events = [];
    const near = (a,b) => Math.abs(a - b) < 1e-7;
    for (const wet of [false,true]) for (const side of [-1,1]) for (const dy of [-80,0,80]) {
      __piScene(wet); const e = __piEnemy(__piSpecs[0]); e.attackCd = 999; e.vx = -side * 3; e.vy = -4;
      game.player.x = e.x + side * 200; game.player.y = e.y + dy;
      const x = e.x, y = e.y, bob = e.bob, move = __vaDelta(e,game.player); __piStep(e);
      flight.push({ wet,side,dy,...__piRender(e),correct:near(e.x - x,move.x) && near(e.y - y,move.y) && e.vx === -side * 3 && e.vy === -4 && e.bob === bob && !e.onGround && !e.charge && near(e.attackCd,999 - 1 / 60) && game.projectiles.list.length === 0 });
    }
    for (const side of [-1,1]) for (const dy of [-80,0,80]) for (const initial of [undefined,0,-0.001,0.001,1 / 60,1 / 60 + 0.001,0.5]) {
      __piScene(); const e = __piEnemy(__piSpecs[0]); if (initial !== undefined) e.attackCd = initial;
      game.player.x = e.x + side * 200; game.player.y = e.y + dy;
      const x = e.x, y = e.y, launches = initial === undefined || initial <= 1 / 60, move = __vaDelta(e,game.player,launches), target = { x:game.player.x,y:game.player.y - 10 };
      __piStep(e);
      readiness.push({ side,dy,initial,...__piRender(e),correct:near(e.x - x,move.x) && near(e.y - y,move.y) && near(e.attackCd,launches ? 2.4 : initial - 1 / 60) &&
        (launches ? e.charge.x === target.x && e.charge.y === target.y && near(e.charge.t,59 / 60) : !e.charge) && e.vx === 0 && e.vy === 0 && game.projectiles.list.length === 0 });
    }
    for (const side of [-1,1]) {
      __piScene(); const e = __piEnemy(__piSpecs[0]); e.attackCd = 0; game.player.x = e.x + side * 200; game.player.y = e.y; __piStep(e);
      const target = { ...e.charge }, x = e.x, y = e.y;
      // An existing charge has neither the hover bias nor a new target offset.
      const dx = target.x - x, dy = target.y - y, d = Math.hypot(dx,dy) || 1;
      game.player.x = e.x - side * 300; game.player.y = e.y + 100; __piStep(e);
      const holds = e.charge.x === target.x && e.charge.y === target.y && near(e.charge.t,target.t - 1 / 60) && near(e.x - x,dx / d * 7) && near(e.y - y,dy / d * 7);
      e.charge.t = 1 / 60; const last = { x:e.x,y:e.y }, lx = target.x - e.x, ly = target.y - e.y, ld = Math.hypot(lx,ly) || 1; __piStep(e);
      const expires = !e.charge && near(e.x - last.x,lx / ld * 7) && near(e.y - last.y,ly / ld * 7);
      const hover = __vaDelta(e,game.player), hx = e.x, hy = e.y; __piStep(e);
      locked.push({ side,...__piRender(e),correct:holds && expires && near(e.x - hx,hover.x) && near(e.y - hy,hover.y) && !e.charge });
    }
    for (const side of [-1,1]) for (const launch of [false,true]) {
      __piScene(); const e = __piEnemy(__piSpecs[0]), w = game.world, wx = __piOrigin.tx + side * 3, old = [];
      for (let ty = __piOrigin.gy - 12; ty < __piOrigin.gy; ty++) { old.push([ty,w.get(wx,ty)]); w.set(wx,ty,T.STONE); }
      e.x = side > 0 ? wx * TILE - e.w / 2 - 0.05 : (wx + 1) * TILE + e.w / 2 + 0.05;
      e.attackCd = launch ? 0 : 999; game.player.x = e.x + side * 200; game.player.y = e.y + (launch ? 10 : 0);
      const x = e.x, y = e.y, move = __vaDelta(e,game.player,launch), before = JSON.stringify(__piTerrain()); __piStep(e);
      terrain.push({ side,launch,...__piRender(e),correct:near(e.x - x,move.x) && near(e.y - y,move.y) && before === JSON.stringify(__piTerrain()) && !e.ghost && !e.onGround });
      old.forEach(([ty,t]) => w.set(wx,ty,t));
    }
    const difficulty = game.difficulty;
    try {
      for (const level of ['normal','expert','master']) {
        __piScene(); game.difficulty = level; const e = __piEnemy(__piSpecs[0]); e.attackCd = 999; game.player.x = e.x + 3; game.player.y = e.y; game.player.invuln = 0;
        __piStep(e); const hp = game.player.hp; __piStep(e);
        contacts.push({ level,...__piRender(e),correct:hp < 1000 && game.player.hp === hp && game.player.invuln > 0 && near(e.dmgCd,0.8 - 1 / 60) && e.dmg === Math.round(ENT_DEF[e.type].dmg * DIFFICULTY[level].dmg) });
      }
    } finally { game.difficulty = difficulty; }
    for (const hardmode of [false,true]) for (const [moon,wing,rare] of [[0.0799,0.1199,0.5],[0.08,0.1199,0.5],[0.0799,0.12,0.5],[0.08,0.12,0.5],[0.99,0.99,0.001]]) {
      __piScene(false,hardmode); const e = __piEnemy(__piSpecs[0]), random = Math.random, table = dropTable;
      hitEntity(e,1,0,0,game); const flash = e.flash > 0, drawn = __piRender(e); let calls = 0;
      try {
        Math.random = () => rare;
        dropTable = (...args) => { calls++; let roll = 0; const values = [0.5,moon,wing]; Math.random = () => values[Math.min(roll++,2)]; try { return table(...args); } finally { Math.random = () => rare; } };
        hitEntity(e,e.hp + e.def + 100,0,0,game);
      } finally { Math.random = random; dropTable = table; }
      const expected = {}, add = (id,n) => { if (n > 0) expected[id] = (expected[id] || 0) + n; }; add(I.SOUL_NIGHT,1);
      if (moon < 0.08) add(I.MOONSTONE,1); if (wing < 0.12) add(I.BROKENBATWING,1);
      for (const c of copperToCoins(ENEMY_COIN_VALUES[e.name.toLowerCase()] || 0)) add(c.id,c.count);
      for (const d of B83_ENEMY_DROPS[e.name] || []) if (rare < d.rate) add(d.id,1);
      const actual = game.pickups.reduce((out,p) => { if (p.count > 0) out[p.item] = (out[p.item] || 0) + p.count; return out; },{}), before = __piState(); renderGame(game,ctx2d);
      loot.push({ hardmode,moon,wing,rare,...drawn,correct:calls === 1 && flash && e.dead && !__piPixels(e).some((v,i) => i % 4 === 3 && v) && before === __piState() && game.entities.length === 1 &&
        Object.keys(actual).length === Object.keys(expected).length && Object.entries(expected).every(([id,n]) => actual[id] === n),actual,expected });
    }
    const host = Net.isHost, remote = Net.remotePlayers;
    try {
      Net.isHost = () => true;
      for (const dying of [false,true]) {
        __piScene(); const e = __piEnemy(__piSpecs[0]); e.attackCd = 0; game.player.x = e.x - 300; game.player.y = e.y;
        Net.remotePlayers = { fixture:{ x:e.x + 150,y:e.y + 40,w:20,h:40,dying } };
        const target = dying ? game.player : Net.remotePlayers.fixture, x = e.x, y = e.y, move = __vaDelta(e,target,true); __piStep(e);
        targeting.push({ dying,...__piRender(e),correct:e.charge.x === target.x && e.charge.y === target.y - 10 && near(e.x - x,move.x) && near(e.y - y,move.y) });
      }
    } finally { Net.isHost = host; Net.remotePlayers = remote; }
    __piScene(); delete game.eventCompletions.solareclipse; game.lanternNight.pending = false; game.startEvent('solareclipse'); startWave(game.event);
    spawnEventEnemy(E.VAMPIRE); const e = game.entities[0]; e.x = __piOrigin.x; e.y = game.player.y - 40;
    const eligible = eventTrashPool(EVENT_WAVES.solareclipse).includes(E.VAMPIRE) && game.event.pending === 6;
    game.event.wave = EVENT_WAVES.solareclipse.sizes.length; game.event.pending = game.event.minisPending = 0;
    const live = __piRender(e), holds = eventAliveCount() === 1 && e.eventEnemy;
    hitEntity(e,e.hp + e.def + 100,0,0,game); const before = __piState(); renderGame(game,ctx2d);
    const waiting = before === __piState() && game.event !== null && !game.eventCompletions.solareclipse; updateEvents(1 / 60);
    events.push({ ...live,correct:eligible && holds && waiting && game.event === null && game.eventCompletions.solareclipse && !game.lanternNight.pending });
    return { flight,readiness,locked,terrain,contacts,loot,targeting,events };
  });
}
