import { withTimestamps } from "../sql";
import type { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable("organization_roles")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar(155)", (col) => col.notNull())
    .addColumn("organization_id", "integer", (col) =>
      col.references("organizations.id").notNull()
    )
    .$call(withTimestamps)
    .execute();

  await db.schema
    .createIndex("organization_roles_name_organization_id_unique")
    .on("organization_roles")
    .columns(["name", "organization_id"])
    .unique()
    .execute();

  await db.schema
    .createIndex("organization_roles_organization_id")
    .on("organization_roles")
    .columns(["organization_id"])
    .execute();

  await db.schema
    .createTable("organizations_users")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("organization_id", "integer", (col) =>
      col.references("organizations.id").notNull()
    )
    .addColumn("user_id", "integer", (col) =>
      col.references("users.id").notNull()
    )
    .addColumn("organization_role_id", "integer", (col) =>
      col.references("organization_roles.id")
    )
    .$call(withTimestamps)
    .execute();

  await db.schema
    .createIndex("organizations_users_organization_id")
    .on("organizations_users")
    .columns(["organization_id"])
    .execute();

  await db.schema
    .createIndex("organizations_users_user_id")
    .on("organizations_users")
    .columns(["user_id"])
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropIndex("organizations_users_user_id").execute();
  await db.schema.dropIndex("organizations_users_organization_id").execute();
  await db.schema.dropIndex("organization_roles_organization_id").execute();
  await db.schema
    .dropIndex("organization_roles_name_organization_id_unique")
    .execute();
  await db.schema.dropTable("organizations_users").execute();
  await db.schema.dropTable("organization_roles").execute();
}
