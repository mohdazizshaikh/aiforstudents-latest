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
