# OurGroup API

## Setup

1. Ensure environment variable files are populated with valid values
2. Start API (and database) Docker containers with `docker-compose up`
3. Install API dependencies in container
4. Run migrations in container
5. Access API at `localhost:3001`

> **NOTE:** Developer dependencies are installed in the container and shared through a Docker volume mount. All new packages should be installed inside Docker!

```bash
# Connect to Docker container
make connect_api

# Install new packages
$ npm install <package>

# Run database migrations
$ npm run migrate
```
