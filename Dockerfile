FROM oven/bun:1 as base
WORKDIR /usr/src/app

FROM base as builder
COPY . .
RUN bun install --frozen-lockfile
RUN bun run build

FROM base as release
COPY --from=builder /usr/src/app/apps/api/dist/index.js .
COPY --from=builder /usr/src/app/apps/api/dist/migrate.js .
COPY --from=builder /usr/src/app/packages/dbmigration/src/sql.ts .
COPY --from=builder /usr/src/app/packages/dbmigration/src/migrations ./migrations

USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run" ]
