import { findCommentsByTargetAndTargetId } from "@publiz/sqldb";
import { CreateCommentInput, createComment } from "../comment";
import { Container } from "../container";

type CreatePostCommentInput = Omit<
  CreateCommentInput,
  "target" | "targetId"
> & {
  postId: number;
};

const POST_TARGET = "post";

export const createPostComment = async (
  container: Container,
  { postId, ...input }: CreatePostCommentInput
) => {
  return createComment(container, {
    ...input,
    target: POST_TARGET,
    targetId: postId,
  });
};

export const getPostComments = async (container: Container, postId: number) => {
  return findCommentsByTargetAndTargetId(container.sqlDb, POST_TARGET, postId);
};
