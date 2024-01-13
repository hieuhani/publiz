import { withTimestamps } from "../sql";
import type { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable("reaction_packs")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar(155)", (col) => col.notNull())
    .addColumn("description", "text")
    .addColumn("organization_id", "integer", (col) =>
      col.references("organizations.id")
    )
    .addColumn("user_id", "integer", (col) => col.references("users.id"))
    .$call(withTimestamps)
    .execute();

  await db.schema
    .createTable("reactions")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar(155)", (col) => col.notNull())
    .addColumn("reaction_pack_id", "integer", (col) =>
      col.references("reaction_packs.id").notNull()
    )
    .$call(withTimestamps)
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable("reactions").execute();
  await db.schema.dropTable("reaction_packs").execute();
}
