# Candidate Migration Session Records

This directory holds records of actual candidate migration sessions. Keep it at `refactor_docs/agent-context/sessions/` in the candidate checkout. This guide is not a session record and does not assert that migration work has begun.

For the entry point and installation procedure, read [the migration README](../../README.md). For the session record template, command timestamps, per-file accounting and closure requirements, read [session-records.md](../../agent-rules/session-records.md). Use [session-lifecycle.md](../../agent-rules/session-lifecycle.md) for startup, interrupted-session recovery and closure.

## Naming and evidence

- Allocate `session-YYYYMMDD-HHMMSS.md` from the actual session start in UTC; add a unique suffix on collision.
- Preserve existing completed records. Put later corrections in a new record with a reference to the earlier evidence.
- Record Unknown when message receipt times, historical baselines or change attribution are unavailable. Do not invent earlier sessions, completed commands or passing checks.
- Keep implementation completion, verification results, component migration status and handover persistence separate.
- Use controlled evidence and concise references; do not commit credentials, private raw data or full tool transcripts.

## Location and closure

Write real migration records in the candidate checkout. Carry approved documentation into that checkout while preserving valid existing history. Explicitly authorised design-document maintenance is recorded in [design confirmations](../../design-confirmations.md); it does not create fictitious candidate implementation history.

At closure, update the affected current-state context, persist the real session record, then update [session-handover.md](../session-handover.md) to reference it. A Complete handover describes successful persistence, not necessarily a completed task or a resolved human dependency.
