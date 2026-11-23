# Decision Register, Assumptions and Risk Tracker

> **M31 SAFETY DECISION (2026-11-24):** Seven new interactive Science drafts are conceptual-only and explicitly disallow unsafe hands-on mains electricity, chemicals, bright light and wildlife sampling. Reusable five-stage teaching flow is not a validated curriculum. Pending human educational records are now **3,292**; B1 **35/50 engineering/design** tasks source/test-backed, four additional items blocked on genuine experts. Risk: counting conceptual models as complete practical labs or independent educator reviews. Mitigation: [M31 limitations](M31_SCIENCE_LABS.md) and launch gates kept closed.


> **M30 STATUS RISK NOTE (2026-11-24):** B1 shows **25/50 source+test verified tasks**—five are reused M29 governance docs, while the rest are scoped software/provisional architecture tasks. This is **NOT 50% of the whole educational product**. Three new Maths tasks have **unreviewed** Hindi/subject prompts; pending inventory 3,285. Provisional grade mapping, no-paid-API tutoring plan and an offline teacher no-roster contract are designs only. Human gates, real devices, authorized Hostinger HTTPS and school trials remain blocked. [Evidence dashboard](B1_PROGRESS_DASHBOARD.md).


> **M29 DECISION — 2026-11-24:** Do not report **full product complete** based on a completed M1–M28 code increment. New implementation plan = **2 × 50 planned tasks**, [100-task register](MASTER_EXECUTION_PLAN.md), with human, live-device and legal release evidence independent of CI. Risk: premature child launch or unsupported Class 1–12 / AI tutor claims. Mitigation: [explicit Definition of Done](FULL_PRODUCT_SCOPE_AND_DONE.md), truthful status vocabulary and still-blocking release gates.


**Snapshot:** 2026-11-23. Decisions below reflect the project discussion and current technical constraints. They can be revisited by the actual product owner. No named legal/content reviewer has been appointed.

## Decision register
| ID | Decision | Rationale | State |
|---|---|---|---|
| D-01 | Free student core, minimal incremental cash budget | Broad access without subscriptions or paid AI dependency | Product direction |
| D-02 | Static-first Hostinger Business shared-hosting architecture | Low server cost and reliable simple deployment | Implemented architectural choice |
| D-03 | Smart Learning Studio = **Learn → Try → Play → Understand → Grow** | Move beyond isolated quizzes to purposeful learning | **M15 concept pilots implemented; review pending** |
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
| Q-02 | Who can sign the 3,272 unreviewed question items and 10 classroom steps or a safely scoped public subset? | Recruit and document qualified bilingual reviewers | Product/education TBD |
| Q-03 | What exact Hostinger staging domain and access restriction? | Choose separate subdomain, backup, verify HTTPS | Operations TBD |
| Q-04 | Who is accountable for child safeguarding/incident response? | Assign responsible operator and legal/safety review | Product/safety TBD |
| Q-05 | Which devices and languages can be tested ethically? | Create actual low-end Android, TalkBack and Hindi QA matrix | QA TBD |
| Q-06 | When is there enough evidence to remove noindex and allow public access? | Require explicit sign-off against release gates | Product/ops/safety TBD |
| Q-07 | Which materials have actual reusable licenses? | Keep unverified resources link-only | Content/license TBD |

## Risk register
| Risk | Impact | Probability (qualitative) | Mitigation | State |
|---|---|---|---|---|
| R-01 Incorrect/ambiguous age-inappropriate content | High | Open | Item-level bilingual review, answer truth tests, no assessment promises | Open: **3,272 question items + 10 facilitation steps unreviewed** |
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

### M18 safety boundary (2026-11-23)
The offline AI literacy module is deterministic, avoids open-ended chatbot responses and does not request children's credentials. A successful automated answer check does **not** certify a learner as safe online or qualify as a current, comprehensive fact-checking system. Periodic educational and Hindi updates, child-safety reviewer ownership and real teacher/child usability are still open.

### M19 deployment and privacy risk update (2026-11-23)
- A self-only Content Security Policy and `X-Robots-Tag: noindex` header are **configured locally**, not yet confirmed applied by Hostinger/LiteSpeed. Restrict staging access in hPanel; noindex is not authentication.
- Eight old game guides and two worksheets have been refactored to avoid inline CSS/JavaScript; reduce XSS exposure without claiming a penetration test.
- Staging automated preflight passes but intentionally refuses public approval while **3,282 content/review records** are pending. Live-host header probes and operator backup/rollback are not yet complete.
- Do not collect account credentials or send authorization secrets into GitHub/source/docs. Optional staging auth header for a **manual** local verifier must remain unlogged.

### M20 review workflow decision (2026-11-23)
- **D-13:** Keep an offline, read-only exported *worklist* separate from any accountable human subject/Hindi signoff. Exporting or editing a CSV does not create launch approval.
- **R-12:** Unqualified automatic approval or stale educational content could mislead children. Mitigate through item/version traceability, independent reviewer evidence, safe private pilot scope and public gate remaining blocked.
- **Still TBD:** human curriculum/Hindi/safeguarding owners, real site/operator and tested devices.

### M23 evidence handling and risk control — 2026-11-23
- **D-14:** Only offline draft review-evidence templates are generated. Reviewer references are opaque internal IDs; sensitive reviewer credentials, student records, school rosters and completed review evidence must not be committed to the public repository. No online review portal or child login is created.
- **R-13:** Editable JSON could falsely imply signoff, and outdated content hashes can hide stale reviews. Mitigation: strict source ID/version/digest validation, distinct subject/Hindi references, explicit unauthenticated-evidence caveat and a separate required human governance process. The offline tool does **not** authenticate a reviewer or approve release.

### M24 static accessibility and source-archive confidentiality (2026-11-23)
- **D-15:** All static pages should offer a keyboard skip link to one main landmark; generated game guides and teacher print worksheets must retain this property after rebuild. Check structure in CI but still require manual AT/low-end phone testing.
- **R-14:** Local reviewer evidence or secrets could accidentally enter broad source archives during ZIP creation. M24 adds explicit exclusions and a ZIP inspection guard. Human operators must still inspect staging contents, backups, credentials and disclosure risks; CI cannot verify local account configuration.

### M26 safety governance safeguard — 2026-11-23
- **D-16:** Record safeguarding, incident-response, legal/privacy, shared-device, school-pilot and independent launch-decision requirements as six **human-operated** gates; never certify them automatically. Keep evidence only in a restricted operational register using opaque references, not public GitHub or CI artifacts.
- **R-15:** A machine-valid JSON template could be mistaken for true child-protection, legal or school consent approval. Mitigation: `humanReviewAuthenticated:false`, `publicReleaseApproved:false` on every validation report; pending by default; forbid forged approval keys; publicly documented **NO LAUNCH** gate until independent professional review.

### M27 — Old release or exposed source assets (2026-11-23)
- **D-17:** Compare live private staging responses to the **same** source revision using read-only SHA-256 across the complete file/route manifest; read-only proof supplements but never replaces human and operator approvals.
- **R-16:** An accidental stale/mismatched upload or source ZIP extraction could expose review queues, safety notes or mixed PWA files. Mitigation: 141 Node tests, full static response hashes, seven forbidden source-only URL probes without body logging, strict headers, archive source-byte parity, operator backup/rollback procedure and deliberate public gate remaining blocked. **No real-host verification is recorded.**

### M28 — Cross-tab shared-browser privacy (2026-11-23)
- **D-18:** Clearing local learning history should broadcast only a non-identifying clear action to other currently active same-origin tabs in a supported browser profile; reset known local/session storage and active in-memory learning UI conservatively. Do not transmit progress/identity/attempt records over BroadcastChannel or network.
- **R-17:** Shared-device history can remain visible in another previously opened tab or a stale cached app; mitigate via M28 peer reset, storage-event fallback, service worker cache bump, bilingual clear/close guidance and local Chromium multi-tab regressions. Frozen tabs, other browser profiles, backups and real physical phone behavior remain unverified.
