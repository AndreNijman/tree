# Playtest continuity

For gameplay testing, read `PLAYTESTING.md` before creating a browser harness.

- Use `tools/playtest-session.mjs` for new/resumed managed playtests. Run its persistent `start` with the shell tool's `background: true`; never kill it merely because an AI agent pauses or runs out of usage.
- Before taking over, run `node tools/playtest-session.mjs handoff --lane NAME` to verify the authoritative checkpoint referenced by `latest.json`, then read that lane's `HANDOFF.md` and recent `events.jsonl`. Root HANDOFF files are convenience caches and can lag after a crash. Claim the existing controller with a distinct model/session owner identifier. Continue the same world, objectives, and frozen source; do not repeat setup or overwrite prior evidence.
- Keep next steps, known issues, observations and evidence paths updated with `note`. Each command ends browser-frozen and checkpointed; ordinary owner expiry also pauses the lane without needing model tokens.
- On a user pause, run `node tools/playtest-session.mjs pause-all` before stopping agents. This protects managed controllers only; do not claim that unrelated legacy harnesses are covered.
- After browser/controller loss, use `start --lane NAME --restore`. Disclose any unsaved-state rollback and save/load enemy-clearing; a storage export is not a serialized live fight. Never silently replace a missing checkpoint with a fresh world or a different source build.
- All playtest gameplay uses normal physical inputs and disposable saves. Read-only scouting is instrumented assistance, not unaided organic play. No grants, teleports, manual stepping, time/health edits, forced clicks, real player saves, commits or deployment unless separately authorized.
- Do not count launches, partial runs, or candidate harness passes as full gameplay/regression success. Preserve failed attempts, distinguish harness errors from game bugs, and verify claims against receipts.

These instructions concern playtest infrastructure; they do not authorize unrelated game changes or destructive cleanup.
