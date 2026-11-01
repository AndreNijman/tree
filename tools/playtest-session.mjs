// Model-independent CLI. Start controllers with the shell tool's background:true.
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { acquireLock, atomic, digest, json, loadCheckpoint, remapStorage, savedSummary, sourceHashes, validLane, VERSION, writeCheckpoint, worldsIn } from './playtest/session-store.mjs';

const workspace=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const root=process.env.TREE_PLAYTEST_SESSIONS?path.resolve(process.env.TREE_PLAYTEST_SESSIONS):path.join(workspace,'test-results','playtest-sessions');
function options(args) {
  const out={};
  for(let i=0;i<args.length;i++) {
    if(!args[i].startsWith('--'))throw new Error('Expected --option, got '+args[i]);
    const name=args[i].slice(2);
    if(['restore','headed'].includes(name))out[name]=true;
    else { if(args[i+1]===undefined || args[i+1].startsWith('--'))throw new Error('Missing value for --'+name);out[name]=args[++i]; }
  }
  return out;
}
function laneDirectory(name) {
  if(!validLane(name))throw new Error('Supply --lane with a short lowercase/digit/hyphen name.');
  return path.join(root,name);
}
async function request(directory,body,timeout=180000) {
  const connection=await json(path.join(directory,'connection.json'));
  const url=new URL(connection.endpoint);
  if(url.hostname!=='127.0.0.1' || url.protocol!=='http:' || url.pathname!=='/control')throw new Error('Invalid local controller address.');
  const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+connection.secret},
    body:JSON.stringify(body),signal:AbortSignal.timeout(timeout)});
  const result=await response.json();
  if(!response.ok || !result.ok)throw new Error(result.error || 'Controller request failed.');
  return result.result;
}
async function ticket(directory,owner) {
  if(!owner)throw new Error('Supply --owner MODEL-SESSION (must claim first).');
  return json(path.join(directory,'owners',digest(owner)+'.json'));
}
const help=`Resumable, isolated Tree playtests (any AI model)

  start --lane NAME --source ABSOLUTE-FROZEN-SOURCE [--storage DISPOSABLE-EXPORT] [--world-id ID] [--goal TEXT]
        [--lease-ms 90000] [--headed]
  start --lane NAME --restore
  register --lane NAME --source ABSOLUTE-FROZEN-SOURCE --storage DISPOSABLE-EXPORT [--world-id ID] [--goal TEXT] [--notes JSON-FILE]
  claim --lane NAME --owner MODEL-SESSION
  action --lane NAME --owner MODEL-SESSION --json '{"type":"input","keys":["d"],"ms":500}' [--request-id UNIQUE-ID]
  note --lane NAME --owner MODEL-SESSION --json '{"goal":"...","nextSteps":["..."]}'
  checkpoint --lane NAME --owner MODEL-SESSION
  heartbeat --lane NAME --owner MODEL-SESSION
  pause --lane NAME [--reason TEXT]
  pause-all
  status --lane NAME
  handoff --lane NAME
  list
  stop --lane NAME

Run start as a BACKGROUND shell command; it is a persistent controller, not a finite test.
Every action finishes browser-frozen with a durable handoff. Claim the SAME controller to switch models.
After a browser crash, --restore recovers the last game SAVE, NOT unsaved live state or an exact boss fight.
Do not automatically retry an uncertain action without inspecting its request ID and handoff.
More instructions: PLAYTESTING.md. No source edits, grants, or production saves.
`;

try {
  const [command,...args]=process.argv.slice(2),opts=options(args);
  if(!command || ['help','--help'].includes(command)){console.log(help);}
  else if(['list','pause-all'].includes(command)) {
    const entries=await readdir(root,{withFileTypes:true}).catch(e=>{if(e.code==='ENOENT')return [];throw e;});
    const results=[];
    for(const entry of entries.filter(e=>e.isDirectory() && validLane(e.name))) {
      const directory=laneDirectory(entry.name);
      try { results.push({lane:entry.name,live:true,result:await request(directory,{op:command==='pause-all'?'pause':'status',reason:'user-pause-all'},30000)}); }
      catch(e) {
        const live=await json(path.join(directory,'live.json')).catch(()=>null);
        const inactive=['stopped','registered-offline','browser-lost'].includes(live?.status);
        results.push({lane:entry.name,live:false,inactive,status:live?.status,error:inactive?undefined:e.message,latest:await json(path.join(directory,'latest.json')).catch(()=>null)});
      }
    }
    console.log(JSON.stringify(results,null,2));
    if(command==='pause-all' && results.some(r=>!r.live && !r.inactive)) {
      console.error('Some controllers are unreachable. Their disk checkpoints remain available; an unreachable controller is not confirmed paused.');
      process.exitCode=1;
    }
  } else {
    const directory=laneDirectory(opts.lane);
    let result;
    if(command==='register') {
      if(!opts.source || !path.isAbsolute(opts.source) || !opts.storage)throw new Error('register requires absolute --source and --storage export.');
      const release=await acquireLock(directory);
      try {
        if(await json(path.join(directory,'config.json')).catch(e=>{if(e.code==='ENOENT')return null;throw e;}))throw new Error('Lane already registered; do not overwrite its history.');
        const bytes=await readFile(opts.storage),storage=JSON.parse(bytes);
        // Validate that this is isolated loopback storage without changing it.
        remapStorage(storage,'http://127.0.0.1:1');
        const candidates=worldsIn(storage).filter(w=>!opts['world-id'] || w.record.id===opts['world-id']);
        if(candidates.length!==1)throw new Error('Select exactly one saved world with --world-id.');
        const persisted=savedSummary(storage,candidates[0].record.id);
        if(!persisted.verified)throw new Error(persisted.reason);
        const config={version:VERSION,lane:opts.lane,source:path.resolve(opts.source),sourceHashes:await sourceHashes(opts.source),createdAt:new Date().toISOString()};
        const notes={goal:opts.goal || '',nextSteps:[],observations:[],knownIssues:[],evidence:[path.resolve(opts.storage)],...(opts.notes?await json(opts.notes):{})};
        const packet=await writeCheckpoint(directory,{storage,handoff:{lane:opts.lane,at:new Date().toISOString(),reason:'legacy-disposable-save-registration',
          source:config.source,sourceHashes:config.sourceHashes,live:{started:false},persisted,possibleUnsavedProgress:true,notes,
          recovery:{type:'legacy-persisted-save-registration',file:path.resolve(opts.storage),sha256:digest(bytes),liveStateUnknown:true,
            note:'Only the actual stored game record is registered. Prior live state and possible progress since that save are unknown.'},
          liveResume:'No managed browser was started. Use start --restore; do not create a fresh world.',
          crashRecovery:'Only persisted save state is available. Registration does not verify that legacy live progress was saved.'}});
        await atomic(path.join(directory,'config.json'),config);
        await atomic(path.join(directory,'live.json'),{status:'registered-offline',lane:opts.lane,updatedAt:new Date().toISOString()});
        await atomic(path.join(directory,'registration.json'),{input:path.resolve(opts.storage),inputHash:digest(bytes),checkpoint:packet.handoff.checkpoint});
        const {writeFile}=await import('node:fs/promises');
        await writeFile(path.join(directory,'HANDOFF.md'),'# Registered playtest: '+opts.lane+'\n\nNo browser is running for this managed lane. Read PLAYTESTING.md.\n\nAuthoritative state: `node tools/playtest-session.mjs handoff --lane '+opts.lane+'` (checks latest.json/checksums).\n\nGoal: '+notes.goal+'\n\nStart with `node tools/playtest-session.mjs start --lane '+opts.lane+' --restore` as a background shell, then claim the controller. This recovers only the recorded save, not unsaved prior progress.\n');
        result={registered:true,directory,persisted,possibleUnsavedProgress:true,checkpoint:packet.handoff.checkpoint};
      } finally { await release(); }
    } else if(command==='start') {
      const prior=opts.restore?await json(path.join(directory,'config.json')):null;
      const source=opts.source || prior?.source;
      if(!source || !path.isAbsolute(source))throw new Error('Supply an absolute frozen --source path.');
      const {startSession}=await import('./playtest/session-runtime.mjs');
      const session=await startSession({directory,source,lane:opts.lane,restore:!!opts.restore,storageFile:opts.storage,
        worldId:opts['world-id'],goal:opts.goal || '',leaseMs:opts['lease-ms']?Number(opts['lease-ms']):90000,headless:!opts.headed});
      console.log(JSON.stringify({ready:true,lane:opts.lane,directory,origin:session.origin,pid:process.pid,handoff:path.join(directory,'HANDOFF.md')}));
      let stopping=false;
      const onSignal=()=>{if(!stopping){stopping=true;void session.stop().catch(e=>{console.error(e);process.exitCode=1;});}};
      process.on('SIGINT',onSignal);process.on('SIGTERM',onSignal);
      await session.closed;
      process.removeListener('SIGINT',onSignal);process.removeListener('SIGTERM',onSignal);
    } else if(command==='handoff') {
      const packet=await loadCheckpoint(directory);result={directory:packet.target,handoff:packet.handoff};
    } else if(command==='claim') {
      result=await request(directory,{op:'claim',owner:opts.owner});
      await atomic(path.join(directory,'owners',digest(opts.owner)+'.json'),result);
    } else if(['action','note','heartbeat','checkpoint'].includes(command)) {
      const owner=await ticket(directory,opts.owner),body={op:command,ticket:owner};
      if(command==='action') {
        body.action=JSON.parse(opts.json || '{}');
        body.requestId=opts['request-id'];
      }
      if(command==='note')body.notes=JSON.parse(opts.json || '{}');
      result=await request(directory,body);
      if(command==='action' && !result.ok)process.exitCode=1;
    } else if(['pause','status','stop'].includes(command)) result=await request(directory,{op:command,reason:opts.reason});
    else throw new Error('Unknown command: '+command);
    if(result!==undefined)console.log(JSON.stringify(result,null,2));
  }
} catch(e) {
  console.error(e.stack || e);
  console.error('No automatic fresh-world fallback was performed. Inspect HANDOFF.md/latest.json before retrying.');
  process.exitCode=1;
}
