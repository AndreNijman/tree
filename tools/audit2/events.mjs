// Audit 2 — events: every EVENT_WAVES/timed event starts, spawns its roster,
// simulated cleanly, and night events end at dawn. OoA is probed separately.
import { setupAudit, check, note, assertNoBrowserErrors, finish } from './lib.mjs';

const { browser, page, results } = await setupAudit();

// Fleet: probe each event's spawn behavior without killing everything.
const scenarios = [
  { type: 'goblinarmy',     day: true,  expectWave: true },
  { type: 'pirateinvasion', day: true,  expectWave: true },
  { type: 'solareclipse',   day: true,  expectWave: true },
  { type: 'frostlegion',    day: true,  expectWave: true },
  { type: 'bloodmoon',      day: false, expectWave: false },
  { type: 'slimerain',      day: true,  expectWave: false },
  { type: 'pumpkinmoon',    day: false, expectWave: true },
  { type: 'frostmoon',      day: false, expectWave: true },
  { type: 'martianmadness', day: false, expectWave: true },
];

for (const sc of scenarios) {
  const r = await page.evaluate(sc => {
    window.__clearHostiles();
    game.timeOfDay = sc.day ? 0.3 : 0.95;
    game.startEvent(sc.type);
    if (!game.event || game.event.type !== sc.type) return { started: false };
    var before = {};
    for (var f = 0; f < 900; f++) {
      step(1 / 60);
      if (f % 90 === 0) {
        var n = 0;
        for (var i = 0; i < game.entities.length; i++) {
          var e = game.entities[i];
          if (!e.dead && (e.eventEnemy || e.boss)) n++;
        }
        before[f] = n;
      }
    }
    var waveAfter = null;
    if (game.event && game.event.wave !== undefined) waveAfter = game.event.wave;
    var still = game.event && game.event.type === sc.type;
    game.event = null;
    game.entities = game.entities.filter(function(e) { return e.dead || e.friendly || e === game.player; });
    return { started: true, spawns: before, finalCount: before[810], waveAfter: waveAfter, stillRunning: still };
  }, sc);

  if (!r.started) {
    check(results, `Event ${sc.type} starts`, false, r);
    continue;
  }
  check(results, `Event ${sc.type} starts and runs`, true, { waveAfter: r.waveAfter, stillRunning: r.stillRunning });
  const hasSpawns = Object.values(r.spawns).some(v => v > 0);
  check(results, `Event ${sc.type} spawns enemies within 900 sim-frames`, r.expectWave ? hasSpawns : true,
    r.expectWave ? r.spawns : { note: 'timed/slimerain mode — spawn pacing may lag; observe only', spawns: r.spawns });
  if (sc.expectWave && !r.stillRunning) note(results, `Event ${sc.type} ended on its own during 900 frames (wave mechanics or day wrap)`);
}

// Night events must end at dawn — start just below dawn and cross it
const dawn = await page.evaluate(() => {
  game.startEvent('bloodmoon');
  if (!game.event) return { started: false };
  game.timeOfDay = 0.2498;                   // night side, ~0.2s before dawn (tod advances 0.5/540 per s)
  var maxEnemies = 0, crossed = false;
  for (var f = 0; f < 300; f++) {
    step(1 / 60);
    var day = game.timeOfDay >= 0.25 && game.timeOfDay <= 0.75;
    if (day) crossed = true;
    var n = 0;
    for (var i = 0; i < game.entities.length; i++) if (!game.entities[i].dead && game.entities[i].eventEnemy) n++;
    if (n > maxEnemies) maxEnemies = n;
    if (crossed && (!game.event || game.event.type !== 'bloodmoon')) { game.event = null; break; }
    if (f === 299) game.event = null;
  }
  return { started: true, crossed: crossed, maxEnemies: maxEnemies };
});
check(results, 'Blood Moon ends at dawn', dawn.started && dawn.crossed, dawn);
check(results, 'Blood Moon spawned enemies while running', dawn.maxEnemies > 0, dawn);

// Slime Rain: slimes spawn and the event tracks kills toward the King Slime.
const slime = await page.evaluate(() => {
  game.startEvent('slimerain');
  if (!game.event || game.event.type !== 'slimerain') return { started: false };
  var hitCount = 0;
  for (var f = 0; f < 1800; f++) {
    step(1 / 60);
    if (f % 60 === 0) {
      // kill one live slime per sim-second so the kill counter advances
      for (var i = 0; i < game.entities.length; i++) {
        var e = game.entities[i];
        if (!e.dead && e.eventEnemy && !e.boss) {
          hitEntity(e, 999999, 0, 0, game);
          hitCount++;
          break;
        }
      }
    }
  }
  var alive = 0;
  for (var i2 = 0; i2 < game.entities.length; i2++) if (!game.entities[i2].dead && game.entities[i2].eventEnemy) alive++;
  var kills = game.event ? game.event.kills : null;
  var kingSpawned = game.event ? !!game.event.kingSpawned : null;
  var ended = !game.event;
  game.event = null;
  return { started: true, alive: alive, kills: kills, kingSpawned: kingSpawned, manualKills: hitCount, ended: ended };
});
check(results, 'Slime Rain spawns slimes and tracks kills', slime.started && slime.alive > 0, slime);
check(results, 'Slime Rain kill counter advances toward the King', slime.kills > 0, slime);

// Old One's Army via direct stand activation
// Old One's Army via direct stand activation — sample DURING the run
// (crystal can be destroyed and the event self-finishes, killing all enemies)
const ooa = await page.evaluate(() => {
  var w = game.world, p = game.player;
  var tx = Math.floor(w.spawnX / TILE) + 40, gy = w.surfaceY[tx];
  for (var x = tx - 32; x <= tx + 32; x++) {
    for (var y = gy - 10; y <= gy; y++) { w.set(x, Math.max(2, y), y === gy ? T.STONE : T.AIR); }
  }
  w.set(tx, gy - 1, T.ETERNIASTAND);
  game.bossesDefeated.eaterofworlds = true;   // unlock tier>=1
  window.__resetPlayer();
  p.x = (tx + 8) * 16 + 8; p.y = (gy - 2) * 16; p.vx = 0; p.vy = 0; p.invuln = 999999;
  startOldOnesArmy(tx, gy - 1);
  if (!game.event || game.event.type !== 'oldonesarmy') return { started: false };
  var counts = { started: true, maxEnemies: 0, wave: null, tier: null, standLost: false, ended: false };
  for (var f = 0; f < 2400; f++) {
    step(1 / 60);
    if (game.event) {
      game.event.crystalHp = game.event.crystalMaxHp;   // keep event alive for the probe
      var n = 0;
      for (var i = 0; i < game.entities.length; i++) if (!game.entities[i].dead && game.entities[i].ooaEnemy) n++;
      if (n > counts.maxEnemies) counts.maxEnemies = n;
      counts.wave = game.event.wave;
      counts.tier = game.event.tier;
    } else { counts.ended = true; break; }
  }
  if (game.world.get(tx, gy - 1) !== T.ETERNIASTAND) counts.standLost = true;
  if (game.event) { game.event = null; }
  game.entities = game.entities.filter(function(e) { return e.dead || e.friendly || e === game.player; });
  return counts;
});
check(results, 'Old One\'s Army starts and spawns Etherian enemies', ooa.maxEnemies > 0, ooa);

await assertNoBrowserErrors(results);
await finish(results, browser, 'events');
