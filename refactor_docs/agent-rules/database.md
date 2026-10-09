# Database and Data Integrity

Extracted from the supplied migration document. Applicable requirements remain binding across W0–W4; this split does not prescribe TDD or a migration implementation order.

## Database and Data Integrity

The migration must preserve the existing database schema and maintain compatibility with existing data.

- Replace Drizzle ORM with SQLAlchemy for Python-based database access.
- Preserve existing database tables, columns, data types, primary keys, foreign keys, indexes, and constraints.
- Maintain existing data relationships, transaction semantics, and data integrity requirements.
- Existing data must remain accessible without requiring a database schema redesign.
- SQLAlchemy models, queries, and transaction implementations may be redesigned according to Python conventions, provided that the existing database structure and behaviour remain unchanged.
- Do not modify the database schema solely to simplify the Python implementation.

## Approved SQLite Compatibility and Historical Migrations

The user approved F05: retain SQLite, its existing schema and stored data, and replace Drizzle access with SQLAlchemy while preserving business behaviour.

- Map actual stored encodings explicitly: integer timestamps in seconds versus milliseconds, integer booleans, JSON text, identifiers, ORM-generated defaults/update timestamps, relationships and transaction behaviour. Python/SQLAlchemy defaults must not silently change these contracts.
- Preserve the intentional bookmark mapping: API/domain `createdAt` maps to physical `lastSavedAt`; physical `createdAt` retains first creation (`dbCreatedAt`, exposed as `firstCreatedAt`). Verify re-save ordering, filtering and pagination rather than mapping by field name alone.
- Preserve historical Drizzle SQL migration files and journal as immutable history. Implement and verify a Python runner against their actual execution and applied-migration journal semantics for existing databases and clean installations. Do not regenerate history from SQLAlchemy metadata or replay already-applied migrations. Final startup must not depend on a TypeScript migrator.
- Verify controlled old-database copies and newly migrated databases in isolation, comparing schema, encoding, defaults, relationships, transactions and representative business operations. Never run these checks against the original operational database.
- Keep state compatible with the original implementation during module cutover/rollback. Follow the [approved integration and recovery requirements](isolated-development.md); a rollback must retain valid writes made after cutover.
