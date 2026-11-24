# M88 — Bilingual teacher resource search (candidate)

**Correction:** Both initial M88 runs failed Node due to the M50 blanket input assertion; Chromium passed on push. Updated historical contract to permit exactly one bounded teacher title search input in the no-print controls; no learner response inputs or persistence permitted. Fresh CI pending.

M84 corrected Node/static and Chromium passed (runs 45490025623 and 45490042038), PR #74 merged at 22e4070bf420a0ab3e7a89c5670159f67fc2da82. M85–M87 Node/static passed, browser pending at branch creation.

Adds local title/key search over all 109 fixed draft activities in English and Hindi, independent of display language, intersected with existing subject scope and activity kind. NFKC normalization, case-insensitive token matching, 80-character bound, rejection of control/format characters; no inferred grade or pedagogical ranking. Empty query restores inventory; no matches disable selection/add; direct pack additions retain existing duplicate and six-item limits. Search text is not sent, stored, printed or inserted into output; teacher input is concept titles only, not learner details. Clear on leaving lab modes and shared-device reset. Language changes retain query and valid selection. No content/rights approval, no new canonical records.

Node and offline Chromium regression tests added; cache version updated. FP-087 remains in progress pending real rights and educational review. Exact-head CI pending; 70/100 scoped tasks unchanged.
