import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable("posts")
    .addColumn("meta_schema", "varchar(255)", (col) =>
      col.notNull().defaultTo("")
    )
    .execute();

  await db.schema
    .createIndex("posts_meta_schema")
    .on("posts")
    .column("meta_schema")
    .execute();

  const result = await sql
    .raw<{
      id: number;
      schema: string;
    }>(
      `select p.id, concat(case when o.slug is not null then concat(o.slug, '/') else '' end, ms.name,':', ms.version) as schema
        from posts p
        join meta_schemas ms on ms.id = COALESCE(p.metadata->>'metaSchemaId', '0')::integer
        left join organizations o on ms.organization_id = o.id`
    )
    .execute(db);

  const updateSql = result.rows
    .map(
      (row) =>
        `update posts set meta_schema = '${row.schema}' where id = ${row.id}`
    )
    .join(";\n");

  await sql.raw(`${updateSql};`).execute(db);
}

export async function down(db: Kysely<any>) {
  await db.schema.alterTable("posts").dropColumn("meta_schema").execute();
}
