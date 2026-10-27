// Item-1 harness: one remote player (or host enemy) moving, sent at 10 Hz
// like js/net.js, over a link with 200 ms RTT (100 ms each way) ±40 ms
// jitter, in order like a WebSocket, drawn at 60 Hz. Compares the old paths
// (players: 35 % lerp per step; enemies: jump to each frame) with
// js/netinterp.js, with and without sender timestamps. Deterministic (seeded).
// Run: node tests/latency/harness.mjs
import { Timeline, Track, followStep } from '../../js/netinterp.js';

const ONE_WAY = 100;
const JITTER = 40;
const SECONDS = 120;
const SEND_MS = 100;
const FRAME_MS = 1000 / 60;

function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Ground truth at 1 ms: runs that turn every 0.4-2 s, jumps, a teleport every 20 s.
function truth(random) {
  const xs = new Float64Array(SECONDS * 1000 + 1);
  const ys = new Float64Array(SECONDS * 1000 + 1);
  const teleports = [];
  let x = 0, y = 0, vx = 200, vy = 0, turn = 1000, jump = 1500;
  for (let ms = 0; ms <= SECONDS * 1000; ms++) {
    if (ms >= turn) { vx = (random() < 0.5 ? -1 : 1) * (100 + random() * 300); turn = ms + 400 + random() * 1600; }
    if (ms >= jump && y >= 0) { vy = -500; jump = ms + 1000 + random() * 2000; }
    if (ms > 0 && ms % 20000 === 0) { x += 3000; teleports.push(ms); }
    vy += 1500 / 1000;
    x += vx / 1000; y = Math.min(0, y + vy / 1000);
    if (y >= 0) vy = 0;
    xs[ms] = x; ys[ms] = y;
  }
  return { xs, ys, teleports };
}

function run(mode, seed, lead = 0) {
  const random = rng(seed);
  const world = truth(random);
  const senderClock = 987654; // the sender's performance.now() at our 0
  // Sends every 6th 60 Hz step, as Net.update's sendT does.
  const packets = [];
  let arrive = 0;
  for (let step = 6; step * FRAME_MS <= SECONDS * 1000; step += 6) {
    const sent = Math.round(step * FRAME_MS);
    arrive = Math.max(arrive, sent + ONE_WAY + (random() * 2 - 1) * JITTER);
    packets.push({ arrive, ts: sent + senderClock, x: world.xs[sent], y: world.ys[sent] });
  }
  const timeline = new Timeline({ lead });
  const track = new Track();
  let next = 0, target = null, shown = null;
  const frames = [];
  for (let now = 0.37; now <= SECONDS * 1000; now += FRAME_MS) {
    while (next < packets.length && packets[next].arrive <= now) {
      const p = packets[next++];
      target = { x: p.x, y: p.y };
      if (mode === 'stamped' || mode === 'arrival') track.push(timeline.arrive(now, mode === 'stamped' ? p.ts : undefined), p.x, p.y);
    }
    if (!target) continue;
    if (mode === 'lerp') shown = shown ? { x: followStep(shown.x, target.x), y: followStep(shown.y, target.y) } : { ...target };
    else if (mode === 'snap') shown = { ...target };
    else shown = track.at(timeline.renderTime(now));
    frames.push({ now, x: shown.x, y: shown.y });
  }
  return score(world, frames);
}

function score(world, frames) {
  const near = (ms) => world.teleports.some((t) => ms > t - 1000 && ms < t + 1500);
  const at = (ms) => {
    const i = Math.max(0, Math.min(world.xs.length - 1, Math.round(ms)));
    return { x: world.xs[i], y: world.ys[i] };
  };
  const used = frames.filter((f) => f.now > 3000 && !near(f.now));
  const errorAt = (lag) => {
    let sum = 0;
    for (const f of used) { const g = at(f.now - lag); sum += Math.hypot(f.x - g.x, f.y - g.y); }
    return sum / used.length;
  };
  let lag = 0, best = Infinity;
  for (let l = 0; l <= 500; l += 5) { const e = errorAt(l); if (e < best) { best = e; lag = l; } }
  let stutter = 0, count = 0;
  for (let i = 1; i < frames.length; i++) {
    const f = frames[i], p = frames[i - 1];
    if (f.now <= 3000 || near(f.now)) continue;
    const g = at(f.now - lag), gp = at(p.now - lag);
    const shown = Math.hypot(f.x - p.x, f.y - p.y);
    const real = Math.hypot(g.x - gp.x, g.y - gp.y);
    count++;
    if (Math.abs(shown - real) > Math.max(0.5 * real, 1)) stutter++;
  }
  return { errNow: errorAt(0), lag, shape: best, stutter: (100 * stutter) / count };
}

const fmt = (r) => `error now ${r.errNow.toFixed(1)} px | drawn ${r.lag} ms behind | error at that lag ${r.shape.toFixed(1)} px | stutter ${r.stutter.toFixed(1)} % of frames`;
const average = (mode, lead) => {
  const runs = [1, 2, 3, 4, 5].map((seed) => run(mode, seed, lead));
  const mean = (key) => runs.reduce((s, r) => s + r[key], 0) / runs.length;
  return { errNow: mean('errNow'), lag: Math.round(mean('lag')), shape: mean('shape'), stutter: mean('stutter') };
};

// The leads js/net.js uses: players 0.75, enemies 1 (see NET_LEAD there).
export const PLAYER_LEAD = 0.75;
export const ENEMY_LEAD = 1;
console.log(`tree item 1: 10 Hz states, ${2 * ONE_WAY} ms RTT ±${JITTER} ms jitter, 60 Hz drawing, 5 seeds x ${SECONDS} s`);
console.log('BEFORE');
console.log('  remote players (lerp 0.35/step):       ' + fmt(average('lerp')));
console.log('  host enemies (jump to each frame):     ' + fmt(average('snap')));
console.log('AFTER (js/netinterp.js, stamped ts)');
console.log(`  remote players (lead ${PLAYER_LEAD}):            ` + fmt(average('stamped', PLAYER_LEAD)));
console.log(`  host enemies (lead ${ENEMY_LEAD}):                  ` + fmt(average('stamped', ENEMY_LEAD)));
console.log('  for reference, pure interpolation:     ' + fmt(average('stamped', 0)));
console.log('AFTER, unstamped (states from an old client, arrival time only)');
console.log(`  remote players (lead ${PLAYER_LEAD}):            ` + fmt(average('arrival', PLAYER_LEAD)));
console.log(`  host enemies (lead ${ENEMY_LEAD}):                  ` + fmt(average('arrival', ENEMY_LEAD)));
