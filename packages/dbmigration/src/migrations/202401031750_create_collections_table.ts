import { withTimestamps } from "../sql";
import type { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable("collections")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar(512)", (col) => col.notNull())
    .addColumn("user_id", "integer", (col) => col.references("users.id"))
    .$call(withTimestamps)
    .execute();

  await db.schema
    .createTable("collections_posts")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("collection_id", "integer", (col) =>
      col.references("collections.id")
    )
    .addColumn("post_id", "integer", (col) => col.references("posts.id"))
    .$call(withTimestamps)
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable("collections_posts").execute();
  await db.schema.dropTable("collections").execute();
}
