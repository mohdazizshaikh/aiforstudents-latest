# Implementation & Dependency Backlog

**Snapshot:** 2026-11-23. **This is a tracking document, not a claim that future features were coded.**  
Priority: P0 = required to avoid unsafe/misleading release; P1 = next core feature; P2 = later capability. Role ownership stays **TBD** until assigned.

| ID | Priority | Milestone | Task / smallest verifiable output | Dependency | Status | Owner |
|---|---|---|---|---|---|---|
| GATE-01 | P0 | Prelaunch | Confirm Hostinger staging domain, access restriction, backup + rollback | Hosting account/domain | BLOCKED / access needed | Ops TBD |
| GATE-02 | P0 | Prelaunch | On-host HTTPS/module imports, caching, browser console and .htaccess test | GATE-01 | TODO | QA TBD |
| GATE-03 | P0 | Content | Qualified bilingual educational review workflow + decision log for each published item | Available qualified reviewers | TODO | Content TBD |
| GATE-04 | P0 | Safety | Child-privacy legal and safeguarding review, shared-device data risks, incident escalation | Responsible human owners | BLOCKED / approval needed | Safety TBD |
| GATE-05 | P0 | Accessibility | Keyboard, TalkBack/VoiceOver, text zoom and low-end Android verification | Test devices/testers | TODO | A11y TBD |
| GATE-06 | P0 | Content | Review 54 age-repeating challenge positions and 3,232 current unreviewed game + Lab items | GATE-03 | TODO | Content TBD |
| M15-01 | P1 | M15 | Confirm Class 6–8 pilot topic-source mapping for fractions and circuits (provisional) | GATE-03 | TODO | Educator TBD |
| M15-02 | P1 | M15 | Define reusable original bilingual lesson + explanation + source/license data schema | M15-01 | TODO | Product/Eng TBD |
| M15-03 | P1 | M15 | Build first Learn → Try → Play → Understand → Grow lesson path | M15-02 | CODED: fractions concept pilot; human QA pending | Eng TBD |
| M15-04 | P1 | M15 | Build second lesson path with different concept mechanic | M15-03 | CODED: circuit-path concept pilot; not a wiring lab | Eng TBD |
| M15-05 | P1 | M15 | Connect lesson attempts to existing local-history reset, with accurate versioned feedback | M15-03 | CODED + tested: studioAttempts in versioned browser history | Eng TBD |
| M15-06 | P1 | M15 | Topic-matched official resource links, provenance, external-link labeling and link health checks | M15-01 + resource policy | PARTIAL: official provider homepages linked; exact chapter matching pending | Content TBD |
| M15-07 | P1 | M15 | Independent answer-key checks, original examples, Hindi review, mobile/keyboard regression | M15-03 through 06 | PARTIAL: Node + isolated browser pass; human Hindi and real device QA pending | QA/Review TBD |
| M16-01 | P1 | M16 | Design fractions manipulation simulation, keyboard and no-motion alternative | M15 reusable schema | TODO | Eng TBD |
| M16-02 | P1 | M16 | Design educational circuit-path simulation (not a real wiring guide) | Science reference review | TODO | Eng TBD |
| M16-03 | P1 | M16 | Test simulation state and explanations, touch/keyboard, offline repeatability | M16-01/02 | TODO | QA TBD |
| M17-01 | P1 | M17 | Teacher-run classroom flow for one projector / shared phone, no student identities | Reviewed M15 content | TODO | Teaching TBD |
| M17-02 | P1 | M17 | Original print-friendly worksheet and teacher facilitation notes | M17-01 + licensing check | TODO | Teaching TBD |
| M17-03 | P1 | M17 | Small ethical teacher feedback pilot and iteration | Safety and staging gates | BLOCKED until gates | Research TBD |
| M18-01 | P2 | M18 | Age-appropriate AI literacy, digital safety, misinformation and computational-thinking outline | Educational/safety review | TODO | Curriculum TBD |
| M18-02 | P2 | M18 | Build small deterministic non-generative activities with explanation | M18-01 | TODO | Eng TBD |
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
