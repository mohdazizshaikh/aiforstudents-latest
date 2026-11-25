# AI for Students — Project Charter

> **M112 CANDIDATE — M33/M29 historical baselines retained; FULL PRODUCT NOT COMPLETE; PUBLIC LAUNCH NOT APPROVED.** M109 corrected push/PR 45677028703/45677039536 passed, merged #99 at ef31e420f7ad69975b0c66bba779fa20259f9c5a; M110 45677053762/45677070061 passed, merged #100 at 687f692483b7b50fe357dcaba351033a532cc283; M111 45677246422/45677260241 passed, merged #101 at 7d617fb5df06388454c045a08f3b6b19efcb62b2. All three merged trees identical to tested heads. Scope reset: 40 proposed engineering deliverables in a separate register, five implemented awaiting exact-head CI (SQLite transient repository, bilingual catalog, curriculum planning, synthetic teacher rehearsal, loopback authenticated API). No whole-product percentage increase asserted. Static offline core unchanged, no child accounts or live AI, no production backend decision. Legacy 70/100 unchanged, 25 externally blocked; 3,340 canonical educational reviews, 327 rights criteria, 180 mapping checks, zero verified chapters, six safeguarding gates remain. [Engineering register](PRODUCT_ENGINEERING_REGISTER.json) · [M112 change request](M112_PLATFORM_ENGINEERING_RESET.md) · [Master execution plan](MASTER_EXECUTION_PLAN.md).

> **M29 CHARTER UPDATE — 2026-11-24:** Historical “M14 functional prototype” status below predates the **M28 engineering** baseline. Despite later technical pilots, the agreed full Indian smart-classroom vision is **not finished**. Full Maths/Physics/Chemistry/Biology labs, Class 1–12 edition-wise learning, an AI tutor, adaptive mastery and a teacher dashboard are future deliverables. [Scope and truthful done criteria](FULL_PRODUCT_SCOPE_AND_DONE.md) · [100-task fast-batch roadmap](MASTER_EXECUTION_PLAN.md). Public launch: **NOT APPROVED**.


**Documentation baseline:** 2026-11-24 (M29 full-scope correction)  
**Status:** M28 software engineering prototype with M29 full-product work **planned only**; not deployed to Hostinger, not complete for Class 1–12 and not approved for public child-oriented launch.  
**Canonical code repository:** https://github.com/mohdazizshaikh/aiforstudents-latest

## Mission
Give learners, especially those using shared or inexpensive Android phones in India, free, joyful and meaningful opportunities to **Discover → Develop → Decide**. Combine original educational games, short lessons, hands-on simulations, reflection, teacher-supported classroom activity, and trustworthy links to public learning resources.

The goal is **better opportunities to practise and explore**, not a diagnostic intelligence test, a guaranteed career prediction, or a substitute for qualified teachers.

## People served and access
- Initial focus: India, low-bandwidth mobile access, Hindi and English; extend to more languages only after accurate translation and review.
- Existing experimental age bands: 6–10, 11–14, 15–17, 18+. These are activity bands, **not** evidence of psychometrically calibrated difficulty; a learner may need accessible difficulty choices.
- One phone shared by learners, a teacher's laptop/projector, and fully individual access are all valid contexts.
- Optional local progress; essential activities should remain usable without account creation or surrendering personal information.
- No paid subscription for core student learning, no pressure streaks, public leaderboards, or recruitment rewards for children.

## Product pillars
1. **Discover:** 40 current solo practice modules in 8 domains, My Growth, Proud Today, and 3 same-device cooperative modes.
2. **Develop:** M14 starter Study Lab; proposed M15 Smart Learning Studio, M16 Virtual Experiment Lab, M17 Classroom and Teacher Kit, M18 AI & Digital Skills.
3. **Decide:** Current Future Explorer is interest-led with small offline missions; never assign a definitive career based on game scores.
4. **Trust:** Original/licensed educational material, clear limitations, safeguarding, truthful metrics, optional local-first history, meaningful feedback, inclusive design.

## Non-negotiable engineering constraints
- Existing domain + Hostinger Business shared hosting; **near-zero additional cash spend** is the design constraint, not a claim of unlimited free hosting resources.
- Static HTML/CSS/JavaScript for learning features, small assets, progressive enhancement; no long-running server or paid inference API required for the core.
- Low-end Android, keyboard and screen reader operation, reduced motion, no forced video, no reliance on high bandwidth.
- PHP/MySQL is a *future option* for controlled low-frequency asynchronous adult-eligible rooms after security/legal approval, not an active dependency.
- No strangers, open DMs, contact harvesting, open free chat, unconsented behavioral tracking, identity claims, or public rankings for minors.

## Baseline at M14 — evidence versus approval
| Area | Evidence-backed implementation | Still unapproved |
|---|---|---|
| Game library | 40 playable **modules**, 8 categories, 3,200 generated question records, 4 experimental bands | Not 40 independent animated engines; **3,200/3,200 lack documented educator/Hindi signoff** |
| Co-op | 3 same-device, two-role mission modes | No online friends, chat, or minors' remote social features |
| Development | My Growth, Proud Today, Daily Growth, M14 Study Lab with 4 tracks/8 themes/**32** checks | Not a mapped board/exam curriculum; 32/32 checks lack educator signoff |
| Explore | 12 interest-led field cards with age-scaffolded offline missions | Not a validated career recommendation or eligibility system |
| Quality | Latest M14: **63/63 Node tests** and isolated browser smoke reported; latest GitHub CI passed | Actual HTTPS hosting, child usability, Android assistive technology, legal/safeguarding and real learning impact untested |

The 54 individual game challenge positions reported as identical across all four age bands remain review candidates. Structural age variation is not a fairness or learning-outcome finding.

## Scope and explicit exclusions
**In scope next:** small high-quality bilingual learning slices, approved resource linking, visual interactive experiments, teacher-led group packs, AI literacy without a live AI chat bot, local progress integration, educator-reviewed content and staging QA.

**Out of scope until separate gates:** paid generative AI, broad automated scraping or redistribution of copyrighted textbooks, accounts for children, open multiplayer, unrestricted AI chat, guaranteed exam results, biometric/psychometric profiling, public analytics of children, automatic monetization.

## Release definition
- **Code-ready:** reproducible build, tests green, no obvious broken links, privacy-safe defaults.
- **Private-staging-ready:** live HTTPS domain, backups and rollback, assets fetch correctly, access restricted and noindex maintained.
- **Public-child-ready:** qualified bilingual content review of published scope, accessibility and real-device evidence, child privacy/legal and incident-response approval, support capacity and correct resource licensing.
- **Growth-ready:** consented learner/educator feedback and meaningful quality improvements; SEO and business validation are separate evidence gates.

## Governance and ownership
No individual assignee has been confirmed. Track roles without inventing personnel: product decision owner, engineering owner, educational reviewer, Hindi reviewer, accessibility reviewer, child-safety/legal reviewer, staging/operations owner. A role marked **TBD** is not an approval. The human project owner chooses actual individuals and signs public-release gates.

For current priorities use [ROADMAP.md](ROADMAP.md), [MILESTONE_TRACKER.md](MILESTONE_TRACKER.md), [IMPLEMENTATION_BACKLOG.md](IMPLEMENTATION_BACKLOG.md), [SMART_LEARNING_STUDIO_SPEC.md](SMART_LEARNING_STUDIO_SPEC.md), and root [RELEASE_GATES.md](../RELEASE_GATES.md).

### Current code milestone (2026-11-23)
M15 Smart Studio, M16 Virtual Lab, M17 Classroom Kit and **M18 Digital Skills** now have **first functional prototype increments**. M18 has four original, bilingual digital literacy strands and 32 unreviewed checks. **All are staging-only**; the original project mission and free/local-first child safeguards are unchanged. 3,272 practice questions (plus 10 classroom steps) still require recorded qualified bilingual educational review. Hosting, actual child/teacher pilot and launch approvals are incomplete.
