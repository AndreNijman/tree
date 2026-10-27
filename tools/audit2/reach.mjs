// B6 reachability probe: which of the 5,557 items have ANY acquisition path?
// Sources enumerated from the live runtime data + hardcoded code drop lists
// (fishing table, crate matrix, angler rewards, starter kit) + mining yields
// (TILE_DROP) + the generated world's actual chest contents. Then a fixpoint
// over RECIPES closes the crafting dependency graph. The output is the exact
// cut-candidate list for the B6 decision — it changes no game state.
import { setupAudit, check, note, assertNoBrowserErrors, finish } from './lib.mjs';
import { readFileSync } from 'fs';
import path from 'path';

// Hardcoded acquisition channels that no data table holds, harvested from the
// source so the probe stays in sync without hand-maintained lists:
//  - dropTable(): entities.js switch of conditional enemy drops (souls, ectoplasm…)
//  - killBoss(): bosses.js boss-reward hub (all boss ores/souls/weapons, incl. ternaries)
//  - grant lines: addPickup()/inventory.add(I.*) literals (torch god favor, strange
//    plants, fallen stars, OOA completion rewards, evil-orb ore…)
//  - onSpecialTileBroken(): orb-smash loot referenced via var (lootCorrupt/lootCrimson)
function tokensFrom(body) {
  const out = new Set();
  const re = /I\.([A-Z0-9_]+)/g;
  let m;
  while ((m = re.exec(body))) out.add(m[1]);
  return Array.from(out);
}
const TOKENS = (function() {
  const read = (f) => readFileSync(path.join(process.cwd(), 'js', f), 'utf8');
  const span = (src, start, end) => {
    const i = src.indexOf(start);
    return i >= 0 ? src.slice(i, src.indexOf(end, i)) : '';
  };
  const ent = read('entities.js');
  const bosses = read('bosses.js');
  const main = read('main.js');
  const dropTable = tokensFrom(span(ent, 'function dropTable', '\n}'));
  const killBoss = tokensFrom(span(bosses, 'function killBoss', '\n}'));
  const grant = [];
  for (const f of ['main.js', 'player.js', 'bosses.js', 'entities.js', 'oldonesarmy.js']) {
    for (const line of read(f).split('\n')) {
      if (/addPickup\(/.test(line) || /\.(add)\(I\./.test(line)) grant.push(...tokensFrom(line));
    }
  }
  const orbLoot = tokensFrom(span(main, 'game.onSpecialTileBroken = function', '\n  };'));
  return {
    dropTable,
    killBoss,
    grant: Array.from(new Set(grant)),
    orbLoot
  };
})();

const { browser, page, results } = await setupAudit();

const data = await page.evaluate((TOKENS) => {
  // ---- source enumeration ----
  var sources = {};      // id -> 'source description'
  var invalid = {};      // referenced ids that are not defined in ITEMS
  function addSrc(id, why) {
    if (!id || typeof id !== 'string') return;
    if (!ITEMS[id]) { invalid[id] = why; return; }
    if (!sources[id]) sources[id] = why;
  }
  var addList = function(arr, why) { (arr || []).forEach(function(x) { addSrc(x, why); }); };

  // starter kit
  addList([I.COPPERSHORT, I.COPPERPICK, I.COPPERAXE], 'starter kit');
  // mining any worldgen tile yields its TILE_DROP
  (function() { for (var t in TILE_DROP) addSrc(TILE_DROP[t], 'tile drop ' + t); })();
  // actual chest contents of the generated world (ground truth incl. island/evil/sky/dungeon chests).
  // LOCKED chests (shadow chests) are held back: their contents only become
  // acquirable if the key item is itself acquirable — checked after closure.
  var lockedBags = [];
  (function() {
    var ch = game.world.chests || [];
    for (var c = 0; c < ch.length; c++) {
      var chest = ch[c];
      var inv = chest.inv || [];
      if (chest.locked && chest.key) {
        lockedBags.push({ key: chest.key, inv: inv.map(function(s) { return s && s.id; }).filter(Boolean) });
        continue;
      }
      for (var s = 0; s < inv.length; s++) if (inv[s]) addSrc(inv[s].id, 'generated chest');
    }
  })();
  // conditional chest loot varies per seed (dungeon items at 40% odds, shadow
  // chests at 30%, one-of-four underworld loot arrays) — union several fresh
  // generations (both evil worlds) so a "possible" chest drop never looks unreachable
  var chestGenFailed = 0, chestGens = 0;
  (function() {
    var plans = [
      { seed: 7358, evil: 'corrupt' }, { seed: 4242, evil: 'crimson' },
      { seed: 90, evil: 'corrupt' }, { seed: 555, evil: 'crimson' },
      { seed: 1337, evil: 'corrupt' }, { seed: 8281, evil: 'crimson' }
    ];
    for (var gi = 0; gi < plans.length; gi++) {
      chestGens++;
      try {
        var w2 = new World(WORLD_W, WORLD_H, plans[gi].seed, 'normal');
        w2.generate(false, plans[gi].evil);
        var ch2 = w2.chests || [];
        for (var c2 = 0; c2 < ch2.length; c2++) {
          var chest2 = ch2[c2];
          var inv2 = chest2.inv || [];
          if (chest2.locked && chest2.key) {
            lockedBags.push({ key: chest2.key, inv: inv2.map(function(s2b) { return s2b && s2b.id; }).filter(Boolean) });
            continue;
          }
          for (var s2 = 0; s2 < inv2.length; s2++) if (inv2[s2]) addSrc(inv2[s2].id, 'generated chest (seed ' + plans[gi].seed + ')');
        }
      } catch (err) { chestGenFailed++; }
    }
  })();
  // enemy + boss drop tables
  (function() {
    for (var k in B83_ENEMY_DROPS) (B83_ENEMY_DROPS[k] || []).forEach(function(d) { addSrc(d.id, 'drop ' + k); });
    for (var k2 in B83_BOSS_DROPS) (B83_BOSS_DROPS[k2] || []).forEach(function(d) { addSrc(d, 'boss drop ' + k2); });
  })();
  // town shops + tavernkeep
  (function() {
    for (var npc in TOWN_SHOPS) (TOWN_SHOPS[npc] || []).forEach(function(row) {
      if (row && row.item) addSrc(row.item, 'shop ' + npc);
    });
    (typeof TAVERNKEEP_SHOP !== 'undefined' ? TAVERNKEEP_SHOP : []).forEach(function(row) {
      if (row && row.item) addSrc(row.item, 'tavernkeep shop');
    });
  })();
  // fishing roll table + crate matrix + angler milestone rewards (hardcoded in player.js/main.js)
  addList([I.GOLDENCRATE, I.IRONCRATE, I.WOODENCRATE, I.ZEPHYRFISH, I.FISH_BASS, I.FISH_TROUT, I.FISH_SALMON,
    I.FISH_NEONTETRA, I.FISH_EBONKOI, I.FISH_CRIMSONTIGER, I.FISH_CAVEFISH, I.FISH_PUFFER, I.FISH_FLOUNDER,
    I.FISH_ROCKFISH, I.CRYSTAL_SERPENT], 'fishing rolls');
  addList([I.IRON, I.COBALT, I.MYTHRIL, I.ADAMANTITE, I.TITANIUM, I.ORICHALCUM, I.PALLADIUM, I.CHLOROPHYTE,
    I.HEALINGPOTION, I.GLOWSTONE, I.COIN, I.ROCKET1, I.COBALTBAR, I.FALCON_BLADE], 'crate loot');
  addList([I.NIGHTCRAWLER, I.FISHINGPOTION, I.FISHERMANSPOCKETGUIDE, I.WEATHERRADIO, I.SEXTANT,
    I.ANGLEREARRING, I.HOTLINEFISHINGHOOK, I.TACKLEBOX], 'angler quest rewards');
  // gold coins exist as a currency drop from enemies (all coin tiers via boss/enemy coin tables)
  addList([I.SILVERCOIN, I.GOLDCOIN, I.PLATINUMCOIN], 'coin drops');

  // token lists parsed from source: dropTable switch, killBoss rewards,
  // addPickup/inventory.add grant lines, orb-smash loot arrays
  (function() {
    var groups = [
      ['dropTable()', TOKENS.dropTable], ['killBoss()', TOKENS.killBoss],
      ['grant lines', TOKENS.grant], ['orb smash loot', TOKENS.orbLoot]
    ];
    for (var g = 0; g < groups.length; g++) {
      var why = groups[g][0], toks = groups[g][1] || [];
      for (var ti = 0; ti < toks.length; ti++) addSrc(I[toks[ti]], why);
    }
  })();

  // ---- crafting closure fixpoint ----
  var missing = []; // recipes whose ingredients are (still) unreachable
  var changed = true, passes = 0;
  function closurePass() {
    changed = true; passes++;
    while (changed) {
      changed = false; passes++;
      RECIPES.forEach(function(r) {
        if (sources[r.result]) return;
        var mats = r.mat || [];
        var ok = true;
        for (var i = 0; i < mats.length; i++) if (!sources[mats[i][0]]) { ok = false; break; }
        if (ok && mats.length > 0) { sources[r.result] = 'craft'; changed = true; }
      });
    }
  }
  closurePass();
  // release locked chests whose key is acquirable (key is reusable, not consumed —
  // needs only 1 copy in inventory), then re-run the closure
  var released = 0;
  for (var rel = 0; rel < 5; rel++) {
    var openedNow = false;
    for (var lb = 0; lb < lockedBags.length; lb++) {
      if (lockedBags[lb].released) continue;
      if (sources[lockedBags[lb].key]) {
        lockedBags[lb].released = true;
        released++;
        openedNow = true;
        for (var li = 0; li < lockedBags[lb].inv.length; li++) addSrc(lockedBags[lb].inv[li], 'unlocked chest');
      }
    }
    if (openedNow) closurePass(); else break;
  }
  var sealedItems = [];   // unreachable contents of chests whose keys never became reachable
  var sealedOk = [];      // sealed-chest contents that are still obtainable elsewhere
  for (var sb = 0; sb < lockedBags.length; sb++) {
    if (lockedBags[sb].released) continue;
    for (var si2 = 0; si2 < lockedBags[sb].inv.length; si2++) {
      var sid = lockedBags[sb].inv[si2];
      if (!sid || sealedItems.indexOf(sid) >= 0 || sealedOk.indexOf(sid) >= 0) continue;
      if (sources[sid]) sealedOk.push(sid); else sealedItems.push(sid);
    }
  }
  RECIPES.forEach(function(r) {
    if (!sources[r.result]) missing.push({ name: r.name, result: r.result, mats: (r.mat || []).map(function(m) { return m[0]; }) });
  });

  // ---- report ----
  var all = Object.keys(ITEMS);
  var unreachable = all.filter(function(id) { return !sources[id]; });
  var byType = {};
  unreachable.forEach(function(id) {
    var t = ITEMS[id].type + (ITEMS[id].type2 ? '/' + ITEMS[id].type2 : '');
    (byType[t] = byType[t] || 0), byType[t]++;
  });
  var reachableCount = all.length - unreachable.length;
  // named signature items the audit called out
  var signatures = ['Zenith', 'Hermes Boots', 'Ankh', 'Cell Phone', 'GPS', 'Depth Meter', 'Katana',
    'Falcon Blade', 'Crystal Serpent', 'Drill', 'Master Ninja', 'Gladiator'];
  var sigRows = [];
  signatures.forEach(function(n) {
    all.forEach(function(id) {
      if (ITEMS[id].name.indexOf(n) >= 0) {
        sigRows.push({ name: ITEMS[id].name, reachable: !!sources[id] });
      }
    });
  });
  // sample of the biggest ghost categories
  var ghosts = unreachable.slice(0, 30).map(function(id) { return ITEMS[id].name; });
  // how the sources broke down (per-channel counts)
  var byWhy = {};
  for (var si in sources) {
    var w = sources[si].replace(/\(.*$/, '');
    (byWhy[w] = byWhy[w] || 0), byWhy[w]++;
  }
  return {
    total: all.length,
    reachable: reachableCount,
    unreachable: unreachable.length,
    byType: byType,
    byWhy: byWhy,
    passes: passes,
    chestGens: chestGens,
    chestGenFailed: chestGenFailed,
    lockedBags: lockedBags.length,
    releasedBags: released,
    sealedItems: sealedItems.map(function(id) { return { id: id, name: ITEMS[id].name }; }),
    sealedOk: sealedOk.map(function(id) { return { id: id, name: ITEMS[id].name }; }),
    signature: sigRows,
    ghostSample: ghosts,
    invalidRefs: invalid,
    unreachableIds: unreachable,
    stuckRecipes: missing
  };
}, TOKENS);

check(results, 'Probe enumerated the full catalog (post Phase-1 prune: 3,694 block/wall/material defs cut, 247 cross-ref keepers, 1 recipe-mat def restored)',
  data.total === 1864, { total: data.total });
check(results, 'Chest-content union generations all succeeded', data.chestGenFailed === 0 && data.chestGens === 6,
  { gens: data.chestGens, failed: data.chestGenFailed });
check(results, 'Locked-chest seal detection ran', data.lockedBags > 0, { lockedChests: data.lockedBags });
check(results, 'Shadow Chests now openable — Shadow Key is wired',
  data.releasedBags === data.lockedBags && data.sealedItems.length === 0,
  { unlocked: data.releasedBags + '/' + data.lockedBags, stillSealed: data.sealedItems.map(function(s) { return s.name; }) });
check(results, 'Census is deterministic: exactly 1,049 obtainable post-B6 icon wires (update this pin whenever acquisition content changes)',
  data.reachable === 1049, { reachable: data.reachable, delta: data.reachable - 1016 });
check(results, 'All recipes unstuck after material wires (bee/fossil/jungle)', data.stuckRecipes.length === 0,
  { stuck: data.stuckRecipes.map(function(r) { return r.name; }) });
check(results, 'No dangling item references in drop/shop data', Object.keys(data.invalidRefs).length === 0,
  Object.keys(data.invalidRefs).slice(0, 10));
check(results, 'Reachability closure complete', data.passes < 90, { passes: data.passes });
const sigBad = data.signature.filter(function(s) { return !s.reachable; });
check(results, 'Signature icon ghosts now wired: every named item is reachable (B6 wire batch)',
  sigBad.length === 0, { stillGhost: sigBad.map(function(s) { return s.name; }).join(', ') });

note(results, 'Reachability: ' + data.reachable + '/' + data.total + ' items obtainable; ' +
  data.unreachable + ' cut candidates. By type: ' + JSON.stringify(data.byType));
note(results, 'Source channel counts: ' + JSON.stringify(data.byWhy));
note(results, 'Sealed chests: ' + data.releasedBags + '/' + data.lockedBags + ' openable; still sealed: ' + data.sealedItems.map(function(s) { return s.name; }).join(', ') || 'none');
note(results, 'Ghost sample: ' + data.ghostSample.join(', '));
note(results, 'Full data (unreachableIds, stuckRecipes, byType, channels) → test-results/audit2/reach.json under "data"');
note(results, 'Residual limitation: hand-labelled sources cover enumerated tables + parsed hardcoded code; any exotic grant not shaped like the known idioms would only undercount reachability (safe direction for a cut list).');

await assertNoBrowserErrors(results);
await finish(results, browser, 'reach', data);
