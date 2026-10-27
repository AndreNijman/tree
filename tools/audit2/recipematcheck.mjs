// One-off: find recipes whose mat ids lack ITEMS definitions (post-prune),
// the direct source of the matsHTML 'reading name' throw in b6quick stage 4.
import { setupAudit, check, assertNoBrowserErrors, finish } from './lib.mjs';

const { browser, page, results } = await setupAudit();
const d = await page.evaluate(() => {
  var bad = [];
  for (var i = 0; i < RECIPES.length; i++) {
    var r = RECIPES[i];
    var missing = (r.mat || []).filter(function (m) { return m && m[0] && !ITEMS[m[0]]; }).map(function (m) { return m[0]; });
    if (missing.length) bad.push({ result: ITEMS[r.result] ? ITEMS[r.result].name : String(r.result), resultId: r.result, station: r.station || null, missingMats: missing, progression: r.after || null });
  }
  // how many are progression-visible right now (i.e. would render)?
  var visible = [];
  if (typeof recipeProgressionMet === 'function') {
    for (var j = 0; j < bad.length; j++) {
      var rec = RECIPES.filter(function (r) { return r.result === bad[j].resultId && (r.station || null) === bad[j].station; })[0];
      if (rec && recipeProgressionMet(game, rec)) visible.push(bad[j].resultId);
    }
  }
  return { totalRecipes: RECIPES.length, badCount: bad.length, bad: bad.slice(0, 20), visibleNow: visible };
});
check(results, 'Recipe mat definition audit', d.badCount === 0, { badCount: d.badCount, visibleNow: d.visibleNow, sample: d.bad.slice(0, 6) });
await assertNoBrowserErrors(results);
await finish(results, browser, 'recipematcheck', { badCount: d.badCount, visible: d.visibleNow });
