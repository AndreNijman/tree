import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const url = process.env.TREE_URL || 'http://127.0.0.1:8765/?relay=ws://localhost:8787';
const browser = await chromium.launch({ headless:true });
const hostContext = await browser.newContext();
const guestContext = await browser.newContext();
const host = await hostContext.newPage();
const guest = await guestContext.newPage();
const errors = [];
for (const [name, page] of [['host', host], ['guest', guest]]) {
  page.on('pageerror', error => errors.push(`${name}: ${error.stack || error.message}`));
  page.on('console', message => {
    if (message.type() === 'error' && !message.text().includes('/_guard/status') && !message.text().includes('Failed to load resource')) errors.push(`${name} console: ${message.text()}`);
  });
}

try {
await host.goto(url);
await host.evaluate(async () => {
  activeWorldId = 'mp-smoke-world'; activeWorldName = 'Network Oak';
  buildGame(7357, 'corrupt');
  await saveGame(true);
  game = null;
  await renderWorldList();
  document.querySelector('#mp-name').value = 'Host';
});
await host.locator('.world-host').click();
await host.waitForFunction(() => Net.started && Net.isHost() && game && game.started, null, { timeout:45000 });
const code = await host.evaluate(() => Net.code);
assert.match(code, /^[A-Z0-9]{5}$/);
await host.evaluate(() => {
  const tx = Math.floor(game.world.spawnX / TILE);
  const ground = Math.floor((game.world.spawnY + game.player.h / 2) / TILE);
  for (let x = tx - 2; x <= tx + 2; x++) {
    for (let y = ground - 8; y < ground; y++) game.world.set(x, y, T.STONE);
  }
  game.player.x += 160;
});

await guest.goto(url);
await guest.evaluate(codeValue => {
  document.querySelector('#mp-name').value = 'Guest';
  Net.joinCode(codeValue);
}, code);
await guest.waitForFunction(() => Net.started && Net.isClient() && game && game.started, null, { timeout:45000 });
assert.equal(await guest.evaluate(() => {
  const p = game.player, w = game.world;
  const left = Math.floor((p.x - p.w / 2) / TILE), right = Math.floor((p.x + p.w / 2 - 0.01) / TILE);
  const top = Math.floor((p.y - p.h / 2) / TILE), bottom = Math.floor((p.y + p.h / 2 - 0.01) / TILE);
  for (let x = left; x <= right; x++) for (let y = top; y <= bottom; y++) if (w.isSolid(x, y)) return false;
  return true;
}), true);
await host.waitForFunction(() => Object.keys(Net.remotePlayers).length === 1, null, { timeout:10000 });
await guest.waitForFunction(() => Object.keys(Net.remotePlayers).length === 1, null, { timeout:10000 });

const guestId = await guest.evaluate(() => Net.id);
await guest.evaluate(() => { game.player.x += 96; game.player.vx = 2; });
await host.waitForFunction(id => Net.remotePlayers[id] && Math.abs(Net.remotePlayers[id].targetX - (game.world.spawnX + 96)) < 8, guestId);

const tile = await guest.evaluate(() => {
  const x = Math.floor(game.player.x / TILE), y = Math.floor(game.player.y / TILE) - 2;
  game.world.set(x, y, T.TORCH);
  return { x, y };
});
await host.waitForFunction(pos => game.world.get(pos.x, pos.y) === T.TORCH, tile);

const torchCraft = await guest.evaluate(() => {
  const recipe = RECIPES.find(candidate => candidate.result === I.TORCH && candidate.station === 'none');
  if (!recipe) throw new Error('no none-station torch recipe');
  // torches need wood: grant the guest enough for several crafts
  for (const mat of (recipe.mat || [])) game.player.inventory.add(mat[0], mat[1] * 4);
  const before = game.player.inventory.countOf(I.TORCH);
  if (!craftRecipe(game, recipe)) throw new Error('guest craft failed');
  return { before, gain: recipe.count };
});
assert.equal(await guest.evaluate(d => game.player.inventory.countOf(I.TORCH) === d.before + d.gain, torchCraft), true);
await host.waitForFunction(([id, expect]) => Net.remotePlayers[id] && Net.remotePlayers[id].inventory.countOf(I.TORCH) === expect, [guestId, torchCraft.before + torchCraft.gain], { timeout: 10000 });

const chestPos = await host.evaluate(() => ({ x:game.world.chests[0].x, y:game.world.chests[0].y }));
await guest.evaluate(pos => {
  game.player.x = pos.x * TILE + 8; game.player.y = pos.y * TILE + 8;
}, chestPos);
await host.waitForFunction(([id, pos]) => Net.remotePlayers[id] && dist(Net.remotePlayers[id].x, Net.remotePlayers[id].y, pos.x * TILE + 8, pos.y * TILE + 8) < 20, [guestId, chestPos]);
await guest.evaluate(pos => {
  const chest = game.world.chestAt(pos.x, pos.y);
  chest.inv.push({ id:I.DIRT, count:321 });
  Net.syncChest(chest);
}, chestPos);
await host.waitForFunction(pos => game.world.chestAt(pos.x, pos.y).inv.some(stack => stack.id === I.DIRT && stack.count === 321), chestPos);

// Deterministic fixture: verify every trunk/leaf tile, not an optional tiny
// tree or an arbitrary column which might already be empty on the guest.
const tree = await host.evaluate(() => {
  const w = game.world;
  const x = Math.floor(w.spawnX / TILE) + 20, y = 80, tiles = [];
  for (let dx = -5; dx <= 5; dx++) for (let dy = -14; dy <= 2; dy++) w.set(x + dx, y + dy, T.AIR);
  for (let dy = 0; dy > -8; dy--) { w.set(x, y + dy, T.TREETRUNK); tiles.push({ x, y:y + dy, t:T.TREETRUNK }); }
  for (let dx = -2; dx <= 2; dx++) { w.set(x + dx, y - 8, T.LEAVES); tiles.push({ x:x + dx, y:y - 8, t:T.LEAVES }); }
  w.set(x + 1, y, T.WOOD);
  return { x, y, tiles };
});
await guest.waitForFunction(tree => tree.tiles.every(t => game.world.get(t.x, t.y) === t.t), tree, { timeout:10000, polling:100 });
await host.evaluate(tree => game.world.breakTile(tree.x, tree.y), tree);
await guest.waitForFunction(tree => tree.tiles.every(t => game.world.get(t.x, t.y) === T.AIR) &&
  game.world.get(tree.x + 1, tree.y) === T.WOOD, tree, { timeout:10000, polling:100 });
console.log('tree felling synced (' + tree.tiles.length + ' trunk/leaf tiles; built wood preserved) to guest');

const enemy = await host.evaluate(id => {
  const remote = Net.remotePlayers[id];
  const e = spawnEntity(game, E.SLIME, remote.x + 40, remote.y);
  e.hp = 80; e.maxHp = 80;
  return true;
}, guestId);
assert.equal(enemy, true);
await guest.waitForFunction(() => game.entities.some(e => e.type === E.SLIME && e.nid), null, { timeout:10000 });
const enemyNid = await guest.evaluate(() => {
  const e = game.entities.find(candidate => candidate.type === E.SLIME && candidate.nid);
  hitEntity(e, 25, 0, 0, game);
  return e.nid;
});
await host.waitForFunction(nid => {
  const e = Net.entityByNid(nid); return e && e.hp < 80;
}, enemyNid);

const pickupNid = await host.evaluate(id => {
  const remote = Net.remotePlayers[id];
  game.addPickup(remote.x, remote.y, I.GEL, 2);
  return game.pickups[game.pickups.length - 1].nid;
}, guestId);
await host.waitForFunction(nid => !game.pickups.some(pickup => pickup.nid === nid), pickupNid);
assert.equal(await guest.evaluate(() => game.player.inventory.countOf(I.GEL) >= 2), true);

await guest.evaluate(() => game.spawnBoss('kingslime'));
await host.waitForFunction(() => game.entities.some(e => e.boss === 'kingslime'), null, { timeout:10000 });
await guest.waitForFunction(() => game.entities.some(e => e.boss === 'kingslime'), null, { timeout:10000 });

await host.evaluate(() => { game.hardmode = true; game.world.hardmode = true; });
await guest.waitForFunction(() => game.hardmode === true);

await guest.evaluate(() => { window.__smokeOldSocket = Net.ws; Net.send({ t:'leave' }); });
await guest.waitForFunction(() => window.__smokeOldSocket.readyState === WebSocket.CLOSED, null, { timeout:15000, polling:100 });
// NOTE: the relay may reuse the freed socket id for the reconnect, so a new
// Net.id is NOT guaranteed — reconnection means: client again, socket open,
// netDisconnected cleared. (raf-poll waitForFunction proved flaky here; use
// an explicit poll loop.)
let reconnectedOk = false;
for (let i = 0; i < 120 && !reconnectedOk; i++) {
  await guest.waitForTimeout(500);
  reconnectedOk = await guest.evaluate(() =>
    Net.started && Net.isClient() && Net.ws && Net.ws.readyState === 1 && !game.netDisconnected);
}
if (!reconnectedOk) {
  const dbg = await guest.evaluate(() => ({
    started: Net.started, mode: Net.mode, id: Net.id, code: Net.code,
    attempts: Net.reconnectAttempts, netDisconnected: game && game.netDisconnected,
    ws: Net.ws ? Net.ws.readyState : null, status: document.querySelector('#net-status') ? document.querySelector('#net-status').textContent : '',
  }));
  console.log('guest reconnect debug:', JSON.stringify(dbg, null, 2));
  console.log('errors so far:', JSON.stringify(errors, null, 2));
  throw new Error('guest did not reconnect after leave');
}
const rejoinedGuestId = await guest.evaluate(() => Net.id);
if (rejoinedGuestId !== guestId) {
  await host.waitForFunction(([oldId, newId]) => !Net.remotePlayers[oldId] && Net.remotePlayers[newId], [guestId, rejoinedGuestId], { timeout:10000 });
} else {
  // relay reused the id: the host must still see the guest online again
  await host.waitForFunction(id => Net.remotePlayers[id], rejoinedGuestId, { timeout:10000 });
  console.log('relay reused guest id', rejoinedGuestId, 'after reconnect');
}

await host.close();
await guest.waitForFunction(() => Net.isHost(), null, { timeout:10000 });
assert.equal(await guest.evaluate(() => game.entities.some(e => e.boss === 'kingslime')), true);

assert.deepEqual(errors, []);
console.log('browser safe spawn, host/join, snapshot, players, tiles, combat, pickups, bosses, progression, reconnect, and host promotion passed');
} finally {
  await browser.close();
}
