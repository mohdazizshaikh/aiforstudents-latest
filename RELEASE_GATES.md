# Release gates — M28 private prototype and M29 full-product plan

> **M29 PUBLIC RELEASE TRUTH — 2026-11-24: NOT APPROVED.** 145 Node + nine Chromium local checks at M28 verify **software prototypes**, not a complete curriculum or safety. New 100-task plan is **PLANNED, 0/100 done**. The comprehensive Class 1–12 labs, AI tutor, validated adaptive learning, teacher dashboard, real host, physical accessibility and classroom/educational/child-safety approval are absent or pending. [Full product scope](docs/FULL_PRODUCT_SCOPE_AND_DONE.md) · [2 × 50 execution batches](docs/MASTER_EXECUTION_PLAN.md).


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

## M15 pilot implementation addendum (2026-11-23)

| M15 acceptance part | State | Outstanding evidence |
|---|---|---|
| Two original bilingual concept journeys | IMPLEMENTED AS PROTOTYPE | Qualified educator review of correctness and Hindi |
| Learn–Try–Play–Understand–Grow interaction | IMPLEMENTED AS PROTOTYPE | Actual device/teacher usability testing |
| Local progress and clear history | IMPLEMENTED; automated/isolated checks | Shared-device privacy field test |
| External official reference links | LINK-ONLY HOMEPAGES | Exact chapter matching, license, editorial checks |
| Class/board syllabus alignment | **UNVERIFIED** | Current official edition/chapter review |
| Virtual experiments / teacher kit / AI literacy | **M16–M18 FIRST PILOTS CODED; NOT APPROVED** | Independent review, accessibility, hosting and safeguards still pending |
| M15 public launch approval | **NOT GRANTED** | All previously listed education, safety, hosting and accessibility gates |

## M16 virtual experiment pilot gates — 2026-11-23

| Gate | Actual status | Remaining evidence |
|---|---|---|
| Two original conceptual simulations | CODED (fractions and two-switch series model) | Educator/Hindi human validation |
| Four recorded experiment checks | CODED and Node-verified | Age/class appropriateness, independent educational review |
| Keyboard/text alternative in browser UI | CODED + isolated Chromium smoke | Real TalkBack, keyboard, zoom, contrast, low-end phone QA |
| Privacy and local clear integration | CODED + mocked-browser test | Shared-device and production policy review |
| Hostinger private staging | NOT DEPLOYED | Real HTTPS/module/service worker tests, backup/rollback |
| Public child-oriented release | NOT APPROVED | Child legal/safeguarding and education approvals |
| M17/M18 | **FIRST PILOTS CODED** | Independent educator/child-safety and field QA still pending |

See `M16_QA_STATUS.md`, `EXPERIMENT_CONTENT_REVIEW_QUEUE.jsonl`. No project test may override a human release gate.


## M17 classroom/teacher first implementation — additional gates

| M17 gate | Status | Evidence required |
|---|---|---|
| Two 5-step original teacher-led flows with rotating generic roles | CODED, STAGING ONLY | 84 automated tests and isolated Chromium smoke; no school pilot |
| Projector-friendly UI and two original bilingual A4 printables | CODED, UNREVIEWED | Real projector/A4 printing, nonvisual and low-end Android usability checks |
| Teacher answers and Hindi content | 10/10 classroom facilitation steps PENDING REVIEW | Qualified bilingual educator approval and worksheet review |
| Student identities, attendance and classroom analytics | NOT COLLECTED BY TEACHER MODE | Confirm on-host privacy and school operating processes |
| Classroom trial | NOT PERFORMED | School authorization, child-safety/consent rules, responsible teacher and actual observational evidence |
| Public child release | NOT APPROVED | Existing release gates (including 3,200 games + 32 Study Lab + 4 M15 + 4 M16 reviews) remain open |

M18 offline AI literacy pilot is now coded. Online child social features remain unimplemented.

## M18 — AI & Digital Skills first code pilot (2026-11-23)

| Gate | Status |
|---|---|
| 4 original bilingual digital strands, 32 draft scenario checks | **CODED — STAGING ONLY** |
| No live AI model, data export or open chat | **IMPLEMENTED BY DESIGN** |
| 93 Node automated tests, isolated browser 32 M18 checks | **SOFTWARE PASS; NOT A REAL DEVICE** |
| Educator, Hindi and age suitability review for 32 M18 items | **32/32 PENDING** |
| Real Android, assistive tech, legal/privacy/Hostinger HTTPS | **PENDING** |
| Child-oriented public deployment | **NOT APPROVED** |

No digital practice result claims aptitude, grade or trustworthy fact-checking proficiency. All M17 and earlier gates remain open.

## M19 release-hardening gate — 2026-11-23

| Area | Engineering evidence | Human/real-world status |
|---|---|---|
| Strict self-only staging CSP | Configured in `.htaccess`; removed inline worksheet actions/style and 8 guide inline styles | **Actual Hostinger header responses NOT VERIFIED** |
| Noindex defense in depth | Every HTML page has noindex; `X-Robots-Tag` configured | **Not a substitute for access restriction** |
| Service worker asset integrity | M19 version, 41 cache paths and two new worksheet assets validated | Live upgrade/offline on real device **PENDING** |
| Deterministic staging preflight | **102 Node tests**, 23 HTML / 22 JS modules; offline checks pass | Staging deployment **NOT DONE** |
| Read-only live HTTPS verifier | Script exists and has mock-based tests | Requires operator-approved HTTPS URL and credentials/controls; **NOT RUN** |
| Qualified bilingual education review | Queue counting: **3,282 records, 3,282 pending** | **BLOCKS PUBLIC RELEASE** |
| Child protection, accessibility, hosting rollback | Checklist and explicit independent signoff gates recorded | **PENDING** |

`node tools/release-preflight.mjs --public` fails deliberately even if engineering tests pass. Only human authorization and actual evidence can change public status. No online social features were added.
## M20 reviewer operations — 2026-11-23

A deterministic offline CSV/JSON review packet exporter (source file + line and bilingual draft fields) is provided for qualified reviewers; it **never sets a review status to approved**. The six original queues remain unreviewed until real reviewers record item/version-specific evidence. This improves the worklist, **not** public launch readiness. Actual Hostinger HTTPS, low-end Android/assistive technology and child privacy/legal/safeguarding gates remain open. See [M20 procedure](docs/M20_REVIEW_OPERATIONS.md).

## M22 private staging audit coverage — 2026-11-23
The read-only `tools/check-live-staging.mjs --full` mode expands the 12-target core checker to source-declared static routes/assets and validates status, MIME and security headers using local allowlisted paths. Unit/mocked CI success is **not** proof of actual Hostinger deployment, access restriction, backup/restore, real-phone functionality, educator review or legal child safety. See [M22 operator guide](docs/M22_FULL_STAGING_AUDIT.md). Human release gates still block public indexing.

## M23 reviewer evidence (2026-11-23)
An offline template + source-hash validator helps qualified reviewers hand off 18 prioritized concept/classroom records (or 3,282 full-scope records). A structurally valid JSON report cannot establish reviewer identity, curriculum correctness, Hindi suitability, child-safety/legal approval or copyright rights. A new CI assertion explicitly expects `release-preflight.mjs --public` to fail. Actual Hostinger, real low-end Android accessibility, safeguarding and human reviews remain blocked. See [M23 documentation](docs/M23_REVIEW_EVIDENCE.md).

## M24 — Keyboard navigation and ZIP confidentiality (2026-11-23)
The static source now gives all 23 HTML pages one main landmark and valid skip link; a deterministic CI audit checks language, target IDs, duplicate IDs and static image alt. Two original teacher print worksheets gain main landmarks while teacher-only guidance remains hidden in print. Versioned M24 service-worker cache and M24 ZIP names support future private staging updates. Release packaging ignores local reviewer evidence and common secret files; an independent ZIP integrity/privacy check runs in CI.

**Not certified:** Static checks are not WCAG 2.2 AA or real TalkBack/VoiceOver/NVDA testing. Actual restricted Hostinger HTTPS upload, backup/rollback, educator/Hindi signoffs, safeguarding/legal review and school pilot remain **PENDING**. Public child-oriented launch remains **NOT APPROVED**. [M24 QA](M24_QA_STATUS.md).

## M25 — Native Chromium smoke CI (2026-11-23)
A separate Playwright/Chromium job now exercises real ES module imports on a temporary local HTTP server, Hindi UI, local history opt-in/clear, Skip keyboard focus, 390px overflow, print CSS and service-worker offline caching. Browser-local `localhost` is not the authorized Hostinger HTTPS server; no actual child, teacher, screen reader or physical printer is used. This is stronger automated engineering QA only. **Educator/Hindi approval for 3,282 records, legal/child safeguarding, restricted hosting, AT testing and pilot permissions remain independent manual release gates.** See [M25 QA](docs/M25_BROWSER_REGRESSION.md).

## M26 — Safeguarding human-operations evidence (2026-11-23)
The M26 local `safety-handoff/operations.json` template tracks six required human-led gates (safeguarding lead/deputy, incident tabletop drill, India-relevant child/privacy/legal review, shared-device/hosting log data-flow, ethical school/guardian permission and independent go/no-go). CI checks draft structure only, never actual signoff. Entries are **UNASSIGNED/PENDING** by default. Reviewer evidence is ignored by Git and excluded from distribution ZIPs; tests cannot authenticate humans or determine statutory compliance. **All other content, accessibility and live Hostinger gates remain blocked**; do not remove noindex. [M26 runbook](docs/M26_CHILD_SAFETY_OPERATIONS.md).

## M27 — Actual HTTPS staging file identity (2026-11-23)
After a **real authorized access-restricted** Hostinger staging upload, operators can execute `node tools/check-live-staging.mjs https://STAGING-ORIGIN --full --integrity` from the **exact** source revision used for the ZIP. M27 compares the SHA-256 of every served static response against local source, including robots.txt, and checks stricter headers. Seven source-only paths (including hidden .htaccess, review queues, release manifest and safety-evidence files) must respond only with inaccessible statuses; no body/secret is logged. CI proves only mock logic and local ZIP SHA-256 parity, **not the real server**. Never treat full integrity PASS as content, legal, safeguarding, real accessibility or child/public release approval. [M27 operator guide](docs/M27_STAGING_INTEGRITY.md).

## M28 — Shared-tab data erasure safeguard (2026-11-23)
A minimal same-origin BroadcastChannel notification (clear action only; no learning/identity data) now attempts to reset any already-open peer tabs in the same browser profile. A localStorage removal fallback covers compatible persisted opt-in cases. A privacy page and bilingual in-app warning state shared-device limitations. M28 versioned cache and archive prevent stale static JS after compliant upgrade. Chromium CI covers **two realistic dummy-data tab scenarios**; these tests cannot erase other devices, synced backups, inactive tabs guaranteed or host logs. **Real low-end Android/AT, legal/safeguarding, content and host release gates remain OPEN.** [M28 guide](docs/M28_SHARED_DEVICE_PRIVACY.md).
