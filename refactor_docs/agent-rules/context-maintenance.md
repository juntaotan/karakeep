# W3 Context Maintenance and Evidence

## Responsibilities and update triggers

| File under `refactor_docs/agent-context/` | Responsibility / trigger |
| --- | --- |
| architecture.md | Current architecture, dependencies, flows, baseline tooling; update on significant discovery |
| migration-status.md | Component state plus current Step ID/state and step progress ledger; update on progress, human-intervention stop and supported resumption |
| decisions.md | Significant technical decisions, rationale, consequences, validity and supersession |
| known-issues.md | Unresolved problems, compatibility risks, dependencies, limitations and resolutions |
| session-handover.md | Active task/checkpoint and latest concise continuation instructions |
| sessions/*.md | Append-only final records of actual sessions |

Human intervention stops development for the current session. Record the paused Step ID and brief reason in migration-status.md, detailed evidence/request in the session report, and issue/continuation references in known-issues.md and session-handover.md. Actual answers and approved scope go in decisions.md. Follow [human-intervention.md](human-intervention.md). Keep the request, decision and technical resolution distinct; do not copy full exchanges into every file.

Keep stable instructions in the candidate's root AGENTS.md and `refactor_docs/agent-rules/`; use the [migration entry point](../README.md) for loading triggers. Load additional knowledge by task relevance: architecture for dependencies/boundaries, decisions for prior choices or conflicts, issues for risks/limitations, and selected history for earlier investigation or implementation. Do not rely on the latest handover alone when further context is needed.

## Evidence classification

| Classification | Meaning |
| --- | --- |
| Verified | Supported by cited source/configuration or actual executed verification, limited to what that evidence demonstrates |
| Inferred | Reasonably derived but not fully confirmed |
| Unresolved | Insufficient evidence for a reliable conclusion |

State what was verified: static implementation existence and runtime behaviour are different claims. Source code, tests, Git history, context, and inference establish different aspects; no single source supports claims beyond its limits. Do not promote assumptions without additional evidence.

Reference paths/functions, configuration, commits/diffs, executed checks/logs, or related records concisely. Record tested revision and relevant working-tree scope with verification claims. Apply the shared four migration statuses from [verification.md](verification.md); written code alone is not Fully Migrated.

## Conflict reconciliation

1. Identify conflicting claims.
2. Inspect relevant source, Git history, and available verification evidence.
3. Determine supported conclusions and their limits.
4. Correct inaccurate current-state context and record significant conflicts/resolutions.
5. Preserve completed history; link later corrections and retain why significant decisions were superseded.
6. Mark unresolved discrepancies explicitly. If material to the task, do not rely on disputed claims as established facts.

Context is recorded project knowledge, not an unquestionable source of truth. Never silently overwrite historical evidence or resolve conflicts through unsupported assumptions.

## Concise writing and history growth

Use concise bullets, tables, status fields and evidence references. Record facts, decisions, implementation/results and unresolved work instead of lengthy process narratives. Each file owns its information; use links rather than duplicating extensive code, logs, or history. Current-state files describe latest valid state; keep meaningful supersession references.

Remove redundant current-state material without losing critical constraints, compatibility details, rationale, or risks. No arbitrary file-length limit is imposed. When a topic grows, use an indexed task-specific context file and a short summary; keep completed session history intact and retrieve it selectively. Full conversations/tool transcripts and experimental data belong in separate evaluation artefacts.

Maintain persistent context/history under Git version control in the target project, following its commit policy; this does not require an unsolicited commit after every edit. Do not put credentials or private raw data into committed context.
