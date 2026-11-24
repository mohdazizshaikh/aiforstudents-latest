# M34 — B2 design and acceptance workstream

Baseline: main b24e9a31188e661a246a532f3310c25ddc47d79f (M33). B1 46/50, B2 17/50; 3,304 content records pending. These are **proposed engineering contracts**, not qualified approval. Main tracker counts remain unchanged until relevant source, test and exact-head CI evidence is reconciled. Public release stays false.

## FP-066 / FP-067 — optional tutor architecture, risk and cost

The existing fixed local hint selector is the default, including offline. No free-text child chat, remote model SDK, account or API key in the browser. A future optional adult-supervised service must be separately gated and opt-in; when any gate fails the local selector remains available. No deployment or model integration is authorized by this document.

Threats and controls:
- Prompt injection/source poisoning: retrieve only exact approved, versioned source IDs; treat source text as data; do not allow source instructions, tool execution or external navigation. Require citations to reviewed passages; reject missing or revoked source version.
- Hallucination and misleading authority: limit to the selected lesson; answer only from approved evidence, state uncertainty, decline rather than fabricate. No personal health, diagnosis, secrets, dangerous experiments or emergency assessment. Route sensitive concerns to an appropriate trusted adult; do not solicit disclosures.
- Child privacy: no identifier, school, history, location, contact information or free-form transcripts by default. Redact before any authorized transmission; never send student identifiers to inference provider. No training on child inputs, no provider retention unless separately reviewed. Human operators must confirm data processing, deletion, moderation and incident response.
- Bias/accessibility: Hindi and English evaluation including disability, gender, socioeconomic and regional examples; avoid fixed aptitude labels. Test refusals, misleading instructions and unsupported citations with qualified reviewers.
- Abuse/cost: service-side request quotas, timeout, kill switch, no anonymous unbounded public API; fallback on outage or quota exhaustion. No secret or credential in static assets. No automatic activation.

Provisional design targets (not measured/vendor quotations): core API budget INR 0; optional service disabled and budget INR 0 until explicit funding. Illustrative bounded pilot: 20 teacher-controlled requests per day, 20 days, 800 input and 250 output tokens/request -> 320,000 input and 100,000 output tokens/month. Cost = 0.32 × provider input price per million + 0.10 × output price per million, plus taxes, hosting and moderation. No vendor selected. An approved hard spend cap and circuit breaker are mandatory before live use. Proposed time budget: 2 seconds local retrieval, 8 seconds remote total including timeout, immediately fall back on timeout/offline; measure p50/p95 on target devices separately. No promise of free remote AI.

Acceptance before any live deployment: named accountable human owners, approved source register, provider/data agreement, consent and deletion policy, actual measured costs/latency, independent bilingual red-team, teacher/child safety/legal signoff, approved restricted pilot, kill-switch drill. FP-068/069/070 remain external gates.

## FP-076 — proposed mastery calibration protocol (not validated)

Current UI gives optional practice suggestions, never mastery or intelligence scores. For future evaluation only, define a concept-specific reviewed question pool and independent held-out transfer tasks. Use at least three distinct reviewed tasks, at least two contexts and two separated sessions for a candidate evidence flag; no claim based on repeated memorized tasks or mere completion. Proposed candidate threshold 80% on both contexts with uncertainty and no automatic grade/track placement; missing evidence stays unknown. These numbers are provisional hypotheses, not validated thresholds. Compare prediction with later held-out transfer, report uncertainty, false-positive/negative rates and abstentions; stratify only with permitted sufficient anonymized data and independent ethics/educator review. No permanent profiling, punitive ranking or automated high-stakes decisions. Teacher may reject suggestions. Pre-register study and stopping rules; publish null/negative results. FP-080 remains blocked on real authorized study.

## FP-077 / FP-078 / FP-079 — classroom aggregate and shared-device boundary

No pupil roster, identities, attendance, individual marks, leaderboard, persistent student profile or exported analytics. Proposed future classroom summary, only after approvals: teacher-entered aggregate counts for one lesson, no free-text or identifiers, no individual scores. Suppress counts for groups below 10 and categories below 5; suppress complementary cells when totals would expose small counts; no cross-session joins, timestamps, school identifiers or public reports. These thresholds are conservative provisional design choices, not anonymization certification. No aggregation feature in this increment.

Lesson organizer scope: existing fixed IDs only, memory-only queue; no new stored history, URL payload, clipboard export, network or new data fields. Reset clears queue, step, role, teacher answer and projector state. Shared-device clear event clears all those fields; refresh starts empty. Browser history and OS backups are outside site guarantees. Do not infer child identity from browser, tab or device. For existing opt-in learner history, verify same-tab, cross-tab, preference and explicit clear behavior independently; include printed surfaces, BFCache and offline reload in physical test matrix. Do not claim all retention pathways audited without those tests.

## FP-086 / FP-087 / FP-088 — teacher organizer / assignment / projector acceptance

Use the two existing original unreviewed teacher plans as a bounded prototype, not a syllabus. Queue only allowlisted IDs, no duplicates, move up/down, remove, start next lesson, clear. Keep queue in memory, do not ask for dates, names or school. Existing worksheets are linked, no copying third-party content. Any future downloadable pack requires rights/provenance, verified content, learner-only print and no tracking. Offline projector acceptance requires cached app, disconnected navigation, keyboard and print alternative; real equipment remains external. Existing noindex and CSP must remain intact.

## FP-089 — draft ethical observer form (blank, not a completed pilot)

Complete only after school, safeguarding, educator and applicable consent/ethics approval. No student names, ages, photos, audio/video, contact details, school names, identifiers or individualized scores. Do not use with children before authorization. No online submission implemented.

| Field | Permitted entry |
|---|---|
| Authorization checked by responsible operator | yes / no / not assessed (stop unless yes) |
| Reviewed lesson version confirmed | yes / no / not assessed |
| Setup possible on available device | yes / no / not assessed |
| Instructions understandable | yes / no / not assessed |
| Keyboard / paper alternative usable | yes / no / not assessed |
| Group reasoning supported | yes / no / not assessed |
| Offline fallback usable | yes / no / not assessed |
| Accessibility or safety concern observed | yes / no / not assessed (escalate through authorized process) |
| Follow-up action | revise / retest / stop / not assessed |

Observer must not record identifiable narrative in this form. Safety incidents go directly to the approved safeguarding lead through the school's secure process, not this project. Keep any authorized evidence in the institution's controlled storage, with agreed retention and deletion; no uploads here. No results or participant recruitment exist.

## Evidence and release discipline

This document advances design candidates FP-066, FP-067, FP-076, FP-077, FP-078, FP-089. FP-086 is a separate code/test candidate. FP-079, FP-087, FP-088 need remaining implementation or audit; external gates retain status. Update canonical JSON, dashboard and plan together after exact-head test evidence. No fabricated owner, source approval, school pilot or real Hostinger evidence.

## M34 follow-up: first CI result and corrective work

Initial exact head 97fcc31: Node/static/package job passed; Chromium failed at 390px (708px document width). Corrective candidate replaces row-flex notice with bounded single-column grid and wrapped controls; retains normal overflow detection. Adds real browser cases for reorder/start/reset, peer-tab clear, offline projector, Hindi mobile bounds, learner-only main print and both existing worksheet routes. Service worker cache identifier changes to m34-r1 suffix (M33 packaging baseline remains) to invalidate old static cache. No real device, licensing, subject review or launch approval implied. New head still requires CI. Existing original worksheets are reused, not a complete licensed assignment pack.
