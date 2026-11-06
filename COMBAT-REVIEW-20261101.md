# Combat feel — Terraria reference and Tree work

## Release prerequisite

The user selected deployment of the entire pending build. **`6cbc0bc` is live**
at https://tree.andrenijman.com/ (successful GitHub Pages run 41278613636).
Fresh preflight passed 108 checks and 22 syntax checks. Public app HTML and 21
assets match the commit; one anonymous disposable local world ran 120 normal RAF
updates and paused, zero page errors. Relay unchanged; managed campaigns untouched.
Local receipts: `test-results/release-20261101/`.

## Luna's research

- Full report: `test-results/combat-feel-20261101/reference/report.md`.
- Progression/class matrix and official animation evidence:
  `test-results/combat-feel-20261101/reference/stage-matrix.md` and `evidence/`.
- Starter, pre-Hardmode, early Hardmode, post-mech/Plantera and endgame examples
  retain distinct melee/ranged/magic/summoner engagement loops.
- Use time, use-animation duration, reuse delay, and projectile travel are
  separate from input-to-display latency. Held reuse is an item/settings policy.
- Body contact, melee geometry and projectile collision are separate. Local,
  static and global immunity cannot be replaced by one blanket cooldown.
- Official Copper Shortsword/Broadsword/Cutlass GIF frames were actually decoded
  and inspected, supporting qualitative thrust-versus-overhead swing differences.
  No gameplay footage, precise damage-frame/geometry or latency was measured.
- Parent checked the official Use_time, Autoswing and Invincibility_frame pages.
  Modern wiki/tModLoader mechanics are version-qualified against Tree's mainly
  1.4.4 parity basis; no blanket re-canonicalization or asset copying is planned.

## Tree implementation status

Luna's initial Tree report is a source audit, not fresh executable reproductions.
Its mistaken interpretation of the respawn immunity timer was flagged by the
parent; it is not accepted as ordinary combat immunity evidence.

Luna is authorized to reproduce and fix confirmed issues: false critical-hit
confirmation, dropped short combat taps, and between-update specialized melee
misses if demonstrated. Preserve weapon cadence, damage, resources, progression,
class identity, original art/lighting, saves and multiplayer authority. Do not
replace working archetypes or infer a new balance model from unmeasured footage.

The local implementation now retains brief combat clicks until the next update,
cancels them at UI/pause/map/selection/death boundaries, confirms critical hits
only after accepted impact (including deployed/secondary attacks and splash), and
sweeps specialized melee through its authored movement path rather than sampling
only its endpoint. Weapon stats and ordinary projectile movement are unchanged.

Independent parent checks passed **10/10 edge cases +27/27 stage/class contracts**,
zero browser errors. Broader frozen-source regressions are still being finalized.
These stage fixtures preserve Tree's existing item contracts; they are not an
exact Terraria weapon-signature, balance, timing or full-game parity pass.

Detailed implementation: `test-results/combat-feel-20261101/implementation/report.md`.
Independent review: `test-results/combat-feel-20261101/parent/REVIEW.md`.
New changes remain local and are not part of the already-published release.
Managed gameplay playthroughs remain stopped.
