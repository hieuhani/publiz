import { createApp } from "./app";
import { getEnvVar } from "./config/env";

const app = createApp();

export default {
  port: parseInt(getEnvVar("PORT", "3000"), 10),
  fetch: app.fetch,
};
