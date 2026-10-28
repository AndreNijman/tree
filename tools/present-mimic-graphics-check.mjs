import { mkdirSync, writeFileSync } from 'node:fs';
import { setupAudit, check, assertNoBrowserErrors, finish } from './audit2/lib.mjs';
import { presentMimicArt } from './invasion-art-rosters.mjs';
import { installPresentMimicFixture, runPresentMimicProbe, runPresentMimicScenarios } from './present-mimic-fixture.mjs';
import { runMoonDawnProbe } from './invasion-art-fixture.mjs';

const { browser,page,results } = await setupAudit();
await installPresentMimicFixture(page,presentMimicArt);
const sources = await page.evaluate(() => {
  const bytes = (f,a,flash) => CombatArt.enemySprite('presentmimic',f,a,flash).getContext('2d').getImageData(0,0,96,96).data;
  let total = 0, crisp = true, margins = true, masks = true, inked = 0; const frames = [new Set(),new Set()];
  for (const active of [false,true]) for (let frame = 0; frame < 4; frame++) {
    const a = bytes(frame,active,false), b = bytes(frame,active,true); let ink = false;
    for (let y = 0; y < 96; y++) for (let x = 0; x < 96; x++) {
      const i = (y * 96 + x) * 4, alpha = a[i + 3];
      if (alpha) { ink = true; if (x < 2 || y < 2 || x >= 94 || y >= 94) margins = false; }
      if (![0,255].includes(alpha) || ![0,255].includes(b[i + 3])) crisp = false;
      if (alpha !== b[i + 3] || alpha && (b[i] !== 255 || b[i + 1] !== 245 || b[i + 2] !== 220)) masks = false;
    }
    total += 2; if (ink) inked += 2; frames[+active].add(Array.from(a).join(','));
  }
  const original = Array.from(bytes(0,false,false)), asleep = bytes(0,false,false), awake = bytes(0,true,false);
  for (const boss of ['kingslime','eyeofcthulhu','brainofcthulhu','queenbee','skeletron','wallofflesh','retinazer','spazmatism','destroyer','skelprime','queenslime','plantera','golem','duke','empress','moonlord','cultist']) {
    for (const phase of [false,true]) for (let f = 0; f < 4; f++) for (const flash of [false,true]) CombatArt.bossSprite(boss,phase,f,flash);
  }
  return { total,inked,crisp,margins,masks,frames:frames.map(s => s.size),distinct:asleep.some((v,i) => i % 4 === 3 && v !== awake[i]),stable:bytes(0,false,false).every((v,i) => v === original[i]) };
});
check(results,'Present Mimic source variants are crisp, nonempty and unclipped',sources.total === 16 && sources.inked === 16 && sources.crisp && sources.margins,sources);
check(results,'Closed wrapping and awake mouth have distinct silhouettes and animate',sources.distinct && sources.frames.every(n => n >= 2),sources);
check(results,'Exact flash masks and bounded-cache regeneration remain intact',sources.masks && sources.stable);
const probe = await runPresentMimicProbe(page);
const labels = {
  wake:'Strict radial 140-pixel wake boundaries remain simulation-owned',readiness:'Awake charge readiness retains zero defaults, speed nine and 2.4-second cooldown',
  locked:'Charge target stays locked and expires only after its final movement tick',physics:'Sleeping/awake gravity, ordinary collision and direct charge ordering remain unchanged',
  contacts:'Normal/Expert/Master contacts retain invulnerability and cooldown',loot:'Real kills retain two Ectoplasm, canonical coins and extended rare entries',
  targeting:'Only the nearest living multiplayer target wakes the Mimic',events:'Last kill, completion and all three miniboss spawns remain event-owned'
};
for (const [key,label] of Object.entries(labels)) check(results,label,probe[key].length > 0 && probe[key].every(s => s.correct && (s.calls === undefined || s.calls === 2 && s.readonly && s.rng === 0)),probe[key].filter(s => !s.correct || s.calls !== undefined && (!s.readonly || s.rng)));
const presentation = await page.evaluate(() => {
  const rows = [], c = document.createElement('canvas'); c.width = c.height = 320; const ctx = c.getContext('2d');
  for (const awake of [false,true]) for (const side of [-1,1]) for (const cd of [undefined,0,999]) {
    __piScene(); const e = __piEnemy(__piSpecs[0]); e.awake = awake; e.dir = side; e.vx = -side * 4; e.attackCd = cd;
    game.player.x = e.x - side * 200;
    const before = __piState(), random = Math.random; let rng = 0;
    try { Math.random = () => { rng++; return 0.5; }; ctx.clearRect(0,0,320,320); CombatArt.drawEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320); } finally { Math.random = random; }
    const pixels = ctx.getImageData(0,0,320,320).data;
    ctx.clearRect(0,0,320,320); ctx.save(); ctx.translate(160,160); if (side < 0) ctx.scale(-1,1);
    ctx.drawImage(CombatArt.enemySprite('presentmimic',Math.floor(Time.seconds * 10) % 4,awake,false),-48,-48); ctx.restore();
    const expected = ctx.getImageData(0,0,320,320).data;
    rows.push({ awake,side,cd,exact:pixels.every((v,i) => v === expected[i]),readonly:before === __piState(),rng });
  }
  ctx.translate(4,6); ctx.scale(0.7,0.8); ctx.globalAlpha = 0.6; ctx.imageSmoothingEnabled = true;
  const state = () => { const m = ctx.getTransform(); return JSON.stringify([m.a,m.b,m.c,m.d,m.e,m.f,ctx.globalAlpha,ctx.imageSmoothingEnabled,ctx.globalCompositeOperation,ctx.fillStyle,ctx.strokeStyle]); };
  const before = state(); CombatArt.drawEnemy(ctx,game,game.entities[0],{ x:game.entities[0].x,y:game.entities[0].y },320,320);
  const fallback = [E.MIMIC,E.HALLOWEDMIMIC,E.CORRUPTMIMIC,E.CRIMSONMIMIC,E.ICEGOLEM,-999].every(type => !CombatArt.drawEnemy(ctx,game,{ type },{ x:0,y:0 },320,320));
  const protectedHooks = [{ boss:'pumpking' },{ minion:'pirate' },{ ooaEnemy:true },{ ooaSentry:true }].every(flags => !CombatArt.drawEnemy(ctx,game,{ type:E.PRESENTMIMIC,...flags },{ x:0,y:0 },320,320));
  return { rows,restored:before === state(),fallback,protectedHooks };
});
check(results,'Only awake state selects mouth art; facing ignores contrary player and velocity',presentation.rows.every(s => s.exact && s.readonly && s.rng === 0),presentation);
check(results,'Drawing restores context and preserves ordinary/biome Mimic fallbacks',presentation.restored && presentation.fallback && presentation.protectedHooks,presentation);
const dawn = await runMoonDawnProbe(page);
check(results,'Dawn holds living Mimics and only event updates end the event without Lantern Night',dawn.length === 6 && dawn.every(s => s.live.calls === 2 && s.live.readonly && s.live.rng === 0 && s.held && s.waiting && s.finished && s.readonly),dawn);
const scenarios = await runPresentMimicScenarios(page);
check(results,'Twelve sleeping/awake/charging wet/dry side scenarios are read-only',scenarios.length === 12 && scenarios.every(s => s.calls === 1 && s.readonly && s.shots === 0 && s.cooldowns && s.event && s.bodies && s.movement && s.noLoot && s.noChildren),scenarios);
const roster = await page.evaluate(() => {
  __piScene(); const c = document.createElement('canvas'); c.width = c.height = 320; const ctx = c.getContext('2d'), before = __piState();
  const rows = EVENT_WAVES.frostmoon.trash.map(type => { const e = makeEntity(type,0,0), state = JSON.stringify(e); ctx.clearRect(0,0,320,320);
    const supported = CombatArt.drawEnemy(ctx,game,e,{ x:0,y:0 },320,320);
    return { type,supported,readonly:state === JSON.stringify(e),single:!e.segments && !e.arms,visible:ctx.getImageData(0,0,320,320).data.some((v,i) => i % 4 === 3 && v) };
  }); return { rows,readonly:before === __piState(),unique:new Set(EVENT_WAVES.frostmoon.trash).size };
});
check(results,'All nine real Frost Moon trash types now draw original single-body artwork',roster.unique === 9 && roster.rows.length === 9 && roster.readonly && roster.rows.every(s => s.supported && s.readonly && s.single && s.visible),roster);
const dir = 'test-results/graphics/present-mimic'; mkdirSync(dir,{ recursive:true });
const sheet = await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 768; c.height = 400; const ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0,0,768,400); ctx.font = '18px monospace'; ctx.fillStyle = '#ecd49e'; ctx.fillText('TREE / Present Mimic',20,30);
  for (const awake of [false,true]) { ctx.drawImage(CombatArt.enemySprite('presentmimic',1,awake,false),awake ? 400 : 40,45,288,288); ctx.fillText(awake ? 'awake mouth' : 'closed wrapping',awake ? 420 : 60,365); }
  return c.toDataURL('image/png'); });
writeFileSync(dir + '/present-mimic-artwork.png',Buffer.from(sheet.split(',')[1],'base64'));
for (const pose of presentMimicArt.scenarioStates) {
  await page.evaluate(pose => { const e = __pmPose(pose); game.player.x = e.x - 100; game.player.y = __piOrigin.gy * TILE - game.player.h / 2 - 0.01;
    updateHud(); window.__pmHook = CombatArt.drawEnemy; CombatArt.drawEnemy = () => false; render(); },pose);
  await page.screenshot({ path:dir + '/' + pose + '-before.png' });
  await page.evaluate(() => { CombatArt.drawEnemy = __pmHook; delete window.__pmHook; render(); });
  await page.screenshot({ path:dir + '/' + pose + '-after.png' });
}
writeFileSync(dir + '/index.html',`<!doctype html><meta charset="utf-8"><title>Present Mimic artwork</title><style>body{background:#202534;color:#dedbc9;font:16px monospace;max-width:1440px;margin:24px auto}img{width:100%;image-rendering:pixelated}.row{display:flex;gap:16px}figure{margin:8px 0;flex:1}</style><h1>Present Mimic</h1><p>Original artwork; one real AI tick in each disposable sleeping/awake/charging fixture. Room, targets, HP and readiness are fixtures, not gameplay changes.</p><img src="present-mimic-artwork.png" alt="Closed and awake source sprites">${presentMimicArt.scenarioStates.map(pose => `<h2>${pose}</h2><div class="row"><figure><img src="${pose}-before.png" alt="Legacy ${pose}"><figcaption>Before — only general-enemy artwork disabled</figcaption></figure><figure><img src="${pose}-after.png" alt="New ${pose}"><figcaption>After — same combat state</figcaption></figure></div>`).join('')}`);
await assertNoBrowserErrors(results);
await finish(results,browser,'present-mimic-graphics',{ sources,probe,presentation,dawn,scenarios,roster });
