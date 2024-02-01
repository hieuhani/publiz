import { withTimestamps } from "../sql";
import { type Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable("comments")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("content", "text", (col) => col.notNull())
    .addColumn("parent_id", "integer", (col) => col.references("comments.id"))
    .addColumn("author_id", "integer", (col) =>
      col.references("users.id").notNull()
    )
    .addColumn("target", "varchar(16)", (col) => col.notNull())
    .addColumn("target_id", "integer", (col) => col.notNull())
    .addColumn("metadata", "jsonb")
    .$call(withTimestamps)
    .execute();

  await db.schema
    .createIndex("comments_metadata_gin")
    .on("comments")
    .column("metadata")
    .using("gin")
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropIndex("comments_metadata_gin").execute();
  await db.schema.dropTable("comments").execute();
}
