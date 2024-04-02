import { createSqlDb } from "@publiz/core";
import { config } from "../config";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";

const dialect = new PostgresJSDialect({
  postgres: postgres(config.db),
});

export const getSqlDb = () => {
  return createSqlDb(dialect);
};
