# M59 — Physical validation handoff

Stacked on corrected M58 candidate 51804d983b98f2ec635da20d0788f465f7cc8b30. Twelve required physical scenarios cover low-end Android layout and offline behavior, TalkBack, VoiceOver, desktop keyboard/screen reader, reduced motion, two shared-device privacy cases, classroom projector and two A4 print cases. This is a local evidence worksheet, not an actual device test or accessibility certification.

Run `node tools/physical-validation-handoff.mjs --template physical-checks.json <exact-source-commit>` then `node tools/physical-validation-handoff.mjs --check physical-checks.json <same-commit>`. All 12 scenarios initially pending. Record opaque operator/device/evidence references only; fail/blocked requires a defect reference. Do not record serial numbers, names, photos of children, passwords, or private URLs. Keep actual evidence in controlled institutional storage. The supplied commit is a structural binding only, not authenticated Git checkout or proof of operator identity. A completed worksheet is ready for independent audit, not approval. FP-030 and FP-096 remain BLOCKED_EXTERNAL. No actual equipment or staging access. 70/100 scoped tasks and 3,340 pending reviews unchanged. Exact-head CI required.

Verified CI 45455083010 passed and merged PR #48 at 64e28e3f3f57503ea88ab11ed80a03730a50f9c1. No physical evidence authenticated.
