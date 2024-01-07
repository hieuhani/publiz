import { DatabaseConfig } from "./config";
import { createSqlDb } from "@publiz/core";
import { TiDBServerlessDialect } from "@tidbcloud/kysely";

export const getDatabaseModule = ({ databaseUrl }: DatabaseConfig) => {
  const dialect = new TiDBServerlessDialect({
    url: databaseUrl,
  });

  return createSqlDb(dialect);
};
