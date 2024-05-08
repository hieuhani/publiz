import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createType("collection_type")
    .asEnum(["SYSTEM", "DEFAULT"])
    .execute();

  await db.schema
    .alterTable("collections")
    .addColumn("type", sql`"collection_type"`, (col) =>
      col.defaultTo("DEFAULT")
    )
    .addColumn("organization_id", "integer", (col) =>
      col.references("organizations.id")
    )
    .addColumn("slug", "varchar(512)", (col) => col.notNull().unique())
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema
    .alterTable("collections")
    .dropColumn("type")
    .dropColumn("organization_id")
    .dropColumn("slug")
    .execute();
  await db.schema.dropType("collection_type").execute();
}
