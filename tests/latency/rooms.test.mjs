// Latency integration test against `wrangler dev` on port 8850 (inspector
// 9350), with a stub games-guard (tests/latency/stub-guard) that prints each
// lag record. Run: node tests/latency/rooms.test.mjs
//
// Checks: GET /ping (region, CORS, no room created, bad codes refused), the
// lag record's country / edge / region / moved, and that tree never moves a
// room (item 4 is N/A: the host starts alone, see LATENCY-NOTES.md).
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import WebSocket from 'ws';
import { regionOfColo } from '../../worker/netplace.js';

const root = fileURLToPath(new URL('../..', import.meta.url));
const PORT = 8850;
const base = `http://127.0.0.1:${PORT}`;
const origin = 'http://localhost:8851';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const records = [];
let output = '';
const dev = spawn('npx', [
  'wrangler', 'dev', '-c', 'wrangler.jsonc', '-c', 'tests/latency/stub-guard/wrangler.jsonc',
  '--port', String(PORT), '--inspector-port', '9350', '--ip', '127.0.0.1',
  '--var', 'TREE_ADMIN_TOKEN:local-test', '--var', 'TREE_DEV_TRUST_WHERE:1',
], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'], detached: true });
const onOutput = chunk => {
  output += chunk;
  let line;
  while ((line = /NETLOG (\{.*\})\n/.exec(output))) {
    records.push(JSON.parse(line[1]));
    output = output.slice(line.index + line[0].length);
  }
  if (output.length > 100_000) output = output.slice(-10_000);
};
dev.stdout.setEncoding('utf8').on('data', onOutput);
dev.stderr.setEncoding('utf8').on('data', onOutput);
const stop = () => { try { process.kill(-dev.pid, 'SIGTERM'); } catch { /* already gone */ } };
process.on('exit', stop);

async function ready() {
  for (let i = 0; i < 120; i++) {
    try { if ((await fetch(base + '/health')).ok) return; } catch { /* not up yet */ }
    await sleep(500);
  }
  throw new Error('wrangler dev did not start:\n' + output);
}

function connect(path, first, where) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(base.replace(/^http/, 'ws') + path, {
      origin, headers: { 'X-Games-Country': where.country, 'X-Games-Edge': where.edge },
    });
    const messages = [];
    socket.on('open', () => socket.send(JSON.stringify({ ...first, v: 1 })));
    socket.on('message', raw => messages.push(JSON.parse(String(raw))));
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
    client.wait(message => message.t === 'welcome').then(() => resolve(client), reject);
  });
}

async function waitFor(test, timeout = 15_000) {
  for (const end = Date.now() + timeout; Date.now() < end; await sleep(100)) {
    const found = test();
    if (found) return found;
  }
  throw new Error('timed out');
}

let passed = 0;
const check = (name, fn) => fn().then(() => { passed++; console.log('ok', name); });

try {
  await ready();

  await check('/ping refuses bad codes and does not create rooms', async () => {
    const bad = await fetch(base + '/ping?room=AAAAA');
    assert.equal(bad.status, 400);
    assert.equal(bad.headers.get('access-control-allow-origin'), '*');
    const none = await fetch(base + '/ping?room=BCDFG');
    assert.equal(none.status, 404);
    assert.equal(none.headers.get('access-control-allow-origin'), '*');
    assert.equal(none.headers.get('cache-control'), 'no-store');
    // The empty object it reached is still not a lobby.
    assert.equal((await fetch(base + '/ping?room=BCDFG')).status, 404);
    const join = await new Promise(resolve => {
      const socket = new WebSocket(base.replace(/^http/, 'ws') + '/?code=BCDFG', { origin });
      socket.on('open', () => socket.send(JSON.stringify({ t: 'join', v: 1, name: 'X' })));
      socket.on('message', raw => resolve(JSON.parse(String(raw))));
    });
    assert.equal(join.code, 'missing');
  });

  // A mixed group: the host in Australia, guests in Germany and Japan.
  const host = await connect('/?create=1', { t: 'create', name: 'Ana', world: 'Oak' }, { country: 'AU', edge: 'PER' });
  const code = host.messages.find(message => message.t === 'welcome').code;
  let guests = [];

  await check('/ping answers the room region with CORS', async () => {
    const response = await fetch(base + '/ping?room=' + code.toLowerCase());
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('access-control-allow-origin'), '*');
    assert.equal(response.headers.get('cache-control'), 'no-store');
    const body = await response.json();
    assert.match(body.colo, /^[A-Z]{3}$/, 'wrangler dev looks up its colo over the network');
    assert.equal(body.region, regionOfColo(body.colo));
    assert.ok(body.region, `colo ${body.colo} has a region`);
  });

  await check('the host starts alone, so no room ever moves', async () => {
    host.send({ t: 'start', metadata: { world: 'Oak' } });
    await host.wait(message => message.t === 'start');
    const guest = await connect('/?code=' + code, { t: 'join', name: 'Ben' }, { country: 'DE', edge: 'FRA' });
    const late = await connect('/?code=' + code, { t: 'join', name: 'Chie' }, { country: 'JP', edge: 'NRT' });
    await guest.wait(message => message.t === 'snapshot-needed');
    await host.wait(message => message.t === 'snapshot-request' && message.from === 3);
    guests = [guest, late];
    // Pings for a little over the 10 s a session needs to be logged.
    for (let k = 0; k < 11; k++) {
      host.send({ t: 'ping', c: k, rtt: 15, fps: 60 });
      guest.send({ t: 'ping', c: k, rtt: 290, fps: 60 });
      late.send({ t: 'ping', c: k, rtt: 120, fps: 60 });
      await sleep(1000);
    }
    for (const client of [host, guest, late]) {
      assert.equal(client.messages.some(message => message.t === 'move'), false);
      assert.equal(client.messages.filter(message => message.t === 'pong').length >= 10, true);
    }
  });

  await check('the lag record has country, edge, region and moved', async () => {
    for (const client of [...guests, host]) client.close();
    const { game, log } = await waitFor(() => records.find(record => record.log.code === code));
    assert.equal(game, 'tree');
    assert.equal(log.moved, null);
    assert.ok(log.colo, 'colo is known');
    assert.equal(log.region, regionOfColo(log.colo));
    assert.deepEqual(log.seats.map(seat => [seat.name, seat.country, seat.edge]),
      [['Ana', 'AU', 'PER'], ['Ben', 'DE', 'FRA'], ['Chie', 'JP', 'NRT']]);
    assert.ok(log.seats[1].rttP95 >= 280);
  });

  console.log(`rooms.test: ${passed} passed`);
} catch (error) {
  console.error(error);
  console.error('--- wrangler output tail ---\n' + output.slice(-3000));
  process.exitCode = 1;
} finally {
  stop();
}
