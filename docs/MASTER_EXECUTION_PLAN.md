# M29 — 100-work-item master execution plan (2 × 50)

**M35 verified / M36 candidate — 2026-11-24: B1 46/50, B2 24/50.** FP-008 immutable Git-reference verification and FP-079 bounded browser retention/deletion audit passed exact-head CI. Physical-device and independent approval gates are unchanged; M36 curriculum discovery remains draft, not chapter verification.

**M34 verified / M35 candidate — 2026-11-24: B1 46/50, B2 22/50.** Five bounded design contracts verified by exact-head M34 CI; FP-086/088 code tested but FP-085 dependency not fulfilled. FP-089 template awaiting review. FP-008 trace and FP-068 retrieval remain incomplete; full product and public release blocked.

**M33 checkpoint, 2026-11-24: B1 46/50 scoped engineering/design tasks; B2 17/50 scoped engineering/design tasks.** Twelve additional unreviewed Maths/Science conceptual models, offline coverage for all 24 static routes and explicit shared-device reset fixes. FP-036 awaits educator review; all 3,304 educational records require qualified human decisions. **FULL PRODUCT NOT COMPLETE; PUBLIC CHILD LAUNCH BLOCKED.** Previous M32 46/50 and 2/50 values are historical. Engineering tests are not educational, legal, accessibility-device or live-host approvals.

## Fast batch execution rules

- **B1 (50 tasks):** first five entries in each of ten workstreams. Lock scope, reusable foundations, representative safe labs and initial QA. **Current completion: 46/50**.
- **B2 (50 tasks):** last five entries in each workstream. Broader Maths/Physics/Chemistry/Biology, governed AI/adaptive features, teacher depth, source and field reviews. **Current completion: 24/50**.
- **Efficiency:** plan/triage each 50-task batch in one coordinated work cycle instead of requesting tiny steps. Run independent streams concurrently, use small coherent feature PRs rather than one unreviewable giant merge, run tests at each ~10–15-task checkpoint and consolidate progress into a single verified batch report.
- **Non-negotiable:** a human review, real school trial, live Hostinger verification or legal approval remains **BLOCKED_EXTERNAL** unless a real authorized reviewer/operator supplies evidence. A successful Node/Chromium test or a prepared template is not that evidence.
- **Completion status:** NOT_STARTED → IN_PROGRESS → CODE_COMPLETE_TESTED → REVIEW_PENDING → DONE_VERIFIED; BLOCKED_EXTERNAL when dependencies cannot be fulfilled. Code output needs commit, tests, screenshot/QA where appropriate; real-world gates require actual human/field proof.
- **100 tasks are a delivery register, not an assertion that two batches will finish every Class 1–12 chapter and every state board.** Full chapter/edition-by-chapter coverage requires later enumerated content records and review, not invented percentages.

**GitHub execution tickets:** [Batch B1 — 46 of 50 engineering tasks evidenced](https://github.com/mohdazizshaikh/aiforstudents-latest/issues/16) · [Batch B2 — 24 of 50 scoped engineering tasks evidenced](https://github.com/mohdazizshaikh/aiforstudents-latest/issues/17). These are two coordination issues, not 100 separate noisy issues; task detail and evidence stay in this tracked register.

## Work breakdown — 10 streams × 10 items

### 1. Product governance — GOV

**Role:** Product/Quality (person unassigned).

| ID | Batch | Task | Acceptance evidence | Status |
|---|---|---|---|---|
| FP-001 | B1 | Publish truthful prototype baseline | Explicitly list implemented versus absent features | DONE_VERIFIED |
| FP-002 | B1 | Define completion status vocabulary | Distinguish code/tests from subject, device and launch approval | DONE_VERIFIED |
| FP-003 | B1 | Freeze comprehensive end-state scope | List classes, subjects, labs, AI, adaptive and teacher functions | DONE_VERIFIED |
| FP-004 | B1 | Map GitHub release-gate dependencies | Link P0 issues #2–#5 and P1 #6 without closing them | DONE_VERIFIED |
| FP-005 | B1 | Record 100-work plan acceptance rules | No claimed completion without task-specific evidence | DONE_VERIFIED |
| FP-006 | B2 | Build CI plan consistency checker | Assert 100 IDs, 2 × 50 and valid state transitions | DONE_VERIFIED |
| FP-007 | B2 | Create role/owner ledger | Real accountable owners confirmed privately; TBD is not approval | BLOCKED_EXTERNAL |
| FP-008 | B2 | Create source/test/evidence traceability | Each completed item links commit and relevant proof | DONE_VERIFIED |
| FP-009 | B2 | Create controlled scope-change protocol | No silent product-complete or release language | DONE_VERIFIED |
| FP-010 | B2 | Conduct independent batch completion review | Human signoff separate from engineering checklist | BLOCKED_EXTERNAL |

### 2. Curriculum and licensing — CUR

**Role:** Curriculum/Teachers (person unassigned).

| ID | Batch | Task | Acceptance evidence | Status |
|---|---|---|---|---|
| FP-011 | B1 | Inventory NCERT/DIKSHA/board source options | Source links and edition fields, no copied licensed materials | DONE_VERIFIED |
| FP-012 | B1 | Create chapter/grade/board metadata model | Grade distinct from age band and source edition | DONE_VERIFIED |
| FP-013 | B1 | Define educational and Hindi review rubric | Accuracy, language, safety, age and accessibility criteria | BLOCKED_EXTERNAL |
| FP-014 | B1 | Design third-party copyright/provenance registry | Every reused asset has permission and attribution evidence | DONE_VERIFIED |
| FP-015 | B1 | Draft provisional Grade 1–2 concept map | Topic coverage clearly labelled draft until verified | DONE_VERIFIED |
| FP-016 | B2 | Verify Grade 3–5 chapter map | Source editions and reviewer evidence recorded | BLOCKED_EXTERNAL |
| FP-017 | B2 | Verify Grade 6–8 chapter map | Chapter/outcome references checked by educator | BLOCKED_EXTERNAL |
| FP-018 | B2 | Verify Grade 9–10 chapter map | Board and edition-specific source references checked | BLOCKED_EXTERNAL |
| FP-019 | B2 | Verify Grade 11–12 chapter map | Stream, chapter, prerequisite and reviewer recorded | BLOCKED_EXTERNAL |
| FP-020 | B2 | Authorize selected curriculum pilot slice | Only exact approved chapters labelled reviewed | BLOCKED_EXTERNAL |

### 3. Student app/offline/accessibility — UX

**Role:** Frontend/A11y (person unassigned).

| ID | Batch | Task | Acceptance evidence | Status |
|---|---|---|---|---|
| FP-021 | B1 | Plan new Maths/Science/Teacher navigation | All routes discoverable at mobile widths | DONE_VERIFIED |
| FP-022 | B1 | Build reusable five-step lesson shell | Learn/Try/Play/Understand/Grow with truthful retry | DONE_VERIFIED |
| FP-023 | B1 | Unify Hindi/English content validation | Missing translations fail tests | DONE_VERIFIED |
| FP-024 | B1 | Define focus/labels/live feedback contract | Keyboard and screen-reader paths testable | DONE_VERIFIED |
| FP-025 | B1 | Set low-end bandwidth/performance budgets | Asset and cold-start limits enforced in CI | DONE_VERIFIED |
| FP-026 | B2 | Audit all new offline/PWA paths | No broken modules when disconnected after caching | DONE_VERIFIED |
| FP-027 | B2 | Audit multi-tab shared-device reset | No stale opt-in/session history in supported browser tests | DONE_VERIFIED |
| FP-028 | B2 | Add non-drag alternative to every lab | Buttons/keyboard/numeric text equivalent | DONE_VERIFIED |
| FP-029 | B2 | Create accessible print/low-ink export | A4 layout hides teacher-only notes and private data | DONE_VERIFIED |
| FP-030 | B2 | Run physical accessibility usability checks | Actual Android, TalkBack/VoiceOver, zoom evidence | BLOCKED_EXTERNAL |

### 4. Interactive Maths Lab — MATH

**Role:** Maths/Engineering (person unassigned).

| ID | Batch | Task | Acceptance evidence | Status |
|---|---|---|---|---|
| FP-031 | B1 | Map Grade 1–12 maths learning outcomes | Explicit topic coverage matrix and gaps | DONE_VERIFIED |
| FP-032 | B1 | Migrate fractions to reusable lab framework | Correct equivalence and accessible input tests | DONE_VERIFIED |
| FP-033 | B1 | Build place-value and number-line manipulator | Deterministic arithmetic and audio-free text state | DONE_VERIFIED |
| FP-034 | B1 | Build geometry/measurement manipulator | Units, area/perimeter and keyboard controls tested | DONE_VERIFIED |
| FP-035 | B1 | Build accessible charts/data interpretation lab | Equivalent data table and verified answers | DONE_VERIFIED |
| FP-036 | B2 | Build ratios and algebra lab | Correct step explanations with educator review | REVIEW_PENDING |
| FP-037 | B2 | Build symmetry and transformation lab | Rotation/reflection/translation deterministic cases | DONE_VERIFIED |
| FP-038 | B2 | Build coordinate/graph lab | Axis signs and functions numerically verified | DONE_VERIFIED |
| FP-039 | B2 | Build probability/statistics experiment lab | Transparent seeds, sample sizes and caveats | DONE_VERIFIED |
| FP-040 | B2 | Obtain independent Maths/Hindi pilot approval | Reviewed exact lessons; no fake complete syllabus | BLOCKED_EXTERNAL |

### 5. Physics/general science lab — PHYS

**Role:** Physics/Engineering (person unassigned).

| ID | Batch | Task | Acceptance evidence | Status |
|---|---|---|---|---|
| FP-041 | B1 | Map safe grade-wise Physics concepts | Distinguish conceptual model from real equipment | DONE_VERIFIED |
| FP-042 | B1 | Validate existing series-switch simulation | Correct circuit truth table and mains safety caveat | DONE_VERIFIED |
| FP-043 | B1 | Build forces/motion interactive model | Units, edge cases and accessible numerical text | DONE_VERIFIED |
| FP-044 | B1 | Build light/reflection model | Angle relationships mathematically checked | DONE_VERIFIED |
| FP-045 | B1 | Build energy transfer model | No unsupported energy/efficiency claims | DONE_VERIFIED |
| FP-046 | B2 | Build heat/temperature model | Scientific distinction and safe non-hardware activities | DONE_VERIFIED |
| FP-047 | B2 | Build sound/wave interactive model | Frequency/amplitude accessible without audio | DONE_VERIFIED |
| FP-048 | B2 | Build magnetism qualitative model | Clear limitations and safe material instructions | DONE_VERIFIED |
| FP-049 | B2 | Build measurement/data-table practice | Local-only measurements and unit checks | DONE_VERIFIED |
| FP-050 | B2 | Obtain subject and classroom safety review | Qualified educators approve exact examples | BLOCKED_EXTERNAL |

### 6. Chemistry/Biology/environment lab — BIOCHEM

**Role:** Science/Safety (person unassigned).

| ID | Batch | Task | Acceptance evidence | Status |
|---|---|---|---|---|
| FP-051 | B1 | Define safe chemistry/bio exclusions | No unsafe hands-on reactions or medical inference | DONE_VERIFIED |
| FP-052 | B1 | Build states-of-matter particle model | Correct labelled transitions and simplification caveats | DONE_VERIFIED |
| FP-053 | B1 | Build physical/chemical change sorter | Correct explanations with draft-review flags | DONE_VERIFIED |
| FP-054 | B1 | Build cell structure interactive explorer | Text alternative and differentiated cell types | DONE_VERIFIED |
| FP-055 | B1 | Build life-cycle/food-chain model | Scientifically correct ordered relationships | DONE_VERIFIED |
| FP-056 | B2 | Build periodic-table pattern explorer | Verified atomic number/group data sources | DONE_VERIFIED |
| FP-057 | B2 | Build symbolic mass-conservation model | No dangerous recipes; balanced example tests | DONE_VERIFIED |
| FP-058 | B2 | Build ecosystem interactions model | Food web and uncertainty clearly communicated | DONE_VERIFIED |
| FP-059 | B2 | Build heredity/variation explainer | No genetic essentialism or health profiling | DONE_VERIFIED |
| FP-060 | B2 | Obtain independent science/Hindi safety approval | Reviewed exact lessons before student publication | BLOCKED_EXTERNAL |

### 7. AI tutor and safety — TUTOR

**Role:** AI/Safety (person unassigned).

| ID | Batch | Task | Acceptance evidence | Status |
|---|---|---|---|---|
| FP-061 | B1 | Decide zero-paid-API tutoring architecture | Core learning stays free and usable offline | DONE_VERIFIED |
| FP-062 | B1 | Specify reviewed-content hint contract | No general unmoderated child chatbot | BLOCKED_EXTERNAL |
| FP-063 | B1 | Build deterministic local hint prototype | Correct source-backed explanations and safe fallback | DONE_VERIFIED |
| FP-064 | B1 | Add attribution and uncertainty display | Unknown answer not fabricated | DONE_VERIFIED |
| FP-065 | B1 | Define refusal/sensitive disclosure policy | Unsafe prompts lead to age-appropriate adult guidance | DONE_VERIFIED |
| FP-066 | B2 | Document optional generative tutor risk design | Feature OFF until real safeguards and cost approval | DONE_VERIFIED |
| FP-067 | B2 | Model privacy, latency and AI inference budget | No undisclosed paid dependency | DONE_VERIFIED |
| FP-068 | B2 | Prototype approved-source retrieval flow | No unauthorized copyrighted content or unsourced replies | BLOCKED_EXTERNAL |
| FP-069 | B2 | Conduct adversarial bias/hallucination review | Independent human evaluation and red-team defects | BLOCKED_EXTERNAL |
| FP-070 | B2 | Approve or reject AI tutor public use | Real safety/legal/education gate; no auto-enable | BLOCKED_EXTERNAL |

### 8. Adaptive practice and progress — ADAPT

**Role:** LearningScience/Privacy (person unassigned).

| ID | Batch | Task | Acceptance evidence | Status |
|---|---|---|---|---|
| FP-071 | B1 | Design minimal on-device learning event schema | No child identity or cloud tracking by default | DONE_VERIFIED |
| FP-072 | B1 | Prevent unsupported mastery claims | Recommendations described as practice, not intelligence | DONE_VERIFIED |
| FP-073 | B1 | Design optional spaced-practice schedule | No pressure streak or penalty | DONE_VERIFIED |
| FP-074 | B1 | Create explainable next-task suggestions | Learner can see reason and decline | DONE_VERIFIED |
| FP-075 | B1 | Add explicit difficulty and language override | No inferred fixed aptitude label | DONE_VERIFIED |
| FP-076 | B2 | Write adaptive mastery calibration protocol | Evidence thresholds documented; not yet validated | DONE_VERIFIED |
| FP-077 | B2 | Specify anonymous aggregate classroom view | No individual minor scores or rosters | DONE_VERIFIED |
| FP-078 | B2 | Define safe shared-device session boundaries | Cannot identify children solely through a browser | DONE_VERIFIED |
| FP-079 | B2 | Audit opt-in data retention and deletion | Local/session, background tabs and print paths tested | DONE_VERIFIED |
| FP-080 | B2 | Run ethical learning-outcome validation | Consented study and independent evidence required | BLOCKED_EXTERNAL |

### 9. Teacher planning and classrooms — TEACH

**Role:** Teachers/Engineering (person unassigned).

| ID | Batch | Task | Acceptance evidence | Status |
|---|---|---|---|---|
| FP-081 | B1 | Define no-roster teacher dashboard MVP | Local lesson-planning only; no student surveillance | DONE_VERIFIED |
| FP-082 | B1 | Enhance projector/teacher navigation | Large controls, focus, Hindi and mobile support | DONE_VERIFIED |
| FP-083 | B1 | Improve anonymous collaborative role rotation | Same-device group activity without child names | DONE_VERIFIED |
| FP-084 | B1 | Build reusable teacher answer/worksheet cards | Printable answers hidden from learner sheets | DONE_VERIFIED |
| FP-085 | B1 | Review existing fraction/circuit teacher plans | 2 baseline prototypes remain unapproved until reviewed | BLOCKED_EXTERNAL |
| FP-086 | B2 | Build local teacher lesson organizer | Select/queue/reset without cloud accounts | CODE_COMPLETE_TESTED |
| FP-087 | B2 | Create licensed offline assignment packs | No tracking links or identifiable learner export | IN_PROGRESS |
| FP-088 | B2 | Implement no-internet projector handoff | Teacher plan works in a disconnected classroom | CODE_COMPLETE_TESTED |
| FP-089 | B2 | Prepare ethical observer feedback template | Minimal permitted evidence and child-safe protocol | REVIEW_PENDING |
| FP-090 | B2 | Complete authorized supervised classroom pilot | School/guardian permissions and real observation | BLOCKED_EXTERNAL |

### 10. Quality/release and human gates — VERIFY

**Role:** QA/Ops/Safeguarding (person unassigned).

| ID | Batch | Task | Acceptance evidence | Status |
|---|---|---|---|---|
| FP-091 | B1 | Publish Node/Chromium acceptance matrix | All core/offline/privacy paths trace to tests | DONE_VERIFIED |
| FP-092 | B1 | Build subject-correctness regression fixtures | Expert-approved expected answers, equations, explanations | BLOCKED_EXTERNAL |
| FP-093 | B1 | Automate keyboard and non-visual flow sampling | Representative Hindi/English and touch-free checks | DONE_VERIFIED |
| FP-094 | B1 | Keep static staging ZIP privacy/integrity gates | Noindex, CSP, SHA-256 and source-path exclusions | DONE_VERIFIED |
| FP-095 | B1 | Create truthful evidence status dashboard | No mock result counts as human or live hosting | DONE_VERIFIED |
| FP-096 | B2 | Perform physical Android/AT/A4 testing | Real device evidence with logged failures | BLOCKED_EXTERNAL |
| FP-097 | B2 | Deploy real restricted HTTPS Hostinger staging | Authorized HTTPS/access/backup/rollback verification | BLOCKED_EXTERNAL |
| FP-098 | B2 | Complete 3,282 existing content record reviews | Real qualified subject/Hindi decisions recorded | BLOCKED_EXTERNAL |
| FP-099 | B2 | Complete six human safeguarding operational gates | Owners, privacy/legal, incident drill and permissions | BLOCKED_EXTERNAL |
| FP-100 | B2 | Independent school/launch go-no-go decision | Public remains noindex until all external gates satisfied | BLOCKED_EXTERNAL |


## Current actual baseline (not counted toward 100 new tasks)

Existing: 40 games in 8 categories; 3 local cooperative games; Study Lab 32 draft checks; Smart Studio two pilot journeys (fractions and conceptual circuit); Virtual Lab two simulations; Teacher Kit two unreviewed plans and two worksheets; AI & Digital Skills 32 draft deterministic scenarios; M28 offline, local privacy and CI. **NOT implemented:** comprehensive Class 1–12 syllabus, complete Physics/Chemistry/Biology/Maths labs, open AI tutor, validated adaptive mastery, complete school dashboard or completed real classroom study.

Pending evidence: **3,282 educational content records**, six human safety-operation gates, real restricted HTTPS Hostinger staging, independent real-device/assistive technology audit, verified curricular edition/grade mapping, and authorized teacher pilot. See [full scope / Definition of Done](FULL_PRODUCT_SCOPE_AND_DONE.md), [JSON register](MASTER_100_WORK_ITEMS.json), [release gates](../RELEASE_GATES.md).

**Release approval is independent of batch coding:** All 100 tasks cannot simply be auto-marked DONE by an AI assistant; named qualified humans and authorized institutions must complete their own evidence.

### M30 B1 execution checkpoint (2026-11-24)

**25/50 engineering/design items verified** (source files + tests named in JSON evidence), including five M29 governance foundations, new 3-mode local Maths Workshop and 3 new pending draft content records; exact status from [`B1_PROGRESS_DASHBOARD.md`](B1_PROGRESS_DASHBOARD.md). **3 selected HUMAN_GATE items remain BLOCKED_EXTERNAL** (qualified bilingual review rubric, reviewed-content tutor contract and teacher lesson approval). Other B1/B2 items remain planned. Software/automated tests are not a substitute for actual subject/Hindi approval or physical Hostinger/school deployment.

### M31 Science Concept Lab checkpoint (2026-11-24)

B1 now **35/50 DONE_VERIFIED in strictly scoped engineering/design evidence**, including seven new conceptual Physics/Chemistry/Biology demos, one reusable five-stage lesson UI, cross-module Hindi/English presence validator and keyboard/nonvisual browser sampling. **Four B1 external/human tasks remain BLOCKED_EXTERNAL**, including expert-reviewed scientific answer fixtures. The new seven concepts bring the pending educational review inventory from 3,285 to **3,292**. See [B1 dashboard](B1_PROGRESS_DASHBOARD.md) and [M31 QA](M31_SCIENCE_LABS.md). Completion of Class 1–12 Science, validated AI tutor, teacher dashboard or child-facing launch is explicitly **NOT CLAIMED**.

### M32 B1 checkpoint (2026-11-24)

**46/50 B1 scoped engineering/design task outputs verified**, with exactly four external real-human dependencies **BLOCKED_EXTERNAL (not done)**. One fraction five-stage shell reuses existing original Studio content; new local hint UI offers only original **UNREVIEWED** source-backed hints, never general AI chat or validated teaching. Optional paper review dates, learner-declinable next-practice suggestions, difficulty/language overrides and new A4 learner-only teacher cards cannot infer ability, persist child identity or imply subject approvals. B2 remains 0/50 at this checkpoint. Pending qualified educational reviews still **3,292**. [M32 QA](M32_PRACTICE_TEACHER_QA.md) and [B1 dashboard](B1_PROGRESS_DASHBOARD.md).

### M32 B2 governance increment (2026-11-24)

**2/50 B2 engineering governance items verified:** CI consistency checks (FP-006) and a documented change protocol (FP-009). FP-007 is **BLOCKED_EXTERNAL** until actual accountable role assignments; a placeholder ledger is NOT sufficient. FP-008 remains **IN_PROGRESS** until every verified item has a concrete commit-to-source/test provenance link. Governance templates and code are never substitute human approvals.

### M33 expanded labs and offline checkpoint (2026-11-24)

Fifteen newly source/test-backed B2 engineering task scopes: 11 deterministic lab functions (FP-036 ratio/algebra is separate REVIEW_PENDING), explicit offline/keyboard/print and multi-tab privacy verification. Current B2 **17/50**, four B1 real-human gates remain blocked; B2 external gates marked BLOCKED_EXTERNAL until real evidence. **3,304 pending educational reviews.** [M33 QA](M33_EXPANDED_LABS_QA.md) documents original limitations, IUPAC source reference and prototype-only boundaries.

### M34 candidate checkpoint — draft PR #23 (2026-11-24)

B1 **46/50**, B2 **17/50** remain verified. Ten B2 items moved to IN_PROGRESS (FP-066/067/076–079/086–089); six design contracts and bounded teacher organizer code are present. FP-079/087/088 have partial audit/worksheet/projector coverage, not full acceptance. FP-086–089 depend on external FP-085. Initial Chromium mobile overflow failed; fixes and new browser regression cases committed. Exact-head CI and full evidence reconciliation pending. No changes to 3,304 review records or public-release gate. [M34 design and QA](M34_B2_DESIGN_AND_ACCEPTANCE.md) · [Draft PR #23](https://github.com/mohdazizshaikh/aiforstudents-latest/pull/23).

### M36 discovery candidate

[Draft Class 1–12 topic discovery](M36_CURRICULUM_DISCOVERY.md) adds 48 illustrative topic lenses and links to the 24 existing interactive models; FP-016–020 remain BLOCKED_EXTERNAL, with zero board chapter/edition verification. M35 verified 70 scoped engineering/design tasks; M36 exact-head CI pending.

### M36 expanded interactive candidate

Four new original bilingual computer-only models: square function, ideal net force, symbolic atom count and hypothetical cell diagram scale. Inventory now 28 interactive lab models (16 advanced); 3,308 educational records require human review. Actual chapter mapping and all external approvals remain blocked. 70/100 scoped work items unchanged; new code pending exact-head CI.

### M37 offline assignment pack candidate

FP-087: two original-source five-step bilingual learner print packs in existing cached cards route, no names, answer keys or tracking. Code and tests pending exact-head CI; licensing and qualified teacher approval FP-085 remain external. Reuses 10 existing reviewed-pending classroom step records; no new instructional record count. See [M37 assignment packs](M37_ASSIGNMENT_PACKS.md).

### M40 foundational interactive candidate

Eight new original bilingual computer-only conceptual models, two per subject lens, bring the candidate to 36 interactive models, 36 fixed draft hints and 3,316 pending content reviews. Seven former draft discovery gaps now have related models (not curriculum verification). M37 and M38 have passed exact-head CI and merged. M40 awaits exact-head CI; 70/100 scoped engineering/design tasks unchanged, external approvals remain blocked. [M40 models](M40_FOUNDATION_MODELS.md).

### M41 secondary interactive candidate

M40 passed exact-head CI and merged. M41 adds eight original bilingual computer-only secondary concept models, bringing candidate inventory to 44 interactive models, 44 fixed draft hints and 3,324 pending content reviews. M39 worklist was reconciled to M40 and needs integrated CI. 70/100 scoped engineering/design tasks unchanged; no human or public approval. [M41 secondary models](M41_SECONDARY_MODELS.md).

### M46 remaining discovery-lens candidates

M42–M45 passed their exact-head CI and merged; teacher launcher, synthetic tutor contract, example feedback and local draft review rubric are implemented. M46 adds eight original draft models and fills all five previously empty illustrative lenses, yielding 48/48 nonempty draft topic slots, 52 interactive models and 3,332 pending review records. Zero verified chapter mappings. 70/100 scoped engineering/design tasks unchanged. [M46 models](M46_DISCOVERY_GAP_LABS.md).
