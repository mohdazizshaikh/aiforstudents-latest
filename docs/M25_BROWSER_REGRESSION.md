# M25 — Real Chromium local-browser regression gate

**Date:** 2026-11-23. **Scope:** browser-level CI quality for the source prototype. It does NOT establish any actual Hostinger staging deployment, screen-reader certification, reviewed learning content, or child-facing public-release permission.

## Why
M24 had 125 Node tests and 23-page source HTML structural checks, but the normal CI did not run real browser interactions after changes. Earlier isolated browser scripts bundled module source inline. The M25 browser job instead loads the unchanged source through a temporary **localhost HTTP server** in headless Chromium, so real ES module imports and actual browser storage, service worker and print media are exercised.

## M25 CI gate
`tests/browser_m25_ci.py` starts a temporary local static HTTP server (bound to 127.0.0.1), opens `http://localhost` in headless Chromium and checks:

- Real ES modules load the solo game library, Smart Studio (M15), Virtual Lab (M16), Teacher Kit (M17) and AI/Digital Skills (M18) without runtime exceptions.
- Hindi choice changes the document language, Virtual Lab and Digital Skills UI; reverse to English without data loss.
- Opt-in browser-local storage, one recorded practice attempt and clear-all reset; non-local HTTPS requests are blocked in this test.
- Keyboard Tab and Enter reach the M24 Skip to games target and focus it.
- Both A4 worksheet DOMs expose three practice instructions on screen; print CSS hides teacher-only answer notes and no-print navigation.
- A 390 px mobile viewport has no document-level horizontal overflow.
- M24 service worker installs its 40+ source-declared cached resources, then both a Studio guide and the native learner app boot in **browser-simulated offline mode**.

**Important:** `localhost` is a browser secure context but is **not production HTTPS**. The simulated offline/network check is not a real low-end Android, screen reader, remote school network, Hostinger asset/CDN/CSP header, real A4 printer or usability test.

### Reproduce
With Python 3.12 and Node.js 22+, install compatible Playwright Chromium:

```bash
python -m pip install playwright==1.56.0
python -m playwright install --with-deps chromium
python tests/browser_m25_ci.py
npm test
npm run audit-a11y
npm run review-packet
node tools/release-preflight.mjs --public   # EXPECTED to fail
```

CI uses a separate `browser-smoke` job on an explicitly supported `ubuntu-24.04` runner, plus the existing Node/content/staging ZIP and privacy-archive checks. It uploads the resulting local-only JSON smoke report for seven days. A browser failure fails the workflow and must be fixed before merging. The script emits no student data, account credentials, education approvals or live-host URLs.

## Release status and human signoff
- The source review inventory still counts **3,282 pending** human content decisions. Engineering tests cannot grant any.
- [Issue #2](https://github.com/mohdazizshaikh/aiforstudents-latest/issues/2): actual authorized private Hostinger HTTPS, access controls, backup/rollback and network header inspection still pending.
- [Issue #5](https://github.com/mohdazizshaikh/aiforstudents-latest/issues/5): actual low-end Android, TalkBack/VoiceOver/NVDA, keyboard/zoom, real projector/A4 and inclusive pupil/teacher feedback still pending.
- [Issue #4](https://github.com/mohdazizshaikh/aiforstudents-latest/issues/4): independent child privacy/safeguarding/legal and incident response owner pending.
- [Issue #6](https://github.com/mohdazizshaikh/aiforstudents-latest/issues/6): exact class/board/edition curriculum mapping and ethical school pilot pending.

**Public launch remains BLOCKED.** Keep noindex and no online child chat/accounts; do not invite pupils to try unreviewed lessons.
