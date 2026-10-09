# Python Backend Migration Entry Point

This directory contains the migration constraints, selective rule-loading index, design confirmations, and candidate migration context. Keep this layout unchanged when preparing a candidate checkout:

```text
refactor_docs/
├── README.md
├── AGENTS.migration.md
├── design-confirmations.md
├── agent-rules/
└── agent-context/
    └── sessions/
        └── README.md
```

All paths in this guide are relative to the repository root unless a Markdown link supplies a relative destination. Do not rename `agent-rules/` to `rules/` or `agent-context/` to `.agent-context/`.

## Scope and authority

The target is a Python backend with the existing TypeScript frontend and clients retained. Technical constraints apply across migration tasks; the session/context procedure in this directory is the workflow called W3 in the imported rules. References to W0–W4 describe the imported document's workflow-independent constraints; they do not select another workflow. The explicitly approved implementation sequence below takes precedence over imported statements that leave the implementation order unspecified.

Explicit user instructions and applicable repository instructions retain their authority. [Design confirmations](design-confirmations.md) record only actual approvals; proposed solutions and unchecked implementation claims are not approvals.

The user has confirmed that existing business logic and functionality must remain consistent: only the backend implementation language changes to Python, with the already approved interface/client adaptations needed for compatibility. Preserve existing authentication and queue providers; migration is not permission to redesign business rules or add/remove features.

All F01–F11 review principles are confirmed in the [design ledger](design-confirmations.md). Existing compatible client/cache/SSR practices, deployment methods, asset/error/configuration contracts and acceptance objectives remain in force. Replace language-specific implementation mechanisms only as required for Python, retaining original business semantics and recording compatibility evidence. This confirms the design; implementation, module inventories and actual verification are separate work.

All project-authored prompt and agent files must use English, including this directory's rules, context, design ledger and future session records. Translate recorded non-English instructions faithfully and identify them as translations. Preserve approval meaning and factual status. Follow the [language requirement](agent-rules/core-migration.md).

Every real session's saved and user-facing report must include separate actual start and end timestamps with time sources. Capture the start at session startup and the end at closure; use UTC ISO 8601 in saved records, and document unavailable recovered timestamps rather than inventing them. See [mandatory session timestamps](agent-rules/session-records.md#mandatory-session-start-and-end-timestamps).

These instructions govern authorised migration investigation, implementation, verification, recovery and integration in the candidate checkout. A documentation review or an explicitly authorised correction to these design documents does not start Python development, initialise candidate migration progress or authorise production integration. Such document corrections may be made in the current documentation checkout within their approved scope; application code, tests, dependencies, runtime configuration and original operational data remain protected during isolated development.

## Approved Implementation Sequence

Preserve the current application's functionality and runtime while preparing the replacement in isolation:

1. Inspect and document the existing contracts, interfaces and verification objectives; prepare the candidate and isolated test state.
2. Complete and verify the internal Python backend: domain services, database access, authentication/session primitives, authorization, providers, workers and scheduling.
3. Write the API layer last, after internal backend verification: HTTP/auth/asset/export/operational endpoints, generated OpenAPI, SDK types, candidate client/SSR adaptations and routing/deployment preparation. Verify the complete API and client flows.
4. After that backend and API-related preparation is ready, integrate by module with the required dependencies and acceptance checks; verify each module before advancing.

Planning an API contract is allowed before implementation. Implementing API handlers early or merging backend modules before the later API work is ready is not. Current live routes, queues, state and external side effects remain under the original implementation during preparation. See the [binding sequence](agent-rules/core-migration.md), [API requirements](agent-rules/api-clients.md), [verification gates](agent-rules/verification.md) and [integration procedure](agent-rules/isolated-development.md).

Approved queue-specific clarification: necessary Restate worker registration/internal RPC is backend infrastructure and belongs to isolated backend verification in step 2. Client-facing API implementation remains step 3.

## Install in the candidate checkout

1. Identify the protected source and a separate writable candidate according to [isolated development](agent-rules/isolated-development.md). Record their paths and revision relationship when the migration session starts.
2. Carry the complete approved `refactor_docs/` directory into the candidate at the same path. A worktree created from a commit does not include untracked or uncommitted source documents automatically; record which approved files were carried over and preserve any valid candidate history.
3. Merge the content of [AGENTS.migration.md](AGENTS.migration.md) into the candidate's root `AGENTS.md`. This is an additive entry fragment: preserve the existing project instructions, resolve material conflicts using the actual authority, and avoid duplicate entry sections. The fragment is not automatically loaded merely because it exists under this filename.
4. Check that the candidate's root `AGENTS.md` points to this README and that all referenced files exist. Before any implementation or mutable verification, confirm the candidate working directory and isolated runtime/data paths.
5. Restore or initialise actual migration context through [session lifecycle](agent-rules/session-lifecycle.md). Do not copy a source template over an already populated candidate ledger or invent completed sessions.

The original checkout's root `AGENTS.md` is not replaced by this installation procedure. Installing the candidate entry is preparation, not integration of application changes or a production cutover.

## Mandatory reading order

At the beginning of each candidate migration session:

1. Read the candidate's root `AGENTS.md`, then this README.
2. Read [core constraints](agent-rules/core-migration.md), [architecture and scope](agent-rules/architecture-scope.md), and [isolated development](agent-rules/isolated-development.md).
3. Read [session lifecycle](agent-rules/session-lifecycle.md), [context maintenance](agent-rules/context-maintenance.md), and [verification and acceptance](agent-rules/verification.md).
4. Restore [migration status](agent-context/migration-status.md) and [session handover](agent-context/session-handover.md). Check the relevant [design confirmations](design-confirmations.md), [decisions](agent-context/decisions.md), [issues](agent-context/known-issues.md), [architecture evidence](agent-context/architecture.md), and selected prior session records before relying on them.
5. Load every additional rule whose trigger applies below. Selective loading does not waive a technical constraint that applies to the task.

## Additional rule triggers

| Task or action | Rules to read |
| --- | --- |
| API contracts, REST/OpenAPI generation, client transport, SDK/MCP, SSR data access | [API and clients](agent-rules/api-clients.md) |
| Login, cookies, sessions, OAuth, passwords, API keys, permissions | [Authentication](agent-rules/auth.md), plus API/client rules where an interface changes |
| Persistence, schema, old data, ORM mapping, transactions, migrations | [Database](agent-rules/database.md) |
| Queue producers/consumers, worker processing, retries, scheduling, recovery | [Workers](agent-rules/workers.md), plus database and integration rules where applicable |
| Assets, signed links, storage, processing, external providers, errors, logs or monitoring | [Assets and integrations](agent-rules/assets-integrations.md) |
| Environment variables, packaging, containers, routing, startup, health or deployment | [Deployment](agent-rules/deployment.md) |
| Candidate verification or integration preparation | Re-read [verification](agent-rules/verification.md) and [isolated development](agent-rules/isolated-development.md); load all rules for the tested responsibilities |
| Assessing a blocker, considering a human decision/resource/approval request, or resuming a pending dependency | [Human intervention](agent-rules/human-intervention.md) |
| Allocating session/command times, file accounting, final records or closing a session | [Session records](agent-rules/session-records.md) and [record directory guide](agent-context/sessions/README.md) |

## Canonical record locations

- Stable constraints: `refactor_docs/agent-rules/`.
- Confirmed design choices and outstanding design questions: [design-confirmations.md](design-confirmations.md).
- Actual candidate architecture, decisions, issues, component/step status and handover: `refactor_docs/agent-context/` in the candidate checkout.
- Completed or early-ended real candidate sessions: `refactor_docs/agent-context/sessions/session-YYYYMMDD-HHMMSS.md`, with a unique suffix on collision.

The current uninitialised context files are scaffolding. This README and the sessions guide are not migration evidence or completed session records. Keep actual implementation, compatibility and verification claims tied to their inspected or tested candidate revision.
