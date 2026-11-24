# M84 — Maths Workshop and Studio temporary snapshots (candidate)

**Verified:** corrected CI 45490025623 and 45490042038 passed; PR #74 merged at 22e4070bf420a0ab3e7a89c5670159f67fc2da82. No human approval.

**Regression correction:** Node/static passed but Chromium 45489718453 failed on the hidden Maths snapshot panel. Explicitly activate it on each workshop render; added static activation regression. Full browser rerun pending.

M81–M83 verified and merged: PRs #71–73, main c2173af6298c9bc3ffb964df120917b4a23747a3. M84 covers the remaining five of 60 main draft models: number line, rectangle, data table, fraction shading and circuit path. Shared bilingual native DOM panel supports explicit capture, restore and clear, up to three distinct valid states (only two possible circuit states). Values are source-derived, not physical observations. Studio snapshots only in Try; no attempt recording from capture/restore/clear. Existing explicit check behavior remains. Clear on model change, repeat, teacher launch and shared-device reset. No new personal data or storage. Offline precache updated.

Node tests exercise all five in both languages, invalid fields/ranges, duplicate/capacity, copy isolation and calculated outputs. Chromium tests capture, restore, keyboard, language, model reset, offline Studio and privacy. Exact-head CI pending. No canonical learning records added, no educational approvals or mastery claims. 70/100 scoped items unchanged.
