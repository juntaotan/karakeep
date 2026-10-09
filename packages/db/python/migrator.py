"""Historical SQLite migration runner for Karakeep.

Implements execution of historical Drizzle SQL migrations and journal tracking,
preserving exact compatibility with TypeScript Drizzle migrator semantics:
- Reads metadata from drizzle/meta/_journal.json
- Computes SHA256 hashes of SQL migration files
- Parses statement breakpoints ('--> statement-breakpoint')
- Maintains '__drizzle_migrations' table schema and records
- Preserves idempotency for existing databases
- Executes in isolated transactions with rollback on failure
"""

from __future__ import annotations

import argparse
import hashlib
import json
import logging
import os
from dataclasses import dataclass
from pathlib import Path
import sqlite3
from typing import Sequence

logger = logging.getLogger("karakeep.db.migrator")


@dataclass(frozen=True)
class Migration:
    idx: int
    version: str
    when: int  # folderMillis
    tag: str
    hash: str
    statements: tuple[str, ...]
    breakpoints: bool = True


@dataclass(frozen=True)
class MigrationStatus:
    total_in_journal: int
    applied_count: int
    pending_count: int
    last_applied_when: int | None
    last_applied_hash: str | None


def get_default_migrations_folder() -> Path:
    """Return default migrations folder located at packages/db/drizzle."""
    current_file = Path(__file__).resolve()
    # packages/db/python/migrator.py -> packages/db/drizzle
    drizzle_dir = current_file.parent.parent / "drizzle"
    if drizzle_dir.is_dir():
        return drizzle_dir
    # Fallback to current working directory relative
    cwd_drizzle = Path.cwd() / "packages" / "db" / "drizzle"
    if cwd_drizzle.is_dir():
        return cwd_drizzle
    return drizzle_dir


def read_migration_files(migrations_folder: str | Path | None = None) -> list[Migration]:
    """Read migration files and meta/_journal.json from the migrations folder."""
    folder = Path(migrations_folder) if migrations_folder else get_default_migrations_folder()
    journal_path = folder / "meta" / "_journal.json"
    if not journal_path.is_file():
        raise FileNotFoundError(f"Cannot find journal file at: {journal_path}")

    with journal_path.open("r", encoding="utf-8") as f:
        journal_data = json.load(f)

    entries = journal_data.get("entries", [])
    migrations: list[Migration] = []

    for entry in entries:
        tag = entry["tag"]
        migration_file = folder / f"{tag}.sql"
        if not migration_file.is_file():
            raise FileNotFoundError(f"Missing migration file: {migration_file}")

        raw_content = migration_file.read_bytes()
        file_hash = hashlib.sha256(raw_content).hexdigest()

        text_content = raw_content.decode("utf-8")
        raw_statements = text_content.split("--> statement-breakpoint")
        clean_statements = tuple(stmt.strip() for stmt in raw_statements if stmt.strip())

        migrations.append(
            Migration(
                idx=entry.get("idx", len(migrations)),
                version=str(entry.get("version", "5")),
                when=int(entry["when"]),
                tag=tag,
                hash=file_hash,
                statements=clean_statements,
                breakpoints=bool(entry.get("breakpoints", True)),
            )
        )

    return migrations


def ensure_migration_table(conn: sqlite3.Connection, table_name: str = "__drizzle_migrations") -> None:
    """Ensure the drizzle migrations table exists with exact schema."""
    # Matches Drizzle's SQLiteSyncDialect table creation:
    # CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsTable)} (
    #     id SERIAL PRIMARY KEY,
    #     hash text NOT NULL,
    #     created_at numeric
    # )
    conn.execute(
        f'CREATE TABLE IF NOT EXISTS "{table_name}" (\n'
        f"\t\tid SERIAL PRIMARY KEY,\n"
        f"\t\thash text NOT NULL,\n"
        f"\t\tcreated_at numeric\n"
        f"\t)"
    )



def get_last_applied_migration(
    conn: sqlite3.Connection, table_name: str = "__drizzle_migrations"
) -> tuple[int | None, str | None, int | None] | None:
    """Return (id, hash, created_at) of the last applied migration, or None."""
    ensure_migration_table(conn, table_name)
    cursor = conn.execute(
        f'SELECT id, hash, created_at FROM "{table_name}" ORDER BY created_at DESC LIMIT 1'
    )
    row = cursor.fetchone()
    if row is None:
        return None
    # row is (id, hash, created_at)
    return (row[0], str(row[1]) if row[1] is not None else None, int(row[2]) if row[2] is not None else None)


def get_migration_status(
    conn_or_path: sqlite3.Connection | str | Path,
    migrations_folder: str | Path | None = None,
    table_name: str = "__drizzle_migrations",
) -> MigrationStatus:
    """Get current status of migrations against a target database."""
    migrations = read_migration_files(migrations_folder)
    should_close = False
    if isinstance(conn_or_path, (str, Path)):
        conn = sqlite3.connect(str(conn_or_path))
        should_close = True
    else:
        conn = conn_or_path

    try:
        last = get_last_applied_migration(conn, table_name)
        last_when = last[2] if last else None
        last_hash = last[1] if last else None

        if last_when is None:
            applied = 0
            pending = len(migrations)
        else:
            applied = sum(1 for m in migrations if m.when <= last_when)
            pending = len(migrations) - applied

        return MigrationStatus(
            total_in_journal=len(migrations),
            applied_count=applied,
            pending_count=pending,
            last_applied_when=last_when,
            last_applied_hash=last_hash,
        )
    finally:
        if should_close:
            conn.close()


def migrate(
    conn_or_path: sqlite3.Connection | str | Path,
    migrations_folder: str | Path | None = None,
    table_name: str = "__drizzle_migrations",
) -> list[Migration]:
    """Execute unapplied migrations against target database.

    Returns the list of migrations that were applied in this run.
    """
    migrations = read_migration_files(migrations_folder)
    should_close = False
    if isinstance(conn_or_path, (str, Path)):
        conn = sqlite3.connect(str(conn_or_path), isolation_level=None)
        should_close = True
    else:
        conn = conn_or_path
        # When using an existing connection, set autocommit mode (isolation_level=None)
        # to allow explicit BEGIN / COMMIT / ROLLBACK statements.
        conn.isolation_level = None

    try:
        ensure_migration_table(conn, table_name)
        last = get_last_applied_migration(conn, table_name)
        last_when = last[2] if last else None

        applied_in_this_run: list[Migration] = []

        # Find pending migrations
        pending_migrations = [
            m for m in migrations if last_when is None or m.when > last_when
        ]

        if not pending_migrations:
            logger.info("No pending migrations to apply.")
            return []

        logger.info(f"Applying {len(pending_migrations)} pending migrations...")

        # Drizzle wraps all unapplied migrations in a single BEGIN / COMMIT transaction block
        conn.execute("BEGIN")
        try:
            for migration in pending_migrations:
                logger.info(f"Applying migration {migration.tag} ({migration.idx})...")
                for stmt in migration.statements:
                    conn.execute(stmt)

                conn.execute(
                    f'INSERT INTO "{table_name}" ("hash", "created_at") VALUES (?, ?)',
                    (migration.hash, migration.when),
                )
                applied_in_this_run.append(migration)

            conn.execute("COMMIT")
            logger.info(f"Successfully applied {len(applied_in_this_run)} migrations.")
        except Exception as e:
            conn.execute("ROLLBACK")
            logger.error(f"Migration failed: {e}; rolled back transaction.")
            raise

        return applied_in_this_run
    finally:
        if should_close:
            conn.close()


def main(argv: Sequence[str] | None = None) -> int:
    """CLI entry point for running SQLite migrations."""
    parser = argparse.ArgumentParser(description="Run historical Karakeep SQLite migrations in Python")
    parser.add_argument(
        "--db",
        default=os.environ.get("DATABASE_URL", "./db.db"),
        help="Path to SQLite database file (default: DATABASE_URL or ./db.db)",
    )
    parser.add_argument(
        "--migrations-folder",
        default=None,
        help="Path to Drizzle migrations folder (default: packages/db/drizzle)",
    )
    parser.add_argument(
        "--status",
        action="store_true",
        help="Print migration status without applying unapplied migrations",
    )
    parser.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="Enable verbose logging",
    )
    args = parser.parse_args(argv)

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    )

    db_path = args.db
    migrations_folder = args.migrations_folder

    status = get_migration_status(db_path, migrations_folder)
    print(
        f"Migrations in journal: {status.total_in_journal} | "
        f"Applied: {status.applied_count} | "
        f"Pending: {status.pending_count}"
    )

    if args.status:
        return 0

    if status.pending_count > 0:
        applied = migrate(db_path, migrations_folder)
        print(f"Applied {len(applied)} migrations successfully.")
    else:
        print("Database is already up to date.")

    return 0


if __name__ == "__main__":
    import sys
    sys.exit(main())
