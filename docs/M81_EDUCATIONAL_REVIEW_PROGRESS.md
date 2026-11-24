# M81 — Educational review progress reconciliation and evidence type hardening (candidate)

M78 corrected Node/static and local Chromium jobs passed in run 45486501912; PR #69 merged at cd8bced2ff1f96acd0f9fa0229c7dae00bf3b943. M79–M80 corrected Node/static job passed in run 45486611507; Chromium still running when M81 was started.

M81 extends existing M54 batch validation to a local aggregate progress dashboard for 3,340 canonical educational records, 34 non-overlapping batches and 20,040 rubric criteria (76 pilot-first records / 456 criteria; 3,264 standard records / 19,584 criteria). Missing submissions are explicitly unknown, not completed reviews. Reports include submitted, pending and decided criteria, revision and structurally ready counts by phase and batch. No reviewer/evidence references or rationales in the output; no authenticated approval.

The M45 rubric now explicitly rejects non-string reviewer and evidence references rather than allowing implicit regular-expression coercion. Existing reviewer separation and required decision checks remain unchanged.

Commands (local ignored directories only):
- `npm run review:batches -- --template pilot-001 pilot-local`
- `npm run review:progress -- --summary` (no submissions)
- `npm run review:progress -- --summary pilot-local` (partial)
- `npm run review:progress -- --require-all <all 34 local directory names>` (requires valid submissions, not completed decisions)

CI tests all 34 pending batch fixtures, partial/complete reconciliation, duplicate/stale rejection, synthetic revision and strict reference types, plus CLI smoke tests. No new canonical records or reviewer approvals. 70/100 scoped tasks unchanged, 180 curriculum checks and six safeguarding gates pending, zero verified chapters; public launch remains blocked. M81 exact-head CI pending.
