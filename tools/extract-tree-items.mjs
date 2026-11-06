// Extract Tree's full ITEMS catalog to test-results/terraria-item-parity-20261102/baseline/tree-items.json
// Disposable browser, no managed campaigns. Research tooling only; no production edits.
import { mkdirSync, writeFileSync } from 'node:fs';
import { setupAudit, finish } from './audit2/lib.mjs';

const out = 'test-results/terraria-item-parity-20261102/baseline';
mkdirSync(out, { recursive: true });
const { browser, page, results } = await setupAudit();
try {
  const catalog = await page.evaluate(() => {
    const safe = [];
    for (const key in ITEMS) {
      const def = ITEMS[key];
      const copy = {};
      for (const field in def) {
        const v = def[field];
        if (typeof v === 'function') { copy['__fn_' + field] = v.name || 'fn'; continue; }
        try { JSON.stringify(v); copy[field] = v; } catch { copy[field] = String(v); }
      }
      safe.push(copy);
    }
    // Include the I.<KEY> constant names so items can be matched to wiki pages later.
    const idKeys = {};
    for (const key in I) idKeys[key] = I[key];
    return { count: Object.keys(ITEMS).length, idKeys, items: safe, version: typeof VERSIONS !== 'undefined' ? VERSIONS : null };
  });
  writeFileSync(out + '/tree-items.json', JSON.stringify(catalog, null, 1));
  const byType = {};
  for (const item of catalog.items) byType[item.type || '(untyped)'] = (byType[item.type || '(untyped)'] || 0) + 1;
  console.log('Extracted ' + catalog.count + ' Tree items:', JSON.stringify(byType));
} finally {
  await finish(results, browser, 'extract-tree-items');
}
