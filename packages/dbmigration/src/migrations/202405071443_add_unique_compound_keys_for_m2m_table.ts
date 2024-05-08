import { type Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createIndex("posts_tags_post_id_tag_id_uniq")
    .on("posts_tags")
    .columns(["post_id", "tag_id"])
    .unique()
    .execute();

  await db.schema
    .createIndex("collections_posts_collection_id_post_id_uniq")
    .on("collections_posts")
    .columns(["collection_id", "post_id"])
    .unique()
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropIndex("posts_tags_post_id_tag_id_uniq").execute();
  await db.schema
    .dropIndex("collections_posts_collection_id_post_id_uniq")
    .execute();
}
