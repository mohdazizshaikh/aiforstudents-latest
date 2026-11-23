# Implementation & Dependency Backlog

**Snapshot:** 2026-11-23, including M20 operations development. **This is a tracking document, not a claim that future features were coded.**  
Priority: P0 = required to avoid unsafe/misleading release; P1 = next core feature; P2 = later capability. Role ownership stays **TBD** until assigned.

| ID | Priority | Milestone | Task / smallest verifiable output | Dependency | Status | Owner |
|---|---|---|---|---|---|---|
| GATE-01 | P0 | Prelaunch | Confirm Hostinger staging domain, access restriction, backup + rollback | Hosting account/domain | BLOCKED / access needed | Ops TBD |
| GATE-02 | P0 | Prelaunch | On-host HTTPS/module imports, caching, browser console and .htaccess test | GATE-01 | TODO | QA TBD |
| GATE-03 | P0 | Content | Qualified bilingual educational review workflow + decision log for each published item | Available qualified reviewers | TODO | Content TBD |
| GATE-04 | P0 | Safety | Child-privacy legal and safeguarding review, shared-device data risks, incident escalation | Responsible human owners | BLOCKED / approval needed | Safety TBD |
| GATE-05 | P0 | Accessibility | Keyboard, TalkBack/VoiceOver, text zoom and low-end Android verification | Test devices/testers | TODO | A11y TBD |
| GATE-06 | P0 | Content | Review 54 age-repeating challenge positions and 3,232 current unreviewed game + Study Lab items (plus 50 M15–M18 records) | GATE-03 | TODO | Content TBD |
| M15-01 | P1 | M15 | Confirm Class 6–8 pilot topic-source mapping for fractions and circuits (provisional) | GATE-03 | TODO | Educator TBD |
| M15-02 | P1 | M15 | Define reusable original bilingual lesson + explanation + source/license data schema | M15-01 | TODO | Product/Eng TBD |
| M15-03 | P1 | M15 | Build first Learn → Try → Play → Understand → Grow lesson path | M15-02 | CODED: fractions concept pilot; human QA pending | Eng TBD |
| M15-04 | P1 | M15 | Build second lesson path with different concept mechanic | M15-03 | CODED: circuit-path concept pilot; not a wiring lab | Eng TBD |
| M15-05 | P1 | M15 | Connect lesson attempts to existing local-history reset, with accurate versioned feedback | M15-03 | CODED + tested: studioAttempts in versioned browser history | Eng TBD |
| M15-06 | P1 | M15 | Topic-matched official resource links, provenance, external-link labeling and link health checks | M15-01 + resource policy | PARTIAL: official provider homepages linked; exact chapter matching pending | Content TBD |
| M15-07 | P1 | M15 | Independent answer-key checks, original examples, Hindi review, mobile/keyboard regression | M15-03 through 06 | PARTIAL: Node + isolated browser pass; human Hindi and real device QA pending | QA/Review TBD |
| M16-01 | P1 | M16 | Design fractions manipulation simulation, keyboard and no-motion alternative | M15 reusable schema | **CODED** — two strips, cross-product comparison/equivalence; user QA pending | Eng TBD |
| M16-02 | P1 | M16 | Design educational circuit-path simulation (not a real wiring guide) | Science reference review | **CODED** — conceptual two-switch series model; educator approval pending | Eng TBD |
| M16-03 | P1 | M16 | Test simulation state and explanations, touch/keyboard, offline repeatability | M16-01/02 | **PARTIAL** — Node truth tables and isolated browser pass; actual device/offline/live HTTPS still pending | QA TBD |
| M17-01 | P1 | M17 | Teacher-run classroom flow for one projector/shared phone, no student identities | Existing M15/M16 prototypes | **CODED** — 2 original 5-step lesson plans, generic roles/projector mode; human approval pending | Teaching TBD |
| M17-02 | P1 | M17 | Original print-friendly worksheet and teacher facilitation notes | M17-01 + licensing check | **CODED** — 2 original bilingual HTML A4 sheets + facilitator guide; review/real print pending | Teaching TBD |
| M17-03 | P1 | M17 | Small ethical teacher feedback pilot and iteration | Safety and staging gates | BLOCKED until gates | Research TBD |
| M18-01 | P2 | M18 | Four digital literacy strands and age-adapted bilingual explanation drafts | Educational/safety review | **DRAFT CONTENT CODED**, specialist review pending | Curriculum TBD |
| M18-02 | P2 | M18 | Deterministic local practice, 32 checks, explanatory feedback and history | M18-01 | **CODED + NODE/ISOLATED BROWSER PASS**; human review, devices and live host pending | Eng TBD |
| WEB-01 | P2 | Public SEO | Configure verified public domain canonicals/sitemap, then Search Console | Content & safety approval, staging success | BLOCKED | SEO TBD |
| SOCIAL-01 | P2 | Future | Explore adult-eligible private async team rooms; no child social launch without governance | Legal, safety, security and incident staff | BLOCKED | Safety TBD |
| EDU-EXPAND | P2 | Later | Extend pilot beyond Classes 6–8, other languages/state boards with original/licensed material | Successful reviewed pilot | BACKLOG | Content TBD |

### Definition of Done for an implementation row
1. Exists in repository with reproducible checks, mobile/keyboard/Hindi coverage as applicable.
2. Content has recorded references, item IDs, version and explicit human review status; do not silently mark approved.
3. No invented analytics, IQ/aptitude scores, exam grade predictions, or unsafe child social interactions.
4. Sensitive/local data can be cleared; public resources are linked legally and accurately.
5. Associated tracker, README, QA result and release gates updated. Public release is **a separate approval**.

### First development work packet (after this docs-only update)
- Approve minimal M15 concept maps, content source/license list and reviewer role.
- Implement just one complete fractions journey, not a giant unreviewed page set.
- Reuse M14 store and the 40-game library only where educationally useful.
- Confirm source correctness and user experience on a genuine browser/device before expanding.

### Progress log
- **2026-11-23:** Roadmap and backlog documented. **No M15–M18 implementation code added.**

- **2026-11-23 M15:** Fractions and circuit-path pilot journeys coded, source reviewed structurally, 69 automated tests + isolated Chromium passed. NO public approval, no verified class/board/chapter mapping, no actual Hostinger staging, no human bilingual review. M16–M18 unchanged.

- **2026-11-23 M16:** Two original virtual experiment prototypes implemented. Four checks recorded locally, 77 Node tests pass, isolated mobile browser smoke passed. **Qualified bilingual educator review, actual device/accessibility/Hostinger tests and public approval are still TODO.** M17 and M18 not coded.

- **2026-11-23 M17:** first teacher kit coded, 2 subjects × 5 steps, two print worksheets, no pupil roster or account; Node tests 84/84, isolated Chromium UI and print CSS. M17-03 **remains BLOCKED** until school authorization, educator review, safeguarding and consent requirements are met. M18 still unimplemented.

- **2026-11-23 M18:** Four-topic AI & Digital Skills pilot coded; all 32 bilingual drafts versioned and queued for qualified educator/Hindi approval. 93/93 Node tests; isolated 32-check Chromium plus M15–M17 regression passes. **No real generative chatbot**. Human child-safety/privacy and public release gates remain pending. Overall unreviewed: 3,200 games + 32 Study Lab + 4 Studio + 4 Virtual Lab + 32 Digital = **3,272 question records**, plus **10 classroom facilitation steps**.

### M19 technical release safety work — 2026-11-23
| ID | Priority | Item | Status | Evidence / remaining dependency |
|---|---|---|---|---|
| M19-01 | P0 | Strict self-only CSP and noindex response-header config | **CODED, NOT HOST-VERIFIED** | Actual Hostinger `.htaccess` output and policy console test required |
| M19-02 | P0 | Remove inline worksheet JS/CSS and eight guide style attributes | **CODED + ISOLATED TESTED** | Real A4 printer, projection/device and CSP on server |
| M19-03 | P0 | Automated staging preflight and public review block | **CODED + 101 NODE TESTS** | Human educational/Hindi review of 3,282 records |
| M19-04 | P0 | Read-only HTTPS staging audit tool and operator runbook | **CODED, NOT RUN LIVE** | Authorized HTTPS origin, restricted access and operator |
| M19-05 | P0 | Safe zipped static packaging | **CODED + ZIP INTEGRITY VERIFIED** | Actual staging upload, backup/rollback and network QA |

**No public child-facing release approved.** Never mark an automated preflight as qualified educational or legal review.

### M20 — Operational follow-through after M19 (2026-11-23)
| ID | Priority | Action | Code / evidence status | Still blocking |
|---|---|---|---|---|
| M20-01 | P0 | Deterministic bilingual review packet from 6 JSONL queues including archived game data | **Code and Node tests written on M20 branch; CI not yet confirmed** | Actual educator/Hindi review |
| M20-02 | P0 | Identify prioritized small concept/classroom private pilot and record reviewers | **Procedure written** in [M20](M20_REVIEW_OPERATIONS.md) | Named qualified humans, verified textbook versions |
| M20-03 | P0 | Export UTF-8 CSV with formula-cell protection and source references, without modifying approvals | **Code written; independent run/CI pending** | Reviewer evidence log and verified decisions |
| M20-04 | P0 | Restricted Hostinger HTTPS + real low-end Android/screen reader + A4/teacher pilot | **NOT PERFORMED** | Authorized operator, real devices and safeguards |

No new learning material is approved, and none of these engineering tasks authorizes child-facing public release.

### M21 — Review-packet data fidelity (2026-11-23)
| ID | Priority | Task | Implementation | Remaining independent gate |
|---|---|---|---|---|
| M21-01 | P0 | Include original Studio/Experiment bilingual questions instead of queue IDs alone | **CODED** — source engine hydrating and strict version matching | Human subject/Hindi check against displayed activity |
| M21-02 | P0 | Detect draft content drift via item-specific hash | **CODED** — SHA-256 over authored worklist fields, independent of review status | Actual reviewer decisions tied to exact version |
| M21-03 | P0 | Build review packet automatically during CI and test review/answer integrity | **CI step + Node regression added; run outcome to verify** | Not a public-release approval |
| GATE-03/06 | P0 | Review all 3,282 records with real qualified human reviewers | **STILL OPEN** | Named reviewers and recorded individual signoff |

See [M21 procedure](M21_REVIEW_INTEGRITY.md). No public child-facing launch or Hostinger deployment is claimed.

### M22 — Hostinger staging QA support (2026-11-23)
| ID | Priority | Scope | Engineering status | Blocking external evidence |
|---|---|---|---|---|
| M22-01 | P0 | Full allowlisted HTTPS static page/asset checker using source manifest | **CODED + mocked Node QA** | Authorized real HTTPS origin and restricted deployment |
| M22-02 | P0 | MIME, noindex, CSP and nosniff checks for HTML/JS/CSS/SVG/webmanifest | **CODED + mocked Node QA** | Actual Hostinger header observations |
| M22-03 | P0 | Extend Hostinger operator checklist to require core + full modes | **DOCUMENTED** | On-host run, backup/rollback receipt and defect fixes |
| GATE-01/02 | P0 | Actual Hostinger private staging and release evidence | **PENDING** | Hostinger operator, site, HTTPS, access restriction |

Details: [M22 staging audit](M22_FULL_STAGING_AUDIT.md). No public release approval.

### M23 — Human review evidence operationalization (2026-11-23)
| ID | Priority | Small output | Engineering state | Still needed |
|---|---|---|---|---|
| M23-01 | P0 | Source-hash-bound review template for 18 pilot-first items (optional full 3,282) | **IMPLEMENTED IN CODE; CI verify separately** | Human subject and Hindi review |
| M23-02 | P0 | Offline structural checker for stale versions, duplicate rows and incomplete decisions | **IMPLEMENTED + Node tests** | Independent reviewer authenticity/qualification and actual corrections |
| M23-03 | P0 | CI evidence template smoke, assert public release gate remains blocked | **CI WORKFLOW ADDED** | Actual real-world signoff unaffected |
| M23-04 | P0 | Accountable reviewer handoff and verified evidence | **OPEN / HUMAN REQUIRED** | Appointed qualified humans, official chapter review, child-safety owner |

See [M23 reviewer guide](M23_REVIEW_EVIDENCE.md). Review files are local-only and should not be committed. No child-facing public release approval.
