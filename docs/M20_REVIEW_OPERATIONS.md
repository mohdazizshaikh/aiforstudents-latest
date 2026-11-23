# M20 — Human review operations: engineering increment

**Date:** 2026-11-23. **Stage:** merged engineering baseline; not an approved launch, not educator certification.

## Why this increment
M19's static preflight counts **3,282 review records still lacking documented human signoff**: 3,200 game tasks, 32 Study Lab questions, 4 Smart Studio checks, 4 Virtual Lab checks, 10 Classroom steps and 32 Digital Skills questions. These counts are an inventory of **records**, not 3,282 distinct lessons. Age-band overlap and the 54 age-repeating positions deserve explicit content review.

## M20 deliverable and boundaries
- Export a deterministic **read-only bilingual reviewer packet** from the existing six JSONL queues, using the archived gzip game queue when the unpacked file is absent.
- Provide source file/line, stable item identifier, content version, English/Hindi draft question and answer/teaching guidance where present, age and topical metadata, and high-level pilot-review priority.
- Produce an aggregate JSON summary using the existing staging content inventory audit, with errors on malformed queue data or missing/duplicate IDs.
- Apply spreadsheet-formula-safe CSV quoting, with no identifying learner records, credentials or third-party content ingestion.
- **Never** silently write approval back to canonical queues. The exported CSV is a *worklist*, not a sign-off record.

## How a qualified human review proceeds
1. Assign a real curriculum/subject reviewer, an independent Hindi-language reviewer and an accountable child-safeguarding owner. Record responsibilities externally; **TBD** is not approval.
2. Scope an ethical **private** pilot: review the small relevant set of Studio, Experiment and Classroom records first, with the actual printable sheets and teacher prompts. Do not imply the unreviewed games and digital content can be shown publicly.
3. Verify grade/board/edition mapping from official materials and check mathematical/scientific correctness, equal-part assumptions, Hindi meaning, age/accessibility support and safety. Official-homepage links are **not** chapter verification.
4. For each proposed published item, record reviewer identity/qualifications, date, content version/hash, exact issue/correction, source/provenance, Hindi and subject decisions, and release scope in an access-controlled evidence log. Do not store children's information.
5. Fix items in source, retest and request independent re-review. Only separately authorized governance can change a public-release decision; exported status columns do not grant it.
6. On real restricted Hostinger HTTPS staging, verify headers and asset loading, offline/cache updates, shared-device privacy, keyboard/TalkBack/VoiceOver and projector/A4 printer behavior. Obtain legal/child-protection signoff and operator incident handling before any child-facing public release.

## Run (source checkout, Node.js 22+)
```bash
npm test
node tools/build-review-packet.mjs --out review-packet
node tools/release-preflight.mjs
node tools/release-preflight.mjs --public  # expected to fail; not a bug
```

The output directory is generated and should be kept out of commits unless specifically reviewed: `review-packet/review-packet.csv`, `review-packet/summary.json`, `review-packet/README.txt`. It can be shared only with authorized real reviewers. No student or reviewer personal information is needed for the export.

## Acceptance / blockers
- [x] M20 PR #1 and merged-main GitHub Actions completed successfully (2026-11-23); this validates code, **not** learning content.
- [x] M20 initial packet inventories six queue types with 3,282 records; M21 extends actual Studio/Experiment teaching-text integrity.
- [ ] Human bilingual educational reviewer(s) **appointed and actual decisions recorded** — pending.
- [ ] Pilot chapter/board references, resource link audit, real school/device/Hostinger evidence — pending.
- [ ] Child legal/safeguarding, accessible release and explicit public launch approval — pending.

**Public release remains BLOCKED** regardless of how many automated checks pass.

### M21 follow-on note
The M20 CSV listed Studio/Experiment review metadata but lacked actual source-engine questions. [M21](M21_REVIEW_INTEGRITY.md) fixes that deficiency and adds content fingerprints. Regenerate any previously exported worklist before review; do not rely on old M20 CSV for those two pilot modules.
