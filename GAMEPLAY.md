# Gameplay audit patch

## Latest continuation evidence and restart qualification

Parent reviewed actual normal-input receipts and immutable checkpoint storage hashes in `test-results/RESUME-20261030-PRE-RESTART-REVIEW.json`.

- Original boss world **harvested11Wood, crafted/placed a Workbench, and equipped the owned Pink Phasesaber into hotbar7** by using earned Dirt in normal construction, then normal bag cursor pickup/panel close. No covered-hotbar click, forced input, grant or source change. This establishes the historical legitimate workaround. A subsequent attack ended HP19/Copper923/Lens0 with nearby Ghost/Demon Eye absent, not a boss defeat. The next restart lost these unsaved equipment/construction/coin changes: saved saber is back in backpack27, Copper757/Dirt36/Wood0. Historical equip is not current persisted gear placement.
- Cave **crafted Furnace normally**, Stone95→75 with placement feedback, and advanced its staircase atHP55; chest/loot/physical return remain incomplete. Current restored station tile is not independently reverified by this review.
- Town collected17Stone before restart atHP48/Iron16; actual save retains6Stone and a position80px higher. Interrupted final mining has no committed result and is not counted/replayed blindly. No Furnace/bars in that pre-restart town segment.

Save-based recovery clears ordinary enemies and may roll back unsaved terrain/movement/RNG. The user was informed; these are not exact live continuations or tactical reloads. Existing agents continue the same worlds/frozen sources without pooling progression. No full-game/regression success, new product fix, commit or deployment is implied.

## Scope

The user requested a gameplay audit using GPT-6 Luna, then authorized a consolidated gameplay patch after its findings were verified. Luna's report and receipts are in ignored `test-results/gameplay-luna/`. Its organic play remained partial; assisted progression through Moon Lord, persistence, death/recovery and selected optional systems must not be described as an earned full playthrough.

The patch targets reproducible defects and narrowly related starter-loop improvements, not speculative difficulty or content changes:

- Separate ordinary golem AI from the Temple Golem boss's global function binding. The collision affects Ice, Granite and Marble Golems; their existing intended enemy helper supplies walking/frost bolts, while Temple Golem retains its boss phases.
- Verify and resolve the advertised right-click placement mismatch without removing left-click placement or overriding chest/NPC/event interactions.
- Correct placement previews that read item-stack metadata instead of item definitions. Verify reachable placement, adjacent fallback, player overlap, cooldown and inventory consumption.
- Report actual crafted station names rather than their placeholder Wood/Stone/Bar result, and explain blocked station placement while preserving material rollback.
- Clarify Axe/Pickaxe selection and truthful controls without changing mining, combat or equipment mechanics.

## Verification

The pre-fix invocation of `tools/gameplay-patch-check.mjs --baseline` recorded failures in `test-results/audit2/gameplay-patch-baseline.json`. That flag selects a separate output name; it does not reconstruct old source and should not be rerun over the patched source to recreate the original evidence. The ordinary entrypoint checks patched behavior and writes `gameplay-patch.json`. Disposable browser worlds and controlled room/inventory fixtures are used; no production state or user saves are touched.

The corrected baseline completed **3/12 passing checks**, with zero browser errors. Nine expected failures reproduced the targeted AI/control/placement/feedback defects. Temple Golem phases and existing chest/panel/tool interaction protections already passed and must remain intact. The earlier baseline run had paused-UI and stale-station fixture mistakes; it is retained separately at `test-results/gameplay-patch/baseline-fixture-errors.json`, not treated as additional game defects.

## Implemented local changes

- `js/entities.js` dispatches Ice/Granite/Marble Golems to uniquely named `golemEnemyStep`. The intended helper body is unchanged; `js/bosses.js` and Temple Golem's `golemStep` remain untouched.
- `js/player.js` adds a read-only `placementTarget` shared by placement and cursor feedback. Blocks retain adjacent-placement fallback with a five-tile limit, final-cell reach checks, player-body exclusion and a 0.12-second placement cooldown. Walls retain their six-tile reach and 0.08-second cooldown. Existing pylon-biome and ground-support restrictions stay intact.
- `js/main.js` keeps right-click interaction priority, then places selected blocks/walls only when no interaction handled the click. Weapons, tools and consumables are never activated by this fallback. Left-click use/placement stays available; simultaneous left/right input cannot spend a second stack through the fallback. Chest clicks are explicitly consumed even when locked or too far away, rather than placing an adjacent block accidentally.
- Placement previews now read `ITEMS[stack.id]` and use actual placement validation. Terrain hints identify an Axe or Pickaxe when the held item cannot perform that action, without auto-switching tools. Guide/field-guide copy describes the real controls and starting tool slots.
- Both crafting panels report the recipe's actual station/result name. Workbench/Furnace/Anvil are described as placed nearby. Failed special placement still rolls materials back and now explains that nearby space is needed.
- Only changed gameplay module URLs in `index.html` use `?v=20261028-gameplay1`. Existing artwork, renderer, networking, menu styles and unrelated module tags are preserved.

The after-fix suite passed **12/12 checks locally** and **13/13 over HTTP**, with zero browser errors. The HTTP run also fetched exact source matches for all four refreshed gameplay modules. Physical left/right block and wall placement was reproduced twice per input/type; all three ordinary golems fired correct frost bolts while Temple Golem retained both boss phases. All six station/panel confirmation cases and blocked-material rollback passed.

An initial after-fix run passed 11/12: all six enemy-golem cases fired the expected shots, but its movement comparison placed taller golems using the player's ground height, intersecting the floor. The fixture was corrected to use each enemy's own height; no AI/body/collision code was changed to satisfy that test. The original baseline's missing attacks and boss-state collision remain independently reproduced.

## Completed final regression

The extended focused suites passed **16/16 locally and 17/17 over HTTP**, with zero browser errors. Sustained 330-tick golem firing, exact five/six-tile placement limits, support/pylon restrictions, read-only preview prediction, locked-chest/NPC priority, dead-player suppression and simultaneous-button inventory safety all passed.

The subsequent frozen full regression passed **1087/1087 checks across 52 gameplay/graphics/control/menu suites plus all 24 HTTP smokes**, with zero browser errors and unchanged source hashes. Both new file/HTTP gameplay suites are counted assertion suites; the 24 legacy HTTP smokes are additional. Existing combat/mining, equipment/animation, save sanitization, event/progression, opening-menu lifecycle and artwork suites all passed. The manifest is `test-results/audit2/sweeps/gameplay-patch-1793179026360/summary.json`; frozen source is `C:\Users\ethan\AppData\Local\Temp\opencode\tree-gameplay-patch-qAuw7r`.

A final SHA-256 comparison of every recorded source file against the working tree found **zero mismatches**. The tested snapshot therefore matches the actual runtime/test source left in the workspace. Documentation is outside the snapshot's source-hash roots. This is regression verification, not a claim that the audit completed all natural acquisition paths or an organic full playthrough.

Run independently:

```powershell
node tools/gameplay-patch-check.mjs
node tools/gameplay-patch-http-check.mjs
node tools/graphics-regression-snapshot.mjs gameplay-patch
```

Syntax checks pass for 109 JavaScript files including the shared audit helper; whitespace validation is clean. Existing callers of `setupAudit()` keep their file-based behavior; the new optional URL argument lets the same assertions run over HTTP. Existing graphics/user work remains intact. No commits or deployments are authorized by this patch request.

The pre-gameplay baseline was **1054/1054 across 50 suites plus 24 HTTP smokes**. The current completed baseline is **1087/1087 across 52 suites plus 24 HTTP smokes**. The gameplay patch and previously completed artwork remain local, uncommitted and undeployed. Save/network formats and unrelated gameplay mechanics were not changed; catalog pruning remains paused.

## Fresh-world playtest follow-up (resumed October 29)

The user requested sustained fresh-world testing and parallel agents, then paused the work and explicitly resumed it. The live site was left running and unchanged. The follow-up tests use the read-only snapshot `C:\Users\ethan\AppData\Local\Temp\opencode\tree-gameplay-progress-oeGdm5` and disposable browser storage. The earlier 1087-check regression remains the completed patch baseline; extra auditors, static findings and partial playtests do not increase its pass count.

### Established follow-up evidence, not yet patched

- **Cursor targeting:** real-input movement under a stationary pointer reproduced roughly 129–132 pixels of stale world-coordinate error. A one-pixel pointer movement refreshed it. This does not prove that all earlier harvesting failures had this cause.
- **Inventory accessibility:** actual hotbar center clicks while inventory was open were intercepted by the inventory panel at both 1280×800 and 1440×900. No forced clicks or CSS changes were used. Broader inventory/equipment behavior remains to be exercised.
- **Autosave item loss:** twice, an existing starter pickaxe held on the cursor disappeared from the persisted inventory after a real timed autosave and was absent after refresh/reopen. This is an explicitly assisted fixture: the existing pickaxe was relocated to a visible inventory cell before normal pickup, with no item grant or time/source/HP changes. The ordinary inventory-close → pause → Save & Quit control preserved the item. Evidence: `test-results/gameplay-independent-verification/assisted-results.json`. An earlier invalid autosave-wait receipt is retained separately and is not evidence for or against the defect.

### Natural progression and limits

Luna's calibrated retry obtained Wood **0 → 1 → 21**, crafted a Workbench with **21 → 11** Wood, and observed `Placed Workbench nearby.` through actual inputs. It did not complete Stone/ore acquisition, later stations, housing, night/Lens farming or a first-boss attempt. Its evidence is in `test-results/gameplay-progress/`; neither that result nor assisted endgame checks constitute a full organic playthrough.

The paused independent run also recorded a Dungeon Guardian attacking a fresh character near spawn in seed `498531107`. A new isolated verifier is checking repeatability and whether coarse dungeon bounds incorrectly include a non-dungeon spawn. It remains a suspected defect until verified. A separate sustained starter/resource lane is running in `test-results/gameplay-resume-starter/`; reports must distinguish naturally acquired progress, internal read-only scouting, assisted fixtures, harness failures and uncovered goals.

Static observations such as both ore variants generating, an Iron-only Anvil recipe, and simplified housing rules are not counted as bugs merely for differing from Terraria. No commits, deployments or speculative balance changes have been made during this resumption.

### Confirmed fresh-spawn Guardian defect and local correction

Independent verification reproduced lethal Guardians in **2/2** fresh deterministic seed-only-assisted worlds using seed `498531107`, plus **1/3** untouched random menu worlds (affected seed `431241907`). These small samples establish a seed-dependent bug, not a prevalence estimate or universal/permanent softlock. Affected characters were in surface forest with zero local dungeon bricks/walls; the actual nearest dungeon bricks were approximately 1,838–2,392 pixels away. The global dungeon rectangle encompassed spawn and `updateDungeonGuardian()` mistook that coarse envelope for occupied Dungeon terrain. Evidence: `test-results/gameplay-guardian-verification/report.md`, `results.json`, timelines and screenshots.

The authorized gameplay patch now has a narrow **local, uncommitted** correction in `js/main.js`: the existing rectangle/depth/unopened conditions additionally require `world.biomeAt(player.x, player.y) === BIOME.DUNGEON`. This reuses the existing local dungeon-brick classification without changing world generation, dimensions, spawn positions, Guardian combat, rewards, or boss gates. Existing cleanup also removes Guardians after leaving the local Dungeon even while remaining inside its broad rectangle. Only `main.js`'s cache tag advances to `20261029-guardian1`.

`tools/dungeon-guardian-check.mjs` uses the actual biome/Guardian helpers in an isolated Node VM with explicitly synthetic terrain fixtures. Before the correction it passed **4/7** checks; forest protection, local-exit cleanup and nine boundary cases failed. Afterward it passed **7/7**, including **120** rectangle/depth/local-biome/open-state combinations. Genuine local Dungeon spawning, one-Guardian cap, opened-Dungeon cleanup and entrance exclusion are retained by these mechanism tests. Results: `test-results/audit2/dungeon-guardian-baseline.json` and `dungeon-guardian.json`. These are not browser playthrough passes.

Independent browser verification **passed** in `test-results/gameplay-guardian-after/`: three selected-seed startups (two using `498531107`, one using `431241907`) remained at HP 100 with zero Guardians/deaths after at least ten real seconds. Each actual generated-Dungeon positive-control sequence retained exactly one Guardian, opened-Dungeon cleanup, renewed spawn after closing, and cleanup on returning to forest. Startup seed selection is labeled assistance; positive controls additionally use explicit teleports/open-state fixtures, not natural travel or Skeletron progression. Runtime and original frozen hashes stayed unchanged during the verification; served responses matched current source and there were zero page errors.

The Guardian mechanism suite is now included in future frozen full sweeps. The existing HTTP gameplay probe now requests the actual versioned script URLs from `index.html` rather than silently testing the previous hardcoded `main.js` cache tag. A sequential job reruns the focused Guardian/HTTP probes and, only if both pass, starts a new `guardian-local-biome` frozen full sweep. Its result is **pending**; the completed 1087-check snapshot remains the last confirmed full baseline. The sustained natural starter agent remains on the original unchanged frozen source; its findings must not be attributed to this corrected source.

### Completed natural starter progression

The sustained original-source run completed meaningful starter progression in **one** menu-created Normal/Corruption world, seed **571654287**, with no alternate seed selection or gameplay grants. Instrumented read-only terrain/slot scouting guided actual keyboard/mouse/UI actions; it was not unaided human exploration. Naturally earned positive material deltas were **32 Wood, 66 Stone, 15 Copper Ore, 18 Iron Ore and 73 Dirt**. The run crafted a Workbench, Wooden Sword, two Furnaces, six Iron Bars, five Copper Bars, an Anvil, Copper Bow, 25 arrows and four torches. Far placement consumed nothing; near left and right placement each consumed a Stone and created the corresponding tile.

Both completed persistence receipts passed exact seed/inventory/sampled-terrain/four-station comparisons after real Save & Quit/reopen. Parent review confirmed all four boolean checks in both `test-results/gameplay-resume-starter/persistence-core.json` and `persistence.json`. The same-world disposable save includes IndexedDB and is preserved for continuation.

Duration was **46.3 wall-clock minutes**, including substantial inspection/controller repair pauses, and **15.1 minutes of advancing simulation**, corresponding to the HUD moving from **7:41 AM to 8:56 PM** (about 13.25 in-game hours). Do not describe this as 15 in-game clock minutes or 46 minutes of uninterrupted survival. Several disclosed reloads cleared nearby enemies; this establishes natural acquisition, not no-reload survival balance. Zero page errors were captured. All detailed receipts, failed harness attempts and screenshots remain under `test-results/gameplay-resume-starter/`.

No unobstructed ranged hit/kill, housing, Lens collection, summon, first-boss attempt or full night cycle was established. The Wood strategy target of 50 was not met; the actual earned 32 sufficed for the documented crafts. A new stage is continuing the **same earned world/save** toward natural night combat and the first boss in `test-results/gameplay-resume-boss/`, without modifying the completed starter evidence or granting missing materials.

### Isolated candidate review (before integration)

Separate agents prepared isolated pointer-refresh, cursor-held autosave and hotbar accessibility candidates. The pointer candidate reported 12 VM checks and 10 real-input browser cases; the save candidate reported 16 mechanism checks and five browser cases, including a real 65.371-second autosave/refresh recovery. Parent reruns independently passed both mechanism suites. Candidate-only passes do not count as integrated-runtime or full regression passes. Durable pointer/save regression entrypoints were prepared under `tools/`; pre-merge failures are baseline evidence, not a broken deployed build.

### Integrated follow-up patch — validation pending

After reviewing all three completed candidates, the parent merged focused changes rather than overwriting entire candidate files:

- `js/main.js` now refreshes pointer world/tile coordinates from the last real client position before player actions, after camera updates, on real move/down events and resize. The shared conversion accounts for canvas bounds/scaling; it preserves client coordinates for HUD/map use, unknown-pointer sentinels, tool reach, smart-mining rules and network authority. No unverified focus-loss behavior was changed.
- Save snapshots now detach their JSON-compatible data before asynchronous writes and include optional `player.inventory.held` for host/offline persistence. Loading validates ID/count/reforge, restores the exact cursor stack and opens inventory, even with every slot full. Joining clients do not inherit the host's cursor stack. Old format-1 saves without the field still load normally; **older builds ignore this new field**, so downgrade roundtrips are not promised. General metadata-loss paths in unrelated existing inventory transfers are not claimed fixed by cursor persistence.
- `css/style.css` reserves a scale-aware hotbar band above the panel. The tab list scrolls separately from a pinned, accessible close button. `index.html` adds the tab-list wrapper without duplicate hotbars or IDs. Equipment events delegate through the shared `inv-equip` parent so accessory/dye/ammo sibling controls can receive their existing handlers; ammo choice rerenders immediately.
- Runtime tags are now `css/style.css?v=20261029-inventory1` and `js/main.js?v=20261029-gameplay2`. The Guardian correction and prior artwork/gameplay changes are retained; other assets and save/network scheduling remain unchanged.

On the **merged runtime**, parent mechanism checks passed **12/12 pointer**, **16/16 cursor-save**, and **7/7 Guardian** (including the 120 Guardian boundary combinations). These are synthetic mechanism passes, not browser/natural progression passes. The isolated hotbar candidate passed nine viewport/UI-scale configurations before integration; those candidate results are not substituted for a merged-runtime run.

The merged source/test plan is frozen at `C:\Users\ethan\AppData\Local\Temp\opencode\tree-gameplay-integration-b9fd7s`, manifest `test-results/audit2/sweeps/gameplay-integration-1793236886165/summary.json`. A sequential queue runs existing controls/gameplay/file/HTTP/menu checks and starts the full frozen sweep only if those checks pass. Independent merged-source browser verification is also running in `test-results/gameplay-integrated-browser/`. **Both results are pending**; no new full total or browser integration pass is claimed. The natural boss continuation still uses its original frozen source and earned save, separately labeled.

### Resumed gameplay testing (user request)

The user lifted the pause and asked to continue gameplay testing where Luna left off with maximum parallelism. The gameplay-integration frozen sweep resumed from its saved manifest, and four background lanes launched: (1) the earned seed-571654287 world continues toward night combat and the first boss from its exported disposable save; (2) a fresh natural housing/town lane; (3) a fresh natural underground/cave lane; (4) the interrupted integrated merged-source browser verification restarted. All lanes use the frozen read-only source, disposable saves, one browser each, and labeled instrumented natural input. Their results are pending; nothing is committed or deployed.

### Completed Guardian-only full regression

The earlier Guardian-only snapshot subsequently completed **1094/1094 checks across 53 suites plus 24 HTTP smokes**, with zero errors, no failed commands, and unchanged frozen source. Parent review confirmed those fields directly from `test-results/audit2/sweeps/guardian-local-biome-1793233530781/summary.json`. Its source is `C:\Users\ethan\AppData\Local\Temp\opencode\tree-guardian-local-biome-hg4xTX`.

This is now the **latest completed full baseline**, superseding 1087/1087 for the initial patch. It does **not** include the later merged pointer/save/inventory changes or their new mechanism suites. The `gameplay-integration` snapshot remains pending and must pass independently before those newer changes are described as fully regression-tested. No commit or deployment was performed.

### Durable model-independent playtest handoffs

At the user's request, new test-only infrastructure under `tools/playtest/` and `tools/playtest-session.mjs` supports persistent isolated Chromium controllers, single-owner leases/controller epochs, bounded idempotent physical-input actions, read-only inspection, automatic debugger suspension between actions/on owner expiry, versioned IndexedDB/localStorage exports, and checksummed source-pinned handoffs with objectives/next steps/evidence. `PLAYTESTING.md` and scoped root `AGENTS.md` document takeover, user pause, usage-limit abandonment, and crash recovery for any model with repository/shell access. No game code or provider configuration is changed by this feature.

The final infrastructure run passed **44/44** checks: 24 unit/store/lease, 11 browser pause/cross-owner/save-restore, and nine CLI/actual process-loss cases. Reports are `test-results/playtest-session-{check,browser-check,crash-check}/results.json`. These are not natural gameplay passes or a replacement full game regression. The completed merged game sweep remains **1114/1122 FAIL**; isolated corrected combat/fishing fixture passes do not change that original manifest.

Boss seed 571654287's final run-three export, cave seed 420886796's retained earlier save, and fishing seed 1125105335's actual early save have been registered without starting replacement worlds. Housing seed 1173408986 has a live managed controller. Check current ownership/status before takeover. The fishing export does not contain its later live Wood/Workbench progress; registration explicitly flags unknown lost live progress. All old evidence/exports remain unchanged.

Initial lifecycle-only freezing failed real browser verification and was replaced with confirmed debugger-thread suspension. The housing agent adopted the early version during development; unattended clock advancement and the one-time ordinary Save & Quit used to upgrade it are explicitly disclosed in its handoff and `test-results/playtest-session-rollout/README.md`, not counted as natural input coverage. A live browser can retain its exact paused encounter across model swaps; after browser/process loss only the actual stored game save is recoverable. Unsaved changes, live enemies, RNG and active boss encounters are not claimed crash-durable. AI credits cannot be replenished by this tool, nor will it automatically choose/bill another model.

### GitHub update before continuation

On the user's request, all four managed playtests were paused before pulling `origin/main`. The repository fast-forwarded from `8b4e75d` to **`a0e855a`**, bringing renderer chunk caching, minimap throttling and smoother parallax. Backups and verification in `test-results/github-update-1793256456161/` confirm preservation of all **46** locally modified/untracked files. An adjacent cache-tag conflict in `index.html` was resolved by retaining the local UI/gameplay/artwork changes and the upstream renderer/pixelart `20261029-perf1` tags. No new commit/push/deploy was performed; the scoped HTML stash remains as a recovery copy.

Existing live natural lanes continue on their pinned old builds, preserving their exact paused worlds; their results must not be attributed to the new renderer. The updated tree is separately frozen at `C:\Users\ethan\AppData\Local\Temp\opencode\tree-github-perf-update-9IkXQ6` (freeze-only manifest `test-results/audit2/sweeps/github-perf-update-1793256582493/summary.json`). Three additional Luna lanes cover updated-build natural stability, cache mechanism validation and focused regression, alongside the four resumed natural lanes. All new results are pending; no new full regression pass is claimed.

### Reviewed updated-renderer focused results

The new frozen build completed **249/249 focused assertions**: graphics 19, combat graphics 149, player controls 44, opening menu 20, gameplay HTTP 17. Parent independently parsed each completed underlying report and confirmed zero browser errors and identical before/after source manifests (198 files). The agent originally wrote the artifacts under the frozen snapshot's `test-results/gameplay-luna3-perf-regression/`; parent copied the complete evidence into the workspace path of the same name without deleting or overwriting the originals. `parent-review.json` records the verified totals. This is test-assisted Chromium coverage, not organic gameplay, Firefox/WebKit compatibility, or a complete regression-plan pass.

Parent also reran the seven Node VM/recording-canvas checks in `test-results/gameplay-luna3-cache-mechanisms/mechanism.test.mjs`. No terrain invalidation correctness regression was reproduced. The tests document two bounded concerns rather than exonerating every rendering behavior: cached canvases can remain above a reduced viewport cap after shrinking (test retained 100 when cap dropped to 40), and stationary-player minimap tile edits may wait 15 frames instead of the baseline's next-call refresh. These were not demonstrated gameplay failures, browser/GPU memory measurements, or pixel-equivalence tests. No source fix was made.

The updated-build natural/stability branch and the original four saved gameplay lanes remain separate ongoing work. Focused results do not change the historical **1114/1122 FAIL** full manifest or constitute a new full passing baseline.

### Sustained updated-build natural lane — partial coverage

The updated-renderer branch `gameplay-luna3-perf-natural` reached checkpoint `cp-1793258398798-6dfe3c99`, seed 420886796, approximately **8m07s of advancing daytime simulation** (timeOfDay `0.45538888888896417` → `0.7258518518507234`, multiplied by the implemented 1800-second daytime conversion). HUD time was 10:55 AM → 5:25 PM; do not call that eight in-game clock minutes. The live controller is retained paused, with final HP14. Natural deaths/respawns and a late respawn-click timeout are disclosed; no renderer defect or clean performance benchmark is established.

Natural mining changed a dirt tile to air and the viewport was used at 1280×800. Chopping, successful placement, minimap invalidation and visual parallax comparison remain unverified because the suspended-page screenshot path could not capture them. `test-results/gameplay-luna3-perf-natural/{notes.json,parent-review.md}` and the managed action log preserve these qualifications. A read-only canvas screenshot fallback is undergoing separate infrastructure validation; it does not retroactively complete these missing visual checks or alter the already-paused controllers.

### Confirmed follow-up: coin change lost with full inventory

The extra town/shop agent found a real **mechanism-confirmed currency loss** in `Inventory.prototype.spendCoins` (`js/items.js`): it consumes higher-denomination coins and ignores failures when adding lower-denomination change. Parent independently reproduced it using the **complete real item catalog, valid 50-slot Stone inventories, and actual production transaction helpers**, not the agent's abbreviated item metadata/filler IDs.

- Twice each: spending one copper from two Gold Coins lost **9,999 copper** of change; spending one from two Silver Coins lost **99 copper**.
- Twice through production Merchant stock/proximity/price/buy helpers: a full inventory containing two Gold Coins and a Torch stack with room for ten accepted the real ten-Torch, **500-copper** purchase. Wallet value fell **20,000 → 10,000**, instead of **19,500**: **9,500 copper change lost** while the purchase reported success.
- Controls with room for change charged correctly; insufficient funds left inventory untouched. Source hashes remained unchanged. `items.js` and `main.js` hashes match across the workspace, merged test build and new GitHub-performance snapshot, so this is not merely an obsolete frozen-source finding.

Evidence: `test-results/gameplay-extra-town-shops/{report.md,results.json,parent-verify.mjs,parent-verification.json,source-scope.json}`. This is isolated Node VM assistance, **not** a naturally earned Merchant or live UI reproduction. No fix or source integration was made; the issue remains an unpatched follow-up while natural playtests continue.

The separate death audit reports no new death-specific conservation defect. Its reproduced boss-bag metadata loss occurs on generic cursor-to-inventory panel close, including outside death; it remains the previously disclosed transfer limitation, not a newly diagnosed death regression. Spawn/traversal audits likewise provide mechanism/static guidance rather than natural Eye/Lens, ravine-escape, housing or hazard passes.

### Updated-renderer natural placement/mining follow-up

Parent reviewed the completed updated-source lane's action receipts at checkpoint `cp-1793269016603-27a2dcbd`: physical Dirt placement/mining changed AIR → DIRT → AIR and the earned stack **5 → 4 → 5**; Platform placement/mining changed AIR → PLATFORM(6) → AIR and **24 → 23 → 24**. The same world/controller remained retained; no grant or new-world replacement was involved. Evidence and parent review are in `test-results/gameplay-resume-after-usage-visual/`.

Minimap pixel changes are supporting observations only because composited scene/light changes confound exact reversion. A jump moved the player up 23.1 pixels, followed by a normal landing; vertical camera/parallax continuity remains unverified. The jump PNG showed only background whereas the later landing PNG was complete. This is not a confirmed renderer defect: debugger-paused canvas extraction may capture an **in-progress frame**, not necessarily the last completed render. Controller caveat text and `PLAYTESTING.md` have been corrected; no game rendering or pause behavior was changed. The earlier 45-check infrastructure run proves frozen-state PNG capture, not frame-completeness/pixel equivalence.

### Natural housing and Guide persistence — completed and reviewed

The housing lane completed its core objective in the same earned world **seed 1173408986**, ID `9e515cf1-825a-4a6c-9f0d-620eb39d0ac6`, on the pinned older merged source `tree-gameplay-integration-b9fd7s` (not the updated renderer snapshot). The 6×4 footprint at x2098–2103/y201–204 has **22 flooded interior cells**, Wood Wall, Torch, Table, Chair and a closed solid boundary. Normal Housing UI assignment succeeded, the Guide occupied the home across time advancement and player leave/return, and a temporary opening was repaired/revalidated/reassigned before saving.

Parent independently verified the **actual retained saved world**, not a synthetic room: production `unpackTiles`, `World` and `checkHousingRoom` reconstructed the saved foreground/background arrays and returned `Suitable housing.`, size22, key `2098,201:2103,204:22`. Saved `housing[14]` matches that room/home, live Guide position `(33592,3247.99)` matches home `(33592,3248)` within collision epsilon, and the reopened live inventory fingerprint equals the actual saved inventory fingerprint. The append-only receipts confirm exactly the completed save-quit and same-world reopen requests, with no action errors. No additional controller action or persistence cycle was run for the parent review.

Evidence: `test-results/gameplay-resume-after-usage-housing/{continuation.md,parent-verify.mjs,parent-review.json}`, action references and managed `events.jsonl`; reviewed final pause checkpoint `cp-1793269143105-d826e2f2`. The single persistence reload and earlier necessary save-based crash recovery cleared ordinary enemies; subsequent live ticks remain flagged potentially unsaved. This establishes core room/Guide/occupancy/persistence coverage, **not** Merchant arrival/shop coverage or uninterrupted survival. The successful live lane is retained paused without stopping its controller.

### Confirmed follow-up: held fishing input cancels its own cast

The natural fishing lane earned a rod, Cobweb/Dirt and Worm bait, reached natural water and attempted 80 ms, 16 ms and 0 ms managed mouse inputs. Bait was consumed but no natural catch was verified; the live world is retained paused at `cp-1793271762027-2d02a412`, HP76, Cobweb2 and no remaining Worm/Dirt. Its conservative initial report attributed the attempts to possible managed input repetition, not a proven game defect.

Parent independently confirmed a **production input/cooldown defect**: `Player.update` dispatches `tryFish` every held update, but the existing-cast reel/clear branch precedes the cooldown guard. Two full production `Player.update`/`physicsStep` fixture repetitions showed the first held update cast/consume bait and the next immediately reel early despite positive cooldown. Separate helper repetitions reproduce the same path; a full-update release/wait-for-real-bite/re-press control catches one Salmon. That control is explicitly assisted, **not** a natural catch. The natural receipts and production dispatch support a game-side failure path, rather than only a controller limitation.

Evidence: `test-results/gameplay-resume-after-usage-fishing/{fishing-attempts.md,parent-findings.md,parent-mechanism-verify.mjs,parent-mechanism-review.json}`. No live gameplay input, bait grant, manual live stepping, reload or source change was used by parent. Parent attached the finding with claim/note/pause maintenance only, leaving HP76 and ownership released at checkpoint `cp-1793272170277-7c92f78d`. The issue remains **unpatched**; do not repeatedly consume natural bait to restate the same blocked path or count the assisted control as natural fishing coverage.

### Same-world town/character continuation — natural Mana Crystal consumed

Following ordinary exit mining and boundary repair, the housing world's character gathered **10 Wood from natural trees**, crafted a Workbench (tile verified at2148,210), crafted one Mana Crystal using **Fallen Stars8→5**, and consumed it through ordinary selected-slot input (**Mana Crystal1→0**). Parent independently reviewed the six relevant action-end receipts with no errors. Player remainedHP72. The canyon's upper gap was not crossed; the character landed on its lower slope safely.

No numeric live mana increase is verified: the managed snapshot omits maxMana, canvas captures omit the HUD, and the retained actual persisted save still predates this segment (savedAt1793268943139, maxMana20). Neither source-predicted +20 nor that stale save is evidence of the current live stat. No extra save/reload was performed to manufacture verification.

The earlier Guide room/assignment/persistence PASS remains historical evidence, **not** a claim of uninterrupted assignment afterward. Later permitted exit mining cleared housing[14]; boundary blocks were replaced, but **Guide assignment is currently absent**. No Merchant/new NPC arrival or shop success occurred. Reviewed segment pause: `cp-1793274805160-b698b287`, same seed1173408986, HP72 at34372.99,3359.99. Evidence: `test-results/gameplay-town-progression/{continuation.md,lane-note-egress.json,parent-review.json}`. Subsequent character/early-boss preparation is a separate campaign branch; its future flags and gear must not be merged with the original boss world.

### Town-branch natural Demon Eye combat and loot context

Parent reviewed `health-bossprep-defend-nearby-demon-eye-001/002`: ordinary Bat Bat inputs changed a natural Demon Eye **60→25HP→absent**, with playerHP72 throughout and **Lens0**. This establishes natural Demon Eye combat/kill support in this independent world, **not** Lens acquisition, a boss flag or progress in the original boss world. Exact before/after evidence: `test-results/gameplay-town-progression/parent-eye-loot-review.json`.

The same review located the first appearance of Arc Surge, Cobalt Waraxe and Ice Blade: all were absent before and present after `health-bossprep-defend-approaching-cave-bat-002`, a normal950ms Bat Bat input after which Cave Bat16HP was absent. All three are genuine entries in the frozen production Cave Bat drop table. This supports natural combat-acquisition context; no isolated pickup frame or exclusive enemy attribution is claimed. Their presence does not imply canonical progression flags, grants or prior boss victories. Source definitions identify Arc Surge as magic180damage/18mana, Cobalt Waraxe as a chopping tool and Ice Blade as melee; no successful use of those items is inferred merely from metadata.

Parent subsequently continued the paused town branch through24 ordinary mining actions: two-column shaft12 rows, Y3455.99→3647.99, Dirt17→34, Clay3→10, unchangedHP72. This is partial resource traversal only. `test-results/town-sol-progression/continuation.md` distinguishes that completed batch from a subsequently dispatched background ore attempt; dispatch is not an ore/mining pass.

### Town branch —16 Iron collected and saved mana increase confirmed

Subsequent completed physical mining cleared the mapped16-cell Iron vein and collected **Iron0→16**, with playerHP72 throughout. Final gameplay checkpoint `cp-1793277800352-0c7bafde`, same seed1173408986, position34267.01/3759.99, Dirt50/Clay10. Full receipts remain in `test-results/town-sol-progression/receipts/`. This is collected ore, **not** a bar/armor/boss achievement. An earlier out-of-range attempt is retained as a parent planning error: actual Copper Pickaxe mining is48px; Dirt placement is80px. No game source fix was needed or made.

Ordinary gameplay autosaving now confirms the earlier natural Mana Crystal increased **persisted maxMana20→40**. Parent compared the actual saved exports (before savedAt1793268943139, after1793277768714) in `test-results/town-sol-progression/mana-and-ore-review.json`; no extra persistence control or reload occurred. This supersedes the earlier lack of numeric verification for the **saved** stat only; exact current live mana still is not in the controller snapshot. The later save has10Iron vs16live, so remaining unsaved ore/terrain rollback risk is disclosed. The same live world is being handed onward for real smelting/equipment progress, not restarted.
