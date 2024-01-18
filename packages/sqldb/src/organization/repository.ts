import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";
import { OrganizationRow, OrganizationTable } from "./model";

export const createOrganizationCrudRepository = (db: SqlDatabase) =>
  createCrudRepository<OrganizationTable>(db, "organizations");

export const getOrganizationBySlug = (
  db: SqlDatabase,
  slug: string
): Promise<OrganizationRow | undefined> => {
  return db
    .selectFrom("organizations")
    .selectAll()
    .where("slug", "=", slug)
    .executeTakeFirst();
};
