import { withTimestamps } from "../sql";
import type { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable("files")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("title", "varchar(512)")
    .addColumn("description", "text")
    .addColumn("content_type", "varchar(32)", (col) => col.notNull())
    .addColumn("file_name", "varchar(255)", (col) => col.notNull())
    .addColumn("file_path", "text", (col) => col.notNull())
    .addColumn("metadata", "jsonb")
    .addColumn("user_id", "integer", (col) =>
      col.references("users.id").notNull()
    )
    .$call(withTimestamps)
    .execute();

  await db.schema
    .createIndex("files_metadata_gin")
    .on("files")
    .column("metadata")
    .using("gin")
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropIndex("files_metadata_gin").execute();
  await db.schema.dropTable("files").execute();
}
