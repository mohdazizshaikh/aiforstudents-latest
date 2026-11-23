# M23 — Offline review-evidence template and structural validation

**Date:** 2026-11-23 · **Scope:** human review workflow support. It does **not** authenticate reviewers, establish real-world content correctness, approve publication, or deploy to Hostinger.

## Why this milestone exists
The M21 worklist identifies 3,282 items and fingerprints their reviewer-visible English/Hindi content, but does not define a local editable evidence object that links actual subject/Hindi assessments to a specific current source fingerprint. An offline, privacy-conscious handoff improves the qualified reviewers' work without introducing child accounts, an online approval portal, or paid APIs.

## New tools

```bash
# Requires Node.js 22+ and a clean source checkout
npm test
npm run review-packet
npm run review-evidence:template
npm run review-evidence:check
```

The last two commands respectively create and validate `review-evidence/pilot-first.json`. The directory is ignored by Git. The default scope selects **18 facilitator/concept review records**: 4 Studio, 4 Virtual Lab and 10 Classroom. This is a prioritization *for staff review*, not permission for children to access a private pilot. Use `node tools/review-evidence.mjs --template review-evidence/all.json --scope all` to prepare all 3,282 records. The exporter **refuses to overwrite an existing file** so hand-edited evidence isn't lost.

Run `node tools/review-evidence.mjs --check review-evidence/pilot-first.json` after entering decisions. A completed-looking record is only **structurally complete for independent human audit**, never proof the reviewer exists or is qualified. These tools accept no children’s names, no passwords, no external network data and write no source review-status flags.

## Reviewer record protocol
Each item is tied to `queue`, `content_id`, `content_version` and M21 `content_sha256`. Record subject and Hindi decisions separately (`pending`, `pass`, `revise`, `reject`) with **distinct, opaque internal reviewer references**, actual ISO calendar dates and a substantive rationale. Do not enter legal names, contact information or student records in this exported file.

Also capture curriculum mapping as `unverified`, `verified` (board/class, edition, chapter and full source URL) or `not-applicable` with an explanation; copyright as `pending`, `original-draft`, `permission-evidence` or `link-only`; and a `pending` / `assessed` safeguarding review.

A validator success establishes only that fields have valid structure, IDs exist and content hashes match the current source. It **cannot visit official sources, authenticate reviewer identities/qualifications, verify a license, decide whether an explanation is pedagogically correct, grant a copyright permission, or sign a legal review**. Those actions require accountable real humans and separately controlled evidence. Even all-green structure is **not public launch authorization**.

## Fail-closed behavior
- Invalid/stale item IDs, content versions and SHA-256 digests cause validation errors.
- Missing or duplicate expected rows, inconsistent reviewer identity references, malformed dates, missing rationale and unsafe invented `publicReleaseApproved` fields are rejected.
- `pending` entries are allowed in a **draft**. The validator reports zero evidence-ready items until independent review fields are supplied.
- Template generation refuses to overwrite an existing evidence file. Never commit reviewer evidence or authorization credentials.
- The script does not update the canonical 3,282 review queues, so `node tools/release-preflight.mjs --public` continues to fail.
- Do not interpret the current 18-item set as curricular alignment or a small public launch approval.

## Beyond engineering: remains open
- **3,282 human content records** require qualified bilingual educational decisions plus actual item-level corrections and versioned records. Game age-band repeats and Studio/Experiment science/math assumptions still need attention.
- Hostinger restricted HTTPS staging, low-end Android / TalkBack / VoiceOver, accessible offline testing, A4/projector use and school permission require real-world checks.
- Child safeguarding/legal, actual authorized operator ownership and ethical human pilot remain required.
- The public website keeps noindex; online child accounts/chat remain disabled.

**Links:** [M21 content review integrity](M21_REVIEW_INTEGRITY.md) · [Current backlog](IMPLEMENTATION_BACKLOG.md) · [Release gates](../RELEASE_GATES.md) · [Human review issue #3](https://github.com/mohdazizshaikh/aiforstudents-latest/issues/3).
