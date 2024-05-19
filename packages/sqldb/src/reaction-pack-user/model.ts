import { Generated, Insertable, Selectable, Updateable } from "kysely";

export type ReactionPackUserTable = {
  id: Generated<number>;
  reactionPackId?: number;
  userId: number;
};

export type ReactionPackUserRow = Selectable<ReactionPackUserTable>;
export type InsertableReactionPackUserRow = Insertable<ReactionPackUserTable>;
export type UpdateableReactionPackUserRow = Updateable<ReactionPackUserTable>;
