# M112 — Product engineering reset and optional backend foundation

**Change request CR-M112 — requested direction: stop repeated resource polishing; implement missing platform features and measure real engineering deliverables separately.** This is a proposed scope extension under B2_SCOPE_CHANGE_PROTOCOL.md, not a replacement for the original 100-task tracker. M33/M29 historical baselines, 70/100 verified legacy items, 25 externally blocked items, two review-pending, two code-complete-tested and one in progress remain unchanged. No public child release approved.

## Four separate tracking dimensions

- Engineering: [new product engineering register](PRODUCT_ENGINEERING_REGISTER.json), initially 40 explicitly scoped deliverables; five implemented awaiting exact-head CI, 35 planned. No assertion of whole-product percentage or 5 percentage-point closure.
- Educational content: existing curriculum progress and educational review worklists remain separate (3,340 canonical pending reviews, 180 mapping checks, zero verified chapters; additional teacher drafts require review, not covered by canonical counts).
- QA: per-feature acceptance criteria, exact-head Node/Chromium CI, separate physical device and performance evidence. No local-host equivalence to actual Hostinger.
- Independent approval: rights (327 criteria), safeguarding (six gates), actual named reviewers, host and school pilot. Keep noindex and blocked public preflight.

## Implemented engineering scope (candidate)

ENG-001: Node 22 built-in SQLite schema version 1, source-derived draft inventory, in-memory only, strict types and foreign key constraints.
ENG-002: bilingual fixed-activity catalog with validated subject/kind/language filters.
ENG-003: source-derived 96-cell curriculum planning read service; zero verified chapters, no inferred coverage.
ENG-004: atomic ordered synthetic rehearsal selection, maximum six fixed keys, no names, no persistence, no browser integration.
ENG-005: authenticated loopback-only HTTP JSON API, strict request bounds, Host/Origin rejection, no CORS, no-store, default-deny endpoints. No live AI, mastery or learner endpoints.

The actual site remains the original static Hostinger-compatible offline core. This optional Node developer service is not a production hosting decision and is not part of the deployable static ZIP. No student data, accounts, real classroom collection, remote AI, paid services or live deployment. Do not expose it outside loopback or proxy it to children. SQLite is transient, not a durable production database. Hostinger shared hosting compatibility for a future production service is not established. Future backend runtime, persistence and adult auth require separate decisions and approvals.

## Adult developer use

Node 22 with node:sqlite available. Run `node --test tests/m112-platform-backend.test.mjs`. To start manually, set a new random 64-character lowercase hexadecimal `AIFS_DEV_TOKEN` in your local shell (never commit or paste into a shared system), then `npm run pilot:backend`. Listen only on 127.0.0.1:8787. Use an adult operator's local HTTP client with Authorization: Bearer token. GET /v1/health, GET /v1/catalog?subject=maths&kind=all&lang=en, GET /v1/curriculum?board=CBSE&grade=6&subject=maths, GET/PUT/DELETE /v1/plan. PUT accepts exactly language and keys; values are synthetic fixed resource IDs only. Restart clears everything. No cross-browser integration.

Rollback: stop service and revert candidate source changes; no static learner assets, service worker, user data, review queue, legacy tracker or release approval changes. CI runs five named tests (including actual loopback HTTP). Exact-head CI not yet verified; this milestone is not merged. Next focus: missing Smart Lab concepts, unified learner/teacher dashboards, governed tutor, adaptive learning. Do not count individual worksheet questions as independent engineering deliverables.
