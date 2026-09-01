// ---------- Crafting recipes ----------
var RECIPES = [];
var HARDMODE_RECIPE_MATERIALS = [
  I.COBALT, I.COBALTBAR, I.PALLADIUM, I.PALLADIUMBAR, I.MYTHRIL, I.MYTHRILBAR,
  I.ORICHALCUM, I.ORICHALCUMBAR, I.ADAMANTITE, I.ADAMANTITEBAR, I.TITANIUM, I.TITANIUMBAR,
  I.SOUL_LIGHT, I.SOUL_NIGHT, I.SOUL_FLIGHT, I.SOUL_SIGHT, I.SOUL_MIGHT, I.SOUL_FRIGHT,
  I.HALLOWEDBAR, I.PEARLSTONE, I.CRYSTALSHARD, I.ICHOR, I.CHLOROPHYTE, I.CHLOROPHYTEBAR,
  I.ECTOPLASM, I.BROKENHEROSWORD, I.FRAG_SOLAR, I.FRAG_VORTEX, I.FRAG_NEBULA,
  I.FRAG_STARDUST, I.LUMINITE, I.LUMINITEBAR
];
function recipeHasMaterial(o, ids) {
  for (var i = 0; i < o.mat.length; i++) if (ids.indexOf(o.mat[i][0]) >= 0) return true;
  return false;
}
function recipe(o) {
  if (recipeHasMaterial(o, HARDMODE_RECIPE_MATERIALS)) o.hm = true;
  if (!o.after && recipeHasMaterial(o, [I.LUMINITE, I.LUMINITEBAR])) o.after = 'moonlord';
  else if (!o.after && recipeHasMaterial(o, [I.ECTOPLASM, I.TEMPLEBRICK])) o.after = 'plantera';
  else if (!o.after && recipeHasMaterial(o, [I.CHLOROPHYTE, I.CHLOROPHYTEBAR, I.LIFEFRUIT])) o.after = 'mechs';
  o.id = 'r' + RECIPES.length;
  RECIPES.push(o);
}

// Basic
recipe({ name:'Workbench', result:I.WOOD, count:0, special:'workbench', mat:[[I.WOOD,10]], station:'none', desc:'Crafting station. Place it.' });
recipe({ name:'Furnace', result:I.STONE, count:0, special:'furnace', mat:[[I.STONE,20]], station:'none', desc:'Smelts ores. Place it.' });
recipe({ name:'Anvil', result:I.IRONBAR, count:0, special:'anvil', mat:[[I.IRONBAR,5]], station:'workbench', desc:'Crafting station. Place it.' });
recipe({ name:'Wood Platform x4', result:I.PLATFORM, count:4, mat:[[I.WOOD,2]], station:'workbench' });
recipe({ name:'Torch x4', result:I.TORCH, count:4, mat:[[I.WOOD,2]], station:'none' });

// Smelting
recipe({ name:'Iron Bar', result:I.IRONBAR, count:1, mat:[[I.IRON,3]], station:'furnace' });
recipe({ name:'Copper Bar', result:I.COPPERBAR, count:1, mat:[[I.COPPER,3]], station:'furnace' });
recipe({ name:'Silver Bar', result:I.SILVERBAR, count:1, mat:[[I.SILVER,3]], station:'furnace' });
recipe({ name:'Gold Bar', result:I.GOLDBAR, count:1, mat:[[I.GOLD,3]], station:'furnace' });
recipe({ name:'Demonite Bar', result:I.DEMONITEBAR, count:1, mat:[[I.DEMONITE,3]], station:'furnace' });
recipe({ name:'Crimtane Bar', result:I.CRIMTANEBAR, count:1, mat:[[I.CRIMTANE,3]], station:'furnace' });
recipe({ name:'Tin Bar', result:I.TINBAR, count:1, mat:[[I.TIN,3]], station:'furnace' });
recipe({ name:'Lead Bar', result:I.LEADBAR, count:1, mat:[[I.LEAD,3]], station:'furnace' });
recipe({ name:'Tungsten Bar', result:I.TUNGSTENBAR, count:1, mat:[[I.TUNGSTEN,3]], station:'furnace' });
recipe({ name:'Platinum Bar', result:I.PLATINUMBAR, count:1, mat:[[I.PLATINUM,3]], station:'furnace' });
recipe({ name:'Meteorite Bar', result:I.METEORITEBAR, count:1, mat:[[I.METEORITE,4]], station:'furnace' });
recipe({ name:'Hellstone Bar', result:I.HELLSTONEBAR, count:1, mat:[[I.HELLSTONE,3],[I.OBSIDIAN,1]], station:'hellforge' });
recipe({ name:'Cobalt Bar', result:I.COBALTBAR, count:1, mat:[[I.COBALT,3]], station:'furnace' });
recipe({ name:'Mythril Bar', result:I.MYTHRILBAR, count:1, mat:[[I.MYTHRIL,3]], station:'furnace' });
recipe({ name:'Adamantite Bar', result:I.ADAMANTITEBAR, count:1, mat:[[I.ADAMANTITE,3]], station:'furnace' });
recipe({ name:'Hallowed Bar', result:I.HALLOWEDBAR, count:1, mat:[[I.ADAMANTITEBAR,1],[I.SOUL_SIGHT,1],[I.SOUL_FRIGHT,1],[I.SOUL_MIGHT,1]], station:'furnace', desc:'The metal of the mechanical bosses.' });

// Pre-hardmode tools
recipe({ name:'Copper Pickaxe', result:I.COPPERPICK, count:1, mat:[[I.COPPERBAR,10],[I.WOOD,4]], station:'workbench' });
recipe({ name:'Silver Pickaxe', result:I.SILVERPICK, count:1, mat:[[I.SILVERBAR,10],[I.WOOD,4]], station:'workbench' });
recipe({ name:'Gold Pickaxe', result:I.GOLDPICK, count:1, mat:[[I.GOLDBAR,10],[I.WOOD,4]], station:'workbench' });
recipe({ name:'Nightmare Pickaxe', result:I.DEMONITEPICK, count:1, mat:[[I.DEMONITEBAR,12],[I.SHADOWSCALE,6]], station:'anvil' });
recipe({ name:'Deathbringer Pickaxe', result:I.DEATHBRINGERPICK, count:1, mat:[[I.CRIMTANEBAR,12],[I.TISSUESAMPLE,6]], station:'anvil' });
recipe({ name:'Tin Pickaxe', result:I.TINPICK, count:1, mat:[[I.TINBAR,10],[I.WOOD,4]], station:'workbench' });
recipe({ name:'Lead Pickaxe', result:I.LEADPICK, count:1, mat:[[I.LEADBAR,10],[I.WOOD,4]], station:'workbench' });
recipe({ name:'Tungsten Pickaxe', result:I.TUNGSTENPICK, count:1, mat:[[I.TUNGSTENBAR,10],[I.WOOD,4]], station:'workbench' });
recipe({ name:'Platinum Pickaxe', result:I.PLATINUMPICK, count:1, mat:[[I.PLATINUMBAR,10],[I.WOOD,4]], station:'workbench' });
recipe({ name:'Meteorite Pickaxe', result:I.METEORITEPICK, count:1, mat:[[I.METEORITEBAR,12]], station:'anvil' });

// Pre-hardmode melee
recipe({ name:'Copper Sword', result:I.COPPERSWORD, count:1, mat:[[I.COPPERBAR,6]], station:'anvil' });
recipe({ name:'Silver Sword', result:I.SILVERSWORD, count:1, mat:[[I.SILVERBAR,6]], station:'anvil' });
recipe({ name:'Gold Sword', result:I.GOLDSWORD, count:1, mat:[[I.GOLDBAR,7]], station:'anvil' });
recipe({ name:'Demonite Sword', result:I.DEMONITESWORD, count:1, mat:[[I.DEMONITEBAR,8]], station:'anvil', desc:'A dark blade of the corruption.' });
recipe({ name:'Tin Sword', result:I.TINSWORD, count:1, mat:[[I.TINBAR,6]], station:'anvil' });
recipe({ name:'Lead Sword', result:I.LEANSWORD, count:1, mat:[[I.LEADBAR,6]], station:'anvil' });
recipe({ name:'Tungsten Sword', result:I.TUNGSTENSWORD, count:1, mat:[[I.TUNGSTENBAR,7]], station:'anvil' });
recipe({ name:'Platinum Sword', result:I.PLATINUMSWORD, count:1, mat:[[I.PLATINUMBAR,7]], station:'anvil' });

// Pre-hardmode ranged
recipe({ name:'Copper Bow', result:I.COPPERBOW, count:1, mat:[[I.COPPERBAR,5],[I.WOOD,6]], station:'workbench' });
recipe({ name:'Silver Bow', result:I.SILVERBOW, count:1, mat:[[I.SILVERBAR,5],[I.WOOD,6]], station:'workbench' });
recipe({ name:'Gold Bow', result:I.GOLDBOW, count:1, mat:[[I.GOLDBAR,6],[I.WOOD,6]], station:'workbench' });

// Pre-hardmode armor - Copper
recipe({ name:'Copper Helmet', result:I.COPPERHELM, count:1, mat:[[I.COPPERBAR,6]], station:'anvil' });
recipe({ name:'Copper Chainmail', result:I.COPPERCHEST, count:1, mat:[[I.COPPERBAR,8]], station:'anvil' });
recipe({ name:'Copper Greaves', result:I.COPPERLEGS, count:1, mat:[[I.COPPERBAR,6]], station:'anvil' });
// Pre-hardmode armor - Silver
recipe({ name:'Silver Helmet', result:I.SILVERHELM, count:1, mat:[[I.SILVERBAR,8]], station:'anvil' });
recipe({ name:'Silver Chainmail', result:I.SILVERCHEST, count:1, mat:[[I.SILVERBAR,10]], station:'anvil' });
recipe({ name:'Silver Greaves', result:I.SILVERLEGS, count:1, mat:[[I.SILVERBAR,8]], station:'anvil' });
// Pre-hardmode armor - Gold
recipe({ name:'Gold Helmet', result:I.GOLDHELM, count:1, mat:[[I.GOLDBAR,10]], station:'anvil' });
recipe({ name:'Gold Chainmail', result:I.GOLDCHEST, count:1, mat:[[I.GOLDBAR,12]], station:'anvil' });
recipe({ name:'Gold Greaves', result:I.GOLDLEGS, count:1, mat:[[I.GOLDBAR,10]], station:'anvil' });
// Pre-hardmode armor - Demonite
recipe({ name:'Demonite Helmet', result:I.DEMONITEHELM, count:1, mat:[[I.DEMONITEBAR,8]], station:'anvil' });
recipe({ name:'Demonite Breastplate', result:I.DEMONITECHEST, count:1, mat:[[I.DEMONITEBAR,12]], station:'anvil' });
recipe({ name:'Demonite Greaves', result:I.DEMONITELEGS, count:1, mat:[[I.DEMONITEBAR,8]], station:'anvil' });
// Pre-hardmode armor - Crimtane
recipe({ name:'Crimtane Helmet', result:I.CRIMTANEHELM, count:1, mat:[[I.CRIMTANEBAR,8]], station:'anvil' });
recipe({ name:'Crimtane Breastplate', result:I.CRIMTANECHEST, count:1, mat:[[I.CRIMTANEBAR,12]], station:'anvil' });
recipe({ name:'Crimtane Greaves', result:I.CRIMTANELEGS, count:1, mat:[[I.CRIMTANEBAR,8]], station:'anvil' });
// Pre-hardmode armor - Tin
recipe({ name:'Tin Helmet', result:I.TINHELM, count:1, mat:[[I.TINBAR,6]], station:'anvil' });
recipe({ name:'Tin Chainmail', result:I.TINCHEST, count:1, mat:[[I.TINBAR,8]], station:'anvil' });
recipe({ name:'Tin Greaves', result:I.TINLEGS, count:1, mat:[[I.TINBAR,6]], station:'anvil' });
// Pre-hardmode armor - Lead
recipe({ name:'Lead Helmet', result:I.LEADHELM, count:1, mat:[[I.LEADBAR,8]], station:'anvil' });
recipe({ name:'Lead Chainmail', result:I.LEADCHEST, count:1, mat:[[I.LEADBAR,10]], station:'anvil' });
recipe({ name:'Lead Greaves', result:I.LEADLEGS, count:1, mat:[[I.LEADBAR,8]], station:'anvil' });
// Pre-hardmode armor - Tungsten
recipe({ name:'Tungsten Helmet', result:I.TUNGSTENHELM, count:1, mat:[[I.TUNGSTENBAR,8]], station:'anvil' });
recipe({ name:'Tungsten Chainmail', result:I.TUNGSTENCHEST, count:1, mat:[[I.TUNGSTENBAR,10]], station:'anvil' });
recipe({ name:'Tungsten Greaves', result:I.TUNGSTENLEGS, count:1, mat:[[I.TUNGSTENBAR,8]], station:'anvil' });
// Pre-hardmode armor - Platinum
recipe({ name:'Platinum Helmet', result:I.PLATINUMHELM, count:1, mat:[[I.PLATINUMBAR,10]], station:'anvil' });
recipe({ name:'Platinum Chainmail', result:I.PLATINUMCHEST, count:1, mat:[[I.PLATINUMBAR,12]], station:'anvil' });
recipe({ name:'Platinum Greaves', result:I.PLATINUMLEGS, count:1, mat:[[I.PLATINUMBAR,10]], station:'anvil' });
// Meteorite gear
recipe({ name:'Meteor Helmet', result:I.METEORHELM, count:1, mat:[[I.METEORITEBAR,8]], station:'anvil' });
recipe({ name:'Meteor Breastplate', result:I.METEORCHEST, count:1, mat:[[I.METEORITEBAR,12]], station:'anvil' });
recipe({ name:'Meteor Leggings', result:I.METEORLEGS, count:1, mat:[[I.METEORITEBAR,8]], station:'anvil' });
recipe({ name:'Space Gun', result:I.SPACEGUN, count:1, mat:[[I.METEORITEBAR,20],[I.IRONBAR,4]], station:'anvil', desc:'Meteorite\'s charge made into a gun.' });
recipe({ name:'Mana Crystal', result:I.MANACRYSTAL, count:1, mat:[[I.FALLENSTAR,3]], station:'workbench', desc:'Concentrated starlight. Permanently raises max mana.' });
  recipe({ name:'Star Cannon', result:I.STARCANNON, count:1, mat:[[I.METEORITEBAR,10],[I.FALLENSTAR,3]], station:'anvil', desc:'Meteorite metal harnessed to fire Fallen Stars.' });

// Molten gear
recipe({ name:'Molten Pickaxe', result:I.MOLTENPICK, count:1, mat:[[I.HELLSTONEBAR,20]], station:'anvil' });
recipe({ name:'Volcano', result:I.VOLCANO, count:1, mat:[[I.HELLSTONEBAR,20]], station:'anvil' });
recipe({ name:'Molten Helmet', result:I.MOLTENHELM, count:1, mat:[[I.HELLSTONEBAR,10]], station:'anvil' });
recipe({ name:'Molten Breastplate', result:I.MOLTENCHEST, count:1, mat:[[I.HELLSTONEBAR,20]], station:'anvil' });
recipe({ name:'Molten Greaves', result:I.MOLTENLEGS, count:1, mat:[[I.HELLSTONEBAR,15]], station:'anvil' });

// Pre-hardmode boss summons
recipe({ name:'Slime Crown', result:I.SLIMECROWN, count:1, mat:[[I.GOLDBAR,8],[I.GEL,10]], station:'workbench', desc:'The crown of the slime king.' });
recipe({ name:'Suspicious Looking Eye', result:I.SUSPICIOUSLEYE, count:1, mat:[[I.LENS,6]], station:'workbench', desc:'Something stirs within the pupil...' });
recipe({ name:'Worm Food', result:I.WORMLOOD, count:1, mat:[[I.EBONSTONE,15],[I.GLOWSTONE,5]], station:'none', desc:'Summons the Eater of Worlds.' });
recipe({ name:'Bloody Spine', result:I.BLOODYSPINE, count:1, mat:[[I.CRIMSTONE,15],[I.GLOWSTONE,5]], station:'none', desc:'Summons the Brain of Cthulhu.' });
recipe({ name:'Abeemination', result:I.ABEEMINATION, count:1, mat:[[I.HONEY,5],[I.GLOWSTONE,5],[I.GEL,3]], station:'none', desc:'The buzzing grows louder...' });
recipe({ name:'Clothier Voodoo Doll', result:I.CLOTHIERDOLL, count:1, mat:[[I.BONE,5],[I.SILK,3]], station:'workbench', desc:'Cursed. Summons Skeletron.' });
recipe({ name:'Deer Thing (Corruption)', result:I.DEERTHING, count:1, mat:[[I.FLINXFUR,3],[I.LENS,1],[I.DEMONITE,5]], station:'workbench', desc:'Calls a frozen terror in the Snow.' });
recipe({ name:'Deer Thing (Crimson)', result:I.DEERTHING, count:1, mat:[[I.FLINXFUR,3],[I.LENS,1],[I.CRIMTANE,5]], station:'workbench', desc:'Calls a frozen terror in the Snow.' });
recipe({ name:'Snow Globe', result:I.SNOWGLOBE, count:1, mat:[[I.SNOW,20],[I.GLASS,5],[I.SOUL_LIGHT,3]], station:'workbench', hm:true, desc:'Summons the Frost Legion.' });

// Snow and desert extras
recipe({ name:'Flinx Staff', result:I.FLINXSTAFF, count:1, mat:[[I.FLINXFUR,8],[I.WOOD,10]], station:'workbench', desc:'Summons a loyal flinx.' });
recipe({ name:'Amber Robe', result:I.AMBERROBE, count:1, mat:[[I.SILK,20],[I.AMBER,3]], station:'workbench', desc:'Humming with old sunlight.' });
recipe({ name:'Amber Staff', result:I.AMBERSTAFF, count:1, mat:[[I.AMBER,10],[I.GLOWSTONE,5]], station:'anvil', desc:'Casts bolts of fossilized light.' });

// Tools
recipe({ name:'Iron Pickaxe', result:I.IRONPICK, count:1, mat:[[I.IRONBAR,12],[I.WOOD,4]], station:'workbench' });
recipe({ name:'Cobalt Pickaxe', result:I.COBALTPICK, count:1, mat:[[I.COBALTBAR,12]], station:'anvil' });
recipe({ name:'Mythril Pickaxe', result:I.MYTHRILPICK, count:1, mat:[[I.MYTHRILBAR,12]], station:'anvil' });
recipe({ name:'Adamantite Pickaxe', result:I.ADAMANTITEPICK, count:1, mat:[[I.ADAMANTITEBAR,12]], station:'anvil' });

// Melee
recipe({ name:'Wooden Sword', result:I.WOODSWORD, count:1, mat:[[I.WOOD,8]], station:'workbench' });
recipe({ name:'Cobalt Sword', result:I.COBALTSWORD, count:1, mat:[[I.COBALTBAR,8]], station:'anvil' });
recipe({ name:'Mythril Sword', result:I.MYTHRILSWORD, count:1, mat:[[I.MYTHRILBAR,8]], station:'anvil' });
recipe({ name:'Adamantite Sword', result:I.ADAMANTITESWORD, count:1, mat:[[I.ADAMANTITEBAR,8]], station:'anvil' });
recipe({ name:'Excalibur', result:I.EXCALIBUR, count:1, mat:[[I.HALLOWEDBAR,12],[I.SOUL_MIGHT,2]], station:'anvil', desc:'The legendary Hallowed blade.' });

// Ranged
recipe({ name:'Arrow x5', result:I.ARROW, count:5, mat:[[I.WOOD,1]], station:'workbench' });
recipe({ name:'Iron Bow', result:I.IRONBOW, count:1, mat:[[I.WOOD,8],[I.IRONBAR,3]], station:'workbench' });
recipe({ name:'Hallowed Repeater', result:I.HALLOWEDREPEATER, count:1, mat:[[I.HALLOWEDBAR,12],[I.SOUL_MIGHT,2],[I.SOUL_LIGHT,1]], station:'anvil', desc:'Rapid-fire Hallowed crossbow.' });

// Magic
recipe({ name:'Laser Rifle', result:I.LASERRIFLE, count:1, mat:[[I.COBALTBAR,10],[I.GLOWSTONE,10],[I.IRONBAR,5]], station:'anvil', desc:'Death in a beam.' });
recipe({ name:'Crystal Storm', result:I.CRYSTALSTORM, count:1, mat:[[I.SPELLTOME,1],[I.MYTHRILBAR,10],[I.GLOWSTONE,15]], station:'anvil', desc:'Sends crystal shards flying.' });

// Armor - Cobalt
recipe({ name:'Cobalt Helmet', result:I.COBALTHELM, count:1, mat:[[I.COBALTBAR,8]], station:'anvil' });
recipe({ name:'Cobalt Breastplate', result:I.COBALTCHEST, count:1, mat:[[I.COBALTBAR,12]], station:'anvil' });
recipe({ name:'Cobalt Leggings', result:I.COBALTLEGS, count:1, mat:[[I.COBALTBAR,8]], station:'anvil' });
// Armor - Mythril
recipe({ name:'Mythril Helmet', result:I.MYTHRILHELM, count:1, mat:[[I.MYTHRILBAR,10]], station:'anvil' });
recipe({ name:'Mythril Breastplate', result:I.MYTHRILCHEST, count:1, mat:[[I.MYTHRILBAR,16]], station:'anvil' });
recipe({ name:'Mythril Leggings', result:I.MYTHRILLEGS, count:1, mat:[[I.MYTHRILBAR,10]], station:'anvil' });
// Armor - Adamantite
recipe({ name:'Adamantite Helmet', result:I.ADAMANTITEHELM, count:1, mat:[[I.ADAMANTITEBAR,12]], station:'anvil' });
recipe({ name:'Adamantite Breastplate', result:I.ADAMANTITECHEST, count:1, mat:[[I.ADAMANTITEBAR,18]], station:'anvil' });
recipe({ name:'Adamantite Leggings', result:I.ADAMANTITELEGS, count:1, mat:[[I.ADAMANTITEBAR,12]], station:'anvil' });
// Armor - Hallowed
recipe({ name:'Hallowed Helmet', result:I.HALLOWEDHELM, count:1, mat:[[I.HALLOWEDBAR,12]], station:'anvil' });
recipe({ name:'Hallowed Breastplate', result:I.HALLOWEDCHEST, count:1, mat:[[I.HALLOWEDBAR,24]], station:'anvil' });
recipe({ name:'Hallowed Leggings', result:I.HALLOWEDLEGS, count:1, mat:[[I.HALLOWEDBAR,18]], station:'anvil' });

// Potions
recipe({ name:'Healing Potion', result:I.HEALINGPOTION, count:1, mat:[[I.GLOWSTONE,2],[I.COBWEB,1]], station:'none', desc:'Restores 100 health.' });
recipe({ name:'Mana Potion', result:I.MANAPOTION, count:1, mat:[[I.GLOWSTONE,3]], station:'none' });

// Boss summons
recipe({ name:'Mechanical Eye', result:I.MECH_EYE, count:1, mat:[[I.IRONBAR,5],[I.SOUL_LIGHT,3],[I.SOUL_NIGHT,3]], station:'anvil', desc:'Summons The Twins.' });
recipe({ name:'Mechanical Worm', result:I.MECH_WORM, count:1, mat:[[I.IRONBAR,5],[I.SOUL_NIGHT,5]], station:'anvil', desc:'Summons The Destroyer.' });
recipe({ name:'Mechanical Skull', result:I.MECH_SKULL, count:1, mat:[[I.IRONBAR,5],[I.SOUL_LIGHT,3],[I.SOUL_NIGHT,3]], station:'anvil', desc:'Summons Skeletron Prime.' });

// ---------- Post-Hardmode expansion recipes ----------

// Smelting - new ores
recipe({ name:'Orichalcum Bar', result:I.ORICHALCUMBAR, count:1, mat:[[I.ORICHALCUM,3]], station:'furnace' });
recipe({ name:'Titanium Bar', result:I.TITANIUMBAR, count:1, mat:[[I.TITANIUM,3]], station:'furnace' });
recipe({ name:'Chlorophyte Bar', result:I.CHLOROPHYTEBAR, count:1, mat:[[I.CHLOROPHYTE,3]], station:'furnace' });

// Tools
recipe({ name:'Titanium Pickaxe', result:I.TITANIUMPICK, count:1, mat:[[I.TITANIUMBAR,14]], station:'anvil' });
recipe({ name:'Pickaxe Axe', result:I.PICKAXEAXE, count:1, mat:[[I.HALLOWEDBAR,16],[I.SOUL_MIGHT,2]], station:'anvil', desc:'A hallowed axe-pick hybrid.' });
recipe({ name:'Drax', result:I.DRAX, count:1, mat:[[I.CHLOROPHYTEBAR,18],[I.SOUL_SIGHT,2]], station:'anvil', desc:'A drill-axe of living metal.' });

// Melee
recipe({ name:'Orichalcum Sword', result:I.ORICHALCUMSWORD, count:1, mat:[[I.ORICHALCUMBAR,8]], station:'anvil' });
recipe({ name:'Titanium Sword', result:I.TITANIUMSWORD, count:1, mat:[[I.TITANIUMBAR,8]], station:'anvil' });
recipe({ name:'Chlorophyte Saber', result:I.CHLOROPHYTESABER, count:1, mat:[[I.CHLOROPHYTEBAR,12]], station:'anvil' });
recipe({ name:'Terra Blade', result:I.TERRABLADE, count:1, mat:[[I.EXCALIBUR,1],[I.CHLOROPHYTEBAR,12],[I.SOUL_LIGHT,2],[I.SOUL_NIGHT,2]], station:'anvil', desc:'The legendary blade of Terraria.' });

// Ranged
recipe({ name:'Crystal Bullet x20', result:I.BULLET, count:20, mat:[[I.STONE,5],[I.GLOWSTONE,2]], station:'workbench' });
recipe({ name:'Megashark', result:I.MEGASHARK, count:1, mat:[[I.IRONBAR,20],[I.HALLOWEDBAR,12],[I.SOUL_MIGHT,2]], station:'anvil', desc:'A shark named gun.' });

// Magic
recipe({ name:'Golden Shower', result:I.GOLDENSHOWER, count:1, mat:[[I.SPELLTOME,1],[I.IRONBAR,10],[I.SOUL_NIGHT,2],[I.SOUL_LIGHT,2]], station:'anvil' });
recipe({ name:'Rainbow Rod', result:I.RAINBOWROD, count:1, mat:[[I.ADAMANTITEBAR,12],[I.SOUL_SIGHT,2]], station:'anvil' });

// Summoner - whips
recipe({ name:'Leather Whip', result:I.LEATHERWHIP, count:1, mat:[[I.COBWEB,8],[I.IRONBAR,2]], station:'workbench' });

// Summoner - staves
recipe({ name:'Imp Staff', result:I.IMPSTAFF, count:1, mat:[[I.COBALTBAR,10],[I.COBWEB,10]], station:'anvil', desc:'Summons an imp minion.' });
recipe({ name:'Optic Staff', result:I.OPTICSTAFF, count:1, mat:[[I.HALLOWEDBAR,12],[I.SOUL_SIGHT,2]], station:'anvil', desc:'Summons twin laser minions.' });

// Armor - Orichalcum
recipe({ name:'Orichalcum Helmet', result:I.ORICHALCUMHELM, count:1, mat:[[I.ORICHALCUMBAR,10]], station:'anvil' });
recipe({ name:'Orichalcum Breastplate', result:I.ORICHALCUMCHEST, count:1, mat:[[I.ORICHALCUMBAR,16]], station:'anvil' });
recipe({ name:'Orichalcum Leggings', result:I.ORICHALCUMLEGS, count:1, mat:[[I.ORICHALCUMBAR,10]], station:'anvil' });
// Armor - Titanium
recipe({ name:'Titanium Helmet', result:I.TITANIUMHELM, count:1, mat:[[I.TITANIUMBAR,12]], station:'anvil' });
recipe({ name:'Titanium Breastplate', result:I.TITANIUMCHEST, count:1, mat:[[I.TITANIUMBAR,20]], station:'anvil' });
recipe({ name:'Titanium Leggings', result:I.TITANIUMLEGS, count:1, mat:[[I.TITANIUMBAR,14]], station:'anvil' });
// Armor - Chlorophyte
recipe({ name:'Chlorophyte Helmet', result:I.CHLOROPHYTEHELM, count:1, mat:[[I.CHLOROPHYTEBAR,12]], station:'anvil' });
recipe({ name:'Chlorophyte Breastplate', result:I.CHLOROPHYTECHEST, count:1, mat:[[I.CHLOROPHYTEBAR,20]], station:'anvil' });
recipe({ name:'Chlorophyte Leggings', result:I.CHLOROPHYTELEGS, count:1, mat:[[I.CHLOROPHYTEBAR,14]], station:'anvil' });
// Armor - Spectre
recipe({ name:'Spectre Hood', result:I.SPECTREHELM, count:1, mat:[[I.CHLOROPHYTEBAR,12],[I.SOUL_SIGHT,1]], station:'anvil' });
recipe({ name:'Spectre Robe', result:I.SPECTRECHEST, count:1, mat:[[I.CHLOROPHYTEBAR,20],[I.SOUL_SIGHT,1]], station:'anvil' });
recipe({ name:'Spectre Leggings', result:I.SPECTRELEGS, count:1, mat:[[I.CHLOROPHYTEBAR,14],[I.SOUL_SIGHT,1]], station:'anvil' });
// Armor - Beetle
recipe({ name:'Beetle Helmet', result:I.BEETLEHELM, count:1, mat:[[I.CHLOROPHYTEBAR,16],[I.TURTLESHELL,1]], station:'anvil' });
recipe({ name:'Beetle Shell', result:I.BEETLECHEST, count:1, mat:[[I.CHLOROPHYTEBAR,26],[I.TURTLESHELL,1]], station:'anvil' });
recipe({ name:'Beetle Leggings', result:I.BEETLELEGS, count:1, mat:[[I.CHLOROPHYTEBAR,18],[I.TURTLESHELL,1]], station:'anvil' });

// Accessories
recipe({ name:'Spectre Boots', result:I.SPECTREBOOTS, count:1, mat:[[I.IRONBAR,6],[I.SOUL_LIGHT,1]], station:'workbench' });
recipe({ name:'Regeneration Band', result:I.REGENSBAND, count:1, mat:[[I.HEART,1],[I.COBALTBAR,5]], station:'anvil' });
recipe({ name:'Celestial Stone', result:I.CELESTIALSTONE, count:1, mat:[[I.SOUL_MIGHT,1],[I.SOUL_SIGHT,1],[I.SOUL_FRIGHT,1]], station:'anvil' });
recipe({ name:'Mana Flower', result:I.MANAFLOWER, count:1, mat:[[I.MANAPOTION,1],[I.COBALTBAR,5]], station:'anvil' });
recipe({ name:'Star Veil', result:I.STARVEIL, count:1, mat:[[I.HEART,1],[I.SOUL_LIGHT,2]], station:'anvil' });

// Boss summons - new
recipe({ name:'Queen Slime Gel', result:I.QUEENSLIMEGEL, count:1, mat:[[I.GLOWSTONE,5],[I.SOUL_LIGHT,3]], station:'anvil', desc:'Summons the Queen Slime.' });
recipe({ name:'Truffle Worm', result:I.TRUFFLEWORM, count:1, mat:[[I.COBWEB,10],[I.SOUL_NIGHT,3]], station:'anvil', desc:'Bait for the Duke of the Deep.' });
recipe({ name:'Prismatic Lens', result:I.PRISMATICLENS, count:1, mat:[[I.HALLOWEDBAR,10],[I.SOUL_LIGHT,4]], station:'anvil', desc:'Summons the Empress of Light.' });

// ---------- Expanded Hardmode recipes ----------

recipe({ name:'Illegal Gun Parts', result:I.ILLEGALGUNPARTS, count:1, mat:[[I.IRONBAR,8],[I.MUSKETBALL,25]], station:'anvil', hm:true, desc:'Contraband weapon components.' });
recipe({ name:'Key of Light', result:I.KEYOFLIGHT, count:1, mat:[[I.SOUL_LIGHT,15]], station:'workbench', hm:true, desc:'Place in an empty Chest to summon a Hallowed Mimic.' });
recipe({ name:'Key of Night', result:I.KEYOFNIGHT, count:1, mat:[[I.SOUL_NIGHT,15]], station:'workbench', hm:true, desc:'Place in an empty Chest to summon this world\'s evil Mimic.' });
recipe({ name:'Solar Tablet', result:I.SOLARTABLET, count:1, mat:[[I.SOLARTABLETFRAGMENT,8]], station:'anvil', hm:true, after:'plantera', desc:'Summons a Solar Eclipse during the day.' });

// Smelting - new
recipe({ name:'Palladium Bar', result:I.PALLADIUMBAR, count:1, mat:[[I.PALLADIUM,3]], station:'furnace' });
recipe({ name:'Shroomite Bar', result:I.SHROOMBAR, count:1, mat:[[I.MUSHROOM,1],[I.CHLOROPHYTEBAR,1]], station:'furnace' });

// Melee - phaseblades & sabers
recipe({ name:'Blue Phaseblade', result:I.BLUEPHASEBLADE, count:1, mat:[[I.COBALTBAR,10],[I.GLOWSTONE,5]], station:'anvil' });
recipe({ name:'Green Phaseblade', result:I.GREENPHASEBLADE, count:1, mat:[[I.COBALTBAR,10],[I.GLOWSTONE,5]], station:'anvil' });
recipe({ name:'Purple Phaseblade', result:I.PURPLEPHASEBLADE, count:1, mat:[[I.COBALTBAR,10],[I.GLOWSTONE,5]], station:'anvil' });
recipe({ name:'Blue Phasesaber', result:I.BLUEPHASESABER, count:1, mat:[[I.MYTHRILBAR,10],[I.GLOWSTONE,8]], station:'anvil' });
recipe({ name:'Green Phasesaber', result:I.GREENPHASESABER, count:1, mat:[[I.MYTHRILBAR,10],[I.GLOWSTONE,8]], station:'anvil' });
recipe({ name:'Purple Phasesaber', result:I.PURPLEPHASESABER, count:1, mat:[[I.MYTHRILBAR,10],[I.GLOWSTONE,8]], station:'anvil' });

// Melee - hardmode swords
recipe({ name:'Frostbrand', result:I.FROSTBRAND, count:1, mat:[[I.HALLOWEDBAR,12],[I.SOUL_FRIGHT,2]], station:'anvil' });
recipe({ name:'Beam Sword', result:I.BEAMSWORD, count:1, mat:[[I.HALLOWEDBAR,12],[I.SOUL_SIGHT,2]], station:'anvil' });
recipe({ name:'Keybrand', result:I.KEYBRAND, count:1, mat:[[I.HALLOWEDBAR,8],[I.SOUL_LIGHT,1]], station:'anvil' });
recipe({ name:'Vampire Knives', result:I.VAMPIRESKNIVES, count:1, mat:[[I.CHLOROPHYTEBAR,12],[I.SOUL_NIGHT,2]], station:'anvil' });
recipe({ name:'Gungnir', result:I.GUNGNIR, count:1, mat:[[I.HALLOWEDBAR,14],[I.SOUL_MIGHT,2],[I.SOUL_SIGHT,2]], station:'anvil' });
recipe({ name:'Mushroom Spear', result:I.MUSHROOMSPEAR, count:1, mat:[[I.MUSHROOM,20],[I.CHLOROPHYTEBAR,8]], station:'anvil' });
recipe({ name:'Chlorophyte Partisan', result:I.CHLOROPHYTEPARTISAN, count:1, mat:[[I.CHLOROPHYTEBAR,14]], station:'anvil' });

// Ranged
recipe({ name:'Uzi', result:I.UZI, count:1, mat:[[I.ILLEGALGUNPARTS,1],[I.HALLOWEDBAR,12],[I.SOUL_MIGHT,2]], station:'anvil' });
recipe({ name:'Venus Magnum', result:I.VENUSMAGNUM, count:1, mat:[[I.CHLOROPHYTEBAR,12],[I.SOUL_LIGHT,2]], station:'anvil' });
recipe({ name:'Onyx Blaster', result:I.ONYXBLASTER, count:1, mat:[[I.ILLEGALGUNPARTS,1],[I.SOUL_NIGHT,5],[I.SOUL_LIGHT,5]], station:'anvil' });
recipe({ name:'Flamethrower', result:I.FLAMETHROWER, count:1, mat:[[I.IRONBAR,20],[I.SOUL_FRIGHT,2]], station:'anvil' });
recipe({ name:'Pulse Bow', result:I.PULSEBOW, count:1, mat:[[I.FRAG_VORTEX,8],[I.ILLEGALGUNPARTS,1]], station:'anvil' });
recipe({ name:'Chlorophyte Shotbow', result:I.CHLOROPHYTESHOTBOW, count:1, mat:[[I.CHLOROPHYTEBAR,12]], station:'anvil' });
recipe({ name:'Piranha Gun', result:I.PIRANHAGUN, count:1, mat:[[I.CHLOROPHYTEBAR,10],[I.SOUL_MIGHT,2],[I.SHARKFIN,1]], station:'anvil', desc:'A living gun that locks a piranha onto prey.' });

// Magic
recipe({ name:'Magical Harp', result:I.MAGICALHARP, count:1, mat:[[I.HARP,1],[I.PEARLSTONE,15],[I.SOUL_LIGHT,5],[I.SOUL_NIGHT,5]], station:'anvil' });
recipe({ name:'Nettle Burst', result:I.NETTLEBURST, count:1, mat:[[I.VINE,2],[I.CHLOROPHYTEBAR,10],[I.SOUL_LIGHT,2]], station:'anvil' });
recipe({ name:'Venom Staff', result:I.VENOMSTAFF, count:1, mat:[[I.CHLOROPHYTEBAR,12],[I.VINE,2]], station:'anvil' });
recipe({ name:'Cursed Flames', result:I.CURSEDFLAMES, count:1, mat:[[I.SPELLTOME,1],[I.PEARLSTONE,10],[I.EBONSTONE,10],[I.SOUL_NIGHT,5],[I.SOUL_LIGHT,5]], station:'anvil' });
recipe({ name:'Flower of Fire', result:I.FLOWEROFFIRE, count:1, mat:[[I.HELLSTONEBAR,10],[I.SOUL_LIGHT,2]], station:'hellforge', hm:true, desc:'A flower of the Underworld that spits fire.' });
recipe({ name:'Rainbow Gun', result:I.RAINBOWGUN, count:1, mat:[[I.HALLOWEDBAR,10],[I.SOUL_LIGHT,2],[I.SPELLTOME,1]], station:'anvil', desc:'Leaves a rainbow wall of flame.' });

// Summoner staves
recipe({ name:'Spider Staff', result:I.SPIDERSTAFF, count:1, mat:[[I.SPIDERSILK,10],[I.SOUL_NIGHT,2]], station:'anvil' });
recipe({ name:'Stardust Cell Staff', result:I.STARDUSTCELLSTAFF, count:1, mat:[[I.FRAG_STARDUST,14],[I.SOUL_FLIGHT,2]], station:'anvil' });

// Whips
recipe({ name:'Snapthorn', result:I.SNAPTHORN, count:1, mat:[[I.VINE,2],[I.IRONBAR,4],[I.COBWEB,2]], station:'workbench' });
recipe({ name:'Durendal', result:I.DURENDAL, count:1, mat:[[I.HALLOWEDBAR,12],[I.SOUL_LIGHT,2]], station:'anvil' });

// Armor - Palladium
recipe({ name:'Palladium Helmet', result:I.PALLADIUMHELM, count:1, mat:[[I.PALLADIUMBAR,10]], station:'anvil' });
recipe({ name:'Palladium Breastplate', result:I.PALLADIUMCHEST, count:1, mat:[[I.PALLADIUMBAR,16]], station:'anvil' });
recipe({ name:'Palladium Leggings', result:I.PALLADIUMLEGS, count:1, mat:[[I.PALLADIUMBAR,10]], station:'anvil' });
// Armor - Frost
recipe({ name:'Frost Helmet', result:I.FROSTHELM, count:1, mat:[[I.HALLOWEDBAR,10],[I.ICE,20]], station:'anvil' });
recipe({ name:'Frost Breastplate', result:I.FROSTCHEST, count:1, mat:[[I.HALLOWEDBAR,16],[I.ICE,30]], station:'anvil' });
recipe({ name:'Frost Leggings', result:I.FROSTLEGS, count:1, mat:[[I.HALLOWEDBAR,12],[I.ICE,24]], station:'anvil' });
// Armor - Turtle
recipe({ name:'Turtle Mask', result:I.TURTLEMASK, count:1, mat:[[I.CHLOROPHYTEBAR,14],[I.TURTLESHELL,1]], station:'anvil' });
recipe({ name:'Turtle Shellplate', result:I.TURTLECHEST, count:1, mat:[[I.CHLOROPHYTEBAR,24],[I.TURTLESHELL,1]], station:'anvil' });
recipe({ name:'Turtle Leggings', result:I.TURTLEGREAVES, count:1, mat:[[I.CHLOROPHYTEBAR,16],[I.TURTLESHELL,1]], station:'anvil' });
// Armor - Shroomite
recipe({ name:'Shroomite Headgear', result:I.SHROOMITEHELM, count:1, mat:[[I.SHROOMBAR,10]], station:'anvil' });
recipe({ name:'Shroomite Breastplate', result:I.SHROOMITECHEST, count:1, mat:[[I.SHROOMBAR,16]], station:'anvil' });
recipe({ name:'Shroomite Leggings', result:I.SHROOMITELEGS, count:1, mat:[[I.SHROOMBAR,12]], station:'anvil' });
// Armor - Spooky
recipe({ name:'Spooky Helmet', result:I.SPOOKYHELM, count:1, mat:[[I.MUSHROOM,20],[I.SOUL_FLIGHT,2]], station:'anvil' });
recipe({ name:'Spooky Breastplate', result:I.SPOOKYCHEST, count:1, mat:[[I.MUSHROOM,30],[I.SOUL_FLIGHT,3]], station:'anvil' });
recipe({ name:'Spooky Leggings', result:I.SPOOKYLEGS, count:1, mat:[[I.MUSHROOM,24],[I.SOUL_FLIGHT,2]], station:'anvil' });
// Armor - Solar
recipe({ name:'Solar Flare Helmet', result:I.SOLARHELM, count:1, mat:[[I.FRAG_SOLAR,12]], station:'anvil' });
recipe({ name:'Solar Flare Breastplate', result:I.SOLARCHEST, count:1, mat:[[I.FRAG_SOLAR,20]], station:'anvil' });
recipe({ name:'Solar Flare Leggings', result:I.SOLARLEGS, count:1, mat:[[I.FRAG_SOLAR,16]], station:'anvil' });
// Armor - Nebula
recipe({ name:'Nebula Helmet', result:I.NEBULAHELM, count:1, mat:[[I.FRAG_NEBULA,12]], station:'anvil' });
recipe({ name:'Nebula Breastplate', result:I.NEBULACHEST, count:1, mat:[[I.FRAG_NEBULA,20]], station:'anvil' });
recipe({ name:'Nebula Leggings', result:I.NEBULALEGS, count:1, mat:[[I.FRAG_NEBULA,16]], station:'anvil' });
// Armor - Vortex
recipe({ name:'Vortex Helmet', result:I.VORTEXHELM, count:1, mat:[[I.FRAG_VORTEX,12]], station:'anvil' });
recipe({ name:'Vortex Breastplate', result:I.VORTEXCHEST, count:1, mat:[[I.FRAG_VORTEX,20]], station:'anvil' });
recipe({ name:'Vortex Leggings', result:I.VORTEXLEGS, count:1, mat:[[I.FRAG_VORTEX,16]], station:'anvil' });
// Armor - Stardust
recipe({ name:'Stardust Helmet', result:I.STARDUSTHELM, count:1, mat:[[I.FRAG_STARDUST,12]], station:'anvil' });
recipe({ name:'Stardust Breastplate', result:I.STARDUSTCHEST, count:1, mat:[[I.FRAG_STARDUST,20]], station:'anvil' });
recipe({ name:'Stardust Leggings', result:I.STARDUSTLEGS, count:1, mat:[[I.FRAG_STARDUST,16]], station:'anvil' });

// Accessories
recipe({ name:'Frostspark Boots', result:I.FROSTSPARKBOOTS, count:1, mat:[[I.SPECTREBOOTS,1],[I.ICE,20]], station:'anvil' });
recipe({ name:'Ankh Shield', result:I.ANKHSHIELD, count:1, mat:[[I.OBSIDIANSHIELD,1],[I.PHILOSOPHERSSTONE,1]], station:'anvil' });
recipe({ name:'Fire Gauntlet', result:I.FIREGAUNTLET, count:1, mat:[[I.MECHANICALGLOVE,1],[I.SOUL_FRIGHT,3]], station:'anvil' });
recipe({ name:'Mechanical Glove', result:I.MECHANICALGLOVE, count:1, mat:[[I.WARRIOREMBLEM,1],[I.COBALTBAR,10]], station:'anvil' });
recipe({ name:'Master Ninja Gear', result:I.MASTERNINJAGEAR, count:1, mat:[[I.TABI,1],[I.BLACKBELT,1]], station:'anvil' });
recipe({ name:'Celestial Shell', result:I.CELESTIALSHELL, count:1, mat:[[I.CELESTIALSTONE,1],[I.MOONSTONE,1],[I.SUNSTONE,1]], station:'anvil' });
recipe({ name:'Frozen Turtle Shell', result:I.FROZENTURTLESHELL, count:1, mat:[[I.ICE,20],[I.TURTLESHELL,1]], station:'anvil' });
recipe({ name:'Obsidian Shield', result:I.OBSIDIANSHIELD, count:1, mat:[[I.OBSIDIAN,20],[I.COBALTBAR,5]], station:'anvil' });
recipe({ name:'Cobalt Shield', result:I.COBALTSHIELD, count:1, mat:[[I.COBALTBAR,10]], station:'anvil' });
recipe({ name:'Leaf Wings', result:I.LEAFWINGS, count:1, mat:[[I.SOUL_FLIGHT,12],[I.CHLOROPHYTEBAR,6]], station:'anvil' });
recipe({ name:'Flame Wings', result:I.FLAMEWINGS, count:1, mat:[[I.SOUL_FLIGHT,12],[I.SOUL_FRIGHT,3]], station:'anvil' });
recipe({ name:'Bat Wings', result:I.BATWINGS, count:1, mat:[[I.SOUL_FLIGHT,12],[I.SOUL_NIGHT,3]], station:'anvil' });

// Potions
recipe({ name:'Greater Healing Potion', result:I.GREATERHEALINGPOTION, count:1, mat:[[I.GLOWSTONE,2],[I.COBWEB,2]], station:'none', desc:'Restores 150 health.' });
recipe({ name:'Super Healing Potion', result:I.SUPERHEALINGPOTION, count:1, mat:[[I.GLOWSTONE,3],[I.COBWEB,3],[I.LIFEFRUIT,1]], station:'none', desc:'Restores 200 health.' });
recipe({ name:'Greater Mana Potion', result:I.GREATERMANAPOTION, count:1, mat:[[I.GLOWSTONE,4]], station:'none' });
recipe({ name:'Ironskin Potion', result:I.IRONSKINPOTION, count:1, mat:[[I.STONE,5],[I.GLOWSTONE,1]], station:'none' });
recipe({ name:'Regeneration Potion', result:I.REGENPOTION, count:1, mat:[[I.GLOWSTONE,2],[I.COBWEB,2]], station:'none' });
recipe({ name:'Swiftness Potion', result:I.SWIFTNESSPOTION, count:1, mat:[[I.GLOWSTONE,1],[I.SAND,5]], station:'none' });
recipe({ name:'Magic Power Potion', result:I.MAGICPOWERPOTION, count:1, mat:[[I.GLOWSTONE,2],[I.SOUL_LIGHT,1]], station:'none' });
recipe({ name:'Archery Potion', result:I.ARCHERYPOTION, count:1, mat:[[I.GLOWSTONE,2],[I.WOOD,5]], station:'none' });
recipe({ name:'Thorns Potion', result:I.THORNSPOTION, count:1, mat:[[I.GLOWSTONE,2],[I.VINE,1]], station:'none' });
recipe({ name:'Wrath Potion', result:I.WRATHPOTION, count:1, mat:[[I.GLOWSTONE,2],[I.SOUL_NIGHT,1]], station:'none' });
recipe({ name:'Rage Potion', result:I.RAGEPOTION, count:1, mat:[[I.GLOWSTONE,2],[I.SOUL_LIGHT,1]], station:'none' });
recipe({ name:'Lifeforce Potion', result:I.LIFEFORCEPOTION, count:1, mat:[[I.GLOWSTONE,2],[I.LIFEFRUIT,1]], station:'none' });
recipe({ name:'Endurance Potion', result:I.ENDURANCEPOTION, count:1, mat:[[I.GLOWSTONE,2],[I.SOUL_FRIGHT,1],[I.SOUL_MIGHT,1]], station:'none' });

// ---------- Full-content expansion recipes ----------

// Materials
recipe({ name:'Silk x2', result:I.SILK, count:2, mat:[[I.COBWEB,2]], station:'workbench', desc:'Woven from cobwebs.' });

// Axes
recipe({ name:'Iron Axe', result:I.IRONAXE, count:1, mat:[[I.IRONBAR,8],[I.WOOD,4]], station:'workbench' });
recipe({ name:'Cobalt Axe', result:I.COBALTAXE, count:1, mat:[[I.COBALTBAR,10]], station:'anvil' });
recipe({ name:'Mythril Axe', result:I.MYTHRILAXE, count:1, mat:[[I.MYTHRILBAR,10]], station:'anvil' });
recipe({ name:'Adamantite Axe', result:I.ADAMANTITEAXE, count:1, mat:[[I.ADAMANTITEBAR,10]], station:'anvil' });
recipe({ name:'Chlorophyte Axe', result:I.CHLOROPHYTEAXE, count:1, mat:[[I.CHLOROPHYTEBAR,12]], station:'anvil' });

// True melee weapons
recipe({ name:'Night\'s Edge', result:I.NIGHTSEDGE, count:1, mat:[[I.COBALTSWORD,1],[I.MYTHRILSWORD,1],[I.ADAMANTITESWORD,1],[I.ORICHALCUMSWORD,1],[I.SOUL_NIGHT,6]], station:'anvil', desc:'Four blades fused by dark power.' });
recipe({ name:'True Excalibur', result:I.TRUEEXCALIBUR, count:1, mat:[[I.EXCALIBUR,1],[I.BROKENHEROSWORD,1],[I.HALLOWEDBAR,18],[I.SOUL_SIGHT,3]], station:'anvil', desc:'The perfected Hallowed blade.' });
recipe({ name:'True Night\'s Edge', result:I.TRUENIGHTSEDGE, count:1, mat:[[I.NIGHTSEDGE,1],[I.BROKENHEROSWORD,1],[I.SOUL_NIGHT,6]], station:'anvil', desc:'The legendary dark blade perfected.' });

// Ammo
recipe({ name:'Musket Ball x20', result:I.MUSKETBALL, count:20, mat:[[I.IRONBAR,1]], station:'workbench' });
recipe({ name:'Silver Bullet x20', result:I.SILVERBULLET, count:20, mat:[[I.IRONBAR,1],[I.GLOWSTONE,1]], station:'workbench' });
recipe({ name:'Explosive Bullet x20', result:I.EXPLOSIVEBULLET, count:20, mat:[[I.MUSKETBALL,10],[I.GLOWSTONE,2]], station:'workbench' });
recipe({ name:'Chlorophyte Bullet x20', result:I.CHLOROPHYTEBULLET, count:20, mat:[[I.MUSKETBALL,10],[I.CHLOROPHYTE,1]], station:'workbench' });
recipe({ name:'Unholy Arrow x20', result:I.UNHOLYARROW, count:20, mat:[[I.ARROW,10],[I.EBONSTONE,1],[I.GLOWSTONE,1]], station:'workbench' });
recipe({ name:'Jester\'s Arrow x10', result:I.JESTERSARROW, count:10, mat:[[I.ARROW,10],[I.FALLENSTAR,1]], station:'none' });
recipe({ name:'Holy Arrow x20', result:I.HOLYARROW, count:20, mat:[[I.ARROW,10],[I.SOUL_LIGHT,1],[I.GLOWSTONE,1]], station:'workbench' });

// Ranged
recipe({ name:'Shotgun', result:I.SHOTGUN, count:1, mat:[[I.IRONBAR,12],[I.WOOD,8]], station:'workbench', desc:'A wall of lead at close range.' });

// Magic
recipe({ name:'Sky Fracture', result:I.SKYFRACTURE, count:1, mat:[[I.HALLOWEDBAR,12],[I.CRYSTALSHARD,5],[I.SOUL_SIGHT,2]], station:'anvil', desc:'Shards of sky itself.' });

// Summoner staves
recipe({ name:'Abigail\'s Flower', result:I.ABIGAILSFLOWER, count:1, mat:[[I.STONE,5],[I.SILK,3],[I.COBWEB,3]], station:'workbench', desc:'Summons a friendly ghost.' });
recipe({ name:'Desert Tiger Staff', result:I.DESERTTIGERSTAFF, count:1, mat:[[I.IRONBAR,10],[I.SAND,20],[I.SOUL_LIGHT,3]], station:'anvil', desc:'Summons a desert tiger.' });

// Whips
recipe({ name:'Spine Whip', result:I.SPINEWHIP, count:1, mat:[[I.BONE,10],[I.SILK,5],[I.IRONBAR,2]], station:'workbench' });
recipe({ name:'Cool Whip', result:I.COOLWHIP, count:1, mat:[[I.ICE,20],[I.SILK,5],[I.HALLOWEDBAR,8],[I.SOUL_FLIGHT,2]], station:'anvil' });

// Accessories
recipe({ name:'Frog Leg', result:I.FROGLEG, count:1, mat:[[I.COBWEB,5],[I.VINE,1],[I.GLOWSTONE,1]], station:'workbench', desc:'Increases jump height.' });
recipe({ name:'Angel Wings', result:I.ANGELWINGS, count:1, mat:[[I.FEATHER,10],[I.SILK,15],[I.SOUL_FLIGHT,15]], station:'anvil', desc:'Wings of feather and silk.' });
recipe({ name:'Terraspark Boots', result:I.TERRASPARKBOOTS, count:1, mat:[[I.FROSTSPARKBOOTS,1],[I.FROGLEG,1],[I.SOUL_FLIGHT,5]], station:'anvil', desc:'The ultimate boots.' });
recipe({ name:'Hercules Beetle', result:I.HERCULESBEETLE, count:1, mat:[[I.CHLOROPHYTEBAR,6],[I.TURTLESHELL,1],[I.SOUL_LIGHT,2]], station:'anvil', desc:'+1 minion. Minion damage +15%.' });
recipe({ name:'Pygmy Necklace', result:I.PYGMYNECKLACE, count:1, mat:[[I.CHLOROPHYTEBAR,8],[I.VINE,2],[I.SOUL_LIGHT,2]], station:'anvil', desc:'+1 minion.' });
recipe({ name:'Papyrus Scarab', result:I.PAPYRUSSCARAB, count:1, mat:[[I.HERCULESBEETLE,1],[I.PYGMYNECKLACE,1],[I.SOUL_FLIGHT,3]], station:'anvil', desc:'+1 minion. Minion damage +10%.' });
recipe({ name:'Obsidian Rose', result:I.OBSIDIANROSE, count:1, mat:[[I.OBSIDIAN,15],[I.SOUL_NIGHT,1]], station:'anvil', desc:'Defense +2.' });

// Food & drinks
recipe({ name:'Cooked Fish', result:I.COOKEDFISH, count:1, mat:[[I.SHARKFIN,1],[I.GLOWSTONE,1]], station:'furnace', desc:'Regenerate health for 5 minutes.' });
recipe({ name:'Pumpkin Pie', result:I.PUMPKINPIE, count:1, mat:[[I.MUSHROOM,5],[I.GLOWSTONE,2]], station:'workbench', desc:'Regeneration and a little speed.' });
recipe({ name:'Golden Apple', result:I.GOLDENAPPLE, count:1, mat:[[I.HEALINGPOTION,1],[I.LIFEFRUIT,1],[I.SOUL_LIGHT,1]], station:'workbench', desc:'Heals and empowers you.' });
recipe({ name:'Obsidian Skin Potion', result:I.OBSIDIANSKINPOTION, count:1, mat:[[I.OBSIDIAN,5],[I.GLOWSTONE,2]], station:'none', desc:'Defense +5 for 5 minutes.' });
recipe({ name:'Water Walking Potion', result:I.WATERWALKINGPOTION, count:1, mat:[[I.SAND,10],[I.GLOWSTONE,2],[I.FEATHER,1]], station:'none', desc:'+20% speed for 5 minutes.' });

// ---------- Vanilla hardmode gap-fill recipes ----------

// Smelting
recipe({ name:'Luminite Bar', result:I.LUMINITEBAR, count:1, mat:[[I.LUMINITE,4]], station:'furnace', desc:'Forged from the flesh of the Moon Lord.' });

// Axes & hammers
recipe({ name:'Palladium Axe', result:I.PALLADIUMAXE, count:1, mat:[[I.PALLADIUMBAR,10]], station:'anvil' });
recipe({ name:'Orichalcum Axe', result:I.ORICHALCUMAXE, count:1, mat:[[I.ORICHALCUMBAR,10]], station:'anvil' });
recipe({ name:'Titanium Axe', result:I.TITANIUMAXE, count:1, mat:[[I.TITANIUMBAR,10]], station:'anvil' });
recipe({ name:'Pwnhammer', result:I.PWHAMMER, count:1, mat:[[I.HALLOWEDBAR,12],[I.SOUL_MIGHT,3]], station:'anvil', desc:'Breaks the evil bricks.' });
recipe({ name:'Chlorophyte Jackhammer', result:I.CHLOROPHYTEJACKHAMMER, count:1, mat:[[I.CHLOROPHYTEBAR,14]], station:'anvil' });
recipe({ name:'Spectre Hamaxe', result:I.SPECTREHAMAXE, count:1, mat:[[I.CHLOROPHYTEBAR,16],[I.SOUL_SIGHT,3],[I.SOUL_FLIGHT,3]], station:'anvil', desc:'Spectral tool of great power.' });

// Melee
recipe({ name:'Light Disc', result:I.LIGHTDISC, count:1, mat:[[I.HALLOWEDBAR,8],[I.SOUL_LIGHT,2]], station:'anvil' });
recipe({ name:'Dao of Pow', result:I.DAOOFPAW, count:1, mat:[[I.SOUL_LIGHT,10],[I.SOUL_NIGHT,10]], station:'anvil', desc:'A flail of conflicting energy.' });
recipe({ name:'Gradient', result:I.GRADIENT, count:1, mat:[[I.COBALT,20],[I.MYTHRIL,15]], station:'anvil' });
recipe({ name:'Titanium Trident', result:I.TITANIUMTRIDENT, count:1, mat:[[I.TITANIUMBAR,14]], station:'anvil' });
recipe({ name:'Adamantite Glaive', result:I.ADAMANTITEGLAIVE, count:1, mat:[[I.ADAMANTITEBAR,14]], station:'anvil' });

// Ranged
recipe({ name:'Boomstick', result:I.BOOMSTICK, count:1, mat:[[I.IRONBAR,10],[I.WOOD,8],[I.GLOWSTONE,2]], station:'workbench' });
recipe({ name:'Marrow', result:I.MARROW, count:1, mat:[[I.BONE,20],[I.SOUL_NIGHT,2]], station:'anvil' });
recipe({ name:'Ice Bow', result:I.ICEBOW, count:1, mat:[[I.ICE,15],[I.HALLOWEDBAR,8],[I.SOUL_FLIGHT,1]], station:'anvil' });

// Ammo
recipe({ name:'Cursed Bullet x20', result:I.CURSEDBULLET, count:20, mat:[[I.MUSKETBALL,10],[I.EBONSTONE,2]], station:'workbench' });
recipe({ name:'Ichor Bullet x20', result:I.ICHORBULLET, count:20, mat:[[I.MUSKETBALL,10],[I.ICHOR,2]], station:'workbench' });
recipe({ name:'Venom Bullet x20', result:I.VENOMBULLET, count:20, mat:[[I.MUSKETBALL,10],[I.CHLOROPHYTE,2]], station:'workbench' });
recipe({ name:'Frostburn Arrow x20', result:I.FROSTBURNARROW, count:20, mat:[[I.ARROW,10],[I.ICE,2]], station:'workbench' });
recipe({ name:'Hellfire Arrow x20', result:I.HELLFIREARROW, count:20, mat:[[I.ARROW,10],[I.GLOWSTONE,2],[I.STONE,2]], station:'workbench' });
recipe({ name:'Bone Arrow x20', result:I.BONEARROW, count:20, mat:[[I.ARROW,10],[I.BONE,2]], station:'workbench' });

// Magic
recipe({ name:'Spirit Flame', result:I.SPIRITFLAME, count:1, mat:[[I.CHLOROPHYTEBAR,12],[I.SOUL_SIGHT,2]], station:'anvil' });
recipe({ name:'Nebula Blaze', result:I.NEBULABLAZE, count:1, mat:[[I.FRAG_NEBULA,12],[I.SOUL_SIGHT,2]], station:'anvil' });
recipe({ name:'Nebula Arcanum', result:I.NEBULAARCANUM, count:1, mat:[[I.FRAG_NEBULA,14],[I.SOUL_MIGHT,2]], station:'anvil' });
recipe({ name:'Unholy Trident', result:I.UNHOLYTRIDENT, count:1, mat:[[I.ADAMANTITEBAR,12],[I.SOUL_FRIGHT,2],[I.SOUL_NIGHT,2]], station:'anvil' });

// Summoner staves
recipe({ name:'Hornet Staff', result:I.HORNETSTAFF, count:1, mat:[[I.CHLOROPHYTEBAR,8],[I.VINE,2],[I.GLOWSTONE,5]], station:'anvil', desc:'Summons hornets of the jungle.' });

// Accessories
recipe({ name:'Lightning Boots', result:I.LIGHTNINGBOOTS, count:1, mat:[[I.SPECTREBOOTS,1],[I.GLOWSTONE,10],[I.SOUL_LIGHT,2]], station:'anvil', desc:'Greatly increases running speed.' });
recipe({ name:'Avenger Emblem', result:I.AVENGEREMBLEM, count:1, mat:[[I.WARRIOREMBLEM,1],[I.SOUL_MIGHT,3]], station:'anvil' });
recipe({ name:'Destroyer Emblem', result:I.DESTROYEREMBLEM, count:1, mat:[[I.AVENGEREMBLEM,1],[I.SOUL_MIGHT,3],[I.SOUL_SIGHT,3]], station:'anvil' });
recipe({ name:'Sniper Scope', result:I.SNIPERSCOPE, count:1, mat:[[I.RIFLESCOPE,1],[I.SOUL_SIGHT,3]], station:'anvil' });
recipe({ name:'Celestial Cuffs', result:I.CELESTIALCUFFS, count:1, mat:[[I.MANAFLOWER,1],[I.CELESTIALSTONE,1]], station:'anvil' });
recipe({ name:'Magic Quiver', result:I.MAGICQUIVER, count:1, mat:[[I.COBWEB,20],[I.SOUL_LIGHT,2]], station:'anvil' });
recipe({ name:'Charm of Myths', result:I.CHARMOFMYTHS, count:1, mat:[[I.PHILOSOPHERSSTONE,1],[I.REGENSBAND,1]], station:'anvil' });
recipe({ name:'Moon Charm', result:I.MOONCHARM, count:1, mat:[[I.SOUL_NIGHT,8],[I.SOUL_LIGHT,4]], station:'anvil' });
recipe({ name:'Neptune\'s Shell', result:I.NEPTUNESSHELL, count:1, mat:[[I.SHARKFIN,4],[I.CHLOROPHYTEBAR,6]], station:'anvil' });
recipe({ name:'Arctic Diving Gear', result:I.ARCTICDIVINGGEAR, count:1, mat:[[I.NEPTUNESSHELL,1],[I.ICE,20]], station:'anvil' });

// Wings
recipe({ name:'Harpy Wings', result:I.HARPYWINGS, count:1, mat:[[I.FEATHER,20],[I.SOUL_FLIGHT,15]], station:'anvil' });
recipe({ name:'Ice Wings', result:I.ICEWINGS, count:1, mat:[[I.ICE,20],[I.SOUL_FLIGHT,15],[I.SOUL_NIGHT,3]], station:'anvil' });
recipe({ name:'Bone Wings', result:I.BONEWINGS, count:1, mat:[[I.BONE,20],[I.SOUL_FLIGHT,15],[I.SOUL_NIGHT,3]], station:'anvil' });
recipe({ name:'Spooky Wings', result:I.SPOOKYWINGS, count:1, mat:[[I.MUSHROOM,20],[I.SOUL_FLIGHT,20],[I.SOUL_NIGHT,3]], station:'anvil' });
recipe({ name:'Hoverboard', result:I.HOVERBOARD, count:1, mat:[[I.SHROOMBAR,12],[I.SOUL_FLIGHT,20]], station:'anvil' });
recipe({ name:'Solar Wings', result:I.SOLARWINGS, count:1, mat:[[I.LUMINITEBAR,10],[I.SOUL_FLIGHT,15],[I.FRAG_SOLAR,5]], station:'anvil' });
recipe({ name:'Nebula Wings', result:I.NEBULAWINGS, count:1, mat:[[I.LUMINITEBAR,10],[I.SOUL_FLIGHT,15],[I.FRAG_NEBULA,5]], station:'anvil' });
recipe({ name:'Vortex Wings', result:I.VORTEXWINGS, count:1, mat:[[I.LUMINITEBAR,10],[I.SOUL_FLIGHT,15],[I.FRAG_VORTEX,5]], station:'anvil' });
recipe({ name:'Stardust Wings', result:I.STARDUSTWINGS, count:1, mat:[[I.LUMINITEBAR,10],[I.SOUL_FLIGHT,15],[I.FRAG_STARDUST,5]], station:'anvil' });

// Food & buff potions
recipe({ name:'Baked Potato', result:I.BAKEDPOTATO, count:1, mat:[[I.MUSHROOM,3],[I.GLOWSTONE,1]], station:'furnace', desc:'Regenerate health for 5 minutes.' });
recipe({ name:'Apple Pie', result:I.APPLEPIE, count:1, mat:[[I.MUSHROOM,4],[I.GLOWSTONE,2]], station:'workbench', desc:'Regeneration and a little speed.' });
recipe({ name:'Burger', result:I.BURGER, count:1, mat:[[I.MUSHROOM,5],[I.COBWEB,2],[I.GLOWSTONE,2]], station:'workbench', desc:'Regeneration and speed.' });
recipe({ name:'Inferno Potion', result:I.INFERNOPOTION, count:1, mat:[[I.GLOWSTONE,2],[I.SOUL_FRIGHT,1]], station:'none', desc:'Surround yourself in flames.' });
recipe({ name:'Ammo Reservation Potion', result:I.AMRORESERVATIONPOTION, count:1, mat:[[I.GLOWSTONE,2],[I.IRON,3]], station:'none', desc:'+10% damage for 4 minutes.' });

// Boss summon
recipe({ name:'Celestial Sigil', result:I.CELESTIALSIGIL, count:1, mat:[[I.FRAG_SOLAR,5],[I.FRAG_NEBULA,5],[I.FRAG_VORTEX,5],[I.FRAG_STARDUST,5],[I.SOUL_SIGHT,1],[I.SOUL_MIGHT,1],[I.SOUL_FRIGHT,1]], station:'anvil', desc:'Summons the Moon Lord.' });

// ---------- Missing subsystems + content batch recipes ----------

// Blocks & furniture
recipe({ name:'Glass x4', result:I.GLASS, count:4, mat:[[I.SAND,2]], station:'furnace', desc:'Smelt sand.' });
recipe({ name:'Hellstone Brick x2', result:I.HELLBRICK, count:2, mat:[[I.HELLSTONE,1],[I.OBSIDIAN,1]], station:'furnace', desc:'Forged masonry of the Underworld.' });
recipe({ name:'Chest', result:I.CHEST, count:1, mat:[[I.WOOD,8],[I.IRONBAR,2]], station:'workbench', desc:'Stores 20 items. Right-click to open.' });
recipe({ name:'Wooden Chair', result:I.CHAIR, count:1, mat:[[I.WOOD,6]], station:'workbench' });
recipe({ name:'Wooden Table', result:I.TABLE, count:1, mat:[[I.WOOD,8]], station:'workbench' });
recipe({ name:'Wood Wall x4', result:I.WOODWALL, count:4, mat:[[I.WOOD,1]], station:'workbench' });

// Town Pylon network
recipe({ name:'Forest Pylon', result:I.PYLON_FOREST, count:1, mat:[[I.WOOD,12],[I.DIRT,10]], station:'workbench', desc:'Links in the Forest.' });
recipe({ name:'Desert Pylon', result:I.PYLON_DESERT, count:1, mat:[[I.SAND,12],[I.SANDSTONE,6]], station:'workbench', desc:'Links in a Desert.' });
recipe({ name:'Snow Pylon', result:I.PYLON_SNOW, count:1, mat:[[I.SNOW,12],[I.ICE,6]], station:'workbench', desc:'Links in a Snow biome.' });
recipe({ name:'Jungle Pylon', result:I.PYLON_JUNGLE, count:1, mat:[[I.MUD,12],[I.HONEY,4]], station:'workbench', desc:'Links in the Jungle.' });
recipe({ name:'Hallow Pylon', result:I.PYLON_HALLOW, count:1, mat:[[I.PEARLSTONE,12],[I.CRYSTALSHARD,2]], station:'workbench', desc:'Links in the Hallow.' });
recipe({ name:'Corruption Pylon', result:I.PYLON_CORRUPT, count:1, mat:[[I.EBONSTONE,12],[I.DEMONITE,5]], station:'workbench', desc:'Links in the Corruption.' });
recipe({ name:'Crimson Pylon', result:I.PYLON_CRIMSON, count:1, mat:[[I.CRIMSTONE,12],[I.CRIMTANE,5]], station:'workbench', desc:'Links in the Crimson.' });
recipe({ name:'Ocean Pylon', result:I.PYLON_OCEAN, count:1, mat:[[I.SAND,12],[I.COIN,5]], station:'workbench', desc:'Links in an Ocean.' });
recipe({ name:'Universal Pylon', result:I.PYLON_UNIVERSAL, count:1, mat:[[I.LUMINITEBAR,3],[I.SOUL_SIGHT,2],[I.SOUL_NIGHT,2],[I.SOUL_FLIGHT,2]], station:'anvil', desc:'The ultimate teleport node. Works anywhere.' });

// Grappling hooks
recipe({ name:'Grappling Hook', result:I.GRAPPLINGHOOK, count:1, mat:[[I.IRONBAR,2],[I.COBWEB,2]], station:'workbench', desc:'Latch onto walls to swing and climb.' });
recipe({ name:'Ivy Whip', result:I.IVYWHIP, count:1, mat:[[I.VINE,6],[I.COBWEB,3]], station:'workbench', desc:'Jungle vines. Faster pull.' });
recipe({ name:'Web Slinger', result:I.WEBSLINGER, count:1, mat:[[I.COBWEB,30],[I.SILK,5]], station:'workbench', desc:'Long sticky webs.' });
recipe({ name:'Lunar Hook', result:I.LUNARHOOK, count:1, mat:[[I.LUMINITEBAR,8],[I.SOUL_LIGHT,4]], station:'anvil', desc:'Four hooks of lunar crystal.' });

// Mounts
recipe({ name:'Unicorn Mount', result:I.UNICORNMOUNT, count:1, mat:[[I.SOUL_LIGHT,5],[I.CRYSTALSHARD,5],[I.GOLDENAPPLE,1]], station:'anvil', desc:'Ride a galloping Unicorn.' });

// Fishing rods & bait
recipe({ name:'Wooden Fishing Pole', result:I.FISHINGROD_WOODEN, count:1, mat:[[I.WOOD,12]], station:'workbench', desc:'A simple pole. Needs bait.' });
recipe({ name:'Iron Fishing Rod', result:I.FISHINGROD_IRON, count:1, mat:[[I.IRONBAR,5],[I.WOOD,6]], station:'workbench' });
recipe({ name:'Fiberglass Fishing Pole', result:I.FISHINGROD_FIBERGLASS, count:1, mat:[[I.CRYSTALSHARD,10],[I.SOUL_LIGHT,2]], station:'anvil' });
recipe({ name:'Golden Fishing Rod', result:I.FISHINGROD_GOLDEN, count:1, mat:[[I.FISHINGROD_FIBERGLASS,1],[I.GOLDENAPPLE,1],[I.GLOWSTONE,5]], station:'anvil' });
recipe({ name:'Worm', result:I.WORM, count:1, mat:[[I.COBWEB,1],[I.DIRT,3]], station:'none', desc:'Dig bait from dirt.' });
recipe({ name:'Enchanted Nightcrawler', result:I.NIGHTCRAWLER, count:1, mat:[[I.WORM,1],[I.FALLENSTAR,1]], station:'none', desc:'Potent glowing bait.' });
recipe({ name:'Gravedigger\'s Shovel', result:I.GRAVEDIGGERSHOVEL, count:1, mat:[[I.IRONBAR,12],[I.WOOD,3]], station:'anvilEcto', desc:'A broad shovel shaped in Ecto Mist.' });
recipe({ name:'Shadow Candle', result:I.SHADOWCANDLE, count:1, mat:[[I.DEMONITEBAR,3],[I.TORCH,1]], station:'workbenchEcto' });
recipe({ name:'Crimson Shadow Candle', result:I.SHADOWCANDLE, count:1, mat:[[I.CRIMTANEBAR,3],[I.TORCH,1]], station:'workbenchEcto' });
recipe({ name:'Tattered Wood Sign', result:I.TATTEREDSIGN, count:1, mat:[[I.WOOD,5]], station:'workbenchEcto' });

// Cooked fish
recipe({ name:'Cooked Bass', result:I.COOKEDFISH, count:1, mat:[[I.FISH_BASS,1]], station:'furnace', desc:'Regenerate health for 5 minutes.' });
recipe({ name:'Cooked Trout', result:I.COOKEDFISH, count:1, mat:[[I.FISH_TROUT,1]], station:'furnace' });
recipe({ name:'Cooked Salmon', result:I.COOKEDFISH, count:1, mat:[[I.FISH_SALMON,1]], station:'furnace' });

// Dyes
recipe({ name:'Red Dye', result:I.DYE_RED, count:1, mat:[[I.FISH_CRIMSONTIGER,1]], station:'workbench' });
recipe({ name:'Orange Dye', result:I.DYE_ORANGE, count:1, mat:[[I.PUMPKIN,1],[I.DYE_RED,1]], station:'workbench' });
recipe({ name:'Yellow Dye', result:I.DYE_YELLOW, count:1, mat:[[I.PUMPKIN,1]], station:'workbench' });
recipe({ name:'Green Dye', result:I.DYE_GREEN, count:1, mat:[[I.FISH_EBONKOI,1]], station:'workbench' });
recipe({ name:'Cyan Dye', result:I.DYE_CYAN, count:1, mat:[[I.FISH_NEONTETRA,1]], station:'workbench' });
recipe({ name:'Blue Dye', result:I.DYE_BLUE, count:1, mat:[[I.FISH_CAVEFISH,1]], station:'workbench' });
recipe({ name:'Purple Dye', result:I.DYE_PURPLE, count:1, mat:[[I.GEM_AMETHYST,1]], station:'workbench' });
recipe({ name:'Pink Dye', result:I.DYE_PINK, count:1, mat:[[I.FISH_PUFFER,1]], station:'workbench' });
recipe({ name:'White Dye', result:I.DYE_WHITE, count:1, mat:[[I.FISH_FLOUNDER,1]], station:'workbench' });
recipe({ name:'Black Dye', result:I.DYE_BLACK, count:1, mat:[[I.OBSIDIAN,2],[I.SOUL_NIGHT,1]], station:'workbench' });
recipe({ name:'Brown Dye', result:I.DYE_BROWN, count:1, mat:[[I.FISH_ROCKFISH,1]], station:'workbench' });
recipe({ name:'Rainbow Dye', result:I.DYE_RAINBOW, count:1, mat:[[I.SOUL_SIGHT,1],[I.SOUL_LIGHT,1],[I.SOUL_NIGHT,1],[I.SOUL_MIGHT,1],[I.SOUL_FRIGHT,1],[I.SOUL_FLIGHT,1]], station:'anvil', desc:'The rarest of dyes.' });

// Darts & rockets
recipe({ name:'Wooden Dart x50', result:I.DART, count:50, mat:[[I.WOOD,3]], station:'workbench' });
recipe({ name:'Crystal Dart x50', result:I.CRYSTALDART, count:50, mat:[[I.DART,20],[I.CRYSTALSHARD,2]], station:'workbench' });
recipe({ name:'Cursed Dart x50', result:I.CURSEDDART, count:50, mat:[[I.DART,20],[I.EBONSTONE,2]], station:'workbench' });
recipe({ name:'Ichor Dart x50', result:I.ICHORDART, count:50, mat:[[I.DART,20],[I.ICHOR,2]], station:'workbench' });
recipe({ name:'Venom Dart x50', result:I.VENOMDART, count:50, mat:[[I.DART,20],[I.CHLOROPHYTE,2]], station:'workbench' });
recipe({ name:'Rocket I x20', result:I.ROCKET1, count:20, mat:[[I.GRENADE,1],[I.IRONBAR,1]], station:'workbench' });
recipe({ name:'Rocket II x20', result:I.ROCKET2, count:20, mat:[[I.ROCKET1,10],[I.GLOWSTONE,2]], station:'workbench' });
recipe({ name:'Rocket III x20', result:I.ROCKET3, count:20, mat:[[I.ROCKET2,10],[I.SOUL_FRIGHT,1]], station:'workbench' });
recipe({ name:'Rocket IV x20', result:I.ROCKET4, count:20, mat:[[I.ROCKET3,10],[I.LUMINITE,1]], station:'workbench' });
recipe({ name:'Grenade x5', result:I.GRENADE, count:5, mat:[[I.IRONBAR,1],[I.GLOWSTONE,2]], station:'workbench' });
recipe({ name:'Coin', result:I.COIN, count:1, mat:[[I.GOLDENAPPLE,1]], station:'furnace', desc:'Melt down a golden apple.' });

// Weapons

// Potions & accessories
recipe({ name:'Mining Potion', result:I.MININGPOTION, count:1, mat:[[I.MUSHROOM,3],[I.GLOWSTONE,2],[I.IRON,1]], station:'none', desc:'Mine much faster for 4 minutes.' });
recipe({ name:'Fishing Potion', result:I.FISHINGPOTION, count:1, mat:[[I.FISH_BASS,1],[I.GLOWSTONE,2],[I.WORM,1]], station:'none', desc:'+25 fishing power for 4 minutes.' });
recipe({ name:'Battle Potion', result:I.BATTLEPOTION, count:1, mat:[[I.FISH_CRIMSONTIGER,1],[I.GLOWSTONE,2],[I.SOUL_NIGHT,1]], station:'none', desc:'Attracts enemies and boosts damage.' });
recipe({ name:'Cloud in a Bottle', result:I.CLOUDINABOTTLE, count:1, mat:[[I.GLOWSTONE,3],[I.COBWEB,5]], station:'workbench', desc:'An extra mid-air jump.' });
recipe({ name:'Golden Horseshoe', result:I.GOLDENHORSESHOE, count:1, mat:[[I.IRONBAR,5],[I.GOLDENAPPLE,1]], station:'anvil', desc:'Negates fall damage.' });
recipe({ name:'Puppy', result:I.PUPPY, count:1, mat:[[I.NAUGHTYPRESENT,1],[I.SOUL_LIGHT,3]], station:'workbench', desc:'A loyal companion.' });
recipe({ name:'Fish Finder', result:I.FISHFINDER, count:1, mat:[[I.FISHERMANSPOCKETGUIDE,1],[I.WEATHERRADIO,1],[I.SEXTANT,1]], station:'anvil', desc:'Displays fishing power, weather, wind, and moon phase.' });

// Event summons
recipe({ name:'Pumpkin Moon Medallion', result:I.PUMPKINMEDALLION, count:1, mat:[[I.PUMPKIN,10],[I.ECTOPLASM,5],[I.HALLOWEDBAR,5]], station:'anvil', desc:'Summons the Pumpkin Moon at night.' });
recipe({ name:'Naughty Present', result:I.NAUGHTYPRESENT, count:1, mat:[[I.SILK,10],[I.ECTOPLASM,5],[I.SOUL_LIGHT,5]], station:'anvil', desc:'Summons the Frost Moon at night.' });
recipe({ name:'Goblin Battle Standard', result:I.GOBLINBATTLESTANDARD, count:1, mat:[[I.TATTEREDCLOTH,10],[I.WOOD,5],[I.IRON,3]], station:'anvil', desc:'Summons the Goblin Army at any time.' });
recipe({ name:'Pirate Map', result:I.PIRATEMAP, count:1, mat:[[I.GOLD,15],[I.COIN,10],[I.SILK,5]], station:'anvil', desc:'Summons the Pirate Invasion at any time.' });

// ---------- Crafting helpers ----------
// Determine available stations for a player
function stationsForPlayer(game) {
  var res = { none:true, workbench:false, furnace:false, anvil:false, hellforge:false, ectomist:false, workbenchEcto:false, anvilEcto:false };
  if (!game.world) return res;
  var list = game.world.nearbyStations || [];
  for (var i = 0; i < list.length; i++) {
    if (list[i] === T.WORKBENCH) res.workbench = true;
    if (list[i] === T.FURNACE) res.furnace = true;
    if (list[i] === T.ANVIL) res.anvil = true;
    if (list[i] === T.HELLFORGE) res.hellforge = true;
  }
  res.ectomist = game.world.graveyardStrengthAt(game.player.x, game.player.y) >= 7;
  res.workbenchEcto = res.workbench && res.ectomist;
  res.anvilEcto = res.anvil && res.ectomist;
  return res;
}

function recipeAvailable(game, r) {
  if (!recipeProgressionMet(game, r)) return false;
  var st = stationsForPlayer(game);
  if (!st[r.station]) return false;
  var inv = game.player.inventory;
  for (var i = 0; i < r.mat.length; i++) {
    if (inv.countOf(r.mat[i][0]) < r.mat[i][1]) return false;
  }
  return true;
}

function recipeProgressionMet(game, r) {
  if (r.hm && !game.hardmode) return false;
  if (!r.after) return true;
  if (r.after === 'mechs') return !!game.mechDone;
  return !!game.bossesDefeated[r.after];
}

function craftRecipe(game, r) {
  if (!recipeAvailable(game, r)) return false;
  var inv = game.player.inventory;
  var outputCount = r.count === undefined ? 1 : r.count;
  var before = new Array(inv.slots.length);
  for (var s = 0; s < inv.slots.length; s++) before[s] = inv.slots[s] ? copyItemStack(inv.slots[s]) : null;
  for (var i = 0; i < r.mat.length; i++) inv.consume(r.mat[i][0], r.mat[i][1]);
  if (outputCount > 0 && inv.add(r.result, outputCount) !== outputCount) {
    inv.slots = before;
    if (game.message) game.message('Not enough inventory space.');
    return false;
  }
  if (r.special) {
    if (!game.placeSpecial(r.special)) {
      inv.slots = before;
      return false;
    }
  }
  AudioSys.play('craft');
  return true;
}

// ---------- Batch 83 catalog recipes ----------
recipe({ name:'Iron Broadsword', result:I.IRON_BROADSWORD, count:1, mat:[[I.IRONBAR,7]], station:'anvil' });
recipe({ name:'Palladium Sword', result:I.PALLADIUM_SWORD, count:1, mat:[[I.PALLADIUMBAR,10]], station:'anvil' });
recipe({ name:'Tin Broadsword', result:I.TIN_BROADSWORD, count:1, mat:[[I.TINBAR,7]], station:'anvil' });
recipe({ name:'Palladium Pickaxe', result:I.PALLADIUM_PICKAXE, count:1, mat:[[I.PALLADIUMBAR,10]], station:'anvil' });
recipe({ name:'Copper Hammer', result:I.COPPER_HAMMER, count:1, mat:[[I.COPPERBAR,10]], station:'anvil' });
recipe({ name:'Iron Hammer', result:I.IRON_HAMMER, count:1, mat:[[I.IRONBAR,10]], station:'anvil' });
recipe({ name:'Tin Hammer', result:I.TIN_HAMMER, count:1, mat:[[I.TINBAR,10]], station:'anvil' });
recipe({ name:'Palladium Waraxe', result:I.PALLADIUM_WARAXE, count:1, mat:[[I.PALLADIUMBAR,10]], station:'anvil' });
recipe({ name:'Tin Axe', result:I.TIN_AXE, count:1, mat:[[I.TINBAR,10]], station:'anvil' });
recipe({ name:'Palladium Repeater', result:I.PALLADIUM_REPEATER, count:1, mat:[[I.PALLADIUMBAR,10]], station:'anvil' });
recipe({ name:'Tin Bow', result:I.TIN_BOW, count:1, mat:[[I.TINBAR,7]], station:'anvil' });
recipe({ name:'Aerial Bane', result:I.AERIAL_BANE, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Barrel Launcher', result:I.BARREL_LAUNCHER, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Bone Javelin', result:I.BONE_JAVELIN, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Bone Throwing Knife', result:I.BONE_THROWING_KNIFE, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Celebration Mk2', result:I.CELEBRATION_MK2, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Endless Musket Pouch', result:I.ENDLESS_MUSKET_POUCH, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Endless Quiver', result:I.ENDLESS_QUIVER, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Eventide', result:I.EVENTIDE, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Flintlock Pistol', result:I.FLINTLOCK_PISTOL, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Frost Daggerfish', result:I.FROST_DAGGERFISH, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Gatligator', result:I.GATLIGATOR, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Handgun', result:I.HANDGUN, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Harpoon', result:I.HARPOON, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Javelin', result:I.JAVELIN, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Meteor Shot', result:I.METEOR_SHOT, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Mini Nuke I', result:I.MINI_NUKE_I, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Mini Nuke II', result:I.MINI_NUKE_I_I, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Minishark', result:I.MINISHARK, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Molten Fury', result:I.MOLTEN_FURY, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Paintball Gun', result:I.PAINTBALL_GUN, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Phantasm', result:I.PHANTASM, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Phantom Phoenix', result:I.PHANTOM_PHOENIX, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Phoenix Blaster', result:I.PHOENIX_BLASTER, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Poisoned Knife', result:I.POISONED_KNIFE, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Quad-Barrel Shotgun', result:I.QUAD_BARREL_SHOTGUN, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Red Ryder', result:I.RED_RYDER, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Revolver', result:I.REVOLVER, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'S.D.M.G.', result:I.S_D_M_G, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Sandgun', result:I.SANDGUN, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Shuriken', result:I.SHURIKEN, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Spiky Ball', result:I.SPIKY_BALL, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Stynger', result:I.STYNGER, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Stynger Bolt', result:I.STYNGER_BOLT, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Super Star Shooter', result:I.SUPER_STAR_SHOOTER, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'The Bee\'s Knees', result:I.THE_BEES_KNEES, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Throwing Knife', result:I.THROWING_KNIFE, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Toxikarp', result:I.TOXIKARP, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Vortex Beater', result:I.VORTEX_BEATER, count:1, mat:[[I.IRONBAR,8]], station:'anvil' });
recipe({ name:'Exploding Bullet', result:I.EXPLODING_BULLET, count:1, mat:[[I.MUSKETBALL,20]], station:'anvil' });
recipe({ name:'Golden Bullet', result:I.GOLDEN_BULLET, count:1, mat:[[I.MUSKETBALL,20]], station:'anvil' });
recipe({ name:'High Velocity Bullet', result:I.HIGH_VELOCITY_BULLET, count:1, mat:[[I.MUSKETBALL,20]], station:'anvil' });
recipe({ name:'Luminite Bullet', result:I.LUMINITE_BULLET, count:1, mat:[[I.MUSKETBALL,20]], station:'anvil' });
recipe({ name:'Nano Bullet', result:I.NANO_BULLET, count:1, mat:[[I.MUSKETBALL,20]], station:'anvil' });
recipe({ name:'Party Bullet', result:I.PARTY_BULLET, count:1, mat:[[I.MUSKETBALL,20]], station:'anvil' });
recipe({ name:'Tungsten Bullet', result:I.TUNGSTEN_BULLET, count:1, mat:[[I.MUSKETBALL,20]], station:'anvil' });
