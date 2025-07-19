# dorsium-db-core

This repository contains the core PostgreSQL database structure for the Dorsium ecosystem.  
It defines all critical schemas, tables, functions, and Row-Level Security (RLS) policies used by Dorsium's backend and microservices.

## Structure

```
sql/
├── schema/
│   ├── create_schemas.sql          # Creates `dorsium_user`, `dorsium_vote`, etc.
│   ├── user_tables.sql             # Core user-related tables
│   └── vote_tables.sql             # Voting subsystem schema
├── rls/
│   ├── user_RLS_internal.sql                # RLS policies for user tables
│   └── vote_RLS_internal.sql                # RLS policies for voting tables
├── functions/
│   └── utility_functions.sql       # Common functions (e.g. is_admin, auth_uid, update_modified_at)
```

## Security Principles

- All access is protected by PostgreSQL RLS.
- No direct access to user-critical tables.
- Only API layer has insert/update rights.
- Admin operations are handled via `service_role` and verified functions.

## Conventions

- Sequential `id` as primary key.
- `uuid` as external identifier.
- Timestamp fields are stored in UTC (`timestamp`, no timezone).
- Role-based access via `user_account_role`.

## Setup (Dev)

This repo is not designed to be run standalone.
It is meant to be used as part of the [Dorsium backend architecture](https://github.com/dorsium).

The script is idempotent and can be safely run multiple times.

## License

Private. Not intended for public reuse.
