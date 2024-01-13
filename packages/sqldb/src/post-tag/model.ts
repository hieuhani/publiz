import type { Generated, Insertable, Selectable, Updateable } from "kysely";

export type PostTagTable = {
  id: Generated<number>;
  postId: number;
  tagId: number;
};

export type PostTagRow = Selectable<PostTagTable>;
export type InsertablePostTagRow = Insertable<PostTagTable>;
export type UpdateablePostTagRow = Updateable<PostTagTable>;
