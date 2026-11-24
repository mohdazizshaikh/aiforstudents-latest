# M77 — Curriculum review planning and teacher resource discovery (candidate)

Verified M76 base 6d5114aaef32824fe3e63902ac0a2a4311702317. M74–M76 full CI passed and merged.

Curriculum planning CLI: `npm run curriculum:plan` prints the summary; `npm run curriculum:plan -- --export curriculum-planning.json` writes a new local-only report under ignored `review-packet/` (never overwrites). It derives 96 CBSE/Maharashtra grade 1–12 × four subject planning cells from existing 32 source proposals and 180 pending checks, current canonical fingerprints, a 60-model inventory, pending-check priority order and printable resource counts. No proposal means inventory gap, not missing syllabus content. Early-grade science columns are planning categories, not actual official subject structures. No new external source inspection, no textbook copies, no authenticated curriculum, no student data and no private evidence in hosting package.

Teacher card page now offers a fixed subject/type resource finder for 12 basic main, 48 advanced main and 49 supplemental activities. Direct selection feeds the existing worksheet and pack interface. Filters stay in memory only and clear on leaving the mode or privacy reset. No learner inputs, tracking or grade recommendations. All 109 choices / 218 bilingual variants remain drafts.

Added automated inventory reconciliation, bilingual discovery and invalid-filter tests; CI generates the ignored gap report and Chromium exercises offline selection, language, print isolation and reset. Exact-head CI pending; 70/100 scoped tasks unchanged, zero verified chapters and public launch blocked.
