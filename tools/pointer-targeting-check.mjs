// Synthetic input/camera fixtures; these do not establish organic progression.
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync,writeFileSync,mkdirSync } from 'node:fs';
const source=readFileSync('js/main.js','utf8');
const results={method:'TEST-ASSISTED Node VM input/camera fixtures using actual source helpers',checks:[],errors:[]};
const baseline=process.argv.includes('--baseline');
function check(label,run){
  try{run();results.checks.push({label,ok:true});console.log('PASS: '+label);}
  catch(e){results.checks.push({label,ok:false,detail:String(e.message||e)});console.log('FAIL: '+label+' '+e.message);}
}
function extract(name){
  const start=source.indexOf('function '+name+'(');assert.ok(start>=0,'Missing helper '+name);
  const end=source.indexOf('\n}',start);assert.ok(end>start);return source.slice(start,end+2);
}
check('Pointer refresh and real-event helpers exist',()=>{extract('refreshPointerWorld');extract('rememberPointer');});
if(results.checks[0].ok){
  let rect={left:0,top:0,width:1280,height:800};const handlers={};
  const box={canvas:{width:1280,height:800,getBoundingClientRect:()=>rect},MOUSE:{x:0,y:0,wx:0,wy:0,tpx:-1,tpy:-1,wheel:0},TILE:16,
    game:{started:true,cam:{x:12000,y:6000},player:{x:12000,y:6010}},document:{addEventListener:(name,handler)=>handlers[name]=handler},
    window:{innerWidth:1440,innerHeight:900},KEY:{},KEY_JUST:{},AudioSys:{init(){},resume(){}},
    $:()=>({classList:{contains:()=>true},style:{}}),lerp:(a,b,t)=>a+(b-a)*t,clamp:(v,a,b)=>Math.max(a,Math.min(b,v))};
  const context=vm.createContext(box),run=code=>vm.runInContext(code,context);
  run('var pointerKnown=false;\n'+['refreshPointerWorld','rememberPointer','initInput','updateCamera','resize','step'].map(extract).join('\n'));
  const correct=()=>{
    const wx=(box.MOUSE.x-rect.left)*box.canvas.width/rect.width-box.canvas.width/2+box.game.cam.x;
    const wy=(box.MOUSE.y-rect.top)*box.canvas.height/rect.height-box.canvas.height/2+box.game.cam.y;
    assert.equal(box.MOUSE.wx,wx);assert.equal(box.MOUSE.wy,wy);assert.equal(box.MOUSE.tpx,Math.floor(wx/16));assert.equal(box.MOUSE.tpy,Math.floor(wy/16));
  };
  check('Unknown pointer preserves initial sentinel',()=>{run('refreshPointerWorld()');assert.equal(box.MOUSE.tpx,-1);assert.equal(box.MOUSE.wx,0);});
  check('Physical-event coordinates map to world/tile',()=>{run('initInput()');handlers.mousemove({clientX:920,clientY:400});correct();assert.equal(box.MOUSE.x,920);});
  check('Stationary pointer follows horizontal/vertical camera including negative tiles',()=>{for(const cam of [{x:12130,y:5980},{x:11900,y:6010},{x:-300,y:-500}]){box.game.cam=cam;run('refreshPointerWorld()');correct();}});
  check('Canvas offset/scaling keeps HUD and map client coordinates unchanged',()=>{rect={left:100,top:50,width:640,height:400};handlers.mousemove({clientX:420,clientY:250});correct();assert.equal(box.MOUSE.wx,box.game.cam.x);assert.equal(box.MOUSE.x,420);});
  check('Outside pointer remains extrapolated instead of snapping onto edge terrain',()=>{handlers.mousemove({clientX:80,clientY:20});correct();assert.ok(box.MOUSE.wx<box.game.cam.x-box.canvas.width/2);});
  check('Zero-size canvas/no-game cannot create invalid coordinates',()=>{const before={...box.MOUSE};rect.width=0;run('refreshPointerWorld()');assert.deepEqual(box.MOUSE,before);rect.width=640;const g=box.game;box.game=null;try{run('refreshPointerWorld()');assert.deepEqual(box.MOUSE,before);}finally{box.game=g;}});
  check('Mousedown supplies its own position without prior move',()=>{run('pointerKnown=false');handlers.mousedown({clientX:500,clientY:300,button:2});correct();assert.equal(box.MOUSE.rightJust,true);});
  check('Refresh does not mutate gameplay, change smart state or consume RNG',()=>{box.game.player.smartMine=true;const before=JSON.stringify(box.game);run('Math.random=function(){throw new Error("Unexpected RNG");};for(var i=0;i<100;i++)refreshPointerWorld();');assert.equal(JSON.stringify(box.game),before);correct();});
  check('Paused viewport resize refreshes without resuming gameplay',()=>{box.game.paused=true;rect={left:0,top:0,width:1440,height:900};run('resize()');correct();assert.equal(box.game.paused,true);box.game.paused=false;});
  check('Focused editable controls retain gameplay key guards',()=>{for(const target of [{tagName:'INPUT'},{tagName:'SELECT'},{tagName:'TEXTAREA'},{isContentEditable:true}]){handlers.keydown({key:'d',target});assert.equal(box.KEY.d,undefined);}handlers.keydown({key:'Control',target:{tagName:'CANVAS'}});assert.equal(box.KEY_JUST.Control,true);});
  check('Refresh ordering covers network clients, player actions, camera, right-click and UI',()=>{
    const observed=[];
    for(const name of ['handleKeys','updateMessage','updateFlash','updateProjectiles','updatePickups','updateFx','checkDawn','updateWeather','updateStarfall','updateSpawning','updateCritterSpawning','updateStrangePlants','updateDungeonGuardian','updateBulbs','updateCultistRitual','updateEvents','updateTorchGod','updateGolf','checkAchievements','updateTownArrivals','updateTownRescues','validateHousingAssignments','updateTownTax','updateHotbar','updateHud','updateBossBars','updateInteract'])box[name]=()=>{};
    box.Time={seconds:0,frame:0};box.Net={isClient:()=>true,update:()=>{box.game.cam.x+=83;}};
    Object.assign(box.game,{autosaveT:0,entities:[],timeOfDay:.4,townArrivalT:5,housingT:5,world:{W:4200,H:1200,findStations(){},spawnX:12000,spawnY:6000}});
    box.game.player={x:12000,y:6010,update:()=>{correct();observed.push('player');box.game.player.x+=3;}};
    box.tryActivateEterniaStand=()=>{correct();observed.push('right');return true;};box.updateCrosshair=()=>{correct();observed.push('UI');};box.MOUSE.down=false;box.MOUSE.rightJust=true;
    run('step(1/60)');correct();assert.deepEqual(observed,['player','right','UI']);
  });
}
mkdirSync('test-results/audit2',{recursive:true});
writeFileSync(`test-results/audit2/pointer-targeting${baseline?'-baseline':''}.json`,JSON.stringify(results,null,2));
console.log(`${results.checks.filter(c=>c.ok).length}/${results.checks.length} checks passed`);
if(results.checks.some(c=>!c.ok)||results.errors.length)process.exitCode=1;
