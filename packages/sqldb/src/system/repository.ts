import { sql } from "kysely";
import { SqlDatabase } from "../database";
import { initialMigrationSql } from "@publiz/dbmigration";

export const getDatabaseMigrations = async (db: SqlDatabase) => {
  try {
    const result =
      await sql`SELECT * FROM kysely_migration ORDER BY timestamp ASC`.execute(
        db
      );
    return result.rows;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const executeInitialMigration = async (db: SqlDatabase) => {
  return initialMigrationSql.execute(db);
};
