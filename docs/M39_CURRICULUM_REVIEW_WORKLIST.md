# M39 — curriculum review candidate worklist

M36 exact head bf677fdbab7a9ecdbebebca9a4af075c15ae3cff passed CI 45353238158 and merged in 567012d6a6b72275ba0e02432f0db60e071ade16; post-merge CI 45353847765 passed. M39 is a separate development candidate; no new task promoted to DONE_VERIFIED.

## Local workflow for reviewers

1. Generate the candidate worksheet: `node tools/curriculum-review-worklist.mjs --template curriculum-candidates.json`.
2. Review the 48 class/subject slots, their original draft topic labels, 44 model IDs and 46 canonical content-version/SHA-256 references. Related draft does not mean recommended grade placement. Empty model lists show gaps.
3. Independently inspect the relevant current official board publication, exact book/edition/chapter and outcome. Record only a proposed board mapping, public HTTPS chapter reference (no signed/private URL) and opaque rights evidence reference. Keep institution approval records in secure local storage.
4. Validate with `node tools/curriculum-review-worklist.mjs --check curriculum-candidates.json`. Structural validation catches stale model/content references, missing fields, duplicate slots and fabricated approval states. It does not verify the source URL, authenticate copyright permission, prove syllabus mapping or authorize school use.
5. Qualified subject, Hindi, safety and rights reviewers must independently review the existing per-content evidence worklist and reconcile discrepancies. Do not upload completed local candidate or reviewer evidence files into the public repository.

The CLI only accepts a simple JSON filename under ignored review-evidence/, writes exclusively (no overwrite), and never edits canonical teaching content, queues, status, or launch gates. All slots start UNMAPPED; the sole populated state is PROPOSED_UNVERIFIED. Gap slots may record proposed coverage needs but do not become covered models. The current 3,324 pending educational records and six safeguarding gates remain unchanged. FP-016–020 remain BLOCKED_EXTERNAL; zero authenticated chapter/edition or board approvals. No new model, route, learner information, remote requests, or textbook copies.

M40 integrated baseline 67eac4145b01517e870e2a526f9e6b0d01859393; M40 exact-head CI 45355061767 and 45355043302 passed. M39 original tests passed (45354212960), then worklist inventory and tests were reconciled against the new 36-model baseline. Combined-head CI required. No chapter approval.

M39 merged in 2574f2b47989cc47639f6bd3cd9e8f311d3a743c after CI 45376279051 passed. M41 extends the catalog to 44 interactive models and 46 canonical review records. Combined candidate requires exact-head CI. Historical M40 baseline remains valid as a checkpoint, not the current inventory.

M46 candidate expands to 52 models and 54 canonical linked review records across all 48 nonempty illustrative slots; 3,332 pending educational records. This is not comprehensive chapter coverage. Historical counts above describe the previous checkpoints.
