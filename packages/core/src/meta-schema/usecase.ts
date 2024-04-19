import {
  type InsertableMetaSchemaRow,
  type UpdateableMetaSchemaRow,
  createMetaSchemaCrudRepository,
  findMetaSchemasByOrganizationId,
  findSystemMetaSchemas as findSystemMetaSchemasRepo,
  getOrganizationMetaSchemaById as getOrganizationMetaSchemaByIdRepo,
  updateIsDefaultValueAllMetaSchemasByOrganizationIdTarget,
} from "@publiz/sqldb";
import { Container } from "../container";
import { MetaSchema } from "./model";
import { extractMetaSchemaIdentifier } from "./utils";
import { getOrganizationBySlug } from "../organization";

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

/**
 *
 * @param container
 * @param identifier meta schema identity. It can be `name:version` for system meta schema level or with namespace `organization/name:version`
 * @returns
 */
export const getMetaSchemaByIdentifier = async (
  container: Container,
  identifier: string
): Promise<MetaSchema> => {
  const [part1, part2] = identifier.split("/");
  // when part2 is not exist, it means it is system level meta schema
  if (!part2) {
    const { name, version } = extractMetaSchemaIdentifier(part1);

    return container.sqlDb
      .selectFrom("meta_schemas")
      .selectAll()
      .where("name", "=", name)
      .where("version", "=", +version)
      .executeTakeFirstOrThrow();
  }

  const organizationSlug = part1;
  const organization = await getOrganizationBySlug(container, {
    slug: organizationSlug,
  });
  const { name, version } = extractMetaSchemaIdentifier(part2);

  return container.sqlDb
    .selectFrom("meta_schemas")
    .selectAll()
    .where("organizationId", "=", organization?.id)
    .where("name", "=", name)
    .where("version", "=", version)
    .executeTakeFirstOrThrow();
};

export const getOrganizationMetaSchemaById = async (
  container: Container,
  organizationId: number,
  id: number
) => {
  return getOrganizationMetaSchemaByIdRepo(container.sqlDb, organizationId, id);
};
