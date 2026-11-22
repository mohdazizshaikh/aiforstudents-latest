# Decision Register, Assumptions and Risk Tracker

**Snapshot:** 2026-11-23. Decisions below reflect the project discussion and current technical constraints. They can be revisited by the actual product owner. No named legal/content reviewer has been appointed.

## Decision register
| ID | Decision | Rationale | State |
|---|---|---|---|
| D-01 | Free student core, minimal incremental cash budget | Broad access without subscriptions or paid AI dependency | Product direction |
| D-02 | Static-first Hostinger Business shared-hosting architecture | Low server cost and reliable simple deployment | Implemented architectural choice |
| D-03 | Smart Learning Studio = **Learn → Try → Play → Understand → Grow** | Move beyond isolated quizzes to purposeful learning | **Proposed M15 design; no implementation** |
| D-04 | China smart-classroom practice is inspiration, not device-for-device imitation | Shared-device Indian classrooms may lack personal laptops | Adopted design principle |
| D-05 | Start with **two** provisional Class 6–8 lesson concepts, not a full syllabus | Review quality before breadth | M15 plan, grade mapping pending |
| D-06 | External official resources linked; no automatic copying/rehosting | Copyright, provider privacy and maintainability | Link-first editorial policy |
| D-07 | No always-on paid AI tutor in M15–M18 | Cost, child-safety and reliability constraints | Excluded from near-term scope |
| D-08 | First classroom kit requires no logins, roster or student identity | Inclusive access and data minimization | M17 design |
| D-09 | Activity history optional and local-first; truthful practice feedback | Minimize personal-data exposure and misleading scores | Existing M14 direction |
| D-10 | Online friend invites and chat off until separate safety/legal approval | Prevent risky child interaction and unauthorized data use | Blocked |
| D-11 | No public indexing until real domain + content/safety approval | Prevent premature child-facing deployment and bad SEO | Current noindex staging control |
| D-12 | Keep school class, accessibility need and age band separate | Avoid labelling age as fixed intelligence or a validated difficulty metric | M15 schema requirement |

## Open questions — decisions required before future code/release
| ID | Question | Proposed resolution | Responsible role |
|---|---|---|---|
| Q-01 | Which current textbook/class edition defines the M15 pilot mapping? | Educator verifies actual chapters and versions | Curriculum reviewer TBD |
| Q-02 | Who can sign the 3,232 unreviewed game/Study Lab items or a safely scoped public subset? | Recruit and document qualified bilingual reviewers | Product/education TBD |
| Q-03 | What exact Hostinger staging domain and access restriction? | Choose separate subdomain, backup, verify HTTPS | Operations TBD |
| Q-04 | Who is accountable for child safeguarding/incident response? | Assign responsible operator and legal/safety review | Product/safety TBD |
| Q-05 | Which devices and languages can be tested ethically? | Create actual low-end Android, TalkBack and Hindi QA matrix | QA TBD |
| Q-06 | When is there enough evidence to remove noindex and allow public access? | Require explicit sign-off against release gates | Product/ops/safety TBD |
| Q-07 | Which materials have actual reusable licenses? | Keep unverified resources link-only | Content/license TBD |

## Risk register
| Risk | Impact | Probability (qualitative) | Mitigation | State |
|---|---|---|---|---|
| R-01 Incorrect/ambiguous age-inappropriate content | High | Open | Item-level bilingual review, answer truth tests, no assessment promises | Open: **3,232 items unreviewed** |
| R-02 Confusing smart learning with passive screen time | Medium | Open | Short five-step active learning loop and teacher-led alternatives | Design mitigation |
| R-03 Shared-device privacy leak | High | Open | Session default, clear data, opt-in local storage, plain-language parental guidance | Human testing pending |
| R-04 Hostinger limits/HTTP asset or service worker errors | High | Open | Restricted staging, backup/rollback, real HTTPS tests | Not deployed |
| R-05 Unlicensed official content redistribution | High | Open | Link-first policy, per-item rights review | Policy drafted |
| R-06 Wrong class/board mapping | High | Open | Verify textbook edition; use provisional/experimental labels until checked | M15 blocked on reviewer |
| R-07 Accessibility failure on inexpensive devices | High | Open | Accessible alternatives, real phones/AT testing, offline data budget | Field QA pending |
| R-08 Unmoderated child online collaboration | Critical | Controlled by exclusion | No accounts/chat/invites until safety, age/guardian and incident response approvals | Feature disabled |
| R-09 Unsupported AI/IQ/marks/career assertions | High | Open | Deterministic explanations; no inferential scores; audit copy | Ongoing |
| R-10 Link rot, provider changes, third-party tracking | Medium | Open | Periodic editorial checks, clear external linking, no personal identifiers in URLs | Future monitoring decision |
| R-11 Unmeasured benefit or unsustainable operation | Medium | Open | Ethical pilot and teacher feedback; no promises of results or revenue | Not measured |

## Review cadence
Update this register when an evidence-backed decision changes, before a new milestone begins, after every pilot, or at least once per release. Include date, decision owner and PR/commit evidence. Never turn **TBD** into a fictitious approval.
