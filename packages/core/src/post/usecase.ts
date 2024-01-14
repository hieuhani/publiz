import {
  type InsertablePostRow,
  createUserCrudRepository,
  getPostByIdAndUserId,
  UpdateablePostRow,
} from "@publiz/sqldb";
import { Container } from "../container";

type CreatePostInput = InsertablePostRow;
export const createPost = async (
  container: Container,
  input: CreatePostInput
) => createUserCrudRepository(container.sqlDb).create(input);

export const getMyPostById = async (
  container: Container,
  userId: number,
  postId: number
) => {
  return getPostByIdAndUserId(container.sqlDb, postId, userId);
};

type UpdatePostInput = UpdateablePostRow;
export const updatePost = async (
  container: Container,
  id: number,
  input: UpdatePostInput
) => createUserCrudRepository(container.sqlDb).update(id, input);
