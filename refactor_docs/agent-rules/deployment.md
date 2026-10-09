# Configuration and Deployment

Extracted from the supplied migration document. Applicable requirements remain binding across W0–W4; this split does not prescribe TDD or a migration implementation order.

## Configuration and Deployment Compatibility

Existing configuration interfaces and deployment capabilities must remain compatible with the migrated system.

- Preserve existing environment variable names, meanings, and default behaviour.
- Maintain compatibility with existing database, queue, storage, authentication, and external service configurations.
- Preserve existing deployment methods and operational capabilities.
- Dockerfiles, container images, build scripts, and startup commands may be modified as necessary to support the Python runtime.
- Do not introduce unrelated infrastructure changes or redesign the deployment architecture.
- Necessary runtime-specific configuration changes must be explicitly identified.

Internal deployment implementations may change where required by Python, but existing configuration contracts and deployment capabilities must be preserved.

## Approved Existing Deployment and Configuration Contracts

F08/F09 are confirmed: reuse existing deployment methods and configuration rules, adapting only mechanisms required for the Python backend.

- Preserve the public same-origin URL, default published port 3000, `/data`/DATA_DIR contract, all-in-one and separate web/workers capabilities, and s6 supervision. Preserve Chrome, Meilisearch, SQLite, queue/storage providers and existing external integrations.
- Add the necessary Python runtime/build/dependencies and internal routing without requiring new public endpoints. Record ownership of API/auth/assets/export/public/operational paths and Next.js rendering, including temporary legacy entries. Preserve forwarded headers/IP, cookies, callback URLs, redirects, uploads, streaming and range requests.
- Use the approved Python historical-migration runner and preserve startup dependencies: database migration before dependent services; separate workers require an already migrated database. Verify startup failure handling, health, shutdown/restart and queue ownership in isolation.
- Preserve strict configuration parsing, including accepted boolean strings, empty versus missing values, defaults, units, URL normalization, cross-field validation and provider selection. Include plugin-local settings as well as shared settings. Do not substitute a Python configuration library's defaults for the original rules.
- Final packaging/routing/deployment integration belongs to the final API stage; isolated runtime for earlier backend verification is permitted. Existing live services, routes and operational volumes remain protected during preparation.
