# SESSION_STATE — B83 Phase 2 (furniture, walls, blocks, materials)

> Continuing the full item catalog. Phase 1 (weapons/armor/accessories/potions/blocks) is done at 1,147 defs.
> Phase 2 target: remaining ~4,200 vanilla items — mostly furniture sets per wood type, decorative walls,
> world blocks, and niche materials.
> Update at every checkpoint; commit + push.

## Checkpoints

- [ ] D1 — Furniture sets: vanilla furniture = chair/table/door/piano/bathtub/bed/bookcase/candelabra/
      chandelier/lamp/lantern/clock/sofa/sink/toilet/dresser/piano per wood type + biome themes
      (Ebonwood, Shadewood, Rich Mahogany, Pearlwood, Boreal, Palm, Ash, Cactus, Slime, Bone, Glass,
      Nebula/Stardust/Solar/Vortex, Dungeon colors, Marble/Granite, Honey, Steampunk, Frozen, Ichor...).
      Strategy: generate furniture items per material family; furniture is decor-only (no gameplay hooks
      needed beyond placement — the engine supports type:'block' with a tile).
- [ ] D2 — Decorative walls (vanilla ~100 walls): craftable walls per material.
- [ ] D3 — World blocks (boreal/palm/ash wood, sandstone variants, snow bricks, gem blocks, etc.).
- [ ] D4 — Niche materials (Rotten Chunk, Vertebra,Antlion Mandible, Feather, Black Lens, banners? no, etc.)
- [ ] D5 — Tile rendering: furniture uses furniture tile sprites; walls use wall rendering. Generate
      procedural sprite colors per material family rather than unique art per item.
- [ ] D6 — Recipes: each furniture piece craftable from its material at the right station; walls from
      their block at a workbench.
- [ ] D7 — playtest green + docs + merge.

## Technical approach

- New tiles: use T.BOOK-style tile pattern — one generic FURNITURE tile per piece kind, with material
  color variants driven by item data, OR just add per-item tiles. Simplest robust approach: single
  T.FURNITURE tile (like T.PYLON for all pylons) + item.tileStyle to select sprite color. Add new
  furniture tiles for: CHAIR(furniture), TABLE(f), PIANO, BATHTUB, BOOKCASE, CANDELABRA, CHANDELIER,
  LAMP, LANTERN, CLOCK, SOFA, SINK, TOILET, DRESSER, WARDROBE.
- Walls: existing WALL enum has NONE/DIRT/STONE/WOOD/CAVE. Add WALL.WOOD2? Actually decorative walls can
  use a new WALL.PLACED_DECO with per-item color — but walls are per-tile not per-item. Vanilla stores
  wall type per tile. Current engine: walls array is Uint8 with only 5 wall types. Adding 100 wall types
  means extending the wall array — need a second byte per tile for material variant. Simpler: walls added
  as items but placed via the existing wall system with a small set of generic deco wall ids (extend
  WALL enum to ~16 with a palette). Go with: extend WALL enum by 12 generic deco walls (wood deco, brick
  deco, stone deco, etc.) with MINIMAP/WALL_COLORS.

## Recovery

git status -sb on b83-phase2 → next unchecked D-item. `node tools/playtest.mjs` = 127 baseline.
