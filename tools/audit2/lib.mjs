import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';

const DIR = path.join(process.cwd(), 'test-results', 'audit2');

// Common: launch browser, create world through the real menu with a fixed
// seed, and inject the helper functions every probe script needs.
export async function setupAudit() {
  const results = { startedAt: new Date().toISOString(), checks: [], notes: [], errors: [] };
  const browser = await chromium.launch({ args: ['--no-sandbox', '--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  page.on('pageerror', e => { results.errors.push(String(e.message || e)); });
  page.on('console', m => {
    if (m.type() === 'error' && !m.text().includes('_guard/') && !m.text().includes('Failed to load resource')) results.errors.push(m.text());
  });
  await page.goto('file:///' + process.cwd().replace(/\\/g, '/') + '/index.html');
  await page.waitForTimeout(800);
  const seed = Number(process.env.SEED || 7357);
  await page.evaluate(seed => {
    var original = buildGame;
    buildGame = function(_, evil, difficulty) {
      buildGame = original;
      return original(seed, evil, difficulty);
    };
  }, seed);
  await page.click('#btn-new');
  await page.waitForSelector('#world-create:not(.hidden)');
  await page.click('#btn-create');
  await page.waitForFunction(() => game && game.started && game.player);
  await page.waitForFunction(() => !document.getElementById('loading').classList.contains('overlay-visible'), { timeout: 30000 });
  await page.evaluate(() => { AudioSys.enabled = false; });
  await page.evaluate(() => {
    window.__FW = function(n) {
      var finite = true, who = '';
      for (var i = 0; i < n; i++) {
        step(1 / 60);
        if (!Number.isFinite(game.player.x) || !Number.isFinite(game.player.y)) { finite = false; who += '[PLAYER]'; }
        if (!Number.isFinite(game.cam.x) || !Number.isFinite(game.cam.y)) { finite = false; who += '[CAM]'; }
      }
      return { finite: finite, who: who };
    };
    window.__clearHostiles = function() {
      game.entities = game.entities.filter(function(e) { return e === game.player || e.friendly || e.dead; });
    };
    window.__mod = function(id, c) { return game.player.inventory.addStack({ id: id, count: c }); };
    window.__inv = function(id) {
      var n = 0, s = game.player.inventory.slots;
      for (var i = 0; i < s.length; i++) if (s[i] && s[i].id === id) n += s[i].count;
      return n;
    };
    window.__pick = function(id) {
      var got = 0;
      game.pickups.forEach(function(pk) { if (pk.item === id) got += pk.count; });
      return got;
    };
    window.__resetPlayer = function() {
      var p = game.player;
      p.hp = p.maxHp = 1000; p.dying = false; p.respawnT = 0; p.invuln = 999999;
      p.vx = 0; p.vy = 0;
      document.getElementById('deathscreen').classList.add('hidden');
    };
    window.__selectItem = function(id) {
      var p = game.player;
      var idx = p.inventory.slots.findIndex(function(s) { return s && s.id === id; });
      if (idx < 0) return false;
      p.inventory.selected = idx;
      return true;
    };
  });
  return { browser, page, results };
}

export function check(res, label, ok, detail) {
  res.checks.push({ label, ok: !!ok, detail: detail ?? null });
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${label}${detail ? ' ' + JSON.stringify(detail) : ''}`);
}

export function note(res, text) {
  res.notes.push(text);
  console.log(`[note] ${text}`);
}

export async function assertNoBrowserErrors(res) {
  const counts = {};
  res.errors.forEach(e => { counts[e.slice(0, 140)] = (counts[e.slice(0, 140)] || 0) + 1; });
  check(res, 'No uncaught browser errors', Object.keys(counts).length === 0, counts);
}

export async function finish(res, browser, name, data) {
  try { await browser.close(); } catch {}
  mkdirSync(DIR, { recursive: true });
  const file = path.join(DIR, name + '.json');
  writeFileSync(file, JSON.stringify(data ? Object.assign({}, res, { data }) : res, null, 2));
  const pass = res.checks.filter(c => c.ok).length;
  console.log(`${pass}/${res.checks.length} PASS, ${res.errors.length} browser errors → ${file}`);
  if (res.checks.some(c => !c.ok) || res.errors.length) process.exitCode = 1;
}
