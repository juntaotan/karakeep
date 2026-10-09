# Migration Status

- Initialisation: Uninitialised
- Repository / Branch / Commit / Working-tree Baseline: Not assessed
- Last assessed at UTC / Session: None

## Development location and phase

- Execution Mode: Single agent
- Protected Original Checkout / Source Revision: Not identified
- Writable Candidate Checkout / Candidate Branch and Revision: Not created or inspected
- Candidate Runtime / Test-data Locations: Not established
- Development Phase: Not Started
- Approved Implementation Sequence: Internal backend and verification → API/OpenAPI/SDK/client/deployment work and verification → module-by-module integration; see [core migration rules](../agent-rules/core-migration.md).
- Current Sequence Stage / Stage-Gate Evidence: Not Started / None
- Candidate Verification / Integration Report: None
- Integration Instruction / Approved Scope: None

Use Not Started / Isolated Development / Candidate Verification / Ready for Integration / Integrated for development phase; these do not replace component migration categories or current step state. Keep this file and all session context in the candidate checkout. Original source remains read-only until an explicit integration instruction for the reviewed scope. See [isolated-development.md](../agent-rules/isolated-development.md).

Track the current approved sequence stage and its actual gate evidence separately from development phase, step state and component migration status. Internal backend verification does not establish API/client completion or readiness for integration. The recorded sequence is a design requirement; the None evidence above does not assert that any implementation stage has started or passed.

## Component ledger

| Component / responsibility | Migration status | Implementation evidence | Integration / behaviour / dependency gaps | Verification result and evidence | Revision / session | Next action |
| --- | --- | --- | --- | --- | --- | --- |

Populate from the actual checkout. Not Assessed is an assessment placeholder, not a fifth migration status. Formal states are Fully Migrated, Partially Migrated, Implemented but Not Verified, and Not Migrated; definitions and acceptance are in [verification rules](../agent-rules/verification.md).

Track checks independently as Passed, Failed, Incomplete, Not Run, or Unavailable, with command/procedure, environment, execution time, tested revision and scope, evidence and limits. No migration or passed verification is asserted by this template.

## Current task

Not started. Initialise the relevant baseline in the first authorised migration session; see [handover](session-handover.md).

## Current step and stop state

- Step ID / Objective: None; no real migration step recorded
- Step State: Not Started
- Active / Latest Session ID and Report Reference: None
- Stopped at UTC / Time Source: Not applicable
- Brief Stop Reason: None
- Required Human Decision / Resource / Approval: None
- Related Issue / Request Reference: None
- Resumption Condition / Resumed at UTC and Evidence: Not applicable
- Next Action: Establish a bounded authorised step from the actual checkout

Use Not Started / In Progress / Paused — Awaiting Human / Completed for step state. These describe execution steps, not new component migration categories. At human intervention, stop session development and mark the current step Paused — Awaiting Human with a brief reason; link the detailed session report. Do not mark the step Completed or advance to another implementation step while waiting. After the required input arrives and is applicable, record it and update the step to In Progress before resuming.

## Step progress ledger

| Step ID / Objective | Step State | Last Updated at UTC / Source | Result or Brief Stop Reason | Issue / Human Request | Session Report | Next Action / Resumption Condition |
| --- | --- | --- | --- | --- | --- | --- |

Populate only for actual defined steps. Preserve completed steps and update the current step as work proceeds; this is a progress index, not a prescribed implementation sequence. Keep full investigation, command times, per-file purposes and verification detail in the linked session report.
