# M26 — Child safeguarding, privacy and incident-response operational handoff

**Drafted:** 2026-11-23 · **Status:** Engineering guidance and *unverified* human-operations checklist. **Not a legal opinion, actual appointed staff, consent process, incident hotline, or launch authorization.**

## Non-negotiable platform boundary

The private-stage AI for Students prototype delivers original draft educational games and simulations as static HTML/CSS/JS, without learner accounts, student chat, uploads, live AI APIs, advertising, persistent identity or public leaderboards. Optional practice history remains on the active browser; opt-in storage on a shared device can still expose history to someone else. Hostinger may collect security/access logs after actual deployment; neither local code nor CI can verify the provider's settings.

**Do not publish for children, invite schools or remove noindex.** The current source preflight deliberately blocks public release. The six human operational gates below are in addition to **3,282 subject/Hindi reviews**, genuine private HTTPS deployment, real assistive-technology checks and exact curriculum validation.

## Required human ownership and evidence

All owner fields currently are **UNASSIGNED**. Assign a real safeguarding lead and independent deputy, privacy/legal reviewer, hosting/incident operator, school pilot lead and decision-maker **outside the public GitHub repo**. Use only opaque internal role references in handoff JSON.

| Gate | Human evidence needed | Current state |
|---|---|---|
| accountable-safeguarding | Named lead/deputy in restricted company register, escalation cover and handoff acknowledgement | Pending |
| incident-response-drill | Supervised table-top drill: triage, who acts, containment/restore, records, communications and closure | Pending |
| india-privacy-legal | Qualified India-relevant counsel/privacy review of minors, consent, hosting, links, shared devices, data retention and any required notices | Pending |
| shared-device-data-flow | Actual staging server/browser evidence of local session/opt-in data, clear-all limits, browser cache, host logs and remote links | Pending |
| school-pilot-permissions | School authorization, age-appropriate guardian/teacher protocols, safe teacher escalation and voluntary accessibility alternatives | Pending |
| independent-go-no-go | Accountable independent human review of every unresolved gate, documented hold/go decision and review date | Pending |

No regulatory deadlines are invented here. Real counsel determines any applicable reporting deadlines, guardian permissions, handling of children's personal information, and external notification requirements.

## If a concern is reported — adult-run draft process

1. **Protect and contain first.** A responsible safeguarding adult assesses immediate risk to a child, follows the school's established safeguarding/emergency pathway and contacts appropriate local emergency/protection services where necessary. Do not request children's personal details through ChatGPT/GitHub comments, or through the prototype site.
2. **Record only safe, minimum metadata** in restricted incident tools: reference number, time, issue category, operator, scope, status and access-controlled evidence pointer. Never paste names, addresses, medical details, screenshots of minors or login credentials into this repository or CI reports.
3. **Triage severity by impact, not conjecture.** Immediate threat/active exposure = urgent containment and adult escalation; suspected personal-data exposure or unsafe instruction = suspend affected private pilot and legal/privacy review; cosmetic or non-sensitive defect = normal engineering queue. Actual human owners define response coverage and timelines before a pilot.
4. **Contain technical damage.** For a staging incident, disable child/user access to the affected area, keep noindex and independent access restriction, remove unsafe content, check who can access stored logs, and use verified backups/rollback if needed. Do not purge evidence indiscriminately; preserve only what authorized professionals need under their approved retention/handling policy.
5. **Verify the fix.** Re-run approved content/translation and technical checks on the **actual** staging server and actual devices, including cached copies and service-worker updates. A new build alone may not update every offline device. Contact schools/guardians/authorities only through approved accountable channels when required.
6. **Close only after human signoff.** Document decisions, unresolved harms, independent review, permitted communication, and a prevention action. Never change the release gate based solely on machine-validated JSON.

### Illustrative tabletop drill (no child personal data)
A teacher reports that a shared classroom device still displays a previous practice reflection after another learner starts. Simulate the escalation using *dummy records only*: teacher stops the demonstration, adult operator checks opt-in state and **Clear local history**, evaluates device/browser backups and cached content, informs the privacy lead, and records a restricted corrective plan. A successful dry run is not live evidence until real staff execute and acknowledge it.

## Local-only evidence scaffolding

```bash
# Node.js 22+, clean authorized source checkout
npm run safety-handoff:template
npm run safety-handoff:check
npm test
node tools/release-preflight.mjs --public   # must remain blocked
```

The default file `safety-handoff/operations.json` is **ignored by Git**, excluded from both source and Hostinger ZIPs, and **not uploaded as a CI artifact**. The generator refuses to overwrite any existing file. The validator checks that all six IDs exist, statuses are `pending` or `evidence-attached`, evidence fields use opaque refs and plausible dates, no duplicate/missing gates or invented release-approval flags occur. A valid draft may have all six gates pending; it must never be shown as permission to deploy. Even six complete-looking records remain **unauthenticated claims requiring independent human review**.

Do not insert actual names, student reports, legal opinion contents or credentials into this file; store original professional evidence under approved access controls.

## Independent acceptance — all remain open

- [ ] Actual safeguarding lead/deputy and incident operator appointed and trained; tested escalation contact and coverage.
- [ ] Real India-relevant child/privacy/legal assessment and documented remediation.
- [ ] Real restricted Hostinger staging data-flow, log-retention, shared-device reset/rollback and external-resource assessment.
- [ ] Written ethically approved school-pilot/guardian/teacher protocol as counsel/schools require.
- [ ] Human release authority completes a signed, independently verified **go/no-go** decision; all other mandatory release blockers addressed.

Related: [Issue #4](https://github.com/mohdazizshaikh/aiforstudents-latest/issues/4), [release gates](../RELEASE_GATES.md), [privacy disclosure](../privacy/), [M23 educational evidence](M23_REVIEW_EVIDENCE.md), [M25 Chromium QA](M25_BROWSER_REGRESSION.md).

**Verdict:** M26 improves operator preparedness, not legal compliance certification or public launch. **Child-oriented public release remains NOT APPROVED.**

## GitHub engineering evidence — 2026-11-23
- [PR #12](https://github.com/mohdazizshaikh/aiforstudents-latest/pull/12) merged to main at `9fb143b06402efdddaeac05842a89d76fc60bd07`.
- [M26 branch CI](https://github.com/mohdazizshaikh/aiforstudents-latest/actions/runs/45201028124) passed 131 Node tests plus separate local Chromium browser and archive privacy checks.
- All six operator/safeguarding gates **remain pending actual human evidence and identity verification**; source template/tests are not signoffs. Public site remains blocked.
