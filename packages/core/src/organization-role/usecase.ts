import {
  InsertableOrganizationRoleRow,
  UpdateableOrganizationRoleRow,
  createOrganizationRoleCrudRepository,
  findOrganizationRolesByOrganizationId,
} from "@publiz/sqldb";
import { Container } from "../container";

type GetOrganizationBySlug = {
  organizationId: number;
};

export const findOrganizationRoles = async (
  container: Container,
  { organizationId }: GetOrganizationBySlug
) => {
  return findOrganizationRolesByOrganizationId(container.sqlDb, organizationId);
};

type CreateOrganizationRoleInput = InsertableOrganizationRoleRow;

export const createOrganizationRole = async (
  container: Container,
  input: CreateOrganizationRoleInput
) => {
  return createOrganizationRoleCrudRepository(container.sqlDb).create(input);
};

export const deleteOrganizationRoleById = async (
  container: Container,
  id: number
) => createOrganizationRoleCrudRepository(container.sqlDb).delete(id);

type UpdateOrganizationInput = UpdateableOrganizationRoleRow;

export const updateOrganizationRole = async (
  container: Container,
  id: number,
  input: UpdateOrganizationInput
) => {
  return createOrganizationRoleCrudRepository(container.sqlDb).update(
    id,
    input
  );
};
