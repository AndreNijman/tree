// Snapshot interpolation for hosted multiplayer: remote players and, on
// clients, the host's enemies are drawn a little in the past, between two
// received states, instead of jumping to each 10 Hz update.
//
// A Timeline is one sender's clock (the host's frames, or one player's own
// states). States carry the sender's send time `ts` when the sender is new
// enough to stamp them; the offset to our clock is the smallest seen lately
// (the fastest delivery), so jitter does not bend the spacing. Without `ts`
// a state is placed at its arrival time. The render delay follows about the
// 95th percentile of how long the next state takes to arrive, clamped, so a
// jittery link waits a little longer and a clean one shows sooner. `lead`
// draws that fraction of the usual 100 ms spacing ahead by extrapolating
// instead of waiting for it: 0 is pure interpolation (smoothest, latest);
// 1 waits only out the jitter. tests/latency/harness.mjs measures the range.
//
// A Track is one thing's buffered positions on a timeline. Between states it
// interpolates; past the newest it extrapolates for at most 100 ms, then
// holds; a jump too long for any movement (a mirror, a pylon) snaps.
// Plain module, no game globals, so tests drive it in Node.

const WINDOW = 40;
const MAX_EXTRAPOLATE_MS = 100;

function quantile(values, q) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))];
}

export class Timeline {
  constructor({ lead = 0, minDelay = 30, maxDelay = 350 } = {}) {
    this.lead = lead;
    this.minDelay = minDelay;
    this.maxDelay = maxDelay;
    this.delay = 120;
    this.offsets = [];      // arrival - ts, recent
    this.gaps = [];         // spacing between states, recent
    this.late = [];         // how far behind its stamped time each state arrived
    this.lastArrival = null;
    this.lastTs = null;
  }

  /** A state arrived at `now` (our clock, ms), stamped `ts` by its sender if known. Returns its time on our clock, or null for a repeat of the last state. */
  arrive(now, ts) {
    const stamped = Number.isFinite(ts);
    if (stamped && this.lastTs !== null && ts <= this.lastTs) return null;
    if (this.lastArrival !== null) {
      this.gaps.push(stamped && this.lastTs !== null ? ts - this.lastTs : now - this.lastArrival);
      if (this.gaps.length > WINDOW) this.gaps.shift();
    }
    this.lastArrival = now;
    let t = now;
    if (stamped) {
      this.lastTs = ts;
      this.offsets.push(now - ts);
      if (this.offsets.length > WINDOW) this.offsets.shift();
      const offset = Math.min(...this.offsets);
      t = ts + offset;
      this.late.push(now - t);
      if (this.late.length > WINDOW) this.late.shift();
    }
    if (this.gaps.length >= 3) {
      // Stamped: the usual spacing plus how late states run. Unstamped:
      // arrival gaps already include the lateness.
      const spacing = quantile(this.gaps, 0.5);
      const target = (stamped ? spacing + quantile(this.late, 0.95) : quantile(this.gaps, 0.95)) - this.lead * spacing;
      const clamped = Math.max(this.minDelay, Math.min(this.maxDelay, target));
      // Ease toward it so the drawn world never visibly speeds up or stalls.
      this.delay += (clamped - this.delay) * 0.1;
    }
    return t;
  }

  /** The moment to draw, on our clock. */
  renderTime(now) {
    return now - this.delay;
  }
}

export class Track {
  constructor({ snap = 480 } = {}) {
    this.snap = snap;
    this.samples = [];
  }

  /** Buffer a state at time `t` (from Timeline.arrive). `segs` is an optional [{x, y}] (worm bodies) moved along with it. */
  push(t, x, y, segs) {
    if (t === null || !Number.isFinite(x) || !Number.isFinite(y)) return;
    const last = this.samples[this.samples.length - 1];
    if (last && t <= last.t) return;
    if (last && Math.hypot(x - last.x, y - last.y) > this.snap) this.samples = [];
    this.samples.push({ t, x, y, segs: segs ? segs.map((s) => ({ x: +s.x, y: +s.y })) : null });
    if (this.samples.length > 12) this.samples.shift();
  }

  /** Where to draw at time `T`: { x, y, segs }, or null before any state. */
  at(T) {
    const list = this.samples;
    if (!list.length) return null;
    if (T <= list[0].t) return list[0];
    for (let i = list.length - 1; i > 0; i--) {
      const a = list[i - 1];
      const b = list[i];
      if (T >= a.t && T <= b.t) return lerpSample(a, b, (T - a.t) / (b.t - a.t));
    }
    // Past the newest state: keep its motion going briefly, then hold.
    const b = list[list.length - 1];
    if (list.length < 2) return b;
    const a = list[list.length - 2];
    const ahead = Math.min(T - b.t, MAX_EXTRAPOLATE_MS);
    return lerpSample(a, b, 1 + ahead / (b.t - a.t));
  }
}

function lerpSample(a, b, k) {
  const segs = b.segs && a.segs && a.segs.length === b.segs.length
    ? b.segs.map((s, i) => ({ x: a.segs[i].x + (s.x - a.segs[i].x) * k, y: a.segs[i].y + (s.y - a.segs[i].y) * k }))
    : b.segs;
  return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, segs };
}

/** The old smoothing, kept for comparison: each 60 Hz step moves 35 % of the way to the newest state. */
export function followStep(current, target, k = 0.35) {
  return current + (target - current) * k;
}
