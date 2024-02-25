import { Hono } from "hono";
import { type AppEnv } from "../global";

export const fileRouter = new Hono<AppEnv>();
