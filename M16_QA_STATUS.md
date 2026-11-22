# M16 — Virtual Experiment Lab QA status

**2026-11-23 | FIRST CODING PILOT IMPLEMENTED; PRIVATE STAGING ONLY; public child-facing release NOT APPROVED.**

## Implemented
- Two original, low-bandwidth, non-canvas simulations and **four recorded checks**: fraction comparison, fraction equivalence, two-switch series path lit, and exactly-one-open interrupted path.
- Numeric/button and textual alternatives for visual fraction bars and conceptual series paths; no real electricity or hardware experimentation.
- English/Hindi instructional drafts, explanatory feedback, optional paper-only missions and outbound official source homepages; no redistribution of external content.
- Strict response/age/version validation and local-only `experimentAttempts` integrated with existing session/opt-in local storage, Clear local history, and evidence-based Proud Today activity (not a mastery badge).
- Staging guide `/virtual-experiment-lab/`, versioned static service-worker cache, domain-configurator support.

## Actual testing
- **77/77 Node automated tests passed** (69 M15+ prior regressions and 8 new M16 checks).
- Fraction comparison truth table: all allowed numerator/denominator values from 0..d, d=2..8 on BOTH strips (independently verified cross-product relation); equivalent-proper fraction constraints.
- Two-switch truth table all 4 state combinations; circuit is simplified and not a wiring instruction.
- Isolated Chromium browser test: M15 two journeys + M16 two experiments, all 8 practice checks, Hindi switching, optional mocked browser storage, clear history, **0 observed JavaScript page errors**.
- Static integrity checker: **19 HTML pages / 17 JavaScript modules**, zero missing import/cache targets; existing structural game content audit clean.

## Gaps / unsupported claims
- **3,200 game + 32 Study Lab + 4 M15 Studio + 4 M16 experiment checks** currently lack documented qualified bilingual educator review. Age difficulty is experimental; **54 individual game challenge positions** remain identical across age bands.
- Simulations are simplified representations, do not model real-world hardware voltages/currents or all series circuit configurations, and are not approved lab exercises.
- Official provider links are not verified chapter-specific matches. Free-to-browse is not permission to copy.
- No live Hostinger/HTTPS test, full service-worker lifecycle test, low-end Android or real TalkBack/VoiceOver/teacher pilot.
- No regulatory/child privacy/safeguarding review, public indexing, secure online friends, or AI chatbot.
- Browser smoke runs inline JS modules with mocked storage in an isolated environment, not a live static-module network test.

**Verdict:** M16 first prototype implemented and browser-smoke-tested. Expert content approval, device QA, staging deployment and public release remain blocked.