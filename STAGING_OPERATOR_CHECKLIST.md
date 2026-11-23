# Hostinger Business — Private Staging Operator Checklist

**Draft runbook, 2026-11-23. Not evidence of deployment.** Use only an existing authorized Hostinger account, never send passwords into GitHub, chat or review files.

## Preparation — manual operator gates
- [ ] Confirm actual Hostinger plan/site and select **separate restricted staging subdomain/site**; never overwrite a public working site's `public_html`.
- [ ] Back up existing site and test recovery location; record backup method without secrets.
- [ ] Install password/access restriction using Hostinger hPanel or appropriate platform controls. `noindex` alone **does not protect a private site**.
- [ ] Confirm staging site has a valid HTTPS certificate and the correct document root.
- [ ] Review whether `.htaccess` on the actual Hostinger plan supports `Header` directives and strict CSP; correct at the server level if not.
- [ ] From `/mnt/data/aiforstudents_hostinger_staging_m19.zip`, extract **ZIP contents** into the staging site's document root, not the source/tests ZIP. No Node process or paid API required on hosting.

## Smoke on the actual HTTPS staging site
- [ ] Load root page and Smart Studio, Virtual Lab, Teacher Kit, Digital Skills in English and Hindi on a low-end phone.
- [ ] Verify 12 configured routes/assets with `node tools/check-live-staging.mjs https://YOUR-VERIFIED-STAGING-ORIGIN` from your trusted development machine. Optional restricted-host credentials can be supplied as `STAGING_AUTH_HEADER` environment variable, **never recorded in a report**.
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