# Shared Migration Constraints

Extracted from the supplied migration document. Applicable requirements remain binding across W0–W4; this split does not prescribe TDD or a migration implementation order.

The migration must preserve Karakeep's existing functionality, behaviour, and external compatibility while replacing its TypeScript-based backend with Python.

The user explicitly confirmed, translated into English: “Keep the existing implementation's behaviour. Business logic must remain consistent with the current system; only rewrite the backend in Python.” The existing implementation is the behavioural reference. Preserve business rules, authentication methods, storage and queue provider contracts, validation, errors and side effects. Python-native implementation and the already approved REST/OpenAPI/client adaptations are permitted only to preserve that behaviour; they do not authorise a feature change, provider replacement or business redesign. Record unrelated existing defects rather than silently correcting them during this migration.

The user subsequently confirmed F07–F11 together: keep the existing client/SSR/cache rules, deployment capabilities, resource/error/configuration contracts, actual functional scope and acceptance objectives. Reuse compatible existing components and policies. Replace language-specific mechanisms only where needed to implement the backend in Python, such as tRPC/Hono transport and Drizzle access, using the already approved REST/OpenAPI and SQLAlchemy replacements. Record the old mechanism, replacement reason and behavioural equivalence evidence. Absence of an identically named Python library is not evidence that its business logic cannot be preserved; no unrelated redesign or weakened acceptance follows from a library replacement.

## Prompt and Agent File Language

The user requires all project-authored prompts and agent instruction/context files to be written in English, including migration rules, design confirmations, handovers and session records. Translate non-English user statements recorded in these files into English and label them as translations rather than verbatim quotations. Preserve their meaning, approval scope and factual status. This authoring rule does not change application localization or user-supplied content. Check new or edited prompt/agent files for Chinese text before completing the change.

The following principles and implementation rules apply consistently to all development workflows. They define the architectural, functional, compatibility, and quality requirements of the migration. The user-approved implementation sequence below takes precedence over the imported workflow-neutral statements about implementation order; it does not mandate TDD, a framework or a Python directory structure.

## User-Approved Implementation Sequence

The user requires preserving current functionality throughout preparation, completing the Python backend before implementing the API layer, and merging by module only after the backend and API-related work are complete. Follow this sequence across the migration as a whole; do not reinterpret it as permission to expose an API or merge each backend module immediately when its internal implementation finishes.

1. **Prepare contracts and isolation.** Inspect the existing behaviour and document procedure/HTTP mappings, data encodings, permissions, errors, side effects and verification objectives. Establish the separate candidate and controlled reference/test state. Contract analysis and mapping documents may be prepared now; implementation of Python HTTP/API handlers is deferred.
2. **Complete and verify the internal Python backend.** Implement domain services, persistence, authentication/session primitives, authorization, providers, workers and scheduling in the candidate. Verify them through internal service calls and isolated integration checks, including the required old-data, token and task compatibility. Do not depend on new REST handlers or the original TypeScript business implementation to represent a finished Python backend responsibility.
3. **Implement and verify the API and its integrations last.** Only after the planned internal backend scope is implemented and its applicable internal checks pass, implement the HTTP boundary, including REST, auth endpoints, assets, exports and operational endpoints. Generate OpenAPI from that implementation, generate SDK types, adapt the candidate clients and SSR, and verify contracts and complete client/system flows. Prepare the corresponding routing and deployment adaptations within the candidate.
4. **Integrate by module after the backend and API-related work are ready.** Prepare reviewable module-sized change sets with their required client, persistence, queue and deployment dependencies. Apply integration within the user's applicable authorised scope after acceptance checks; verify each integrated module before advancing. Do not perform an undifferentiated whole-checkout replacement or leave a module half connected to an incomplete API.

During steps 1–3, the existing application remains served by its original implementation and contracts. Candidate services must not change live routing, modify original operational state, consume original queues or introduce real duplicate external side effects. Client and configuration adaptations belong in the candidate until their module integration gate is satisfied. Read [isolated-development.md](isolated-development.md) for the source/runtime boundaries and integration procedure.

The approved F04 clarification treats Restate worker registration and internal provider RPC transport as backend queue infrastructure. Implement and verify that necessary transport against isolated Restate services in step 2. It does not permit client-facing REST/auth/assets/export handlers, public API scaffolding or client integrations before step 3.

“Internal backend verified” is a prerequisite for API implementation, not a claim that a component is Fully Migrated. API/client-dependent components remain incomplete until their applicable integration, compatibility and verification conditions are satisfied. If a dependency prevents respecting the approved sequence, investigate it and apply [human-intervention.md](human-intervention.md) when an actual change to the requirement needs the user's decision; do not silently implement the API early.

## Functional and Behavioural Preservation

The primary objective is to replace the existing TypeScript backend with Python without changing the intended functionality or observable behaviour of Karakeep.

- Preserve existing user-facing functionality, business rules, validation, authorization decisions, and error-handling semantics.
- Maintain equivalent behaviour across all supported clients, including the web application, mobile application, browser extension, CLI, MCP application, and SDK.
- Internal implementations may be redesigned to follow Python conventions, provided that externally observable behaviour remains equivalent.
- Do not introduce new features, remove existing functionality, or intentionally change business behaviour as part of the migration.
- Incomplete or unsupported functionality must not be presented as successfully migrated.

Functional and behavioural equivalence takes priority over reproducing the internal structure of the original TypeScript implementation.

## Code Quality and Implementation Constraints

Python implementations must be correct, maintainable, and consistent with the target architecture.

- Prefer established Python conventions and best practices whenever practical.
- Maintain clear responsibilities, appropriate module organization, and readable implementations.
- Use Python-native language features and libraries where appropriate without changing existing business semantics.
- Do not use hardcoded responses, empty implementations, or bypassed business logic to represent completed functionality.
- Temporary stubs, adapters, and compatibility layers are permitted when necessary, but must be clearly identified as transitional implementations.
- Avoid unnecessary code duplication and conflicting implementations of the same business rules.
- Do not retain TypeScript as the authoritative implementation of backend functionality that has been declared fully migrated.
- No specific Python design pattern, dependency injection framework, or directory structure is mandatory.

Implementation flexibility is permitted only within the established architectural and compatibility boundaries.

## Scope Control and Change Management

Changes must remain directly related to the backend language migration or necessary compatibility adaptations.

- Limit modifications to the Python migration and changes required to preserve existing functionality.
- Do not introduce unrelated refactoring, feature enhancements, or architectural redesigns.
- Existing defects unrelated to the migration should be identified rather than silently corrected.
- Temporary adapters, compatibility layers, and mixed-language implementations are permitted when necessary during migration.
- Transitional implementations must not be represented as completed migrations unless the target architectural requirements have been satisfied.
- The final target remains a Python backend, with TypeScript retained only for the designated frontend and client-side components.

The migration must not become an opportunity for unrelated system redesign.

## Security and Data Protection

Existing security guarantees must be preserved throughout the migration.

- Maintain existing authentication, authorization, input validation, and resource access controls.
- Preserve user isolation, permission boundaries, and sensitive data protection.
- Do not introduce SQL injection vulnerabilities, unauthorized resource access, or other security regressions.
- Do not hardcode passwords, API keys, tokens, session secrets, or other sensitive credentials.
- Do not expose sensitive information through logs, error responses, or source code.
- Avoid introducing dependencies with known severe security vulnerabilities.
- Security issues introduced by the migration must be corrected.
- Unrelated security architecture redesigns are outside the migration scope.
