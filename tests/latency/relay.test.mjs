// Room in plain Node (like tools/mp-netlog-smoke.js): where each player
// connects from reaches the lag record, and /ping answers without a lobby
// only with 404. Run: node tests/latency/relay.test.mjs
import assert from 'node:assert/strict';
import { Room } from '../../worker/relay.js';

const tick = () => new Promise(resolve => setTimeout(resolve, 0));

function makeRoom(logs) {
  const storage = new Map();
  const state = {
    blockConcurrencyWhile: fn => fn(),
    getWebSockets: () => [],
    waitUntil() {},
    storage: {
      get: async key => storage.get(key),
      put: async (key, value) => { storage.set(key, value); },
      delete: async key => { storage.delete(key); },
      deleteAll: async () => { storage.clear(); },
    },
  };
  const env = {
    REGISTRY: { getByName: () => ({ fetch: async () => new Response(null, { status: 204 }) }) },
    NETLOG: { record: async (game, log) => { logs.push({ game, log }); } },
  };
  const room = new Room(state, env);
  room.colo = 'SIN';
  return room;
}

function makeSocket(action, where) {
  let attachment = { initialized: false, action, code: 'BCDFG', ip: 'test', where, connectedAt: Date.now() };
  return {
    sent: [],
    serializeAttachment(value) { attachment = value; },
    deserializeAttachment() { return attachment; },
    send(raw) { this.sent.push(JSON.parse(raw)); },
    close() {},
  };
}

const say = (room, socket, message) => room.webSocketMessage(socket, JSON.stringify({ v: 1, ...message }));

const logs = [];
const room = makeRoom(logs);

const empty = await room.fetch(new Request('https://room.internal/ping'));
assert.equal(empty.status, 404);
assert.equal(empty.headers.get('Access-Control-Allow-Origin'), '*');

const host = makeSocket('create', { country: 'SG', edge: 'SIN' });
await say(room, host, { t: 'create', name: 'Ana', world: 'Oak' });
const guest = makeSocket('join', { country: 'NZ', edge: 'AKL' });
await say(room, guest, { t: 'join', name: 'Ben' });
const older = makeSocket('join');          // a socket accepted before where was recorded
await say(room, older, { t: 'join', name: 'Cy' });

const ping = await room.fetch(new Request('https://room.internal/ping'));
assert.equal(ping.status, 200);
assert.equal(ping.headers.get('Cache-Control'), 'no-store');
assert.deepEqual(await ping.json(), { colo: 'SIN', region: 'apac' });

await say(room, host, { t: 'start' });
room.net.startedAt -= 60_000;
await say(room, guest, { t: 'ping', c: 1, rtt: 90 });
for (const socket of [older, guest, host]) await room.webSocketClose(socket);
await tick();

assert.equal(logs.length, 1);
const { log } = logs[0];
assert.equal(log.region, 'apac');
assert.equal(log.moved, null);
assert.deepEqual(log.seats.map(seat => [seat.name, seat.country, seat.edge]),
  [['Ana', 'SG', 'SIN'], ['Ben', 'NZ', 'AKL'], ['Cy', '', '']]);

console.log('relay latency unit test passed');
