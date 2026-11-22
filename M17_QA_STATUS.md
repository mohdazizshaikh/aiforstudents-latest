# M17 QA — Smart Classroom & Teacher Kit

**Date:** 2026-11-23. **Verdict:** first functional teacher-kit implementation for restricted staging; public child-oriented or school-curriculum release is NOT approved.

## Added
- Two original teacher-led plans, 5 facilitation steps each, ~15 min design estimates (not measured classroom timing).
- Three rotating generic group roles; show/hide teacher guidance; projector-friendly font enlargement; bilingual UI, no student data capture, no login/roster.
- Two original A4 print-friendly HTML worksheets (fraction shares and two-switch conceptual circuit), teacher guidance hidden in print CSS; one teacher guide page.
- Existing M16 Virtual Lab remains accessible as optional shared-screen activity. Paper worksheets usable offline once printed.
- Review queue: 10 unreviewed bilingual teacher facilitation steps; teacher materials and printables need independent educational and Hindi review.

## Checks
- **84/84 Node automated tests**: 77 earlier plus 7 classroom-specific checks.
- **Isolated Chromium smoke:** M15 journeys (4 checks), M16 experiments (4 checks), 2 M17 teacher plans (10 steps), role rotation, answer toggle, projector mode, Hindi switching, optional persistence/history reset; no observed page JavaScript errors.
- **22 static HTML pages, 19 JS modules**, 36 service-worker cache targets, zero missing paths.
- M17 has no student answer/identity inputs or new persistent store. Existing solo Study Lab/local practice behavior remains unchanged.
- Browser harness uses inlined ES modules under isolated Chromium because normal localhost navigation is blocked; **not real HTTPS/Hostinger proof**.

## Pending
- Human educator and bilingual review for 10 classroom facilitation steps and both printables; correct grade/edition mapping.
- Actual teacher-led lesson pilot, real projector/A4 print quality, low-end Android, TalkBack/VoiceOver and privacy/safeguarding approval.
- Hostinger restricted HTTPS staging, module/service-worker lifecycle, backup/rollback and noindex verification.
- Prior unreviewed 3,240 game/learning tasks (3,200 game + 32 M14 + 4 M15 + 4 M16). Online child accounts/chat remain disabled; M18 remains planned.

**Do not present the 15-minute design estimate as measured learning improvement, or the teacher mode as a validated classroom trial.**