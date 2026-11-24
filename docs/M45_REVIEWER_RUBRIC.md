# M45 — Draft independent-review rubric

Candidate baseline df18e822356e31235d20020ec154ff53e3e68e87. FP-013 remains BLOCKED_EXTERNAL until qualified independent reviewers accept and calibrate this rubric. Six proposed criteria: accuracy, Hindi/English equivalence, age/prerequisites, safety, accessibility, rights. Generate a local worksheet for 60 pilot-first content records (360 criteria) or the entire 3,324 record inventory (19,944 criteria). These counts are checklist cells, not reviews performed.

Commands:
- node tools/reviewer-rubric.mjs --template rubric-pilot.json
- node tools/reviewer-rubric.mjs --template rubric-all.json all
- node tools/reviewer-rubric.mjs --check rubric-pilot.json

Local ignored review-evidence/ only; no overwrite. Every record is bound to the canonical content version and hash. Distinct subject/language opaque references, valid dates, evidence reference and rationale required. Revision/reject cannot count as audit-ready; only accessibility may have a documented not-applicable decision. Do not store names, school/child data, private signed URLs or confidential source files here; keep underlying evidence in an authorized secure workflow. The rubric is not independently calibrated, reviewer references are not authentication, no decision writes to source queues, no educational or launch approval. Exact-head CI pending. No new DONE_VERIFIED items.
