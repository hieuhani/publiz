export const makePublicEntity = <T extends { id: number; publicId: string }>({
  id,
  publicId,
  ...entity
}: T): Omit<T, "id" | "publicId"> & { id: string } => {
  return {
    ...entity,
    id: publicId,
  };
};
