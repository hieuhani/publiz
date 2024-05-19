import { Generated, Insertable, Selectable, Updateable } from "kysely";

export type ReactionTable = {
  id: Generated<number>;
  name: string;
  code: string;
  metadata: any;
  reactionPackId?: number;
};

export type ReactionRow = Selectable<ReactionTable>;
export type InsertableReactionRow = Insertable<ReactionTable>;
export type UpdateableReactionRow = Updateable<ReactionTable>;
