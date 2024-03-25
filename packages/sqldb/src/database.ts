import { CamelCasePlugin, Kysely, type Dialect } from "kysely";
import { type UserTable } from "./user/model";
import { FileTable } from "./file/model";
import { TagTable } from "./tag";
import { PostTagTable } from "./post-tag";
import { PostTable } from "./post";
import { OrganizationTable } from "./organization";
import { OrganizationRoleTable } from "./organization-role";
import { OrganizationUserTable } from "./organization-user";
import { MetaSchemaTable } from "./meta-schema";
import { CommentTable } from "./comment";
import { TaxonomyTable } from "./taxonomy";

export interface Database {
  users: UserTable;
  files: FileTable;
  tags: TagTable;
  posts_tags: PostTagTable;
  posts: PostTable;
  organizations: OrganizationTable;
  organization_roles: OrganizationRoleTable;
  organizations_users: OrganizationUserTable;
  meta_schemas: MetaSchemaTable;
  comments: CommentTable;
  taxonomies: TaxonomyTable;
}

export const createDatabase = (dialect: Dialect) => {
  return new Kysely<Database>({
    dialect,
    plugins: [new CamelCasePlugin()],
  });
};

export type SqlDatabase = ReturnType<typeof createDatabase>;
