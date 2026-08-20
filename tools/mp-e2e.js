import assert from 'node:assert/strict';
import WebSocket from 'ws';

const base = process.env.TREE_RELAY || 'ws://127.0.0.1:8787';
const origin = 'http://localhost:8765';

function connect(path, first) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(base + path, { origin });
    const messages = [];
    const waiters = [];
    socket.on('open', () => socket.send(JSON.stringify({ ...first, v:1 })));
    socket.on('message', raw => {
      const message = JSON.parse(String(raw));
      messages.push(message);
      for (let i = waiters.length - 1; i >= 0; i--) {
        if (waiters[i].test(message)) {
          const waiter = waiters.splice(i, 1)[0];
          clearTimeout(waiter.timer); waiter.resolve(message);
        }
      }
    });
    socket.on('error', reject);
    const client = {
      socket, messages,
      send(message) { socket.send(JSON.stringify({ ...message, v:1 })); },
      wait(test, timeout = 5000) {
        const existing = messages.find(test);
        if (existing) return Promise.resolve(existing);
        return new Promise((waitResolve, waitReject) => {
          const waiter = { test, resolve:waitResolve, timer:setTimeout(() => {
            const index = waiters.indexOf(waiter); if (index >= 0) waiters.splice(index, 1);
            waitReject(new Error('message timeout'));
          }, timeout) };
          waiters.push(waiter);
        });
      },
      close() { socket.close(1000, 'test complete'); },
    };
    client.wait(message => message.t === 'welcome').then(() => resolve(client), reject);
  });
}

const host = await connect('?create=1', { t:'create', name:'Host', world:'Oak', lobbyName:'Host world', password:'acorn' });
const welcome = host.messages.find(message => message.t === 'welcome');
assert.equal(welcome.you, 1);
assert.match(welcome.code, /^[A-Z0-9]{5}$/);

const response = await fetch(base.replace(/^ws/, 'http') + '/lobbies', { headers:{ Origin:origin } });
assert.equal(response.ok, true);
const listed = await response.json();
assert.equal(listed.lobbies.some(lobby => lobby.code === welcome.code && lobby.locked), true);

const guest = await connect('?code=' + welcome.code, { t:'join', code:welcome.code, name:'Guest', password:'acorn' });
await host.wait(message => message.t === 'lobby' && message.players.length === 2);
host.send({ t:'start', metadata:{ world:'Oak' } });
await guest.wait(message => message.t === 'start');

const late = await connect('?code=' + welcome.code, { t:'join', code:welcome.code, name:'Late', password:'acorn' });
const request = await host.wait(message => message.t === 'snapshot-request' && message.from === 3);
assert.equal(request.from, 3);
host.send({ t:'snapshot-begin', id:'snap', total:1, to:3 });
host.send({ t:'snapshot-chunk', id:'snap', index:0, data:'{"world":"Oak"}', to:3 });
host.send({ t:'snapshot-end', id:'snap', to:3 });
assert.equal((await late.wait(message => message.t === 'snapshot-chunk')).data, '{"world":"Oak"}');

guest.send({ t:'game', k:'player', state:{ x:10, y:20 } });
const relayed = await host.wait(message => message.t === 'game' && message.from === 2);
assert.equal(relayed.state.x, 10);
host.send({ t:'game', k:'frame', state:{ tick:4 } });
assert.equal((await guest.wait(message => message.t === 'game' && message.k === 'frame')).state.tick, 4);

host.close();
const promoted = await guest.wait(message => message.t === 'host' && message.host === 2);
assert.equal(promoted.host, 2);
guest.close(); late.close();
console.log('relay create, password, listing, running join, snapshot, routing, and host promotion passed');
