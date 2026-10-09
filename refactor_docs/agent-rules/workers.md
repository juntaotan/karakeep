# Workers and Scheduling

Extracted from the supplied migration document. Applicable requirements remain binding across W0–W4; this split does not prescribe TDD or a migration implementation order.

## Background Processing and Worker Compatibility

Background processing must be migrated from TypeScript to Python without changing the existing task architecture or business semantics.

- Preserve the existing queue and broker infrastructure.
- Maintain existing job contracts, payload structures, scheduling conditions, and execution semantics.
- Preserve existing retry policies, failure-handling behaviour, recovery mechanisms, and idempotency guarantees.
- Maintain equivalent behaviour for crawling, archiving, OCR, document processing, AI operations, indexing, imports, exports, backups, and scheduled tasks.
- Python-compatible worker libraries and frameworks may replace TypeScript-specific implementations.
- Worker implementations must remain compatible with existing database operations, external integrations, and task-processing infrastructure.

The migration must not introduce unrelated changes to the background processing architecture.

## Approved Queue and Worker Compatibility

The user approved F04 and requires existing business behaviour to remain unchanged. Preserve the default Liteque SQLite database at `DATA_DIR/queue.db` and the optional Restate provider; implement Python adapters and workers against their actual contracts. Do not introduce Celery, Redis as a replacement broker, or another queue infrastructure merely to simplify the language migration.

- Inventory all twelve named queues and the separate import worker's database polling against the recorded source revision. Verify payloads, job IDs, priority/delay/group behaviour where applicable, retry/backoff, timeout/concurrency, acknowledgement and crash recovery per provider. Preserve `QueueRetryAfterError` delayed retries without consuming ordinary retry attempts.
- Establish the reference provider from the committed lockfile in an isolated installation. Installed Liteque/better-sqlite3 versions differ from the inspected lockfile; resolve that drift before treating installed internals as the persisted queue protocol.
- Verify legacy-produced jobs with Python consumers in isolated queue databases and Restate services. Candidate workers must not consume original jobs, change live queue state or repeat real external side effects.
- Necessary Restate worker registration and internal RPC transport belong to backend infrastructure and may be implemented and verified in the isolated backend stage. Client-facing APIs remain deferred to the final API stage under [core constraints](core-migration.md).
- The approved [F06 integration principles](isolated-development.md) require one active consumer/scheduler owner per switched workload, reconciliation or draining of in-flight work before transfer, and rollback that preserves valid state without replaying completed effects. Record the provider-specific queue owners and execution/recovery plan before cutover. Design approval does not claim that running workers have switched.
