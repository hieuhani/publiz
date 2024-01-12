import { withTimestamps } from "../sql";
import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createType("post_type")
    .asEnum(["REVISION", "POST"])
    .execute();
  await db.schema
    .createType("post_status")
    .asEnum(["DRAFT", "PUBLISHED", "ARCHIVED"])
    .execute();

  await db.schema
    .createTable("posts")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("title", "varchar(512)", (col) => col.notNull())
    .addColumn("excerpt", "text")
    .addColumn("content", "text")
    .addColumn("parent_id", "integer", (col) =>
      col.references("posts.id").onDelete("set null").defaultTo(null)
    )
    .addColumn("author_id", "integer", (col) =>
      col.references("users.id").onDelete("set null")
    )
    .addColumn("organization_id", "integer", (col) =>
      col.references("organizations.id").onDelete("set null")
    )
    .addColumn("type", sql`"post_type"`, (col) =>
      col.notNull().defaultTo("POST")
    )
    .addColumn("status", sql`"post_status"`, (col) =>
      col.notNull().defaultTo("DRAFT")
    )
    .addColumn("metadata", "json")
    .$call(withTimestamps)
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropType("post_type").execute();
  await db.schema.dropType("post_status").execute();
  await db.schema.dropTable("posts").execute();
}
