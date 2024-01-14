import { deleteByModelNameAndModelId } from "@publiz/sqldb";
import { Container } from "../container";

type DeleteModelRelatedFilesInput = {
  modelName: string;
  modelId: number;
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
