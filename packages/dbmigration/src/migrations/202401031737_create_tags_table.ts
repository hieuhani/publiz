import { enumSql, withMySqlV8, withTimestamps } from "../sql";
import type { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable("tags")
    .addColumn("id", "bigint", (col) =>
      col.unsigned().autoIncrement().primaryKey()
    )
    .addColumn("name", "varchar(512)", (col) => col.notNull())
    .addColumn("slug", "varchar(512)", (col) => col.notNull().unique())
    .addColumn("type", enumSql("SYSTEM", "DEFAULT"), (col) =>
      col.notNull().defaultTo("DEFAULT")
    )
    .$call(withTimestamps)
    .$call(withMySqlV8)
    .execute();

  await db.schema
    .createTable("posts_tags")
    .addColumn("id", "bigint", (col) =>
      col.unsigned().autoIncrement().primaryKey()
    )
    .addColumn("post_id", "bigint", (col) => col.references("posts.id"))
    .addColumn("tag_id", "bigint", (col) => col.references("tags.id"))
    .$call(withTimestamps)
    .$call(withMySqlV8)
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable("posts_tags").execute();
  await db.schema.dropTable("tags").execute();
}
