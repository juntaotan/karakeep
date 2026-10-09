# Single-Agent Isolated Development and Integration

The user requires one agent, preservation of the existing source code, and development/verification of the Python replacement separately before integration. This is parallel preservation of implementations, not parallel agents.

## Protected source and writable candidate

1. Identify the original checkout and existing uncommitted work. Treat its code, tests, dependency files and runtime configuration as read-only references; do not modify, delete, reset or replace them during candidate development.
2. Create or reuse a separate candidate checkout: a Git worktree, separate clone, or suitable copy. Record the actual absolute source/candidate paths and revision relationship. A new branch edited in the original working directory is insufficient. Respect filesystem permissions; if setup needs unavailable authorisation/access, follow human-intervention.md.
3. A worktree created from a commit does not automatically include uncommitted source changes. Record what the candidate contains and do not claim omitted changes were included. Preserve all original work.
4. Keep `refactor_docs/agent-rules/` and `refactor_docs/agent-context/` at the same repository-relative paths in the candidate checkout; do not rename them to `rules/` or `.agent-context/`. Follow the [installation instructions](../README.md) to merge the [migration entry fragment](../AGENTS.migration.md) into the candidate's root AGENTS.md while preserving existing valid instructions/history. All migration progress, reports and handovers live in the candidate's `refactor_docs/agent-context/`; the protected source checkout is not the destination for these updates.
5. Before edits or commands that may write, confirm the working directory and output paths point to the candidate or its isolated test environment. Watch for absolute paths, symlinks, mounts, scripts and shared volumes that would write into the protected source. Do not run formatting, dependency installation, code generation or mutable tests against the original checkout.

Develop Python modules and necessary client, configuration and deployment adaptations in the candidate according to the [approved backend-first, API-last sequence](core-migration.md). Existing files in the candidate may be adapted as required; corresponding original checkout files remain unchanged. Do not merely add disconnected Python files and claim the retained clients are integrated.

## One agent across sessions

Use one agent to investigate, implement, test and review bounded tasks sequentially. Do not start subagents or delegated development tasks. Original TypeScript code remains available for inspection and behavioural comparison; this does not require both services to run concurrently.

Record the development phase in migration-status.md separately from step state and component migration status: Not Started / Isolated Development / Candidate Verification / Ready for Integration / Integrated. Keep the current Step ID and normal command/file/evidence records in the candidate's persistent context.

## Isolated runtime and verification

Use separate ports and isolated test database/asset/queue/search state as applicable, preserving the original engine/provider contracts. Use suitable test copies or fixtures rather than original operational data. Never let candidate workers/schedulers consume the original queue or repeat real external side effects. Do not introduce replacement infrastructure merely for language convenience.

If running the original implementation is needed for comparison and would write files/data, use a separate reference test copy and isolated state rather than the protected checkout. Compare applicable responses, validation, permissions, old-data compatibility, errors, jobs and side effects using controlled inputs. Preserve existing test objectives; follow verification.md and the relevant domain rules. Source inspection and service startup alone are insufficient.

Define the acceptance scope and verify it with actual execution. Candidate verification cannot establish that every possible defect is absent. State untested areas and risks. If verification is incomplete or fails, continue fixing the candidate when authorised; do not integrate to conceal or bypass the gap.

## Integration gate

The user has confirmed module-by-module integration after completion and verification of the internal backend and the subsequent API/OpenAPI/SDK/client/deployment work. Do not merge a backend module early while that preparation is incomplete. Identify each module's required dependency closure and prepare a compatible, reviewable change set; backend-only commits are not an integrated user-facing module if its API or callers remain incompatible. The user has approved the F06 integration and recovery principles below. Concrete module paths, order, routing and execution plans must still be prepared against the actual dependency graph; approval of the principles does not assert that any module is already ready or integrated.

### Approved Module Ownership and Recovery Principles

- Define integration units from actual dependencies and complete user-visible flows. Record each module's backend/API/client/queue/storage/deployment closure and derive merge order from it, rather than assuming a directory is an independently deployable module.
- Use isolated, verified candidate change sets. Integrate only the explicitly authorised reviewed scope; verify each module before advancing. Record code integration separately from live routing/state cutover.
- Assign one authoritative business implementation per responsibility and one active consumer/scheduler owner per switched queue/workload. Quiesce the old owner and reconcile or drain in-flight work before transfer. Record provider-specific ownership, job state and external side-effect handling so that cutover does not produce duplicate writes or task execution.
- Preserve legacy clients during transition. Original routes serve unmigrated responsibilities; migrated responsibilities with supported legacy tRPC callers retain a thin forwarding entry to Python, without duplicate TypeScript business logic. Remove that entry only after supported callers are adapted and their compatibility checks pass; do not invent a calendar expiry.
- Prepare and exercise per-module recovery against isolated state before claiming readiness. Record code/routing versions, queue ownership, reconciliation and persistent-state compatibility. Returning traffic to the original implementation must preserve valid post-cutover writes and avoid replaying completed external effects. Restoring an old snapshot alone is insufficient when it would discard subsequent user changes.
- This design approval does not execute a code merge, remove original services or switch live traffic. Prepare the concrete module report and apply the existing integration instruction requirements below.

Before integration, prepare a concrete report referencing the tested candidate revision, per-file purposes, applicable passing checks, compatibility evidence, unresolved limitations and any source changes that occurred since candidate creation. Include the proposed transfer/merge and routing/deployment changes, persistent-state handling and recovery/rollback conditions appropriate to the scope.

Set phase Ready for Integration only when the applicable candidate acceptance checks passed; this is a preparation state, not evidence that the original runtime has switched or that integration succeeded. Keep component migration categories tied to their stated scope. Do not present a candidate-only result as completed rollout of the running system.

The protected checkout remains unchanged until the user explicitly instructs integration of the reviewed scope. Candidate test success alone is not that instruction. If approval is required, apply human-intervention.md: stop the whole session's development, set the current step Paused — Awaiting Human with a brief reason such as "candidate verified; awaiting integration instruction", save the report/handover and ask for the exact required decision.

After an explicit integration instruction, record the approved scope, inspect the current source state and apply changes only within that scope. Do not discard intervening work or blindly copy a whole candidate directory over the source. Re-run relevant checks after integration and record actual results before setting phase Integrated. Removing the original TypeScript implementation or switching live traffic/data requires applicable authorisation; a merge is not proof of successful production cutover.
