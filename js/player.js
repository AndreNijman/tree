// ---------- Player ----------
function Player(world) {
  this.x = world.spawnX;
  this.y = world.spawnY;
  this.w = 22;
  this.h = 32;
  this.vx = 0;
  this.vy = 0;
  this.dir = 1;
  this.hair = 0;
  this.onGround = false;
  this.maxHp = 100;
  this.hp = 100;
  this.maxMana = 20;
  this.mana = 200;
  this.manaRegen = 0;
  this.inventory = new Inventory();
  this.swingT = 0;
  this.swingAng = 0;
  this.attackCd = 0;
  this.magicRampId = null;
  this.magicRamp = 0;
  this.whipSpeedT = 0;
  this.whipSpeedMul = 1;
  this.mineCd = 0;
  this.invuln = 0;
  this.jumps = 0;
  this.flyT = 0;
  this.dying = false;
  this.respawnT = 0;
  this.buffs = {}; // itemId -> remaining seconds
  this.buffDef = 0;
  this.buffMaxHp = 0;
  this.thorns = 0;
  this.mounted = null;   // item id of active mount
  this.mountDef = null;  // ITEMS[mounted]
  this.hook = null;      // { tx, ty, def, retractT } active grappling hook
  this.hookCd = 0;
  this.fishing = null;   // { bobX, bobY, t, waitT, power, rodId } active fishing cast
  this.fishBite = false;
  this.pets = [];        // [{ id, def, x, y, t }]
  this.lightPets = [];   // [{ id, def, x, y, t }]
  this.kite = null;
  this.fallDist = 0;
  this.regenAcc = 0;
  this.torchGodFavor = false;
}

Player.prototype.defense = function() { return this.inventory.defense() + this.buffDef + (this.aegisFruit ? 4 : 0); };

Player.prototype.starterItems = function() {
  var inv = this.inventory;
  inv.slots[0] = { id: I.COPPERPICK, count: 1 };
  inv.slots[1] = { id: I.COPPERSWORD, count: 1 };
  inv.slots[2] = { id: I.COPPERBOW, count: 1 };
  inv.slots[3] = { id: I.ARROW, count: 35 };
  inv.slots[4] = { id: I.TORCH, count: 25 };
  inv.slots[5] = { id: I.HEALINGPOTION, count: 3 };
  inv.selected = 0;
};

Player.prototype.update = function(game) {
  var inv = this.inventory;
  var dt = 1 / 60;
  var eff = inv.accEffects();

  if (this.dying) {
    this.respawnT -= dt;
    this.vx = 0;
    if (this.respawnT <= 0) game.respawn();
    return;
  }

  // input
  var left = KEY['ArrowLeft'] || KEY['a'] || KEY['A'];
  var right = KEY['ArrowRight'] || KEY['d'] || KEY['D'];
  var up = KEY['ArrowUp'] || KEY['w'] || KEY['W'] || KEY[' '] || KEY['Space'];
  var run = KEY['Shift'] || KEY['Control'];

  var inWater = game.world.isWaterAt(this.x, this.y);
  var inLava = game.world.isLavaAt(this.x, this.y);
  var heldItem = inv.selectedItem();
  var heldDef = heldItem ? ITEMS[heldItem.id] : null;

  var mSpeed = this.mountDef ? this.mountDef.mountSpeed : 0;
  var mJump = this.mountDef ? (this.mountDef.mountJump || JUMP_V) : JUMP_V;
  var mFly = this.mountDef ? this.mountDef.mountFly : false;

  var speed = (mSpeed || (run ? RUN_SPEED : WALK_SPEED)) * eff.runSpeed;
  if (left && !right) { this.vx = lerp(this.vx, -speed, 0.25); this.dir = -1; }
  else if (right && !left) { this.vx = lerp(this.vx, speed, 0.25); this.dir = 1; }
  else this.vx = lerp(this.vx, 0, 0.2);

  // jump / wings / swim / mount
  if (this.mounted && mFly) {
    if (up) this.vy = lerp(this.vy, -6, 0.3);
    else this.vy = lerp(this.vy, 2, 0.12);
  } else if (inWater || inLava) {
    if (up) this.vy = -4;
    this.vx *= 0.92;
  } else if (up) {
    // 1 ground jump by default; extra air jumps only from accessories (Cloud in a Bottle, wings).
    var maxJumps = 1 + eff.jumps;
    if (this.onGround) {
      this.vy = mJump * (1 + eff.jumpBonus);
      this.onGround = false;
      this.jumps = 1;
      AudioSys.play('jump');
    } else if (this.jumps < maxJumps && this.vy > -2) {
      this.vy = -7 * (1 + eff.jumpBonus * 0.5);
      this.jumps++;
      AudioSys.play('jump');
    }
    // wing flight: a limited airtime budget that refills on the ground
    if (eff.fly && !this.onGround && this.jumps >= maxJumps && this.flyT > 0) {
      this.flyT -= dt;
      this.vy = lerp(this.vy, -4.5, 0.25);
    }
  }
  if (this.onGround) this.flyT = eff.flyTime;
  if (this.onGround) this.jumps = 0;

  // grappling hook pull
  if (this.hook) {
    var hx = this.hook.tx * TILE + 8, hy = this.hook.ty * TILE + 8;
    var hdx = hx - this.x, hdy = hy - this.y;
    var hd = Math.sqrt(hdx * hdx + hdy * hdy) || 1;
    if (hd > 26) {
      this.vx = (hdx / hd) * this.hook.def.hookPull;
      this.vy = (hdy / hd) * this.hook.def.hookPull;
      this.fallDist = 0;
      this.hook.retractT = 0.15;
    } else {
      this.hook = null;
      this.hookCd = 0.3;
    }
  }

  // fishing bobber
  if (this.fishing) {
    this.fishing.t += dt;
    if (this.fishing.t >= this.fishing.waitT && !this.fishBite) {
      this.fishBite = true;
      game.fx.push({ type: 'splash', x: this.fishing.bobX, y: this.fishing.bobY, t: 0.4, max: 0.4 });
    }
  }

  // pets follow the player
  for (var pi = 0; pi < this.pets.length; pi++) {
    var pet = this.pets[pi];
    pet.t += dt;
    var pdx = this.x - pet.x, pdy = this.y - 16 - pet.y;
    var pd = Math.sqrt(pdx * pdx + pdy * pdy) || 1;
    var pspd = pd > 46 ? 3.5 : 1.6;
    pet.x += (pdx / pd) * pspd + Math.sin(pet.t * 3) * 0.6;
    pet.y += (pdy / pd) * pspd + Math.cos(pet.t * 2.5) * 0.5;
  }
  for (var li = 0; li < this.lightPets.length; li++) {
    var lp = this.lightPets[li];
    lp.t += dt;
    var ldx = this.x - lp.x, ldy = this.y - 30 - lp.y;
    var ld = Math.sqrt(ldx * ldx + ldy * ldy) || 1;
    var lspd = ld > 34 ? 4.5 : 2;
    lp.x += (ldx / ld) * lspd + Math.sin(lp.t * 4) * 0.8;
    lp.y += (ldy / ld) * lspd + Math.cos(lp.t * 3) * 0.6;
  }

  // potion cooldown
  inv.potionCd = Math.max(0, inv.potionCd - dt);

  // buff timers + effects
  var wantMax = 0, buffDef = 0, buffRegen = 0, buffSpeed = 1, buffDmg = 1, buffThorns = 0, buffInvuln = 0;
  for (var bid in this.buffs) {
    var bd = ITEMS[bid];
    if (!bd || !bd.buff) { delete this.buffs[bid]; continue; }
    this.buffs[bid] -= dt;
    if (this.buffs[bid] <= 0) { delete this.buffs[bid]; continue; }
    var b = bd.buff;
    wantMax += b.maxHp || 0;
    buffDef += b.def || 0;
    buffRegen += b.regen || 0;
    buffSpeed *= b.runSpeed || 1;
    buffDmg *= b.dmgMul || 1;
    buffThorns += b.thorns || 0;
    buffInvuln += b.invuln || 0;
  }
  if (wantMax !== this.buffMaxHp) {
    this.maxHp += wantMax - this.buffMaxHp;
    this.buffMaxHp = wantMax;
    if (this.hp > this.maxHp) this.hp = this.maxHp;
  }
  this.buffDef = buffDef;
  if (buffSpeed > 1) eff.runSpeed = eff.runSpeed * buffSpeed;
  if (buffDmg > 1) eff.dmgMul = eff.dmgMul * buffDmg;
  if (buffRegen > 0) eff.regen = (eff.regen || 0) + buffRegen;
  if (this.vitalCrystal) eff.regen = (eff.regen || 0) + 0.2;
  if (buffInvuln > 0) eff.invuln = (eff.invuln || 0) + buffInvuln;
  this.thorns = buffThorns;

  // accessory hp regen
  if (eff.regen > 0) {
    this.regenAcc = (this.regenAcc || 0) + eff.regen / 60;
    while (this.regenAcc >= 1) {
      this.regenAcc -= 1;
      this.hp = Math.min(this.maxHp, this.hp + 1);
    }
  }

  // attack cooldowns
  this.attackCd = Math.max(0, this.attackCd - dt);
  this.mineCd = Math.max(0, this.mineCd - dt);
  if (this.swingT > 0) this.swingT -= dt;
  if (this.whipSpeedT > 0) {
    this.whipSpeedT -= dt;
    if (this.whipSpeedT <= 0) { this.whipSpeedT = 0; this.whipSpeedMul = 1; }
  }

  // physics
  var weatherKind = weatherKindAt(game, this.x, this.y);
  if (!this.hook && (weatherKind === 'blizzard' || weatherKind === 'sandstorm')) {
    this.vx += game.weather.wind * game.weather.intensity * (weatherKind === 'sandstorm' ? 0.08 : 0.045);
  }
  if (heldDef && heldDef.slowFall && this.vy > heldDef.slowFall - GRAVITY) this.vy = heldDef.slowFall - GRAVITY;
  var wasGround = this.onGround;
  physicsStep(this, game, {});
  if ((inWater || inLava) && this.vy > 0) this.vy = Math.min(this.vy, 1.5);
  if (heldDef && heldDef.slowFall && this.vy > heldDef.slowFall) this.vy = heldDef.slowFall;
  if (inLava && !this.buffs[I.OBSIDIANSKINPOTION]) {
    this.damage(40, null, 0);
    if (this.invuln > 0.85) game.spawnFloatingText(this.x, this.y - 24, 'Lava!', '#ff6a32');
  }

  // fall damage
  if (wasGround) this.fallDist = 0;
  else if (this.vy > 0 && !this.hook) this.fallDist += this.vy;
  if (!wasGround && this.onGround) {
    // fallDist accumulates pixels; Terraria's safe fall distance is 25 tiles.
    var fallTiles = this.fallDist / TILE;
    var safeTiles = FALL_SAFE_TILES + eff.fallSafe;
    if (fallTiles > safeTiles && !eff.noFall && !(this.mounted && mFly)) {
      var fdm = Math.round((fallTiles - safeTiles) * FALL_DMG_PER_TILE);
      if (fdm > 0) {
        this.damage(fdm, null, 0);
        game.spawnFloatingText(this.x, this.y - 24, fdm + ' fall damage', '#ff6b6b');
      }
    }
    this.fallDist = 0;
  }
  if (this.hook || eff.noFall || (heldDef && heldDef.slowFall)) this.fallDist = 0;

  // keep in world bounds
  this.x = clamp(this.x, 16, game.world.W * TILE - 16);

  // mana regen
  if (this.mana < this.maxMana) {
    this.manaRegen += dt * 30;
    if (this.manaRegen >= 1) {
      var inc = Math.floor(this.manaRegen);
      this.mana = Math.min(this.maxMana, this.mana + inc);
      this.manaRegen -= inc;
    }
  }

  // invulnerability frames
  if (this.invuln > 0) this.invuln -= dt;

  if (!MOUSE.down) { this.magicRampId = null; this.magicRamp = 0; }

  if (this.kite) {
    var kiteItem = inv.selectedItem();
    if (!kiteItem || kiteItem.id !== this.kite.id || game.panelOpen) this.kite = null;
    else {
      var kiteWind = game.weather && game.weather.windSpeed < 0 ? -1 : 1;
      var kiteStrength = Math.abs(game.weather && game.weather.windSpeed || 0);
      if (MOUSE.right) this.kite.length -= 3;
      else if (MOUSE.down) this.kite.length = Math.min(190, this.kite.length + 1.5);
      if (this.kite.length <= 24) this.kite = null;
      else {
        var kiteTx = this.x + kiteWind * this.kite.length * 0.65;
        var kiteTy = this.y - this.kite.length * (0.55 + Math.min(0.2, kiteStrength / 150));
        this.kite.x = lerp(this.kite.x, kiteTx, 0.08);
        this.kite.y = lerp(this.kite.y, kiteTy, 0.08);
        this.kite.t += dt;
      }
    }
  }

  // --- mouse actions (attack/mine/use/place) ---
  if (MOUSE.down && !game.panelOpen) {
    var item = inv.selectedItem();
    if (item) {
      var id = item.id;
      var def = ITEMS[id];
      if (def.type === 'melee') this.tryMelee(game, def, false, item);
      else if (def.type === 'tool') this.tryMine(game, def, item);
      else if (def.type === 'ranged') this.tryShoot(game, def, id, item);
      else if (def.type === 'magic') this.tryMagic(game, def, id, item);
      else if (def.type === 'consumable') this.tryConsume(game, def, id, item);
      else if (def.type === 'summon') this.trySummon(game, def, id, item);
      else if (def.type === 'summonstaff') this.tryMinion(game, def, id);
      else if (def.type === 'sentrystaff') this.trySentry(game, def, id);
      else if (def.type === 'whip') this.tryWhip(game, def, item);
      else if (def.type === 'block' || def.type === 'bar' || def.type === 'pylon') this.tryPlace(game, id);
      else if (def.type === 'wall') this.tryPlaceWall(game, id);
      else if (def.type === 'hook') this.tryHook(game, def, id);
      else if (def.type === 'mount') this.tryMount(game, def, id);
      else if (def.type === 'fishingrod') this.tryFish(game, def, id, item);
      else if (def.type === 'pet' || def.type === 'lightpet') this.tryPet(game, def, id, item);
      else if (def.type === 'eventitem') this.tryEvent(game, def, id, item);
      else if (def.type === 'purify') this.tryPurify(game, id);
      else if (def.type === 'kite') this.tryKite(game, def, id);
      else if (def.type === 'throwable') this.tryThrowable(game, def, id, item);
      else if (def.type === 'partycake') this.tryPartyCake(game, def, id);
      else if (def.type === 'partygift') this.tryPartyGift(game, def, id);
      else if (def.type === 'releaselantern') this.tryReleaseLantern(game, def, id);
      else if (def.type === 'bait') game.message('Equip a fishing rod and cast into water.');
    }
  }

  // fall into void / too low
  if (this.y > game.world.H * TILE + 60) this.die();
};

Player.prototype.tryKite = function(game, def, id) {
  if (this.kite && this.kite.id === id) return;
  if (!isWindyDayAt(game, this.x, this.y) && Math.abs(this.vx) < 4) {
    game.message('Kites need strong wind or fast movement.');
    return;
  }
  this.kite = { id:id, def:def, x:this.x, y:this.y - 30, length:55, t:0 };
  this.attackCd = 0.2;
  if (isWindyDayAt(game, this.x, this.y)) Achievements.unlock('windyday', game);
};

Player.prototype.tryPartyCake = function(game, def, id) {
  if (this.attackCd > 0) return;
  this.attackCd = 0.4;
  this.buffs[id] = def.buff.t;
  game.message('Sugar Rush! Movement and mining speed increased.');
  AudioSys.play('pickup');
};

Player.prototype.tryPartyGift = function(game, def, id) {
  if (this.attackCd > 0) return;
  this.attackCd = 0.4;
  this.inventory.removeAt(this.inventory.selected, 1);
  if (def.gift === 'pigronata') {
    game.addPickup(this.x, this.y - 20, I.COIN, 4 + Math.floor(Math.random() * 8));
    game.addPickup(this.x, this.y - 20, Math.random() < 0.5 ? I.PARTYSTREAMER : I.SILLYBALLOON, 2 + Math.floor(Math.random() * 4));
  } else {
    var gifts = [I.PARTYHAT, I.PARTYSTREAMER, I.SILLYBALLOON, I.PAPERAIRPLANE, I.WHITEPAPERAIRPLANE];
    game.addPickup(this.x, this.y - 20, gifts[Math.floor(Math.random() * gifts.length)], 1 + Math.floor(Math.random() * 3));
  }
  game.message(def.name + ' burst open!');
  AudioSys.play('break');
};

Player.prototype.tryReleaseLantern = function(game, def, id) {
  if (this.attackCd > 0) return;
  this.attackCd = 0.35;
  this.inventory.removeAt(this.inventory.selected, 1);
  game.fx.push({ type:'releaseLantern', x:this.x, y:this.y - 28, vx:(game.weather ? game.weather.windSpeed : 0) / 80, vy:-0.7, t:16, max:16, color:def.color });
  AudioSys.play('place');
};

Player.prototype.tryThrowable = function(game, def, id, item) {
  if (this.attackCd > 0) return;
  this.attackCd = def.speed;
  var ang = Math.atan2(MOUSE.wy - this.y, MOUSE.wx - this.x);
  this.inventory.removeAt(this.inventory.selected, 1);
  game.projectiles.add({
    x:this.x + Math.cos(ang) * 16, y:this.y - 6 + Math.sin(ang) * 16,
    vx:Math.cos(ang) * 5, vy:Math.sin(ang) * 5,
    dmg:Math.round(def.dmg * this.inventory.damageMultiplier('ranged')), type:def.proj,
    owner:'player', life:5, color:def.color, windAffected:true, recoverItem:id, dead:false
  });
  AudioSys.play('bow');
};

Player.prototype.tryPurify = function(game, id) {
  if (this.attackCd > 0) return;
  var tx = Math.floor(MOUSE.wx / TILE), ty = Math.floor(MOUSE.wy / TILE);
  if (!game.world.inBounds(tx, ty) || dist(this.x, this.y, tx * TILE + 8, ty * TILE + 8) > 6 * TILE) return;
  var changed = 0;
  for (var y = ty - 2; y <= ty + 2; y++) {
    for (var x = tx - 2; x <= tx + 2; x++) {
      var tile = game.world.get(x, y), clean = -1;
      if (tile === T.EBONSTONE || tile === T.CRIMSTONE || tile === T.PEARLSTONE) clean = T.STONE;
      else if (tile === T.CORRUPTGRASS || tile === T.CRIMGRASS || tile === T.HALLOWGRASS) clean = T.GRASS;
      if (clean >= 0) { game.world.set(x, y, clean); changed++; }
    }
  }
  if (!changed) { game.message('There is nothing to purify here.'); return; }
  this.inventory.removeAt(this.inventory.selected, 1);
  this.attackCd = 0.35;
  game.world.dirty = true;
  game.fx.push({ type:'cast', x:tx * TILE + 8, y:ty * TILE + 8, t:0.45, max:0.45 });
  game.message('The land has been purified.');
  AudioSys.play('magic');
};

Player.prototype.tryMine = function(game, def, item) {
  if (this.mineCd > 0) return;
  var range = def.range * TILE;
  var dx = MOUSE.wx - this.x, dy = MOUSE.wy - this.y;
  var d = Math.sqrt(dx * dx + dy * dy);
  if (d > range) return;
  var tx = Math.floor(MOUSE.wx / TILE), ty = Math.floor(MOUSE.wy / TILE);
  if (!game.world.inBounds(tx, ty)) return;
  var t = game.world.get(tx, ty);
  if (t === T.ETERNIASTAND && game.event && game.event.type === 'oldonesarmy' &&
      game.event.standX === tx && game.event.standY === ty) {
    game.message('The active Eternia Crystal Stand cannot be broken.');
    return;
  }
  if (t === T.AIR) {
    if (def.hammer && game.world.wall(tx, ty) === WALL.WOOD) {
      game.world.setWall(tx, ty, WALL.NONE);
      this.inventory.add(I.WOODWALL, 1);
      this.mineCd = 0.12;
      AudioSys.play('break');
      game.spawnMinePuff(tx * TILE + 8, ty * TILE + 8, '#9a6b3f');
      return;
    }
    this.tryMelee(game, def, true); return;
  }
  if (t === T.SHADOWCHEST) {
    var lockedChest = game.world.chestAt(tx, ty);
    if (lockedChest && lockedChest.locked) { game.message('The Shadow Chest is locked.'); return; }
  }
  if ((t === T.SHADOWORB || t === T.CRIMSONHEART || t === T.LARVA) && game.anyBossAlive()) {
    game.message('A boss is already active!');
    return;
  }
  var hard = TILE_HARD[t] || [0, 40];
  if (t === T.ALTAR && !def.hammer) {
    game.message('Only a Pwnhammer can break an Altar!');
    return;
  }
  if (def.power < hard[0]) {
    game.message('Your pickaxe is not strong enough!');
    return;
  }
  var mineMul = 1.5 * (this.buffs[I.SLICEOFCAKE] ? 1.2 : 1) * (this.ambrosia ? 1.05 : 1);
  this.mineCd = Math.max(0, 0.06 - def.speed * mineMul * 0.015);
  var broke = game.world.damageTile(tx, ty, def.power, def.speed * mineMul);
  if (!broke) game.spawnMinePuff(tx * TILE + 8, ty * TILE + 8, tileColor(t));
  if (broke) {
    if (game.onSpecialTileBroken) game.onSpecialTileBroken(t, tx, ty);
    // chest contents spill as pickups
    if (game.world.spilledChestItems) {
      var sp = game.world.spilledChestItems;
      game.world.spilledChestItems = null;
      for (var si = 0; si < sp.length; si++) {
        if (sp[si] && sp[si].id) game.addPickup(tx * TILE + 8, ty * TILE + 8, sp[si].id, sp[si].count, sp[si].reforge);
      }
    }
    // a broken pylon drops its item back
    if (game.world.spilledPylonItem) {
      var pitem = game.world.spilledPylonItem;
      game.world.spilledPylonItem = null;
      game.player.inventory.add(pitem, 1);
      game.spawnFloatingText(tx * TILE + 8, ty * TILE - 4, ITEMS[pitem].name);
      AudioSys.play('break');
      game.fx.push({ type: 'break', x: tx * TILE + 8, y: ty * TILE + 8, color: tileColor(t), t: 0.2 });
    }
    var drop = TILE_DROP[t];
    if (drop) {
      var got = game.player.inventory.add(drop, 1);
      game.spawnFloatingText(tx * TILE + 8, ty * TILE - 4, ITEMS[drop].name);
      AudioSys.play('break');
      game.fx.push({ type: 'break', x: tx * TILE + 8, y: ty * TILE + 8, color: tileColor(t), t: 0.2 });
      if (Achievements) {
        if (drop === I.WOOD) Achievements.unlock('timber', game);
        else if (drop === I.COBALT || drop === I.MYTHRIL || drop === I.ADAMANTITE ||
                 drop === I.IRON || drop === I.PALLADIUM || drop === I.CHLOROPHYTE) {
          Achievements.unlock('miner', game);
          if (drop === I.COBALT) Achievements.unlock('cobalt', game);
          else if (drop === I.MYTHRIL) Achievements.unlock('mythril', game);
          else if (drop === I.ADAMANTITE) Achievements.unlock('adamantite', game);
          else if (drop === I.PALLADIUM) Achievements.unlock('palladium', game);
          else if (drop === I.CHLOROPHYTE) Achievements.unlock('chlorophyte', game);
        }
      }
    }
  } else {
    AudioSys.play('mine');
    game.spawnMinePuff(tx * TILE + 8, ty * TILE + 8);
  }
};

Player.prototype.tryMelee = function(game, def, force, item) {
  if (this.attackCd > 0) return;
  if (this.swingT > 0) return;
  if (def.meleeMode === 'yoyo' || def.meleeMode === 'controlled') {
    for (var yi = 0; yi < game.projectiles.list.length; yi++) {
      var yp = game.projectiles.list[yi];
      if (!yp.dead && ((def.meleeMode === 'yoyo' && yp.yoyo) || (def.meleeMode === 'controlled' && yp.controlled)) && yp.sourcePlayer === this) return;
    }
  }
  this.attackCd = def.speed;
  this.swingT = Math.max(0.12, def.speed * 0.7);
  if (crit) game.spawnFloatingText(this.x, this.y - 30, 'Critical!', '#ffe14d');
  this.dir = (MOUSE.wx >= this.x) ? 1 : -1;
  this.swingAng = Math.atan2(MOUSE.wy - this.y, MOUSE.wx - this.x);
  AudioSys.play('shoot');
  var crit = Math.random() < 0.04;
  var mdmg = Math.round(def.dmg * this.inventory.damageMultiplier('melee') * this.inventory.itemDamageMul(item));
  if (crit) mdmg *= 2;
  if (def.nearbyBonus) {
    var ncnt = 0, nr = (def.nearbyRadius || 96) * (def.nearbyRadius || 96);
    for (var ni = 0; ni < game.entities.length; ni++) {
      var ne = game.entities[ni];
      if (ne.dead || ne.dmg <= 0) continue;
      var ndx = ne.x - this.x, ndy = ne.y - this.y;
      if (ndx * ndx + ndy * ndy < nr) ncnt++;
    }
    mdmg = Math.round(mdmg * (1 + def.nearbyBonus * Math.min(ncnt, def.nearbyMax || 6)));
  }
  var reach = def.range * TILE + 10;
  var cx = this.x + Math.cos(this.swingAng) * 14;
  var cy = this.y + Math.sin(this.swingAng) * 14;
  // hit enemies in arc
  if (!def.projectileOnly) {
    for (var i = 0; i < game.entities.length; i++) {
      var e = game.entities[i];
      if (e.ooaSentry) continue;
      if (e.dead || e.dmg <= 0) continue;
      var dx = e.x - cx, dy = e.y - cy;
      if (dx * dx + dy * dy < reach * reach) {
        var ang = Math.atan2(e.y - this.y, e.x - this.x);
        var da = Math.abs(angDiff(this.swingAng, ang));
        if (da < 1.5) {
          var kbForce = (def.kb || 4) * 0.8;
          var kbx = Math.cos(this.swingAng) * kbForce, kby = Math.sin(this.swingAng) * kbForce * 0.5 - 1;
          if (e.boss) game.hitBoss(e, mdmg, kbx, kby);
          else hitEntity(e, mdmg, kbx, kby, game);
          game.fx.push({ type:'slash', x:e.x, y:e.y, t:0.15 });
        }
      }
    }
  }
  if (def.meleeProj !== undefined && (def.projChance === undefined || Math.random() < def.projChance)) {
    var count = def.projCount || 1;
    for (var pi = 0; pi < count; pi++) {
      var pang = this.swingAng + (pi - (count - 1) / 2) * (def.projSpread || 0);
      game.projectiles.add({
        x:this.x + Math.cos(pang) * 18, y:this.y - 6 + Math.sin(pang) * 18,
        vx:Math.cos(pang) * (def.projSpeed || 8), vy:Math.sin(pang) * (def.projSpeed || 8),
        dmg:Math.max(1, Math.round(mdmg * (def.projDamageMul || 1))), type:def.meleeProj, owner:'player',
        life:def.meleeMode === 'controlled' ? 8 : (def.meleeMode === 'spear' ? def.spearDuration : (def.meleeMode === 'flail' ? def.flailDuration : (def.meleeMode === 'yoyo' ? def.yoyoDuration : (def.projLife || 1.5)))),
        homing:!!def.projHoming, bounces:def.projBounces || 0, returnAt:def.projReturn, returnSpeed:def.returnSpeed || 10,
        persistent:!!def.persistentProj, sourcePlayer:this, hitEnemies:[], lifeSteal:def.lifeSteal || 0, color:def.color, melee:true,
        explosive:def.explosive || 0, gravity:def.projGravity || 0,
        spear:def.meleeMode === 'spear', spearAng:pang, spearReach:def.range * TILE + 10, spearDuration:def.spearDuration,
        flail:def.meleeMode === 'flail', flailAng:pang, flailReach:def.range * TILE + 12, flailDuration:def.flailDuration,
        yoyo:def.meleeMode === 'yoyo', yoyoReach:def.range * TILE + 18, yoyoDuration:def.yoyoDuration,
        yoyoExtraProj:def.yoyoExtraProj, extraInterval:def.extraInterval, extraProjSpeed:def.extraProjSpeed,
        controlled:def.meleeMode === 'controlled', controlledReach:(def.controlledReach || def.range) * TILE, controlledSpeed:def.controlledSpeed || 8,
        splitOnHit:def.splitOnHit, splitCount:def.splitCount, splitSpeed:def.splitSpeed, splitDamageMul:def.splitDamageMul, splitHoming:def.splitHoming,
        extraDamageMul:def.extraDamageMul, tether:def.meleeMode === 'flail' || def.meleeMode === 'yoyo',
        hitCooldown:def.meleeMode === 'yoyo' || def.meleeMode === 'controlled' ? 0.35 : 0, dead:false
      });
    }
    if (def.spearExtraProj !== undefined) {
      game.projectiles.add({
        x:this.x + Math.cos(this.swingAng) * 20, y:this.y - 6 + Math.sin(this.swingAng) * 20,
        vx:Math.cos(this.swingAng) * (def.extraProjSpeed || 7), vy:Math.sin(this.swingAng) * (def.extraProjSpeed || 7),
        dmg:Math.max(1, Math.round(mdmg * (def.extraDamageMul || 0.5))), type:def.spearExtraProj, owner:'player', life:1.2,
        bounces:def.extraBounces || 0, color:def.color, melee:true, dead:false
      });
    }
    if (def.flailExtraProj !== undefined) {
      var extraCount = def.extraProjCount || 1;
      for (var ei = 0; ei < extraCount; ei++) {
        var eang = this.swingAng + (ei - (extraCount - 1) / 2) * 0.18;
        game.projectiles.add({
          x:this.x + Math.cos(eang) * 20, y:this.y - 6 + Math.sin(eang) * 20,
          vx:Math.cos(eang) * (def.extraProjSpeed || 6), vy:Math.sin(eang) * (def.extraProjSpeed || 6),
          dmg:Math.max(1, Math.round(mdmg * (def.extraDamageMul || 0.5))), type:def.flailExtraProj, owner:'player', life:1.4,
          homing:!!def.extraProjHoming, color:def.color, melee:true, dead:false
        });
      }
    }
  }
  if (def.meleeRainProj !== undefined) {
    var rainX = MOUSE.wx + (Math.random() - 0.5) * 24;
    game.projectiles.add({
      x:rainX, y:MOUSE.wy - 180, vx:0, vy:9,
      dmg:Math.max(1, Math.round(mdmg * (def.rainDamageMul || 0.7))), type:def.meleeRainProj,
      owner:'player', life:2, color:def.color, melee:true, dead:false
    });
  }
  // also break weak blocks on swing (leaves, cobweb, torch)
  if (force) {
    var tx = Math.floor(MOUSE.wx / TILE), ty = Math.floor(MOUSE.wy / TILE);
    var t = game.world.get(tx, ty);
    if (t === T.LEAVES || t === T.COBWEB || t === T.TORCH) {
      game.world.breakTile(tx, ty);
    }
  }
};

Player.prototype.tryShoot = function(game, def, id, item) {
  if (this.attackCd > 0) return;
  var inv = this.inventory;
  if (def.piranha) {
    this.attackCd = def.speed;
    var pang = Math.atan2(MOUSE.wy - this.y, MOUSE.wx - this.x);
    var pdmg = Math.round(def.dmg * inv.damageMultiplier('ranged') * inv.itemDamageMul(item));
    game.projectiles.add({
      x: this.x + Math.cos(pang) * 18, y: this.y - 6 + Math.sin(pang) * 18,
      vx: Math.cos(pang) * 9, vy: Math.sin(pang) * 9,
      dmg: pdmg, type: def.proj, owner: 'player', life: def.piranhaRange / 10,
      piranha: true, piranhaDmgPerPulse: pdmg, piranhaRange: def.piranhaRange || 300,
      piranhaInterval: def.piranhaInterval || 0.25, sourcePlayer: this,
      color: def.color, dead: false
    });
    AudioSys.play('bow');
    return;
  }
  var ammoId = inv.ammoFor(def.ammo);
  if (!ammoId) { game.message('Out of compatible ammo!'); return; }
  this.attackCd = def.speed;
  var ang = Math.atan2(MOUSE.wy - this.y, MOUSE.wx - this.x);
  inv.consume(ammoId, 1);
  var ammoDef = ITEMS[ammoId];
  var ammoDmg = ammoDef.dmg || 0;
  var shots = Math.max(1, def.spread || 1);
  var crit = Math.random() < 0.04;
  var shotDmg = Math.round((def.dmg + ammoDmg) * inv.damageMultiplier('ranged') * inv.itemDamageMul(item));
  if (crit) shotDmg *= 2;
  if (def.terrainMode === 'rain') {
    for (var ri = 0; ri < shots; ri++) {
      var rainOffset = (ri - (shots - 1) / 2) * 22;
      game.projectiles.add({
        x:MOUSE.wx + rainOffset, y:MOUSE.wy - (def.terrainHeight || 180) - Math.abs(rainOffset) * 0.25,
        vx:rainOffset * -0.015, vy:9, dmg:shotDmg, type:def.proj, ammo:ammoId,
        owner:'player', life:2.2, color:ammoDef.color, bounces:def.projBounces || ammoDef.bounces || 0,
        homing:!!(def.projHoming || ammoDef.homing), explosive:def.explosive || ammoDef.explosive || 0,
        status:def.status || ammoDef.status, gravity:def.projGravity || 0, mine:!!def.projMine, mineTrigger:def.mineTrigger, mineDuration:def.mineDuration, dead:false
      });
    }
    AudioSys.play('bow');
    return;
  }
  for (var i = 0; i < shots; i++) {
    var shotAng = ang + (i - (shots - 1) / 2) * (def.spreadAngle || 0.08);
    game.projectiles.add({
      x: this.x + Math.cos(shotAng) * 18, y: this.y - 6 + Math.sin(shotAng) * 18,
      dmg: shotDmg, type: def.batAmmo ? P.BAT : def.proj, ammo: ammoId, owner: 'player', life: 2,
      vx: Math.cos(shotAng) * (def.projSpeed || 9), vy: Math.sin(shotAng) * (def.projSpeed || 9),
      bounces:def.projBounces || ammoDef.bounces || 0, homing:def.batAmmo ? true : !!(def.projHoming || ammoDef.homing),
      explosive:def.explosive || ammoDef.explosive || 0, gravity:def.projGravity || 0,
      status:def.status || ammoDef.status, mine:!!def.projMine, mineTrigger:def.mineTrigger, mineDuration:def.mineDuration, color:ammoDef.color, spawnSphere:!!def.electro, dead: false
    });
  }
  if (crit) game.spawnFloatingText(this.x, this.y - 30, 'Critical!', '#ffe14d');
  AudioSys.play('bow');
};

Player.prototype.tryMagic = function(game, def, id, item) {
  if (this.attackCd > 0) return;
  if (def.magicMode === 'beam' || def.magicMode === 'controlled') {
    for (var bi = 0; bi < game.projectiles.list.length; bi++) {
      var bp = game.projectiles.list[bi];
      if (!bp.dead && bp.sourcePlayer === this && ((def.magicMode === 'beam' && bp.channelBeam) || (def.magicMode === 'controlled' && bp.controlledMagic))) return;
    }
  }
  var eff = this.inventory.accEffects();
  var cost = Math.ceil(def.mana * eff.manaMul);
  if (this.mana < cost) { game.message('Not enough mana!'); return; }
  if (def.magicRamp) {
    if (this.magicRampId !== id) { this.magicRampId = id; this.magicRamp = 0; }
    this.attackCd = Math.max(def.rampMin || 0.05, def.speed - this.magicRamp * (def.rampStep || 0.01));
    this.magicRamp++;
  } else this.attackCd = def.speed;
  this.mana -= cost;
  var ang = Math.atan2(MOUSE.wy - this.y, MOUSE.wx - this.x);
  var n = def.projCount || 1;
  var crit = Math.random() < 0.04;
  var mdmg = Math.round(def.dmg * this.inventory.damageMultiplier('magic') * this.inventory.itemDamageMul(item));
  if (crit) mdmg *= 2;
  if (def.magicMode === 'beam') {
    game.projectiles.add({
      x:this.x, y:this.y - 8, vx:Math.cos(ang), vy:Math.sin(ang), dmg:mdmg, type:def.proj,
      owner:'player', life:30, channelBeam:true, sourcePlayer:this, beamRange:def.channelRange * TILE,
      manaCost:cost, manaInterval:def.channelManaInterval || 0.12, manaT:def.channelManaInterval || 0.12,
      persistent:true, hitCooldown:def.hitCooldown || 0.12, lifeSteal:def.lifeSteal || 0,
      beamStyle:def.beamStyle || 'prism', color:def.color, dead:false
    });
    AudioSys.play('magic');
    return;
  }
  if (def.magicMode === 'controlled') {
    game.projectiles.add({
      x:this.x + Math.cos(ang) * 18, y:this.y - 8 + Math.sin(ang) * 18,
      vx:Math.cos(ang) * def.controlledSpeed, vy:Math.sin(ang) * def.controlledSpeed,
      dmg:mdmg, type:def.proj, owner:'player', life:def.controlledDuration, controlled:true,
      controlledMagic:true, controlledReach:def.controlledReach * TILE, controlledSpeed:def.controlledSpeed,
      sourcePlayer:this, color:def.color, magic:true, dead:false
    });
    AudioSys.play('magic');
    return;
  }
  if (def.magicMode === 'cloud' || def.magicMode === 'sphere' || def.magicMode === 'wall' || def.magicMode === 'trail') {
    var deployed = [];
    for (var di = 0; di < game.projectiles.list.length; di++) {
      var dp = game.projectiles.list[di];
      if (!dp.dead && dp.deployMode === (def.magicMode === 'trail' ? 'wall' : def.magicMode) && dp.deployKey === id && dp.sourcePlayer === this) deployed.push(dp);
    }
    if (deployed.length >= (def.deployCount || 1)) deployed[0].dead = true;
    var deployAng = Math.atan2(MOUSE.wy - (this.y - 8), MOUSE.wx - this.x);
    var deployX = def.magicMode === 'sphere' ? this.x + Math.cos(deployAng) * 18 : MOUSE.wx;
    var deployY = def.magicMode === 'sphere' ? this.y - 8 + Math.sin(deployAng) * 18 : MOUSE.wy;
    var deployMode = def.magicMode === 'trail' ? 'wall' : def.magicMode;
    game.projectiles.add({
      x:deployX, y:deployY, vx:def.magicMode === 'sphere' ? Math.cos(deployAng) * 2.5 : 0,
      vy:def.magicMode === 'sphere' ? Math.sin(deployAng) * 2.5 : 0, dmg:mdmg, type:def.proj,
      owner:'player', life:def.deployDuration, deployMode:deployMode, deployInterval:def.deployInterval,
      deployProj:def.deployProj, zoneHeight:(def.zoneHeight || 0) * TILE, sourcePlayer:this,
      deployKey:id, deployDamageMul:def.deployDamageMul || 1, deployHoming:!!def.deployHoming,
      persistent:def.magicMode === 'wall' || def.magicMode === 'trail', hitCooldown:def.hitCooldown || 0, color:def.color, dead:false,
      trailWall:def.magicMode === 'trail', magic:true
    });
    AudioSys.play('magic');
    return;
  }
  if (def.terrainMode === 'rain' || def.terrainMode === 'erupt') {
    var terrainCount = def.terrainCount || n;
    for (var ti = 0; ti < terrainCount; ti++) {
      var terrainOffset = (ti - (terrainCount - 1) / 2) * 24;
      var raining = def.terrainMode === 'rain';
      game.projectiles.add({
        x:MOUSE.wx + terrainOffset, y:MOUSE.wy + (raining ? -(def.terrainHeight || 180) : (def.terrainHeight || 80)),
        vx:terrainOffset * (raining ? -0.01 : 0.008), vy:raining ? 9 : -8,
        dmg:mdmg, type:def.proj, owner:'player', life:2.2, ignoreTiles:!raining || id === I.LUNARFLARE,
        color:def.color, magic:true, dead:false
      });
    }
    if (crit) game.spawnFloatingText(this.x, this.y - 30, 'Critical!', '#ffe14d');
    AudioSys.play('magic');
    game.fx.push({ type:'cast', x:this.x, y:this.y - 6, t:0.2 });
    return;
  }
  for (var i = 0; i < n; i++) {
    var spread = (i - (n - 1) / 2) * 0.22;
    if (def.magicRamp) spread += (Math.random() - 0.5) * Math.max(0.02, 0.16 - this.magicRamp * 0.012);
    game.projectiles.add({
      x: this.x + Math.cos(ang) * 16, y: this.y - 4 + Math.sin(ang) * 16,
      vx: Math.cos(ang + spread) * (def.projSpeed || 8), vy: Math.sin(ang + spread) * (def.projSpeed || 8),
      dmg: mdmg, type: def.proj, owner: 'player', life: def.projLife || 1.6, bounces:def.projBounces || 0,
      accel:def.projAccel || 0, maxSpeed:def.projMaxSpeed || 0,
      persistent:!!def.projPersistent, hitCooldown:def.hitCooldown || 0, hitEnemies:[], color:def.color,
      status:def.status, dead: false, homing:!!def.projHoming
    });
  }
  AudioSys.play('magic');
  game.fx.push({ type:'cast', x:this.x, y:this.y - 6, t:0.2 });
};

Player.prototype.tryConsume = function(game, def, id, item) {
  if (this.attackCd > 0) return;
  if (def.permanent) {
    if (this[def.permanent]) { game.message('This permanent blessing is already active.'); return; }
    this[def.permanent] = true;
    this.inventory.removeAt(this.inventory.selected, 1);
    this.attackCd = 0.4;
    AudioSys.play('pickup');
    game.spawnFloatingText(this.x, this.y - 26, def.name + '!', def.color);
    game.message(def.permanentMsg || 'A permanent blessing settles over you.');
    return;
  }
  if (def.star) {
    if (this.maxMana >= 200) { game.message('Your mana is already at its peak.'); return; }
    this.maxMana = Math.min(200, this.maxMana + def.star);
    this.mana = Math.min(this.maxMana, this.mana + def.star);
    this.inventory.removeAt(this.inventory.selected, 1);
    AudioSys.play('magic');
    game.fx.push({ type:'star', x:this.x, y:this.y - 20, t:0.6 });
    game.spawnFloatingText(this.x, this.y - 26, 'Mana increased!', '#6bc8ff');
    if (Achievements && this.maxMana >= 200) Achievements.unlock('starpower', game);
    return;
  }
  if (def.heart) {
    var lifeFruit = id === I.LIFEFRUIT;
    if (lifeFruit) {
      var b = game.bossesDefeated;
      if (!game.hardmode || !(b.twins || b.destroyer || b.skelprime)) { game.message('Life Fruit ripens after a mechanical boss falls.'); return; }
      if (this.maxHp < 400) { game.message('Reach 400 health with Heart Crystals first.'); return; }
      if (this.maxHp >= 500) return;
    } else if (this.maxHp >= 400) return;
    var cap = lifeFruit ? 500 : 400;
    this.maxHp = Math.min(cap, this.maxHp + def.heart);
    this.hp = Math.min(this.maxHp, this.hp + def.heart);
    this.inventory.removeAt(this.inventory.selected, 1);
    AudioSys.play('potion');
    game.fx.push({ type:'heart', x:this.x, y:this.y - 20, t:0.6 });
    if (Achievements && lifeFruit) Achievements.unlock('lifefruit', game);
    else if (Achievements && this.maxHp >= 400) Achievements.unlock('maxhp', game);
    return;
  }
  if (def.heal) {
    if (this.inventory.potionCd > 0) { game.message('Potion on cooldown!'); return; }
    if (this.hp >= this.maxHp) { game.message('Health is full.'); return; }
    this.hp = Math.min(this.maxHp, this.hp + def.heal);
    if (def.buff) this.buffs[id] = def.buff.t;
    this.inventory.removeAt(this.inventory.selected, 1);
    this.inventory.potionCd = 60;
    AudioSys.play('potion');
    game.fx.push({ type:'heal', x:this.x, y:this.y - 24, t:0.6 });
    return;
  }
  if (def.mana) {
    if (this.mana >= this.maxMana) { game.message('Mana is full.'); return; }
    this.mana = Math.min(this.maxMana, this.mana + def.mana);
    this.inventory.removeAt(this.inventory.selected, 1);
    AudioSys.play('potion');
    return;
  }
  if (def.crate) {
    this.inventory.removeAt(this.inventory.selected, 1);
    var loot = openCrate(def.crate);
    for (var i = 0; i < loot.length; i++) this.inventory.add(loot[i].id, loot[i].count);
    game.message('You opened a crate!');
    AudioSys.play('pickup');
    return;
  }
  if (def.buff) {
    this.buffs[id] = def.buff.t;
    this.inventory.removeAt(this.inventory.selected, 1);
    this.attackCd = 0.4;
    AudioSys.play('potion');
    game.spawnFloatingText(this.x, this.y - 26, def.name + '!', def.color);
    if (Achievements) Achievements.unlock('buffed', game);
    return;
  }
};

Player.prototype.trySummon = function(game, def, id, item) {
  if (this.attackCd > 0) return;
  if (game.anyBossAlive()) { game.message('A boss is already active!'); return; }
  var biome = game.world.biomeAt(this.x, this.y);
  var night = game.timeOfDay < 0.25 || game.timeOfDay > 0.75;
  if ((def.boss === 'eyeofcthulhu' || def.boss === 'skeletron' || def.boss === 'twins' ||
       def.boss === 'destroyer' || def.boss === 'skeletronprime') && !night) {
    game.message('This summon can only be used at night.');
    return;
  }
  if ((def.boss === 'twins' || def.boss === 'destroyer' || def.boss === 'skeletronprime') && !game.hardmode) {
    game.message('Mechanical bosses can only be summoned in Hardmode.');
    return;
  }
  if (def.boss === 'eaterofworlds' && (game.world.evil !== 'corrupt' || biome !== BIOME.CORRUPT)) {
    game.message('Worm Food must be used in this world\'s Corruption.');
    return;
  }
  if (def.boss === 'brainofcthulhu' && (game.world.evil !== 'crimson' || biome !== BIOME.CRIMSON)) {
    game.message('The Bloody Spine must be used in this world\'s Crimson.');
    return;
  }
  if (def.boss === 'queenbee' && biome !== BIOME.JUNGLE) {
    game.message('The Abeemination must be used in the Jungle.');
    return;
  }
  if (def.boss === 'deerclops' && biome !== BIOME.SNOW && biome !== BIOME.UNDERSNOW) {
    game.message('The Deer Thing must be used in the Snow biome.');
    return;
  }
  if (def.boss === 'queenslime' && (!game.hardmode || biome !== BIOME.HALLOW)) {
    game.message('Queen Slime can only awaken in the Hardmode Hallow.');
    return;
  }
  if (def.boss === 'duke' && (!game.hardmode || biome !== BIOME.OCEAN)) {
    game.message('The Truffle Worm must be used at the Ocean in Hardmode.');
    return;
  }
  if (def.boss === 'empress' && (!game.hardmode || biome !== BIOME.HALLOW)) {
    game.message('The Prismatic Lens must be used in the Hardmode Hallow.');
    return;
  }
  if (def.boss === 'wallofflesh' && game.world.biomeAt(this.x, this.y) !== BIOME.UNDERWORLD) {
    game.message('The Guide Voodoo Doll must be used in the Underworld.');
    return;
  }
  if (def.boss === 'golem') {
    if (!game.hardmode || !game.bossesDefeated.plantera) {
      game.message('Plantera must be defeated before the Power Cell will awaken.');
      return;
    }
    if (game.world.biomeAt(this.x, this.y) !== BIOME.TEMPLE) {
      game.message('The Lihzahrd Power Cell must be used inside the Temple.');
      return;
    }
  }
  if (def.boss === 'moonlord') {
    if (!game.pillarsSpawned || game.pillarsDestroyed < 4) {
      game.message('The Moon Lord is sealed by the Celestial Pillars!');
      return;
    }
  }
  this.attackCd = 0.5;
  this.inventory.removeAt(this.inventory.selected, 1);
  var p = this;
  game.message('A terrifying presence awakens...');
  setTimeout(function() { game.spawnBoss(def.boss); }, 800);
};

Player.prototype.tryMinion = function(game, def, id) {
  if (this.attackCd > 0) return;
  this.attackCd = 0.6;
  var m = spawnMinion(game, def);
  if (m) {
    AudioSys.play('spawn');
    game.fx.push({ type: 'cast', x: this.x, y: this.y - 6, t: 0.3, max: 0.3 });
    game.message('Summoned a minion.');
    if (Achievements) Achievements.unlock('summoner', game);
  } else {
    game.message('You cannot summon more minions!');
  }
};

Player.prototype.tryWhip = function(game, def, item) {
  if (this.attackCd > 0) return;
  this.attackCd = (def.cd || def.speed || 0.35) * (this.whipSpeedT > 0 ? this.whipSpeedMul : 1);
  this.swingT = 0.25;
  var x0 = this.x + this.dir * 14, y0 = this.y - 10;
  var ang = Math.atan2(MOUSE.wy - y0, MOUSE.wx - x0);
  var reach = def.reach || def.range * TILE * 2 + 30;
  var tip = { x: x0 + Math.cos(ang) * reach, y: y0 + Math.sin(ang) * reach };
  game.fx.push({ type: 'whip', x: x0, y: y0, tx: tip.x, ty: tip.y, t: 0.18, max: 0.18 });
  AudioSys.play('bow');
  var dmg = def.dmg * this.inventory.damageMultiplier('summon') * this.inventory.itemDamageMul(item);
  var hitAny = false;
  var boltSpawned = false;
  for (var i = 0; i < game.entities.length; i++) {
    var e = game.entities[i];
    if (e.dead || e.hp <= 0 || e.ooaSentry) continue;
    var near = distPointSeg(e.x, e.y, x0, y0, tip.x, tip.y) < (e.w + 30) / 2;
    if (!near) continue;
    if (e.boss) {
      hitAny = true;
      game.hitBoss(e, dmg, Math.cos(ang) * 4, Math.sin(ang) * 4);
      e.whipped = def.tagDuration || 4;
      e.whipTag = def.tagDamage || 0;
      e.whipBurst = def.tagExplosive || 0;
      e.whipSplash = def.tagSplash || 0;
    } else if (e.dmg > 0) {
      hitAny = true;
      hitEntity(e, dmg, Math.cos(ang) * 4, Math.sin(ang) * 4, game);
      e.whipped = def.tagDuration || 4;
      e.whipTag = def.tagDamage || 0;
      e.whipBurst = def.tagExplosive || 0;
      e.whipSplash = def.tagSplash || 0;
    }
    if ((e.boss || e.dmg > 0) && def.whipBolt !== undefined && !boltSpawned) {
      boltSpawned = true;
      game.projectiles.add({
        x:tip.x, y:tip.y, vx:Math.cos(ang) * 6, vy:Math.sin(ang) * 6,
        dmg:Math.max(1, Math.round(dmg * (def.whipBoltDamage || 0.5))), type:def.whipBolt,
        owner:'player', life:1.4, homing:true, color:def.color, dead:false
      });
    }
  }
  if (hitAny && def.whipSpeedMul) {
    this.whipSpeedT = 4;
    this.whipSpeedMul = def.whipSpeedMul;
  }
  if (hitAny && Achievements) Achievements.unlock('whip', game);
};

Player.prototype.tryPlace = function(game, id) {
  var def = ITEMS[id];
  var tile = def.tile;
  if (tile === undefined) return;
  var tx = Math.floor(MOUSE.wx / TILE), ty = Math.floor(MOUSE.wy / TILE);
  if (!game.world.inBounds(tx, ty)) return;
  if (def.type === 'pylon' && game.world.biomeAt(MOUSE.wx, MOUSE.wy) === BIOME.UNDERWORLD) {
    game.message('Pylons cannot be placed in the Underworld.');
    return;
  }
  var cur = game.world.get(tx, ty);
  if (cur !== T.AIR) {
    // try adjacent
    var dxs = [0, 0, -1, 1], dys = [-1, 1, 0, 0];
    var placed = false;
    for (var i = 0; i < 4; i++) {
      var ax = tx + dxs[i], ay = ty + dys[i];
      if (!game.world.inBounds(ax, ay)) continue;
      if (game.world.get(ax, ay) === T.AIR && !game.world.overlapsPlayer(ax, ay, this)) {
        this.doPlace(game, id, ax, ay);
        placed = true;
        break;
      }
    }
    return;
  }
  if (game.world.overlapsPlayer(tx, ty, this)) return;
  this.doPlace(game, id, tx, ty);
};

Player.prototype.tryPlaceWall = function(game, id) {
  if (this.mineCd > 0) return;
  var def = ITEMS[id], tx = Math.floor(MOUSE.wx / TILE), ty = Math.floor(MOUSE.wy / TILE);
  if (!def || def.wall === undefined || !game.world.inBounds(tx, ty)) return;
  if (dist(this.x, this.y, tx * TILE + 8, ty * TILE + 8) > 6 * TILE) return;
  if (game.world.wall(tx, ty) !== WALL.NONE) { game.message('A background wall is already here.'); return; }
  game.world.setWall(tx, ty, def.wall);
  this.inventory.removeAt(this.inventory.selected, 1);
  this.mineCd = 0.08;
  AudioSys.play('place');
  game.fx.push({ type:'break', x:tx * TILE + 8, y:ty * TILE + 8, color:def.color, t:0.12 });
};

Player.prototype.doPlace = function(game, id, tx, ty) {
  var def = ITEMS[id];
  var item = this.inventory.selectedItem();
  if (!item) return;
  if (def.tile === undefined) return;
  if ((def.tile === T.TOMBSTONE || def.tile === T.SUNFLOWER) && !game.world.isSolid(tx, ty + 1) && !game.world.isPlatform(tx, ty + 1)) {
    game.message(def.name + ' needs solid ground.');
    return;
  }
  if (def.tile === T.ETERNIASTAND && !game.world.isSolid(tx, ty + 1) && !game.world.isPlatform(tx, ty + 1)) {
    game.message('The Eternia Crystal Stand needs solid support.');
    return;
  }
  game.world.set(tx, ty, def.tile);
  this.inventory.removeAt(this.inventory.selected, 1);
  if (def.type === 'pylon') {
    game.world.addPylon(tx, ty, id);
    game.message('Pylon placed. Place another linked pylon to teleport.');
  }
  AudioSys.play('place');
  game.fx.push({ type:'break', x:tx * TILE + 8, y:ty * TILE + 8, color:def.color, t:0.12 });
  if (def.tile === T.TORCH && game.checkTorchGod) game.checkTorchGod(tx, ty);
};

// ---------- Grappling hooks ----------
Player.prototype.tryHook = function(game, def, id) {
  if (this.hook) {
    // release current hook
    this.hook = null;
    this.hookCd = 0.3;
    return;
  }
  if (this.attackCd > 0 || this.hookCd > 0) return;
  this.attackCd = 0.3;
  var r = def.hookRange || 300;
  var dx = MOUSE.wx - this.x, dy = MOUSE.wy - this.y;
  var d = Math.sqrt(dx * dx + dy * dy) || 1;
  var ux = dx / d, uy = dy / d;
  var tx = -1, ty = -1;
  for (var step = 8; step <= r; step += 4) {
    var px = this.x + ux * step, py = this.y + uy * step - 4;
    if (game.world.solidAt(px, py)) {
      tx = Math.floor(px / TILE);
      ty = Math.floor(py / TILE);
      break;
    }
  }
  if (tx < 0) { game.message('Nothing to latch onto!'); return; }
  this.hook = { tx: tx, ty: ty, def: def, retractT: 0 };
  AudioSys.play('shoot');
};

// ---------- Mounts ----------
Player.prototype.tryMount = function(game, def, id) {
  if (this.attackCd > 0) return;
  this.attackCd = 0.3;
  if (this.mounted === id) {
    this.mounted = null;
    this.mountDef = null;
    game.message('You dismounted.');
    return;
  }
  this.mounted = id;
  this.mountDef = def;
  this.fallDist = 0;
  game.message('You mounted the ' + def.name + '.');
  game.fx.push({ type: 'cast', x: this.x, y: this.y - 6, t: 0.3, max: 0.3 });
  AudioSys.play('spawn');
};

// ---------- Fishing ----------
Player.prototype.tryFish = function(game, def, id, item) {
  if (this.fishing) {
    // reel in the catch
    var f = this.fishing;
    this.fishing = null;
    this.attackCd = 0.4;
    if (this.fishBite) {
      this.fishBite = false;
      var bloodFishing = game.event && game.event.type === 'bloodmoon';
      var encounterChance = f.rodId === I.CHUMCASTER ? 0.55 : 0.35;
      if (bloodFishing && Math.random() < encounterChance) {
        var roll = Math.random();
        var enemyType = bloodFishingEnemy(game, roll);
        var hooked = spawnEntity(game, enemyType, f.bobX, f.bobY - 12);
        if (enemyType === E.BLOODEEL) initSegments(hooked, game, 6, '#8f182f');
        hooked.eventEnemy = true;
        game.message(ENT_DEF[enemyType].name + ' was hooked!');
        AudioSys.play('spawn');
      } else {
        var catchId = rollFish(game, f);
        this.inventory.add(catchId, 1);
        game.message('You caught a ' + ITEMS[catchId].name + '!');
        AudioSys.play('pickup');
      }
      game.fx.push({ type: 'splash', x: f.bobX, y: f.bobY, t: 0.4, max: 0.4 });
    } else {
      game.message('Too early...');
    }
    return;
  }
  if (this.attackCd > 0) return;
  // need bait
  var baitId = null;
  if (this.inventory.countOf(I.NIGHTCRAWLER) > 0) baitId = I.NIGHTCRAWLER;
  else if (this.inventory.countOf(I.WORM) > 0) baitId = I.WORM;
  if (!baitId) { game.message('You need bait!'); return; }
  var lavaFish = typeof equippedAccessory === 'function' && equippedAccessory(I.HOTLINEFISHINGHOOK);
  // find water along the cast
  var r = def.range || 300;
  var dx = MOUSE.wx - this.x, dy = MOUSE.wy - this.y;
  var d = Math.sqrt(dx * dx + dy * dy) || 1;
  var ux = dx / d, uy = dy / d;
  var bobX = -1, bobY = -1, lavaMode = false;
  for (var step = 24; step <= r; step += 4) {
    var px = this.x + ux * step, py = this.y + uy * step + 2;
    if (game.world.isWaterAt(px, py)) { bobX = px; bobY = py; break; }
    if (lavaFish && game.world.isLavaAt(px, py)) { bobX = px; bobY = py; lavaMode = true; break; }
  }
  if (bobX < 0) { game.message('Cast into water!'); return; }
  this.attackCd = 0.3;
  var effF = this.inventory.accEffects();
  var power = (def.fishingPower || 15) + ITEMS[baitId].baitPower + (this.buffs[I.FISHINGPOTION] ? 25 : 0) + effF.fishingPower;
  this.fishing = {
    bobX: bobX, bobY: bobY, t: 0, lava: lavaMode,
    waitT: clamp(2.2 + Math.random() * 3.5 - power * 0.06, 1.0, 5.0),
    power: power, rodId: id, baitId: baitId
  };
  if (Math.random() >= clamp(effF.baitSave, 0, 0.8)) this.inventory.consume(baitId, 1);
  game.fx.push({ type: 'splash', x: bobX, y: bobY, t: 0.3, max: 0.3 });
  AudioSys.play('splash');
};

function bloodFishingEnemy(game, roll) {
  if (game.hardmode) {
    if (roll < 0.1) return E.DREADNAUTILUS;
    if (roll < 0.32) return E.BLOODEEL;
    if (roll < 0.54) return E.HEMOGOBLINSHARK;
    if (roll < 0.77) return E.WANDERINGEYEFISH;
    return E.ZOMBIEMERMAN;
  }
  return roll < 0.15 ? E.DREADNAUTILUS : (roll < 0.58 ? E.WANDERINGEYEFISH : E.ZOMBIEMERMAN);
}

function rollFish(game, f) {
  if (f.lava) return Math.random() < 0.3 ? I.GOLDENCRATE : I.WOODENCRATE;
  var biome = game.world.biomeAt(f.bobX, f.bobY);
  var r = Math.random();
  var tier = f.power * (0.6 + Math.random() * 0.8);
  if (r < 0.02) return I.ZEPHYRFISH;
  if (r < 0.04) return I.GOLDENCRATE;
  if (tier > 45 && r < 0.18) return I.GOLDENCRATE;
  if (tier > 32 && r < 0.38) return I.IRONCRATE;
  if (r < 0.6) return I.WOODENCRATE;
  if (biome === BIOME.HALLOW) return I.FISH_NEONTETRA;
  if (biome === BIOME.CORRUPT || biome === BIOME.CRIMSON) return I.FISH_EBONKOI;
  if (biome === BIOME.JUNGLE) return I.FISH_CRIMSONTIGER;
  if (biome === BIOME.OCEAN) {
    var o = Math.random();
    if (o < 0.4) return I.FISH_PUFFER;
    if (o < 0.7) return I.FISH_FLOUNDER;
    return I.FISH_ROCKFISH;
  }
  if (game.world.isUnderground(f.bobX, f.bobY)) {
    if (Math.random() < 0.5) return I.FISH_CAVEFISH;
  }
  var c = Math.random();
  if (c < 0.4) return I.FISH_BASS;
  if (c < 0.7) return I.FISH_TROUT;
  return I.FISH_SALMON;
}

function openCrate(tier) {
  var loot = [];
  var roll = function() {
    var r = Math.random();
    var mats = [I.IRON, I.COBALT, I.MYTHRIL, I.ADAMANTITE, I.TITANIUM, I.ORICHALCUM, I.PALLADIUM, I.CHLOROPHYTE];
    return mats[Math.floor(Math.random() * mats.length)];
  };
  var count = 2 + tier + Math.floor(Math.random() * 2);
  for (var i = 0; i < count; i++) {
    if (Math.random() < 0.35) loot.push({ id: roll(), count: 2 + Math.floor(Math.random() * 4) });
    else if (Math.random() < 0.4) loot.push({ id: I.HEALINGPOTION, count: 1 });
    else if (Math.random() < 0.5) loot.push({ id: I.GLOWSTONE, count: 3 + Math.floor(Math.random() * 5) });
    else loot.push({ id: I.COIN, count: 1 + Math.floor(Math.random() * 3) });
  }
  if (tier >= 2 && Math.random() < 0.5) loot.push({ id: I.ROCKET1, count: 5 + Math.floor(Math.random() * 5) });
  if (tier >= 3 && Math.random() < 0.6) loot.push({ id: I.COBALTBAR, count: 2 + Math.floor(Math.random() * 3) });
  return loot;
}

// ---------- Pets & light pets ----------
Player.prototype.tryPet = function(game, def, id, item) {
  if (this.attackCd > 0) return;
  this.attackCd = 0.3;
  var list = def.type === 'lightpet' ? this.lightPets : this.pets;
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === id) { list.splice(i, 1); return; }
  }
  this.inventory.removeAt(this.inventory.selected, 1);
  list.push({ id: id, def: def, x: this.x, y: this.y, t: Math.random() * 6 });
  game.message(def.type === 'lightpet' ? def.name + ' lights your way.' : def.name + ' has joined you!');
  AudioSys.play('spawn');
};

// ---------- Events ----------
Player.prototype.tryEvent = function(game, def, id, item) {
  if (this.attackCd > 0) return;
  if (game.anyBossAlive()) { game.message('A boss is already active!'); return; }
  if (game.event) { game.message('An event is already in progress!'); return; }
  if (def.hm && !game.hardmode) { game.message(def.name + ' can only be used in Hardmode.'); return; }
  if (def.after === 'plantera' && !game.bossesDefeated.plantera) { game.message('The Jungle grows restless. Defeat Plantera first.'); return; }
  var night = game.timeOfDay < 0.25 || game.timeOfDay > 0.75;
  var day = !night;
  if (def.time === 'day' && !day) { game.message('The ' + def.name + ' can only be used during the day.'); return; }
  if (def.time !== 'day' && def.time !== 'any' && !night) { game.message('The ' + def.name + ' can only be used at night.'); return; }
  this.attackCd = 0.5;
  this.inventory.removeAt(this.inventory.selected, 1);
  game.startEvent(def.event);
};

Player.prototype.damage = function(amount, from, kbx) {
  if (this.dying || this.invuln > 0) return;
  var eff = this.inventory.accEffects();
  var def = this.defense();
  var dm = DIFFICULTY[game.difficulty] || DIFFICULTY.normal;
  var defEff = dm.defEff != null ? dm.defEff : 1;
  var kbMul = dm.kbMul != null ? dm.kbMul : 1;
  var reduced = Math.max(1, Math.round(amount * (1 - eff.invuln) - def * 0.5 * defEff));
  this.hp -= reduced;
  this.invuln = 0.67 + eff.invuln;
  if (this.thorns > 0 && from && from.hp > 0) {
    if (from.boss) game.hitBoss(from, this.thorns, 0, 0);
    else hitEntity(from, this.thorns, 0, 0, game);
  }
  this.vx += (kbx || 0) * kbMul;
  this.vy = -4;
  AudioSys.play('hurt');
  game.flash();
  if (game.shake) game.shake(3, 0.2);
  game.spawnFloatingText(this.x, this.y - 20, '-' + reduced, '#ff6b6b');
  if (this.hp <= 0) this.die();
};

Player.prototype.die = function() {
  if (this.dying) return;
  if (game && game.placeDeathTombstone) game.placeDeathTombstone(this.x, this.y);
  if (game && game.difficulty) {
    var dm = DIFFICULTY[game.difficulty] || DIFFICULTY.normal;
    if (dm.coinLoss > 0) {
      var total = this.inventory.coinValue();
      var lose = Math.floor(total * dm.coinLoss);
      if (lose > 0) {
        var order = [I.PLATINUMCOIN, I.GOLDCOIN, I.SILVERCOIN, I.COIN];
        var remaining = lose;
        for (var ci = 0; ci < order.length && remaining > 0; ci++) {
          var id = order[ci];
          var have = this.inventory.countOf(id);
          if (!have) continue;
          var drop = Math.min(have, Math.ceil(remaining / COIN_VALUES[id]));
          this.inventory.consume(id, drop);
          remaining -= drop * COIN_VALUES[id];
          game.addPickup(this.x + (Math.random() * 20 - 10), this.y, id, drop);
        }
      }
    }
  }
  this.dying = true;
  this.respawnT = 2.5;
  AudioSys.play('death');
  game.message('You died!');
  game.deathscreen();
};

function angDiff(a, b) {
  var d = b - a;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return d;
}

function tileColor(t) {
  var map = {};
  map[T.DIRT] = '#8a6642'; map[T.GRASS] = '#5cbf4d'; map[T.STONE] = '#7a7f8c';
  map[T.WOOD] = '#9a6b3f'; map[T.TREETRUNK] = '#9a6b3f'; map[T.LEAVES] = '#3f9a4d'; map[T.COBALT] = '#2a5fd0';
  map[T.MYTHRIL] = '#2fbf8f'; map[T.ADAMANTITE] = '#c43d3d'; map[T.IRON] = '#d0b090';
  map[T.PEARLSTONE] = '#e6d9ff'; map[T.EBONSTONE] = '#6d5a8c';
  map[T.SAND] = '#e8d191'; map[T.TORCH] = '#ffb84d'; map[T.COBWEB] = '#e8e8e8';
  map[T.GLOWSTONE] = '#9de0ff'; map[T.CORRUPTGRASS] = '#8a5c9a'; map[T.HALLOWGRASS] = '#d8bfff';
  map[T.WORKBENCH] = '#a0744a'; map[T.FURNACE] = '#5a5a5a'; map[T.ANVIL] = '#4a4a5a';
  map[T.PLATFORM] = '#b5824f';
  map[T.SNOW] = '#e8f0f8'; map[T.ICE] = '#b8e0f0'; map[T.MUSHROOM] = '#c0a0d8';
  map[T.PALLADIUM] = '#ff8a6b'; map[T.GLASS] = '#c8e8f0'; map[T.SPOOKYWOOD] = '#4a4a5a';
  map[T.HONEY] = '#e8a83d'; map[T.CHEST] = '#9a6b3f'; map[T.CHAIR] = '#8a5c34'; map[T.TABLE] = '#9a6b3f';
  map[T.CRIMGRASS] = '#b04040'; map[T.CRIMSTONE] = '#8a4a4a'; map[T.CRIMTANE] = '#c04048';
  map[T.ASH] = '#5a5348'; map[T.HELLSTONE] = '#e84828'; map[T.HELLBRICK] = '#7a3a2a';
  map[T.CLOUD] = '#e8f0f8'; map[T.GRANITE] = '#8a8a9a'; map[T.MARBLE] = '#e8e8f0'; map[T.OBSIDIAN] = '#3a2a3a';
  map[T.HELLFORGE] = '#8a4030'; map[T.SHADOWCHEST] = '#4a365f';
  map[T.SHADOWORB] = '#8f70d8'; map[T.CRIMSONHEART] = '#e84858'; map[T.LARVA] = '#ffd75e'; map[T.HIVE] = '#d99a32';
  map[T.DUNGEONBRICK] = '#6a7ab0'; map[T.DUNGEONDOOR] = '#4a5a8a';
  map[T.TIN] = '#c8b090'; map[T.LEAD] = '#8a8a96'; map[T.TUNGSTEN] = '#a0a8c0'; map[T.PLATINUM] = '#d8f0ff';
  map[T.METEORITE] = '#8a4a3a'; map[T.SANDSTONE] = '#c8a868';
  map[T.ALTAR] = '#5a4d7a'; map[T.PYLON] = '#6fd3ff'; map[T.PARTYCENTER] = '#ff70b8'; map[T.TOMBSTONE] = '#777780'; map[T.SUNFLOWER] = '#ffe050';
  return map[t] || '#fff';
}
