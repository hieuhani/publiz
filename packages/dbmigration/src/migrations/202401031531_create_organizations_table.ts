import { withTimestamps } from "../sql";
import type { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable("organizations")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar(255)", (col) => col.notNull())
    .addColumn("slug", "varchar(255)", (col) => col.unique().notNull())
    .addColumn("description", "text", (col) => col.notNull().defaultTo(""))
    .addColumn("metadata", "jsonb")
    .addColumn("verified", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("owner_id", "integer", (col) =>
      col.references("users.id").onDelete("set null")
    )
    .$call(withTimestamps)
    .execute();

  await db.schema
    .createIndex("organizations_owner_id")
    .on("organizations")
    .column("owner_id")
    .execute();

  await db.schema
    .createIndex("organizations_metadata_gin")
    .on("organizations")
    .column("metadata")
    .using("gin")
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropIndex("organizations_metadata_gin").execute();
  await db.schema.dropIndex("organizations_owner_id").execute();
  await db.schema.dropTable("organizations").execute();
}
