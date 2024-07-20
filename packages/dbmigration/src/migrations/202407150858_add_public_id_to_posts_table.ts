import { type Kysely, sql } from "kysely";
import Sqids from "sqids";

const sqids = new Sqids({
  alphabet: "abcdefghijklmnopqrstuvwxyz",
});

export const encodeId = (id: number) => {
  return sqids.encode([id]);
};

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable("posts")
    .addColumn("public_id", "varchar(12)", (col) => col.unique())
    .execute();

  const idResults = await db
    .selectFrom("posts")
    .select("id")
    .where("public_id", "is", null)
    .execute();

  const updateSql = idResults
    .map(
      ({ id }) =>
        `update posts set public_id = '${encodeId(id)}' where id = ${id}`
    )
    .join(";\n");

  await sql.raw(`${updateSql};`).execute(db);

  await db.schema
    .createIndex("posts_public_id")
    .on("posts")
    .column("public_id")
    .execute();

  await db.schema
    .alterTable("posts")
    .alterColumn("public_id", (col) => col.setNotNull())
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.alterTable("posts").dropColumn("public_id").execute();
}
