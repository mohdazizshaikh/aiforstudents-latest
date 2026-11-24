# M85 — Full canonical disabled-tutor boundary audit (candidate)

**Verified:** both CI runs 45490145654 and 45490124052 passed; PR #75 merged at 26dbf6c13d6cb452905e845ca5ca38b5d03c2897. No external approval.

M84 initial Node/static passed but Chromium 45489718453 found the workshop panel hidden; explicit activation fix d30bd6f has fresh CI pending. M85 extends the existing disabled tutor rehearsal from pilot records to all 3,340 canonical records, including both languages and three request shapes (exact source hash, deliberately changed hash, and unexpected history field). 20,040 structural denial scenarios plus existing 224 pilot regression cases. Rejects incomplete, duplicated, substituted or changed inventory; counts by queue, no content or responses in report. Namespaced canonical IDs that cannot fit the contract use deterministic test-only aliases; aliases never enter any approved source registry. The approved registry remains empty, no remote model, no provider, no actual child requests, no semantic accuracy or independent red-team signoff.

Run `npm run tutor:audit-corpus` locally. CI exercises the same fixed corpus; Node regression verifies count, ordering invariance, flags and invalid inputs. No approval or activation changes; no new canonical records. 70/100 scoped tasks unchanged. Public launch blocked. Exact-head CI pending.
