// Freeze the game's current source before a long sweep so later artwork edits
// cannot mix an older imported probe with a newer browser renderer.
// This runs only the explicit read-only test list below: never pruning/deploy tools.
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, symlinkSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';

function hashes(directory,prefix = '') {
  const out = {};
  for (const entry of readdirSync(directory,{ withFileTypes:true })) {
    if (!prefix && entry.name === 'node_modules') continue;
    const file = path.join(directory,entry.name), key = prefix + entry.name;
    if (entry.isDirectory()) Object.assign(out,hashes(file,key + '/'));
    else if (entry.isFile()) out[key] = createHash('sha256').update(readFileSync(file)).digest('hex');
  }
  return out;
}
function sourceState(directory) {
  const out = {};
  for (const name of ['js','css','assets','tools']) Object.assign(out,hashes(path.join(directory,name),name + '/'));
  for (const name of ['index.html','package.json','og-image.png']) out[name] = createHash('sha256').update(readFileSync(path.join(directory,name))).digest('hex');
  return out;
}
function sameSource(a,b) { return Object.keys(a).length === Object.keys(b).length && Object.entries(a).every(([name,hash]) => b[name] === hash); }
function plan(gameplay,graphics,http) {
  return gameplay.map(name => ({ name,file:'tools/audit2/' + name + '.mjs',suite:true }))
    .concat(graphics.map(name => ({ name:name.replace(/-check$/,''),file:'tools/' + name + '.mjs',suite:true })),
      http.map(name => ({ name:name + '-http-smoke',file:'tools/' + name + '-http-smoke.mjs',suite:false })));
}
const gameplay = ['world','events','town','fight','fate','fishtest','b2b5check','b6quick','b6icons','reach','sanitizesave'];
const graphics = ['graphics-check','combat-graphics-check','player-controls-check','etherian-graphics-check','jungle-graphics-check','hallow-graphics-check',
  'evil-graphics-check','snow-graphics-check','desert-graphics-check','mummy-graphics-check','underground-graphics-check','dungeon-graphics-check',
  'underworld-graphics-check','lava-graphics-check','segmented-graphics-check','sky-sand-graphics-check','flyer-graphics-check','aquatic-graphics-check',
  'crawler-graphics-check','goblin-graphics-check','ranged-goblin-graphics-check','pirate-graphics-check','frost-legion-graphics-check',
  'martian-infantry-graphics-check','martian-heavy-graphics-check','martian-special-graphics-check','pumpkin-moon-graphics-check','frost-moon-infantry-graphics-check','frost-moon-heavy-graphics-check','present-mimic-graphics-check','eclipse-base-graphics-check'];
const http = ['segmented','sky-sand','flyer','aquatic','crawler','goblin','ranged-goblin','pirate','frost-legion','martian-infantry','martian-heavy','martian-special','pumpkin-moon','frost-moon-infantry','frost-moon-heavy','present-mimic','eclipse-base'];
let snapshot, report, result, manifest, commands;
if (process.argv[2] === '--resume') {
  if (!process.argv[3]) throw new Error('Supply the existing summary.json path.');
  manifest = path.resolve(process.argv[3]); result = JSON.parse(readFileSync(manifest,'utf8'));
  ({ snapshot,report } = result);
  if (!sameSource(result.sourceHashes,sourceState(snapshot))) throw new Error('Frozen source changed; refusing to reuse completed checks.');
  if (!result.plan) {
    // Older manifests predate saved plans. Recover their exact frozen allowlist,
    // not today's expanded roster, without executing the old runner.
    const text = readFileSync(path.join(snapshot,'tools','graphics-regression-snapshot.mjs'),'utf8');
    const list = (key,http = false) => {
      const match = text.match(new RegExp('const ' + key + ' = (\\[[\\s\\S]*?\\])' + (http ? '\\s*\\.map' : ';')));
      if (!match) throw new Error('Cannot recover frozen test list: ' + key);
      const values = JSON.parse(match[1].replace(/'/g,'"'));
      if (!values.every(s => typeof s === 'string' && /^[a-z0-9-]+$/.test(s))) throw new Error('Invalid frozen test list.');
      return values;
    };
    result.plan = plan(list('gameplay'),list('graphics'),list('http',true));
  }
  commands = result.plan;
  result.resumedAt = new Date().toISOString(); result.ok = false;
} else {
  const root = process.cwd(), label = process.argv[2] || 'graphics';
  if (!/^[a-z0-9-]+$/.test(label)) throw new Error('Use a simple lowercase snapshot label.');
  const temp = process.platform === 'win32' && process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA,'Temp','opencode') : path.join(tmpdir(),'opencode');
  mkdirSync(temp,{ recursive:true }); snapshot = mkdtempSync(path.join(temp,'tree-' + label + '-'));
  report = path.join(root,'test-results','audit2','sweeps',label + '-' + Date.now()); mkdirSync(report,{ recursive:true });
  for (const name of ['index.html','package.json','og-image.png','js','css','assets','tools']) cpSync(path.join(root,name),path.join(snapshot,name),{ recursive:true });
  // Reuse installed dependencies without running installers or altering files.
  symlinkSync(path.join(root,'node_modules'),path.join(snapshot,'node_modules'),process.platform === 'win32' ? 'junction' : 'dir');
  commands = plan(gameplay,graphics,http);
  result = { label,startedAt:new Date().toISOString(),seed:7357,snapshot,report,sourceHashes:sourceState(snapshot),plan:commands,commands:[],ok:false };
  manifest = path.join(report,'summary.json');
}
writeFileSync(manifest,JSON.stringify(result,null,2));
console.log('Frozen source: ' + snapshot);
console.log('Reports: ' + report);
for (const command of commands) {
  const previous = result.commands.find(c => c.name === command.name);
  if (previous?.ok && existsSync(path.join(report,command.name + '.json'))) { console.log('KEEP ' + command.name + ': completed'); continue; }
  const completedFile = path.join(snapshot,'test-results','audit2',command.name + '.json');
  if (!previous && existsSync(completedFile)) {
    // finish() may have saved its complete result just before the restart.
    let saved = null; try { saved = JSON.parse(readFileSync(completedFile,'utf8')); } catch {}
    const checks = command.suite && Array.isArray(saved?.checks) ? saved.checks : [];
    if (Array.isArray(saved?.errors) && !saved.errors.length && (command.suite ? checks.length > 0 && checks.every(c => c.ok === true) : saved?.ok === true)) {
      cpSync(completedFile,path.join(report,command.name + '.json'));
      result.commands.push({ ...command,ok:true,status:0,passed:checks.length,total:checks.length,browserErrors:0,parseError:null,recovered:true });
      writeFileSync(manifest,JSON.stringify(result,null,2)); console.log('KEEP ' + command.name + ': recovered completed result'); continue;
    }
  }
  const child = spawnSync(process.execPath,[command.file],{ cwd:snapshot,env:{ ...process.env,SEED:'7357' },encoding:'utf8',windowsHide:true,maxBuffer:32 * 1024 * 1024 });
  writeFileSync(path.join(report,command.name + '.log'),(child.stdout || '') + (child.stderr || '') + (child.error ? '\n' + child.error.stack : ''));
  const file = path.join(snapshot,'test-results','audit2',command.name + '.json');
  let data = null, parseError = null;
  try { data = JSON.parse(readFileSync(file,'utf8')); cpSync(file,path.join(report,command.name + '.json')); }
  catch (error) { parseError = error.message; }
  const checks = command.suite && Array.isArray(data?.checks) ? data.checks : [];
  const passed = checks.filter(c => c.ok === true).length;
  const ok = child.status === 0 && !parseError && Array.isArray(data?.errors) && data.errors.length === 0 &&
    (command.suite ? checks.length > 0 && passed === checks.length : data?.ok === true);
  const record = { ...command,ok,status:child.status,passed,total:checks.length,browserErrors:data?.errors?.length ?? null,parseError };
  if (previous) result.commands[result.commands.indexOf(previous)] = record; else result.commands.push(record);
  writeFileSync(manifest,JSON.stringify(result,null,2));
  console.log((ok ? 'PASS ' : 'FAIL ') + command.name + (command.suite ? `: ${passed}/${checks.length}` : ': HTTP smoke'));
}
const suites = result.commands.filter(c => c.suite);
result.passed = suites.reduce((n,c) => n + c.passed,0);
result.total = suites.reduce((n,c) => n + c.total,0);
result.suites = suites.length;
result.httpSmokes = result.commands.filter(c => !c.suite).length;
result.finishedAt = new Date().toISOString();
// Probes must not change the frozen code. Test outputs live outside these roots.
result.sourceUnchanged = sameSource(result.sourceHashes,sourceState(snapshot));
result.ok = result.sourceUnchanged && result.commands.length === commands.length && result.commands.every(c => c.ok);
const captures = path.join(snapshot,'test-results','graphics');
if (existsSync(captures)) cpSync(captures,path.join(report,'graphics'),{ recursive:true });
writeFileSync(manifest,JSON.stringify(result,null,2));
console.log(`${result.passed}/${result.total} checks across ${result.suites} suites; ${result.httpSmokes} HTTP smokes; source unchanged: ${result.sourceUnchanged}; ${result.ok ? 'PASS' : 'FAIL'}`);
if (!result.ok) process.exitCode = 1;
