// Disposable invasion fixtures; no changes to gameplay AI or spawn/drop tables.
export async function installInvasionFixture(page,config) {
  await page.evaluate(config => {
    game.paused = true; game.weather.active = false; game.event = null;
    const w = game.world, tx = Math.floor(w.spawnX / TILE), gy = Math.min(w.H - 10,w.hellY + 12);
    for (let x = tx - 45; x <= tx + 45; x++) {
      for (let y = gy - 35; y < gy; y++) { w.set(x,y,T.AIR); w.setWall(x,y,WALL.CAVE); }
      w.set(x,gy,T.STONE); if ((x - tx) % 6 === 0) w.set(x,gy - 4,T.TORCH);
    }
    window.__piOrigin = { tx,gy,x:tx * TILE + 8 };
    // Retain the original pirate helper names for independently runnable probes.
    window.__piConfig = config;
    window.__piSpecs = config.specs.map(s => ({ range:520,aimOffset:8,originOffset:10,life:4,...s,type:E[s.type],projectile:s.shoot ? P[s.projectile] : undefined }));
    window.__piX = i => (i - (__piSpecs.length - 1) / 2) * 180;
    window.__piScene = function(wet = false,hardmode = true) {
      for (let x = tx - 42; x <= tx + 42; x++) for (let y = gy - 3; y < gy; y++) w.set(x,y,wet ? T.WATER : T.AIR);
      game.entities = []; game.bossBars = []; game.projectiles.list = []; game.fx = []; game.fxTexts = []; game.pickups = [];
      game.event = null; game.hardmode = hardmode; game.flashT = game.shakeT = 0;
      const p = game.player; p.x = __piOrigin.x - 120; p.y = gy * TILE - p.h / 2 - 0.01;
      p.vx = p.vy = 0; p.onGround = true; p.invuln = 999; p.hp = p.maxHp = 1000; p.dying = false; p.respawnT = 0;
      game.cam.x = __piOrigin.x; game.cam.y = p.y - 100; game.timeOfDay = __piConfig.night ? 0.85 : 0.5;
      document.getElementById('screenflash').style.display = 'none'; document.getElementById('deathscreen').classList.add('hidden');
      document.getElementById('message').style.display = 'none'; document.getElementById('interact').style.display = 'none';
    };
    window.__piEnemy = function(spec) {
      const e = spawnEntity(game,spec.type,__piOrigin.x,gy * TILE - ENT_DEF[spec.type].h / 2 - 0.01 - (spec.fly ? 20 : 0));
      e.onGround = !spec.fly; if (spec.hop) e.timer = 0.5; return e;
    };
    window.__piTerrain = function() {
      function hash(a) { let h = 2166136261; for (let i = 0; i < a.length; i++) h = Math.imul(h ^ a[i],16777619); return h >>> 0; }
      return [w.tiles,w.walls,w.hp,w.surfaceY].map(hash).concat([Array.from(w.liquidQueue || []).join(',')]);
    };
    window.__piState = function() {
      return JSON.stringify({ player:game.player,entities:game.entities,projectiles:game.projectiles.list,bars:game.bossBars,progress:game.bossesDefeated,
        event:game.event,timeOfDay:game.timeOfDay,hardmode:game.hardmode,mechDone:game.mechDone,difficulty:game.difficulty,eventCompletions:game.eventCompletions,fx:game.fx,texts:game.fxTexts,pickups:game.pickups,
        flash:game.flashT,kills:game.kills,bestiary:game.bestiary,lantern:game.lanternNight,achievements:game.achievements,remote:Net.remotePlayers,
        frostLegionDefeated:game.frostLegionDefeated,townArrivals:game.townArrivals,townPending:game.townPending,terrain:__piTerrain() });
    };
    window.__piStep = function(e,roll = 0.5) { const random = Math.random; try { Math.random = () => roll; enemyStep(e,game); } finally { Math.random = random; } };
    window.__piRender = function(e) {
      game.cam.x = e.x; game.cam.y = e.y - 50;
      const before = __piState(), hook = CombatArt.drawEnemy, random = Math.random; let calls = 0, rng = 0;
      CombatArt.drawEnemy = (...args) => {
        if (args[2] === e) calls++;
        // Count only artwork RNG, not the existing camera-shake effect.
        Math.random = () => { rng++; return 0.5; };
        try { return hook(...args); } finally { Math.random = random; }
      };
      try { for (let f = 0; f < 2; f++) renderGame(game,ctx2d); }
      finally { CombatArt.drawEnemy = hook; Math.random = random; }
      return { calls,readonly:before === __piState(),rng };
    };
    window.__piPixels = function(e) {
      const c = document.createElement('canvas'); c.width = c.height = 320;
      CombatArt.drawEnemy(c.getContext('2d'),game,e,{ x:e.x,y:e.y },320,320);
      return c.getContext('2d').getImageData(0,0,320,320).data;
    };
  },config);
}

export async function runInvasionScenarios(page) {
  return page.evaluate(() => {
    const rows = [];
    for (const wet of [false,true]) for (const pose of (__piConfig.scenarioStates || ['normal','jumping','fired'])) for (const side of [-1,1]) {
      __piScene(wet); game.startEvent(__piConfig.event); startWave(game.event);
      const enemies = __piSpecs.map((spec,i) => {
        spawnEventEnemy(spec.type); const e = game.entities[game.entities.length - 1];
        e.x = __piOrigin.x + __piX(i); e.y = __piOrigin.gy * TILE - e.h / 2 - 0.01 - (spec.fly ? 20 : 0);
        e.onGround = !spec.fly; e.attackCd = pose === 'fired' ? 0.001 : 0.5;
        if (spec.hop) e.timer = pose === 'jumping' ? 0 : 0.5;
        game.player.x = e.x + side * (pose === 'jumping' ? 40 : 200); game.player.y = e.y;
        __piStep(e,pose === 'jumping' ? 0 : 0.5);
        if (pose === 'jumping') for (let tick = 1; tick < 6; tick++) __piStep(e);
        return e;
      });
      game.player.x = __piOrigin.x - 90; game.player.y = __piOrigin.gy * TILE - game.player.h / 2 - 0.01;
      game.cam.x = __piOrigin.x; game.cam.y = game.player.y - 100;
      const before = __piState(), hook = CombatArt.drawEnemy; let calls = 0;
      CombatArt.drawEnemy = (...args) => { if (enemies.includes(args[2])) calls++; return hook(...args); };
      try { render(); } finally { CombatArt.drawEnemy = hook; }
      rows.push({ wet,pose,side,calls,readonly:before === __piState(),shots:game.projectiles.list.length,
        cooldowns:enemies.every((e,i) => !__piSpecs[i].shoot || Math.abs(e.attackCd - (pose === 'fired' ? __piSpecs[i].cooldown : 0.5 - (pose === 'jumping' ? 6 : 1) / 60)) < 1e-8),
        event:game.event.type === __piConfig.event && game.event.wave === 1 && game.event.pending === EVENT_WAVES[__piConfig.event].sizes[0] && game.event.minisPending === 0 && eventAliveCount() === __piSpecs.length && enemies.every(e => e.eventEnemy),
        bodies:enemies.every(e => e.w === ENT_DEF[e.type].w && e.h === ENT_DEF[e.type].h && !!e.ghost === !!ENT_DEF[e.type].ghost && !e.segments && !e.arms),
        movement:enemies.every((e,i) => __piSpecs[i].fly ? Number.isFinite(e.bob) && e.fly : e.dir === side && (pose === 'jumping' ? !e.onGround && e.vy < -1 : e.onGround && e.vy === 0)),
        noLoot:game.pickups.length === 0,noChildren:game.entities.length === __piSpecs.length });
    }
    return rows;
  });
}

// Exercise real dawn control flow, including outstanding trash/miniboss work.
export async function runMoonDawnProbe(page) {
  return page.evaluate(() => {
    const rows = [], event = __piConfig.event;
    for (const spec of __piSpecs) for (const time of [0.25,0.5,0.75]) for (const pending of [0,3]) {
      __piScene(); delete game.eventCompletions[event]; game.lanternNight.pending = false;
      delete game.lanternNight.celebrated['event:' + event];
      game.startEvent(event); startWave(game.event);
      game.event.pending = pending; game.event.minisPending = pending ? 1 : 0; game.event.t = 0;
      spawnEventEnemy(spec.type); const e = game.entities[game.entities.length - 1];
      e.x = __piOrigin.x; e.y = game.player.y - 40; game.timeOfDay = time;
      const live = __piRender(e), before = __piState(); updateEvents(1 / 60);
      const held = before === __piState() && eventAliveCount() === 1 && !game.eventCompletions[event];
      hitEntity(e,e.hp + e.def + 100,0,0,game);
      const killed = __piState(); renderGame(game,ctx2d);
      const waiting = killed === __piState() && game.event !== null && !game.eventCompletions[event] && eventAliveCount() === 0;
      updateEvents(1 / 60);
      const finished = game.event === null && game.eventCompletions[event] === true && game.entities.length === 1 && game.entities[0].dead &&
        !game.lanternNight.pending && !game.lanternNight.celebrated['event:' + event];
      const after = __piState(); renderGame(game,ctx2d);
      rows.push({ kind:spec.kind,time,pending,live,held,waiting,finished,readonly:after === __piState() });
    }
    return rows;
  });
}
