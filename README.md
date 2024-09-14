# Publiz
<a href="https://github.com/hieuhani/publiz">
  <img alt="Publiz" src="./assets/cover.png">
</a>

## Introduction

Publiz is a cutting-edge, open-source, meta-schema driven headless Content Management System (CMS) designed to efficiently manage and deliver content across diverse platforms and tenants, all from one centralized system.

- Publiz separates content creation from presentation, allowing developers to define custom content structures using a powerful meta-schema approach.
- Build to support multi-tenancy allows multiple clients or organizations to operate independently within a single instance, each with custom content structures and configurations.
- Use headless architecture enables seamless integration with any front-end technology.

## Getting Started

### Prepare the recommended environment

- Bun v1.1.27
- PostgreSQL v16
- S3 Compatible Storage

### Quick start

```sh
# install Bun
curl -fsSL https://bun.sh/install | bash
# use Docker Compose for Postgres and Minio
docker compose up
# create the local environment
cp apps/api/.env.sample apps/api/.env
# run the first initial migrations
bun run migrate:dev:latest
# run the dev server
bun run dev
```

## Awesome Publiz

### Projects built with Publiz

- [Techgoda](https://github.com/hieuhani/techgoda) - A social publishing platform

### Apps using Publiz CMS

- [Fibotree](https://fibotree.com)
- [Techgoda](https://techgoda.net)
- [Greenpod](https://www.greenpod.vn)


## Contributing

- [Open an issue](https://github.com/publiz/publiz/issues) if you believe you've encountered a bug with the module.

## License

MIT License
