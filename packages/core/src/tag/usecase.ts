import {
  type InsertableTagRow,
  createTagCrudRepository,
  UpdateableTagRow,
  getTagByIdAndUserId,
} from "@publiz/sqldb";
import { Container } from "../container";

type CreateTagInput = InsertableTagRow;

export const createTag = async (container: Container, input: CreateTagInput) =>
  createTagCrudRepository(container.sqlDb).create(input);

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
