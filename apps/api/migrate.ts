import { buildMigrator } from "@publiz/dbmigration";
import { NO_MIGRATIONS, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { createSqlDb } from "@publiz/core";
import { config } from "./src/config";

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
  migrateDown();
} else if (myArgs === "latest") {
  migrateToLatest();
} else if (myArgs === "none") {
  migrateNone();
}
