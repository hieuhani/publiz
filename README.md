# Publiz

Yet another content management platform, but trying to do the best on 3 points:

- Integration with your existing system
- Multi-purposed usages from a simple blog site to a social network
- Automated content management

## Technical specifications

- API router framework is Hono
- Database access with Kysely
- Database system is PostgreSQL
- Javascript runtime is Bun
- MVP Authentication with Firebase

## Quick start

1. Install bun

    ```sh
    curl -fsSL https://bun.sh/install | bash
    ```

2. Run dependent services

    ```sh
    docker compose up -d
    ```

3. Configure environment

    ```sh
    cp apps/api/.env.sample apps/api/.env
    ```

4. Run migration

    ```sh
    bun run build:types
    bun run migrate:dev:latest
    ```

5. Run api service

    ```sh
    bun run dev
    ```

## Contributing

- [Open an issue](https://github.com/publiz/publiz/issues) if you believe you've encountered a bug with the module.

## License

MIT License
