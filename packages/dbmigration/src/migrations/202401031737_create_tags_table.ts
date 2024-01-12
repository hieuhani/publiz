import { withTimestamps } from "../sql";
import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createType("tag_type")
    .asEnum(["SYSTEM", "DEFAULT"])
    .execute();

  await db.schema
    .createTable("tags")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar(512)", (col) => col.notNull())
    .addColumn("slug", "varchar(512)", (col) => col.notNull().unique())
    .addColumn("type", sql`"tag_type"`, (col) =>
      col.notNull().defaultTo("DEFAULT")
    )
    .$call(withTimestamps)
    .execute();

  await db.schema
    .createTable("posts_tags")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("post_id", "integer", (col) => col.references("posts.id"))
    .addColumn("tag_id", "integer", (col) => col.references("tags.id"))
    .$call(withTimestamps)
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable("posts_tags").execute();
  await db.schema.dropTable("tags").execute();
}
