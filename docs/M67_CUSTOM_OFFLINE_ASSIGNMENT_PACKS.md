# M67 — Custom offline lab assignment packs (candidate)

Stacked on M66 88ee82e98b4d1f574248703251656a5e9ce86491; Node/static job passed, Chromium pending at branch creation. Implements a separate teacher print mode for choosing up to six unique activities from 48 advanced main models and six supplemental activities (54 source choices, 108 bilingual variants). No free text or learner data. In-memory ordered keys, duplicate/limit checks, explicit add/remove/up/down/clear, language preservation, reset on leaving pack mode, paper-only output and print isolation. No storage, network, answer keys or calculated results. Source prompts may themselves specify example values. Print CSS targets native printing, not physical A4 validation. Adds deterministic coverage and offline browser regression. Exact-head CI pending. FP-087 remains IN_PROGRESS: rights/educational review and FP-085 dependency outstanding. No new canonical content records; 70/100 scoped verified items, public release blocked.

## Baseline verification update

M66 passed both CI jobs 45462053139 and merged PR #56 at 1ceeb22b5e19243013dde0f44da3313aca812c03. M67 requires its own exact-head CI before merge.
