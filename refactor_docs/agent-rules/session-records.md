# W3 Session Records and Handover

## Identification and historical integrity

Each completed or early-ended real session produces one independent structured record at `refactor_docs/agent-context/sessions/session-YYYYMMDD-HHMMSS.md` in the candidate checkout, using its start timestamp in UTC. Add a unique suffix on collision; never overwrite another record. Include actual start/end times and the previous relevant session when known. Use None for a first session and Unknown when recovery evidence is missing.

Completed records are append-only. Document later corrections in a subsequent record referencing the original finding. Preserve meaningful technical history, not complete conversations/tool transcripts. Keep full experiment/evaluation artefacts separately. Maintain context and session history under Git version control according to project policy.

## Command timing

Record each actionable task instruction, scope change or authorisation once with a local unique Command ID and concise summary/reference. Routine status questions need not become separate task records. One session may contain several commands; a continued task may reference its original command across sessions.

- Use UTC ISO 8601 timestamps, such as `YYYY-MM-DDTHH:MM:SSZ`, with the precision actually supplied. Record the time source: trusted message/event metadata, clock tool, or system clock. A date alone is not a second-precision timestamp.
- Received at UTC is the actual receipt time only when reliable environment metadata establishes it. If unavailable, write Unknown; record First Observed at UTC when the agent first reads/handles the instruction, explicitly labelled as an observation. Do not substitute the session start, current time at closure, or an inferred timestamp for actual receipt.
- Started Work at UTC records when work on the command begins. Completed at UTC records when its scoped result and applicable verification/acceptance are satisfied; it is separate from the session's Ended at UTC.
- Partial, blocked, cancelled or interrupted commands have Completed at UTC: Not completed / Unknown as appropriate, plus their status and last checkpoint/end time. Investigation-only commands may be completed when the requested investigation result is delivered; that does not establish component migration completion.
- At session close, retain command timestamps in the final record. On recovery, preserve prior evidence and label missing times Unknown. Never invent historical times.
- If elapsed time is reported, state its endpoints and time source. It is wall-clock elapsed time, including waiting; do not describe it as active labour or model compute time. Avoid exact duration claims when endpoints are unknown or clocks are inconsistent.

## File accounting and purposes

Use the actual start baseline and final state, together with recorded edits/commits/diffs, to establish which changes belong to this session. Before editing an already-dirty file, retain an appropriate pre-edit snapshot/diff/hash reference so earlier work can be separated. Do not reset existing work to obtain a clean baseline. Keep private baselines/log artefacts out of committed context when they contain sensitive data.

Report **distinct net-changed files** relative to session start. Multiple edits to one file count once. Added, Modified, Deleted and Renamed categories are mutually exclusive for this count; a rename is one file, showing both paths, even when its contents also change. A file created and removed, or edited and fully reverted, does not contribute to the net count; record reverted/touched work separately if meaningful.

For each counted file, record repository-relative path, category, concise purpose tied to the task, associated command IDs and evidence/verification reference. State what the change achieves, not merely “updated file.” Include relevant untracked/new files. Do not count pre-existing changes, another session's edits or other people's changes as this session's work. If ownership or the start baseline is unavailable, report the count as Unknown or a clearly labelled supported lower bound and record the gap rather than treating the entire working-tree diff as this session's changes.

Separate counts into implementation/test/config/product-doc files and agent rules/context/session-record files, then give the total. This prevents a documentation-only session from appearing to have changed application code. Include the current session record and handover when created/changed; do not count external tool caches or transient scratch files as deliverable project changes. Counts describe scope, not work quality.

## Record template

Use this structure, marking empty sections None or Not applicable. Populate it only with actual work.

```markdown
# Session Record

## Session Metadata
- Session ID:
- Started / Ended at UTC:
- Session Kind: Development / Investigation / Integration / Verification / Recovery
- Previous Relevant Session:
- Recovered Interrupted Session ID (if known):
- Objective / Scope / Expected Outcome / Stopping Criteria:
- Task Status: Completed / Partial / Blocked / Investigation Only
- Step ID / Step State / Progress Reference:
- Session Stop Reason / Stopped at UTC / Time Source (if stopped):
- Repository / Branch / Start and End Commit:
- Execution Mode / Protected Original Checkout / Writable Candidate Checkout:
- Development Phase / Candidate Revision / Integration Instruction and Scope:
- Working-tree State / Uncommitted Files:
- Start Baseline / File-attribution Evidence:
- Loaded Rules / Relevant Context:

## Commands and Timing
| Command ID / Summary or Reference | Received at UTC | First Observed at UTC | Started Work at UTC | Completed at UTC / Status | Time Source / Limits |
| --- | --- | --- | --- | --- | --- |
- Missing receipt/completion evidence remains Unknown; partial work is not completed.

## File Change Summary
- Counting Basis: Distinct net-changed files versus the session start baseline
- Implementation / Tests / Config / Product Docs: Added __ / Modified __ / Deleted __ / Renamed __ / Subtotal __
- Agent Rules / Context / Session Records: Added __ / Modified __ / Deleted __ / Renamed __ / Subtotal __
- Total Distinct Net-Changed Files:
- Reverted/Touched Work or Attribution Limits (if relevant):

| File Path (old -> new for rename) | Category | Purpose / Result | Command IDs | Change Evidence / Verification |
| --- | --- | --- | --- | --- |

## Completed Work

## Technical Findings
- Verified / Inferred / Unresolved, with evidence and limits.

## Technical Decisions
- Decision IDs, rationale and references, or None.

## Verification Results
| Check / command | Environment / tested revision and scope | Executed at UTC | Actual result | Evidence / limits |
| --- | --- | --- | --- | --- |
- Passed / Failed / Incomplete / Not Run / Unavailable; state untested acceptance gaps.

## Unresolved Issues
- Blocker type and scope; pending human request IDs, stopped session/step and resumption conditions.

## Human Intervention Stop (if applicable)
- Step ID / Brief Stop Reason / Stopped at UTC and Time Source:
- Evidence / Attempts and Actual Results:
- Options and Consequences / Recommendation:
- Exact Required Decision / Resource / Approval:
- Request Reference / Resumption Condition:
- Progress Updated: migration-status.md marks this step Paused — Awaiting Human
- Task Status: Blocked; unfinished commands remain not completed

## Next Actions

## References
- Paths/symbols, configuration, commits/diffs, checks, issue/decision IDs and relevant sessions.
```

## Latest handover

Keep session-handover.md concise: current objective and actual status; significant completed work; remaining implementation/integration/verification; unresolved issues/dependencies; concrete recommended next actions; source and session-record references. Include the active ID, available baseline, loaded rules, and the previous completed record while work is active.

While active, preserve the command timestamps/time sources and concise file ledger at meaningful milestones. At closure, link the final record for full per-file purposes and counts; do not duplicate its entire table into the handover.

For human dependencies, include the actual request and approved answer/scope when available, issue references, stopped session/step, brief reason and resumption conditions. Update migration-status.md to Paused — Awaiting Human and link this report. Apply [human-intervention.md](human-intervention.md): all current-session development stops while awaiting input; do not confuse handover Complete with a human answer, task completion or issue resolution.

Update current state, write the final record, then mark the handover Complete and link it. Complete describes persistence, not task success. A partial task must remain Partial. If abruptly interrupted, the next real recovery session records supported reconstructed state and missing evidence; never invent earlier outcomes or silently backfill completed history.

The template guide at [sessions/README.md](../agent-context/sessions/README.md) is not itself a session record.
