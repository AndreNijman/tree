import { presentMimicArt } from './invasion-art-rosters.mjs';
import { runInvasionHttpSmoke } from './invasion-http-suite.mjs';

await runInvasionHttpSmoke(presentMimicArt);
