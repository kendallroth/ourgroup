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

1. Copy example environment variable files and populate with valid values
2. Start API, web, and database Docker containers with `docker-compose up`

