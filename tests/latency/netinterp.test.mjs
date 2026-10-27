// Unit tests for js/netinterp.js. Run: node tests/latency/netinterp.test.mjs
import assert from 'node:assert/strict';
import { Timeline, Track, followStep } from '../../js/netinterp.js';

const close = (actual, expected, within, what) =>
  assert.ok(Math.abs(actual - expected) <= within, `${what}: ${actual} not within ${within} of ${expected}`);

// Stamped states land on our clock at send time + the fastest delivery seen.
{
  const line = new Timeline();
  const sender = 50_000;
  const late = [30, 0, 10, 25, 5, 40, 15, 0, 35, 20];
  let t;
  for (let i = 0; i < 40; i++) t = line.arrive(1000 + i * 100 + 60 + late[i % 10], sender + i * 100);
  close(t, 1000 + 39 * 100 + 60, 0.001, 'stamped time');
  assert.equal(line.arrive(9000, sender + 39 * 100), null, 'a repeat of the last state is skipped');
  // spacing 100 + p95 lateness 40, eased toward
  close(line.delay, 140, 5, 'pure interpolation delay');
}

// lead trades waiting for extrapolation; the delay is clamped.
{
  const lean = new Timeline({ lead: 1 });
  const slow = new Timeline({ maxDelay: 200 });
  for (let i = 0; i < 80; i++) {
    lean.arrive(i * 100 + (i % 2) * 30, 7 + i * 100);
    slow.arrive(i * 400, undefined);
  }
  close(lean.delay, 30, 1, 'lead 1 waits out only the jitter');
  close(slow.delay, 200, 1, 'clamped to maxDelay');
  assert.equal(slow.renderTime(1000), 1000 - slow.delay);
}

// Track: interpolates, extrapolates at most 100 ms, holds, snaps on teleports.
{
  const track = new Track();
  assert.equal(track.at(0), null);
  track.push(0, 0, 0);
  assert.deepEqual([track.at(-50).x, track.at(50).x], [0, 0], 'one state: hold it');
  track.push(100, 10, -20);
  track.push(200, 20, -40);
  const mid = track.at(150);
  assert.deepEqual([mid.x, mid.y], [15, -30]);
  close(track.at(250).x, 25, 1e-9, 'extrapolates on a gap');
  close(track.at(900).x, 30, 1e-9, 'stops after 100 ms');
  track.push(150, 99, 99);
  close(track.at(150).x, 15, 1e-9, 'out-of-order states are dropped');
  track.push(300, 5000, 0);
  assert.equal(track.at(250).x, 5000, 'a teleport snaps');
  assert.equal(track.samples.length, 1);
}

// Worm segments move with their head.
{
  const track = new Track();
  track.push(0, 0, 0, [{ x: 0, y: 0 }, { x: -10, y: 0 }]);
  track.push(100, 10, 0, [{ x: 10, y: 0 }, { x: 0, y: 0 }]);
  assert.deepEqual(track.at(50).segs, [{ x: 5, y: 0 }, { x: -5, y: 0 }]);
  track.push(200, 20, 0, [{ x: 20, y: 0 }]);
  assert.deepEqual(track.at(150).segs, [{ x: 20, y: 0 }], 'a changed body takes the newer one');
}

assert.equal(followStep(0, 100), 35);
console.log('netinterp unit tests passed');
