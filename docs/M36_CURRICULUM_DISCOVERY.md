# M36 draft Class 1–12 topic discovery

M35 PR #24 merged at d90c20b8084f40b965aeaef1dafe32527d487234; exact tested M35 head ced1a802eb49827ad97c705dd93eec13929b29d0, CI run 45351860435. FP-008 and FP-079 scoped engineering acceptance: 70/100 (46 B1, 24 B2). The M36 branch is not merged and its own tests need verification.

## Deliverable

A bilingual static discovery section in the existing cached Virtual Experiment Lab guide: 12 grade disclosures, 48 topic lenses, all 24 existing interactive model IDs and explicit gaps. The selection links to existing lab sections, not an exact model deep link. Early-grade science lenses do not imply separate official subjects. No new lessons or grade-based scoring, learner records, external content copies, paid API, tracking, or additional route. English/Hindi topic labels are author drafts. 3,304 existing educational records remain pending; navigation metadata additionally needs review, not counted as a new instructional record.

FP-016–020 remain BLOCKED_EXTERNAL: no chapter/edition verification or educational approval. Reviewer workflow: record board/stream, grade, book and exact edition, chapter/outcome reference, rights/permission, original model version, suitability and separate Hindi/subject/safety decisions; then use the existing evidence queue for actual lesson approvals. Official provider homepages are link-only. No affiliation or complete syllabus claim.

Tests validate fixed model inventory, bilingual labels, subject consistency, all 12 grades, 48 lenses, explicit gaps, no approved chapter, static generated guide parity and offline Chromium keyboard/navigation. Physical device and independent review remain separate.

## Remaining gates

Full Class 1–12 content authoring, subject/Hindi review, school pilot, real deployment, legal/child safety, approved-source retrieval and validated mastery remain incomplete. No public release approval.

## M36 first CI correction

Push CI 45352316632: Node/static job passed, Chromium failed navigating to the precached `/virtual-experiment-lab/#curriculum-discovery` URL offline. Service worker navigation cache key now strips the fragment as well as query, preserving the original browser navigation URL; only exact allowlisted static paths are returned. Cache suffix incremented to m36-r2. Existing offline fragment browser regression stays intact; corrected head still needs CI.

## Four additional interactive models — M36 expanded candidate

New: square function y=x² and opposite inputs, ideal one-dimensional F=ma, symbolic H₂O atom counts, hypothetical cell diagram magnification in millimetres. Reuse existing keyboard controls, bilingual numeric tables and SVGs; no real measurements or procedures. Review queue: four new unreviewed version-1 entries, current total 3,308. Discovery catalog now references all 28 existing model IDs; still zero verified chapters. No new HTML route, storage, external content or AI service. New and expanded browser/Node tests pending exact-head CI.

Second browser run 45352760275 successfully opened the fragment guide offline and reached the subsequent related-link assertion. The browser regression now waits for the new document's load and module options before checking the intended fragment and all 16 options. This is a synchronization correction, not a removed assertion. Exact final-head CI still required.

CI run 45353032860 found three stale aggregate count assertions: pilot review scope grew from 40 to 44, and the full queue from 3,304 to 3,308. Updated only those expected inventory counts; per-model, review-integrity and public-gate assertions remain intact. Exact-head CI required.
