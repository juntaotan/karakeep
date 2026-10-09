# Verification, Traceability and Acceptance

Extracted from the supplied migration document. Applicable requirements remain binding across W0–W4; this split does not prescribe TDD or a migration implementation order.

Shared requirements do not prescribe a tracking format for every workflow. When using W3, the selected session/context procedures in AGENTS.md remain binding; the workflow-neutral traceability clause below does not make W3 records optional.

## Testing and Verification Requirements

All migrated functionality must satisfy the existing functional, behavioural, and compatibility requirements.

- Existing tests must not be removed, disabled, or weakened solely to conceal implementation failures.
- TypeScript backend tests may be modified or rewritten in Python when required by the migration.
- Test modifications must preserve the original verification objectives and behavioural assertions.
- Reported verification results must be supported by actual execution evidence.
- Tests that have not been executed must not be reported as passed.
- Failed, incomplete, or unavailable verification must be explicitly identified.
- Implementation completion and successful verification must be distinguished.

These requirements define verification integrity and acceptance expectations. The [user-approved sequence](core-migration.md) requires applicable internal backend verification before API implementation, followed by API/client/system verification before module integration. Within those gates, no specific TDD method or test-writing order is prescribed.

## Stage Gates Without Weakening Final Acceptance

- Before API implementation, record the planned internal backend responsibilities, their Python implementations and the actual internal verification results. Use internal calls and isolated provider/database/worker checks rather than writing HTTP handlers early or claiming that source inspection proves behaviour.
- Before module integration, the internal backend and subsequent API/OpenAPI/SDK/client/SSR/deployment preparation must be complete for the approved migration scope, with applicable contract and full-flow checks passed. Validate that the current original implementation has remained protected throughout candidate preparation.
- After each authorised module integration, re-run its applicable integration and compatibility checks before advancing to the next module. Include shared dependencies and the supported behaviour of modules still on their previous implementation; a successful merge alone is insufficient.
- These are implementation/integration gates, not additional component migration categories. An internally verified service with pending required API/client integration is not Fully Migrated. Source/candidate/live integration states remain distinct.

## Migration Traceability and Status Accuracy

Migration status must accurately reflect the implemented and verified functionality.

- Completed migration claims must be traceable to the corresponding Python implementation.
- Verification claims must be supported by actual execution evidence.
- Partially migrated, unverified, and unsupported functionality must be explicitly identified.
- Temporary implementations must not be represented as completed migrations.
- No specific progress tracking tool, documentation format, or update frequency is required.

The migration status must remain consistent with the actual state of the implementation.

## Migration Completion and Acceptance Criteria

A backend component may be considered **Fully Migrated** only when all applicable acceptance conditions have been satisfied.

These conditions include:

1. **Python Implementation:**  The component's backend responsibilities have been implemented in Python.
2. **Architectural Compliance:**  The implementation follows the defined Python backend architecture and applicable technology requirements.
3. **Integration Compatibility:**  Required client and system integrations have been adapted and remain functional.
4. **Behavioural Preservation:**  Existing functionality, permissions, error semantics, and data-processing behaviour remain equivalent.
5. **Dependency Replacement:**  The migrated component no longer relies on its original TypeScript backend implementation to perform the relevant business functionality.
6. **Successful Verification:**  Appropriate verification has been executed successfully, with supporting evidence.

Acceptance conditions apply according to the actual responsibilities of each component. Components without database, API, or client dependencies are not required to satisfy irrelevant integration conditions.

Migration status must distinguish between:

|Status|Definition|
| --------| ------------------------------------------------------------------------------------------------|
|**Fully Migrated**|Implementation, integration, compatibility, and verification requirements have been satisfied.|
|**Partially Migrated**|Only part of the required implementation or integration has been completed.|
|**Implemented but Not Verified**|The implementation is present, but sufficient successful verification evidence is unavailable.|
|**Not Migrated**|The original backend responsibilities have not yet been migrated to Python.|

A component must not be classified as Fully Migrated solely because its Python code has been written or its service can start successfully.

## Approved Preservation of Existing Acceptance Objectives

F11 is confirmed: retain the existing verification rules, assertions and acceptance goals. Adapt language-specific test harnesses only where required for Python; do not change expected business behaviour to make tests pass.

- Map existing assertions and each migrated procedure/HTTP/worker responsibility to its Python or REST checks, recording inputs, expected results, side effects, permissions/errors, execution evidence and gaps. A test-name match is not assertion equivalence.
- Replace necessary TypeScript-specific setup, including createCaller/Drizzle and tRPC-based REST E2E user/key provisioning, with equivalent isolated setup. Preserve unchanged client tests where compatible. Rewritten setup must not skip the original behaviour under test.
- Cover applicable old-database/migration, asset/signature, cookie/key, authorization/negative, queue/retry/recovery, worker flow, client/SSR/cache, configuration, deployment and cutover/rollback objectives. Use isolated state/controlled fixtures against retained providers, avoiding real duplicate external side effects.
- Record actual executed checks and results. Existing disabled/commented CI steps, test files or a service startup are not passing evidence; report unavailable or incomplete checks honestly. Update only the necessary candidate test/CI tooling for Python and retain compatible existing checks.
- Keep the existing four migration categories. Known incomplete implementation or compatibility/integration gaps take precedence as Partially Migrated; Implemented but Not Verified applies when the implementation scope is complete but sufficient successful execution evidence is missing. Fully Migrated still requires all applicable conditions above. This clarifies the existing categories without weakening acceptance or adding a new tracking scheme.
