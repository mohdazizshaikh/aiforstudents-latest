# M68 — Review change workbench (candidate)

Stacked on M67 8e0c1af0d5cd7e7ecf13644b5912b7cd1f34b2e7; Node/static passed, browser pending at branch creation. Targets review preparation for FP-013, FP-036, FP-085, FP-087, FP-092 and FP-098 without claiming independent review.

Commands (Node 22, clean checkout):
```
npm run review:snapshot
npm run review:supplements
npm run review:compare -- review-packet/change-snapshot.json
```
Snapshot and supplemental output are exclusively created under ignored review-packet by the npm scripts; repeat exports must use a new filename via the direct CLI or intentionally move the old export. Retain an earlier snapshot locally to compare against a later checkout. No canonical queue modification, upload, approval or learner data. Do not commit review packets.

- Snapshot: 3,340 canonical content fingerprints plus six distinct supplemental behavior indicators (3,346 entries; not 3,346 review records).
- Diff: added, removed, changed and unchanged entries by queue and stable ID; rejects malformed/duplicate entries and extra fields. Unchanged is not approval.
- Supplemental worklist: six activities linked to five existing canonical records, control ranges, English/Hindi prompts/hints/caveats, initial and boundary examples, and deterministic full-domain behavior digest covering 3,734 bilingual evaluations. These are engine outputs, not expert reference answers; a reviewer must calculate independently.
- Tests: full inventory, deterministic digest, synthetic changes, changed behavior detection and fail-closed validation. CI generates local-only files and compares a fresh baseline; not attached as release artifacts.

M68 exact-head CI pending. No new content, validated curriculum, human signoff, release approval or master-task completion. 70/100 scoped verified, 3,340 pending educational records. 
