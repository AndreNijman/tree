# Terraria lighting gradient review — Luna (2026-10-31)

**Implementation update:** Sol verified this research and completed local renderer
changes after the user's subsequent authorization. See
`test-results/lighting-gradient-20261031/implementation/RESULTS.md` for actual
validation receipts, final screenshots and limitations. The method/status below
describes the research phase, not the current implementation state.

**Method.** Anonymous read-only YouTube browser sampling; frames inspected visually and via 9×9-pixel RGB patch means using the workspace's existing local `sharp` package. Sampled frames, not continuous viewing. No game harness, managed gameplay lane, asset copy, or production code change.

## Reviewed clips (decoded Terraria frames actually inspected, not titles or thumbnails)

| Clip | Review point | Frame file | What it shows |
| --- | --- | --- | --- |
| [30 Custom Sky Islands! — Khaos, 15:02](https://www.youtube.com/watch?v=8gWf89arnrw) | ~0:03 (seek asked for 3:00; decoders report the effective play position) | `test-results/lighting-gradient-20261031/reference/8gWf89arnrw-180s.png` | Bright saturated daytime sky-island over ocean; crisp sky/terrain separation. Custom world, so no vanilla-only claim. |
| [These new Terraria walls let you see LIGHT & DARK perfectly — Terrasteel, 5:04](https://www.youtube.com/watch?v=0kJv5Msj_7s) | ~0:10 | `0kJv5Msj_7s-5s.png` | Brightly lit surface/interior with player and light effects. |
| same clip | ~0:35 | `0kJv5Msj_7s-30s.png` | Very dark enclosed stone with a concentrated cool-blue light pool around the player; strong lit/unlit contrast, deliberately non-standard wall setup. |

Approximate RGB means (compressed YouTube screenshots — visual evidence only, **not** tuning constants and not a matched falloff test): day sky ≈ RGB(98,133,243); dark cave interior ≈ (15,14,21) → (12,9,13) → near (0,0,0); near the light pool ≈ (61,86,150).

## Rejected candidates (attempted, not evidence)

Playback errors, a live-action ad, and a stalled player — no decoded Terraria footage:
- Our First Underground Town! (`90dpX0ndteg`), Gameplay Walkthrough 4K (`cGeNthanxCo`), cave-tour Let's Play (`0JTXeOIUjGM`), Floating Islands Ep.56 (`lf_swtNgnyg`), Let's Play Episode 1 (`mMeAjKCFuEs`).

Never treat requested vs reported seek timestamps, thumbnails, or transcripts as viewed footage. Rejected capture files are preserved, not deleted.

## What the evidence supports (and doesn't)

Supports: bright saturated day sky vs crisp sky/terrain separation; very dark unlit interiors with strongly localized light pools.

Does **not** establish (unobserved, per sampled review): vanilla hill/valley lighting, cave-entry occlusion and surface light entering shafts, normal default-torch hue/falloff (the dark clip uses a deliberate test setup), any surface-to-space transition, altitude-vs-sky-color data, night/space comparison, or absence of shaders (custom-island world and wall-test setup are non-standard).

Tree baselines (from the parallel renderer worker, disposable fixtures, seed 7357, zero browser errors): zero-emissive sealed cave interior renders RGBA (0,0,4,255); matched torch-only control shows localized warm falloff; fixture points 30/80/150 tiles above a test surface all stay day-blue — no darkening at altitude. Full metadata in `test-results/lighting-gradient-20261031/implementation/`.

## Renderer guidance (evidence-bounded)

1. Keep bright blue daytime and near-black unlit caves; preserve localized torch/lava/glow pools.
2. Implement a **continuous world-space altitude blend** toward a dark space palette with daytime-visible stars — Smooth transition, per official `terraria.wiki.gg/wiki/Space`; do not snap at Tree's existing `BIOME.SKY` threshold (≈28 tiles above local surface) and don't add a SPACE biome/gameplay change.
3. Target documented default Color lighting behavior (sub-tile smooth colored light, `terraria.wiki.gg/wiki/Lighting_mode`).
4. Gradient endpoint colors, transition width, and torch parameters are **uncalibrated** from video; treat them as original implementation choices, validated via before/after fixtures.
5. Do not globally brighten caves or dim directly sunlit terrain.

## Status and handoff

- Authoritative evidence summary: `test-results/lighting-gradient-20261031/reference/report.md` (+ `SUPPLEMENTAL.md`).
- Implementation brief for Sol (new coder): `test-results/lighting-gradient-20261031/HANDOFF-SOL.md` — includes the partial unvalidated `js/render.js` patch state and its known issues, validation plan, and hard boundaries (gameplay lanes stay stopped; no commits/deploy/asset copying).
- Video research is closed unless the user supplies vanilla surface→space / cave-entry clips; absence of such tags is documented above.
