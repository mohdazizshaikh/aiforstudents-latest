# M54 — Bounded independent educational review batches

Verified M53 baseline 5325521774e89de2f84e141367488ece657060d5; PR #42 CI 45447537186 passed. Candidate partitions canonical review inventory deterministically: pilot-first 76 records, then 33 standard batches of 98–99 records (3,264). Total 34 batches, 3,340 content records and 20,040 six-criterion checklist cells. Every record appears exactly once. Actual decisions remain pending. The full snapshot and batch SHA-256 fingerprints bind worklists to the current inventory; source changes intentionally require regeneration and independent review, not silent carry-forward.

Commands:
- node tools/review-batches.mjs --index
- node tools/review-batches.mjs --template pilot-001 pilot-review
- node tools/review-batches.mjs --check pilot-review

Each new local ignored review-evidence/ directory contains a source-derived bilingual CSV and blank M45 rubric JSON; refuses existing directories. Reviewers use opaque references, no personal data or private source uploads. Structural completeness is audit-ready only, not authenticated reviewer approval. No canonical queue writes, no child data, no publication. FP-098 and educational/rights gates remain blocked. 70/100 scoped items unchanged. Exact-head CI pending.
