import {
  type InsertableOrganizationRow,
  type UpdateableOrganizationRow,
  createOrganizationCrudRepository,
  getOrganizationBySlug as getOrganizationBySlugRepo,
  createOrganizationRoleCrudRepository,
  createOrganizationUserCrudRepository,
  findOrganizationWorkingUsers as findOrganizationWorkingUsersRepo,
  findOrganizationRelatedTags as findOrganizationRelatedTagsRepo,
  findWorkingOrganizationsByUserId,
} from "@publiz/sqldb";
import { Container } from "../container";
import { getMetaSchemaById } from "../meta-schema";
import Ajv from "ajv";
import { AppError } from "../error";

const ajv = new Ajv();

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

export const getUserWorkingOrganizations = async (
  container: Container,
  userId: number
) => {
  return findWorkingOrganizationsByUserId(container.sqlDb, userId);
};

export const findOrganizationWorkingUsers = async (
  container: Container,
  organizationId: number
) => {
  return findOrganizationWorkingUsersRepo(container.sqlDb, organizationId);
};

export const getOrganizationById = async (
  container: Container,
  idOrSlug: number | string
) => {
  if (Number.isInteger(Number(idOrSlug))) {
    return createOrganizationCrudRepository(container.sqlDb).findById(
      +idOrSlug
    );
  }
  return getOrganizationBySlugRepo(container.sqlDb, idOrSlug + "");
};

export const findOrganizationRelatedTags = async (
  container: Container,
  idOrSlug: number | string
) => {
  let organizationId: number;
  if (Number.isInteger(Number(idOrSlug))) {
    organizationId = +idOrSlug;
  } else {
    const organization = await getOrganizationBySlugRepo(
      container.sqlDb,
      idOrSlug + ""
    );
    organizationId = organization.id;
  }

  return findOrganizationRelatedTagsRepo(container.sqlDb, organizationId);
};

export const patchOrganizationMetadataById = async (
  container: Container,
  organizationId: number,
  metadata: object,
  metaSchemaId?: number
) => {
  const organization = await getOrganizationById(container, organizationId);
  const newMetadata = { ...organization.metadata, ...metadata };
  if (metaSchemaId) {
    const metaSchema = await getMetaSchemaById(container, metaSchemaId);
    const validate = ajv.compile(metaSchema.schema);
    if (!validate(metadata)) {
      throw new AppError(400_102, "Invalid metadata", validate.errors);
    }
    newMetadata.metaSchemaId = metaSchemaId;
  }
  return updateOrganization(container, organizationId, {
    metadata: newMetadata,
  });
};
