// One-off: for each ARMOR_SET_DEF ladder, which of its three piece DEFINITIONS survive the Phase-1 prune?
// Determines whether sets stayed playable (defs alive) or went inert (tokens alive, defs cut).
import { readFileSync } from 'fs';
const d = JSON.parse(readFileSync('test-results/audit2/phase2review.json', 'utf8'));
const unreachable = new Set(d.byType.armor.map((r) => r.id));
const items = readFileSync('js/items.js', 'utf8');
const sets = 'COPPER,TIN,SILVER,TUNGSTEN,GOLD,PLATINUM,DEMONITE,CRIMTANE,MOLTEN,COBALT,PALLADIUM,MYTHRIL,ORICHALCUM,ADAMANTITE,TITANIUM,HALLOWED,CHLOROPHYTE,SPECTRE,BEETLE,FROST,SHROOMITE,SPOOKY,SOLAR,NEBULA,VORTEX,STARDUST'.split(',');
for (const s of sets) {
  const parts = [];
  for (const suf of ['HELM', 'CHEST', 'LEGS']) {
    // candidate tokens are any ARMOR token starting with the mat; pick via the I-literal value and the defItem
    const regex = new RegExp("(?:" + s + "[A-Z0-9_]*)" + suf, "g");
    const matches = [...new Set(items.match(regex) || [])];
    const found = matches.filter((tok) => {
      const defRe = new RegExp("defItem\\(I\\." + tok + "\\b");
      return defRe.test(items);
    });
    const one = found.length === 1 ? found[0] : (found.length ? found.join('/') : '(none)');
    let status = 'alive';
    if (found.length === 1) {
      // resolve the id to check reachability
      const litRe = new RegExp("\\b" + found[0] + ":['\"]([a-z0-9]+)['\"]");
      const lit = litRe.exec(items);
      if (lit && unreachable.has(lit[1])) status = 'CUT';
      else if (!lit) status = '?';
    } else if (!found.length) status = '(no token)';
    parts.push(one + '[' + status + ']');
  }
  console.log(s.padEnd(12), parts.join(' '));
}
