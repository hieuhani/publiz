import { withTimestamps } from "../sql";
import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createType("taxonomy_type")
    .asEnum(["SYSTEM", "DEFAULT"])
    .execute();

  await db.schema
    .createTable("taxonomies")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar(512)", (col) => col.notNull())
    .addColumn("slug", "varchar(512)", (col) => col.notNull().unique())
    .addColumn("type", sql`"taxonomy_type"`, (col) =>
      col.notNull().defaultTo("DEFAULT")
    )
    .addColumn("organization_id", "integer", (col) =>
      col.references("organizations.id")
    )
    .addColumn("user_id", "integer", (col) =>
      col.references("users.id").notNull()
    )
    .$call(withTimestamps)
    .execute();

  await db.schema
    .createIndex("taxonomies_organization_id")
    .on("taxonomies")
    .columns(["organization_id"])
    .execute();

  await db.schema
    .alterTable("tags")
    .addColumn("taxonomy_id", "integer")
    .execute();

  await db.schema
    .createIndex("tags_taxonomy_id")
    .on("tags")
    .columns(["taxonomy_id"])
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropType("taxonomy_type").execute();
  await db.schema.dropIndex("tags_taxonomy_id").on("tags").execute();
  await db.schema.alterTable("tags").dropColumn("taxonomy_id").execute();
  await db.schema
    .dropIndex("taxonomies_organization_id")
    .on("taxonomies")
    .execute();
  await db.schema.dropTable("taxonomies").execute();
}
