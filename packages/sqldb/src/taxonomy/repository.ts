import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";
import { TaxonomyRow } from "./model";

export const createTaxonomyCrudRepository = (db: SqlDatabase) =>
  createCrudRepository(db, "taxonomies");

export const findTaxonomiesByOrganizationId = async (
  db: SqlDatabase,
  organizationId: number
) => {
  return db
    .selectFrom("taxonomies")
    .selectAll()
    .where("organizationId", "=", organizationId)
    .execute();
};

export const findSystemTaxonomies = async (db: SqlDatabase) => {
  return db
    .selectFrom("taxonomies")
    .selectAll()
    .where("type", "=", "SYSTEM")
    .execute();
};

export const getTaxonomyBySlug = (
  db: SqlDatabase,
  slug: string
): Promise<TaxonomyRow> => {
  return db
    .selectFrom("taxonomies")
    .selectAll()
    .where("slug", "=", slug)
    .executeTakeFirstOrThrow();
};

export const getOrganizationTaxonomyById = async (
  db: SqlDatabase,
  organizationId: number,
  id: number
) => {
  return db
    .selectFrom("taxonomies")
    .selectAll()
    .where("organizationId", "=", organizationId)
    .where("id", "=", id)
    .executeTakeFirstOrThrow();
};
