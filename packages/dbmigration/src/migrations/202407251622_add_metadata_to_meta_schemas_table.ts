import { type Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable("meta_schemas")
    .addColumn("metadata", "jsonb", (col) => col.notNull().defaultTo("{}"))
    .execute();

  await db.schema
    .createIndex("meta_schemas_metadata_gin")
    .on("meta_schemas")
    .column("metadata")
    .using("gin")
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropIndex("meta_schemas_metadata_gin").execute();
  await db.schema.alterTable("meta_schemas").dropColumn("metadata").execute();
}
