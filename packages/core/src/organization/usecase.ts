import {
  type InsertableOrganizationRow,
  type UpdateableOrganizationRow,
  createOrganizationCrudRepository,
  getOrganizationBySlug as getOrganizationBySlugRepo,
  createOrganizationRoleCrudRepository,
  createOrganizationUserCrudRepository,
} from "@publiz/sqldb";
import { Container } from "../container";

type GetOrganizationBySlug = {
  slug: string;
};

export const getOrganizationBySlug = async (
  container: Container,
  { slug }: GetOrganizationBySlug
) => {
  return getOrganizationBySlugRepo(container.sqlDb, slug);
};

type CreateOrganizationInput = InsertableOrganizationRow;

export const createOrganization = async (
  container: Container,
  input: CreateOrganizationInput
) => {
  return container.sqlDb.transaction().execute(async (trx) => {
    const newOrganization =
      await createOrganizationCrudRepository(trx).create(input);
    const organizationRoleAdmin = await createOrganizationRoleCrudRepository(
      trx
    ).create({
      organizationId: newOrganization.id,
      name: "Administrator",
    });
    await createOrganizationUserCrudRepository(trx).create({
      organizationId: newOrganization.id,
      userId: input.ownerId,
      organizationRoleId: organizationRoleAdmin.id,
    });

    return newOrganization;
  });
};

export const deleteOrganizationById = async (
  container: Container,
  id: number
) => createOrganizationCrudRepository(container.sqlDb).delete(id);

type UpdateOrganizationInput = UpdateableOrganizationRow;

export const updateOrganization = async (
  container: Container,
  id: number,
  input: UpdateOrganizationInput
) => {
  return createOrganizationCrudRepository(container.sqlDb).update(id, input);
};

export const getOrganizations = async (container: Container) =>
  createOrganizationCrudRepository(container.sqlDb).find();
