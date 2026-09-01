# SESSION_STATE — Batch 77 (canonical Terraria stat parity)

> **STATUS: COMPLETE — merging to main.** This file is deleted in the merge commit.
> Final: 224 ENT_DEF entries, 158 weapons, 22 boss spawns, Prime arms, Destroyer/EoW segment pools, OOA roster, pillars, 17+ ammo types, and melee reach all set to canonical Terraria 1.4.4 classic values. Playtest 122/122 (2 green runs).

## Sources (committed under tools/canonical/)

- npcs.html + npcs.json — wiki List of NPCs parsed for the classic-mode column (757 rows incl. negative-ID variants). Parser handles m-normal/m-expert/m-master spans with Pre-Hardmode/Hardmode/Post-Plantera phase titles and m-all fallback.
- itemdata.lua + items-db.json — wiki Module:Iteminfo/data (full game item DB, 6196 entries, v1.4.5.7): damage, knockBack, useTime, useAnimation, mana, shootSpeed per item.
- boss-*.html — six boss infoboxes whose stat cells split prose (WoF/Plantera/Empress/Queen Slime/Deerclops/Queen Bee).
- canonicalize.py — the transform (entities/items/bosses/OOA + segment pools + Prime arms). Report in report.json.

## Key decisions

- speed = wiki useAnimation / 60 (engine semantics).
- Melee range: broadswords 4 tiles, shortswords 2.5, yoyos 12–16, flails 7–8, spears 4.5 (vanilla reach approximations by family).
- Destroyer: one shared 80k pool implemented as head 49000 + 62×500; EoW: 20×150 + 1500 head = 4500 total.
- Moon Lord as single entity: 145000 (head 45000 + core 50000 + 2×25000), dmg 50, def 50.
- Pillars: 20000 HP under the 15000 shield, 0 contact damage (guardians do the work) — canonical.
- Town NPCs reverted to hp 9999 / dmg 0 / def 99 after the canonicalizer caught them (engine uses hp≥9000 as the friendly flag) — a deliberate deviation from vanilla 250.
- No canonical row (left as-is): Pink Slime, Vile Flyer, Dungeon Scorpion, Pirate Shark, Wall Warrior, Martian Grunt, Marble Golem, Celestial Pillar, Goblin Summoner, Frog/Critter reskins, Guide (9999).

## Lessons (for future batches)

- Markdown export of wiki stat tables merges the three difficulty views ambiguously ("300004200053550") — always parse the raw HTML spans (m-normal/m-expert/m-master) or use Module:Iteminfo/data.
- The playtest B74 Piranha test needs `game.entities` cleared of strays before latching (leftover B73 spawn-test enemies steal the latch).
- ENT_DEF hp≥9000 doubles as the friendly-NPC flag — never canonicalize town NPC HP below 9000.
- Bestiary catalog auto-derives from ENT_DEF; species crossing the hp<9000 line change the count (B73 assertion tracks it).
