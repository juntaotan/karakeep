# W3 Session Lifecycle

Read every session. W3 uses selective context loading, task-based session boundaries, milestone updates, and session-end handover to preserve continuity, accuracy, efficiency, traceability, and consistency.

## Define the session

A migration session is a bounded unit of authorised implementation, investigation, integration, verification, or recovery work. It may span multiple chat turns. A status question, clarification, or automatic context compaction continues the same task; it does not itself create a new migration session. Start a new record when starting a genuinely new session/task or recovering after a real interruption. This definition clarifies the source document's task-based design.

Establish the objective, scope, expected outcome, dependencies, and criteria for completion or early handover. Assign a stable Step ID and record its objective/state in migration-status.md; carry the same ID when a later session resumes unfinished work. Decompose a large task into meaningful subtasks when necessary; do not force the full migration into one session. Tasks must respect the [approved backend-first, API-last, module-integration sequence](core-migration.md); no further fixed order within each approved stage is imposed.

At the first opportunity when a task instruction arrives, record its ID/summary and timestamp in the active handover command ledger. Use a reliable environment-provided receipt timestamp when available; otherwise record Received at UTC: Unknown and separately capture First Observed at UTC from the actual clock, labelled as observation rather than exact receipt. Follow [session-records.md](session-records.md) for time sources, completion and file accounting. Relevant later scope changes and authorisations belong in the same session ledger; they do not automatically create a new session.

## Restore at startup

1. Read the candidate's root AGENTS.md and follow the [migration entry point](../README.md) for the mandatory reading order and additional rule triggers. Read the core migration rules, migration-status.md, and session-handover.md from their documented paths.
   Read [isolated-development.md](isolated-development.md) and confirm the protected source and writable candidate paths before writes or execution. Use one agent; development and persistent records belong in the candidate checkout. Resume its existing context rather than creating progress records in the protected source.
2. Confirm the actual repository, branch, commit, relevant working-tree changes, and available evidence. Preserve existing work; do not assume all changes belong to the previous agent.
   Before the first edit, capture a task-relevant start baseline, including pre-existing dirty/untracked files. Retain enough before/after evidence to distinguish this session's changes, especially when editing an already-dirty file; HEAD-to-current diff alone does not establish session ownership.
3. Check the handover state, active session ID, previous completed record, and recorded baseline. A missing/stale handover, incomplete marker, missing referenced record, or conflicting evidence requires reconciliation. Repository changes alone do not prove interruption.
4. Load task-relevant architecture, decisions, issues, and selected history. Context never substitutes for current code inspection.
5. Capture the actual session start from a reliable clock and persist `Started at UTC` and `Start Time Source`; use that start for the unique `session-YYYYMMDD-HHMMSS` ID, with a unique suffix if needed. Mark the handover Active / Incomplete with `Ended at UTC: In progress`, the objective, loaded rules, current baseline, and next action; retain the prior completed record reference. Do not defer start-time capture until closure or reset it for a continuing turn/context compaction.
6. Check the current step and carried-over human dependencies using [human-intervention.md](human-intervention.md). If the step is Paused — Awaiting Human, resume development only after the required answer/resource/approval exists and is applicable; otherwise preserve/report the waiting state and stop development without switching to another implementation task or duplicating an unchanged request.

## First-session initialisation

When context is absent or explicitly uninitialised, create only missing files and preserve existing valid records. Read architecture/scope rules and inspect enough source, configuration, schema, contracts, clients, auth, workers, assets, and deployment to establish the task's baseline. Do not turn initialisation into a requirement to audit the entire project in one session.

Populate context only from actual evidence. Uninspected areas remain Unresolved; use Not Assessed as an assessment placeholder, not a completed migration category. Never invent a previous session, a migration result, or a passing check. Record actual runtime/tool choices and commands only when established; the document does not select a Python web framework or dependency versions.

## Interrupted-session recovery

Inspect current code, staged/unstaged changes, relevant untracked files, recent Git history, available records, and check artefacts. If a final record exists, reconcile it with the checkout and repair the current handover. If it is missing, document the interruption and missing evidence in the new recovery record; do not fabricate a completed earlier record.

Separate implementation evidence from verification. Old checks do not prove subsequently changed code; run relevant checks when needed to establish current behaviour and report unavailable checks explicitly. Correct inaccurate current-state files, preserve historical records, and mark unresolved conflicts. Resume only from supported conclusions. Recovery may remain partial.

## During work and early handover

Update affected context at meaningful progress, discoveries, decisions, new issues, or issue resolution; avoid journalling every edit. Save the current baseline, changed files, verification summary, outstanding work, and next action at meaningful milestones so an interruption can be recovered.

Maintain a concise file ledger with paths, Added/Modified/Deleted/Renamed type, purpose, command IDs and evidence. Finalise a command's Completed at UTC only when its scoped outcome and applicable acceptance checks are met. If work remains Partial or Blocked, leave completion unset and record the latest checkpoint instead.

Early handover is appropriate when context capacity, unresolved dependencies, unexpected complexity, verification failures, or practical constraints prevent reasonable continuation. Preserve actual partial implementation and failed/unavailable verification. A session ending does not establish successful task completion.

Before treating a blocker as a human dependency, follow [human-intervention.md](human-intervention.md): investigate ordinary technical problems autonomously. When a decision/resource/approval is actually required, stop all development for this session, mark the current step Paused — Awaiting Human with a brief reason in migration-status.md, and record the detailed request in the session report. Persist the report and handover and present the request; do not switch to independent implementation work while waiting.

## Close the session

Read [session-records.md](session-records.md) before closing. Persist in this order:

1. Update affected current-state context with actual results and evidence.
2. Reconcile the file ledger against the start baseline and actual final changes. Capture the actual end from a reliable clock at session closure. Create a unique final session record with separate `Started at UTC` and `Ended at UTC` fields and their time sources, command times, deduplicated file counts, each file's purpose, actual task status and next actions. Follow the documented Unknown/evidence-gap rule only for genuinely unavailable recovered timestamps.
3. Check that both session timestamp fields are present and supported, retain them in session-handover.md with the record link, and mark Handover State Complete only after persistence succeeds. Include the same start/end times in the user-facing completion or early-stop report.

Task status is Completed, Partial, Blocked, or Investigation Only. A Complete handover may describe a Partial or Blocked task. If writing fails, report the failure and leave recoverable state; do not claim a complete handover.

Unexpected termination may prevent closure. The next session must recover from available evidence. These procedures improve recoverability; they do not guarantee persistence after an abrupt process stop.
