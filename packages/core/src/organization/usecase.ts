import {
  type InsertableOrganizationRow,
  createOrganizationCrudRepository,
  getOrganizationBySlug as getOrganizationBySlugRepo,
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
  return createOrganizationCrudRepository(container.sqlDb).create(input);
};

export const deleteOrganizationById = async (
  container: Container,
  id: number
) => createOrganizationCrudRepository(container.sqlDb).delete(id);

type UpdateOrganizationInput = InsertableOrganizationRow;

export const updateOrganization = async (
  container: Container,
  id: number,
  input: UpdateOrganizationInput
) => {
  return createOrganizationCrudRepository(container.sqlDb).update(id, input);
};

export const getOrganizations = async (container: Container) =>
  createOrganizationCrudRepository(container.sqlDb).find();
