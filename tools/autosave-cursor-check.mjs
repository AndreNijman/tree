// Assisted mechanism tests with actual save/load helpers and item catalog.
// Browser timing and natural progression are separate from these fixtures.
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync,mkdirSync,writeFileSync } from 'node:fs';
const source=readFileSync('js/main.js','utf8'),baseline=process.argv.includes('--baseline');
const plain=x=>JSON.parse(JSON.stringify(x));
const results={method:'TEST-ASSISTED Node VM save/restore fixtures; no browser/user saves',checks:[],errors:[]};
function fn(name){const start=source.indexOf('function '+name+'(');assert.ok(start>=0,name);const end=source.indexOf('\nfunction ',start+1);return source.slice(start,end<0?undefined:end);}
const dom=new Map();
const element=id=>{if(!dom.has(id))dom.set(id,{classList:{add(){},remove(){}},style:{}});return dom.get(id);};
let stored=null,writes=0,failWrite=false,recordGate=null;
const box={console,Date,Math,JSON,isFinite,Uint8Array,Uint16Array,Array,btoa,atob,SAVE_FORMAT:1,PATCH:999,Achievements:{unlocked:{}},ACHIEVEMENTS:{},
  $:element,document:{getElementById:element,querySelector:element},captureTownRescues:()=>({}),migrateWorldPatch(){},applySavedSurfaceProfile:()=>true,
  rebuildSavedSurfaceProfile(){},sanitizeBestiary:x=>x||{},spawnEntity(){},spawnNpcs(){},restoreTownRescues(){},restorePetList(){},restoreMinions(){},spawnLunarPillar(){},
  switchPanel(){},renderPanel(){},updateCursorItem(){},showTitleActions(){},renderWorldList(){},makeWorldId:()=>'cursor-fixture',cleanWorldName:x=>x,
  activeWorldId:'cursor-fixture',activeWorldName:'Cursor fixture',saveInFlight:null,accountSync:{signedIn:false},uploadCloudWorld:()=>Promise.resolve(),setSaveMode(){},
  getWorldRecord:async()=>{if(recordGate)await recordGate;return stored;},putWorldRecord:async r=>{if(failWrite)throw new Error('fixture storage failure');stored=plain(r);writes++;},Net:{isClient:()=>false}};
const context=vm.createContext(box);
for(const name of ['const.js','util.js','items.js'])vm.runInContext(readFileSync('js/'+name,'utf8'),context);
const prefixes=source.indexOf('var REFORGE_PREFIXES =');assert.ok(prefixes>=0);
vm.runInContext(source.slice(prefixes,source.indexOf('\n];',prefixes)+3),context);
for(const name of ['packTiles','unpackTiles','saveSnapshot','canSaveGame','saveGame','sanitizeSavedItemIds','sanitizeReforge','applySaveData','openPanel','closePanel','saveAndQuit'])vm.runInContext(fn(name),context);
function fresh(){
  const inv=new context.Inventory();inv.slots.fill(null);
  return context.game={started:true,held:null,panelOpen:true,panelTab:'inventory',entities:[],lunarPillars:[],pickups:[],golf:{},cam:{},bossBars:[],
    world:{W:4,H:4,spawnX:32,spawnY:32,seed:7,evil:'corrupt',difficulty:'normal',tiles:new Uint8Array(16),walls:new Uint8Array(16),surfaceY:[1,1,1,1],guidePos:{x:32,y:32},postGenHp(){},rebuildLights(){}},
    player:{x:32,y:32,dir:1,hp:100,maxHp:100,mana:20,maxMana:20,pets:[],lightPets:[],inventory:inv},message(){},
    addPickup(x,y,item,count,reforge){this.pickups.push({x,y,item,count,...(reforge?{reforge}:{})});}};
}
context.buildGame=()=>fresh();
const bag={id:context.I.BOSSBAG,count:1,bagBoss:'eye',bagDrops:[{id:'wood',count:17}],futureBag:{version:2,rolls:[0,3]}};
const total=(s,id)=>s.player.inventory.slots.reduce((n,v)=>n+(v?.id===id?v.count:0),0)+(s.player.inventory.held?.id===id?s.player.inventory.held.count:0)+s.pickups.reduce((n,v)=>n+(v.item===id?v.count:0),0);
async function check(label,run){
  try{await run();results.checks.push({label,ok:true});console.log('PASS: '+label);}
  catch(e){results.checks.push({label,ok:false,detail:String(e.stack||e)});console.log('FAIL: '+label+' '+e.message);}
  finally{recordGate=null;failWrite=false;context.saveInFlight=null;context.Net.isClient=()=>false;}
}
await check('Cursor stack and nested metadata survive detached read-only snapshot',()=>{
  const g=fresh();g.held=plain(bag);g.player.inventory.slots[4]={id:'wood',count:7};const before=plain(g),s=context.saveSnapshot();
  assert.deepEqual(s.player.inventory.held,bag);assert.deepEqual(plain(g),before);
  g.held.bagDrops[0].count=999;g.player.inventory.slots[4].count=999;assert.equal(s.player.inventory.held.bagDrops[0].count,17);assert.equal(s.player.inventory.slots[4].count,7);
});
await check('100 repeated snapshots never accumulate/move a cursor item',()=>{
  const g=fresh();g.held=plain(bag);const before=plain(g);for(let i=0;i<100;i++){const s=context.saveSnapshot();assert.equal(total(s,bag.id),1);assert.deepEqual(s.player.inventory.held,bag);}assert.deepEqual(plain(g),before);
});
await check('Full 50-slot inventory restores bag/armor/999-stack on accessible cursor',()=>{
  for(const stack of [bag,{id:'wood',count:999},{id:'cobalthelm',count:1}]){const g=fresh();for(let i=0;i<50;i++)g.player.inventory.slots[i]={id:'stone',count:999};g.held=plain(stack);context.applySaveData(context.saveSnapshot());assert.deepEqual(plain(context.game.held),stack);assert.equal(context.game.panelOpen,true);assert.equal(context.game.player.inventory.slots.filter(Boolean).length,50);}
});
await check('Valid reforge survives; invalid prefix is sanitized without item loss',()=>{
  const valid=plain(context.REFORGE_PREFIXES[0]);for(const reforge of [valid,{name:'foreign',dmgMul:99}]){const g=fresh();g.held={id:'coppershort',count:1,reforge,extra:{kept:true}};context.applySaveData(context.saveSnapshot());assert.equal(context.game.held.count,1);assert.deepEqual(plain(context.game.held.extra),{kept:true});assert.deepEqual(plain(context.game.held.reforge||null),reforge.name==='foreign'?null:valid);}
});
await check('Legacy no-held saves load with closed inventory',()=>{fresh();const s=context.saveSnapshot();delete s.player.inventory.held;context.applySaveData(s);assert.equal(context.game.held,null);assert.equal(context.game.panelOpen,false);});
await check('Malformed held IDs and counts are rejected',()=>{
  for(const held of [{id:'foreign',count:1},{id:'wood',count:0},{id:'wood',count:-1},{id:'wood',count:1.1},{id:'wood',count:'1'},{id:'wood',count:1e20},[],true,'wood']){fresh();const s=context.saveSnapshot();s.player.inventory.held=held;context.applySaveData(s);assert.equal(context.game.held,null);}
});
await check('MP client neither inherits host cursor nor serializes its own into world',()=>{fresh().held=plain(bag);const s=context.saveSnapshot();context.Net.isClient=()=>true;context.applySaveData(s);assert.equal(context.game.held,null);assert.equal(context.game.panelOpen,false);context.game.held=plain(bag);assert.equal(context.saveSnapshot().player.inventory.held??null,null);});
await check('Cursor placement during delayed lookup cannot duplicate saved stack',async()=>{
  const g=fresh();g.held={id:'wood',count:37};let release;recordGate=new Promise(r=>release=r);const saving=context.saveGame(true);g.player.inventory.slots[0]=g.held;g.held=null;release();await saving;assert.equal(total(stored.data,'wood'),37);assert.equal(stored.data.player.inventory.slots[0],null);assert.equal(stored.data.player.inventory.held.count,37);
});
await check('Cursor world-drop during delayed lookup cannot duplicate saved pickup',async()=>{
  const g=fresh();g.held={id:'wood',count:37};let release;recordGate=new Promise(r=>release=r);const saving=context.saveGame(true);g.addPickup(32,22,'wood',37);g.held=null;release();await saving;assert.equal(total(stored.data,'wood'),37);assert.equal(stored.data.pickups.length,0);
});
await check('Failed write/retry and concurrent silent saves preserve live cursor',async()=>{
  const g=fresh();g.held=plain(bag);const before=plain(g),n=writes;failWrite=true;assert.equal(await context.saveGame(true),false);assert.equal(writes,n);assert.deepEqual(plain(g),before);failWrite=false;
  let release;recordGate=new Promise(r=>release=r);const a=context.saveGame(true),b=context.saveGame(true);assert.equal(a,b);release();assert.equal(await a,true);assert.equal(writes,n+1);assert.deepEqual(plain(g),before);assert.equal(total(stored.data,bag.id),1);
});
await check('Snapshot preparation failure leaves cursor intact and does not write',async()=>{const g=fresh();g.held=plain(bag);g.held.cycle=g.held;const n=writes;assert.equal(await context.saveGame(true),false);assert.equal(g.held.cycle,g.held);assert.equal(writes,n);});
await check('Boss, Torch God and Old Ones Army still prevent saving',async()=>{for(const setup of [g=>g.torchGod={},g=>g.event={type:'oldonesarmy'},g=>g.entities=[{boss:'eye',dead:false}]]){const g=fresh();g.held=plain(bag);setup(g);const n=writes;assert.equal(await context.saveGame(true),false);assert.equal(writes,n);assert.deepEqual(plain(g.held),bag);}});
await check('Normal panel close and Save & Quit persist exactly one tool',async()=>{fresh().held={id:'copperpick',count:1};context.closePanel();context.saveAndQuit();for(let i=0;i<20&&context.game;i++)await new Promise(r=>setImmediate(r));assert.equal(context.game,null);assert.equal(total(stored.data,'copperpick'),1);assert.equal(stored.data.player.inventory.held??null,null);});
await check('Ten cursor bag load/save cycles preserve metadata and count',()=>{fresh().held=plain(bag);let s=context.saveSnapshot();for(let i=0;i<10;i++){context.applySaveData(s);s=context.saveSnapshot();assert.deepEqual(s.player.inventory.held,bag);assert.equal(total(s,bag.id),1);}});
await check('Direct Save & Quit with held bag snapshots metadata once before closing',async()=>{fresh().held=plain(bag);context.saveAndQuit();for(let i=0;i<20&&context.game;i++)await new Promise(r=>setImmediate(r));assert.equal(context.game,null);assert.equal(total(stored.data,bag.id),1);assert.deepEqual(stored.data.player.inventory.held,bag);});
await check('Explicit save queued behind autosave captures latest state without duplicates',async()=>{
  const g=fresh();g.held={id:'wood',count:37};let release;recordGate=new Promise(r=>release=r);const n=writes,auto=context.saveGame(true);g.player.inventory.slots[0]=g.held;g.held=null;const explicit=context.saveGame(false);release();assert.equal(await auto,true);assert.equal(await explicit,true);assert.equal(writes,n+2);assert.equal(total(stored.data,'wood'),37);assert.equal(stored.data.player.inventory.held??null,null);assert.equal(stored.data.player.inventory.slots[0].count,37);
});
mkdirSync('test-results/audit2',{recursive:true});writeFileSync(`test-results/audit2/autosave-cursor${baseline?'-baseline':''}.json`,JSON.stringify(results,null,2));
console.log(`${results.checks.filter(c=>c.ok).length}/${results.checks.length} checks passed`);
if(results.checks.some(c=>!c.ok)||results.errors.length)process.exitCode=1;
