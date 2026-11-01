// Infrastructure verification against unchanged game bytes. No grants, scripted
// kills, manual stepping, seed injection, teleportation, or production saves.
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { startSession } from './playtest/session-runtime.mjs';
import { atomic, loadCheckpoint, sameHashes, sourceHashes } from './playtest/session-store.mjs';

const source=process.argv[2];
if(!source || !path.isAbsolute(source))throw new Error('Supply the absolute immutable source directory as the first argument.');
const base=process.platform==='win32'?path.join(process.env.LOCALAPPDATA,'Temp','opencode'):tmpdir();
const directory=await mkdtemp(path.join(base,'tree-resume-browser-'));
const out=path.resolve('test-results/playtest-session-browser-check');await mkdir(out,{recursive:true});
const result={method:'Instrumented real-input infrastructure test: synthetic owner labels, unchanged game, isolated disposable world',source,directory,checks:[],errors:[]};
const before=await sourceHashes(source);
let session;
async function check(label,fn){try{await fn();result.checks.push({label,ok:true});console.log('PASS '+label);}catch(e){result.checks.push({label,ok:false,error:String(e.stack||e)});throw e;}}
try {
  session=await startSession({directory,source,lane:'resume-browser-check',leaseMs:2500,goal:'Verify transferable paused sessions'});
  await check('Controller starts browser-frozen with a committed menu handoff',async()=>{
    assert.equal(session.status().frozen,true);const cp=await loadCheckpoint(directory);assert.equal(cp.handoff.live.started,false);
  });
  let ticket=await session.request({op:'claim',owner:'luna-session-a'});
  await check('Real menu world creation checkpoints the actual seed/inventory',async()=>{
    const r=await session.request({op:'action',ticket,requestId:'new-1',action:{type:'new',name:'Disposable resume verification'}});
    assert.equal(r.ok,true,r.error);assert.equal(r.handoff.live.started,true);assert.equal(r.handoff.live.inventory.slots[1].id,'copperpick');
    result.seed=r.handoff.live.seed;
  });
  // Slow world creation can exceed the deliberately short test lease.
  if((await session.request({op:'status'})).owner.owner)await session.request({op:'pause',reason:'test handoff after startup'});
  ticket=await session.request({op:'claim',owner:'luna-session-a'});
  await check('Frozen browser retains exact observed gameplay state while no model acts',async()=>{
    const a=await session.observe();await new Promise(r=>setTimeout(r,500));const b=await session.observe();assert.deepEqual(b,a);
  });
  await check('A physical input action releases keys and freezes again',async()=>{
    const r=await session.request({op:'action',ticket,requestId:'walk-1',action:{type:'input',keys:['d'],ms:300}});
    assert.equal(r.ok,true,r.error);assert.equal(session.status().frozen,true);result.afterWalk=r.handoff.live;
  });
  await check('Completed request ID returns its receipt instead of replaying movement',async()=>{
    const a=await session.observe();const r=await session.request({op:'action',ticket,requestId:'walk-1',action:{type:'input',keys:['d'],ms:300}});
    assert.equal(r.ok,true);assert.deepEqual(await session.observe(),a);
  });
  await check('Pause releases ownership and another model retains the same live state',async()=>{
    const a=await session.observe();await session.request({op:'note',ticket,notes:{goal:'Continue earned world',nextSteps:['Gather wood'],evidence:['events.jsonl']}});
    await session.request({op:'pause',reason:'simulated user pause'});
    const old=ticket;ticket=await session.request({op:'claim',owner:'different-provider-model-b'});
    assert.deepEqual(await session.observe(),a);
    await assert.rejects(session.request({op:'action',ticket:old,action:{type:'input',keys:['a'],ms:1}}),/Stale|expired/);
    assert.deepEqual((await loadCheckpoint(directory)).handoff.notes.nextSteps,['Gather wood']);
  });
  await check('Usage-limit abandonment expires the owner without advancing gameplay',async()=>{
    const a=await session.observe();await new Promise(r=>setTimeout(r,3500));
    assert.equal((await session.request({op:'status'})).owner.owner,null);assert.deepEqual(await session.observe(),a);
    ticket=await session.request({op:'claim',owner:'third-model-c'});
  });
  await check('Explicit normal Save & Quit creates a verifiable persisted checkpoint',async()=>{
    const r=await session.request({op:'action',ticket,requestId:'save-1',action:{type:'save-quit'}});
    assert.equal(r.ok,true,r.error);assert.equal(r.handoff.persisted.verified,true);result.persisted=r.handoff.persisted;
  });
  await check('Managed stop retains a complete recovery packet instead of deleting evidence',async()=>{
    await session.stop();session=null;assert.equal((await loadCheckpoint(directory)).handoff.persisted.verified,true);
  });
  await check('Another controller restores the exact saved world, inventory and next steps',async()=>{
    session=await startSession({directory,source,lane:'resume-browser-check',restore:true});
    const h=(await loadCheckpoint(directory)).handoff;
    assert.equal(h.live.seed,result.seed);assert.equal(h.live.worldId,result.persisted.worldId);
    assert.equal(h.recovery.restoreVerified,true);assert.equal(h.liveInventoryFingerprint,result.persisted.inventoryFingerprint);
    assert.deepEqual(h.notes.nextSteps,['Gather wood']);assert.equal(h.recovery.type,'persisted-save-only');
  });
  await check('Paused screenshot captures actual PNG without advancing gameplay',async()=>{
    const owner=await session.request({op:'claim',owner:'canvas-capture-check'}),a=await session.observe();
    const r=await session.request({op:'action',ticket:owner,action:{type:'screenshot'}});
    assert.equal(r.ok,true,r.error);assert.deepEqual(await session.observe(),a);
    const cp=await loadCheckpoint(directory),bytes=await readFile(path.join(cp.target,'screen.png'));
    assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
    assert.ok(['browser-page','game-canvas-only'].includes(cp.handoff.screenshotKind));
    if(cp.handoff.screenshotKind==='game-canvas-only')assert.ok(cp.handoff.screenshotCaveat.includes('excludes HTML HUD'));
    result.screenshotKind=cp.handoff.screenshotKind;
  });
  await check('Served game files and source hashes remain pinned/unchanged',async()=>{
    const cp=await loadCheckpoint(directory);assert.ok(cp.handoff.servedFiles.includes('js/main.js'));
    assert.ok(sameHashes(before,await sourceHashes(source)));
  });
} catch(e) { result.errors.push(String(e.stack||e));console.error(e.stack||e);process.exitCode=1; }
finally {
  if(session)await session.stop().catch(e=>result.errors.push(String(e)));
  result.sourceUnchanged=sameHashes(before,await sourceHashes(source));result.finished=new Date().toISOString();
  await atomic(path.join(out,'results.json'),result);
  console.log(`${result.checks.filter(c=>c.ok).length}/${result.checks.length} browser infrastructure cases passed; errors=${result.errors.length}`);
}
