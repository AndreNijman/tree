// Independent assisted review of input-latch lifecycle and persistent swept movement.
// No managed campaign, saved character, or production requests are used.
import { mkdirSync,writeFileSync } from 'node:fs';
import { setupAudit,check,assertNoBrowserErrors,finish } from './audit2/lib.mjs';
const out=process.env.COMBAT_REVIEW_OUT||'test-results/combat-feel-20261101/parent/review-initial';
mkdirSync(out,{recursive:true});
const {browser,page,results}=await setupAudit();
try {
  const evidence=await page.evaluate(()=>{
    game.paused=true;game.netDisconnected=false;game.panelOpen=false;game.mapOpen=false;
    game.entities=[];game.fxTexts=[];game.projectiles.list=[];game.player.dying=false;
    const p=game.player,w=game.world;
    const origin={x:p.x,y:p.y-80};
    const cx=Math.floor(origin.x/TILE),cy=Math.floor(origin.y/TILE);
    for(let x=cx-30;x<=cx+30;x++)for(let y=cy-15;y<=cy+15;y++)w.set(x,y,T.AIR);
    p.x=origin.x;p.y=origin.y;game.cam.x=p.x;game.cam.y=p.y;
    const sword={id:I.COPPERSHORT,count:1};p.inventory.slots[0]=sword;p.inventory.slots[1]={...sword};p.inventory.selected=0;
    const c=canvas,r=c.getBoundingClientRect(),ev={bubbles:true,button:0,clientX:r.left+r.width*.65,clientY:r.top+r.height*.5};
    function prepareTap(){
      game.paused=false;game.mapOpen=game.panelOpen=false;game.netDisconnected=false;p.dying=false;p.attackCd=p.swingT=0;
      p.inventory.selected=0;MOUSE.down=false;MOUSE.combatTap=null;game.entities=[];
      c.dispatchEvent(new MouseEvent('mousedown',ev));c.dispatchEvent(new MouseEvent('mouseup',ev));
    }
    function fired(){p.update(game);return p.attackCd>0;}
    prepareTap();openPanel();closePanel();const panelQueued=fired();
    prepareTap();togglePause();togglePause();const pauseQueued=fired();
    prepareTap();KEY_JUST.m=true;handleKeys();KEY_JUST.m=true;handleKeys();const mapQueued=fired();
    prepareTap();KEY_JUST['2']=true;handleKeys();const sameIdSlotQueued=fired();
    prepareTap();p.dying=true;p.respawnT=1;p.update(game);p.dying=false;const deathQueued=fired();
    MOUSE.down=false;MOUSE.combatTap=null;game.paused=true;
    game.entities=[];game.projectiles.list=[];
    const targets=[40,70].map(dx=>{const e=spawnEntity(game,E.ZOMBIE,origin.x+dx,origin.y-8);e.hp=e.maxHp=500;e.def=0;e.w=e.h=4;return e;});
    const shot={x:origin.x,y:origin.y-8,vx:1,vy:0,dmg:10,type:P.RAZOR,owner:'player',life:1,age:.5,
      persistent:true,hitEnemies:[],sourcePlayer:p,dead:false};
    const movement=advanceSpecialProjectile(shot,origin.x+100,origin.y-8);
    const sweep={endX:shot.x-origin.x,expectedEndX:100,hp:targets.map(e=>e.hp),movement};
    game.entities=[];game.projectiles.list=[];game.fxTexts=[];p.attackCd=p.swingT=0;p.mana=p.maxMana;
    const critTarget=spawnEntity(game,E.ZOMBIE,origin.x+80,origin.y-8);critTarget.hp=critTarget.maxHp=1000;critTarget.def=0;
    // A deployed critical sphere must pass its shared confirmation marker to its payload.
    const feedback={sourcePlayer:p,shown:false};
    game.projectiles.add({x:origin.x,y:origin.y-8,vx:0,vy:0,dmg:50,type:P.MAGICBOLT,owner:'player',life:2,dead:false,
      deployMode:'sphere',deployProj:P.LASER,deployInterval:.1,deployDamageMul:1,criticalFeedback:feedback});
    for(let i=0;i<20;i++)updateProjectiles();
    const deployed={damaged:critTarget.hp<1000,confirmed:game.fxTexts.some(f=>f.text==='Critical!')};
    game.projectiles.list=[];game.entities=[];game.fxTexts=[];
    const blastTarget=spawnEntity(game,E.ZOMBIE,origin.x+24,origin.y-8);blastTarget.hp=blastTarget.maxHp=500;blastTarget.def=0;
    explodeProjectile({x:origin.x,y:origin.y-8,dmg:50,explosive:60,criticalFeedback:{sourcePlayer:p,shown:false}});
    const blast={damaged:blastTarget.hp<500,confirmed:game.fxTexts.some(f=>f.text==='Critical!')};
    return{panelQueued,pauseQueued,mapQueued,sameIdSlotQueued,deathQueued,sweep,deployed,blast};
  });
  for(const [key,label]of [['panelQueued','Opening/closing inventory cancels a pending combat tap'],['pauseQueued','Pause/resume cancels a pending combat tap'],
    ['mapQueued','Opening/closing map cancels a pending combat tap'],['sameIdSlotQueued','Switching to a same-ID weapon slot cancels a pending tap'],['deathQueued','Death cancels a pending combat tap']])check(results,label,!evidence[key],evidence[key]);
  check(results,'Persistent special melee reaches its authored endpoint while piercing',Math.abs(evidence.sweep.endX-100)<.001,evidence.sweep);
  check(results,'Persistent special melee can cross multiple targets without frame-rate hit stalls',evidence.sweep.hp.every(h=>h<500),evidence.sweep);
  check(results,'Deployed critical attack confirms actual payload damage',evidence.deployed.damaged&&evidence.deployed.confirmed,evidence.deployed);
  check(results,'Critical explosive splash confirms accepted damage',evidence.blast.damaged&&evidence.blast.confirmed,evidence.blast);
  await assertNoBrowserErrors(results);
  writeFileSync(out+'/results.json',JSON.stringify({...results,evidence},null,2));
}finally{await finish(results,browser,'combat-feel-review');}
