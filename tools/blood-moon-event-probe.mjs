// Real timed-event paths; surface placement and RNG are disposable fixtures.
export async function runBloodMoonEventProbe(page) {
  return page.evaluate(() => {
    const pools = [], spawns = [], readiness = [], daylight = [], kills = [], dt = 1 / 60;
    const near = (a,b) => Math.abs(a - b) < 1e-7;
    const base = [E.BLOODZOMBIE,E.DRIPPLER,E.BRIDE,E.GROOM,E.ZOMBIE,E.DEMONEYE,E.CORRUPTBUNNY,E.CORRUPTGOLDFISH,E.CORRUPTPENGUIN];
    function scene(hardmode = false) {
      __piScene(false,hardmode); delete game.eventCompletions.bloodmoon; game.lanternNight.pending = false;
      delete game.lanternNight.celebrated['event:bloodmoon'];
      const p = game.player; p.x = __piOrigin.x; p.y = game.world.surfaceY[Math.floor(p.x / TILE)] * TILE - 40;
      game.startEvent('bloodmoon');
    }
    for (const hardmode of [false,true]) {
      scene(hardmode); const expected = base.concat(hardmode ? [E.CLOWN] : []), before = __piState(); renderGame(game,ctx2d);
      pools.push({ hardmode,readonly:before === __piState(),correct:JSON.stringify(eventTrashPool(EVENT_WAVES.bloodmoon)) === JSON.stringify(expected) &&
        game.event.type === 'bloodmoon' && game.event.mode === 'timed' && game.event.spawnT === 0 && !('wave' in game.event) });
      for (const spec of __piSpecs) for (const side of [-1,1]) {
        if (!expected.includes(spec.type)) continue;
        scene(hardmode); game.event.spawnT = dt;
        const pool = eventTrashPool(EVENT_WAVES.bloodmoon), random = Math.random, rolls = [(pool.indexOf(spec.type) + 0.25) / pool.length,side < 0 ? 0.25 : 0.75,0.5,0.5]; let calls = 0;
        const px = game.player.x, before = __piState(); renderGame(game,ctx2d); const readonly = before === __piState();
        try { Math.random = () => rolls[calls++] ?? 0.5; updateEvents(dt); } finally { Math.random = random; }
        const e = game.entities[0], x = clamp(px + side * 450,32,game.world.W * TILE - 32), ground = game.world.surfaceY[clamp(Math.floor(x / TILE),1,game.world.W - 2)] * TILE - 12;
        const live = __piRender(e);
        spawns.push({ hardmode,kind:spec.kind,side,readonly,live,correct:game.entities.length === 1 && e.type === spec.type && e.eventEnemy && !e.boss && !e.minion &&
          e.x === x && e.y === ground - (spec.fly ? 110 : 0) && near(game.event.spawnT,0.45) && !game.eventCompletions.bloodmoon && !game.lanternNight.pending });
      }
    }
    for (const initial of [0,dt,dt + 0.001]) for (const count of [0,6,7,8]) for (const depth of [-0.01,0,0.01]) {
      scene(); const p = game.player; p.y = game.world.surfaceY[Math.floor(p.x / TILE)] * TILE + 8 * TILE + depth;
      for (let i = 0; i < count + 1; i++) { const e = spawnEntity(game,E.BLOODZOMBIE,p.x,p.y - 60); e.eventEnemy = true; e.dead = i === count; }
      game.event.spawnT = initial; const expected = initial <= dt && count < 7 && depth < 0;
      const before = __piState(); renderGame(game,ctx2d); const readonly = before === __piState(), random = Math.random;
      try { Math.random = () => 0.5; updateEvents(dt); } finally { Math.random = random; }
      const after = __piState(); renderGame(game,ctx2d);
      readiness.push({ initial,count,depth,readonly:readonly && after === __piState(),correct:game.entities.length === count + 1 + +expected &&
        eventAliveCount() === count + +expected && near(game.event.spawnT,expected ? 0.45 : initial - dt) && !game.eventCompletions.bloodmoon && !game.lanternNight.pending });
    }
    for (const spec of __piSpecs) for (const time of [0.2499,0.25,0.5,0.75,0.7501]) {
      scene(); const e = __piEnemy(spec); e.eventEnemy = true; game.event.spawnT = 999; game.timeOfDay = time;
      const live = __piRender(e), day = time >= 0.25 && time <= 0.75; updateEvents(dt);
      const after = __piState(); renderGame(game,ctx2d);
      daylight.push({ kind:spec.kind,time,live,readonly:after === __piState(),correct:!e.dead && eventAliveCount() === 1 && game.entities.length === 1 &&
        (day ? game.event === null && game.eventCompletions.bloodmoon === true : game.event?.type === 'bloodmoon' && !game.eventCompletions.bloodmoon && near(game.event.spawnT,999 - dt)) &&
        !game.lanternNight.pending && !game.lanternNight.celebrated['event:bloodmoon'] });
    }
    for (const spec of __piSpecs) {
      scene(); const e = __piEnemy(spec); e.eventEnemy = true; game.event.spawnT = 999;
      const live = __piRender(e); hitEntity(e,e.hp + e.def + 100,0,0,game);
      const before = __piState(); renderGame(game,ctx2d); const readonly = before === __piState(); updateEvents(dt);
      const holds = e.dead && eventAliveCount() === 0 && game.event?.type === 'bloodmoon' && !game.eventCompletions.bloodmoon;
      game.timeOfDay = 0.25; const waiting = __piState(); renderGame(game,ctx2d); const waitingReadonly = waiting === __piState(); updateEvents(dt);
      kills.push({ kind:spec.kind,live,readonly:readonly && waitingReadonly,correct:holds && game.event === null && game.eventCompletions.bloodmoon === true && !game.lanternNight.pending });
    }
    return { pools,spawns,readiness,daylight,kills };
  });
}
