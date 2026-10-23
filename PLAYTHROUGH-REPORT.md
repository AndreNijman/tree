# Progression Patch — Verification Report

**Date:** 2026-10-23  
**Scope:** local game fixes, test-harness repairs and pre-release verification. Publishing and production deployment are separate follow-up operations.

## Method and limits

This is **automated, accelerated integration testing**, not an unassisted human playthrough.
`tools/full-playthrough.mjs` creates a world through the menu with seed **7357**, grants materials
and 1000 HP, teleports the player, forces simulation frames, and defeats bosses with scripted
`game.hitBoss` damage after short simulated encounters. Pillar shields are also manipulated.
It exercises spawn/defeat hooks, rewards and progression state; it does **not** establish natural
fight difficulty, resource balance, accessibility of every summon, or survival pacing.

Focused regression fixtures live in `tools/patch-playtest.mjs`. The multiplayer browser test uses
two isolated browser contexts with a **local** Wrangler relay, not the production relay.

## Verification

| Check | Result |
|---|---|
| `node tools/playtest.mjs` | **149/149 PASS** |
| `node tools/hardmode-playtest.mjs` | **31/31 PASS** |
| `node tools/full-playthrough.mjs` | **PASS**, no recorded issues or browser errors; Moon Lord victory and save/load verified |
| `node tools/patch-playtest.mjs` | **15/15 PASS**, including visible Guardian render and exact backup/idempotence checks |
| `node tools/mp-browser-smoke.js` | **PASS**, including reconnect, host promotion, and all 13 fixture trunk/leaf tiles syncing |
| `npm run check` | **PASS**: relay helpers and `wrangler deploy --dry-run` only |
| JavaScript syntax checks | **PASS**, all 21 game/worker/test files checked |
| `node tools/playthrough.mjs` | UI smoke completed without browser errors; mining and tracked-enemy damage observed |

Machine-readable artifacts:
- `test-results/full-playthrough-issues.json` — seed, duration, accelerated methodology, findings and notes.
- `test-results/patch-playtest.json` — exact focused regression assertions.
- `tools/playthrough-screenshots/results.json` — UI stages, observations and skipped coverage.

## Original game failures — fixed

### 1. Hellstone generation and existing saves

**Root cause:** the ore runner could replace dirt/stone/clay but not the Underworld's Ash.

- `js/world.js`, `tileRunnerV`: **only Hellstone** may additionally replace Ash. Other ores retain their existing rules.
- `js/main.js`, `migrateWorldPatch` / `migrateHellstoneVeins`: PATCH 3 adds deterministic veins to
  old saves, changing **only Ash**. `postGenHp` initializes mining HP after restoration.
- `js/const.js`: persisted `PATCH = 3` makes the repair one-time after saving.
- `writeSaveBackup` writes `<world-id>-savebackup-hellstone`, hidden from the normal list with
  a `deletedAt` marker. The backup contains the original save data. **Backup writes are asynchronous
  and best-effort**; storage/quota failure handling is not verified here.

Focused seed-7357 fixture: fresh generation contained **1025 Underworld Hellstone tiles**.
An old-save fixture with Hellstone replaced by Ash received **1445** repaired tiles. Checks cover
determinism, Ash-only changes, nonzero mining HP, exact original tile data in the backup, persisted
PATCH 3, and identical tiles after another save/load.

### 2. Tree felling and wood payout

- `js/world.js`, `breakTile` / `fellTree`: bounded cascade over natural trunk and leaf types above
  the chop, including branch nubs. Mid-chops preserve the lower stump.
- Removal uses wrapped `breakTile` per tile, preserving normal multiplayer mutation emission.
- `js/main.js`, break wrapper: awards one wood per extra trunk once; overflow becomes pickups.
- `T.WOOD` is never removed by the cascade. Neighbour/living-tree crown footprints are snapshotted
  before removal; shared or ambiguous leaves are conservatively retained rather than stripped.

Fixtures verify isolated canopy removal, **9 wood for 8 trunk tiles + 1 nub**, built-wood safety,
stump safety, every adjacent-tree crown/trunk tile preserved at adversarial two-column spacing,
living-tree safety, and **7 overflow wood** spilled from a full inventory. The local multiplayer
test first verifies the intact fixture on the guest, then verifies all **13 trunk/leaf tiles** clear
after the host breaks the base; adjacent built wood remains.

**Tradeoff:** shared leaves can remain suspended after a chop. This prioritizes neighbour safety;
there is no persistent per-leaf ownership or general leaf-decay system.

### 3. Pre-Skeletron Dungeon protection

- `js/const.js` / `js/entities.js`: Dungeon Guardian definition, wall-passing chase AI and explicit
  contact damage. A dedicated skull render is in `js/render.js`.
- `js/main.js`, `updateDungeonGuardian`: host-authoritative spawn inside the closed Dungeon body;
  despawn after leaving or opening the Dungeon. Dungeon bricks remain mineable under their existing rules.
- Guardian discovery/kills do not enter the bestiary or increment kills; `killEntity` exits before
  coins, drops or reward hooks. It is not a boss-progression flag.

The progression harness verifies spawn, closing distance, lethal contact at 1000 HP, **live** despawn
on leaving, and no kill/bestiary/loot reward from a scripted 999999-damage kill. Survival of that
scripted hit is deliberately **not** required. Skeletron still opens the Dungeon normally.

### 4. Local-file lobby/CORS behavior

- `worker/relay.js`, `originAllowed`: explicitly accepts literal `file://` in addition to existing
  opaque `null` and approved origins. No wildcard was added; unrelated origins remain rejected.
- `js/main.js`, `initDOM`: removed the automatic boot lobby fetch. Manual Refresh remains available.
- `tools/mp-relay-smoke.js`: asserts literal-file acceptance and rejection of a foreign file origin.

The relay helper checks and local relay smoke pass. Production deployment is separate from these checks.

### 5. Defensive rendering

- `js/main.js`, `updateCamera`: restores corrupt positions to spawn and resets corrupt-motion state.
- `js/render.js`: lighting/minimap/full-map guards stop non-finite dimensions or coordinates from
  reaching image allocation; lighting warning is limited to once.

Focused tests inject NaN/Infinity, check finite recovered position/velocity/camera, and call guarded
render paths without exceptions. No ordinary gameplay source of NaN was established by this audit.

## Harness failures — repaired, not game regressions

The sixth original finding was the broken multiplayer smoke assertion. Further false findings were
identified while re-verifying it and the progression harness:

| False finding | Harness correction |
|---|---|
| Guest cannot craft 64 torches | Grant recipe materials; assert **exact `recipe.count` increase**, not 64 |
| Reconnect must change player ID | Confirm old socket closes, then connected client state; tolerate ID reuse |
| Starting axe yields no wood | Select the tool by its `axe` property, not nonexistent `type:'axe'` |
| Workbench cannot be placed | Special recipe places the tile directly; verify numeric `T.WORKBENCH` station ID |
| Copper Sword cannot craft at Workbench | Craft the required **Anvil** before asserting sword availability |
| Plantera bulbs missing | Registry is in pixels; convert to tiles and test the actual proximity trigger |
| Skeletron Prime did not spawn | Match entity/progression key `skelprime`, not only summon alias `skeletronprime` |
| Zombie contact broken | Reset health/death state and use a temporary flat arena; never compare HP across respawn |
| Pwnhammer vanished | Inventory ID is `I.PWHAMMER` (`pwhammer`), not string `pwnhammer` |
| Oceans missing | Scan below row 200, through the actual surface-water band |
| Late-game save/load loses victory | Drain pending saves, await a new save, verify stored progress, reopen the exact world ID |

The final corrected accelerated run reaches **15 boss flags, 39 achievements and Moon Lord victory**.
Hardmode, mechanical completion, boss flags and victory survive an actual page reload/menu resume.
Those counts describe this scripted run, not exhaustive achievement or boss coverage.

Harnesses now close browsers in `finally`; progression/UI findings are written even after a harness error.

## Untested or deliberately limited coverage

- Unassisted start-to-finish play, ordinary boss difficulty, summon acquisition, mining economy and long sessions.
- Real fishing casts/catches: the progression stage checks ocean water and rod recipe presence only.
- Physical excavation through Dungeon bricks, remote-guest Dungeon targeting, adverse-network races,
  and production relay behavior after deployment.
- The short UI dig remains at **Surface**: its screenshot is an observation, not verified underground exploration.
  The latest UI torch-placement attempt is **skipped**, not passed; focused crafting/render checks are separate.
- Exhaustive recipes/items, touch controls, audio quality, cross-browser testing, storage/quota failures,
  cloud backup recovery and recovery UI.
- Simulation-only timing samples are not a rendered-frame-rate benchmark.

Temporary static/Wrangler test servers have been stopped; ports 8765 and 8787 are closed.

**Conclusion:** the original patch findings are addressed and the corrected progression test is green.
This report makes no claim that every possible game bug or every gameplay route has been tested.
