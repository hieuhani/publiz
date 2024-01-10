import { DatabaseConfig } from "./config";
import { Pool } from "pg";
import { PostgresDialect } from "kysely";
import { createSqlDb } from "@publiz/core";

export const getDatabaseModule = ({
  database,
  host,
  user,
  password,
}: DatabaseConfig) => {
  const dialect = new PostgresDialect({
    pool: new Pool({
      database,
      host,
      user,
      password,
    }),
  });

  return createSqlDb(dialect);
};
