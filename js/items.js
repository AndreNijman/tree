// ---------- Item definitions ----------
var I = {
  DIRT:'dirt', STONE:'stone', SAND:'sand', WOOD:'wood', PLATFORM:'platform',
  PEARLSTONE:'pearlstone', EBONSTONE:'ebonstone', COBALT:'cobalt', MYTHRIL:'mythril',
  ADAMANTITE:'adamantite', IRON:'iron', COBWEB:'cobweb', GLOWSTONE:'glowstone', TORCH:'torch',
  MUD:'mud', TEMPLEBRICK:'templebrick',
  TITANIUM:'titanium', ORICHALCUM:'orichalcum', CHLOROPHYTE:'chlorophyte',
  IRONBAR:'ironbar', COBALTBAR:'cobaltbar', MYTHRILBAR:'mythrilbar', ADAMANTITEBAR:'adamantitebar',
  HALLOWEDBAR:'hallowedbar', TITANIUMBAR:'titaniumbar', ORICHALCUMBAR:'orichalcumbar', CHLOROPHYTEBAR:'chlorophytebar',
  WOODSWORD:'woodsword', COBALTSWORD:'cobaltsword', MYTHRILSWORD:'mythrilsword',
  ADAMANTITESWORD:'adamantitesword', EXCALIBUR:'excalibur',
  ORICHALCUMSWORD:'orichalcumsword', TITANIUMSWORD:'titaniumsword', CHLOROPHYTESABER:'chlorophytesaber', TERRABLADE:'terrabalde',
  IRONPICK:'ironpick', COBALTPICK:'cobaltpick', MYTHRILPICK:'mythrilpick', ADAMANTITEPICK:'adamantitepick',
  TITANIUMPICK:'titaniumpick', PICKAXEAXE:'pickaxeaxe', DRAX:'drax', PICKSHAW:'pickshaw',
  IRONBOW:'ironbow', HALLOWEDREPEATER:'hallowedrepeater', ARROW:'arrow', BULLET:'bullet', MEGASHARK:'megashark',
  LASERRIFLE:'laserrifle', CRYSTALSTORM:'crystalstorm', GOLDENSHOWER:'goldenshower',
  RAINBOWROD:'rainbowrod', RAZORBLADETYPHOON:'razorbladetyphoon', LASTPRISM:'lastprism',
  FLOWEROFFIRE:'floweroffire', PIRANHAGUN:'piranhagun', RAINBOWGUN:'rainbowgun',
  LEATHERWHIP:'leatherwhip', FIRECRACKER:'firecracker', KALEIDOSCOPE:'kaleidoscope',
  IMPSTAFF:'impstaff', OPTICSTAFF:'opticstaff', STARDUSTDRAGONSTAFF:'stardustdragonstaff',
  COBALTHELM:'cobalthelm', COBALTCHEST:'cobaltchest', COBALTLEGS:'cobaltlegs',
  MYTHRILHELM:'mythrilhelm', MYTHRILCHEST:'mythrilchest', MYTHRILLEGS:'mythrillegs',
  ADAMANTITEHELM:'adamantitehelm', ADAMANTITECHEST:'adamantitechest', ADAMANTITELEGS:'adamantitelegs',
  HALLOWEDHELM:'hallowedhelm', HALLOWEDCHEST:'hallowedchest', HALLOWEDLEGS:'hallowedlegs',
  ORICHALCUMHELM:'orichalcumhelm', ORICHALCUMCHEST:'orichalcumchest', ORICHALCUMLEGS:'orichalcumlegs',
  TITANIUMHELM:'titaniumhelm', TITANIUMCHEST:'titaniumchest', TITANIUMLEGS:'titaniumlegs',
  CHLOROPHYTEHELM:'chlorophytehelm', CHLOROPHYTECHEST:'chlorophytechest', CHLOROPHYTELEGS:'chlorophytelegs',
  SPECTREHELM:'spectrehelm', SPECTRECHEST:'spectrechest', SPECTRELEGS:'spectrelegs',
  BEETLEHELM:'beetlehelm', BEETLECHEST:'beetlechest', BEETLELEGS:'beetlelegs',
  SPECTREBOOTS:'spectreboots', REGENSBAND:'regensband', CELESTIALSTONE:'celestialstone',
  MANAFLOWER:'manaflower', STARVEIL:'starveil', TURTLESHELL:'turtleshell',
  HEALINGPOTION:'healingpotion', MANAPOTION:'manapotion',
  MECH_EYE:'mecheye', MECH_WORM:'mechworm', MECH_SKULL:'mechskull',
  QUEENSLIMEGEL:'queenslimegel', TRUFFLEWORM:'truffleworm', PRISMATICLENS:'prismaticlens',
  LIHZAHARDPOWERCELL:'lihzahardpowercell',
  HEART:'heart',
  SOUL_LIGHT:'soullight', SOUL_NIGHT:'soulnight',
  SOUL_MIGHT:'soulmight', SOUL_SIGHT:'soulsight', SOUL_FRIGHT:'soulfright',
  FRAG_SOLAR:'fragsolar', FRAG_NEBULA:'fragnebula', FRAG_VORTEX:'fragvortex', FRAG_STARDUST:'fragstardust',
  // ---- Expanded content ----
  SNOW:'snow', ICE:'ice', MUSHROOM:'mushroom', PALLADIUM:'palladium',
  PALLADIUMBAR:'palladiumbar', SHROOMBAR:'shroombar', SOUL_FLIGHT:'soulflight',
  SPIDERSILK:'spidersilk', VINE:'vine', SHARKFIN:'sharkfin', ILLEGALGUNPARTS:'illegalgunparts',
  BLUEPHASEBLADE:'bluephaseblade', GREENPHASEBLADE:'greenphaseblade', PURPLEPHASEBLADE:'purplephaseblade',
  BLUEPHASESABER:'bluephasesaber', GREENPHASESABER:'greenphasesaber', PURPLEPHASESABER:'purplephasesaber',
  CUTLASS:'cutlass', FROSTBRAND:'frostbrand', BEAMSWORD:'beamsword', KEYBRAND:'keybrand',
  DEATHSICKLE:'deathsickle', SEEDLER:'seedler', VAMPIRESKNIVES:'vampireknives', PSYCHOKNIFE:'psychoknife',
  SCOURGE:'scourge', FLAIRON:'flairon', GUNGNIR:'gungnir', MUSHROOMSPEAR:'mushroomspear',
  NORTHPOLE:'northpole', CHLOROPHYTEPARTISAN:'chlorophytepartisan',
  THEEYEOFOCTHULU:'theeyeofcthulu', HELLFIRE:'hellfire', YELEKS:'yeleks', KRAKEN:'kraken', TERRARIAN:'terrarian',
  UZI:'uzi', VENUSMAGNUM:'venusmagnum', SNIPERRIFLE:'sniperrifle', TACTICALSHOTGUN:'tacticalshotgun',
  CHAINGUN:'chaingun', ONYXBLASTER:'onyxblaster', DARTRIFLE:'dartrifle', DARTPISTOL:'dartpistol',
  FLAMETHROWER:'flamethrower', ROCKETLAUNCHER:'rocketlauncher', GRENADELAUNCHER:'grenadelauncher',
  PROXIMITYMINELAUNCHER:'proximityminelauncher', TSUNAMI:'tsunami', PULSEBOW:'pulsebow',
  CHLOROPHYTESHOTBOW:'chlorophyteshotbow', ELFMELTER:'elfmelter',
  MAGICALHARP:'magicalharp', MAGNETSPHERE:'magnetsphere', INFERNOPORK:'infernopork',
  SHADOWBEAMSTAFF:'shadowbeamstaff', SPECTRESTAFF:'spectrestaff', NETTLEBURST:'nettleburst',
  VENOMSTAFF:'venomstaff', STAFFOFEARTH:'staffofearth', BLIZZARDSTAFF:'blizzardstaff',
  HEATRAY:'heatray', LUNARFLARE:'lunarflare', CURSEDFLAMES:'cursedflames',
  SPIDERSTAFF:'spiderstaff', PYGMYSTAFF:'pygmy', XENOSTAFF:'xenostaff', STARDUSTCELLSTAFF:'stardustcellstaff',
  SNAPTHORN:'snapthorn', DURENDAL:'durendal', MORNINGSTAR:'morningstar',
  PALLADIUMHELM:'palladiumhelm', PALLADIUMCHEST:'palladiumchest', PALLADIUMLEGS:'palladiumlegs',
  FROSTHELM:'frosthelm', FROSTCHEST:'frostchest', FROSTLEGS:'frostlegs',
  TURTLEMASK:'turtlemask', TURTLECHEST:'turtlechest', TURTLEGREAVES:'turtlegreaves',
  SHROOMITEHELM:'shroomitehelm', SHROOMITECHEST:'shroomitechest', SHROOMITELEGS:'shroomitelegs',
  SPOOKYHELM:'spookyhelm', SPOOKYCHEST:'spookychst', SPOOKYLEGS:'spookylegs',
  SOLARHELM:'solarhelm', SOLARCHEST:'solarchest', SOLARLEGS:'solarlegs',
  NEBULAHELM:'nebulahelm', NEBULACHEST:'nebulachest', NEBULALEGS:'nebulalegs',
  VORTEXHELM:'vortexhelm', VORTEXCHEST:'vortexchest', VORTEXLEGS:'vortexlegs',
  STARDUSTHELM:'stardusthelm', STARDUSTCHEST:'stardustchest', STARDUSTLEGS:'stardustlegs',
  FROSTSPARKBOOTS:'frostsparkboots', ANKHSHIELD:'ankhshield', WARRIOREMBLEM:'warrioremblem',
  MAGICEMBLEM:'magicemblem', RANGEREMBLEM:'rangeremblem', SUMMONEREMBLEM:'summoneremblem',
  FIREGAUNTLET:'firegauntlet', MECHANICALGLOVE:'mechanicalglove', MASTERNINJAGEAR:'masterninjagear',
  CELESTIALSHELL:'celestialshell', MOONSTONE:'moonstone', SUNSTONE:'sunstone',
  FROZENTURTLESHELL:'frozenturtleshell', OBSIDIANSHIELD:'obsidianshield', PHILOSOPHERSSTONE:'philosophersstone',
  STARCLOAK:'starcloak', CROSSNECKLACE:'crossnecklace', COBALTSHIELD:'cobaltshield',
  LEAFWINGS:'leafwings', FLAMEWINGS:'flamewings', BATWINGS:'batwings',
  GREATERHEALINGPOTION:'greaterhealingpotion', SUPERHEALINGPOTION:'superhealingpotion',
  GREATERMANAPOTION:'greatermanapotion', LIFEFRUIT:'lifefruit',
  IRONSKINPOTION:'ironskinpotion', REGENPOTION:'regenpotion', SWIFTNESSPOTION:'swiftnesspotion',
  MAGICPOWERPOTION:'magicpowerpotion', ARCHERYPOTION:'archerypotion', THORNSPOTION:'thornspotion',
  WRATHPOTION:'wrathpotion', RAGEPOTION:'ragepotion', LIFEFORCEPOTION:'lifeforcepotion',
  ENDURANCEPOTION:'endurancepotion',
  // ---- Full-content expansion ----
  BONE:'bone', SILK:'silk', LEATHER:'leather', FEATHER:'feather', CRYSTALSHARD:'crystalshard',
  GEM_RUBY:'gemruby', GEM_SAPPHIRE:'gemsapphire', GEM_EMERALD:'gememerald', GEM_TOPAZ:'gemtopaz',
  GEM_AMETHYST:'gemamethyst', GEM_DIAMOND:'gemdiamond',
  IRONAXE:'ironaxe', COBALTAXE:'cobaltaxe', MYTHRILAXE:'mythrilaxe', ADAMANTITEAXE:'adamantiteaxe',
  CHLOROPHYTEAXE:'chlorophyteaxe',
  TRUEEXCALIBUR:'trueexcalibur', TRUENIGHTSEDGE:'truenightsedge',
  MUSKETBALL:'musketball', SILVERBULLET:'silverbullet', EXPLOSIVEBULLET:'explosivebullet',
  CHLOROPHYTEBULLET:'chlorophytebullet',
  UNHOLYARROW:'unholyarrow', JESTERSARROW:'jestersarrow', HOLYARROW:'holyarrow',
  SHOTGUN:'shotgun', SKYFRACTURE:'skyfracture',
  ABIGAILSFLOWER:'abigailsflower', BLADESTAFF:'bladestaff', RAVENSTAFF:'ravenstaff',
  TEMPESTSTAFF:'tempeststaff', DESERTTIGERSTAFF:'deserttigerstaff', TERRAPRISMA:'terraprisma',
  SPINEWHIP:'spinewhip', COOLWHIP:'coolwhip', DARKHARVEST:'darkharvest',
  FROGLEG:'frogleg', ANGELWINGS:'angelwings', TERRASPARKBOOTS:'terrasparkboots',
  HERCULESBEETLE:'herculesbeetle', PYGMYNECKLACE:'pygmynecklace', PAPYRUSSCARAB:'papyrusscarab',
  NECROMANTICSCROLL:'necromanticscroll', OBSIDIANROSE:'obsidianrose',
  COOKEDFISH:'cookedfish', PUMPKINPIE:'pumpkinpie', GOLDENAPPLE:'goldenapple',
  OBSIDIANSKINPOTION:'obsidianskinpotion', WATERWALKINGPOTION:'waterwalkingpotion',
  // ---- Vanilla hardmode gap-fill ----
  ICHOR:'ichor', BROKENHEROSWORD:'brokenherosword', LUMINITE:'luminite', LUMINITEBAR:'luminitebar',
  PALLADIUMAXE:'palladiumaxe', ORICHALCUMAXE:'orichalcumaxe', TITANIUMAXE:'titaniumaxe',
  PWHAMMER:'pwhammer', CHLOROPHYTEJACKHAMMER:'chlorophytejackhammer', SPECTREHAMAXE:'spectrehamaxe',
  NIGHTSEDGE:'nightsedge', LIGHTDISC:'lightdisc', DAOOFPAW:'daoofpaw', CHAINGUILLOTINES:'chainguillotines',
  PALADINSHAMMER:'paladinshammer', POSSESSEDHATCHET:'possessedhatchet', FLYINGKNIFE:'flyingknife',
  AMAROK:'amarok', GRADIENT:'gradient', TITANIUMTRIDENT:'titaniumtrident', ADAMANTITEGLAIVE:'adamantiteglaive',
  CLOCKWORKAR:'clockworkar', BOOMSTICK:'boomstick', MARROW:'marrow', ICEBOW:'icebow', XENOPOPPER:'xenopopper',
  CURSEDBULLET:'cursedbullet', ICHORBULLET:'ichorbullet', VENOMBULLET:'venombullet',
  FROSTBURNARROW:'frostburnarrow', HELLFIREARROW:'hellfirearrow', BONEARROW:'bonearrow',
  NIMBUSROD:'nimbusrod', SPIRITFLAME:'spiritflame', BUBBLEGUN:'bubblegun', LASERMACHINEGUN:'lasermachinegun',
  NEBULABLAZE:'nebulablaze', NEBULAARCANUM:'nebulaarcanum', UNHOLYTRIDENT:'unholytrident',
  HORNETSTAFF:'hornetstaff', SANGUINESTAFF:'sanguinestaff', DEADLYSPHERESTAFF:'deadlyspherestaff',
  LIGHTNINGBOOTS:'lightningboots', AVENGEREMBLEM:'avengeremblem', DESTROYEREMBLEM:'destroyeremblem',
  RIFLESCOPE:'riflescope', SNIPERSCOPE:'sniperscope', PALADINSHIELD:'paladinshield',
  TABI:'tabi', BLACKBELT:'blackbelt', CELESTIALCUFFS:'celestialcuffs',
  MAGICQUIVER:'magicquiver', PUTRIDSCENT:'putridscent', CHARMOFMYTHS:'charmofmyths',
  MOONCHARM:'mooncharm', NEPTUNESSHELL:'neptunesshell', ARCTICDIVINGGEAR:'arcticdivinggear',
  HARPYWINGS:'harpywings', ICEWINGS:'icewings', BONEWINGS:'bonewings', SPOOKYWINGS:'spookywings',
  FISHRONWINGS:'fishronwings', HOVERBOARD:'hoverboard', SOLARWINGS:'solarwings', NEBULAWINGS:'nebulawings',
  VORTEXWINGS:'vortexwings', STARDUSTWINGS:'stardustwings',
  BAKEDPOTATO:'bakedpotato', APPLEPIE:'applepie', BURGER:'burger',
  INFERNOPOTION:'infernopotion', AMRORESERVATIONPOTION:'ammoreservationpotion',
  CELESTIALSIGIL:'celestialsigil',
  // ---- Hardmode encounters / Eclipse / Pirates ----
  KEYOFLIGHT:'keyoflight', KEYOFNIGHT:'keyofnight', DAEDALUSSTORMBOW:'daedalusstormbow',
  CRYSTALVILESHARD:'crystalvileshard', CLINGERSTAFF:'clingerstaff', FETIDBAGHNAKHS:'fetidbaghnakhs',
  LIFEDRAIN:'lifedrain', FLESHKNUCKLES:'fleshknuckles',
  SHADOWFLAMEBOW:'shadowflamebow', SHADOWFLAMEKNIFE:'shadowflameknife', SHADOWFLAMEHEXDOLL:'shadowflamehexdoll',
  PIRATESTAFF:'piratestaff', LUCKYCOIN:'luckycoin', DISCOUNTCARD:'discountcard', GOLDRING:'goldring',
  SOLARTABLETFRAGMENT:'solartabletfragment', SOLARTABLET:'solartablet', BROKENBATWING:'brokenbatwing',
  TOXICFLASK:'toxicflask', NAILGUN:'nailgun', EYESPRING:'eyespring',
  BUTCHERSCHAINSAW:'butcherschainsaw', MOTHRONWINGS:'mothronwings',
  // ---- Early events / Deerclops / Torch God ----
  BLOODYTEAR:'bloodytear', SHARKTOOTHNECKLACE:'sharktoothnecklace', CHUMCASTER:'chumcaster',
  BANANARANG:'bananarang', KOCANNON:'kocannon', HAEMORRHAXE:'haemorrhaxe',
  BLOODTHORN:'bloodthorn', DRIPPLERCRIPPLER:'dripplercrippler',
  FLINXFUR:'flinxfur', DEERTHING:'deerthing', LUCYTHEAXE:'lucytheaxe',
  PEWMATICHORN:'pewmatichorn', WEATHERPAIN:'weatherpain', EYEBONE:'eyebone',
  TORCHGODSFAVOR:'torchgodsfavor',
  // ---- Secondary events and weather ----
  SNOWGLOBE:'snowglobe', FORBIDDENFRAGMENT:'forbiddenfragment',
  LASERDRILL:'laserdrill', ANTIGRAVITYHOOK:'antigravityhook',
  ELECTROSPHERELAUNCHER:'electrospherelauncher', BRAINSCRAMBLERMOUNT:'brainscramblermount',
  PURIFICATIONPOWDER:'purificationpowder', SPELLTOME:'spelltome', HARP:'harp',
  DAYBLOOM:'daybloom', BLUEKITE:'bluekite', BLUEYELLOWKITE:'blueyellowkite', REDKITE:'redkite',
  REDYELLOWKITE:'redyellowkite', YELLOWKITE:'yellowkite', BUNNYKITE:'bunnykite', GOLDFISHKITE:'goldfishkite',
  PAPERAIRPLANE:'paperairplane', WHITEPAPERAIRPLANE:'whitepaperairplane', PINWHEEL:'pinwheel',
  PARTYCENTER:'partycenter', PARTYHAT:'partyhat', PARTYPRESENT:'partypresent', PIGRONATA:'pigronata',
  PARTYSTREAMER:'partystreamer', SILLYBALLOON:'sillyballoon', SLICEOFCAKE:'sliceofcake', RELEASELANTERN:'releaselantern',
  FALLENSTAR:'fallenstar', MANACRYSTAL:'manacrystal',
  SILVERCOIN:'silvercoin', GOLDCOIN:'goldcoin', PLATINUMCOIN:'platinumcoin',
  TOMBSTONE:'tombstone', SUNFLOWER:'sunflower', GRAVEDIGGERSHOVEL:'gravediggersshovel', SHADOWCANDLE:'shadowcandle', TATTEREDSIGN:'tatteredsign',
  VITALCRYSTAL:'vitalcrystal', AEGISFRUIT:'aegisfruit', AMBROSIA:'ambrosia', ADVCOMBAT2:'advancedcombat2',
  FLINXSTAFF:'flinxstaff', AMBER:'amber', AMBERROBE:'amberrobe', AMBERSTAFF:'amberstaff',
  // ---- Missing subsystems + content batch ----
  GRAPPLINGHOOK:'grapplinghook', IVYWHIP:'ivywhip', WEBSLINGER:'webslinger',
  DUALHOOK:'dualhook', CHRISTMASHOOK:'christmashook', LUNARHOOK:'lunarhook', SPOOKYHOOK:'spookyhook',
  UNICORNMOUNT:'unicornmount', BROOM:'broom', UFOMOUNT:'ufomount',
  REINDEERMOUNT:'reindeermount', SHRIMPYTRUFFLE:'shrimpy',
  FISHINGROD_WOODEN:'woodenrod', FISHINGROD_IRON:'ironrod',
  FISHINGROD_FIBERGLASS:'fiberglassrod', FISHINGROD_GOLDEN:'goldenrod',
  HOTLINEFISHINGHOOK:'hotlinefishinghook', ANGLEREARRING:'anglerearring', TACKLEBOX:'tacklebox',
  FISHERMANSPOCKETGUIDE:'fishermanspocketguide', WEATHERRADIO:'weatherradio', SEXTANT:'sextant', FISHFINDER:'fishfinder',
  WORM:'worm', NIGHTCRAWLER:'nightcrawler',
  FISH_BASS:'bass', FISH_TROUT:'trout', FISH_SALMON:'salmon', FISH_NEONTETRA:'neontetra',
  FISH_EBONKOI:'ebonkoi', FISH_CRIMSONTIGER:'crimsontiger', FISH_CAVEFISH:'cavefish',
  FISH_FLOUNDER:'flounder', FISH_ROCKFISH:'rockfish', FISH_PUFFER:'pufferfish',
  WOODENCRATE:'woodencrate', IRONCRATE:'ironcrate', GOLDENCRATE:'goldencrate',
  ZEPHYRFISH:'zephyrfish', PUPPY:'puppy', BABYDINO:'babydino', BABYEATER:'babyeater',
  CATLICENSE:'catlicense', RABBITPERCH:'rabbitperch', LIGHTNINGCARROT:'lightningcarrot',
  WISP:'wisp', SHADOWORB:'shadoworb', MAGICLANTERN:'magiclantern',
  PUMPKIN:'pumpkin', ECTOPLASM:'ectoplasm',
  PUMPKINMEDALLION:'pumpkinmedallion', NAUGHTYPRESENT:'naughtypresent',
  SPOOKYWOOD:'spookywood', GLASS:'glass', HONEY:'honey',
  CHEST:'chest', CHAIR:'chair', TABLE:'table', WOODWALL:'woodwall',
  THEHORSEMANSBLADE:'horsemansblade', RAZORPINE:'razorpine', SNOWMANCANNON:'snowmancannon',
  INFLUXWAVER:'influxwaver', CHARGEDBLASTER:'chargedblaster',
  DYE_RED:'dyered', DYE_ORANGE:'dyeorange', DYE_YELLOW:'dyeyellow', DYE_GREEN:'dyegreen',
  DYE_CYAN:'dyecyan', DYE_BLUE:'dyeblue', DYE_PURPLE:'dyepurple', DYE_PINK:'dyepink',
  DYE_WHITE:'dyewhite', DYE_BLACK:'dyeblack', DYE_BROWN:'dyebrown', DYE_RAINBOW:'dyerainbow',
  STRANGEPLANT:'strangeplant', DYE_ACID:'dyeacid', DYE_BLUEACID:'dyeblueacid',
  DYE_REDACID:'dyeredacid', DYE_GLOWINGMUSHROOM:'dyeglowingmushroom',
  DART:'dart', CRYSTALDART:'crystaldart', CURSEDDART:'curseddart', ICHORDART:'ichordart', VENOMDART:'venomdart',
  ROCKET1:'rocket1', ROCKET2:'rocket2', ROCKET3:'rocket3', ROCKET4:'rocket4', GRENADE:'grenade',
  COIN:'coin', CELEBRATION:'celebration', COINGUN:'coingun',
  MININGPOTION:'miningpotion', FISHINGPOTION:'fishingpotion', BATTLEPOTION:'battlepotion',
  CLOUDINABOTTLE:'cloudinabottle', GOLDENHORSESHOE:'goldenhorseshoe',
  CRIMSTONE:'crimstone', CRIMTANE:'crimtane', ASH:'ash', HELLSTONE:'hellstone',
  HELLBRICK:'hellbrick', CLOUD:'cloud', GRANITE:'granite', MARBLE:'marble', OBSIDIAN:'obsidian',
  STARFURY:'starfury',
  // ---- Pre-hardmode phase ----
  COPPER:'copper', SILVER:'silver', GOLD:'gold', DEMONITE:'demonite', SHADOWSCALE:'shadowscale', TISSUESAMPLE:'tissuesample',
  COPPERBAR:'copperbar', SILVERBAR:'silverbar', GOLDBAR:'goldbar', DEMONITEBAR:'demonitebar', CRIMTANEBAR:'crimtanebar',
  COPPERPICK:'copperpick', SILVERPICK:'silverpick', GOLDPICK:'goldpick', DEMONITEPICK:'demonitepick', DEATHBRINGERPICK:'deathbringerpick',
  COPPERSWORD:'coppersword', COPPERSHORT:'coppershort', COPPERAXE:'copperaxe', SILVERSWORD:'silversword', GOLDSWORD:'goldsword', DEMONITESWORD:'demonitesword',
  COPPERBOW:'copperbow', SILVERBOW:'silverbow', GOLDBOW:'goldbow',
  COPPERHELM:'copperhelm', COPPERCHEST:'copperchest', COPPERLEGS:'copperlegs',
  SILVERHELM:'silverhelm', SILVERCHEST:'silverchest', SILVERLEGS:'silverlegs',
  GOLDHELM:'goldhelm', GOLDCHEST:'goldchest', GOLDLEGS:'goldlegs',
  DEMONITEHELM:'demonitehelm', DEMONITECHEST:'demonitechest', DEMONITELEGS:'demonitelegs',
  CRIMTANEHELM:'crimtanehelm', CRIMTANECHEST:'crimtanechest', CRIMTANELEGS:'crimtanelegs',
  GEL:'gel', LENS:'lens',
  SLIMECROWN:'slimecrown', SUSPICIOUSLEYE:'suspiciouseye', WORMLOOD:'wormfood', BLOODYSPINE:'bloodyspine',
  ABEEMINATION:'abeemination', CLOTHIERDOLL:'clothierdoll', GUIDEVOODOODOLL:'guidevoodoodoll',
  // ---- Dungeon / alternate ores / structures ----
  TIN:'tin', LEAD:'lead', TUNGSTEN:'tungsten', PLATINUM:'platinum',
  TINBAR:'tinbar', LEADBAR:'leadbar', TUNGSTENBAR:'tungstenbar', PLATINUMBAR:'platinumbar',
  METEORITE:'meteorite', METEORITEBAR:'meteoritebar',
  DUNGEONBRICK:'dungeonbrick', SANDSTONE:'sandstone',
  GOLDENKEY:'goldenkey', MURAMASA:'muramasa', AQUASCEPTER:'aquascepter', PHAROAHMASK:'pharoahmask',
  METEORHELM:'meteorhelm', METEORCHEST:'meteorchest', METEORLEGS:'meteorlegs',
  SPACEGUN:'spacegun',
  TINPICK:'tinpick', LEADPICK:'leadpick', TUNGSTENPICK:'tungstenpick', PLATINUMPICK:'platinumpick', METEORITEPICK:'meteoritepick',
  TINSWORD:'tinsword', LEANSWORD:'leadsword', TUNGSTENSWORD:'tungstensword', PLATINUMSWORD:'platinumsword',
  TINHELM:'tinhelm', TINCHEST:'tinchest', TINLEGS:'tinlegs',
  LEADHELM:'leadhelm', LEADCHEST:'leadchest', LEADLEGS:'leadlegs',
  TUNGSTENHELM:'tungstenhelm', TUNGSTENCHEST:'tungstenchest', TUNGSTENLEGS:'tungstenlegs',
  PLATINUMHELM:'platinumhelm', PLATINUMCHEST:'platinumchest', PLATINUMLEGS:'platinumlegs',
  // ---- Underworld progression ----
  HELLFORGE:'hellforge', HELLSTONEBAR:'hellstonebar', SHADOWKEY:'shadowkey',
  MOLTENPICK:'moltenpick', VOLCANO:'volcano',
  MOLTENHELM:'moltenhelm', MOLTENCHEST:'moltenchest', MOLTENLEGS:'moltenlegs',
  SUNFURY:'sunfury', FLAMELASH:'flamelash', HELLWINGBOW:'hellwingbow', DARKLANCE:'darklance',
  MUSKET:'musket', VILETHORN:'vilethorn', BALLOHURT:'ballohurt', BANDOFSTARPOWER:'bandofstarpower',
  UNDERTAKER:'undertaker', CRIMSONROD:'crimsonrod', ROTTENFORK:'rottenfork', PANICNECKLACE:'panicnecklace',
  WATERBOLT:'waterbolt', DEMONSCYTHE:'demonscythe', BEEGUN:'beegun',
  STARCANNON:'starcannon', CANDYCANESWORD:'candycanesword', CANDYCANE_BOW:'candycanebow',
  // ---- Invasions / eclipse / lunar ----
  TATTEREDCLOTH:'tatteredcloth', GOBLINBATTLESTANDARD:'goblinbattlestandard',
  PIRATEMAP:'piratemap',
  // ---- Town Pylon network ----
  PYLON_FOREST:'pylonforest', PYLON_DESERT:'pylondesert', PYLON_SNOW:'pylonsnow',
  PYLON_JUNGLE:'pylonjungle', PYLON_HALLOW:'pylonhallow', PYLON_CORRUPT:'pyloncorrupt',
  PYLON_CRIMSON:'pyloncrimson', PYLON_OCEAN:'pylonocean', PYLON_UNIVERSAL:'pylonuniversal',
  METALDETECTOR:'metaldetector', BUTTERFLYWINGS:'butterflywings', UMBRELLA:'umbrella',
  ASH_WOOD_SWORD:'ashwoodsword',
  BAT_BAT:'batbat',
  BEE_KEEPER:'beekeeper',
  BLADE_OF_GRASS:'bladeofgrass',
  BLADED_GLOVE:'bladedglove',
  BLADETONGUE:'bladetongue',
  BLOOD_BUTCHERER:'bloodbutcherer',
  BONE_SWORD:'bonesword',
  BOREAL_WOOD_SWORD:'borealwoodsword',
  BRAND_OF_THE_INFERNO:'brandoftheinferno',
  BREAKER_BLADE:'breakerblade',
  BREATHING_REED:'breathingreed',
  CACTUS_SWORD:'cactussword',
  CHRISTMAS_TREE_SWORD:'christmastreesword',
  CLASSY_CANE:'classycane',
  EBONWOOD_SWORD:'ebonwoodsword',
  ENCHANTED_SWORD:'enchantedsword',
  EXOTIC_SCIMITAR:'exoticscimitar',
  FALCON_BLADE:'falconblade',
  FLYING_DRAGON:'flyingdragon',
  FLYMEAL:'flymeal',
  GOLD_BROADSWORD:'goldbroadsword',
  HAM_BAT:'hambat',
  ICE_BLADE:'iceblade',
  ICE_SICKLE:'icesickle',
  IRON_BROADSWORD:'ironbroadsword',
  KATANA:'katana',
  LEAD_BROADSWORD:'leadbroadsword',
  LIGHTS_BANE:'lightsbane',
  MANDIBLE_BLADE:'mandibleblade',
  MEOWMERE:'meowmere',
  ORANGE_PHASEBLADE:'orangephaseblade',
  PALLADIUM_SWORD:'palladiumsword',
  PALM_WOOD_SWORD:'palmwoodsword',
  PEARLWOOD_SWORD:'pearlwoodsword',
  PINK_PHASEBLADE:'pinkphaseblade',
  PLATINUM_BROADSWORD:'platinumbroadsword',
  PURPLE_CLUBBERFISH:'purpleclubberfish',
  RAINBOW_PHASEBLADE:'rainbowphaseblade',
  RED_PHASEBLADE:'redphaseblade',
  RICH_MAHOGANY_SWORD:'richmahoganysword',
  SHADEWOOD_SWORD:'shadewoodsword',
  SHIELD_OF_CTHULHU:'shieldofcthulhu',
  SICKLE:'sickle',
  SILVER_BROADSWORD:'silverbroadsword',
  SLAP_HAND:'slaphand',
  STAR_WRATH:'starwrath',
  STYLISH_SCISSORS:'stylishscissors',
  TIN_BROADSWORD:'tinbroadsword',
  TRAGIC_UMBRELLA:'tragicumbrella',
  TUNGSTEN_BROADSWORD:'tungstenbroadsword',
  WAFFLES_IRON:'wafflesiron',
  WHITE_PHASEBLADE:'whitephaseblade',
  YELLOW_PHASEBLADE:'yellowphaseblade',
  ZOMBIE_ARM:'zombiearm',
  RED_PHASESABER:'redphasesaber',
  WHITE_PHASESABER:'whitephasesaber',
  YELLOW_PHASESABER:'yellowphasesaber',
  ORANGE_PHASESABER:'orangephasesaber',
  PINK_PHASESABER:'pinkphasesaber',
  RAINBOW_PHASESABER:'rainbowphasesaber',
  BONE_PICKAXE:'bonepickaxe',
  CACTUS_PICKAXE:'cactuspickaxe',
  CANDY_CANE_PICKAXE:'candycanepickaxe',
  CHLOROPHYTE_PICKAXE:'chlorophytepickaxe',
  FOSSIL_PICKAXE:'fossilpickaxe',
  NEBULA_PICKAXE:'nebulapickaxe',
  ORICHALCUM_PICKAXE:'orichalcumpickaxe',
  PALLADIUM_PICKAXE:'palladiumpickaxe',
  REAVER_SHARK:'reavershark',
  SOLAR_FLARE_PICKAXE:'solarflarepickaxe',
  SPECTRE_PICKAXE:'spectrepickaxe',
  STARDUST_PICKAXE:'stardustpickaxe',
  VORTEX_PICKAXE:'vortexpickaxe',
  ASH_WOOD_HAMMER:'ashwoodhammer',
  BOREAL_WOOD_HAMMER:'borealwoodhammer',
  CHLOROPHYTE_WARHAMMER:'chlorophytewarhammer',
  COPPER_HAMMER:'copperhammer',
  EBONWOOD_HAMMER:'ebonwoodhammer',
  FLESH_GRINDER:'fleshgrinder',
  GOLD_HAMMER:'goldhammer',
  HAMMUSH:'hammush',
  IRON_HAMMER:'ironhammer',
  LEAD_HAMMER:'leadhammer',
  NEBULA_HAMMER:'nebulahammer',
  PALM_WOOD_HAMMER:'palmwoodhammer',
  PEARLWOOD_HAMMER:'pearlwoodhammer',
  PLATINUM_HAMMER:'platinumhammer',
  RICH_MAHOGANY_HAMMER:'richmahoganyhammer',
  SHADEWOOD_HAMMER:'shadewoodhammer',
  SHROOMITE_DIGGING_CLAW:'shroomitediggingclaw',
  SILVER_HAMMER:'silverhammer',
  SOLAR_FLARE_HAMMER:'solarflarehammer',
  STARDUST_HAMMER:'stardusthammer',
  THE_BREAKER:'thebreaker',
  TIN_HAMMER:'tinhammer',
  TUNGSTEN_HAMMER:'tungstenhammer',
  VORTEX_HAMMER:'vortexhammer',
  WOODEN_HAMMER:'woodenhammer',
  ADAMANTITE_WARAXE:'adamantitewaraxe',
  AXE_OF_REGROWTH:'axeofregrowth',
  BLOOD_LUST_CLUSTER:'bloodlustcluster',
  CHLOROPHYTE_GREATAXE:'chlorophytegreataxe',
  COBALT_WARAXE:'cobaltwaraxe',
  GOLD_AXE:'goldaxe',
  LEAD_AXE:'leadaxe',
  METEOR_HAMAXE:'meteorhamaxe',
  MOLTEN_HAMAXE:'moltenhamaxe',
  MYTHRIL_WARAXE:'mythrilwaraxe',
  NEBULA_AXE:'nebulaaxe',
  NEBULA_HAMAXE:'nebulahamaxe',
  ORICHALCUM_WARAXE:'orichalcumwaraxe',
  PALLADIUM_WARAXE:'palladiumwaraxe',
  PLATINUM_AXE:'platinumaxe',
  SILVER_AXE:'silveraxe',
  SOLAR_FLARE_AXE:'solarflareaxe',
  SOLAR_FLARE_HAMAXE:'solarflarehamaxe',
  STARDUST_AXE:'stardustaxe',
  STARDUST_HAMAXE:'stardusthamaxe',
  THE_AXE:'theaxe',
  TIN_AXE:'tinaxe',
  TITANIUM_WARAXE:'titaniumwaraxe',
  TUNGSTEN_AXE:'tungstenaxe',
  VORTEX_AXE:'vortexaxe',
  VORTEX_HAMAXE:'vortexhamaxe',
  WAR_AXE_OF_THE_NIGHT:'waraxeofthenight',
  ADAMANTITE_REPEATER:'adamantiterepeater',
  ASH_WOOD_BOW:'ashwoodbow',
  BLOOD_RAIN_BOW:'bloodrainbow',
  BLOWGUN:'blowgun',
  BLOWPIPE:'blowpipe',
  BOREAL_WOOD_BOW:'borealwoodbow',
  COBALT_REPEATER:'cobaltrepeater',
  DEMON_BOW:'demonbow',
  EBONWOOD_BOW:'ebonwoodbow',
  LEAD_BOW:'leadbow',
  MYTHRIL_REPEATER:'mythrilrepeater',
  ORICHALCUM_REPEATER:'orichalcumrepeater',
  PALLADIUM_REPEATER:'palladiumrepeater',
  PALM_WOOD_BOW:'palmwoodbow',
  PEARLWOOD_BOW:'pearlwoodbow',
  PLATINUM_BOW:'platinumbow',
  RICH_MAHOGANY_BOW:'richmahoganybow',
  SHADEWOOD_BOW:'shadewoodbow',
  SKULL_BOW:'skullbow',
  TENDON_BOW:'tendonbow',
  TIN_BOW:'tinbow',
  TITANIUM_REPEATER:'titaniumrepeater',
  TUNGSTEN_BOW:'tungstenbow',
  WOODEN_BOW:'woodenbow',
  AERIAL_BANE:'aerialbane',
  BARREL_LAUNCHER:'barrellauncher',
  BONE_JAVELIN:'bonejavelin',
  BONE_THROWING_KNIFE:'bonethrowingknife',
  CELEBRATION_MK2:'celebrationmk2',
  ENDLESS_MUSKET_POUCH:'endlessmusketpouch',
  ENDLESS_QUIVER:'endlessquiver',
  EVENTIDE:'eventide',
  FLINTLOCK_PISTOL:'flintlockpistol',
  FROST_DAGGERFISH:'frostdaggerfish',
  GATLIGATOR:'gatligator',
  HANDGUN:'handgun',
  HARPOON:'harpoon',
  JAVELIN:'javelin',
  METEOR_SHOT:'meteorshot',
  MINI_NUKE_I:'mininukei',
  MINI_NUKE_I_I:'mininukeii',
  MINISHARK:'minishark',
  MOLTEN_FURY:'moltenfury',
  PAINTBALL_GUN:'paintballgun',
  PHANTASM:'phantasm',
  PHANTOM_PHOENIX:'phantomphoenix',
  PHOENIX_BLASTER:'phoenixblaster',
  POISONED_KNIFE:'poisonedknife',
  QUAD_BARREL_SHOTGUN:'quadbarrelshotgun',
  RED_RYDER:'redryder',
  REVOLVER:'revolver',
  S_D_M_G:'sdmg',
  SANDGUN:'sandgun',
  SHURIKEN:'shuriken',
  SPIKY_BALL:'spikyball',
  STYNGER:'stynger',
  STYNGER_BOLT:'styngerbolt',
  SUPER_STAR_SHOOTER:'superstarshooter',
  THE_BEES_KNEES:'thebeesknees',
  THROWING_KNIFE:'throwingknife',
  TOXIKARP:'toxikarp',
  VORTEX_BEATER:'vortexbeater',
  ALE_TOSSER:'aletosser',
  BEENADE:'beenade',
  BLUE_FLARE:'blueflare',
  BOUNCY_GRENADE:'bouncygrenade',
  CANDY_CORN:'candycorn',
  CANDY_CORN_RIFLE:'candycornrifle',
  CHLOROPHYTE_ARROW:'chlorophytearrow',
  CLUSTER_ROCKET_I:'clusterrocketi',
  CLUSTER_ROCKET_I_I:'clusterrocketii',
  CURSED_ARROW:'cursedarrow',
  CURSED_FLARE:'cursedflare',
  DRY_ROCKET:'dryrocket',
  EXPLODING_BULLET:'explodingbullet',
  EXPLOSIVE_JACK_O_LANTERN:'explosivejackolantern',
  FLAMING_ARROW:'flamingarrow',
  FLARE:'flare',
  GOLDEN_BULLET:'goldenbullet',
  HAPPY_GRENADE:'happygrenade',
  HIGH_VELOCITY_BULLET:'highvelocitybullet',
  HONEY_ROCKET:'honeyrocket',
  ICHOR_ARROW:'ichorarrow',
  JACK_O_LANTERN_LAUNCHER:'jackolanternlauncher',
  LAVA_ROCKET:'lavarocket',
  LUMINITE_ARROW:'luminitearrow',
  LUMINITE_BULLET:'luminitebullet',
  MOLOTOV_COCKTAIL:'molotovcocktail',
  NAIL:'nail',
  NANO_BULLET:'nanobullet',
  PARTY_BULLET:'partybullet',
  POISON_DART:'poisondart',
  RAINBOW_FLARE:'rainbowflare',
  ROTTEN_EGG:'rottenegg',
  SEED:'seed',
  SHIMMER_ARROW:'shimmerarrow',
  SHIMMER_FLARE:'shimmerflare',
  SNOWBALL:'snowball',
  SNOWBALL_CANNON:'snowballcannon',
  SPELUNKER_FLARE:'spelunkerflare',
  STAKE:'stake',
  STAKE_LAUNCHER:'stakelauncher',
  STAR_ANISE:'staranise',
  STICKY_GRENADE:'stickygrenade',
  TUNGSTEN_BULLET:'tungstenbullet',
  VENOM_ARROW:'venomarrow',
  WET_ROCKET:'wetrocket',
  AMETHYST_STAFF:'amethyststaff',
  ARC_SURGE:'arcsurge',
  BAT_SCEPTER:'batscepter',
  BEJEWELED_STAFF:'bejeweledstaff',
  BETSYS_WRATH:'betsyswrath',
  BOOK_OF_SKULLS:'bookofskulls',
  CRYSTAL_SERPENT:'crystalserpent',
  DAYBLOOM_STAFF:'daybloomstaff',
  DIAMOND_STAFF:'diamondstaff',
  EMERALD_STAFF:'emeraldstaff',
  FLOWER_OF_FROST:'floweroffrost',
  FROST_STAFF:'froststaff',
  GLACIER_FANG:'glacierfang',
  GRAY_ZAPINATOR:'grayzapinator',
  ICE_ROD:'icerod',
  KILLING_DECK:'killingdeck',
  LEAF_BLOWER:'leafblower',
  LIGHTNING_STRIKE:'lightningstrike',
  MAGIC_DAGGER:'magicdagger',
  MAGIC_MISSILE:'magicmissile',
  MEDUSA_HEAD:'medusahead',
  METEOR_STAFF:'meteorstaff',
  MYSTIC_BLOOM:'mysticbloom',
  NIGHTGLOW:'nightglow',
  ORANGE_ZAPINATOR:'orangezapinator',
  POISON_STAFF:'poisonstaff',
  RESONANCE_SCEPTER:'resonancescepter',
  RUBY_STAFF:'rubystaff',
  SAPPHIRE_STAFF:'sapphirestaff',
  STELLAR_TUNE:'stellartune',
  THUNDER_ZAPPER:'thunderzapper',
  TOME_OF_INFINITE_WISDOM:'tomeofinfinitewisdom',
  TOPAZ_STAFF:'topazstaff',
  WAND_OF_FROSTING:'wandoffrosting',
  WAND_OF_SPARKING:'wandofsparking',
  WASP_GUN:'waspgun',
  BALLISTA_CANE:'ballistacane',
  BALLISTA_ROD:'ballistarod',
  BALLISTA_STAFF:'ballistastaff',
  BARNACLE_STAFF:'barnaclestaff',
  CATTIVA:'cattiva',
  CLAY_BUD_STAFF:'claybudstaff',
  COBWHIP:'cobwhip',
  ELECTRIC_EEL:'electriceel',
  EXPLOSIVE_TRAP_CANE:'explosivetrapcane',
  EXPLOSIVE_TRAP_ROD:'explosivetraprod',
  EXPLOSIVE_TRAP_STAFF:'explosivetrapstaff',
  FINCH_STAFF:'finchstaff',
  FLAMEBURST_CANE:'flameburstcane',
  FLAMEBURST_ROD:'flameburstrod',
  FLAMEBURST_STAFF:'flameburststaff',
  FOXPARKS:'foxparks',
  HOUNDIUS_SHOOTIUS:'houndiusshootius',
  LIGHTNING_AURA_CANE:'lightningauracane',
  LIGHTNING_AURA_ROD:'lightningaurarod',
  LIGHTNING_AURA_STAFF:'lightningaurastaff',
  LUNAR_PORTAL_STAFF:'lunarportalstaff',
  MUSHROOM_STAFF:'mushroomstaff',
  POSSESSION:'possession',
  QUEEN_SPIDER_STAFF:'queenspiderstaff',
  RAINBOW_CRYSTAL_STAFF:'rainbowcrystalstaff',
  RUINOUS_STAFF:'ruinousstaff',
  SLIME_STAFF:'slimestaff',
  SLIME_WHIP:'slimewhip',
  SOULSCOURGE:'soulscourge',
  SPINAL_TAP:'spinaltap',
  STAFF_OF_THE_FROST_HYDRA:'staffofthefrosthydra',
  STARCRASH:'starcrash',
  TRUSTY_CATTIVA:'trustycattiva',
  TRUSTY_FOXPARKS:'trustyfoxparks',
  VAMPIRE_FROG_STAFF:'vampirefrogstaff',
  VASCULASH:'vasculash',
  VULGAR_DISPLAY_OF_FLOWER:'vulgardisplayofflower',
  TENTACLE_SPIKE:'tentaclespike',
  STURDY_FOSSIL:'sturdyfossil',
  BEE_WAX:'beewax',
  JUNGLE_SPORES:'junglespore',
  BEETLE_HUSK:'beetlehusk',
  ANCIENT_COBALT_BREASTPLATE:'ancientcobaltbreastplate',
  ANCIENT_COBALT_HELMET:'ancientcobalthelmet',
  BEE_BREASTPLATE:'beebreastplate',
  BEE_GREAVES:'beegreaves',
  BEE_HEADGEAR:'beeheadgear',
  BEETLE_SCALE_MAIL:'beetlescalemail',
  CHLOROPHYTE_GREAVES:'chlorophytegreaves',
  CHLOROPHYTE_HEADGEAR:'chlorophyteheadgear',
  CHLOROPHYTE_MASK:'chlorophytemask',
  CRIMSON_GREAVES:'crimsongreaves',
  CRIMSON_HELMET:'crimsonhelmet',
  CRIMSON_SCALEMAIL:'crimsonscalemail',
  FORBIDDEN_MASK:'forbiddenmask',
  FORBIDDEN_TREADS:'forbiddentreads',
  FOSSIL_GREAVES:'fossilgreaves',
  FOSSIL_HELMET:'fossilhelmet',
  FOSSIL_PLATE:'fossilplate',
  GLADIATOR_BREASTPLATE:'gladiatorbreastplate',
  GLADIATOR_HELMET:'gladiatorhelmet',
  GLADIATOR_LEGGINGS:'gladiatorleggings',
  HALLOWED_HEADGEAR:'hallowedheadgear',
  HALLOWED_MASK:'hallowedmask',
  HALLOWED_PLATE_MAIL:'hallowedplatemail',
  IRON_CHAINMAIL:'ironchainmail',
  IRON_GREAVES:'irongreaves',
  IRON_HELMET:'ironhelmet',
  JUNGLE_HAT:'junglehat',
  JUNGLE_PANTS:'junglepants',
  JUNGLE_SHIRT:'jungleshirt',
  NECRO_BREASTPLATE:'necrobreastplate',
  NECRO_GREAVES:'necrogreaves',
  NECRO_HELMET:'necrohelmet',
  NINJA_HOOD:'ninjahood',
  NINJA_PANTS:'ninjapants',
  NINJA_SHIRT:'ninjashirt',
  OBSIDIAN_LONGCOAT:'obsidianlongcoat',
  OBSIDIAN_OUTLAW_HAT:'obsidianoutlawhat',
  OBSIDIAN_PANTS:'obsidianpants',
  SHADOW_GREAVES:'shadowgreaves',
  SHADOW_HELMET:'shadowhelmet',
  SHADOW_SCALEMAIL:'shadowscalemail',
  SHROOMITE_MASK:'shroomitemask',
  TURTLE_SCALE_MAIL:'turtlescalemail',
    AGLET:'aglet',
  AMPHIBIAN_BOOTS:'amphibianboots',
  ANKH_CHARM:'ankhcharm',
  BAND_OF_REGENERATION:'bandofregeneration',
  BLIZZARD_IN_A_BOTTLE:'blizzardinabottle',
  CELESTIAL_EMBLEM:'celestialemblem',
  CELL_PHONE:'cellphone',
  CLIMBING_CLAWS:'climbingclaws',
  COMPASS:'compass',
  D_P_S_METER:'dpsmeter',
  DEMON_WINGS:'demonwings',
  DEPTH_METER:'depthmeter',
  FART_IN_A_JAR:'fartinajar',
  FERAL_CLAWS:'feralclaws',
  FLYING_CARPET:'flyingcarpet',
  FROG_WEBBING:'frogwebbing',
  G_P_S:'gps',
  HERMES_BOOTS:'hermesboots',
  LAVA_WADERS:'lavawaders',
  LIFEFORM_ANALYZER:'lifeformanalyzer',
  LUCKY_HORSESHOE:'luckyhorseshoe',
  MAGIC_CUFFS:'magiccuffs',
  MAGIC_MIRROR:'magicmirror',
  MAGMA_STONE:'magmastone',
  MOLTEN_CHARM:'moltencharm',
  MOLTEN_QUIVER:'moltenquiver',
  OBSIDIAN_SKULL:'obsidianskull',
  P_D_A:'pda',
  PHILOSOPHERS_STONE:'philosophersstone',
  R_E_K_3000:'rek3000',
  RADAR:'radar',
  ROCKET_BOOTS:'rocketboots',
  SANDSTORM_IN_A_BOTTLE:'sandstorminabottle',
  SHACKLE:'shackle',
  STOPWATCH:'stopwatch',
  TITAN_GLOVE:'titanglove',
  TSUNAMI_IN_A_BOTTLE:'tsunamiinabottle',
  WATER_WALKING_BOOTS:'waterwalkingboots',
  YOYO_BAG:'yoyobag',
    BOTTLED_HONEY:'bottledhoney',
  BOTTLED_WATER:'bottledwater',
  CALMING_POTION:'calmingpotion',
  CRATE_POTION:'cratepotion',
  EGGNOG:'eggnog',
  FEATHERFALL_POTION:'featherfallpotion',
  FLIPPER_POTION:'flipperpotion',
  GILLS_POTION:'gillspotion',
  GRAVITATION_POTION:'gravitationpotion',
  HONEYFIN:'honeyfin',
  HUNTER_POTION:'hunterpotion',
  JUNGLE_JUICE:'junglejuice',
  LESSER_HEALING_POTION:'lesserhealingpotion',
  LESSER_RESTORATION_POTION:'lesserrestorationpotion',
  LOVE_POTION:'lovepotion',
  MANA_REGENERATION_POTION:'manaregenerationpotion',
  NIGHT_OWL_POTION:'nightowlpotion',
  NIGHT_VISION_POTION:'nightvisionpotion',
  RECALL_POTION:'recallpotion',
  RESTORATION_POTION:'restorationpotion',
  SHINE_POTION:'shinepotion',
  SONAR_POTION:'sonarpotion',
  SPELUNKER_POTION:'spelunkerpotion',
  STINK_POTION:'stinkpotion',
  STRANGE_BREW:'strangebrew',
  TELEPORTATION_POTION:'teleportationpotion',
  TITAN_POTION:'titanpotion',
  WORMHOLE_POTION:'wormholepotion',
  BED:'bed',
  PIGGY_BANK:'piggybank',
  WOODEN_DOOR:'woodendoor',
  CLAY:'clay',
  GRAY_BRICK:'graybrick',
  RED_BRICK:'redbrick',
  BOTTLE:'bottle',
  CLAY_POT:'claypot',
  SIGN:'sign',
  BOOK:'book',
  CHAIN:'chain',
  ACORN:'acorn',
  CORRUPT_SEEDS:'corruptseeds',
  GRASS_SEEDS:'grassseeds',
  JUNGLE_GRASS_SEEDS:'junglegrassseeds',
  MUSHROOM_GRASS_SEEDS:'mushroomgrassseeds',
    AMBER_HOOK:'amberhook',
  BAT_HOOK:'bathook',
  SKELETRON_HAND:'skeletronhand',
  SLIME_HOOK:'slimehook',
  SQUIRREL_HOOK:'squirrelhook',
  STATIC_HOOK:'statichook',
  TENDON_HOOK:'tendonhook',
  THORN_HOOK:'thornhook',
  MAGICAL_PUMPKIN_SEED:'magicalpumpkinseed',
  PARROT_CRACKER:'parrotcracker',
  UNLUCKY_YARN:'unluckyyarn',
  SUMMER_HAT:'summerhat',
  TUXEDO_PANTS:'tuxedopants',
  TUXEDO_SHIRT:'tuxedoshirt',
  ANVIL_STATUE:'anvilstatue',
  IRON_ANVIL:'ironanvil',
  LEAD_ANVIL:'leadanvil',
  MYTHRIL_ANVIL:'mythrilanvil',
  ORICHALCUM_ANVIL:'orichalcumanvil',
  AETHERIUM_BATHTUB:'aetheriumbathtub',
  AQUARIUM_BATHTUB:'aquariumbathtub',
  ASH_WOOD_BATHTUB:'ashwoodbathtub',
  BALLOON_BATHTUB:'balloonbathtub',
  BAMBOO_BATHTUB:'bamboobathtub',
  BATHTUB:'bathtub',
  BLUE_DUNGEON_BATHTUB:'bluedungeonbathtub',
  BONE_BATHTUB:'bonebathtub',
  BOREAL_WOOD_BATHTUB:'borealwoodbathtub',
  BOULDER_BATHTUB:'boulderbathtub',
  CACTUS_BATHTUB:'cactusbathtub',
  CLOUD_BATHTUB:'cloudbathtub',
  CRIMTANE_BATHTUB:'crimtanebathtub',
  CRYSTAL_BATHTUB:'crystalbathtub',
  DEMONITE_BATHTUB:'demonitebathtub',
  DUSKWARE_BATHTUB:'duskwarebathtub',
  DYNASTY_BATHTUB:'dynastybathtub',
  EASTER_BATHTUB:'easterbathtub',
  EBONWOOD_BATHTUB:'ebonwoodbathtub',
  FALLEN_STAR_BATHTUB:'fallenstarbathtub',
  FEYWOOD_BATHTUB:'feywoodbathtub',
  FLESH_BATHTUB:'fleshbathtub',
  FLINX_FUR_BATHTUB:'flinxfurbathtub',
  FORBIDDEN_BATHTUB:'forbiddenbathtub',
  FROZEN_BATHTUB:'frozenbathtub',
  GLASS_BATHTUB:'glassbathtub',
  GOLDEN_BATHTUB:'goldenbathtub',
  GOTHIC_BATHTUB:'gothicbathtub',
  GRANITE_BATHTUB:'granitebathtub',
  GREEN_DUNGEON_BATHTUB:'greendungeonbathtub',
  HALLOWED_BATHTUB:'hallowedbathtub',
  HARPY_BATHTUB:'harpybathtub',
  HONEY_BATHTUB:'honeybathtub',
  JELLYFISH_BATHTUB:'jellyfishbathtub',
  LESION_BATHTUB:'lesionbathtub',
  LIBRARIAN_BATHTUB:'librarianbathtub',
  LIHZAHRD_BATHTUB:'lihzahrdbathtub',
  LIVING_WOOD_BATHTUB:'livingwoodbathtub',
  MARBLE_BATHTUB:'marblebathtub',
  MARTIAN_BATHTUB:'martianbathtub',
  METEORITE_BATHTUB:'meteoritebathtub',
  MUSHROOM_BATHTUB:'mushroombathtub',
  NEBULA_BATHTUB:'nebulabathtub',
  OBSIDIAN_BATHTUB:'obsidianbathtub',
  OFFICE_BATHTUB:'officebathtub',
  PALM_WOOD_BATHTUB:'palmwoodbathtub',
  PEARLWOOD_BATHTUB:'pearlwoodbathtub',
  PINE_BATHTUB:'pinebathtub',
  PINK_DUNGEON_BATHTUB:'pinkdungeonbathtub',
  PUMPKIN_BATHTUB:'pumpkinbathtub',
  REEF_BATHTUB:'reefbathtub',
  RICH_MAHOGANY_BATHTUB:'richmahoganybathtub',
  SANDSTONE_BATHTUB:'sandstonebathtub',
  SHADEWOOD_BATHTUB:'shadewoodbathtub',
  SKYWARE_BATHTUB:'skywarebathtub',
  SLIME_BATHTUB:'slimebathtub',
  SNOW_BATHTUB:'snowbathtub',
  SOLAR_BATHTUB:'solarbathtub',
  SPIDER_BATHTUB:'spiderbathtub',
  SPIKE_BATHTUB:'spikebathtub',
  SPOOKY_BATHTUB:'spookybathtub',
  STARDUST_BATHTUB:'stardustbathtub',
  STEAMPUNK_BATHTUB:'steampunkbathtub',
  STONE_BATHTUB:'stonebathtub',
  VORTEX_BATHTUB:'vortexbathtub',
  AETHERIUM_BED:'aetheriumbed',
  AQUARIUM_BED:'aquariumbed',
  ASH_WOOD_BED:'ashwoodbed',
  BALLOON_BED:'balloonbed',
  BAMBOO_BED:'bamboobed',
  BLUE_DUNGEON_BED:'bluedungeonbed',
  BONE_BED:'bonebed',
  BOREAL_WOOD_BED:'borealwoodbed',
  BOULDER_BED:'boulderbed',
  CACTUS_BED:'cactusbed',
  CLOUD_BED:'cloudbed',
  CRIMTANE_BED:'crimtanebed',
  CRYSTAL_BED:'crystalbed',
  DEMONITE_BED:'demonitebed',
  DUSKWARE_BED:'duskwarebed',
  DYNASTY_BED:'dynastybed',
  EASTER_BED:'easterbed',
  EBONWOOD_BED:'ebonwoodbed',
  FALLEN_STAR_BED:'fallenstarbed',
  FEYWOOD_BED:'feywoodbed',
  FLESH_BED:'fleshbed',
  FLINX_FUR_BED:'flinxfurbed',
  FORBIDDEN_BED:'forbiddenbed',
  FROZEN_BED:'frozenbed',
  GLASS_BED:'glassbed',
  GOLDEN_BED:'goldenbed',
  GOTHIC_BED:'gothicbed',
  GRANITE_BED:'granitebed',
  GREEN_DUNGEON_BED:'greendungeonbed',
  HALLOWED_BED:'hallowedbed',
  HARPY_BED:'harpybed',
  HONEY_BED:'honeybed',
  JELLYFISH_BED:'jellyfishbed',
  LESION_BED:'lesionbed',
  LIBRARIAN_BED:'librarianbed',
  LIHZAHRD_BED:'lihzahrdbed',
  LIVING_WOOD_BED:'livingwoodbed',
  MARBLE_BED:'marblebed',
  MARTIAN_BED:'martianbed',
  METEORITE_BED:'meteoritebed',
  MUSHROOM_BED:'mushroombed',
  NEBULA_BED:'nebulabed',
  OBSIDIAN_BED:'obsidianbed',
  OFFICE_BED:'officebed',
  PALM_WOOD_BED:'palmwoodbed',
  PEARLWOOD_BED:'pearlwoodbed',
  PINE_BED:'pinebed',
  PINK_DUNGEON_BED:'pinkdungeonbed',
  PUMPKIN_BED:'pumpkinbed',
  REEF_BED:'reefbed',
  RICH_MAHOGANY_BED:'richmahoganybed',
  SANDSTONE_BED:'sandstonebed',
  SHADEWOOD_BED:'shadewoodbed',
  SKYWARE_BED:'skywarebed',
  SLIME_BED:'slimebed',
  SNOW_BED:'snowbed',
  SOLAR_BED:'solarbed',
  SPIDER_BED:'spiderbed',
  SPIKE_BED:'spikebed',
  SPOOKY_BED:'spookybed',
  STARDUST_BED:'stardustbed',
  STEAMPUNK_BED:'steampunkbed',
  STONE_BED:'stonebed',
  VORTEX_BED:'vortexbed',
  AETHERIUM_WORK_BENCH:'aetheriumworkbench',
  AQUARIUM_WORK_BENCH:'aquariumworkbench',
  ASH_WOOD_WORK_BENCH:'ashwoodworkbench',
  BALLOON_WORK_BENCH:'balloonworkbench',
  BAMBOO_WORK_BENCH:'bambooworkbench',
  BENCH:'bench',
  BLUE_DUNGEON_WORK_BENCH:'bluedungeonworkbench',
  BONE_WORK_BENCH:'boneworkbench',
  BOREAL_WOOD_WORK_BENCH:'borealwoodworkbench',
  BOULDER_WORK_BENCH:'boulderworkbench',
  CACTUS_WORK_BENCH:'cactusworkbench',
  CLOUD_WORK_BENCH:'cloudworkbench',
  CRIMTANE_WORK_BENCH:'crimtaneworkbench',
  CRYSTAL_WORK_BENCH:'crystalworkbench',
  DEMONITE_WORK_BENCH:'demoniteworkbench',
  DUSKWARE_WORK_BENCH:'duskwareworkbench',
  DYNASTY_WORK_BENCH:'dynastyworkbench',
  EASTER_WORK_BENCH:'easterworkbench',
  EBONWOOD_WORK_BENCH:'ebonwoodworkbench',
  FALLEN_STAR_WORK_BENCH:'fallenstarworkbench',
  FEYWOOD_WORK_BENCH:'feywoodworkbench',
  FLESH_WORK_BENCH:'fleshworkbench',
  FLINX_FUR_WORK_BENCH:'flinxfurworkbench',
  FORBIDDEN_WORK_BENCH:'forbiddenworkbench',
  FROZEN_WORK_BENCH:'frozenworkbench',
  GLASS_WORK_BENCH:'glassworkbench',
  GOLDEN_WORK_BENCH:'goldenworkbench',
  GOTHIC_WORK_BENCH:'gothicworkbench',
  GRANITE_WORK_BENCH:'graniteworkbench',
  GREEN_DUNGEON_WORK_BENCH:'greendungeonworkbench',
  HALLOWED_WORK_BENCH:'hallowedworkbench',
  HARPY_WORK_BENCH:'harpyworkbench',
  HONEY_WORK_BENCH:'honeyworkbench',
  JELLYFISH_WORK_BENCH:'jellyfishworkbench',
  LESION_WORK_BENCH:'lesionworkbench',
  LIBRARIAN_WORK_BENCH:'librarianworkbench',
  LIHZAHRD_WORK_BENCH:'lihzahrdworkbench',
  LIVING_WOOD_WORK_BENCH:'livingwoodworkbench',
  MARBLE_WORK_BENCH:'marbleworkbench',
  MARTIAN_WORK_BENCH:'martianworkbench',
  METEORITE_WORK_BENCH:'meteoriteworkbench',
  MUSHROOM_BENCH:'mushroombench',
  MUSHROOM_WORK_BENCH:'mushroomworkbench',
  NEBULA_WORK_BENCH:'nebulaworkbench',
  OBSIDIAN_WORK_BENCH:'obsidianworkbench',
  OFFICE_WORK_BENCH:'officeworkbench',
  PALM_WOOD_BENCH:'palmwoodbench',
  PALM_WOOD_WORK_BENCH:'palmwoodworkbench',
  PEARLWOOD_WORK_BENCH:'pearlwoodworkbench',
  PINE_WORK_BENCH:'pineworkbench',
  PINK_DUNGEON_WORK_BENCH:'pinkdungeonworkbench',
  PUMPKIN_WORK_BENCH:'pumpkinworkbench',
  REEF_WORK_BENCH:'reefworkbench',
  RICH_MAHOGANY_WORK_BENCH:'richmahoganyworkbench',
  SANDSTONE_WORK_BENCH:'sandstoneworkbench',
  SHADEWOOD_WORK_BENCH:'shadewoodworkbench',
  SKYWARE_WORK_BENCH:'skywareworkbench',
  SLIME_WORK_BENCH:'slimeworkbench',
  SNOW_WORK_BENCH:'snowworkbench',
  SOLAR_WORK_BENCH:'solarworkbench',
  SPIDER_WORK_BENCH:'spiderworkbench',
  SPIKE_WORK_BENCH:'spikeworkbench',
  SPOOKY_WORK_BENCH:'spookyworkbench',
  STARDUST_WORK_BENCH:'stardustworkbench',
  STEAMPUNK_WORK_BENCH:'steampunkworkbench',
  STONE_WORK_BENCH:'stoneworkbench',
  VORTEX_WORK_BENCH:'vortexworkbench',
  WORK_BENCH:'workbench',
  AETHERIUM_BOOKCASE:'aetheriumbookcase',
  AQUARIUM_BOOKCASE:'aquariumbookcase',
  ASH_WOOD_BOOKCASE:'ashwoodbookcase',
  BALLOON_BOOKCASE:'balloonbookcase',
  BAMBOO_BOOKCASE:'bamboobookcase',
  BLUE_DUNGEON_BOOKCASE:'bluedungeonbookcase',
  BONE_BOOKCASE:'bonebookcase',
  BOOKCASE:'bookcase',
  BOREAL_WOOD_BOOKCASE:'borealwoodbookcase',
  BOULDER_BOOKCASE:'boulderbookcase',
  CACTUS_BOOKCASE:'cactusbookcase',
  CLOUD_BOOKCASE:'cloudbookcase',
  CRIMTANE_BOOKCASE:'crimtanebookcase',
  CRYSTAL_BOOKCASE:'crystalbookcase',
  DEMONITE_BOOKCASE:'demonitebookcase',
  DUSKWARE_BOOKCASE:'duskwarebookcase',
  DYNASTY_BOOKCASE:'dynastybookcase',
  EASTER_BOOKCASE:'easterbookcase',
  EBONWOOD_BOOKCASE:'ebonwoodbookcase',
  FALLEN_STAR_BOOKCASE:'fallenstarbookcase',
  FEYWOOD_BOOKCASE:'feywoodbookcase',
  FLESH_BOOKCASE:'fleshbookcase',
  FLINX_FUR_BOOKCASE:'flinxfurbookcase',
  FORBIDDEN_BOOKCASE:'forbiddenbookcase',
  FROZEN_BOOKCASE:'frozenbookcase',
  GLASS_BOOKCASE:'glassbookcase',
  GOLDEN_BOOKCASE:'goldenbookcase',
  GOTHIC_BOOKCASE:'gothicbookcase',
  GRANITE_BOOKCASE:'granitebookcase',
  GREEN_DUNGEON_BOOKCASE:'greendungeonbookcase',
  HALLOWED_BOOKCASE:'hallowedbookcase',
  HARPY_BOOKCASE:'harpybookcase',
  HONEY_BOOKCASE:'honeybookcase',
  JELLYFISH_BOOKCASE:'jellyfishbookcase',
  LESION_BOOKCASE:'lesionbookcase',
  LIBRARIAN_BOOKCASE:'librarianbookcase',
  LIHZAHRD_BOOKCASE:'lihzahrdbookcase',
  LIVING_WOOD_BOOKCASE:'livingwoodbookcase',
  MARBLE_BOOKCASE:'marblebookcase',
  MARTIAN_HOLOBOOKCASE:'martianholobookcase',
  METEORITE_BOOKCASE:'meteoritebookcase',
  MUSHROOM_BOOKCASE:'mushroombookcase',
  NEBULA_BOOKCASE:'nebulabookcase',
  OBSIDIAN_BOOKCASE:'obsidianbookcase',
  OFFICE_BOOKCASE:'officebookcase',
  PALM_WOOD_BOOKCASE:'palmwoodbookcase',
  PEARLWOOD_BOOKCASE:'pearlwoodbookcase',
  PINE_BOOKCASE:'pinebookcase',
  PINK_DUNGEON_BOOKCASE:'pinkdungeonbookcase',
  PUMPKIN_BOOKCASE:'pumpkinbookcase',
  REEF_BOOKCASE:'reefbookcase',
  RICH_MAHOGANY_BOOKCASE:'richmahoganybookcase',
  SANDSTONE_BOOKCASE:'sandstonebookcase',
  SHADEWOOD_BOOKCASE:'shadewoodbookcase',
  SKYWARE_BOOKCASE:'skywarebookcase',
  SLIME_BOOKCASE:'slimebookcase',
  SNOW_BOOKCASE:'snowbookcase',
  SOLAR_BOOKCASE:'solarbookcase',
  SPIDER_BOOKCASE:'spiderbookcase',
  SPIKE_BOOKCASE:'spikebookcase',
  SPOOKY_BOOKCASE:'spookybookcase',
  STARDUST_BOOKCASE:'stardustbookcase',
  STEAMPUNK_BOOKCASE:'steampunkbookcase',
  STONE_BOOKCASE:'stonebookcase',
  VORTEX_BOOKCASE:'vortexbookcase',
  AETHERIUM_CANDELABRA:'aetheriumcandelabra',
  AQUARIUM_CANDELABRA:'aquariumcandelabra',
  ASH_WOOD_CANDELABRA:'ashwoodcandelabra',
  BALLOON_CANDELABRA:'ballooncandelabra',
  BAMBOO_CANDELABRA:'bamboocandelabra',
  BLUE_DUNGEON_CANDELABRA:'bluedungeoncandelabra',
  BONE_CANDELABRA:'bonecandelabra',
  BOREAL_WOOD_CANDELABRA:'borealwoodcandelabra',
  BOULDER_CANDELABRA:'bouldercandelabra',
  CACTUS_CANDELABRA:'cactuscandelabra',
  CANDELABRA:'candelabra',
  CLOUD_CANDELABRA:'cloudcandelabra',
  CRIMTANE_CANDELABRA:'crimtanecandelabra',
  CRYSTAL_CANDELABRA:'crystalcandelabra',
  DEMONITE_CANDELABRA:'demonitecandelabra',
  DUSKWARE_CANDELABRA:'duskwarecandelabra',
  EASTER_CANDELABRA:'eastercandelabra',
  EBONWOOD_CANDELABRA:'ebonwoodcandelabra',
  FALLEN_STAR_CANDELABRA:'fallenstarcandelabra',
  FEYWOOD_CANDELABRA:'feywoodcandelabra',
  FLESH_CANDELABRA:'fleshcandelabra',
  FLINX_FUR_CANDELABRA:'flinxfurcandelabra',
  FORBIDDEN_CANDELABRA:'forbiddencandelabra',
  FROZEN_CANDELABRA:'frozencandelabra',
  GLASS_CANDELABRA:'glasscandelabra',
  GOLDEN_CANDELABRA:'goldencandelabra',
  GOTHIC_CANDELABRA:'gothiccandelabra',
  GRANITE_CANDELABRA:'granitecandelabra',
  GREEN_DUNGEON_CANDELABRA:'greendungeoncandelabra',
  HALLOWED_CANDELABRA:'hallowedcandelabra',
  HARPY_CANDELABRA:'harpycandelabra',
  HONEY_CANDELABRA:'honeycandelabra',
  JELLYFISH_CANDELABRA:'jellyfishcandelabra',
  LESION_CANDELABRA:'lesioncandelabra',
  LIBRARIAN_CANDELABRA:'librariancandelabra',
  LIHZAHRD_CANDELABRA:'lihzahrdcandelabra',
  LIVING_WOOD_CANDELABRA:'livingwoodcandelabra',
  MARBLE_CANDELABRA:'marblecandelabra',
  METEORITE_CANDELABRA:'meteoritecandelabra',
  MUSHROOM_CANDELABRA:'mushroomcandelabra',
  NEBULA_CANDELABRA:'nebulacandelabra',
  OBSIDIAN_CANDELABRA:'obsidiancandelabra',
  OFFICE_CANDELABRA:'officecandelabra',
  PALM_WOOD_CANDELABRA:'palmwoodcandelabra',
  PEARLWOOD_CANDELABRA:'pearlwoodcandelabra',
  PINE_CANDELABRA:'pinecandelabra',
  PINK_DUNGEON_CANDELABRA:'pinkdungeoncandelabra',
  PLATINUM_CANDELABRA:'platinumcandelabra',
  PUMPKIN_CANDELABRA:'pumpkincandelabra',
  REEF_CANDELABRA:'reefcandelabra',
  RICH_MAHOGANY_CANDELABRA:'richmahoganycandelabra',
  SANDSTONE_CANDELABRA:'sandstonecandelabra',
  SHADEWOOD_CANDELABRA:'shadewoodcandelabra',
  SKYWARE_CANDELABRA:'skywarecandelabra',
  SLIME_CANDELABRA:'slimecandelabra',
  SNOW_CANDELABRA:'snowcandelabra',
  SOLAR_CANDELABRA:'solarcandelabra',
  SPIDER_CANDELABRA:'spidercandelabra',
  SPIKE_CANDELABRA:'spikecandelabra',
  SPOOKY_CANDELABRA:'spookycandelabra',
  STARDUST_CANDELABRA:'stardustcandelabra',
  STEAMPUNK_CANDELABRA:'steampunkcandelabra',
  STONE_CANDELABRA:'stonecandelabra',
  VORTEX_CANDELABRA:'vortexcandelabra',
  AETHERIUM_CANDLE:'aetheriumcandle',
  AQUARIUM_CANDLE:'aquariumcandle',
  ASH_WOOD_CANDLE:'ashwoodcandle',
  BALLOON_CANDLE:'ballooncandle',
  BAMBOO_CANDLE:'bamboocandle',
  BLUE_DUNGEON_CANDLE:'bluedungeoncandle',
  BOREAL_WOOD_CANDLE:'borealwoodcandle',
  BOULDER_CANDLE:'bouldercandle',
  CACTUS_CANDLE:'cactuscandle',
  CANDLE:'candle',
  CLOUD_CANDLE:'cloudcandle',
  CRIMTANE_CANDLE:'crimtanecandle',
  CRYSTAL_CANDLE:'crystalcandle',
  DEMONITE_CANDLE:'demonitecandle',
  DUSKWARE_CANDLE:'duskwarecandle',
  DYNASTY_CANDLE:'dynastycandle',
  EASTER_CANDLE:'eastercandle',
  EBONWOOD_CANDLE:'ebonwoodcandle',
  FALLEN_STAR_CANDLE:'fallenstarcandle',
  FEYWOOD_CANDLE:'feywoodcandle',
  FLESH_CANDLE:'fleshcandle',
  FLINX_FUR_CANDLE:'flinxfurcandle',
  FORBIDDEN_CANDLE:'forbiddencandle',
  FROZEN_CANDLE:'frozencandle',
  GLASS_CANDLE:'glasscandle',
  GOLDEN_CANDLE:'goldencandle',
  GOTHIC_CANDLE:'gothiccandle',
  GRANITE_CANDLE:'granitecandle',
  GREEN_DUNGEON_CANDLE:'greendungeoncandle',
  HALLOWED_CANDLE:'hallowedcandle',
  HARPY_CANDLE:'harpycandle',
  HONEY_CANDLE:'honeycandle',
  JELLYFISH_CANDLE:'jellyfishcandle',
  LARGE_DYNASTY_CANDLE:'largedynastycandle',
  LESION_CANDLE:'lesioncandle',
  LIBRARIAN_CANDLE:'librariancandle',
  LIHZAHRD_CANDLE:'lihzahrdcandle',
  LIVING_WOOD_CANDLE:'livingwoodcandle',
  MARBLE_CANDLE:'marblecandle',
  MARTIAN_HOVER_CANDLE:'martianhovercandle',
  METEORITE_CANDLE:'meteoritecandle',
  MUSHROOM_CANDLE:'mushroomcandle',
  NEBULA_CANDLE:'nebulacandle',
  OBSIDIAN_CANDLE:'obsidiancandle',
  OFFICE_CANDLE:'officecandle',
  PALM_WOOD_CANDLE:'palmwoodcandle',
  PEACE_CANDLE:'peacecandle',
  PEARLWOOD_CANDLE:'pearlwoodcandle',
  PINE_CANDLE:'pinecandle',
  PINK_DUNGEON_CANDLE:'pinkdungeoncandle',
  PLATINUM_CANDLE:'platinumcandle',
  PUMPKIN_CANDLE:'pumpkincandle',
  REEF_CANDLE:'reefcandle',
  RICH_MAHOGANY_CANDLE:'richmahoganycandle',
  SANDSTONE_CANDLE:'sandstonecandle',
  SHADEWOOD_CANDLE:'shadewoodcandle',
  SKYWARE_CANDLE:'skywarecandle',
  SLIME_CANDLE:'slimecandle',
  SNOW_CANDLE:'snowcandle',
  SOLAR_CANDLE:'solarcandle',
  SPIDER_CANDLE:'spidercandle',
  SPIKE_CANDLE:'spikecandle',
  SPOOKY_CANDLE:'spookycandle',
  STARDUST_CANDLE:'stardustcandle',
  STEAMPUNK_CANDLE:'steampunkcandle',
  STONE_CANDLE:'stonecandle',
  VORTEX_CANDLE:'vortexcandle',
  WATER_CANDLE:'watercandle',
  AETHERIUM_CHAIR:'aetheriumchair',
  AQUARIUM_CHAIR:'aquariumchair',
  ASH_WOOD_CHAIR:'ashwoodchair',
  BALLOON_CHAIR:'balloonchair',
  BAMBOO_CHAIR:'bamboochair',
  BLUE_DUNGEON_CHAIR:'bluedungeonchair',
  BONE_CHAIR:'bonechair',
  BOREAL_WOOD_CHAIR:'borealwoodchair',
  BOULDER_CHAIR:'boulderchair',
  CACTUS_CHAIR:'cactuschair',
  CLOUD_CHAIR:'cloudchair',
  CRIMTANE_CHAIR:'crimtanechair',
  CRYSTAL_CHAIR:'crystalchair',
  DEMONITE_CHAIR:'demonitechair',
  DUSKWARE_CHAIR:'duskwarechair',
  DYNASTY_CHAIR:'dynastychair',
  EASTER_CHAIR:'easterchair',
  EBONWOOD_CHAIR:'ebonwoodchair',
  FALLEN_STAR_CHAIR:'fallenstarchair',
  FEYWOOD_CHAIR:'feywoodchair',
  FLESH_CHAIR:'fleshchair',
  FLINX_FUR_CHAIR:'flinxfurchair',
  FORBIDDEN_CHAIR:'forbiddenchair',
  FROZEN_CHAIR:'frozenchair',
  GLASS_CHAIR:'glasschair',
  GOLDEN_CHAIR:'goldenchair',
  GOTHIC_CHAIR:'gothicchair',
  GRANITE_CHAIR:'granitechair',
  GREEN_DUNGEON_CHAIR:'greendungeonchair',
  HALLOWED_CHAIR:'hallowedchair',
  HARPY_CHAIR:'harpychair',
  HONEY_CHAIR:'honeychair',
  JELLYFISH_CHAIR:'jellyfishchair',
  LESION_CHAIR:'lesionchair',
  LIBRARIAN_CHAIR:'librarianchair',
  LIHZAHRD_CHAIR:'lihzahrdchair',
  LIVING_WOOD_CHAIR:'livingwoodchair',
  MARBLE_CHAIR:'marblechair',
  MARTIAN_HOVER_CHAIR:'martianhoverchair',
  METEORITE_CHAIR:'meteoritechair',
  MUSHROOM_CHAIR:'mushroomchair',
  NEBULA_CHAIR:'nebulachair',
  OBSIDIAN_CHAIR:'obsidianchair',
  OFFICE_CHAIR:'officechair',
  PALM_WOOD_CHAIR:'palmwoodchair',
  PEARLWOOD_CHAIR:'pearlwoodchair',
  PINE_CHAIR:'pinechair',
  PINK_DUNGEON_CHAIR:'pinkdungeonchair',
  PUMPKIN_CHAIR:'pumpkinchair',
  REEF_CHAIR:'reefchair',
  RICH_MAHOGANY_CHAIR:'richmahoganychair',
  SANDSTONE_CHAIR:'sandstonechair',
  SHADEWOOD_CHAIR:'shadewoodchair',
  SKYWARE_CHAIR:'skywarechair',
  SLIME_CHAIR:'slimechair',
  SNOW_CHAIR:'snowchair',
  SOLAR_CHAIR:'solarchair',
  SPIDER_CHAIR:'spiderchair',
  SPIKE_CHAIR:'spikechair',
  SPOOKY_CHAIR:'spookychair',
  STARDUST_CHAIR:'stardustchair',
  STEAMPUNK_CHAIR:'steampunkchair',
  STONE_CHAIR:'stonechair',
  VORTEX_CHAIR:'vortexchair',
  AETHERIUM_CHANDELIER:'aetheriumchandelier',
  AQUARIUM_CHANDELIER:'aquariumchandelier',
  ASH_WOOD_CHANDELIER:'ashwoodchandelier',
  BALLOON_CHANDELIER:'balloonchandelier',
  BAMBOO_CHANDELIER:'bamboochandelier',
  BLUE_DUNGEON_CHANDELIER:'bluedungeonchandelier',
  BONE_CHANDELIER:'bonechandelier',
  BOREAL_WOOD_CHANDELIER:'borealwoodchandelier',
  BOULDER_CHANDELIER:'boulderchandelier',
  CACTUS_CHANDELIER:'cactuschandelier',
  CLOUD_CHANDELIER:'cloudchandelier',
  COPPER_CHANDELIER:'copperchandelier',
  CRIMTANE_CHANDELIER:'crimtanechandelier',
  CRYSTAL_CHANDELIER:'crystalchandelier',
  DEMONITE_CHANDELIER:'demonitechandelier',
  DUSKWARE_CHANDELIER:'duskwarechandelier',
  EASTER_CHANDELIER:'easterchandelier',
  EBONWOOD_CHANDELIER:'ebonwoodchandelier',
  FALLEN_STAR_CHANDELIER:'fallenstarchandelier',
  FEYWOOD_CHANDELIER:'feywoodchandelier',
  FLESH_CHANDELIER:'fleshchandelier',
  FLINX_FUR_CHANDELIER:'flinxfurchandelier',
  FORBIDDEN_CHANDELIER:'forbiddenchandelier',
  FROZEN_CHANDELIER:'frozenchandelier',
  GLASS_CHANDELIER:'glasschandelier',
  GOLD_CHANDELIER:'goldchandelier',
  GOLDEN_CHANDELIER:'goldenchandelier',
  GOTHIC_CHANDELIER:'gothicchandelier',
  GRANITE_CHANDELIER:'granitechandelier',
  GREEN_DUNGEON_CHANDELIER:'greendungeonchandelier',
  HALLOWED_CHANDELIER:'hallowedchandelier',
  HARPY_CHANDELIER:'harpychandelier',
  HONEY_CHANDELIER:'honeychandelier',
  JELLYFISH_CHANDELIER:'jellyfishchandelier',
  LESION_CHANDELIER:'lesionchandelier',
  LIBRARIAN_CHANDELIER:'librarianchandelier',
  LIHZAHRD_CHANDELIER:'lihzahrdchandelier',
  LIVING_WOOD_CHANDELIER:'livingwoodchandelier',
  MARBLE_CHANDELIER:'marblechandelier',
  MARTIAN_CHANDELIER:'martianchandelier',
  METEORITE_CHANDELIER:'meteoritechandelier',
  MUSHROOM_CHANDELIER:'mushroomchandelier',
  NEBULA_CHANDELIER:'nebulachandelier',
  OBSIDIAN_CHANDELIER:'obsidianchandelier',
  OFFICE_CHANDELIER:'officechandelier',
  PALM_WOOD_CHANDELIER:'palmwoodchandelier',
  PEARLWOOD_CHANDELIER:'pearlwoodchandelier',
  PINE_CHANDELIER:'pinechandelier',
  PINK_DUNGEON_CHANDELIER:'pinkdungeonchandelier',
  PLATINUM_CHANDELIER:'platinumchandelier',
  PUMPKIN_CHANDELIER:'pumpkinchandelier',
  REEF_CHANDELIER:'reefchandelier',
  RICH_MAHOGANY_CHANDELIER:'richmahoganychandelier',
  SANDSTONE_CHANDELIER:'sandstonechandelier',
  SHADEWOOD_CHANDELIER:'shadewoodchandelier',
  SILVER_CHANDELIER:'silverchandelier',
  SKYWARE_CHANDELIER:'skywarechandelier',
  SLIME_CHANDELIER:'slimechandelier',
  SNOW_CHANDELIER:'snowchandelier',
  SOLAR_CHANDELIER:'solarchandelier',
  SPIDER_CHANDELIER:'spiderchandelier',
  SPIKE_CHANDELIER:'spikechandelier',
  SPOOKY_CHANDELIER:'spookychandelier',
  STARDUST_CHANDELIER:'stardustchandelier',
  STEAMPUNK_CHANDELIER:'steampunkchandelier',
  STONE_CHANDELIER:'stonechandelier',
  TIN_CHANDELIER:'tinchandelier',
  TUNGSTEN_CHANDELIER:'tungstenchandelier',
  VORTEX_CHANDELIER:'vortexchandelier',
  AETHERIUM_CHEST:'aetheriumchest',
  ASH_WOOD_CHEST:'ashwoodchest',
  BALLOON_CHEST:'balloonchest',
  BAMBOO_CHEST:'bamboochest',
  BLUE_DUNGEON_CHEST:'bluedungeonchest',
  BONE_CHEST:'bonechest',
  BOREAL_WOOD_CHEST:'borealwoodchest',
  BOULDER_CHEST:'boulderchest',
  CACTUS_CHEST:'cactuschest',
  CHEST_STATUE:'cheststatue',
  CLOUD_CHEST:'cloudchest',
  CORRUPTION_CHEST:'corruptionchest',
  CRIMSON_CHEST:'crimsonchest',
  CRIMTANE_CHEST:'crimtanechest',
  CRYSTAL_CHEST:'crystalchest',
  DEAD_MANS_CHEST:'deadmanschest',
  DEMONITE_CHEST:'demonitechest',
  DESERT_CHEST:'desertchest',
  DUSKWARE_CHEST:'duskwarechest',
  DYNASTY_CHEST:'dynastychest',
  EASTER_CHEST:'easterchest',
  EBONWOOD_CHEST:'ebonwoodchest',
  FALLEN_STAR_CHEST:'fallenstarchest',
  FANCY_HALLOWED_CHEST:'fancyhallowedchest',
  FEYWOOD_CHEST:'feywoodchest',
  FLESH_CHEST:'fleshchest',
  FLINX_FUR_CHEST:'flinxfurchest',
  FORBIDDEN_CHEST:'forbiddenchest',
  FROZEN_CHEST:'frozenchest',
  GLASS_CHEST:'glasschest',
  GOLD_CHEST:'goldchest',
  GOLDEN_CHEST:'goldenchest',
  GOLF_CHEST:'golfchest',
  GOTHIC_CHEST:'gothicchest',
  GRANITE_CHEST:'granitechest',
  GREEN_DUNGEON_CHEST:'greendungeonchest',
  HALLOWED_CHEST:'hallowedchest',
  HARPY_CHEST:'harpychest',
  HONEY_CHEST:'honeychest',
  ICE_CHEST:'icechest',
  IVY_CHEST:'ivychest',
  JELLYFISH_CHEST:'jellyfishchest',
  JUNGLE_CHEST:'junglechest',
  LESION_CHEST:'lesionchest',
  LIBRARIAN_CHEST:'librarianchest',
  LIHZAHRD_CHEST:'lihzahrdchest',
  LIVING_WOOD_CHEST:'livingwoodchest',
  MARBLE_CHEST:'marblechest',
  MARTIAN_CHEST:'martianchest',
  METEORITE_CHEST:'meteoritechest',
  MUSHROOM_CHEST:'mushroomchest',
  NEBULA_CHEST:'nebulachest',
  OBSIDIAN_CHEST:'obsidianchest',
  OFFICE_CHEST:'officechest',
  PALM_WOOD_CHEST:'palmwoodchest',
  PEARLWOOD_CHEST:'pearlwoodchest',
  PINE_CHEST:'pinechest',
  PINK_DUNGEON_CHEST:'pinkdungeonchest',
  PUMPKIN_CHEST:'pumpkinchest',
  REEF_CHEST:'reefchest',
  RICH_MAHOGANY_CHEST:'richmahoganychest',
  SANDSTONE_CHEST:'sandstonechest',
  SHADEWOOD_CHEST:'shadewoodchest',
  SHADOW_CHEST:'shadowchest',
  SKYWARE_CHEST:'skywarechest',
  SLIME_CHEST:'slimechest',
  SNOW_CHEST:'snowchest',
  SOLAR_CHEST:'solarchest',
  SPIDER_CHEST:'spiderchest',
  SPIKE_CHEST:'spikechest',
  SPOOKY_CHEST:'spookychest',
  STARDUST_CHEST:'stardustchest',
  STEAMPUNK_CHEST:'steampunkchest',
  STONE_CHEST:'stonechest',
  TRAPPED_AETHERIUM_CHEST:'trappedaetheriumchest',
  TRAPPED_ASH_WOOD_CHEST:'trappedashwoodchest',
  TRAPPED_BALLOON_CHEST:'trappedballoonchest',
  TRAPPED_BAMBOO_CHEST:'trappedbamboochest',
  TRAPPED_BLUE_DUNGEON_CHEST:'trappedbluedungeonchest',
  TRAPPED_BONE_CHEST:'trappedbonechest',
  TRAPPED_BOREAL_WOOD_CHEST:'trappedborealwoodchest',
  TRAPPED_BOULDER_CHEST:'trappedboulderchest',
  TRAPPED_CACTUS_CHEST:'trappedcactuschest',
  TRAPPED_CHEST:'trappedchest',
  TRAPPED_CLOUD_CHEST:'trappedcloudchest',
  TRAPPED_CORRUPTION_CHEST:'trappedcorruptionchest',
  TRAPPED_CRIMSON_CHEST:'trappedcrimsonchest',
  TRAPPED_CRIMTANE_CHEST:'trappedcrimtanechest',
  TRAPPED_CRYSTAL_CHEST:'trappedcrystalchest',
  TRAPPED_DEMONITE_CHEST:'trappeddemonitechest',
  TRAPPED_DESERT_CHEST:'trappeddesertchest',
  TRAPPED_DUSKWARE_CHEST:'trappedduskwarechest',
  TRAPPED_DYNASTY_CHEST:'trappeddynastychest',
  TRAPPED_EASTER_CHEST:'trappedeasterchest',
  TRAPPED_EBONWOOD_CHEST:'trappedebonwoodchest',
  TRAPPED_FALLEN_STAR_CHEST:'trappedfallenstarchest',
  TRAPPED_FANCY_HALLOWED_CHEST:'trappedfancyhallowedchest',
  TRAPPED_FEYWOOD_CHEST:'trappedfeywoodchest',
  TRAPPED_FLESH_CHEST:'trappedfleshchest',
  TRAPPED_FLINX_FUR_CHEST:'trappedflinxfurchest',
  TRAPPED_FORBIDDEN_CHEST:'trappedforbiddenchest',
  TRAPPED_FROZEN_CHEST:'trappedfrozenchest',
  TRAPPED_GLASS_CHEST:'trappedglasschest',
  TRAPPED_GOLD_CHEST:'trappedgoldchest',
  TRAPPED_GOLDEN_CHEST:'trappedgoldenchest',
  TRAPPED_GOLF_CHEST:'trappedgolfchest',
  TRAPPED_GOTHIC_CHEST:'trappedgothicchest',
  TRAPPED_GRANITE_CHEST:'trappedgranitechest',
  TRAPPED_GREEN_DUNGEON_CHEST:'trappedgreendungeonchest',
  TRAPPED_HALLOWED_CHEST:'trappedhallowedchest',
  TRAPPED_HARPY_CHEST:'trappedharpychest',
  TRAPPED_HONEY_CHEST:'trappedhoneychest',
  TRAPPED_ICE_CHEST:'trappedicechest',
  TRAPPED_IVY_CHEST:'trappedivychest',
  TRAPPED_JELLYFISH_CHEST:'trappedjellyfishchest',
  TRAPPED_JUNGLE_CHEST:'trappedjunglechest',
  TRAPPED_LESION_CHEST:'trappedlesionchest',
  TRAPPED_LIBRARIAN_CHEST:'trappedlibrarianchest',
  TRAPPED_LIHZAHRD_CHEST:'trappedlihzahrdchest',
  TRAPPED_LIVING_WOOD_CHEST:'trappedlivingwoodchest',
  TRAPPED_MARBLE_CHEST:'trappedmarblechest',
  TRAPPED_MARTIAN_CHEST:'trappedmartianchest',
  TRAPPED_METEORITE_CHEST:'trappedmeteoritechest',
  TRAPPED_MUSHROOM_CHEST:'trappedmushroomchest',
  TRAPPED_NEBULA_CHEST:'trappednebulachest',
  TRAPPED_OBSIDIAN_CHEST:'trappedobsidianchest',
  TRAPPED_OFFICE_CHEST:'trappedofficechest',
  TRAPPED_PALM_WOOD_CHEST:'trappedpalmwoodchest',
  TRAPPED_PEARLWOOD_CHEST:'trappedpearlwoodchest',
  TRAPPED_PINE_CHEST:'trappedpinechest',
  TRAPPED_PINK_DUNGEON_CHEST:'trappedpinkdungeonchest',
  TRAPPED_PUMPKIN_CHEST:'trappedpumpkinchest',
  TRAPPED_REEF_CHEST:'trappedreefchest',
  TRAPPED_RICH_MAHOGANY_CHEST:'trappedrichmahoganychest',
  TRAPPED_SANDSTONE_CHEST:'trappedsandstonechest',
  TRAPPED_SHADEWOOD_CHEST:'trappedshadewoodchest',
  TRAPPED_SHADOW_CHEST:'trappedshadowchest',
  TRAPPED_SKYWARE_CHEST:'trappedskywarechest',
  TRAPPED_SLIME_CHEST:'trappedslimechest',
  TRAPPED_SNOW_CHEST:'trappedsnowchest',
  TRAPPED_SOLAR_CHEST:'trappedsolarchest',
  TRAPPED_SPIDER_CHEST:'trappedspiderchest',
  TRAPPED_SPIKE_CHEST:'trappedspikechest',
  TRAPPED_SPOOKY_CHEST:'trappedspookychest',
  TRAPPED_STARDUST_CHEST:'trappedstardustchest',
  TRAPPED_STEAMPUNK_CHEST:'trappedsteampunkchest',
  TRAPPED_STONE_CHEST:'trappedstonechest',
  TRAPPED_VORTEX_CHEST:'trappedvortexchest',
  TRAPPED_WATER_CHEST:'trappedwaterchest',
  TRAPPED_WEB_COVERED_CHEST:'trappedwebcoveredchest',
  VORTEX_CHEST:'vortexchest',
  WATER_CHEST:'waterchest',
  WEB_COVERED_CHEST:'webcoveredchest',
  AETHERIUM_CLOCK:'aetheriumclock',
  AQUARIUM_CLOCK:'aquariumclock',
  ASH_WOOD_CLOCK:'ashwoodclock',
  BALLOON_CLOCK:'balloonclock',
  BAMBOO_CLOCK:'bambooclock',
  BLUE_DUNGEON_CLOCK:'bluedungeonclock',
  BONE_CLOCK:'boneclock',
  BOREAL_WOOD_CLOCK:'borealwoodclock',
  BOULDER_CLOCK:'boulderclock',
  CACTUS_CLOCK:'cactusclock',
  CLOUD_CLOCK:'cloudclock',
  CONVEYOR_BELT_CLOCKWISE:'conveyorbeltclockwise',
  CONVEYOR_BELT_COUNTER_CLOCKWISE:'conveyorbeltcounterclockwise',
  CRIMTANE_CLOCK:'crimtaneclock',
  CRYSTAL_CLOCK:'crystalclock',
  DEMONITE_CLOCK:'demoniteclock',
  DUSKWARE_CLOCK:'duskwareclock',
  DYNASTY_CLOCK:'dynastyclock',
  EASTER_CLOCK:'easterclock',
  EBONWOOD_CLOCK:'ebonwoodclock',
  FALLEN_STAR_CLOCK:'fallenstarclock',
  FEYWOOD_CLOCK:'feywoodclock',
  FLESH_CLOCK:'fleshclock',
  FLINX_FUR_CLOCK:'flinxfurclock',
  FORBIDDEN_CLOCK:'forbiddenclock',
  FROZEN_CLOCK:'frozenclock',
  GLASS_CLOCK:'glassclock',
  GOLDEN_CLOCK:'goldenclock',
  GOTHIC_CLOCK:'gothicclock',
  GRANDFATHER_CLOCK:'grandfatherclock',
  GRANITE_CLOCK:'graniteclock',
  GREEN_DUNGEON_CLOCK:'greendungeonclock',
  HALLOWED_CLOCK:'hallowedclock',
  HARPY_CLOCK:'harpyclock',
  HONEY_CLOCK:'honeyclock',
  JELLYFISH_CLOCK:'jellyfishclock',
  LESION_CLOCK:'lesionclock',
  LIBRARIAN_CLOCK:'librarianclock',
  LIHZAHRD_CLOCK:'lihzahrdclock',
  LIVING_WOOD_CLOCK:'livingwoodclock',
  MARBLE_CLOCK:'marbleclock',
  MARTIAN_ASTRO_CLOCK:'martianastroclock',
  METEORITE_CLOCK:'meteoriteclock',
  MUSHROOM_CLOCK:'mushroomclock',
  NEBULA_CLOCK:'nebulaclock',
  OBSIDIAN_CLOCK:'obsidianclock',
  OFFICE_CLOCK:'officeclock',
  PALM_WOOD_CLOCK:'palmwoodclock',
  PEARLWOOD_CLOCK:'pearlwoodclock',
  PINE_CLOCK:'pineclock',
  PINK_DUNGEON_CLOCK:'pinkdungeonclock',
  PUMPKIN_CLOCK:'pumpkinclock',
  REEF_CLOCK:'reefclock',
  RICH_MAHOGANY_CLOCK:'richmahoganyclock',
  SANDSTONE_CLOCK:'sandstoneclock',
  SHADEWOOD_CLOCK:'shadewoodclock',
  SKYWARE_CLOCK:'skywareclock',
  SLIME_CLOCK:'slimeclock',
  SNOW_CLOCK:'snowclock',
  SOLAR_CLOCK:'solarclock',
  SPIDER_CLOCK:'spiderclock',
  SPIKE_CLOCK:'spikeclock',
  SPOOKY_CLOCK:'spookyclock',
  STARDUST_CLOCK:'stardustclock',
  STEAMPUNK_CLOCK:'steampunkclock',
  STONE_CLOCK:'stoneclock',
  SUNPLATE_CLOCK:'sunplateclock',
  VORTEX_CLOCK:'vortexclock',
  AETHERIUM_DOOR:'aetheriumdoor',
  AQUARIUM_DOOR:'aquariumdoor',
  ASH_WOOD_DOOR:'ashwooddoor',
  BALLOON_DOOR:'balloondoor',
  BAMBOO_DOOR:'bamboodoor',
  BLUE_DUNGEON_DOOR:'bluedungeondoor',
  BONE_DOOR:'bonedoor',
  BOREAL_WOOD_DOOR:'borealwooddoor',
  BOULDER_DOOR:'boulderdoor',
  CACTUS_DOOR:'cactusdoor',
  CLOUD_DOOR:'clouddoor',
  CRIMTANE_DOOR:'crimtanedoor',
  CRYSTAL_DOOR:'crystaldoor',
  DEMONITE_DOOR:'demonitedoor',
  DUNGEON_DOOR:'dungeondoor',
  DUSKWARE_DOOR:'duskwaredoor',
  DYNASTY_DOOR:'dynastydoor',
  EASTER_DOOR:'easterdoor',
  EBONWOOD_DOOR:'ebonwooddoor',
  FALLEN_STAR_DOOR:'fallenstardoor',
  FEYWOOD_DOOR:'feywooddoor',
  FLESH_DOOR:'fleshdoor',
  FLINX_FUR_DOOR:'flinxfurdoor',
  FORBIDDEN_DOOR:'forbiddendoor',
  FROZEN_DOOR:'frozendoor',
  GLASS_DOOR:'glassdoor',
  GOLDEN_DOOR:'goldendoor',
  GOTHIC_DOOR:'gothicdoor',
  GRANITE_DOOR:'granitedoor',
  GREEN_DUNGEON_DOOR:'greendungeondoor',
  HALLOWED_DOOR:'halloweddoor',
  HARPY_DOOR:'harpydoor',
  HONEY_DOOR:'honeydoor',
  IRON_DOOR:'irondoor',
  JELLYFISH_DOOR:'jellyfishdoor',
  LEAD_DOOR:'leaddoor',
  LESION_DOOR:'lesiondoor',
  LIBRARIAN_DOOR:'librariandoor',
  LIHZAHRD_DOOR:'lihzahrddoor',
  LIVING_WOOD_DOOR:'livingwooddoor',
  MARBLE_DOOR:'marbledoor',
  MARTIAN_DOOR:'martiandoor',
  METEORITE_DOOR:'meteoritedoor',
  MUSHROOM_DOOR:'mushroomdoor',
  NEBULA_DOOR:'nebuladoor',
  OBSIDIAN_DOOR:'obsidiandoor',
  OFFICE_DOOR:'officedoor',
  PALM_WOOD_DOOR:'palmwooddoor',
  PEARLWOOD_DOOR:'pearlwooddoor',
  PINE_DOOR:'pinedoor',
  PINK_DUNGEON_DOOR:'pinkdungeondoor',
  PUMPKIN_DOOR:'pumpkindoor',
  REEF_DOOR:'reefdoor',
  RICH_MAHOGANY_DOOR:'richmahoganydoor',
  SANDSTONE_DOOR:'sandstonedoor',
  SHADEWOOD_DOOR:'shadewooddoor',
  SKYWARE_DOOR:'skywaredoor',
  SLIME_DOOR:'slimedoor',
  SNOW_DOOR:'snowdoor',
  SOLAR_DOOR:'solardoor',
  SPIDER_DOOR:'spiderdoor',
  SPIKE_DOOR:'spikedoor',
  SPOOKY_DOOR:'spookydoor',
  STARDUST_DOOR:'stardustdoor',
  STEAMPUNK_DOOR:'steampunkdoor',
  STONE_DOOR:'stonedoor',
  TRAP_DOOR:'trapdoor',
  VORTEX_DOOR:'vortexdoor',
  AETHERIUM_DRESSER:'aetheriumdresser',
  AQUARIUM_DRESSER:'aquariumdresser',
  ASH_WOOD_DRESSER:'ashwooddresser',
  BALLOON_DRESSER:'balloondresser',
  BAMBOO_DRESSER:'bamboodresser',
  BLUE_DUNGEON_DRESSER:'bluedungeondresser',
  BONE_DRESSER:'bonedresser',
  BOREAL_WOOD_DRESSER:'borealwooddresser',
  BOULDER_DRESSER:'boulderdresser',
  CACTUS_DRESSER:'cactusdresser',
  CLOUD_DRESSER:'clouddresser',
  CRIMTANE_DRESSER:'crimtanedresser',
  CRYSTAL_DRESSER:'crystaldresser',
  DEMONITE_DRESSER:'demonitedresser',
  DRESSER:'dresser',
  DUSKWARE_DRESSER:'duskwaredresser',
  DYNASTY_DRESSER:'dynastydresser',
  EASTER_DRESSER:'easterdresser',
  EBONWOOD_DRESSER:'ebonwooddresser',
  FALLEN_STAR_DRESSER:'fallenstardresser',
  FEYWOOD_DRESSER:'feywooddresser',
  FLESH_DRESSER:'fleshdresser',
  FLINX_FUR_DRESSER:'flinxfurdresser',
  FORBIDDEN_DRESSER:'forbiddendresser',
  FROZEN_DRESSER:'frozendresser',
  GLASS_DRESSER:'glassdresser',
  GOLDEN_DRESSER:'goldendresser',
  GOTHIC_DRESSER:'gothicdresser',
  GRANITE_DRESSER:'granitedresser',
  GREEN_DUNGEON_DRESSER:'greendungeondresser',
  HALLOWED_DRESSER:'halloweddresser',
  HARPY_DRESSER:'harpydresser',
  HONEY_DRESSER:'honeydresser',
  JELLYFISH_DRESSER:'jellyfishdresser',
  LESION_DRESSER:'lesiondresser',
  LIBRARIAN_DRESSER:'librariandresser',
  LIHZAHRD_DRESSER:'lihzahrddresser',
  LIVING_WOOD_DRESSER:'livingwooddresser',
  MARBLE_DRESSER:'marbledresser',
  MARTIAN_DRESSER:'martiandresser',
  METEORITE_DRESSER:'meteoritedresser',
  MUSHROOM_DRESSER:'mushroomdresser',
  NEBULA_DRESSER:'nebuladresser',
  OBSIDIAN_DRESSER:'obsidiandresser',
  OFFICE_DRESSER:'officedresser',
  PALM_WOOD_DRESSER:'palmwooddresser',
  PEARLWOOD_DRESSER:'pearlwooddresser',
  PINE_DRESSER:'pinedresser',
  PINK_DUNGEON_DRESSER:'pinkdungeondresser',
  PUMPKIN_DRESSER:'pumpkindresser',
  REEF_DRESSER:'reefdresser',
  RICH_MAHOGANY_DRESSER:'richmahoganydresser',
  SANDSTONE_DRESSER:'sandstonedresser',
  SHADEWOOD_DRESSER:'shadewooddresser',
  SKYWARE_DRESSER:'skywaredresser',
  SLIME_DRESSER:'slimedresser',
  SNOW_DRESSER:'snowdresser',
  SOLAR_DRESSER:'solardresser',
  SPIDER_DRESSER:'spiderdresser',
  SPIKE_DRESSER:'spikedresser',
  SPOOKY_DRESSER:'spookydresser',
  STARDUST_DRESSER:'stardustdresser',
  STEAMPUNK_DRESSER:'steampunkdresser',
  STONE_DRESSER:'stonedresser',
  VORTEX_DRESSER:'vortexdresser',
  FURNACE:'furnace',
  LIHZAHRD_FURNACE:'lihzahrdfurnace',
  AETHERIUM_LAMP:'aetheriumlamp',
  AQUARIUM_LAMP:'aquariumlamp',
  ASH_WOOD_LAMP:'ashwoodlamp',
  BALLOON_LAMP:'balloonlamp',
  BAMBOO_LAMP:'bamboolamp',
  BLUE_DUNGEON_LAMP:'bluedungeonlamp',
  BONE_LAMP:'bonelamp',
  BOREAL_WOOD_LAMP:'borealwoodlamp',
  BOULDER_LAMP:'boulderlamp',
  CACTUS_LAMP:'cactuslamp',
  CLOUD_LAMP:'cloudlamp',
  CRIMTANE_LAMP:'crimtanelamp',
  CRYSTAL_LAMP:'crystallamp',
  DEMONITE_LAMP:'demonitelamp',
  DESERT_SPIRIT_LAMP:'desertspiritlamp',
  DIABOLIST_LAMP:'diabolistlamp',
  DUSKWARE_LAMP:'duskwarelamp',
  DYNASTY_LAMP:'dynastylamp',
  EASTER_LAMP:'easterlamp',
  EBONWOOD_LAMP:'ebonwoodlamp',
  FALLEN_STAR_LAMP:'fallenstarlamp',
  FEYWOOD_LAMP:'feywoodlamp',
  FLESH_LAMP:'fleshlamp',
  FLINX_FUR_LAMP:'flinxfurlamp',
  FORBIDDEN_LAMP:'forbiddenlamp',
  FROZEN_LAMP:'frozenlamp',
  GLASS_LAMP:'glasslamp',
  GOLDEN_LAMP:'goldenlamp',
  GOTHIC_LAMP:'gothiclamp',
  GRANITE_LAMP:'granitelamp',
  GREEN_DUNGEON_LAMP:'greendungeonlamp',
  HALLOWED_LAMP:'hallowedlamp',
  HARPY_LAMP:'harpylamp',
  HONEY_LAMP:'honeylamp',
  JELLYFISH_LAMP:'jellyfishlamp',
  LAMP_POST:'lamppost',
  LAVA_LAMP:'lavalamp',
  LESION_LAMP:'lesionlamp',
  LIBRARIAN_LAMP:'librarianlamp',
  LIHZAHRD_LAMP:'lihzahrdlamp',
  LIVING_WOOD_LAMP:'livingwoodlamp',
  LOGIC_GATE_LAMP_FAULTY:'logicgatelampfaulty',
  LOGIC_GATE_LAMP_OFF:'logicgatelampoff',
  LOGIC_GATE_LAMP_ON:'logicgatelampon',
  MARBLE_LAMP:'marblelamp',
  MARTIAN_LAMPPOST:'martianlamppost',
  METEORITE_LAMP:'meteoritelamp',
  MUSHROOM_LAMP:'mushroomlamp',
  NEBULA_LAMP:'nebulalamp',
  OBSIDIAN_LAMP:'obsidianlamp',
  OFFICE_LAMP:'officelamp',
  PALM_WOOD_LAMP:'palmwoodlamp',
  PEARLWOOD_LAMP:'pearlwoodlamp',
  PINE_LAMP:'pinelamp',
  PINK_DUNGEON_LAMP:'pinkdungeonlamp',
  PLASMA_LAMP:'plasmalamp',
  PUMPKIN_LAMP:'pumpkinlamp',
  REEF_LAMP:'reeflamp',
  RICH_MAHOGANY_LAMP:'richmahoganylamp',
  SANDSTONE_LAMP:'sandstonelamp',
  SHADEWOOD_LAMP:'shadewoodlamp',
  SKYWARE_LAMP:'skywarelamp',
  SLIME_LAMP:'slimelamp',
  SNOW_LAMP:'snowlamp',
  SOLAR_LAMP:'solarlamp',
  SPIDER_LAMP:'spiderlamp',
  SPIKE_LAMP:'spikelamp',
  SPOOKY_LAMP:'spookylamp',
  STARDUST_LAMP:'stardustlamp',
  STEAMPUNK_LAMP:'steampunklamp',
  STONE_LAMP:'stonelamp',
  VORTEX_LAMP:'vortexlamp',
  AETHERIUM_LANTERN:'aetheriumlantern',
  ALCHEMY_LANTERN:'alchemylantern',
  AQUARIUM_LANTERN:'aquariumlantern',
  ASH_WOOD_LANTERN:'ashwoodlantern',
  BALLOON_LANTERN:'balloonlantern',
  BAMBOO_LANTERN:'bamboolantern',
  BONE_LANTERN:'bonelantern',
  BOREAL_WOOD_LANTERN:'borealwoodlantern',
  BOULDER_LANTERN:'boulderlantern',
  BRASS_LANTERN:'brasslantern',
  CACTUS_LANTERN:'cactuslantern',
  CAGED_LANTERN:'cagedlantern',
  CARRIAGE_LANTERN:'carriagelantern',
  CHAIN_LANTERN:'chainlantern',
  CHINESE_LANTERN:'chineselantern',
  CLOUD_LANTERN:'cloudlantern',
  CRIMTANE_LANTERN:'crimtanelantern',
  CRYSTAL_LANTERN:'crystallantern',
  DEMONITE_LANTERN:'demonitelantern',
  DUSKWARE_LANTERN:'duskwarelantern',
  DYNASTY_LANTERN:'dynastylantern',
  EASTER_LANTERN:'easterlantern',
  EBONWOOD_LANTERN:'ebonwoodlantern',
  FALLEN_STAR_LANTERN:'fallenstarlantern',
  FEYWOOD_LANTERN:'feywoodlantern',
  FLESH_LANTERN:'fleshlantern',
  FLINX_FUR_LANTERN:'flinxfurlantern',
  FORBIDDEN_LANTERN:'forbiddenlantern',
  FROZEN_LANTERN:'frozenlantern',
  GLASS_LANTERN:'glasslantern',
  GOLDEN_LANTERN:'goldenlantern',
  GOTHIC_LANTERN:'gothiclantern',
  GRANITE_LANTERN:'granitelantern',
  HALLOWED_LANTERN:'hallowedlantern',
  HANGING_JACK_O_LANTERN:'hangingjackolantern',
  HARPY_LANTERN:'harpylantern',
  HEART_LANTERN:'heartlantern',
  HONEY_LANTERN:'honeylantern',
  JACK_O_LANTERN:'jackolantern',
  JELLYFISH_LANTERN:'jellyfishlantern',
  LARGE_DYNASTY_LANTERN:'largedynastylantern',
  LESION_LANTERN:'lesionlantern',
  LIBRARIAN_LANTERN:'librarianlantern',
  LIHZAHRD_LANTERN:'lihzahrdlantern',
  LIVING_WOOD_LANTERN:'livingwoodlantern',
  MARBLE_LANTERN:'marblelantern',
  MARTIAN_LANTERN:'martianlantern',
  METEORITE_LANTERN:'meteoritelantern',
  MUSHROOM_LANTERN:'mushroomlantern',
  NEBULA_LANTERN:'nebulalantern',
  OBSIDIAN_LANTERN:'obsidianlantern',
  OFFICE_LANTERN:'officelantern',
  PALM_WOOD_LANTERN:'palmwoodlantern',
  PEARLWOOD_LANTERN:'pearlwoodlantern',
  PINE_LANTERN:'pinelantern',
  PUMPKIN_LANTERN:'pumpkinlantern',
  REEF_LANTERN:'reeflantern',
  RICH_MAHOGANY_LANTERN:'richmahoganylantern',
  SANDSTONE_LANTERN:'sandstonelantern',
  SHADEWOOD_LANTERN:'shadewoodlantern',
  SKULL_LANTERN:'skulllantern',
  SKYWARE_LANTERN:'skywarelantern',
  SLIME_LANTERN:'slimelantern',
  SNOW_LANTERN:'snowlantern',
  SOLAR_LANTERN:'solarlantern',
  SPIDER_LANTERN:'spiderlantern',
  SPIKE_LANTERN:'spikelantern',
  SPOOKY_LANTERN:'spookylantern',
  STARDUST_LANTERN:'stardustlantern',
  STEAMPUNK_LANTERN:'steampunklantern',
  STONE_LANTERN:'stonelantern',
  VORTEX_LANTERN:'vortexlantern',
  AETHERIUM_PIANO:'aetheriumpiano',
  AQUARIUM_PIANO:'aquariumpiano',
  ASH_WOOD_PIANO:'ashwoodpiano',
  BALLOON_PIANO:'balloonpiano',
  BAMBOO_PIANO:'bamboopiano',
  BLUE_DUNGEON_PIANO:'bluedungeonpiano',
  BONE_PIANO:'bonepiano',
  BOREAL_WOOD_PIANO:'borealwoodpiano',
  BOULDER_PIANO:'boulderpiano',
  CACTUS_PIANO:'cactuspiano',
  CLOUD_PIANO:'cloudpiano',
  CRIMTANE_PIANO:'crimtanepiano',
  CRYSTAL_PIANO:'crystalpiano',
  DEMONITE_PIANO:'demonitepiano',
  DUSKWARE_PIANO:'duskwarepiano',
  DYNASTY_PIANO:'dynastypiano',
  EASTER_PIANO:'easterpiano',
  EBONWOOD_PIANO:'ebonwoodpiano',
  FALLEN_STAR_PIANO:'fallenstarpiano',
  FEYWOOD_PIANO:'feywoodpiano',
  FLESH_PIANO:'fleshpiano',
  FLINX_FUR_PIANO:'flinxfurpiano',
  FORBIDDEN_PIANO:'forbiddenpiano',
  FROZEN_PIANO:'frozenpiano',
  GLASS_PIANO:'glasspiano',
  GOLDEN_PIANO:'goldenpiano',
  GOTHIC_PIANO:'gothicpiano',
  GRANITE_PIANO:'granitepiano',
  GREEN_DUNGEON_PIANO:'greendungeonpiano',
  HALLOWED_PIANO:'hallowedpiano',
  HARPY_PIANO:'harpypiano',
  HONEY_PIANO:'honeypiano',
  JELLYFISH_PIANO:'jellyfishpiano',
  LESION_PIANO:'lesionpiano',
  LIBRARIAN_PIANO:'librarianpiano',
  LIHZAHRD_PIANO:'lihzahrdpiano',
  LIVING_WOOD_PIANO:'livingwoodpiano',
  MARBLE_PIANO:'marblepiano',
  MARTIAN_PIANO:'martianpiano',
  METEORITE_PIANO:'meteoritepiano',
  MUSHROOM_PIANO:'mushroompiano',
  NEBULA_PIANO:'nebulapiano',
  OBSIDIAN_PIANO:'obsidianpiano',
  OFFICE_PIANO:'officepiano',
  PALM_WOOD_PIANO:'palmwoodpiano',
  PEARLWOOD_PIANO:'pearlwoodpiano',
  PIANO:'piano',
  PINE_PIANO:'pinepiano',
  PINK_DUNGEON_PIANO:'pinkdungeonpiano',
  PUMPKIN_PIANO:'pumpkinpiano',
  REEF_PIANO:'reefpiano',
  RICH_MAHOGANY_PIANO:'richmahoganypiano',
  SANDSTONE_PIANO:'sandstonepiano',
  SHADEWOOD_PIANO:'shadewoodpiano',
  SKYWARE_PIANO:'skywarepiano',
  SLIME_PIANO:'slimepiano',
  SNOW_PIANO:'snowpiano',
  SOLAR_PIANO:'solarpiano',
  SPIDER_PIANO:'spiderpiano',
  SPIKE_PIANO:'spikepiano',
  SPOOKY_PIANO:'spookypiano',
  STARDUST_PIANO:'stardustpiano',
  STEAMPUNK_PIANO:'steampunkpiano',
  STONE_PIANO:'stonepiano',
  VORTEX_PIANO:'vortexpiano',
  AETHERIUM_PLATFORM:'aetheriumplatform',
  AQUARIUM_PLATFORM:'aquariumplatform',
  ASH_WOOD_PLATFORM:'ashwoodplatform',
  BALLOON_PLATFORM:'balloonplatform',
  BAMBOO_PLATFORM:'bambooplatform',
  BLUE_BRICK_PLATFORM:'bluebrickplatform',
  BLUE_TEAM_PLATFORM:'blueteamplatform',
  BONE_PLATFORM:'boneplatform',
  BOREAL_WOOD_PLATFORM:'borealwoodplatform',
  BOULDER_PLATFORM:'boulderplatform',
  CACTUS_PLATFORM:'cactusplatform',
  CLOUD_PLATFORM:'cloudplatform',
  CRIMTANE_PLATFORM:'crimtaneplatform',
  CRYSTAL_PLATFORM:'crystalplatform',
  DEMONITE_PLATFORM:'demoniteplatform',
  DUSKWARE_PLATFORM:'duskwareplatform',
  DYNASTY_WOOD_PLATFORM:'dynastywoodplatform',
  EASTER_PLATFORM:'easterplatform',
  EBONWOOD_PLATFORM:'ebonwoodplatform',
  ECHO_PLATFORM:'echoplatform',
  FALLEN_STAR_PLATFORM:'fallenstarplatform',
  FEYWOOD_PLATFORM:'feywoodplatform',
  FLESH_PLATFORM:'fleshplatform',
  FLINX_FUR_PLATFORM:'flinxfurplatform',
  FORBIDDEN_PLATFORM:'forbiddenplatform',
  FROZEN_PLATFORM:'frozenplatform',
  GLASS_PLATFORM:'glassplatform',
  GOLDEN_PLATFORM:'goldenplatform',
  GOTHIC_PLATFORM:'gothicplatform',
  GRANITE_PLATFORM:'graniteplatform',
  GREEN_BRICK_PLATFORM:'greenbrickplatform',
  GREEN_TEAM_PLATFORM:'greenteamplatform',
  HALLOWED_PLATFORM:'hallowedplatform',
  HARPY_PLATFORM:'harpyplatform',
  HONEY_PLATFORM:'honeyplatform',
  JELLYFISH_PLATFORM:'jellyfishplatform',
  LESION_PLATFORM:'lesionplatform',
  LIBRARIAN_PLATFORM:'librarianplatform',
  LIHZAHRD_PLATFORM:'lihzahrdplatform',
  LIVING_WOOD_PLATFORM:'livingwoodplatform',
  MARBLE_PLATFORM:'marbleplatform',
  MARTIAN_PLATFORM:'martianplatform',
  METEORITE_PLATFORM:'meteoriteplatform',
  MUSHROOM_PLATFORM:'mushroomplatform',
  NEBULA_PLATFORM:'nebulaplatform',
  OBSIDIAN_PLATFORM:'obsidianplatform',
  OFFICE_PLATFORM:'officeplatform',
  PALM_WOOD_PLATFORM:'palmwoodplatform',
  PEARLWOOD_PLATFORM:'pearlwoodplatform',
  PINE_PLATFORM:'pineplatform',
  PINK_BRICK_PLATFORM:'pinkbrickplatform',
  PINK_TEAM_PLATFORM:'pinkteamplatform',
  PUMPKIN_PLATFORM:'pumpkinplatform',
  RED_TEAM_PLATFORM:'redteamplatform',
  REEF_PLATFORM:'reefplatform',
  RICH_MAHOGANY_PLATFORM:'richmahoganyplatform',
  SANDSTONE_PLATFORM:'sandstoneplatform',
  SHADEWOOD_PLATFORM:'shadewoodplatform',
  SKYWARE_PLATFORM:'skywareplatform',
  SLIME_PLATFORM:'slimeplatform',
  SNOW_PLATFORM:'snowplatform',
  SOLAR_PLATFORM:'solarplatform',
  SPIDER_PLATFORM:'spiderplatform',
  SPIKE_PLATFORM:'spikeplatform',
  SPOOKY_WOOD_PLATFORM:'spookywoodplatform',
  STARDUST_PLATFORM:'stardustplatform',
  STEAMPUNK_PLATFORM:'steampunkplatform',
  STONE_PLATFORM:'stoneplatform',
  VORTEX_PLATFORM:'vortexplatform',
  WHITE_TEAM_PLATFORM:'whiteteamplatform',
  YELLOW_TEAM_PLATFORM:'yellowteamplatform',
  AETHERIUM_SINK:'aetheriumsink',
  AQUARIUM_SINK:'aquariumsink',
  ASH_WOOD_SINK:'ashwoodsink',
  BALLOON_SINK:'balloonsink',
  BAMBOO_SINK:'bamboosink',
  BLUE_DUNGEON_SINK:'bluedungeonsink',
  BONE_SINK:'bonesink',
  BOREAL_WOOD_SINK:'borealwoodsink',
  BOULDER_SINK:'bouldersink',
  CACTUS_SINK:'cactussink',
  CLOUD_SINK:'cloudsink',
  CRIMTANE_SINK:'crimtanesink',
  CRYSTAL_SINK:'crystalsink',
  DEMONITE_SINK:'demonitesink',
  DUSKWARE_SINK:'duskwaresink',
  DYNASTY_SINK:'dynastysink',
  EASTER_SINK:'eastersink',
  EBONWOOD_SINK:'ebonwoodsink',
  FALLEN_STAR_SINK:'fallenstarsink',
  FEYWOOD_SINK:'feywoodsink',
  FLESH_SINK:'fleshsink',
  FLINX_FUR_SINK:'flinxfursink',
  FORBIDDEN_SINK:'forbiddensink',
  FROZEN_SINK:'frozensink',
  GLASS_SINK:'glasssink',
  GOLDEN_SINK:'goldensink',
  GOTHIC_SINK:'gothicsink',
  GRANITE_SINK:'granitesink',
  GREEN_DUNGEON_SINK:'greendungeonsink',
  HALLOWED_SINK:'hallowedsink',
  HARPY_SINK:'harpysink',
  HONEY_SINK:'honeysink',
  JELLYFISH_SINK:'jellyfishsink',
  LESION_SINK:'lesionsink',
  LIBRARIAN_SINK:'librariansink',
  LIHZAHRD_SINK:'lihzahrdsink',
  LIVING_WOOD_SINK:'livingwoodsink',
  MARBLE_SINK:'marblesink',
  MARTIAN_SINK:'martiansink',
  METAL_SINK:'metalsink',
  METEORITE_SINK:'meteoritesink',
  MUSHROOM_SINK:'mushroomsink',
  NEBULA_SINK:'nebulasink',
  OBSIDIAN_SINK:'obsidiansink',
  OFFICE_SINK:'officesink',
  PALM_WOOD_SINK:'palmwoodsink',
  PEARLWOOD_SINK:'pearlwoodsink',
  PINE_SINK:'pinesink',
  PINK_DUNGEON_SINK:'pinkdungeonsink',
  PUMPKIN_SINK:'pumpkinsink',
  REEF_SINK:'reefsink',
  RICH_MAHOGANY_SINK:'richmahoganysink',
  SANDSTONE_SINK:'sandstonesink',
  SHADEWOOD_SINK:'shadewoodsink',
  SKYWARE_SINK:'skywaresink',
  SLIME_SINK:'slimesink',
  SNOW_SINK:'snowsink',
  SOLAR_SINK:'solarsink',
  SPIDER_SINK:'spidersink',
  SPIKE_SINK:'spikesink',
  SPOOKY_SINK:'spookysink',
  STARDUST_SINK:'stardustsink',
  STEAMPUNK_SINK:'steampunksink',
  STONE_SINK:'stonesink',
  VORTEX_SINK:'vortexsink',
  WOODEN_SINK:'woodensink',
  AETHERIUM_SOFA:'aetheriumsofa',
  AQUARIUM_SOFA:'aquariumsofa',
  ASH_WOOD_SOFA:'ashwoodsofa',
  BALLOON_SOFA:'balloonsofa',
  BAMBOO_SOFA:'bamboosofa',
  BLUE_DUNGEON_SOFA:'bluedungeonsofa',
  BONE_SOFA:'bonesofa',
  BOREAL_WOOD_SOFA:'borealwoodsofa',
  BOULDER_SOFA:'bouldersofa',
  CACTUS_SOFA:'cactussofa',
  CLOUD_SOFA:'cloudsofa',
  CRIMTANE_SOFA:'crimtanesofa',
  CRYSTAL_SOFA:'crystalsofa',
  DEMONITE_SOFA:'demonitesofa',
  DUSKWARE_SOFA:'duskwaresofa',
  DYNASTY_SOFA:'dynastysofa',
  EASTER_SOFA:'eastersofa',
  EBONWOOD_SOFA:'ebonwoodsofa',
  FALLEN_STAR_SOFA:'fallenstarsofa',
  FEYWOOD_SOFA:'feywoodsofa',
  FLESH_SOFA:'fleshsofa',
  FLINX_FUR_SOFA:'flinxfursofa',
  FORBIDDEN_SOFA:'forbiddensofa',
  FROZEN_SOFA:'frozensofa',
  GLASS_SOFA:'glasssofa',
  GOLDEN_SOFA:'goldensofa',
  GOTHIC_SOFA:'gothicsofa',
  GRANITE_SOFA:'granitesofa',
  GREEN_DUNGEON_SOFA:'greendungeonsofa',
  HALLOWED_SOFA:'hallowedsofa',
  HARPY_SOFA:'harpysofa',
  HONEY_SOFA:'honeysofa',
  JELLYFISH_SOFA:'jellyfishsofa',
  LESION_SOFA:'lesionsofa',
  LIBRARIAN_SOFA:'librariansofa',
  LIHZAHRD_SOFA:'lihzahrdsofa',
  LIVING_WOOD_SOFA:'livingwoodsofa',
  MARBLE_SOFA:'marblesofa',
  MARTIAN_SOFA:'martiansofa',
  METEORITE_SOFA:'meteoritesofa',
  MUSHROOM_SOFA:'mushroomsofa',
  NEBULA_SOFA:'nebulasofa',
  OBSIDIAN_SOFA:'obsidiansofa',
  OFFICE_SOFA:'officesofa',
  PALM_WOOD_SOFA:'palmwoodsofa',
  PEARLWOOD_SOFA:'pearlwoodsofa',
  PINE_SOFA:'pinesofa',
  PINK_DUNGEON_SOFA:'pinkdungeonsofa',
  PUMPKIN_SOFA:'pumpkinsofa',
  REEF_SOFA:'reefsofa',
  RICH_MAHOGANY_SOFA:'richmahoganysofa',
  SANDSTONE_SOFA:'sandstonesofa',
  SHADEWOOD_SOFA:'shadewoodsofa',
  SKYWARE_SOFA:'skywaresofa',
  SLIME_SOFA:'slimesofa',
  SNOW_SOFA:'snowsofa',
  SOFA:'sofa',
  SOLAR_SOFA:'solarsofa',
  SPIDER_SOFA:'spidersofa',
  SPIKE_SOFA:'spikesofa',
  SPOOKY_SOFA:'spookysofa',
  STARDUST_SOFA:'stardustsofa',
  STEAMPUNK_SOFA:'steampunksofa',
  STONE_SOFA:'stonesofa',
  VORTEX_SOFA:'vortexsofa',
  AETHERIUM_TABLE:'aetheriumtable',
  ALCHEMY_TABLE:'alchemytable',
  ANCIENT_TABLET:'ancienttablet',
  AQUARIUM_TABLE:'aquariumtable',
  ASH_WOOD_TABLE:'ashwoodtable',
  BALLOON_TABLE:'balloontable',
  BAMBOO_TABLE:'bambootable',
  BANQUET_TABLE:'banquettable',
  BEWITCHING_TABLE:'bewitchingtable',
  BLUE_DUNGEON_TABLE:'bluedungeontable',
  BONE_TABLE:'bonetable',
  BOREAL_WOOD_TABLE:'borealwoodtable',
  BOULDER_TABLE:'bouldertable',
  CACTUS_TABLE:'cactustable',
  CLOUD_TABLE:'cloudtable',
  CRIMTANE_TABLE:'crimtanetable',
  CRYSTAL_TABLE:'crystaltable',
  DEMONITE_TABLE:'demonitetable',
  DUSKWARE_TABLE:'duskwaretable',
  DYNASTY_TABLE:'dynastytable',
  EASTER_TABLE:'eastertable',
  EBONWOOD_TABLE:'ebonwoodtable',
  FALLEN_STAR_TABLE:'fallenstartable',
  FANCY_PICNIC_TABLE:'fancypicnictable',
  FEYWOOD_TABLE:'feywoodtable',
  FLESH_TABLE:'fleshtable',
  FLINX_FUR_TABLE:'flinxfurtable',
  FORBIDDEN_TABLE:'forbiddentable',
  FROZEN_TABLE:'frozentable',
  GLASS_TABLE:'glasstable',
  GOLDEN_TABLE:'goldentable',
  GOTHIC_TABLE:'gothictable',
  GRANITE_TABLE:'granitetable',
  GREEN_DUNGEON_TABLE:'greendungeontable',
  HALLOWED_TABLE:'hallowedtable',
  HARPY_TABLE:'harpytable',
  HONEY_TABLE:'honeytable',
  JELLYFISH_TABLE:'jellyfishtable',
  LESION_TABLE:'lesiontable',
  LIBRARIAN_TABLE:'librariantable',
  LIHZAHRD_TABLE:'lihzahrdtable',
  LIVING_WOOD_TABLE:'livingwoodtable',
  MARBLE_TABLE:'marbletable',
  MARTIAN_TABLE:'martiantable',
  MARTIAN_TABLE_LAMP:'martiantablelamp',
  METEORITE_TABLE:'meteoritetable',
  MUSHROOM_TABLE:'mushroomtable',
  NEBULA_TABLE:'nebulatable',
  OBSIDIAN_TABLE:'obsidiantable',
  OFFICE_TABLE:'officetable',
  PALM_WOOD_TABLE:'palmwoodtable',
  PEARLWOOD_TABLE:'pearlwoodtable',
  PICNIC_TABLE:'picnictable',
  PINE_TABLE:'pinetable',
  PINK_DUNGEON_TABLE:'pinkdungeontable',
  PORTABLE_KILN:'portablekiln',
  PUMPKIN_TABLE:'pumpkintable',
  REEF_TABLE:'reeftable',
  RICH_MAHOGANY_TABLE:'richmahoganytable',
  SANDSTONE_TABLE:'sandstonetable',
  SHADEWOOD_TABLE:'shadewoodtable',
  SKYWARE_TABLE:'skywaretable',
  SLIME_TABLE:'slimetable',
  SNOW_TABLE:'snowtable',
  SOLAR_TABLE:'solartable',
  SPIDER_TABLE:'spidertable',
  SPIKE_TABLE:'spiketable',
  SPOOKY_TABLE:'spookytable',
  STARDUST_TABLE:'stardusttable',
  STEAMPUNK_TABLE:'steampunktable',
  STONE_TABLE:'stonetable',
  VORTEX_TABLE:'vortextable',
  WAR_TABLE:'wartable',
  WAR_TABLE_BANNER:'wartablebanner',
  AETHERIUM_TOILET:'aetheriumtoilet',
  AQUARIUM_TOILET:'aquariumtoilet',
  ASH_WOOD_TOILET:'ashwoodtoilet',
  BALLOON_TOILET:'balloontoilet',
  BAMBOO_TOILET:'bambootoilet',
  BLUE_DUNGEON_TOILET:'bluedungeontoilet',
  BONE_TOILET:'bonetoilet',
  BOREAL_WOOD_TOILET:'borealwoodtoilet',
  BOULDER_TOILET:'bouldertoilet',
  CACTUS_TOILET:'cactustoilet',
  CLOUD_TOILET:'cloudtoilet',
  CRIMTANE_TOILET:'crimtanetoilet',
  CRYSTAL_TOILET:'crystaltoilet',
  DEMONITE_TOILET:'demonitetoilet',
  DIAMOND_TOILET:'diamondtoilet',
  DUSKWARE_TOILET:'duskwaretoilet',
  DYNASTY_TOILET:'dynastytoilet',
  EASTER_TOILET:'eastertoilet',
  EBONWOOD_TOILET:'ebonwoodtoilet',
  FALLEN_STAR_TOILET:'fallenstartoilet',
  FEYWOOD_TOILET:'feywoodtoilet',
  FLESH_TOILET:'fleshtoilet',
  FLINX_FUR_TOILET:'flinxfurtoilet',
  FORBIDDEN_TOILET:'forbiddentoilet',
  FROZEN_TOILET:'frozentoilet',
  GLASS_TOILET:'glasstoilet',
  GOLDEN_TOILET:'goldentoilet',
  GOTHIC_TOILET:'gothictoilet',
  GRANITE_TOILET:'granitetoilet',
  GREEN_DUNGEON_TOILET:'greendungeontoilet',
  HALLOWED_TOILET:'hallowedtoilet',
  HARPY_TOILET:'harpytoilet',
  HONEY_TOILET:'honeytoilet',
  JELLYFISH_TOILET:'jellyfishtoilet',
  LESION_TOILET:'lesiontoilet',
  LIBRARIAN_TOILET:'librariantoilet',
  LIHZAHRD_TOILET:'lihzahrdtoilet',
  LIVING_WOOD_TOILET:'livingwoodtoilet',
  MARBLE_TOILET:'marbletoilet',
  MARTIAN_TOILET:'martiantoilet',
  METEORITE_TOILET:'meteoritetoilet',
  MUSHROOM_TOILET:'mushroomtoilet',
  NEBULA_TOILET:'nebulatoilet',
  OBSIDIAN_TOILET:'obsidiantoilet',
  OFFICE_TOILET:'officetoilet',
  PALM_WOOD_TOILET:'palmwoodtoilet',
  PEARLWOOD_TOILET:'pearlwoodtoilet',
  PINE_TOILET:'pinetoilet',
  PINK_DUNGEON_TOILET:'pinkdungeontoilet',
  PUMPKIN_TOILET:'pumpkintoilet',
  REEF_TOILET:'reeftoilet',
  RICH_MAHOGANY_TOILET:'richmahoganytoilet',
  SANDSTONE_TOILET:'sandstonetoilet',
  SHADEWOOD_TOILET:'shadewoodtoilet',
  SKYWARE_TOILET:'skywaretoilet',
  SLIME_TOILET:'slimetoilet',
  SNOW_TOILET:'snowtoilet',
  SOLAR_TOILET:'solartoilet',
  SPIDER_TOILET:'spidertoilet',
  SPIKE_TOILET:'spiketoilet',
  SPOOKY_TOILET:'spookytoilet',
  STARDUST_TOILET:'stardusttoilet',
  STEAMPUNK_TOILET:'steampunktoilet',
  STONE_TOILET:'stonetoilet',
  TERRA_TOILET:'terratoilet',
  TOILET:'toilet',
  VORTEX_TOILET:'vortextoilet',
  AETHER_TORCH:'aethertorch',
  BLUE_TORCH:'bluetorch',
  BONE_TORCH:'bonetorch',
  CORAL_TORCH:'coraltorch',
  CORRUPT_TORCH:'corrupttorch',
  CRIMSON_TORCH:'crimsontorch',
  CURSED_TORCH:'cursedtorch',
  DEMON_TORCH:'demontorch',
  DESERT_TORCH:'deserttorch',
  GREEN_TORCH:'greentorch',
  HALLOWED_TORCH:'hallowedtorch',
  ICE_TORCH:'icetorch',
  ICHOR_TORCH:'ichortorch',
  JUNGLE_TORCH:'jungletorch',
  MUSHROOM_TORCH:'mushroomtorch',
  MUSIC_BOX_ALT_TORCH_GOD:'musicboxalttorchgod',
  MUSIC_BOX_TORCH_GOD:'musicboxtorchgod',
  ORANGE_TORCH:'orangetorch',
  PINK_TORCH:'pinktorch',
  PURPLE_TORCH:'purpletorch',
  RAINBOW_TORCH:'rainbowtorch',
  RED_TORCH:'redtorch',
  TIKI_TORCH:'tikitorch',
  ULTRABRIGHT_TORCH:'ultrabrighttorch',
  WHITE_TORCH:'whitetorch',
  YELLOW_TORCH:'yellowtorch',
    ASH_WOOD_WALL:'ashwoodwall',
  BLUE_BRICK_WALL:'bluebrickwall',
  BOREAL_WOOD_WALL:'borealwoodwall',
  CACTUS_WALL:'cactuswall',
  CLOUD_WALL:'cloudwall',
  COPPER_BRICK_WALL:'copperbrickwall',
  COPPER_PLATING:'copperplating',
  DISC_WALL:'discwall',
  EBONWOOD_WALL:'ebonwoodwall',
  GLASS_WALL:'glasswall',
  GOLD_BRICK_WALL:'goldbrickwall',
  GRANITE_WALL:'granitewall',
  GRAY_BRICK_WALL:'graybrickwall',
  GREEN_BRICK_WALL:'greenbrickwall',
  HELLSTONE_BRICK_WALL:'hellstonebrickwall',
  ICE_WALL:'icewall',
  JUNGLE_WALL:'junglewall',
  LAVAFALL_WALL:'lavafallwall',
  LIVING_WOOD_WALL:'livingwoodwall',
  MARBLE_WALL:'marblewall',
  MUSHROOM_WALL:'mushroomwall',
  OBSIDIAN_BRICK_WALL:'obsidianbrickwall',
  OBSIDIAN_WALL:'obsidianwall',
  PALM_WOOD_WALL:'palmwoodwall',
  PEARLWOOD_WALL:'pearlwoodwall',
  PINK_BRICK_WALL:'pinkbrickwall',
  RED_BRICK_WALL:'redbrickwall',
  RICH_MAHOGANY_WALL:'richmahoganywall',
  SANDSTONE_WALL:'sandstonewall',
  SHADEWOOD_WALL:'shadewoodwall',
  SILVER_BRICK_WALL:'silverbrickwall',
  SNOW_WALL:'snowwall',
  SPIDER_WALL:'spiderwall',
  STONE_WALL:'stonewall',
  WATERFALL_WALL:'waterfallwall',
  ASH_WOOD:'ashwood',
  BOREAL_WOOD:'borealwood',
  CRIMSTONE_BLOCK:'crimstoneblock',
  DESERT_FOSSIL:'desertfossil',
  EBONSTONE_BLOCK:'ebonstoneblock',
  FLESH_BLOCK:'fleshblock',
  HIVE:'hive',
  LESION_BLOCK:'lesionblock',
  PALM_WOOD:'palmwood',
  PEARLSTONE_BLOCK:'pearlstoneblock',
  SANDSTONE_BLOCK:'sandstoneblock',
  SANDSTONE_BRICK:'sandstonebrick',
  SNOW_BRICK:'snowbrick',
  ADHESIVE_BANDAGE:'adhesivebandage',
  ANTLION_MANDIBLE:'antlionmandible',
  ARMOR_POLISH:'armorpolish',
  BEZOAR:'bezoar',
  BLACK_LENS:'blacklens',
  CYAN_HUSK:'cyanhusk',
  FIRE_FEATHER:'firefeather',
  FROST_CORE:'frostcore',
  LIME_KELP:'limekelp',
  ORANGE_BLOODROOT:'orangebloodroot',
  PINK_PRICKLY_PEAR:'pinkpricklypear',
  PURPLE_MUCUS:'purplemucus',
  RED_HUSK:'redhusk',
  ROTTEN_CHUNK:'rottenchunk',
  UNHOLY_WATER:'unholywater',
  VERTEBRA:'vertebra',
  VIOLET_HUSK:'violethusk',
    I_0X33S_AVIATORS:'0x33saviators',
  I_1_SECOND_TIMER:'1secondtimer',
  I_12_SECOND_TIMER:'12secondtimer',
  I_14_SECOND_TIMER:'14secondtimer',
  I_3_SECOND_TIMER:'3secondtimer',
  I_5_SECOND_TIMER:'5secondtimer',
  A_HORRIBLE_NIGHTFOR_ALCHEMY:'ahorriblenightforalchemy',
  A_MACHINEFOR_TERRARIANS:'amachineforterrarians',
  AARONS_BREASTPLATE:'aaronsbreastplate',
  AARONS_HELMET:'aaronshelmet',
  AARONS_LEGGINGS:'aaronsleggings',
  ABIGAILS_FLOWER:'abigailsflower',
  ACORN_SLINGSHOT:'acornslingshot',
  ACORNS:'acorns',
  ACTIVE_STONE_BLOCK:'activestoneblock',
  ACTUATION_ROD:'actuationrod',
  ACTUATOR:'actuator',
  ADAMANTITE_BEAM:'adamantitebeam',
  ADAMANTITE_BEAM_WALL:'adamantitebeamwall',
  ADAMANTITE_CHAINSAW:'adamantitechainsaw',
  ADAMANTITE_DRILL:'adamantitedrill',
  ADAMANTITE_FORGE:'adamantiteforge',
  ADAMANTITE_HEADGEAR:'adamantiteheadgear',
  ADVANCED_COMBAT_TECHNIQUES:'advancedcombattechniques',
  AETHER_CAMPFIRE:'aethercampfire',
  AETHER_MONOLITH:'aethermonolith',
  AETHER_PYLON:'aetherpylon',
  AETHERIUM_BLOCK:'aetheriumblock',
  AETHERIUM_BRICK:'aetheriumbrick',
  AETHERIUM_BRICK_WALL:'aetheriumbrickwall',
  AETHERIUM_WALL:'aetheriumwall',
  ALCHEMY_FLASK:'alchemyflask',
  ALE:'ale',
  AMANITA_FUNGIFIN:'amanitafungifin',
  AMAZON:'amazon',
  AMBER_BUNNY:'amberbunny',
  AMBER_BUNNY_CAGE:'amberbunnycage',
  AMBER_GEM_LOCK:'ambergemlock',
  AMBER_GEMCORN:'ambergemcorn',
  AMBER_GEMSPARK_BLOCK:'ambergemsparkblock',
  AMBER_GEMSPARK_WALL:'ambergemsparkwall',
  AMBER_HORSESHOE_BALLOON:'amberhorseshoeballoon',
  AMBER_MINECART:'amberminecart',
  AMBER_MOSQUITO:'ambermosquito',
  AMBER_SQUIRREL:'ambersquirrel',
  AMBER_SQUIRREL_CAGE:'ambersquirrelcage',
  AMBER_STONE_BLOCK:'amberstoneblock',
  AMBER_STONE_WALL:'amberstonewall',
  AMERICAN_EXPLOSIVE:'americanexplosive',
  AMETHYST_BUNNY:'amethystbunny',
  AMETHYST_BUNNY_CAGE:'amethystbunnycage',
  AMETHYST_GEM_LOCK:'amethystgemlock',
  AMETHYST_GEMCORN:'amethystgemcorn',
  AMETHYST_GEMSPARK_BLOCK:'amethystgemsparkblock',
  AMETHYST_GEMSPARK_WALL:'amethystgemsparkwall',
  AMETHYST_HOOK:'amethysthook',
  AMETHYST_MINECART:'amethystminecart',
  AMETHYST_ROBE:'amethystrobe',
  AMETHYST_SQUIRREL:'amethystsquirrel',
  AMETHYST_SQUIRREL_CAGE:'amethystsquirrelcage',
  AMETHYST_STONE_BLOCK:'amethyststoneblock',
  AMETHYST_STONE_WALL:'amethyststonewall',
  AMMO_BOX:'ammobox',
  AMULETOFTHE_NIGHT:'amuletofthenight',
  ANCHOR:'anchor',
  ANCIENT_BLUE_BRICK:'ancientbluebrick',
  ANCIENT_BLUE_BRICK_WALL:'ancientbluebrickwall',
  ANCIENT_CHISEL:'ancientchisel',
  ANCIENT_CLOTH:'ancientcloth',
  ANCIENT_COBALT_BRICK:'ancientcobaltbrick',
  ANCIENT_COBALT_BRICK_WALL:'ancientcobaltbrickwall',
  ANCIENT_COBALT_LEGGINGS:'ancientcobaltleggings',
  ANCIENT_COPPER_BRICK:'ancientcopperbrick',
  ANCIENT_COPPER_BRICK_WALL:'ancientcopperbrickwall',
  ANCIENT_GARMENTS:'ancientgarments',
  ANCIENT_GOLD_BRICK:'ancientgoldbrick',
  ANCIENT_GOLD_BRICK_WALL:'ancientgoldbrickwall',
  ANCIENT_GOLD_HELMET:'ancientgoldhelmet',
  ANCIENT_GREEN_BRICK:'ancientgreenbrick',
  ANCIENT_GREEN_BRICK_WALL:'ancientgreenbrickwall',
  ANCIENT_HALLOWED_GREAVES:'ancienthallowedgreaves',
  ANCIENT_HALLOWED_HEADGEAR:'ancienthallowedheadgear',
  ANCIENT_HALLOWED_HELMET:'ancienthallowedhelmet',
  ANCIENT_HALLOWED_HOOD:'ancienthallowedhood',
  ANCIENT_HALLOWED_PLATE_MAIL:'ancienthallowedplatemail',
  ANCIENT_HEADDRESS:'ancientheaddress',
  ANCIENT_HELLSTONE_BRICK:'ancienthellstonebrick',
  ANCIENT_HELLSTONE_BRICK_WALL:'ancienthellstonebrickwall',
  ANCIENT_HORN:'ancienthorn',
  ANCIENT_IRON_HELMET:'ancientironhelmet',
  ANCIENT_MANIPULATOR:'ancientmanipulator',
  ANCIENT_MYTHRIL_BRICK:'ancientmythrilbrick',
  ANCIENT_MYTHRIL_BRICK_WALL:'ancientmythrilbrickwall',
  ANCIENT_NECRO_HELMET:'ancientnecrohelmet',
  ANCIENT_OBSIDIAN_BRICK:'ancientobsidianbrick',
  ANCIENT_OBSIDIAN_BRICK_WALL:'ancientobsidianbrickwall',
  ANCIENT_PINK_BRICK:'ancientpinkbrick',
  ANCIENT_PINK_BRICK_WALL:'ancientpinkbrickwall',
  ANCIENT_SHADOW_GREAVES:'ancientshadowgreaves',
  ANCIENT_SHADOW_HELMET:'ancientshadowhelmet',
  ANCIENT_SHADOW_SCALEMAIL:'ancientshadowscalemail',
  ANCIENT_SILVER_BRICK:'ancientsilverbrick',
  ANCIENT_SILVER_BRICK_WALL:'ancientsilverbrickwall',
  ANCIENT_SLACKS:'ancientslacks',
  ANDREW_SPHINX:'andrewsphinx',
  ANGEL_HALO:'angelhalo',
  ANGELFISH:'angelfish',
  ANGLER_HAT:'anglerhat',
  ANGLER_PANTS:'anglerpants',
  ANGLER_TACKLE_BAG:'anglertacklebag',
  ANGLER_VEST:'anglervest',
  ANKLETOFTHE_WIND:'ankletofthewind',
  ANNOUNCEMENT_BOX:'announcementbox',
  ANTI_PORTAL_BLOCK:'antiportalblock',
  ANTLION_EGGS:'antlioneggs',
  APPLE:'apple',
  APPLE_JUICE:'applejuice',
  APPLE_PIE_SLICE:'applepieslice',
  APPRENTICE_BAIT:'apprenticebait',
  APPRENTICES_HAT:'apprenticeshat',
  APPRENTICES_ROBE:'apprenticesrobe',
  APPRENTICES_SCARF:'apprenticesscarf',
  APPRENTICES_TROUSERS:'apprenticestrousers',
  APRICOT:'apricot',
  AQUARIUM_BLOCK:'aquariumblock',
  AQUARIUM_WALL:'aquariumwall',
  ARCANE_CRYSTAL:'arcanecrystal',
  ARCANE_FLOWER:'arcaneflower',
  ARCANE_RUNE_WALL:'arcanerunewall',
  ARCHAEOLOGISTS_HAT:'archaeologistshat',
  ARCHAEOLOGISTS_JACKET:'archaeologistsjacket',
  ARCHAEOLOGISTS_PANTS:'archaeologistspants',
  ARCHITECT_GIZMO_PACK:'architectgizmopack',
  ARGON_MOSS:'argonmoss',
  ARGON_MOSS_BRICK:'argonmossbrick',
  ARGON_MOSS_BRICK_WALL:'argonmossbrickwall',
  ARGON_MOSS_FISHING_BOBBER:'argonmossfishingbobber',
  ARKHALIS:'arkhalis',
  ARKHALIS_BODICE:'arkhalisbodice',
  ARKHALIS_HOOD:'arkhalishood',
  ARKHALIS_LIGHTWINGS:'arkhalislightwings',
  ARKHALIS_TIGHTS:'arkhalistights',
  ARMLET_OF_RUIN:'armletofruin',
  ARMOR_BRACING:'armorbracing',
  ARROW_SIGN:'arrowsign',
  ARTERY:'artery',
  ARTISAN_LOAF:'artisanloaf',
  ASH_GRASS_SEEDS:'ashgrassseeds',
  ASH_WOOD_BREASTPLATE:'ashwoodbreastplate',
  ASH_WOOD_FENCE:'ashwoodfence',
  ASH_WOOD_GREAVES:'ashwoodgreaves',
  ASH_WOOD_HELMET:'ashwoodhelmet',
  ASPHALT_BLOCK:'asphaltblock',
  ASTRA_BRICK:'astrabrick',
  ASTRA_BRICK_WALL:'astrabrickwall',
  ATLANTIC_COD:'atlanticcod',
  AURORA_BOREALIS:'auroraborealis',
  AUTOHAMMER:'autohammer',
  AXEARANG:'axearang',
  AZURE_CRATE:'azurecrate',
  B_B_Q_RIBS:'bbqribs',
  BABY_GRINCHS_MISCHIEF_WHISTLE:'babygrinchsmischiefwhistle',
  BACON:'bacon',
  BADGERS_HAT:'badgershat',
  BALL_O_FUSE_WIRE:'ballofusewire',
  BALL_O_HURT:'ballohurt',
  BALLA_HAT:'ballahat',
  BALLOON_ANIMAL:'balloonanimal',
  BALLOON_PUFFERFISH:'balloonpufferfish',
  BALLOONY_BEADS:'balloonybeads',
  BAMBOO:'bamboo',
  BAMBOO_FENCE:'bamboofence',
  BAMBOO_LEAF:'bambooleaf',
  BAMBOO_WALL:'bamboowall',
  BANANA:'banana',
  BANANA_SPLIT:'bananasplit',
  BANDAGE_BOY:'bandageboy',
  BAR:'bar',
  BAR_STOOL:'barstool',
  BARREL:'barrel',
  BATFISH:'batfish',
  BEACH_BALL:'beachball',
  BEANIE:'beanie',
  BEDAZZLED_NECTAR:'bedazzlednectar',
  BEE_CLOAK:'beecloak',
  BEE_HAT:'beehat',
  BEE_HIVE:'beehive',
  BEE_MINECART:'beeminecart',
  BEE_PANTS:'beepants',
  BEE_SHIRT:'beeshirt',
  BEE_WINGS:'beewings',
  BEETLE_MINECART:'beetleminecart',
  BEETLE_WINGS:'beetlewings',
  BEGUILING_LYRE:'beguilinglyre',
  BELL:'bell',
  BENNY_WARHOL:'bennywarhol',
  BERNIES_BUTTON:'berniesbutton',
  BERSERKERS_GLOVE:'berserkersglove',
  BETSYS_EGG:'betsysegg',
  BETSYS_WINGS:'betsyswings',
  BIFROST:'bifrost',
  BINOCULARS:'binoculars',
  BIOLUMINESCENCE:'bioluminescence',
  BIOME_HAIR_DYE:'biomehairdye',
  BIOME_SIGHT_POTION:'biomesightpotion',
  BIRD:'bird',
  BIRD_CAGE:'birdcage',
  BIRDIE_RATTLE:'birdierattle',
  BITTER_HARVEST:'bitterharvest',
  BLACK_COUNTERWEIGHT:'blackcounterweight',
  BLACK_DRAGONFLY:'blackdragonfly',
  BLACK_DRAGONFLY_JAR:'blackdragonflyjar',
  BLACK_FAIRY_DUST:'blackfairydust',
  BLACK_GOLF_BALL:'blackgolfball',
  BLACK_GRADUATION_CAP:'blackgraduationcap',
  BLACK_GRADUATION_GOWN:'blackgraduationgown',
  BLACK_INK:'blackink',
  BLACK_PAINT:'blackpaint',
  BLACK_PEARL:'blackpearl',
  BLACK_SCORPION:'blackscorpion',
  BLACK_SCORPION_CAGE:'blackscorpioncage',
  BLACK_STRING:'blackstring',
  BLACK_STUDDED_SADDLE:'blackstuddedsaddle',
  BLACK_THREAD:'blackthread',
  BLACKAND_WHITE_DYE:'blackandwhitedye',
  BLACKCURRANT:'blackcurrant',
  BLACKENED_FISH:'blackenedfish',
  BLACKSMITH_RACK:'blacksmithrack',
  BLEND_O_MATIC:'blendomatic',
  BLESSINGFROMTHE_HEAVENS:'blessingfromtheheavens',
  BLINDFOLD:'blindfold',
  BLINKROOT:'blinkroot',
  BLINKROOT_PLANTER_BOX:'blinkrootplanterbox',
  BLINKROOT_SEEDS:'blinkrootseeds',
  BLIZZARDINA_BALLOON:'blizzardinaballoon',
  BLOOD_MOON_COUNTESS:'bloodmooncountess',
  BLOOD_MOON_MONOLITH:'bloodmoonmonolith',
  BLOOD_MOON_RISING:'bloodmoonrising',
  BLOOD_ORANGE:'bloodorange',
  BLOOD_WATER:'bloodwater',
  BLOOD_WATER_FOUNTAIN:'bloodwaterfountain',
  BLOODBATH_DYE:'bloodbathdye',
  BLOODY_GOBLET:'bloodygoblet',
  BLOODY_MACHETE:'bloodymachete',
  BLOODY_MANOWAR:'bloodymanowar',
  BLOODY_MOSCATO:'bloodymoscato',
  BLUE_BERRIES:'blueberries',
  BLUE_BIKINI_BOTTOM:'bluebikinibottom',
  BLUE_BIKINI_TOP:'bluebikinitop',
  BLUE_BRICK:'bluebrick',
  BLUE_CHICKEN_EGG:'bluechickenegg',
  BLUE_COUNTERWEIGHT:'bluecounterweight',
  BLUE_DRAGONFLY:'bluedragonfly',
  BLUE_DRAGONFLY_JAR:'bluedragonflyjar',
  BLUE_DUNGEON_VASE:'bluedungeonvase',
  BLUE_DYNASTY_SHINGLES:'bluedynastyshingles',
  BLUE_DYNASTY_WALL:'bluedynastywall',
  BLUE_FAIRY:'bluefairy',
  BLUE_FAIRY_JAR:'bluefairyjar',
  BLUE_FLAME_DYE:'blueflamedye',
  BLUE_FLAMEAND_BLACK_DYE:'blueflameandblackdye',
  BLUE_FLAMEAND_SILVER_DYE:'blueflameandsilverdye',
  BLUE_FLOWER_SEEDS:'blueflowerseeds',
  BLUE_GOLF_BALL:'bluegolfball',
  BLUE_GRADUATION_CAP:'bluegraduationcap',
  BLUE_GRADUATION_GOWN:'bluegraduationgown',
  BLUE_HORSESHOE_BALLOON:'bluehorseshoeballoon',
  BLUE_JAY:'bluejay',
  BLUE_JAY_CAGE:'bluejaycage',
  BLUE_JELLYFISH:'bluejellyfish',
  BLUE_JELLYFISH_JAR:'bluejellyfishjar',
  BLUE_LIGHT:'bluelight',
  BLUE_LIGHTS:'bluelights',
  BLUE_MACAW:'bluemacaw',
  BLUE_MACAW_CAGE:'bluemacawcage',
  BLUE_MOON:'bluemoon',
  BLUE_MOSS:'bluemoss',
  BLUE_MOSSY_WALL:'bluemossywall',
  BLUE_PAINT:'bluepaint',
  BLUE_PIN_FLAG:'bluepinflag',
  BLUE_PRESENT:'bluepresent',
  BLUE_PRESSURE_PLATE:'bluepressureplate',
  BLUE_ROCKET:'bluerocket',
  BLUE_ROLLER_SKATES:'bluerollerskates',
  BLUE_SLAB_WALL:'blueslabwall',
  BLUE_SOLUTION:'bluesolution',
  BLUE_STAINED_GLASS:'bluestainedglass',
  BLUE_STARRY_BLOCK:'bluestarryblock',
  BLUE_STARRY_WALL:'bluestarrywall',
  BLUE_STREAMER:'bluestreamer',
  BLUE_STRING:'bluestring',
  BLUE_TEAM_BLOCK:'blueteamblock',
  BLUE_TILED_WALL:'bluetiledwall',
  BLUE_WRENCH:'bluewrench',
  BLUEAND_BLACK_DYE:'blueandblackdye',
  BLUEAND_GREEN_LIGHTS:'blueandgreenlights',
  BLUEAND_SILVER_DYE:'blueandsilverdye',
  BLUEAND_YELLOW_LIGHTS:'blueandyellowlights',
  BOMB:'bomb',
  BOMB_FISH:'bombfish',
  BONE_BLOCK:'boneblock',
  BONE_BLOCK_WALL:'boneblockwall',
  BONE_CAMPFIRE:'bonecampfire',
  BONE_FEATHER:'bonefeather',
  BONE_GLOVE:'boneglove',
  BONE_HELM:'bonehelm',
  BONE_KEY:'bonekey',
  BONE_RATTLE:'bonerattle',
  BONE_WAND:'bonewand',
  BONE_WARP:'bonewarp',
  BONE_WELDER:'bonewelder',
  BONEFISH:'bonefish',
  BOOSTER_TRACK:'boostertrack',
  BOREAL_BEAM:'borealbeam',
  BOREAL_CRATE:'borealcrate',
  BOREAL_WOOD_BREASTPLATE:'borealwoodbreastplate',
  BOREAL_WOOD_FENCE:'borealwoodfence',
  BOREAL_WOOD_GREAVES:'borealwoodgreaves',
  BOREAL_WOOD_HELMET:'borealwoodhelmet',
  BOTTOMLESS_HONEY_BUCKET:'bottomlesshoneybucket',
  BOTTOMLESS_LAVA_BUCKET:'bottomlesslavabucket',
  BOTTOMLESS_SHIMMER_BUCKET:'bottomlessshimmerbucket',
  BOTTOMLESS_WATER_BUCKET:'bottomlesswaterbucket',
  BOULDAND_BASH:'bouldandbash',
  BOULDER:'boulder',
  BOULDER_BLOCK:'boulderblock',
  BOULDER_WALL:'boulderwall',
  BOUNCY_BOMB:'bouncybomb',
  BOUNCY_BOULDER:'bouncyboulder',
  BOUNCY_DYNAMITE:'bouncydynamite',
  BOUNCY_GLOWSTICK:'bouncyglowstick',
  BOW_TOPPER:'bowtopper',
  BOWL:'bowl',
  BOWLOF_SOUP:'bowlofsoup',
  BRAININA_JAR:'braininajar',
  BRAINOF_CONFUSION:'brainofconfusion',
  BRAMBLE_CRATE:'bramblecrate',
  BRASILIAN_SKIES:'brasilianskies',
  BRASS_SHELF:'brassshelf',
  BRICK_LAYER:'bricklayer',
  BRIDEOF_FRANKENSTEIN_DRESS:'brideoffrankensteindress',
  BRIGHT_BLUE_DYE:'brightbluedye',
  BRIGHT_BROWN_DYE:'brightbrowndye',
  BRIGHT_CYAN_DYE:'brightcyandye',
  BRIGHT_GREEN_DYE:'brightgreendye',
  BRIGHT_LIME_DYE:'brightlimedye',
  BRIGHT_ORANGE_DYE:'brightorangedye',
  BRIGHT_PINK_DYE:'brightpinkdye',
  BRIGHT_PURPLE_DYE:'brightpurpledye',
  BRIGHT_RED_DYE:'brightreddye',
  BRIGHT_SILVER_DYE:'brightsilverdye',
  BRIGHT_SKY_BLUE_DYE:'brightskybluedye',
  BRIGHT_TEAL_DYE:'brighttealdye',
  BRIGHT_VIOLET_DYE:'brightvioletdye',
  BRIGHT_YELLOW_DYE:'brightyellowdye',
  BROWN_GOLF_BALL:'browngolfball',
  BROWN_MOSS:'brownmoss',
  BROWN_MOSSY_WALL:'brownmossywall',
  BROWN_PAINT:'brownpaint',
  BROWN_PRESSURE_PLATE:'brownpressureplate',
  BROWN_SOLUTION:'brownsolution',
  BROWN_STRING:'brownstring',
  BROWNAND_BLACK_DYE:'brownandblackdye',
  BROWNAND_SILVER_DYE:'brownandsilverdye',
  BUBBLE:'bubble',
  BUBBLE_MACHINE:'bubblemachine',
  BUBBLE_WAND:'bubblewand',
  BUBBLEGUM_BLOCK:'bubblegumblock',
  BUBBLEGUM_BLOCK_WALL:'bubblegumblockwall',
  BUCCANEER_BANDANA:'buccaneerbandana',
  BUCCANEER_PANTALOONS:'buccaneerpantaloons',
  BUCCANEER_TUNIC:'buccaneertunic',
  BUDDIES:'buddies',
  BUG_NET:'bugnet',
  BUGGY:'buggy',
  BUGGY_CAGE:'buggycage',
  BUILDER_POTION:'builderpotion',
  BUMBLEBEE_TUNA:'bumblebeetuna',
  BUNDLEOF_BALLOONS:'bundleofballoons',
  BUNDLEOF_HORSESHOE_BALLOONS:'bundleofhorseshoeballoons',
  BUNDLED_PARTY_BALLOONS:'bundledpartyballoons',
  BUNNY:'bunny',
  BUNNY_CAGE:'bunnycage',
  BUNNY_CANNON:'bunnycannon',
  BUNNY_EARS:'bunnyears',
  BUNNY_HOOD:'bunnyhood',
  BUNNY_LICENSE:'bunnylicense',
  BUNNY_STEW:'bunnystew',
  BUNNY_TAIL:'bunnytail',
  BUNNYFISH:'bunnyfish',
  BURNING_HADES_DYE:'burninghadesdye',
  BURNING_SPIRIT:'burningspirit',
  BUTCHERS_BLOODSTAINED_APRON:'butchersbloodstainedapron',
  BUTCHERS_BLOODSTAINED_PANTS:'butchersbloodstainedpants',
  BUTCHERS_CHAINSAW:'butcherschainsaw',
  BUTTERFLY_DUST:'butterflydust',
  C_R_T_MONOLITH:'crtmonolith',
  CACTUS:'cactus',
  CACTUS_BREASTPLATE:'cactusbreastplate',
  CACTUS_HELMET:'cactushelmet',
  CACTUS_LEGGINGS:'cactusleggings',
  CAMPFIRE:'campfire',
  CAN_OF_WORMS:'canofworms',
  CANDY_APPLE:'candyapple',
  CANDY_CANE:'candycane',
  CANDY_CANE_BLOCK:'candycaneblock',
  CANDY_CANE_HOOK:'candycanehook',
  CANDY_CANE_WALL:'candycanewall',
  CANNON:'cannon',
  CANNONBALL:'cannonball',
  CAPN_TUNABEARD:'capntunabeard',
  CAPRICORN_CHESTPLATE:'capricornchestplate',
  CAPRICORN_HELMET:'capricornhelmet',
  CAPRICORN_HOOVES:'capricornhooves',
  CAPRICORN_TAIL:'capricorntail',
  CAPTAIN_HAT:'captainhat',
  CAPTAIN_PANTS:'captainpants',
  CAPTAIN_VEST:'captainvest',
  CARDINAL:'cardinal',
  CARDINAL_CAGE:'cardinalcage',
  CARPENTRY_RACK:'carpentryrack',
  CARROT:'carrot',
  CARTONOF_MILK:'cartonofmilk',
  CASCADE:'cascade',
  CASTLE_MARSBERG:'castlemarsberg',
  CAT_CHIME:'catchime',
  CAT_EARS:'catears',
  CAT_PANTS:'catpants',
  CAT_SHIRT:'catshirt',
  CAT_SWORD:'catsword',
  CATACOMB:'catacomb',
  CATALYST_BAND:'catalystband',
  CATFISH:'catfish',
  CAULDRON:'cauldron',
  CAVE_DIRT_WALL:'cavedirtwall',
  CAVERN_PYLON:'cavernpylon',
  CAVERN_WATER_FOUNTAIN:'cavernwaterfountain',
  CELESTIAL_MAGNET:'celestialmagnet',
  CELESTIAL_STARBOARD:'celestialstarboard',
  CELESTIAL_WAND:'celestialwand',
  CENXS_BREASTPLATE:'cenxsbreastplate',
  CENXS_DRESS:'cenxsdress',
  CENXS_DRESS_PANTS:'cenxsdresspants',
  CENXS_LEGGINGS:'cenxsleggings',
  CENXS_TIARA:'cenxstiara',
  CENXS_WINGS:'cenxswings',
  CHAIN_KNIFE:'chainknife',
  CHALICE:'chalice',
  CHAOS_CYLINDER:'chaoscylinder',
  CHAOS_CYLINDER_FULL:'chaoscylinderfull',
  CHAOS_CYLINDER_RANDOM:'chaoscylinderrandom',
  CHAOS_CYLINDER_SIMPLE:'chaoscylindersimple',
  CHAOS_FISH:'chaosfish',
  CHEESY_PIZZA_POSTER:'cheesypizzaposter',
  CHEF_HAT:'chefhat',
  CHEF_PANTS:'chefpants',
  CHEF_UNIFORM:'chefuniform',
  CHERRY:'cherry',
  CHEST_LOCK:'chestlock',
  CHICKEN_BONES_PANTS:'chickenbonespants',
  CHICKEN_BONES_ROBE:'chickenbonesrobe',
  CHICKEN_BONES_VEST:'chickenbonesvest',
  CHICKEN_BONES_VISOR:'chickenbonesvisor',
  CHICKEN_BONES_WINGS:'chickenboneswings',
  CHICKEN_CHARM:'chickencharm',
  CHICKEN_NUGGET:'chickennugget',
  CHIK:'chik',
  CHILLET:'chillet',
  CHILLET_IGNIS:'chilletignis',
  CHIMNEY:'chimney',
  CHIPPYS_CHESTPLATE:'chippyschestplate',
  CHIPPYS_CLOAK:'chippyscloak',
  CHIPPYS_CLOAK_INACTIVE:'chippyscloakinactive',
  CHIPPYS_COUCH:'chippyscouch',
  CHIPPYS_GREAVES:'chippysgreaves',
  CHIPPYS_HEADBAND:'chippysheadband',
  CHIPPYS_HELMET:'chippyshelmet',
  CHLOROPHYTE_BRICK:'chlorophytebrick',
  CHLOROPHYTE_BRICK_WALL:'chlorophytebrickwall',
  CHLOROPHYTE_CHAINSAW:'chlorophytechainsaw',
  CHLOROPHYTE_CLAYMORE:'chlorophyteclaymore',
  CHLOROPHYTE_DRILL:'chlorophytedrill',
  CHLOROPHYTE_DYE:'chlorophytedye',
  CHLOROPHYTE_EXTRACTINATOR:'chlorophyteextractinator',
  CHLOROPHYTE_PLATE_MAIL:'chlorophyteplatemail',
  CHLOROPHYTE_VISOR:'chlorophytevisor',
  CHOCOLATE_CHIP_COOKIE:'chocolatechipcookie',
  CHRISTMAS_PUDDING:'christmaspudding',
  CHRISTMAS_TREE:'christmastree',
  CHROMATIC_CLOAK:'chromaticcloak',
  CHUM_BUCKET:'chumbucket',
  CINDER_WALL:'cinderwall',
  CLASSIC_ROLLER_SKATES:'classicrollerskates',
  CLAY_BLOCK:'clayblock',
  CLENTAMINATOR:'clentaminator',
  CLOSED_VOID_BAG:'closedvoidbag',
  CLOTHIERS_JACKET:'clothiersjacket',
  CLOTHIERS_PANTS:'clothierspants',
  CLOUDINA_BALLOON:'cloudinaballoon',
  CLOUDFISH:'cloudfish',
  CLOWN_HAT:'clownhat',
  CLOWN_PANTS:'clownpants',
  CLOWN_SHIRT:'clownshirt',
  CLOWNFISH:'clownfish',
  COAL:'coal',
  COBALT_BRICK:'cobaltbrick',
  COBALT_BRICK_WALL:'cobaltbrickwall',
  COBALT_CHAINSAW:'cobaltchainsaw',
  COBALT_DRILL:'cobaltdrill',
  COBALT_HAT:'cobalthat',
  COBALT_NAGINATA:'cobaltnaginata',
  COCONUT:'coconut',
  CODE1:'code1',
  CODE2:'code2',
  COFFEE:'coffee',
  COFFIN_MINECART:'coffinminecart',
  COG:'cog',
  COG_WALL:'cogwall',
  COIN_RING:'coinring',
  COLD_SNAP:'coldsnap',
  COLD_WATERSINTHE_WHITE_LAND:'coldwatersinthewhiteland',
  COMBAT_WRENCH:'combatwrench',
  COMPANION_CUBE:'companioncube',
  COMPASS_ROSE:'compassrose',
  CONFETTI:'confetti',
  CONFETTI_BLOCK:'confettiblock',
  CONFETTI_CANNON:'confetticannon',
  CONFETTI_GUN:'confettigun',
  CONFETTI_WALL:'confettiwall',
  CONSTELLATION:'constellation',
  COOKED_MARSHMALLOW:'cookedmarshmallow',
  COOKED_SHRIMP:'cookedshrimp',
  COOKING_POT:'cookingpot',
  COPPER_BRICK:'copperbrick',
  COPPER_PLATING_WALL:'copperplatingwall',
  COPPER_WATCH:'copperwatch',
  CORAL:'coral',
  CORAL_CAMPFIRE:'coralcampfire',
  CORALSTONE_BLOCK:'coralstoneblock',
  CORRUPT_CAMPFIRE:'corruptcampfire',
  CORRUPT_CRATE:'corruptcrate',
  CORRUPT_GRASS_WALL:'corruptgrasswall',
  CORRUPT_GROWTH_WALL:'corruptgrowthwall',
  CORRUPT_MASS_WALL:'corruptmasswall',
  CORRUPT_PUSTULE_WALL:'corruptpustulewall',
  CORRUPT_TENDRIL_WALL:'corrupttendrilwall',
  CORRUPT_WATER_FOUNTAIN:'corruptwaterfountain',
  CORRUPTION_KEY:'corruptionkey',
  CORRUPTION_KEY_MOLD:'corruptionkeymold',
  COSMIC_EMBER_BRICK:'cosmicemberbrick',
  COSMIC_EMBER_BRICK_WALL:'cosmicemberbrickwall',
  COSMIC_SKATEBOARD:'cosmicskateboard',
  COUCH_GAG:'couchgag',
  COUNTERCURSE_MANTRA:'countercursemantra',
  COUNTRY_CLUB_CAP:'countryclubcap',
  COUNTRY_CLUB_TROUSERS:'countryclubtrousers',
  COUNTRY_CLUB_VEST:'countryclubvest',
  COUNTRY_CLUB_VISOR:'countryclubvisor',
  COW_BELL:'cowbell',
  COWBOY_HAT:'cowboyhat',
  COWBOY_JACKET:'cowboyjacket',
  COWBOY_PANTS:'cowboypants',
  COZY_WINDOW:'cozywindow',
  CRACKED_BLUE_BRICK:'crackedbluebrick',
  CRACKED_DIRT_WALL:'crackeddirtwall',
  CRACKED_GREEN_BRICK:'crackedgreenbrick',
  CRACKED_PINK_BRICK:'crackedpinkbrick',
  CRAGGY_STONE_WALL:'craggystonewall',
  CREAM_SODA:'creamsoda',
  CREEPER_EGG:'creeperegg',
  CREEPER_PANTS:'creeperpants',
  CREEPER_SHIRT:'creepershirt',
  CRESCENT_WALL:'crescentwall',
  CRIMSAND_BLOCK:'crimsandblock',
  CRIMSANDSTONE_BLOCK:'crimsandstoneblock',
  CRIMSANDSTONE_WALL:'crimsandstonewall',
  CRIMSON_ALTAR:'crimsonaltar',
  CRIMSON_BLISTER_WALL:'crimsonblisterwall',
  CRIMSON_CAMPFIRE:'crimsoncampfire',
  CRIMSON_CLOAK:'crimsoncloak',
  CRIMSON_CRATE:'crimsoncrate',
  CRIMSON_CRUST_WALL:'crimsoncrustwall',
  CRIMSON_GRASS_WALL:'crimsongrasswall',
  CRIMSON_HEART:'crimsonheart',
  CRIMSON_KEY:'crimsonkey',
  CRIMSON_KEY_MOLD:'crimsonkeymold',
  CRIMSON_SCAB_WALL:'crimsonscabwall',
  CRIMSON_SEEDS:'crimsonseeds',
  CRIMSON_TEETH_WALL:'crimsonteethwall',
  CRIMSON_WATER_FOUNTAIN:'crimsonwaterfountain',
  CRIMSTONE_BRICK:'crimstonebrick',
  CRIMSTONE_BRICK_WALL:'crimstonebrickwall',
  CRIMSTONE_WALL:'crimstonewall',
  CRIMTANE_BRICK:'crimtanebrick',
  CRIMTANE_BRICK_WALL:'crimtanebrickwall',
  CRISPY_HONEY_BLOCK:'crispyhoneyblock',
  CRITTER_SHAMPOO:'crittershampoo',
  CROSS_GRAVE_MARKER:'crossgravemarker',
  CROSSED_HEART_NECKLACE:'crossedheartnecklace',
  CROWS_BEAK:'crowsbeak',
  CROWNO_DEVOURS_HIS_LUNCH:'crownodevourshislunch',
  CROWNOS_BREASTPLATE:'crownosbreastplate',
  CROWNOS_LEGGINGS:'crownosleggings',
  CROWNOS_WINGS:'crownoswings',
  CRUMBLING_DIRT_WALL:'crumblingdirtwall',
  CRUSTOGRAPHY:'crustography',
  CRYOCORE_BRICK:'cryocorebrick',
  CRYOCORE_BRICK_WALL:'cryocorebrickwall',
  CRYSTAL_ASSASSIN_HOOD:'crystalassassinhood',
  CRYSTAL_ASSASSIN_PANTS:'crystalassassinpants',
  CRYSTAL_ASSASSIN_SHIRT:'crystalassassinshirt',
  CRYSTAL_BALL:'crystalball',
  CRYSTAL_BLOCK:'crystalblock',
  CRYSTAL_BLOCK_WALL:'crystalblockwall',
  CRYSTALLIZE:'crystallize',
  CURSED_BLUE_BRICK_WALL:'cursedbluebrickwall',
  CURSED_BLUE_SLAB_WALL:'cursedblueslabwall',
  CURSED_BLUE_TILED_WALL:'cursedbluetiledwall',
  CURSED_CAMPFIRE:'cursedcampfire',
  CURSED_FLAME:'cursedflame',
  CURSED_GREEN_BRICK_WALL:'cursedgreenbrickwall',
  CURSED_GREEN_SLAB_WALL:'cursedgreenslabwall',
  CURSED_GREEN_TILED_WALL:'cursedgreentiledwall',
  CURSED_PINK_BRICK_WALL:'cursedpinkbrickwall',
  CURSED_PINK_SLAB_WALL:'cursedpinkslabwall',
  CURSED_PINK_TILED_WALL:'cursedpinktiledwall',
  CURSED_PIPER_FLUTE:'cursedpiperflute',
  CURSED_SAINT:'cursedsaint',
  CURSED_SAPLING:'cursedsapling',
  CURSEDFISH:'cursedfish',
  CYAN_GOLF_BALL:'cyangolfball',
  CYAN_GRADIENT_DYE:'cyangradientdye',
  CYAN_PAINT:'cyanpaint',
  CYAN_STRING:'cyanstring',
  CYAN_WEIGHTED_PRESSURE_PLATE:'cyanweightedpressureplate',
  CYANAND_BLACK_DYE:'cyanandblackdye',
  CYANAND_SILVER_DYE:'cyanandsilverdye',
  CYBORG_HELMET:'cyborghelmet',
  CYBORG_PANTS:'cyborgpants',
  CYBORG_SHIRT:'cyborgshirt',
  D_TOWNS_BREASTPLATE:'dtownsbreastplate',
  D_TOWNS_HELMET:'dtownshelmet',
  D_TOWNS_LEGGINGS:'dtownsleggings',
  D_TOWNS_WINGS:'dtownswings',
  DAMAGE_BOOSTER:'damagebooster',
  DAMSELFISH:'damselfish',
  DANGERSENSE_POTION:'dangersensepotion',
  DARK_ARTISTS_HAT:'darkartistshat',
  DARK_ARTISTS_LEGGINGS:'darkartistsleggings',
  DARK_ARTISTS_ROBES:'darkartistsrobes',
  DARK_BLUE_SOLUTION:'darkbluesolution',
  DARK_CELESTIAL_BRICK:'darkcelestialbrick',
  DARK_CELESTIAL_BRICK_WALL:'darkcelestialbrickwall',
  DARK_FOREBODINGS:'darkforebodings',
  DARK_MAGES_TOME:'darkmagestome',
  DARK_SHARD:'darkshard',
  DARK_SIDEOFTHE_HALLOW:'darksideofthehallow',
  DARK_SOUL_REAPER:'darksoulreaper',
  DARKNESS:'darkness',
  DART_TRAP:'darttrap',
  DAYBLOOM_PLANTER_BOX:'daybloomplanterbox',
  DAYBLOOM_SEEDS:'daybloomseeds',
  DAYBREAK:'daybreak',
  DAYLIGHT:'daylight',
  DEACTIVATED_PROBE:'deactivatedprobe',
  DEAD_MANS_SWEATER:'deadmanssweater',
  DEADLAND_COMES_ALIVE:'deadlandcomesalive',
  DEATHWEED:'deathweed',
  DEATHWEED_PLANTER_BOX:'deathweedplanterbox',
  DEATHWEED_SEEDS:'deathweedseeds',
  DECAY_CHAMBER:'decaychamber',
  DECORATIVE_COBWEB:'decorativecobweb',
  DECORATIVE_HEALING_POTION:'decorativehealingpotion',
  DECORATIVE_MANA_POTION:'decorativemanapotion',
  DEEP_BLUE_PAINT:'deepbluepaint',
  DEEP_CYAN_PAINT:'deepcyanpaint',
  DEEP_GREEN_PAINT:'deepgreenpaint',
  DEEP_LIME_PAINT:'deeplimepaint',
  DEEP_ORANGE_PAINT:'deeporangepaint',
  DEEP_PINK_PAINT:'deeppinkpaint',
  DEEP_PURPLE_PAINT:'deeppurplepaint',
  DEEP_RED_PAINT:'deepredpaint',
  DEEP_SKY_BLUE_PAINT:'deepskybluepaint',
  DEEP_TEAL_PAINT:'deeptealpaint',
  DEEP_VIOLET_PAINT:'deepvioletpaint',
  DEEP_YELLOW_PAINT:'deepyellowpaint',
  DEERCLOPS_EYEBALL:'deerclopseyeball',
  DEFENDER_MEDAL:'defendermedal',
  DEFENDERS_FORGE:'defendersforge',
  DEFILED_CRATE:'defiledcrate',
  DEMON_ALTAR:'demonaltar',
  DEMON_CAMPFIRE:'demoncampfire',
  DEMON_CONCH:'demonconch',
  DEMON_HEART:'demonheart',
  DEMON_HORNS:'demonhorns',
  DEMONS_EYE:'demonseye',
  DEMONIC_HELLCART:'demonichellcart',
  DEMONIC_HELLFISH:'demonichellfish',
  DEMONITE_BRICK:'demonitebrick',
  DEMONITE_BRICK_WALL:'demonitebrickwall',
  DEPTH_HAIR_DYE:'depthhairdye',
  DERPFISH:'derpfish',
  DESERT_CAMPFIRE:'desertcampfire',
  DESERT_FOSSIL_WALL:'desertfossilwall',
  DESERT_KEY:'desertkey',
  DESERT_MINECART:'desertminecart',
  DESERT_WATER_FOUNTAIN:'desertwaterfountain',
  DETONATOR:'detonator',
  DEVIL_HORNS:'devilhorns',
  DIABOLIC_SIGIL:'diabolicsigil',
  DIAMOND_BUNNY:'diamondbunny',
  DIAMOND_BUNNY_CAGE:'diamondbunnycage',
  DIAMOND_GEM_LOCK:'diamondgemlock',
  DIAMOND_GEMCORN:'diamondgemcorn',
  DIAMOND_GEMSPARK_BLOCK:'diamondgemsparkblock',
  DIAMOND_GEMSPARK_WALL:'diamondgemsparkwall',
  DIAMOND_HOOK:'diamondhook',
  DIAMOND_MINECART:'diamondminecart',
  DIAMOND_RING:'diamondring',
  DIAMOND_ROBE:'diamondrobe',
  DIAMOND_SQUIRREL:'diamondsquirrel',
  DIAMOND_SQUIRREL_CAGE:'diamondsquirrelcage',
  DIAMOND_STONE_BLOCK:'diamondstoneblock',
  DIAMOND_STONE_WALL:'diamondstonewall',
  DIGGING_MOLECART:'diggingmolecart',
  DIGTOISE:'digtoise',
  DIRT_BLOCK:'dirtblock',
  DIRT_BOMB:'dirtbomb',
  DIRT_ROD:'dirtrod',
  DIRT_WALL:'dirtwall',
  DIRTFISH:'dirtfish',
  DISCO_BALL:'discoball',
  DISCOVER:'discover',
  DIVINE_CRATE:'divinecrate',
  DIVINE_EYE:'divineeye',
  DIVING_GEAR:'divinggear',
  DIVING_HELMET:'divinghelmet',
  DIZZYS_RARE_GECKO_CHESTER:'dizzysraregeckochester',
  DJINNS_CURSE:'djinnscurse',
  DO_NOT_EATTHE_VILE_MUSHROOM:'donoteatthevilemushroom',
  DO_NOT_STEPONTHE_GRASS:'donotsteponthegrass',
  DOG_COLLAR:'dogcollar',
  DOG_EARS:'dogears',
  DOG_LICENSE:'doglicense',
  DOG_TAIL:'dogtail',
  DOG_WHISTLE:'dogwhistle',
  DOUBLE_COD:'doublecod',
  DR_MAN_FLYS_LAB_COAT:'drmanflyslabcoat',
  DRAGON_EGG:'dragonegg',
  DRAGON_FRUIT:'dragonfruit',
  DREADOFTHE_RED_SEA:'dreadoftheredsea',
  DRILL_CONTAINMENT_UNIT:'drillcontainmentunit',
  DRUIDIC_SERPENT_CLOAK:'druidicserpentcloak',
  DRUM_SET:'drumset',
  DRUMSTICK:'drumstick',
  DRY_BOMB:'drybomb',
  DRYAD_COVERINGS:'dryadcoverings',
  DRYAD_LOINCLOTH:'dryadloincloth',
  DRYADISQUE:'dryadisque',
  DUALITY:'duality',
  DUCK:'duck',
  DUCK_CAGE:'duckcage',
  DULL_BLUE_TEAM_BLOCK:'dullblueteamblock',
  DULL_GREEN_TEAM_BLOCK:'dullgreenteamblock',
  DULL_PINK_TEAM_BLOCK:'dullpinkteamblock',
  DULL_RED_TEAM_BLOCK:'dullredteamblock',
  DULL_WHITE_TEAM_BLOCK:'dullwhiteteamblock',
  DULL_YELLOW_TEAM_BLOCK:'dullyellowteamblock',
  DUNERIDER_BOOTS:'duneriderboots',
  DUNGEON_CRATE:'dungeoncrate',
  DUNGEON_SHELF:'dungeonshelf',
  DUSTY_RAWHIDE_SADDLE:'dustyrawhidesaddle',
  DYE_TRADER_ROBE:'dyetraderrobe',
  DYE_TRADERS_TURBAN:'dyetradersturban',
  DYE_VAT:'dyevat',
  DYNAMITE:'dynamite',
  DYNAMITE_FISH:'dynamitefish',
  DYNASTY_BOWL:'dynastybowl',
  DYNASTY_CUP:'dynastycup',
  DYNASTY_WOOD:'dynastywood',
  EASTER_BLOCK:'easterblock',
  EASTER_WALL:'easterwall',
  EATER_OF_LIFE:'eateroflife',
  EATEROF_PLANKTON:'eaterofplankton',
  EATERS_BONE:'eatersbone',
  EBONSAND_BLOCK:'ebonsandblock',
  EBONSANDSTONE_BLOCK:'ebonsandstoneblock',
  EBONSANDSTONE_WALL:'ebonsandstonewall',
  EBONSTONE_BRICK:'ebonstonebrick',
  EBONSTONE_BRICK_WALL:'ebonstonebrickwall',
  EBONSTONE_WALL:'ebonstonewall',
  EBONWOOD:'ebonwood',
  EBONWOOD_BREASTPLATE:'ebonwoodbreastplate',
  EBONWOOD_FENCE:'ebonwoodfence',
  EBONWOOD_GREAVES:'ebonwoodgreaves',
  EBONWOOD_HELMET:'ebonwoodhelmet',
  ECHO_BLOCK:'echoblock',
  ECHO_CHAMBER:'echochamber',
  ECHO_COATING:'echocoating',
  ECHO_WALL:'echowall',
  ELDERBERRY:'elderberry',
  ELF_HAT:'elfhat',
  ELF_PANTS:'elfpants',
  ELF_SHIRT:'elfshirt',
  EMBER_WALL:'emberwall',
  EMERALD_BUNNY:'emeraldbunny',
  EMERALD_BUNNY_CAGE:'emeraldbunnycage',
  EMERALD_GEM_LOCK:'emeraldgemlock',
  EMERALD_GEMCORN:'emeraldgemcorn',
  EMERALD_GEMSPARK_BLOCK:'emeraldgemsparkblock',
  EMERALD_GEMSPARK_WALL:'emeraldgemsparkwall',
  EMERALD_HOOK:'emeraldhook',
  EMERALD_MINECART:'emeraldminecart',
  EMERALD_ROBE:'emeraldrobe',
  EMERALD_SQUIRREL:'emeraldsquirrel',
  EMERALD_SQUIRREL_CAGE:'emeraldsquirrelcage',
  EMERALD_STONE_BLOCK:'emeraldstoneblock',
  EMERALD_STONE_WALL:'emeraldstonewall',
  EMPRESS_WINGS:'empresswings',
  EMPTY_BUCKET:'emptybucket',
  EMPTY_BULLET:'emptybullet',
  EMPTY_DROPPER:'emptydropper',
  ENCHANTED_BOOMERANG:'enchantedboomerang',
  ENCHANTED_MOONDIAL:'enchantedmoondial',
  ENCHANTED_NIGHTCRAWLER_CAGE:'enchantednightcrawlercage',
  ENCHANTED_PIXIE_DUST:'enchantedpixiedust',
  ENCHANTED_SUNDIAL:'enchantedsundial',
  ENCHANTED_TIMER:'enchantedtimer',
  ENCUMBERING_STONE:'encumberingstone',
  ENGINEERING_HELMET:'engineeringhelmet',
  ESCARGOT:'escargot',
  ETERNIA_CRYSTAL:'eterniacrystal',
  ETERNIA_CRYSTAL_STAND:'eterniacrystalstand',
  ETHERIAN_MANA:'etherianmana',
  EUCALYPTUS_SAP:'eucalyptussap',
  EVIL_PRESENCE:'evilpresence',
  EXOTIC_CHEW_TOY:'exoticchewtoy',
  EXPLOSIVE_BUNNY:'explosivebunny',
  EXPLOSIVE_POWDER:'explosivepowder',
  EXPLOSIVES:'explosives',
  EXTENDO_GRIP:'extendogrip',
  EXTRACTINATOR:'extractinator',
  EYE_PATCH:'eyepatch',
  EYEOFTHE_GOLEM:'eyeofthegolem',
  EYEOFTHE_SUN:'eyeofthesun',
  EYEBRELLA:'eyebrella',
  EYEZORHEAD:'eyezorhead',
  F_P_V_GOGGLES:'fpvgoggles',
  FACINGTHE_CEREBRAL_MASTERMIND:'facingthecerebralmastermind',
  FAECORN:'faecorn',
  FAELING:'faeling',
  FAELINGINA_BOTTLE:'faelinginabottle',
  FAIRY_BELL:'fairybell',
  FAIRY_BOOTS:'fairyboots',
  FAIRY_CHOKER:'fairychoker',
  FAIRY_GLOWSTICK:'fairyglowstick',
  FAIRY_GUIDES:'fairyguides',
  FAIRY_WINGS:'fairywings',
  FAKE_UNICORN_HORN:'fakeunicornhorn',
  FALLEN_STAR_BLOCK:'fallenstarblock',
  FALLEN_STAR_WALL:'fallenstarwall',
  FALLEN_STARFISH:'fallenstarfish',
  FALLEN_TUXEDO_PANTS:'fallentuxedopants',
  FALLEN_TUXEDO_SHIRT:'fallentuxedoshirt',
  FAMILIAR_PANTS:'familiarpants',
  FAMILIAR_SHIRT:'familiarshirt',
  FAMILIAR_WIG:'familiarwig',
  FANCY_DISHES:'fancydishes',
  FANCY_GOLF_CLUB_DRIVER:'fancygolfclubdriver',
  FANCY_GOLF_CLUB_IRON:'fancygolfclubiron',
  FANCY_GOLF_CLUB_PUTTER:'fancygolfclubputter',
  FANCY_GOLF_CLUB_WEDGE:'fancygolfclubwedge',
  FANGS:'fangs',
  FART_KART:'fartkart',
  FARTINA_BALLOON:'fartinaballoon',
  FAST_CLOCK:'fastclock',
  FATHEROF_SOMEONE:'fatherofsomeone',
  FEDORA:'fedora',
  FERTILIZER:'fertilizer',
  FESTIVE_WINGS:'festivewings',
  FEYWOOD:'feywood',
  FEYWOOD_WALL:'feywoodwall',
  FEZ:'fez',
  FILM_PROJECTOR:'filmprojector',
  FIN_WINGS:'finwings',
  FINDING_GOLD:'findinggold',
  FIREBLOSSOM:'fireblossom',
  FIREBLOSSOM_PLANTER_BOX:'fireblossomplanterbox',
  FIREBLOSSOM_SEEDS:'fireblossomseeds',
  FIREFLY:'firefly',
  FIREFLYINA_BOTTLE:'fireflyinabottle',
  FIREPLACE:'fireplace',
  FIRESTARTERS_SKIRT:'firestartersskirt',
  FIRESTARTERS_SWEATER:'firestarterssweater',
  FIREWORK_FOUNTAIN:'fireworkfountain',
  FIREWORKS_BOX:'fireworksbox',
  FIRST_ENCOUNTER:'firstencounter',
  FISH:'fish',
  FISH_BOWL:'fishbowl',
  FISH_COSTUME_FINSKIRT:'fishcostumefinskirt',
  FISH_COSTUME_SHIRT:'fishcostumeshirt',
  FISH_HOOK:'fishhook',
  FISHEROF_SOULS:'fisherofsouls',
  FISHERMANS_POCKET_GUIDE:'fishermanspocketguide',
  FISHING_BOBBER:'fishingbobber',
  FISHOTRON:'fishotron',
  FISHRON:'fishron',
  FLAIROON:'flairoon',
  FLAMARANG:'flamarang',
  FLAME_DYE:'flamedye',
  FLAME_TRAP:'flametrap',
  FLAME_WAKER_BOOTS:'flamewakerboots',
  FLAMEAND_BLACK_DYE:'flameandblackdye',
  FLAMEAND_SILVER_DYE:'flameandsilverdye',
  FLAMING_MACE:'flamingmace',
  FLARE_GUN:'flaregun',
  FLAREFIN_KOI:'flarefinkoi',
  FLASKOF_CURSED_FLAMES:'flaskofcursedflames',
  FLASKOF_FIRE:'flaskoffire',
  FLASKOF_GOLD:'flaskofgold',
  FLASKOF_ICHOR:'flaskofichor',
  FLASKOF_NANITES:'flaskofnanites',
  FLASKOF_PARTY:'flaskofparty',
  FLASKOF_POISON:'flaskofpoison',
  FLASKOF_VENOM:'flaskofvenom',
  FLEDGLING_WINGS:'fledglingwings',
  FLESH_BLOCK_WALL:'fleshblockwall',
  FLESH_CLONING_VAT:'fleshcloningvat',
  FLESHCATCHER:'fleshcatcher',
  FLINT:'flint',
  FLINX_FUR_BLOCK:'flinxfurblock',
  FLINX_FUR_COAT:'flinxfurcoat',
  FLINX_FUR_WALL:'flinxfurwall',
  FLIPPER:'flipper',
  FLORET_PROTECTOR_HELMET:'floretprotectorhelmet',
  FLORET_PROTECTOR_PANTS:'floretprotectorpants',
  FLORET_PROTECTOR_SHIRT:'floretprotectorshirt',
  FLOWER_BOOTS:'flowerboots',
  FLOWER_POW:'flowerpow',
  FLOWER_WALL:'flowerwall',
  FLOWING_MAGMA:'flowingmagma',
  FLURRY_BOOTS:'flurryboots',
  FOG_MACHINE:'fogmachine',
  FOGBOUND_DYE:'fogbounddye',
  FOOD_BARBARIANS_HORNED_HELM:'foodbarbarianshornedhelm',
  FOOD_BARBARIANS_SAVAGE_GREAVES:'foodbarbarianssavagegreaves',
  FOOD_BARBARIANS_TATTERED_DRAGON_WINGS:'foodbarbarianstattereddragonwings',
  FOOD_BARBARIANS_WILD_WOLF_SPAULDERS:'foodbarbarianswildwolfspaulders',
  FOOTBALL:'football',
  FORBIDDEN_BLOCK:'forbiddenblock',
  FORBIDDEN_LIHZAHRD_BRICK_WALL:'forbiddenlihzahrdbrickwall',
  FORBIDDEN_ROBES:'forbiddenrobes',
  FORBIDDEN_WALL:'forbiddenwall',
  FORE:'fore',
  FOREST_TROLL:'foresttroll',
  FORMAT_C:'formatc',
  FOX_EARS:'foxears',
  FOX_PANTS:'foxpants',
  FOX_SHIRT:'foxshirt',
  FOX_TAIL:'foxtail',
  FRACTURED_STONE_WALL:'fracturedstonewall',
  FREEZE_BOMB:'freezebomb',
  FRIED_EGG:'friedegg',
  FRIENDLY_BOULDER:'friendlyboulder',
  FRIENDLY_RAINBOW_BOULDER:'friendlyrainbowboulder',
  FRIES:'fries',
  FROG:'frog',
  FROG_CAGE:'frogcage',
  FROG_FLIPPER:'frogflipper',
  FROG_GEAR:'froggear',
  FROGGLE_BUNWICH:'frogglebunwich',
  FROGGY_NECKBAND:'froggyneckband',
  FROST_MINNOW:'frostminnow',
  FROZEN_BANANA_DAIQUIRI:'frozenbananadaiquiri',
  FROZEN_CAMPFIRE:'frozencampfire',
  FROZEN_CRATE:'frozencrate',
  FROZEN_CROWN:'frozencrown',
  FROZEN_KEY:'frozenkey',
  FROZEN_KEY_MOLD:'frozenkeymold',
  FROZEN_SHIELD:'frozenshield',
  FROZEN_SLIME_BLOCK:'frozenslimeblock',
  FROZEN_WINGS:'frozenwings',
  FRUIT_JUICE:'fruitjuice',
  FRUIT_SALAD:'fruitsalad',
  FRUITCAKE_CHAKRAM:'fruitcakechakram',
  FULL_MOON_SQUEAKY_TOY:'fullmoonsqueakytoy',
  FUNERAL_COAT:'funeralcoat',
  FUNERAL_HAT:'funeralhat',
  FUNERAL_PANTS:'funeralpants',
  FUZZY_CARROT:'fuzzycarrot',
  GALAXY_PEARL:'galaxypearl',
  GANGSTA_HAT:'gangstahat',
  GARDEN_GNOME:'gardengnome',
  GARLAND:'garland',
  GAS_TRAP:'gastrap',
  GATO_EGG:'gatoegg',
  GEL_DYE:'geldye',
  GELATIN_CRYSTAL:'gelatincrystal',
  GELATINOUS_PILLION:'gelatinouspillion',
  GENDER_CHANGE_POTION:'genderchangepotion',
  GENTLEMANS_BEARD:'gentlemansbeard',
  GENTLEMANS_LONG_BEARD:'gentlemanslongbeard',
  GENTLEMANS_MAGNIFICENT_BEARD:'gentlemansmagnificentbeard',
  GENTLEMANS_TROUSERS:'gentlemanstrousers',
  GENTLEMANS_VEST:'gentlemansvest',
  GEODE:'geode',
  GEYSER:'geyser',
  GHASTLY_GLAIVE:'ghastlyglaive',
  GHOST_MANIFESTATION:'ghostmanifestation',
  GHOST_SHIRT:'ghostshirt',
  GHOSTARS_GARB:'ghostarsgarb',
  GHOSTARS_INFINITY_EIGHT:'ghostarsinfinityeight',
  GHOSTARS_SOUL_JAR:'ghostarssouljar',
  GHOSTARS_TIGHTS:'ghostarstights',
  GHOSTLY_STINKBUG_BLOCKER:'ghostlystinkbugblocker',
  GHOULDER:'ghoulder',
  GI:'gi',
  GIANT_BOW:'giantbow',
  GIANT_HARPY_FEATHER:'giantharpyfeather',
  GIANT_TIKI:'gianttiki',
  GINGER_BEARD:'gingerbeard',
  GINGERBREAD_COOKIE:'gingerbreadcookie',
  GLADIUS:'gladius',
  GLASS_BOWL:'glassbowl',
  GLASS_KILN:'glasskiln',
  GLASS_SLIPPER:'glassslipper',
  GLOMMERS_FLOWER:'glommersflower',
  GLORIOUS_NIGHT:'gloriousnight',
  GLORYOFTHE_FIRE:'gloryofthefire',
  GLOW_TULIP:'glowtulip',
  GLOWING_FISHING_BOBBER:'glowingfishingbobber',
  GLOWING_MUSHROOM:'glowingmushroom',
  GLOWING_SNAIL:'glowingsnail',
  GLOWING_SNAIL_CAGE:'glowingsnailcage',
  GLOWSTICK:'glowstick',
  GOAT_SKULL:'goatskull',
  GOATS_TUFT:'goatstuft',
  GOBLIN_TECH:'goblintech',
  GOBLINS_PLAYING_POKER:'goblinsplayingpoker',
  GOBLORC_EARS:'goblorcears',
  GOGGLES:'goggles',
  GOLD_BIRD:'goldbird',
  GOLD_BIRD_CAGE:'goldbirdcage',
  GOLD_BRICK:'goldbrick',
  GOLD_BUNNY:'goldbunny',
  GOLD_BUNNY_CAGE:'goldbunnycage',
  GOLD_BUTTERFLY:'goldbutterfly',
  GOLD_BUTTERFLY_JAR:'goldbutterflyjar',
  GOLD_CROWN:'goldcrown',
  GOLD_DRAGONFLY:'golddragonfly',
  GOLD_DRAGONFLY_JAR:'golddragonflyjar',
  GOLD_DUST:'golddust',
  GOLD_FISH_BOWL:'goldfishbowl',
  GOLD_FROG:'goldfrog',
  GOLD_FROG_CAGE:'goldfrogcage',
  GOLD_GOLDFISH:'goldgoldfish',
  GOLD_GRASSHOPPER:'goldgrasshopper',
  GOLD_GRASSHOPPER_CAGE:'goldgrasshoppercage',
  GOLD_LADYBUG:'goldladybug',
  GOLD_LADYBUG_CAGE:'goldladybugcage',
  GOLD_MOUSE:'goldmouse',
  GOLD_MOUSE_CAGE:'goldmousecage',
  GOLD_SEAHORSE:'goldseahorse',
  GOLD_SEAHORSE_CAGE:'goldseahorsecage',
  GOLD_SHORTSWORD:'goldshortsword',
  GOLD_SQUIRREL:'goldsquirrel',
  GOLD_SQUIRREL_CAGE:'goldsquirrelcage',
  GOLD_STARRY_BLOCK:'goldstarryblock',
  GOLD_STARRY_WALL:'goldstarrywall',
  GOLD_WATCH:'goldwatch',
  GOLD_WATER_STRIDER:'goldwaterstrider',
  GOLD_WATER_STRIDER_CAGE:'goldwaterstridercage',
  GOLD_WORM:'goldworm',
  GOLD_WORM_CAGE:'goldwormcage',
  GOLDEN_BUG_NET:'goldenbugnet',
  GOLDEN_CARP:'goldencarp',
  GOLDEN_CROSS_GRAVE_MARKER:'goldencrossgravemarker',
  GOLDEN_DELIGHT:'goldendelight',
  GOLDEN_GRAVE_MARKER:'goldengravemarker',
  GOLDEN_GRAVESTONE:'goldengravestone',
  GOLDEN_HEADSTONE:'goldenheadstone',
  GOLDEN_LOCK_BOX:'goldenlockbox',
  GOLDEN_TOMBSTONE:'goldentombstone',
  GOLDFISH:'goldfish',
  GOLEM_FIST:'golemfist',
  GOLF_BALL:'golfball',
  GOLF_CART_KEYS:'golfcartkeys',
  GOLF_CLUB_DRIVER:'golfclubdriver',
  GOLF_CLUB_IRON:'golfclubiron',
  GOLF_CLUB_PUTTER:'golfclubputter',
  GOLF_CLUB_WEDGE:'golfclubwedge',
  GOLF_CUP:'golfcup',
  GOLF_TEE:'golftee',
  GOLF_WHISTLE:'golfwhistle',
  GOOD_MORNING:'goodmorning',
  GOODIE_BAG:'goodiebag',
  GOTHIC_BRICK:'gothicbrick',
  GOTHIC_BRICK_WALL:'gothicbrickwall',
  GRANITE_COLUMN:'granitecolumn',
  GRAPE_JUICE:'grapejuice',
  GRAPEFRUIT:'grapefruit',
  GRAPES:'grapes',
  GRASS_WALL:'grasswall',
  GRASSHOPPER:'grasshopper',
  GRASSHOPPER_CAGE:'grasshoppercage',
  GRATE:'grate',
  GRAVE_MARKER:'gravemarker',
  GRAVEDIGGER_COAT:'gravediggercoat',
  GRAVEDIGGER_HAT:'gravediggerhat',
  GRAVEDIGGERS_SHOVEL:'gravediggersshovel',
  GRAVESTONE:'gravestone',
  GRAVEYARD:'graveyard',
  GRAVITY_GLOBE:'gravityglobe',
  GRAY_COCKATIEL:'graycockatiel',
  GRAY_COCKATIEL_CAGE:'graycockatielcage',
  GRAY_PAINT:'graypaint',
  GRAY_PRESSURE_PLATE:'graypressureplate',
  GRAY_STUCCO:'graystucco',
  GRAY_STUCCO_WALL:'graystuccowall',
  GRAY_SWIMSHORTS:'grayswimshorts',
  GREAT_WAVE:'greatwave',
  GREATER_LUCK_POTION:'greaterluckpotion',
  GREBE:'grebe',
  GREBE_CAGE:'grebecage',
  GREEDY_RING:'greedyring',
  GREEN_BRICK:'greenbrick',
  GREEN_BULB:'greenbulb',
  GREEN_CANDY_CANE_BLOCK:'greencandycaneblock',
  GREEN_CANDY_CANE_WALL:'greencandycanewall',
  GREEN_CAP:'greencap',
  GREEN_COUNTERWEIGHT:'greencounterweight',
  GREEN_DRAGONFLY:'greendragonfly',
  GREEN_DRAGONFLY_JAR:'greendragonflyjar',
  GREEN_DUNGEON_VASE:'greendungeonvase',
  GREEN_FAIRY:'greenfairy',
  GREEN_FAIRY_JAR:'greenfairyjar',
  GREEN_FLAME_DYE:'greenflamedye',
  GREEN_FLAMEAND_BLACK_DYE:'greenflameandblackdye',
  GREEN_FLAMEAND_SILVER_DYE:'greenflameandsilverdye',
  GREEN_GARLAND:'greengarland',
  GREEN_GOLF_BALL:'greengolfball',
  GREEN_HORSESHOE_BALLOON:'greenhorseshoeballoon',
  GREEN_JELLYFISH:'greenjellyfish',
  GREEN_JELLYFISH_JAR:'greenjellyfishjar',
  GREEN_LIGHT:'greenlight',
  GREEN_LIGHTS:'greenlights',
  GREEN_MOSS:'greenmoss',
  GREEN_MOSSY_WALL:'greenmossywall',
  GREEN_MUSHROOM:'greenmushroom',
  GREEN_PAINT:'greenpaint',
  GREEN_PIN_FLAG:'greenpinflag',
  GREEN_PRESENT:'greenpresent',
  GREEN_PRESSURE_PLATE:'greenpressureplate',
  GREEN_ROCKET:'greenrocket',
  GREEN_ROLLER_SKATES:'greenrollerskates',
  GREEN_SLAB_WALL:'greenslabwall',
  GREEN_SOLUTION:'greensolution',
  GREEN_STAINED_GLASS:'greenstainedglass',
  GREEN_STREAMER:'greenstreamer',
  GREEN_STRING:'greenstring',
  GREEN_STUCCO:'greenstucco',
  GREEN_STUCCO_WALL:'greenstuccowall',
  GREEN_SWIMSHORTS:'greenswimshorts',
  GREEN_TEAM_BLOCK:'greenteamblock',
  GREEN_THREAD:'greenthread',
  GREEN_TILED_WALL:'greentiledwall',
  GREEN_WRENCH:'greenwrench',
  GREENAND_BLACK_DYE:'greenandblackdye',
  GREENAND_SILVER_DYE:'greenandsilverdye',
  GREENAND_WHITE_GARLAND:'greenandwhitegarland',
  GRILLED_SQUIRREL:'grilledsquirrel',
  GRIM_DYE:'grimdye',
  GRIM_OLD_BARB:'grimoldbarb',
  GROX_THE_GREATS_CHESTPLATE:'groxthegreatschestplate',
  GROX_THE_GREATS_GREAVES:'groxthegreatsgreaves',
  GROX_THE_GREATS_HORNED_COWL:'groxthegreatshornedcowl',
  GROX_THE_GREATS_WINGS:'groxthegreatswings',
  GRUB_SOUP:'grubsoup',
  GRUBBY:'grubby',
  GRUBBY_CAGE:'grubbycage',
  GUARDIAN_GOLEM:'guardiangolem',
  GUIDE_PICASSO:'guidepicasso',
  GUIDE_VOODOO_FISH:'guidevoodoofish',
  GUIDETO_CRITTER_COMPANIONSHIP:'guidetocrittercompanionship',
  GUIDETO_CRITTER_COMPANIONSHIP_INACTIVE:'guidetocrittercompanionshipinactive',
  GUIDETO_ENVIRONMENTAL_PRESERVATION:'guidetoenvironmentalpreservation',
  GUIDETO_ENVIRONMENTAL_PRESERVATION_INACTIVE:'guidetoenvironmentalpreservationinactive',
  GUIDETO_OLD_WORLD_PARKOUR:'guidetooldworldparkour',
  GUIDETO_OLD_WORLD_PARKOUR_INACTIVE:'guidetooldworldparkourinactive',
  GUIDETO_PEACEFUL_COEXISTENCE:'guidetopeacefulcoexistence',
  GUIDETO_PEACEFUL_COEXISTENCE_INACTIVE:'guidetopeacefulcoexistenceinactive',
  GUIDETO_PLANT_FIBER_CORDAGE:'guidetoplantfibercordage',
  GUMMY_WORM:'gummyworm',
  HADES_DYE:'hadesdye',
  HAILTOTHE_KING:'hailtotheking',
  HAIR_DYE_REMOVER:'hairdyeremover',
  HALLOWS_EVE:'hallowseve',
  HALLOWED_BRICK:'hallowedbrick',
  HALLOWED_BRICK_WALL:'hallowedbrickwall',
  HALLOWED_CAMPFIRE:'hallowedcampfire',
  HALLOWED_CAVERN_WALL:'hallowedcavernwall',
  HALLOWED_CRATE:'hallowedcrate',
  HALLOWED_CROWN:'hallowedcrown',
  HALLOWED_CRYSTALLINE_WALL:'hallowedcrystallinewall',
  HALLOWED_GRASS_WALL:'hallowedgrasswall',
  HALLOWED_GREAVES:'hallowedgreaves',
  HALLOWED_HOOD:'hallowedhood',
  HALLOWED_JOUSTING_LANCE:'hallowedjoustinglance',
  HALLOWED_KEY:'hallowedkey',
  HALLOWED_KEY_MOLD:'hallowedkeymold',
  HALLOWED_PRISM_WALL:'hallowedprismwall',
  HALLOWED_SEEDS:'hallowedseeds',
  HALLOWED_SHARD_WALL:'hallowedshardwall',
  HALLOWED_WATER_FOUNTAIN:'hallowedwaterfountain',
  HAND_EARTH:'handearth',
  HAND_OF_CREATION:'handofcreation',
  HAND_WARMER:'handwarmer',
  HANGING_BLINKROOT:'hangingblinkroot',
  HANGING_BRAZIER:'hangingbrazier',
  HANGING_CORRUPT_DEATHWEED:'hangingcorruptdeathweed',
  HANGING_CRIMSON_DEATHWEED:'hangingcrimsondeathweed',
  HANGING_DAYBLOOM:'hangingdaybloom',
  HANGING_FIREBLOSSOM:'hangingfireblossom',
  HANGING_MOONGLOW:'hangingmoonglow',
  HANGING_POT:'hangingpot',
  HANGING_SHIVERTHORN:'hangingshiverthorn',
  HANGING_SKELETON:'hangingskeleton',
  HANGING_WATERLEAF:'hangingwaterleaf',
  HAPPY_LITTLE_TREE:'happylittletree',
  HARDENED_CRIMSAND_BLOCK:'hardenedcrimsandblock',
  HARDENED_CRIMSAND_WALL:'hardenedcrimsandwall',
  HARDENED_EBONSAND_BLOCK:'hardenedebonsandblock',
  HARDENED_EBONSAND_WALL:'hardenedebonsandwall',
  HARDENED_PEARLSAND_BLOCK:'hardenedpearlsandblock',
  HARDENED_PEARLSAND_WALL:'hardenedpearlsandwall',
  HARDENED_SAND_BLOCK:'hardenedsandblock',
  HARDENED_SAND_WALL:'hardenedsandwall',
  HARDY_SADDLE:'hardysaddle',
  HARPY_BLOCK:'harpyblock',
  HARPY_CHARM:'harpycharm',
  HARPY_WALL:'harpywall',
  HARPYFISH:'harpyfish',
  HAT_RACK:'hatrack',
  HAY:'hay',
  HAY_WALL:'haywall',
  HEADSTONE:'headstone',
  HEART_HAIRPIN:'hearthairpin',
  HEARTLANDS:'heartlands',
  HEARTREACH_POTION:'heartreachpotion',
  HEAVENFORGE_BRICK:'heavenforgebrick',
  HEAVENFORGE_BRICK_WALL:'heavenforgebrickwall',
  HEAVY_ASSEMBLER:'heavyassembler',
  HEAVY_SLING:'heavysling',
  HELIUM_MOSS:'heliummoss',
  HELIUM_MOSS_BRICK:'heliummossbrick',
  HELIUM_MOSS_BRICK_WALL:'heliummossbrickwall',
  HELIUM_MOSS_FISHING_BOBBER:'heliummossfishingbobber',
  HELL_BUTTERFLY:'hellbutterfly',
  HELL_BUTTERFLY_JAR:'hellbutterflyjar',
  HELLFIRE_TREADS:'hellfiretreads',
  HELLSTONE_CRATE:'hellstonecrate',
  HELMET_RACK:'helmetrack',
  HEMATIC_CRATE:'hematiccrate',
  HEMOPIRANHA:'hemopiranha',
  HERB_BAG:'herbbag',
  HERO_SHIELD:'heroshield',
  HEROS_HAT:'heroshat',
  HEROS_PANTS:'herospants',
  HEROS_SHIRT:'herosshirt',
  HEROES_FROM_ANOTHER_WORLD:'heroesfromanotherworld',
  HEROICIS_COAT:'heroiciscoat',
  HEROICIS_HAT:'heroicishat',
  HEROICIS_PANTS:'heroicispants',
  HEROICIS_WINGS:'heroiciswings',
  HEROICIS_WINGS_INACTIVE:'heroiciswingsinactive',
  HEXXED_BRANCH:'hexxedbranch',
  HI_TEK_SUNGLASSES:'hiteksunglasses',
  HIGH_PITCH:'highpitch',
  HIGH_TEST_FISHING_LINE:'hightestfishingline',
  HIVE_PACK:'hivepack',
  HIVE_WALL:'hivewall',
  HIVE_WAND:'hivewand',
  HIVE_FIVE:'hivefive',
  HOLLY:'holly',
  HOLY_WATER:'holywater',
  HONEY_ABSORBANT_SPONGE:'honeyabsorbantsponge',
  HONEY_BALLOON:'honeyballoon',
  HONEY_BOMB:'honeybomb',
  HONEY_BUCKET:'honeybucket',
  HONEY_COMB:'honeycomb',
  HONEY_CUP:'honeycup',
  HONEY_DISPENSER:'honeydispenser',
  HONEYED_GOGGLES:'honeyedgoggles',
  HONEYFALL_BLOCK:'honeyfallblock',
  HONEYFALL_WALL:'honeyfallwall',
  HOOK:'hook',
  HOOKOF_DISSONANCE:'hookofdissonance',
  HOTDOG:'hotdog',
  HUGE_DRAGON_EGG:'hugedragonegg',
  HUNGERFISH:'hungerfish',
  HUNTER_CLOAK:'huntercloak',
  HUNTRESSS_BUCKLER:'huntresssbuckler',
  HUNTRESSS_JERKIN:'huntresssjerkin',
  HUNTRESSS_PANTS:'huntressspants',
  HUNTRESSS_WIG:'huntressswig',
  ICE_BOOMERANG:'iceboomerang',
  ICE_BRICK:'icebrick',
  ICE_BRICK_WALL:'icebrickwall',
  ICE_CREAM:'icecream',
  ICE_FEATHER:'icefeather',
  ICE_MACHINE:'icemachine',
  ICE_MIRROR:'icemirror',
  ICE_SKATES:'iceskates',
  ICHOR_CAMPFIRE:'ichorcampfire',
  ICHORFISH:'ichorfish',
  ICY_WATER_FOUNTAIN:'icywaterfountain',
  ILLUMINANT_COATING:'illuminantcoating',
  ILLUMINANT_HOOK:'illuminanthook',
  IMBUING_STATION:'imbuingstation',
  IMP_FACE:'impface',
  IMPACT:'impact',
  INACTIVE_STONE_BLOCK:'inactivestoneblock',
  INFECTED_SCABBARDFISH:'infectedscabbardfish',
  INFERNAL_WISP_DYE:'infernalwispdye',
  INFESTED_SPIDER_WALL:'infestedspiderwall',
  INFUSED_FERTILIZER:'infusedfertilizer',
  INLET_PUMP:'inletpump',
  INNER_TUBE:'innertube',
  INTENSE_BLUE_FLAME_DYE:'intenseblueflamedye',
  INTENSE_FLAME_DYE:'intenseflamedye',
  INTENSE_GREEN_FLAME_DYE:'intensegreenflamedye',
  INTENSE_RAINBOW_DYE:'intenserainbowdye',
  INVISIBILITY_POTION:'invisibilitypotion',
  IRIDESCENT_BRICK:'iridescentbrick',
  IRIDESCENT_BRICK_WALL:'iridescentbrickwall',
  IRON_BRICK:'ironbrick',
  IRON_BRICK_WALL:'ironbrickwall',
  IRON_FENCE:'ironfence',
  IRON_SHORTSWORD:'ironshortsword',
  ITS_SCRAGGLIN_TIME:'itsscragglintime',
  ITEM_FLASK:'itemflask',
  ITEM_FRAME:'itemframe',
  IVY:'ivy',
  IVY_STONE_WALL:'ivystonewall',
  JACKELIER:'jackelier',
  JACKING_SKELETRON:'jackingskeletron',
  JAWSOF_DEATH:'jawsofdeath',
  JELLYFISH_BLOCK:'jellyfishblock',
  JELLYFISH_DIVING_GEAR:'jellyfishdivinggear',
  JELLYFISH_NECKLACE:'jellyfishnecklace',
  JELLYFISH_WALL:'jellyfishwall',
  JESTERS_ARROW:'jestersarrow',
  JETPACK:'jetpack',
  JEWELOF_LIGHT:'jeweloflight',
  JEWELFISH:'jewelfish',
  JIMS_BREASTPLATE:'jimsbreastplate',
  JIMS_CAP:'jimscap',
  JIMS_HELMET:'jimshelmet',
  JIMS_LEGGINGS:'jimsleggings',
  JIMS_WINGS:'jimswings',
  JOJA_COLA:'jojacola',
  JOURNEYMAN_BAIT:'journeymanbait',
  JOUSTING_LANCE:'joustinglance',
  JULIA_BUTTERFLY:'juliabutterfly',
  JULIA_BUTTERFLY_JAR:'juliabutterflyjar',
  JUNCTION_BOX:'junctionbox',
  JUNGLE_CAMPFIRE:'junglecampfire',
  JUNGLE_CRATE:'junglecrate',
  JUNGLE_KEY:'junglekey',
  JUNGLE_KEY_MOLD:'junglekeymold',
  JUNGLE_ROSE:'junglerose',
  JUNGLE_TURTLE:'jungleturtle',
  JUNGLE_TURTLE_CAGE:'jungleturtlecage',
  JUNGLE_VINE_WALL:'junglevinewall',
  JUNGLE_WATER_FOUNTAIN:'junglewaterfountain',
  JUNONIA_SHELL:'junoniashell',
  KAGUYA:'kaguya',
  KARATE_TORTOISE_PANTS:'karatetortoisepants',
  KARATE_TORTOISE_SHIRT:'karatetortoiseshirt',
  KARGOHS_SUMMON:'kargohssummon',
  KAZZYMODUS_CHESTPIECE:'kazzymoduschestpiece',
  KAZZYMODUS_HOOD:'kazzymodushood',
  KAZZYMODUS_LEGGINGS:'kazzymodusleggings',
  KAZZYMODUS_WINGS:'kazzymoduswings',
  KEG:'keg',
  KIMONO:'kimono',
  KINSHIP_PEACH:'kinshippeach',
  KRYPTON_MOSS:'kryptonmoss',
  KRYPTON_MOSS_BRICK:'kryptonmossbrick',
  KRYPTON_MOSS_BRICK_WALL:'kryptonmossbrickwall',
  KRYPTON_MOSS_FISHING_BOBBER:'kryptonmossfishingbobber',
  KWAD_RACER_DRONE:'kwadracerdrone',
  LADY_OF_THE_LAKE:'ladyofthelake',
  LADYBUG:'ladybug',
  LADYBUG_CAGE:'ladybugcage',
  LADYBUG_MINECART:'ladybugminecart',
  LAKEOF_FIRE:'lakeoffire',
  LAMIA_TAIL:'lamiatail',
  LAMIA_WRAPS:'lamiawraps',
  LAND:'land',
  LAND_MINE:'landmine',
  LARGE_AMBER:'largeamber',
  LARGE_AMETHYST:'largeamethyst',
  LARGE_BAMBOO:'largebamboo',
  LARGE_BAMBOO_WALL:'largebamboowall',
  LARGE_DIAMOND:'largediamond',
  LARGE_EMERALD:'largeemerald',
  LARGE_RUBY:'largeruby',
  LARGE_SAPPHIRE:'largesapphire',
  LARGE_TOPAZ:'largetopaz',
  LARGE_VOLCANO:'largevolcano',
  LAVA_ABSORBANT_SPONGE:'lavaabsorbantsponge',
  LAVA_BOMB:'lavabomb',
  LAVA_BOULDER:'lavaboulder',
  LAVA_BUCKET:'lavabucket',
  LAVA_CHARM:'lavacharm',
  LAVA_CLOUD:'lavacloud',
  LAVA_MOSS:'lavamoss',
  LAVA_MOSS_BRICK:'lavamossbrick',
  LAVA_MOSS_BRICK_WALL:'lavamossbrickwall',
  LAVA_MOSS_FISHING_BOBBER:'lavamossfishingbobber',
  LAVA_SERPENT_BOWL:'lavaserpentbowl',
  LAVAFALL_BLOCK:'lavafallblock',
  LAVAFLY:'lavafly',
  LAVAFLYINA_BOTTLE:'lavaflyinabottle',
  LAVAPROOF_BUG_NET:'lavaproofbugnet',
  LAVAPROOF_FISHING_HOOK:'lavaprooffishinghook',
  LAVAPROOF_TACKLE_BAG:'lavaprooftacklebag',
  LAWN_FLAMINGO:'lawnflamingo',
  LAWN_MOWER:'lawnmower',
  LAYERED_DIRT_WALL:'layereddirtwall',
  LAZER_BLAZER:'lazerblazer',
  LAZURES_BARRIER_PLATFORM:'lazuresbarrierplatform',
  LAZURES_VALKYRIE_CIRCLET:'lazuresvalkyriecirclet',
  LAZURES_VALKYRIE_CLOAK:'lazuresvalkyriecloak',
  LEAD_BRICK:'leadbrick',
  LEAD_BRICK_WALL:'leadbrickwall',
  LEAD_FENCE:'leadfence',
  LEAD_SHORTSWORD:'leadshortsword',
  LEAF_WAND:'leafwand',
  LEAFY_JUNGLE_WALL:'leafyjunglewall',
  LEINFORS_EXCESSIVE_STYLE:'leinforsexcessivestyle',
  LEINFORS_FANCYPANTS:'leinforsfancypants',
  LEINFORS_HAIR_PROTECTOR:'leinforshairprotector',
  LEINFORS_LUXURY_SHAMPOO:'leinforsluxuryshampoo',
  LEINFORS_PREHENSILE_CLOAK:'leinforsprehensilecloak',
  LEMON:'lemon',
  LEMONADE:'lemonade',
  LEOPARD_SKIN:'leopardskin',
  LEPRECHAUN_HAT:'leprechaunhat',
  LEPRECHAUN_PANTS:'leprechaunpants',
  LEPRECHAUN_SHIRT:'leprechaunshirt',
  LESION_BLOCK_WALL:'lesionblockwall',
  LESSER_LUCK_POTION:'lesserluckpotion',
  LESSER_MANA_POTION:'lessermanapotion',
  LEVER:'lever',
  LIBRARIAN_BLOCK:'librarianblock',
  LIBRARIAN_WALL:'librarianwall',
  LICHEN_STONE_WALL:'lichenstonewall',
  LIFE_ABOVETHE_SAND:'lifeabovethesand',
  LIFE_BOOSTER:'lifebooster',
  LIFE_CRYSTAL:'lifecrystal',
  LIFE_CRYSTAL_BOULDER:'lifecrystalboulder',
  LIFE_HAIR_DYE:'lifehairdye',
  LIFE_PRESERVER:'lifepreserver',
  LIGHT_SHARD:'lightshard',
  LIGHTLESS_CHASMS:'lightlesschasms',
  LIGHTNING_BUG:'lightningbug',
  LIGHTNING_BUGINA_BOTTLE:'lightningbuginabottle',
  LIGHTNING_WHELK_SHELL:'lightningwhelkshell',
  LIHZAHRD_ALTAR:'lihzahrdaltar',
  LIHZAHRD_BRICK_WALL:'lihzahrdbrickwall',
  LIHZAHRD_PRESSURE_PLATE:'lihzahrdpressureplate',
  LILAC_DUSK_DRESS:'lilacduskdress',
  LILAC_DUSK_HAIRCLIP:'lilacduskhairclip',
  LILAC_DUSK_SKIRT:'lilacduskskirt',
  LILITHS_NECKLACE:'lilithsnecklace',
  LIME_DYE:'limedye',
  LIME_GOLF_BALL:'limegolfball',
  LIME_PAINT:'limepaint',
  LIME_STRING:'limestring',
  LIMEAND_BLACK_DYE:'limeandblackdye',
  LIMEAND_SILVER_DYE:'limeandsilverdye',
  LIQUID_SENSOR_ANY:'liquidsensorany',
  LIQUID_SENSOR_HONEY:'liquidsensorhoney',
  LIQUID_SENSOR_LAVA:'liquidsensorlava',
  LIQUID_SENSOR_WATER:'liquidsensorwater',
  LITTLE_KINSHIP_PEACH:'littlekinshippeach',
  LIVING_CURSED_FIRE_BLOCK:'livingcursedfireblock',
  LIVING_DEMON_FIRE_BLOCK:'livingdemonfireblock',
  LIVING_FIRE_BLOCK:'livingfireblock',
  LIVING_FLAME_DYE:'livingflamedye',
  LIVING_FROST_FIRE_BLOCK:'livingfrostfireblock',
  LIVING_GORE:'livinggore',
  LIVING_ICHOR_BLOCK:'livingichorblock',
  LIVING_LEAF_WALL:'livingleafwall',
  LIVING_LOOM:'livingloom',
  LIVING_MAHOGANY_WAND:'livingmahoganywand',
  LIVING_OCEAN_DYE:'livingoceandye',
  LIVING_RAINBOW_DYE:'livingrainbowdye',
  LIVING_ULTRABRIGHT_FIRE_BLOCK:'livingultrabrightfireblock',
  LIVING_WOOD_WAND:'livingwoodwand',
  LIZARD_EARS:'lizardears',
  LIZARD_EGG:'lizardegg',
  LIZARD_KING:'lizardking',
  LIZARD_TAIL:'lizardtail',
  LOBSTER_TAIL:'lobstertail',
  LOGIC_GATE_A_N_D:'logicgateand',
  LOGIC_GATE_N_A_N_D:'logicgatenand',
  LOGIC_GATE_N_O_R:'logicgatenor',
  LOGIC_GATE_O_R:'logicgateor',
  LOGIC_GATE_X_N_O_R:'logicgatexnor',
  LOGIC_GATE_X_O_R:'logicgatexor',
  LOGIC_SENSOR_DAY:'logicsensorday',
  LOGIC_SENSOR_NIGHT:'logicsensornight',
  LOGIC_SENSOR_PLAYER_ABOVE:'logicsensorplayerabove',
  LOKIS_BREASTPLATE:'lokisbreastplate',
  LOKIS_DYE:'lokisdye',
  LOKIS_GREAVES:'lokisgreaves',
  LOKIS_HELMET:'lokishelmet',
  LOKIS_WINGS:'lokiswings',
  LOOM:'loom',
  LOVEISINTHE_TRASH_SLOT:'loveisinthetrashslot',
  LUCK_POTION:'luckpotion',
  LUCKY_CLOVER:'luckyclover',
  LUMINITE_BRICK:'luminitebrick',
  LUMINITE_BRICK_WALL:'luminitebrickwall',
  LUNAS_RUNIC_PIXIE_CLOAK:'lunasrunicpixiecloak',
  LUNAS_RUNIC_PIXIE_HOOD:'lunasrunicpixiehood',
  LUNAS_RUNIC_PIXIE_PANTS:'lunasrunicpixiepants',
  LUNAS_RUNIC_PIXIE_SHIRT:'lunasrunicpixieshirt',
  LUNAS_RUNIC_PIXIE_WINGS:'lunasrunicpixiewings',
  LUNAR_CULTIST_HOOD:'lunarcultisthood',
  LUNAR_CULTIST_ROBE:'lunarcultistrobe',
  LUNAR_RUST_BRICK:'lunarrustbrick',
  LUNAR_RUST_BRICK_WALL:'lunarrustbrickwall',
  MACE:'mace',
  MAGENTA_FLOWER_SEEDS:'magentaflowerseeds',
  MAGGOT:'maggot',
  MAGGOT_CAGE:'maggotcage',
  MAGIC_CONCH:'magicconch',
  MAGIC_HAT:'magichat',
  MAGIC_HONEY_DROPPER:'magichoneydropper',
  MAGIC_LAVA_DROPPER:'magiclavadropper',
  MAGIC_SAND_DROPPER:'magicsanddropper',
  MAGIC_SHIMMER_DROPPER:'magicshimmerdropper',
  MAGIC_STRING:'magicstring',
  MAGIC_WATER_DROPPER:'magicwaterdropper',
  MAGIC_YOYO_BAG:'magicyoyobag',
  MAGILUMINESCENCE:'magiluminescence',
  MAGMA_SKULL:'magmaskull',
  MAGMA_SNAIL:'magmasnail',
  MAGMA_SNAIL_CAGE:'magmasnailcage',
  MAGMA_WALL:'magmawall',
  MAGNET_FLOWER:'magnetflower',
  MAID_BONNET:'maidbonnet',
  MAID_DRESS:'maiddress',
  MAID_SHOES:'maidshoes',
  MALAISE:'malaise',
  MALLARD_DUCK:'mallardduck',
  MALLARD_DUCK_CAGE:'mallardduckcage',
  MANA_BOOSTER:'manabooster',
  MANA_CLOAK:'manacloak',
  MANA_HAIR_DYE:'manahairdye',
  MANA_REGENERATION_BAND:'manaregenerationband',
  MANGO:'mango',
  MANNEQUIN:'mannequin',
  MARBLE_COLUMN:'marblecolumn',
  MAROON_GRADUATION_CAP:'maroongraduationcap',
  MAROON_GRADUATION_GOWN:'maroongraduationgown',
  MARSHMALLOW:'marshmallow',
  MARSHMALLOWONA_STICK:'marshmallowonastick',
  MARTIA_LISA:'martialisa',
  MARTIAN_CONDUIT_PLATING:'martianconduitplating',
  MARTIAN_CONDUIT_WALL:'martianconduitwall',
  MARTIAN_COSTUME_PANTS:'martiancostumepants',
  MARTIAN_COSTUME_SHIRT:'martiancostumeshirt',
  MARTIAN_DYE:'martiandye',
  MARTIAN_HAIR_DYE:'martianhairdye',
  MARTIAN_UNIFORM_HELMET:'martianuniformhelmet',
  MARTIAN_UNIFORM_PANTS:'martianuniformpants',
  MARTIAN_UNIFORM_TORSO:'martianuniformtorso',
  MASTER_BAIT:'masterbait',
  MASTER_GAMERS_JACKET:'mastergamersjacket',
  MASTER_GAMERS_PANTS:'mastergamerspants',
  MEAN_GOBLINS_SPIKES:'meangoblinsspikes',
  MEAT_GRINDER:'meatgrinder',
  MECHANICS_ROD:'mechanicsrod',
  MECHANICAL_BATTERY_PIECE:'mechanicalbatterypiece',
  MECHANICAL_CART:'mechanicalcart',
  MECHANICAL_LENS:'mechanicallens',
  MECHANICAL_RULER:'mechanicalruler',
  MECHANICAL_WAGON_PIECE:'mechanicalwagonpiece',
  MECHANICAL_WHEEL_PIECE:'mechanicalwheelpiece',
  MEDICATED_BANDAGE:'medicatedbandage',
  MEGAPHONE:'megaphone',
  MEOWMERE_MINECART:'meowmereminecart',
  MERCURY_BRICK:'mercurybrick',
  MERCURY_BRICK_WALL:'mercurybrickwall',
  MERMAID_ADORNMENT:'mermaidadornment',
  MERMAID_TAIL:'mermaidtail',
  METAL_SHELF:'metalshelf',
  METEOR_SUIT:'meteorsuit',
  METEORITE_BRICK:'meteoritebrick',
  METEORITE_BRICK_WALL:'meteoritebrickwall',
  MIDNIGHT_CONFETTI_BLOCK:'midnightconfettiblock',
  MIDNIGHT_CONFETTI_WALL:'midnightconfettiwall',
  MIDNIGHT_RAINBOW_DYE:'midnightrainbowdye',
  MIDNIGHT_SUN:'midnightsun',
  MILKSHAKE:'milkshake',
  MINECARP:'minecarp',
  MINECART:'minecart',
  MINECART_TRACK:'minecarttrack',
  MINECART_UPGRADE_KIT:'minecartupgradekit',
  MINI_VOLCANO:'minivolcano',
  MINING_HELMET:'mininghelmet',
  MINING_PANTS:'miningpants',
  MINING_SHIRT:'miningshirt',
  MIRAGE_CRATE:'miragecrate',
  MIRAGE_DYE:'miragedye',
  MIRAGE_FISH:'miragefish',
  MITEY_TITEY:'miteytitey',
  MOBIUS_STRIP:'mobiusstrip',
  MOLLUSK_WHISTLE:'molluskwhistle',
  MOLTEN_LEGION_FLAG:'moltenlegionflag',
  MOLTEN_SKULL_ROSE:'moltenskullrose',
  MONARCH_BUTTERFLY:'monarchbutterfly',
  MONARCH_BUTTERFLY_JAR:'monarchbutterflyjar',
  MONEY_HAIR_DYE:'moneyhairdye',
  MONEY_TROUGH:'moneytrough',
  MONKS_BELT:'monksbelt',
  MONKS_BUSHY_BROW_BALD_CAP:'monksbushybrowbaldcap',
  MONKS_PANTS:'monkspants',
  MONKS_SHIRT:'monksshirt',
  MONSTER_LASAGNA:'monsterlasagna',
  MONSTER_MEAT:'monstermeat',
  MOON_GLOBE:'moonglobe',
  MOON_LORD_LEGS:'moonlordlegs',
  MOON_LORD_TORSO:'moonlordtorso',
  MOON_SHELL:'moonshell',
  MOONGLOW:'moonglow',
  MOONGLOW_PLANTER_BOX:'moonglowplanterbox',
  MOONGLOW_SEEDS:'moonglowseeds',
  MOONMAN_COMPANY:'moonmancompany',
  MOONPLATE_BLOCK:'moonplateblock',
  MORBID_CURIOSITY:'morbidcuriosity',
  MORNING_HUNT:'morninghunt',
  MOTTLED_STONE_WALL:'mottledstonewall',
  MOUSE:'mouse',
  MOUSE_CAGE:'mousecage',
  MRS_CLAUS_HAT:'mrsclaushat',
  MRS_CLAUS_HEELS:'mrsclausheels',
  MRS_CLAUS_SHIRT:'mrsclausshirt',
  MUD_BALL:'mudball',
  MUD_BLOCK:'mudblock',
  MUD_BUD:'mudbud',
  MUD_WALL:'mudwall',
  MUDFISH:'mudfish',
  MUDSTONE_BRICK:'mudstonebrick',
  MUDSTONE_BRICK_WALL:'mudstonebrickwall',
  MUG:'mug',
  MULTICOLOR_WRENCH:'multicolorwrench',
  MULTICOLORED_BULB:'multicoloredbulb',
  MULTICOLORED_LIGHTS:'multicoloredlights',
  MULTICOLORED_STAINED_GLASS:'multicoloredstainedglass',
  MUMMY_PANTS:'mummypants',
  MUMMY_SHIRT:'mummyshirt',
  MUSHROOM_BEAM:'mushroombeam',
  MUSHROOM_CAMPFIRE:'mushroomcampfire',
  MUSHROOM_CAP:'mushroomcap',
  MUSHROOM_HAT:'mushroomhat',
  MUSHROOM_PANTS:'mushroompants',
  MUSHROOM_PYLON:'mushroompylon',
  MUSHROOM_VEST:'mushroomvest',
  MUTANT_FLINXFIN:'mutantflinxfin',
  MY_SON:'myson',
  MYSTERIOUS_CAPE:'mysteriouscape',
  MYSTIC_ARTS_SASH:'mysticartssash',
  MYSTIC_ROBE:'mysticrobe',
  MYTHRIL_BRICK:'mythrilbrick',
  MYTHRIL_BRICK_WALL:'mythrilbrickwall',
  MYTHRIL_CHAINMAIL:'mythrilchainmail',
  MYTHRIL_CHAINSAW:'mythrilchainsaw',
  MYTHRIL_CRATE:'mythrilcrate',
  MYTHRIL_DRILL:'mythrildrill',
  MYTHRIL_GREAVES:'mythrilgreaves',
  MYTHRIL_HALBERD:'mythrilhalberd',
  MYTHRIL_HAT:'mythrilhat',
  MYTHRIL_HOOD:'mythrilhood',
  NACHOS:'nachos',
  NANITES:'nanites',
  NATURAL_DIRT_WALL:'naturaldirtwall',
  NATURES_GIFT:'naturesgift',
  NAZAR:'nazar',
  NEBULA_BRICK:'nebulabrick',
  NEBULA_BRICK_WALL:'nebulabrickwall',
  NEBULA_CHAINSAW:'nebulachainsaw',
  NEBULA_DRILL:'nebuladrill',
  NEBULA_DYE:'nebuladye',
  NEBULA_FRAGMENT_BLOCK:'nebulafragmentblock',
  NEBULA_MANTLE:'nebulamantle',
  NEBULA_MONOLITH:'nebulamonolith',
  NECROMANTIC_SIGN:'necromanticsign',
  NECTAR:'nectar',
  NEGATIVE_DYE:'negativedye',
  NEGATIVE_PAINT:'negativepaint',
  NEON_MOSS:'neonmoss',
  NEON_MOSS_BRICK:'neonmossbrick',
  NEON_MOSS_BRICK_WALL:'neonmossbrickwall',
  NEON_MOSS_FISHING_BOBBER:'neonmossfishingbobber',
  NEPTUNES_SHELL:'neptunesshell',
  NEVERMORE:'nevermore',
  NIGHT_VISION_HELMET:'nightvisionhelmet',
  NIGHTS_EDGE:'nightsedge',
  NOT_SO_LOST_IN_PARADISE:'notsolostinparadise',
  NOTA_KIDNORA_SQUID:'notakidnorasquid',
  NURSE_HAT:'nursehat',
  NURSE_LISA:'nurselisa',
  NURSE_PANTS:'nursepants',
  NURSE_SHIRT:'nurseshirt',
  OASIS:'oasis',
  OASIS_CRATE:'oasiscrate',
  OASIS_WATER_FOUNTAIN:'oasiswaterfountain',
  OBELISK:'obelisk',
  OBSIDIAN_BRICK:'obsidianbrick',
  OBSIDIAN_CRATE:'obsidiancrate',
  OBSIDIAN_HORSESHOE:'obsidianhorseshoe',
  OBSIDIAN_LOCK_BOX:'obsidianlockbox',
  OBSIDIAN_SKULL_ROSE:'obsidianskullrose',
  OBSIDIAN_SWORDFISH:'obsidianswordfish',
  OBSIDIAN_VASE:'obsidianvase',
  OBSIDIAN_WATER_WALKING_BOOTS:'obsidianwaterwalkingboots',
  OBSIDIFISH:'obsidifish',
  OCEAN_CRATE:'oceancrate',
  OCRAMS_RAZOR:'ocramsrazor',
  OCULAR_RESONANCE:'ocularresonance',
  OF_SEAAND_DREAMS:'ofseaanddreams',
  OFFICE_BLOCK:'officeblock',
  OFFICE_WALL:'officewall',
  OFFLINE_AMBER_GEMSPARK_WALL:'offlineambergemsparkwall',
  OFFLINE_AMETHYST_GEMSPARK_WALL:'offlineamethystgemsparkwall',
  OFFLINE_DIAMOND_GEMSPARK_WALL:'offlinediamondgemsparkwall',
  OFFLINE_EMERALD_GEMSPARK_WALL:'offlineemeraldgemsparkwall',
  OFFLINE_RUBY_GEMSPARK_WALL:'offlinerubygemsparkwall',
  OFFLINE_SAPPHIRE_GEMSPARK_WALL:'offlinesapphiregemsparkwall',
  OFFLINE_TOPAZ_GEMSPARK_WALL:'offlinetopazgemsparkwall',
  OGRES_CLUB:'ogresclub',
  OIL_RAG_SCONCE:'oilragsconce',
  OKTOBER:'oktober',
  OLD_COMPANION_LOCKET:'oldcompanionlocket',
  OLD_MINER:'oldminer',
  OLD_SHOE:'oldshoe',
  OLD_STONE_WALL:'oldstonewall',
  OMINOUS_PRESENCE:'ominouspresence',
  ORANGE_DRAGONFLY:'orangedragonfly',
  ORANGE_DRAGONFLY_JAR:'orangedragonflyjar',
  ORANGE_GOLF_BALL:'orangegolfball',
  ORANGE_PAINT:'orangepaint',
  ORANGE_PRESSURE_PLATE:'orangepressureplate',
  ORANGE_STAINED_GLASS:'orangestainedglass',
  ORANGE_STRING:'orangestring',
  ORANGE_WEIGHTED_PRESSURE_PLATE:'orangeweightedpressureplate',
  ORANGEAND_BLACK_DYE:'orangeandblackdye',
  ORANGEAND_SILVER_DYE:'orangeandsilverdye',
  ORICHALCUM_CHAINSAW:'orichalcumchainsaw',
  ORICHALCUM_DRILL:'orichalcumdrill',
  ORICHALCUM_HALBERD:'orichalcumhalberd',
  ORICHALCUM_HEADGEAR:'orichalcumheadgear',
  ORNATE_SHADOW_KEY:'ornateshadowkey',
  OUROBOROS_RING:'ouroborosring',
  OUTCAST:'outcast',
  OUTLET_PUMP:'outletpump',
  OVERGROWN_LIVING_WOOD_WALL:'overgrownlivingwoodwall',
  OWL:'owl',
  OWL_CAGE:'owlcage',
  OYSTER:'oyster',
  PAD_THAI:'padthai',
  PAINT_ROLLER:'paintroller',
  PAINT_SCRAPER:'paintscraper',
  PAINT_SPRAYER:'paintsprayer',
  PAINTBRUSH:'paintbrush',
  PAINTED_ARROW_SIGN:'paintedarrowsign',
  PAIROF_EYEBALLS:'pairofeyeballs',
  PAL_METAL_CHESTPLATE:'palmetalchestplate',
  PAL_METAL_LEGGINGS:'palmetalleggings',
  PALADINS_HAMMER:'paladinshammer',
  PALADINS_SHIELD:'paladinsshield',
  PALLADIUM_CHAINSAW:'palladiumchainsaw',
  PALLADIUM_COLUMN:'palladiumcolumn',
  PALLADIUM_COLUMN_WALL:'palladiumcolumnwall',
  PALLADIUM_DRILL:'palladiumdrill',
  PALLADIUM_HEADGEAR:'palladiumheadgear',
  PALLADIUM_PIKE:'palladiumpike',
  PALM_WOOD_BREASTPLATE:'palmwoodbreastplate',
  PALM_WOOD_FENCE:'palmwoodfence',
  PALM_WOOD_GREAVES:'palmwoodgreaves',
  PALM_WOOD_HELMET:'palmwoodhelmet',
  PANDA_EARS:'pandaears',
  PARKA_COAT:'parkacoat',
  PARKA_HOOD:'parkahood',
  PARKA_PANTS:'parkapants',
  PARSEC_PALS:'parsecpals',
  PARTY_HAIR_DYE:'partyhairdye',
  PARTY_ROLLER_SKATES:'partyrollerskates',
  PARTY_WAGON:'partywagon',
  PEACH:'peach',
  PEACH_SANGRIA:'peachsangria',
  PEARLSAND_BLOCK:'pearlsandblock',
  PEARLSANDSTONE_BLOCK:'pearlsandstoneblock',
  PEARLSANDSTONE_WALL:'pearlsandstonewall',
  PEARLSTONE_BRICK:'pearlstonebrick',
  PEARLSTONE_BRICK_WALL:'pearlstonebrickwall',
  PEARLSTONE_WALL:'pearlstonewall',
  PEARLWOOD:'pearlwood',
  PEARLWOOD_BREASTPLATE:'pearlwoodbreastplate',
  PEARLWOOD_CRATE:'pearlwoodcrate',
  PEARLWOOD_FENCE:'pearlwoodfence',
  PEARLWOOD_GREAVES:'pearlwoodgreaves',
  PEARLWOOD_HELMET:'pearlwoodhelmet',
  PEDDLERS_HAT:'peddlershat',
  PEDDLERS_SATCHEL:'peddlerssatchel',
  PEDGUINS_HOOD:'pedguinshood',
  PEDGUINS_JACKET:'pedguinsjacket',
  PEDGUINS_TROUSERS:'pedguinstrousers',
  PENGFISH:'pengfish',
  PENGUIN:'penguin',
  PENGUIN_CAGE:'penguincage',
  PHARAOHS_ROBE:'pharaohsrobe',
  PHASE_DYE:'phasedye',
  PHASIC_WARP_EJECTOR:'phasicwarpejector',
  PHO:'pho',
  PHOENIX_QUIVER:'phoenixquiver',
  PIECEOF_MOON_SQUID:'pieceofmoonsquid',
  PIGRON_MINECART:'pigronminecart',
  PILLAGIN_ME_PIXELS:'pillaginmepixels',
  PINE_TREE_BLOCK:'pinetreeblock',
  PINE_TREE_WALL:'pinetreewall',
  PINE_WOOD:'pinewood',
  PINE_WOOD_WALL:'pinewoodwall',
  PINEAPPLE:'pineapple',
  PINK_BRICK:'pinkbrick',
  PINK_DUNGEON_VASE:'pinkdungeonvase',
  PINK_FAIRY:'pinkfairy',
  PINK_FAIRY_JAR:'pinkfairyjar',
  PINK_FLOWER_SEEDS:'pinkflowerseeds',
  PINK_GEL:'pinkgel',
  PINK_GEL_DYE:'pinkgeldye',
  PINK_GOLF_BALL:'pinkgolfball',
  PINK_HORSESHOE_BALLOON:'pinkhorseshoeballoon',
  PINK_ICE_BLOCK:'pinkiceblock',
  PINK_JELLYFISH:'pinkjellyfish',
  PINK_JELLYFISH_JAR:'pinkjellyfishjar',
  PINK_MAID_BONNET:'pinkmaidbonnet',
  PINK_MAID_DRESS:'pinkmaiddress',
  PINK_MAID_SHOES:'pinkmaidshoes',
  PINK_PAINT:'pinkpaint',
  PINK_PEARL:'pinkpearl',
  PINK_SLAB_WALL:'pinkslabwall',
  PINK_SLIME_BLOCK:'pinkslimeblock',
  PINK_SNOW_COAT:'pinksnowcoat',
  PINK_SNOW_HOOD:'pinksnowhood',
  PINK_SNOW_PANTS:'pinksnowpants',
  PINK_STREAMER:'pinkstreamer',
  PINK_STRING:'pinkstring',
  PINK_TEAM_BLOCK:'pinkteamblock',
  PINK_THREAD:'pinkthread',
  PINK_TILED_WALL:'pinktiledwall',
  PINK_VASE:'pinkvase',
  PINK_WEIGHTED_PRESSURE_PLATE:'pinkweightedpressureplate',
  PINKAND_BLACK_DYE:'pinkandblackdye',
  PINKAND_SILVER_DYE:'pinkandsilverdye',
  PINSTRIPE_PANTS:'pinstripepants',
  PIRATE_HAT:'piratehat',
  PIRATE_PANTS:'piratepants',
  PIRATE_SHIRT:'pirateshirt',
  PIXEL_BOX:'pixelbox',
  PIXIE_DUST:'pixiedust',
  PIXIE_DYE:'pixiedye',
  PIXIE_PANTS:'pixiepants',
  PIXIE_SHIRT:'pixieshirt',
  PIXIEFISH:'pixiefish',
  PIZZA:'pizza',
  PIA_COLADA:'piacolada',
  PLACE_ABOVETHE_CLOUDS:'placeabovetheclouds',
  PLAGUEBRINGERS_CLOAK:'plaguebringerscloak',
  PLAGUEBRINGERS_SKULL:'plaguebringersskull',
  PLAGUEBRINGERS_TREADS:'plaguebringerstreads',
  PLANKED_WALL:'plankedwall',
  PLANTERA_SEEDLING:'planteraseedling',
  PLATE:'plate',
  PLATINUM_BRICK:'platinumbrick',
  PLATINUM_BRICK_WALL:'platinumbrickwall',
  PLATINUM_CROWN:'platinumcrown',
  PLATINUM_SHORTSWORD:'platinumshortsword',
  PLATINUM_WATCH:'platinumwatch',
  PLUM:'plum',
  PLUMBERS_HAT:'plumbershat',
  PLUMBERS_PANTS:'plumberspants',
  PLUMBERS_SHIRT:'plumbersshirt',
  POCKET_MIRROR:'pocketmirror',
  POGO_STICK:'pogostick',
  POISON_BARB:'poisonbarb',
  POMEGRANATE:'pomegranate',
  POO:'poo',
  POO_BOULDER:'pooboulder',
  POO_WALL:'poowall',
  PORKOFTHE_SEA:'porkofthesea',
  PORTABLE_CEMENT_MIXER:'portablecementmixer',
  PORTAL_GUN:'portalgun',
  PORTAL_GUN_STATION:'portalgunstation',
  POSSESSED_SKULL:'possessedskull',
  POTATO_CHIPS:'potatochips',
  POTIONOF_RETURN:'potionofreturn',
  POTTED_BRIMSTONE_BUSH:'pottedbrimstonebush',
  POTTED_CRYSTAL_FERN:'pottedcrystalfern',
  POTTED_CRYSTAL_SPIRAL:'pottedcrystalspiral',
  POTTED_CRYSTAL_TEARDROP:'pottedcrystalteardrop',
  POTTED_CRYSTAL_TREE:'pottedcrystaltree',
  POTTED_EMBER_TENDRILS:'pottedembertendrils',
  POTTED_FIRE_BRAMBLES:'pottedfirebrambles',
  POTTED_FOREST_BAMBOO:'pottedforestbamboo',
  POTTED_FOREST_CEDAR:'pottedforestcedar',
  POTTED_FOREST_PALM:'pottedforestpalm',
  POTTED_FOREST_TREE:'pottedforesttree',
  POTTED_HALLOW_BAMBOO:'pottedhallowbamboo',
  POTTED_HALLOW_CEDAR:'pottedhallowcedar',
  POTTED_HALLOW_PALM:'pottedhallowpalm',
  POTTED_HALLOW_TREE:'pottedhallowtree',
  POTTED_JUNGLE_BAMBOO:'pottedjunglebamboo',
  POTTED_JUNGLE_CEDAR:'pottedjunglecedar',
  POTTED_JUNGLE_PALM:'pottedjunglepalm',
  POTTED_JUNGLE_TREE:'pottedjungletree',
  POTTED_LAVA_BULB:'pottedlavabulb',
  POTTED_MAGMA_PALM:'pottedmagmapalm',
  POWER_BOMB:'powerbomb',
  POWER_GLOVE:'powerglove',
  POWEREDBY_BIRDS:'poweredbybirds',
  PREHISTORY_PRESERVED:'prehistorypreserved',
  PREMIUM_GOLF_CLUB_DRIVER:'premiumgolfclubdriver',
  PREMIUM_GOLF_CLUB_IRON:'premiumgolfclubiron',
  PREMIUM_GOLF_CLUB_PUTTER:'premiumgolfclubputter',
  PREMIUM_GOLF_CLUB_WEDGE:'premiumgolfclubwedge',
  PRESENT:'present',
  PRESSERATOR:'presserator',
  PRESSURE_PLATE_TRACK:'pressureplatetrack',
  PRETTY_MIRROR:'prettymirror',
  PRETTY_PINK_DRESS:'prettypinkdress',
  PRETTY_PINK_RIBBON:'prettypinkribbon',
  PRETTY_PINK_STOCKINGS:'prettypinkstockings',
  PRINCE_CAPE:'princecape',
  PRINCE_PANTS:'princepants',
  PRINCE_UNIFORM:'princeuniform',
  PRINCESS64:'princess64',
  PRINCESS_DRESS:'princessdress',
  PRINCESS_FISH:'princessfish',
  PRINCESS_HAT:'princesshat',
  PRINCESS_STYLE:'princessstyle',
  PRISMATIC_DYE:'prismaticdye',
  PRISMATIC_LACEWING:'prismaticlacewing',
  PRISMATIC_LACEWING_JAR:'prismaticlacewingjar',
  PRISMATIC_PUNCH:'prismaticpunch',
  PRISMITE:'prismite',
  PROSPECTOR_HELMET:'prospectorhelmet',
  PROSPECTOR_PANTS:'prospectorpants',
  PROSPECTOR_SHIRT:'prospectorshirt',
  PROST:'prost',
  PUFFER_SHRIMP:'puffershrimp',
  PUFFERFISH_CAGE:'pufferfishcage',
  PUMPKIN_BREASTPLATE:'pumpkinbreastplate',
  PUMPKIN_HELMET:'pumpkinhelmet',
  PUMPKIN_LEGGINGS:'pumpkinleggings',
  PUMPKIN_PANTS:'pumpkinpants',
  PUMPKIN_SCENTED_CANDLE:'pumpkinscentedcandle',
  PUMPKIN_SEED:'pumpkinseed',
  PUMPKIN_SHIRT:'pumpkinshirt',
  PUMPKIN_WALL:'pumpkinwall',
  PUPFISH:'pupfish',
  PUPFISH_BOWL:'pupfishbowl',
  PURE_WATER_FOUNTAIN:'purewaterfountain',
  PURITY:'purity',
  PURPLE_COUNTERWEIGHT:'purplecounterweight',
  PURPLE_EMPEROR_BUTTERFLY:'purpleemperorbutterfly',
  PURPLE_EMPEROR_BUTTERFLY_JAR:'purpleemperorbutterflyjar',
  PURPLE_GOLF_BALL:'purplegolfball',
  PURPLE_ICE_BLOCK:'purpleiceblock',
  PURPLE_MOSS:'purplemoss',
  PURPLE_MOSSY_WALL:'purplemossywall',
  PURPLE_OOZE_DYE:'purpleoozedye',
  PURPLE_PAINT:'purplepaint',
  PURPLE_PIN_FLAG:'purplepinflag',
  PURPLE_SOLUTION:'purplesolution',
  PURPLE_STAINED_GLASS:'purplestainedglass',
  PURPLE_STRING:'purplestring',
  PURPLE_WEIGHTED_PRESSURE_PLATE:'purpleweightedpressureplate',
  PURPLEAND_BLACK_DYE:'purpleandblackdye',
  PURPLEAND_SILVER_DYE:'purpleandsilverdye',
  PYROCLASTIC_STONE:'pyroclasticstone',
  QUEENOF_BEES:'queenofbees',
  RABBIT_PERCH:'rabbitperch',
  RADIO_THING:'radiothing',
  RAGGED_BROTHERHOOD_SIGIL:'raggedbrotherhoodsigil',
  RAIN_CLOUD:'raincloud',
  RAIN_COAT:'raincoat',
  RAIN_HAT:'rainhat',
  RAIN_SONG:'rainsong',
  RAINBOW_BOULDER:'rainbowboulder',
  RAINBOW_BRICK:'rainbowbrick',
  RAINBOW_BRICK_WALL:'rainbowbrickwall',
  RAINBOW_CAMPFIRE:'rainbowcampfire',
  RAINBOW_CLOUD:'rainbowcloud',
  RAINBOW_CURSOR:'rainbowcursor',
  RAINBOW_GLOWSTICK:'rainbowglowstick',
  RAINBOW_HAIR_DYE:'rainbowhairdye',
  RAINBOW_STRING:'rainbowstring',
  RALLY:'rally',
  RAM_RUNE:'ramrune',
  RAMBUTAN:'rambutan',
  RARE_ENCHANTMENT:'rareenchantment',
  RAT:'rat',
  RAT_CAGE:'ratcage',
  RAVEN_FEATHER:'ravenfeather',
  RAYNBROS_HOOD:'raynbroshood',
  RAYNBROS_HOODIE:'raynbroshoodie',
  RAYNBROS_PANTS:'raynbrospants',
  RAZORTIP:'razortip',
  REAPER_HOOD:'reaperhood',
  REAPER_ROBE:'reaperrobe',
  REBORN:'reborn',
  RECON_SCOPE:'reconscope',
  RED_ADMIRAL_BUTTERFLY:'redadmiralbutterfly',
  RED_ADMIRAL_BUTTERFLY_JAR:'redadmiralbutterflyjar',
  RED_BULB:'redbulb',
  RED_CAPE:'redcape',
  RED_COUNTERWEIGHT:'redcounterweight',
  RED_DRAGONFLY:'reddragonfly',
  RED_DRAGONFLY_JAR:'reddragonflyjar',
  RED_DYNASTY_SHINGLES:'reddynastyshingles',
  RED_FLOWER_SEEDS:'redflowerseeds',
  RED_GARLAND:'redgarland',
  RED_GOLF_BALL:'redgolfball',
  RED_HAT:'redhat',
  RED_ICE_BLOCK:'rediceblock',
  RED_LIGHT:'redlight',
  RED_LIGHTS:'redlights',
  RED_MOSS:'redmoss',
  RED_MOSSY_WALL:'redmossywall',
  RED_PAINT:'redpaint',
  RED_PIN_FLAG:'redpinflag',
  RED_POTION:'redpotion',
  RED_PRESSURE_PLATE:'redpressureplate',
  RED_RIDING_DRESS:'redridingdress',
  RED_RIDING_HOOD:'redridinghood',
  RED_RIDING_LEGGINGS:'redridingleggings',
  RED_ROCKET:'redrocket',
  RED_SNAPPER:'redsnapper',
  RED_SOLUTION:'redsolution',
  RED_SQUIRREL:'redsquirrel',
  RED_SQUIRREL_CAGE:'redsquirrelcage',
  RED_STAINED_GLASS:'redstainedglass',
  RED_STRING:'redstring',
  RED_STUCCO:'redstucco',
  RED_STUCCO_WALL:'redstuccowall',
  RED_SWIMSUIT:'redswimsuit',
  RED_TEAM_BLOCK:'redteamblock',
  RED_WRENCH:'redwrench',
  REDAND_BLACK_DYE:'redandblackdye',
  REDAND_BLUE_LIGHTS:'redandbluelights',
  REDAND_GREEN_BULB:'redandgreenbulb',
  REDAND_GREEN_GARLAND:'redandgreengarland',
  REDAND_GREEN_LIGHTS:'redandgreenlights',
  REDAND_SILVER_DYE:'redandsilverdye',
  REDAND_YELLOW_BULB:'redandyellowbulb',
  REDAND_YELLOW_LIGHTS:'redandyellowlights',
  REDS_BREASTPLATE:'redsbreastplate',
  REDS_HELMET:'redshelmet',
  REDS_LEGGINGS:'redsleggings',
  REDS_THROW:'redsthrow',
  REDS_WINGS:'redswings',
  REEF_BLOCK:'reefblock',
  REEF_WALL:'reefwall',
  REFLECTIVE_COPPER_DYE:'reflectivecopperdye',
  REFLECTIVE_DYE:'reflectivedye',
  REFLECTIVE_GOLD_DYE:'reflectivegolddye',
  REFLECTIVE_METAL_DYE:'reflectivemetaldye',
  REFLECTIVE_OBSIDIAN_DYE:'reflectiveobsidiandye',
  REFLECTIVE_SHADES:'reflectiveshades',
  REFLECTIVE_SILVER_DYE:'reflectivesilverdye',
  REGAL_DELICACY:'regaldelicacy',
  REINDEER_ANTLERS:'reindeerantlers',
  REINFORCED_FISHING_POLE:'reinforcedfishingpole',
  RELEASE_DOVES:'releasedoves',
  REMIX:'remix',
  REMNANTSOF_DEVOTION:'remnantsofdevotion',
  REPAIRED_LIFE_CRYSTAL:'repairedlifecrystal',
  REPAIRED_MANA_CRYSTAL:'repairedmanacrystal',
  REPLICA_CRIMSON_ALTAR:'replicacrimsonaltar',
  REPLICA_CRIMSON_HEART:'replicacrimsonheart',
  REPLICA_DEMON_ALTAR:'replicademonaltar',
  REPLICA_SHADOW_ORB:'replicashadoworb',
  REQUIEM:'requiem',
  RESPLENDENT_DESSERT:'resplendentdessert',
  RESTORATION_SHIELD:'restorationshield',
  RETRO_MONOLITH:'retromonolith',
  RICH_MAHOGANY:'richmahogany',
  RICH_MAHOGANY_BEAM:'richmahoganybeam',
  RICH_MAHOGANY_BREASTPLATE:'richmahoganybreastplate',
  RICH_MAHOGANY_FENCE:'richmahoganyfence',
  RICH_MAHOGANY_GREAVES:'richmahoganygreaves',
  RICH_MAHOGANY_HELMET:'richmahoganyhelmet',
  RICH_MAHOGANY_LEAF_WAND:'richmahoganyleafwand',
  ROASTED_BIRD:'roastedbird',
  ROASTED_DUCK:'roastedduck',
  ROBE:'robe',
  ROBOT_HAT:'robothat',
  ROBOT_PANTS:'robotpants',
  ROBOT_SHIRT:'robotshirt',
  ROBOTIC_SKULL:'roboticskull',
  ROCK_CANDY:'rockcandy',
  ROCK_GOLEM_HEAD:'rockgolemhead',
  ROCK_LOBSTER:'rocklobster',
  ROCKY_DIRT_WALL:'rockydirtwall',
  RODOF_DISCORD:'rodofdiscord',
  RODOF_HARMONY:'rodofharmony',
  ROLLING_CACTUS:'rollingcactus',
  ROPE:'rope',
  ROPE_COIL:'ropecoil',
  ROUGH_DIRT_WALL:'roughdirtwall',
  ROYAL_BLOUSE:'royalblouse',
  ROYAL_DELIGHT:'royaldelight',
  ROYAL_DRESS:'royaldress',
  ROYAL_GEL:'royalgel',
  ROYAL_GILDED_SADDLE:'royalgildedsaddle',
  ROYAL_GUARDS_HARNESS:'royalguardsharness',
  ROYAL_ROMANCE:'royalromance',
  ROYAL_SCEPTER:'royalscepter',
  ROYAL_TIARA:'royaltiara',
  RUBBLEMAKER_LARGE:'rubblemakerlarge',
  RUBBLEMAKER_MEDIUM:'rubblemakermedium',
  RUBBLEMAKER_SMALL:'rubblemakersmall',
  RUBY_BUNNY:'rubybunny',
  RUBY_BUNNY_CAGE:'rubybunnycage',
  RUBY_GEM_LOCK:'rubygemlock',
  RUBY_GEMCORN:'rubygemcorn',
  RUBY_GEMSPARK_BLOCK:'rubygemsparkblock',
  RUBY_GEMSPARK_WALL:'rubygemsparkwall',
  RUBY_HOOK:'rubyhook',
  RUBY_MINECART:'rubyminecart',
  RUBY_ROBE:'rubyrobe',
  RUBY_SQUIRREL:'rubysquirrel',
  RUBY_SQUIRREL_CAGE:'rubysquirrelcage',
  RUBY_STONE_BLOCK:'rubystoneblock',
  RUBY_STONE_WALL:'rubystonewall',
  RULER:'ruler',
  RUNE_HAT:'runehat',
  RUNE_ROBE:'runerobe',
  RUSTED_COMPANY_STANDARD:'rustedcompanystandard',
  S_W_A_T_HELMET:'swathelmet',
  SAFE:'safe',
  SAFEMANS_BLANKET_CAPE:'safemansblanketcape',
  SAFEMANS_PINK_LEGGINGS:'safemanspinkleggings',
  SAFEMANS_SUN_DRESS:'safemanssundress',
  SAFEMANS_SUNNY_DAY:'safemanssunnyday',
  SAIL:'sail',
  SAILFISH_BOOTS:'sailfishboots',
  SAILOR_HAT:'sailorhat',
  SAILOR_PANTS:'sailorpants',
  SAILOR_SHIRT:'sailorshirt',
  SAKE:'sake',
  SAKURA_SAPLING:'sakurasapling',
  SAND_BLOCK:'sandblock',
  SANDCASTLE_BUCKET:'sandcastlebucket',
  SANDFALL_BLOCK:'sandfallblock',
  SANDFALL_WALL:'sandfallwall',
  SANDSTONE_BRICK_WALL:'sandstonebrickwall',
  SANDSTONE_COLUMN:'sandstonecolumn',
  SANDSTONE_SLAB:'sandstoneslab',
  SANDSTORMINA_BALLOON:'sandstorminaballoon',
  SANTA_HAT:'santahat',
  SANTA_PANTS:'santapants',
  SANTA_SHIRT:'santashirt',
  SAPPHIRE_BUNNY:'sapphirebunny',
  SAPPHIRE_BUNNY_CAGE:'sapphirebunnycage',
  SAPPHIRE_GEM_LOCK:'sapphiregemlock',
  SAPPHIRE_GEMCORN:'sapphiregemcorn',
  SAPPHIRE_GEMSPARK_BLOCK:'sapphiregemsparkblock',
  SAPPHIRE_GEMSPARK_WALL:'sapphiregemsparkwall',
  SAPPHIRE_HOOK:'sapphirehook',
  SAPPHIRE_MINECART:'sapphireminecart',
  SAPPHIRE_ROBE:'sapphirerobe',
  SAPPHIRE_SQUIRREL:'sapphiresquirrel',
  SAPPHIRE_SQUIRREL_CAGE:'sapphiresquirrelcage',
  SAPPHIRE_STONE_BLOCK:'sapphirestoneblock',
  SAPPHIRE_STONE_WALL:'sapphirestonewall',
  SASHIMI:'sashimi',
  SAUTEED_FROG_LEGS:'sauteedfroglegs',
  SAWMILL:'sawmill',
  SAWTOOTH_SHARK:'sawtoothshark',
  SCALY_TRUFFLE:'scalytruffle',
  SCARAB_BOMB:'scarabbomb',
  SCARAB_FISH:'scarabfish',
  SCARAB_FISHING_ROD:'scarabfishingrod',
  SCARECROW_HAT:'scarecrowhat',
  SCARECROW_PANTS:'scarecrowpants',
  SCARECROW_SHIRT:'scarecrowshirt',
  SCARLET_MACAW:'scarletmacaw',
  SCARLET_MACAW_CAGE:'scarletmacawcage',
  SCORPIO_FISH:'scorpiofish',
  SCORPION:'scorpion',
  SCORPION_CAGE:'scorpioncage',
  SCOUTS_SLING:'scoutssling',
  SCRYING_ORB:'scryingorb',
  SEAFOOD_DINNER:'seafooddinner',
  SEAGULL:'seagull',
  SEAGULL_CAGE:'seagullcage',
  SEAHORSE:'seahorse',
  SEAHORSE_CAGE:'seahorsecage',
  SEASHELL:'seashell',
  SEASHELL_HAIRPIN:'seashellhairpin',
  SEASIDE_CRATE:'seasidecrate',
  SEAWEED:'seaweed',
  SEAWEED_PLANTER:'seaweedplanter',
  SECRETOFTHE_SANDS:'secretofthesands',
  SECRETS:'secrets',
  SEE_THE_WORLD_FOR_WHAT_IT_IS:'seetheworldforwhatitis',
  SEEDLING:'seedling',
  SERAPH_NECKLACE:'seraphnecklace',
  SERGEANT_UNITED_SHIELD:'sergeantunitedshield',
  SHADEWOOD:'shadewood',
  SHADEWOOD_BREASTPLATE:'shadewoodbreastplate',
  SHADEWOOD_FENCE:'shadewoodfence',
  SHADEWOOD_GREAVES:'shadewoodgreaves',
  SHADEWOOD_HELMET:'shadewoodhelmet',
  SHADOW_DYE:'shadowdye',
  SHADOW_JOUSTING_LANCE:'shadowjoustinglance',
  SHADOW_PAINT:'shadowpaint',
  SHADOWFLAME_HADES_DYE:'shadowflamehadesdye',
  SHARK_BAIT:'sharkbait',
  SHARKRON_BALLOON:'sharkronballoon',
  SHARP_SPIKE_BLOCK:'sharpspikeblock',
  SHARPENING_STATION:'sharpeningstation',
  SHELL_PILE:'shellpile',
  SHELLPHONE:'shellphone',
  SHELLPHONE_HOME:'shellphonehome',
  SHELLPHONE_OCEAN:'shellphoneocean',
  SHELLPHONE_SPAWN:'shellphonespawn',
  SHELLPHONE_UNDERWORLD:'shellphoneunderworld',
  SHIFTING_PEARLSANDS_DYE:'shiftingpearlsandsdye',
  SHIFTING_SANDS_DYE:'shiftingsandsdye',
  SHIMMER_GUN:'shimmergun',
  SHIMMERFALL_BLOCK:'shimmerfallblock',
  SHIMMERFALL_WALL:'shimmerfallwall',
  SHINING_MOON:'shiningmoon',
  SHINOBI_INFILTRATORS_HELMET:'shinobiinfiltratorshelmet',
  SHINOBI_INFILTRATORS_PANTS:'shinobiinfiltratorspants',
  SHINOBI_INFILTRATORS_TORSO:'shinobiinfiltratorstorso',
  SHINY_RED_BALLOON:'shinyredballoon',
  SHINY_STONE:'shinystone',
  SHIPINA_BOTTLE:'shipinabottle',
  SHIPS_WHEEL:'shipswheel',
  SHIVERTHORN:'shiverthorn',
  SHIVERTHORN_PLANTER_BOX:'shiverthornplanterbox',
  SHIVERTHORN_SEEDS:'shiverthornseeds',
  SHOE_SPIKES:'shoespikes',
  SHRIMP:'shrimp',
  SHRIMP_PO_BOY:'shrimppoboy',
  SHROOM_MINECART:'shroomminecart',
  SHROOMERANG:'shroomerang',
  SHROOMITE_HELMET:'shroomitehelmet',
  SHROOMITE_PLATING:'shroomiteplating',
  SHROOMITE_PLATING_WALL:'shroomiteplatingwall',
  SHRUB_STAR:'shrubstar',
  SHUCKED_OYSTER:'shuckedoyster',
  SILENT_FISH:'silentfish',
  SILK_ROPE:'silkrope',
  SILK_ROPE_COIL:'silkropecoil',
  SILLY_BALLOON_MACHINE:'sillyballoonmachine',
  SILLY_GREEN_BALLOON:'sillygreenballoon',
  SILLY_GREEN_BALLOON_WALL:'sillygreenballoonwall',
  SILLY_PINK_BALLOON:'sillypinkballoon',
  SILLY_PINK_BALLOON_WALL:'sillypinkballoonwall',
  SILLY_PURPLE_BALLOON:'sillypurpleballoon',
  SILLY_PURPLE_BALLOON_WALL:'sillypurpleballoonwall',
  SILLY_SUNFLOWER_BOTTOMS:'sillysunflowerbottoms',
  SILLY_SUNFLOWER_PETALS:'sillysunflowerpetals',
  SILLY_SUNFLOWER_TOPS:'sillysunflowertops',
  SILLY_TIED_BALLOON_GREEN:'sillytiedballoongreen',
  SILLY_TIED_BALLOON_PINK:'sillytiedballoonpink',
  SILLY_TIED_BALLOON_PURPLE:'sillytiedballoonpurple',
  SILLY_TIED_BUNDLEOF_BALLOONS:'sillytiedbundleofballoons',
  SILT_BLOCK:'siltblock',
  SILVER_BRACER:'silverbracer',
  SILVER_BRICK:'silverbrick',
  SILVER_DYE:'silverdye',
  SILVER_SHIELD:'silvershield',
  SILVER_SHORTSWORD:'silvershortsword',
  SILVER_WATCH:'silverwatch',
  SILVERAND_BLACK_DYE:'silverandblackdye',
  SITTING_DUCKS_FISHING_POLE:'sittingducksfishingpole',
  SKELEHEAD:'skelehead',
  SKELLINGTON_J_SKELLINGSWORTH:'skellingtonjskellingsworth',
  SKIPHS_BEAR_BUTT:'skiphsbearbutt',
  SKIPHS_BLOOD:'skiphsblood',
  SKIPHS_PAWS:'skiphspaws',
  SKIPHS_SKIN:'skiphsskin',
  SKULL:'skull',
  SKY_BLUE_DYE:'skybluedye',
  SKY_BLUE_FLOWER:'skyblueflower',
  SKY_BLUE_GOLF_BALL:'skybluegolfball',
  SKY_BLUE_PAINT:'skybluepaint',
  SKY_BLUE_STRING:'skybluestring',
  SKY_BLUEAND_BLACK_DYE:'skyblueandblackdye',
  SKY_BLUEAND_SILVER_DYE:'skyblueandsilverdye',
  SKY_CRATE:'skycrate',
  SKY_DRAGONS_FURY:'skydragonsfury',
  SKY_GUARDIAN:'skyguardian',
  SKY_MILL:'skymill',
  SLASHERS_MYSTERIOUS_SKULL:'slashersmysteriousskull',
  SLEEPY_OCTOPOD:'sleepyoctopod',
  SLICEOF_HELL_CAKE:'sliceofhellcake',
  SLIME_BLOCK:'slimeblock',
  SLIME_BLOCK_WALL:'slimeblockwall',
  SLIME_GUN:'slimegun',
  SLIME_SPEAR:'slimespear',
  SLIMEFISH:'slimefish',
  SLIMY_SADDLE:'slimysaddle',
  SLUGGY:'sluggy',
  SLUGGY_CAGE:'sluggycage',
  SLUSH_BLOCK:'slushblock',
  SMOKE_BLOCK:'smokeblock',
  SMOKE_BOMB:'smokebomb',
  SMOOTH_GRANITE_BLOCK:'smoothgraniteblock',
  SMOOTH_GRANITE_WALL:'smoothgranitewall',
  SMOOTH_MARBLE_BLOCK:'smoothmarbleblock',
  SMOOTH_MARBLE_WALL:'smoothmarblewall',
  SMOOTH_SANDSTONE:'smoothsandstone',
  SMOOTH_SANDSTONE_WALL:'smoothsandstonewall',
  SMOOTHIEOF_DARKNESS:'smoothieofdarkness',
  SMOULDERING_STONE_WALL:'smoulderingstonewall',
  SNAIL:'snail',
  SNAIL_CAGE:'snailcage',
  SNAKE_BAND:'snakeband',
  SNAKE_CHARMERS_FLUTE:'snakecharmersflute',
  SNAKES_I_HATE_SNAKES:'snakesihatesnakes',
  SNAPPING_STONE:'snappingstone',
  SNOW_BRICK_WALL:'snowbrickwall',
  SNOW_CLOUD:'snowcloud',
  SNOW_COAT:'snowcoat',
  SNOW_HAT:'snowhat',
  SNOW_HOOD:'snowhood',
  SNOW_PANTS:'snowpants',
  SNOWBALL_LAUNCHER:'snowballlauncher',
  SNOWFALL_BLOCK:'snowfallblock',
  SNOWFALL_WALL:'snowfallwall',
  SNOWFELLAS:'snowfellas',
  SOARING_INSIGNIA:'soaringinsignia',
  SOLAR_BRICK:'solarbrick',
  SOLAR_BRICK_WALL:'solarbrickwall',
  SOLAR_CULTIST_HOOD:'solarcultisthood',
  SOLAR_CULTIST_ROBE:'solarcultistrobe',
  SOLAR_DYE:'solardye',
  SOLAR_ERUPTION:'solareruption',
  SOLAR_FLARE_CHAINSAW:'solarflarechainsaw',
  SOLAR_FLARE_DRILL:'solarflaredrill',
  SOLAR_FRAGMENT_BLOCK:'solarfragmentblock',
  SOLAR_MONOLITH:'solarmonolith',
  SOLIDIFIER:'solidifier',
  SOMETHING_EVILIS_WATCHING_YOU:'somethingeviliswatchingyou',
  SORCERER_EMBLEM:'sorcereremblem',
  SOUL_CAKE:'soulcake',
  SOULOF_FLIGHTINA_BOTTLE:'soulofflightinabottle',
  SOULOF_FRIGHTINA_BOTTLE:'souloffrightinabottle',
  SOULOF_LIGHTINA_BOTTLE:'souloflightinabottle',
  SOULOF_MIGHTINA_BOTTLE:'soulofmightinabottle',
  SOULOF_NIGHTINA_BOTTLE:'soulofnightinabottle',
  SOULOF_SIGHTINA_BOTTLE:'soulofsightinabottle',
  SPACE_CREATURE_PANTS:'spacecreaturepants',
  SPACE_CREATURE_SHIRT:'spacecreatureshirt',
  SPAGHETTI:'spaghetti',
  SPARKLE_SLIME_BALLOON:'sparkleslimeballoon',
  SPARKLING_HONEY:'sparklinghoney',
  SPARKY:'sparky',
  SPEAR:'spear',
  SPEAR_RACK:'spearrack',
  SPEAR_TRAP:'speartrap',
  SPECTRE_BAR:'spectrebar',
  SPECTRE_GOGGLES:'spectregoggles',
  SPECTRE_PAINT_ROLLER:'spectrepaintroller',
  SPECTRE_PAINT_SCRAPER:'spectrepaintscraper',
  SPECTRE_PAINTBRUSH:'spectrepaintbrush',
  SPECTRE_PANTS:'spectrepants',
  SPECTRE_WINGS:'spectrewings',
  SPECULAR_FISH:'specularfish',
  SPEED_HAIR_DYE:'speedhairdye',
  SPELUNKER_GLOWSTICK:'spelunkerglowstick',
  SPICY_PEPPER:'spicypepper',
  SPIDER_BOULDER:'spiderboulder',
  SPIDER_BREASTPLATE:'spiderbreastplate',
  SPIDER_EGG:'spideregg',
  SPIDER_FANG:'spiderfang',
  SPIDER_GREAVES:'spidergreaves',
  SPIDER_NEST_BLOCK:'spidernestblock',
  SPIDER_NEST_WALL:'spidernestwall',
  SPIDERFISH:'spiderfish',
  SPIFFO_PLUSH:'spiffoplush',
  SPIKE:'spike',
  SPIKE_BLOCK:'spikeblock',
  SPIKE_WALL:'spikewall',
  SPIKY_BALL_TRAP:'spikyballtrap',
  SPOOKY_TWIG:'spookytwig',
  SPOOKY_WOOD_WALL:'spookywoodwall',
  SPORE_SAC:'sporesac',
  SQUIRES_GREAT_HELM:'squiresgreathelm',
  SQUIRES_GREAVES:'squiresgreaves',
  SQUIRES_PLATING:'squiresplating',
  SQUIRES_SHIELD:'squiresshield',
  SQUIRREL:'squirrel',
  SQUIRREL_CAGE:'squirrelcage',
  STAFFOF_REGROWTH:'staffofregrowth',
  STALACTITE_STONE_WALL:'stalactitestonewall',
  STALKERS_QUIVER:'stalkersquiver',
  STAR:'star',
  STAR_CLOUD:'starcloud',
  STAR_FRUIT:'starfruit',
  STAR_HAIRPIN:'starhairpin',
  STAR_PRINCESS_CROWN:'starprincesscrown',
  STAR_PRINCESS_DRESS:'starprincessdress',
  STAR_ROYALE_BRICK:'starroyalebrick',
  STAR_ROYALE_BRICK_WALL:'starroyalebrickwall',
  STAR_TOPPER1:'startopper1',
  STAR_TOPPER2:'startopper2',
  STAR_TOPPER3:'startopper3',
  STARINA_BOTTLE:'starinabottle',
  STARDROP:'stardrop',
  STARDUST_BRICK:'stardustbrick',
  STARDUST_BRICK_WALL:'stardustbrickwall',
  STARDUST_CHAINSAW:'stardustchainsaw',
  STARDUST_DRILL:'stardustdrill',
  STARDUST_DYE:'stardustdye',
  STARDUST_FRAGMENT_BLOCK:'stardustfragmentblock',
  STARDUST_MONOLITH:'stardustmonolith',
  STARDUST_PLATE:'stardustplate',
  STARFISH:'starfish',
  STARLIGHT:'starlight',
  STARRY_NIGHT:'starrynight',
  STEAK:'steak',
  STEAMPUNK_BOILER:'steampunkboiler',
  STEAMPUNK_GOGGLES:'steampunkgoggles',
  STEAMPUNK_HAT:'steampunkhat',
  STEAMPUNK_MINECART:'steampunkminecart',
  STEAMPUNK_PANTS:'steampunkpants',
  STEAMPUNK_SHIRT:'steampunkshirt',
  STEAMPUNK_WINGS:'steampunkwings',
  STEP_STOOL:'stepstool',
  STICKMANVS_TERR_TERR:'stickmanvsterrterr',
  STICKY_BOMB:'stickybomb',
  STICKY_DIRT_BOMB:'stickydirtbomb',
  STICKY_DYNAMITE:'stickydynamite',
  STICKY_GLOWSTICK:'stickyglowstick',
  STICKY_POWER_BOMB:'stickypowerbomb',
  STILL_LIFE:'stilllife',
  STINGER:'stinger',
  STINGER_NECKLACE:'stingernecklace',
  STINKBUG:'stinkbug',
  STINKBUG_BLOCKER:'stinkbugblocker',
  STINKBUG_CAGE:'stinkbugcage',
  STINKFISH:'stinkfish',
  STOCKADE_CRATE:'stockadecrate',
  STONE_ACCENT_SLAB:'stoneaccentslab',
  STONE_BLOCK:'stoneblock',
  STONE_SLAB:'stoneslab',
  STONE_SLAB_WALL:'stoneslabwall',
  STORM_SPEAR:'stormspear',
  STRANGE_DEAD_FELLOWS:'strangedeadfellows',
  STRANGE_GLOWING_MUSHROOM:'strangeglowingmushroom',
  STRANGE_GROWTH:'strangegrowth',
  STRESS_BALL:'stressball',
  STRUNG_COUNTERWEIGHT:'strungcounterweight',
  STUDYOFA_BALLAT_REST:'studyofaballatrest',
  SUFFICIENTLY_ADVANCED:'sufficientlyadvanced',
  SUGAR_COOKIE:'sugarcookie',
  SUGAR_PLUM:'sugarplum',
  SULPHUR_BUTTERFLY:'sulphurbutterfly',
  SULPHUR_BUTTERFLY_JAR:'sulphurbutterflyjar',
  SUMMONING_POTION:'summoningpotion',
  SUNFLOWER_MINECART:'sunflowerminecart',
  SUNFLOWERS:'sunflowers',
  SUNGLASSES:'sunglasses',
  SUNPLATE_BLOCK:'sunplateblock',
  SUNSHINEOF_ISRAPONY:'sunshineofisrapony',
  SUPER_ABSORBANT_SPONGE:'superabsorbantsponge',
  SUPER_DART_TRAP:'superdarttrap',
  SUPER_MANA_POTION:'supermanapotion',
  SUPERHEATED_BLOOD:'superheatedblood',
  SUPERHERO_COSTUME:'superherocostume',
  SUPERHERO_TIGHTS:'superherotights',
  SUSPICIOUS_GRINNING_EYE:'suspiciousgrinningeye',
  SUSPICIOUS_LOOKING_TENTACLE:'suspiciouslookingtentacle',
  SUSPICIOUSLY_SPARKLY:'suspiciouslysparkly',
  SWARM_GRENADE:'swarmgrenade',
  SWEET_BARB:'sweetbarb',
  SWEETHEART_NECKLACE:'sweetheartnecklace',
  SWITCH:'switch',
  SWORD_RACK:'swordrack',
  SWORDFISH:'swordfish',
  T_N_T_BARREL:'tntbarrel',
  TABLET_FRAGMENT:'tabletfragment',
  TALL_GATE:'tallgate',
  TALL_GRASS_SEEDS:'tallgrassseeds',
  TALLY_COUNTER:'tallycounter',
  TAM_O_SHANTER:'tamoshanter',
  TARGET_DUMMY:'targetdummy',
  TATTERED_BEE_WING:'tatteredbeewing',
  TATTERED_FAIRY_WINGS:'tatteredfairywings',
  TAX_COLLECTORS_HAT:'taxcollectorshat',
  TAX_COLLECTORS_PANTS:'taxcollectorspants',
  TAX_COLLECTORS_SUIT:'taxcollectorssuit',
  TEACUP:'teacup',
  TEAL_DYE:'tealdye',
  TEAL_GOLF_BALL:'tealgolfball',
  TEAL_MUSHROOM:'tealmushroom',
  TEAL_PAINT:'tealpaint',
  TEAL_PRESSURE_PAD:'tealpressurepad',
  TEAL_STRING:'tealstring',
  TEALAND_BLACK_DYE:'tealandblackdye',
  TEALAND_SILVER_DYE:'tealandsilverdye',
  TEAM_DYE:'teamdye',
  TEAM_HAIR_DYE:'teamhairdye',
  TEAPOT:'teapot',
  TELEPORTER:'teleporter',
  TEMPLARS_SLING:'templarssling',
  TEMPLE_KEY:'templekey',
  TERRA_BLADE_CHRONICLES:'terrabladechronicles',
  TERRA_FART_KART:'terrafartkart',
  TERRAFORMER:'terraformer',
  TERRAGRIM:'terragrim',
  TERRARIAN_GOTHIC:'terrariangothic',
  TERRARIUM:'terrarium',
  THE_BEHEADEDS_CUIRASS:'thebeheadedscuirass',
  THE_BEHEADEDS_HEAD:'thebeheadedshead',
  THE_BEHEADEDS_TROUSERS:'thebeheadedstrousers',
  THE_BEREAVED:'thebereaved',
  THE_BLACK_SPOT:'theblackspot',
  THE_CREATIONOFTHE_GUIDE:'thecreationoftheguide',
  THE_CURSED_MAN:'thecursedman',
  THE_DESTROYER:'thedestroyer',
  THE_DIRTIEST_BLOCK:'thedirtiestblock',
  THE_DOCTORS_PANTS:'thedoctorspants',
  THE_DOCTORS_SHIRT:'thedoctorsshirt',
  THE_DUKE:'theduke',
  THE_DUPLICITYOF_REFLECTIONS:'theduplicityofreflections',
  THE_DUTCHMAN:'thedutchman',
  THE_EYE_SEESTHE_END:'theeyeseestheend',
  THE_FIRESTARTER:'thefirestarter',
  THE_FISHOF_CTHULHU:'thefishofcthulhu',
  THE_GENTLEMAN_SCIENTIST:'thegentlemanscientist',
  THE_GRAND_DESIGN:'thegranddesign',
  THE_GUARDIANS_GAZE:'theguardiansgaze',
  THE_HANGED_MAN:'thehangedman',
  THE_HORSEMANS_BLADE:'thehorsemansblade',
  THE_IMPLODER:'theimploder',
  THE_LANDOF_DECEIVING_LOOKS:'thelandofdeceivinglooks',
  THE_MEATBALL:'themeatball',
  THE_MERCHANT:'themerchant',
  THE_PERSISTENCYOF_EYES:'thepersistencyofeyes',
  THE_PLAN:'theplan',
  THE_ROLLING_GREENS:'therollinggreens',
  THE_RUNIC_PIXIE:'therunicpixie',
  THE_SANDSOF_SLIME:'thesandsofslime',
  THE_SCREAMER:'thescreamer',
  THE_SEAOF_SILENCE:'theseaofsilence',
  THE_SEASON:'theseason',
  THE_STRONGMAN:'thestrongman',
  THE_TRUTH_IS_UP_THERE:'thetruthisupthere',
  THE_TWINS_HAVE_AWOKEN:'thetwinshaveawoken',
  THE_WEREWOLF:'thewerewolf',
  THIN_ICE:'thinice',
  THIS_IS_GETTING_OUT_OF_HAND:'thisisgettingoutofhand',
  THORN_CHAKRAM:'thornchakram',
  THRONE:'throne',
  THROUGHTHE_WINDOW:'throughthewindow',
  THUNDERBOLT:'thunderbolt',
  TIARA:'tiara',
  TIGER_CLIMBING_GEAR:'tigerclimbinggear',
  TIGER_SKIN:'tigerskin',
  TIKI_PANTS:'tikipants',
  TIKI_SHIRT:'tikishirt',
  TIKI_TOTEM:'tikitotem',
  TIME_HAIR_DYE:'timehairdye',
  TIMELESS_TRAVELERS_CLOAK:'timelesstravelerscloak',
  TIMELESS_TRAVELERS_FOOTWEAR:'timelesstravelersfootwear',
  TIMELESS_TRAVELERS_HOOD:'timelesstravelershood',
  TIN_BRICK:'tinbrick',
  TIN_BRICK_WALL:'tinbrickwall',
  TIN_CAN:'tincan',
  TIN_PLATING:'tinplating',
  TIN_PLATING_WALL:'tinplatingwall',
  TIN_SHORTSWORD:'tinshortsword',
  TIN_WATCH:'tinwatch',
  TINKERERS_WORKSHOP:'tinkerersworkshop',
  TITANIUM_CHAINSAW:'titaniumchainsaw',
  TITANIUM_CRATE:'titaniumcrate',
  TITANIUM_DRILL:'titaniumdrill',
  TITANIUM_FORGE:'titaniumforge',
  TITANIUM_HEADGEAR:'titaniumheadgear',
  TITANSTONE_BLOCK:'titanstoneblock',
  TITANSTONE_BLOCK_WALL:'titanstoneblockwall',
  TOOLBELT:'toolbelt',
  TOOLBOX:'toolbox',
  TOP_HAT:'tophat',
  TOPAZ_BUNNY:'topazbunny',
  TOPAZ_BUNNY_CAGE:'topazbunnycage',
  TOPAZ_GEM_LOCK:'topazgemlock',
  TOPAZ_GEMCORN:'topazgemcorn',
  TOPAZ_GEMSPARK_BLOCK:'topazgemsparkblock',
  TOPAZ_GEMSPARK_WALL:'topazgemsparkwall',
  TOPAZ_HOOK:'topazhook',
  TOPAZ_MINECART:'topazminecart',
  TOPAZ_ROBE:'topazrobe',
  TOPAZ_SQUIRREL:'topazsquirrel',
  TOPAZ_SQUIRREL_CAGE:'topazsquirrelcage',
  TOPAZ_STONE_BLOCK:'topazstoneblock',
  TOPAZ_STONE_WALL:'topazstonewall',
  TORCH_GODS_FAVOR:'torchgodsfavor',
  TORCH_GODS_FLAVOR:'torchgodsflavor',
  TOUCAN:'toucan',
  TOUCAN_CAGE:'toucancage',
  TOY_SLED:'toysled',
  TOY_TANK:'toytank',
  TOYBREAKER_BRICK:'toybreakerbrick',
  TRAPPED_GHOST:'trappedghost',
  TRASH_CAN:'trashcan',
  TREACHEROUS_HARDENED_SAND_WALL:'treacheroushardenedsandwall',
  TREACHEROUS_SANDSTONE_WALL:'treacheroussandstonewall',
  TREASURE_BAG_BETSY:'treasurebagbetsy',
  TREASURE_BAG_BRAINOF_CTHULHU:'treasurebagbrainofcthulhu',
  TREASURE_BAG_DEERCLOPS:'treasurebagdeerclops',
  TREASURE_BAG_DUKE_FISHRON:'treasurebagdukefishron',
  TREASURE_BAG_EATEROF_WORLDS:'treasurebageaterofworlds',
  TREASURE_BAG_EMPRESSOF_LIGHT:'treasurebagempressoflight',
  TREASURE_BAG_EYEOF_CTHULHU:'treasurebageyeofcthulhu',
  TREASURE_BAG_GOLEM:'treasurebaggolem',
  TREASURE_BAG_KING_SLIME:'treasurebagkingslime',
  TREASURE_BAG_LUNATIC_CULTIST:'treasurebaglunaticcultist',
  TREASURE_BAG_MOON_LORD:'treasurebagmoonlord',
  TREASURE_BAG_PLANTERA:'treasurebagplantera',
  TREASURE_BAG_QUEEN_BEE:'treasurebagqueenbee',
  TREASURE_BAG_QUEEN_SLIME:'treasurebagqueenslime',
  TREASURE_BAG_SKELETRON_PRIME:'treasurebagskeletronprime',
  TREASURE_BAG_SKELETRON:'treasurebagskeletron',
  TREASURE_BAG_THE_DESTROYER:'treasurebagthedestroyer',
  TREASURE_BAG_THE_TWINS:'treasurebagthetwins',
  TREASURE_BAG_WALLOF_FLESH:'treasurebagwallofflesh',
  TREASURE_HUNTER_PANTS:'treasurehunterpants',
  TREASURE_HUNTER_SHIRT:'treasurehuntershirt',
  TREASURE_MAGNET:'treasuremagnet',
  TREASURE_MAP:'treasuremap',
  TREE_GLOBE:'treeglobe',
  TREE_NYMPH_BUTTERFLY:'treenymphbutterfly',
  TREE_NYMPH_BUTTERFLY_JAR:'treenymphbutterflyjar',
  TREE_SHIRT:'treeshirt',
  TREE_TRUNKS:'treetrunks',
  TRIDENT:'trident',
  TRIFOLD_MAP:'trifoldmap',
  TRIMARANG:'trimarang',
  TRIO_SUPER_HEROES:'triosuperheroes',
  TROPICAL_BARRACUDA:'tropicalbarracuda',
  TROPICAL_SMOOTHIE:'tropicalsmoothie',
  TRUE_COPPER_SHORTSWORD:'truecoppershortsword',
  TRUE_NIGHTS_EDGE:'truenightsedge',
  TRUFFLE_WORM_CAGE:'trufflewormcage',
  TRUSTY_CHILLET:'trustychillet',
  TRUSTY_CHILLET_IGNIS:'trustychilletignis',
  TRUSTY_DIGTOISE:'trustydigtoise',
  TULIP_SHELL:'tulipshell',
  TUNA:'tuna',
  TUNDRA_TROUT:'tundratrout',
  TUNGSTEN_BRICK:'tungstenbrick',
  TUNGSTEN_BRICK_WALL:'tungstenbrickwall',
  TUNGSTEN_SHORTSWORD:'tungstenshortsword',
  TUNGSTEN_WATCH:'tungstenwatch',
  TURKEY_WATTLE_NECKLACE:'turkeywattlenecklace',
  TURTLE:'turtle',
  TURTLE_CAGE:'turtlecage',
  TURTLE_HELMET:'turtlehelmet',
  TWILIGHT_DYE:'twilightdye',
  TWILIGHT_GRASP:'twilightgrasp',
  TWILIGHT_HAIR_DYE:'twilighthairdye',
  UGLY_SWEATER:'uglysweater',
  ULTRA_ABSORBANT_SPONGE:'ultraabsorbantsponge',
  ULTRABRIGHT_CAMPFIRE:'ultrabrightcampfire',
  ULTRABRIGHT_HELMET:'ultrabrighthelmet',
  ULURU:'uluru',
  ULYSSES_BUTTERFLY:'ulyssesbutterfly',
  ULYSSES_BUTTERFLY_JAR:'ulyssesbutterflyjar',
  UMBRELLA_HAT:'umbrellahat',
  UNCUMBERING_STONE:'uncumberingstone',
  UNDERGROUND_REWARD:'undergroundreward',
  UNDERWORLD_PYLON:'underworldpylon',
  UNICORN_CROSSINGTHE_HALLOWS:'unicorncrossingthehallows',
  UNICORN_FISH:'unicornfish',
  UNICORN_HORN:'unicornhorn',
  UNICORN_PANTS:'unicornpants',
  UNICORN_SHIRT:'unicornshirt',
  UNICORN_WISP_DYE:'unicornwispdye',
  UNICORNONA_STICK:'unicornonastick',
  USED_GAS_TRAP:'usedgastrap',
  VALHALLA_KNIGHTS_BREASTPLATE:'valhallaknightsbreastplate',
  VALHALLA_KNIGHTS_GREAVES:'valhallaknightsgreaves',
  VALHALLA_KNIGHTS_HELM:'valhallaknightshelm',
  VALKYRIE_YOYO:'valkyrieyoyo',
  VALOR:'valor',
  VAMPIRE_PANTS:'vampirepants',
  VAMPIRE_PENDANT:'vampirependant',
  VAMPIRE_SHIRT:'vampireshirt',
  VARIEGATED_LARDFISH:'variegatedlardfish',
  VENOM_DART_TRAP:'venomdarttrap',
  VIALOF_VENOM:'vialofvenom',
  VICIOUS_MUSHROOM:'viciousmushroom',
  VICIOUS_POWDER:'viciouspowder',
  VICTORIAN_GOTH_DRESS:'victoriangothdress',
  VICTORIAN_GOTH_HAT:'victoriangothhat',
  VIDEO_VISAGE:'videovisage',
  VIKING_HELMET:'vikinghelmet',
  VIKING_VOYAGE:'vikingvoyage',
  VILE_MUSHROOM:'vilemushroom',
  VILE_POWDER:'vilepowder',
  VINE_ROPE:'vinerope',
  VINE_ROPE_COIL:'vineropecoil',
  VIOLET_DYE:'violetdye',
  VIOLET_FLOWER_SEEDS:'violetflowerseeds',
  VIOLET_GOLF_BALL:'violetgolfball',
  VIOLET_GRADIENT_DYE:'violetgradientdye',
  VIOLET_PAINT:'violetpaint',
  VIOLET_STRING:'violetstring',
  VIOLETAND_BLACK_DYE:'violetandblackdye',
  VIOLETAND_SILVER_DYE:'violetandsilverdye',
  VISITINGTHE_PYRAMIDS:'visitingthepyramids',
  VITAMINS:'vitamins',
  VOID_BAG:'voidbag',
  VOID_DYE:'voiddye',
  VOID_MONOLITH:'voidmonolith',
  VOID_VAULT:'voidvault',
  VOLATILE_GELATIN:'volatilegelatin',
  VORTEX_BOOSTER:'vortexbooster',
  VORTEX_BRICK:'vortexbrick',
  VORTEX_BRICK_WALL:'vortexbrickwall',
  VORTEX_CHAINSAW:'vortexchainsaw',
  VORTEX_DRILL:'vortexdrill',
  VORTEX_DYE:'vortexdye',
  VORTEX_FRAGMENT_BLOCK:'vortexfragmentblock',
  VORTEX_MONOLITH:'vortexmonolith',
  VULKELF_EARS:'vulkelfears',
  WALDO:'waldo',
  WALL_ANCHOR:'wallanchor',
  WALL_RACER_CAR:'wallracercar',
  WALL_SKELETON:'wallskeleton',
  WANDERING_GETA:'wanderinggeta',
  WANDERING_JINGASA:'wanderingjingasa',
  WANDERING_YUKATA:'wanderingyukata',
  WARMTH_POTION:'warmthpotion',
  WATCHFUL_ANTLION:'watchfulantlion',
  WATER_BUCKET:'waterbucket',
  WATER_GUN:'watergun',
  WATER_STRIDER:'waterstrider',
  WATER_STRIDER_CAGE:'waterstridercage',
  WATERFALL_BLOCK:'waterfallblock',
  WATERLEAF:'waterleaf',
  WATERLEAF_PLANTER_BOX:'waterleafplanterbox',
  WATERLEAF_SEEDS:'waterleafseeds',
  WAVY_DIRT_WALL:'wavydirtwall',
  WEAPON_RACK:'weaponrack',
  WEATHER_VANE:'weathervane',
  WEB_ROPE:'webrope',
  WEB_ROPE_COIL:'webropecoil',
  WEDDING_DRESS:'weddingdress',
  WEDDING_VEIL:'weddingveil',
  WET_BOMB:'wetbomb',
  WHAT_LURKS_BELOW:'whatlurksbelow',
  WHITE_BULB:'whitebulb',
  WHITE_DYNASTY_WALL:'whitedynastywall',
  WHITE_FLOWER_SEEDS:'whiteflowerseeds',
  WHITE_GARLAND:'whitegarland',
  WHITE_HORSESHOE_BALLOON:'whitehorseshoeballoon',
  WHITE_PAINT:'whitepaint',
  WHITE_PEARL:'whitepearl',
  WHITE_PIN_FLAG:'whitepinflag',
  WHITE_SOLUTION:'whitesolution',
  WHITE_STRING:'whitestring',
  WHITE_TEAM_BLOCK:'whiteteamblock',
  WHITE_TUXEDO_PANTS:'whitetuxedopants',
  WHITE_TUXEDO_SHIRT:'whitetuxedoshirt',
  WHITEAND_GREEN_BULB:'whiteandgreenbulb',
  WHITEAND_RED_BULB:'whiteandredbulb',
  WHITEAND_RED_GARLAND:'whiteandredgarland',
  WHITEAND_YELLOW_BULB:'whiteandyellowbulb',
  WHOOPIE_CUSHION:'whoopiecushion',
  WICKED_ARMLET:'wickedarmlet',
  WICKED_CLAWS:'wickedclaws',
  WICKED_UNDEAD:'wickedundead',
  WILD_FLOWER_SEEDS:'wildflowerseeds',
  WILDFLOWERS:'wildflowers',
  WILLS_BREASTPLATE:'willsbreastplate',
  WILLS_HELMET:'willshelmet',
  WILLS_LEGGINGS:'willsleggings',
  WILLS_WINGS:'willswings',
  WILTED_CLOVER:'wiltedclover',
  WINE_GLASS:'wineglass',
  WINGSOF_EVIL:'wingsofevil',
  WINTER_AT_VARINGSKOLLEN:'winteratvaringskollen',
  WINTER_CAPE:'wintercape',
  WIRE:'wire',
  WIRE_BULB:'wirebulb',
  WIRE_CUTTER:'wirecutter',
  WISP_DYE:'wispdye',
  WITCH_BOOTS:'witchboots',
  WITCH_DRESS:'witchdress',
  WITCH_HAT:'witchhat',
  WITCHS_BROOM:'witchsbroom',
  WIZARD_HAT:'wizardhat',
  WIZARDS_HAT:'wizardshat',
  WOLF_PANTS:'wolfpants',
  WOLF_SHIRT:'wolfshirt',
  WOMANNEQUIN:'womannequin',
  WOOD_BREASTPLATE:'woodbreastplate',
  WOOD_FISHING_POLE:'woodfishingpole',
  WOOD_GREAVES:'woodgreaves',
  WOOD_HELMET:'woodhelmet',
  WOOD_SHELF:'woodshelf',
  WOODEN_BEAM:'woodenbeam',
  WOODEN_BOOMERANG:'woodenboomerang',
  WOODEN_FENCE:'woodenfence',
  WOODEN_SPIKE:'woodenspike',
  WOODEN_YOYO:'woodenyoyo',
  WORLD_GLOBE:'worldglobe',
  WORM_CAGE:'wormcage',
  WORM_HOOK:'wormhook',
  WORM_SCARF:'wormscarf',
  WORM_TOOTH:'wormtooth',
  WORN_GOLF_CLUB_DRIVER:'worngolfclubdriver',
  WORN_GOLF_CLUB_IRON:'worngolfclubiron',
  WORN_GOLF_CLUB_PUTTER:'worngolfclubputter',
  WORN_GOLF_CLUB_WEDGE:'worngolfclubwedge',
  WORN_STONE_WALL:'wornstonewall',
  WRITHING_REMAINS:'writhingremains',
  WROUGHT_IRON_FENCE:'wroughtironfence',
  WYVERNTAIL:'wyverntail',
  XENON_MOSS:'xenonmoss',
  XENON_MOSS_BRICK:'xenonmossbrick',
  XENON_MOSS_BRICK_WALL:'xenonmossbrickwall',
  XENON_MOSS_FISHING_BOBBER:'xenonmossfishingbobber',
  YELLOW_BULB:'yellowbulb',
  YELLOW_COCKATIEL:'yellowcockatiel',
  YELLOW_COCKATIEL_CAGE:'yellowcockatielcage',
  YELLOW_COUNTERWEIGHT:'yellowcounterweight',
  YELLOW_DRAGONFLY:'yellowdragonfly',
  YELLOW_DRAGONFLY_JAR:'yellowdragonflyjar',
  YELLOW_FLOWER_SEEDS:'yellowflowerseeds',
  YELLOW_GOLF_BALL:'yellowgolfball',
  YELLOW_GRADIENT_DYE:'yellowgradientdye',
  YELLOW_HORSESHOE_BALLOON:'yellowhorseshoeballoon',
  YELLOW_LIGHTS:'yellowlights',
  YELLOW_MARIGOLD:'yellowmarigold',
  YELLOW_PAINT:'yellowpaint',
  YELLOW_PIN_FLAG:'yellowpinflag',
  YELLOW_PRESENT:'yellowpresent',
  YELLOW_PRESSURE_PLATE:'yellowpressureplate',
  YELLOW_ROCKET:'yellowrocket',
  YELLOW_SOLUTION:'yellowsolution',
  YELLOW_STAINED_GLASS:'yellowstainedglass',
  YELLOW_STRING:'yellowstring',
  YELLOW_STUCCO:'yellowstucco',
  YELLOW_STUCCO_WALL:'yellowstuccowall',
  YELLOW_TEAM_BLOCK:'yellowteamblock',
  YELLOW_WILLOW_SAPLING:'yellowwillowsapling',
  YELLOW_WRENCH:'yellowwrench',
  YELLOWAND_BLACK_DYE:'yellowandblackdye',
  YELLOWAND_GREEN_BULB:'yellowandgreenbulb',
  YELLOWAND_GREEN_LIGHTS:'yellowandgreenlights',
  YELLOWAND_SILVER_DYE:'yellowandsilverdye',
  YORAIZ0RS_RECOLORED_GOGGLES:'yoraiz0rsrecoloredgoggles',
  YORAIZ0RS_SCOWL:'yoraiz0rsscowl',
  YORAIZ0RS_SKIRT:'yoraiz0rsskirt',
  YORAIZ0RS_SPELL:'yoraiz0rsspell',
  YORAIZ0RS_UNIFORM:'yoraiz0rsuniform',
  YOYO_GLOVE:'yoyoglove',
  YUUMA_THE_BLUE_TIGER:'yuumathebluetiger',
  ZEBRA_SKIN:'zebraskin',
  ZEBRA_SWALLOWTAIL_BUTTERFLY:'zebraswallowtailbutterfly',
  ZEBRA_SWALLOWTAIL_BUTTERFLY_JAR:'zebraswallowtailbutterflyjar',
  ZENITH:'zenith',
  ZOMBIE_FISH:'zombiefish',
  R_TERRARIA:'rterraria',
  R_TERRARIA2023:'rterraria2023',
    BOSSBAG:'bossbag'
};

var ITEMS = {};
function defItem(id, d) { d.id = id; d.maxStack = d.maxStack || 999; ITEMS[id] = d; }

// --- Materials / blocks ---
defItem(I.DIRT, { name:'Dirt', type:'block', tile:T.DIRT, color:'#8a6642', icon:'block', desc:'Basic building material.' });
defItem(I.STONE, { name:'Stone', type:'block', tile:T.STONE, color:'#7a7f8c', icon:'block', desc:'Smelt iron ore into bars.' });
defItem(I.SAND, { name:'Sand', type:'block', tile:T.SAND, color:'#e8d191', icon:'block' });
defItem(I.WOOD, { name:'Wood', type:'block', tile:T.WOOD, color:'#9a6b3f', icon:'block', desc:'From chopping trees. Craft into platforms.' });
defItem(I.PLATFORM, { name:'Wood Platform', type:'block', tile:T.PLATFORM, color:'#b5824f', icon:'block', desc:'Stand and pass through, like a floor you can jump through.' });
defItem(I.PEARLSTONE, { name:'Pearlstone', type:'block', tile:T.PEARLSTONE, color:'#e6d9ff', icon:'block', desc:'Blessed stone of the Hallow.' });
defItem(I.EBONSTONE, { name:'Ebonstone', type:'block', tile:T.EBONSTONE, color:'#6d5a8c', icon:'block' });
defItem(I.CRIMSTONE, { name:'Crimstone', type:'block', tile:T.CRIMSTONE, color:'#8a4a4a', icon:'block', desc:'Bleeding stone of the Crimson.' });
defItem(I.CRIMTANE, { name:'Crimtane Ore', type:'block', tile:T.CRIMTANE, color:'#c04048', icon:'block', desc:'Crimson ore. Smelt into bars.' });
defItem(I.ASH, { name:'Ash Block', type:'block', tile:T.ASH, color:'#5a5348', icon:'block', desc:'Charred earth of the Underworld.' });
defItem(I.HELLSTONE, { name:'Hellstone Ore', type:'block', tile:T.HELLSTONE, color:'#e84828', icon:'block', desc:'The burning ore of Hell.' });
defItem(I.HELLBRICK, { name:'Hellstone Brick', type:'block', tile:T.HELLBRICK, color:'#7a3a2a', icon:'block', desc:'Ancient hellstone masonry.' });
defItem(I.CLOUD, { name:'Cloud Block', type:'block', tile:T.CLOUD, color:'#e8f0f8', icon:'block', desc:'Light as air. Falls from sky islands.' });
defItem(I.GRANITE, { name:'Granite Block', type:'block', tile:T.GRANITE, color:'#8a8a9a', icon:'block', desc:'Dense gray rock.' });
defItem(I.MARBLE, { name:'Marble Block', type:'block', tile:T.MARBLE, color:'#e8e8f0', icon:'block', desc:'Smooth white stone.' });
defItem(I.OBSIDIAN, { name:'Obsidian', type:'block', tile:T.OBSIDIAN, color:'#3a2a3a', icon:'block', desc:'Black volcanic glass.' });
defItem(I.COBALT, { name:'Cobalt Ore', type:'block', tile:T.COBALT, color:'#2a5fd0', icon:'block', desc:'A hardmode ore. Smelt into bars.' });
defItem(I.MYTHRIL, { name:'Mythril Ore', type:'block', tile:T.MYTHRIL, color:'#2fbf8f', icon:'block', desc:'A hardmode ore. Smelt into bars.' });
defItem(I.ADAMANTITE, { name:'Adamantite Ore', type:'block', tile:T.ADAMANTITE, color:'#c43d3d', icon:'block', desc:'The deepest hardmode ore.' });
defItem(I.IRON, { name:'Iron Ore', type:'block', tile:T.IRON, color:'#d0b090', icon:'block', desc:'Smelt into iron bars at a furnace.' });
defItem(I.COBWEB, { name:'Cobweb', type:'block', tile:T.COBWEB, color:'#e8e8e8', icon:'block', maxStack:99 });
defItem(I.GLOWSTONE, { name:'Glowstone', type:'block', tile:T.GLOWSTONE, color:'#9de0ff', icon:'block', desc:'Softly glows in the dark.' });
defItem(I.TORCH, { name:'Torch', type:'block', tile:T.TORCH, color:'#ffb84d', icon:'block', desc:'Provides light. Placeable.' });

// --- Bars ---
defItem(I.IRONBAR, { name:'Iron Bar', type:'bar', color:'#cfd0d6', icon:'bar', desc:'Craft an anvil with 5.' });
defItem(I.COBALTBAR, { name:'Cobalt Bar', type:'bar', color:'#3a7dff', icon:'bar' });
defItem(I.MYTHRILBAR, { name:'Mythril Bar', type:'bar', color:'#3ed6a0', icon:'bar' });
defItem(I.ADAMANTITEBAR, { name:'Adamantite Bar', type:'bar', color:'#e05555', icon:'bar' });
defItem(I.HALLOWEDBAR, { name:'Hallowed Bar', type:'bar', color:'#e6d13f', icon:'bar', desc:'Smelted from souls dropped by the mechanical bosses.' });

// --- Melee weapons ---
defItem(I.WOODSWORD, { name:'Wooden Sword', type:'melee', dmg:7, speed:0.333, kb:5, range:4, color:'#b5824f', icon:'🗡️', maxStack:1, desc:'Better than nothing.' });
defItem(I.COBALTSWORD, { name:'Cobalt Sword', type:'melee', dmg:40, speed:0.317, kb:5, range:4, color:'#3a7dff', icon:'🗡️', maxStack:1, desc:'Forged from cobalt.' });
defItem(I.MYTHRILSWORD, { name:'Mythril Sword', type:'melee', dmg:50, speed:0.333, kb:6, range:4, color:'#3ed6a0', icon:'🗡️', maxStack:1 });
defItem(I.ADAMANTITESWORD, { name:'Adamantite Sword', type:'melee', dmg:61, speed:0.35, kb:6, range:4, color:'#e05555', icon:'⚔️', maxStack:1 });
defItem(I.EXCALIBUR, { name:'Excalibur', type:'melee', dmg:72, speed:0.333, kb:4.5, range:4, meleeProj:P.LASER, projSpeed:10, projLife:1.1, projDamageMul:0.65, color:'#ffe14d', icon:'⭐', maxStack:1, desc:'The legendary blade of Hallowed metal. Its beam sears enemies.' });

// --- Tools ---
defItem(I.IRONPICK, { name:'Iron Pickaxe', type:'tool', power:40, speed:1.0, dmg:5, range:3.2, color:'#d0d0d6', icon:'⛏️', maxStack:1, desc:'Mines cobalt ore.' });
defItem(I.COBALTPICK, { name:'Cobalt Pickaxe', type:'tool', power:110, speed:1.5, dmg:10, range:3.4, color:'#3a7dff', icon:'⛏️', maxStack:1, desc:'Mines mythril ore.' });
defItem(I.MYTHRILPICK, { name:'Mythril Pickaxe', type:'tool', power:150, speed:2.0, dmg:15, range:3.6, color:'#3ed6a0', icon:'⛏️', maxStack:1, desc:'Mines adamantite ore.' });
defItem(I.ADAMANTITEPICK, { name:'Adamantite Pickaxe', type:'tool', power:180, speed:2.6, dmg:20, range:3.8, color:'#e05555', icon:'⛏️', maxStack:1, desc:'The finest pickaxe.' });

// --- Ranged ---
defItem(I.ARROW, { name:'Wooden Arrow', type:'ammo', dmg:5, color:'#d8b28a', icon:'➶', maxStack:999 });
defItem(I.IRONBOW, { name:'Iron Bow', type:'ranged', dmg:8, speed:0.467, kb:2, ammo:I.ARROW, proj:P.ARROW, range:999, color:'#b5824f', icon:'🏹', maxStack:1, desc:'Shoots arrows. Hold to fire.', projSpeed:6.6});
defItem(I.HALLOWEDREPEATER, { name:'Hallowed Repeater', type:'ranged', dmg:53, speed:0.267, kb:2.5, ammo:I.HOLYARROW, proj:P.ARROW, auto:true, range:999, color:'#ffe14d', icon:'🏹', maxStack:1, desc:'Rapid-fire crossbow of the Hallow.', projSpeed:11});

// --- Magic ---
defItem(I.LASERRIFLE, { name:'Laser Rifle', type:'magic', dmg:29, speed:0.2, kb:2.5, mana:8, proj:P.LASER, auto:true, range:999, color:'#ff4d6d', icon:'🔫', maxStack:1, desc:'A beam of pure death. Costs mana.', projSpeed:17});
defItem(I.CRYSTALSTORM, { name:'Crystal Storm', type:'magic', dmg:35, speed:0.117, kb:5, mana:5, proj:P.MAGICBOLT, projCount:3, auto:true, range:999, color:'#ff9de0', icon:'🔮', maxStack:1, desc:'Shards of crystal fly everywhere. Costs mana.', projSpeed:16});

// --- Armor ---
defItem(I.COBALTHELM, { name:'Cobalt Helmet', type:'armor', slot:'head', def:5, color:'#3a7dff', icon:'🪖', maxStack:1, desc:'Defense +5' });
defItem(I.COBALTCHEST, { name:'Cobalt Breastplate', type:'armor', slot:'chest', def:7, color:'#3a7dff', icon:'🥋', maxStack:1, desc:'Defense +7' });
defItem(I.COBALTLEGS, { name:'Cobalt Leggings', type:'armor', slot:'legs', def:5, color:'#3a7dff', icon:'👖', maxStack:1, desc:'Defense +5' });
defItem(I.MYTHRILHELM, { name:'Mythril Helmet', type:'armor', slot:'head', def:7, color:'#3ed6a0', icon:'🪖', maxStack:1, desc:'Defense +7' });
defItem(I.MYTHRILCHEST, { name:'Mythril Breastplate', type:'armor', slot:'chest', def:9, color:'#3ed6a0', icon:'🥋', maxStack:1, desc:'Defense +9' });
defItem(I.MYTHRILLEGS, { name:'Mythril Leggings', type:'armor', slot:'legs', def:7, color:'#3ed6a0', icon:'👖', maxStack:1, desc:'Defense +7' });
defItem(I.ADAMANTITEHELM, { name:'Adamantite Helmet', type:'armor', slot:'head', def:9, color:'#e05555', icon:'🪖', maxStack:1, desc:'Defense +9' });
defItem(I.ADAMANTITECHEST, { name:'Adamantite Breastplate', type:'armor', slot:'chest', def:11, color:'#e05555', icon:'🥋', maxStack:1, desc:'Defense +11' });
defItem(I.ADAMANTITELEGS, { name:'Adamantite Leggings', type:'armor', slot:'legs', def:9, color:'#e05555', icon:'👖', maxStack:1, desc:'Defense +9' });
defItem(I.HALLOWEDHELM, { name:'Hallowed Helmet', type:'armor', slot:'head', def:12, color:'#ffe14d', icon:'🪖', maxStack:1, desc:'Defense +12' });
defItem(I.HALLOWEDCHEST, { name:'Hallowed Breastplate', type:'armor', slot:'chest', def:15, color:'#ffe14d', icon:'🥋', maxStack:1, desc:'Defense +15' });
defItem(I.HALLOWEDLEGS, { name:'Hallowed Leggings', type:'armor', slot:'legs', def:11, color:'#ffe14d', icon:'👖', maxStack:1, desc:'Defense +11' });

// --- Consumables ---
defItem(I.HEALINGPOTION, { name:'Healing Potion', type:'consumable', heal:100, color:'#ff5c8a', icon:'🧪', maxStack:30, desc:'Restores 100 health.' });
defItem(I.MANAPOTION, { name:'Mana Potion', type:'consumable', mana:100, color:'#6bc8ff', icon:'🫗', maxStack:30, desc:'Restores 100 mana.' });

// --- Summons ---
defItem(I.MECH_EYE, { name:'Mechanical Eye', type:'summon', boss:'twins', color:'#c44', icon:'👁️', maxStack:99, desc:'Summons The Twins. Use at night.' });
defItem(I.MECH_WORM, { name:'Mechanical Worm', type:'summon', boss:'destroyer', color:'#8a8', icon:'🪱', maxStack:99, desc:'Summons The Destroyer.' });
defItem(I.MECH_SKULL, { name:'Mechanical Skull', type:'summon', boss:'skeletronprime', color:'#ccc', icon:'💀', maxStack:99, desc:'Summons Skeletron Prime.' });

// --- Souls & hearts ---
defItem(I.HEART, { name:'Heart Crystal', type:'consumable', heart:20, color:'#ff5c8a', icon:'💖', maxStack:99, desc:'Increases max health by 20.' });
defItem(I.MANACRYSTAL, { name:'Mana Crystal', type:'consumable', star:20, color:'#6bc8ff', icon:'💠', maxStack:99, desc:'Increases max mana by 20. Crafted from Fallen Stars.' });
defItem(I.SOUL_LIGHT, { name:'Soul of Light', type:'material', color:'#ffe9a8', icon:'✨', maxStack:999, desc:'Dropped by Hallow creatures.' });
defItem(I.SOUL_NIGHT, { name:'Soul of Night', type:'material', color:'#a9b0ff', icon:'🌑', maxStack:999, desc:'Dropped by Corruption creatures.' });
defItem(I.SOUL_MIGHT, { name:'Soul of Might', type:'material', color:'#ffd75e', icon:'⚡', maxStack:999, desc:'Dropped by The Destroyer.' });
defItem(I.SOUL_SIGHT, { name:'Soul of Sight', type:'material', color:'#8a4dff', icon:'👁️', maxStack:999, desc:'Dropped by The Twins.' });
defItem(I.SOUL_FRIGHT, { name:'Soul of Fright', type:'material', color:'#ff5c4d', icon:'😱', maxStack:999, desc:'Dropped by Skeletron Prime.' });
defItem(I.FRAG_SOLAR, { name:'Solar Fragment', type:'material', color:'#ff9a3d', icon:'🔥', maxStack:999, desc:'Lunar essence of the sun.' });
defItem(I.FRAG_NEBULA, { name:'Nebula Fragment', type:'material', color:'#c85cff', icon:'🔮', maxStack:999, desc:'Lunar essence of the nebula.' });
defItem(I.FRAG_VORTEX, { name:'Vortex Fragment', type:'material', color:'#3dff9d', icon:'🌀', maxStack:999, desc:'Lunar essence of the vortex.' });
defItem(I.FRAG_STARDUST, { name:'Stardust Fragment', type:'material', color:'#6bc8ff', icon:'✨', maxStack:999, desc:'Lunar essence of the stars.' });

// --- New blocks ---
defItem(I.MUD, { name:'Mud', type:'block', tile:T.MUD, color:'#5a4632', icon:'block', desc:'Jungle soil. Chlorophyte grows in it.' });
defItem(I.TEMPLEBRICK, { name:'Lihzahrd Brick', type:'block', tile:T.TEMPLEBRICK, color:'#8a5a3a', icon:'block', desc:'Only the Picksaw can break it.' });
defItem(I.TITANIUM, { name:'Titanium Ore', type:'block', tile:T.TITANIUM, color:'#8a8f9a', icon:'block', desc:'A rare deep hardmode ore.' });
defItem(I.ORICHALCUM, { name:'Orichalcum Ore', type:'block', tile:T.ORICHALCUM, color:'#c85cff', icon:'block', desc:'A pink hardmode ore.' });
defItem(I.CHLOROPHYTE, { name:'Chlorophyte Ore', type:'block', tile:T.CHLOROPHYTE, color:'#4dff6b', icon:'block', desc:'The living ore of the jungle.' });

// --- New bars ---
defItem(I.TITANIUMBAR, { name:'Titanium Bar', type:'bar', color:'#c8ccd4', icon:'bar' });
defItem(I.ORICHALCUMBAR, { name:'Orichalcum Bar', type:'bar', color:'#e68cff', icon:'bar' });
defItem(I.CHLOROPHYTEBAR, { name:'Chlorophyte Bar', type:'bar', color:'#6bff8a', icon:'bar', desc:'The living metal of the jungle.' });

// --- New melee ---
defItem(I.ORICHALCUMSWORD, { name:'Orichalcum Sword', type:'melee', dmg:59, speed:0.367, kb:6, range:4, color:'#e68cff', icon:'🗡️', maxStack:1 });
defItem(I.TITANIUMSWORD, { name:'Titanium Sword', type:'melee', dmg:61, speed:0.333, kb:6, range:4, color:'#c8ccd4', icon:'⚔️', maxStack:1 });
defItem(I.CHLOROPHYTESABER, { name:'Chlorophyte Saber', type:'melee', dmg:80, speed:0.5, kb:5, range:4, meleeProj:P.SPORE, projSpeed:7, projLife:1.2, projDamageMul:0.55, color:'#4dff6b', icon:'⚔️', maxStack:1, desc:'Sends spores at your foes.' });
defItem(I.TERRABLADE, { name:'Terra Blade', type:'melee', dmg:85, speed:0.3, kb:6.5, range:4, meleeProj:P.PLASMA, projSpeed:10, projLife:1.5, projDamageMul:0.75, color:'#3dff9d', icon:'🌱', maxStack:1, desc:'The ultimate blade. Fires a green wave.' });
defItem(I.STARFURY, { name:'Starfury', type:'melee', dmg:25, speed:0.333, kb:5, range:4, meleeRainProj:P.BLAZE, rainDamageMul:0.7, color:'#ffe9a8', icon:'⭐', maxStack:1, desc:'A blade that calls down stars. Found in sky chests.' });

// --- New tools ---
defItem(I.TITANIUMPICK, { name:'Titanium Pickaxe', type:'tool', power:190, speed:2.8, dmg:27, range:3.8, color:'#c8ccd4', icon:'⛏️', maxStack:1, desc:'Mines chlorophyte ore.' });
defItem(I.PICKAXEAXE, { name:'Pickaxe Axe', type:'tool', power:200, speed:3.0, dmg:35, range:3.9, color:'#ffe14d', icon:'⛏️', maxStack:1, desc:'A hallowed axe-pick hybrid.' });
defItem(I.DRAX, { name:'Drax', type:'tool', power:200, speed:3.4, dmg:35, range:4.0, color:'#6bff8a', icon:'⛏️', maxStack:1, desc:'A drill-axe of living metal.' });
defItem(I.PICKSHAW, { name:'Picksaw', type:'tool', power:210, speed:4.0, dmg:34, range:4.2, color:'#ffb84d', icon:'⛏️', maxStack:1, desc:'Dropped by Golem. Breaks Lihzahrd brick.' });

// --- New ranged ---
defItem(I.BULLET, { name:'Crystal Bullet', type:'ammo', dmg:9, color:'#ff9de0', icon:'⚫', maxStack:999 });
defItem(I.MEGASHARK, { name:'Megashark', type:'ranged', dmg:25, speed:0.117, kb:1, ammo:I.BULLET, proj:P.GUNBULLET, auto:true, range:999, color:'#8a8f9a', icon:'🔫', maxStack:1, desc:'A shark named gun. Devours ammo.', projSpeed:10});

// --- New magic ---
defItem(I.GOLDENSHOWER, { name:'Golden Shower', type:'magic', dmg:30, speed:0.3, kb:4, mana:7, proj:P.CURSEDFLAME, projCount:3, status:{type:'ichor',duration:5,defense:12}, auto:true, range:999, color:'#ffd75e', icon:'🌧️', maxStack:1, desc:'Coats enemies in defense-shredding ichor.', projSpeed:10});
defItem(I.RAINBOWROD, { name:'Rainbow Rod', type:'magic', dmg:50, speed:0.417, kb:6, mana:21, proj:P.RAINBOW, magicMode:'controlled', controlledReach:32, controlledSpeed:9, controlledDuration:4, auto:true, range:999, color:'#ff9de0', icon:'🌈', maxStack:1, desc:'A rainbow guided by the cursor.', projSpeed:6});
defItem(I.RAZORBLADETYPHOON, { name:'Razorblade Typhoon', type:'magic', dmg:85, speed:0.667, kb:5, mana:20, proj:P.RAZOR, projCount:2, projHoming:true, auto:true, range:999, color:'#6bc8ff', icon:'🌪️', maxStack:1, desc:'Dropped by Duke Fishron. A storm of homing blades.', projSpeed:6});
defItem(I.LASTPRISM, { name:'Last Prism', type:'magic', dmg:100, speed:0.167, kb:0.25, mana:12, proj:P.PRISM, magicMode:'beam', channelRange:42, channelManaInterval:0.12, hitCooldown:0.12, auto:true, range:999, color:'#ffe14d', icon:'💎', maxStack:1, desc:'The Moon Lord\'s continuous rainbow beam.', projSpeed:30});

// --- Summoner whips ---
defItem(I.LEATHERWHIP, { name:'Leather Whip', type:'whip', dmg:14, speed:0.4, kb:1, range:2.6, tagDamage:4, tagDuration:4, color:'#b5824f', icon:'🔗', maxStack:1, desc:'Marks enemies for +4 minion damage.' });
defItem(I.FIRECRACKER, { name:'Firecracker', type:'whip', dmg:37, speed:0.3, kb:2, range:3.0, tagDamage:8, tagDuration:4, tagExplosive:0.8, color:'#ff4d4d', icon:'🧨', maxStack:1, desc:'The next minion hit bursts around the tagged enemy.' });
defItem(I.KALEIDOSCOPE, { name:'Kaleidoscope', type:'whip', dmg:170, speed:0.22, kb:4, range:3.4, tagDamage:20, tagDuration:4, color:'#ff9de0', icon:'🪄', maxStack:1, desc:'Marks enemies for +20 minion damage.' });

// --- Summoner staves ---
defItem(I.IMPSTAFF, { name:'Imp Staff', type:'summonstaff', dmg:17, minion:'imp', speed:0, color:'#ff6b3d', icon:'😈', maxStack:1, desc:'Summons an Imp to fight for you.' });
defItem(I.OPTICSTAFF, { name:'Optic Staff', type:'summonstaff', dmg:24, minion:'twin', speed:0, color:'#ff3d4d', icon:'👁️', maxStack:1, desc:'Summons Twins minions to fight for you.' });
defItem(I.STARDUSTDRAGONSTAFF, { name:'Stardust Dragon Staff', type:'summonstaff', dmg:40, minion:'dragon', speed:0, color:'#6bc8ff', icon:'🐉', maxStack:1, desc:'Summons a Stardust Dragon.' });

// --- Armor - Orichalcum ---
defItem(I.ORICHALCUMHELM, { name:'Orichalcum Helmet', type:'armor', slot:'head', def:8, color:'#e68cff', icon:'🪖', maxStack:1, desc:'Defense +8' });
defItem(I.ORICHALCUMCHEST, { name:'Orichalcum Breastplate', type:'armor', slot:'chest', def:10, color:'#e68cff', icon:'🥋', maxStack:1, desc:'Defense +10' });
defItem(I.ORICHALCUMLEGS, { name:'Orichalcum Leggings', type:'armor', slot:'legs', def:8, color:'#e68cff', icon:'👖', maxStack:1, desc:'Defense +8' });
// Armor - Titanium
defItem(I.TITANIUMHELM, { name:'Titanium Helmet', type:'armor', slot:'head', def:10, color:'#c8ccd4', icon:'🪖', maxStack:1, desc:'Defense +10' });
defItem(I.TITANIUMCHEST, { name:'Titanium Breastplate', type:'armor', slot:'chest', def:13, color:'#c8ccd4', icon:'🥋', maxStack:1, desc:'Defense +13' });
defItem(I.TITANIUMLEGS, { name:'Titanium Leggings', type:'armor', slot:'legs', def:10, color:'#c8ccd4', icon:'👖', maxStack:1, desc:'Defense +10' });
// Armor - Chlorophyte
defItem(I.CHLOROPHYTEHELM, { name:'Chlorophyte Helmet', type:'armor', slot:'head', def:14, color:'#4dff6b', icon:'🪖', maxStack:1, desc:'Defense +14' });
defItem(I.CHLOROPHYTECHEST, { name:'Chlorophyte Breastplate', type:'armor', slot:'chest', def:18, color:'#4dff6b', icon:'🥋', maxStack:1, desc:'Defense +18' });
defItem(I.CHLOROPHYTELEGS, { name:'Chlorophyte Leggings', type:'armor', slot:'legs', def:13, color:'#4dff6b', icon:'👖', maxStack:1, desc:'Defense +13' });
// Armor - Spectre
defItem(I.SPECTREHELM, { name:'Spectre Hood', type:'armor', slot:'head', def:12, color:'#e6e6f0', icon:'🪖', maxStack:1, desc:'Defense +12' });
defItem(I.SPECTRECHEST, { name:'Spectre Robe', type:'armor', slot:'chest', def:16, color:'#e6e6f0', icon:'🥋', maxStack:1, desc:'Defense +16' });
defItem(I.SPECTRELEGS, { name:'Spectre Leggings', type:'armor', slot:'legs', def:12, color:'#e6e6f0', icon:'👖', maxStack:1, desc:'Defense +12' });
// Armor - Beetle
defItem(I.BEETLEHELM, { name:'Beetle Helmet', type:'armor', slot:'head', def:18, color:'#8a9a5c', icon:'🪖', maxStack:1, desc:'Defense +18' });
defItem(I.BEETLECHEST, { name:'Beetle Shell', type:'armor', slot:'chest', def:24, color:'#8a9a5c', icon:'🥋', maxStack:1, desc:'Defense +24' });
defItem(I.BEETLELEGS, { name:'Beetle Leggings', type:'armor', slot:'legs', def:17, color:'#8a9a5c', icon:'👖', maxStack:1, desc:'Defense +17' });

// --- Accessories ---
defItem(I.SPECTREBOOTS, { name:'Spectre Boots', type:'accessory', color:'#6bc8ff', icon:'👟', maxStack:1, runSpeed:1.3, desc:'Increases running speed.' });
defItem(I.REGENSBAND, { name:'Regeneration Band', type:'accessory', color:'#ff6b8a', icon:'💍', maxStack:1, regen:30, desc:'Regenerates health over time.' });
defItem(I.CELESTIALSTONE, { name:'Celestial Stone', type:'accessory', color:'#ffd75e', icon:'🪨', maxStack:1, dmgMul:1.15, def:2, desc:'Increases damage by 15% and defense by 2.' });
defItem(I.MANAFLOWER, { name:'Mana Flower', type:'accessory', color:'#6b8aff', icon:'🌸', maxStack:1, manaMul:0.75, desc:'Reduces mana costs by 25%.' });
defItem(I.STARVEIL, { name:'Star Veil', type:'accessory', color:'#ffe9a8', icon:'🌠', maxStack:1, invuln:0.7, desc:'Longer invulnerability after a hit.' });
defItem(I.TURTLESHELL, { name:'Turtle Shell', type:'accessory', color:'#5c8a3d', icon:'🐢', maxStack:1, def:6, desc:'Defense +6.' });

// --- Boss summons ---
defItem(I.QUEENSLIMEGEL, { name:'Queen Slime Gel', type:'summon', boss:'queenslime', color:'#ff8fd0', icon:'💧', maxStack:99, desc:'Summons the Queen Slime.' });
defItem(I.TRUFFLEWORM, { name:'Truffle Worm', type:'summon', boss:'duke', color:'#8a5c4a', icon:'🪱', maxStack:99, desc:'Summons Duke Fishron. Use in the ocean.' });
defItem(I.PRISMATICLENS, { name:'Prismatic Lens', type:'summon', boss:'empress', color:'#ff9de0', icon:'🔮', maxStack:99, desc:'Summons the Empress of Light.' });
defItem(I.LIHZAHARDPOWERCELL, { name:'Lihzahrd Power Cell', type:'summon', boss:'golem', color:'#8a5a3a', icon:'⚡', maxStack:99, desc:'Summons Golem. Use near the temple.' });

// ---------- Expanded Hardmode content ----------

// New blocks
defItem(I.SNOW, { name:'Snow Block', type:'block', tile:T.SNOW, color:'#e8f4ff', icon:'block', desc:'Cold white powder.' });
defItem(I.ICE, { name:'Ice Block', type:'block', tile:T.ICE, color:'#a8d8ff', icon:'block', desc:'Slippery frozen water.' });
defItem(I.MUSHROOM, { name:'Mushroom Block', type:'block', tile:T.MUSHROOM, color:'#7a5c9a', icon:'block', desc:'Soft glowing fungal soil.' });
defItem(I.PALLADIUM, { name:'Palladium Ore', type:'block', tile:T.PALLADIUM, color:'#ff8a6b', icon:'block', desc:'A rare red hardmode ore.' });

// New bars / materials
defItem(I.PALLADIUMBAR, { name:'Palladium Bar', type:'bar', color:'#ff7a55', icon:'bar' });
defItem(I.SHROOMBAR, { name:'Shroomite Bar', type:'bar', color:'#9a6b4d', icon:'bar', desc:'Mushroom + chlorophyte alloy.' });
defItem(I.SOUL_FLIGHT, { name:'Soul of Flight', type:'material', color:'#a8f0e0', icon:'🕊️', maxStack:999, desc:'Dropped by Wyverns. Used for wings.' });
defItem(I.SPIDERSILK, { name:'Spider Silk', type:'material', color:'#e8e8f0', icon:'🕸️', maxStack:999, desc:'Woven by jungle spiders.' });
defItem(I.VINE, { name:'Vine', type:'material', color:'#3f9a4d', icon:'🌿', maxStack:999, desc:'Tough jungle creeper.' });
defItem(I.SHARKFIN, { name:'Shark Fin', type:'material', color:'#8a8f9a', icon:'🦈', maxStack:999, desc:'Taken from ocean sharks.' });
defItem(I.ILLEGALGUNPARTS, { name:'Illegal Gun Parts', type:'material', color:'#5a5a6a', icon:'🔫', maxStack:999, desc:'Contraband weapons tech.' });

// Phaseblades / Phase sabers
defItem(I.BLUEPHASEBLADE, { name:'Blue Phaseblade', type:'melee', dmg:26, speed:0.3, kb:3, range:4, color:'#6b9dff', icon:'🗡️', maxStack:1, desc:'A laser blade. Mine gems for more.' });
defItem(I.GREENPHASEBLADE, { name:'Green Phaseblade', type:'melee', dmg:26, speed:0.3, kb:3, range:4, color:'#3dff8a', icon:'🗡️', maxStack:1 });
defItem(I.PURPLEPHASEBLADE, { name:'Purple Phaseblade', type:'melee', dmg:26, speed:0.3, kb:3, range:4, color:'#c85cff', icon:'🗡️', maxStack:1 });
defItem(I.BLUEPHASESABER, { name:'Blue Phasesaber', type:'melee', dmg:50, speed:0.267, kb:3, range:4, color:'#6b9dff', icon:'🔦', maxStack:1, desc:'A true lightsaber.' });
defItem(I.GREENPHASESABER, { name:'Green Phasesaber', type:'melee', dmg:50, speed:0.267, kb:3, range:4, color:'#3dff8a', icon:'🔦', maxStack:1 });
defItem(I.PURPLEPHASESABER, { name:'Purple Phasesaber', type:'melee', dmg:50, speed:0.267, kb:3, range:4, color:'#c85cff', icon:'🔦', maxStack:1 });

// Melee weapons
defItem(I.CUTLASS, { name:'Cutlass', type:'melee', dmg:53, speed:0.267, kb:4, range:4, color:'#e8d8b8', icon:'⚔️', maxStack:1, desc:'Dropped by pirates.' });
defItem(I.FROSTBRAND, { name:'Frostbrand', type:'melee', dmg:49, speed:0.383, kb:4.5, range:4, meleeProj:P.FROSTBOLT, projSpeed:8, projLife:1.3, projDamageMul:0.7, color:'#9adcff', icon:'⚔️', maxStack:1, desc:'A blade of winter. Fires an ice wave.' });
defItem(I.BEAMSWORD, { name:'Beam Sword', type:'melee', dmg:52, speed:0.333, kb:6.5, range:4, meleeProj:P.LASER, projSpeed:10, projLife:1.3, projDamageMul:0.7, color:'#e0e8ff', icon:'⚔️', maxStack:1, desc:'Rare. Fires a light beam.' });
defItem(I.KEYBRAND, { name:'Keybrand', type:'melee', dmg:105, speed:0.333, kb:6.5, range:4, color:'#ffe14d', icon:'🔑', maxStack:1, nearbyBonus:0.15, nearbyMax:6, nearbyRadius:96, desc:'Weak... until you are strong.' });
defItem(I.DEATHSICKLE, { name:'Death Sickle', type:'melee', dmg:57, speed:0.417, kb:5, range:4, meleeProj:P.CRESCENT, projSpeed:5, projLife:1.8, projDamageMul:0.8, color:'#5a5a7a', icon:'☠️', maxStack:1, desc:'Reaper\'s own blade. Throws a shadow scythe.' });
defItem(I.SEEDLER, { name:'Seedler', type:'melee', dmg:50, speed:0.383, kb:6, range:4, meleeProj:P.RAZOR, projSpeed:7, projLife:1.5, projDamageMul:0.7, projBounces:2, splitOnHit:P.SPORE, splitCount:3, splitSpeed:6, splitDamageMul:0.45, splitHoming:true, color:'#6bff8a', icon:'🌱', maxStack:1, desc:'Plantera\'s tooth. Its seed bursts into homing spores.' });
defItem(I.VAMPIRESKNIVES, { name:'Vampire Knives', type:'melee', dmg:29, speed:0.267, kb:2.75, range:4, meleeProj:P.DART, projSpeed:8, projLife:1.2, projDamageMul:0.65, projCount:5, projSpread:0.12, projectileOnly:true, lifeSteal:0.05, color:'#ff5c4d', icon:'🔪', maxStack:1, desc:'Throws knives that steal life.' });
defItem(I.PSYCHOKNIFE, { name:'Psycho Knife', type:'melee', dmg:85, speed:0.133, kb:3.5, range:4, color:'#8a8f9a', icon:'🔪', maxStack:1, desc:'A deadly dagger from a Solar Eclipse.' });
defItem(I.SCOURGE, { name:'Scourge of the Corruptor', type:'melee', dmg:70, speed:0.333, kb:5, range:4, meleeProj:P.STINGER, projSpeed:9, projLife:1.5, projectileOnly:true, splitOnHit:P.SPORE, splitCount:3, splitSpeed:7, splitDamageMul:0.4, splitHoming:true, color:'#7a3d5c', icon:'🐍', maxStack:1, desc:'A corrupting javelin that releases homing eaters.' });
defItem(I.FLAIRON, { name:'Flairon', type:'melee', dmg:132, speed:0.333, kb:4.5, range:8, meleeProj:P.RAZOR, meleeMode:'flail', flailDuration:0.65, projectileOnly:true, persistentProj:true, flailExtraProj:P.MAGICBOLT, extraProjCount:3, extraProjSpeed:6, extraDamageMul:0.4, extraProjHoming:true, color:'#ffd75e', icon:'⚓', maxStack:1, desc:'Duke Fishron\'s anchor. Shoots bubbles.' });
defItem(I.GUNGNIR, { name:'Gungnir', type:'melee', dmg:61, speed:0.367, kb:6.4, range:4.5, meleeProj:P.STINGER, meleeMode:'spear', spearDuration:0.26, projectileOnly:true, persistentProj:true, color:'#e8e8f0', icon:'🔱', maxStack:1, desc:'The godly spear.' });
defItem(I.MUSHROOMSPEAR, { name:'Mushroom Spear', type:'melee', dmg:60, speed:0.667, kb:6.2, range:4.5, meleeProj:P.STINGER, meleeMode:'spear', spearDuration:0.32, projectileOnly:true, persistentProj:true, spearExtraProj:P.SPORE, extraProjSpeed:6, extraDamageMul:0.45, extraBounces:2, color:'#c8a8e8', icon:'🍄', maxStack:1, desc:'Fires bouncing spores.' });
defItem(I.NORTHPOLE, { name:'North Pole', type:'melee', dmg:80, speed:0.5, kb:6.7, range:4.5, meleeProj:P.STINGER, meleeMode:'spear', spearDuration:0.28, projectileOnly:true, persistentProj:true, spearExtraProj:P.FROSTBOLT, extraProjSpeed:8, extraDamageMul:0.5, color:'#a8dcff', icon:'🎄', maxStack:1, desc:'An Ice Queen spear that calls down icicles.' });
defItem(I.CHLOROPHYTEPARTISAN, { name:'Chlorophyte Partisan', type:'melee', dmg:49, speed:0.383, kb:6.2, range:4.5, meleeProj:P.STINGER, meleeMode:'spear', spearDuration:0.28, projectileOnly:true, persistentProj:true, spearExtraProj:P.SPORE, extraProjSpeed:7, extraDamageMul:0.45, color:'#4dff6b', icon:'🔱', maxStack:1, desc:'A living spear of the jungle.' });

// Yoyos
defItem(I.THEEYEOFOCTHULU, { name:'The Eye of Cthulhu', type:'melee', dmg:115, speed:0.417, kb:3.5, range:12, meleeProj:P.RAZOR, meleeMode:'yoyo', yoyoDuration:2.4, projectileOnly:true, persistentProj:true, color:'#ff4d4d', icon:'🪀', maxStack:1, desc:'A legendary yoyo dropped by Mothron.' });
defItem(I.HELLFIRE, { name:'Hel-Fire', type:'melee', dmg:43, speed:0.417, kb:4.5, range:12, meleeProj:P.RAZOR, meleeMode:'yoyo', yoyoDuration:2.1, projectileOnly:true, persistentProj:true, color:'#ff9a3d', icon:'🪀', maxStack:1, desc:'A burning yoyo dropped by Hardmode Underworld enemies.' });
defItem(I.YELEKS, { name:'Yelets', type:'melee', dmg:60, speed:0.417, kb:3.1, range:13, meleeProj:P.RAZOR, meleeMode:'yoyo', yoyoDuration:2.5, projectileOnly:true, persistentProj:true, yoyoExtraProj:P.SPORE, extraInterval:0.4, extraProjSpeed:7, extraDamageMul:0.4, color:'#6bff8a', icon:'🪀', maxStack:1, desc:'A yoyo dropped by Jungle enemies after a mechanical boss.' });
defItem(I.KRAKEN, { name:'The Kraken', type:'melee', dmg:120, speed:0.417, kb:4.3, range:14, meleeProj:P.RAZOR, meleeMode:'yoyo', yoyoDuration:2.7, projectileOnly:true, persistentProj:true, color:'#5ac8ff', icon:'🪀', maxStack:1, desc:'A rare post-Plantera Dungeon drop.' });
defItem(I.TERRARIAN, { name:'Terrarian', type:'melee', dmg:190, speed:0.417, kb:6.5, range:16, meleeProj:P.RAZOR, meleeMode:'yoyo', yoyoDuration:3.2, projectileOnly:true, persistentProj:true, yoyoExtraProj:P.RAINBOW, extraInterval:0.28, extraProjSpeed:9, extraDamageMul:0.5, color:'#3dff9d', icon:'🪀', maxStack:1, desc:'The Moon Lord\'s final yoyo. Fires rainbow blades.' });

// Ranged
defItem(I.UZI, { name:'Uzi', type:'ranged', dmg:30, speed:0.15, kb:3.5, ammo:I.BULLET, proj:P.GUNBULLET, auto:true, range:999, color:'#5a5a6a', icon:'🔫', maxStack:1, desc:'A heavy submachine gun.', projSpeed:13});
defItem(I.VENUSMAGNUM, { name:'Venus Magnum', type:'ranged', dmg:50, speed:0.15, kb:5.5, ammo:I.VENOMBULLET, proj:P.GUNBULLET, auto:true, range:999, color:'#ffd75e', icon:'🔫', maxStack:1, desc:'The Jungle\'s favored hand cannon.', projSpeed:13.5});
defItem(I.SNIPERRIFLE, { name:'Sniper Rifle', type:'ranged', dmg:200, speed:0.6, kb:8, ammo:I.ICHORBULLET, proj:P.GUNBULLET, range:999, color:'#8a8f9a', icon:'🎯', maxStack:1, desc:'One shot. One kill.', projSpeed:16});
defItem(I.TACTICALSHOTGUN, { name:'Tactical Shotgun', type:'ranged', dmg:36, speed:0.567, kb:7, ammo:I.BULLET, proj:P.GUNBULLET, spread:5, auto:true, range:999, color:'#6a6a7a', icon:'🔫', maxStack:1, desc:'Sends a wall of lead.', projSpeed:6});
defItem(I.CHAINGUN, { name:'Chain Gun', type:'ranged', dmg:38, speed:0.067, kb:1.75, ammo:I.BULLET, proj:P.GUNBULLET, spread:3, auto:true, range:999, color:'#c8c8d0', icon:'🔫', maxStack:1, desc:'A rapid-fire weapon dropped by Santa-NK1.', projSpeed:14});
defItem(I.ONYXBLASTER, { name:'Onyx Blaster', type:'ranged', dmg:24, speed:0.8, kb:6.5, ammo:I.CURSEDBULLET, proj:P.CURSEDFLAME, explosive:44, auto:true, range:999, color:'#3a3a4a', icon:'🔫', maxStack:1, desc:'Fires explosive dark shards.', projSpeed:7});
defItem(I.DARTRIFLE, { name:'Dart Rifle', type:'ranged', dmg:52, speed:0.633, kb:5.5, ammo:I.DART, proj:P.DART, auto:true, range:999, color:'#8a5a3a', icon:'🔫', maxStack:1, desc:'A blowgun turned lethal.', projSpeed:14.5});
defItem(I.DARTPISTOL, { name:'Dart Pistol', type:'ranged', dmg:28, speed:0.367, kb:3.5, ammo:I.DART, proj:P.DART, auto:true, range:999, color:'#b07850', icon:'🔫', maxStack:1, desc:'A compact venom thrower.', projSpeed:13});
defItem(I.FLAMETHROWER, { name:'Flamethrower', type:'ranged', dmg:35, speed:0.5, kb:0.3, ammo:I.BULLET, proj:P.FIREBALL, spread:2, auto:true, range:999, color:'#ff6b3d', icon:'🔥', maxStack:1, desc:'Cook your enemies alive.', projSpeed:7});
defItem(I.ROCKETLAUNCHER, { name:'Rocket Launcher', type:'ranged', dmg:55, speed:0.5, kb:4, ammo:I.ROCKET1, proj:P.ROCKET, range:999, color:'#7a6b4a', icon:'🚀', maxStack:1, desc:'Booms.', projSpeed:5});
defItem(I.GRENADELAUNCHER, { name:'Grenade Launcher', type:'ranged', dmg:60, speed:0.333, kb:4, ammo:I.GRENADE, proj:P.ROCKET, projGravity:0.22, range:999, color:'#8a8f9a', icon:'💣', maxStack:1, desc:'Lobs explosive shells dropped by Plantera.', projSpeed:10});
defItem(I.PROXIMITYMINELAUNCHER, { name:'Proximity Mine Launcher', type:'ranged', dmg:80, speed:0.833, kb:4, ammo:I.ROCKET1, proj:P.ROCKET, projGravity:0.18, projMine:true, mineTrigger:60, mineDuration:8, range:999, color:'#6a5a3a', icon:'💣', maxStack:1, desc:'Launches mines that arm when they touch terrain.', projSpeed:12});
defItem(I.TSUNAMI, { name:'Tsunami', type:'ranged', dmg:53, speed:0.4, kb:2, ammo:I.ARROW, proj:P.ARROW, spread:5, auto:true, range:999, color:'#5ac8ff', icon:'🏹', maxStack:1, desc:'Duke Fishron\'s bow. Fires a volley of arrows.', projSpeed:10});
defItem(I.PULSEBOW, { name:'Pulse Bow', type:'ranged', dmg:80, speed:0.333, kb:3, ammo:I.ARROW, proj:P.LASER, projBounces:3, auto:true, range:999, color:'#ffd75e', icon:'🏹', maxStack:1, desc:'Energy bolts ricochet three times.', projSpeed:7.75});
defItem(I.CHLOROPHYTESHOTBOW, { name:'Chlorophyte Shotbow', type:'ranged', dmg:34, speed:0.317, kb:2.75, ammo:I.ARROW, proj:P.ARROW, spread:3, projHoming:true, auto:true, range:999, color:'#4dff6b', icon:'🏹', maxStack:1, desc:'Fires homing arrows of living wood.', projSpeed:11.5});
defItem(I.ELFMELTER, { name:'Elf Melter', type:'ranged', dmg:57, speed:0.5, kb:0.425, ammo:I.BULLET, proj:P.CURSEDFLAME, spread:2, auto:true, range:999, color:'#ff4d6d', icon:'🔥', maxStack:1, desc:'A festive flamethrower dropped by Santa-NK1.', projSpeed:8.5});

// Magic
defItem(I.MAGICALHARP, { name:'Magical Harp', type:'magic', dmg:42, speed:0.2, kb:1.5, mana:5, proj:P.RAINBOW, auto:true, range:999, color:'#ff9de0', icon:'🎵', maxStack:1, desc:'Plays a melody of destruction.', projSpeed:4.5});
defItem(I.MAGNETSPHERE, { name:'Magnet Sphere', type:'magic', dmg:48, speed:0.333, kb:6, mana:14, proj:P.MAGICBOLT, magicMode:'sphere', deployDuration:5, deployInterval:0.3, deployProj:P.LASER, deployCount:1, auto:true, range:999, color:'#6b8aff', icon:'🧲', maxStack:1, desc:'A drifting orb that fires at nearby enemies.', projSpeed:1.2});
defItem(I.INFERNOPORK, { name:'Inferno Fork', type:'magic', dmg:70, speed:0.5, kb:5, mana:18, proj:P.FIREBALL, auto:true, range:999, color:'#ff6b3d', icon:'🔱', maxStack:1, desc:'A lava trident from the Underworld.', projSpeed:8});
defItem(I.SHADOWBEAMSTAFF, { name:'Shadowbeam Staff', type:'magic', dmg:80, speed:0.25, kb:6, mana:7, proj:P.PHANTOMBOLT, projBounces:4, auto:true, range:999, color:'#c85cff', icon:'🪄', maxStack:1, desc:'Fires a shadow bolt that ricochets four times.', projSpeed:6});
defItem(I.SPECTRESTAFF, { name:'Spectre Staff', type:'magic', dmg:65, speed:0.4, kb:6, mana:15, proj:P.PHANTOMBOLT, projHoming:true, auto:true, range:999, color:'#e0e8f0', icon:'🪄', maxStack:1, desc:'Fires a lost soul that tracks enemies.', projSpeed:6});
defItem(I.NETTLEBURST, { name:'Nettle Burst', type:'magic', dmg:35, speed:0.417, kb:1, mana:12, proj:P.SPORE, projCount:3, auto:true, range:999, color:'#6bff8a', icon:'🌿', maxStack:1, desc:'A living whip of thorns and magic.', projSpeed:32});
defItem(I.VENOMSTAFF, { name:'Venom Staff', type:'magic', dmg:44, speed:0.5, kb:7, mana:25, proj:P.STINGER, projCount:3, projHoming:true, status:{type:'venom',duration:5,dps:12}, auto:true, range:999, color:'#3dff8a', icon:'🪄', maxStack:1, desc:'Shoots homing venom fangs.', projSpeed:14});
defItem(I.STAFFOFEARTH, { name:'Staff of Earth', type:'magic', dmg:125, speed:0.4, kb:7.5, mana:18, proj:P.MAGICBOLT, auto:true, range:999, color:'#8a6b4a', icon:'🗿', maxStack:1, desc:'Hurls boulders of raw earth.', projSpeed:12});
defItem(I.BLIZZARDSTAFF, { name:'Blizzard Staff', type:'magic', dmg:58, speed:0.167, kb:4.5, mana:9, proj:P.FROSTBOLT, terrainMode:'rain', terrainCount:4, terrainHeight:180, auto:true, range:999, color:'#a8dcff', icon:'❄️', maxStack:1, desc:'Calls four frost bolts down around the cursor.', projSpeed:10});
defItem(I.HEATRAY, { name:'Heat Ray', type:'magic', dmg:90, speed:0.167, kb:3, mana:8, proj:P.LASER, auto:true, range:999, color:'#ff9a3d', icon:'☀️', maxStack:1, desc:'The Golem\'s own ray of heat.', projSpeed:15});
defItem(I.LUNARFLARE, { name:'Lunar Flare', type:'magic', dmg:100, speed:0.167, kb:4.5, mana:9, proj:P.FIREBALL, terrainMode:'rain', terrainCount:2, terrainHeight:210, auto:true, range:999, color:'#c85cff', icon:'🌙', maxStack:1, desc:'Calls two lunar flares down through terrain.', projSpeed:10});
defItem(I.CURSEDFLAMES, { name:'Cursed Flames', type:'magic', dmg:55, speed:0.25, kb:6.5, mana:9, proj:P.CURSEDFLAME, projCount:3, status:{type:'cursed',duration:4,dps:8}, auto:true, range:999, color:'#5ac85c', icon:'🔥', maxStack:1, desc:'The burning curse of the corruption.', projSpeed:10});
defItem(I.FLOWEROFFIRE, { name:'Flower of Fire', type:'magic', dmg:48, speed:0.267, kb:5.5, mana:9, proj:P.FIREBALL, projBounces:2, projCount:1, auto:true, range:999, color:'#ff8a3d', icon:'🌺', maxStack:1, desc:'A flower that spits bouncing fireballs.', projSpeed:7.5});
defItem(I.RAINBOWGUN, { name:'Rainbow Gun', type:'magic', dmg:45, speed:0.667, kb:2.5, mana:20, proj:P.RAINBOW, magicMode:'trail', deployDuration:5, deployInterval:0.25, deployCount:1, zoneHeight:6, hitCooldown:0.2, auto:true, range:999, color:'#ff9de0', icon:'🌈', maxStack:1, desc:'Leaves a rainbow wall that burns enemies.', projSpeed:16});
defItem(I.PIRANHAGUN, { name:'Piranha Gun', type:'ranged', dmg:40, speed:0.5, kb:1, piranha:true, proj:P.STINGER, piranhaDmgPerPulse:38, piranhaRange:300, auto:false, range:999, color:'#ff7a55', icon:'🔫', maxStack:1, desc:'Fires a hooked piranha that locks onto prey.', projSpeed:14});

// Summoner staves
defItem(I.SPIDERSTAFF, { name:'Spider Staff', type:'summonstaff', dmg:26, minion:'spider', speed:0, color:'#e8e8f0', icon:'🕷️', maxStack:1, desc:'Summons a spider minion.' });
defItem(I.PYGMYSTAFF, { name:'Pygmy Staff', type:'summonstaff', dmg:40, minion:'pygmy', speed:0, color:'#6bff8a', icon:'🗡️', maxStack:1, desc:'Summons a jungle pygmy.' });
defItem(I.XENOSTAFF, { name:'Xeno Staff', type:'summonstaff', dmg:36, minion:'xeno', speed:0, color:'#c85cff', icon:'👾', maxStack:1, desc:'Summons a UFO minion.' });
defItem(I.STARDUSTCELLSTAFF, { name:'Stardust Cell Staff', type:'summonstaff', dmg:60, minion:'cell', speed:0, color:'#6bc8ff', icon:'✨', maxStack:1, desc:'Summons a stardust cell.' });

// Whips
defItem(I.SNAPTHORN, { name:'Snapthorn', type:'whip', dmg:18, speed:0.35, kb:1.5, range:2.8, tagDamage:6, tagDuration:4, whipSpeedMul:0.82, color:'#3f9a4d', icon:'🪴', maxStack:1, desc:'Successful strikes temporarily quicken whips.' });
defItem(I.DURENDAL, { name:'Durendal', type:'whip', dmg:55, speed:0.28, kb:2, range:3.1, tagDamage:9, tagDuration:4, whipSpeedMul:0.74, color:'#ffe14d', icon:'💥', maxStack:1, desc:'Successful strikes greatly quicken whips.' });
defItem(I.MORNINGSTAR, { name:'Morning Star', type:'whip', dmg:160, speed:0.25, kb:11, range:3.2, tagDamage:12, tagDuration:4, color:'#8a8f9a', icon:'⛓️', maxStack:1, desc:'Marks enemies for +12 minion damage.' });

// Armor - Palladium
defItem(I.PALLADIUMHELM, { name:'Palladium Helmet', type:'armor', slot:'head', def:4, color:'#ff7a55', icon:'🪖', maxStack:1, desc:'Defense +4' });
defItem(I.PALLADIUMCHEST, { name:'Palladium Breastplate', type:'armor', slot:'chest', def:6, color:'#ff7a55', icon:'🥋', maxStack:1, desc:'Defense +6' });
defItem(I.PALLADIUMLEGS, { name:'Palladium Leggings', type:'armor', slot:'legs', def:4, color:'#ff7a55', icon:'👖', maxStack:1, desc:'Defense +4' });
// Armor - Frost
defItem(I.FROSTHELM, { name:'Frost Helmet', type:'armor', slot:'head', def:9, color:'#9adcff', icon:'🪖', maxStack:1, desc:'Defense +9' });
defItem(I.FROSTCHEST, { name:'Frost Breastplate', type:'armor', slot:'chest', def:12, color:'#9adcff', icon:'🥋', maxStack:1, desc:'Defense +12' });
defItem(I.FROSTLEGS, { name:'Frost Leggings', type:'armor', slot:'legs', def:8, color:'#9adcff', icon:'👖', maxStack:1, desc:'Defense +8' });
// Armor - Turtle
defItem(I.TURTLEMASK, { name:'Turtle Mask', type:'armor', slot:'head', def:12, color:'#5c8a3d', icon:'🪖', maxStack:1, desc:'Defense +12' });
defItem(I.TURTLECHEST, { name:'Turtle Shellplate', type:'armor', slot:'chest', def:20, color:'#5c8a3d', icon:'🥋', maxStack:1, desc:'Defense +20' });
defItem(I.TURTLEGREAVES, { name:'Turtle Leggings', type:'armor', slot:'legs', def:15, color:'#5c8a3d', icon:'👖', maxStack:1, desc:'Defense +15' });
// Armor - Shroomite
defItem(I.SHROOMITEHELM, { name:'Shroomite Headgear', type:'armor', slot:'head', def:4, color:'#c8a8e8', icon:'🪖', maxStack:1, desc:'Defense +4' });
defItem(I.SHROOMITECHEST, { name:'Shroomite Breastplate', type:'armor', slot:'chest', def:7, color:'#c8a8e8', icon:'🥋', maxStack:1, desc:'Defense +7' });
defItem(I.SHROOMITELEGS, { name:'Shroomite Leggings', type:'armor', slot:'legs', def:5, color:'#c8a8e8', icon:'👖', maxStack:1, desc:'Defense +5' });
// Armor - Spooky
defItem(I.SPOOKYHELM, { name:'Spooky Helmet', type:'armor', slot:'head', def:8, color:'#3a3a4a', icon:'🎃', maxStack:1, desc:'Defense +8' });
defItem(I.SPOOKYCHEST, { name:'Spooky Breastplate', type:'armor', slot:'chest', def:12, color:'#3a3a4a', icon:'🎃', maxStack:1, desc:'Defense +12' });
defItem(I.SPOOKYLEGS, { name:'Spooky Leggings', type:'armor', slot:'legs', def:10, color:'#3a3a4a', icon:'🎃', maxStack:1, desc:'Defense +10' });
// Armor - Solar
defItem(I.SOLARHELM, { name:'Solar Flare Helmet', type:'armor', slot:'head', def:14, color:'#ff9a3d', icon:'🪖', maxStack:1, desc:'Defense +14' });
defItem(I.SOLARCHEST, { name:'Solar Flare Breastplate', type:'armor', slot:'chest', def:20, color:'#ff9a3d', icon:'🥋', maxStack:1, desc:'Defense +20' });
defItem(I.SOLARLEGS, { name:'Solar Flare Leggings', type:'armor', slot:'legs', def:16, color:'#ff9a3d', icon:'👖', maxStack:1, desc:'Defense +16' });
// Armor - Nebula
defItem(I.NEBULAHELM, { name:'Nebula Helmet', type:'armor', slot:'head', def:12, color:'#c85cff', icon:'🪖', maxStack:1, desc:'Defense +12' });
defItem(I.NEBULACHEST, { name:'Nebula Breastplate', type:'armor', slot:'chest', def:16, color:'#c85cff', icon:'🥋', maxStack:1, desc:'Defense +16' });
defItem(I.NEBULALEGS, { name:'Nebula Leggings', type:'armor', slot:'legs', def:12, color:'#c85cff', icon:'👖', maxStack:1, desc:'Defense +12' });
// Armor - Vortex
defItem(I.VORTEXHELM, { name:'Vortex Helmet', type:'armor', slot:'head', def:10, color:'#3dff9d', icon:'🪖', maxStack:1, desc:'Defense +10' });
defItem(I.VORTEXCHEST, { name:'Vortex Breastplate', type:'armor', slot:'chest', def:18, color:'#3dff9d', icon:'🥋', maxStack:1, desc:'Defense +18' });
defItem(I.VORTEXLEGS, { name:'Vortex Leggings', type:'armor', slot:'legs', def:12, color:'#3dff9d', icon:'👖', maxStack:1, desc:'Defense +12' });
// Armor - Stardust
defItem(I.STARDUSTHELM, { name:'Stardust Helmet', type:'armor', slot:'head', def:8, color:'#6bc8ff', icon:'🪖', maxStack:1, desc:'Defense +8' });
defItem(I.STARDUSTCHEST, { name:'Stardust Breastplate', type:'armor', slot:'chest', def:12, color:'#6bc8ff', icon:'🥋', maxStack:1, desc:'Defense +12' });
defItem(I.STARDUSTLEGS, { name:'Stardust Leggings', type:'armor', slot:'legs', def:10, color:'#6bc8ff', icon:'👖', maxStack:1, desc:'Defense +10' });

// Accessories
defItem(I.FROSTSPARKBOOTS, { name:'Frostspark Boots', type:'accessory', color:'#9adcff', icon:'👟', maxStack:1, runSpeed:1.5, invuln:0.1, desc:'Greatly increases running speed.' });
defItem(I.ANKHSHIELD, { name:'Ankh Shield', type:'accessory', color:'#ffe14d', icon:'🛡️', maxStack:1, def:4, invuln:0.2, desc:'Defense +4. Blocks knockback.' });
defItem(I.WARRIOREMBLEM, { name:'Warrior Emblem', type:'accessory', color:'#ff9a3d', icon:'🎖️', maxStack:1, meleeDmgMul:1.12, desc:'Increases melee damage by 12%.' });
defItem(I.MAGICEMBLEM, { name:'Magic Emblem', type:'accessory', color:'#c85cff', icon:'🎖️', maxStack:1, magicDmgMul:1.12, desc:'Increases magic damage by 12%.' });
defItem(I.RANGEREMBLEM, { name:'Ranger Emblem', type:'accessory', color:'#6bff8a', icon:'🎖️', maxStack:1, rangedDmgMul:1.12, desc:'Increases ranged damage by 12%.' });
defItem(I.SUMMONEREMBLEM, { name:'Summoner Emblem', type:'accessory', color:'#6bc8ff', icon:'🎖️', maxStack:1, summonDmgMul:1.12, desc:'Increases minion damage by 12%.' });
defItem(I.FIREGAUNTLET, { name:'Fire Gauntlet', type:'accessory', color:'#ff6b3d', icon:'🧤', maxStack:1, meleeDmgMul:1.2, desc:'Increases melee damage by 20%.' });
defItem(I.MECHANICALGLOVE, { name:'Mechanical Glove', type:'accessory', color:'#8a8f9a', icon:'🧤', maxStack:1, meleeDmgMul:1.12, desc:'Increases melee damage by 12%.' });
defItem(I.MASTERNINJAGEAR, { name:'Master Ninja Gear', type:'accessory', color:'#5a5a6a', icon:'👺', maxStack:1, runSpeed:1.2, invuln:0.3, desc:'Speed +20%. Dodge chance.' });
defItem(I.CELESTIALSHELL, { name:'Celestial Shell', type:'accessory', color:'#ffe9a8', icon:'🌙', maxStack:1, dmgMul:1.15, def:4, regen:20, desc:'A piece of the heavens themselves.' });
defItem(I.MOONSTONE, { name:'Moon Stone', type:'accessory', color:'#8a6bd0', icon:'🌑', maxStack:1, dmgMul:1.1, desc:'Damage +10%. The moon empowers you.' });
defItem(I.SUNSTONE, { name:'Sun Stone', type:'accessory', color:'#ffd75e', icon:'☀️', maxStack:1, dmgMul:1.1, desc:'Damage +10%. The sun empowers you.' });
defItem(I.FROZENTURTLESHELL, { name:'Frozen Turtle Shell', type:'accessory', color:'#9adcff', icon:'🐢', maxStack:1, def:5, desc:'Defense +5.' });
defItem(I.OBSIDIANSHIELD, { name:'Obsidian Shield', type:'accessory', color:'#3a3a4a', icon:'🛡️', maxStack:1, def:2, desc:'Defense +2. Blocks knockback.' });
defItem(I.PHILOSOPHERSSTONE, { name:'Philosopher\'s Stone', type:'accessory', color:'#ffd75e', icon:'💠', maxStack:1, regen:25, desc:'Regenerates health over time. Dropped by Mimics.' });
defItem(I.STARCLOAK, { name:'Star Cloak', type:'accessory', color:'#ffe14d', icon:'🌠', maxStack:1, invuln:0.3, desc:'Strikes back when hurt. Dropped by Mimics.' });
defItem(I.CROSSNECKLACE, { name:'Cross Necklace', type:'accessory', color:'#ffe9a8', icon:'📿', maxStack:1, invuln:0.5, desc:'Longer invulnerability after a hit. Dropped by Mimics.' });
defItem(I.COBALTSHIELD, { name:'Cobalt Shield', type:'accessory', color:'#3a7dff', icon:'🛡️', maxStack:1, def:1, desc:'Defense +1. Blocks knockback.' });
defItem(I.LEAFWINGS, { name:'Leaf Wings', type:'accessory', color:'#6bff8a', icon:'🪽', maxStack:1, jumpMul:0.8, desc:'Swoop through the air with leafy wings.' });
defItem(I.FLAMEWINGS, { name:'Flame Wings', type:'accessory', color:'#ff6b3d', icon:'🔥', maxStack:1, jumpMul:0.9, desc:'Wings forged in hellfire.' });
defItem(I.BATWINGS, { name:'Bat Wings', type:'accessory', color:'#8a5c9a', icon:'🦇', maxStack:1, jumpMul:1.0, desc:'Leathery wings of the night.' });

// Consumables
defItem(I.GREATERHEALINGPOTION, { name:'Greater Healing Potion', type:'consumable', heal:150, color:'#ff4d8a', icon:'🧪', maxStack:30, desc:'Restores 150 health.' });
defItem(I.SUPERHEALINGPOTION, { name:'Super Healing Potion', type:'consumable', heal:200, color:'#ff3d6d', icon:'🧪', maxStack:30, desc:'Restores 200 health.' });
defItem(I.GREATERMANAPOTION, { name:'Greater Mana Potion', type:'consumable', mana:200, color:'#6bc8ff', icon:'🫗', maxStack:30, desc:'Restores 200 mana.' });
defItem(I.LIFEFRUIT, { name:'Life Fruit', type:'consumable', heart:5, color:'#ff5c8a', icon:'🍓', maxStack:99, desc:'Increases max health by 5. Up to 500.' });

// Buff potions
defItem(I.IRONSKINPOTION, { name:'Ironskin Potion', type:'consumable', buff:{t:300, def:8}, color:'#c8c8d0', icon:'🛡️', maxStack:30, desc:'Defense +8 for 5 minutes.' });
defItem(I.REGENPOTION, { name:'Regeneration Potion', type:'consumable', buff:{t:300, regen:25}, color:'#ff6b8a', icon:'💊', maxStack:30, desc:'Regenerate health for 5 minutes.' });
defItem(I.SWIFTNESSPOTION, { name:'Swiftness Potion', type:'consumable', buff:{t:240, runSpeed:1.3}, color:'#c8f0a0', icon:'💨', maxStack:30, desc:'+30% speed for 4 minutes.' });
defItem(I.MAGICPOWERPOTION, { name:'Magic Power Potion', type:'consumable', buff:{t:240, dmgMul:1.15}, color:'#c85cff', icon:'🔮', maxStack:30, desc:'+15% damage for 4 minutes.' });
defItem(I.ARCHERYPOTION, { name:'Archery Potion', type:'consumable', buff:{t:240, dmgMul:1.1}, color:'#b8d8a0', icon:'🏹', maxStack:30, desc:'+10% damage for 4 minutes.' });
defItem(I.THORNSPOTION, { name:'Thorns Potion', type:'consumable', buff:{t:240, thorns:15}, color:'#6bff8a', icon:'🌵', maxStack:30, desc:'Reflect damage back at foes.' });
defItem(I.WRATHPOTION, { name:'Wrath Potion', type:'consumable', buff:{t:240, dmgMul:1.1}, color:'#ff4d6d', icon:'😡', maxStack:30, desc:'+10% damage for 4 minutes.' });
defItem(I.RAGEPOTION, { name:'Rage Potion', type:'consumable', buff:{t:240, dmgMul:1.1}, color:'#ff9a3d', icon:'🤬', maxStack:30, desc:'+10% damage for 4 minutes.' });
defItem(I.LIFEFORCEPOTION, { name:'Lifeforce Potion', type:'consumable', buff:{t:300, maxHp:50}, color:'#ff8fb8', icon:'💖', maxStack:30, desc:'+50 max health for 5 minutes.' });
defItem(I.ENDURANCEPOTION, { name:'Endurance Potion', type:'consumable', buff:{t:240, invuln:0.15}, color:'#a8a8c0', icon:'🧘', maxStack:30, desc:'Take less damage for 4 minutes.' });

// ---------- Full-content expansion ----------

// Materials
defItem(I.BONE, { name:'Bone', type:'material', color:'#e8e0c8', icon:'🦴', maxStack:999, desc:'Dropped by skeletons.' });
defItem(I.SILK, { name:'Silk', type:'material', color:'#f0f0f8', icon:'🧵', maxStack:999, desc:'Woven from cobwebs.' });
defItem(I.LEATHER, { name:'Leather', type:'material', color:'#a87a4a', icon:'🟤', maxStack:999, desc:'Tanned from wolf hides.' });
defItem(I.FEATHER, { name:'Feather', type:'material', color:'#e8e8f0', icon:'🪶', maxStack:999, desc:'Dropped by flying beasts.' });
defItem(I.CRYSTALSHARD, { name:'Crystal Shard', type:'material', color:'#ff9de0', icon:'🔷', maxStack:999, desc:'A shard of pure Hallow light.' });
defItem(I.GEM_RUBY, { name:'Ruby', type:'material', color:'#ff4d4d', icon:'💎', maxStack:999, desc:'A precious red gem.' });
defItem(I.GEM_SAPPHIRE, { name:'Sapphire', type:'material', color:'#4d7dff', icon:'💎', maxStack:999, desc:'A precious blue gem.' });
defItem(I.GEM_EMERALD, { name:'Emerald', type:'material', color:'#3dff6b', icon:'💎', maxStack:999, desc:'A precious green gem.' });
defItem(I.GEM_TOPAZ, { name:'Topaz', type:'material', color:'#ffd75e', icon:'💎', maxStack:999, desc:'A precious yellow gem.' });
defItem(I.GEM_AMETHYST, { name:'Amethyst', type:'material', color:'#c85cff', icon:'💎', maxStack:999, desc:'A precious purple gem.' });
defItem(I.GEM_DIAMOND, { name:'Diamond', type:'material', color:'#c8f0ff', icon:'💎', maxStack:999, desc:'The rarest and clearest gem.' });

// Axes
defItem(I.IRONAXE, { name:'Iron Axe', type:'tool', power:55, speed:1.0, dmg:5, range:2.6, color:'#d0d0d6', icon:'🪓', maxStack:1, desc:'Chops wood faster.' });
defItem(I.COBALTAXE, { name:'Cobalt Axe', type:'tool', power:70, speed:1.5, dmg:10, range:2.8, color:'#3a7dff', icon:'🪓', maxStack:1, desc:'A swift axe of cobalt.' });
defItem(I.MYTHRILAXE, { name:'Mythril Axe', type:'tool', power:85, speed:2.0, dmg:13, range:3.0, color:'#3ed6a0', icon:'🪓', maxStack:1, desc:'A sleek axe of mythril.' });
defItem(I.ADAMANTITEAXE, { name:'Adamantite Axe', type:'tool', power:110, speed:2.6, dmg:16, range:3.2, color:'#e05555', icon:'🪓', maxStack:1, desc:'A heavy axe of adamantite.' });
defItem(I.CHLOROPHYTEAXE, { name:'Chlorophyte Axe', type:'tool', power:130, speed:3.2, dmg:20, range:3.4, color:'#4dff6b', icon:'🪓', maxStack:1, desc:'A living axe of the jungle.' });

// True melee weapons
defItem(I.TRUEEXCALIBUR, { name:'True Excalibur', type:'melee', dmg:72, speed:0.3, kb:4.5, range:4, meleeProj:P.BLAZE, projSpeed:8, projLife:1.1, projDamageMul:0.75, color:'#ffe14d', icon:'✨', maxStack:1, desc:'The perfected Hallowed blade.' });
defItem(I.TRUENIGHTSEDGE, { name:'True Night\'s Edge', type:'melee', dmg:70, speed:0.533, kb:4.75, range:4, meleeProj:P.CRESCENT, projSpeed:7, projLife:1.5, projDamageMul:0.8, color:'#7a3d5c', icon:'🌑', maxStack:1, desc:'The dark essence of the Corruption.' });

// Ammo
defItem(I.MUSKETBALL, { name:'Musket Ball', type:'ammo', dmg:7, color:'#b8b8c0', icon:'⚫', maxStack:999, desc:'Simple lead shot.' });
defItem(I.SILVERBULLET, { name:'Silver Bullet', type:'ammo', dmg:9, color:'#d8d8e8', icon:'⚪', maxStack:999, desc:'Silver-tipped rounds.' });
defItem(I.EXPLOSIVEBULLET, { name:'Explosive Bullet', type:'ammo', dmg:10, explosive:42, color:'#ff9a3d', icon:'💥', maxStack:999, desc:'Explodes on impact.' });
defItem(I.CHLOROPHYTEBULLET, { name:'Chlorophyte Bullet', type:'ammo', dmg:9, homing:true, color:'#4dff6b', icon:'🍀', maxStack:999, desc:'Homing rounds of living metal.' });
defItem(I.UNHOLYARROW, { name:'Unholy Arrow', type:'ammo', dmg:12, color:'#7a3d5c', icon:'➶', maxStack:999, desc:'Tipped with corruption.' });
defItem(I.JESTERSARROW, { name:'Jester\'s Arrow', type:'ammo', dmg:10, color:'#ffe9a8', icon:'➶', maxStack:999, desc:'A star-headed arrow.' });
defItem(I.HOLYARROW, { name:'Holy Arrow', type:'ammo', dmg:13, color:'#ffe14d', icon:'➶', maxStack:999, desc:'Blessed by the Hallow.' });

// Ranged
defItem(I.SHOTGUN, { name:'Shotgun', type:'ranged', dmg:24, speed:0.75, kb:6.5, ammo:I.MUSKETBALL, proj:P.GUNBULLET, spread:5, range:999, color:'#8a6b4a', icon:'🔫', maxStack:1, desc:'A wall of lead at close range.', projSpeed:7});

// Magic
defItem(I.SKYFRACTURE, { name:'Sky Fracture', type:'magic', dmg:38, speed:0.2, kb:6, mana:17, proj:P.MAGICBOLT, projCount:2, auto:true, range:999, color:'#8ac8ff', icon:'🌌', maxStack:1, desc:'Fires shards of sky itself.', projSpeed:8.75});

// Summon staves
defItem(I.ABIGAILSFLOWER, { name:'Abigail\'s Flower', type:'summonstaff', dmg:18, minion:'abigail', speed:0, color:'#c8a8e8', icon:'🌸', maxStack:1, desc:'Summons a friendly ghost.' });
defItem(I.BLADESTAFF, { name:'Blade Staff', type:'summonstaff', dmg:6, minion:'blade', speed:0, color:'#ffe9a8', icon:'🗡️', maxStack:1, desc:'Summons enchanted daggers.' });
defItem(I.RAVENSTAFF, { name:'Raven Staff', type:'summonstaff', dmg:55, minion:'raven', speed:0, color:'#3a3a4a', icon:'🐦‍⬛', maxStack:1, desc:'A Pumpking staff that summons ravens of the dead.' });
defItem(I.TEMPESTSTAFF, { name:'Tempest Staff', type:'summonstaff', dmg:50, minion:'tempest', speed:0, color:'#5ac8ff', icon:'🌪️', maxStack:1, desc:'Summons a sharknado minion.' });
defItem(I.DESERTTIGERSTAFF, { name:'Desert Tiger Staff', type:'summonstaff', dmg:41, minion:'tiger', speed:0, color:'#ffd75e', icon:'🐯', maxStack:1, desc:'Summons a desert tiger.' });
defItem(I.TERRAPRISMA, { name:'Terraprisma', type:'summonstaff', dmg:90, minion:'blade', speed:0, color:'#3dff9d', icon:'🌈', maxStack:1, desc:'The Empress\'s blade of pure light.' });

// Whips
defItem(I.SPINEWHIP, { name:'Spine Whip', type:'whip', dmg:24, speed:0.32, kb:4, range:3.0, tagDamage:7, tagDuration:4, color:'#e0d8b8', icon:'🦴', maxStack:1, desc:'Marks enemies for +7 minion damage.' });
defItem(I.COOLWHIP, { name:'Cool Whip', type:'whip', dmg:45, speed:0.27, kb:1.5, range:3.2, tagDamage:10, tagDuration:4, whipBolt:P.FROSTBOLT, whipBoltDamage:0.5, color:'#9adcff', icon:'❄️', maxStack:1, desc:'Successful strikes release a homing frost bolt.' });
defItem(I.DARKHARVEST, { name:'Dark Harvest', type:'whip', dmg:110, speed:0.2, kb:3, range:3.4, tagDamage:14, tagDuration:4, tagSplash:0.45, color:'#a86b3d', icon:'🌾', maxStack:1, desc:'Minion hits splash dark energy from tagged enemies.' });

// Accessories
defItem(I.FROGLEG, { name:'Frog Leg', type:'accessory', color:'#6b8a3d', icon:'🐸', maxStack:1, jumpMul:0.3, desc:'Increases jump height.' });
defItem(I.ANGELWINGS, { name:'Angel Wings', type:'accessory', color:'#e8e8f0', icon:'🪽', maxStack:1, jumpMul:1.2, desc:'Wings woven from feathers and silk.' });
defItem(I.TERRASPARKBOOTS, { name:'Terraspark Boots', type:'accessory', color:'#ff6b3d', icon:'👟', maxStack:1, runSpeed:1.6, jumpMul:0.4, invuln:0.1, desc:'The ultimate boots.' });
defItem(I.HERCULESBEETLE, { name:'Hercules Beetle', type:'accessory', color:'#8a9a5c', icon:'🪲', maxStack:1, minion:1, summonDmgMul:1.15, desc:'+1 minion. Minion damage +15%.' });
defItem(I.PYGMYNECKLACE, { name:'Pygmy Necklace', type:'accessory', color:'#6bff8a', icon:'📿', maxStack:1, minion:1, desc:'+1 minion.' });
defItem(I.PAPYRUSSCARAB, { name:'Papyrus Scarab', type:'accessory', color:'#ffd75e', icon:'🪲', maxStack:1, minion:1, summonDmgMul:1.1, desc:'+1 minion. Minion damage +10%.' });
defItem(I.NECROMANTICSCROLL, { name:'Necromantic Scroll', type:'accessory', color:'#8a5c9a', icon:'📜', maxStack:1, minion:1, summonDmgMul:1.1, desc:'Dropped by Mourning Wood. +1 minion and +10% minion damage.' });
defItem(I.OBSIDIANROSE, { name:'Obsidian Rose', type:'accessory', color:'#5a3d6b', icon:'🌹', maxStack:1, def:2, desc:'Defense +2.' });

// Food & drinks
defItem(I.COOKEDFISH, { name:'Cooked Fish', type:'consumable', buff:{t:300, regen:15}, color:'#e8c8a0', icon:'🍖', maxStack:30, desc:'Regenerate health for 5 minutes.' });
defItem(I.PUMPKINPIE, { name:'Pumpkin Pie', type:'consumable', buff:{t:300, regen:10, runSpeed:1.05}, color:'#ff9a3d', icon:'🥧', maxStack:30, desc:'Regeneration and a little speed.' });
defItem(I.GOLDENAPPLE, { name:'Golden Apple', type:'consumable', heal:100, buff:{t:180, regen:30, invuln:0.1}, color:'#ffd75e', icon:'🍎', maxStack:30, desc:'Heals and empowers you.' });
defItem(I.OBSIDIANSKINPOTION, { name:'Obsidian Skin Potion', type:'consumable', buff:{t:300, def:5}, color:'#3a3a4a', icon:'🛡️', maxStack:30, desc:'Defense +5 for 5 minutes.' });
defItem(I.WATERWALKINGPOTION, { name:'Water Walking Potion', type:'consumable', buff:{t:300, runSpeed:1.2}, color:'#5ac8ff', icon:'💧', maxStack:30, desc:'+20% speed for 5 minutes.' });

// ---------- Vanilla hardmode gap-fill ----------

// Materials
defItem(I.ICHOR, { name:'Ichor', type:'material', color:'#ffd75e', icon:'🟡', maxStack:999, desc:'The golden blood of the Crimson.' });
defItem(I.BROKENHEROSWORD, { name:'Broken Hero Sword', type:'material', color:'#b8a888', icon:'🗡️', maxStack:99, desc:'A shattered blade of legend. Dropped during Solar Eclipses.' });
defItem(I.LUMINITE, { name:'Luminite', type:'material', color:'#6bc8ff', icon:'✨', maxStack:999, desc:'Dropped by the Moon Lord. The essence of the moon.' });
defItem(I.LUMINITEBAR, { name:'Luminite Bar', type:'bar', color:'#9ac8ff', icon:'bar', desc:'Forged from the flesh of the Moon Lord.' });

// Axes & hammers
defItem(I.PALLADIUMAXE, { name:'Palladium Axe', type:'tool', power:80, speed:1.8, dmg:12, range:2.9, color:'#ff7a55', icon:'🪓', maxStack:1, desc:'A quick axe of palladium.' });
defItem(I.ORICHALCUMAXE, { name:'Orichalcum Axe', type:'tool', power:95, speed:2.2, dmg:14, range:3.0, color:'#e68cff', icon:'🪓', maxStack:1, desc:'A heavy axe of orichalcum.' });
defItem(I.TITANIUMAXE, { name:'Titanium Axe', type:'tool', power:125, speed:3.0, dmg:18, range:3.2, color:'#c8ccd4', icon:'🪓', maxStack:1, desc:'An axe of gleaming titanium.' });
defItem(I.PWHAMMER, { name:'Pwnhammer', type:'tool', power:60, speed:1.2, dmg:26, range:2.8, color:'#c04040', icon:'🔨', maxStack:1, hammer:true, desc:'The Hammer of the Wall of Flesh. Breaks evil bricks.' });
defItem(I.CHLOROPHYTEJACKHAMMER, { name:'Chlorophyte Jackhammer', type:'tool', power:140, speed:3.6, dmg:45, range:3.4, color:'#4dff6b', icon:'🔨', maxStack:1, hammer:true, desc:'A living jackhammer of the jungle.' });
defItem(I.SPECTREHAMAXE, { name:'Spectre Hamaxe', type:'tool', power:150, speed:3.8, dmg:60, range:3.6, color:'#e6e6f0', icon:'🔨', maxStack:1, hammer:true, desc:'A spectral hammer-axe.' });

// Melee
defItem(I.NIGHTSEDGE, { name:'Night\'s Edge', type:'melee', dmg:40, speed:0.417, kb:4.5, range:4, color:'#8a4dff', icon:'🌑', maxStack:1, desc:'Four swords fused by dark power.' });
defItem(I.LIGHTDISC, { name:'Light Disc', type:'melee', dmg:60, speed:0.233, kb:8, range:4, meleeProj:P.RAZOR, projSpeed:9, projLife:2, projReturn:0.55, returnSpeed:11, projectileOnly:true, persistentProj:true, color:'#ffe14d', icon:'🛸', maxStack:1, desc:'Boomerangs of Hallowed light.' });
defItem(I.DAOOFPAW, { name:'Dao of Pow', type:'melee', dmg:100, speed:0.75, kb:6, range:8, meleeProj:P.RAZOR, meleeMode:'flail', flailDuration:0.8, projectileOnly:true, persistentProj:true, color:'#c85cff', icon:'⛓️', maxStack:1, desc:'A flail of conflicting energy.' });
defItem(I.CHAINGUILLOTINES, { name:'Chain Guillotines', type:'melee', dmg:59, speed:0.233, kb:3.25, range:7, meleeProj:P.RAZOR, meleeMode:'flail', flailDuration:0.75, projectileOnly:true, persistentProj:true, color:'#c8ccd4', icon:'⛓️', maxStack:1, desc:'Razor flails of the Hallow.' });
defItem(I.PALADINSHAMMER, { name:'Paladin\'s Hammer', type:'melee', dmg:100, speed:0.25, kb:9, range:4, meleeProj:P.RAZOR, projSpeed:8, projLife:2.1, projReturn:0.6, returnSpeed:10, projectileOnly:true, persistentProj:true, color:'#ffd75e', icon:'🔨', maxStack:1, desc:'Dropped by the Paladin. Hits like a truck.' });
defItem(I.POSSESSEDHATCHET, { name:'Possessed Hatchet', type:'melee', dmg:80, speed:0.233, kb:5, range:4, meleeProj:P.RAZOR, projSpeed:9, projLife:2, projReturn:0.6, returnSpeed:11, projectileOnly:true, persistentProj:true, projHoming:true, color:'#9adcff', icon:'🪓', maxStack:1, desc:'A hatchet of the Golem\'s servants.' });
defItem(I.FLYINGKNIFE, { name:'Flying Knife', type:'melee', dmg:40, speed:0.25, kb:4.5, range:3.0, meleeProj:P.RAZOR, meleeMode:'controlled', controlledReach:12, controlledSpeed:9, projectileOnly:true, persistentProj:true, color:'#8a8f9a', icon:'🔪', maxStack:1, desc:'A cursor-controlled dagger dropped by Hallowed Mimics.' });
defItem(I.AMAROK, { name:'Amarok', type:'melee', dmg:47, speed:0.417, kb:2.8, range:14, meleeProj:P.RAZOR, meleeMode:'yoyo', yoyoDuration:2.0, projectileOnly:true, persistentProj:true, color:'#9adcff', icon:'🪀', maxStack:1, desc:'A frostbite yoyo dropped by Hardmode Snow enemies.' });
defItem(I.GRADIENT, { name:'Gradient', type:'melee', dmg:53, speed:0.417, kb:3.8, range:15, meleeProj:P.RAZOR, meleeMode:'yoyo', yoyoDuration:1.8, projectileOnly:true, persistentProj:true, color:'#ff9de0', icon:'🪀', maxStack:1, desc:'A crafted substitute for the Skeleton Merchant\'s yoyo.' });
defItem(I.TITANIUMTRIDENT, { name:'Titanium Trident', type:'melee', dmg:48, speed:0.383, kb:6.2, range:4.5, meleeProj:P.STINGER, meleeMode:'spear', spearDuration:0.3, projectileOnly:true, persistentProj:true, color:'#c8ccd4', icon:'🔱', maxStack:1, desc:'A trident of pure titanium.' });
defItem(I.ADAMANTITEGLAIVE, { name:'Adamantite Glaive', type:'melee', dmg:49, speed:0.417, kb:6, range:4.5, meleeProj:P.STINGER, meleeMode:'spear', spearDuration:0.32, projectileOnly:true, persistentProj:true, color:'#e05555', icon:'🔱', maxStack:1, desc:'A polearm of adamantite.' });

// Ranged
defItem(I.CLOCKWORKAR, { name:'Clockwork Assault Rifle', type:'ranged', dmg:17, speed:0.2, kb:2, ammo:I.MUSKETBALL, proj:P.GUNBULLET, auto:true, range:999, color:'#8a6b4a', icon:'🔫', maxStack:1, desc:'Dropped by the Wall of Flesh. Rapid fire.', projSpeed:7.75});
defItem(I.BOOMSTICK, { name:'Boomstick', type:'ranged', dmg:14, speed:0.667, kb:5.75, ammo:I.MUSKETBALL, proj:P.GUNBULLET, spread:4, range:999, color:'#a87850', icon:'🔫', maxStack:1, desc:'A powerful shotgun of the jungle.', projSpeed:5.35});
defItem(I.MARROW, { name:'Marrow', type:'ranged', dmg:40, speed:0.317, kb:4.7, ammo:I.BONEARROW, proj:P.ARROW, auto:true, range:999, color:'#e8e0c8', icon:'🏹', maxStack:1, desc:'A bow of living bone.', projSpeed:11});
defItem(I.ICEBOW, { name:'Ice Bow', type:'ranged', dmg:39, speed:0.233, kb:4.5, ammo:I.FROSTBURNARROW, proj:P.ARROW, auto:true, range:999, color:'#9adcff', icon:'🏹', maxStack:1, desc:'A bow of frozen sinew.', projSpeed:10});
defItem(I.XENOPOPPER, { name:'Xenopopper', type:'ranged', dmg:45, speed:0.35, kb:3, ammo:I.BULLET, proj:P.GUNBULLET, spread:3, auto:true, range:999, color:'#c85cff', icon:'🔫', maxStack:1, desc:'From the Martian invasion.', projSpeed:12});

// Ammo
defItem(I.CURSEDBULLET, { name:'Cursed Bullet', type:'ammo', dmg:15, status:{type:'cursed',duration:4,dps:8}, color:'#5ac85c', icon:'☄️', maxStack:999, desc:'Cursed flame rounds.' });
defItem(I.ICHORBULLET, { name:'Ichor Bullet', type:'ammo', dmg:13, status:{type:'ichor',duration:5,defense:12}, color:'#ffd75e', icon:'🟡', maxStack:999, desc:'Molten ichor rounds that reduce defense.' });
defItem(I.VENOMBULLET, { name:'Venom Bullet', type:'ammo', dmg:15, status:{type:'venom',duration:5,dps:12}, color:'#3dff8a', icon:'🧪', maxStack:999, desc:'Venomous rounds of the jungle.' });
defItem(I.FROSTBURNARROW, { name:'Frostburn Arrow', type:'ammo', dmg:9, status:{type:'frostburn',duration:4,dps:6}, color:'#9adcff', icon:'➶', maxStack:999, desc:'Frozen arrows that inflict frostburn.' });
defItem(I.HELLFIREARROW, { name:'Hellfire Arrow', type:'ammo', dmg:13, explosive:36, color:'#ff9a3d', icon:'➶', maxStack:999, desc:'Arrows that burst into flame on impact.' });
defItem(I.BONEARROW, { name:'Bone Arrow', type:'ammo', dmg:8, color:'#e8e0c8', icon:'➶', maxStack:999, desc:'Arrows carved from bone.' });

// Magic
defItem(I.NIMBUSROD, { name:'Nimbus Rod', type:'magic', dmg:30, speed:0.367, kb:1, mana:30, proj:P.MAGICBOLT, magicMode:'cloud', deployDuration:6, deployInterval:0.35, deployProj:P.LASER, deployCount:2, auto:true, range:999, color:'#8a9ad0', icon:'☁️', maxStack:1, desc:'Places up to two rain clouds of death.', projSpeed:16});
defItem(I.SPIRITFLAME, { name:'Spirit Flame', type:'magic', dmg:85, speed:0.367, kb:5, mana:14, proj:P.PHANTOMBOLT, projCount:3, projHoming:true, auto:true, range:999, color:'#c85cff', icon:'👻', maxStack:1, desc:'Flames that hunt the wicked.', projSpeed:3});
defItem(I.BUBBLEGUN, { name:'Bubble Gun', type:'magic', dmg:70, speed:0.15, kb:3, mana:5, proj:P.MAGICBOLT, projCount:2, auto:true, range:999, color:'#8ac8ff', icon:'🫧', maxStack:1, desc:'Duke Fishron\'s toy of doom.', projSpeed:15});
defItem(I.LASERMACHINEGUN, { name:'Laser Machinegun', type:'magic', dmg:60, speed:0.333, kb:2, mana:6, proj:P.LASER, magicRamp:true, rampMin:0.05, rampStep:0.012, auto:true, range:999, color:'#ff4d6d', icon:'🔫', maxStack:1, desc:'A Martian laser that accelerates and steadies while firing.', projSpeed:20});
defItem(I.NEBULABLAZE, { name:'Nebula Blaze', type:'magic', dmg:130, speed:0.2, kb:3, mana:12, proj:P.PHANTOMBOLT, auto:true, range:999, color:'#c85cff', icon:'🔥', maxStack:1, desc:'A blaze of nebula fire.', projSpeed:6});
defItem(I.NEBULAARCANUM, { name:'Nebula Arcanum', type:'magic', dmg:70, speed:0.5, kb:5, mana:30, proj:P.MAGICBOLT, magicMode:'sphere', deployDuration:6, deployInterval:0.28, deployProj:P.PHANTOMBOLT, deployCount:1, deployDamageMul:0.5, deployHoming:true, auto:true, range:999, color:'#a86bff', icon:'🔮', maxStack:1, desc:'Creates a drifting nebula orb that launches homing bolts.', projSpeed:7});
defItem(I.UNHOLYTRIDENT, { name:'Unholy Trident', type:'magic', dmg:150, speed:0.45, kb:6.66, mana:19, proj:P.CURSEDFLAME, auto:true, range:999, color:'#8a5a3a', icon:'🔱', maxStack:1, desc:'A trident from the depths of hell.', projSpeed:13});

// Summon staves
defItem(I.HORNETSTAFF, { name:'Hornet Staff', type:'summonstaff', dmg:12, minion:'hornet', speed:0, color:'#ffd75e', icon:'🐝', maxStack:1, desc:'Summons hornets of the jungle.' });
defItem(I.SANGUINESTAFF, { name:'Sanguine Staff', type:'summonstaff', dmg:35, minion:'sanguine', speed:0, color:'#ff4d6d', icon:'🦇', maxStack:1, desc:'Summons a blood bat.' });
defItem(I.DEADLYSPHERESTAFF, { name:'Deadly Sphere Staff', type:'summonstaff', dmg:55, minion:'sphere', speed:0, color:'#ff4d4d', icon:'🔮', maxStack:1, desc:'Summons a deadly sphere.' });

// Accessories
defItem(I.LIGHTNINGBOOTS, { name:'Lightning Boots', type:'accessory', color:'#ffe14d', icon:'👟', maxStack:1, runSpeed:1.4, desc:'Greatly increases running speed.' });
defItem(I.AVENGEREMBLEM, { name:'Avenger Emblem', type:'accessory', color:'#ff4d6d', icon:'🎖️', maxStack:1, dmgMul:1.12, desc:'Increases damage by 12%.' });
defItem(I.DESTROYEREMBLEM, { name:'Destroyer Emblem', type:'accessory', color:'#ff9a3d', icon:'🎖️', maxStack:1, dmgMul:1.12, desc:'The ultimate emblem of destruction.' });
defItem(I.RIFLESCOPE, { name:'Rifle Scope', type:'accessory', color:'#8a8f9a', icon:'🎯', maxStack:1, rangedDmgMul:1.1, desc:'Ranged damage +10%.' });
defItem(I.SNIPERSCOPE, { name:'Sniper Scope', type:'accessory', color:'#5a5a6a', icon:'🎯', maxStack:1, rangedDmgMul:1.1, desc:'Ranged damage +10%.' });
defItem(I.PALADINSHIELD, { name:'Paladin\'s Shield', type:'accessory', color:'#d8c878', icon:'🛡️', maxStack:1, def:6, desc:'Defense +6. Dropped by Paladins.' });
defItem(I.TABI, { name:'Tabi', type:'accessory', color:'#4a4a50', icon:'🥷', maxStack:1, runSpeed:1.18, desc:'Greatly improves movement speed.' });
defItem(I.BLACKBELT, { name:'Black Belt', type:'accessory', color:'#202028', icon:'🥋', maxStack:1, invuln:0.2, desc:'Grants a chance to dodge attacks.' });
defItem(I.CELESTIALCUFFS, { name:'Celestial Cuffs', type:'accessory', color:'#6b8aff', icon:'📿', maxStack:1, manaMul:0.8, desc:'Reduces mana costs by 20%.' });
defItem(I.MAGICQUIVER, { name:'Magic Quiver', type:'accessory', color:'#8a6b4a', icon:'🎯', maxStack:1, rangedDmgMul:1.1, desc:'Ranged damage +10%.' });
defItem(I.PUTRIDSCENT, { name:'Putrid Scent', type:'accessory', color:'#8a9a5c', icon:'👃', maxStack:1, runSpeed:1.1, dmgMul:1.05, desc:'Speed +10%. Damage +5%.' });
defItem(I.CHARMOFMYTHS, { name:'Charm of Myths', type:'accessory', color:'#ff6b8a', icon:'🍀', maxStack:1, regen:20, desc:'Regenerates health over time.' });
defItem(I.MOONCHARM, { name:'Moon Charm', type:'accessory', color:'#8a6bd0', icon:'🌙', maxStack:1, dmgMul:1.1, desc:'Damage +10%. The moon empowers you.' });
defItem(I.NEPTUNESSHELL, { name:'Neptune\'s Shell', type:'accessory', color:'#3a7dff', icon:'🐚', maxStack:1, def:2, desc:'Defense +2.' });
defItem(I.ARCTICDIVINGGEAR, { name:'Arctic Diving Gear', type:'accessory', color:'#9adcff', icon:'🤿', maxStack:1, def:2, runSpeed:1.1, desc:'Defense +2. Speed +10%.' });

// Wings
defItem(I.HARPYWINGS, { name:'Harpy Wings', type:'accessory', color:'#e8e8f0', icon:'🪽', maxStack:1, jumpMul:1.0, desc:'Wings of a harpy.' });
defItem(I.ICEWINGS, { name:'Ice Wings', type:'accessory', color:'#9adcff', icon:'❄️', maxStack:1, jumpMul:1.0, desc:'Wings of frozen light.' });
defItem(I.BONEWINGS, { name:'Bone Wings', type:'accessory', color:'#e8e0c8', icon:'🪽', maxStack:1, jumpMul:1.05, desc:'Wings of bone.' });
defItem(I.SPOOKYWINGS, { name:'Spooky Wings', type:'accessory', color:'#3a3a4a', icon:'🦇', maxStack:1, jumpMul:1.1, desc:'Wings of the spooky forest.' });
defItem(I.FISHRONWINGS, { name:'Fishron Wings', type:'accessory', color:'#5ac8ff', icon:'🪽', maxStack:1, jumpMul:1.15, desc:'Duke Fishron\'s wings.' });
defItem(I.HOVERBOARD, { name:'Hoverboard', type:'accessory', color:'#c85cff', icon:'🛹', maxStack:1, jumpMul:1.2, desc:'A high-tech flying board.' });
defItem(I.SOLARWINGS, { name:'Solar Wings', type:'accessory', color:'#ff9a3d', icon:'☀️', maxStack:1, jumpMul:1.3, desc:'Wings of the sun.' });
defItem(I.NEBULAWINGS, { name:'Nebula Wings', type:'accessory', color:'#c85cff', icon:'🌌', maxStack:1, jumpMul:1.3, desc:'Wings of the nebula.' });
defItem(I.VORTEXWINGS, { name:'Vortex Wings', type:'accessory', color:'#3dff9d', icon:'🌀', maxStack:1, jumpMul:1.3, desc:'Wings of the vortex.' });
defItem(I.STARDUSTWINGS, { name:'Stardust Wings', type:'accessory', color:'#6bc8ff', icon:'✨', maxStack:1, jumpMul:1.3, desc:'Wings woven from stardust.' });

// Food & buff potions
defItem(I.BAKEDPOTATO, { name:'Baked Potato', type:'consumable', buff:{t:300, regen:12}, color:'#e8c88a', icon:'🥔', maxStack:30, desc:'Regenerate health for 5 minutes.' });
defItem(I.APPLEPIE, { name:'Apple Pie', type:'consumable', buff:{t:300, regen:10, runSpeed:1.05}, color:'#d8a878', icon:'🥧', maxStack:30, desc:'Regeneration and a little speed.' });
defItem(I.BURGER, { name:'Burger', type:'consumable', buff:{t:300, regen:15, runSpeed:1.08}, color:'#a86b3d', icon:'🍔', maxStack:30, desc:'Regeneration and speed.' });
defItem(I.INFERNOPOTION, { name:'Inferno Potion', type:'consumable', buff:{t:240, thorns:15, dmgMul:1.05}, color:'#ff6b3d', icon:'🔥', maxStack:30, desc:'Surround yourself in flames.' });
defItem(I.AMRORESERVATIONPOTION, { name:'Ammo Reservation Potion', type:'consumable', buff:{t:240, dmgMul:1.1}, color:'#c8a050', icon:'🎯', maxStack:30, desc:'+10% damage for 4 minutes.' });

// Boss summon
defItem(I.CELESTIALSIGIL, { name:'Celestial Sigil', type:'summon', boss:'moonlord', color:'#6bc8ff', icon:'🌀', maxStack:99, desc:'Summons the Moon Lord.' });

// Hardmode encounter rewards
defItem(I.KEYOFLIGHT, { name:'Key of Light', type:'mimickey', mimic:'hallow', color:'#ffe9a8', icon:'🗝️', maxStack:99, desc:'Place one in an empty Chest to awaken a Hallowed Mimic.' });
defItem(I.KEYOFNIGHT, { name:'Key of Night', type:'mimickey', mimic:'evil', color:'#9a6bb8', icon:'🗝️', maxStack:99, desc:'Place one in an empty Chest to awaken this world\'s evil Mimic.' });
defItem(I.DAEDALUSSTORMBOW, { name:'Daedalus Stormbow', type:'ranged', dmg:38, speed:0.317, kb:2.25, ammo:I.ARROW, proj:P.ARROW, spread:3, terrainMode:'rain', terrainHeight:180, auto:true, range:999, color:'#ffe9a8', icon:'🏹', maxStack:1, desc:'Rains the selected arrows from above the cursor.', projSpeed:12.5});
defItem(I.CRYSTALVILESHARD, { name:'Crystal Vile Shard', type:'magic', dmg:25, speed:0.55, kb:3, mana:13, proj:P.PHANTOMBOLT, projPersistent:true, auto:true, range:999, color:'#ff9de0', icon:'💎', maxStack:1, desc:'Fires crystal shards that pierce each target once.', projSpeed:32});
defItem(I.CLINGERSTAFF, { name:'Clinger Staff', type:'magic', dmg:43, speed:0.4, kb:8, mana:40, proj:P.CURSEDFLAME, magicMode:'wall', deployDuration:5, deployCount:1, zoneHeight:7, hitCooldown:0.3, auto:true, range:999, color:'#65d85c', icon:'🔥', maxStack:1, desc:'Summons a persistent wall of cursed flame.', projSpeed:15});
defItem(I.FETIDBAGHNAKHS, { name:'Fetid Baghnakhs', type:'melee', dmg:60, speed:0.133, kb:6, range:4, color:'#d85868', icon:'🗡️', maxStack:1, desc:'Savage claws with extreme attack speed.' });
defItem(I.LIFEDRAIN, { name:'Life Drain', type:'magic', dmg:35, speed:0.2, kb:2.5, mana:10, proj:P.SPORE, magicMode:'beam', channelRange:18, channelManaInterval:0.18, hitCooldown:0.2, lifeSteal:0.08, beamStyle:'blood', auto:true, range:999, color:'#e05868', icon:'🩸', maxStack:1, desc:'Channels a short crimson beam that restores life on contact.', projSpeed:10});
defItem(I.FLESHKNUCKLES, { name:'Flesh Knuckles', type:'accessory', def:7, color:'#c85058', icon:'✊', maxStack:1, desc:'Defense +7.' });
defItem(I.SHADOWFLAMEBOW, { name:'Shadowflame Bow', type:'ranged', dmg:47, speed:0.333, kb:4.5, ammo:I.ARROW, proj:P.CURSEDFLAME, auto:true, range:999, color:'#b45cff', icon:'🏹', maxStack:1, desc:'Converts arrows into shadowflame.', projSpeed:11});
defItem(I.SHADOWFLAMEKNIFE, { name:'Shadowflame Knife', type:'melee', dmg:43, speed:0.2, kb:5.75, range:4, meleeProj:P.PHANTOMBOLT, projSpeed:9, projLife:1.5, projBounces:2, projectileOnly:true, color:'#b45cff', icon:'🔪', maxStack:1, desc:'A bouncing knife wreathed in shadowflame.' });
defItem(I.SHADOWFLAMEHEXDOLL, { name:'Shadowflame Hex Doll', type:'magic', dmg:32, speed:0.35, kb:3.75, mana:6, proj:P.PHANTOMBOLT, auto:true, range:999, color:'#c85cff', icon:'🧸', maxStack:1, desc:'Unleashes streams of shadowflame.', projSpeed:9});
defItem(I.PIRATESTAFF, { name:'Pirate Staff', type:'summonstaff', dmg:40, minion:'pirate', speed:0, color:'#d8b878', icon:'🏴‍☠️', maxStack:1, desc:'Summons a pirate minion.' });
defItem(I.LUCKYCOIN, { name:'Lucky Coin', type:'accessory', dmgMul:1.05, color:'#ffd75e', icon:'🪙', maxStack:1, desc:'Damage +5%. Enemies drop richer loot.' });
defItem(I.DISCOUNTCARD, { name:'Discount Card', type:'accessory', runSpeed:1.08, color:'#e8d8a0', icon:'💳', maxStack:1, desc:'Speed +8%. A prized Pirate Invasion reward.' });
defItem(I.GOLDRING, { name:'Gold Ring', type:'accessory', def:3, color:'#ffd75e', icon:'💍', maxStack:1, desc:'Defense +3.' });
defItem(I.SOLARTABLETFRAGMENT, { name:'Solar Tablet Fragment', type:'material', color:'#ffb83d', icon:'☀️', maxStack:999, desc:'A fragment carried by Temple enemies.' });
defItem(I.SOLARTABLET, { name:'Solar Tablet', type:'eventitem', event:'solareclipse', time:'day', after:'plantera', color:'#ff9a3d', icon:'🌑', maxStack:99, desc:'Summons a Solar Eclipse during the day.' });
defItem(I.BROKENBATWING, { name:'Broken Bat Wing', type:'accessory', jumpMul:1.05, jumps:2, noFall:true, color:'#5a4a6a', icon:'🦇', maxStack:1, desc:'Leathery wings patched together.' });
defItem(I.TOXICFLASK, { name:'Toxic Flask', type:'magic', dmg:52, speed:0.75, kb:4, mana:30, proj:P.SPIT, projCount:3, auto:true, range:999, color:'#70d850', icon:'🧪', maxStack:1, desc:'Hurls toxic flasks.', projSpeed:14});
defItem(I.NAILGUN, { name:'Nail Gun', type:'ranged', dmg:85, speed:0.25, kb:3, ammo:I.MUSKETBALL, proj:P.GUNBULLET, auto:true, range:999, color:'#8a8f9a', icon:'🔫', maxStack:1, desc:'Drives high-velocity nails into enemies.', projSpeed:10});
defItem(I.EYESPRING, { name:'Eye Spring', type:'pet', pet:'eyespring', color:'#d84848', icon:'👁️', maxStack:1, desc:'Summons a suspicious springing eye. Dropped by Eyezor.' });
defItem(I.BUTCHERSCHAINSAW, { name:'Butcher\'s Chainsaw', type:'melee', dmg:120, speed:0.25, kb:8, range:4, color:'#b84840', icon:'🪚', maxStack:1, desc:'A savage chainsaw dropped by Butchers during a Solar Eclipse.' });
defItem(I.MOTHRONWINGS, { name:'Mothron Wings', type:'accessory', jumpMul:1.16, jumps:3, noFall:true, color:'#9a9ac8', icon:'🪽', maxStack:1, desc:'Powerful wings torn from Mothron.' });

// Early events, Deerclops, and Torch God
defItem(I.BLOODYTEAR, { name:'Bloody Tear', type:'eventitem', event:'bloodmoon', color:'#c83048', icon:'🩸', maxStack:99, desc:'Summons a Blood Moon. Use at night.' });
defItem(I.SHARKTOOTHNECKLACE, { name:'Shark Tooth Necklace', type:'accessory', dmgMul:1.06, color:'#e8e0c8', icon:'🦷', maxStack:1, desc:'Damage +6%.' });
defItem(I.CHUMCASTER, { name:'Chum Caster', type:'fishingrod', fishingPower:25, range:350, color:'#9a4a4a', icon:'🎣', maxStack:1, desc:'Improves catches during a Blood Moon.' });
defItem(I.BANANARANG, { name:'Bananarang', type:'melee', dmg:45, speed:0.183, kb:6.5, range:4, meleeProj:P.RAZOR, projSpeed:10, projLife:2.2, projReturn:0.65, returnSpeed:12, projectileOnly:true, persistentProj:true, color:'#f0d040', icon:'🍌', maxStack:1, desc:'A returning blade dropped by Clowns during a Blood Moon.' });
defItem(I.KOCANNON, { name:'KO Cannon', type:'melee', dmg:40, speed:0.467, kb:6.5, range:4, color:'#d85050', icon:'🥊', maxStack:1, projectileOnly:true, meleeProj:P.KOBOMB, projBounces:3, explosive:60, projSpeed:9, projLife:3, desc:'Launches a crushing spring punch. Dropped by Clowns.' });
defItem(I.HAEMORRHAXE, { name:'Haemorrhaxe', type:'melee', dmg:30, speed:0.45, kb:7, range:4, color:'#b83040', icon:'🪓', maxStack:1, desc:'A blood-soaked axe from Blood Moon fishing monsters.' });
defItem(I.BLOODTHORN, { name:'Blood Thorn', type:'magic', dmg:40, speed:0.55, kb:1, mana:20, proj:P.SPIT, terrainMode:'erupt', terrainCount:3, terrainHeight:80, auto:true, range:999, color:'#c83048', icon:'🌹', maxStack:1, desc:'Erupts three bloody thorns upward around the cursor.', projSpeed:32});
defItem(I.DRIPPLERCRIPPLER, { name:'Drippler Crippler', type:'melee', dmg:110, speed:0.667, kb:6.5, range:8, meleeProj:P.RAZOR, meleeMode:'flail', flailDuration:0.9, projectileOnly:true, persistentProj:true, color:'#a82f48', icon:'🔴', maxStack:1, desc:'A vicious flail torn from a Blood Eel.' });
defItem(I.FLINXFUR, { name:'Flinx Fur', type:'material', color:'#f0f0f8', icon:'🧶', maxStack:999, desc:'Warm fur from a Snow Flinx.' });
defItem(I.FLINXSTAFF, { name:'Flinx Staff', type:'summonstaff', dmg:8, minion:'flinx', speed:0, color:'#f0f0f8', icon:'🐾', maxStack:1, desc:'Summons a loyal flinx to fight for you.' });
defItem(I.AMBER, { name:'Amber', type:'material', color:'#e8a83d', icon:'💎', maxStack:999, desc:'Fossilized tree resin, warm as sunset.' });
defItem(I.AMBERROBE, { name:'Amber Robe', type:'armor', slot:'head', def:3, color:'#e8a83d', icon:'🧙', maxStack:1, desc:'Defense +3. Humming with old sunlight.' });
defItem(I.AMBERSTAFF, { name:'Amber Staff', type:'magic', dmg:21, speed:0.467, kb:4.75, mana:9, proj:P.MAGICBOLT, auto:true, range:999, color:'#e8a83d', icon:'🔮', maxStack:1, desc:'Casts bolts of fossilized light.', projSpeed:9});
defItem(I.DEERTHING, { name:'Deer Thing', type:'summon', boss:'deerclops', color:'#b8d8f0', icon:'🦌', maxStack:99, desc:'Summons Deerclops in the Snow biome.' });
defItem(I.LUCYTHEAXE, { name:'Lucy the Axe', type:'tool', power:65, speed:0.75, dmg:27, range:3.0, color:'#d8b878', icon:'🪓', maxStack:1, desc:'A talkative axe dropped by Deerclops.' });
defItem(I.PEWMATICHORN, { name:'Pew-matic Horn', type:'ranged', dmg:20, speed:0.25, kb:1, ammo:I.MUSKETBALL, proj:P.GUNBULLET, auto:true, range:999, color:'#a87858', icon:'🔫', maxStack:1, desc:'Rapidly fires bullets with a strange honk.', projSpeed:14});
defItem(I.WEATHERPAIN, { name:'Weather Pain', type:'magic', dmg:13, speed:0.75, kb:1, mana:30, proj:P.FROSTBOLT, projCount:3, projHoming:true, auto:true, range:999, color:'#a8d8f0', icon:'❄️', maxStack:1, desc:'Launches twisting shards of winter that track enemies.', projSpeed:1});
defItem(I.EYEBONE, { name:'Eye Bone', type:'pet', pet:'chester', color:'#8a5a3a', icon:'👁️', maxStack:1, desc:'Summons a strange one-eyed companion.' });
defItem(I.TORCHGODSFAVOR, { name:'Torch God\'s Favor', type:'consumable', permanent:'torchGodFavor', color:'#ffb84d', icon:'🔥', maxStack:1, desc:'Permanently grants biome-colored torch flames.' });
defItem(I.SNOWGLOBE, { name:'Snow Globe', type:'eventitem', event:'frostlegion', time:'any', hm:true, color:'#b8dcf0', icon:'🔮', maxStack:99, desc:'Summons the Frost Legion in Hardmode.' });
defItem(I.FORBIDDENFRAGMENT, { name:'Forbidden Fragment', type:'material', color:'#e8c878', icon:'◇', maxStack:999, desc:'A storm-worn fragment carried by Sand Elementals.' });
defItem(I.LASERDRILL, { name:'Laser Drill', type:'tool', power:230, speed:0.18, dmg:35, range:4.5, color:'#68e8d0', icon:'⛏️', maxStack:1, desc:'A rapid mining tool carried by Martian Engineers.' });
defItem(I.ANTIGRAVITYHOOK, { name:'Anti-Gravity Hook', type:'hook', hookRange:420, hookSpeed:18, hookPull:15, hookCount:3, color:'#68e8d0', icon:'🪝', maxStack:1, desc:'A multidirectional hook recovered from Martian Engineers.' });
defItem(I.ELECTROSPHERELAUNCHER, { name:'Electrosphere Launcher', type:'ranged', dmg:40, speed:0.2, kb:2, ammo:I.ROCKET1, proj:P.PLASMA, range:999, color:'#70d8f0', icon:'🔫', maxStack:1, electro:true, desc:'A volatile launcher dropped by the Martian Saucer.', projSpeed:12});
defItem(I.BRAINSCRAMBLERMOUNT, { name:'Brain Scrambler', type:'mount', mount:'scutlix', mountSpeed:7.2, mountJump:-12.5, color:'#68c8bc', icon:'👽', maxStack:1, desc:'Summons a rideable Scutlix. Dropped by Scutlix Gunners.' });
defItem(I.PURIFICATIONPOWDER, { name:'Purification Powder', type:'purify', color:'#d8ffd0', icon:'✨', maxStack:99, desc:'Cleanses nearby Corruption or Crimson blocks.' });
defItem(I.SPELLTOME, { name:'Spell Tome', type:'material', color:'#9a68c8', icon:'📘', maxStack:99, desc:'A blank magical volume sold by the Wizard.' });
defItem(I.HARP, { name:'Harp', type:'material', color:'#e8c878', icon:'🎵', maxStack:99, desc:'A finely tuned instrument sold by the Wizard.' });
defItem(I.DAYBLOOM, { name:'Daybloom', type:'material', color:'#f0e060', icon:'🌼', maxStack:999, desc:'A sunny herb dropped by Angry Dandelions.' });
defItem(I.BLUEKITE, { name:'Blue Kite', type:'kite', kiteColor:'#4d8cff', color:'#4d8cff', icon:'🪁', maxStack:1, desc:'Can be flown on windy days.' });
defItem(I.BLUEYELLOWKITE, { name:'Blue and Yellow Kite', type:'kite', kiteColor:'#4d8cff', kiteAccent:'#ffe050', color:'#6aa0ff', icon:'🪁', maxStack:1, desc:'Can be flown on windy days.' });
defItem(I.REDKITE, { name:'Red Kite', type:'kite', kiteColor:'#e85050', color:'#e85050', icon:'🪁', maxStack:1, desc:'Can be flown on windy days.' });
defItem(I.REDYELLOWKITE, { name:'Red and Yellow Kite', type:'kite', kiteColor:'#e85050', kiteAccent:'#ffe050', color:'#f07050', icon:'🪁', maxStack:1, desc:'Can be flown on windy days.' });
defItem(I.YELLOWKITE, { name:'Yellow Kite', type:'kite', kiteColor:'#f0d840', color:'#f0d840', icon:'🪁', maxStack:1, desc:'Can be flown on windy days.' });
defItem(I.BUNNYKITE, { name:'Bunny Kite', type:'kite', kiteColor:'#f0e8dc', kiteAccent:'#e898a8', color:'#f0e8dc', icon:'🐇', maxStack:1, desc:'A bunny-shaped kite carried by Windy Balloons.' });
defItem(I.GOLDFISHKITE, { name:'Goldfish Kite', type:'kite', kiteColor:'#f09038', kiteAccent:'#ffd060', color:'#f09038', icon:'🐟', maxStack:1, desc:'A goldfish-shaped kite carried by Windy Balloons.' });
defItem(I.PAPERAIRPLANE, { name:'Paper Airplane', type:'throwable', dmg:4, speed:0.28, proj:P.PAPERPLANE, color:'#d8c8a8', icon:'✈', maxStack:999, desc:'A reusable wind-affected ranged novelty.' });
defItem(I.WHITEPAPERAIRPLANE, { name:'White Paper Airplane', type:'throwable', dmg:4, speed:0.28, proj:P.PAPERPLANE, color:'#f8f8f0', icon:'✈', maxStack:999, desc:'A reusable wind-affected ranged novelty.' });
defItem(I.PINWHEEL, { name:'Pin Wheel', type:'material', color:'#ff7090', icon:'✺', maxStack:999, desc:'Novelty furniture sold by the Merchant during a Windy Day.' });
defItem(I.PARTYCENTER, { name:'Party Center', type:'block', tile:T.PARTYCENTER, color:'#ff70b8', icon:'block', maxStack:99, desc:'Place and right-click to toggle a manual Party.' });
defItem(I.PARTYHAT, { name:'Party Hat', type:'material', color:'#70b8ff', icon:'△', maxStack:99, desc:'A festive hat sold by the Party Girl.' });
defItem(I.PARTYPRESENT, { name:'Party Present', type:'partygift', gift:'present', color:'#ff80c0', icon:'🎁', maxStack:99, desc:'Open for a festive surprise.' });
defItem(I.PIGRONATA, { name:'Pigronata', type:'partygift', gift:'pigronata', color:'#f090b8', icon:'🐷', maxStack:99, desc:'Break it open for coins and party supplies.' });
defItem(I.PARTYSTREAMER, { name:'Party Streamers', type:'material', color:'#70d8ff', icon:'〰', maxStack:999, desc:'Colorful streamers sold during Parties.' });
defItem(I.SILLYBALLOON, { name:'Silly Balloon', type:'material', color:'#d870ff', icon:'●', maxStack:999, desc:'A tied decorative balloon sold during Parties.' });
defItem(I.SLICEOFCAKE, { name:'Slice of Cake', type:'partycake', buff:{t:120,runSpeed:1.2,mineSpeed:1.2}, color:'#ffb8d8', icon:'🍰', maxStack:1, desc:'Reusable. Grants Sugar Rush for two minutes.' });
defItem(I.RELEASELANTERN, { name:'Release Lantern', type:'releaselantern', color:'#ffc868', icon:'🏮', maxStack:999, desc:'Release a glowing lantern into the night sky.' });
defItem(I.FALLENSTAR, { name:'Fallen Star', type:'material', color:'#ffe88a', icon:'⭐', maxStack:999, desc:'Falls from the night sky. Vanishes from the ground at dawn.' });
defItem(I.TOMBSTONE, { name:'Tombstone', type:'block', tile:T.TOMBSTONE, color:'#777780', icon:'block', maxStack:999, desc:'Nearby Tombstones create a Graveyard. Every death places one.' });
defItem(I.SUNFLOWER, { name:'Sunflower', type:'block', tile:T.SUNFLOWER, color:'#ffe050', icon:'block', maxStack:999, desc:'Each nearby Sunflower cancels one Tombstone.' });
defItem(I.GRAVEDIGGERSHOVEL, { name:'Gravedigger\'s Shovel', type:'tool', power:55, speed:1.2, dmg:12, range:3.5, color:'#8a7a68', icon:'⛏️', maxStack:1, desc:'Crafted at an Anvil in Ecto Mist.' });
defItem(I.SHADOWCANDLE, { name:'Shadow Candle', type:'material', color:'#8f70d8', icon:'🕯️', maxStack:99, desc:'A sinister candle crafted at a Workbench in Ecto Mist.' });
defItem(I.TATTEREDSIGN, { name:'Tattered Wood Sign', type:'material', color:'#78604a', icon:'▧', maxStack:99, desc:'A weathered sign crafted in Ecto Mist.' });
defItem(I.VITALCRYSTAL, { name:'Vital Crystal', type:'consumable', permanent:'vitalCrystal', permanentMsg:'Vital Crystal permanently improves health regeneration.', color:'#ff7088', icon:'💎', maxStack:999, desc:'Permanently increases health regeneration by 20%. One use per player.' });
defItem(I.AEGISFRUIT, { name:'Aegis Fruit', type:'consumable', permanent:'aegisFruit', permanentMsg:'Aegis Fruit permanently increases defense by 4.', color:'#e8b84d', icon:'🍐', maxStack:999, desc:'Permanently increases defense by 4. One use per player.' });
defItem(I.AMBROSIA, { name:'Ambrosia', type:'consumable', permanent:'ambrosia', permanentMsg:'Ambrosia permanently improves mining speed.', color:'#ffd070', icon:'🍯', maxStack:999, desc:'Permanently increases mining speed by 5%. One use per player.' });
defItem(I.ADVCOMBAT2, { name:'Advanced Combat Techniques: Volume Two', type:'consumable', permanent:'advancedCombat2', permanentMsg:'Town residents feel permanently empowered.', color:'#b890e8', icon:'📕', maxStack:999, desc:'Permanently improves town resident combat training. One use per player.' });

// ---------- Missing subsystems + content batch ----------
// Blocks & furniture
defItem(I.GLASS, { name:'Glass', type:'block', tile:T.GLASS, color:'#c8e8f0', icon:'block', desc:'Smelted sand. Fragile, translucent.' });
defItem(I.SPOOKYWOOD, { name:'Spooky Wood', type:'block', tile:T.SPOOKYWOOD, color:'#4a4a5a', icon:'block', desc:'From the Pumpkin Moon.' });
defItem(I.HONEY, { name:'Honey Block', type:'block', tile:T.HONEY, color:'#e8a83d', icon:'block', desc:'Slimy golden honey.' });
defItem(I.CHEST, { name:'Chest', type:'block', tile:T.CHEST, color:'#9a6b3f', icon:'block', maxStack:99, desc:'Stores 20 items. Right-click to open.' });
defItem(I.CHAIR, { name:'Wooden Chair', type:'block', tile:T.CHAIR, color:'#8a5c34', icon:'block', desc:'Furniture. Place it.' });
defItem(I.TABLE, { name:'Wooden Table', type:'block', tile:T.TABLE, color:'#9a6b3f', icon:'block', desc:'Furniture. Place it.' });
defItem(I.WOODWALL, { name:'Wood Wall', type:'wall', wall:WALL.WOOD, color:'#5a402b', icon:'block', maxStack:999, desc:'Safe background wall for town housing.' });

// Town Pylon network
defItem(I.PYLON_FOREST, { name:'Forest Pylon', type:'pylon', tile:T.PYLON, pylonBiome:BIOME.FOREST, color:'#5fbf4d', icon:'block', maxStack:99, desc:'Teleport network node. Links when placed in a Forest.' });
defItem(I.PYLON_DESERT, { name:'Desert Pylon', type:'pylon', tile:T.PYLON, pylonBiome:BIOME.DESERT, color:'#e8d191', icon:'block', maxStack:99, desc:'Teleport network node. Links when placed in a Desert.' });
defItem(I.PYLON_SNOW, { name:'Snow Pylon', type:'pylon', tile:T.PYLON, pylonBiome:BIOME.SNOW, color:'#cfdce8', icon:'block', maxStack:99, desc:'Teleport network node. Links when placed in a Snow biome.' });
defItem(I.PYLON_JUNGLE, { name:'Jungle Pylon', type:'pylon', tile:T.PYLON, pylonBiome:BIOME.JUNGLE, color:'#4db85c', icon:'block', maxStack:99, desc:'Teleport network node. Links when placed in the Jungle.' });
defItem(I.PYLON_HALLOW, { name:'Hallow Pylon', type:'pylon', tile:T.PYLON, pylonBiome:BIOME.HALLOW, color:'#e6c0f0', icon:'block', maxStack:99, desc:'Teleport network node. Links when placed in the Hallow.' });
defItem(I.PYLON_CORRUPT, { name:'Corruption Pylon', type:'pylon', tile:T.PYLON, pylonBiome:BIOME.CORRUPT, color:'#7a5a8c', icon:'block', maxStack:99, desc:'Teleport network node. Links when placed in the Corruption.' });
defItem(I.PYLON_CRIMSON, { name:'Crimson Pylon', type:'pylon', tile:T.PYLON, pylonBiome:BIOME.CRIMSON, color:'#b04040', icon:'block', maxStack:99, desc:'Teleport network node. Links when placed in the Crimson.' });
defItem(I.PYLON_OCEAN, { name:'Ocean Pylon', type:'pylon', tile:T.PYLON, pylonBiome:BIOME.OCEAN, color:'#4d8ad8', icon:'block', maxStack:99, desc:'Teleport network node. Links when placed in an Ocean.' });
defItem(I.PYLON_UNIVERSAL, { name:'Universal Pylon', type:'pylon', tile:T.PYLON, pylonBiome:'any', color:'#ffd75e', icon:'block', maxStack:99, desc:'Teleport network node. Works in any biome.' });

// Grappling hooks
defItem(I.GRAPPLINGHOOK, { name:'Grappling Hook', type:'hook', hookRange:300, hookSpeed:13, hookPull:11, hookCount:1, color:'#c0c0c0', icon:'🪝', maxStack:1, desc:'Latch onto walls to swing and climb.' });
defItem(I.IVYWHIP, { name:'Ivy Whip', type:'hook', hookRange:340, hookSpeed:15, hookPull:13, hookCount:2, color:'#3f9a4d', icon:'🪝', maxStack:1, desc:'Jungle vines. Faster pull.' });
defItem(I.WEBSLINGER, { name:'Web Slinger', type:'hook', hookRange:420, hookSpeed:12, hookPull:9, hookCount:2, color:'#e8e8e8', icon:'🕸️', maxStack:1, desc:'Long sticky webs.' });
defItem(I.DUALHOOK, { name:'Dual Hook', type:'hook', hookRange:320, hookSpeed:16, hookPull:13, hookCount:2, color:'#8a8f9a', icon:'🪝', maxStack:1, desc:'Two hooks, faster travel. Dropped by Mimics.' });
defItem(I.CHRISTMASHOOK, { name:'Christmas Hook', type:'hook', hookRange:350, hookSpeed:16, hookPull:13, hookCount:2, color:'#d04040', icon:'🪝', maxStack:1, desc:'A festive grabber dropped by Everscream.' });
defItem(I.SPOOKYHOOK, { name:'Spooky Hook', type:'hook', hookRange:380, hookSpeed:16, hookPull:14, hookCount:3, color:'#7a7a8a', icon:'🪝', maxStack:1, desc:'Dropped by Mourning Wood. Triple hook.' });
defItem(I.LUNARHOOK, { name:'Lunar Hook', type:'hook', hookRange:420, hookSpeed:18, hookPull:16, hookCount:4, color:'#6bc8ff', icon:'🪝', maxStack:1, desc:'Four hooks of lunar crystal.' });

// Mounts
defItem(I.UNICORNMOUNT, { name:'Blessed Apple', type:'mount', mount:'unicorn', mountSpeed:6.2, mountJump:-12.5, color:'#fff0d0', icon:'🐎', maxStack:1, desc:'Ride a galloping Unicorn.' });
defItem(I.BROOM, { name:'Witch\'s Broom', type:'mount', mount:'broom', mountSpeed:4.6, mountFly:true, color:'#4a3d2d', icon:'🧹', maxStack:1, desc:'A flying broom from the Pumpkin Moon.' });
defItem(I.UFOMOUNT, { name:'Cosmic Car Key', type:'mount', mount:'ufo', mountSpeed:5.4, mountFly:true, color:'#3dff9d', icon:'🛸', maxStack:1, desc:'A UFO mount from the Martians.' });
defItem(I.REINDEERMOUNT, { name:'Reindeer Bells', type:'mount', mount:'reindeer', mountSpeed:7.0, mountJump:-13.0, color:'#e8d8a8', icon:'🦌', maxStack:1, desc:'A rapid Reindeer from the Frost Moon.' });
defItem(I.SHRIMPYTRUFFLE, { name:'Shrimpy Truffle', type:'mount', mount:'shrimp', mountSpeed:5.0, mountJump:-11.0, mountWater:true, color:'#5ac8ff', icon:'🐟', maxStack:1, desc:'A mount dropped by Duke Fishron. Fast in water.' });

// Fishing rods & bait
defItem(I.FISHINGROD_WOODEN, { name:'Wooden Fishing Pole', type:'fishingrod', fishingPower:15, color:'#b5824f', icon:'🎣', maxStack:1, desc:'A simple pole. Needs bait.' });
defItem(I.FISHINGROD_IRON, { name:'Iron Fishing Rod', type:'fishingrod', fishingPower:25, color:'#c0c0c8', icon:'🎣', maxStack:1, desc:'A sturdy rod.' });
defItem(I.FISHINGROD_FIBERGLASS, { name:'Fiberglass Fishing Pole', type:'fishingrod', fishingPower:32, color:'#3dff9d', icon:'🎣', maxStack:1, desc:'A sleek hallowed rod.' });
defItem(I.FISHINGROD_GOLDEN, { name:'Golden Fishing Rod', type:'fishingrod', fishingPower:45, color:'#ffd75e', icon:'🎣', maxStack:1, desc:'The finest rod of all.' });
defItem(I.HOTLINEFISHINGHOOK, { name:'Hotline Fishing Hook', type:'accessory', lavaFish:true, color:'#ff5a3c', icon:'🎣', maxStack:1, desc:'Lets you fish in lava. A reward from the Angler after 25 quests.' });
defItem(I.ANGLEREARRING, { name:'Angler Earring', type:'accessory', fishingPower:10, color:'#4ec8ff', icon:'🎣', maxStack:1, desc:'+10 fishing power. A reward from the Angler after 20 quests.' });
defItem(I.TACKLEBOX, { name:'Tackle Box', type:'accessory', baitSave:0.05, color:'#d89048', icon:'🧰', maxStack:1, desc:'5% chance not to consume bait. A reward from the Angler after 30 quests.' });
defItem(I.FISHERMANSPOCKETGUIDE, { name:'Fisherman\'s Pocket Guide', type:'accessory', fishInfo:true, color:'#e8d8b8', icon:'📖', maxStack:1, desc:'Displays current fishing power. A reward from the Angler after 5 quests.' });
defItem(I.WEATHERRADIO, { name:'Weather Radio', type:'accessory', weatherInfo:true, color:'#e8b860', icon:'📻', maxStack:1, desc:'Displays local weather and wind. A reward from the Angler after 10 quests.' });
defItem(I.SEXTANT, { name:'Sextant', type:'accessory', moonInfo:true, color:'#d8c078', icon:'🧭', maxStack:1, desc:'Displays the moon phase. A reward from the Angler after 15 quests.' });
defItem(I.FISHFINDER, { name:'Fish Finder', type:'accessory', fishInfo:true, weatherInfo:true, moonInfo:true, color:'#70d8e8', icon:'📟', maxStack:1, desc:'Displays fishing power, weather, wind, and moon phase.' });
defItem(I.WORM, { name:'Worm', type:'bait', baitPower:20, color:'#c89068', icon:'🪱', maxStack:99, desc:'Fishing bait.' });
defItem(I.NIGHTCRAWLER, { name:'Enchanted Nightcrawler', type:'bait', baitPower:35, color:'#8ad8ff', icon:'🪱', maxStack:999, desc:'35% bait power. Appears on clear Starfall nights.' });

// Fish
defItem(I.FISH_BASS, { name:'Bass', type:'material', color:'#9ab8a8', icon:'🐟', maxStack:99, desc:'Cook it at a furnace.' });
defItem(I.FISH_TROUT, { name:'Trout', type:'material', color:'#a8a8c8', icon:'🐟', maxStack:99, desc:'Cook it at a furnace.' });
defItem(I.FISH_SALMON, { name:'Salmon', type:'material', color:'#e89090', icon:'🐟', maxStack:99, desc:'Cook it at a furnace.' });
defItem(I.FISH_NEONTETRA, { name:'Neon Tetra', type:'material', color:'#8ae8ff', icon:'🐟', maxStack:99, desc:'A hallowed glow-fish.' });
defItem(I.FISH_EBONKOI, { name:'Ebonkoi', type:'material', color:'#6a5a8c', icon:'🐟', maxStack:99, desc:'A corrupted carp.' });
defItem(I.FISH_CRIMSONTIGER, { name:'Crimson Tigerfish', type:'material', color:'#c04848', icon:'🐟', maxStack:99, desc:'A fierce red fish.' });
defItem(I.FISH_CAVEFISH, { name:'Armored Cavefish', type:'material', color:'#9aa0a8', icon:'🐟', maxStack:99, desc:'Blind cave dweller.' });
defItem(I.FISH_FLOUNDER, { name:'Flounder', type:'material', color:'#b8a878', icon:'🐟', maxStack:99, desc:'A flat ocean fish.' });
defItem(I.FISH_ROCKFISH, { name:'Rockfish', type:'material', color:'#8a8a90', icon:'🐟', maxStack:99, desc:'A stony bottom-dweller.' });
defItem(I.FISH_PUFFER, { name:'Pufferfish', type:'material', color:'#e8c850', icon:'🐡', maxStack:99, desc:'Spiky and unappetizing.' });

// Crates
defItem(I.WOODENCRATE, { name:'Wooden Crate', type:'consumable', crate:1, color:'#b5824f', icon:'📦', maxStack:99, desc:'Right-click to open for random loot.' });
defItem(I.IRONCRATE, { name:'Iron Crate', type:'consumable', crate:2, color:'#9aa0a8', icon:'📦', maxStack:99, desc:'A sturdier crate with better loot.' });
defItem(I.GOLDENCRATE, { name:'Golden Crate', type:'consumable', crate:3, color:'#ffd75e', icon:'📦', maxStack:99, desc:'The treasure of the deep.' });

// Pets & light pets
defItem(I.ZEPHYRFISH, { name:'Zephyr Fish', type:'pet', pet:'zephyr', color:'#6bc8ff', icon:'🐠', maxStack:1, desc:'A tiny fish that follows you.' });
defItem(I.PUPPY, { name:'Puppy', type:'pet', pet:'puppy', color:'#c8a878', icon:'🐶', maxStack:1, desc:'A loyal companion.' });
defItem(I.BABYDINO, { name:'Baby Dinosaur', type:'pet', pet:'dino', color:'#5cbf4d', icon:'🦕', maxStack:1, desc:'A tiny prehistoric pal.' });
defItem(I.BABYEATER, { name:'Baby Eater', type:'pet', pet:'eater', color:'#7a4d8c', icon:'🦠', maxStack:1, desc:'A corrupted baby, mostly harmless. Rarely dropped by the Eater of Worlds.' });
defItem(I.WISP, { name:'Wisp in a Bottle', type:'lightpet', light:'wisp', lightR:5, color:'#6bc8ff', icon:'🕯️', maxStack:1, desc:'A friendly wisp of light.' });
defItem(I.SHADOWORB, { name:'Shadow Orb', type:'lightpet', light:'shadow', lightR:4, color:'#a9b0ff', icon:'🟣', maxStack:1, desc:'A dark orb that lights your way. Found by smashing a Shadow Orb.' });
defItem(I.MAGICLANTERN, { name:'Magic Lantern', type:'lightpet', light:'lantern', lightR:4.5, color:'#ffe14d', icon:'🏮', maxStack:1, desc:'Reveals ores in the dark.' });
defItem(I.CATLICENSE, { name:'Cat License', type:'pet', pet:'cat', color:'#e8a860', icon:'🐱', maxStack:1, desc:'A license to adopt a feline companion. Sold by the Zoologist.' });
defItem(I.RABBITPERCH, { name:'Bunny Perch', type:'pet', pet:'bunny', color:'#f0e8dc', icon:'🐰', maxStack:1, desc:'A tiny hopper joins your adventure. Sold by the Zoologist.' });
defItem(I.LIGHTNINGCARROT, { name:'Lightning Carrot', type:'mount', mount:'lightbunny', mountSpeed:8.0, mountJump:-13.0, color:'#ffe14d', icon:'🥕', maxStack:1, desc:'A rabbit that runs like lightning. Sold by the Zoologist.' });

// Events
defItem(I.PUMPKIN, { name:'Pumpkin', type:'material', color:'#ff9a3d', icon:'🎃', maxStack:99, desc:'Dropped by autumn enemies.' });
defItem(I.ECTOPLASM, { name:'Ectoplasm', type:'material', color:'#9de0ff', icon:'👻', maxStack:99, desc:'Ghostly essence.' });
defItem(I.PUMPKINMEDALLION, { name:'Pumpkin Moon Medallion', type:'eventitem', event:'pumpkinmoon', color:'#ff9a3d', icon:'🎃', maxStack:99, desc:'Summons the Pumpkin Moon. Use at night.' });
defItem(I.NAUGHTYPRESENT, { name:'Naughty Present', type:'eventitem', event:'frostmoon', color:'#d04040', icon:'🎁', maxStack:99, desc:'Summons the Frost Moon. Use at night.' });
defItem(I.TATTEREDCLOTH, { name:'Tattered Cloth', type:'material', color:'#7a6a5a', icon:'🧵', maxStack:999, desc:'Torn cloth carried by Goblin Scouts. Used to rally the Goblin Army.' });
defItem(I.GOBLINBATTLESTANDARD, { name:'Goblin Battle Standard', type:'eventitem', event:'goblinarmy', time:'any', color:'#4a6a3d', icon:'🚩', maxStack:99, desc:'Summons the Goblin Army. Use at any time.' });
defItem(I.PIRATEMAP, { name:'Pirate Map', type:'eventitem', event:'pirateinvasion', time:'any', hm:true, color:'#d8c8a0', icon:'🗺️', maxStack:99, desc:'Summons the Pirate Invasion in Hardmode.' });

// Event drops
defItem(I.THEHORSEMANSBLADE, { name:'The Horseman\'s Blade', type:'melee', dmg:150, speed:0.433, kb:7.5, range:4, color:'#ff8a3d', icon:'⚔️', maxStack:1, meleeProj:P.PUMPKINBLADE, projCount:2, projSpeed:7.5, projLife:2, projDamageMul:0.6, persistentProj:true, desc:'Dropped by the Pumpking.' });
defItem(I.RAZORPINE, { name:'Razorpine', type:'ranged', dmg:48, speed:0.133, kb:3.25, ammo:I.BONE, proj:P.DART, auto:true, range:999, color:'#4daf3d', icon:'🌲', maxStack:1, desc:'An Everscream weapon that fires pine needles.', projSpeed:12});
defItem(I.SNOWMANCANNON, { name:'Snowman Cannon', type:'ranged', dmg:67, speed:0.25, kb:4, ammo:I.ROCKET4, proj:P.ROCKET, projHoming:true, range:999, color:'#e8f0f8', icon:'⛄', maxStack:1, desc:'An Ice Queen cannon that fires homing explosive rockets.', projSpeed:15});
defItem(I.INFLUXWAVER, { name:'Influx Waver', type:'melee', dmg:100, speed:0.333, kb:4.5, range:4, color:'#3dff9d', icon:'⚔️', maxStack:1, meleeProj:P.WAVERSWORD, projChance:0.34, projSpeed:10, projLife:1.6, projDamageMul:1, desc:'Dropped by the Martian Saucer.' });
defItem(I.CHARGEDBLASTER, { name:'Charged Blaster Cannon', type:'ranged', dmg:100, speed:0.333, kb:2, ammo:I.BULLET, proj:P.PLASMA, auto:true, range:999, color:'#3dff9d', icon:'🔫', maxStack:1, desc:'A plasma cannon carried by Gigazappers.', projSpeed:14});
defItem(I.CELEBRATION, { name:'Celebration', type:'ranged', dmg:25, speed:0.5, kb:4, ammo:I.ROCKET4, proj:P.ROCKET, auto:true, range:999, color:'#ff9de0', icon:'🎆', maxStack:1, desc:'A party that ends worlds. Uses rockets.', projSpeed:15});
defItem(I.COINGUN, { name:'Coin Gun', type:'ranged', dmg:0, speed:0.133, kb:2, ammo:I.COIN, proj:P.GUNBULLET, auto:true, range:999, color:'#ffd75e', icon:'🪙', maxStack:1, desc:'A rare prize from the Pirate Invasion. Fires coins.' });
defItem(I.COIN, { name:'Copper Coin', type:'ammo', ammoGroup:'coin', dmg:25, value:1, color:'#d88a5a', icon:'🪙', maxStack:999, desc:'One copper. The base unit of the town economy. Powers the Coin Gun.' });
defItem(I.SILVERCOIN, { name:'Silver Coin', type:'ammo', ammoGroup:'coin', dmg:50, value:100, color:'#d8d8e8', icon:'🪙', maxStack:999, desc:'Worth 100 copper.' });
defItem(I.GOLDCOIN, { name:'Gold Coin', type:'ammo', ammoGroup:'coin', dmg:100, value:10000, color:'#ffd75e', icon:'🪙', maxStack:999, desc:'Worth 100 silver.' });
defItem(I.PLATINUMCOIN, { name:'Platinum Coin', type:'ammo', ammoGroup:'coin', dmg:200, value:1000000, color:'#d8f0ff', icon:'🪙', maxStack:999, desc:'Worth 100 gold. A fortune in one coin.' });

// Darts & rockets
defItem(I.DART, { name:'Wooden Dart', type:'ammo', dmg:6, color:'#b5824f', icon:'➶', maxStack:999 });
defItem(I.CRYSTALDART, { name:'Crystal Dart', type:'ammo', dmg:14, color:'#ff9de0', icon:'💠', maxStack:999 });
defItem(I.CURSEDDART, { name:'Cursed Dart', type:'ammo', dmg:9, status:{type:'cursed',duration:4,dps:8}, color:'#3dff9d', icon:'💚', maxStack:999 });
defItem(I.ICHORDART, { name:'Ichor Dart', type:'ammo', dmg:10, status:{type:'ichor',duration:5,defense:12}, color:'#e8e060', icon:'💛', maxStack:999 });
defItem(I.VENOMDART, { name:'Venom Dart', type:'ammo', dmg:15, status:{type:'venom',duration:5,dps:12}, color:'#c85cff', icon:'💜', maxStack:999 });
defItem(I.ROCKET1, { name:'Rocket I', type:'ammo', dmg:40, explosive:48, color:'#c8ccd4', icon:'🚀', maxStack:999, desc:'Explodes on impact.' });
defItem(I.ROCKET2, { name:'Rocket II', type:'ammo', dmg:40, explosive:56, color:'#8a8f9a', icon:'🚀', maxStack:999, desc:'A bigger boom.' });
defItem(I.ROCKET3, { name:'Rocket III', type:'ammo', dmg:65, explosive:64, color:'#ff9a3d', icon:'🚀', maxStack:999, desc:'Even bigger.' });
defItem(I.ROCKET4, { name:'Rocket IV', type:'ammo', dmg:65, explosive:72, color:'#ff4d4d', icon:'🚀', maxStack:999, desc:'The biggest boom.' });
defItem(I.GRENADE, { name:'Grenade', type:'ammo', dmg:60, explosive:52, color:'#4d9aff', icon:'💣', maxStack:999, desc:'A throwable explosion.' });

// Potions
defItem(I.MININGPOTION, { name:'Mining Potion', type:'consumable', buff:{t:240, mineSpeed:1.5}, color:'#c89068', icon:'🧪', maxStack:30, desc:'Mine much faster for 4 minutes.' });
defItem(I.FISHINGPOTION, { name:'Fishing Potion', type:'consumable', buff:{t:240, fishingPower:25}, color:'#6bc8ff', icon:'🧪', maxStack:30, desc:'+25 fishing power for 4 minutes.' });
defItem(I.BATTLEPOTION, { name:'Battle Potion', type:'consumable', buff:{t:240, spawnMult:2, dmgMul:1.08}, color:'#ff4d4d', icon:'🧪', maxStack:30, desc:'Attracts enemies and boosts damage.' });

// Accessories
defItem(I.CLOUDINABOTTLE, { name:'Cloud in a Bottle', type:'accessory', color:'#e8f0f8', icon:'☁️', maxStack:1, jumps:1, desc:'An extra mid-air jump.' });
defItem(I.GOLDENHORSESHOE, { name:'Golden Horseshoe', type:'accessory', color:'#ffd75e', icon:'🦶', maxStack:1, noFall:true, desc:'Negates fall damage.' });

// Dyes (equip in the dye slots to tint your armor)
defItem(I.DYE_RED, { name:'Red Dye', type:'dye', color:'#e04040', icon:'🧴', maxStack:99, desc:'Tints your armor red.' });
defItem(I.DYE_ORANGE, { name:'Orange Dye', type:'dye', color:'#e8863d', icon:'🧴', maxStack:99, desc:'Tints your armor orange.' });
defItem(I.DYE_YELLOW, { name:'Yellow Dye', type:'dye', color:'#e8c83d', icon:'🧴', maxStack:99, desc:'Tints your armor yellow.' });
defItem(I.DYE_GREEN, { name:'Green Dye', type:'dye', color:'#4dbf5c', icon:'🧴', maxStack:99, desc:'Tints your armor green.' });
defItem(I.DYE_CYAN, { name:'Cyan Dye', type:'dye', color:'#3dd0d0', icon:'🧴', maxStack:99, desc:'Tints your armor cyan.' });
defItem(I.DYE_BLUE, { name:'Blue Dye', type:'dye', color:'#3d6ad0', icon:'🧴', maxStack:99, desc:'Tints your armor blue.' });
defItem(I.DYE_PURPLE, { name:'Purple Dye', type:'dye', color:'#8a3dd0', icon:'🧴', maxStack:99, desc:'Tints your armor purple.' });
defItem(I.DYE_PINK, { name:'Pink Dye', type:'dye', color:'#e06ab0', icon:'🧴', maxStack:99, desc:'Tints your armor pink.' });
defItem(I.DYE_WHITE, { name:'White Dye', type:'dye', color:'#f0f0f0', icon:'🧴', maxStack:99, desc:'Tints your armor white.' });
defItem(I.DYE_BLACK, { name:'Black Dye', type:'dye', color:'#3a3a3a', icon:'🧴', maxStack:99, desc:'Tints your armor black.' });
defItem(I.DYE_BROWN, { name:'Brown Dye', type:'dye', color:'#8a5c34', icon:'🧴', maxStack:99, desc:'Tints your armor brown.' });
defItem(I.DYE_RAINBOW, { name:'Rainbow Dye', type:'dye', color:'#ff9de0', icon:'🧴', maxStack:99, desc:'Tints your armor with shifting colors.' });
defItem(I.STRANGEPLANT, { name:'Strange Plant', type:'material', color:'#d85cff', icon:'✿', maxStack:99, desc:'A rare Hardmode plant sought by the Dye Trader.' });
defItem(I.DYE_ACID, { name:'Acid Dye', type:'dye', color:'#8cff40', icon:'🧴', maxStack:99, desc:'A rare luminous dye from the Dye Trader.' });
defItem(I.DYE_BLUEACID, { name:'Blue Acid Dye', type:'dye', color:'#48a8ff', icon:'🧴', maxStack:99, desc:'A rare luminous dye from the Dye Trader.' });
defItem(I.DYE_REDACID, { name:'Red Acid Dye', type:'dye', color:'#ff5070', icon:'🧴', maxStack:99, desc:'A rare luminous dye from the Dye Trader.' });
defItem(I.DYE_GLOWINGMUSHROOM, { name:'Glowing Mushroom Dye', type:'dye', color:'#56d8ff', icon:'🧴', maxStack:99, desc:'A rare fungal dye from the Dye Trader.' });

// ---------- Pre-hardmode phase ----------
// Ores
defItem(I.COPPER, { name:'Copper Ore', type:'block', tile:T.COPPER, color:'#e0834d', icon:'block', desc:'A basic ore. Smelt into bars.' });
defItem(I.SILVER, { name:'Silver Ore', type:'block', tile:T.SILVER, color:'#cfd6e0', icon:'block', desc:'A precious ore. Smelt into bars.' });
defItem(I.GOLD, { name:'Gold Ore', type:'block', tile:T.GOLD, color:'#ffd75e', icon:'block', desc:'A precious ore. Smelt into bars.' });
defItem(I.DEMONITE, { name:'Demonite Ore', type:'block', tile:T.DEMONITE, color:'#5a4d9a', icon:'block', desc:'Corrupted ore of the underworld. Smelt into bars.' });
defItem(I.TIN, { name:'Tin Ore', type:'block', tile:T.TIN, color:'#c8b090', icon:'block', desc:'A copper cousin. Smelt into bars.' });
defItem(I.LEAD, { name:'Lead Ore', type:'block', tile:T.LEAD, color:'#8a8a96', icon:'block', desc:'A heavier iron. Smelt into bars.' });
defItem(I.TUNGSTEN, { name:'Tungsten Ore', type:'block', tile:T.TUNGSTEN, color:'#a0a8c0', icon:'block', desc:'A silvery-white ore. Smelt into bars.' });
defItem(I.PLATINUM, { name:'Platinum Ore', type:'block', tile:T.PLATINUM, color:'#d8f0ff', icon:'block', desc:'A rare gleaming ore. Smelt into bars.' });
defItem(I.METEORITE, { name:'Meteorite', type:'block', tile:T.METEORITE, color:'#8a4a3a', icon:'block', desc:'Fallen from the sky after an evil creature was slain. Smelt into bars.' });
defItem(I.DUNGEONBRICK, { name:'Dungeon Brick', type:'block', tile:T.DUNGEONBRICK, color:'#6a7ab0', icon:'block', desc:'Ancient masonry of the Dungeon.' });
defItem(I.SANDSTONE, { name:'Sandstone', type:'block', tile:T.SANDSTONE, color:'#c8a868', icon:'block', desc:'Aged desert rock.' });
defItem(I.GEL, { name:'Gel', type:'material', color:'#6bc8ff', icon:'💧', maxStack:999, desc:'Dropped by slimes. Used to make torches and boss summoners.' });
defItem(I.LENS, { name:'Lens', type:'material', color:'#d0e8f0', icon:'👁️', maxStack:99, desc:'Dropped by Demon Eyes at night. Used to summon an eye.' });
defItem(I.SHADOWSCALE, { name:'Shadow Scale', type:'material', color:'#6a5c9a', icon:'◆', maxStack:999, desc:'A scale torn from the Eater of Worlds.' });
defItem(I.TISSUESAMPLE, { name:'Tissue Sample', type:'material', color:'#d85868', icon:'🧬', maxStack:999, desc:'Living tissue from the Brain of Cthulhu.' });
// Bars
defItem(I.COPPERBAR, { name:'Copper Bar', type:'bar', color:'#e0834d', icon:'bar' });
defItem(I.SILVERBAR, { name:'Silver Bar', type:'bar', color:'#cfd6e0', icon:'bar' });
defItem(I.GOLDBAR, { name:'Gold Bar', type:'bar', color:'#ffd75e', icon:'bar' });
defItem(I.DEMONITEBAR, { name:'Demonite Bar', type:'bar', color:'#6a5cb8', icon:'bar', desc:'Smelted from demonite ore.' });
  defItem(I.CRIMTANEBAR, { name:'Crimtane Bar', type:'bar', color:'#c04048', icon:'bar', desc:'Smelted from crimtane ore.' });
  defItem(I.TINBAR, { name:'Tin Bar', type:'bar', color:'#c8b090', icon:'bar' });
  defItem(I.LEADBAR, { name:'Lead Bar', type:'bar', color:'#8a8a96', icon:'bar' });
  defItem(I.TUNGSTENBAR, { name:'Tungsten Bar', type:'bar', color:'#a0a8c0', icon:'bar' });
  defItem(I.PLATINUMBAR, { name:'Platinum Bar', type:'bar', color:'#d8f0ff', icon:'bar', desc:'A rarer cousin of gold.' });
  defItem(I.METEORITEBAR, { name:'Meteorite Bar', type:'bar', color:'#a06050', icon:'bar', desc:'Smelted from fallen meteorite.' });
// Tools
defItem(I.COPPERPICK, { name:'Copper Pickaxe', type:'tool', power:35, speed:0.7, dmg:4, range:3.0, color:'#e0834d', icon:'⛏️', maxStack:1, desc:'Mines stone and ore. Cannot cut trees.' });
defItem(I.COPPERAXE, { name:'Copper Axe', type:'tool', axe:7, speed:0.85, dmg:3, range:3.0, color:'#e0834d', icon:'🪓', maxStack:1, desc:'Chops down trees for wood.' });
defItem(I.SILVERPICK, { name:'Silver Pickaxe', type:'tool', power:45, speed:1.0, dmg:6, range:3.1, color:'#cfd6e0', icon:'⛏️', maxStack:1, desc:'Mines gold ore.' });
defItem(I.GOLDPICK, { name:'Gold Pickaxe', type:'tool', power:55, speed:1.3, dmg:6, range:3.2, color:'#ffd75e', icon:'⛏️', maxStack:1, desc:'Mines demonite ore.' });
defItem(I.DEMONITEPICK, { name:'Nightmare Pickaxe', type:'tool', power:65, speed:1.8, dmg:9, range:3.4, color:'#6a5cb8', icon:'⛏️', maxStack:1, desc:'Forged from Demonite and Shadow Scales.' });
defItem(I.DEATHBRINGERPICK, { name:'Deathbringer Pickaxe', type:'tool', power:70, speed:1.8, dmg:12, range:3.4, color:'#c04048', icon:'⛏️', maxStack:1, desc:'Forged from Crimtane and Tissue Samples.' });
// Melee
defItem(I.COPPERSWORD, { name:'Copper Broadsword', type:'melee', dmg:9, speed:0.35, kb:5.5, range:4, color:'#e0834d', icon:'🗡️', maxStack:1 });
defItem(I.COPPERSHORT, { name:'Copper Shortsword', type:'melee', dmg:5, speed:0.217, kb:4, range:2.5, shortSword:true, color:'#e0834d', icon:'🗡️', maxStack:1, desc:'A quick, narrow thrust. Every legend starts somewhere.' });
defItem(I.SILVERSWORD, { name:'Silver Sword', type:'melee', dmg:14, speed:0.333, kb:6, range:4, color:'#cfd6e0', icon:'🗡️', maxStack:1 });
defItem(I.GOLDSWORD, { name:'Gold Sword', type:'melee', dmg:15, speed:0.3, kb:6.5, range:4, color:'#ffd75e', icon:'🗡️', maxStack:1 });
defItem(I.DEMONITESWORD, { name:'Demonite Sword', type:'melee', dmg:16, speed:0.333, kb:5, range:4, color:'#6a5cb8', icon:'🗡️', maxStack:1, desc:'Forged from demonite. Bane of the corruption.' });
// Ranged
defItem(I.COPPERBOW, { name:'Copper Bow', type:'ranged', dmg:6, speed:0.483, kb:2, ammo:I.ARROW, proj:P.ARROW, range:999, color:'#e0834d', icon:'🏹', maxStack:1, projSpeed:6.6});
defItem(I.SILVERBOW, { name:'Silver Bow', type:'ranged', dmg:9, speed:0.45, kb:2, ammo:I.ARROW, proj:P.ARROW, range:999, color:'#cfd6e0', icon:'🏹', maxStack:1, projSpeed:6.6});
defItem(I.GOLDBOW, { name:'Gold Bow', type:'ranged', dmg:11, speed:0.433, kb:2.5, ammo:I.ARROW, proj:P.ARROW, range:999, color:'#ffd75e', icon:'🏹', maxStack:1, projSpeed:6.6});
// Armor - Copper
defItem(I.COPPERHELM, { name:'Copper Helmet', type:'armor', slot:'head', def:2, color:'#e0834d', icon:'🪖', maxStack:1, desc:'Defense +2' });
defItem(I.COPPERCHEST, { name:'Copper Chainmail', type:'armor', slot:'chest', def:3, color:'#e0834d', icon:'🥋', maxStack:1, desc:'Defense +3' });
defItem(I.COPPERLEGS, { name:'Copper Greaves', type:'armor', slot:'legs', def:2, color:'#e0834d', icon:'👖', maxStack:1, desc:'Defense +2' });
// Armor - Silver
defItem(I.SILVERHELM, { name:'Silver Helmet', type:'armor', slot:'head', def:3, color:'#cfd6e0', icon:'🪖', maxStack:1, desc:'Defense +3' });
defItem(I.SILVERCHEST, { name:'Silver Chainmail', type:'armor', slot:'chest', def:4, color:'#cfd6e0', icon:'🥋', maxStack:1, desc:'Defense +4' });
defItem(I.SILVERLEGS, { name:'Silver Greaves', type:'armor', slot:'legs', def:3, color:'#cfd6e0', icon:'👖', maxStack:1, desc:'Defense +3' });
// Armor - Gold
defItem(I.GOLDHELM, { name:'Gold Helmet', type:'armor', slot:'head', def:4, color:'#ffd75e', icon:'🪖', maxStack:1, desc:'Defense +4' });
defItem(I.GOLDCHEST, { name:'Gold Chainmail', type:'armor', slot:'chest', def:5, color:'#ffd75e', icon:'🥋', maxStack:1, desc:'Defense +5' });
defItem(I.GOLDLEGS, { name:'Gold Greaves', type:'armor', slot:'legs', def:4, color:'#ffd75e', icon:'👖', maxStack:1, desc:'Defense +4' });
// Armor - Demonite
defItem(I.DEMONITEHELM, { name:'Demonite Helmet', type:'armor', slot:'head', def:5, color:'#6a5cb8', icon:'🪖', maxStack:1, desc:'Defense +5' });
defItem(I.DEMONITECHEST, { name:'Demonite Breastplate', type:'armor', slot:'chest', def:7, color:'#6a5cb8', icon:'🥋', maxStack:1, desc:'Defense +7' });
defItem(I.DEMONITELEGS, { name:'Demonite Greaves', type:'armor', slot:'legs', def:5, color:'#6a5cb8', icon:'👖', maxStack:1, desc:'Defense +5' });
// Armor - Crimtane
defItem(I.CRIMTANEHELM, { name:'Crimtane Helmet', type:'armor', slot:'head', def:5, color:'#c04048', icon:'🪖', maxStack:1, desc:'Defense +5' });
defItem(I.CRIMTANECHEST, { name:'Crimtane Breastplate', type:'armor', slot:'chest', def:7, color:'#c04048', icon:'🥋', maxStack:1, desc:'Defense +7' });
defItem(I.CRIMTANELEGS, { name:'Crimtane Greaves', type:'armor', slot:'legs', def:5, color:'#c04048', icon:'👖', maxStack:1, desc:'Defense +5' });
// Boss summons
defItem(I.SLIMECROWN, { name:'Slime Crown', type:'summon', boss:'kingslime', color:'#5cbf6c', icon:'👑', maxStack:99, desc:'Summons King Slime.' });
defItem(I.SUSPICIOUSLEYE, { name:'Suspicious Looking Eye', type:'summon', boss:'eyeofcthulhu', color:'#d04040', icon:'👁️', maxStack:99, desc:'Summons the Eye of Cthulhu. Use at night.' });
defItem(I.WORMLOOD, { name:'Worm Food', type:'summon', boss:'eaterofworlds', color:'#5a4d7a', icon:'🪱', maxStack:99, desc:'Summons the Eater of Worlds in the corruption.' });
defItem(I.BLOODYSPINE, { name:'Bloody Spine', type:'summon', boss:'brainofcthulhu', color:'#c04848', icon:'🩸', maxStack:99, desc:'Summons the Brain of Cthulhu in the crimson.' });
defItem(I.ABEEMINATION, { name:'Abeemination', type:'summon', boss:'queenbee', color:'#ffd75e', icon:'🐝', maxStack:99, desc:'Summons the Queen Bee in the jungle.' });
defItem(I.CLOTHIERDOLL, { name:'Clothier Voodoo Doll', type:'summon', boss:'skeletron', color:'#b8b8c8', icon:'🧸', maxStack:99, desc:'Summons Skeletron.' });
  defItem(I.GUIDEVOODOODOLL, { name:'Guide Voodoo Doll', type:'summon', boss:'wallofflesh', color:'#d04040', icon:'🎭', maxStack:99, desc:'Sacrifice in the Underworld to summon the Wall of Flesh.' });

// Dungeon loot / meteorite gear
defItem(I.GOLDENKEY, { name:'Golden Key', type:'material', color:'#ffd75e', icon:'🗝️', maxStack:99, desc:'Opens the Dungeon chests.' });
defItem(I.MURAMASA, { name:'Muramasa', type:'melee', dmg:24, speed:0.3, kb:3, range:4, color:'#4dc8ff', icon:'⚔️', maxStack:1, desc:'A fast blue blade from the Dungeon.' });
defItem(I.AQUASCEPTER, { name:'Aqua Scepter', type:'magic', dmg:27, speed:0.267, kb:7, mana:7, proj:P.WATERSTREAM, projPersistent:true, hitCooldown:0.25, auto:true, range:999, color:'#4dc8ff', icon:'🔮', maxStack:1, desc:'A torrent of water. Costs mana.', projSpeed:12.5});
defItem(I.PHAROAHMASK, { name:'Pharaoh\'s Mask', type:'armor', slot:'head', def:2, color:'#e8c83d', icon:'🪖', maxStack:1, desc:'Buried treasure. Defense +2' });
defItem(I.METEORHELM, { name:'Meteor Helmet', type:'armor', slot:'head', def:4, color:'#8a4a3a', icon:'🪖', maxStack:1, desc:'Set bonus: the Space Gun costs no mana.' });
defItem(I.METEORCHEST, { name:'Meteor Breastplate', type:'armor', slot:'chest', def:6, color:'#8a4a3a', icon:'🥋', maxStack:1, desc:'Defense +6' });
defItem(I.METEORLEGS, { name:'Meteor Leggings', type:'armor', slot:'legs', def:4, color:'#8a4a3a', icon:'👖', maxStack:1, desc:'Defense +4' });
defItem(I.SPACEGUN, { name:'Space Gun', type:'magic', dmg:20, speed:0.283, kb:0.75, mana:6, proj:P.LASER, auto:true, range:999, color:'#3d6ad0', icon:'🔫', maxStack:1, desc:'A rapid energy pistol.', projSpeed:10});
defItem(I.TINPICK, { name:'Tin Pickaxe', type:'tool', power:35, speed:0.7, dmg:5, range:3.0, color:'#c8b090', icon:'⛏️', maxStack:1, desc:'Mines silver ore.' });
defItem(I.LEADPICK, { name:'Lead Pickaxe', type:'tool', power:43, speed:0.9, dmg:6, range:3.1, color:'#8a8a96', icon:'⛏️', maxStack:1, desc:'Mines gold ore.' });
defItem(I.TUNGSTENPICK, { name:'Tungsten Pickaxe', type:'tool', power:50, speed:1.0, dmg:6, range:3.2, color:'#a0a8c0', icon:'⛏️', maxStack:1, desc:'Mines gold ore.' });
defItem(I.PLATINUMPICK, { name:'Platinum Pickaxe', type:'tool', power:59, speed:1.1, dmg:7, range:3.3, color:'#d8f0ff', icon:'⛏️', maxStack:1, desc:'Mines demonite and dungeon brick.' });
defItem(I.METEORITEPICK, { name:'Meteorite Pickaxe', type:'tool', power:65, speed:1.2, dmg:8, range:3.3, color:'#a06050', icon:'⛏️', maxStack:1, desc:'A pick from the stars.' });
defItem(I.TINSWORD, { name:'Tin Sword', type:'melee', dmg:10, speed:0.333, kb:5.5, range:4, color:'#c8b090', icon:'🗡️', maxStack:1 });
defItem(I.LEANSWORD, { name:'Lead Sword', type:'melee', dmg:13, speed:0.333, kb:5.5, range:4, color:'#8a8a96', icon:'🗡️', maxStack:1 });
defItem(I.TUNGSTENSWORD, { name:'Tungsten Sword', type:'melee', dmg:14, speed:0.317, kb:6, range:4, color:'#a0a8c0', icon:'🗡️', maxStack:1 });
defItem(I.PLATINUMSWORD, { name:'Platinum Sword', type:'melee', dmg:16, speed:0.283, kb:6.5, range:4, color:'#d8f0ff', icon:'🗡️', maxStack:1 });
defItem(I.TINHELM, { name:'Tin Helmet', type:'armor', slot:'head', def:2, color:'#c8b090', icon:'🪖', maxStack:1, desc:'Defense +2' });
defItem(I.TINCHEST, { name:'Tin Chainmail', type:'armor', slot:'chest', def:3, color:'#c8b090', icon:'🥋', maxStack:1, desc:'Defense +3' });
defItem(I.TINLEGS, { name:'Tin Greaves', type:'armor', slot:'legs', def:2, color:'#c8b090', icon:'👖', maxStack:1, desc:'Defense +2' });
defItem(I.LEADHELM, { name:'Lead Helmet', type:'armor', slot:'head', def:3, color:'#8a8a96', icon:'🪖', maxStack:1, desc:'Defense +3' });
defItem(I.LEADCHEST, { name:'Lead Chainmail', type:'armor', slot:'chest', def:4, color:'#8a8a96', icon:'🥋', maxStack:1, desc:'Defense +4' });
defItem(I.LEADLEGS, { name:'Lead Greaves', type:'armor', slot:'legs', def:3, color:'#8a8a96', icon:'👖', maxStack:1, desc:'Defense +3' });
defItem(I.TUNGSTENHELM, { name:'Tungsten Helmet', type:'armor', slot:'head', def:3, color:'#a0a8c0', icon:'🪖', maxStack:1, desc:'Defense +3' });
defItem(I.TUNGSTENCHEST, { name:'Tungsten Chainmail', type:'armor', slot:'chest', def:5, color:'#a0a8c0', icon:'🥋', maxStack:1, desc:'Defense +5' });
defItem(I.TUNGSTENLEGS, { name:'Tungsten Greaves', type:'armor', slot:'legs', def:3, color:'#a0a8c0', icon:'👖', maxStack:1, desc:'Defense +3' });
defItem(I.PLATINUMHELM, { name:'Platinum Helmet', type:'armor', slot:'head', def:4, color:'#d8f0ff', icon:'🪖', maxStack:1, desc:'Defense +4' });
defItem(I.PLATINUMCHEST, { name:'Platinum Chainmail', type:'armor', slot:'chest', def:6, color:'#d8f0ff', icon:'🥋', maxStack:1, desc:'Defense +6' });
defItem(I.PLATINUMLEGS, { name:'Platinum Greaves', type:'armor', slot:'legs', def:4, color:'#d8f0ff', icon:'👖', maxStack:1, desc:'Defense +4' });

// Underworld progression
defItem(I.HELLFORGE, { name:'Hellforge', type:'block', tile:T.HELLFORGE, color:'#8a4030', icon:'block', maxStack:99, desc:'An infernal forge used to smelt Hellstone.' });
defItem(I.HELLSTONEBAR, { name:'Hellstone Bar', type:'bar', color:'#ff6a32', icon:'bar', desc:'Hellstone and obsidian fused in a Hellforge.' });
defItem(I.SHADOWKEY, { name:'Shadow Key', type:'material', color:'#8a68c0', icon:'🔑', maxStack:1, desc:'A reusable key that opens Shadow Chests.' });
// def restored for the Worm Food recipe mat (matsHTML derefs ITEMS[mat.id]); the
// chunk itself remains a cut candidate for Phase 2 unless a drop gets wired.
defItem(I.ROTTEN_CHUNK, { name:'Rotten Chunk', type:'material', color:'#b8b8a0', icon:'\u25C6', maxStack:999, desc:'A crafting material.' });
defItem(I.MOLTENPICK, { name:'Molten Pickaxe', type:'tool', power:100, speed:2.0, dmg:12, range:3.5, color:'#ff6a32', icon:'⛏️', maxStack:1, desc:'Forged from Hellstone. Mines Cobalt ore.' });
defItem(I.VOLCANO, { name:'Volcano', type:'melee', dmg:40, speed:0.667, kb:6.5, range:4, color:'#ff5a2a', icon:'⚔️', maxStack:1, desc:'A blazing greatsword forged from Hellstone.' });
defItem(I.MOLTENHELM, { name:'Molten Helmet', type:'armor', slot:'head', def:8, color:'#e85828', icon:'🪖', maxStack:1, desc:'Defense +8' });
defItem(I.MOLTENCHEST, { name:'Molten Breastplate', type:'armor', slot:'chest', def:9, color:'#e85828', icon:'🥋', maxStack:1, desc:'Defense +9' });
defItem(I.MOLTENLEGS, { name:'Molten Greaves', type:'armor', slot:'legs', def:8, color:'#e85828', icon:'👖', maxStack:1, desc:'Defense +8' });
defItem(I.SUNFURY, { name:'Sunfury', type:'melee', dmg:64, speed:0.75, kb:6.75, range:8, meleeProj:P.RAZOR, meleeMode:'flail', flailDuration:0.85, projectileOnly:true, persistentProj:true, color:'#ff9a3d', icon:'☀️', maxStack:1, desc:'A blazing mace from a Shadow Chest.' });
defItem(I.FLAMELASH, { name:'Flamelash', type:'magic', dmg:32, speed:0.5, kb:6.5, mana:21, proj:P.FIREBALL, magicMode:'controlled', controlledReach:24, controlledSpeed:8, controlledDuration:3.5, range:999, color:'#ff6a32', icon:'🔥', maxStack:1, desc:'Casts a fireball guided by the cursor.', projSpeed:6});
defItem(I.HELLWINGBOW, { name:'Hellwing Bow', type:'ranged', dmg:22, speed:0.217, kb:5.5, ammo:I.ARROW, proj:P.ARROW, range:999, color:'#8a4030', icon:'🏹', maxStack:1, batAmmo:true, desc:'Turns arrows into burning bats.', projSpeed:6});
defItem(I.DARKLANCE, { name:'Dark Lance', type:'melee', dmg:34, speed:0.367, kb:5, range:4.5, meleeProj:P.STINGER, meleeMode:'spear', spearDuration:0.38, projectileOnly:true, persistentProj:true, color:'#7a5a9a', icon:'🔱', maxStack:1, desc:'A long spear from a Shadow Chest.' });
defItem(I.MUSKET, { name:'Musket', type:'ranged', dmg:31, speed:0.533, kb:5.25, ammo:I.MUSKETBALL, proj:P.GUNBULLET, range:999, color:'#6a5a4a', icon:'🔫', maxStack:1, desc:'A heavy firearm found in a Shadow Orb.', projSpeed:9});
defItem(I.VILETHORN, { name:'Vilethorn', type:'magic', dmg:10, speed:0.467, kb:1, mana:10, proj:P.THORN, projPersistent:true, hitCooldown:0.2, range:999, color:'#8f70d8', icon:'🌿', maxStack:1, desc:'Conjures a corrupt thorn.', projSpeed:32});
defItem(I.BALLOHURT, { name:'Ball O\' Hurt', type:'melee', dmg:30, speed:0.75, kb:5.5, range:7, meleeProj:P.RAZOR, meleeMode:'flail', flailDuration:0.9, projectileOnly:true, persistentProj:true, color:'#6a507f', icon:'⚫', maxStack:1, desc:'A cruel flail from a Shadow Orb.' });
defItem(I.BANDOFSTARPOWER, { name:'Band of Starpower', type:'accessory', manaMul:0.9, color:'#8f70d8', icon:'💍', maxStack:1, desc:'Reduces mana costs by 10%.' });
defItem(I.UNDERTAKER, { name:'The Undertaker', type:'ranged', dmg:19, speed:0.333, kb:2, ammo:I.MUSKETBALL, proj:P.GUNBULLET, range:999, color:'#b04048', icon:'🔫', maxStack:1, desc:'A living firearm found in a Crimson Heart.', projSpeed:6});
defItem(I.CRIMSONROD, { name:'Crimson Rod', type:'magic', dmg:12, speed:0.4, kb:2, mana:30, proj:P.CURSEDFLAME, magicMode:'cloud', deployDuration:6, deployInterval:0.45, deployProj:P.CURSEDFLAME, deployCount:1, deployDamageMul:0.75, range:999, color:'#e84858', icon:'🌧️', maxStack:1, desc:'Places a crimson cloud that rains damaging blood.', projSpeed:12});
defItem(I.ROTTENFORK, { name:'The Rotted Fork', type:'melee', dmg:17, speed:0.517, kb:5, range:4.5, meleeProj:P.STINGER, meleeMode:'spear', spearDuration:0.4, projectileOnly:true, persistentProj:true, color:'#b04048', icon:'🔱', maxStack:1, desc:'A vicious spear from a Crimson Heart.' });
defItem(I.PANICNECKLACE, { name:'Panic Necklace', type:'accessory', runSpeed:1.12, color:'#e84858', icon:'📿', maxStack:1, desc:'Increases movement speed.' });
defItem(I.WATERBOLT, { name:'Water Bolt', type:'magic', dmg:19, speed:0.283, kb:5, mana:10, proj:P.WATERBOLT, projBounces:5, projLife:3, range:999, color:'#4d8ad0', icon:'📖', maxStack:1, desc:'A bouncing water spell from the Dungeon bookshelves.', projSpeed:4.5});
defItem(I.DEMONSCYTHE, { name:'Demon Scythe', type:'magic', dmg:35, speed:0.333, kb:5, mana:14, proj:P.DEMONSCYTHE, projSpeed:0.2, projAccel:1.04, projMaxSpeed:11, projLife:2.6, projPersistent:true, hitCooldown:0.25, range:999, color:'#a040c8', icon:'🌀', maxStack:1, desc:'Fires a spinning scythe that accelerates as it flies. Demons carry them.' });
defItem(I.BEEGUN, { name:'Bee Gun', type:'magic', dmg:9, speed:0.2, kb:0.25, mana:5, proj:P.STINGER, projHoming:true, range:999, color:'#ffc040', icon:'🐝', maxStack:1, desc:'Fires homing bees. Queen Bee\'s prize.', projSpeed:8});
defItem(I.STARCANNON, { name:'Star Cannon', type:'ranged', dmg:55, speed:0.2, kb:3, ammo:I.FALLENSTAR, proj:P.STAR, projSpeed:14, range:999, color:'#ffe88a', icon:'🌟', maxStack:1, desc:'Fires Fallen Stars at devastating speed.' });
defItem(I.CANDYCANESWORD, { name:'Candy Cane Sword', type:'melee', dmg:19, speed:0.45, kb:5.3, range:4, meleeProj:P.CANDY, projDamageMul:0.8, projSpeed:8, projLife:1.4, color:'#ff6a8a', icon:'🍬', maxStack:1, desc:'A sweet blade that throws candy cane projectiles. Sold by Santa.' });
defItem(I.CANDYCANE_BOW, { name:'Candy Cane Bow', type:'ranged', dmg:14, speed:0.3, kb:2, ammo:I.ARROW, proj:P.ARROW, range:999, color:'#ff6a8a', icon:'🏹', maxStack:1, desc:'A festive bow striped like a candy cane. Sold by Santa.' });
defItem(I.METALDETECTOR, { name:'Metal Detector', type:'accessory', color:'#c8a84a', icon:'📟', maxStack:1, desc:'Shows the nearest valuable tile while equipped.' });
defItem(I.BUTTERFLYWINGS, { name:'Butterfly Wings', type:'accessory', jumpMul:1.05, jumps:3, noFall:true, color:'#d0b060', icon:'🦋', maxStack:1, desc:'Delicate wings dropped by jungle moths.' });
defItem(I.UMBRELLA, { name:'Umbrella', type:'melee', dmg:10, speed:0.367, kb:5, range:4, slowFall:2, color:'#5b82b8', icon:'☂️', maxStack:1, desc:'Hold it to drift safely downward. Dropped by Umbrella Slimes.' });
defItem(I.BOSSBAG, { name:'Treasure Bag', type:'bag', color:'#c8a84a', icon:'🎁', maxStack:1, desc:'Right-click to open and release boss loot. Drops in Expert and Master mode.' });

function setAmmoGroup(group, ids) {
  for (var i = 0; i < ids.length; i++) ITEMS[ids[i]].ammoGroup = group;
}
setAmmoGroup('arrow', [I.ARROW, I.UNHOLYARROW, I.JESTERSARROW, I.HOLYARROW, I.FROSTBURNARROW, I.HELLFIREARROW, I.BONEARROW]);
setAmmoGroup('bullet', [I.BULLET, I.MUSKETBALL, I.SILVERBULLET, I.EXPLOSIVEBULLET, I.CHLOROPHYTEBULLET, I.CURSEDBULLET, I.ICHORBULLET, I.VENOMBULLET]);
setAmmoGroup('dart', [I.DART, I.CRYSTALDART, I.CURSEDDART, I.ICHORDART, I.VENOMDART]);
setAmmoGroup('rocket', [I.ROCKET1, I.ROCKET2, I.ROCKET3, I.ROCKET4, I.GRENADE]);

function ammoCompatible(required, candidate) {
  var req = ITEMS[required], ammo = ITEMS[candidate];
  if (!req || !ammo) return false;
  if (req.ammoGroup) return ammo.type === 'ammo' && req.ammoGroup === ammo.ammoGroup;
  return required === candidate;
}


// ---------- Coin economy ----------
var COIN_IDS = [I.PLATINUMCOIN, I.GOLDCOIN, I.SILVERCOIN, I.COIN];
var COIN_VALUES = {};
COIN_VALUES[I.PLATINUMCOIN] = 1000000;
COIN_VALUES[I.GOLDCOIN] = 10000;
COIN_VALUES[I.SILVERCOIN] = 100;
COIN_VALUES[I.COIN] = 1;

function itemValue(id) {
  var d = ITEMS[id];
  if (!d) return 0;
  if (COIN_VALUES[id]) return COIN_VALUES[id];
  var v = ITEM_VALUES[d.name.toLowerCase()];
  return typeof v === 'number' ? v : 0;
}

function copperToCoins(c) {
  c = Math.max(0, Math.floor(c));
  var out = [];
  var denoms = [[I.PLATINUMCOIN, 1000000], [I.GOLDCOIN, 10000], [I.SILVERCOIN, 100], [I.COIN, 1]];
  for (var i = 0; i < denoms.length; i++) {
    var n = Math.floor(c / denoms[i][1]);
    if (n > 0) { out.push({ id: denoms[i][0], count: n }); c -= n * denoms[i][1]; }
  }
  return out;
}

function fmtCoins(c) {
  c = Math.max(0, Math.floor(c));
  var parts = [];
  var denoms = [['p', 1000000], ['g', 10000], ['s', 100], ['c', 1]];
  for (var i = 0; i < denoms.length; i++) {
    var n = Math.floor(c / denoms[i][1]);
    if (n > 0) { parts.push(n + denoms[i][0]); c -= n * denoms[i][1]; }
  }
  return parts.length ? parts.join(' ') : '0c';
}

Inventory.prototype.coinValue = function() {
  var total = 0;
  for (var i = 0; i < this.slots.length; i++) {
    var s = this.slots[i];
    if (s && COIN_VALUES[s.id]) total += COIN_VALUES[s.id] * s.count;
  }
  return total;
};

Inventory.prototype.spendCoins = function(price) {
  if (this.coinValue() < price) return false;
  var remaining = price;
  var order = [I.PLATINUMCOIN, I.GOLDCOIN, I.SILVERCOIN, I.COIN];
  for (var i = 0; i < order.length && remaining > 0; i++) {
    var id = order[i];
    var have = this.countOf(id);
    if (!have) continue;
    var take = Math.min(have, Math.ceil(remaining / COIN_VALUES[id]));
    this.consume(id, take);
    remaining -= take * COIN_VALUES[id];
  }
  if (remaining < 0) {
    var back = copperToCoins(-remaining);
    for (var b = 0; b < back.length; b++) this.add(back[b].id, back[b].count);
  }
  return true;
};

Inventory.prototype.grantCoins = function(copper) {
  var coins = copperToCoins(copper);
  var ok = true;
  for (var i = 0; i < coins.length; i++) {
    if (!this.canAdd(coins[i].id, coins[i].count)) ok = false;
    else this.add(coins[i].id, coins[i].count);
  }
  return ok;
};

// Reverse mapping: tile -> item id (for picking up placed items)
var TILE_ITEM = {};
for (var k in ITEMS) {
  var it = ITEMS[k];
  if (it.tile !== undefined) TILE_ITEM[it.tile] = it.id;
}

// ---------- Inventory ----------
function Inventory() {
  this.slots = new Array(50);
  this.selected = 0;
  this.armor = { head:null, chest:null, legs:null };
  this.accessories = [null, null, null, null, null, null];
  this.dyes = [null, null, null, null, null, null];
  this.ammo = null;
  this.potionCd = 0;
}

function copyItemStack(stack, count) {
  var copy = { id:stack.id, count:count === undefined ? stack.count : count };
  if (stack.reforge) copy.reforge = { name:stack.reforge.name, dmgMul:stack.reforge.dmgMul };
  return copy;
}

Inventory.prototype.hotSlot = function(i) { return this.slots[i]; };

Inventory.prototype.add = function(id, count, extra) {
  if (!id) return 0;
  var d = ITEMS[id] || {}; // null-guard: pruned/foreign ids must not crash loot & grant paths
  count = count || 1;
  var max = d.maxStack || 999;
  var remaining = count;
  for (var i = 0; i < this.slots.length && remaining > 0; i++) {
    var s = this.slots[i];
    if (s && s.id === id && s.count < max) {
      var take = Math.min(max - s.count, remaining);
      s.count += take; remaining -= take;
    }
  }
  for (var j = 0; j < this.slots.length && remaining > 0; j++) {
    if (!this.slots[j]) {
      var take2 = Math.min(max, remaining);
      var ns = { id:id, count:take2 };
      if (extra) {
        if (extra.bagBoss) ns.bagBoss = extra.bagBoss;
        if (extra.bagDrops) ns.bagDrops = extra.bagDrops;
      }
      this.slots[j] = ns;
      remaining -= take2;
    }
  }
  return count - remaining;
};

Inventory.prototype.canAdd = function(id, count) {
  if (!id || !ITEMS[id]) return false;
  var room = 0, max = ITEMS[id].maxStack;
  for (var i = 0; i < this.slots.length; i++) {
    var s = this.slots[i];
    if (!s) room += max;
    else if (s.id === id && !s.reforge) room += max - s.count;
    if (room >= count) return true;
  }
  return room >= count;
};

Inventory.prototype.addStack = function(stack) {
  if (!stack || !stack.id || stack.count <= 0) return 0;
  if (!stack.reforge) return this.add(stack.id, stack.count, stack);
  if (stack.count !== 1 || ITEMS[stack.id].maxStack !== 1) return 0;
  for (var i = 0; i < this.slots.length; i++) {
    if (!this.slots[i]) {
      this.slots[i] = copyItemStack(stack);
      return 1;
    }
  }
  return 0;
};

Inventory.prototype.itemDamageMul = function(stack) {
  return stack && stack.reforge ? stack.reforge.dmgMul : 1;
};

Inventory.prototype.countOf = function(id) {
  var n = 0;
  for (var i = 0; i < this.slots.length; i++) {
    if (this.slots[i] && this.slots[i].id === id) n += this.slots[i].count;
  }
  return n;
};

Inventory.prototype.ammoFor = function(required) {
  if (this.ammo && this.countOf(this.ammo) > 0 && ammoCompatible(required, this.ammo)) return this.ammo;
  if (this.countOf(required) > 0) return required;
  for (var i = 0; i < this.slots.length; i++) {
    var s = this.slots[i];
    if (s && s.count > 0 && ammoCompatible(required, s.id)) return s.id;
  }
  return null;
};

Inventory.prototype.consume = function(id, count) {
  count = count || 1;
  for (var i = 0; i < this.slots.length && count > 0; i++) {
    var s = this.slots[i];
    if (s && s.id === id) {
      var take = Math.min(s.count, count);
      s.count -= take; count -= take;
      if (s.count <= 0) this.slots[i] = null;
    }
  }
};

Inventory.prototype.removeAt = function(i, count) {
  var s = this.slots[i];
  if (!s) return;
  count = count || 1;
  s.count -= count;
  if (s.count <= 0) this.slots[i] = null;
};

Inventory.prototype.selectedItem = function() { return this.slots[this.selected]; };

// Armor set bonuses: all three pieces of a material set grant an extra defense
// bonus (approximates the vanilla generic-defense sets; sets whose vanilla
// bonus is a class effect get a comparable defense value instead, except the
// Meteor set which implements its real "Space Gun costs no mana" bonus).
var ARMOR_SET_DEF = [
  ['COPPER', 2], ['TIN', 2], ['SILVER', 3], ['TUNGSTEN', 3], ['GOLD', 3], ['PLATINUM', 3],
  ['DEMONITE', 3], ['CRIMTANE', 3], ['MOLTEN', 7],
  ['COBALT', 3], ['PALLADIUM', 3], ['MYTHRIL', 4], ['ORICHALCUM', 4],
  ['ADAMANTITE', 5], ['TITANIUM', 5], ['HALLOWED', 6], ['CHLOROPHYTE', 8],
  ['SPECTRE', 6], ['BEETLE', 10], ['FROST', 5], ['SHROOMITE', 6], ['SPOOKY', 6],
  ['SOLAR', 8], ['NEBULA', 8], ['VORTEX', 8], ['STARDUST', 8]
];
ARMOR_SET_DEF = ARMOR_SET_DEF.map(function(e) {
  return { set: [I[e[0] + 'HELM'], I[e[0] + 'CHEST'], I[e[0] + 'LEGS']], def: e[1] };
}).filter(function(e) { return typeof e.set[0] !== 'undefined' && typeof e.set[1] !== 'undefined' && typeof e.set[2] !== 'undefined'; });

Inventory.prototype.armorSetBonus = function() {
  var head = this.armor.head, chest = this.armor.chest, legs = this.armor.legs;
  if (!head || !chest || !legs) return 0;
  for (var i = 0; i < ARMOR_SET_DEF.length; i++) {
    var s = ARMOR_SET_DEF[i].set;
    if (head === s[0] && chest === s[1] && legs === s[2]) return ARMOR_SET_DEF[i].def;
  }
  return 0;
};

Inventory.prototype.setBonusActive = function(mat) {
  var helm = I[mat + 'HELM'], chest = I[mat + 'CHEST'], legs = I[mat + 'LEGS'];
  if (typeof helm === 'undefined' || typeof chest === 'undefined' || typeof legs === 'undefined') return false;
  return this.armor.head === helm && this.armor.chest === chest && this.armor.legs === legs;
};

Inventory.prototype.defense = function() {
  var d = 0;
  for (var s in this.armor) {
    var id = this.armor[s];
    if (id && ITEMS[id]) d += ITEMS[id].def || 0;
  }
  d += this.armorSetBonus();
  for (var i = 0; i < this.accessories.length; i++) {
    var aid = this.accessories[i];
    if (aid && ITEMS[aid]) d += ITEMS[aid].def || 0;
  }
  return d;
};

// Aggregate accessory effects.
Inventory.prototype.accEffects = function() {
  var eff = { runSpeed: 1, dmgMul: 1, meleeDmgMul: 1, rangedDmgMul: 1, magicDmgMul: 1, summonDmgMul: 1, manaMul: 1, regen: 0, invuln: 0, minion: 0, jumps: 0, noFall: false, jumpBonus: 0, fallSafe: 0, fly: false, flyTime: 0, fishingPower: 0, baitSave: 0 };
  for (var i = 0; i < this.accessories.length; i++) {
    var id = this.accessories[i];
    if (!id || !ITEMS[id]) continue;
    var it = ITEMS[id];
    if (it.runSpeed) eff.runSpeed *= it.runSpeed;
    if (it.dmgMul) eff.dmgMul *= it.dmgMul;
    if (it.meleeDmgMul) eff.meleeDmgMul *= it.meleeDmgMul;
    if (it.rangedDmgMul) eff.rangedDmgMul *= it.rangedDmgMul;
    if (it.magicDmgMul) eff.magicDmgMul *= it.magicDmgMul;
    if (it.summonDmgMul) eff.summonDmgMul *= it.summonDmgMul;
    if (it.manaMul) eff.manaMul *= it.manaMul;
    if (it.regen) eff.regen += it.regen;
    if (it.invuln) eff.invuln += it.invuln;
    if (it.minion) eff.minion += it.minion;
    if (it.jumps) eff.jumps += it.jumps;
    if (it.noFall) eff.noFall = true;
    if (it.fallSafe) eff.fallSafe += it.fallSafe;
    if (it.fishingPower) eff.fishingPower += it.fishingPower;
    if (it.baitSave) eff.baitSave += it.baitSave;
    if (it.jumpMul) {
      if (it.jumpMul >= 0.8) {
        // Wing tier: grants timed flight and a mid-air jump rather than raw jump height.
        eff.fly = true;
        eff.flyTime = Math.max(eff.flyTime, 0.8 + it.jumpMul);
        if (!it.jumps) eff.jumps += 1;
      } else {
        // Boot tier (Frog Leg, Terraspark): additive jump-height bonus.
        eff.jumpBonus += it.jumpMul;
      }
    }
  }
  return eff;
};

Inventory.prototype.damageMultiplier = function(type) {
  var eff = this.accEffects();
  if (type === 'melee') return eff.dmgMul * eff.meleeDmgMul;
  if (type === 'ranged') return eff.dmgMul * eff.rangedDmgMul;
  if (type === 'magic') return eff.dmgMul * eff.magicDmgMul;
  if (type === 'summon') return eff.dmgMul * eff.summonDmgMul;
  return eff.dmgMul;
};

Inventory.prototype.getDropItemAt = function(i) {
  var s = this.slots[i];
  if (!s) return null;
  var id = s.id;
  this.removeAt(i, 1);
  return id;
};

Inventory.prototype.autoStack = function() {
  // merge stacks
  for (var i = 0; i < this.slots.length; i++) {
    var s = this.slots[i];
    if (!s) continue;
    var max = ITEMS[s.id].maxStack;
    for (var j = i + 1; j < this.slots.length; j++) {
      var t = this.slots[j];
      if (t && t.id === s.id && t.count < max && s.count < max) {
        var take = Math.min(max - s.count, t.count);
        s.count += take; t.count -= take;
        if (t.count <= 0) this.slots[j] = null;
        if (s.count >= max) break;
      }
    }
  }
};

// Swap two slots (used for clicking to move items)
Inventory.prototype.swap = function(a, b) {
  var tmp = this.slots[a]; this.slots[a] = this.slots[b]; this.slots[b] = tmp;
};

// ---------- Batch 83 catalog expansion (canonical stats from wiki item DB) ----------
defItem(I.ASH_WOOD_SWORD, { name:'Ash Wood Sword', type:'melee', dmg:13, speed:0.283, kb:5, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.BAT_BAT, { name:'Bat Bat', type:'melee', dmg:36, speed:0.667, kb:5.5, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.BEE_KEEPER, { name:'Bee Keeper', type:'melee', dmg:30, speed:0.333, kb:5.3, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.BLADE_OF_GRASS, { name:'Blade of Grass', type:'melee', dmg:18, speed:0.333, kb:4.5, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.BLADED_GLOVE, { name:'Bladed Glove', type:'melee', dmg:14, speed:0.133, kb:4, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.BLADETONGUE, { name:'Bladetongue', type:'melee', dmg:55, speed:0.467, kb:5.75, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.BLOOD_BUTCHERER, { name:'Blood Butcherer', type:'melee', dmg:22, speed:0.417, kb:5, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.BONE_SWORD, { name:'Bone Sword', type:'melee', dmg:19, speed:0.367, kb:5.5, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.BOREAL_WOOD_SWORD, { name:'Boreal Wood Sword', type:'melee', dmg:8, speed:0.333, kb:6, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.BRAND_OF_THE_INFERNO, { name:'Brand of the Inferno', type:'melee', dmg:95, speed:0.333, kb:6.5, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.BREAKER_BLADE, { name:'Breaker Blade', type:'melee', dmg:70, speed:0.583, kb:8, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.BREATHING_REED, { name:'Breathing Reed', type:'melee', dmg:10, speed:0.45, kb:4, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.CACTUS_SWORD, { name:'Cactus Sword', type:'melee', dmg:10, speed:0.5, kb:4.5, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.CHRISTMAS_TREE_SWORD, { name:'Christmas Tree Sword', type:'melee', dmg:86, speed:0.383, kb:7, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.CLASSY_CANE, { name:'Classy Cane', type:'melee', dmg:40, speed:0.25, kb:3.5, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.EBONWOOD_SWORD, { name:'Ebonwood Sword', type:'melee', dmg:11, speed:0.317, kb:6, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.ENCHANTED_SWORD, { name:'Enchanted Sword', type:'melee', dmg:23, speed:0.35, kb:4.25, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.EXOTIC_SCIMITAR, { name:'Exotic Scimitar', type:'melee', dmg:20, speed:0.3, kb:4.25, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.FALCON_BLADE, { name:'Falcon Blade', type:'melee', dmg:25, speed:0.333, kb:6, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.FLYING_DRAGON, { name:'Flying Dragon', type:'melee', dmg:180, speed:0.333, kb:5.5, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.FLYMEAL, { name:'Flymeal', type:'melee', dmg:15, speed:0.283, kb:5, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.GOLD_BROADSWORD, { name:'Gold Broadsword', type:'melee', dmg:15, speed:0.3, kb:6.5, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.HAM_BAT, { name:'Ham Bat', type:'melee', dmg:57, speed:0.333, kb:6.5, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.ICE_BLADE, { name:'Ice Blade', type:'melee', dmg:17, speed:0.333, kb:4.75, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.ICE_SICKLE, { name:'Ice Sickle', type:'melee', dmg:50, speed:0.417, kb:5.5, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.IRON_BROADSWORD, { name:'Iron Broadsword', type:'melee', dmg:12, speed:0.333, kb:5.5, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.KATANA, { name:'Katana', type:'melee', dmg:18, speed:0.333, kb:3.5, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.LEAD_BROADSWORD, { name:'Lead Broadsword', type:'melee', dmg:13, speed:0.333, kb:5.5, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.LIGHTS_BANE, { name:'Light\'s Bane', type:'melee', dmg:16, speed:0.333, kb:5, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.MANDIBLE_BLADE, { name:'Mandible Blade', type:'melee', dmg:16, speed:0.25, kb:4.5, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.MEOWMERE, { name:'Meowmere', type:'melee', dmg:200, speed:0.233, kb:6.5, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.ORANGE_PHASEBLADE, { name:'Orange Phaseblade', type:'melee', dmg:26, speed:0.3, kb:3, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.PALLADIUM_SWORD, { name:'Palladium Sword', type:'melee', dmg:49, speed:0.367, kb:5.5, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.PALM_WOOD_SWORD, { name:'Palm Wood Sword', type:'melee', dmg:8, speed:0.317, kb:6, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.PEARLWOOD_SWORD, { name:'Pearlwood Sword', type:'melee', dmg:30, speed:0.25, kb:7, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.PINK_PHASEBLADE, { name:'Pink Phaseblade', type:'melee', dmg:26, speed:0.3, kb:3, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.PLATINUM_BROADSWORD, { name:'Platinum Broadsword', type:'melee', dmg:16, speed:0.283, kb:6.5, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.PURPLE_CLUBBERFISH, { name:'Purple Clubberfish', type:'melee', dmg:35, speed:0.583, kb:8, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.RAINBOW_PHASEBLADE, { name:'Rainbow Phaseblade', type:'melee', dmg:26, speed:0.3, kb:3, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.RED_PHASEBLADE, { name:'Red Phaseblade', type:'melee', dmg:26, speed:0.3, kb:3, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.RICH_MAHOGANY_SWORD, { name:'Rich Mahogany Sword', type:'melee', dmg:8, speed:0.317, kb:6, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.SHADEWOOD_SWORD, { name:'Shadewood Sword', type:'melee', dmg:11, speed:0.317, kb:6, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.SHIELD_OF_CTHULHU, { name:'Shield of Cthulhu', type:'melee', dmg:30, speed:0.5, kb:9, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.SICKLE, { name:'Sickle', type:'melee', dmg:9, speed:0.4, kb:2.25, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.SILVER_BROADSWORD, { name:'Silver Broadsword', type:'melee', dmg:14, speed:0.333, kb:6, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.SLAP_HAND, { name:'Slap Hand', type:'melee', dmg:55, speed:0.333, kb:20, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.STAR_WRATH, { name:'Star Wrath', type:'melee', dmg:170, speed:0.267, kb:6.5, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.STYLISH_SCISSORS, { name:'Stylish Scissors', type:'melee', dmg:14, speed:0.217, kb:5, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.TIN_BROADSWORD, { name:'Tin Broadsword', type:'melee', dmg:10, speed:0.333, kb:5.5, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.TRAGIC_UMBRELLA, { name:'Tragic Umbrella', type:'melee', dmg:15, speed:0.367, kb:5, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.TUNGSTEN_BROADSWORD, { name:'Tungsten Broadsword', type:'melee', dmg:14, speed:0.317, kb:6, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.WAFFLES_IRON, { name:'Waffle\'s Iron', type:'melee', dmg:50, speed:0.383, kb:4.75, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.WHITE_PHASEBLADE, { name:'White Phaseblade', type:'melee', dmg:26, speed:0.3, kb:3, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.YELLOW_PHASEBLADE, { name:'Yellow Phaseblade', type:'melee', dmg:26, speed:0.3, kb:3, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.ZOMBIE_ARM, { name:'Zombie Arm', type:'melee', dmg:15, speed:0.367, kb:5.5, range:4, auto:true, desc:'A broad blade. Auto-swings.' });
defItem(I.RED_PHASESABER, { name:'Red Phasesaber', type:'melee', dmg:50, speed:0.25, kb:3, range:4, color:'#ff4058', auto:true, desc:'A laser blade. Mine gems for more.' });
defItem(I.WHITE_PHASESABER, { name:'White Phasesaber', type:'melee', dmg:50, speed:0.25, kb:3, range:4, color:'#f0f0ff', auto:true, desc:'A laser blade. Mine gems for more.' });
defItem(I.YELLOW_PHASESABER, { name:'Yellow Phasesaber', type:'melee', dmg:50, speed:0.25, kb:3, range:4, color:'#ffe14d', auto:true, desc:'A laser blade. Mine gems for more.' });
defItem(I.ORANGE_PHASESABER, { name:'Orange Phasesaber', type:'melee', dmg:50, speed:0.25, kb:3, range:4, color:'#ff9a3d', auto:true, desc:'A laser blade. Mine gems for more.' });
defItem(I.PINK_PHASESABER, { name:'Pink Phasesaber', type:'melee', dmg:50, speed:0.25, kb:3, range:4, color:'#ff8ac8', auto:true, desc:'A laser blade. Mine gems for more.' });
defItem(I.RAINBOW_PHASESABER, { name:'Rainbow Phasesaber', type:'melee', dmg:50, speed:0.25, kb:3, range:4, color:'#ff9de0', auto:true, desc:'A laser blade. Mine gems for more.' });
defItem(I.BONE_PICKAXE, { name:'Bone Pickaxe', type:'tool', power:55, speed:0.7, dmg:8, range:3.4, desc:'A sturdy pickaxe.' });
defItem(I.CACTUS_PICKAXE, { name:'Cactus Pickaxe', type:'tool', power:35, speed:0.7, dmg:4, range:3.4, desc:'A sturdy pickaxe.' });
defItem(I.CANDY_CANE_PICKAXE, { name:'Candy Cane Pickaxe', type:'tool', power:55, speed:0.7, dmg:7, range:3.4, desc:'A sturdy pickaxe.' });
defItem(I.CHLOROPHYTE_PICKAXE, { name:'Chlorophyte Pickaxe', type:'tool', power:200, speed:0.7, dmg:40, range:3.4, desc:'A sturdy pickaxe.' });
defItem(I.FOSSIL_PICKAXE, { name:'Fossil Pickaxe', type:'tool', power:55, speed:0.7, dmg:8, range:3.4, desc:'A sturdy pickaxe.' });
defItem(I.NEBULA_PICKAXE, { name:'Nebula Pickaxe', type:'tool', power:225, speed:0.7, dmg:80, range:3.4, desc:'A sturdy pickaxe.' });
defItem(I.ORICHALCUM_PICKAXE, { name:'Orichalcum Pickaxe', type:'tool', power:165, speed:0.7, dmg:17, range:3.4, desc:'A sturdy pickaxe.' });
defItem(I.PALLADIUM_PICKAXE, { name:'Palladium Pickaxe', type:'tool', power:130, speed:0.7, dmg:12, range:3.4, desc:'A sturdy pickaxe.' });
defItem(I.REAVER_SHARK, { name:'Reaver Shark', type:'tool', power:59, speed:0.7, dmg:16, range:3.4, desc:'A sturdy pickaxe.' });
defItem(I.SOLAR_FLARE_PICKAXE, { name:'Solar Flare Pickaxe', type:'tool', power:225, speed:0.7, dmg:80, range:3.4, desc:'A sturdy pickaxe.' });
defItem(I.SPECTRE_PICKAXE, { name:'Spectre Pickaxe', type:'tool', power:200, speed:0.7, dmg:32, range:3.4, desc:'A sturdy pickaxe.' });
defItem(I.STARDUST_PICKAXE, { name:'Stardust Pickaxe', type:'tool', power:225, speed:0.7, dmg:80, range:3.4, desc:'A sturdy pickaxe.' });
defItem(I.VORTEX_PICKAXE, { name:'Vortex Pickaxe', type:'tool', power:225, speed:0.7, dmg:80, range:3.4, desc:'A sturdy pickaxe.' });
defItem(I.ASH_WOOD_HAMMER, { name:'Ash Wood Hammer', type:'tool', hammer:45, power:0, speed:0.5, dmg:9, range:3.2, hammerPower:45, desc:'A heavy hammer.' });
defItem(I.BOREAL_WOOD_HAMMER, { name:'Boreal Wood Hammer', type:'tool', hammer:35, power:0, speed:0.55, dmg:4, range:3.2, hammerPower:35, desc:'A heavy hammer.' });
defItem(I.CHLOROPHYTE_WARHAMMER, { name:'Chlorophyte Warhammer', type:'tool', hammer:90, power:0, speed:0.583, dmg:80, range:3.2, hammerPower:90, desc:'A heavy hammer.' });
defItem(I.COPPER_HAMMER, { name:'Copper Hammer', type:'tool', hammer:35, power:0, speed:0.55, dmg:4, range:3.2, hammerPower:35, desc:'A heavy hammer.' });
defItem(I.EBONWOOD_HAMMER, { name:'Ebonwood Hammer', type:'tool', hammer:40, power:0, speed:0.5, dmg:7, range:3.2, hammerPower:40, desc:'A heavy hammer.' });
defItem(I.FLESH_GRINDER, { name:'Flesh Grinder', type:'tool', hammer:55, power:0, speed:0.667, dmg:23, range:3.2, hammerPower:55, desc:'A heavy hammer.' });
defItem(I.GOLD_HAMMER, { name:'Gold Hammer', type:'tool', hammer:55, power:0, speed:0.467, dmg:9, range:3.2, hammerPower:55, desc:'A heavy hammer.' });
defItem(I.HAMMUSH, { name:'Hammush', type:'tool', hammer:85, power:0, speed:0.45, dmg:26, range:3.2, hammerPower:85, desc:'A heavy hammer.' });
defItem(I.IRON_HAMMER, { name:'Iron Hammer', type:'tool', hammer:40, power:0, speed:0.5, dmg:7, range:3.2, hammerPower:40, desc:'A heavy hammer.' });
defItem(I.LEAD_HAMMER, { name:'Lead Hammer', type:'tool', hammer:43, power:0, speed:0.483, dmg:8, range:3.2, hammerPower:43, desc:'A heavy hammer.' });
defItem(I.NEBULA_HAMMER, { name:'Nebula Hammer', type:'tool', hammer:100, power:0, speed:0.5, dmg:110, range:3.2, hammerPower:100, desc:'A heavy hammer.' });
defItem(I.PALM_WOOD_HAMMER, { name:'Palm Wood Hammer', type:'tool', hammer:35, power:0, speed:0.55, dmg:4, range:3.2, hammerPower:35, desc:'A heavy hammer.' });
defItem(I.PEARLWOOD_HAMMER, { name:'Pearlwood Hammer', type:'tool', hammer:55, power:0, speed:0.483, dmg:10, range:3.2, hammerPower:55, desc:'A heavy hammer.' });
defItem(I.PLATINUM_HAMMER, { name:'Platinum Hammer', type:'tool', hammer:59, power:0, speed:0.45, dmg:10, range:3.2, hammerPower:59, desc:'A heavy hammer.' });
defItem(I.RICH_MAHOGANY_HAMMER, { name:'Rich Mahogany Hammer', type:'tool', hammer:35, power:0, speed:0.55, dmg:4, range:3.2, hammerPower:35, desc:'A heavy hammer.' });
defItem(I.SHADEWOOD_HAMMER, { name:'Shadewood Hammer', type:'tool', hammer:40, power:0, speed:0.5, dmg:7, range:3.2, hammerPower:40, desc:'A heavy hammer.' });
defItem(I.SHROOMITE_DIGGING_CLAW, { name:'Shroomite Digging Claw', type:'tool', power:200, axe:25, hammer:40, dmg:45, speed:0.2, range:3.4, hammerPower:40, desc:'A heavy hammer.' });
defItem(I.SILVER_HAMMER, { name:'Silver Hammer', type:'tool', hammer:45, power:0, speed:0.483, dmg:9, range:3.2, hammerPower:45, desc:'A heavy hammer.' });
defItem(I.SOLAR_FLARE_HAMMER, { name:'Solar Flare Hammer', type:'tool', hammer:100, power:0, speed:0.5, dmg:110, range:3.2, hammerPower:100, desc:'A heavy hammer.' });
defItem(I.STARDUST_HAMMER, { name:'Stardust Hammer', type:'tool', hammer:100, power:0, speed:0.5, dmg:110, range:3.2, hammerPower:100, desc:'A heavy hammer.' });
defItem(I.THE_BREAKER, { name:'The Breaker', type:'tool', hammer:55, power:0, speed:0.75, dmg:24, range:3.2, hammerPower:55, desc:'A heavy hammer.' });
defItem(I.TIN_HAMMER, { name:'Tin Hammer', type:'tool', hammer:38, power:0, speed:0.517, dmg:6, range:3.2, hammerPower:38, desc:'A heavy hammer.' });
defItem(I.TUNGSTEN_HAMMER, { name:'Tungsten Hammer', type:'tool', hammer:50, power:0, speed:0.467, dmg:9, range:3.2, hammerPower:50, desc:'A heavy hammer.' });
defItem(I.VORTEX_HAMMER, { name:'Vortex Hammer', type:'tool', hammer:100, power:0, speed:0.5, dmg:110, range:3.2, hammerPower:100, desc:'A heavy hammer.' });
defItem(I.WOODEN_HAMMER, { name:'Wooden Hammer', type:'tool', hammer:25, power:0, speed:0.617, dmg:2, range:3.2, hammerPower:25, desc:'A heavy hammer.' });
defItem(I.ADAMANTITE_WARAXE, { name:'Adamantite Waraxe', type:'tool', axe:20, speed:0.583, dmg:43, range:3.2, desc:'A battle axe that chops trees.' });
defItem(I.AXE_OF_REGROWTH, { name:'Axe of Regrowth', type:'tool', axe:25, speed:0.4, dmg:20, range:3.2, desc:'A battle axe that chops trees.' });
defItem(I.BLOOD_LUST_CLUSTER, { name:'Blood Lust Cluster', type:'tool', axe:15, speed:0.533, dmg:22, range:3.2, desc:'A battle axe that chops trees.' });
defItem(I.CHLOROPHYTE_GREATAXE, { name:'Chlorophyte Greataxe', type:'tool', axe:23, speed:0.5, dmg:70, range:3.2, desc:'A battle axe that chops trees.' });
defItem(I.COBALT_WARAXE, { name:'Cobalt Waraxe', type:'tool', axe:14, speed:0.583, dmg:33, range:3.2, desc:'A battle axe that chops trees.' });
defItem(I.GOLD_AXE, { name:'Gold Axe', type:'tool', axe:11, speed:0.433, dmg:7, range:3.2, desc:'A battle axe that chops trees.' });
defItem(I.LEAD_AXE, { name:'Lead Axe', type:'tool', axe:10, speed:0.467, dmg:6, range:3.2, desc:'A battle axe that chops trees.' });
defItem(I.METEOR_HAMAXE, { name:'Meteor Hamaxe', type:'tool', axe:20, speed:0.5, dmg:20, range:3.2, desc:'A battle axe that chops trees.' });
defItem(I.MOLTEN_HAMAXE, { name:'Molten Hamaxe', type:'tool', axe:30, speed:0.45, dmg:20, range:3.2, desc:'A battle axe that chops trees.' });
defItem(I.MYTHRIL_WARAXE, { name:'Mythril Waraxe', type:'tool', axe:17, speed:0.583, dmg:39, range:3.2, desc:'A battle axe that chops trees.' });
defItem(I.NEBULA_AXE, { name:'Nebula Axe', type:'tool', axe:27, speed:0.417, dmg:100, range:3.2, desc:'A battle axe that chops trees.' });
defItem(I.NEBULA_HAMAXE, { name:'Nebula Hamaxe', type:'tool', axe:30, speed:0.467, dmg:60, range:3.2, desc:'A battle axe that chops trees.' });
defItem(I.ORICHALCUM_WARAXE, { name:'Orichalcum Waraxe', type:'tool', axe:18, speed:0.583, dmg:41, range:3.2, desc:'A battle axe that chops trees.' });
defItem(I.PALLADIUM_WARAXE, { name:'Palladium Waraxe', type:'tool', axe:15, speed:0.583, dmg:36, range:3.2, desc:'A battle axe that chops trees.' });
defItem(I.PLATINUM_AXE, { name:'Platinum Axe', type:'tool', axe:12, speed:0.417, dmg:8, range:3.2, desc:'A battle axe that chops trees.' });
defItem(I.SILVER_AXE, { name:'Silver Axe', type:'tool', axe:10, speed:0.433, dmg:6, range:3.2, desc:'A battle axe that chops trees.' });
defItem(I.SOLAR_FLARE_AXE, { name:'Solar Flare Axe', type:'tool', axe:27, speed:0.417, dmg:100, range:3.2, desc:'A battle axe that chops trees.' });
defItem(I.SOLAR_FLARE_HAMAXE, { name:'Solar Flare Hamaxe', type:'tool', axe:30, speed:0.467, dmg:60, range:3.2, desc:'A battle axe that chops trees.' });
defItem(I.STARDUST_AXE, { name:'Stardust Axe', type:'tool', axe:27, speed:0.417, dmg:100, range:3.2, desc:'A battle axe that chops trees.' });
defItem(I.STARDUST_HAMAXE, { name:'Stardust Hamaxe', type:'tool', axe:30, speed:0.467, dmg:60, range:3.2, desc:'A battle axe that chops trees.' });
defItem(I.THE_AXE, { name:'The Axe', type:'tool', axe:35, speed:0.383, dmg:72, range:3.2, desc:'A battle axe that chops trees.' });
defItem(I.TIN_AXE, { name:'Tin Axe', type:'tool', axe:8, speed:0.467, dmg:4, range:3.2, desc:'A battle axe that chops trees.' });
defItem(I.TITANIUM_WARAXE, { name:'Titanium Waraxe', type:'tool', axe:21, speed:0.583, dmg:44, range:3.2, desc:'A battle axe that chops trees.' });
defItem(I.TUNGSTEN_AXE, { name:'Tungsten Axe', type:'tool', axe:11, speed:0.433, dmg:7, range:3.2, desc:'A battle axe that chops trees.' });
defItem(I.VORTEX_AXE, { name:'Vortex Axe', type:'tool', axe:27, speed:0.417, dmg:100, range:3.2, desc:'A battle axe that chops trees.' });
defItem(I.VORTEX_HAMAXE, { name:'Vortex Hamaxe', type:'tool', axe:30, speed:0.467, dmg:60, range:3.2, desc:'A battle axe that chops trees.' });
defItem(I.WAR_AXE_OF_THE_NIGHT, { name:'War Axe of the Night', type:'tool', axe:15, speed:0.5, dmg:20, range:3.2, desc:'A battle axe that chops trees.' });
defItem(I.ADAMANTITE_REPEATER, { name:'Adamantite Repeater', type:'ranged', dmg:42, speed:0.3, kb:2.5, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.ASH_WOOD_BOW, { name:'Ash Wood Bow', type:'ranged', dmg:10, speed:0.417, kb:2, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.BLOOD_RAIN_BOW, { name:'Blood Rain Bow', type:'ranged', dmg:14, speed:0.317, kb:3, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.BLOWGUN, { name:'Blowgun', type:'ranged', dmg:27, speed:0.583, kb:4, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.BLOWPIPE, { name:'Blowpipe', type:'ranged', dmg:9, speed:0.417, kb:3.5, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.BOREAL_WOOD_BOW, { name:'Boreal Wood Bow', type:'ranged', dmg:6, speed:0.483, kb:2, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.COBALT_REPEATER, { name:'Cobalt Repeater', type:'ranged', dmg:35, speed:0.383, kb:1.5, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.DEMON_BOW, { name:'Demon Bow', type:'ranged', dmg:14, speed:0.417, kb:1, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.EBONWOOD_BOW, { name:'Ebonwood Bow', type:'ranged', dmg:8, speed:0.467, kb:2, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.LEAD_BOW, { name:'Lead Bow', type:'ranged', dmg:9, speed:0.45, kb:2, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.MYTHRIL_REPEATER, { name:'Mythril Repeater', type:'ranged', dmg:39, speed:0.333, kb:2, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.ORICHALCUM_REPEATER, { name:'Orichalcum Repeater', type:'ranged', dmg:40, speed:0.317, kb:2, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.PALLADIUM_REPEATER, { name:'Palladium Repeater', type:'ranged', dmg:37, speed:0.367, kb:2, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.PALM_WOOD_BOW, { name:'Palm Wood Bow', type:'ranged', dmg:6, speed:0.483, kb:2, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.PEARLWOOD_BOW, { name:'Pearlwood Bow', type:'ranged', dmg:12, speed:0.333, kb:2, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.PLATINUM_BOW, { name:'Platinum Bow', type:'ranged', dmg:13, speed:0.417, kb:2, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.RICH_MAHOGANY_BOW, { name:'Rich Mahogany Bow', type:'ranged', dmg:6, speed:0.483, kb:2, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.SHADEWOOD_BOW, { name:'Shadewood Bow', type:'ranged', dmg:8, speed:0.467, kb:2, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.SKULL_BOW, { name:'Skull Bow', type:'ranged', dmg:8, speed:0.283, kb:5, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.TENDON_BOW, { name:'Tendon Bow', type:'ranged', dmg:19, speed:0.5, kb:1, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.TIN_BOW, { name:'Tin Bow', type:'ranged', dmg:7, speed:0.467, kb:2, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.TITANIUM_REPEATER, { name:'Titanium Repeater', type:'ranged', dmg:43, speed:0.283, kb:2.5, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.TUNGSTEN_BOW, { name:'Tungsten Bow', type:'ranged', dmg:10, speed:0.433, kb:2, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.WOODEN_BOW, { name:'Wooden Bow', type:'ranged', dmg:4, speed:0.5, kb:2, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.AERIAL_BANE, { name:'Aerial Bane', type:'ranged', dmg:38, speed:0.5, kb:4.5, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.BARREL_LAUNCHER, { name:'Barrel Launcher', type:'ranged', dmg:100, speed:0.667, kb:8, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.BONE_JAVELIN, { name:'Bone Javelin', type:'ranged', dmg:20, speed:0.417, kb:5, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.BONE_THROWING_KNIFE, { name:'Bone Throwing Knife', type:'ranged', dmg:14, speed:0.233, kb:1.5, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.CELEBRATION_MK2, { name:'Celebration Mk2', type:'ranged', dmg:50, speed:0.1, kb:10, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.ENDLESS_MUSKET_POUCH, { name:'Endless Musket Pouch', type:'ranged', dmg:7, speed:0.333, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.ENDLESS_QUIVER, { name:'Endless Quiver', type:'ranged', dmg:5, speed:0.333, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.EVENTIDE, { name:'Eventide', type:'ranged', dmg:50, speed:0.5, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.FLINTLOCK_PISTOL, { name:'Flintlock Pistol', type:'ranged', dmg:13, speed:0.267, kb:1, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.FROST_DAGGERFISH, { name:'Frost Daggerfish', type:'ranged', dmg:17, speed:0.217, kb:3.5, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.GATLIGATOR, { name:'Gatligator', type:'ranged', dmg:21, speed:0.117, kb:1.5, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.HANDGUN, { name:'Handgun', type:'ranged', dmg:26, speed:0.25, kb:3, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.HARPOON, { name:'Harpoon', type:'ranged', dmg:25, speed:0.5, kb:6, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.JAVELIN, { name:'Javelin', type:'ranged', dmg:17, speed:0.4, kb:4.75, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.METEOR_SHOT, { name:'Meteor Shot', type:'ranged', dmg:8, speed:0.333, kb:1, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.MINI_NUKE_I, { name:'Mini Nuke I', type:'ranged', dmg:75, speed:0.333, kb:4, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.MINI_NUKE_I_I, { name:'Mini Nuke II', type:'ranged', dmg:75, speed:0.333, kb:4, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.MINISHARK, { name:'Minishark', type:'ranged', dmg:6, speed:0.133, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.MOLTEN_FURY, { name:'Molten Fury', type:'ranged', dmg:31, speed:0.367, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.PAINTBALL_GUN, { name:'Paintball Gun', type:'ranged', dmg:12, speed:0.4, kb:1.25, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.PHANTASM, { name:'Phantasm', type:'ranged', dmg:50, speed:0.2, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.PHANTOM_PHOENIX, { name:'Phantom Phoenix', type:'ranged', dmg:32, speed:0.3, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.PHOENIX_BLASTER, { name:'Phoenix Blaster', type:'ranged', dmg:30, speed:0.233, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.POISONED_KNIFE, { name:'Poisoned Knife', type:'ranged', dmg:14, speed:0.25, kb:2.4, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.QUAD_BARREL_SHOTGUN, { name:'Quad-Barrel Shotgun', type:'ranged', dmg:14, speed:0.917, kb:6.5, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.RED_RYDER, { name:'Red Ryder', type:'ranged', dmg:20, speed:0.633, kb:3.75, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.REVOLVER, { name:'Revolver', type:'ranged', dmg:20, speed:0.367, kb:4.5, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.S_D_M_G, { name:'S.D.M.G.', type:'ranged', dmg:85, speed:0.083, kb:2.5, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.SANDGUN, { name:'Sandgun', type:'ranged', dmg:30, speed:0.267, kb:5, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.SHURIKEN, { name:'Shuriken', type:'ranged', dmg:10, speed:0.25, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.SPIKY_BALL, { name:'Spiky Ball', type:'ranged', dmg:16, speed:0.25, kb:1, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.STYNGER, { name:'Stynger', type:'ranged', dmg:45, speed:0.367, kb:5, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.STYNGER_BOLT, { name:'Stynger Bolt', type:'ranged', dmg:17, speed:0.333, kb:1, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.SUPER_STAR_SHOOTER, { name:'Super Star Shooter', type:'ranged', dmg:60, speed:0.3, kb:5, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.THE_BEES_KNEES, { name:'The Bee\'s Knees', type:'ranged', dmg:23, speed:0.383, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.THROWING_KNIFE, { name:'Throwing Knife', type:'ranged', dmg:12, speed:0.25, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.TOXIKARP, { name:'Toxikarp', type:'ranged', dmg:43, speed:0.167, kb:3, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.VORTEX_BEATER, { name:'Vortex Beater', type:'ranged', dmg:50, speed:0.333, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.ALE_TOSSER, { name:'Ale Tosser', type:'ammo', dmg:32, maxStack:999, desc:'Ammunition.' });
defItem(I.BEENADE, { name:'Beenade', type:'ammo', dmg:12, maxStack:999, desc:'Ammunition.' });
defItem(I.BLUE_FLARE, { name:'Blue Flare', type:'ammo', dmg:1, maxStack:999, desc:'Ammunition.' });
defItem(I.BOUNCY_GRENADE, { name:'Bouncy Grenade', type:'ammo', dmg:65, maxStack:999, desc:'Ammunition.' });
defItem(I.CANDY_CORN, { name:'Candy Corn', type:'ammo', dmg:9, maxStack:999, desc:'Ammunition.' });
defItem(I.CANDY_CORN_RIFLE, { name:'Candy Corn Rifle', type:'ammo', dmg:60, maxStack:999, desc:'Ammunition.' });
defItem(I.CHLOROPHYTE_ARROW, { name:'Chlorophyte Arrow', type:'ammo', dmg:16, maxStack:999, desc:'Ammunition.' });
defItem(I.CLUSTER_ROCKET_I, { name:'Cluster Rocket I', type:'ammo', dmg:50, maxStack:999, desc:'Ammunition.' });
defItem(I.CLUSTER_ROCKET_I_I, { name:'Cluster Rocket II', type:'ammo', dmg:50, maxStack:999, desc:'Ammunition.' });
defItem(I.CURSED_ARROW, { name:'Cursed Arrow', type:'ammo', dmg:17, maxStack:999, desc:'Ammunition.' });
defItem(I.CURSED_FLARE, { name:'Cursed Flare', type:'ammo', dmg:1, maxStack:999, desc:'Ammunition.' });
defItem(I.DRY_ROCKET, { name:'Dry Rocket', type:'ammo', dmg:40, maxStack:999, desc:'Ammunition.' });
defItem(I.EXPLODING_BULLET, { name:'Exploding Bullet', type:'ammo', dmg:10, maxStack:999, desc:'Ammunition.' });
defItem(I.EXPLOSIVE_JACK_O_LANTERN, { name:'Explosive Jack \'O Lantern', type:'ammo', dmg:60, maxStack:999, desc:'Ammunition.' });
defItem(I.FLAMING_ARROW, { name:'Flaming Arrow', type:'ammo', dmg:7, maxStack:999, desc:'Ammunition.' });
defItem(I.FLARE, { name:'Flare', type:'ammo', dmg:1, maxStack:999, desc:'Ammunition.' });
defItem(I.GOLDEN_BULLET, { name:'Golden Bullet', type:'ammo', dmg:10, maxStack:999, desc:'Ammunition.' });
defItem(I.HAPPY_GRENADE, { name:'Happy Grenade', type:'ammo', dmg:30, maxStack:999, desc:'Ammunition.' });
defItem(I.HIGH_VELOCITY_BULLET, { name:'High Velocity Bullet', type:'ammo', dmg:11, maxStack:999, desc:'Ammunition.' });
defItem(I.HONEY_ROCKET, { name:'Honey Rocket', type:'ammo', dmg:40, maxStack:999, desc:'Ammunition.' });
defItem(I.ICHOR_ARROW, { name:'Ichor Arrow', type:'ammo', dmg:16, maxStack:999, desc:'Ammunition.' });
defItem(I.JACK_O_LANTERN_LAUNCHER, { name:'Jack \'O Lantern Launcher', type:'ammo', dmg:85, maxStack:999, desc:'Ammunition.' });
defItem(I.LAVA_ROCKET, { name:'Lava Rocket', type:'ammo', dmg:40, maxStack:999, desc:'Ammunition.' });
defItem(I.LUMINITE_ARROW, { name:'Luminite Arrow', type:'ammo', dmg:15, maxStack:999, desc:'Ammunition.' });
defItem(I.LUMINITE_BULLET, { name:'Luminite Bullet', type:'ammo', dmg:20, maxStack:999, desc:'Ammunition.' });
defItem(I.MOLOTOV_COCKTAIL, { name:'Molotov Cocktail', type:'ammo', dmg:23, maxStack:999, desc:'Ammunition.' });
defItem(I.NAIL, { name:'Nail', type:'ammo', dmg:30, maxStack:999, desc:'Ammunition.' });
defItem(I.NANO_BULLET, { name:'Nano Bullet', type:'ammo', dmg:10, maxStack:999, desc:'Ammunition.' });
defItem(I.PARTY_BULLET, { name:'Party Bullet', type:'ammo', dmg:10, maxStack:999, desc:'Ammunition.' });
defItem(I.POISON_DART, { name:'Poison Dart', type:'ammo', dmg:10, maxStack:999, desc:'Ammunition.' });
defItem(I.RAINBOW_FLARE, { name:'Rainbow Flare', type:'ammo', dmg:1, maxStack:999, desc:'Ammunition.' });
defItem(I.ROTTEN_EGG, { name:'Rotten Egg', type:'ammo', dmg:13, maxStack:999, desc:'Ammunition.' });
defItem(I.SEED, { name:'Seed', type:'ammo', dmg:4, maxStack:999, desc:'Ammunition.' });
defItem(I.SHIMMER_ARROW, { name:'Shimmer Arrow', type:'ammo', dmg:12, maxStack:999, desc:'Ammunition.' });
defItem(I.SHIMMER_FLARE, { name:'Shimmer Flare', type:'ammo', dmg:1, maxStack:999, desc:'Ammunition.' });
defItem(I.SNOWBALL, { name:'Snowball', type:'ammo', dmg:8, maxStack:999, desc:'Ammunition.' });
defItem(I.SNOWBALL_CANNON, { name:'Snowball Cannon', type:'ammo', dmg:10, maxStack:999, desc:'Ammunition.' });
defItem(I.SPELUNKER_FLARE, { name:'Spelunker Flare', type:'ammo', dmg:1, maxStack:999, desc:'Ammunition.' });
defItem(I.STAKE, { name:'Stake', type:'ammo', dmg:25, maxStack:999, desc:'Ammunition.' });
defItem(I.STAKE_LAUNCHER, { name:'Stake Launcher', type:'ammo', dmg:75, maxStack:999, desc:'Ammunition.' });
defItem(I.STAR_ANISE, { name:'Star Anise', type:'ammo', dmg:14, maxStack:999, desc:'Ammunition.' });
defItem(I.STICKY_GRENADE, { name:'Sticky Grenade', type:'ammo', dmg:60, maxStack:999, desc:'Ammunition.' });
defItem(I.TUNGSTEN_BULLET, { name:'Tungsten Bullet', type:'ammo', dmg:9, maxStack:999, desc:'Ammunition.' });
defItem(I.VENOM_ARROW, { name:'Venom Arrow', type:'ammo', dmg:19, maxStack:999, desc:'Ammunition.' });
defItem(I.WET_ROCKET, { name:'Wet Rocket', type:'ammo', dmg:40, maxStack:999, desc:'Ammunition.' });
defItem(I.AMETHYST_STAFF, { name:'Amethyst Staff', type:'magic', dmg:15, speed:0.617, kb:3, mana:7, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.ARC_SURGE, { name:'Arc Surge', type:'magic', dmg:180, speed:0.3, kb:4, mana:18, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.BAT_SCEPTER, { name:'Bat Scepter', type:'magic', dmg:45, speed:0.2, kb:3, mana:6, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.BEJEWELED_STAFF, { name:'Bejeweled Staff', type:'magic', dmg:27, speed:0.367, kb:6, mana:15, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.BETSYS_WRATH, { name:'Betsy\'s Wrath', type:'magic', dmg:100, speed:0.333, kb:3, mana:14, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.BOOK_OF_SKULLS, { name:'Book of Skulls', type:'magic', dmg:29, speed:0.533, kb:3.5, mana:18, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.CRYSTAL_SERPENT, { name:'Crystal Serpent', type:'magic', dmg:40, speed:0.483, kb:4.4, mana:9, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.DAYBLOOM_STAFF, { name:'Daybloom Staff', type:'magic', dmg:8, speed:0.667, kb:3, mana:5, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.DIAMOND_STAFF, { name:'Diamond Staff', type:'magic', dmg:23, speed:0.433, kb:5.5, mana:9, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.EMERALD_STAFF, { name:'Emerald Staff', type:'magic', dmg:19, speed:0.533, kb:4.25, mana:8, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.FLOWER_OF_FROST, { name:'Flower of Frost', type:'magic', dmg:60, speed:0.2, kb:6.5, mana:11, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.FROST_STAFF, { name:'Frost Staff', type:'magic', dmg:46, speed:0.2, kb:5, mana:12, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.GLACIER_FANG, { name:'Glacier Fang', type:'magic', dmg:11, speed:0.4, kb:2, mana:10, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.GRAY_ZAPINATOR, { name:'Gray Zapinator', type:'magic', dmg:42, speed:0.6, kb:6, mana:16, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.ICE_ROD, { name:'Ice Rod', type:'magic', dmg:28, speed:0.15, kb:2, mana:6, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.KILLING_DECK, { name:'Killing Deck', type:'magic', dmg:22, speed:0.333, kb:5, mana:8, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.LEAF_BLOWER, { name:'Leaf Blower', type:'magic', dmg:48, speed:0.25, kb:4, mana:5, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.LIGHTNING_STRIKE, { name:'Lightning Strike', type:'magic', dmg:150, speed:0.917, kb:10, mana:30, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.MAGIC_DAGGER, { name:'Magic Dagger', type:'magic', dmg:30, speed:0.133, kb:3.75, mana:6, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.MAGIC_MISSILE, { name:'Magic Missile', type:'magic', dmg:35, speed:0.367, kb:7.5, mana:14, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.MEDUSA_HEAD, { name:'Medusa Head', type:'magic', dmg:40, speed:0.333, kb:2, mana:15, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.METEOR_STAFF, { name:'Meteor Staff', type:'magic', dmg:50, speed:0.167, kb:4.5, mana:9, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.MYSTIC_BLOOM, { name:'Mystic Bloom', type:'magic', dmg:20, speed:0.7, kb:3.5, mana:20, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.NIGHTGLOW, { name:'Nightglow', type:'magic', dmg:50, speed:0.6, kb:2.5, mana:23, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.ORANGE_ZAPINATOR, { name:'Orange Zapinator', type:'magic', dmg:100, speed:0.6, kb:6, mana:16, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.POISON_STAFF, { name:'Poison Staff', type:'magic', dmg:43, speed:0.6, kb:5.6, mana:22, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.RESONANCE_SCEPTER, { name:'Resonance Scepter', type:'magic', dmg:70, speed:0.417, kb:5, mana:18, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.RUBY_STAFF, { name:'Ruby Staff', type:'magic', dmg:18, speed:0.467, kb:4.75, mana:9, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.SAPPHIRE_STAFF, { name:'Sapphire Staff', type:'magic', dmg:18, speed:0.567, kb:4, mana:8, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.STELLAR_TUNE, { name:'Stellar Tune', type:'magic', dmg:85, speed:0.2, kb:1.5, mana:12, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.THUNDER_ZAPPER, { name:'Thunder Zapper', type:'magic', dmg:24, speed:0.283, kb:3, mana:6, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.TOME_OF_INFINITE_WISDOM, { name:'Tome of Infinite Wisdom', type:'magic', dmg:36, speed:0.417, kb:9, mana:20, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.TOPAZ_STAFF, { name:'Topaz Staff', type:'magic', dmg:16, speed:0.6, kb:3.5, mana:7, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.WAND_OF_FROSTING, { name:'Wand of Frosting', type:'magic', dmg:15, speed:0.433, kb:3, mana:2, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.WAND_OF_SPARKING, { name:'Wand of Sparking', type:'magic', dmg:14, speed:0.433, kb:3, mana:2, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.WASP_GUN, { name:'Wasp Gun', type:'magic', dmg:31, speed:0.3, kb:0.25, mana:10, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.BALLISTA_CANE, { name:'Ballista Cane', type:'summonstaff', dmg:74, speed:0.5, kb:4.7, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.BALLISTA_ROD, { name:'Ballista Rod', type:'summonstaff', dmg:30, speed:0.5, kb:4.7, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.BALLISTA_STAFF, { name:'Ballista Staff', type:'summonstaff', dmg:156, speed:0.5, kb:4.7, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.BARNACLE_STAFF, { name:'Barnacle Staff', type:'summonstaff', dmg:33, speed:0.5, kb:7.5, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.CATTIVA, { name:'Cattiva', type:'summonstaff', dmg:11, speed:0.25, kb:2, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.CLAY_BUD_STAFF, { name:'Clay Bud Staff', type:'summonstaff', dmg:5, speed:0.6, kb:2, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.COBWHIP, { name:'Cobwhip', type:'summonstaff', dmg:9, speed:0.583, kb:0.7, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.ELECTRIC_EEL, { name:'Electric Eel', type:'summonstaff', dmg:150, speed:0.5, kb:3, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.EXPLOSIVE_TRAP_CANE, { name:'Explosive Trap Cane', type:'summonstaff', dmg:59, speed:0.5, kb:0.5, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.EXPLOSIVE_TRAP_ROD, { name:'Explosive Trap Rod', type:'summonstaff', dmg:24, speed:0.5, kb:0.5, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.EXPLOSIVE_TRAP_STAFF, { name:'Explosive Trap Staff', type:'summonstaff', dmg:126, speed:0.5, kb:0.5, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.FINCH_STAFF, { name:'Finch Staff', type:'summonstaff', dmg:7, speed:0.6, kb:4, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.FLAMEBURST_CANE, { name:'Flameburst Cane', type:'summonstaff', dmg:42, speed:0.5, kb:3, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.FLAMEBURST_ROD, { name:'Flameburst Rod', type:'summonstaff', dmg:17, speed:0.5, kb:3, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.FLAMEBURST_STAFF, { name:'Flameburst Staff', type:'summonstaff', dmg:88, speed:0.5, kb:3, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.FOXPARKS, { name:'Foxparks', type:'summonstaff', dmg:20, speed:0.25, kb:3, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.HOUNDIUS_SHOOTIUS, { name:'Houndius Shootius', type:'summonstaff', dmg:24, speed:0.5, kb:7.5, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.LIGHTNING_AURA_CANE, { name:'Lightning Aura Cane', type:'summonstaff', dmg:11, speed:0.5, kb:0.25, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.LIGHTNING_AURA_ROD, { name:'Lightning Aura Rod', type:'summonstaff', dmg:4, speed:0.5, kb:0.25, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.LIGHTNING_AURA_STAFF, { name:'Lightning Aura Staff', type:'summonstaff', dmg:34, speed:0.5, kb:0.25, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.LUNAR_PORTAL_STAFF, { name:'Lunar Portal Staff', type:'summonstaff', dmg:100, speed:0.5, kb:7.5, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.MUSHROOM_STAFF, { name:'Mushroom Staff', type:'summonstaff', dmg:8, speed:0.6, kb:2, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.POSSESSION, { name:'Possession', type:'summonstaff', dmg:110, speed:0.5, kb:4, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.QUEEN_SPIDER_STAFF, { name:'Queen Spider Staff', type:'summonstaff', dmg:26, speed:0.5, kb:7.5, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.RAINBOW_CRYSTAL_STAFF, { name:'Rainbow Crystal Staff', type:'summonstaff', dmg:130, speed:0.5, kb:7.5, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.RUINOUS_STAFF, { name:'Ruinous Staff', type:'summonstaff', dmg:40, speed:0.6, kb:4, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.SLIME_STAFF, { name:'Slime Staff', type:'summonstaff', dmg:8, speed:0.467, kb:2, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.SLIME_WHIP, { name:'Slime Whip', type:'summonstaff', dmg:15, speed:0.5, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.SOULSCOURGE, { name:'Soulscourge', type:'summonstaff', dmg:17, speed:0.5, kb:1.35, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.SPINAL_TAP, { name:'Spinal Tap', type:'summonstaff', dmg:29, speed:0.5, kb:2, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.STAFF_OF_THE_FROST_HYDRA, { name:'Staff of the Frost Hydra', type:'summonstaff', dmg:100, speed:0.5, kb:7.5, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.STARCRASH, { name:'Starcrash', type:'summonstaff', dmg:18, speed:0.5, kb:1.5, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.TRUSTY_CATTIVA, { name:'Trusty Cattiva', type:'summonstaff', dmg:22, speed:0.25, kb:2, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.TRUSTY_FOXPARKS, { name:'Trusty Foxparks', type:'summonstaff', dmg:40, speed:0.25, kb:3, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.VAMPIRE_FROG_STAFF, { name:'Vampire Frog Staff', type:'summonstaff', dmg:11, speed:0.6, kb:5, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.VASCULASH, { name:'Vasculash', type:'summonstaff', dmg:19, speed:0.5, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.VULGAR_DISPLAY_OF_FLOWER, { name:'Vulgar Display of Flower', type:'summonstaff', dmg:50, speed:0.5, kb:2, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.TENTACLE_SPIKE, { name:'Tentacle Spike', type:'melee', dmg:20, speed:0.35, kb:5.5, range:4.5, meleeMode:'spear', spearDuration:0.4, projectileOnly:true, persistentProj:true, desc:'A thrusting spear.' });

// ---------- Batch 83 armor expansion ----------
defItem(I.STURDY_FOSSIL, { name:'Sturdy Fossil', type:'material', color:'#e8d8a8', icon:'\u25C6', maxStack:999, desc:'Dug from the Underground Desert.' });
defItem(I.BEE_WAX, { name:'Bee Wax', type:'material', color:'#ffc85c', icon:'\u25C6', maxStack:999, desc:'Waxy material from the Bee Hive.' });
defItem(I.JUNGLE_SPORES, { name:'Jungle Spores', type:'material', color:'#7dff5c', icon:'\u25C6', maxStack:999, desc:'Glowing spores from the Underground Jungle.' });
defItem(I.ANCIENT_COBALT_BREASTPLATE, { name:'Ancient Cobalt Breastplate', type:'armor', slot:'chest', def:6, color:'#3a6ad0', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +6' });
defItem(I.ANCIENT_COBALT_HELMET, { name:'Ancient Cobalt Helmet', type:'armor', slot:'head', def:5, color:'#3a6ad0', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +5' });
defItem(I.BEE_BREASTPLATE, { name:'Bee Breastplate', type:'armor', slot:'chest', def:5, color:'#ffd75e', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +5' });
defItem(I.BEE_GREAVES, { name:'Bee Greaves', type:'armor', slot:'legs', def:4, color:'#ffd75e', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +4' });
defItem(I.BEE_HEADGEAR, { name:'Bee Headgear', type:'armor', slot:'head', def:4, color:'#ffd75e', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +4' });
defItem(I.BEETLE_SCALE_MAIL, { name:'Beetle Scale Mail', type:'armor', slot:'legs', def:20, color:'#8a9a5c', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +20' });
defItem(I.CHLOROPHYTE_GREAVES, { name:'Chlorophyte Greaves', type:'armor', slot:'legs', def:13, color:'#4dff6b', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +13' });
defItem(I.CHLOROPHYTE_HEADGEAR, { name:'Chlorophyte Headgear', type:'armor', slot:'head', def:7, color:'#4dff6b', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +7' });
defItem(I.CHLOROPHYTE_MASK, { name:'Chlorophyte Mask', type:'armor', slot:'head', def:20, color:'#4dff6b', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +20' });
defItem(I.CRIMSON_GREAVES, { name:'Crimson Greaves', type:'armor', slot:'legs', def:6, color:'#b04858', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +6' });
defItem(I.CRIMSON_HELMET, { name:'Crimson Helmet', type:'armor', slot:'head', def:6, color:'#b04858', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +6' });
defItem(I.CRIMSON_SCALEMAIL, { name:'Crimson Scalemail', type:'armor', slot:'chest', def:7, color:'#b04858', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +7' });
defItem(I.FORBIDDEN_MASK, { name:'Forbidden Mask', type:'armor', slot:'head', def:6, color:'#d8b878', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +6' });
defItem(I.FORBIDDEN_TREADS, { name:'Forbidden Treads', type:'armor', slot:'legs', def:8, color:'#d8b878', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +8' });
defItem(I.FOSSIL_GREAVES, { name:'Fossil Greaves', type:'armor', slot:'legs', def:4, color:'#d8c8a0', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +4' });
defItem(I.FOSSIL_HELMET, { name:'Fossil Helmet', type:'armor', slot:'head', def:4, color:'#d8c8a0', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +4' });
defItem(I.FOSSIL_PLATE, { name:'Fossil Plate', type:'armor', slot:'chest', def:5, color:'#d8c8a0', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +5' });
defItem(I.GLADIATOR_BREASTPLATE, { name:'Gladiator Breastplate', type:'armor', slot:'chest', def:6, color:'#c8b090', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +6' });
defItem(I.GLADIATOR_HELMET, { name:'Gladiator Helmet', type:'armor', slot:'head', def:5, color:'#c8b090', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +5' });
defItem(I.GLADIATOR_LEGGINGS, { name:'Gladiator Leggings', type:'armor', slot:'legs', def:5, color:'#c8b090', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +5' });
defItem(I.HALLOWED_HEADGEAR, { name:'Hallowed Headgear', type:'armor', slot:'head', def:5, color:'#ffe9a8', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +5' });
defItem(I.HALLOWED_MASK, { name:'Hallowed Mask', type:'armor', slot:'head', def:24, color:'#ffe9a8', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +24' });
defItem(I.HALLOWED_PLATE_MAIL, { name:'Hallowed Plate Mail', type:'armor', slot:'chest', def:15, color:'#ffe9a8', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +15' });
defItem(I.IRON_CHAINMAIL, { name:'Iron Chainmail', type:'armor', slot:'chest', def:3, color:'#b0a8a0', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +3' });
defItem(I.IRON_GREAVES, { name:'Iron Greaves', type:'armor', slot:'legs', def:2, color:'#b0a8a0', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +2' });
defItem(I.IRON_HELMET, { name:'Iron Helmet', type:'armor', slot:'head', def:2, color:'#b0a8a0', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +2' });
defItem(I.JUNGLE_HAT, { name:'Jungle Hat', type:'armor', slot:'head', def:5, color:'#4a8a3a', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +5' });
defItem(I.JUNGLE_PANTS, { name:'Jungle Pants', type:'armor', slot:'legs', def:6, color:'#4a8a3a', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +6' });
defItem(I.JUNGLE_SHIRT, { name:'Jungle Shirt', type:'armor', slot:'chest', def:6, color:'#4a8a3a', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +6' });
defItem(I.NECRO_BREASTPLATE, { name:'Necro Breastplate', type:'armor', slot:'chest', def:7, color:'#b0b0c0', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +7' });
defItem(I.NECRO_GREAVES, { name:'Necro Greaves', type:'armor', slot:'legs', def:6, color:'#b0b0c0', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +6' });
defItem(I.NECRO_HELMET, { name:'Necro Helmet', type:'armor', slot:'head', def:6, color:'#b0b0c0', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +6' });
defItem(I.NINJA_HOOD, { name:'Ninja Hood', type:'armor', slot:'head', def:2, color:'#3a3a4a', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +2' });
defItem(I.NINJA_PANTS, { name:'Ninja Pants', type:'armor', slot:'legs', def:3, color:'#3a3a4a', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +3' });
defItem(I.NINJA_SHIRT, { name:'Ninja Shirt', type:'armor', slot:'chest', def:4, color:'#3a3a4a', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +4' });
defItem(I.OBSIDIAN_LONGCOAT, { name:'Obsidian Longcoat', type:'armor', slot:'chest', def:6, color:'#3a2a4a', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +6' });
defItem(I.OBSIDIAN_OUTLAW_HAT, { name:'Obsidian Outlaw Hat', type:'armor', slot:'head', def:4, color:'#3a2a4a', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +4' });
defItem(I.OBSIDIAN_PANTS, { name:'Obsidian Pants', type:'armor', slot:'legs', def:5, color:'#3a2a4a', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +5' });
defItem(I.SHADOW_GREAVES, { name:'Shadow Greaves', type:'armor', slot:'legs', def:6, color:'#5a4d8a', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +6' });
defItem(I.SHADOW_HELMET, { name:'Shadow Helmet', type:'armor', slot:'head', def:6, color:'#5a4d8a', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +6' });
defItem(I.SHADOW_SCALEMAIL, { name:'Shadow Scalemail', type:'armor', slot:'chest', def:7, color:'#5a4d8a', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +7' });
defItem(I.SHROOMITE_MASK, { name:'Shroomite Mask', type:'armor', slot:'head', def:11, color:'#c84ad8', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +11' });
defItem(I.TURTLE_SCALE_MAIL, { name:'Turtle Scale Mail', type:'armor', slot:'legs', def:27, color:'#4a8a4a', icon:'\uD83C\uDF96\uFE0F', maxStack:1, desc:'Defense +27' });

// ---------- Batch 83 accessory expansion ----------
defItem(I.AGLET, { name:'Aglet', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, runSpeed:1.05, desc:'An accessory.' });
defItem(I.AMPHIBIAN_BOOTS, { name:'Amphibian Boots', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, runSpeed:1.3, jumpBoost:1.1, desc:'An accessory.' });
defItem(I.ANKH_CHARM, { name:'Ankh Charm', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, desc:'An accessory.' });
defItem(I.BAND_OF_REGENERATION, { name:'Band of Regeneration', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, regen:1, desc:'An accessory.' });
defItem(I.BLIZZARD_IN_A_BOTTLE, { name:'Blizzard in a Bottle', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, jumps:1, desc:'An accessory.' });
defItem(I.CELESTIAL_EMBLEM, { name:'Celestial Emblem', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, magicDmg:1.15, manaRegenBoost:true, desc:'An accessory.' });
defItem(I.CELL_PHONE, { name:'Cell Phone', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, mirror:true, infoText:'all', desc:'An accessory.' });
defItem(I.CLIMBING_CLAWS, { name:'Climbing Claws', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, grip:true, desc:'An accessory.' });
defItem(I.COMPASS, { name:'Compass', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, infoText:'position', desc:'An accessory.' });
defItem(I.D_P_S_METER, { name:'DPS Meter', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, infoText:'dps', desc:'An accessory.' });
defItem(I.DEMON_WINGS, { name:'Demon Wings', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, jumpMul:1.08, jumps:3, noFall:true, desc:'An accessory.' });
defItem(I.DEPTH_METER, { name:'Depth Meter', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, infoText:'depth', desc:'An accessory.' });
defItem(I.FART_IN_A_JAR, { name:'Fart in a Jar', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, jumps:1, desc:'An accessory.' });
defItem(I.FERAL_CLAWS, { name:'Feral Claws', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, meleeSpeed:1.12, desc:'An accessory.' });
defItem(I.FLYING_CARPET, { name:'Flying Carpet', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, carpet:true, desc:'An accessory.' });
defItem(I.FROG_WEBBING, { name:'Frog Webbing', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, jumpBoost:1.1, desc:'An accessory.' });
defItem(I.G_P_S, { name:'GPS', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, infoText:'position', desc:'An accessory.' });
defItem(I.HERMES_BOOTS, { name:'Hermes Boots', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, runSpeed:1.35, desc:'Run much faster.' });
defItem(I.LAVA_WADERS, { name:'Lava Waders', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, lavaWalk:true, waterWalk:true, desc:'An accessory.' });
defItem(I.LIFEFORM_ANALYZER, { name:'Lifeform Analyzer', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, infoText:'lifeform', desc:'An accessory.' });
defItem(I.LUCKY_HORSESHOE, { name:'Lucky Horseshoe', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, noFall:true, desc:'Negates fall damage.' });
defItem(I.MAGIC_CUFFS, { name:'Magic Cuffs', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, manaRegenBoost:true, desc:'An accessory.' });
defItem(I.MAGIC_MIRROR, { name:'Magic Mirror', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, desc:'Return home instantly. Use from the inventory.' });
defItem(I.MAGMA_STONE, { name:'Magma Stone', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, fireAttack:true, desc:'An accessory.' });
defItem(I.MOLTEN_CHARM, { name:'Molten Charm', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, lavaWalk:true, desc:'An accessory.' });
defItem(I.MOLTEN_QUIVER, { name:'Molten Quiver', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, rangedDmg:1.1, fireArrow:true, desc:'An accessory.' });
defItem(I.OBSIDIAN_SKULL, { name:'Obsidian Skull', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, lavaTouch:true, desc:'An accessory.' });
defItem(I.P_D_A, { name:'PDA', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, infoText:'all', desc:'An accessory.' });
defItem(I.PHILOSOPHERS_STONE, { name:'Philosopher\'s Stone', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, potionSicknessReduce:true, desc:'An accessory.' });
defItem(I.R_E_K_3000, { name:'R.E.K. 3000', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, infoText:'lifeform', desc:'An accessory.' });
defItem(I.RADAR, { name:'Radar', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, infoText:'enemies', desc:'An accessory.' });
defItem(I.ROCKET_BOOTS, { name:'Rocket Boots', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, rocket:true, desc:'An accessory.' });
defItem(I.SANDSTORM_IN_A_BOTTLE, { name:'Sandstorm in a Bottle', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, jumps:1, jumpBoost:1.2, desc:'An accessory.' });
defItem(I.SHACKLE, { name:'Shackle', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, defense:1, desc:'An accessory.' });
defItem(I.STOPWATCH, { name:'Stopwatch', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, infoText:'speed', desc:'An accessory.' });
defItem(I.TITAN_GLOVE, { name:'Titan Glove', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, kbBoost:1, meleeSpeed:1.05, desc:'An accessory.' });
defItem(I.TSUNAMI_IN_A_BOTTLE, { name:'Tsunami in a Bottle', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, jumps:2, desc:'An accessory.' });
defItem(I.WATER_WALKING_BOOTS, { name:'Water Walking Boots', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, waterWalk:true, desc:'An accessory.' });
defItem(I.YOYO_BAG, { name:'Yoyo Bag', type:'accessory', color:'#b8b8c8', icon:'', maxStack:1, yoyoBag:true, desc:'An accessory.' });

// ---------- Batch 83 potion expansion ----------
defItem(I.BOTTLED_HONEY, { name:'Bottled Honey', type:'consumable', color:'#ff6ac8', icon:'🧪', maxStack:30, heal:20, potionCd:60, desc:'Restores 20 health.' });
defItem(I.BOTTLED_WATER, { name:'Bottled Water', type:'consumable', color:'#ff6ac8', icon:'🧪', maxStack:30, desc:'Crafting material.' });
defItem(I.CALMING_POTION, { name:'Calming Potion', type:'consumable', color:'#ff6ac8', icon:'🧪', maxStack:30, buff:'calming', t:480, desc:'Reduces enemy spawn rate.' });
defItem(I.CRATE_POTION, { name:'Crate Potion', type:'consumable', color:'#ff6ac8', icon:'🧪', maxStack:30, buff:'crate', t:480, desc:'Improved fishing crate luck.' });
defItem(I.EGGNOG, { name:'Eggnog', type:'consumable', color:'#ff6ac8', icon:'🧪', maxStack:30, heal:80, potionCd:60, desc:'Restores 80 health.' });
defItem(I.FEATHERFALL_POTION, { name:'Featherfall Potion', type:'consumable', color:'#ff6ac8', icon:'🧪', maxStack:30, buff:'featherfall', t:600, desc:'Slow falling.' });
defItem(I.FLIPPER_POTION, { name:'Flipper Potion', type:'consumable', color:'#ff6ac8', icon:'🧪', maxStack:30, buff:'flipper', t:480, desc:'Swim freely.' });
defItem(I.GILLS_POTION, { name:'Gills Potion', type:'consumable', color:'#ff6ac8', icon:'🧪', maxStack:30, buff:'gills', t:240, desc:'Breathe underwater.' });
defItem(I.GRAVITATION_POTION, { name:'Gravitation Potion', type:'consumable', color:'#ff6ac8', icon:'🧪', maxStack:30, buff:'gravitation', t:600, desc:'Control gravity.' });
defItem(I.HONEYFIN, { name:'Honeyfin', type:'consumable', color:'#ff6ac8', icon:'🧪', maxStack:30, heal:120, potionCd:60, desc:'Restores 120 health.' });
defItem(I.HUNTER_POTION, { name:'Hunter Potion', type:'consumable', color:'#ff6ac8', icon:'🧪', maxStack:30, buff:'hunter', t:480, desc:'Highlights enemies.' });
defItem(I.JUNGLE_JUICE, { name:'Jungle Juice', type:'consumable', color:'#ff6ac8', icon:'🧪', maxStack:30, heal:80, potionCd:60, desc:'Restores 80 health.' });
defItem(I.LESSER_HEALING_POTION, { name:'Lesser Healing Potion', type:'consumable', color:'#ff6ac8', icon:'🧪', maxStack:30, heal:50, potionCd:60, desc:'Restores 50 health.' });
defItem(I.LESSER_RESTORATION_POTION, { name:'Lesser Restoration Potion', type:'consumable', color:'#ff6ac8', icon:'🧪', maxStack:30, heal:50, potionCd:60, desc:'Restores 50 health and mana.' });
defItem(I.LOVE_POTION, { name:'Love Potion', type:'consumable', color:'#ff6ac8', icon:'🧪', maxStack:30, buff:'love', t:120, desc:'Friendliness.' });
defItem(I.MANA_REGENERATION_POTION, { name:'Mana Regeneration Potion', type:'consumable', color:'#ff6ac8', icon:'🧪', maxStack:30, buff:'manaRegen', t:420, desc:'Faster mana regeneration.' });
defItem(I.NIGHT_OWL_POTION, { name:'Night Owl Potion', type:'consumable', color:'#ff6ac8', icon:'🧪', maxStack:30, buff:'nightOwl', t:240, desc:'Movement speed up for 4 minutes.' });
defItem(I.NIGHT_VISION_POTION, { name:'Night Vision Potion', type:'consumable', color:'#ff6ac8', icon:'🧪', maxStack:30, buff:'nightVision', t:600, desc:'See in the dark.' });
defItem(I.RECALL_POTION, { name:'Recall Potion', type:'consumable', color:'#ff6ac8', icon:'🧪', maxStack:30, recall:true, desc:'Teleport to spawn.' });
defItem(I.RESTORATION_POTION, { name:'Restoration Potion', type:'consumable', color:'#ff6ac8', icon:'🧪', maxStack:30, heal:50, potionCd:60, desc:'Restores 50 health and mana.' });
defItem(I.SHINE_POTION, { name:'Shine Potion', type:'consumable', color:'#ff6ac8', icon:'🧪', maxStack:30, buff:'shine', t:600, desc:'Emit light.' });
defItem(I.SONAR_POTION, { name:'Sonar Potion', type:'consumable', color:'#ff6ac8', icon:'🧪', maxStack:30, buff:'sonar', t:480, desc:'Reveals fishing catches.' });
defItem(I.SPELUNKER_POTION, { name:'Spelunker Potion', type:'consumable', color:'#ff6ac8', icon:'🧪', maxStack:30, buff:'spelunker', t:300, desc:'Highlights treasure.' });
defItem(I.STINK_POTION, { name:'Stink Potion', type:'consumable', color:'#ff6ac8', icon:'🧪', maxStack:30, buff:'stink', t:120, desc:'Ewww.' });
defItem(I.STRANGE_BREW, { name:'Strange Brew', type:'consumable', color:'#ff6ac8', icon:'🧪', maxStack:30, heal:100, potionCd:60, desc:'A mysterious draught.' });
defItem(I.TELEPORTATION_POTION, { name:'Teleportation Potion', type:'consumable', color:'#ff6ac8', icon:'🧪', maxStack:30, teleport:true, desc:'Random teleport.' });
defItem(I.TITAN_POTION, { name:'Titan Potion', type:'consumable', color:'#ff6ac8', icon:'🧪', maxStack:30, buff:'knockbackImmune', t:480, desc:'Increased knockback resistance.' });
defItem(I.WORMHOLE_POTION, { name:'Wormhole Potion', type:'consumable', color:'#ff6ac8', icon:'🧪', maxStack:30, wormhole:true, desc:'Teleport to a teammate.' });

// ---------- Batch 83 blocks & furniture ----------
defItem(I.BED, { name:'Bed', type:'block', tile:T.BED, color:'#c04050', icon:'block', maxStack:999, desc:'Spawn point. Sleep the night away.' });
defItem(I.PIGGY_BANK, { name:'Piggy Bank', type:'block', color:'#f0a0c0', icon:'block', maxStack:999, desc:'Personal storage. Place and right-click.' });
defItem(I.WOODEN_DOOR, { name:'Wooden Door', type:'block', color:'#9a6b3f', icon:'block', maxStack:999, desc:'A door for your town.' });
defItem(I.CLAY, { name:'Clay', type:'block', color:'#b06a4a', icon:'block', maxStack:999, desc:'Soft clay. Kiln into bricks.' });
defItem(I.GRAY_BRICK, { name:'Gray Brick', type:'block', color:'#8a8a92', icon:'block', maxStack:999, desc:'Sturdy stone brick.' });
defItem(I.RED_BRICK, { name:'Red Brick', type:'block', color:'#b0503a', icon:'block', maxStack:999, desc:'Classic red brick.' });
defItem(I.BOTTLE, { name:'Bottle', type:'block', color:'#a8d8f0', icon:'block', maxStack:999, desc:'Crafting material for potions.' });
defItem(I.CLAY_POT, { name:'Clay Pot', type:'block', color:'#b06a3a', icon:'block', maxStack:999, desc:'Sometimes hides treasure.' });
defItem(I.SIGN, { name:'Sign', type:'block', color:'#9a6b3f', icon:'block', maxStack:999, desc:'Leave a message.' });
defItem(I.BOOK, { name:'Book', type:'material', color:'#c84a6a', icon:'block', maxStack:999, desc:'A weighty tome.' });
defItem(I.CHAIN, { name:'Chain', type:'material', color:'#b0b0b8', icon:'block', maxStack:999, desc:'For lanterns and mechanisms.' });
defItem(I.ACORN, { name:'Acorn', type2:'seed', type:'material', color:'#9a7a4a', icon:'block', maxStack:999, desc:'Plant it on grass to grow a tree.' });
defItem(I.CORRUPT_SEEDS, { name:'Corrupt Seeds', type:'material', color:'#7a5a8a', icon:'block', maxStack:999, desc:'Spreads the Corruption on grass.' });
defItem(I.GRASS_SEEDS, { name:'Grass Seeds', type:'material', color:'#4fae40', icon:'block', maxStack:999, desc:'Grows grass on dirt.' });

// ---------- Batch 83 hooks/pets/vanity ----------
defItem(I.AMBER_HOOK, { name:'Amber Hook', type:'hook', hookRange:300, hookSpeed:15, hookPull:12, hookCount:1, color:'#c8b090', icon:'\U0001FA91', maxStack:1, desc:'A grappling hook.' });
defItem(I.BAT_HOOK, { name:'Bat Hook', type:'hook', hookRange:350, hookSpeed:15.5, hookPull:12.5, hookCount:1, color:'#c8b090', icon:'\U0001FA91', maxStack:1, desc:'A grappling hook.' });
defItem(I.SKELETRON_HAND, { name:'Skeletron Hand', type:'hook', hookRange:320, hookSpeed:15, hookPull:12, hookCount:2, color:'#c8b090', icon:'\U0001FA91', maxStack:1, desc:'A grappling hook.' });
defItem(I.SLIME_HOOK, { name:'Slime Hook', type:'hook', hookRange:320, hookSpeed:14, hookPull:12, hookCount:1, color:'#c8b090', icon:'\U0001FA91', maxStack:1, desc:'A grappling hook.' });
defItem(I.SQUIRREL_HOOK, { name:'Squirrel Hook', type:'hook', hookRange:300, hookSpeed:16, hookPull:13, hookCount:1, color:'#c8b090', icon:'\U0001FA91', maxStack:1, desc:'A grappling hook.' });
defItem(I.STATIC_HOOK, { name:'Static Hook', type:'hook', hookRange:450, hookSpeed:18, hookPull:15, hookCount:1, color:'#c8b090', icon:'\U0001FA91', maxStack:1, desc:'A grappling hook.' });
defItem(I.TENDON_HOOK, { name:'Tendon Hook', type:'hook', hookRange:350, hookSpeed:15.5, hookPull:12.5, hookCount:2, color:'#c8b090', icon:'\U0001FA91', maxStack:1, desc:'A grappling hook.' });
defItem(I.THORN_HOOK, { name:'Thorn Hook', type:'hook', hookRange:350, hookSpeed:15.5, hookPull:12.5, hookCount:2, color:'#c8b090', icon:'\U0001FA91', maxStack:1, desc:'A grappling hook.' });
defItem(I.MAGICAL_PUMPKIN_SEED, { name:'Magical Pumpkin Seed', type:'pet', pet:'pumpkinpet', color:'#ff8a3d', maxStack:1, desc:'A friendly companion.' });
defItem(I.PARROT_CRACKER, { name:'Parrot Cracker', type:'pet', pet:'parrot', color:'#e84a3a', maxStack:1, desc:'A friendly companion.' });
defItem(I.UNLUCKY_YARN, { name:'Unlucky Yarn', type:'pet', pet:'yarn', color:'#3a3a4a', maxStack:1, desc:'A friendly companion.' });
defItem(I.SUMMER_HAT, { name:'Summer Hat', type:'armor', slot:'head', def:1, color:'#ffe14d', icon:'👕', maxStack:1, desc:'Defense +1' });
defItem(I.TUXEDO_PANTS, { name:'Tuxedo Pants', type:'armor', slot:'legs', def:2, color:'#ffe14d', icon:'👕', maxStack:1, desc:'Defense +2' });
defItem(I.TUXEDO_SHIRT, { name:'Tuxedo Shirt', type:'armor', slot:'chest', def:2, color:'#ffe14d', icon:'👕', maxStack:1, desc:'Defense +2' });

// ---------- Batch 83 Phase 2 furniture ----------
defItem(I.BATHTUB, { name:'Bathtub', type:'block', tile:T.FURN_BATHTUB, color:'#9a6b3f', icon:'block', maxStack:999, desc:'Wood furniture.' });
defItem(I.BENCH, { name:'Bench', type:'block', tile:T.FURN_BENCH, color:'#9a6b3f', icon:'block', maxStack:999, desc:'Wood furniture.' });
defItem(I.WORK_BENCH, { name:'Work Bench', type:'block', tile:T.FURN_BENCH, color:'#9a6b3f', icon:'block', maxStack:999, desc:'Wood furniture.' });
defItem(I.BOOKCASE, { name:'Bookcase', type:'block', tile:T.FURN_BOOKCASE, color:'#9a6b3f', icon:'block', maxStack:999, desc:'Wood furniture.' });
defItem(I.CANDELABRA, { name:'Candelabra', type:'block', tile:T.FURN_CANDELABRA, color:'#9a6b3f', icon:'block', maxStack:999, desc:'Wood furniture.' });
defItem(I.CANDLE, { name:'Candle', type:'block', tile:T.FURN_CANDLE, color:'#9a6b3f', icon:'block', maxStack:999, desc:'Wood furniture.' });
defItem(I.CRIMTANE_CHEST, { name:'Crimtane Chest', type:'block', tile:T.FURN_CHEST, color:'#9a6b3f', icon:'block', maxStack:999, desc:'Wood furniture.' });
defItem(I.DEMONITE_CHEST, { name:'Demonite Chest', type:'block', tile:T.FURN_CHEST, color:'#9a6b3f', icon:'block', maxStack:999, desc:'Wood furniture.' });
defItem(I.GOLD_CHEST, { name:'Gold Chest', type:'block', tile:T.FURN_CHEST, color:'#ffd75e', icon:'block', maxStack:999, desc:'Gold furniture.' });
defItem(I.HALLOWED_CHEST, { name:'Hallowed Chest', type:'block', tile:T.FURN_CHEST, color:'#9a6b3f', icon:'block', maxStack:999, desc:'Wood furniture.' });
defItem(I.NEBULA_CHEST, { name:'Nebula Chest', type:'block', tile:T.FURN_CHEST, color:'#c85cff', icon:'block', maxStack:999, desc:'Nebula furniture.' });
defItem(I.SOLAR_CHEST, { name:'Solar Chest', type:'block', tile:T.FURN_CHEST, color:'#ff8a3d', icon:'block', maxStack:999, desc:'Solar furniture.' });
defItem(I.STARDUST_CHEST, { name:'Stardust Chest', type:'block', tile:T.FURN_CHEST, color:'#6bc8ff', icon:'block', maxStack:999, desc:'Stardust furniture.' });
defItem(I.VORTEX_CHEST, { name:'Vortex Chest', type:'block', tile:T.FURN_CHEST, color:'#3dff9d', icon:'block', maxStack:999, desc:'Vortex furniture.' });
defItem(I.DRESSER, { name:'Dresser', type:'block', tile:T.FURN_DRESSER, color:'#9a6b3f', icon:'block', maxStack:999, desc:'Wood furniture.' });
defItem(I.FURNACE, { name:'Furnace', type:'block', tile:T.FURN_FURNACE, color:'#9a6b3f', icon:'block', maxStack:999, desc:'Wood furniture.' });
defItem(I.LAMP_POST, { name:'Lamp Post', type:'block', tile:T.FURN_LAMP, color:'#9a6b3f', icon:'block', maxStack:999, desc:'Wood furniture.' });
defItem(I.PIANO, { name:'Piano', type:'block', tile:T.FURN_PIANO, color:'#9a6b3f', icon:'block', maxStack:999, desc:'Wood furniture.' });
defItem(I.SOFA, { name:'Sofa', type:'block', tile:T.FURN_SOFA, color:'#9a6b3f', icon:'block', maxStack:999, desc:'Wood furniture.' });
defItem(I.TOILET, { name:'Toilet', type:'block', tile:T.FURN_TOILET, color:'#9a6b3f', icon:'block', maxStack:999, desc:'Wood furniture.' });

// ---------- Batch 83 Phase 2 walls/blocks/materials ----------
defItem(I.HIVE, { name:'Hive', type:'block', color:'#9a6b3f', icon:'block', maxStack:999, desc:'A placeable block.' });
defItem(I.ADHESIVE_BANDAGE, { name:'Adhesive Bandage', type:'material', color:'#b8b8a0', icon:'\u25C6', maxStack:999, desc:'A crafting material.' });
defItem(I.BEZOAR, { name:'Bezoar', type:'material', color:'#b8b8a0', icon:'\u25C6', maxStack:999, desc:'A crafting material.' });
defItem(I.VERTEBRA, { name:'Vertebra', type:'material', color:'#b8b8a0', icon:'\u25C6', maxStack:999, desc:'A crafting material.' });

// ---------- Batch 83 Phase 2 bulk catalog ----------
defItem(I.AARONS_BREASTPLATE, { name:'Aaron\'s Breastplate', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.AARONS_HELMET, { name:'Aaron\'s Helmet', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.AARONS_LEGGINGS, { name:'Aaron\'s Leggings', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.ABIGAILS_FLOWER, { name:'Abigail\'s Flower', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.ACORNS, { name:'Acorns', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.ACTUATOR, { name:'Actuator', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.ADAMANTITE_CHAINSAW, { name:'Adamantite Chainsaw', type:'tool', power:180, speed:4, range:3.5, axe:180, color:'#b8b8a0', icon:'🪚', maxStack:1, desc:'An adamantite chainsaw for mining and chopping.' });
defItem(I.ADAMANTITE_DRILL, { name:'Adamantite Drill', type:'tool', power:180, speed:4, range:3.5, color:'#b8b8a0', icon:'⛏', maxStack:1, desc:'An adamantite mining drill.' });
defItem(I.ADAMANTITE_HEADGEAR, { name:'Adamantite Headgear', type:'armor', slot:'head', def:28, icon:'A', maxStack:1, desc:'Defense +28' });
defItem(I.ALE, { name:'Ale', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.AMAZON, { name:'Amazon', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.AMETHYST_HOOK, { name:'Amethyst Hook', type:'hook', hookRange:195, hookSpeed:13, hookPull:7, hookCount:1, color:'#b8b8a0', icon:'🪝', maxStack:1, desc:'A gem hook.' });
defItem(I.AMETHYST_ROBE, { name:'Amethyst Robe', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.ANCHOR, { name:'Anchor', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.ANCIENT_COBALT_LEGGINGS, { name:'Ancient Cobalt Leggings', type:'armor', slot:'legs', def:6, icon:'A', maxStack:1, desc:'Defense +6' });
defItem(I.ANCIENT_GOLD_HELMET, { name:'Ancient Gold Helmet', type:'armor', slot:'head', def:4, icon:'A', maxStack:1, desc:'Defense +4' });
defItem(I.ANCIENT_HALLOWED_GREAVES, { name:'Ancient Hallowed Greaves', type:'armor', slot:'legs', def:11, icon:'A', maxStack:1, desc:'Defense +11' });
defItem(I.ANCIENT_HALLOWED_HEADGEAR, { name:'Ancient Hallowed Headgear', type:'armor', slot:'head', def:24, icon:'A', maxStack:1, desc:'Defense +24' });
defItem(I.ANCIENT_HALLOWED_HELMET, { name:'Ancient Hallowed Helmet', type:'armor', slot:'head', def:9, icon:'A', maxStack:1, desc:'Defense +9' });
defItem(I.ANCIENT_HALLOWED_HOOD, { name:'Ancient Hallowed Hood', type:'armor', slot:'head', def:1, icon:'A', maxStack:1, desc:'Defense +1' });
defItem(I.ANCIENT_HALLOWED_PLATE_MAIL, { name:'Ancient Hallowed Plate Mail', type:'armor', slot:'chest', def:20, icon:'A', maxStack:1, desc:'Defense +20' });
defItem(I.ANCIENT_HEADDRESS, { name:'Ancient Headdress', type:'vanity', icon:'V', maxStack:1, desc:'A vanity outfit.' });
defItem(I.ANCIENT_IRON_HELMET, { name:'Ancient Iron Helmet', type:'armor', slot:'head', def:2, icon:'A', maxStack:1, desc:'Defense +2' });
defItem(I.ANCIENT_NECRO_HELMET, { name:'Ancient Necro Helmet', type:'armor', slot:'head', def:6, icon:'A', maxStack:1, desc:'Defense +6' });
defItem(I.ANCIENT_SHADOW_GREAVES, { name:'Ancient Shadow Greaves', type:'armor', slot:'legs', def:6, icon:'A', maxStack:1, desc:'Defense +6' });
defItem(I.ANCIENT_SHADOW_HELMET, { name:'Ancient Shadow Helmet', type:'armor', slot:'head', def:6, icon:'A', maxStack:1, desc:'Defense +6' });
defItem(I.ANGLER_HAT, { name:'Angler Hat', type:'armor', slot:'head', def:1, icon:'A', maxStack:1, desc:'Defense +1' });
defItem(I.ANGLER_PANTS, { name:'Angler Pants', type:'armor', slot:'legs', def:1, icon:'A', maxStack:1, desc:'Defense +1' });
defItem(I.APPLE, { name:'Apple', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.APPRENTICES_HAT, { name:'Apprentice\'s Hat', type:'armor', slot:'head', def:7, icon:'A', maxStack:1, desc:'Defense +7' });
defItem(I.APPRENTICES_ROBE, { name:'Apprentice\'s Robe', type:'armor', slot:'chest', def:15, icon:'A', maxStack:1, desc:'Defense +15' });
defItem(I.APRICOT, { name:'Apricot', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.ARCHAEOLOGISTS_HAT, { name:'Archaeologist\'s Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.ARCHAEOLOGISTS_JACKET, { name:'Archaeologist\'s Jacket', type:'vanity', icon:'V', maxStack:1, desc:'A vanity outfit.' });
defItem(I.ARCHAEOLOGISTS_PANTS, { name:'Archaeologist\'s Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.ARKHALIS, { name:'Arkhalis', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.ARKHALIS_HOOD, { name:'Arkhalis\' Hood', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.ARTERY, { name:'Artery', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.ASH_WOOD_BREASTPLATE, { name:'Ash Wood Breastplate', type:'armor', slot:'chest', def:3, icon:'A', maxStack:1, desc:'Defense +3' });
defItem(I.ASH_WOOD_GREAVES, { name:'Ash Wood Greaves', type:'armor', slot:'legs', def:2, icon:'A', maxStack:1, desc:'Defense +2' });
defItem(I.ASH_WOOD_HELMET, { name:'Ash Wood Helmet', type:'armor', slot:'head', def:2, icon:'A', maxStack:1, desc:'Defense +2' });
defItem(I.AUTOHAMMER, { name:'Autohammer', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.AXEARANG, { name:'Axearang', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.BACON, { name:'Bacon', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.BADGERS_HAT, { name:'Badger\'s Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.BALL_O_HURT, { name:'Ball O\' Hurt', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.BALLA_HAT, { name:'Balla Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.BAMBOO, { name:'Bamboo', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.BANANA, { name:'Banana', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.BAR, { name:'Bar', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.BARREL, { name:'Barrel', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.BEANIE, { name:'Beanie', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.BEE_HAT, { name:'Bee Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.BEE_PANTS, { name:'Bee Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.BEE_SHIRT, { name:'Bee Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.BEE_WINGS, { name:'Bee Wings', type:'accessory', jumpMul:1.0, jumps:2, noFall:true, color:'#e8c840', icon:'🐝', maxStack:1, desc:'Buzzing wings of a giant bee.' });
defItem(I.BELL, { name:'Bell', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.BETSYS_WINGS, { name:'Betsy\'s Wings', type:'accessory', jumpMul:1.2, jumps:4, noFall:true, color:'#c85050', icon:'🐉', maxStack:1, desc:'Mighty wings of the Flying Dragon Betsy.' });
defItem(I.BIFROST, { name:'Bifrost', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.BINOCULARS, { name:'Binoculars', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.BIOLUMINESCENCE, { name:'Bioluminescence', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.BIOME_SIGHT_POTION, { name:'Biome Sight Potion', type:'consumable', buff:{t:300, biomeSight:true}, color:'#6bff4d', icon:'🧪', maxStack:30, desc:'Highlights biome tiles for 5 minutes.' });
defItem(I.BIRD, { name:'Bird', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.BLACKCURRANT, { name:'Blackcurrant', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.BLINDFOLD, { name:'Blindfold', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.BLINKROOT, { name:'Blinkroot', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.BOMB, { name:'Bomb', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.BONE_HELM, { name:'Bone Helm', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.BOREAL_WOOD_BREASTPLATE, { name:'Boreal Wood Breastplate', type:'armor', slot:'chest', def:1, icon:'A', maxStack:1, desc:'Defense +1' });
defItem(I.BOREAL_WOOD_GREAVES, { name:'Boreal Wood Greaves', type:'armor', slot:'legs', def:1, icon:'A', maxStack:1, desc:'Defense +1' });
defItem(I.BOREAL_WOOD_HELMET, { name:'Boreal Wood Helmet', type:'armor', slot:'head', def:1, icon:'A', maxStack:1, desc:'Defense +1' });
defItem(I.BOULDER, { name:'Boulder', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.BOW_TOPPER, { name:'Bow Topper', type:'melee', dmg:10, speed:0.25, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.BOWL, { name:'Bowl', type:'melee', dmg:10, speed:0.25, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.BOWLOF_SOUP, { name:'Bowl of Soup', type:'melee', dmg:10, speed:0.283, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.BRIDEOF_FRANKENSTEIN_DRESS, { name:'Bride of Frankenstein Dress', type:'vanity', icon:'V', maxStack:1, desc:'A vanity outfit.' });
defItem(I.BUBBLE, { name:'Bubble', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.BUDDIES, { name:'Buddies', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.BUGGY, { name:'Buggy', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.BUILDER_POTION, { name:'Builder Potion', type:'consumable', buff:{t:300, builder:true}, color:'#a0c8ff', icon:'🧪', maxStack:30, desc:'Increased building speed for 5 minutes.' });
defItem(I.BUNNY, { name:'Bunny', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.BUNNY_CANNON, { name:'Bunny Cannon', type:'melee', dmg:10, speed:0.25, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.BUNNY_HOOD, { name:'Bunny Hood', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.BUNNYFISH, { name:'Bunnyfish', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.BUTCHERS_BLOODSTAINED_PANTS, { name:'Butcher\'s Bloodstained Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.BUTCHERS_CHAINSAW, { name:'Butcher\'s Chainsaw', type:'tool', power:200, speed:3, range:3.5, axe:200, color:'#b84840', icon:'🪚', maxStack:1, desc:'A savage chainsaw dropped by Butchers during a Solar Eclipse.' });
defItem(I.CACTUS, { name:'Cactus', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.CACTUS_BREASTPLATE, { name:'Cactus Breastplate', type:'armor', slot:'chest', def:1, icon:'A', maxStack:1, desc:'Defense +1' });
defItem(I.CACTUS_HELMET, { name:'Cactus Helmet', type:'armor', slot:'head', def:1, icon:'A', maxStack:1, desc:'Defense +1' });
defItem(I.CACTUS_LEGGINGS, { name:'Cactus Leggings', type:'armor', slot:'legs', def:1, icon:'A', maxStack:1, desc:'Defense +1' });
defItem(I.CANDY_CANE_HOOK, { name:'Candy Cane Hook', type:'hook', hookRange:255, hookSpeed:17, hookPull:9, hookCount:1, color:'#e84040', icon:'🪝', maxStack:1, desc:'A festive hook.' });
defItem(I.CANNON, { name:'Cannon', type:'melee', dmg:10, speed:0.25, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.CANNONBALL, { name:'Cannonball', type:'melee', dmg:10, speed:0.25, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.CAPRICORN_CHESTPLATE, { name:'Capricorn Chestplate', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.CAPRICORN_HELMET, { name:'Capricorn Helmet', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.CAPTAIN_HAT, { name:'Captain Hat', type:'armor', slot:'head', def:10, icon:'A', maxStack:1, desc:'Defense +10' });
defItem(I.CAPTAIN_PANTS, { name:'Captain Pants', type:'armor', slot:'legs', def:11, icon:'A', maxStack:1, desc:'Defense +11' });
defItem(I.CARDINAL, { name:'Cardinal', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.CARROT, { name:'Carrot', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.CASCADE, { name:'Cascade', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.CAT_PANTS, { name:'Cat Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.CAT_SHIRT, { name:'Cat Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.CAT_SWORD, { name:'Cat Sword', type:'melee', dmg:10, speed:0.25, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.CAULDRON, { name:'Cauldron', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.CENXS_BREASTPLATE, { name:'Cenx\'s Breastplate', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.CENXS_DRESS, { name:'Cenx\'s Dress', type:'vanity', icon:'V', maxStack:1, desc:'A vanity outfit.' });
defItem(I.CENXS_DRESS_PANTS, { name:'Cenx\'s Dress Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.CENXS_LEGGINGS, { name:'Cenx\'s Leggings', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.CHAIN_KNIFE, { name:'Chain Knife', type:'melee', dmg:12, speed:0.333, kb:3.5, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.CHALICE, { name:'Chalice', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.CHEF_HAT, { name:'Chef Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.CHEF_PANTS, { name:'Chef Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.CHERRY, { name:'Cherry', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.CHICKEN_BONES_PANTS, { name:'Chicken Bones\' Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.CHICKEN_BONES_ROBE, { name:'Chicken Bones\' Robe', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.CHIK, { name:'Chik', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.CHILLET, { name:'Chillet', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.CHIPPYS_GREAVES, { name:'Chippy\'s Greaves', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.CHIPPYS_HELMET, { name:'Chippy\'s Helmet', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.CHLOROPHYTE_CHAINSAW, { name:'Chlorophyte Chainsaw', type:'tool', power:200, speed:4, range:4, axe:200, color:'#28a858', icon:'🪚', maxStack:1, desc:'A chlorophyte chainsaw for mining and chopping.' });
defItem(I.CHLOROPHYTE_DRILL, { name:'Chlorophyte Drill', type:'tool', power:200, speed:4, range:4, color:'#28a858', icon:'⛏', maxStack:1, desc:'A chlorophyte mining drill.' });
defItem(I.CHLOROPHYTE_PLATE_MAIL, { name:'Chlorophyte Plate Mail', type:'armor', slot:'chest', def:34, icon:'A', maxStack:1, desc:'Defense +34' });
defItem(I.CLENTAMINATOR, { name:'Clentaminator', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.CLOTHIERS_PANTS, { name:'Clothier\'s Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.CLOWN_HAT, { name:'Clown Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.CLOWN_PANTS, { name:'Clown Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.CLOWN_SHIRT, { name:'Clown Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.COBALT_CHAINSAW, { name:'Cobalt Chainsaw', type:'tool', power:110, speed:4, range:3, axe:110, color:'#2878c8', icon:'🪚', maxStack:1, desc:'A cobalt chainsaw for mining and chopping.' });
defItem(I.COBALT_DRILL, { name:'Cobalt Drill', type:'tool', power:110, speed:4, range:3, color:'#2878c8', icon:'⛏', maxStack:1, desc:'A cobalt mining drill.' });
defItem(I.COBALT_HAT, { name:'Cobalt Hat', type:'armor', slot:'head', def:3, icon:'A', maxStack:1, desc:'Defense +3' });
defItem(I.COCONUT, { name:'Coconut', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.COFFEE, { name:'Coffee', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.COG, { name:'Cog', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.CONFETTI, { name:'Confetti', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.CONFETTI_CANNON, { name:'Confetti Cannon', type:'melee', dmg:10, speed:0.25, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.CONFETTI_GUN, { name:'Confetti Gun', type:'ranged', dmg:0, speed:0.25, kb:4, range:4, auto:true, ammo:I.ARROW, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.CONSTELLATION, { name:'Constellation', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.COPPER_PLATING_WALL, { name:'Copper Plating Wall', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.CORAL, { name:'Coral', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.COWBOY_HAT, { name:'Cowboy Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.COWBOY_PANTS, { name:'Cowboy Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.CREEPER_PANTS, { name:'Creeper Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.CREEPER_SHIRT, { name:'Creeper Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.CROWNOS_BREASTPLATE, { name:'Crowno\'s Breastplate', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.CROWNOS_LEGGINGS, { name:'Crowno\'s Leggings', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.CRUSTOGRAPHY, { name:'Crustography', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.CRYSTAL_ASSASSIN_HOOD, { name:'Crystal Assassin Hood', type:'armor', slot:'head', def:12, icon:'A', maxStack:1, desc:'Defense +12' });
defItem(I.CRYSTAL_ASSASSIN_PANTS, { name:'Crystal Assassin Pants', type:'armor', slot:'legs', def:10, icon:'A', maxStack:1, desc:'Defense +10' });
defItem(I.CRYSTAL_ASSASSIN_SHIRT, { name:'Crystal Assassin Shirt', type:'armor', slot:'chest', def:14, icon:'A', maxStack:1, desc:'Defense +14' });
defItem(I.CRYSTALLIZE, { name:'Crystallize', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.CYBORG_HELMET, { name:'Cyborg Helmet', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.CYBORG_PANTS, { name:'Cyborg Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.CYBORG_SHIRT, { name:'Cyborg Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.D_TOWNS_BREASTPLATE, { name:'D-Town\'s Breastplate', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.D_TOWNS_HELMET, { name:'D-Town\'s Helmet', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.D_TOWNS_LEGGINGS, { name:'D-Town\'s Leggings', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.DAMSELFISH, { name:'Damselfish', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.DANGERSENSE_POTION, { name:'Dangersense Potion', type:'consumable', buff:{t:300, dangersense:true}, color:'#ff4d4d', icon:'🧪', maxStack:30, desc:'Highlights traps and danger for 5 minutes.' });
defItem(I.DARK_ARTISTS_HAT, { name:'Dark Artist\'s Hat', type:'armor', slot:'head', def:7, icon:'A', maxStack:1, desc:'Defense +7' });
defItem(I.DARK_ARTISTS_LEGGINGS, { name:'Dark Artist\'s Leggings', type:'armor', slot:'legs', def:14, icon:'A', maxStack:1, desc:'Defense +14' });
defItem(I.DARK_ARTISTS_ROBES, { name:'Dark Artist\'s Robes', type:'armor', slot:'chest', def:21, icon:'A', maxStack:1, desc:'Defense +21' });
defItem(I.DARKNESS, { name:'Darkness', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.DAYBREAK, { name:'Daybreak', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.DAYLIGHT, { name:'Daylight', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.DEACTIVATED_PROBE, { name:'Deactivated Probe', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.DEATHWEED, { name:'Deathweed', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.DECORATIVE_HEALING_POTION, { name:'Decorative Healing Potion', type:'consumable', heal:50, color:'#ff5c8a', icon:'🧪', maxStack:30, desc:'Restores 50 health.' });
defItem(I.DECORATIVE_MANA_POTION, { name:'Decorative Mana Potion', type:'consumable', mana:50, color:'#6bc8ff', icon:'🧪', maxStack:30, desc:'Restores 50 mana.' });
defItem(I.DEFENDER_MEDAL, { name:'Defender Medal', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.DETONATOR, { name:'Detonator', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.DIAMOND_HOOK, { name:'Diamond Hook', type:'hook', hookRange:270, hookSpeed:18, hookPull:9, hookCount:1, color:'#e8e8f0', icon:'🪝', maxStack:1, desc:'A gem hook.' });
defItem(I.DIAMOND_ROBE, { name:'Diamond Robe', type:'armor', slot:'chest', def:3, icon:'A', maxStack:1, desc:'Defense +3' });
defItem(I.DIGTOISE, { name:'Digtoise', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.DISCOVER, { name:'Discover', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.DIVING_HELMET, { name:'Diving Helmet', type:'armor', slot:'head', def:2, icon:'A', maxStack:1, desc:'Defense +2' });
defItem(I.DRILL_CONTAINMENT_UNIT, { name:'Drill Containment Unit', type:'tool', power:220, speed:5, range:5, axe:220, color:'#a868c8', icon:'⛏', maxStack:1, desc:'A supreme mining drill that excavates vast areas.' });
defItem(I.DRUMSTICK, { name:'Drumstick', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.DRYADISQUE, { name:'Dryadisque', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.DUALITY, { name:'Duality', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.DUCK, { name:'Duck', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.DUNERIDER_BOOTS, { name:'Dunerider Boots', type:'accessory', color:'#d8c870', icon:'👟', maxStack:1, runSpeed:1.4, desc:'Increases running speed on sand.' });
defItem(I.DYE_TRADER_ROBE, { name:'Dye Trader Robe', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.DYNAMITE, { name:'Dynamite', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.DYNASTY_BOWL, { name:'Dynasty Bowl', type:'melee', dmg:10, speed:0.25, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.EBONWOOD, { name:'Ebonwood', type:'block', icon:'block', maxStack:999, desc:'A placeable block.' });
defItem(I.EBONWOOD_BREASTPLATE, { name:'Ebonwood Breastplate', type:'armor', slot:'chest', def:2, icon:'A', maxStack:1, desc:'Defense +2' });
defItem(I.EBONWOOD_GREAVES, { name:'Ebonwood Greaves', type:'armor', slot:'legs', def:1, icon:'A', maxStack:1, desc:'Defense +1' });
defItem(I.EBONWOOD_HELMET, { name:'Ebonwood Helmet', type:'armor', slot:'head', def:1, icon:'A', maxStack:1, desc:'Defense +1' });
defItem(I.ELDERBERRY, { name:'Elderberry', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.ELF_HAT, { name:'Elf Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.ELF_PANTS, { name:'Elf Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.ELF_SHIRT, { name:'Elf Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.EMERALD_HOOK, { name:'Emerald Hook', type:'hook', hookRange:240, hookSpeed:16, hookPull:8, hookCount:1, color:'#50c878', icon:'🪝', maxStack:1, desc:'A gem hook.' });
defItem(I.EMERALD_ROBE, { name:'Emerald Robe', type:'armor', slot:'chest', def:2, icon:'A', maxStack:1, desc:'Defense +2' });
defItem(I.EMPRESS_WINGS, { name:'Empress Wings', type:'accessory', jumpMul:1.25, jumps:4, noFall:true, color:'#ffb8e0', icon:'✨', maxStack:1, desc:'Radiant wings of the Empress of Light.' });
defItem(I.ENCHANTED_BOOMERANG, { name:'Enchanted Boomerang', type:'melee', dmg:17, speed:0.333, kb:8, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.ENGINEERING_HELMET, { name:'Engineering Helmet', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.ESCARGOT, { name:'Escargot', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.ETERNIA_CRYSTAL, { name:'Eternia Crystal', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.ETERNIA_CRYSTAL_STAND, { name:'Eternia Crystal Stand', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.ETHERIAN_MANA, { name:'Etherian Mana', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.EXPLOSIVES, { name:'Explosives', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.EXTRACTINATOR, { name:'Extractinator', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.EYEBRELLA, { name:'Eyebrella', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.EYEZORHEAD, { name:'Eyezorhead', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.FAECORN, { name:'Faecorn', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.FAELING, { name:'Faeling', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.FAIRY_BOOTS, { name:'Fairy Boots', type:'accessory', color:'#ff9adc', icon:'👟', maxStack:1, runSpeed:1.3, desc:'Increases running speed.' });
defItem(I.FALLEN_TUXEDO_PANTS, { name:'Fallen Tuxedo Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.FALLEN_TUXEDO_SHIRT, { name:'Fallen Tuxedo Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.FAMILIAR_PANTS, { name:'Familiar Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.FAMILIAR_SHIRT, { name:'Familiar Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.FANGS, { name:'Fangs', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.FEDORA, { name:'Fedora', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.FERTILIZER, { name:'Fertilizer', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.FESTIVE_WINGS, { name:'Festive Wings', type:'accessory', jumpMul:1.15, jumps:3, noFall:true, color:'#e84040', icon:'🎄', maxStack:1, desc:'Jolly wings adorned with holiday spirit.' });
defItem(I.FEYWOOD, { name:'Feywood', type:'block', icon:'block', maxStack:999, desc:'A placeable block.' });
defItem(I.FEZ, { name:'Fez', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.FIN_WINGS, { name:'Fin Wings', type:'accessory', jumpMul:1.05, jumps:2, noFall:true, color:'#5ac8ff', icon:'🐟', maxStack:1, desc:'Aquatic fins repurposed as wings.' });
defItem(I.FIREBLOSSOM, { name:'Fireblossom', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.FIREFLY, { name:'Firefly', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.FISH, { name:'Fish', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.FISH_BOWL, { name:'Fish Bowl', type:'melee', dmg:10, speed:0.25, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.FISH_COSTUME_FINSKIRT, { name:'Fish Costume Finskirt', type:'vanity', icon:'V', maxStack:1, desc:'A vanity outfit.' });
defItem(I.FISH_COSTUME_SHIRT, { name:'Fish Costume Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.FISH_HOOK, { name:'Fish Hook', type:'hook', hookRange:255, hookSpeed:17, hookPull:9, hookCount:1, color:'#7ab8d8', icon:'🪝', maxStack:1, desc:'A hook shaped like a fish.' });
defItem(I.FISHERMANS_POCKET_GUIDE, { name:'Fisherman\'s Pocket Guide', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.FISHRON, { name:'Fishron', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.FLAIROON, { name:'Flairoon', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.FLAMARANG, { name:'Flamarang', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.FLARE_GUN, { name:'Flare Gun', type:'melee', dmg:2, speed:0.3, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.FLEDGLING_WINGS, { name:'Fledgling Wings', type:'accessory', jumpMul:1.0, jumps:2, noFall:true, color:'#c8b890', icon:'🪽', maxStack:1, desc:'Small wings for a fledgling flyer.' });
defItem(I.FLESHCATCHER, { name:'Fleshcatcher', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.FLINT, { name:'Flint', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.FLIPPER, { name:'Flipper', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.FLORET_PROTECTOR_HELMET, { name:'Floret Protector Helmet', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.FLORET_PROTECTOR_PANTS, { name:'Floret Protector Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.FLORET_PROTECTOR_SHIRT, { name:'Floret Protector Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.FLURRY_BOOTS, { name:'Flurry Boots', type:'accessory', color:'#9adcff', icon:'👟', maxStack:1, runSpeed:1.3, desc:'Increases running speed.' });
defItem(I.FOOD_BARBARIANS_HORNED_HELM, { name:'FoodBarbarian\'s Horned Helm', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.FOOD_BARBARIANS_SAVAGE_GREAVES, { name:'FoodBarbarian\'s Savage Greaves', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.FOOTBALL, { name:'Football', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.FORBIDDEN_ROBES, { name:'Forbidden Robes', type:'armor', slot:'chest', def:12, icon:'A', maxStack:1, desc:'Defense +12' });
defItem(I.FORE, { name:'Fore!', type:'block', icon:'block', maxStack:999, desc:'A placeable block.' });
defItem(I.FOX_PANTS, { name:'Fox Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.FOX_SHIRT, { name:'Fox Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.FRIENDLY_RAINBOW_BOULDER, { name:'Friendly Rainbow Boulder', type:'melee', dmg:0, speed:0.333, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.FRIES, { name:'Fries', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.FROG, { name:'Frog', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.FROZEN_WINGS, { name:'Frozen Wings', type:'accessory', jumpMul:1.1, jumps:3, noFall:true, color:'#a8d8ff', icon:'❄️', maxStack:1, desc:'Wings encased in shimmering ice.' });
defItem(I.FUNERAL_HAT, { name:'Funeral Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.FUNERAL_PANTS, { name:'Funeral Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.GANGSTA_HAT, { name:'Gangsta Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.GARLAND, { name:'Garland', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.GENDER_CHANGE_POTION, { name:'Gender Change Potion', type:'consumable', buff:{t:60, genderChange:true}, color:'#ffa0c8', icon:'🧪', maxStack:30, desc:'Changes your character appearance.' });
defItem(I.GEODE, { name:'Geode', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.GEYSER, { name:'Geyser', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.GHOST_SHIRT, { name:'Ghost Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.GI, { name:'Gi', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.GIANT_BOW, { name:'Giant Bow', type:'melee', dmg:10, speed:0.417, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.GLADIUS, { name:'Gladius', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.GLASS_BOWL, { name:'Glass Bowl', type:'melee', dmg:10, speed:0.25, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.GLOWSTICK, { name:'Glowstick', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.GOGGLES, { name:'Goggles', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.GOLD_FISH_BOWL, { name:'Gold Fish Bowl', type:'melee', dmg:10, speed:0.25, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.GOLD_SHORTSWORD, { name:'Gold Shortsword', type:'melee', shortSword:true, dmg:12, speed:0.183, kb:5, range:2.5, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.GOLDFISH, { name:'Goldfish', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.GRAPEFRUIT, { name:'Grapefruit', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.GRAPES, { name:'Grapes', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.GRASSHOPPER, { name:'Grasshopper', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.GRATE, { name:'Grate', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.GRAVEDIGGER_HAT, { name:'Gravedigger Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.GRAVEDIGGERS_SHOVEL, { name:'Gravedigger\'s Shovel', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.GRAVEYARD, { name:'Graveyard', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.GREATER_LUCK_POTION, { name:'Greater Luck Potion', type:'consumable', buff:{t:300, luck:0.15}, color:'#c8ff4d', icon:'🧪', maxStack:30, desc:'+15% luck for 5 minutes.' });
defItem(I.GREBE, { name:'Grebe', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.GROX_THE_GREATS_GREAVES, { name:'Grox The Great\'s Greaves', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.GRUBBY, { name:'Grubby', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.HALLOWED_GREAVES, { name:'Hallowed Greaves', type:'armor', slot:'legs', def:11, icon:'A', maxStack:1, desc:'Defense +11' });
defItem(I.HALLOWED_HOOD, { name:'Hallowed Hood', type:'armor', slot:'head', def:1, icon:'A', maxStack:1, desc:'Defense +1' });
defItem(I.HAT_RACK, { name:'Hat Rack', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.HEARTLANDS, { name:'Heartlands', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.HEARTREACH_POTION, { name:'Heartreach Potion', type:'consumable', buff:{t:300, heartreach:true}, color:'#ff4d8a', icon:'🧪', maxStack:30, desc:'Enemies drop hearts more often for 5 minutes.' });
defItem(I.HELMET_RACK, { name:'Helmet Rack', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.HEMOPIRANHA, { name:'Hemopiranha', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.HEROS_HAT, { name:'Hero\'s Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.HEROS_PANTS, { name:'Hero\'s Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.HEROS_SHIRT, { name:'Hero\'s Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.HEROICIS_HAT, { name:'Heroicis\' Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.HEROICIS_PANTS, { name:'Heroicis\' Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.HOLLY, { name:'Holly', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.HOOK, { name:'Hook', type:'hook', hookRange:180, hookSpeed:12, hookPull:6, hookCount:1, color:'#c0c0c0', icon:'🪝', maxStack:1, desc:'A basic grappling hook.' });
defItem(I.HOOKOF_DISSONANCE, { name:'Hook of Dissonance', type:'hook', hookRange:270, hookSpeed:20, hookPull:9, hookCount:1, color:'#c850c8', icon:'🪝', maxStack:1, desc:'A mysterious hook.' });
defItem(I.HOTDOG, { name:'Hotdog', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.HUNTRESSS_PANTS, { name:'Huntress\'s Pants', type:'armor', slot:'legs', def:12, icon:'A', maxStack:1, desc:'Defense +12' });
defItem(I.ICE_BOOMERANG, { name:'Ice Boomerang', type:'melee', dmg:21, speed:0.333, kb:8.5, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.ILLUMINANT_HOOK, { name:'Illuminant Hook', type:'hook', hookRange:270, hookSpeed:18, hookPull:9, hookCount:1, color:'#e060e0', icon:'🪝', maxStack:1, desc:'A glowing hook.' });
defItem(I.IMPACT, { name:'Impact', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.INTENSE_RAINBOW_DYE, { name:'Intense Rainbow Dye', type:'melee', dmg:10, speed:0.417, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.INVISIBILITY_POTION, { name:'Invisibility Potion', type:'consumable', buff:{t:300, invisibility:true}, color:'#c8c8ff', icon:'🧪', maxStack:30, desc:'Become invisible for 5 minutes.' });
defItem(I.IRON_SHORTSWORD, { name:'Iron Shortsword', type:'melee', shortSword:true, dmg:8, speed:0.2, kb:4, range:2.5, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.IVY, { name:'Ivy', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.JESTERS_ARROW, { name:'Jester\'s Arrow', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.JETPACK, { name:'Jetpack', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.JIMS_BREASTPLATE, { name:'Jim\'s Breastplate', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.JIMS_HELMET, { name:'Jim\'s Helmet', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.JIMS_LEGGINGS, { name:'Jim\'s Leggings', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.KAGUYA, { name:'Kaguya', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.KARATE_TORTOISE_PANTS, { name:'Karate Tortoise Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.KARATE_TORTOISE_SHIRT, { name:'Karate Tortoise Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.KAZZYMODUS_HOOD, { name:'Kazzymodus\' Hood', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.KAZZYMODUS_LEGGINGS, { name:'Kazzymodus\' Leggings', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.KEG, { name:'Keg', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.KIMONO, { name:'Kimono', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.LADYBUG, { name:'Ladybug', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.LAND, { name:'Land', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.LAVA_SERPENT_BOWL, { name:'Lava Serpent Bowl', type:'melee', dmg:10, speed:0.25, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.LAVAFLY, { name:'Lavafly', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.LAVAPROOF_FISHING_HOOK, { name:'Lavaproof Fishing Hook', type:'accessory', lavaFish:true, color:'#ff5a3c', icon:'🎣', maxStack:1, desc:'Lets you fish in lava.' });
defItem(I.LEAD_SHORTSWORD, { name:'Lead Shortsword', type:'melee', shortSword:true, dmg:9, speed:0.2, kb:4, range:2.5, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.LEINFORS_FANCYPANTS, { name:'Leinfors\' Fancypants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.LEMON, { name:'Lemon', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.LEMONADE, { name:'Lemonade', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.LEPRECHAUN_HAT, { name:'Leprechaun Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.LEPRECHAUN_PANTS, { name:'Leprechaun Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.LEPRECHAUN_SHIRT, { name:'Leprechaun Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.LESSER_LUCK_POTION, { name:'Lesser Luck Potion', type:'consumable', buff:{t:180, luck:0.05}, color:'#a0ff6a', icon:'🧪', maxStack:30, desc:'+5% luck for 3 minutes.' });
defItem(I.LESSER_MANA_POTION, { name:'Lesser Mana Potion', type:'consumable', mana:50, color:'#6bc8ff', icon:'🫗', maxStack:30, desc:'Restores 50 mana.' });
defItem(I.LEVER, { name:'Lever', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.LILAC_DUSK_DRESS, { name:'Lilac Dusk Dress', type:'vanity', icon:'V', maxStack:1, desc:'A vanity outfit.' });
defItem(I.LIVING_RAINBOW_DYE, { name:'Living Rainbow Dye', type:'melee', dmg:10, speed:0.417, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.LOKIS_BREASTPLATE, { name:'Loki\'s Breastplate', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.LOKIS_GREAVES, { name:'Loki\'s Greaves', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.LOKIS_HELMET, { name:'Loki\'s Helmet', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.LOOM, { name:'Loom', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.LUCK_POTION, { name:'Luck Potion', type:'consumable', buff:{t:300, luck:0.1}, color:'#a0ff4d', icon:'🧪', maxStack:30, desc:'+10% luck for 5 minutes.' });
defItem(I.LUNAS_RUNIC_PIXIE_HOOD, { name:'Luna\'s Runic Pixie Hood', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.LUNAS_RUNIC_PIXIE_PANTS, { name:'Luna\'s Runic Pixie Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.LUNAS_RUNIC_PIXIE_SHIRT, { name:'Luna\'s Runic Pixie Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.LUNAR_CULTIST_HOOD, { name:'Lunar Cultist Hood', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.LUNAR_CULTIST_ROBE, { name:'Lunar Cultist Robe', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.MACE, { name:'Mace', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.MAGGOT, { name:'Maggot', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.MAGIC_HAT, { name:'Magic Hat', type:'armor', slot:'head', def:2, icon:'A', maxStack:1, desc:'Defense +2' });
defItem(I.MAGIC_YOYO_BAG, { name:'Magic Yoyo Bag', type:'melee', dmg:10, speed:0.417, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.MAGILUMINESCENCE, { name:'Magiluminescence', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.MAID_DRESS, { name:'Maid Dress', type:'vanity', icon:'V', maxStack:1, desc:'A vanity outfit.' });
defItem(I.MALAISE, { name:'Malaise', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.MANGO, { name:'Mango', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.MARSHMALLOW, { name:'Marshmallow', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.MARTIAN_CONDUIT_PLATING, { name:'Martian Conduit Plating', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.MARTIAN_COSTUME_PANTS, { name:'Martian Costume Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.MARTIAN_COSTUME_SHIRT, { name:'Martian Costume Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.MARTIAN_UNIFORM_HELMET, { name:'Martian Uniform Helmet', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.MARTIAN_UNIFORM_PANTS, { name:'Martian Uniform Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.MASTER_GAMERS_PANTS, { name:'Master Gamer\'s Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.MEGAPHONE, { name:'Megaphone', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.MIDNIGHT_RAINBOW_DYE, { name:'Midnight Rainbow Dye', type:'melee', dmg:10, speed:0.417, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.MILKSHAKE, { name:'Milkshake', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.MINECARP, { name:'Minecarp', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.MINECART, { name:'Minecart', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.MINING_HELMET, { name:'Mining Helmet', type:'armor', slot:'head', def:2, icon:'A', maxStack:1, desc:'Defense +2' });
defItem(I.MINING_PANTS, { name:'Mining Pants', type:'armor', slot:'legs', def:1, icon:'A', maxStack:1, desc:'Defense +1' });
defItem(I.MINING_SHIRT, { name:'Mining Shirt', type:'armor', slot:'chest', def:1, icon:'A', maxStack:1, desc:'Defense +1' });
defItem(I.MONKS_PANTS, { name:'Monk\'s Pants', type:'armor', slot:'legs', def:16, icon:'A', maxStack:1, desc:'Defense +16' });
defItem(I.MONKS_SHIRT, { name:'Monk\'s Shirt', type:'armor', slot:'chest', def:22, icon:'A', maxStack:1, desc:'Defense +22' });
defItem(I.MOONGLOW, { name:'Moonglow', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.MOUSE, { name:'Mouse', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.MRS_CLAUS_HAT, { name:'Mrs. Claus Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.MRS_CLAUS_SHIRT, { name:'Mrs. Claus Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.MUG, { name:'Mug', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.MUMMY_PANTS, { name:'Mummy Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.MUMMY_SHIRT, { name:'Mummy Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.MUSHROOM_HAT, { name:'Mushroom Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.MUSHROOM_PANTS, { name:'Mushroom Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.MYSTERIOUS_CAPE, { name:'Mysterious Cape', type:'vanity', icon:'V', maxStack:1, desc:'A vanity outfit.' });
defItem(I.MYSTIC_ROBE, { name:'Mystic Robe', type:'armor', slot:'chest', def:2, icon:'A', maxStack:1, desc:'Defense +2' });
defItem(I.MYTHRIL_CHAINMAIL, { name:'Mythril Chainmail', type:'armor', slot:'chest', def:12, icon:'A', maxStack:1, desc:'Defense +12' });
defItem(I.MYTHRIL_CHAINSAW, { name:'Mythril Chainsaw', type:'tool', power:150, speed:4, range:3.5, axe:150, color:'#78d8b0', icon:'🪚', maxStack:1, desc:'A mythril chainsaw for mining and chopping.' });
defItem(I.MYTHRIL_DRILL, { name:'Mythril Drill', type:'tool', power:150, speed:4, range:3.5, color:'#78d8b0', icon:'⛏', maxStack:1, desc:'A mythril mining drill.' });
defItem(I.MYTHRIL_GREAVES, { name:'Mythril Greaves', type:'armor', slot:'legs', def:9, icon:'A', maxStack:1, desc:'Defense +9' });
defItem(I.MYTHRIL_HAT, { name:'Mythril Hat', type:'armor', slot:'head', def:6, icon:'A', maxStack:1, desc:'Defense +6' });
defItem(I.MYTHRIL_HOOD, { name:'Mythril Hood', type:'armor', slot:'head', def:3, icon:'A', maxStack:1, desc:'Defense +3' });
defItem(I.NACHOS, { name:'Nachos', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.NANITES, { name:'Nanites', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.NAZAR, { name:'Nazar', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.NEBULA_CHAINSAW, { name:'Nebula Chainsaw', type:'tool', power:220, speed:5, range:5, axe:220, color:'#c868d8', icon:'🪚', maxStack:1, desc:'A luminite nebula chainsaw for mining and chopping.' });
defItem(I.NEBULA_DRILL, { name:'Nebula Drill', type:'tool', power:220, speed:5, range:5, color:'#c868d8', icon:'⛏', maxStack:1, desc:'A luminite nebula mining drill.' });
defItem(I.NECTAR, { name:'Nectar', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.NEPTUNES_SHELL, { name:'Neptune\'s Shell', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.NEVERMORE, { name:'Nevermore', type:'block', icon:'block', maxStack:999, desc:'A placeable block.' });
defItem(I.NIGHT_VISION_HELMET, { name:'Night Vision Helmet', type:'armor', slot:'head', def:4, icon:'A', maxStack:1, desc:'Defense +4' });
defItem(I.NIGHTS_EDGE, { name:'Night\'s Edge', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.NURSE_HAT, { name:'Nurse Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.NURSE_PANTS, { name:'Nurse Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.NURSE_SHIRT, { name:'Nurse Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.OASIS, { name:'Oasis', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.OBSIDIAN_SWORDFISH, { name:'Obsidian Swordfish', type:'melee', dmg:70, speed:0.333, kb:6.5, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.OBSIDIAN_WATER_WALKING_BOOTS, { name:'Obsidian Water Walking Boots', type:'accessory', color:'#584858', icon:'👟', maxStack:1, waterWalk:true, lavaImmune:true, desc:'Walk on water and lava.' });
defItem(I.OBSIDIFISH, { name:'Obsidifish', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.OKTOBER, { name:'Oktober', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.ORICHALCUM_CHAINSAW, { name:'Orichalcum Chainsaw', type:'tool', power:165, speed:4, range:3.5, axe:165, color:'#c868a8', icon:'🪚', maxStack:1, desc:'An orichalcum chainsaw for mining and chopping.' });
defItem(I.ORICHALCUM_DRILL, { name:'Orichalcum Drill', type:'tool', power:165, speed:4, range:3.5, color:'#c868a8', icon:'⛏', maxStack:1, desc:'An orichalcum mining drill.' });
defItem(I.ORICHALCUM_HEADGEAR, { name:'Orichalcum Headgear', type:'armor', slot:'head', def:38, icon:'A', maxStack:1, desc:'Defense +38' });
defItem(I.OUTCAST, { name:'Outcast', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.OWL, { name:'Owl', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.OYSTER, { name:'Oyster', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.PAINTBRUSH, { name:'Paintbrush', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.PAL_METAL_LEGGINGS, { name:'Pal Metal Leggings', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.PALADINS_HAMMER, { name:'Paladin\'s Hammer', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.PALLADIUM_CHAINSAW, { name:'Palladium Chainsaw', type:'tool', power:130, speed:4, range:3, axe:130, color:'#e89040', icon:'🪚', maxStack:1, desc:'A palladium chainsaw for mining and chopping.' });
defItem(I.PALLADIUM_DRILL, { name:'Palladium Drill', type:'tool', power:130, speed:4, range:3, color:'#e89040', icon:'⛏', maxStack:1, desc:'A palladium mining drill.' });
defItem(I.PALLADIUM_HEADGEAR, { name:'Palladium Headgear', type:'armor', slot:'head', def:26, icon:'A', maxStack:1, desc:'Defense +26' });
defItem(I.PALM_WOOD_BREASTPLATE, { name:'Palm Wood Breastplate', type:'armor', slot:'chest', def:1, icon:'A', maxStack:1, desc:'Defense +1' });
defItem(I.PALM_WOOD_GREAVES, { name:'Palm Wood Greaves', type:'armor', slot:'legs', def:1, icon:'A', maxStack:1, desc:'Defense +1' });
defItem(I.PALM_WOOD_HELMET, { name:'Palm Wood Helmet', type:'armor', slot:'head', def:1, icon:'A', maxStack:1, desc:'Defense +1' });
defItem(I.PARKA_HOOD, { name:'Parka Hood', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.PARKA_PANTS, { name:'Parka Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.PEACH, { name:'Peach', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.PEARLWOOD, { name:'Pearlwood', type:'block', icon:'block', maxStack:999, desc:'A placeable block.' });
defItem(I.PEARLWOOD_BREASTPLATE, { name:'Pearlwood Breastplate', type:'armor', slot:'chest', def:3, icon:'A', maxStack:1, desc:'Defense +3' });
defItem(I.PEARLWOOD_GREAVES, { name:'Pearlwood Greaves', type:'armor', slot:'legs', def:2, icon:'A', maxStack:1, desc:'Defense +2' });
defItem(I.PEARLWOOD_HELMET, { name:'Pearlwood Helmet', type:'armor', slot:'head', def:2, icon:'A', maxStack:1, desc:'Defense +2' });
defItem(I.PEDDLERS_HAT, { name:'Peddler\'s Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.PEDGUINS_HOOD, { name:'Pedguin\'s Hood', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.PENGUIN, { name:'Penguin', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.PHARAOHS_ROBE, { name:'Pharaoh\'s Robe', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.PHO, { name:'Pho', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.PINEAPPLE, { name:'Pineapple', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.PINK_MAID_DRESS, { name:'Pink Maid Dress', type:'vanity', icon:'V', maxStack:1, desc:'A vanity outfit.' });
defItem(I.PINK_SNOW_HOOD, { name:'Pink Snow Hood', type:'armor', slot:'head', def:3, icon:'A', maxStack:1, desc:'Defense +3' });
defItem(I.PINK_SNOW_PANTS, { name:'Pink Snow Pants', type:'armor', slot:'legs', def:3, icon:'A', maxStack:1, desc:'Defense +3' });
defItem(I.PINSTRIPE_PANTS, { name:'Pinstripe Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.PIRATE_HAT, { name:'Pirate Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.PIRATE_PANTS, { name:'Pirate Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.PIRATE_SHIRT, { name:'Pirate Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.PIXIE_PANTS, { name:'Pixie Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.PIXIE_SHIRT, { name:'Pixie Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.PIZZA, { name:'Pizza', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.PLATE, { name:'Plate', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.PLATINUM_SHORTSWORD, { name:'Platinum Shortsword', type:'melee', shortSword:true, dmg:13, speed:0.167, kb:5, range:2.5, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.PLUM, { name:'Plum', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.PLUMBERS_HAT, { name:'Plumber\'s Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.PLUMBERS_PANTS, { name:'Plumber\'s Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.PLUMBERS_SHIRT, { name:'Plumber\'s Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.POMEGRANATE, { name:'Pomegranate', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.POO, { name:'Poo', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.PORTAL_GUN, { name:'Portal Gun', type:'melee', dmg:10, speed:0.333, kb:2, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.PORTAL_GUN_STATION, { name:'Portal Gun Station', type:'melee', dmg:10, speed:0.25, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.POTIONOF_RETURN, { name:'Potion of Return', type:'consumable', recall:true, color:'#c8a0ff', icon:'🧪', maxStack:30, desc:'Teleport to spawn, then return to your previous position.' });
defItem(I.PRESENT, { name:'Present', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.PRESSERATOR, { name:'Presserator', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.PRETTY_PINK_DRESS, { name:'Pretty Pink Dress', type:'vanity', icon:'V', maxStack:1, desc:'A vanity outfit.' });
defItem(I.PRINCE_CAPE, { name:'Prince Cape', type:'vanity', icon:'V', maxStack:1, desc:'A vanity outfit.' });
defItem(I.PRINCE_PANTS, { name:'Prince Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.PRINCESS_DRESS, { name:'Princess Dress', type:'vanity', icon:'V', maxStack:1, desc:'A vanity outfit.' });
defItem(I.PRINCESS_HAT, { name:'Princess Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.PRISMITE, { name:'Prismite', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.PROSPECTOR_HELMET, { name:'Prospector Helmet', type:'armor', slot:'head', def:10, icon:'A', maxStack:1, desc:'Defense +10' });
defItem(I.PROSPECTOR_PANTS, { name:'Prospector Pants', type:'armor', slot:'legs', def:11, icon:'A', maxStack:1, desc:'Defense +11' });
defItem(I.PROSPECTOR_SHIRT, { name:'Prospector Shirt', type:'armor', slot:'chest', def:12, icon:'A', maxStack:1, desc:'Defense +12' });
defItem(I.PROST, { name:'Prost', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.PUMPKIN_BREASTPLATE, { name:'Pumpkin Breastplate', type:'armor', slot:'chest', def:3, icon:'A', maxStack:1, desc:'Defense +3' });
defItem(I.PUMPKIN_HELMET, { name:'Pumpkin Helmet', type:'armor', slot:'head', def:2, icon:'A', maxStack:1, desc:'Defense +2' });
defItem(I.PUMPKIN_LEGGINGS, { name:'Pumpkin Leggings', type:'armor', slot:'legs', def:2, icon:'A', maxStack:1, desc:'Defense +2' });
defItem(I.PUMPKIN_PANTS, { name:'Pumpkin Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.PUMPKIN_SHIRT, { name:'Pumpkin Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.PUPFISH, { name:'Pupfish', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.PUPFISH_BOWL, { name:'Pupfish Bowl', type:'melee', dmg:10, speed:0.25, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.PURITY, { name:'Purity', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.RABBIT_PERCH, { name:'Rabbit Perch', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.RAGGED_BROTHERHOOD_SIGIL, { name:'Ragged Brotherhood Sigil', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.RAIN_COAT, { name:'Rain Coat', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.RAIN_HAT, { name:'Rain Hat', type:'armor', slot:'head', def:1, icon:'A', maxStack:1, desc:'Defense +1' });
defItem(I.RAINBOW_BOULDER, { name:'Rainbow Boulder', type:'melee', dmg:10, speed:0.25, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.RAINBOW_BRICK, { name:'Rainbow Brick', type:'melee', dmg:10, speed:0.25, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.RAINBOW_BRICK_WALL, { name:'Rainbow Brick Wall', type:'melee', dmg:10, speed:0.25, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.RAINBOW_CAMPFIRE, { name:'Rainbow Campfire', type:'melee', dmg:10, speed:0.25, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.RAINBOW_CLOUD, { name:'Rainbow Cloud', type:'melee', dmg:10, speed:0.25, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.RAINBOW_CURSOR, { name:'Rainbow Cursor', type:'melee', dmg:10, speed:0.417, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.RAINBOW_GLOWSTICK, { name:'Rainbow Glowstick', type:'melee', dmg:10, speed:0.25, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.RAINBOW_HAIR_DYE, { name:'Rainbow Hair Dye', type:'melee', dmg:10, speed:0.283, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.RAINBOW_STRING, { name:'Rainbow String', type:'melee', dmg:10, speed:0.417, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.RALLY, { name:'Rally', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.RAMBUTAN, { name:'Rambutan', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.RAT, { name:'Rat', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.RAYNBROS_HOOD, { name:'Raynbro\'s Hood', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.RAYNBROS_HOODIE, { name:'Raynbro\'s Hoodie', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.RAYNBROS_PANTS, { name:'Raynbro\'s Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.RAZORTIP, { name:'Razortip', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.REAPER_HOOD, { name:'Reaper Hood', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.REAPER_ROBE, { name:'Reaper Robe', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.REBORN, { name:'Reborn', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.RED_CAPE, { name:'Red Cape', type:'vanity', icon:'V', maxStack:1, desc:'A vanity outfit.' });
defItem(I.RED_HAT, { name:'Red Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.RED_POTION, { name:'Red Potion', type:'consumable', heal:50, color:'#ff4d4d', icon:'🧪', maxStack:30, desc:'Restores 50 health.' });
defItem(I.RED_RIDING_DRESS, { name:'Red Riding Dress', type:'vanity', icon:'V', maxStack:1, desc:'A vanity outfit.' });
defItem(I.RED_RIDING_HOOD, { name:'Red Riding Hood', type:'armor', slot:'head', def:8, icon:'A', maxStack:1, desc:'Defense +8' });
defItem(I.RED_RIDING_LEGGINGS, { name:'Red Riding Leggings', type:'armor', slot:'legs', def:16, icon:'A', maxStack:1, desc:'Defense +16' });
defItem(I.REDS_BREASTPLATE, { name:'Red\'s Breastplate', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.REDS_HELMET, { name:'Red\'s Helmet', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.REDS_LEGGINGS, { name:'Red\'s Leggings', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.REMIX, { name:'Remix', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.REQUIEM, { name:'Requiem', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.RICH_MAHOGANY_BREASTPLATE, { name:'Rich Mahogany Breastplate', type:'armor', slot:'chest', def:1, icon:'A', maxStack:1, desc:'Defense +1' });
defItem(I.RICH_MAHOGANY_GREAVES, { name:'Rich Mahogany Greaves', type:'armor', slot:'legs', def:1, icon:'A', maxStack:1, desc:'Defense +1' });
defItem(I.RICH_MAHOGANY_HELMET, { name:'Rich Mahogany Helmet', type:'armor', slot:'head', def:1, icon:'A', maxStack:1, desc:'Defense +1' });
defItem(I.ROBE, { name:'Robe', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.ROBOT_HAT, { name:'Robot Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.ROBOT_PANTS, { name:'Robot Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.ROBOT_SHIRT, { name:'Robot Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.ROPE, { name:'Rope', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.ROYAL_DRESS, { name:'Royal Dress', type:'vanity', icon:'V', maxStack:1, desc:'A vanity outfit.' });
defItem(I.RUBY_HOOK, { name:'Ruby Hook', type:'hook', hookRange:255, hookSpeed:17, hookPull:9, hookCount:1, color:'#e03030', icon:'🪝', maxStack:1, desc:'A gem hook.' });
defItem(I.RUBY_ROBE, { name:'Ruby Robe', type:'armor', slot:'chest', def:2, icon:'A', maxStack:1, desc:'Defense +2' });
defItem(I.RULER, { name:'Ruler', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.RUNE_HAT, { name:'Rune Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.RUNE_ROBE, { name:'Rune Robe', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.S_W_A_T_HELMET, { name:'SWAT Helmet', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.SAFE, { name:'Safe', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.SAFEMANS_BLANKET_CAPE, { name:'Safeman\'s Blanket Cape', type:'vanity', icon:'V', maxStack:1, desc:'A vanity outfit.' });
defItem(I.SAFEMANS_PINK_LEGGINGS, { name:'Safeman\'s Pink Leggings', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.SAFEMANS_SUN_DRESS, { name:'Safeman\'s Sun Dress', type:'vanity', icon:'V', maxStack:1, desc:'A vanity outfit.' });
defItem(I.SAIL, { name:'Sail', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.SAILOR_HAT, { name:'Sailor Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.SAILOR_PANTS, { name:'Sailor Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.SAILOR_SHIRT, { name:'Sailor Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.SAKE, { name:'Sake', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.SANTA_HAT, { name:'Santa Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.SANTA_PANTS, { name:'Santa Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.SANTA_SHIRT, { name:'Santa Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.SAPPHIRE_HOOK, { name:'Sapphire Hook', type:'hook', hookRange:225, hookSpeed:15, hookPull:8, hookCount:1, color:'#2850a0', icon:'🪝', maxStack:1, desc:'A gem hook.' });
defItem(I.SAPPHIRE_ROBE, { name:'Sapphire Robe', type:'armor', slot:'chest', def:1, icon:'A', maxStack:1, desc:'Defense +1' });
defItem(I.SASHIMI, { name:'Sashimi', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.SAWMILL, { name:'Sawmill', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.SCARECROW_HAT, { name:'Scarecrow Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.SCARECROW_PANTS, { name:'Scarecrow Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.SCARECROW_SHIRT, { name:'Scarecrow Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.SCORPION, { name:'Scorpion', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.SEAGULL, { name:'Seagull', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.SEAHORSE, { name:'Seahorse', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.SEASHELL, { name:'Seashell', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.SEAWEED, { name:'Seaweed', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.SECRETS, { name:'Secrets', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.SEE_THE_WORLD_FOR_WHAT_IT_IS, { name:'See The World For What It Is', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.SEEDLING, { name:'Seedling', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.SHADEWOOD, { name:'Shadewood', type:'block', icon:'block', maxStack:999, desc:'A placeable block.' });
defItem(I.SHADEWOOD_BREASTPLATE, { name:'Shadewood Breastplate', type:'armor', slot:'chest', def:2, icon:'A', maxStack:1, desc:'Defense +2' });
defItem(I.SHADEWOOD_GREAVES, { name:'Shadewood Greaves', type:'armor', slot:'legs', def:1, icon:'A', maxStack:1, desc:'Defense +1' });
defItem(I.SHADEWOOD_HELMET, { name:'Shadewood Helmet', type:'armor', slot:'head', def:1, icon:'A', maxStack:1, desc:'Defense +1' });
defItem(I.SHELLPHONE, { name:'Shellphone', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.SHIMMER_GUN, { name:'Shimmer Gun', type:'melee', dmg:0, speed:0.333, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.SHINOBI_INFILTRATORS_HELMET, { name:'Shinobi Infiltrator\'s Helmet', type:'armor', slot:'head', def:10, icon:'A', maxStack:1, desc:'Defense +10' });
defItem(I.SHINOBI_INFILTRATORS_PANTS, { name:'Shinobi Infiltrator\'s Pants', type:'armor', slot:'legs', def:18, icon:'A', maxStack:1, desc:'Defense +18' });
defItem(I.SHIVERTHORN, { name:'Shiverthorn', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.SHRIMP, { name:'Shrimp', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.SHROOMERANG, { name:'Shroomerang', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.SHROOMITE_HELMET, { name:'Shroomite Helmet', type:'armor', slot:'head', def:11, icon:'A', maxStack:1, desc:'Defense +11' });
defItem(I.SHROOMITE_PLATING, { name:'Shroomite Plating', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.SHROOMITE_PLATING_WALL, { name:'Shroomite Plating Wall', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.SILVER_SHORTSWORD, { name:'Silver Shortsword', type:'melee', shortSword:true, dmg:9, speed:0.2, kb:4, range:2.5, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.SKELEHEAD, { name:'Skelehead', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.SKULL, { name:'Skull', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.SLEEPY_OCTOPOD, { name:'Sleepy Octopod', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.SLIME_GUN, { name:'Slime Gun', type:'melee', dmg:0, speed:0.2, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.SLIME_SPEAR, { name:'Slime Spear', type:'melee', dmg:12, speed:0.4, kb:6.5, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.SLUGGY, { name:'Sluggy', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.SNAIL, { name:'Snail', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.SNAKES_I_HATE_SNAKES, { name:'Snakes, I Hate Snakes', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.SNOW_HAT, { name:'Snow Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.SNOW_HOOD, { name:'Snow Hood', type:'armor', slot:'head', def:3, icon:'A', maxStack:1, desc:'Defense +3' });
defItem(I.SNOW_PANTS, { name:'Snow Pants', type:'armor', slot:'legs', def:3, icon:'A', maxStack:1, desc:'Defense +3' });
defItem(I.SNOWBALL_LAUNCHER, { name:'Snowball Launcher', type:'melee', dmg:10, speed:0.25, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.SNOWFELLAS, { name:'Snowfellas', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.SOARING_INSIGNIA, { name:'Soaring Insignia', type:'accessory', jumpMul:1.3, jumps:5, noFall:true, color:'#ffd840', icon:'🏅', maxStack:1, desc:'Infinite flight. The mark of a true skyfarer.' });
defItem(I.SOLAR_CULTIST_HOOD, { name:'Solar Cultist Hood', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.SOLAR_CULTIST_ROBE, { name:'Solar Cultist Robe', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.SOLAR_FLARE_CHAINSAW, { name:'Solar Flare Chainsaw', type:'tool', power:220, speed:5, range:5, axe:220, color:'#e8a828', icon:'🪚', maxStack:1, desc:'A luminite solar flare chainsaw for mining and chopping.' });
defItem(I.SOLAR_FLARE_DRILL, { name:'Solar Flare Drill', type:'tool', power:220, speed:5, range:5, color:'#e8a828', icon:'⛏', maxStack:1, desc:'A luminite solar flare mining drill.' });
defItem(I.SOLIDIFIER, { name:'Solidifier', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.SPACE_CREATURE_PANTS, { name:'Space Creature Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.SPACE_CREATURE_SHIRT, { name:'Space Creature Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.SPAGHETTI, { name:'Spaghetti', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.SPARKY, { name:'Sparky', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.SPEAR, { name:'Spear', type:'melee', dmg:8, speed:0.517, kb:6.5, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.SPEAR_RACK, { name:'Spear Rack', type:'melee', dmg:10, speed:0.25, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.SPEAR_TRAP, { name:'Spear Trap', type:'melee', dmg:10, speed:0.25, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.SPECTRE_PANTS, { name:'Spectre Pants', type:'armor', slot:'legs', def:10, icon:'A', maxStack:1, desc:'Defense +10' });
defItem(I.SPIDER_BREASTPLATE, { name:'Spider Breastplate', type:'armor', slot:'chest', def:8, icon:'A', maxStack:1, desc:'Defense +8' });
defItem(I.SPIDER_GREAVES, { name:'Spider Greaves', type:'armor', slot:'legs', def:7, icon:'A', maxStack:1, desc:'Defense +7' });
defItem(I.SPIKE, { name:'Spike', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.SQUIRES_GREAT_HELM, { name:'Squire\'s Great Helm', type:'armor', slot:'head', def:20, icon:'A', maxStack:1, desc:'Defense +20' });
defItem(I.SQUIRES_GREAVES, { name:'Squire\'s Greaves', type:'armor', slot:'legs', def:18, icon:'A', maxStack:1, desc:'Defense +18' });
defItem(I.SQUIRES_PLATING, { name:'Squire\'s Plating', type:'armor', slot:'chest', def:27, icon:'A', maxStack:1, desc:'Defense +27' });
defItem(I.SQUIRREL, { name:'Squirrel', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.STAFFOF_REGROWTH, { name:'Staff of Regrowth', type:'melee', dmg:7, speed:0.417, kb:3, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.STAR, { name:'Star', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.STAR_PRINCESS_DRESS, { name:'Star Princess Dress', type:'vanity', icon:'V', maxStack:1, desc:'A vanity outfit.' });
defItem(I.STARDROP, { name:'Stardrop', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.STARDUST_CHAINSAW, { name:'Stardust Chainsaw', type:'tool', power:220, speed:5, range:5, axe:220, color:'#68c8e8', icon:'🪚', maxStack:1, desc:'A luminite stardust chainsaw for mining and chopping.' });
defItem(I.STARDUST_DRILL, { name:'Stardust Drill', type:'tool', power:220, speed:5, range:5, color:'#68c8e8', icon:'⛏', maxStack:1, desc:'A luminite stardust mining drill.' });
defItem(I.STARFISH, { name:'Starfish', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.STARLIGHT, { name:'Starlight', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.STEAK, { name:'Steak', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.STEAMPUNK_HAT, { name:'Steampunk Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.STEAMPUNK_PANTS, { name:'Steampunk Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.STEAMPUNK_SHIRT, { name:'Steampunk Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.STINGER, { name:'Stinger', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.STINKBUG, { name:'Stinkbug', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.STINKFISH, { name:'Stinkfish', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.STORM_SPEAR, { name:'Storm Spear', type:'melee', dmg:14, speed:0.467, kb:6, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.SUMMONING_POTION, { name:'Summoning Potion', type:'consumable', buff:{t:300, summoning:true}, color:'#c8ff8a', icon:'🧪', maxStack:30, desc:'Increases max minions by 1 for 5 minutes.' });
defItem(I.SUNFLOWERS, { name:'Sunflowers', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.SUNGLASSES, { name:'Sunglasses', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.SUPER_MANA_POTION, { name:'Super Mana Potion', type:'consumable', mana:200, color:'#6bc8ff', icon:'🫗', maxStack:30, desc:'Restores 200 mana.' });
defItem(I.SUPERHERO_COSTUME, { name:'Superhero Costume', type:'vanity', icon:'V', maxStack:1, desc:'A vanity outfit.' });
defItem(I.SWITCH, { name:'Switch', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.SWORD_RACK, { name:'Sword Rack', type:'melee', dmg:10, speed:0.25, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.SWORDFISH, { name:'Swordfish', type:'melee', dmg:19, speed:0.333, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.TAX_COLLECTORS_HAT, { name:'Tax Collector\'s Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.TAX_COLLECTORS_PANTS, { name:'Tax Collector\'s Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.TEACUP, { name:'Teacup', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.TEAPOT, { name:'Teapot', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.TELEPORTER, { name:'Teleporter', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.TERRA_BLADE_CHRONICLES, { name:'Terra Blade Chronicles', type:'melee', dmg:10, speed:0.25, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.TERRAFORMER, { name:'Terraformer', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.TERRAGRIM, { name:'Terragrim', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.THE_DOCTORS_PANTS, { name:'The Doctor\'s Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.THE_DOCTORS_SHIRT, { name:'The Doctor\'s Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.THE_HORSEMANS_BLADE, { name:'The Horseman\'s Blade', type:'melee', dmg:150, speed:0.433, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.THRONE, { name:'Throne', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.THUNDERBOLT, { name:'Thunderbolt', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.TIARA, { name:'Tiara', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.TIGER_CLIMBING_GEAR, { name:'Tiger Climbing Gear', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.TIKI_PANTS, { name:'Tiki Pants', type:'armor', slot:'legs', def:12, icon:'A', maxStack:1, desc:'Defense +12' });
defItem(I.TIKI_SHIRT, { name:'Tiki Shirt', type:'armor', slot:'chest', def:17, icon:'A', maxStack:1, desc:'Defense +17' });
defItem(I.TIMELESS_TRAVELERS_HOOD, { name:'Timeless Traveler\'s Hood', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.TIN_PLATING, { name:'Tin Plating', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.TIN_PLATING_WALL, { name:'Tin Plating Wall', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.TIN_SHORTSWORD, { name:'Tin Shortsword', type:'melee', shortSword:true, dmg:7, speed:0.2, kb:4, range:2.5, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.TITANIUM_CHAINSAW, { name:'Titanium Chainsaw', type:'tool', power:190, speed:4, range:3.5, axe:190, color:'#a8a8b8', icon:'🪚', maxStack:1, desc:'A titanium chainsaw for mining and chopping.' });
defItem(I.TITANIUM_DRILL, { name:'Titanium Drill', type:'tool', power:190, speed:4, range:3.5, color:'#a8a8b8', icon:'⛏', maxStack:1, desc:'A titanium mining drill.' });
defItem(I.TITANIUM_HEADGEAR, { name:'Titanium Headgear', type:'armor', slot:'head', def:48, icon:'A', maxStack:1, desc:'Defense +48' });
defItem(I.TOOLBELT, { name:'Toolbelt', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.TOOLBOX, { name:'Toolbox', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.TOP_HAT, { name:'Top Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.TOPAZ_HOOK, { name:'Topaz Hook', type:'hook', hookRange:210, hookSpeed:14, hookPull:7, hookCount:1, color:'#e0a020', icon:'🪝', maxStack:1, desc:'A gem hook.' });
defItem(I.TOPAZ_ROBE, { name:'Topaz Robe', type:'armor', slot:'chest', def:1, icon:'A', maxStack:1, desc:'Defense +1' });
defItem(I.TORCH_GODS_FAVOR, { name:'Torch God\'s Favor', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.TOUCAN, { name:'Toucan', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.TREASURE_HUNTER_PANTS, { name:'Treasure Hunter Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.TREASURE_HUNTER_SHIRT, { name:'Treasure Hunter Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.TREE_SHIRT, { name:'Tree Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.TRIDENT, { name:'Trident', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.TRIMARANG, { name:'Trimarang', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.TRUE_COPPER_SHORTSWORD, { name:'True Copper Shortsword', type:'melee', shortSword:true, dmg:190, speed:0.5, kb:6.5, range:2.5, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.TRUE_NIGHTS_EDGE, { name:'True Night\'s Edge', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.TUNA, { name:'Tuna', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.TUNGSTEN_SHORTSWORD, { name:'Tungsten Shortsword', type:'melee', shortSword:true, dmg:10, speed:0.183, kb:4, range:2.5, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.TURTLE, { name:'Turtle', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.TURTLE_HELMET, { name:'Turtle Helmet', type:'armor', slot:'head', def:21, icon:'A', maxStack:1, desc:'Defense +21' });
defItem(I.ULTRABRIGHT_HELMET, { name:'Ultrabright Helmet', type:'armor', slot:'head', def:4, icon:'A', maxStack:1, desc:'Defense +4' });
defItem(I.ULURU, { name:'Uluru', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.UMBRELLA_HAT, { name:'Umbrella Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.UNICORN_PANTS, { name:'Unicorn Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.UNICORN_SHIRT, { name:'Unicorn Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.VALHALLA_KNIGHTS_BREASTPLATE, { name:'Valhalla Knight\'s Breastplate', type:'armor', slot:'chest', def:24, icon:'A', maxStack:1, desc:'Defense +24' });
defItem(I.VALHALLA_KNIGHTS_GREAVES, { name:'Valhalla Knight\'s Greaves', type:'armor', slot:'legs', def:24, icon:'A', maxStack:1, desc:'Defense +24' });
defItem(I.VALHALLA_KNIGHTS_HELM, { name:'Valhalla Knight\'s Helm', type:'armor', slot:'head', def:24, icon:'A', maxStack:1, desc:'Defense +24' });
defItem(I.VALKYRIE_YOYO, { name:'Valkyrie Yoyo', type:'melee', dmg:70, speed:0.417, kb:4.5, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.VALOR, { name:'Valor', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.VAMPIRE_PANTS, { name:'Vampire Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.VAMPIRE_SHIRT, { name:'Vampire Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.VICTORIAN_GOTH_DRESS, { name:'Victorian Goth Dress', type:'vanity', icon:'V', maxStack:1, desc:'A vanity outfit.' });
defItem(I.VICTORIAN_GOTH_HAT, { name:'Victorian Goth Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.VIKING_HELMET, { name:'Viking Helmet', type:'armor', slot:'head', def:4, icon:'A', maxStack:1, desc:'Defense +4' });
defItem(I.VITAMINS, { name:'Vitamins', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.VORTEX_CHAINSAW, { name:'Vortex Chainsaw', type:'tool', power:220, speed:5, range:5, axe:220, color:'#28c868', icon:'🪚', maxStack:1, desc:'A luminite vortex chainsaw for mining and chopping.' });
defItem(I.VORTEX_DRILL, { name:'Vortex Drill', type:'tool', power:220, speed:5, range:5, color:'#28c868', icon:'⛏', maxStack:1, desc:'A luminite vortex mining drill.' });
defItem(I.WALDO, { name:'Waldo', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.WARMTH_POTION, { name:'Warmth Potion', type:'consumable', buff:{t:600, warmth:true}, color:'#ff8844', icon:'🧪', maxStack:30, desc:'Reduces damage from cold sources for 10 minutes.' });
defItem(I.WATER_GUN, { name:'Water Gun', type:'melee', dmg:0, speed:0.333, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.WATERLEAF, { name:'Waterleaf', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.WEDDING_DRESS, { name:'Wedding Dress', type:'vanity', icon:'V', maxStack:1, desc:'A vanity outfit.' });
defItem(I.WHAT_LURKS_BELOW, { name:'What Lurks Below', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.WHITE_TUXEDO_PANTS, { name:'White Tuxedo Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.WHITE_TUXEDO_SHIRT, { name:'White Tuxedo Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.WILDFLOWERS, { name:'Wildflowers', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.WILLS_BREASTPLATE, { name:'Will\'s Breastplate', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.WILLS_HELMET, { name:'Will\'s Helmet', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.WILLS_LEGGINGS, { name:'Will\'s Leggings', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.WINTER_CAPE, { name:'Winter Cape', type:'vanity', icon:'V', maxStack:1, desc:'A vanity outfit.' });
defItem(I.WIRE, { name:'Wire', type:'material', color:'#b8b8a0', icon:'M', maxStack:999, desc:'A crafting material or collectible.' });
defItem(I.WITCH_DRESS, { name:'Witch Dress', type:'vanity', icon:'V', maxStack:1, desc:'A vanity outfit.' });
defItem(I.WITCH_HAT, { name:'Witch Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.WIZARD_HAT, { name:'Wizard Hat', type:'armor', slot:'head', def:4, icon:'A', maxStack:1, desc:'Defense +4' });
defItem(I.WIZARDS_HAT, { name:'Wizard\'s Hat', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.WOLF_PANTS, { name:'Wolf Pants', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.WOLF_SHIRT, { name:'Wolf Shirt', type:'armor', slot:'chest', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.WOOD_BREASTPLATE, { name:'Wood Breastplate', type:'armor', slot:'chest', def:1, icon:'A', maxStack:1, desc:'Defense +1' });
defItem(I.WOOD_FISHING_POLE, { name:'Wood Fishing Pole', type:'fishingrod', fishingPower:15, color:'#b5824f', icon:'🎣', maxStack:1, desc:'A simple pole. Needs bait.' });
defItem(I.WOOD_GREAVES, { name:'Wood Greaves', type:'armor', slot:'legs', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.WOOD_HELMET, { name:'Wood Helmet', type:'armor', slot:'head', def:1, icon:'A', maxStack:1, desc:'Defense +1' });
defItem(I.WOODEN_BOOMERANG, { name:'Wooden Boomerang', type:'melee', dmg:10, speed:0.333, kb:5, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.WOODEN_YOYO, { name:'Wooden Yoyo', type:'melee', dmg:9, speed:0.417, kb:2.5, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.WORM_HOOK, { name:'Worm Hook', type:'hook', hookRange:270, hookSpeed:18, hookPull:9, hookCount:2, color:'#8a7a50', icon:'🪝', maxStack:1, desc:'A double hook.' });
defItem(I.YORAIZ0RS_RECOLORED_GOGGLES, { name:'Yoraiz0r\'s Recolored Goggles', type:'armor', slot:'head', def:5, icon:'A', maxStack:1, desc:'Defense +5' });
defItem(I.YOYO_GLOVE, { name:'Yoyo Glove', type:'melee', dmg:10, speed:0.417, kb:4, range:4, auto:true, icon:'W', maxStack:1, desc:'A weapon.' });
defItem(I.ZENITH, { name:'Zenith', type:'melee', dmg:190, speed:0.25, kb:6.5, range:5, auto:true, maxStack:1, desc:'The ultimate blade. Legendary swords of every era, fused by starlight.' });
