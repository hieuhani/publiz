import { withTimestamps } from "../sql";
import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createType("user_gender")
    .asEnum(["UNSPECIFIED", "MALE", "FEMALE"])
    .execute();

  await db.schema
    .createTable("users")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("auth_id", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("display_name", "varchar(100)", (col) => col.notNull())
    .addColumn("dob", "date")
    .addColumn("bio", "text")
    .addColumn("avatar_url", "text")
    .addColumn("cover_url", "text")
    .addColumn("gender", sql`"user_gender"`, (col) =>
      col.notNull().defaultTo("UNSPECIFIED")
    )
    .$call(withTimestamps)
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropType("user_gender").execute();
  await db.schema.dropTable("users").execute();
}
