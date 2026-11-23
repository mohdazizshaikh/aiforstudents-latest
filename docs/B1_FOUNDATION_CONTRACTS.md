# M30 B1 — foundation contracts (engineering draft)

**Prepared:** 2026-11-24. **State:** design/engineering only. Full AI FOR STUDENTS product and public child release NOT COMPLETE. Existing 3,282 unreviewed tasks plus 3 new M30 draft Maths tasks = **3,285 pending reviews**. No external educational, legal or school approval is inferred.

## FP-011, FP-012, FP-014, FP-015 — source and curriculum rules

[Source/curriculum options](B1_CURRICULUM_SOURCE_OPTIONS.json) lists only existing official **provider entrypoints**, explicitly **not** grade/chapter/edition verification. No content is copied or redistributed. Metadata distinguishes an integer **school grade** (1–12) from the experimental **age band**, with separate board, subject, edition, chapter, reviewer status, rights, and provenance fields. A source URL does not grant reuse rights. Original lesson metadata is `PENDING` until actual qualified reviewers and source/edition verification. The four provisional Grade 1–2 concept candidates are **ideas**, not authenticated NCERT coverage.

## FP-031, FP-041 — scope and scientific safety

The 12-row Maths topic grid is an **illustrative discovery matrix**, not a school syllabus or a verified NCERT/CBSE mapping. Only fractions (previous M16), number-line, rectangle and two-group data-table mini-labs exist; the rest are gaps. The Physics concept bands are **provisional** and entirely schematic: series-switch logic is model-only; no mains/current real-life experiment is taught. Chemical and biological exclusions are explicitly listed in the machine-readable map. Chemistry/Biology labs beyond the M30 scope remain **NOT IMPLEMENTED**.

## FP-061 — tutoring and 0-paid-API core

Core learner experience must function without signup, payment, inference API, cloud scores, model secrets, or third-party trackers. A safe tutor MVP may use **only deterministic reviewed-source hints**; unreviewed prompts must not be served as verified teaching advice. Open generative chat is **OFF**, with a separately budgeted, consented, moderated, risk-reviewed option only after independent safeguarding/legal/education approval. No capability is claimed as a working AI tutor today.

## FP-071 — minimal event schema for optional local practice

Current local progress remains browser storage only: `{activityType, contentId, version, localAttemptTime, correctForThisTask}` with optional non-identifying session state. **Never** store or broadcast names, school, address, date of birth, device fingerprint, IQ label, inferred protected traits or persistent cross-device child identity. Age band remains selectable and is not a verified grade. Default is tab session; explicitly opt in to persistent local browser storage, provide a clear-all control and explain limits of browser backups and peer tabs. This **design** does not create new persisted metadata automatically.

## FP-081 — no-roster teacher dashboard MVP

A teacher's **future local offline lesson organizer** should select reviewed lesson cards, sequence projector prompts, rotate anonymous roles and print worksheets. It must not collect pupils' names, marks, attendance, rosters, online messages or upload analytics. Existing two teacher lesson plans are prototypes only. No school database or central dashboard is yet implemented; source validation and actual teacher study remain required.

## FP-021 / FP-024 — keyboard and small-screen navigation contract

Each new visible lab has an explicit labelled route/anchor, focusable question, button-only manipulation (no drag), numerical/text state independent of color, a status region with truthful explanation and an equally usable Hindi view. Moving between activities places focus on the new prompt. Arrow/increment controls have contextual `aria-label`; no autosave, high-stakes score or pressure streak. Native Chromium verifies mobile overflow, keyboard focus and both languages. **Not** equivalent to real screen-reader/WCAG certification.

## FP-025 — initial performance envelope

The M30 learner prototype should not exceed **2 MiB source static hosted assets**, **96 KiB home HTML**, **64 KiB styles CSS**, **160 KiB per JS module** or **12 seconds to DOMContentLoaded on CI localhost Chromium**. These are conservative automated **engineering budgets, not a measured 2G/low-end Android performance claim**. True cold-start on a low-memory physical Android and slow connection remains a separate field gate.

## FP-091 / FP-094 — QA/release matrix

| Claim | Acceptance evidence | Genuine external work still required |
|---|---|---|
| M30 maths numeric correctness | Node exhaustive bounded inputs + 3 original simulations | Subject/Hindi review |
| Bilingual interactive operations | Native Chromium keyboard/buttons, Hindi and no JS errors | TalkBack/VoiceOver/real devices |
| Offline update | M30 SW cache and offline root+Maths controls | Actual Hostinger HTTPS and cached upgrade |
| Review worklist | 3,285 source-backed drafted records, including 3 Maths with SHA-256 references | Authenticated subject/Hindi acceptance for every published item |
| Privacy and archive | Local session/opt-in reset tests + no secrets in ZIP + source parity | Real shared-device privacy and operator review |
| Teacher projector and print | Chromium print CSS/role focus tests | Real A4/projector/school trial |
| Public child release | Intentionally failing public preflight | Signed safeguards, legal, content, hosting and ethics |

No stage/pilot or successful CI should change public `noindex,nofollow` or create a launch approval. [M29 full-product definition](FULL_PRODUCT_SCOPE_AND_DONE.md) · [Work register](MASTER_EXECUTION_PLAN.md).
