# Latency notes: tree

Step 0 of the latency spec, written before any sim or render edit. Line
numbers are at origin/main 136ca78.

## Authority model: (c) host-authoritative

One player's browser (the host) runs the world; the relay only forwards.

- The host runs every world system; clients skip them behind
  `!Net.isClient()`: entity AI (js/main.js:2057), spawning (2093), events
  (2102), weather/time (2087), town, housing, spread (2111-2142).
- The host sends the world as `frame` messages: entities, projectiles,
  pickups, chests, other players, boss bars (js/net.js:298-305, `frameState`
  js/net.js:307). Clients apply them in `applyFrame` (js/net.js:340).
- Each player simulates its own character locally (`game.player.update`,
  js/main.js:2054, not gated) and reports it as `player` (js/net.js:288-292).
  The host accepts client actions with loose checks: `acceptMutation`
  (12 tiles), `acceptHit` (900 px), `acceptPickup`, `acceptChest`.
- Relay: `Room` Durable Object per five-letter code (worker/relay.js:189),
  `Registry` DO for the lobby list. Host messages broadcast or go `to` one
  player; client messages go to the host only (worker/relay.js:415-422).

## What already hides delay

- Remote players: each `player` state sets `targetX/targetY`
  (js/net.js:266) and every 60 Hz step pulls the drawn position 35 % of the
  way there (`lerp(p.x, p.targetX, 0.35)`, js/net.js:296). This is a
  frame-rate smoother, not interpolation: no timing, no jitter handling, it
  shows each 10 Hz step as a short burst.
- Entities (enemies, bosses, critters, worm segments): none. `applyEntities`
  (js/net.js:361) copies every field of each 10 Hz frame, so clients see
  enemies jump every 100 ms; clients never step entities themselves.
- Projectiles: clients run `updateProjectiles` (js/main.js:2077) on the
  host's projectiles between frames (local dead reckoning) and each frame
  resets them (`applyProjectiles`, js/net.js:378). Already smooth enough;
  left alone.
- Local player: fully local. Movement, mining (`World.set` applies the tile
  and then calls `Net.worldMutation`, js/main.js:25/31/53), pickups and hit
  flashes (`Net.claimHit` then `e.flash`, js/entities.js:423,
  js/main.js:1469, js/bosses.js:1419) show at once without a round trip.
- Reconnect: a dropped client reconnects with `rejoin` (js/net.js:76,
  `scheduleReconnect` js/net.js:100) and is sent a fresh snapshot
  (worker/relay.js:378).

## Rates and messages

- `player`: every client and the host, 10/s (`sendT = 0.1`, js/net.js:289),
  with inventory once a second.
- `frame`: host only, 10/s (`frameT = 0.1`, js/net.js:299), plus `tiles`
  (up to 500 ops) in the same tick when tiles changed.
- `ping`: 1/s per player once the world has started (js/net.js:282-286),
  answered with `pong`.
- Event messages (`mutation`, `hit`, `pickup`, `chest`, `boss`, `damage`) as
  they happen; snapshots (48 KB chunks) on join and host change.
- Relay rate limit: 600 messages / 10 s per socket (worker/relay.js:7-8).

## Room lifecycle and "match start"

- Create: the Worker allocates a code from the Registry
  (worker/relay.js:670-675) and the DO handles the `create` handshake
  (worker/relay.js:303-317). Host id 1.
- Start: as soon as the host gets `welcome` (js/net.js:128) it loads its
  world and sends `start` with no waiting room (`beginHosting`,
  js/net.js:162-174; the main menu is hidden directly). The relay's start
  branch (worker/relay.js:393-401) runs with only the host connected; it
  sets phase `running` and starts the lag log.
- Join: guests join the running world at any time (drop-in co-op): handshake
  `join` (worker/relay.js:318-344), then `snapshot-needed` and a snapshot
  from the host (worker/relay.js:378-381).
- Host leaves: the oldest remaining player becomes host
  (`repairHost`, worker/relay.js:535; broadcast at 562-564) and sends a new
  snapshot from its copy of the world.
- End: the last player leaving clears the room and the Registry entry and
  sends the lag record (worker/relay.js:548-560).

## Item 1 plan

Authority (c), remote entities: render remote players and entities from a
snapshot buffer at an adaptive delay (about the 95th-percentile inter-arrival
gap, clamped), interpolating between buffered states and extrapolating with
the sender's velocity for at most 100 ms on gaps; snap on teleports (a jump
larger than any plausible speed). Worm segments are interpolated with their
head so they stay attached. A small module with no game globals
(`js/netinterp.js`), loaded like `netping.js`, so the harness drives it in
Node. Keep the old lerp as the fallback (file:// cannot load modules) and as
the harness's "before" path. Measure before vs after at 200 ms RTT, ±40 ms
jitter.

Local player: already immediate (above). No prediction or reconciliation
needed; the client owns its own character.

Wire protocol: unchanged unless the harness shows sender timestamps help;
any addition is an optional field old clients ignore.

## Item 4: N/A (fairer placement at match start)

Tree has no match start with a group. The host's client sends `start` the
moment it is welcomed (js/net.js:128, 162-170), so when the relay's start
branch runs (worker/relay.js:393) the host is the only player.
`chooseRegion(others, { via: host })` then gets an empty `others` and
returns null (netplace.js: `players.length < (via ? 1 : 2)`). Every guest
arrives later into a running world. Pings also only start after the world
starts (js/net.js:280-286).

Even with a group present, a host-relayed room is already about as fair as
it gets: each guest's lag is guest→room→host, and the room is created at the
host's nearest colo, so guest→room→host ≈ guest→host, which no other region
beats (the triangle inequality, give or take routing). The case where a move
would help is a host change (the original host leaves and the room keeps
running near them); that is mid-session, not at match start, so it is left
as a possible follow-up rather than forced in.

The host's state would survive a move (it lives in the host's browser, and
the snapshot path already rebuilds clients), so this is about the trigger,
not about state.

The lag record still carries `region` (`regionOfColo(colo)`) and
`moved: null`.
