// Isolated assisted combat responsiveness and hit-confirmation regressions.
// Owns its output directory; does not overwrite audit2/graphics artifacts.
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { setupAudit } from './audit2/lib.mjs';

const OUT = process.env.COMBAT_FEEL_OUT || path.join(process.cwd(), 'test-results', 'combat-feel-20261101', 'implementation');
const { browser, page, results } = await setupAudit();
const cases = {};
try {
  const baseline = await page.evaluate(() => {
    game.paused = true; game.panelOpen = false; game.mapOpen = false;
    game.entities = []; game.projectiles.list = []; game.fx = []; game.fxTexts = [];
    const p = game.player;
    p.attackCd = p.swingT = 0; p.dying = false; p.invuln = 0;
    p.inventory.accessories.fill(null);
    p.inventory.slots[0] = { id:I.COPPERSWORD,count:1 };
    p.inventory.slots[1] = { id:I.COPPERBOW,count:1 };
    p.inventory.slots[2] = { id:I.COPPERPICK,count:1 };
    p.inventory.slots[3] = { id:I.HEALINGPOTION,count:1 };
    p.inventory.slots[4] = { id:I.FISHINGROD_WOODEN,count:1 };
    p.inventory.selected = 0;
    MOUSE.wx = p.x + 160; MOUSE.wy = p.y - 6;
    function testSwing(entities, random) {
      game.entities = entities; game.fxTexts = []; p.attackCd = p.swingT = 0;
      const oldRandom = Math.random; Math.random = () => random;
      try { p.tryMelee(game, ITEMS[I.COPPERSWORD], false, p.inventory.selectedItem()); }
      finally { Math.random = oldRandom; }
      return game.fxTexts.filter(f => f.text === 'Critical!').length;
    }
    const critOnAir = testSwing([],0);
    const dead = { x:p.x+30,y:p.y-6,w:12,h:20,hp:100,dead:true,type:E.ZOMBIE };
    const friendly = { x:p.x+30,y:p.y-6,w:12,h:20,hp:100,dead:false,friendly:true,type:E.ZOMBIE };
    const sentry = { x:p.x+30,y:p.y-6,w:12,h:20,hp:100,dead:false,ooaSentry:true,type:E.ZOMBIE };
    const shielded = { x:p.x+30,y:p.y-6,w:20,h:20,hp:500,dead:false,boss:'lunar',shieldHp:100,defV:0 };
    const filteredCrits = [dead,friendly,sentry,shielded].map(e => testSwing([e],0));
    const target = spawnEntity(game,E.ZOMBIE,p.x+30,p.y-6); target.w=12; target.h=20; target.hp=target.maxHp=100; target.def=0;
    const critOnHit = testSwing([target],0);
    const hitDiagnostic={ hp:target.hp,dead:target.dead,fxTexts:game.fxTexts.map(f=>f.text),isClient:Net.isClient() };
    const oldIsClient=Net.isClient, oldClaim=Net.claimHit;
    const predicted={x:p.x+30,y:p.y-6,w:12,h:20,hp:100,dead:false,dmg:10,nid:987654,type:E.ZOMBIE};
    Net.isClient=()=>true; Net.claimHit=()=>true;
    const critOnPrediction=testSwing([predicted],0);
    Net.isClient=oldIsClient; Net.claimHit=oldClaim;

    game.entities=[shielded]; game.projectiles.list=[]; game.fxTexts=[];
    const shieldShot={x:p.x+10,y:p.y-6,vx:40,vy:0,dmg:20,type:P.ARROW,owner:'player',life:1,dead:false,
      criticalFeedback:{sourcePlayer:p,shown:false}};
    game.projectiles.add(shieldShot); updateProjectiles();
    const projectileCritOnShield=game.fxTexts.some(f=>f.text==='Critical!');

    // Projectile-only melee crit feedback must wait for real target damage.
    game.entities=[]; game.projectiles.list=[]; game.fxTexts=[]; p.attackCd=p.swingT=0;
    p.inventory.slots[0]={id:I.GUNGNIR,count:1}; p.inventory.selected=0;
    const spearTarget=spawnEntity(game,E.ZOMBIE,p.x+30,p.y-8); spearTarget.w=12; spearTarget.h=20; spearTarget.hp=spearTarget.maxHp=500; spearTarget.def=0;
    MOUSE.wx=p.x+160; MOUSE.wy=p.y-8;
    const oldRandom=Math.random; Math.random=()=>0;
    try { p.tryMelee(game,ITEMS[I.GUNGNIR],false,p.inventory.selectedItem()); } finally { Math.random=oldRandom; }
    const projectileCritAtLaunch=game.fxTexts.some(f=>f.text==='Critical!');
    updateProjectiles();
    const projectileCritAfterHit=game.fxTexts.some(f=>f.text==='Critical!');

    function rangedOrMagicCritical(id, kind) {
      game.entities=[]; game.projectiles.list=[]; game.fxTexts=[]; p.attackCd=0; p.swingT=0; p.mana=p.maxMana;
      const target=spawnEntity(game,E.ZOMBIE,p.x+42,p.y-6); target.w=14; target.h=20; target.hp=target.maxHp=1000; target.def=0;
      MOUSE.wx=p.x+160; MOUSE.wy=p.y-6;
      const def=ITEMS[id], item={id,count:1};
      if (kind==='ranged') { p.inventory.add(I.ARROW,5); p.tryShoot(game,def,id,item); }
      else p.tryMagic(game,def,id,item);
      const atLaunch=game.fxTexts.some(f=>f.text==='Critical!');
      for(let i=0;i<24 && !game.fxTexts.some(f=>f.text==='Critical!');i++) updateProjectiles();
      return { atLaunch,afterImpact:game.fxTexts.some(f=>f.text==='Critical!'),hp:target.hp,shots:game.projectiles.list.length };
    }
    const critRandom=Math.random; Math.random=()=>0;
    let rangedCrit,magicCrit;
    try { rangedCrit=rangedOrMagicCritical(I.COPPERBOW,'ranged'); magicCrit=rangedOrMagicCritical(I.AMBERSTAFF,'magic'); }
    finally { Math.random=critRandom; }

    // A real DOM button-down/up pair occurs while the simulation loop is gated;
    // one production Player.update then represents the first eligible update.
    game.entities = []; game.fxTexts = []; p.attackCd = p.swingT = 0;
    p.inventory.slots[0]={id:I.COPPERSWORD,count:1}; p.inventory.selected = 0; game.paused = false; game.netDisconnected = false;
    MOUSE.down = false;
    return { critOnAir,filteredCrits,critOnHit,critOnPrediction,projectileCritOnShield,hitDiagnostic,projectileCritAtLaunch,projectileCritAfterHit,spearTargetHp:spearTarget.hp,rangedCrit,magicCrit,attackCdBeforeTap:p.attackCd,frameBeforeTap:Time.frame };
  });
  cases.pre = baseline;

  // Send real browser mouse events with no simulation RAF updates between them.
  const tap = await page.evaluate(() => {
    const p=game.player; const before=p.attackCd; const c=document.getElementById('canvas');
    const r=c.getBoundingClientRect(), cx=r.left+r.width*.75, cy=r.top+r.height*.5;
    c.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,button:0,clientX:cx,clientY:cy}));
    c.dispatchEvent(new MouseEvent('mouseup',{bubbles:true,button:0,clientX:cx,clientY:cy}));
    const tapCapture={pending:!!MOUSE.combatTap,pendingSlot:MOUSE.combatTap&&MOUSE.combatTap.selected,
      selected:p.inventory.selected,stackMatches:!!MOUSE.combatTap&&MOUSE.combatTap.stack===p.inventory.selectedItem(),
      panelOpen:game.panelOpen,mapOpen:game.mapOpen,paused:game.paused,dying:p.dying};
    p.update(game);
    const first={ down:MOUSE.down,afterCd:p.attackCd,beforeCd:before,selected:p.inventory.selected,swingT:p.swingT,consumed:!!MOUSE.combatTap,tapCapture };
    p.attackCd=p.swingT=0; p.inventory.selected=0;
    c.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,button:0,clientX:cx,clientY:cy}));
    p.inventory.selected=1;
    c.dispatchEvent(new MouseEvent('mouseup',{bubbles:true,button:0,clientX:cx,clientY:cy})); p.update(game);
    const switchedNoFire=p.attackCd===0;
    p.inventory.selected=0; p.attackCd=.2; p.swingT=0;
    c.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,button:0,clientX:cx,clientY:cy}));
    c.dispatchEvent(new MouseEvent('mouseup',{bubbles:true,button:0,clientX:cx,clientY:cy}));
    p.update(game); for(let i=0;i<20;i++) p.update(game);
    const cooldownNoQueue=p.swingT===0 && p.attackCd===0;
    p.inventory.selected=3; p.hp=50; const potionBefore=p.inventory.countOf(I.HEALINGPOTION);
    c.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,button:0,clientX:cx,clientY:cy}));
    c.dispatchEvent(new MouseEvent('mouseup',{bubbles:true,button:0,clientX:cx,clientY:cy})); p.update(game);
    const consumableNoTap=p.hp===50 && p.inventory.countOf(I.HEALINGPOTION)===potionBefore;
    p.inventory.selected=4; p.fishing=null;
    c.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,button:0,clientX:cx,clientY:cy}));
    c.dispatchEvent(new MouseEvent('mouseup',{bubbles:true,button:0,clientX:cx,clientY:cy})); p.update(game);
    const fishingNoTap=p.fishing===null;
    p.attackCd=p.swingT=0; p.inventory.selected=2;
    c.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,button:0,clientX:cx,clientY:cy}));
    c.dispatchEvent(new MouseEvent('mouseup',{bubbles:true,button:0,clientX:cx,clientY:cy})); p.update(game);
    const toolDidNotMine=p.mineCd===0;
    p.inventory.selected=0; p.attackCd=p.swingT=0; game.paused=true;
    c.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,button:0,clientX:cx,clientY:cy}));
    c.dispatchEvent(new MouseEvent('mouseup',{bubbles:true,button:0,clientX:cx,clientY:cy})); game.paused=false; p.update(game);
    const pausedNoFire=p.attackCd===0;
    p.attackCd=p.swingT=0; c.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,button:0,clientX:cx,clientY:cy}));
    window.dispatchEvent(new Event('blur')); p.update(game); const blurReleased=!MOUSE.down && p.attackCd===0;
    p.attackCd=p.swingT=0; MOUSE.down=true; MOUSE.combatTap=null;
    let heldAttacks=0; const oldTry=p.tryMelee;
    p.tryMelee=function(...args){const cd=this.attackCd,st=this.swingT; const out=oldTry.apply(this,args); if(cd<=0&&st<=0&&this.attackCd>0)heldAttacks++; return out;};
    for(let i=0;i<60;i++) p.update(game);
    p.tryMelee=oldTry; MOUSE.down=false; p.attackCd=p.swingT=0;
    return { ...first,switchedNoFire,cooldownNoQueue,consumableNoTap,fishingNoTap,toolDidNotMine,pausedNoFire,blurReleased,heldAttacks };
  });
  cases.tap = tap;

  // Short, narrow-body sweep and wall-first control through the real projectile updater.
  const special = await page.evaluate(() => {
    game.projectiles.list=[]; game.entities=[];
    const p=game.player; const z=spawnEntity(game,E.ZOMBIE,p.x+90,p.y-8);
    z.w=8; z.h=10; z.hp=z.maxHp=500; z.def=0;
    const o={x:p.x+40,y:p.y-8,vx:0,vy:0,dmg:10,type:P.RAZOR,owner:'player',life:2,dead:false,
      persistent:true,hitEnemies:[],sourcePlayer:p,yoyo:true,yoyoReach:150,yoyoDuration:1,age:0.5,hitCooldown:0.35};
    // Yoyo teleports between two sampled positions; midpoint body should be crossed.
    MOUSE.wx=p.x+150; MOUSE.wy=p.y-8;
    game.projectiles.add(o); updateProjectiles();
    const yoyoHit=z.hp<500;
    function modeSweep(mode) {
      game.projectiles.list=[]; game.entities=[]; MOUSE.down=true;
      let initialX=p.x+18,initialY=p.y-8,targetX,targetY;
      const extra={};
      if(mode==='spear') {
        extra.spear=true; extra.spearAng=0; extra.spearReach=100; extra.spearDuration=1; extra.age=.5;
        targetX=p.x+68; targetY=p.y-8;
      } else if(mode==='flail') {
        extra.flail=true; extra.flailAng=Math.PI; extra.flailReach=80; extra.flailDuration=1; extra.age=.5;
        const phase=.5166666667, a=((phase-.35)/.35)*Math.PI*1.25;
        targetX=(initialX+p.x+Math.cos(Math.PI+a)*80)/2; targetY=(initialY+p.y-8+Math.sin(Math.PI+a)*80)/2;
      } else if(mode==='yoyo') {
        initialX=p.x+40; extra.yoyo=true; extra.yoyoReach=150; extra.yoyoDuration=1; extra.age=.5;
        targetX=p.x+90; targetY=p.y-8; MOUSE.wx=p.x+150; MOUSE.wy=p.y-8;
      } else {
        extra.controlled=true; extra.controlledReach=240; extra.controlledSpeed=80;
        targetX=p.x+58; targetY=p.y-8; MOUSE.wx=p.x+200; MOUSE.wy=p.y-8;
      }
      const enemy=spawnEntity(game,E.ZOMBIE,targetX,targetY); enemy.w=7; enemy.h=7; enemy.hp=enemy.maxHp=500; enemy.def=0;
      const shot=Object.assign({x:initialX,y:initialY,vx:0,vy:0,dmg:10,type:P.RAZOR,owner:'player',life:2,dead:false,
        persistent:true,hitEnemies:[],sourcePlayer:p,hitCooldown:.35},extra);
      game.projectiles.add(shot); updateProjectiles(); MOUSE.down=false;
      return {hit:enemy.hp<500,hp:enemy.hp,from:[initialX,initialY],to:[shot.x,shot.y],target:[targetX,targetY]};
    }
    const modeSweeps={spear:modeSweep('spear'),flail:modeSweep('flail'),yoyo:modeSweep('yoyo'),controlled:modeSweep('controlled')};
    game.projectiles.list=[]; game.entities=[];
    const piercers=[35,70].map(dx=>{const e=spawnEntity(game,E.ZOMBIE,p.x+dx,p.y-8);e.w=e.h=5;e.hp=e.maxHp=500;e.def=0;return e;});
    const persistent={x:p.x,y:p.y-8,vx:0,vy:0,dmg:10,type:P.RAZOR,owner:'player',life:1,age:.5,
      persistent:true,hitEnemies:[],sourcePlayer:p,dead:false};
    const persistentMove=advanceSpecialProjectile(persistent,p.x+100,p.y-8,false);
    const piercing={endX:persistent.x-p.x,hp:piercers.map(e=>e.hp),steps:persistentMove.steps};
    const longMove={x:p.x,y:p.y-8,vx:0,vy:0,dmg:1,type:P.RAZOR,owner:'player',life:1,age:.5,
      persistent:true,hitEnemies:[],sourcePlayer:p,dead:false};
    const longResult=advanceSpecialProjectile(longMove,p.x+5000,p.y-8,false);
    const bounded={endX:longMove.x-p.x,steps:longResult.steps};
    game.entities=[];
    const policyWallX=Math.floor((p.x+16)/TILE),policyWallY=Math.floor((p.y-8)/TILE);
    game.world.set(policyWallX,policyWallY,T.STONE);
    const noWallChecks=['spear','flail'].map(()=>{
      const path={x:p.x,y:p.y-8,vx:1,vy:0,dmg:1,type:P.RAZOR,owner:'player',life:1,age:.5,persistent:true,hitEnemies:[],sourcePlayer:p,dead:false};
      const moved=advanceSpecialProjectile(path,p.x+40,p.y-8,false);return !moved.blocked&&Math.abs(path.x-(p.x+40))<.001;
    });
    const controlledPath={x:p.x,y:p.y-8,vx:1,vy:0,dmg:1,type:P.RAZOR,owner:'player',life:1,age:.5,persistent:true,hitEnemies:[],sourcePlayer:p,dead:false};
    const controlledWall=advanceSpecialProjectile(controlledPath,p.x+40,p.y-8,true);
    const controlledBlocked=controlledWall.blocked&&controlledPath.x<(policyWallX+1)*TILE;
    game.world.set(policyWallX,policyWallY,T.AIR);
    game.projectiles.list=[]; game.entities=[];
    const wallX=Math.floor((p.x+72)/TILE), wallY=Math.floor((p.y-8)/TILE);
    game.world.set(wallX,wallY,T.STONE);
    const behind=spawnEntity(game,E.ZOMBIE,p.x+100,p.y-8); behind.w=12; behind.h=12; behind.hp=behind.maxHp=500; behind.def=0;
    const bolt={x:p.x+40,y:p.y-8,vx:0,vy:0,dmg:10,type:P.RAZOR,owner:'player',life:2,dead:false,
      persistent:true,hitEnemies:[],sourcePlayer:p,yoyo:true,yoyoReach:100,yoyoDuration:1,age:.5,hitCooldown:.35};
    MOUSE.wx=p.x+100; MOUSE.wy=p.y-8; game.projectiles.add(bolt); updateProjectiles();
    const wallSafe=behind.hp===500;
    game.world.set(wallX,wallY,T.AIR); game.projectiles.list=[]; game.entities=[];
    return { yoyoHit,modeSweeps,piercing,bounded,noWallChecks,controlledBlocked,wallSafe,wallX,wallY,behindHp:behind.hp,boltDead:bolt.dead,boltX:bolt.x,boltY:bolt.y };
  });
  cases.special=special;

  const stageCatalog=await page.evaluate(() => {
    const rows=[
      ['starter',I.COPPERSHORT,I.COPPERSWORD,I.COPPERBOW,I.FLINXSTAFF,I.AMBERSTAFF],
      ['latePreHM',I.VOLCANO,I.SNAPTHORN,I.WATERBOLT,I.IMPSTAFF],
      ['earlyHM',I.ICE_SICKLE,I.DAEDALUSSTORMBOW,I.CRYSTALSTORM,I.SPIDERSTAFF],
      ['postMech',I.TERRABLADE,I.PULSEBOW,I.RAZORBLADETYPHOON,I.PYGMYSTAFF],
      ['endgame',I.ZENITH,I.PHANTASM,I.LASTPRISM,I.STARDUSTDRAGONSTAFF]
    ];
    return rows.map(([stage,...ids])=>({stage,items:ids.map(id=>{const d=ITEMS[id];return {id,name:d&&d.name,type:d&&d.type,dmg:d&&d.dmg,speed:d&&d.speed,range:d&&d.range,mana:d&&d.mana,ammo:d&&d.ammo,minion:d&&d.minion,mode:d&&(d.meleeMode||d.magicMode||d.terrainMode)||null};})}));
  });
  cases.stageCatalog=stageCatalog;
  const stageTypes=['melee','ranged','magic','summonstaff'];
  const stageCoverage=stageCatalog.every(row=>row.items.every(item=>item.name&&item.type)) && stageTypes.every(type=>stageCatalog.some(row=>row.items.some(item=>item.type===type)));
  results.checks.push({label:'Progression/class catalog samples remain defined with distinct item contracts',ok:stageCoverage,detail:stageCatalog});
  console.log(`${stageCoverage?'PASS':'FAIL'}: Progression/class catalog samples remain defined with distinct item contracts`);

  const artReach=await page.evaluate(() => {
    const c=document.createElement('canvas'); c.width=320;c.height=320; const ctx=c.getContext('2d');
    const p=game.player, center={x:160,y:160}, samples=[];
    for(const id of [I.COPPERSHORT,I.COPPERSWORD]) {
      const def=ITEMS[id]; p.inventory.slots[0]={id,count:1};p.inventory.selected=0;p.swingAng=0;p.dir=1;
      const collisionReach=def.range*TILE+10, duration=Math.max(.12,def.speed*.7);
      let maxVisible=0,minVisible=Infinity;
      for(let sample=0;sample<=20;sample++) {
        const progress=sample/20;p.swingT=duration*(1-progress);
        ctx.clearRect(0,0,c.width,c.height); CombatArt.drawSwing(ctx,p,center.x,center.y);
        const pixels=ctx.getImageData(0,0,c.width,c.height).data;
        for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++) {
          const a=pixels[(y*c.width+x)*4+3];
          if(a>20) {const r=Math.hypot(x-center.x,y-(center.y-6)); if(r>5){maxVisible=Math.max(maxVisible,r);minVisible=Math.min(minVisible,r);}}
        }
      }
      samples.push({id,name:def.name,collisionReach,maxVisibleReachPx:Math.round(maxVisible*10)/10,
        visibleToCollision:maxVisible/collisionReach,measuredPixels:'opaque canvas pixels across 21 deterministic animation samples'});
    }
    p.swingT=0;return samples;
  });
  cases.artReach=artReach;
  const artMatched=artReach.every(x=>x.visibleToCollision>=.7&&x.visibleToCollision<=1.2);
  results.checks.push({label:'Starter weapon opaque art extent stays within authored collision reach',ok:artMatched,detail:artReach});
  console.log(`${artMatched?'PASS':'FAIL'}: Starter weapon opaque art extent stays within authored collision reach`);

  for (const [label,ok,detail] of [
    ['Critical feedback does not announce a miss or damage-blocked target',baseline.critOnAir===0,baseline],
    ['Dead/friendly/sentry/shielded targets do not announce critical hits',baseline.filteredCrits.every(n=>n===0),baseline.filteredCrits],
    ['A real hit still announces its critical roll',baseline.critOnHit===1,baseline.critOnHit],
    ['Network-predicted damage claims do not announce confirmed critical hits',baseline.critOnPrediction===0,baseline.critOnPrediction],
    ['Projectile critical feedback does not confirm damage-blocked shield impacts',!baseline.projectileCritOnShield,baseline.projectileCritOnShield],
    ['Projectile-only melee crit feedback waits for accepted impact',!baseline.projectileCritAtLaunch && baseline.projectileCritAfterHit && baseline.spearTargetHp<500,baseline],
    ['Ranged and magic critical feedback waits for accepted impact',!baseline.rangedCrit.atLaunch && baseline.rangedCrit.afterImpact && baseline.rangedCrit.hp<1000 && !baseline.magicCrit.atLaunch && baseline.magicCrit.afterImpact && baseline.magicCrit.hp<1000,{ranged:baseline.rangedCrit,magic:baseline.magicCrit}],
    ['A down/up tap between updates fires once; selection/cooldown/UI/tool/consumable/fishing/blur and held-repeat controls remain bounded',tap.afterCd>0 && tap.swingT>0 && !tap.down && tap.switchedNoFire && tap.cooldownNoQueue && tap.consumableNoTap && tap.fishingNoTap && tap.toolDidNotMine && tap.pausedNoFire && tap.blurReleased && tap.heldAttacks>=2,tap],
    ['Spear/flail/yoyo/controlled sweep crossings damage between-update targets',Object.values(special.modeSweeps).every(x=>x.hit),special.modeSweeps],
    ['Persistent special sweep damages multiple targets and reaches authored endpoint',special.piercing.hp.every(h=>h<500)&&special.piercing.endX===100,special.piercing],
    ['Special sweep caps per-update substeps at 256',special.bounded.steps===256&&special.bounded.endX===5000,special.bounded],
    ['Spear/flail retain terrain-passing authored paths',special.noWallChecks.every(Boolean),special.noWallChecks],
    ['Yoyo/controlled paths retain wall-first collision',special.wallSafe&&special.controlledBlocked,special],
  ]) {
    const pass=!!ok; results.checks.push({label,ok:pass,detail}); console.log(`${pass?'PASS':'FAIL'}: ${label}`);
  }

  // Physical Playwright mouse/RAF trace in the disposable world. The render
  // marker records entry to render() with an active swing, not displayed pixels.
  const traceSetup=await page.evaluate(() => {
    const p=game.player; game.entities=[]; game.projectiles.list=[]; game.fxTexts=[];
    p.inventory.slots[0]={id:I.COPPERSHORT,count:1}; p.inventory.selected=0; p.attackCd=p.swingT=0; p.dying=false; p.invuln=0;
    game.paused=false; game.netDisconnected=false; MOUSE.down=false; MOUSE.combatTap=null;
    const target=spawnEntity(game,E.ZOMBIE,p.x+36,p.y-6); target.w=16; target.h=22; target.hp=target.maxHp=500; target.def=0;
    window.__combatTrace=[];
    document.addEventListener('mousedown',e=>{if(e.target===canvas)window.__combatTrace.push({kind:'down',ms:performance.now(),frame:Time.frame});},true);
    const oldTry=p.tryMelee; window.__oldCombatTry=oldTry;
    p.tryMelee=function(...args){const cd=this.attackCd,st=this.swingT;const v=oldTry.apply(this,args);if(cd<=0&&st<=0&&this.attackCd>0)window.__combatTrace.push({kind:'action',ms:performance.now(),frame:Time.frame});return v;};
    const oldRender=render; window.__oldCombatRender=oldRender;
    window.render=function(...args){if(!window.__combatTrace.some(x=>x.kind==='visible')&&window.__combatTrace.some(x=>x.kind==='down')&&p.swingT>0)window.__combatTrace.push({kind:'visible',ms:performance.now(),frame:Time.frame,swingT:p.swingT});return oldRender.apply(this,args);};
    return {targetHp:target.hp,origin:{x:p.x,y:p.y}};
  });
  const canvasBox=await page.locator('#canvas').boundingBox();
  await page.mouse.click(canvasBox.x+canvasBox.width/2+120,canvasBox.y+canvasBox.height/2,{delay:0});
  try { await page.waitForFunction(()=>window.__combatTrace&&window.__combatTrace.some(x=>x.kind==='visible'),null,{timeout:1500}); } catch {}
  cases.rafTrace=await page.evaluate(() => {
    const trace=window.__combatTrace||[]; const down=trace.find(x=>x.kind==='down'),action=trace.find(x=>x.kind==='action'),visible=trace.find(x=>x.kind==='visible');
    const p=game.player; p.tryMelee=window.__oldCombatTry; window.render=window.__oldCombatRender;
    return {trace,downToActionMs:down&&action?action.ms-down.ms:null,downToVisibleMs:down&&visible?visible.ms-down.ms:null,
      actionFrameDelta:down&&action?action.frame-down.frame:null,visibleFrameDelta:down&&visible?visible.frame-down.frame:null,remainingSwingT:p.swingT};
  });
  results.checks.push({label:'Physical click records action and first render callback with active swing',ok:cases.rafTrace.trace.some(x=>x.kind==='down')&&cases.rafTrace.trace.some(x=>x.kind==='action')&&cases.rafTrace.trace.some(x=>x.kind==='visible'),detail:cases.rafTrace});
  console.log(`${results.checks.at(-1).ok?'PASS':'FAIL'}: Normal physical click records update/action/render frame ordering`);
  const payload={...results,sourceCommit:(await import('node:child_process')).execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),cases};
  mkdirSync(OUT,{recursive:true});
  const name=process.argv.includes('--special-repro')?'special-before-results.json':process.argv.includes('--debug')?'debug-results.json':'after-results.json';
  writeFileSync(path.join(OUT,name),JSON.stringify(payload,null,2));
  console.log(`Wrote ${path.join(OUT,name)}`);
  if(results.checks.some(c=>!c.ok)) process.exitCode=2;
} finally { await browser.close(); }
