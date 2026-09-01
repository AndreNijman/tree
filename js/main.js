// ---------- main.js: game engine ----------

var canvas = document.getElementById('canvas');
var ctx2d = canvas.getContext('2d');
var game = null;
var acc = 0;
var lastNow = 0;

function $(id) { return document.getElementById(id); }

var WORLD_W = 1600;
var WORLD_H = 640;

// ---------- Cached DOM ----------
var el = {};

// ---------- World dirty tracking (minimap rebuild) ----------
(function() {
  var origSet = World.prototype.set;
  World.prototype.set = function(x, y, t) {
    origSet.call(this, x, y, t);
    this.dirty = true;
    this.graveyardCache = null;
    if (typeof Net !== 'undefined') Net.worldMutation('tile', x, y, t);
  };
  var origSetWall = World.prototype.setWall;
  World.prototype.setWall = function(x, y, wall) {
    origSetWall.call(this, x, y, wall);
    this.dirty = true;
    if (typeof Net !== 'undefined') Net.worldMutation('wall', x, y, wall);
  };
  var origBreak = World.prototype.breakTile;
  World.prototype.breakTile = function(x, y) {
    var r = origBreak.call(this, x, y);
    this.dirty = true;
    this.graveyardCache = null;
    if (typeof Net !== 'undefined') Net.worldMutation('tile', x, y, this.get(x, y));
    return r;
  };
})();

// ---------- Game construction ----------
function buildGame(seed, evil, difficulty) {
  game = {
    world: new World(WORLD_W, WORLD_H, seed, difficulty),
    difficulty: difficulty || 'normal',
    player: null,
    cam: { x: 0, y: 0 },
    entities: [],
    projectiles: makePool(500),
    pickups: [],
    fx: [],
    fxTexts: [],
    bossBars: [],
    bossesDefeated: {},
    clouds: [],
    timeOfDay: 0.32,
    weather: { active:false, time:0, wind:1, intensity:0, windSpeed:0, windTarget:0, windChangeT:0, windy:false },
    panelOpen: false,
    panelTab: 'inventory',
    paused: false,
    started: true,
    victory: false,
    kills: 0,
    bestiary: {},
    hardmode: false,
    evilObjectsBroken: 0,
    lunarPillars: [],
    pillarsSpawned: false,
    pillarsDestroyed: 0,
    altarsSmashed: 0,
    _wasNight: false,
    spreadAcc: 0,
    mechDone: false,
    spawnT: 8,
    critterT: 4,
    strangePlantT: 30,
    messageTimer: 0,
    flashT: 0,
    shakeT: 0,
    shakeMag: 0,
    fps: 0,
    fpsAcc: 0,
    fpsCount: 0,
    craftCat: 'All',
    pylonOpen: false,
    activePylon: null,
    torchGod: null,
    ooaWins: { tier1:0, tier2:0, tier3:0 },
    tavernGiftClaimed: false,
    frostLegionDefeated: false,
    tavernkeepOpen: false,
    townNpcOpen: null,
    townArrivals: {},
    eventCompletions: {},
    townArrivalT: 0,
    housing: {},
    housingT: 0,
    taxSavings: 0,
    taxT: 60,
    townRescues: {},
    dayCount: 0,
    party: { active:false, natural:false, nextDay:0, cakeClaimed:false },
    lanternNight: { active:false, pending:false, celebrated:{}, randomNextDay:0 },
    starfall: { active:false, multiplier:1, crawlerT:0 },
    luck: 0,
    anglerQuestCompletedDay: -1,
    anglerQuestsCompleted: 0,
    cultistRitualReady: false,
    cultistRitualActive: false,
    cultistRespawnT: 0,
    autosaveT: 0,
    golf: { active:false, time:0, whacks:0, balls:[], spawnT:0, best:0, completed:0 }
  };
  game.world.generate(game.hardmode, evil);
  game.world.dirty = false;
  game.player = new Player(game.world);
  game.player.starterItems();
  game.cam.x = game.world.spawnX;
  game.cam.y = game.world.spawnY;

  // parallax clouds
  for (var i = 0; i < 12; i++) {
    game.clouds.push({
      x: Math.random() * WORLD_W * TILE,
      y: 20 + Math.random() * 140,
      w: 30 + Math.random() * 50,
      h: 8 + Math.random() * 10,
      parallax: 0.3 + Math.random() * 0.3
    });
  }

  // guide
  wireGameMethods();
  spawnEntity(game, E.GUIDE, game.world.guidePos.x, game.world.guidePos.y);

  // town NPCs
  spawnNpcs();

  // Give a new player time to orient before ambient enemies arrive.
}

// ---------- Save system ----------
var LEGACY_SAVE_KEY = 'tree.save.v1';
var SAVE_FORMAT = 1;
var WORLD_DB_NAME = 'tree.worlds';
var WORLD_STORE = 'worlds';
var worldDbPromise = null;
var activeWorldId = null;
var activeWorldName = '';
var saveInFlight = null;
var accountSync = { signedIn:false, username:null, syncing:false };

function openWorldDb() {
  if (worldDbPromise) return worldDbPromise;
  worldDbPromise = new Promise(function(resolve, reject) {
    var request = indexedDB.open(WORLD_DB_NAME, 1);
    request.onupgradeneeded = function() {
      if (!request.result.objectStoreNames.contains(WORLD_STORE)) {
        request.result.createObjectStore(WORLD_STORE, { keyPath:'id' });
      }
    };
    request.onsuccess = function() { resolve(request.result); };
    request.onerror = function() { reject(request.error); };
  });
  return worldDbPromise;
}

function worldStoreRequest(mode, action) {
  return openWorldDb().then(function(db) {
    return new Promise(function(resolve, reject) {
      var tx = db.transaction(WORLD_STORE, mode);
      var request = action(tx.objectStore(WORLD_STORE));
      var result;
      request.onsuccess = function() { result = request.result; };
      request.onerror = function() { reject(request.error); };
      tx.oncomplete = function() { resolve(result); };
      tx.onabort = function() { reject(tx.error || new Error('World storage transaction failed')); };
    });
  });
}

function getWorldRecord(id) {
  return worldStoreRequest('readonly', function(store) { return store.get(id); });
}

function getWorldRecords() {
  return worldStoreRequest('readonly', function(store) { return store.getAll(); });
}

function putWorldRecord(record) {
  return worldStoreRequest('readwrite', function(store) { return store.put(record); });
}

function makeWorldId() {
  if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
  return 'world-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 1679616).toString(36);
}

function cleanWorldName(value) {
  var name = String(value || '').replace(/\s+/g, ' ').trim();
  return name.slice(0, 32) || 'Unnamed World';
}

function escapeText(value) {
  return String(value).replace(/[&<>"']/g, function(ch) {
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch];
  });
}

function worldDate(time) {
  if (!time) return 'Never saved';
  try { return new Date(time).toLocaleString([], { dateStyle:'medium', timeStyle:'short' }); }
  catch (e) { return new Date(time).toLocaleString(); }
}

function migrateLegacySave() {
  var raw;
  try { raw = localStorage.getItem(LEGACY_SAVE_KEY); } catch (e) { raw = null; }
  if (!raw) return Promise.resolve();
  try {
    var data = JSON.parse(raw);
    if (!data || data.format !== SAVE_FORMAT || !data.tiles) return Promise.resolve();
    var updatedAt = data.savedAt || Date.now();
    var record = {
      id:'legacy-' + updatedAt.toString(36), name:'Legacy World', createdAt:updatedAt,
      updatedAt:updatedAt, deletedAt:null, evil:data.evil || 'random',
      hardmode:!!(data.progress && data.progress.hardmode), victory:!!(data.progress && data.progress.victory), data:data
    };
    return putWorldRecord(record).then(function() {
      try { localStorage.removeItem(LEGACY_SAVE_KEY); } catch (e2) {}
    });
  } catch (err) {
    return Promise.resolve();
  }
}

function setSaveMode(text) {
  if ($('save-mode')) $('save-mode').textContent = text;
}

function renderWorldList() {
  var root = $('world-list');
  if (!root) return Promise.resolve();
  return getWorldRecords().then(function(records) {
    records = records.filter(function(record) { return !record.deletedAt && record.data; });
    records.sort(function(a, b) { return b.updatedAt - a.updatedAt; });
    if (!records.length) {
      root.innerHTML = '<div class="world-empty">No worlds yet. Create one to begin.</div>';
      return;
    }
    var html = '';
    for (var i = 0; i < records.length; i++) {
      var record = records[i];
      var phase = record.victory ? 'Moon Lord defeated' : record.hardmode ? 'Hardmode' : 'Pre-Hardmode';
      var evil = record.evil === 'crimson' ? 'Crimson' : record.evil === 'corrupt' ? 'Corruption' : 'Unknown evil';
      var diff = (record.difficulty && DIFFICULTY[record.difficulty]) ? DIFFICULTY[record.difficulty].name : 'Normal';
      html += '<div class="world-row" data-world-id="' + escapeText(record.id) + '">' +
        '<button class="world-open" type="button"><span class="world-title">' + escapeText(record.name) + '</span>' +
        '<span class="world-meta">' + phase + ' · ' + evil + ' · ' + diff + ' · ' + escapeText(worldDate(record.updatedAt)) + '</span></button>' +
        '<button class="world-host" type="button" aria-label="Host ' + escapeText(record.name) + '">Host</button>' +
        '<button class="world-delete" type="button" aria-label="Delete ' + escapeText(record.name) + '">Delete</button></div>';
    }
    root.innerHTML = html;
  }).catch(function() {
    root.innerHTML = '<div class="world-empty">World storage is unavailable in this browser.</div>';
  });
}

function cloudJson(path, options) {
  options = options || {};
  options.credentials = 'same-origin';
  options.cache = 'no-store';
  return fetch(path, options).then(function(response) {
    return response.json().catch(function() { return {}; }).then(function(body) {
      if (!response.ok) throw new Error(body.error || 'Cloud request failed');
      return body;
    });
  });
}

function uploadCloudWorld(record) {
  if (!accountSync.signedIn || record.deletedAt || !record.data) return Promise.resolve();
  return cloudJson('/_guard/save?id=' + encodeURIComponent(record.id), {
    method:'PUT', headers:{ 'Content-Type':'application/json' },
    body:JSON.stringify({
      name:record.name, updatedAt:record.updatedAt, evil:record.evil,
      hardmode:record.hardmode, victory:record.victory, save:record.data
    })
  });
}

function deleteCloudWorld(record) {
  if (!accountSync.signedIn) return Promise.resolve();
  return cloudJson('/_guard/save?id=' + encodeURIComponent(record.id), {
    method:'DELETE', headers:{ 'Content-Type':'application/json' },
    body:JSON.stringify({ name:record.name, updatedAt:record.updatedAt })
  });
}

function pullCloudWorld(meta) {
  return cloudJson('/_guard/save?id=' + encodeURIComponent(meta.id)).then(function(body) {
    if (!body.world) throw new Error('Cloud world is missing');
    return putWorldRecord(body.world);
  });
}

function syncCloudWorlds() {
  if (!accountSync.signedIn || accountSync.syncing) return Promise.resolve();
  accountSync.syncing = true;
  setSaveMode('Syncing ' + accountSync.username + '...');
  return Promise.all([getWorldRecords(), cloudJson('/_guard/saves')]).then(function(results) {
    var local = results[0], remote = results[1].worlds || [];
    var localById = {}, remoteById = {}, ids = {}, jobs = [];
    for (var i = 0; i < local.length; i++) { localById[local[i].id] = local[i]; ids[local[i].id] = true; }
    for (var j = 0; j < remote.length; j++) { remoteById[remote[j].id] = remote[j]; ids[remote[j].id] = true; }
    for (var id in ids) {
      (function(worldId) {
        var l = localById[worldId], r = remoteById[worldId];
        if (!l && r) {
          jobs.push(r.deletedAt ? putWorldRecord(r) : pullCloudWorld(r));
        } else if (l && !r) {
          if (!l.deletedAt) jobs.push(uploadCloudWorld(l));
        } else if (l && r && r.updatedAt > l.updatedAt) {
          jobs.push(r.deletedAt ? putWorldRecord(r) : pullCloudWorld(r));
        } else if (l && r && l.updatedAt > r.updatedAt) {
          jobs.push(l.deletedAt ? deleteCloudWorld(l) : uploadCloudWorld(l));
        }
      })(id);
    }
    return Promise.all(jobs);
  }).then(function() {
    setSaveMode('Synced as ' + accountSync.username);
    return renderWorldList();
  }).catch(function() {
    setSaveMode('Local saves · sync unavailable');
  }).then(function() {
    accountSync.syncing = false;
  });
}

function initWorldStorage() {
  setSaveMode('Checking account...');
  return openWorldDb().then(migrateLegacySave).then(renderWorldList).then(function() {
    return cloudJson('/_guard/status').then(function(status) {
      accountSync.signedIn = !!status.signedIn;
      accountSync.username = status.username || null;
      if (accountSync.signedIn) return syncCloudWorlds();
      setSaveMode('Local saves · guest');
    }).catch(function() {
      setSaveMode('Local saves');
    });
  });
}

var METAL_DETECTOR_NAMES = {
  '52':'Copper Ore', '58':'Tin Ore', '10':'Iron Ore', '59':'Lead Ore',
  '53':'Silver Ore', '60':'Tungsten Ore', '54':'Gold Ore', '61':'Platinum Ore',
  '55':'Demonite Ore', '42':'Crimtane Ore', '62':'Meteorite', '7':'Cobalt Ore',
  '33':'Palladium Ore', '8':'Mythril Ore', '26':'Orichalcum Ore', '9':'Adamantite Ore',
  '25':'Titanium Ore', '24':'Chlorophyte', '44':'Hellstone', '37':'Chest',
  '65':'Shadow Chest', '70':'Demon Altar', '28':'Plantera Bulb',
  '66':'Shadow Orb', '67':'Crimson Heart', '68':'Larva'
};

function packTiles(tiles) {
  var parts = [];
  var value = tiles[0], run = 1;
  function pushRun() {
    parts.push(String.fromCharCode(value));
    var n = run;
    while (n >= 128) {
      parts.push(String.fromCharCode((n & 127) | 128));
      n = Math.floor(n / 128);
    }
    parts.push(String.fromCharCode(n));
  }
  for (var i = 1; i < tiles.length; i++) {
    if (tiles[i] === value) run++;
    else {
      pushRun();
      value = tiles[i];
      run = 1;
    }
  }
  pushRun();
  return btoa(parts.join(''));
}

function unpackTiles(packed, length) {
  var raw = atob(packed);
  var tiles = new Uint8Array(length);
  var pos = 0, i = 0;
  while (i < raw.length && pos < length) {
    var value = raw.charCodeAt(i++);
    var run = 0, mul = 1, b;
    do {
      if (i >= raw.length) throw new Error('Invalid tile data');
      b = raw.charCodeAt(i++);
      run += (b & 127) * mul;
      mul *= 128;
    } while (b & 128);
    if (run <= 0 || pos + run > length) throw new Error('Invalid tile run');
    tiles.fill(value, pos, pos + run);
    pos += run;
  }
  if (pos !== length || i !== raw.length) throw new Error('Incomplete tile data');
  return tiles;
}

function migrateLegacyTreeTrunks(tiles, generatedTiles, width) {
  for (var i = 0; i < tiles.length; i++) {
    if (tiles[i] === T.WOOD && (generatedTiles[i] === T.TREETRUNK ||
        (i >= width && generatedTiles[i - width] === T.TREETRUNK))) tiles[i] = T.TREETRUNK;
  }
}

function isSurfaceCapTile(tile) {
  return tile === T.GRASS || tile === T.HALLOWGRASS || tile === T.CORRUPTGRASS ||
    tile === T.JUNGLEGRASS || tile === T.CRIMGRASS || tile === T.SAND ||
    tile === T.SNOW || tile === T.ICE || tile === T.MUSHROOM || tile === T.WATER;
}

function updateWorldSurfaceAnchors(world) {
  var spawnTile = clamp(Math.floor(world.spawnX / TILE), 0, world.W - 1);
  var guideTile = clamp(spawnTile + 2, 0, world.W - 1);
  world.spawnY = world.surfaceY[spawnTile] * TILE - 16;
  world.guidePos = { x:guideTile * TILE + 8, y:world.surfaceY[guideTile] * TILE - 16 };
}

function applySavedSurfaceProfile(profile, world) {
  if (!profile || profile.length !== world.W) return false;
  var restored = new Uint16Array(world.W);
  for (var x = 0; x < world.W; x++) {
    var y = Math.floor(Number(profile[x]));
    if (!isFinite(y) || y < 1 || y >= world.hellY) return false;
    restored[x] = y;
  }
  world.surfaceY = restored;
  updateWorldSurfaceAnchors(world);
  return true;
}

function rebuildSavedSurfaceProfile(tiles, world) {
  var rebuilt = new Uint16Array(world.W);
  var found = new Uint8Array(world.W);
  for (var x = 0; x < world.W; x++) {
    var expected = world.surfaceY[x];
    var y0 = Math.max(1, expected - 48);
    var y1 = Math.min(world.hellY - 1, expected + 48);
    for (var y = y0; y <= y1; y++) {
      var tile = tiles[y * world.W + x];
      if (!isSurfaceCapTile(tile)) continue;
      var above = tiles[(y - 1) * world.W + x];
      if (isSurfaceCapTile(above)) continue;
      rebuilt[x] = y;
      found[x] = 1;
      break;
    }
  }
  for (x = 0; x < world.W; x++) {
    if (found[x]) continue;
    var left = x - 1, right = x + 1;
    while (left >= 0 && !found[left]) left--;
    while (right < world.W && !found[right]) right++;
    if (left >= 0 && right < world.W) {
      rebuilt[x] = Math.round(lerp(rebuilt[left], rebuilt[right], (x - left) / (right - left)));
    } else if (left >= 0) {
      rebuilt[x] = clamp(world.surfaceY[x] + rebuilt[left] - world.surfaceY[left], 1, world.hellY - 1);
    } else if (right < world.W) {
      rebuilt[x] = clamp(world.surfaceY[x] + rebuilt[right] - world.surfaceY[right], 1, world.hellY - 1);
    } else {
      rebuilt[x] = world.surfaceY[x];
    }
  }
  world.surfaceY = rebuilt;
  updateWorldSurfaceAnchors(world);
}

function migrateWorldPatch(data, loadedTiles, generatedTiles, width, game) {
  var patch = data.patch || 0;
  if (patch < 1) {
    if (!data.treeTrunks) migrateLegacyTreeTrunks(loadedTiles, generatedTiles, width);
    patch = 1;
  }
  if (patch < 2) {
    rebuildSavedSurfaceProfile(loadedTiles, game.world);
    patch = 2;
  }
  while (patch < PATCH) {
    patch++;
  }
}

function saveSnapshot() {
  var w = game.world, p = game.player, inv = p.inventory;
  var pets = [], lightPets = [], minions = [], pillars = [];
  for (var i = 0; i < p.pets.length; i++) pets.push(p.pets[i].id);
  for (var j = 0; j < p.lightPets.length; j++) lightPets.push(p.lightPets[j].id);
  for (var e = 0; e < game.entities.length; e++) {
    var ent = game.entities[e];
    if (ent.minion && !ent.dead) minions.push(ent.minion);
  }
  for (var l = 0; l < game.lunarPillars.length; l++) {
    var pillar = game.lunarPillars[l];
    if (!pillar.dead) {
      pillars.push({
        type: pillar.pillarType, x: pillar.x, y: pillar.y, anchorY: pillar.anchorY,
        hp: pillar.hp, shieldHp: pillar.shieldHp, shieldDown: pillar.shieldDown
      });
    }
  }
  return {
    format: SAVE_FORMAT,
    savedAt: Date.now(),
    seed: w.seed,
    evil: w.evil,
    difficulty: w.difficulty || 'normal',
    patch: PATCH,
    treeTrunks: true,
    tiles: packTiles(w.tiles),
    walls: packTiles(w.walls),
    world: {
      chests: w.chests,
      pylons: w.pylons,
      planteraBulbs: w.planteraBulbs,
      evilObjects: w.evilObjects,
      larvae: w.larvae,
      altars: w.altars,
      altarsSmashed: w.altarsSmashed,
      meteorCraters: w.meteorCraters,
      dungeonOpen: w.dungeonOpen,
      surfaceY: Array.prototype.slice.call(w.surfaceY)
    },
    player: {
      x: p.x, y: p.y, dir: p.dir, hair: p.hair,
      hp: p.hp, maxHp: p.maxHp, mana: p.mana, maxMana: p.maxMana,
      buffs: p.buffs, buffMaxHp: p.buffMaxHp,
      mounted: p.mounted, pets: pets, lightPets: lightPets,
      torchGodFavor: !!p.torchGodFavor,
      permanentUpgrades: { vitalCrystal:!!p.vitalCrystal, aegisFruit:!!p.aegisFruit, ambrosia:!!p.ambrosia, advancedCombat2:!!p.advancedCombat2 },
      inventory: {
        slots: inv.slots, selected: inv.selected, armor: inv.armor,
        accessories: inv.accessories, dyes: inv.dyes, ammo: inv.ammo,
        potionCd: inv.potionCd
      }
    },
    progress: {
      timeOfDay: game.timeOfDay,
      weather: game.weather,
      hardmode: game.hardmode,
      victory: game.victory,
      kills: game.kills,
      bestiary: game.bestiary,
      bossesDefeated: game.bossesDefeated,
      mechDone: game.mechDone,
      evilObjectsBroken: game.evilObjectsBroken,
      pillarsSpawned: game.pillarsSpawned,
      pillarsDestroyed: game.pillarsDestroyed,
      altarsSmashed: game.altarsSmashed,
      meteorFallen: !!game._meteorFallen,
      wasNight: !!game._wasNight,
      spreadAcc: game.spreadAcc,
      event: game.event || null,
      ooaWins: game.ooaWins,
      tavernGiftClaimed: !!game.tavernGiftClaimed,
      frostLegionDefeated: !!game.frostLegionDefeated,
      townArrivals: game.townArrivals,
      townArrivalsComplete: true,
      eventCompletions: game.eventCompletions,
      housing: game.housing,
      taxSavings: game.taxSavings,
      townRescues: captureTownRescues(),
      dayCount: game.dayCount,
      party: game.party,
      lanternNight: game.lanternNight,
      starfall: game.starfall,
      anglerQuestCompletedDay: game.anglerQuestCompletedDay,
      anglerQuestsCompleted: game.anglerQuestsCompleted,
      cultistRitualReady: game.cultistRitualReady,
      golfBest: game.golf.best,
      golfCompleted: game.golf.completed
    },
    achievements: Achievements.unlocked,
    pickups: game.pickups,
    minions: minions,
    pillars: pillars
  };
}

function canSaveGame(silent) {
  if (!game || !game.started) return false;
  if (game.torchGod) {
    if (!silent) game.message('Survive the Torch God before saving.');
    return false;
  }
  if (game.event && game.event.type === 'oldonesarmy') {
    if (!silent) game.message('Finish the Old One\'s Army before saving.');
    return false;
  }
  for (var i = 0; i < game.entities.length; i++) {
    var e = game.entities[i];
    if (e.boss && e.boss !== 'lunar' && !e.dead) {
      if (!silent) game.message('Defeat or escape the active boss before saving.');
      return false;
    }
  }
  return true;
}

function saveGame(silent) {
  silent = !!silent;
  if (!canSaveGame(silent)) return Promise.resolve(false);
  if (saveInFlight) {
    return silent ? saveInFlight : saveInFlight.then(function() { return saveGame(false); });
  }
  var snapshot;
  try { snapshot = saveSnapshot(); }
  catch (err) {
    if (!silent && game) game.message('Save failed while preparing the world.');
    return Promise.resolve(false);
  }
  var id = activeWorldId || makeWorldId();
  var name = cleanWorldName(activeWorldName || 'Unnamed World');
  var now = Date.now();
  saveInFlight = getWorldRecord(id).then(function(existing) {
    var record = {
      id:id, name:name, createdAt:existing && existing.createdAt ? existing.createdAt : now,
      updatedAt:now, deletedAt:null, evil:snapshot.evil || 'random',
      hardmode:!!(snapshot.progress && snapshot.progress.hardmode),
      victory:!!(snapshot.progress && snapshot.progress.victory), data:snapshot
    };
    activeWorldId = id;
    activeWorldName = name;
    return putWorldRecord(record).then(function() {
      if (!silent && game) game.message(accountSync.signedIn ? 'World saved. Syncing to account...' : 'World saved locally.');
      renderWorldList();
      uploadCloudWorld(record).then(function() {
        if (!silent && game && accountSync.signedIn) game.message('World saved locally and to ' + accountSync.username + '.');
        setSaveMode(accountSync.signedIn ? 'Synced as ' + accountSync.username : 'Local saves · guest');
      }).catch(function() {
        setSaveMode('Saved locally · cloud sync failed');
      });
      return true;
    });
  }).catch(function() {
    if (!silent && game) game.message('Save failed: browser storage is unavailable or full.');
    return false;
  }).then(function(result) {
    saveInFlight = null;
    return result;
  });
  return saveInFlight;
}

function restorePetList(ids, light) {
  var list = [];
  for (var i = 0; i < ids.length; i++) {
    var def = ITEMS[ids[i]];
    if (!def) continue;
    list.push({ id: ids[i], def: def, x: game.player.x, y: game.player.y - 20, t: Math.random() * 6.28 });
  }
  if (light) game.player.lightPets = list;
  else game.player.pets = list;
}

function restoreMinions(types) {
  for (var i = 0; i < types.length; i++) {
    var staff = null;
    for (var id in ITEMS) {
      if (ITEMS[id].type === 'summonstaff' && ITEMS[id].minion === types[i]) { staff = ITEMS[id]; break; }
    }
    if (staff) spawnMinion(game, staff);
  }
}

function applySaveData(data) {
  if (!data || data.format !== SAVE_FORMAT || !data.tiles) throw new Error('Unsupported save data');
  Achievements.unlocked = {};
  Achievements.total = 0;
  var savedAchievements = data.achievements || {};
  for (var aid in savedAchievements) {
    if (savedAchievements[aid] && ACHIEVEMENTS[aid]) {
      Achievements.unlocked[aid] = true;
      Achievements.total++;
    }
  }

  buildGame(data.seed, data.evil, data.difficulty || 'normal');
  var w = game.world, ws = data.world || {}, pr = data.progress || {};
  var generatedTiles = w.tiles;
  var loadedTiles = unpackTiles(data.tiles, w.W * w.H);
  w.tiles = loadedTiles;
  migrateWorldPatch(data, loadedTiles, generatedTiles, w.W, game);
  if (data.walls) w.walls = unpackTiles(data.walls, w.W * w.H);
  var restoredSurface = ws.surfaceY && applySavedSurfaceProfile(ws.surfaceY, w);
  if (!restoredSurface && (data.patch || 0) >= 2) rebuildSavedSurfaceProfile(loadedTiles, w);
  w.graveyardCache = null;
  w.postGenHp();
  if (ws.chests) w.chests = ws.chests;
  if (ws.pylons) w.pylons = ws.pylons;
  if (ws.planteraBulbs) w.planteraBulbs = ws.planteraBulbs;
  if (ws.evilObjects) w.evilObjects = ws.evilObjects;
  if (ws.larvae) w.larvae = ws.larvae;
  if (ws.altars) w.altars = ws.altars;
  if (ws.altarsSmashed) w.altarsSmashed = ws.altarsSmashed;
  if (ws.meteorCraters) w.meteorCraters = ws.meteorCraters;
  w.dungeonOpen = !!ws.dungeonOpen;

  game.timeOfDay = pr.timeOfDay === undefined ? 0.32 : pr.timeOfDay;
  game.weather = pr.weather || { active:false, time:0, wind:1, intensity:0 };
  if (!isFinite(game.weather.windSpeed)) game.weather.windSpeed = 0;
  if (!isFinite(game.weather.windTarget)) game.weather.windTarget = game.weather.windSpeed;
  if (!isFinite(game.weather.windChangeT)) game.weather.windChangeT = 0;
  game.weather.windy = !!game.weather.windy;
  game.hardmode = !!pr.hardmode;
  w.hardmode = game.hardmode;
  game.victory = !!pr.victory;
  game.kills = pr.kills || 0;
  game.bestiary = sanitizeBestiary(pr.bestiary);
  game.bossesDefeated = pr.bossesDefeated || {};
  game.mechDone = !!pr.mechDone;
  game.evilObjectsBroken = pr.evilObjectsBroken || 0;
  game.pillarsSpawned = !!pr.pillarsSpawned;
  game.pillarsDestroyed = pr.pillarsDestroyed || 0;
  game.altarsSmashed = pr.altarsSmashed || 0;
  game._meteorFallen = !!pr.meteorFallen;
  game._wasNight = !!pr.wasNight;
  game.spreadAcc = pr.spreadAcc || 0;
  game.event = pr.event || null;
  game.ooaWins = pr.ooaWins || { tier1:0, tier2:0, tier3:0 };
  game.tavernGiftClaimed = !!pr.tavernGiftClaimed;
  game.frostLegionDefeated = !!pr.frostLegionDefeated;
  game.townArrivals = pr.townArrivals || {};
  game.eventCompletions = pr.eventCompletions || {};
  game.housing = pr.housing || {};
  game.taxSavings = clamp(pr.taxSavings || 0, 0, 20);
  game.townRescues = pr.townRescues || {};
  game.dayCount = Math.max(0, pr.dayCount || 0);
  game.party = pr.party || { active:false, natural:false, nextDay:0, cakeClaimed:false };
  game.party.active = !!game.party.active;
  game.party.natural = !!game.party.natural;
  game.party.nextDay = Math.max(0, game.party.nextDay || 0);
  game.party.cakeClaimed = !!game.party.cakeClaimed;
  game.lanternNight = pr.lanternNight || { active:false, pending:false, celebrated:{}, randomNextDay:0 };
  game.lanternNight.active = !!game.lanternNight.active;
  game.lanternNight.pending = !!game.lanternNight.pending;
  game.lanternNight.celebrated = game.lanternNight.celebrated || {};
  game.lanternNight.randomNextDay = Math.max(0, game.lanternNight.randomNextDay || 0);
  game.luck = game.lanternNight.active ? 0.3 : 0;
  game.starfall = pr.starfall || { active:false, multiplier:1, crawlerT:0 };
  game.starfall.active = !!game.starfall.active;
  game.starfall.multiplier = clamp(isFinite(game.starfall.multiplier) ? game.starfall.multiplier : 1, 1, 5);
  game.starfall.crawlerT = Math.max(0, game.starfall.crawlerT || 0);
  game.anglerQuestCompletedDay = pr.anglerQuestCompletedDay === undefined ? -1 : pr.anglerQuestCompletedDay;
  game.anglerQuestsCompleted = Math.max(0, pr.anglerQuestsCompleted || 0);
  game.golf.best = Math.max(0, pr.golfBest || 0);
  game.golf.completed = Math.max(0, pr.golfCompleted || 0);
  var legacyTown = { merchant:E.MERCHANT, nurse:E.NURSE, armsdealer:E.ARMSDEALER, demolitionist:E.DEMOLITIONIST,
    dryad:E.DRYAD, goblintinkerer:E.GOBLINTINKERER, mechanic:E.MECHANIC, wizard:E.WIZARD,
    clothier:E.CLOTHIER, taxcollector:E.TAXCOLLECTOR, painter:E.PAINTER, golfer:E.GOLFER, zoologist:E.ZOOLOGIST,
    dyetrader:E.DYETRADER, angler:E.ANGLER, pirate:E.PIRATE, witchdoctor:E.WITCHDOCTOR, partygirl:E.PARTYGIRL,
    stylist:E.STYLIST, tavernkeep:E.TAVERNKEEP, steampunker:E.STEAMPUNKER, cyborg:E.CYBORG, truffle:E.TRUFFLE,
    santa:E.SANTA, princess:E.PRINCESS };
  if (!pr.townArrivalsComplete) {
    for (var legacyAch in legacyTown) if (savedAchievements[legacyAch]) game.townArrivals[legacyTown[legacyAch]] = true;
  }
  if (!pr.eventCompletions) {
    if (savedAchievements.goblinarmy) game.eventCompletions.goblinarmy = true;
    if (savedAchievements.pirateinvasion) game.eventCompletions.pirateinvasion = true;
  }
  game.cultistRitualReady = !!pr.cultistRitualReady || (!!game.bossesDefeated.golem && !game.bossesDefeated.cultist);
  game.cultistRitualActive = false;
  game.cultistRespawnT = 1;

  var p = game.player, ps = data.player || {}, savedInv = ps.inventory || {};
  p.x = clamp(ps.x === undefined ? w.spawnX : ps.x, 16, w.W * TILE - 16);
  p.y = clamp(ps.y === undefined ? w.spawnY : ps.y, 16, w.H * TILE - 16);
  p.dir = ps.dir || 1;
  p.hair = ps.hair || 0;
  p.maxHp = ps.maxHp || 100; p.hp = clamp(ps.hp || 1, 1, p.maxHp);
  p.maxMana = ps.maxMana || 200; p.mana = clamp(ps.mana === undefined ? p.maxMana : ps.mana, 0, p.maxMana);
  p.buffs = ps.buffs || {}; p.buffMaxHp = ps.buffMaxHp || 0;
  p.torchGodFavor = !!ps.torchGodFavor;
  var upgrades = ps.permanentUpgrades || {};
  p.vitalCrystal = !!upgrades.vitalCrystal;
  p.aegisFruit = !!upgrades.aegisFruit;
  p.ambrosia = !!upgrades.ambrosia;
  p.advancedCombat2 = !!upgrades.advancedCombat2;
  p.mounted = ps.mounted && ITEMS[ps.mounted] ? ps.mounted : null;
  p.mountDef = p.mounted ? ITEMS[p.mounted] : null;
  p.inventory.slots = new Array(50);
  var savedSlots = savedInv.slots || [];
  for (var si = 0; si < 50; si++) {
    p.inventory.slots[si] = savedSlots[si] || null;
    if (p.inventory.slots[si] && p.inventory.slots[si].reforge) {
      var safeReforge = sanitizeReforge(p.inventory.slots[si].reforge);
      if (safeReforge) p.inventory.slots[si].reforge = safeReforge;
      else delete p.inventory.slots[si].reforge;
    }
  }
  p.inventory.selected = clamp(savedInv.selected || 0, 0, 49);
  p.inventory.armor = savedInv.armor || { head:null, chest:null, legs:null };
  p.inventory.accessories = savedInv.accessories || [null, null, null, null, null, null];
  p.inventory.dyes = savedInv.dyes || [null, null, null, null, null, null];
  p.inventory.ammo = savedInv.ammo || null;
  p.inventory.potionCd = savedInv.potionCd || 0;
  restorePetList(ps.pets || [], false);
  restorePetList(ps.lightPets || [], true);

  game.entities.length = 0;
  game.bossBars.length = 0;
  game.lunarPillars = [];
  if (!game.hardmode) spawnEntity(game, E.GUIDE, w.guidePos.x, w.guidePos.y);
  spawnNpcs();
  restoreTownRescues();
  restoreMinions(data.minions || []);

  var savedPillars = data.pillars || [];
  for (var pi = 0; pi < savedPillars.length; pi++) {
    var sp = savedPillars[pi];
    var pe = spawnLunarPillar(game, sp.type);
    pe.x = sp.x; pe.y = sp.y; pe.anchorY = sp.anchorY;
    pe.hp = sp.hp; pe.shieldHp = sp.shieldHp; pe.shieldDown = !!sp.shieldDown;
  }
  game.pickups = data.pickups || [];
  if (game.hardmode) w.seedSpreadFrontier();
  w.rebuildLights();
  w.dirty = true;
  game.cam.x = p.x; game.cam.y = p.y;
  game.panelOpen = false; game.paused = false;
  if (game.victory && game.showVictory) game.showVictory();
}

function startSavedGame(id) {
  $('loading').classList.remove('hidden');
  $('loadprogress').innerHTML = '<div class="bar" style="width:20%"></div>';
  getWorldRecord(id).then(function(record) {
    if (!record || record.deletedAt || !record.data) throw new Error('World not found');
    activeWorldId = record.id;
    activeWorldName = record.name;
    return new Promise(function(resolve) { requestAnimationFrame(resolve); }).then(function() {
    try {
      $('loadprogress').innerHTML = '<div class="bar" style="width:65%"></div>';
      applySaveData(record.data);
      $('loadprogress').innerHTML = '<div class="bar" style="width:100%"></div>';
      $('loading').classList.add('hidden');
      $('mainmenu').classList.add('hidden');
      MOUSE.down = false; MOUSE.right = false; acc = 0;
      for (var key in KEY) KEY[key] = false;
      for (var just in KEY_JUST) KEY_JUST[just] = false;
      AudioSys.init(); AudioSys.resume();
      game.message(record.name + ' loaded.');
    } catch (err) {
      throw err;
    }
    });
  }).catch(function() {
    game = null;
    activeWorldId = null;
    activeWorldName = '';
    $('loading').classList.add('hidden');
    $('mainmenu').classList.remove('hidden');
    $('message').textContent = 'The world could not be loaded.';
    $('message').style.opacity = 1;
    showTitleActions();
    renderWorldList();
  });
}

function refreshSaveMenu() {
  if (game && game.started && (game.paused || game.netMenu)) {
    $('title-actions').classList.add('hidden');
    $('pause-actions').classList.remove('hidden');
    $('btn-save').classList.toggle('hidden', typeof Net !== 'undefined' && Net.isOnline());
    $('btn-leave-hosted').classList.toggle('hidden', typeof Net === 'undefined' || !Net.isOnline());
  } else {
    showTitleActions();
  }
}

function showTitleActions() {
  $('title-actions').classList.remove('hidden');
  $('pause-actions').classList.add('hidden');
  $('world-create').classList.add('hidden');
  $('btn-new').classList.remove('hidden');
}

function saveAndQuit() {
  saveGame(false).then(function(saved) {
    if (!saved) return;
    closePanel();
    game = null;
    activeWorldId = null;
    activeWorldName = '';
    var victory = document.getElementById('victory');
    if (victory && victory.parentNode) victory.parentNode.removeChild(victory);
    $('mainmenu').classList.remove('hidden');
    document.querySelector('#mainmenu h1').textContent = 'tree';
    showTitleActions();
    renderWorldList();
  });
}

function deleteWorld(id) {
  return getWorldRecord(id).then(function(record) {
    if (!record || record.deletedAt) return;
    if (!window.confirm('Delete "' + record.name + '"? This removes the local and account copy.')) return;
    record.updatedAt = Date.now();
    record.deletedAt = record.updatedAt;
    record.data = null;
    return putWorldRecord(record).then(function() {
      renderWorldList();
      return deleteCloudWorld(record).catch(function() {
        setSaveMode('Deleted locally · cloud sync pending');
      });
    });
  });
}

function spawnNpcs() {
  var w = game.world;
  var sx = w.spawnX;
  var hm = game.hardmode;
  var npcs = [
    { t: E.ARMSDEALER, ach: 'armsdealer', off: -1250 },
    { t: E.GOBLINTINKERER, ach: 'goblintinkerer', off: -1150 },
    { t: E.CLOTHIER, ach: 'clothier', off: -1050 },
    { t: E.TAXCOLLECTOR, ach: 'taxcollector', off: -950 },
    { t: E.MECHANIC, ach: 'mechanic', off: -850 },
    { t: E.PAINTER, ach: 'painter', off: -750 },
    { t: E.DRYAD, ach: 'dryad', off: -650 },
    { t: E.GOLFER, ach: 'golfer', off: -550 },
    { t: E.ZOOLOGIST, ach: 'zoologist', off: -450 },
    { t: E.DYETRADER, ach: 'dyetrader', off: -350 },
    { t: E.ANGLER, ach: 'angler', off: -260 },
    { t: E.PIRATE, ach: 'pirate', off: -180 },
    { t: E.WITCHDOCTOR, ach: 'witchdoctor', off: -100 },
    { t: E.MERCHANT, ach: 'merchant', off: 0 },
    { t: E.NURSE, ach: 'nurse', off: 80 },
    { t: E.PARTYGIRL, ach: 'partygirl', off: 170 },
    { t: E.STYLIST, ach: 'stylist', off: 260 },
    { t: E.DEMOLITIONIST, ach: 'demolitionist', off: 350 },
    { t: E.WIZARD, ach: 'wizard', off: 440 },
    { t: E.TAVERNKEEP, ach: 'tavernkeep', off: 530 }
  ];
  if (hm) {
    npcs = npcs.concat([
      { t: E.STEAMPUNKER, ach: 'steampunker', off: 620 },
      { t: E.CYBORG, ach: 'cyborg', off: 710 },
      { t: E.TRUFFLE, ach: 'truffle', off: 800 },
      { t: E.PRINCESS, ach: 'princess', off: 1100 }
    ]);
    if (game.frostLegionDefeated) npcs.push({ t:E.SANTA, ach:'santa', off:950 });
  }
  for (var i = 0; i < npcs.length; i++) {
    if (townNpcArrivalGated(npcs[i].t) && !game.townArrivals[npcs[i].t]) continue;
    var exists = false;
    for (var e = 0; e < game.entities.length; e++) {
      if (!game.entities[e].dead && game.entities[e].type === npcs[i].t) { exists = true; break; }
    }
    if (exists) continue;
    var gx = sx + npcs[i].off;
    var tx = clamp(Math.floor(gx / TILE), 2, w.W - 3);
    var sy = w.surfaceY[tx] * TILE;
    var npc = spawnEntity(game, npcs[i].t, gx, sy - 16);
    var home = game.housing[npcs[i].t];
    if (npc && home) { npc.x = home.homeX; npc.y = home.homeY; }
    Achievements.unlock(npcs[i].ach, game);
  }
}

function townNpcArrivalGated(type) {
  return type !== E.GUIDE;
}

function playerHasBulletGear() {
  var slots = game.player.inventory.slots;
  for (var i = 0; i < slots.length; i++) {
    var stack = slots[i], def = stack && ITEMS[stack.id];
    if (!def) continue;
    if (def.type === 'ammo' && def.ammoGroup === 'bullet') return true;
    if (def.type === 'ranged' && def.ammo && ammoCompatible(I.BULLET, def.ammo)) return true;
  }
  return false;
}

var TOWN_RESCUE_INFO = {};
TOWN_RESCUE_INFO[E.ANGLER] = { name:'Sleeping Angler', achievement:'angler' };
TOWN_RESCUE_INFO[E.GOLFER] = { name:'Lost Golfer', achievement:'golfer' };
TOWN_RESCUE_INFO[E.STYLIST] = { name:'Webbed Stylist', achievement:'stylist' };
TOWN_RESCUE_INFO[E.GOBLINTINKERER] = { name:'Bound Goblin', achievement:'goblintinkerer' };
TOWN_RESCUE_INFO[E.MECHANIC] = { name:'Bound Mechanic', achievement:'mechanic' };
TOWN_RESCUE_INFO[E.WIZARD] = { name:'Bound Wizard', achievement:'wizard' };

function spawnTownRescue(type, x, y) {
  var info = TOWN_RESCUE_INFO[type];
  if (!info || game.townArrivals[type]) return null;
  for (var i = 0; i < game.entities.length; i++) {
    var existing = game.entities[i];
    if (!existing.dead && existing.type === +type) return existing;
  }
  var e = spawnEntity(game, +type, x, y);
  e.rescue = true;
  e.name = info.name;
  game.townRescues[type] = { x:x, y:y };
  return e;
}

function captureTownRescues() {
  var saved = {};
  for (var i = 0; i < game.entities.length; i++) {
    var e = game.entities[i];
    if (e.rescue && !e.dead) saved[e.type] = { x:e.x, y:e.y };
  }
  return saved;
}

function restoreTownRescues() {
  for (var type in game.townRescues) {
    var saved = game.townRescues[type];
    if (!game.townArrivals[type]) spawnTownRescue(+type, saved.x, saved.y);
  }
}

function updateTownRescues() {
  var biome = game.world.biomeAt(game.player.x, game.player.y), b = game.bossesDefeated, eligible = [];
  var px = clamp(Math.floor(game.player.x / TILE), 0, game.world.W - 1);
  var undergroundDepth = game.player.y / TILE - game.world.surfaceY[px];
  var genericUnderground = game.world.isUnderground(game.player.x, game.player.y) && biome !== BIOME.UNDERWORLD &&
    biome !== BIOME.DUNGEON && biome !== BIOME.TEMPLE && biome !== BIOME.UNDERDESERT && biome !== BIOME.UNDERSNOW &&
    biome !== BIOME.SPIDER && biome !== BIOME.GRANITE && biome !== BIOME.MARBLE && biome !== BIOME.MUSHROOM && biome !== BIOME.AETHER;
  if (biome === BIOME.OCEAN) eligible.push(E.ANGLER);
  if (biome === BIOME.UNDERDESERT) eligible.push(E.GOLFER);
  if (biome === BIOME.SPIDER) eligible.push(E.STYLIST);
  if (genericUnderground && game.eventCompletions.goblinarmy) eligible.push(E.GOBLINTINKERER);
  if (biome === BIOME.DUNGEON && b.skeletron) eligible.push(E.MECHANIC);
  if (genericUnderground && undergroundDepth > 70 && game.hardmode) eligible.push(E.WIZARD);
  for (var i = 0; i < eligible.length; i++) {
    var type = eligible[i];
    if (!game.townArrivals[type] && !game.townRescues[type]) {
      spawnTownRescue(type, game.player.x + game.player.dir * 36, game.player.y - 8);
      game.message(TOWN_RESCUE_INFO[type].name + ' needs help nearby!');
    }
  }
}

function rescueNpcAtCursor() {
  for (var i = 0; i < game.entities.length; i++) {
    var e = game.entities[i];
    if (e.rescue && !e.dead && dist(game.player.x, game.player.y, e.x, e.y) < 90 && dist(MOUSE.wx, MOUSE.wy, e.x, e.y) < 48) return e;
  }
  return null;
}

function tryRescueTownNpc() {
  var e = rescueNpcAtCursor();
  if (!e) return false;
  var info = TOWN_RESCUE_INFO[e.type], def = ENT_DEF[e.type];
  e.rescue = false;
  e.name = def.name;
  game.townArrivals[e.type] = true;
  delete game.townRescues[e.type];
  Achievements.unlock(info.achievement, game);
  game.message(def.name + ' has been rescued and can now move into town.');
  AudioSys.play('pickup');
  return true;
}

function playerHasItemType(type) {
  var slots = game.player.inventory.slots;
  for (var i = 0; i < slots.length; i++) {
    var stack = slots[i];
    if (stack && ITEMS[stack.id] && ITEMS[stack.id].type === type) return true;
  }
  return false;
}

function dyeTraderArrivalEligible() {
  return playerHasItemType('dye') || game.player.inventory.countOf(I.STRANGEPLANT) > 0;
}

function townArrivalCount(excludeSanta) {
  var count = 0;
  for (var type in game.townArrivals) {
    if (game.townArrivals[type] && (!excludeSanta || +type !== E.SANTA) && +type !== E.PRINCESS) count++;
  }
  return count;
}

function anyBossDefeated() {
  for (var boss in game.bossesDefeated) if (game.bossesDefeated[boss]) return true;
  return false;
}

function updateTownArrivals() {
  var inv = game.player.inventory, b = game.bossesDefeated, arrivals = game.townArrivals;
  var wealth = inv.countOf(I.GOLD) + inv.countOf(I.GOLDBAR) * 3 + inv.countOf(I.PLATINUM) + inv.countOf(I.PLATINUMBAR) * 3;
  var biome = game.world.biomeAt(game.player.x, game.player.y);
  var conditions = {};
  conditions[E.MERCHANT] = wealth >= 5;
  conditions[E.NURSE] = !!arrivals[E.MERCHANT] && game.player.maxHp >= 120;
  conditions[E.ARMSDEALER] = playerHasBulletGear();
  conditions[E.DEMOLITIONIST] = inv.countOf(I.GRENADE) > 0 || inv.countOf(I.EXPLOSIVEBULLET) > 0;
  conditions[E.DRYAD] = anyBossDefeated();
  conditions[E.CLOTHIER] = !!b.skeletron;
  conditions[E.TAXCOLLECTOR] = !!game.hardmode;
  conditions[E.PAINTER] = townArrivalCount(false) >= 7;
  conditions[E.ZOOLOGIST] = game.kills >= 25;
  conditions[E.DYETRADER] = dyeTraderArrivalEligible();
  conditions[E.PIRATE] = !!game.eventCompletions.pirateinvasion;
  conditions[E.WITCHDOCTOR] = !!b.queenbee;
  conditions[E.PARTYGIRL] = townArrivalCount(false) >= 13;
  conditions[E.TAVERNKEEP] = !!(b.eaterofworlds || b.brainofcthulhu);
  conditions[E.STEAMPUNKER] = anyMechanicalBossDefeated();
  conditions[E.CYBORG] = !!b.plantera;
  conditions[E.TRUFFLE] = !!game.hardmode && biome === BIOME.MUSHROOM;
  conditions[E.SANTA] = !!game.frostLegionDefeated;
  conditions[E.PRINCESS] = !!game.hardmode && townArrivalCount(true) >= 23;
  var changed = false;
  for (var type in conditions) {
    if (conditions[type] && !arrivals[type]) { arrivals[type] = true; changed = true; }
  }
  if (changed) spawnNpcs();
  return changed;
}

function housingInteriorTile(tile) {
  return tile === T.AIR || tile === T.TORCH || tile === T.COBWEB;
}

function checkHousingRoom(tx, ty) {
  var world = game.world;
  if (!world.inBounds(tx, ty) || !housingInteriorTile(world.get(tx, ty))) return { valid:false, reason:'Stand inside an open room.' };
  var queue = [{ x:tx, y:ty }], seen = {}, cells = [], head = 0;
  seen[tx + ',' + ty] = true;
  var table = false, chair = false, light = false, floorCells = [], minX = tx, maxX = tx, minY = ty, maxY = ty;
  while (head < queue.length) {
    var cell = queue[head++];
    if (cells.length >= 300) return { valid:false, reason:'This room is too large.' };
    cells.push(cell);
    minX = Math.min(minX, cell.x); maxX = Math.max(maxX, cell.x);
    minY = Math.min(minY, cell.y); maxY = Math.max(maxY, cell.y);
    if (world.wall(cell.x, cell.y) !== WALL.WOOD) return { valid:false, reason:'Cover the room with player-placed Wood Walls.' };
    if (world.get(cell.x, cell.y) === T.TORCH) light = true;
    var dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    for (var d = 0; d < dirs.length; d++) {
      var nx = cell.x + dirs[d][0], ny = cell.y + dirs[d][1];
      if (!world.inBounds(nx, ny)) return { valid:false, reason:'The room is not enclosed.' };
      var tile = world.get(nx, ny);
      if (tile === T.TABLE) table = true;
      if (tile === T.CHAIR) chair = true;
      if (housingInteriorTile(tile)) {
        var key = nx + ',' + ny;
        if (!seen[key]) { seen[key] = true; queue.push({ x:nx, y:ny }); }
      } else if (!world.isSolidTile(tile) && tile !== T.PLATFORM) {
        return { valid:false, reason:'The room is not enclosed.' };
      }
    }
    if ((world.isSolid(cell.x, cell.y + 1) || world.isPlatform(cell.x, cell.y + 1)) &&
        housingInteriorTile(world.get(cell.x, cell.y - 1))) floorCells.push(cell);
  }
  if (cells.length < 20) return { valid:false, reason:'This room is too small.' };
  if (!light) return { valid:false, reason:'Housing needs a Torch.' };
  if (!table) return { valid:false, reason:'Housing needs a Table.' };
  if (!chair) return { valid:false, reason:'Housing needs a Chair.' };
  if (floorCells.length < 2) return { valid:false, reason:'Housing needs clear floor space.' };
  var home = floorCells[Math.floor(floorCells.length / 2)];
  return { valid:true, reason:'Suitable housing.', x:tx, y:ty, key:minX + ',' + minY + ':' + maxX + ',' + maxY + ':' + cells.length,
    homeX:home.x * TILE + 8, homeY:(home.y + 1) * TILE - 16, size:cells.length };
}

function playerHousingRoom() {
  var tx = Math.floor(game.player.x / TILE), ty = Math.floor((game.player.y - game.player.h * 0.5) / TILE);
  return checkHousingRoom(tx, ty);
}

function assignNpcHousing(type) {
  if (!game.townArrivals[type]) return false;
  var room = playerHousingRoom();
  if (!room.valid) { game.message(room.reason); return false; }
  for (var other in game.housing) {
    var home = game.housing[other];
    if (+other !== +type && home.key === room.key) {
      game.message('This room is already occupied.'); return false;
    }
  }
  game.housing[type] = { x:room.x, y:room.y, key:room.key, homeX:room.homeX, homeY:room.homeY };
  for (var i = 0; i < game.entities.length; i++) {
    var e = game.entities[i];
    if (!e.dead && e.type === +type) { e.x = room.homeX; e.y = room.homeY; e.vx = 0; e.vy = 0; }
  }
  game.message((ENT_DEF[type] ? ENT_DEF[type].name : 'NPC') + ' moved into this room.');
  renderHousingPanel();
  return true;
}

function removeNpcHousing(type) {
  if (!game.housing[type]) return false;
  delete game.housing[type];
  game.message((ENT_DEF[type] ? ENT_DEF[type].name : 'NPC') + ' is now unhoused.');
  renderHousingPanel();
  return true;
}

function validateHousingAssignments() {
  var changed = false;
  for (var type in game.housing) {
    var home = game.housing[type], room = checkHousingRoom(home.x, home.y);
    if (!room.valid) { delete game.housing[type]; changed = true; }
    else { home.key = room.key; home.homeX = room.homeX; home.homeY = room.homeY; }
  }
  if (changed && game.panelTab === 'housing') renderHousingPanel();
}

function updateTownTax(dt) {
  if (!game.townArrivals[E.TAXCOLLECTOR] || !game.housing[E.TAXCOLLECTOR]) return;
  game.taxT -= dt;
  if (game.taxT > 0) return;
  game.taxT = 60;
  var housed = 0;
  for (var type in game.housing) if (game.townArrivals[type]) housed++;
  game.taxSavings = Math.min(20, game.taxSavings + Math.max(1, Math.floor(housed / 3)));
  if (game.panelTab === 'town' && game.townNpcOpen && game.townNpcOpen.type === E.TAXCOLLECTOR) renderTownPanel();
}

function renderHousingPanel() {
  var root = $('panel-housing');
  if (!root || !game) return;
  var room = playerHousingRoom();
  var html = '<h3>Town Housing</h3><div class="town-service"><h4>Current Room</h4><div class="ddesc">' + room.reason +
    (room.valid ? ' (' + room.size + ' tiles)' : '') + '</div></div><div class="housing-list">';
  var residents = [];
  for (var type in game.townArrivals) if (game.townArrivals[type] && ENT_DEF[type]) residents.push(+type);
  residents.sort(function(a, b) { return ENT_DEF[a].name < ENT_DEF[b].name ? -1 : 1; });
  if (!residents.length) html += '<div class="ddesc">Town NPCs will appear as you progress.</div>';
  for (var i = 0; i < residents.length; i++) {
    var npcType = residents[i], home = game.housing[npcType];
    html += '<div class="housing-row"><div class="shop-name">' + ENT_DEF[npcType].name + '</div><div class="ddesc">' +
      (home ? 'Housed at ' + home.x + ', ' + home.y : 'Unhoused') + '</div>' +
      (home ? '<button class="tavern-buy" data-unhouse-type="' + npcType + '">Remove</button>' :
        '<button class="tavern-buy" data-house-type="' + npcType + '"' + (room.valid ? '' : ' disabled') + '>Assign Here</button>') + '</div>';
  }
  root.innerHTML = html + '</div>';
}

function startNewGame(name) {
  var seed = Math.floor(Math.random() * 2147483647);
  var evilSel = document.querySelector('input[name="evil"]:checked');
  var evil = evilSel ? evilSel.value : 'random';
  var diffSel = document.querySelector('input[name="difficulty"]:checked');
  var difficulty = diffSel ? diffSel.value : 'normal';
  activeWorldId = makeWorldId();
  activeWorldName = cleanWorldName(name);
  $('loading').classList.remove('hidden');
  $('loadprogress').innerHTML = '<div class="bar" style="width:15%"></div>';
  requestAnimationFrame(function() {
    $('loadprogress').innerHTML = '<div class="bar" style="width:70%"></div>';
    Achievements.unlocked = {};
    Achievements.total = 0;
    buildGame(seed, evil, difficulty);
    $('loadprogress').innerHTML = '<div class="bar" style="width:100%"></div>';
    $('loading').classList.add('hidden');
    $('mainmenu').classList.add('hidden');
    document.querySelector('#mainmenu h1').textContent = 'tree';
    var victory = document.getElementById('victory');
    if (victory && victory.parentNode) victory.parentNode.removeChild(victory);
    MOUSE.down = false;
    MOUSE.right = false;
    acc = 0;
    for (var k in KEY) KEY[k] = false;
    for (var j in KEY_JUST) KEY_JUST[j] = false;
    game.message('Welcome to ' + activeWorldName + '! Press H for the guide.');
    AudioSys.init();
    AudioSys.resume();
    saveGame(true);
  });
}

// ---------- Game methods (contract) ----------
function wireGameMethods() {
  game.message = function(text) {
    $('message').textContent = text;
    $('message').style.opacity = 1;
    game.messageTimer = 3;
  };

  game.spawnFloatingText = function(x, y, text, color) {
    game.fxTexts.push({ x: x, y: y, text: text, t: 1.0, color: color || '#ffe14d' });
  };

  game.spawnMinePuff = function(x, y, color) {
    game.fx.push({ type: 'break', x: x, y: y, t: 0.2, max: 0.2, seed: Math.random() * 100, color: color || '#c8c8c8' });
  };

  game.shake = function(mag, dur) {
    game.shakeMag = Math.max(game.shakeMag || 0, mag);
    game.shakeT = Math.max(game.shakeT || 0, dur || 0.3);
  };

  game.addPickup = function(x, y, id, count, reforge) {
    if (!count || count <= 0) return;
    var pickup = { nid:typeof Net !== 'undefined' ? ++Net.seq : 0, item: id, count: count, x: x, y: y, seed: Math.random() * 100, t: 0 };
    if (reforge) pickup.reforge = { name:reforge.name, dmgMul:reforge.dmgMul };
    game.pickups.push(pickup);
  };

  game.openBossBag = function(idx, stack) {
    if (!stack || !stack.bagBoss || !stack.bagDrops) return false;
    var dm = diffScale();
    var p = game.player;
    var drops = stack.bagDrops;
    for (var i = 0; i < drops.length; i++) {
      var d = drops[i];
      if (!d || d.count <= 0) continue;
      var c = d.count;
      if (dm.coin !== 1 && (d.id === I.COIN || d.id === I.GOLD || d.id === I.PLATINUM)) c = Math.max(1, Math.round(c * dm.coin));
      game.addPickup(p.x + (Math.random() * 40 - 20), p.y - 12, d.id, c);
    }
    p.inventory.removeAt(idx, 1);
    game.message('Opened Treasure Bag!');
    AudioSys.play('pickup');
    renderInventory();
    return true;
  };

  game.hitBoss = function(e, dmg, kbx, kby) {
    if (typeof Net !== 'undefined' && Net.claimHit(e, dmg, true)) { e.flash = 0.1; return; }
    if (e.armType && e.parent) { armHit(e.parent, e, dmg, game); return; }
    bossHit(e, dmg, kbx, kby, game);
  };

  game.damagePlayer = function(dmg, from, kbx) {
    var target = typeof multiplayerTarget === 'function' ? multiplayerTarget(game, from) : game.player;
    if (typeof Net !== 'undefined' && Net.damageRemote(target, dmg, kbx)) return;
    target.damage(dmg, from, kbx);
  };

  game.flash = function() {
    game.flashT = 0.3;
    $('screenflash').style.opacity = 0.5;
  };

  game.respawn = function() {
    var p = game.player;
    p.dying = false;
    p.respawnT = 0;
    p.hp = p.maxHp;
    p.mana = p.maxMana;
    p.vx = 0; p.vy = 0;
    p.invuln = 2;
    p.x = game.world.spawnX;
    p.y = game.world.spawnY;
    if (game.hardmode) clearSpawnHostiles();
    closePanel();
    $('deathscreen').classList.add('hidden');
  };

  game.deathscreen = function() {
    $('deathscreen').classList.remove('hidden');
  };

  game.placeDeathTombstone = function(px, py) {
    var cx = clamp(Math.floor(px / TILE), 2, game.world.W - 3);
    var cy = clamp(Math.floor(py / TILE), 2, game.world.H - 3);
    for (var radius = 0; radius <= 18; radius++) {
      for (var side = -1; side <= 1; side += 2) {
        if (radius === 0 && side === 1) continue;
        var tx = clamp(cx + radius * side, 1, game.world.W - 2);
        for (var oy = -5; oy <= 14; oy++) {
          var ty = clamp(cy + oy, 1, game.world.H - 2);
          if (game.world.get(tx, ty) === T.AIR && game.world.get(tx, ty - 1) === T.AIR &&
              (game.world.isSolid(tx, ty + 1) || game.world.isPlatform(tx, ty + 1))) {
            game.world.set(tx, ty, T.TOMBSTONE);
            game.fx.push({ type:'break', x:tx * TILE + 8, y:ty * TILE + 8, color:'#888892', t:0.35, max:0.35 });
            return true;
          }
        }
      }
    }
    return false;
  };

  game.spawnBoss = function(bossId) {
    if (typeof Net !== 'undefined' && Net.requestBoss(bossId)) return;
    if (game.lanternNight.active) endLanternNight('The lanterns fade as danger approaches.');
    if (bossId === 'kingslime') spawnKingSlime(game);
    else if (bossId === 'deerclops') spawnDeerclops(game);
    else if (bossId === 'darkmage') spawnOldOnesArmyBoss('darkmage', -1);
    else if (bossId === 'ogre') spawnOldOnesArmyBoss('ogre', -1);
    else if (bossId === 'betsy') spawnOldOnesArmyBoss('betsy', -1);
    else if (bossId === 'eyeofcthulhu') spawnEyeOfCthulhu(game);
    else if (bossId === 'eaterofworlds') spawnEaterOfWorlds(game);
    else if (bossId === 'brainofcthulhu') spawnBrainOfCthulhu(game);
    else if (bossId === 'queenbee') spawnQueenBee(game);
    else if (bossId === 'skeletron') spawnSkeletron(game);
    else if (bossId === 'wallofflesh') spawnWallOfFlesh(game);
    else if (bossId === 'twins') spawnTwins(game);
    else if (bossId === 'destroyer' || bossId === 'mechworm') spawnDestroyer(game);
    else if (bossId === 'skeletronprime' || bossId === 'skelprime') spawnSkeleton(game);
    else if (bossId === 'queenslime') spawnQueenSlime(game);
    else if (bossId === 'plantera') spawnPlantera(game);
    else if (bossId === 'golem') spawnGolem(game);
    else if (bossId === 'duke') spawnDuke(game);
    else if (bossId === 'empress') spawnEmpress(game);
    else if (bossId === 'cultist') spawnCultist(game);
    else if (bossId === 'moonlord') spawnMoonLord(game);
    else if (bossId === 'mourningwood') spawnMourningWood(game);
    else if (bossId === 'pumpking') spawnPumpking(game);
    else if (bossId === 'everscream') spawnEverscream(game);
    else if (bossId === 'santank') spawnSantank(game);
    else if (bossId === 'icequeen') spawnIceQueen(game);
    else if (bossId === 'martiansaucer') spawnMartianSaucer(game);
    else if (bossId === 'mothron') spawnMothron(game);
    else if (bossId === 'goblinwarlock') spawnGoblinWarlock(game);
    else if (bossId === 'piratecaptain') spawnPirateCaptain(game);
    else if (bossId === 'flyingdutchman') spawnFlyingDutchman(game);
    else if (bossId === 'lunar') spawnLunarPillar(game, 'solar');
    else if (bossId === 'lunarsolar') spawnLunarPillar(game, 'solar');
    else if (bossId === 'lunarvortex') spawnLunarPillar(game, 'vortex');
    else if (bossId === 'lunarnebula') spawnLunarPillar(game, 'nebula');
    else if (bossId === 'lunarstardust') spawnLunarPillar(game, 'stardust');
  };

  game.onSpecialTileBroken = function(t, tx, ty) {
    var x = tx * TILE + 8, y = ty * TILE + 8;
    if (t === T.SHADOWORB || t === T.CRIMSONHEART) {
      game.evilObjectsBroken++;
      var lootCorrupt = [I.MUSKET, I.VILETHORN, I.BALLOHURT, I.BANDOFSTARPOWER];
      var lootCrimson = [I.UNDERTAKER, I.CRIMSONROD, I.ROTTENFORK, I.PANICNECKLACE];
      var loot = game.world.evil === 'crimson' ? lootCrimson : lootCorrupt;
      game.addPickup(x, y, loot[(game.evilObjectsBroken - 1) % loot.length], 1);
      game.addPickup(x, y, game.world.evil === 'crimson' ? I.CRIMTANE : I.DEMONITE, 4 + game.evilObjectsBroken % 4);
      if (game.world.evil === 'corrupt' && game.evilObjectsBroken === 1) game.addPickup(x, y, I.SHADOWORB, 1);
      for (var eo = game.world.evilObjects.length - 1; eo >= 0; eo--) {
        if (game.world.evilObjects[eo].x === tx && game.world.evilObjects[eo].y === ty) game.world.evilObjects.splice(eo, 1);
      }
      Achievements.unlock('evilobject', game);
      AudioSys.play('roar');
      game.flash();
      if (game.evilObjectsBroken % 3 === 0) {
        game.message(game.world.evil === 'crimson' ? 'The Brain of Cthulhu has awoken!' : 'The Eater of Worlds has awoken!');
        game.spawnBoss(game.world.evil === 'crimson' ? 'brainofcthulhu' : 'eaterofworlds');
      } else if (game.evilObjectsBroken % 3 === 1) {
        game.message('A horrible chill goes down your spine...');
      } else {
        game.message('Screams echo around you...');
      }
      return;
    }
    if (t === T.LARVA) {
      for (var lv = game.world.larvae.length - 1; lv >= 0; lv--) {
        if (game.world.larvae[lv].x === tx && game.world.larvae[lv].y === ty) game.world.larvae.splice(lv, 1);
      }
      Achievements.unlock('larva', game);
      AudioSys.play('roar');
      game.flash();
      game.message('Queen Bee has awoken!');
      game.spawnBoss('queenbee');
    }
    if (t === T.ALTAR) {
      // smashing a Demon/Crimson Altar blesses the world with hardmode ore veins
      var tier = game.altarsSmashed % 3;
      var ores;
      if (tier === 0) ores = [T.COBALT, T.PALLADIUM, T.ORICHALCUM];
      else if (tier === 1) ores = [T.MYTHRIL, T.ORICHALCUM, T.ADAMANTITE];
      else ores = [T.ADAMANTITE, T.TITANIUM, T.PALLADIUM];
      var ore = ores[Math.floor(Math.random() * ores.length)];
      var n = game.world.spawnOreVein(tx, ty, ore);
      game.altarsSmashed++;
      for (var al = game.world.altars.length - 1; al >= 0; al--) {
        if (game.world.altars[al].x === tx && game.world.altars[al].y === ty) game.world.altars.splice(al, 1);
      }
      var oreName = (ITEMS[TILE_DROP[ore]] || {}).name || 'ore';
      game.message('The Altar shatters! ' + oreName + ' veins appear in the world!');
      game.spawnFloatingText(x, y, 'Altar smashed', '#ffd84d');
      Achievements.unlock('altar', game);
      AudioSys.play('roar');
      game.flash();
    }
    if (t === T.TOMBSTONE) {
      var night = game.timeOfDay < 0.25 || game.timeOfDay > 0.75;
      var belowSurface = ty > game.world.surfaceY[clamp(tx, 0, game.world.W - 1)];
      var graveyard = game.world.graveyardStrengthAt(game.player.x, game.player.y) >= 5;
      var ghosts = 0;
      for (var gh = 0; gh < game.entities.length; gh++) if (!game.entities[gh].dead && game.entities[gh].type === E.GHOST) ghosts++;
      if (ghosts < 2 && (night || belowSurface || graveyard) && Math.random() < 0.5) {
        spawnEntity(game, E.GHOST, tx * TILE + 8, ty * TILE + 8);
        game.message('A Ghost rises from the disturbed grave!');
      }
    }
  };

  game.startHardmode = function() {
    if (game.hardmode) return;
    game.hardmode = true;
    game.message('The Wall of Flesh has been destroyed! The world awakens...');
    AudioSys.play('roar');
    var veins = game.world.startHardmode();
    game.message('Ancient ores have been revealed!');
    if (game.world.spreadFrontier && game.world.spreadFrontier.length) {
      game.message('Corruption and Hallow creep through the world!');
      Achievements.unlock('spread', game);
    }
    // Cursed skull: the guide is gone, he gave his life.
    for (var i = 0; i < game.entities.length; i++) {
      if (game.entities[i].type === E.GUIDE) game.entities[i].dead = true;
    }
    spawnNpcs();
  };

  game.startEvent = function(eventId) {
    if (game.lanternNight.active) endLanternNight('The lanterns fade as danger approaches.');
    if (eventId === 'pumpkinmoon') {
      game.event = { type: 'pumpkinmoon', wave: 0, t: 0, state: 'wave', msg: true };
      game.message('The Pumpkin Moon rises!');
    } else if (eventId === 'frostmoon') {
      game.event = { type: 'frostmoon', wave: 0, t: 0, state: 'wave', msg: true };
      game.message('The Frost Moon draws near!');
    } else if (eventId === 'martianmadness') {
      game.event = { type: 'martianmadness', wave: 0, t: 0, state: 'wave', msg: true };
      game.message('Martian probes approach!');
    } else if (eventId === 'goblinarmy') {
      game.event = { type: 'goblinarmy', wave: 0, t: 0, state: 'wave', msg: true };
      game.message('The Goblin Army is approaching!');
    } else if (eventId === 'pirateinvasion') {
      game.event = { type: 'pirateinvasion', wave: 0, t: 0, state: 'wave', msg: true };
      game.message('The Pirates have arrived!');
    } else if (eventId === 'solareclipse') {
      game.event = { type: 'solareclipse', wave: 0, t: 0, state: 'wave', msg: true };
      game.message('The sun is eclipsed! Monsters pour forth!');
    } else if (eventId === 'bloodmoon') {
      game.event = { type:'bloodmoon', mode:'timed', spawnT:0 };
      game.message('The Blood Moon is rising...');
    } else if (eventId === 'slimerain') {
      game.event = {
        type:'slimerain', mode:'slimeKills', kills:0,
        target:game.bossesDefeated.kingslime ? 25 : 50,
        kingSpawned:false, spawnT:0
      };
      game.message('Slime is falling from the sky!');
    } else if (eventId === 'frostlegion') {
      game.event = { type:'frostlegion', wave:0, t:0, state:'wave', msg:true };
      game.message('The Frost Legion is approaching!');
    }
    AudioSys.play('roar');
  };

  game.anyBossAlive = function() {
    for (var i = 0; i < game.entities.length; i++) {
      var e = game.entities[i];
      if (e.boss && !e.armType && !e.dead) return true;
    }
    return false;
  };

  game.checkTorchGod = function(tx, ty) {
    if (game.player.torchGodFavor || game.torchGod) return;
    if (!game.world.isUnderground(tx * TILE + 8, ty * TILE + 8)) return;
    var torches = [];
    var radius = 18;
    for (var y = Math.max(1, ty - radius); y <= Math.min(game.world.H - 2, ty + radius); y++) {
      for (var x = Math.max(1, tx - radius); x <= Math.min(game.world.W - 2, tx + radius); x++) {
        if (game.world.get(x, y) === T.TORCH) torches.push({ x:x, y:y });
      }
    }
    if (torches.length < TORCH_GOD_THRESHOLD) return;
    for (var i = torches.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var swap = torches[i]; torches[i] = torches[j]; torches[j] = swap;
    }
    game.torchGod = { torches:torches, next:0, shotT:0.5, finishT:0 };
    game.message('The Torch God is enraged! Survive the flames!');
    AudioSys.play('roar');
  };

  game.startLunarPillars = function() {
    if (game.pillarsSpawned) return;
    game.pillarsSpawned = true;
    game.pillarsDestroyed = 0;
    var w = game.world;
    var types = ['solar', 'vortex', 'nebula', 'stardust'];
    var fracs = [0.18, 0.40, 0.62, 0.84];
    for (var i = 0; i < 4; i++) {
      var fx2 = Math.floor(w.W * fracs[i]);
      var sy = clamp(w.surfaceY[fx2] - 34, 4, w.H - 4);
      var p = spawnLunarPillar(game, types[i]);
      p.x = fx2 * TILE;
      p.y = sy * TILE;
      p.anchorY = sy * TILE;
    }
    game.message('The Celestial Pillars have descended! Destroy their shields to weaken them.');
  };

  game.lunarPillarProgress = function() {
    var alive = 0;
    if (!game.lunarPillars) return 4;
    for (var i = 0; i < game.lunarPillars.length; i++) {
      if (!game.lunarPillars[i].dead) alive++;
    }
    return alive;
  };

  game.onEnemyKilled = function(e) {
    game.kills++;
    recordBestiary(game, e, true);
    if (e.ooaEnemy) oldOnesArmyEnemyKilled(e);
    if (game.event && game.event.type === 'slimerain' && !game.event.kingSpawned && e.eventEnemy &&
        (e.type === E.SLIME || e.type === E.PINKSLIME)) {
      game.event.kills++;
      if (game.event.kills >= game.event.target) {
        game.event.kingSpawned = true;
        game.message('King Slime has awoken!');
        game.spawnBoss('kingslime');
      }
    }
    if (e.type === E.WYVERN) game.message('You slayed a Wyvern!');
    if (e.type === E.FLOWINVADER && game.pillarsSpawned && game.pillarsDestroyed < 4) {
      for (var fi = 0; fi < 2; fi++) {
        var cell = spawnEntity(game, E.STARDJUSTCELL, e.x + (fi ? 18 : -18), e.y + 8);
        cell.eventEnemy = true;
      }
    }
    if (e.type === E.MARTIANPROBE && game.hardmode && game.bossesDefeated.golem && !game.event) {
      var p2 = game.player;
      var surf2 = game.world.surfaceY[clamp(Math.floor(p2.x / TILE), 0, game.world.W - 1)] * TILE;
      if (p2.y < surf2 - 8 * TILE) {
        game.startEvent('martianmadness');
      }
    }
    // lunar pillar shields are drained by killing the pillar's guardians
    if (game.lunarPillars) {
      for (var pi = 0; pi < game.lunarPillars.length; pi++) {
        var pl = game.lunarPillars[pi];
        if (pl.dead || pl.shieldDown || pl.shieldHp <= 0) continue;
        var pillarPool = pl.pillarEnemies || [pl.pillarEnemy];
        if (pillarPool.indexOf(e.type) < 0) continue;
        if (dist(e.x, e.y, pl.x, pl.y) < 7 * TILE) {
          pl.shieldHp -= 300;
          game.spawnFloatingText(pl.x, pl.y - 60, 'Shield: ' + Math.max(0, Math.round(pl.shieldHp / 100)) + '%', pl.color);
          if (pl.shieldHp <= 0) {
            pl.shieldDown = true;
            pl.shieldHp = 0;
            game.message('The ' + pl.name + ' shield has shattered!');
            AudioSys.play('roar');
            game.flash();
          }
        }
      }
    }
  };

  game.onBossDefeated = function(bossId) {
    var b = game.bossesDefeated;
    Achievements.unlock('firstboss', game);
    var achMap = {
      kingslime: 'kingslime', eyeofcthulhu: 'eyeofcthulhu',
      eaterofworlds: 'eaterofworlds', brainofcthulhu: 'brainofcthulhu',
      queenbee: 'queenbee', skeletron: 'skeletron', wallofflesh: 'wallofflesh',
      twins: 'twins', destroyer: 'destroyer', skelprime: 'skelprime',
      queenslime: 'queenslime', plantera: 'plantera', golem: 'golem',
      duke: 'duke', empress: 'empress', cultist: 'cultist', moonlord: 'moonlord',
      deerclops: 'deerclops'
    };
    if (achMap[bossId]) Achievements.unlock(achMap[bossId], game);
    scheduleLanternNight(bossId);
    if (bossId === 'wallofflesh') {
      game.startHardmode();
    } else if (bossId === 'moonlord' && !game.victory) {
      game.victory = true;
      game.message('You have defeated the Moon Lord! The world is saved!');
      var cols = ['#ffe14d', '#ff4d6d', '#6bc8ff', '#6bff8a', '#c8a8f0', '#ffffff'];
      for (var i = 0; i < 60; i++) {
        game.fx.push({
          type: 'break',
          x: game.player.x + (Math.random() * 400 - 200),
          y: game.player.y - 160 + Math.random() * 320,
          t: 1.5, max: 1.5,
          seed: Math.random() * 100,
          color: cols[Math.floor(Math.random() * cols.length)]
        });
      }
      showVictory();
    } else if (bossId === 'kingslime') {
      game.message('King Slime defeated! The slimes bow.');
      if (game.event && game.event.type === 'slimerain' && game.event.kingSpawned) {
        Achievements.unlock('slimerain', game);
        endEvent('The Slime Rain has ended!');
      }
    } else if (bossId === 'deerclops') {
      game.message('Deerclops has melted back into the snow.');
    } else if (bossId === 'eyeofcthulhu') {
      game.message('The Eye has been vanquished!');
    } else if (bossId === 'eaterofworlds') {
      game.message('The Eater of Worlds is no more!');
      if (!game._meteorFallen) {
        game._meteorFallen = true;
        game.message('A meteorite has fallen from the sky!');
        game.world.spawnMeteor();
      }
    } else if (bossId === 'brainofcthulhu') {
      game.message('The Brain of Cthulhu is crushed!');
      if (!game._meteorFallen) {
        game._meteorFallen = true;
        game.message('A meteorite has fallen from the sky!');
        game.world.spawnMeteor();
      }
    } else if (bossId === 'queenbee') {
      game.message('Queen Bee defeated!');
    } else if (bossId === 'skeletron') {
      game.message('Skeletron defeated! The Dungeon is yours.');
      if (game.world.openDungeon) game.world.openDungeon();
    } else if (bossId === 'golem') {
      game.message('The Golem has fallen! The Lihzahrd temple is yours.');
      game.cultistRitualReady = true;
      game.cultistRitualActive = false;
      game.cultistRespawnT = 2;
    } else if (bossId === 'plantera') {
      game.message('The jungle breathes again. The Temple is unlocked.');
    } else if (bossId === 'queenslime') {
      game.message('Queen Slime defeated!');
    } else if (bossId === 'duke') {
      game.message('Duke Fishron defeated!');
    } else if (bossId === 'empress') {
      game.message('The Empress of Light has been slain!');
    } else if (bossId === 'cultist') {
      game.cultistRitualReady = false;
      game.cultistRitualActive = false;
      game.message('The Lunatic Cultist has fallen! The Moon Lord stirs...');
      game.startLunarPillars();
    } else if (bossId === 'lunar') {
      var destroyed = 0;
      var lastPillar = null;
      for (var pp = 0; pp < game.lunarPillars.length; pp++) {
        var ppe = game.lunarPillars[pp];
        if (ppe.dead) {
          destroyed++;
          lastPillar = ppe;
        }
      }
      if (destroyed > game.pillarsDestroyed) {
        game.pillarsDestroyed = destroyed;
        if (lastPillar) {
          game.message('The ' + lastPillar.name + ' has been destroyed!');
          Achievements.unlock(lastPillar.sub + 'pillar', game);
        }
        if (destroyed >= 4) {
          Achievements.unlock('celestial', game);
          game.message('All Celestial Pillars destroyed! The Moon Lord can now be summoned.');
          var cols2 = ['#ff8a3d', '#3dff9d', '#c85cff', '#6bc8ff'];
          for (var ci = 0; ci < 40; ci++) {
            game.fx.push({
              type: 'break',
              x: game.player.x + (Math.random() * 400 - 200),
              y: game.player.y - 160 + Math.random() * 320,
              t: 1.4, max: 1.4,
              seed: Math.random() * 100,
              color: cols2[Math.floor(Math.random() * cols2.length)]
            });
          }
        }
      }
    } else if (b.twins && b.destroyer && b.skelprime && !game.mechDone) {
      game.mechDone = true;
      game.message('The mechanical menace is gone. The jungle calls...');
    }
  };

  game.checkBossCompletion = function() {
    var b = game.bossesDefeated;
    if (b.twins && b.destroyer && b.skelprime && !game.victory && !game.mechDone) {
      game.mechDone = true;
      game.message('You defeated all three mechanical bosses! The Hallow shines.');
      var cols = ['#ffe14d', '#ff4d6d', '#6bc8ff', '#6bff8a', '#c8a8f0'];
      for (var i = 0; i < 30; i++) {
        game.fx.push({
          type: 'break',
          x: game.player.x + (Math.random() * 300 - 150),
          y: game.player.y - 100 + Math.random() * 200,
          t: 1.2, max: 1.2,
          seed: Math.random() * 100,
          color: cols[Math.floor(Math.random() * cols.length)]
        });
      }
    }
  };

  function showVictory() {
    var ov = document.getElementById('victory');
    if (ov) { ov.classList.remove('hidden'); return; }
    ov = document.createElement('div');
    ov.id = 'victory';
    ov.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(5,5,15,0.92);color:#ffe14d;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:50;font-family:monospace;text-align:center;';
    ov.innerHTML = '<div style="font-size:42px;margin-bottom:14px;text-shadow:0 0 18px #ffe14d;">YOU WIN!</div>' +
      '<div style="font-size:16px;color:#c8d8ff;margin-bottom:8px;">The Moon Lord has been defeated.</div>' +
      '<div style="font-size:14px;color:#8aa;margin-bottom:24px;">Your Hallow is at peace... for now.</div>' +
      '<div style="font-size:12px;color:#667;">Total kills: <span id="vickills"></span></div>';
    document.body.appendChild(ov);
    var kl = document.getElementById('vickills');
    if (kl) kl.textContent = game.kills || 0;
  }
  game.showVictory = showVictory;

  game.placeSpecial = function(special) {
    var tile = special === 'workbench' ? T.WORKBENCH : (special === 'furnace' ? T.FURNACE : T.ANVIL);
    var p = game.player;
    var px = Math.floor(p.x / TILE), py = Math.floor(p.y / TILE);
    var dxs = [0, 0, -1, 1, -1, 1, -1, 1], dys = [-1, 1, 0, 0, -1, -1, 1, 1];
    for (var i = 0; i < 8; i++) {
      var tx = px + dxs[i], ty = py + dys[i];
      if (!game.world.inBounds(tx, ty)) continue;
      if (game.world.get(tx, ty) === T.AIR && !game.world.overlapsPlayer(tx, ty, p)) {
        game.world.set(tx, ty, tile);
        AudioSys.play('place');
        return true;
      }
    }
    return false;
  };
}

// ---------- Main loop ----------
function loop(now) {
  requestAnimationFrame(loop);
  if (!lastNow) lastNow = now;
  var dt = Math.min(0.05, (now - lastNow) / 1000);
  lastNow = now;

  if (!game || !game.started) return;
  if (game.paused || game.netDisconnected) return;

  // real-time fps
  game.fpsAcc += dt;
  game.fpsCount++;
  if (game.fpsAcc >= 0.5) {
    game.fps = Math.round(game.fpsCount / game.fpsAcc);
    game.fpsAcc = 0; game.fpsCount = 0;
  }

  acc += dt;
  var steps = 0;
  while (acc >= 1 / 60 && steps < 4) {
    step(1 / 60);
    acc -= 1 / 60;
    steps++;
  }

  render();
}

function step(dt) {
  Time.seconds += dt;
  Time.frame++;

  if (typeof Net === 'undefined' || !Net.isClient()) game.autosaveT += dt;
  if (game.autosaveT >= 60 && (typeof Net === 'undefined' || !Net.isClient())) {
    game.autosaveT = 0;
    saveGame(true);
  }

  handleKeys();
  if (typeof Net !== 'undefined') Net.update(dt);

  // mouse wheel hotbar scroll
  if (MOUSE.wheel !== 0) {
    game.player.inventory.selected = (game.player.inventory.selected + MOUSE.wheel + 10) % 10;
    MOUSE.wheel = 0;
  }

  // decay overlays
  updateMessage(dt);
  updateFlash(dt);

  // player
  game.player.update(game);

  // entities
  for (var i = 0; i < game.entities.length && (typeof Net === 'undefined' || !Net.isClient()); i++) {
    var e = game.entities[i];
    if (e.dead) continue;
    discoverBestiaryEntity(game, e);
    updateEntityStatuses(e, dt);
    if (e.dead) continue;
    if (e.armType) {
      if (e.parent && e.parent.dead) e.dead = true;
      continue;
    }
    if (e.boss) bossStep(e, game);
    else if (e.ooaSentry) oldOnesArmySentryStep(e, game);
    else if (e.minion) minionStep(e, game);
    else enemyStep(e, game);
  }
  for (var j = game.entities.length - 1; j >= 0; j--) {
    if (game.entities[j].dead) game.entities.splice(j, 1);
  }

  // projectiles / pickups / fx
  updateProjectiles();
  updatePickups();
  updateFx(dt);

  // camera
  updateCamera(dt);

  // day/night
  game.timeOfDay += dt * 0.002;
  if (game.timeOfDay >= 1) game.timeOfDay -= 1;
  if (typeof Net === 'undefined' || !Net.isClient()) { checkDawn(); updateWeather(dt); updateStarfall(dt); }

  // crafting stations
  game.world.nearbyStations = game.world.findStations(game.player.x, game.player.y);

  // ambient spawning
  if (typeof Net === 'undefined' || !Net.isClient()) { updateSpawning(dt); updateCritterSpawning(dt); updateStrangePlants(dt); }

  // plantera bulbs
  if (typeof Net === 'undefined' || !Net.isClient()) updateBulbs();

  // post-Golem Dungeon ritual
  if (typeof Net === 'undefined' || !Net.isClient()) updateCultistRitual(dt);

  // events
  if (typeof Net === 'undefined' || !Net.isClient()) updateEvents(dt);

  // underground Torch God challenge
  if (typeof Net === 'undefined' || !Net.isClient()) updateTorchGod(dt);

  // Golfer golf challenge
  if (typeof Net === 'undefined' || !Net.isClient()) updateGolf(dt);

  // hardmode biome spread (slow creep of evil/Hallow into stone/dirt)
  if (game.hardmode && (typeof Net === 'undefined' || !Net.isClient())) {
    game.spreadAcc += dt;
    if (game.spreadAcc >= SPREAD_INTERVAL) {
      game.spreadAcc = 0;
      game.world.spreadTick();
    }
  }

  // right-click interaction
  if (MOUSE.rightJust) {
    MOUSE.rightJust = false;
    if (!game.panelOpen) {
      if (!tryActivateEterniaStand() && !tryTogglePartyCenter() && !tryRescueTownNpc() && !tryOpenGuideNpc() && !tryOpenTavernkeep() && !tryOpenTownNpc() && !tryOpenPylon()) tryOpenChest();
    }
  }

  // achievements
  checkAchievements();
  if (typeof Net === 'undefined' || !Net.isClient()) game.townArrivalT -= dt;
  if (game.townArrivalT <= 0 && (typeof Net === 'undefined' || !Net.isClient())) { game.townArrivalT = 1; updateTownArrivals(); updateTownRescues(); }
  game.housingT -= dt;
  if (game.housingT <= 0 && (typeof Net === 'undefined' || !Net.isClient())) { game.housingT = 2; validateHousingAssignments(); }
  if (typeof Net === 'undefined' || !Net.isClient()) updateTownTax(dt);

  // minimap rebuild when world changed
  if (game.world.dirty) game.minimap = null;

  // UI
  updateHotbar();
  updateHud();
  updateBossBars();
  updateCrosshair();
  updateInteract();
}

// ---------- Message / flash ----------
function updateMessage(dt) {
  if (game.messageTimer > 0) {
    game.messageTimer -= dt;
    if (game.messageTimer <= 0) $('message').style.opacity = 0;
  }
}

function updateFlash(dt) {
  if (game.flashT > 0) {
    game.flashT -= dt;
    $('screenflash').style.opacity = Math.max(0, (game.flashT / 0.3) * 0.5);
  }
  if (game.shakeT > 0) {
    game.shakeT -= dt;
    if (game.shakeT <= 0) game.shakeMag = 0;
  }
}

// ---------- Camera ----------
function updateCamera(dt) {
  var p = game.player;
  game.cam.x = lerp(game.cam.x, p.x, 0.09);
  game.cam.y = lerp(game.cam.y, p.y - 10, 0.09);
  var hw = canvas.width / 2, hh = canvas.height / 2;
  var mw = game.world.W * TILE, mh = game.world.H * TILE;
  if (mw <= canvas.width) game.cam.x = mw / 2;
  else game.cam.x = clamp(game.cam.x, hw, mw - hw);
  if (mh <= canvas.height) game.cam.y = mh / 2;
  else game.cam.y = clamp(game.cam.y, hh, mh - hh);
}

// ---------- Projectiles ----------
function updateProjectiles() {
  game.projectiles.update(function(o) {
    o.life -= 1 / 60;
    if (o.life <= 0) { explodeProjectile(o); recoverProjectileItem(o); o.dead = true; return; }
    o.age = (o.age || 0) + 1 / 60;

    if (o.fallenStar) {
      var fsnx = o.x + o.vx, fsny = o.y + o.vy;
      o.starHits = o.starHits || [];
      for (var fsi = 0; fsi < game.entities.length; fsi++) {
        var fse = game.entities[fsi];
        if (fse.dead || fse.dmg <= 0 || fse.minion || fse.armType || o.starHits.indexOf(fse) >= 0) continue;
        if (Math.abs(fse.x - fsnx) <= fse.w / 2 + 5 && Math.abs(fse.y - fsny) <= fse.h / 2 + 6) {
          o.starHits.push(fse);
          if (fse.boss) game.hitBoss(fse, 1000, 0, 0);
          else hitEntity(fse, 1000, 0, 0, game);
        }
      }
      if (game.world.solidAt(fsnx, fsny) || game.world.platformAt(fsnx, fsny)) {
        game.addPickup(o.x, o.y - 4, I.FALLENSTAR, 1);
        if (game.pickups.length) game.pickups[game.pickups.length - 1].dawnStar = true;
        game.fx.push({ type:'cast', x:o.x, y:o.y, t:0.25, max:0.25, color:'#ffe88a' });
        o.dead = true;
        return;
      }
      o.x = fsnx;
      o.y = fsny;
      if (o.x < 0 || o.x > game.world.W * TILE || o.y > game.world.H * TILE) o.dead = true;
      return;
    }

    if (o.channelBeam && o.sourcePlayer) {
      if (o.sourcePlayer.dying || !MOUSE.down || game.panelOpen) { o.dead = true; return; }
      o.manaT -= 1 / 60;
      if (o.manaT <= 0) {
        if (o.sourcePlayer.mana < o.manaCost) { o.dead = true; game.message('Not enough mana!'); return; }
        o.sourcePlayer.mana -= o.manaCost;
        o.manaT += o.manaInterval;
      }
      var beamAng = Math.atan2(MOUSE.wy - (o.sourcePlayer.y - 8), MOUSE.wx - o.sourcePlayer.x);
      o.x = o.sourcePlayer.x;
      o.y = o.sourcePlayer.y - 8;
      o.vx = Math.cos(beamAng);
      o.vy = Math.sin(beamAng);
      var beamLength = o.beamRange;
      for (var br = 12; br <= o.beamRange; br += 8) {
        if (game.world.solidAt(o.x + o.vx * br, o.y + o.vy * br)) { beamLength = br - 8; break; }
      }
      o.beamEndX = o.x + o.vx * beamLength;
      o.beamEndY = o.y + o.vy * beamLength;
      beamHitEnemies(o);
      return;
    }

    if (o.deployMode) {
      if (o.deployMode === 'sphere') {
        var snx = o.x + o.vx, sny = o.y + o.vy;
        if (!game.world.solidAt(snx, sny)) { o.x = snx; o.y = sny; }
        else { o.vx = 0; o.vy = 0; }
      }
      if (o.deployMode === 'wall') {
        zoneHitEnemies(o);
        return;
      }
      o.deployT = (o.deployT || 0) - 1 / 60;
      if (o.deployT <= 0) {
        o.deployT = o.deployInterval || 0.35;
        if (o.deployMode === 'cloud') {
          game.projectiles.add({
            x:o.x + (Math.random() - 0.5) * 26, y:o.y + 8, vx:0, vy:7,
            dmg:Math.max(1, Math.round(o.dmg * (o.deployDamageMul || 1))), type:o.deployProj,
            owner:'player', life:1.8, color:o.color, magic:true, dead:false
          });
        } else {
          var sphereTarget = nearestEnemy(o.x, o.y);
          if (sphereTarget && dist(o.x, o.y, sphereTarget.x, sphereTarget.y) < 420) {
            var sphereAng = Math.atan2(sphereTarget.y - o.y, sphereTarget.x - o.x);
            game.projectiles.add({
              x:o.x, y:o.y, vx:Math.cos(sphereAng) * 10, vy:Math.sin(sphereAng) * 10,
              dmg:Math.max(1, Math.round(o.dmg * (o.deployDamageMul || 1))), type:o.deployProj,
              owner:'player', life:1.2, homing:!!o.deployHoming, color:o.color, magic:true, dead:false
            });
          }
        }
      }
      return;
    }

    if (o.mineArmed) {
      var mineTarget = nearestEnemy(o.x, o.y);
      if (mineTarget && dist(o.x, o.y, mineTarget.x, mineTarget.y) <= o.mineTrigger) {
        explodeProjectile(o);
        o.dead = true;
      }
      return;
    }

    if (o.spear && o.sourcePlayer) {
      if (o.sourcePlayer.dying) { o.dead = true; return; }
      var spearPhase = clamp(o.age / o.spearDuration, 0, 1);
      var spearDistance = 18 + Math.sin(spearPhase * Math.PI) * o.spearReach;
      o.vx = Math.cos(o.spearAng);
      o.vy = Math.sin(o.spearAng);
      o.x = o.sourcePlayer.x + o.vx * spearDistance;
      o.y = o.sourcePlayer.y - 8 + o.vy * spearDistance;
      projHitEnemy(o);
      return;
    }

    if (o.flail && o.sourcePlayer) {
      if (o.sourcePlayer.dying) { o.dead = true; return; }
      var flailPhase = clamp(o.age / o.flailDuration, 0, 1);
      var flailDistance, flailAngle = o.flailAng;
      if (flailPhase < 0.35) flailDistance = o.flailReach * flailPhase / 0.35;
      else if (flailPhase < 0.7) {
        flailDistance = o.flailReach;
        flailAngle += (flailPhase - 0.35) / 0.35 * Math.PI * 1.25;
      } else {
        flailDistance = o.flailReach * (1 - (flailPhase - 0.7) / 0.3);
        flailAngle += Math.PI * 1.25;
      }
      o.vx = Math.cos(flailAngle);
      o.vy = Math.sin(flailAngle);
      o.x = o.sourcePlayer.x + o.vx * flailDistance;
      o.y = o.sourcePlayer.y - 8 + o.vy * flailDistance;
      projHitEnemy(o);
      return;
    }

    if (o.yoyo && o.sourcePlayer) {
      if (o.sourcePlayer.dying) { o.dead = true; return; }
      var yoyoPhase = clamp(o.age / o.yoyoDuration, 0, 1);
      var ydx = MOUSE.wx - o.sourcePlayer.x, ydy = MOUSE.wy - (o.sourcePlayer.y - 8);
      var yd = Math.sqrt(ydx * ydx + ydy * ydy) || 1;
      var yoyoDistance = Math.min(o.yoyoReach, yd);
      var yoyoScale = yoyoPhase < 0.18 ? yoyoPhase / 0.18 : (yoyoPhase > 0.82 ? (1 - yoyoPhase) / 0.18 : 1);
      o.vx = ydx / yd;
      o.vy = ydy / yd;
      o.x = o.sourcePlayer.x + o.vx * yoyoDistance * yoyoScale;
      o.y = o.sourcePlayer.y - 8 + o.vy * yoyoDistance * yoyoScale;
      projHitEnemy(o);
      if (o.yoyoExtraProj !== undefined && yoyoPhase >= 0.18 && yoyoPhase <= 0.82) {
        o.extraCd = (o.extraCd || 0) - 1 / 60;
        if (o.extraCd <= 0) {
          o.extraCd = o.extraInterval || 0.4;
          var yt = nearestEnemy(o.x, o.y);
          var ya = yt ? Math.atan2(yt.y - o.y, yt.x - o.x) : o.age * 9;
          game.projectiles.add({
            x:o.x, y:o.y, vx:Math.cos(ya) * (o.extraProjSpeed || 7), vy:Math.sin(ya) * (o.extraProjSpeed || 7),
            dmg:Math.max(1, Math.round(o.dmg * (o.extraDamageMul || 0.5))), type:o.yoyoExtraProj,
            owner:'player', life:1.3, color:o.color, melee:true, dead:false
          });
        }
      }
      return;
    }

    if (o.controlled && o.sourcePlayer) {
      if (o.sourcePlayer.dying) { o.dead = true; return; }
      if (o.controlledMagic && (!MOUSE.down || game.panelOpen)) { o.dead = true; return; }
      if (!MOUSE.down) o.controlledReturning = true;
      var ctx = o.controlledReturning ? o.sourcePlayer.x : MOUSE.wx;
      var cty = o.controlledReturning ? o.sourcePlayer.y - 8 : MOUSE.wy;
      if (!o.controlledReturning) {
        var cpx = ctx - o.sourcePlayer.x, cpy = cty - (o.sourcePlayer.y - 8);
        var cpd = Math.sqrt(cpx * cpx + cpy * cpy) || 1;
        if (cpd > o.controlledReach) {
          ctx = o.sourcePlayer.x + cpx / cpd * o.controlledReach;
          cty = o.sourcePlayer.y - 8 + cpy / cpd * o.controlledReach;
        }
      }
      var cdx = ctx - o.x, cdy = cty - o.y;
      var cd = Math.sqrt(cdx * cdx + cdy * cdy) || 1;
      if (o.controlledReturning && cd < 14) { o.dead = true; return; }
      o.vx = cdx / cd * Math.min(o.controlledSpeed, cd);
      o.vy = cdy / cd * Math.min(o.controlledSpeed, cd);
      if (game.world.solidAt(o.x + o.vx, o.y + o.vy)) {
        if (o.controlledMagic) { o.dead = true; return; }
        o.controlledReturning = true;
      }
      else { o.x += o.vx; o.y += o.vy; }
      projHitEnemy(o);
      return;
    }

    if (o.returnAt !== undefined && o.age >= o.returnAt) o.returning = true;
    if (o.returning && o.sourcePlayer) {
      var rdx = o.sourcePlayer.x - o.x, rdy = o.sourcePlayer.y - 8 - o.y;
      var rd = Math.sqrt(rdx * rdx + rdy * rdy) || 1;
      if (rd < 14) { o.dead = true; return; }
      o.vx = rdx / rd * o.returnSpeed;
      o.vy = rdy / rd * o.returnSpeed;
    }

    // homing magic bolts
    if (o.homing && !o.returning) {
      var tgt = nearestEnemy(o.x, o.y);
      if (tgt) {
        var cur = Math.atan2(o.vy, o.vx);
        var want = Math.atan2(tgt.y - o.y, tgt.x - o.x);
        var na = cur + clamp(angDiff(cur, want), -0.08, 0.08);
        var sp = Math.sqrt(o.vx * o.vx + o.vy * o.vy);
        o.vx = Math.cos(na) * sp;
        o.vy = Math.sin(na) * sp;
      }
    }

    if (o.windAffected && game.weather) {
      o.vx += game.weather.windSpeed / 1800;
      o.vy += Math.sin((o.age || 0) * 5 + o.x * 0.01) * 0.008;
    }
    if (o.gravity && !o.returning) o.vy += o.gravity;

    // move + collide tiles
    var nx = o.x + o.vx, ny = o.y + o.vy;
    var hitWall = false;
    if (!o.ignoreTiles && game.world.solidAt(nx, o.y)) {
      if (o.bounces) { o.vx = -o.vx; o.bounces--; nx = o.x + o.vx; }
      else hitWall = true;
    }
    if (!o.ignoreTiles && game.world.solidAt(o.x, ny)) {
      if (o.bounces) { o.vy = -o.vy; o.bounces--; ny = o.y + o.vy; }
      else hitWall = true;
    }
    if (hitWall) {
      if (o.mine) {
        o.mineArmed = true;
        o.vx = 0; o.vy = 0; o.gravity = 0;
        o.life = o.mineDuration || 8;
        return;
      }
      explodeProjectile(o);
      if (o.type === P.ROCKET && !o.explosive) game.fx.push({ type: 'boom', x: o.x, y: o.y, t: 0.3, max: 0.3, seed: Math.random() * 100 });
      if (o.returnAt !== undefined) { o.returning = true; o.age = o.returnAt; }
      else { spawnProjectilePayload(o); recoverProjectileItem(o); o.dead = true; }
      return;
    }
    o.x = nx; o.y = ny;

    if (o.owner === 'player' || o.owner === 'minion') {
      if (projHitEnemy(o)) return;
    } else {
      if (projHitPlayer(o)) return;
    }

    if (o.x < -200 || o.x > game.world.W * TILE + 200 || o.y < -400 || o.y > game.world.H * TILE + 400) o.dead = true;
  });
}

function nearestEnemy(x, y) {
  var best = null, bd = 1e9;
  for (var i = 0; i < game.entities.length; i++) {
    var e = game.entities[i];
    if (e.dead || e.armType || e.minion || e.dmg <= 0) continue;
    var d = dist2(e.x, e.y, x, y);
    if (d < bd) { bd = d; best = e; }
  }
  return best;
}

function finishProjectileEnemyHit(o, target) {
  if (o.owner === 'minion') triggerMinionWhipEffect(target, o.dmg, game);
  applyProjectileStatus(o, target);
  explodeProjectile(o, target);
  spawnProjectilePayload(o);
  if (o.spawnSphere) {
    game.projectiles.add({
      x:o.x, y:o.y, deployMode:'sphere', deployProj:P.ELECTRO, deployDamageMul:0.6, deployInterval:0.3,
      dmg:o.dmg, color:'#70d8f0', owner:'player', life:3, dead:false
    });
  }
  if (o.lifeSteal && o.sourcePlayer && !o.sourcePlayer.dying) {
    var heal = Math.max(1, Math.floor(o.dmg * o.lifeSteal));
    o.sourcePlayer.hp = Math.min(o.sourcePlayer.maxHp, o.sourcePlayer.hp + heal);
  }
  if (o.persistent) {
    if (o.hitCooldown) {
      if (!o.hitEnemyTimes) o.hitEnemyTimes = [];
      o.hitEnemyTimes.push({ target:target, time:o.age || 0 });
    } else {
      if (!o.hitEnemies) o.hitEnemies = [];
      o.hitEnemies.push(target);
    }
  } else { recoverProjectileItem(o); o.dead = true; }
  return true;
}

function recoverProjectileItem(o) {
  if (!o.recoverItem) return;
  game.addPickup(o.x, o.y, o.recoverItem, 1);
  o.recoverItem = null;
}

function projectileDamageAgainst(o, target) {
  return o.dmg + (o.owner === 'minion' && target.whipped > 0 ? (target.whipTag || 0) : 0);
}

function applyProjectileStatus(o, target) {
  if (!o.status || !target || target.dead) return;
  if (!target.statuses) target.statuses = {};
  var old = target.statuses[o.status.type];
  target.statuses[o.status.type] = {
    type:o.status.type, t:Math.max(o.status.duration, old ? old.t : 0), tick:old ? old.tick : 1,
    dps:o.status.dps || 0, defense:o.status.defense || 0
  };
  if (!old) game.spawnFloatingText(target.x, target.y - target.h / 2, o.status.type, o.color || '#fff');
}

function updateEntityStatuses(e, dt) {
  if (e.whipped > 0) {
    e.whipped -= dt;
    if (e.whipped <= 0) { e.whipped = 0; e.whipTag = 0; e.whipBurst = 0; e.whipSplash = 0; }
  }
  e.statusDefensePenalty = 0;
  if (!e.statuses) return;
  for (var key in e.statuses) {
    var s = e.statuses[key];
    s.t -= dt;
    if (s.t <= 0) { delete e.statuses[key]; continue; }
    e.statusDefensePenalty = Math.max(e.statusDefensePenalty, s.defense || 0);
    if (!s.dps) continue;
    s.tick -= dt;
    if (s.tick > 0) continue;
    s.tick += 1;
    var defense = e.boss ? (e.defV || e.def || 0) : (e.def || 0);
    var raw = s.dps + Math.max(0, defense - e.statusDefensePenalty) * 0.5;
    if (e.boss) game.hitBoss(e, raw, 0, 0);
    else hitEntity(e, raw, 0, 0, game);
    if (e.dead) return;
  }
}

function triggerMinionWhipEffect(target, dmg, gameRef) {
  var mult = target.whipBurst || target.whipSplash || 0;
  if (!mult) return;
  if (target.whipBurst) target.whipBurst = 0;
  var extra = Math.max(1, Math.round(dmg * mult));
  gameRef.fx.push({ type:'boom', x:target.x, y:target.y, t:0.25, max:0.25, seed:Math.random() * 100 });
  for (var i = 0; i < gameRef.entities.length; i++) {
    var e = gameRef.entities[i];
    if (e.dead || e.minion || e.dmg <= 0 || dist(target.x, target.y, e.x, e.y) > 70) continue;
    if (e.boss) gameRef.hitBoss(e, extra, 0, 0);
    else hitEntity(e, extra, 0, 0, gameRef);
  }
}

function explodeProjectile(o, primary) {
  if (!o.explosive || o.exploded) return;
  o.exploded = true;
  game.fx.push({ type:'boom', x:o.x, y:o.y, t:0.3, max:0.3, seed:Math.random() * 100 });
  if (game.shake) game.shake(3 + Math.min(4, (o.explosive || 40) / 20), 0.28);
  for (var i = 0; i < game.entities.length; i++) {
    var e = game.entities[i];
    if (e === primary || e.dead || e.minion || e.dmg <= 0 || dist(o.x, o.y, e.x, e.y) > o.explosive) continue;
    var splash = Math.max(1, Math.round(o.dmg * 0.65));
    if (e.boss) game.hitBoss(e, splash, 0, 0);
    else hitEntity(e, splash, 0, 0, game);
  }
}

function spawnProjectilePayload(o) {
  if (o.splitOnHit === undefined || o.splitDone) return;
  o.splitDone = true;
  var count = o.splitCount || 3;
  for (var i = 0; i < count; i++) {
    var ang = Math.PI * 2 * i / count + Math.random() * 0.3;
    game.projectiles.add({
      x:o.x, y:o.y, vx:Math.cos(ang) * (o.splitSpeed || 6), vy:Math.sin(ang) * (o.splitSpeed || 6),
      dmg:Math.max(1, Math.round(o.dmg * (o.splitDamageMul || 0.4))), type:o.splitOnHit,
      owner:'player', life:1.3, homing:!!o.splitHoming, color:o.color, melee:true, dead:false
    });
  }
}

function projectileAlreadyHit(o, target) {
  if (o.hitCooldown && o.hitEnemyTimes) {
    for (var i = o.hitEnemyTimes.length - 1; i >= 0; i--) {
      var h = o.hitEnemyTimes[i];
      if ((o.age || 0) - h.time >= o.hitCooldown) o.hitEnemyTimes.splice(i, 1);
      else if (h.target === target) return true;
    }
  }
  return !!(o.hitEnemies && o.hitEnemies.indexOf(target) >= 0);
}

function pointNearBeam(o, target) {
  var abx = o.beamEndX - o.x, aby = o.beamEndY - o.y;
  var apx = target.x - o.x, apy = target.y - o.y;
  var den = abx * abx + aby * aby || 1;
  var t = clamp((apx * abx + apy * aby) / den, 0, 1);
  var dx = target.x - (o.x + abx * t), dy = target.y - (o.y + aby * t);
  var r = (target.w + target.h) / 4 + 4;
  return dx * dx + dy * dy < r * r;
}

function beamHitEnemies(o) {
  for (var i = 0; i < game.entities.length; i++) {
    var e = game.entities[i];
    if (e.dead || e.minion || e.dmg <= 0) continue;
    if ((e.boss === 'destroyer' || e.boss === 'eaterofworlds') && e.segments) {
      for (var s = 0; s < e.segments.length; s++) {
        var seg = e.segments[s];
        if (!seg.dead && !projectileAlreadyHit(o, seg) && pointNearBeam(o, seg)) {
          segmentHit(e, seg, projectileDamageAgainst(o, e), game);
          finishProjectileEnemyHit(o, seg);
        }
      }
    }
    if (projectileAlreadyHit(o, e) || !pointNearBeam(o, e)) continue;
    if (e.boss) game.hitBoss(e, o.dmg, 0, 0);
    else hitEntity(e, o.dmg, 0, 0, game);
    finishProjectileEnemyHit(o, e);
  }
}

function zoneHitEnemies(o) {
  for (var i = 0; i < game.entities.length; i++) {
    var e = game.entities[i];
    if (e.dead || e.minion || e.dmg <= 0 || projectileAlreadyHit(o, e)) continue;
    if (Math.abs(e.x - o.x) > (e.w / 2 + 18) || Math.abs(e.y - o.y) > (e.h / 2 + o.zoneHeight / 2)) continue;
    if (e.boss) game.hitBoss(e, o.dmg, 0, 0);
    else hitEntity(e, o.dmg, 0, 0, game);
    finishProjectileEnemyHit(o, e);
  }
}

function projHitEnemy(o) {
  for (var i = 0; i < game.entities.length; i++) {
    var e = game.entities[i];
    if (e.dead || e.minion || e.dmg <= 0) continue;
    if (o.eventOnly === 'oldonesarmy' && !e.ooaEnemy) continue;

    // destroyer/eater of worlds segments have their own bodies
    if ((e.boss === 'destroyer' || e.boss === 'eaterofworlds') && e.segments) {
      for (var s = 0; s < e.segments.length; s++) {
        var seg = e.segments[s];
        if (seg.dead) continue;
        if (projectileAlreadyHit(o, seg)) continue;
        var sdx = seg.x - o.x, sdy = seg.y - o.y;
        var sr = (seg.w + seg.h) / 4 + 3;
        if (sdx * sdx + sdy * sdy < sr * sr) {
          segmentHit(e, seg, projectileDamageAgainst(o, e), game);
          return finishProjectileEnemyHit(o, seg);
        }
      }
    }

    var dx = e.x - o.x, dy = e.y - o.y;
    var r = (e.w + e.h) / 4 + 3;
    if (projectileAlreadyHit(o, e)) continue;
    if (dx * dx + dy * dy < r * r) {
      var projectileDamage = projectileDamageAgainst(o, e);
      if (e.boss) game.hitBoss(e, projectileDamage, 0, 0);
      else hitEntity(e, projectileDamage, 0, 0, game);
      return finishProjectileEnemyHit(o, e);
    }
  }
  return false;
}

function projHitPlayer(o) {
  var p = typeof multiplayerTarget === 'function' ? multiplayerTarget(game, o) : game.player;
  if (p.dying) return false;
  var dx = p.x - o.x, dy = p.y - o.y;
  var r = (p.w + p.h) / 4 + 2;
  if (dx * dx + dy * dy < r * r) {
    game.damagePlayer(o.dmg, o, o.vx > 0 ? 3 : -3);
    o.dead = true;
    return true;
  }
  return false;
}

// ---------- Pickups ----------
var SHIMMER_TRANSFORMS = {};
var SHIMMER_DECRAFT = {};
SHIMMER_DECRAFT[I.COPPERBAR] = [{ item:I.COPPER, count:3 }];
SHIMMER_DECRAFT[I.TINBAR] = [{ item:I.TIN, count:3 }];
SHIMMER_DECRAFT[I.IRONBAR] = [{ item:I.IRON, count:3 }];
SHIMMER_DECRAFT[I.LEADBAR] = [{ item:I.LEAD, count:3 }];
SHIMMER_DECRAFT[I.SILVERBAR] = [{ item:I.SILVER, count:4 }];
SHIMMER_DECRAFT[I.TUNGSTENBAR] = [{ item:I.TUNGSTEN, count:4 }];
SHIMMER_DECRAFT[I.GOLDBAR] = [{ item:I.GOLD, count:4 }];
SHIMMER_DECRAFT[I.PLATINUMBAR] = [{ item:I.PLATINUM, count:4 }];
SHIMMER_DECRAFT[I.DEMONITEBAR] = [{ item:I.DEMONITE, count:3 }];
SHIMMER_DECRAFT[I.CRIMTANEBAR] = [{ item:I.CRIMTANE, count:3 }];
SHIMMER_DECRAFT[I.HELLSTONEBAR] = [{ item:I.HELLSTONE, count:3 }, { item:I.OBSIDIAN, count:1 }];
SHIMMER_DECRAFT[I.COBALTBAR] = [{ item:I.COBALT, count:3 }];
SHIMMER_DECRAFT[I.PALLADIUMBAR] = [{ item:I.PALLADIUM, count:3 }];
SHIMMER_DECRAFT[I.MYTHRILBAR] = [{ item:I.MYTHRIL, count:4 }];
SHIMMER_DECRAFT[I.ORICHALCUMBAR] = [{ item:I.ORICHALCUM, count:4 }];
SHIMMER_DECRAFT[I.ADAMANTITEBAR] = [{ item:I.ADAMANTITE, count:5 }];
SHIMMER_DECRAFT[I.TITANIUMBAR] = [{ item:I.TITANIUM, count:5 }];
SHIMMER_DECRAFT[I.CHLOROPHYTEBAR] = [{ item:I.CHLOROPHYTE, count:5 }];
SHIMMER_DECRAFT[I.LUMINITEBAR] = [{ item:I.LUMINITE, count:4 }];
SHIMMER_DECRAFT[I.METEORITEBAR] = [{ item:I.METEORITE, count:4 }];
SHIMMER_DECRAFT[I.SHROOMBAR] = [{ item:I.MUSHROOM, count:1 }, { item:I.CHLOROPHYTEBAR, count:1 }];
SHIMMER_TRANSFORMS[I.LUMINITE] = I.CHLOROPHYTE;
SHIMMER_TRANSFORMS[I.CHLOROPHYTE] = I.TITANIUM;
SHIMMER_TRANSFORMS[I.TITANIUM] = I.ADAMANTITE;
SHIMMER_TRANSFORMS[I.ADAMANTITE] = I.ORICHALCUM;
SHIMMER_TRANSFORMS[I.ORICHALCUM] = I.MYTHRIL;
SHIMMER_TRANSFORMS[I.MYTHRIL] = I.PALLADIUM;
SHIMMER_TRANSFORMS[I.PALLADIUM] = I.COBALT;
SHIMMER_TRANSFORMS[I.COBALT] = I.PLATINUM;
SHIMMER_TRANSFORMS[I.PLATINUM] = I.GOLD;
SHIMMER_TRANSFORMS[I.GOLD] = I.TUNGSTEN;
SHIMMER_TRANSFORMS[I.TUNGSTEN] = I.SILVER;
SHIMMER_TRANSFORMS[I.SILVER] = I.LEAD;
SHIMMER_TRANSFORMS[I.LEAD] = I.IRON;
SHIMMER_TRANSFORMS[I.IRON] = I.TIN;
SHIMMER_TRANSFORMS[I.TIN] = I.COPPER;
SHIMMER_TRANSFORMS[I.COPPER] = I.STONE;
SHIMMER_TRANSFORMS[I.GEM_DIAMOND] = I.GEM_RUBY;
SHIMMER_TRANSFORMS[I.GEM_RUBY] = I.GEM_EMERALD;
SHIMMER_TRANSFORMS[I.GEM_EMERALD] = I.GEM_SAPPHIRE;
SHIMMER_TRANSFORMS[I.GEM_SAPPHIRE] = I.GEM_TOPAZ;
SHIMMER_TRANSFORMS[I.GEM_TOPAZ] = I.GEM_AMETHYST;
SHIMMER_TRANSFORMS[I.GEM_AMETHYST] = I.STONE;
SHIMMER_TRANSFORMS[I.MARBLE] = I.GRANITE;
SHIMMER_TRANSFORMS[I.GRANITE] = I.MARBLE;
SHIMMER_TRANSFORMS[I.SUMMONEREMBLEM] = I.WARRIOREMBLEM;
SHIMMER_TRANSFORMS[I.WARRIOREMBLEM] = I.RANGEREMBLEM;
SHIMMER_TRANSFORMS[I.RANGEREMBLEM] = I.MAGICEMBLEM;
SHIMMER_TRANSFORMS[I.MAGICEMBLEM] = I.SUMMONEREMBLEM;
SHIMMER_TRANSFORMS[I.LUCKYCOIN] = I.GOLDRING;
SHIMMER_TRANSFORMS[I.GOLDRING] = I.DISCOUNTCARD;
SHIMMER_TRANSFORMS[I.DISCOUNTCARD] = I.LUCKYCOIN;
SHIMMER_TRANSFORMS[I.ICE] = I.SNOW;
SHIMMER_TRANSFORMS[I.SANDSTONE] = I.SAND;
SHIMMER_TRANSFORMS[I.SPOOKYWOOD] = I.WOOD;
SHIMMER_TRANSFORMS[I.WOOD] = I.DIRT;
SHIMMER_TRANSFORMS[I.HEART] = I.VITALCRYSTAL;
SHIMMER_TRANSFORMS[I.LIFEFRUIT] = I.AEGISFRUIT;
SHIMMER_TRANSFORMS[I.GOLDENAPPLE] = I.AMBROSIA;
SHIMMER_TRANSFORMS[I.SPELLTOME] = I.ADVCOMBAT2;

var SHIMMER_GEAR_DECRAFT = null;
var SHIMMER_GEAR_TYPES = ['melee','ranged','magic','tool','armor','accessory','whip','summonstaff','hook','mount','pet','lightpet'];
var SHIMMER_PROTECT_MATS = [
  I.SOUL_LIGHT, I.SOUL_NIGHT, I.SOUL_MIGHT, I.SOUL_SIGHT, I.SOUL_FRIGHT, I.SOUL_FLIGHT,
  I.HALLOWEDBAR, I.SHADOWSCALE, I.TISSUESAMPLE, I.LUMINITE, I.LUMINITEBAR,
  I.DEMONITEBAR, I.CRIMTANEBAR, I.BONE, I.TEMPLEBRICK
];
function buildShimmerGearDecraft() {
  var map = {}, counts = {}, i, r, def;
  for (i = 0; i < RECIPES.length; i++) {
    r = RECIPES[i];
    if (r.count !== 1 || r.special) continue;
    def = ITEMS[r.result];
    if (!def || SHIMMER_GEAR_TYPES.indexOf(def.type) < 0) continue;
    var ok = true;
    for (var m = 0; m < r.mat.length; m++) {
      if (SHIMMER_PROTECT_MATS.indexOf(r.mat[m][0]) >= 0) { ok = false; break; }
      var mdef = ITEMS[r.mat[m][0]];
      if (mdef && mdef.type === 'consumable') { ok = false; break; }
    }
    if (!ok) continue;
    counts[r.result] = (counts[r.result] || 0) + 1;
    var converted = [];
    for (var c = 0; c < r.mat.length; c++) converted.push({ item:r.mat[c][0], count:r.mat[c][1] });
    map[r.result] = converted;
  }
  for (var id in map) if (counts[id] > 1) delete map[id];
  return map;
}
function gearDecraftFor(item) {
  if (SHIMMER_GEAR_DECRAFT === null) SHIMMER_GEAR_DECRAFT = buildShimmerGearDecraft();
  return SHIMMER_GEAR_DECRAFT[item] || null;
}
function applyDecraft(pk, list) {
  var batches = pk.count;
  pk.item = list[0].item;
  pk.count = list[0].count * batches;
  pk.reforge = null;
  pk.shimmered = true;
  for (var di = 1; di < list.length; di++) {
    game.pickups.push({ item:list[di].item, count:list[di].count * batches, x:pk.x + di * 8, y:pk.y, seed:Math.random() * 100, t:0, shimmered:true });
  }
  game.fx.push({ type:'shimmer', x:pk.x, y:pk.y, t:0.65, max:0.65, color:ITEMS[pk.item].color });
  game.spawnFloatingText(pk.x, pk.y - 12, 'Decrafted', '#b8f4ff');
  AudioSys.play('magic');
  return true;
}
var SHIMMER_FURNITURE_DECRAFT = null;
var SHIMMER_FURNITURE_TYPES = ['block', 'wall'];
function buildShimmerFurnitureDecraft() {
  return buildShimmerBatchDecraft(SHIMMER_FURNITURE_TYPES);
}
function furnitureDecraftFor(item) {
  if (SHIMMER_FURNITURE_DECRAFT === null) SHIMMER_FURNITURE_DECRAFT = buildShimmerFurnitureDecraft();
  return SHIMMER_FURNITURE_DECRAFT[item] || null;
}
var SHIMMER_MISC_DECRAFT = null;
var SHIMMER_MISC_TYPES = ['ammo', 'bait', 'dye', 'fishingrod', 'material', 'summon', 'eventitem'];
function buildShimmerMiscDecraft() {
  return buildShimmerBatchDecraft(SHIMMER_MISC_TYPES);
}
function miscDecraftFor(item) {
  if (SHIMMER_MISC_DECRAFT === null) SHIMMER_MISC_DECRAFT = buildShimmerMiscDecraft();
  return SHIMMER_MISC_DECRAFT[item] || null;
}
var SHIMMER_FOOD_DECRAFT = null;
var SHIMMER_FOOD_TYPES = ['consumable'];
var SHIMMER_FOOD_IDS = [I.COOKEDFISH, I.PUMPKINPIE, I.BAKEDPOTATO, I.APPLEPIE, I.BURGER];
function buildShimmerFoodDecraft() {
  return buildShimmerBatchDecraft(SHIMMER_FOOD_TYPES, function (r) {
    return SHIMMER_FOOD_IDS.indexOf(r.result) < 0;
  });
}
function foodDecraftFor(item) {
  if (SHIMMER_FOOD_DECRAFT === null) SHIMMER_FOOD_DECRAFT = buildShimmerFoodDecraft();
  return SHIMMER_FOOD_DECRAFT[item] || null;
}
function buildShimmerBatchDecraft(types, exclude) {
  var map = {}, counts = {}, i, r, def;
  for (i = 0; i < RECIPES.length; i++) {
    r = RECIPES[i];
    if (r.special || r.count < 1) continue;
    def = ITEMS[r.result];
    if (!def || types.indexOf(def.type) < 0) continue;
    if (exclude && exclude(r, def)) continue;
    var ok = true;
    for (var m = 0; m < r.mat.length; m++) {
      if (SHIMMER_PROTECT_MATS.indexOf(r.mat[m][0]) >= 0) { ok = false; break; }
      var mdef = ITEMS[r.mat[m][0]];
      if (mdef && mdef.type === 'consumable') { ok = false; break; }
    }
    if (!ok) continue;
    counts[r.result] = (counts[r.result] || 0) + 1;
    var converted = [];
    for (var c = 0; c < r.mat.length; c++) converted.push({ item:r.mat[c][0], count:r.mat[c][1] });
    map[r.result] = { count:r.count, mats:converted };
  }
  for (var id in map) if (counts[id] > 1) delete map[id];
  return map;
}
function applyBatchDecraft(pk, entry) {
  var batches = Math.floor(pk.count / entry.count);
  if (batches < 1) return false;
  var leftover = pk.count - batches * entry.count;
  if (leftover > 0) {
    game.pickups.push({ item:pk.item, count:leftover, x:pk.x - 6, y:pk.y, seed:Math.random() * 100, t:0, shimmered:true });
  }
  pk.item = entry.mats[0].item;
  pk.count = entry.mats[0].count * batches;
  pk.reforge = null;
  pk.shimmered = true;
  for (var di = 1; di < entry.mats.length; di++) {
    game.pickups.push({ item:entry.mats[di].item, count:entry.mats[di].count * batches, x:pk.x + di * 8, y:pk.y, seed:Math.random() * 100, t:0, shimmered:true });
  }
  game.fx.push({ type:'shimmer', x:pk.x, y:pk.y, t:0.65, max:0.65, color:ITEMS[pk.item].color });
  game.spawnFloatingText(pk.x, pk.y - 12, 'Decrafted', '#b8f4ff');
  AudioSys.play('magic');
  return true;
}
function updateShimmerPickup(pk) {
  if (pk.shimmered || (!game.world.isShimmerAt(pk.x, pk.y) && !game.world.isShimmerAt(pk.x, pk.y + 6))) return false;
  var decraft = SHIMMER_DECRAFT[pk.item] || gearDecraftFor(pk.item) || furnitureDecraftFor(pk.item) || miscDecraftFor(pk.item) || foodDecraftFor(pk.item);
  if (decraft && (decraft.mats ? applyBatchDecraft(pk, decraft) : applyDecraft(pk, decraft))) return true;
  var output = SHIMMER_TRANSFORMS[pk.item];
  if (!output || !ITEMS[output]) return false;
  pk.item = output;
  pk.reforge = null;
  pk.shimmered = true;
  game.fx.push({ type:'shimmer', x:pk.x, y:pk.y, t:0.65, max:0.65, color:ITEMS[output].color });
  game.spawnFloatingText(pk.x, pk.y - 12, ITEMS[output].name, '#b8f4ff');
  AudioSys.play('magic');
  return true;
}

function updatePickups() {
  var p = game.player;
  for (var i = game.pickups.length - 1; i >= 0; i--) {
    var pk = game.pickups[i];
    updateShimmerPickup(pk);
    if (p.dying) continue;
    var dx = p.x - pk.x, dy = p.y - pk.y;
    var d = Math.sqrt(dx * dx + dy * dy) || 1;
    if (d < 70) {
      pk.x += (dx / d) * 5;
      pk.y += (dy / d) * 5;
      dx = p.x - pk.x; dy = p.y - pk.y;
      d = Math.sqrt(dx * dx + dy * dy) || 1;
    }
    if (d < 20) {
      var added = p.inventory.addStack({ id:pk.item, count:pk.count, reforge:pk.reforge, bagBoss:pk.bagBoss, bagDrops:pk.bagDrops });
      if (added > 0) {
        if (typeof Net !== 'undefined') Net.pickupTaken(pk.nid, added);
        AudioSys.play('pickup');
        pk.count -= added;
        if (pk.count <= 0) game.pickups.splice(i, 1);
      }
    }
  }
}

// ---------- FX ----------
function updateFx(dt) {
  for (var i = game.fx.length - 1; i >= 0; i--) {
    var f = game.fx[i];
    if (f.t === undefined) f.t = 0.2;
    if (!f.max) f.max = f.t;
    if (f.seed === undefined) f.seed = Math.random() * 100;
    if (f.type === 'releaseLantern') {
      f.vx += ((game.weather ? game.weather.windSpeed : 0) / 100 - f.vx) * 0.01;
      f.x += f.vx;
      f.y += f.vy;
    } else if (f.type === 'confetti') {
      f.x += f.vx || 0;
      f.y += f.vy || 0;
      f.vy = (f.vy || 0) + 0.04;
    }
    f.t -= dt;
    if (f.t <= 0) game.fx.splice(i, 1);
  }
  for (var j = game.fxTexts.length - 1; j >= 0; j--) {
    game.fxTexts[j].t -= dt;
    if (game.fxTexts[j].t <= 0) game.fxTexts.splice(j, 1);
  }
}

// ---------- Enemy spawning ----------
var SPAWN_SAFE_X = 18 * TILE;
var SPAWN_SAFE_Y = 10 * TILE;

function inSpawnSafeZone(px, py) {
  return Math.abs(px - game.world.spawnX) <= SPAWN_SAFE_X &&
    Math.abs(py - game.world.spawnY) <= SPAWN_SAFE_Y;
}

function clearSpawnHostiles() {
  for (var i = game.entities.length - 1; i >= 0; i--) {
    var e = game.entities[i];
    if (e.dead || e.boss || e.armType || e.eventEnemy || e.minion || e.dmg <= 0) continue;
    if (Math.abs(e.x - game.world.spawnX) <= SPAWN_SAFE_X + 6 * TILE &&
        Math.abs(e.y - game.world.spawnY) <= SPAWN_SAFE_Y + 4 * TILE) {
      game.entities.splice(i, 1);
    }
  }
}

function spawnCultistRitual() {
  var at = game.world.dungeonEntrance;
  if (!at) return;
  var types = [E.CULTISTARCHER, E.CULTISTDEVOTEE, E.CULTISTDEVOTEE, E.CULTISTARCHER];
  var offsets = [-54, -18, 18, 54];
  for (var i = 0; i < types.length; i++) {
    var e = spawnEntity(game, types[i], at.x + offsets[i], at.y);
    e.ritualCultist = true;
  }
  game.cultistRitualActive = true;
  game.message('Mysterious Cultists gather at the Dungeon entrance...');
}

function updateCultistRitual(dt) {
  if (!game.cultistRitualReady || game.bossesDefeated.cultist) return;
  var alive = 0;
  for (var i = 0; i < game.entities.length; i++) {
    if (!game.entities[i].dead && game.entities[i].ritualCultist) alive++;
  }
  if (game.cultistRitualActive) {
    if (alive === 0 && !game.anyBossAlive()) {
      game.cultistRitualActive = false;
      game.cultistRitualReady = false;
      game.message('The ancient ritual has been interrupted!');
      game.spawnBoss('cultist');
    }
    return;
  }
  if (game.anyBossAlive()) return;
  game.cultistRespawnT -= dt;
  if (game.cultistRespawnT <= 0) spawnCultistRitual();
}

function initialSpawns() {
  for (var i = 0; i < 3; i++) {
    var type = pickEnemy();
    var def = ENT_DEF[type];
    var sx = game.world.spawnX + (Math.random() * 600 - 300);
    var sy = def.fly ? game.world.spawnY - 80 + Math.random() * 100 : findGroundY(sx);
    var e = spawnEntity(game, type, sx, sy);
    if (type === E.WYVERN) initSegments(e, game, 6, '#ffd0a0');
    if (type === E.BONESERPENT) initSegments(e, game, 5, '#d8c8a8');
    if (type === E.GIANTWORM) initSegments(e, game, 5, '#c8b090');
    if (type === E.DIGGER) initSegments(e, game, 5, '#e0c878');
    if (type === E.DUNESPLICER) initSegments(e, game, 7, '#d8a878');
  }
}

function updateSpawning(dt) {
  if (game.event) return;
  var p = game.player;
  if (inSpawnSafeZone(p.x, p.y) && game.world.graveyardStrengthAt(p.x, p.y) < 7) {
    game.spawnT = Math.max(game.spawnT, 5);
    return;
  }
  game.spawnT -= dt;
  if (game.spawnT > 0) return;
  var dm = diffScale();
  game.spawnT = (7 + Math.random() * 5) / dm.spawn;

  var count = 0;
  for (var i = 0; i < game.entities.length; i++) {
    var e = game.entities[i];
    if (!e.dead && !e.boss && !e.armType && !e.minion && e.dmg > 0) count++;
  }
  if (count >= Math.round(4 * dm.spawn)) return;

  var type = pickEnemy();
  var side = Math.random() < 0.5 ? -1 : 1;
  if (type === E.ANGRYDANDELION || type === E.WINDYBALLOON || type === E.LADYBUG) side = game.weather.windSpeed < 0 ? 1 : -1;
  var sx = clamp(p.x + side * (320 + Math.random() * 240), 32, game.world.W * TILE - 32);
  var def = ENT_DEF[type];
  var sy;
  if (type === E.ANGRYDANDELION) {
    var dandelionSpot = findDandelionSpot(sx);
    if (!dandelionSpot) return;
    sx = dandelionSpot.x; sy = dandelionSpot.y;
  } else if (type === E.GHOST && game.player.y > game.world.surfaceY[clamp(Math.floor(game.player.x / TILE), 0, game.world.W - 1)] * TILE + 30 * TILE) {
    sy = clamp(game.player.y - 80 + Math.random() * 160, 16, game.world.H * TILE - 16);
  } else if (type === E.GIANTWORM || type === E.DIGGER || type === E.DUNESPLICER || type === E.ANTLIONSWARMER) {
    var wormTx = clamp(Math.floor(sx / TILE), 2, game.world.W - 3);
    var wormMinY = game.world.surfaceY[wormTx] + 14;
    var wormTy = Math.max(wormMinY, Math.floor(p.y / TILE) + Math.floor(Math.random() * 13) - 6);
    while (wormTy < game.world.H - 3 && !game.world.isSolid(wormTx, wormTy)) wormTy++;
    if (wormTy >= game.world.H - 3) return;
    sy = wormTy * TILE + 8;
  } else if (def.fly) sy = clamp(game.world.surfaceY[clamp(Math.floor(sx / TILE), 0, game.world.W - 1)] * TILE - 40 - Math.random() * 80, 16, game.world.H * TILE - 16);
  else sy = findGroundY(sx);
  var e2 = spawnEntity(game, type, sx, sy);
  if (type === E.WYVERN) initSegments(e2, game, 6, '#ffd0a0');
  if (type === E.BONESERPENT) initSegments(e2, game, 5, '#d8c8a8');
  if (type === E.GIANTWORM) initSegments(e2, game, 5, '#c8b090');
  if (type === E.DIGGER) initSegments(e2, game, 5, '#e0c878');
  if (type === E.DUNESPLICER) initSegments(e2, game, 7, '#d8a878');
}

function isAmbientCritter(type) {
  return type === E.BUNNY || type === E.BIRD || type === E.SQUIRREL || type === E.FROG || type === E.GOLDFISH || type === E.TURTLE;
}

function findCritterGroundSpot(wx) {
  var center = clamp(Math.floor(wx / TILE), 2, game.world.W - 3);
  for (var radius = 0; radius <= 24; radius++) {
    for (var side = -1; side <= 1; side += 2) {
      if (radius === 0 && side === 1) continue;
      var tx = clamp(center + radius * side, 2, game.world.W - 3);
      var surface = game.world.surfaceY[tx];
      for (var y = Math.max(2, surface - 6); y <= Math.min(game.world.H - 2, surface + 10); y++) {
        if (game.world.isSolid(tx, y) && !game.world.isSolid(tx, y - 1) && !game.world.isSolid(tx, y - 2)) {
          return { x:tx * TILE + 8, y:y * TILE };
        }
      }
    }
  }
  return null;
}

function findCritterWaterSpot(wx) {
  var centerX = clamp(Math.floor(wx / TILE), 2, game.world.W - 3);
  var centerY = clamp(Math.floor(game.player.y / TILE), 2, game.world.H - 3);
  for (var radius = 0; radius <= 36; radius++) {
    for (var side = -1; side <= 1; side += 2) {
      if (radius === 0 && side === 1) continue;
      var tx = clamp(centerX + radius * side, 2, game.world.W - 3);
      for (var oy = -16; oy <= 16; oy++) {
        var ty = clamp(centerY + oy, 2, game.world.H - 3);
        if (game.world.get(tx, ty) === T.WATER && game.world.get(tx, ty + 1) === T.WATER) {
          return { x:tx * TILE + 8, y:ty * TILE + 8 };
        }
      }
    }
  }
  return null;
}

function updateCritterSpawning(dt) {
  game.critterT -= dt;
  if (game.critterT > 0) return;
  game.critterT = 6 + Math.random() * 7;
  if (game.event || game.anyBossAlive()) return;

  var p = game.player, w = game.world;
  var cx = clamp(Math.floor(p.x / TILE), 0, w.W - 1);
  var depth = (p.y - w.surfaceY[cx] * TILE) / TILE;
  var night = game.timeOfDay < 0.25 || game.timeOfDay > 0.75;
  if (night || depth >= 0 || depth < -12) return;

  var count = 0;
  for (var i = 0; i < game.entities.length; i++) {
    if (!game.entities[i].dead && isAmbientCritter(game.entities[i].type)) count++;
  }
  if (count >= 5) return;

  var biome = w.biomeAt(p.x, p.y);
  var pool = [];
  if (biome === BIOME.FOREST || biome === BIOME.HALLOW) pool.push(E.BUNNY, E.BIRD, E.SQUIRREL);
  else if (biome === BIOME.JUNGLE) pool.push(E.FROG, E.TURTLE, E.BIRD);
  else if (biome === BIOME.OCEAN) pool.push(E.TURTLE, E.BIRD);
  else if (biome === BIOME.SNOW) pool.push(E.BUNNY, E.BIRD);
  else if (biome === BIOME.DESERT) pool.push(E.BIRD);

  var side = Math.random() < 0.5 ? -1 : 1;
  var sx = clamp(p.x + side * (180 + Math.random() * 260), 32, w.W * TILE - 32);
  var waterSpot = weatherKindAt(game, p.x, p.y) === 'rain' ? findCritterWaterSpot(sx) : null;
  if (waterSpot) pool.push(E.GOLDFISH, E.GOLDFISH);
  if (!pool.length) return;

  var type = pool[Math.floor(Math.random() * pool.length)];
  var def = ENT_DEF[type];
  if (type === E.GOLDFISH) {
    if (!waterSpot) return;
    spawnEntity(game, type, waterSpot.x, waterSpot.y);
    return;
  }
  var ground = findCritterGroundSpot(sx);
  if (!ground) return;
  var sy = type === E.BIRD ? ground.y - 35 - Math.random() * 30 : ground.y - def.h / 2;
  spawnEntity(game, type, ground.x, sy);
}

function updateBulbs() {
  if (!game.hardmode) return;
  if (!game.bossesDefeated.twins || !game.bossesDefeated.destroyer || !game.bossesDefeated.skelprime) return;
  if (game.bossesDefeated.plantera) return;
  if (game.anyBossAlive()) return;
  var w = game.world;
  for (var i = w.planteraBulbs.length - 1; i >= 0; i--) {
    var b = w.planteraBulbs[i];
    if (dist(game.player.x, game.player.y, b.x, b.y) < 110) {
      w.planteraBulbs.splice(i, 1);
      var tx = Math.floor(b.x / TILE), ty = Math.floor(b.y / TILE);
      w.breakTile(tx, ty);
      game.message('Plantera has awoken!');
      spawnPlantera(game);
      return;
    }
  }
}

var TORCH_GOD_THRESHOLD = 100;

var EVENT_WAVES = {
  pumpkinmoon: {
    sizes: [6, 8, 11, 14, 18, 24],
    trash: [E.PUMPKINSCARECROW, E.SPLINTERLING, E.HELLHOUND, E.POLTERGEIST, E.HEADLESSHORSEMAN],
    minis: ['mourningwood', 'pumpking']
  },
  frostmoon: {
    sizes: [6, 8, 11, 14, 18, 24],
    trash: [E.GINGERBREAD, E.ZOMBIEELF, E.ELFARCHER, E.NUTCRACKER, E.FLOCKO, E.ELFCOPTER, E.KRAMPUS, E.YETI, E.PRESENTMIMIC],
    minis: ['everscream', 'santank', 'icequeen']
  },
  martianmadness: {
    sizes: [5, 7, 10, 13, 16, 22],
    trash: [E.MARTIANGRUNT, E.RAYGUNNER, E.MARTIANOFFICER, E.MARTIANENGINEER, E.GIGAZAPPER, E.BRAINSCRAMBLER, E.SCUTLIXGUNNER, E.MARTIANWALKER, E.MARTIANDRONE, E.TESLATURRET],
    minis: ['martiansaucer']
  },
  goblinarmy: {
    sizes: [8, 11, 15, 20],
    trash: [E.GOBLINPEON, E.GOBLINTHIEF, E.GOBLINARCHER, E.GOBLINWARRIOR, E.GOBLINSORCERER],
    afterHardmode: [E.GOBLINSUMMONER],
    day: true
  },
  pirateinvasion: {
    sizes: [8, 12, 16, 22],
    trash: [E.PIRATEDECKHAND, E.PIRATECORSAIR, E.PIRATEDEADEYE, E.PIRATECROSSBOWER, E.PARROT],
    minis: ['piratecaptain', 'flyingdutchman'],
    day: true
  },
  solareclipse: {
    sizes: [6, 9, 12, 16, 22],
    trash: [E.FRANKENSTEIN, E.SWAMPTHING, E.CREATUREFROMDEEP, E.FRITZ],
    afterAnyMech: [E.EYEBALL, E.VAMPIRE, E.POSSESSED],
    afterMechs: [E.REAPER],
    afterPlantera: [E.BUTCHER, E.DEADLYSPHERE, E.DRMANFLY, E.NAILHEAD, E.PSYCHO, E.BABYMOTHRON],
    minis: ['mothron'],
    minisAfter: 'plantera',
    day: true
  },
  bloodmoon: {
    name:'Blood Moon', mode:'timed', surface:true,
    trash:[E.BLOODZOMBIE, E.DRIPPLER, E.BRIDE, E.GROOM, E.ZOMBIE, E.DEMONEYE],
    afterHardmode:[E.CLOWN]
  },
  slimerain: {
    name:'Slime Rain', mode:'slimeKills', surface:true,
    trash:[E.SLIME, E.SLIME, E.SLIME, E.PINKSLIME]
  },
  frostlegion: {
    name:'Frost Legion', sizes:[8, 12, 16, 22],
    trash:[E.SNOWMANGANGSTA, E.MISTERSTABBY, E.SNOWBALLA],
    day:true
  }
};

function eventTrashPool(wd) {
  var pool = wd.trash.slice(0);
  if (wd.afterHardmode && game.hardmode) pool = pool.concat(wd.afterHardmode);
  if (wd.afterAnyMech && anyMechanicalBossDefeated()) pool = pool.concat(wd.afterAnyMech);
  if (wd.afterMechs && game.mechDone) pool = pool.concat(wd.afterMechs);
  if (wd.afterPlantera && game.bossesDefeated.plantera) pool = pool.concat(wd.afterPlantera);
  return pool;
}

function anyMechanicalBossDefeated() {
  var b = game.bossesDefeated;
  return !!(b.twins || b.destroyer || b.skelprime);
}

function eventMiniPool(wd) {
  if (!wd.minis) return [];
  if (wd.minisAfter === 'plantera' && !game.bossesDefeated.plantera) return [];
  return wd.minis;
}

function eventAliveCount() {
  var n = 0;
  for (var i = 0; i < game.entities.length; i++) {
    var e = game.entities[i];
    if (!e.dead && !e.armType && e.eventEnemy) n++;
  }
  return n;
}

function startWave(ev) {
  var wd = EVENT_WAVES[ev.type];
  ev.wave++;
  ev.pending = wd.sizes[Math.min(ev.wave - 1, wd.sizes.length - 1)];
  ev.minisPending = 0;
  var minis = eventMiniPool(wd);
  if (minis.length && ev.wave >= 2) {
    if (ev.wave >= wd.sizes.length) ev.minisPending = minis.length;
    else ev.minisPending = ev.wave >= 4 ? 2 : 1;
  }
  ev.t = 0;
  ev.state = 'spawning';
  game.message('Event wave ' + ev.wave + '!');
}

function checkDawn() {
  if (!game || !game.started) return;
  var day = game.timeOfDay >= 0.25 && game.timeOfDay <= 0.75;
  var dusk = !day && !game._wasNight;
  if (day && game._wasNight) {
    game.dayCount++;
    endStarfall();
    if (game.lanternNight.active) endLanternNight('The lanterns fade with the sunrise.');
    var guideAlive = false;
    for (var gi = 0; gi < game.entities.length; gi++) {
      if (!game.entities[gi].dead && game.entities[gi].type === E.GUIDE) { guideAlive = true; break; }
    }
    if (!guideAlive && !game.anyBossAlive()) {
      spawnEntity(game, E.GUIDE, game.world.guidePos.x, game.world.guidePos.y);
      game.message('The Guide has returned.');
    }
  }
  if (day && game._wasNight && !game.weather.active && Math.random() < 0.22) startWeather();
  if (dusk && game.party.active) endParty('The Party has ended.');
  if (dusk) rollStarfallNight();
  if (dusk && !game.event && !game.anyBossAlive() && game.player.maxHp >= 120 && Math.random() < 0.12) {
    game.startEvent('bloodmoon');
  }
  if (day && game._wasNight && !game.event && !game.anyBossAlive()) {
    var r = Math.random();
    if (game.player.maxHp >= 140 && r < 0.12) {
      game.startEvent('slimerain');
    } else if (game.evilObjectsBroken >= 1 && r < 0.3) {
      game.startEvent('goblinarmy');
    } else if (game.hardmode && r < 0.4) {
      game.startEvent('pirateinvasion');
    } else if (anyMechanicalBossDefeated() && r < 0.6) {
      game.startEvent('solareclipse');
    }
  }
  if (day && game._wasNight && !game.event && !game.anyBossAlive() && !game.party.active &&
      game.dayCount >= game.party.nextDay && game.townArrivals[E.PARTYGIRL] && townArrivalCount(false) >= 5 && Math.random() < 0.1) {
    startParty(false);
  }
  if (dusk && !game.event && !game.anyBossAlive()) {
    if (game.lanternNight.pending) startLanternNight(false);
    else if (game.victory && game.dayCount >= game.lanternNight.randomNextDay && Math.random() < 1 / 14) startLanternNight(true);
  }
  game._wasNight = !day;
}

function startParty(manual) {
  if (game.party.active) return false;
  game.party.active = true;
  game.party.natural = !manual;
  game.party.cakeClaimed = false;
  if (!manual) {
    game.party.nextDay = game.dayCount + 5 + Math.floor(Math.random() * 6);
    Achievements.unlock('party', game);
  }
  game.message(manual ? 'A Party has started!' : 'Looks like someone is throwing a Party!');
  for (var i = 0; i < 24; i++) game.fx.push({ type:'confetti', x:game.player.x + Math.random() * 220 - 110, y:game.player.y - Math.random() * 100, vx:Math.random() * 2 - 1, vy:Math.random() * -1.5, t:2, max:2, color:['#ff5c8a','#6bc8ff','#ffe14d','#6bff8a'][i % 4] });
  AudioSys.play('spawn');
  return true;
}

function endParty(msg) {
  if (!game.party.active) return;
  game.party.active = false;
  game.party.natural = false;
  if (msg) game.message(msg);
}

function scheduleLanternNight(source) {
  var eligible = {
    kingslime:1, deerclops:1, eyeofcthulhu:1, eaterofworlds:1, brainofcthulhu:1,
    queenbee:1, skeletron:1, wallofflesh:1, twins:1, destroyer:1, skelprime:1,
    queenslime:1, plantera:1, golem:1, duke:1, empress:1, cultist:1, moonlord:1,
    pumpking:1, icequeen:1
  };
  if (!eligible[source]) return false;
  var key = source === 'eaterofworlds' || source === 'brainofcthulhu' ? 'worldevil' : source;
  if (game.lanternNight.celebrated[key]) return false;
  game.lanternNight.celebrated[key] = true;
  game.lanternNight.pending = true;
  return true;
}

function startLanternNight(random) {
  if (game.lanternNight.active || game.event || game.anyBossAlive()) return false;
  game.lanternNight.active = true;
  if (!random) game.lanternNight.pending = false;
  else game.lanternNight.randomNextDay = game.dayCount + 5 + Math.floor(Math.random() * 6);
  game.luck = 0.3;
  Achievements.unlock('lanternnight', game);
  game.message('The lanterns rise in celebration of your victories!');
  AudioSys.play('spawn');
  return true;
}

function endLanternNight(msg) {
  if (!game.lanternNight.active) return;
  game.lanternNight.active = false;
  game.luck = 0;
  if (msg) game.message(msg);
}

function rollStarfallNight() {
  var roll = Math.random();
  game.starfall.active = roll < 0.1;
  if (game.starfall.active) {
    game.starfall.multiplier = 3 + Math.random() * 2;
    game.starfall.crawlerT = 5 + Math.random() * 8;
    game.message('The stars are falling in greater numbers tonight!');
  } else if (Math.random() < 1 / 3) {
    game.starfall.multiplier = 1 + Math.random() * 0.5;
    game.starfall.crawlerT = 0;
  } else {
    game.starfall.multiplier = 1;
    game.starfall.crawlerT = 0;
  }
}

function endStarfall() {
  if (!game.starfall) return;
  game.starfall.active = false;
  game.starfall.multiplier = 1;
  game.starfall.crawlerT = 0;
  for (var i = game.pickups.length - 1; i >= 0; i--) {
    if (game.pickups[i].item === I.FALLENSTAR || game.pickups[i].starfallCritter) game.pickups.splice(i, 1);
  }
}

function updateStarfall(dt) {
  var night = game.timeOfDay < 0.25 || game.timeOfDay > 0.75;
  if (!night || !game.starfall) return;
  var activeStars = 0;
  for (var i = 0; i < game.projectiles.list.length; i++) if (game.projectiles.list[i].fallenStar && !game.projectiles.list[i].dead) activeStars++;
  var chance = (10 * (game.world.W / 4200) * game.starfall.multiplier) / 8000 * dt * 60;
  if (activeStars < 12 && Math.random() < chance) spawnFallingStar();
  if (!game.starfall.active || game.weather.active) return;
  game.starfall.crawlerT -= dt;
  if (game.starfall.crawlerT > 0) return;
  game.starfall.crawlerT = (12 + Math.random() * 14) / (1 + game.luck);
  var crawlers = 0;
  for (var p = 0; p < game.pickups.length; p++) if (game.pickups[p].starfallCritter) crawlers++;
  if (crawlers >= 3) return;
  var spot = findDandelionSpot(game.player.x + Math.random() * 600 - 300);
  if (!spot) return;
  game.pickups.push({ item:I.NIGHTCRAWLER, count:1, x:spot.x, y:spot.y, seed:Math.random() * 100, t:0, starfallCritter:true });
}

function spawnFallingStar() {
  var sx = clamp(game.player.x + Math.random() * 900 - 450, 24, game.world.W * TILE - 24);
  var tx = clamp(Math.floor(sx / TILE), 0, game.world.W - 1);
  var sy = game.world.surfaceY[tx] * TILE - 300 - Math.random() * 140;
  game.projectiles.add({ x:sx, y:sy, vx:Math.random() * 2 - 1, vy:5.5 + Math.random() * 2, dmg:1000, type:P.STAR, owner:'world', life:12, fallenStar:true, dead:false, color:'#ffe88a' });
}

function startWeather(duration, wind) {
  game.weather.active = true;
  game.weather.time = duration || (90 + Math.random() * 90);
  game.weather.wind = wind || (Math.random() < 0.5 ? -1 : 1);
  game.weather.intensity = 0;
  game.message('Storm clouds gather over the world.');
}

function updateWeather(dt) {
  var weather = game.weather;
  if (!weather) return;
  weather.windChangeT -= dt;
  if (weather.windChangeT <= 0) {
    weather.windChangeT = 60 + Math.random() * 90;
    weather.windTarget = Math.random() * 60 - 30;
  }
  weather.windSpeed += (weather.windTarget - weather.windSpeed) * Math.min(1, dt * 0.035);
  if (Math.abs(weather.windSpeed) > 0.2) weather.wind = weather.windSpeed < 0 ? -1 : 1;
  var windyWindow = game.timeOfDay >= 0.3125 && game.timeOfDay <= 0.6875;
  if (!weather.windy && windyWindow && Math.abs(weather.windSpeed) > 20) {
    weather.windy = true;
    game.message('The wind is blowing fiercely!');
  } else if (weather.windy && (!windyWindow || Math.abs(weather.windSpeed) < 16)) {
    weather.windy = false;
    game.message('The wind has calmed down.');
  }
  if (!weather.active) { weather.intensity = 0; return; }
  weather.time -= dt;
  weather.intensity = Math.min(1, weather.intensity + dt * 0.35);
  if (weather.time <= 0) {
    weather.active = false;
    weather.time = 0;
    weather.intensity = 0;
    game.message('The storm has passed.');
  }
}

function isWindyDayAt(g, px, py) {
  if (!g.weather || !g.weather.windy || g.timeOfDay < 0.3125 || g.timeOfDay > 0.6875) return false;
  var tx = clamp(Math.floor(px / TILE), 0, g.world.W - 1);
  return py <= g.world.surfaceY[tx] * TILE + 8 * TILE;
}

function weatherKindAt(g, px, py) {
  if (!g.weather || !g.weather.active) return null;
  var tx = clamp(Math.floor(px / TILE), 0, g.world.W - 1);
  var surface = g.world.surfaceY[tx] * TILE;
  if (py > surface + 8 * TILE) return null;
  var biome = g.world.biomeAt(px, py);
  if (biome === BIOME.SNOW) return 'blizzard';
  if (biome === BIOME.DESERT) return 'sandstorm';
  return 'rain';
}

function updateEvents(dt) {
  var ev = game.event;
  if (!ev) return;
  if (ev.type === 'oldonesarmy') {
    updateOldOnesArmy(dt);
    return;
  }
  var wd = EVENT_WAVES[ev.type];
  if (!wd) { game.event = null; return; }

  var day = game.timeOfDay >= 0.25 && game.timeOfDay <= 0.75;
  if (ev.type === 'bloodmoon') {
    if (day) { endEvent('The Blood Moon is fading into the sunrise.'); return; }
    ev.spawnT -= dt;
    var bx = clamp(Math.floor(game.player.x / TILE), 0, game.world.W - 1);
    var bsurf = game.world.surfaceY[bx] * TILE;
    if (ev.spawnT <= 0 && eventAliveCount() < 7 && game.player.y < bsurf + 8 * TILE) {
      var bloodPool = eventTrashPool(wd);
      spawnEventEnemy(bloodPool[Math.floor(Math.random() * bloodPool.length)], true);
      ev.spawnT = 0.45;
    }
    return;
  }
  if (ev.type === 'slimerain') {
    if (ev.kingSpawned) return;
    ev.spawnT -= dt;
    if (ev.spawnT <= 0 && eventAliveCount() < 8) {
      spawnEventEnemy(wd.trash[Math.floor(Math.random() * wd.trash.length)], true);
      ev.spawnT = 0.35;
    }
    return;
  }
  if (!wd.day && (ev.type === 'pumpkinmoon' || ev.type === 'frostmoon') && day) {
    if (eventAliveCount() === 0) {
      endEvent('The moon fades with the dawn.');
    }
    return;
  }
  if (ev.type === 'solareclipse' && !day) {
    endEvent('The eclipse fades. Day returns.');
    return;
  }

  if (ev.state === 'wave') {
    ev.t += dt;
    if (ev.t > 1.5) startWave(ev);
    return;
  }

  if (ev.state === 'spawning') {
    ev.t -= dt;
    if (ev.pending > 0 && ev.t <= 0 && eventAliveCount() < 6) {
      if (ev.minisPending > 0) {
        var minis = eventMiniPool(wd);
        ev.minisPending--;
        ev.pending--;
        var miniId = minis[(minis.length - ev.minisPending - 1) % minis.length];
        var before = game.entities.length;
        game.spawnBoss(miniId);
        for (var bi = before; bi < game.entities.length; bi++) game.entities[bi].eventEnemy = true;
        ev.t = 1.2;
      } else {
        var trash = eventTrashPool(wd);
        var type = trash[Math.floor(Math.random() * trash.length)];
        spawnEventEnemy(type);
        ev.pending--;
        ev.t = 0.5;
      }
    }
    if (ev.pending <= 0 && eventAliveCount() === 0) {
      if (ev.wave >= wd.sizes.length) {
        endEvent('The invasion has been defeated!');
      } else {
        ev.state = 'wave';
        ev.t = 0;
      }
    }
    return;
  }
}

function spawnEventEnemy(type, surfaceOnly) {
  var p = game.player;
  var side = Math.random() < 0.5 ? -1 : 1;
  var sx = clamp(p.x + side * (340 + Math.random() * 220), 32, game.world.W * TILE - 32);
  var def = ENT_DEF[type];
  var sy;
  if (surfaceOnly) {
    var stx = clamp(Math.floor(sx / TILE), 1, game.world.W - 2);
    var ground = game.world.surfaceY[stx] * TILE - 12;
    sy = def.fly ? ground - 60 - Math.random() * 100 : ground;
  } else if (def.fly) sy = clamp(p.y - 80 + Math.random() * 160, 16, game.world.H * TILE - 16);
  else sy = findGroundY(sx);
  var e = spawnEntity(game, type, sx, sy);
  e.eventEnemy = true;
}

function endEvent(msg) {
  var endedType = game.event ? game.event.type : null;
  if (game.event) {
    var firstCompletion = !game.eventCompletions[game.event.type];
    game.eventCompletions[game.event.type] = true;
    if (game.event.type === 'goblinarmy') Achievements.unlock('goblinarmy', game);
    else if (game.event.type === 'pirateinvasion') Achievements.unlock('pirateinvasion', game);
    else if (game.event.type === 'solareclipse') Achievements.unlock('solareclipse', game);
    else if (game.event.type === 'bloodmoon') Achievements.unlock('bloodmoon', game);
    else if (game.event.type === 'pumpkinmoon') Achievements.unlock('pumpkinmoon', game);
    else if (game.event.type === 'frostmoon') Achievements.unlock('frostmoon', game);
    else if (game.event.type === 'martianmadness') Achievements.unlock('martianmadness', game);
    else if (game.event.type === 'frostlegion') Achievements.unlock('frostlegion', game);
    if (firstCompletion && (game.event.type === 'goblinarmy' || game.event.type === 'pirateinvasion' ||
        game.event.type === 'martianmadness' || game.event.type === 'frostlegion')) {
      game.lanternNight.pending = true;
      game.lanternNight.celebrated['event:' + game.event.type] = true;
    }
  }
  game.event = null;
  if (endedType === 'frostlegion') {
    game.frostLegionDefeated = true;
    spawnNpcs();
  }
  if (msg) game.message(msg);
  if (game.bossBars.length > 0) {
    for (var i = game.bossBars.length - 1; i >= 0; i--) {
      if (game.bossBars[i].id.boss === 'mourningwood' ||
          game.bossBars[i].id.boss === 'pumpking' ||
          game.bossBars[i].id.boss === 'everscream' ||
          game.bossBars[i].id.boss === 'santank' ||
          game.bossBars[i].id.boss === 'icequeen' ||
          game.bossBars[i].id.boss === 'martiansaucer' ||
          game.bossBars[i].id.boss === 'goblinwarlock' ||
          game.bossBars[i].id.boss === 'piratecaptain' ||
          game.bossBars[i].id.boss === 'flyingdutchman' ||
          game.bossBars[i].id.boss === 'mothron') {
        game.bossBars.splice(i, 1);
      }
    }
  }
  for (var j = game.entities.length - 1; j >= 0; j--) {
    var e = game.entities[j];
    if (e.boss && (e.boss === 'mourningwood' || e.boss === 'pumpking' || e.boss === 'everscream' ||
        e.boss === 'santank' || e.boss === 'icequeen' || e.boss === 'martiansaucer' ||
        e.boss === 'goblinwarlock' || e.boss === 'piratecaptain' || e.boss === 'flyingdutchman' || e.boss === 'mothron')) {
      e.dead = true;
    }
  }
}

function updateTorchGod(dt) {
  var tg = game.torchGod;
  if (!tg) return;
  if (game.player.dying) {
    game.torchGod = null;
    game.message('The Torch God grows quiet.');
    return;
  }
  if (tg.next < tg.torches.length) {
    tg.shotT -= dt;
    if (tg.shotT > 0) return;
    tg.shotT = 0.14;
    var origin = null;
    while (tg.next < tg.torches.length && !origin) {
      var candidate = tg.torches[tg.next++];
      if (game.world.get(candidate.x, candidate.y) === T.TORCH) origin = candidate;
    }
    if (origin) {
      var sx = origin.x * TILE + 8, sy = origin.y * TILE + 6;
      var ang = Math.atan2(game.player.y - sy, game.player.x - sx);
      game.projectiles.add({
        x:sx, y:sy, vx:Math.cos(ang) * 5.5, vy:Math.sin(ang) * 5.5,
        dmg:24, type:P.FIREBALL, owner:'enemy', life:4, dead:false, color:'#ff9a3d'
      });
      AudioSys.play('shoot');
    }
    if (tg.next >= tg.torches.length) tg.finishT = 1.5;
    return;
  }
  tg.finishT -= dt;
  if (tg.finishT > 0) return;
  game.torchGod = null;
  game.addPickup(game.player.x, game.player.y - 24, I.TORCHGODSFAVOR, 1);
  Achievements.unlock('torchgod', game);
  game.message('The Torch God is satisfied. Its Favor is yours!');
  game.flash();
  AudioSys.play('bossDeath');
}

// ---------- Chests ----------
function tryOpenChest() {
  var tx = MOUSE.tpx, ty = MOUSE.tpy;
  if (tx < 0 || ty < 0 || tx >= game.world.W || ty >= game.world.H) return;
  var chestTile = game.world.get(tx, ty);
  if (chestTile !== T.CHEST && chestTile !== T.SHADOWCHEST) return;
  var p = game.player;
  var cx = tx * TILE + 8, cy = ty * TILE + 8;
  if (dist(p.x, p.y, cx, cy) > 72) { game.message('Too far away.'); return; }
  game.chest = game.world.chestAt(tx, ty);
  if (game.chest && game.chest.locked) {
    var keyId = game.chest.key || I.SHADOWKEY;
    if (p.inventory.countOf(keyId) < 1) {
      game.message('A Shadow Key is required.');
      game.chest = null;
      return;
    }
    game.chest.locked = false;
    game.message('The Shadow Chest unlocks.');
  }
  game.chestOpen = true;
  openPanel();
  switchPanel('chest');
  renderPanel('chest');
}

function closeChest() {
  game.chestOpen = false;
  game.chest = null;
}

// ---------- Town Pylon network ----------
function pylonLinked(rec) {
  var it = ITEMS[rec.item];
  if (!it) return false;
  if (it.pylonBiome === 'any') return true;
  var px = rec.x * TILE + 8, py = rec.y * TILE + 8;
  return game.world.biomeAt(px, py) === it.pylonBiome;
}

function pylonBiomeLabel(b) {
  var names = {};
  names[BIOME.FOREST] = 'Forest'; names[BIOME.JUNGLE] = 'Jungle'; names[BIOME.OCEAN] = 'Ocean';
  names[BIOME.SNOW] = 'Snow'; names[BIOME.DESERT] = 'Desert'; names[BIOME.HALLOW] = 'Hallow';
  names[BIOME.CORRUPT] = 'Corruption'; names[BIOME.CRIMSON] = 'Crimson';
  return names[b] || 'Unknown';
}

function tryOpenPylon() {
  var tx = MOUSE.tpx, ty = MOUSE.tpy;
  if (tx < 0 || ty < 0 || tx >= game.world.W || ty >= game.world.H) return false;
  if (game.world.get(tx, ty) !== T.PYLON) return false;
  var p = game.player;
  var cx = tx * TILE + 8, cy = ty * TILE + 8;
  if (dist(p.x, p.y, cx, cy) > 72) { game.message('Too far away.'); return true; }
  var rec = game.world.pylonAt(tx, ty);
  if (!rec) return false;
  var linked = 0;
  for (var i = 0; i < game.world.pylons.length; i++) {
    if (pylonLinked(game.world.pylons[i])) linked++;
  }
  if (linked < 2) {
    game.message('You need at least two linked pylons to use the network.');
    return true;
  }
  game.pylonOpen = true;
  game.activePylon = rec;
  openPanel();
  switchPanel('pylon');
  renderPanel('pylon');
  return true;
}

function tryTogglePartyCenter() {
  var tx = MOUSE.tpx, ty = MOUSE.tpy;
  if (!game.world.inBounds(tx, ty) || game.world.get(tx, ty) !== T.PARTYCENTER) return false;
  if (dist(game.player.x, game.player.y, tx * TILE + 8, ty * TILE + 8) > 72) { game.message('Too far away.'); return true; }
  if (game.party.active) {
    if (game.party.natural) game.message('A naturally started Party cannot be stopped early.');
    else endParty('The Party Center has stopped the Party.');
  } else startParty(true);
  return true;
}

function renderPylon() {
  var pylons = game.world.pylons;
  var html = '<h3>Teleport Network</h3>';
  if (pylons.length === 0) {
    html += '<div class="ddesc">No pylons placed yet. Craft one and place it in its biome.</div>';
  } else {
    html += '<div class="pylon-list">';
    for (var i = 0; i < pylons.length; i++) {
      var rec = pylons[i];
      var it = ITEMS[rec.item];
      var ok = pylonLinked(rec);
      var isHere = game.activePylon && rec.x === game.activePylon.x && rec.y === game.activePylon.y;
      var tilesAway = Math.round(dist(game.player.x, game.player.y, rec.x * TILE + 8, rec.y * TILE + 8) / TILE);
      var btn;
      if (isHere) btn = '<span class="pyloc">You are here</span>';
      else if (ok) btn = '<button class="pylon-btn" data-pidx="' + i + '">Teleport</button>';
      else btn = '<span class="pyloc">Wrong biome</span>';
      var where = it.pylonBiome === 'any' ? 'Universal' : pylonBiomeLabel(it.pylonBiome);
      html += '<div class="pylon-row' + (ok ? ' linked' : ' off') + '">' +
        '<div class="picon">' + itemIconHTML(it) + '</div>' +
        '<div class="pinfo"><div class="pname">' + it.name + '</div>' +
        '<div class="pdesc">' + where + ' pylon' + (ok ? '' : ' — not in its biome') + ' · ' + tilesAway + ' tiles away</div></div>' +
        btn + '</div>';
    }
    html += '</div>';
  }
  html += '<div class="ddesc">Right-click a pylon to open its network. A pylon links when placed in its own biome (Universal always links). With two linked pylons you can teleport between them.</div>';
  html += '<button id="pylon-close" class="btn">Close</button>';
  $('panel-pylon').innerHTML = html;
  var bc = document.getElementById('pylon-close');
  if (bc) bc.addEventListener('click', function() { closePanel(); });
}

function pylonTeleport(idx) {
  var rec = game.world.pylons[idx];
  if (!rec) return;
  if (!pylonLinked(rec)) { game.message('That pylon is not linked.'); return; }
  var p = game.player;
  var px = rec.x * TILE + 8;
  var ty = rec.y;
  while (ty > 0 && game.world.isSolid(rec.x, ty - 1)) ty--;
  p.x = px;
  p.y = ty * TILE - 15;
  p.vx = 0; p.vy = 0; p.fallDist = 0;
  if (p.hook) p.hook = null;
  game.fx.push({ type: 'cast', x: p.x, y: p.y - 6, t: 0.4, max: 0.4 });
  AudioSys.play('spawn');
  game.flash();
  game.message('Teleported to the ' + ITEMS[rec.item].name + '!');
  Achievements.unlock('pylon', game);
  closePanel();
}

function checkAchievements() {
  var p = game.player, w = game.world;
  var cx = clamp(Math.floor(p.x / TILE), 0, w.W - 1);
  var surf = w.surfaceY[cx] * TILE;
  if (!game.achFirst) { game.achFirst = true; Achievements.unlock('firststeps', game); }
  if (!game.achDeep && p.y > w.H * TILE * 0.72) { game.achDeep = true; Achievements.unlock('deep', game); }
  if (!game.achSky && p.y < surf - 26 * TILE) { game.achSky = true; Achievements.unlock('sky', game); }
  if (!game.achTemple && w.biomeAt(p.x, p.y) === BIOME.TEMPLE) { game.achTemple = true; Achievements.unlock('temple', game); }
  if (!game.achMaxhp && p.maxHp >= 400) { game.achMaxhp = true; Achievements.unlock('maxhp', game); }
  if (!game.achGraveyard && w.graveyardStrengthAt(p.x, p.y) >= 7) { game.achGraveyard = true; Achievements.unlock('graveyard', game); }
}

function findGroundY(wx) {
  var tx = clamp(Math.floor(wx / TILE), 1, game.world.W - 2);
  var ty = clamp(Math.floor(game.player.y / TILE) - 30, 1, game.world.H - 2);
  for (var y = ty; y < game.world.H - 1; y++) {
    if (game.world.isSolid(tx, y)) return y * TILE - 12;
  }
  return ty * TILE;
}

function findDandelionSpot(wx) {
  var center = clamp(Math.floor(wx / TILE), 2, game.world.W - 3);
  for (var radius = 0; radius <= 48; radius++) {
    for (var side = -1; side <= 1; side += 2) {
      if (radius === 0 && side === 1) continue;
      var tx = clamp(center + radius * side, 2, game.world.W - 3);
      var surface = game.world.surfaceY[tx];
      for (var ground = Math.max(2, surface - 4); ground <= Math.min(game.world.H - 2, surface + 4); ground++) {
        var tile = game.world.get(tx, ground);
        if ((tile === T.GRASS || tile === T.HALLOWGRASS) && game.world.get(tx, ground - 1) === T.AIR && game.world.get(tx, ground - 2) === T.AIR && game.world.wall(tx, ground - 1) === WALL.NONE) {
          return { x:tx * TILE + 8, y:ground * TILE - 16 };
        }
      }
    }
  }
  return null;
}

function updateStrangePlants(dt) {
  if (!game.hardmode) return;
  game.strangePlantT -= dt;
  if (game.strangePlantT > 0) return;
  game.strangePlantT = 45 + Math.random() * 45;
  var plants = [];
  for (var i = 0; i < game.pickups.length; i++) {
    if (game.pickups[i].item === I.STRANGEPLANT) plants.push(game.pickups[i]);
  }
  if (plants.length >= 4) return;
  for (var attempt = 0; attempt < 12; attempt++) {
    var wx = 32 + Math.random() * (game.world.W * TILE - 64);
    var spot = findDandelionSpot(wx);
    if (!spot) continue;
    var separated = true;
    for (var j = 0; j < plants.length; j++) {
      if (dist(spot.x, spot.y, plants[j].x, plants[j].y) < 80 * TILE) { separated = false; break; }
    }
    if (!separated) continue;
    game.addPickup(spot.x, spot.y, I.STRANGEPLANT, 1);
    return;
  }
}

function pickEnemy() {
  var p = game.player, w = game.world;
  var cx = clamp(Math.floor(p.x / TILE), 0, w.W - 1);
  var surf = w.surfaceY[cx] * TILE;
  var depth = (p.y - surf) / TILE;
  var f = p.x / (w.W * TILE);
  var night = game.timeOfDay < 0.25 || game.timeOfDay > 0.75;
  var biome = w.biomeAt(p.x, p.y);
  var localWeather = weatherKindAt(game, p.x, p.y);
  var windyDay = isWindyDayAt(game, p.x, p.y);
  var lunarActive = game.pillarsSpawned && game.pillarsDestroyed < 4;
  var pool = [];
  var graveyard = w.graveyardStrengthAt(p.x, p.y);

  if (graveyard >= 7 && (depth < 0 || depth >= 30) && biome !== BIOME.UNDERWORLD && biome !== BIOME.TEMPLE && biome !== BIOME.DUNGEON) {
    pool.push(E.GHOST, E.GHOST, E.ZOMBIE, E.DEMONEYE, E.BRIDE, E.GROOM);
    if (game.hardmode) pool.push(E.HOPPINJACK);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // ---------- Pre-hardmode spawning ----------
  if (!game.hardmode) {
    if (depth < -12) {
      pool.push(E.HARPY, E.GIANTBAT, E.SLIME);
    } else if (depth < 12) {
      if (biome === BIOME.JUNGLE) {
        pool.push(E.JUNGLEBAT, E.JUNGLESLIME, E.SPIKEDJUNGLESLIME, E.HORNET);
      } else if (biome === BIOME.OCEAN) {
        pool.push(E.ZOMBIE, E.GIANTBAT, E.SQUID, E.PINKJELLYFISH, E.CRAWDAD);
      } else if (biome === BIOME.CORRUPT) {
        pool.push(E.EATEROFSOULS, E.DEVOURER, E.CORRUPTSLIME, E.CORRUPTCRIMSONFLYER);
      } else if (biome === BIOME.CRIMSON) {
        pool.push(E.CRIMERA, E.FACEMONSTER, E.BLOODCRAWLER, E.CORRUPTCRIMSONFLYER);
      } else if (biome === BIOME.HALLOW) {
        pool.push(E.SLIME, E.PINKSLIME, E.ZOMBIE);
      } else if (biome === BIOME.SNOW) {
        pool.push(E.ZOMBIE, E.DEMONEYE, E.GIANTBAT, E.ICESLIME, E.SPIKEDICESLIME, E.UNDEADVIKING);
      } else if (biome === BIOME.DESERT) {
        pool.push(E.ANTLION, E.ANTLIONCHARGER, E.GIANTBAT, E.SANDSLIME);
      } else if (biome === BIOME.MUSHROOM) {
        pool.push(E.SLIME, E.PINKSLIME, E.ZOMBIE);
        if (night) pool.push(E.SPOREZOMBIE);
      } else {
        pool.push(E.SLIME, E.SLIME, E.SLIME, E.SLIME, E.BLUESLIME, E.MOTHERSLIME);
        if (Math.random() < 0.04) pool.push(E.PINKY);
        if (night) pool.push(E.ZOMBIE, E.DEMONEYE, E.CAVEBAT, E.GOBLIN, E.SKELETON);
        if (night && Math.random() < 0.04) pool.push(E.DRBONES);
      }
      if (night && Math.random() < 0.25) pool.push(E.DEMONEYE);
    } else if (depth < 30) {
      if (biome === BIOME.UNDERWORLD) {
        pool.push(E.LAVASLIME, E.HELLBAT, E.DEMON, E.FIREIMP, E.BONESERPENT, E.VOODOODEMON);
      } else if (biome === BIOME.SPIDER) {
        pool.push(E.BLOODCRAWLER);
      } else if (biome === BIOME.GRANITE) {
        pool.push(E.GRANITEGOLEM);
      if (game.hardmode) pool.push(E.GRANITEELEMENTAL);
      } else if (biome === BIOME.MARBLE) {
        pool.push(E.MARBLEGOLEM, E.MEDUSA);
      } else if (biome === BIOME.JUNGLE) {
        pool.push(E.JUNGLEBAT, E.JUNGLESLIME, E.SPIKEDJUNGLESLIME, E.HORNET, E.GIANTBAT, E.MANEATER, E.JUNGLECREEPER);
      } else if (biome === BIOME.CORRUPT) {
        pool.push(E.EATEROFSOULS, E.DEVOURER, E.CORRUPTSLIME, E.CORRUPTCRIMSONFLYER);
      } else if (biome === BIOME.CRIMSON) {
        pool.push(E.CRIMERA, E.FACEMONSTER, E.BLOODCRAWLER, E.CORRUPTCRIMSONFLYER);
      } else if (biome === BIOME.HALLOW) {
        pool.push(E.SLIME, E.ZOMBIE, E.CAVEBAT);
      } else if (biome === BIOME.TEMPLE) {
        pool.push(E.JUNGLEBAT, E.HORNET, E.JUNGLESLIME);
      } else if (biome === BIOME.DUNGEON) {
        pool.push(E.CURSEDSKULL, E.ANGRYBONES, E.DARKCASTER, E.DUNGEONSLIME, E.WALLWARRIOR, E.SPIKEBALL);
      } else if (biome === BIOME.UNDERDESERT) {
        pool.push(E.ANTLION, E.ANTLIONCHARGER, E.ANTLIONSWARMER, E.DUNGEONSCORPION, E.DIGGER);
      } else if (biome === BIOME.UNDERSNOW) {
        pool.push(E.ICESLIME, E.SPIKEDICESLIME, E.ICEBAT, E.SNOWFLINX, E.UNDEADVIKING);
      } else {
        pool.push(E.ZOMBIE, E.CAVEBAT, E.GIANTBAT, E.SLIME, E.JUNGLESLIME, E.GIANTWORM, E.SKELETON, E.MOTHERSLIME, E.BLUESLIME);
        if (Math.random() < 0.03) pool.push(E.PINKY);
      }
      pool.push(E.CAVEBAT, E.GIANTBAT);
    } else {
      if (biome === BIOME.UNDERWORLD) {
        pool.push(E.LAVASLIME, E.HELLBAT, E.DEMON, E.FIREIMP, E.BONESERPENT, E.VOODOODEMON);
      } else if (biome === BIOME.SPIDER) {
        pool.push(E.BLOODCRAWLER);
      } else if (biome === BIOME.GRANITE) {
        pool.push(E.GRANITEGOLEM);
      if (game.hardmode) pool.push(E.GRANITEELEMENTAL);
      } else if (biome === BIOME.MARBLE) {
        pool.push(E.MARBLEGOLEM, E.MEDUSA);
      } else if (biome === BIOME.JUNGLE) {
        pool.push(E.JUNGLEBAT, E.JUNGLESLIME, E.SPIKEDJUNGLESLIME, E.HORNET, E.GIANTBAT, E.MANEATER, E.JUNGLECREEPER);
      } else if (biome === BIOME.DUNGEON) {
        pool.push(E.CURSEDSKULL, E.ANGRYBONES, E.DARKCASTER, E.DUNGEONSLIME, E.WALLWARRIOR, E.SPIKEBALL);
      } else if (biome === BIOME.UNDERDESERT) {
        pool.push(E.ANTLION, E.ANTLIONCHARGER, E.ANTLIONSWARMER, E.DUNGEONSCORPION, E.DIGGER);
      } else if (biome === BIOME.UNDERSNOW) {
        pool.push(E.ICESLIME, E.SPIKEDICESLIME, E.ICEBAT, E.SNOWFLINX, E.UNDEADVIKING);
      } else {
        pool.push(E.ZOMBIE, E.CAVEBAT, E.GIANTBAT, E.SLIME, E.UNDEADMINER, E.GIANTWORM, E.SKELETON, E.BLUESLIME);
        if (Math.random() < 0.03) pool.push(E.MOTHERSLIME, E.PINKY);
      }
    }
    if (depth < 0 && depth > -12) {
      if (localWeather === 'rain') pool.push(E.FLYINGFISH, E.FLYINGFISH, E.UMBRELLASLIME);
      else if (localWeather === 'blizzard') pool.push(E.SNOWFLINX, E.WOLF);
      else if (localWeather === 'sandstorm') pool.push(E.ANGRYTUMBLER, E.ANGRYTUMBLER);
    }
    if (windyDay && depth < 0 && depth > -12) pool.push(E.ANGRYDANDELION, E.WINDYBALLOON, E.WINDYBALLOON, E.LADYBUG);
    if (depth < 0 && depth > -12 && biome === BIOME.FOREST && Math.random() < 0.08) pool.push(E.GOBLINSCOUT);
    if (!pool.length) pool.push(E.SLIME);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  if (depth < 0 && depth > -12) {
    if (localWeather === 'rain') pool.push(E.FLYINGFISH, E.ANGRYNIMBUS, E.UMBRELLASLIME);
    else if (localWeather === 'blizzard') pool.push(E.SNOWFLINX, E.WOLF, E.ICEGOLEM);
    else if (localWeather === 'sandstorm') pool.push(E.ANGRYTUMBLER, E.SANDELEMENTAL);
  }
  if (windyDay && depth < 0 && depth > -12) pool.push(E.ANGRYDANDELION, E.WINDYBALLOON, E.WINDYBALLOON, E.LADYBUG);
  if (depth < 0 && depth > -12 && biome === BIOME.FOREST && Math.random() < 0.08) pool.push(E.GOBLINSCOUT);

  // lunar pillars aftermath: high-tier spawns everywhere in space
  if (depth < -24) {
    pool.push(E.WYVERN, E.PIXIE, E.GASTROPOD, E.HARPY);
    if (lunarActive) pool.push(E.CORITE, E.SELENIAN, E.LUNARFLAME, E.VORTEXIAN, E.STORMDIVER, E.NEBULAFLOATER, E.PREDICTOR, E.STARDJUSTCELL, E.STARGAZER);
    if (!game.event && game.bossesDefeated.golem && Math.random() < 0.12) pool.push(E.MARTIANPROBE);
  } else if (depth < 12) {
    if (biome === BIOME.JUNGLE) {
      pool.push(E.JUNGLEBAT, E.JUNGLESLIME, E.SPIKEDJUNGLESLIME, E.HORNET, E.MOSSHORNET, E.DERPLING);
      if (night) pool.push(E.MOTH);
      } else if (biome === BIOME.OCEAN) {
        pool.push(E.ZOMBIE, E.HARDZOMBIE, E.ANGLERFISH, E.ARAPAIMA, E.SQUID, E.PINKJELLYFISH, E.CRAWDAD);
      } else if (biome === BIOME.CORRUPT) {
      pool.push(E.EATEROFSOULS, E.CORRUPTOR, E.CORRUPTSLIME, E.WRATH, E.HARDZOMBIE, E.CURSEDHAMMER);
    } else if (biome === BIOME.CRIMSON) {
      pool.push(E.CRIMERA, E.FACEMONSTER, E.HERPLING, E.BLOODCRAWLER, E.CRIMSONAXE, E.ICHORSTICKER, E.CRIMSLIME);
    } else if (biome === BIOME.HALLOW) {
      pool.push(E.PIXIE, E.UNICORN, E.CHAOSELEMENTAL, E.GASTROPOD, E.HALLOWEDMIMIC);
    } else if (biome === BIOME.SNOW) {
      pool.push(E.ICEBAT, E.SNOWFLINX, E.SPIKEDICESLIME, E.ICETORTOISE, E.ICEGOLEM, E.PIGRON, E.WOLF, E.ICEELEMENTAL, E.UNDEADVIKING);
    } else if (biome === BIOME.DESERT) {
      pool.push(E.MUMMY, E.DARKMUMMY, E.BLOODMUMMY, E.LIGHTMUMMY, E.SANDSLIME, E.BASILISK);
    } else if (biome === BIOME.MUSHROOM) {
      pool.push(E.PIGRON, E.ANGLERFISH, E.DERPLING, E.SPOREZOMBIE);
    } else {
      pool.push(E.HOPPINJACK, E.SLIME, E.BLUESLIME, E.MOTHERSLIME);
      if (night) pool.push(E.ZOMBIE, E.HARDZOMBIE, E.WRATH, E.WEREWOLF, E.SKELETON);
      else pool.push(E.PINKSLIME, E.UNICORN);
    }
    if (lunarActive && Math.random() < 0.1) pool.push(E.CORITE, E.SELENIAN, E.LUNARFLAME, E.ALIENHORNET, E.STORMDIVER, E.PREDICTOR, E.STARGAZER);
  } else if (depth < 45) {
    if (biome === BIOME.UNDERWORLD) {
      pool.push(E.LAVASLIME, E.HELLBAT, E.DEMON, E.FIREIMP, E.BONESERPENT, E.VOODOODEMON);
    } else if (biome === BIOME.SPIDER) {
      pool.push(E.BLOODCRAWLER, E.BLACKRECLUSE);
    } else if (biome === BIOME.GRANITE) {
      pool.push(E.GRANITEGOLEM);
      if (game.hardmode) pool.push(E.GRANITEELEMENTAL);
    } else if (biome === BIOME.MARBLE) {
      pool.push(E.MARBLEGOLEM, E.MEDUSA);
    } else if (biome === BIOME.JUNGLE) {
      pool.push(E.JUNGLEBAT, E.JUNGLESLIME, E.SPIKEDJUNGLESLIME, E.HORNET, E.MOSSHORNET, E.GIANTTORTOSE, E.DERPLING);
    } else if (biome === BIOME.CORRUPT) {
      pool.push(E.EATEROFSOULS, E.CORRUPTOR, E.CORRUPTSLIME, E.WRATH, E.HARDZOMBIE, E.CLINGER, E.CURSEDHAMMER);
    } else if (biome === BIOME.CRIMSON) {
      pool.push(E.CRIMERA, E.FACEMONSTER, E.HERPLING, E.BLOODCRAWLER, E.CRIMSONAXE, E.ICHORSTICKER, E.CRIMSLIME);
    } else if (biome === BIOME.HALLOW) {
      pool.push(E.PIXIE, E.GASTROPOD, E.CHAOSELEMENTAL, E.HALLOWEDMIMIC);
    } else if (biome === BIOME.TEMPLE) {
      pool.push(E.LIHZARD, E.FLYINGSNAKE);
    } else if (biome === BIOME.SNOW) {
      pool.push(E.ICEBAT, E.ICETORTOISE, E.ICEGOLEM, E.ANGLERFISH, E.WOLF, E.UNDEADVIKING);
    } else if (biome === BIOME.DESERT) {
      pool.push(E.MUMMY, E.DARKMUMMY, E.LIGHTMUMMY, E.ANGLERFISH, E.BASILISK);
    } else if (biome === BIOME.DUNGEON) {
      pool.push(E.CURSEDSKULL, E.ANGRYBONES, E.DARKCASTER, E.DUNGEONSLIME, E.ARMOREDBONES, E.WALLWARRIOR, E.SPIKEBALL);
      if (game.bossesDefeated.plantera) pool.push(E.PALADIN, E.TACTICALSKELETON, E.SKELETONSNIPER, E.SKELETONCOMMANDO, E.RAGGEDCASTER, E.NECROMANCER, E.DIABOLIST, E.BONELEE, E.GIANTCURSEDSKULL);
    } else if (biome === BIOME.UNDERDESERT) {
      pool.push(E.ANTLION, E.ANTLIONCHARGER, E.ANTLIONSWARMER, E.DUNGEONSCORPION, E.MUMMY, E.DUNESPLICER, E.BASILISK);
    } else if (biome === BIOME.UNDERSNOW) {
      pool.push(E.ICESLIME, E.SPIKEDICESLIME, E.ICEBAT, E.SNOWFLINX, E.ICEGOLEM, E.UNDEADVIKING);
    } else {
      pool.push(E.HARDZOMBIE, E.WRATH, E.HOPPINJACK, E.CHAOSELEMENTAL, E.MIMIC, E.SKELETONARCHER, E.TOXICSLUDGE, E.SKELETON, E.BLUESLIME);
      if (Math.random() < 0.04) pool.push(E.MOTHERSLIME, E.PINKY);
    }
    if (lunarActive && Math.random() < 0.1) pool.push(E.CORITE, E.SELENIAN, E.LUNARFLAME, E.ALIENHORNET, E.STORMDIVER, E.PREDICTOR, E.STARGAZER);
  } else {
    if (biome === BIOME.UNDERWORLD) {
      pool.push(E.LAVASLIME, E.HELLBAT, E.DEMON, E.FIREIMP, E.BONESERPENT, E.VOODOODEMON);
    } else if (biome === BIOME.SPIDER) {
      pool.push(E.BLOODCRAWLER, E.BLACKRECLUSE);
    } else if (biome === BIOME.GRANITE) {
      pool.push(E.GRANITEGOLEM);
      if (game.hardmode) pool.push(E.GRANITEELEMENTAL);
    } else if (biome === BIOME.MARBLE) {
      pool.push(E.MARBLEGOLEM, E.MEDUSA);
    } else if (biome === BIOME.AETHER) {
      pool.push(E.CHAOSELEMENTAL, E.PIXIE, E.HALLOWEDMIMIC);
    } else if (biome === BIOME.JUNGLE) {
      pool.push(E.JUNGLEBAT, E.JUNGLESLIME, E.SPIKEDJUNGLESLIME, E.HORNET, E.MOSSHORNET, E.GIANTTORTOSE, E.ARAPAIMA);
    } else if (biome === BIOME.CORRUPT) {
      pool.push(E.CORRUPTOR, E.CORRUPTSLIME, E.WRATH, E.EATEROFSOULS, E.CORRUPTMIMIC);
    } else if (biome === BIOME.CRIMSON) {
      pool.push(E.CRIMERA, E.FACEMONSTER, E.HERPLING, E.CRIMSONAXE, E.ICHORSTICKER, E.CRIMSONMIMIC);
    } else if (biome === BIOME.HALLOW) {
      pool.push(E.PIXIE, E.CHAOSELEMENTAL, E.GASTROPOD, E.HALLOWEDMIMIC);
    } else if (biome === BIOME.TEMPLE) {
      pool.push(E.LIHZARD, E.FLYINGSNAKE);
    } else if (biome === BIOME.DUNGEON) {
      pool.push(E.CURSEDSKULL, E.ANGRYBONES, E.DARKCASTER, E.DUNGEONSLIME, E.ARMOREDBONES, E.WALLWARRIOR, E.SPIKEBALL);
      if (game.bossesDefeated.plantera) pool.push(E.PALADIN, E.TACTICALSKELETON, E.SKELETONSNIPER, E.SKELETONCOMMANDO, E.RAGGEDCASTER, E.NECROMANCER, E.DIABOLIST, E.BONELEE, E.GIANTCURSEDSKULL);
    } else if (biome === BIOME.UNDERDESERT) {
      pool.push(E.ANTLION, E.ANTLIONCHARGER, E.ANTLIONSWARMER, E.DUNGEONSCORPION, E.MUMMY, E.DUNESPLICER, E.BASILISK);
    } else if (biome === BIOME.UNDERSNOW) {
      pool.push(E.ICESLIME, E.SPIKEDICESLIME, E.ICEBAT, E.SNOWFLINX, E.ICEGOLEM, E.ANGLERFISH);
    } else {
      pool.push(E.HARDZOMBIE, E.WRATH, E.CHAOSELEMENTAL, E.CORRUPTOR, E.GASTROPOD, E.HOPPINJACK, E.MIMIC, E.SKELETONARCHER, E.TOXICSLUDGE, E.NYMPH, E.SKELETON, E.BLUESLIME);
      if (Math.random() < 0.04) pool.push(E.MOTHERSLIME, E.PINKY);
    }
    if (lunarActive && Math.random() < 0.15) pool.push(E.CORITE, E.SELENIAN, E.LUNARFLAME, E.VORTEXIAN, E.STORMDIVER, E.NEBULAFLOATER, E.PREDICTOR, E.STARDJUSTCELL, E.STARGAZER);
  }
  if (!pool.length) pool.push(E.SLIME);
  return pool[Math.floor(Math.random() * pool.length)];
}

// ---------- Input ----------
function initInput() {
  document.addEventListener('keydown', function(e) {
    if (e.repeat) return;
    KEY[e.key] = true;
    KEY_JUST[e.key] = true;
    if (e.key === ' ') { KEY['Space'] = true; KEY_JUST['Space'] = true; }
    if (e.key === 'Escape' || e.key === 'Esc') { KEY_JUST['Escape'] = true; KEY_JUST['Esc'] = true; }
    if ([' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].indexOf(e.key) >= 0) e.preventDefault();
    AudioSys.init();
    AudioSys.resume();
  });
  document.addEventListener('keyup', function(e) {
    KEY[e.key] = false;
    if (e.key === ' ') KEY['Space'] = false;
  });
  document.addEventListener('mousemove', function(e) {
    MOUSE.x = e.clientX; MOUSE.y = e.clientY;
    if (game && game.started && game.cam) {
      MOUSE.wx = MOUSE.x - canvas.width / 2 + game.cam.x;
      MOUSE.wy = MOUSE.y - canvas.height / 2 + game.cam.y;
      MOUSE.tpx = Math.floor(MOUSE.wx / TILE);
      MOUSE.tpy = Math.floor(MOUSE.wy / TILE);
    }
  });
  document.addEventListener('mousedown', function(e) {
    AudioSys.init();
    AudioSys.resume();
    if (e.button === 0) MOUSE.down = true;
    else if (e.button === 2) { MOUSE.right = true; MOUSE.rightJust = true; }
  });
  document.addEventListener('mouseup', function(e) {
    if (e.button === 0) MOUSE.down = false;
    else if (e.button === 2) MOUSE.right = false;
  });
  document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
  document.addEventListener('wheel', function(e) {
    MOUSE.wheel = e.deltaY > 0 ? 1 : -1;
  }, { passive: true });
}

function handleKeys() {
  if (!game || !game.started) return;

  if (KEY_JUST['Escape'] || KEY_JUST['Esc']) {
    if (game.panelOpen) closePanel();
    else togglePause();
    KEY_JUST['Escape'] = false; KEY_JUST['Esc'] = false;
    return;
  }
  if (game.paused) return;

  if (KEY_JUST['e'] || KEY_JUST['E']) togglePanel();
  if (KEY_JUST['h'] || KEY_JUST['H']) openGuide();
  if (KEY_JUST['q'] || KEY_JUST['Q']) dropSelected();

  var keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  for (var i = 0; i < keys.length; i++) {
    if (KEY_JUST[keys[i]]) game.player.inventory.selected = i;
  }

  for (var k in KEY_JUST) if (KEY_JUST[k]) KEY_JUST[k] = false;
}

// ---------- Bestiary ----------
var BESTIARY_BOSSES = [
  { key:'b:kingslime', name:'King Slime' },
  { key:'b:eyeofcthulhu', name:'Eye of Cthulhu' },
  { key:'b:eaterofworlds', name:'Eater of Worlds' },
  { key:'b:brainofcthulhu', name:'Brain of Cthulhu' },
  { key:'b:queenbee', name:'Queen Bee' },
  { key:'b:skeletron', name:'Skeletron' },
  { key:'b:deerclops', name:'Deerclops' },
  { key:'b:wallofflesh', name:'Wall of Flesh' },
  { key:'b:twins:retinazer', name:'Retinazer' },
  { key:'b:twins:spazmatism', name:'Spazmatism' },
  { key:'b:destroyer', name:'The Destroyer' },
  { key:'b:skelprime', name:'Skeletron Prime' },
  { key:'b:queenslime', name:'Queen Slime' },
  { key:'b:plantera', name:'Plantera' },
  { key:'b:golem', name:'Golem' },
  { key:'b:duke', name:'Duke Fishron' },
  { key:'b:empress', name:'Empress of Light' },
  { key:'b:cultist', name:'Lunatic Cultist' },
  { key:'b:lunar:solar', name:'Solar Pillar' },
  { key:'b:lunar:vortex', name:'Vortex Pillar' },
  { key:'b:lunar:nebula', name:'Nebula Pillar' },
  { key:'b:lunar:stardust', name:'Stardust Pillar' },
  { key:'b:moonlord', name:'Moon Lord' },
  { key:'b:mourningwood', name:'Mourning Wood' },
  { key:'b:pumpking', name:'Pumpking' },
  { key:'b:everscream', name:'Everscream' },
  { key:'b:santank', name:'Santa-NK1' },
  { key:'b:icequeen', name:'Ice Queen' },
  { key:'b:martiansaucer', name:'Martian Saucer' },
  { key:'b:piratecaptain', name:'Pirate Captain' },
  { key:'b:flyingdutchman', name:'Flying Dutchman' },
  { key:'b:mothron', name:'Mothron' },
  { key:'b:darkmage', name:'Dark Mage' },
  { key:'b:ogre', name:'Ogre' },
  { key:'b:betsy', name:'Betsy' }
];
var BESTIARY_ENTITY_EXCLUDE = {};
var bestiaryCatalogCache = null;
var bestiaryCatalogMapCache = null;

(function() {
  var types = [E.LUNARPILLAR, E.MOURNINGWOOD, E.PUMPKING, E.EVERSCREAM, E.SANTANK, E.ICEQUEEN,
    E.MARTIANSAUCER, E.GOBLINWARLOCK, E.PIRATECAPTAIN, E.FLYINGDUTCHMAN, E.MOTHRON,
    E.FROSTZOMBIE, E.PIRATESHARK];
  for (var i = 0; i < types.length; i++) BESTIARY_ENTITY_EXCLUDE[types[i]] = true;
})();

function bestiaryCatalog() {
  if (bestiaryCatalogCache) return bestiaryCatalogCache;
  var entries = [];
  for (var id in ENT_DEF) {
    if (!Object.prototype.hasOwnProperty.call(ENT_DEF, id)) continue;
    var type = +id, def = ENT_DEF[id];
    if (!def || def.hp >= 9000 || BESTIARY_ENTITY_EXCLUDE[type]) continue;
    entries.push({ key:'e:' + type, name:def.name, kind:def.dmg > 0 ? 'Creature' : 'Critter', hp:def.hp, dmg:def.dmg, def:def.def });
  }
  entries.sort(function(a, b) { return a.name < b.name ? -1 : (a.name > b.name ? 1 : 0); });
  for (var i = 0; i < BESTIARY_BOSSES.length; i++) {
    entries.push({ key:BESTIARY_BOSSES[i].key, name:BESTIARY_BOSSES[i].name, kind:'Boss' });
  }
  bestiaryCatalogCache = entries;
  return entries;
}

function bestiaryCatalogMap() {
  if (bestiaryCatalogMapCache) return bestiaryCatalogMapCache;
  bestiaryCatalogMapCache = {};
  var entries = bestiaryCatalog();
  for (var i = 0; i < entries.length; i++) bestiaryCatalogMapCache[entries[i].key] = entries[i];
  return bestiaryCatalogMapCache;
}

function bestiaryKey(e) {
  if (!e || e.minion || e.armType || e.rescue) return null;
  if (e.boss) {
    var bossKey = 'b:' + e.boss;
    if ((e.boss === 'twins' || e.boss === 'lunar') && e.sub) bossKey += ':' + e.sub;
    return bossKey;
  }
  if (e.type === undefined || e.type < 0 || !ENT_DEF[e.type]) return null;
  return 'e:' + e.type;
}

function recordBestiary(g, e, killed) {
  if (!g || !g.bestiary) return false;
  var key = bestiaryKey(e), entry = key && bestiaryCatalogMap()[key];
  if (!entry) return false;
  var rec = g.bestiary[key];
  if (!rec) rec = g.bestiary[key] = { seen:true, kills:0 };
  rec.seen = true;
  if (killed) rec.kills = Math.max(0, rec.kills || 0) + 1;
  if (e.boss) {
    rec.hp = Math.max(1, Math.round(e.maxHp || e.hp || 1));
    rec.dmg = Math.max(0, Math.round(e.dmg || 0));
    rec.def = Math.max(0, Math.round(e.defV === undefined ? (e.def || 0) : e.defV));
  }
  checkBestiaryMilestones();
  return true;
}

function checkBestiaryMilestones() {
  var pct = bestiaryCompletionPercent();
  if (pct >= 30) Achievements.unlock('bestiary30', game);
  if (pct >= 90) Achievements.unlock('bestiary90', game);
}

function discoverBestiaryEntity(g, e) {
  if (e._bestiarySeen) return;
  var p = g.player;
  if (Math.abs(e.x - p.x) > canvas.width / 2 + 80 || Math.abs(e.y - p.y) > canvas.height / 2 + 80) return;
  if (recordBestiary(g, e, false)) e._bestiarySeen = true;
}

function bestiaryCompletionPercent() {
  if (!game || !game.bestiary) return 0;
  var entries = bestiaryCatalog(), discovered = 0;
  for (var i = 0; i < entries.length; i++) {
    var rec = game.bestiary[entries[i].key];
    if (rec && rec.seen) discovered++;
  }
  return entries.length ? Math.floor(discovered / entries.length * 100) : 0;
}

function sanitizeBestiary(saved) {
  var clean = {}, map = bestiaryCatalogMap();
  if (!saved || typeof saved !== 'object') return clean;
  for (var key in saved) {
    if (!Object.prototype.hasOwnProperty.call(saved, key) || !map[key]) continue;
    var old = saved[key];
    if (!old || typeof old !== 'object') continue;
    var killCount = clamp(Math.floor(old.kills || 0), 0, 999999999);
    var rec = { seen:!!old.seen || killCount > 0, kills:killCount };
    if (!rec.seen && !rec.kills) continue;
    if (map[key].kind === 'Boss') {
      if (isFinite(old.hp)) rec.hp = Math.max(1, Math.round(old.hp));
      if (isFinite(old.dmg)) rec.dmg = Math.max(0, Math.round(old.dmg));
      if (isFinite(old.def)) rec.def = Math.max(0, Math.round(old.def));
    }
    clean[key] = rec;
  }
  return clean;
}

function bestiaryHTML() {
  var entries = bestiaryCatalog(), discovered = 0, kills = 0;
  for (var i = 0; i < entries.length; i++) {
    var counted = game.bestiary[entries[i].key];
    if (counted && counted.seen) discovered++;
    if (counted) kills += counted.kills || 0;
  }
  var percent = entries.length ? Math.floor(discovered / entries.length * 100) : 0;
  var html = '<div class="town-service bestiary"><h4>Bestiary</h4><div class="ddesc">Species discovered: <b>' + discovered + ' / ' + entries.length +
    '</b> &middot; Completion: <b>' + percent + '%</b> &middot; Recorded kills: <b>' + kills + '</b></div>' +
    '<div class="bestiary-progress"><span style="width:' + percent + '%"></span></div><div class="bestiary-list">';
  for (var bi = 0; bi < entries.length; bi++) {
    var entry = entries[bi], rec = game.bestiary[entry.key];
    if (!rec || !rec.seen) {
      html += '<div class="bestiary-entry locked"><div class="bestiary-name">Undiscovered</div><div class="bestiary-meta">Entry ' + (bi + 1) + '</div></div>';
      continue;
    }
    var hp = entry.hp === undefined ? rec.hp : entry.hp;
    var dmg = entry.dmg === undefined ? rec.dmg : entry.dmg;
    var defense = entry.def === undefined ? rec.def : entry.def;
    html += '<div class="bestiary-entry"><div class="bestiary-name">' + escapeText(entry.name) + '</div><div class="bestiary-meta">' + entry.kind +
      ' &middot; Kills ' + (rec.kills || 0) + '</div><div class="bestiary-stats">HP ' + (hp === undefined ? '?' : hp) + ' &middot; Damage ' +
      (dmg === undefined ? '?' : dmg) + ' &middot; Defense ' + (defense === undefined ? '?' : defense) + '</div></div>';
  }
  return html + '</div></div>';
}

var TOWN_SHOPS = {};
TOWN_SHOPS[E.MERCHANT] = [
  { item:I.TORCH, count:10, cost:1 }, { item:I.PLATFORM, count:20, cost:1 },
  { item:I.ARROW, count:25, cost:1 }, { item:I.HEALINGPOTION, count:1, cost:2 },
  { item:I.MANAPOTION, count:1, cost:2 }, { item:I.FISHINGROD_WOODEN, count:1, cost:2 },
  { item:I.WORM, count:5, cost:1 }, { item:I.MININGPOTION, count:1, cost:3, gate:'evil' },
  { item:I.PYLON_FOREST, count:1, cost:8, pylon:true }, { item:I.PINWHEEL, count:1, cost:1, gate:'windy' }
];
TOWN_SHOPS[E.ARMSDEALER] = [
  { item:I.MUSKETBALL, count:50, cost:1 }, { item:I.SILVERBULLET, count:50, cost:2, gate:'skeletron' },
  { item:I.SHOTGUN, count:1, cost:8, gate:'evil' }, { item:I.ILLEGALGUNPARTS, count:1, cost:8, gate:'hardmode' },
  { item:I.EXPLOSIVEBULLET, count:25, cost:3, gate:'hardmode' }
];
TOWN_SHOPS[E.DEMOLITIONIST] = [
  { item:I.GRENADE, count:10, cost:2 }, { item:I.EXPLOSIVEBULLET, count:25, cost:3, gate:'hardmode' }
];
TOWN_SHOPS[E.DRYAD] = [
  { item:I.DIRT, count:25, cost:1 }, { item:I.MUD, count:25, cost:1 }, { item:I.PUMPKIN, count:5, cost:1 }, { item:I.SUNFLOWER, count:1, cost:1 },
  { item:I.PURIFICATIONPOWDER, count:10, cost:2, gate:'anyBoss' },
  { item:I.PYLON_CORRUPT, count:1, cost:9, gate:'corruptWorld', pylon:true },
  { item:I.PYLON_CRIMSON, count:1, cost:9, gate:'crimsonWorld', pylon:true }
];
TOWN_SHOPS[E.MECHANIC] = [
  { item:I.TORCH, count:20, cost:1 }, { item:I.PLATFORM, count:25, cost:1 },
  { item:I.GLASS, count:20, cost:2 }, { item:I.CHEST, count:1, cost:3 }, { item:I.PYLON_SNOW, count:1, cost:8, pylon:true }
];
TOWN_SHOPS[E.WIZARD] = [
  { item:I.MANAPOTION, count:3, cost:2, gate:'hardmode' }, { item:I.GREATERMANAPOTION, count:3, cost:4, gate:'hardmode' },
  { item:I.MAGICPOWERPOTION, count:1, cost:4, gate:'hardmode' }, { item:I.SPELLTOME, count:1, cost:6, gate:'hardmode' },
  { item:I.HARP, count:1, cost:6, gate:'anyMech' }, { item:I.PYLON_HALLOW, count:1, cost:10, pylon:true }
];
TOWN_SHOPS[E.DYETRADER] = [
  { item:I.DYE_RED, count:1, cost:1 }, { item:I.DYE_ORANGE, count:1, cost:1 }, { item:I.DYE_YELLOW, count:1, cost:1 },
  { item:I.DYE_GREEN, count:1, cost:1 }, { item:I.DYE_CYAN, count:1, cost:1 }, { item:I.DYE_BLUE, count:1, cost:1 },
  { item:I.DYE_PURPLE, count:1, cost:1 }, { item:I.DYE_PINK, count:1, cost:1 }, { item:I.DYE_WHITE, count:1, cost:1 },
  { item:I.DYE_BLACK, count:1, cost:1 }, { item:I.DYE_BROWN, count:1, cost:1 }, { item:I.DYE_RAINBOW, count:1, cost:5, gate:'hardmode' },
  { item:I.PYLON_DESERT, count:1, cost:8, pylon:true }
];
TOWN_SHOPS[E.ANGLER] = [
  { item:I.WORM, count:5, cost:1 }, { item:I.NIGHTCRAWLER, count:5, cost:2, gate:'evil' },
  { item:I.FISHINGPOTION, count:1, cost:3 }, { item:I.FISHINGROD_IRON, count:1, cost:4 },
  { item:I.FISHINGROD_FIBERGLASS, count:1, cost:7, gate:'hardmode' }, { item:I.FISHINGROD_GOLDEN, count:1, cost:12, gate:'plantera' }
];
TOWN_SHOPS[E.ZOOLOGIST] = [
  { item:I.LEATHERWHIP, count:1, cost:4 }, { item:I.PUPPY, count:1, cost:5 },
  { item:I.CATLICENSE, count:1, cost:6, gate:'bestiary:30' },
  { item:I.RABBITPERCH, count:1, cost:6, gate:'bestiary:40' },
  { item:I.BABYDINO, count:1, cost:7, gate:'evil' },
  { item:I.ZEPHYRFISH, count:1, cost:8, gate:'bestiary:50' },
  { item:I.UNICORNMOUNT, count:1, cost:12, gate:'hardmode' },
  { item:I.LIGHTNINGCARROT, count:1, cost:15, gate:'bestiary:90' }
];
TOWN_SHOPS[E.PAINTER] = [
  { item:I.WOODWALL, count:25, cost:1 }, { item:I.GLASS, count:20, cost:2 }, { item:I.CHAIR, count:1, cost:2 },
  { item:I.TABLE, count:1, cost:2 }, { item:I.CHEST, count:1, cost:3 }
];
TOWN_SHOPS[E.GOLFER] = [
  { item:I.SWIFTNESSPOTION, count:1, cost:2 }, { item:I.WATERWALKINGPOTION, count:1, cost:3 },
  { item:I.FROGLEG, count:1, cost:7, gate:'hardmode' }
];
TOWN_SHOPS[E.PIRATE] = [
  { item:I.COIN, count:50, cost:2 }, { item:I.PIRATEMAP, count:1, cost:8, gate:'hardmode' },
  { item:I.PYLON_OCEAN, count:1, cost:9, pylon:true }
];
TOWN_SHOPS[E.WITCHDOCTOR] = [
  { item:I.LEATHERWHIP, count:1, cost:4 }, { item:I.MAGICLANTERN, count:1, cost:6 },
  { item:I.PYGMYNECKLACE, count:1, cost:8, gate:'plantera' }, { item:I.HERCULESBEETLE, count:1, cost:10, gate:'plantera' },
  { item:I.LEAFWINGS, count:1, cost:12, gate:'hardmode' }, { item:I.PYLON_JUNGLE, count:1, cost:9, pylon:true }
];
TOWN_SHOPS[E.PARTYGIRL] = [
  { item:I.PARTYCENTER, count:1, cost:20 }, { item:I.PARTYHAT, count:1, cost:1 },
  { item:I.PARTYPRESENT, count:1, cost:2, gate:'party' }, { item:I.PIGRONATA, count:1, cost:3, gate:'party' },
  { item:I.PARTYSTREAMER, count:10, cost:1, gate:'party' }, { item:I.SILLYBALLOON, count:3, cost:1, gate:'party' },
  { item:I.RELEASELANTERN, count:10, cost:1, gate:'lanternnight' },
  { item:I.PUMPKINMEDALLION, count:1, cost:10, gate:'plantera' }
];
TOWN_SHOPS[E.STYLIST] = [
  { item:I.DYE_PINK, count:1, cost:1 }, { item:I.DYE_BLACK, count:1, cost:1 }, { item:I.SILK, count:10, cost:2 },
  { item:I.DYE_RAINBOW, count:1, cost:5, gate:'hardmode' }
];
TOWN_SHOPS[E.CLOTHIER] = [
  { item:I.SILK, count:10, cost:2 }, { item:I.LEATHER, count:5, cost:2 }, { item:I.BONE, count:25, cost:3 },
  { item:I.SPOOKYWOOD, count:20, cost:4, gate:'pumpkinmoon' }, { item:I.SILLYBALLOON, count:5, cost:2, gate:'party' }
];
TOWN_SHOPS[E.STEAMPUNKER] = [
  { item:I.PURIFICATIONPOWDER, count:25, cost:3 }, { item:I.MININGPOTION, count:1, cost:3 },
  { item:I.HOVERBOARD, count:1, cost:14, gate:'plantera' }
];
TOWN_SHOPS[E.CYBORG] = [
  { item:I.ROCKET1, count:25, cost:2 }, { item:I.ROCKET2, count:25, cost:3 },
  { item:I.ROCKET3, count:25, cost:4, gate:'plantera' }, { item:I.ROCKET4, count:25, cost:6, gate:'golem' },
  { item:I.PROXIMITYMINELAUNCHER, count:1, cost:16, gate:'plantera' }
];
TOWN_SHOPS[E.TRUFFLE] = [
  { item:I.MUSHROOM, count:25, cost:2 }, { item:I.TRUFFLEWORM, count:1, cost:8, gate:'plantera' },
  { item:I.MUSHROOMSPEAR, count:1, cost:12, gate:'plantera' }
];
TOWN_SHOPS[E.SANTA] = [
  { item:I.SNOW, count:25, cost:1 }, { item:I.ICE, count:25, cost:1 }, { item:I.SNOWGLOBE, count:1, cost:6 },
  { item:I.NAUGHTYPRESENT, count:1, cost:10, gate:'plantera' }
];
TOWN_SHOPS[E.PRINCESS] = [
  { item:I.GOLDENAPPLE, count:1, cost:5 }, { item:I.GREATERHEALINGPOTION, count:3, cost:4 },
  { item:I.DYE_RAINBOW, count:1, cost:4 }, { item:I.PYLON_UNIVERSAL, count:1, cost:20, gate:'victory', pylon:true }
];

var TOWN_PREFERENCES = {};
TOWN_PREFERENCES[E.MERCHANT] = { biome:BIOME.FOREST, like:E.NURSE, dislike:E.TAXCOLLECTOR };
TOWN_PREFERENCES[E.NURSE] = { biome:BIOME.HALLOW, like:E.ARMSDEALER, dislike:E.DRYAD };
TOWN_PREFERENCES[E.ARMSDEALER] = { biome:BIOME.DESERT, like:E.NURSE, dislike:E.DEMOLITIONIST };
TOWN_PREFERENCES[E.DEMOLITIONIST] = { biome:BIOME.UNDERGROUND, like:E.TAVERNKEEP, dislike:E.ARMSDEALER };
TOWN_PREFERENCES[E.DRYAD] = { biome:BIOME.JUNGLE, biomes:[BIOME.JUNGLE, BIOME.CORRUPT, BIOME.CRIMSON], like:E.WITCHDOCTOR, dislike:E.PIRATE };
TOWN_PREFERENCES[E.GOBLINTINKERER] = { biome:BIOME.UNDERGROUND, like:E.MECHANIC, dislike:E.CLOTHIER };
TOWN_PREFERENCES[E.MECHANIC] = { biome:BIOME.SNOW, like:E.GOBLINTINKERER, dislike:E.ARMSDEALER };
TOWN_PREFERENCES[E.WIZARD] = { biome:BIOME.HALLOW, like:E.GOLFER, dislike:E.WITCHDOCTOR };
TOWN_PREFERENCES[E.DYETRADER] = { biome:BIOME.DESERT, like:E.STYLIST, dislike:E.PIRATE };
TOWN_PREFERENCES[E.ANGLER] = { biome:BIOME.OCEAN, like:E.PARTYGIRL, dislike:E.TAVERNKEEP };
TOWN_PREFERENCES[E.ZOOLOGIST] = { biome:BIOME.FOREST, like:E.WITCHDOCTOR, dislike:E.ANGLER };
TOWN_PREFERENCES[E.PAINTER] = { biome:BIOME.JUNGLE, like:E.DRYAD, dislike:E.CYBORG };
TOWN_PREFERENCES[E.GOLFER] = { biome:BIOME.FOREST, like:E.ANGLER, dislike:E.PIRATE };
TOWN_PREFERENCES[E.PIRATE] = { biome:BIOME.OCEAN, like:E.ANGLER, dislike:E.STYLIST };
TOWN_PREFERENCES[E.WITCHDOCTOR] = { biome:BIOME.JUNGLE, like:E.DRYAD, dislike:E.WIZARD };
TOWN_PREFERENCES[E.PARTYGIRL] = { biome:BIOME.HALLOW, like:E.WIZARD, dislike:E.TAXCOLLECTOR };
TOWN_PREFERENCES[E.STYLIST] = { biome:BIOME.OCEAN, like:E.DYETRADER, dislike:E.GOBLINTINKERER };
TOWN_PREFERENCES[E.CLOTHIER] = { biome:BIOME.UNDERGROUND, like:E.TAXCOLLECTOR, dislike:E.NURSE };
TOWN_PREFERENCES[E.TAXCOLLECTOR] = { biome:BIOME.SNOW, like:E.MERCHANT, dislike:E.PARTYGIRL };
TOWN_PREFERENCES[E.TAVERNKEEP] = { biome:BIOME.HALLOW, like:E.DEMOLITIONIST, dislike:E.ANGLER };
TOWN_PREFERENCES[E.STEAMPUNKER] = { biome:BIOME.DESERT, like:E.CYBORG, dislike:E.DRYAD };
TOWN_PREFERENCES[E.CYBORG] = { biome:BIOME.SNOW, like:E.STEAMPUNKER, dislike:E.ZOOLOGIST };
TOWN_PREFERENCES[E.TRUFFLE] = { biome:BIOME.MUSHROOM, like:E.DRYAD, dislike:E.CLOTHIER };
TOWN_PREFERENCES[E.SANTA] = { biome:BIOME.SNOW, like:E.TAXCOLLECTOR, dislike:E.PIRATE };
TOWN_PREFERENCES[E.PRINCESS] = { biome:BIOME.HALLOW, like:E.MERCHANT, dislike:-1 };

function townHappiness(type) {
  var home = game.housing[type], pref = TOWN_PREFERENCES[type];
  if (!home || !pref) return { multiplier:1.1, label:'Unhoused', biome:-1, neighbors:0 };
  var biome = game.world.biomeAt(home.homeX, home.homeY);
  var preferredBiome = pref.biomes ? pref.biomes.indexOf(biome) >= 0 : biome === pref.biome;
  var multiplier = preferredBiome ? 0.88 : 1;
  var neighbors = 0, liked = false, disliked = false;
  for (var other in game.housing) {
    if (+other === +type || !game.townArrivals[other]) continue;
    var otherHome = game.housing[other];
    if (dist(home.homeX, home.homeY, otherHome.homeX, otherHome.homeY) > 25 * TILE) continue;
    neighbors++;
    if (+other === pref.like) liked = true;
    if (+other === pref.dislike) disliked = true;
  }
  if (!neighbors) multiplier += 0.05;
  if (neighbors > 3) multiplier += (neighbors - 3) * 0.06;
  if (liked) multiplier -= 0.08;
  if (disliked) multiplier += 0.08;
  multiplier = clamp(multiplier, 0.75, 1.5);
  var label = multiplier <= 0.85 ? 'Delighted' : multiplier <= 0.95 ? 'Happy' : multiplier <= 1.05 ? 'Content' : multiplier <= 1.2 ? 'Unhappy' : 'Miserable';
  return { multiplier:multiplier, label:label, biome:biome, neighbors:neighbors };
}

function townPrice(row, type) {
  return Math.max(1, Math.ceil(row.cost * townHappiness(type).multiplier));
}

function townBiomeLabel(biome) {
  var names = {};
  names[BIOME.FOREST] = 'Forest'; names[BIOME.DESERT] = 'Desert'; names[BIOME.SNOW] = 'Snow';
  names[BIOME.JUNGLE] = 'Jungle'; names[BIOME.HALLOW] = 'Hallow'; names[BIOME.CORRUPT] = 'Corruption';
  names[BIOME.CRIMSON] = 'Crimson'; names[BIOME.OCEAN] = 'Ocean'; names[BIOME.MUSHROOM] = 'Mushroom';
  names[BIOME.UNDERGROUND] = 'Underground';
  return names[biome] || 'another biome';
}

var REFORGE_PREFIXES = [
  { name:'Broken', dmgMul:0.9 }, { name:'Dull', dmgMul:0.95 }, { name:'Keen', dmgMul:1.05 },
  { name:'Superior', dmgMul:1.1 }, { name:'Legendary', dmgMul:1.15 }
];

function townNpcSupported(type) {
  return !!TOWN_SHOPS[type] || type === E.NURSE || type === E.GOBLINTINKERER || type === E.TAXCOLLECTOR;
}

function townNpcAtCursor() {
  for (var i = 0; i < game.entities.length; i++) {
    var e = game.entities[i];
    if (!e.dead && !e.rescue && townNpcSupported(e.type) && dist(game.player.x, game.player.y, e.x, e.y) < 90 && dist(MOUSE.wx, MOUSE.wy, e.x, e.y) < 48) return e;
  }
  return null;
}

function tryOpenTownNpc() {
  var npc = townNpcAtCursor();
  if (!npc) return false;
  if (npc.type === E.PARTYGIRL && game.party.active && game.party.natural && !game.party.cakeClaimed && game.player.inventory.canAdd(I.SLICEOFCAKE, 1)) {
    game.player.inventory.add(I.SLICEOFCAKE, 1);
    game.party.cakeClaimed = true;
    game.message('The Party Girl gave you a Slice of Cake!');
    AudioSys.play('pickup');
  }
  game.townNpcOpen = { type:npc.type, name:npc.name };
  if (npc.type === E.DRYAD) game.townNpcOpen.status = dryadWorldStatus();
  openPanel(); switchPanel('town'); renderTownPanel();
  return true;
}

function townGateAvailable(gate) {
  if (!gate) return true;
  if (gate === 'hardmode') return game.hardmode;
  if (gate === 'skeletron') return !!game.bossesDefeated.skeletron;
  if (gate === 'evil') return !!(game.bossesDefeated.eaterofworlds || game.bossesDefeated.brainofcthulhu);
  if (gate === 'anyBoss') return anyBossDefeated();
  if (gate === 'anyMech') return anyMechanicalBossDefeated();
  if (gate === 'mechs') return game.mechDone;
  if (gate === 'plantera') return !!game.bossesDefeated.plantera;
  if (gate === 'golem') return !!game.bossesDefeated.golem;
  if (gate === 'pumpkinmoon') return !!game.eventCompletions.pumpkinmoon;
  if (gate === 'corruptWorld') return game.world.evil === 'corrupt';
  if (gate === 'crimsonWorld') return game.world.evil === 'crimson';
  if (gate === 'victory') return !!game.victory;
  if (gate === 'windy') return isWindyDayAt(game, game.player.x, game.player.y);
  if (gate === 'party') return !!game.party.active;
  if (gate === 'lanternnight') return !!game.lanternNight.active;
  if (typeof gate === 'string' && gate.indexOf('bestiary:') === 0) {
    var req = parseInt(gate.substring(9), 10);
    if (!isNaN(req)) return bestiaryCompletionPercent() >= req;
  }
  return false;
}

function townStockAvailable(row, type) {
  if (!townGateAvailable(row.gate)) return false;
  if (!row.pylon) return true;
  var item = ITEMS[row.item], mood = townHappiness(type);
  if (!item || mood.multiplier > 0.95 || mood.biome < 0) return false;
  return item.pylonBiome === 'any' || item.pylonBiome === mood.biome;
}

function dryadWorldStatus() {
  var tiles = game.world.tiles, evil = 0, hallow = 0, natural = 0;
  for (var i = 0; i < tiles.length; i++) {
    var tile = tiles[i];
    if (tile === T.EBONSTONE || tile === T.CRIMSTONE || tile === T.CORRUPTGRASS || tile === T.CRIMGRASS) evil++;
    else if (tile === T.PEARLSTONE || tile === T.HALLOWGRASS) hallow++;
    else if (tile === T.STONE || tile === T.DIRT || tile === T.GRASS) natural++;
  }
  var total = evil + hallow + natural || 1;
  return { evil:Math.round(evil / total * 1000) / 10, hallow:Math.round(hallow / total * 1000) / 10, purity:Math.round(natural / total * 1000) / 10 };
}

function townServiceNpcActive(type) {
  for (var i = 0; i < game.entities.length; i++) {
    var e = game.entities[i];
    if (!e.dead && e.type === type && dist(game.player.x, game.player.y, e.x, e.y) < 110) return true;
  }
  return false;
}

var ANGLER_QUESTS = [
  { item:I.FISH_BASS, place:'Forest lakes' }, { item:I.FISH_TROUT, place:'Forest lakes' },
  { item:I.FISH_SALMON, place:'surface waters' }, { item:I.FISH_EBONKOI, place:'the world evil' },
  { item:I.FISH_CRIMSONTIGER, place:'the Jungle' }, { item:I.FISH_CAVEFISH, place:'underground waters' },
  { item:I.FISH_FLOUNDER, place:'the Ocean' }, { item:I.FISH_ROCKFISH, place:'the Ocean floor' },
  { item:I.FISH_PUFFER, place:'the Ocean' }
];

function currentAnglerQuest() {
  var count = ANGLER_QUESTS.length + (game.hardmode ? 1 : 0);
  var index = ((game.world.seed >>> 0) + game.dayCount * 7) >>> 0;
  if (index % count === ANGLER_QUESTS.length) return { item:I.FISH_NEONTETRA, place:'the Hallow' };
  return ANGLER_QUESTS[index % count];
}

function anglerQuestRewards(completion) {
  var crate = completion % 10 === 0 ? I.GOLDENCRATE : (completion % 5 === 0 ? I.IRONCRATE : I.WOODENCRATE);
  var rewards = [
    { id:I.GOLD, count:2 + Math.min(3, Math.floor(completion / 5)) },
    { id:I.NIGHTCRAWLER, count:3 },
    { id:crate, count:1 }
  ];
  if (completion % 3 === 0) rewards.push({ id:I.FISHINGPOTION, count:1 });
  if (completion === 5) rewards.push({ id:I.FISHERMANSPOCKETGUIDE, count:1 });
  if (completion === 10) rewards.push({ id:I.WEATHERRADIO, count:1 });
  if (completion === 15) rewards.push({ id:I.SEXTANT, count:1 });
  if (completion === 20) rewards.push({ id:I.ANGLEREARRING, count:1 });
  if (completion === 25) rewards.push({ id:I.HOTLINEFISHINGHOOK, count:1 });
  if (completion === 30) rewards.push({ id:I.TACKLEBOX, count:1 });
  return rewards;
}

function inventoryCanReceiveAll(inv, rewards) {
  var test = new Inventory();
  test.slots = new Array(50);
  for (var i = 0; i < 50; i++) test.slots[i] = inv.slots[i] ? copyItemStack(inv.slots[i]) : null;
  for (var r = 0; r < rewards.length; r++) if (test.add(rewards[r].id, rewards[r].count) !== rewards[r].count) return false;
  return true;
}

function anglerQuestHTML() {
  var quest = currentAnglerQuest(), done = game.anglerQuestCompletedDay === game.dayCount;
  var have = game.player.inventory.countOf(quest.item), item = ITEMS[quest.item];
  return '<div class="town-service"><h4>Daily Fishing Quest</h4>' +
    (done ? '<div class="ddesc">Quest complete. Come back after the next dawn.</div>' :
      '<div class="ddesc">Catch a <b>' + item.name + '</b> in ' + quest.place + '.</div><div class="shop-cost">In inventory: ' + have + '</div>' +
      '<button class="tavern-buy" data-angler-quest="1"' + (have ? '' : ' disabled') + '>Turn In ' + item.name + '</button>') +
    '<div class="ddesc">Quests completed: ' + game.anglerQuestsCompleted + '</div></div>';
}

function stylistHairHTML() {
  return '<div class="town-service"><h4>Hairstyling</h4><div class="ddesc">The Stylist can restyle your hair for free.</div>' +
    '<div class="ddesc">Current style: ' + (game.player.hair + 1) + '</div>' +
    '<button class="tavern-buy" data-town-hair="1">Change Hairstyle</button></div>';
}

function stylistHair() {
  if (!game.townNpcOpen || game.townNpcOpen.type !== E.STYLIST || !townServiceNpcActive(E.STYLIST)) return;
  game.player.hair = (game.player.hair + 1) % 9;
  game.message('The Stylist gave you a fresh new look!');
  AudioSys.play('pickup');
}

var STRANGE_DYE_REWARDS = [I.DYE_ACID, I.DYE_BLUEACID, I.DYE_REDACID, I.DYE_GLOWINGMUSHROOM];

function dyeTraderStrangePlantHTML() {
  var have = game.player.inventory.countOf(I.STRANGEPLANT);
  var html = '<div class="town-service"><h4>Strange Plant Exchange</h4>';
  if (!game.hardmode) {
    html += '<div class="ddesc">Strange Plants begin blooming across the surface in Hardmode.</div>';
  } else {
    html += '<div class="ddesc">Trade one Strange Plant for six rare dyes of one kind.</div><div class="shop-cost">Strange Plants: ' + have + '</div>' +
      '<button class="tavern-buy" data-town-strange="1"' + (have ? '' : ' disabled') + '>Exchange Plant</button>';
  }
  return html + '</div>';
}

function exchangeStrangePlant() {
  if (!game.townNpcOpen || game.townNpcOpen.type !== E.DYETRADER || !townServiceNpcActive(E.DYETRADER)) return false;
  if (!game.hardmode) { game.message('Strange Plants begin blooming in Hardmode.'); return false; }
  var inv = game.player.inventory;
  if (inv.countOf(I.STRANGEPLANT) < 1) { game.message('Bring the Dye Trader a Strange Plant.'); return false; }
  var reward = STRANGE_DYE_REWARDS[Math.floor(Math.random() * STRANGE_DYE_REWARDS.length)];
  var test = new Inventory();
  test.slots = new Array(50);
  for (var i = 0; i < 50; i++) test.slots[i] = inv.slots[i] ? copyItemStack(inv.slots[i]) : null;
  test.consume(I.STRANGEPLANT, 1);
  if (test.add(reward, 6) !== 6) { game.message('Make room for the rare dyes.'); return false; }
  inv.consume(I.STRANGEPLANT, 1);
  inv.add(reward, 6);
  game.message('The Dye Trader mixed six ' + ITEMS[reward].name + '!');
  AudioSys.play('craft');
  return true;
}

function golferGolfHTML() {
  var g = game.golf;
  var html = '<div class="town-service"><h4>Golf Challenge</h4><div class="ddesc">Play a round on the driving range. Click each golf ball to hole it before time runs out.</div>';
  if (g.active) {
    html += '<div class="ddesc"><b>Round in progress</b> &mdash; finish it before starting another.</div>';
  } else {
    html += '<div class="shop-cost">Best score: ' + g.best + ' &middot; Rounds played: ' + g.completed + '</div>';
    html += '<button class="tavern-buy" data-town-golf="1">Start Golf Challenge</button>';
  }
  html += '</div>';
  return html;
}

function golferStartGolf() {
  if (!game.townNpcOpen || game.townNpcOpen.type !== E.GOLFER || !townServiceNpcActive(E.GOLFER)) return;
  var g = game.golf;
  if (g.active) { game.message('You are already mid-round!'); return; }
  g.active = true;
  g.time = 30;
  g.whacks = 0;
  g.balls = [];
  g.spawnT = 0.4;
  if (game.panelOpen) closePanel();
  game.message('Golf challenge started! Click the golf balls to hole them. Hole 15 for par.');
  AudioSys.play('pickup');
}

function updateGolf(dt) {
  var g = game.golf;
  if (!g || !g.active) return;
  if (game.panelOpen) { g.spawnT = 0; return; }
  g.time -= dt;

  // spawn balls at a clear flat yard near the player
  g.spawnT -= dt;
  if (g.spawnT <= 0 && g.balls.length < 6) {
    g.spawnT = 1.1;
    var baseX = Math.floor(game.player.x / TILE), idx = 0;
    for (var k = 0; k < 5; k++) {
      var tx = baseX + (idx % 2 === 0 ? -(idx / 2 + 1) : (idx / 2 + 2));
      idx++;
      var ty = Math.floor((game.player.y + game.player.h) / TILE);
      var found = -1;
      for (var yy = ty; yy < ty + 8; yy++) {
        var under = game.world.get(tx, yy);
        if (game.world.isSolidTile(under) && under !== T.PLATFORM) { found = yy; break; }
      }
      if (found > 0) {
        g.balls.push({
          x: tx * TILE + 8, y: (found - 1) * TILE + 8, seed: Math.random() * 100,
          driftX: (Math.random() - 0.5) * 6, vx: (Math.random() - 0.5) * 20,
          t: 0
        });
        break;
      }
    }
  }

  // click-to-hole detection
  if (MOUSE.down) {
    for (var i = g.balls.length - 1; i >= 0; i--) {
      var b = g.balls[i];
      var dx = MOUSE.wx - b.x, dy = MOUSE.wy - b.y;
      if (dx * dx + dy * dy < 24 * 24) {
        g.balls.splice(i, 1);
        g.whacks++;
        game.spawnMinePuff(b.x, b.y - 4, '#ffffff');
        game.fx.push({ type:'slash', x:b.x, y:b.y, t:0.2 });
        game.spawnFloatingText(b.x, b.y - 14, '+1', '#e8e8e8');
        AudioSys.play('shoot');
      }
    }
  }

  if (g.time <= 0) { endGolfRound(); }
}

function endGolfRound() {
  var g = game.golf;
  g.active = false;
  g.balls = [];
  var score = g.whacks;
  g.completed++;
  if (score > g.best) g.best = score;
  Achievements.unlock('golfchallenge', game);
  var gold = 3 + Math.floor(score / 3);
  var inv = game.player.inventory;
  var granted = 0;
  if (inv.canAdd(I.GOLD, gold)) { inv.add(I.GOLD, gold); granted = gold; }
  var msg = 'Golf round over! You holed ' + score + ' ball' + (score === 1 ? '' : 's') + '.';
  if (score >= 15) {
    Achievements.unlock('golfpar', game);
    game.message(msg + ' Under par! ' + (granted ? 'Reward: ' + granted + ' Gold Ore.' : 'Your inventory is full.') );
  } else if (granted) {
    game.message(msg + ' Reward: ' + granted + ' Gold Ore.');
  } else {
    game.message(msg);
  }
  AudioSys.play('craft');
}

function turnInAnglerQuest() {  if (!game.townNpcOpen || game.townNpcOpen.type !== E.ANGLER || !townServiceNpcActive(E.ANGLER)) return false;
  if (game.anglerQuestCompletedDay === game.dayCount) { game.message('The Angler has no more work today.'); return false; }
  var quest = currentAnglerQuest(), inv = game.player.inventory;
  if (inv.countOf(quest.item) < 1) { game.message('You have not caught the requested fish.'); return false; }
  var completion = game.anglerQuestsCompleted + 1, rewards = anglerQuestRewards(completion);
  if (!inventoryCanReceiveAll(inv, rewards)) { game.message('Make room for the Angler rewards.'); return false; }
  inv.consume(quest.item, 1);
  for (var i = 0; i < rewards.length; i++) inv.add(rewards[i].id, rewards[i].count);
  game.anglerQuestsCompleted = completion;
  game.anglerQuestCompletedDay = game.dayCount;
  Achievements.unlock('anglerquest', game);
  game.message('Fishing quest complete! The Angler handed over your reward.');
  AudioSys.play('craft');
  return true;
}

function renderTownPanel() {
  var root = $('panel-town'), open = game.townNpcOpen;
  if (!root || !open) { if (root) root.innerHTML = ''; return; }
  var inv = game.player.inventory;
  var mood = townHappiness(open.type);
  var html = '<h3>' + open.name + '</h3><div class="ddesc">Gold Ore: ' + inv.countOf(I.GOLD) + '</div>' +
    '<div class="ddesc">Mood: ' + mood.label + (mood.biome >= 0 ? ' in the ' + townBiomeLabel(mood.biome) : '') +
    ' &middot; Prices ' + Math.round(mood.multiplier * 100) + '%</div>';
  if (game.party.active) html += '<div class="ddesc">' + (open.type === E.PARTYGIRL ? 'I put the party in Party Girl!' : 'Confetti makes everything better!') + '</div>';
  else if (game.lanternNight.active) html += '<div class="ddesc">' + (open.type === E.GUIDE ? 'Tonight honors every victory that brought us here.' : 'The lanterns make the whole town glow.') + '</div>';
  var stock = TOWN_SHOPS[open.type];
  if (stock) {
    html += '<div class="tavern-shop">';
    for (var i = 0; i < stock.length; i++) {
      var row = stock[i];
      if (!townStockAvailable(row, open.type)) continue;
      var it = ITEMS[row.item];
      if (!it) continue;
      html += '<div class="tavern-item"><div class="picon">' + itemIconHTML(it) + '</div><div class="shop-info"><div class="shop-name">' + it.name +
        (row.count > 1 ? ' x' + row.count : '') + '</div><div class="shop-cost">' + townPrice(row, open.type) + ' Gold Ore</div></div><button class="tavern-buy" data-town-buy="' + i + '">Buy</button></div>';
    }
    html += '</div>';
    if (open.type === E.DRYAD && open.status) html += '<div class="town-service"><h4>World Status</h4><div class="ddesc">' +
      (game.world.evil === 'crimson' ? 'Crimson' : 'Corruption') + ': ' + open.status.evil + '% &middot; Hallow: ' + open.status.hallow + '% &middot; Purity: ' + open.status.purity + '%</div></div>';
    if (open.type === E.ANGLER) html += anglerQuestHTML();
    if (open.type === E.STYLIST) html += stylistHairHTML();
    if (open.type === E.DYETRADER) html += dyeTraderStrangePlantHTML();
    if (open.type === E.ZOOLOGIST) html += bestiaryHTML();
    if (open.type === E.GOLFER) html += golferGolfHTML();
    root.innerHTML = html; return;
  }
  if (open.type === E.TAXCOLLECTOR) {
    html += '<div class="town-service"><h4>Town Taxes</h4><div class="ddesc">A housed Tax Collector gathers Gold Ore from housed residents once per minute.</div>' +
      '<div class="shop-cost">Savings: ' + game.taxSavings + ' Gold Ore</div><button class="tavern-buy" data-town-tax="1"' +
      (game.taxSavings ? '' : ' disabled') + '>Collect</button></div>';
    root.innerHTML = html; return;
  }
  if (open.type === E.NURSE) {
    var missing = Math.max(0, game.player.maxHp - game.player.hp);
    var healCost = Math.max(1, Math.ceil(missing / 50));
    html += '<div class="town-service"><h4>Medical Treatment</h4><div class="ddesc">Missing health: ' + missing + '</div>' +
      (missing ? '<div class="shop-cost">Full treatment: ' + healCost + ' Gold Ore</div><button class="tavern-buy" data-town-heal="1">Heal</button>' : '<div class="ddesc">You are already at full health.</div>') + '</div>';
    root.innerHTML = html; return;
  }
  if (open.type === E.GOBLINTINKERER) {
    html += '<div class="town-service"><h4>Reforge</h4><div class="ddesc">Choose an unstackable weapon, then replace its prefix.</div><div class="town-reforge-list">';
    for (var s = 0; s < inv.slots.length; s++) {
      var stack = inv.slots[s];
      if (!townReforgeEligible(stack)) continue;
      html += '<button class="tavern-buy" data-town-slot="' + s + '">' + (stack.reforge ? stack.reforge.name + ' ' : '') + ITEMS[stack.id].name + '</button> ';
    }
    var selected = inv.selectedItem();
    html += '</div>';
    if (townReforgeEligible(selected)) {
      var selectedDef = ITEMS[selected.id], cost = townReforgeCost(selectedDef);
      html += '<div class="town-reforge">Selected: ' + (selected.reforge ? selected.reforge.name + ' ' : '') + selectedDef.name + '</div><div class="shop-cost">Reforge cost: ' + cost +
        ' Gold Ore</div><button class="tavern-buy" data-town-reforge="1">Reforge</button>';
    }
    root.innerHTML = html + '</div>';
  }
}

function buyTownItem(index) {
  var open = game.townNpcOpen, stock = open && TOWN_SHOPS[open.type], row = stock && stock[index];
  if (!row || !ITEMS[row.item] || !townStockAvailable(row, open.type) || !townServiceNpcActive(open.type)) return;
  var inv = game.player.inventory;
  var cost = townPrice(row, open.type);
  if (inv.countOf(I.GOLD) < cost) { game.message('Not enough Gold Ore.'); return; }
  if (!inv.canAdd(row.item, row.count)) { game.message('Your inventory is full.'); return; }
  inv.add(row.item, row.count); inv.consume(I.GOLD, cost);
  game.message('Purchased ' + ITEMS[row.item].name + (row.count > 1 ? ' x' + row.count : '') + '.'); AudioSys.play('pickup');
}

function nurseHeal() {
  if (!game.townNpcOpen || game.townNpcOpen.type !== E.NURSE || !townServiceNpcActive(E.NURSE)) return;
  var p = game.player, missing = Math.max(0, p.maxHp - p.hp);
  if (!missing) { game.message('You are already at full health.'); return; }
  var cost = Math.max(1, Math.ceil(missing / 50));
  if (p.inventory.countOf(I.GOLD) < cost) { game.message('Not enough Gold Ore for treatment.'); return; }
  p.inventory.consume(I.GOLD, cost); p.hp = p.maxHp;
  game.fx.push({ type:'cast', x:p.x, y:p.y - 10, t:0.4, max:0.4 }); game.message('The Nurse restored you to full health.'); AudioSys.play('pickup');
}

function collectTownTax() {
  if (!game.townNpcOpen || game.townNpcOpen.type !== E.TAXCOLLECTOR || !townServiceNpcActive(E.TAXCOLLECTOR) || !game.taxSavings) return;
  var amount = game.taxSavings;
  if (!game.player.inventory.canAdd(I.GOLD, amount)) { game.message('Your inventory is full.'); return; }
  game.player.inventory.add(I.GOLD, amount);
  game.taxSavings = 0;
  game.message('Collected ' + amount + ' Gold Ore in taxes.');
  AudioSys.play('pickup');
}

function townReforgeEligible(stack) {
  if (!stack || stack.count !== 1 || !ITEMS[stack.id] || ITEMS[stack.id].maxStack !== 1) return false;
  var type = ITEMS[stack.id].type;
  return type === 'melee' || type === 'ranged' || type === 'magic' || type === 'whip';
}

function townReforgeCost(def) { return Math.max(1, Math.ceil((def.dmg || 10) / 10)); }

function sanitizeReforge(reforge) {
  if (!reforge || !isFinite(reforge.dmgMul)) return null;
  for (var i = 0; i < REFORGE_PREFIXES.length; i++) {
    var prefix = REFORGE_PREFIXES[i];
    if (reforge.name === prefix.name && reforge.dmgMul === prefix.dmgMul) return { name:prefix.name, dmgMul:prefix.dmgMul };
  }
  return null;
}

function reforgeSelectedItem() {
  if (!game.townNpcOpen || game.townNpcOpen.type !== E.GOBLINTINKERER || !townServiceNpcActive(E.GOBLINTINKERER)) return;
  var inv = game.player.inventory, stack = inv.selectedItem();
  if (!townReforgeEligible(stack)) { game.message('Select an unstackable weapon to reforge.'); return; }
  var cost = townReforgeCost(ITEMS[stack.id]);
  if (inv.countOf(I.GOLD) < cost) { game.message('Not enough Gold Ore to reforge.'); return; }
  inv.consume(I.GOLD, cost);
  var choices = [];
  for (var i = 0; i < REFORGE_PREFIXES.length; i++) if (!stack.reforge || REFORGE_PREFIXES[i].name !== stack.reforge.name) choices.push(REFORGE_PREFIXES[i]);
  var prefix = choices[Math.floor(Math.random() * choices.length)];
  stack.reforge = { name:prefix.name, dmgMul:prefix.dmgMul };
  game.message(prefix.name + ' ' + ITEMS[stack.id].name + '!'); AudioSys.play('craft');
}

function dropSelected() {
  if (game.panelOpen || game.player.dying) return;
  var inv = game.player.inventory;
  var s = inv.selectedItem();
  if (!s) return;
  var id = s.id, reforge = s.reforge;
  inv.removeAt(inv.selected, 1);
  game.addPickup(game.player.x + game.player.dir * 16, game.player.y - 10, id, 1, reforge);
  AudioSys.play('place');
}

// ---------- Panel ----------
function openPanel() {
  if (!game.started || game.paused || game.player.dying) return;
  game.panelOpen = true;
  $('panel').classList.remove('hidden');
  switchPanel(game.panelTab);
  renderPanel(game.panelTab);
}

function closePanel() {
  game.panelOpen = false;
  $('panel').classList.add('hidden');
  if (game.chestOpen) {
    game.chestOpen = false;
    game.chest = null;
  }
  if (game.pylonOpen) {
    game.pylonOpen = false;
    game.activePylon = null;
  }
  game.tavernkeepOpen = false;
  game.townNpcOpen = null;
  if (game.panelTab === 'town' || game.panelTab === 'tavernkeep' || game.panelTab === 'chest' || game.panelTab === 'pylon') game.panelTab = 'inventory';
}

function togglePanel() {
  if (!game.started || game.paused) return;
  if (game.panelOpen) closePanel();
  else openPanel();
}

function openGuide() {
  if (!game.started || game.paused || game.player.dying) return;
  openPanel();
  switchPanel('guide');
  renderGuide();
}

function guideAtCursor() {
  for (var i = 0; i < game.entities.length; i++) {
    var e = game.entities[i];
    if (!e.dead && e.type === E.GUIDE && dist(game.player.x, game.player.y, e.x, e.y) < 90 && dist(MOUSE.wx, MOUSE.wy, e.x, e.y) < 48) return e;
  }
  return null;
}

function tryOpenGuideNpc() {
  if (!guideAtCursor()) return false;
  openGuide();
  return true;
}

function switchPanel(name) {
  game.panelTab = name;
  var tabs = document.querySelectorAll('#panel-tabs .tab');
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].className = 'tab' + (tabs[i].getAttribute('data-panel') === name ? ' active' : '');
  }
  var pages = ['inventory', 'crafting', 'guide', 'housing', 'achievements', 'chest', 'pylon', 'tavernkeep', 'town'];
  for (var p = 0; p < pages.length; p++) {
    if (pages[p] === name) $('panel-' + pages[p]).classList.remove('hidden');
    else $('panel-' + pages[p]).classList.add('hidden');
  }
}

function renderPanel(name) {
  if (name === 'inventory') renderInventory();
  else if (name === 'crafting') renderCrafting();
  else if (name === 'guide') renderGuide();
  else if (name === 'achievements') renderAchievements();
  else if (name === 'housing') renderHousingPanel();
  else if (name === 'chest') renderChest();
  else if (name === 'pylon') renderPylon();
  else if (name === 'tavernkeep') renderTavernkeepShop();
  else if (name === 'town') renderTownPanel();
}

// ---------- Hotbar ----------
function buildHotbar() {
  var hb = $('hotbar');
  for (var i = 0; i < 10; i++) {
    var d = document.createElement('div');
    d.className = 'hslot';
    d.setAttribute('data-slot', i);
    d.innerHTML = '<div class="num">' + ((i + 1) % 10) + '</div><div class="icon"></div><div class="count"></div>';
    hb.appendChild(d);
  }
  hb.addEventListener('click', function(e) {
    var slot = e.target.closest('.hslot');
    if (slot) game.player.inventory.selected = parseInt(slot.getAttribute('data-slot'), 10);
  });
}

function updateHotbar() {
  var hb = $('hotbar');
  var inv = game.player.inventory;
  for (var i = 0; i < 10; i++) {
    var d = hb.children[i];
    d.className = 'hslot' + (inv.selected === i ? ' selected' : '');
    var s = inv.slots[i];
    var icon = d.querySelector('.icon');
    var count = d.querySelector('.count');
    if (s) {
      icon.innerHTML = itemIconHTML(ITEMS[s.id]);
      count.textContent = s.count > 1 ? s.count : '';
    } else {
      icon.innerHTML = '';
      count.textContent = '';
    }
  }
}

// ---------- Panel content ----------
function buildPanelHTML() {
  $('panel-inventory').innerHTML = '<div id="inv-armor"></div><div class="inventory-hint">Drag items to move or swap them. Click an item, then click an equipment, Dye, or Ammo slot to equip it.</div><div id="inv-grid"></div><div id="inv-desc"></div>';
  $('panel-crafting').innerHTML = '<div id="craft-tabs"></div><div id="craft-list"></div>';
  $('panel-guide').innerHTML = '<div id="guide-content"></div>';
}

function itemIconHTML(it) {
  if (!it) return '';
  if (it.icon === 'block' || it.icon === 'bar') {
    return '<div style="width:26px;height:26px;background:' + it.color + ';border:1px solid rgba(255,255,255,0.35);border-radius:3px;display:inline-block;box-sizing:border-box;"></div>';
  }
  return it.icon;
}

function renderGuide() {
  var root = $('guide-content');
  if (!root) return;
  var selected = game.player.inventory.selectedItem();
  var phase = game.hardmode ? 'Hardmode is active. Defeat the mechanical bosses, Plantera, Golem, the Dungeon ritual, and the Celestial Pillars.' :
    'Gather basic ores, defeat the evil boss and Skeletron, then challenge the Wall of Flesh in the Underworld.';
  var html = '<h3>Guide</h3><p>' + phase + '</p><p>Select an item in your inventory to see every recipe that uses it.</p>';
  if (!selected || !ITEMS[selected.id]) {
    root.innerHTML = html + '<div class="ddesc">No item selected.</div>';
    return;
  }
  var item = ITEMS[selected.id], matches = [];
  for (var i = 0; i < RECIPES.length; i++) {
    var recipe = RECIPES[i];
    for (var m = 0; m < recipe.mat.length; m++) {
      if (recipe.mat[m][0] === selected.id) { matches.push(recipe); break; }
    }
  }
  html += '<div class="town-service"><h4>' + item.name + '</h4><div class="ddesc">' + (item.desc || 'No description.') + '</div></div>';
  if (!matches.length) html += '<div class="ddesc">The Guide knows no recipes that consume this item.</div>';
  else {
    html += '<div class="tavern-shop">';
    for (var r = 0; r < matches.length; r++) {
      var rec = matches[r], result = ITEMS[rec.result];
      var gate = rec.after ? 'After ' + rec.after.charAt(0).toUpperCase() + rec.after.slice(1) : (rec.hm ? 'Hardmode' : 'Pre-Hardmode');
      html += '<div class="tavern-item"><div class="picon">' + itemIconHTML(result) + '</div><div class="shop-info"><div class="shop-name">' + rec.name +
        '</div><div class="creq">' + stationLabel(rec) + ' &middot; ' + gate + '</div><div>' + matsHTML(rec) + '</div></div></div>';
    }
    html += '</div>';
  }
  root.innerHTML = html;
}

function renderInventory() {
  var inv = game.player.inventory;
  var grid = $('inv-grid');
  var html = '';
  for (var i = 0; i < 50; i++) {
    var s = inv.slots[i];
    var sel = inv.selected === i ? ' selected' : '';
    var loaded = s && inv.ammo === s.id ? ' ammo-selected' : '';
    html += '<div class="inv-cell' + sel + loaded + '" data-idx="' + i + '"' + (s ? ' draggable="true"' : '') + '>';
    if (s) {
      html += '<div class="icon">' + itemIconHTML(ITEMS[s.id]) + '</div>';
      if (s.count > 1) html += '<div class="count">' + s.count + '</div>';
    }
    html += '</div>';
  }
  grid.innerHTML = html;

  var armor = $('inv-armor');
  var armorHTML = '';
  var armorSlots = { head: 'Head', chest: 'Chest', legs: 'Legs' };
  for (var key in armorSlots) {
    var id = inv.armor[key];
    armorHTML += '<div class="armor-box"><div>' + armorSlots[key] + '</div><div class="armor-slot" data-slot="' + key + '">' + (id ? itemIconHTML(ITEMS[id]) : '') + '</div></div>';
  }
  armorHTML += '<div class="armor-box"><div>Accessory</div><div class="acc-grid">';
  for (var a = 0; a < inv.accessories.length; a++) {
    var aid = inv.accessories[a];
    armorHTML += '<div class="acc-slot" data-acc="' + a + '">' + (aid ? itemIconHTML(ITEMS[aid]) : '') + '</div>';
  }
  armorHTML += '</div></div>';
  var ammoId = inv.ammo;
  armorHTML += '<div class="armor-box"><div>Ammo</div><div class="ammo-slot">' +
    (ammoId ? itemIconHTML(ITEMS[ammoId]) : '') + '</div><div class="ammo-name">' +
    (ammoId ? ITEMS[ammoId].name + ' (' + inv.countOf(ammoId) + ')' : 'Automatic') + '</div></div>';
  armorHTML += '<div class="armor-box"><div>Defense</div><div class="def">' + inv.defense() + '</div></div>';
  armorHTML += '<div class="armor-box"><div>Dye</div><div class="dye-grid">';
  for (var d = 0; d < inv.dyes.length; d++) {
    var did = inv.dyes[d];
    armorHTML += '<div class="dye-slot" data-dye="' + d + '" style="background:' + (did ? ITEMS[did].color : 'rgba(0,0,0,0.3)') + '">' + (did ? '' : '') + '</div>';
  }
  armorHTML += '</div></div>';
  armor.innerHTML = armorHTML;

  var desc = $('inv-desc');
  var sel2 = inv.selectedItem();
  if (sel2) {
    var it = ITEMS[sel2.id];
    var stats = '';
    if (it.dmg) stats += '<span class="dstat">Damage ' + Math.round(it.dmg * inv.itemDamageMul(sel2)) + '</span>';
    if (it.speed) stats += ' <span class="dstat">Speed ' + it.speed + '</span>';
    if (it.power) stats += ' <span class="dstat">Pickaxe ' + it.power + '</span>';
    if (it.def) stats += ' <span class="dstat">Defense ' + it.def + '</span>';
    if (it.mana && it.type === 'magic') stats += ' <span class="dstat">Mana ' + it.mana + '</span>';
    if (it.heal) stats += ' <span class="dstat">Heals ' + it.heal + '</span>';
    if (it.heart) stats += ' <span class="dstat">+MaxHP ' + it.heart + '</span>';
    if (it.type === 'ranged') {
      var loadedAmmo = inv.ammoFor(it.ammo);
      stats += ' <span class="dstat">Ammo ' + (loadedAmmo ? ITEMS[loadedAmmo].name : 'None') + '</span>';
    }
    if (it.type === 'ammo' && it.ammoGroup) stats += ' <span class="dstat">' + it.ammoGroup.charAt(0).toUpperCase() + it.ammoGroup.slice(1) + '</span>';
    desc.innerHTML = '<div class="dname">' + (sel2.reforge ? sel2.reforge.name + ' ' : '') + it.name + '</div>' + (stats ? '<div>' + stats + '</div>' : '') + (it.desc ? '<div class="ddesc">' + it.desc + '</div>' : '');
  } else {
    desc.innerHTML = '<div class="ddesc">Select an item to see its details.</div>';
  }
}

function moveInventorySlot(from, to) {
  if (!game || !game.player || from === to || from < 0 || from >= 50 || to < 0 || to >= 50) return false;
  var inv = game.player.inventory;
  if (!inv.slots[from]) return false;
  inv.swap(from, to);
  renderInventory();
  updateHotbar();
  return true;
}

function selectAmmo() {
  var inv = game.player.inventory;
  var sel = inv.selectedItem();
  if (!sel || ITEMS[sel.id].type !== 'ammo') {
    inv.ammo = null;
    game.message('Ammo selection set to automatic.');
    AudioSys.play('place');
    return;
  }
  if (inv.ammo === sel.id) {
    inv.ammo = null;
    game.message('Ammo selection set to automatic.');
  } else {
    inv.ammo = sel.id;
    game.message(ITEMS[sel.id].name + ' selected as preferred ammo.');
  }
  AudioSys.play('craft');
}

function equipDye(slotIndex) {
  var inv = game.player.inventory;
  var sel = inv.selectedItem();
  if (!sel) return;
  var it = ITEMS[sel.id];
  if (it.type !== 'dye') return;
  var old = inv.dyes[slotIndex];
  inv.dyes[slotIndex] = sel.id;
  inv.removeAt(inv.selected, 1);
  if (old) inv.add(old, 1);
  AudioSys.play('craft');
}

function renderChest() {
  var chest = game.chest;
  if (!chest) { $('panel-chest').innerHTML = '<div class="ddesc">No chest open.</div>'; return; }
  var inv = game.player.inventory;
  var html = '<h3>' + (chest.kind === 'shadow' ? 'Shadow Chest' : 'Chest') + '</h3><div class="chest-grid">';
  for (var i = 0; i < 20; i++) {
    var s = chest.inv[i];
    html += '<div class="inv-cell" data-chest="' + i + '">';
    if (s) {
      html += '<div class="icon">' + itemIconHTML(ITEMS[s.id]) + '</div>';
      if (s.count > 1) html += '<div class="count">' + s.count + '</div>';
    }
    html += '</div>';
  }
  html += '</div>';
  html += '<div class="ddesc">Click a stack to take it. Deposit sends the selected inventory stack into this chest.</div>';
  html += '<div class="chest-actions"><button data-chest-loot class="btn">Loot all</button><button data-chest-deposit class="btn">Deposit selected</button><button id="chest-close" class="btn secondary">Close</button></div>';
  $('panel-chest').innerHTML = html;
  var bc = document.getElementById('chest-close');
  if (bc) bc.addEventListener('click', function() { closePanel(); });
}

function chestAddStack(chest, stack) {
  if (!chest || !stack || !ITEMS[stack.id]) return 0;
  var remaining = stack.count;
  var max = ITEMS[stack.id].maxStack;
  if (!stack.reforge) {
    for (var i = 0; i < chest.inv.length && remaining > 0; i++) {
      var current = chest.inv[i];
      if (current && current.id === stack.id && !current.reforge && current.count < max) {
        var merged = Math.min(max - current.count, remaining);
        current.count += merged;
        remaining -= merged;
      }
    }
  }
  while (remaining > 0 && chest.inv.length < 20) {
    var moved = Math.min(max, remaining);
    chest.inv.push(copyItemStack(stack, moved));
    remaining -= moved;
  }
  return stack.count - remaining;
}

function lootAllChest() {
  var chest = game.chest;
  if (!chest) return;
  var movedAny = false;
  for (var i = chest.inv.length - 1; i >= 0; i--) {
    var stack = chest.inv[i];
    var moved = game.player.inventory.addStack(stack);
    if (moved > 0) movedAny = true;
    stack.count -= moved;
    if (stack.count <= 0) chest.inv.splice(i, 1);
  }
  if (!movedAny && chest.inv.length) game.message('Your inventory is full.');
  if (movedAny) AudioSys.play('pickup');
  if (typeof Net !== 'undefined') Net.syncChest(chest);
  renderChest();
}

function depositSelectedInChest() {
  var inv = game.player.inventory;
  var stack = inv.selectedItem();
  if (!stack || !game.chest) { game.message('Select an inventory item first.'); return; }
  var moved = chestAddStack(game.chest, stack);
  if (moved <= 0) { game.message('The chest is full.'); return; }
  inv.removeAt(inv.selected, moved);
  AudioSys.play('place');
  if (typeof Net !== 'undefined') Net.syncChest(game.chest);
  renderChest();
}

function recipeCategory(r) {
  var id = r.result;
  var it = ITEMS[id];
  if (r.special) return 'Basic';
  if (it.type === 'bar') return 'Smelting';
  if (it.type === 'pylon') return 'Basic';
  if (it.type === 'tool' || it.type === 'hook' || it.type === 'fishingrod') return 'Tools';
  if (it.type === 'melee' || it.type === 'whip') return 'Melee';
  if (it.type === 'ranged' || it.type === 'ammo') return 'Ranged';
  if (it.type === 'magic') return 'Magic';
  if (it.type === 'summonstaff') return 'Summoner';
  if (it.type === 'armor') return 'Armor';
  if (it.type === 'accessory' || it.type === 'mount' || it.type === 'pet' || it.type === 'lightpet') return 'Accessories';
  if (it.type === 'consumable') return 'Potions';
  if (it.type === 'summon' || it.type === 'eventitem') return 'Boss Summons';
  return 'Basic';
}

function stationLabel(r) {
  if (r.station === 'none') return 'Anywhere';
  if (r.station === 'workbenchEcto') return 'Workbench + Ecto Mist';
  if (r.station === 'anvilEcto') return 'Anvil + Ecto Mist';
  if (r.station === 'ectomist') return 'Ecto Mist';
  return r.station.charAt(0).toUpperCase() + r.station.slice(1);
}

function matsHTML(r) {
  var inv = game.player.inventory;
  var html = '';
  for (var i = 0; i < r.mat.length; i++) {
    var id = r.mat[i][0], cnt = r.mat[i][1];
    var have = inv.countOf(id);
    var cls = have >= cnt ? '' : ' missing';
    html += '<span class="cmat' + cls + '">' + ITEMS[id].name + ' ' + have + '/' + cnt + '</span> ';
  }
  return html;
}

function renderCrafting() {
  var cats = ['All', 'Basic', 'Smelting', 'Tools', 'Melee', 'Ranged', 'Magic', 'Summoner', 'Armor', 'Accessories', 'Potions', 'Boss Summons'];
  var tabsHTML = '';
  for (var i = 0; i < cats.length; i++) {
    var act = game.craftCat === cats[i] ? ' active' : '';
    tabsHTML += '<button class="tab' + act + '" data-cat="' + cats[i] + '">' + cats[i] + '</button>';
  }
  $('craft-tabs').innerHTML = tabsHTML;

  var html = '';
  for (var r = 0; r < RECIPES.length; r++) {
    var rec = RECIPES[r];
    if (!recipeProgressionMet(game, rec)) continue;
    if (game.craftCat !== 'All' && recipeCategory(rec) !== game.craftCat) continue;
    var ok = recipeAvailable(game, rec);
    html += '<div class="craft-row' + (ok ? '' : ' cant') + '" data-idx="' + r + '">';
    html += '<div class="cicon">' + itemIconHTML(ITEMS[rec.result]) + '</div>';
    html += '<div><div class="cname">' + rec.name + '</div>';
    html += '<div class="creq">Station: ' + stationLabel(rec) + '</div>';
    html += '<div>' + matsHTML(rec) + '</div></div>';
    html += '</div>';
  }
  $('craft-list').innerHTML = html;
}

function equipArmor(slotName) {
  var inv = game.player.inventory;
  var sel = inv.selectedItem();
  if (!sel) return;
  var it = ITEMS[sel.id];
  if (it.type !== 'armor' || it.slot !== slotName) return;
  var old = inv.armor[slotName];
  inv.armor[slotName] = sel.id;
  inv.removeAt(inv.selected, 1);
  if (old) inv.add(old, 1);
  AudioSys.play('craft');
}

function equipAccessory(slotIndex) {
  var inv = game.player.inventory;
  var sel = inv.selectedItem();
  if (!sel) return;
  var it = ITEMS[sel.id];
  if (it.type !== 'accessory') return;
  var old = inv.accessories[slotIndex];
  inv.accessories[slotIndex] = sel.id;
  inv.removeAt(inv.selected, 1);
  if (old) inv.add(old, 1);
  AudioSys.play('craft');
}

function equippedAccessory(id) {
  var acc = game.player.inventory.accessories;
  for (var i = 0; i < acc.length; i++) if (acc[i] === id) return true;
  return false;
}

function equippedAccessoryEffect(field) {
  var acc = game.player.inventory.accessories;
  for (var i = 0; i < acc.length; i++) if (acc[i] && ITEMS[acc[i]] && ITEMS[acc[i]][field]) return true;
  return false;
}

function fishingPowerText() {
  var p = game.player, inv = p.inventory;
  if (p.fishing) return 'Fishing Power ' + p.fishing.power;
  var selected = inv.selectedItem(), def = selected && ITEMS[selected.id];
  var rodPower = def && def.type === 'fishingrod' ? (def.fishingPower || 15) : 0;
  var baitPower = inv.countOf(I.NIGHTCRAWLER) ? ITEMS[I.NIGHTCRAWLER].baitPower : (inv.countOf(I.WORM) ? ITEMS[I.WORM].baitPower : 0);
  return 'Fishing Power ' + (rodPower + baitPower + (p.buffs[I.FISHINGPOTION] ? 25 : 0) + inv.accEffects().fishingPower);
}

function weatherRadioText() {
  var weather = game.weather || {}, kind = weatherKindAt(game, game.player.x, game.player.y);
  var condition = kind === 'blizzard' ? 'Blizzard' : (kind === 'sandstorm' ? 'Sandstorm' : (kind === 'rain' ? 'Rain' : 'Clear'));
  var speed = Math.round(Math.abs(weather.windSpeed || 0));
  return condition + ', Wind ' + speed + ' mph' + (speed ? (weather.windSpeed < 0 ? ' W' : ' E') : '');
}

function moonPhaseText() {
  var phases = ['Full Moon', 'Waning Gibbous', 'Third Quarter', 'Waning Crescent', 'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous'];
  return phases[game.dayCount % phases.length];
}

function metalDetectorText() {
  var p = game.player;
  var w = game.world;
  var px = Math.floor(p.x / TILE), py = Math.floor(p.y / TILE);
  var r = 42;
  var best = null;
  for (var dy = -r; dy <= r; dy++) {
    var ty = py + dy;
    for (var dx = -r; dx <= r; dx++) {
      var tx = px + dx;
      var t = w.get(tx, ty);
      if (t <= 0) continue;
      var nn = METAL_DETECTOR_NAMES[t];
      if (!nn) continue;
      var d = dx * dx + dy * dy;
      if (!best || d < best.d) best = { d: d, name: nn };
    }
  }
  for (var i = 0; i < game.pickups.length; i++) {
    var pickup = game.pickups[i];
    if (pickup.item !== I.STRANGEPLANT) continue;
    var pdx = (pickup.x - p.x) / TILE, pdy = (pickup.y - p.y) / TILE;
    var pd = pdx * pdx + pdy * pdy;
    if (pd <= r * r && (!best || pd < best.d)) best = { d:pd, name:'Strange Plant' };
  }
  if (!best) return 'Nothing Found';
  return best.name + ' Detected';
}

// ---------- HUD ----------
function updateHud() {
  var p = game.player;
  el.hpFill.style.width = Math.max(0, p.hp / p.maxHp * 100) + '%';
  el.hpText.textContent = Math.max(0, Math.ceil(p.hp)) + ' / ' + p.maxHp;
  el.manaFill.style.width = Math.max(0, p.mana / p.maxMana * 100) + '%';
  el.manaText.textContent = Math.max(0, Math.ceil(p.mana)) + ' / ' + p.maxMana;
  el.clock.textContent = clockString(game.timeOfDay);
  el.depth.textContent = 'Depth: ' + depthString();
  el.biome.textContent = biomeName();
  var localWeather = weatherKindAt(game, p.x, p.y);
  if (localWeather) el.biome.textContent += ' - ' + (localWeather === 'blizzard' ? 'Blizzard' : (localWeather === 'sandstorm' ? 'Sandstorm' : 'Rain'));
  if (isWindyDayAt(game, p.x, p.y)) el.biome.textContent += ' - Windy Day';
  if (game.starfall && game.starfall.active) el.biome.textContent += ' - Starfall';
  if (equippedAccessory(I.METALDETECTOR)) el.biome.textContent += ' - ' + metalDetectorText();
  if (equippedAccessoryEffect('fishInfo')) el.biome.textContent += ' - ' + fishingPowerText();
  if (equippedAccessoryEffect('weatherInfo')) el.biome.textContent += ' - ' + weatherRadioText();
  if (equippedAccessoryEffect('moonInfo')) el.biome.textContent += ' - ' + moonPhaseText();
  if (game.difficulty && game.difficulty !== 'normal') el.biome.textContent += ' - ' + DIFFICULTY[game.difficulty].name + ' Mode';
  el.fps.textContent = (game.fps || 0) + ' fps';

  // event indicator
  if (game.event || game.torchGod || game.party.active || game.lanternNight.active || (game.golf && game.golf.active)) {
    if (!el.event) {
      el.event = document.createElement('div');
      el.event.id = 'eventhud';
      document.body.appendChild(el.event);
    }
    if (game.golf && game.golf.active) {
      el.event.textContent = 'Golf Challenge - Score ' + game.golf.whacks + ' - ' + Math.ceil(game.golf.time) + 's left';
    } else if (game.torchGod) {
      el.event.textContent = 'Torch God - ' + game.torchGod.next + ' of ' + game.torchGod.torches.length + ' flames';
    } else if (game.event) {
      var names = {
        pumpkinmoon:'Pumpkin Moon', frostmoon:'Frost Moon', martianmadness:'Martian Madness',
        goblinarmy:'Goblin Army', pirateinvasion:'Pirate Invasion', solareclipse:'Solar Eclipse',
        bloodmoon:'Blood Moon', slimerain:'Slime Rain', frostlegion:'Frost Legion'
      };
      var evName = names[game.event.type] || 'Event';
      if (game.event.type === 'oldonesarmy') {
        var ooa = game.event;
        el.event.textContent = 'Old One\'s Army T' + ooa.tier + ' - Wave ' + (ooa.wave + 1) + ' / ' + OOA_TIERS[ooa.tier].waves.length + ' - Crystal ' + Math.ceil(ooa.crystalHp) + ' / ' + ooa.crystalMaxHp + ' - Mana ' + ooa.etherianMana;
      } else if (game.event.type === 'bloodmoon') el.event.textContent = evName + ' - Until dawn';
      else if (game.event.type === 'slimerain') {
        el.event.textContent = evName + (game.event.kingSpawned ? ' - King Slime has awoken!' : ' - ' + game.event.kills + ' / ' + game.event.target + ' slimes');
      } else {
        el.event.textContent = evName + ' - Wave ' + (game.event.wave >= 1 ? game.event.wave : 1) + ' of ' + EVENT_WAVES[game.event.type].sizes.length;
      }
    } else if (game.party.active) el.event.textContent = 'Party - Until dusk';
    else el.event.textContent = 'Lantern Night - Until dawn - Luck +0.3';
    el.event.style.display = '';
  } else if (el.event) {
    el.event.style.display = 'none';
  }
}

function clockString(t) {
  var hours = t * 24;
  var h = Math.floor(hours) % 24;
  var m = Math.floor((hours - Math.floor(hours)) * 60);
  var ampm = h < 12 ? 'AM' : 'PM';
  var h12 = h % 12; if (h12 === 0) h12 = 12;
  return h12 + ':' + (m < 10 ? '0' : '') + m + ' ' + ampm;
}

function depthString() {
  var p = game.player, w = game.world;
  var cx = clamp(Math.floor(p.x / TILE), 0, w.W - 1);
  var horizon = w.surfaceY[cx] * TILE;
  var depthPx = p.y + p.h / 2 - horizon;
  if (depthPx < -28 * TILE) return 'Sky';
  if (depthPx < 12 * TILE) return 'Surface';
  return Math.floor(depthPx / 2) + ' ft';
}

function biomeName() {
  var p = game.player, w = game.world;
  if (w.graveyardStrengthAt(p.x, p.y) >= 5) return 'Graveyard';
  var cx = clamp(Math.floor(p.x / TILE), 0, w.W - 1);
  var surf = w.surfaceY[cx] * TILE;
  var depth = (p.y + p.h / 2 - surf) / TILE;
  var b = w.biomeAt(p.x, p.y);
  var base;
  if (b === BIOME.CORRUPT) base = 'Corruption';
  else if (b === BIOME.CRIMSON) base = 'Crimson';
  else if (b === BIOME.HALLOW) base = 'Hallow';
  else if (b === BIOME.JUNGLE) base = 'Jungle';
  else if (b === BIOME.OCEAN) base = 'Ocean';
  else if (b === BIOME.TEMPLE) base = 'Lihzahrd Temple';
  else if (b === BIOME.UNDERWORLD) return 'The Underworld';
  else if (b === BIOME.SPIDER) base = 'Spider Cave';
  else if (b === BIOME.GRANITE) base = 'Granite Cave';
  else if (b === BIOME.MARBLE) base = 'Marble Cave';
  else if (b === BIOME.AETHER) return 'The Aether';
  else if (b === BIOME.MUSHROOM) base = 'Mushroom';
  else if (b === BIOME.SKY) return 'Sky';
  else if (b === BIOME.SNOW) base = 'Snow';
  else if (b === BIOME.DESERT) base = 'Desert';
  else if (b === BIOME.DUNGEON) return 'The Dungeon';
  else if (b === BIOME.UNDERDESERT) base = 'Underground Desert';
  else if (b === BIOME.UNDERSNOW) base = 'Underground Snow';
  else base = 'Forest';
  if (depth < -28) return base + ' (Sky)';
  if (depth < 40) return base;
  if (depth < 140) return 'Underground ' + base;
  return 'Cavern';
}

function updateBossBars() {
  var bars = game.bossBars;
  for (var i = bars.length - 1; i >= 0; i--) {
    if (bars[i].id.dead) bars.splice(i, 1);
  }
  var wrap = $('bossbars');
  while (wrap.children.length > bars.length) wrap.removeChild(wrap.lastChild);
  while (wrap.children.length < bars.length) {
    var d = document.createElement('div');
    d.className = 'bossbar';
    d.innerHTML = '<div class="name"></div><div class="fill"></div>';
    wrap.appendChild(d);
  }
  for (var b = 0; b < bars.length; b++) {
    var bar = bars[b];
    var div = wrap.children[b];
    var hp = Math.max(0, Math.ceil(bar.id.hp));
    div.querySelector('.name').textContent = bar.name + '  ' + hp + ' / ' + bar.id.maxHp;
    div.querySelector('.fill').style.width = Math.max(0, bar.id.hp / bar.id.maxHp * 100) + '%';
    div.querySelector('.fill').style.background = bar.color;
  }
}

function updateCrosshair() {
  el.crosshair.style.left = MOUSE.x + 'px';
  el.crosshair.style.top = MOUSE.y + 'px';
  var th = el.tilehint;
  var t = game.world.get(MOUSE.tpx, MOUSE.tpy);
  var txt = '';
  if (t >= 0 && t !== T.AIR) {
    var name = TILE_DROP[t] ? ITEMS[TILE_DROP[t]].name : tileName(t);
    var hp = game.world.hp[game.world.idx(MOUSE.tpx, MOUSE.tpy)];
    txt = name + ' ' + hp;
  }
  th.textContent = txt;
  th.style.left = (MOUSE.x + 14) + 'px';
  th.style.top = (MOUSE.y + 10) + 'px';
}

function tileName(t) {
  var map = {};
  map[T.WORKBENCH] = 'Workbench'; map[T.FURNACE] = 'Furnace'; map[T.ANVIL] = 'Anvil'; map[T.TORCH] = 'Torch';
  map[T.HELLFORGE] = 'Hellforge'; map[T.SHADOWCHEST] = 'Shadow Chest'; map[T.PYLON] = 'Pylon';
  map[T.ETERNIASTAND] = 'Eternia Crystal Stand'; map[T.PARTYCENTER] = 'Party Center'; map[T.TOMBSTONE] = 'Tombstone'; map[T.SUNFLOWER] = 'Sunflower';
  return map[t] || 'Tile';
}

function updateInteract() {
  var el2 = $('interact');
  var p = game.player;
  var text = '';
  var gx = p.x, gy = p.y - 34;

  // chest nearby
  var tpx = MOUSE.tpx, tpy = MOUSE.tpy;
  var chestTile = game.world.get(tpx, tpy);
  if (tpx >= 0 && tpy >= 0 && tpx < game.world.W && tpy < game.world.H &&
      (chestTile === T.CHEST || chestTile === T.SHADOWCHEST) &&
      dist(p.x, p.y, tpx * TILE + 8, tpy * TILE + 8) < 72) {
    var nearbyChest = game.world.chestAt(tpx, tpy);
    text = nearbyChest && nearbyChest.locked ? 'Unlock Shadow Chest (Right-click)' : 'Open chest (Right-click)';
    gx = tpx * TILE + 8; gy = tpy * TILE - 8;
  }

  // Eternia Crystal Stand nearby
  if (tpx >= 0 && tpy >= 0 && tpx < game.world.W && tpy < game.world.H &&
      game.world.get(tpx, tpy) === T.ETERNIASTAND &&
      dist(p.x, p.y, tpx * TILE + 8, tpy * TILE + 8) < 72) {
    text = game.event && game.event.type === 'oldonesarmy' ? 'Defend the Eternia Crystal' : 'Activate Eternia Stand (Right-click)';
    gx = tpx * TILE + 8; gy = tpy * TILE - 10;
  }

  if (tpx >= 0 && tpy >= 0 && tpx < game.world.W && tpy < game.world.H &&
      game.world.get(tpx, tpy) === T.PARTYCENTER &&
      dist(p.x, p.y, tpx * TILE + 8, tpy * TILE + 8) < 72) {
    text = game.party.active ? 'Stop Party (Right-click)' : 'Start Party (Right-click)';
    gx = tpx * TILE + 8; gy = tpy * TILE - 10;
  }

  // pylon nearby
  if (tpx >= 0 && tpy >= 0 && tpx < game.world.W && tpy < game.world.H &&
      game.world.get(tpx, tpy) === T.PYLON &&
      dist(p.x, p.y, tpx * TILE + 8, tpy * TILE + 8) < 72) {
    text = 'Teleport pylon (Right-click)';
    gx = tpx * TILE + 8; gy = tpy * TILE - 10;
  }

  if (!text) {
    var rescueTarget = rescueNpcAtCursor();
    if (rescueTarget) {
      text = rescueTarget.name + ': Right-click to rescue';
      gx = rescueTarget.x; gy = rescueTarget.y - 34;
    }
  }

  if (!text) {
    var guideTarget = guideAtCursor();
    if (guideTarget) {
      text = 'Guide: Right-click or press H for recipes';
      gx = guideTarget.x; gy = guideTarget.y - 34;
    }
  }

  if (!text) {
    var townTarget = townNpcAtCursor();
    if (townTarget) {
      var action = townTarget.type === E.NURSE ? 'treatment' : (townTarget.type === E.GOBLINTINKERER ? 'reforge' : (townTarget.type === E.DRYAD ? 'shop or inspect the world' : 'shop'));
      text = townTarget.name + ': Right-click to ' + action;
      gx = townTarget.x; gy = townTarget.y - 34;
    }
  }

  if (!text) {
    for (var i = 0; i < game.entities.length; i++) {
      var e = game.entities[i];
      if (e.type === E.GUIDE && !e.dead && dist(e.x, e.y, p.x, p.y) < 90) {
        text = 'Guide: press H for recipes';
        gx = e.x; gy = e.y - 30;
        break;
      }
      if (e.type === E.TAVERNKEEP && !e.dead && dist(e.x, e.y, p.x, p.y) < 90) {
        text = 'Tavernkeep: Right-click to shop';
        gx = e.x; gy = e.y - 34;
        break;
      }
    }
  }
  if (!text && game.world.nearbyStations.length > 0) {
    text = 'Crafting available (E)';
    gx = p.x; gy = p.y - 34;
  }
  if (text) {
    el2.textContent = text;
    el2.style.left = (gx - game.cam.x + canvas.width / 2) + 'px';
    el2.style.top = (gy - game.cam.y + canvas.height / 2) + 'px';
    el2.style.opacity = 1;
  } else {
    el2.style.opacity = 0;
  }
}

// ---------- Pause / menus ----------
function togglePause() {
  if (!game || !game.started) return;
  if (game.paused || game.netMenu) resumeGame();
  else pauseGame();
}

function pauseGame() {
  if (typeof Net !== 'undefined' && Net.isOnline()) game.netMenu = true;
  else game.paused = true;
  $('mainmenu').classList.remove('hidden');
  document.querySelector('#mainmenu h1').textContent = 'Paused';
  refreshSaveMenu();
  $('howto').classList.add('hidden');
}

function resumeGame() {
  game.paused = false;
  game.netMenu = false;
  $('mainmenu').classList.add('hidden');
  $('pause-actions').classList.add('hidden');
  acc = 0;
  AudioSys.resume();
}

// ---------- Render ----------
function render() {
  if (!game || !game.started) return;
  renderGame(game, ctx2d);
  if (!game.panelOpen) drawMinimap(game, ctx2d);
}

// ---------- Init ----------
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initDOM() {
  resize();
  window.addEventListener('resize', resize);

  $('loading').classList.add('hidden');

  el.hpFill = document.createElement('div');
  el.hpFill.className = 'fill';
  $('hpbar').insertBefore(el.hpFill, $('hptext'));
  el.manaFill = document.createElement('div');
  el.manaFill.className = 'fill';
  $('manabar').insertBefore(el.manaFill, $('manatext'));
  el.hpText = $('hptext');
  el.manaText = $('manatext');
  el.clock = $('clock');
  el.depth = $('depth');
  el.biome = $('biome');
  el.fps = $('fps');
  el.crosshair = $('crosshair');
  el.tilehint = $('tilehint');

  $('interact').style.opacity = 0;

  buildHotbar();
  buildPanelHTML();

  // panel tabs
  var tabs = document.querySelectorAll('#panel-tabs .tab');
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener('click', function() {
      var name = this.getAttribute('data-panel');
      switchPanel(name);
      renderPanel(name);
    });
  }
  $('panel-close').addEventListener('click', function() { closePanel(); });

  // inventory interactions (event delegation)
  var inventoryDragSlot = -1, inventoryDragFinishedAt = 0;
  function clearInventoryDragClasses() {
    var cells = $('inv-grid').querySelectorAll('.dragging, .drag-target');
    for (var dc = 0; dc < cells.length; dc++) cells[dc].classList.remove('dragging', 'drag-target');
  }
  $('inv-grid').addEventListener('dragstart', function(e) {
    var cell = e.target.closest('.inv-cell[data-idx]');
    if (!cell) return;
    var idx = parseInt(cell.getAttribute('data-idx'), 10);
    if (!game.player.inventory.slots[idx]) { e.preventDefault(); return; }
    inventoryDragSlot = idx;
    cell.classList.add('dragging');
    if (e.dataTransfer) { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', '' + idx); }
  });
  $('inv-grid').addEventListener('dragover', function(e) {
    var cell = e.target.closest('.inv-cell[data-idx]');
    if (!cell || inventoryDragSlot < 0) return;
    e.preventDefault();
    var old = $('inv-grid').querySelectorAll('.drag-target');
    for (var i = 0; i < old.length; i++) old[i].classList.remove('drag-target');
    cell.classList.add('drag-target');
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
  });
  $('inv-grid').addEventListener('drop', function(e) {
    var cell = e.target.closest('.inv-cell[data-idx]');
    if (!cell || inventoryDragSlot < 0) return;
    e.preventDefault();
    moveInventorySlot(inventoryDragSlot, parseInt(cell.getAttribute('data-idx'), 10));
    inventoryDragFinishedAt = Date.now();
    inventoryDragSlot = -1;
    clearInventoryDragClasses();
  });
  $('inv-grid').addEventListener('dragend', function() {
    inventoryDragSlot = -1;
    clearInventoryDragClasses();
  });
  $('inv-grid').addEventListener('click', function(e) {
    if (Date.now() - inventoryDragFinishedAt < 250) return;
    var cell = e.target.closest('.inv-cell');
    if (!cell) return;
    if (game.chestOpen) {
      var inv2 = game.player.inventory;
      var idx2 = parseInt(cell.getAttribute('data-idx'), 10);
      var s2 = inv2.slots[idx2];
      if (!s2) return;
      var chest2 = game.chest;
      var keyDef = ITEMS[s2.id];
      if (keyDef && keyDef.type === 'mimickey' && chest2.inv.length === 0 &&
          game.world.get(chest2.x, chest2.y) === T.CHEST) {
        if (!game.hardmode) { game.message('Biome Mimics can only awaken in Hardmode.'); return; }
        var mimicType = keyDef.mimic === 'hallow' ? E.HALLOWEDMIMIC :
          (game.world.evil === 'crimson' ? E.CRIMSONMIMIC : E.CORRUPTMIMIC);
        inv2.removeAt(idx2, 1);
        var mx = chest2.x * TILE + 8, my = chest2.y * TILE + 8;
        game.world.breakTile(chest2.x, chest2.y);
        game.world.spilledChestItems = null;
        var mimic = spawnEntity(game, mimicType, mx, my);
        mimic.awake = true;
        closePanel();
        game.message(ITEMS[s2.id].name + ' has awakened a ' + mimic.name + '!');
        AudioSys.play('roar');
        return;
      }
      var stored = chestAddStack(chest2, s2);
      if (stored <= 0) { game.message('The chest is full.'); return; }
      inv2.removeAt(idx2, stored);
      AudioSys.play('place');
      if (typeof Net !== 'undefined') Net.syncChest(chest2);
      renderChest();
      return;
    }
    var idx = parseInt(cell.getAttribute('data-idx'), 10);
    var s = game.player.inventory.slots[idx];
    if (s && s.bagBoss && s.bagDrops) { game.openBossBag(idx, s); return; }
    game.player.inventory.selected = idx;
    renderInventory();
  });
  $('inv-armor').addEventListener('click', function(e) {
    var slotEl = e.target.closest('.armor-slot');
    if (slotEl) equipArmor(slotEl.getAttribute('data-slot'));
    var accEl = e.target.closest('.acc-slot');
    if (accEl) equipAccessory(parseInt(accEl.getAttribute('data-acc'), 10));
    var dyeEl = e.target.closest('.dye-slot');
    if (dyeEl) equipDye(parseInt(dyeEl.getAttribute('data-dye'), 10));
    var ammoEl = e.target.closest('.ammo-slot');
    if (ammoEl) selectAmmo();
  });
  $('panel-chest').addEventListener('click', function(e) {
    if (e.target.closest('[data-chest-loot]')) { lootAllChest(); return; }
    if (e.target.closest('[data-chest-deposit]')) { depositSelectedInChest(); return; }
    var cell = e.target.closest('.inv-cell[data-chest]');
    if (!cell) return;
    var chest = game.chest;
    if (!chest) return;
    var idx = parseInt(cell.getAttribute('data-chest'), 10);
    var s = chest.inv[idx];
    if (!s) return;
    var moved = game.player.inventory.addStack(s);
    if (moved <= 0) { game.message('Your inventory is full.'); return; }
    s.count -= moved;
    if (s.count <= 0) chest.inv.splice(idx, 1);
    if (typeof Net !== 'undefined') Net.syncChest(chest);
    AudioSys.play('pickup');
    renderChest();
  });
  $('panel-pylon').addEventListener('click', function(e) {
    var btn = e.target.closest('.pylon-btn');
    if (!btn) return;
    pylonTeleport(parseInt(btn.getAttribute('data-pidx'), 10));
  });
  $('panel-tavernkeep').addEventListener('click', function(e) {
    var gift = e.target.closest('[data-tavern-gift]');
    if (gift) { claimTavernkeepGift(); return; }
    var buy = e.target.closest('[data-tavern-item]');
    if (buy) buyTavernkeepItem(parseInt(buy.getAttribute('data-tavern-item'), 10));
  });
  $('panel-town').addEventListener('click', function(e) {
    var slot = e.target.closest('[data-town-slot]');
    if (slot) { game.player.inventory.selected = parseInt(slot.getAttribute('data-town-slot'), 10); renderTownPanel(); return; }
    var buy = e.target.closest('[data-town-buy]');
    if (buy) { buyTownItem(parseInt(buy.getAttribute('data-town-buy'), 10)); renderTownPanel(); return; }
    if (e.target.closest('[data-town-heal]')) { nurseHeal(); renderTownPanel(); return; }
    if (e.target.closest('[data-town-tax]')) { collectTownTax(); renderTownPanel(); return; }
    if (e.target.closest('[data-angler-quest]')) { turnInAnglerQuest(); renderTownPanel(); return; }
    if (e.target.closest('[data-town-hair]')) { stylistHair(); renderTownPanel(); return; }
    if (e.target.closest('[data-town-strange]')) { exchangeStrangePlant(); renderTownPanel(); return; }
    if (e.target.closest('[data-town-reforge]')) { reforgeSelectedItem(); renderTownPanel(); }
    if (e.target.closest('[data-town-golf]')) { golferStartGolf(); renderTownPanel(); }
  });
  $('panel-housing').addEventListener('click', function(e) {
    var assign = e.target.closest('[data-house-type]');
    if (assign) { assignNpcHousing(parseInt(assign.getAttribute('data-house-type'), 10)); return; }
    var remove = e.target.closest('[data-unhouse-type]');
    if (remove) removeNpcHousing(parseInt(remove.getAttribute('data-unhouse-type'), 10));
  });
  $('craft-tabs').addEventListener('click', function(e) {
    var tab = e.target.closest('.tab');
    if (tab) { game.craftCat = tab.getAttribute('data-cat'); renderCrafting(); }
  });
  $('craft-list').addEventListener('click', function(e) {
    var row = e.target.closest('.craft-row');
    if (!row) return;
    var r = RECIPES[parseInt(row.getAttribute('data-idx'), 10)];
    if (craftRecipe(game, r)) {
      game.message('Crafted ' + ITEMS[r.result].name);
      var it = ITEMS[r.result];
      if (it.type === 'consumable') Achievements.unlock('alchemist', game);
      if (r.result === I.MECH_EYE) Achievements.unlock('mecheye', game);
      if (r.result === I.MECH_WORM) Achievements.unlock('mechworm', game);
      if (r.result === I.MECH_SKULL) Achievements.unlock('mechskull', game);
      renderCrafting();
    }
  });

  // menus
  $('btn-new').addEventListener('click', function() {
    $('btn-new').classList.add('hidden');
    $('world-create').classList.remove('hidden');
    $('world-name').value = '';
    $('world-name').focus();
  });
  $('btn-cancel-create').addEventListener('click', function() {
    $('world-create').classList.add('hidden');
    $('btn-new').classList.remove('hidden');
  });
  $('btn-create').addEventListener('click', function() {
    startNewGame($('world-name').value);
  });
  $('world-name').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') startNewGame($('world-name').value);
  });
  $('world-list').addEventListener('click', function(event) {
    var row = event.target.closest('.world-row');
    if (!row) return;
    var id = row.getAttribute('data-world-id');
    if (event.target.closest('.world-delete')) deleteWorld(id);
    else if (event.target.closest('.world-host')) Net.hostWorld(id);
    else if (event.target.closest('.world-open')) startSavedGame(id);
  });
  $('btn-continue').addEventListener('click', function() { resumeGame(); });
  $('btn-save').addEventListener('click', function() { saveAndQuit(); });
  $('btn-leave-hosted').addEventListener('click', function() { Net.disconnect(true); });
  $('mp-refresh').addEventListener('click', function() { Net.refreshLobbies(); });
  $('mp-join').addEventListener('click', function() { Net.joinCode($('mp-code').value); });
  $('mp-code').addEventListener('keydown', function(e) { if (e.key === 'Enter') Net.joinCode(this.value); });
  $('lobby-list').addEventListener('click', function(e) {
    var row = e.target.closest('.lobby-row');
    if (row && e.target.closest('.lobby-join')) Net.joinCode(row.getAttribute('data-code'));
  });
  $('btn-howto').addEventListener('click', function() {
    var open = $('howto').classList.contains('hidden');
    $('howto').classList.toggle('hidden', !open);
    this.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  $('howto-close').addEventListener('click', function() {
    $('howto').classList.add('hidden');
    $('btn-howto').setAttribute('aria-expanded', 'false');
  });
  $('btn-respawn').addEventListener('click', function() {
    if (game) game.respawn();
  });
  refreshSaveMenu();
  Net.refreshLobbies();
  document.addEventListener('visibilitychange', function() {
    if (document.hidden && game && game.started && !game.paused) saveGame(true);
  });
}

// ---------- Boot ----------
initDOM();
initInput();
initWorldStorage();
requestAnimationFrame(loop);
