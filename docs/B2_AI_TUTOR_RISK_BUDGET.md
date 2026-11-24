# M34 — B2 AI tutor risk design and budget contract (FP-066 / FP-067)

**Status: engineering design, NOT approved, no live model integration.** Core student PWA is free, offline-first and has no paid API. Existing local hint guide remains original **UNREVIEWED** drafts, not approved retrieval and not AI inference.

## Default-off safety architecture

A separately authorized future tutor must keep public/child access OFF unless every required human gate is independently verified: exact bilingual subject source and rights review; age-appropriate child safety/red-team review; authorized privacy/legal decision and consent path; secure operator; approved cost cap and a real monitoring/incident drill. No self-signed approval, hidden key, model secret in frontend, provider SDK or unrestricted free text. There is currently **no endpoint**, API client, model choice, or network request.

Design-only future path: explicit consent → fixed allowed subject/topic and reviewed versioned source → trusted server-side retrieval from authorized source excerpts → source-bound answer or abstain → uncertainty and citations → no prompt retention by default. Unknown, conflicting or missing evidence yields teacher guidance. Never upload names, school, age/DOB, marks, private disclosures, browser history, disability/health data, photos, audio, contacts, tracking identifiers, or clipboard. If sensitive disclosure occurs, do not ask for details; stop and direct to trusted adult/appropriate urgent assistance. No medical, legal, psychological diagnosis or unsafe physical experiment directions. No ranking, manipulative engagement or companionship dependency.

Threat cases and required actual review: prompt injection in documents (data is not instructions), hallucinated chapter citations, inaccurate Hindi, caste/gender/language bias, age mismatch, unsafe physical procedures, privacy leakage, unauthorized textbook reproduction, access-control and cost abuse, network/provider failure and model/version change. Independent reviewers must test representative and adversarial cases, log failures without child identities, require source attribution and an abstention path, and repeat for material changes. FP-068/069/070 remain external review gates. A future kill switch must fail closed and restore offline-only practice without collecting prompts.

## Cost and latency design, no provider or current pricing assumption

`tools/inference-envelope.mjs` computes a hypothetical upper-bound estimate using **operator-supplied** rates in one stated currency/unit, maximum requests/day, active days, max input/output tokens per request and a hard budget. The tool performs no model calls, selects no provider, assumes no current exchange rate, and never enables a tutor. Rates, token limits, request count, retries, moderation overhead, taxes, bandwidth, and server costs must be explicitly bounded by the operator. A budget estimate is not a bill, quote or permission.

Suggested planning-only latency target: operator chooses an upper per-request latency limit and measures p50/p95, timeout/fallback, low-end mobile and poor network; no guarantee of model performance. Offline and failed requests must return the existing fixed-source practice interface. Every production request must reserve worst-case cost atomically before inference and count retries; no paid call unless hard request/token/budget caps, human approval, server-side secrets and monitoring are actually implemented.

Current dependency and inference costs are **zero model calls**; hosting/network/device costs are separate and not verified. No new paid dependency is introduced by this design. No prices are embedded.

## Release gates

FP-066/067 describe **design artifacts and arithmetic only**. No real AI tutor, validated source retrieval, hallucination evaluation or paid service approval. The M33/M34 learner app remains local-only and the public child launch preflight stays blocked. See [scope](FULL_PRODUCT_SCOPE_AND_DONE.md), [safety gates](../RELEASE_GATES.md).
