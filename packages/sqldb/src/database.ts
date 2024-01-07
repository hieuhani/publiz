import { CamelCasePlugin, Kysely, type Dialect } from "kysely";
import { type UserTable } from "./user/model";
import { FileTable } from "./file/model";

export interface Database {
  users: UserTable;
  files: FileTable;
}

export const createDatabase = (dialect: Dialect) => {
  return new Kysely<Database>({
    dialect,
    plugins: [new CamelCasePlugin()],
  });
};

export type SqlDatabase = ReturnType<typeof createDatabase>;
