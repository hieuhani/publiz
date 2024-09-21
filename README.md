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

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhieuhani%2Fpubliz&env=FIREBASE_API_KEY,FIREBASE_PROJECT_ID,S3_BUCKET,S3_ACCESS_KEY_ID,S3_SECRET_ACCESS_KEY&project-name=publiz&repository-name=publiz&demo-title=Publiz&demo-description=Open%20meta-schema%20driven%20publishing%20platform&stores=%5B%7B"type"%3A"postgres"%7D%5D&build-command=cd%20..%2F..%20%26%26%20bun%20run%20build&install-command=bun%20install&root-directory=apps%2Fvercel)

After the deployment success, run the initial database migation by hitting the API: GET <your_vercel_url>/api/run_initial_migration

## Contributing

- [Open an issue](https://github.com/publiz/publiz/issues) if you believe you've encountered a bug with the module.

## License

MIT License
