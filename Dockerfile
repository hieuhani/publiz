FROM oven/bun:1 AS base
WORKDIR /usr/src/app

FROM base AS builder
COPY . .
RUN bun install --frozen-lockfile --production
RUN bun run build:api

FROM base AS release
COPY --from=builder /usr/src/app/apps/api/dist/index.js .

USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "index.js" ]
