// ---------- Achievements ----------
var ACHIEVEMENTS = {
  firststeps: { name: 'First Steps', desc: 'Start your adventure.', icon: '\u{1F331}' },
  timber: { name: 'Timber!!', desc: 'Chop down your first tree.', icon: '\u{1FAB5}' },
  miner: { name: 'A Shiny Surface!', desc: 'Mine your first ore.', icon: '\u26CF' },
  deep: { name: 'Cavern Dweller', desc: 'Reach the deep caverns.', icon: '\u{1F3AC}' },
  sky: { name: 'Sky High', desc: 'Soar up into the sky.', icon: '\u2601' },
  summoner: { name: 'Summoner', desc: 'Raise a minion to fight for you.', icon: '\u{1F525}' },
  whip: { name: 'Whip It!', desc: 'Strike an enemy with a whip.', icon: '\u{1F5F8}' },
  alchemist: { name: 'Alchemist', desc: 'Brew your first potion.', icon: '\u{1F9EA}' },
  buffed: { name: 'Buffed', desc: 'Drink a buff potion.', icon: '\u{1F37A}' },
  lifefruit: { name: 'Get a Life', desc: 'Consume a Life Fruit.', icon: '\u{1F49C}' },
  maxhp: { name: 'Hardened', desc: 'Reach 400 max health.', icon: '\u{1F497}' },
  cobalt: { name: 'Cobalt Miner', desc: 'Mine Cobalt ore.', icon: '\u26CF' },
  mythril: { name: 'Mythril Miner', desc: 'Mine Mythril ore.', icon: '\u26CF' },
  adamantite: { name: 'Adamantite Miner', desc: 'Mine Adamantite ore.', icon: '\u26CF' },
  palladium: { name: 'Palladium Miner', desc: 'Mine Palladium ore.', icon: '\u26CF' },
  chlorophyte: { name: 'Chlorophyte Farmer', desc: 'Mine Chlorophyte ore.', icon: '\u26CF' },
  temple: { name: 'Temple Raider', desc: 'Enter the Lihzahrd Temple.', icon: '\u{1F5FF}' },
  mecheye: { name: 'An Eye for an Eye', desc: 'Craft a Mechanical Eye.', icon: '\u{1F441}' },
  mechworm: { name: 'Topaz Worm', desc: 'Craft a Mechanical Worm.', icon: '\u{1F41B}' },
  mechskull: { name: 'Prime Time', desc: 'Craft a Mechanical Skull.', icon: '\u{1F480}' },
  firstboss: { name: 'Like a Boss', desc: 'Defeat a boss.', icon: '\u{1F451}' },
  evilobject: { name: 'Smashing, Poppet!', desc: 'Break a Shadow Orb or Crimson Heart.', icon: '\u{1F52E}' },
  larva: { name: 'Not the Bees!', desc: 'Break a Larva inside a Jungle Hive.', icon: '\u{1F41D}' },
  kingslime: { name: 'Slime King Defeated', desc: 'Defeat King Slime.', icon: '\u{1F451}' },
  eyeofcthulhu: { name: 'Eye of Cthulhu Defeated', desc: 'Defeat the Eye of Cthulhu.', icon: '\u{1F441}' },
  eaterofworlds: { name: 'Eater of Worlds Defeated', desc: 'Defeat the Eater of Worlds.', icon: '\u{1F41B}' },
  brainofcthulhu: { name: 'Brain of Cthulhu Defeated', desc: 'Defeat the Brain of Cthulhu.', icon: '\u{1F9A0}' },
  queenbee: { name: 'Queen Bee Defeated', desc: 'Defeat the Queen Bee.', icon: '\u{1F41D}' },
  skeletron: { name: 'Skeletron Defeated', desc: 'Defeat Skeletron.', icon: '\u{1F480}' },
  wallofflesh: { name: 'A New World Awaits', desc: 'Defeat the Wall of Flesh and unleash hardmode.', icon: '\u{1F3D3}' },
  twins: { name: 'Twins Defeated', desc: 'Defeat The Twins.', icon: '\u{1F441}' },
  destroyer: { name: 'Destroyer Defeated', desc: 'Defeat The Destroyer.', icon: '\u{1F41B}' },
  skelprime: { name: 'Skeletron Prime Defeated', desc: 'Defeat Skeletron Prime.', icon: '\u{1F480}' },
  queenslime: { name: 'Queen Slime Defeated', desc: 'Defeat Queen Slime.', icon: '\u{1F9DF}' },
  plantera: { name: 'Plantera Defeated', desc: 'Defeat Plantera.', icon: '\u{1F33F}' },
  golem: { name: 'Golem Defeated', desc: 'Defeat the Golem.', icon: '\u{1F9DC}' },
  duke: { name: 'Duke Fishron Defeated', desc: 'Defeat Duke Fishron.', icon: '\u{1F41F}' },
  empress: { name: 'Empress of Light Defeated', desc: 'Defeat the Empress of Light.', icon: '\u{1F90D}' },
  cultist: { name: 'Lunatic Cultist Defeated', desc: 'Defeat the Lunatic Cultist.', icon: '\u{1F9E5}' },
  moonlord: { name: 'Moon Lord Defeated', desc: 'Defeat the Moon Lord and win.', icon: '\u{1F315}' },
  merchant: { name: 'Merchant Arrived', desc: 'A Merchant has moved in.', icon: '\u{1F6D2}' },
  nurse: { name: 'Nurse Arrived', desc: 'The Nurse has moved in.', icon: '\u{1F4C8}' },
  wizard: { name: 'Wizard Arrived', desc: 'The Wizard has moved in.', icon: '\u{1F9D9}' },
  steampunker: { name: 'Steampunker Arrived', desc: 'The Steampunker has moved in.', icon: '\u2699' },
  cyborg: { name: 'Cyborg Arrived', desc: 'The Cyborg has moved in.', icon: '\u{1F916}' },
  truffle: { name: 'Truffle Arrived', desc: 'The Truffle has moved in.', icon: '\u{1F344}' },
  pirate: { name: 'Pirate Arrived', desc: 'The Pirate has moved in.', icon: '\u{1F41A}' },
  witchdoctor: { name: 'Witch Doctor Arrived', desc: 'The Witch Doctor has moved in.', icon: '\u{1F9D9}' },
  demolitionist: { name: 'Demolitionist Arrived', desc: 'The Demolitionist has moved in.', icon: '\u{1F4A3}' },
  dyetrader: { name: 'Dye Trader Arrived', desc: 'The Dye Trader has moved in.', icon: '\u{1F7E2}' },
  angler: { name: 'Angler Arrived', desc: 'The Angler has moved in.', icon: '\u{1F41F}' },
  zoologist: { name: 'Zoologist Arrived', desc: 'The Zoologist has moved in.', icon: '\u{1F98E}' },
  dryad: { name: 'Dryad Arrived', desc: 'The Dryad has moved in.', icon: '\u{1F33F}' },
  painter: { name: 'Painter Arrived', desc: 'The Painter has moved in.', icon: '\u{1F3A8}' },
  golfer: { name: 'Golfer Arrived', desc: 'The Golfer has moved in.', icon: '\u{26F3}' },
  armsdealer: { name: 'Arms Dealer Arrived', desc: 'The Arms Dealer has moved in.', icon: '\u{1F52B}' },
  tavernkeep: { name: 'Tavernkeep Arrived', desc: 'The Tavernkeep has moved in.', icon: '\u{1F37B}' },
  stylist: { name: 'Stylist Arrived', desc: 'The Stylist has moved in.', icon: '\u{1F484}' },
  goblintinkerer: { name: 'Goblin Tinkerer Arrived', desc: 'The Goblin Tinkerer has moved in.', icon: '\u{1F9ED}' },
  clothier: { name: 'Clothier Arrived', desc: 'The Clothier has moved in.', icon: '\u{1F9F3}' },
  mechanic: { name: 'Mechanic Arrived', desc: 'The Mechanic has moved in.', icon: '\u{1F527}' },
  taxcollector: { name: 'Tax Collector Arrived', desc: 'The Tax Collector has moved in.', icon: '\u{1F4B0}' },
  partygirl: { name: 'Party Girl Arrived', desc: 'The Party Girl has moved in.', icon: '\u{1F389}' },
  party: { name: 'Celebration!', desc: 'Join a naturally occurring Party.', icon: '\u{1F389}' },
  lanternnight: { name: 'Lanterns Above', desc: 'Celebrate a victory beneath a Lantern Night.', icon: '\u{1F3EE}' },
  bestiary30: { name: 'Naturalist', desc: 'Discover 30% of all creatures.', icon: '\u{1F4D6}' },
  bestiary90: { name: 'Bestiary Master', desc: 'Discover 90% of all creatures.', icon: '\u{1F4DA}' },
  golfchallenge: { name: 'First Round', desc: 'Finish a Golf challenge hosted by the Golfer.', icon: '\u26F3' },
  golfpar: { name: 'Under Par', desc: 'Hole 15 golf balls in a single Golf challenge.', icon: '\u{1F3CC}' },
  graveyard: { name: 'Quiet Neighborhood', desc: 'Enter a fully formed Graveyard.', icon: '\u{1FAA6}' },
  santa: { name: 'Merry Christmas!', desc: 'Santa Claus has moved in.', icon: '\u{1F384}' },
  princess: { name: 'Her Highness', desc: 'The Princess has moved in.', icon: '\u{1F451}' },
  solarpillar: { name: 'Solar Shield Down', desc: 'Destroy the Solar Pillar.', icon: '\u2600' },
  vortexpillar: { name: 'Vortex Shield Down', desc: 'Destroy the Vortex Pillar.', icon: '\u{1F300}' },
  nebulapillar: { name: 'Nebula Shield Down', desc: 'Destroy the Nebula Pillar.', icon: '\u{1F30C}' },
  stardustpillar: { name: 'Stardust Shield Down', desc: 'Destroy the Stardust Pillar.', icon: '\u2726' },
  celestial: { name: 'Celestial Clarity', desc: 'Destroy all four Celestial Pillars.', icon: '\u{1F319}' },
  goblinarmy: { name: 'Goblin Invader', desc: 'Defend against the Goblin Army.', icon: '\u{1F47B}' },
  pirateinvasion: { name: 'Swashbuckler', desc: 'Defend against the Pirate Invasion.', icon: '\u{1F41A}' },
  solareclipse: { name: 'The Eclipse Rises', desc: 'Survive a Solar Eclipse.', icon: '\u{1F311}' },
  altar: { name: 'A Land Made Flesh', desc: 'Smash a Demon or Crimson Altar.', icon: '\u{1F52A}' },
  spread: { name: 'Cross Contamination', desc: 'Unleash Corruption and Hallow across the world.', icon: '\u{1F30E}' },
  pylon: { name: 'Network', desc: 'Place a pylon and link a teleport network.', icon: '\u{1F4E1}' },
  bloodmoon: { name: 'Bloodbath', desc: 'Survive a Blood Moon.', icon: '\u{1FA78}' },
  slimerain: { name: 'Gelatin World Tour', desc: 'Defeat King Slime during a Slime Rain.', icon: '\u{1F4A7}' },
  deerclops: { name: 'An Eye for an Antler', desc: 'Defeat Deerclops.', icon: '\u{1F98C}' },
  torchgod: { name: 'Torch Bearer', desc: 'Survive the Torch God challenge.', icon: '\u{1F525}' },
  oldonesarmy: { name: 'Defender of Eternia', desc: 'Defeat the Old One\'s Army.', icon: '\u{1F48E}' },
  darkmage: { name: 'Dark Magic Dispelled', desc: 'Defeat the Dark Mage.', icon: '\u{1F9D9}' },
  ogre: { name: 'No Bridge Required', desc: 'Defeat the Ogre.', icon: '\u{1F479}' },
  betsy: { name: 'Dragon Slayer', desc: 'Defeat Betsy.', icon: '\u{1F409}' },
  frostlegion: { name: 'Do You Want to Slay a Snowman?', desc: 'Defeat the Frost Legion.', icon: '\u2603' },
  pumpkinmoon: { name: 'Harvest Moon', desc: 'Survive the Pumpkin Moon.', icon: '\u{1F383}' },
  frostmoon: { name: 'Ice Scream', desc: 'Survive the Frost Moon.', icon: '\u2744' },
  martianmadness: { name: 'Tin-Foil Hatter', desc: 'Defeat the Martian Madness invasion.', icon: '\u{1F6F8}' },
  anglerquest: { name: 'Servant-in-Training', desc: 'Complete your first Angler fishing quest.', icon: '\u{1F3A3}' },
  windyday: { name: 'A Rather Blustery Day', desc: 'Fly a kite on a Windy Day.', icon: '\u{1FA81}' }
};

var Achievements = {
  unlocked: {},
  total: 0,
  unlock: function(id, game) {
    if (this.unlocked[id]) return;
    var a = ACHIEVEMENTS[id];
    if (!a) return;
    this.unlocked[id] = true;
    this.total++;
    if (game && game.player) {
      game.message(a.name + ' \u2014 Achievement Unlocked!');
      game.spawnFloatingText(game.player.x, game.player.y - 44, '\u2605 ' + a.name, '#ffd700');
    }
    AudioSys.play('craft');
  }
};

function renderAchievements() {
  var el = document.getElementById('panel-achievements');
  if (!el) return;
  var html = '';
  for (var id in ACHIEVEMENTS) {
    var a = ACHIEVEMENTS[id];
    var got = !!Achievements.unlocked[id];
    html += '<div class="ach' + (got ? ' got' : '') + '"><span class="ach-icon">' + (got ? a.icon : '\u2753') + '</span>' +
      '<span class="ach-name">' + a.name + '</span>' +
      '<span class="ach-desc">' + a.desc + '</span></div>';
  }
  html += '<div class="ach-count">' + Achievements.total + ' / ' + Object.keys(ACHIEVEMENTS).length + ' unlocked</div>';
  el.innerHTML = html;
}
