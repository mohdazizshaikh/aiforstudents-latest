# AI for Students — M15 partial staging prototype

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

## Project planning & tracking — M15–M18 (design only; updated 2026-11-23)

**As of the first documentation-only update the app was M14; M15 first pilot code is now implemented (2026-11-23).** The next feature direction is a Smart Learning Studio inspired by active-learning classrooms, adapted for Indian schools and shared/low-end devices. The proposed five-step learning loop is **Learn → Try → Play → Understand → Grow**, with legal link-first connections to official learning resources. **Two M15 first-pilot concept journeys are now coded; M16–M18 remain unimplemented and M15 public approval is pending.**

- [Project status dashboard](docs/PROJECT_STATUS.md) — what exists versus what is pending.
- [Project charter](docs/PROJECT_CHARTER.md) — mission, user groups, architecture, cost and child-safety boundaries.
- [M15–M18 roadmap](docs/ROADMAP.md) — staged lessons, virtual experiments, teacher kit and AI literacy.
- [Milestone tracker](docs/MILESTONE_TRACKER.md) and [implementation backlog](docs/IMPLEMENTATION_BACKLOG.md) — statuses, task IDs, dependencies, evidence and TBD owners.
- [Smart Learning Studio specification](docs/SMART_LEARNING_STUDIO_SPEC.md) — proposed lesson experience and acceptance criteria.
- [Official resource and licensing policy](docs/RESOURCE_INTEGRATION_POLICY.md) — DIKSHA, NCERT ePathshala, Virtual Labs and PM eVIDYA; links by default, not bulk content copying.
- [Teacher classroom pilot](docs/TEACHER_CLASSROOM_PILOT.md) — one-screen group learning, no login/roster requirement.
- [Decision and risk register](docs/DECISIONS_AND_RISKS.md) — unresolved decisions, risks, and human signoff requirements.

**Status boundary:** M14's 63 automated tests and passing GitHub CI do not establish human educational review, actual Hostinger deployment or approval for public child-oriented use.

## M15 coding increment — Smart Learning Studio
Two original bilingual pilot journeys under #smart-studio: fractions (shade 2/4, reason about equivalence) and simplified low-voltage circuit-path model (toggle an open/closed switch and explain the model bulb). Interactive Try and Play steps, explanations, optional paper missions and link-only official provider resources. Four task responses can be recorded in the existing versioned, optional local browser history and erased with Clear local history. No new accounts, paid AI, remote student data, or school-marks prediction. **Neither lesson has human educator/Hindi approval or confirmed class/chapter mapping.**

**QA:** 69/69 Node tests, isolated Chromium two-journey flow; 18 static HTML pages, 15 JS modules. [M15 QA](M15_QA_STATUS.md) · [M15 notes](docs/M15_IMPLEMENTATION_NOTES.md). Hostinger live deployment, M16–M18 and public launch are still pending.
