# M78 — Board-specific curriculum review execution batches (candidate)

Base: merged M77 `71abd08b0351ee0ef2d8815b48b690a694c8c0e9`. M77 PR-branch CI reported success; merged-main CI was still running at inspection. M78 adds local-only execution batches for the existing 32 source-linked proposals and all 180 pending checks without splitting individual mapping records.

| Batch | Board | Mappings | Pending checks |
|---|---|---:|---:|
| cbse-001 | CBSE | 11 | 55 |
| cbse-002 | CBSE | 11 | 55 |
| maharashtra-001 | Maharashtra | 10 | 70 |

Run `npm run curriculum:batches -- --index`, then `npm run curriculum:batches -- --template cbse-001 cbse-001.json`. The output is a new ignored local file under `review-evidence/`; the command refuses overwrites. Qualified reviewers may record opaque references and factual notes only, with no student or personal information. Validate using `npm run curriculum:batches -- --check cbse-001.json`. Other batches use their own IDs and filenames. The validator binds membership to the full current inventory and batch fingerprints and delegates decision validation to M62. Structurally ready is not authenticated approval.

Regression tests exercise inventory reconciliation, partition size, deterministic output, cross-board substitution, stale fingerprints, missing/duplicate mappings, incomplete checks, invalid evidence, and synthetic pass/revise decisions. CI generates and validates all three empty templates; no private output is published. Exact-head CI pending. No new chapter mapping, content approval, actual reviewer or learner evidence, or public release authorization. 70/100 scoped items remain; FP-016–020 remain blocked until independent evidence.
