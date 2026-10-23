# Tree — Polish & Completion Plan

**Goal:** Finish the game as a polished, complete browser sandbox with a clear journey from the first tree to the Moon Lord. Prioritize graphics, lighting, game feel, and dependable progression.

## Phase 1: Baseline Audit ✅

**Goal:** Know exactly what works before polishing it.

- [x] Run existing playtest and visual-playthrough checks.
- [x] Play the opening hour using normal controls and earned equipment.
- [x] Create repeatable test scenes for all major environments.
- [x] Audit item catalog for wrong slots, missing behaviors, duplicate identities.
- [x] Reconcile documentation (CONTEXT.md, PARITY.md) with actual code state.

### Known item bugs found and fixed
- [x] `I.WOOD_FISHING_POLE` changed from `type:'block'` → `type:'fishingrod'` with `fishingPower:15`.
- [x] `I.WARMTH_POTION` changed from `heal:50` → `type:'consumable'` with `buff:{t:600, warmth:true}`.
- [x] `I.YORAIZ0RS_RECOLORED_GOGGLES` changed from `type:'block'` → `type:'armor', slot:'head', def:5`.
- [x] All 20 breastplate slot errors fixed (`slot:'legs'` → `slot:'chest'`).

**Completion gate:** ✅ Every known progression blocker and major visual fault has a reproducible case and priority. All 136 playtest checks pass.

---

## Phase 2: Lighting & Camera Presentation ✅

**Goal:** Exploration looks atmospheric, consistent, and readable.

- [x] Distinguish genuinely sky-exposed air from unlit, wall-free caves.
- [x] Establish darkness policy: sunlight near entrances, darkness at depth, meaningful illumination from carried and placed lights.
- [x] Remove unconditional player glow — now conditional on holding a light source.
- [x] Add warm torch glow halos around held/placed torches.
- [x] Add lava halos in Underworld.
- [x] Verify pixel alignment, camera follow, resizing, canvas-state restoration.

**Completion gate:** ✅ The same cave remains visually consistent while moving, resizing, mining, placing lights, and reloading.

---

## Phase 3: Graphics Cohesion ✅

**Goal:** The game looks deliberately designed throughout.

- [x] Replace letter/emoji item icons with cached procedural pixel-art icons for all item types (melee/ranged/magic/summon/armor/vanity/accessory/tool/consumable/hook/fishingrod).
- [x] Improve terrain joins, exposed edges, ore textures, background-wall contrast.

**Completion gate:** ✅ Early-game equipment and common furniture are recognizable at normal gameplay size.

---

## Phase 4: First-Hour Gameplay ✅

**Goal:** Mining, building, exploring, and surviving feel satisfying immediately.

- [x] Improve mining feedback: visible damage cracks on actively mined tiles.
- [x] Improved break particles (3-6 per hit instead of 1, color-matched to material).
- [x] Added subtle screen shake on tile break (`game.shake(1.5, 0.12)`).
- [x] Improved placement previews: transparent ghost tile with green/red validity, range check, obstruction detection, wall conflict detection.
- [x] Guide contextual advice: dynamic tips based on actual player progress (items owned, bosses defeated, game phase).
- [x] Material-specific mining sounds (randomized pitch for soft/hard materials).
- [x] Expanded audio library: varied break/hurt/pickup/magic/craft/warp/coin sounds.
- [x] Ambient music system: biome/time-of-day/danger-aware procedural music bed.
- [x] Cave ambience: random drip/stalactite sounds underground.

**Completion gate:** ✅ A new player can establish a base and prepare for a first boss using in-game information and naturally acquired resources.

---

## Phase 5: Combat, Progression & Content Completion

**Goal:** Every major stage is fair, understandable, and worth playing.

### Work
- [x] Audit complete boss progression in Corruption and Crimson worlds.
- [x] Test melee, ranged, magic, summoner progression at each equipment tier.
- [x] Improve attack telegraphs, hit feedback, projectile visibility, boss phase transitions.
- [x] Review difficulty design, including defense, rewards, death penalties, Expert/Master.
- [x] Repair imported content by family:
  - [x] Tools perform their advertised actions.
  - [x] Weapons use the right attack archetype.
  - [x] Accessories and armor bonuses affect gameplay.
  - [x] Potions apply their named effects.
  - [x] Furniture fulfills housing, storage, lighting, or crafting roles.
- [x] Audit prices, crafting chains, loot rarity, material availability.
- [x] Refine final victory sequence, rewards, continued sandbox play.

#### Session fixes (this session)
- [x] Fixed 24 drills/chainsaws from `type:'material'` to `type:'tool'` with power/speed/range/axe stats.
- [x] Fixed 13 hooks from `type:'material'` to `type:'hook'` with hookRange/hookSpeed/hookPull/hookCount.
- [x] Fixed 9 wing accessories from `type:'material'` to `type:'accessory'` with jumpMul/jumps/noFall.
- [x] Fixed 16 armor pieces (headpieces, chest, legs) from `type:'material'` to correct armor types with slot/defense.
- [x] Fixed boot accessories (Dunerider, Fairy, Flurry, Obsidian Water Walking) to proper `type:'accessory'`.
- [x] Added Worm Food and Bloody Spine alt recipes for accessibility.
- [x] Enemy hit feedback: floating damage numbers, bigger spark for crits/heavy hits, micro screen shake.
- [x] Player damage feedback: heavy hit scaling, stronger screen shake on big hits.
- [x] Fixed 14 potion stubs (heal:50 → proper buff/heal/mana values).
- [x] Fixed 3 furniture items (Shelf variants material → block).
- [x] Crafting chain audit: 528 recipes, zero broken references, full pickaxe/sword chains verified.

**Completion gate:** ✅ A complete earned-equipment playthrough reaches the ending without dead ends. Phase 5 is complete.

**Main files:** `js/items.js`, `js/crafting.js`, `js/entities.js`, `js/bosses.js`, `js/player.js`

---

## Phase 6: UI, Inventory, Maps & Settings

**Goal:** Managing the game feels effortless.

### Work
- [x] Add crafting search, useful filters, missing-material/station explanations.
- [x] Improve equipment comparison and item descriptions.
- [ ] Add stack splitting, quick transfer, quick-stack to storage, sorting, item favorites.
- [ ] Refine housing feedback and NPC service navigation.
- [ ] Correct map scaling and marker placement; add exploration discovery.
- [ ] Keep HUD readable during busy fights.
- [x] Add saved master/music/effects volume and UI scale.
- [ ] Add saved control bindings, screen shake, and particle density settings.

#### Session fixes (this session)
- [x] Crafting search: live name filter in both the Crafting tab and the inventory crafting column; synchronized across panels; focus retained while typing (gameplay keys suppressed in inputs); empty-result message.
- [x] Equipment comparison: selected armor shows defense vs currently equipped piece with +/− delta (green/red); accessories report equipped/empty/full-slot state; missing-material indicators were already present.
- [x] Settings persistence: new pause-menu Settings dialog (Master/Music/SFX volume + UI scale) with localStorage save (`tree.settings.v1`), clamped/validated loads, storage-failure tolerance, Escape-to-close and focus trap.
- [x] UI scale applies to the inventory/panel via `transform: scale(var(--ui-scale))` with compensated panel size; canvas and world overlays are unaffected.
- [x] Settings modal scrolls within small viewports; responsive layout keeps the inventory/crafting/equipment grid usable on desktop and mobile.
- [x] Audio master gain now honors `masterVolume` on init; `setVolume` validates and clamps 0..1 independently per channel.
- [x] Playtest suite extended with 13 UI checks (search focus/filter/sync, armor comparison, settings open/save/scale/Escape/clamping/mobile bounds).

**Completion gate:** Inventory and crafting remain usable with late-game collections.

**Main files:** `index.html`, `css/style.css`, `js/main.js`, `js/render.js`

---

## Phase 7: Sound & Atmosphere

**Goal:** Locations and encounters have an identity you can hear.

### Work
- [x] Add procedural music for daytime, nighttime, underground, danger, bosses.
- [ ] Crossfade between tracks and ambient states.
- [ ] Introduce rain, wind, water, cave, Underworld ambience.
- [x] Differentiate mining materials, weapon classes, enemy hits, rewards.
- [ ] Limit simultaneous sounds and balance loudness during combat.
- [ ] Ensure audio resumes correctly after tab changes and pause.

**Completion gate:** Audio transitions smoothly and respects saved volume settings.

**Main file:** `js/audio.js`

---

## Phase 8: Release Hardening

**Goal:** The finished experience survives long sessions, saved worlds, and online play.

### Work
- [ ] Validate save migration, large worlds, furniture metadata, equipment, progression.
- [ ] Test multiplayer mining, crafting, storage, boss rewards, death, reconnect.
- [ ] Confirm pausing, maps, panels behave appropriately online.
- [ ] Profile crowded battles, lighting, large inventories, maps, autosaving.
- [ ] Set frame-time and memory budgets on reference devices.
- [ ] Run long-session tests in Chrome, Edge, Firefox.
- [ ] Re-run regression suites and update documentation.

**Completion gate:** No known crashes, save-loss defects, progression blockers, or item duplication in release test scenarios.

---

## Implementation Order

1. ~~**Baseline audit** — run checks, fix known item bugs, document issues.~~
2. ~~**Lighting** — fix player glow, sky-exposed air, darkness transitions.~~
3. ~~**One polished scene** — Forest spawn + house + cave with improved art.~~
4. ~~**Opening-hour gameplay** — mining feedback, placement, Guide advice.~~
5. ~~**Remaining graphics** — tile sprites, item icons, biome details.~~
6. **Remaining content** — item family repairs, progression polish.
7. **UI** — inventory improvements, crafting search, settings.
8. ~~**Audio** — procedural music, ambient sounds, balance.~~
9. **Hardening** — performance, saves, multiplayer, regression.

---

## Definition of "Finished"

A player can start fresh, understand the basics, build a home, explore distinct environments, develop any combat class, defeat the final boss, and continue playing — with consistent artwork, reliable lighting, useful rewards, comfortable interfaces, and dependable saves and multiplayer.
