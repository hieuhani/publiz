import { Pool } from "pg";
import { PostgresDialect } from "kysely";
import { createSqlDb } from "@publiz/core";
import { config } from "../config";

const pool = new Pool(config.db);

export const getSqlDb = () => {
  const dialect = new PostgresDialect({
    pool,
  });

  return createSqlDb(dialect);
};
