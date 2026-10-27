// Ping display and interpolation in the real client: a host and a guest in
// headless Chromium against a relay and a static server you start yourself:
//   wrangler dev --port 8850 ...   and   python3 -m http.server 8851
// Run: TREE_URL='http://127.0.0.1:8851/?relay=ws://127.0.0.1:8850' node tests/latency/browser.test.mjs
import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const url = process.env.TREE_URL || 'http://127.0.0.1:8851/?relay=ws://127.0.0.1:8850';
const browser = await chromium.launch({ headless: true });
const errors = [];
const page = async (name) => {
  const p = await (await browser.newContext()).newPage();
  p.on('pageerror', error => errors.push(`${name}: ${error.stack || error.message}`));
  return p;
};

try {
  const host = await page('host');
  await host.goto(url);
  await host.evaluate(async () => {
    activeWorldId = 'latency-world'; activeWorldName = 'Lag Oak';
    buildGame(4242, 'corrupt');
    await saveGame(true);
    game = null;
    await renderWorldList();
  });
  await host.locator('.world-host').click();
  await host.waitForFunction(() => Net.started && Net.isHost() && game && game.started, null, { timeout: 60000 });
  const code = await host.evaluate(() => Net.code);

  const guest = await page('guest');
  await guest.goto(url);
  // The hosted worlds list labels the room with its region and ms.
  await guest.locator('#mp-refresh').click();
  const label = await guest.waitForFunction(c => {
    const cell = document.querySelector(`[data-ping="${c}"]`);
    return cell && cell.textContent;
  }, code, { timeout: 30000 }).then(handle => handle.jsonValue());
  assert.match(label, /^[A-Za-z ]+ · \d+ ms$/, 'lobby row label');

  await guest.evaluate(c => Net.joinCode(c), code);
  await guest.waitForFunction(() => Net.started && Net.isClient() && game && game.started, null, { timeout: 60000 });

  for (const [name, p] of [['host', host], ['guest', guest]]) {
    // HUD ping: hidden until the first pong, then "NN ms".
    const hud = await p.waitForFunction(() => {
      const el = document.getElementById('ping');
      return el && !el.classList.contains('hidden') && el.textContent;
    }, null, { timeout: 30000 }).then(handle => handle.jsonValue());
    assert.match(hud, /^\d+ ms$/, `${name} HUD ping`);
    const roster = await p.waitForFunction(() => {
      const em = document.querySelector('#net-roster em');
      return em && em.textContent;
    }, null, { timeout: 30000 }).then(handle => handle.jsonValue());
    assert.ok(roster.length > 2, `${name} roster names the region`);
    // Remote players are drawn from the interpolation buffer.
    await p.waitForFunction(() => {
      const remote = Object.values(Net.remotePlayers)[0];
      return remote && remote.netTrack && remote.netTrack.samples.length > 2 && Net.timelines['p' + remote.netId];
    }, null, { timeout: 30000 });
  }

  // The guest draws the host's enemies between frames.
  await host.evaluate(() => {
    const e = spawnEntity(game, E.SLIME, game.player.x + 60, game.player.y - 40);
    e.hp = 500; e.maxHp = 500;
  });
  const drawn = await guest.waitForFunction(() => {
    const e = game.entities.find(candidate => candidate.type === E.SLIME && candidate.netTrack && candidate.netTrack.samples.length > 3);
    if (!e) return null;
    const shown = e.netTrack.at(Net.timelines.frame.renderTime(performance.now()));
    return { x: e.x, shownX: shown.x, delay: Net.timelines.frame.delay };
  }, null, { timeout: 30000 }).then(handle => handle.jsonValue());
  assert.ok(Math.abs(drawn.x - drawn.shownX) < 40, 'the enemy sits where its track says');
  assert.ok(drawn.delay >= 30 && drawn.delay <= 350, 'frame delay within its clamp');

  assert.deepEqual(errors, []);
  console.log(`latency browser test passed (lobby "${label}", frame delay ${Math.round(drawn.delay)} ms)`);
} finally {
  await browser.close();
}
