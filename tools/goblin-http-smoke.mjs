import { runWalkingHttpSmoke } from './walking-http-suite.mjs';

await runWalkingHttpSmoke({
  name:'goblin',invasion:true,roster:[
    { kind:'goblinscout',type:'GOBLINSCOUT' },{ kind:'goblinpeon',type:'GOBLINPEON' },
    { kind:'goblinthief',type:'GOBLINTHIEF' },{ kind:'goblinwarrior',type:'GOBLINWARRIOR' }
  ]
});
