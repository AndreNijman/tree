# SESSION_STATE — Batch 78+ (full Terraria 1:1 fidelity)

> Long autonomous run. Andre is away; goal: "the entire game is just like Terraria one to one."
> Update this file at every checkpoint; commit + push after every checkpoint. Never leave uncommitted syntax-broken code.

## Priority queue (work top-down; check off as completed)

^- [ ] B78a — Player physics canonical: gravity, jump height, run/walk speeds, fall damage threshold (25 tiles), post-hit invulnerability (2/3s), potion sickness (60s), mana regen, health regen.
^- [ ] B78b — Enemy knockback-resistance wired from wiki data (kbResist on ENT_DEF, applied in hitEntity).
^- [ ] B78c — Day/night length canonical (Terraria: 15 min day + 9 min night = 24 min cycle), dawn 4:30 AM / dusk 7:30 PM.
^- [ ] B78d — Spawn system canonical: max 5 hostile ambient enemies, spawn cadence + depth/biome rate scaling.
^- [ ] B78e — Weapon autoswing flags from items DB (autoReuse), magic mana costs re-verified, Melee/weapon hitbox sizes.
^- [ ] B78f — playtest green + docs + merge.
- [ ] B79 — remaining vanilla roster (Hoplite, Icy Merman, Giant Shelly, Floaty Gross, Sand Poacher, Desert Spirit, Tomb Crawler, Sand Shark family, Anomura Fungus, Fungo Fish, Skeleton Merchant w/ shop, Rock Golem, Possessed Armor, Wandering Eye, Rune Wizard, Enchanted Sword NPC, Angry Trapper, Illuminant Bat/Slime, Ghoul family, Lamia, Beetle trio, world Feeder, Blood Jelly, Blood Feeder, Corrupt Goldfish/Bunny/Penguin blood-moon variants).
- [ ] B80 — vanilla event/invasion roster audit vs EVENT_WAVES; spawn conditions 1:1 (Blood Moon chance, eclipse chance, pirate map drop rates etc.).
- [ ] B81 — shop prices to canonical coin values (Gold Ore currency mapping), NPC happiness thresholds.
- [ ] B82 — world gen dimensions 1:1 (world size 8400x2400 tiles / small, jungle/corruption/dungeon sizes and positions).
- [ ] B83 — full item catalog audit vs vanilla (missing weapons/tools/accessories/potions; ~500 more items in vanilla).

## Engine mapping facts (verified)

- TILE = 16px; 1 tile = 2 ft; Terraria speeds: base walk 15 mph = 3 px/frame; run with Hermes = 6.5? (Hermes +40%).
- Terraria gravity ≈ 0.4 px/frame²; max fall speed 10 px/frame (= 600 px/s); jump v0 ≈ 8.5 (reaches ~6 tiles with 4-block... verify by feel).
- Invulnerability after damage = 40 frames (2/3 s). Potion sickness = 60 s (3600 frames).
- Day = 15 min (54000 frames), night = 9 min (32400 frames). Dawn 4:30, dusk 19:30.
- Enemy KB resist column exists in npcs.json (not yet parsed — KB resist spans like "50%/55%/60%", first value = classic).

## Data sources already on disk (tools/canonical/)

npcs.json (incl. kbResist? NO — only hp/dmg/def parsed; kb resist needs re-parse if needed), items-db.json (autoReuse flags present), npcs.html (has KB resist column if needed).

## Recovery

git status -sb (branch fidelity-78) → read Checkpoints → next unchecked. `node tools/playtest.mjs` = 122 baseline. node --check js/*.js before any commit. Push every checkpoint.
