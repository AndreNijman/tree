# Item parity vs vanilla Terraria — Nov 2, 2026 → for Sol

**Scope:** full Terraria item database vs Tree's live catalog. Research only; nothing below was edited into the game. Terra edition basis: 1.4.4-classic (`tools/canonical/items-db.json` = official wiki Module:Iteminfo dump, spot-verified against live 1.4.5.x wiki pages), Tree values extracted live from the running game.

**Paper trail:** everything cited here lives in `test-results/terraria-item-parity-20261102/` —
`baseline/tree-items.json` (Tree's 1,864 items), `matched.json` (per-item deltas), `flags.md` (same, readable),
`stage-gaps.md` + `terraria-only.json` (vanilla items Tree doesn't have), `special-review.json` (mechanics implementations),
`wiki-notes/` (per-item live wiki pages + verification: all 710 pages fetched, resumable),
`function-guide.md` (how Terraria item systems work), `README.md` (pipeline + resume instructions for a later session).

Verification status of the vanilla benchmark: **complete — 710/710 wanted wiki pages fetched (0 failures), 705 verified against the DB.** All damage/useTime/knockback comparisons match exactly; 3 "crit" rows are combined-page artifacts (Candy Corn / Stake / Explosive Jack 'O Lantern — pages cover weapon+ammo, and the crit row belongs to the launcher/rifle, whose own DB totals match 10 and 14 exactly). 1 namespace collision: DB's 1.4.5-era Brain Scrambler weapon (dmg 20) shares a name with the Martian enemy page (dmg 50/100/150) — no weapon page by that name; treat the DB value as the record. Wiki crit totals confirmed the display convention: total = 4% base + item bonus, DB stores bonus only.

---

## 1. Highest-confidence fixes (bugs, not design opinions)

**1a. Nine orphan stub items in `js/items.js` — defined, never acquired, wrong categories.**
Found via the stat comparison: 8 melee-typed stubs all share the default template (`dmg 10, speed 0.417, kb 4, desc "A weapon."`) and 1 material stub (typo duplicate of Flairon):

| Tree item | Vanilla reality | Disposition |
|---|---|---|
| Yoyo Glove | accessory (yoyo) | retype/never-acquired |
| Magic Yoyo Bag | accessory (yoyo) | retype/never-acquired |
| Rainbow String | yoyo accessory material | retype/never-acquired |
| Rainbow Cursor | cursor cosmetic | retype/never-acquired |
| Intense / Living / Midnight Rainbow Dye | dyes | retype/never-acquired |
| Giant Bow | melee "bow" novelty weapon | retype/never-acquired |
| **Flairoon** (type `material`) | typo duplicate of Flairon | delete or fix acquisition |

None are referenced outside `defItem` (verified by repo-wide symbol scan), so they're either dead weight to delete or placeholders awaiting implementation — Sol should pick per item.

**1b. `Demonite Sword` is an exact duplicate of `Light's Bane`.** Tree 16 dmg / 0.333 s / kb 5 == vanilla Light's Bane (16 dmg, 20 ticks, kb 5, projectile 974). Vanilla has two demonite swords only via the stat-alternative Light's Bane vs Bladecrest Ossuary-era variants (none named "Demonite Sword"). Recommend merging into Light's Bane or differentiating.

**1c. 27 Tree hammers have hammer power 0 where vanilla is 40–110.** (`flags.md` "hammer power" rows.) In vanilla, hammer power gates wall removal and altar smashing; Tree hammers currently can't do either numerically unless the engine hardcodes it — Sol should confirm which it is.

**1d. No per-item crit.** 28 vanilla weapons carry bonus crit above the 4% base (Terrarian +6, Sniper Rifle +21, Staff of Earth +16, Sky Fracture +16, Keybrand +12…). Tree's engine has a global 4% base and no `crit` field. If Tree keeps crit simpler, these weapons lose part of their endgame identity; a per-item `crit` field in `defItem` is a small, contained change.

## 2. Stat deltas (design decisions where numbers drift)

Full per-item rows in `flags.md`. Count summary (of 692 matched combat/tool items, 276 flagged):

- **speed: 228 flags**, of which ~104 are >2 ticks and diverse. The largest single block is **tools**: Tree's mining cadence is uniformly slower than vanilla (Iron Pickaxe 60 ticks vs 20, Cobalt 90 vs 25, Mythril 120 vs 25, Adamantite 156 vs 25, Titanium 168 vs 25, Pickaxe Axe 180 vs 25, Drax 204 vs 15, Picksaw 240 vs 16). That's a *systemic* Tree choice — if slower mining is intentional pacing, close the flag; if not, a single tool-cadence tuning pass fixes ~69 rows at once. Whips (9/9 flagged: Tree 13–24 ticks vs vanilla flat 30) and summon staffs (Tree 0 = instant) are similarly systemic. Melee/ranged/magic are per-item noise (Phasesabers 15 vs 16, Brand of the Inferno 14.4 vs 20, Flying Dragon 10.8 vs 20).
- **damage: 22 rows.** Direction is mixed; biggest: Flying Dragon 92 vs 180, Sky Dragon's Fury 84 vs 140, Betsy's Wrath 78 vs 100, Aerial Bane 72 vs 38, Phantom Phoenix 66 vs 32, Flairon 132 vs 66 (1.4.5 dual-mode weapon; the live page lists both 132 and 66 — Tree took the newer value while everything else is 1.4.4; recommend one baseline), Tome of Infinite Wisdom 68 vs 36, Brand of the Inferno 52 vs 95, Ballista Rod 45 vs 30, all four sentry rods (Lightning Aura 18 vs 4 ×4 tiers).
- **knockback: 15 rows**, small drift, mostly whips/boomerangs.
- **ammo-category: 21 rows** — Tree's `ammo` string groups don't cover some vanilla `useAmmo` combinations (e.g. launchers, special arrows); see rows.
- **pick power: 4, mana: 2, hammer power: 27 (see 1c).**
- **autoReuse: 0 mismatches** — Tree's global hold-to-repeat matched every vanilla autoReuse record that mattered to combat items. A deliberately verified non-issue.

## 3. Mechanics Tree already implements (sampled against wiki family behavior)

417 items carry special-mechanics fields and were queued for behavior review (`special-review.json`). Family coverage is strong: flails (5, incl. alt-fire Flairon with bubble sub-projectiles + homing), yoyos (7 with durations + string-range), spears (9 with thrust durations + North Pole/Mushroom Spear extra projectile), whips (9 with tagDamage/tagDuration + Firecracker explosive tag + Cool Whip bonus bolt), terrain-zone weather weapons (Blizzard Staff/Lunar Flare/Daedalus Stormbow/Blood Thorn), channels (Last Prism with mana drain, Life Drain), controlled projectiles (Rainbow Rod/Flying Knife/Flamelash), Piranha Gun, vampire knives lifesteal, Seedler blade-splitting, homing sets.

What the wiki function research says to check in particular (behavior-level, from `function-guide.md` + live pages):
- **multi-volley cadence** (useTime ≠ useAnimation, e.g. Golden Shower 3 casts/press, Clockwork AR bursts + 14-tick reuseDelay): Tree has no reuseDelay; its global hold-repeat plus per-field spread/projCount approximations are already the reduced-parity plan — flags confirm remaining gap is small.
- **flail return-gate** (can't re-fire until return) — matches Tree's flailDuration design; point-blank double-hit quirk is the feel item worth testing in a harness before changing anything.
- **summon tag only sticks to the last-hit enemy** (whip tag semantics) and sentry arena rules — Tree's tag fields exist; exact multi-tag stacking differs by version.

Video-sweep observations (bounded pass, 18 items — details & citations in `wiki-notes/video/sweep-notes.md`):
- **Flail return-contact multi-hit** ("throw behind a line of enemies → retract through them all") is a signature feel; Tree's return loop exists, the retract-through-hit is the checkable part.
- **Whip system evidence** (GrobeMan full guide transcript): minion-direction on hit, ~4 s tag window, damage falloff per pierced target, whips couple to melee-speed modifiers despite summon damage class, debuff-immune bosses ignore tags — all map 1:1 onto Tree's `tagDamage/tagDuration/tagExplosive` fields; only cadence values differ.
- **Terrain-rain cursor steering** (Daedalus Stormbow lowers arrow density by raising the cursor) — validate Tree's terrain-mode feel against this.
- **Progression skips are vanilla-legit** (Tsunami/Daedalus obtainable early-HM by pre-mech Fishron/Mimic kills) — Tree must either allow these skips or consciously gate them.
- **Endgame identity examples**: Megashark ammo-economy (50% non-consume) vs Uzi high-velocity synergy; Last Prism 6→1 beam convergence; Stardust Dragon per-summon length growth — all are qualitative anchors when retuning Tree endgame numbers.
- **1.4.5 drift surfaced by the videos**: Eye of Cthulhu yoyo 1.4.5.7 rework; whips doubled 9→18; Light's Bane dark-slash added — DB/Page caches hold both bases; pick one Tree baseline.

## 4. Terraria items Tree doesn't have (stage gaps)

Full lists: `stage-gaps.md`. Counts: 26 melee, 3 ranged, 60 boss-summon items, 5 fishing rods, 55 mounts absent from Tree (mount/boss-summon lists are mostly acquisition-layer or novelty, not combat deficits). Combat-meaningful absences worth Sol's eye:

- **Melee families with holes**: flails Blue Moon, The Meatball, Combat Wrench, Flaming Mace, Hive-Five, Fruitcake Chakram, Thorn Chakram; spears Mythril Halberd, Cobalt Naginata, Palladium Pike, Orichalcum Halberd, Ghastly Glaive, all 3 Jousting Lances; yoyos Code 1/Code 2/Format:C/Red's Throw; fists Golem Fist, Sergeant United Shield, Sawtooth Shark; Solar Eruption (lunar-era endgame). Note most of these are *rarity/era slots* rather than whole new mechanics — the engines for every family above already exist in Tree.
- **Fishing rods**: Reinforced, Fisher of Souls, Mechanic's, Sitting Duck's, Scarab — 5 mid-tier rods missing between Tree's wooden and Fiberglass/spectral set.
- **Terraria-only "ranged"**: Tree/World/Moon Globe are novelty scenery-change weapons, low priority.
- Stage labels in `stage-gaps.md` are name heuristics; verify rarity/era against wiki pages (available in `wiki-notes/pages/`) before scheduling.

## 5. Identity checks — all resolved (verified on live wiki during the full page pass)

| Tree item | Wiki verdict |
|---|---|
| Baby Eater (pet) | **=! exactly vanilla's Eater's Bone** (id 994) — Baby Eater redirects there; alias applied in the comparator |
| Wooden Dart (ammo) | No vanilla item/page by that name — Tree-invented tier name; vanilla darts are Poison/Crystal/Cursed/Ichor Dart. Decide one baseline (recommend aliasing both Tree wooden+venom darts onto Poison Dart). |
| Demonite Sword (melee) | No vanilla item — duplicate of Light's Bane with identical stats (16 dmg / 20 ticks / kb 5). Merge or differentiate (see 1b). |
| Meteorite Pickaxe | Vanilla name is Meteor Pickaxe (page exists); the master DB omits the record. Alias applied; stat row uses the wiki page in `wiki-notes/pages/meteorpickaxe.md`. |
| Candy Cane Bow | No vanilla item — Frost Legion has Candy Cane Sword + Pickaxe only. Tree-invented holiday weapon: keep consciously or remove. |

## 6. What this summary is NOT (honest limits)

- **Video watching:** a bounded video sweep was completed (18 representative items across all families/stages — `test-results/terraria-item-parity-20261102/wiki-notes/video/sweep-notes.md`): one YouTube demo/guide video per item, captions/transcripts captured, qualitative behavior recorded with citations. Visual frames cannot be decoded on this machine/network, so no frame-level timing claims exist anywhere. Expanding to every item is mechanical (the sweep tool is re-runnable; instructions in the README).
- **Per-item wiki coverage:** complete for the comparison queue (710/710 pages: every matched combat/tool item, every terra-only weapon/fishing rod, and every identity check). Not yet fetched: armor/accessory/potion/consumable sets Tree shares with vanilla but that weren't in the combat delta queue — if Sol touches those, fetch them with the same fetcher (it accepts any display name into its manifest).
- **1.4.4 vs 1.4.5:** master DB is 1.4.4-classic; live pages are 1.4.5.x. Flairon (132 vs 66 dual-mode) and the 1.4.5 yoyo/whip rebalances surfaced by the video sweep searches (`The Eye of Cthulhu` 1.4.5.7 rework, whips 9→18) are the known drift points — recommend picking one baseline before Sol retunes numbers.
- All work is research-only; Nov 1 combat-feel edits remain local and out of scope.
