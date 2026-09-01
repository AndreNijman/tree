# SESSION_STATE — Batch 76 (vanilla enemy/critter roster)

> Resumability file for this batch. Update at every checkpoint, commit, push.
> Final fold-in targets: CONTEXT.md (Status + Next steps), PARITY.md (Batch 76 section).
> This file is deleted when the batch merges to main.

## Where we are

- Branch `batch-76` (based on main `8473870` = Batch 75, deployed). Pushed to origin.
- Workflow note: `drive/workflows/tree-batch-76.md` (active).
- Baseline verified earlier: `node tools/playtest.mjs` 114/114 PASS at 8473870.

## Checkpoints

- [x] C1 — Audit + roster decision + this file (below).
- [ ] C2 — const.js `E` ids 321–331 (+ any P needs: none planned).
- [ ] C3 — entities.js ENT_DEF + AI steps + dropTable.
- [ ] C4 — render.js drawEnemy cases (NO default case exists — a species without a case renders invisible).
- [ ] C5 — main.js pickEnemy pools + critter system (Penguin) + Meteor Head crater spawn + bestiary count check.
- [ ] C6 — tools/playtest.mjs Batch 76 section; full suite green; docs; merge to main; delete this file.

## C1 — Codebase facts (from explore audit; verified against files)

- `E` enum: highest id 320 (GREENJELLYFISH); 321+ free. Free gaps exist but tradition is new blocks at fresh numbers.
- ENT_DEF covers all non-pure-boss ids; 11 pure bosses (Retinazer..Moon Lord) have no ENT_DEF and no dropTable case (intentional).
- AI helpers available: zombieStep, slimeStep, flyStep, rangedWalkerStep, ghostStep, ghostShooterStep, wyvernStep (worms), hornetStep, tortoiseStep, golemStep, mimicStep, critterStep, birdStep, goldfishStep, maneaterStep, nymphStep.
- `pickEnemy` at main.js:3700–3924: pre-HM + HM branches by depth band and biome; weather overlays; swimmers placed in real Water since Batch 73.
- Bestiary: `bestiaryCatalog()` (main.js:4039–4054) derives from ENT_DEF (skips hp>=9000 + 13-id exclusion list) + explicit BESTIARY_BOSSES list (~35). New ENT_DEF entries join the bestiary automatically. NOTE: explore audit computed 252 vs Batch-73's recorded 262 — the playtest B73 check asserts 262 and passed at baseline, so trust the test; empirically re-check count via playtest before/after edits.
- Passive critters: `isAmbientCritter(type)` hardcoded 6 ids (main.js:2902–2904); pools inline in `updateCritterSpawning` (2941–2984); 5-critter cap; renders via drawGroundCritter/bird/fish helpers.
- dropTable has 222 cases, `default: return []`; combat targeting excludes `dmg <= 0`.
- Render `drawEnemy` has ~250 explicit cases, no default — every new species needs a case.

## C1 — Batch 76 roster decision (11 species, "remaining pre-HM/surface/ocean/Underworld + slime palette")

| # | Species | E id | Zone/phase | AI | Drops / notes |
|---|---|---|---|---|---|
| 1 | Vulture | 321 VULTURE | Desert surface, pre-HM+HM | flyStep | none (vanilla) |
| 2 | Shark | 322 SHARK | Ocean swim, pre-HM+HM | swim:true jellyfish path | SHARKFIN (canonical source; item already exists via Giant Tortoise substitute — keep both) |
| 3 | Orca | 323 ORCA | Ocean swim, HM-only | swim:true, fast/strong | none special |
| 4 | Snatcher | 324 SNATCHER | Jungle surface plant, pre-HM | maneaterStep (rooted, STINGER) | none special |
| 5 | Meteor Head | 325 METEORHEAD | Near meteorite craters, pre-HM | flyStep | special crater proximity spawn in updateSpawning |
| 6 | Red Devil | 326 REDDEVIL | Underworld, HM-only, rare | flyStep, tough | none special (vanilla) |
| 7 | Penguin | 327 PENGUIN | Snow surface, passive critter | critterStep | critter: dmg 0, empty drop, isAmbientCritter + snow pool |
| 8 | Purple Slime | 328 PURPLESLIME | Cavern, pre-HM+HM | slimeStep | GEL |
| 9 | Yellow Slime | 329 YELLOWSLIME | Desert, pre-HM+HM | slimeStep | GEL |
| 10 | Red Slime | 330 REDSLIME | Forest surface rare, pre-HM+HM | slimeStep | GEL |
| 11 | Black Slime | 331 BLACKSLIME | Deep cavern, pre-HM+HM | slimeStep | GEL |

Deferred to a future Batch 77 (HM biome roster): Hoplite (dungeon), Icy Merman (undersnow), Giant Shelly (jungle cavern), Floaty Gross (crimson), Sand Poacher + Desert Spirit + Tomb Crawler + Sand Shark family (underground desert), Anomura Fungus/Fungo Fish (mushroom), Skeleton Merchant (needs a shop).

## Recovery

If interrupted: `git status -sb` on branch batch-76 → read "Checkpoints" above → next unchecked item. Playtest always runnable via `node tools/playtest.mjs`. Never commit half-syntax: run `node --check js/*.js` before each commit.
