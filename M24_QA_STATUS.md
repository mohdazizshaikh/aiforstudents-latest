# M24 — Static navigation accessibility and packaging privacy

**Date:** 2026-11-23 · **Milestone:** prelaunch engineering improvement. Not live hosting, WCAG certification, school pilot or child release approval.

## Why this work was needed
A source-level scan of all **23 HTML pages** found keyboard skip navigation missing from eight game guides and four standalone learning/co-op pages. Two original print worksheets also lacked a semantic `<main>` landmark and skip link. These are verifiable structural problems that can be repaired before real TalkBack/VoiceOver validation.

## What changed
- Added **Skip to main content** links with existing CSS focus styling to eight game guides, four static support/learning pages, and two classroom print worksheets.
- Added `id="content"` and `tabindex="-1"` to applicable static `<main>` landmarks, placed actual worksheet content within `<main>`, and made the root `#practice` skip destination focusable.
- Worksheet skip control is excluded from printed A4 sheets via the pre-existing `.no-print` rule. Original teacher-only notes remain hidden in print.
- Updated `tests/build_guides.py` so regeneration preserves both noindex staging and the accessible skip/main structure.
- Added `tools/audit-static-accessibility.mjs`, a deterministic source-level check for exactly one main region, a valid skip link target, HTML language, duplicate IDs, and missing static image alt attributes across all 23 pages.
- Versioned service-worker cache `aifs-discovery-m24-2026-11-23` so existing test clients can fetch updated static assets on refresh; updated deterministic historical regression expectations and live check version.
- Updated the staging/source ZIP output names to **M24**. Excluded `review-packet/` and `review-evidence/` and common secret/private files from the source archive. Added independent post-package privacy verification to CI. No student data or reviewer evidence belongs in ZIPs.

## Reproducible checks (Node.js 22 + Python 3)
```sh
npm test
npm run audit-a11y
npm run review-packet
npm run review-evidence:template
npm run review-evidence:check
node tools/release-preflight.mjs
python3 tools/package-release.py
python3 tools/check-package-privacy.py
node tools/release-preflight.mjs --public  # MUST remain blocked
```

The updated Node suite includes **125 structural/unit tests** (verify latest GitHub CI and do not equate passing tests with professional WCAG evaluation). The static-HTML audit covers **23 of 23** project HTML pages; it does not inspect JavaScript-generated focus during actual interaction, mobile gestures or screen-reader announcements. Isolated browser checks previously run are not equivalent to live HTTPS or real devices.

## Independent accessibility acceptance is still OPEN
The following require human testing on real devices and school contexts: keyboard-only travel, TalkBack (low-end Android), VoiceOver/NVDA, Hindi accessible names/reading order, 200% zoom, landscape projector, A4 print verification, PWA install/update and offline mode, shared-device privacy and real student/teacher feedback under appropriate permission.

**Content review:** 3,282 content records still need qualified educational/Hindi signoff. **Child safety/legal** and **live Hostinger** restrictions, rollback and HTTPS verification remain open. No third-party textbook/media was copied; no online student chat/account, public indexing or deployment is enabled.

## Evidence
[Milestone tracker](docs/MILESTONE_TRACKER.md) · [Staging checklist](STAGING_OPERATOR_CHECKLIST.md) · [A11y issue](https://github.com/mohdazizshaikh/aiforstudents-latest/issues/5) · [Release gates](RELEASE_GATES.md).

**Verdict:** M24 source/code/CI checks for private staging only; **public child-oriented launch remains NOT APPROVED**.

## CI staging ZIP handoff (not deployment)
The pipeline first runs source/static tests and ZIP privacy checks, then attaches the **M24 Hostinger private-staging/noindex ZIP** as a GitHub Actions artifact with **7-day retention**. An authorized operator must download, inspect, back up the intended restricted staging site and deploy manually; the artifact is **not** a live site, does not grant authentication and must never be treated as launch approval. GitHub Actions artifacts on a public repository may be accessible to people with GitHub access; no reviewer decisions or secrets should be present.
