# Smart Learning Studio — M15–M18 Product Specification (PROPOSED)

> **M31 DEVELOPMENT NOTE — 2026-11-24:** Beyond the original two M15 Studio journeys and two M16 Virtual Lab examples, a separate M31 section now has **seven draft conceptual science models** and a reusable five-step interaction. This does **not** make the Class 1–12 Smart Lab, generic AI tutor, adaptive learning, full teacher dashboard or board-aligned curriculum complete. [M31 description](M31_SCIENCE_LABS.md) and [full-scope DoD](FULL_PRODUCT_SCOPE_AND_DONE.md).


> **M29 CLARIFICATION — 2026-11-24:** M15–M18 described below are **initial working prototypes** (two Studio journeys, two conceptual simulations, two teacher plans, 32 offline AI-literacy scenarios), **not** implementation of full Class 1–12 Maths/Physics/Chemistry/Biology, a live AI tutor, scientifically validated adaptive learning or full teacher management. The wording “current app is M15 staging” below is historical. See [full scope/DoD](FULL_PRODUCT_SCOPE_AND_DONE.md) and [100-task future roadmap](MASTER_EXECUTION_PLAN.md).


**Historical M15–M18 first coding pilots implemented, latest engineering baseline M28, full-product rebaseline M29 (2026-11-24); NOT APPROVED FOR PUBLIC USE.** This file describes original small lesson pilots, not a completed smart-learning ecosystem. This document takes ideas from purposeful smart-classroom practices; it does **not** claim every Chinese school gives every student a laptop or that computers alone improve learning.

## Purpose
A free Indian-school-friendly learning journey, enjoyable on a low-end phone, a shared family device or a single teacher projector. Build understanding through a short guided experience rather than passive video watching or high-pressure testing.

### Core loop
1. **Learn (1–3 minutes):** concise original bilingual explanation, illustrated concept, pronunciation or accessible text where needed.
2. **Try (1–3 minutes):** hands-on manipulation, prediction, ordering, or low-friction question; clear accessible alternative.
3. **Play (2–4 minutes):** use an existing relevant game or a distinct concept-specific activity, not an unrelated puzzle merely to increase engagement.
4. **Understand (under 2 minutes):** explain the answer, why a plausible wrong option fails, offer a gentle hint and retry.
5. **Grow (optional 1–2 minutes):** accurate activity reflection, one optional no-screen mission and later revisit. Do not create pressure streaks or unsupported aptitude increases.

Time ranges are design targets, not a tested completion estimate. A learner can pause, skip and revisit.

## M15 minimum pilot (two first concept journeys coded; content review pending)
**Provisional** Classes 6–8 concepts: fractions and basic circuits. Final grade/chapter alignment must be verified against the *current* relevant textbook edition before any NCERT-aligned claim.

- Two complete original topic journeys with English/Hindi drafts, concept introduction, 2–4 exercises each, a reviewed explanation for each response, optional low-data illustrations, relevant official public-resource links, and a real-world mission.
- Progressive hints rather than timed failures. Correct response describes **this task only**; no IQ, talent labels, exam prediction, definitive career mapping or “mastered” badge without a validated definition.
- Avoid quiz-only cosmetic variants: each topic must use a fitting learning mechanic.
- Local-first completion in existing M14 progress model; no new account or third-party analytics. Preserve clear-history and opt-in persistence.
- Genuine accessible alternatives for drag/drop and visual content; each interactive can be completed using keyboard and comprehended without color only.

## Reusable lesson metadata (conceptual)
Each authored lesson should have: stable lesson and concept IDs; explicit content version; requested class/board and edition (if verified); prerequisite concepts; target reading level and language; original material/source and link; copyright license/attribution; English and Hindi reviewed-status flags; accessibility description; hint/answer/explanation truth tests; educational reviewer identity/date when actually reviewed; content status (draft/reviewed/rejected); learning mission; optional game ID link; progress event type.

**Do not claim human review until a real educator actually approves it.** Age group and curriculum grade must be stored separately.

## M16 minimum Virtual Experiment Lab
- **Fractions:** split/compare equivalent portions, show numerator/denominator; numerical equivalent for screen readers and keyboard buttons for changing portions.
- **Electricity:** simulate a **low-voltage conceptual circuit path**, showing the logical effect of a connected/interrupting path. Do not encourage unsupervised mains wiring or guarantee real hardware behavior.
- Offline-compatible static JS; no WebGL requirement or download-heavy media. Include clear explanation, reset, visual and non-visual states and teacher notes.
- Independent mathematical/simulation reference tests before content approval.

## M17 Smart Classroom / Teacher Kit
- **No device-per-child assumption.** Teacher selects a lesson and presents it to a group from one laptop/projector or shared phone.
- Teacher prompt cards: predict together → discuss → one group tries → compare explanations → paper or home activity.
- Larger interactive controls, legible projected typography, print-friendly original worksheets and optional same-device role exchange.
- No student roster, public leaderboard, attendance analytics or child-identifying export by default. Teachers may use paper records independently.
- Teacher pilot only with appropriate school/guardian requirements and ethical feedback process.

## M18 AI & Digital Skills
- Teach what AI is, examples of pattern recognition and limitations, misinformation checks, privacy, safe prompting principles, critical thinking, basic algorithmic reasoning.
- Original **deterministic** activities, short stories, comparisons and simulations; no paid model or unmoderated generative bot needed.
- AI output is not always correct; learners should evaluate sources and keep their personal details private.
- No unsupported automated profiling or overconfident “AI career counselor” claims.

## Indian free resource integration
Use a curated **resource finder** attached to lessons, not a bulk copy of another site's content:
- DIKSHA: https://diksha.gov.in/
- NCERT ePathshala: https://epathshala.gov.in/
- DIKSHA Virtual Labs: https://diksha.gov.in/virtuallabs.html
- PM eVIDYA: https://www.pmevidyaapps.ncert.gov.in/
- Existing Future Explorer may retain linked public NCERT Career Cards and National Career Service information.

Verify actual destination and suitability when catalog entries are authored. **Free to view ≠ licensed to copy**. Don't download, translate, embed, or redistribute third-party material without the correct item-specific rights and attribution. Never claim government endorsement or an official partnership. See [RESOURCE_INTEGRATION_POLICY.md](RESOURCE_INTEGRATION_POLICY.md).

## Constraints and safety
- Static first, works on Hostinger Business shared hosting; no recurring AI model budget assumed.
- Focus on low-end Android, small assets, slow-network fallback, minimal battery/data, meaningful offline capability and accessibility.
- No public profiles, free chat, stranger matching, personal details, advertising SDKs or opaque school surveillance.
- No badges based solely on pressing “invite”; praise specific observed task completion only.
- Treat career suggestions as curiosity prompts using stated interests, not career destiny inferred from practice results.

## M15 acceptance demonstration
On an actual mobile browser, a learner can:
1. Enter an original lesson from the home/study UI with no account.
2. Switch language without losing answer state.
3. Complete an interactive task with touch **or keyboard**, receive a truthful explanation and optional retry.
4. Access an officially linked source with a clear external-site indication.
5. See only local progress, opt in to persistence or clear all personal local data.
6. Use the next-day revision prompt without guilt or “streak broken” language.

Build tests, record evidence and human content approvals separately. No public rollout follows automatically.

### Evidence addendum
Two original pilot journeys now implement equal-part fraction selection and a conceptual circuit switch with separate Play choices. This is not an M16 full virtual lab. External links are official provider homepages, not verified chapter-aligned materials; curriculum and bilingual reviews remain pending. [M15 implementation](M15_IMPLEMENTATION_NOTES.md).

### M16 implementation note (2026-11-23)
An initial **Virtual Experiment Lab** now exists, using two fraction strips with labelled arithmetic controls and a conceptual two-switch series circuit. Includes two task prompts per simulation, deterministic explanations, keyboard buttons and optional no-screen activity. This is **a prototype**, not a realistic electrical hardware simulation, a fully reviewed virtual lab or curriculum certification. [M16 evidence](M16_IMPLEMENTATION_NOTES.md).

### M17 implemented pilot note — 2026-11-23
Two original classroom teacher plans and print-friendly bilingual worksheet pages are coded, using the M15/M16 concepts. Projector typography, generic group roles and hide/reveal teacher explanations are available. No child accounts, student records, classroom analytics or internet peers are collected by this mode. Teacher-led real-school pilot, specialist content review and production approval are **not complete**. [M17 evidence](M17_IMPLEMENTATION_NOTES.md).

### M18 first implemented pilot (2026-11-23)
Four strands (AI patterns/limitations, algorithms, evidence verification and personal privacy) now have two original scenario questions per experimental age band, totalling 32 bilingual learning records. Explanations and offline reflection activities are offered; progress is private browser storage and can be cleared. **No open chatbot, online messages, API calls, official curriculum calibration or expert approval.** [Implementation notes](M18_IMPLEMENTATION_NOTES.md).
