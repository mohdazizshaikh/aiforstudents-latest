# M53 — Adult-only classroom rehearsal checklist

Baseline 87b33fe97af760993ba088660c15c3b337388984; M50 exact-head CI 45446693214 passed and merged. This maintainer-only command prepares a fixed-choice synthetic adult rehearsal of the two existing prototype lessons, based on the M34 observer design. It does not authorize recruitment, observations of children, a school trial or collection of individual learner results. No new runtime route or storage.

Seven fixed checks cover lesson-version confirmation, device setup, instruction clarity, keyboard/paper alternatives, group reasoning, offline fallback and accessibility/safety concerns. A concern requires stop; other defects require revise/retest/stop. Even a fully filled rehearsal is not pilot evidence or authenticated approval.

Commands:
- node tools/pilot-observer-rehearsal.mjs --template rehearsal-fractions.json fractions
- node tools/pilot-observer-rehearsal.mjs --check rehearsal-fractions.json

Only local ignored review-evidence/ files, exclusive creation. No names, narrative, timestamps, ages, class sizes, school IDs, scores, images, audio, uploads or child observations. The actual independent school/guardian/ethics and safeguarding authorization workflow remains external. FP-089 remains REVIEW_PENDING and FP-090/080 remain BLOCKED_EXTERNAL. No new DONE_VERIFIED status; 70/100 scoped tasks, 3,340 pending educational records. Exact-head CI required.

Verified checkpoint: exact-head CI 45447537186 passed, merged PR #42 at 5325521774e89de2f84e141367488ece657060d5. Adult rehearsal only; no actual school trial or independent approval.
