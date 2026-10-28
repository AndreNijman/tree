// Real progression and daylight control flow, never edits to event tables/AI.
export async function runEclipseEventProbe(page) {
  return page.evaluate(() => {
    const gates = [], daylight = [], bosses = { ...game.bossesDefeated }, mechDone = game.mechDone;
    const base = [E.FRANKENSTEIN,E.SWAMPTHING,E.CREATUREFROMDEEP,E.FRITZ];
    try {
      for (let mask = 0; mask < 8; mask++) for (const all of [false,true]) for (const plantera of [false,true]) {
        __piScene(); Object.assign(game.bossesDefeated,{ twins:!!(mask & 1),destroyer:!!(mask & 2),skelprime:!!(mask & 4),plantera }); game.mechDone = all;
        const expected = base.concat(mask ? [E.EYEBALL,E.VAMPIRE,E.POSSESSED] : [],all ? [E.REAPER] : [],
          plantera ? [E.BUTCHER,E.DEADLYSPHERE,E.DRMANFLY,E.NAILHEAD,E.PSYCHO,E.BABYMOTHRON] : []);
        const pool = eventTrashPool(EVENT_WAVES.solareclipse), mini = eventMiniPool(EVENT_WAVES.solareclipse);
        game.startEvent('solareclipse'); game.event.wave = EVENT_WAVES.solareclipse.sizes.length - 1; startWave(game.event);
        const pending = game.event.pending, before = __piState(); renderGame(game,ctx2d); const readonly = before === __piState();
        const scheduled = game.event.minisPending === (plantera ? 1 : 0);
        const random = Math.random; try { Math.random = () => 0; updateEvents(1 / 60); } finally { Math.random = random; }
        const after = __piState(); renderGame(game,ctx2d);
        gates.push({ mask,all,plantera,readonly:readonly && after === __piState(),correct:JSON.stringify(pool) === JSON.stringify(expected) &&
          JSON.stringify(mini) === JSON.stringify(plantera ? ['mothron'] : []) && scheduled && game.event.pending === pending - 1 && game.entities.length === 1 &&
          game.entities[0].eventEnemy && (plantera ? game.entities[0].boss === 'mothron' && game.event.minisPending === 0 : game.entities[0].type === E.FRANKENSTEIN && !game.entities[0].boss) });
      }
      for (const spec of __piSpecs) for (const time of [0.2499,0.25,0.75,0.7501]) for (const pending of [0,3]) {
        __piScene(); delete game.eventCompletions.solareclipse; game.lanternNight.pending = false;
        game.startEvent('solareclipse'); startWave(game.event);
        const e = __piEnemy(spec); e.eventEnemy = true;
        game.event.state = 'wave'; game.event.t = 0; game.event.pending = pending; game.event.minisPending = pending ? 1 : 0; game.timeOfDay = time;
        const live = __piRender(e), alive = !e.dead && eventAliveCount() === 1, day = time >= 0.25 && time <= 0.75;
        updateEvents(1 / 60); const before = __piState(); renderGame(game,ctx2d);
        daylight.push({ kind:spec.kind,time,pending,live,readonly:before === __piState(),correct:alive && !e.dead && eventAliveCount() === 1 && game.entities.length === 1 &&
          (day ? game.event?.type === 'solareclipse' && !game.eventCompletions.solareclipse && game.event.pending === pending : game.event === null && game.eventCompletions.solareclipse === true) && !game.lanternNight.pending });
      }
    } finally { game.bossesDefeated = bosses; game.mechDone = mechDone; }
    return { gates,daylight };
  });
}
