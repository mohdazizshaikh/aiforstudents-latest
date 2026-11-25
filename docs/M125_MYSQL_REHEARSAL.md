# M125 — PHP/PDO MySQL target-shaped database rehearsal

**Candidate, not production approval. M33/M29 retained.** Independent branch from verified M121 main; M122–M124 are separate pending PRs. ENG-006 conditional design remains externally pending, ENG-007 SQLite rehearsal verified previously. This follow-up adds actual MySQL-specific schema and PHP repository code plus a dedicated ephemeral MySQL 8.4 CI service; no actual Hostinger connection or deployment.

## Implemented scope
- Five InnoDB tables: version, bilingual activity, draft curriculum cell, synthetic plan, ordered plan item. Exact source-derived inventory (121 draft activities / 242 languages in M121 baseline; dynamic on later merges), 96 board/grade/subject cells, no verified chapters. Prepared statements and enumerated filter allowlists.
- Single fixed CLI-only loopback DSN and dummy ephemeral test credentials, explicit local rehearsal opt-in; refuse nonempty schema, no arbitrary endpoint or production credentials.
- v1→v2 adds pending review-state column. MySQL DDL implicitly commits, so test interruption after DDL, verify expected column and resume version advancement. This is not atomic DDL rollback or a general migration manager.
- Ordered max-six unique activity plan, foreign key, transactional replacement with injected failure rollback; digest-checked logical plan snapshot and restore, not physical database backup.
- Dedicated CI job PHP syntax/PDO availability and MySQL data parity (40 filter combinations, 96 cells, two language inventories), invalid plan rejection, DML rollback, interrupted migration resume and logical restore. Two Node static/source tests. Actual service execution pending CI.
- Private PHP/SQL source included only in source archive; excluded from static ZIP and negative host probes added. No web API or real operator authentication.

## Remaining
Account compatibility and actual MySQL/MariaDB/PHP versions, restricted HTTPS staging, credential management, physical backup/recovery, concurrency/load review, real adult identity, legal/safeguarding/educator reviews and owner approval. Original master plan 70/100 unchanged; 39 scoped engineering implementations verified and one architecture decision externally pending. Do not deploy this rehearsal on shared hosting or run it against a real database. No child records, public launch or paid service. Rollback by reverting candidate commits; CI database is disposable.
