# AI for Students — M18 first pilot private staging prototype

**Updated 23 November 2026.** Educational practice and exploration prototype for staging, **not** an expert-validated assessment, public child-ready service, or deployed Hostinger website.

## Implemented in the static build

- **40 playable solo game modules** across eight categories; four experimental age bands; 20 generated task records per game/band = **3,200 total task records**. Formats include choice, numbers, multiple selection, ordering, and unscored reflections. Not 40 separately illustrated engines or normed psychometric games.
- **M12-A:** Eight representative game banks redesigned. **M12-B:** 14 additional previously age-identical game banks rewritten, resulting in **zero wholly age-identical game banks** in the deterministic structural audit. **54 individual task positions still happen to be identical across all four bands in six other games.** Age difficulty is *not* scientifically calibrated.
- Age-specific word formation and synonym sets, composite mirror operations, longer classroom workflows, creative design constraints and responsible team/social reflection. 14 M12-B banks add **1,120 updated task records**, 8 M12-A banks contain **640** = **1,760 updated task records** across 22 modules. Every current item still requires independent educator/Hindi review.
- My Growth, Proud Today, Daily Growth plan and 3 same-device Grow Together cooperative modes preserved. There are **no** online invites, friends lists, chats, user accounts, remote AI calls or tracking SDKs.
- **M13 Future Explorer:** 12 original interest-led pathway cards, four age-scaffolded offline missions each, optional self-reported completion and Proud Today integration. It never ranks careers using game scores. External official resources are *ordinary links* to NCERT Career Cards, NCS and O*NET; no data is sent to those providers by the application.
- Six original static support pages: privacy, for-parents, methodology, accessibility, future-explorer, Hindi overview. Eight public game guides and Grow Together guide retained.
- Default `noindex,nofollow` on all pages. Conservative `.htaccess` staging headers; static service worker caches only public assets, not local progress.
- Optional progress history in sessionStorage; opt-in `localStorage` on the same browser, with clear-history control. Data is not synced, and locally stored data may be exposed on a shared device.

## QA commands (development machine only)

```sh
node --test tests/*.test.mjs
node tools/audit-content.mjs
node tools/export-review-queue.mjs
python3 tests/browser_m12b_m13.py
```

Node and static site output use no paid dependencies. Browser test uses developer-installed Python Playwright and Chromium and inlines modules to work around localhost restrictions in this environment. It is **not** real live HTTPS browser verification.

## Hostinger Business shared-hosting staging

Upload the separate Hostinger ZIP **contents**, not the source ZIP, to the `public_html` of a separate, backed-up, access-restricted staging website/subdomain. All files are static HTML, CSS, JS, SVG, text or manifest. No long-running Node server, PHP/MySQL, WebSockets, cloud inference, GPU or API secrets needed.

After selecting a verified HTTPS origin, run `node tools/configure-domain.mjs https://your-domain.example` on a **source copy**, and rebuild hosting files. This writes canonical URLs, a sitemap and a robots sitemap entry, but **retains `noindex,nofollow`** until explicit launch approval. Do not add reciprocal hreflang unless a true corresponding Hindi page is authored and validated. A Hindi introduction page is not automatically the equivalent of the full English interactive game page.

See `RELEASE_GATES.md`, `ONLINE_SOCIAL_FUTURE_SPEC.md`, `QA_STATUS.md`, `CONTENT_AUDIT.md`, `CONTENT_REVIEW_QUEUE.jsonl` and `M12A_REVIEW_CHECKLIST.md`.

## Honest boundaries

- Live Hostinger deployment, real-domain SEO/Search Console, real-device accessibility, expert educational review, child protection/legal approval, security review of any future server and user research are **not complete**.
- Content and interface tests do not establish test reliability, construct validity or fairness. No IQ, aptitude, personality or definitive career-future claims.
- Sharing invitations, safe child accounts and free-text messaging remain **disabled**; online social features cannot be marked complete without governance, guardian authorization/age safeguards and human incident response.
- SEO acquisition and educator revenue remain hypotheses, not implemented business outcomes.

## M14 — Skill Development Lab + Exam Study Support starter (23 November 2026)

- Adds an interactive `#study-lab` section and a detailed `/study-lab/` support guide. The initial module has **4 subject tracks, 8 lesson themes, 32 short bilingual age-scaffolded practice questions**, teaching tips and answer explanations. These are original starter examples, **not** aligned with a particular school board/competitive exam and **not expert-reviewed**.
- Local-first `labAttempts` integrates with the original browser history, optional persistent storage and the existing clear-history control. It adds a truthful activity-based Proud Today event, but never diagnoses ability or forecasts exam grades.
- `labProgress` presents completed topics and suggested revisits after 1–2 days. Recommendations are simple product heuristics rather than validated spaced-learning optimizations.
- New `LAB_CONTENT_REVIEW_QUEUE.jsonl` lists all 32 M14 educational tasks for human review separately from 3,200 existing game challenges.
- Tests: **63/63** automated Node tests; isolated Chromium checks **88 previous game rounds + 32 study questions**, language switch and progress reset. See `M14_QA_STATUS.md` for full limitations.

Run `npm test`, `node tools/verify-static-release.mjs`, and `python3 tests/browser_m14.py` (with Playwright + Chromium on the developer's machine). Hosting remains staged and `noindex`.

## GitHub checkout and development

The complete source and tests live in this repository. The earlier 3,200-record game review queue is archived at `docs/CONTENT_REVIEW_QUEUE.jsonl.gz`; restore with `gzip -dc docs/CONTENT_REVIEW_QUEUE.jsonl.gz > CONTENT_REVIEW_QUEUE.jsonl`, or regenerate using `node tools/export-review-queue.mjs`. The 32 M14 lesson checks appear in `LAB_CONTENT_REVIEW_QUEUE.jsonl`.

Use Node.js 22 or a current supported version. Run `npm test` for deterministic checks; run `node tools/verify-static-release.mjs`, `node tools/audit-content.mjs`, and optionally `python3 tests/browser_m14.py` with Playwright + Chromium. CI runs unit, static and structural checks but not the isolated Chromium tests.

**Private staging prototype only:** Not deployed to Hostinger, not expert-approved for child-focused public launch, not an assessment or board-aligned tutoring system, and intentionally `noindex,nofollow` until launch approval.

## M15 — Smart Learning Studio first working concept pilots (2026-11-23)

**Partial prototype implemented; M15 is NOT human-approved or production-complete.** Added two original, beginner-friendly bilingual mini learning journeys to `#smart-studio` and `/smart-learning-studio/`:

1. **Equal-part fractions:** Learn 2/4 = 1/2 for the same whole → tap accessible +/− controls to shade 2 of 4 → choose an equivalent fraction → explanation → optional original paper activity.
2. **Simple circuit path:** Learn the conceptual complete-path model → toggle an open/closed switch → reason about a model bulb → explanation → optional paper-only diagram activity (no real wiring instruction).

Both link out to official NCERT ePathshala/DIKSHA resource homepages for independent browsing, **not to verified topic/grade-specific lessons**. No third-party content is copied, embedded or cached. The original draft explanations and Hindi text require qualified educator and translator approval. The shared 4 age bands are **not** grade-aligned or a psychometric difficulty scale.

`studioAttempts` is added to the existing local-first progress schema; default sessionStorage, opt-in localStorage and Clear local history cover these new records. An activity-backed Proud Today item appears only after a check is submitted. Completing both steps is **not proof of mastery**. No user account, remote student data or AI API is involved.

New checks: `tests/studio.test.mjs` and isolated Chromium `tests/browser_m15.py`; the latter tests inlined equivalent JS, **not a live HTTP/Hostinger PWA**. See `M15_QA_STATUS.md` and `STUDIO_CONTENT_REVIEW_QUEUE.jsonl`. Later milestones M16–M18 now have first prototype implementations; see sections below.

## M16 — Virtual Experiment Lab (first coding increment, 2026-11-23)

Two new original mobile-first interactive simulations under `#experiment-lab`: comparison/equivalence of fraction strips and a conceptual two-switch series path. **Four question/setup checks** are available across two experiments. Separate engine (`assets/experiment-engine.js`) and UI (`assets/experiment-app.js`) use buttons, textual alternatives, bilingual drafts and optional offline paper activities. This is educational exploration only, **not expert-reviewed or board-calibrated** and **not an instruction to work with real electricity**.

`experimentAttempts` joins the existing locally controlled history and optional persistence; it is cleared by the same Clear local history control. `node --test tests/*.test.mjs` runs 77 Node tests including the M16 engine. `python3 tests/browser_m16.py` runs the isolated Chromium smoke (Playwright installed on developer machine). `node tools/verify-static-release.mjs` checks static paths. The public guide is `/virtual-experiment-lab/`. See `M16_QA_STATUS.md` and `EXPERIMENT_CONTENT_REVIEW_QUEUE.jsonl`.

**Still pending:** qualified educator/Hindi review, exact curriculum/chapter mapping, real Android/Hostinger HTTPS accessibility checks, child-safety approval and independent review of later M17/M18 prototypes. Private staging defaults (`noindex,nofollow`) remain enabled.


## M17 — Smart Classroom & Teacher Kit (first implementation)

Two original 5-step teacher-led lesson plans: Fraction Shares and Two Switches / One Path, each designed for a **single projector/laptop or shared phone**. Class flow: Prepare → Predict → Explore → Explain → Apply. Teacher may rotate **generic, non-identifying** group roles, show/hide reference explanations, select projector-friendly typography, use existing M16 virtual lab and open two original A4 printer-friendly bilingual worksheets. No accounts, child names, class roster, online peers or student records are collected by **Teacher Mode**. Estimated 15-minute lessons are design targets, not evaluated classroom durations.

**Code QA:** 84/84 automated Node tests, isolated Chromium M15/M16/M17 UI smoke, 22 HTML pages, 19 JavaScript modules, no broken static imports/cache targets. M17 has ten unreviewed bilingual facilitation-step records in `CLASSROOM_CONTENT_REVIEW_QUEUE.jsonl` (not scored learner questions); review of worksheets and guides is also pending. Use `node tools/export-classroom-review-queue.mjs` to regenerate the review queue. See `M17_QA_STATUS.md`.

**Release boundary:** A draft classroom toolkit is not a teacher trial, school partnership or approved curriculum. No public child-oriented launch or actual Hostinger HTTPS/device/accessibility approval. M18 AI & Digital Skills first pilot is now coded; see the current M18 section below.

## M18 — AI & Digital Skills Lab first private staging pilot (2026-11-23)

Four original bilingual topic tracks and 32 authored age-scaffolded question records explain AI patterns/limitations, deterministic algorithms, misinformation/evidence checks and personal digital privacy. All run locally with fixed explanatory feedback; no chatbot, remote model, paid API, child identity, personal messages or recruitment pressure. Versioned `digitalAttempts` reuses the existing opt-in browser history and clear-all control, with a genuine daily practice event (not an ability score).

**Software evidence:** 93/93 Node tests; isolated Chromium all 32 scenarios plus M15–M17 regressions; static package 23 HTML pages / 21 JS modules. See `M18_QA_STATUS.md`, `DIGITAL_CONTENT_REVIEW_QUEUE.jsonl` and `/ai-digital-skills/`. **32/32 new learning tasks are unreviewed; this is not professional fact-checking or approved educational curriculum.** Public child-facing launch, real Hostinger and real assistive-device tests remain pending.

## M19 — Staging hardening and offline release preflight (23 November 2026)

**No new learner game or public AI features:** this milestone removes inline printable styles/scripts to support a strict self-only staging CSP, adds a redundant `X-Robots-Tag: noindex` response-header config, a release preflight and read-only HTTPS smoke command. Two original worksheets still print with teacher guidance hidden, and all prior games/modules remain available.

```sh
npm test                              # 101 automated Node tests
npm run preflight                    # offline staging-only security and content inventory
node tools/release-preflight.mjs --public  # EXPECTED TO FAIL: human approvals missing
node tools/check-live-staging.mjs https://your-authorized-staging.example # ONLY after deploying privately
python3 tools/package-release.py     # builds and CRC-checks separate Hostinger/source ZIP files
```

See [M19 QA](M19_QA_STATUS.md) and [Staging operator checklist](STAGING_OPERATOR_CHECKLIST.md). **Do not confuse ZIP or local preflight success with actual Hostinger server, accessibility, Hindi/educator, legal or child-safety approval**. All **3,282 review records** still require documented qualified human decisions. Public child launch remains **NOT APPROVED**.