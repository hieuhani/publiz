import { handle } from "hono/vercel";
import { createKysely } from "@vercel/postgres-kysely";
import createApp from "@publiz/api";
import { CamelCasePlugin, sql } from "kysely";

export const db = createKysely(undefined, {
  plugins: [new CamelCasePlugin()],
});

const app = createApp({
  db,
});

const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const OPTIONS = handler;
