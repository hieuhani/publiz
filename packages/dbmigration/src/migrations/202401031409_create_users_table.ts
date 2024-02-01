import { withTimestamps } from "../sql";
import { type Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable("users")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("auth_id", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("display_name", "varchar(100)", (col) => col.notNull())
    .addColumn("avatar_url", "text")
    .addColumn("metadata", "jsonb")
    .$call(withTimestamps)
    .execute();

  await db.schema
    .createIndex("users_metadata_gin")
    .on("users")
    .column("metadata")
    .using("gin")
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropIndex("users_metadata_gin").execute();
  await db.schema.dropTable("users").execute();
}
