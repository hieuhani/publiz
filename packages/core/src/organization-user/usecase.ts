import { findOrganizationUsersByOrganizationIdAndUserId } from "@publiz/sqldb";
import { Container } from "../container";
import { AppError } from "../error";
import { findOrganizationRoles } from "../organization-role";

type VerifyOrganizationUserRoleInput = {
  organizationId: number;
  userId: number;
  roleName: string;
};

export const verifyOrganizationUserRole = async (
  container: Container,
  input: VerifyOrganizationUserRoleInput
) => {
  const organizationUsers =
    await findOrganizationUsersByOrganizationIdAndUserId(
      container.sqlDb,
      input.organizationId,
      input.userId
    );
  if (input.roleName) {
    const organizationRoles = await findOrganizationRoles(container, {
      organizationId: input.organizationId,
    });
    if (!organizationRoles.find((role) => role.name === input.roleName)) {
      throw new AppError(
        403_101,
        "Your role is not allowed to access this resource"
      );
    }
  }
  if (organizationUsers.length === 0) {
    throw new AppError(403_100, "Not found organization user");
  }
  return organizationUsers;
};
