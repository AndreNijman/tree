import assert from 'node:assert/strict';
import { Room } from '../worker/relay.js';

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
  room.colo = 'PER';
  return room;
}

function makeSocket(action, code) {
  let attachment = { initialized: false, action, code, ip: 'test', connectedAt: Date.now() };
  return {
    sent: [],
    serializeAttachment(value) { attachment = value; },
    deserializeAttachment() { return attachment; },
    send(raw) { this.sent.push(JSON.parse(raw)); },
    close() {},
  };
}

async function join(room, action, name, extra = {}) {
  const socket = makeSocket(action, 'BCDFG');
  await room.webSocketMessage(socket, JSON.stringify({ t: action, v: 1, name, world: 'Oakvale', ...extra }));
  return socket;
}

const say = (room, socket, message) => room.webSocketMessage(socket, JSON.stringify({ v: 1, ...message }));

// A hosted session runs from the world starting until everyone has left.
{
  const logs = [];
  const room = makeRoom(logs);
  const host = await join(room, 'create', 'Ana');
  const guest = await join(room, 'join', 'Ben');
  await say(room, host, { t: 'start', metadata: { world: 'Oakvale' } });
  assert.ok(room.net, 'starting the world starts the lag log');
  room.net.startedAt -= 60_000;
  for (let k = 0; k < 20; k++) {
    await say(room, host, { t: 'ping', c: k, rtt: 40 + k, fps: 60, frameMax: 20 });
    await say(room, guest, { t: 'ping', c: k, rtt: 300 + k, fps: 55, frameMax: 40 });
    await say(room, guest, { t: 'game', k: 'player', state: {} });
  }
  assert.equal(guest.sent.filter(message => message.t === 'pong').at(-1).c, 19, 'pongs echo c');
  await room.webSocketClose(guest);
  assert.equal(logs.length, 0, 'one player leaving does not end the session');
  await room.webSocketClose(host);
  await tick();

  assert.equal(logs.length, 1);
  assert.equal(logs[0].game, 'tree');
  const { log } = logs[0];
  assert.equal(log.outcome, 'closed');
  assert.equal(log.code, 'BCDFG');
  assert.equal(log.colo, 'PER');
  assert.equal(log.mode, '2p co-op · Oakvale');
  assert.deepEqual(log.seats.map(seat => seat.name), ['Ana', 'Ben']);
  assert.ok(log.seats[0].rttP95 < 100 && log.seats[1].rttP95 >= 300);
  assert.equal(log.seats[1].fpsMed, 55);
  assert.equal(room.net, null);
}

// A session shorter than 10 s is not logged; an admin removal logs once.
{
  const logs = [];
  const room = makeRoom(logs);
  const host = await join(room, 'create', 'Ana');
  await say(room, host, { t: 'start' });
  await room.webSocketClose(host);
  await tick();
  assert.equal(logs.length, 0);

  const again = await join(room, 'create', 'Ana');
  await say(room, again, { t: 'start' });
  room.net.startedAt -= 30_000;
  await room.destroy();
  await room.destroy();
  await tick();
  assert.equal(logs.length, 1);
  assert.equal(logs[0].log.outcome, 'closed');
}

// A long session is cut into 30-minute records; a rejoin keeps its seat.
{
  const logs = [];
  const room = makeRoom(logs);
  const host = await join(room, 'create', 'Ana');
  const guest = await join(room, 'join', 'Guest');
  await say(room, host, { t: 'start' });
  const oldId = guest.deserializeAttachment().id;
  await room.webSocketClose(guest);
  const back = await join(room, 'join', 'Guest', { rejoin: oldId });
  const stranger = await join(room, 'join', 'Guest', { rejoin: oldId });
  room.net.startedAt -= 31 * 60_000;
  await say(room, host, { t: 'ping', c: 1, rtt: 50 });
  await tick();

  assert.equal(logs.length, 1);
  const { log } = logs[0];
  assert.equal(log.outcome, 'finished');
  assert.deepEqual(log.seats.map(seat => [seat.name, seat.reconnects]), [['Ana', 0], ['Guest', 1], ['Guest', 0]]);
  assert.ok(room.net, 'the next 30 minutes start at once');
  assert.equal(room.net.seats.size, 3, 'everyone still here is seated again');
  for (const socket of [host, back, stranger]) await room.webSocketClose(socket);
}

console.log('relay lag log smoke passed');
