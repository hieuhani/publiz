import { Migrator, type Kysely, FileMigrationProvider } from "kysely";
import { promises as fs } from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

export const buildMigrator = (db: Kysely<any>) => {
  return new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(path.dirname(__filename), "./migrations"),
    }),
  });
};
