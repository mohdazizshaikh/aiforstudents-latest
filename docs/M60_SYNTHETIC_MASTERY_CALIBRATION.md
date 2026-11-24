# M60 — Synthetic mastery calibration harness

Verified baseline M59 64e28e3f3f57503ea88ab11ed80a03730a50f9c1. M58 and M59 exact-head CI passed and merged PRs #47 and #48. M60 turns the disabled M34 mastery hypothesis into a maintainer-only fixed fictional test runner. No runtime import, user profile, real educational task response, network, persistence or activation.

Run `node tools/synthetic-mastery-calibration.mjs` without arguments. Eight invented fixtures exercise positive/negative candidate classification, false positives/negatives, insufficient tasks/sessions/context coverage, and repeats. The threshold is 80% in each context, not an overall average. Identical repeats are deduplicated; conflicting repeats or cross-session reuse of the same task abstain. Additional conservative design choice: each context must span both fictional sessions. This is provisional and needs independent validation. Fictional session labels do not establish actual temporal separation.

Four classified fixtures (one per confusion-matrix cell) and four abstentions are deliberately constructed for regression coverage, not empirical estimates. No real sample, confidence interval, learning-outcome claim or validated mastery. FP-080 remains BLOCKED_EXTERNAL; actual reviewed task pool, authorized study, pre-registration, independent education/privacy/safety review and held-out evidence required. 70/100 scoped items, 3,340 pending reviews, six safeguarding gates unchanged. Exact-head CI required.

Verified CI 45455901159 passed and merged PR #49 at 81c8468a22ce4ad93fedef5d8c8b6ae9e97e9512. Synthetic-only engineering verification; no study or activation.
