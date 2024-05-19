import { Generated, Insertable, Selectable, Updateable } from "kysely";

export type ReactionPostTable = {
  id: Generated<number>;
  reactionId: number;
  postId: number;
  userId: number;
};

export type ReactionPostRow = Selectable<ReactionPostTable>;
export type InsertableReactionPostRow = Insertable<ReactionPostTable>;
export type UpdateableReactionPostRow = Updateable<ReactionPostTable>;
