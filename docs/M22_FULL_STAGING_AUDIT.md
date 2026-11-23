# M22 — Full-manifest private HTTPS staging audit

**2026-11-23 · Engineering increment · No actual Hostinger installation or live staging URL tested in this development run.**

## What changed
- `tools/check-live-staging.mjs` retains the existing **12-target core** read-only check for compatibility.
- The new optional `--full` mode derives a deduplicated allowlist of static pages and assets from the project's own site tree and service worker cache manifest. It does **not** crawl external links or follow redirects.
- Checks require authorized **HTTPS**, no embedded passwords or query/port, HTTP 200, expected MIME for HTML/JS/CSS/SVG/webmanifest, conservative staging X-Robots-Tag/noindex and CSP/nosniff/referrer policy. Checks source-versioned service worker asset.
- The script accepts an optional `STAGING_AUTH_HEADER` environment variable (local-only), never serializes the credential to its result, and reports only target paths/statuses and errors.
- Offline mock CI verifies full-manifest coverage and error detection; **CI mocks are not a real Hostinger server, security scan, accessibility test, classroom pilot or legal signoff**.

## Operator instructions
Run after an authorized operator has:
1. Created a separate **access-restricted** Hostinger staging site, tested backup/rollback and verified HTTPS.
2. Installed reviewed static archive contents to the correct staging document root.
3. Confirmed that any access credentials are passed privately through a local environment variable, **not** a chat, URL, GitHub issue, build artifact or report.

```sh
node tools/check-live-staging.mjs https://your-authorized-staging.example
node tools/check-live-staging.mjs https://your-authorized-staging.example --full
```

Nonzero exit = check failed. Inspect the JSON report and fix server/MIME/asset defects, then retest. Do not use CI/mock results as live verification. The script intentionally has no auto-deploy, password verification, DNS mutation or indexing enablement.

## Separate human and device evidence
- Confirm **physical low-end Android, TalkBack/VoiceOver/NVDA, keyboard-only, Hindi semantics, 200% zoom, print A4, projectors and offline service-worker lifecycle**.
- Confirm actual operator backup/rollback and access restriction (noindex does **not** provide authentication).
- Obtain qualified subject/Hindi reviews of 3,282 records, exact curriculum mapping, child privacy/legal/safeguarding owners and school permissions.
- Keep public indexing and online child social features **disabled** without independent approval.

Related: [Staging operator checklist](../STAGING_OPERATOR_CHECKLIST.md), [Release gates](../RELEASE_GATES.md), [Hostinger issue #2](https://github.com/mohdazizshaikh/aiforstudents-latest/issues/2), [A11y issue #5](https://github.com/mohdazizshaikh/aiforstudents-latest/issues/5).

### M27 upgrade (2026-11-23)
Full manifest now also includes `robots.txt`. The optional **`--full --integrity`** mode compares each served asset SHA-256 to its checked-out source, checks stronger CSP/frame/permissions headers, and probes seven forbidden source-only URLs without consuming/logging their bodies. See [M27 runbook](M27_STAGING_INTEGRITY.md). This is still read-only and requires actual authorized private HTTPS staging to produce any real-host evidence.
