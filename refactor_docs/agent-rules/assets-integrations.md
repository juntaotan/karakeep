# Assets, Providers, Errors and Observability

Extracted from the supplied migration document. Applicable requirements remain binding across W0–W4; this split does not prescribe TDD or a migration implementation order.

## Asset Management and Storage Compatibility

The migration must preserve the existing asset storage architecture and access contracts.

- Preserve existing storage infrastructure, file identifiers, storage paths, and asset metadata.
- Migrate asset upload, download, and serving responsibilities to Python.
- Maintain existing asset URLs, HTTP methods, authentication requirements, and access permissions.
- Ensure that previously stored assets remain accessible without requiring changes to their storage structure.
- Preserve existing file-processing behaviour for images, PDFs, screenshots, archives, and other supported assets.
- Do not redesign the storage architecture or introduce alternative storage infrastructure solely for the Python migration.

Internal request routing may be adapted where necessary, provided that existing client-facing resource contracts remain unchanged.

## Dependencies and External Integrations

Language-specific implementation dependencies may be replaced with suitable Python alternatives. Existing infrastructure and external service integrations must remain unchanged.

- Replace TypeScript-specific libraries with Python-compatible alternatives where required.
- Preserve existing database engines, queue brokers, storage systems, search infrastructure, and external service providers.
- Maintain existing integration contracts, configuration semantics, timeout behaviour, retry policies, and error-handling behaviour.
- Do not replace external service providers or introduce new infrastructure solely to simplify the migration.
- Dependency replacements must preserve the original responsibilities and functionality of the components being replaced.
- Any incompatibility arising from a dependency replacement must be explicitly identified.

## Error Handling and Observability

The migration must preserve existing error semantics and operational observability contracts.

- Maintain existing error types, business error semantics, and client-observable error behaviour.
- Preserve existing HTTP error status codes and response contracts for public REST APIs.
- Maintain existing validation failures, transaction rollback behaviour, and worker failure-handling semantics.
- Preserve monitoring integrations and machine-readable logging contracts relied upon by existing components.
- Python logging libraries and internal logging implementations may differ from their TypeScript equivalents.
- Do not remove existing error reporting or monitoring capabilities as part of the migration.

Internal log messages and implementation details do not need to be identical, provided that existing operational contracts remain compatible.

## Approved Concrete Compatibility Targets

F09 is confirmed: reuse existing resource, error, configuration and observability contracts, replacing only language-specific mechanisms required for Python.

- Preserve local `{userId}/{assetId}/asset.bin` plus `metadata.json`, S3 `{userId}/{assetId}` keys and metadata field encodings. Verify old assets without rewriting storage or identifiers.
- Preserve `/api/assets`, `/api/v1/assets` and public/signed asset contracts, permissions, HMAC input bytes/JSON serialization, range/206 responses, caching/security headers, MIME handling, size/quota rules and streaming. Python JSON defaults must not invalidate legacy signatures.
- Preserve errors per existing entry rather than imposing a universal framework response. Map actual validation errors, text HTTP errors, `{error}`, `{code,message}` and legacy tRPC client errors/field errors to their applicable compatibility boundary. Keep statuses and business meaning, including body pagination cursor/contentVersion/ETag/conflict behaviour.
- Preserve external-provider configuration, timeout/retry/fallback and proxy rules. Follow [configuration compatibility](deployment.md) for strict parsing/defaults and plugin-local settings.
- Preserve consumed metric names/labels, metrics access controls, tracing/logging switches, structured event fields and sensitive-data redaction. Python logging internals may differ; retained operational integrations must continue to work.
- Build controlled legacy fixtures for these existing contracts and verify them at the applicable backend/API stages. Listing a target is not evidence of a successful compatibility check.
