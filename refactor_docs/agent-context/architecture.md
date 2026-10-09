# Architecture Context

- Baseline: Uninitialised; actual target checkout not assessed by this documentation task.
- Imported claims below: Unresolved against the target checkout.
- Source inspection may establish implementation existence; it does not establish runtime success.
- Target requirements: [architecture/scope](../agent-rules/architecture-scope.md).

## Imported source overview and structure

# Project overview

Karakeep is a monorepo project managed with Turborepo. It is a "read-it-later" bookmarking application with a focus on collecting and organizing information. The project is built with a modern tech stack, including:

- **Frontend:**  Next.js, React, TypeScript, Tailwind CSS
- **Backend:**  Hono (a lightweight web framework), tRPC
- **Database:**  Drizzle ORM (likely with a relational database like PostgreSQL or SQLite)
- **Tooling:**  Oxfmt, oxlint, Vitest, pnpm

Its development workflow uses pnpm as package manager, uses Turborepo as system builder, uses Oxfmt and oxlint as code formatting and Linting, and using Vitest as testing tool.

# Project Structure

The project is organised into `apps` and `packages`:

### Applications (`apps/`)

- **`web`** **:**  The main web application, built with Next.js.
- **`browser-extension`** **:**  A browser extension, likely for saving content to karakeep.
- **`cli`** **:**  A command-line interface for interacting with the service.
- **`landing`** **:**  A landing page for the project.
- **`mobile`** **:**  A mobile application (details unknown).
- **`mcp`** **:**  The Model Context Protocol (MCP) server to communicate with Karakeep.
- **`workers`** **:**  Background workers for processing tasks.

### Packages (`packages/`)

- **`api`** **:**  The main API, built with Hono and tRPC.
- **`db`** **:**  Database schema and migrations, using Drizzle ORM.
- **`e2e_tests`** **:**  End-to-end tests for the project.
- **`open-api`** **:**  OpenAPI specifications for the API.
- **`sdk`** **:**  A software development kit for interacting with the API.
- **`shared`** **:**  Shared code and types between packages.
- **`shared-react`** **:**  Shared React components and hooks.
- **`shared-server`** **:**  Shared logic that's meant to be used on the server-side.
- **`trpc`** **:**  tRPC router and procedures. Most of the business logic is here.

### Docs

- **docs/docs/03-configuration.md**: Explains configuration options for the project.

## Findings ledger

| Topic / responsibility / flow | Verified / Inferred / Unresolved | Evidence and limits | Checked revision / UTC | Next check |
| --- | --- | --- | --- | --- |
| SQLite database engine | Verified | `packages/db/drizzle.config.ts`, `drizzle.ts`, `node_modules/better-sqlite3`; SQLite is the authoritative database | `4ec81e17` / 2026-10-09T09:30:00Z | Database service |
| Historical migrations & journal | Verified | 93 migrations (`0000` to `0092`) in `packages/db/drizzle/`, journal at `drizzle/meta/_journal.json` | `4ec81e17` / 2026-10-09T09:30:00Z | Next schema additions |
| `__drizzle_migrations` tracking table | Verified | `CREATE TABLE "__drizzle_migrations" ( id SERIAL PRIMARY KEY, hash text NOT NULL, created_at numeric )` | `4ec81e17` / 2026-10-09T09:33:58Z | Startup integration |
| Resulting SQLite schema | Verified | 35 distinct tables; 100% table name and DDL parity between Python migrator and TypeScript Drizzle | `4ec81e17` / 2026-10-09T09:37:12Z | SQLAlchemy models mapping |

## Actual tooling and commands

- Python runtime: Python 3.14.3 (`/opt/homebrew/bin/python3`)
- SQLite version: 3.51.3 (via standard library `sqlite3`)
- Migration runner: `packages/db/python/migrator.py` (CLI & programmatic API)
- Verification test runner: `PYTHONPATH=. python3 -m unittest packages/db/python/test_migrator.py -v`
- Reference Node runtime: Node v24.11.0


The original database description is speculative; it is not permission to select a different engine. Verify the actual engine and preserve it.
