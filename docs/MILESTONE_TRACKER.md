# Milestone and Release Tracker

**Snapshot:** 2026-11-23 | Source of truth for current status: repository code/tests plus [M14_QA_STATUS.md](../M14_QA_STATUS.md) and [RELEASE_GATES.md](../RELEASE_GATES.md).

### Status vocabulary
- **Implemented (prototype):** code exists and has reported automated tests.
- **Planned:** design/backlog only, no claim of code.
- **Pending evidence:** implementation or process exists but required external validation is missing.
- **Blocked:** cannot responsibly start public-facing or sensitive rollout without prerequisite review.
- **Released:** deployed to approved public domain (currently **none**).
- Owners marked **TBD** have not been appointed.

## Feature milestones
| ID | Deliverable | Code | QA / review | Next actionable dependency | Owner |
|---|---|---|---|---|---|
| M1–M8 | 40 games across 8 categories | Implemented | Automated; educator review pending | Source review and age-equivalence issues | Engineering TBD |
| M4–M6 | Progress, daily plan, truthful achievements | Implemented | Automated; privacy-device testing pending | Shared-device privacy pilot | Privacy + QA TBD |
| M9 | 3 same-device cooperative modes | Implemented | Browser smoke; school trial pending | Classroom guidance and teacher observation | Teaching TBD |
| M10–M11 | Accessibility and content-audit tooling | Implemented | Human screen reader/Hindi review pending | Real devices, qualified reviewers | Accessibility TBD |
| M12-A/B | Age-variation redesign | Implemented | Structural pass; 54 item positions still identical | Content signoff and targeted corrections | Content TBD |
| M13 | 12-field Future Explorer | Implemented | Pathway and external link accuracy review pending | Expert pathway review | Content TBD |
| **M14** | Study Lab, 32 bilingual checks | **Implemented** | **63/63 Node tests, GitHub CI green; 32/32 unreviewed** | Human correctness/Hindi review | Content TBD |
| **M15** | Smart Learning Studio: two concept pilot journeys | **Partial prototype implemented** | 69 Node tests and isolated Chromium; no educational signoff or live Android/HTTPS | Expert/Hindi review, chapter mapping, accessibility, restricted Hostinger staging | Product/Content TBD |
| **M16** | Virtual Experiment Lab | **Planned** | Not applicable yet | Approved M15 schemas and simulation truth tables | Engineering/Teaching TBD |
| **M17** | Classroom & Teacher Kit | **Planned** | Not applicable yet | Reviewed lessons + teacher needs discovery | Teaching TBD |
| **M18** | AI & Digital Skills Lab | **Planned** | Not applicable yet | AI literacy + child-safety content outline | Teaching/Safety TBD |

## Operational and safety gates (not milestones)
| ID | Workstream | Status | Proof required before mark complete | Owner |
|---|---|---|---|---|
| OPS-01 | Actual Hostinger restricted staging + backup | Pending evidence | Confirmed HTTPS, backup/restore, access restriction, rollback | Operations TBD |
| OPS-02 | Actual service worker/module fetch and no JS 404s | Pending evidence | Real-host testing on supported browsers | Engineering/QA TBD |
| EDU-01 | 3,200 game item reviews | **3,200 pending** | Bilingual educator signoff and defect fixes for published scope | Educator/Hindi TBD |
| EDU-02 | 32 Study Lab item reviews | **32 pending** | Same item-level review standard | Educator/Hindi TBD |
| ACC-01 | Real-device and assistive-technology checks | Pending evidence | Low-end Android, keyboard, TalkBack/VoiceOver, contrast/zoom | Accessibility TBD |
| SAFE-01 | Child privacy/legal/safeguarding | Blocked for public child users | Data mapping, legal review, operational escalation/incident owner | Child safety/legal TBD |
| WEB-01 | Public domain SEO/indexing | Blocked | Verified public domain, canonicals, sitemap, content approvals; remove noindex deliberately | SEO/Ops TBD |
| PILOT-01 | Consented teacher/learner feedback | Pending | Ethical pilot design, teacher feedback and actionable results | Research TBD |
| SOCIAL-01 | Online friend invites/chat | Blocked | Eligibility, consent, moderation, secure backend, incident response | Safety/Backend TBD |
| BIZ-01 | Revenue/business validation | Planned | Ethical educator/institution research, no child manipulation | Product TBD |

## Weekly update protocol
When work starts or finishes, record: **date**, milestone/task ID, status, linked PR/commit/test run, exact evidence, outstanding blocker, and named assignee **only after assignment**. Do not move public-release gates to complete solely because unit tests pass. Add updates to [IMPLEMENTATION_BACKLOG.md](IMPLEMENTATION_BACKLOG.md) or append dated notes below.

## Change log
- **2026-11-23:** Documentation-only baseline created; M14 identified as last implemented code milestone; M15–M18 added as **proposed**. No hosting deployment or educational approvals claimed.

- **2026-11-23:** M15 two-journey pilot code pushed and browser smoke tested; 69 Node tests. This is staging-only and unreviewed; public release, M16–M18 remain pending. [M15 QA](../M15_QA_STATUS.md).
