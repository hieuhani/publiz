import { buildMigrator } from "@publiz/dbmigration";
import { NO_MIGRATIONS, PostgresDialect } from "kysely";
import { createSqlDb } from "@publiz/core";
import { getEnvVar } from "./src/config/env";
import { Config } from "./src/config";
import { Pool } from "pg";

export const config: Config = {
  db: {
    host: getEnvVar("DB_HOST"),
    port: parseInt(getEnvVar("DB_PORT") ?? "5432", 10),
    user: getEnvVar("DB_USER"),
    password: getEnvVar("DB_PASSWORD"),
    database: getEnvVar("DB_DATABASE"),
    ssl:
      getEnvVar("DB_SSL", "false") === "true"
        ? {
            rejectUnauthorized:
              getEnvVar("DB_SSL_REJECT_UNAUTHORIZED", "true") === "true",
          }
        : undefined,
    prepare: getEnvVar("DB_PREPARE", "true") === "true",
  },
  firebase: {
    apiKey: getEnvVar("FIREBASE_API_KEY"),
    projectId: getEnvVar("FIREBASE_PROJECT_ID"),
  },
  s3: {
    bucket: getEnvVar("S3_BUCKET"),
    accessKeyId: getEnvVar("S3_ACCESS_KEY_ID"),
    secretAccessKey: getEnvVar("S3_SECRET_ACCESS_KEY"),
    endpoint: getEnvVar("S3_ENDPOINT", "http://s3.amazonaws.com"),
    region: getEnvVar("S3_REGION", "ap-southeast-1"),
    getGcsImageServingEndpoint: getEnvVar(
      "S3_GET_GCS_IMAGE_SERVING_ENDPOINT",
      ""
    ),
  },
  cors: {
    origin: getEnvVar("CORS_ORIGIN", "*").split(","),
    allowHeaders: getEnvVar(
      "CORS_ALLOW_HEADERS",
      "Content-Type, Authorization"
    ).split(","),
    allowMethods: getEnvVar("CORS_ALLOW_METHODS", "GET,POST,PUT,DELETE").split(
      ","
    ),
    maxAge: parseInt(getEnvVar("CORS_MAX_AGE", "600"), 10),
    credentials: getEnvVar("CORS_CREDENTIALS", "true") === "true",
  },
};

const dialect = new PostgresDialect({
  pool: new Pool(config.db),
});

const db = createSqlDb(dialect);
const migrator = buildMigrator(db);

async function migrateToLatest() {
  const { error, results } = await migrator.migrateToLatest();
  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration '${it.migrationName}' was executed successfully`);
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error("failed to migrate");
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

async function migrateDown() {
  const { error, results } = await migrator.migrateDown();
  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration '${it.migrationName}' was reverted successfully`);
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error("failed to migrate");
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

async function migrateNone() {
  const { error, results } = await migrator.migrateTo(NO_MIGRATIONS);
  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration '${it.migrationName}' was reverted successfully`);
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error("failed to migrate");
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

const myArgs = process.argv[3];

if (myArgs === "down") {
  await migrateDown();
} else if (myArgs === "latest") {
  await migrateToLatest();
} else if (myArgs === "none") {
  await migrateNone();
}
