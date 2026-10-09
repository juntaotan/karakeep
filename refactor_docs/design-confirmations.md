# Migration Design Confirmations

This ledger records the user's actual design approvals and the outstanding review questions. It is separate from candidate implementation/session history. A design approval does not prove that a Python component has been implemented, verified or integrated.

Review cadence: The user requested, translated into English: “Confirm two items at a time; continue.” Present two outstanding solutions per review round, retain the confirmed record and outstanding checklist in every response, and record approval separately for each item. Review cadence alone is not approval of a technical solution.

F07–F11 authority: The user confirmed these items together, translated into English: “Keep behaviour consistent. For the remaining items—F07 clients/SSR/cache, F08 deployment, F09 resource/error/configuration contracts, F10 functional scope and F11 acceptance coverage—retain the existing rules unless Python requires replacing a language-specific mechanism, such as tRPC or Drizzle.” Recorded observation: 2026-10-09T09:08:16Z, from the clock tool after reading the instruction. Exact message receipt time: Unknown. This overrides the need for separate confirmation of those five items; preserve existing compatible rules and use necessary Python equivalents for language-specific mechanisms. Design acceptance is not implementation, verification or live deployment evidence.

## Confirmed decisions

### Global — English-only prompt and agent files

- Status: Accepted; language requirements written into core constraints, the entry README and the candidate AGENTS.md fragment.
- Actual user instruction, translated into English: “All prompt and agent files must be written in English. Check for Chinese text and translate it into English.”
- Translate recorded user instructions faithfully, label translated quotations, and preserve approval meaning and scope. Keep future migration prompts, rules, context, handovers and session records in English. This does not change application localization or user-supplied content.
- Verification: Scanned 32 project prompt/agent-related files, including root AGENTS.md, the repository skill, prompt source/types/tests, agent settings and every migration document. Chinese text was confined to seven recorded user quotations in this ledger and one in core constraints; all were translated and labelled. The final scan found no remaining Chinese text. Four migration documents were updated; application source and the original root AGENTS.md remain unchanged.

### Global — Preserve existing business logic; change backend language only

- Status: Accepted; written into the entry and core constraints.
- Actual user answer confirming F03/F04, translated into English: “Agreed: keep the current behaviour. Business logic must remain consistent with the current system; only rewrite the backend in Python.”
- Recorded observation: 2026-10-09T08:58:25Z, from the clock tool after reading the approval. Exact message receipt time: Unknown.
- Preserve actual business rules, existing functionality, authentication methods, provider contracts, validation, errors and side effects. Use the original implementation as the behavioural reference. Python conventions and the already approved REST/OpenAPI/client adaptations may change implementation structure while retaining behaviour; no unrelated feature changes, provider replacement or redesign are authorised.
- This is a design constraint and approval of the presented F03/F04 solutions, not an instruction to start backend development or switch the running system during this documentation review.
- The subsequent blanket F07–F11 decision extends the same preservation rule to clients/SSR/cache, deployment, resources/errors/configuration, actual functional scope and acceptance. Record necessary mechanism replacements and equivalence evidence; a missing Python library is not permission to alter its business rules.

### F01 — Documentation layout and entry point

- Status: Accepted; documentation repair completed.
- Authority: Explicit user approval in the current review conversation.
- Proposed scope: Preserve `refactor_docs/agent-rules/` and `refactor_docs/agent-context/`; repair the ten broken links; add a README with reading order and rule triggers; prepare an additive migration entry for the candidate's root AGENTS.md; add the sessions directory guide; keep future migration records in the candidate checkout.
- Actual user answer, translated into English: “Agreed; apply the repair.”
- Recorded observation: 2026-10-09T08:39:50Z, from the clock tool after reading the approval. Exact message receipt time: Unknown.
- Implementation scope: Design documents and the candidate entry fragment only. Candidate root installation occurs when a candidate checkout is prepared; no application integration is authorised by this decision.
- Implemented: Repaired the original ten broken links; unified rule/context/session locations; added the entry README, candidate root AGENTS.md fragment and session directory guide. Changed nine existing documents and added four documents, including this ledger.
- Verification: All 61 local Markdown link destinations exist; all five repository-relative paths referenced by the candidate entry fragment exist. No legacy location remains as an active record/install destination. The original root AGENTS.md and tracked application files are unchanged.
- Remaining installation step: Merge the prepared fragment into the candidate's root AGENTS.md when a candidate is established. No candidate exists yet; this repair does not claim that installation has already run.

### F02 — Complete interface mapping and OpenAPI generation

- Status: Accepted with the implementation sequence below; requirements written into the rules. Interface mapping and Python implementation have not started.
- Authority: Explicit user approval in the current review conversation.
- Actual user answer, translated into English: “Agreed. Also record this requirement: prepare the replacement without affecting current functionality, write the API last, and merge by module after the backend and all API-related work are complete.”
- Recorded observation: 2026-10-09T08:47:07Z, from the clock tool after reading the approval. Exact message receipt time: Unknown.
- Preserve existing REST paths, methods, request/response formats, statuses and authentication contracts. Differences between legacy runtime behaviour and its existing specification must be recorded rather than silently normalised.
- Inventory all 146 tRPC procedures and every real HTTP entry, including auth, assets, export, public/signed resources, health/version, metrics and Stripe callbacks. Map each responsibility to retained or additional REST operations without assuming one procedure equals one new endpoint.
- Each mapping records its old entry, target method/path, callers, input/output and serialization, authentication/scope/role rules, errors, side effects, and verification objective. Record gaps explicitly; do not invent a completed mapping or implementation.
- Use the Python API implementation to generate the authoritative published OpenAPI artifact. Preserve compatibility with the existing public REST contract and SDK consumers, including schema names used by existing TypeScript clients where required. Generate TypeScript SDK types from that artifact and check artifact/type drift in CI; retire the TypeScript specification generator as the final authority.
- Track non-JSON and authentication-specific contracts alongside their operation schemas where OpenAPI alone does not express the full behaviour. The staged retirement of tRPC and old client support window remains subject to F06; this approval does not authorise immediate protocol removal.
- Required sequence: Preserve current functionality and the original running implementation during isolated preparation. Complete and verify the internal Python backend first. Implement and verify the HTTP API, OpenAPI generation, SDK types and candidate client/SSR/deployment integrations last. Only after this backend and API-related work is ready, integrate by module with its dependency closure and applicable checks. This is the overall preparation sequence, not permission to merge each internal backend module before the API stage.
- Contract investigation/mapping may be prepared before backend completion; client-facing API handlers/scaffolding are deferred. The subsequently approved F04 clarification permits necessary internal Restate worker registration/RPC as backend queue infrastructure. Internal backend verification uses internal calls and isolated provider/data/worker checks, and does not by itself establish Fully Migrated status for API-dependent components.
- Applied documents: Entry README, core constraints, architecture/scope, API/client rules, isolated-development rules, verification gates, session lifecycle and migration-status template.
- Verification: Document checks passed: all 74 local Markdown link destinations exist; the approved sequence is present in the entry/core/API/integration rules and is reflected in lifecycle, verification gates and the status template. This approval changed nine design documents only; the original root AGENTS.md and tracked application files are unchanged. No application implementation, candidate integration or production switch is claimed.

### F03 — Existing authentication and session compatibility

- Status: Accepted; requirements written into authentication and core rules. Implementation and fixture verification have not started.
- Authority: The explicit user answer recorded under the global constraint above, approving the presented F03/F04 round.
- Retain current authentication methods and observable policies: password plus salt, custom OAuth with PKCE/state, email verification/reset and scoped API keys; do not replace the provider or require an unrelated authentication redesign.
- Implement NextAuth v4-compatible cookie/JWE reading, expiry and renewal in Python so currently valid sessions survive the migration. Check secure/non-secure cookie names and chunking, password and ak1/ak2 compatibility, session-only and admin/scope rules using controlled fixtures.
- Treat the current NextAuth v4 encrypted session format as the compatibility target rather than assuming a conventional signed JWT. Preserve key derivation, token lifetime and the existing credential-selection behaviour; verify using controlled legacy-generated fixtures before claiming compatibility.
- During the internal backend stage, implement and verify those primitives without HTTP handlers. During the later API stage, add and verify the authentication HTTP boundary and candidate Web auth client/SSR integration, preserving existing credentials and user-facing behaviour.
- Preserve the original authentication service and live cookies during candidate preparation; final authority transfers to Python only through the applicable reviewed module integration/cutover.
- Applied documents: Authentication rules, core constraints, entry README and this ledger. Documentation verification is recorded below; no running authentication changes are claimed.

### F04 — Existing queue infrastructure and Python worker compatibility

- Status: Accepted; requirements written into worker/core/API rules. Queue implementation, provider verification and traffic switch have not started.
- Authority: The explicit user answer recorded under the global constraint above, approving the presented F03/F04 round.
- Preserve the current default Liteque SQLite queue database at `DATA_DIR/queue.db` and the optional Restate provider. Implement Python provider adapters and workers that retain existing task contracts; introducing Celery, Redis as a new broker, or another replacement queue is outside this proposed migration scope.
- Inventory the twelve named queues and the separate import worker's database polling. Verify payload validation, job identifiers, priority/delay/group behaviour where applicable, retry counts and backoff, timeout/concurrency, acknowledgement and crash recovery against each provider's actual contract. Preserve the special delayed-retry behaviour of `QueueRetryAfterError` without consuming ordinary retry attempts.
- Establish the reference implementation from the committed dependency lockfile in an isolated installation. The current installed Liteque/better-sqlite3 versions differ from the locked versions; do not use those installed internals as the authoritative persistent queue protocol without resolving that drift.
- Verify adapters with isolated queue databases and isolated Restate services, including legacy-produced jobs consumed by Python and recovery/retry cases. Candidate tests must not consume live jobs or modify the original queue state. Follow the subsequently approved F06 ownership/recovery principles and prepare provider-specific execution plans before live cutover.
- Approved stage clarification: Restate worker registration and internal provider RPC endpoints are backend queue infrastructure and may be implemented and verified during the isolated internal backend stage. Client-facing REST/auth/assets/export handlers, OpenAPI and client integrations remain deferred to the final API stage. Applied to the binding core/API/worker rules and entry README.
- Applied documents: Worker rules, authentication rules, core constraints, API/client rules, entry README and this ledger. Verification: All 76 local Markdown link destinations exist; F03/F04 are accepted and removed from the outstanding table, while F05/F06 details remain proposed. The original root AGENTS.md matches its pre-edit hash and tracked application files have no diff. No backend test result or production change is claimed.

### F05 — Existing SQLite schema, encodings and migration history

- Status: Accepted; requirements written into database rules. Persistence implementation, migration runner and database verification have not started.
- Authority: Explicit user answer to the F05/F06 round, translated into English: “Confirmed; continue.”
- Recorded observation: 2026-10-09T09:03:16Z, from the clock tool after reading the approval. Exact message receipt time: Unknown.
- Keep SQLite, existing tables/columns/indexes/constraints and stored data unchanged. Implement SQLAlchemy mappings that preserve integer timestamp seconds versus milliseconds, integer booleans, JSON text, identifier formats, ORM-generated defaults/update timestamps and transaction behaviour. Do not let Python or ORM defaults silently change stored encodings or business semantics.
- Preserve the intentional bookmark mapping: API/domain `createdAt` uses the physical `lastSavedAt` column; the original physical `createdAt` remains first creation (`dbCreatedAt` / exposed `firstCreatedAt`). Verify re-save ordering, filtering and pagination against the original implementation.
- Retain the historical Drizzle SQL migration files and journal as immutable history. Implement and verify a Python migration runner compatible with their actual execution/journal semantics for both existing databases and clean installations; do not regenerate or replay already-applied migrations based only on SQLAlchemy metadata. The final startup must not depend on a TypeScript migrator.
- Compare controlled old-database copies and freshly migrated databases in isolation, including schema, encoding, defaults, relationships, transaction behaviour and representative operations. Document any incompatibility rather than redesigning the schema to hide it. No original operational database is modified by these checks.
- Applied documents: Database rules and this ledger. Document checks are recorded under F06 below; no data migration or backend verification is claimed.

### F06 — Module integration, ownership, client compatibility and recovery

- Status: Accepted; integration/ownership/client-compatibility/recovery principles written into rules. Concrete module inventories and execution plans remain implementation work, not additional unresolved design questions about these principles.
- Authority: Explicit user answer to the F05/F06 round, translated into English: “Confirmed; continue”; recorded observation matches F05 above.
- The backend-first/API-last/module-integration sequence confirmed through F02 remains in effect.
- Define module-sized integration units from the actual dependency graph and user-visible flows, recording their backend/API/client/queue/storage/deployment dependency closure. Set the concrete order after that inventory; do not treat directory boundaries alone as valid modules or merge partially connected responsibilities. All planned backend/API preparation remains complete before the first module integration.
- Prepare isolated, tested candidate change sets. Integrate the explicitly authorised reviewed scope module by module and verify each before advancing. Code merge and live traffic/state cutover are distinct recorded actions; neither is implied by approval of this plan.
- Assign one authoritative business implementation per migrated responsibility and one active consumer/scheduler owner per switched queue/workload. Avoid duplicate writes or external effects. Quiesce the old owner and reconcile or drain its in-flight work before transfer, with provider-specific checks; exact queues and timing are recorded in each module's plan.
- Preserve working legacy clients during transition: retain original routes for unmigrated responsibilities. Where a migrated responsibility still has legacy tRPC callers, retain a thin compatibility entry forwarding to Python without duplicate TypeScript business logic. Remove that entry only after supported callers have been adapted and their compatibility checks pass; use this completion condition rather than inventing a calendar deadline.
- Prepare rollback per module before cutover: record code/routing versions, queue ownership, reconciliation and persistent-state compatibility. Keep the schema compatible with the original implementation; returning traffic to TypeScript must retain valid post-cutover writes and prevent job replay. A pre-cutover snapshot alone is not a safe rollback if it would discard subsequent user changes. Exercise recovery against isolated state before claiming readiness.
- Module-specific paths, routing, deployment execution and user approval of a concrete live cutover remain separate from this design confirmation.
- Applied documents: Isolated-development/integration rules, API/client transition rules, worker ownership/recovery rules, database rules and this ledger. Verification: All 79 local Markdown link destinations exist; F05/F06 are in confirmed decisions and removed from the outstanding table, while F07/F08 remain proposed. Root AGENTS.md matches its pre-edit hash and tracked application files have no diff. No backend test result, candidate integration or production switch is claimed.

### F07 — Client transport, SSR and cache compatibility

- Status: Accepted under the latest blanket preservation instruction above; requirements written into API/client rules. Adaptation and runtime verification have not started.
- Authority: The actual F07–F11 instruction recorded above. Retain original compatible client/SSR/cache policies and change only mechanisms required to connect to the Python backend.
- Retain Next.js/React, React Native and the existing extension/CLI/MCP/SDK implementations. Adapt shared-react hooks, providers and affected callers to the Python REST/OpenAPI contract during the final API stage. Remove client build-time dependence on the TypeScript backend AppRouter by using generated SDK types and client transport/query adapters.
- Preserve query/mutation semantics, pagination, query keys and invalidation, optimistic updates, loading/errors and user-visible behaviour. Replace direct SSR backend callers and backend config/plugin access with Python API data or approved client-safe configuration, forwarding credentials while Python remains authentication/business authority. Preserve prefetch/hydration and browser/server data consistency.
- Preserve existing Date/serialization semantics at the client boundary; JSON strings are not automatically equivalent to the existing Date objects. Verify server rendering, query caches and legacy cache decoding with controlled fixtures.
- Preserve mobile MMKV persisted queries, account/server isolation, offline article/content storage and logout/server-switch cleanup. Prefer existing formats; only use a documented controlled versioned query-cache rebuild if the changed transport makes it necessary, retaining offline library data. Do not silently discard existing offline content or adopt a new cache policy.
- Preserve current offline mutation behaviour: fail promptly and surface the existing error. The inspected implementation does not have a durable offline mutation queue; do not add queued writes or silently mark failed writes successful as part of this migration.
- Prepare candidate client adaptations only after internal backend verification and alongside the final API stage; module integration follows the approved F06 dependency/legacy-caller policy.
- Applied documents: API/client rules, core constraints, entry README and this ledger.

### F08 — Existing deployment capabilities and same-origin routing

- Status: Accepted under the latest blanket preservation instruction above; requirements written into deployment rules. Packaging, deployment verification and live rollout have not started.
- Authority: The actual F07–F11 instruction recorded above. Preserve original deployment capabilities and rules, adapting only mechanisms required for the Python runtime.
- Preserve the existing externally visible same-origin service, default published port 3000, `/data` volume/DATA_DIR contract and existing environment/configuration interfaces. Keep Chrome, Meilisearch, SQLite, queue and storage providers compatible; do not require users to replace infrastructure for the Python migration.
- Retain all-in-one and separate web/workers deployment capabilities and existing s6 supervision. Package Python backend/workers with the required runtime, dependency/build changes and service supervision; add only the internal routing needed to serve Python backend paths and Next.js frontend paths through the existing public origin. Internal ports need not become new public endpoints.
- Prepare a complete route ownership table for API/auth/assets/export/public/operational paths and Next.js rendering, including the F06 temporary compatibility entries. Preserve cookies, forwarded headers, redirects, streaming/upload/range behaviour and callback URLs; do not embed Python business logic in the routing layer.
- Replace the startup TypeScript database migrator with the approved Python historical-migration runner. Preserve migration-before-service-start ordering and separate worker deployment's migration prerequisite; verify startup failure, health checks, process shutdown/restart and task ownership against isolated state.
- Prepare final candidate packaging/routing/deployment integration during the final API stage, then verify clean startup, old-state startup and supported deployment combinations before module integration. Isolated Python runtime needed for earlier internal backend tests remains allowed; original services, published routes and volumes stay untouched during preparation.
- Applied documents: Deployment rules, core constraints, entry README and this ledger.

### F09 — Existing resource, error, configuration and observability contracts

- Status: Accepted under the latest blanket preservation instruction above; concrete compatibility targets written into asset/integration and deployment rules. Contract fixtures and Python verification have not started.
- Preserve existing local/S3 asset layouts and metadata, identifiers, URLs, access rules, legacy signature bytes, range/206/stream/cache/security/MIME/size/quota behaviour. Replace language-specific implementations without rewriting existing assets or invalidating valid signatures.
- Preserve each existing boundary's error/status/validation/business semantics and pagination/version/conflict behaviour; do not normalize all responses to a new Python framework's defaults. Keep external-provider timeout/retry/proxy/fallback behaviour.
- Preserve strict environment parsing/defaults/units, plugin configuration/provider selection, consumed metrics/log/trace fields and access controls/redaction. Build compatibility evidence during the applicable isolated backend/API stages.
- Applied documents: Assets/integrations, deployment and core rules, entry README and this ledger. Authority: The actual F07–F11 instruction recorded above.

### F10 — Scope follows existing functionality and verified implementation

- Status: Accepted under the latest blanket preservation instruction above; scope omissions/overstatements corrected in architecture rules. Complete implementation inventory remains future work.
- Preserve all existing backend functions, including the omitted plugin/provider responsibilities, migration-relevant tools, custom prompts, account/settings/reader flows, public/RSS/wrapped features, SingleFile/video and administrative/runtime capabilities.
- Do not introduce features solely because an imported scope label mentions them. Preserve existing backup/import/operational recovery as distinct workflows; no complete account/ZIP product restore entry was found in the reviewed baseline. Preserve chat data/configuration and investigate actual responsibility; schema/configuration alone does not prove a complete chat feature exists. These are evidence limitations, not permission to remove actual existing functionality.
- Applied documents: Architecture/scope and core rules, entry README and this ledger. Authority: The actual F07–F11 instruction recorded above.

### F11 — Existing verification objectives and accurate acceptance states

- Status: Accepted under the latest blanket preservation instruction above; requirements written into verification rules. No Python verification or completion claim is made.
- Retain the existing test objectives/assertions and acceptance categories. Adapt TypeScript-specific test setup/harnesses only as required for Python; retain compatible client checks and never weaken expectations or report unexecuted checks as passed.
- Trace applicable old assertions/responsibilities to actual Python/REST checks and execution evidence, including data/auth/assets, queues/workers, permissions/errors, clients/SSR/cache, config/deployment and cutover/recovery. Record gaps rather than treating disabled CI or existing test files as passing evidence.
- Keep known incomplete implementation/integration/compatibility as Partially Migrated; use Implemented but Not Verified when implemented scope is complete but sufficient verification is missing. Fully Migrated requires all existing applicable conditions; documentation acceptance is not one of those execution results.
- Applied documents: Verification and core rules, entry README and this ledger. Authority: The actual F07–F11 instruction recorded above.
- F07–F11 document verification: Eight design documents updated; all 81 local Markdown link destinations exist; all eleven findings have an Accepted status and the outstanding list is empty. Root AGENTS.md matches its pre-edit hash and tracked application files have no diff. No backend test result, implementation or live cutover is claimed.

## Unconfirmed questions

None among F01–F11. All design principles are accepted. Concrete module inventories, dependency order, reference fixtures, implementation and actual verification/cutover plans are still work to perform, not newly invented unresolved approvals.

Continue to retain the confirmed record and outstanding checklist in each response. Apply the approved preservation rule to routine implementation decisions without asking again. Record newly discovered incompatibilities and investigate compatible mechanisms first; only an actual unresolved change to business behaviour or another required decision warrants returning to the user. Silence or a proposed default is not approval of such a new change.
