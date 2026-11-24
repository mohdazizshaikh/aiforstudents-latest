# M90 — Exact teacher activity launch coverage (candidate)

**Verified:** both CI runs 45494759065 and 45494740686 passed; PR #80 merged at 0536de31c4592c9428d1e208e3d8c4b69d095e41. No external approval.

M88 corrected and M89 Node/static passed; Chromium pending at branch creation. M90 implements one distinct source-bound demonstration route for each of 109 teacher resources: 12 foundational main models, 48 advanced main models and 49 supplemental activities. Main routes reuse existing fixed launcher paths. Supplemental routes select the exact model plus extension via validated query parameters; invalid or repeated selectors cannot choose a noncanonical activity. Mode changes and reset use the original defaults. Links use the current offline cache and remain internal to the site.

Teacher resource finder and selected assignment-pack activity each expose an explicit link, with bilingual title. Empty matches, mode exit and reset remove stale links; links are in no-print controls, not learner worksheets. Pack remains memory-only; navigating away does not preserve a pack. No search text or learner identifiers enter routes. No new source content, permission or grade approval. 109 named resource tests (both languages), one aggregate route/pack test, offline Chromium regression. Exact-head CI pending. FP-087 remains in progress; 70/100 scoped tasks unchanged.
