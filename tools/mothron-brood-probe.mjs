// Boss-created Baby Mothrons use real simulation records, not artwork children.
export async function runMothronBroodProbe(page) {
  return page.evaluate(() => {
    const rows = [], bosses = { ...game.bossesDefeated };
    const near = (a,b) => Math.abs(a - b) < 1e-7;
    function spawn(phase,parentEvent,roll) {
      game.spawnBoss('mothron'); const boss = game.entities.find(e => e.boss === 'mothron');
      boss.x = __piOrigin.x + 80; boss.y = game.player.y - 80; boss.hp = phase ? boss.maxHp * 0.35 : boss.maxHp;
      boss.eventEnemy = parentEvent; boss.attackTimer = 999; boss.vx = boss.vy = 0;
      const before = __piState(); renderGame(game,ctx2d); const readonly = before === __piState();
      const random = Math.random; try { Math.random = () => roll; bossStep(boss,game); } finally { Math.random = random; }
      return { boss,readonly,baby:game.entities.find(e => e.type === E.BABYMOTHRON) };
    }
    try {
      for (const phase of [false,true]) for (const parentEvent of [false,true]) for (const roll of [0,0.005999,0.006,0.999]) {
        __piScene(); const { boss,baby,readonly } = spawn(phase,parentEvent,roll), expected = phase && roll < 0.006;
        const drawn = baby ? __piRender(baby) : null, after = __piState(); renderGame(game,ctx2d);
        rows.push({ phase,parentEvent,roll,readonly:readonly && after === __piState(),drawn,
          correct:boss.phase2 === phase && game.entities.length === (expected ? 2 : 1) && !!baby === expected &&
            (!expected || near(baby.x,boss.x + roll * 40 - 20) && baby.y === boss.y + 20 && baby.eventEnemy === true && !baby.minion &&
              baby.fly && !baby.ghost && baby.w === ENT_DEF[E.BABYMOTHRON].w && baby.h === ENT_DEF[E.BABYMOTHRON].h && !baby.segments && !baby.arms) &&
            game.projectiles.list.length === 0 && game.pickups.length === 0 });
      }
      __piScene(); delete game.eventCompletions.solareclipse; game.lanternNight.pending = false; game.startEvent('solareclipse');
      game.event.wave = EVENT_WAVES.solareclipse.sizes.length; game.event.pending = game.event.minisPending = 0; game.event.state = 'spawning'; game.event.t = 0;
      const { boss,baby,readonly } = spawn(true,true,0), drawn = __piRender(baby);
      const initial = eventAliveCount() === 2;
      hitEntity(boss,boss.hp + boss.def + 100,0,0,game); updateEvents(1 / 60);
      const holds = boss.dead && !baby.dead && eventAliveCount() === 1 && game.event !== null && !game.eventCompletions.solareclipse;
      hitEntity(baby,baby.hp + baby.def + 100,0,0,game); const before = __piState(); renderGame(game,ctx2d);
      const waiting = before === __piState() && game.event !== null && !game.eventCompletions.solareclipse; updateEvents(1 / 60);
      const after = __piState(); renderGame(game,ctx2d);
      const completion = { readonly:readonly && after === __piState(),drawn,initial,holds,waiting,
        finished:game.event === null && game.eventCompletions.solareclipse === true && !game.lanternNight.pending && eventAliveCount() === 0 };
      return { rows,completion };
    } finally { game.bossesDefeated = bosses; }
  });
}
