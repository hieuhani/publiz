import { AppError, verifyOrganizationUserRole } from "@publiz/core";
import { MiddlewareHandler } from "hono";
import { getOrganizationIdFromCache } from "./lib";

export const useCheckOrganizationUser = (roleName = ""): MiddlewareHandler => {
  return async (c, next) => {
    let { organization_id: organizationId = "" } = c.req.param() as {
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
    const actualOrganizationId = await getOrganizationIdFromCache(
      container,
      organizationId
    );
    await verifyOrganizationUserRole(container, {
      organizationId: actualOrganizationId,
      userId: currentUser.id,
      roleName,
    });

    await next();
  };
};
