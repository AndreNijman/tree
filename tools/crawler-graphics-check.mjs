import { runWalkingGraphicsCheck } from './walking-graphics-suite.mjs';

await runWalkingGraphicsCheck({
  name:'crawlers',title:'Crab, Crawdad, Sea Snail and Salamander',
  roster:[
    { kind:'crab',type:'CRAB' },{ kind:'crawdad',type:'CRAWDAD' },
    { kind:'seasnail',type:'SEASNAIL' },{ kind:'salamander',type:'SALAMANDER' }
  ]
});
