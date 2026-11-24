# M80 — Local curriculum review progress reconciliation (candidate)

**Verified:** CI runs 45486611507 and 45486600601 passed both jobs; PR #70 merged at 8aa9f6a2d5110d1c6a6c506790ca605f4b0e2ad5. No human approval.

M78 and M79 initially failed the M29 status-document prominence assertion. M78 local Chromium passed; M79 Chromium was pending at this checkpoint. Explicit M33/M29 historical baseline restored without modifying or weakening the tests. M79 branch incorporates corrected M78 ancestry and M80 progress tooling.

M80 reads up to three locally saved M78 review batches, validates their current inventory/fingerprints and rejects duplicate, missing-record, stale or approval-claiming submissions. Output reports counts only: missing batches/checks, submitted checks, pending vs decided checks, structurally ready mappings and revision counts. An unsubmitted batch is unknown, not reviewed. Structurally ready is not independently approved. No notes, reviewer refs, evidence refs, or learner data in the report.

- `npm run curriculum:progress -- --summary`: zero submissions, all 180 checks unsubmitted.
- `npm run curriculum:progress -- --summary cbse-001.json`: partial progress from a local file.
- `npm run curriculum:progress -- --require-all cbse-001.json cbse-002.json maharashtra-001.json`: require all three valid batches; pending decisions remain pending and exit success does not certify approval.

Files must be under ignored `review-evidence/`; inputs are never modified. CI exercises empty, partial and complete pending templates, and Node tests cover eight submission combinations, synthetic decisions, redaction and fail-closed cases. Exact-head CI pending. 32 proposals / 180 checks, 3,340 educational reviews, zero verified chapters and six human gates; 70/100 scoped tasks unchanged. No public launch approval.
