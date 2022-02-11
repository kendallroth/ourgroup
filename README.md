# OurGroup

## Architecture

- **[TypeScript](http://www.typescriptlang.org/)** - Typed superset of JavaScript for better documentation, code safety, and experience

### API

The API is architected with the [NestJS](https://docs.nestjs.com/) framework

- **[NestJS](https://docs.nestjs.com/)** - Framework for building modular server applications
- **[TypeORM](https://typeorm.io/)** - Powerful Object Relational Mapper for NodeJS

### Database

The database uses [PostgreSQL](https://www.postgresql.org/)

### Web

The web application is an SPA built with [VueJS](https://vuejs.org/)

- **[VueJS](https://vuejs.org/)** - Model-View framework for building user interfaces and SPAs

## Setup

Setup information has been moved to the appropriate `README` files.

- [API setup](./api/README.md)
- [Database setup](./database/README.md)

However, a quickstart for returning developers is as follows:

1. Run `make setup` to quickly setup development environment (env files, git hooks, etc)
2. Populate new environment variable files with valid values
3. Start API, web, and database Docker containers with `docker-compose up`

### Environment Variables

Development environment variables are managed through Docker Compose and `.env` files. The root `.env` file is used to define variables used by multiple containers, and variables must be passed manually through Docker Compose (in project `environment` object). Project `.env` files are used to defined variables specific to containers, and are already passed through as the entire file to the specific container.

The example environment variable files should each be copied into a matching .env file, then updated as necessary.

```sh
# NOTE: Run as part of "make setup"!
make setup_env_files
```

> NOTE: Docker Compose stack must be restarted whenever environment variables are changed!

> NOTE: The Docker Compose config can be viewed (with substitutions (env, etc) made!) by running `docker-compose config`.

## Docker

Docker Compose is used to manage the developer dependencies in containers, eliminating the need for local installations.

```sh
# Start the containers
docker-compose up [NAMES?]
# Attach to a running container
docker-compose exec [NAME] sh
# Stop all running containers
docker stop $(docker container ls -q)
# Connect to database
make psql
```

> NOTE: In case of database port conflicts (ie. Postgres installed locally), change the `DB_PORT` env variable and restart Docker Compose.

