import { runWalkingGraphicsCheck } from './walking-graphics-suite.mjs';

await runWalkingGraphicsCheck({
  name:'goblin',title:'Goblin Scout, Peon, Thief and Warrior',invasion:true,
  roster:[
    { kind:'goblinscout',type:'GOBLINSCOUT' },{ kind:'goblinpeon',type:'GOBLINPEON' },
    { kind:'goblinthief',type:'GOBLINTHIEF' },{ kind:'goblinwarrior',type:'GOBLINWARRIOR' }
  ]
});
