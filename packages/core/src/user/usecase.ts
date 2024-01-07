import { findUserByAuthId } from "@publiz/sqldb";
import { Container } from "../container";

type GetMyProfileInput = {
  authId: string;
};
export const getMyProfile = async (
  container: Container,
  { authId }: GetMyProfileInput
) => {
  const user = await findUserByAuthId(container.sqlDb, authId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
