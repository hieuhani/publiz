import { Hono } from "hono";
import { AppEnv } from "./global";
export declare const createApp: () => Hono<AppEnv, import("hono/types").BlankSchema, "/">;
