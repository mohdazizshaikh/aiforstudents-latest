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

## M15–M18 rollout gates — first M15 prototype coded 2026-11-23

| Workstream | Current status | Must be evidenced before milestone can be called complete |
|---|---|---|
| M15 Smart Learning Studio | **2 ORIGINAL CONCEPT PILOTS CODED; STAGING ONLY, EDUCATIONAL APPROVAL PENDING** | Two sourced original bilingual lesson flows, reviewed concept explanations, keyboard alternatives, local progress/reset, official external links and real mobile QA |
| M16 Virtual Experiment Lab | **TWO ORIGINAL SIMULATIONS CODED; STAGING ONLY** | Independent fraction/circuit model truth checks; accessible touch/keyboard alternatives; offline mobile tests; safe simulation wording |
| M17 Classroom and Teacher Kit | **PLANNED, NOT CODED** | Reviewed projector-friendly group lesson, original licensed printable materials, no child roster, teacher feedback and safeguarding gates |
| M18 AI & Digital Skills | **PLANNED, NOT CODED** | Age-appropriate AI literacy and critical thinking, safety-checked deterministic activities and truthful limitations; no unrestricted generative AI |
| Resource Catalog | **POLICY DOCUMENTED ONLY** | Exact official links, copyright/license per item, reviewer verification, external-site privacy notice and accessible fallback |
| Content and curriculum pilot | **BLOCKED pending educational approval** | Correct class/board/edition mapping for provisional fractions/circuit concepts; no premature NCERT-aligned claims |
| Existing game and Study Lab content | **3,232 items without documented expert signoff** | Individual bilingual review, corrections, review audit trail; 54 repeating age positions examined |

Never mark a product design/plan document as an implemented code feature. See [Project Status](docs/PROJECT_STATUS.md), [Milestone Tracker](docs/MILESTONE_TRACKER.md), and [Resource Policy](docs/RESOURCE_INTEGRATION_POLICY.md). All previous release blockers remain in force; staging remains noindex.

### M15 evidence (not approval)
The two bilingual concept-pilot journeys and four exercise checks are implemented. 69 Node tests + isolated Chromium smoke pass, with 18 pages and 15 JS modules validated structurally. External references are provider homepages only. **No expert/Hindi signoff, class/board alignment, actual Android/assistive-technology/Hostinger HTTPS QA or child-oriented public release.** M16–M18 are not built.

### M16 first pilot gates, 2026-11-23
- **Code implemented:** two original browser simulations, four recorded challenges, English/Hindi drafts, numeric/text alternatives, local-only progress/clear and updated static cache, no electrical hardware activity.
- **Automated evidence:** 77 Node tests and isolated Chromium M15+M16 regression smoke pass; 19 HTML pages and 17 JS modules have no missing static-import/cache targets.
- **Still blocking M16 completion/public launch:** independent educator/Hindi review of four new challenges, class/chapter/copyright mapping, low-end Android + TalkBack/VoiceOver and live Hostinger HTTPS/server/service-worker test, privacy/legal/safeguarding approval.
- Existing unreviewed scope: **3,200 game + 32 Study Lab + 4 M15 + 4 M16 task checks**, before any qualified review. Not psychometrically validated. M17–M18 are still **PLANNED**.
