// Assisted renderer fixtures only: disposable browser, no managed campaign or real saves.
// Optional pre-change renderer captures a matched A/B comparison, never overwrites evidence.
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { setupAudit, check, assertNoBrowserErrors, finish } from './audit2/lib.mjs';

const out = process.env.LIGHTING_RESULTS || 'test-results/lighting-gradient-20261031/implementation/sol/validation';
mkdirSync(out, { recursive: true });
const current = readFileSync('js/render.js', 'utf8');
const before = process.env.LIGHTING_BEFORE_RENDER && readFileSync(process.env.LIGHTING_BEFORE_RENDER, 'utf8');
const sha = text => createHash('sha256').update(text).digest('hex');
const { browser, page, results } = await setupAudit();
const variants = {};
try {
  await page.evaluate(() => {
    game.paused = true; game.event = null; game.weather.active = false;
    game.entities = []; game.projectiles.list = []; game.fx = []; game.fxTexts = []; game.pickups = [];
    game.shakeT = game.shakeMag = 0; game.player.inventory.selected = 0; Time.seconds = 10;
    document.getElementById('message').style.display = 'none';
    document.getElementById('interact').style.display = 'none';
    const w = game.world, cx = Math.floor(w.spawnX / TILE);
    window.__lightingCenter = cx;
    // Wide clean columns include all light-padding cells, with no hidden emitters.
    window.__lightingSetup = function(kind) {
      const surface = kind === 'sky' ? 220 : 100;
      for (let x = cx - 100; x <= cx + 100; x++) {
        const sy = kind === 'hills' ? Math.round(100 + 10 * Math.sin((x - cx) / 14)) : surface;
        w.surfaceY[x] = sy;
        for (let y = 0; y < 280; y++) {
          w.set(x, y, y >= sy ? T.DIRT : T.AIR); w.walls[w.idx(x, y)] = 0;
        }
      }
      if (kind === 'cave' || kind === 'torch' || kind === 'mixed') {
        for (let x = cx - 25; x <= cx + 25; x++) for (let y = 133; y <= 147; y++) w.set(x, y, T.AIR);
        if (kind !== 'cave') w.set(cx - 12, 140, T.TORCH);
        if (kind === 'mixed') { w.set(cx + 12, 147, T.LAVA); w.set(cx + 5, 138, T.GLOWSTONE); }
      }
      if (kind === 'mouth' || kind === 'hills') {
        for (let x = cx - 2; x <= cx + 2; x++) for (let y = 95; y <= 125; y++) w.set(x, y, T.AIR);
        for (let x = cx; x <= cx + 26; x++) for (let y = 104; y <= 112; y++) w.set(x, y, T.AIR);
      }
      if (kind === 'overhang') {
        for (let x = cx - 20; x <= cx + 20; x++) w.set(x, 80, T.STONE);
      }
      w.rebuildLights();
      game.player.x = game.cam.x = cx * TILE + 8;
      game.player.y = game.cam.y = (kind === 'sky' ? 140 : ['cave','torch','mixed'].includes(kind) ? 140 : 98) * TILE;
      game.timeOfDay = 0.5;
    };
    window.__lightAt = function(x, y) {
      const x0 = Math.max(0, Math.floor((game.cam.x - canvas.width / 2) / TILE) - LIGHT_PAD);
      const x1 = Math.min(w.W - 1, Math.ceil((game.cam.x + canvas.width / 2) / TILE) + LIGHT_PAD);
      const y0 = Math.max(0, Math.floor((game.cam.y - canvas.height / 2) / TILE) - LIGHT_PAD);
      return game.lightBuf[(y - y0) * (x1 - x0 + 1) + x - x0];
    };
    window.__renderFingerprint = async function() {
      const hashes = [];
      for (const a of [w.tiles, w.walls, w.hp, w.surfaceY]) {
        const digest = await crypto.subtle.digest('SHA-256', a.buffer);
        hashes.push(Array.from(new Uint8Array(digest)).join(','));
      }
      const p = game.player;
      return JSON.stringify({ hashes, p:[p.x,p.y,p.vx,p.vy,p.hp,p.maxHp,p.inventory],
        entities:game.entities, time:game.timeOfDay, bosses:game.bossesDefeated,
        lights:w.lights, weather:game.weather, projectiles:game.projectiles.list });
    };
  });
  for (const [variant, source] of (before ? [['before',before],['after',current]] : [['after',current]])) {
    await page.evaluate(source => { (0, eval)(source); }, source);
    const dir = out + '/' + variant; mkdirSync(dir, { recursive: true });
    const scenes = [];
    for (const scene of [
      { name:'hills-noon', kind:'hills', time:0.5 },
      { name:'hills-dusk', kind:'hills', time:0.75 },
      { name:'hills-night', kind:'hills', time:0 },
      { name:'cave-mouth', kind:'mouth' }, { name:'sealed-cave', kind:'cave' },
      { name:'torch-only', kind:'torch' }, { name:'torch-lava-glow', kind:'mixed' },
      { name:'overhang', kind:'overhang' },
      ...[30,80,150,210].map(alt => ({name:'sky-'+alt,kind:'sky',alt})),
      { name:'space-dusk',kind:'sky',alt:190,time:0.75 },
      { name:'space-night',kind:'sky',alt:190,time:0 }
    ]) {
      const metric = await page.evaluate(scene => {
        __lightingSetup(scene.kind);
        if (scene.alt) game.cam.y = game.player.y = (220 - scene.alt) * TILE;
        game.timeOfDay = scene.time ?? 0.5;
        updateHud(); render();
        const cx = __lightingCenter;
        const light = (ys,x = cx) => ys.map(y => ({x,y,value:__lightAt(x,y)}));
        const pixels = [[400,180],[500,200],[780,180],[820,240],[400,400]].map(([x,y]) => ({
          screen:[x,y], world:[game.cam.x+x-canvas.width/2,game.cam.y+y-canvas.height/2],
          rgba:Array.from(canvas.getContext('2d').getImageData(x,y,1,1).data)
        }));
        return { scene, camera:{...game.cam}, surface:game.world.surfaceY[cx],
          biome:game.world.biomeAt(game.player.x,game.player.y),pixels,
          shaft:scene.kind === 'mouth' ? light([100,104,108,112,116,120,124]) : null,
          mouth:scene.kind === 'mouth' ? [2,6,10,14,18,22,26].map(dx=>({dx,value:__lightAt(cx+dx,108)})) : null,
          cave:['cave','torch'].includes(scene.kind) ? light([140],cx-12).concat(light([140],cx-6),light([140],cx+4),light([140],cx+16)) : null,
          overhang:scene.kind === 'overhang' ? light([79,81,85,89,95]).map(p=>{
            const x0=Math.max(0,Math.floor((game.cam.x-canvas.width/2)/TILE)-LIGHT_PAD);
            const y0=Math.max(0,Math.floor((game.cam.y-canvas.height/2)/TILE)-LIGHT_PAD);
            return {...p,alpha:game.lightMapImg.data[((p.y-y0)*game.lightMapImg.width+p.x-x0)*4+3]};
          }) : null };
      }, scene);
      scenes.push(metric);
      await page.screenshot({path:dir+'/'+scene.name+'.png'});
    }
    const performance = await page.evaluate(async () => {
      const rows = [];
      for (const kind of ['hills','sky','torch']) {
        __lightingSetup(kind);
        // Pace rendered frames normally. A tight synchronous loop queues GPU
        // work without presentation and measures command-buffer stalls, not FPS.
        for (let i=0;i<10;i++) { await new Promise(requestAnimationFrame); render(); }
        const ms = [];
        for (let i=0;i<70;i++) {
          await new Promise(requestAnimationFrame);
          const t=performance.now(); render(); ms.push(performance.now()-t);
        }
        ms.sort((a,b)=>a-b); rows.push({kind,median:ms[35],p95:ms[66]});
      }
      return rows;
    });
    variants[variant] = { sourceHash:sha(source),scenes,performance };
  }
  const after = variants.after.scenes, scene = name => after.find(s => s.scene.name === name);
  const luma = pixel => pixel[0]*0.2126+pixel[1]*0.7152+pixel[2]*0.0722;
  const meanSky = name => scene(name).pixels.slice(0,4).reduce((s,p)=>s+luma(p.rgba),0)/4;
  const altitudes = [30,80,150,210].map(alt=>({alt,luma:meanSky('sky-'+alt)}));
  check(results,'Rendered upper space is much darker than low sky (samples can include clouds)',altitudes[2].luma < altitudes[0].luma*0.5 && altitudes[3].luma<altitudes[2].luma,altitudes);
  check(results,'Zero-emissive sealed cave light remains zero',scene('sealed-cave').cave.every(p=>p.value===0),scene('sealed-cave').cave);
  check(results,'Torch remains bright locally and dark at a distance',scene('torch-only').cave[0].value>0.9 && scene('torch-only').cave.at(-1).value===0,scene('torch-only').cave);
  check(results,'Open shaft daylight fades with depth',scene('cave-mouth').shaft.every((s,i,a)=>!i||s.value<=a[i-1].value) && scene('cave-mouth').shaft.at(-1).value<0.1,scene('cave-mouth').shaft);
  check(results,'Cave mouth has localized lateral daylight falloff',scene('cave-mouth').mouth[0].value>0.2 && scene('cave-mouth').mouth.at(-1).value===0,scene('cave-mouth').mouth);
  check(results,'Overhang shadows are not incorrectly exempted above surface',scene('overhang').overhang.at(-1).value===0 && scene('overhang').overhang[3].alpha>100,scene('overhang').overhang);

  const fields = await page.evaluate(async () => {
    __lightingSetup('hills');
    const c=document.createElement('canvas'); c.width=1280;c.height=720;const g=c.getContext('2d');
    const cam={x:game.player.x,y:game.player.y};
    const at=(wx,wy)=>Array.from(g.getImageData(Math.round(wx-cam.x+c.width/2),Math.round(wy-cam.y+c.height/2),1,1).data);
    const points=[[-220,-80],[-64,120],[240,-40]].map(([x,y])=>[cam.x+x,cam.y+y]);
    const sample=()=>{drawAltitudeSky(g,game.world,cam,c.width,c.height,'#568bb8','#d7e6d6',1);return points.map(p=>at(...p));};
    const a=sample();cam.x+=96;cam.y+=96;const b=sample();
    const delta=Math.max(...a.flatMap((p,i)=>p.slice(0,3).map((v,k)=>Math.abs(v-b[i][k]))));
    // Same lattice also backs caves; no camera-relative deepening or last-sky-pixel switch.
    __lightingSetup('hills');cam.x=game.cam.x;cam.y=game.cam.y;
    const cavePoints=[[-220,80],[64,120],[240,140]].map(([x,y])=>[cam.x+x,cam.y+y]);
    const caveSample=()=>{drawAltitudeSky(g,game.world,cam,c.width,c.height,'#0e0c0a','#30271f',0,true);return cavePoints.map(p=>at(...p));};
    const caveA=caveSample();cam.x+=96;cam.y+=96;const caveB=caveSample();
    const caveDelta=Math.max(...caveA.flatMap((p,i)=>p.slice(0,3).map((v,k)=>Math.abs(v-caveB[i][k]))));
    __lightingSetup('sky');cam.x=game.cam.x;
    const stars=[];
    const atmosphere=[];
    for (const alt of [30,150,210]) {
      cam.y=(220-alt)*TILE;g.clearRect(0,0,c.width,c.height);drawSpaceStars(game,g,cam,c.width,c.height,1);
      const d=g.getImageData(0,0,c.width,c.height).data;let count=0;for(let i=3;i<d.length;i+=4)if(d[i])count++;
      stars.push({alt,pixels:count});
    }
    for (const alt of [30,80,150,210]) {
      cam.y=(220-alt)*TILE;
      drawAltitudeSky(g,game.world,cam,c.width,c.height,'#568bb8','#d7e6d6',1);
      atmosphere.push({alt,rgba:Array.from(g.getImageData(640,360,1,1).data)});
    }
    const blend=hexBlend(hexBlend('#d7e6d6','#568bb8',0.5),'#030713',0);
    // Quantify threshold continuity using the actual background, with art disabled
    // only by sampling the dedicated atmosphere field (not a gameplay assertion).
    const dusk=[];
    for(const t of [0.74999,0.75,0.75001]) {
      const day=daylightAt(t),twi=twilightAmt(t);
      const top=hexBlend(hexBlend('#101a36','#568bb8',day),'#2a1e46',twi*0.7);
      const bottom=hexBlend(hexBlend('#283752','#d7e6d6',day),'#ff9a50',twi*0.75);
      drawAltitudeSky(g,game.world,cam,c.width,c.height,top,bottom,day);dusk.push(Array.from(g.getImageData(500,200,1,1).data));
    }
    const before=await __renderFingerprint();for(let i=0;i<5;i++)render();const readonly=before===await __renderFingerprint();
    return {delta,caveDelta,a,b,stars,atmosphere,blend,dusk,readonly,finite:Array.from(game.lightBuf).every(Number.isFinite),alpha:canvas.getContext('2d').globalAlpha};
  });
  check(results,'World-registered sky colors survive horizontal AND vertical camera movement',fields.delta<=1,{maxChannelDelta:fields.delta});
  check(results,'World-registered cave colors survive camera movement across hills',fields.caveDelta<=1,{maxChannelDelta:fields.caveDelta});
  check(results,'Daytime stars fade in at altitude, absent near surface',fields.stars[0].pixels===0 && fields.stars[1].pixels>10 && fields.stars[2].pixels>10,fields.stars);
  check(results,'Atmosphere itself darkens monotonically at increasing world altitudes',fields.atmosphere.every((s,i,a)=>!i||luma(s.rgba)<luma(a[i-1].rgba)),fields.atmosphere);
  check(results,'Exposed foreground retains daylight independently of sky darkness',await page.evaluate(()=>{__lightingSetup('sky');game.player.y=game.cam.y=70*TILE;render();return __lightAt(__lightingCenter,70)===1;}));
  check(results,'Nested color blends preserve non-black midtones',/^#[0-9a-f]{6}$/.test(fields.blend) && fields.blend!=='#000000',fields.blend);
  check(results,'Space palette remains continuous across dusk switch',fields.dusk.every(p=>p.every((v,k)=>Math.abs(v-fields.dusk[0][k])<=1)),fields.dusk);
  check(results,'Repeated rendering preserves world, HP, inventory, entities, clock and weather',fields.readonly);
  check(results,'Light field finite and canvas alpha restored',fields.finite && fields.alpha===1);
  if (variants.before) {
    for (const current of variants.after.performance) {
      const old=variants.before.performance.find(p=>p.kind===current.kind);
      check(results,current.kind+': bounded renderer cost versus pre-lighting source',current.median < old.median*2+1 && current.p95<old.p95*3+5,{before:old,after:current});
    }
  }
  await assertNoBrowserErrors(results);
  check(results,'Source unchanged during validation',sha(readFileSync('js/render.js','utf8'))===sha(current));
  writeFileSync(out+'/results.json',JSON.stringify({checks:results.checks,errors:results.errors,variants,fields},null,2));
} catch (error) {
  check(results,'Harness completed without errors',false,String(error.stack || error));
  writeFileSync(out+'/harness-error.txt',String(error.stack || error));
  throw error;
} finally {
  await finish(results,browser,'lighting-gradient');
}
