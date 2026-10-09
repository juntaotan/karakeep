# Architecture and Migration Scope

Extracted from the supplied migration document. Applicable requirements remain binding across W0–W4; this split does not prescribe TDD or a migration implementation order. Descriptions of the current architecture and repository paths are imported claims, not verified facts about the target checkout. Tables define target responsibilities, not mandatory Python directory names.

# Development guidelines

## Development Target

The objective of this project is to migrate Karakeep's TypeScript-based backend to Python while preserving the existing frontend applications, client integrations, and user-facing functionality.

The migration covers backend business logic, database persistence, authentication and authorization, background workers, scheduled tasks, and server-side integrations.

The existing TypeScript-based clients will be retained. Their communication with the backend must be adapted where necessary to maintain compatibility with the new Python services.

The migration should be performed incrementally, with functional equivalence and architectural consistency maintained throughout the process. The approved sequence is to complete and verify the internal Python backend in isolation, implement and verify the API and its client/deployment integrations last, then integrate by module. Incremental integration does not authorise early API implementation or module merges before these preparation gates. See [core migration sequence](core-migration.md) and [design confirmations](../design-confirmations.md).

## Development boundaries

### Architectural Boundaries

The migration aims to replace Karakeep's TypeScript-based backend with Python while preserving the existing frontend applications and client-side functionality. Python will become the primary language for all server-side responsibilities, including API handling, authentication, session management, business logic, database persistence, background processing, and asset serving.

The existing architecture contains three closely connected layers:

- **Next.js:**  Currently handles frontend rendering alongside server-side responsibilities, including HTTP API hosting, authentication, session handling, server rendering, and exports. After migration, Next.js will remain responsible for frontend presentation and rendering, while backend responsibilities will be transferred to Python.
- **tRPC:**  Currently contains a substantial portion of the application's business logic, including validation, permissions, domain operations, search, rules, and integrations. These responsibilities will be migrated to Python and exposed through REST APIs.
- **Workers:**  Currently share database access and backend packages with other server-side components. Their responsibilities include crawling, AI processing, indexing, imports, backups, and scheduled tasks. These responsibilities will be migrated to Python.

The target architecture establishes a clear separation between frontend and backend responsibilities.

|Component|Current Responsibility|Target Responsibility|
| -----------------| ---------------------------------------------------------------------------------| ------------------------------------------------------------------------------|
|Next.js|Frontend rendering, SSR, API routes, authentication, and server-side operations|Frontend presentation, routing, and rendering|
|tRPC|API procedures, validation, permissions, and business logic|Replaced by Python business logic exposed through REST APIs|
|Hono / HTTP API|HTTP routing and REST endpoints|Python REST API implementation|
|Database Layer|Drizzle ORM and TypeScript-based persistence|SQLAlchemy-based Python persistence|
|Authentication|TypeScript-based authentication and session handling|Python-based authentication, authorization, and session management|
|Asset Services|Asset uploads, downloads, and serving|Python-based asset handling and serving|
|Workers|TypeScript-based background processing and scheduling|Python-based background processing and scheduling|
|Shared Packages|Shared frontend and backend utilities, types, and validation|Client-side utilities remain in TypeScript; backend utilities move to Python|

**Next.js may retain server-side execution where required for frontend rendering, but it must not retain application business logic, authentication authority, session management, persistence, or other backend responsibilities.**  Server-side rendering must obtain backend data through the Python API.

### API and Client Integration Boundaries

The migration will replace the existing tRPC-based communication model with **REST APIs defined through OpenAPI**.

Python will implement the REST API, while OpenAPI will define the communication contracts between the backend and its clients. Existing TypeScript clients will be adapted to consume these APIs without changing their underlying presentation frameworks or user-facing functionality.

The migration covers the following client integrations:

|Client|Current Connection|Migration Boundary|
| --------------------------| ---------------------------------------------------------------| ------------------------------------------------------------------------------------------------------------------------|
|Web Browser|tRPC, authentication endpoints, asset requests, and exports|Preserve React/Next.js UI; migrate backend communication to REST APIs, including authentication, assets, and exports|
|Next.js Server Rendering|Direct backend procedure calls|Replace direct TypeScript backend calls with Python REST API requests|
|Mobile|tRPC, API keys, asset endpoints, and health/version endpoints|Preserve React Native functionality, native integrations, and offline behavior; adapt backend communication to REST|
|Browser Extension|tRPC, API keys, and direct asset uploads|Preserve extension functionality, including background scripts and capture workflows; migrate backend requests to REST|
|CLI|tRPC, REST, and asset requests|Retain the TypeScript CLI while replacing backend-dependent communication with Python REST APIs|
|MCP Application|REST/OpenAPI|Retain the existing implementation where compatible with the new API contracts|
|SDK|REST/OpenAPI|Retain the TypeScript SDK and adapt it only where required by the new API contracts|

The API boundary includes authentication, authorization, session handling, request validation, response serialization, asset transfers, and error handling.

**OpenAPI will serve as the authoritative specification for client-server communication.**  Existing API behavior and externally observable contracts should be preserved wherever possible to minimize disruption to existing clients.

### Functional Boundaries

The migration covers the complete backend functionality of Karakeep rather than only its core bookmarking features.

The functional scope includes:

|Functional Area|Migration Scope|
| ----------------------------------| -----------------------------------------------------------------------------|
|Bookmark Management|Bookmark creation, retrieval, updates, deletion, organization, and metadata|
|Tags and Lists|Tag management, list management, and related business rules|
|Collaboration|Sharing, collaboration, and invitation workflows|
|Reading Features|Highlights, reading progress, and related state management|
|Crawling and Archiving|Web crawling, content extraction, archiving, and associated processing|
|Document Processing|OCR, PDF processing, and document-related workflows|
|AI Features|AI tagging, summarization, and related integrations|
|Search|Full-text search, semantic search, indexing, and retrieval|
|Feeds and Rules|Feed processing, automation rules, and scheduled execution|
|Import and Export|Data import, export generation, and related processing|
|Backup Services|Existing backup generation, download, retention and scheduling; preserve verified operational recovery without inventing a new product restore flow|
|Webhooks|Webhook processing and external integrations|
|Administration|Administrative operations, configuration, and management|
|Authentication and Authorization|Authentication, session management, permissions, and scoped API keys|
|Subscription Features|Optional subscriptions, quotas, and related backend operations|
|Asset Management|Asset uploads, storage access, downloads, and serving|
|Background Processing|Asynchronous jobs, task execution, and scheduling|

All backend implementations of these features fall within the Python migration boundary.

### Approved Actual-Functionality Inventory

F10 is confirmed under the user's instruction to retain existing logic/rules. The source implementation and its actual supported workflows determine scope; broad imported feature labels are not permission to create missing features.

- Include existing custom prompts, account/email/invitation flows, user/reader settings and avatars, wrapped statistics, public lists/RSS, SingleFile/video processing, administrative maintenance and runtime capability/configuration exposure. Trace each to its actual backend responsibility and callers.
- Include provider/plugin implementations for queue, search, vector storage and rate limiting, as well as migration-relevant tooling such as `tools/seed-snapshot`. Retain compatible infrastructure and client tooling; rewrite backend mechanisms only where Python requires it.
- The inspected baseline contains backup creation/download/retention and Karakeep JSON import, but no complete account/ZIP product restore entry was found in the reviewed routes/workers/parsers. Keep these existing workflows distinct. Preserve verified operational recovery; mark any unverified restore claim as unverified rather than implementing a new feature from the table label.
- Chat schema/configuration exists, but a complete chat application/API workflow was not found in the reviewed entry points. Preserve its existing data/configuration and verify actual responsibility before assigning scope; do not manufacture a chat feature or claim unsupported functionality is migrated.
- Record uncertain implementation coverage with source evidence and continue investigating. A missing dependency or identically named Python library does not permit silently dropping existing functionality or changing business rules.

Existing frontend interfaces and client-side behavior remain outside the language migration scope, although their API integration layers must be updated where necessary.

### Language and Package Boundaries

The migration will maintain a mixed-language repository with Python for backend responsibilities and TypeScript for frontend and client-side responsibilities.

|Repository Area|Target Language|Migration Scope|
| -----------------| ------------------------------| -------------------------------------------------------------|
|`apps/web`|TypeScript / React / Next.js|Retain frontend; migrate backend responsibilities to Python|
|`apps/mobile`|TypeScript / React Native|Retain implementation; adapt API communication|
|`apps/browser-extension`|TypeScript|Retain implementation; adapt API communication|
|`apps/cli`|TypeScript|Retain implementation; adapt API communication|
|`apps/mcp`|TypeScript|Retain implementation where compatible|
|`apps/workers`|Python|Migrate background processing and scheduling|
|`packages/trpc`|Python replacement|Migrate business logic and replace tRPC communication|
|`packages/api`|Python replacement|Migrate HTTP API responsibilities|
|`packages/db`|Python replacement|Migrate persistence to SQLAlchemy|
|`packages/shared`|TypeScript / Python|Separate client-side and backend utilities|
|`packages/shared-react`|TypeScript|Retain client-side React utilities|
|`packages/shared-server`|Python replacement|Migrate server-side utilities|
|`packages/plugins`|Python / retained compatible integrations|Migrate backend provider implementations; preserve queue/search/vector-store/rate-limit infrastructure and contracts|
|`packages/open-api`|OpenAPI|Maintain API specifications as the authoritative contracts|
|`packages/sdk`|TypeScript|Retain SDK; adapt to Python REST APIs|
|`tools/seed-snapshot` and migration-relevant tools|Retain compatible tooling / necessary adaptations|Preserve existing tooling behaviour; adapt direct backend dependencies only where required|

The table describes **target responsibilities**, not mandatory final directory names. Python modules and packages may be reorganized to establish appropriate backend boundaries.

Shared code must be separated according to execution responsibility:

- **Client-side utilities:**  Remain in TypeScript.
- **Backend utilities:**  Migrate to Python.
- **Shared API contracts:**  Defined through OpenAPI rather than direct sharing of TypeScript backend types.
- **Database models and persistence:**  Implemented in Python using SQLAlchemy.
- **Business rules and authorization:**  Implemented in Python and accessed through defined API interfaces.
