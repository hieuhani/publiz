import { Generated, Insertable, Selectable, Updateable } from "kysely";

export type CollectionPostTable = {
  id: Generated<number>;
  collectionId: number;
  postId: number;
  updatedAt?: string;
};

export type CollectionPostRow = Selectable<CollectionPostTable>;
export type InsertableCollectionPostRow = Insertable<CollectionPostTable>;
export type UpdateableCollectionPostRow = Updateable<CollectionPostTable>;
