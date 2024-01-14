import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";
import { FileRow, FileTable } from "./model";

export const createFileCrudRepository = (db: SqlDatabase) =>
  createCrudRepository<FileTable>(db, "files");

export async function findByModelNameAndModelId(
  db: SqlDatabase,
  modelName: string,
  modelId: number
): Promise<FileRow[]> {
  return db
    .selectFrom("files")
    .selectAll()
    .where("modelName", "=", modelName)
    .where("modelId", "=", modelId)
    .execute();
}
export async function deleteByModelNameAndModelId(
  db: SqlDatabase,
  modelName: string,
  modelId: number
) {
  return db
    .deleteFrom("files")
    .where("modelName", "=", modelName)
    .where("modelId", "=", modelId)
    .executeTakeFirst();
}
