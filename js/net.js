// ---------- Hosted multiplayer client ----------
var Net = {
  VERSION: 1,
  relay: 'wss://tree-relay.tung-tung-tung-sahur.workers.dev',
  mode: 'offline',
  ws: null,
  id: 0,
  hostId: 0,
  code: '',
  seq: 0,
  nextNid: 0,
  applying: false,
  started: false,
  snapshotParts: null,
  remotePlayers: {},
  playerNames: {},
  pendingTiles: [],
  sendT: 0,
  frameT: 0,
  profileT: 0,
  lobbyTimer: null,
  selectedWorldId: null,
  displayName: 'Guest',
  connectionOptions: null,
  reconnectTimer: null,
  reconnectAttempts: 0,

  httpRelay: function() { return this.relay.replace(/^wss:/, 'https:').replace(/^ws:/, 'http:'); },
  isOnline: function() { return this.mode !== 'offline' && this.ws && this.ws.readyState === WebSocket.OPEN; },
  isHost: function() { return this.isOnline() && this.id === this.hostId; },
  isClient: function() { return this.isOnline() && this.id !== this.hostId; },

  cleanName: function(value) {
    var name = String(value || '').replace(/[^\x20-\x7e]/g, '').trim().slice(0, 18);
    return name || accountSync.username || 'Guest';
  },

  send: function(message) {
    if (!this.isOnline()) return false;
    message.v = this.VERSION;
    try { this.ws.send(JSON.stringify(message)); return true; }
    catch (e) { return false; }
  },

  connect: function(options) {
    var self = this;
    var reconnecting = !!options.reconnecting;
    if (!reconnecting) {
      this.disconnect(false);
      this.connectionOptions = {
        name:options.name, password:options.password || '', worldId:options.worldId || null,
        worldName:options.worldName || '', create:!!options.create, code:options.code || ''
      };
      this.reconnectAttempts = 0;
    }
    if (this.reconnectTimer) { clearTimeout(this.reconnectTimer); this.reconnectTimer = null; }
    this.mode = options.create ? 'hosting' : 'joining';
    this.displayName = this.cleanName(options.name);
    this.selectedWorldId = options.worldId || null;
    this.setStatus(reconnecting ? 'Reconnecting...' : (options.create ? 'Creating hosted world...' : 'Joining hosted world...'));
    $('loading').classList.remove('hidden');
    $('loading').querySelector('h1').textContent = reconnecting ? 'reconnecting...' : (options.create ? 'starting host...' : 'joining world...');
    var url = options.create ? this.relay + '?create=1' : this.relay + '?code=' + encodeURIComponent(options.code || '');
    var ws;
    try { ws = new WebSocket(url); }
    catch (err) { this.fail(err.message); return; }
    this.ws = ws;
    ws.onopen = function() {
      self.send({
        t:options.create ? 'create' : 'join',
        name:self.cleanName(options.name), password:String(options.password || '').slice(0, 64),
        code:String(options.code || '').toUpperCase(), proto:self.VERSION,
        world:options.worldName || '', lobbyName:self.cleanName(options.name) + "'s world"
      });
    };
    ws.onmessage = function(event) {
      var message;
      try { message = JSON.parse(event.data); } catch (e) { return; }
      self.onMessage(message);
    };
    ws.onerror = function() { self.setStatus('Connection failed'); };
    ws.onclose = function(event) {
      if (self.ws !== ws || self.mode === 'offline') return;
      var wasPlaying = self.started;
      self.ws = null;
      self.setStatus('Disconnected'); self.renderRoster();
      if (wasPlaying && game && self.connectionOptions) {
        game.netDisconnected = true;
        game.message('Connection lost. Rejoining hosted world...');
        self.scheduleReconnect();
      }
      else self.fail(event.reason || 'Could not join hosted world.');
    };
  },

  scheduleReconnect: function() {
    var self = this;
    if (!this.connectionOptions || this.reconnectTimer) return;
    if (this.reconnectAttempts >= 5) {
      this.setStatus('Could not reconnect');
      if (game) game.netDisconnected = false;
      this.disconnect(true);
      return;
    }
    var delay = Math.min(5000, 1000 * Math.pow(2, this.reconnectAttempts++));
    this.mode = 'reconnecting';
    this.reconnectTimer = setTimeout(function() {
      self.reconnectTimer = null;
      var options = self.connectionOptions;
      self.connect({
        create:false, code:self.code || options.code, name:options.name, password:options.password,
        worldId:options.worldId, worldName:options.worldName, reconnecting:true
      });
    }, delay);
  },

  onMessage: function(message) {
    if (message.t === 'err' || message.t === 'error') { this.fail(message.m || message.message || 'Multiplayer error'); return; }
    if (message.t === 'welcome') {
      this.id = +message.you; this.hostId = +message.host || this.id; this.code = message.code || '';
      if (this.connectionOptions) this.connectionOptions.code = this.code;
      this.mode = this.id === this.hostId ? 'host' : 'client';
      this.setStatus((this.isHost() ? 'Hosting ' : 'Joined ') + this.code);
      if (this.isHost()) this.beginHosting();
      return;
    }
    if (message.t === 'lobby' || message.t === 'roster') {
      this.hostId = +message.host || this.hostId;
      if (message.world) activeWorldName = message.world;
      var list = message.players || [];
      this.playerNames = {};
      for (var i = 0; i < list.length; i++) this.playerNames[list[i].id] = list[i].name;
      for (var remoteId in this.remotePlayers) {
        if (!this.playerNames[remoteId] || +remoteId === this.id) delete this.remotePlayers[remoteId];
      }
      this.renderRoster();
      if (this.id && this.id !== this.hostId && this.mode !== 'client') this.mode = 'client';
      return;
    }
    if (message.t === 'host') {
      this.hostId = +message.host;
      this.mode = this.id === this.hostId ? 'host' : 'client';
      if (this.isHost()) {
        game.message('You are now the world host.');
        this.broadcastFullSnapshot();
      }
      this.renderRoster();
      return;
    }
    if (message.t === 'snapshot-request' && this.isHost()) { this.broadcastFullSnapshot(message.from); return; }
    if (message.t === 'snapshot-begin' && this.isClient()) { this.snapshotParts = new Array(message.total || 0); return; }
    if (message.t === 'snapshot-chunk' && this.snapshotParts) { this.snapshotParts[message.index] = message.data || ''; return; }
    if (message.t === 'snapshot-end' && this.snapshotParts && this.isClient()) { this.finishSnapshot(); return; }
    if (message.t === 'game') { this.onGame(message); return; }
    if (message.t === 'pong') return;
  },

  beginHosting: function() {
    var self = this;
    getWorldRecord(this.selectedWorldId).then(function(record) {
      if (!record || !record.data) throw new Error('World not found');
      activeWorldId = record.id; activeWorldName = record.name;
      applySaveData(record.data);
      self.started = true;
      $('loading').classList.add('hidden'); $('mainmenu').classList.add('hidden');
      self.send({ t:'start', metadata:{ world:record.name, saveFormat:SAVE_FORMAT } });
      self.broadcastFullSnapshot();
      self.renderRoster();
      game.message('Hosting ' + record.name + ' - code ' + self.code);
    }).catch(function(error) { self.fail(error.message); });
  },

  broadcastFullSnapshot: function(target) {
    if (!this.isHost() || !game) return;
    var raw;
    try { raw = JSON.stringify(saveSnapshot()); }
    catch (e) { game.message('Could not prepare multiplayer snapshot.'); return; }
    var size = 48000, count = Math.ceil(raw.length / size);
    var snapshotId = Date.now().toString(36) + '-' + Math.floor(Math.random() * 1679616).toString(36);
    var begin = { t:'snapshot-begin', id:snapshotId, total:count };
    if (target) begin.to = +target;
    this.send(begin);
    for (var i = 0; i < count; i++) {
      var chunk = { t:'snapshot-chunk', id:snapshotId, index:i, data:raw.slice(i * size, (i + 1) * size) };
      if (target) chunk.to = +target;
      this.send(chunk);
    }
    var end = { t:'snapshot-end', id:snapshotId };
    if (target) end.to = +target;
    this.send(end);
  },

  onGame: function(message) {
    if (message.to && +message.to !== this.id) return;
    if (message.k === 'snapshot-request' && this.isHost()) { this.broadcastFullSnapshot(message.from); return; }
    if (message.k === 'snapshot-begin' && this.isClient()) {
      this.snapshotParts = new Array(message.count || 0); activeWorldName = message.name || 'Hosted World'; return;
    }
    if (message.k === 'snapshot-part' && this.snapshotParts) { this.snapshotParts[message.i] = message.data || ''; return; }
    if (message.k === 'snapshot-end' && this.snapshotParts && this.isClient()) { this.finishSnapshot(); return; }
    if (message.k === 'player') {
      var playerId = +(message.playerId || message.from);
      if (playerId === this.id || !message.state || !game) return;
      this.remotePlayers[playerId] = this.makeRemotePlayer(playerId, message.state);
      return;
    }
    if (message.k === 'frame' && this.isClient()) { this.applyFrame(message.state); return; }
    if (message.k === 'tiles') { this.applyTileOps(message.ops || []); return; }
    if (message.k === 'mutation' && this.isHost()) { this.acceptMutation(message); return; }
    if (message.k === 'hit' && this.isHost()) { this.acceptHit(message); return; }
    if (message.k === 'boss' && this.isHost()) { if (!game.anyBossAlive()) game.spawnBoss(message.boss); return; }
    if (message.k === 'pickup' && this.isHost()) { this.acceptPickup(message); return; }
    if (message.k === 'chest' && this.isHost()) { this.acceptChest(message); return; }
    if (message.k === 'damage' && this.isClient()) { game.player.damage(Math.max(1, +message.dmg || 1), null, +message.kbx || 0); return; }
  },

  finishSnapshot: function() {
    var raw = this.snapshotParts.join(''); this.snapshotParts = null;
    try {
      var character = this.loadCharacter();
      this.applying = true;
      applySaveData(JSON.parse(raw));
      this.applying = false;
      activeWorldId = 'hosted-' + this.code.toLowerCase();
      activeWorldName = activeWorldName || 'Hosted World';
      var joinSpawn = game.world.findSafeSpawn(game.player.w, game.player.h);
      game.world.spawnX = joinSpawn.x; game.world.spawnY = joinSpawn.y;
      if (character) this.applyCharacter(character);
      else { game.player.inventory = new Inventory(); game.player.starterItems(); game.player.x = game.world.spawnX; game.player.y = game.world.spawnY; }
      this.started = true;
      this.reconnectAttempts = 0;
      game.netDisconnected = false;
      $('loading').classList.add('hidden'); $('mainmenu').classList.add('hidden');
      this.renderRoster();
      game.message('Joined ' + activeWorldName + '.');
    } catch (error) { this.applying = false; this.fail('World synchronization failed: ' + error.message); }
  },

  playerState: function(includeInventory, source) {
    if (!game || !game.player) return null;
    var p = source || game.player;
    var state = {
      x:p.x, y:p.y, vx:p.vx, vy:p.vy, dir:p.dir, onGround:!!p.onGround,
      hp:p.hp, maxHp:p.maxHp, mana:p.mana, maxMana:p.maxMana, dying:!!p.dying,
      invuln:p.invuln, jumps:p.jumps, mounted:p.mounted || null,
      swingT:p.swingT, swingAng:p.swingAng, selected:p.inventory.selected,
      armor:p.inventory.armor, dyes:p.inventory.dyes, name:p.netName || this.displayName
    };
    if (includeInventory) {
      state.inventory = p.inventory.slots;
      state.accessories = p.inventory.accessories;
      state.ammo = p.inventory.ammo;
      state.buffs = p.buffs;
    }
    return state;
  },

  makeRemotePlayer: function(id, state) {
    var old = this.remotePlayers[id];
    var p = old || new Player(game.world);
    p.netId = +id; p.netName = state.name || this.playerNames[id] || 'Player';
    p.targetX = +state.x; p.targetY = +state.y;
    if (!old) { p.x = p.targetX; p.y = p.targetY; }
    p.vx = +state.vx || 0; p.vy = +state.vy || 0; p.dir = state.dir || 1;
    p.onGround = !!state.onGround; p.hp = +state.hp || 1; p.maxHp = +state.maxHp || 100;
    p.mana = +state.mana || 0; p.maxMana = +state.maxMana || 200; p.dying = !!state.dying;
    p.invuln = +state.invuln || 0; p.jumps = +state.jumps || 0; p.swingT = +state.swingT || 0; p.swingAng = +state.swingAng || 0;
    p.mounted = state.mounted || null; p.mountDef = p.mounted ? ITEMS[p.mounted] : null;
    p.inventory.selected = +state.selected || 0; p.inventory.armor = state.armor || p.inventory.armor; p.inventory.dyes = state.dyes || p.inventory.dyes;
    if (state.inventory) p.inventory.slots = state.inventory;
    if (state.accessories) p.inventory.accessories = state.accessories;
    return p;
  },

  update: function(dt) {
    if (!this.started || !this.isOnline() || !game) return;
    this.sendT -= dt; this.frameT -= dt; this.profileT -= dt;
    if (this.sendT <= 0) {
      this.sendT = 0.1;
      var full = this.profileT <= 0;
      if (full) { this.profileT = 1; this.saveCharacter(); }
      this.send({ t:'game', k:'player', state:this.playerState(full) });
    }
    for (var id in this.remotePlayers) {
      var p = this.remotePlayers[id];
      p.x = lerp(p.x, p.targetX, 0.35); p.y = lerp(p.y, p.targetY, 0.35);
    }
    if (this.isHost() && this.frameT <= 0) {
      this.frameT = 0.1;
      if (this.pendingTiles.length) {
        this.send({ t:'game', k:'tiles', ops:this.pendingTiles.splice(0, 500) });
      }
      this.send({ t:'game', k:'frame', state:this.frameState() });
    }
  },

  frameState: function() {
    var entities = [];
    for (var i = 0; i < game.entities.length; i++) entities.push(this.entityState(game.entities[i]));
    var projectiles = [];
    for (var j = 0; j < game.projectiles.list.length; j++) projectiles.push(this.projectileState(game.projectiles.list[j]));
    var players = [];
    for (var id in this.remotePlayers) players.push({ id:+id, state:this.playerState(true, this.remotePlayers[id]) });
    return {
      timeOfDay:game.timeOfDay, weather:game.weather, hardmode:game.hardmode, victory:game.victory,
      bossesDefeated:game.bossesDefeated, mechDone:game.mechDone, event:game.event,
      pillarsSpawned:game.pillarsSpawned, pillarsDestroyed:game.pillarsDestroyed,
      entities:entities, projectiles:projectiles, pickups:game.pickups, chests:game.world.chests, players:players,
      bossBars:game.bossBars.map(function(b) { return { nid:b.id && b.id.nid, name:b.name, hp:b.hp, maxHp:b.maxHp, color:b.color }; })
    };
  },

  entityState: function(e) {
    if (!e.nid) e.nid = ++this.nextNid;
    var out = {};
    for (var key in e) if (e[key] === null || typeof e[key] === 'number' || typeof e[key] === 'string' || typeof e[key] === 'boolean') out[key] = e[key];
    if (e.parent && e.parent.nid) out.parentNid = e.parent.nid;
    if (e.sibling && e.sibling.nid) out.siblingNid = e.sibling.nid;
    if (e.segments) out.segments = e.segments.map(function(s) { return { x:s.x, y:s.y, hp:s.hp, maxHp:s.maxHp, dead:!!s.dead, color:s.color, w:s.w, h:s.h }; });
    return out;
  },

  projectileState: function(o) {
    if (!o.nid) o.nid = ++this.nextNid;
    var out = {};
    for (var key in o) if (o[key] === null || typeof o[key] === 'number' || typeof o[key] === 'string' || typeof o[key] === 'boolean') out[key] = o[key];
    return out;
  },

  applyFrame: function(state) {
    if (!state || !game) return;
    game.timeOfDay = +state.timeOfDay || 0;
    game.weather = state.weather || game.weather; game.hardmode = !!state.hardmode; game.world.hardmode = game.hardmode;
    game.victory = !!state.victory; game.bossesDefeated = state.bossesDefeated || {}; game.mechDone = !!state.mechDone;
    game.event = state.event || null; game.pillarsSpawned = !!state.pillarsSpawned; game.pillarsDestroyed = +state.pillarsDestroyed || 0;
    for (var playerIndex = 0; playerIndex < (state.players || []).length; playerIndex++) {
      var remote = state.players[playerIndex];
      if (+remote.id !== this.id && remote.state) this.remotePlayers[remote.id] = this.makeRemotePlayer(remote.id, remote.state);
    }
    this.applyEntities(state.entities || []);
    this.applyProjectiles(state.projectiles || []);
    game.pickups = state.pickups || [];
    this.applying = true; game.world.chests = state.chests || game.world.chests; this.applying = false;
    game.bossBars = [];
    for (var i = 0; i < (state.bossBars || []).length; i++) {
      var b = state.bossBars[i], ent = this.entityByNid(b.nid);
      if (ent) game.bossBars.push({ id:ent, name:b.name, hp:b.hp, maxHp:b.maxHp, color:b.color });
    }
  },

  applyEntities: function(list) {
    var byId = {}, next = [];
    for (var i = 0; i < game.entities.length; i++) if (game.entities[i].nid) byId[game.entities[i].nid] = game.entities[i];
    for (var j = 0; j < list.length; j++) {
      var data = list[j], e = byId[data.nid] || (data.type >= 0 && ENT_DEF[data.type] ? makeEntity(data.type, data.x, data.y) : {});
      for (var key in data) if (key !== 'segments' && key !== 'parentNid' && key !== 'siblingNid') e[key] = data[key];
      if (data.segments) e.segments = data.segments;
      next.push(e); byId[data.nid] = e;
    }
    for (var n = 0; n < list.length; n++) {
      var d = list[n], target = byId[d.nid];
      if (d.parentNid) target.parent = byId[d.parentNid] || null;
      if (d.siblingNid) target.sibling = byId[d.siblingNid] || null;
    }
    game.entities = next;
  },

  applyProjectiles: function(list) {
    var byId = {};
    var next = [];
    for (var i = 0; i < game.projectiles.list.length; i++) {
      var existing = game.projectiles.list[i];
      if (existing.nid) byId[existing.nid] = existing;
      if (existing.sourcePlayer === game.player) next.push(existing);
    }
    for (var j = 0; j < list.length; j++) {
      var data = list[j], o = byId[data.nid] || {};
      for (var k in data) o[k] = data[k];
      next.push(o);
    }
    game.projectiles.list = next;
  },

  entityByNid: function(nid) {
    for (var i = 0; i < game.entities.length; i++) if (game.entities[i].nid === +nid) return game.entities[i];
    return null;
  },

  worldMutation: function(kind, x, y, value) {
    if (!this.started || this.applying || !this.isOnline()) return;
    var op = [kind, +x, +y, +value];
    if (this.isHost()) this.pendingTiles.push(op);
    else this.send({ t:'game', k:'mutation', op:op });
  },

  acceptMutation: function(message) {
    var op = message.op, remote = this.remotePlayers[message.from];
    if (!op || !remote || Math.abs(remote.x / TILE - op[1]) > 12 || Math.abs(remote.y / TILE - op[2]) > 12) return;
    this.applyTileOps([op]); this.pendingTiles.push(op);
  },

  applyTileOps: function(ops) {
    if (!game) return;
    this.applying = true;
    for (var i = 0; i < ops.length; i++) {
      var op = ops[i], x = op[1], y = op[2];
      if (!game.world.inBounds(x, y)) continue;
      if (op[0] === 'tile') { game.world.tiles[game.world.idx(x, y)] = op[3]; game.world.hp[game.world.idx(x, y)] = op[3] === T.AIR ? 0 : ((TILE_HARD[op[3]] || [0,40])[1]); }
      else if (op[0] === 'wall') game.world.walls[game.world.idx(x, y)] = op[3];
    }
    game.world.dirty = true; game.world.graveyardCache = null; this.applying = false;
  },

  claimHit: function(e, dmg, boss) {
    if (!this.isClient() || !e || !e.nid) return false;
    this.send({ t:'game', k:'hit', nid:e.nid, dmg:Math.min(5000, Math.max(1, Math.round(dmg))), boss:!!boss });
    return true;
  },

  acceptHit: function(message) {
    var e = this.entityByNid(message.nid), remote = this.remotePlayers[message.from];
    if (!e || !remote || dist(e.x, e.y, remote.x, remote.y) > 900) return;
    var dmg = Math.min(5000, Math.max(1, +message.dmg || 1));
    if (message.boss || e.boss || e.armType) game.hitBoss(e, dmg, 0, 0);
    else hitEntity(e, dmg, 0, 0, game);
  },

  damageRemote: function(player, dmg, kbx) {
    if (!this.isHost() || !player || !player.netId) return false;
    player.hp = Math.max(1, player.hp - Math.max(1, +dmg || 1));
    this.send({ t:'game', k:'damage', to:player.netId, dmg:dmg, kbx:kbx || 0 });
    return true;
  },

  pickupTaken: function(nid, count) { if (this.isClient() && nid) this.send({ t:'game', k:'pickup', nid:nid, count:count }); },
  acceptPickup: function(message) {
    var remote = this.remotePlayers[message.from]; if (!remote) return;
    for (var i = game.pickups.length - 1; i >= 0; i--) {
      var pk = game.pickups[i];
      if (pk.nid === +message.nid && dist(pk.x, pk.y, remote.x, remote.y) < 80) {
        pk.count -= Math.min(pk.count, Math.max(1, +message.count || 1));
        if (pk.count <= 0) game.pickups.splice(i, 1);
        break;
      }
    }
  },

  syncChest: function(chest) { if (this.isClient() && chest) this.send({ t:'game', k:'chest', x:chest.x, y:chest.y, inv:chest.inv }); },
  acceptChest: function(message) {
    var remote = this.remotePlayers[message.from]; if (!remote || dist(remote.x, remote.y, message.x * TILE + 8, message.y * TILE + 8) > 90) return;
    var chest = game.world.chestAt(+message.x, +message.y); if (!chest || !Array.isArray(message.inv)) return;
    chest.inv = message.inv.slice(0, 20); this.send({ t:'game', k:'frame', state:this.frameState() });
  },

  requestBoss: function(id) { if (this.isClient()) { this.send({ t:'game', k:'boss', boss:id }); return true; } return false; },

  saveCharacter: function() {
    if (!game || !game.player || this.isHost()) return;
    try { localStorage.setItem('tree.multiplayer.character.v1', JSON.stringify(this.playerState(true))); } catch (e) {}
  },
  loadCharacter: function() { try { return JSON.parse(localStorage.getItem('tree.multiplayer.character.v1') || 'null'); } catch (e) { return null; } },
  applyCharacter: function(state) {
    var p = game.player; p.x = game.world.spawnX; p.y = game.world.spawnY;
    p.vx = 0; p.vy = 0; p.onGround = false;
    p.maxHp = state.maxHp || 100; p.hp = clamp(state.hp || p.maxHp, 1, p.maxHp); p.maxMana = state.maxMana || 200; p.mana = clamp(state.mana || p.maxMana, 0, p.maxMana);
    p.inventory.slots = state.inventory || p.inventory.slots; p.inventory.armor = state.armor || p.inventory.armor;
    p.inventory.accessories = state.accessories || p.inventory.accessories; p.inventory.dyes = state.dyes || p.inventory.dyes; p.inventory.ammo = state.ammo || null; p.buffs = state.buffs || {};
  },

  hostWorld: function(id) {
    var name = $('mp-name').value, password = $('mp-password').value;
    getWorldRecord(id).then(function(record) {
      if (!record || !record.data) throw new Error('World not found');
      Net.connect({ create:true, worldId:id, worldName:record.name, name:name, password:password });
    }).catch(function(error) { Net.fail(error.message); });
  },
  joinCode: function(code) { this.connect({ create:false, code:String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, ''), name:$('mp-name').value, password:$('mp-password').value }); },

  refreshLobbies: function() {
    var self = this, root = $('lobby-list'); if (!root) return Promise.resolve();
    root.innerHTML = '<div class="world-empty">Looking for hosted worlds...</div>';
    return fetch(this.httpRelay() + '/lobbies', { cache:'no-store', credentials:'omit' }).then(function(response) { if (!response.ok) throw new Error('Lobby service unavailable'); return response.json(); }).then(function(body) {
      var list = body.lobbies || [], html = '';
      if (!list.length) html = '<div class="world-empty">No worlds are being hosted.</div>';
      for (var i = 0; i < list.length; i++) {
        var l = list[i];
        html += '<div class="lobby-row" data-code="' + escapeText(l.code) + '"><div><span class="lobby-code">' + escapeText(l.code) + '</span><span class="lobby-lock">' + (l.locked ? 'PRIVATE' : 'OPEN') + '</span></div><div><div class="world-title">' + escapeText(l.world || 'Hosted World') + '</div><div class="world-meta">' + escapeText(l.name || 'Hosted world') + ' · ' + l.players + '/' + l.max + '</div></div><button class="lobby-join">Join</button></div>';
      }
      root.innerHTML = html;
    }).catch(function(error) { root.innerHTML = '<div class="world-empty">' + escapeText(error.message) + '</div>'; });
  },

  renderRoster: function() {
    var root = $('net-roster'); if (!root) return;
    if (!this.isOnline()) { root.classList.add('hidden'); return; }
    var html = '<b>' + escapeText(this.code) + '</b>';
    for (var id in this.playerNames) html += '<span' + (+id === this.hostId ? ' class="host"' : '') + '>' + escapeText(this.playerNames[id]) + '</span>';
    root.innerHTML = html; root.classList.remove('hidden');
  },
  setStatus: function(text) { var el = $('mp-status'); if (el) el.textContent = text; },
  fail: function(message) {
    if (this.started && this.connectionOptions) { this.scheduleReconnect(); return; }
    this.mode = 'offline';
    this.setStatus(message); $('loading').classList.add('hidden'); $('mainmenu').classList.remove('hidden');
    var title = $('loading').querySelector('h1'); if (title) title.textContent = 'generating world...';
  },
  disconnect: function(showMenu) {
    this.saveCharacter();
    if (this.reconnectTimer) { clearTimeout(this.reconnectTimer); this.reconnectTimer = null; }
    var socket = this.ws; this.mode = 'offline'; this.started = false; this.ws = null; this.id = 0; this.hostId = 0; this.code = ''; this.remotePlayers = {}; this.playerNames = {}; this.connectionOptions = null; this.reconnectAttempts = 0;
    if (game) game.netDisconnected = false;
    if (socket) { try { socket.close(1000, 'left world'); } catch (e) {} }
    this.renderRoster();
    if (showMenu) { $('mainmenu').classList.remove('hidden'); refreshSaveMenu(); this.refreshLobbies(); }
  }
};

function multiplayerTarget(gameRef, source) {
  var best = gameRef.player;
  if (typeof Net === 'undefined' || !Net.isHost() || !source) return best;
  var bestDist = dist(source.x, source.y, best.x, best.y);
  for (var id in Net.remotePlayers) {
    var candidate = Net.remotePlayers[id];
    if (!candidate || candidate.dying) continue;
    var d = dist(source.x, source.y, candidate.x, candidate.y);
    if (d < bestDist) { best = candidate; bestDist = d; }
  }
  return best;
}

try {
  var relayOverride = new URLSearchParams(location.search).get('relay');
  if (relayOverride && /^wss?:\/\//.test(relayOverride)) Net.relay = relayOverride.replace(/\/$/, '');
} catch (e) {}
