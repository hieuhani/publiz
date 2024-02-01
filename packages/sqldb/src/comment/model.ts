import { Generated, Insertable, Selectable, Updateable } from "kysely";

export type CommentTable = {
  id: Generated<number>;
  content: string;
  parentId?: number;
  authorId: number;
  target: string;
  targetId: number;
  metadata: any;
};

export type CommentRow = Selectable<CommentTable>;
export type InsertableCommentRow = Insertable<CommentTable>;
export type UpdateableCommentRow = Updateable<CommentTable>;
