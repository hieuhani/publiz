import { enumSql, withMySqlV8, withTimestamps } from "../sql";
import type { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable("users")
    .addColumn("id", "bigint", (col) =>
      col.unsigned().autoIncrement().primaryKey()
    )
    .addColumn("auth_id", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("display_name", "varchar(100)", (col) => col.notNull())
    .addColumn("dob", "date")
    .addColumn("bio", "text")
    .addColumn("avatar_url", "text")
    .addColumn("cover_url", "text")
    .addColumn("gender", enumSql("UNSPECIFIED", "MALE", "FEMALE"), (col) =>
      col.notNull().defaultTo("UNSPECIFIED")
    )
    .$call(withTimestamps)
    .$call(withMySqlV8)
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable("users").execute();
}
