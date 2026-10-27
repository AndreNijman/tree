// B6 iconic wire batch verification (AUDIT-2026-10-23 B6): the named catalog
// ghosts now have acquisition paths, exercised through real code paths where
// possible:
//   1. Zenith forged end-to-end from its 14 sourced swords (craftRecipe)
//   2. Accessory chains craft end-to-end: GPS -> Cell Phone, Ankh Charm ->
//      Ankh Shield, Master Ninja Gear, Enchanted Sword
//   3. Drill tier recipes exist and craft (uniform anvil, hm/mech-gated)
//   4. Falcon Blade drops from higher-tier crates (openCrate)
//   5. Crystal Serpent caught in Hallow fishing (rollFish)
//   6. Hermes Boots / Gladiator armor appear in generated chest unions
//   7. Merchant sells Katana + Tiger Climbing Gear after any boss
// Station-dependent recipes are exercised after really placing a Workbench and
// an Anvil adjacent to the player (placeSpecial + findStations scan, as the
// game loop does each frame).
import { setupAudit, check, note, assertNoBrowserErrors, finish } from './lib.mjs';

const { browser, page, results } = await setupAudit();

const data = await page.evaluate(() => {
  const out = { errors: [] };
  const inv = game.player.inventory;
  const grant = (id, n) => inv.add(id, n);
  const have = (id) => {
    var slots = inv.slots || [];
    var n = 0;
    for (var i = 0; i < slots.length; i++) if (slots[i] && slots[i].id === id) n += slots[i].count;
    return n;
  };
  const clearAll = () => { for (var i = 0; i < inv.slots.length; i++) inv.slots[i] = null; };
  const findRecipe = (name) => RECIPES.find(function(r) { return r.name === name; });
  const rescanStations = () => { game.world.nearbyStations = game.world.findStations(game.player.x, game.player.y); };
  const tryCraft = (name) => {
    var r = findRecipe(name);
    if (!r) return { ok: null, err: 'recipe not found: ' + name };
    try {
      var ok = craftRecipe(game, r);
      if (!ok) {
        return {
          ok: false,
          err: 'craftRecipe false',
          st: stationsForPlayer(game),
          mats: r.mat.map(function(m) { return { need: m[1], have: inv.countOf(m[0]), id: m[0] }; })
        };
      }
      return { ok: true };
    } catch (e) { return { ok: false, err: 'threw: ' + e.message }; }
  };

  // probe fixture state: hardmode + mech/plantera progression on so gated
  // recipes are craftable (ectoplasm recipes auto-gate after:'plantera')
  game.hardmode = true;
  game.mechDone = true;
  if (!game.bossesDefeated) game.bossesDefeated = {};
  game.bossesDefeated.plantera = true;

  // ---- 0. Station setup: really place a Workbench and an Anvil near the player ----
  try {
    clearAll();
    grant(I.WOOD, 10);
    out.bench = tryCraft('Workbench');
    rescanStations();
    grant(I.IRONBAR, 5);
    out.anvilPlace = tryCraft('Anvil');
    rescanStations();
    out.stations = stationsForPlayer(game);
  } catch (err) { out.errors.push('station: ' + err.message); }

  // ---- 1. Zenith end-to-end ----
  try {
    var zr = findRecipe('Zenith');
    out.zenithRecipe = zr ? { mats: zr.mat.length, station: zr.station } : null;
    clearAll();
    var zMats = [['COPPERSHORT',1],['STARFURY',1],['ENCHANTED_SWORD',1],['BEE_KEEPER',1],['MURAMASA',1],
      ['BLADE_OF_GRASS',1],['VOLCANO',1],['FALCON_BLADE',1],['MEOWMERE',1],['STAR_WRATH',1],
      ['TERRARIAN',1],['SEEDLER',1],['THEHORSEMANSBLADE',1],['INFLUXWAVER',1]];
    zMats.forEach(function(m) { grant(I[m[0]], m[1]); });
    out.zenithCrafted = tryCraft('Zenith');
    out.zenithInInv = have(I.ZENITH);
  } catch (err) { out.errors.push('zenith: ' + err.message); }

  // ---- 2. Accessory chains end-to-end ----
  try {
    clearAll();
    rescanStations(); // keep the placed workbench + anvil visible
    // Enchanted Sword: anvil recipe from silver sword + stars
    grant(I.SILVERSWORD, 1); grant(I.FALLENSTAR, 8);
    out.enchCrafted = tryCraft('Enchanted Sword');
    out.enchInInv = have(I.ENCHANTED_SWORD);
    // GPS -> Cell Phone chain
    grant(I.COMPASS, 1); grant(I.DEPTH_METER, 1); grant(I.GOLDBAR, 8);
    out.gpsCrafted = tryCraft('GPS');
    grant(I.FISHERMANSPOCKETGUIDE, 1); grant(I.WEATHERRADIO, 1); grant(I.SEXTANT, 1);
    out.phoneCrafted = tryCraft('Cell Phone');
    out.phoneInInv = have(I.CELL_PHONE);
    // Ankh chain: charm -> (Obsidian Shield pre-existing anvil recipe) -> Ankh Shield
    grant(I.NAZAR, 1); grant('adhesivebandage', 1); grant(I.MEGAPHONE, 1); grant(I.VITAMINS, 1);
    out.charmCrafted = tryCraft('Ankh Charm');
    grant(I.OBSIDIAN, 25); grant(I.COBALTBAR, 5);
    out.obsShieldCrafted = tryCraft('Obsidian Shield');
    out.ankhShieldCrafted = tryCraft('Ankh Shield');
    out.ankhShieldInInv = have(I.ANKHSHIELD);
    // Master Ninja Gear (re-matted pre-existing recipe, station 'none')
    clearAll();
    rescanStations();
    grant(I.TABI, 1); grant(I.BLACKBELT, 1); grant(I.TIGER_CLIMBING_GEAR, 1);
    out.mngCrafted = tryCraft('Master Ninja Gear');
    out.mngInInv = have(I.MASTERNINJAGEAR);
  } catch (err) { out.errors.push('chains: ' + err.message); }

  // ---- 3. Drill tier ----
  try {
    clearAll();
    rescanStations();
    var drillNames = ['Cobalt Drill','Palladium Drill','Mythril Drill','Orichalcum Drill','Adamantite Drill',
      'Titanium Drill','Chlorophyte Drill','Shroomite Digging Claw','Spectre Pickaxe','Solar Flare Drill',
      'Vortex Drill','Nebula Drill','Stardust Drill','Drill Containment Unit'];
    out.drillsMissing = drillNames.filter(function(n) { return !findRecipe(n); });
    // one ore drill + the claw/pick/DCU through the real path (anvil where needed)
    grant(I.COBALTBAR, 15);
    out.cobaltCrafted = tryCraft('Cobalt Drill');
    out.cobaltInInv = have(I.COBALT_DRILL);
    clearAll();
    rescanStations();
    grant(I.CHLOROPHYTEBAR, 18 + 12 + 18); grant(I.MUSHROOM, 40); grant(I.ECTOPLASM, 10);
    out.clawCrafted = tryCraft('Shroomite Digging Claw');
    out.pickCrafted = tryCraft('Spectre Pickaxe');
    out.dcuCrafted = tryCraft('Drill Containment Unit');
    out.dcuInInv = have(I.DRILL_CONTAINMENT_UNIT);
  } catch (err) { out.errors.push('drills: ' + err.message); }

  // ---- 4. Falcon Blade via crates ----
  try {
    var falcon = 0;
    for (var ci = 0; ci < 300; ci++) {
      var loot = openCrate(3);
      for (var li = 0; li < loot.length; li++) if (loot[li].id === I.FALCON_BLADE) falcon++;
    }
    out.falconOpens = 300; out.falconDrops = falcon;
  } catch (err) { out.errors.push('crates: ' + err.message); }

  // ---- 5. Crystal Serpent via Hallow fishing ----
  try {
    var mockGame = { world: { biomeAt: function() { return BIOME.HALLOW; }, isUnderground: function() { return false; } } };
    var f = { lava: false, bobX: 100, bobY: 100, power: 60 };
    var serpent = 0, tetra = 0;
    for (var fi = 0; fi < 300; fi++) {
      var got = rollFish(mockGame, f);
      if (got === I.CRYSTAL_SERPENT) serpent++;
      if (got === I.FISH_NEONTETRA) tetra++;
    }
    out.serpentRolls = 300; out.serpentCatches = serpent; out.tetraCatches = tetra;
  } catch (err) { out.errors.push('fish: ' + err.message); }

  // ---- 6. Generated chest union: Hermes Boots + Gladiator pieces ----
  try {
    out.chestUnion = (function() {
      var plans = [
        { seed: 7358, evil: 'corrupt' }, { seed: 4242, evil: 'crimson' },
        { seed: 90, evil: 'corrupt' }, { seed: 555, evil: 'crimson' },
        { seed: 1337, evil: 'corrupt' }, { seed: 8281, evil: 'crimson' }
      ];
      var hermes = 0, gladiator = { helmet: 0, breast: 0, legs: 0 }, marbleChests = 0, gens = 0;
      for (var g = 0; g < plans.length; g++) {
        try {
          var w2 = new World(WORLD_W, WORLD_H, plans[g].seed, 'normal');
          w2.generate(false, plans[g].evil);
          gens++;
          var ch2 = w2.chests || [];
          for (var c = 0; c < ch2.length; c++) {
            var inv2 = ch2[c].inv || [];
            for (var s = 0; s < inv2.length; s++) {
              var sid = inv2[s] && inv2[s].id;
              if (sid === I.HERMES_BOOTS) hermes++;
              if (sid === I.GLADIATOR_HELMET) { gladiator.helmet++; marbleChests++; }
              if (sid === I.GLADIATOR_BREASTPLATE) { gladiator.breast++; marbleChests++; }
              if (sid === I.GLADIATOR_LEGGINGS) { gladiator.legs++; marbleChests++; }
            }
          }
        } catch (err2) { gens += 0; }
      }
      return { gens: gens, hermes: hermes, gladiator: gladiator, marbleChests: marbleChests };
    })();
  } catch (err) { out.errors.push('chests: ' + err.message); }

  // ---- 7. Merchant rows + component drop wiring (data-level) ----
  try {
    var rows = TOWN_SHOPS[E.MERCHANT] || [];
    out.katanaRow = rows.filter(function(r) { return r.item === I.KATANA; }).map(function(r) { return { cost: r.cost, gate: r.gate }; })[0] || null;
    out.tigerRow = rows.filter(function(r) { return r.item === I.TIGER_CLIMBING_GEAR; }).map(function(r) { return { cost: r.cost, gate: r.gate }; })[0] || null;
    out.laserRow = rows.filter(function(r) { return r.item === I.LASERDRILL; }).map(function(r) { return { cost: r.cost, gate: r.gate }; })[0] || null;
    var skull = B83_ENEMY_DROPS['Cursed Skull'] || [];
    out.nazarWired = skull.some(function(d) { return d.id === I.NAZAR; });
    out.tabiWired = skull.some(function(d) { return d.id === I.TABI; });
    var jCreep = (B83_ENEMY_DROPS['Jungle Creeper'] || []);
    out.megaphoneWired = jCreep.some(function(d) { return d.id === I.MEGAPHONE; });
    var skel = (B83_ENEMY_DROPS['Skeleton'] || []);
    out.vitaminsWired = skel.some(function(d) { return d.id === I.VITAMINS; });
    var face = (B83_ENEMY_DROPS['Face Monster'] || []);
    out.bandageWired = face.some(function(d) { return d.id === 'adhesivebandage'; });
    var cbat = (B83_ENEMY_DROPS['Cave Bat'] || []);
    var worm = (B83_ENEMY_DROPS['Giant Worm'] || []);
    out.depthWired = cbat.some(function(d) { return d.id === I.DEPTH_METER; });
    out.compassWired = worm.some(function(d) { return d.id === I.COMPASS; });
  } catch (err) { out.errors.push('data: ' + err.message); }

  out.zenithType = (ITEMS[I.ZENITH] || {}).type;
  return out;
});

// ---- assertions ----
check(results, 'Workbench + Anvil placed adjacently and registered as available stations',
  data.bench && data.bench.ok && data.anvilPlace && data.anvilPlace.ok && data.stations && data.stations.anvil,
  { bench: data.bench, anvil: data.anvilPlace, stations: data.stations });
check(results, 'Zenith recipe exists from 14 sourced swords (no station needed)',
  data.zenithRecipe && data.zenithRecipe.mats === 14 && data.zenithRecipe.station === 'none', data.zenithRecipe);
check(results, 'Zenith forged end-to-end through craftRecipe and lands in inventory',
  data.zenithCrafted && data.zenithCrafted.ok === true && data.zenithInInv === 1,
  { crafted: data.zenithCrafted, inInv: data.zenithInInv });
check(results, 'Zenith def upgraded from placeholder material to a real melee weapon',
  data.zenithType === 'melee', { type: data.zenithType });
check(results, 'Enchanted Sword crafts from Silver Sword + Fallen Stars (anvil)',
  data.enchCrafted && data.enchCrafted.ok === true && data.enchInInv === 1,
  { crafted: data.enchCrafted, inInv: data.enchInInv });
check(results, 'GPS crafts and Cell Phone assembles from GPS + angler trio',
  data.gpsCrafted && data.gpsCrafted.ok && data.phoneCrafted && data.phoneCrafted.ok && data.phoneInInv === 1,
  { gps: data.gpsCrafted, phone: data.phoneCrafted, inInv: data.phoneInInv });
check(results, 'Ankh chain crafts end-to-end: Charm -> Obsidian Shield -> Ankh Shield',
  data.charmCrafted && data.charmCrafted.ok && data.obsShieldCrafted && data.obsShieldCrafted.ok &&
  data.ankhShieldCrafted && data.ankhShieldCrafted.ok && data.ankhShieldInInv === 1,
  { charm: data.charmCrafted, obs: data.obsShieldCrafted, ankh: data.ankhShieldCrafted, inInv: data.ankhShieldInInv });
check(results, 'Master Ninja Gear crafts from Tabi + Black Belt + Tiger Climbing Gear',
  data.mngCrafted && data.mngCrafted.ok === true && data.mngInInv === 1,
  { crafted: data.mngCrafted, inInv: data.mngInInv });
check(results, 'Full drill tier has recipes (14 entries, none missing)',
  data.drillsMissing && data.drillsMissing.length === 0, { missing: data.drillsMissing });
check(results, 'Cobalt Drill crafts; Shroomite Claw + Spectre Pick feed the DCU end-to-end',
  data.cobaltCrafted && data.cobaltCrafted.ok && data.cobaltInInv === 1 && data.clawCrafted && data.clawCrafted.ok &&
  data.pickCrafted && data.pickCrafted.ok && data.dcuCrafted && data.dcuCrafted.ok && data.dcuInInv === 1,
  { cobalt: data.cobaltCrafted, claw: data.clawCrafted, pick: data.pickCrafted, dcu: data.dcuCrafted, inInv: data.dcuInInv });
check(results, 'Falcon Blade drops from opened tier>=2 crates (300 opens)',
  data.falconDrops >= 1, { opens: data.falconOpens, drops: data.falconDrops });
check(results, 'Crystal Serpent caught while Hallow fishing (300 rolls; Neon Tetra still normal)',
  data.serpentCatches >= 1 && data.tetraCatches >= 1,
  { serpent: data.serpentCatches, tetra: data.tetraCatches });
check(results, 'Generated chest unions contain Hermes Boots (6 fresh worlds)',
  data.chestUnion && data.chestUnion.hermes >= 1, data.chestUnion);
check(results, 'Gladiator armor pieces found in marble-pocket chests across generations',
  data.chestUnion && data.chestUnion.gladiator.helmet >= 1 && data.chestUnion.gladiator.breast >= 1 &&
  data.chestUnion.gladiator.legs >= 1, data.chestUnion && data.chestUnion.gladiator);
check(results, 'Merchant now sells Katana, Tiger Climbing Gear, Laser Drill (boss-gated)',
  data.katanaRow && data.katanaRow.gate === 'anyBoss' && data.tigerRow && data.tigerRow.gate === 'anyBoss' &&
  data.laserRow && data.laserRow.gate === 'anyMech',
  { katana: data.katanaRow, tiger: data.tigerRow, laser: data.laserRow });
check(results, 'Accessory-chain components wired into enemy drop buckets (1% style)',
  data.nazarWired && data.tabiWired && data.megaphoneWired && data.vitaminsWired && data.bandageWired &&
  data.depthWired && data.compassWired,
  { nazar: data.nazarWired, tabi: data.tabiWired, megaphone: data.megaphoneWired, vitamins: data.vitaminsWired,
    bandage: data.bandageWired, depth: data.depthWired, compass: data.compassWired });

note(results, 'Chest union detail: gens=' + (data.chestUnion ? data.chestUnion.gens : '?') +
  ', hermes=' + (data.chestUnion ? data.chestUnion.hermes : '?') +
  ', marbleChests=' + (data.chestUnion ? data.chestUnion.marbleChests : '?') +
  ', pieces=' + (data.chestUnion ? JSON.stringify(data.chestUnion.gladiator) : '?'));

if (data.errors.length) {
  note(results, 'IN-PAGE ERRORS: ' + data.errors.join(' | '));
}

await assertNoBrowserErrors(results);
await finish(results, browser, 'b6icons');
