import { Pool } from "pg";
import { PostgresDialect } from "kysely";
import { createSqlDb } from "@publiz/core";
import { config } from "../config";

export const getSqlDb = () => {
  const dialect = new PostgresDialect({
    pool: new Pool(config.db),
  });

  return createSqlDb(dialect);
};
