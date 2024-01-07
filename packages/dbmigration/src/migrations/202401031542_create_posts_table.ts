import { enumSql, withMySqlV8, withTimestamps } from "../sql";
import type { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable("posts")
    .addColumn("id", "bigint", (col) =>
      col.unsigned().autoIncrement().primaryKey()
    )
    .addColumn("title", "varchar(512)", (col) => col.notNull())
    .addColumn("excerpt", "text")
    .addColumn("content", "text")
    .addColumn("parent_id", "bigint", (col) =>
      col.references("posts.id").onDelete("set null").defaultTo(null)
    )
    .addColumn("author_id", "bigint", (col) =>
      col.references("users.id").onDelete("set null")
    )
    .addColumn("organization_id", "integer", (col) =>
      col.references("organizations.id").onDelete("set null")
    )
    .addColumn("type", enumSql("REVISION", "POST"), (col) =>
      col.notNull().defaultTo("POST")
    )
    .addColumn("status", enumSql("DRAFT", "PUBLISHED", "ARCHIVED"), (col) =>
      col.notNull().defaultTo("DRAFT")
    )
    .addColumn("metadata", "json")
    .$call(withTimestamps)
    .$call(withMySqlV8)
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable("posts").execute();
}
