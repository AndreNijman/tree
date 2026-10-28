import { runWalkingHttpSmoke } from './walking-http-suite.mjs';

await runWalkingHttpSmoke({
  name:'crawler',roster:[
    { kind:'crab',type:'CRAB' },{ kind:'crawdad',type:'CRAWDAD' },
    { kind:'seasnail',type:'SEASNAIL' },{ kind:'salamander',type:'SALAMANDER' }
  ]
});
