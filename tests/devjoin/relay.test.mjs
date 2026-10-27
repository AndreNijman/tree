// Dev join against `wrangler dev` on port 8852 (inspector 9352) with a
// throwaway signing key. Run: node tests/devjoin/relay.test.mjs
//
// A dev (a pass signed for tree.andrenijman.com) joins a locked room without
// its password and a full room as a ninth seat, mid-world; everyone hears
// {t:'dev-joined', name}. Forged, expired and other-host passes get the
// normal rules. Tree has no kick, so there is nothing a player could use on a dev.
import assert from 'node:assert/strict';
import WebSocket from 'ws';
import { keyPair, pass, sleep, startRelay } from './support.mjs';

const origin = 'http://localhost:8851';
const keys = await keyPair();
const stranger = await keyPair();
const relay = await startRelay({ port: 8852, inspector: 9352, publicKey: keys.publicKey });
const wsBase = relay.base.replace(/^http/, 'ws');

// Resolves with the client on welcome, or with { error } on a fatal error.
function connect(path, first) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(wsBase + path, { origin });
    const messages = [];
    socket.on('open', () => socket.send(JSON.stringify({ ...first, v: 1 })));
    socket.on('message', raw => {
      const message = JSON.parse(String(raw));
      messages.push(message);
      if (message.t === 'welcome') resolve(client);
      if (message.t === 'error' && message.fatal) resolve({ error: message.code, messages });
    });
    socket.on('error', reject);
    const client = {
      socket, messages,
      send(message) { socket.send(JSON.stringify({ ...message, v: 1 })); },
      async wait(test, timeout = 5000) {
        for (const end = Date.now() + timeout; Date.now() < end; await sleep(20)) {
          const found = messages.find(test);
          if (found) return found;
        }
        throw new Error('message timeout');
      },
      close() { socket.close(1000, 'test complete'); },
    };
  });
}

const lobbies = async () => (await (await fetch(relay.base + '/lobbies', { headers: { Origin: origin } })).json()).lobbies;

let passed = 0;
const check = (name, fn) => fn().then(() => { passed++; console.log('ok', name); });
const open = [];

try {
  const host = await connect('/?create=1', { t: 'create', name: 'Ana', world: 'Oak', password: 'acorn' });
  open.push(host);
  const code = host.messages.find(message => message.t === 'welcome').code;
  host.send({ t: 'start', metadata: { world: 'Oak' } });
  await host.wait(message => message.t === 'start');
  const join = (name, extra = {}) => connect('/?code=' + code, { t: 'join', code, name, ...extra });
  const bad = {
    forged: await pass(stranger.privateKey),
    expired: await pass(keys.privateKey, { now: Date.now() - 20 * 60 * 1000 }),
    'other host': await pass(keys.privateKey, { host: 'fart.andrenijman.com' }),
    'bare flag': true,
  };

  await check('a locked room refuses everyone without the password, bad passes included', async () => {
    assert.equal((await join('Nobody')).error, 'password');
    for (const [kind, dev] of Object.entries(bad)) {
      const result = await join('Faker', { dev });
      assert.equal(result.error, 'password', kind);
      assert.equal(result.messages.some(message => message.t === 'dev-joined'), false, kind);
    }
  });

  let andre;
  await check('a dev joins the locked, running world without the password', async () => {
    andre = await join('Andre', { dev: await pass(keys.privateKey) });
    open.push(andre);
    assert.ok(andre.socket, 'welcomed');
    const welcome = andre.messages.find(message => message.t === 'welcome');
    assert.equal(welcome.phase, 'running');
    // Mid-world: the dev gets the world from the host like any late guest.
    await andre.wait(message => message.t === 'snapshot-needed');
    await host.wait(message => message.t === 'snapshot-request' && message.from === welcome.you);
    for (const client of [host, andre]) {
      const heard = await client.wait(message => message.t === 'dev-joined');
      assert.deepEqual(heard, { t: 'dev-joined', name: 'ANDRE' });
    }
  });

  const guests = [];
  await check('ordinary guests fill the room to 8; a ninth is refused, bad passes too', async () => {
    for (let i = 0; i < 6; i++) {
      const guest = await join('Guest' + i, { password: 'acorn' });
      assert.ok(guest.socket, 'guest welcomed');
      guests.push(guest); open.push(guest);
    }
    await host.wait(message => message.t === 'lobby' && message.players.length === 8);
    assert.equal((await join('Ninth', { password: 'acorn' })).error, 'full');
    for (const [kind, dev] of Object.entries(bad)) {
      assert.equal((await join('Faker', { password: 'acorn', dev })).error, 'full', kind);
    }
  });

  await check('a dev joins the full room as a ninth seat and stays', async () => {
    const tung = await join('Tung', { dev: await pass(keys.privateKey, { name: 'Tung' }) });
    open.push(tung);
    assert.ok(tung.socket, 'welcomed');
    const you = tung.messages.find(message => message.t === 'welcome').you;
    const roster = await host.wait(message => message.t === 'lobby' && message.players.length === 9);
    assert.ok(roster.players.some(player => player.id === you && player.name === 'Tung'));
    await host.wait(message => message.t === 'snapshot-request' && message.from === you);
    for (const client of [host, andre, tung, ...guests]) {
      await client.wait(message => message.t === 'dev-joined' && message.name === 'TUNG');
    }
    // The registry update for 9 seats must not eject the dev.
    await sleep(1000);
    assert.equal(tung.socket.readyState, WebSocket.OPEN);
    assert.equal(tung.messages.some(message => message.t === 'error'), false);
    const listed = (await lobbies()).find(lobby => lobby.code === code);
    assert.deepEqual([listed.players, listed.max, listed.locked], [8, 8, true]);
    // Messages flow both ways for the ninth seat.
    tung.send({ t: 'game', k: 'player', state: { x: 1, y: 2 } });
    await host.wait(message => message.t === 'game' && message.from === you);
    host.send({ t: 'game', k: 'frame', state: { players: [] } });
    await tung.wait(message => message.t === 'game' && message.k === 'frame');
    tung.close();
    await host.wait(message => message.t === 'lobby' && message.players.length === 8 &&
      !message.players.some(player => player.id === you));
  });

  await check('a dev hosting alone hears its own dev-joined', async () => {
    const solo = await connect('/?create=1', { t: 'create', name: 'Andre', world: 'Elm', dev: await pass(keys.privateKey) });
    open.push(solo);
    assert.deepEqual(await solo.wait(message => message.t === 'dev-joined'), { t: 'dev-joined', name: 'ANDRE' });
  });

  console.log(`devjoin relay.test: ${passed} passed`);
} catch (error) {
  console.error(error);
  console.error('--- wrangler output tail ---\n' + relay.output().slice(-3000));
  process.exitCode = 1;
} finally {
  for (const client of open) { try { client.close(); } catch { /* gone */ } }
  await sleep(200);
  relay.stop();
}
