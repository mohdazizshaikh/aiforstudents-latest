# M21 — Bilingual review-packet content integrity

**Date:** 2026-11-23 · **Scope:** Improve reviewer evidence for pending educational records. **Not educator approval, real device QA, hosting deployment, or public release.**

## Defect fixed
The M20 CSV was sourced primarily from six review metadata queues. **M15 Studio and M16 Experiment queue records contain IDs/review flags but not their actual interactive bilingual prompts**, so an exported worklist did not give a reviewer enough to check the lesson. M21 reads the original author-draft content from the deterministic `assets/studio-engine.js` and `assets/experiment-engine.js` for those rows, without modifying the engines or source JSONL.

## Engineering changes
- Enrich the four Studio and four Experiment records with authored English/Hindi question, concept/overview and optional offline paper activity, teaching hint, explanations where present, and source JS file path.
- Include existing worksheet/classroom questions and guidance; preserve source queue + line numbers for each of the 3,282 review records.
- Add a deterministic SHA-256 `content_sha256` over the normalized reviewer-visible content. If an exercise is changed, its fingerprint should change. A status-only review flag change does **not** change the fingerprint. This is change detection, **not authenticity or human signoff**.
- Explicitly reject missing or out-of-sync Studio/Experiment item IDs and engine content versions, rather than export stale/unrelated content.
- Distinguish interactive simulation state-dependent checks from a fixed answer key; these tasks require code/state/teacher review.
- Preserve UTF-8 Hindi and spreadsheet-formula escaping. No child identities, analytics, teacher names or new network calls.
- Existing `npm run review-packet` writes the versioned v2 worklist to ignored `review-packet/` only; `node tools/release-preflight.mjs --public` still intentionally blocks release.

## Reproducible checks
```sh
npm test
npm run review-packet
node tools/release-preflight.mjs
node tools/release-preflight.mjs --public  # must remain nonzero
```

Reviewers can compare `content_sha256`, queue ID/version, source code, and actual displayed activity. Neither content hashing, CSV output nor a passing CI run changes the review queues' `pending` flags. **Actual qualified subject/Hindi/safeguarding reviewers must verify and sign exact item versions in a controlled review record.** The M20 worklist is still a starting point, not a management console or legal evidence.

## M21 QA evidence and open gates
- Engineering branch and tests: see GitHub PR/CI; counts must be checked after merged run.
- Human 3,282 reviews: **pending**.
- Confirmed curriculum edition/chapter, verified topic-specific official links: **pending**.
- Real Hostinger restricted HTTPS install, rollback, low-end Android/screen reader/print and ethical school pilot: **pending**.
- Child-safety/legal and public launch authorization: **not granted**.

Linked work: [M20 process](M20_REVIEW_OPERATIONS.md), [Milestone Tracker](MILESTONE_TRACKER.md), [Release Gates](../RELEASE_GATES.md), [Open review issue](https://github.com/mohdazizshaikh/aiforstudents-latest/issues/3).
