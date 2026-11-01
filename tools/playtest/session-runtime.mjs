// Test infrastructure only. Game bytes are never rewritten, and evaluate calls
// below only read state. Pausing suspends the page's JavaScript debugger thread,
// not game variables. Lifecycle freezing alone does not reliably stop RAF.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import path from 'node:path';
import { acquireLock, atomic, digest, inventoryFingerprint, json, loadCheckpoint, OwnerLease,
  remapStorage, sameHashes, savedSummary, sourceHashes, VERSION, worldsIn, writeCheckpoint } from './session-store.mjs';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
function authorized(header, secret) {
  const a = Buffer.from(header || ''), b = Buffer.from('Bearer ' + secret);
  return a.length === b.length && timingSafeEqual(a, b);
}
export function validateAction(action) {
  if (!action || typeof action !== 'object') throw new Error('Provide an action object.');
  if (!['new', 'input', 'press', 'click', 'fill', 'craft', 'scout', 'tiles', 'recipes', 'resize', 'save-quit', 'open-world', 'screenshot'].includes(action.type)) throw new Error('Unknown action type. Arbitrary JavaScript/state injection is not supported.');
  if (action.type === 'input') {
    if (!Number.isFinite(action.ms) || action.ms < 0 || action.ms > 10000) throw new Error('Input duration must be 0..10000ms.');
    if ((action.keys || []).some(k => !['a','d','s','w','Space','Shift','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(k))) throw new Error('Unsupported held key. Use press for discrete controls.');
    if (action.button && !['left','right'].includes(action.button)) throw new Error('Invalid mouse button.');
    if (action.aim && (!Number.isFinite(action.aim.x) || !Number.isFinite(action.aim.y))) throw new Error('Aim requires finite world x/y.');
  }
  if (action.type === 'press' && (typeof action.key !== 'string' || action.key.length > 40)) throw new Error('Invalid key.');
  if (['click','fill'].includes(action.type) && (typeof action.selector !== 'string' || action.selector.length > 300)) throw new Error('Provide a short selector.');
  if (action.type === 'fill' && (typeof action.value !== 'string' || action.value.length > 500)) throw new Error('Invalid text field value.');
  if (action.type === 'craft' && (typeof action.name !== 'string' || !Number.isInteger(action.count ?? 1) || (action.count ?? 1) < 1 || (action.count ?? 1) > 10)) throw new Error('Craft requires recipe name and count 1..10.');
  if (action.type === 'resize' && (!Number.isInteger(action.width) || !Number.isInteger(action.height) || action.width < 320 || action.height < 240 || action.width > 2560 || action.height > 1600)) throw new Error('Invalid viewport.');
}

export async function startSession({ directory, source, lane, restore = false, storageFile, worldId,
  goal = '', leaseMs = 90000, headless = true }) {
  directory = path.resolve(directory); source = path.resolve(source);
  const releaseLock = await acquireLock(directory);
  let browser, context, page, storagePage, cdp, server, timer, closing = false, frozen = false, busy = false;
  let abort = false, queue = Promise.resolve(), fault = null, lastCheckpoint = null, pausedFrame = null;
  let notes = { goal, nextSteps: [], observations: [], knownIssues: [], evidence: [] };
  let recovery = null, initialWorldId = worldId, origin;
  const pressed = new Set(), buttons = new Set();
  const secret = randomBytes(32).toString('hex'), lease = new OwnerLease(leaseMs);
  const configFile = path.join(directory, 'config.json');
  let config, initialStorage, served = new Set(), resolveClosed;
  const closed = new Promise(resolve => { resolveClosed = resolve; });
  const log = async (event, data = {}) => appendFile(path.join(directory, 'events.jsonl'), JSON.stringify({ at: new Date().toISOString(), event, ...data }) + '\n');
  const enqueue = fn => { const result = queue.then(fn); queue = result.catch(() => {}); return result; };
  async function recordLive(status) {
    await atomic(path.join(directory, 'live.json'), { version: VERSION, lane, pid: process.pid, status,
      frozen, busy, fault, owner: lease.snapshot(), checkpoint: lastCheckpoint?.handoff.checkpoint || null,
      updatedAt: new Date().toISOString() });
  }
  async function releaseInputs() {
    if (!page || page.isClosed()) return;
    for (const key of pressed) await page.keyboard.up(key).catch(() => {});
    for (const button of buttons) await page.mouse.up({ button }).catch(() => {});
    pressed.clear(); buttons.clear();
  }
  async function freeze() {
    if (frozen) return;
    await releaseInputs();
    if (!cdp || page.isClosed()) throw new Error('Cannot pause a closed browser.');
    let listener, timeout;
    const paused = new Promise((resolve,reject) => {
      listener = event => {
        clearTimeout(timeout);pausedFrame=event.callFrames[0]?.callFrameId;
        if(!pausedFrame)reject(new Error('No suspended frame available.'));else resolve();
      };
      cdp.once('Debugger.paused',listener);
      timeout=setTimeout(()=>{cdp.off('Debugger.paused',listener);reject(new Error('Browser did not confirm JavaScript suspension.'));},5000);
    });
    try { await cdp.send('Debugger.pause');await paused;frozen=true; }
    catch(e) { clearTimeout(timeout);cdp.off('Debugger.paused',listener);throw e; }
  }
  async function thaw() {
    if (fault) throw new Error(fault);
    if(frozen)await cdp.send('Debugger.resume');pausedFrame=null;frozen=false;
  }
  async function readState(fn, argument) {
    if(!frozen)return page.evaluate(fn,argument);
    if(!pausedFrame)throw new Error('Paused browser frame unavailable.');
    const response=await cdp.send('Debugger.evaluateOnCallFrame',{callFrameId:pausedFrame,
      expression:'('+fn.toString()+')('+JSON.stringify(argument ?? null)+')',returnByValue:true,silent:true});
    if(response.exceptionDetails)throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text);
    return response.result.value;
  }
  async function observe() {
    return readState(() => {
      const g = window.game;
      if (!g?.started) return { started: false };
      const p = g.player, w = g.world, inv = p.inventory;
      return JSON.parse(JSON.stringify({ started: true, worldId: activeWorldId, seed: w.seed, evil: w.evil,
        difficulty: w.difficulty, clock: document.getElementById('clock')?.textContent,
        timeOfDay: g.timeOfDay, autosaveT: g.autosaveT, paused: g.paused, panelOpen: g.panelOpen,
        panelTab: g.panelTab, mapOpen: !!g.mapOpen, online: typeof Net !== 'undefined' && Net.isOnline(),
        player: { x:p.x, y:p.y, vx:p.vx, vy:p.vy, hp:p.hp, maxHp:p.maxHp, dying:!!p.dying, onGround:p.onGround },
        inventory: { slots:inv.slots, held:g.held || null, armor:inv.armor, accessories:inv.accessories, dyes:inv.dyes, ammo:inv.ammo },
        selected:inv.selected, bossesDefeated:g.bossesDefeated, housing:g.housing,
        entities:g.entities.filter(e => !e.dead && Math.hypot(e.x-p.x,e.y-p.y)<900).map(e => ({ name:e.name, type:e.type, boss:e.boss, x:e.x, y:e.y, hp:e.hp, friendly:!!e.friendly, townNpc:!!e.townNpc })),
        message:document.getElementById('message')?.textContent, mouse:{ x:MOUSE.x, y:MOUSE.y, wx:MOUSE.wx, wy:MOUSE.wy, tpx:MOUSE.tpx, tpy:MOUSE.tpy },
        dimensions:{ width:w.W, height:w.H } }));
    });
  }
  async function exportStorage() {
    // Playwright context.storageState evaluates on existing pages first. That
    // hangs when the game thread is debugger-paused. A blank same-origin page
    // reads the real shared storage without waking or reloading the game.
    const state=await storagePage.evaluate(async()=>{
      const wait=request=>new Promise((resolve,reject)=>{request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});
      const databases=[];
      for(const info of await indexedDB.databases()) {
        if(info.name!=='tree.worlds')continue;
        const database=await wait(indexedDB.open(info.name));
        const stores=[];
        try {
          for(const name of database.objectStoreNames) {
            const transaction=database.transaction(name,'readonly'),store=transaction.objectStore(name);
            const valuesRequest=store.getAll(),keysRequest=store.getAllKeys();
            const [values,keys]=await Promise.all([wait(valuesRequest),wait(keysRequest)]);
            const entry={name,autoIncrement:store.autoIncrement,records:values.map((value,i)=>store.keyPath?{value}:{key:keys[i],value}),indexes:[]};
            if(typeof store.keyPath==='string')entry.keyPath=store.keyPath;
            else if(Array.isArray(store.keyPath))entry.keyPathArray=store.keyPath;
            for(const indexName of store.indexNames) {
              const index=store.index(indexName),item={name:index.name,multiEntry:index.multiEntry,unique:index.unique};
              if(Array.isArray(index.keyPath))item.keyPathArray=index.keyPath;else item.keyPath=index.keyPath;
              entry.indexes.push(item);
            }
            stores.push(entry);
          }
          databases.push({name:database.name,version:database.version,stores});
        } finally { database.close(); }
      }
      return {origin:location.origin,localStorage:Object.keys(localStorage).map(name=>({name,value:localStorage.getItem(name)})),indexedDB:databases};
    });
    return {cookies:await context.cookies(),origins:[state]};
  }
  async function checkpoint(reason, screenshot = false) {
    await freeze();
    const live = await observe();
    // IndexedDB export is the game's real last save, NOT a fabricated live snapshot.
    const storage = await exportStorage();
    if(live.started)initialWorldId=live.worldId;
    const persisted = savedSummary(storage, live.worldId || initialWorldId);
    const liveInventory = live.started ? inventoryFingerprint(live.inventory) : null;
    const possibleUnsavedProgress = live.started && (!persisted.verified || liveInventory !== persisted.inventoryFingerprint ||
      live.timeOfDay !== persisted.timeOfDay || live.player.x !== persisted.player.x || live.player.y !== persisted.player.y || live.player.hp !== persisted.player.hp);
    let screen=null,screenshotKind=null;
    if(screenshot) {
      let timeout;
      try {
        const shot=await Promise.race([
          cdp.send('Page.captureScreenshot',{format:'png',fromSurface:false}),
          new Promise((_,reject)=>{timeout=setTimeout(()=>reject(new Error('Screenshot unavailable while browser is suspended.')),2000);}),
        ]);
        screen=Buffer.from(shot.data,'base64');screenshotKind='browser-page';
      } catch(e) { await log('screenshot-unavailable',{error:String(e)}); }
      finally { clearTimeout(timeout); }
      if(!screen) {
        try {
          // Encoding the existing canvas backing store is synchronous and
          // read-only, so it works on a suspended frame without resuming RAF.
          // This captures the current canvas backing store, NOT HTML HUD/panels.
          // A debugger pause inside rendering can leave an incomplete frame.
          const url=await readState(()=>typeof canvas!=='undefined' && canvas.width && canvas.height ? canvas.toDataURL('image/png') : null);
          if(typeof url==='string' && url.startsWith('data:image/png;base64,')) {
            screen=Buffer.from(url.slice('data:image/png;base64,'.length),'base64');screenshotKind='game-canvas-only';
          }
        } catch(e) { await log('canvas-capture-unavailable',{error:String(e)}); }
      }
    }
    const result = await writeCheckpoint(directory, { storage, screenshot:screen,
      handoff: { lane, at:new Date().toISOString(), reason, source:config.source, sourceHashes:config.sourceHashes,
        method:'Instrumented natural input; read-only scouting. Chromium debugger suspension is infrastructure safety, not game-state injection.',
        live, liveInventoryFingerprint:liveInventory, persisted, possibleUnsavedProgress:!!possibleUnsavedProgress,
        liveResume:'Exact live browser retained while controller/browser remain alive; claim this controller rather than reloading.',
        crashRecovery:'Only the exported persisted game record can be restored after browser loss. Unsaved state, ordinary enemies and active boss fights are not exactly recoverable.',
        recovery, notes, screenshotKind, screenshotCaveat:screenshotKind==='game-canvas-only'?'Current canvas backing store; excludes HTML HUD, inventory, menus and other DOM overlays. May be an incomplete frame if JavaScript was suspended during rendering; not proof of a completed rendered frame or exact simulation-frame correspondence.':null,
        owner:lease.snapshot(), servedFiles:[...served].sort() } });
    lastCheckpoint = result;
    const h = result.handoff;
    await writeFile(path.join(directory, 'HANDOFF.md'), [
      '# Playtest handoff: ' + lane, '',
      'Root HANDOFF files are convenience caches. `latest.json` and its checksummed checkpoint are authoritative.',
      'Run `node tools/playtest-session.mjs handoff --lane '+lane+'` for the current committed state; read `events.jsonl` for actions/errors.',
      'Source: `' + source + '` (hashes pinned in config.json).',
      'Goal: ' + notes.goal,
      'Next steps: ' + (notes.nextSteps.join('; ') || 'Not yet supplied; inspect the last actions before continuing.'),
      'Known issues: ' + notes.knownIssues.join('; '),
      '', '## Resume a live controller (any model)',
      '`node tools/playtest-session.mjs claim --lane ' + lane + ' --owner YOUR-MODEL-SESSION`',
      'Then use `action --lane ' + lane + ' --owner YOUR-MODEL-SESSION --json "{...}"`. Never start another browser for a live lane.',
      '', '## If the controller/browser is gone',
      '`node tools/playtest-session.mjs start --lane ' + lane + ' --restore` (run as a background shell).',
      'This restores the last persisted save, NOT necessarily the latest live state. Source hashes and checkpoint checksums must match.',
      'Potential unsaved progress: **' + !!possibleUnsavedProgress + '**. Saved timeOfDay: ' + persisted.timeOfDay + '; live: ' + live.timeOfDay + '.',
      'Checkpoint: `' + h.checkpoint + '`. Earlier complete generations are retained.',
      '', 'Pause before stopping an agent: `node tools/playtest-session.mjs pause --lane ' + lane + '`.',
      'Pause every managed lane: `node tools/playtest-session.mjs pause-all`.',
      'Do not kill the controller/browser to pause a model. No game source or real player save may be edited.',
    ].join('\n') + '\n');
    await recordLive('paused');
    return h;
  }
  function checkAbort() { if (abort || closing || lease.expired) throw new Error('Action interrupted by pause/lease expiry. Inputs released; inspect the last checkpoint.'); }
  async function runningGame() {
    const state = await observe();
    if (!state.started) throw new Error('No world open. Use new or open-world.');
    if (state.online) throw new Error('Only offline disposable playtests are supported.');
    if (state.paused) await page.locator('#btn-continue').click({ timeout: 5000 });
  }
  async function aim(world) {
    const target = await page.evaluate(({x,y}) => {
      const r = canvas.getBoundingClientRect();
      return { x:r.left+(x-game.cam.x+canvas.width/2)*r.width/canvas.width,
        y:r.top+(y-game.cam.y+canvas.height/2)*r.height/canvas.height, width:innerWidth, height:innerHeight };
    }, world);
    if (target.x < 0 || target.y < 65 || target.x >= target.width || target.y >= target.height) throw new Error('Aim is outside the playable viewport or under the HUD. Move into reach first.');
    await page.mouse.move(target.x, target.y);
  }
  async function ready() {
    await page.waitForFunction(() => window.game?.started && document.getElementById('loading').classList.contains('hidden'), null, { timeout:120000 });
  }
  async function openWorld(id) {
    const matches = page.locator('.world-row').filter({ has:page.locator('.world-open') });
    let selected = null;
    for (let i=0;i<await matches.count();i++) if (await matches.nth(i).getAttribute('data-world-id') === id) selected = matches.nth(i);
    if (!selected) throw new Error('Saved world ID not present; refusing to open a different world.');
    // Opening a saved world synchronously generates/restores terrain. Under
    // parallel browser load that handler can exceed the ordinary UI deadline.
    // Keep normal actionability checks; only the startup/loading budget differs.
    await selected.locator('.world-open').click({ timeout:120000 }); await ready();
  }
  async function perform(action) {
    validateAction(action); checkAbort();
    switch (action.type) {
      case 'new': {
        if ((await observe()).started || worldsIn(await exportStorage()).length) throw new Error('Lane already has a world. Continue it instead of replacing it.');
        await page.locator('#btn-new').click(); await page.locator('#world-name').fill(String(action.name || lane).slice(0,80));
        await page.locator('input[name="difficulty"][value="normal"]').check();
        await page.locator('input[name="evil"][value="corrupt"]').check();
        await page.locator('#btn-create').click(); await ready(); return { created:true };
      }
      case 'open-world': await openWorld(action.id || initialWorldId); return { opened:true };
      case 'input': {
        await runningGame();
        if (action.slot !== undefined) {
          if (!Number.isInteger(action.slot) || action.slot<0 || action.slot>9) throw new Error('slot is 0..9.');
          if ((await observe()).panelOpen) throw new Error('Close the panel before selecting a tool by number.');
          await page.keyboard.press(String((action.slot+1)%10));
        }
        for (const key of action.keys || []) { pressed.add(key); await page.keyboard.down(key); }
        const until = Date.now() + action.ms;
        do {
          checkAbort();
          if (action.aim) await aim(action.aim);
          if (action.button && !buttons.has(action.button)) { buttons.add(action.button); await page.mouse.down({ button:action.button }); }
          await sleep(Math.min(100, Math.max(0, until-Date.now())));
        } while (Date.now()<until);
        return { elapsedMs:action.ms };
      }
      case 'press': await runningGame(); await page.keyboard.press(action.key); await sleep(100); return { pressed:action.key };
      case 'click': await page.locator(action.selector).click({ button:action.button || 'left', timeout:5000 }); await sleep(100); return { clicked:action.selector };
      case 'fill': await page.locator(action.selector).fill(action.value, { timeout:5000 }); return { filled:action.selector };
      case 'craft': {
        await runningGame();
        if (!(await observe()).panelOpen) await page.keyboard.press('e');
        await page.locator('#panel-tabs [data-panel="crafting"]').click({ timeout:5000 });
        await page.locator('#craft-search-input').fill(action.name);
        const idx = await page.evaluate(name => RECIPES.findIndex(r => r.name === name), action.name);
        if (idx<0) throw new Error('No exact recipe name. Use recipes to inspect implemented requirements.');
        const row = page.locator('#craft-list .craft-row[data-idx="' + idx + '"]');
        for (let i=0;i<(action.count || 1);i++) {
          checkAbort();
          if (!await row.count() || (await row.getAttribute('class')).includes('cant')) throw new Error('Recipe unavailable or insufficient materials/station.');
          await row.click({ timeout:5000 }); await sleep(100);
        }
        return { crafted:action.name, count:action.count || 1 };
      }
      case 'scout': {
        const radius = Math.max(1, Math.min(80, Math.trunc(action.radius || 20)));
        return readState(({kind,radius}) => {
          const p=game.player,w=game.world,px=Math.floor(p.x/TILE),py=Math.floor(p.y/TILE),rows=[];
          const names=Object.fromEntries(Object.entries(T).map(([name,id])=>[id,name]));
          for (let y=py-radius;y<=py+radius;y++) for (let x=px-radius;x<=px+radius;x++) {
            if (!w.inBounds(x,y)) continue;
            const tile=w.get(x,y),name=names[tile] || String(tile);
            if (kind && !name.toLowerCase().includes(String(kind).toLowerCase())) continue;
            if (!kind && tile===T.AIR) continue;
            rows.push({x,y,tile,name,wall:w.walls[w.idx(x,y)],distance:Math.hypot(x*TILE+TILE/2-p.x,y*TILE+TILE/2-p.y)});
          }
          return rows.sort((a,b)=>a.distance-b.distance).slice(0,200);
        }, {kind:action.kind,radius});
      }
      case 'tiles': {
        const x=action.x,y=action.y,w=action.width || 12,h=action.height || 12;
        if (![x,y,w,h].every(Number.isInteger) || w<1 || h<1 || w*h>1600) throw new Error('Tiles requires integer bounds, at most 1600 cells.');
        return readState(({x,y,w,h}) => {
          const world=game.world,rows=[];
          for(let dy=0;dy<h;dy++) { const row=[]; for(let dx=0;dx<w;dx++) {
            const tx=x+dx,ty=y+dy;
            row.push(world.inBounds(tx,ty)?{tile:world.get(tx,ty),wall:world.walls[world.idx(tx,ty)],hp:world.hp[world.idx(tx,ty)]}:null);
          } rows.push(row); } return {x,y,rows};
        }, {x,y,w,h});
      }
      case 'recipes': return readState(search => RECIPES.filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase())), String(action.search || ''));
      case 'resize': await page.setViewportSize({width:action.width,height:action.height}); return { resized:true };
      case 'save-quit': {
        await runningGame();
        if ((await observe()).entities.some(e=>e.boss)) throw new Error('Do not Save & Quit during a boss. Use a live handoff instead.');
        // This is an explicit persistence test, never an automatic pause operation.
        for (let i=0;i<4 && !(await observe()).paused;i++) { await page.locator('body').focus(); await page.keyboard.press('Escape'); await sleep(100); }
        if (!(await observe()).paused) throw new Error('Could not open pause menu through physical input.');
        await page.locator('#btn-save').click({timeout:5000});
        await page.waitForFunction(()=>!window.game,null,{timeout:60000}); return { savedAndQuit:true, recoveryAdvantage:'Reloading clears ordinary live enemies; disclose this persistence control.' };
      }
      case 'screenshot': return { screenshot:true };
    }
  }
  async function action(ticket, action, requestId) {
    lease.assert(ticket); validateAction(action);
    if(requestId!==undefined && (typeof requestId!=='string' || !requestId || requestId.length>200))throw new Error('Request ID must be a short nonempty string.');
    if(!requestId && !['scout','tiles','recipes','screenshot','resize'].includes(action.type))throw new Error('A unique request ID is required for gameplay/UI actions, so a lost response cannot silently replay them.');
    const previous = requestId ? await json(path.join(directory,'requests',digest(requestId)+'.json')).catch(()=>null) : null;
    if (previous) {
      if (previous.actionHash !== digest(JSON.stringify(action))) throw new Error('Request ID reused with a different action.');
      if (!previous.complete) throw new Error('Prior action outcome uncertain. Inspect handoff/events; do not automatically replay it.');
      return previous.response;
    }
    busy = true; abort = false; lease.renew(ticket);
    const started=Date.now(), before=await observe(), actionHash=digest(JSON.stringify(action));
    const requestFile=requestId ? path.join(directory,'requests',digest(requestId)+'.json') : null;
    if(requestFile) await atomic(requestFile,{requestId,actionHash,complete:false,startedAt:started});
    await log('action-start',{requestId,owner:ticket,action,before});
    let output, error;
    try {
      // Inspection never advances the game, even by a single frame.
      if(!['scout','tiles','recipes','screenshot'].includes(action.type))await thaw();
      await recordLive('acting');output = await perform(action);
    }
    catch(e) { error=String(e.stack || e); }
    finally {
      try { await freeze(); } catch(e) { fault='Could not freeze browser: '+e.message; }
      busy = false;
    }
    const handoff=await checkpoint(error?'action-error':'action-complete',action.type==='screenshot');
    const response={ok:!error,error,output,handoff,elapsedMs:Date.now()-started};
    await log('action-end',{requestId,owner:ticket,action,error,output,live:handoff.live});
    if(requestFile)await atomic(requestFile,{requestId,actionHash,complete:true,response});
    return response;
  }
  async function stop(reason='explicit-stop') {
    if(closing)return; closing=true; abort=true; clearInterval(timer);
    try { if(page && !page.isClosed())await checkpoint(reason,true); } catch(e) { await log('stop-checkpoint-error',{error:String(e)}).catch(()=>{}); }
    lease.release();
    if(browser)await browser.close().catch(()=>{});
    if(server)await new Promise(resolve=>server.close(resolve));
    await recordLive('stopped'); await releaseLock(); resolveClosed();
  }
  async function handle(body) {
    switch(body.op) {
      case 'status': return {lane,frozen,busy,fault,owner:lease.snapshot(),checkpoint:lastCheckpoint?.handoff || null};
      case 'claim': {
        await freeze();
        if(!sameHashes(config.sourceHashes,await sourceHashes(source)))throw new Error('Source changed; refusing model takeover.');
        const ticket=lease.claim(body.owner);await log('claim',{ticket});await recordLive('paused');return ticket;
      }
      case 'heartbeat': lease.renew(body.ticket);await recordLive(frozen?'paused':'acting');return lease.snapshot();
      case 'note': {
        lease.assert(body.ticket);
        for(const key of ['goal','nextSteps','observations','knownIssues','evidence'])if(body.notes?.[key]!==undefined){
          if(key==='goal' ? typeof body.notes[key]!=='string' : !Array.isArray(body.notes[key]) || body.notes[key].some(x=>typeof x!=='string'))throw new Error('Invalid handoff notes.');
          notes[key]=body.notes[key];
        }
        return checkpoint('notes-updated');
      }
      case 'action': return action(body.ticket,body.action,body.requestId);
      case 'checkpoint': lease.assert(body.ticket);return checkpoint('explicit-checkpoint',true);
      case 'pause': {
        await freeze();lease.release();const h=await checkpoint(body.reason || 'explicit-pause',true);await log('pause',{reason:h.reason});return h;
      }
      case 'stop': setImmediate(()=>enqueue(()=>stop()));return {stopping:true};
      default: throw new Error('Unknown operation.');
    }
  }
  try {
    const hashes=await sourceHashes(source);
    const previousConfig=await json(configFile).catch(e=>{if(e.code==='ENOENT')return null;throw e;});
    if(previousConfig) {
      if(previousConfig.version!==VERSION)throw new Error('Unsupported controller config version.');
      if(!restore)throw new Error('Lane already exists. Use --restore after a crash, or claim its live controller.');
      if(!sameHashes(previousConfig.sourceHashes,hashes))throw new Error('Source hashes differ; refusing to migrate progress silently.');
      config=previousConfig;
      const prior=await loadCheckpoint(directory);
      initialStorage=prior.storage;notes=prior.handoff.notes;
      initialWorldId=prior.handoff.live.worldId || prior.handoff.persisted.worldId;
      recovery={at:new Date().toISOString(),type:'persisted-save-only',checkpoint:prior.handoff.checkpoint,
        lostLiveStatePossible:prior.handoff.possibleUnsavedProgress,priorLive:prior.handoff.live,restoredSave:prior.handoff.persisted,
        note:'Browser restart restores a game save, not ordinary enemies, active fights, RNG, or unsaved changes. Never call this exact live continuation.'};
      if(!prior.handoff.persisted.verified)throw new Error('No verified saved world in checkpoint; refusing to replace it with a fresh world.');
    } else {
      if(restore)throw new Error('No lane config to restore. Use --storage to import a prior disposable playtest explicitly.');
      config={version:VERSION,lane,source,sourceHashes:hashes,createdAt:new Date().toISOString()};
      if(storageFile) {
        const bytes=await readFile(storageFile);initialStorage=JSON.parse(bytes);
        const selected=worldsIn(initialStorage).filter(w=>!worldId || w.record.id===worldId);
        if(selected.length!==1)throw new Error('Import must select exactly one saved world; supply --world-id.');
        initialWorldId=selected[0].record.id;
        recovery={type:'imported-persisted-save',file:path.resolve(storageFile),sha256:digest(bytes),
          note:'Imported prior disposable IndexedDB save; earlier unsaved progress is not available.'};
      }
    }
    server=createServer(async(req,res)=>{
      try {
        const url=new URL(req.url,'http://127.0.0.1');
        if(url.pathname==='/control') {
          if(req.method!=='POST' || req.headers.origin || !authorized(req.headers.authorization,secret)){res.writeHead(403).end();return;}
          let data='';for await(const chunk of req){data+=chunk;if(data.length>65536)throw new Error('Request too large.');}
          const body=JSON.parse(data);
          if(['pause','stop'].includes(body.op))abort=true;
          // Read-only status/heartbeats need not wait for a long action.
          const result=await (['status','heartbeat'].includes(body.op)?handle(body):enqueue(()=>handle(body)));
          res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify({ok:true,result}));return;
        }
        if(url.pathname==='/_guard/status'){res.writeHead(200,{'Content-Type':'application/json'}).end('{"signedIn":false}');return;}
        if(url.pathname==='/__playtest_storage__'){res.writeHead(200,{'Content-Type':'text/html'}).end('<!doctype html><title>Disposable playtest storage reader</title>');return;}
        if(req.method!=='GET'){res.writeHead(405).end();return;}
        const relative=(url.pathname==='/'?'index.html':decodeURIComponent(url.pathname.slice(1))).replaceAll('\\','/');
        if(!Object.hasOwn(config.sourceHashes,relative)){res.writeHead(404).end();return;}
        const bytes=await readFile(path.join(source,relative));
        if(digest(bytes)!==config.sourceHashes[relative]) {
          fault='Pinned source changed: '+relative;abort=true;
          await freeze().catch(()=>{});throw new Error(fault);
        }
        served.add(relative);
        res.writeHead(200,{'Content-Type':mime[path.extname(relative)] || 'application/octet-stream','Cache-Control':'no-store'}).end(bytes);
      } catch(e) { if(!res.headersSent)res.writeHead(400,{'Content-Type':'application/json'});res.end(JSON.stringify({ok:false,error:String(e.message || e)})); }
    });
    await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
    origin='http://127.0.0.1:'+server.address().port;
    browser=await chromium.launch({headless});
    context=await browser.newContext({viewport:{width:1440,height:900},...(initialStorage?{storageState:remapStorage(initialStorage,origin)}:{})});
    await context.route('**/*',route=>route.request().url().startsWith(origin+'/')?route.continue():route.abort());
    storagePage=await context.newPage();await storagePage.goto(origin+'/__playtest_storage__');
    page=await context.newPage();page.setDefaultTimeout(5000);
    cdp=await context.newCDPSession(page);
    await cdp.send('Debugger.enable');
    page.on('pageerror',e=>{void log('page-error',{error:String(e)});});
    browser.on('disconnected',()=>{
      if(!closing){
        fault='Browser disconnected; only the last committed persisted save is recoverable.';
        abort=true;clearInterval(timer);lease.release();
        // Let the controller exit and relinquish its lock; otherwise --restore
        // would be blocked by a live process with a permanently dead browser.
        void enqueue(async()=>{
          closing=true;await log('browser-lost',{fault});await recordLive('browser-lost');
          if(server)await new Promise(resolve=>server.close(resolve));
          await releaseLock();resolveClosed();
        }).catch(e=>{console.error(e);resolveClosed();});
      }
    });
    await page.goto(origin);
    if(initialWorldId) { await openWorld(initialWorldId); }
    await freeze();
    if(initialStorage) {
      const expected=savedSummary(initialStorage,initialWorldId), actual=await observe();
      if(actual.seed!==expected.seed || actual.worldId!==expected.worldId || inventoryFingerprint(actual.inventory)!==expected.inventoryFingerprint)throw new Error('Restored seed/world/inventory mismatch; refusing gameplay. Inspect recovery evidence.');
      recovery={...recovery,originMigrationOnly:true,expected,actual,restoreVerified:true};
    }
    await atomic(configFile,config);
    await checkpoint('controller-started',true);
    await atomic(path.join(directory,'connection.json'),{version:VERSION,pid:process.pid,origin,endpoint:origin+'/control',secret});
    await log('controller-started',{pid:process.pid,origin,recovery});
    timer=setInterval(()=>{
      if(lease.expired) {
        abort=true;
        void enqueue(async()=>{if(!lease.expired)return;await freeze();lease.release();await checkpoint('owner-lease-expired',true);await log('owner-lease-expired');}).catch(e=>log('watchdog-error',{error:String(e)}));
      }
    },500);
    return { directory, origin, closed, stop:()=>enqueue(()=>stop()), status:()=>({frozen,busy,fault}), observe,
      request:body=>{if(['pause','stop'].includes(body.op))abort=true;return ['status','heartbeat'].includes(body.op)?handle(body):enqueue(()=>handle(body));} };
  } catch(e) {
    clearInterval(timer);closing=true;
    if(browser)await browser.close().catch(()=>{});
    if(server)await new Promise(resolve=>server.close(resolve));
    await log('startup-error',{error:String(e.stack || e)}).catch(()=>{});
    await releaseLock();throw e;
  }
}
