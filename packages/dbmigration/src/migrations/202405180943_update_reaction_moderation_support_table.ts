import { sql, type Kysely } from "kysely";
import { withTimestamps } from "../sql";

export async function up(db: Kysely<any>) {
  await db.schema
    .createType("reaction_pack_type")
    .asEnum(["SYSTEM", "DEFAULT", "PRIVILEGE"])
    .execute();

  await db.schema
    .alterTable("reaction_packs")
    .addColumn("type", sql`"reaction_pack_type"`, (col) =>
      col.defaultTo("DEFAULT")
    )
    .addColumn("slug", "varchar(155)", (col) => col.notNull())
    .execute();

  await db.schema
    .createIndex("reaction_packs_slug_organization_id_uniq")
    .on("reaction_packs")
    .columns(["slug", "organization_id"])
    .nullsNotDistinct()
    .unique()
    .execute();

  await db.schema
    .createTable("reaction_packs_users")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("reaction_pack_id", "integer", (col) =>
      col.references("reaction_packs.id").notNull()
    )
    .addColumn("user_id", "integer", (col) =>
      col.references("users.id").notNull()
    )
    .$call(withTimestamps)
    .execute();

  await db.schema
    .createIndex("reaction_packs_users_reaction_pack_id_user_id_uniq")
    .on("reaction_packs_users")
    .columns(["reaction_pack_id", "user_id"])
    .unique()
    .execute();

  await db.schema
    .alterTable("reactions")
    .addColumn("metadata", "jsonb")
    .addColumn("code", "varchar(155)", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("reactions_posts")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("reaction_id", "integer", (col) =>
      col.references("reactions.id")
    )
    .addColumn("post_id", "integer", (col) => col.references("posts.id"))
    .addColumn("user_id", "integer", (col) => col.references("users.id"))
    .$call(withTimestamps)
    .execute();

  await db.schema
    .createIndex("reactions_posts_reaction_id_post_id_user_id_uniq")
    .on("reactions_posts")
    .columns(["reaction_id", "post_id", "user_id"])
    .unique()
    .execute();

  await db.schema
    .createIndex("reactions_reaction_pack_id_code_uniq")
    .on("reactions")
    .columns(["reaction_pack_id", "code"])
    .unique()
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema
    .dropIndex("reactions_posts_reaction_id_post_id_user_id_uniq")
    .execute();
  await db.schema.dropTable("reactions_posts").execute();

  await db.schema.dropIndex("reactions_reaction_pack_id_code_uniq").execute();

  await db.schema
    .alterTable("reactions")
    .dropColumn("metadata")
    .dropColumn("code")
    .execute();

  await db.schema
    .dropIndex("reaction_packs_users_reaction_pack_id_user_id_uniq")
    .execute();

  await db.schema.dropTable("reaction_packs_users").execute();

  await db.schema
    .dropIndex("reaction_packs_slug_organization_id_uniq")
    .execute();

  await db.schema
    .alterTable("reaction_packs")
    .dropColumn("type")
    .dropColumn("slug")
    .execute();

  await db.schema.dropType("reaction_pack_type").execute();
}
