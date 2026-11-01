# Resuming a playtest with any AI model

Use the persistent controller in `tools/playtest-session.mjs`, not a new ad-hoc browser for each agent. It is independent of model conversation history and uses only the existing local Playwright installation. This does **not** modify the game or OpenCode configuration.

## What survives an interruption

- **Model pause, context loss, or usage limit:** the controller/browser can stay alive. Each action ends with the browser JavaScript thread suspended, releasing held keys/buttons and exporting a handoff. Another model claims the **same** controller, preserving the live player, terrain, inventory/cursor, enemies, and fight.
- **Abandoned owner:** the owner lease expires after 90 seconds by default. The controller freezes the browser and relinquishes ownership. No model tokens are needed for this watchdog. Actions are bounded; interrupted requests are not blindly replayed.
- **Browser/controller crash or machine restart:** recovery uses the latest exported **actual game save** (IndexedDB plus localStorage). It cannot preserve unsaved live changes, ordinary enemies, a precise boss fight, or RNG state. `HANDOFF.json` compares live and persisted state and flags potential lost progress. No invented fresh-world fallback or exact-resume claim.
- **AI usage allowance:** this system cannot refill credits or automatically select/bill a replacement model. It preserves the handoff; you or the parent agent select the next available model.

This is Chromium-only test infrastructure. Debugger suspension is an infrastructure pause, not manual game stepping or an injected gameplay-state change. Lifecycle freezing alone is **not** used: browser verification showed it did not reliably stop animation frames. Do not use this controller for production saves or multiplayer tests; offline isolated worlds only.

## Start once

Run from the repository, with an immutable source directory. In OpenCode, **use `background: true` on the shell tool**. A foreground timeout kills a persistent harness.

```powershell
node tools/playtest-session.mjs start --lane boss --source "C:\Users\ethan\AppData\Local\Temp\opencode\tree-gameplay-progress-oeGdm5" --storage "test-results/gameplay-luna2-boss/disposable-storage.json" --goal "Earn Lens and attempt the first boss"
```

`--storage` imports an existing **disposable loopback-origin** export, without changing its gameplay data. For multiple worlds, explicitly select `--world-id ID`. Original exports are never overwritten. Omit `--storage` for a new lane; create its one world with the `new` action. A lane cannot silently replace its world or switch source builds.

Wait for `ready: true`, then hand the lane name to the agent. Each agent controls at most one browser; separate lanes may run in parallel. Avoid excessive concurrency if the machine becomes resource-bound.

## Take over from Luna, or any other model

First read:

```
test-results/playtest-sessions/boss/HANDOFF.md
test-results/playtest-sessions/boss/HANDOFF.json
test-results/playtest-sessions/boss/events.jsonl
```

**`latest.json` is authoritative.** Root HANDOFF files are convenience copies and can lag if the controller crashes during an update. Use `node tools/playtest-session.mjs handoff --lane boss` to load the committed checkpoint with checksum verification, including when the controller is offline.

Then:

```powershell
node tools/playtest-session.mjs status --lane boss
node tools/playtest-session.mjs claim --lane boss --owner other-model-session-123
node tools/playtest-session.mjs note --lane boss --owner other-model-session-123 --json '{"nextSteps":["Escape the ravine using earned Dirt","Fight a surface Demon Eye"],"knownIssues":["Original source: jiggle real pointer after camera movement"]}'
node tools/playtest-session.mjs action --lane boss --owner other-model-session-123 --request-id approach-001 --json '{"type":"input","keys":["d","Space"],"ms":500}'
```

The owner identifier is an audit label, not a provider credential. Generation tickets and a per-controller epoch prevent a stale agent from driving the lane after takeover or restart, even if the same owner label is reused. An active owner must pause/release the lane or let its lease expire before another claim. A claim/heartbeat does **not** resume gameplay by itself.

Use a unique request ID for each action; gameplay/UI actions **require** it. Retrying a **completed** ID returns the original receipt instead of repeating the action. If a prior request might have run but never committed, inspect the checkpoint/event log; it is rejected as uncertain, not replayed automatically.

### Supported actions

All interaction uses real Playwright keyboard/mouse/normal UI actionability. No arbitrary JavaScript or state-write endpoint exists.

| JSON action | Meaning |
| --- | --- |
| `{"type":"new","name":"Natural cave test"}` | One random Normal/Corruption world, real menu |
| `{"type":"input","slot":2,"aim":{"x":33640,"y":4480},"button":"left","ms":1800}` | Select zero-based hotbar slot, aim at world pixels, sustain use; pointer refreshed as camera moves |
| `{"type":"input","keys":["a"],"ms":500}` | Walk; each input bounded to 10 seconds |
| `{"type":"press","key":"e"}` | Discrete key, e.g. inventory, numbers, respawn via UI instead |
| `{"type":"click","selector":"#btn-respawn"}` | Physical UI click; no forced clicks |
| `{"type":"fill","selector":"#craft-search-input","value":"Workbench"}` | Type in a real field |
| `{"type":"craft","name":"Workbench","count":1}` | Exact implemented recipe, normal crafting UI |
| `{"type":"recipes","search":"Fishing"}` | Read-only recipe inspection |
| `{"type":"scout","kind":"trunk","radius":40}` | Read-only nearby tile scouting (max 80-tile radius) |
| `{"type":"tiles","x":2090,"y":280,"width":16,"height":12}` | Read-only tile/wall/HP cross-section |
| `{"type":"resize","width":1280,"height":800}` | Resize viewport |
| `{"type":"screenshot"}` | Capture a checkpoint screenshot |
| `{"type":"save-quit"}` | Explicit ordinary persistence control; **not** automatic on pause; disclose enemy-clearing on reload |
| `{"type":"open-world","id":"WORLD-ID"}` | Open the exact saved world through the menu |

Read-only scouts/recipes/tiles are instrumented assistance, not unaided organic observations. Natural play still forbids grants, teleports, scripted damage, time acceleration, forced clicks, or tactical reloads. Keep notes updated with achieved objectives, unresolved steps, failed attempts, and evidence paths. A death is not a reason to abandon the world: use the normal respawn UI.

## Pause without losing the live browser

```powershell
node tools/playtest-session.mjs pause --lane boss --reason "User paused work"
node tools/playtest-session.mjs pause-all
```

The parent should run `pause-all` **before stopping agents**. Do not kill their controller/browser trees. Pause releases ownership and writes the handoff. Usage-limit events do not require an OpenCode-specific plugin: after every command the browser is already frozen; the watchdog handles an abandoned lease. During an in-flight UI operation, safe pause may wait for its bounded operation timeout.

`pause-all` covers **managed lanes only**. Old bespoke harnesses are not automatically registered or protected; import their latest verified disposable export into a managed lane after the old browser closes. Never start a second browser over the same active lane.

To prepare an old **closed** lane for a different model without starting a browser:

```powershell
node tools/playtest-session.mjs register --lane boss --source "C:\Users\ethan\AppData\Local\Temp\opencode\tree-gameplay-progress-oeGdm5" --storage "test-results/gameplay-luna2-boss/disposable-storage.json" --goal "Continue the same earned world toward Lens and the first boss"
```

`register` copies the supplied export into a checksummed handoff, records its real persisted world/seed/time, and conservatively flags any unknown unsaved progress. It never overwrites an existing lane. Optional `--notes FILE.json` supplies goal/nextSteps/observations/knownIssues/evidence. Registration is not proof that all prior live progress was saved; the actual restore is verified when `start --restore` opens the world.

## Restart after a real crash

```powershell
node tools/playtest-session.mjs start --lane boss --restore
```

Again run this as a background command. It checks pinned source hashes, checkpoint checksums, exact world ID/seed, and restored inventory. Source mismatches, corrupt exports, missing saved worlds, and duplicate live controllers are errors—not permission to silently start a new run. A stale dead-process lock can be recovered; live-process locks are never killed automatically.

Use `list` to discover managed lanes and `status` for a controller. `stop` deliberately closes its browser after a final checkpoint, so later recovery is save-based, **not** exact live takeover.

## Files and privacy

Everything per lane lives in the git-ignored `test-results/playtest-sessions/<lane>/`:

- `config.json`: immutable game source fingerprint.
- `HANDOFF.md` / `HANDOFF.json`: readable/structured objective, next steps, live state, saved-state comparison and recovery caveats.
- `events.jsonl`: append-only action starts/results/errors; no reconstructed passes.
- `checkpoints/cp-.../`: versioned storage exports, handoff, optional screenshot; `latest.json` is atomically updated only after the generation is complete.
- `connection.json`: loopback controller address and local bearer secret; never publish it.
- `owners/`, `requests/`: ownership generations and idempotent command receipts.

Exports include test-world data. Use fresh isolated contexts only; never import production profiles, external origins, account cookies or credentials. No dependencies, OpenCode plugins, provider settings, or deployment are changed.

Screenshots never thaw the game. If browser-page capture times out while JavaScript is suspended, the controller tries a read-only PNG of the current game canvas backing store. `screenshotKind: game-canvas-only` explicitly excludes HTML HUD, inventory, menus and DOM overlays. **It can contain an incomplete frame if JavaScript paused mid-render**; a valid PNG does not prove a completed frame, missing terrain, or exact correspondence to the suspended simulation state. Do not diagnose visual bugs from one such capture. If neither capture works, the error is logged without invalidating the storage/handoff checkpoint.

## Validation

The latest completed infrastructure validation is **45/45**: 24 unit/store/lease checks, 12 real-browser pause/takeover/save-restore/canvas-capture cases, and 9 CLI/crash-recovery cases (including actual owned browser loss and hard process-tree termination). Results are in `test-results/playtest-session-{check,browser-check,crash-check}/results.json`. These are infrastructure checks, not the game's full regression or natural playthrough coverage.

Rerun in this order:

```powershell
node tools/playtest-session-check.mjs
node tools/playtest-session-browser-check.mjs "ABSOLUTE-FROZEN-SOURCE"
node tools/playtest-session-crash-check.mjs
```

The last command uses only the preceding browser check's disposable save and kills only its own verified child processes. It does not touch live playtest lanes. The optional `TREE_PLAYTEST_SESSIONS` environment variable relocates the registry for isolated infrastructure tests; ordinary agents should leave it unset so they discover the shared default lanes.
