import {
  type InsertableTagRow,
  type UpdateableTagRow,
  createTagCrudRepository,
  getTagByIdAndUserId,
  findSystemTags as findSystemTagsRepo,
  getOrganizationTagById as getOrganizationTagByIdRepo,
  findTagsByOrganizationId as findTagsByOrganizationIdRepo,
  findTagsByTaxonomyId as findTagsByTaxonomyIdRepo,
  findOrganizationAvailableTags as findOrganizationAvailableTagsRepo,
} from "@publiz/sqldb";
import { Container } from "../container";

type CreateTagInput = InsertableTagRow;

export const createTag = async (container: Container, input: CreateTagInput) =>
  createTagCrudRepository(container.sqlDb).create(input);

export const bulkCreateTags = async (
  container: Container,
  records: CreateTagInput[]
) => {
  return container.sqlDb.transaction().execute(async (trx) => {
    return createTagCrudRepository(trx).createMulti(records);
  });
};

type UpdateTagInput = UpdateableTagRow;

export const updateTag = async (
  container: Container,
  id: number,
  input: UpdateTagInput
) => createTagCrudRepository(container.sqlDb).update(id, input);

export const getTags = async (container: Container) =>
  createTagCrudRepository(container.sqlDb).find();

export const getTagById = async (container: Container, id: number) =>
  createTagCrudRepository(container.sqlDb).findById(id);

export const deleteTagById = async (container: Container, id: number) =>
  createTagCrudRepository(container.sqlDb).delete(id);

export const getMyTagById = async (
  container: Container,
  userId: number,
  tagId: number
) => {
  return getTagByIdAndUserId(container.sqlDb, tagId, userId);
};

export const getOrganizationTagById = async (
  container: Container,
  organizationId: number,
  id: number
) => {
  return getOrganizationTagByIdRepo(container.sqlDb, organizationId, id);
};

export const findSystemTags = async (container: Container) =>
  findSystemTagsRepo(container.sqlDb);

export const findTagsByIds = async (container: Container, ids: number[]) =>
  createTagCrudRepository(container.sqlDb).findByIds(ids);

export const findTagsByTaxonomyId = async (
  container: Container,
  taxonomyId: number
) => {
  return findTagsByTaxonomyIdRepo(container.sqlDb, taxonomyId);
};

export const findTagsByOrganizationId = async (
  container: Container,
  organizationId: number
) => {
  return findTagsByOrganizationIdRepo(container.sqlDb, organizationId);
};

export const findOrganizationAvailableTags = async (
  container: Container,
  organizationId: number
) => {
  return findOrganizationAvailableTagsRepo(container.sqlDb, organizationId);
};
