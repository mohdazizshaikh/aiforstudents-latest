# M35 — historical evidence trace and disabled source retrieval

M34 PR #23 merged at cfff6b2b2a36d55667581cfa4798ccca622235c4. Its exact head a45882614016e8b994462ee993c2640778f459e4 passed both push and pull-request CI; [PR CI](https://github.com/mohdazizshaikh/aiforstudents-latest/actions/runs/45350106713). Five design tasks FP-066/067/076/077/078 are now bounded engineering/design acceptance only. B1 46/50, B2 22/50. FP-086/088 code-tested but dependency FP-085 remains blocked; FP-089 review pending. FP-087/079 remain in progress. No 100% product or launch claim.

## FP-008 candidate — trace every verified task

The snapshot contains the source/test paths and exact Git blob IDs from the M34 tested commit for all 68 engineering tasks. The CI link is an actual completed run, not an invented signature. Source/test path associations come from the canonical register; this is not a fresh independent assessment of historical educational claims. Structural checks run with normal Node tests. A maintainer with the full repository history can run:

    node tools/verify-evidence-snapshot.mjs --require-git

This verifies every reference against the historical Git object and fails if history is absent or a blob differs. The ordinary structural test does not pretend to have checked historical Git objects. FP-008 stays IN_PROGRESS until exact-head CI and the history-aware verification are evidenced; adding FP-008 later requires extending the snapshot in a follow-up commit.

## FP-068 candidate — approved-source gate prototype

The maintainer-only tool accepts only a fixed source ID, SHA-256 version hash and supported language. It does not accept free text, URLs, caller approval flags or arbitrary metadata. Registry is empty/frozen because there are zero authenticated approved sources. All valid requests return unavailable; malformed inputs return invalid request. No remote AI, network, model, student UI integration, or source passage is shipped. Future content requires independently authenticated subject/Hindi/rights approval, revocation/version handling, reviewed passages and separate safety/legal/child gates. This code cannot make an approved source or certify reviewers.

FP-068 stays BLOCKED_EXTERNAL. Generative AI remains disabled. 3,304 educational records await review, publicReleaseApproved false.
