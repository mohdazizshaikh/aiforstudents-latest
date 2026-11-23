# M31 — Science Concept Lab: seven offline bilingual draft models

**Date:** 2026-11-24. **Implementation:** B1 engineering code only. **Education/Hindi human approval:** 0/7 newly authored models. **Public child-facing release:** NOT APPROVED. **Hostinger:** no verified real staging deployment.

## Actually implemented

Seven original Science Concept Lab modes on the existing home page (`/#science-lab`), using a **single reusable Learn → Try → Play → Understand → Grow** teaching flow with keyboard-first controls, appropriate target-value references, local source-backed explanations, Hindi labels, and optional paper tasks. All states are transient in the current tab; no learner identity, answer or score is stored by this new module. Modes may be freely reset or navigated without forced scoring.

| Model | Interactive state and deterministic reference | Explicit limitation |
|---|---|---|
| **Physics: steady motion** | Distance 0–100 m in 10 m steps, time 1–20 s; speed = distance/time (m/s), target 60 m / 10 s | Assumes ideal constant speed, no real-world trip safety claim |
| **Physics: light reflection** | Independent incident/reflected angles 0–90° in 5° steps, measured from normal; target 35° and 35° | Simplified plane-mirror diagram, not lasers/bright-light instructions |
| **Physics: energy accounting** | 100 J input split useful + thermal; accessible exact conservation check | Idealised two-output model, not real measured efficiency |
| **Chemistry: states of matter** | Solid, liquid and gas chosen with text-first particle descriptions | Schematic simplified model; no heat or real chemical work |
| **Chemistry: change sorter** | Classify ice melting, paper burning (discussion only), salt dissolving; model flags known class | No actual burning/heating/mixing; class-level simplified examples |
| **Biology: cell structures** | Compare typical green leaf, typical animal and bacterium with different features | Not all plant cells have chloroplasts; species vary |
| **Biology: food-chain** | Choose a representative grass → grasshopper → frog → snake food-chain direction | Not universal species diet; food webs are complex; no wildlife contact |

Unlike the pre-existing **two M16 Virtual Experiment Lab** simulations (fraction strips/series circuit), these are **seven additional bounded conceptual practice models**. They are **not** seven independent full-grade practical labs, complete state-board coverage, a general generative AI tutor, a proven adaptive learning system or an evaluated school curriculum. The three M30 Maths Workshop models remain intact.

## Review and curriculum controls

- `SCIENCE_CONTENT_REVIEW_QUEUE.jsonl` contains **7 draft lesson records**, one per model, including every `learn/try/play/understand/grow` teaching phase in its source. `tools/build-review-packet.mjs` extracts actual bilingual concept, quiz, hint, explanation, safety caveat and mission with content SHA-256 source fingerprints for later qualified review. Metadata and hashes are **not** human approval.
- Pending content: original 3,282 + M30 Maths 3 + M31 Science 7 = **3,292**. M23 evidence template pilot-first now includes **28 records**; 0 new signoffs have been authenticated.
- `tools/audit-bilingual-learning.mjs` checks nonempty English/Hindi **source fields** across 3,200 existing game drafts, 32 Study Lab tasks, 2 Studio journeys, 2 earlier Virtual Lab simulations, 3 Maths Workshop modes, 7 Science models, 10 Teacher Kit steps and 32 AI Digital Skills scenarios. This catches missing strings; **it cannot validate translation accuracy or teaching quality**.
- Grade, chapter, textbook edition, accessibility on real devices, legal rights and child-safety approval are **NOT** verified. Official provider entrypoints are links only; no copyrighted textbook chapter is republished.

## Engineering and deployment evidence

- Exhaustive bounded reference checks for motion states, reflection angle pairs, energy budgets, science choices and Hindi text. Reusable five-stage route and fallback feedback tested in Chromium on **localhost only**, including keyboard Enter, Hindi, screen-readable text, 390px mobile and offline after PWA cache install.
- M31 static worker version: `aifs-discovery-m31-2026-11-24`, caching both `assets/science-engine.js` and `assets/science-app.js`. The existing strict noindex/CSP/sensitive-source deny and read-only staging integrity verification remain required.
- **Private ZIP only:** `aiforstudents_hostinger_staging_m31.zip`; it is not a verified Hostinger site and must never be publicly deployed without independent operator, legal, educational and child safety evidence.
- The 100-task register marks **35/50 B1 scoped engineering/design tasks verified**, not 35 launched or educator-approved lessons. B2 remains 0/50. Four B1 work items are **BLOCKED_EXTERNAL** (qualified teaching/Hindi rubric, reviewed-content tutor contract, original classroom-plan review and expert-approved reference fixtures).

## Required next work

B1 has **15/50 tasks not verified**: existing fractions UI migration, reviewed-only AI hint design/prototype and safe UI, explainable practice/scheduling/difficulty controls, teacher projector/group/worksheet improvements, and four actual external qualified-human dependencies. Qualified educator/Hindi specialists must review each content version, while an authorized operator independently verifies Hostinger restricted HTTPS, actual low-end Android/assistive technology, copyright and safeguarding, and school/guardian-authorized pilot. Do not use GitHub CI as a substitute.

[Evidence dashboard](B1_PROGRESS_DASHBOARD.md) · [Machine-readable 100 tasks](MASTER_100_WORK_ITEMS.json) · [Full product scope](FULL_PRODUCT_SCOPE_AND_DONE.md) · [Release gates](../RELEASE_GATES.md).
