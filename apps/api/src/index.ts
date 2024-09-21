import { createApp } from "./app";
import { getEnvVar } from "./config/env";

const app = createApp();

export default {
  port: +getEnvVar("PORT", "3000"),
  fetch: app.fetch,
};
