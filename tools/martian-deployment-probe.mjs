// Independent real-AI checks reused by file and HTTP infantry probes.
export async function runMartianDeploymentProbe(page) {
  return page.evaluate(() => {
    const rows = [], spec = __piSpecs.find(s => s.type === E.MARTIANENGINEER) || { kind:'martianengineer',type:E.MARTIANENGINEER };
    for (const eventEnemy of [false,true]) for (const side of [-1,1]) for (const live of [0,1,2]) for (const initial of [undefined,0,0.001]) {
      __piScene(); const e = __piEnemy(spec); e.eventEnemy = eventEnemy; e.attackCd = 999;
      if (initial !== undefined) e.deployCd = initial;
      game.player.x = e.x + side * 200; game.player.y = e.y;
      for (let i = 0; i < live; i++) spawnEntity(game,E.TESLATURRET,e.x - 100 - i * 32,e.y);
      const dead = spawnEntity(game,E.TESLATURRET,e.x - 140,e.y); dead.dead = true;
      const before = __piState(); for (let i = 0; i < 3; i++) renderGame(game,ctx2d);
      const readyReadonly = before === __piState(), count = game.entities.length;
      __piStep(e); const children = game.entities.slice(count), fires = initial !== undefined, expected = fires && live < 2;
      const drawn = __piRender(e), placed = children[0];
      rows.push({ eventEnemy,side,live,initial,readyReadonly,drawn,
        count:children.length === (expected ? 1 : 0) && game.entities.filter(t => t.type === E.TESLATURRET && !t.dead).length === live + (expected ? 1 : 0),
        cooldown:Math.abs(e.deployCd - (fires ? 8 : 4 - 1 / 60)) < 1e-7,
        placement:!expected || placed.type === E.TESLATURRET && Math.abs(placed.x - e.x - e.dir * 28) < 1e-7 && placed.y === e.y &&
          placed.eventEnemy === eventEnemy && placed.w === ENT_DEF[E.TESLATURRET].w && placed.h === ENT_DEF[E.TESLATURRET].h && !placed.segments && !placed.arms && !placed.minion,
        noShots:game.projectiles.list.length === 0,noLoot:game.pickups.length === 0 });
    }
    // An actual deployed event turret must keep the invasion alive after its engineer dies.
    __piScene(); delete game.eventCompletions.martianmadness; game.lanternNight.pending = false;
    game.startEvent('martianmadness'); startWave(game.event);
    const e = __piEnemy(spec); e.eventEnemy = true; e.attackCd = 999; e.deployCd = 0;
    game.player.x = e.x + 200; game.player.y = e.y; __piStep(e);
    const turret = game.entities.find(t => t.type === E.TESLATURRET && !t.dead);
    game.event.wave = EVENT_WAVES.martianmadness.sizes.length; game.event.pending = game.event.minisPending = 0;
    hitEntity(e,e.hp + e.def + 100,0,0,game); updateEvents(1 / 60);
    const held = !!game.event && !game.eventCompletions.martianmadness && eventAliveCount() === 1 && !!turret.eventEnemy;
    const before = __piState(); renderGame(game,ctx2d); const waiting = before === __piState() && !!game.event;
    hitEntity(turret,turret.hp + turret.def + 100,0,0,game); updateEvents(1 / 60);
    const after = __piState(); renderGame(game,ctx2d);
    const completion = { held,waiting,readonly:after === __piState(),finished:game.event === null && game.eventCompletions.martianmadness && game.lanternNight.pending };

    __piScene(); game.startEvent('martianmadness'); game.event.wave = EVENT_WAVES.martianmadness.sizes.length - 1; startWave(game.event);
    const pending = game.event.pending, mini = game.event.minisPending, ready = __piState(); renderGame(game,ctx2d);
    const readonly = ready === __piState(); game.event.t = 0; updateEvents(1 / 60);
    const saucer = game.entities.find(q => q.boss === 'martiansaucer'), spawned = __piState(); renderGame(game,ctx2d);
    const miniboss = { readonly:readonly && spawned === __piState(),correct:mini === 1 && game.event.minisPending === 0 && game.event.pending === pending - 1 && !!saucer && saucer.eventEnemy };
    return { rows,completion,miniboss };
  });
}
