// Focused mechanism regression, not an earned gameplay/progression test.
// Uses the actual biome and Guardian helpers in an isolated Node VM.
import { readFileSync,writeFileSync,mkdirSync } from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

const root = path.resolve(process.env.TREE_SOURCE_ROOT || process.cwd());
const baseline = process.argv.includes('--baseline');
const results = { source:root,method:'TEST-ASSISTED synthetic local terrain/Guardian fixtures with actual frozen/current helper functions; no browser or user saves',checks:[],errors:[] };
const context = vm.createContext({ console,Math });
vm.runInContext(readFileSync(path.join(root,'js/const.js'),'utf8'),context);
vm.runInContext(readFileSync(path.join(root,'js/world.js'),'utf8'),context);
const main = readFileSync(path.join(root,'js/main.js'),'utf8');
const start = main.indexOf('function updateDungeonGuardian() {');
const end = main.indexOf('\nfunction isAmbientCritter',start);
if(start < 0 || end < 0)throw new Error('Guardian helper boundary missing');
vm.runInContext(main.slice(start,end),context);
vm.runInContext(`
var game;
function clamp(v,a,b) { return Math.max(a,Math.min(b,v)); }
function spawnEntity(g,type,x,y) { var e={type:type,x:x,y:y,dead:false};g.entities.push(e);return e; }
function scene(localDungeon,open) {
  var w=Object.create(World.prototype);
  w.W=100;w.H=100;w.tiles=new Uint16Array(10000);w.walls=new Uint8Array(10000);w.surfaceY=new Int16Array(100);w.surfaceY.fill(40);
  w.hellY=95;w.dungeonOpen=!!open;w.dungeonRect={x0:10,x1:90,y0:20,y1:90};
  w._bands=[[0,1,BIOME.FOREST]];w.jungleLeft=true;
  if(localDungeon) for(var x=47;x<=49;x++)w.tiles[w.idx(x,50)]=T.DUNGEONBRICK;
  game={world:w,player:{x:50*TILE+8,y:50*TILE+8},entities:[]};
  return game;
}
function live() { return game.entities.filter(function(e){return !e.dead && e.type===E.DUNGEONGUARDIAN;}); }
`,context);
function check(label,code) {
  const detail=vm.runInContext(code,context), ok=!!detail.ok;
  results.checks.push({label,ok,detail});console.log(`${ok?'PASS':'FAIL'}: ${label} ${JSON.stringify(detail)}`);
}
check('Unopened global rectangle does not summon Guardian in local forest',`(function(){scene(false,false);updateDungeonGuardian();return {ok:live().length===0,biome:game.world.biomeAt(game.player.x,game.player.y),guardians:live().length};})()`);
check('Actual local Dungeon still summons exactly one Guardian before Skeletron',`(function(){scene(true,false);updateDungeonGuardian();updateDungeonGuardian();return {ok:live().length===1,biome:game.world.biomeAt(game.player.x,game.player.y),guardians:live().length};})()`);
check('Opening Dungeon prevents spawn and clears an existing Guardian',`(function(){scene(true,false);updateDungeonGuardian();game.world.dungeonOpen=true;updateDungeonGuardian();return {ok:live().length===0};})()`);
check('Leaving local Dungeon despawns Guardian while still inside its coarse rectangle',`(function(){scene(true,false);updateDungeonGuardian();game.world.tiles.fill(T.AIR);updateDungeonGuardian();return {ok:live().length===0,biome:game.world.biomeAt(game.player.x,game.player.y)};})()`);
check('Surface entrance exclusion is preserved even with nearby dungeon bricks',`(function(){scene(true,false);game.world.dungeonRect.y0=47;updateDungeonGuardian();return {ok:live().length===0};})()`);
check('Outside rectangle remains protected even when local biome reports Dungeon',`(function(){scene(true,false);game.world.dungeonRect.x1=49;updateDungeonGuardian();return {ok:live().length===0};})()`);
const errors=[];
for(const x of [9,10,50,90,91])for(const y of [20,24,24.01,50,89.99,90])for(const local of [false,true])for(const open of [false,true]){
  const detail=vm.runInContext(`(function(){scene(${local},${open});var w=game.world;game.player.x=${x}*TILE;game.player.y=${y}*TILE;
    w.tiles.fill(T.AIR);if(${local}){var px=Math.floor(game.player.x/TILE),py=Math.floor(game.player.y/TILE);for(var dx=-2;dx<=0;dx++)w.tiles[w.idx(px+dx,py)]=T.DUNGEONBRICK;}
    var inside=${x}>=10&&${x}<=90&&${y}>24&&${y}<90;
    var expected=!${open}&&inside&&w.biomeAt(game.player.x,game.player.y)===BIOME.DUNGEON;
    updateDungeonGuardian();return {expected:expected,actual:live().length>0};})()`,context);
  if(detail.expected!==detail.actual)errors.push({x,y,local,open,...detail});
}
results.checks.push({label:'120 rectangle/depth/biome/open-state boundary combinations',ok:errors.length===0,detail:{cases:120,errors}});
console.log(`${errors.length?'FAIL':'PASS'}: 120 boundary combinations (${errors.length} mismatches)`);
results.passed=results.checks.filter(c=>c.ok).length;results.total=results.checks.length;results.ok=results.passed===results.total;
mkdirSync('test-results/audit2',{recursive:true});
writeFileSync(`test-results/audit2/dungeon-guardian${baseline?'-baseline':''}.json`,JSON.stringify(results,null,2));
console.log(`${results.passed}/${results.total} checks passed`);
if(!results.ok)process.exitCode=1;
