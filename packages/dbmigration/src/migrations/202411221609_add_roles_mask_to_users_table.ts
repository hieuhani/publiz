import { type Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable("users")
    .addColumn("roles_mask", "smallint", (col) => col.notNull().defaultTo(1))
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.alterTable("users").dropColumn("roles_mask").execute();
}
