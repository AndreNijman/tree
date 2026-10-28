import { runSegmentedGraphicsCheck } from './segmented-graphics-suite.mjs';

await runSegmentedGraphicsCheck({
  name:'sky-sand', title:'Wyvern, Dune Splicer and World Feeder',
  roster:[
    { kind:'wyvern',type:'WYVERN',count:6 },
    { kind:'dunesplicer',type:'DUNESPLICER',count:7 },
    { kind:'worldfeeder',type:'WORLDFEEDER',count:8 }
  ]
});
