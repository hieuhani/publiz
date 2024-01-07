import { withMySqlV8, withTimestamps } from "../sql";
import type { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable("collections")
    .addColumn("id", "bigint", (col) =>
      col.unsigned().autoIncrement().primaryKey()
    )
    .addColumn("name", "varchar(512)", (col) => col.notNull())
    .addColumn("user_id", "bigint", (col) => col.references("users.id"))
    .$call(withTimestamps)
    .$call(withMySqlV8)
    .execute();

  await db.schema
    .createTable("collections_posts")
    .addColumn("id", "bigint", (col) =>
      col.unsigned().autoIncrement().primaryKey()
    )
    .addColumn("collection_id", "bigint", (col) =>
      col.references("collections.id")
    )
    .addColumn("post_id", "bigint", (col) => col.references("posts.id"))
    .$call(withTimestamps)
    .$call(withMySqlV8)
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable("collections_posts").execute();
  await db.schema.dropTable("collections").execute();
}
