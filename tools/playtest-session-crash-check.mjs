// Real owned-process loss, not gameplay progression. All browser saves are the
// isolated disposable checkpoint from playtest-session-browser-check.mjs.
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { mkdir, mkdtemp } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { atomic, json, loadCheckpoint } from './playtest/session-store.mjs';

const workspace=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const previous=await json(path.join(workspace,'test-results/playtest-session-browser-check/results.json'));
assert.equal(previous.errors.length,0,'Run the browser infrastructure check successfully first.');
const input=await loadCheckpoint(previous.directory);
const tempBase=process.platform==='win32'?path.join(process.env.LOCALAPPDATA,'Temp','opencode'):tmpdir();
const root=await mkdtemp(path.join(tempBase,'tree-resume-crash-')),lane='disposable-crash-check',directory=path.join(root,lane);
const env={...process.env,TREE_PLAYTEST_SESSIONS:root};
const report={method:'Synthetic owner identities and actual loss of owned disposable browser/controller processes. Not gameplay coverage.',root,checks:[],errors:[]};
const out=path.join(workspace,'test-results/playtest-session-crash-check');await mkdir(out,{recursive:true});
let child;
function cli(args) {
  const run=spawnSync(process.execPath,['tools/playtest-session.mjs',...args],{cwd:workspace,env,encoding:'utf8',timeout:30000});
  if(run.status!==0)throw new Error(run.stderr || run.stdout || 'CLI failed');return JSON.parse(run.stdout);
}
async function api(body) {
  const c=await json(path.join(directory,'connection.json'));
  const response=await fetch(c.endpoint,{method:'POST',headers:{Authorization:'Bearer '+c.secret,'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(30000)});
  const value=await response.json();if(!response.ok || !value.ok)throw new Error(value.error || 'Request failed');return value.result;
}
async function start() {
  const processChild=spawn(process.execPath,['tools/playtest-session.mjs','start','--lane',lane,'--restore'],{cwd:workspace,env,stdio:['ignore','pipe','pipe'],detached:process.platform!=='win32'});
  let stdout='',stderr='';processChild.stdout.on('data',b=>stdout+=b);processChild.stderr.on('data',b=>stderr+=b);
  child=processChild;
  await new Promise((resolve,reject)=>{
    const timeout=setTimeout(()=>reject(new Error('Startup timeout: '+stderr)),60000);
    processChild.once('exit',(code)=>{clearTimeout(timeout);reject(new Error('Exited before ready '+code+': '+stderr));});
    processChild.stdout.on('data',()=>{if(stdout.split('\n').some(line=>{try{return JSON.parse(line).ready;}catch{return false;}})){clearTimeout(timeout);resolve();}});
  });
  return processChild;
}
async function exited(p) {
  if(p.exitCode!==null || p.signalCode!==null)return;
  await new Promise((resolve,reject)=>{const t=setTimeout(()=>reject(new Error('Owned controller did not exit after browser loss.')),20000);p.once('exit',()=>{clearTimeout(t);resolve();});});
}
function killOwnedTree(pid) {
  if(process.platform==='win32') {
    const r=spawnSync('taskkill.exe',['/PID',String(pid),'/T','/F'],{encoding:'utf8'});assert.equal(r.status,0,r.stderr || r.stdout);
  } else process.kill(-pid,'SIGKILL');
}
async function check(label,fn) {
  try{await fn();report.checks.push({label,ok:true});console.log('PASS '+label);}
  catch(e){report.checks.push({label,ok:false,error:String(e.stack||e)});throw e;}
}
try {
  await check('Offline registration preserves the original export and exact persisted identity',async()=>{
    const r=cli(['register','--lane',lane,'--source',previous.source,'--storage',path.join(input.target,'storage.json'),'--goal','Crash-recovery verification']);
    assert.equal(r.persisted.seed,previous.seed);assert.equal(r.persisted.worldId,previous.persisted.worldId);
    const h=cli(['handoff','--lane',lane]);assert.equal(h.handoff.possibleUnsavedProgress,true);assert.equal(h.handoff.recovery.liveStateUnknown,true);
  });
  await check('Duplicate registration cannot overwrite an existing lane',async()=>{
    const before=await loadCheckpoint(directory);
    const r=spawnSync(process.execPath,['tools/playtest-session.mjs','register','--lane',lane,'--source',previous.source,'--storage',path.join(input.target,'storage.json')],{cwd:workspace,env,encoding:'utf8'});
    assert.notEqual(r.status,0);assert.equal((await loadCheckpoint(directory)).handoff.checkpoint,before.handoff.checkpoint);
  });
  await start();
  await check('Local control endpoint refuses missing credentials and browser-origin requests',async()=>{
    const c=await json(path.join(directory,'connection.json'));
    const a=await fetch(c.endpoint,{method:'POST',body:'{"op":"status"}'});assert.equal(a.status,403);
    const b=await fetch(c.endpoint,{method:'POST',headers:{Authorization:'Bearer '+c.secret,Origin:'http://other.invalid'},body:'{"op":"status"}'});assert.equal(b.status,403);
  });
  if(process.platform==='win32')await check('Actual browser-process loss exits controller and releases its lock',async()=>{
    const processes=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-Command','Get-CimInstance Win32_Process | Select-Object ProcessId,ParentProcessId,Name | ConvertTo-Json -Compress'],{encoding:'utf8',maxBuffer:4*1024*1024});
    assert.equal(processes.status,0);const all=JSON.parse(processes.stdout);
    const rootBrowser=all.find(p=>p.ParentProcessId===child.pid && /^(chrome|chrome-headless-shell)\.exe$/i.test(p.Name));
    assert.ok(rootBrowser,'Only a verified direct browser child may be killed.');
    const p=child;killOwnedTree(rootBrowser.ProcessId);await exited(p);child=null;
    assert.equal((await json(path.join(directory,'live.json'))).status,'browser-lost');
    assert.equal((await loadCheckpoint(directory)).handoff.persisted.seed,previous.seed);
  });
  if(child){await api({op:'stop'});await exited(child);child=null;}
  await check('A new controller restores immediately after browser-loss cleanup',async()=>{
    await start();const h=(await loadCheckpoint(directory)).handoff;
    assert.equal(h.recovery.restoreVerified,true);assert.equal(h.live.seed,previous.seed);assert.equal(h.liveInventoryFingerprint,previous.persisted.inventoryFingerprint);
  });
  await check('Hard-killed controller/browser tree leaves a usable committed recovery packet',async()=>{
    const ticket=await api({op:'claim',owner:'model-before-crash'});
    const r=await api({op:'action',ticket,requestId:'move-before-crash',action:{type:'input',keys:['d'],ms:200}});
    assert.equal(r.ok,true,r.error);assert.equal(r.handoff.possibleUnsavedProgress,true);
    report.preCrashLive=r.handoff.live;report.persisted=r.handoff.persisted;
    const p=child;killOwnedTree(p.pid);await exited(p);child=null;
    assert.equal((await loadCheckpoint(directory)).handoff.checkpoint,r.handoff.checkpoint);
  });
  await check('Dead-process lock recovery restores saved state and explicitly flags possible rollback',async()=>{
    await start();const h=(await loadCheckpoint(directory)).handoff;
    assert.equal(h.recovery.restoreVerified,true);assert.equal(h.recovery.lostLiveStatePossible,true);
    assert.equal(h.liveInventoryFingerprint,report.persisted.inventoryFingerprint);
    assert.equal(h.live.seed,previous.seed);report.recovery=h.recovery;
  });
  await check('A different model claims the recovered controller without a fresh world',async()=>{
    const t=await api({op:'claim',owner:'other-provider-model'});assert.equal(t.owner,'other-provider-model');
    await api({op:'pause',reason:'Crash check finished'});const status=await api({op:'status'});assert.equal(status.frozen,true);assert.equal(status.owner.owner,null);
  });
  await api({op:'stop'});await exited(child);child=null;
  await check('Pause-all recognizes already stopped lanes without falsely reporting active gameplay',async()=>{
    const result=cli(['pause-all']);assert.equal(result[0].inactive,true);assert.equal(result[0].status,'stopped');
  });
} catch(e) {report.errors.push(String(e.stack||e));console.error(e.stack||e);process.exitCode=1;}
finally {
  if(child){try{await api({op:'stop'});await exited(child);}catch{killOwnedTree(child.pid);}}
  report.completed=new Date().toISOString();await atomic(path.join(out,'results.json'),report);
  console.log(`${report.checks.filter(c=>c.ok).length}/${report.checks.length} crash/CLI cases passed; errors=${report.errors.length}`);
}
