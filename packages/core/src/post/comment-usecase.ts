import { CreateCommentInput, createComment } from "../comment";
import { Container } from "../container";

type CreatePostCommentInput = Omit<
  CreateCommentInput,
  "target" | "targetId"
> & {
  postId: number;
};

export const createPostComment = async (
  container: Container,
  { postId, ...input }: CreatePostCommentInput
) => {
  return createComment(container, {
    ...input,
    target: "post",
    targetId: postId,
  });
};
