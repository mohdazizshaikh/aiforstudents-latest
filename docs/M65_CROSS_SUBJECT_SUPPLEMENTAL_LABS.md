# M65 — Four-subject supplemental lab activities (candidate)

Base: corrected M64 commit 609aa2f4ac37482caaf650bb9b2f9f7a0f125ffa; Node/static job passed, Chromium not yet confirmed when this branch was created. M65 reuses the existing M63 supplemental controls and preserves the ratio API.

- Mathematics: signed integer slope/intercept and function substitution (539 states per language).
- Physics: signed net opposing forces, including equal forces and direction (81).
- Chemistry: symbolic missing mass, including impossible proposed outputs (468).
- Biology: compare two ideal doubling rounds, including zero rounds and negative difference (144).

Total 1,232 bounded states per language, 2,464 bilingual test cases. Browser regression covers keyboard controls, reset, switching and shared-device clearing. No learner records, AI inference, actual experiment guidance, new chapter mapping or mastery score. Four existing review records change because their model definitions now include supplements; regenerate and re-review affected evidence. No new canonical record counted. 60 top-level draft labs plus six supplements, 3,340 pending reviews, 70/100 scoped items unchanged. Public release remains blocked. Exact-head CI pending.

## Baseline verification update

M64 subsequently passed full CI 45460668549 and merged PR #54 at 744a6a2a322b43ee0c38b1c9ca2c81d0fe2a1a32. M65 remains a candidate; its own exact-head results are required.
