import { createDatabase, type SqlDatabase } from "@publiz/sqldb";
import { type Dialect } from "kysely";

export const createSqlDb = (dialect: Dialect) => {
  return createDatabase(dialect);
};

export { type SqlDatabase };
