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
    .addColumn("organization_id", "integer", (col) =>
      col.references("organizations.id")
    )
    .addColumn("parent_id", "integer", (col) =>
      col.references("tags.id").onDelete("set null")
    )
    .addColumn("user_id", "integer", (col) =>
      col.references("users.id").notNull()
    )
    .$call(withTimestamps)
    .execute();

  await db.schema
    .createTable("posts_tags")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("post_id", "integer", (col) =>
      col.references("posts.id").notNull()
    )
    .addColumn("tag_id", "integer", (col) =>
      col.references("tags.id").notNull()
    )
    .$call(withTimestamps)
    .execute();

  await db.schema
    .createIndex("posts_tags_post_id_tag_id_idx")
    .on("posts_tags")
    .columns(["post_id", "tag_id"])
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropType("tag_type").execute();
  await db.schema.dropTable("posts_tags").execute();
  await db.schema.dropTable("tags").execute();
}
