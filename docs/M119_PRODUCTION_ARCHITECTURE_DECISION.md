# M119 — Conditional deployment architecture (proposed, not approved)

Decision scope: preserve the existing static, offline, account-free core on the existing Hostinger Business shared hosting plan. No actual account inspection, plan entitlement verification, deployment or new spending authorization in M119.

| Candidate | Benefit | Constraint / disposition |
|---|---|---|
| Static HTML/CSS/ES modules | Existing core, no server dependency, offline | Selected existing baseline; unchanged |
| PHP + MySQL-compatible relational database | Potential fit for short request/response adult-only operations on shared hosting | Conditional preferred production candidate; verify actual PHP/database versions, isolation, quotas, backup/restore, HTTPS and security support with account owner |
| Node + SQLite developer service | Existing local tests and fixed rehearsal API | Loopback-only; do not deploy this service on shared hosting or expose it through a proxy |
| Separate managed application service | Potential isolated backend | Defer: cost, contracts, operational ownership and child privacy not approved |

No actual production storage selected as an approved deployment. No child accounts, telemetry, real data, remote AI, authentication activation, or paid service. The existing static archive must continue excluding tools and private evidence. Before any server rollout obtain explicit architecture approval, actual hosting capability evidence, written budget and data-minimization decisions, access and backup policy, independently reviewed adult authentication, staging and rollback evidence. Separate PHP/MySQL migration implementation and recovery tests on the actual target remain required. Local SQLite migration/rollback/restore proves only a synthetic procedure.

Migration sequence: snapshot existing static release; inventory fixed reference data; create restricted isolated empty database; apply reviewed schema version migration; seed synthetic records only; run referential/integrity and restore drills; verify no public API or tools exposure; independently review; go/no-go; revert static release and restore snapshot if gate fails. Do not run the local Node tools on a production database. Real educational content approval remains separate.

## M125 implementation follow-up (candidate, not production approval)

A separate PHP/PDO MySQL 8.4 CLI-only rehearsal is prepared in `tools/mysql-rehearsal/`, with a dedicated ephemeral CI service, source-derived bilingual draft metadata, 96 planning cells, transaction-protected synthetic plan, interrupted-DDL resume and logical plan snapshot restore. No live Hostinger connection or real database backup/restore; actual host version, PHP extensions, privileges, isolation, authenticated adult access and operational approval remain unverified. See [M125 handoff](M125_MYSQL_REHEARSAL.md).

M126 follow-up: first disposable MySQL 8.4 CI job passed (45717283305 at 3dc90af600ca34cc43103113eadd90f4293c69ac). Full logical dump and separate-schema recovery verification added; new head pending. This is not actual Hostinger compatibility or physical backup evidence.
