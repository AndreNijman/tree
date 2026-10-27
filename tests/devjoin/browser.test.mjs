// Dev join in the real client: headless Chromium against `wrangler dev` on
// port 8853 (inspector 9353) with a throwaway signing key.
// Run: node tests/devjoin/browser.test.mjs   (SHOT_DIR=... for the screenshot)
//
// A host (locked world) and a guest are playing; six more seats fill the room
// to 8; a third page opens https://tree.andrenijman.com/?join=CODE as dev
// ANDRE and drops into the world as a ninth player. Every page shows
// "DEV ANDRE HAS JOINED" and the host draws the dev's character.
//
// netdev.js only asks for a pass on https://*.andrenijman.com, so the pages
// are served as https://tree.andrenijman.com from this checkout (Playwright
// routes), /_guard/dev answers with a pass signed by the test key, and the
// relay socket is proxied to the local wrangler dev (Chromium will not open
// ws://127.0.0.1 from an https page).
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { extname, join, normalize } from 'node:path';
import WebSocket from 'ws';
import { keyPair, pass, root, sleep, startRelay } from './support.mjs';

const SITE = 'https://tree.andrenijman.com';
const RELAY = 'wss://relay.devjoin.test';
const PORT = 8853;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png',
  '.webp': 'image/webp', '.json': 'application/json', '.svg': 'image/svg+xml', '.ogg': 'audio/ogg', '.mp3': 'audio/mpeg' };
const BANNER = 'DEV ANDRE HAS JOINED';

const keys = await keyPair();
const relay = await startRelay({ port: PORT, inspector: 9353, publicKey: keys.publicKey });
const browser = await chromium.launch({ headless: true });
const errors = [];
const fillers = [];

async function page(name, devPass = null) {
  const context = await browser.newContext({ viewport: { width: 1100, height: 700 } });
  await context.route(SITE + '/**', async route => {
    const url = new URL(route.request().url());
    if (url.pathname === '/_guard/dev') {
      return route.fulfill({ json: devPass ? { dev: true, name: 'ANDRE', pass: devPass, exp: Math.floor(Date.now() / 1000) + 900 } : { dev: false } });
    }
    if (url.pathname === '/_guard/status') return route.fulfill({ json: { signedIn: false } });
    if (url.pathname.startsWith('/_guard/')) return route.fulfill({ status: 404, body: '' });
    const file = normalize(join(root, decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname)));
    if (!file.startsWith(root)) return route.fulfill({ status: 403, body: '' });
    try {
      return route.fulfill({ body: await readFile(file), contentType: TYPES[extname(file)] || 'application/octet-stream' });
    } catch { return route.fulfill({ status: 404, body: '' }); }
  });
  // The relay's HTTP side (/lobbies, /ping) and its socket, to wrangler dev.
  await context.route(RELAY.replace(/^wss/, 'https') + '/**', async route => {
    const url = new URL(route.request().url());
    const response = await route.fetch({ url: relay.base + url.pathname + url.search });
    return route.fulfill({ response });
  });
  await context.routeWebSocket(url => url.href.startsWith(RELAY), ws => {
    const url = new URL(ws.url());
    const upstream = new WebSocket(`ws://127.0.0.1:${PORT}${url.pathname}${url.search}`, { origin: SITE });
    const queue = [];
    upstream.on('open', () => { for (const message of queue.splice(0)) upstream.send(message); });
    upstream.on('message', data => ws.send(String(data)));
    upstream.on('close', (code, reason) => ws.close({ code: code === 1005 ? 1000 : code, reason: String(reason) }).catch(() => {}));
    upstream.on('error', () => {});
    ws.onMessage(message => (upstream.readyState === WebSocket.OPEN ? upstream.send(message) : queue.push(message)));
    ws.onClose(() => upstream.close(1000));
  });
  const p = await context.newPage();
  p.on('pageerror', error => errors.push(`${name}: ${error.stack || error.message}`));
  return p;
}

const banner = p => p.waitForFunction(text => {
  const el = document.getElementById('dev-joined-banner');
  return el && el.textContent === text && el.style.opacity === '1' && getComputedStyle(el).display !== 'none';
}, BANNER, { timeout: 60000 });

try {
  const query = `?relay=${encodeURIComponent(RELAY)}`;
  const host = await page('host');
  await host.goto(SITE + '/' + query);
  await host.evaluate(async () => {
    activeWorldId = 'devjoin-world'; activeWorldName = 'Dev Oak';
    buildGame(5151, 'corrupt');
    await saveGame(true);
    game = null;
    await renderWorldList();
    document.querySelector('#mp-name').value = 'Ana';
    document.querySelector('#mp-password').value = 'acorn';
  });
  await host.locator('.world-host').click();
  await host.waitForFunction(() => Net.started && Net.isHost() && game && game.started, null, { timeout: 60000 });
  const code = await host.evaluate(() => Net.code);

  const guest = await page('guest');
  await guest.goto(SITE + '/' + query);
  await guest.evaluate(c => {
    document.querySelector('#mp-name').value = 'Ben';
    document.querySelector('#mp-password').value = 'acorn';
    Net.joinCode(c);
  }, code);
  await guest.waitForFunction(() => Net.started && Net.isClient() && game && game.started, null, { timeout: 60000 });

  // Six more seats make the locked world full (8).
  for (let i = 0; i < 6; i++) {
    const socket = new WebSocket(`ws://127.0.0.1:${PORT}/?code=${code}`, { origin: SITE });
    await new Promise((resolve, reject) => {
      socket.on('open', () => socket.send(JSON.stringify({ t: 'join', v: 1, code, name: 'Seat' + i, password: 'acorn' })));
      socket.on('message', raw => { if (JSON.parse(String(raw)).t === 'welcome') resolve(); });
      socket.on('error', reject);
    });
    fillers.push(socket);
  }
  await host.waitForFunction(() => Object.keys(Net.playerNames).length === 8, null, { timeout: 15000 });

  // A non-dev following the same link gets the normal rules: refused, back
  // on the menu with the code filled in.
  const outsider = await page('outsider');
  await outsider.goto(`${SITE}/${query}&join=${code}`);
  await outsider.waitForFunction(c => document.querySelector('#mp-code').value === c &&
    /full/.test(document.querySelector('#mp-status').textContent) && !Net.started, code, { timeout: 60000 });
  assert.equal(await outsider.evaluate(() => new URLSearchParams(location.search).has('join')), false, 'join cleared');

  // The dev, from the admin page's link.
  const dev = await page('dev', await pass(keys.privateKey));
  const seen = [banner(host), banner(guest)];
  await dev.goto(`${SITE}/${query}&join=${encodeURIComponent(code)}`);
  seen.push(banner(dev));
  await Promise.all(seen);
  const shotDir = process.env.SHOT_DIR || tmpdir();
  await guest.screenshot({ path: join(shotDir, 'tree-devjoin-banner.png') });
  await dev.waitForFunction(() => Net.started && Net.isClient() && game && game.started, null, { timeout: 60000 });
  const devId = await dev.evaluate(() => Net.id);
  assert.equal(await dev.evaluate(() => Net.code), code);
  assert.equal(await dev.evaluate(() => new URLSearchParams(location.search).has('join')), false, 'join cleared');
  assert.deepEqual(await dev.evaluate(() => window.__gamesPlayer), { name: 'Guest', room: code });
  assert.deepEqual(await host.evaluate(() => window.__gamesPlayer), { name: 'Ana', room: code });

  // The world adjusts: a ninth player, run by the host like any guest.
  await dev.evaluate(() => { game.player.x += 48; });
  await host.waitForFunction(id => Object.keys(Net.playerNames).length === 9 && Net.remotePlayers[id] &&
    Net.remotePlayers[id].netState, devId, { timeout: 30000 });
  await guest.waitForFunction(id => Net.remotePlayers[id], devId, { timeout: 30000 });
  await dev.waitForFunction(() => Object.keys(Net.remotePlayers).length >= 2, null, { timeout: 30000 });
  const hostView = await host.evaluate(id => {
    const p = Net.remotePlayers[id];
    return { dx: Math.abs(p.x - game.player.x), roster: document.querySelector('#net-roster').textContent };
  }, devId);
  assert.ok(hostView.roster.includes('Guest') && hostView.roster.includes('Ana'), 'host roster lists the dev');
  const shot = join(shotDir, 'tree-devjoin-host.png');
  await host.screenshot({ path: shot });

  // Banner fades after four seconds.
  await sleep(4500);
  assert.equal(await host.evaluate(() => document.getElementById('dev-joined-banner').style.opacity), '0');

  assert.deepEqual(errors, []);
  console.log(`devjoin browser test passed (room ${code}, 9 seats, dev ${Math.round(hostView.dx)} px from the host; screenshot ${shot})`);
} catch (error) {
  console.error(error);
  console.error('--- wrangler output tail ---\n' + relay.output().slice(-3000));
  process.exitCode = 1;
} finally {
  for (const socket of fillers) { try { socket.close(); } catch { /* gone */ } }
  await browser.close();
  relay.stop();
}
