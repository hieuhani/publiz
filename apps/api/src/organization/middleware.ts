import { AppError } from "@publiz/core";
import { verifyOrganizationUserRole } from "@publiz/core";
import { MiddlewareHandler } from "hono";

export const useCheckOrganizationUser = (roleName = ""): MiddlewareHandler => {
  return async (c, next) => {
    const { organization_id: organizationId = "" } = c.req.param() as {
      organization_id: string;
    };
    if (!organizationId) {
      throw new AppError(
        400_002,
        "Require to provide organization_id in route parameter"
      );
    }
    const currentUser = c.get("currentAppUser");
    const container = c.get("container");
    await verifyOrganizationUserRole(container, {
      organizationId: +organizationId,
      userId: currentUser.id,
      roleName,
    });

    await next();
  };
};
