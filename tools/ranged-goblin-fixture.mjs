// Disposable browser fixtures shared by file and real-HTTP artwork probes.
export async function installRangedGoblinFixture(page) {
  await page.evaluate(() => {
    game.paused = true; game.weather.active = false; game.event = null;
    const w = game.world, tx = Math.floor(w.spawnX / TILE), gy = Math.min(w.H - 10,w.hellY + 12);
    for (let x = tx - 45; x <= tx + 45; x++) {
      for (let y = gy - 35; y < gy; y++) { w.set(x,y,T.AIR); w.setWall(x,y,WALL.CAVE); }
      w.set(x,gy,T.STONE); if ((x - tx) % 6 === 0) w.set(x,gy - 4,T.TORCH);
    }
    window.__rgOrigin = { tx,gy,x:tx * TILE + 8 };
    window.__rgSpecs = [
      { kind:'goblinarcher',type:E.GOBLINARCHER,range:360,cooldown:2.2,speed:6,damage:18,offset:12,life:3,projectile:P.ARROW },
      { kind:'goblinsorcerer',type:E.GOBLINSORCERER,range:520,cooldown:2.3,speed:4.5,damage:24,offset:10,life:4,projectile:P.MAGICBOLT,color:'#8fe05a' },
      { kind:'goblinsummoner',type:E.GOBLINSUMMONER,range:480,cooldown:2.4,speed:4.2,damage:46,offset:0,life:5,projectile:P.MAGICBOLT,color:'#c85cff' }
    ];
    window.__rgScene = function(wet = false,hardmode = true) {
      for (let x = tx - 42; x <= tx + 42; x++) for (let y = gy - 4; y < gy; y++) w.set(x,y,wet ? T.WATER : T.AIR);
      game.entities = []; game.bossBars = []; game.projectiles.list = []; game.fx = []; game.fxTexts = []; game.pickups = [];
      game.event = null; game.hardmode = hardmode; game.flashT = game.shakeT = 0;
      const p = game.player; p.x = __rgOrigin.x - 120; p.y = gy * TILE - p.h / 2 - 0.01;
      p.vx = p.vy = 0; p.onGround = true; p.invuln = 999; p.hp = p.maxHp = 1000; p.dying = false; p.respawnT = 0;
      game.cam.x = __rgOrigin.x; game.cam.y = p.y - 100; game.timeOfDay = 0.5;
      document.getElementById('screenflash').style.display = 'none'; document.getElementById('deathscreen').classList.add('hidden');
      document.getElementById('message').style.display = 'none'; document.getElementById('interact').style.display = 'none';
    };
    window.__rgEnemy = function(spec) {
      const e = spawnEntity(game,spec.type,__rgOrigin.x,gy * TILE - ENT_DEF[spec.type].h / 2 - 0.01);
      e.onGround = !e.ghost; if (e.ghost) e.y -= 55;
      return e;
    };
    window.__rgTerrain = function() {
      function hash(a) { let h = 2166136261; for (let i = 0; i < a.length; i++) h = Math.imul(h ^ a[i],16777619); return h >>> 0; }
      return [w.tiles,w.walls,w.hp,w.surfaceY].map(hash).concat([Array.from(w.liquidQueue || []).join(',')]);
    };
    window.__rgState = function() {
      return JSON.stringify({ player:game.player,entities:game.entities,projectiles:game.projectiles.list,bars:game.bossBars,progress:game.bossesDefeated,
        event:game.event,hardmode:game.hardmode,eventCompletions:game.eventCompletions,fx:game.fx,texts:game.fxTexts,pickups:game.pickups,
        flash:game.flashT,kills:game.kills,bestiary:game.bestiary,lantern:game.lanternNight,achievements:game.achievements,remote:Net.remotePlayers,terrain:__rgTerrain() });
    };
    window.__rgStep = function(e,roll = 0.5) { const random = Math.random; try { Math.random = () => roll; enemyStep(e,game); } finally { Math.random = random; } };
    window.__rgRender = function(e) {
      game.cam.x = e.x; game.cam.y = e.y - 50;
      const before = __rgState(), hook = CombatArt.drawEnemy, random = Math.random; let calls = 0, rng = 0;
      CombatArt.drawEnemy = (...args) => {
        if (args[2] === e) calls++;
        // Existing camera shake may use RNG outside the artwork hook.
        Math.random = () => { rng++; return 0.5; };
        try { return hook(...args); } finally { Math.random = random; }
      };
      try { for (let f = 0; f < 2; f++) renderGame(game,ctx2d); }
      finally { CombatArt.drawEnemy = hook; Math.random = random; }
      return { calls,readonly:before === __rgState(),rng };
    };
    window.__rgPixels = function(e) {
      const c = document.createElement('canvas'); c.width = c.height = 320;
      CombatArt.drawEnemy(c.getContext('2d'),game,e,{ x:e.x,y:e.y },320,320);
      return c.getContext('2d').getImageData(0,0,320,320).data;
    };
  });
}

export async function runRangedGoblinHttpScenarios(page) {
  return page.evaluate(() => {
    const rows = [];
    for (const wet of [false,true]) for (const shooting of [false,true]) for (const side of [-1,1]) {
      __rgScene(wet); game.startEvent('goblinarmy'); startWave(game.event);
      const enemies = __rgSpecs.map((spec,i) => {
        spawnEventEnemy(spec.type); const e = game.entities[game.entities.length - 1];
        e.x = __rgOrigin.x + [-240,0,240][i]; e.y = __rgOrigin.gy * TILE - e.h / 2 - 0.01 - (e.ghost ? 55 : 0);
        e.onGround = !e.ghost; e.attackCd = shooting ? 0.001 : 0.5;
        game.player.x = e.x + side * 200; game.player.y = e.y; __rgStep(e);
        return e;
      });
      game.player.x = __rgOrigin.x; game.player.y = __rgOrigin.gy * TILE - game.player.h / 2 - 0.01;
      game.cam.x = __rgOrigin.x; game.cam.y = game.player.y - 100;
      const before = __rgState(), hook = CombatArt.drawEnemy; let calls = 0;
      CombatArt.drawEnemy = (...args) => { if (enemies.includes(args[2])) calls++; return hook(...args); };
      try { render(); } finally { CombatArt.drawEnemy = hook; }
      rows.push({ wet,shooting,side,calls,readonly:before === __rgState(),shots:game.projectiles.list.length,
        cooldowns:enemies.every((e,i) => Math.abs(e.attackCd - (shooting ? __rgSpecs[i].cooldown : 0.5 - 1 / 60)) < 1e-8),
        event:game.event.wave === 1 && game.event.pending === 8 && eventAliveCount() === 3 && enemies.every(e => e.eventEnemy),
        bodies:enemies.every(e => e.w === ENT_DEF[e.type].w && e.h === ENT_DEF[e.type].h && !!e.ghost === !!ENT_DEF[e.type].ghost && !e.segments && !e.arms),
        noLoot:game.pickups.length === 0,noSummons:game.entities.length === 3 });
    }
    return rows;
  });
}
