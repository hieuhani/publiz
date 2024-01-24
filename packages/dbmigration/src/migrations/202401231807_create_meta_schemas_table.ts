import { withTimestamps } from "../sql";
import type { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable("meta_schemas")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar(155)", (col) => col.notNull())
    .addColumn("target", "varchar(16)", (col) => col.notNull())
    .addColumn("is_default", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("schema", "jsonb", (col) => col.notNull())
    .addColumn("organization_id", "integer", (col) =>
      col.references("organizations.id")
    )
    .$call(withTimestamps)
    .execute();

  await db.schema
    .createIndex("meta_schemas_organization_id")
    .on("meta_schemas")
    .column("organization_id")
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable("meta_schemas").execute();
}
