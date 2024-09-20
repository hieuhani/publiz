import { handle } from "hono/vercel";
import createApp from "@publiz/api";

const app = createApp();

const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const OPTIONS = handler;
