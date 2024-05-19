import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";
import { JsonValue } from "../kysely";
import { FileRow } from "./model";

export const createFileCrudRepository = (db: SqlDatabase) =>
  createCrudRepository(db, "files");

export async function findByModelNameAndModelId(
  db: SqlDatabase,
  modelName: string,
  modelId: string
): Promise<FileRow[]> {
  return db
    .selectFrom("files")
    .selectAll()
    .where("metadata", "@>", new JsonValue({ modelName, modelId }))
    .execute();
}
export async function deleteByModelNameAndModelId(
  db: SqlDatabase,
  modelName: string,
  modelId: string
) {
  return db
    .deleteFrom("files")
    .where("metadata", "@>", new JsonValue({ modelName, modelId }))
    .executeTakeFirst();
}
