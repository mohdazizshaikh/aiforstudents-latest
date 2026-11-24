# M57 — Disabled AI tutor adversarial contract audit

Stacked on combined M55/M56 candidate ead5c72af7bb34733ba7f183ccc4f2138ad7813f. M55 verified merged; M56 individual tests passed, integrated CI pending. This maintainer-only automated negative-test runner exercises the existing permanently empty approved-source registry and synthetic exact-excerpt response verifier. It does not instantiate an LLM or make provider requests.

224 deterministic cases: 152 current pilot-content request denials (76 × English/Hindi), 30 malformed request denials, 40 synthetic mutated response rejections and two synthetic positive controls which still cannot enable the actual tutor. Cases cover request ID/hash/language binding, injected extra fields, forged source/citation, unsupported excerpts, malformed input, and denial of all unapproved pilot sources. No educational answer text is returned. Run `node tools/tutor-adversarial-audit.mjs`.

This is a software boundary regression audit, not an independent adversarial bias/hallucination review, semantic evaluation or provider safety certification. FP-068/069/070 remain blocked: authenticated approved sources, provider/privacy/legal agreement, budget authorization, independent human evaluation and safety decision required. No production activation, no personal or child data. Exact integrated CI required.
