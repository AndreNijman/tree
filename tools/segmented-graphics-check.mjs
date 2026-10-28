import { runSegmentedGraphicsCheck } from './segmented-graphics-suite.mjs';

await runSegmentedGraphicsCheck({
  name:'segmented', title:'Bone Serpent, Giant Worm, Digger and Tomb Crawler',
  roster:[
    { kind:'boneserpent',type:'BONESERPENT',count:5 },
    { kind:'giantworm',type:'GIANTWORM',count:5 },
    { kind:'digger',type:'DIGGER',count:5 },
    { kind:'tombcrawler',type:'TOMBCRAWLER',count:4 }
  ]
});
