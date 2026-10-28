import { runSegmentedHttpSmoke } from './segmented-http-suite.mjs';

await runSegmentedHttpSmoke({
  name:'segmented', roster:[
    { kind:'boneserpent',type:'BONESERPENT',count:5 },
    { kind:'giantworm',type:'GIANTWORM',count:5 },
    { kind:'digger',type:'DIGGER',count:5 },
    { kind:'tombcrawler',type:'TOMBCRAWLER',count:4 }
  ]
});
