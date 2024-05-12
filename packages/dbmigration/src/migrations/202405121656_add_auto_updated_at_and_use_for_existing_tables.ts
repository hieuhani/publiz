import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await sql`
CREATE OR REPLACE FUNCTION auto_timestamps()
  RETURNS TRIGGER AS $$
  BEGIN
      NEW.updated_at = now();
      RETURN NEW;
  END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION create_updated_at_trigger(table_name text) RETURNS void AS $$
  BEGIN
      EXECUTE 'CREATE TRIGGER ' || table_name || '_updated_at BEFORE UPDATE ON ' || table_name || ' FOR EACH ROW EXECUTE PROCEDURE auto_timestamps()';
  END;
$$ LANGUAGE plpgsql;
  `.execute(db);

  await sql`
select create_updated_at_trigger('users');
select create_updated_at_trigger('organizations');
select create_updated_at_trigger('posts');
select create_updated_at_trigger('files');
select create_updated_at_trigger('comments');
select create_updated_at_trigger('tags');
select create_updated_at_trigger('posts_tags');
select create_updated_at_trigger('collections');
select create_updated_at_trigger('collections_posts');
select create_updated_at_trigger('reaction_packs');
select create_updated_at_trigger('reactions');
select create_updated_at_trigger('organization_roles');
select create_updated_at_trigger('organizations_users');
select create_updated_at_trigger('taxonomies');
select create_updated_at_trigger('meta_schemas');
  `.execute(db);
}

export async function down(db: Kysely<any>) {
  await sql`
DROP FUNCTION IF EXISTS create_updated_at_trigger(table_name text) CASCADE;
DROP FUNCTION IF EXISTS auto_timestamps() CASCADE;
  `.execute(db);
}
