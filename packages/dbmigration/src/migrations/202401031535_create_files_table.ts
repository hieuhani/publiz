import { withTimestamps } from "../sql";
import type { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable("files")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("model_name", "varchar(100)")
    .addColumn("model_id", "integer")
    .addColumn("content_type", "varchar(32)", (col) => col.notNull())
    .addColumn("file_name", "varchar(255)", (col) => col.notNull())
    .addColumn("file_path", "text", (col) => col.notNull())
    .addColumn("metadata", "json")
    .$call(withTimestamps)
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable("files").execute();
}
