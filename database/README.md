# ourgroup Database

> Database is managed entirely by Docker Compose, and the data is stored in a volume (managed by Docker).

## Development

- TBD

## Migrations

- TBD

## Standards

There are several standards and naming conventions for database development (via Django models).

- Use `snake_case` for all entity fields (and database columns)
- Use singular casing for all entity names
- Append `_at` to dates representing an "auditable" event, but `_date`/`_time` to dates representing a "regular" event
  - `created_at` and `verified_at` represent an event in time, while `start_date` represents a regular event
