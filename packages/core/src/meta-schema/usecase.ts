import {
  type InsertableMetaSchemaRow,
  type UpdateableMetaSchemaRow,
  createMetaSchemaCrudRepository,
  findMetaSchemasByOrganizationId,
} from "@publiz/sqldb";
import { Container } from "../container";

type GetOrganizationMetaSchemas = {
  organizationId: number;
};

export const findOrganizationMetaSchemas = async (
  container: Container,
  { organizationId }: GetOrganizationMetaSchemas
) => {
  return findMetaSchemasByOrganizationId(container.sqlDb, organizationId);
};

type CreateMetaSchemaInput = InsertableMetaSchemaRow;

export const createMetaSchema = async (
  container: Container,
  input: CreateMetaSchemaInput
) => {
  return createMetaSchemaCrudRepository(container.sqlDb).create(input);
};

export const deleteMetaSchemaById = async (container: Container, id: number) =>
  createMetaSchemaCrudRepository(container.sqlDb).delete(id);

type UpdateMetaSchemaInput = UpdateableMetaSchemaRow;

export const updateMetaSchema = async (
  container: Container,
  id: number,
  input: UpdateMetaSchemaInput
) => {
  return createMetaSchemaCrudRepository(container.sqlDb).update(id, input);
};
