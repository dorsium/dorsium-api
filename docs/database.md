# Database Scripts

This guide explains how to execute the SQL files located under `sql/` when setting up a local database.

## Prerequisites

Install PostgreSQL and ensure the `psql` CLI is available in your PATH.

## Running the scripts

1. Choose the target database name and export it for convenience.
   ```bash
   export DB_NAME=mydb
   ```
2. Execute each directory in order. The recommended sequence is:
   - `init/` – setup extensions and base configuration.
   - `schema/` – create schemas and tables.
   - `functions/` – define stored procedures and triggers.
   - `rls/` – apply row-level security policies.

A simple shell loop will run every file in order:

```bash
for dir in init schema functions rls; do
  for file in sql/$dir/*.sql; do
    psql -d "$DB_NAME" -f "$file"
  done
done
```

You can also run individual files with `psql -d $DB_NAME -f path/to/script.sql`.
