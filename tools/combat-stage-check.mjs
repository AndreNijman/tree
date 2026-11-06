// Assisted owned-item contracts across progression, not an earned progression run.
import { mkdirSync,writeFileSync,readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { setupAudit,check,assertNoBrowserErrors,finish } from './audit2/lib.mjs';
const out=process.env.COMBAT_STAGE_OUT||'test-results/combat-feel-20261101/parent/stages';
mkdirSync(out,{recursive:true});
const hashes=()=>Object.fromEntries(['js/player.js','js/main.js','js/render.js','js/combatart.js','js/items.js','js/net.js'].map(p=>[p,createHash('sha256').update(readFileSync(p)).digest('hex')]));
const source=hashes();const {browser,page,results}=await setupAudit();
try{
  const rows=await page.evaluate(()=>{
    game.paused=true;game.panelOpen=game.mapOpen=false;game.weather.active=false;game.event=null;game.shakeT=0;
    const p=game.player,w=game.world,cx=Math.floor(p.x/TILE),sy=w.surfaceY[cx];
    for(let x=cx-40;x<=cx+40;x++)for(let y=sy-25;y<sy+3;y++){w.set(x,y,y<sy?T.AIR:T.STONE);w.walls[w.idx(x,y)]=0;}
    p.x=cx*TILE+8;p.y=sy*TILE-18;game.cam.x=p.x;game.cam.y=p.y-80;
    const stages=[
      ['starter',I.COPPERSHORT,I.COPPERBOW,I.AMBERSTAFF,I.FLINXSTAFF],
      ['late-pre-Hardmode',I.VOLCANO,I.HELLWINGBOW,I.WATERBOLT,I.IMPSTAFF],
      ['early-Hardmode',I.FROSTBRAND,I.DAEDALUSSTORMBOW,I.CRYSTALSTORM,I.SPIDERSTAFF],
      ['post-mech-Plantera',I.TERRABLADE,I.PULSEBOW,I.RAZORBLADETYPHOON,I.PYGMYSTAFF],
      ['endgame',I.ZENITH,I.PHANTASM,I.LASTPRISM,I.STARDUSTDRAGONSTAFF]
    ];
    const oldRandom=Math.random;Math.random=()=>.5;
    const records=[];
    try{for(const [stage,...ids]of stages){
      const row={stage,classes:[]};
      for(let index=0;index<ids.length;index++){
        const id=ids[index],def=ITEMS[id];
        if(!def){row.classes.push({id,missing:true});continue;}
        game.entities=[];game.projectiles.list=[];game.fxTexts=[];game.fx=[];game.pickups=[];
        p.attackCd=p.swingT=0;p.dying=false;p.mana=p.maxMana=2000;
        p.inventory.slots.fill(null);p.inventory.accessories.fill(null);p.inventory.armor={head:null,chest:null,legs:null};p.inventory.ammo=null;
        p.inventory.slots[0]={id,count:1};p.inventory.selected=0;
        const target=spawnEntity(game,E.ZOMBIE,p.x+40,p.y-6);target.hp=target.maxHp=100000;target.def=0;target.w=target.h=20;
        MOUSE.wx=target.x;MOUSE.wy=target.y;MOUSE.down=true;MOUSE.combatTap=null;
        const item=p.inventory.selectedItem();const beforeMana=p.mana;
        let ammo=null,ammoBefore=null;
        if(index===1){ammo=def.ammo;p.inventory.slots[1]={id:ammo,count:100};ammoBefore=p.inventory.countOf(ammo);}
        function attack(){
          if(index===0)p.tryMelee(game,def,false,item);
          else if(index===1)p.tryShoot(game,def,id,item);
          else if(index===2)p.tryMagic(game,def,id,item);
          else p.tryMinion(game,def,id);
        }
        attack();
        const afterCast={shots:game.projectiles.list.length,minions:game.entities.filter(e=>e.minion).length,mana:p.mana,
          ammo:ammo&&p.inventory.countOf(ammo),hp:target.hp,cooldown:p.attackCd,inventoryItem:p.inventory.countOf(id)};
        const firstCount=afterCast.shots+afterCast.minions;attack();
        const noCooldownDuplicate=firstCount===game.projectiles.list.length+game.entities.filter(e=>e.minion).length;
        for(let i=0;i<30;i++)updateProjectiles();
        const afterMotion={hp:target.hp,shots:game.projectiles.list.length,minions:game.entities.filter(e=>e.minion).length};
        const wire=game.projectiles.list.map(o=>Net.projectileState(o));
        let wireSafe=true;try{JSON.stringify(wire);}catch{wireSafe=false;}
        const fingerprint=JSON.stringify({p:[p.x,p.y,p.hp,p.mana,p.inventory],e:game.entities,projectiles:game.projectiles.list.map(o=>[o.x,o.y,o.life,o.age,o.dmg]),time:game.timeOfDay,bosses:game.bossesDefeated});
        render();
        const unchanged=fingerprint===JSON.stringify({p:[p.x,p.y,p.hp,p.mana,p.inventory],e:game.entities,projectiles:game.projectiles.list.map(o=>[o.x,o.y,o.life,o.age,o.dmg]),time:game.timeOfDay,bosses:game.bossesDefeated});
        row.classes.push({id,name:def.name,type:def.type,index,dmg:def.dmg,speed:def.speed,mode:def.meleeMode||def.magicMode||def.terrainMode||null,
          beforeMana,manaCost:def.mana||0,ammo,ammoBefore,afterCast,afterMotion,noCooldownDuplicate,unchanged,wireSafe});
        MOUSE.down=false;
      }
      records.push(row);
    }}finally{Math.random=oldRandom;MOUSE.down=false;}
    return records;
  });
  for(const row of rows){
    const [melee,ranged,magic,summon]=row.classes;
    check(results,row.stage+': melee responds without changing authored damage/cadence',!melee.missing&&melee.afterCast.cooldown===melee.speed&&melee.afterCast.hp<100000&&melee.afterCast.inventoryItem===1,melee);
    check(results,row.stage+': ranged launches with exactly one compatible ammo cost',!ranged.missing&&ranged.afterCast.shots>0&&ranged.afterCast.ammo===ranged.ammoBefore-1&&ranged.afterCast.cooldown===ranged.speed,ranged);
    check(results,row.stage+': magic responds with one cast mana cost',!magic.missing&&magic.afterCast.shots>0&&magic.afterCast.mana===magic.beforeMana-magic.manaCost,magic);
    check(results,row.stage+': summon remains reusable and distinct from swing/shot',!summon.missing&&summon.afterCast.minions>0&&summon.afterCast.inventoryItem===1,summon);
    check(results,row.stage+': cooldown, rendering and projectile wire contracts preserved',row.classes.every(c=>c.noCooldownDuplicate&&c.unchanged&&c.wireSafe),row.classes.map(c=>({name:c.name,cooldown:c.noCooldownDuplicate,readonly:c.unchanged,wireSafe:c.wireSafe})));
  }
  await assertNoBrowserErrors(results);
  check(results,'Source unchanged during stage fixtures',JSON.stringify(source)===JSON.stringify(hashes()));
  writeFileSync(out+'/results.json',JSON.stringify({...results,source,rows},null,2));
}finally{await finish(results,browser,'combat-stages');}
