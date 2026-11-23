# M19 — Private Staging Security & Release Readiness

**Date:** 2026-11-23 | **Scope:** Technical hardening, NOT an actual production deployment or safety approval.

## Engineering changes
- Removed inline JavaScript/CSS from both M17 original classroom worksheet HTML pages; print button uses `assets/worksheet-print.js` and sheet layout uses `assets/worksheet-print.css`.
- Removed inline style attributes from the eight original game guide pages, and updated the guide generator so future regeneration retains strict-CSP compatibility.
- Added Apache/LiteSpeed **staging security-header configuration**: self-only CSP, `X-Robots-Tag: noindex, nofollow`, existing nosniff, Referrer-Policy, frame/permissions restrictions. **Actual Hostinger recognition and headers not verified.**
- Bumped service-worker cache version to M19 and precached both new worksheet assets. No student history is in the cache.
- Added `tools/release-preflight.mjs` for local HTML/asset/inline-script/header checks and review-inventory accounting. It explicitly refuses to mark a public release approved.
- Added `tools/check-live-staging.mjs` — **manual read-only HTTPS** test for 12 routes/assets checking noindex/security headers/content types; it requires a verified URL and has not been executed against Hostinger.
- Added `tools/package-release.py` — verified static allowlist ZIP packaging without content-review datasets, tests or student data; generates separate source/test archive.

## Evidence
- **102/102 Node tests pass** (previous 93 plus 8 release/preflight tests).
- Isolated Chromium M18 combined regression, including Studio, Virtual Lab, Classroom and Digital Skills passed with zero observed page JS errors.
- Isolated Chromium print-layout check passed for both original worksheet pages using the local stylesheet.
- Static check: **23 HTML pages, 22 JavaScript modules, 41 service-worker cache paths, zero missing file paths**.
- Staging preflight reports **zero blockers for private technical staging**; public mode intentionally fails.
- **3,282 content/review records pending documented human signoff**: 3,200 games, 32 Study Lab, 4 Studio, 4 experiments, 10 classroom facilitation steps, 32 Digital Skills. Of these, 3,272 are questions/checks and 10 are teacher facilitation steps.
- Hostinger staging ZIP contains **52 deployable static files**. Deployment is NOT performed by packaging.

## Important limitations and release gates
- **No verified Hostinger account staging install, live HTTPS responses, `.htaccess` execution, DNS or domain ownership.** Static configuration presence does not prove the server applies it.
- Browser tests use a local/inlined sandbox and **do not** prove actual deployed CSP, network imports, service-worker updates or all-device accessibility.
- No qualified educator, Hindi subject/translation, class/board mapping or textbook-edition approval. All 3,282 review records are pending.
- No low-end Android/TalkBack/VoiceOver or genuine classroom/teacher/learner trial. No legal child privacy/safeguarding approval or operational incident owner.
- No child accounts, strangers' chat, referrals or online social rooms have been deployed.

**Verdict: M19 CODE/QA VERIFIED FOR RESTRICTED HOSTINGER STAGING PACKAGE ONLY. PUBLIC CHILD-ORIENTED LAUNCH NOT APPROVED.**