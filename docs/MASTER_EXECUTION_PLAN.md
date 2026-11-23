# M29 — 100-work-item master execution plan (2 × 50)

**Status as of 2026-11-24: DOCUMENTATION ONLY.** Overall product: **PARTIAL WORKING PROTOTYPE, NOT COMPLETE**. Existing M28 functionality remains separate from these **100 new tasks**. None is reported done. **Public child-facing launch: BLOCKED**.

## Fast batch execution rules

- **B1 (50 tasks):** first five entries in each of ten workstreams. Lock scope, reusable foundations, representative safe labs and initial QA. **Current completion: 0/50**.
- **B2 (50 tasks):** last five entries in each workstream. Broader Maths/Physics/Chemistry/Biology, governed AI/adaptive features, teacher depth, source and field reviews. **Current completion: 0/50**.
- **Efficiency:** plan/triage each 50-task batch in one coordinated work cycle instead of requesting tiny steps. Run independent streams concurrently, use small coherent feature PRs rather than one unreviewable giant merge, run tests at each ~10–15-task checkpoint and consolidate progress into a single verified batch report.
- **Non-negotiable:** a human review, real school trial, live Hostinger verification or legal approval remains **BLOCKED_EXTERNAL** unless a real authorized reviewer/operator supplies evidence. A successful Node/Chromium test or a prepared template is not that evidence.
- **Completion status:** NOT_STARTED → IN_PROGRESS → CODE_COMPLETE_TESTED → REVIEW_PENDING → DONE_VERIFIED; BLOCKED_EXTERNAL when dependencies cannot be fulfilled. Code output needs commit, tests, screenshot/QA where appropriate; real-world gates require actual human/field proof.
- **100 tasks are a delivery register, not an assertion that two batches will finish every Class 1–12 chapter and every state board.** Full chapter/edition-by-chapter coverage requires later enumerated content records and review, not invented percentages.

**GitHub execution tickets:** [Batch B1 — 50 tasks, 0 done](https://github.com/mohdazizshaikh/aiforstudents-latest/issues/16) · [Batch B2 — 50 tasks, 0 done](https://github.com/mohdazizshaikh/aiforstudents-latest/issues/17). These are two coordination issues, not 100 separate noisy issues; task detail and evidence stay in this tracked register.

## Work breakdown — 10 streams × 10 items

### 1. Product governance — GOV

**Role:** Product/Quality (person unassigned).

| ID | Batch | Task | Acceptance evidence | Status |
|---|---|---|---|---|
| FP-001 | B1 | Publish truthful prototype baseline | Explicitly list implemented versus absent features | NOT_STARTED |
| FP-002 | B1 | Define completion status vocabulary | Distinguish code/tests from subject, device and launch approval | NOT_STARTED |
| FP-003 | B1 | Freeze comprehensive end-state scope | List classes, subjects, labs, AI, adaptive and teacher functions | NOT_STARTED |
| FP-004 | B1 | Map GitHub release-gate dependencies | Link P0 issues #2–#5 and P1 #6 without closing them | NOT_STARTED |
| FP-005 | B1 | Record 100-work plan acceptance rules | No claimed completion without task-specific evidence | NOT_STARTED |
| FP-006 | B2 | Build CI plan consistency checker | Assert 100 IDs, 2 × 50 and valid state transitions | NOT_STARTED |
| FP-007 | B2 | Create role/owner ledger | Real accountable owners confirmed privately; TBD is not approval | NOT_STARTED |
| FP-008 | B2 | Create source/test/evidence traceability | Each completed item links commit and relevant proof | NOT_STARTED |
| FP-009 | B2 | Create controlled scope-change protocol | No silent product-complete or release language | NOT_STARTED |
| FP-010 | B2 | Conduct independent batch completion review | Human signoff separate from engineering checklist | NOT_STARTED |

### 2. Curriculum and licensing — CUR

**Role:** Curriculum/Teachers (person unassigned).

| ID | Batch | Task | Acceptance evidence | Status |
|---|---|---|---|---|
| FP-011 | B1 | Inventory NCERT/DIKSHA/board source options | Source links and edition fields, no copied licensed materials | NOT_STARTED |
| FP-012 | B1 | Create chapter/grade/board metadata model | Grade distinct from age band and source edition | NOT_STARTED |
| FP-013 | B1 | Define educational and Hindi review rubric | Accuracy, language, safety, age and accessibility criteria | NOT_STARTED |
| FP-014 | B1 | Design third-party copyright/provenance registry | Every reused asset has permission and attribution evidence | NOT_STARTED |
| FP-015 | B1 | Draft provisional Grade 1–2 concept map | Topic coverage clearly labelled draft until verified | NOT_STARTED |
| FP-016 | B2 | Verify Grade 3–5 chapter map | Source editions and reviewer evidence recorded | NOT_STARTED |
| FP-017 | B2 | Verify Grade 6–8 chapter map | Chapter/outcome references checked by educator | NOT_STARTED |
| FP-018 | B2 | Verify Grade 9–10 chapter map | Board and edition-specific source references checked | NOT_STARTED |
| FP-019 | B2 | Verify Grade 11–12 chapter map | Stream, chapter, prerequisite and reviewer recorded | NOT_STARTED |
| FP-020 | B2 | Authorize selected curriculum pilot slice | Only exact approved chapters labelled reviewed | NOT_STARTED |

### 3. Student app/offline/accessibility — UX

**Role:** Frontend/A11y (person unassigned).

| ID | Batch | Task | Acceptance evidence | Status |
|---|---|---|---|---|
| FP-021 | B1 | Plan new Maths/Science/Teacher navigation | All routes discoverable at mobile widths | NOT_STARTED |
| FP-022 | B1 | Build reusable five-step lesson shell | Learn/Try/Play/Understand/Grow with truthful retry | NOT_STARTED |
| FP-023 | B1 | Unify Hindi/English content validation | Missing translations fail tests | NOT_STARTED |
| FP-024 | B1 | Define focus/labels/live feedback contract | Keyboard and screen-reader paths testable | NOT_STARTED |
| FP-025 | B1 | Set low-end bandwidth/performance budgets | Asset and cold-start limits enforced in CI | NOT_STARTED |
| FP-026 | B2 | Audit all new offline/PWA paths | No broken modules when disconnected after caching | NOT_STARTED |
| FP-027 | B2 | Audit multi-tab shared-device reset | No stale opt-in/session history in supported browser tests | NOT_STARTED |
| FP-028 | B2 | Add non-drag alternative to every lab | Buttons/keyboard/numeric text equivalent | NOT_STARTED |
| FP-029 | B2 | Create accessible print/low-ink export | A4 layout hides teacher-only notes and private data | NOT_STARTED |
| FP-030 | B2 | Run physical accessibility usability checks | Actual Android, TalkBack/VoiceOver, zoom evidence | NOT_STARTED |

### 4. Interactive Maths Lab — MATH

**Role:** Maths/Engineering (person unassigned).

| ID | Batch | Task | Acceptance evidence | Status |
|---|---|---|---|---|
| FP-031 | B1 | Map Grade 1–12 maths learning outcomes | Explicit topic coverage matrix and gaps | NOT_STARTED |
| FP-032 | B1 | Migrate fractions to reusable lab framework | Correct equivalence and accessible input tests | NOT_STARTED |
| FP-033 | B1 | Build place-value and number-line manipulator | Deterministic arithmetic and audio-free text state | NOT_STARTED |
| FP-034 | B1 | Build geometry/measurement manipulator | Units, area/perimeter and keyboard controls tested | NOT_STARTED |
| FP-035 | B1 | Build accessible charts/data interpretation lab | Equivalent data table and verified answers | NOT_STARTED |
| FP-036 | B2 | Build ratios and algebra lab | Correct step explanations with educator review | NOT_STARTED |
| FP-037 | B2 | Build symmetry and transformation lab | Rotation/reflection/translation deterministic cases | NOT_STARTED |
| FP-038 | B2 | Build coordinate/graph lab | Axis signs and functions numerically verified | NOT_STARTED |
| FP-039 | B2 | Build probability/statistics experiment lab | Transparent seeds, sample sizes and caveats | NOT_STARTED |
| FP-040 | B2 | Obtain independent Maths/Hindi pilot approval | Reviewed exact lessons; no fake complete syllabus | NOT_STARTED |

### 5. Physics/general science lab — PHYS

**Role:** Physics/Engineering (person unassigned).

| ID | Batch | Task | Acceptance evidence | Status |
|---|---|---|---|---|
| FP-041 | B1 | Map safe grade-wise Physics concepts | Distinguish conceptual model from real equipment | NOT_STARTED |
| FP-042 | B1 | Validate existing series-switch simulation | Correct circuit truth table and mains safety caveat | NOT_STARTED |
| FP-043 | B1 | Build forces/motion interactive model | Units, edge cases and accessible numerical text | NOT_STARTED |
| FP-044 | B1 | Build light/reflection model | Angle relationships mathematically checked | NOT_STARTED |
| FP-045 | B1 | Build energy transfer model | No unsupported energy/efficiency claims | NOT_STARTED |
| FP-046 | B2 | Build heat/temperature model | Scientific distinction and safe non-hardware activities | NOT_STARTED |
| FP-047 | B2 | Build sound/wave interactive model | Frequency/amplitude accessible without audio | NOT_STARTED |
| FP-048 | B2 | Build magnetism qualitative model | Clear limitations and safe material instructions | NOT_STARTED |
| FP-049 | B2 | Build measurement/data-table practice | Local-only measurements and unit checks | NOT_STARTED |
| FP-050 | B2 | Obtain subject and classroom safety review | Qualified educators approve exact examples | NOT_STARTED |

### 6. Chemistry/Biology/environment lab — BIOCHEM

**Role:** Science/Safety (person unassigned).

| ID | Batch | Task | Acceptance evidence | Status |
|---|---|---|---|---|
| FP-051 | B1 | Define safe chemistry/bio exclusions | No unsafe hands-on reactions or medical inference | NOT_STARTED |
| FP-052 | B1 | Build states-of-matter particle model | Correct labelled transitions and simplification caveats | NOT_STARTED |
| FP-053 | B1 | Build physical/chemical change sorter | Correct explanations with draft-review flags | NOT_STARTED |
| FP-054 | B1 | Build cell structure interactive explorer | Text alternative and differentiated cell types | NOT_STARTED |
| FP-055 | B1 | Build life-cycle/food-chain model | Scientifically correct ordered relationships | NOT_STARTED |
| FP-056 | B2 | Build periodic-table pattern explorer | Verified atomic number/group data sources | NOT_STARTED |
| FP-057 | B2 | Build symbolic mass-conservation model | No dangerous recipes; balanced example tests | NOT_STARTED |
| FP-058 | B2 | Build ecosystem interactions model | Food web and uncertainty clearly communicated | NOT_STARTED |
| FP-059 | B2 | Build heredity/variation explainer | No genetic essentialism or health profiling | NOT_STARTED |
| FP-060 | B2 | Obtain independent science/Hindi safety approval | Reviewed exact lessons before student publication | NOT_STARTED |

### 7. AI tutor and safety — TUTOR

**Role:** AI/Safety (person unassigned).

| ID | Batch | Task | Acceptance evidence | Status |
|---|---|---|---|---|
| FP-061 | B1 | Decide zero-paid-API tutoring architecture | Core learning stays free and usable offline | NOT_STARTED |
| FP-062 | B1 | Specify reviewed-content hint contract | No general unmoderated child chatbot | NOT_STARTED |
| FP-063 | B1 | Build deterministic local hint prototype | Correct source-backed explanations and safe fallback | NOT_STARTED |
| FP-064 | B1 | Add attribution and uncertainty display | Unknown answer not fabricated | NOT_STARTED |
| FP-065 | B1 | Define refusal/sensitive disclosure policy | Unsafe prompts lead to age-appropriate adult guidance | NOT_STARTED |
| FP-066 | B2 | Document optional generative tutor risk design | Feature OFF until real safeguards and cost approval | NOT_STARTED |
| FP-067 | B2 | Model privacy, latency and AI inference budget | No undisclosed paid dependency | NOT_STARTED |
| FP-068 | B2 | Prototype approved-source retrieval flow | No unauthorized copyrighted content or unsourced replies | NOT_STARTED |
| FP-069 | B2 | Conduct adversarial bias/hallucination review | Independent human evaluation and red-team defects | NOT_STARTED |
| FP-070 | B2 | Approve or reject AI tutor public use | Real safety/legal/education gate; no auto-enable | NOT_STARTED |

### 8. Adaptive practice and progress — ADAPT

**Role:** LearningScience/Privacy (person unassigned).

| ID | Batch | Task | Acceptance evidence | Status |
|---|---|---|---|---|
| FP-071 | B1 | Design minimal on-device learning event schema | No child identity or cloud tracking by default | NOT_STARTED |
| FP-072 | B1 | Prevent unsupported mastery claims | Recommendations described as practice, not intelligence | NOT_STARTED |
| FP-073 | B1 | Design optional spaced-practice schedule | No pressure streak or penalty | NOT_STARTED |
| FP-074 | B1 | Create explainable next-task suggestions | Learner can see reason and decline | NOT_STARTED |
| FP-075 | B1 | Add explicit difficulty and language override | No inferred fixed aptitude label | NOT_STARTED |
| FP-076 | B2 | Write adaptive mastery calibration protocol | Evidence thresholds documented; not yet validated | NOT_STARTED |
| FP-077 | B2 | Specify anonymous aggregate classroom view | No individual minor scores or rosters | NOT_STARTED |
| FP-078 | B2 | Define safe shared-device session boundaries | Cannot identify children solely through a browser | NOT_STARTED |
| FP-079 | B2 | Audit opt-in data retention and deletion | Local/session, background tabs and print paths tested | NOT_STARTED |
| FP-080 | B2 | Run ethical learning-outcome validation | Consented study and independent evidence required | NOT_STARTED |

### 9. Teacher planning and classrooms — TEACH

**Role:** Teachers/Engineering (person unassigned).

| ID | Batch | Task | Acceptance evidence | Status |
|---|---|---|---|---|
| FP-081 | B1 | Define no-roster teacher dashboard MVP | Local lesson-planning only; no student surveillance | NOT_STARTED |
| FP-082 | B1 | Enhance projector/teacher navigation | Large controls, focus, Hindi and mobile support | NOT_STARTED |
| FP-083 | B1 | Improve anonymous collaborative role rotation | Same-device group activity without child names | NOT_STARTED |
| FP-084 | B1 | Build reusable teacher answer/worksheet cards | Printable answers hidden from learner sheets | NOT_STARTED |
| FP-085 | B1 | Review existing fraction/circuit teacher plans | 2 baseline prototypes remain unapproved until reviewed | NOT_STARTED |
| FP-086 | B2 | Build local teacher lesson organizer | Select/queue/reset without cloud accounts | NOT_STARTED |
| FP-087 | B2 | Create licensed offline assignment packs | No tracking links or identifiable learner export | NOT_STARTED |
| FP-088 | B2 | Implement no-internet projector handoff | Teacher plan works in a disconnected classroom | NOT_STARTED |
| FP-089 | B2 | Prepare ethical observer feedback template | Minimal permitted evidence and child-safe protocol | NOT_STARTED |
| FP-090 | B2 | Complete authorized supervised classroom pilot | School/guardian permissions and real observation | NOT_STARTED |

### 10. Quality/release and human gates — VERIFY

**Role:** QA/Ops/Safeguarding (person unassigned).

| ID | Batch | Task | Acceptance evidence | Status |
|---|---|---|---|---|
| FP-091 | B1 | Publish Node/Chromium acceptance matrix | All core/offline/privacy paths trace to tests | NOT_STARTED |
| FP-092 | B1 | Build subject-correctness regression fixtures | Expert-approved expected answers, equations, explanations | NOT_STARTED |
| FP-093 | B1 | Automate keyboard and non-visual flow sampling | Representative Hindi/English and touch-free checks | NOT_STARTED |
| FP-094 | B1 | Keep static staging ZIP privacy/integrity gates | Noindex, CSP, SHA-256 and source-path exclusions | NOT_STARTED |
| FP-095 | B1 | Create truthful evidence status dashboard | No mock result counts as human or live hosting | NOT_STARTED |
| FP-096 | B2 | Perform physical Android/AT/A4 testing | Real device evidence with logged failures | NOT_STARTED |
| FP-097 | B2 | Deploy real restricted HTTPS Hostinger staging | Authorized HTTPS/access/backup/rollback verification | NOT_STARTED |
| FP-098 | B2 | Complete 3,282 existing content record reviews | Real qualified subject/Hindi decisions recorded | NOT_STARTED |
| FP-099 | B2 | Complete six human safeguarding operational gates | Owners, privacy/legal, incident drill and permissions | NOT_STARTED |
| FP-100 | B2 | Independent school/launch go-no-go decision | Public remains noindex until all external gates satisfied | NOT_STARTED |


## Current actual baseline (not counted toward 100 new tasks)

Existing: 40 games in 8 categories; 3 local cooperative games; Study Lab 32 draft checks; Smart Studio two pilot journeys (fractions and conceptual circuit); Virtual Lab two simulations; Teacher Kit two unreviewed plans and two worksheets; AI & Digital Skills 32 draft deterministic scenarios; M28 offline, local privacy and CI. **NOT implemented:** comprehensive Class 1–12 syllabus, complete Physics/Chemistry/Biology/Maths labs, open AI tutor, validated adaptive mastery, complete school dashboard or completed real classroom study.

Pending evidence: **3,282 educational content records**, six human safety-operation gates, real restricted HTTPS Hostinger staging, independent real-device/assistive technology audit, verified curricular edition/grade mapping, and authorized teacher pilot. See [full scope / Definition of Done](FULL_PRODUCT_SCOPE_AND_DONE.md), [JSON register](MASTER_100_WORK_ITEMS.json), [release gates](../RELEASE_GATES.md).

**Release approval is independent of batch coding:** All 100 tasks cannot simply be auto-marked DONE by an AI assistant; named qualified humans and authorized institutions must complete their own evidence.
