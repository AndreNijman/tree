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
defItem(I.IRONPICK, { name:'Iron Pickaxe', type:'tool', power:55, speed:1.0, dmg:6, range:3.2, color:'#d0d0d6', icon:'⛏️', maxStack:1, desc:'Mines cobalt ore.' });
defItem(I.COBALTPICK, { name:'Cobalt Pickaxe', type:'tool', power:70, speed:1.5, dmg:9, range:3.4, color:'#3a7dff', icon:'⛏️', maxStack:1, desc:'Mines mythril ore.' });
defItem(I.MYTHRILPICK, { name:'Mythril Pickaxe', type:'tool', power:85, speed:2.0, dmg:12, range:3.6, color:'#3ed6a0', icon:'⛏️', maxStack:1, desc:'Mines adamantite ore.' });
defItem(I.ADAMANTITEPICK, { name:'Adamantite Pickaxe', type:'tool', power:110, speed:2.6, dmg:15, range:3.8, color:'#e05555', icon:'⛏️', maxStack:1, desc:'The finest pickaxe.' });

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
defItem(I.TITANIUMPICK, { name:'Titanium Pickaxe', type:'tool', power:115, speed:2.8, dmg:16, range:3.8, color:'#c8ccd4', icon:'⛏️', maxStack:1, desc:'Mines chlorophyte ore.' });
defItem(I.PICKAXEAXE, { name:'Pickaxe Axe', type:'tool', power:120, speed:3.0, dmg:18, range:3.9, color:'#ffe14d', icon:'⛏️', maxStack:1, desc:'A hallowed axe-pick hybrid.' });
defItem(I.DRAX, { name:'Drax', type:'tool', power:130, speed:3.4, dmg:20, range:4.0, color:'#6bff8a', icon:'⛏️', maxStack:1, desc:'A drill-axe of living metal.' });
defItem(I.PICKSHAW, { name:'Picksaw', type:'tool', power:210, speed:4.0, dmg:24, range:4.2, color:'#ffb84d', icon:'⛏️', maxStack:1, desc:'Dropped by Golem. Breaks Lihzahrd brick.' });

// --- New ranged ---
defItem(I.BULLET, { name:'Crystal Bullet', type:'ammo', dmg:9, color:'#ff9de0', icon:'⚫', maxStack:999 });
defItem(I.MEGASHARK, { name:'Megashark', type:'ranged', dmg:25, speed:0.117, kb:1, ammo:I.BULLET, proj:P.GUNBULLET, auto:true, range:999, color:'#8a8f9a', icon:'🔫', maxStack:1, desc:'A shark named gun. Devours ammo.', projSpeed:10});

// --- New magic ---
defItem(I.GOLDENSHOWER, { name:'Golden Shower', type:'magic', dmg:30, speed:0.3, kb:4, mana:7, proj:P.CURSEDFLAME, projCount:3, status:{type:'ichor',duration:5,defense:12}, auto:true, range:999, color:'#ffd75e', icon:'🌧️', maxStack:1, desc:'Coats enemies in defense-shredding ichor.', projSpeed:10});
defItem(I.RAINBOWROD, { name:'Rainbow Rod', type:'magic', dmg:50, speed:0.417, kb:6, mana:21, proj:P.RAINBOW, magicMode:'controlled', controlledReach:32, controlledSpeed:9, controlledDuration:4, auto:true, range:999, color:'#ff9de0', icon:'🌈', maxStack:1, desc:'A rainbow guided by the cursor.', projSpeed:6});
defItem(I.RAZORBLADETYPHOON, { name:'Razorblade Typhoon', type:'magic', dmg:85, speed:0.667, kb:5, mana:20, proj:P.RAZOR, projCount:2, projHoming:true, auto:true, range:999, color:'#6bc8ff', icon:'🌪️', maxStack:1, desc:'Dropped by Duke Fishron. A storm of homing blades.', projSpeed:6});
defItem(I.LASTPRISM, { name:'Last Prism', type:'magic', dmg:100, speed:0.167, kb:0.25, mana:12, proj:P.PRISM, magicMode:'beam', channelRange:42, channelManaInterval:0.12, hitCooldown:0.12, auto:true, range:999, color:'#ffe14d', icon:'💎', maxStack:1, desc:'The Moon Lord\'s continuous rainbow beam.', projSpeed:30});

// --- Summoner whips ---
defItem(I.LEATHERWHIP, { name:'Leather Whip', type:'whip', dmg:14, speed:0.4, kb:3, range:2.6, tagDamage:4, tagDuration:4, color:'#b5824f', icon:'🔗', maxStack:1, desc:'Marks enemies for +4 minion damage.' });
defItem(I.FIRECRACKER, { name:'Firecracker', type:'whip', dmg:28, speed:0.3, kb:4, range:3.0, tagDamage:8, tagDuration:4, tagExplosive:0.8, color:'#ff4d4d', icon:'🧨', maxStack:1, desc:'The next minion hit bursts around the tagged enemy.' });
defItem(I.KALEIDOSCOPE, { name:'Kaleidoscope', type:'whip', dmg:52, speed:0.22, kb:5, range:3.4, tagDamage:20, tagDuration:4, color:'#ff9de0', icon:'🪄', maxStack:1, desc:'Marks enemies for +20 minion damage.' });

// --- Summoner staves ---
defItem(I.IMPSTAFF, { name:'Imp Staff', type:'summonstaff', dmg:26, minion:'imp', speed:0, color:'#ff6b3d', icon:'😈', maxStack:1, desc:'Summons an Imp to fight for you.' });
defItem(I.OPTICSTAFF, { name:'Optic Staff', type:'summonstaff', dmg:38, minion:'twin', speed:0, color:'#ff3d4d', icon:'👁️', maxStack:1, desc:'Summons Twins minions to fight for you.' });
defItem(I.STARDUSTDRAGONSTAFF, { name:'Stardust Dragon Staff', type:'summonstaff', dmg:60, minion:'dragon', speed:0, color:'#6bc8ff', icon:'🐉', maxStack:1, desc:'Summons a Stardust Dragon.' });

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
defItem(I.SPIDERSTAFF, { name:'Spider Staff', type:'summonstaff', dmg:32, minion:'spider', speed:0, color:'#e8e8f0', icon:'🕷️', maxStack:1, desc:'Summons a spider minion.' });
defItem(I.PYGMYSTAFF, { name:'Pygmy Staff', type:'summonstaff', dmg:42, minion:'pygmy', speed:0, color:'#6bff8a', icon:'🗡️', maxStack:1, desc:'Summons a jungle pygmy.' });
defItem(I.XENOSTAFF, { name:'Xeno Staff', type:'summonstaff', dmg:50, minion:'xeno', speed:0, color:'#c85cff', icon:'👾', maxStack:1, desc:'Summons a UFO minion.' });
defItem(I.STARDUSTCELLSTAFF, { name:'Stardust Cell Staff', type:'summonstaff', dmg:55, minion:'cell', speed:0, color:'#6bc8ff', icon:'✨', maxStack:1, desc:'Summons a stardust cell.' });

// Whips
defItem(I.SNAPTHORN, { name:'Snapthorn', type:'whip', dmg:20, speed:0.35, kb:3, range:2.8, tagDamage:6, tagDuration:4, whipSpeedMul:0.82, color:'#3f9a4d', icon:'🪴', maxStack:1, desc:'Successful strikes temporarily quicken whips.' });
defItem(I.DURENDAL, { name:'Durendal', type:'whip', dmg:35, speed:0.28, kb:4, range:3.1, tagDamage:9, tagDuration:4, whipSpeedMul:0.74, color:'#ffe14d', icon:'💥', maxStack:1, desc:'Successful strikes greatly quicken whips.' });
defItem(I.MORNINGSTAR, { name:'Morning Star', type:'whip', dmg:45, speed:0.25, kb:5, range:3.2, tagDamage:12, tagDuration:4, color:'#8a8f9a', icon:'⛓️', maxStack:1, desc:'Marks enemies for +12 minion damage.' });

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
defItem(I.IRONAXE, { name:'Iron Axe', type:'tool', power:55, speed:1.0, dmg:7, range:2.6, color:'#d0d0d6', icon:'🪓', maxStack:1, desc:'Chops wood faster.' });
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
defItem(I.BLADESTAFF, { name:'Blade Staff', type:'summonstaff', dmg:22, minion:'blade', speed:0, color:'#ffe9a8', icon:'🗡️', maxStack:1, desc:'Summons enchanted daggers.' });
defItem(I.RAVENSTAFF, { name:'Raven Staff', type:'summonstaff', dmg:60, minion:'raven', speed:0, color:'#3a3a4a', icon:'🐦‍⬛', maxStack:1, desc:'A Pumpking staff that summons ravens of the dead.' });
defItem(I.TEMPESTSTAFF, { name:'Tempest Staff', type:'summonstaff', dmg:70, minion:'tempest', speed:0, color:'#5ac8ff', icon:'🌪️', maxStack:1, desc:'Summons a sharknado minion.' });
defItem(I.DESERTTIGERSTAFF, { name:'Desert Tiger Staff', type:'summonstaff', dmg:65, minion:'tiger', speed:0, color:'#ffd75e', icon:'🐯', maxStack:1, desc:'Summons a desert tiger.' });
defItem(I.TERRAPRISMA, { name:'Terraprisma', type:'summonstaff', dmg:85, minion:'blade', speed:0, color:'#3dff9d', icon:'🌈', maxStack:1, desc:'The Empress\'s blade of pure light.' });

// Whips
defItem(I.SPINEWHIP, { name:'Spine Whip', type:'whip', dmg:24, speed:0.32, kb:4, range:3.0, tagDamage:7, tagDuration:4, color:'#e0d8b8', icon:'🦴', maxStack:1, desc:'Marks enemies for +7 minion damage.' });
defItem(I.COOLWHIP, { name:'Cool Whip', type:'whip', dmg:38, speed:0.27, kb:4, range:3.2, tagDamage:10, tagDuration:4, whipBolt:P.FROSTBOLT, whipBoltDamage:0.5, color:'#9adcff', icon:'❄️', maxStack:1, desc:'Successful strikes release a homing frost bolt.' });
defItem(I.DARKHARVEST, { name:'Dark Harvest', type:'whip', dmg:62, speed:0.2, kb:5, range:3.4, tagDamage:14, tagDuration:4, tagSplash:0.45, color:'#a86b3d', icon:'🌾', maxStack:1, desc:'Minion hits splash dark energy from tagged enemies.' });

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
defItem(I.PWHAMMER, { name:'Pwnhammer', type:'tool', power:60, speed:1.2, dmg:9, range:2.8, color:'#c04040', icon:'🔨', maxStack:1, hammer:true, desc:'The Hammer of the Wall of Flesh. Breaks evil bricks.' });
defItem(I.CHLOROPHYTEJACKHAMMER, { name:'Chlorophyte Jackhammer', type:'tool', power:140, speed:3.6, dmg:22, range:3.4, color:'#4dff6b', icon:'🔨', maxStack:1, hammer:true, desc:'A living jackhammer of the jungle.' });
defItem(I.SPECTREHAMAXE, { name:'Spectre Hamaxe', type:'tool', power:150, speed:3.8, dmg:24, range:3.6, color:'#e6e6f0', icon:'🔨', maxStack:1, hammer:true, desc:'A spectral hammer-axe.' });

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
defItem(I.HORNETSTAFF, { name:'Hornet Staff', type:'summonstaff', dmg:30, minion:'hornet', speed:0, color:'#ffd75e', icon:'🐝', maxStack:1, desc:'Summons hornets of the jungle.' });
defItem(I.SANGUINESTAFF, { name:'Sanguine Staff', type:'summonstaff', dmg:35, minion:'sanguine', speed:0, color:'#ff4d6d', icon:'🦇', maxStack:1, desc:'Summons a blood bat.' });
defItem(I.DEADLYSPHERESTAFF, { name:'Deadly Sphere Staff', type:'summonstaff', dmg:45, minion:'sphere', speed:0, color:'#ff4d4d', icon:'🔮', maxStack:1, desc:'Summons a deadly sphere.' });

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
defItem(I.BROKENBATWING, { name:'Broken Bat Wing', type:'material', color:'#5a4a6a', icon:'🦇', maxStack:999, desc:'A rare wing fragment from Vampires.' });
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
defItem(I.FLINXSTAFF, { name:'Flinx Staff', type:'summonstaff', dmg:14, minion:'flinx', speed:0, color:'#f0f0f8', icon:'🐾', maxStack:1, desc:'Summons a loyal flinx to fight for you.' });
defItem(I.AMBER, { name:'Amber', type:'material', color:'#e8a83d', icon:'💎', maxStack:999, desc:'Fossilized tree resin, warm as sunset.' });
defItem(I.AMBERROBE, { name:'Amber Robe', type:'armor', slot:'head', def:3, color:'#e8a83d', icon:'🧙', maxStack:1, desc:'Defense +3. Humming with old sunlight.' });
defItem(I.AMBERSTAFF, { name:'Amber Staff', type:'magic', dmg:21, speed:0.467, kb:4.75, mana:9, proj:P.MAGICBOLT, auto:true, range:999, color:'#e8a83d', icon:'🔮', maxStack:1, desc:'Casts bolts of fossilized light.', projSpeed:9});
defItem(I.DEERTHING, { name:'Deer Thing', type:'summon', boss:'deerclops', color:'#b8d8f0', icon:'🦌', maxStack:99, desc:'Summons Deerclops in the Snow biome.' });
defItem(I.LUCYTHEAXE, { name:'Lucy the Axe', type:'tool', power:65, speed:0.75, dmg:24, range:3.0, color:'#d8b878', icon:'🪓', maxStack:1, desc:'A talkative axe dropped by Deerclops.' });
defItem(I.PEWMATICHORN, { name:'Pew-matic Horn', type:'ranged', dmg:20, speed:0.25, kb:1, ammo:I.MUSKETBALL, proj:P.GUNBULLET, auto:true, range:999, color:'#a87858', icon:'🔫', maxStack:1, desc:'Rapidly fires bullets with a strange honk.', projSpeed:14});
defItem(I.WEATHERPAIN, { name:'Weather Pain', type:'magic', dmg:13, speed:0.75, kb:1, mana:30, proj:P.FROSTBOLT, projCount:3, projHoming:true, auto:true, range:999, color:'#a8d8f0', icon:'❄️', maxStack:1, desc:'Launches twisting shards of winter that track enemies.', projSpeed:1});
defItem(I.EYEBONE, { name:'Eye Bone', type:'pet', pet:'chester', color:'#8a5a3a', icon:'👁️', maxStack:1, desc:'Summons a strange one-eyed companion.' });
defItem(I.TORCHGODSFAVOR, { name:'Torch God\'s Favor', type:'consumable', permanent:'torchGodFavor', color:'#ffb84d', icon:'🔥', maxStack:1, desc:'Permanently grants biome-colored torch flames.' });
defItem(I.SNOWGLOBE, { name:'Snow Globe', type:'eventitem', event:'frostlegion', time:'any', hm:true, color:'#b8dcf0', icon:'🔮', maxStack:99, desc:'Summons the Frost Legion in Hardmode.' });
defItem(I.FORBIDDENFRAGMENT, { name:'Forbidden Fragment', type:'material', color:'#e8c878', icon:'◇', maxStack:999, desc:'A storm-worn fragment carried by Sand Elementals.' });
defItem(I.LASERDRILL, { name:'Laser Drill', type:'tool', power:210, speed:0.18, dmg:35, range:4.5, color:'#68e8d0', icon:'⛏️', maxStack:1, desc:'A rapid mining tool carried by Martian Engineers.' });
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
defItem(I.COINGUN, { name:'Coin Gun', type:'ranged', dmg:20, speed:0.1, kb:1, ammo:I.COIN, proj:P.GUNBULLET, auto:true, range:999, color:'#ffd75e', icon:'🪙', maxStack:1, desc:'A rare prize from the Pirate Invasion. Fires coins.' });
defItem(I.COIN, { name:'Copper Coin', type:'ammo', ammoGroup:'coin', dmg:12, value:1, color:'#d88a5a', icon:'🪙', maxStack:999, desc:'One copper. The base unit of the town economy. Powers the Coin Gun.' });
defItem(I.SILVERCOIN, { name:'Silver Coin', type:'ammo', ammoGroup:'coin', dmg:20, value:100, color:'#d8d8e8', icon:'🪙', maxStack:999, desc:'Worth 100 copper.' });
defItem(I.GOLDCOIN, { name:'Gold Coin', type:'ammo', ammoGroup:'coin', dmg:35, value:10000, color:'#ffd75e', icon:'🪙', maxStack:999, desc:'Worth 100 silver.' });
defItem(I.PLATINUMCOIN, { name:'Platinum Coin', type:'ammo', ammoGroup:'coin', dmg:60, value:1000000, color:'#d8f0ff', icon:'🪙', maxStack:999, desc:'Worth 100 gold. A fortune in one coin.' });

// Darts & rockets
defItem(I.DART, { name:'Wooden Dart', type:'ammo', dmg:6, color:'#b5824f', icon:'➶', maxStack:999 });
defItem(I.CRYSTALDART, { name:'Crystal Dart', type:'ammo', dmg:10, color:'#ff9de0', icon:'💠', maxStack:999 });
defItem(I.CURSEDDART, { name:'Cursed Dart', type:'ammo', dmg:12, status:{type:'cursed',duration:4,dps:8}, color:'#3dff9d', icon:'💚', maxStack:999 });
defItem(I.ICHORDART, { name:'Ichor Dart', type:'ammo', dmg:12, status:{type:'ichor',duration:5,defense:12}, color:'#e8e060', icon:'💛', maxStack:999 });
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
defItem(I.GOLDPICK, { name:'Gold Pickaxe', type:'tool', power:55, speed:1.3, dmg:8, range:3.2, color:'#ffd75e', icon:'⛏️', maxStack:1, desc:'Mines demonite ore.' });
defItem(I.DEMONITEPICK, { name:'Nightmare Pickaxe', type:'tool', power:65, speed:1.8, dmg:11, range:3.4, color:'#6a5cb8', icon:'⛏️', maxStack:1, desc:'Forged from Demonite and Shadow Scales.' });
defItem(I.DEATHBRINGERPICK, { name:'Deathbringer Pickaxe', type:'tool', power:65, speed:1.8, dmg:11, range:3.4, color:'#c04048', icon:'⛏️', maxStack:1, desc:'Forged from Crimtane and Tissue Samples.' });
// Melee
defItem(I.COPPERSWORD, { name:'Copper Broadsword', type:'melee', dmg:9, speed:0.35, kb:5.5, range:4, color:'#e0834d', icon:'🗡️', maxStack:1 });
defItem(I.COPPERSHORT, { name:'Copper Shortsword', type:'melee', dmg:5, speed:0.217, kb:4, range:1.5, shortSword:true, color:'#e0834d', icon:'🗡️', maxStack:1, desc:'A quick, narrow thrust. Every legend starts somewhere.' });
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
defItem(I.TINPICK, { name:'Tin Pickaxe', type:'tool', power:35, speed:0.7, dmg:4, range:3.0, color:'#c8b090', icon:'⛏️', maxStack:1, desc:'Mines silver ore.' });
defItem(I.LEADPICK, { name:'Lead Pickaxe', type:'tool', power:45, speed:0.9, dmg:5, range:3.1, color:'#8a8a96', icon:'⛏️', maxStack:1, desc:'Mines gold ore.' });
defItem(I.TUNGSTENPICK, { name:'Tungsten Pickaxe', type:'tool', power:50, speed:1.0, dmg:6, range:3.2, color:'#a0a8c0', icon:'⛏️', maxStack:1, desc:'Mines gold ore.' });
defItem(I.PLATINUMPICK, { name:'Platinum Pickaxe', type:'tool', power:60, speed:1.1, dmg:7, range:3.3, color:'#d8f0ff', icon:'⛏️', maxStack:1, desc:'Mines demonite and dungeon brick.' });
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
defItem(I.MOLTENPICK, { name:'Molten Pickaxe', type:'tool', power:70, speed:2.0, dmg:12, range:3.5, color:'#ff6a32', icon:'⛏️', maxStack:1, desc:'Forged from Hellstone. Mines Cobalt ore.' });
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
  var d = ITEMS[id];
  count = count || 1;
  var max = d.maxStack;
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

Inventory.prototype.defense = function() {
  var d = 0;
  for (var s in this.armor) {
    var id = this.armor[s];
    if (id && ITEMS[id]) d += ITEMS[id].def || 0;
  }
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
defItem(I.RED_PHASESABER, { name:'Red Phasesaber', type:'melee', dmg:26, speed:0.25, kb:4, range:4, color:'#ff4058', auto:true, desc:'A laser blade. Mine gems for more.' });
defItem(I.WHITE_PHASESABER, { name:'White Phasesaber', type:'melee', dmg:26, speed:0.25, kb:4, range:4, color:'#f0f0ff', auto:true, desc:'A laser blade. Mine gems for more.' });
defItem(I.YELLOW_PHASESABER, { name:'Yellow Phasesaber', type:'melee', dmg:26, speed:0.25, kb:4, range:4, color:'#ffe14d', auto:true, desc:'A laser blade. Mine gems for more.' });
defItem(I.ORANGE_PHASESABER, { name:'Orange Phasesaber', type:'melee', dmg:26, speed:0.25, kb:4, range:4, color:'#ff9a3d', auto:true, desc:'A laser blade. Mine gems for more.' });
defItem(I.PINK_PHASESABER, { name:'Pink Phasesaber', type:'melee', dmg:26, speed:0.25, kb:4, range:4, color:'#ff8ac8', auto:true, desc:'A laser blade. Mine gems for more.' });
defItem(I.RAINBOW_PHASESABER, { name:'Rainbow Phasesaber', type:'melee', dmg:26, speed:0.25, kb:4, range:4, color:'#ff9de0', auto:true, desc:'A laser blade. Mine gems for more.' });
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
defItem(I.ADAMANTITE_REPEATER, { name:'Adamantite Repeater', type:'ranged', dmg:42, speed:0.3, kb:2, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.ASH_WOOD_BOW, { name:'Ash Wood Bow', type:'ranged', dmg:10, speed:0.417, kb:2, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.BLOOD_RAIN_BOW, { name:'Blood Rain Bow', type:'ranged', dmg:14, speed:0.317, kb:2, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.BLOWGUN, { name:'Blowgun', type:'ranged', dmg:27, speed:0.583, kb:2, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.BLOWPIPE, { name:'Blowpipe', type:'ranged', dmg:9, speed:0.417, kb:2, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.BOREAL_WOOD_BOW, { name:'Boreal Wood Bow', type:'ranged', dmg:6, speed:0.483, kb:2, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.COBALT_REPEATER, { name:'Cobalt Repeater', type:'ranged', dmg:35, speed:0.383, kb:2, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.DEMON_BOW, { name:'Demon Bow', type:'ranged', dmg:14, speed:0.417, kb:2, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
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
defItem(I.SKULL_BOW, { name:'Skull Bow', type:'ranged', dmg:8, speed:0.283, kb:2, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.TENDON_BOW, { name:'Tendon Bow', type:'ranged', dmg:19, speed:0.5, kb:2, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.TIN_BOW, { name:'Tin Bow', type:'ranged', dmg:7, speed:0.467, kb:2, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.TITANIUM_REPEATER, { name:'Titanium Repeater', type:'ranged', dmg:43, speed:0.283, kb:2, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.TUNGSTEN_BOW, { name:'Tungsten Bow', type:'ranged', dmg:10, speed:0.433, kb:2, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.WOODEN_BOW, { name:'Wooden Bow', type:'ranged', dmg:4, speed:0.5, kb:2, ammo:I.ARROW, auto:true, range:999, desc:'A wooden bow. Fires arrows.' });
defItem(I.AERIAL_BANE, { name:'Aerial Bane', type:'ranged', dmg:38, speed:0.5, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.BARREL_LAUNCHER, { name:'Barrel Launcher', type:'ranged', dmg:100, speed:0.667, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.BONE_JAVELIN, { name:'Bone Javelin', type:'ranged', dmg:20, speed:0.417, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.BONE_THROWING_KNIFE, { name:'Bone Throwing Knife', type:'ranged', dmg:14, speed:0.233, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.CELEBRATION_MK2, { name:'Celebration Mk2', type:'ranged', dmg:50, speed:0.1, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.ENDLESS_MUSKET_POUCH, { name:'Endless Musket Pouch', type:'ranged', dmg:7, speed:0.333, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.ENDLESS_QUIVER, { name:'Endless Quiver', type:'ranged', dmg:5, speed:0.333, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.EVENTIDE, { name:'Eventide', type:'ranged', dmg:50, speed:0.5, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.FLINTLOCK_PISTOL, { name:'Flintlock Pistol', type:'ranged', dmg:13, speed:0.267, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.FROST_DAGGERFISH, { name:'Frost Daggerfish', type:'ranged', dmg:17, speed:0.217, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.GATLIGATOR, { name:'Gatligator', type:'ranged', dmg:21, speed:0.117, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.HANDGUN, { name:'Handgun', type:'ranged', dmg:26, speed:0.25, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.HARPOON, { name:'Harpoon', type:'ranged', dmg:25, speed:0.5, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.JAVELIN, { name:'Javelin', type:'ranged', dmg:17, speed:0.4, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.METEOR_SHOT, { name:'Meteor Shot', type:'ranged', dmg:8, speed:0.333, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.MINI_NUKE_I, { name:'Mini Nuke I', type:'ranged', dmg:75, speed:0.333, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.MINI_NUKE_I_I, { name:'Mini Nuke II', type:'ranged', dmg:75, speed:0.333, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.MINISHARK, { name:'Minishark', type:'ranged', dmg:6, speed:0.133, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.MOLTEN_FURY, { name:'Molten Fury', type:'ranged', dmg:31, speed:0.367, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.PAINTBALL_GUN, { name:'Paintball Gun', type:'ranged', dmg:12, speed:0.4, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.PHANTASM, { name:'Phantasm', type:'ranged', dmg:50, speed:0.2, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.PHANTOM_PHOENIX, { name:'Phantom Phoenix', type:'ranged', dmg:32, speed:0.3, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.PHOENIX_BLASTER, { name:'Phoenix Blaster', type:'ranged', dmg:30, speed:0.233, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.POISONED_KNIFE, { name:'Poisoned Knife', type:'ranged', dmg:14, speed:0.25, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.QUAD_BARREL_SHOTGUN, { name:'Quad-Barrel Shotgun', type:'ranged', dmg:14, speed:0.917, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.RED_RYDER, { name:'Red Ryder', type:'ranged', dmg:20, speed:0.633, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.REVOLVER, { name:'Revolver', type:'ranged', dmg:20, speed:0.367, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.S_D_M_G, { name:'S.D.M.G.', type:'ranged', dmg:85, speed:0.083, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.SANDGUN, { name:'Sandgun', type:'ranged', dmg:30, speed:0.267, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.SHURIKEN, { name:'Shuriken', type:'ranged', dmg:10, speed:0.25, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.SPIKY_BALL, { name:'Spiky Ball', type:'ranged', dmg:16, speed:0.25, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.STYNGER, { name:'Stynger', type:'ranged', dmg:45, speed:0.367, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.STYNGER_BOLT, { name:'Stynger Bolt', type:'ranged', dmg:17, speed:0.333, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.SUPER_STAR_SHOOTER, { name:'Super Star Shooter', type:'ranged', dmg:60, speed:0.3, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.THE_BEES_KNEES, { name:'The Bee\'s Knees', type:'ranged', dmg:23, speed:0.383, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.THROWING_KNIFE, { name:'Throwing Knife', type:'ranged', dmg:12, speed:0.25, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
defItem(I.TOXIKARP, { name:'Toxikarp', type:'ranged', dmg:43, speed:0.167, kb:2, ammo:I.MUSKETBALL, auto:true, range:999, desc:'A firearm. Uses bullets.' });
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
defItem(I.ARC_SURGE, { name:'Arc Surge', type:'magic', dmg:180, speed:0.3, kb:3, mana:18, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.BAT_SCEPTER, { name:'Bat Scepter', type:'magic', dmg:45, speed:0.2, kb:3, mana:6, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.BEJEWELED_STAFF, { name:'Bejeweled Staff', type:'magic', dmg:27, speed:0.367, kb:3, mana:15, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.BETSYS_WRATH, { name:'Betsy\'s Wrath', type:'magic', dmg:100, speed:0.333, kb:3, mana:14, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.BOOK_OF_SKULLS, { name:'Book of Skulls', type:'magic', dmg:29, speed:0.533, kb:3, mana:18, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.CRYSTAL_SERPENT, { name:'Crystal Serpent', type:'magic', dmg:40, speed:0.483, kb:3, mana:9, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.DAYBLOOM_STAFF, { name:'Daybloom Staff', type:'magic', dmg:8, speed:0.667, kb:3, mana:5, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.DIAMOND_STAFF, { name:'Diamond Staff', type:'magic', dmg:23, speed:0.433, kb:3, mana:9, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.EMERALD_STAFF, { name:'Emerald Staff', type:'magic', dmg:19, speed:0.533, kb:3, mana:8, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.FLOWER_OF_FROST, { name:'Flower of Frost', type:'magic', dmg:60, speed:0.2, kb:3, mana:11, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.FROST_STAFF, { name:'Frost Staff', type:'magic', dmg:46, speed:0.2, kb:3, mana:12, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.GLACIER_FANG, { name:'Glacier Fang', type:'magic', dmg:11, speed:0.4, kb:3, mana:10, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.GRAY_ZAPINATOR, { name:'Gray Zapinator', type:'magic', dmg:42, speed:0.6, kb:3, mana:16, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.ICE_ROD, { name:'Ice Rod', type:'magic', dmg:28, speed:0.15, kb:3, mana:6, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.KILLING_DECK, { name:'Killing Deck', type:'magic', dmg:22, speed:0.333, kb:3, mana:8, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.LEAF_BLOWER, { name:'Leaf Blower', type:'magic', dmg:48, speed:0.25, kb:3, mana:5, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.LIGHTNING_STRIKE, { name:'Lightning Strike', type:'magic', dmg:150, speed:0.917, kb:3, mana:30, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.MAGIC_DAGGER, { name:'Magic Dagger', type:'magic', dmg:30, speed:0.133, kb:3, mana:6, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.MAGIC_MISSILE, { name:'Magic Missile', type:'magic', dmg:35, speed:0.367, kb:3, mana:14, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.MEDUSA_HEAD, { name:'Medusa Head', type:'magic', dmg:40, speed:0.333, kb:3, mana:15, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.METEOR_STAFF, { name:'Meteor Staff', type:'magic', dmg:50, speed:0.167, kb:3, mana:9, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.MYSTIC_BLOOM, { name:'Mystic Bloom', type:'magic', dmg:20, speed:0.7, kb:3, mana:20, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.NIGHTGLOW, { name:'Nightglow', type:'magic', dmg:50, speed:0.6, kb:3, mana:23, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.ORANGE_ZAPINATOR, { name:'Orange Zapinator', type:'magic', dmg:100, speed:0.6, kb:3, mana:16, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.POISON_STAFF, { name:'Poison Staff', type:'magic', dmg:43, speed:0.6, kb:3, mana:22, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.RESONANCE_SCEPTER, { name:'Resonance Scepter', type:'magic', dmg:70, speed:0.417, kb:3, mana:18, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.RUBY_STAFF, { name:'Ruby Staff', type:'magic', dmg:18, speed:0.467, kb:3, mana:9, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.SAPPHIRE_STAFF, { name:'Sapphire Staff', type:'magic', dmg:18, speed:0.567, kb:3, mana:8, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.STELLAR_TUNE, { name:'Stellar Tune', type:'magic', dmg:85, speed:0.2, kb:3, mana:12, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.THUNDER_ZAPPER, { name:'Thunder Zapper', type:'magic', dmg:24, speed:0.283, kb:3, mana:6, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.TOME_OF_INFINITE_WISDOM, { name:'Tome of Infinite Wisdom', type:'magic', dmg:36, speed:0.417, kb:3, mana:20, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.TOPAZ_STAFF, { name:'Topaz Staff', type:'magic', dmg:16, speed:0.6, kb:3, mana:7, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.WAND_OF_FROSTING, { name:'Wand of Frosting', type:'magic', dmg:15, speed:0.433, kb:3, mana:2, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.WAND_OF_SPARKING, { name:'Wand of Sparking', type:'magic', dmg:14, speed:0.433, kb:3, mana:2, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.WASP_GUN, { name:'Wasp Gun', type:'magic', dmg:31, speed:0.3, kb:3, mana:10, proj:P.MAGICBOLT, auto:true, range:999, desc:'A magic weapon.' });
defItem(I.BALLISTA_CANE, { name:'Ballista Cane', type:'summonstaff', dmg:74, speed:0.5, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.BALLISTA_ROD, { name:'Ballista Rod', type:'summonstaff', dmg:30, speed:0.5, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.BALLISTA_STAFF, { name:'Ballista Staff', type:'summonstaff', dmg:156, speed:0.5, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.BARNACLE_STAFF, { name:'Barnacle Staff', type:'summonstaff', dmg:33, speed:0.5, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.CATTIVA, { name:'Cattiva', type:'summonstaff', dmg:11, speed:0.25, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.CLAY_BUD_STAFF, { name:'Clay Bud Staff', type:'summonstaff', dmg:5, speed:0.6, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.COBWHIP, { name:'Cobwhip', type:'summonstaff', dmg:9, speed:0.583, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.ELECTRIC_EEL, { name:'Electric Eel', type:'summonstaff', dmg:150, speed:0.5, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.EXPLOSIVE_TRAP_CANE, { name:'Explosive Trap Cane', type:'summonstaff', dmg:59, speed:0.5, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.EXPLOSIVE_TRAP_ROD, { name:'Explosive Trap Rod', type:'summonstaff', dmg:24, speed:0.5, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.EXPLOSIVE_TRAP_STAFF, { name:'Explosive Trap Staff', type:'summonstaff', dmg:126, speed:0.5, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.FINCH_STAFF, { name:'Finch Staff', type:'summonstaff', dmg:7, speed:0.6, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.FLAMEBURST_CANE, { name:'Flameburst Cane', type:'summonstaff', dmg:42, speed:0.5, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.FLAMEBURST_ROD, { name:'Flameburst Rod', type:'summonstaff', dmg:17, speed:0.5, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.FLAMEBURST_STAFF, { name:'Flameburst Staff', type:'summonstaff', dmg:88, speed:0.5, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.FOXPARKS, { name:'Foxparks', type:'summonstaff', dmg:20, speed:0.25, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.HOUNDIUS_SHOOTIUS, { name:'Houndius Shootius', type:'summonstaff', dmg:24, speed:0.5, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.LIGHTNING_AURA_CANE, { name:'Lightning Aura Cane', type:'summonstaff', dmg:11, speed:0.5, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.LIGHTNING_AURA_ROD, { name:'Lightning Aura Rod', type:'summonstaff', dmg:4, speed:0.5, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.LIGHTNING_AURA_STAFF, { name:'Lightning Aura Staff', type:'summonstaff', dmg:34, speed:0.5, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.LUNAR_PORTAL_STAFF, { name:'Lunar Portal Staff', type:'summonstaff', dmg:100, speed:0.5, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.MUSHROOM_STAFF, { name:'Mushroom Staff', type:'summonstaff', dmg:8, speed:0.6, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.POSSESSION, { name:'Possession', type:'summonstaff', dmg:110, speed:0.5, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.QUEEN_SPIDER_STAFF, { name:'Queen Spider Staff', type:'summonstaff', dmg:26, speed:0.5, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.RAINBOW_CRYSTAL_STAFF, { name:'Rainbow Crystal Staff', type:'summonstaff', dmg:130, speed:0.5, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.RUINOUS_STAFF, { name:'Ruinous Staff', type:'summonstaff', dmg:40, speed:0.6, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.SLIME_STAFF, { name:'Slime Staff', type:'summonstaff', dmg:8, speed:0.467, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.SLIME_WHIP, { name:'Slime Whip', type:'summonstaff', dmg:15, speed:0.5, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.SOULSCOURGE, { name:'Soulscourge', type:'summonstaff', dmg:17, speed:0.5, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.SPINAL_TAP, { name:'Spinal Tap', type:'summonstaff', dmg:29, speed:0.5, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.STAFF_OF_THE_FROST_HYDRA, { name:'Staff of the Frost Hydra', type:'summonstaff', dmg:100, speed:0.5, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.STARCRASH, { name:'Starcrash', type:'summonstaff', dmg:18, speed:0.5, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.TRUSTY_CATTIVA, { name:'Trusty Cattiva', type:'summonstaff', dmg:22, speed:0.25, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.TRUSTY_FOXPARKS, { name:'Trusty Foxparks', type:'summonstaff', dmg:40, speed:0.25, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.VAMPIRE_FROG_STAFF, { name:'Vampire Frog Staff', type:'summonstaff', dmg:11, speed:0.6, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.VASCULASH, { name:'Vasculash', type:'summonstaff', dmg:19, speed:0.5, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.VULGAR_DISPLAY_OF_FLOWER, { name:'Vulgar Display of Flower', type:'summonstaff', dmg:50, speed:0.5, kb:1, minion:1, range:999, desc:'Summons a minion.' });
defItem(I.TENTACLE_SPIKE, { name:'Tentacle Spike', type:'melee', dmg:20, speed:0.35, kb:5.5, range:4.5, meleeMode:'spear', spearDuration:0.4, projectileOnly:true, persistentProj:true, desc:'A thrusting spear.' });
