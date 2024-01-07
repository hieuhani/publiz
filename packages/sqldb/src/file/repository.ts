import { createCrudRepository } from "../crud";
import { SqlDatabase } from "../database";
import { FileRow, FileTable } from "./model";

export function createFileRepository(db: SqlDatabase) {
  return {
    ...createCrudRepository<FileTable>(db, "files"),
    async findByModelNameAndModelId(
      modelName: string,
      modelId: number
    ): Promise<FileRow> {
      return db
        .selectFrom("files")
        .selectAll()
        .where("modelName", "=", modelName)
        .where("modelId", "=", modelId)
        .executeTakeFirstOrThrow();
    },
  };
}
