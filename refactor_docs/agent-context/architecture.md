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

## Actual tooling and commands

Record runtime/dependency versions, chosen API framework, SQLAlchemy execution model, migration tools, lockfiles, startup and verification commands only after examining the target repository. Unknown choices remain Unresolved.

The original database description is speculative; it is not permission to select a different engine. Verify the actual engine and preserve it.
