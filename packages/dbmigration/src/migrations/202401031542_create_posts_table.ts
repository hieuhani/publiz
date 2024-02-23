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
    .addColumn("excerpt", "text", (col) => col.notNull())
    .addColumn("content", "text", (col) => col.notNull().defaultTo(""))
    .addColumn("content_json", "jsonb", (col) => col.notNull().defaultTo("{}"))
    .addColumn("parent_id", "integer", (col) =>
      col.references("posts.id").onDelete("set null")
    )
    .addColumn("author_id", "integer", (col) =>
      col.references("users.id").notNull()
    )
    .addColumn("organization_id", "integer", (col) =>
      col.references("organizations.id")
    )
    .addColumn("type", sql`"post_type"`, (col) =>
      col.notNull().defaultTo("POST")
    )
    .addColumn("status", sql`"post_status"`, (col) =>
      col.notNull().defaultTo("DRAFT")
    )
    .addColumn("metadata", "jsonb")
    .$call(withTimestamps)
    .execute();

  await db.schema
    .createIndex("posts_metadata_gin")
    .on("posts")
    .column("metadata")
    .using("gin")
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropIndex("post_metadata_gin").execute();
  await db.schema.dropType("post_type").execute();
  await db.schema.dropType("post_status").execute();
  await db.schema.dropTable("posts").execute();
}
