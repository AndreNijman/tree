import { runSegmentedHttpSmoke } from './segmented-http-suite.mjs';

await runSegmentedHttpSmoke({
  name:'sky-sand', roster:[
    { kind:'wyvern',type:'WYVERN',count:6 },
    { kind:'dunesplicer',type:'DUNESPLICER',count:7 },
    { kind:'worldfeeder',type:'WORLDFEEDER',count:8 }
  ]
});
