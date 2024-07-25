import { type Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable("files")
    .alterColumn("content_type", (col) => col.setDataType("varchar(100)"))
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema
    .alterTable("files")
    .alterColumn("content_type", (col) => col.setDataType("varchar(32)"))
    .execute();
}
