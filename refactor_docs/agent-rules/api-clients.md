# API and Client Compatibility

Extracted from the supplied migration document. Applicable requirements remain binding across W0–W4; this split does not prescribe TDD or a migration implementation order.

## API Compatibility and Contract Management

The Python backend must expose REST APIs, with OpenAPI serving as the authoritative interface contract between the backend and its clients.

**Existing REST APIs must remain backward-compatible.**

- Preserve existing REST API URLs, HTTP methods, request parameters, response structures, status codes, and authentication behaviour.
- Replace existing tRPC procedures with REST endpoints while preserving their original business semantics.
- Adapt affected TypeScript clients to communicate with the Python REST backend.
- Follow a **code-first approach**, in which OpenAPI specifications are generated from the Python API implementation.
- Ensure that generated OpenAPI specifications accurately describe the implemented endpoints, request and response schemas, authentication requirements, and error responses.
- Do not retain backend business logic in Next.js or other TypeScript clients as a substitute for migrating it to Python.

The final client communication target is REST/OpenAPI; tRPC is not required as the final protocol. The approved F06 transition policy retains thin compatibility entries for supported legacy callers until they are adapted and their checks pass. Corresponding functionality and client behaviour must remain equivalent throughout that transition.

## Complete Contract Inventory and Generation

The user has approved a complete interface mapping rather than treating the existing REST specification as the full backend scope.

- Inventory every existing tRPC procedure and actual HTTP entry, including authentication, assets, exports, public/signed resources, health/version, metrics and provider callbacks. The inspected baseline has 18 tRPC groups and 146 procedures; recheck that inventory against the candidate's recorded source revision if it changes.
- Map each responsibility to a retained or additional REST operation. Reuse compatible existing operations where appropriate; one procedure does not necessarily require one new endpoint. Keep gaps explicit.
- For each mapping, record the old entry, target method/path, callers, input/output and serialization, authentication/scope/role rules, error/status contracts, side effects and verification objectives.
- Preserve existing public REST behaviour. If the old implementation and its specification disagree, record the discrepancy and resolve its intended contract through evidence and the applicable decision process; do not silently normalise it to the new framework's defaults.
- Generate the published authoritative OpenAPI artifact from the Python API implementation. Generate TypeScript SDK types from that artifact and check specification/type drift in CI. Retire the TypeScript OpenAPI generator as the final contract authority once the Python generation pipeline is in place. Preserve externally consumed schema/type identifiers where required for compatibility.
- Document multipart/binary transfers and authentication-specific lifecycle behaviour alongside operation schemas where OpenAPI cannot fully express the observable contract.

## Deferred API Implementation

Follow the [user-approved sequence](core-migration.md): contract investigation and mapping documents may precede backend implementation, but Python HTTP handlers and API scaffolding are written only after the planned internal backend scope has been implemented and its applicable internal verification has passed. Authentication/session primitives and domain validation are backend work; their HTTP endpoints, transport validation, serialization and error adapters belong to the later API stage.

The approved exception is necessary Restate worker registration and internal provider RPC transport, which is backend queue infrastructure verified in isolation during the backend stage. It does not authorise early client-facing API handlers or scaffolding.

In that later stage, complete the API, OpenAPI generation, SDK types, affected candidate client/SSR adaptations and applicable contract/end-to-end verification before module integration begins. Existing users continue using the current TypeScript backend and routes during candidate preparation. Do not delete existing tRPC routes, change live URLs or switch the original clients merely because an internal Python service is ready. Follow the approved [F06 integration policy](isolated-development.md): preserve original routes for unmigrated responsibilities, forward supported legacy calls to Python for migrated responsibilities, and remove compatibility entries only after caller adaptation and verification. Inventory the supported caller versions and concrete routes in each module's cutover plan; no fixed calendar retirement date has been approved.

## Approved Existing Client, SSR and Cache Rules

F07 is confirmed under the user's requirement to reuse existing compatible rules and change only mechanisms required for Python.

- Retain existing frontend/client frameworks and UI behaviour. Adapt shared-react hooks/providers and affected callers during the final API stage; generated OpenAPI/SDK types and transport adapters replace build-time dependence on the backend AppRouter.
- Preserve query/mutation semantics, pagination, cache keys/invalidation, optimistic updates, loading and error behaviour. Preserve SSR prefetch/hydration while replacing direct TypeScript backend callers with Python API calls. Forward credentials; Python performs backend authentication and business decisions. Obtain server-side backend capability/configuration data through Python or genuinely client-safe configuration.
- Preserve Date and serialization semantics at client boundaries and in existing persisted caches; ordinary JSON date strings are not automatically equivalent to Date objects.
- Keep mobile MMKV persistence, server/account isolation, offline article/content storage and logout/server-switch cleanup. Prefer existing cache formats; if the changed transport requires a versioned query-cache rebuild, document the necessity and retain offline library content and isolation.
- Keep current offline write behaviour: fail promptly and show the existing error. Do not introduce durable queued writes; the inspected baseline has no offline mutation queue.
- Verify retained client behaviour and compatibility entries under the existing acceptance objectives. Client adaptation does not authorise a new user flow or cache policy.
