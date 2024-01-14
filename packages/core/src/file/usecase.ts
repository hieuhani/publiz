import {
  InsertableFileRow,
  createFileCrudRepository,
  deleteByModelNameAndModelId,
} from "@publiz/sqldb";
import { Container } from "../container";

type DeleteModelRelatedFilesInput = {
  modelName: string;
  modelId: string;
};

export const deleteModelRelatedFiles = async (
  container: Container,
  { modelName, modelId }: DeleteModelRelatedFilesInput
) => {
  const result = await deleteByModelNameAndModelId(
    container.sqlDb,
    modelName,
    modelId
  );
  return result.numDeletedRows;
};

type CreateFileInput = InsertableFileRow;

export const createFile = async (
  container: Container,
  input: CreateFileInput
) => createFileCrudRepository(container.sqlDb).create(input);
