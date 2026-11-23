# Project Status Dashboard — AI for Students

**As of 2026-11-23** | **Latest completed baseline: M19 staging hardening; M20 review operations in development** | **Public release: NOT APPROVED**

## Working today in the private prototype
- 40 solo game modules in 8 categories; 3 same-device Grow Together modes.
- Four experimental age bands and 3,200 generated game tasks.
- My Growth, Proud Today and Daily Growth.
- Future Explorer: 12 interest-led pathway cards with offline missions.
- Study Lab: 4 tracks, 8 themes, 32 short bilingual practice checks.
- M19 reported **102/102 Node tests** on its staging baseline; isolated browser smoke is not live HTTPS testing. M20 CI evidence must be checked separately.

## Milestones: first pilots versus future plans
| Stage | Next development increment | Status |
|---|---|---|
| M15 | Two original interactive concept journeys, four practice checks and local history | **FIRST PILOT CODED; unreviewed, live staging pending** |
| M16 | Two fractions/circuit simulations, 4 recorded checks, bilingual drafts | **FIRST PILOT CODED; real devices/educator review pending** |
| M17 | 2 original bilingual teacher-led 5-step plans, projector view and 2 print worksheets | **FIRST PILOT CODED; unreviewed and not school-trialled** |
| M18 | 4 digital literacy strands, 32 bilingual draft scenarios, private practice and no live AI | **FIRST PILOT CODED; expert/real device review pending** |

## Release blockers
- Actual Hostinger staging and real device/browser/service-worker verification.
- Qualified educator/Hindi review of **3,200 games + 32 Study Lab + 4 M15 + 4 M16 + 32 M18 = 3,272 question records**, plus **10 M17 classroom facilitation steps**; 54 game positions repeat across age bands.
- Actual assistive-tech/low-end mobile QA and educational accuracy.
- Child privacy/legal/safeguarding signoff and accountable human operators.
- Verified public domain/canonicals/sitemap, Search Console and deliberate noindex removal only after approval.
- Online friends, accounts and Quick Chat are deliberately **not shipped**.

## What success means next
**Next delivery priority:** bilingual educational review across M1–M18, real Android/projector/Hostinger staging, accessibility and safeguarding before child-oriented public launch. These first pilots do not authorize a public launch.

## Links
[Project Charter](PROJECT_CHARTER.md) · [Roadmap](ROADMAP.md) · [Milestone Tracker](MILESTONE_TRACKER.md) · [Detailed Backlog](IMPLEMENTATION_BACKLOG.md) · [Smart Learning Studio Spec](SMART_LEARNING_STUDIO_SPEC.md) · [Resource Policy](RESOURCE_INTEGRATION_POLICY.md) · [Teacher Pilot](TEACHER_CLASSROOM_PILOT.md) · [Decisions & Risks](DECISIONS_AND_RISKS.md) · [Release Gates](../RELEASE_GATES.md)

### M15 coding status, 2026-11-23
Two original bilingual concept pilots are implemented (fractions and circuit-path). The previously planned full curriculum, source-specific verified chapter resources and independent educational signoff are not complete. M16 pilot has since been implemented; M17–M18 remain planned. [Evidence](../M15_QA_STATUS.md).

### Latest engineering update — M16 first pilot (2026-11-23)
Two interactive conceptual simulations (two fraction strips and a two-switch series path) plus four locally recorded checks have passed **77/77 Node tests** and an isolated Chromium smoke test. This is **not live Hostinger testing, accessible-device approval or educational validation**. M17–M18 remain planned. [Details](../M16_QA_STATUS.md).

### M17 pilot update — 2026-11-23
Smart Classroom Teacher Kit first coding pilot has two bilingual 5-step group plans, rotating generic roles, teacher guidance and two original printable worksheets. **84 automated Node tests** plus isolated UI and print-CSS browser checks passed. Ten teaching-step records remain **unreviewed**; real teacher pilot, Hostinger HTTPS, accessibility and legal/safeguarding signoff remain pending. [M17 QA](../M17_QA_STATUS.md). M18 not started.

### M18 engineering update — 2026-11-23
AI & Digital Skills Lab now includes 32 bilingual original author-draft questions in four distinct topics and four age bands. These are deterministic fixed checks, **not a live AI tutor**. 93 Node tests and an isolated Chromium playthrough pass, with local progress reset verified. Hostinger live deployment, educator/translation signoff, actual Android/screen reader and child protection approval remain undone. [M18 QA](../M18_QA_STATUS.md).

### M19 release safety work (2026-11-23)
`/tools/release-preflight.mjs` reports **staging engineering ready**, not **public release approved**. Strict CSP and redundant noindex are configured; both classroom print sheets now use local styles/scripts. Node QA **101/101**; isolated combined browser smoke passed. **3,282 content/review records lack documented expert approval** (3,272 learner tasks, 10 classroom facilitation steps). A read-only HTTPS verifier and Hostinger operator checklist exist, **but no real Hostinger HTTPS deployment/check has happened**. Child privacy/legal, accessibility and school testing remain blocking.

### M20 code continuation — 2026-11-23
A read-only bilingual review worklist exporter and automated checks are being added on a development branch. It inventories six review queues (3,282 records), identifies source line and version and records **no human approvals**. It does not solve Hostinger staging, real-device evidence, curriculum/translation review or child safety approval. See [M20 review operations](M20_REVIEW_OPERATIONS.md). Public release stays **NOT APPROVED**.
