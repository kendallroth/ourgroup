# ourgroup Database

> Database is managed entirely by Docker Compose, and the data is stored in a volume (managed by Docker).

## Connecting to Container

Connecting to the postgres database can be done either through a db tool (such as DBeaver) or Docker Compose. If connecting through an external database tool, use the database credentials defined in the root `.env` file.

```sh
# Connect to database container
make connect_db
# Begin querying information about database
$ select * from migrations;
```
> **NOTE:** Migrations occasionally have issues with old files in the `dist/src/migrations` directory, which causes problems with duplicate actions. This only happens when removing migrations (such as cleaning up) which can only happen on non-released data (ie. in development). A possible solution for this is to delete dist folder and restart containers.

## Migrations

TypeORM provides a migration CLI (_wrapped with scripts_) to handle generating new migrations and managing the status of existing migrations.

```sh
# Attach to the running API container
make connect_api
# View migration info
$ npm run migrate:show
# Run outstanding migrations
$ npm run migrate
# Generate a new migration (after schema changes, etc)
$ npm run migrate:generate -- -n [MIGRATION_NAME]
# Generate a new migration file to edit (run migration when done editing)
$ npm run migrate:create -- -n [MIGRATION_NAME]
```

## Standards

There are several standards and naming conventions for database development (via Django models).

- Use `snake_case` for all entity fields (and database columns)
- Use singular casing for all entity names
- Avoid generic `id` database columns (ambiguity); instead prefer specific field names (ie. `account_id`). Entity fields may still use `id` though (for TS)!
- Append `_at` to dates representing an "auditable" event, but `_date`/`_time` to dates representing a "regular" event
  - `created_at` and `verified_at` represent an event in time, while `start_date` represents a regular event
