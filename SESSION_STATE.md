# SESSION_STATE — Batch 76 (vanilla enemy/critter roster)

> **STATUS: COMPLETE — merged to main.** This file is deleted in the merge commit.
> Final state: 11 species shipped, playtest 122/122 (run 3x green), CONTEXT.md/PARITY.md updated, cache-bust v=20260901-batch76.

## Where we were

- Branch `batch-76` (based on main `8473870` = Batch 75). Workflow note: `drive/workflows/tree-batch-76.md`.

## Checkpoints (all done)

- [x] C1 — Audit + roster decision + this file (commit 02ce272).
- [x] C2 — const.js `E` ids 321–331 (bf19f65).
- [x] C3 — entities.js ENT_DEF + AI + drops.
- [x] C4 — render.js cases.
- [x] C5 — main.js pools + Penguin critter + Meteor Head crater scan.
- [x] C6 — playtest 122/122, docs, merge to main, delete this file.

## Lessons (for Batch 77)

- `pool.push` with a p%-roll makes the entry ~p%/poolSize per pick — test sampling needs thousands of iterations (a 6% roll asserted at 80 picks flakes; verified empirically at 2-7 hits/500).
- pickEnemy's graveyard override returns the Ghost pool early for surface columns with graveyard strength >= 7 — keep that in mind when sampling near spawn.
- render.js drawEnemy has no default case; a species without a `case` renders invisible.
- Bestiary catalog derives from ENT_DEF automatically; update the B73 count assertion when adding species.
