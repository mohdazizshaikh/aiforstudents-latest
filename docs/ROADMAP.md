# AI for Students — Product Roadmap

> **M31 DELIVERY CHECKPOINT (2026-11-24):** B1 **35/50** engineering/design tasks evidence-backed; B2 **0/50**. Reusable five-stage learning UI and seven draft Physics/Chemistry/Biology interactive conceptual models, plus structural bilingual completeness checks, are new. **3,292** content reviews, four B1 expert dependencies, six child-safety gates and live school/device/hosting proof remain. [M31 details](M31_SCIENCE_LABS.md) · [B1 dashboard](B1_PROGRESS_DASHBOARD.md). This is not full Class 1–12 coverage or public readiness.


> **M30 IMPLEMENTATION PROGRESS (2026-11-24):** B1 **25/50** engineering/design acceptance items verified, B2 **0/50**. Three new keyboard/Hindi offline Maths mini-labs are coded (not a complete maths syllabus); draft source options include an explicit 12-grade **unverified** topic discovery matrix, safety/teacher/AI contracts and a CI-checked [progress dashboard](B1_PROGRESS_DASHBOARD.md). Human educational reviews **3,285 pending**, live hosting and real classroom/device evidence still missing. [M30 implementation](M30_MATHS_WORKSHOP_QA.md).


> **M29 REBASELINE — 2026-11-24:** The old M1–M28 entries below are **historical engineering milestones and prototypes**, not a complete Class 1–12 smart-learning ecosystem. The current coordinated delivery roadmap is [100 new concrete tasks in two 50-item batches](MASTER_EXECUTION_PLAN.md), with [full-product completion criteria](FULL_PRODUCT_SCOPE_AND_DONE.md). No dates, public child launch or guarantees of complete board/edition syllabus coverage are implied by those 100 tasks.


**Planning rebaseline:** 2026-11-24, **M29 scope and 100-task roadmap**. Historical M1–M28 entries below describe prototypes only; they are not the current full-product delivery plan. Future tasks are **plans**, not deployed features or deadlines.

## Strategy: Discover → Develop → Decide
- **Discover (prototype exists):** game-based exploration and evidence-based Proud Today moments.
- **Develop (expand next):** turn static exercises into a complete **Learn → Try → Play → Understand → Grow** pathway, with materials a teacher can use too.
- **Decide (existing starter; enrich later):** interest-led Future Explorer, real projects, multiple options, and credible pathways without aptitude or destiny claims.

## Completed *prototype coding* milestones
| Milestone | Implemented prototype capability | Status |
|---|---|---|
| M1–M3 | Pattern Quest seed, game rotation and privacy-first storage | Implemented, staging-only |
| M4–M6 | My Growth, Proud Today, Daily Growth | Implemented, staging-only |
| M7–M8 | 8 categories and 40 playable solo game modules | Implemented, not independently illustrated/validated |
| M9 | 3 same-device Grow Together modes | Implemented; no online features |
| M10–M11 | Accessibility hardening and structural content audit | Automated coverage; human approval outstanding |
| M12-A/B | 22 redesigned banks; no *fully* age-identical banks | Structural variation achieved; 54 individual positions still repeat |
| M13 | Future Explorer: 12 interest fields plus offline missions | Implemented as interest-led introduction |
| **M14** | Study Lab: 4 tracks, 8 themes, 32 short bilingual practice checks | Implemented; **63 Node tests + passing GitHub CI** |

The previous line means software exists, **not** classroom efficacy or public launch approval.

## Proposed development sequence
| Milestone | Scope and minimum meaningful vertical slice | Dependencies | Acceptance evidence | Status |
|---|---|---|---|---|
| **M15 — Smart Learning Studio** | One linked learner journey, pilot topics **fractions** and **basic electrical circuits** (provisional, not officially grade-mapped): 5-step learning loop, bilingual explanations, original visuals, hints, revision and official source links; validate a small Class 6–8 concept pilot | Concept source mapping, review workflow, existing M14 progress integration | Two original lesson paths have expert-reviewed claims, working interactive practice, keyboard/Hindi QA, local reset and mobile tests | **FIRST CODING INCREMENT IMPLEMENTED; EDUCATOR AND LIVE STAGING APPROVAL PENDING** |
| **M16 — Virtual Experiment Lab** | Two original fraction strip / two-series-switch simulations with descriptive feedback and keyboard controls | M15 prototype reused; human concept review pending | **77 Node tests + isolated Chromium**; real device and qualified educational approval pending | **FIRST CODING PILOT IMPLEMENTED — STAGING ONLY** |
| **M17 — Smart Classroom & Teacher Kit** | Two original, 5-step bilingual teacher-led plans, projector view, generic roles and 2 printer-friendly worksheets; no roster | M15/M16 prototype reused; educational/safeguarding review still pending | **84 Node tests + isolated Chromium/print smoke pass**; real teacher study, device and human approval pending | **FIRST CODE PILOT IMPLEMENTED — STAGING ONLY** |
| **M18 — AI & Digital Skills Lab** | 4 original bilingual strands × 4 age bands × 2 scenarios = **32 drafted checks**, offline feedback and private browser history; no open chatbot | Qualified educator/Hindi review and safety guidance still pending | **93/93 Node tests**, isolated Chromium 32-scenario playthrough; no real-device/Hostinger validation | **FIRST CODING PILOT IMPLEMENTED — STAGING ONLY** |

**Order is a recommendation, not a promise or release date.** Build small slices that satisfy gates instead of shipping many unreviewed screens.

## Cross-cutting launch work (parallel, blocking public release)
1. Hostinger **private staging**: backup, separate restricted subdomain, HTTPS, actual module/service-worker/network tests, rollback.
2. Educator/Hindi item-by-item review and accessible alternatives; prioritise what is genuinely published in any pilot.
3. Child data/privacy, safe use, legal and incident response; no online social rollout before approval.
4. Real low-end Android / TalkBack / VoiceOver / keyboard / zoom testing; verified corrections.
5. Confirmed domain, truthful canonicals and sitemap, Search Console **only after** public indexing approval.
6. Ethical small-scale teacher/learner pilot and measurable learning usefulness; no hidden trackers or pressure loops.

## Later horizon, NOT committed
- Extend lessons to Grades 1–5 and 9–12, then verified state-board mappings; age bands and school classes remain distinct dimensions.
- Additional regional languages after bilingual content review.
- More genuinely distinct game mechanics and diverse visual, practical and open-ended learning modes.
- Online invitations only after real governance, eligibility/guardian consent, access control, staff-backed incident response and security testing.
- Research on sustainable optional educator services, with the student core remaining free.

## Change control
Every proposed milestone must have a reviewer owner (or **TBD**), explicit content provenance, acceptance criteria, dependencies, and a clear distinction between **implemented**, **tested in staging**, **human-approved**, and **public deployed**. See [MILESTONE_TRACKER.md](MILESTONE_TRACKER.md).

### M15 progress (2026-11-23)
First working fractions and simple circuit-path concept journeys are coded and tested. Four task attempts, two distinct interactive mechanisms, bilingual explanatory drafts, local history and official link-only resource homepages. No chapter/grade mapping or educator signoff; M16–M18 are still planned. See [M15 notes](M15_IMPLEMENTATION_NOTES.md).

### M16 progress (2026-11-23)
**Two original first-pilot simulations coded**: fraction-strip comparison/equivalence and conceptual two-switch series path with two tasks each, Hindi/English drafts, local attempt history and zero network APIs. **77 Node tests and isolated Chromium flow pass**, not real Hostinger or educational validation. **M16 is partially implemented, NOT publicly approved**. M17 classroom kit and M18 AI literacy remain planned. See [M16 implementation](M16_IMPLEMENTATION_NOTES.md).

### M17 engineering status — 2026-11-23
Two original teacher-led five-stage lesson plans, generic role rotation, answer reveal/hide, projector-friendly typography and two printer-friendly bilingual paper worksheets are implemented with no student roster/account. **84/84 Node tests, isolated Chromium interaction and print CSS smoke passed.** Teacher trials, real projector/device testing, qualified educational/Hindi review and public authorization remain pending. [M17 implementation notes](M17_IMPLEMENTATION_NOTES.md). M18 still planned.

### M18 first pilot progress — 2026-11-23
Four deterministic AI/digital-literacy strands and 32 original bilingual age-scaffolded practice checks have been coded with local-history integration. Node QA **93/93** and isolated Chromium 32-check playthrough passed. These are **unreviewed draft lessons**; no generative AI, remote data collection or official curriculum mapping. Public child release, actual assistive technology and Hostinger deployment remain blocked. [M18 notes](M18_IMPLEMENTATION_NOTES.md).

### M19 — Private staging release hardening (2026-11-23)
**ENGINEERING IMPLEMENTED, HOSTINGER NOT DEPLOYED.** Strict self-only Apache CSP/X-Robots-Tag configuration, external print CSS/JS for two original worksheets, inline-free game guides, a deterministic offline release preflight and a read-only HTTPS live-check script. **102/102 Node tests reported in M19 QA and isolated combined M18/worksheet browser smoke passed.** A **public** release preflight deliberately fails while 3,282 human content records and actual child safety/accessibility/hosting evidence are missing. See [M19 QA](../M19_QA_STATUS.md) and [runbook](../STAGING_OPERATOR_CHECKLIST.md).

### M20 — Review operations, not content approval (2026-11-23)
**Next engineering increment:** A deterministic six-queue bilingual reviewer packet and tests to make the 3,282 outstanding human review records actionable. Prioritize a small, supervised, ethical educator pilot and verify actual official grade/edition references before expanding. **No automatic approval, no new child accounts, no live AI, no deployed site.** CI, human reviews and real staging evidence remain separate tasks. [M20 process](M20_REVIEW_OPERATIONS.md). Historical milestone appendices above reflect progress at their respective dates.

### M23 review-evidence workflow (2026-11-23)
**Engineering continuation:** a local-only template and structural validator for subject/Hindi decisions tied to M21's exact source content fingerprints. It prioritizes the 18 Studio/Experiment/Classroom record worklist while preserving a 3,282-record full scope option. **No educational or safeguarding approval is implied**; only authorized qualified reviewers can complete the actual human work. See [M23 guide](M23_REVIEW_EVIDENCE.md). Actual restricted Hostinger/Android school evidence remains a blocking dependency.

### M24 accessible static navigation (2026-11-23)
**Engineering iteration:** Source HTML skip navigation, worksheet main landmarks and a deterministic 23-page structural audit. The cache and source/staging packaging now explicitly version M24; local reviewer evidence is excluded from release ZIPs. **Actual real-device accessibility, educational review, safeguarding and Hostinger HTTPS remain independent P0 gates**. See [M24 QA](../M24_QA_STATUS.md).

### M25 — Browser automation before external private staging (2026-11-23)
Add native ES-module Chromium checks in GitHub CI for bilingual learner workflows, local data/reset, keyboard Skip, print and offline cache in a temporary `localhost` browser secure context. This precedes but does **not replace** real Hostinger HTTPS, qualified educational/Hindi reviews, device accessibility/safeguarding or ethical school feedback. [Details](M25_BROWSER_REGRESSION.md).

### M26 — Responsible child-safeguarding operations preparation (2026-11-23)
A privacy-first, **local-only** draft incident/safety handoff with six required human checks and structural CI verification. Does not activate online student social/chat, deploy hosting or invent accountable people/legal signoff. Operators must still conduct true India-relevant privacy/legal review, supervised school protocol and actual child protection response drill. [M26 details](M26_CHILD_SAFETY_OPERATIONS.md).

### M27 — Private staging release-source parity, not public launch (2026-11-23)
Adds source SHA-256 comparison for all M22 static routes, robots.txt and stronger header checks; also tests that sensitive source and review paths are not readable. CI compares ZIP bytes against checked-out source. This provides a **future manual Hostinger deployment diagnostic**, not a hosted URL or consent/legal signoff. [M27 guide](M27_STAGING_INTEGRITY.md).

### M28 — Practical shared-device browser privacy (2026-11-23)
Hardens privacy on shared phones/computers by propagating a **clear-only, no-student-payload** signal across active tabs from the same origin/browser profile and resetting stale in-memory learning history. Real local Chromium tests cover default tab session and saved opt-in modes. M28 cache/versioned ZIP avoids serving stale local JS after update. Must still test on real Android/older browsers and obtain legal/child-safety review before public use. [M28 guide](M28_SHARED_DEVICE_PRIVACY.md).
