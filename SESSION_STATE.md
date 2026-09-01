# SESSION_STATE — B83 (full item catalog)

> Andre: "I want the FULL GAME" — expand from ~716 items toward vanilla's catalog.
> Full item catalog = this batch. Update at every checkpoint; commit + push.

## Strategy

Vanilla ~5,000 items. Realistic plan: add the missing content in coherent batches by category,
each with defs + acquisition + tests. Priority order (gameplay impact):

1. [ ] C1 — Missing pre-HM weapons & tools (shortswords all ores, boomerangs, spears, flails, throwing, yoyo tree, Gem Staves, Space Gun pair, etc.)
2. [ ] C2 — Missing armor sets (Shadow/Crimtane already? — audit; Ninja, Necro, Jungle, Bee,Obsidian, Sponge? — audit which sets are missing and add)
3. [ ] C3 — Missing accessories (movement: Hermes Boots, Cloud in a Bottle, Shackle...; info: Radar, DPS meter; Lucky Horseshoe etc. — audit what's missing)
4. [ ] C4 — Missing potions & consumables (full vanilla potion set: Endurance, Ironskin, Regeneration, Swiftness, Night Owl, Archery, etc. + food)
5. [ ] C5 — Missing Hardmode weapons (pre-mech/mech/post-plantera tiers, all classes)
6. [ ] C6 — Missing blocks/walls/furniture + paint/wires/terraform items
7. [ ] C7 — Missing vanity/mount/hook/misc + achievement hooks
8. [ ] C8 — playtest green + docs + merge

## Facts

- defItem lives in js/items.js (I enum + defs), recipes in js/crafting.js, drops in js/entities.js/bosses.js, shop stock in TOWN_SHOPS (main.js).
- I enum count assertion: playtest "Items: I enum matches ITEMS map (N items)" — N auto-computed, fine.
- Item values: js/values.js ITEM_VALUES[name-lower] for shop pricing of new stock.
- Every new def needs an acquisition path (Batch 57 audit rule): recipe, drop, chest, shop, or TILE_DROP.
- Engine types: melee/ranged/magic/summon/summonstaff/whip/tool/consumable/material/accessory/block/wall/ammo/bait/dye/hook/mount/pet/lightpet/eventitem/bag/pylon/dye...
- Melee family flags: meleeMode 'spear'|'flail'|'yoyo'|'controlled', shortSword, meleeProj, projPersistent.
- canon sources: tools/canonical/items-db.json (all stats incl. useTime/kb/mana), item-values.json (shop price).
- Bestiary count assertion breaks when enemies added — items don't affect it.

## Recovery

git status -sb on b83-catalog → next unchecked C-item. `node tools/playtest.mjs` = 127 baseline.
Never commit syntax-broken code. Push every checkpoint.
