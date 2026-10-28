export const pirateArt = {
  name:'pirate',gallery:'pirates',title:'Pirate Deckhand, Corsair, Deadeye, Crossbower and Parrot',event:'pirateinvasion',loot:'pirate',bosses:true,
  specs:[
    { kind:'piratedeckhand',type:'PIRATEDECKHAND' },{ kind:'piratecorsair',type:'PIRATECORSAIR' },
    { kind:'piratedeadeye',type:'PIRATEDEADEYE',shoot:true,cooldown:2.2,shotSpeed:9,damage:44,projectile:'GUNBULLET',color:'#ffd080' },
    { kind:'piratecrossbower',type:'PIRATECROSSBOWER',shoot:true,cooldown:1.8,shotSpeed:6.5,damage:34,projectile:'ARROW',color:'#d8c090' },
    { kind:'parrot',type:'PARROT',fly:true }
  ]
};

export const frostLegionArt = {
  name:'frost-legion',gallery:'frost-legion',title:'Snowman Gangsta, Mister Stabby and Snow Balla',event:'frostlegion',loot:'snow',bosses:false,
  specs:[
    { kind:'snowmangangsta',type:'SNOWMANGANGSTA',shoot:true,cooldown:1.5,shotSpeed:7,damage:30,projectile:'GUNBULLET',color:'#e8f0f8' },
    { kind:'misterstabby',type:'MISTERSTABBY' },
    { kind:'snowballa',type:'SNOWBALLA',shoot:true,cooldown:1.8,shotSpeed:5,damage:32,projectile:'FROSTBOLT',color:'#b8dcf0' }
  ]
};

export const martianInfantryArt = {
  name:'martian-infantry',gallery:'martian-infantry',title:'Martian Grunt, Ray Gunner, Officer and Engineer',event:'martianmadness',loot:'martian',bosses:false,deploys:true,
  lootRolls:[[0.1799,0.1,0.5],[0.18,0.1,0.5],[0.1,0.49,0.5],[0.1,0.5,0.5],[0.6,0.1999,0.5],[0.6,0.2,0.5],[0.6,0.2999,0.5],[0.6,0.3,0.5],[0.99,0.99,0.001]],
  specs:[
    { kind:'martiangrunt',type:'MARTIANGRUNT',shoot:true,local:true,fixedDamage:true,range:320,aimOffset:0,originOffset:12,cooldown:2.4,shotSpeed:6,damage:30,projectile:'LASER' },
    { kind:'raygunner',type:'RAYGUNNER',shoot:true,local:true,fixedDamage:true,range:320,aimOffset:0,originOffset:12,cooldown:2.4,shotSpeed:6,damage:30,projectile:'LASER' },
    { kind:'martianofficer',type:'MARTIANOFFICER' },
    { kind:'martianengineer',type:'MARTIANENGINEER',shoot:true,cooldown:2,shotSpeed:6,damage:36,projectile:'LASER',color:'#68e8d0' }
  ]
};

export const martianHeavyArt = {
  name:'martian-heavy',gallery:'martian-heavy',title:'Gigazapper, Martian Walker and Tesla Turret',event:'martianmadness',loot:'martian-heavy',bosses:false,deploys:true,
  lootRolls:[[0.1799,0.1,0.5],[0.18,0.1,0.5],[0.6,0.2499,0.5],[0.6,0.25,0.5],[0.99,0.99,0.001]],
  specs:[
    { kind:'gigazapper',type:'GIGAZAPPER',shoot:true,cooldown:1.35,shotSpeed:5.5,damage:52,projectile:'PLASMA',color:'#80f0e0' },
    { kind:'martianwalker',type:'MARTIANWALKER',shoot:true,cooldown:1.5,shotSpeed:7,damage:42,projectile:'LASER',color:'#60d8c8' },
    { kind:'teslaturret',type:'TESLATURRET',shoot:true,cooldown:1.25,shotSpeed:5.5,damage:44,projectile:'PLASMA',color:'#80e8ff' }
  ]
};

export const martianSpecialArt = {
  name:'martian-special',gallery:'martian-special',title:'Brain Scrambler, Martian Drone and Scutlix Gunner',event:'martianmadness',loot:'martian-special',bosses:false,completeMartianRoster:true,
  lootRolls:[[0.1999,0.1,0.5],[0.2,0.1,0.5],[0.6,0.2499,0.5],[0.6,0.25,0.5],[0.6,0.2999,0.5],[0.6,0.3,0.5],[0.99,0.99,0.001]],
  specs:[
    { kind:'brainscrambler',type:'BRAINSCRAMBLER',fly:true,ghost:true,shoot:true,range:480,aimOffset:0,originOffset:0,life:5,cooldown:2.4,initialCooldown:1.5,shotSpeed:4.2,damage:46,projectile:'PHANTOMBOLT',color:'#c878e8' },
    { kind:'martiandrone',type:'MARTIANDRONE',fly:true,shoot:true,local:true,fixedDamage:true,range:420,aimOffset:0,originOffset:0,cooldown:1.4,shotSpeed:6,damage:38,projectile:'LASER' },
    { kind:'scutlixgunner',type:'SCUTLIXGUNNER',shoot:true,cooldown:1.25,shotSpeed:8,damage:50,projectile:'LASER',color:'#80e8ff' }
  ]
};

export const pumpkinMoonArt = {
  name:'pumpkin-moon',gallery:'pumpkin-moon',title:'Scarecrow, Splinterling, Hellhound, Poltergeist and Headless Horseman',event:'pumpkinmoon',loot:'pumpkin',bosses:false,
  night:true,noLantern:true,minis:['mourningwood','pumpking'],scenarioStates:['normal','jumping'],captureStates:['normal','jumping'],
  lootRolls:[[0.1,0.3499,0.5],[0.1,0.35,0.5],[0.6,0.4999,0.5],[0.6,0.5,0.5],[0.99,0.99,0.001]],
  specs:[
    { kind:'scarecrow',type:'PUMPKINSCARECROW' },{ kind:'splinterling',type:'SPLINTERLING',hop:true },
    { kind:'hellhound',type:'HELLHOUND' },{ kind:'poltergeist',type:'POLTERGEIST',fly:true,ghost:true },
    { kind:'headlesshorseman',type:'HEADLESSHORSEMAN' }
  ]
};

export const frostMoonInfantryArt = {
  name:'frost-moon-infantry',gallery:'frost-moon-infantry',title:'Gingerbread Man, Zombie Elf, Elf Archer and Nutcracker',event:'frostmoon',loot:'frost-moon',bosses:false,
  night:true,noLantern:true,minis:['everscream','santank','icequeen'],
  lootRolls:[[0.1,0,0.5],[0.6,0.2999,0.5],[0.6,0.3,0.5],[0.6,1 / 3 - 0.0001,0.5],[0.6,1 / 3,0.5],
    [0.6,0.3999,0.5],[0.6,0.4,0.5],[0.6,2 / 3 - 0.0001,0.5],[0.6,2 / 3,0.5],[0.99,0.999,0.001]],
  specs:[
    { kind:'gingerbread',type:'GINGERBREAD',hop:true },{ kind:'zombieelf',type:'ZOMBIEELF' },
    { kind:'elfarcher',type:'ELFARCHER',shoot:true,cooldown:1.8,shotSpeed:6.5,damage:34,projectile:'ARROW',color:'#d8c090' },
    { kind:'nutcracker',type:'NUTCRACKER' }
  ]
};

export const frostMoonHeavyArt = {
  name:'frost-moon-heavy',gallery:'frost-moon-heavy',title:'Krampus, Yeti, Flocko and Elf Copter',event:'frostmoon',loot:'frost-moon',bosses:false,
  night:true,noLantern:true,minis:['everscream','santank','icequeen'],exactGhost:true,frostMoonCoverage:true,
  lootRolls:frostMoonInfantryArt.lootRolls,
  specs:[
    { kind:'krampus',type:'KRAMPUS' },{ kind:'yeti',type:'YETI' },
    { kind:'flocko',type:'FLOCKO',fly:true,ghost:true,bobFlight:true },
    { kind:'elfcopter',type:'ELFCOPTER',fly:true,shoot:true,local:true,fixedDamage:true,range:420,aimOffset:0,originOffset:0,cooldown:1.4,shotSpeed:6,damage:38,projectile:'GUNBULLET' }
  ]
};

export const presentMimicArt = {
  name:'present-mimic',gallery:'present-mimic',title:'Present Mimic',event:'frostmoon',night:true,noLantern:true,mimic:true,
  scenarioStates:['sleeping','awake','charging'],specs:[{ kind:'presentmimic',type:'PRESENTMIMIC',mimic:true }]
};

export const eclipseBaseArt = {
  name:'eclipse-base',gallery:'eclipse-base',title:'Frankenstein, Swamp Thing, Creature from the Deep and Fritz',event:'solareclipse',loot:'eclipse-base',bosses:false,
  noLantern:true,eclipse:true,scenarioStates:['normal','jumping'],captureStates:['normal','jumping'],
  lootRolls:[[0.1,0,0.5],[0.6,0.0799,0.5],[0.6,0.08,0.5],[0.99,0.99,0.001]],
  specs:[
    { kind:'frankenstein',type:'FRANKENSTEIN' },{ kind:'swampthing',type:'SWAMPTHING' },
    { kind:'creaturefromdeep',type:'CREATUREFROMDEEP' },{ kind:'fritz',type:'FRITZ' }
  ]
};
