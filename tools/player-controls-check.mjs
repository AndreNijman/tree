// Real input, mining, combat boundaries and read-only player animation regressions.
import { mkdirSync, writeFileSync } from 'node:fs';
import { setupAudit, check, assertNoBrowserErrors, finish } from './audit2/lib.mjs';

const { browser, page, results } = await setupAudit();
await page.evaluate(() => {
  game.paused = true; game.panelOpen = false; game.mapOpen = false;
  game.entities = []; game.projectiles.list = []; game.fx = []; game.fxTexts = [];
  const w = game.world, tx = Math.floor(w.spawnX / TILE), gy = w.surfaceY[tx];
  for (let x = tx - 40; x <= tx + 40; x++) for (let y = gy - 24; y <= gy; y++) w.set(x,y,y === gy ? T.STONE : T.AIR);
  game.player.x = tx * TILE + 8; game.player.y = gy * TILE - 16.01;
  game.player.onGround = true; game.player.vx = game.player.vy = 0;
  game.player.inventory.accessories.fill(null);
  game.player.inventory.slots[0] = { id:I.COPPERSHORT,count:1 };
  game.player.inventory.slots[1] = { id:I.COPPERPICK,count:1 };
  game.player.inventory.slots[2] = { id:I.COPPERSWORD,count:1 };
  game.player.inventory.selected = 0;
  game.cam.x = game.player.x; game.cam.y = game.player.y - 80;
  window.__controlsOrigin = { x:game.player.x,y:game.player.y,tx,gy };
  window.__controlsEnemy = function(dx,dy,w,h) {
    const p = game.player, e = spawnEntity(game,E.ZOMBIE,p.x + dx,p.y + dy);
    e.hp = e.maxHp = 1000; e.def = 0; e.w = w || 12; e.h = h || 20;
    return e;
  };
});

const melee = await page.evaluate(() => {
  const p = game.player, out = [], random = Math.random;
  function swing(id) { p.attackCd = p.swingT = 0; p.tryMelee(game,ITEMS[id],false,{ id,count:1 }); }
  try {
    Math.random = () => 0.5;
    for (const side of [-1,1]) {
      game.entities = []; game.fxTexts = [];
      const front = __controlsEnemy(side * 38,-6), back = __controlsEnemy(-side * 38,-6), offLane = __controlsEnemy(side * 35,22,10,10);
      MOUSE.wx = p.x + side * 200; MOUSE.wy = p.y;
      swing(I.COPPERSHORT);
      const first = front.hp;
      p.tryMelee(game,ITEMS[I.COPPERSHORT],false);
      out.push({ side,damage:1000 - front.hp,backSafe:back.hp === 1000,offLaneSafe:offLane.hp === 1000,cooldown:front.hp === first });
    }
    game.entities = [];
    const reach = ITEMS[I.COPPERSWORD].range * TILE + 10;
    const edge = __controlsEnemy(reach + 10,-6,30,24), beyond = __controlsEnemy(reach + 30,-6,20,20), behind = __controlsEnemy(-50,-6,12,12);
    const friend = __controlsEnemy(20,-6); friend.friendly = true;
    const sentry = __controlsEnemy(20,-6); sentry.ooaSentry = true;
    MOUSE.wx = p.x + 200; MOUSE.wy = p.y; swing(I.COPPERSWORD);
    const edgeHit = edge.hp < 1000, safe = beyond.hp === 1000 && behind.hp === 1000 && friend.hp === 1000 && sentry.hp === 1000;
    game.entities = []; game.fxTexts = []; Math.random = () => 0;
    __controlsEnemy(30,-6); swing(I.COPPERSHORT);
    const critical = game.fxTexts.filter(f => f.text === 'Critical!').length === 1;
    game.entities = []; game.bossBars = []; game.projectiles.list = [];
    const worm = spawnDestroyer(game); worm.x = p.x + 500; worm.y = p.y;
    worm.segments = [{ x:p.x + 30,y:p.y - 6,w:28,h:18,hp:100,dead:false },{ x:p.x + 35,y:p.y - 6,w:28,h:18,hp:100,dead:false }];
    const hp = worm.hp; Math.random = () => 0.5; swing(I.COPPERSWORD);
    const wormDamage = hp - worm.hp;
    const expected = Math.max(1,Math.round(ITEMS[I.COPPERSWORD].dmg - worm.defV * 0.5));
    return { out,edgeHit,safe,critical,wormDamage,expected };
  } finally { Math.random = random; game.entities = []; game.bossBars = []; game.projectiles.list = []; }
});
check(results,'Left/right shortswords both hit forward targets, never targets behind or outside the stab lane',melee.out.every(s => s.damage > 0 && s.backSafe && s.offLaneSafe) && melee.out[0].damage === melee.out[1].damage,melee.out);
check(results,'Melee cooldown prevents duplicate damage from a held attack',melee.out.every(s => s.cooldown));
check(results,'Broadswords hit the near edge of a large body without hitting out-of-range, rear or friendly bodies',melee.edgeHit && melee.safe,melee);
check(results,'Critical feedback follows the actual critical roll',melee.critical);
check(results,'A worm body can be struck without its distant head, once per boss per swing',melee.wormDamage === melee.expected && melee.wormDamage > 0,melee);

const projectiles = await page.evaluate(() => {
  const p = game.player;
  function clear() { game.entities = []; game.projectiles.list = []; }
  function shot(x,y,vx,extra) { const o = Object.assign({ x,y,vx,vy:0,dmg:10,type:P.ARROW,owner:'player',life:2,dead:false },extra); game.projectiles.add(o); return o; }
  clear(); const tall = __controlsEnemy(80,-60,12,70);
  shot(p.x,p.y - 88,180); updateProjectiles(); const tallHit = tall.hp < 1000;
  clear(); const far = __controlsEnemy(100,-60,12,20), near = __controlsEnemy(60,-60,12,20);
  shot(p.x,p.y - 60,180); updateProjectiles(); const nearest = near.hp < 1000 && far.hp === 1000;
  clear(); const skinny = __controlsEnemy(40,-60,8,80);
  shot(skinny.x + 15,skinny.y,0); updateProjectiles(); const narrowSafe = skinny.hp === 1000;
  const beamHit = pointNearBeam({ x:p.x,y:p.y - 92,beamEndX:p.x + 80,beamEndY:p.y - 92 },skinny);
  const beamMiss = !pointNearBeam({ x:skinny.x + 15,y:skinny.y - 80,beamEndX:skinny.x + 15,beamEndY:skinny.y + 80 },skinny);
  clear(); const persistent = __controlsEnemy(40,-60);
  shot(persistent.x,persistent.y,0,{ persistent:true,hitEnemies:[] }); updateProjectiles(); const hp = persistent.hp; updateProjectiles();
  const once = hp < 1000 && persistent.hp === hp;
  clear(); const wallX = Math.floor((p.x + 48) / TILE), wallY = Math.floor((p.y - 64) / TILE);
  game.world.set(wallX,wallY,T.STONE); const shielded = __controlsEnemy(100,-64);
  shot(p.x,p.y - 64,180); updateProjectiles(); const wallStops = shielded.hp === 1000;
  game.world.set(wallX,wallY,T.AIR);
  clear(); p.invuln = 0; p.hp = p.maxHp; p.dying = false;
  shot(p.x - 100,p.y,200,{ owner:'enemy' }); updateProjectiles(); const playerHit = p.hp < p.maxHp;
  clear(); p.invuln = 0; p.hp = p.maxHp;
  shot(p.x + p.w / 2 + 4,p.y,0,{ owner:'enemy' }); updateProjectiles(); const playerMiss = p.hp === p.maxHp;
  clear(); const ignored = __controlsEnemy(30,-60), etherian = __controlsEnemy(60,-60); etherian.ooaEnemy = true;
  shot(p.x,p.y - 60,100,{ eventOnly:'oldonesarmy' }); updateProjectiles();
  const eventFilter = ignored.hp === 1000 && etherian.hp < 1000;
  clear(); p.invuln = 999;
  return { tallHit,nearest,narrowSafe,beamHit,beamMiss,once,wallStops,playerHit,playerMiss,eventFilter };
});
for (const [key,label] of Object.entries({ tallHit:'Fast projectiles hit tall-body edges instead of tunneling',nearest:'The first body along a shot wins regardless of entity array order',narrowSafe:'Narrow bodies do not inherit oversized circular hitboxes',beamHit:'Beams hit actual tall-body edges',beamMiss:'Beams reject empty space beside narrow bodies',once:'Persistent projectile hit lists prevent duplicate hits',wallStops:'Fast projectiles cannot tunnel through a one-tile wall',playerHit:'Fast hostile shots use swept player-body collision',playerMiss:'Hostile shots outside the player body miss consistently',eventFilter:'Etherian-only shots retain their event target filter' })) check(results,label,projectiles[key],projectiles);

// Test the real key listeners: one toggle per physical press, not auto-repeat.
await page.evaluate(() => { game.paused = false; game.player.smartMine = false; });
await page.keyboard.down('Control');
await page.evaluate(() => { handleKeys(); game.paused = true; });
const toggled = await page.evaluate(() => game.player.smartMine);
await page.evaluate(() => document.dispatchEvent(new KeyboardEvent('keydown',{ key:'Control',repeat:true,bubbles:true })));
await page.evaluate(() => { game.paused = false; handleKeys(); game.paused = true; });
const repeat = await page.evaluate(() => game.player.smartMine);
await page.keyboard.up('Control');
await page.keyboard.down('Control');
await page.evaluate(() => { game.paused = false; handleKeys(); game.paused = true; });
const untoggled = await page.evaluate(() => !game.player.smartMine);
await page.keyboard.up('Control');
check(results,'Ctrl toggles smart mining once per press; repeated keydown does not toggle it',toggled && repeat && untoggled);
await page.evaluate(() => {
  const input = document.createElement('input'); input.id = 'controls-test-input'; document.body.appendChild(input); input.focus();
});
await page.keyboard.press('Control');
const typingSafe = await page.evaluate(() => { game.paused = false; handleKeys(); game.paused = true; const safe = !game.player.smartMine; document.getElementById('controls-test-input').remove(); return safe; });
check(results,'Ctrl does not change mining mode while typing in a text field',typingSafe);

const mining = await page.evaluate(() => {
  const p = game.player, w = game.world, origin = __controlsOrigin;
  p.x = origin.x; p.y = origin.y; p.vx = p.vy = 0; p.onGround = true;
  const pick = ITEMS[I.COPPERPICK], row = Math.floor(p.y / TILE), col = Math.floor(p.x / TILE);
  function reset() { for (let x = col - 5; x <= col + 5; x++) for (let y = row - 5; y <= row + 5; y++) w.set(x,y,T.AIR); }
  p.smartMine = true;
  reset(); w.set(col + 1,row,T.STONE); w.set(col + 2,row,T.STONE);
  MOUSE.wx = p.x + 500; MOUSE.wy = row * TILE + 8;
  const before = JSON.stringify([Array.from(w.tiles || w.data || []),p.inventory,p.mineCd]);
  const first = p.miningTarget(game,pick);
  const readonly = before === JSON.stringify([Array.from(w.tiles || w.data || []),p.inventory,p.mineCd]);
  const front = first && first.x === col + 1 && first.y === row;
  let strikes = 0; while (w.get(col + 1,row) !== T.AIR && strikes++ < 100) { p.mineCd = 0; p.tryMine(game,pick); }
  const next = p.miningTarget(game,pick);
  const actualBreak = w.get(col + 1,row) === T.AIR && next && next.x === col + 2;
  const animated = p.toolAnimT > 0;
  reset(); w.set(col + 4,row,T.STONE); const beyond = p.miningTarget(game,pick) === null;
  reset(); w.set(col + 2,row,T.STONE); p.smartMine = false;
  const preciseFar = p.miningTarget(game,pick) === null;
  MOUSE.wx = (col + 2) * TILE + 8; MOUSE.wy = row * TILE + 8;
  const precise = p.miningTarget(game,pick); const manual = precise && precise.x === col + 2;
  p.smartMine = true;
  reset(); w.set(col - 2,row,T.STONE); MOUSE.wx = p.x - 500; MOUSE.wy = row * TILE + 8;
  const left = p.miningTarget(game,pick); const leftward = left && left.x === col - 2;
  reset(); w.set(col,row + 2,T.STONE); MOUSE.wx = p.x; MOUSE.wy = p.y + 500;
  const down = p.miningTarget(game,pick); const downward = down && down.y === row + 2;
  reset(); w.set(col + 1,row,T.HELLSTONE); w.set(col + 2,row,T.STONE); MOUSE.wx = p.x + 500; MOUSE.wy = row * TILE + 8;
  const blocked = p.miningTarget(game,pick) === null;
  const liquids = [T.WATER,T.LAVA,T.SHIMMER].every(t => {
    reset(); w.set(col + 1,row,t); w.set(col + 2,row,T.STONE);
    const target = p.miningTarget(game,pick); return target && target.x === col + 2;
  });
  reset(); w.set(col + 2,row,T.TREETRUNK); const noTreePick = p.miningTarget(game,pick) === null;
  const axeTarget = p.miningTarget(game,ITEMS[I.COPPERAXE]); const axeTree = axeTarget && axeTarget.x === col + 2;
  reset(); w.set(col + 2,row,T.STONE); const noStoneAxe = p.miningTarget(game,ITEMS[I.COPPERAXE]) === null;
  reset(); w.set(col + 2,row,T.ETERNIASTAND); const event = game.event;
  game.event = { type:'oldonesarmy',standX:col + 2,standY:row };
  const protectedStand = p.miningTarget(game,pick) === null; game.event = event;
  reset(); w.set(col + 2,row,T.STONE); game.player.inventory.selected = 1;
  updateCrosshair(); const hint = document.getElementById('tilehint').textContent.includes('Smart mining ON');
  for (let x = origin.tx - 35; x <= origin.tx + 35; x++) w.set(x,origin.gy,T.STONE);
  return { front,readonly,actualBreak,animated,beyond,preciseFar,manual,leftward,downward,blocked,liquids,noTreePick,axeTree,noStoneAxe,protectedStand,hint };
});
check(results,'Smart mining ignores water/lava/shimmer instead of trying to break liquids',mining.liquids);
for (const [key,label] of Object.entries({ front:'Smart mining selects a reachable surface in the general cursor direction',readonly:'Mining preview selection is read-only',actualBreak:'Real mining breaks the selected block and advances to the next exposed block',animated:'Actual mining triggers a tool-use animation',beyond:'Smart mining cannot extend tool reach',preciseFar:'Manual mining still rejects distant cursor positions',manual:'Turning smart mode off restores exact cursor targeting',leftward:'Smart mining works to the left',downward:'Smart mining works downward',blocked:'Smart mining cannot target stone through an unmineable wall',noTreePick:'Pickaxe assist does not select tree trunks',axeTree:'Axe assist targets trees',noStoneAxe:'Axe assist does not select stone',protectedStand:'Smart mining preserves active Eternia stands',hint:'The cursor hint clearly indicates smart mining mode' })) check(results,label,mining[key],mining);

const integration = await page.evaluate(() => {
  const p = game.player, w = game.world, o = __controlsOrigin;
  function reset() {
    for (const key in KEY) KEY[key] = false;
    p.x = o.x; p.y = o.y; p.vx = p.vy = 0; p.onGround = true; p.dying = false; p.invuln = 999;
    p.mineCd = p.toolAnimT = p.landAnimT = 0; MOUSE.down = false; MOUSE.right = false;
    for (let x = o.tx - 8; x <= o.tx + 8; x++) for (let y = o.gy - 7; y <= o.gy; y++) w.set(x,y,y === o.gy ? T.STONE : T.AIR);
  }
  reset(); KEY.d = true; KEY.Control = true;
  for (let f = 0; f < 20; f++) p.update(game);
  const controlSpeed = p.vx;
  reset(); KEY.d = true; KEY.Shift = true;
  for (let f = 0; f < 20; f++) p.update(game);
  const shiftSpeed = p.vx;
  reset(); p.smartMine = true; p.inventory.selected = 1;
  const row = Math.floor(p.y / TILE);
  w.set(o.tx + 2,row,T.STONE); MOUSE.wx = p.x + 400; MOUSE.wy = row * TILE + 8;
  const hp = w.hp[w.idx(o.tx + 2,row)];
  for (let f = 0; f < 10; f++) p.update(game);
  const noAutoClick = w.hp[w.idx(o.tx + 2,row)] === hp;
  MOUSE.down = true; const toolFrames = new Set();
  for (let f = 0; f < 160; f++) { p.update(game); toolFrames.add(Math.round(p.toolAnimT * 100)); }
  MOUSE.down = false;
  const heldBreak = w.get(o.tx + 2,row) === T.AIR, continuousAnimation = toolFrames.size > 5;
  reset(); p.smartMine = true;
  w.setWall(o.tx + 2,row,WALL.WOOD); MOUSE.wx = p.x + 400; MOUSE.wy = row * TILE + 8;
  const hammer = ITEMS[I.PWHAMMER], target = p.miningTarget(game,hammer), wallBefore = p.inventory.countOf(I.WOODWALL);
  p.tryMine(game,hammer);
  const hammerWall = target && target.x === o.tx + 2 && w.wall(o.tx + 2,row) === WALL.NONE && p.inventory.countOf(I.WOODWALL) === wallBefore + 1;
  const hammerAnimation = p.toolAnimT > 0;
  reset(); return { controlSpeed,shiftSpeed,noAutoClick,heldBreak,continuousAnimation,hammerWall,hammerAnimation };
});
check(results,'Ctrl no longer causes accidental sprinting; Shift still runs faster',integration.controlSpeed < 3.1 && integration.shiftSpeed > 4,integration);
check(results,'Smart mining never breaks blocks without holding the action button',integration.noAutoClick);
check(results,'Holding left click mines the assisted target through real player update/cooldowns',integration.heldBreak);
check(results,'Continuous mining animates a complete tool stroke rather than restarting every hit',integration.continuousAnimation);
check(results,'Smart hammer targeting removes a wooden wall and awards its real item drop',integration.hammerWall);
check(results,'Hammer wall breaking also triggers the tool-use animation',integration.hammerAnimation);

const animation = await page.evaluate(() => {
  const p = game.player; p.inventory.accessories.fill(null);
  const c = document.createElement('canvas'); c.width = c.height = 120; const ctx = c.getContext('2d');
  function wing() { ctx.clearRect(0,0,120,120); ctx.save(); ctx.translate(60,60); const result = PixelArt.drawWings(ctx,p); ctx.restore(); return { result,ink:ctx.getImageData(0,0,120,120).data.some((v,i) => i % 4 === 3 && v) }; }
  p.onGround = false; p.jumps = 1; const noWings = wing();
  p.inventory.slots[5] = { id:I.BUTTERFLYWINGS,count:1 }; const backpack = wing();
  p.inventory.accessories[0] = I.CLOUDINABOTTLE; const bottle = wing();
  p.inventory.accessories[0] = I.BUTTERFLYWINGS; const equipped = wing();
  p.inventory.accessories[0] = null; const removed = wing();
  const states = [
    { onGround:true,vx:0,vy:0,landAnimT:0,swingT:0,toolAnimT:0 },
    { onGround:true,vx:2,walkPhase:2,landAnimT:0 },
    { onGround:true,vx:5,walkPhase:4,landAnimT:0 },
    { onGround:false,vx:0,vy:-5 },{ onGround:false,vx:0,vy:5 },
    { onGround:true,vx:0,landAnimT:0.1 },{ onGround:true,vx:0,landAnimT:0,swingT:0.2 },
    { onGround:true,vx:0,landAnimT:0,swingT:0,toolAnimT:0.1 }
  ].map(s => PixelArt.playerAnimation(s,1.8));
  const idle = [0,1.8,3.9].map(t => PixelArt.playerAnimation({ onGround:true,vx:0 },t).frame);
  p.onGround = true; p.toolAnimT = 0; p.swingT = 0; p.landAnimT = 0; p.smartMine = true;
  const before = JSON.stringify([p,game.event,game.entities,game.projectiles.list]);
  renderGame(game,ctx2d); const readonly = before === JSON.stringify([p,game.event,game.entities,game.projectiles.list]);
  return { noWings,backpack,bottle,equipped,removed,states,idle,readonly };
});
check(results,'Ordinary jumps, backpack wings and Cloud in a Bottle never draw fake wings',!animation.noWings.result && !animation.noWings.ink && !animation.backpack.ink && !animation.bottle.ink,animation);
check(results,'Equipped Butterfly Wings render, and unequipping immediately removes them',animation.equipped.result && animation.equipped.ink && !animation.removed.ink);
check(results,'Idle breathing/blinking, walk, run, rise, fall, landing, attack and mining have distinct animation states',new Set(animation.idle).size === 3 && animation.states.map(s => s.pose).slice(0,6).join(',') === 'idle,walk,run,rise,fall,land' && animation.states[6].action === 'attack' && animation.states[7].action === 'mine',animation.states);
check(results,'Drawing player poses and the smart-target outline never changes gameplay state',animation.readonly);

mkdirSync('test-results/graphics/player',{ recursive:true });
const sheet = await page.evaluate(() => {
  const c = document.createElement('canvas'); c.width = 960; c.height = 360; const ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#202534'; ctx.fillRect(0,0,c.width,c.height); ctx.fillStyle = '#ecd49e'; ctx.font = '18px monospace'; ctx.fillText('TREE / idle, blink, movement and equipment-correct wings',16,28);
  const samples = [{ pose:'idle',frame:0 },{ pose:'idle',frame:2 },{ pose:'idle',frame:3 },{ pose:'walk',frame:2 },{ pose:'run',frame:4 },{ pose:'rise',frame:0 },{ pose:'fall',frame:0 },{ pose:'land',frame:0 }];
  samples.forEach((a,i) => { ctx.save(); ctx.translate(60 + i * 120,148); ctx.scale(2.5,2.5); PixelArt.drawActor(ctx,0,0,1,'#578e9c','#e4ad80','#586480',false,0,a.frame,null,a.pose); ctx.restore(); ctx.fillStyle = '#d9d5c4'; ctx.font = '13px monospace'; ctx.fillText(a.pose + ':' + a.frame,16 + i * 120,214); });
  const p = game.player;
  [false,true].forEach((equipped,i) => { p.inventory.accessories[0] = equipped ? I.BUTTERFLYWINGS : null; p.onGround = false; ctx.save(); ctx.translate(150 + i * 300,300); ctx.scale(2,2); PixelArt.drawWings(ctx,p); PixelArt.drawActor(ctx,0,0,1,'#578e9c','#e4ad80','#586480',false,0,0,null,'rise'); ctx.restore(); ctx.fillStyle = '#d9d5c4'; ctx.fillText(equipped ? 'Butterfly Wings equipped' : 'Normal jump: no wings',30 + i * 300,348); });
  p.inventory.accessories[0] = null; p.onGround = true; p.inventory.selected = 1;
  return c.toDataURL('image/png');
});
writeFileSync('test-results/graphics/player/animation-artwork.png',Buffer.from(sheet.split(',')[1],'base64'));
await page.evaluate(() => {
  const p = game.player, o = __controlsOrigin, w = game.world;
  game.entities = []; game.projectiles.list = []; game.fx = []; game.fxTexts = [];
  game.messageT = 0; game.flashT = 0; game.shakeT = 0;
  document.getElementById('screenflash').style.opacity = 0;
  document.getElementById('screenflash').style.display = 'none';
  document.getElementById('message').style.display = 'none';
  document.getElementById('interact').style.display = 'none';
  p.x = o.x; p.y = o.y; p.onGround = true; p.vx = p.vy = 0; p.invuln = 0;
  p.smartMine = true; p.toolAnimT = 0.08; p.inventory.selected = 1;
  const row = Math.floor(p.y / TILE);
  w.set(o.tx + 2,row,T.STONE); w.set(o.tx + 2,row + 1,T.STONE);
  game.cam.x = p.x + 40; game.cam.y = p.y - 80;
  MOUSE.wx = p.x + 400; MOUSE.wy = row * TILE + 8;
  MOUSE.x = MOUSE.wx - game.cam.x + canvas.width / 2;
  MOUSE.y = MOUSE.wy - game.cam.y + canvas.height / 2;
  game.timeOfDay = 0.4; updateHud(); updateCrosshair(); render();
});
await page.screenshot({ path:'test-results/graphics/player/smart-mining.png' });
writeFileSync('test-results/graphics/player/index.html',`<!doctype html><meta charset="utf-8"><title>Player controls and animation review</title>
<style>body{background:#202534;color:#dedbc9;font:16px monospace;max-width:1280px;margin:24px auto;padding:0 16px}img{max-width:100%;image-rendering:pixelated}a{color:#ecd49e}</style>
<h1>Player controls and animations</h1><p>Ctrl toggles smart mining; aim and hold left click. Shift runs. Fixtures use an isolated disposable world.</p>
<h2>Animation poses and equipped wings</h2><img src="animation-artwork.png" alt="Idle breathing and blink, walk/run, rising/falling/landing and an ordinary jump versus equipped Butterfly Wings">
<h2>Smart-mining target preview</h2><img src="smart-mining.png" alt="A gold outline marks the reachable block selected ahead of the player; the cursor can aim farther away">
<p><a href="../combat/index.html">Combat-art gallery</a></p>`);
await assertNoBrowserErrors(results);
await finish(results,browser,'player-controls',{ melee,projectiles,mining,integration,animation });
