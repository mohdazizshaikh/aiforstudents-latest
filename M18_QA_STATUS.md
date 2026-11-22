# M18 — AI & Digital Skills Lab: pilot QA report

**2026-11-23. Status: private staging educational draft; public child-facing launch NOT approved.**

## Implemented
- Four digital literacy strands: AI patterns/limitations, algorithmic thinking, evidence/misinformation and digital privacy.
- Four experimental age bands (6–10, 11–14, 15–17, 18+) with two original **distinct bilingual choice questions** per strand/band: **32 drafted items**. Each has answer feedback, original explanation and an optional offline reflection; none claims to diagnose intelligence.
- Keyboard-friendly labelled answer buttons, two challenge tabs, responsive mobile layout, live-region feedback and native focusable controls.
- Local `digitalAttempts` in existing versioned private history, session-only by default; opt-in browser storage; existing Clear local history erases digital attempts too. A daily activity-only Proud Today badge appears after recorded participation, not from age, ability or popularity.
- Does **not** send child data to AI services, collect names, use external APIs, provide an open chatbot or connect strangers.
- Guide at `/ai-digital-skills/`, cached by local-only static service worker, with noindex by default.

## Verified software checks
- **93/93 Node tests passed**: previous 84 plus nine M18 tests for 32 bilingual items, answer keys, four age bands, independent arithmetic checks, invalid input, local history, privacy and static links.
- **Isolated Chromium UI smoke passed** for all 32 authored M18 scenarios, bilingual switch, local history persistence and deletion, alongside old M15/M16 interactive flows and M17 classroom flows. No observed JavaScript page errors.
- Static scan: **23 HTML pages, 21 JavaScript modules**; no missing module imports / service-worker precache targets.
- Release ZIP integrity and domain-configuration test performed separately during packaging; staging noindex retained.

## Unfinished / limitations
- **32/32 new digital literacy items lack documented qualified educational and Hindi-language review.** Some advice is simplified; not a digital safety certification, real-time fact checking or validated AI literacy assessment.
- All previous 3,200 solo-game, 32 Study Lab, four M15, four M16 and ten M17 facilitation steps also remain unreviewed; do not assume older QA establishes correctness for children.
- No live HTTPS on Hostinger, actual cheap Android / TalkBack / VoiceOver tests, school pilot, child privacy/legal/safeguarding signoff or safe online social platform.
- Isolated Chromium inlines JavaScript modules due to local test-host restrictions. It does not prove that production network module fetching, service worker updates or `.htaccess` headers work on Hostinger.
- Future personalized AI tutor, remote collaboration, child accounts and public search indexing are **not** implemented/approved.

**Release gate: engineering pilot implemented, educational/public approval PENDING.**