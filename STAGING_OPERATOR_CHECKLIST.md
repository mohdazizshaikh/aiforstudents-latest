# Hostinger Business — Private Staging Operator Checklist

**Draft runbook, 2026-11-23. Not evidence of deployment.** Use only an existing authorized Hostinger account, never send passwords into GitHub, chat or review files.

## Preparation — manual operator gates
- [ ] Confirm actual Hostinger plan/site and select **separate restricted staging subdomain/site**; never overwrite a public working site's `public_html`.
- [ ] Back up existing site and test recovery location; record backup method without secrets.
- [ ] Install password/access restriction using Hostinger hPanel or appropriate platform controls. `noindex` alone **does not protect a private site**.
- [ ] Confirm staging site has a valid HTTPS certificate and the correct document root.
- [ ] Review whether `.htaccess` on the actual Hostinger plan supports `Header` directives and strict CSP; correct at the server level if not.
- [ ] From a clean source checkout run `python3 tools/package-release.py` and use the generated `aiforstudents_hostinger_staging_m24.zip` from the checkout's parent directory; extract **ZIP contents** into the staging site's document root, not the source/tests ZIP. A local packaging path is not evidence of a file already uploaded. No Node process or paid API required on hosting.

## Smoke on the actual HTTPS staging site
- [ ] Load root page and Smart Studio, Virtual Lab, Teacher Kit, Digital Skills in English and Hindi on a low-end phone.
- [ ] Verify 12 core targets with `node tools/check-live-staging.mjs https://YOUR-VERIFIED-STAGING-ORIGIN`, then the complete local manifest with `node tools/check-live-staging.mjs https://YOUR-VERIFIED-STAGING-ORIGIN --full` from your trusted development machine. Optional restricted-host credentials can be supplied as `STAGING_AUTH_HEADER` environment variable, **never recorded in a report**.
- [ ] In browser DevTools check Console and Network: zero broken JavaScript imports, CSS 404s or mixed-content errors.
- [ ] Confirm static response headers: CSP, nosniff, Referrer-Policy and `X-Robots-Tag: noindex`; actual status HTTP 200 and served JavaScript MIME type.
- [ ] On an authorized test browser complete a game and Studio/Virtual Lab/Digital check, verify optional local history and clear-all reset.
- [ ] On a device with no internet try only the explicitly cached pages/activities; test service-worker refresh/update and ensure saved local data is not leaked or unintentionally removed.
- [ ] Print the two classroom worksheets to real A4/PDF printer; teacher answer guidance must not appear in print.
- [ ] Manually check zoom 200%, keyboard-only, TalkBack/VoiceOver, and reduced-motion on appropriate devices; log findings and owners.
- [ ] Test rollback by restoring previous backed-up staging site before any external pilot.

## Evidence log template — fill only after real verification
| Evidence | Value (do not guess) |
|---|---|
| Authorized operator | TBD |
| Exact staging origin | TBD |
| Backup/restore receipt | TBD |
| HTTPS certificate / response sample | TBD |
| Staging live smoke tool JSON and date | TBD |
| Android/assistive technology devices | TBD |
| Printable A4/teacher review | TBD |
| Security/child-safety approval | PENDING |
| Qualified bilingual content approval | PENDING |
| Public indexing/removal of noindex authorized | **NO** |

**Stop condition:** If privacy, page source, headers, security access, educational content or accessibility gate fails, keep the release private and `noindex`. Do not invite child users or enable online social interactions.
### M22 note — complete manifest checker
The `--full` read-only audit derives allowable routes/assets from repository source and the service-worker manifest; it does not authenticate the staging site, simulate actual navigation/keyboard interaction or substitute for a real phone, screen reader or rollback. See [M22 guide](docs/M22_FULL_STAGING_AUDIT.md). Never commit/live-share staging auth headers or reports containing secrets.

### M24 source/asset and accessibility checks
- [ ] Use the current **M24** Hostinger ZIP from a clean repository checkout. Run `npm run audit-a11y`, `python3 tools/package-release.py` and `python3 tools/check-package-privacy.py` locally before authorized private upload; do not include reviewer evidence or secrets.
- [ ] Verify **every static guide page** offers keyboard Skip to content navigation and one main landmark; screen-reader and physical keyboard navigation require human checks.
- [ ] Test service worker **aifs-discovery-m24-2026-11-23** upgrade/refresh from any prior private staging cache and verify all 41 referenced cache paths after the new archive is installed.
- [ ] Confirm worksheet skip controls are not printed and teacher-only notes remain hidden on a real A4 printer.
- [ ] Record real-site and real-device evidence (not credentials) against [M24 QA](M24_QA_STATUS.md); no child/public access pending approvals.

- [ ] If using the CI artifact, choose the latest passing M24 workflow run, download the `m24-hostinger-private-staging-noindex` ZIP artifact within its seven-day retention, inspect it, and upload only its contained Hostinger ZIP file contents to an access-controlled staging document root. The artifact does **not** install itself or provide privacy access restrictions.

### M25 browser CI vs actual restricted hosting
- [ ] Check the latest GitHub Actions `browser-smoke` job and its seven-day `m25-local-browser-regression` report; a passing localhost Chromium run is useful engineering evidence only.
- [ ] Repeat equivalent flows on **real authorized restricted Hostinger HTTPS** with actual CSP/noindex response headers, offline service worker upgrade, physical low-end Android, TalkBack/VoiceOver/NVDA and A4/projector. Preserve noindex and authentication independently.
- [ ] Do not infer legal approval, qualified educational review or school pilot permission from a Playwright PASS. [M25 guide](docs/M25_BROWSER_REGRESSION.md).

### M26 — Human safeguarding gate before any child access
- [ ] Review [M26 draft runbook](docs/M26_CHILD_SAFETY_OPERATIONS.md) with real authorized safeguarding lead/deputy, privacy/legal professional, school lead and incident operator; record roles privately, not in GitHub or CI artifacts.
- [ ] Generate `safety-handoff/operations.json` locally with `npm run safety-handoff:template`; do not commit or deploy it. Structural `--check` success means only well-formed evidence, **not actual approval**.
- [ ] Conduct real tabletop incident-response drill and legal/shared-device/staging log assessment with accountable humans; record access-controlled acknowledgements and unresolved issues.
- [ ] Maintain child-facing noindex and restricted staging until independent human go/no-go decision and all other release gates are complete.

### M27 — Deployed byte integrity and accidental source-file exposure
- [ ] Verify the installed private Hostinger ZIP was generated from the **same exact checkout commit** used by the M27 checker (otherwise SHA-256 mismatch is expected). Backup before deployment.
- [ ] Run `node tools/check-live-staging.mjs https://AUTHORIZED-PRIVATE-STAGING-ORIGIN --full --integrity` on a trusted operator machine. Provide optional `STAGING_AUTH_HEADER` only through its local protected environment; never paste secrets in issues/CI.
- [ ] Confirm all static responses, `robots.txt`, strict headers and full content hashes match local source; seven source-only URL probes must return 401/403/404/410 (or fix server rules). Never request private data bodies for diagnosis.
- [ ] Test a second unauthenticated browser cannot browse restricted staging, plus genuine HTTPS/CSP, real low-end Android, assistive technology and rollback. A noindex header or hash PASS is **not authentication**.
- [ ] Keep source ZIP, approval/incident records and unreviewed content queues **off the web document root**. Log only minimal operator evidence in a restricted internal register.
- [ ] Public child release remains blocked. [M27 instructions](docs/M27_STAGING_INTEGRITY.md).

### M28 — Latest shared-device privacy and PWA update (overrides older M24 filename guidance)
- [ ] Use the verified **M28** Hostinger ZIP `aiforstudents_hostinger_staging_m28.zip` from the same checked-out commit (not the older M24 ZIP); keep site independently restricted and noindex. The source/tests ZIP is **not** web-deployable.
- [ ] On actual Android/shared classroom browser, create dummy practice in one tab (default session), clear from another same-site tab, and confirm the first tab no longer displays history. Repeat with **Remember my progress** opt-in and an independent new tab. No child personal data during tests.
- [ ] Test sleeping/background/discarded tabs, browsers without BroadcastChannel, multiple browser profiles, physical reset, browser restart and actual upgrade from M24 service worker to **aifs-discovery-m28-2026-11-23**; record issues and qualified operator/guardian review.
- [ ] Run [M27 byte-integrity checker](docs/M27_STAGING_INTEGRITY.md) against **actual authorized HTTPS staging**, and manually verify backup/rollback, headers and no source-only files exposed.
- [ ] Explain that clearing this browser does **not** erase other devices, backups or hosting logs. Child-oriented public release remains NOT APPROVED.
