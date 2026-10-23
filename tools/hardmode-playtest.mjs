import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
const checks = [];
const artifacts = process.env.TREE_HARDMODE_ARTIFACTS;
page.on('pageerror', error => errors.push(error.message));
await page.addInitScript(() => {
  var raf = window.requestAnimationFrame;
  window.requestAnimationFrame = function(fn) { return fn.name === 'loop' ? 0 : raf.call(window, fn); };
});
function check(name, ok, detail) {
  checks.push({ name, ok: !!ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${name}${detail === undefined ? '' : ' ' + JSON.stringify(detail)}`);
}
async function capture(name) {
  if (artifacts) await page.screenshot({ path: path.join(artifacts, name + '.png') });
}
try {
  await page.goto(pathToFileURL(path.join(process.cwd(), 'index.html')).href);
  await page.locator('#btn-new').click();
  await page.locator('#world-name').fill('Hardmode audit');
  await page.locator('input[name="evil"][value="corrupt"]').check();
  await page.locator('#btn-create').click();
  await page.waitForFunction(() => game && game.started && !document.getElementById('loading').classList.contains('overlay-visible') && game.player);
  await page.evaluate(() => {
    AudioSys.enabled = false;
    window.auditScene = function() {
      game.entities = []; game.bossBars = []; game.projectiles = makePool(500);
      game.pickups = []; game.fx = []; game.fxTexts = []; game.event = null;
      game.player.x = game.world.spawnX; game.player.y = game.world.spawnY - 100;
      game.player.vx = 0; game.player.vy = 0; game.player.dying = false;
      game.player.hp = game.player.maxHp = 500; game.player.invuln = 99999;
      game.cam.x = game.player.x; game.cam.y = game.player.y;
      game.timeOfDay = 0.85; game.spawnT = 9999; game.autosaveT = -9999;
    };
    auditScene();
    var wall = spawnWallOfFlesh(game);
    bossHit(wall, wall.hp + 100, 0, 0, game);
  });
  check('Wall defeat enables Hardmode and grants Pwnhammer', await page.evaluate(() => game.hardmode && game.world.hardmode && game.pickups.some(p => p.item === I.PWHAMMER)));

  const timerResults = await page.evaluate(() => {
    var result = {};
    var spawns = { twins:spawnTwins, golem:spawnGolem, duke:spawnDuke, cultist:spawnCultist };
    for (var key in spawns) {
      auditScene();
      var boss = spawns[key](game); if (Array.isArray(boss)) boss = boss[0];
      if (key === 'twins') { boss.phase2 = true; boss.hp = boss.maxHp * 0.3; }
      var volleys = 0, charges = 0, teleports = 0;
      var original = game.projectiles.add;
      game.projectiles.add = function(o) { volleys++; return original.call(this, o); };
      for (var f = 0; f < 1200; f++) {
        bossStep(boss, game);
        if (boss.charge > 0) charges++;
        teleports += game.fx.filter(fx => fx.type === 'teleport').length;
        game.fx = []; game.projectiles.list.length = 0;
      }
      result[key] = { shots:volleys, chargeFrames:charges, teleports:teleports,
        adds:game.entities.filter(e => e.type === E.LIHZARD).length };
    }
    return result;
  });
  check('Twins phase two actually dashes', timerResults.twins.chargeFrames > 0, timerResults.twins);
  check('Golem summons its scheduled adds', timerResults.golem.adds > 0, timerResults.golem);
  check('Duke fires bubbles between charges', timerResults.duke.shots > 0, timerResults.duke);
  check('Cultist volleys remain bounded over 20 seconds', timerResults.cultist.shots > 0 && timerResults.cultist.shots < 160, timerResults.cultist);
  check('Cultist continues teleporting', timerResults.cultist.teleports >= 8, timerResults.cultist);

  const combat = await page.evaluate(() => {
    auditScene();
    var pillar = spawnLunarPillar(game, 'solar'); pillar.shieldHp = 0; pillar.shieldDown = true;
    var hp = pillar.hp;
    var hit = projHitEnemy({ x:pillar.x, y:pillar.y, type:P.BULLET, dmg:100, owner:'player', dead:false });
    var ranged = hit && pillar.hp < hp;
    hp = pillar.hp;
    beamHitEnemies({ x:pillar.x - 100, y:pillar.y, beamEndX:pillar.x + 100, beamEndY:pillar.y, dmg:100, persistent:true });
    var beam = pillar.hp < hp;
    hp = pillar.hp;
    zoneHitEnemies({ x:pillar.x, y:pillar.y, zoneHeight:80, dmg:100, persistent:true });
    var zone = pillar.hp < hp;
    var homing = nearestEnemy(pillar.x, pillar.y) === pillar;
    var p = game.player;
    p.x = pillar.x - 30; p.y = pillar.y; p.attackCd = 0; p.swingT = 0;
    MOUSE.wx = pillar.x; MOUSE.wy = pillar.y;
    hp = pillar.hp; p.tryMelee(game, ITEMS[I.EXCALIBUR], false);
    var melee = pillar.hp < hp;
    pillar.shieldHp = 15000; pillar.shieldDown = false; hp = pillar.hp;
    projHitEnemy({ x:pillar.x, y:pillar.y, dmg:100, owner:'player', dead:false });
    var shield = pillar.hp === hp;
    auditScene();
    var destroyer = spawnDestroyer(game); hp = destroyer.hp;
    segmentHit(destroyer, destroyer.segments[0], 100, game);
    var segment = destroyer.hp === hp - 100;
    bossHit(destroyer, 50000, 0, 0, game);
    var shared = !destroyer.dead && destroyer.hp > 0;
    game.difficulty = 'master'; auditScene(); destroyer = spawnDestroyer(game); hp = destroyer.hp;
    bossHit(destroyer, 100, 0, 0, game);
    var scaled = destroyer.hp === hp - 100;
    game.difficulty = 'normal';
    return { ranged, beam, zone, homing, melee, shield, segment, shared, scaled };
  });
  for (const key of ['ranged','beam','zone','homing','melee']) check('Exposed pillar accepts ' + key + ' targeting', combat[key]);
  check('Pillar shield still blocks damage', combat.shield);
  check('Destroyer body damage updates shared HP immediately', combat.segment);
  check('Destroyer head cannot die with shared HP remaining', combat.shared);
  check('Master Destroyer keeps scaled HP after first hit', combat.scaled);

  const icons = await page.evaluate(() => {
    var ids = [I.PWHAMMER,I.MEGASHARK,I.EXCALIBUR,I.TERRABLADE,I.LASTPRISM,I.TERRAPRISMA,I.PYGMYSTAFF,I.FISHRONWINGS];
    var dom = ids.every(id => /<(img|canvas)\b/.test(itemIconHTML(ITEMS[id])));
    var c = document.createElement('canvas'); c.width = 32; c.height = 32;
    var ctx = c.getContext('2d'), texts = 0, original = ctx.fillText;
    ctx.fillText = function() { texts++; return original.apply(this, arguments); };
    var distinct = [];
    ids.forEach(id => { ctx.clearRect(0,0,32,32); drawItemIcon(ctx, ITEMS[id],16,16); distinct.push(c.toDataURL()); });
    return { dom, texts, distinct:new Set(distinct).size, count:ids.length };
  });
  check('Hardmode inventory icons use actual graphics', icons.dom, icons);
  check('Hardmode tools/staves do not fall back to letter icons', icons.texts === 0);

  await page.evaluate(() => {
    auditScene();
    var gallery = document.createElement('canvas'); gallery.id = 'audit-gallery'; gallery.width = 1280; gallery.height = 720;
    gallery.style.cssText = 'position:fixed;inset:0;z-index:999;background:#182338'; document.body.appendChild(gallery);
    var c = gallery.getContext('2d'); c.fillStyle = '#182338'; c.fillRect(0,0,1280,720);
    var spawns = [spawnQueenSlime,spawnPlantera,spawnGolem,spawnDuke,spawnEmpress,spawnMoonLord];
    spawns.forEach(function(spawn, i) {
      var boss = spawn(game); boss.x = 0; boss.y = 0;
      var x = 210 + (i % 3) * 425, y = 170 + Math.floor(i / 3) * 340;
      c.fillStyle = '#fff'; c.font = '18px sans-serif'; c.fillText(boss.name, x - 70, y - 125);
      c.save(); c.translate(x,y); c.scale(1.7,1.7);
      drawBoss(game,c,boss,{x:0,y:0},0,0); c.restore();
    });
  });
  await capture('boss-gallery');
  await page.evaluate(() => document.getElementById('audit-gallery').remove());

  await page.evaluate(() => { game.lunarPillars = []; game.pillarsSpawned = false; game.pillarsDestroyed = 0; });

  // Accelerated encounter route: invulnerable test player and fast finishing hits, real simulation/reward hooks.
  for (const id of ['twins','destroyer','skeletronprime','queenslime','plantera','golem','duke','empress','cultist']) {
    const outcome = await page.evaluate(id => {
      auditScene(); game.spawnBoss(id);
      var bosses = game.entities.filter(e => e.boss && !e.armType);
      var finite = true;
      for (var f = 0; f < 360; f++) {
        game.player.invuln = 99999;
        if (f === 180) bosses.forEach(e => { e.hp = e.maxHp * 0.35; });
        step(1/60);
        finite = finite && game.entities.every(e => Number.isFinite(e.x) && Number.isFinite(e.y) && Number.isFinite(e.hp));
        if (f % 60 === 0) render();
      }
      var transform = ctx2d.getTransform();
      bosses.forEach(e => game.hitBoss(e, e.maxHp * 10, 0, 0));
      updateBossBars();
      return { finite, drawn:transform.isIdentity, completed:!!game.bossesDefeated[id === 'skeletronprime' ? 'skelprime' : id],
        loot:game.pickups.every(p => ITEMS[p.item]), mechDone:game.mechDone };
    }, id);
    check(id + ': both phases simulate/render and defeat cleanly', outcome.finite && outcome.drawn && outcome.completed && outcome.loot, outcome);
  }
  check('All-mechanical gate unlocks', await page.evaluate(() => !!game.mechDone));
  check('Cultist defeat creates four pillars', await page.evaluate(() => game.lunarPillars.filter(e => !e.dead).length === 4));
  const ending = await page.evaluate(() => {
    game.lunarPillars.forEach(pillar => {
      for (var i = 0; i < 50; i++) game.onEnemyKilled({type:pillar.pillarEnemies[0], x:pillar.x, y:pillar.y});
      projHitEnemy({x:pillar.x,y:pillar.y,dmg:1000000,owner:'player',dead:false});
    });
    var pillars = game.pillarsDestroyed === 4;
    if (!pillars) return { pillars, victory:false };
    auditScene(); var moon = spawnMoonLord(game);
    for (var f = 0; f < 360; f++) { if(f===180) moon.hp = moon.maxHp * 0.3; step(1/60); if(f%60===0) render(); }
    game.hitBoss(moon, moon.maxHp * 10, 0, 0); render();
    return { pillars, victory:game.victory, loot:game.pickups.some(p => p.item === I.LASTPRISM) };
  });
  check('Pillar kills via projectile unlock final progression', ending.pillars, ending);
  check('Moon Lord phases, reward and victory route', ending.victory && ending.loot);
  await capture('final-route');
  check('No uncaught browser errors', errors.length === 0, errors);
} finally {
  await browser.close();
}
const failed = checks.filter(c => !c.ok).length;
console.log(`${checks.length - failed} PASS / ${failed} FAIL / ${checks.length} TOTAL`);
process.exitCode = failed ? 1 : 0;
