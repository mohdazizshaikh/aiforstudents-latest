# M28 — Shared-device, multiple-tab privacy reset

**Date:** 2026-11-23. **Status:** prototype engineering safeguard with real local Chromium regression tests. Not a certification of India-specific child privacy, actual mobile device compliance or public-release readiness.

## Risk addressed

Previously, pressing **Clear local history** cleared the tab where the button was pressed and persisted local keys, but a second already-open tab could still show its in-memory practice or session storage. That is especially undesirable on school/shared-family devices.

## M28 implementation

- On **Clear local history**, delete all known app progress keys from this tab's localStorage and sessionStorage, clear in-memory history, terminate active solo/team state, restore lobby/privacy controls and notify local feature surfaces using existing reset events.
- If the browser supports BroadcastChannel, send **only** a small same-origin action message identifying a clear event. No learner names, attempts, responses, answers, reflections or device identifiers are transmitted. Other open tabs in the **same browser profile and origin** process the reset without rebroadcasting.
- Listen for same-origin localStorage removal as a fallback for persisted opt-in history when BroadcastChannel is unavailable. The privacy action is deliberately conservative: a peer tab may lose its currently in-progress unsaved work.
- Update the plain-language English/Hindi shared-device caution and privacy guide to encourage clearing progress and closing all open tabs before handing a device to someone else.
- Bump static service worker cache to **aifs-discovery-m28-2026-11-23** to let eligible clients refresh the changed application JS. The Hostinger staging and source archives are named **M28** and remain marked noindex/private-staging only.

## Exact browser regression covered

The GitHub Actions native Chromium localhost suite now checks:

1. Default tab-session privacy: one tab records a dummy exercise, another tab clears history, the peer tab's in-memory attempt/session storage resets.
2. Explicit opt-in persistence: a recorded practice item loads from localStorage in a new same-browser tab; clearing from that new tab resets the original tab and disables its remembered status.
3. Existing language, keyboard, mobile-width, workbook print, offline service-worker and privacy checks continue.
4. Static unit checks assert the BroadcastChannel message contains only the minimal clear action and that both storage kinds and in-memory bridges are cleaned.

### What is NOT guaranteed

- This control cannot clear data in **different browser profiles, private windows, other phones/computers, synced backups or manually copied records**.
- A background/frozen/discarded tab may not execute JavaScript promptly, and older browsers may lack BroadcastChannel. Physical shared-device tests are still mandatory.
- Local browser data may be viewed by anyone with access to the same unlocked browser until it is cleared. Shared-device educators should avoid personal reflections on public devices.
- The privacy page's known-key clear does not erase hosting logs, browser history, downloaded files or data provided to independent official external websites.
- This improvement does not mean a child-data protection impact assessment or legal consent protocol has been approved.

## How to verify

On a clean source checkout with Node 22+ and the supported Chromium test runtime:

    npm test
    python tests/browser_m25_ci.py
    python3 tools/package-release.py
    python3 tools/check-package-privacy.py
    node tools/release-preflight.mjs --public

The last command must deliberately **fail**; a passing engineering build is not authorization to publish for children.

### Manual prelaunch evidence still needed

- An authorized operator should update **actual restricted Hostinger HTTPS staging** using the M28 ZIP, then verify real browser offline cache migration from M24 to M28 and header/source integrity with the M27 checker.
- A qualified privacy/safeguarding reviewer should supervise clearing tests on an actual low-end Android/shared classroom device, including two tabs, opt-in/local session modes and device sleep/resume.
- Teacher/guardian/legal owners must approve real school procedures; 3,282 educational review records and all other P0 release gates remain open.

[Real-device/accessibility Issue #5](https://github.com/mohdazizshaikh/aiforstudents-latest/issues/5) · [Safeguarding Issue #4](https://github.com/mohdazizshaikh/aiforstudents-latest/issues/4) · [Operator checklist](../STAGING_OPERATOR_CHECKLIST.md).

**Public child-facing launch remains NOT APPROVED.**

## GitHub engineering verification — 2026-11-23
[M28 PR #14](https://github.com/mohdazizshaikh/aiforstudents-latest/pull/14) merged into main at `a7db81e884382173e173ec581d1cddf3d1f303d9`. [Merged main CI](https://github.com/mohdazizshaikh/aiforstudents-latest/actions/runs/45212846388) completed **successfully** for both jobs: 145/145 Node tests and nine Chromium localhost scenarios, including two cross-tab privacy cases. The M28 noindex Hostinger ZIP and M28 local-browser report artifacts are attached with seven-day retention (through November 30, 2026). These artifacts are **not a deployed site or legal/child-safety approval**.
