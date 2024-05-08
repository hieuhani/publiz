import {
  type InsertableCollectionRow,
  type UpdateableCollectionRow,
  createCollectionCrudRepository,
  createCollectionPostCrudRepository,
  findSystemCollections as findSystemCollectionsRepo,
  getOrganizationCollectionById as getOrganizationCollectionByIdRepo,
  findCollectionsByOrganizationId as findCollectionsByOrganizationIdRepo,
  getCollectionBySlug,
} from "@publiz/sqldb";
import { Container } from "../container";

type CreateCollectionInput = InsertableCollectionRow;

export const createCollection = async (
  container: Container,
  input: CreateCollectionInput
) => createCollectionCrudRepository(container.sqlDb).create(input);

type UpdateCollectionInput = UpdateableCollectionRow;

export const updateCollection = async (
  container: Container,
  id: number,
  input: UpdateCollectionInput
) => createCollectionCrudRepository(container.sqlDb).update(id, input);

export const deleteCollectionById = async (container: Container, id: number) =>
  createCollectionCrudRepository(container.sqlDb).delete(id);

export const getOrganizationCollectionById = async (
  container: Container,
  organizationId: number,
  id: number
) => {
  return getOrganizationCollectionByIdRepo(container.sqlDb, organizationId, id);
};

export const findSystemCollections = async (container: Container) =>
  findSystemCollectionsRepo(container.sqlDb);

export const findCollectionsByOrganizationId = async (
  container: Container,
  organizationId: number
) => {
  return findCollectionsByOrganizationIdRepo(container.sqlDb, organizationId);
};

export const getCollectionById = async (
  container: Container,
  idOrSlug: number | string
) => {
  if (Number.isInteger(Number(idOrSlug))) {
    return createCollectionCrudRepository(container.sqlDb).findById(+idOrSlug);
  }
  return getCollectionBySlug(container.sqlDb, idOrSlug + "");
};

type AddPostToCollectionInput = {
  collectionId: number;
  postId: number;
};

export const addPostToCollection = async (
  container: Container,
  input: AddPostToCollectionInput
) => {
  return createCollectionPostCrudRepository(container.sqlDb).create({
    collectionId: input.collectionId,
    postId: input.postId,
  });
};
