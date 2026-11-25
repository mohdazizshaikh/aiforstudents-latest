# M98 — Combined independent-reference activity worklist (candidate)

**Verified:** both exact-head CI runs 45568745770 and 45568728693 passed; PR #88 merged at 9f9f31f4b2855513e5a8d5e71836a53615f1cef5. No independent educational approval.

Extends M97 to 49 supplemental activities, each with two reproducible input states (98 new input cases). Integrates the 60 existing main-model fixtures unchanged in a namespaced 109-activity worklist, 218 cases total. The separate computed-output inspection command exposes only source-engine outputs, explicitly not independent references. Use it only after independent reference derivation; this sequence is an operator procedure, not an authenticated technical gate. Template excludes computed results; decisions and opaque external reviewer/reference references remain blank. Strict structural validation does not authenticate references or assess correctness. No learner data.

Commands:
- `npm run review:activity-fixtures -- --summary`
- `npm run review:activity-fixtures -- --template activity-fixtures.json`
- `npm run review:activity-fixtures -- --check activity-fixtures.json`
- `npm run review:activity-fixtures -- --computed ratio-algebra:equation`

Evidence files are local under ignored review-evidence/, simple filename, exclusive creation (0600 on POSIX), no final-component symlink reads, file size cap, aggregate reports omit submitted references. Do not commit private evidence. 49 supplemental and 60 main integration tests plus one aggregate test; 110 total named tests. CI validates blank worklist and removes generated fixture file. M97 existing CLI/schema remain compatible. M95–M97 current push Node/static passed, Chromium pending at branch creation. FP-092 remains externally blocked pending qualified expert reference evidence. 70/100 scoped tasks unchanged. No public release authorization. Exact-head CI pending.
