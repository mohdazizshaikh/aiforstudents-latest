# AI for Students — M12-B + M13 consolidated private staging prototype

**Updated 23 November 2026.** Educational practice and exploration prototype for staging, **not** an expert-validated assessment, public child-ready service, or deployed Hostinger website.

## Implemented in the static build

- **40 playable solo game modules** across eight categories; four experimental age bands; 20 generated task records per game/band = **3,200 total task records**. Formats include choice, numbers, multiple selection, ordering, and unscored reflections. Not 40 separately illustrated engines or normed psychometric games.
- **M12-A:** Eight representative game banks redesigned. **M12-B:** 14 additional previously age-identical game banks rewritten, resulting in **zero wholly age-identical game banks** in the deterministic structural audit. **54 individual task positions still happen to be identical across all four bands in six other games.** Age difficulty is *not* scientifically calibrated.
- Age-specific word formation and synonym sets, composite mirror operations, longer classroom workflows, creative design constraints and responsible team/social reflection. 14 M12-B banks add **1,120 updated task records**, 8 M12-A banks contain **640** = **1,760 updated task records** across 22 modules. Every current item still requires independent educator/Hindi review.
- My Growth, Proud Today, Daily Growth plan and 3 same-device Grow Together cooperative modes preserved. There are **no** online invites, friends lists, chats, user accounts, remote AI calls or tracking SDKs.
- **M13 Future Explorer:** 12 original interest-led pathway cards, four age-scaffolded offline missions each, optional self-reported completion and Proud Today integration. It never ranks careers using game scores. External official resources are *ordinary links* to NCERT Career Cards, NCS and O*NET; no data is sent to those providers by the application.
- Six original static support pages: privacy, for-parents, methodology, accessibility, future-explorer, Hindi overview. Eight public game guides and Grow Together guide retained.
- Default `noindex,nofollow` on all pages. Conservative `.htaccess` staging headers; static service worker caches only public assets, not local progress.
- Optional progress history in sessionStorage; opt-in `localStorage` on the same browser, with clear-history control. Data is not synced, and locally stored data may be exposed on a shared device.

## QA commands (development machine only)

```sh
node --test tests/*.test.mjs
node tools/audit-content.mjs
node tools/export-review-queue.mjs
python3 tests/browser_m12b_m13.py
```

Node and static site output use no paid dependencies. Browser test uses developer-installed Python Playwright and Chromium and inlines modules to work around localhost restrictions in this environment. It is **not** real live HTTPS browser verification.

## Hostinger Business shared-hosting staging

Upload the separate Hostinger ZIP **contents**, not the source ZIP, to the `public_html` of a separate, backed-up, access-restricted staging website/subdomain. All files are static HTML, CSS, JS, SVG, text or manifest. No long-running Node server, PHP/MySQL, WebSockets, cloud inference, GPU or API secrets needed.

After selecting a verified HTTPS origin, run `node tools/configure-domain.mjs https://your-domain.example` on a **source copy**, and rebuild hosting files. This writes canonical URLs, a sitemap and a robots sitemap entry, but **retains `noindex,nofollow`** until explicit launch approval. Do not add reciprocal hreflang unless a true corresponding Hindi page is authored and validated. A Hindi introduction page is not automatically the equivalent of the full English interactive game page.

See `RELEASE_GATES.md`, `ONLINE_SOCIAL_FUTURE_SPEC.md`, `QA_STATUS.md`, `CONTENT_AUDIT.md`, `CONTENT_REVIEW_QUEUE.jsonl` and `M12A_REVIEW_CHECKLIST.md`.

## Honest boundaries

- Live Hostinger deployment, real-domain SEO/Search Console, real-device accessibility, expert educational review, child protection/legal approval, security review of any future server and user research are **not complete**.
- Content and interface tests do not establish test reliability, construct validity or fairness. No IQ, aptitude, personality or definitive career-future claims.
- Sharing invitations, safe child accounts and free-text messaging remain **disabled**; online social features cannot be marked complete without governance, guardian authorization/age safeguards and human incident response.
- SEO acquisition and educator revenue remain hypotheses, not implemented business outcomes.

## GitHub checkout and development

The complete runnable **M13 prototype source and test suite** lives in this repository. The 3,200-record human-review queue is archived as `docs/CONTENT_REVIEW_QUEUE.jsonl.gz` to avoid checking in a large generated JSONL file. To restore it on a development machine, run `gzip -dc docs/CONTENT_REVIEW_QUEUE.jsonl.gz > CONTENT_REVIEW_QUEUE.jsonl` on macOS/Linux, or use any gzip-compatible extraction tool. Alternatively, regenerate the review queue with `node tools/export-review-queue.mjs`.

Run tests with `npm test` (Node.js 22 recommended); check staging structure with `node tools/verify-static-release.mjs` and `node tools/audit-content.mjs`. The GitHub workflow in `.github/workflows/ci.yml` runs these checks on pushes and pull requests.

This repository is **a staging prototype only**. It is not live on Hostinger, has no authenticated multiplayer or cloud AI backend, and is not approved as a psychometric assessment or child-oriented public production service. Pages intentionally have staging `noindex` directives.
