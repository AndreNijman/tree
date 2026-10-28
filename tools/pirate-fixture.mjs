import { pirateArt } from './invasion-art-rosters.mjs';
import { installInvasionFixture, runInvasionScenarios } from './invasion-art-fixture.mjs';

export const installPirateFixture = page => installInvasionFixture(page,pirateArt);
export const runPirateScenarios = runInvasionScenarios;
