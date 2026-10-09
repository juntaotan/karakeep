# Session Handover

## Continuity

- Initialisation State: Uninitialised
- Handover State: No migration session recorded
- Active Session ID / Started at UTC: None
- Latest Completed Record / Previous Relevant Session: None
- Repository / Branch / Commit / Working-tree Baseline: Not assessed
- Loaded Rules / Relevant Context: None
- Last Updated at UTC: None
- Execution Mode / Protected Source / Writable Candidate: Single agent / Not identified / Not established
- Development Phase / Integration Instruction: Not Started / None

## Objective and actual task status

No migration session has started. Establish the actual checkout and a bounded authorised task.

- Current Step ID / State / Progress Reference: None; see [migration-status.md](migration-status.md)
- Session Stop Reason / Stopped at UTC and Time Source: Not applicable

## Significant completed work and verification

None asserted. This is documentation scaffolding, not implementation or runtime evidence.

## Active command times and file checkpoint

No commands or changes recorded in this template. During a real session maintain:

| Command ID / Summary | Received at UTC / Source | First Observed at UTC / Source | Started Work at UTC | Completed at UTC / Status |
| --- | --- | --- | --- | --- |

- Start Baseline / Pre-existing Changes / Attribution Evidence:
- Latest Checkpoint at UTC / Time Source:
- File Ledger: path, change category, purpose and related command IDs; link a concise checkpoint if needed
- Final File Counts and Per-file Purposes: link the completed session record at closure

Use Unknown when exact receipt evidence is unavailable; first observation is not exact receipt. Keep completion unset for unfinished work. Count only this session's distinct net changes, excluding pre-existing edits; see [session-records.md](../agent-rules/session-records.md).

## Outstanding work / unresolved issues

Target baseline and component status remain unassessed. Inspect relevant source and configuration; do not rely on imported overview claims as verified facts.

## Next actions

Read the candidate's root AGENTS.md and the [migration entry point](../README.md); restore mandatory context and load all applicable task rules. Initialise only from evidence, mark the active session, and preserve checkpoints at meaningful milestones.

Before development, follow [isolated-development.md](../agent-rules/isolated-development.md): use one agent and a separate writable candidate checkout, preserve the original source, and keep context/results in the candidate. Before candidate verification/integration, check isolated runtime/data and recorded approval scope.

## Pending human intervention

None recorded in this template. For each actual dependency, retain:

- Issue ID / Request Reference:
- Required Decision / Resource / Approval:
- Intervention State: Waiting for Human / Answered
- Stopped Session / Step ID / Brief Reason:
- Allowed While Waiting: State preservation and request/report preparation only; no migration development
- Actual Answer and Approved Scope (if received):
- Resumption Condition / Next Action:

When human intervention is required, stop development for the entire current session, save its report and mark the current step Paused — Awaiting Human in migration-status.md with a brief reason. Do not resume or switch to another implementation step without the required input. Preserve unchanged pending requests across sessions; an answer does not itself resolve the implementation issue.

## Recovery and closure

Retain the previous completed record while Active / Incomplete. At closure, update current state, create the actual record, then mark the handover Complete. Record task success separately. Missing/inconsistent records require recovery from evidence.

## References

- [Session lifecycle](../agent-rules/session-lifecycle.md)
- [Migration status](migration-status.md)
- [Issues](known-issues.md)
- [Human intervention](../agent-rules/human-intervention.md)
