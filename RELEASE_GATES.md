# Release gates — M12-B/M13 private staging build

| Gate | Current state | Required independent evidence |
|---|---|---|
| Static functional prototype | Implemented | Automated tests and isolated Chromium runs |
| 40 solo modules / 3 same-device co-op | Implemented | Browser/gameplay QA and representative content checks |
| Age-band structural variation | 0 wholly identical game banks | Expert review of actual age appropriateness, language and accessibility |
| 3,200 challenge records | UNREVIEWED | Bilingual educator item-by-item signoff, defect resolution and record of approvers |
| Talent/psychometric validation | NOT PROVIDED | Validation study and methodology if assessment claims are ever intended; otherwise keep practice-only language |
| Hindi fluency and educational equivalence | NOT APPROVED | Human Hindi language/subject review |
| Child privacy/legal/safeguarding | NOT APPROVED | Country-specific legal review, governance, data mapping, content safety, accessibility and incident response |
| Public online friend invites and chat | NOT IMPLEMENTED | Adult / minor eligibility review, permitted consent and social controls, backend security/load tests, human incident owner |
| True WCAG 2.2 AA / actual assistive tech | NOT TESTED | Keyboard, NVDA, TalkBack, VoiceOver, real low-end devices, contrast, zoom, language usability |
| Hostinger live HTTPS/deployment | NOT DONE | Account access, staging subdomain, backups, extraction, module fetching, security headers, service worker, rollback test |
| Domain canonical URLs/sitemap | NOT CONFIGURED | Verified domain and correct public-page URLs, own-site links, XML validation, indexing approvals |
| Google/Bing Search Console | NOT CONNECTED | Domain ownership, verification and indexing checks |
| Real-user educational efficacy and D7/D30 return | NOT MEASURED | Consented, ethical pilot measurements; no dark patterns |
| Revenue model | NOT VALIDATED | Institution/educator research, payment/legal/tax and human support plan |

## Testing limitations

Node tests validate deterministic logic and structural properties. The isolated Chromium browser test inlines modules because localhost is blocked in this runtime. It is NOT proof of a live deployment, correct production module fetch, secure server configuration or educational validity. SEO pages use `noindex,nofollow` by default. Public launch must deliberately remove staging flags **after** approvals, not merely upon domain configuration.

## Safe staging instructions

1. Back up any existing website. Use a separate staging website/subdomain, ideally access-protected through Hostinger hPanel.
2. Extract the separate Hostinger ZIP **contents** into that staging site's `public_html`, not over an existing public homepage.
3. Confirm site loads on HTTPS, zero JS 404s, browser console, small screens, PWA/offline behavior, current content version, language switch, local reset, and `.htaccess` header response.
4. Do not collect information from children or invite public child users before review.
5. To prepare SEO URLs **after** selecting a controlled verified domain, run `node tools/configure-domain.mjs https://verified.example` on a **copy** of source and rebuild the hosting ZIP. This will retain noindex and deliberately omit hreflang until equivalent Hindi URLs exist.
6. If a release gate fails, retain the private staging build; do not switch indexing on.

## M14 additions

| Gate | State |
|---|---|
| Starter Study Lab / basic exam study habits | IMPLEMENTED (32 short practice items; not board-specific) |
| Study Lab data stored only locally by default | IMPLEMENTED; shared-device privacy review pending |
| Educator + Hindi review of new Lab checks | **32/32 PENDING** |
| Detailed subject/board-aligned learning and exam content | NOT IMPLEMENTED |
| M14 real device accessibility and live Hostinger | NOT TESTED |