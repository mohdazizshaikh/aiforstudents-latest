# M52 — Combined CBSE candidate mapping review

M51 merged at 3834f29be91c1e266c92f3e559838ff1e4288dd7 after CI 45443051061. M49 and M51 contain 22 distinct grade/model proposals, not verified textbook mappings. This local worksheet binds each candidate to the exact current canonical model fingerprint and a deterministic hash of the grade, source URL, page, syllabus reference, limitation and review reference. Five checks per candidate: syllabus anchor, textbook edition, learning outcome fit, grade suitability, rights. 110 checklist cells; all pending on generation.

Commands:
- node tools/cbse-mapping-review.mjs --template cbse-review.json
- node tools/cbse-mapping-review.mjs --check cbse-review.json

Outputs are local under ignored review-evidence/, exclusive creation. Evidence refs are opaque, not names or private URLs; do not include children, school identifiers, private documents or access secrets. Changed model content or mapping anchors invalidate earlier worksheets rather than silently transferring review. A fully filled structural worksheet can be ready for independent audit only; the tool never authenticates human reviewers, grants rights, writes queue decisions or approves publication. No live PDF validation by the checker. FP-018/019/020 still blocked. 3,340 pending educational records, 70/100 scoped tracker unchanged. Exact-head CI pending.
