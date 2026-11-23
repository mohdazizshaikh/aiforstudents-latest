# M27 — Staging source-byte integrity and ZIP provenance

**Date:** 2026-11-23. Engineering-only tool; **not evidence of deployment, qualified approval or public release.**

## Why this exists

The M22 read-only HTTPS checker confirmed status, MIME and security headers, but could not detect all stale or accidentally edited assets. M27 compares **raw HTTPS response bytes** with the exact SHA-256 of the same local checked-out source file for every path in the M22 full manifest. The release ZIP checker now verifies every archived file's SHA-256 against the checked-out source.

## Authorized restricted Hostinger operator usage

From the **same Git commit** used to build and install the staging archive, on a trusted machine:

    node tools/check-live-staging.mjs https://YOUR-PRIVATE-STAGING-ORIGIN
    node tools/check-live-staging.mjs https://YOUR-PRIVATE-STAGING-ORIGIN --full
    node tools/check-live-staging.mjs https://YOUR-PRIVATE-STAGING-ORIGIN --full --integrity

The last command is the strict M27 option. The CLI **requires --full with --integrity**; a partial path check cannot certify a complete static manifest. If the staging site is access restricted and an authorized operator needs an Authorization header, set the optional STAGING_AUTH_HEADER in their **local protected environment**. Never paste secrets in GitHub, chats, logs or public CI reports.

The strict mode verifies noindex HTML and X-Robots-Tag, correct MIME type, self-only CSP including script-src, object-src none, frame-ancestors none, no unsafe-inline/eval, X-Frame-Options DENY, no camera/microphone/geolocation permissions, nosniff and a Referrer-Policy. It rejects external-origin requests, redirects, unlisted paths and unexpectedly large responses (more than 2 MiB). It neither changes the server nor follows links. Its JSON report contains only path/status/failure descriptions; not HTTP bodies or the authentication header.

## Packaging and reproducible checks

    node --test tests/m27-staging-integrity.test.mjs
    python3 tools/package-release.py
    python3 tools/check-package-privacy.py

The package guard compares every member of both M24-named static Hostinger ZIP and source ZIP against the current checkout byte-for-byte by SHA-256. It also excludes reviewer/safety evidence, common secrets and suspicious archive paths. Do **not** confuse a matching local ZIP with an uploaded, properly secured real site.

Source hashes cover the full M22 allowlist of static routes and PWA assets. The verifier intentionally does not download hidden server configuration such as .htaccess: that file must not be publicly served. Real devices may also retain older offline caches, requiring separate manual service-worker upgrade tests.

## Independent evidence — still missing

- Actual authorized Hostinger restricted HTTPS deployment, authentication, backups, rollback and real-site integrity output.
- Qualified educational/subject/Hindi review of all 3,282 pending content records and accurate chapter/grade mapping.
- Accountable child-safeguarding/India-relevant privacy/legal review and school pilot permission.
- Actual low-end Android, TalkBack/VoiceOver/NVDA, physical A4/projector and shared-device privacy testing.

Store any real staging operator report, source commit and ZIP hash in a **restricted private operational record**, not in the source repository. No operator names, student identities or credentials in GitHub.

[Hostinger issue #2](https://github.com/mohdazizshaikh/aiforstudents-latest/issues/2) · [M22 full audit](M22_FULL_STAGING_AUDIT.md) · [Operator checklist](../STAGING_OPERATOR_CHECKLIST.md).

**No live site was tested during M27 implementation. Public child-oriented release remains NOT APPROVED.**
