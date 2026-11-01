import { mkdirSync, writeFileSync } from 'node:fs';
import { setupAudit, check, assertNoBrowserErrors, finish } from './audit2/lib.mjs';
import { vampireArt } from './invasion-art-rosters.mjs';
import { installVampireFixture, runVampireProbe, runVampireScenarios } from './vampire-fixture.mjs';
import { runEclipseEventProbe } from './eclipse-event-probe.mjs';

const { browser,page,results } = await setupAudit();
await installVampireFixture(page,vampireArt);
const sources = await page.evaluate(() => {
  const bytes = (f,a,flash) => CombatArt.enemySprite('vampire',f,a,flash).getContext('2d').getImageData(0,0,96,96).data;
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
  const original = Array.from(bytes(0,false,false)), normal = bytes(0,false,false), active = bytes(0,true,false);
  for (const boss of ['kingslime','eyeofcthulhu','brainofcthulhu','queenbee','skeletron','wallofflesh','retinazer','spazmatism','destroyer','skelprime','queenslime','plantera','golem','duke','empress','moonlord','cultist']) {
    for (const phase of [false,true]) for (let f = 0; f < 4; f++) for (const flash of [false,true]) CombatArt.bossSprite(boss,phase,f,flash);
  }
  return { total,inked,crisp,margins,masks,frames:frames.map(s => s.size),distinct:normal.some((v,i) => i % 4 === 3 && v !== active[i]),stable:bytes(0,false,false).every((v,i) => v === original[i]) };
});
check(results,'Vampire source variants are crisp, nonempty and unclipped',sources.total === 16 && sources.inked === 16 && sources.crisp && sources.margins,sources);
check(results,'Bat-shaped cloak animates with a distinct bounded launch pose',sources.distinct && sources.frames.every(n => n >= 2),sources);
check(results,'Exact flash masks and bounded-cache regeneration remain intact',sources.masks && sources.stable);
const probe = await runVampireProbe(page);
const labels = {
  flight:'Wet/dry and vertical hovering retains normalized 40%-speed drift and minus-one rise',readiness:'Swoop readiness retains zero defaults, target y-minus-ten, speed seven and cooldown reset',
  locked:'Locked target, final movement tick, expiry and following hover remain unchanged',terrain:'Hover and swoop retain direct movement through solids without editing terrain',
  contacts:'Non-ghost contacts retain Normal/Expert/Master damage, invulnerability and cooldown',loot:'Real kills retain independent Moon Stone/Broken Bat Wing boundaries and canonical coins',
  targeting:'Swoops lock onto the nearest living multiplayer target',events:'Gated first wave and last kill remain event-owned without Lantern Night'
};
for (const [key,label] of Object.entries(labels)) check(results,label,probe[key].length > 0 && probe[key].every(s => s.correct && s.calls === 2 && s.readonly && s.rng === 0),probe[key].filter(s => !s.correct || !s.readonly || s.rng));
const presentation = await page.evaluate(() => {
  const rows = [], c = document.createElement('canvas'); c.width = c.height = 320; const ctx = c.getContext('2d');
  for (const side of [-1,1]) for (const cd of [undefined,0,1.4,2.4 - 0.18,2.4 - 0.17,2.4,2.401,999]) for (const hasCharge of [false,true]) {
    __piScene(); const e = __piEnemy(__piSpecs[0]); e.dir = side; e.vx = -side * 3; e.attackCd = cd;
    game.player.x = e.x - side * 200;
    if (hasCharge) e.charge = { x:e.x - side * 200,y:e.y - 10,t:0.5 };
    const before = __piState(), random = Math.random; let rng = 0;
    try { Math.random = () => { rng++; return 0.5; }; ctx.clearRect(0,0,320,320); CombatArt.drawEnemy(ctx,game,e,{ x:e.x,y:e.y },320,320); } finally { Math.random = random; }
    const pixels = ctx.getImageData(0,0,320,320).data;
    ctx.clearRect(0,0,320,320); ctx.save(); ctx.translate(160,160); if (side < 0) ctx.scale(-1,1);
    ctx.drawImage(CombatArt.enemySprite('vampire',Math.floor(Time.seconds * 10) % 4,cd > 2.4 - 0.18 && cd <= 2.4,false),-48,-48); ctx.restore();
    const expected = ctx.getImageData(0,0,320,320).data;
    rows.push({ side,cd,hasCharge,exact:pixels.every((v,i) => v === expected[i]),readonly:before === __piState(),rng });
  }
  ctx.translate(4,6); ctx.scale(0.7,0.8); ctx.globalAlpha = 0.6; ctx.imageSmoothingEnabled = true;
  const state = () => { const m = ctx.getTransform(); return JSON.stringify([m.a,m.b,m.c,m.d,m.e,m.f,ctx.globalAlpha,ctx.imageSmoothingEnabled,ctx.globalCompositeOperation,ctx.fillStyle,ctx.strokeStyle]); };
  const before = state(); CombatArt.drawEnemy(ctx,game,game.entities[0],{ x:game.entities[0].x,y:game.entities[0].y },320,320);
  const fallback = [E.MIMIC,E.CORRUPTMIMIC,E.HALLOWEDMIMIC,E.CRIMSONMIMIC,E.MARTIANPROBE,E.PIRATESHARK,E.ICEGOLEM,-999].every(type => !CombatArt.drawEnemy(ctx,game,{ type },{ x:0,y:0 },320,320));
  const protectedHooks = [{ boss:'mothron' },{ minion:'bat' },{ ooaEnemy:true },{ ooaSentry:true }].every(flags => !CombatArt.drawEnemy(ctx,game,{ type:E.VAMPIRE,...flags },{ x:0,y:0 },320,320));
  return { rows,restored:before === state(),fallback,protectedHooks };
});
check(results,'Serializable cooldown alone selects launch art without inventing charge state or new facing',presentation.rows.every(s => s.exact && s.readonly && s.rng === 0),presentation.rows.filter(s => !s.exact || !s.readonly || s.rng));
check(results,'Drawing restores context and preserves later Eclipse/protected fallbacks',presentation.restored && presentation.fallback && presentation.protectedHooks,presentation);
const eclipse = await runEclipseEventProbe(page);
check(results,'All 32 mechanical/Plantera pools and real Mothron scheduling remain simulation-owned',eclipse.gates.length === 32 && eclipse.gates.every(s => s.correct && s.readonly),eclipse.gates);
check(results,'Eight daylight-boundary cases keep night completion simulation-owned',eclipse.daylight.length === 8 && eclipse.daylight.every(s => s.correct && s.readonly && s.live.calls === 2 && s.live.readonly && s.live.rng === 0),eclipse.daylight);
const scenarios = await runVampireScenarios(page);
check(results,'Twelve hovering/launching/recovering wet/dry side scenarios are read-only',scenarios.length === 12 && scenarios.every(s => s.calls === 1 && s.readonly && s.shots === 0 && s.cooldowns && s.event && s.bodies && s.movement && s.noLoot && s.noChildren),scenarios);
const dir = 'test-results/graphics/vampire'; mkdirSync(dir,{ recursive:true });
const sheet = await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 768; c.height = 400; const ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0,0,768,400); ctx.font = '18px monospace'; ctx.fillStyle = '#ecd49e'; ctx.fillText('TREE / Vampire',20,30);
  for (const active of [false,true]) { ctx.drawImage(CombatArt.enemySprite('vampire',1,active,false),active ? 400 : 40,45,288,288); ctx.fillText(active ? 'cooldown release' : 'flight cycle',active ? 420 : 60,365); }
  return c.toDataURL('image/png'); });
writeFileSync(dir + '/vampire-artwork.png',Buffer.from(sheet.split(',')[1],'base64'));
for (const pose of vampireArt.scenarioStates) {
  await page.evaluate(pose => { const e = __vaPose(pose); game.player.x = e.x - 100; game.player.y = __piOrigin.gy * TILE - game.player.h / 2 - 0.01;
    updateHud(); window.__vaHook = CombatArt.drawEnemy; CombatArt.drawEnemy = () => false; render(); },pose);
  await page.screenshot({ path:dir + '/' + pose + '-before.png' });
  await page.evaluate(() => { CombatArt.drawEnemy = __vaHook; delete window.__vaHook; render(); });
  await page.screenshot({ path:dir + '/' + pose + '-after.png' });
}
writeFileSync(dir + '/index.html',`<!doctype html><meta charset="utf-8"><title>Vampire artwork</title><style>body{background:#202534;color:#dedbc9;max-width:1440px;margin:24px auto;padding:0 16px;font:16px monospace}img{width:100%;image-rendering:pixelated}.row{display:flex;gap:16px}figure{margin:8px 0;flex:1}</style><h1>Vampire</h1><p>Original single-body artwork; one real AI tick per disposable hovering/launching/recovering fixture. No new transformation, projectile or damage source.</p><img src="vampire-artwork.png" alt="Flight and cooldown release source sprites">${vampireArt.scenarioStates.map(pose => `<h2>${pose}</h2><div class="row"><figure><img src="${pose}-before.png" alt="Legacy ${pose}"><figcaption>Before — general-enemy artwork disabled</figcaption></figure><figure><img src="${pose}-after.png" alt="New ${pose}"><figcaption>After — same combat state</figcaption></figure></div>`).join('')}`);
await assertNoBrowserErrors(results);
await finish(results,browser,'vampire-graphics',{ sources,probe,presentation,eclipse,scenarios });
