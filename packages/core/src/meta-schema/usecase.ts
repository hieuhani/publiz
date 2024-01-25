import {
  type InsertableMetaSchemaRow,
  type UpdateableMetaSchemaRow,
  createMetaSchemaCrudRepository,
  findMetaSchemasByOrganizationId,
  findSystemMetaSchemas as findSystemMetaSchemasRepo,
  updateIsDefaultValueAllMetaSchemasByOrganizationIdTarget,
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

export const findSystemMetaSchemas = async (container: Container) => {
  return findSystemMetaSchemasRepo(container.sqlDb);
};

type SetDefaultMetaSchemaForOrganizationByTargetInput = {
  organizationId: number | null;
  metaSchemaId: number;
};

export const setDefaultMetaSchemaForOrganizationByTarget = async (
  container: Container,
  {
    organizationId,
    metaSchemaId,
  }: SetDefaultMetaSchemaForOrganizationByTargetInput
) => {
  const metaSchema = await createMetaSchemaCrudRepository(
    container.sqlDb
  ).findById(metaSchemaId);
  if (metaSchema.organizationId !== organizationId) {
    throw new Error(
      "This schema is not belong to this organization and target"
    );
  }
  return container.sqlDb.transaction().execute(async (trx) => {
    await updateIsDefaultValueAllMetaSchemasByOrganizationIdTarget(
      trx,
      organizationId,
      metaSchema.target,
      false
    );
    return createMetaSchemaCrudRepository(trx).update(metaSchemaId, {
      isDefault: true,
    });
  });
};

export const getMetaSchemaById = async (container: Container, id: number) => {
  return createMetaSchemaCrudRepository(container.sqlDb).findById(id);
};
