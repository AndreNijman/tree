// ---------- Entities ----------
// Shared AABB physics. ent: {x,y = center, w,h, vx,vy, onGround}
function physicsStep(e, game, opts) {
  var world = game.world;
  opts = opts || {};
  var grav = (opts.gravity !== undefined) ? opts.gravity : GRAVITY;
  var noGrav = opts.noGrav;
  if (!noGrav) e.vy = Math.min(e.vy + grav, MAXFALL);
  var halfW = e.w / 2, halfH = e.h / 2;
  var wasOnGround = e.onGround;
  e.onGround = false;

  // --- X movement ---
  e.x += e.vx;
  if (e.vx > 0) {
    var right = e.x + halfW;
    var xT = Math.floor(right / TILE);
    var topT = Math.floor((e.y - halfH) / TILE);
    var botT = Math.floor((e.y + halfH - 0.01) / TILE);
    for (var ty = topT; ty <= botT; ty++) {
      if (world.isSolid(xT, ty)) { e.x = xT * TILE - halfW - 0.01; e.vx = 0; break; }
    }
  } else if (e.vx < 0) {
    var left = e.x - halfW;
    var xT2 = Math.floor(left / TILE);
    var topT2 = Math.floor((e.y - halfH) / TILE);
    var botT2 = Math.floor((e.y + halfH - 0.01) / TILE);
    for (var ty2 = topT2; ty2 <= botT2; ty2++) {
      if (world.isSolid(xT2, ty2)) { e.x = (xT2 + 1) * TILE + halfW + 0.01; e.vx = 0; break; }
    }
  }

  // --- Y movement ---
  e.y += e.vy;
  if (e.vy > 0) {
    var bottom = e.y + halfH;
    var yT = Math.floor(bottom / TILE);
    var xTL = Math.floor((e.x - halfW) / TILE);
    var xTR = Math.floor((e.x + halfW - 0.01) / TILE);
    var solid = false;
    for (var tx = xTL; tx <= xTR; tx++) {
      if (world.isSolid(tx, yT)) { solid = true; break; }
      if (world.isPlatform(tx, yT) && !opts.ghostPlatform) { solid = true; break; }
    }
    if (solid) {
      e.y = yT * TILE - halfH - 0.01;
      e.vy = 0;
      e.onGround = true;
    }
  } else if (e.vy < 0) {
    var top = e.y - halfH;
    var yT2 = Math.floor(top / TILE);
    var xTL2 = Math.floor((e.x - halfW) / TILE);
    var xTR2 = Math.floor((e.x + halfW - 0.01) / TILE);
    for (var tx2 = xTL2; tx2 <= xTR2; tx2++) {
      if (world.isSolid(tx2, yT2)) {
        e.y = (yT2 + 1) * TILE + halfH + 0.01;
        e.vy = 0;
        break;
      }
    }
  }

  if (wasOnGround && !e.onGround && !noGrav && e.vy > 0.5) e.justLeftGround = true;
}

// Knockback decay
function kbDecay(e) {
  if (e.kbVx) { e.x += e.kbVx; e.kbVx *= 0.85; if (Math.abs(e.kbVx) < 0.05) e.kbVx = 0; }
  if (e.kbVy) { e.y += e.kbVy; e.kbVy *= 0.85; if (Math.abs(e.kbVy) < 0.05) e.kbVy = 0; }
}

function entityStats() {
  return {
    w:16, h:12, hp:50, dmg:10, def:0, color:'#7ac74f', speed:1.5,
    fly:false, ghost:false, name:'creature'
  };
}

var ENT_DEF = {
  [E.SLIME]: { w:22, h:16, hp:14, dmg:6, def:0, color:'#5cbf6c', speed:1.6, name:'Green Slime', exp:1 },
  [E.PINKSLIME]: { w:40, h:30, hp:260, dmg:28, def:4, color:'#ff8fd0', speed:1.8, name:'Pink Slime', exp:4 },
  [E.HOPPINJACK]: { w:24, h:18, hp:175, dmg:80, def:20, color:'#d8e05e', speed:2.6, name:'Hopping Jack', exp:2 },
  [E.ZOMBIE]: { w:20, h:34, hp:45, dmg:14, def:6, color:'#6a9a5c', speed:1.1, name:'Zombie', exp:2 },
  [E.HARDZOMBIE]: { w:22, h:34, hp:45, dmg:14, def:6, color:'#8f7f6f', speed:1.5, name:'Armored Zombie', exp:8 },
  [E.WRATH]: { w:28, h:32, hp:160, dmg:65, def:16, color:'#b8c4ff', speed:2.4, fly:true, ghost:true, name:'Wraith', exp:10 },
  [E.EATEROFSOULS]: { w:20, h:18, hp:40, dmg:22, def:8, color:'#5a4d7a', speed:2.2, fly:true, name:'Eater of Souls', exp:4 },
  [E.CORRUPTOR]: { w:26, h:22, hp:230, dmg:60, def:32, color:'#7a3d5c', speed:1.8, fly:true, name:'Corruptor', exp:8 },
  [E.DEVOURER]: { w:28, h:18, hp:100, dmg:31, def:2, color:'#6a507f', speed:2.5, fly:true, name:'Devourer', exp:6 },
  [E.PIXIE]: { w:20, h:20, hp:150, dmg:55, def:20, color:'#ffe9a8', speed:2.6, fly:true, name:'Pixie', exp:8 },
  [E.UNICORN]: { w:36, h:30, hp:400, dmg:65, def:30, color:'#fff0d0', speed:5.0, name:'Unicorn', exp:12 },
  [E.CHAOSELEMENTAL]: { w:22, h:26, hp:370, dmg:40, def:30, color:'#e0d8ff', speed:3.0, fly:true, name:'Chaos Elemental', exp:12 },
  [E.GASTROPOD]: { w:30, h:24, hp:220, dmg:60, def:22, color:'#ffd0a8', speed:2.0, fly:true, name:'Gastropod', exp:16 },
  [E.GUIDE]: { w:18, h:32, hp:9999, dmg:0, def:99, color:'#c8b090', speed:0, name:'Guide', exp:0 },
  [E.WYVERN]: { w:34, h:24, hp:4000, dmg:80, def:10, color:'#ffd0a0', speed:4.0, fly:true, name:'Wyvern', exp:30 },
  [E.JUNGLEBAT]: { w:22, h:16, hp:34, dmg:20, def:4, color:'#7a4d3d', speed:3.2, fly:true, name:'Jungle Bat', exp:5 },
  [E.JUNGLESLIME]: { w:22, h:16, hp:60, dmg:18, def:6, color:'#4d8a3d', speed:1.8, name:'Jungle Slime', exp:5 },
  [E.HORNET]: { w:26, h:22, hp:48, dmg:26, def:12, color:'#d8a030', speed:2.2, fly:true, name:'Hornet', exp:8 },
  [E.LIHZARD]: { w:24, h:34, hp:400, dmg:38, def:20, color:'#8a5a3a', speed:1.6, name:'Lihzahrd', exp:16 },
  [E.FLYINGSNAKE]: { w:28, h:20, hp:260, dmg:85, def:28, color:'#5a9a5c', speed:2.6, fly:true, name:'Flying Snake', exp:14 },
  [E.FRANKENSTEIN]: { w:24, h:36, hp:350, dmg:65, def:18, color:'#7a9a5c', speed:1.7, name:'Frankenstein', exp:20 },
  [E.REAPER]: { w:30, h:34, hp:700, dmg:80, def:22, color:'#3a3a4a', speed:2.8, fly:true, ghost:true, name:'Reaper', exp:25 },
  [E.VAMPIRE]: { w:22, h:24, hp:750, dmg:80, def:24, color:'#6a3a4a', speed:2.6, fly:true, name:'Vampire', exp:22 },
  [E.CORITE]: { w:26, h:20, hp:600, dmg:70, def:26, color:'#ff9a3d', speed:5.5, fly:true, name:'Corite', exp:26 },
  [E.LUNARFLAME]: { w:22, h:22, hp:480, dmg:58, def:10, color:'#c85cff', speed:3.4, fly:true, name:'Nebula Blaze', exp:26 },
  [E.MUMMY]: { w:22, h:34, hp:130, dmg:50, def:16, color:'#d8c8a0', speed:1.4, name:'Mummy', exp:8 },
  [E.LIGHTMUMMY]: { w:22, h:34, hp:200, dmg:55, def:18, color:'#ffe0a8', speed:2.0, name:'Light Mummy', exp:9 },
  [E.DARKMUMMY]: { w:22, h:34, hp:180, dmg:60, def:18, color:'#7a6a9a', speed:1.8, name:'Dark Mummy', exp:10 },
  [E.BLOODMUMMY]: { w:22, h:34, hp:180, dmg:60, def:18, color:'#b04a4a', speed:1.8, name:'Blood Mummy', exp:10 },
  [E.SKELETONARCHER]: { w:22, h:32, hp:210, dmg:45, def:14, color:'#c8c8d8', speed:1.6, name:'Skeleton Archer', exp:8 },
  [E.ARMOREDBONES]: { w:24, h:34, hp:500, dmg:45, def:50, color:'#a0a0b0', speed:1.2, name:'Armored Bones', exp:10 },
  [E.UNDEADMINER]: { w:22, h:32, hp:70, dmg:22, def:9, color:'#b0a090', speed:1.3, name:'Undead Miner', exp:8 },
  [E.GIANTBAT]: { w:24, h:16, hp:100, dmg:45, def:16, color:'#8a6a9a', speed:3.6, fly:true, name:'Giant Bat', exp:5 },
  [E.TOXICSLUDGE]: { w:22, h:16, hp:150, dmg:50, def:18, color:'#8ac84a', speed:1.9, name:'Toxic Sludge', exp:8 },
  [E.PIGRON]: { w:24, h:20, hp:210, dmg:70, def:16, color:'#ffb0c8', speed:2.2, fly:true, name:'Pigron', exp:7 },
  [E.ICEGOLEM]: { w:26, h:38, hp:4000, dmg:60, def:32, color:'#a8d8f0', speed:1.4, name:'Ice Golem', exp:16 },
  [E.ICETORTOISE]: { w:30, h:20, hp:400, dmg:55, def:28, color:'#8ab0c8', speed:1.6, name:'Ice Tortoise', exp:18 },
  [E.SNOWFLINX]: { w:28, h:26, hp:70, dmg:26, def:12, color:'#f0f0f8', speed:3.0, name:'Snow Flinx', exp:8 },
  [E.ICEBAT]: { w:22, h:14, hp:30, dmg:18, def:6, color:'#b8d8f0', speed:3.6, fly:true, name:'Ice Bat', exp:5 },
  [E.ANGLERFISH]: { w:26, h:16, hp:90, dmg:80, def:22, color:'#c89068', speed:2.6, fly:true, name:'Angler Fish', exp:8 },
  [E.ARAPAIMA]: { w:34, h:20, hp:200, dmg:75, def:30, color:'#d88870', speed:2.4, fly:true, name:'Arapaima', exp:14 },
  [E.DERPLING]: { w:24, h:22, hp:300, dmg:80, def:26, color:'#b0a0d8', speed:2.0, fly:true, name:'Derpling', exp:12 },
  [E.MOSSHORNET]: { w:26, h:22, hp:220, dmg:70, def:22, color:'#8ad850', speed:2.4, fly:true, name:'Moss Hornet', exp:9 },
  [E.GIANTTORTOSE]: { w:32, h:20, hp:470, dmg:80, def:30, color:'#6a8a5a', speed:2.2, name:'Giant Tortoise', exp:16 },
  [E.CRIMSONAXE]: { w:26, h:22, hp:200, dmg:80, def:18, color:'#c04848', speed:2.8, fly:true, name:'Crimson Axe', exp:8 },
  [E.ICHORSTICKER]: { w:20, h:24, hp:340, dmg:55, def:20, color:'#d0d050', speed:1.6, name:'Ichor Sticker', exp:8 },
  [E.CLINGER]: { w:18, h:30, hp:320, dmg:70, def:30, color:'#d04040', speed:0, name:'Clinger', exp:9 },
  [E.CURSEDHAMMER]: { w:24, h:24, hp:200, dmg:80, def:18, color:'#a0a8b8', speed:2.6, fly:true, name:'Cursed Hammer', exp:10 },
  [E.MIMIC]: { w:28, h:28, hp:500, dmg:80, def:30, color:'#c89030', speed:1.8, name:'Mimic', exp:20 },
  [E.HALLOWEDMIMIC]: { w:34, h:32, hp:3500, dmg:90, def:34, color:'#ffd8a0', speed:2.6, name:'Hallowed Mimic', exp:50 },
  [E.CORRUPTMIMIC]: { w:34, h:32, hp:3500, dmg:90, def:34, color:'#5a4d7a', speed:2.6, name:'Corrupt Mimic', exp:50 },
  [E.CRIMSONMIMIC]: { w:34, h:32, hp:3500, dmg:90, def:34, color:'#b04a4a', speed:2.6, name:'Crimson Mimic', exp:50 },
  [E.WOLF]: { w:30, h:24, hp:300, dmg:65, def:30, color:'#8a8a90', speed:4.5, name:'Wolf', exp:8 },
  [E.VORTEXIAN]: { w:26, h:30, hp:700, dmg:90, def:34, color:'#60d8c8', speed:2.2, name:'Vortexian', exp:16 },
  [E.ALIENHORNET]: { w:26, h:22, hp:500, dmg:75, def:20, color:'#70c870', speed:3.0, fly:true, name:'Alien Hornet', exp:16 },
  [E.NEBULAFLOATER]: { w:26, h:22, hp:1300, dmg:75, def:20, color:'#c870e0', speed:2.2, fly:true, name:'Nebula Floater', exp:16 },
  [E.STARDJUSTCELL]: { w:24, h:24, hp:300, dmg:120, def:50, color:'#c0c0ff', speed:2.0, fly:true, name:'Stardust Cell', exp:16 },
  [E.MERCHANT]: { w:18, h:32, hp:9999, dmg:0, def:99, color:'#c8a878', speed:0, name:'Merchant', exp:0 },
  [E.NURSE]: { w:18, h:32, hp:9999, dmg:0, def:99, color:'#f0d0e0', speed:0, name:'Nurse', exp:0 },
  [E.WIZARD]: { w:18, h:32, hp:9999, dmg:0, def:99, color:'#a880d8', speed:0, name:'Wizard', exp:0 },
  [E.STEAMPUNKER]: { w:18, h:32, hp:9999, dmg:0, def:99, color:'#d0a860', speed:0, name:'Steampunker', exp:0 },
  [E.CYBORG]: { w:18, h:32, hp:9999, dmg:0, def:99, color:'#a0b0c0', speed:0, name:'Cyborg', exp:0 },
  [E.TRUFFLE]: { w:16, h:26, hp:9999, dmg:0, def:99, color:'#c0b090', speed:0, name:'Truffle', exp:0 },
  [E.PIRATE]: { w:18, h:32, hp:9999, dmg:0, def:99, color:'#e0c090', speed:0, name:'Pirate', exp:0 },
  [E.WITCHDOCTOR]: { w:18, h:32, hp:9999, dmg:0, def:99, color:'#40a060', speed:0, name:'Witch Doctor', exp:0 },
  [E.DEMOLITIONIST]: { w:18, h:32, hp:9999, dmg:0, def:99, color:'#c85050', speed:0, name:'Demolitionist', exp:0 },
  [E.DYETRADER]: { w:18, h:32, hp:9999, dmg:0, def:99, color:'#5a8a3d', speed:0, name:'Dye Trader', exp:0 },
  [E.ANGLER]: { w:16, h:22, hp:9999, dmg:0, def:99, color:'#e0a858', speed:0, name:'Angler', exp:0 },
  [E.ZOOLOGIST]: { w:18, h:32, hp:9999, dmg:0, def:99, color:'#c8a058', speed:0, name:'Zoologist', exp:0 },
  [E.DRYAD]: { w:18, h:32, hp:9999, dmg:0, def:99, color:'#3f9a4d', speed:0, name:'Dryad', exp:0 },
  [E.PAINTER]: { w:18, h:32, hp:9999, dmg:0, def:99, color:'#8a5c9a', speed:0, name:'Painter', exp:0 },
  [E.GOLFER]: { w:18, h:32, hp:9999, dmg:0, def:99, color:'#4a7a8a', speed:0, name:'Golfer', exp:0 },
  [E.ARMSDEALER]: { w:18, h:32, hp:9999, dmg:0, def:99, color:'#4a4a5a', speed:0, name:'Arms Dealer', exp:0 },
  [E.TAVERNKEEP]: { w:22, h:34, hp:9999, dmg:0, def:99, color:'#8a6b3d', speed:0, name:'Tavernkeep', exp:0 },
  [E.STYLIST]: { w:18, h:32, hp:9999, dmg:0, def:99, color:'#ff9de0', speed:0, name:'Stylist', exp:0 },
  [E.GOBLINTINKERER]: { w:18, h:32, hp:9999, dmg:0, def:99, color:'#5a7a3d', speed:0, name:'Goblin Tinkerer', exp:0 },
  [E.CLOTHIER]: { w:18, h:32, hp:9999, dmg:0, def:99, color:'#7a6b8a', speed:0, name:'Clothier', exp:0 },
  [E.MECHANIC]: { w:18, h:32, hp:9999, dmg:0, def:99, color:'#c8d050', speed:0, name:'Mechanic', exp:0 },
  [E.TAXCOLLECTOR]: { w:18, h:32, hp:9999, dmg:0, def:99, color:'#a8a048', speed:0, name:'Tax Collector', exp:0 },
  [E.PARTYGIRL]: { w:18, h:32, hp:9999, dmg:0, def:99, color:'#ff9de0', speed:0, name:'Party Girl', exp:0 },
  [E.SANTA]: { w:18, h:32, hp:9999, dmg:0, def:99, color:'#d04040', speed:0, name:'Santa Claus', exp:0 },
  [E.PRINCESS]: { w:18, h:32, hp:9999, dmg:0, def:99, color:'#ffb8d8', speed:0, name:'Princess', exp:0 },
  [E.PUMPKINSCARECROW]: { w:24, h:34, hp:500, dmg:60, def:18, color:'#ff9a3d', speed:1.6, name:'Scarecrow', exp:14 },
  [E.SPLINTERLING]: { w:22, h:26, hp:1200, dmg:100, def:32, color:'#d8a030', speed:2.0, name:'Splinterling', exp:10 },
  [E.FROSTZOMBIE]: { w:20, h:34, hp:50, dmg:16, def:8, color:'#b8d8f0', speed:1.4, name:'Frost Zombie', exp:12 },
  [E.GINGERBREAD]: { w:20, h:24, hp:750, dmg:90, def:26, color:'#c89068', speed:2.4, name:'Gingerbread Man', exp:12 },
  [E.MARTIANPROBE]: { w:26, h:20, hp:500, dmg:5, def:5, color:'#3dff9d', speed:3.4, fly:true, name:'Martian Probe', exp:50 },
  [E.MARTIANGRUNT]: { w:22, h:30, hp:700, dmg:65, def:18, color:'#5aa89a', speed:1.8, name:'Martian Grunt', exp:20 },
  [E.RAYGUNNER]: { w:22, h:30, hp:350, dmg:50, def:25, color:'#60d8c8', speed:1.6, name:'Ray Gunner', exp:20 },
  [E.MOURNINGWOOD]: { w:56, h:56, hp:14000, dmg:120, def:34, color:'#7a4d3d', speed:2.6, name:'Mourning Wood', exp:80 },
  [E.PUMPKING]: { w:60, h:60, hp:26000, dmg:50, def:40, color:'#ff8a3d', speed:3.0, name:'Pumpking', exp:120 },
  [E.EVERSCREAM]: { w:56, h:56, hp:13000, dmg:110, def:38, color:'#8ac84a', speed:2.6, name:'Everscream', exp:80 },
  [E.SANTANK]: { w:52, h:56, hp:18000, dmg:120, def:56, color:'#d04040', speed:2.8, name:'Santa-NK1', exp:100 },
  [E.ICEQUEEN]: { w:58, h:58, hp:34000, dmg:120, def:38, color:'#a8d8f0', speed:3.2, name:'Ice Queen', exp:120 },
  [E.MARTIANSAUCER]: { w:80, h:48, hp:40000, dmg:70, def:26, color:'#3dff9d', speed:2.2, name:'Martian Saucer', exp:150 },
  [E.HARPY]: { w:30, h:34, hp:100, dmg:25, def:8, color:'#e8e0d0', speed:2.8, fly:true, name:'Harpy', exp:14 },
  [E.LAVASLIME]: { w:24, h:18, hp:50, dmg:15, def:10, color:'#ff6a2a', speed:1.6, name:'Lava Slime', exp:8 },
  [E.HELLBAT]: { w:22, h:16, hp:46, dmg:35, def:8, color:'#c85028', speed:3.4, fly:true, name:'Hellbat', exp:6 },
  [E.DEMON]: { w:30, h:34, hp:120, dmg:32, def:8, color:'#8a4a3d', speed:2.4, fly:true, name:'Demon', exp:20 },
  [E.VOODOODEMON]: { w:30, h:34, hp:140, dmg:32, def:8, color:'#6a3a32', speed:2.4, fly:true, name:'Voodoo Demon', exp:22 },
  [E.FIREIMP]: { w:22, h:26, hp:70, dmg:30, def:16, color:'#e05828', speed:1.8, name:'Fire Imp', exp:8 },
  [E.BONESERPENT]: { w:30, h:22, hp:300, dmg:36, def:12, color:'#d8c8a8', speed:3.0, fly:true, name:'Bone Serpent', exp:25 },
  [E.CRIMERA]: { w:20, h:18, hp:40, dmg:22, def:8, color:'#e04848', speed:2.4, fly:true, name:'Crimera', exp:6 },
  [E.FACEMONSTER]: { w:20, h:30, hp:70, dmg:25, def:10, color:'#c85050', speed:1.6, name:'Face Monster', exp:10 },
  [E.HERPLING]: { w:22, h:26, hp:220, dmg:65, def:26, color:'#e07878', speed:2.0, name:'Herpling', exp:8 },
  [E.BLOODCRAWLER]: { w:26, h:18, hp:60, dmg:30, def:8, color:'#c03030', speed:3.0, name:'Blood Crawler', exp:9 },
  [E.BLACKRECLUSE]: { w:26, h:18, hp:350, dmg:90, def:40, color:'#3a2a3a', speed:3.0, name:'Black Recluse', exp:12 },
  [E.GRANITEGOLEM]: { w:30, h:40, hp:110, dmg:30, def:18, color:'#7a7a8a', speed:1.4, name:'Granite Golem', exp:18 },
  [E.MARBLEGOLEM]: { w:30, h:40, hp:600, dmg:58, def:16, color:'#e8e8f0', speed:1.4, name:'Marble Golem', exp:16 },
  [E.DEMONEYE]: { w:24, h:20, hp:60, dmg:18, def:2, color:'#c03030', speed:3.2, fly:true, name:'Demon Eye', exp:5 },
  [E.CAVEBAT]: { w:20, h:14, hp:16, dmg:13, def:2, color:'#6a5c3d', speed:3.4, fly:true, name:'Cave Bat', exp:3 },
  [E.GOBLIN]: { w:20, h:30, hp:60, dmg:12, def:4, color:'#7a8a3d', speed:2.2, name:'Goblin', exp:4 },
  [E.CORRUPTCRIMSONFLYER]: { w:22, h:16, hp:100, dmg:18, def:2, color:'#5a4d7a', speed:2.8, fly:true, name:'Vile Flyer', exp:4 },
  [E.CURSEDSKULL]: { w:22, h:22, hp:40, dmg:35, def:6, color:'#9a8ab0', speed:2.2, fly:true, name:'Cursed Skull', exp:10, shoot:true },
  [E.ANGRYBONES]: { w:22, h:34, hp:80, dmg:26, def:8, color:'#d8d0c0', speed:1.8, name:'Angry Bones', exp:8 },
  [E.DARKCASTER]: { w:22, h:32, hp:50, dmg:20, def:2, color:'#7a5a9a', speed:1.4, name:'Dark Caster', exp:10, shoot:true },
  [E.DUNGEONSLIME]: { w:24, h:18, hp:150, dmg:30, def:7, color:'#8a7ab0', speed:1.8, name:'Dungeon Slime', exp:6 },
  [E.ANTLION]: { w:28, h:20, hp:45, dmg:10, def:6, color:'#c8a058', speed:2.2, name:'Antlion', exp:9 },
  [E.ANTLIONCHARGER]: { w:30, h:22, hp:80, dmg:25, def:10, color:'#b08848', speed:4.6, name:'Antlion Charger', exp:11 },
  [E.ICESLIME]: { w:24, h:18, hp:30, dmg:8, def:4, color:'#b8d8f0', speed:1.8, name:'Ice Slime', exp:6 },
  [E.DUNGEONSCORPION]: { w:26, h:18, hp:300, dmg:40, def:8, color:'#d8a030', speed:3.4, name:'Dungeon Scorpion', exp:9 },
  // ---- Lunar pillars + invasion / eclipse enemies ----
  [E.LUNARPILLAR]: { w:56, h:150, hp:25000, dmg:0, def:40, color:'#c8c8d8', speed:0, fly:true, name:'Celestial Pillar', exp:0 },
  [E.GOBLINTHIEF]: { w:20, h:30, hp:80, dmg:20, def:6, color:'#5a8a3d', speed:2.8, name:'Goblin Thief', exp:5 },
  [E.GOBLINARCHER]: { w:20, h:30, hp:80, dmg:20, def:6, color:'#6a7a3d', speed:2.0, name:'Goblin Archer', exp:5, shoot:true },
  [E.GOBLINWARRIOR]: { w:22, h:32, hp:110, dmg:25, def:8, color:'#4a6a3d', speed:1.8, name:'Goblin Warrior', exp:8 },
  [E.GOBLINWARLOCK]: { w:24, h:34, hp:2000, dmg:80, def:26, color:'#7a3d8a', speed:1.6, name:'Goblin Warlock', exp:30, shoot:true },
  [E.PIRATEDECKHAND]: { w:22, h:32, hp:300, dmg:35, def:17, color:'#8a5c3d', speed:1.8, name:'Pirate Deckhand', exp:16 },
  [E.PIRATECORSAIR]: { w:24, h:34, hp:450, dmg:50, def:22, color:'#6a4a3d', speed:2.2, name:'Pirate Corsair', exp:20 },
  [E.PIRATESHARK]: { w:30, h:20, hp:420, dmg:50, def:10, color:'#5a5a6a', speed:3.6, fly:true, name:'Pirate Shark', exp:18 },
  [E.PIRATECAPTAIN]: { w:26, h:38, hp:3000, dmg:70, def:30, color:'#a83d3d', speed:2.0, name:'Pirate Captain', exp:60, shoot:true },
  [E.SWAMPTHING]: { w:28, h:38, hp:450, dmg:70, def:26, color:'#3d7a4d', speed:1.9, name:'Swamp Thing', exp:26 },
  [E.WEREWOLF]: { w:26, h:34, hp:350, dmg:70, def:38, color:'#7a5c4d', speed:3.4, name:'Werewolf', exp:24 },
  [E.EYEBALL]: { w:24, h:20, hp:1000, dmg:50, def:30, color:'#e04848', speed:4.0, fly:true, name:'Eyezor', exp:22 },
  [E.MOTHRON]: { w:40, h:26, hp:6000, dmg:80, def:30, color:'#8a8ab8', speed:4.0, fly:true, name:'Mothron', exp:120 },
  // ---- Post-Plantera Dungeon + Cultist ritual ----
  [E.PALADIN]: { w:30, h:42, hp:5000, dmg:100, def:50, color:'#d8c878', speed:1.2, name:'Paladin', exp:55 },
  [E.TACTICALSKELETON]: { w:22, h:34, hp:400, dmg:60, def:28, color:'#788078', speed:1.5, name:'Tactical Skeleton', exp:26, shoot:true },
  [E.SKELETONSNIPER]: { w:22, h:34, hp:400, dmg:60, def:28, color:'#657078', speed:1.2, name:'Skeleton Sniper', exp:30, shoot:true },
  [E.SKELETONCOMMANDO]: { w:24, h:36, hp:400, dmg:60, def:28, color:'#69735f', speed:1.4, name:'Skeleton Commando', exp:32, shoot:true },
  [E.RAGGEDCASTER]: { w:22, h:34, hp:400, dmg:40, def:20, color:'#9a8aaa', speed:1.2, name:'Ragged Caster', exp:28, shoot:true },
  [E.NECROMANCER]: { w:22, h:34, hp:300, dmg:50, def:18, color:'#765a98', speed:1.2, name:'Necromancer', exp:30, shoot:true },
  [E.DIABOLIST]: { w:22, h:34, hp:200, dmg:50, def:12, color:'#b84a36', speed:1.1, name:'Diabolist', exp:32, shoot:true },
  [E.BONELEE]: { w:22, h:34, hp:1000, dmg:90, def:42, color:'#34343c', speed:4.8, name:'Bone Lee', exp:38 },
  [E.GIANTCURSEDSKULL]: { w:38, h:38, hp:400, dmg:60, def:20, color:'#8c78a8', speed:2.8, fly:true, ghost:true, name:'Giant Cursed Skull', exp:42, shoot:true },
  [E.DUNGEONSPIRIT]: { w:22, h:24, hp:200, dmg:70, def:30, color:'#6bc8ff', speed:3.2, fly:true, ghost:true, name:'Dungeon Spirit', exp:20 },
  [E.CULTISTDEVOTEE]: { w:22, h:34, hp:400, dmg:0, def:0, color:'#445b8f', speed:0.8, name:'Lunatic Devotee', exp:15, shoot:true },
  [E.CULTISTARCHER]: { w:22, h:34, hp:210, dmg:45, def:14, color:'#687b9f', speed:1.2, name:'Cultist Archer', exp:15, shoot:true },
  [E.FLYINGDUTCHMAN]: { w:100, h:54, hp:18000, dmg:70, def:24, color:'#6a4a32', speed:2.0, fly:true, name:'Flying Dutchman', exp:120 },
  [E.CREATUREFROMDEEP]: { w:24, h:34, hp:400, dmg:60, def:22, color:'#397878', speed:2.4, name:'Creature from the Deep', exp:24 },
  [E.FRITZ]: { w:22, h:34, hp:270, dmg:70, def:14, color:'#77704f', speed:3.2, name:'Fritz', exp:22 },
  [E.POSSESSED]: { w:22, h:34, hp:600, dmg:68, def:28, color:'#72527c', speed:2.8, name:'The Possessed', exp:26 },
  [E.BUTCHER]: { w:26, h:38, hp:700, dmg:70, def:30, color:'#a84a42', speed:2.5, name:'Butcher', exp:32 },
  [E.DEADLYSPHERE]: { w:26, h:26, hp:350, dmg:100, def:80, color:'#d84a4a', speed:3.6, fly:true, name:'Deadly Sphere', exp:30 },
  [E.DRMANFLY]: { w:24, h:36, hp:500, dmg:65, def:24, color:'#6aa84f', speed:2.0, name:'Dr. Man Fly', exp:28, shoot:true },
  [E.NAILHEAD]: { w:30, h:40, hp:4000, dmg:100, def:34, color:'#788088', speed:1.8, name:'Nailhead', exp:36, shoot:true },
  [E.PSYCHO]: { w:22, h:34, hp:550, dmg:70, def:40, color:'#505058', speed:4.2, name:'Psycho', exp:32 },
  [E.BABYMOTHRON]: { w:26, h:18, hp:700, dmg:50, def:14, color:'#9a9ac8', speed:4.2, fly:true, name:'Baby Mothron', exp:22 },
  [E.BLOODZOMBIE]: { w:22, h:34, hp:75, dmg:20, def:8, color:'#9a3038', speed:1.7, name:'Blood Zombie', exp:5 },
  [E.DRIPPLER]: { w:26, h:24, hp:50, dmg:28, def:14, color:'#c83a48', speed:3.0, fly:true, name:'Drippler', exp:7 },
  [E.WANDERINGEYEFISH]: { w:28, h:20, hp:300, dmg:35, def:18, color:'#b84858', speed:3.4, fly:true, name:'Wandering Eye Fish', exp:9 },
  [E.ZOMBIEMERMAN]: { w:24, h:36, hp:400, dmg:40, def:20, color:'#4f7f78', speed:2.4, name:'Zombie Merman', exp:12 },
  [E.DREADNAUTILUS]: { w:44, h:38, hp:7000, dmg:55, def:24, color:'#a82f48', speed:3.0, fly:true, ghost:true, name:'Dreadnautilus', exp:35, shoot:true },
  [E.SNOWMANGANGSTA]: { w:22, h:32, hp:200, dmg:50, def:20, color:'#d8e8f0', speed:1.8, name:'Snowman Gangsta', exp:12, shoot:true },
  [E.MISTERSTABBY]: { w:22, h:34, hp:240, dmg:65, def:26, color:'#e8f0f8', speed:3.0, name:'Mister Stabby', exp:14 },
  [E.SNOWBALLA]: { w:24, h:34, hp:220, dmg:55, def:22, color:'#c8dce8', speed:1.6, name:'Snow Balla', exp:13, shoot:true },
  [E.PIRATECROSSBOWER]: { w:22, h:34, hp:350, dmg:35, def:20, color:'#704a32', speed:1.7, name:'Pirate Crossbower', exp:20, shoot:true },
  [E.PARROT]: { w:24, h:20, hp:100, dmg:80, def:12, color:'#d84a3a', speed:4.0, fly:true, name:'Parrot', exp:16 },
  [E.MARTIANWALKER]: { w:34, h:42, hp:2000, dmg:60, def:40, color:'#568f83', speed:1.4, name:'Martian Walker', exp:32, shoot:true },
  [E.MARTIANDRONE]: { w:28, h:22, hp:300, dmg:60, def:16, color:'#68c8bc', speed:3.8, fly:true, name:'Martian Drone', exp:24, shoot:true },
  [E.TESLATURRET]: { w:26, h:32, hp:200, dmg:10, def:40, color:'#5aa8b8', speed:0, name:'Tesla Turret', exp:28, shoot:true },
  [E.HELLHOUND]: { w:34, h:24, hp:650, dmg:68, def:16, color:'#5b352c', speed:4.6, name:'Hellhound', exp:24 },
  [E.POLTERGEIST]: { w:28, h:30, hp:1250, dmg:90, def:44, color:'#9a80b8', speed:3.0, fly:true, ghost:true, name:'Poltergeist', exp:26 },
  [E.HEADLESSHORSEMAN]: { w:34, h:42, hp:1300, dmg:82, def:24, color:'#412c24', speed:4.0, name:'Headless Horseman', exp:36 },
  [E.ZOMBIEELF]: { w:22, h:32, hp:600, dmg:65, def:18, color:'#4f8a58', speed:2.2, name:'Zombie Elf', exp:16 },
  [E.ELFARCHER]: { w:22, h:32, hp:900, dmg:70, def:30, color:'#609a68', speed:1.8, name:'Elf Archer', exp:17, shoot:true },
  [E.KRAMPUS]: { w:30, h:42, hp:2500, dmg:100, def:40, color:'#5b4038', speed:2.8, name:'Krampus', exp:32 },
  [E.ELFCOPTER]: { w:34, h:24, hp:1200, dmg:60, def:28, color:'#b83f3f', speed:3.5, fly:true, name:'Elf Copter', exp:28, shoot:true },
  [E.SELENIAN]: { w:26, h:34, hp:800, dmg:90, def:30, color:'#e87938', speed:4.0, name:'Selenian', exp:28 },
  [E.STORMDIVER]: { w:26, h:34, hp:800, dmg:100, def:40, color:'#38b8a0', speed:2.4, name:'Storm Diver', exp:27, shoot:true },
  [E.PREDICTOR]: { w:24, h:32, hp:700, dmg:80, def:30, color:'#b05ac8', speed:2.0, name:'Predictor', exp:26, shoot:true },
  [E.STARGAZER]: { w:26, h:28, hp:700, dmg:80, def:34, color:'#6f8fe8', speed:2.5, fly:true, name:'Stargazer', exp:27, shoot:true },
  [E.FLYINGFISH]: { w:28, h:18, hp:20, dmg:9, def:4, color:'#5f9fc8', speed:3.4, fly:true, name:'Flying Fish', exp:5 },
  [E.ANGRYNIMBUS]: { w:36, h:22, hp:300, dmg:50, def:24, color:'#8290a0', speed:2.0, fly:true, ghost:true, name:'Angry Nimbus', exp:18, shoot:true },
  [E.ANGRYTUMBLER]: { w:28, h:28, hp:50, dmg:30, def:6, color:'#c8a85f', speed:3.6, name:'Angry Tumbler', exp:9 },
  [E.SANDELEMENTAL]: { w:30, h:38, hp:5000, dmg:40, def:30, color:'#d8bd78', speed:2.4, fly:true, ghost:true, name:'Sand Elemental', exp:32, shoot:true },
  [E.GOBLINSCOUT]: { w:20, h:30, hp:80, dmg:20, def:6, color:'#839449', speed:3.0, name:'Goblin Scout', exp:4 },
  [E.GOBLINPEON]: { w:20, h:30, hp:60, dmg:12, def:4, color:'#789144', speed:2.3, name:'Goblin Peon', exp:4 },
  [E.GOBLINSORCERER]: { w:20, h:32, hp:40, dmg:20, def:2, color:'#596f3c', speed:1.5, name:'Goblin Sorcerer', exp:6, shoot:true },
  [E.GOBLINSUMMONER]: { w:24, h:34, hp:2000, dmg:70, def:18, color:'#7a3d8a', speed:2.5, fly:true, ghost:true, name:'Goblin Summoner', exp:45, shoot:true },
  [E.PIRATEDEADEYE]: { w:22, h:34, hp:225, dmg:30, def:14, color:'#594431', speed:1.5, name:'Pirate Deadeye', exp:22, shoot:true },
  [E.NUTCRACKER]: { w:24, h:38, hp:1800, dmg:80, def:26, color:'#b83f3f', speed:2.4, name:'Nutcracker', exp:26 },
  [E.FLOCKO]: { w:26, h:26, hp:450, dmg:75, def:8, color:'#d8f0ff', speed:3.5, fly:true, ghost:true, name:'Flocko', exp:24 },
  [E.YETI]: { w:34, h:44, hp:3500, dmg:140, def:50, color:'#e0e8ec', speed:3.2, name:'Yeti', exp:38 },
  [E.PRESENTMIMIC]: { w:36, h:30, hp:900, dmg:100, def:32, color:'#d83f4f', speed:4.0, name:'Present Mimic', exp:42 },
  [E.BRIDE]: { w:22, h:34, hp:200, dmg:14, def:8, color:'#e8d8d8', speed:1.8, name:'The Bride', exp:7 },
  [E.GROOM]: { w:22, h:34, hp:200, dmg:14, def:8, color:'#303038', speed:1.8, name:'The Groom', exp:7 },
  [E.CLOWN]: { w:26, h:38, hp:800, dmg:60, def:25, color:'#d84a68', speed:2.0, name:'Clown', exp:30, shoot:true },
  [E.BLOODEEL]: { w:28, h:22, hp:6000, dmg:90, def:0, color:'#a82038', speed:4.2, fly:true, name:'Blood Eel', exp:38 },
  [E.HEMOGOBLINSHARK]: { w:42, h:24, hp:5000, dmg:70, def:30, color:'#7f2638', speed:4.4, fly:true, name:'Hemogoblin Shark', exp:42 },
  [E.MARTIANOFFICER]: { w:24, h:34, hp:300, dmg:75, def:50, color:'#477f72', speed:2.3, name:'Martian Officer', exp:27 },
  [E.MARTIANENGINEER]: { w:22, h:32, hp:400, dmg:40, def:34, color:'#68b8a8', speed:1.5, name:'Martian Engineer', exp:28, shoot:true },
  [E.GIGAZAPPER]: { w:28, h:38, hp:600, dmg:75, def:38, color:'#459e91', speed:1.4, name:'Gigazapper', exp:34, shoot:true },
  [E.BRAINSCRAMBLER]: { w:30, h:28, hp:350, dmg:50, def:25, color:'#9a68b8', speed:3.0, fly:true, ghost:true, name:'Brain Scrambler', exp:32, shoot:true },
  [E.SCUTLIXGUNNER]: { w:44, h:38, hp:350, dmg:65, def:30, color:'#4f8f82', speed:3.0, name:'Scutlix Gunner', exp:40, shoot:true },
  [E.CRAWLTIPEDE]: { w:30, h:24, hp:10000, dmg:120, def:1000, color:'#f07838', speed:5.2, fly:true, name:'Crawltipede', exp:42 },
  [E.ALIENQUEEN]: { w:40, h:34, hp:1000, dmg:100, def:44, color:'#38bfa8', speed:3.2, fly:true, name:'Alien Queen', exp:40, shoot:true },
  [E.EVOLUTIONBEAST]: { w:34, h:42, hp:850, dmg:90, def:46, color:'#a84fc0', speed:2.2, name:'Evolution Beast', exp:44, shoot:true },
  [E.FLOWINVADER]: { w:36, h:32, hp:1500, dmg:70, def:38, color:'#708fe8', speed:3.4, fly:true, ghost:true, name:'Flow Invader', exp:42, shoot:true },
  [E.ANGRYDANDELION]: { w:24, h:32, hp:50, dmg:15, def:0, color:'#e8df72', speed:0, name:'Angry Dandelion', exp:3 },
  [E.WINDYBALLOON]: { w:24, h:18, hp:1, dmg:0, def:0, color:'#5cbf6c', speed:1.6, fly:true, name:'Windy Balloon Slime', exp:3 },
  [E.LADYBUG]: { w:12, h:10, hp:5, dmg:0, def:0, color:'#e85040', speed:1.8, fly:true, name:'Ladybug', exp:0 },
  [E.GHOST]: { w:20, h:30, hp:50, dmg:15, def:4, color:'#d8d8e0', speed:1.7, fly:true, ghost:true, name:'Ghost', exp:4 },
  [E.SANDSLIME]: { w:20, h:14, hp:50, dmg:15, def:5, color:'#e8d878', speed:1.5, name:'Sand Slime', exp:2 },
  [E.GIANTWORM]: { w:26, h:18, hp:30, dmg:8, def:0, color:'#c8b090', speed:3.2, fly:true, name:'Giant Worm', exp:8 },
  [E.NYMPH]: { w:20, h:32, hp:300, dmg:35, def:16, color:'#e8d0b0', speed:2.6, name:'Nymph', exp:12 },
  [E.DIGGER]: { w:28, h:18, hp:200, dmg:45, def:10, color:'#e0c878', speed:3.4, fly:true, name:'Digger', exp:10 },
  [E.CRIMSLIME]: { w:30, h:22, hp:200, dmg:60, def:26, color:'#d84848', speed:2.0, name:'Crimslime', exp:10 },
  [E.SLIMELING]: { w:14, h:10, hp:90, dmg:45, def:10, color:'#e86060', speed:2.4, name:'Slimeling', exp:2 },
  [E.MOTH]: { w:26, h:18, hp:1000, dmg:70, def:28, color:'#c8a860', speed:4.6, fly:true, name:'Moth', exp:8 },
  [E.CORRUPTSLIME]: { w:20, h:14, hp:170, dmg:55, def:20, color:'#8a5fb8', speed:1.5, name:'Corrupt Slime', exp:3 },
  [E.SPIKEDJUNGLESLIME]: { w:22, h:16, hp:65, dmg:28, def:8, color:'#5cc04c', speed:1.7, name:'Spiked Jungle Slime', exp:4 },
  [E.SPIKEDICESLIME]: { w:22, h:16, hp:60, dmg:12, def:8, color:'#9adff2', speed:1.6, name:'Spiked Ice Slime', exp:4 },
  [E.UMBRELLASLIME]: { w:22, h:20, hp:35, dmg:10, def:5, color:'#5aa8e0', speed:1.8, fly:true, name:'Umbrella Slime', exp:12 },
  [E.DUNESPLICER]: { w:30, h:20, hp:500, dmg:58, def:18, color:'#d8a878', speed:3.6, fly:true, name:'Dune Splicer', exp:26 },
  [E.ANTLIONSWARMER]: { w:22, h:16, hp:60, dmg:29, def:8, color:'#d0a060', speed:4.0, fly:true, name:'Antlion Swarmer', exp:5 },
  [E.SPOREZOMBIE]: { w:20, h:34, hp:180, dmg:40, def:10, color:'#7aa84a', speed:1.0, name:'Spore Zombie', exp:6 },
  [E.ICEELEMENTAL]: { w:22, h:30, hp:200, dmg:55, def:20, color:'#9adcff', speed:1.6, name:'Ice Elemental', exp:16 },
  [E.SQUID]: { w:22, h:26, hp:30, dmg:20, def:2, color:'#c8708a', speed:2.6, fly:true, name:'Squid', exp:5 },
  [E.BUNNY]: { w:16, h:14, hp:5, dmg:0, def:0, color:'#d8c8b0', speed:2.6, name:'Bunny', exp:0 },
  [E.BIRD]: { w:14, h:12, hp:5, dmg:0, def:0, color:'#7a8fc8', speed:3.2, fly:true, name:'Bird', exp:0 },
  [E.SQUIRREL]: { w:14, h:12, hp:5, dmg:0, def:0, color:'#b8835a', speed:2.8, name:'Squirrel', exp:0 },
  [E.FROG]: { w:14, h:10, hp:5, dmg:0, def:0, color:'#4aa84a', speed:2.4, name:'Frog', exp:0 },
  [E.GOLDFISH]: { w:14, h:10, hp:5, dmg:0, def:0, color:'#e89030', speed:2.2, name:'Goldfish', exp:0 },
  [E.TURTLE]: { w:22, h:14, hp:5, dmg:0, def:0, color:'#5c9a4a', speed:1.2, name:'Turtle', exp:0 },
  [E.SKELETON]: { w:20, h:34, hp:60, dmg:20, def:8, color:'#e8e8e8', speed:1.3, name:'Skeleton', exp:3 },
  [E.PINKY]: { w:26, h:20, hp:150, dmg:5, def:5, color:'#ff9ad8', speed:1.9, name:'Pinky', exp:4 },
  [E.MOTHERSLIME]: { w:40, h:30, hp:90, dmg:20, def:7, color:'#6ac46c', speed:1.2, name:'Mother Slime', exp:6 },
  [E.BLUESLIME]: { w:22, h:16, hp:25, dmg:7, def:2, color:'#5aa0e6', speed:1.7, name:'Blue Slime', exp:1 },
  [E.MANEATER]: { w:26, h:28, hp:110, dmg:34, def:10, color:'#3a8a3a', speed:0, name:'Man Eater', exp:5 },
  [E.MEDUSA]: { w:22, h:32, hp:400, dmg:30, def:20, color:'#9ad0d8', speed:2.2, fly:true, name:'Medusa', exp:8 },
  [E.UNDEADVIKING]: { w:24, h:34, hp:70, dmg:24, def:10, color:'#c8d0d8', speed:1.4, name:'Undead Viking', exp:8 },
  [E.WALLWARRIOR]: { w:24, h:34, hp:420, dmg:46, def:14, color:'#b0b0c0', speed:1.2, name:'Wall Warrior', exp:10 },
  [E.SPIKEBALL]: { w:22, h:22, hp:100, dmg:32, def:100, color:'#9a9aa8', speed:2.4, fly:true, name:'Spike Ball', exp:6 },
  [E.GRANITEELEMENTAL]: { w:24, h:26, hp:40, dmg:24, def:8, color:'#c8b0d8', speed:2.8, fly:true, name:'Granite Elemental', exp:12 },
  [E.BASILISK]: { w:34, h:22, hp:270, dmg:65, def:34, color:'#d8c888', speed:4.2, name:'Basilisk', exp:12 },
  [E.PINKJELLYFISH]: { w:26, h:18, hp:70, dmg:30, def:6, color:'#ff9ad8', speed:2.6, swim:true, glow:true, name:'Pink Jellyfish', exp:3 },
  [E.CRAWDAD]: { w:26, h:16, hp:50, dmg:28, def:6, color:'#d8a878', speed:2.4, name:'Crawdad', exp:3 },
  [E.JUNGLECREEPER]: { w:30, h:18, hp:400, dmg:100, def:28, color:'#4d8a3d', speed:2.6, name:'Jungle Creeper', exp:5 },
  [E.DRBONES]: { w:22, h:36, hp:500, dmg:20, def:10, color:'#e8e0d0', speed:2.0, name:'Doctor Bones', exp:10, shoot:true },
  [E.CRAB]: { w:22, h:16, hp:40, dmg:20, def:10, color:'#c86a4a', speed:3.0, name:'Crab', exp:2 },
  [E.SEASNAIL]: { w:20, h:15, hp:40, dmg:20, def:10, color:'#e0c070', speed:0.7, name:'Sea Snail', exp:1 },
  [E.PIRANHA]: { w:20, h:14, hp:30, dmg:25, def:2, color:'#78b0d8', speed:2.6, swim:true, name:'Piranha', exp:3, fly:true },
  [E.LAVABAT]: { w:18, h:14, hp:160, dmg:50, def:16, color:'#e05c3a', speed:2.8, name:'Lava Bat', exp:4, fly:true },
  [E.WALLCREEPER]: { w:20, h:16, hp:80, dmg:30, def:10, color:'#82624a', speed:2.2, name:'Wall Creeper', exp:2 },
  [E.SALAMANDER]: { w:30, h:15, hp:65, dmg:18, def:10, color:'#b87848', speed:2.3, name:'Salamander', exp:3 },
  [E.BLUEJELLYFISH]: { w:20, h:16, hp:34, dmg:25, def:4, color:'#6aa8e8', speed:1.9, swim:true, glow:true, name:'Blue Jellyfish', exp:3 },
  [E.GREENJELLYFISH]: { w:20, h:16, hp:120, dmg:80, def:30, color:'#5ce87a', speed:1.9, swim:true, glow:true, name:'Green Jellyfish', exp:3 },
  [E.VULTURE]: { w:22, h:14, hp:40, dmg:15, def:4, color:'#8a6a4a', speed:2.6, fly:true, name:'Vulture', exp:4 },
  [E.SHARK]: { w:34, h:16, hp:300, dmg:40, def:2, color:'#5a7a9a', speed:3.0, swim:true, name:'Shark', exp:8 },
  [E.ORCA]: { w:44, h:20, hp:400, dmg:50, def:20, color:'#20242c', speed:3.6, swim:true, name:'Orca', exp:14 },
  [E.SNATCHER]: { w:16, h:34, hp:60, dmg:25, def:10, color:'#4a7a3a', speed:0, name:'Snatcher', exp:6 },
  [E.METEORHEAD]: { w:16, h:16, hp:26, dmg:40, def:6, color:'#e05a2a', speed:2.9, fly:true, glow:true, name:'Meteor Head', exp:7 },
  [E.REDDEVIL]: { w:30, h:40, hp:600, dmg:50, def:40, color:'#c02020', speed:3.0, fly:true, glow:true, name:'Red Devil', exp:40 },
  [E.PENGUIN]: { w:14, h:16, hp:5, dmg:0, def:0, color:'#28303c', speed:0.8, name:'Penguin', exp:0 },
  [E.PURPLESLIME]: { w:22, h:16, hp:40, dmg:12, def:6, color:'#a05ad8', speed:1.4, name:'Purple Slime', exp:4 },
  [E.YELLOWSLIME]: { w:22, h:16, hp:45, dmg:15, def:7, color:'#e8d84a', speed:1.8, name:'Yellow Slime', exp:3 },
  [E.REDSLIME]: { w:22, h:16, hp:35, dmg:12, def:4, color:'#d84848', speed:1.6, name:'Red Slime', exp:5 },
  [E.BLACKSLIME]: { w:22, h:16, hp:45, dmg:15, def:4, color:'#2c2c34', speed:1.2, name:'Black Slime', exp:6 }
};

function makeEntity(type, x, y) {
  var def = ENT_DEF[type] || entityStats();
  var dm = diffScale();
  var e = {
    type: type, x: x, y: y, w: def.w, h: def.h,
    vx: 0, vy: 0, kbVx: 0, kbVy: 0,
    hp: Math.round(def.hp * dm.hp), maxHp: Math.round(def.hp * dm.hp), dmg: Math.round(def.dmg * dm.dmg), def: def.def, color: def.color,
    speed: def.speed, fly: def.fly, ghost: def.ghost, name: def.name, shoot: !!def.shoot,
    onGround: false, flash: 0, dmgCd: 0, dead: false, age: 0,
    timer: 0, state: 0, dir: 1, seed: Math.random() * 100,
    bob: Math.random() * 6.28
  };
  e.init && e.init();
  return e;
}

function spawnEntity(game, type, x, y) {
  var e = makeEntity(type, x, y);
  game.entities.push(e);
  return e;
}

// Damage + knockback + death
function hitEntity(e, dmg, kbx, kby, game) {
  if (e.dead) return;
  if (typeof Net !== 'undefined' && Net.claimHit(e, dmg, false)) { e.flash = 0.1; return; }
  if (e.type === E.WINDYBALLOON && !e.balloonPopped) {
    e.balloonPopped = true;
    e.fly = false;
    e.vy = -2;
    e.flash = 0.1;
    game.fx.push({ type:'break', x:e.x, y:e.y - 28, t:0.2, max:0.2, seed:e.seed, color:'#f06060' });
    AudioSys.play('hit');
    return;
  }
  var reduced = Math.max(1, Math.round(dmg - Math.max(0, e.def - (e.statusDefensePenalty || 0)) * 0.5));
  e.hp -= reduced;
  e.flash = 0.1;
  e.kbVx = (e.kbVx || 0) + kbx;
  e.kbVy = (e.kbVy || 0) + kby;
  game.fx.push({ type: 'spark', x: e.x, y: e.y, t: 0.18, max: 0.18, seed: Math.random() * 100, color: reduced >= 60 ? '#ffb04d' : '#ffe2a8' });
  AudioSys.play('hit');
  if (e.hp <= 0) killEntity(e, game);
}

function killEntity(e, game) {
  if (e.dead) return;
  e.dead = true;
  // Drops
  var drops = dropTable(e.type, game);
  var dm = diffScale();
  for (var i = 0; i < drops.length; i++) {
    var d = drops[i];
    var c = d.count;
    if (dm.coin !== 1 && (d.id === I.COIN || d.id === I.GOLD || d.id === I.PLATINUM)) c = Math.max(1, Math.round(c * dm.coin));
    game.addPickup(e.x + (Math.random() * 24 - 12), e.y + (Math.random() * 12 - 6), d.id, c);
  }
  if (e.type === E.CRIMSLIME && !e.splitDone) {
    e.splitDone = true;
    var sl = 2 + Math.floor(Math.random() * 2);
    for (var si = 0; si < sl; si++) {
      var sp = spawnEntity(game, E.SLIMELING, e.x + (Math.random() * 16 - 8), e.y - 4);
      sp.vx = Math.random() * 4 - 2;
      sp.vy = -4;
    }
  }
  if (e.type === E.MOTHERSLIME && !e.splitDone) {
    e.splitDone = true;
    var ms = 2 + Math.floor(Math.random() * 2);
    for (var mi = 0; mi < ms; mi++) {
      var mp = spawnEntity(game, E.BLUESLIME, e.x + (Math.random() * 20 - 10), e.y - 6);
      mp.vx = Math.random() * 4 - 2;
      mp.vy = -4;
    }
  }
  if (game.bossesDefeated.plantera &&
      ((e.type >= E.PALADIN && e.type <= E.GIANTCURSEDSKULL) || e.type === E.ARMOREDBONES) &&
      Math.random() < 0.33) {
    spawnEntity(game, E.DUNGEONSPIRIT, e.x, e.y - 8);
  }
  game.onEnemyKilled(e);
}

function dropTable(type, game) {
  var r = Math.random();
  var hm = game ? game.hardmode : true;
  var b = game && game.bossesDefeated ? game.bossesDefeated : {};
  var mech = !!(b.twins || b.destroyer || b.skelprime);
  switch (type) {
    case E.SLIME:
      if (r < 0.1) return [{ id: I.HEALINGPOTION, count: 1 }];
      if (r < 0.35) return [{ id: I.GLOWSTONE, count: 1 }];
      if (r < 0.42) return [{ id: I.GEM_RUBY, count: 1 }];
      if (r < 0.5) return [{ id: I.GEM_SAPPHIRE, count: 1 }];
      if (r < 0.58) return [{ id: I.GEM_EMERALD, count: 1 }];
      if (r < 0.66) return [{ id: I.GEM_TOPAZ, count: 1 }];
      if (r < 0.74) return [{ id: I.GEM_AMETHYST, count: 1 }];
      if (r < 0.78) return [{ id: I.GEM_DIAMOND, count: 1 }];
      return [{ id: I.GEL, count: 1 }];
    case E.PINKSLIME: return hm ? [{ id: I.HEALINGPOTION, count: 1 }, { id: I.SOUL_LIGHT, count: 1 }] : [{ id: I.GEL, count: 2 }, { id: I.GEM_RUBY, count: Math.random() < 0.5 ? 1 : 0 }];
    case E.HOPPINJACK: return hm ? [{ id: I.SOUL_NIGHT, count: 1 }, { id: I.PUMPKIN, count: 1 }] : [{ id: I.GEL, count: 1 }];
    case E.ZOMBIE:
      if (r < 0.2) return [{ id: I.WOOD, count: 2 }];
      return [];
    case E.HARDZOMBIE: return [{ id: I.SOUL_NIGHT, count: 1 }, { id: I.IRON, count: 1 }];
    case E.WRATH: return [{ id: I.SOUL_NIGHT, count: 1 }];
    case E.EATEROFSOULS: return hm ? [{ id: I.SOUL_NIGHT, count: 1 }] : [{ id: I.GLOWSTONE, count: 1 }];
    case E.CORRUPTOR: return hm ? [{ id: I.SOUL_NIGHT, count: 2 }] : [{ id: I.GLOWSTONE, count: 2 }];
    case E.DEVOURER: return [{ id: I.GLOWSTONE, count: Math.random() < 0.5 ? 1 : 0 }, { id: I.EBONSTONE, count: 1 }];
    case E.PIXIE: return [{ id: I.SOUL_LIGHT, count: 1 }, { id: I.CRYSTALSHARD, count: Math.random() < 0.4 ? 1 : 0 }, { id: I.GEM_EMERALD, count: Math.random() < 0.2 ? 1 : 0 }];
    case E.UNICORN: return [{ id: I.SOUL_LIGHT, count: 2 }, { id: I.CRYSTALSHARD, count: 1 }];
    case E.CHAOSELEMENTAL: return [{ id: I.SOUL_LIGHT, count: 1 }];
    case E.GASTROPOD: return [{ id: I.SOUL_LIGHT, count: 2 }, { id: I.GLOWSTONE, count: 1 }];
    case E.WYVERN: return [{ id: I.SOUL_FLIGHT, count: 2 }, { id: I.SOUL_LIGHT, count: 1 }, { id: I.SOUL_NIGHT, count: 1 }, { id: I.FEATHER, count: 2 }];
    case E.JUNGLEBAT: return [{ id: I.GLOWSTONE, count: 1 }];
    case E.JUNGLESLIME:
      if (r < 0.3) return [{ id: I.GLOWSTONE, count: 1 }];
      return [];
    case E.HORNET:
      if (r < 0.2) return [{ id:I.VINE, count:1 }];
      if (r < 0.4) return [{ id: I.GLOWSTONE, count: 2 }];
      if (hm && r < 0.45) return [{ id: I.CHLOROPHYTE, count: 1 }];
      return [];
    case E.LIHZARD: return [{ id: I.TEMPLEBRICK, count: 2 }, { id: I.HEALINGPOTION, count: 1 }, { id:I.LIHZAHARDPOWERCELL, count:Math.random() < 0.12 ? 1 : 0 }, { id:I.SOLARTABLETFRAGMENT, count:Math.random() < 0.35 ? 1 : 0 }];
    case E.FLYINGSNAKE: return [{ id: I.TEMPLEBRICK, count: 1 }, { id: I.GLOWSTONE, count: 1 }, { id:I.LIHZAHARDPOWERCELL, count:Math.random() < 0.08 ? 1 : 0 }, { id:I.SOLARTABLETFRAGMENT, count:Math.random() < 0.25 ? 1 : 0 }];
    case E.FRANKENSTEIN: return [{ id: I.IRON, count: 2 }, { id: I.SOUL_NIGHT, count: 1 }];
    case E.REAPER: return [{ id: I.SOUL_NIGHT, count: 2 }, { id: I.ECTOPLASM, count:b.plantera ? 1 : 0 }, { id:I.DEATHSICKLE, count:Math.random() < 0.08 ? 1 : 0 }];
    case E.VAMPIRE: return [{ id: I.SOUL_NIGHT, count: 1 }, { id:I.MOONSTONE, count:Math.random() < 0.08 ? 1 : 0 }, { id:I.BROKENBATWING, count:Math.random() < 0.12 ? 1 : 0 }];
    case E.CORITE: return [{ id: I.FRAG_SOLAR, count: 1 }];
    case E.LUNARFLAME: return [{ id: I.FRAG_NEBULA, count: 1 }];
    case E.MUMMY: return [{ id: I.SAND, count: 2 }];
    case E.LIGHTMUMMY: return [{ id: I.SOUL_LIGHT, count: 1 }];
    case E.DARKMUMMY: return [{ id: I.SOUL_NIGHT, count: 1 }];
    case E.BLOODMUMMY: return [{ id: I.SOUL_NIGHT, count: 1 }];
    case E.SKELETONARCHER: return [{ id: I.IRON, count: 1 }, { id: I.BONE, count: Math.random() < 0.5 ? 1 : 0 }, { id:I.ILLEGALGUNPARTS, count:Math.random() < 0.08 ? 1 : 0 }];
    case E.ARMOREDBONES: return [{ id: I.IRON, count: 2 }, { id: I.BONE, count: 1 }];
    case E.UNDEADMINER: return [{ id: I.IRON, count: 2 }];
    case E.GIANTBAT:
      return [{ id: I.FEATHER, count: Math.random() < 0.5 ? 1 : 0 }];
    case E.TOXICSLUDGE: return [{ id: I.GLOWSTONE, count: 1 }];
    case E.PIGRON: return [{ id: I.GLOWSTONE, count: 1 }];
    case E.ICEGOLEM: return [{ id: I.ICE, count: 3 }, { id: I.SOUL_FLIGHT, count: 1 }];
    case E.ICETORTOISE:
      if (r < 0.15) return [{ id: I.TURTLESHELL, count: 1 }];
      return [{ id: I.ICE, count: 2 }];
    case E.SNOWFLINX: return [{ id: I.ICE, count: 1 }, { id:I.FLINXFUR, count:1 }];
    case E.ICEBAT: return [{ id: I.ICE, count: 1 }];
    case E.ANGLERFISH:
      if (r < 0.2) return [{ id: I.SHARKFIN, count: 1 }];
      if (mech && r < 0.3) return [{ id: I.LIFEFRUIT, count: 1 }];
      return [];
    case E.ARAPAIMA:
      if (mech && r < 0.25) return [{ id: I.LIFEFRUIT, count: 1 }];
      return [];
    case E.DERPLING:
      if (mech && r < 0.2) return [{ id: I.LIFEFRUIT, count: 1 }, { id: I.SILK, count: Math.random() < 0.4 ? 1 : 0 }];
      return [{ id: I.GLOWSTONE, count: 1 }, { id: I.SILK, count: Math.random() < 0.5 ? 1 : 0 }];
    case E.MOSSHORNET:
      if (mech && r < 0.02) return [{ id:I.YELEKS, count:1 }];
      if (r < 0.25) return [{ id: I.GLOWSTONE, count: 2 }, { id: I.SILK, count: 1 }];
      if (mech && r < 0.3) return [{ id: I.LIFEFRUIT, count: 1 }];
      return [{ id: I.SILK, count: Math.random() < 0.5 ? 1 : 0 }];
    case E.GIANTTORTOSE:
      if (r < 0.15) return [{ id: I.TURTLESHELL, count: 1 }];
      return [];
    case E.CRIMSONAXE: return [{ id: I.SOUL_NIGHT, count: 1 }];
    case E.ICHORSTICKER: return [{ id: I.SOUL_NIGHT, count: 1 }, { id: I.ICHOR, count: Math.random() < 0.4 ? 1 : 0 }];
    case E.CLINGER: return [{ id: I.SOUL_NIGHT, count: 1 }];
    case E.CURSEDHAMMER: return [{ id: I.SOUL_NIGHT, count: 2 }];
    case E.MIMIC:
      var mimicLoot = [I.PHILOSOPHERSSTONE, I.STARCLOAK, I.CROSSNECKLACE, I.DUALHOOK];
      return [{ id:mimicLoot[Math.floor(r * mimicLoot.length)], count:1 }, { id:I.HEALINGPOTION, count:1 }];
    case E.HALLOWEDMIMIC:
      var hallowLoot = [I.DAEDALUSSTORMBOW, I.FLYINGKNIFE, I.CRYSTALVILESHARD];
      return [{ id:hallowLoot[Math.floor(r * hallowLoot.length)], count:1 }, { id:I.SOUL_LIGHT, count:3 }];
    case E.CORRUPTMIMIC:
      var corruptLoot = [I.DARTRIFLE, I.CHAINGUILLOTINES, I.CLINGERSTAFF, I.PUTRIDSCENT, I.SCOURGE];
      return [{ id:corruptLoot[Math.floor(r * corruptLoot.length)], count:1 }, { id:I.SOUL_NIGHT, count:3 }];
    case E.CRIMSONMIMIC:
      var crimsonLoot = [I.DARTPISTOL, I.FETIDBAGHNAKHS, I.LIFEDRAIN, I.FLESHKNUCKLES];
      return [{ id:crimsonLoot[Math.floor(r * crimsonLoot.length)], count:1 }, { id:I.SOUL_NIGHT, count:3 }];
    case E.WOLF: return [{ id: I.WOOD, count: 1 }, { id: I.LEATHER, count: Math.random() < 0.5 ? 1 : 0 }];
    case E.VORTEXIAN: return [{ id: I.FRAG_VORTEX, count: 1 }];
    case E.ALIENHORNET: return [{ id: I.FRAG_VORTEX, count: 1 }];
    case E.NEBULAFLOATER: return [{ id: I.FRAG_NEBULA, count: 1 }];
    case E.STARDJUSTCELL: return [{ id: I.FRAG_STARDUST, count: 1 }];
    case E.PUMPKINSCARECROW: case E.SPLINTERLING:
      return [{ id: I.PUMPKIN, count: Math.random() < 0.5 ? 1 : 2 }];
    case E.FROSTZOMBIE: case E.GINGERBREAD:
      return [{ id: I.SNOW, count: 2 }, { id: I.ICE, count: 1 }];
    case E.MARTIANGRUNT: case E.RAYGUNNER:
      return [{ id:I.COIN, count:2 }, { id:I.ILLEGALGUNPARTS, count:Math.random() < 0.2 ? 1 : 0 }];
    case E.MARTIANPROBE:
      return [];
    case E.HARPY:
      return [{ id: I.FEATHER, count: Math.random() < 0.5 ? 1 : 2 }, { id: I.GEM_SAPPHIRE, count: Math.random() < 0.15 ? 1 : 0 }];
    case E.LAVASLIME:
      if (r < 0.3) return [{ id: I.HELLSTONE, count: 1 }];
      return [{ id: I.OBSIDIAN, count: 1 }];
    case E.HELLBAT:
      if (hm && r < 0.02) return [{ id:I.HELLFIRE, count:1 }];
      if (r < 0.2) return [{ id: I.HELLSTONE, count: 1 }];
      return [];
    case E.VOODOODEMON:
      return [{ id: I.GUIDEVOODOODOLL, count: 1 }];
    case E.DEMON:
      if (r < 0.05) return [{ id: I.DEMONSCYTHE, count: 1 }];
      if (r < 0.3) return [{ id: I.HELLSTONE, count: 1 }];
      if (r < 0.45) return [{ id: I.ASH, count: 2 }];
      return [];
    case E.FIREIMP:
      if (r < 0.3) return [{ id: I.HELLSTONE, count: 1 }];
      if (r < 0.45) return [{ id: I.ASH, count: 2 }];
      return [];
    case E.BONESERPENT:
      return [{ id: I.HELLSTONE, count: 2 }, { id: I.OBSIDIAN, count: 1 }];
    case E.CRIMERA:
      if (r < 0.3) return [{ id: I.CRIMTANE, count: 1 }];
      return [];
    case E.FACEMONSTER:
      return [{ id: I.CRIMSTONE, count: 2 }, { id: I.CRIMTANE, count: Math.random() < 0.4 ? 1 : 0 }];
    case E.HERPLING:
      return [{ id: I.CRIMTANE, count: 1 }, { id: I.ICHOR, count: Math.random() < 0.2 ? 1 : 0 }];
    case E.BLOODCRAWLER:
      return [{ id: I.CRIMTANE, count: Math.random() < 0.3 ? 1 : 0 }];
    case E.BLACKRECLUSE:
      return [{ id:I.SPIDERSILK, count:1 + Math.floor(Math.random() * 2) }];
    case E.GRANITEGOLEM:
      return [{ id: I.GRANITE, count: 3 }];
    case E.MARBLEGOLEM:
      return [{ id: I.MARBLE, count: 3 }];
    case E.DEMONEYE:
      if (r < 0.5) return [{ id: I.LENS, count: 1 }];
      return [];
    case E.CAVEBAT:
      return [];
    case E.GOBLIN:
      if (r < 0.2) return [{ id: I.GEL, count: 1 }];
      if (r < 0.3) return [{ id: I.IRON, count: 1 }];
      return [];
    case E.CORRUPTCRIMSONFLYER:
      return [{ id: I.GLOWSTONE, count: Math.random() < 0.3 ? 1 : 0 }];
    case E.CURSEDSKULL:
      if (r < 0.4) return [{ id: I.BONE, count: 1 }, { id: I.BONE, count: Math.random() < 0.3 ? 1 : 0 }];
      return [{ id: I.BONE, count: 1 }];
    case E.ANGRYBONES:
      if (r < 0.5) return [{ id: I.BONE, count: 1 }, { id: I.GOLD, count: Math.random() < 0.15 ? 1 : 0 }];
      return [{ id: I.BONE, count: 1 }];
    case E.DARKCASTER:
      if (r < 0.35) return [{ id: I.BONE, count: 2 }, { id: I.GEM_AMETHYST, count: Math.random() < 0.2 ? 1 : 0 }];
      return [{ id: I.BONE, count: 1 }];
    case E.DUNGEONSLIME:
      if (r < 0.4) return [{ id: I.GEL, count: 1 }, { id: I.DUNGEONBRICK, count: Math.random() < 0.3 ? 1 : 0 }];
      return [{ id: I.GEL, count: 1 }];
    case E.ANTLION: case E.ANTLIONCHARGER:
      if (r < 0.1) return [{ id: I.AMBER, count: 1 }];
      if (r < 0.4) return [{ id: I.SANDSTONE, count: 1 }];
      if (r < 0.55) return [{ id: I.SAND, count: 2 }];
      return [];
    case E.ICESLIME:
      if (hm && r < 0.02) return [{ id:I.AMAROK, count:1 }];
      return [{ id: I.GEL, count: 1 }, { id: I.ICE, count: Math.random() < 0.5 ? 1 : 0 }];
    case E.DUNGEONSCORPION:
      if (r < 0.4) return [{ id: I.SANDSTONE, count: 1 }];
      return [{ id: I.SAND, count: 1 }];
    case E.GOBLINSCOUT:
      return [{ id:I.TATTEREDCLOTH, count:1 + Math.floor(Math.random() * 2) }];
    case E.GOBLINPEON: case E.GOBLINTHIEF: case E.GOBLINARCHER: case E.GOBLINWARRIOR: case E.GOBLINSORCERER:
      if (r < 0.65) return [{ id: I.GEL, count: 1 }];
      return [{ id: I.GOLD, count: 1 }];
    case E.GOBLINSUMMONER:
      var summonLoot = [I.SHADOWFLAMEBOW, I.SHADOWFLAMEKNIFE, I.SHADOWFLAMEHEXDOLL];
      return [{ id:summonLoot[Math.floor(Math.random() * summonLoot.length)], count:1 }, { id:I.HEALINGPOTION, count:1 }];
    case E.GOBLINWARLOCK:
      return [{ id: I.TATTEREDCLOTH, count: 3 }, { id: I.HEALINGPOTION, count: 1 }];
    case E.PIRATEDECKHAND: case E.PIRATECORSAIR: case E.PIRATEDEADEYE:
      if (r < 0.5) return [{ id: I.GOLD, count: 3 + Math.floor(Math.random() * 3) }];
      if (r < 0.7) return [{ id: I.PIRATEMAP, count: Math.random() < 0.03 ? 1 : 0 }];
      return [{ id: I.COIN, count: 2 + Math.floor(Math.random() * 4) }, { id:I.COINGUN, count:Math.random() < 0.01 ? 1 : 0 }];
    case E.PIRATESHARK:
      if (r < 0.5) return [{ id: I.SHARKFIN, count: 1 }];
      return [{ id: I.GOLD, count: 2 }];
    case E.PIRATECAPTAIN:
      return [{ id: I.GOLD, count: 10 + Math.floor(Math.random() * 8) }, { id: I.PIRATEMAP, count: 1 }];
    case E.SWAMPTHING: case E.WEREWOLF:
      return [{ id: I.SOUL_NIGHT, count: 1 }];
    case E.EYEBALL:
      return [{ id:I.EYESPRING, count:r < 0.12 ? 1 : 0 }, { id:I.LENS, count:1 }];
    case E.MOTHRON:
      return [{ id: I.BROKENHEROSWORD, count: 1 }, { id: I.ECTOPLASM, count: 2 }, { id: I.SOUL_LIGHT, count: 1 }];
    case E.CREATUREFROMDEEP:
      return [{ id:I.NEPTUNESSHELL, count:Math.random() < 0.08 ? 1 : 0 }, { id:I.SOUL_NIGHT, count:1 }];
    case E.FRITZ: case E.POSSESSED: case E.BABYMOTHRON:
      return [{ id:I.SOUL_NIGHT, count:1 }];
    case E.BUTCHER:
      return [{ id:I.BUTCHERSCHAINSAW, count:r < 0.12 ? 1 : 0 }, { id:I.SOUL_NIGHT, count:1 }];
    case E.DEADLYSPHERE:
      return [{ id:I.DEADLYSPHERESTAFF, count:Math.random() < 0.1 ? 1 : 0 }, { id:I.SOUL_NIGHT, count:1 }];
    case E.DRMANFLY:
      return [{ id:I.TOXICFLASK, count:Math.random() < 0.1 ? 1 : 0 }, { id:I.SOUL_NIGHT, count:1 }];
    case E.NAILHEAD:
      return [{ id:I.NAILGUN, count:Math.random() < 0.1 ? 1 : 0 }, { id:I.SOUL_NIGHT, count:1 }];
    case E.PSYCHO:
      return [{ id:I.PSYCHOKNIFE, count:Math.random() < 0.1 ? 1 : 0 }, { id:I.SOUL_NIGHT, count:1 }];
    case E.BLOODZOMBIE:
      return [{ id:I.BLOODYTEAR, count:r < 0.08 ? 1 : 0 }, { id:I.SHARKTOOTHNECKLACE, count:r > 0.96 ? 1 : 0 }];
    case E.DRIPPLER:
      return [{ id:I.BLOODYTEAR, count:r < 0.1 ? 1 : 0 }, { id:I.CHUMCASTER, count:r > 0.95 ? 1 : 0 }];
    case E.WANDERINGEYEFISH:
      return [{ id:I.SHARKTOOTHNECKLACE, count:r < 0.12 ? 1 : 0 }, { id:I.CHUMCASTER, count:r > 0.9 ? 1 : 0 }];
    case E.ZOMBIEMERMAN:
      return [{ id:I.BLOODYTEAR, count:r < 0.15 ? 1 : 0 }, { id:I.HEALINGPOTION, count:1 }];
    case E.DREADNAUTILUS:
      return [{ id:I.SANGUINESTAFF, count:1 }, { id:I.BLOODYTEAR, count:1 }, { id:I.HEALINGPOTION, count:2 }];
    case E.BRIDE: case E.GROOM:
      return [{ id:I.BLOODYTEAR, count:r < 0.12 ? 1 : 0 }, { id:I.GOLD, count:1 }];
    case E.CLOWN:
      var clownLoot = [I.BANANARANG, I.KOCANNON];
      return [{ id:clownLoot[Math.floor(Math.random() * clownLoot.length)], count:r < 0.2 ? 1 : 0 }, { id:I.BLOODYTEAR, count:r > 0.9 ? 1 : 0 }];
    case E.BLOODEEL:
      return [{ id:Math.random() < 0.5 ? I.HAEMORRHAXE : I.DRIPPLERCRIPPLER, count:1 }, { id:I.BLOODYTEAR, count:1 }];
    case E.HEMOGOBLINSHARK:
      return [{ id:Math.random() < 0.5 ? I.HAEMORRHAXE : I.BLOODTHORN, count:1 }, { id:I.BLOODYTEAR, count:1 }];
    case E.SNOWMANGANGSTA: case E.MISTERSTABBY: case E.SNOWBALLA:
      return [{ id:I.SNOW, count:2 }, { id:I.ICE, count:1 }];
    case E.PIRATECROSSBOWER: case E.PARROT:
      return [{ id:I.GOLD, count:2 + Math.floor(Math.random() * 3) }, { id:I.COIN, count:2 }, { id:I.COINGUN, count:Math.random() < 0.01 ? 1 : 0 }];
    case E.MARTIANWALKER: case E.MARTIANDRONE: case E.TESLATURRET:
      return [{ id:I.COIN, count:3 }, { id:I.ILLEGALGUNPARTS, count:Math.random() < 0.25 ? 1 : 0 }];
    case E.MARTIANOFFICER: case E.BRAINSCRAMBLER:
      return [{ id:I.COIN, count:3 }, { id:I.ILLEGALGUNPARTS, count:Math.random() < 0.3 ? 1 : 0 }];
    case E.MARTIANENGINEER:
      var engineerLoot = [I.LASERDRILL, I.ANTIGRAVITYHOOK];
      return [{ id:engineerLoot[Math.floor(Math.random() * engineerLoot.length)], count:r < 0.18 ? 1 : 0 }, { id:I.ILLEGALGUNPARTS, count:1 }];
    case E.GIGAZAPPER:
      return [{ id:I.CHARGEDBLASTER, count:r < 0.18 ? 1 : 0 }, { id:I.COIN, count:5 }];
    case E.SCUTLIXGUNNER:
      return [{ id:I.BRAINSCRAMBLERMOUNT, count:r < 0.2 ? 1 : 0 }, { id:I.COIN, count:5 }];
    case E.HELLHOUND: case E.POLTERGEIST: case E.HEADLESSHORSEMAN:
      return [{ id:I.PUMPKIN, count:2 }, { id:I.ECTOPLASM, count:Math.random() < 0.35 ? 1 : 0 }];
    case E.ZOMBIEELF: case E.ELFARCHER: case E.KRAMPUS: case E.ELFCOPTER:
      return [{ id:I.SNOW, count:2 }, { id:I.ECTOPLASM, count:Math.random() < 0.3 ? 1 : 0 }];
    case E.NUTCRACKER: case E.FLOCKO: case E.YETI:
      return [{ id:I.SNOW, count:2 + Math.floor(Math.random() * 3) }, { id:I.ECTOPLASM, count:Math.random() < 0.4 ? 1 : 0 }];
    case E.PRESENTMIMIC:
      return [{ id:I.GOLD, count:5 + Math.floor(Math.random() * 5) }, { id:I.ECTOPLASM, count:2 }];
    case E.SELENIAN: return [{ id:I.FRAG_SOLAR, count:1 }];
    case E.STORMDIVER: return [{ id:I.FRAG_VORTEX, count:1 }];
    case E.PREDICTOR: return [{ id:I.FRAG_NEBULA, count:1 }];
    case E.STARGAZER: return [{ id:I.FRAG_STARDUST, count:1 }];
    case E.CRAWLTIPEDE: return [{ id:I.FRAG_SOLAR, count:2 }];
    case E.ALIENQUEEN: return [{ id:I.FRAG_VORTEX, count:2 }];
    case E.EVOLUTIONBEAST: return [{ id:I.FRAG_NEBULA, count:2 }];
    case E.FLOWINVADER: return [{ id:I.FRAG_STARDUST, count:2 }];
    case E.FLYINGFISH: return [{ id:I.SHARKFIN, count:r < 0.2 ? 1 : 0 }];
    case E.ANGRYNIMBUS: return [{ id:I.NIMBUSROD, count:r < 0.1 ? 1 : 0 }, { id:I.SOUL_LIGHT, count:1 }];
    case E.ANGRYTUMBLER: return [{ id:I.SAND, count:2 }, { id:I.SANDSTONE, count:r < 0.2 ? 1 : 0 }];
    case E.SANDELEMENTAL: return [{ id:I.FORBIDDENFRAGMENT, count:1 + Math.floor(Math.random() * 2) }, { id:I.SANDSTONE, count:2 }];
    case E.ANGRYDANDELION:
      return [{ id:I.DAYBLOOM, count:r < 0.5 ? 1 + Math.floor(Math.random() * 2) : 0 }];
    case E.WINDYBALLOON:
      var windyDrops = [{ id:I.GEL, count:1 + Math.floor(Math.random() * 2) }];
      if (r < 0.125) {
        var windyLoot = [I.BLUEKITE, I.BLUEYELLOWKITE, I.REDKITE, I.REDYELLOWKITE, I.YELLOWKITE, I.BUNNYKITE, I.GOLDFISHKITE, I.PAPERAIRPLANE, I.WHITEPAPERAIRPLANE];
        var windyItem = windyLoot[Math.floor(Math.random() * windyLoot.length)];
        windyDrops.push({ id:windyItem, count:windyItem === I.PAPERAIRPLANE || windyItem === I.WHITEPAPERAIRPLANE ? 2 + Math.floor(Math.random() * 4) : 1 });
      }
      return windyDrops;
    case E.LADYBUG: return [];
    case E.GHOST: return [{ id:I.COIN, count:1 }];
    case E.PALADIN:
      return [{ id:I.ECTOPLASM, count:2 }, { id:I.PALADINSHAMMER, count:Math.random() < 0.2 ? 1 : 0 }, { id:I.PALADINSHIELD, count:Math.random() < 0.2 ? 1 : 0 }];
    case E.TACTICALSKELETON:
      return [{ id:I.ECTOPLASM, count:1 }, { id:I.TACTICALSHOTGUN, count:Math.random() < 0.12 ? 1 : 0 }];
    case E.SKELETONSNIPER:
      return [{ id:I.ECTOPLASM, count:1 }, { id:I.SNIPERRIFLE, count:Math.random() < 0.12 ? 1 : 0 }, { id:I.RIFLESCOPE, count:Math.random() < 0.12 ? 1 : 0 }];
    case E.SKELETONCOMMANDO:
      return [{ id:I.ECTOPLASM, count:1 }, { id:I.ROCKETLAUNCHER, count:Math.random() < 0.12 ? 1 : 0 }];
    case E.RAGGEDCASTER:
      return [{ id:I.ECTOPLASM, count:1 }, { id:I.SPECTRESTAFF, count:Math.random() < 0.12 ? 1 : 0 }];
    case E.NECROMANCER:
      return [{ id:I.ECTOPLASM, count:1 }, { id:I.SHADOWBEAMSTAFF, count:Math.random() < 0.12 ? 1 : 0 }];
    case E.DIABOLIST:
      return [{ id:I.ECTOPLASM, count:1 }, { id:I.INFERNOPORK, count:Math.random() < 0.12 ? 1 : 0 }];
    case E.BONELEE:
      return [{ id:I.ECTOPLASM, count:1 }, { id:I.TABI, count:Math.random() < 0.15 ? 1 : 0 }, { id:I.BLACKBELT, count:Math.random() < 0.15 ? 1 : 0 }];
    case E.GIANTCURSEDSKULL:
      return [{ id:I.ECTOPLASM, count:2 }, { id:I.WISP, count:Math.random() < 0.08 ? 1 : 0 }];
    case E.DUNGEONSPIRIT:
      if (r < 0.05) return [{ id:I.KRAKEN, count:1 }, { id:I.ECTOPLASM, count:1 }];
      return [{ id:I.ECTOPLASM, count:1 + Math.floor(Math.random() * 2) }, { id:I.MORNINGSTAR, count:Math.random() < 0.05 ? 1 : 0 }, { id:I.MAGNETSPHERE, count:Math.random() < 0.08 ? 1 : 0 }];
    case E.CULTISTDEVOTEE: case E.CULTISTARCHER:
      return [];
    case E.SANDSLIME:
      return [{ id:I.SAND, count:1 + Math.floor(Math.random() * 3) }, { id:I.GEL, count:1 + Math.floor(Math.random() * 2) }];
    case E.GIANTWORM:
      if (r < 0.15) return [{ id:I.HEALINGPOTION, count:1 }];
      return [];
    case E.NYMPH:
      return [{ id:I.METALDETECTOR, count:1 }];
    case E.DIGGER:
      return [];
    case E.CRIMSLIME:
      if (r < 0.15) return [{ id:I.ICHOR, count:1 }, { id:I.CRIMTANE, count:1 }];
      if (r < 0.5) return [{ id:I.CRIMTANE, count:1 }];
      return [];
    case E.SLIMELING:
      if (r < 0.3) return [{ id:I.GEL, count:1 }];
      return [];
    case E.MOTH:
      if (r < 0.12) return [{ id:I.BUTTERFLYWINGS, count:1 }];
      return [];
    case E.CORRUPTSLIME:
      if (game.hardmode && r < 0.25) return [{ id:I.GEL, count:1 }, { id:I.SOUL_NIGHT, count:1 }];
      return [{ id:I.GEL, count:1 + Math.floor(Math.random() * 2) }];
    case E.SPIKEDJUNGLESLIME: case E.SPIKEDICESLIME:
    case E.PURPLESLIME: case E.YELLOWSLIME: case E.REDSLIME: case E.BLACKSLIME:
      return [{ id:I.GEL, count:1 + Math.floor(Math.random() * 2) }];
    case E.SHARK:
      return [{ id:I.SHARKFIN, count:1 }, { id:I.GEL, count:1 }];
    case E.UMBRELLASLIME:
      return [{ id:I.UMBRELLA, count:1 }, { id:I.GEL, count:1 }];
    case E.DUNESPLICER: case E.ANTLIONSWARMER:
      return [];
    case E.SPOREZOMBIE:
      return [{ id:I.MUSHROOM, count:1 + Math.floor(Math.random() * 2) }];
    case E.ICEELEMENTAL:
      return [{ id:I.ICE, count:1 + Math.floor(Math.random() * 2) }, { id:I.FLINXFUR, count:Math.random() < 0.25 ? 1 : 0 }];
    case E.SQUID:
      return [{ id:I.GLOWSTONE, count:1 }, { id:I.HEALINGPOTION, count:Math.random() < 0.1 ? 1 : 0 }];
    case E.BUNNY: case E.BIRD: case E.SQUIRREL: case E.FROG:
    case E.GOLDFISH: case E.TURTLE:
      return [];
    case E.SKELETON: case E.UNDEADVIKING: case E.WALLWARRIOR:
      return [{ id:I.BONE, count:Math.random() < 0.6 ? 1 : 0 }, { id:I.IRON, count:Math.random() < 0.2 ? 1 : 0 }];
    case E.PINKY:
      return [{ id:I.GEL, count:3 }];
    case E.MOTHERSLIME: case E.BLUESLIME:
      return [{ id:I.GEL, count:2 }];
    case E.MANEATER:
      return [{ id:I.VINE, count:1 + Math.floor(Math.random() * 2) }];
    case E.MEDUSA:
      return [{ id:I.STONE, count:1 + Math.floor(Math.random() * 2) }, { id:I.GOLD, count:Math.random() < 0.1 ? 1 : 0 }];
    case E.SPIKEBALL:
      return [{ id:I.BONE, count:Math.random() < 0.5 ? 1 : 0 }];
    case E.GRANITEELEMENTAL:
      return [{ id:I.GRANITE, count:1 + Math.floor(Math.random() * 2) }];
    case E.BASILISK:
      return [{ id:I.SAND, count:2 }, { id:I.GOLD, count:Math.random() < 0.05 ? 1 : 0 }];
    case E.PINKJELLYFISH: case E.BLUEJELLYFISH: case E.GREENJELLYFISH:
      return [{ id:I.GLOWSTONE, count:Math.random() < 0.4 ? 1 : 0 }];
    case E.CRAWDAD: case E.CRAB: case E.SEASNAIL: case E.PIRANHA: case E.WALLCREEPER: case E.SALAMANDER:
      return [];
    case E.LAVABAT:
      return [{ id:I.HELLSTONE, count:Math.random() < 0.35 ? 1 : 0 }];
    case E.JUNGLECREEPER:
      return [{ id:I.VINE, count:Math.random() < 0.5 ? 1 : 0 }];
    case E.DRBONES:
      return [{ id:I.GRAPPLINGHOOK, count:Math.random() < 0.1 ? 1 : 0 }, { id:I.HEALINGPOTION, count:Math.random() < 0.1 ? 1 : 0 }];
    default: return [];
  }
}

// Contact damage to player
function contactCheck(e, game) {
  if (e.dead || e.dmg <= 0) return;
  if (e.dmgCd > 0) { e.dmgCd -= 1 / 60; return; }
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  var dx = Math.abs(p.x - e.x), dy = Math.abs(p.y - e.y);
  if (dx < (p.w + e.w) / 2 - 2 && dy < (p.h + e.h) / 2 - 2) {
    game.damagePlayer(e.dmg, e, e.x < p.x ? 4 : -4);
    e.dmgCd = 0.8;
  }
}

// Generic hop AI for slimes
function slimeStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  var dx = p.x - e.x;
  e.dir = dx >= 0 ? 1 : -1;
  e.vx = e.dir * e.speed * 0.35;
  e.timer -= 1 / 60;
  if (e.onGround && e.timer <= 0) {
    e.vy = -(8 + Math.random() * 3);
    e.vx = e.dir * e.speed * (2 + Math.random());
    e.timer = 1.0 + Math.random() * 0.8;
  }
}

// Walk AI for zombies
function zombieStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  var dx = p.x - e.x;
  e.dir = dx >= 0 ? 1 : -1;
  e.vx = lerp(e.vx, e.dir * e.speed, 0.1);
  if (e.onGround && Math.abs(dx) < 4 * TILE && Math.random() < 0.02) e.vy = -7;
}

// Ghost flight (wraith) passes through walls
function ghostStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  var dx = p.x - e.x, dy = p.y - e.y;
  var d = Math.sqrt(dx * dx + dy * dy) || 1;
  e.vx = (dx / d) * e.speed;
  e.vy = (dy / d) * e.speed;
  e.x += e.vx; e.y += e.vy;
}

// Jellyfish swim: gentle floating bobbing toward the player when in water
function jellyfishStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  var dx = p.x - e.x, dy = p.y - e.y;
  var d = Math.sqrt(dx * dx + dy * dy) || 1;
  e.wave = (e.wave || 0) + 0.06;
  var depth = Math.floor(e.y / TILE);
  var belowWater = game.world.get(Math.floor(e.x / TILE), depth) === T.WATER || game.world.get(Math.floor(e.x / TILE), depth + 1) === T.WATER;
  e.vx = lerp(e.vx, (dx / d) * e.speed * 0.6, 0.03);
  e.vy = Math.sin(e.wave) * e.speed * 0.5 + (dy / d) * e.speed * 0.25;
  if (belowWater) {
    e.x += e.vx; e.y += e.vy;
  } else {
    e.vx = 0;
    physicsStep(e, game);
  }
}

// Fly toward player with sine bob
function flyStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  var dx = p.x - e.x, dy = p.y - e.y;
  var d = Math.sqrt(dx * dx + dy * dy) || 1;
  e.bob += 0.06;
  e.vx = (dx / d) * e.speed;
  e.vy = (dy / d) * e.speed + Math.sin(e.bob) * 0.8;
  physicsStep(e, game, { noGrav: true });
}

function nymphStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  var dx = p.x - e.x, dy = p.y - e.y;
  var d = Math.sqrt(dx * dx + dy * dy) || 1;
  if (d < 320) {
    e.dir = dx >= 0 ? -1 : 1;
    e.vx = lerp(e.vx, e.dir * e.speed, 0.1);
    if (e.onGround && Math.random() < 0.02) e.vy = -6.5;
  } else {
    e.vx = 0;
    e.dir = dx >= 0 ? 1 : -1;
  }
}

function flyStepNoCol(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  var dx = p.x - e.x, dy = p.y - e.y;
  var d = Math.sqrt(dx * dx + dy * dy) || 1;
  e.bob += 0.06;
  e.x += (dx / d) * e.speed;
  e.y += (dy / d) * e.speed + Math.sin(e.bob) * 0.5;
}

function maneaterStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  e.attackCd = (e.attackCd || Math.random() * 1.5) - 1 / 60;
  if (e.attackCd <= 0 && dist(e.x, e.y, p.x, p.y) < 360) {
    e.attackCd = 1.6;
    var ang = Math.atan2(p.y - e.y, p.x - e.x);
    game.projectiles.add({
      x:e.x, y:e.y, vx:Math.cos(ang) * 4.5, vy:Math.sin(ang) * 4.5,
      dmg:Math.round(22 * diffScale().dmg), type:P.STINGER, owner:'enemy', life:4, dead:false, color:'#6ad06a'
    });
    AudioSys.play('spit');
  }
}

function rangedWalkerStep(e, game, projectile, shotSpeed, damage, cooldown, color) {
  damage = Math.round(damage * diffScale().dmg);
  zombieStep(e, game);
  physicsStep(e, game);
  e.attackCd = (e.attackCd || Math.random() * cooldown) - 1 / 60;
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  if (e.attackCd <= 0 && dist(e.x, e.y, p.x, p.y) < 520) {
    e.attackCd = cooldown;
    var ang = Math.atan2(p.y - 8 - e.y, p.x - e.x);
    game.projectiles.add({
      x:e.x, y:e.y - 10, vx:Math.cos(ang) * shotSpeed, vy:Math.sin(ang) * shotSpeed,
      dmg:damage, type:projectile, owner:'enemy', life:4, dead:false, color:color
    });
    AudioSys.play(projectile === P.GUNBULLET || projectile === P.ROCKET ? 'laser' : 'magic');
  }
}

function ghostShooterStep(e, game, projectile, damage, color) {
  damage = Math.round(damage * diffScale().dmg);
  ghostStep(e, game);
  e.attackCd = (e.attackCd || 1.5) - 1 / 60;
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  if (e.attackCd <= 0 && dist(e.x, e.y, p.x, p.y) < 480) {
    e.attackCd = 2.4;
    var ang = Math.atan2(p.y - e.y, p.x - e.x);
    game.projectiles.add({
      x:e.x, y:e.y, vx:Math.cos(ang) * 4.2, vy:Math.sin(ang) * 4.2,
      dmg:damage, type:projectile, owner:'enemy', life:5, dead:false, color:color
    });
    AudioSys.play('magic');
  }
}

function angryDandelionStep(e, game) {
  e.vx = 0;
  physicsStep(e, game);
  if (e.attackCd === undefined) e.attackCd = 0.3;
  e.attackCd -= 1 / 60;
  var windDir = game.weather && game.weather.windSpeed < 0 ? -1 : 1;
  var dx = game.player.x - e.x, dy = game.player.y - e.y;
  if (e.attackCd <= 0 && dx * windDir > 0 && Math.abs(dx) < 1000 && Math.abs(dy) < 200) {
    e.attackCd = 0.67;
    var count = 1 + Math.floor(Math.random() * 3);
    for (var i = 0; i < count; i++) {
      game.projectiles.add({
        x:e.x + windDir * 8, y:e.y - 22 + i * 3,
        vx:windDir * (4.2 + Math.random() * 1.4), vy:(Math.random() - 0.5) * 1.4,
        dmg:14, type:P.DANDELIONSEED, owner:'enemy', life:4, dead:false
      });
    }
  }
}

function windyBalloonStep(e, game) {
  if (e.balloonPopped) {
    slimeStep(e, game);
    physicsStep(e, game);
    return;
  }
  var windDir = game.weather && game.weather.windSpeed < 0 ? -1 : 1;
  var strength = game.weather ? Math.abs(game.weather.windSpeed || 20) : 20;
  e.bob += 0.05;
  e.vx = windDir * (1.2 + strength / 18);
  e.vy = Math.sin(e.bob) * 0.45 + 0.08;
  e.x += e.vx;
  e.y += e.vy;
  if (Math.abs(e.x - game.player.x) > 1000) { e.dead = true; return; }
  if (game.world.solidAt(e.x, e.y + 18) || game.world.liquidAt(e.x, e.y)) {
    e.balloonPopped = true;
    e.fly = false;
    e.vy = -1;
  }
}

function ladybugStep(e, game) {
  if (e.gold === undefined) e.gold = Math.random() < 1 / 150;
  var windDir = game.weather && game.weather.windSpeed < 0 ? -1 : 1;
  e.bob += 0.09;
  e.vx = windDir * (0.8 + Math.abs(game.weather.windSpeed || 16) / 20);
  e.vy = Math.sin(e.bob) * 0.7;
  e.x += e.vx;
  e.y += e.vy;
  if (Math.abs(e.x - game.player.x) > 1000) e.dead = true;
}

// Passive critter hop AI (bunny, squirrel, frog, turtle)
function critterStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  var dx = p.x - e.x;
  e.critterAge = (e.critterAge || 0) + 1 / 60;
  if (e.critterAge > 75) { e.dead = true; return; }
  if (Math.abs(dx) > 1200 || Math.abs(p.y - e.y) > 700) { e.dead = true; return; }
  if (e.fleeT === undefined) e.fleeT = 0;
  e.fleeT -= 1 / 60;
  if (Math.abs(dx) < 200) {
    e.dir = dx >= 0 ? -1 : 1;
    e.fleeT = 1.2;
  }
  if (e.onGround && e.timer <= 0) {
    if (e.fleeT > 0) {
      e.vy = -(8 + Math.random() * 2);
      e.vx = e.dir * (3 + Math.random());
      e.timer = 0.5 + Math.random() * 0.4;
    } else if (Math.random() < 0.03) {
      e.vy = -(5 + Math.random() * 3);
      e.vx = (Math.random() - 0.5) * 2;
      e.timer = 0.6 + Math.random() * 0.6;
    } else {
      e.vx = 0;
    }
  }
}

// Passive bird flight AI
function birdStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  var dx = p.x - e.x, dy = p.y - e.y;
  var d = Math.sqrt(dx * dx + dy * dy) || 1;
  e.critterAge = (e.critterAge || 0) + 1 / 60;
  if (e.critterAge > 90 || Math.abs(dx) > 1400) { e.dead = true; return; }
  e.bob += 0.08;
  if (d < 180) {
    e.vx = (dx / d) * -3.2;
    e.vy = (dy / d) * -3.2 + Math.sin(e.bob) * 0.8;
  } else {
    e.vx = lerp(e.vx, Math.sin(e.bob * 0.3) * 1.2, 0.05);
    e.vy = Math.sin(e.bob) * 0.6;
  }
  e.x += e.vx; e.y += e.vy;
}

// Goldfish swim AI
function goldfishStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  var dx = p.x - e.x;
  e.critterAge = (e.critterAge || 0) + 1 / 60;
  if (e.critterAge > 75 || Math.abs(dx) > 1200) { e.dead = true; return; }
  if (game.world.liquidAt(e.x, e.y)) {
    e.bob += 0.08;
    e.vx = (dx >= 0 ? 1 : -1) * (1.4 + Math.random() * 0.4);
    e.vy = Math.sin(e.bob) * 0.7;
  } else {
    e.vx = dx >= 0 ? 1 : -1;
    if (e.onGround && Math.random() < 0.04) e.vy = -6;
  }
}

// Umbrella slime floats on its umbrella
function umbrellaSlimeStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  var dx = p.x - e.x;
  e.bob += 0.04;
  e.dir = dx >= 0 ? 1 : -1;
  e.vx = e.dir * e.speed * 0.4 + Math.sin(e.bob * 0.5) * 0.4;
  e.vy = Math.sin(e.bob) * 0.5;
  e.x += e.vx;
  e.y += e.vy;
  if (Math.abs(dx) > 1200) e.dead = true;
}

// ---------- Per-type update ----------
function enemyStep(e, game) {
  e.age += 1 / 60;
  e.timer -= 1 / 60;
  if (e.flash > 0) e.flash -= 1 / 60;
  if (e.ooaEnemy) {
    oldOnesArmyEnemyStep(e, game);
    if (!e.ghost) kbDecay(e);
    return;
  }

  switch (e.type) {
    case E.SLIME: case E.PINKSLIME:
      slimeStep(e, game);
      physicsStep(e, game);
      break;
    case E.HOPPINJACK:
      slimeStep(e, game);
      physicsStep(e, game);
      break;
    case E.ZOMBIE: case E.HARDZOMBIE:
      zombieStep(e, game);
      physicsStep(e, game);
      break;
    case E.WRATH:
      ghostStep(e, game);
      break;
    case E.EATEROFSOULS:
      flyStep(e, game);
      break;
    case E.CORRUPTOR:
      flyStep(e, game);
      e.attackCd = (e.attackCd || 0) - 1 / 60;
      if (e.attackCd <= 0 && dist(e.x, e.y, game.player.x, game.player.y) < 300) {
        e.attackCd = 2.2;
        var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
        var ang = Math.atan2(p.y - e.y, p.x - e.x) + (Math.random() - 0.5) * 0.5;
        game.projectiles.add({
          x: e.x, y: e.y, vx: Math.cos(ang) * 3.5, vy: Math.sin(ang) * 3.5,
          dmg: 20, type: P.CURSEDFLAME, owner: 'enemy', life: 4, dead: false, bounces: 2
        });
        AudioSys.play('spawn');
      }
      break;
    case E.PIXIE:
      flyStep(e, game);
      break;
    case E.UNICORN:
      unicornStep(e, game);
      physicsStep(e, game);
      break;
    case E.CHAOSELEMENTAL:
      chaosStep(e, game);
      break;
    case E.GASTROPOD:
      flyStep(e, game);
      e.attackCd = (e.attackCd || 0) - 1 / 60;
      if (e.attackCd <= 0 && dist(e.x, e.y, game.player.x, game.player.y) < 340) {
        e.attackCd = 2.6;
        var p2 = game.player;
        var ang2 = Math.atan2(p2.y - e.y, p2.x - e.x);
        game.projectiles.add({
          x: e.x, y: e.y, vx: Math.cos(ang2) * 2.5, vy: Math.sin(ang2) * 2.5,
          dmg: 25, type: P.LASER, owner: 'enemy', life: 5, dead: false
        });
        AudioSys.play('laser');
      }
      break;
    case E.WYVERN:
      wyvernStep(e, game);
      break;
    case E.JUNGLEBAT:
      flyStep(e, game);
      break;
    case E.SPOREZOMBIE:
      rangedWalkerStep(e, game, P.SPIT, 4.5, 16, 2.6, '#9ad84a');
      break;
    case E.ICEELEMENTAL:
      rangedWalkerStep(e, game, P.FROSTBOLT, 5.5, 26, 2.0, '#bde8ff');
      break;
    case E.SQUID:
      flyStep(e, game);
      break;
    case E.JUNGLESLIME:
      slimeStep(e, game);
      physicsStep(e, game);
      break;
    case E.HORNET:
      hornetStep(e, game);
      break;
    case E.LIHZARD:
      zombieStep(e, game);
      physicsStep(e, game);
      break;
    case E.FLYINGSNAKE:
      flyStep(e, game);
      break;
    case E.FRANKENSTEIN:
      zombieStep(e, game);
      physicsStep(e, game);
      break;
    case E.REAPER:
      ghostStep(e, game);
      break;
    case E.VAMPIRE:
      vampireStep(e, game);
      break;
    case E.CORITE:
      coriteStep(e, game);
      break;
    case E.LUNARFLAME:
      lunarflameStep(e, game);
      break;
    case E.MUMMY: case E.LIGHTMUMMY: case E.DARKMUMMY: case E.BLOODMUMMY:
      zombieStep(e, game);
      physicsStep(e, game);
      break;
    case E.SKELETONARCHER:
      archerStep(e, game);
      physicsStep(e, game);
      break;
    case E.ARMOREDBONES: case E.UNDEADMINER:
      zombieStep(e, game);
      physicsStep(e, game);
      break;
    case E.GIANTBAT: case E.ICEBAT: case E.PIGRON: case E.DERPLING:
      flyStep(e, game);
      break;
    case E.TOXICSLUDGE:
      slimeStep(e, game);
      physicsStep(e, game);
      break;
    case E.ICEGOLEM:
      golemStep(e, game);
      physicsStep(e, game);
      break;
    case E.ICETORTOISE: case E.GIANTTORTOSE:
      tortoiseStep(e, game);
      physicsStep(e, game);
      break;
    case E.SNOWFLINX: case E.WOLF:
      zombieStep(e, game);
      physicsStep(e, game);
      break;
    case E.ANGLERFISH: case E.ARAPAIMA:
      flyStepNoCol(e, game);
      break;
    case E.MOSSHORNET: case E.ALIENHORNET:
      hornetStep(e, game);
      break;
    case E.CRIMSONAXE: case E.CURSEDHAMMER:
      flyStep(e, game);
      break;
    case E.ICHORSTICKER:
      ichorStep(e, game);
      physicsStep(e, game);
      break;
    case E.CLINGER:
      clingerStep(e, game);
      break;
    case E.MIMIC: case E.HALLOWEDMIMIC: case E.CORRUPTMIMIC: case E.CRIMSONMIMIC: case E.PRESENTMIMIC:
      mimicStep(e, game);
      physicsStep(e, game);
      break;
    case E.DEVOURER:
      flyStep(e, game);
      break;
    case E.VORTEXIAN: case E.NEBULAFLOATER: case E.STARDJUSTCELL:
      flyStep(e, game);
      break;
    case E.PUMPKINSCARECROW: case E.FROSTZOMBIE:
      zombieStep(e, game);
      physicsStep(e, game);
      break;
    case E.SPLINTERLING: case E.GINGERBREAD:
      slimeStep(e, game);
      physicsStep(e, game);
      break;
    case E.MARTIANPROBE:
      flyStep(e, game);
      break;
    case E.MARTIANGRUNT: case E.RAYGUNNER:
      zombieStep(e, game);
      physicsStep(e, game);
      e.attackCd = (e.attackCd || 0) - 1 / 60;
      if (e.attackCd <= 0 && dist(e.x, e.y, game.player.x, game.player.y) < 320) {
        e.attackCd = 2.4;
        var pg = game.player;
        var ag = Math.atan2(pg.y - e.y, pg.x - e.x);
        game.projectiles.add({
          x: e.x, y: e.y - 12, vx: Math.cos(ag) * 6, vy: Math.sin(ag) * 6,
          dmg: 30, type: P.LASER, owner: 'enemy', life: 4, dead: false
        });
        AudioSys.play('laser');
      }
      break;
    case E.HARPY:
      flyStep(e, game);
      break;
    case E.LAVASLIME:
      slimeStep(e, game);
      physicsStep(e, game);
      break;
    case E.HELLBAT: case E.LAVABAT:
      flyStep(e, game);
      break;
    case E.DEMON: case E.VOODOODEMON:
      flyStep(e, game);
      e.attackCd = (e.attackCd || 0) - 1 / 60;
      if (e.attackCd <= 0 && dist(e.x, e.y, game.player.x, game.player.y) < 380) {
        e.attackCd = 2.8;
        var pd = game.player;
        var ad = Math.atan2(pd.y - e.y, pd.x - e.x);
        game.projectiles.add({
          x: e.x, y: e.y - 10, vx: Math.cos(ad) * 2.8, vy: Math.sin(ad) * 2.8,
          dmg: 30, type: P.CURSEDFLAME, owner: 'enemy', life: 5, dead: false
        });
        AudioSys.play('spawn');
      }
      break;
    case E.FIREIMP:
      zombieStep(e, game);
      physicsStep(e, game);
      e.attackCd = (e.attackCd || 0) - 1 / 60;
      if (e.attackCd <= 0 && dist(e.x, e.y, game.player.x, game.player.y) < 420) {
        e.attackCd = 3.0;
        var pf = game.player;
        var af = Math.atan2(pf.y - e.y, pf.x - e.x);
        game.projectiles.add({
          x: e.x, y: e.y - 14, vx: Math.cos(af) * 4, vy: Math.sin(af) * 4,
          dmg: 26, type: P.CURSEDFLAME, owner: 'enemy', life: 6, dead: false, bounces: 1
        });
        AudioSys.play('spawn');
      }
      break;
    case E.BONESERPENT:
      wyvernStep(e, game);
      break;
    case E.CRIMERA:
      flyStep(e, game);
      break;
    case E.FACEMONSTER:
      zombieStep(e, game);
      physicsStep(e, game);
      break;
    case E.HERPLING:
      slimeStep(e, game);
      physicsStep(e, game);
      break;
    case E.BLOODCRAWLER: case E.BLACKRECLUSE:
      zombieStep(e, game);
      physicsStep(e, game);
      break;
    case E.GRANITEGOLEM: case E.MARBLEGOLEM:
      golemStep(e, game);
      physicsStep(e, game);
      break;
    case E.DEMONEYE:
      flyStep(e, game);
      break;
    case E.CAVEBAT:
      flyStep(e, game);
      break;
    case E.GOBLIN:
      zombieStep(e, game);
      physicsStep(e, game);
      break;
    case E.CORRUPTCRIMSONFLYER:
      flyStep(e, game);
      break;
    case E.CURSEDSKULL:
      flyStep(e, game);
      e.attackCd = (e.attackCd || 0) - 1 / 60;
      if (e.attackCd <= 0 && dist(e.x, e.y, game.player.x, game.player.y) < 400) {
        e.attackCd = 2.4;
        var pcs = game.player;
        var acs = Math.atan2(pcs.y - e.y, pcs.x - e.x);
        game.projectiles.add({
          x: e.x, y: e.y, vx: Math.cos(acs) * 3.2, vy: Math.sin(acs) * 3.2,
          dmg: 24, type: P.MAGICBOLT, owner: 'enemy', life: 5, dead: false, color: '#b8a0ff'
        });
        AudioSys.play('spawn');
      }
      break;
    case E.ANGRYBONES:
      zombieStep(e, game);
      physicsStep(e, game);
      break;
    case E.DARKCASTER:
      zombieStep(e, game);
      physicsStep(e, game);
      e.attackCd = (e.attackCd || 0) - 1 / 60;
      if (e.attackCd <= 0 && dist(e.x, e.y, game.player.x, game.player.y) < 460) {
        e.attackCd = 2.8;
        var pdc = game.player;
        var adc = Math.atan2(pdc.y - e.y, pdc.x - e.x);
        game.projectiles.add({
          x: e.x, y: e.y - 12, vx: Math.cos(adc) * 4, vy: Math.sin(adc) * 4,
          dmg: 28, type: P.MAGICBOLT, owner: 'enemy', life: 5, dead: false, color: '#a878ff'
        });
        AudioSys.play('spawn');
      }
      break;
    case E.DUNGEONSLIME:
      slimeStep(e, game);
      physicsStep(e, game);
      break;
    case E.ANTLION:
      zombieStep(e, game);
      physicsStep(e, game);
      break;
    case E.ANTLIONCHARGER:
      e.timer = (e.timer || 0) - 1 / 60;
      if (e.timer <= 0) {
        e.dir = game.player.x >= e.x ? 1 : -1;
        e.vx = e.dir * e.speed;
        e.timer = 1.4;
      }
      physicsStep(e, game);
      break;
    case E.ICESLIME:
      slimeStep(e, game);
      physicsStep(e, game);
      break;
    case E.DUNGEONSCORPION:
      zombieStep(e, game);
      physicsStep(e, game);
      break;
    case E.GOBLINSCOUT: case E.GOBLINPEON: case E.GOBLINTHIEF: case E.GOBLINWARRIOR:
      zombieStep(e, game);
      physicsStep(e, game);
      break;
    case E.GOBLINARCHER:
      zombieStep(e, game);
      physicsStep(e, game);
      e.attackCd = (e.attackCd || 0) - 1 / 60;
      if (e.attackCd <= 0 && dist(e.x, e.y, game.player.x, game.player.y) < 360) {
        e.attackCd = 2.2;
        var pga = game.player;
        var aga = Math.atan2(pga.y - e.y, pga.x - e.x) + (Math.random() - 0.5) * 0.4;
        game.projectiles.add({
          x: e.x, y: e.y - 12, vx: Math.cos(aga) * 6, vy: Math.sin(aga) * 6,
          dmg: 18, type: P.ARROW, owner: 'enemy', life: 3, dead: false
        });
        AudioSys.play('bow');
      }
      break;
    case E.GOBLINWARLOCK:
      zombieStep(e, game);
      physicsStep(e, game);
      e.attackCd = (e.attackCd || 0) - 1 / 60;
      if (e.attackCd <= 0 && dist(e.x, e.y, game.player.x, game.player.y) < 460) {
        e.attackCd = 2.6;
        var pgl = game.player;
        var agl = Math.atan2(pgl.y - e.y, pgl.x - e.x);
        game.projectiles.add({
          x: e.x, y: e.y - 14, vx: Math.cos(agl) * 4.5, vy: Math.sin(agl) * 4.5,
          dmg: 30, type: P.MAGICBOLT, owner: 'enemy', life: 5, dead: false, color: '#c85cff'
        });
        AudioSys.play('spawn');
      }
      break;
    case E.GOBLINSORCERER:
      rangedWalkerStep(e, game, P.MAGICBOLT, 4.5, 24, 2.3, '#8fe05a');
      break;
    case E.GOBLINSUMMONER:
      ghostShooterStep(e, game, P.MAGICBOLT, 46, '#c85cff');
      break;
    case E.PIRATEDECKHAND: case E.PIRATECORSAIR:
      zombieStep(e, game);
      physicsStep(e, game);
      break;
    case E.PIRATESHARK:
      flyStep(e, game);
      break;
    case E.PIRATECAPTAIN:
      zombieStep(e, game);
      physicsStep(e, game);
      e.attackCd = (e.attackCd || 0) - 1 / 60;
      if (e.attackCd <= 0 && dist(e.x, e.y, game.player.x, game.player.y) < 420) {
        e.attackCd = 2.8;
        var ppc = game.player;
        var apc = Math.atan2(ppc.y - e.y, ppc.x - e.x) + (Math.random() - 0.5) * 0.3;
        game.projectiles.add({
          x: e.x, y: e.y - 16, vx: Math.cos(apc) * 5.5, vy: Math.sin(apc) * 5.5,
          dmg: 34, type: P.FIREBALL, owner: 'enemy', life: 4, dead: false
        });
        AudioSys.play('spawn');
      }
      break;
    case E.SWAMPTHING: case E.WEREWOLF:
      zombieStep(e, game);
      physicsStep(e, game);
      break;
    case E.EYEBALL:
      flyStep(e, game);
      break;
    case E.PALADIN:
      rangedWalkerStep(e, game, P.CRESCENT, 5.5, 44, 2.1, '#ffd75e');
      break;
    case E.TACTICALSKELETON:
      rangedWalkerStep(e, game, P.GUNBULLET, 7.5, 34, 1.4, '#d8d8d8');
      break;
    case E.SKELETONSNIPER:
      rangedWalkerStep(e, game, P.GUNBULLET, 10, 58, 3.2, '#ff6666');
      break;
    case E.SKELETONCOMMANDO:
      rangedWalkerStep(e, game, P.ROCKET, 5.2, 46, 2.8, '#ff9a3d');
      break;
    case E.RAGGEDCASTER:
      rangedWalkerStep(e, game, P.PHANTOMBOLT, 4.5, 38, 2.1, '#d0c8ff');
      break;
    case E.NECROMANCER:
      rangedWalkerStep(e, game, P.PHANTOMBOLT, 5, 42, 2.4, '#9a5cff');
      break;
    case E.DIABOLIST:
      rangedWalkerStep(e, game, P.FIREBALL, 4.2, 48, 2.7, '#ff603d');
      break;
    case E.BONELEE:
      zombieStep(e, game);
      physicsStep(e, game);
      break;
    case E.GIANTCURSEDSKULL:
      ghostShooterStep(e, game, P.MAGICBOLT, 42, '#c8a8ff');
      break;
    case E.DUNGEONSPIRIT:
      ghostStep(e, game);
      break;
    case E.CULTISTDEVOTEE:
      rangedWalkerStep(e, game, P.MAGICBOLT, 4, 28, 2.5, '#6b8aff');
      break;
    case E.CULTISTARCHER:
      rangedWalkerStep(e, game, P.ARROW, 6, 26, 2.0, '#9db8ff');
      break;
    case E.CREATUREFROMDEEP: case E.FRITZ: case E.POSSESSED: case E.BUTCHER: case E.PSYCHO:
      zombieStep(e, game);
      physicsStep(e, game);
      break;
    case E.DEADLYSPHERE: case E.BABYMOTHRON: case E.FLYINGDUTCHMAN:
      flyStep(e, game);
      break;
    case E.DRMANFLY:
      rangedWalkerStep(e, game, P.SPIT, 4.5, 38, 2.0, '#70d850');
      break;
    case E.NAILHEAD:
      rangedWalkerStep(e, game, P.GUNBULLET, 8, 46, 2.4, '#d0d0d0');
      break;
    case E.BLOODZOMBIE: case E.ZOMBIEMERMAN: case E.BRIDE: case E.GROOM:
      zombieStep(e, game);
      physicsStep(e, game);
      break;
    case E.CLOWN:
      rangedWalkerStep(e, game, P.ROCKET, 5, 48, 2.2, '#ff4058');
      break;
    case E.DRIPPLER:
      flyStep(e, game);
      break;
    case E.WANDERINGEYEFISH:
      flyStepNoCol(e, game);
      break;
    case E.DREADNAUTILUS:
      ghostShooterStep(e, game, P.PHANTOMBOLT, 34, '#ff4058');
      break;
    case E.BLOODEEL:
      wyvernStep(e, game);
      break;
    case E.HEMOGOBLINSHARK:
      flyStepNoCol(e, game);
      break;
    case E.MISTERSTABBY: case E.HELLHOUND: case E.HEADLESSHORSEMAN:
    case E.ZOMBIEELF: case E.KRAMPUS: case E.NUTCRACKER: case E.YETI: case E.SELENIAN:
      zombieStep(e, game);
      physicsStep(e, game);
      break;
    case E.SNOWMANGANGSTA:
      rangedWalkerStep(e, game, P.GUNBULLET, 7, 30, 1.5, '#e8f0f8');
      break;
    case E.SNOWBALLA:
      rangedWalkerStep(e, game, P.FROSTBOLT, 5, 32, 1.8, '#b8dcf0');
      break;
    case E.PIRATECROSSBOWER: case E.ELFARCHER:
      rangedWalkerStep(e, game, P.ARROW, 6.5, 34, 1.8, '#d8c090');
      break;
    case E.PIRATEDEADEYE:
      rangedWalkerStep(e, game, P.GUNBULLET, 9, 44, 2.2, '#ffd080');
      break;
    case E.MARTIANWALKER: case E.STORMDIVER:
      rangedWalkerStep(e, game, P.LASER, 7, 42, 1.5, '#60d8c8');
      break;
    case E.MARTIANOFFICER:
      zombieStep(e, game);
      physicsStep(e, game);
      break;
    case E.MARTIANENGINEER:
      rangedWalkerStep(e, game, P.LASER, 6, 36, 2.0, '#68e8d0');
      e.deployCd = (e.deployCd === undefined ? 4 : e.deployCd) - 1 / 60;
      if (e.deployCd <= 0) {
        var turrets = 0;
        for (var mt = 0; mt < game.entities.length; mt++) if (!game.entities[mt].dead && game.entities[mt].type === E.TESLATURRET) turrets++;
        if (turrets < 2) {
          var turret = spawnEntity(game, E.TESLATURRET, e.x + (e.dir || 1) * 28, e.y);
          turret.eventEnemy = !!e.eventEnemy;
        }
        e.deployCd = 8;
      }
      break;
    case E.GIGAZAPPER:
      rangedWalkerStep(e, game, P.PLASMA, 5.5, 52, 1.35, '#80f0e0');
      break;
    case E.BRAINSCRAMBLER:
      ghostShooterStep(e, game, P.PHANTOMBOLT, 46, '#c878e8');
      break;
    case E.SCUTLIXGUNNER:
      rangedWalkerStep(e, game, P.LASER, 8, 50, 1.25, '#80e8ff');
      break;
    case E.CRAWLTIPEDE:
      crawltipedeStep(e, game);
      break;
    case E.ALIENQUEEN:
      alienQueenStep(e, game);
      break;
    case E.EVOLUTIONBEAST:
      evolutionBeastStep(e, game);
      break;
    case E.FLOWINVADER:
      flowInvaderStep(e, game);
      break;
    case E.TESLATURRET:
      rangedWalkerStep(e, game, P.PLASMA, 5.5, 44, 1.25, '#80e8ff');
      break;
    case E.PREDICTOR:
      rangedWalkerStep(e, game, P.PHANTOMBOLT, 5, 42, 1.6, '#c870e0');
      break;
    case E.PARROT: case E.FLYINGFISH: case E.FLOCKO:
      flyStep(e, game);
      break;
    case E.POLTERGEIST:
      ghostStep(e, game);
      break;
    case E.MARTIANDRONE: case E.ELFCOPTER:
      flyStep(e, game);
      e.attackCd = (e.attackCd || 0) - 1 / 60;
      if (e.attackCd <= 0 && dist(e.x, e.y, game.player.x, game.player.y) < 420) {
        e.attackCd = 1.4;
        var fp = game.player;
        var fa = Math.atan2(fp.y - e.y, fp.x - e.x);
        game.projectiles.add({ x:e.x, y:e.y, vx:Math.cos(fa) * 6, vy:Math.sin(fa) * 6, dmg:38, type:e.type === E.MARTIANDRONE ? P.LASER : P.GUNBULLET, owner:'enemy', life:4, dead:false });
      }
      break;
    case E.STARGAZER:
      ghostShooterStep(e, game, P.MAGICBOLT, 42, '#7898ff');
      break;
    case E.ANGRYNIMBUS:
      ghostShooterStep(e, game, P.MAGICBOLT, 34, '#9aa8b8');
      break;
    case E.ANGRYTUMBLER:
      slimeStep(e, game);
      physicsStep(e, game);
      break;
    case E.SANDELEMENTAL:
      ghostShooterStep(e, game, P.CORITEBOLT, 44, '#e8c878');
      break;
    case E.ANGRYDANDELION:
      angryDandelionStep(e, game);
      break;
    case E.WINDYBALLOON:
      windyBalloonStep(e, game);
      break;
    case E.LADYBUG:
      ladybugStep(e, game);
      break;
    case E.GHOST:
      ghostStep(e, game);
      contactCheck(e, game);
      break;
    case E.SANDSLIME: case E.CRIMSLIME: case E.SLIMELING:
    case E.PURPLESLIME: case E.YELLOWSLIME: case E.REDSLIME: case E.BLACKSLIME:
      slimeStep(e, game);
      physicsStep(e, game);
      break;
    case E.GIANTWORM: case E.DIGGER:
      wyvernStep(e, game);
      break;
    case E.NYMPH:
      nymphStep(e, game);
      physicsStep(e, game);
      break;
    case E.MOTH:
      flyStep(e, game);
      break;
    case E.CORRUPTSLIME: case E.SPIKEDJUNGLESLIME: case E.SPIKEDICESLIME:
      slimeStep(e, game);
      physicsStep(e, game);
      break;
    case E.UMBRELLASLIME:
      umbrellaSlimeStep(e, game);
      break;
    case E.DUNESPLICER:
      wyvernStep(e, game);
      break;
    case E.ANTLIONSWARMER:
      flyStep(e, game);
      break;
    case E.BUNNY: case E.SQUIRREL: case E.FROG: case E.TURTLE: case E.PENGUIN:
      critterStep(e, game);
      physicsStep(e, game);
      break;
    case E.BIRD:
      birdStep(e, game);
      break;
    case E.GOLDFISH:
      goldfishStep(e, game);
      physicsStep(e, game, { noGrav:!!game.world.isWaterAt(e.x, e.y) });
      break;
    case E.MOTHRON:
    case E.LUNARPILLAR:
      if (e.boss) bossStep(e, game);
      break;
    case E.MOURNINGWOOD: case E.PUMPKING:
    case E.EVERSCREAM: case E.SANTANK: case E.ICEQUEEN:
    case E.MARTIANSAUCER:
      if (e.boss) bossStep(e, game);
      break;
    case E.MERCHANT: case E.NURSE: case E.WIZARD: case E.STEAMPUNKER:
    case E.CYBORG: case E.TRUFFLE: case E.PIRATE: case E.WITCHDOCTOR:
    case E.DEMOLITIONIST: case E.DYETRADER: case E.ANGLER: case E.ZOOLOGIST:
    case E.DRYAD: case E.PAINTER: case E.GOLFER: case E.ARMSDEALER:
    case E.TAVERNKEEP: case E.STYLIST: case E.GOBLINTINKERER: case E.CLOTHIER:
    case E.MECHANIC: case E.TAXCOLLECTOR: case E.PARTYGIRL: case E.SANTA:
    case E.PRINCESS:
      e.vx = 0; e.vy = 0;
      physicsStep(e, game);
      break;
    case E.GUIDE:
      e.vx = 0; e.vy = 0;
      physicsStep(e, game);
      break;
    case E.SKELETON: case E.UNDEADVIKING: case E.WALLWARRIOR: case E.BASILISK:
      zombieStep(e, game);
      physicsStep(e, game);
      break;
    case E.PINKY: case E.MOTHERSLIME: case E.BLUESLIME:
      slimeStep(e, game);
      physicsStep(e, game);
      break;
    case E.MEDUSA: case E.SPIKEBALL: case E.GRANITEELEMENTAL:
    case E.VULTURE: case E.METEORHEAD: case E.REDDEVIL:
      flyStep(e, game);
      break;
    case E.PINKJELLYFISH: case E.BLUEJELLYFISH: case E.GREENJELLYFISH: case E.PIRANHA:
    case E.SHARK: case E.ORCA:
      jellyfishStep(e, game);
      break;
    case E.CRAWDAD: case E.JUNGLECREEPER: case E.CRAB: case E.SEASNAIL: case E.WALLCREEPER: case E.SALAMANDER:
      zombieStep(e, game);
      physicsStep(e, game);
      break;
    case E.DRBONES:
      rangedWalkerStep(e, game, P.ARROW, 5.0, 22, 2.2, '#e0d8c8');
      break;
    case E.MANEATER: case E.SNATCHER:
      maneaterStep(e, game);
      break;
  }

  if (e.ghost) {
    // no contact with tiles
  } else {
    kbDecay(e);
  }
  if (!e.ghost && e.type !== E.WYVERN) contactCheck(e, game);
}

function unicornStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  var dx = p.x - e.x;
  e.state = (e.state || 0);
  e.timer -= 1 / 60;
  if (e.state === 0) {
    e.vx *= 0.9;
    e.dir = dx >= 0 ? 1 : -1;
    e.timer = 1.2;
    e.state = 1;
  } else if (e.state === 1) {
    e.vx = 0;
    if (e.timer <= 0) e.state = 2;
  } else if (e.state === 2) {
    e.vx = e.dir * e.speed;
    e.timer = 1.0;
    if (e.timer <= 0) e.state = 0;
  }
}

function chaosStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  e.timer -= 1 / 60;
  if (e.timer <= 0) {
    // teleport near player
    var ang = Math.random() * 6.28;
    var d = 120 + Math.random() * 80;
    var tx = p.x + Math.cos(ang) * d;
    var ty = p.y + Math.sin(ang) * d - 40;
    e.x = tx; e.y = ty;
    e.timer = 1.6 + Math.random() * 1.2;
    game.fx.push({ type: 'teleport', x: e.x, y: e.y, t: 0.3, max: 0.3 });
    AudioSys.play('magic');
  }
  flyStepNoCol(e, game);
}

// Wyvern worm behavior: sinusoidal flight, chases player
function wyvernStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  var dx = p.x - e.x, dy = p.y - e.y;
  var d = Math.sqrt(dx * dx + dy * dy) || 1;
  e.wave = (e.wave || 0) + 0.05;
  var ang = Math.atan2(dy, dx) + Math.sin(e.wave) * 0.35;
  e.vx = Math.cos(ang) * e.speed;
  e.vy = Math.sin(ang) * e.speed;
  e.x += e.vx; e.y += e.vy;

  // segments follow
  if (e.segments) {
    var prevX = e.x, prevY = e.y;
    for (var i = 0; i < e.segments.length; i++) {
      var s = e.segments[i];
      var dx2 = s.x - prevX, dy2 = s.y - prevY;
      var d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2) || 1;
      var sp = 14;
      s.x = prevX + (dx2 / d2) * sp;
      s.y = prevY + (dy2 / d2) * sp;
      prevX = s.x; prevY = s.y;
      if (!s.dead && Math.abs(s.x - game.player.x) < (s.w + game.player.w) / 2 && Math.abs(s.y - game.player.y) < (s.h + game.player.h) / 2) {
        game.damagePlayer(e.dmg, e, 5);
      }
    }
  }
}

function crawltipedeStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  var airborne = !p.onGround && Math.abs(p.vy) > 0.2;
  var tx = airborne ? p.x : p.x + Math.sin(e.age * 1.8) * 180;
  var ty = airborne ? p.y : p.y - 170;
  var dx = tx - e.x, dy = ty - e.y;
  var d = Math.sqrt(dx * dx + dy * dy) || 1;
  e.vx = lerp(e.vx, dx / d * e.speed, 0.12);
  e.vy = lerp(e.vy, dy / d * e.speed, 0.12);
  e.x += e.vx; e.y += e.vy;
  if (e.segments) {
    var prevX = e.x, prevY = e.y;
    for (var i = 0; i < e.segments.length; i++) {
      var s = e.segments[i];
      var sx = s.x - prevX, sy = s.y - prevY;
      var sd = Math.sqrt(sx * sx + sy * sy) || 1;
      s.x = prevX + sx / sd * 14;
      s.y = prevY + sy / sd * 14;
      prevX = s.x; prevY = s.y;
      if (!s.dead && Math.abs(s.x - p.x) < (s.w + p.w) / 2 && Math.abs(s.y - p.y) < (s.h + p.h) / 2) game.damagePlayer(e.dmg, e, 6);
    }
  }
}

function alienQueenStep(e, game) {
  flyStep(e, game);
  e.attackCd = (e.attackCd || 0) - 1 / 60;
  if (e.attackCd <= 0 && dist(e.x, e.y, game.player.x, game.player.y) < 480) {
    e.attackCd = 1.5;
    var ang = Math.atan2(game.player.y - e.y, game.player.x - e.x);
    game.projectiles.add({ x:e.x, y:e.y, vx:Math.cos(ang) * 6, vy:Math.sin(ang) * 6, dmg:46, type:P.LASER, owner:'enemy', life:4, dead:false });
  }
  e.summonCd = (e.summonCd === undefined ? 3 : e.summonCd) - 1 / 60;
  if (e.summonCd <= 0) {
    var hornets = 0;
    for (var i = 0; i < game.entities.length; i++) if (!game.entities[i].dead && game.entities[i].type === E.ALIENHORNET) hornets++;
    if (hornets < 3) {
      var hornet = spawnEntity(game, E.ALIENHORNET, e.x + (Math.random() * 40 - 20), e.y + 18);
      hornet.eventEnemy = true;
    }
    e.summonCd = 4;
  }
}

function evolutionBeastStep(e, game) {
  zombieStep(e, game);
  physicsStep(e, game);
  e.attackCd = (e.attackCd || 0) - 1 / 60;
  if (e.attackCd <= 0 && dist(e.x, e.y, game.player.x, game.player.y) < 520) {
    e.attackCd = 1.7;
    var tx = game.player.x + game.player.vx * 35;
    var ty = game.player.y + game.player.vy * 25;
    var ang = Math.atan2(ty - e.y, tx - e.x);
    for (var i = -1; i <= 1; i++) game.projectiles.add({ x:e.x, y:e.y - 12, vx:Math.cos(ang + i * 0.12) * 5.5, vy:Math.sin(ang + i * 0.12) * 5.5, dmg:48, type:P.PHANTOMBOLT, owner:'enemy', life:5, dead:false });
  }
}

function flowInvaderStep(e, game) {
  ghostStep(e, game);
  e.attackCd = (e.attackCd || 0) - 1 / 60;
  if (e.attackCd <= 0 && dist(e.x, e.y, game.player.x, game.player.y) < 500) {
    e.attackCd = 1.25;
    var base = Math.atan2(game.player.y - e.y, game.player.x - e.x);
    for (var i = -2; i <= 2; i++) game.projectiles.add({ x:e.x, y:e.y, vx:Math.cos(base + i * 0.18) * 5, vy:Math.sin(base + i * 0.18) * 5, dmg:44, type:P.STAR, owner:'enemy', life:4, dead:false });
  }
}

// Hornet: flies at range and shoots stingers
function hornetStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  var dx = p.x - e.x, dy = p.y - e.y;
  var d = Math.sqrt(dx * dx + dy * dy) || 1;
  var want = 160;
  e.bob += 0.06;
  if (d > want) { e.vx = (dx / d) * e.speed; e.vy = (dy / d) * e.speed; }
  else {
    e.vx = lerp(e.vx, -dx / d * e.speed * 0.6, 0.05);
    e.vy = lerp(e.vy, -dy / d * e.speed * 0.6 + Math.sin(e.bob) * 0.8, 0.05);
  }
  physicsStep(e, game, { noGrav: true });
  e.attackCd = (e.attackCd || 0) - 1 / 60;
  if (e.attackCd <= 0 && d < 320) {
    e.attackCd = 2.4;
    var ang = Math.atan2(p.y - e.y, p.x - e.x);
    game.projectiles.add({
      x: e.x, y: e.y, vx: Math.cos(ang) * 3.2, vy: Math.sin(ang) * 3.2,
      dmg: 22, type: P.STINGER, owner: 'enemy', life: 3, dead: false
    });
    AudioSys.play('shoot');
  }
}

// Vampire: swoops in to bite
function vampireStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  var dx = p.x - e.x, dy = p.y - e.y;
  var d = Math.sqrt(dx * dx + dy * dy) || 1;
  e.attackCd = (e.attackCd || 0) - 1 / 60;
  if (e.attackCd <= 0) {
    e.charge = { x: p.x, y: p.y - 10, t: 1.0 };
    e.attackCd = 2.4;
    AudioSys.play('spawn');
  }
  if (e.charge) {
    e.charge.t -= 1 / 60;
    var cx = e.charge.x - e.x, cy = e.charge.y - e.y;
    var cd = Math.sqrt(cx * cx + cy * cy) || 1;
    e.x += (cx / cd) * 7;
    e.y += (cy / cd) * 7;
    if (e.charge.t <= 0) e.charge = null;
  } else {
    e.x += (dx / d) * e.speed * 0.4;
    e.y += (dy / d) * e.speed * 0.4 - 1;
  }
}

// Corite: fiery charge
function coriteStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  var dx = p.x - e.x, dy = p.y - e.y;
  var d = Math.sqrt(dx * dx + dy * dy) || 1;
  e.attackCd = (e.attackCd || 0) - 1 / 60;
  if (e.attackCd <= 0) {
    e.charge = { x: p.x, y: p.y, t: 0.9 };
    e.attackCd = 2.0;
    AudioSys.play('laser');
  }
  if (e.charge) {
    e.charge.t -= 1 / 60;
    var cx = e.charge.x - e.x, cy = e.charge.y - e.y;
    var cd = Math.sqrt(cx * cx + cy * cy) || 1;
    e.x += (cx / cd) * 11;
    e.y += (cy / cd) * 11;
    if (e.charge.t <= 0) e.charge = null;
    if (Math.random() < 0.15) game.fx.push({ type: 'break', x: e.x, y: e.y, color: '#ff9a3d', t: 0.2, max: 0.2, seed: Math.random() * 100 });
  } else {
    e.x += (dx / d) * e.speed;
    e.y += (dy / d) * e.speed;
  }
}

// Nebula Blaze: hovers and fires bolts
function lunarflameStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  var dx = p.x - e.x, dy = p.y - e.y;
  var d = Math.sqrt(dx * dx + dy * dy) || 1;
  flyStep(e, game);
  e.attackCd = (e.attackCd || 0) - 1 / 60;
  if (e.attackCd <= 0 && d < 360) {
    e.attackCd = 2.0;
    var ang = Math.atan2(p.y - e.y, p.x - e.x);
    for (var i = -1; i <= 1; i++) {
      game.projectiles.add({
        x: e.x, y: e.y, vx: Math.cos(ang + i * 0.18) * 4, vy: Math.sin(ang + i * 0.18) * 4,
        dmg: 24, type: P.PHANTOMBOLT, owner: 'enemy', life: 3.5, dead: false
      });
    }
    AudioSys.play('magic');
  }
}

// Archer: walks and fires arrows
function archerStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  var dx = p.x - e.x;
  e.dir = dx >= 0 ? 1 : -1;
  e.vx = lerp(e.vx, e.dir * e.speed, 0.1);
  e.attackCd = (e.attackCd || 0) - 1 / 60;
  if (e.attackCd <= 0 && Math.abs(dx) < 420 && Math.abs(p.y - e.y) < 160) {
    e.attackCd = 2.2;
    var ang = Math.atan2(p.y - e.y, p.x - e.x);
    game.projectiles.add({
      x: e.x, y: e.y - 8, vx: Math.cos(ang) * 6, vy: Math.sin(ang) * 6,
      dmg: 22, type: P.ARROW, owner: 'enemy', life: 3, dead: false, gravity: 0.15
    });
    AudioSys.play('bow');
  }
}

// Ice Golem: shoots a frost bolt
function golemStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  var dx = p.x - e.x;
  e.dir = dx >= 0 ? 1 : -1;
  e.vx = lerp(e.vx, e.dir * e.speed, 0.1);
  e.attackCd = (e.attackCd || 0) - 1 / 60;
  if (e.attackCd <= 0 && Math.abs(dx) < 400 && Math.abs(p.y - e.y) < 200) {
    e.attackCd = 2.4;
    var ang = Math.atan2(p.y - e.y, p.x - e.x);
    game.projectiles.add({
      x: e.x, y: e.y - 10, vx: Math.cos(ang) * 3.5, vy: Math.sin(ang) * 3.5,
      dmg: 30, type: P.MAGICBOLT, owner: 'enemy', life: 4, dead: false, color: '#a8d8f0'
    });
    AudioSys.play('magic');
  }
}

// Tortoise: ambles, then bursts into a charge
function tortoiseStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  var dx = p.x - e.x;
  var d = Math.abs(dx);
  if (e.chargeT > 0) {
    e.chargeT -= 1 / 60;
    e.vx = e.chargeDir * e.speed * 4;
    if (e.chargeT <= 0) e.vx = 0;
  } else {
    e.vx = 0;
    e.dir = dx >= 0 ? 1 : -1;
    e.timer -= 1 / 60;
    if (d < 300 && e.timer <= 0) {
      e.chargeDir = e.dir;
      e.chargeT = 0.6;
      e.timer = 3 + Math.random() * 2;
      AudioSys.play('spawn');
    }
  }
}

// Ichor Sticker: walks and spits ichor
function ichorStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  var dx = p.x - e.x;
  e.dir = dx >= 0 ? 1 : -1;
  e.vx = lerp(e.vx, e.dir * e.speed, 0.1);
  e.attackCd = (e.attackCd || 0) - 1 / 60;
  if (e.attackCd <= 0 && Math.abs(dx) < 360 && Math.abs(p.y - e.y) < 160) {
    e.attackCd = 2.0;
    var ang = Math.atan2(p.y - e.y, p.x - e.x);
    game.projectiles.add({
      x: e.x, y: e.y - 6, vx: Math.cos(ang) * 4, vy: Math.sin(ang) * 4,
      dmg: 26, type: P.STINGER, owner: 'enemy', life: 3, dead: false, color: '#d0d050'
    });
    AudioSys.play('shoot');
  }
}

// Clinger: hangs on the wall and sprays cursed flame
function clingerStep(e, game) {
  e.vx = 0; e.vy = 0;
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  e.attackCd = (e.attackCd || 0) - 1 / 60;
  if (e.attackCd <= 0 && Math.abs(p.y - e.y) < 200) {
    e.attackCd = 1.6;
    var dx = p.x - e.x;
    var ang = Math.atan2(p.y - e.y, dx);
    game.projectiles.add({
      x: e.x, y: e.y, vx: Math.cos(ang) * 5, vy: Math.sin(ang) * 5,
      dmg: 28, type: P.CURSEDFLAME, owner: 'enemy', life: 3, dead: false, bounces: 2
    });
    AudioSys.play('spawn');
  }
}

// Mimic: inert until the player gets close, then lunges
function mimicStep(e, game) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  var dx = p.x - e.x, dy = p.y - e.y;
  var d = Math.sqrt(dx * dx + dy * dy) || 1;
  if (!e.awake && d < 140) {
    e.awake = true;
    AudioSys.play('roar');
  }
  if (!e.awake) { e.vx = 0; return; }
  if (e.type === E.HALLOWEDMIMIC || e.type === E.CORRUPTMIMIC || e.type === E.CRIMSONMIMIC) {
    if (e.shootCd === undefined) e.shootCd = 1.2;
    e.shootCd -= 1 / 60;
    if (e.shootCd <= 0 && d < 440) {
      e.shootCd = 2.0;
      var ang = Math.atan2(p.y - e.y, p.x - e.x);
      var proj = e.type === E.HALLOWEDMIMIC ? P.STAR : (e.type === E.CORRUPTMIMIC ? P.CURSEDFLAME : P.SPIT);
      for (var si = -1; si <= 1; si++) {
        game.projectiles.add({
          x:e.x, y:e.y - 8, vx:Math.cos(ang + si * 0.16) * 5.5, vy:Math.sin(ang + si * 0.16) * 5.5,
          dmg:38, type:proj, owner:'enemy', life:4, dead:false
        });
      }
      AudioSys.play('magic');
    }
  }
  e.attackCd = (e.attackCd || 0) - 1 / 60;
  if (e.attackCd <= 0) {
    e.charge = { x: p.x, y: p.y, t: 1.0 };
    e.attackCd = 2.4;
  }
  if (e.charge) {
    e.charge.t -= 1 / 60;
    var cx = e.charge.x - e.x, cy = e.charge.y - e.y;
    var cd = Math.sqrt(cx * cx + cy * cy) || 1;
    e.x += (cx / cd) * 9;
    e.y += (cy / cd) * 9;
    if (e.charge.t <= 0) e.charge = null;
  }
}

// Init for segmented creatures
function initSegments(e, game, count, color) {
  e.segments = [];
  var x = e.x, y = e.y;
  for (var i = 0; i < count; i++) {
    var s = { x: x - 14 * (i + 1), y: y, w: e.w * 0.8, h: e.h * 0.8, hp: e.maxHp / 3, dead: false, color: color, segmentIndex: i };
    e.segments.push(s);
  }
}

// ---------- Minions (summoner) ----------
var MINION_CAP = 3;

function spawnMinion(game, staff) {
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  // cull dead minions
  for (var i = game.entities.length - 1; i >= 0; i--) {
    var en = game.entities[i];
    if (en.minion && en.dead) game.entities.splice(i, 1);
  }
  // count living minions
  var alive = 0;
  for (var j = 0; j < game.entities.length; j++) {
    if (game.entities[j].minion && !game.entities[j].dead) alive++;
  }
  if (alive >= MINION_CAP + (game.player.inventory.accEffects().minion || 0)) {
    // replace the weakest/oldest
    for (var k = 0; k < game.entities.length; k++) {
      if (game.entities[k].minion && !game.entities[k].dead) {
        game.entities[k].dead = true;
        break;
      }
    }
  }
  var m = {
    minion: staff.minion, boss: null, type: -5,
    x: p.x + (Math.random() * 40 - 20), y: p.y - 40,
    w: 20, h: 20, vx: 0, vy: 0,
    hp: 9999, maxHp: 9999, dmg: Math.round(staff.dmg * p.inventory.damageMultiplier('summon')),
    speed: 5, color: staff.color, name: staff.name,
    onGround: false, flash: 0, dead: false, age: 0,
    attackCd: 0, bob: Math.random() * 6.28, segments: []
  };
  if (m.minion === 'dragon') {
    m.w = 30; m.h = 22;
    for (var s = 0; s < 6; s++) {
      m.segments.push({ x: m.x - 14 * (s + 1), y: m.y, w: 20, h: 14, dead: false, color: staff.color });
    }
  }
  if (m.minion === 'spider') { m.w = 22; m.h = 14; }
  if (m.minion === 'pygmy') { m.w = 22; m.h = 24; }
  if (m.minion === 'cell') { m.w = 18; m.h = 18; }
  if (m.minion === 'xeno') { m.w = 20; m.h = 20; }
  if (m.minion === 'abigail') { m.w = 22; m.h = 28; }
  if (m.minion === 'blade') { m.w = 18; m.h = 22; }
  if (m.minion === 'raven') { m.w = 20; m.h = 18; }
  if (m.minion === 'tempest') { m.w = 28; m.h = 22; }
  if (m.minion === 'tiger') { m.w = 24; m.h = 20; }
  if (m.minion === 'hornet') { m.w = 20; m.h = 18; }
  if (m.minion === 'sanguine') { m.w = 22; m.h = 18; }
  if (m.minion === 'sphere') { m.w = 22; m.h = 22; }
  if (m.minion === 'pirate') { m.w = 20; m.h = 24; }
  if (m.minion === 'flinx') { m.w = 20; m.h = 15; }
  game.entities.push(m);
  game.fx.push({ type: 'cast', x: m.x, y: m.y, t: 0.4, max: 0.4 });
  AudioSys.play('magic');
  return m;
}

function minionTarget(game, m) {
  var best = null, bd = 1e9;
  for (var i = 0; i < game.entities.length; i++) {
    var e = game.entities[i];
    if (e.dead || e === m || e.minion) continue;
    if (!e.boss && (e.armType || e.type === E.GUIDE || e.dmg <= 0)) continue;
    var d = dist2(e.x, e.y, m.x, m.y);
    // whipped enemies are prioritized by minions
    if (e.whipped && e.whipped > 0) d *= 0.3;
    if (d < bd) { bd = d; best = e; }
  }
  return best;
}

function minionHitTarget(target, dmg, game) {
  var total = dmg + (target.whipped > 0 ? (target.whipTag || 0) : 0);
  if (target.boss) game.hitBoss(target, total, 0, 0);
  else hitEntity(target, total, 0, 0, game);
  triggerMinionWhipEffect(target, dmg, game);
}

function minionStep(m, game) {
  m.age += 1 / 60;
  var p = multiplayerTarget(game, typeof e !== 'undefined' ? e : null);
  var tgt = minionTarget(game, m);
  var tx, ty, want;
  if (tgt) { tx = tgt.x; ty = tgt.y; want = 60; }
  else { tx = p.x; ty = p.y - 46; want = 20; }

  m.attackCd -= 1 / 60;

  if (m.minion === 'dragon') {
    // dragon chases and chomps
    var dx = tx - m.x, dy = ty - m.y;
    var d = Math.sqrt(dx * dx + dy * dy) || 1;
    m.x += (dx / d) * m.speed;
    m.y += (dy / d) * m.speed;
    // segments follow
    var px2 = m.x, py2 = m.y;
    for (var i = 0; i < m.segments.length; i++) {
      var s = m.segments[i];
      var sdx = s.x - px2, sdy = s.y - py2;
      var sd = Math.sqrt(sdx * sdx + sdy * sdy) || 1;
      var sp = 12;
      s.x = px2 + (sdx / sd) * sp;
      s.y = py2 + (sdy / sd) * sp;
      px2 = s.x; py2 = s.y;
    }
    if (tgt && m.attackCd <= 0 && dist(m.x, m.y, tgt.x, tgt.y) < (m.w + tgt.w) / 2) {
      minionHitTarget(tgt, m.dmg, game);
      m.attackCd = 0.5;
    }
    return;
  }

  if (m.minion === 'spider') {
    // ground minion: hops toward the target and bites
    var sdx = tx - m.x, sdy = ty - m.y;
    m.dir = sdx >= 0 ? 1 : -1;
    m.vx = m.dir * m.speed * 0.7;
    if (m.onGround && Math.random() < 0.05) m.vy = -(9 + Math.random() * 2);
    physicsStep(m, game, { ghostPlatform: false });
    if (tgt && m.attackCd <= 0 && dist(m.x, m.y, tgt.x, tgt.y) < (m.w + tgt.w) / 2) {
      minionHitTarget(tgt, m.dmg, game);
      m.attackCd = 0.6;
    }
    return;
  }

  if (m.minion === 'blade') {
    // enchanted blade: swift melee-chase
    var bdx = tx - m.x, bdy = ty - m.y;
    var bd2 = Math.sqrt(bdx * bdx + bdy * bdy) || 1;
    m.bob += 0.15;
    m.x += (bdx / bd2) * m.speed * 1.4;
    m.y += (bdy / bd2) * m.speed * 1.4 + Math.sin(m.bob) * 1.5;
    if (tgt && m.attackCd <= 0 && dist(m.x, m.y, tgt.x, tgt.y) < (m.w + tgt.w) / 2 + 4) {
      minionHitTarget(tgt, m.dmg, game);
      m.attackCd = 0.35;
    }
    return;
  }

  if (m.minion === 'abigail' || m.minion === 'raven' || m.minion === 'sanguine') {
    var fdx = tx - m.x, fdy = ty - m.y;
    var fd = Math.sqrt(fdx * fdx + fdy * fdy) || 1;
    var flyMul = m.minion === 'raven' ? 1.45 : m.minion === 'sanguine' ? 1.6 : 1.15;
    m.bob += 0.12;
    m.x += (fdx / fd) * m.speed * flyMul;
    m.y += (fdy / fd) * m.speed * flyMul + Math.sin(m.bob) * 0.8;
    if (tgt && m.attackCd <= 0 && dist(m.x, m.y, tgt.x, tgt.y) < (m.w + tgt.w) / 2 + 5) {
      minionHitTarget(tgt, m.dmg, game);
      m.attackCd = m.minion === 'sanguine' ? 0.45 : m.minion === 'raven' ? 0.55 : 0.7;
    }
    return;
  }

  if (m.minion === 'tiger' || m.minion === 'pirate' || m.minion === 'flinx') {
    var gdx = tx - m.x;
    m.dir = gdx >= 0 ? 1 : -1;
    m.vx = m.dir * m.speed * (m.minion === 'tiger' ? 0.95 : m.minion === 'flinx' ? 0.85 : 0.65);
    if (m.onGround && Math.abs(gdx) > 45 && Math.random() < (m.minion === 'flinx' ? 0.12 : 0.08)) m.vy = -8;
    physicsStep(m, game, { ghostPlatform:false });
    if (tgt && m.attackCd <= 0 && dist(m.x, m.y, tgt.x, tgt.y) < (m.w + tgt.w) / 2 + 5) {
      minionHitTarget(tgt, m.dmg, game);
      m.attackCd = m.minion === 'tiger' ? 0.5 : m.minion === 'flinx' ? 0.6 : 0.7;
    }
    return;
  }

  // fly toward target, hover at range, shoot
  var ddx = tx - m.x, ddy = ty - m.y;
  var dd = Math.sqrt(ddx * ddx + ddy * ddy) || 1;
  m.bob += 0.07;
  var mvx = (ddx / dd) * m.speed;
  var mvy = (ddy / dd) * m.speed + Math.sin(m.bob) * 1;
  m.x += lerp(m.vx, mvx, 0.08);
  m.y += lerp(m.vy, mvy, 0.08);

  if (tgt && m.attackCd <= 0 && dd < 340) {
    m.attackCd = m.minion === 'twin' ? 0.9 : m.minion === 'xeno' ? 0.8 : m.minion === 'cell' ? 1.0 : m.minion === 'tempest' ? 0.8 : m.minion === 'hornet' ? 1.1 : m.minion === 'sphere' ? 0.9 : 1.4;
    var ang = Math.atan2(tgt.y - m.y, tgt.x - m.x);
    var ptype = m.minion === 'twin' ? (m.shotAlt ? P.CURSEDFLAME : P.LASER) : m.minion === 'xeno' ? P.LASER : m.minion === 'pygmy' ? P.STINGER : m.minion === 'cell' ? P.PHANTOMBOLT : m.minion === 'tempest' ? P.PHANTOMBOLT : m.minion === 'hornet' ? P.STINGER : m.minion === 'sphere' ? P.STINGER : P.FIREBALL;
    var shotCount = m.minion === 'tempest' || m.minion === 'sphere' ? 2 : 1;
    var shotSpeed = m.minion === 'xeno' ? 12 : m.minion === 'twin' ? 9 : m.minion === 'cell' ? 6 : 7;
    var shotStatus = m.minion === 'imp' || (m.minion === 'twin' && m.shotAlt) ? {type:'cursed',duration:4,dps:8} : (m.minion === 'hornet' || m.minion === 'pygmy') ? {type:'venom',duration:5,dps:12} : null;
    for (var shot = 0; shot < shotCount; shot++) {
      var shotAng = ang + (shot - (shotCount - 1) / 2) * 0.16;
      game.projectiles.add({
        x:m.x, y:m.y, vx:Math.cos(shotAng) * shotSpeed, vy:Math.sin(shotAng) * shotSpeed,
        dmg:m.dmg, type:ptype, owner:'minion', life:2, homing:m.minion === 'cell' || m.minion === 'tempest',
        persistent:m.minion === 'cell', hitEnemies:[], status:shotStatus, color:m.color, dead:false
      });
    }
    if (m.minion === 'twin') m.shotAlt = !m.shotAlt;
    AudioSys.play('laser');
  }
}
