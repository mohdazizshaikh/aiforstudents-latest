# M17 Smart Classroom & Teacher Kit — First Implementation

**2026-11-23 | Status:** original teacher-led private staging **prototype coded; school pilot/public release NOT approved**.

## Deliverables
- Interactive teacher mode on homepage `#classroom`, original guide at `/teacher-kit/`.
- Two original plans: **Fraction Shares** and **Two Switches, One Path**; each has 5 guided phases (Prepare, Predict, Explore, Explain, Apply).
- No child names, accounts, rosters, attendance, individual records, scoring, pressure streaks or remote chat in Teacher Mode. Generic group roles rotate locally in memory only.
- Teacher guidance shown only on request; accessible button controls, bilingual English/Hindi drafts and optional projector-enlarged lesson typography.
- Two original printable HTML worksheets under `/teacher-kit/worksheets/fractions/` and `/teacher-kit/worksheets/circuits/`, with paper drawing tasks and teacher answer guidance hidden during printing.
- Connects to M16 experiments as optional demonstration; no real wiring, no content scraping or claim of NCERT/DIKSHA endorsement.
- 10 facilitation-step records in `CLASSROOM_CONTENT_REVIEW_QUEUE.jsonl` (all pending human educator/Hindi signoff). Not 10 separately scored student tasks.

## Automated and browser validation
- 84/84 Node tests passed (77 previous + 7 M17 classroom-specific).
- Isolated Chromium checked 2 classroom plans × 5 steps, group role handoff, reveal/hide, projector toggle, Hindi UI and no student-history alteration; M15/M16 regression flows also passed.
- Isolated Chromium print styles confirmed teacher-only answers/buttons hidden in print layouts for both worksheets.
- Static packaging: 22 HTML pages, 19 JavaScript modules and 36 service-worker paths with no missing references. Browser harness inlined ES modules; it **does not** test real Hostinger/HTTPS or hardware printers.

## Remains pending
1. Actual school/teacher pilot, informed institutional/parental safeguards where needed and human incident owner.
2. Expert bilingual educational review of two lesson plans, 10 steps and worksheets; grade, edition and content accuracy.
3. Real projector/A4 print test and screen reader, Android/low-bandwidth usability.
4. Hostinger restricted staging, SSL, cache upgrades, rollback, privacy and security header checks.
5. Existing prior learning content reviews and production child-safety/legal approval.

**M18 AI & Digital Skills is planned, not implemented by M17.**
