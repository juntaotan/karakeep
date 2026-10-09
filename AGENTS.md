# Karakeep Project Overview

This document provides context about the Karakeep project for the different agents.

## Project Overview

Karakeep is a monorepo project managed with Turborepo. It is a "read-it-later" bookmarking application with a focus on collecting and organizing information. The project is built with a modern tech stack, including:

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Hono (a lightweight web framework), tRPC
- **Database:** Drizzle ORM (likely with a relational database like PostgreSQL or SQLite)
- **Tooling:** Oxfmt, oxlint, Vitest, pnpm

## Project Structure

The project is organized into `apps` and `packages`:

### Applications (`apps/`)

- **`web`:** The main web application, built with Next.js.
- **`browser-extension`:** A browser extension, likely for saving content to karakeep.
- **`cli`:** A command-line interface for interacting with the service.
- **`landing`:** A landing page for the project.
- **`mobile`:** A mobile application (details unknown).
- **`mcp`:** The Model Context Protocol (MCP) server to communicate with Karakeep.
- **`workers`:** Background workers for processing tasks.

### Packages (`packages/`)

- **`api`:** The main API, built with Hono and tRPC.
- **`db`:** Database schema and migrations, using Drizzle ORM.
- **`e2e_tests`:** End-to-end tests for the project.
- **`open-api`:** OpenAPI specifications for the API.
- **`sdk`:** A software development kit for interacting with the API.
- **`shared`:** Shared code and types between packages.
- **`shared-react`:** Shared React components and hooks.
- **`shared-server`:** Shared logic that's meant to be used on the server-side.
- **`trpc`:** tRPC router and procedures. Most of the business logic is here.

### Docs

- **docs/docs/03-configuration.md**: Explains configuration options for the project.

## Development Workflow

- **Package Manager:** pnpm
- **Build System:** Turborepo
- **Code Formatting:** Oxfmt
- **Linting:** oxlint
- **Testing:** Vitest

## Other info

- This project uses shadcn/ui. The shadcn components in the web app are in `packages/web/components/ui`.
- This project uses Tailwind CSS.
- For the mobile app, we use [expo](https://expo.dev/).

### Common Commands

- `pnpm typecheck`: Typecheck the codebase.
- `pnpm lint`: Lint the codebase.
- `pnpm lint:fix`: Fix linting issues.
- `pnpm format`: Format the codebase.
- `pnpm format:fix`: Fix formatting issues.
- `pnpm test`: Run tests.
- `pnpm db:generate --name description_of_schema_change`: db migration after making schema changes

Starting services:
- `pnpm web`: Start the web application (this doesn't return, unless you kill it).
- `pnpm workers`: Starts the background workers (this doesn't return, unless you kill it).

## Python Backend Migration Workflow

For an authorised Python backend migration task in this candidate checkout, read `refactor_docs/README.md` before implementation or mutable verification. Follow its mandatory reading order and task-specific rule triggers; the file paths are relative to the repository root after this section is merged into the root `AGENTS.md`.

Use one agent and a separate candidate checkout. Confirm the protected source, writable candidate and isolated runtime/data locations according to `refactor_docs/agent-rules/isolated-development.md`. Keep migration context and real session records under the candidate's `refactor_docs/agent-context/`; preserve the original source and intervening work.

Write all project-authored prompts and agent instruction/context files in English, including future session records and handovers. Translate recorded non-English user instructions faithfully and label them as translations; preserve their authority and approval scope.

Read `refactor_docs/design-confirmations.md` and relevant candidate context before relying on prior choices. Proposed or pending solutions are not approved decisions. Do not infer implementation or verification success from a template or a design approval.

Read `refactor_docs/agent-rules/human-intervention.md` when assessing a dependency on a human decision, resource or approval. Prepare the concrete authorised result before requesting a necessary approval, and reuse applicable existing authorisation. Candidate test success alone does not authorise integration or production cutover.

An explicitly authorised documentation review or design-document correction follows the scope described in the migration README and does not initialise a migration implementation session. Preserve the existing project instructions when installing this additive section.

