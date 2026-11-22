# AI for Students — Product Roadmap

**Planning date:** 2026-11-23. **Version:** roadmap-v1. Proposed future milestones are **plans**, not deployed features or deadlines.

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
| **M15 — Smart Learning Studio** | One linked learner journey, pilot topics **fractions** and **basic electrical circuits** (provisional, not officially grade-mapped): 5-step learning loop, bilingual explanations, original visuals, hints, revision and official source links; validate a small Class 6–8 concept pilot | Concept source mapping, review workflow, existing M14 progress integration | Two original lesson paths have expert-reviewed claims, working interactive practice, keyboard/Hindi QA, local reset and mobile tests | **PLANNED — NOT CODED** |
| **M16 — Virtual Experiment Lab** | Lightweight mobile-first virtual fractions manipulation and simple circuit-path simulation; descriptive feedback, reset and accessible alternative | M15 lesson schema and educational review | Independent reference checks, no real-hardware safety implication, touch/keyboard alternatives, offline/low-bandwidth test | **PLANNED — NOT CODED** |
| **M17 — Smart Classroom & Teacher Kit** | Projector-friendly screen, teacher-run small-group activity, same-device handoff, original printable worksheet and teacher guide, no student roster | M15/M16 reviewed lessons, safeguarding guidance | Runs with one screen, does not collect student identity, print layout reviewed, teacher pilot feedback | **PLANNED — NOT CODED** |
| **M18 — AI & Digital Skills Lab** | Responsible AI literacy: what AI can/cannot do, pattern recognition, digital privacy, misinformation and simple computational-thinking challenges | Educational + safety review | Clear non-generative lessons, age-appropriate examples, no open chatbot, local-only tasks and corrections | **PLANNED — NOT CODED** |

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
