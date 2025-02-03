import { type Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable("tags")
    .addColumn("description", "text", (col) => col.notNull().defaultTo(""))
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.alterTable("tags").dropColumn("description").execute();
}
