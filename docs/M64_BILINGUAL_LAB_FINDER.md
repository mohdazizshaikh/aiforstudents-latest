# M64 — Bilingual local concept discovery (candidate)

Baseline M63 merge 05646a87e5ca2c76c1f614126921dd3b4d68ce18; CI run 45458529448 succeeded.

Implemented across all 48 advanced draft labs: English/Hindi title and stable-ID matching; Unicode NFC normalization, case/whitespace normalization, bounded 80-character input; subject constraint; explicit keyboard-accessible result opening; empty/no-match feedback; clear and shared-device privacy reset. Existing subject dropdown remains available. Search uses only existing titles and IDs, no external requests, analytics, storage, learner history, grading or AI inference. No curriculum or human approval is added. No additional canonical educational record; existing M63 ratio fingerprint remains the changed record from M63.

New deterministic test suite and offline Chromium regression appended. Exact-head CI pending; do not interpret test definitions as passed results or physical accessibility evidence.

Master register remains B1 46/50 + B2 24/50; 3,340 pending human content reviews, 32 mapping proposals / 180 review checks, six safeguarding gates, zero verified chapters. FP-036 review pending; FP-086/088 code complete tested but FP-085 blocked; FP-087 in progress pending independent rights/approval. Public release blocked.
