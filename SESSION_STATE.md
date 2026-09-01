# SESSION_STATE — Batch 79 (economy, world size, starters, rendering)

> Andre directive: fix shop prices (coin denominations), world size 1:1, vanilla starting items,
> and rebuild camera/view/lighting/minimap/fullmap. Full item catalog = NEXT work item, do NOT start it.
> Update at every checkpoint; commit + push. Never leave syntax-broken code uncommitted.

## Checkpoints

- [ ] C1 — Coin economy: copper/silver/gold/platinum coin items (1/100/10k/1M copper), shop prices from
      items-db `value` field, purchases/rewards/tax/death-loss/drops re-denominated.
- [ ] C2 — Vanilla starters: Copper Shortsword/Pickaxe/Axe + shortsword mechanic (rapid narrow thrust).
- [ ] C3 — World size 4200x2400 (vanilla small), worldgen proportionality audit, save payload check, perf pass.
- [ ] C4 — Camera/view/lighting/minimap/full-map rebuild: full-screen map (M key, pan+zoom), minimap polish,
      lighting perf at 10M tiles, render culling.
- [ ] C5 — playtest green, docs, merge to main, delete this file.

## Facts learned

- I.GOLD = Gold Ore (block), I.COIN = generic coin (Coin Gun ammo), I.PLATINUM = Platinum Ore. Currency today = Gold Ore counts.
- items-db.json has `value` per item (Terraria copper value, e.g. Copper Broadsword value 150? verify). Shop prices can be canonical.
- T.ETERNIASTAND=72 taken; HEARTCRYSTAL=77. Tile enum up to 76/77 — world-size work must not collide.
- Engine: TILE=16px, fixed 60fps step, camera centered on player (game.cam), lighting canvas-based per-column, minimap cached canvas (buildMinimap) — rebuild on world.dirty.
- Save payload: RLE tiles+walls+hp; current 1024x1000 ≈ 620KB; 4200x2400 ≈ 10x tiles → budget ~6MB; IndexedDB fine, D1 cloud sync may need review (BLOB limit ~? check _guard/save handler only if payload >15MB).
- Bestiary/playtest at 130 checks; B76 pool sweep and B78g depend on worldgen — recheck after world size change.

## Recovery

git status -sb on fidelity-79 → next unchecked C-item. `node tools/playtest.mjs` = 130 baseline (must stay green except count assertions we intentionally change).
