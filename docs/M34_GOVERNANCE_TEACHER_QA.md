# M34 — Governance, privacy and draft teacher session controls

**Engineering checkpoint only.** No teacher lesson review, licensing approval, live generative AI, validated mastery, real student roster, actual Hostinger/physical device/school verification or public release. Pending review inventory remains 3,304. All four B1 external expert gates remain blocked.

## Work delivered in code

- [AI risk design and budget](B2_AI_TUTOR_RISK_BUDGET.md), [offline hypothetical inference envelope](../tools/inference-envelope.mjs): model stays OFF. Operator supplies all price assumptions, token/cost/latency caps and currency. No provider key or paid network dependency. No cost estimate implies permission to call a model.
- [Adaptive calibration and anonymous-session contract](B2_ADAPTIVE_SESSION_CONTRACT.md): pre-registered validation proposal only, no automatic ability label. Teacher view reports lesson-flow state only; no learner outcomes, attendance, group results or identifiers. Safe browser/session handoff limits documented.
- Opt-in retention guard prevents a peer tab from silently restoring localStorage after remembering is turned off. Explicit clear still erases active peer histories. Existing legacy data is migrated only with stored opt-in. Browsers/profiles, suspended tabs, physical paper and backups remain outside an absolute deletion guarantee.
- Draft teacher organizer uses fixed two original lesson IDs with add/open/reorder/remove/clear and transient state. Both lesson plans are still unreviewed. Queue, projector and answer state reset on explicit history clear. No roster, attendance, upload, score or personal export.
- Existing `teacher-kit/cards/` supports a full five-card draft assignment pack, sourced only from original prompts/group actions; teacher answers excluded from learner data/print. Rights to public distribution and educator approval remain unverified. After initial caching, selected lesson, projector and draft cards are usable without internet in localhost tests.
- [Ethical observer blank template](B2_ETHICAL_OBSERVER_TEMPLATE.json) is a design only, no actual observations or learner data; real school/guardian/legal/ethics permissions required.

## Status boundary

FP-066/067/076/077/078/079 may be closed **only for their stated bounded engineering/design criteria after passing tests**. FP-086/087/088/089 remain blocked by FP-085 genuine qualified review even if prototype code and template pass. Actual licensed/public assignment distribution, school pilot and teacher dashboard are not complete. FP-008 requires a separate immutable commit-to-proof map for every verified work item; a source/test filename alone is insufficient.

## Tests

`tests/m34-governance-teacher.test.mjs` checks budget boundaries, default-off source policy, no learner data in queue/pack, constrained observer template and fail-closed opt-in. Browser checks exercise queue/reorder/reset, draft pack print media, peer opt-out and offline teacher flow. All checks are synthetic engineering tests, not human approval or a school observation.
