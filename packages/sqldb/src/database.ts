import { CamelCasePlugin, Kysely, type Dialect } from "kysely";
import { type UserTable } from "./user/model";
import { FileTable } from "./file/model";
import { TagTable } from "./tag";
import { PostTagTable } from "./post-tag";
import { PostTable } from "./post";

export interface Database {
  users: UserTable;
  files: FileTable;
  tags: TagTable;
  posts_tags: PostTagTable;
  posts: PostTable;
}

export const createDatabase = (dialect: Dialect) => {
  return new Kysely<Database>({
    dialect,
    plugins: [new CamelCasePlugin()],
  });
};

export type SqlDatabase = ReturnType<typeof createDatabase>;
